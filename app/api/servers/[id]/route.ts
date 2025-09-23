import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Validate that the ID is a valid UUID
const paramsSchema = z.object({
  id: z.string().uuid('Invalid server ID format'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();

  try {
    // Await the params since it's a Promise in newer Next.js versions
    const resolvedParams = await params;
    
    // Validate the ID parameter
    const validatedParams = paramsSchema.safeParse(resolvedParams);

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: 'Invalid server ID',
          details: validatedParams.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { id } = validatedParams.data;

    // Query the server by ID with only approved servers
    const { data: server, error } = await supabase
      .from('discoverable_mcp_servers')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Server not found' },
          { status: 404 },
        );
      }

      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch server', details: error.message },
        { status: 500 },
      );
    }

    // Fetch related reviews with profile information
    const { data: reviews, error: reviewsError } = await supabase
      .from('server_reviews')
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        updated_at,
        profiles!server_reviews_user_id_fkey1 (
          full_name,
          username,
          avatar_url
        )
      `,
      )
      .eq('server_id', id)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.warn('Failed to fetch reviews:', reviewsError);
    }

    return NextResponse.json({
      data: server,
      reviews: reviews || [],
      meta: {
        totalReviews: reviews?.length || 0,
        averageRating: server.average_rating,
      },
    });
  } catch (e) {
    const error = e as Error;
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 },
    );
  }
}
