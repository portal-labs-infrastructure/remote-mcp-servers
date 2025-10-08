interface ServerCardBodyProps {
  server: SpecServerObject;
}

export default function ServerCardBody({ server }: ServerCardBodyProps) {
  // Use only standard MCP registry spec fields
  const description = server.description;

  return (
    <div className="flex flex-col gap-4 flex-grow">
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
