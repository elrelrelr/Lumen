import { t as require_react } from "./react-1WJTggxS.js";
import { A as importarDesdeUrl, B as paginate, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DX181kQz.js";
import { E as putPages, h as getMeta, k as uid, O as setMeta, r as allBooks, w as putBook } from "./db-Ii3ipPL7.js";
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
//#region src/pages/libros-gratis.js
const GUTENDEX = "https://gutendex.com";
const OL = "https://openlibrary.org";
const IA = "https://archive.org";
const META_CAT = "librosGratis_catalogo";
const META_GARD = "librosGratis_guardados"; // v180: guardados por categoría (tema)
const FUENTES = ["gutendex", "openlibrary", "archive", "wikisource-es", "wikisource-en"];
/* v208: nombres para la UI de Filtros y para el estado «Buscando: …» */
const BIB_INFO = { gutendex: "Gutenberg", openlibrary: "Open Library", archive: "Archive.org", "wikisource-es": "Wikisource (es)", "wikisource-en": "Wikisource (en)" };
const tonoDe = (s) => { let h = 0; for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 360; return h; };
const inicialesDe = (s) => String(s || "").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "L";
/** v145 (v199: 5 bibliotecas): libros gratis (dominio público y obras abiertas):
*  1) Project Gutenberg (vía Gutendex), 2) Open Library, 3) Archive.org,
*  4) Wikisource español, 5) Wikisource inglés.
*  Sin cuentas, sin IA: solo metadatos abiertos + descarga directa.
*  Cada biblioteca carga por su cuenta: la primera aparece rápido y las
*  demás se añaden en segundo plano mientras el usuario navega. */
const TEMAS = [
	{
		id: "all",
		label: "Todos"
	},
	{
		id: "Category: Novels",
		label: "Novela"
	},
	{
		id: "Category: Romance",
		label: "Romance"
	},
	{
		id: "Category: Crime, Thrillers and Mystery",
		label: "Misterio"
	},
	{
		id: "Category: Poetry",
		label: "Poesía"
	},
	{
		id: "Category: Short Stories",
		label: "Cuentos"
	},
	{
		id: "Category: Plays/Films/Dramas",
		label: "Teatro"
	},
	{
		id: "Category: Adventure",
		label: "Aventura"
	},
	{
		id: "Category: History",
		label: "Historia"
	},
	{
		id: "Category: Science",
		label: "Ciencia"
	},
	{
		id: "Category: Fantasy",
		label: "Fantasía"
	},
	{
		id: "Category: Juvenile",
		label: "Infantil"
	},
	{
		id: "Category: Classics of Literature",
		label: "Clásicos"
	}
];
function normalizar(r) {
	const fmt = r.formats || {};
	return {
		id: r.id,
		fuente: "gutendex",
		title: r.title || "Sin título",
		authors: (r.authors || []).map((a) => a.name).filter(Boolean),
		bookshelves: r.bookshelves || [],
		downloads: r.download_count || 0,
		epub: fmt["application/epub+zip"] || null,
		txt: fmt["text/plain; charset=utf-8"] || null,
		cover: fmt["image/jpeg"] || null
	};
}
/** Open Library: obra (work) → libro normalizado. La descarga se resuelve
*  al momento contra Archive.org (identificador `ia`). */
function normalizarOL(d) {
	const ia = Array.isArray(d.ia) && d.ia.length ? String(d.ia[0]) : null;
	return {
		id: "ol" + String(d.key || d.title || Math.random()).replace("/works/", "").replace(/[^a-zA-Z0-9_-]/g, ""),
		fuente: "openlibrary",
		title: d.title || "Sin título",
		authors: d.author_name || [],
		bookshelves: (d.subject || []).slice(0, 4),
		downloads: d.edition_count || 0,
		epub: null,
		txt: null,
		ia,
		url: d.key ? `${OL}${d.key}` : null,
		cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : ia ? `${IA}/services/img/${ia}` : null
	};
}
/** Archive.org: item de texto en español con EPUB (≤1923, dominio público). */
function normalizarIA(d) {
	return {
		id: "ia" + String(d.identifier || "").replace(/[^a-zA-Z0-9_-]/g, ""),
		fuente: "archive",
		title: (Array.isArray(d.title) ? d.title[0] : d.title) || "Sin título",
		authors: (Array.isArray(d.creator) ? d.creator : [d.creator]).filter(Boolean),
		bookshelves: [],
		downloads: d.downloads || 0,
		epub: null,
		txt: null,
		ia: String(d.identifier || ""),
		url: d.identifier ? `${IA}/details/${d.identifier}` : null,
		cover: d.identifier ? `${IA}/services/img/${d.identifier}` : null
	};
}
/** v199: Wikisource (es/en): obra del namespace principal. No tiene archivo
*  directo descargable: al tocarla se elige el formato (EPUB/PDF) y el
*  navegador busca el archivo (libro.soloBusqueda). */
function normalizarWS(titulo, fuente) {
	const host = fuente === "wikisource-en" ? "en.wikisource.org" : "es.wikisource.org";
	const pref = fuente === "wikisource-en" ? "Book:" : "Libro:";
	const limpio = String(titulo).replace(/^Libro:/, "").replace(/^Book:/, "").trim();
	return {
		id: (fuente === "wikisource-en" ? "wse" : "wss") + encodeURIComponent(limpio).slice(0, 80),
		fuente,
		title: limpio,
		authors: [],
		bookshelves: [],
		downloads: 0,
		epub: null,
		txt: null,
		ia: null,
		url: `https://${host}/wiki/${encodeURIComponent(pref + limpio)}`,
		cover: null,
		soloBusqueda: true
	};
}
function claveLibro(b) {
	const limpia = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return limpia(b.title).slice(0, 40) + "|" + limpia((b.authors || [])[0]);
}
function nombreBase(libro) {
	const safe = (libro.title || "libro").replace(/[^\w\sáéíóúñü-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase().slice(0, 50) || "libro";
	const pref = libro.fuente === "openlibrary" ? "openlibrary" : libro.fuente === "archive" ? "archive" : libro.fuente && libro.fuente.startsWith("wikisource") ? "wikisource" : "gutenberg";
	const seg = String(libro.id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "libro";
	return `${pref}-${seg}-${safe}`;
}
function nombreArchivo(libro, ext) {
	return nombreBase(libro) + "." + ext;
}
/** Trae una página (32) de la biblioteca pedida. { books, mas, token } */
async function fetchFuente(fuente, pagina, token) {
	if (fuente === "gutendex") {
		const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=32&page=${pagina}`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Gutendex respondió " + r.status);
		const j = await r.json();
		return { books: (j.results || []).map(normalizar), mas: !!j.next, total: j.count || 0 };
	}
	if (fuente === "openlibrary") {
		const r = await fetch(`${OL}/search.json?subject=spanish%20language&limit=32&start=${(pagina - 1) * 32}`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Open Library respondió " + r.status);
		const j = await r.json();
		const docs = j.docs || [];
		return {
			books: docs.map(normalizarOL),
			mas: (j.numFound || 0) > pagina * 32,
			total: j.numFound || 0
		};
	}
	// v199: Wikisource (es/en) — obras del namespace principal, paginación por token
	if (fuente === "wikisource-es" || fuente === "wikisource-en") {
			const host = fuente === "wikisource-en" ? "en" : "es";
		const params = new URLSearchParams({ action: "query", list: "allpages", apnamespace: "0", aplimit: "32", format: "json", origin: "*" });
		if (token) params.set("apcontinue", token);
		const r = await fetch(`https://${host}.wikisource.org/w/api.php?` + params.toString(), { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Wikisource respondió " + r.status);
		const j = await r.json();
		const pages = (j.query || {}).allpages || [];
		return {
			books: pages.map((p) => normalizarWS(p.title, fuente)),
			mas: !!(j.continue && j.continue.allpages),
			total: 0,
			token: j.continue ? j.continue.allpages : null
		};
	}
	// archive.org
	const q = encodeURIComponent('language:spanish AND mediatype:texts AND format:epub AND year:[* TO 1923]');
	const r = await fetch(`${IA}/advancedsearch.php?q=${q}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=32&page=${pagina}&output=json`, { signal: AbortSignal.timeout(45e3) });
	if (!r.ok) throw new Error("Archive.org respondió " + r.status);
	const j = await r.json();
	const resp = j.response || {};
	return {
		books: (resp.docs || []).map(normalizarIA),
		mas: (resp.numFound || 0) > pagina * 32,
		total: resp.numFound || 0
	};
}
/** v150: tamaño de la ventana de libros (botones de 100 en 100). */
const VENTANA = 100;
/** v150 (v199: 5 bibliotecas): busca en las bibliotecas remotas (libros que aún no están
*  cargados en Lumen). Devuelve hasta ~96 resultados normalizados. */
async function buscarRemoto(texto) {
	const q = encodeURIComponent(texto);
	const limpio = String(texto).replace(/[\"]+/g, " ").trim();
	const tareas = [
		(async () => {
			const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=32&search=${q}`, { signal: AbortSignal.timeout(45e3) });
			if (!r.ok) throw new Error("Gutendex respondió " + r.status);
			const j = await r.json();
			return (j.results || []).map(normalizar);
		})(),
		(async () => {
			let r = await fetch(`${OL}/search.json?title=${q}&limit=32`, { signal: AbortSignal.timeout(45e3) });
			if (!r.ok) throw new Error("Open Library respondió " + r.status);
			let j = await r.json();
			let docs = j.docs || [];
			if (!docs.length) {
				const r2 = await fetch(`${OL}/search.json?author=${q}&limit=32`, { signal: AbortSignal.timeout(45e3) });
				if (r2.ok) {
					const j2 = await r2.json();
					docs = j2.docs || [];
				}
			}
			return docs.map(normalizarOL);
		})(),
		(async () => {
			const consulta = `mediatype:texts AND language:spanish AND (title:"${limpio}" OR creator:"${limpio}")`;
			const r = await fetch(`${IA}/advancedsearch.php?q=${encodeURIComponent(consulta)}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=32&output=json`, { signal: AbortSignal.timeout(45e3) });
			if (!r.ok) throw new Error("Archive.org respondió " + r.status);
			const j = await r.json();
			return ((j.response || {}).docs || []).map(normalizarIA);
		})(),
		// v199: Wikisource es + en
		(async () => {
			const r = await fetch(`https://es.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=32&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(45e3) });
			if (!r.ok) throw new Error("Wikisource ES respondió " + r.status);
			const j = await r.json();
			return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, "wikisource-es"));
		})(),
		(async () => {
			const r = await fetch(`https://en.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=32&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(45e3) });
			if (!r.ok) throw new Error("Wikisource EN respondió " + r.status);
			const j = await r.json();
			return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, "wikisource-en"));
		})()
	];
	const res = await Promise.allSettled(tareas);
	return res.filter((x) => x.status === "fulfilled").flatMap((x) => x.value || []);
}
/** v208: búsqueda en UNA sola biblioteca (streaming: cada respuesta aparece
*  en cuanto su biblioteca termina, sin esperar a que carguen las 5). */
async function buscarFuenteUna(id, texto) {
	const q = encodeURIComponent(texto);
	const limpio = String(texto).replace(/["]+/g, " ").trim();
	if (id === "gutendex") {
		const r = await fetch(`${GUTENDEX}/books/?languages=es&limit=32&search=${q}`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Gutendex respondió " + r.status);
		const j = await r.json();
		return (j.results || []).map(normalizar);
	}
	if (id === "openlibrary") {
		let r = await fetch(`${OL}/search.json?title=${q}&limit=32`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Open Library respondió " + r.status);
		let j = await r.json();
		let docs = j.docs || [];
		if (!docs.length) {
			const r2 = await fetch(`${OL}/search.json?author=${q}&limit=32`, { signal: AbortSignal.timeout(45e3) });
			if (r2.ok) {
				const j2 = await r2.json();
				docs = j2.docs || [];
			}
		}
		return docs.map(normalizarOL);
	}
	if (id === "archive") {
		const consulta = `mediatype:texts AND language:spanish AND (title:"${limpio}" OR creator:"${limpio}")`;
		const r = await fetch(`${IA}/advancedsearch.php?q=${encodeURIComponent(consulta)}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=downloads&sort%5B%5D=downloads+desc&rows=32&output=json`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Archive.org respondió " + r.status);
		const j = await r.json();
		return ((j.response || {}).docs || []).map(normalizarIA);
	}
	if (id === "wikisource-es" || id === "wikisource-en") {
		const host = id === "wikisource-en" ? "en" : "es";
		const r = await fetch(`https://${host}.wikisource.org/w/api.php?action=query&list=search&srnamespace=0&srlimit=32&srsearch=${q}&format=json&origin=*`, { signal: AbortSignal.timeout(45e3) });
		if (!r.ok) throw new Error("Wikisource respondió " + r.status);
		const j = await r.json();
		return (((j.query || {}).search) || []).map((x) => normalizarWS(x.title, id));
	}
	return [];
}
/** Resuelve el archivo descargable (epub o txt) de un item de Archive.org. */
async function resolverArchivoIA(ia) {
	const r = await fetch(`${IA}/metadata/${ia}/files`, { signal: AbortSignal.timeout(4e4) });
	if (!r.ok) throw new Error("metadata " + r.status);
	const j = await r.json();
	const files = j.result || [];
	const epub = files.find((f) => /\.epub$/i.test(f.name) && !/uncompressed/i.test(f.name)) || files.find((f) => /\.epub$/i.test(f.name));
	const txt = files.find((f) => /\.txt$/i.test(f.name));
	const f = epub || txt;
	if (!f) return null;
	return {
		url: `${IA}/download/${ia}/${encodeURIComponent(f.name)}`,
		ext: /epub/i.test(f.name) ? "epub" : "txt"
	};
}
/** Estado en caché (v2: catálogo fusionado + estado por biblioteca). */
async function leerMeta() {
	try {
		const c = await getMeta(META_CAT, null);
		if ((c.v === 3 || c.v === 2) && Array.isArray(c.books) && c.books.length) {
			const f = {};
			for (const id of FUENTES) f[id] = c.fuentes && c.fuentes[id] ? c.fuentes[id] : { page: 0, mas: false, ok: false };
			return { books: c.books, fuentes: f, desde: c.desde | 0, totales: c.totales || {} };
		}
	} catch {}
	return null;
}
async function guardarMeta(estado) {
	try {
		await setMeta({
			id: META_CAT,
			v: 3,
			at: Date.now(),
			books: estado.books,
			fuentes: estado.fuentes,
			desde: estado.desde || 0,
			totales: estado.totales || {}
		});
	} catch {}
}
/** Etapas de la biblioteca local → bookshelves de Gutenberg (recomendación sin IA: solo
*  coincidencia de categorías y palabras del título/autor). */
const PALABRAS = {
	"Category: Romance": ["amor", "romance", "amante", "corazón", "enamor", "romantic"],
	"Category: Crime, Thrillers and Mystery": ["crimen", "misterio", "detective", "policí", "asesinat", "intriga", "espion", "mystery", "thriller"],
	"Category: Poetry": ["poes", "verso", "rima", "poema", "ode", "soneto", "poetry"],
	"Category: Short Stories": ["cuento", "relato", "gaviota", "fabla", "short story"],
	"Category: Plays/Films/Dramas": ["teatro", "drama", "comedia", "tragedia", "obra", "play"],
	"Category: Adventure": ["aventura", "aventur", "viaje", "marinero", "explorac", "pirata", "adventure"],
	"Category: History": ["historia", "histórico", "guerra", "siglo", "imperial", "révol", "history"],
	"Category: Science": ["ciencia", "científ", "astronom", "físic", "natural", "insect", "science"],
	"Category: Fantasy": ["fantas", "dragón", "magia", "hechic", "leyenda", "fantasy"],
	"Category: Juvenile": ["infantil", "niños", "niño", "escolar", "juvenil", "children"],
	"Category: Classics of Literature": ["clásic", "don qui", "cien años", "carta", "classic"],
	"Category: Philosophy": ["filosof", "ensayo", "moral", "diario", "memorias", "philosoph"],
	"Category: Travel": ["viajes", "travel", "paisajes"],
	"Category: Religion": ["relig", "santo", "biblia", "evang", "sermón", "relig"]
};
const ETIQUETA = {
	"Category: Novels": "novela",
	"Category: Romance": "romance",
	"Category: Crime, Thrillers and Mystery": "misterio",
	"Category: Poetry": "poes",
	"Category: Short Stories": "cuento",
	"Category: Plays/Films/Dramas": "drama",
	"Category: Adventure": "aventur",
	"Category: History": "histor",
	"Category: Science": "cienc",
	"Category: Fantasy": "fantas",
	"Category: Juvenile": "infantil",
	"Category: Classics of Literature": "clásic"
};
function coincideTema(bookshelf, libro) {
	if (bookshelf === "all") return true;
	const bs = (libro.bookshelves || []).map((x) => String(x).toLowerCase());
	if (bs.some((x) => x === bookshelf || (bookshelf.length >= 8 && x.startsWith(bookshelf)))) return true;
	const et = (ETIQUETA[bookshelf] || "").toLowerCase();
	if (et && bs.some((x) => x.includes(et))) return true;
	return false;
}
/** Recomienda hasta 24 libros gratis parecidos a los de la biblioteca local del usuario.
*  Sin IA: suma puntos por bookshelf en común y por palabra del título. */
function paraTi(catalogo, librosLocales) {
	const perfiles = /* @__PURE__ */ new Set();
	for (const b of librosLocales || []) {
		const texto = ((b.title || "") + " " + (b.categoria || "") + " " + (b.author || "")).toLowerCase();
		for (const [bookshelf, palabras] of Object.entries(PALABRAS)) if (palabras.some((w) => texto.includes(w))) perfiles.add(bookshelf);
	}
	return (catalogo || []).map((libro) => {
		let score = Math.min(2.5, Math.log10((libro.downloads || 0) + 10) * .55);
		const bs = (libro.bookshelves || []).map((x) => String(x).toLowerCase());
		for (const pf of perfiles) if (bs.some((x) => x === pf || x.startsWith(pf) || (ETIQUETA[pf] && x.includes(ETIQUETA[pf].toLowerCase())))) score += 2.2;
		const titulo = (libro.title || "").toLowerCase();
		for (const pf of perfiles) {
			const palabras = PALABRAS[pf] || [];
			if (palabras.some((w) => titulo.includes(w))) {
				score += 1;
				break;
			}
		}
		return {
			libro,
			score
		};
	}).filter((x) => perfiles.size ? x.score >= 1.7 : true).sort((a, b) => b.score - a.score).slice(0, 24).map((x) => x.libro);
}
async function fetchConProgreso(url, onPct, timeoutMs = 4e4) {
	const r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
	if (!r.ok) throw new Error("HTTP " + r.status);
	const total = Number(r.headers.get("content-length")) || 0;
	if (!r.body || typeof r.body.getReader !== "function") {
		const b = await r.blob();
		onPct?.(100);
		return b;
	}
	const reader = r.body.getReader();
	const partes = [];
	let rec = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		partes.push(value);
		rec += value.length;
		if (total) onPct?.(Math.min(99, Math.round(rec / total * 100)));
	}
	onPct?.(100);
	return new Blob(partes);
}
function LibrosGratis({ toast, onSalir, onAbrirLibro, modo, onVentana, onBuscarWeb, busqueda, bibliotecas = null }) {
	const enSeccion = modo === "seccion";
	const [catalogo, setCatalogo] = (0, import_react.useState)(null);
	const [fuentes, setFuentes] = (0, import_react.useState)(null);
	const [cargando, setCargando] = (0, import_react.useState)(true);
	const [navegando, setNavegando] = (0, import_react.useState)(false);
	const [desde, setDesde] = (0, import_react.useState)(0);
	const [totales, setTotales] = (0, import_react.useState)(null);
	const [remoto, setRemoto] = (0, import_react.useState)(null);
	const [buscando, setBuscando] = (0, import_react.useState)(false);
	// v208: qué bibliotecas siguen sin responder (para «Buscando: …»)
	const [busquedaFaltan, setBusquedaFaltan] = (0, import_react.useState)([]);
	const [cargandoFondo, setCargandoFondo] = (0, import_react.useState)(0);
	const [hayMas, setHayMas] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [tema, setTema] = (0, import_react.useState)("all");
	const [recomendados, setRecomendados] = (0, import_react.useState)(null);
	const [misLibros, setMisLibros] = (0, import_react.useState)([]);
	const [descarga, setDescarga] = (0, import_react.useState)(null);
	// v148: menú de opciones de descarga (navegador Lumen / dispositivo)
	const [menuLibro, setMenuLibro] = (0, import_react.useState)(null);
	// v180: guardados en carpetas/categorías (grupos por tema)
	const [guardados, setGuardados] = (0, import_react.useState)([]);
	const [guardTema, setGuardTema] = (0, import_react.useState)("todas");
	const [guardCat, setGuardCat] = (0, import_react.useState)(null);
	const [guardNueva, setGuardNueva] = (0, import_react.useState)("");
	// v148: vigilancia de importación tras descargar en un navegador
	const [vigilando, setVigilando] = (0, import_react.useState)(null);
	// v199: libros de bibliotecas «solo búsqueda» (Wikisource): al tocar se
	// elige el formato (EPUB/PDF) y el navegador busca el archivo.
	const [formatoBusqueda, setFormatoBusqueda] = (0, import_react.useState)(null);
	// v209: descarga directa completada → panel de guardado (carpeta/categoría + dispositivo)
	const [descargaOk, setDescargaOk] = (0, import_react.useState)(null);
	// v199: extraer el texto de una página web desde la barra de búsqueda
	const [urlAbierto, setUrlAbierto] = (0, import_react.useState)(false);
	const [urlWeb, setUrlWeb] = (0, import_react.useState)("");
	const [urlWebBusy, setUrlWebBusy] = (0, import_react.useState)(false);
	const [urlPaso, setUrlPaso] = (0, import_react.useState)("");
	const vigRef = (0, import_react.useRef)(null);
	const catRef = (0, import_react.useRef)(null);
	const misRef = (0, import_react.useRef)([]);
	const vivoRef = (0, import_react.useRef)(true);
	const colaRef = (0, import_react.useRef)(Promise.resolve());
	// v208: bibliotecas activables (prop desde Lumen Store; null = todas activas)
	const bibRef = (0, import_react.useRef)(bibliotecas);
	bibRef.current = bibliotecas;
	// v200: en modo sección la barra de búsqueda vive en la cabecera de la
	// store: la consulta baja por prop y reutiliza el mismo debounce remoto.
	(0, import_react.useEffect)(() => {
		if (busqueda !== undefined) setQ(busqueda);
	}, [busqueda]);
	usarPantallaAtras(() => onSalir?.(), () => false, !enSeccion);
	// Las mutaciones al catálogo pasan por una cola (sin carreras entre las
	// cargas en segundo plano de las 3 bibliotecas).
	const conCierre = (fn) => {
		const p = colaRef.current.then(fn).catch(() => {});
		colaRef.current = p;
		return p;
	};
	/* v208: «hay más» = alguna biblioteca activa con mas (ok o pendiente): así
	la barra no dice «ya no hay más» mientras una biblioteca sigue cargando */
	const hayMasEn = (f) => FUENTES.some((id) => { const b = bibRef.current; return f[id] && f[id].mas && (!b || b[id] !== false); });
	const publicar = () => {
		const e = catRef.current;
		if (!e) return;
		setCatalogo(e.books);
		setFuentes({ ...e.fuentes });
		setHayMas(hayMasEn(e.fuentes));
		setDesde(e.desde || 0);
		setTotales({ ...(e.totales || {}) });
		setRecomendados(paraTi(e.books, misRef.current));
		guardarMeta(e);
	};
	const aplicarFusion = (fuente, res, pagina) => {
		const e = catRef.current;
		if (!e) return;
		const vistos = new Set(e.books.map(claveLibro));
		const nuevos = res.books.filter((b) => {
			const k = claveLibro(b);
			if (vistos.has(k)) return false;
			vistos.add(k);
			return true;
		});
		e.books = [...e.books, ...nuevos];
		e.fuentes[fuente] = { page: pagina, mas: res.mas, ok: true, token: res.token || null };
		if (typeof res.total === "number" && res.total > 0) e.totales = { ...(e.totales || {}), [fuente]: res.total };
		// v150: no dejar crecer la memoria: se conserva solo lo necesario
		if (e.books.length > 1200) {
			const corte = Math.max(e.desde || 0, e.books.length - 1000);
			e.books = e.books.slice(corte);
			e.desde = Math.max(0, (e.desde || 0) - corte);
		}
		publicar();
	};
	const cargarFondo = (fuente) => {
		conCierre(async () => {
			const e = catRef.current;
			if (!e || !vivoRef.current) return;
			if (bibRef.current && bibRef.current[fuente] === false) return; // v208: desactivada
			const f = e.fuentes[fuente];
			if (f.page >= 1) return; // ya cargada
			setCargandoFondo((n) => n + 1);
			try {
				const res = await fetchFuente(fuente, 1);
				if (!vivoRef.current) return;
				aplicarFusion(fuente, res, 1);
			} catch {
				if (!vivoRef.current) return;
				e.fuentes[fuente] = { page: 0, mas: true, ok: false, fallo: true }; // v208: mas:true → reintento en «Siguientes 100»
				publicar();
			} finally {
				if (vivoRef.current) setCargandoFondo((n) => Math.max(0, n - 1));
			}
		});
	};
	(0, import_react.useEffect)(() => {
		vivoRef.current = true;
		(async () => {
			try {
				const lib = await allBooks().catch(() => []);
				if (!vivoRef.current) return;
				misRef.current = lib || [];
				setMisLibros(lib || []);
				const cache = await leerMeta();
				if (cache) {
					catRef.current = cache;
					publicar();
					setCargando(false);
					return;
				}
				// Primera vez: Gutenberg primero (igual que antes) y las otras
				// dos bibliotecas llegan solas en segundo plano.
				const f1 = await fetchFuente("gutendex", 1);
				if (!vivoRef.current) return;
				catRef.current = {
					books: f1.books,
					fuentes: {
						gutendex: { page: 1, mas: f1.mas, ok: true },
						openlibrary: { page: 0, mas: true, ok: false },
						archive: { page: 0, mas: true, ok: false },
						"wikisource-es": { page: 0, mas: true, ok: false },
						"wikisource-en": { page: 0, mas: true, ok: false }
					},
					desde: 0,
					totales: { gutendex: f1.total || 0 }
				};
				publicar();
				setTimeout(() => cargarFondo("openlibrary"), 2e3);
				setTimeout(() => cargarFondo("archive"), 6e3);
				setTimeout(() => cargarFondo("wikisource-es"), 1e4);
				setTimeout(() => cargarFondo("wikisource-en"), 14e3);
			} catch (e) {
				if (vivoRef.current) setError(e?.message || String(e));
			} finally {
				if (vivoRef.current) setCargando(false);
			}
		})();
		return () => {
			vivoRef.current = false;
			if (vigRef.current) clearInterval(vigRef.current);
		};
	}, []);
	const refrescar = async () => {
		try {
			toast?.("Actualizando las bibliotecas…");
			await conCierre(async () => {
				const e = catRef.current;
				const f1 = await fetchFuente("gutendex", 1);
				if (!e) return;
				const resto = e.books.filter((b) => b.fuente !== "gutendex");
				const vistos = new Set(resto.map(claveLibro));
				const g1 = f1.books.filter((b) => {
					const k = claveLibro(b);
					if (vistos.has(k)) return false;
					vistos.add(k);
					return true;
				});
				e.books = [...g1, ...resto];
				e.fuentes = {
					...e.fuentes,
					gutendex: { page: 1, mas: f1.mas, ok: true }
				};
				publicar();
			});
			toast?.(`Catálogo actualizado (${(catRef.current?.books || []).length} libros)`);
		} catch (e) {
			toast?.("No se pudo actualizar (¿sin internet?)");
		}
	};
		const irAnteriores = () => {
		const e = catRef.current;
		if (!e) return;
		e.desde = Math.max(0, (e.desde || 0) - VENTANA);
		publicar();
	};
	/** v150: avanza 100 libros: primero la ventana local; al final, trae
	*  la siguiente página de las bibliotecas que aún tengan más. */
	const irSiguientes = async () => {
		if (navegando) return;
		const e = catRef.current;
		if (!e) return;
		const fin = (e.desde || 0) + VENTANA;
		if (fin < e.books.length) {
			e.desde = fin;
			publicar();
			return;
		}
		// v208: «hay más» = fuentes ok con más, O pendientes (todavía no
		// cargadas / fallidas reintentables) entre las activadas. Antes, si
		// las bibliotecas en segundo plano no habían terminado, la barra
		// decía «ya no hay más libros» a destiempo.
		const onBib = (id) => {
			const b = bibRef.current;
			return !b || b[id] !== false;
		};
		const conMas = FUENTES.filter((id) => e.fuentes[id] && e.fuentes[id].ok && e.fuentes[id].mas && onBib(id));
		const pendientes = FUENTES.filter((id) => {
			const f = e.fuentes[id];
			return f && !f.ok && f.mas !== false && onBib(id);
		});
		if (!conMas.length && !pendientes.length) {
			toast?.("Ya no hay más libros en las bibliotecas");
			return;
		}
		setNavegando(true);
		try {
			await conCierre(async () => {
				const est = catRef.current;
				if (!est) return;
				const antes = est.books.length;
				// v208: pendientes y páginas nuevas en PARALELO — una
				// biblioteca pendiente lenta no bloquea las que ya responden
				const fases = [];
				if (pendientes.length) fases.push((async () => {
					const res = await Promise.all(pendientes.map((id) => fetchFuente(id, 1, est.fuentes[id] && est.fuentes[id].token).catch(() => null)));
					res.forEach((r, i) => {
						const id = pendientes[i];
						if (!r) {
							est.fuentes[id] = { page: 0, mas: true, ok: false, fallo: true };
							return;
						}
						aplicarFusion(id, r, 1);
					});
				})());
				if (conMas.length) fases.push((async () => {
					const res = await Promise.all(conMas.map((id) => fetchFuente(id, est.fuentes[id].page + 1, est.fuentes[id].token).catch(() => null)));
					res.forEach((r, i) => {
						const id = conMas[i];
						if (!r) {
							est.fuentes[id] = { ...est.fuentes[id], mas: false };
							return;
						}
						aplicarFusion(id, r, est.fuentes[id].page + 1);
					});
				})());
				await Promise.all(fases);
				if (est.books.length > antes) est.desde = Math.max(0, est.books.length - VENTANA);
			});
		} catch {
			toast?.("No se pudo cargar la siguiente centena (¿sin internet?)");
		} finally {
			setNavegando(false);
		}
	};
	// v150: busca en las 3 bibliotecas mientras el usuario escribe (debounce)
	// v150 (v208: streaming): busca en las bibliotecas activas mientras el
	// usuario escribe (debounce). CADA biblioteca responde por su cuenta:
	// los resultados aparecen en cuanto carga el primer catálogo, sin
	// esperar a que terminen los cinco, y de todas las que tengan el título.
	(0, import_react.useEffect)(() => {
		const t2 = q.trim();
		if (t2.length < 2) {
			setRemoto(null);
			setBuscando(false);
			setBusquedaFaltan([]);
			return;
		}
		setBuscando(true);
		setRemoto([]);
		let vivo = true;
		const activas = FUENTES.filter((id) => {
			const b = bibliotecas;
			return !b || b[id] !== false;
		});
		setBusquedaFaltan(activas.map((id) => BIB_INFO[id]));
		const t = setTimeout(() => {
			const faltan = new Set(activas);
			const mergeRes = (res) => {
				if (!vivo || !res || !res.length) return;
				setRemoto((prev) => {
					const base = prev || [];
					const vistos = new Set(base.map(claveLibro));
					const nuevos = res.filter((b) => {
						const k = claveLibro(b);
						if (vistos.has(k)) return false;
						vistos.add(k);
						return true;
					});
					return [...base, ...nuevos];
				});
			};
			Promise.all(activas.map(async (id) => {
				try {
					const res = await buscarFuenteUna(id, t2);
					mergeRes(res);
				} catch {}
				finally {
					faltan.delete(id);
					if (vivo) setBusquedaFaltan([...faltan].map((x) => BIB_INFO[x]));
					if (!faltan.size && vivo) setBuscando(false);
				}
			}));
		}, 400);
		return () => {
			vivo = false;
			clearTimeout(t);
		};
	}, [q, bibliotecas]);
	// v208: al reactivar una biblioteca, si aún no está cargada se carga
	// sola → el catálogo se actualiza al momento
	(0, import_react.useEffect)(() => {
		if (!bibliotecas) return;
		for (const id of FUENTES) {
			if (bibliotecas[id] === false) continue;
			const f = catRef.current && catRef.current.fuentes[id];
			if (f && !f.ok && f.mas !== false) cargarFondo(id);
		}
		// v208: [bibliotecas, catalogo] — el catálogo puede llegar (cache de
		// IndexedDB) DESPUÉS de la prop: sin esta dep, las fuentes pendientes
		// nunca se cargarían (cargarFondo es idempotente: salta si page>=1)
	}, [bibliotecas, catalogo]);
	const enMiBib = (libro) => {
		const base = nombreBase(libro);
		return (misLibros || []).find((b) => typeof b.fileName === "string" && b.fileName.startsWith(base + "."));
	};
	// v148: página del libro para abrir en un navegador
	const urlLibroDe = (libro) => libro.url || (libro.fuente !== "openlibrary" && libro.fuente !== "archive" ? "https://www.gutenberg.org/ebooks/" + libro.id : null);
	// v168: ¿existe el navegador integrado (puente de la app Android)? En la
	// PWA/PC no hay, así que el flujo usa el navegador del dispositivo.
	const navDisponible = () => typeof window !== "undefined" && !!(window.AndroidNav && typeof window.AndroidNav.abrir === "function");
	// v199: el navegador busca el libro en el formato elegido (EPUB o PDF)
	const buscarEnNavegador = (libro, fmt) => {
		const autor = (libro.authors || [])[0] || "";
		const q = '"' + (libro.title || "").trim() + '"' + (autor ? ' "' + autor.trim() + '"' : "") + " filetype:" + fmt;
		setFormatoBusqueda(null);
		try {
			window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank", "noopener");
		} catch {}
		toast?.("🔎 Buscando «" + (libro.title || "").slice(0, 40) + "» en formato " + fmt.toUpperCase() + "…");
		// v209: Lumen se queda OYENDO la descarga (auto-detección); si no la
		// detecta, el usuario lo lleva a mano con «Elegir archivo»
		vigilarLibro(libro);
	};
	// v199: extrae el texto de una página web y lo importa como libro
	const importarPagina = async () => {
		const u = urlWeb.trim();
		if (!u || urlWebBusy) return;
		setUrlWebBusy(true);
		setUrlPaso("Conectando…");
		try {
			const { titulo, texto } = await importarDesdeUrl(u, (pct, txt) => setUrlPaso(txt || pct + "%"));
			const paginas = paginate(texto);
			const id = uid();
			const now = Date.now();
			await putBook({
				id,
				title: titulo,
				fileName: titulo + ".txt",
				kind: "web",
				sourceUrl: u,
				size: texto.length,
				pageCount: paginas.length,
				lastPage: 0,
				addedAt: now,
				openedAt: now,
				status: "ready",
				hasOriginal: false,
				ocrPages: [],
				needsOcrPages: [],
				percentRead: 0,
				own: true
			});
			await putPages(paginas.map((t, i) => ({
				bookId: id,
				index: i,
				text: t,
				needsOcr: false,
				ocrDone: false,
				source: "web"
			})));
			setUrlWeb("");
			setUrlAbierto(false);
			toast?.("✓ «" + titulo.slice(0, 28) + "» importado desde la web");
			onAbrirLibro?.(id);
		} catch (e) {
			toast?.(e?.message || "No se pudo importar esa página");
		} finally {
			setUrlWebBusy(false);
			setUrlPaso("");
		}
	};

	// v148: vigila la biblioteca: apenas aparezca el libro importado (por
	// descarga en el navegador), lo detecta y lo abre solo.
	// v209: guardar el archivo en una carpeta local del dispositivo
	const guardarEnDispositivo = async (file, nombre) => {
		try {
			if (window.showSaveFilePicker) {
				const handle = await window.showSaveFilePicker({ suggestedName: nombre });
				const wr = await handle.createWritable();
				await wr.write(file);
				await wr.close();
				toast?.("📥 Guardado en la carpeta que elegiste");
				return;
			}
		} catch (e2) {
			if (e2?.name === "AbortError") return;
		}
		try {
			const url = URL.createObjectURL(file);
			const a = document.createElement("a");
			a.href = url;
			a.download = nombre;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 4000);
			toast?.("📥 Descargado a tu dispositivo (carpeta «Descargas»)");
		} catch {
			toast?.("No se pudo guardar en el dispositivo");
		}
	};
	const vigilarLibro = (libro) => {
		const base = nombreBase(libro);
		const titulo = (libro.title || "").trim().toLowerCase();
		if (vigRef.current) clearInterval(vigRef.current);
		const t0 = Date.now();
		setVigilando({ clave: String(libro.id), titulo: libro.title || "" });
		const id = setInterval(async () => {
			if (!vivoRef.current) { clearInterval(id); return; }
			if (Date.now() - t0 > 5 * 60e3) {
				clearInterval(id);
				vigRef.current = null;
				setVigilando(null);
				toast?.("Sigo sin detectar la descarga; si ya la tienes, pulsa «Elegir archivo»");
				return;
			}
			try {
				const libros = await allBooks();
				const nuevo = libros.find((x) => (typeof x.fileName === "string" && x.fileName.startsWith(base + ".")) || (titulo.length > 6 && x.title && x.title.trim().toLowerCase() === titulo));
				if (nuevo && nuevo.status === "ready") {
					clearInterval(id);
					vigRef.current = null;
					misRef.current = libros;
					setMisLibros(libros);
					setVigilando(null);
					toast?.("✓ «" + (libro.title || "Libro") + "» detectado: importado y abriéndolo");
					onAbrirLibro?.(nuevo.id);
				}
			} catch {}
		}, 2500);
		vigRef.current = id;
	};
	const importarManual = async (f) => {
		if (typeof window.__lumenImportarArchivos !== "function") return toast?.("La biblioteca aún no está lista; espera unos segundos");
		try {
			await window.__lumenImportarArchivos([f]);
			toast?.("Importando «" + (f.name || "archivo") + "»…");
		} catch (e) {
			toast?.("No se pudo importar (" + (e?.message || e) + ")");
		}
	};
	// v148: abrir la página del libro en el navegador elegido y vigilar la importación
	const abrirConNavegador = (libro, modo) => {
		// v168: si el libro tiene archivo directo (EPUB/TXT), se abre ESE enlace
		// en el navegador (que lo descarga sin problemas de CORS); si no, la
		// página del libro. Antes se usaba fetch directo, que fallaba en la mayoría.
		const u = libro.epub || libro.txt || urlLibroDe(libro);
		if (!u) return toast?.("Este libro no tiene archivo ni página para abrir");
		const tituloNav = "Libros gratis · " + (libro.title || "");
		let abierto = false;
		if (modo === "lumen") {
			try {
				const nat = typeof window !== "undefined" ? window.AndroidNav : null;
				if (nat && typeof nat.abrir === "function") {
					nat.abrir(u, tituloNav);
					abierto = true;
				}
			} catch {}
		}
		if (!abierto) {
			try {
				window.open(u, "_blank", "noopener");
				abierto = true;
			} catch {}
		}
		if (!abierto) return toast?.("No se pudo abrir el navegador");
		toast?.(modo === "lumen" ? "🌐 Descarga el EPUB en el navegador de Lumen: apenas lo detecte, lo importará y lo abrirá solo." : "📲 Descarga el EPUB y luego pulsa «Elegir archivo» (o Lumen lo detectará solo).");
		vigilarLibro(libro);
	};
	const leerGratis = async (libro) => {
		if (descarga) return;
		const ya = enMiBib(libro);
		if (ya && ya.status === "ready") {
			onAbrirLibro?.(ya.id);
			return;
		}
		const base = nombreBase(libro);
		const titulo = libro.title || "";
		let url = libro.epub || null;
		let ext = url ? "epub" : "txt";
		if (!url) url = libro.txt || null;
		if (!url && !libro.ia) return toast?.("Este libro no tiene archivo para descargar");
		setDescarga({
			clave: String(libro.id),
			nombre: titulo,
			pct: 0
		});
		try {
			if (!url) {
				const r = await resolverArchivoIA(libro.ia);
				if (!r) throw new Error("sin archivo EPUB/TXT disponible");
				url = r.url;
				ext = r.ext;
				setDescarga({
					clave: String(libro.id),
					nombre: titulo,
					pct: 0
				});
			}
			const blob = await fetchConProgreso(url, (pct) => setDescarga({
				clave: String(libro.id),
				nombre: titulo,
				pct
			}));
			const nombre = base + "." + ext;
			const file = new File([blob], nombre, {
				type: ext === "epub" ? "application/epub+zip" : "text/plain"
			});
			if (typeof window.__lumenImportarArchivos !== "function") throw new Error("La biblioteca aún no está lista para importar; espera unos segundos e inténtalo de nuevo");
			await window.__lumenImportarArchivos([file]);
			let nuevo = null;
			for (let i = 0; i < 30 && !nuevo; i++) {
				await new Promise((res) => setTimeout(res, 500));
				const libros = await allBooks();
				const b = libros.find((x) => x.fileName === nombre);
				if (b && b.status === "ready") nuevo = b;
			}
			if (!nuevo) throw new Error("El archivo se descargó pero no terminó de importarse");
			misRef.current = await allBooks().catch(() => misLibros);
			setMisLibros(misRef.current);
			// v209: éxito → panel con las opciones de guardado (no abre solo)
			setDescargaOk({ libro, file, nombre, id: nuevo.id });
		} catch (e) {
			// v209: la directa falló → el enlace en el navegador (sin CORS) y
			// Lumen se queda oyendo la descarga (vigilando) con «Elegir archivo»
			if (libro.epub || libro.txt || urlLibroDe(libro)) {
				toast?.("La descarga directa no funcionó; abrí el archivo en el navegador y sigo de oído.");
				abrirConNavegador(libro, navDisponible() ? "lumen" : "dispositivo");
			} else {
				setMenuLibro(String(libro.id));
				toast?.("La descarga directa no funcionó (" + (e?.message || e) + "); elige otra opción");
			}
		} finally {
			setDescarga(null);
		}
	};
	const texto = q.trim().toLowerCase();
	const finVentana = Math.min((desde || 0) + VENTANA, (catalogo || []).length);
	const totalAprox = Object.values(totales || {}).reduce((a, b) => a + (b || 0), 0);
	const filtrados = (catalogo || []).slice(desde || 0, finVentana).filter((libro) => {
		if (bibliotecas && bibliotecas[libro.fuente] === false) return false; // v208: biblioteca desactivada
		if (tema !== "all" && !coincideTema(tema, libro)) return false;
		if (!texto) return true;
		return (libro.title || "").toLowerCase().includes(texto) || libro.authors.join(" ").toLowerCase().includes(texto);
	});
	const nBibliotecas = fuentes ? FUENTES.filter((id) => fuentes[id]?.ok).length : 0;
	// v198: embebido en Lumen Store: reporta su ventana de 100/100 al padre
	// para que el pie de la store (cg-pie) pinte la paginación compacta.
	const lgApiRef = (0, import_react.useRef)(null);
	lgApiRef.current = { irSiguientes, irAnteriores, refrescar };
	const onVentanaRef = (0, import_react.useRef)(onVentana);
	onVentanaRef.current = onVentana;
	(0, import_react.useEffect)(() => {
		onVentanaRef.current?.({ listo: !cargando && !!catalogo, desde: desde || 0, fin: finVentana, nCat: (catalogo || []).length, total: totalAprox, hayMas, navegando, api: lgApiRef });
		}, [cargando, catalogo, desde, finVentana, totalAprox, hayMas, navegando]);
	// v180: guardados (carpetas/categorías por tema)
	const cargarGuardados = async () => {
		try {
			const c = await getMeta(META_GARD, null);
			if (Array.isArray(c?.lista)) setGuardados(c.lista);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		cargarGuardados();
	}, []);
	const guardarMetaGard = (lista) => {
		setGuardados(lista);
		try {
			setMeta({ id: META_GARD, lista, at: Date.now() });
		} catch {}
	};
	const esGuardado = (libro) => guardados.find((g) => claveLibro(g.b) === claveLibro(libro)) || null;
	const guardarEn = (libro, cat) => {
		const c = String(cat || "").trim() || "Sin categoría";
		const clave = claveLibro(libro);
		guardarMetaGard([...guardados.filter((g) => claveLibro(g.b) !== clave), { b: libro, cat: c, at: Date.now() }]);
		setGuardCat(null);
		setGuardNueva("");
		setMenuLibro(null);
		toast?.("🔖 Guardado en «" + c + "»");
	};
	const quitarGuardado = (libro) => {
		const clave = claveLibro(libro);
		guardarMetaGard(guardados.filter((g) => claveLibro(g.b) !== clave));
		setGuardCat(null);
		setMenuLibro(null);
		toast?.("Quitado de guardados");
	};
	const catsUsadas = () => {
		const ops = [];
		for (const g of guardados) if (g.cat && !ops.includes(g.cat)) ops.push(g.cat);
		return ops;
	};
	const catGuard = () => {
		const ops = [];
		for (const g of guardados) if (g.cat && g.cat !== "Sin categoría" && !ops.includes(g.cat)) ops.push(g.cat);
		for (const t of TEMAS) if (t.id !== "all" && !ops.includes(t.label)) ops.push(t.label);
		return ops.slice(0, 10);
	};
	const tarjetas = (lista) => lista.map((libro) => {
		const ya = enMiBib(libro);
		const yaListo = !!(ya && ya.status === "ready");
		const descargando = descarga && descarga.clave === String(libro.id);
		const guard = esGuardado(libro);
		const abrir = () => {
			// v199: bibliotecas «solo búsqueda» (Wikisource): se elige el
			// formato (EPUB/PDF) y el navegador busca el archivo.
			if (libro.soloBusqueda) {
				setMenuLibro(null);
				setFormatoBusqueda(libro);
				return;
			}
			if (yaListo) {
				onAbrirLibro?.(ya.id);
				return;
			}
			setMenuLibro(null);
			// v209: PRIMERO la descarga directa (dentro de la app): si funciona,
			// queda en la biblioteca y se puede llevar a una carpeta/categoría o a
			// una carpeta local del dispositivo; si falla, el navegador lo descarga
			// y LUMEN SE QUEDA OYENDO. Sin archivo directo: búsqueda en pestaña.
			if (libro.epub || libro.txt || libro.ia) {
				leerGratis(libro).catch(() => {});
			} else if (urlLibroDe(libro)) {
				abrirConNavegador(libro, navDisponible() ? "lumen" : "dispositivo");
			} else {
				setMenuLibro(String(libro.id));
			}
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg-mini" + (yaListo ? " lg-ya" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-mini-top",
				onClick: abrir,
				children: [libro.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "lg-cover",
					src: libro.cover,
					alt: "",
					loading: "lazy",
					draggable: false
				}) : (() => {
					// v208: portada sin imagen → gradiente + iniciales (se ve como portada)
					const hv = tonoDe(libro.title);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-cover lg-falso",
						style: { background: `linear-gradient(150deg, hsl(${hv} 55% 42%), hsl(${(hv + 45) % 360} 50% 22%))` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inicialesDe(libro.title) })
					});
				})(), yaListo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lg-badge",
					children: "✓"
				}) : null, descargando ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-prog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-prog-fill",
						style: { width: (descarga.pct || 0) + "%" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "lg-prog-txt",
						children: (descarga.pct || 0) + "%"
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "lg-mas",
					title: "Otras opciones",
					"aria-label": "Otras opciones",
					onClick: (e) => {
						e.stopPropagation();
						setMenuLibro(menuLibro === String(libro.id) ? null : String(libro.id));
					},
					children: "⋯"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-nombre",
				onClick: abrir,
				children: libro.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-autor",
				children: (libro.authors || [])[0] || "Autor desconocido"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-meta",
				children: [(libro.bookshelves || [])[0]?.replace("Category: ", "") || "Dominio público", " · ", libro.downloads ? (libro.downloads >= 1e6 ? "⬇" + Math.round(libro.downloads / 1e6) + " M" : "⬇" + Math.round(libro.downloads / 1e3) + " mil") : "⬇ 0"]
			}), menuLibro === String(libro.id) && !descarga && !yaListo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-menu-fondo",
				onClick: () => setMenuLibro(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-menu-tit",
						children: (libro.title || "").slice(0, 48) || "Libro"
					}), libro.soloBusqueda ? [
						// v199: bibliotecas «solo búsqueda»: el navegador busca el
						// archivo en el formato que elija el usuario
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							onClick: () => {
								setMenuLibro(null);
								buscarEnNavegador(libro, "epub");
							},
							children: "📚 Buscar en el navegador (EPUB)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								buscarEnNavegador(libro, "pdf");
							},
							children: "📄 Buscar en el navegador (PDF)"
						})
					] : [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								abrirConNavegador(libro, "lumen");
							},
							children: "🌐 Navegador de Lumen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								abrirConNavegador(libro, "dispositivo");
							},
							children: "📲 Navegador del dispositivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setMenuLibro(null);
								leerGratis(libro).catch(() => {});
							},
							children: "⚡ Descarga directa"
						})
					], guard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: () => quitarGuardado(libro),
						children: "✔ Guardado en «" + guard.cat + "» — quitar"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: () => {
							setMenuLibro(null);
							setGuardCat(String(libro.id));
						},
						children: "🔖 Guardar en carpeta / categoría…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setMenuLibro(null),
						children: "✕ Cerrar"
					})]
				})]
			}), guardCat === String(libro.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-menu-fondo",
				onClick: () => {
					setGuardCat(null);
					setGuardNueva("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu lg-guardar",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-menu-tit",
						children: "Guardar «" + (libro.title || "").slice(0, 40) + "» en:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chips lg-guardar-chips",
						children: catGuard().map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => guardarEn(libro, c),
							children: c
						}, c))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-guardar-fila",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "plain",
							placeholder: "Nueva categoría…",
							value: guardNueva,
							onChange: (e) => setGuardNueva(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && guardNueva.trim()) guardarEn(libro, guardNueva);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							disabled: !guardNueva.trim(),
							onClick: () => guardarEn(libro, guardNueva),
							children: "Guardar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => {
							setGuardCat(null);
							setGuardNueva("");
						},
						children: "✕ Cerrar"
					})]
				})]
			}), vigilando && vigilando.clave === String(libro.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-vigilando",
				"aria-label": "Detectando tu descarga",
				/* v208: solo iconos (compacto en pantallas pequeñas) */
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "lg-vig-ic lg-vig-ojo",
					title: "Detectando tu descarga…",
					children: "👀"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "lg-vig-ic",
					title: "Elegir archivo",
					"aria-label": "Elegir archivo",
					children: ["📂", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".epub,.pdf,.txt,.mobi,.lumen",
						style: { display: "none" },
						onChange: (e) => {
							const f = e.target.files && e.target.files[0];
							if (f) importarManual(f).catch(() => {});
							e.target.value = "";
						}
					})]
				})]
			})]
		}, String(libro.id));
	});
	// v180: tiradas horizontales: cada fila tiene 10 libros (6 visibles por pantalla)
	const filas = (lista) => {
		const cards = tarjetas(lista);
		const out = [];
		for (let i = 0; i < cards.length; i += 10) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg-fila",
			children: cards.slice(i, i + 10)
		}, i));
		return out;
	};

	const cuerpo = [...(enSeccion ? [] : [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-busq-fila",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain lg-busqueda",
						placeholder: "Buscar aquí y en las 5 bibliotecas…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-busq-extras",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg-busq-btn",
							disabled: !q.trim(),
							title: "Buscar en la web (Anna's Archive, Gutenberg, Archive y más)",
							"aria-label": "Buscar en la web",
							onClick: () => onBuscarWeb?.(q.trim()),
							children: "🌐"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg-busq-btn" + (urlAbierto ? " on" : ""),
							title: "Extraer el texto de una página web",
							"aria-label": "Página web",
							onClick: () => setUrlAbierto(!urlAbierto),
							children: "🔗"
						})]
					})]
				}), urlAbierto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-url-fila",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain lg-url-input",
						placeholder: "https://ejemplo.com/articulo",
						value: urlWeb,
						inputMode: "url",
						onChange: (e) => setUrlWeb(e.target.value),
						onKeyDown: (e) => { if (e.key === "Enter") importarPagina(); }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn lg-url-btn",
						disabled: urlWebBusy || !urlWeb.trim(),
						onClick: importarPagina,
						children: urlWebBusy ? urlPaso || "…" : "Extraer"
					})]
				}),]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "chips lg-temas",
					children: TEMAS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "chip" + (tema === t.id ? " on" : ""),
						onClick: () => setTema(t.id),
						children: t.label
					}, t.id))
				}), !cargando && cargandoFondo > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-fondo",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "inline-block", marginRight: 8 }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cargandoFondo >= 2 ? "Cargando otras 2 bibliotecas en segundo plano… los libros nuevos aparecerán solos aquí." : "Cargando otra biblioteca en segundo plano… los libros nuevos aparecerán solos aquí." })]
				}), !cargando && guardados.length > 0 && texto.length < 2 && /* v208: en búsqueda, sin ruido */ /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-title",
					style: { margin: "14px 4px 4px" },
					children: `🔖 Guardados · ${guardados.length}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row-sub",
					style: { margin: "0 4px 8px" },
					children: "Tus libros guardados en carpetas (categorías por tema). Toca la portada o el nombre para leerlos gratis."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "chips lg-temas",
					children: ["todas", ...catsUsadas()].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "chip" + (guardTema === c ? " on" : ""),
						onClick: () => setGuardTema(c),
						children: c === "todas" ? "Todas" : c
					}, c))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-filas",
					children: filas(guardados.filter((g) => guardTema === "todas" || g.cat === guardTema).map((g) => g.b))
				})]
			}),  !cargando && recomendados && recomendados.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "14px 4px 4px" },
						children: "✨ Para ti · según tus libros"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Elegidos con etiquetas parecidas a lo que ya tienes en tu Lumen (sin cuentas y sin IA)."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(recomendados.filter((l) => !texto || (l.title || "").toLowerCase().includes(texto) || l.authors.join(" ").toLowerCase().includes(texto)))
					})]
				}), !cargando && (texto.length >= 2 || (remoto && remoto.length > 0)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: buscando ? ("🌐 Buscando: " + (busquedaFaltan.length ? busquedaFaltan.join(" · ") : "casi listo")) : `🌐 En las bibliotecas · ${remoto ? remoto.length : 0} resultados`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Resultados directos de Gutenberg, Open Library, Archive.org y Wikisource (aunque no estén en el catálogo)."
					}), buscando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { padding: "18px 4px" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "spinner",
							style: { display: "inline-block" }
						})
					}), !remoto?.length && !buscando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: `Sin resultados en las bibliotecas para «${q.trim()}». Prueba con menos palabras.`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(remoto || [])
					})]
				}), 
!cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: texto.length >= 2 ? ["📥 En la ventana cargada · ", filtrados.length, " coincidencia(s)"] : [tema === "all" ? "Todo el catálogo" : (TEMAS.find((t) => t.id === tema) || {}).label, " · ", filtrados.length, " de ", finVentana - (desde || 0), " libros en esta ventana"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-filas",
						children: filas(filtrados.slice(0, 60)) // v180: máximo 6 filas (60), la barra de 100 va después
					}), !enSeccion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-pag",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: (desde || 0) === 0,
							onClick: irAnteriores,
							children: "‹ Anteriores 100"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lg-pag-info",
							children: `Mostrando ${(desde || 0) + 1}–${finVentana} · ≈ ${totalAprox || "?"} libros en las bibliotecas`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: navegando || (!hayMas && finVentana >= (catalogo || []).length),
							onClick: irSiguientes,
							children: navegando ? "Cargando…" : "Siguientes 100 ›"
						})
					]})
				]}), cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 60 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "block", margin: "0 auto 12px" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Buscando libros gratis en 5 bibliotecas…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { marginTop: 8, fontSize: 13, opacity: .75 },
						children: "La primera vez puede tardar unos minutos; después se guarda en caché y abre al instante."
					})]
				}), !cargando && error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 50 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						children: "📡 No se pudo abrir el catálogo: " + error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { marginTop: 8 },
						children: "Necesitas internet la primera vez; después se guarda en caché. Inténtalo de nuevo:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						style: { marginTop: 10 },
						onClick: () => {
							setError(null);
							setCargando(true);
							conCierre(async () => {
								const f1 = await fetchFuente("gutendex", 1);
								catRef.current = {
									books: f1.books,
									fuentes: {
										gutendex: { page: 1, mas: f1.mas, ok: true },
										openlibrary: { page: 0, mas: true, ok: false },
										archive: { page: 0, mas: true, ok: false },
										"wikisource-es": { page: 0, mas: true, ok: false },
										"wikisource-en": { page: 0, mas: true, ok: false }
									},
									desde: 0,
									totales: { gutendex: f1.total || 0 }
								};
								publicar();
							}).catch((e2) => setError(e2?.message || String(e2))).finally(() => setCargando(false));
						},
						children: "Reintentar"
					})]
				}), descarga && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-aviso",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "spinner",
						style: { display: "inline-block", marginRight: 8 }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Descargando y añadiendo: " + descarga.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg-barra",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg-barra-fill",
								style: { width: (descarga.pct || 0) + "%" }
							})
						})]
					})]
				}),
				// v199: elegir formato (EPUB/PDF) para buscar el libro en el navegador
				formatoBusqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-menu-fondo",
						onClick: () => setFormatoBusqueda(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg-menu",
							onClick: (e) => e.stopPropagation(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg-menu-tit",
								children: "Buscar «" + (formatoBusqueda.title || "").slice(0, 48) + "» en el navegador"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row-sub",
								children: "Elige el formato a buscar: se abre tu navegador con la búsqueda lista para que descargues el archivo."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: () => buscarEnNavegador(formatoBusqueda, "epub"),
								children: "📚 Buscar en formato EPUB"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn",
								onClick: () => buscarEnNavegador(formatoBusqueda, "pdf"),
								children: "📄 Buscar en formato PDF"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn ghost",
								onClick: () => setFormatoBusqueda(null),
								children: "✕ Cerrar"
							})]
						})]
					}),
				// v209: descarga directa completada → elegir cómo guardarlo
				descargaOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-menu-fondo",
					onClick: () => setDescargaOk(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-menu",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg-menu-tit",
							children: "✓ «" + (descargaOk.libro.title || "").slice(0, 48) + "» descargado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row-sub",
							children: "Ya está en tu biblioteca Lumen. También puedes guardarlo en una carpeta/categoría o en una carpeta local de tu dispositivo."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							onClick: () => { const id = descargaOk.id; setDescargaOk(null); onAbrirLibro?.(id); },
							children: "📖 Abrir libro"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => { const id = String(descargaOk.libro.id); setDescargaOk(null); setGuardCat(id); },
							children: "🔖 Guardar en carpeta / categoría…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => { guardarEnDispositivo(descargaOk.file, descargaOk.nombre); },
							children: "💾 Guardar en carpeta del dispositivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn ghost",
							onClick: () => setDescargaOk(null),
							children: "✕ Cerrar"
						})]
					})]
				})
				];
	// v198: modo sección — embebido en Lumen Store: mismo contenido
	// pero sin el marco de página ni la barra 100/100 propia (ese pie
	// vive en la store y lo gobierna a través de onVentana).
	if (enSeccion) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lg-seccion",
		children: cuerpo
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-scrim",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pb-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-back",
					onClick: () => onSalir?.(),
					"aria-label": "Volver",
					children: "‹"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "📚 Libros gratis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: `Gutenberg · Open Library · Archive.org${fuentes ? ` (${nBibliotecas}/5 cargadas)` : ""} · sin cuentas · sin IA` })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-publicar",
					onClick: refrescar,
					disabled: cargando,
					children: "↻ Actualizar"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mp-cuerpo",
				children: cuerpo
			})]
		})]
	});
}
//#endregion
export { LibrosGratis as default, LibrosGratis as L, paraTi as p, nombreArchivo as n };
