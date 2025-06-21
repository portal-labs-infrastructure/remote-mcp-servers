// src/components/landing/CodeExamples.tsx
import { CodeSnippet } from '@/components/ui/code-snippet'; // Assuming this is your custom component
import { BASE_URL } from '@/const';

export default function CodeExamples() {
  const exampleApiRequest = `curl -X GET "${BASE_URL}/api/servers?limit=3"`;
  const mcpRegistryConnectionUrl = `https://${new URL(BASE_URL).host}/api/mcp`;

  return (
    <section className="py-20 md:py-24 lg:py-28 bg-muted/40">
      {' '}
      {/* Slightly different background */}
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10 text-foreground">
          Quick Connect
        </h2>
        <div className="flex flex-col gap-4 lg:gap-4 max-w-4xl mx-auto">
          <CodeSnippet
            codeString={exampleApiRequest}
            title="List Servers (HTTP API)"
            language="bash"
          />
          <CodeSnippet
            codeString={mcpRegistryConnectionUrl}
            title="This Registry's MCP Url"
            language="plaintext"
          />
        </div>
      </div>
    </section>
  );
}
