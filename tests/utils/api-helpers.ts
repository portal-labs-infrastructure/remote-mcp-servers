// Test utilities for API testing
import { expect } from 'vitest';

export const API_BASE_URL = 'http://localhost:3000';

export interface TestResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<TestResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? undefined : data.error || 'Unknown error',
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: {} as T,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export function expectValidUUID(uuid: string) {
  expect(uuid).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
}

export function expectValidTimestamp(timestamp: string) {
  expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  expect(new Date(timestamp).getTime()).not.toBeNaN();
}

export function expectServerStructure(server: any) {
  expect(server).toHaveProperty('id');
  expect(server).toHaveProperty('name');
  expect(server).toHaveProperty('description');
  expect(server).toHaveProperty('status');
  expect(server).toHaveProperty('created_at');
  expect(server).toHaveProperty('updated_at');

  expectValidUUID(server.id);
  expectValidTimestamp(server.created_at);
  expectValidTimestamp(server.updated_at);
}

export function expectServersListResponse(data: any) {
  expect(data).toHaveProperty('servers');
  expect(data).toHaveProperty('metadata');
  expect(Array.isArray(data.servers)).toBe(true);
  expect(data.metadata).toHaveProperty('count');
  expect(typeof data.metadata.count).toBe('number');
}

// Helper to wait for server to be ready
export async function waitForServer(
  maxAttempts = 10,
  delay = 1000,
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v0/servers?limit=1`);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }

    if (i < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return false;
}
