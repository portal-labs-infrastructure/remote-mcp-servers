// Performance and load testing for v0 API
import { describe, it, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3000';

async function measureResponseTime(endpoint: string): Promise<number> {
  const start = performance.now();
  await fetch(`${API_BASE_URL}${endpoint}`);
  const end = performance.now();
  return end - start;
}

describe('v0 API Performance Tests', () => {
  it('should respond to servers list within reasonable time', async () => {
    const responseTime = await measureResponseTime('/api/v0/servers?limit=10');

    // Should respond within 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });

  it('should handle concurrent requests', async () => {
    const promises = Array.from({ length: 5 }, () =>
      fetch(`${API_BASE_URL}/api/v0/servers?limit=5`),
    );

    const responses = await Promise.all(promises);

    // All requests should succeed
    responses.forEach((response) => {
      expect(response.ok).toBe(true);
    });
  });

  it('should handle pagination efficiently', async () => {
    // Test multiple page requests
    const pageRequests = [
      fetch(`${API_BASE_URL}/api/v0/servers?limit=5`),
      fetch(`${API_BASE_URL}/api/v0/servers?limit=10`),
      fetch(`${API_BASE_URL}/api/v0/servers?limit=20`),
    ];

    const responses = await Promise.all(pageRequests);
    const data = await Promise.all(responses.map((r) => r.json()));

    // Verify pagination works correctly
    expect(data[0].servers.length).toBeLessThanOrEqual(5);
    expect(data[1].servers.length).toBeLessThanOrEqual(10);
    expect(data[2].servers.length).toBeLessThanOrEqual(20);
  });
});
