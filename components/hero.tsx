// src/app/Hero.tsx (or your Hero component file)
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // Keep if still needed for user check
// import { CodeSnippet } from '@/components/ui/code-snippet'; // REMOVE THIS
import { Github, LogIn, LayoutDashboard } from 'lucide-react';
// import { BASE_URL } from '@/const'; // REMOVE IF ONLY USED FOR SNIPPETS
import SearchForm from '@/components/search-form'; // Assuming this is in src/components/

const GITHUB_REPO_URL = process.env.NEXT_PUBLIC_GITHUB_URL;

export default async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="w-full py-20 md:py-24 lg:py-36 bg-gradient-to-b ">
      {' '}
      {/* Example gradient */}
      <div className="m-auto container px-6 md:px-6 text-center">
        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
          <h1 className="text-4xl max-w-6xl mb-8 m-auto font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Discover & Share Remote MCP Servers
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Explore a community-driven list of remote Model Context Protocol
            servers that have been tested and approved.
          </p>
        </div>

        <div className="mb-10 md:mb-12">
          <SearchForm />
        </div>

        <div className="mb-10 md:mb-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
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
              className="min-w-[200px]">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-5 w-5" />
                Add Your Server
              </Link>
            </Button>
          )}
          {GITHUB_REPO_URL && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[200px]">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </Button>
          )}
        </div>

        {/* CODE SNIPPETS REMOVED FROM HERE */}
      </div>
    </section>
  );
}
