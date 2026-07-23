#!/usr/bin/env python3
"""Beshamel orders dev server. Serves this folder with no-cache headers so the
browser always fetches fresh CSS/JS/HTML. Usage: python3 serve.py [port] (default 8300).
Changes cwd via __file__ so it works even when the spawn cwd is inaccessible."""
import http.server, socketserver, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8300


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
    print(f"Serving Beshamel orders on http://127.0.0.1:{PORT} (no-cache)")
    httpd.serve_forever()
