// src/app/docs/what-is-mcp/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'What is the Model Context Protocol (MCP)? | MCP Server Registry',
  description:
    'Learn about the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs, and how it enables a new ecosystem of AI tools and integrations.',
};

// It's good practice to define constants for external links
const OFFICIAL_MCP_WEBSITE_URL = 'https://modelcontextprotocol.org'; // Assuming this is the main site, or use the most appropriate link from the spec
const MCP_GITHUB_URL = 'https://github.com/modelcontextprotocol';

export default function WhatIsMcpPage() {
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
        <h1>Understanding the Model Context Protocol (MCP)</h1>

        <p>
          The Model Context Protocol (MCP) is an{' '}
          <strong>
            open protocol that standardizes how applications provide context to
            Large Language Models (LLMs)
          </strong>
          . Think of MCP like a &quot;USB-C port for AI applications&quot;: it
          offers a standardized way to connect AI models to diverse data
          sources, tools, and capabilities.
        </p>

        <h2>Why MCP? The Core Benefits</h2>
        <p>
          MCP is designed to help developers build powerful AI agents and
          complex workflows on top of LLMs. Key advantages include:
        </p>
        <ul>
          <li>
            <strong>Simplified Integrations:</strong> Access a growing ecosystem
            of pre-built MCP servers, allowing LLMs to directly plug into
            various data sources and tools.
          </li>
          <li>
            <strong>Flexibility and Vendor Neutrality:</strong> Gain the ability
            to more easily switch between different LLM providers and vendors
            without overhauling integrations.
          </li>
          <li>
            <strong>Enhanced Security:</strong> MCP promotes best practices for
            securing your data, especially when integrating with local data
            sources within your own infrastructure.
          </li>
        </ul>

        <h2>Core Architecture: Clients and Servers</h2>
        <p>
          MCP operates on a client-server architecture. Here&apos;s a simplified
          overview:
        </p>
        <ul>
          <li>
            <strong>MCP Hosts:</strong> These are applications (like Claude
            Desktop, IDEs, or custom AI tools) that want to leverage data and
            tools via MCP.
          </li>
          <li>
            <strong>MCP Clients:</strong> Residing within a Host, a client
            establishes and manages a connection to a specific MCP Server.
          </li>
          <li>
            <strong>MCP Servers:</strong> These are programs that expose
            specific capabilities (e.g., access to a local file system, a
            database, or a web API) through the standardized Model Context
            Protocol. Your registry lists these discoverable servers.
          </li>
        </ul>
        <p>
          A single Host can connect to multiple MCP Servers simultaneously,
          allowing it to aggregate context and capabilities from various
          sources.
        </p>

        <h2>Key Capabilities Enabled by MCP</h2>
        <p>
          MCP defines several core concepts that allow servers to expose rich
          functionalities to LLMs, such as:
        </p>
        <ul>
          <li>
            <strong>Resources:</strong> Exposing data and content (e.g., files,
            database entries) to LLMs.
          </li>
          <li>
            <strong>Prompts:</strong> Creating reusable prompt templates and
            structured workflows.
          </li>
          <li>
            <strong>Tools:</strong> Enabling LLMs to perform actions by invoking
            functions on the server.
          </li>
          {/* You can add more like Sampling, Transports if you want more detail, but these three are very illustrative */}
        </ul>

        <h2>How This Registry Relates to MCP</h2>
        <p>
          The MCP Server Registry you&apos;re exploring is a community hub for
          discovering publicly available **MCP Servers**. These servers
          implement the Model Context Protocol, offering various capabilities
          that can be integrated into MCP Hosts and Clients. Our goal is to make
          it easier for developers to find and utilize these servers, fostering
          growth and innovation within the MCP ecosystem.
        </p>

        <h2>Dive Deeper into MCP</h2>
        <p>
          This page provides a high-level overview. For the complete
          specification, SDKs, tutorials, and community discussions, please
          visit the official Model Context Protocol resources:
        </p>
        <ul className="list-none pl-0">
          {' '}
          {/* list-none to remove bullets for link list */}
          <li className="mb-2">
            <a
              href={OFFICIAL_MCP_WEBSITE_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline">
              Official MCP Website <ExternalLink className="ml-1 h-4 w-4" />
            </a>
            {/* Replace # with the actual main website URL if different from GitHub */}
          </li>
          <li>
            <a
              href={MCP_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline">
              MCP on GitHub (Specifications, SDKs, Examples){' '}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </li>
        </ul>

        <p className="mt-6">
          Ready to find a server?{' '}
          <Link href="/servers">Browse the MCP Server Registry</Link>.
        </p>
      </article>
    </div>
  );
}
