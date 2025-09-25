import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE_URL = 'http://localhost:3000';

// Simple fetch wrapper for testing
async function testFetch(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const data = await response.json();
  return { response, data };
}

// Test helper to check if server is ready
async function isServerReady(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v0/servers?limit=1`);
    return response.ok;
  } catch {
    return false;
  }
}

describe('v0 API Integration Tests', () => {
  beforeAll(async () => {
    // Give some time for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if server is ready
    const ready = await isServerReady();
    if (!ready) {
      console.warn('⚠️  Server may not be ready. Some tests might fail.');
    }
  }, 10000);

  describe('Servers List Endpoint', () => {
    it('should return servers list', async () => {
      const { response, data } = await testFetch('/api/v0/servers?limit=5');

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('servers');
      expect(data).toHaveProperty('metadata');
      expect(Array.isArray(data.servers)).toBe(true);
      expect(data.metadata).toHaveProperty('count');
    });

    it('should validate limit parameter', async () => {
      const { response, data } = await testFetch('/api/v0/servers?limit=150');

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid query parameters');
    });

    it('should support search', async () => {
      const { response, data } = await testFetch(
        '/api/v0/servers?search=mcp&limit=3',
      );

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('servers');
      expect(Array.isArray(data.servers)).toBe(true);
    });
  });

  describe('Server by ID Endpoint', () => {
    let validServerId: string;

    beforeAll(async () => {
      // Get a valid server ID
      const { data } = await testFetch('/api/v0/servers?limit=1');
      if (data.servers && data.servers.length > 0) {
        validServerId = data.servers[0].id;
      }
    });

    it('should return server details for valid ID', async () => {
      if (!validServerId) {
        throw new Error('No valid server ID available');
      }

      const { response, data } = await testFetch(
        `/api/v0/servers/${validServerId}`,
      );

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name');
      expect(data.id).toBe(validServerId);
    });

    it('should return 400 for invalid UUID', async () => {
      const { response, data } = await testFetch(
        '/api/v0/servers/invalid-uuid',
      );

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        'Invalid server ID format. Must be a valid UUID.',
      );
    });

    it('should return 404 for non-existent server', async () => {
      const { response, data } = await testFetch(
        '/api/v0/servers/12345678-1234-1234-1234-123456789012',
      );

      expect(response.status).toBe(404);
      expect(data.error).toBe('Server not found');
    });
  });
});
