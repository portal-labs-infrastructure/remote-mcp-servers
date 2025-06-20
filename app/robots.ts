import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/dashboard/'],
    },
    sitemap: `https://remote-mcp-servers.com/sitemap.xml`,
  };
}
