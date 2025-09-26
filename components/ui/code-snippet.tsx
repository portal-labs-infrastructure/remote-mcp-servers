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
    <div className="bg-slate-100 dark:bg-neutral-900/95 border border-slate-300 dark:border-neutral-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm w-full min-w-0">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-300 dark:border-neutral-700/50 bg-slate-200/80 dark:bg-neutral-800/50">
        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-neutral-300 truncate mr-2 min-w-0">
          {title}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-300/50 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 flex-shrink-0"
          aria-label="Copy code snippet">
          {copied ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-3 sm:p-4 text-xs sm:text-sm text-slate-800 dark:text-neutral-200 font-mono bg-slate-50 dark:bg-neutral-900/50 whitespace-pre min-w-0">
          <code className="text-slate-800 dark:text-neutral-100">
            {codeString}
          </code>
        </pre>
      </div>
    </div>
  );
}
