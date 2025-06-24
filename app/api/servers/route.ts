import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  categories: z.string().optional(), // comma-separated
  authTypes: z.string().optional(), // comma-separated
  dynamicClientRegistration: z.enum(['true', 'false']).optional(),
  isOfficial: z.enum(['true', 'false']).optional(),
  q: z.string().optional(),
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

    const {
      page,
      limit,
      categories,
      authTypes,
      dynamicClientRegistration,
      isOfficial,
      q,
    } = validatedQuery.data;

    let queryBuilder = supabase
      .from('discoverable_mcp_servers')
      .select('*', { count: 'exact' })
      .eq('status', 'approved');

    // Multi-value filters
    if (categories) {
      const arr = categories
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length > 0) queryBuilder = queryBuilder.in('category', arr);
    }
    if (authTypes) {
      const arr = authTypes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length > 0)
        queryBuilder = queryBuilder.in('authentication_type', arr);
    }

    // Boolean filters
    if (dynamicClientRegistration) {
      queryBuilder = queryBuilder.eq(
        'dynamic_client_registration',
        dynamicClientRegistration === 'true',
      );
    }
    if (isOfficial) {
      queryBuilder = queryBuilder.eq('is_official', isOfficial === 'true');
    }

    // Search
    if (q) {
      const searchTerm = `%${q}%`;
      queryBuilder = queryBuilder.or(
        `name.ilike.${searchTerm},description.ilike.${searchTerm}`,
      );
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    // Query
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
