'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { serverFormSchema, type ServerFormValues } from './serverFormSchema';
import z from 'zod';
import { reviewFormSchema } from './reviewFormSchema';

// Define a consistent return type for our actions
type ActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

// Action for CREATING a new server
export async function createServerAction(
  payload: ServerFormValues,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'Authentication Required',
      message: 'You must be logged in to submit a server.',
    };
  }

  const result = serverFormSchema.safeParse(payload);
  if (!result.success) {
    return {
      success: false,
      error: 'Invalid Data',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from('discoverable_mcp_servers').insert({
    ...result.data,
    user_id: user.id,
    status: 'approved',
  });

  if (error) {
    console.error('Supabase create error:', error);
    return {
      success: false,
      error: 'Database Error',
      message: 'Could not save the server. Please try again.',
    };
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'Server published!' };
}

// Action for UPDATING an existing server
export async function updateServerAction(
  payload: ServerFormValues & { id: string },
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication Required' };
  }

  // Add the ID to the schema for validation during update
  const updateSchema = serverFormSchema.extend({ id: z.string().uuid() });
  const result = updateSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid Data',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...serverData } = result.data;

  const { error } = await supabase
    .from('discoverable_mcp_servers')
    .update(serverData)
    .eq('id', id)
    .eq('user_id', user.id); // RLS protects us, but this is a good explicit check

  if (error) {
    console.error('Supabase update error:', error);
    return {
      success: false,
      error: 'Database Error',
      message: 'Could not update the server.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/servers/${id}/edit`); // Revalidate the edit page itself

  return {
    success: true,
    message: 'Your changes have been saved and are now live.',
  };
}

export async function deleteServerAction(serverId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to delete a server.');
  }

  const { error } = await supabase
    .from('discoverable_mcp_servers')
    .delete()
    .eq('id', serverId)
    .eq('user_id', user.id); // RLS handles this, but explicit is safer

  if (error) {
    console.error('Supabase error deleting server:', error);
    throw new Error('Failed to delete server.');
  }

  // Revalidate the dashboard to reflect the deletion
  revalidatePath('/dashboard');
}

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// Server Action to submit the review
export async function submitReviewAction(payload: ReviewFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to leave a review.',
    };
  }

  const result = reviewFormSchema.safeParse(payload);
  if (!result.success) {
    return {
      success: false,
      error: 'Invalid data.',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { serverId, rating, comment } = result.data;

  // Use upsert to create or update a review.
  // This relies on the unique constraint on (server_id, user_id) in your DB.
  const { error } = await supabase.from('server_reviews').upsert({
    server_id: serverId,
    user_id: user.id,
    rating,
    comment: comment || null,
  });

  if (error) {
    console.error('Review submission error:', error);
    return { success: false, error: 'A database error occurred.' };
  }

  // Revalidate the server detail page to show the new review
  revalidatePath(`/servers/${serverId}`);
  return { success: true, message: 'Your review has been submitted!' };
}

export async function deleteReviewAction({
  reviewId,
  serverId,
}: {
  reviewId: string;
  serverId: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication Required' };
  }

  // The RLS policy "Users can delete their own review" already enforces this,
  // but it's good practice to be explicit in your query.
  const { error } = await supabase
    .from('server_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Review deletion error:', error);
    return { success: false, error: 'A database error occurred.' };
  }

  revalidatePath(`/servers/${serverId}`);
  return { success: true, message: 'Your review has been deleted.' };
}
