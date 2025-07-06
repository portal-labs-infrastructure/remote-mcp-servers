import { createClient } from '@/lib/supabase/server';
import { Json } from '@/types/supabase';

const client = await createClient();

export async function createSession(sessionId: string, runId: string) {
  const { error } = await client
    .from('benchmark_sessions')
    .insert({ id: sessionId, run_id: runId, current_step: 'initialized' });

  if (error) throw error;
}

// This is the refactored and correctly placed function
export async function getClientInfoForSession(
  sessionId: string,
): Promise<Json | null> {
  const { data, error } = await client
    .from('benchmark_sessions')
    .select('benchmark_runs ( clients ( client_info ) )')
    .eq('id', sessionId)
    .single();

  if (error) throw error;

  return data?.benchmark_runs?.clients?.client_info ?? null;
}
