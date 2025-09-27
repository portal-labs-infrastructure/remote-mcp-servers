import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Security: Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
      console.error('CRON_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('Unauthorized cron job request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting blockchain sync...');
    
    // Execute the Python blockchain sync script
    const scriptPath = path.join(process.cwd(), 'scripts', 'sync_blockchain_servers.py');
    
    try {
      const result = execSync(`python3 ${scriptPath}`, {
        encoding: 'utf8',
        timeout: 600000, // 10 minute timeout (blockchain calls can be slower)
        env: {
          ...process.env,
          // Ensure Python has access to environment variables
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      });
      
      console.log('Blockchain sync completed successfully');
      console.log('Script output:', result);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Blockchain sync completed successfully',
        output: result
      });
      
    } catch (execError: any) {
      console.error('Error executing blockchain sync script:', execError.message);
      console.error('Script stderr:', execError.stderr);
      
      return NextResponse.json({ 
        error: 'Blockchain sync script execution failed',
        details: execError.message,
        stderr: execError.stderr
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Unexpected error in blockchain sync endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Also handle POST requests (Vercel cron can send either GET or POST)
export async function POST(request: NextRequest) {
  return GET(request);
}