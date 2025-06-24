import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/servers/auth-types
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('unique_authentication_types')
    .select('*');

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Deduplicate and sort
  const authTypes = Array.from(
    new Set(data.map((item) => item.authentication_type).filter(Boolean)),
  ).sort();

  return NextResponse.json({ authTypes });
}
