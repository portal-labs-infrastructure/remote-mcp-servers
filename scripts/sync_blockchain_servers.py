import os
import json
import subprocess
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# --- Configuration ---
load_dotenv()

SUPABASE_TABLE_NAME = "mcp_servers_v1"
# Use a different namespace for blockchain-sourced metadata
CUSTOM_META_NAMESPACE = "org.prometheusprotocol.metadata"

# NEW: A constant, hardcoded UUID to act as a namespace for our deterministic UUIDs.
# This ensures that all UUIDs generated from blockchain namespaces are unique and consistent.
# You can generate your own once using `print(uuid.uuid4())` and paste it here.
BLOCKCHAIN_NAMESPACE_UUID = uuid.UUID("02ffac85-92a0-4bb2-adf4-c715b3c93b0d")


def init_supabase_client():
    """Initializes and returns the Supabase client."""
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL and Key must be set in .env")
    return create_client(supabase_url, supabase_key)


def fetch_blockchain_data():
    """
    Executes the Node.js wrapper script to fetch all server data from the blockchain.
    Returns the parsed JSON data.
    """
    print("Starting Node.js script to fetch blockchain data...")
    try:
        # We use 'node' to run the .mjs file.
        process = subprocess.run(
            ["node", "scripts/fetch_blockchain_data.mjs"],
            capture_output=True,
            text=True,
            check=True,  # This will raise an exception if the script exits with an error
            encoding="utf-8",
        )
        print("Node.js script finished successfully.")
        # The JSON output is in stdout
        return json.loads(process.stdout)
    except subprocess.CalledProcessError as e:
        print("Error executing Node.js script:")
        print("Stderr:", e.stderr)
        raise e
    except json.JSONDecodeError as e:
        print("Failed to parse JSON output from Node.js script.")
        raise e


def transform_server_data(server_data: dict):
    """
    Transforms a single server object from the blockchain schema to our
    spec-compliant Supabase schema.
    """

    namespace_string = server_data.get("namespace")
    if not namespace_string:
        print(f"Skipping server with no namespace: {server_data.get('name')}")
        return None

    # --- FIXED: Generate a deterministic UUID for the primary key ---
    # We use uuid.uuid5 to ensure the same namespace always results in the same UUID.
    # This is critical for the 'upsert' operation to work correctly.
    deterministic_id = str(uuid.uuid5(BLOCKCHAIN_NAMESPACE_UUID, namespace_string))

    details = server_data.get("details", {})
    latest_version_details = details.get("latestVersion", {})
    build_info = latest_version_details.get("buildInfo", {})
    repo_url = build_info.get("repoUrl")

    # Determine repository source (e.g., 'github')
    repo_source = None
    if repo_url and "github.com" in repo_url:
        repo_source = "github"

    # Determine remote type
    remote_url = latest_version_details.get("serverUrl")
    remote_type = "streamable-http"
    if remote_url and "sse" in remote_url:
        remote_type = "sse"

    # Construct the custom metadata block
    custom_meta_block = {
        "human_friendly_name": server_data.get("name"),
        "icon_url": server_data.get("iconUrl"),
        "is_official": False,  # These are from a community source, not the official MCP registry
        "category": server_data.get("category"),
        "authentication_type": "Unknown",  # This info isn't available from the source
        "dynamic_client_registration": False,
        "ai_summary": None,
        # Add blockchain-specific metadata for our own use
        "publisher": server_data.get("publisher"),
        "wasm_id": server_data.get("latestVersion", {}).get("wasmId"),
        "security_tier": server_data.get("latestVersion", {}).get("securityTier"),
        "banner_url": server_data.get("bannerUrl"),
    }

    transformed = {
        "id": deterministic_id,
        "name": namespace_string,  # Use the stable namespace as the reverse-DNS name
        "description": server_data.get("description"),
        "status": (
            "active"
            if server_data.get("latestVersion", {}).get("status") == "Verified"
            else "deprecated"
        ),
        "latest_version": server_data.get("latestVersion", {}).get("versionString"),
        "website_url": None,  # Not available in the source data
        "repository": (
            {"url": repo_url, "source": repo_source}
            if repo_url and repo_source
            else None
        ),
        "packages": None,  # These are remote servers
        "remotes": [{"url": remote_url, "type": remote_type}] if remote_url else [],
        "meta": {CUSTOM_META_NAMESPACE: custom_meta_block},
        # Use current time as these are not provided by the source
        "published_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    return transformed


def main():
    """Main function to run the sync process."""
    try:
        supabase = init_supabase_client()
        print("Supabase client initialized.")

        # 1. Fetch all data from the blockchain via the Node.js script
        all_servers_data = fetch_blockchain_data()
        if not all_servers_data:
            print("No servers found from the blockchain source. Exiting.")
            return

        print(f"Fetched {len(all_servers_data)} total servers from the blockchain.")

        # 2. Transform data to our schema
        transformed_servers = []
        for server in all_servers_data:
            transformed = transform_server_data(server)
            if transformed:
                transformed_servers.append(transformed)

        if not transformed_servers:
            print("No valid servers to sync after transformation. Exiting.")
            return

        # 3. Upsert data into our Supabase table
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

    except Exception as e:
        print(f"An unexpected error occurred during the sync process: {e}")


if __name__ == "__main__":
    main()
