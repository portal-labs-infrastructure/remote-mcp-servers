import { createClient } from '@/lib/supabase/server';
import { Json } from '@/types/supabase';

// Using upsert is great for clients, as we don't want duplicates.
// We can define a unique constraint on the client_info in the DB for this.
export async function upsertClient(clientInfo: Json) {
  const client = await createClient();
  const { data, error } = await client
    .from('clients')
    .upsert({ client_info: clientInfo }) // Assumes a unique constraint on client_info
    .select('id')
    .single();

  if (error) throw error;
  return data;
}
