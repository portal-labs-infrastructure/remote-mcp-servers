import { baseNavLinks, IconName } from '@/lib/const'; // Import the new types/data
import { AuthButton } from '@/components/auth-button';
import AppBarClient from './app-bar-client';
import { createClient } from '@/lib/supabase/server';

export default async function AppBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthed = !!user;

  const navLinks = [...baseNavLinks];
  if (isAuthed) {
    navLinks.unshift({
      href: '/dashboard',
      label: 'Dashboard',
      iconName: 'Home' as IconName,
    });
  }

  return (
    <AppBarClient navLinks={navLinks} isAuthed={isAuthed}>
      <div className="hidden md:flex items-center gap-x-4">
        <AuthButton />
      </div>
    </AppBarClient>
  );
}
