import { Card, CardContent } from '@/components/ui/card'; // Shadcn Card
import { Separator } from '@/components/ui/separator'; // Shadcn Separator

// Import the refactored sub-components
import ServerCardHeader from './server-card-header';
import ServerCardBody from './server-card-body';
import ServerCardActions from './server-card-actions';
import ServerCardTags from './server-card-tags';

interface ServerCardProps {
  server: SpecServerObject;
}

export default function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl h-full flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex-grow flex flex-col gap-5 p-5 md:p-6">
        <ServerCardHeader server={server} />
        <ServerCardBody server={server} />
        <ServerCardTags server={server} />
      </CardContent>
      <Separator className="bg-border/30" />
      <CardContent className="flex flex-col p-5 md:p-6 bg-muted/20">
        <ServerCardActions server={server} />
      </CardContent>
    </Card>
  );
}
