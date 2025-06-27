// src/app/about/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Target, Code2, Heart } from 'lucide-react'; // Example icons
import { BASE_URL } from '@/const';

export const metadata: Metadata = {
  title: 'About | Remote MCP Servers',
  description:
    'Learn more about the Remote MCP Server registry, its mission, and the technology behind the MCP standard.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
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
        <h1>About</h1>

        <p>
          Welcome to the Remote MCP Server Registry! This platform is a
          community-driven initiative dedicated to making it easier to discover,
          share, and connect with remote Model Context Protocol (MCP) servers.
        </p>

        <div className="my-8 p-6 bg-muted/50 rounded-lg not-prose">
          {' '}
          {/* 'not-prose' to control styling inside */}
          <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <Target className="mr-3 h-7 w-7 text-primary" />
            Our Mission
          </h2>
          <p className="text-muted-foreground">
            Our goal is to foster a more interconnected and interoperable AI
            ecosystem. By providing a central directory for MCP servers, we aim
            to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
            <li>
              Accelerate the development and adoption of MCP-enabled
              applications.
            </li>
            <li>
              Enable AI agents to dynamically discover and utilize new
              capabilities.
            </li>
            <li>
              Build a vibrant community around the Model Context Protocol.
            </li>
          </ul>
        </div>

        <h2>
          <Users className="inline-block mr-2 h-6 w-6 text-primary" />
          Who is this for?
        </h2>
        <p>This registry is for:</p>
        <ul>
          <li>
            <strong>AI Developers:</strong> Looking for MCP endpoints to
            integrate into their applications or agents.
          </li>
          <li>
            <strong>Service Providers:</strong> Wanting to make their
            MCP-enabled services discoverable to a wider audience.
          </li>
        </ul>

        <h2>
          <Code2 className="inline-block mr-2 h-6 w-6 text-primary" />
          How it Works
        </h2>
        <p>
          Users can submit their public MCP servers to the registry. Each server
          is then tested to make sure it works. Once its approved, users can
          then browse, search, rate and review these servers.
        </p>
        <p>
          The registry provides a human-friendly web interface, an API, and a
          MCP server for programmatic access to the server list.
        </p>

        <h2>
          <Heart className="inline-block mr-2 h-6 w-6 text-primary" />
          Contributing & Feedback
        </h2>
        <p>
          This project is for the community, by the community. Your
          contributions and feedback are highly valued. You can contribute by:
        </p>
        <ul>
          <li>Adding your MCP servers to the registry.</li>
          <li>
            Reporting issues or suggesting features on our{' '}
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'}
              target="_blank"
              rel="noopener noreferrer">
              GitHub repository
            </Link>
            .
          </li>
          <li>
            Spreading the word to others who might find this registry useful.
          </li>
        </ul>
        <p>
          Let&apos;s build a more connected AI future, one MCP server at a time!
        </p>
      </article>
    </div>
  );
}
