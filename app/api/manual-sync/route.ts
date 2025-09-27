import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
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

    // Determine which script to run
    let scriptPath: string;
    let syncName: string;
    let timeout: number;

    if (syncType === 'blockchain') {
      scriptPath = path.join(
        process.cwd(),
        'scripts',
        'sync_blockchain_servers.py',
      );
      syncName = 'blockchain';
      timeout = 600000; // 10 minutes for blockchain
      console.log('Starting manual blockchain sync...');
    } else {
      scriptPath = path.join(process.cwd(), 'scripts', 'sync_mcp_remotes.py');
      syncName = 'MCP remotes';
      timeout = 300000; // 5 minutes for MCP remotes
      console.log('Starting manual MCP remotes sync...');
    }

    try {
      const result = execSync(`python3 ${scriptPath}`, {
        encoding: 'utf8',
        timeout: timeout,
        env: {
          ...process.env,
          // Ensure Python has access to environment variables
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      });

      console.log(`Manual ${syncName} sync completed successfully`);
      console.log('Script output:', result);

      return NextResponse.json({
        success: true,
        message: `Manual ${syncName} sync completed successfully`,
        output: result,
        triggeredBy: user.email,
        syncType: syncType,
      });
    } catch (execError: any) {
      console.error(
        `Error executing ${syncName} sync script:`,
        execError.message,
      );
      console.error('Script stderr:', execError.stderr);

      return NextResponse.json(
        {
          error: `${syncName} sync script execution failed`,
          details: execError.message,
          stderr: execError.stderr,
          syncType: syncType,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in manual sync endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
