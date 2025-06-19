import { Tables } from '@/types/supabase';

declare global {
  type DiscoverableMcpServer = Tables<'discoverable_mcp_servers'>;
}
