import z from 'zod';

// Schema for validating the review form data
export const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required.').max(5),
  comment: z
    .string()
    .max(5000, 'Comment must be 5000 characters or less.')
    .optional(),
  serverId: z.string().uuid(),
});
