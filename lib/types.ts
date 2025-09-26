export interface LeaderboardEntry {
  client_id: string;
  client_name: string;
  client_version: string;
  highest_score: number;
  fastest_time_ms: number;
  total_runs: number;
  last_run_at: string;
}

// The types for our rubric-based scoring system
export interface ScorecardLineItem {
  description: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'PARTIAL' | 'SKIPPED';
  pointsEarned: number;
  maxPoints: number;
  notes?: string;
}

export interface Scorecard {
  [key: string]: ScorecardLineItem;
}

// src/lib/types.ts

// --- Shared Transformation Logic ---

// Helper to safely parse a field that might be a JSON string or already an object.
export function safeParseJson<T>(field: unknown): T | null {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch (e) {
      console.warn('Failed to parse JSON string:', field, e);
      return null;
    }
  }
  // If it's already an object (or null/undefined), return it as is.
  return (field as T) || null;
}

/**
 * Takes a raw server object from Supabase (where JSON fields might be strings)
 * and transforms it into a clean, typed SpecServerObject for the application.
 * @param rawServer The raw data object from the database.
 * @returns A clean SpecServerObject or null if the input is invalid.
 */
export function processRawServerData(
  rawServer: McpServer,
): SpecServerObject | null {
  if (!rawServer) return null;

  return {
    ...rawServer,
    meta: rawServer.meta ? safeParseJson<Meta>(rawServer.meta) : null,
    repository: safeParseJson<Repository>(rawServer.repository),
    packages: null,
    remotes: safeParseJson<Remote[]>(rawServer.remotes),
  };
}
