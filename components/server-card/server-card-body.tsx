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
      {server.category && (
        <Badge
          variant="outline"
          className="self-start text-xs font-medium px-3 py-1 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors">
          {server.category}
        </Badge>
      )}
      {server.description && (
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {server.description}
          </p>
        </div>
      )}
    </div>
  );
}
