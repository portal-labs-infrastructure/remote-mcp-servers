'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ITEMS_PER_PAGE, ServerFilterParams } from './types';
import ServerFilters from './server-filters';
import ServerResults from './server-results';
import ServerFiltersMobile from './server-filters-mobile';

export default function ServerBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [servers, setServers] = useState<DiscoverableMcpServer[]>([]);
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
      const { data: catData, error: catError } = await supabase
        .from('unique_categories')
        .select('*');

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
      const { data: authData, error: authError } = await supabase
        .from('unique_authentication_types')
        .select('*');

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

      // Your updated buildBaseQuery function
      const buildBaseQuery = (
        selectConfig?: { count?: 'exact'; head?: boolean }, // More specific type for selectConfig
      ) => {
        let qb = supabase
          .from('discoverable_mcp_servers')
          .select('*', selectConfig)
          .eq('status', 'approved');

        if (currentFilters.q?.trim()) {
          qb = qb.or(
            `name.ilike.%${currentFilters.q.trim()}%,description.ilike.%${currentFilters.q.trim()}%`,
          );
        }
        if (currentFilters.categories && currentFilters.categories.length > 0) {
          qb = qb.in('category', currentFilters.categories);
        }
        if (currentFilters.authTypes && currentFilters.authTypes.length > 0) {
          qb = qb.in('authentication_type', currentFilters.authTypes);
        }
        if (currentFilters.dynamicClientRegistration !== undefined) {
          qb = qb.eq(
            'dynamic_client_registration',
            currentFilters.dynamicClientRegistration,
          );
        }
        if (currentFilters.isOfficial !== undefined) {
          qb = qb.eq('is_official', currentFilters.isOfficial);
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

        let fetchedServers: DiscoverableMcpServer[] = [];
        if (count && count > 0) {
          // 2. Fetch actual data for the current page
          // Pass '*' for select, then chain .order() and .range()
          const dataQueryBuilder = buildBaseQuery(); // This now returns a query builder already including .select('*')

          const { data, error: dbError } = await dataQueryBuilder
            .order('created_at', { ascending: false })
            .range(offset, offset + ITEMS_PER_PAGE - 1);

          if (dbError) {
            console.error('Supabase DB Data Error:', dbError);
            throw new Error(`Database data error: ${dbError.message}`);
          }

          fetchedServers = data || [];
        }

        setServers(fetchedServers);
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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="hidden md:block">
        <ServerFilters
          filters={currentFilters}
          onFilterChange={handleFilterChange}
          availableCategories={availableCategories} // Pass fetched/static categories
          availableAuthTypes={availableAuthTypes} // Pass fetched/static auth types
          onClearFilters={handleClearFilters}
        />
      </div>
      <ServerFiltersMobile
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
        availableAuthTypes={availableAuthTypes}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

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
  );
}
