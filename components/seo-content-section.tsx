import Link from 'next/link';

export default function SeoContentSection() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-background">
      {' '}
      {/* Use theme background */}
      <div className="container max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div className="space-y-2">
          {' '}
          {/* Simpler structure without Card for now */}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            What is MCP?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Model Context Protocol (MCP) is USB for AI agents, enabling
            seamless communication between AI models and applications.
            {/* TODO: Expand this content or link to full docs */}
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
            We test and verify each server to ensure reliability and
            performance, making it easier for developers to connect their AI
            applications.
          </p>
          <Link
            href="/about"
            className="text-sm font-medium text-primary hover:underline">
            About this project &rarr;
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How to Contribute
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Help grow the MCP ecosystem! Submit your public MCP server to the
            registry. It&apos;s easy to get started if you have an account.
          </p>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-primary hover:underline">
            Add your server &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
