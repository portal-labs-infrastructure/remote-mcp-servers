import { createClient } from '@/lib/supabase/server';

export async function createRun(clientId: string) {
  const client = await createClient();
  const { data, error } = await client
    .from('benchmark_runs')
    .insert({ client_id: clientId, status: 'in_progress' })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}
