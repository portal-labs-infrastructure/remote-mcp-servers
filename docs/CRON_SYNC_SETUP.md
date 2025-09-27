# Automated MCP Registry Sync

This directory contains the automated sync system that keeps your remote MCP servers registry up-to-date with the official MCP registry.

## Overview

The system consists of:

1. **Vercel Cron Jobs** - Automated scheduling via `vercel.json`
2. **API Endpoints** - Serverless functions that execute sync scripts
3. **Security** - Protected endpoints with authentication
4. **Dashboard** - Manual triggers and monitoring interface
5. **Dual Sources** - Official MCP Registry + Prometheus Protocol Blockchain

## Files Structure

```
├── app/api/
│   ├── sync-mcp-remotes/route.ts     # Official MCP registry cron endpoint
│   ├── sync-blockchain/route.ts      # Blockchain cron endpoint
│   ├── manual-sync/route.ts          # Manual trigger endpoint (both types)
│   └── sync-status/route.ts          # Status monitoring endpoint
├── components/dashboard/
│   └── sync-dashboard.tsx            # Admin dashboard component
├── scripts/
│   ├── sync_mcp_remotes.py           # Official MCP registry sync script
│   ├── sync_blockchain_servers.py    # Blockchain sync script
│   └── fetch_blockchain_data.mjs     # Node.js blockchain data fetcher
├── vercel.json                       # Cron job configuration (both syncs)
├── requirements.txt                  # Python dependencies (generated from pyproject.toml)
└── pyproject.toml                    # UV project file (source of truth)
```

## Configuration

### 1. Environment Variables

Add these to your Vercel project settings:

```bash
# Required for sync functionality
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required for cron security
CRON_SECRET=your_generated_secret_string
```

### 2. Cron Schedule

Current schedule in `vercel.json`:
- **MCP Registry**: `0 */6 * * *` (every 6 hours at 00:00, 06:00, 12:00, 18:00 UTC)
- **Blockchain**: `30 */12 * * *` (every 12 hours at 00:30, 12:30 UTC)

To change the schedule, update the `schedule` field in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/sync-mcp-remotes",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/sync-blockchain",
      "schedule": "30 */12 * * *"
    }
  ]
}
```

Common cron expressions:
- Every hour: `0 * * * *`
- Every 12 hours: `0 */12 * * *`
- Daily at midnight: `0 0 * * *`
- Every 6 hours: `0 */6 * * *`

## API Endpoints

### `/api/sync-mcp-remotes` (MCP Registry Cron)
- **Method**: GET or POST
- **Authentication**: Bearer token with `CRON_SECRET`
- **Purpose**: Triggered automatically by Vercel Cron for official MCP registry
- **Response**: JSON with sync results

### `/api/sync-blockchain` (Blockchain Cron)
- **Method**: GET or POST
- **Authentication**: Bearer token with `CRON_SECRET`
- **Purpose**: Triggered automatically by Vercel Cron for blockchain registry
- **Response**: JSON with sync results

### `/api/manual-sync` (Manual Trigger)
- **Method**: POST
- **Authentication**: Authenticated user session
- **Body**: `{ "type": "mcp-remotes" | "blockchain" }`
- **Purpose**: Manual sync trigger from dashboard (both types)
- **Response**: JSON with sync results

### `/api/sync-status` (Status Check)
- **Method**: GET
- **Authentication**: None (public)
- **Purpose**: Check sync system health for both sources
- **Response**: JSON with system status

## Security

### Cron Protection
The cron endpoint is protected by a secret token:

1. Generate a strong random string (32+ characters)
2. Add it as `CRON_SECRET` environment variable
3. Vercel automatically includes this in cron requests

### Manual Sync Protection
The manual sync endpoint requires:
- User authentication via Supabase Auth
- Optional: Admin role check (customize in the code)

## Dashboard Access

Admins can access the sync dashboard at `/dashboard` which includes:
- Manual sync trigger button
- Sync status and logs
- Last sync information
- Error details and troubleshooting

## Monitoring

### Vercel Logs
View sync execution logs in your Vercel dashboard:
1. Go to your project dashboard
2. Click on "Functions"
3. Find the sync function executions
4. View logs for each run

### Status Endpoint
Check system health: `GET /api/sync-status`

Example response:
```json
{
  "status": "healthy",
  "totalServers": 142,
  "officialServers": 98,
  "blockchainServers": 44,
  "lastSyncedServer": {
    "name": "example/server",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "systemTime": "2024-01-15T14:22:33Z",
  "cronSchedules": {
    "mcp-remotes": "0 */6 * * *",
    "blockchain": "30 */12 * * *"
  }
}
```

## Deployment

1. **Update Requirements** (if you modify Python dependencies):
   ```bash
   # Regenerate requirements.txt from pyproject.toml for Vercel
   uv pip compile pyproject.toml -o requirements.txt
   ```

2. **Add Environment Variables**:
   ```bash
   # In Vercel dashboard, add:
   CRON_SECRET=your-secret-here
   NEXT_PUBLIC_SUPABASE_URL=your-url
   SUPABASE_SERVICE_ROLE_KEY=your-key
   ```

3. **Deploy to Vercel**:
   ```bash
   git add .
   git commit -m "Add automated sync system"
   git push origin main
   ```

3. **Verify Cron Jobs**:
   - Check Vercel dashboard → Cron tab
   - Confirm the job is scheduled
   - Wait for first execution or trigger manually

## Troubleshooting

### Cron Not Running
- Verify `vercel.json` is in project root
- Check Vercel dashboard → Cron tab
- Ensure `CRON_SECRET` is set

### Script Execution Errors
- Check Vercel function logs
- Verify Python dependencies in `requirements.txt`
- Ensure environment variables are accessible

### Authentication Errors
- Verify Supabase credentials
- Check service role key permissions
- Ensure database table exists

### Manual Sync Issues
- Check user authentication
- Verify admin permissions in code
- Review browser console for errors

## Customization

### Adding More Sync Scripts
1. Create new API endpoint: `/api/sync-other-source/route.ts`
2. Add to `vercel.json` crons array
3. Update dashboard if needed

### Changing Admin Logic
Edit the admin check in `/app/dashboard/page.tsx`:
```typescript
const isAdmin = user.email?.includes('your-domain') || 
                user.user_metadata?.role === 'admin';
```

### Custom Notifications
Add notification logic to sync endpoints:
- Email on failures
- Slack/Discord webhooks
- Database logging