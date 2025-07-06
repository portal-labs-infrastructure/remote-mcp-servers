import * as clientRepo from '@/lib/db/client-repository';
import * as runRepo from '@/lib/db/run-repository';
import * as sessionRepo from '@/lib/db/session-repository';
import { Json } from '@/types/supabase';

// This function now orchestrates the calls to the different repositories.
// This is much cleaner than the old `createRunAndSession`.
export async function initializeBenchmark(clientInfo: Json, sessionId: string) {
  // 1. Create or find the client record
  const client = await clientRepo.upsertClient(clientInfo);

  // 2. Create the main run record, linking it to the client
  const run = await runRepo.createRun(client.id);

  // 3. Create the live session record, linking it to the run
  await sessionRepo.createSession(sessionId, run.id);

  console.log(
    `Initialized session ${sessionId} for client ${client.id} and run ${run.id}`,
  );
}
