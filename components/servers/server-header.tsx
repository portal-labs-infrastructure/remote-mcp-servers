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
      <div className="flex gap-6 flex-wrap">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={server.icon_url ?? undefined}
            alt={`${server.name} logo`}
          />
          <AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl font-bold">
            <h1>{server.name}</h1>
          </CardTitle>
          <CardDescription className="text-lg mt-1">
            {server.description}
          </CardDescription>
        </div>
      </div>
      <Badge variant="secondary" className="whitespace-nowrap text-sm">
        {server.category}
      </Badge>
    </div>
  );
}
