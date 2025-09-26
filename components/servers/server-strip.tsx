import ServerCard from '../server-card';

// CHANGED: Update the props interface to use the new server type.
interface ServerStripProps {
  title: string;
  servers: SpecServerObject[];
}

export function ServerStrip({ title, servers }: ServerStripProps) {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6 text-foreground">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This mapping logic is already correct, as long as ServerCard now accepts a SpecServerObject */}
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
}
