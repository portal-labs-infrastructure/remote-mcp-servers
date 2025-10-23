from http.server import BaseHTTPRequestHandler
import os
import sys
import json
import traceback

# Add the scripts directory to the path so we can import the sync script
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "scripts"))


class handler(BaseHTTPRequestHandler):
    def _send_json_response(self, status_code, data):
        """Helper to ensure we always send valid JSON"""
        self.send_response(status_code)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        return self._handle_request()

    def do_POST(self):
        return self._handle_request()

    def _handle_request(self):
        try:
            # Security: Verify the request is from Vercel Cron
            auth_header = self.headers.get("Authorization")
            cron_secret = os.environ.get("CRON_SECRET")

            if not cron_secret:
                return self._send_json_response(
                    500, {"error": "CRON_SECRET not configured"}
                )

            if auth_header != f"Bearer {cron_secret}":
                return self._send_json_response(401, {"error": "Unauthorized"})

            # Parse request body to check for force_full_sync flag
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    body = self.rfile.read(content_length)
                    request_data = json.loads(body.decode('utf-8'))
                    if request_data.get('force_full_sync'):
                        os.environ['FORCE_FULL_SYNC'] = 'true'
                        print("Force full sync enabled via request parameter")
            except (json.JSONDecodeError, ValueError):
                # If there's no body or it's invalid, just continue with default behavior
                pass

            # Import here to avoid import errors if dependencies aren't available yet
            from sync_mcp_remotes import main as sync_main

            # Run the sync
            print("Starting MCP remotes sync...")
            sync_main()
            print("MCP remotes sync completed successfully")

            return self._send_json_response(
                200,
                {
                    "success": True,
                    "message": "MCP remotes sync completed successfully",
                },
            )

        except ImportError as e:
            error_trace = traceback.format_exc()
            print(f"Import error: {error_trace}")
            return self._send_json_response(
                500,
                {
                    "error": "Import failed",
                    "details": str(e),
                    "trace": error_trace,
                },
            )

        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"Sync failed: {error_trace}")
            return self._send_json_response(
                500,
                {"error": "Sync failed", "details": str(e), "trace": error_trace},
            )
