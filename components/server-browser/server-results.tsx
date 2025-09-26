'use client';

import ServerCard from '@/components/server-card'; // Adjust path
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, AlertTriangle, ListX } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ITEMS_PER_PAGE } from './types';
import PaginationControls from '../ui/pagination-controls';
import { Button } from '../ui/loading-button';
import { Skeleton } from '../ui/skeleton';

interface ServerResultsProps {
  initialSearchTerm: string;
  onSearchSubmit: (searchTerm: string) => void;
  servers: SpecServerObject[];
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
      <div className="flex flex-col items-center justify-center text-center py-16 bg-destructive/5 border border-destructive/20 rounded-xl min-h-[400px]">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <p className="text-destructive font-bold text-lg">
          Failed to load MCP servers
        </p>
        <p className="text-destructive/80 text-sm mt-2 max-w-md">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-6 hover:scale-105 transition-all duration-200">
          Try Again
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="flex-1 space-y-8">
      {/* Enhanced Search Form */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
        <form
          onSubmit={handleSearchFormSubmit}
          className="flex items-center gap-4">
          <Input
            type="search"
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
            placeholder="Search servers by name or description..."
            className="flex-grow h-12 border-border/50 bg-background/50 focus-visible:ring-primary focus-visible:border-primary"
          />
          <Button
            loading={loading}
            type="submit"
            className="h-12 px-6 transition-all duration-200 hover:scale-105 hover:shadow-md">
            <SearchIcon className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>
      </div>

      {/* No Results State */}
      {!loading && servers.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-xl min-h-[400px]">
          <div className="p-4 rounded-full bg-muted/50 mb-6">
            <ListX className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {initialSearchTerm.trim() ||
            Object.keys(initialSearchTerm).length > 1
              ? 'No servers found'
              : 'No servers available'}
          </h3>
          <p className="text-muted-foreground text-lg max-w-md">
            {initialSearchTerm.trim() ||
            Object.keys(initialSearchTerm).length > 1
              ? 'No MCP servers found matching your search or filters. Try adjusting your criteria.'
              : 'No MCP servers are currently listed in the registry.'}
          </p>
          {!initialSearchTerm.trim() && (
            <p className="text-muted-foreground mt-4">
              Want to add your server?{' '}
              <Link
                href="/dashboard"
                className="text-primary hover:text-primary/80 font-semibold hover:underline">
                Go to Dashboard
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Results Grid */}
      {servers.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>{' '}
              servers found
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && servers.length === 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-[300px] rounded-xl bg-muted/20"
            />
          ))}
        </div>
      )}
    </div>
  );
}
