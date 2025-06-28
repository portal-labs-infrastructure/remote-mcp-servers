import ServerCard from '../server-card';

interface ServerStripProps {
  title: string;
  servers: DiscoverableMcpServer[];
}

export function ServerStrip({ title, servers }: ServerStripProps) {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
}
