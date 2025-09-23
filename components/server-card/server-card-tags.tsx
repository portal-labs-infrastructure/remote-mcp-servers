import { Badge } from '@/components/ui/badge'; // Shadcn Badge (replaces Chip)

interface ServerCardTagsProps {
  server: Pick<
    DiscoverableMcpServer,
    | 'category'
    | 'description'
    | 'mcp_url'
    | 'authentication_type'
    | 'dynamic_client_registration'
    | 'is_official'
  >;
}

export default function ServerCardTags({ server }: ServerCardTagsProps) {
  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div
        className={`flex flex-col gap-3 ${server.description ? 'mt-0' : 'mt-auto'}`}>
        <div className="flex flex-row flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="text-xs font-medium px-2 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors">
            {server.authentication_type}
          </Badge>

          {server.dynamic_client_registration && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">
              DCR
            </Badge>
          )}
          {server.is_official && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              Official
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
