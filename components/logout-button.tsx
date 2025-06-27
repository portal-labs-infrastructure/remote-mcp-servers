'use client';

import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleLogout} className={className}>
      <LogOut className="h-5 w-5" />
      Sign Out
    </Button>
  );
}
