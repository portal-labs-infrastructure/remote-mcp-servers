// src/components/landing/CodeExamples.tsx
import { CodeSnippet } from '@/components/ui/code-snippet'; // Assuming this is your custom component
import Link from 'next/link';

export default function CodeExamples() {
  const exampleApiRequest = `curl "https://remote-mcp-servers.com/api/v0/servers?limit=3"`;

  return (
    <section className="relative py-20 md:py-24 lg:py-28 overflow-hidden">
      {/* Enhanced background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-muted/40 to-muted/30"></div>
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(24, 111, 170, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(39, 182, 214, 0.1) 0%, transparent 50%),
            linear-gradient(90deg, transparent 0%, rgba(24, 111, 170, 0.03) 50%, transparent 100%)
          `,
        }}></div>

      <div className="relative container mx-auto px-4 sm:px-6 max-w-full overflow-hidden">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Explore Our Standards-Compliant API
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Our registry exposes a powerful HTTP API that fully conforms to the
            official MCP Generic Registry Specification.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto w-full">
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] w-full min-w-0">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="min-w-0">List Servers (v0 API)</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Fetch a list of available remote servers using our
                spec-compliant endpoint.
              </p>
            </div>
            <div className="min-w-0">
              <CodeSnippet
                codeString={exampleApiRequest}
                title="API Request"
                language="bash"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help getting started? Check out our documentation for more
            examples and integration guides.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/servers"
              className="inline-flex items-center px-4 py-2 bg-card/80 hover:bg-card border border-border/50 text-foreground rounded-lg text-sm font-medium transition-colors duration-200">
              Browse Servers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
