import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogIn, LayoutDashboard } from 'lucide-react';
import SearchForm from '@/components/search-form';

export default async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="w-full py-20 md:py-24 lg:py-24 bg-gradient-to-b ">
      {' '}
      {/* Example gradient */}
      <div className="m-auto container px-6 md:px-6 text-center">
        <div className="mb-8 md:mb-10 text-left md:text-center">
          <h1 className="text-4xl max-w-1xl mb-6 m-auto font-bold tracking-tighter sm:text-4xl md:text-4xl lg:text-5xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Discover Remote MCP Servers
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            A community-driven registry of remote MCP servers, enabling seamless
            integration with MCP clients. Find, add, and manage remote MCP
            servers effortlessly.
          </p>
        </div>

        <div className="mb-10 md:mb-12">
          <SearchForm />
        </div>

        <div className="mb-10 md:mb-12 flex flex-wrap justify-left md:justify-center items-center gap-3 sm:gap-4">
          {user ? (
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              variant="default"
              className="min-w-[160px]">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-5 w-5" />
                Add Your Server
              </Link>
            </Button>
          )}
        </div>

        {/* CODE SNIPPETS REMOVED FROM HERE */}
      </div>
    </section>
  );
}
