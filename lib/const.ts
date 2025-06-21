import { LayoutGrid, Info, BookOpen, Github } from 'lucide-react'; // Added more icons

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || '#';

export const navLinks = [
  { href: '/servers', label: 'Browse', Icon: LayoutGrid },
  { href: '/docs/what-is-mcp', label: 'What is MCP?', Icon: BookOpen },
  { href: '/about', label: 'About', Icon: Info },
  { href: GITHUB_URL, label: 'GitHub', Icon: Github, isExternal: true },
];
