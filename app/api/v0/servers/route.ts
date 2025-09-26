import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Schema for query parameters, aligned with the generic & official registry spec
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  search: z.string().optional(), // Official registry extension
  updated_since: z.string().datetime().optional(), // Official registry extension
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  try {
    const validatedQuery = querySchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!validatedQuery.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validatedQuery.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { limit, cursor, search, updated_since } = validatedQuery.data;

    // We fetch `limit + 1` items to determine if there's a next page.
    const fetchLimit = limit + 1;

    let queryBuilder = supabase
      .from('mcp_servers_v1')
      .select('*')
      // Order by a stable, sequential column for cursor pagination.
      // Using a secondary unique key (id) prevents skipping items with the same timestamp.
      .order('updated_at', { ascending: false })
      .order('id', { ascending: false }) // Secondary sort for stability
      .limit(fetchLimit);

    // --- Apply Filters ---
    if (search) {
      // Case-insensitive search on name and description
      queryBuilder = queryBuilder.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    if (updated_since) {
      queryBuilder = queryBuilder.gte('updated_at', updated_since);
    }

    // --- Handle Cursor for Pagination ---
    if (cursor) {
      try {
        const decodedCursor = Buffer.from(cursor, 'base64').toString('ascii');
        const [lastUpdatedAt, lastId] = decodedCursor.split('_');

        if (!lastUpdatedAt || !lastId) throw new Error('Invalid cursor format');

        // Query for items that are "older" than the cursor
        queryBuilder = queryBuilder.or(
          `updated_at.lt.${lastUpdatedAt},and(updated_at.eq.${lastUpdatedAt},id.lt.${lastId})`,
        );
      } catch (e) {
        return NextResponse.json(
          {
            error: `Invalid or malformed cursor: ${e instanceof Error ? e.message : String(e)}`,
          },
          { status: 400 },
        );
      }
    }

    // --- Execute Query ---
    const { data: servers, error } = await queryBuilder;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch servers', details: error.message },
        { status: 500 },
      );
    }

    // --- Construct Response ---
    let nextCursor: string | null = null;
    if (servers.length === fetchLimit) {
      // We fetched one extra item, so we know there's a next page.
      // The last item is the cursor for the next page.
      const cursorItem = servers[limit - 1]; // The last item to be displayed

      // Create the cursor from the last item that will be displayed on the *current* page
      const cursorData = `${cursorItem.updated_at}_${cursorItem.id}`;
      nextCursor = Buffer.from(cursorData).toString('base64');

      // Remove the extra item from the response
      servers.pop();
    }

    // Format the response to match the spec
    return NextResponse.json({
      servers: servers,
      metadata: {
        count: servers.length,
        next_cursor: nextCursor,
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
