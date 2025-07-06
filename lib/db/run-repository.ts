import { createClient } from '@/lib/supabase/server';

const client = await createClient();

export async function createRun(clientId: string) {
  const { data, error } = await client
    .from('benchmark_runs')
    .insert({ client_id: clientId, status: 'in_progress' })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

// We'll need this later for the 'submit' flow
export async function finalizeRun(
  runId: string,
  result: { success: boolean; details?: any },
) {
  // ... logic to update the run with final status, time, etc.
}
