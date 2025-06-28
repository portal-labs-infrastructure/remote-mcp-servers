import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface ServerCardHeaderProps {
  server: Pick<
    DiscoverableMcpServer,
    'name' | 'icon_url' | 'maintainer_name' | 'maintainer_url'
  >;
}

export default function ServerCardHeader({ server }: ServerCardHeaderProps) {
  // Fallback initials for Avatar

  return (
    <div className="flex flex-row gap-3">
      {' '}
      {/* Replaces Stack direction="row" gap={1.5} */}
      <Avatar className="h-16 w-16 rounded-lg border bg-muted">
        {' '}
        {/* size="lg", variant="outlined", custom borderRadius */}
        <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
        <AvatarFallback className="rounded-lg text-sm">
          {getInitials(server.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {' '}
        {/* Replaces Stack (default direction column) */}
        <h3 className="text-lg font-semibold leading-tight">
          {server.name}
        </h3>{' '}
        {/* Typography level="title-lg" */}
        {server.maintainer_name && server.maintainer_url && (
          <p className="text-xs text-muted-foreground hover:text-primary truncate block max-w-[200px] sm:max-w-[250px]">
            {server.maintainer_name}
          </p>
        )}
      </div>
    </div>
  );
}
