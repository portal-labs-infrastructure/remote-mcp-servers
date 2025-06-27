import { Card, CardContent } from '@/components/ui/card'; // Shadcn Card
import { Separator } from '@/components/ui/separator'; // Shadcn Separator

// Import the refactored sub-components
import ServerCardHeader from './server-card-header';
import ServerCardBody from './server-card-body';
import ServerCardActions from './server-card-actions';
import ServerCardTags from './server-card-tags';

interface ServerCardProps {
  server: DiscoverableMcpServer;
}

export default function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className="shadow-sm h-full flex flex-col overflow-hidden">
      {' '}
      {/* sx.boxShadow, height, display, flexDirection */}
      <CardContent className="flex-grow flex flex-col gap-4 p-4 md:p-5">
        {' '}
        {/* sx.flexGrow, display, flexDirection, gap, padding */}
        <ServerCardHeader server={server} />
        <ServerCardBody server={server} />
        <ServerCardTags server={server} />
      </CardContent>
      <Separator /> {/* Divider */}
      <CardContent className="flex flex-col p-4 md:p-5 bg-muted/40">
        <ServerCardActions server={server} />
      </CardContent>
    </Card>
  );
}
