import { z } from 'zod';
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { querySupabaseRegistry, paginatedServersSchema } from './utils';

const inputSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .default(1)
    .describe('Page number for pagination, starting from 1.'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .describe('Number of items per page (max 100).'),
  category: z
    .string()
    .optional()
    .describe("Filter by server category (e.g., 'AI', 'Gaming')."),
  is_official: z
    .boolean()
    .optional()
    .describe(
      'Filter by official status (true for official, false for unofficial).',
    ),
  authentication_type: z
    .string()
    .optional()
    .describe("Filter by authentication type (e.g., 'none', 'oauth')."),
});

const outputSchema = paginatedServersSchema;

export default {
  name: 'list_servers',
  description:
    'Lists approved, discoverable MCP servers from the registry with pagination and optional filters. Data is read-only.',
  inputSchema,
  outputSchema, // For documentation and potential validation
  handler: async (
    args: z.infer<typeof inputSchema>,
    _req: RequestHandlerExtra<ServerRequest, ServerNotification>, // _req indicates it's not used
  ): Promise<CallToolResult> => {
    try {
      const result = await querySupabaseRegistry({
        page: args.page,
        limit: args.limit,
        filters: {
          category: args.category,
          is_official: args.is_official,
          authentication_type: args.authentication_type,
        },
      });
      return {
        structuredContent: result,
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    } catch (e: any) {
      console.error(`Error in list_servers tool: ${e.message}`);
      return {
        content: [
          { type: 'text', text: `Error listing servers: ${e.message}` },
        ],
        error: {
          code: -32000,
          message:
            e.message || 'Failed to list servers due to an internal error.',
        },
      };
    }
  },
};
