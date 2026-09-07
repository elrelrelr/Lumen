import { o as __toESM } from "./rolldown-runtime-D1cXj70v.js";
import { t as require_jszip_min } from "./epub-B8oVrWvJ.js";
//#region src/lib/lumenbook.js
var import_jszip_min = /* @__PURE__ */ __toESM(require_jszip_min(), 1);
var RE_CAPITULO = /^\s*(?:cap[ií]tulo|parte|secci[oó]n|chapter|pro[oó]logo|ep[ií]logo|pr[oó]logo)\b[^\n]*$/im;
/** Divide un texto largo en capítulos respetando marcadores si existen. */
function dividirEnCapitulos(texto, tamMax = 2200) {
	const t = String(texto || "").replace(/\r\n/g, "\n").trim();
	if (!t) return [];
	const lineas = t.split("\n");
	const marcas = [];
	lineas.forEach((l, i) => {
		if (RE_CAPITULO.test(l)) marcas.push(i);
	});
	if (marcas.length >= 2) {
		const caps = [];
		for (let i = 0; i < marcas.length; i++) {
			const desde = marcas[i];
			const hasta = i + 1 < marcas.length ? marcas[i + 1] : lineas.length;
			const cuerpo = lineas.slice(desde, hasta).join("\n").trim();
			if (cuerpo) caps.push(cuerpo);
		}
		if (caps.length >= 2) return caps;
	}
	const parrafos = t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
	const caps = [];
	let actual = "";
	for (const p of parrafos) if (actual && actual.length + p.length > tamMax) {
		caps.push(actual.trim());
		actual = p;
	} else actual += (actual ? "\n\n" : "") + p;
	if (actual) caps.push(actual.trim());
	if (caps.length <= 1 && t.length > tamMax) {
		caps.length = 0;
		let restante = t;
		while (restante.length > 0) {
			let corte = restante.slice(0, tamMax);
			const nl = corte.lastIndexOf("\n");
			if (nl > tamMax * .6) corte = corte.slice(0, nl);
			caps.push(corte.trim());
			restante = restante.slice(corte.length);
		}
	}
	return caps;
}
function escapar(t) {
	return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapaTexto(t) {
	return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function normalizarXhtml(t) {
	let s = String(t ?? "");
	s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
	const INLINE = /^(b|i|em|strong|u|sub|sup|mark|code|span|a)$/i;
	const BLOQUE = /^(p|div|li|h[1-6]|blockquote|section|tr|td|table|br)$/i;
	const out = [];
	const re = /(<[^>]+>)/g;
	let m, last = 0;
	const pushTexto = (txt) => {
		txt = txt.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n");
		if (txt) out.push(escapaTexto(txt));
	};
	while (m = re.exec(s)) {
		pushTexto(s.slice(last, m.index));
		const tag = m[1];
		const inner = tag.slice(1, -1).trim();
		const esCierre = inner.startsWith("/");
		const name = inner.replace(/^\/?/, "").split(/[\s>/]/)[0];
		if (INLINE.test(name)) out.push(esCierre ? "</" + name.toLowerCase() + ">" : "<" + name.toLowerCase() + ">");
		else if (BLOQUE.test(name)) out.push("\n");
		else out.push("");
		last = m.index + tag.length;
	}
	pushTexto(s.slice(last));
	let html = out.join("");
	html = html.replace(/\n{3,}/g, "\n\n");
	return html.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => "<p>" + p.replace(/\n/g, "<br/>") + "</p>").join("\n");
}
function parrafoXhtml(texto) {
	return normalizarXhtml(texto) || "<p></p>";
}
function capituloXhtml(titulo, texto) {
	return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel="stylesheet" href="style.css"/>
</head>
<body>
${titulo ? `<h2 class="lumen-titulo">${escapar(titulo)}</h2>\n` : ""}${parrafoXhtml(texto)}
</body>
</html>`;
}
var CSS_LUMEN = `body { font-family: -apple-system, 'Segoe UI', Roboto, Georgia, serif;
  line-height: 1.75; color: #ecebf3; background: transparent; margin: 0; padding: 0; }
.lumen-titulo { color: #7c5cff; font-size: 1.35em; margin: 0 0 18px; }
p { margin: 0 0 16px; }
`;
function portadaSvg(titulo, autor = "") {
	let h = 0;
	const s = String(titulo || "L");
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
	const iniciales = s.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "L";
	const h2 = (h + 45) % 360;
	const esc = (t) => t.replace(/[<>&"']/g, (m) => ({
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;",
		"\"": "&quot;",
		"'": "&#39;"
	})[m]);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${h} 60% 44%)"/>
<stop offset="1" stop-color="hsl(${h2} 56% 24%)"/>
</linearGradient></defs>
<rect width="600" height="900" fill="url(#g)"/>
<text x="300" y="420" font-family="Georgia, serif" font-size="150" font-weight="bold"
  fill="rgba(255,255,255,0.92)" text-anchor="middle">${esc(iniciales)}</text>
<text x="300" y="560" font-family="Georgia, serif" font-size="34"
  fill="rgba(255,255,255,0.8)" text-anchor="middle">${esc(titulo.slice(0, 32))}</text>
${autor ? `<text x="300" y="620" font-family="sans-serif" font-size="22" fill="rgba(255,255,255,0.6)" text-anchor="middle">${esc(autor.slice(0, 32))}</text>` : ""}
</svg>`;
}
/** Extrae el texto plano de un capítulo XHTML (para búsquedas/resumen). */
function textoDeCapitulo(html) {
	const div = typeof document !== "undefined" ? document.createElement("div") : null;
	if (!div) return "";
	div.innerHTML = html || "";
	return (div.textContent || "").replace(/\s+/g, " ").trim();
}
/** Construye un .lumen de tipo "text" (capítulos XHTML). */
async function construirLumen(meta, capitulos, portada = null) {
	return _construir("text", meta, capitulos, null, portada);
}
/** Construye un .lumen de texto con las personalizaciones por libro del usuario (personal.json). */
async function construirLumenPersonal(meta, capitulos, portada, personal) {
	return _construir("text", meta, capitulos, null, portada, personal ? { "personal.json": JSON.stringify(personal) } : null);
}
/** Construye un .lumen paginado que embebe el original (PDF o ZIP/CBZ de imágenes) y las personalizaciones por libro. */
async function construirLumenConOriginal(meta, blobOriginal, nombreOriginal, personal) {
	const zip = new import_jszip_min.default();
	const titulo = meta.titulo || "Libro sin título";
	const u8 = new Uint8Array(await blobOriginal.arrayBuffer());
	zip.file(nombreOriginal, u8);
	zip.file("manifest.json", JSON.stringify({
		format: "lumen",
		version: 2,
		type: "paged",
		title: titulo,
		total_pages: Number(meta.paginas) || 0,
		cover: null,
		created_at: Math.floor(Date.now() / 1e3)
	}, null, 2));
	zip.file("metadata.json", JSON.stringify({
		title: titulo,
		author: meta.autor || "",
		category: meta.categoria || "",
		language: meta.idioma || "es",
		description: meta.descripcion || ""
	}, null, 2));
	if (personal) zip.file("personal.json", JSON.stringify(personal));
	const esComprimido = /\.(zip|cbz)$/i.test(nombreOriginal);
	return {
		blob: await zip.generateAsync({
			type: "blob",
			compression: esComprimido ? "STORE" : "DEFLATE",
			compressionOptions: { level: 6 }
		}),
		nombre: `${(titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro"}.lumen`
	};
}
async function _construir(tipo, meta, capitulos, paginas, portada, extraArchivos) {
	const zip = new import_jszip_min.default();
	const titulo = meta.titulo || "Libro sin título";
	String(tipo === "paged" ? paginas?.length || 0 : capitulos?.length || 0).padStart(4, "0");
	const manifest = {
		format: "lumen",
		version: 2,
		type: tipo,
		title: titulo,
		total_pages: Number(meta.paginas) || (tipo === "paged" ? paginas.length : capitulos.length),
		cover: null,
		created_at: Math.floor(Date.now() / 1e3)
	};
	const metadata = {
		title: titulo,
		author: meta.autor || "",
		category: meta.categoria || "",
		language: meta.idioma || "es",
		description: meta.descripcion || "",
		ad: meta.ad || null,
		donation: meta.donacion || "",
		zap: meta.zap || ""
	};
	if (tipo === "paged") {
		const orden = (paginas || []).map((_, i) => `pages/${String(i + 1).padStart(4, "0")}.webp`);
		manifest.reading_order = orden;
		manifest.page_order = orden;
		manifest.cover = manifest.cover || orden[0] || null;
		const addImagen = (dataUrl, ruta) => {
			const b64 = String(dataUrl).split(",")[1] || "";
			const bin = atob(b64);
			const u8 = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
			zip.file(ruta, u8);
		};
		paginas.forEach((pg, i) => {
			const ruta = `pages/${String(i + 1).padStart(4, "0")}.webp`;
			if (pg.dataUrl) addImagen(pg.dataUrl, ruta);
			if (pg.texto) zip.file(`pages/${String(i + 1).padStart(4, "0")}.xhtml`, textoPaginaXhtml(pg.texto));
		});
	} else {
		const orden = (capitulos || []).map((_, i) => `chapters/chapter-${String(i + 1).padStart(3, "0")}.xhtml`);
		manifest.reading_order = orden;
		manifest.cover = manifest.cover || null;
		(capitulos || []).forEach((c, i) => {
			zip.file(orden[i], capituloXhtml(`Capítulo ${i + 1}`, c));
		});
	}
	zip.file("manifest.json", JSON.stringify(manifest, null, 2));
	zip.file("metadata.json", JSON.stringify(metadata, null, 2));
	zip.file("style.css", CSS_LUMEN);
	if (portada && String(portada).startsWith("data:image")) {
		if (!String(portada).includes("svg")) {
			const b64 = String(portada).split(",")[1] || "";
			const bin = atob(b64);
			const u8 = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
			zip.file("cover.jpg", u8);
			manifest.cover = "cover.jpg";
		} else {
			zip.file("cover.svg", portada);
			manifest.cover = "cover.svg";
		}
		zip.file("manifest.json", JSON.stringify(manifest, null, 2));
	} else {
		zip.file("cover.svg", portadaSvg(titulo, meta.autor));
		manifest.cover = "cover.svg";
		zip.file("manifest.json", JSON.stringify(manifest, null, 2));
	}
	for (const [nombre, contenido] of Object.entries(extraArchivos || {})) zip.file(nombre, contenido);
	return {
		blob: await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 6 }
		}),
		nombre: `${(titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro"}.lumen`
	};
}
function textoPaginaXhtml(texto) {
	return `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"/></head><body>${normalizarXhtml(texto) || "<p></p>"}</body></html>`;
}
/**
* Abre un .lumen (Uint8Array/ArrayBuffer/Blob) y devuelve su estructura.
* @returns {Promise<{ok, manifest, metadata, tipo, capitulos, paginas, errores, cover}>}
*   · tipo   = 'text' | 'paged' | 'unknown'
*   · capitulos = [{nombre, html}]  (libro de texto)
*   · paginas   = [{ruta, nombre, blob, texto}]  (libro paginado; blob es la
*                 imagen decodificada, texto la capa OCR opcional)
*   · cover  = dataURL de la portada (si se pudo extraer)
*   · errores = lista de advertencias (no fatales)
*/
async function parsearLumen(bytes) {
	const res = {
		ok: false,
		manifest: null,
		metadata: null,
		tipo: "unknown",
		capitulos: [],
		paginas: [],
		errores: [],
		cover: null,
		personal: null,
		originalName: null
	};
	try {
		const zip = await import_jszip_min.default.loadAsync(bytes);
		const leer = async (nombre) => {
			const f = zip.file(nombre);
			return f ? f.async("string") : null;
		};
		const manifestRaw = await leer("manifest.json");
		const metadataRaw = await leer("metadata.json");
		if (!manifestRaw) {
			res.errores.push("Falta manifest.json");
			return res;
		}
		const manifest = JSON.parse(manifestRaw);
		const metadata = metadataRaw ? JSON.parse(metadataRaw) : {};
		const personalRaw = await leer("personal.json");
		if (personalRaw) {
			try { res.personal = JSON.parse(personalRaw); } catch { res.errores.push("personal.json: JSON no válido"); }
		}
		res.manifest = manifest;
		res.metadata = metadata;
		let tipo = manifest.type;
		if (!tipo || tipo === "unknown") {
			const tienePages = Object.keys(zip.files).some((n) => /^pages\/\d+\.(webp|png|jpg)$/i.test(n));
			const tieneChapters = Object.keys(zip.files).some((n) => /chapter-\d+\.xhtml$/.test(n) || /chapters\/.*\.xhtml$/.test(n));
			tipo = tienePages ? "paged" : tieneChapters ? "text" : "unknown";
		}
		res.tipo = tipo;
		res.originalName = Object.keys(zip.files).find((n) => /^original\.(pdf|zip|cbz)$/i.test(n)) || (tipo === "paged" ? Object.keys(zip.files).find((n) => /\.pdf$/i.test(n) && !n.startsWith("pages/")) : null) || null;
		try {
			const coverFile = manifest.cover || tipo === "paged" && manifest.page_order?.[0];
			if (coverFile && zip.file(coverFile)) res.cover = await blobToDataUrl(await zip.file(coverFile).async("blob"));
			else if (zip.file("cover.svg")) {
				const svg = await zip.file("cover.svg").async("string");
				res.cover = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
			}
		} catch (e) {
			res.errores.push("portada: " + (e?.message || e));
		}
		if (tipo === "text") {
			const orden = Array.isArray(manifest.reading_order) && manifest.reading_order.length ? manifest.reading_order : Object.keys(zip.files).filter((n) => /chapter-\d+\.xhtml$/.test(n) || /chapters\/.*\.xhtml$/.test(n)).sort();
			for (const nombre of orden) {
				const html = await leer(nombre);
				if (html != null) res.capitulos.push({
					nombre,
					html
				});
			}
			if (!res.capitulos.length) res.errores.push("No se encontraron capítulos legibles");
		} else if (tipo === "paged") {
			const orden = Array.isArray(manifest.page_order) && manifest.page_order.length ? manifest.page_order : Object.keys(zip.files).filter((n) => /^pages\/\d+\.(webp|png|jpg)$/i.test(n)).sort();
			for (const ruta of orden) {
				const f = zip.file(ruta);
				if (!f) continue;
				const blob = await f.async("blob");
				const nombre = String(ruta).split("/").pop();
				const base = String(ruta).replace(/\.[a-z]+$/i, "");
				const textoF = zip.file(base + ".xhtml");
				const texto = textoF ? await textoF.async("string") : "";
				res.paginas.push({
					ruta,
					nombre,
					blob,
					texto
				});
			}
			if (!res.paginas.length) res.errores.push("No se encontraron páginas");
		} else res.errores.push("No se pudo determinar el tipo de libro");
		res.ok = res.capitulos.length > 0 || res.paginas.length > 0 || !!res.originalName;
		return res;
	} catch (e) {
		res.errores.push(String(e?.message || e));
		return res;
	}
}
/** Compatibilidad: leerLumen devuelve { manifest, metadata, capitulos, paginas }. */
async function leerLumen(bytes) {
	const r = await parsearLumen(bytes);
	return {
		manifest: r.manifest || { reading_order: [] },
		metadata: r.metadata || {},
		capitulos: r.capitulos,
		paginas: r.paginas,
		tipo: r.tipo,
		originalName: r.originalName || null,
		personal: r.personal || null,
		errores: r.errores
	};
}
function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const fr = new FileReader();
		fr.onload = () => resolve(fr.result);
		fr.onerror = reject;
		fr.readAsDataURL(blob);
	});
}
//#endregion
export { construirLumen, construirLumenConOriginal, construirLumenPersonal, dividirEnCapitulos, leerLumen, parsearLumen, portadaSvg, textoDeCapitulo };
