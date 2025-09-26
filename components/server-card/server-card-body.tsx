import { Badge } from '@/components/ui/badge';
// Ensure this import path is correct for your project

// CHANGED: The component now accepts the full server object to access 'meta' and 'description'.
interface ServerCardBodyProps {
  server: SpecServerObject;
}

export default function ServerCardBody({ server }: ServerCardBodyProps) {
  // --- Data Extraction ---
  // Safely access our custom metadata for the category.
  const customMeta = server.meta?.['com.remote-mcp-servers.metadata'] || {};
  const category = customMeta.category;

  // The description is a top-level property in the new object.
  const description = server.description;

  return (
    <div className="flex flex-col gap-4 flex-grow">
      {/* CHANGED: Check the extracted 'category' variable */}
      {category && (
        <Badge
          variant="outline"
          className="self-start text-xs font-medium px-3 py-1 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors">
          {category}
        </Badge>
      )}

      {/* CHANGED: Check the top-level 'description' variable */}
      {description && (
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
