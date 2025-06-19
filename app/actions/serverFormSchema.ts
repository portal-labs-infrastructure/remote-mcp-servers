// serverFormSchema.ts (can be in the same file or imported)
import * as z from 'zod';

export const AUTHENTICATION_TYPES = ['OAuth', 'APIKey', 'None'] as const;

export const serverFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters.')
    .max(150, 'Name cannot exceed 150 characters.'),
  mcp_url: z
    .string()
    .url('MCP URL must be a valid URL.')
    .min(1, 'MCP URL is required.')
    .max(2048, 'MCP URL too long.'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters.'),
  category: z
    .string()
    .min(1, 'Category is required.')
    .max(100, 'Category cannot exceed 100 characters.'), // Made required as per Supabase type

  // Optional URL fields
  documentation_url: z
    .string()
    .url('Invalid documentation URL.')
    .max(2048)
    .nullable()
    .optional()
    .or(z.literal('')), // Allow empty string to clear
  icon_url: z
    .string()
    .url('Invalid icon URL.')
    .max(2048)
    .nullable()
    .optional()
    .or(z.literal('')), // Allow empty string to clear

  // Optional maintainer fields
  maintainer_name: z.string().max(150, 'Maintainer name too long.'),
  maintainer_url: z
    .string()
    .url('Invalid maintainer URL.')
    .max(2048)
    .or(z.literal(''))
    .nullable()
    .optional(),

  // Updated authentication_type to be an enum
  authentication_type: z
    .enum(AUTHENTICATION_TYPES, {
      required_error: 'Authentication type is required.', // Optional: custom error message
    })
    .describe('The primary authentication method supported by the server.'),

  // Boolean fields
  dynamic_client_registration: z.boolean().default(false).nullable().optional(),
  is_official: z.boolean().default(false).nullable().optional(),
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;
