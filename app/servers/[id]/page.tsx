import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ServerDetailCard } from '@/components/servers/server-detail-card';
import { ReviewsSection } from '@/components/servers/reviews-section';
import { ServerStrip } from '@/components/servers/server-strip';
import { ServerHeader } from '@/components/servers/server-header';
import { BASE_URL } from '@/const';
import { Metadata } from 'next/types';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: server } = await supabase
    .from('discoverable_mcp_servers')
    .select('id, name, description')
    .eq('id', id)
    .single();

  if (!server) {
    return {
      title: 'Server Not Found',
    };
  }

  return {
    title: `${server.name} | Remote MCP Servers`,
    description: server.description,
    // This is the crucial part that fixes the error
    alternates: {
      canonical: `${BASE_URL}/servers/${server.id}`,
    },
  };
}

// Helper function to fetch all data in parallel
async function getServerPageData(serverId: string) {
  const supabase = await createClient();

  const serverPromise = supabase
    .from('discoverable_mcp_servers')
    .select('*')
    .eq('id', serverId)
    .eq('status', 'approved') // Only show approved servers on the public details page
    .single();

  const reviewsPromise = supabase
    .from('server_reviews')
    .select('*, profile:profiles(*)')
    .eq('server_id', serverId)
    .order('created_at', { ascending: false });

  const [serverResult, reviewsResult] = await Promise.all([
    serverPromise,
    reviewsPromise,
  ]);

  if (serverResult.error || !serverResult.data) {
    return { server: null, reviews: [], byMaintainer: [], similar: [] };
  }

  const server = serverResult.data;

  // Now fetch related servers
  const byMaintainerPromise = server.maintainer_name
    ? supabase
        .from('discoverable_mcp_servers')
        .select('*')
        .eq('maintainer_name', server.maintainer_name)
        .eq('status', 'approved')
        .neq('id', server.id) // Exclude the current server
        .limit(5)
    : Promise.resolve({ data: [] });

  const similarPromise = supabase
    .from('discoverable_mcp_servers')
    .select('*')
    .eq('category', server.category)
    .eq('status', 'approved')
    .neq('id', server.id) // Exclude the current server
    .limit(5);

  const [byMaintainerResult, similarResult] = await Promise.all([
    byMaintainerPromise,
    similarPromise,
  ]);

  return {
    server,
    reviews: reviewsResult.data || [],
    byMaintainer: byMaintainerResult.data || [],
    similar: similarResult.data || [],
  };
}
export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { id } = await params;
  const { server, reviews, byMaintainer, similar } =
    await getServerPageData(id);

  if (!server) {
    notFound(); // Renders the not-found.tsx file
  }

  return (
    // Main page container
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Header remains at the top, spanning the full width */}
      <div className="mb-6">
        <Link
          href="/servers"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all servers
        </Link>
      </div>
      {/* Two-column grid layout starts here */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* --- Left Column (Main Content) --- */}
        <div className="lg:col-span-2 space-y-12">
          <ServerHeader server={server} />

          <Badge variant="secondary" className="whitespace-nowrap text-sm">
            {server.category}
          </Badge>

          {/* AI-Generated Summary */}
          {server.ai_summary && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Overview
              </h2>
              <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{server.ai_summary}</ReactMarkdown>
              </article>
            </section>
          )}

          {/* Interactive Reviews Section */}
          <ReviewsSection
            serverId={server.id}
            initialReviews={reviews}
            currentUserId={user?.id}
          />

          {/* "More by" Strip */}
          {byMaintainer.length > 0 && (
            <ServerStrip
              title={`More from ${server.maintainer_name}`}
              servers={byMaintainer}
            />
          )}

          {/* "Similar Servers" Strip */}
          {similar.length > 0 && (
            <ServerStrip
              title={`Similar in ${server.category}`}
              servers={similar}
            />
          )}
        </div>

        {/* --- Right Column (Sticky Sidebar) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <ServerDetailCard server={server} />
          </div>
        </div>
      </div>
    </div>
  );
}
