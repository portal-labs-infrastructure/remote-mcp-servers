import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getInitials } from '@/lib/utils';

// Assuming DiscoverableMcpServer is your server type from the database
interface ServerDetailCardProps {
  server: DiscoverableMcpServer;
}

export function ServerHeader({ server }: ServerDetailCardProps) {
  return (
    <div className="flex justify-between items-start gap-8 flex-wrap">
      <div className="flex gap-6 flex-wrap">
        <Avatar className="h-24 w-24 rounded-lg border bg-muted">
          {' '}
          {/* size="lg", variant="outlined", custom borderRadius */}
          <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
          <AvatarFallback className="rounded-lg text-sm">
            {getInitials(server.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-3xl font-bold">
            <h1>{server.name}</h1>
          </CardTitle>
          <CardDescription className="text-lg mt-1 max-w-2xl">
            {server.description}
          </CardDescription>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/servers/${server.id}.md`}
                target="_blank"
                rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View as Markdown
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Badge variant="secondary" className="whitespace-nowrap text-sm">
        {server.category}
      </Badge>
    </div>
  );
}
