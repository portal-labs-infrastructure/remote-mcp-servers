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
      <div className="flex gap-6 flex-wrap items-start">
        <Avatar className="h-28 w-28 rounded-2xl border-2 border-border/50 bg-muted shadow-lg">
          <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
          <AvatarFallback className="rounded-2xl text-lg font-bold bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
            {getInitials(server.name)}
          </AvatarFallback>
        </Avatar>
        <div className="gap-4 md:gap-2 flex flex-col justify-center">
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              {server.name}
            </h1>
          </CardTitle>
          <CardDescription className="text-lg md:text-xl mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            {server.description}
          </CardDescription>
        </div>
      </div>
    </div>
  );
}
