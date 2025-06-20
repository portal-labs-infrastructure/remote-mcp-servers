import { BASE_URL } from '@/const';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/dashboard/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
