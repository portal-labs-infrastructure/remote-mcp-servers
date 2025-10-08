'use client';

import {
  BookOpen,
  CheckCircle,
  Copy,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Tag,
  User,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import Link from 'next/link';

interface ServerDetailCardProps {
  server: SpecServerObject;
}

export function ServerDetailCard({ server }: ServerDetailCardProps) {
  const [copied, setCopied] = useState(false);

  // Use only standard MCP registry spec fields
  const repoUrl = server.repository?.url;
  const repoSource = server.repository?.source;
  
  let maintainerName: string | null = null;
  if (repoUrl) {
    try {
      const urlParts = new URL(repoUrl).pathname.split('/');
      if (urlParts.length > 1 && urlParts[1]) maintainerName = urlParts[1];
    } catch {}
  }

  // Determine which registry this is from based on metadata namespaces
  let registrySource = 'Community';
  if (server.meta) {
    if ('io.modelcontextprotocol.metadata' in server.meta) {
      registrySource = 'Official MCP Registry';
    } else if ('org.prometheusprotocol.metadata' in server.meta) {
      registrySource = 'Prometheus Protocol Blockchain';
    } else if ('com.remote-mcp-servers.metadata' in server.meta) {
      registrySource = 'Community Submitted';
    }
  }

  const documentationUrl = server.website_url;
  const mcpUrl = server.remotes?.[0]?.url;
  const version = server.latest_version;

  // --- HANDLER FUNCTIONS ---
  const handleCopyMcpUrl = () => {
    if (mcpUrl) {
      navigator.clipboard
        .writeText(mcpUrl)
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
    <Card className="w-full shadow-md border-2 border-border/50 bg-card/90 backdrop-blur-sm">
      <CardContent className="py-6">
        <div className="space-y-8">
          {/* --- About this Server --- */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">
              About this Server
            </h3>
            <div className="space-y-4">
              {maintainerName && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                    <User className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Maintained by
                    </p>
                    <p className="font-semibold text-foreground text-sm">
                      {maintainerName}
                    </p>
                  </div>
                </div>
              )}
              {repoUrl && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                    <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Repository
                    </p>
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors text-sm hover:underline break-all block">
                      {repoUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* --- Capabilities --- */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">Capabilities</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">
                    Registry Source
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {registrySource}
                  </p>
                </div>
              </div>
              {version && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                    <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Latest Version
                    </p>
                    <p className="font-semibold text-foreground text-sm">
                      v{version}
                    </p>
                  </div>
                </div>
              )}
              {repoSource && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                    <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Source Platform
                    </p>
                    <p className="font-semibold text-foreground text-sm capitalize">
                      {repoSource}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />
        </div>
      </CardContent>
      <Separator className="bg-border/30" />
      <div className="px-8 py-6 flex flex-wrap gap-3 bg-muted/20">
        <Button
          asChild
          variant="secondary"
          className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md">
          <Link
            href={`/servers/${server.id}.md`}
            target="_blank"
            rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" />
            View as Markdown
          </Link>
        </Button>
        {documentationUrl && (
          <Button
            variant="secondary"
            className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
            asChild>
            <a
              href={documentationUrl}
              target="_blank"
              rel="noopener noreferrer">
              <BookOpen className="mr-2 h-4 w-4" />
              View Documentation
            </a>
          </Button>
        )}
        <Button
          onClick={handleCopyMcpUrl}
          className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
          disabled={!mcpUrl}>
          {copied ? (
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied URL' : 'Copy Server URL'}
        </Button>
      </div>
    </Card>
  );
}
