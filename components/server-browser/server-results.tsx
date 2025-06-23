'use client';

import ServerCard from '@/components/server-card'; // Adjust path
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, AlertTriangle, ListX } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ITEMS_PER_PAGE } from './types';
import PaginationControls from '../ui/pagination-controls';
import { Button } from '../ui/loading-button';

interface ServerResultsProps {
  initialSearchTerm: string;
  onSearchSubmit: (searchTerm: string) => void;
  servers: DiscoverableMcpServer[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ServerResults({
  initialSearchTerm,
  onSearchSubmit,
  servers,
  totalCount,
  loading,
  error,
  currentPage,
  onPageChange,
}: ServerResultsProps) {
  const [searchTermInput, setSearchTermInput] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTermInput(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit(searchTermInput.trim());
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 p-6 rounded-lg min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive font-semibold">
          Failed to load MCP servers
        </p>
        <p className="text-destructive/80 text-sm mt-1">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()} // Or a more specific retry function
          className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="flex-1">
      <form
        onSubmit={handleSearchFormSubmit}
        className="mb-8 flex items-center gap-2">
        <Input
          type="search"
          value={searchTermInput}
          onChange={(e) => setSearchTermInput(e.target.value)}
          placeholder="Search servers by name or description..."
          className="flex-grow h-10"
        />
        <Button loading={loading} type="submit">
          {' '}
          {/* Matched button height */}
          <SearchIcon className="mr-0" />{' '}
          {/* Icon always visible, text hidden on small screens */}
          <span className="hidden md:inline">Search</span>
        </Button>
      </form>

      {servers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-muted rounded-lg min-h-[300px]">
          <ListX className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-semibold">
            {initialSearchTerm.trim() ||
            Object.keys(initialSearchTerm).length > 1 // Check if filters are active beyond just 'q' or 'page'
              ? 'No MCP servers found matching your search or filters.'
              : 'No MCP servers are currently listed.'}
          </p>
          {!initialSearchTerm.trim() && (
            <p className="text-sm text-muted-foreground mt-1">
              Want to add your server?{' '}
              <Link href="/dashboard" className="text-primary hover:underline">
                Go to Dashboard
              </Link>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <ServerCard server={server} key={server.id} />
            ))}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalCount}
          />
        </>
      )}
    </div>
  );
}
