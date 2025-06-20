import { z } from 'zod';
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { querySupabaseRegistry, paginatedServersSchema } from './utils';
const inputSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe('The keyword to search for in server names and descriptions.'),
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
});

const outputSchema = paginatedServersSchema;

export default {
  name: 'search_servers',
  description:
    'Searches approved, discoverable MCP servers from the registry by a keyword in their name or description. Results are read-only.',
  inputSchema,
  outputSchema,
  handler: async (
    args: z.infer<typeof inputSchema>,
    _req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> => {
    try {
      const result = await querySupabaseRegistry({
        page: args.page,
        limit: args.limit,
        filters: {
          q: args.query, // 'q' is the internal filter key for general search
        },
      });
      return {
        structuredContent: result,
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    } catch (e: any) {
      console.error(`Error in search_servers tool: ${e.message}`);
      return {
        content: [
          { type: 'text', text: `Error searching servers: ${e.message}` },
        ],
        error: {
          code: -32000,
          message:
            e.message || 'Failed to search servers due to an internal error.',
        },
      };
    }
  },
};
