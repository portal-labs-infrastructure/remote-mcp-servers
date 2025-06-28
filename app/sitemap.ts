// src/app/sitemap.ts
import { BASE_URL } from '@/const';
import { createClient } from '@/lib/supabase/server'; // Make sure this path is correct
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages (No changes here)
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/servers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/docs/what-is-mcp`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/for-agents`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // 2. Dynamic Server Pages
  const supabase = await createClient();
  const { data: servers, error } = await supabase
    .from('discoverable_mcp_servers')
    .select('id, updated_at') // Select only the columns you need
    .eq('status', 'approved'); // Only include approved servers in the sitemap

  if (error) {
    console.error('Sitemap Error: Could not fetch servers.', error);
    // In case of an error, return only the static pages to avoid a build failure
    return staticPages;
  }

  const serverPages = servers.map((server) => ({
    // IMPORTANT: Ensure this path matches your file structure, e.g., /app/servers/[id]/page.tsx
    url: `${BASE_URL}/servers/${server.id}`,
    lastModified: server.updated_at ? new Date(server.updated_at) : new Date(),
    changeFrequency: 'weekly' as const, // Good default for content that might change with new reviews/details
    priority: 0.8,
  }));

  // 3. Combine and Return
  return [...staticPages, ...serverPages];
}
