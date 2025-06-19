import { EnvVarWarning } from '@/components/env-var-warning';
import { AuthButton } from '@/components/auth-button';
import { hasEnvVars } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function AppBar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
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
  );
}
