import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { RunSummary } from '@/components/runs/run-summary';
import { ScorecardDetail } from '@/components/runs/scorecard-detail';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { Scorecard } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface RunDetailPageProps {
  params: Promise<{
    runId: string;
  }>;
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const client = await createClient();
  const { runId } = await params;

  // Fetch the single run record
  const { data: run, error } = await client
    .from('benchmark_runs')
    .select('*')
    .eq('id', runId)
    .single();

  // If the run doesn't exist or there's an error, show a 404 page
  if (error || !run) {
    return notFound();
  }

  // The 'results' column contains our scorecard object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scorecard = (run.results as any).details as Scorecard;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/clients/${run.client_id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client Details
          </Link>
        </Button>
      </div>

      <RunSummary run={run as BenchmarkRun} />

      <div className="mt-8">
        <ScorecardDetail scorecard={scorecard} />
      </div>
    </main>
  );
}
