from http.server import BaseHTTPRequestHandler
import os
import json
import traceback
import urllib.request
import urllib.error


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

            print("Starting blockchain sync (delegating to Node.js)...")

            # Delegate to the complete Node.js implementation
            # Use the complete sync endpoint that handles everything in Node.js
            req = urllib.request.Request(
                "http://localhost:3000/api/sync-blockchain-complete",
                method="POST",
                headers={"Authorization": f"Bearer {cron_secret}"},
            )

            with urllib.request.urlopen(req, timeout=300) as response:
                result = json.loads(response.read().decode())
                print("Blockchain sync delegated successfully")
                return self._send_json_response(200, result)

        except urllib.error.HTTPError as e:
            error_trace = traceback.format_exc()
            error_body = e.read().decode() if e.fp else "No error body"
            print(f"HTTP error from Node.js endpoint: {error_trace}")
            print(f"Error body: {error_body}")
            return self._send_json_response(
                500,
                {
                    "error": "Node.js sync failed",
                    "details": f"HTTP {e.code}: {error_body}",
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
