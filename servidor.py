#!/usr/bin/env python3
# Servidor local de Lumen Reader — sin internet y sin instalar nada.
# Requiere Python 3 (https://www.python.org). Si no lo tienes, usa servidor.js.
import http.server
import mimetypes
import os
import socketserver
import threading
import webbrowser

PORT = 8321
ROOT = os.path.dirname(os.path.abspath(__file__))

# Tipos que algunos sistemas no conocen y hacen falta para la app
mimetypes.add_type('application/manifest+json', '.webmanifest')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('application/wasm', '.wasm')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, *a):
        pass  # silencio


httpd = None
for _pu in range(PORT, PORT + 10):
    try:
        httpd = socketserver.TCPServer(('0.0.0.0', _pu), Handler)
        PORT = _pu
        break
    except OSError:
        print('   (puerto %d ocupado; pruebo %d)' % (_pu, _pu + 1))
if httpd is None:
    raise SystemExit('No se encontró puerto libre')
with httpd:
    url = 'http://127.0.0.1:%d/' % PORT
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    print('')
    print('   ✨ Lumen Reader está en:  ' + url)
    print('   No cierres esta ventana mientras usas la app.')
    print('   Para salir: Ctrl+C (o cierra esta ventana).')
    print('')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
