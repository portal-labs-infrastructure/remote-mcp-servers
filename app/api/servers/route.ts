import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Updated schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  q: z.string().optional(), // Changed 'name' to 'q' for general query
  is_official: z.enum(['true', 'false']).optional(),
  authentication_type: z.string().optional(),
  // Add other filterable fields as needed
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

    const { page, limit, ...filters } = validatedQuery.data;

    let queryBuilder = supabase
      .from('discoverable_mcp_servers')
      .select('*', { count: 'exact' })
      .eq('status', 'approved');

    // Apply filters
    if (filters.category) {
      queryBuilder = queryBuilder.eq('category', filters.category);
    }
    if (typeof filters.is_official === 'boolean') {
      queryBuilder = queryBuilder.eq('is_official', filters.is_official);
    }
    if (filters.authentication_type) {
      queryBuilder = queryBuilder.eq(
        'authentication_type',
        filters.authentication_type,
      );
    }

    // Apply general query 'q' to search name AND description
    if (filters.q) {
      const searchTerm = `%${filters.q}%`;
      // Use .or() to search in multiple columns
      // The format for .or() is a string of conditions, comma-separated.
      // Each condition is column.operator.value
      queryBuilder = queryBuilder.or(
        `name.ilike.${searchTerm},description.ilike.${searchTerm}`,
      );
    }

    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);
    queryBuilder = queryBuilder.order('created_at', { ascending: false });

    const { data: servers, error, count } = await queryBuilder;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch servers', details: error.message },
        { status: 500 },
      );
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: servers,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
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
