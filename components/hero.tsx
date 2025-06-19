import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CodeSnippet } from '@/components/ui/code-snippet';
import { Github } from 'lucide-react'; // Optional: for an icon

const GITHUB_REPO_URL = process.env.NEXT_PUBLIC_GITHUB_URL;

export async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const exampleApiRequest = `curl -X GET "https://remote-mcp-servers.com/api/servers?limit=3"`;

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 xl:py-32 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Discover & Share MCP Servers
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Explore a community-driven list of remote Model Context Protocol
            servers. Add your own to help grow the ecosystem and connect AI
            agents globally.
          </p>
        </div>

        <div className="hidden md:block">
          <CodeSnippet
            codeString={exampleApiRequest}
            title="Quick Start"
            language="bash"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {' '}
          {/* Added flex-wrap for responsiveness */}
          {user ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Your Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="default">
              <Link href="/auth/login">Add Your Server</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            {/* Using <a> tag for external link, with target="_blank" */}
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              {/* Optional: Icon */}
              <Github className="mr-1 h-5 w-5" />
              Read the Docs
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
