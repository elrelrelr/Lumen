# 📖 Lumen Reader

E-reader minimalista con OCR, TTS, racha de lectura y modo offline. 100% privado:
tus libros y diccionarios viven **solo en tu dispositivo** (IndexedDB) — nada se
sube a ningún servidor.

---

## Opción A — Correrlo en tu computadora (recomendado)

1. Descarga el ZIP de la versión más reciente:
   **Code → Download ZIP** (o desde *Releases*).
2. Descomprímelo.
3. Abre el archivo de arranque según tu sistema:

| Sistema  | Archivo              |
|----------|----------------------|
| Windows  | `Abrir-Lumen.bat`    |
| Mac      | `Abrir-Lumen.command`|
| Linux    | `Abrir-Lumen.sh`     |

   (Si tu sistema pide permiso: clic derecho → *Abrir con Terminal / Ejecutar*.)
4. Se abre `http://localhost:8321` en tu navegador. Cerrado el navegador,
   la app sigue funcionando **sin internet** (service worker).

No requiere instalar nada, no hay cuenta y no hay nube.

---

## Opción B — Publicarlo con enlace propio (GitHub Pages, sin marca de agua)

Si quieres un link como `https://TUNOMBRE.github.io/lumen/` para compartirlo:

1. Crea un repositorio en GitHub, p. ej. `lumen`.
2. Sube **el contenido de esta carpeta** (con `index.html` en la raíz del repo).
3. *Settings → Pages → Deploy from a branch → `main` (o `master`) → `/ (root)` → Save*.
4. En ~1 minuto tienes tu enlace propio con HTTPS y **sin ninguna marca de agua**.
5. En el teléfono se instala como app: abre el link en Chrome/Safari →
   **«Añadir a pantalla de inicio» / «Instalar app»**. Funciona offline.

Para actualizar: sube la carpeta nueva del ZIP (o copia los archivos sobre el
repo). **El enlace no cambia.**

> Cada versión publicada incluye un `LUMEN-VERSIONES.txt` con el changelog y
> los md5 de los archivos para verificar la integridad.

---

## Qué incluye

- Lectura de PDF/EPUB/TXT con OCR, traducción, TTS y música ambiente.
- Repaso espaciado (FSRS) con colores por tipo de palabra.
- Diccionarios y canciones descargables dentro de la app.
- Lumo, tu compañero de lectura (misiones, tienda, logros).
- Biblioteca global, libros gratis (Gutenberg) y buscador web.

## Verificación de integridad

```
md5sum assets/index-*.js assets/index-*.css sw-v*.js registerSW.js
```

Debe coincidir con lo publicado en `LUMEN-VERSIONES.txt`.
