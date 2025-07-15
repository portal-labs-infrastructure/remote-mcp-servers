'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- Import the router hook
import { TableRow, TableCell } from '@/components/ui/table';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const router = useRouter(); // <-- Initialize the router

  const timeInSeconds = entry.fastest_time_ms
    ? (entry.fastest_time_ms / 1000).toFixed(2) + 's'
    : 'N/A';
  const lastRunDate = new Date(entry.last_run_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // This function will be called when the row is clicked
  const handleRowClick = () => {
    router.push(`/clients/${entry.client_id}`);
  };

  return (
    // Add the onClick handler here. The cursor style provides a visual cue.
    <TableRow onClick={handleRowClick} className="cursor-pointer">
      <TableCell className="font-medium text-lg">{rank}</TableCell>
      <TableCell>
        <Link
          href={`/clients/${entry.client_id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-medium hover:underline">
          {entry.client_name}
        </Link>
        <div className="text-xs text-muted-foreground">
          {entry.client_version}
        </div>
      </TableCell>
      <TableCell>{entry.highest_score}</TableCell>
      <TableCell>{timeInSeconds}</TableCell>
      <TableCell>{entry.total_runs}</TableCell>
      <TableCell className="text-right">{lastRunDate}</TableCell>
    </TableRow>
  );
}
