import { describe, it, expect, beforeAll } from 'vitest';
import {
  fetchAPI,
  expectServerStructure,
  expectValidUUID,
  waitForServer,
} from '../../utils/api-helpers';

describe('v0 API - Server by ID Endpoint', () => {
  let validServerId: string | null = null;

  beforeAll(async () => {
    // Wait for the dev server to be ready
    const serverReady = await waitForServer();
    if (!serverReady) {
      throw new Error(
        'Development server is not running. Please start it with `npm run dev`',
      );
    }

    // Get a valid server ID for testing
    const response = await fetchAPI('/api/v0/servers?limit=1');
    if (response.ok && response.data.servers?.length > 0) {
      validServerId = response.data.servers[0].id;
    }
  }, 15000);

  describe('Successful Requests', () => {
    it('should return server details for valid server ID', async () => {
      if (!validServerId) {
        throw new Error('No valid server ID available for testing');
      }

      const response = await fetchAPI(`/api/v0/servers/${validServerId}`);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const server = response.data;
      expectServerStructure(server);
      expect(server.id).toBe(validServerId);

      // Check that we get a complete server object, not a list
      expect(server).not.toHaveProperty('servers');
      expect(server).not.toHaveProperty('metadata');
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for invalid UUID format', async () => {
      const response = await fetchAPI('/api/v0/servers/invalid-uuid-format');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        'Invalid server ID format. Must be a valid UUID.',
      );
      expect(response.data.details).toHaveProperty('server_id');
      expect(response.data.details.server_id).toContain('Invalid uuid');
    });

    it('should return 404 for non-existent server (valid UUID)', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';
      expectValidUUID(nonExistentId); // Verify it's a valid UUID format

      const response = await fetchAPI(`/api/v0/servers/${nonExistentId}`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(response.data.error).toBe('Server not found');
    });

    it('should return 400 for special characters in ID', async () => {
      const response = await fetchAPI('/api/v0/servers/abc-123-!@#');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        'Invalid server ID format. Must be a valid UUID.',
      );
    });

    it('should return 400 for very long string as ID', async () => {
      const longId = 'a'.repeat(100);
      const response = await fetchAPI(`/api/v0/servers/${longId}`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe(
        'Invalid server ID format. Must be a valid UUID.',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should fallback to servers list for empty server ID path', async () => {
      // When accessing /api/v0/servers/ (with trailing slash), it should hit the list endpoint
      const response = await fetchAPI('/api/v0/servers/');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      // Should return list format, not individual server format
      expect(response.data).toHaveProperty('servers');
      expect(response.data).toHaveProperty('metadata');
      expect(Array.isArray(response.data.servers)).toBe(true);
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data structure across multiple requests', async () => {
      if (!validServerId) {
        throw new Error('No valid server ID available for testing');
      }

      // Make multiple requests and ensure consistency
      const responses = await Promise.all([
        fetchAPI(`/api/v0/servers/${validServerId}`),
        fetchAPI(`/api/v0/servers/${validServerId}`),
        fetchAPI(`/api/v0/servers/${validServerId}`),
      ]);

      responses.forEach((response) => {
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
      });

      // All responses should have the same data
      const firstData = responses[0].data;
      responses.slice(1).forEach((response) => {
        expect(response.data.id).toBe(firstData.id);
        expect(response.data.name).toBe(firstData.name);
        expect(response.data.updated_at).toBe(firstData.updated_at);
      });
    });
  });
});
