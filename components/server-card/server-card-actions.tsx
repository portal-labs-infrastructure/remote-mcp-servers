'use client'; // This component uses client-side hooks and interactions

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn Button
import { toast } from 'sonner';
import { FileText, Copy, CheckCircle2 } from 'lucide-react'; // Lucide icons
import Link from 'next/link';

interface ServerCardActionsProps {
  server: Pick<DiscoverableMcpServer, 'id' | 'documentation_url' | 'mcp_url'>;
}

export default function ServerCardActions({ server }: ServerCardActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMcpUrl = () => {
    if (server.mcp_url) {
      navigator.clipboard
        .writeText(server.mcp_url)
        .then(() => {
          setCopied(true);
          toast('Copied to clipboard!', {
            // title: 'Copied to clipboard!',
            description: 'MCP URL has been copied.',
            // variant: 'default', // Or 'success' if you have a custom variant
            duration: 2000,
          });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy MCP URL: ', err);
          toast('Copy Failed', {
            // title: 'Copy Failed',
            description: 'Could not copy MCP URL to clipboard.',
            // variant: 'destructive',
            duration: 3000,
          });
        });
    }
  };

  return (
    <div className="flex gap-3 p-0 flex-1">
      <Button
        variant="outline"
        onClick={handleCopyMcpUrl}
        disabled={!server.mcp_url}
        className="transition-all duration-200 hover:scale-105 hover:shadow-md border-border/50 hover:border-primary/30">
        {copied ? (
          <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        {copied ? 'Copied URL' : 'Copy URL'}
      </Button>
      <Button
        className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
        variant="default"
        asChild>
        <Link href={`/servers/${server.id}`}>
          <FileText className="mr-2 h-4 w-4" />
          Details
        </Link>
      </Button>
    </div>
  );
}
