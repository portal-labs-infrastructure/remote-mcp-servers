from datetime import datetime, timezone
import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# --- Configuration ---
load_dotenv()

# --- API and Table Names ---
OFFICIAL_REGISTRY_URL = "https://registry.modelcontextprotocol.io/v0/servers"
SUPABASE_TABLE_NAME = "mcp_servers_v1"  # Your NEW spec-compliant table
# Namespace for your custom fields inside the 'meta' column.
# Using a reverse-domain format is a good practice.
CUSTOM_META_NAMESPACE = "com.remote-mcp-servers.metadata"


# --- Supabase Client Initialization ---
def init_supabase_client():
    """Initializes and returns the Supabase client."""
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError(
            "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file."
        )
    return create_client(supabase_url, supabase_key)


# --- Main Script Logic ---


def get_last_sync_timestamp(supabase: Client) -> str | None:
    """
    Queries our database to find the most recent 'updated_at' timestamp.
    This is the key to performing an incremental sync.
    """
    try:
        response = (
            supabase.table(SUPABASE_TABLE_NAME)
            .select("updated_at")
            .order("updated_at", desc=True)
            .limit(1)
            .execute()
        )
        if response.data:
            last_updated_at = response.data[0]["updated_at"]
            print(f"Last sync timestamp found in our DB: {last_updated_at}")
            return last_updated_at
        else:
            print("No existing data found. Will perform a full sync.")
            return None
    except Exception as e:
        print(f"Error fetching last sync timestamp: {e}. Proceeding with a full sync.")
        return None


def fetch_updated_servers(last_sync_timestamp: str | None):
    """
    Fetches servers from the official registry that have been updated since our last sync.
    Uses 'version=latest' to avoid manual de-duplication.
    """
    servers = []
    next_cursor = None

    params = {"version": "latest"}
    if last_sync_timestamp:
        params["updated_since"] = last_sync_timestamp

    print(f"Starting fetch from official registry with params: {params}")

    while True:
        try:
            paginated_params = params.copy()
            if next_cursor:
                paginated_params["cursor"] = next_cursor

            response = requests.get(
                OFFICIAL_REGISTRY_URL,
                params=paginated_params,
                headers={"Accept": "application/json"},
            )
            response.raise_for_status()
            data = response.json()

            new_servers = data.get("servers", [])
            servers.extend(new_servers)
            print(f"Fetched {len(new_servers)} servers. Total so far: {len(servers)}")

            next_cursor = data.get("metadata", {}).get("next_cursor")
            if not next_cursor:
                break

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from registry: {e}")
            return None

    print(f"Finished fetching. Total new/updated servers found: {len(servers)}")
    return servers


def transform_server_data(official_server: dict):
    """
    Transforms a single server object from the official schema to our new
    spec-compliant Supabase schema.
    """
    # The official metadata block is the source of truth for IDs and timestamps
    official_meta = official_server.get("_meta", {}).get(
        "io.modelcontextprotocol.registry/official", {}
    )
    server_id = official_meta.get("serverId")

    if not server_id:
        print(
            f"Skipping server with no serverId in _meta: {official_server.get('name')}"
        )
        return None

    # --- Create the custom metadata block for our app-specific fields ---
    # This is where all your old custom columns now live.
    full_namespace = official_server.get("name", "")
    server_name_part = full_namespace.split("/", 1)[-1]
    human_friendly_name = server_name_part.replace("-", " ").replace("_", " ").title()

    custom_meta_block = {
        "human_friendly_name": human_friendly_name,
        "icon_url": f"https://remote-mcp-servers.com/logos/{full_namespace.replace('/', '-')}.png",
        "is_official": True,
        "category": "Uncategorized",  # You can add more advanced logic here later
        "authentication_type": "Unknown",
        "dynamic_client_registration": False,
        "ai_summary": None,
    }

    # --- Combine official meta with our custom meta ---
    # Start with the full meta object from the source
    final_meta = official_server.get("_meta", {})
    # Add our custom data under its own safe namespace
    final_meta[CUSTOM_META_NAMESPACE] = custom_meta_block

    # --- Map to the new table schema ---
    transformed = {
        "id": server_id,
        "name": official_server.get("name"),
        "description": official_server.get("description"),
        "status": official_server.get("status", "active"),
        "latest_version": official_server.get("version"),
        "website_url": official_server.get("websiteUrl"),
        "repository": official_server.get("repository"),
        "packages": official_server.get("packages"),
        "remotes": official_server.get("remotes"),
        "meta": final_meta,
        "published_at": official_meta.get("publishedAt"),
        "updated_at": official_meta.get("updatedAt"),
    }
    return transformed


def main():
    """Main function to run the sync process."""
    try:
        supabase = init_supabase_client()
        print("Supabase client initialized.")

        # 1. Get the last sync time to fetch only new updates
        last_sync = get_last_sync_timestamp(supabase)

        # 2. Fetch new/updated servers from the official registry
        servers_to_sync = fetch_updated_servers(last_sync)
        if servers_to_sync is None:
            print("Aborting due to fetch error.")
            return
        if not servers_to_sync:
            print("No new server updates found. Sync complete.")
            return

        # 3. Transform data to our new schema
        transformed_servers = []
        for server in servers_to_sync:
            transformed = transform_server_data(server)
            if transformed:
                transformed_servers.append(transformed)

        if not transformed_servers:
            print("No valid servers to sync after transformation. Exiting.")
            return

        # 4. Upsert data into our new Supabase table
        print(
            f"Upserting {len(transformed_servers)} servers into '{SUPABASE_TABLE_NAME}' table..."
        )

        response = (
            supabase.table(SUPABASE_TABLE_NAME)
            .upsert(
                transformed_servers, on_conflict="id"
            )  # The primary key is now 'id'
            .execute()
        )

        # Supabase-py v1 returns data in a list, v2 returns an object with a data attribute
        data = getattr(response, "data", response)

        if data:
            print(f"Sync complete! {len(data)} rows were upserted.")
        else:
            # Check for errors if they exist on the response object
            error = getattr(response, "error", None)
            if error:
                print(f"Sync failed with error: {error}")
            else:
                print(
                    "Sync completed, but the response contained no data. This might be normal or indicate an issue."
                )
            print("Full Response:", response)

    except Exception as e:
        print(f"An unexpected error occurred during the sync process: {e}")


if __name__ == "__main__":
    main()
