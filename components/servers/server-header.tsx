import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';

// CHANGED: Update the props interface to use the new server type.
interface ServerHeaderProps {
  server: SpecServerObject;
}

export function ServerHeader({ server }: ServerHeaderProps) {
  // --- Data Extraction ---
  // Safely access our custom metadata from the nested 'meta' object.
  const customMeta = server.meta?.['com.remote-mcp-servers.metadata'] || {};

  // Determine the best name to display, preferring our custom friendly name.
  const displayName = customMeta.human_friendly_name || server.name;

  // Get the icon URL from our custom metadata.
  const iconUrl = customMeta.icon_url;

  return (
    <div className="flex justify-between items-start flex-wrap">
      <div className="flex gap-6 flex-wrap items-start">
        <Avatar className="h-28 w-28 rounded-2xl border-2 border-border/50 bg-muted shadow-lg">
          {/* CHANGED: Use the extracted iconUrl and displayName */}
          <AvatarImage src={iconUrl ?? undefined} alt={displayName} />
          <AvatarFallback className="rounded-2xl text-lg font-bold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="gap-4 md:gap-2 flex flex-col justify-center">
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              {/* CHANGED: Use the displayName */}
              {displayName}
            </h1>
          </CardTitle>
          {/* This part is already correct as 'description' is a top-level property */}
          <CardDescription className="text-lg md:text-xl mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            {server.description}
          </CardDescription>
        </div>
      </div>
    </div>
  );
}
