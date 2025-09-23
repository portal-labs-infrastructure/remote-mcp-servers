'use client';

import {
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Copy,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import Link from 'next/link';

// Assuming DiscoverableMcpServer is your server type from the database
interface ServerDetailCardProps {
  server: DiscoverableMcpServer;
}

export function ServerDetailCard({ server }: ServerDetailCardProps) {
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
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-200 border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="py-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
          {/* About this Server section with enhanced styling */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-foreground">
              About this Server
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Category
                  </p>
                  <p className="font-semibold text-foreground text-base">
                    {server.category}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Maintained by
                  </p>
                  <p className="font-semibold text-foreground text-base">
                    {server.maintainer_name}
                  </p>
                </div>
              </div>
              {server.maintainer_url && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <LinkIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Maintainer Site
                    </p>
                    <a
                      href={server.maintainer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors text-base hover:underline">
                      {server.maintainer_url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Capabilities section with enhanced styling */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-foreground">Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <p className="font-semibold text-foreground text-base">
                  {server.authentication_type === 'None'
                    ? 'No'
                    : server.authentication_type}{' '}
                  Authentication
                </p>
              </div>
              {server.authentication_type === 'OAuth2' && (
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    {server.dynamic_client_registration ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    Dynamic Client Registration
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  {server.is_official ? (
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <span className="font-medium text-foreground">
                  From Official Registry
                </span>
              </div>
            </div>
          </div>
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

        {server.documentation_url && (
          <Button
            variant="secondary"
            className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
            asChild>
            <a
              href={server.documentation_url}
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
          disabled={!server.mcp_url}>
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
