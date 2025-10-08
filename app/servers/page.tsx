import { Suspense } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import ServerBrowser from '@/components/server-browser';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next/types';
import { BASE_URL } from '@/const';

export const metadata: Metadata = {
  title: 'Browse All MCP Servers | Remote MCP Servers',
  description:
    'Discover and browse a curated list of MCP-compatible servers. Find tools for AI, development, productivity, and more.',
  alternates: {
    canonical: `${BASE_URL}/servers`,
  },
};

export default async function ServersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center md:mb-16 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/70 mb-2">
              Remote MCP Servers
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Discover and browse community-driven MCP servers
            </p>
          </div>
          <Button
            variant="default"
            asChild
            className="mt-6 sm:mt-0 transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-md">
            <Link href="/servers/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Server
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">
                Loading servers...
              </p>
            </div>
          }>
          <ServerBrowser />
        </Suspense>
      </div>
    </div>
  );
}
