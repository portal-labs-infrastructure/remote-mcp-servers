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
      {/* MCP URL and Metadata Badges will be at the bottom of this component */}
      <div
        className={`flex flex-col gap-3 ${server.description ? 'mt-0' : 'mt-auto'}`}>
        {' '}
        {/* Stack gap={2} sx={{ mt: ... }} */}
        <div className="flex flex-row flex-wrap gap-1.5">
          <Badge
            variant="secondary" // Chip color mapping
            className="text-xs" // size="sm"
          >
            {server.authentication_type}
          </Badge>

          {server.dynamic_client_registration && (
            <Badge variant="secondary" className="text-xs">
              {' '}
              {/* Chip color="primary" */}
              DCR
            </Badge>
          )}
          {server.is_official && (
            <Badge variant="secondary" className="text-xs">
              Official
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
