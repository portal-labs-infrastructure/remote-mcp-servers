'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteServerAction } from '@/app/actions/serverActions';

export function DeleteServerButton({
  serverId,
  serverName,
}: {
  serverId: string;
  serverName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delist the server "${serverName}"? This action cannot be undone.`,
      )
    ) {
      startTransition(() => {
        deleteServerAction(serverId);
      });
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delist Server">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
