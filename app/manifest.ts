import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Remote MCP Server Registry | Discover Remote Model Context Protocol Servers',
    short_name: 'Remove MCP Server Registry',
    description:
      'Explore a community-maintained list of remote Model Context Protocol (MCP) servers. Find, learn about, and check the reachability of MCP-enabled services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/mcp.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  };
}
