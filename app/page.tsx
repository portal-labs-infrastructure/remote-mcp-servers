// src/app/page.tsx
import Hero from '@/components/hero'; // Or your path to Hero.tsx
import SeoContentSection from '@/components/seo-content-section'; // Adjust path
import CodeExamples from '@/components/code-examples'; // Adjust path
import AppBar from '@/components/app-bar';
import Footer from '@/components/footer';
import FeaturedServers from '@/components/featured-servers';
import { createClient } from '@/lib/supabase/server';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';

// Helper function to fetch featured servers (can be in this file or a lib file)
async function getFeaturedServers(): Promise<SpecServerObject[]> {
  const supabase = await createClient(); // Use your server-side Supabase client
  try {
    const { data, error } = await supabase
      .from('mcp_servers_v1') // Your actual table name
      .select('*') // Select all columns, or specify needed ones for ServerCard
      .eq('status', 'active') // Filter for active servers
      .order('created_at', { ascending: false }) // Order by most recently created
      .limit(6); // Limit to 6 servers

    if (error) {
      console.error('Error fetching featured servers:', error.message);
      return []; // Return empty array on error
    }
    return (data || []) as SpecServerObject[];
  } catch (err) {
    console.error('Unexpected error in getFeaturedServers:', err);
    return [];
  }
}

export default async function LandingPage() {
  const featuredServers = await getFeaturedServers();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <AppBar />
        <div className="flex-1 w-full flex flex-col gap-16 md:gap-20">
          <main className="flex-1 flex flex-col">
            <Hero />
            <CodeExamples />
            <SeoContentSection />
            {featuredServers.length > 0 && (
              <FeaturedServers servers={featuredServers} />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </main>
  );
}
