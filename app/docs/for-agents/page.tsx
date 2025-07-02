// src/app/docs/for-agents/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { BASE_URL } from '@/const';

export const metadata: Metadata = {
  title: 'For AI Agents & Developers | Remote MCP Servers',
  description:
    'Learn how the Remote MCP Server registry is optimized for AI agents, using the llms.txt standard and providing machine-readable Markdown endpoints.',
  alternates: {
    canonical: `${BASE_URL}/docs/for-agents`,
  },
};

// Constant for the official llms.txt specification website
const LLMSTXT_ORG_URL = 'https://llmstxt.org';

export default function ForAgentsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <h1>Built for Humans and AI Agents</h1>

        <p>
          Remote MCP Servers is designed from the ground up to be a{' '}
          <strong>first-class resource for both humans and machines</strong>. We
          believe that for AI agents to become truly capable, the web needs to
          be more programmatically accessible.
        </p>
        <p>
          To support this, we have implemented emerging standards that make our
          content easier for Large Language Models (LLMs) and other automated
          systems to understand and consume.
        </p>

        <h2>
          The <code>llms.txt</code> Standard
        </h2>
        <p>
          This site provides an <code>llms.txt</code> file, a proposed standard
          that acts as a &quot;cheat sheet&quot; for AI agents. It gives them a
          concise, structured overview of the site&apos;s purpose and points
          them to the most important, machine-readable content. This helps an
          agent quickly understand what our registry is and how to use it
          effectively during inference.
        </p>
        <ul className="list-none pl-0">
          <li className="mb-2">
            <Link
              href="/llms.txt"
              target="_blank"
              className="inline-flex items-center text-primary hover:underline">
              View this site&apos;s llms.txt file{' '}
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </li>
          <li>
            <a
              href={LLMSTXT_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline">
              Learn about the llms.txt specification{' '}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </li>
        </ul>

        <h2>Machine-Readable Markdown Endpoints</h2>
        <p>
          To complement the <code>llms.txt</code> file, all key pages on this
          site offer a clean, &quot;reader mode&quot; version of their content
          in Markdown format. This allows a developer or an AI agent to fetch
          the raw information of a page without any of the surrounding UI,
          making it ideal for data extraction, documentation, or ingestion into
          other tools.
        </p>
        <p>
          To access it, simply append <code>.md</code> to the URL of a page.
        </p>
        <h3>Examples:</h3>
        <ul>
          <li>
            <strong>All Servers List:</strong>{' '}
            <Link href="/servers.md" target="_blank">
              <code>/servers.md</code>
            </Link>
          </li>
          <li>
            <strong>A Specific Server&apos;s Details:</strong>{' '}
            <Link
              href="/servers/45617fc5-1f0d-4d77-affd-0ddfaf47a672.md"
              target="_blank">
              <code>/servers/45617fc5-1f0d-4d77-affd-0ddfaf47a672.md</code>
            </Link>
          </li>
          <li>
            <strong>About Page:</strong>{' '}
            <Link href="/about.md" target="_blank">
              <code>/about.md</code>
            </Link>
          </li>
        </ul>

        <p className="mt-6">
          We are committed to improving the human-machine web. Ready to find a
          server? <Link href="/servers">Browse remote MCP servers</Link>.
        </p>
      </article>
    </div>
  );
}
