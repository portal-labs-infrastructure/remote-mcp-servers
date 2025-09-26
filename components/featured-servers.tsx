// src/components/landing/FeaturedServers.tsx
import ServerCard from '@/components/server-card'; // Adjust path if necessary
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedServersProps {
  servers: SpecServerObject[];
}

export default function FeaturedServers({ servers }: FeaturedServersProps) {
  if (!servers || servers.length === 0) {
    // Optionally, render nothing or a placeholder if no servers are featured
    return null;
  }

  return (
    <section className="py-20 md:py-24 lg:py-28 bg-muted/40">
      {' '}
      {/* Or bg-muted/20 for slight differentiation */}
      <div className="container max-w-6xl mx-auto px-6 ">
        <div className="flex justify-between items-center mb-6 md:mb-8 flex-wrap gap-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Recently Added
          </h2>
          <Button asChild variant="outline">
            <Link href="/servers">
              View All Servers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {servers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <ServerCard server={server} key={server.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">
              No servers to feature at the moment.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon or{' '}
              <Link href="/dashboard" className="text-primary hover:underline">
                add your server
              </Link>
              !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
