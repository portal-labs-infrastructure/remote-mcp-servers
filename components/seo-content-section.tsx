import Link from 'next/link';

export default function SeoContentSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-background">
      <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Column 1: What is MCP? (Unchanged) */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            What is MCP?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Model Context Protocol is like a USB adapter, enabling seamless
            communication between models and applications.
          </p>
          <Link
            href="/docs/what-is-mcp"
            className="text-sm font-medium text-primary hover:underline">
            Learn more &rarr;
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Why This Registry?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Built on the official MCP Registry Specification, providing a stable
            and predictable discovery experience for developers and AI agents.
          </p>
          <Link
            href="/about"
            className="text-sm font-medium text-primary hover:underline">
            About this project &rarr;
          </Link>
        </div>

        {/* Column 3: Easy Integration */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Instant Access
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Connect your MCP client or host to our registry endpoint and
            instantly access hundreds of remote servers from the official
            registry.
          </p>
          <Link
            href="/docs/for-agents"
            className="text-sm font-medium text-primary hover:underline">
            Integration guide &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
