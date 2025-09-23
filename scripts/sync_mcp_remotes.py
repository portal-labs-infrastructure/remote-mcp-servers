from datetime import datetime
import os
import requests
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# --- Configuration ---
load_dotenv()

# Official MCP Registry API endpoint
OFFICIAL_REGISTRY_URL = "https://registry.modelcontextprotocol.io/v0/servers"

# Your Supabase table name
SUPABASE_TABLE_NAME = (
    "discoverable_mcp_servers"  # Change this if your table is named differently
)

# --- Main Script Logic ---


def fetch_all_official_servers():
    """
    Fetches all servers from the official MCP registry, handling pagination.
    """
    servers = []
    next_cursor = None

    print("Starting fetch from official MCP registry...")

    while True:
        url = OFFICIAL_REGISTRY_URL
        if next_cursor:
            url += f"?cursor={next_cursor}"

        try:
            response = requests.get(url, headers={"Accept": "application/json"})
            response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
            data = response.json()

            new_servers = data.get("servers", [])
            servers.extend(new_servers)
            print(f"Fetched {len(new_servers)} servers. Total so far: {len(servers)}")

            next_cursor = data.get("metadata", {}).get("next_cursor")
            if not next_cursor:
                break  # No more pages

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from registry: {e}")
            return None

    print(f"Finished fetching. Total official servers found: {len(servers)}")
    return servers


def transform_server_data(official_server):
    """
    Transforms a single server object from the official schema to our Supabase schema.
    Returns None if it's not a remote server.
    """
    remotes = official_server.get("remotes")
    if not remotes or not isinstance(remotes, list) or len(remotes) == 0:
        return None

    full_namespace = official_server.get("name")
    if not full_namespace:
        return None  # Skip if the server has no name

    primary_remote = remotes[0]

    # --- Parse provider and server name from the namespace ---
    provider_name = None
    server_name_part = full_namespace

    if "/" in full_namespace:
        parts = full_namespace.split("/", 1)
        provider_name = parts[0]
        server_name_part = parts[1]

    # Create a more human-friendly name for display
    human_friendly_name = server_name_part.replace("-", " ").replace("_", " ").title()

    # --- NEW: Format the maintainer name from reverse domain to normal domain ---
    formatted_maintainer = provider_name
    if provider_name and "." in provider_name:
        domain_parts = provider_name.split(".")
        domain_parts.reverse()
        formatted_maintainer = ".".join(domain_parts)

    # --- Field Mapping ---
    transformed = {
        "official_id": full_namespace,
        "name": human_friendly_name,
        "description": official_server.get("description"),
        "mcp_url": primary_remote.get("url"),
        "is_official": True,
        "status": "approved",
        "documentation_url": official_server.get("website_url"),
        "maintainer_name": formatted_maintainer,  # Use the newly formatted name
        "maintainer_url": official_server.get("repository", {}).get("url"),
        "icon_url": f"https://remote-mcp-servers.com/logos/{full_namespace.replace('/', '-')}.png",
        "category": "Uncategorized",
        "authentication_type": "Unknown",
        "dynamic_client_registration": False,
        "ai_summary": None,
    }
    return transformed


def main():
    """
    Main function to run the sync process.
    """
    # 1. Initialize Supabase client
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file.")
        return

    supabase: Client = create_client(supabase_url, supabase_key)
    print("Supabase client initialized.")

    # 2. Fetch all servers from the official registry
    official_servers = fetch_all_official_servers()
    if official_servers is None:
        print("Aborting due to fetch error.")
        return

    # 3. De-duplicate the server list, keeping the best version
    print(f"De-duplicating {len(official_servers)} fetched servers...")
    unique_servers = {}
    for server in official_servers:
        name = server.get("name")
        if not name:
            continue  # Skip servers without a name

        # Helper to safely get nested metadata
        def get_meta(s):
            return s.get("_meta", {}).get(
                "io.modelcontextprotocol.registry/official", {}
            )

        current_meta = get_meta(server)

        if name not in unique_servers:
            unique_servers[name] = server
        else:
            # We have a duplicate, decide which one to keep
            existing_server = unique_servers[name]
            existing_meta = get_meta(existing_server)

            # Prioritize the one marked as 'is_latest'
            if current_meta.get("is_latest") and not existing_meta.get("is_latest"):
                unique_servers[name] = server  # Current one is better
                continue
            elif not current_meta.get("is_latest") and existing_meta.get("is_latest"):
                continue  # Existing one is better, do nothing

            # If 'is_latest' is the same (or missing), compare by 'updated_at'
            try:
                current_date = datetime.fromisoformat(
                    current_meta.get("updated_at", "").replace("Z", "+00:00")
                )
                existing_date = datetime.fromisoformat(
                    existing_meta.get("updated_at", "").replace("Z", "+00:00")
                )
                if current_date > existing_date:
                    unique_servers[name] = server  # Current one is newer
            except (ValueError, TypeError):
                # If dates are invalid or missing, just keep the first one we saw
                continue

    deduplicated_list = list(unique_servers.values())
    print(f"De-duplication complete. Found {len(deduplicated_list)} unique servers.")

    # 4. Filter for remote servers and transform data
    transformed_servers = []
    for server in deduplicated_list:
        transformed = transform_server_data(server)
        if transformed:
            transformed_servers.append(transformed)

    print(f"Found {len(transformed_servers)} remote servers to sync.")

    if not transformed_servers:
        print("No remote servers found to sync. Exiting.")
        return

    # 5. Upsert data into your Supabase table
    # NOTE: I changed your table name here to match the previous error log
    SUPABASE_TABLE_NAME = "discoverable_mcp_servers"
    print(
        f"Upserting {len(transformed_servers)} servers into '{SUPABASE_TABLE_NAME}' table..."
    )
    try:
        # And REPLACE it with this:
        response = (
            supabase.table(SUPABASE_TABLE_NAME)
            .upsert(
                transformed_servers,
                on_conflict="official_id",  # <-- Use the new unique ID column
            )
            .execute()
        )

        if response.data:
            print("Sync complete!")
        else:
            print("Sync might have had issues. Check your Supabase logs.")
            print("Response:", response)

    except Exception as e:
        print(f"An error occurred during Supabase upsert: {e}")


if __name__ == "__main__":
    main()
