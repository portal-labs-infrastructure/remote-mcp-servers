import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the latest sync information from the database
    const { data: latestServer, error } = await supabase
      .from('mcp_servers_v1')
      .select('updated_at, name')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Get total count of servers
    const { count, error: countError } = await supabase
      .from('mcp_servers_v1')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (countError) {
      throw countError;
    }

    // Get counts by source
    const { count: officialCount } = await supabase
      .from('mcp_servers_v1')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .like('meta->>com.remote-mcp-servers.metadata', '%"is_official":true%');

    const { count: blockchainCount } = await supabase
      .from('mcp_servers_v1')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .contains('meta', { 'org.prometheusprotocol.metadata': {} });

    return NextResponse.json({
      status: 'healthy',
      totalServers: count || 0,
      officialServers: officialCount || 0,
      blockchainServers: blockchainCount || 0,
      lastSyncedServer: latestServer ? {
        name: latestServer.name,
        updatedAt: latestServer.updated_at
      } : null,
      systemTime: new Date().toISOString(),
      cronSchedules: {
        'mcp-remotes': '0 */6 * * *',   // Every 6 hours
        'blockchain': '30 */12 * * *',  // Every 12 hours at 30 minutes past
      },
    });

  } catch (error: any) {
    console.error('Error in sync status endpoint:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      systemTime: new Date().toISOString(),
    }, { status: 500 });
  }
}