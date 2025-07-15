import { notFound } from 'next/navigation';

import { ClientHeader } from '@/components/clients/client-header';
import { StatsGrid } from '@/components/clients/stats-grid';
import { RunHistoryTable } from '@/components/clients/run-history-table';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RUNS_PAGE_SIZE } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface ClientDetailPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const client = await createClient();
  const { clientId } = await params;

  // Fetch aggregate stats using our new RPC
  const { data: clientDetails, error: detailsError } = await client
    .rpc('get_client_details', { client_id_in: clientId })
    .single();

  // Fetch the list of all individual runs for this client
  const { data: runs, error: runsError } = await client
    .from('benchmark_runs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .range(0, RUNS_PAGE_SIZE - 1);

  if (detailsError || runsError || !clientDetails) {
    console.error('Error fetching client details:', detailsError || runsError);
    // If the client doesn't exist or there's an error, show a 404 page
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/clients`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>

      <ClientHeader
        name={clientDetails.client_name}
        version={clientDetails.client_version}
      />

      <div className="my-8">
        <StatsGrid
          highestScore={clientDetails.highest_score}
          successRate={clientDetails.success_rate}
          totalRuns={clientDetails.total_runs}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Run History</h2>
        <RunHistoryTable initialRuns={runs || []} clientId={clientId} />
      </div>
    </main>
  );
}
