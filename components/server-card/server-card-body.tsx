import { Badge } from '@/components/ui/badge'; // Shadcn Badge (replaces Chip)

interface ServerCardBodyProps {
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

export default function ServerCardBody({ server }: ServerCardBodyProps) {
  return (
    <div className="flex flex-col gap-4 flex-grow">
      {' '}
      {/* Replaces Stack gap={2} sx={{ flexGrow: 1 }} */}
      {server.category && (
        <Badge variant="outline" className="self-start text-xs">
          {' '}
          {/* Chip styling */}
          {server.category}
        </Badge>
      )}
      {server.description && (
        <div className="flex-grow">
          {' '}
          {/* Box sx={{ flexGrow: 1 }} */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {' '}
            {/* Typography + line clamp */}
            {server.description}
          </p>
        </div>
      )}
    </div>
  );
}
