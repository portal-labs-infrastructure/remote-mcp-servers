'use client';

import ServerCard from '@/components/server-card';
import { Input } from '@/components/ui/input';
import {
  Search as SearchIcon,
  AlertTriangle,
  ListX,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, RefObject } from 'react';
import { Button } from '../ui/loading-button';
import { Skeleton } from '../ui/skeleton';

interface ServerResultsProps {
  initialSearchTerm: string;
  onSearchSubmit: (searchTerm: string) => void;
  servers: SpecServerObject[];
  totalCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  observerTarget: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ServerResults({
  initialSearchTerm,
  onSearchSubmit,
  servers,
  totalCount,
  loading,
  loadingMore,
  error,
  observerTarget,
  hasMore,
  onLoadMore,
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

  return (
    <div className="flex-1 space-y-6">
      {/* Enhanced Search Form */}
      <div className="bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-xl p-5 shadow-md">
        <form
          onSubmit={handleSearchFormSubmit}
          className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={searchTermInput}
              onChange={(e) => setSearchTermInput(e.target.value)}
              placeholder="Search servers by name or description..."
              className="pl-10 h-11 border-2 border-border/50 bg-background/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>
          <Button
            loading={loading}
            type="submit"
            className="h-11 px-6 transition-all duration-200 hover:scale-105 hover:shadow-md">
            <span>Search</span>
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
            {initialSearchTerm.trim()
              ? 'No servers found'
              : 'No servers available'}
          </h3>
          <p className="text-muted-foreground text-lg max-w-md">
            {initialSearchTerm.trim()
              ? 'No MCP servers found matching your search. Try different keywords.'
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
        <div className="space-y-6">
          <div className="bg-muted/30 border border-border/50 rounded-lg px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground text-lg">
                {totalCount}
              </span>{' '}
              {totalCount === 1 ? 'server' : 'servers'} found
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {servers.map((server) => (
              <ServerCard server={server} key={server.id} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="py-2">
            {loadingMore && (
              <div className="flex items-center justify-center py-6 bg-muted/20 border border-border/30 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-3 text-sm text-muted-foreground">
                  Loading more servers...
                </span>
              </div>
            )}
            {!loadingMore && hasMore && (
              <div className="flex items-center justify-center py-4">
                <Button
                  onClick={onLoadMore}
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-all duration-200 border-2">
                  Load More Servers
                </Button>
              </div>
            )}
            {!loadingMore && !hasMore && servers.length > 0 && (
              <div className="text-center py-4 bg-muted/20 border border-border/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the end of the list
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && servers.length === 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="w-full h-[280px] rounded-xl bg-muted/30 border border-border/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
