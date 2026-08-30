#!/usr/bin/env python3
"""Local dev server for the site.

Everything is served straight from the repo, except plaza.json, which on the
real site is built by Jekyll out of _data/plaza/*.json.  There is no Jekyll
here, so this server assembles that same array on the fly — the studio then
sees the plaza it would see in production.
"""
import http.server, json, os, socketserver, pathlib

ROOT = pathlib.Path(__file__).parent.resolve()
PLAZA = ROOT / '_data' / 'plaza'
PORT = 4321


def roster():
    out = []
    for f in sorted(PLAZA.glob('*.json')):
        try:
            out.append(json.loads(f.read_text()))
        except Exception as e:
            print(f'  skipped {f.name}: {e}')
    return out


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def do_GET(self):
        if self.path.split('?')[0].endswith('/plaza.json'):
            body = json.dumps(roster()).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
    print(f'serving {ROOT} at http://localhost:{PORT}/  ({len(roster())} Miis in the plaza)')
    httpd.serve_forever()
