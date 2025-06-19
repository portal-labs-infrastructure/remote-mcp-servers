'use client'; // This component uses client-side hooks and interactions

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn Button
import { toast } from 'sonner';
import { FileText, Copy, CheckCircle2 } from 'lucide-react'; // Lucide icons
import Link from 'next/link';

interface ServerCardActionsProps {
  server: Pick<DiscoverableMcpServer, 'documentation_url' | 'mcp_url'>;
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
    // CardActions is just a div with padding/flex in Shadcn context
    <div className="flex gap-2 p-0 flex-1">
      {' '}
      {/* CardActions usually has padding, but here it's part of CardFooter */}
      {server.documentation_url && (
        <Button
          variant="outline" // color="neutral"
          className="flex-1" // fullWidth
          asChild>
          <Link
            href={server.documentation_url}
            target="_blank"
            rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" /> {/* startDecorator */}
            Docs
          </Link>
        </Button>
      )}
      <Button
        variant="default" // color="primary"
        className="flex-1" // fullWidth
        onClick={handleCopyMcpUrl}
        disabled={!server.mcp_url}>
        {copied ? (
          <CheckCircle2 className="mr-2 h-4 w-4" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        {copied ? 'Copied URL' : 'Copy URL'}
      </Button>
    </div>
  );
}
