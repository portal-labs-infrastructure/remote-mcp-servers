// src/app/servers/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ServerCard from '@/components/server-card'; // Adjust path if necessary
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search as SearchIcon,
  Loader2,
  AlertTriangle,
  ListX,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Define a component to handle the actual data fetching and display
function ServerListContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || ''; // Get query or default to empty string

  const [servers, setServers] = useState<DiscoverableMcpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(query); // Local state for the input field

  const supabase = createClient();

  useEffect(() => {
    // Update searchTerm in input when URL query changes (e.g., browser back/forward)
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      setError(null);

      try {
        let queryBuilder = supabase
          .from('discoverable_mcp_servers') // Your actual table name
          .select('*') // Select all columns, or specify needed ones for ServerCard
          .eq('status', 'approved'); // Filter for approved servers

        if (query.trim()) {
          // Apply search filter if query exists
          // Searching name and description. Adjust fields as needed.
          // Using 'ilike' for case-insensitive search.
          // For more complex search, consider Supabase full-text search or edge functions.
          queryBuilder = queryBuilder.or(
            `name.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`,
          );
        }

        queryBuilder = queryBuilder.order('name', { ascending: true }); // Optional: order by name

        const { data, error: dbError } = await queryBuilder;

        if (dbError) {
          console.error('Supabase DB Error:', dbError);
          throw new Error(`Database error: ${dbError.message}`);
        }

        setServers(data || []);
      } catch (err) {
        console.error('Unexpected error fetching discoverable servers:', err);
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        setServers([]); // Clear servers on error
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [query, supabase]); // Re-fetch when query changes

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update URL query parameter to trigger re-fetch and allow bookmarking/sharing
    // Using window.location.href for simplicity here, or use Next.js router if preferred for SPA feel
    window.location.href = `/servers?q=${encodeURIComponent(searchTerm.trim())}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading MCP servers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 p-6 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive font-semibold">
          Failed to load MCP servers
        </p>
        <p className="text-destructive/80 text-sm mt-1">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Search form within the page */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 flex items-center gap-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search servers by name or description..."
          className="flex-grow"
        />
        <Button type="submit">
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {servers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-muted rounded-lg">
          <ListX className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-semibold">
            {query.trim()
              ? 'No MCP servers found matching your search.'
              : 'No MCP servers are currently listed.'}
          </p>
          {!query.trim() && (
            <p className="text-sm text-muted-foreground mt-1">
              Want to add your server?{' '}
              <Link href="/dashboard" className="text-primary hover:underline">
                Go to Dashboard
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard server={server} key={server.id} />
          ))}
        </div>
      )}
      {/* TODO: Add pagination if you expect many servers */}
    </>
  );
}

// Main page component using Suspense for searchParams
export default function ServersPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4 sm:mb-0">
          MCP Server Registry
        </h1>
        {/* You could add a "Submit Server" button here if desired */}
        {/* <Button asChild><Link href="/dashboard">Add Your Server</Link></Button> */}
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }>
        <ServerListContent />
      </Suspense>
    </div>
  );
}
