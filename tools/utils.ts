import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Zod schema for a single discoverable MCP server (used in tool output schemas)
// Adjust fields to accurately match your 'discoverable_mcp_servers' table
export const discoverableMcpServerSchema = z.object({
  id: z.string().uuid().describe('Unique identifier of the server.'),
  name: z.string().describe('Name of the server.'),
  description: z.string().describe('Description of the server.'),
  category: z
    .string()
    .describe("Category of the server (e.g., 'AI', 'Gaming')."),
  mcp_url: z.string().url().describe('Primary URL of the MCP server.'),
  authentication_type: z
    .string()
    .describe("Type of authentication supported (e.g., 'none', 'oauth')."),
  dynamic_client_registration: z
    .boolean()
    .describe('Indicates if dynamic client registration is supported.')
    .nullable(),
  documentation_url: z.string().describe('URL to the server documentation.'),
  maintainer_name: z.string().describe('Name of the server maintainer.'),
  maintainer_url: z
    .string()
    .url()
    .describe("URL to the server maintainer's profile or website."),
  icon_url: z.string().describe('URL to the server icon image.').nullable(),
  is_official: z
    .boolean()
    .describe('Indicates if the server is officially recognized.'),
  user_id: z
    .string()
    .uuid()
    .describe('User ID of the server maintainer.')
    .nullable(),
  status: z
    .string()
    .describe("Approval status of the server (e.g., 'approved')."),
  created_at: z
    .string()
    .describe('Timestamp of when the server record was created.'),
  updated_at: z
    .string()
    .describe('Timestamp of when the server record was last updated.')
    .optional(),
  average_rating: z
    .number()
    .describe('Average rating of the server.')
    .nullable(),
  ai_summary: z
    .string()
    .describe('AI-generated summary of the server.')
    .nullable(),
});

// Zod schema for the paginated response structure
export const paginatedServersSchema = z.object({
  data: z
    .array(discoverableMcpServerSchema)
    .describe('Array of server objects.'),
  pagination: z
    .object({
      currentPage: z
        .number()
        .int()
        .positive()
        .describe('The current page number.'),
      itemsPerPage: z
        .number()
        .int()
        .positive()
        .describe('Number of items per page.'),
      totalItems: z
        .number()
        .int()
        .nonnegative()
        .describe('Total number of items available.'),
      totalPages: z
        .number()
        .int()
        .nonnegative()
        .describe('Total number of pages.'),
      hasNextPage: z.boolean().describe('Indicates if there is a next page.'),
      hasPreviousPage: z
        .boolean()
        .describe('Indicates if there is a previous page.'),
    })
    .describe('Pagination details.'),
});

// Helper function to query Supabase for discoverable servers
export async function querySupabaseRegistry(params: {
  page: number;
  limit: number;
  filters?: {
    category?: string;
    is_official?: boolean;
    authentication_type?: string;
    q?: string; // General search query
  };
}) {
  const supabase = await createClient();
  const { page, limit, filters = {} } = params;

  let queryBuilder = supabase
    .from('discoverable_mcp_servers')
    .select('*', { count: 'exact' }) // Select all relevant fields
    .eq('status', 'approved'); // Always filter for approved servers

  // Apply specific filters
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

  // Apply general text query 'q' to search name AND description
  if (filters.q) {
    const searchTerm = `%${filters.q}%`;
    queryBuilder = queryBuilder.or(
      `name.ilike.${searchTerm},description.ilike.${searchTerm}`,
    );
  }

  // Pagination
  const offset = (page - 1) * limit;
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  // Ordering (default: newest first)
  queryBuilder = queryBuilder.order('created_at', { ascending: false });

  const { data: servers, error, count } = await queryBuilder;

  if (error) {
    console.error('Supabase query error in querySupabaseRegistry:', error);
    // This error will be caught by the tool's handler and formatted into CallToolResult.error
    throw new Error(`Database query failed: ${error.message}`);
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: servers,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
