import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsGridProps {
  highestScore: number | null;
  successRate: number | null;
  totalRuns: number | null;
}

export function StatsGrid({
  highestScore,
  successRate,
  totalRuns,
}: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {highestScore ? highestScore.toFixed(1) : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Of successful runs</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {successRate ? `${successRate.toFixed(1)}%` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Of all attempts</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRuns || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total benchmark attempts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
