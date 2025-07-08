import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'; // Import from shadcn/ui
import { LeaderboardEntry } from '@/lib/types';
import { LeaderboardRow } from './leaderboard-row';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed rounded-lg bg-muted text-muted-foreground">
        <h3 className="text-xl font-semibold">No Data Yet</h3>
        <p className="mt-2">
          No clients have completed a benchmark run yet. Once they do, the
          leaderboard will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Highest Score</TableHead>
            <TableHead>Best Time</TableHead>
            <TableHead>Total Runs</TableHead>
            <TableHead className="text-right">Last Run</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <LeaderboardRow
              key={entry.client_id}
              entry={entry}
              rank={index + 1}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
