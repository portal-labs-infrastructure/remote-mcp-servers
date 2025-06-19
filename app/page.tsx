import { EnvVarWarning } from '@/components/env-var-warning';
import { AuthButton } from '@/components/auth-button';
import { Hero } from '@/components/hero';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import Servers from '@/components/servers';

export default function Home() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || '';

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={'/'}>
                <div className="flex items-center gap-2">
                  <Image
                    src="/mcp.svg"
                    alt="MCP Logo"
                    width={24}
                    height={24}
                    className="dark:invert"
                  />
                  <p className="text-lg">MCP</p>
                </div>
              </Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-10 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <Servers />
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-16">
          <p>
            <a
              href={githubUrl}
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer">
              Powered by the community
            </a>{' '}
            &copy; {new Date().getFullYear()}
          </p>

          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
