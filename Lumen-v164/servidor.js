// Servidor local de Lumen Reader — sin internet y sin instalar nada.
// Requiere Node.js (https://nodejs.org). Si no lo tienes, usa servidor.py.
const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const ROOT = __dirname
const BASE_PORT = Number(process.env.LUMEN_PORT || 8321)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.gz': 'application/gzip',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.traineddata': 'application/octet-stream',
}

function crearServer() { return http.createServer((req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0])
    if (p.endsWith('/')) p += 'index.html'
    const file = path.normalize(path.join(ROOT, p))
    if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) {
      res.writeHead(403)
      res.end('403')
      return
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        // SPA fallback: todo lo que no existe devuelve la app
        fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
          if (e2) {
            res.writeHead(404)
            res.end('No se encontró index.html')
            return
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
          res.end(d2)
        })
        return
      }
      const ext = path.extname(file).toLowerCase()
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      })
      res.end(data)
    })
  } catch (e) {
    res.writeHead(500)
    res.end('Error del servidor')
  }
})
}
function abrir(port) {
  console.log('')
  console.log('   ✨ Lumen Reader está en:  http://localhost:' + port)
  console.log('   No cierres esta ventana mientras usas la app.')
  console.log('   Para salir: Ctrl+C (o cierra esta ventana).')
  console.log('')
  abrirNavegador(port)
}
function intentar(port) {
  const server = crearServer()
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && port < BASE_PORT + 10) {
      console.log('   (puerto ' + port + ' ocupado por otra sesión; uso ' + (port + 1) + ')')
      intentar(port + 1)
    } else {
      console.error('   No se pudo abrir el puerto ' + port + ': ' + e.code)
      process.exit(1)
    }
  })
  server.listen(port, () => abrir(port))
}
intentar(BASE_PORT)

function abrirNavegador(port) {
  const url = 'http://localhost:' + port + '/'
  const cmd =
    process.platform === 'win32'
      ? 'start "" ' + url
      : process.platform === 'darwin'
        ? 'open ' + url
        : 'xdg-open ' + url
  try {
    exec(cmd)
  } catch (e) {
    /* sin navegador automático: el usuario abre la URL a mano */
  }
}
