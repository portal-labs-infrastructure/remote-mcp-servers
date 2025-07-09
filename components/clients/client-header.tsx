interface ClientHeaderProps {
  name: string;
  version: string;
}

export function ClientHeader({ name, version }: ClientHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
      <p className="text-lg text-muted-foreground">Version: {version}</p>
    </div>
  );
}
