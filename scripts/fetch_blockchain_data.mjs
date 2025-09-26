import {
  getAppStoreListings,
  getAppDetailsByNamespace,
  configure,
} from '@prometheus-protocol/ic-js';
import { inspect } from 'util';

// Helper to prevent circular reference issues when stringifying BigInts
const replacer = (key, value) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

process.env.DFX_NETWORK = 'ic';

configure({
  canisterIds: {
    MCP_REGISTRY: 'grhdx-gqaaa-aaaai-q32va-cai',
    MCP_ORCHESTRATOR: 'ez54s-uqaaa-aaaai-q32za-cai',
    USAGE_TRACKER: 'm63pw-fqaaa-aaaai-q33pa-cai',
  },
});

async function fetchAllData() {
  try {
    // 1. Get the list of all apps
    const listings = await getAppStoreListings();
    console.error(`Found ${listings.length} listings on-chain.`); // Log progress to stderr

    const allServerDetails = [];

    // 2. For each listing, fetch its detailed information
    for (const listing of listings) {
      console.error(`Fetching details for: ${listing.namespace}...`);
      const details = await getAppDetailsByNamespace(listing.namespace);

      if (details) {
        // Combine the listing info with the detailed info
        const combinedData = {
          ...listing,
          details: details,
        };
        allServerDetails.push(combinedData);
      } else {
        console.error(
          `  -> Failed to fetch details for ${listing.namespace}. Skipping.`,
        );
      }
    }

    // 3. Output the final combined data as a single JSON string to stdout
    // This is what the Python script will capture.
    process.stdout.write(JSON.stringify(allServerDetails, replacer));
  } catch (error) {
    // Log errors to stderr so they don't pollute the JSON output
    console.error('An error occurred during blockchain data fetching:');
    console.error(inspect(error, { depth: null }));
    process.exit(1); // Exit with an error code
  }
}

fetchAllData();
