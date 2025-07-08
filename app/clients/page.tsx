import { BenchmarkInstructions } from '@/components/leaderboard/benchmark-instructions';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { createClient } from '@/lib/supabase/server';

// You can adjust this to a time-based revalidation if preferred.
export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const client = await createClient();

  // Call the RPC function we just created.
  const { data: leaderboardData, error } = await client.rpc(
    'get_client_leaderboard',
  );

  if (error) {
    console.error('Error fetching leaderboard data:', error);
    // You can render a more user-friendly error component here
    return <p className="text-red-500">Could not load leaderboard data.</p>;
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-8">
      <h1 className="text-4xl font-bold mb-4">MCP Client Leaderboard</h1>
      <p className="text-lg text-gray-400 mb-8">
        A ranked list of clients based on their best benchmark performance.
      </p>

      <div className="mb-8 max-w-3xl">
        <BenchmarkInstructions />
      </div>

      {/* We pass the fetched data to a dedicated table component for clean separation of concerns. */}
      <LeaderboardTable data={leaderboardData || []} />
    </main>
  );
}
