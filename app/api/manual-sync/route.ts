import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Security: Check if user is authenticated and has admin privileges
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse request body to get sync type
    const body = await request.json().catch(() => ({}));
    const syncType = body.type || 'mcp-remotes'; // default to mcp-remotes

    // Admin check: Only allow specific users to trigger syncs
    const isAdmin = user.email?.includes('jesse@portal.one');

    if (!isAdmin) {
      console.log(`Non-admin user ${user.email} attempted to trigger sync`);
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 },
      );
    }

    console.log(
      `Manual ${syncType} sync triggered by admin user: ${user.email}`,
    );

    // Determine which API endpoint to call
    const syncPath =
      syncType === 'blockchain'
        ? '/api/sync-blockchain-complete'
        : '/api/sync-mcp-remotes';
    const syncName = syncType === 'blockchain' ? 'blockchain' : 'MCP remotes';

    console.log(`Calling ${syncPath}...`);

    try {
      // Get the CRON_SECRET to authenticate with the Python API
      const cronSecret = process.env.CRON_SECRET;

      if (!cronSecret) {
        throw new Error('CRON_SECRET not configured');
      }

      // Build the full URL for the Python API
      // Use the current request URL to construct the API endpoint
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const host = request.headers.get('host') || 'localhost:3000';
      const syncUrl = `${protocol}://${host}${syncPath}`;

      console.log(`Calling Python API at: ${syncUrl}`);

      // Call the Python API endpoint
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cronSecret}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error(`Non-JSON response received: ${textResponse.substring(0, 500)}`);
        throw new Error(`Python API returned non-JSON response (${response.status}): ${textResponse.substring(0, 200)}`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Sync failed');
      }

      console.log(`Manual ${syncName} sync completed successfully`);

      return NextResponse.json({
        success: true,
        message: `Manual ${syncName} sync completed successfully`,
        output: result.message || 'Sync completed',
        triggeredBy: user.email,
        syncType: syncType,
      });
    } catch (execError: unknown) {
      const errorMessage =
        execError instanceof Error ? execError.message : 'Unknown error';

      console.error(`Error executing ${syncName} sync:`, errorMessage);

      return NextResponse.json(
        {
          error: `${syncName} sync failed`,
          details: errorMessage,
          syncType: syncType,
        },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error('Unexpected error in manual sync endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
