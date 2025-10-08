import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';

interface ServerHeaderProps {
  server: SpecServerObject;
}

export function ServerHeader({ server }: ServerHeaderProps) {
  // Use only standard MCP registry spec fields
  const displayName = server.name;

  // Try to get icon from any metadata namespace
  let iconUrl: string | undefined;
  if (server.meta) {
    for (const namespace of Object.values(server.meta)) {
      if (
        namespace &&
        typeof namespace === 'object' &&
        'icon_url' in namespace
      ) {
        iconUrl = namespace.icon_url as string;
        break;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-6 items-start">
        <Avatar className="h-20 w-20 rounded-xl border-2 border-border/50 bg-muted shadow-md flex-shrink-0">
          <AvatarImage src={iconUrl} alt={displayName} />
          <AvatarFallback className="rounded-xl text-lg font-bold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            <h1 className="text-foreground">
              {displayName}
            </h1>
          </CardTitle>
          <CardDescription className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {server.description}
          </CardDescription>
        </div>
      </div>
    </div>
  );
}
