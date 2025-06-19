import { ThemeSwitcher } from '@/components/theme-switcher';

export default function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || '';

  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-12">
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
  );
}
