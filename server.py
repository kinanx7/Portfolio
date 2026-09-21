import http.server
import socketserver
import json
import os
import sys

# Force UTF-8 for console output on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/save-translations':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Format JS output cleanly
                js_lines = [
                    "/**",
                    " * Translations Dictionary for Kinan Rahal Portfolio",
                    " * Auto-saved from Translation Manager (Dev Mode)",
                    " */",
                    "",
                    "const translations = " + json.dumps(data, ensure_ascii=False, indent=2) + ";",
                    "",
                    "if (typeof window !== 'undefined') {",
                    "  window.translations = translations;",
                    "}",
                    "if (typeof module !== 'undefined') {",
                    "  module.exports = translations;",
                    "}",
                    ""
                ]
                js_content = "\n".join(js_lines)
                
                target_path = os.path.join(DIRECTORY, 'translations.js')
                with open(target_path, 'w', encoding='utf-8') as f:
                    f.write(js_content)
                
                try:
                    print("[DEV SERVER] Successfully saved translations.js")
                except Exception:
                    pass
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok', 'message': 'translations.js saved successfully'}).encode('utf-8'))
            except Exception as e:
                err_msg = str(e)
                try:
                    print(f"[DEV SERVER ERROR] {err_msg}")
                except Exception:
                    pass
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': err_msg}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DevHandler) as httpd:
        print(f"Dev server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
