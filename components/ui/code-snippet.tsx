'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeSnippetProps {
  codeString: string;
  language?: string; // For potential syntax highlighting later
  title?: string;
}

export function CodeSnippet({
  codeString,
  // language prop is available if you add syntax highlighting later
  title = 'Example API Request',
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy.');
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-neutral-900/95 dark:bg-neutral-900/95 border border-neutral-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700/50 bg-neutral-800/50">
        <p className="text-sm font-medium text-neutral-300 dark:text-neutral-300">
          {title}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700/50 h-8 w-8 transition-all duration-200"
          aria-label="Copy code snippet">
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-sm text-neutral-100 dark:text-neutral-200 overflow-x-auto font-mono bg-neutral-900/50">
        <code className="text-neutral-100">{codeString}</code>
      </pre>
    </div>
  );
}
