import ServerCard from './server-card';
import { createClient } from '@/lib/supabase/server';

// Helper function to fetch and validate servers
async function getDiscoverableServersFromSupabase(): Promise<{
  servers: DiscoverableMcpServer[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  try {
    // Replace 'discoverable_mcp_servers' with your actual table name
    const { data, error: dbError } = await supabase
      .from('discoverable_mcp_servers')
      .select(`*`) // Fetch all columns
      .order('name', { ascending: true }); // Optional: order by name

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return { servers: null, error: `Database error: ${dbError.message}` };
    }

    if (!data) {
      // Query successful but no data returned (e.g., table is empty)
      return { servers: [], error: null };
    }

    return { servers: data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching discoverable servers:', err);
    const message =
      err instanceof Error
        ? err.message
        : 'An unknown error occurred while fetching data.';
    return { servers: null, error: message };
  }
}

export default async function Servers() {
  const { servers, error } = await getDiscoverableServersFromSupabase();

  if (error) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-destructive mt-4">
          Failed to load MCP servers: {error}
        </p>
        {/* In a real app, you might want a more user-friendly error message
            or a component that allows retrying, depending on the error type. */}
      </div>
    );
  }

  if (!servers || servers.length === 0) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-muted-foreground mt-4">
          No MCP servers are currently listed in the registry.
        </p>
        {/* You could add a call to action here, e.g., "Want to add your server?" */}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {servers.map((server) => (
          <ServerCard
            server={server}
            key={server.id} // Use the unique 'id' from Supabase as the key
          />
        ))}
      </div>
    </div>
  );
}
