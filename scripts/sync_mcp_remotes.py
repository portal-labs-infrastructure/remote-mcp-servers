from datetime import datetime, timezone
import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# --- Configuration ---
load_dotenv()

# --- API and Table Names ---
OFFICIAL_REGISTRY_URL = "https://registry.modelcontextprotocol.io/v0/servers"
SUPABASE_TABLE_NAME = "mcp_servers_v1"
# This is correct for your registry's domain.
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
    """Queries our database to find the most recent 'updated_at' timestamp."""
    # Check if we should force a full sync via environment variable
    force_full_sync = os.getenv("FORCE_FULL_SYNC", "").lower() in ["true", "1", "yes"]
    
    if force_full_sync:
        print("FORCE_FULL_SYNC is enabled. Performing a full sync.")
        return None
    
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
    """Fetches all updated servers from the official registry."""
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
            # Fixed: API returns 'nextCursor' (camelCase), not 'next_cursor'
            next_cursor = data.get("metadata", {}).get("nextCursor")
            if not next_cursor:
                break
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from registry: {e}")
            return None
    print(f"Finished fetching. Total new/updated servers found: {len(servers)}")
    return servers


def transform_and_filter_server(official_server: dict):
    """
    Transforms a server object and filters out any that are not remote servers.
    Returns the transformed object or None if it should be skipped.
    """
    # The API response wraps the actual server data in a 'server' property
    server_data = official_server.get("server", {})
    
    # --- ADDED: Filter for remote servers ---
    # A server is only a "remote server" if it has a non-empty 'remotes' array.
    remotes = server_data.get("remotes")
    if not remotes or not isinstance(remotes, list) or len(remotes) == 0:
        print(
            f"  -> Skipping package-based server (no remotes): {server_data.get('name')}"
        )
        return None
    # --- END of filter logic ---

    official_meta = official_server.get("_meta", {}).get(
        "io.modelcontextprotocol.registry/official", {}
    )
    server_id = official_meta.get("serverId")
    if not server_id:
        print(
            f"  -> Skipping server with no serverId in _meta: {server_data.get('name')}"
        )
        return None

    full_namespace = server_data.get("name", "")
    server_name_part = full_namespace.split("/", 1)[-1]
    human_friendly_name = server_name_part.replace("-", " ").replace("_", " ").title()

    custom_meta_block = {
        "human_friendly_name": human_friendly_name,
        "icon_url": f"https://remote-mcp-servers.com/logos/{full_namespace.replace('/', '-')}.png",
        "is_official": True,
        "category": "Uncategorized",
        "authentication_type": "Unknown",
        "dynamic_client_registration": False,
        "ai_summary": None,
    }

    final_meta = official_server.get("_meta", {})
    final_meta[CUSTOM_META_NAMESPACE] = custom_meta_block

    # Sanitize status to prevent database constraint errors
    allowed_statuses = {"active", "deprecated"}
    raw_status = server_data.get("status")
    status = raw_status if raw_status in allowed_statuses else "active"
    if raw_status and raw_status not in allowed_statuses:
        print(
            f"  -> Warning: Server '{full_namespace}' has unsupported status '{raw_status}'. Defaulting to 'active'."
        )

    return {
        "id": server_id,
        "name": full_namespace,
        "description": server_data.get("description"),
        "status": status,
        "latest_version": server_data.get("version"),
        "website_url": server_data.get("websiteUrl"),
        "repository": server_data.get("repository"),
        "packages": server_data.get("packages"),
        "remotes": remotes,
        "meta": final_meta,
        "published_at": official_meta.get("publishedAt"),
        "updated_at": official_meta.get("updatedAt"),
    }


def main():
    """Main function to run the sync process."""
    try:
        supabase = init_supabase_client()
        print("Supabase client initialized.")

        last_sync = get_last_sync_timestamp(supabase)
        servers_to_process = fetch_updated_servers(last_sync)

        if servers_to_process is None:
            print("Aborting due to fetch error.")
            return
        if not servers_to_process:
            print("No new server updates found. Sync complete.")
            return

        print(
            f"\nFiltering {len(servers_to_process)} servers for remote connections..."
        )
        transformed_servers = []
        for server in servers_to_process:
            transformed = transform_and_filter_server(server)
            if transformed:
                transformed_servers.append(transformed)

        print(f"\nFound {len(transformed_servers)} remote servers to sync.")
        if not transformed_servers:
            print("No new remote servers to sync. Exiting.")
            return

        print(
            f"Upserting {len(transformed_servers)} servers into '{SUPABASE_TABLE_NAME}' table..."
        )
        response = (
            supabase.table(SUPABASE_TABLE_NAME)
            .upsert(transformed_servers, on_conflict="id")
            .execute()
        )

        data = getattr(response, "data", response)
        if data:
            print(f"Sync complete! {len(data)} rows were upserted.")
        else:
            error = getattr(response, "error", None)
            if error:
                print(f"Sync failed with error: {error}")
            else:
                print("Sync completed, but the response contained no data.")
            print("Full Response:", response)

    except Exception as e:
        print(f"An unexpected error occurred during the sync process: {e}")


if __name__ == "__main__":
    main()
