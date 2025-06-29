import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select(`username, avatar_url`)
    .eq('user_id', userId)
    .single();
  return data;
}

async function getAvatarPublicUrl(avatarPath: string | null) {
  // If no path, return a default avatar
  if (!avatarPath) return '/default-avatar.png';
  const supabase = await createClient();
  const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath);
  return data.publicUrl;
}

export async function ProfileCard({ userId }: { userId: string }) {
  const profile = await getProfile(userId);
  const avatarUrl = await getAvatarPublicUrl(profile?.avatar_url || null);

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex-col flex md:flex-row md:items-center gap-4">
        <Image
          src={avatarUrl}
          alt={profile?.username ?? 'User avatar'}
          width={80}
          height={80}
          className="rounded-full bg-muted"
        />
        <div>
          <h2 className="text-2xl font-bold">
            {profile?.username ?? 'New User'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back! Manage your profile and servers.
          </p>
        </div>
        <Button asChild variant="outline" className="md:ml-auto">
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
