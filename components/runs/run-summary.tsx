import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RunSummaryProps {
  run: BenchmarkRun;
}

export function RunSummary({ run }: RunSummaryProps) {
  const timeInSeconds = run.time_to_completion_ms
    ? (run.time_to_completion_ms / 1000).toFixed(2) + 's'
    : 'N/A';

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Run Details</h1>
      <p className="text-muted-foreground font-mono text-sm">{run.id}</p>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Status</CardTitle>
            {run.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${run.success ? 'text-green-600' : 'text-red-600'}`}>
              {run.success ? 'Success' : 'Failed'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{run.score ?? 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeInSeconds}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
