'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ITEMS_PER_PAGE, ServerFilterParams } from './types';
import ServerFilters from './server-filters';
import ServerResults from './server-results';
import ServerFiltersMobile from './server-filters-mobile';
import { safeParseJson } from '@/lib/types';

export default function ServerBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [servers, setServers] = useState<SpecServerObject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state from URL search params
  const currentFilters = useMemo((): ServerFilterParams => {
    return {
      q: searchParams.get('q') || undefined,
      categories: searchParams.get('categories')?.split(',') || undefined,
      authTypes: searchParams.get('authTypes')?.split(',') || undefined,
      dynamicClientRegistration:
        searchParams.get('dcr') === 'true' ? true : undefined,
      isOfficial: searchParams.get('official') === 'true' ? true : undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
    };
  }, [searchParams]);

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthTypes, setAvailableAuthTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      // Fetch unique categories
      const { data: catData, error: catError } = await supabase.rpc(
        'get_unique_meta_categories',
      );

      if (catError) {
        console.error('Error fetching categories:', catError);
        setAvailableCategories([]); // fallback
      } else if (catData) {
        // Extract unique, non-null categories
        const uniqueCategories = Array.from(
          new Set(catData.map((item) => item.category).filter(Boolean)),
        ).sort();
        setAvailableCategories(uniqueCategories as string[]);
      }

      // Fetch unique authentication types
      const { data: authData, error: authError } = await supabase.rpc(
        'get_unique_meta_auth_types',
      );

      if (authError) {
        console.error('Error fetching auth types:', authError);
        setAvailableAuthTypes([]); // fallback
      } else if (authData) {
        const uniqueAuthTypes = Array.from(
          new Set(
            authData.map((item) => item.authentication_type).filter(Boolean),
          ),
        ).sort();
        setAvailableAuthTypes(uniqueAuthTypes as string[]);
      }
    };

    fetchFilterOptions();
  }, [supabase]);

  useEffect(() => {
    const fetchServersAndCount = async () => {
      setLoading(true);
      setError(null);

      const page = currentFilters.page || 1;
      const offset = (page - 1) * ITEMS_PER_PAGE;

      // The namespace for our custom data inside the meta column
      const metaNamespace = 'com.remote-mcp-servers.metadata';

      const buildBaseQuery = (selectConfig?: {
        count?: 'exact';
        head?: boolean;
      }) => {
        let qb = supabase
          .from('mcp_servers_v1')
          .select('*', selectConfig)
          // FIXED: The status in the new table is 'active', not 'approved'
          .eq('status', 'active');

        if (currentFilters.q?.trim()) {
          qb = qb.or(
            `name.ilike.%${currentFilters.q.trim()}%,description.ilike.%${currentFilters.q.trim()}%`,
          );
        }
        if (currentFilters.categories && currentFilters.categories.length > 0) {
          qb = qb.in(
            `meta->${metaNamespace}->>category`,
            currentFilters.categories,
          );
        }
        if (currentFilters.authTypes && currentFilters.authTypes.length > 0) {
          qb = qb.in(
            `meta->${metaNamespace}->>authentication_type`,
            currentFilters.authTypes,
          );
        }
        if (currentFilters.dynamicClientRegistration !== undefined) {
          qb = qb.eq(
            `meta->${metaNamespace}->>dynamic_client_registration`,
            String(currentFilters.dynamicClientRegistration),
          );
        }
        if (currentFilters.isOfficial !== undefined) {
          qb = qb.eq(
            `meta->${metaNamespace}->>is_official`,
            String(currentFilters.isOfficial),
          );
        }
        return qb;
      };

      try {
        // 1. Fetch total count
        // Pass '*' and the count config to buildBaseQuery
        const countQuery = buildBaseQuery({ count: 'exact', head: true });
        const { count, error: countError } = await countQuery;

        if (countError) {
          console.error('Supabase DB Count Error:', countError);
          throw new Error(`Database count error: ${countError.message}`);
        }
        setTotalCount(count || 0);

        let fetchedServers: McpServer[] = [];
        if (count && count > 0) {
          const dataQueryBuilder = buildBaseQuery();
          // CHANGED: Order by 'updated_at' for recency
          const { data, error: dbError } = await dataQueryBuilder
            .order('updated_at', { ascending: false })
            .range(offset, offset + ITEMS_PER_PAGE - 1);

          if (dbError)
            throw new Error(`Database data error: ${dbError.message}`);
          fetchedServers = data || [];
        }

        const processedServers: SpecServerObject[] = fetchedServers.map(
          (server) => ({
            ...server,
            repository: safeParseJson<Repository>(server.repository),
            remotes: safeParseJson<Remote[]>(server.remotes),
            meta: safeParseJson<Meta>(server.meta),
            packages: null, // Assuming packages are not used in this context
          }),
        );
        setServers(processedServers);
      } catch (err) {
        console.error('Unexpected error fetching discoverable servers:', err);
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        setServers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchServersAndCount();
  }, [currentFilters, supabase]); // Dependencies

  const updateUrlParams = useCallback(
    (newFilters: Partial<ServerFilterParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (key === 'dcr') {
          // map internal name to URL param
          params.set('dcr', String(value));
        } else if (key === 'official') {
          // map internal name to URL param
          params.set('official', String(value));
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      });

      // Ensure page is a string for URLSearchParams
      if (newFilters.page !== undefined) {
        params.set('page', String(newFilters.page));
      } else if (!params.has('page') && newFilters.page === undefined) {
        // If page is being reset by a filter change but not explicitly set, default to 1
        // This case is handled by onFilterChange in ServerFilters setting page:1
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleFilterChange = useCallback(
    (changedFilters: Partial<ServerFilterParams>) => {
      const urlParamsToUpdate: Record<
        string,
        string | boolean | string[] | undefined | number
      > = {};

      if ('dynamicClientRegistration' in changedFilters)
        urlParamsToUpdate.dcr = changedFilters.dynamicClientRegistration;

      if ('isOfficial' in changedFilters)
        urlParamsToUpdate.official = changedFilters.isOfficial;

      if ('categories' in changedFilters)
        urlParamsToUpdate.categories = changedFilters.categories;

      if ('authTypes' in changedFilters)
        urlParamsToUpdate.authTypes = changedFilters.authTypes;

      urlParamsToUpdate.page = 1;

      updateUrlParams(urlParamsToUpdate);
    },
    [updateUrlParams],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters: ServerFilterParams = {
      q: currentFilters.q, // Keep search query
      page: 1,
      categories: undefined,
      authTypes: undefined,
      dynamicClientRegistration: undefined,
      isOfficial: undefined,
    };
    // Map to URL params, explicitly clearing them
    updateUrlParams(clearedFilters);
  }, [updateUrlParams, currentFilters.q]);

  const handleSearchSubmit = useCallback(
    (searchTerm: string) => {
      updateUrlParams({ q: searchTerm || undefined, page: 1 });
    },
    [updateUrlParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlParams({ page });
    },
    [updateUrlParams],
  );

  const activeFilterCount = Object.entries(currentFilters)
    .filter(([key]) => !['page', 'q'].includes(key))
    .reduce((acc, item) => {
      const value = item[1];
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      if (typeof value === 'boolean') {
        return acc + (value ? 1 : 0);
      }
      // For other types (e.g., string, number), count if truthy
      return acc + (value ? 1 : 0);
    }, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <ServerFilters
            filters={currentFilters}
            onFilterChange={handleFilterChange}
            availableCategories={availableCategories}
            availableAuthTypes={availableAuthTypes}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Mobile Filters */}
      <ServerFiltersMobile
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
        availableAuthTypes={availableAuthTypes}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        <ServerResults
          initialSearchTerm={currentFilters.q || ''}
          onSearchSubmit={handleSearchSubmit}
          servers={servers}
          totalCount={totalCount}
          loading={loading}
          error={error}
          currentPage={currentFilters.page || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
