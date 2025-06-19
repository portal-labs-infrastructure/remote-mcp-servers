import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ServerCardHeaderProps {
  server: Pick<
    DiscoverableMcpServer,
    'name' | 'icon_url' | 'maintainer_name' | 'maintainer_url'
  >;
}

export default function ServerCardHeader({ server }: ServerCardHeaderProps) {
  // Fallback initials for Avatar
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      {' '}
      {/* Replaces Stack direction="row" gap={1.5} */}
      <Avatar className="h-12 w-12 rounded-lg border">
        {' '}
        {/* size="lg", variant="outlined", custom borderRadius */}
        <AvatarImage src={server.icon_url ?? undefined} alt={server.name} />
        <AvatarFallback className="rounded-lg text-sm">
          {getInitials(server.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {' '}
        {/* Replaces Stack (default direction column) */}
        <h3 className="text-lg font-semibold leading-tight">
          {server.name}
        </h3>{' '}
        {/* Typography level="title-lg" */}
        {server.maintainer_name && server.maintainer_url && (
          <Link
            href={server.maintainer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary truncate block max-w-[200px] sm:max-w-[250px]" // MuiLink styling + truncation
          >
            {server.maintainer_name}
            <ExternalLink className="inline-block h-3 w-3 ml-1 align-baseline" />{' '}
            {/* endDecorator */}
          </Link>
        )}
      </div>
    </div>
  );
}
