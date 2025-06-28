// src/components/layout/Footer.tsx
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Logo from './logo';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || '';

  return (
    <footer className="w-full flex border-t mx-auto pt-16 pb-32">
      <div className="container m-auto max-w-7xl px-6 text-muted-foreground gap-4 flex flex-col">
        <Logo />
        <div className="mb-4">
          <p>Discover and share remote Model Context Protocol servers.</p>
        </div>

        {/* add a divider */}
        <div className="border-t border-muted-foreground/20 my-4" />

        <div className="flex gap-4 mb-4 text-left md:flex-row flex-col">
          <div>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
          </div>
          <div>
            <Link href="/docs/what-is-mcp" className="hover:text-primary">
              What is MCP?
            </Link>
          </div>
          <div>
            <Link href="/docs/for-agents" className="hover:text-primary">
              For AI Agents
            </Link>
          </div>
          <div>
            <Link href="/servers" className="hover:text-primary">
              Browse Servers
            </Link>
          </div>
          <div>
            <a
              href={githubUrl}
              target="_blank" // Opens in a new tab
              rel="noopener noreferrer" // Security best practice for target="_blank"
              className="inline-flex items-center hover:text-primary transition-colors" // For alignment and hover effect
            >
              <ExternalLink className="mr-1.5 h-4 w-4" />{' '}
              {/* Icon to the left, with some right margin */}
              GitHub
            </a>
          </div>

          {/* Add other links like Terms of Service, Privacy Policy if needed */}
        </div>

        {/* Theme switcher */}

        {/* space between */}
        <div className="flex items-center gap-2 text-sm justify-between">
          <p>RMCPS &copy; {new Date().getFullYear()}</p>
          <div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
