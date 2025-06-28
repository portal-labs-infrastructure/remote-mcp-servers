import Link from 'next/link';

export default function SeoContentSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-background">
      <div className="container max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
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
            The canonical source for MCP servers. Fully searchable and indexed
            for discovery by both developers and AI agents.
          </p>
          <Link
            href="/about"
            className="text-sm font-medium text-primary hover:underline">
            About this project &rarr;
          </Link>
        </div>

        {/* Column 3: How to Contribute (Unchanged) */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How to Contribute
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Help grow the MCP ecosystem! Submit your public MCP server to the
            registry. It&apos;s easy to get started if you have an account.
          </p>
          <Link
            href="/auth/login?redirect=/servers/new"
            className="text-sm font-medium text-primary hover:underline">
            Add your server &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
