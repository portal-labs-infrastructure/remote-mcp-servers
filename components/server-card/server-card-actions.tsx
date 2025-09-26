'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// CHANGED: The component now accepts the full server object to access 'id' and 'remotes'.
interface ServerCardActionsProps {
  server: SpecServerObject;
}

export default function ServerCardActions({ server }: ServerCardActionsProps) {
  const [copied, setCopied] = useState(false);

  // --- Data Extraction ---
  // Safely get the primary connection URL from the 'remotes' array.
  // Optional chaining (?.) prevents errors if 'remotes' is null or empty.
  const mcpUrl = server.remotes?.[0]?.url;

  const handleCopyMcpUrl = () => {
    // CHANGED: Check the extracted 'mcpUrl' variable.
    if (mcpUrl) {
      navigator.clipboard
        .writeText(mcpUrl) // Use the extracted URL
        .then(() => {
          setCopied(true);
          toast('Copied to clipboard!', {
            description: 'MCP URL has been copied.',
            duration: 2000,
          });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy MCP URL: ', err);
          toast('Copy Failed', {
            description: 'Could not copy MCP URL to clipboard.',
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
        // CHANGED: The button is disabled if there's no mcpUrl.
        disabled={!mcpUrl}
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
        variant="outline"
        asChild>
        {/* This link is already correct as 'id' is a top-level property. */}
        <Link href={`/servers/${server.id}`}>
          <FileText className="mr-2 h-4 w-4" />
          Details
        </Link>
      </Button>
    </div>
  );
}
