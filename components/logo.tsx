import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
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
          <p className="text-lg text-primary">RMCPS</p>
        </div>
      </Link>
    </div>
  );
}
