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
