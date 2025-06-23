import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
// Import your table or card components for displaying servers
// import { UserServersTable } from '@/components/dashboard/UserServersTable';

async function getUserServers(
  userId: string,
): Promise<DiscoverableMcpServer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('discoverable_mcp_servers')
    .select('*') // Select all columns or specific ones you need
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user's servers:", error);
    return [];
  }
  return data || [];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?message=Please log in to access your dashboard.');
  }

  const userServers = await getUserServers(user.id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8 gap-8 flex-wrap">
        <h1 className="text-3xl font-bold">Your MCP Servers</h1>
        <Button asChild>
          <Link href="/servers/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Server
          </Link>
        </Button>
      </div>

      {userServers.length > 0 ? (
        // <UserServersTable servers={userServers} />
        <div>
          <h2 className="text-xl mb-4">Your Submitted Servers:</h2>
          <ul className="space-y-4">
            {userServers.map((server) => (
              <li key={server.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{server.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {server.mcp_url}
                </p>
                <p className="text-sm  pt-2">
                  Status:{' '}
                  <span
                    className={`font-medium ${
                      server.status === 'approved'
                        ? 'text-green-600'
                        : server.status === 'pending_review'
                          ? 'text-yellow-600'
                          : server.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-gray-600'
                    }`}>
                    {server.status?.replace('_', ' ')}
                  </span>
                </p>
                {/* Add Edit/Delete buttons here based on status and RLS */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold text-muted-foreground">
            No servers submitted yet.
          </h2>
          <p className="text-muted-foreground mt-2">
            Ready to share your MCP server with the world?
          </p>
          <Button asChild className="mt-4">
            <Link href="/servers/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Submit Your First Server
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
