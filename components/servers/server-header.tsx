import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';

// Assuming DiscoverableMcpServer is your server type from the database
interface ServerDetailCardProps {
  server: DiscoverableMcpServer;
}

export function ServerHeader({ server }: ServerDetailCardProps) {
  return (
    <div className="flex justify-between items-start flex-wrap">
      <div className="flex gap-5 flex-wrap">
        <Avatar className="h-24 w-24 rounded-lg border bg-muted">
          {' '}
          {/* size="lg", variant="outlined", custom borderRadius */}
          <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
          <AvatarFallback className="rounded-lg text-sm">
            {getInitials(server.name)}
          </AvatarFallback>
        </Avatar>
        <div className="gap-4 md:gap-1 flex flex-col">
          <CardTitle className="text-4xl font-bold">
            <h1>{server.name}</h1>
          </CardTitle>
          <CardDescription className="text-lg mt-1 max-w-2xl">
            {server.description}
          </CardDescription>
        </div>
      </div>
    </div>
  );
}
