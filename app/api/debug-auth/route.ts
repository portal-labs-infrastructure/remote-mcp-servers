import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ 
        authenticated: false, 
        error: authError.message,
        timestamp: new Date().toISOString()
      });
    }
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'No user found',
        timestamp: new Date().toISOString()
      });
    }

    // Check admin status
    const isAdmin = user.email?.includes('jesse@portal.one') || 
                   user.email?.includes('portal-labs') ||
                   user.email?.includes('admin');

    return NextResponse.json({
      authenticated: true,
      isAdmin: isAdmin,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}