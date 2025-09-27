'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, CheckCircle, XCircle, Clock, Database, Link as LinkIcon } from 'lucide-react';

type SyncResult = {
  success: boolean;
  message: string;
  output?: string;
  error?: string;
  timestamp: string;
};

export function SyncDashboard() {
  const [isRunning, setIsRunning] = useState<string | false>(false);
  const [lastResults, setLastResults] = useState<{
    'mcp-remotes'?: SyncResult;
    'blockchain'?: SyncResult;
  }>({});

  const handleManualSync = async (syncType: 'mcp-remotes' | 'blockchain') => {
    setIsRunning(syncType);

    try {
      console.log(`Triggering ${syncType} sync...`);
      
      const response = await fetch('/api/manual-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: syncType }),
        credentials: 'include', // Important: Include cookies for auth
      });

      const result = await response.json();
      
      console.log('Sync response:', { status: response.status, result });
      
      const syncResult: SyncResult = {
        success: response.ok,
        message: result.message || result.error || 'Unknown result',
        output: result.output,
        error: result.details || result.stderr,
        timestamp: new Date().toISOString(),
      };

      setLastResults(prev => ({
        ...prev,
        [syncType]: syncResult
      }));
    } catch (error) {
      const syncResult: SyncResult = {
        success: false,
        message: 'Failed to trigger sync',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };

      setLastResults(prev => ({
        ...prev,
        [syncType]: syncResult
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const SyncCard = ({ 
    type, 
    title, 
    description, 
    schedule, 
    icon: Icon 
  }: { 
    type: 'mcp-remotes' | 'blockchain';
    title: string;
    description: string;
    schedule: string;
    icon: any;
  }) => {
    const lastResult = lastResults[type];
    const isCurrentlyRunning = isRunning === type;

    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
          <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
            {schedule}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Button 
            onClick={() => handleManualSync(type)} 
            disabled={!!isRunning}
            className="w-full flex items-center gap-2"
            variant={isCurrentlyRunning ? "secondary" : "default"}
          >
            {isCurrentlyRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Manual Sync
              </>
            )}
          </Button>

          {lastResult && (
            <div className={`rounded-lg p-4 ${
              lastResult.success 
                ? 'bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800' 
                : 'bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-3">
                {lastResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${
                    lastResult.success 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {lastResult.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(lastResult.timestamp).toLocaleString()}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    {lastResult.output && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground bg-background/50 px-2 py-1 rounded border text-xs font-medium">
                          View Output
                        </summary>
                        <pre className="mt-2 p-3 bg-background border rounded text-xs overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {lastResult.output}
                        </pre>
                      </details>
                    )}
                    {lastResult.error && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-red-600 hover:text-red-800 bg-background/50 px-2 py-1 rounded border text-xs font-medium">
                          View Errors
                        </summary>
                        <pre className="mt-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded text-xs overflow-x-auto whitespace-pre-wrap text-red-800 dark:text-red-200 max-h-32 overflow-y-auto">
                          {lastResult.error}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Registry Sync Management</h2>
            <p className="text-sm text-muted-foreground">Automated synchronization with external registries</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-muted-foreground">
            {isRunning ? 'Sync Running' : 'All Systems Operational'}
          </span>
        </div>
      </div>
      
      <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
        <SyncCard
          type="mcp-remotes"
          title="Official MCP Registry"
          description="Syncs servers from registry.modelcontextprotocol.io"
          schedule="Runs every 6 hours"
          icon={LinkIcon}
        />
        
        <SyncCard
          type="blockchain"
          title="Blockchain Registry"
          description="Syncs servers from Prometheus Protocol blockchain"
          schedule="Runs every 12 hours"
          icon={Database}
        />
      </div>
    </div>
  );
}