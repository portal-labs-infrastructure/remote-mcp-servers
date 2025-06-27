import { Tables } from '@/types/supabase';

declare global {
  type DiscoverableMcpServer = Tables<'discoverable_mcp_servers'>;

  type ReviewWithProfile = Tables<'server_reviews'> & {
    profile: Tables<'profiles'>;
  };
}
