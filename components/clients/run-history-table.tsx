'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; // Add badge: npx shadcn-ui@latest add badge
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { RUNS_PAGE_SIZE } from '@/lib/utils';

interface RunHistoryTableProps {
  initialRuns: BenchmarkRun[];
  clientId: string;
}

export function RunHistoryTable({
  initialRuns,
  clientId,
}: RunHistoryTableProps) {
  const router = useRouter();
  const supabase = createClient();

  // --- STATE MANAGEMENT ---
  const [runs, setRuns] = useState<BenchmarkRun[]>(initialRuns);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // If we received a full page of initial runs, assume there are more.
  const [hasMore, setHasMore] = useState(initialRuns.length === RUNS_PAGE_SIZE);

  const loadMoreRuns = async () => {
    setIsLoading(true);
    const from = page * RUNS_PAGE_SIZE;
    const to = from + RUNS_PAGE_SIZE - 1;

    const { data: newRuns } = await supabase
      .from('benchmark_runs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (newRuns) {
      setRuns((prevRuns) => [...prevRuns, ...newRuns]);
      setPage((prevPage) => prevPage + 1);
      // If the number of new runs is less than the page size, we've reached the end.
      if (newRuns.length < RUNS_PAGE_SIZE) {
        setHasMore(false);
      }
    }
    setIsLoading(false);
  };

  if (runs.length === 0) {
    return (
      <p className="text-muted-foreground">No runs found for this client.</p>
    );
  }
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Run ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow
                key={run.id}
                onClick={() => router.push(`/runs/${run.id}`)}
                className="cursor-pointer">
                <TableCell>
                  <Badge
                    variant={
                      run.success === true
                        ? 'default'
                        : run.success === false
                          ? 'destructive'
                          : 'outline'
                    }>
                    {run.success === true
                      ? 'Success'
                      : run.success === false
                        ? 'Failed'
                        : 'In Progress'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {run.score ?? 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(run.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {run.id.substring(0, 8)}...
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Button onClick={loadMoreRuns} disabled={isLoading} variant="outline">
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}
