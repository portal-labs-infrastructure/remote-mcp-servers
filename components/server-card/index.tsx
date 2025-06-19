import {
  Card,
  CardContent,
  CardFooter, // Shadcn CardFooter for actions
} from '@/components/ui/card'; // Shadcn Card
import { Separator } from '@/components/ui/separator'; // Shadcn Separator

// Import the refactored sub-components
import ServerCardHeader from './server-card-header';
import ServerCardBody from './server-card-body';
import ServerCardActions from './server-card-actions';

interface ServerCardProps {
  server: DiscoverableMcpServer;
}

export default function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className="shadow-sm h-full flex flex-col">
      {' '}
      {/* sx.boxShadow, height, display, flexDirection */}
      <CardContent className="flex-grow flex flex-col gap-4 p-4 md:p-5">
        {' '}
        {/* sx.flexGrow, display, flexDirection, gap, padding */}
        <ServerCardHeader server={server} />
        <ServerCardBody server={server} />
      </CardContent>
      {/* mt: 'auto' is handled by flex-grow on CardContent and ServerCardBody's inner content */}
      <Separator /> {/* Divider */}
      <CardFooter className="p-4 md:p-5">
        {' '}
        {/* Add padding to CardFooter for actions */}
        <ServerCardActions server={server} />
      </CardFooter>
    </Card>
  );
}
