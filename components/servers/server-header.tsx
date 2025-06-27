import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';

// Assuming DiscoverableMcpServer is your server type from the database
interface ServerDetailCardProps {
  server: DiscoverableMcpServer;
}

export function ServerHeader({ server }: ServerDetailCardProps) {
  return (
    <div className="flex justify-between items-start gap-8 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        <Avatar className="h-28 w-28">
          <AvatarImage
            src={server.icon_url ?? undefined}
            alt={`${server.name} logo`}
          />
          <AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl font-bold">{server.name}</CardTitle>
          <CardDescription className="text-lg mt-1">
            {server.description}
          </CardDescription>
        </div>
      </div>
      <Badge variant="secondary" className="whitespace-nowrap">
        {server.category}
      </Badge>
    </div>
  );
}
