// test-servers-api.js
const BASE_URL = 'http://localhost:3000/api/servers'; // Adjust if your app runs on a different port/domain

async function fetchServers(queryParams = {}) {
  const url = new URL(BASE_URL);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  console.log(`\nFetching: ${url.toString()}`);
  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Error ${response.status}:`,
        data.error || data.message || 'Unknown error',
      );
      if (data.details) console.error('Details:', data.details);
      return { ok: false, status: response.status, data };
    }

    console.log('Response Status:', response.status);
    console.log('Total Items:', data.pagination?.totalItems);
    console.log('Total Pages:', data.pagination?.totalPages);
    console.log('Current Page:', data.pagination?.currentPage);
    console.log('Items on this page:', data.data?.length);
    // console.log('First item (if any):', data.data?.[0]);
    if (data.data?.length > 0) {
      console.log(
        'Sample item names:',
        data.data.slice(0, 3).map((s) => s.name),
      );
    }
    return { ok: true, status: response.status, data };
  } catch (error) {
    console.error('Fetch request failed:', error.message);
    return { ok: false, error };
  }
}

async function runTests() {
  console.log('--- Starting API Tests ---');

  // Test 1: Default pagination
  await fetchServers();

  // Test 2: Specific page and limit
  await fetchServers({ page: 1, limit: 5 });

  // Test 3: Filtering by category
  await fetchServers({ category: 'Productivity', limit: 2 }); // Replace with your data

  // Test 4: General query 'q' - matching name
  // Replace 'Asana' with a term expected in a server's name
  await fetchServers({ q: 'Asana', limit: 3 });

  // Test 5: General query 'q' - matching description
  // Replace 'team' with a term expected in a server's description
  await fetchServers({ q: 'team', limit: 3 });

  // Test 6: General query 'q' - matching either name or description
  // Replace 'manage' with a term that might be in either
  await fetchServers({ q: 'manage', limit: 3 });

  // Test 7: Filtering by is_official (true)
  await fetchServers({ is_official: true, limit: 2 });

  // Test 8: Filtering by authentication_type
  await fetchServers({ authentication_type: 'OAuth', limit: 2 }); // Replace with your data

  // Test 9: Combined filters with 'q'
  // Replace with your data
  await fetchServers({
    category: 'Project Management',
    is_official: true,
    q: 'Asa',
    limit: 2,
  });

  // Test 10: 'q' with no matches
  await fetchServers({ q: 'ThisExactPhraseShouldNotExist12345', limit: 2 });

  // Test 11: Page beyond total pages
  await fetchServers({ page: 999, limit: 10 });

  // Test 12: Invalid query parameter type (Zod should coerce or error)
  await fetchServers({ page: 'xyz', limit: 5 });

  // Test 13: Limit too high (should be capped by Zod)
  await fetchServers({ limit: 200 });

  console.log('\n--- API Tests Finished ---');
}

runTests();
