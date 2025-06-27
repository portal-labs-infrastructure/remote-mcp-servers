import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ServerDetailCard } from '@/components/servers/server-detail-card';
import { ReviewsSection } from '@/components/servers/reviews-section';
import { ServerStrip } from '@/components/servers/server-strip';
import { ServerHeader } from '@/components/servers/server-header';

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
  params: { id: string };
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
    <div className="container mx-auto py-12 px-4 md:px-6 space-y-12">
      {/* Header */}
      <ServerHeader server={server} />

      {/* Main Server Details */}
      <ServerDetailCard server={server} />

      {/* Interactive Reviews Section */}
      <ReviewsSection
        serverId={server.id}
        initialReviews={reviews}
        currentUserId={user?.id} // Pass the user's ID
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
  );
}
