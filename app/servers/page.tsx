import { Suspense } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import ServerBrowser from '@/components/server-browser';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ServersPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center md:mb-12 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4 sm:mb-0">
          Remote MCP Servers
        </h1>
        {/* You could add a "Submit Server" button here if desired */}
        <Button asChild>
          <Link href="/servers/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Server
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }>
        <ServerBrowser />
      </Suspense>
    </div>
  );
}
