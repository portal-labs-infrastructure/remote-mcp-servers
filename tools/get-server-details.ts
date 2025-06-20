import { z } from 'zod';
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types.js';
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { createClient } from '@/lib/supabase/server';
import { discoverableMcpServerSchema } from './utils';

const inputSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe('The unique ID (UUID) of the server to retrieve.'),
});

// Output is a single server object, or null if not found
const outputSchema = discoverableMcpServerSchema.nullable();

export default {
  name: 'get_server_details',
  description:
    'Retrieves details for a specific approved MCP server from the registry by its ID. Data is read-only.',
  inputSchema,
  outputSchema,
  handler: async (
    args: z.infer<typeof inputSchema>,
    _req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('discoverable_mcp_servers')
        .select('*') // Select all relevant fields
        .eq('id', args.id)
        .eq('status', 'approved') // Ensure it's an approved server
        .single(); // Expects a single row or null if not found (after PostgREST v0.8)

      if (error) {
        // PostgREST error code for "Searched for one row, but found 0"
        if (error.code === 'PGRST116') {
          return {
            content: [
              {
                type: 'text',
                text: `Server with ID ${args.id} not found or not approved.`,
              },
            ],
            // Optionally, use the error field for "not found" if clients prefer that
            // error: { code: -32001, message: `Server with ID ${args.id} not found or not approved.`}
          };
        }
        // Other database error
        throw new Error(`Database error: ${error.message}`);
      }

      // data will be null if not found and .single() didn't throw PGRST116 (should be rare)
      if (!data) {
        return {
          content: [
            {
              type: 'text',
              text: `Server with ID ${args.id} not found or not approved.`,
            },
          ],
        };
      }

      return {
        structuredContent: data,
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    } catch (e: any) {
      console.error(`Error in get_server_details tool: ${e.message}`);
      return {
        content: [
          { type: 'text', text: `Error fetching server details: ${e.message}` },
        ],
        error: {
          code: -32000,
          message:
            e.message ||
            'Failed to fetch server details due to an internal error.',
        },
      };
    }
  },
};
