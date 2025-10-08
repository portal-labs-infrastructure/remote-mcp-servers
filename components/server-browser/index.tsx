'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ServerResults from './server-results';
import { safeParseJson } from '@/lib/types';

const ITEMS_PER_PAGE = 20;

export default function ServerBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  const [servers, setServers] = useState<SpecServerObject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get('q') || '';

  const fetchServers = useCallback(
    async (page: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const offset = (page - 1) * ITEMS_PER_PAGE;

      try {
        let query = supabase
          .from('mcp_servers_v1')
          .select('*', { count: 'exact' })
          .eq('status', 'active');

        if (searchQuery.trim()) {
          query = query.or(
            `name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`,
          );
        }

        const { data, count, error: dbError } = await query
          .order('updated_at', { ascending: false })
          .range(offset, offset + ITEMS_PER_PAGE - 1);

        if (dbError) throw new Error(`Database error: ${dbError.message}`);

        const processedServers: SpecServerObject[] = (data || []).map(
          (server) => ({
            ...server,
            repository: safeParseJson<Repository>(server.repository),
            remotes: safeParseJson<Remote[]>(server.remotes),
            meta: safeParseJson<Meta>(server.meta),
            packages: null,
          }),
        );

        if (append) {
          setServers((prev) => [...prev, ...processedServers]);
        } else {
          setServers(processedServers);
          setTotalCount(count || 0);
        }

        setHasMore(
          processedServers.length === ITEMS_PER_PAGE && (count || 0) > offset + ITEMS_PER_PAGE,
        );
      } catch (err) {
        console.error('Error fetching servers:', err);
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        if (!append) {
          setServers([]);
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, supabase],
  );

  // Reset and fetch on search change
  useEffect(() => {
    setCurrentPage(1);
    setServers([]);
    fetchServers(1, false);
  }, [searchQuery, fetchServers]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchServers(nextPage, true);
    }
  }, [loading, loadingMore, hasMore, currentPage, fetchServers]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  const handleSearchSubmit = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set('q', searchTerm.trim());
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <div className="flex flex-col">
      <ServerResults
        initialSearchTerm={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        servers={servers}
        totalCount={totalCount}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        observerTarget={observerTarget}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
