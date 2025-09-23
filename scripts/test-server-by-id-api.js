// test-server-by-id-api.js
const BASE_URL = 'http://localhost:3000/api/servers'; // Adjust if your app runs on a different port/domain

async function fetchServerById(serverId) {
  const url = `${BASE_URL}/${serverId}`;
  console.log(`\n--- Testing GET ${url} ---`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log(`✅ Success: Found server "${data.data?.name}"`);
      if (data.reviews && data.reviews.length > 0) {
        console.log(`📝 Reviews: ${data.reviews.length} found`);
      }
      if (data.meta) {
        console.log(
          `📊 Meta: ${data.meta.totalReviews} reviews, avg rating: ${data.meta.averageRating}`,
        );
      }
    } else {
      console.log(`❌ Error: ${data.error}`);
    }
  } catch (err) {
    console.error(`❌ Network error:`, err.message);
  }
}

async function runTests() {
  console.log('--- Starting Server by ID API Tests ---');

  // Test 1: Try to get a server (you'll need to replace this with an actual server ID from your database)
  // First, let's get a list of servers to find a valid ID
  try {
    console.log('\n--- Getting a server ID for testing ---');
    const response = await fetch(`${BASE_URL}?limit=1`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const validServerId = data.data[0].id;
      console.log(`Found server ID: ${validServerId}`);

      // Test with valid ID
      await fetchServerById(validServerId);
    } else {
      console.log('No servers found in database for testing');
    }
  } catch (err) {
    console.error('Failed to get test server ID:', err.message);
  }

  // Test 2: Invalid UUID format
  await fetchServerById('invalid-uuid');

  // Test 3: Valid UUID format but non-existent server
  await fetchServerById('12345678-1234-1234-1234-123456789012');
}

runTests();
