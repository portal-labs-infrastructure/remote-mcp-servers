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
