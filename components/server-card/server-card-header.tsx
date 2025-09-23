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
    <div className="flex flex-row gap-4">
      <Avatar className="h-16 w-16 rounded-xl border-2 border-border/50 bg-muted shadow-sm">
        <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
        <AvatarFallback className="rounded-xl text-sm font-semibold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
          {getInitials(server.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold leading-tight text-foreground mb-1">
          {server.name}
        </h3>
        {server.maintainer_name && server.maintainer_url && (
          <p className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer truncate block max-w-[200px] sm:max-w-[250px]">
            {server.maintainer_name}
          </p>
        )}
      </div>
    </div>
  );
}
