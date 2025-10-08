import { Badge } from '@/components/ui/badge';
import { Server, Package } from 'lucide-react';

interface ServerCardTagsProps {
  server: SpecServerObject;
}

export default function ServerCardTags({ server }: ServerCardTagsProps) {
  // Use only standard MCP registry spec fields
  const hasRemotes = server.remotes && server.remotes.length > 0;
  const latestVersion = server.latest_version;

  // Get repository source for badge
  const repoSource = server.repository?.source;

  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex flex-row flex-wrap gap-2">
          {/* Show remote type badge */}
          {hasRemotes && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors flex items-center gap-1">
              <Server className="h-3 w-3" />
              Remote
            </Badge>
          )}

          {/* Show repository source */}
          {repoSource && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors flex items-center gap-1">
              <Package className="h-3 w-3" />
              {repoSource}
            </Badge>
          )}

          {/* Show version if available */}
          {latestVersion && (
            <Badge variant="outline" className="text-xs font-medium px-2 py-1">
              v{latestVersion}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
