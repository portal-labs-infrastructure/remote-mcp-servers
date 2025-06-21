// src/app/sitemap.ts
import { BASE_URL } from '@/const';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(), // Or a specific deployment date for truly static content
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/servers`,
      lastModified: new Date(), // This page's content might change more frequently
      changeFrequency: 'daily' as const, // Or 'weekly' if server list updates are less frequent
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/docs/what-is-mcp`,
      lastModified: new Date(), // Or deployment date
      changeFrequency: 'monthly' as const, // This content is fairly static
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(), // Or deployment date
      changeFrequency: 'monthly' as const, // This content is fairly static
      priority: 0.7,
    },
    // Add other static pages here if any
  ];

  // --- Dynamic Server Pages (Example for when you implement them) ---
  // This part is for the future when you have individual server detail pages.
  // You'll need to fetch your server data here.
  /*
  const supabase = await createClient(); // Your server-side Supabase client
  const { data: servers, error } = await supabase
    .from('discoverable_mcp_servers') // Your table name
    .select('id, updated_at') // Select ID (or slug) and last modified date
    .eq('status', 'approved');

  if (error) {
    console.error("Error fetching servers for sitemap:", error);
    // Decide how to handle: return only static, or throw, etc.
  }

  const serverPages = servers?.map((server) => ({
    url: `${BASE_URL}/server/${server.id}`, // Or server.slug
    lastModified: server.updated_at ? new Date(server.updated_at) : new Date(),
    changeFrequency: 'weekly', // Or based on how often server details/reviews change
    priority: 0.8,
  })) || [];

  return [...staticPages, ...serverPages];
  */

  // For now, just return static pages:
  return staticPages;
}
