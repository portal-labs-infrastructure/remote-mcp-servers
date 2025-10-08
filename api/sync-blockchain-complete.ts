import type { VercelRequest, VercelResponse } from '@vercel/node';

// Note: We need to use dynamic imports for ES modules in Vercel's Node.js runtime
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Security: Only allow requests with the correct secret
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return res.status(500).json({ error: 'CRON_SECRET not configured' });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting complete blockchain sync...');

    // Dynamic import for ES modules
    const icJs = await import('@prometheus-protocol/ic-js');
    const { createClient } = await import('@supabase/supabase-js');
    const crypto = await import('crypto');

    const { getAppStoreListings, getAppDetailsByNamespace, configure } = icJs;

    // Configure the IC canister IDs
    configure({
      canisterIds: {
        MCP_REGISTRY: 'grhdx-gqaaa-aaaai-q32va-cai',
        MCP_ORCHESTRATOR: 'ez54s-uqaaa-aaaai-q32za-cai',
        USAGE_TRACKER: 'm63pw-fqaaa-aaaai-q33pa-cai',
      },
    });

    const SUPABASE_TABLE_NAME = 'mcp_servers_v1';
    const CUSTOM_META_NAMESPACE = 'org.prometheusprotocol.metadata';
    const BLOCKCHAIN_NAMESPACE_UUID = '02ffac85-92a0-4bb2-adf4-c715b3c93b0d';

    function uuidv5(namespace: string, name: string): string {
      const hash = crypto
        .createHash('sha1')
        .update(namespace + name)
        .digest('hex');
      return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
    }

    function transformServerData(serverData: any) {
      const namespace_string = serverData.namespace;
      if (!namespace_string) {
        console.log(
          `Skipping server with no namespace: ${serverData.name || 'unknown'}`,
        );
        return null;
      }

      const deterministic_id = uuidv5(
        BLOCKCHAIN_NAMESPACE_UUID,
        namespace_string,
      );

      const details = serverData.details || {};
      const latest_version_details = details.latestVersion || {};
      const build_info = latest_version_details.buildInfo || {};
      const repo_url = build_info.repoUrl;

      let repo_source = null;
      if (repo_url && repo_url.includes('github.com')) {
        repo_source = 'github';
      }

      const remote_url = latest_version_details.serverUrl;
      let remote_type = 'streamable-http';
      if (remote_url && remote_url.includes('sse')) {
        remote_type = 'sse';
      }

      const custom_meta_block = {
        human_friendly_name: serverData.name,
        icon_url: serverData.iconUrl,
        is_official: false,
        category: serverData.category,
        authentication_type: 'Unknown',
        dynamic_client_registration: false,
        ai_summary: null,
        publisher: serverData.publisher,
        wasm_id: latest_version_details.wasmId,
        security_tier: latest_version_details.securityTier,
        banner_url: serverData.bannerUrl,
      };

      const transformed = {
        id: deterministic_id,
        name: namespace_string,
        description: serverData.description,
        status:
          latest_version_details.status === 'Verified'
            ? 'active'
            : 'deprecated',
        latest_version: latest_version_details.versionString,
        website_url: null,
        repository:
          repo_url && repo_source
            ? { url: repo_url, source: repo_source }
            : null,
        packages: null,
        remotes: remote_url ? [{ url: remote_url, type: remote_type }] : [],
        meta: { [CUSTOM_META_NAMESPACE]: custom_meta_block },
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return transformed;
    }

    // Set the network environment
    process.env.DFX_NETWORK = 'ic';

    // 1. Fetch blockchain data
    console.log('Fetching blockchain data from Prometheus Protocol...');
    const listings = await getAppStoreListings();
    console.log(`Found ${listings.length} listings on-chain.`);

    const allServerDetails = [];

    for (const listing of listings) {
      console.log(`Fetching details for: ${listing.namespace}...`);
      const details = await getAppDetailsByNamespace(listing.namespace);

      if (details) {
        const combinedData = {
          ...listing,
          details: details,
        };
        allServerDetails.push(combinedData);
      } else {
        console.log(
          `Failed to fetch details for ${listing.namespace}. Skipping.`,
        );
      }
    }

    console.log(`Fetched ${allServerDetails.length} servers from blockchain.`);

    // 2. Transform data
    const transformedServers = allServerDetails
      .map(transformServerData)
      .filter((s) => s !== null);

    if (transformedServers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No valid servers to sync after transformation',
        serversProcessed: 0,
      });
    }

    console.log(`Transformed ${transformedServers.length} servers.`);

    // 3. Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized.');

    // 4. Upsert to Supabase
    console.log(
      `Upserting ${transformedServers.length} servers into '${SUPABASE_TABLE_NAME}' table...`,
    );

    const { data, error } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .upsert(transformedServers, { onConflict: 'id' });

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    console.log(`Sync complete! ${transformedServers.length} rows upserted.`);

    return res.status(200).json({
      success: true,
      message: 'Blockchain sync completed successfully',
      serversProcessed: transformedServers.length,
    });
  } catch (error) {
    console.error('Error in blockchain sync:', error);
    return res.status(500).json({
      error: 'Blockchain sync failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
