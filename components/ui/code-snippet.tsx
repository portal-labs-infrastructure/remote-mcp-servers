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
    <div className="bg-neutral-800 dark:bg-main rounded-lg my-8 w-full max-w-xl mx-auto shadow-lg text-left">
      {/* ^ Changed bg-slate-800 to bg-neutral-800. dark:bg-main is kept as per your code. */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700 dark:border-neutral-700">
        {/* ^ Changed border-slate-700 to border-neutral-700 */}
        <p className="text-sm font-medium text-neutral-300 dark:text-neutral-400">
          {/* ^ Changed text-slate-300 to text-neutral-300 and dark:text-slate-400 to dark:text-neutral-400 */}
          {title}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-neutral-300 hover:text-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 h-8 w-8"
          // ^ Changed text-slate-300 to text-neutral-300, hover:text-slate-100 to hover:text-neutral-100, etc.
          aria-label="Copy code snippet">
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-sm text-neutral-100 dark:text-neutral-200 overflow-x-auto">
        {/* ^ Changed text-slate-100 to text-neutral-100 and dark:text-slate-200 to dark:text-neutral-200 */}
        <code>{codeString}</code>
        {/* Note: Removed className="text-wrap" from <code> as it's not a standard Tailwind class.
            If you need text wrapping, consider `whitespace-pre-wrap` on the `<pre>` tag.
            `overflow-x-auto` already handles horizontal scrolling for long lines. */}
      </pre>
    </div>
  );
}
