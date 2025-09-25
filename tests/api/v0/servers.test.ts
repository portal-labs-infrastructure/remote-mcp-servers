import { describe, it, expect, beforeAll } from 'vitest';
import {
  fetchAPI,
  expectServersListResponse,
  expectServerStructure,
  waitForServer,
} from '../../utils/api-helpers';

describe('v0 API - Servers List Endpoint', () => {
  beforeAll(async () => {
    // Wait for the dev server to be ready
    const serverReady = await waitForServer();
    if (!serverReady) {
      throw new Error(
        'Development server is not running. Please start it with `npm run dev`',
      );
    }
  }, 15000);

  describe('Basic Functionality', () => {
    it('should return servers list with default pagination', async () => {
      const response = await fetchAPI('/api/v0/servers');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expectServersListResponse(response.data);
      expect(response.data.servers.length).toBeLessThanOrEqual(20); // default limit

      // Check first server structure if any exist
      if (response.data.servers.length > 0) {
        expectServerStructure(response.data.servers[0]);
      }
    });

    it('should respect custom limit parameter', async () => {
      const limit = 5;
      const response = await fetchAPI(`/api/v0/servers?limit=${limit}`);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expectServersListResponse(response.data);
      expect(response.data.servers.length).toBeLessThanOrEqual(limit);
      expect(response.data.metadata.count).toBe(response.data.servers.length);
    });

    it('should support search functionality', async () => {
      const response = await fetchAPI('/api/v0/servers?search=mcp&limit=10');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expectServersListResponse(response.data);

      // Verify search results contain the search term (case insensitive)
      if (response.data.servers.length > 0) {
        const hasSearchTerm = response.data.servers.some(
          (server: any) =>
            server.name?.toLowerCase().includes('mcp') ||
            server.description?.toLowerCase().includes('mcp'),
        );
        expect(hasSearchTerm).toBe(true);
      }
    });

    it('should support updated_since filter', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const response = await fetchAPI(
        `/api/v0/servers?updated_since=${yesterday.toISOString()}&limit=5`,
      );

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expectServersListResponse(response.data);

      // Verify all returned servers were updated after the specified date
      response.data.servers.forEach((server: any) => {
        const updatedAt = new Date(server.updated_at);
        expect(updatedAt.getTime()).toBeGreaterThanOrEqual(yesterday.getTime());
      });
    });
  });

  describe('Pagination', () => {
    it('should provide cursor for pagination when there are more results', async () => {
      const response = await fetchAPI('/api/v0/servers?limit=2');

      expect(response.ok).toBe(true);
      expectServersListResponse(response.data);

      // If there are more than 2 servers total, we should get a cursor
      if (response.data.servers.length === 2) {
        expect(response.data.metadata.next_cursor).toBeDefined();
        expect(typeof response.data.metadata.next_cursor).toBe('string');
      }
    });

    it('should support cursor-based pagination', async () => {
      // Get first page
      const firstPage = await fetchAPI('/api/v0/servers?limit=2');
      expect(firstPage.ok).toBe(true);

      if (firstPage.data.metadata?.next_cursor) {
        // Get second page using cursor
        const secondPage = await fetchAPI(
          `/api/v0/servers?limit=2&cursor=${firstPage.data.metadata.next_cursor}`,
        );

        expect(secondPage.ok).toBe(true);
        expectServersListResponse(secondPage.data);

        // Verify we got different servers
        const firstPageIds = firstPage.data.servers.map((s: any) => s.id);
        const secondPageIds = secondPage.data.servers.map((s: any) => s.id);

        const overlap = firstPageIds.filter((id: string) =>
          secondPageIds.includes(id),
        );
        expect(overlap.length).toBe(0); // No overlap between pages
      }
    });
  });

  describe('Input Validation', () => {
    it('should reject limit greater than 100', async () => {
      const response = await fetchAPI('/api/v0/servers?limit=150');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Invalid query parameters');
      expect(response.data.details.limit).toContain(
        'Number must be less than or equal to 100',
      );
    });

    it('should reject negative limit', async () => {
      const response = await fetchAPI('/api/v0/servers?limit=-5');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Invalid query parameters');
      expect(response.data.details.limit).toContain(
        'Number must be greater than or equal to 1',
      );
    });

    it('should reject invalid updated_since format', async () => {
      const response = await fetchAPI(
        '/api/v0/servers?updated_since=not-a-date',
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Invalid query parameters');
      expect(response.data.details.updated_since).toContain('Invalid datetime');
    });

    it('should reject invalid cursor', async () => {
      const response = await fetchAPI(
        '/api/v0/servers?cursor=invalid-cursor-data',
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('Invalid or malformed cursor');
    });
  });

  describe('Combined Parameters', () => {
    it('should handle multiple query parameters together', async () => {
      const response = await fetchAPI('/api/v0/servers?search=server&limit=3');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expectServersListResponse(response.data);
      expect(response.data.servers.length).toBeLessThanOrEqual(3);
    });
  });
});
