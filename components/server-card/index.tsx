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
    <Card className="shadow-xl hover:shadow-2xl h-full flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] border-2 border-border/80 hover:border-primary/50 bg-card backdrop-blur-sm">
      <CardContent className="flex-grow flex flex-col gap-5 p-5 md:p-6">
        <ServerCardHeader server={server} />
        <ServerCardBody server={server} />
        <ServerCardTags server={server} />
      </CardContent>
      <Separator className="bg-border/50" />
      <CardContent className="flex flex-col p-5 md:p-6 bg-muted/30">
        <ServerCardActions server={server} />
      </CardContent>
    </Card>
  );
}
