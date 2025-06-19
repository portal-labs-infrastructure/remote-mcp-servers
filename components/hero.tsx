import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-32 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Discover & Share MCP Servers
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Explore a community-driven list of Model Context Protocol servers.
            Add your own to help grow the ecosystem and connect AI agents
            globally.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Your Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/auth/login">Add Your Server</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
