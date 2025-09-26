import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex gap-5 items-center font-semibold">
      <Link href="/" aria-label="Go to homepage">
        <div className="flex items-center gap-2">
          <Image src="/rmcps.png" alt="RMCPS Logo" width={154} height={64} />
        </div>
      </Link>
    </div>
  );
}
