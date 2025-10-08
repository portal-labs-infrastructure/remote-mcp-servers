import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getAppStoreListings,
  getAppDetailsByNamespace,
  configure,
} from '@prometheus-protocol/ic-js';

// Configure the IC canister IDs
configure({
  canisterIds: {
    MCP_REGISTRY: 'grhdx-gqaaa-aaaai-q32va-cai',
    MCP_ORCHESTRATOR: 'ez54s-uqaaa-aaaai-q32za-cai',
    USAGE_TRACKER: 'm63pw-fqaaa-aaaai-q33pa-cai',
  },
});

// Helper to prevent circular reference issues when stringifying BigInts
const replacer = (_key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

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
    console.log('Fetching blockchain data from Prometheus Protocol...');

    // Set the network environment
    process.env.DFX_NETWORK = 'ic';

    // 1. Get the list of all apps
    const listings = await getAppStoreListings();
    console.log(`Found ${listings.length} listings on-chain.`);

    const allServerDetails = [];

    // 2. For each listing, fetch its detailed information
    for (const listing of listings) {
      console.log(`Fetching details for: ${listing.namespace}...`);
      const details = await getAppDetailsByNamespace(listing.namespace);

      if (details) {
        // Combine the listing info with the detailed info
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

    console.log(
      `Successfully fetched ${allServerDetails.length} servers from blockchain`,
    );

    return res.status(200).json(
      JSON.parse(JSON.stringify(allServerDetails, replacer)),
    );
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    return res.status(500).json({
      error: 'Failed to fetch blockchain data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
