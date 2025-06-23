export const ITEMS_PER_PAGE = 25;

export interface ServerFilterParams {
  q?: string;
  categories?: string[];
  authTypes?: string[];
  dynamicClientRegistration?: boolean;
  isOfficial?: boolean;
  page?: number;
}

export interface FetchServersResult {
  servers: DiscoverableMcpServer[];
  totalCount: number;
}
