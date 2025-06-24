import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/servers/categories
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('unique_categories').select('*');

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Deduplicate and sort
  const categories = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean)),
  ).sort();

  return NextResponse.json({ categories });
}
