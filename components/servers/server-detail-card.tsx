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
    <Card className="w-full">
      {/* Section 3: Reorganized Information Grid */}
      <CardContent className="py-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
          {/* Column 1: About this Server */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About this Server</h3>
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{server.category}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Maintained by</p>
                <p className="font-medium">{server.maintainer_name}</p>
              </div>
            </div>
            {server.maintainer_url && (
              <div className="flex items-start gap-3">
                <LinkIcon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Maintainer Site
                  </p>
                  <a
                    href={server.maintainer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline">
                    {server.maintainer_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Capabilities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Capabilities</h3>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p className="font-medium">
                {server.authentication_type === 'None'
                  ? 'No'
                  : server.authentication_type}{' '}
                Authentication
              </p>
            </div>
            {server.authentication_type === 'OAuth2' && (
              <div className="flex items-center gap-3">
                {server.dynamic_client_registration ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span>Dynamic Client Registration</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              {server.is_official ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span>Official Server</span>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator /> {/* Divider */}
      <div className="px-6 py-4  flex flex-wrap gap-3 ">
        <Button asChild variant="secondary" className="flex-1">
          <Link
            href={`/servers/${server.id}.md`}
            target="_blank"
            rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" />
            View as Markdown
          </Link>
        </Button>

        {server.documentation_url && (
          <Button variant="secondary" className="flex-1" asChild>
            <a
              href={server.documentation_url}
              target="_blank"
              rel="noopener noreferrer">
              <BookOpen className="mr-2 h-4 w-4" /> View Documentation
            </a>
          </Button>
        )}
        <Button
          onClick={handleCopyMcpUrl}
          className="flex-1"
          disabled={!server.mcp_url}>
          {copied ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied URL' : 'Copy Server URL'}
        </Button>
      </div>
    </Card>
  );
}
