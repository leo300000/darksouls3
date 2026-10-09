"""Sert l'export statique comme GitHub Pages : sous un préfixe (ex. /darksouls3) et avec 404.html.
Usage : python3 tests/serve-pages.py <dossier> <port> <préfixe>"""
import http.server, os, sys

ROOT, PORT, PREFIX = sys.argv[1], int(sys.argv[2]), sys.argv[3].rstrip("/")


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = path.split("?")[0].split("#")[0]
        if PREFIX and p.startswith(PREFIX):
            p = p[len(PREFIX):] or "/"
        return os.path.join(ROOT, p.lstrip("/"))

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        body = open(os.path.join(ROOT, "404.html"), "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


http.server.ThreadingHTTPServer(("", PORT), Handler).serve_forever()
