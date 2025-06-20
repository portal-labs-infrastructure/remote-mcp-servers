import { infer, z } from 'zod';
import {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';

export const addToChatInputSchema = z.object({
  sides: z.number().int().min(2),
});

export const addToChatOutputSchema = z.object({
  response: z.string(),
});

export default {
  name: 'roll_dice',
  description: 'Rolls an N-sided die.',
  inputSchema: addToChatInputSchema,
  outputSchema: addToChatOutputSchema,
  handler: async (
    args: z.infer<typeof addToChatInputSchema>,
    req: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> => {
    const value = 1 + Math.floor(Math.random() * args.sides);
    const response = {
      response: `🎲 You rolled a ${value}!`,
    };

    return {
      structuredContent: response,
      content: [
        {
          type: 'text',
          text: JSON.stringify(response),
        },
      ],
    };
  },
};
