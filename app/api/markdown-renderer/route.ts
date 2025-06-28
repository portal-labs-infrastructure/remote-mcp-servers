import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// A simple function to fetch server data and format it as Markdown
async function generateServersMarkdown() {
  const supabase = await createClient();
  const { data: servers } = await supabase
    .from('discoverable_mcp_servers')
    .select('id, name, description, category')
    .eq('status', 'approved')
    .order('name');

  if (!servers) return '# Server Registry\n\nCould not load servers.';

  let markdown = '# Browse All MCP Servers\n\n';
  markdown += 'A complete list of all approved MCP-compatible servers.\n\n';

  servers.forEach((server) => {
    markdown += `## ${server.name}\n`;
    markdown += `**Category:** ${server.category}\n`;
    markdown += `**Description:** ${server.description}\n`;
    markdown += `**Details:** [https://remote-mcp-servers.com/servers/${server.id}](https://remote-mcp-servers.com/servers/${server.id})\n\n`;
  });

  return markdown;
}

// A simple function for a static page
function generateAboutMarkdown() {
  return `
# About Remote MCP Servers

This registry is a community-driven project to create a central directory for all servers that support the Machine-readable Capability Protocol (MCP).

Our mission is to accelerate the development of capable AI agents by making it easy for them to discover and use new tools on the fly.
  `.trim();
}

async function generateServerDetailMarkdown(serverId: string) {
  const supabase = await createClient();
  const { data: server } = await supabase
    .from('discoverable_mcp_servers')
    .select('name, description, category, mcp_url, maintainer_name')
    .eq('id', serverId)
    .single();

  if (!server) {
    return `# Server Not Found\n\nThe server with ID \`${serverId}\` could not be found or is not approved.`;
  }

  let markdown = `# ${server.name}\n\n`;
  markdown += `> ${server.description}\n\n`;
  markdown += `**Category:** ${server.category}\n`;
  markdown += `**Maintainer:** ${server.maintainer_name}\n`;
  markdown += `**MCP URL:** [${server.mcp_url}](${server.mcp_url})\n`;
  markdown += `**View on site:** [https://remote-mcp-servers.com/servers/${serverId}](https://remote-mcp-servers.com/servers/${serverId})\n`;

  return markdown;
}

// --- The main API route handler (Updated Logic) ---
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  let markdownContent = `# Not Found\n\nThe requested resource does not have a Markdown version.`;

  // 1. Define a regex to match the server detail page pattern
  const serverDetailRegex = /^\/servers\/(.+)\.md$/;
  const match = path.match(serverDetailRegex);

  // 2. Check if the path matches the dynamic server detail route
  if (match && match[1]) {
    const serverId = match[1]; // Extract the ID from the regex match
    markdownContent = await generateServerDetailMarkdown(serverId);
  } else {
    // 3. If not, fall back to the static routes
    switch (path) {
      case '/servers.md':
        markdownContent = await generateServersMarkdown();
        break;
      case '/about.md':
        markdownContent = generateAboutMarkdown();
        break;
      // Add other static cases here
    }
  }

  return new NextResponse(markdownContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8',
    },
  });
}
