# Lumen Reader · registro de cambios (web)

## v137 · Portada verificada de punta a punta + error claro sin original

**Verificación funcional (nuevo):** con un entorno que simula el navegador (jsdom + IndexedDB) se reprodujo el flujo real completo y **ambos botones de la hoja "Portada del libro" quedaron verificados de punta a punta**:

- **🖼 Elegir una imagen** → abre el input de archivos → al elegir una imagen se procesa y se guarda la portada con "Portada actualizada" ✓
- **📄 Usar la primera página** → toma el original del libro, renderiza la página 1 y guarda la portada ✓
- El input de portada vive a nivel raíz (v136) y **persiste** al cerrar paneles ✓

Si en tu equipo el botón "Elegir una imagen" seguía sin abrir el selector, la causa era la versión antigua en caché del navegador: esta v137 (o la v136) resuelve el bug; asegúrate de recargarla (ver nota al final).

**Mejora (v137):** si un libro no tiene su archivo original guardado (importado en una versión anterior), "📄 Usar la primera página" ahora lo explica en vez de mostrar un error genérico:
*"Este libro no tiene su archivo original guardado (importado en una versión anterior). Vuelve a importarlo para usar esta opción"*.

**Nota importante (caché del navegador):** si abrís la app desde el servidor en vivo, cerrá la pestaña por completo y volvela a abrir (o Ctrl+Shift+R). El service worker puede seguir sirviendo la versión vieja durante una recarga.

**Paquete:** `Lumen-v137.zip` — 143 archivos · 9.8 MB · carpeta `Lumen-v137/`.

**Entrega: service worker renombrado (`sw.js` → `sw-v137.js`).** Si el navegador seguía mostrando una versión vieja aunque el servidor estaba actualizado, la causa era el service worker con la caché anterior. Ahora el SW vive en `sw-v137.js` y el registro (`registerSW.js`) **desregistra automáticamente cualquier SW de versiones anteriores** y recarga una vez solo cuando se activa el nuevo. Con esto, al recargar la página el navegador se actualiza a la versión del servidor sin tener que borrar caché a mano.

## v136 · Portada: botón "Elegir una imagen" corregido

**Bug corregido (reportado por el usuario):** en la hoja "Portada del libro" el botón "🖼 Elegir una imagen" no hacía nada (no abría el selector de archivos del PC, no pedía permisos).

**Causa:** el `<input type="file">` de portada estaba montado dentro del panel de long-press del libro. Al tocar "🖼 Portada" el panel se cerraba (`setLongPress(null)`) y el input se desmontaba → la referencia `coverRef` quedaba en `null` y el click del botón no llegaba a ejecutarse.

**Solución:** el input se mueve a nivel raíz de la app (junto al input de importación), siempre montado, y su `onChange` opera sobre `coverFor` (el libro elegido para la portada) en vez de `longPress`. Al tocar "Elegir una imagen" ahora se abre el selector nativo de archivos, se procesa la imagen con `makeCover` (miniatura 160 px) y se guarda con "Portada actualizada".

**Paquete:** `Lumen-v136.zip` — 143 archivos · 9.8 MB · carpeta `Lumen-v136/`.

## v135 · Respaldos en ZIP, sin nube; PDF que no se atasca; modo libro más sensible

Base: v134. Entrega: `Lumen-v135.zip` · badge visible **v135** en la barra lateral.

### 1. Respaldo en ZIP (mejorando el respaldo existente) · nube eliminada

La caja «Cambiar de teléfono» ahora exporta en **ZIP** (antes: `.lumen`
sin los archivos de los libros):

- **📦 Completo (.zip)** — `respaldo.json` con TODO (libros, nombres,
  páginas, marcadores, resaltados, ediciones, cartas de repaso, frases,
  notas, música de fondo, fondos, ajustes, racha, identidades, catálogo…)
  más la carpeta `libros/` con los **archivos originales** de cada libro.
  Al importarlo se restaura el progreso y se devuelven los archivos a su
  sitio (store `blobs`).
- **📚 Solo libros (.zip)** — solo la carpeta `libros/` con los archivos
  originales + `libros.json` (manifiesto con nombre, título y tipo de
  cada uno). Sin ninguna modificación; al importarlo cada archivo pasa
  por el importador normal y vuelve a la biblioteca.
- **⬇ Importar** — acepta `.zip` (detecta solo-completo o solo-libros),
  `.lumen` y `.json` (compatibilidad con los respaldos antiguos).
- **Nube eliminada**: caja «Copia en la Nube (Google Drive / Proton)»,
  su hoja de conexión, la guía de Google Drive, la autosincronización en
  segundo plano y el chunk `nube` (el bundle pesa menos). La sección se
  llama ahora «Ajustes de respaldo».

### 2. PDF en Original: se carga todo, aunque una página falle

El preload iba en cadena serial: si una página tardaba o fallaba, el
resto de la cola quedaba muerto («cargaba una parte y nunca el resto»).
Ahora:

- **Pool de 3 páginas a la vez** (antes: 1): el resto nunca se detiene.
- **Timeout de 45 s por página**: si una página se atasca, se libera su
  hueco y se vuelve a pedir al hacer scroll; no bloquea a las demás.
- **Ventana de preload más amplia** (±2 páginas en vez de ±1; +3 al
  montar) y caché de 18 páginas (antes 12): al navegar se ve antes.
- Al **cambiar de libro**, los renders del libro anterior se descartan
  (contador de generación) y no contaminan el nuevo.

### 3. Imágenes · modo «libro»: más sensible y sin choque con el scroll

- La página **cabe dentro de la vista** (`object-fit: contain`, sin
  scroll vertical interno): al arrastrar para pasar página ya no choca
  con el scroll de la imagen alta.
- Con ratón: al soltar con un desplazamiento **> 48 px** cambia de
  página directamente (antes dependía del snap y los gestos cortos no
  contaban).

### 4. Desplazamiento por pestaña (el elegido desactiva a los demás)

Cada pestaña (Texto / Imágenes / Original) **recuerda su propio
desplazamiento**: elegir «libro» en Imágenes ya no ensucia a las demás,
y al abrir la hoja de desplazamiento de una pestaña, el elegido queda
activo y los demás se ven atenuados (se puede cambiar tocándolos, para
no quedarse bloqueado).

---

## v134 · Texto: scroll que no se demora; PDF en Original con texto seleccionable

Base: v133. Entrega: `Lumen-v134.zip` · badge visible **v134** en la barra lateral.

### 1. El desplazamiento «scroll» en Texto ya no se queda pegado

El auto-avance al llegar al final de la página fallaba a veces por tres
causas; las tres corregidas:

- **Página que apenas desborda**: el control exigía un desborde
  ≥ 90 px; si la página solo sobraba unos píxeles, el auto-avance
  estaba muerto (se «movía el ratón» y nada pasaba). El umbral baja a
  24 px.
- **Margen de «al final»**: antes había que estar a ≤ 56 px del borde;
  ahora a ≤ 120 px, y si al re-verificar (420 ms después) el contenido
  creció un poco, se reintenta una vez más en vez de quedarse muerto
  hasta el próximo scroll.
- **Punto de partida de la página nueva**: al cambiar de página, el
  scroll se resetea al **topo** de la página nueva (con efecto
  explícito de respaldo), para que no se llegue «a mitad» de la página
  siguiente y tarde a llegar al final.

### 2. PDF en la pestaña Original: texto seleccionable y copiable

Los EPUB/HTML/TXT ya mostraban texto real (seleccionable), pero los PDF
eran imágenes (canvas) y no dejaban seleccionar nada. Ahora cada página
de PDF lleva una **capa de texto transparente** (el `TextLayer` oficial
de pdf.js 5.6, ya incluido en el bundle pero sin usar, ahora exportado
del chunk) alineada sobre la imagen:

- Se puede **seleccionar y copiar** texto en cualquier página de PDF
  (arrastrar sobre la página; en móvil el arrastre vertical sigue
  haciendo scroll, `touch-action: pan-y`).
- La capa se regenera al zoom (la píldora ➖/➕) y respeta la rotación
  y el recorte (🎛) que se apliquen a la página (el contenedor
  `.doc-page-visual` hereda `transform/clip-path`).
- EPUB/HTML/TXT/MD/DOCX/FB2/SRT ya eran texto real; las imágenes (CBZ,
  foto, escaneo) no tienen texto extraíble (solo OCR, como antes).

### Verificación (jsdom, 67/67 checks)

v134: 20 — auto-avance funcional con métricas simuladas (página 0→1 y
1→2, esta última con desborde mínimo de 30 px que el código viejo
bloqueaba), arranque al topo en cada página, `TextLayer` exportado y
renderizando spans de texto posicionados en % sobre la página, y
integración estructural (componente `PdfPageTextLayer` en el JSX de
`.doc-page`, reglas CSS de la capa). Regresión: 42 (v133) + 5 (voz).

## v133 · Imágenes con zoom y arrastre de libro, fijo en Imágenes, y adjuntar archivo al crear

Base: v132. Entrega: `Lumen-v133.zip` · badge visible **v133** en la barra lateral.

### El zoom por fin hace zoom en la pestaña Imágenes

La regla de v123 (`.orig-flow > div > canvas`) nunca coincidía con el
DOM real: el canvas de PDF vive un nivel más hondo (ZoomPane > div >
CanvasHost > canvas) y en los libros de imágenes la página es un
`<img>`, no un canvas. Nueva regla descendiente:

```css
.orig-flow canvas, .orig-flow img { zoom: calc(var(--doczoom, 100) / 100); }
```

Ahora la píldora ➖ / % / ➕ escala de verdad la página en Imágenes
(100% → 105% → …), igual que en Texto y Original.

### «Libro» en Imágenes: arrastre con ratón

El carrusel de imágenes solo respondía a dedo y rueda; con ratón no
pasaba nada. Se le dieron los mismos gestos que ya tenía el carrusel de
texto: `onDragStart` (evita el arrastre fantasma de imagen) +
`onMouseDown` con seguimiento de `mousemove` en la ventana
(`scrollLeft = inicio - dx`). Ahora se arrastra a izquierda/derecha y
cambia de página al soltar; rueda y táctil siguen funcionando.

### «Fijo» solo en Imágenes

«Fijo» (sin gestos: no hay auto-cambio de página al final del scroll ni
swipe; se cambia con los controles) se habilita **solo en la pestaña
Imágenes**. En Texto y Original sigue deshabilitado con su nota, como
desde v132.

### Crear libro → Editor: modo «📎 Adjuntar archivo»

Junto a «Voz» hay ahora un modo **Archivo** en el editor: botón
«📎 Adjuntar archivo» con un picker de archivos que acepta todos los
formatos que Lumen sabe abrir: PDF, DOC/DOCX, EPUB, TXT, MD, RTF, FB2,
HTML, SRT, MOBI, AZW/AZW3, CBZ, ZIP, `.lumen` e imágenes. El archivo se
pasa al mismo pipeline de importación del botón «Añadir» de la
biblioteca (toast «… importado», chip «Listo · toca para abrir»,
portada automática) y la hoja se cierra para dejar ver el libro recién
creado en la biblioteca. Objetivo: no hace falta construir el libro
página por página dentro de Lumen.

### Permisos: cada botón pide el que corresponde (verificado)

| Botón | Permiso pedido | Al denegarlo |
|-------|----------------|--------------|
| 📋 Pegar | portapapeles (`navigator.clipboard.readText`) | toast «📋 Da permiso de portapapeles al navegador, o pega con Ctrl+V» |
| 🎙️ Voz | micrófono (`getUserMedia({audio:true})`) | toast «🎙️ Para dictar, da permiso de micrófono al navegador» |
| 🖼️ Imágenes / 📷 Cámara | picker de archivo/cámara del sistema (sin permiso extra) | — |
| 📎 Adjuntar archivo | picker de archivos del sistema (sin permiso extra) | — |

Verificación automatizada (jsdom, 47/47 checks): zoom 100→105 con
`--doczoom` propagado, carrusel con drag sin errores, fijo habilitado
solo en Imágenes, importación E2E de un .txt real (libro y páginas en
IndexedDB, hoja cerrada), y toasts de permiso de portapapeles y
micrófono al denegar cada uno.

## v132 · Lector: barrita legible (emojis), fab des tapado y desplazamiento por pestaña

Base: v131. Entrega: `Lumen-v132.zip` · badge visible **v132** en la barra lateral.

### Los iconos de la barrita por fin se ven (bug de fondo corregido)

El problema de fondo: el bundle compilaba los hijos «de texto» de esos
botones como tercer argumento de `jsx()`, y el runtime lo interpreta
como CLAVE (no como contenido) → los botones de zoom (−, %, +) y el de
filtros (🎛) se renderizaban **vacíos**: solo se veían unas chinchetas
grises sin nada dentro.

- Se movió el contenido a `props.children` (donde el runtime sí lo
  lee): los botones ahora muestran de verdad su símbolo.
- Como pediste, el zoom usa **emojis**: ➖ alejar / ➕ acercar, y el
  porcentaje (toca para restablecer) vuelve a verse en el centro.
- Las píldoras (colores de página, zoom y filtros) se **aclararon**:
  fondo pizarra `rgba(45,48,66,0.94)` con borde más marcado, para que
  se distingan del fondo oscuro de la página.

### El auto-scroll y subir/bajar ya no los tapa la barra de progreso

- El grupo flotante (⚙ auto-scroll + ↑/↓) se subió de 80 px a
  **120 px**: ahora va en la **misma línea que la barrita** de temas y
  colores, por encima de la barra de progreso horizontal.
- La barrita reserva espacio a su derecha (118 px) para que el grupo
  flotante nunca la choque, en pantallas anchas o estrechas (en
  anchos pequeños la barrita simplemente hace dos filas).
- Sigue apareciendo **solo en la pestaña Texto** (igual que antes).

### Desplazamientos disponibles según la pestaña activa

Cada pestaña ahora solo ofrece los desplazamientos que tiene sentido
ahí; el resto quedan **deshabilitados** (atenúados, no clicables) con
la nota «no disponible en esta pestaña»:

| Pestaña   | Disponibles                     |
|-----------|---------------------------------|
| Texto     | Scroll y Lateral (carusel)      |
| Imágenes  | Libro, Lateral (carusel), Scroll|
| Original  | Solo Scroll                     |

- «Libro» queda deshabilitado en Texto (su gesto de deslizar choca con
  seleccionar texto, como señalaste).
- Si tu configuración guardada era un modo que no aplica a la pestaña
  actual (p. ej. «Libro» estando en Texto), el lector aplica el modo
  válido automáticamente (Scroll) sin romper nada; al cambiar de
  pestaña vuelve a respetar lo permitido en cada una.

### Verificación

- JS `index-DOrzQ79O.js` md5 `d9496ef2ae6eea1803ec29133f9be30b`
- CSS `index-DQUWFWNX.css` md5 `b32d70dc23d7b9f0024dfca3206b2d8d`
- `sw.js`: revisiones del JS y del CSS actualizadas.
- ESM estricto (`node --check`): OK.
- Test en vivo (jsdom, libro de prueba con config guardada en «Libro»):
  28/28 — los botones de zoom y filtros muestran su contenido, el
  lector en Texto aplica Scroll aunque la config diga Libro (sin
  carrusel), y la hoja «Desplazamiento» muestra scroll + carusel
  habilitados y libro/mixto/fijo deshabilitados con su nota.

## v131 · Lector de texto: controles visibles, alineados y siempre presentes

Base: v130. Entrega: `Lumen-v131.zip` · badge visible **v131** en la barra lateral.

### La barrita de temas/zoom ya no tapona la barra de progreso

- La barrita redondeada (colores de página + zoom + filtros) se subió de
  92 px a **120 px** desde el borde inferior: ahora queda flotando
  por encima de la barra inferior y deja ver (y tocar) la barra de
  progreso horizontal sin taparla.

### Los iconos de colores y el zoom ahora se ven (y se sabe a cual se da clic)

Antes los puntos «Oscuro» y «Negro» eran casi invisibles sobre la
píldora oscura, y ningún botón cambiaba al pasar el ratón (solo al
hacer clic, ya tarde).

- Cada punto de color lleva ahora un **anillo fuerte de contraste**
  (blanco en temas oscuros, oscuro en claro/sepia): los cuatro temas
  se distinguen siempre, sin importar el fono.
- Zoom (− / % / +): cada botón tiene ahora **fondo propio** y un
  **estado hover** (se ilumina y crece) → al pasar el ratón se ve
  exactamente a cuál se va a dar clic. Igual para el botón de filtros.
- Hover en los puntos de color: crecen 22 % y el anillo se intensifica.

### Botón «subir a arriba / bajar a fondo» alineado

- Antes el botón pequeño (↑/↓) quedaba descolocado a la derecha del
  botón de velocidad, como si fuera a caerse.
- Ahora ambos van en una **fila alineada en el centro**: el de
  navegación (34 px) queda a la **izquierda** del de auto-scroll
  (48 px), con el borde derecho del conjunto anclado a la esquina.

### Auto-scroll: el botón ya no desaparece cada dos hojas

- Antes el grupo flotante entero (auto-scroll + arriba/abajo) solo
  aparecía si la página desbordaba el 140 % de la altura de la
  ventana; en las páginas con poco texto desaparecía.
- Ahora el grupo **siempre está presente** en la pestaña de texto.
- Si la página no se desplaza (entra de sobra en la ventana), los
  botones quedan **atenúados y desactivados** (se ve que están, pero
  no aplica allí); en cuanto la página desborda (ahora con solo 40 px
  de desborde, antes 40 %) se activan solos.

### Verificación

- JS `index-DOrzQ79O.js` md5 `1085bed0e590130805e9ca21e85c1f0c`
- CSS `index-DQUWFWNX.css` md5 `d400ca95229752426c0132947e4af6f4`
- `sw.js`: revisiones del JS y del CSS actualizadas.
- ESM estricto (`node --check`): OK.
- Test en vivo (jsdom con libro de prueba de 3 páginas, corta/larga/
  corta): 19/19 checks — lector monta, el grupo flotante aparece en
  página corta (antes no), la fila nueva contiene auto-scroll + nav,
  la barrita muestra 4 puntos + zoom + filtros, y al pasar a la
  página larga todo sigue presente.

## v130 · Lumo: pantalla completa responsive y oso SVG manipulable

Base: v129. Entrega: `Lumen-v130.zip` · badge visible **v130** en la barra lateral.

### La pestaña Lumo ahora se amplía a la pantalla (responsive)

Antes el panel estaba encerrado a 720 px y la escena del oso medía 200 px
de alto fijos: en un PC se veía como una cajita pequeña.

- Panel: `max-width: min(1180px, 100%)` → ocupa la pantalla en escritorio
  y el ancho completo en móvil (sin romperse en tamaño ninguno).
- Escena del oso: `clamp(240px, 44vh, 620px)` → crece con la pantalla.
- Oso: `clamp(190px, 40vmin, 430px)` → proporcional al viewport.
- Grilla «Habitación»: `auto-fill minmax(84px, 1fr)` → se adapta.
- Listas de Tienda/Logros centradas con tope de 880 px en pantallas
  anchas (seguen a todo ancho en móvil).
- Suelo sutil en la escena (`::before` con degradado).

### El oso ahora es SVG dibujado a mano (manipulable)

La imagen PNG (`lumo/lumo_base.png`) daba problemas de carga y no permitía
posicionar accesorios con precisión. Ahora Lumo es un `<svg viewBox="0 0
240 240">` dibujado en capas, incrustado en el bundle (no depende de
ningún archivo externo):

- **Estados animados**: normal, feliz, triste, cansado, leyendo (con
  librito en las manos), durmiendo (con «Zzz») y celebrando (brazos arriba
  + confeti). Las animaciones CSS (idle/leer/celebrar/dormir) ahora
  aplican también al SVG.
- **Accesorios bien ubicados** (antes: emojis flotantes con offsets a
  ojo): cada accesorio se dibuja en las coordenadas exactas del oso —
  gafas redondas/estrella/luna sobre los ojos, gorros (bóina, sol, mago)
  sobre la cabeza, bufanda roja y collar de bolas en el cuello, coronas
  y moños en la cabeza, tulipán en la oreja, capas y mochilas detrás del
  cuerpo con sus tirantes sobre los hombros.
- **Muebles al lado del oso**: los 14 muebles de la habitación
  (estantería, planta, lámpara, alfombra, biblioteca, trofeo, globo,
  cuadro, guitarra, peluche, acuario, piano, carrito y radio) se dibujan
  en SVG y se colocan en su sitio dentro de la escena (suelo y pared,
  delante o detrás del oso según el mueble).
- El widget de inicio y la felicitación de meta también usan el SVG
  (adiós a las tres referencias a la PNG).

### Verificación

- JS `index-DOrzQ79O.js` md5 `ff09aeb14585918a1b58107acd409280`
- CSS `index-DQUWFWNX.css` md5 `04e8703f83374885b65d8f02100ca3f8`
- `sw.js`: revisiones del JS y del CSS actualizadas (57 entradas).
- ESM estricto (`node --check`): OK.
- Arranque headless: 0 errores, badge v130 visible.
- Probado en vivo (harness con estado Lumo sembrado): el panel abre, el
  oso SVG renderiza con sus accesorios (59 nodos), los 8 muebles
  sembrados aparecen en la escena y la grilla de Habitación muestra
  14 muebles con 8 desbloqueados.

## v129 · Lector: arrastre del libro, mini-barra oculta e iconos visibles

Base: v128. Entrega: `Lumen-v129.zip` · badge visible **v129** en la barra lateral.

### Bug 1 — «el desplazamiento de libro sigue sin funcionar»

En modo **libro** (carrusel) el gesto R→L a veces giraba página y a veces
hacía un pequeño scroll vertical (o el rebote «atrás» del navegador al
llegar al borde).

- `.carousel`: `touch-action: pan-x` → el dedo solo desplaza en
  horizontal; la página no «se escapa» a scroll vertical.
- `.carousel`: `overscroll-behavior-x: contain` → al llegar al primer/último
  libro ya no dispara el rebote ni el gesto «atrás» del navegador.
- Nuevo arrastre con ratón en el carrusel (clic + mantener R↔L arrastra
  páginas en escritorio, con `onDragStart` para no seleccionar texto).
- El snap de página (`scroll-snap-type: x mandatory` + el debounce de
  `onCarouselScroll`) se mantiene: al soltar el gesto se asienta en la
  página más cercana.

### Bug 2 — la mini-barra (color de página + zoom) no se ocultaba

La mini-barra `.rd-barra` (v123: «siempre visible») ignoraba el tap en el
contenido, a diferencia de las barras grandes.

- Ahora usa la misma clase de ocultado que las barras grandes:
  `rd-barra hidden-bottom` cuando el chrome está oculto
  (`translateY(115%) + opacity 0 + pointer-events none`) y transición de
  0,28 s para el slide.
- `pointer-events: none` forzado en sus hijos mientras está oculta
  (antes sus botones seguían atrapando toques aunque fueran invisibles).
- Verificado en vivo (harness real-book + IDB): tap en el contenido →
  `rd-bottom` y `rd-barra` reciben `hidden-bottom`; segundo tap → ambas
  reaparecen.

### Bug 3 — iconos oscuros invisibles sobre barra oscura

Dos fallos de contraste reales en la mini-barra (el resto de los 22 temas
oscuros y sus barras ya estaban consistentes: auditado `--fg` por tema):

- **Modo oscuro**: los puntos de color «Oscuro» (#1b1c22) y «Negro OLED»
  (#000000) casi desaparecían sobre la píldora oscura
  (rgba(18,19,26,.72)). Ahora llevan un anillo exterior claro
  (`box-shadow 0 0 0 1.5px rgba(255,255,255,.22)`) que los separa de la
  píldora en cualquier tema.
- **Temas Claro/Sepia**: el botón de colores y filtros (`.rb-fx`) seguía
  con icono blanco (`#fff`) cuando su píldora pasaba a blanca → invisible.
  Ahora usa `#222` en esos temas (igual que el resto de los botones de la
  barra).

### Verificación

- JS `index-DOrzQ79O.js` md5 `36285a2c1a01fdb8014ad87846d412ad`
- CSS `index-DQUWFWNX.css` md5 `cd130f046221890d54484e82244c1ce7`
- `sw.js`: revisiones del JS y del CSS actualizadas (57 entradas).
- ESM estricto (`node --check`): OK.
- Arranque headless: 0 errores, badge v129 visible.
- Lector probado en vivo con libro real sembrado en IndexedDB: carga sin
  bloqueos, las 3 correcciones verificadas (clase `hidden-bottom` en
  mini-barra, carrusel con `touch-action: pan-x`, regla de `.rb-fx`).

## v128 · Corrección crítica: la app arrancaba en negro

Base: v127. Entrega: `Lumen-v128.zip` · badge visible **v128** en la barra lateral.

### Qué pasó

En v126/v127 una línea mal formada en la cabecera de la tienda de Lumo
rompía el parseo de JavaScript **de todo el bundle**: la página cargaba en
negro y nada funcionaba (ni la biblioteca, ni el lector, ni sus modos de
desplazamiento en Texto/Original/Imágenes).

### Corrección

- Reparada la estructura JSX de la cabecera de la tienda (contadores de
  monedas + aviso «Lo que compres se pone a Lumo al momento» + lista).
- Verificación estricta ESM (parser real de módulos) de TODOS los archivos:
  OK.
- Arranque probado en entorno headless (DOM simulado): el bundle carga,
  React monta la app y la interfaz se pinta con 0 errores.
- Los modos de desplazamiento de las 3 pestañas (Texto con scroll
  automático, Original con scroll del documento, Imágenes) quedaron intactos
  en la revisión; su fallo era consecuencia directa de la app no cargar.

### Verificación

- JS `index-DOrzQ79O.js` md5 `bff31e7b4ede0af69c135cd257819806`
- CSS `index-DQUWFWNX.css` md5 `b0cb38e6642bdd6ca9a1226678310a5f` (sin cambios)
- `sw.js`: revisión del JS actualizada (57 entradas).
- Badges de versión v127 → v128 (título y barra lateral).
## v127 · Logro «De vuelta» funcional + scroll de Lumo y posiciones de accesorios

Base: v126. Entrega: `Lumen-v127.zip` · badge visible **v127** en la barra lateral.

### 1 · Logros: revisión y corrección

Se auditó todo el sistema (30 logros de app + logros de Lumo): motor de
desbloqueo con deduplicación (IndexedDB), toasts con cola y auto-cierre de
4,2 s, sonido, háptica y lista en Lumo. Todo correcto, excepto:

- **«De vuelta» (💪) era imposible de conseguir**: la bandera `comeback`
  nunca se marcaba. Ahora se detecta al leer: si tu mejor racha fue de
  3+ días, la racha se había roto y vuelves a leer, se desbloquea.
- Reproducible: páginas (temporizador de lectura real), meta diaria, niveles,
  fin de libro, arranque de app (recoge lo desbloqueado «a ciegas») y lista de Lumo.

### 2 · Responsive y alineación (revisión de todos los menús)

Revisadas las hojas (ajustes, TTS, estadísticas, guardar, buscar, catálogo…),
la barra lateral, el FAB, la cabecera de la biblioteca, las barras del lector,
los toasts y las celebraciones. Correcciones:

- **Panel de Lumo sin scroll en móvil**: con la tienda ampliada a 25 artículos
  (y misiones/logros) los elementos del fondo de la lista eran inalcanzables
  en pantallas pequeñas. El panel ahora hace scroll interno en cualquier
  tamaño de pantalla.
- **Posiciones de accesorios del oso**: la corona se dibujaba recortada
  (fuera de la escena) y corona/flor se solapaban al equipar varios; ahora
  cada slot (lazo, corona, flor) tiene su sitio propio dentro de la escena.

### Verificación

- `node --check` OK sobre el bundle parcheado.
- JS `index-DOrzQ79O.js` md5 `eefd1aee1b1595cb22879bc34ec99014`
- CSS `index-DQUWFWNX.css` md5 `b0cb38e6642bdd6ca9a1226678310a5f`
- `sw.js`: revisiones del JS y CSS actualizadas (57 entradas).
- Badges de versión v126 → v127 (título y barra lateral).
## v126 · Lumo: lo comprado se pone al momento + tienda ampliada + música automática

Base: v125. Entrega: `Lumen-v126.zip` · badge visible **v126** en la barra lateral.

### 1 · Tienda de Lumo: lo que compras ya no se «pierde»

- **Al comprar cualquier artículo se aplica AL MOMENTO**: los accesorios se
  equipan al oso (aparecen puestos en su figura), los fondos se aplican como
  fondo de la habitación y los adornos/muebles aparecen en la habitación.
- La tienda avisa: «Lo que compres se pone a Lumo al momento · los adornos
  van a su habitación».
- Los adornos (decor) viven ahora en la **habitación** (se añaden/quitan al
  comprarlos o al usar Poner/Quitar), y en la tienda su botón ya refleja su
  estado real.
- Nuevos slots de equipamiento: **lazo**, **corona** y **flor** (además de
  gafas, gorro, bufanda, mochila y capa), con posiciones distintas para que
  varios accesorios aparezcan a la vez.

### 2 · Muebles y accesorios nuevos en la tienda (15 artículos)

- Accesorios: Gafas luna 🌙, Sombrero de paja 👒, Sombrero de mago 🎩,
  Bufanda de bolas 📿, Mochila música 🎸, Capa de nube ☁️, Lazo rosa 🎀,
  Corona de estrella ⭐, Tulipán 🌷.
- Fondos: Playa 🏖️, Noche estrellada 🌌, Espacio 🚀.
- Muebles/adornos: Guitarra 🎸, Oso de peluche 🧸, Acuario 🐠.
- La habitación también recibe nuevos muebles al avanzar: guitarra, peluche,
  acuario, piano 🎹, coche 🚗 y radio 📻 (14 niveles en total).

### 3 · Ajustes generales: música al abrir la app

- Nueva fila **«Música al abrir la app»** (junto a «Sonido ambiente»): si
  está activada, al abrir Lumen suena la escena de música elegida con el
  volumen ajustado (solo si el sonido ambiente está activo).
- Si el navegador bloquea el auto-reproducción, la música arranca con el
  primer toque/pulsa tecla (una sola vez, sin toques extra).

### 4 · Ajustes de lectura: «Iniciar con música» por libro

- Nueva sección **🎵 Música** en los ajustes de cada libro, con el
  interruptor **«Iniciar con música»**: si está activado, al abrir ese libro
  suena la música elegida. **Por defecto: No.**
- Se guarda por libro (no afecta al resto).

### Verificación

- `node --check` OK sobre el bundle parcheado.
- JS `index-DOrzQ79O.js` md5 `008812891b410942ee0abb74c05adeb3`
- CSS `index-DQUWFWNX.css` md5 `0d8e727f698e66160fbe2d0609d35799` (sin cambios)
- `sw.js`: hashes sin cambios (mismos nombres de asset), 57 entradas.
- Badges de versión v125 → v126 (título y barra lateral).
