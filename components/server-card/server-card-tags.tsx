import { Badge } from '@/components/ui/badge';
// Make sure this import path is correct for your project structure

// CHANGED: The component now accepts the full server object to access its 'meta' property.
interface ServerCardTagsProps {
  server: SpecServerObject;
}

export default function ServerCardTags({ server }: ServerCardTagsProps) {
  // --- Data Extraction ---
  // Safely access our custom metadata from the nested 'meta' object.
  // The '|| {}' provides a safe fallback if the namespace doesn't exist.
  const customMeta = server.meta?.['com.remote-mcp-servers.metadata'] || {};

  // Extract the specific values we need for the badges.
  const authType = customMeta.authentication_type;
  const hasDcr = customMeta.dynamic_client_registration === true;
  const isOfficial = customMeta.is_official === true;

  return (
    <div className="flex flex-col gap-4 flex-grow">
      {/* mt-auto pushes the content to the bottom of the flex container */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex flex-row flex-wrap gap-2">
          {/* CHANGED: Conditionally render the auth type badge only if it exists */}
          {authType && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors">
              {authType}
            </Badge>
          )}

          {/* CHANGED: Check the 'hasDcr' variable */}
          {hasDcr && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">
              DCR
            </Badge>
          )}

          {/* CHANGED: Check the 'isOfficial' variable */}
          {isOfficial && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              Official
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
