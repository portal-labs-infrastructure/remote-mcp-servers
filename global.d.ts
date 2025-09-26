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

  type McpServer = Tables<'mcp_servers_v1'>;

  type Meta = {
    'com.remote-mcp-servers.metadata': { [key: string]: any };
  };

  type SpecServerObject = Tables<'mcp_servers_v1'> & {
    repository: Repository | null;
    packages: null;
    remotes: Remote[] | null;
    meta: Meta | null;
  };

  type Repository = { url?: string; [key: string]: any };

  type Remote = {
    name: string;
    url: string;
    [key: string]: any;
  };
}
