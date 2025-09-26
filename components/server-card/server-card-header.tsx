import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
// Assuming SpecServerObject is exported from the parent or a types file

// CHANGED: The component now accepts the full server object
interface ServerCardHeaderProps {
  server: SpecServerObject;
}

export default function ServerCardHeader({ server }: ServerCardHeaderProps) {
  // --- Data Extraction and Transformation ---
  // This is where we adapt the new data structure for our UI.

  // 1. Safely access our custom metadata
  const customMeta = server.meta?.['com.remote-mcp-servers.metadata'];

  // 2. Determine the best name to display
  const displayName = customMeta?.human_friendly_name || server.name;

  // 3. Get the icon URL from our custom metadata
  const iconUrl = customMeta?.icon_url;

  // 4. Derive maintainer info from the repository URL
  const repoUrl = server.repository?.url;
  let maintainerName: string | null = null;
  if (repoUrl) {
    try {
      // Simple parser for GitHub/GitLab-like URLs (e.g., https://github.com/author/repo)
      const urlParts = new URL(repoUrl).pathname.split('/');
      if (urlParts.length > 1 && urlParts[1]) {
        maintainerName = urlParts[1];
      }
    } catch {
      // Ignore malformed URLs
      maintainerName = null;
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <Avatar className="h-12 w-12 rounded-xl border-2 border-border/50 bg-muted shadow-sm">
        {/* CHANGED: Use the extracted iconUrl */}
        <AvatarImage src={iconUrl ?? undefined} alt={displayName} />
        <AvatarFallback className="rounded-xl text-sm font-semibold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
          {/* CHANGED: Use the derived displayName */}
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="text-xl font-bold leading-tight text-foreground mb-1">
          {/* CHANGED: Use the derived displayName */}
          {displayName}
        </h3>
        {/* CHANGED: Render a proper link only if we have the data */}
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
