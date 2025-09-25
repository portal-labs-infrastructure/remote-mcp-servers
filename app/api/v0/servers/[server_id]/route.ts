import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Schema to validate that the server_id is a UUID
const paramsSchema = z.object({
  server_id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ server_id: string }> },
) {
  const supabase = await createClient();

  try {
    const resolvedParams = await params;

    const validatedParams = paramsSchema.safeParse(resolvedParams);

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: 'Invalid server ID format. Must be a valid UUID.',
          details: validatedParams.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { server_id } = validatedParams.data;

    const { data: server, error } = await supabase
      .from('mcp_servers_v1')
      .select('*')
      .eq('id', server_id)
      .single(); // .single() returns one object, or an error if not exactly one is found

    if (error || !server) {
      // Supabase returns an error if .single() finds 0 rows
      console.error('Supabase fetch single error:', error);
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // The response is the server object itself, as per the spec
    return NextResponse.json(server);
  } catch (e) {
    const error = e as Error;
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 },
    );
  }
}
