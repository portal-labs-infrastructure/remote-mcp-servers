from http.server import BaseHTTPRequestHandler
import os
import sys

# Add the scripts directory to the path so we can import the sync script
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "scripts"))

from sync_mcp_remotes import main as sync_main


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Security: Verify the request is from Vercel Cron
        auth_header = self.headers.get("Authorization")
        cron_secret = os.environ.get("CRON_SECRET")

        if not cron_secret:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error": "CRON_SECRET not configured"}')
            return

        if auth_header != f"Bearer {cron_secret}":
            self.send_response(401)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error": "Unauthorized"}')
            return

        try:
            # Run the sync
            sync_main()

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(
                b'{"success": true, "message": "MCP remotes sync completed successfully"}'
            )
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            error_msg = f'{{"error": "Sync failed", "details": "{str(e)}"}}'
            self.wfile.write(error_msg.encode())
        return

    def do_POST(self):
        # Handle POST requests the same as GET
        return self.do_GET()
