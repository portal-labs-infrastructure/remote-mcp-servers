// app/api/[transport]/route.ts
import { createMcpHandler } from '@vercel/mcp-adapter';
import tools from '@/tools';
import { NextRequest } from 'next/server';
import { initializeBenchmark } from '@/lib/services/benchmark-orchestration-service';

const vercelMcpHandler = createMcpHandler(
  (server) => {
    for (const tool of tools) {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.inputSchema.shape,
          outputSchema: tool.outputSchema.shape,
        },
        tool.handler,
      );
    }
  },
  {
    // Optional McpServer options (passed to new McpServer({ ... }))
    serverInfo: {
      name: 'Remote MCP Servers',
      version: '1.0.0',
    },
  },
  {
    // Adapter options
    // redisUrl: process.env.REDIS_URL,
    basePath: '/eval', // This needs to match the directory structure
    maxDuration: 60, // Example: Vercel's default for Hobby is 10s, Pro can be higher
    verboseLogs: true,
  },
);

// --- Part 2: Create our minimal wrapper ---
async function handler(req: NextRequest) {
  // Clone the request to read the body once
  const reqClone = req.clone();
  const body = await reqClone.json();

  if (body?.method === 'initialize') {
    const response = await vercelMcpHandler(req);
    const responseBody = await response.json();
    const sessionId = responseBody?.result?.sessionId;
    const clientInfo = body.params.clientInfo;

    if (sessionId && clientInfo) {
      // Call our new orchestration service
      initializeBenchmark(clientInfo, sessionId).catch(console.error);
    }

    return response;
  }

  // For all other methods ('tool/execute', 'submit'),
  // just pass the request through to the original handler.
  return vercelMcpHandler(req);
}

export { handler as GET, handler as POST };
