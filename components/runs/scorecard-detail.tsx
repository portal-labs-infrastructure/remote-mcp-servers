import { Scorecard, ScorecardLineItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScorecardDetailProps {
  scorecard: Scorecard;
}

const statusVariantMap: {
  [key in ScorecardLineItem['status']]:
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'outline';
} = {
  PENDING: 'secondary',
  PASSED: 'default',
  FAILED: 'destructive',
  PARTIAL: 'secondary',
  SKIPPED: 'outline',
};

function ScorecardItem({ item }: { item: ScorecardLineItem }) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between py-4">
      <div className="flex-1 mb-2 sm:mb-0">
        <div className="flex items-center gap-3">
          <Badge variant={statusVariantMap[item.status]}>{item.status}</Badge>
          <p className="font-medium">{item.description}</p>
        </div>
        {item.notes && (
          <p className="mt-2 ml-3 pl-4 border-l-2 text-sm text-muted-foreground">
            {item.notes}
          </p>
        )}
      </div>
      <div className="font-semibold text-right sm:pl-4">
        {item.pointsEarned} / {item.maxPoints} pts
      </div>
    </div>
  );
}

export function ScorecardDetail({ scorecard }: ScorecardDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Benchmark Rubric</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {Object.values(scorecard).map((item, index) => (
          <ScorecardItem key={index} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
