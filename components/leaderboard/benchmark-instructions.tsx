import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function BenchmarkInstructions() {
  return (
    <Alert>
      <Terminal />
      <AlertTitle>How to Run the Benchmark</AlertTitle>
      <AlertDescription>
        <p className="mt-1">
          Use the Client Benchmark MCP server to run a benchmark for your MCP
          client and appear on the leaderboard.
        </p>
        {/* <CodeSnippet title="Run Benchmark Command" codeString={commandToRun} /> */}
        <p className="mt-2 text-xs text-muted-foreground">
          After the benchmark completes, refresh this page to see your results.
        </p>
      </AlertDescription>
    </Alert>
  );
}
