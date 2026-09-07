import { t as require_react } from "./react-1WJTggxS.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { h as getMeta, O as setMeta, r as allBooks } from "./db-Ii3ipPL7.js";
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
//#region src/pages/libros-gratis.js
const GUTENDEX = "https://gutendex.com";
const OL = "https://openlibrary.org";
const IA = "https://archive.org";
const META_CAT = "librosGratis_catalogo";
const FUENTES = ["gutendex", "openlibrary", "archive"];
/** v145: 3 bibliotecas de libros gratis (dominio público y obras abiertas):
*  1) Project Gutenberg (vía Gutendex), 2) Open Library, 3) Archive.org.
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
function claveLibro(b) {
	const limpia = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return limpia(b.title).slice(0, 40) + "|" + limpia((b.authors || [])[0]);
}
function nombreBase(libro) {
	const safe = (libro.title || "libro").replace(/[^\w\sáéíóúñü-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase().slice(0, 50) || "libro";
	const pref = libro.fuente === "openlibrary" ? "openlibrary" : libro.fuente === "archive" ? "archive" : "gutenberg";
	const seg = String(libro.id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "libro";
	return `${pref}-${seg}-${safe}`;
}
function nombreArchivo(libro, ext) {
	return nombreBase(libro) + "." + ext;
}
/** Trae una página (32) de la biblioteca pedida. { books, mas } */
async function fetchFuente(fuente, pagina) {
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
/** v150: busca en las 3 bibliotecas remotas (libros que aún no están
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
		})()
	];
	const res = await Promise.allSettled(tareas);
	return res.filter((x) => x.status === "fulfilled").flatMap((x) => x.value || []);
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
function LibrosGratis({ toast, onSalir, onAbrirLibro }) {
	const [catalogo, setCatalogo] = (0, import_react.useState)(null);
	const [fuentes, setFuentes] = (0, import_react.useState)(null);
	const [cargando, setCargando] = (0, import_react.useState)(true);
	const [navegando, setNavegando] = (0, import_react.useState)(false);
	const [desde, setDesde] = (0, import_react.useState)(0);
	const [totales, setTotales] = (0, import_react.useState)(null);
	const [remoto, setRemoto] = (0, import_react.useState)(null);
	const [buscando, setBuscando] = (0, import_react.useState)(false);
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
	// v148: vigilancia de importación tras descargar en un navegador
	const [vigilando, setVigilando] = (0, import_react.useState)(null);
	const vigRef = (0, import_react.useRef)(null);
	const catRef = (0, import_react.useRef)(null);
	const misRef = (0, import_react.useRef)([]);
	const vivoRef = (0, import_react.useRef)(true);
	const colaRef = (0, import_react.useRef)(Promise.resolve());
	usarPantallaAtras(() => onSalir?.(), () => false);
	// Las mutaciones al catálogo pasan por una cola (sin carreras entre las
	// cargas en segundo plano de las 3 bibliotecas).
	const conCierre = (fn) => {
		const p = colaRef.current.then(fn).catch(() => {});
		colaRef.current = p;
		return p;
	};
	const hayMasEn = (f) => FUENTES.some((id) => f[id] && f[id].ok && f[id].mas);
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
		e.fuentes[fuente] = { page: pagina, mas: res.mas, ok: true };
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
			const f = e.fuentes[fuente];
			if (f.page >= 1) return; // ya cargada
			setCargandoFondo((n) => n + 1);
			try {
				const res = await fetchFuente(fuente, 1);
				if (!vivoRef.current) return;
				aplicarFusion(fuente, res, 1);
			} catch {
				if (!vivoRef.current) return;
				e.fuentes[fuente] = { page: 0, mas: false, ok: false, fallo: true };
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
						archive: { page: 0, mas: true, ok: false }
					},
					desde: 0,
					totales: { gutendex: f1.total || 0 }
				};
				publicar();
				setTimeout(() => cargarFondo("openlibrary"), 2e3);
				setTimeout(() => cargarFondo("archive"), 6e3);
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
		const conMas = FUENTES.filter((id) => e.fuentes[id] && e.fuentes[id].ok && e.fuentes[id].mas);
		if (!conMas.length) {
			toast?.("Ya no hay más libros en las 3 bibliotecas");
			return;
		}
		setNavegando(true);
		try {
			const antes = e.books.length;
			await conCierre(async () => {
				const est = catRef.current;
				if (!est) return;
				const res = await Promise.all(conMas.map((id) => fetchFuente(id, est.fuentes[id].page + 1).catch(() => null)));
				res.forEach((r, i) => {
					const id = conMas[i];
					if (!r) {
						est.fuentes[id] = { ...est.fuentes[id], mas: false };
						return;
					}
					aplicarFusion(id, r, est.fuentes[id].page + 1);
				});
				if (est.books.length > antes) est.desde = Math.max(0, est.books.length - VENTANA);
			});
		} catch {
			toast?.("No se pudo cargar la siguiente centena (¿sin internet?)");
		} finally {
			setNavegando(false);
		}
	};
	// v150: busca en las 3 bibliotecas mientras el usuario escribe (debounce)
	(0, import_react.useEffect)(() => {
		const t2 = q.trim();
		if (t2.length < 2) {
			setRemoto(null);
			setBuscando(false);
			return;
		}
		setBuscando(true);
		let vivo = true;
		const t = setTimeout(async () => {
			try {
				const res = await buscarRemoto(t2);
				if (vivo) setRemoto(res);
			} catch {
			} finally {
				if (vivo) setBuscando(false);
			}
		}, 550);
		return () => {
			vivo = false;
			clearTimeout(t);
		};
	}, [q]);
	const enMiBib = (libro) => {
		const base = nombreBase(libro);
		return (misLibros || []).find((b) => typeof b.fileName === "string" && b.fileName.startsWith(base + "."));
	};
	// v148: página del libro para abrir en un navegador
	const urlLibroDe = (libro) => libro.url || (libro.fuente !== "openlibrary" && libro.fuente !== "archive" ? "https://www.gutenberg.org/ebooks/" + libro.id : null);
	// v148: vigila la biblioteca: apenas aparezca el libro importado (por
	// descarga en el navegador), lo detecta y lo abre solo.
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
		const u = urlLibroDe(libro);
		if (!u) return toast?.("Este libro no tiene página para abrir");
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
			toast?.(`✓ «${titulo}» en tu biblioteca. Abriendo…`);
			onAbrirLibro?.(nuevo.id);
		} catch (e) {
			setMenuLibro(String(libro.id));
			toast?.("La descarga directa no funcionó (" + (e?.message || e) + "); elige otra opción");
		} finally {
			setDescarga(null);
		}
	};
	const texto = q.trim().toLowerCase();
	const finVentana = Math.min((desde || 0) + VENTANA, (catalogo || []).length);
	const totalAprox = Object.values(totales || {}).reduce((a, b) => a + (b || 0), 0);
	const filtrados = (catalogo || []).slice(desde || 0, finVentana).filter((libro) => {
		if (tema !== "all" && !coincideTema(tema, libro)) return false;
		if (!texto) return true;
		return (libro.title || "").toLowerCase().includes(texto) || libro.authors.join(" ").toLowerCase().includes(texto);
	});
	const nBibliotecas = fuentes ? FUENTES.filter((id) => fuentes[id]?.ok).length : 0;
	const tarjetas = (lista) => lista.map((libro) => {
		const ya = enMiBib(libro);
		const descargando = descarga && descarga.clave === String(libro.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg-card",
			children: [libro.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "lg-cover",
				src: libro.cover,
				alt: "",
				loading: "lazy"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-cover lg-falso",
				children: "📖"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-info",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-title",
					children: libro.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg-sub",
					children: libro.authors.join(", ") || "Autor desconocido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-sub lg-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `⬇ ${libro.downloads ? Math.round(libro.downloads / 1e3) + " mil" : "—"} ` }), " · ", (libro.bookshelves || [])[0]?.replace("Category: ", "") || "Dominio público"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-botones",
				children: [ya && ya.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn primary lg-boton",
					disabled: true,
					onClick: () => onAbrirLibro?.(ya.id),
					children: "✓ En tu biblioteca"
				}) : descarga ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn primary lg-boton",
					disabled: true,
					children: `${descarga.pct || 0}%`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-boton-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary lg-boton",
						onClick: () => {
							setMenuLibro(null);
							if (libro.epub || libro.txt || libro.ia) leerGratis(libro).catch(() => {});
							else setMenuLibro(String(libro.id));
						},
						children: "⬇ Leer gratis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "lg-boton-mas",
						title: "Otras formas de descargar",
						"aria-label": "Otras formas de descargar",
						onClick: () => setMenuLibro(menuLibro === String(libro.id) ? null : String(libro.id)),
						children: "⋯"
					})]
				})]
			}),
			menuLibro === String(libro.id) && !descarga && !ya && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-menu",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					className: "btn ghost",
					onClick: () => setMenuLibro(null),
					children: "✕"
				})]
			}),
			vigilando && vigilando.clave === String(libro.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-vigilando",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👀 Detectando tu descarga…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "btn",
					children: ["Elegir archivo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "📚 Libros gratis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: `Gutenberg · Open Library · Archive.org${fuentes ? ` (${nBibliotecas}/3 cargadas)` : ""} · sin cuentas · sin IA` })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-publicar",
					onClick: refrescar,
					disabled: cargando,
					children: "↻ Actualizar"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mp-cuerpo",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "plain lg-busqueda",
					placeholder: "Buscar aquí y en las 3 bibliotecas…",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				}), !cargando && recomendados && recomendados.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "14px 4px 4px" },
						children: "✨ Para ti · según tus libros"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Elegidos con etiquetas parecidas a lo que ya tienes en tu Lumen (sin cuentas y sin IA)."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-grid",
						children: tarjetas(recomendados.filter((l) => !texto || (l.title || "").toLowerCase().includes(texto) || l.authors.join(" ").toLowerCase().includes(texto)))
					})]
				}), !cargando && (texto.length >= 2 || (remoto && remoto.length > 0)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: buscando ? "🌐 Buscando en las 3 bibliotecas…" : `🌐 En las bibliotecas · ${remoto ? remoto.length : 0} resultados`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 10px" },
						children: "Resultados directos de Gutenberg, Open Library y Archive.org (aunque no estén en el catálogo)."
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
						className: "lg-grid",
						children: tarjetas(remoto || [])
					})]
				}), 
!cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-title",
						style: { margin: "16px 4px 4px" },
						children: [tema === "all" ? "Todo el catálogo" : (TEMAS.find((t) => t.id === tema) || {}).label, " · ", filtrados.length, " de ", finVentana - (desde || 0), " libros en esta ventana"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg-grid",
						children: tarjetas(filtrados)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-pag",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: (desde || 0) === 0,
							onClick: irAnteriores,
							children: "‹ Anteriores 100"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lg-pag-info",
							children: `Mostrando ${(desde || 0) + 1}–${finVentana} · ≈ ${totalAprox || "?"} libros en las 3 bibliotecas`
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Buscando libros gratis en 3 bibliotecas…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										archive: { page: 0, mas: true, ok: false }
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
				})]
			})]
		})]
	});
}
//#endregion
export { LibrosGratis as default, LibrosGratis as L, paraTi as p, nombreArchivo as n };
