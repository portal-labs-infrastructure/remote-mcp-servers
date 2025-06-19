'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache'; // To revalidate dashboard page
import { createClient } from '@/lib/supabase/server';
import { serverFormSchema } from './serverFormSchema';

// Define the type for the input data based on the schema
type NewServerInput = z.infer<typeof serverFormSchema>;

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>; // For Zod field-specific errors
  serverId?: string; // Optionally return the ID of the newly created server
}

export async function submitServerAction(
  formData: NewServerInput, // Or use `prevState: any, formData: FormData` if using progressive enhancement with useFormState
): Promise<ActionResult> {
  const supabase = await createClient();

  // 1. Authenticate User
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Authentication error in submitServerAction:', authError);
    return {
      success: false,
      error: 'Authentication failed. Please log in and try again.',
    };
  }

  // 2. Validate Input Data
  const validationResult = serverFormSchema.safeParse(formData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    console.log('Validation errors:', fieldErrors);
    return {
      success: false,
      error: 'Invalid data provided. Please check the form fields.',
      fieldErrors: fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // 3. Prepare Data for Supabase
  const serverDataToInsert = {
    ...validatedData,
    status: 'pending_review', // Default status for new submissions
    // `created_at` and `id` will be handled by Supabase (assuming defaults are set)
  };

  // 4. Insert into Supabase
  try {
    const { data: newServer, error: dbError } = await supabase
      .from('discoverable_mcp_servers')
      .insert(serverDataToInsert)
      .select('id') // Select the ID of the newly inserted row
      .single(); // Expect a single row back

    if (dbError) {
      console.error('Supabase DB insert error:', dbError);
      // Handle specific Supabase errors if needed (e.g., unique constraint violation)
      if (dbError.code === '23505') {
        // Unique constraint violation
        return {
          success: false,
          error: `A server with similar unique details (e.g., MCP URL) might already exist. ${dbError.details || ''}`,
        };
      }
      return {
        success: false,
        error: `Failed to submit server: ${dbError.message}`,
      };
    }

    if (!newServer || !newServer.id) {
      console.error('Supabase insert succeeded but no ID returned.');
      return {
        success: false,
        error: 'Server submitted, but failed to retrieve its ID.',
      };
    }

    // 5. Revalidate relevant paths (e.g., user's dashboard)
    // This tells Next.js to re-fetch data for these paths on the next visit.
    revalidatePath('/dashboard'); // Revalidates the main dashboard page
    revalidatePath('/'); // If the public list might show pending servers or count changes

    return {
      success: true,
      message: 'Server submitted successfully and is pending review!',
      serverId: newServer.id,
    };
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error in submitServerAction:', error);
    return {
      success: false,
      error: `An unexpected error occurred: ${error.message}`,
    };
  }
}
