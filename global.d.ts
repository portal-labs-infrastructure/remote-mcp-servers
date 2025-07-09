import { Tables } from '@/types/supabase';

declare global {
  type DiscoverableMcpServer = Tables<'discoverable_mcp_servers'>;

  type ReviewWithProfile = Tables<'server_reviews'> & {
    profile: Tables<'profiles'>;
  };

  type BenchmarkSessionsWithClientInfo = Tables<'benchmark_sessions'> & {
    benchmark_runs: {
      clients: Tables<'clients'>;
    };
  };

  type BenchmarkRun = Tables<'benchmark_runs'>;
}
