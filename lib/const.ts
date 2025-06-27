import { LayoutGrid, Info, BookOpen, Github, Home } from 'lucide-react';

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || '#';

// We export the components and the data separately now.
export const iconMap = {
  LayoutGrid,
  Info,
  BookOpen,
  Github,
  Home,
};

// The type for our icon names
export type IconName = keyof typeof iconMap;

export const baseNavLinks = [
  { href: '/servers', label: 'Browse', iconName: 'LayoutGrid' as IconName },
  {
    href: '/docs/what-is-mcp',
    label: 'What is MCP?',
    iconName: 'BookOpen' as IconName,
  },
  { href: '/about', label: 'About', iconName: 'Info' as IconName },
  {
    href: GITHUB_URL,
    label: 'GitHub',
    iconName: 'Github' as IconName,
    isExternal: true,
  },
];
