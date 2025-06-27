import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ServerForm } from '@/components/dashboard/server-form';

async function getServerData(serverId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('discoverable_mcp_servers')
    .select('*')
    .eq('id', serverId)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditServerPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?message=Please log in to edit your server.');
  }
  const { id } = await params;
  const server = await getServerData(id);

  if (!server) {
    notFound();
  }

  // Security check: Ensure the current user owns the server
  if (server.user_id !== user.id) {
    notFound(); // Treat it as not found to prevent leaking information
  }

  return (
    <div className="container mx-auto py-8 max-w-xl px-4 md:px-6 w-full">
      <h1 className="text-3xl font-bold mb-8">Edit Server</h1>
      {/* Render the form WITH initialData */}
      <ServerForm initialData={server} />
    </div>
  );
}
