import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export function BenchmarkInstructions() {
  return (
    <Alert>
      <Terminal />
      <AlertTitle>How to Run the Benchmark</AlertTitle>
      <AlertDescription>
        <p className="mt-1">
          Use the{' '}
          <Link
            href="/servers/d8c98576-1d83-42b4-9659-826721366d05"
            className="text-blue-400 hover:underline">
            MCP Client Benchmark
          </Link>{' '}
          MCP server to run a benchmark using your MCP client of choice. The
          results will be automatically submitted to this leaderboard.
        </p>
        {/* <CodeSnippet title="Run Benchmark Command" codeString={commandToRun} /> */}
        <p className="mt-2 text-xs text-muted-foreground">
          After the benchmark completes, refresh this page to see your results.
        </p>
      </AlertDescription>
    </Alert>
  );
}
