import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ServerDetailCard } from '@/components/servers/server-detail-card';
import { ReviewsSection } from '@/components/servers/reviews-section';
import { ServerStrip } from '@/components/servers/server-strip';
import { ServerHeader } from '@/components/servers/server-header';
import { BASE_URL } from '@/const';
import { Metadata } from 'next/types';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeParseJson } from '@/lib/types';

type Props = {
  params: Promise<{ id: string }>; // Params are not a promise here
};

// --- METADATA GENERATION ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  // CHANGED: Query the new table
  const { data: server } = await supabase
    .from('mcp_servers_v1')
    .select('id, name, description')
    .eq('id', id)
    .single();

  if (!server) {
    return { title: 'Server Not Found' };
  }

  return {
    title: `${server.name} | Remote MCP Servers`,
    description: server.description,
    alternates: {
      canonical: `${BASE_URL}/servers/${server.id}`,
    },
  };
}

function processRawServer(rawServer: McpServer): SpecServerObject | null {
  if (!rawServer) return null;
  return {
    ...rawServer,
    meta: rawServer.meta ? safeParseJson<Meta>(rawServer.meta) : null,
    repository: safeParseJson<Repository>(rawServer.repository),
    remotes: safeParseJson<Remote[]>(rawServer.remotes),
    packages: null, // Assuming packages are not used in this context
  };
}

// --- DATA FETCHING LOGIC ---
async function getServerPageData(serverId: string) {
  const supabase = await createClient();
  const metaNamespace = 'com.remote-mcp-servers.metadata';

  // 1. Fetch the main server object (as raw data)
  const { data: rawServer, error: serverError } = await supabase
    .from('mcp_servers_v1')
    .select('*')
    .eq('id', serverId)
    .eq('status', 'active')
    .single();

  if (serverError) {
    console.error('Error fetching server:', serverError);
  }

  if (!rawServer) {
    return {
      server: null,
      reviews: [],
      byMaintainer: [],
      similar: [],
      derived: {},
    };
  }

  // 2. Process the raw data into our clean SpecServerObject type
  const server = processRawServer(rawServer);

  if (serverError || !server) {
    return {
      server: null,
      reviews: [],
      byMaintainer: [],
      similar: [],
      derived: {},
    };
  }

  // 3. Fetch reviews (unchanged)
  const reviewsPromise = supabase
    .from('server_reviews')
    .select('*, profile:profiles(*)')
    .eq('server_id', serverId)
    .order('created_at', { ascending: false });

  // 4. DERIVE properties from the now-processed server object
  const customMeta = server.meta?.[metaNamespace] || {};
  const category = (customMeta as { category?: string }).category;
  const aiSummary = (customMeta as { ai_summary?: string }).ai_summary;

  let maintainerName: string | null = null;
  // Accessing server.repository.url is now safe because it has been parsed.
  if (server.repository?.url) {
    try {
      const urlParts = new URL(server.repository.url).pathname.split('/');
      if (urlParts.length > 1 && urlParts[1]) maintainerName = urlParts[1];
    } catch {}
  }

  // 5. Build subsequent queries (unchanged)
  const byMaintainerPromise = maintainerName
    ? supabase
        .from('mcp_servers_v1')
        .select('*')
        .like('repository->>url', `%/${maintainerName}/%`)
        .eq('status', 'active')
        .neq('id', server.id)
        .limit(5)
    : Promise.resolve({ data: [] });

  const similarPromise = category
    ? supabase
        .from('mcp_servers_v1')
        .select('*')
        .eq(`meta->${metaNamespace}->>category`, category)
        .eq('status', 'active')
        .neq('id', server.id)
        .limit(5)
    : Promise.resolve({ data: [] });

  // 6. Execute all promises
  const [reviewsResult, byMaintainerResult, similarResult] = await Promise.all([
    reviewsPromise,
    byMaintainerPromise,
    similarPromise,
  ]);

  // 7. Process ALL fetched server data consistently
  const byMaintainer = (byMaintainerResult.data || [])
    .map(processRawServer)
    .filter((s): s is SpecServerObject => s !== null);
  const similar = (similarResult.data || [])
    .map(processRawServer)
    .filter((s): s is SpecServerObject => s !== null);

  // Transform review avatars (unchanged)

  // Transform review avatar URLs (unchanged logic)
  const reviews = (reviewsResult.data || []).map((review) => {
    if (review.profile?.avatar_url) {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('avatars')
        .getPublicUrl(review.profile.avatar_url);
      return {
        ...review,
        profile: { ...review.profile, avatar_url: publicUrl },
      };
    }
    return review;
  });
  // 8. Return the fully processed, type-safe data
  return {
    server,
    reviews,
    byMaintainer,
    similar,
    derived: { maintainerName, category, aiSummary },
  };
}

// --- PAGE COMPONENT ---
export default async function ServerDetailPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { id } = await params;
  const { server, reviews, byMaintainer, similar, derived } =
    await getServerPageData(id);

  if (!server) {
    notFound();
  }

  console.log('Derived data:', derived);
  console.log('Server data:', server);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]" />

      <div className="max-w-7xl relative container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hover:scale-105 transition-all duration-200">
            <Link href={`/servers`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Servers
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <ServerHeader server={server} />
            <div className="block lg:hidden">
              <ServerDetailCard server={server} />
            </div>

            {/* CHANGED: Use the derived aiSummary from the meta object */}
            {derived.aiSummary && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
                  Overview
                </h2>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-5 shadow-sm">
                  <article className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-sm">
                    <ReactMarkdown>{derived.aiSummary}</ReactMarkdown>
                  </article>
                </div>
              </section>
            )}

            <ReviewsSection
              serverId={server.id}
              initialReviews={reviews}
              currentUserId={user?.id}
            />

            {/* CHANGED: Use derived maintainerName for the title */}
            {byMaintainer.length > 0 && derived.maintainerName && (
              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-5">
                <ServerStrip
                  title={`More from ${derived.maintainerName}`}
                  servers={byMaintainer}
                />
              </div>
            )}

            {/* CHANGED: Use derived category for the title */}
            {similar.length > 0 && derived.category && (
              <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-5">
                <ServerStrip
                  title={`Similar in ${derived.category}`}
                  servers={similar}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-20">
              <ServerDetailCard server={server} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
