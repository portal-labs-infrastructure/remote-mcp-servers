import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface ServerCardHeaderProps {
  server: SpecServerObject;
}

export default function ServerCardHeader({ server }: ServerCardHeaderProps) {
  // Use only standard MCP registry spec fields
  const displayName = server.name;

  // Try to get icon from any metadata namespace that has it
  let iconUrl: string | undefined;
  if (server.meta) {
    // Check all metadata namespaces for an icon_url
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

  // Derive maintainer from repository URL
  const repoUrl = server.repository?.url;
  let maintainerName: string | null = null;
  if (repoUrl) {
    try {
      const urlParts = new URL(repoUrl).pathname.split('/');
      if (urlParts.length > 1 && urlParts[1]) {
        maintainerName = urlParts[1];
      }
    } catch {
      maintainerName = null;
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <Avatar className="h-12 w-12 rounded-xl border-2 border-border/50 bg-muted shadow-sm">
        <AvatarImage src={iconUrl} alt={displayName} />
        <AvatarFallback className="rounded-xl text-sm font-semibold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="text-xl font-bold leading-tight text-foreground mb-1">
          {displayName}
        </h3>
        {maintainerName && repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer truncate block max-w-[200px] sm:max-w-[250px]">
            by {maintainerName}
          </a>
        )}
      </div>
    </div>
  );
}
