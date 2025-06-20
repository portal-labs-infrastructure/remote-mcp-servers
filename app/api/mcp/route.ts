// app/api/[transport]/route.ts
import { createMcpHandler } from '@vercel/mcp-adapter';
import tools from '@/tools';

const handler = createMcpHandler(
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
    // name: 'Portal One Streamable HTTP Server via Vercel Adapter',
    // version: '1.0.0',
  },
  {
    // Adapter options
    // redisUrl: process.env.REDIS_URL,
    basePath: '/api', // This needs to match the directory structure
    maxDuration: 60, // Example: Vercel's default for Hobby is 10s, Pro can be higher
    verboseLogs: true,
  },
);
export { handler as GET, handler as POST };
