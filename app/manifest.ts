import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Remote MCP Servers | Discover Remote Model Context Protocol (MCP) Servers',
    short_name: 'Remote MCP Servers',
    description:
      'Explore a community-maintained list of remote Model Context Protocol (MCP) servers. Find, learn about, and comment on MCP servers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/icon.png',
        type: 'image/png',
        sizes: 'any',
      },
    ],
  };
}
