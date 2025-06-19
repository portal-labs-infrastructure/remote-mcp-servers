'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner'; // Assuming you use sonner for toasts

interface CodeSnippetProps {
  codeString: string;
  language?: string; // For potential syntax highlighting later, not used for basic display
  title?: string;
}

export function CodeSnippet({
  codeString,
  title = 'Example API Request',
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      toast.error('Failed to copy.');
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-slate-800 dark:bg-slate-900 rounded-lg my-8 w-full max-w-xl mx-auto shadow-lg text-left">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-300 dark:text-slate-400">
          {title}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-slate-300 hover:text-slate-100 dark:text-slate-400 dark:hover:text-slate-200 h-8 w-8"
          aria-label="Copy code snippet">
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-sm text-slate-100 dark:text-slate-200 overflow-x-auto">
        <code className="text-wrap">{codeString}</code>
      </pre>
    </div>
  );
}
