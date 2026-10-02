const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./nostr-zC6Qsl2z.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js","./index-DX181kQz.js","./react-1WJTggxS.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css","./streaming-CGdx3ecV.js"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
import { O as setMeta, h as getMeta, E as putPages, k as uid, w as putBook, S as patchBook, r as allBooks } from "./db-Ii3ipPL7.js";
var __vitePreload = (fn) => fn();
import { _ as Sheet, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime, A as importarDesdeUrl, B as paginate } from "./index-DX181kQz.js";
import { buscarLibros, categoriasDe, contarReportes, eventoReporte, filtrarLibros, generarFacehashUri, generarIdentidad, guardarIdentidad, identidadGuardada, npubCorto, publicarEnRelays, refrescarCatalogo, relaysGuardados, conectarRelay, suscribir, crearEvento, firmarEvento, libroDeEvento } from "./nostr-zC6Qsl2z.js";
import { n as disponibilidad, t as descargarLumenPorGateway } from "./streaming-CGdx3ecV.js";
import { c as libroDePublicado, l as listarPublicados, borrarPublicadoLocal, borrarBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl, decodificarQr } from "./qrLumen-BDUGNJQb.js";
//#region src/lib/bookCard.js
var import_react = require_react();
var URL_SAFE = /^(https:|magnet:|ipfs:|lumenreader:)/i;
/** Validación de una URL: solo protocolos conocidos, nunca ejecutables. */
function urlSegura(u) {
	if (!u) return false;
	const s = String(u).trim();
	if (!URL_SAFE.test(s)) return false;
	if (/^(magnet:|ipfs:|lumenreader:)/i.test(s)) return s.length > 8 && /^magnet:\?xt=urn:[a-z0-9]+:/i.test(s) || /^ipfs:\/\/[A-Za-z0-9]{10,}/i.test(s) || /^lumenreader:\/\/[a-z0-9\/-]+/i.test(s);
	try {
		const u2 = new URL(s);
		if (u2.protocol !== "https:" && u2.protocol !== "http:") return false;
		return !!u2.hostname;
	} catch {
		return false;
	}
}

function aTextoPlano(val) {
	if (val == null) return "";
	if (typeof val === "string") return val;
	if (typeof val === "number" || typeof val === "boolean") return String(val);
	if (Array.isArray(val)) {
		return val.map(aTextoPlano).filter(Boolean).join(", ");
	}
	if (typeof val === "object") {
		if (typeof val.value === "string") return val.value;
		if (typeof val.name === "string") return val.name;
		if (typeof val.text === "string") return val.text;
		if (typeof val.title === "string") return val.title;
		if (val.value) return aTextoPlano(val.value);
		if (val.name) return aTextoPlano(val.name);
		return "";
	}
	return String(val);
}

/** Normaliza una book card cruda a un objeto seguro del catálogo.
Ignora campos extra y solo respeta los del schema. Devuelve null si no
es válida (sin título, o sin ninguna fuente de contenido). */
function normalizarBookCard(raw) {
	if (!raw || typeof raw !== "object") return null;
	const title = String(raw.title || raw.titulo || "").trim().slice(0, 200);
	if (!title) return null;
	const author = String(raw.author || raw.autor || "").trim().slice(0, 120);
	const category = String(raw.category || raw.categoria || "").trim().toLowerCase().slice(0, 40);
	const description = String(raw.description || raw.descripcion || "").trim().slice(0, 500);
	const size = raw.size ? String(raw.size) : "";
	const content_type = raw.content_type === "paged" ? "paged" : "text";
	const language = String(raw.language || raw.idioma || "es").slice(0, 2);
	const license = String(raw.license || "").trim().slice(0, 40);
	const content_hash = String(raw.content_hash || "").trim().slice(0, 200);
	let cover = null;
	if (raw.cover && (urlSegura(raw.cover) || String(raw.cover).startsWith("data:image/"))) cover = String(raw.cover).trim();
	const sources = [];
	const push = (type, url) => {
		if (url && urlSegura(url)) sources.push({
			type,
			url: String(url).trim()
		});
	};
	if (Array.isArray(raw.sources)) {
		for (const s of raw.sources) if (s && s.type && s.url) push(String(s.type).toLowerCase(), s.url);
	}
	push("magnet", raw.magnet);
	push("http", raw.file_url || raw.download);
	push("stream", raw.stream_url || raw.stream);
	if (!sources.length) {}
	const stream = (raw.stream_url || raw.stream || "").toString().trim();
	const download = (raw.download || "").toString().trim();
	const magnet = (raw.magnet || "").toString().trim();
	const chapters = Array.isArray(raw.chapters) ? raw.chapters.map((c) => String(c).trim()).filter(urlSegura).slice(0, 400) : [];
	const id = "card:" + (raw.id || raw.d || (title + ":" + author).replace(/\s+/g, "-").toLowerCase());
	return {
		id,
		d: id,
		_fuente: "card",
		titulo: title,
		autor: author,
		descripcion: description,
		categoria: category || "otros",
		idioma: language,
		paginas: Number(raw.pages) || 0,
		tamano: size || (Number(raw.size_bytes) ? raw.size_bytes : 0),
		portada: cover,
		createdAt: Number(raw.created_at) || Math.floor(Date.now() / 1e3),
		stream: urlSegura(stream) ? stream : null,
		download: urlSegura(download) ? download : null,
		magnet: urlSegura(magnet) ? magnet : null,
		fileUrl: urlSegura(raw.file_url || raw.lumen_file) ? String(raw.file_url || raw.lumen_file) : null,
		audioUrl: urlSegura(raw.lumen_audio) ? String(raw.lumen_audio) : null,
		videoUrl: urlSegura(raw.lumen_video) ? String(raw.lumen_video) : null,
		authorAvatar: raw.authorAvatar || raw.author_avatar || (author ? generarFacehashUri(author) : null),
		chapters,
		content_type,
		license,
		content_hash,
		npub: String(raw.author_npub || raw.npub || "").slice(0, 64),
		rating: /adulto|nsfw/i.test(String(raw.rating || "")) ? "adulto" : "general",
		sources
	};
}
/** Valida una lista de book cards (de un feed o relays). */
function normalizarBookCards(lista) {
	return (Array.isArray(lista) ? lista : []).map(normalizarBookCard).filter(Boolean);
}
if (typeof window !== "undefined") window.__lumenBookCard = {
	normalizarBookCard,
	normalizarBookCards,
	urlSegura
};
//#endregion
//#region src/lib/feed.js
var KEY = "lumen_feeds";
async function cargarFeeds() {
	return (await getMeta(KEY, null))?.feeds || [];
}
async function guardarFeeds(lista) {
	await setMeta({
		id: KEY,
		feeds: lista
	});
	return lista;
}
/** Añade un feed por URL y devuelve { ok, libros, error }. */
async function agregarFeed(url, { maxLibros = 60 } = {}) {
	const u = String(url || "").trim();
	if (!u) return {
		ok: false,
		error: "Escribe la URL del feed"
	};
	const lista = await cargarFeeds();
	if (lista.some((f) => f.url === u)) return {
		ok: false,
		error: "Ese feed ya está añadido"
	};
	let json;
	try {
		const r = await fetch(u, { signal: AbortSignal.timeout(15e3) });
		if (!r.ok) return {
			ok: false,
			error: `La URL respondió ${r.status}`
		};
		json = await r.json();
	} catch (e) {
		return {
			ok: false,
			error: "No se pudo leer el feed: " + (e?.message || "sin conexión")
		};
	}
	const libros = parsearFeed(json).slice(0, maxLibros);
	if (!libros.length) return {
		ok: false,
		error: "El feed no trae libros válidos"
	};
	const nuevo = {
		url: u,
		nombre: json?.name || u,
		agregado: Date.now(),
		libros: libros.length
	};
	await guardarFeeds([...lista, nuevo]);
	return {
		ok: true,
		feeds: [...lista, nuevo],
		libros: libros.length
	};
}
async function quitarFeed(url) {
	const lista = await cargarFeeds();
	await guardarFeeds(lista.filter((f) => f.url !== url));
	return lista.filter((f) => f.url !== url);
}
/** Normaliza los libros de un feed a objetos compatibles con el catálogo.
v107: usa la Book Card segura (schema lumen-book-card) — la app ignora
campos extra y nunca ejecuta HTML. */
function parsearFeed(json) {
	return normalizarBookCards(json?.books);
}
if (typeof window !== "undefined") window.__lumenFeed = {
	cargarFeeds,
	agregarFeed,
	quitarFeed,
	parsearFeed
};
//#endregion
//#region src/components/BookCard.jsx
var import_jsx_runtime = require_jsx_runtime();
const PALETAS_ARTISTICAS = [
	{ id: "burdeos", claseCuero: "cg-cuero-burdeos", bg: "linear-gradient(135deg, #3d0c1d 0%, #1a050d 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" },
	{ id: "azul", claseCuero: "cg-cuero-azul", bg: "linear-gradient(135deg, #0e2440 0%, #041122 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" },
	{ id: "esmeralda", claseCuero: "cg-cuero-esmeralda", bg: "linear-gradient(135deg, #0b2e1c 0%, #051a10 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" },
	{ id: "onix", claseCuero: "cg-cuero-onix", bg: "linear-gradient(135deg, #1c202a 0%, #0d0f12 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" },
	{ id: "cognac", claseCuero: "cg-cuero-cognac", bg: "linear-gradient(135deg, #3d1d0c 0%, #241208 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" },
	{ id: "purpura", claseCuero: "cg-cuero-purpura", bg: "linear-gradient(135deg, #2b0f3d 0%, #180826 100%)", acc: "#ffd977", bord: "rgba(218,185,94,0.45)" }
];

function paletaDe(titulo = "", autor = "") {
	const str = `${String(titulo).trim()} ${String(autor).trim()}`.toLowerCase();
	let h = 0;
	for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
	return PALETAS_ARTISTICAS[h % PALETAS_ARTISTICAS.length];
}

function PortadaFallback({ titulo, autor = "", alto = "auto" }) {
	const pal = paletaDe(titulo, autor);
	const ini = String(titulo).split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "L";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bc-portada bc-fallback cg-portada-lujo cg-portada-textura " + (pal.claseCuero || "cg-cuero-burdeos"),
		style: {
			background: pal.bg,
			height: alto
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-lomo-3d" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-marco-oro",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-tl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-tr" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-bl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-br" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { fontSize: 7.5, letterSpacing: 1, textTransform: "uppercase", color: "#ffd977", opacity: 0.9, zIndex: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
				children: "LUMEN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { textAlign: "center", margin: "auto 0", width: "100%", zIndex: 2 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-medallon-lujo",
						style: { width: 30, height: 30, fontSize: 13, margin: "0 auto 4px" },
						children: ini
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-titulo-lujo",
						style: { fontSize: 11, WebkitLineClamp: 2, maxHeight: 32 },
						children: titulo
					})
				]
			}),
			autor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cg-autor-lujo",
				style: { fontSize: 8.5 },
				children: autor
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 6 } })
		]
	});
}
function txt(v, max) {
	return String(v || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}
function BookCard({ libro, onAbrir, grande = false }) {
	const [portadaRota, setPortadaRota] = (0, import_react.useState)(false);
	const titulo = txt(libro?.titulo, grande ? 120 : 60);
	const autor = txt(libro?.autor, 60);
	const desc = txt(libro?.descripcion, grande ? 300 : 90);
	const meta = [];
	if (libro?.tamano) meta.push(String(libro.tamano));
	if (libro?.categoria) meta.push(libro.categoria);
	if (libro?.license) meta.push(libro.license);
	const portada = libro?.portada && !portadaRota ? libro.portada : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bc" + (grande ? " bc-grande" : ""),
		role: "button",
		tabIndex: 0,
		onClick: () => onAbrir?.(libro),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bc-portada-wrap",
			children: portada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "bc-portada",
				src: portada,
				alt: "",
				loading: "lazy",
				onError: () => setPortadaRota(true),
				draggable: false
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortadaFallback, {
				titulo,
				autor,
				alto: "auto"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bc-info",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "bc-titulo",
					title: titulo,
					children: titulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bc-autor",
					children: autor
				}),
				grande && desc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "bc-desc",
					children: desc
				}) : null,
				meta.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bc-meta",
					children: meta.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: m }, m))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "bc-acciones",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bc-btn prim",
						children: "▶ Leer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bc-btn",
						children: "↓ Descargar"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/Catalogo.jsx
var tono = (s) => {
	let h = 0;
	for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 360;
	return h;
};
var iniciales = (s) => String(s).split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
/** Calificación real otorgada por usuarios lectores. */
function ratingDe(libro) {
	if (!libro) return { estrellas: 0, reseñas: 0, esReal: false };
	const id = libro.d || libro.id || "";
	let reviews = [];
	try {
		reviews = JSON.parse(localStorage.getItem("lumen_resenas_" + id) || "[]");
	} catch {}
	let userRatings = [];
	try {
		userRatings = JSON.parse(localStorage.getItem("lumen_ratings_" + id) || "[]");
	} catch {}
	const allStars = [
		...reviews.map((r) => r.rating).filter((n) => typeof n === "number" && n >= 1 && n <= 5),
		...userRatings.map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 5)
	];
	if (allStars.length > 0) {
		const sum = allStars.reduce((a, b) => a + b, 0);
		const avg = Math.round((sum / allStars.length) * 10) / 10;
		return {
			estrellas: avg,
			reseñas: allStars.length,
			esReal: true
		};
	}
	return {
		estrellas: 0,
		reseñas: 0,
		esReal: false
	};
}
function Estrellas({ valor, total = null }) {
	const val = typeof valor === "number" && !isNaN(valor) ? Math.max(0, Math.min(5, valor)) : 0;
	const llenas = Math.round(val);
	const vacias = 5 - llenas;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "cg-stars",
		title: val > 0 ? `${val} de 5 estrellas` + (total !== null ? ` (${total} reseñas)` : "") : "Sin valoraciones aún",
		children: [
			llenas > 0 ? "★".repeat(llenas) : "",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				style: { color: "var(--fg-mute)", opacity: 0.35 },
				children: "★".repeat(vacias)
			})
		]
	});
}
let _sharedCoverObserver = null;
const _observedCovers = new Map();

function observeCover(el, cb) {
	if (typeof IntersectionObserver === "undefined") {
		cb();
		return () => {};
	}
	if (!_sharedCoverObserver) {
		_sharedCoverObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const fn = _observedCovers.get(entry.target);
					if (fn) {
						fn();
						_observedCovers.delete(entry.target);
						_sharedCoverObserver.unobserve(entry.target);
					}
				}
			}
		}, { rootMargin: "300px 0px" });
	}
	_observedCovers.set(el, cb);
	_sharedCoverObserver.observe(el);
	return () => {
		_observedCovers.delete(el);
		_sharedCoverObserver?.unobserve(el);
	};
}

function Portada({ libro, titulo, grande = false, prioritaria = false }) {
	const [rota, setRota] = (0, import_react.useState)(false);
	const [cargada, setCargada] = (0, import_react.useState)(false);
	const [enPantalla, setEnPantalla] = (0, import_react.useState)(prioritaria);
	const refEl = (0, import_react.useRef)(null);
	const cls = "cg-portada" + (grande ? " cg-portada-lg" : "");
	const aut = libro?.autor || (Array.isArray(libro?.authors) ? libro.authors[0] : libro?.authors) || "";
	const pal = paletaDe(titulo, aut);
	const tienePortada = libro?.portada && !rota && libro?.portada !== "assets/icon-192.png";

	(0, import_react.useEffect)(() => {
		if (!tienePortada || prioritaria) return;
		const node = refEl.current;
		if (!node) return;
		return observeCover(node, () => setEnPantalla(true));
	}, [tienePortada, libro?.portada, prioritaria]);

	if (tienePortada) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: refEl,
		className: cls + " cg-portada-con-img" + (cargada ? " cg-portada-cargada" : " cg-portada-cargando"),
		children: [
			(!cargada && enPantalla) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-shimmer-placeholder",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-luz" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-silueta", children: "📖" })
				]
			}),
			enPantalla && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: libro.portada,
				alt: titulo,
				loading: prioritaria ? "eager" : "lazy",
				onLoad: () => setCargada(true),
				onError: () => setRota(true),
				draggable: false,
				style: {
					opacity: cargada ? 1 : 0,
					transform: cargada ? "scale(1)" : "scale(0.97)",
					transition: "opacity 0.25s ease-out, transform 0.25s ease-out"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lg-sigla-badge sigla-lum",
				children: (libro.fuente ? String(libro.fuente).slice(0, 3).toUpperCase() : "LUM")
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls + " cg-portada-lujo cg-portada-textura " + (pal.claseCuero || "cg-cuero-burdeos"),
		style: {
			background: pal.bg
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-lomo-3d" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-marco-oro",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-tl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-tr" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-bl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-esquina-br" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { fontSize: 8, letterSpacing: 1.2, textTransform: "uppercase", color: "#ffd977", opacity: 0.9, zIndex: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "85%" },
				children: libro?.categoria ? nombreBonitoCat(libro.categoria) : "BIBLIOTECA LUMEN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { margin: "auto 0", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-medallon-lujo",
						children: iniciales(titulo)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-titulo-lujo",
						children: titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-floron-lujo",
						children: "✦ · ❖ · ✦"
					})
				]
			}),
			aut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cg-autor-lujo",
				children: aut
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 6 } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lg-sigla-badge sigla-lum",
				children: (libro?.fuente ? String(libro.fuente).slice(0, 3).toUpperCase() : "LUM")
			})
		]
	});
}
var MOTIVOS = [
	[
		"copyright",
		"©️",
		"Infringe derechos de autor"
	],
	[
		"ilegal",
		"🚫",
		"Contenido ilegal"
	],
	[
		"malware",
		"🦠",
		"Parece malware o enlace dañino"
	],
	[
		"spam",
		"🗑️",
		"Spam o libro falso"
	],
	[
		"sexual",
		"🔞",
		"Contenido sexual inapropiado"
	],
	[
		"otro",
		"⚖️",
		"Otro motivo"
	]
];
function textoLimpio(s) {
	if (s == null) return "";
	return aTextoPlano(s).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>|<\/div>|<\/li>|<li>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\n{2,}/g, "\n").trim();
}
/* v208: las 5 bibliotecas de «Libros gratis», activables/desactivables desde Filtros */
const BIBLIOTECAS_INFO = [
	["gutendex", "Gutenberg", "📚"],
	["openlibrary", "Open Library", "📖"],
	["archive", "Archive.org", "🏛️"],
	["wikisource-es", "Wikisource (es)", "✒️"],
	["wikisource-en", "Wikisource (en)", "🌐"],
	["royalroad", "Royal Road", "⚔️"],
	["wattpad", "Wattpad", "🧡"],
	["arxiv", "arXiv", "🔬"],
	["annas", "Anna's Archive", "📕"],
	["mangadex", "MangaDex", "⚡"],
	["tmo", "TuMangaOnline", "🌸"],
	["comick", "ComicK", "💥"],
	["mangakakalot", "MangaKakalot", "🎌"]
];
const BIB_DEFECTO = { gutendex: true, openlibrary: true, archive: true, "wikisource-es": true, "wikisource-en": true, royalroad: true, wattpad: true, arxiv: true, annas: true, mangadex: true, tmo: true, comick: true, mangakakalot: true };

/** Escáner QR integrado de Lumen con soporte para cámara en vivo y carga de imágenes */
function LumenScannerQR({ open, onClose, onCodigoDetectado, toast }) {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const animRef = (0, import_react.useRef)(null);
	const [estatus, setEstatus] = (0, import_react.useState)("Iniciando cámara…");

	(0, import_react.useEffect)(() => {
		if (!open) {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => t.stop());
				streamRef.current = null;
			}
			if (animRef.current) cancelAnimationFrame(animRef.current);
			return;
		}

		let activo = true;
		setEstatus("Buscando código QR…");

		const iniciarCamara = async () => {
			try {
				if (!navigator.mediaDevices?.getUserMedia) {
					setEstatus("Tu navegador no soporta cámara en vivo. Puedes subir una foto con el QR.");
					return;
				}
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: { ideal: "environment" } }
				});
				if (!activo) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play().catch(() => {});
				}
				bucleEscaneo();
			} catch (err) {
				setEstatus("No se pudo acceder a la cámara. Selecciona o toma una foto con el código QR abajo.");
			}
		};

		const bucleEscaneo = async () => {
			if (!activo) return;
			const video = videoRef.current;
			const canvas = canvasRef.current;
			if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				const ctx = canvas.getContext("2d", { willReadFrequently: true });
				if (ctx) {
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					const resultado = await decodificarQr(canvas);
					if (resultado && activo) {
						activo = false;
						if (streamRef.current) {
							streamRef.current.getTracks().forEach((t) => t.stop());
							streamRef.current = null;
						}
						haptic.tap();
						onCodigoDetectado?.(resultado);
						onClose();
						return;
					}
				}
			}
			animRef.current = requestAnimationFrame(bucleEscaneo);
		};

		iniciarCamara();

		return () => {
			activo = false;
			if (animRef.current) cancelAnimationFrame(animRef.current);
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => t.stop());
				streamRef.current = null;
			}
		};
	}, [open]);

	const procesarArchivoImagen = async (e) => {
		const archivo = e.target.files?.[0];
		if (!archivo) return;
		setEstatus("Analizando imagen…");
		try {
			const reader = new FileReader();
			reader.onload = () => {
				const img = new Image();
				img.onload = async () => {
					const canvas = canvasRef.current || document.createElement("canvas");
					canvas.width = img.naturalWidth || img.width;
					canvas.height = img.naturalHeight || img.height;
					const ctx = canvas.getContext("2d", { willReadFrequently: true });
					ctx.drawImage(img, 0, 0);
					const resultado = await decodificarQr(canvas);
					if (resultado) {
						haptic.tap();
						onCodigoDetectado?.(resultado);
						onClose();
					} else {
						setEstatus("No se encontró ningún código QR en la imagen.");
						toast?.("No se detectó ningún código QR en esa imagen.");
					}
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(archivo);
		} catch (err) {
			setEstatus("Error al leer el archivo de imagen.");
		}
	};

	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onClose: () => {
			if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
			onClose();
		},
		title: "📷 Escáner QR de Lumen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cg-qr-scanner-modal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-scanner-viewport",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							playsInline: true,
							autoPlay: true,
							muted: true,
							className: "cg-scanner-video"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							style: { display: "none" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-scanner-reticle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-scanner-laser" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "cg-scanner-status",
					children: estatus
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-scanner-acciones",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							ref: fileInputRef,
							onChange: procesarArchivoImagen,
							style: { display: "none" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: () => fileInputRef.current?.click(),
							children: "📁 Subir foto o imagen con QR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn sm",
							onClick: onClose,
							children: "Cerrar"
						})
					]
				})
			]
		})
	});
}

/** Chat y sistema descentralizado de reseñas P2P sobre Nostr */
function ChatResenas({ libro, toast }) {
	const libroId = String(libro?.d || libro?.id || "").trim();
	const [resenas, setResenas] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("lumen_resenas_" + libroId) || "[]");
		} catch {
			return [];
		}
	});

	(0, import_react.useEffect)(() => {
		if (!libroId) return;
		try {
			setResenas(JSON.parse(localStorage.getItem("lumen_resenas_" + libroId) || "[]"));
			setMiRating(Number(localStorage.getItem("lumen_mi_calificacion_" + libroId) || 0));
			setMisMensajes(new Set(JSON.parse(localStorage.getItem("lumen_mis_resenas_" + libroId) || "[]")));
		} catch {}
	}, [libroId]);
	const [miTexto, setMiTexto] = (0, import_react.useState)("");
	const [miRating, setMiRating] = (0, import_react.useState)(() => {
		try {
			return Number(localStorage.getItem("lumen_mi_calificacion_" + libroId) || 0);
		} catch {
			return 0;
		}
	});
	const [respondiendoA, setRespondiendoA] = (0, import_react.useState)(null);
	const [notifRespuesta, setNotifRespuesta] = (0, import_react.useState)(null);
	const [enviando, setEnviando] = (0, import_react.useState)(false);
	const [miIdentidad, setMiIdentidad] = (0, import_react.useState)(null);
	const [misMensajes, setMisMensajes] = (0, import_react.useState)(() => {
		try {
			return new Set(JSON.parse(localStorage.getItem("lumen_mis_resenas_" + libroId) || "[]"));
		} catch {
			return new Set();
		}
	});
	const chatEndRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);

	const eliminarMiMensaje = (id) => {
		const filtradas = resenas.filter((r) => r.id !== id);
		setResenas(filtradas);
		try {
			localStorage.setItem("lumen_resenas_" + libroId, JSON.stringify(filtradas));
			const mset = new Set(misMensajes);
			mset.delete(id);
			setMisMensajes(mset);
			localStorage.setItem("lumen_mis_resenas_" + libroId, JSON.stringify([...mset]));
			const borradas = new Set(JSON.parse(localStorage.getItem("lumen_resenas_borradas_" + libroId) || "[]"));
			borradas.add(id);
			localStorage.setItem("lumen_resenas_borradas_" + libroId, JSON.stringify([...borradas]));
		} catch {}
		toast?.("Mensaje eliminado");
		haptic.tap();
	};

	(0, import_react.useEffect)(() => {
		let vivo = true;
		(async () => {
			try {
				let id = await identidadGuardada();
				if (!id && vivo) {
					id = generarIdentidad();
					await guardarIdentidad(id);
				}
				if (vivo) setMiIdentidad(id);
			} catch {}
		})();
		return () => { vivo = false; };
	}, []);

	(0, import_react.useEffect)(() => {
		if (!libroId) return;
		let vivo = true;
		const timer = setTimeout(async () => {
			try {
				const relays = await relaysGuardados();
				for (const url of relays) {
					if (!vivo) break;
					const subId = "chat-" + libroId.slice(0, 8) + "-" + Math.random().toString(36).slice(2, 6);
					conectarRelay(url, (ev, sId) => {
						if (!vivo || sId !== subId || !ev || ev.kind !== 1) return;
						try {
							const borradas = new Set(JSON.parse(localStorage.getItem("lumen_resenas_borradas_" + libroId) || "[]"));
							if (borradas.has(ev.id)) return;
						} catch {}
						const tagD = ev.tags?.find((t) => t[0] === "d")?.[1];
						const tagT = ev.tags?.find((t) => t[0] === "t")?.[1];
						if (tagT !== "lumen-resena" || tagD !== libroId) return;
						
						const autorNom = ev.tags?.find((t) => t[0] === "author_name")?.[1] || npubCorto(ev.pubkey);
						const autorAvatar = ev.tags?.find((t) => t[0] === "author_avatar")?.[1] || generarFacehashUri(ev.pubkey + ":" + autorNom, 36);
						const tagRating = ev.tags?.find((t) => t[0] === "rating")?.[1];
						const ratingNum = tagRating ? parseInt(tagRating, 10) : null;
						const replyTo = ev.tags?.find((t) => t[0] === "reply_to")?.[1] || null;
						const replyAuthor = ev.tags?.find((t) => t[0] === "reply_author")?.[1] || null;
						const tagP = ev.tags?.find((t) => t[0] === "p")?.[1] || null;

						const nueva = {
							id: ev.id,
							pubkey: ev.pubkey,
							autor: autorNom,
							avatar: autorAvatar,
							texto: String(ev.content || "").slice(0, 1000),
							rating: ratingNum,
							createdAt: ev.created_at ? ev.created_at * 1000 : Date.now(),
							replyTo,
							replyAuthor,
							esAutor: Boolean(libro.pubkey && (ev.pubkey === libro.pubkey || (libro.evento?.pubkey && ev.pubkey === libro.evento.pubkey)))
						};

						setResenas((prev) => {
							if (prev.some((r) => r.id === nueva.id)) return prev;
							const lista = [...prev, nueva].sort((a, b) => a.createdAt - b.createdAt);
							try {
								localStorage.setItem("lumen_resenas_" + libroId, JSON.stringify(lista));
							} catch {}
							return lista;
						});

						if (replyTo && (misMensajes.has(replyTo) || (miIdentidad?.pubHex && tagP === miIdentidad.pubHex))) {
							setNotifRespuesta({
								autor: autorNom,
								texto: nueva.texto,
								targetId: nueva.id
							});
							haptic.tap();
						}
					});
					suscribir(url, subId, [
						{ kinds: [1], "#t": ["lumen-resena"], "#d": [libroId], limit: 60 }
					]);
				}
			} catch (e) {
				console.warn("[chat] error relays", e);
			}
		}, 350);
		return () => {
			vivo = false;
			clearTimeout(timer);
		};
	}, [libroId, misMensajes, miIdentidad]);

	const hacerScrollA = (id) => {
		const el = document.getElementById("resena-" + id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
			el.classList.add("resena-destacada");
			setTimeout(() => el.classList.remove("resena-destacada"), 2200);
		}
	};

	const enviarMensaje = async (e) => {
		e?.preventDefault?.();
		const textoLimpio = miTexto.trim();
		if (!textoLimpio) {
			toast?.("Escribe tu comentario o reseña");
			return;
		}
		if (!miIdentidad) {
			toast?.("Iniciando identidad anónima…");
			return;
		}
		setEnviando(true);
		try {
			const nombreAnon = localStorage.getItem("lumen_anon_autor") || "Lector anónimo";
			const seed = localStorage.getItem("lumen_anon_avatar_seed") || ("seed-" + miIdentidad.pubHex.slice(0, 8));
			const avatarUri = generarFacehashUri(seed + ":" + nombreAnon, 36);

			const tags = [
				["t", "lumen-resena"],
				["d", libroId],
				["author_name", nombreAnon],
				["author_avatar", avatarUri]
			];
			if (miRating > 0) tags.push(["rating", String(miRating)]);
			if (respondiendoA) {
				tags.push(["reply_to", respondiendoA.id]);
				tags.push(["reply_author", respondiendoA.autor]);
				if (respondiendoA.pubkey) tags.push(["p", respondiendoA.pubkey]);
			}

			const ev = firmarEvento(crearEvento({
				pubkey: miIdentidad.pubHex,
				kind: 1,
				tags,
				content: textoLimpio
			}), miIdentidad.privHex);

			await publicarEnRelays(ev);

			const nueva = {
				id: ev.id,
				pubkey: miIdentidad.pubHex,
				autor: nombreAnon,
				avatar: avatarUri,
				texto: textoLimpio,
				rating: miRating > 0 ? miRating : null,
				createdAt: Date.now(),
				replyTo: respondiendoA?.id || null,
				replyAuthor: respondiendoA?.autor || null,
				esAutor: Boolean(libro.esMio || (libro.pubkey && miIdentidad.pubHex === libro.pubkey))
			};

			const nuevaLista = [...resenas, nueva].sort((a, b) => a.createdAt - b.createdAt);
			setResenas(nuevaLista);
			try {
				localStorage.setItem("lumen_resenas_" + libroId, JSON.stringify(nuevaLista));
				const mset = new Set([...misMensajes, ev.id]);
				setMisMensajes(mset);
				localStorage.setItem("lumen_mis_resenas_" + libroId, JSON.stringify([...mset]));
				if (miRating > 0) {
					localStorage.setItem("lumen_mi_calificacion_" + libroId, String(miRating));
					const ratingsActuales = JSON.parse(localStorage.getItem("lumen_ratings_" + libroId) || "[]");
					ratingsActuales.push(miRating);
					localStorage.setItem("lumen_ratings_" + libroId, JSON.stringify(ratingsActuales));
				}
			} catch {}

			setMiTexto("");
			setRespondiendoA(null);
			toast?.("💬 Reseña enviada a la red descentralizada");
			haptic.tap();
			setTimeout(() => {
				chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		} catch (err) {
			toast?.("Error al enviar mensaje: " + (err?.message || err));
		} finally {
			setEnviando(false);
		}
	};

	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cg-resenas-chat",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-chat-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "💬 Reseñas y Chat Descentralizado" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
						className: "cg-chat-sub",
						children: [
							resenas.length,
							" ",
							resenas.length === 1 ? "mensaje" : "mensajes",
							" · Nostr P2P"
						]
					})
				]
			}),

			notifRespuesta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-resena-notif",
				onClick: () => {
					hacerScrollA(notifRespuesta.targetId);
					setNotifRespuesta(null);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						children: [
							"🔔 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: notifRespuesta.autor }),
							" respondió a tu reseña: «",
							notifRespuesta.texto.slice(0, 42),
							notifRespuesta.texto.length > 42 ? "…" : "",
							"»"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cg-notif-ir",
						children: "Ver respuesta ↓"
					})
				]
			}),

			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-chat-lista",
				children: [
					resenas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-chat-vacio",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "✍️ Aún no hay reseñas ni comentarios para este libro." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Sé el primero en calificarlo o dejar tu opinión. El autor y los lectores se comunican de forma abierta y directa sin servidores centrales." })
						]
					}) : resenas.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "resena-" + m.id,
						className: "cg-resena-item" + (m.esAutor ? " autor" : ""),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-resena-meta",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: m.avatar,
										alt: m.autor,
										className: "cg-resena-avatar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-resena-autor-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "cg-resena-autor",
												children: m.autor
											}),
											m.esAutor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "cg-badge-autor",
												children: "✍️ Autor"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "cg-badge-lector",
												children: "📖 Lector"
											}),
											m.rating > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "cg-resena-stars",
												children: "★".repeat(m.rating)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "cg-resena-tiempo",
										children: new Date(m.createdAt).toLocaleDateString("es-CO", {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})
									})
								]
							}),

							m.replyTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "cg-resena-quote",
								onClick: () => hacerScrollA(m.replyTo),
								title: "Ir al mensaje respondido",
								children: [
									"↩ En respuesta a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.replyAuthor ? `@${m.replyAuthor}` : "mensaje previo" }),
									" ↑"
								]
							}),

							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "cg-resena-texto",
								children: m.texto
							}),

							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-resena-pie",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "cg-resena-btn-resp",
										onClick: () => {
											setRespondiendoA({
												id: m.id,
												autor: m.autor,
												pubkey: m.pubkey,
												texto: m.texto
											});
											inputRef.current?.focus?.();
										},
										children: "↩ Responder"
									}),
									(misMensajes.has(m.id) || (miIdentidad?.pubHex && m.pubkey === miIdentidad.pubHex) || (m.autor && m.autor === (localStorage.getItem("lumen_anon_autor") || "Lector anónimo") && (Date.now() - m.createdAt < 86400000))) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "cg-resena-btn-del",
										title: "Eliminar mi mensaje",
										onClick: () => eliminarMiMensaje(m.id),
										children: "🗑️ Eliminar"
									})
								]
							})
						]
					}, m.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })
				]
			}),

			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "cg-chat-form",
				onSubmit: enviarMensaje,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-star-picker",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cg-star-picker-label",
								children: "Tu calificación:"
							}),
							[1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								key: s,
								type: "button",
								className: "cg-star-btn" + (s <= miRating ? " on" : ""),
								onClick: () => setMiRating(s === miRating ? 0 : s),
								title: `${s} estrellas`,
								children: "★"
							}))
						]
					}),

					respondiendoA && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-chat-resp-banner",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								children: [
									"↩ Respondiendo a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: `@${respondiendoA.autor}` }),
									": «",
									respondiendoA.texto.slice(0, 36),
									respondiendoA.texto.length > 36 ? "…" : "",
									"»"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "cg-chat-resp-cancel",
								onClick: () => setRespondiendoA(null),
								children: "✕ Cancelar"
							})
						]
					}),

					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-chat-input-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								className: "cg-chat-input",
								placeholder: respondiendoA ? `Escribe tu respuesta a @${respondiendoA.autor}…` : "Escribe tu reseña u opinión sobre este libro…",
								value: miTexto,
								maxLength: 1000,
								rows: 2,
								onChange: (e) => setMiTexto(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
										e.preventDefault();
										enviarMensaje();
									}
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn primary cg-chat-enviar-btn",
								disabled: enviando || !miTexto.trim(),
								children: enviando ? "⏳…" : respondiendoA ? "↩ Responder" : "💬 Publicar"
							})
						]
					})
				]
			})
		]
	});
}


const cacheSinopsisExterna = new Map();

async function buscarSinopsisExterna(titulo, autor) {

	if (!titulo) return null;
	const titLimpio = String(titulo).replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").trim();
	const autLimpio = String(autor || "").replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").trim();
	if (!titLimpio) return null;

	const cacheKey = (titLimpio + "::" + autLimpio).toLowerCase();
	if (cacheSinopsisExterna.has(cacheKey)) {
		return cacheSinopsisExterna.get(cacheKey);
	}

	// 1. Wikipedia en español: consulta directa de títulos
	const titulosProbar = [
		titLimpio,
		titLimpio + " (novela)",
		titLimpio + " (libro)",
		titLimpio + " (manga)",
		titLimpio + " (manhwa)"
	];
	for (const t of titulosProbar) {
		try {
			const url = "https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&exsentences=6&titles=" + encodeURIComponent(t) + "&format=json&origin=*";
			const res = await fetch(url, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
			const pg = Object.values(res?.query?.pages || {})[0];
			if (pg && pg.pageid && pg.pageid > 0 && pg.extract && pg.extract.length > 50 && !pg.extract.includes("referirse a:")) {
				const result = { desc: pg.extract.trim(), fuente: "Wikipedia (es)" };
				cacheSinopsisExterna.set(cacheKey, result);
				return result;
			}
		} catch (_) {}
	}

	// 2. Wikipedia en español: búsqueda libre con título y autor
	try {
		const q = autLimpio ? (titLimpio + " " + autLimpio) : titLimpio;
		const url = "https://es.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + encodeURIComponent(q) + "&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&exsentences=6&format=json&origin=*";
		const res = await fetch(url, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
		const pages = Object.values(res?.query?.pages || {});
		for (const pg of pages) {
			if (pg && pg.extract && pg.extract.length > 70 && !pg.extract.includes("referirse a:")) {
				const text = pg.extract.toLowerCase();
				const tLower = titLimpio.toLowerCase();
				if (pg.title.toLowerCase().includes(tLower) || text.includes(tLower)) {
					const result = { desc: pg.extract.trim(), fuente: "Wikipedia (es)" };
					cacheSinopsisExterna.set(cacheKey, result);
					return result;
				}
			}
		}
	} catch (_) {}

	// 3. Open Library (CORS, abierta)
	try {
		const olUrl = "https://openlibrary.org/search.json?title=" + encodeURIComponent(titLimpio) + (autLimpio ? ("&author=" + encodeURIComponent(autLimpio)) : "") + "&limit=2";
		const olRes = await fetch(olUrl, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
		if (olRes?.docs?.length) {
			for (const doc of olRes.docs) {
				if (doc.key) {
					const work = await fetch("https://openlibrary.org" + doc.key + ".json", { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
					const d = typeof work.description === "string" ? work.description : (work.description?.value || "");
					if (d && d.trim().length > 40) {
						const result = { desc: d.trim().replace(/\r\n/g, "\n"), fuente: "Open Library" };
						cacheSinopsisExterna.set(cacheKey, result);
						return result;
					}
				}
			}
		}
	} catch (_) {}

	// 4. Wikipedia en inglés (para mangas/novelas traducidas)
	try {
		const urlEn = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&exsentences=6&titles=" + encodeURIComponent(titLimpio) + "&format=json&origin=*";
		const resEn = await fetch(urlEn, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
		const pgEn = Object.values(resEn?.query?.pages || {})[0];
		if (pgEn && pgEn.pageid && pgEn.pageid > 0 && pgEn.extract && pgEn.extract.length > 50 && !pgEn.extract.includes("refer to:")) {
			const result = { desc: pgEn.extract.trim(), fuente: "Wikipedia (en)" };
			cacheSinopsisExterna.set(cacheKey, result);
			return result;
		}
	} catch (_) {}

	// 5. Google Books (respaldo)
	try {
		const gbUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent("intitle:" + titLimpio + (autLimpio ? (" inauthor:" + autLimpio) : "")) + "&maxResults=1";
		const gbRes = await fetch(gbUrl, { signal: AbortSignal.timeout(3500) }).then((r) => r.json());
		const desc = gbRes?.items?.[0]?.volumeInfo?.description;
		if (desc && desc.trim().length > 40) {
			const result = { desc: desc.trim(), fuente: "Google Books" };
			cacheSinopsisExterna.set(cacheKey, result);
			return result;
		}
	} catch (_) {}

	return null;
}
try { if (typeof window !== "undefined") window.buscarSinopsisExterna = buscarSinopsisExterna; } catch(_) {}

function Catalogo({ onSalir, onPublicar, onAbrirLibro, onAbrirLibroLocal, onAbrirAds, onAbrirMisPublicaciones, onBuscarWeb, toast, qrPendiente, libroInicial }) {
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [libros, setLibros] = (0, import_react.useState)([]);
	const [reportes, setReportes] = (0, import_react.useState)([]);
	const [categoria, setCategoria] = (0, import_react.useState)("");
	const [ocultarAdultos, setOcultarAdultos] = (0, import_react.useState)(true);
	const [filtroIdioma, setFiltroIdioma] = (0, import_react.useState)("todos");
	const [filtrosAbiertos, setFiltrosAbiertos] = (0, import_react.useState)(false);
	const [estado, setEstado] = (0, import_react.useState)("cargando");
	const [detalle, setDetalle] = (0, import_react.useState)(null);
	const [libroSugerido, setLibroSugerido] = (0, import_react.useState)(null);
	const [reporteAbierto, setReporteAbierto] = (0, import_react.useState)(false);
	const [qrAbierto, setQrAbierto] = (0, import_react.useState)(false);
	const [publicandoReporte, setPublicandoReporte] = (0, import_react.useState)(false);
	const [relaysActivos, setRelaysActivos] = (0, import_react.useState)(0);
	const [relaysInfo, setRelaysInfo] = (0, import_react.useState)({});
	const [listaRelays, setListaRelays] = (0, import_react.useState)([]);
	const [panelRelays, setPanelRelays] = (0, import_react.useState)(false);
	const [misLibros, setMisLibros] = (0, import_react.useState)([]);
	const [descargando, setDescargando] = (0, import_react.useState)(false);
	const [escanerAbierto, setEscanerAbierto] = (0, import_react.useState)(false);
	const [feeds, setFeeds] = (0, import_react.useState)([]);
	const [librosFeed, setLibrosFeed] = (0, import_react.useState)([]);
	// v198: el catálogo de LIBROS GRATIS vive embebido aquí (sección):
	// su buscador reemplaza al de la store y su ventana de 40/40 se
	// gobierna desde el pie (cg-pie) con botones compactos.
	const [LGComp, setLGComp] = (0, import_react.useState)(null);
	const [lgVentana, setLgVentana] = (0, import_react.useState)(null);
	// v200: la barra de búsqueda vive en la cabecera (navbar) de la store:
	// una sola consulta busca TODO (catálogo Nostr + libros gratis y las 5 bibliotecas).
	const [lgQ, setLgQ] = (0, import_react.useState)("");
	const [lgUrlAbierto, setLgUrlAbierto] = (0, import_react.useState)(false);
	const [buscandoDesc, setBuscandoDesc] = (0, import_react.useState)(false);
	// v258: Si no se detecta descripcion del libro, buscarla en Wikipedia, Open Library o Google Books
	(0, import_react.useEffect)(() => {
		if (!detalle) {
			setBuscandoDesc(false);
			return;
		}
		const dActual = (detalle.descripcion || detalle.description || detalle.synopsis || detalle.desc || "").trim();
		if (dActual.length > 25) {
			setBuscandoDesc(false);
			return;
		}
		let vivo = true;
		setBuscandoDesc(true);
		buscarSinopsisExterna(detalle.titulo || detalle.title, detalle.autor || detalle.author).then((res) => {
			if (!vivo) return;
			setBuscandoDesc(false);
			if (res && res.desc) {
				setDetalle((prev) => {
					if (!prev) return prev;
					const pTit = prev.titulo || prev.title;
					const dTit = detalle.titulo || detalle.title;
					if (pTit !== dTit) return prev;
					return { ...prev, descripcion: res.desc, _fuenteDesc: res.fuente };
				});
			}
		}).catch(() => {
			if (vivo) setBuscandoDesc(false);
		});
		return () => { vivo = false; };
	}, [detalle?.id, detalle?.d, detalle?.titulo, detalle?.title]);

	// v218 (#3b): la barra de búsqueda va oculta por defecto (cabecera más baja); la lupa la muestra/oculta
	const [busqVisible, setBusqVisible] = (0, import_react.useState)(false);
	const busqInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => { if (busqVisible) setTimeout(() => busqInputRef.current?.focus?.(), 60); }, [busqVisible]);
	const [sugerencias, setSugerencias] = (0, import_react.useState)([]);
	const [sugVisible, setSugVisible] = (0, import_react.useState)(false);
	const [sugIdx, setSugIdx] = (0, import_react.useState)(-1);
	const sugTimerRef = (0, import_react.useRef)(null);

	// v255: Búsquedas recientes en Lumen Store
	const [busquedasRecientes, setBusquedasRecientes] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("lumen_store_busquedas_recientes") || "[]");
		} catch {
			return [];
		}
	});
	const guardarBusquedaReciente = (termino) => {
		const q = (termino || "").trim();
		if (q.length < 2) return;
		setBusquedasRecientes((prev) => {
			const filtrados = prev.filter((item) => item.toLowerCase() !== q.toLowerCase());
			const actualizados = [q, ...filtrados].slice(0, 10);
			try {
				localStorage.setItem("lumen_store_busquedas_recientes", JSON.stringify(actualizados));
			} catch {}
			return actualizados;
		});
	};
	const eliminarBusquedaReciente = (termino, e) => {
		e?.stopPropagation?.();
		e?.preventDefault?.();
		setBusquedasRecientes((prev) => {
			const actualizados = prev.filter((item) => item.toLowerCase() !== termino.toLowerCase());
			try {
				localStorage.setItem("lumen_store_busquedas_recientes", JSON.stringify(actualizados));
			} catch {}
			return actualizados;
		});
	};
	const limpiarBusquedasRecientes = (e) => {
		e?.stopPropagation?.();
		e?.preventDefault?.();
		setBusquedasRecientes([]);
		try {
			localStorage.removeItem("lumen_store_busquedas_recientes");
		} catch {}
	};

	// v255: Favoritos en información de libro en Lumen Store
	const [favoritosStore, setFavoritosStore] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("lumen_store_favoritos") || "[]");
		} catch {
			return [];
		}
	});
	const idLibroStore = (b) => {
		if (!b) return "";
		return (b.id || b.d || b.url || b.sourceUrl || b.fileUrl || b.titulo || b.title || "").trim();
	};
	const esFavoritoStore = (b) => {
		if (!b) return false;
		const id = idLibroStore(b);
		const tit = (b.titulo || b.title || "").trim().toLowerCase();
		return favoritosStore.some((f) => {
			if (id && idLibroStore(f) === id) return true;
			if (tit && (f.titulo || f.title || "").trim().toLowerCase() === tit) return true;
			return false;
		});
	};
	const toggleFavoritoStore = async (b) => {
		if (!b) return;
		haptic.tap();
		const yaFav = esFavoritoStore(b);
		const id = idLibroStore(b);
		const tit = (b.titulo || b.title || "").trim().toLowerCase();
		let nuevos;
		if (yaFav) {
			nuevos = favoritosStore.filter((f) => idLibroStore(f) !== id && (!tit || (f.titulo || f.title || "").trim().toLowerCase() !== tit));
			toast?.("Quitado de favoritos de Lumen Store");
		} else {
			const item = {
				id: b.id || b.d || uid(),
				d: b.d || b.id || "",
				titulo: b.titulo || b.title || "Libro",
				autor: b.autor || b.author || "Autor",
				portada: b.portada || b.cover || b.coverUrl || "",
				categoria: b.categoria || b.category || "General",
				descripcion: b.descripcion || b.description || "",
				url: b.url || b.sourceUrl || b.fileUrl || "",
				epub: b.epub || "",
				fileUrl: b.fileUrl || "",
				magnet: b.magnet || "",
				downloads: b.downloads || b.descargas || 0,
				rating: b.rating || 5,
				fav: true,
				agregadoAt: Date.now()
			};
			nuevos = [item, ...favoritosStore.filter((f) => idLibroStore(f) !== id && (!tit || (f.titulo || f.title || "").trim().toLowerCase() !== tit))];
			toast?.("⭐ «" + item.titulo.slice(0, 28) + "» guardado en favoritos");
		}
		setFavoritosStore(nuevos);
		try {
			localStorage.setItem("lumen_store_favoritos", JSON.stringify(nuevos));
		} catch {}
		try {
			const locales = await allBooks();
			const enBiblioteca = locales.find((x) => x.id === b.id || (tit && (x.title || "").trim().toLowerCase() === tit));
			if (enBiblioteca) {
				await patchBook(enBiblioteca.id, { fav: !yaFav });
			}
		} catch (eLocal) {
			console.warn("[fav sync local]", eLocal);
		}
	};

	(0, import_react.useEffect)(() => {
		if (sugTimerRef.current) clearTimeout(sugTimerRef.current);
		const q = (lgQ || "").trim();
		if (lgUrlAbierto) {
			setSugerencias([]);
			setSugVisible(false);
			setSugIdx(-1);
			return;
		}
		if (q.length < 2) {
			if (busquedasRecientes.length > 0) {
				setSugerencias([
					{ esHeaderRecientes: true },
					...busquedasRecientes.map((r) => ({
						texto: r,
						sub: "Búsqueda reciente",
						origen: "Historial",
						icono: "🕒",
						reciente: true
					}))
				]);
			} else {
				setSugerencias([]);
				setSugVisible(false);
			}
			setSugIdx(-1);
			return;
		}
		sugTimerRef.current = setTimeout(async () => {
			const qNorm = q.toLowerCase();
			const lista = [];
			const seen = new Set();

			// 1. Coincidencias con búsquedas recientes del usuario
			for (const r of busquedasRecientes) {
				if (r.toLowerCase().includes(qNorm) && !seen.has(r.toLowerCase())) {
					seen.add(r.toLowerCase());
					lista.push({ texto: r, sub: "Búsqueda reciente", origen: "Historial", icono: "🕒", reciente: true });
				}
				if (lista.length >= 2) break;
			}

			const pool = [...(libros || []), ...(misLibros || []), ...(librosFeed || []), ...LIBROS_MANGA_CURADOS];
			for (const b of pool) {
				const tit = b.title || b.titulo || "";
				const aut = b.author || b.autor || (b.authors || [])[0] || "";
				if (tit && tit.toLowerCase().includes(qNorm) && !seen.has(tit.toLowerCase())) {
					seen.add(tit.toLowerCase());
					lista.push({ texto: tit, sub: aut ? `Libro · ${aut}` : "Lumen Store", origen: "Store", icono: "📖" });
				}
				if (lista.length >= 4) break;
			}
			try {
				const res = await fetch(`https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=6&namespace=0&format=json&origin=*`);
				if (res.ok) {
					const data = await res.json();
					const terminos = data[1] || [];
					for (const t of terminos) {
						if (!t || seen.has(t.toLowerCase())) continue;
						seen.add(t.toLowerCase());
						lista.push({ texto: t, sub: "Sugerencia enciclopédica", origen: "Wiki", icono: "💡" });
						if (lista.length >= 6) break;
					}
				}
			} catch {}
			if (lista.length > 0) {
				lista.push({ texto: `Buscar «${q}» en la web`, sub: "Anna's Archive, Google, Sci-Hub y más", origen: "Web", icono: "🌐", web: true });
				setSugerencias(lista);
				setSugVisible(true);
				setSugIdx(-1);
			} else {
				setSugerencias([]);
				setSugVisible(false);
			}
		}, 150);
		return () => { if (sugTimerRef.current) clearTimeout(sugTimerRef.current); };
	}, [lgQ, lgUrlAbierto, libros, misLibros, librosFeed, busquedasRecientes]);
	const [lgUrlWeb, setLgUrlWeb] = (0, import_react.useState)("");
	const [lgUrlBusy, setLgUrlBusy] = (0, import_react.useState)(false);
	const [lgUrlPaso, setLgUrlPaso] = (0, import_react.useState)("");
	// v208: bibliotecas activables/desactivables (persistidas en catalogo_filtros)
	const [bibActivas, setBibActivas] = (0, import_react.useState)(null);
	const [catPool, setCatPool] = (0, import_react.useState)(null);
	const [semillaPool, setSemillaPool] = (0, import_react.useState)(null);
	const [paginas, setPaginas] = (0, import_react.useState)({});
	const obtenerPagina = (k) => paginas[k] || 1;
	const [cargandoMasCat, setCargandoMasCat] = (0, import_react.useState)(false);
	const [paginaTodas, setPaginaTodas] = (0, import_react.useState)(1);
	const [resultadosRemotos, setResultadosRemotos] = (0, import_react.useState)([]);
	const [cargandoRemotos, setCargandoRemotos] = (0, import_react.useState)(false);

	(0, import_react.useEffect)(() => {
		const q = aTextoPlano(lgQ).trim();
		// Evitar peticiones remotas para términos minúsculos de 1 o 2 letras o artículos sueltos que causan 422 en Open Library
		if (q.length < 3 || /^(el|la|los|las|un|una|de|del|en|y|o|the|a|an|of|in|to|is|on)$/i.test(q)) {
			setResultadosRemotos([]);
			setCargandoRemotos(false);
			return;
		}
		let cancelado = false;
		setCargandoRemotos(true);
		const timer = setTimeout(async () => {
			try {
				const promesas = [
					fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(q)}&limit=25`, { signal: AbortSignal.timeout(6000) })
						.then((r) => r.ok ? r.json() : null)
						.then((j) => (j?.docs || []).map((d) => docToLibroOL(d, "remoto")).filter(Boolean))
						.catch(() => []),
					fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=25`, { signal: AbortSignal.timeout(6000) })
						.then((r) => r.ok ? r.json() : null)
						.then((j) => (j?.docs || []).map((d) => docToLibroOL(d, "remoto")).filter(Boolean))
						.catch(() => []),
					fetch(`https://archive.org/advancedsearch.php?q=mediatype:(texts)+AND+(creator:(${encodeURIComponent(q)})+OR+title:(${encodeURIComponent(q)}))&fl[]=identifier,title,creator,downloads,year,description&sort[]=downloads+desc&rows=30&output=json`, { signal: AbortSignal.timeout(6000) })
						.then((r) => r.ok ? r.json() : null)
						.then((j) => ((j?.response?.docs) || []).map((d) => ({
							id: `ia-${d.identifier}`,
							d: `ia-${d.identifier}`,
							titulo: aTextoPlano(d.title) || "Libro",
							autor: aTextoPlano(d.creator) || "Dominio Público",
							portada: `https://archive.org/services/img/${d.identifier}`,
							fuente: "archive",
							epub: `https://archive.org/download/${d.identifier}/${d.identifier}.epub`,
							fileUrl: `https://archive.org/download/${d.identifier}/${d.identifier}.pdf`,
							url: `https://archive.org/details/${d.identifier}`,
							downloads: Number(d.downloads) || 12000,
							descripcion: aTextoPlano(d.description) || "Obra disponible en Internet Archive para descarga y lectura directa."
						})))
						.catch(() => [])
				];
				const resultados = await Promise.allSettled(promesas);
				if (cancelado) return;
				const acumulados = [];
				for (const res of resultados) {
					if (res.status === "fulfilled" && Array.isArray(res.value)) {
						acumulados.push(...res.value);
					}
				}
				setResultadosRemotos(acumulados);
			} catch (err) {
				console.warn("Búsqueda remota:", err);
			} finally {
				if (!cancelado) setCargandoRemotos(false);
			}
		}, 350);
		return () => {
			cancelado = true;
			clearTimeout(timer);
		};
	}, [lgQ]);

	(0, import_react.useEffect)(() => {
		const target = libroInicial || qrPendiente;
		if (target) {
			if (typeof target === "object" && (target.id || target.d)) {
				setLibroSugerido(target);
				setBusqVisible(true);
			} else if (typeof target === "string") {
				resolverYMostrarLibro(target, null, false);
			}
		}
	}, [libroInicial, qrPendiente]);

	(0, import_react.useEffect)(() => {
		try {
			const s = window.location.search || (window.location.hash.includes("?") ? ("?" + window.location.hash.split("?")[1]) : "");
			if (s) {
				const p = new URLSearchParams(s);
				const bId = p.get("b") || p.get("libro") || p.get("id");
				if (bId) {
					const lObj = {
						id: bId,
						d: bId,
						titulo: p.get("t") || p.get("tit") || p.get("titulo") || "Libro",
						autor: p.get("a") || p.get("aut") || p.get("autor") || "",
						portada: p.get("c") || p.get("cov") || p.get("portada") || "",
						fileUrl: p.get("f") || p.get("file") || p.get("epub") || "",
						epub: p.get("f") || p.get("file") || p.get("epub") || "",
						magnet: p.get("m") || p.get("mag") || p.get("magnet") || "",
						audioUrl: p.get("aud") || p.get("audio") || "",
						videoUrl: p.get("vid") || p.get("video") || "",
						categoria: p.get("cat") || p.get("categoria") || "",
						descripcion: p.get("desc") || p.get("descripcion") || ""
					};
					// Limpiar la URL para que no persista indefinidamente en cada recarga
					try {
						const urlLimpia = window.location.pathname + (window.location.hash ? window.location.hash.split("?")[0] : "");
						window.history.replaceState({}, document.title, urlLimpia);
					} catch {}
					setLibroSugerido(lObj);
					setBusqVisible(true);
				}
			}
		} catch {}
	}, []);

	const retrocederPaginaCategoria = (catId) => {
		haptic.tap();
		const pActual = obtenerPagina(catId || "__todas__");
		if (pActual > 1) {
			setPaginas((prev) => ({ ...prev, [catId || "__todas__"]: pActual - 1 }));
		}
	};
	const avanzarPaginaCategoria = async (catId) => {
		haptic.tap();
		const pActual = obtenerPagina(catId || "__todas__");
		const pSiguiente = pActual + 1;
		const poolActual = obtenerLibrosDeCategoria(catId);

		// Si ya hay suficientes libros en el pool para cubrir la siguiente página de 40 en 40
		if (poolActual.length >= pSiguiente * 40) {
			setPaginas((prev) => ({ ...prev, [catId]: pSiguiente }));
			return;
		}

		// Cargar siguientes 40 libros desde bibliotecas abiertas (Open Library subjects)
		setCargandoMasCat(true);
		try {
			const subj = MAPA_SUBJECT_OL[catId] || catId;
			const offset = poolActual.length;
			const res = await fetch(`https://openlibrary.org/subjects/${subj}.json?limit=40&offset=${offset}`, {
				signal: AbortSignal.timeout(10000)
			});
			if (res.ok) {
				const data = await res.json();
				const works = data.works || [];
				if (works.length > 0) {
					const nuevosLibros = works.map((w) => docToLibroOL(w, catId));
					const claveCat = MAPA_TEMA_LG[catId] || catId;
					setCatPool((prev) => {
						const actual = prev || {};
						const listaCat = actual[claveCat] || [];
						return {
							...actual,
							[claveCat]: [...listaCat, ...nuevosLibros]
						};
					});
					toast?.(`✓ Se cargaron ${works.length} nuevos libros de ${nombreBonitoCat(catId)} desde bibliotecas abiertas`);
				}
			}
		} catch (eMas) {
			console.warn("[cargar mas cat]", eMas);
			toast?.("Avanzando con los libros disponibles");
		} finally {
			setCargandoMasCat(false);
			setPaginas((prev) => ({ ...prev, [catId]: pSiguiente }));
		}
	};

	
	const refrescarRecientes = async () => {
		haptic.tap();
		toast?.("🔄 Actualizando libros recién publicados…");
		try {
			await cargar();
			toast?.("✓ Catálogo de recién publicados actualizado");
		} catch (_) {}
	};

	const avanzarPagina = (k) => {
		haptic.tap();
		setPaginas((prev) => ({ ...prev, [k]: (prev[k] || 1) + 1 }));
	};
	(0, import_react.useEffect)(() => {
		let vivo = true;
		__vitePreload(() => import("./LibrosGratis-K7x2Mq4P.js").then((m) => {
			if (vivo) {
				setLGComp(() => m.L);
				if (m.C) setCatPool(m.C);
				if (m.S) setSemillaPool(m.S);
			}
		}).catch(() => {}), void 0);
		return () => { vivo = false; };
	}, []);
	const detalleRef = (0, import_react.useRef)(null);
	detalleRef.current = detalle;
	usarPantallaAtras(() => onSalir?.(), () => {
		if (panelRelays) {
			setPanelRelays(false);
			return true;
		}
		if (escanerAbierto) {
			setEscanerAbierto(false);
			return true;
		}
		if (qrAbierto) {
			setQrAbierto(false);
			return true;
		}
		if (reporteAbierto) {
			setReporteAbierto(false);
			return true;
		}
		if (detalleRef.current) {
			setDetalle(null);
			return true;
		}
		return false;
	});
	
	const extraerDatosLibroEnlace = (texto) => {
		if (!texto || typeof texto !== "string") return null;
		const str = texto.trim();
		let id = null;
		let tit = "";
		let aut = "";
		let file = "";
		let cov = "";
		let mag = "";
		let aud = "";
		let vid = "";
		let cat = "";
		let desc = "";

		// Detección directa de magnet URI
		const matchMagnet = str.match(/magnet:\?xt=[^\s"'<>]+/i);
		if (matchMagnet) {
			const magUrl = matchMagnet[0];
			let nombre = "";
			let hash = "";
			try {
				const params = new URLSearchParams(magUrl.replace(/^magnet:\?/i, ""));
				const xt = params.get("xt") || "";
				const dn = params.get("dn") || "";
				hash = xt.replace(/^urn:btih:/i, "").trim();
				if (dn) {
					nombre = decodeURIComponent(dn).replace(/\+/g, " ").replace(/\.(epub|pdf|mobi|cbz|txt|lumen)$/i, "").trim();
				}
			} catch {}
			if (!nombre) {
				const dnMatch = magUrl.match(/[?&]dn=([^&]+)/i);
				if (dnMatch) nombre = decodeURIComponent(dnMatch[1]).replace(/\+/g, " ").replace(/\.(epub|pdf|mobi|cbz|txt|lumen)$/i, "").trim();
			}
			const idMag = "mag_" + (hash.slice(0, 16) || Math.random().toString(36).slice(2, 10));
			return {
				id: idMag,
				d: idMag,
				tit: nombre || "Libro torrent",
				aut: "Red Torrent P2P",
				file: "",
				cov: "",
				mag: magUrl,
				aud: "",
				vid: "",
				cat: "torrent",
				desc: "Descarga e intercambio descentralizado por red BitTorrent P2P."
			};
		}

		try {
			const urlMatch = str.match(/https?:\/\/[^\s"'<>]+/i) || str.match(/lumen(?:reader)?:\/\/[^\s"'<>]+/i);
			const urlStr = urlMatch ? urlMatch[0] : str;
			const u = new URL(urlStr, "https://lumenreader.app");
			id = u.searchParams.get("b") || u.searchParams.get("libro");
			if (!id && u.pathname.startsWith("/b/")) id = decodeURIComponent(u.pathname.slice(3));
			if (!id && u.hash) {
				const hm = u.hash.match(/[?&]b=([^&\s#]+)/i) || u.hash.match(/[?&]libro=([^&\s#]+)/i) || u.hash.match(/#libro=([^&\s#]+)/i);
				if (hm) id = decodeURIComponent(hm[1]);
			}
			tit = u.searchParams.get("t") || u.searchParams.get("tit") || "";
			aut = u.searchParams.get("a") || u.searchParams.get("aut") || "";
			file = u.searchParams.get("f") || u.searchParams.get("file") || "";
			cov = u.searchParams.get("c") || u.searchParams.get("cov") || "";
			mag = u.searchParams.get("m") || u.searchParams.get("mag") || "";
			aud = u.searchParams.get("aud") || u.searchParams.get("audio") || "";
			vid = u.searchParams.get("vid") || u.searchParams.get("video") || "";
			cat = u.searchParams.get("cat") || "";
			desc = u.searchParams.get("desc") || "";
		} catch {
			const mLib = str.match(/[?&](?:b|libro)=([^&\s#]+)/i);
			if (mLib) id = decodeURIComponent(mLib[1]);
			const mProto = str.match(/lumen(?:reader)?:\/\/b\/([^&\s#?]+)/i);
			if (mProto) id = decodeURIComponent(mProto[1]);
			const mTit = str.match(/[?&](?:t|tit)=([^&\s#]+)/i);
			if (mTit) tit = decodeURIComponent(mTit[1]);
			const mAut = str.match(/[?&](?:a|aut)=([^&\s#]+)/i);
			if (mAut) aut = decodeURIComponent(mAut[1]);
			const mFile = str.match(/[?&](?:f|file)=([^&\s#]+)/i);
			if (mFile) file = decodeURIComponent(mFile[1]);
			const mCov = str.match(/[?&](?:c|cov)=([^&\s#]+)/i);
			if (mCov) cov = decodeURIComponent(mCov[1]);
			const mMag = str.match(/[?&](?:m|mag)=([^&\s#]+)/i);
			if (mMag) mag = decodeURIComponent(mMag[1]);
			const mAud = str.match(/[?&](?:aud|audio)=([^&\s#]+)/i);
			if (mAud) aud = decodeURIComponent(mAud[1]);
			const mVid = str.match(/[?&](?:vid|video)=([^&\s#]+)/i);
			if (mVid) vid = decodeURIComponent(mVid[1]);
		}

		if (!id && str.startsWith("{") && str.endsWith("}")) {
			try {
				const obj = JSON.parse(str);
				if (obj.d || obj.id) {
					id = obj.d || obj.id;
					tit = obj.t || obj.titulo || "";
					aut = obj.a || obj.autor || "";
					file = obj.f || obj.fileUrl || "";
					mag = obj.m || obj.magnet || "";
					aud = obj.aud || obj.audioUrl || "";
					vid = obj.vid || obj.videoUrl || "";
				}
			} catch {}
		}

		if (!id && (file || mag || tit)) {
			id = "lumen_" + Math.random().toString(36).slice(2, 9);
		}

		if (!id && /^[a-z0-9_-]{10,80}$/i.test(str)) {
			id = str;
		}

		if (!id && !mag) return null;
		return { id: id || "mag_lib", tit, aut, file, cov, mag, aud, vid, cat, desc };
	};

	const extraerIdLibro = (texto) => {
		const d = extraerDatosLibroEnlace(texto);
		return d?.id || null;
	};

	const resolverYMostrarLibro = async (targetId, meta = null, autoAbrir = false) => {
		if (!targetId) return false;
		const target = typeof targetId === "object" ? (targetId.id || targetId.d) : String(targetId).trim();
		const metaDatos = typeof targetId === "object" ? targetId : meta;
		const aplicarLibro = (obj, msg) => {
			if (autoAbrir) {
				setDetalle(obj);
				if (msg) toast?.(msg);
			} else {
				setLibroSugerido(obj);
				setBusqVisible(true);
			}
			haptic.tap();
		};
		const pool = [...(libros || []), ...(misLibros || []), ...(librosFeed || [])];
		const enMemoria = pool.find(
			(b) => b.d === target || b.id === target || b.slug === target || (b.d && b.d.toLowerCase() === target.toLowerCase())
		);
		if (enMemoria) {
			aplicarLibro(enMemoria, "📖 Libro detectado: " + (enMemoria.titulo || enMemoria.title));
			return true;
		}
		try {
			const cat = JSON.parse(localStorage.getItem("lumen_catalogo") || "[]");
			const pubs = JSON.parse(localStorage.getItem("lumen_publicados") || "[]");
			const enStorage = [...cat, ...pubs.map(libroDePublicado)].find(
				(b) => b.d === target || b.id === target || b.slug === target
			);
			if (enStorage) {
				aplicarLibro(enStorage, "📖 Libro detectado: " + (enStorage.titulo || enStorage.title));
				return true;
			}
		} catch {}

		if (metaDatos && (metaDatos.tit || metaDatos.titulo || metaDatos.file || metaDatos.fileUrl || metaDatos.mag || metaDatos.magnet)) {
			const libroShared = {
				id: target,
				d: target,
				titulo: metaDatos.tit || metaDatos.titulo || (metaDatos.mag ? "Libro Torrent" : "Libro compartido"),
				autor: metaDatos.aut || metaDatos.autor || (metaDatos.mag ? "Red Torrent P2P" : "Autor Lumen"),
				fileUrl: metaDatos.file || metaDatos.fileUrl || "",
				portada: metaDatos.cov || metaDatos.portada || "",
				magnet: metaDatos.mag || metaDatos.magnet || "",
				audioUrl: metaDatos.aud || metaDatos.audioUrl || "",
				videoUrl: metaDatos.vid || metaDatos.videoUrl || "",
				categoria: metaDatos.cat || metaDatos.categoria || (metaDatos.mag ? "torrent" : "general"),
				descripcion: metaDatos.desc || metaDatos.descripcion || "",
				createdAt: Date.now(),
				esCompartido: true
			};
			setLibros((prev) => [libroShared, ...prev.filter((b) => b.d !== target && b.id !== target)]);
			aplicarLibro(libroShared, metaDatos.mag ? ("🧲 Enlace torrent detectado: " + libroShared.titulo) : ("📖 Libro detectado: " + libroShared.titulo));
			return true;
		} else {
			toast?.("🔎 Buscando libro en la red descentralizada…");
		}

		try {
			const relays = await relaysGuardados();
			const promesas = relays.map((url) => new Promise((resolve) => {
				const subId = "b-look-" + Math.random().toString(36).slice(2, 7);
				const filtros = [
					{ kinds: [30023, 30004], "#d": [target], limit: 1 },
					{ kinds: [30023, 30004], ids: [target], limit: 1 }
				];
				let timeout = setTimeout(() => resolve(null), 3500);
				conectarRelay(url, (ev, sId) => {
					if (sId === subId && ev && (ev.kind === 30023 || ev.kind === 30004)) {
						clearTimeout(timeout);
						resolve(libroDeEvento(ev));
					}
				});
				suscribir(url, subId, filtros);
			}));

			const resultados = await Promise.allSettled(promesas);
			const encontrado = resultados.map((r) => r.status === "fulfilled" ? r.value : null).find(Boolean);
			if (encontrado) {
				setLibros((prev) => [encontrado, ...prev.filter((b) => b.d !== encontrado.d && b.id !== encontrado.id)]);
				aplicarLibro(encontrado, "📖 Libro encontrado en la red: " + encontrado.titulo);
				return true;
			}
		} catch (e) {
			console.warn("[lookup error]", e);
		}

		if (metaDatos && (metaDatos.tit || metaDatos.titulo)) return true;
		toast?.("No se encontró el libro con identificador: " + target);
		return false;
	};

	(0, import_react.useEffect)(() => {
		try {
			if (typeof window !== "undefined") {
				const params = new URLSearchParams(window.location.search);
				const p = params.get("b") || params.get("libro");
				if (p) {
					try {
						const urlLimpia = window.location.pathname + (window.location.hash ? window.location.hash.split("?")[0] : "");
						window.history.replaceState({}, document.title, urlLimpia);
					} catch {}
					resolverYMostrarLibro(p, {
						id: p,
						tit: params.get("t") || params.get("tit") || "",
						aut: params.get("a") || params.get("aut") || "",
						file: params.get("f") || params.get("file") || "",
						cov: params.get("c") || params.get("cov") || "",
						mag: params.get("m") || params.get("mag") || "",
						cat: params.get("cat") || "",
						desc: params.get("desc") || ""
					}, false);
				} else if (window.location.hash) {
					const parsed = extraerDatosLibroEnlace(window.location.hash);
					if (parsed?.id) resolverYMostrarLibro(parsed.id, parsed, false);
				}
			}
		} catch {}

		const onPubCambio = async () => {
			try {
				const mios = await listarPublicados();
				setMisLibros(mios.map(libroDePublicado));
			} catch {}
		};
		window.addEventListener("lumen:publicado", onPubCambio);
		window.addEventListener("lumen:borrado", onPubCambio);
		return () => {
			window.removeEventListener("lumen:publicado", onPubCambio);
			window.removeEventListener("lumen:borrado", onPubCambio);
		};
	}, []);

	const confirmarEliminar = async (libro) => {
		if (!libro) return;
		const nombre = libro.titulo || libro.title || "este libro";
		if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente «${nombre}» de tus libros?`)) return;
		try {
			setMisLibros((prev) => prev.filter((b) => (b.d ? b.d !== libro.d : b.id !== libro.id)));
			setLibros((prev) => prev.filter((b) => (b.d ? b.d !== libro.d : b.id !== libro.id)));
			if (detalle?.d === libro.d || detalle?.id === libro.id) {
				setDetalle(null);
			}
			if (libro.d || libro.id) {
				const idTarget = libro.d || libro.id;
				await borrarPublicadoLocal(idTarget);
				await borrarBlobLumen(idTarget);
			}
			try {
				const cat = JSON.parse(localStorage.getItem("lumen_catalogo") || "[]");
				const filtrado = cat.filter((b) => (libro.d ? b.d !== libro.d : b.id !== libro.id));
				localStorage.setItem("lumen_catalogo", JSON.stringify(filtrado));
			} catch {}
			try {
				const pubs = JSON.parse(localStorage.getItem("lumen_publicados") || "[]");
				const filtradoPubs = pubs.filter((b) => (libro.d ? b.d !== libro.d : b.id !== libro.id));
				localStorage.setItem("lumen_publicados", JSON.stringify(filtradoPubs));
			} catch {}
			const id = identidad || (await identidadGuardada());
			if (id && (libro.evento?.id || libro.id)) {
				try {
					const tags = [["e", libro.evento?.id || libro.id]];
					if (libro.d) tags.push(["a", `30023:${id.pubHex}:${libro.d}`]);
					const ev = firmarEvento(crearEvento({
						pubkey: id.pubHex,
						kind: 5,
						tags,
						content: "Borrado por el autor desde Lumen Store"
					}), id.privHex);
					await publicarEnRelays(ev);
				} catch (errRelay) {
					console.warn("[borrado relays]", errRelay);
				}
			}
			haptic.tap();
			toast?.("🗑 Libro eliminado definitivamente de Mis libros");
		} catch (e) {
			toast?.("Error al eliminar libro: " + (e?.message || e));
		}
	};

const cargar = (0, import_react.useCallback)(async () => {
		setEstado("cargando");
		setRelaysActivos(0);
		try {
			const pref = await getMeta("catalogo_filtros", null);
			if (pref && typeof pref.ocultarAdultos === "boolean") setOcultarAdultos(pref.ocultarAdultos);
			if (pref && typeof pref.filtroIdioma === "string") setFiltroIdioma(pref.filtroIdioma);
			if (pref && pref.bibliotecas && typeof pref.bibliotecas === "object") setBibActivas({ ...BIB_DEFECTO, ...pref.bibliotecas });
		} catch {}
		const id = await identidadGuardada();
		setIdentidad(id);
		try {
			const mios = await listarPublicados();
			setMisLibros(mios.map(libroDePublicado));
		} catch {}
		try {
			const [c, rep] = await Promise.all([
				import("./nostr-zC6Qsl2z.js").then((m) => m.catalogoGuardado()),
				import("./nostr-zC6Qsl2z.js").then((m) => m.reportesGuardados())
			]);
			setLibros(c || []);
			setReportes(rep || []);
		} catch {}
		setEstado("listo");

		// Actualización en segundo plano sin bloquear la apertura de la tienda
		(async () => {
			try {
				const fs = await cargarFeeds();
				setFeeds(fs);
				if (fs && fs.length > 0) {
					const libros = [];
					for (const f of fs) try {
						const r = await fetch(f.url, { signal: AbortSignal.timeout(3000) });
						if (r.ok) libros.push(...parsearFeed(await r.json()));
					} catch {}
					if (libros.length > 0) setLibrosFeed(libros);
				}
			} catch {}
			try {
				setListaRelays(await relaysGuardados());
			} catch {}
			try {
				await refrescarCatalogo({ onEstado: (est, url) => {
					if (url) setRelaysInfo((prev) => prev[url] === "abierto" && est === "eose" ? prev : {
						...prev,
						[url]: est === "eose" ? prev[url] || "abierto" : est
					});
					if (est === "abierto") setRelaysActivos((n) => n + 1);
				} });
				const cActualizado = await import("./nostr-zC6Qsl2z.js").then((m) => m.catalogoGuardado());
				if (cActualizado?.length) setLibros(cActualizado);
			} catch {}
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		cargar();
		return () => {
			import("./nostr-zC6Qsl2z.js").then((m) => m.cierre()).catch(() => {});
		};
	}, [cargar]);
	// v200: la store es UNA sola superficie: mientras está abierta se
	// bloquea el scroll de la página (la barra vertical es la de cg-cuerpo;
	// cabecera y pie quedan fijos).
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);
	// v200: extraer el texto de una URL desde la barra de la cabecera
	// (misma lógica que el antiguo «Página web» de Importar).
	const importarPaginaWeb = async () => {
		const u = lgUrlWeb.trim();
		if (!u || lgUrlBusy) return;
		setLgUrlBusy(true);
		setLgUrlPaso("Conectando…");
		try {
			const { titulo, texto } = await importarDesdeUrl(u, (pct, txt) => setLgUrlPaso(txt || pct + "%"));
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
			await putPages(paginas.map((t, i2) => ({
				bookId: id,
				index: i2,
				text: t,
				needsOcr: false,
				ocrDone: false,
				source: "web"
			})));
			setLgUrlWeb("");
			setLgUrlAbierto(false);
			toast?.("✓ «" + titulo.slice(0, 28) + "» importado desde la web");
			onAbrirLibroLocal?.(id);
		} catch (e) {
			toast?.(e?.message || "No se pudo importar esa página");
		} finally {
			setLgUrlBusy(false);
			setLgUrlPaso("");
		}
	};
	// v208: activar/desactivar una biblioteca → catálogo y búsqueda se actualizan al momento
	const alternarBib = (id) => {
		const next = { ...BIB_DEFECTO, ...(bibActivas || {}), [id]: !(bibActivas ? bibActivas[id] !== false : true) };
		setBibActivas(next);
		try { setMeta({ id: "catalogo_filtros", ocultarAdultos, bibliotecas: next }); } catch {}
	};
	const reportar = async (libro, motivo) => {
		if (!identidad) {
			toast("Primero crea tu identidad: 📤 Publicar → «Crear identidad»");
			return;
		}
		setPublicandoReporte(true);
		try {
			const ok = (await publicarEnRelays(eventoReporte({
				identidad,
				libroId: libro.id,
				motivo
			}))).filter((r) => r.ok).length;
			toast(ok ? `Reporte enviado a ${ok} relay(s). Con 3 reportes el libro pasa a revisión.` : "No se pudo enviar el reporte (sin conexión con relays)");
			setReporteAbierto(false);
			setDetalle(null);
		} catch (e) {
			toast("Error al reportar: " + (e?.message || e));
		} finally {
			setPublicandoReporte(false);
		}
	};
	const construirEnlaceWebLibro = (libro) => {
		if (!libro) return "";
		const idLibro = libro.d || libro.id || "";
		const baseUrl = (typeof window !== "undefined" && window.location?.href)
			? window.location.href.split("?")[0].split("#")[0]
			: "https://lumenreader.app/";
		const params = new URLSearchParams();
		if (idLibro) params.set("b", idLibro);
		const titulo = (libro.titulo || libro.title || "").trim();
		if (titulo) params.set("t", titulo);
		const autor = (libro.autor || (Array.isArray(libro.authors) ? libro.authors[0] : libro.authors) || "").trim();
		if (autor && autor !== "Anon" && autor !== "Autor anónimo") params.set("a", autor);
		const file = (libro.fileUrl || libro.file || libro.download || libro.epub || "").trim();
		if (file && /^https?:\/\//i.test(file)) params.set("f", file);
		const portada = (libro.portada || "").trim();
		if (portada && /^https?:\/\//i.test(portada)) params.set("c", portada);
		const magnet = (libro.magnet || "").trim();
		if (magnet) params.set("m", magnet);
		const audio = (libro.audioUrl || libro.audio || "").trim();
		if (audio && /^https?:\/\//i.test(audio)) params.set("aud", audio);
		const video = (libro.videoUrl || libro.video || "").trim();
		if (video && /^https?:\/\//i.test(video)) params.set("vid", video);
		const desc = (libro.descripcion || libro.synopsis || "").trim();
		if (desc) params.set("desc", desc.slice(0, 260));
		const cat = (libro.categoria || "").trim();
		if (cat) params.set("cat", cat);
		return `${baseUrl}?${params.toString()}`;
	};

	const copiarAlPortapapeles = async (texto) => {
		if (navigator?.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(texto);
				return true;
			} catch {}
		}
		try {
			const el = document.createElement("textarea");
			el.value = texto;
			el.style.position = "fixed";
			el.style.opacity = "0";
			document.body.appendChild(el);
			el.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(el);
			return ok;
		} catch {
			return false;
		}
	};

	const compartirLibro = async (libro) => {
		try {
			const enlaceWeb = construirEnlaceWebLibro(libro);
			const titulo = libro.titulo || libro.title || "Libro en Lumen";
			if (window.AndroidShare?.shareText) {
				window.AndroidShare.shareText(titulo, enlaceWeb);
				haptic.tap();
				return;
			}
			if (navigator.share) {
				try {
					await navigator.share({
						title: titulo,
						url: enlaceWeb
					});
					return;
				} catch (err) {
					if (err.name === "AbortError") return;
				}
			}
			await copiarAlPortapapeles(enlaceWeb);
			toast?.("📋 Link sencillo copiado al portapapeles");
			haptic.tap();
		} catch (e) {
			toast?.("No se pudo compartir: " + (e?.message || e));
		}
	};

	const copiarLinkLumen = async (libro) => {
		try {
			const enlaceWeb = construirEnlaceWebLibro(libro);
			await copiarAlPortapapeles(enlaceWeb);
			toast?.("📋 Enlace de Lumen copiado. ¡Ábrelo en cualquier dispositivo para ver el libro!");
			haptic.tap();
		} catch (e) {
			toast?.("No se pudo copiar el enlace: " + (e?.message || e));
		}
	};

	const esContenidoAdulto = (b) => {
		if (!b) return false;
		const r = String(b.rating || "").toLowerCase().trim();
		if (r === "adulto" || r === "adult" || r === "nsfw" || r === "18+" || r === "nc-17" || r === "r" || r === "mature") return true;
		if (b.evento?.tags && Array.isArray(b.evento.tags)) {
			for (const t of b.evento.tags) {
				if (!Array.isArray(t) || !t[0]) continue;
				const tagNom = String(t[0]).toLowerCase();
				const tagVal = String(t[1] || "").toLowerCase();
				if (tagNom === "content-warning") return true;
				if (tagNom === "rating" && (tagVal === "adulto" || tagVal === "adult" || tagVal === "nsfw" || tagVal === "18+" || tagVal === "r" || tagVal === "nc-17" || tagVal === "mature")) return true;
				if (tagNom === "nsfw" && tagVal !== "false" && tagVal !== "0") return true;
				if (tagNom === "adult" && tagVal !== "false" && tagVal !== "0") return true;
				if (tagNom === "t" && /^(adulto|adult|nsfw|erotica|erotico|erótica|erótico|porno|porn|xxx|hentai|18\+|gore|sexo|nude)$/i.test(tagVal)) return true;
			}
		}
		const cat = String(b.categoria || "").toLowerCase();
		if (/adulto|nsfw|erotica|erótica|erotico|erótico|porno|porn|xxx|hentai|18\+|gore/i.test(cat)) return true;
		if (Array.isArray(b.etiquetas)) {
			for (const etq of b.etiquetas) {
				if (/adulto|adult|nsfw|erotica|erotico|erótica|erótico|porno|porn|xxx|hentai|18\+|gore|sexo/i.test(String(etq))) return true;
			}
		}
		const txtMeta = `${b.titulo || ""} ${b.descripcion || ""} ${b.moderacion || ""}`.toLowerCase();
		if (/\b(nsfw|xxx|porno|pornografía|pornografia|hentai|erotismo explícito|gore extremo)\b/i.test(txtMeta)) return true;
		return false;
	};

	const delRelay = buscarLibros(filtrarLibros(libros, { categoria }), lgQ).filter((b) => !ocultarAdultos || !esContenidoAdulto(b));
	const miosFiltrados = buscarLibros(misLibros, lgQ).filter((b) => !categoria || b.categoria === categoria).filter((b) => !ocultarAdultos || !esContenidoAdulto(b));
	const idsRelay = new Set(delRelay.map((b) => b.d));
	const feedsFiltrados = buscarLibros(librosFeed, lgQ).filter((b) => !categoria || b.categoria === categoria).filter((b) => !ocultarAdultos || !esContenidoAdulto(b));
	const visibles = [
		...miosFiltrados.filter((b) => !idsRelay.has(b.d) && !feedsFiltrados.some((f) => f.d === b.d)),
		...feedsFiltrados,
		...delRelay
	].filter((b) => matchesIdioma(b, filtroIdioma));
	const recientes = [...visibles].sort((a, b) => b.createdAt - a.createdAt);
	// v208: la sección de Libros Gratis se pinta ANTES que los resultados de la
	// store cuando hay búsqueda (las bibliotecas primero, con sus portadas)
	const lgSeccion = LGComp ? (0, import_jsx_runtime.jsx)(LGComp, {
		modo: "seccion",
		busqueda: lgQ,
		temaExterno: MAPA_TEMA_LG[categoria] || "all",
		toast,
		onAbrirLibro: (id) => {
			onAbrirLibroLocal?.(id);
		},
		onVentana: setLgVentana,
		onBuscarWeb: onBuscarWeb,
		bibliotecas: bibActivas
	}) : null;
	const buscandoStore = lgQ.trim().length >= 2;
	const destacado = recientes.find((b) => !ocultarAdultos || !esContenidoAdulto(b)) || (ocultarAdultos ? null : recientes[0]);

	const normalizarLibroGenerico = (b, catDef = "general") => {
		if (!b) return null;
		const tit = aTextoPlano(b.titulo || b.title).trim() || "Libro";
		let aut = aTextoPlano(b.autor || (Array.isArray(b.authors) ? b.authors.map((a) => typeof a === "string" ? a : (a?.name || "")).filter(Boolean).join(", ") : b.authors)).trim();
		if (!aut) aut = "Autor";
		const dl = Number(b.downloads) || (b.rating ? Math.round((ratingDe(b).estrellas || 4.5) * 3200) : 1200);
		const cat = aTextoPlano(b.categoria || (b.bookshelves && b.bookshelves[0])) || catDef;
		const rawCov = b.portada || b.cover || null;
		const cov = (rawCov && rawCov !== "assets/icon-192.png") ? (typeof rawCov === "string" ? rawCov : null) : null;
		const desc = aTextoPlano(b.descripcion || b.synopsis || b.description).trim();
		return {
			id: b.id || b.bookId || ("gen-" + tit.toLowerCase().replace(/[^a-z0-9]/g, "")),
			d: b.d || b.id || ("gen-" + tit.toLowerCase().replace(/[^a-z0-9]/g, "")),
			titulo: tit,
			autor: aut,
			portada: cov,
			categoria: cat,
			downloads: dl,
			fuente: b.fuente || "gutenberg",
			epub: b.epub || null,
			fileUrl: b.fileUrl || b.epub || null,
			audioUrl: b.audioUrl || null,
			videoUrl: b.videoUrl || null,
			url: b.url || null,
			descripcion: desc,
			esMio: !!b.esMio,
			rating: b.rating
		};
	};

	// v251: Deduplicación estricta por título y autor para asegurar que en ninguna fila se repitan libros
	const normalizarParaComparar = (str) => {
		return aTextoPlano(str || "")
			.toLowerCase()
			.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	};

	const normalizarTituloClave = (tit) => {
		let norm = normalizarParaComparar(tit);
		return norm.replace(/^(el|la|los|las|un|una|unos|unas|the|a|an)\s+/i, "").trim();
	};

	const tokensAutorClave = (aut) => {
		const norm = normalizarParaComparar(aut);
		if (!norm || norm === "autor" || norm === "anon" || norm === "anonimo" || norm === "anonymous") return [];
		const stopwords = new Set(["de", "del", "la", "el", "los", "las", "y", "van", "von", "san", "santa", "da", "di", "desconocido", "desconocida", "anonimo", "anonima", "anon", "anonymous", "varios", "autor", "autores", "sin"]);
		return norm.split(" ").filter((w) => w.length >= 2 && !stopwords.has(w)).sort();
	};

	const cacheCategoriasRef = (0, import_react.useRef)(new Map());
	(0, import_react.useEffect)(() => {
		cacheCategoriasRef.current.clear();
	}, [libros, visibles.length, catPool, semillaPool, filtroIdioma, ocultarAdultos]);

	const prepLibroClaves = (b) => {
		if (!b || b._clvPrep) return b;
		b._titK = normalizarTituloClave(b.titulo || b.title || "");
		const rawAut = b.autor || (Array.isArray(b.authors) ? (typeof b.authors[0] === "string" ? b.authors[0] : b.authors[0]?.name) : b.authors) || b.author || "";
		b._autToks = tokensAutorClave(rawAut);
		b._claveExacta = b._titK + ":::" + b._autToks.join("_");
		b._clvPrep = true;
		return b;
	};

	const sonMismoLibroFila = (b1, b2) => {
		if (!b1 || !b2) return false;
		if (b1 === b2) return true;
		if (b1.id && b2.id && b1.id === b2.id) return true;
		prepLibroClaves(b1);
		prepLibroClaves(b2);
		const t1 = b1._titK;
		const t2 = b2._titK;
		if (!t1 || !t2) return false;

		let titulosSimilares = false;
		if (t1 === t2) {
			titulosSimilares = true;
		} else if (Math.min(t1.length, t2.length) >= 5) {
			if (t1.startsWith(t2) || t2.startsWith(t1) || t1.includes(t2) || t2.includes(t1)) {
				titulosSimilares = true;
			}
		}
		if (!titulosSimilares) return false;

		const autToks1 = b1._autToks;
		const autToks2 = b2._autToks;
		if (autToks1.length === 0 || autToks2.length === 0) {
			return true;
		}
		return autToks1.some((t) => autToks2.includes(t));
	};

	const desduplicarFila = (listaLibros) => {
		if (!Array.isArray(listaLibros)) return [];
		const resultado = [];
		const seenExact = new Set();
		const prefixBuckets = new Map();

		for (const b of listaLibros) {
			if (!b) continue;
			prepLibroClaves(b);
			if (seenExact.has(b._claveExacta)) continue;

			const pfx = b._titK.slice(0, 4);
			const bucket = prefixBuckets.get(pfx);
			let repetido = false;
			if (bucket) {
				for (let i = 0; i < bucket.length; i++) {
					if (sonMismoLibroFila(bucket[i], b)) {
						repetido = true;
						break;
					}
				}
			}
			if (!repetido) {
				seenExact.add(b._claveExacta);
				if (!bucket) prefixBuckets.set(pfx, [b]);
				else bucket.push(b);
				resultado.push(b);
			}
		}
		return resultado;
	};

	const obtenerLibrosDeCategoria = (catId) => {
		const cNorm = (catId || "").toLowerCase();
		const cacheKey = cNorm + "::" + filtroIdioma;
		if (cacheCategoriasRef.current.has(cacheKey)) {
			return cacheCategoriasRef.current.get(cacheKey);
		}

		const seenExact = new Set();
		const prefixBuckets = new Map();
		const resultado = [];

		const agregarSiNoExiste = (n) => {
			if (!n) return;
			prepLibroClaves(n);
			if (seenExact.has(n._claveExacta)) return;

			const pfx = n._titK.slice(0, 4);
			const bucket = prefixBuckets.get(pfx);
			let repetido = false;
			if (bucket) {
				for (let i = 0; i < bucket.length; i++) {
					if (sonMismoLibroFila(bucket[i], n)) {
						repetido = true;
						break;
					}
				}
			}
			if (!repetido) {
				seenExact.add(n._claveExacta);
				if (!bucket) prefixBuckets.set(pfx, [n]);
				else bucket.push(n);
				resultado.push(n);
			}
		};

		// Curated pool for manga
		if (cNorm === "manga" || cNorm === "mangas" || cNorm === "manhwa" || cNorm === "manhua") {
			for (const b of LIBROS_MANGA_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "manga");
				agregarSiNoExiste(n);
			}
		}

		// Curated pool for biblias
		if (cNorm === "biblias" || cNorm === "biblia") {
			for (const b of LIBROS_BIBLIAS_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "biblias");
				agregarSiNoExiste(n);
			}
		}

		// Curated pool for romance
		if (cNorm === "romance") {
			for (const b of LIBROS_ROMANCE_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "romance");
				agregarSiNoExiste(n);
			}
		}

		// Curated pool for musica
		if (cNorm === "música" || cNorm === "musica") {
			for (const b of LIBROS_MUSICA_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "música");
				agregarSiNoExiste(n);
			}
		}

		// Curated pool for religion
		if (cNorm === "religion" || cNorm === "religión") {
			for (const b of LIBROS_RELIGION_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "religion");
				agregarSiNoExiste(n);
			}
		}

		for (const b of visibles) {
			if (!matchesIdioma(b, filtroIdioma)) continue;
			const bCat = (b.categoria || "").toLowerCase();
			if (cNorm === "__populares__" || cNorm === "__recientes__" || bCat === cNorm || (cNorm === "biblias" && (bCat === "biblias" || /biblia|evangelio|testamento|salmos|proverbios/i.test(b.titulo))) || (cNorm === "romance" && (bCat === "romance" || /amor|romanc|enamor|coraz|pasion|amante|casamiento/i.test(b.titulo))) || (cNorm === "manga" && (bCat === "manga" || /manga|manhwa|manhua|shonen|seinen|shojo|anime/i.test(b.titulo + " " + (b.categoria || "")))) || (cNorm === "politica" && (bCat === "politica" || bCat === "política" || /polit|gobiern|rebel|estado|guerra|republic/i.test(b.titulo))) || ((cNorm === "religion" || cNorm === "religión") && (bCat === "religion" || bCat === "religión" || /relig|espirit|dios|biblia|fe|santo|budis|teolog/i.test(b.titulo))) || ((cNorm === "música" || cNorm === "musica") && (bCat === "música" || bCat === "musica" || /músic|music|ópera|opera|sinfon|orquest|canto|piano|viol/i.test(b.titulo)))) {
				const n = normalizarLibroGenerico(b, catId);
				agregarSiNoExiste(n);
			}
		}

		for (const b of LIBROS_TOP_DESCARGAS) {
			if (!matchesIdioma(b, filtroIdioma)) continue;
			const bCat = (b.categoria || "").toLowerCase();
			if (cNorm === "__populares__" || cNorm === "__recientes__" || bCat === cNorm || (cNorm === "biblias" && (bCat === "biblias" || /biblia|evangelio|testamento|salmos|proverbios/i.test(b.titulo))) || (cNorm === "romance" && (bCat === "romance" || /amor|romanc|enamor|coraz|pasion|amante|casamiento/i.test(b.titulo))) || (cNorm === "manga" && (bCat === "manga" || /manga|manhwa|manhua|shonen|seinen|shojo|anime/i.test(b.titulo + " " + (b.categoria || "")))) || (cNorm === "politica" && (bCat === "politica" || /polit|gobiern|rebel|estado|guerra|republic|principe|contrato|manifiesto|riqueza|democracia/i.test(b.titulo))) || ((cNorm === "religion" || cNorm === "religión") && (bCat === "religion" || bCat === "religión" || /relig|espirit|dios|biblia|fe|santo|budis|teolog/i.test(b.titulo))) || ((cNorm === "música" || cNorm === "musica") && (bCat === "música" || bCat === "musica" || /músic|music|ópera|opera|sinfon|orquest|canto|piano|viol/i.test(b.titulo)))) {
				const n = normalizarLibroGenerico(b, catId);
				agregarSiNoExiste(n);
			}
		}

		if (catPool) {
			const claveCat = MAPA_TEMA_LG[catId];
			if (claveCat && catPool[claveCat]) {
				for (const b of catPool[claveCat]) {
					if (!matchesIdioma(b, filtroIdioma)) continue;
					const n = normalizarLibroGenerico(b, catId);
					agregarSiNoExiste(n);
				}
			} else if (cNorm === "__populares__" || cNorm === "__recientes__") {
				for (const bks of Object.values(catPool)) {
					if (Array.isArray(bks)) {
						for (const b of bks) {
							if (!matchesIdioma(b, filtroIdioma)) continue;
							const n = normalizarLibroGenerico(b, "general");
							agregarSiNoExiste(n);
						}
					}
				}
			}
		}

		if (semillaPool && (cNorm === "__populares__" || cNorm === "__recientes__")) {
			for (const b of semillaPool) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "general");
				agregarSiNoExiste(n);
			}
		}

		cacheCategoriasRef.current.set(cacheKey, resultado);
		return resultado;
	};

	// Lumen v249: Búsqueda federada por Autor y Título en tiempo real
	const qLimpia = aTextoPlano(lgQ).trim().toLowerCase();
	const qTokens = qLimpia.split(/\s+/).filter((t) => t.length >= 2);

	const seenSearch = new Set();
	const librosCoincidentes = [];
	if (qLimpia.length >= 2) {
		const todosLibrosLocales = [
			...visibles,
			...LIBROS_TOP_DESCARGAS,
			...LIBROS_MANGA_CURADOS,
			...LIBROS_BIBLIAS_CURADOS,
			...LIBROS_ROMANCE_CURADOS,
			...LIBROS_MUSICA_CURADOS,
			...LIBROS_RELIGION_CURADOS,
			...(semillaPool || [])
		];
		if (catPool) {
			for (const k in catPool) {
				if (Array.isArray(catPool[k])) todosLibrosLocales.push(...catPool[k]);
			}
		}
		for (const b of [...todosLibrosLocales, ...resultadosRemotos]) {
			if (!b) continue;
			if (!matchesIdioma(b, filtroIdioma)) continue;
			const n = normalizarLibroGenerico(b, b.categoria || "general");
			if (!n) continue;
			const tit = aTextoPlano(n.titulo).toLowerCase();
			const aut = aTextoPlano(n.autor).toLowerCase();
			const des = aTextoPlano(n.descripcion).toLowerCase();
			const key = (tit + "|" + aut);
			if (seenSearch.has(key)) continue;

			const coincide = qTokens.length === 0 || qTokens.every((tok) => tit.includes(tok) || aut.includes(tok) || des.includes(tok))
				|| tit.includes(qLimpia) || aut.includes(qLimpia);
			if (coincide) {
				seenSearch.add(key);
				librosCoincidentes.push(n);
			}
		}
	}

	let autorDetectado = null;
	const librosDelAutor = [];
	const otrosResultados = [];

	if (qTokens.length > 0) {
		const autoresFrecuencia = {};
		for (const b of librosCoincidentes) {
			const a = aTextoPlano(b.autor).trim();
			if (a && a !== "Anon" && a !== "Autor anónimo" && a !== "Autor") {
				const aNorm = a.toLowerCase();
				if (qTokens.some((tok) => aNorm.includes(tok))) {
					autoresFrecuencia[a] = (autoresFrecuencia[a] || 0) + 1;
				}
			}
		}
		const ordenados = Object.entries(autoresFrecuencia).sort((x, y) => y[1] - x[1]);
		if (ordenados.length > 0) {
			autorDetectado = ordenados[0][0];
			const autNorm = aTextoPlano(autorDetectado).toLowerCase();
			for (const b of librosCoincidentes) {
				const bAut = aTextoPlano(b.autor).toLowerCase();
				if (bAut.includes(autNorm) || autNorm.includes(bAut)) {
					librosDelAutor.push(b);
				} else {
					otrosResultados.push(b);
				}
			}
		} else {
			otrosResultados.push(...librosCoincidentes);
		}
	} else {
		otrosResultados.push(...librosCoincidentes);
	}

	const listaPopulares = obtenerLibrosDeCategoria("__populares__").slice().sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

	const listaRecientes = desduplicarFila([
		...visibles.map((b) => normalizarLibroGenerico(b, "lumen")),
		...obtenerLibrosDeCategoria("__recientes__").filter((b) => !visibles.some((v) => (v.titulo || v.title) === b.titulo))
	]);

	const pagActual = obtenerPagina(categoria || "__todas__");
	const librosPantallaPop = listaPopulares.slice(0, pagActual * 40);
	const librosPantallaRec = listaRecientes.slice(0, pagActual * 40);

	const poolCategoriaActual = categoria && categoria !== "__populares__" && categoria !== "__recientes__" && categoria !== "__mis_libros__"
		? obtenerLibrosDeCategoria(categoria)
		: [];
	const inicioPaginacionCat = (pagActual - 1) * 40;
	const librosPantallaCat = poolCategoriaActual.slice(inicioPaginacionCat, inicioPaginacionCat + 40);
	const top10Categoria = [...librosPantallaCat].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 10);
	const categorias = categoriasDe(libros);

	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cg-scrim",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg cg-play",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "cg-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-head-row",
								children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "cg-back",
								onClick: () => onSalir?.(),
								"aria-label": "Volver",
								children: "‹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-titulo-ico", children: "📚" }), " ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-titulo-txt", children: "Lumen Store" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Libros de toda la red · sin servidor central" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-acciones",
								children: [/* v218 (#3b): lupa que despliega/oculta la búsqueda */ (0, import_jsx_runtime.jsx)("button", {
									className: "cg-lupa" + (busqVisible ? " on" : ""),
									"aria-label": busqVisible ? "Ocultar búsqueda" : "Buscar",
									"aria-pressed": busqVisible,
									title: "Buscar",
									onClick: () => { haptic.tap(); setBusqVisible((v) => !v); },
									children: "🔍"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "cg-mis-pubs" + (categoria === "__mis_libros__" ? " on" : ""),
									title: "Ver mis libros publicados",
									onClick: () => {
										haptic.tap();
										setCategoria((c) => c === "__mis_libros__" ? "" : "__mis_libros__");
									},
									children: ["📚 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-pub-txt", children: "Mis libros" })]
								}), (0, import_jsx_runtime.jsx)("button", {
									className: "cg-publicar",
									onClick: () => {
										haptic.tap();
										onPublicar?.({ modo: "nuevo" });
									},
									children: ["＋ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-pub-txt", children: "Publicar" })]
								})]
							})
							]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-busq" + (busqVisible ? "" : " oculta"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-busq-campo",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "plain cg-busq-input",
												placeholder: lgUrlAbierto ? "Pega un enlace web (https://...) para extraer…" : "Buscar en la store y bibliotecas (sugiere mientras escribes)…",
												ref: busqInputRef,
												value: lgUrlAbierto ? lgUrlWeb : lgQ,
												onFocus: () => {
													if (!lgUrlAbierto) {
														if (libroSugerido) {
															const tit = libroSugerido.titulo || libroSugerido.title || "Libro";
															const itemSug = {
																texto: tit,
																sub: (libroSugerido.autor || libroSugerido.author || "Enlace o libro sugerido"),
																origen: "💡 Sugerencia",
																icono: "💡",
																esSugerido: true,
																libroObj: libroSugerido
															};
															setSugerencias([
																itemSug,
																...busquedasRecientes.map((r) => ({
																	texto: r,
																	sub: "Búsqueda reciente",
																	origen: "Historial",
																	icono: "🕒",
																	reciente: true
																}))
															]);
															setSugVisible(true);
														} else if ((lgQ || "").trim().length >= 2 && sugerencias.length > 0) setSugVisible(true);
														else if (!(lgQ || "").trim() && busquedasRecientes.length > 0) {
															setSugerencias([
																{ esHeaderRecientes: true },
																...busquedasRecientes.map((r) => ({
																	texto: r,
																	sub: "Búsqueda reciente",
																	origen: "Historial",
																	icono: "🕒",
																	reciente: true
																}))
															]);
															setSugVisible(true);
														}
													}
												},
												onBlur: () => {
													setTimeout(() => setSugVisible(false), 260);
												},
												onChange: (e) => {
													const val = e.target.value;
													if (lgUrlAbierto) setLgUrlWeb(val);
													else {
														const parsed = extraerDatosLibroEnlace(val);
														if (parsed?.id || parsed?.mag) {
															setLgQ("");
															setSugVisible(false);
															resolverYMostrarLibro(parsed.id || parsed.mag, parsed);
															return;
														}
														setLgQ(val);
														if (val.trim() && categoria !== "") {
															setCategoria("");
														}
														if (/^https?:\/\//i.test(val.trim()) && !val.includes("libro=") && !val.includes("?b=") && !val.includes("&b=")) setLgUrlWeb(val.trim());
													}
												},
												onPaste: (e) => {
													if (!lgUrlAbierto) {
														const texto = e.clipboardData?.getData("text") || "";
														const parsed = extraerDatosLibroEnlace(texto);
														if (parsed?.id || parsed?.mag) {
															e.preventDefault();
															setLgQ("");
															setSugVisible(false);
															resolverYMostrarLibro(parsed.id || parsed.mag, parsed);
															return;
														}
													}
												},
												onKeyDown: (e) => {
													if (sugVisible && sugerencias.length > 0) {
														if (e.key === "ArrowDown") {
															e.preventDefault();
															setSugIdx((prev) => Math.min(prev + 1, sugerencias.length - 1));
															return;
														}
														if (e.key === "ArrowUp") {
															e.preventDefault();
															setSugIdx((prev) => Math.max(prev - 1, -1));
															return;
														}
														if (e.key === "Escape") {
															setSugVisible(false);
															return;
														}
														if (e.key === "Enter" && sugIdx >= 0 && sugerencias[sugIdx]) {
															e.preventDefault();
															const sPick = sugerencias[sugIdx];
															if (sPick.web) {
																onBuscarWeb?.(lgQ.trim());
																guardarBusquedaReciente(lgQ.trim());
															} else if (!sPick.esHeaderRecientes) {
																setLgQ(sPick.texto);
																setCategoria("");
																guardarBusquedaReciente(sPick.texto);
															}
															setSugVisible(false);
															return;
														}
													}
													if (e.key === "Enter") {
														setSugVisible(false);
														const qTrim = (lgQ || "").trim();
														if (qTrim) guardarBusquedaReciente(qTrim);
														const parsed = extraerDatosLibroEnlace(lgQ);
														if (parsed?.id) {
															e.preventDefault();
															setLgQ("");
															resolverYMostrarLibro(parsed.id, parsed);
															return;
														}
														if (lgUrlAbierto || /^https?:\/\//i.test((lgQ || "").trim())) {
															if (!lgUrlWeb.trim() && /^https?:\/\//i.test((lgQ || "").trim())) setLgUrlWeb(lgQ.trim());
															importarPaginaWeb();
														}
													}
												}
											}),
											(lgUrlAbierto ? lgUrlWeb : lgQ) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "cg-busq-x",
												onClick: () => {
													if (lgUrlAbierto) setLgUrlWeb("");
													else {
														setLgQ("");
														setSugerencias([]);
														setSugVisible(false);
													}
												},
												"aria-label": "Limpiar búsqueda",
												children: "✕"
											}),
											sugVisible && sugerencias.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cg-sugerencias",
												role: "listbox",
												children: sugerencias.map((s, idx) => s.esHeaderRecientes ? (
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "cg-sug-header",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🕒 Búsquedas recientes" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																className: "cg-sug-limpiar",
																type: "button",
																onMouseDown: (e) => {
																	e.preventDefault();
																	limpiarBusquedasRecientes(e);
																	setSugerencias([]);
																	setSugVisible(false);
																},
																children: "Limpiar"
															})
														]
													}, "header-recientes")
												) : (
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "cg-sug-item" + (idx === sugIdx ? " active" : ""),
														onMouseDown: (e) => {
															e.preventDefault();
															if (s.esSugerido && s.libroObj) {
																setLgQ(s.texto);
																setDetalle(s.libroObj);
																setLibroSugerido(null);
															} else if (s.web) onBuscarWeb?.(lgQ.trim());
															else {
																setLgQ(s.texto);
																setCategoria("");
																guardarBusquedaReciente(s.texto);
															}
															setSugVisible(false);
														},
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-sug-icono", children: s.icono }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "cg-sug-cuerpo",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-sug-texto", children: s.texto }),
																	s.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-sug-sub", children: s.sub })
																]
															}),
															s.reciente ? (
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	className: "cg-sug-del",
																	type: "button",
																	title: "Eliminar de recientes",
																	onMouseDown: (e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		eliminarBusquedaReciente(s.texto, e);
																	},
																	children: "✕"
																})
															) : (
																s.origen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-sug-origen", children: s.origen })
															)
														]
													}, s.texto + "-" + idx)
												))
											})
										]
									}),
									(lgUrlAbierto || /^https?:\/\//i.test((lgQ || "").trim())) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn sm primary cg-busq-extraer-btn",
										disabled: lgUrlBusy || !(lgUrlAbierto ? lgUrlWeb.trim() : lgQ.trim()),
										onClick: () => {
											if (!lgUrlWeb.trim() && /^https?:\/\//i.test((lgQ || "").trim())) setLgUrlWeb(lgQ.trim());
											importarPaginaWeb();
										},
										title: "Extraer artículo o texto web",
										children: lgUrlBusy ? (lgUrlPaso || "…") : "Extraer"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-busq-btn",
										title: "Buscar en la web (Anna's Archive, Gutenberg, Archive y más)",
										"aria-label": "Buscar en la web",
										onClick: () => onBuscarWeb?.(lgQ.trim()),
										children: "🌐"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-busq-btn",
										title: "📷 Escanear código QR de Lumen",
										"aria-label": "Escanear QR",
										onClick: () => setEscanerAbierto(true),
										children: "📷"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-busq-btn" + (lgUrlAbierto ? " on" : ""),
										title: lgUrlAbierto ? "Modo búsqueda de libros" : "Modo extraer enlace web (URL)",
										"aria-label": "Página web",
										onClick: () => {
											const sig = !lgUrlAbierto;
											setLgUrlAbierto(sig);
											if (sig && /^https?:\/\//i.test((lgQ || "").trim())) setLgUrlWeb(lgQ.trim());
											setTimeout(() => busqInputRef.current?.focus(), 50);
										},
										children: "🔗"
									})
								]
							}),
							busqVisible && libroSugerido && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-sugerencia-enlace-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "cg-chip-sugerencia",
										onClick: () => {
											const tit = libroSugerido.titulo || libroSugerido.title || "";
											setLgQ(tit);
											setDetalle(libroSugerido);
											setLibroSugerido(null);
											haptic.tap();
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }),
											`Sugerencia: «${libroSugerido.titulo || libroSugerido.title || "Libro"}» · Toca para ver ficha`
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "cg-chip-sug-x",
										title: "Descartar sugerencia",
										onClick: () => setLibroSugerido(null),
										children: "✕"
									})
								]
							}),
							busqVisible && !lgUrlAbierto && !(lgQ || "").trim() && !sugVisible && busquedasRecientes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-chips-recientes",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-chips-recientes-lbl", children: "🕒 Recientes:" }),
									busquedasRecientes.slice(0, 6).map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "cg-chip-reciente",
										onClick: () => {
											setLgQ(term);
											setCategoria("");
											guardarBusquedaReciente(term);
										},
										children: term
									}, "chip-" + term))
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-cuerpo",
						children: (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-filtros-bar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "cg-filtros-btn" + (filtrosAbiertos || !ocultarAdultos || filtroIdioma !== "todos" ? " on" : ""),
							onClick: () => setFiltrosAbiertos(!filtrosAbiertos),
							"aria-label": "Filtros del catálogo",
							children: ["⚙︎ Filtros ", (!ocultarAdultos || filtroIdioma !== "todos") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cg-filtros-dot",
								title: filtroIdioma !== "todos" ? `Filtrando por ${filtroIdioma}` : "Filtros activos"
							})]
						})
					}),
					filtrosAbiertos && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-filtro cg-filtro-panel",
						children: [
							/* v208: fila adulto (igual que antes) */
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-filtro-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Restringir contenido para adultos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "cg-switch" + (ocultarAdultos ? " on" : ""),
									onClick: async () => {
										const v = !ocultarAdultos;
										setOcultarAdultos(v);
										try {
											await setMeta({
												id: "catalogo_filtros",
												ocultarAdultos: v
											});
										} catch {}
									},
									"aria-label": "Alternar filtro de contenido adulto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
								})]
							}),
							/* v208: bibliotecas activables/desactivables; el catálogo y la
							   búsqueda se actualizan al momento (prop bibliotecas → LibrosGratis) */
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-filtro-grupo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-filtro-tit", children: "📚 Bibliotecas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { className: "cg-filtro-sub", children: "Actívalas o desactívalas: el catálogo y la búsqueda se actualizan al instante." }), BIBLIOTECAS_INFO.map(([id, nom, ic]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-filtro-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: [ic, " ", nom] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-switch" + ((bibActivas ? bibActivas[id] !== false : true) ? " on" : ""),
										onClick: () => alternarBib(id),
										"aria-label": "Activar o desactivar " + nom,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
									})]
								}, id))]
							})
						,
							/* v240: Selector de Idioma funcional */
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-filtro-grupo",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cg-filtro-tit",
										children: "🌐 Idioma del catálogo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "cg-filtro-sub",
										children: "Filtra todas las categorías y recomendaciones por tu idioma preferido."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-filtro-idiomas-chips",
										style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
										children: [
											{ id: "todos", label: "🌐 Todos" },
											{ id: "es", label: "🇪🇸 Español" },
											{ id: "en", label: "🇬🇧 English" },
											{ id: "fr", label: "🇫🇷 Français" },
											{ id: "de", label: "🇩🇪 Deutsch" },
											{ id: "it", label: "🇮🇹 Italiano" },
											{ id: "pt", label: "🇵🇹 Português" }
										].map((idiomaOpt) => (
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "chip" + (filtroIdioma === idiomaOpt.id ? " on" : ""),
												onClick: () => {
													haptic.tap();
													setFiltroIdioma(idiomaOpt.id);
													try {
														setMeta({ id: "catalogo_filtros", ocultarAdultos, bibliotecas: bibActivas, filtroIdioma: idiomaOpt.id });
													} catch {}
												},
												children: idiomaOpt.label
											}, idiomaOpt.id)
										))
									})
								]
							})]
					}),
					/* v236: Barra unificada de categorías (mezcla de cg-cats con chips lg-temas) */
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chips lg-temas cg-cats-unificadas",
						role: "tablist",
						"aria-label": "Categorías de libros",
						ref: carrilRefCallback,
						onWheel: onWheelHorizontal,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								role: "tab",
								"aria-selected": categoria === "",
								className: "chip" + (categoria === "" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(""); },
								children: "🌐 Todas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								role: "tab",
								"aria-selected": categoria === "__populares__",
								className: "chip chip-populares" + (categoria === "__populares__" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === "__populares__" ? "" : "__populares__"); },
								children: ["🔥 Populares ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "chip-badge", children: "Top" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								role: "tab",
								"aria-selected": categoria === "__recientes__",
								className: "chip chip-recientes" + (categoria === "__recientes__" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === "__recientes__" ? "" : "__recientes__"); },
								children: "✨ Recién publicados"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								role: "tab",
								"aria-selected": categoria === "politica",
								className: "chip chip-politica" + (categoria === "politica" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === "politica" ? "" : "politica"); },
								children: "🏛️ Política"
							}),
							misLibros.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								role: "tab",
								"aria-selected": categoria === "__mis_libros__",
								className: "chip chip-mis" + (categoria === "__mis_libros__" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === "__mis_libros__" ? "" : "__mis_libros__"); },
								children: `📚 Mis libros (${misLibros.length})`
							}),
							favoritosStore.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								role: "tab",
								"aria-selected": categoria === "__favoritos__",
								className: "chip chip-favoritos" + (categoria === "__favoritos__" ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === "__favoritos__" ? "" : "__favoritos__"); },
								children: ["⭐ Favoritos (", favoritosStore.length, ")"]
							}),
							...LISTA_CATS_UNIFICADAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								role: "tab",
								"aria-selected": categoria === c.id,
								className: "chip" + (categoria === c.id ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === c.id ? "" : c.id); },
								children: [c.icon, " ", c.label]
							}, c.id))
						]
					}),

					/* Vista dedicada de FAVORITOS de la Store */
					categoria === "__favoritos__" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-seccion cg-seccion-favoritos",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "⭐ Mis libros favoritos de Lumen Store" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Libros que marcaste como favoritos para leer o consultar en cualquier momento." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-fila cg-fila-top",
								onWheel: onWheelHorizontal,
								children: favoritosStore.map((b) => (
									(0, import_jsx_runtime.jsx)(Tarjeta, {
										libro: b,
										reportes,
										onAbrir: () => { haptic.tap(); setDetalle(b); },
										onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
									}, "fav-card-" + (b.id || b.d || b.titulo))
								))
							})
						]
					}),

					/* Vista dedicada de POPULARES (Top Descargas) */
					categoria === "__populares__" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-seccion cg-seccion-populares",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🏆 Top Descargas — Los libros más leídos entre todas las bibliotecas" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Ranking global consolidado con estadísticas reales de descargas de Project Gutenberg, Open Library, Internet Archive y la red Lumen." })
								]
							}),
							/* Carril horizontal con scroll */
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-fila cg-fila-top",
								onWheel: onWheelHorizontal,
								children: listaPopulares.slice(0, 14).map((b, idx) => (
									(0, import_jsx_runtime.jsx)(Tarjeta, {
										libro: b,
										ranking: idx + 1,
										descargas: formatearDescargas(b.downloads) + " descargas",
										reportes,
										onAbrir: () => { haptic.tap(); setDetalle(b); },
										onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
									}, b.id || idx)
								))
							}),
							/* Grid vertical completo con scroll y paginación 40 en 40 */
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-top-grid",
								children: librosPantallaPop.map((b, idx) => {
									const pos = idx + 1;
									const tit = b.titulo || b.title;
									const aut = b.autor || (Array.isArray(b.authors) ? b.authors[0] : b.authors) || "Autor";
									return (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-top-item",
										onClick: () => { haptic.tap(); setDetalle(b); },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "cg-top-pos" + (pos <= 3 ? ` pos-${pos}` : ""),
												children: pos <= 3 ? ["🥇", "🥈", "🥉"][pos - 1] : `#${pos}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "cg-top-cov",
												src: b.portada || "assets/icon-192.png",
												alt: tit,
												loading: "lazy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "cg-top-info",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tit }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: aut }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "cg-top-dl-pill",
														children: ["📥 ", formatearDescargas(b.downloads), " descargas"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "cg-top-acciones",
														onClick: (e) => e.stopPropagation(),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "btn sm primary",
																onClick: () => { haptic.tap(); onAbrirLibro?.(b); },
																children: "▶ Leer"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "btn sm",
																onClick: () => { haptic.tap(); setDetalle(b); },
																children: "ℹ️ Ficha"
															})
														]
													})
												]
											})
										]
									}, b.id || idx);
								})
							}),
							listaPopulares.length > librosPantallaPop.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-paginacion-wrap",
								style: { textAlign: "center", margin: "20px 0 30px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn primary",
									onClick: () => avanzarPagina("__populares__"),
									children: ["🏆 Siguientes 40 libros populares (", Math.min(listaPopulares.length, librosPantallaPop.length + 40), " de ", listaPopulares.length, ")"]
								})
							})
						]
					}),

					/* Vista dedicada de RECIÉN PUBLICADOS */
					categoria === "__recientes__" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-seccion cg-seccion-recientes",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: 8 },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { margin: 0 }, children: "✨ Recién publicados" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn mini",
												onClick: refrescarRecientes,
												title: "Actualizar libros recién publicados",
												children: "🔄 Actualizar recientes"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Últimas obras publicadas por la comunidad en la red descentralizada y novedades de bibliotecas abiertas." })
								]
							}),
							/* Carril horizontal con scroll */
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-fila",
								onWheel: onWheelHorizontal,
								children: desduplicarFila(listaRecientes).slice(0, 14).map((libro) => (
									(0, import_jsx_runtime.jsx)(Tarjeta, {
										libro,
										reportes,
										onAbrir: () => { haptic.tap(); setDetalle(libro); },
										onLeer: () => { haptic.tap(); onAbrirLibro?.(libro); }
									}, libro.id)
								))
							}),
							/* Grid con scroll y paginación 40 en 40 */
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-grid",
								style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12, padding: "10px 0" },
								children: librosPantallaRec.map((libro) => (
									(0, import_jsx_runtime.jsx)(Tarjeta, {
										libro,
										reportes,
										onAbrir: () => { haptic.tap(); setDetalle(libro); },
										onLeer: () => { haptic.tap(); onAbrirLibro?.(libro); }
									}, libro.id)
								))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-paginacion-wrap",
								style: { textAlign: "center", margin: "20px 0 30px", display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn",
										onClick: refrescarRecientes,
										children: "🔄 Actualizar"
									}),
									listaRecientes.length > librosPantallaRec.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn primary",
										onClick: () => avanzarPagina("__recientes__"),
										children: ["✨ Siguientes 40 libros recientes (", Math.min(listaRecientes.length, librosPantallaRec.length + 40), " de ", listaRecientes.length, ")"]
									})
								]
							})
						]
					}),

					/* Vista de categoría con Top 10 Popular Rail + Catálogo Completo (40 en 40) */
					categoria !== "" && categoria !== "__populares__" && categoria !== "__recientes__" && categoria !== "__mis_libros__" && (() => {
						const lumenLibrosCat = visibles
							.filter((b) => {
								if (!matchesIdioma(b, filtroIdioma)) return false;
								const bCat = (b.categoria || "").toLowerCase();
								const cNorm = (categoria || "").toLowerCase();
								if (bCat === cNorm) return true;
								if (cNorm === "politica" && (bCat === "politica" || bCat === "política" || /polit|gobiern|rebel|estado|guerra|republic/i.test(b.titulo || ""))) return true;
								if ((cNorm === "religion" || cNorm === "religión") && (bCat === "religion" || bCat === "religión" || /relig|espirit|dios|biblia|fe|santo|budis|teolog/i.test(b.titulo || ""))) return true;
								return false;
							})
							.map((b) => normalizarLibroGenerico(b, "lumen"));

						const totalFilasCatalogo = Math.min(4, Math.ceil(librosPantallaCat.length / 10));

						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-seccion cg-seccion-categoria" + (categoria === "politica" ? " cg-seccion-politica" : ""),
							children: [
								/* Encabezado de la categoría */
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-seccion-head",
									style: { marginBottom: 16 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											style: { textTransform: "capitalize", margin: "0 0 6px" },
											children: ["📚 ", nombreBonitoCat(categoria), " (Pág. ", pagActual, " · ", inicioPaginacionCat + 1, "–", Math.min(inicioPaginacionCat + librosPantallaCat.length, poolCategoriaActual.length), " de ", poolCategoriaActual.length, " libros)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "cg-seccion-sub",
											children: "Exploración en 4 filas de 10 libros cada una con desplazamiento horizontal (40 libros por página)."
										})
									]
								}),

								/* Filas 1, 2, 3, 4: Exactamente hasta 4 filas de 10 libros */
								...Array.from({ length: totalFilasCatalogo }, (_, fIdx) => {
									const filaLibros = desduplicarFila(librosPantallaCat.slice(fIdx * 10, (fIdx + 1) * 10));
									const numFila = fIdx + 1; // Fila 1, 2, 3, 4
									const inicioFila = inicioPaginacionCat + fIdx * 10 + 1;
									const finFila = inicioPaginacionCat + fIdx * 10 + filaLibros.length;
									return (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-seccion cg-seccion-fila-cat",
										style: { marginBottom: 18 },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "cg-seccion-head",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
														style: { margin: "0 0 4px", fontSize: "0.98rem", fontWeight: 700, color: "var(--fg)" },
														children: [numFila === 1 ? "🔥 Fila 1 • Obras destacadas de " : ("Fila " + numFila + " • Catálogo de "), nombreBonitoCat(categoria), " (" + inicioFila + "–" + finFila + ")"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "cg-seccion-sub",
														style: { margin: 0, fontSize: "0.8rem", color: "var(--fg-muted)" },
														children: (numFila === 1 ? "Selección principal • " : "Catálogo general • ") + filaLibros.length + " títulos con desplazamiento horizontal"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "lg-fila cg-fila cg-fila-compacta cg-scroll-x-only",
												ref: carrilRefCallback,
												onWheel: onWheelHorizontal,
												children: desduplicarFila(filaLibros).map((libro, idx) => (
													(0, import_jsx_runtime.jsx)(Tarjeta, {
														libro,
														reportes,
														onAbrir: () => { haptic.tap(); setDetalle(libro); },
														onLeer: () => { haptic.tap(); onAbrirLibro?.(libro); }
													}, libro.id || (fIdx * 10 + idx))
												))
											})
										]
									}, "fila-cat-" + categoria + "-" + fIdx);
								}),

								/* Botón de paginación para avanzar a los siguientes 40 */
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-paginacion-wrap",
									style: { textAlign: "center", margin: "24px 0 20px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn primary" + (cargandoMasCat ? " busy" : ""),
										disabled: cargandoMasCat,
										onClick: () => {
											avanzarPaginaCategoria(categoria);
											document.querySelector(".cg-cuerpo")?.scrollTo({ top: 0, behavior: "smooth" });
										},
										children: [cargandoMasCat ? "⏳ Cargando…" : ("📚 Siguientes 40 libros de " + nombreBonitoCat(categoria) + " ⏩")]
									})
								})
							]
						});
					})(),

					/* Vista estándar ("Todas") reorganizada: sin cg-destacado, 10 libros en Top y Recientes, y fila de 10 libros para cada categoría unificada */
					categoria === "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
						children: [
							!lgQ.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-seccion-head",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🔥 Libros más descargados (Top Global)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Top descargados entre Project Gutenberg, Open Library, Internet Archive y la red Lumen." })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-fila cg-fila-top cg-scroll-x-only",
										ref: carrilRefCallback,
										onWheel: onWheelHorizontal,
										children: listaPopulares.slice(0, 10).map((b, idx) => (
											(0, import_jsx_runtime.jsx)(Tarjeta, {
												libro: b,
												ranking: idx + 1,
												descargas: formatearDescargas(b.downloads) + " descargas",
												reportes,
												onAbrir: () => { haptic.tap(); setDetalle(b); },
												onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
											}, b.id || idx)
										))
									})
								]
							}),
							!lgQ.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-seccion-head",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "✨ Recién publicados" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Nuevas incorporaciones de la comunidad y lectores independientes." })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-fila cg-scroll-x-only",
										ref: carrilRefCallback,
										onWheel: onWheelHorizontal,
										children: listaRecientes.slice(0, 10).map((libro) => (
											(0, import_jsx_runtime.jsx)(Tarjeta, {
												libro,
												reportes,
												onAbrir: () => { haptic.tap(); setDetalle(libro); },
												onLeer: () => { haptic.tap(); onAbrirLibro?.(libro); }
											}, libro.id)
										))
									})
								]
							}),
							!lgQ.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-seccion-head",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🏛️ Política y Pensamiento Universal" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Grandes obras políticas y tratados fundamentales de la sociedad (10 libros)." })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-fila cg-scroll-x-only",
										ref: carrilRefCallback,
										onWheel: onWheelHorizontal,
										children: obtenerLibrosDeCategoria("politica").slice(0, 10).map((b, idx) => (
											(0, import_jsx_runtime.jsx)(Tarjeta, {
												libro: b,
												ranking: idx + 1,
												descargas: formatearDescargas(b.downloads) + " descargas",
												reportes,
												onAbrir: () => { haptic.tap(); setDetalle(b); },
												onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
											}, b.id || idx)
										))
									})
								]
							}),
							!lgQ.trim() && LISTA_CATS_UNIFICADAS.filter(c => c.id !== "politica").map((catItem) => {
								const poolCat = obtenerLibrosDeCategoria(catItem.id);
								if (!poolCat || poolCat.length === 0) return null;
								const tamano = poolCat.length;
								const startIdx = ((paginaTodas - 1) * 10) % tamano;
								let librosDiez = poolCat.slice(startIdx, startIdx + 10);
								if (librosDiez.length < 10 && tamano > librosDiez.length) {
									for (const cand of poolCat) {
										if (librosDiez.length >= 10) break;
										if (!librosDiez.some((b) => sonMismoLibroFila(b, cand))) {
											librosDiez.push(cand);
										}
									}
								}
								librosDiez = desduplicarFila(librosDiez);
								return (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-seccion",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cg-seccion-head",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [catItem.icon, " ", catItem.label, ` (${startIdx + 1}–${Math.min(startIdx + 10, tamano)} de ${tamano})`] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "cg-ver-todas-btn",
													onClick: () => { haptic.tap(); setCategoria(catItem.id); },
													children: "Ver todos ›"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "cg-fila cg-fila-compacta",
											onWheel: onWheelHorizontal,
											children: desduplicarFila(librosDiez).map((b, idx) => (
												(0, import_jsx_runtime.jsx)(Tarjeta, {
													libro: b,
													reportes,
													onAbrir: () => { haptic.tap(); setDetalle(b); },
													onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
												}, b.id || idx)
											))
										})
									]
								}, `todas-cat-${catItem.id}`);
							})
						]
					}),

					categoria === "__mis_libros__" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion cg-seccion-mis-libros",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-mis-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: `📚 Mis libros publicados (${misLibros.length})` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn mini primary",
										onClick: () => onPublicar?.({ modo: "nuevo" }),
										children: "＋ Publicar otro"
									})]
								}), misLibros.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-grid",
									children: misLibros.map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
										libro: { ...libro, esMio: true },
										reportes,
										onAbrir: () => {
											haptic.tap();
											setDetalle({ ...libro, esMio: true });
										},
										onLeer: (b) => {
											haptic.tap();
											onAbrirLibro?.(b);
										},
										onEditar: (b) => {
											haptic.tap();
											onPublicar?.({ modo: "editar", pub: b });
										},
										onQr: (b) => {
											haptic.tap();
											setDetalle({ ...b, esMio: true });
											setQrAbierto(true);
										},
										onEliminar: (b) => {
											confirmarEliminar(b);
										}
									}, libro.id || libro.d))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-mis-vacio",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "📖 Aún no has publicado ningún libro con tu perfil anónimo." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "row-sub", children: "Los libros que publiques quedarán guardados en la red descentralizada de Lumen Store para que puedas encontrarlos y leerlos desde cualquier dispositivo." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn primary",
											onClick: () => onPublicar?.({ modo: "nuevo" }),
											children: "＋ Publicar mi primer libro"
										})
									]
								})]
							}),
						lgQ.trim() && librosDelAutor.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion cg-seccion-autor-destacado",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-seccion-head",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												children: ["👤 Libros de ", autorDetectado, " (", librosDelAutor.length, " obras listas para descargar y leer)"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "cg-seccion-sub",
												children: "Obras del autor disponibles con descarga directa en EPUB/PDF y lectura instantánea desde Internet Archive, Open Library y Lumen Store."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-fila cg-scroll-x-only",
										ref: carrilRefCallback,
										onWheel: onWheelHorizontal,
										children: desduplicarFila(librosDelAutor).map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
											libro,
											reportes,
											onAbrir: () => {
												haptic.tap();
												setDetalle(libro);
											},
											onLeer: () => {
												haptic.tap();
												onAbrirLibro?.(libro);
											}
										}, libro.id || libro.d))
									})
								]
							}),
							lgQ.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										children: `📚 Resultados de «${lgQ.trim()}» (${librosDelAutor.length + otrosResultados.length} obras)`
									}),
									cargandoRemotos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { padding: "6px 10px", color: "#a29bfe", fontSize: 12, fontStyle: "italic", marginBottom: 8 },
										children: "🔍 Consultando Internet Archive y bibliotecas abiertas en tiempo real…"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-grid",
										children: (librosDelAutor.length > 0 ? otrosResultados : librosCoincidentes).map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
											libro,
											reportes,
											onAbrir: () => {
												haptic.tap();
												setDetalle(libro);
											},
											onLeer: () => {
												haptic.tap();
												onAbrirLibro?.(libro);
											}
										}, libro.id || libro.d))
									})
								]
							}),
							cargandoMasCat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion cg-seccion-cargando-shimmer",
								style: { margin: "14px 0" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cg-fila cg-scroll-x-only",
										children: [0, 1, 2, 3].map((i) => (0, import_jsx_runtime.jsx)(TarjetaSkeleton, { index: i }, i))
									})
								]
							}),
							/* cg-pie situado al fondo natural de las categorías dentro de cg-cuerpo */
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-pie",
								children: [
									categoria === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-pag",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "cg-pag-btn",
												disabled: paginaTodas <= 1,
												onClick: () => { haptic.tap(); setPaginaTodas((p) => Math.max(1, p - 1)); },
												title: "Anteriores",
												children: "⏪ Anteriores"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "cg-pag-info",
												children: ["Página ", paginaTodas, " · 10 por categoría"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "cg-pag-btn",
												onClick: () => { haptic.tap(); setPaginaTodas((p) => p + 1); },
												title: "Siguientes",
												children: "Siguientes ⏩"
											})
										]
									}) : (categoria !== "__mis_libros__" && !lgQ.trim()) ? (() => {
										const pagCat = obtenerPagina(categoria);
										const poolActual = obtenerLibrosDeCategoria(categoria);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cg-pag",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "cg-pag-btn",
													disabled: pagCat <= 1,
													onClick: () => retrocederPaginaCategoria(categoria),
													title: "Anteriores 40",
													children: "⏪ Anteriores 40"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "cg-pag-info",
													children: [
														categoria === "__populares__" ? "Top Descargas" :
														categoria === "__recientes__" ? "Recientes" :
														`${(pagCat - 1) * 40 + 1}–${Math.min(pagCat * 40, poolActual.length)} de ${poolActual.length}`
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "cg-pag-btn" + (cargandoMasCat ? " busy" : ""),
													disabled: cargandoMasCat,
													onClick: () => avanzarPaginaCategoria(categoria),
													title: "Siguientes 40",
													children: [cargandoMasCat ? "⏳ Cargando…" : "Siguientes 40 ⏩"]
												})
											]
										});
									})() : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "cg-pie-relays",
										onClick: () => setPanelRelays(true),
										title: "Estado de los relays",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { color: "#4ade80", fontSize: "10px", lineHeight: 1 },
												children: "● "
											}),
											libros.length,
											" libros · 📡 ",
											relaysActivos,
											"/",
											listaRelays.length,
											" relays"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: cargar,
										title: "Actualizar catálogo",
										children: "↻ Actualizar"
									})
								]
							})
						]
					})
				})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!detalle,
				onClose: () => setDetalle(null),
				title: detalle?.titulo || "",
				children: detalle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-detalle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-detalle-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
								libro: detalle,
								titulo: detalle.titulo,
								prioritaria: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-detalle-info",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-detalle-tit-row",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: detalle.titulo }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "cg-btn-fav-star" + (esFavoritoStore(detalle) ? " on" : ""),
												onClick: () => toggleFavoritoStore(detalle),
												title: esFavoritoStore(detalle) ? "Quitar de favoritos" : "Marcar como favorito",
												"aria-label": "Marcar como favorito",
												children: esFavoritoStore(detalle) ? "⭐" : "☆"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "cg-autor",
										children: detalle.autor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cg-detalle-rating",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estrellas, { valor: ratingDe(detalle).estrellas }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											" ",
											ratingDe(detalle).reseñas.toLocaleString("es-CO"),
											" reseñas"
										] })]
									}),
									detalle.npub && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "cg-npub",
										children: [
											"✍️ ",
											npubCorto(detalle.npub),
											" · ",
											(/* @__PURE__ */ new Date(detalle.createdAt * 1e3)).toLocaleDateString("es-CO")
										]
									}),
									detalle.categoria && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cg-cat-chip",
										children: detalle.categoria
									}),
									detalle.rating === "adulto" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cg-cat-chip cg-chip-adulto",
										children: "🔞 Adulto"
									}),
									detalle.etiquetas?.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cg-cat-chip",
										children: e
									}, e)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-disp",
										children: [
											(() => {
												const d = disponibilidad(detalle);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													d.nivel === "alta" ? "🟢" : d.nivel === "media" ? "🟡" : "⚪",
													" ",
													d.etiqueta
												] });
											})(),
											detalle.paginas ? ` · ${detalle.paginas} pág.` : "",
											detalle.tamano ? ` · ${(Number(detalle.tamano) / 1048576).toFixed(1)} MB` : ""
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bc-info",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "bc-titulo",
									title: detalle.titulo,
									children: detalle.titulo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bc-autor",
									children: detalle.autor
								}),
								detalle.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "bc-desc",
									children: textoLimpio(detalle.descripcion)
								}) : buscandoDesc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "bc-desc",
									style: { fontStyle: "italic", opacity: 0.75 },
									children: "🔍 Consultando sinopsis en Wikipedia…"
								}) : null,
								(() => {
									const meta = [];
									if (detalle.tamano) meta.push(`${(Number(detalle.tamano) / 1048576).toFixed(1)} MB`);
									if (detalle.categoria) meta.push(detalle.categoria);
									if (detalle.license) meta.push(detalle.license);
									return meta.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bc-meta",
										children: meta.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: m }, m))
									}) : null;
								})(),
								(detalle.descargas || detalle.downloads) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "bc-acciones",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "bc-descargas",
											children: ["↓ ", detalle.descargas || detalle.downloads]
										})
									]
								}) : null
							]
						}),
						detalle.esMio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-mio-note",
							children: [
								"🟣 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Este libro lo publicaste tú." }),
								" Su estado, historial, QR y opciones de compartir están en «Mis publicaciones» (botón 📦 arriba).",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn mini",
									style: { marginLeft: 8 },
									onClick: () => {
										setDetalle(null);
										onAbrirMisPublicaciones?.();
									},
									children: "Abrir 📦"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-bloque-autor",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-h-autor",
									children: "Sobre el autor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-autor-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											className: "cg-autor-avatar",
											src: detalle.authorAvatar || generarFacehashUri(detalle.pubkey || detalle.autor || "anon"),
											alt: detalle.autor,
											draggable: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cg-autor-meta",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
													className: "cg-autor-nom",
													children: detalle.autor || "Autor anónimo"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "cg-autor-anon-badge",
													children: "🎭 Perfil anónimo de autor"
												}),
												detalle.npub ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
													className: "cg-autor-npub",
													children: ["ID: ", npubCorto(detalle.npub)]
												}) : null
											]
										})
									]
								})
							]
						}),
						detalle.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-desc-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "cg-desc",
									children: textoLimpio(detalle.descripcion)
								}),
								detalle._fuenteDesc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "cg-desc-fuente",
									children: "ℹ️ Sinopsis obtenida de " + detalle._fuenteDesc
								})
							]
						}) : buscandoDesc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-desc-buscando",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔍" }),
								"Consultando sinopsis en Wikipedia y bibliotecas abiertas…"
							]
						}) : null,
						disponibilidad(detalle).nivel === "baja" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-solo-catalogo",
							children: [
								"📋 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Solo catálogo:" }),
								" esta ficha existe (título, portada, descripción), pero el autor aún no ha publicado el archivo del libro, así que de momento no se puede ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "leer" }),
								" ni ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "descargar" }),
								". Puedes ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "compartir" }),
								", ver el ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "QR" }),
								"o ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "reportar" }),
								". Si es tuyo, re-siémbralo desde 📦 Mis publicaciones para que otros puedan leerlo."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-detalle-acciones",
							children: [
								(detalle.categoria === "manga" || ["mangadex", "tmo", "comick", "mangakakalot"].includes(detalle.fuente) || detalle.isManga) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn primary btn-manga-reader",
									onClick: () => {
										const uManga = detalle.url || (detalle.fuente === "mangadex" ? `https://mangadex.org/title/${detalle.id}` : null) || (detalle.fuente === "tmo" ? `https://zonatmo.com/library?title=${encodeURIComponent(detalle.titulo || "")}` : null) || (detalle.fuente === "comick" ? `https://comick.io/search?q=${encodeURIComponent(detalle.titulo || "")}` : null) || (detalle.fuente === "mangakakalot" ? `https://mangakakalot.com/search/story/${encodeURIComponent(detalle.titulo || "")}` : null) || `https://mangadex.org/search?q=${encodeURIComponent(detalle.titulo || "")}`;
										window.open(uManga, "_blank", "noopener");
										toast?.(`🎌 Abriendo manga «${(detalle.titulo || "").slice(0, 30)}» en lector online…`);
										setDetalle(null);
									},
									children: ["📖 Leer Manga online (", (detalle.fuente ? (BIBLIOTECAS_INFO.find(([k]) => k === detalle.fuente)?.[1] || detalle.fuente) : "Lector"), ")"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn" + ((detalle.categoria === "manga" || ["mangadex", "tmo", "comick", "mangakakalot"].includes(detalle.fuente) || detalle.isManga) ? "" : " primary"),
									onClick: () => {
										if (detalle.categoria === "manga" || ["mangadex", "tmo", "comick", "mangakakalot"].includes(detalle.fuente) || detalle.isManga) {
											const uManga = detalle.url || (detalle.fuente === "mangadex" ? `https://mangadex.org/title/${detalle.id}` : null) || (detalle.fuente === "tmo" ? `https://zonatmo.com/library?title=${encodeURIComponent(detalle.titulo || "")}` : null) || (detalle.fuente === "comick" ? `https://comick.io/search?q=${encodeURIComponent(detalle.titulo || "")}` : null) || (detalle.fuente === "mangakakalot" ? `https://mangakakalot.com/search/story/${encodeURIComponent(detalle.titulo || "")}` : null) || `https://mangadex.org/search?q=${encodeURIComponent(detalle.titulo || "")}`;
											window.open(uManga, "_blank", "noopener");
											toast?.(`🎌 Abriendo manga «${(detalle.titulo || "").slice(0, 30)}» en lector online…`);
											setDetalle(null);
											return;
										}
										onAbrirLibro?.(detalle);
										setDetalle(null);
									},
									children: ["👁 ", detalle.esMio && detalle._local ? "Leer (está en tu teléfono)" : (detalle.categoria === "manga" || ["mangadex", "tmo", "comick", "mangakakalot"].includes(detalle.fuente) || detalle.isManga) ? "Leer Manga" : "Leer"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn cg-btn-favorito" + (esFavoritoStore(detalle) ? " fav-activo" : ""),
									onClick: () => toggleFavoritoStore(detalle),
									children: [esFavoritoStore(detalle) ? "⭐ En favoritos" : "☆ Favorito"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									disabled: descargando,
									onClick: async () => {
										// Descarga directa en la app con fallback a búsqueda en navegador si falla
										const urlDirecta = detalle.epub || detalle.fileUrl || detalle.download || detalle.file || "";
										if (urlDirecta && /^https?:\/\//i.test(urlDirecta) && !detalle.magnet) {
											setDescargando(true);
											try {
												const r = await fetch(urlDirecta, { signal: AbortSignal.timeout(15000) });
												if (r.ok) {
													const ct = (r.headers.get("content-type") || "").toLowerCase();
													if (!ct.includes("text/html")) {
														const blob = await r.blob();
														if (blob.size > 800) {
															let ext = ".epub";
															let mime = "application/epub+zip";
															if (urlDirecta.endsWith(".pdf") || ct.includes("pdf")) { ext = ".pdf"; mime = "application/pdf"; }
															else if (urlDirecta.endsWith(".txt") || ct.includes("plain")) { ext = ".txt"; mime = "text/plain"; }
															const nom = ((detalle.titulo || detalle.title || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro") + ext;
															const fileObj = new File([blob], nom, { type: mime });
															if (typeof window.__lumenImportarArchivos === "function") {
																await window.__lumenImportarArchivos([fileObj]);
																toast("✓ Libro descargado e importado directamente en tu biblioteca");
																setDescargando(false);
																return;
															} else {
																const urlBlob = URL.createObjectURL(blob);
																const a = document.createElement("a");
																a.href = urlBlob;
																a.download = nom;
																a.click();
																setTimeout(() => URL.revokeObjectURL(urlBlob), 4000);
																toast("✓ Descargado en tu dispositivo. Impórtalo con el botón +");
																setDescargando(false);
																return;
															}
														}
													}
												}
												throw new Error("Respuesta no válida del servidor");
											} catch (eDir) {
												console.warn("[descarga directa fallida, activando fallback]", eDir);
												const fallbackUrl = detalle.url || (detalle.epub ? detalle.epub.replace(/\.epub3\.images$/, "") : `https://annas-archive.gl/search?q=${encodeURIComponent((detalle.titulo || "") + " " + (detalle.autor || ""))}`);
												window.open(fallbackUrl, "_blank", "noopener");
												toast("Descarga directa no disponible; abriendo descarga en el navegador…");
												setDescargando(false);
												return;
											}
										}
										if (detalle.fileUrl) {
											const nombreLumen = ((detalle.titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro") + ".lumen";
											try {
												const r = await fetch(detalle.fileUrl, { signal: AbortSignal.timeout(8e3) });
												const ct = r.headers.get("content-type") || "";
												if (r.ok && !ct.includes("text/html")) {
													const blob = await r.blob();
													if (blob.size > 2000) {
														const url = URL.createObjectURL(blob);
														const a = document.createElement("a");
														a.href = url;
														a.download = nombreLumen;
														a.click();
														setTimeout(() => URL.revokeObjectURL(url), 4e3);
														toast("Descargado desde Lumen Storage. Impórtalo con el botón + de la biblioteca.");
														return;
													}
												}
											} catch (eStorage) {
												console.warn("[storage fetch]", eStorage);
											}
										}
										if (detalle.magnet) {
											__vitePreload(() => import("./streaming-CGdx3ecV.js").then((n) => n.i).then((m) => {
												toast(m.descargarPorTorrent(detalle.magnet) ? "Descarga torrent iniciada: síguela en la Biblioteca torrent (menú → Torrents)" : "No se pudo iniciar el torrent en este dispositivo");
											}), __vite__mapDeps([9,2,1,5]), import.meta.url);
											return;
										}
										if (detalle.download) {
											setDescargando(true);
											try {
												const r = await fetch(detalle.download, { signal: AbortSignal.timeout(6e4) });
												if (r.ok) {
													const blob = await r.blob();
													const url = URL.createObjectURL(blob);
													const a = document.createElement("a");
													a.href = url;
													a.download = ((detalle.titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro") + ".lumen";
													a.click();
													setTimeout(() => URL.revokeObjectURL(url), 4e3);
													toast("Descargado. Impórtalo con el botón + de la biblioteca.");
													return;
												}
											} catch (e) {
												console.warn("[download error]", e);
											} finally {
												setDescargando(false);
											}
										}
										// Paquete .lumen generado y descomprimible al vuelo sin depender de servidores caídos
										try {
											setDescargando(true);
											const { construirLumenPersonal } = await __vitePreload(() => import("./lumenbook-D1rmZfn6.js"), __vite__mapDeps([13,14,10]), import.meta.url);
											let caps = [detalle.descripcion || detalle.synopsis || `Capítulo 1: ${detalle.titulo}`];
											const _tD = (detalle.titulo || "").toLowerCase();
											const _aD = (detalle.autor || "").toLowerCase();
											if (_tD.includes("capital") || (_aD.includes("marx") && !_tD.includes("manifiesto"))) {
												caps = [
													"PREFACIOS DE KARL MARX\n\nPrefacio a la primera edición alemana (1867) y segunda edición (1873).\n\nLa obra cuyo primer volumen entrego al público constituye la continuación de mi escrito publicado en 1859 con el título de Contribución a la crítica de la economía política...",
													"CAPÍTULO I: LA MERCANCÍA\n\nI. Los dos factores de la mercancía: valor de uso y valor (sustancia y magnitud del valor).\n\nLa riqueza de las sociedades en las que domina el modo de producción capitalista se presenta como una inmensa acumulación de mercancías, y la mercancía individual como la forma elemental de esa riqueza...\n\nII. Doble carácter del trabajo representado en las mercancías.\n\nIII. El fetichismo de la mercancía y su secreto.",
													"CAPÍTULO IV: LA FÓRMULA GENERAL DEL CAPITAL\n\nLa circulación de mercancías es el punto de partida del capital. Ciclo D - M - D' (Dinero - Mercancía - Dinero incrementado). El incremento sobre el valor originario es el plusvalor.",
													"CAPÍTULO VII: PROCESO DE TRABAJO Y PROCESO DE VALORIZACIÓN\n\nLa producción del plusvalor absoluto y la prolongación de la jornada laboral más allá del tiempo de trabajo necesario.",
													"CAPÍTULO XXIV: LA LLAMADA ACUMULACIÓN ORIGINARIA\n\nEl secreto de la acumulación originaria: la escisión histórica entre los productores directos y los medios de producción. La expropiación del suelo y la tendencia histórica de la acumulación capitalista: ¡Suena la hora de la propiedad privada capitalista. Los expropiadores son expropiados!"
												];
											}
											const meta = {
												titulo: detalle.titulo,
												autor: detalle.autor || "Autor Lumen",
												categoria: detalle.categoria || "general",
												descripcion: detalle.descripcion || "",
												idioma: detalle.idioma || "es",
												audioUrl: detalle.audioUrl || "",
												paginas: 1
											};
											const personal = {
												titulo: detalle.titulo,
												autor: detalle.autor,
												audioUrl: detalle.audioUrl || null,
												videoUrl: detalle.videoUrl || null,
												createdAt: Date.now()
											};
											const lb = await construirLumenPersonal(meta, caps, detalle.portada || null, personal);
											const url = URL.createObjectURL(lb.blob);
											const a = document.createElement("a");
											a.href = url;
											a.download = lb.nombre || ((detalle.titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() + ".lumen");
											a.click();
											setTimeout(() => URL.revokeObjectURL(url), 4e3);
											toast("📦 Paquete .lumen descargado al vuelo con portada y personalizaciones. ¡Impórtalo con el botón +!");
										} catch (eBuild) {
											toast("No se pudo generar la descarga: " + (eBuild?.message || eBuild));
										} finally {
											setDescargando(false);
										}
									},
									children: descargando ? "⏳…" : detalle.fileUrl ? "↓ Descargar (Lumen Storage)" : detalle.magnet ? "↓ Descargar (Torrent)" : "↓ Descargar .lumen"
								}),
								(detalle.audioUrl || detalle.videoUrl) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "cg-detalle-media-btns",
	children: [
		detalle.audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => window.open(detalle.audioUrl, "_blank", "noopener"), children: "🎧 Audio del autor" }),
		detalle.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => window.open(detalle.videoUrl, "_blank", "noopener"), children: "🎬 Vídeo del autor" })
	]
}) : null,
detalle.esMio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									onClick: () => {
										const b = detalle;
										setDetalle(null);
										onPublicar?.({ modo: "editar", pub: b });
									},
									children: "✏️ Editar"
								}),
								detalle.esMio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn danger",
									onClick: () => confirmarEliminar(detalle),
									children: "🗑️ Eliminar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn cg-btn-copiar-link",
									onClick: () => copiarLinkLumen(detalle),
									children: "📋 Copiar link de Lumen"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									onClick: () => compartirLibro(detalle),
									children: "🔗 Compartir"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									onClick: () => setQrAbierto(true),
									children: "▦ QR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn danger",
									onClick: () => setReporteAbierto(true),
									children: "🚩 Reportar"
								})
							]
						}),
						detalle.ad && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cg-ad-note",
							children: "💰 Este autor monetiza las páginas pares con su propio anuncio (50/50)."
						}),
						detalle.donacion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "cg-donar",
							href: detalle.donacion,
							target: "_blank",
							rel: "noreferrer",
							children: "💛 Apoyar al autor con una donación"
						}),
						contarReportes(reportes, detalle.id) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-reportes-note",
							children: [
								"🚩 ",
								contarReportes(reportes, detalle.id),
								" reporte(s). Con 3+ pasa a revisión de la comunidad."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatResenas, { libro: detalle, toast, key: detalle?.d || detalle?.id || "chat" })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: qrAbierto,
				onClose: () => setQrAbierto(false),
				title: "QR del libro",
				children: detalle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrLibro, { libro: detalle })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: panelRelays,
				onClose: () => setPanelRelays(false),
				title: "📡 Relays del catálogo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-panel-relays",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "row-sub",
							children: "Los relays son tablones públicos donde vive el catálogo. Aquí ves si cada uno respondió en la última actualización. Si ninguno responde, revisa tu conexión; tus libros siguen visibles desde «Mis publicaciones» (📦)."
						}),
						listaRelays.map((r) => {
							const est = relaysInfo[r];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mp-relay",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mp-relay-dot" + (est === "abierto" ? " ok" : "") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: r }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: est === "abierto" ? "conectado" : est === "error" ? "error de conexión" : est === "cerrado" ? "cerrado" : "sin respuesta" })
								]
							}, r);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-siguiente",
							style: { marginTop: 10 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn",
								onClick: () => {
									setPanelRelays(false);
									onPublicar?.({ modo: "ajustes" });
								},
								children: "⚙︎ Gestionar relays"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: () => {
									setPanelRelays(false);
									cargar();
								},
								children: "↻ Reintentar"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: reporteAbierto,
				onClose: () => setReporteAbierto(false),
				title: "Reportar libro",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-reporte",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "row-sub",
						style: { marginBottom: 12 },
						children: "El reporte se firma con tu clave y se publica en los relays. Un libro no se oculta con 1 reporte: necesita 3 de personas distintas."
					}), MOTIVOS.map(([id, ic, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "cg-motivo",
						disabled: publicandoReporte,
						onClick: () => reportar(detalle, id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ic }),
							" ",
							et
						]
					}, id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LumenScannerQR, {
				open: escanerAbierto,
				onClose: () => setEscanerAbierto(false),
				onCodigoDetectado: (codigo) => {
					const parsed = extraerDatosLibroEnlace(codigo);
					const tid = parsed?.id || extraerIdLibro(codigo) || codigo;
					resolverYMostrarLibro(tid, parsed);
				},
				toast
			})
		]
	});
}

const LIBROS_TOP_DESCARGAS = [
 {
 "id": "top-el-capital",
 "d": "top-el-capital-marx",
 "titulo": "El Capital: Crítica de la Economía Política",
 "autor": "Karl Marx",
 "fuente": "archive",
 "downloads": 78900,
 "portada": "https://archive.org/services/img/marx-el-capital-obra-completa",
 "categoria": "politica",
 "idioma": "es",
 "epub": "https://archive.org/download/marx-el-capital-obra-completa/Marx%2C%20El%20Capital%20Obra%20Completa.epub",
 "fileUrl": "https://archive.org/download/marx-el-capital-obra-completa/Marx%2C%20El%20Capital%20Obra%20Completa.pdf",
 "descripcion": "Magna obra del pensamiento socioeconómico sobre el valor, la mercancía, la plusvalía y la acumulación del capital (Tomos I, II y III completos)."
},
 {
 "id": "top-manifiesto-comunista",
 "d": "top-manifiesto-comunista-marx-engels",
 "titulo": "Manifiesto del Partido Comunista",
 "autor": "Karl Marx y Friedrich Engels",
 "fuente": "gutenberg",
 "downloads": 84200,
 "portada": "https://covers.openlibrary.org/b/id/8231920-M.jpg",
 "categoria": "politica",
 "idioma": "es",
 "epub": "https://www.gutenberg.org/ebooks/10.epub3.images",
 "fileUrl": "https://archive.org/download/marx-el-capital-obra-completa/Manifiesto_Comunista.pdf",
 "descripcion": "Tratado político fundacional sobre la lucha de clases, el desarrollo de las fuerzas productivas y el devenir del movimiento obrero."
},
 {
 "id": "top-cien-anos-soledad",
 "d": "top-cien-anos-soledad-garcia-marquez",
 "titulo": "Cien Años de Soledad",
 "autor": "Gabriel García Márquez",
 "fuente": "openlibrary",
 "downloads": 96500,
 "portada": "https://covers.openlibrary.org/b/id/11153218-M.jpg",
 "categoria": "ficción",
 "idioma": "es",
 "epub": "https://archive.org/download/marx-el-capital-obra-completa/Cien_Anos_de_Soledad.epub",
 "fileUrl": "https://archive.org/download/marx-el-capital-obra-completa/Cien_Anos_de_Soledad.pdf",
 "descripcion": "La cumbre del realismo mágico y la epopeya de las siete generaciones de la familia Buendía en el mítico pueblo de Macondo."
},
 {
  "id": "top-1",
  "d": "top-1984",
  "titulo": "1984",
  "autor": "George Orwell",
  "fuente": "archive",
  "downloads": 35400,
  "portada": "https://covers.openlibrary.org/b/id/12629471-M.jpg",
  "categoria": "politica",
  "fileUrl": "https://ia800100.us.archive.org/view_archive.php?archive=/28/items/1984_orwell/1984.zip"
 },
 {
  "id": "top-2",
  "d": "top-rebelion",
  "titulo": "Rebeli\u00f3n en la Granja",
  "autor": "George Orwell",
  "fuente": "archive",
  "downloads": 28900,
  "portada": "https://covers.openlibrary.org/b/id/11153210-M.jpg",
  "categoria": "politica"
 },
 {
  "id": "top-3",
  "d": "top-arte-guerra",
  "titulo": "El Arte de la Guerra",
  "autor": "Sun Tzu",
  "fuente": "gutenberg",
  "downloads": 25300,
  "portada": "https://archive.org/services/img/elartedelaguerra00sunt",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/132.epub3.images"
 },
 {
  "id": "top-4",
  "d": "top-orgullo",
  "titulo": "Orgullo y Prejuicio",
  "autor": "Jane Austen",
  "fuente": "gutenberg",
  "downloads": 22400,
  "portada": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
  "categoria": "ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/1342.epub3.images"
 },
 {
  "id": "top-5",
  "d": "top-manifiesto",
  "titulo": "El Manifiesto Comunista",
  "autor": "Karl Marx y Friedrich Engels",
  "fuente": "gutenberg",
  "downloads": 22100,
  "portada": "https://www.gutenberg.org/cache/epub/61/pg61.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/61.epub3.images"
 },
 {
  "id": "top-6",
  "d": "top-sherlock",
  "titulo": "Estudio en Escarlata",
  "autor": "Arthur Conan Doyle",
  "fuente": "gutenberg",
  "downloads": 21000,
  "portada": "https://www.gutenberg.org/cache/epub/244/pg244.cover.medium.jpg",
  "categoria": "misterio",
  "epub": "https://www.gutenberg.org/ebooks/244.epub3.images"
 },
 {
  "id": "top-7",
  "d": "top-republica",
  "titulo": "La Rep\u00fablica",
  "autor": "Plat\u00f3n",
  "fuente": "gutenberg",
  "downloads": 19800,
  "portada": "https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg",
  "categoria": "filosof\u00eda",
  "epub": "https://www.gutenberg.org/ebooks/1497.epub3.images"
 },
 {
  "id": "top-8",
  "d": "top-alicia",
  "titulo": "Alicia en el Pa\u00eds de las Maravillas",
  "autor": "Lewis Carroll",
  "fuente": "gutenberg",
  "downloads": 19500,
  "portada": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",
  "categoria": "infantil",
  "epub": "https://www.gutenberg.org/ebooks/11.epub3.images"
 },
 {
  "id": "top-9",
  "d": "top-principe",
  "titulo": "El Pr\u00edncipe",
  "autor": "Nicol\u00e1s Maquiavelo",
  "fuente": "gutenberg",
  "downloads": 18500,
  "portada": "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/1232.epub3.images"
 },
 {
  "id": "top-10",
  "d": "top-metamorfosis",
  "titulo": "La Metamorfosis",
  "autor": "Franz Kafka",
  "fuente": "gutenberg",
  "downloads": 16200,
  "portada": "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg",
  "categoria": "ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/5200.epub3.images"
 },
 {
  "id": "top-11",
  "d": "top-riqueza",
  "titulo": "La Riqueza de las Naciones",
  "autor": "Adam Smith",
  "fuente": "gutenberg",
  "downloads": 16400,
  "portada": "https://www.gutenberg.org/cache/epub/3300/pg3300.cover.medium.jpg",
  "categoria": "econom\u00eda",
  "epub": "https://www.gutenberg.org/ebooks/3300.epub3.images"
 },
 {
  "id": "top-12",
  "d": "top-desobediencia",
  "titulo": "Desobediencia Civil",
  "autor": "Henry David Thoreau",
  "fuente": "gutenberg",
  "downloads": 15800,
  "portada": "https://www.gutenberg.org/cache/epub/71/pg71.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/71.epub3.images"
 },
 {
  "id": "top-13",
  "d": "top-quijote",
  "titulo": "Don Quijote de la Mancha",
  "autor": "Miguel de Cervantes",
  "fuente": "gutenberg",
  "downloads": 15420,
  "portada": "https://www.gutenberg.org/cache/epub/2000/pg2000.cover.medium.jpg",
  "categoria": "cl\u00e1sicos",
  "epub": "https://www.gutenberg.org/ebooks/2000.epub3.images"
 },
 {
  "id": "top-14",
  "d": "top-frankenstein",
  "titulo": "Frankenstein",
  "autor": "Mary Shelley",
  "fuente": "gutenberg",
  "downloads": 14500,
  "portada": "https://www.gutenberg.org/cache/epub/56834/pg56834.cover.medium.jpg",
  "categoria": "ciencia-ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/56834.epub3.images"
 },
 {
  "id": "top-15",
  "d": "top-contrato",
  "titulo": "El Contrato Social",
  "autor": "Jean-Jacques Rousseau",
  "fuente": "gutenberg",
  "downloads": 14200,
  "portada": "https://www.gutenberg.org/cache/epub/46333/pg46333.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/46333.epub3.images"
 },
 {
  "id": "top-16",
  "d": "top-mosqueteros",
  "titulo": "Los Tres Mosqueteros",
  "autor": "Alexandre Dumas",
  "fuente": "gutenberg",
  "downloads": 13400,
  "portada": "https://www.gutenberg.org/cache/epub/1257/pg1257.cover.medium.jpg",
  "categoria": "aventura",
  "epub": "https://www.gutenberg.org/ebooks/1257.epub3.images"
 },
 {
  "id": "top-17",
  "d": "top-dracula",
  "titulo": "Dr\u00e1cula",
  "autor": "Bram Stoker",
  "fuente": "gutenberg",
  "downloads": 13200,
  "portada": "https://www.gutenberg.org/cache/epub/58820/pg58820.cover.medium.jpg",
  "categoria": "misterio",
  "epub": "https://www.gutenberg.org/ebooks/58820.epub3.images"
 },
 {
  "id": "top-18",
  "d": "top-montecristo",
  "titulo": "El Conde de Montecristo",
  "autor": "Alexandre Dumas",
  "fuente": "gutenberg",
  "downloads": 15100,
  "portada": "https://www.gutenberg.org/cache/epub/1184/pg1184.cover.medium.jpg",
  "categoria": "aventura",
  "epub": "https://www.gutenberg.org/ebooks/1184.epub3.images"
 },
 {
  "id": "top-19",
  "d": "top-libertad",
  "titulo": "Sobre la Libertad",
  "autor": "John Stuart Mill",
  "fuente": "gutenberg",
  "downloads": 12800,
  "portada": "https://www.gutenberg.org/cache/epub/34901/pg34901.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/34901.epub3.images"
 },
 {
  "id": "top-20",
  "d": "top-gobierno",
  "titulo": "Dos Tratados sobre el Gobierno Civil",
  "autor": "John Locke",
  "fuente": "gutenberg",
  "downloads": 12500,
  "portada": "https://www.gutenberg.org/cache/epub/7370/pg7370.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/7370.epub3.images"
 },
 {
  "id": "top-21",
  "d": "top-utopia",
  "titulo": "Utop\u00eda",
  "autor": "Tom\u00e1s Moro",
  "fuente": "gutenberg",
  "downloads": 12100,
  "portada": "https://www.gutenberg.org/cache/epub/2130/pg2130.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/2130.epub3.images"
 },
 {
  "id": "top-22",
  "d": "top-democracia",
  "titulo": "La Democracia en Am\u00e9rica",
  "autor": "Alexis de Tocqueville",
  "fuente": "gutenberg",
  "downloads": 11800,
  "portada": "https://www.gutenberg.org/cache/epub/815/pg815.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/815.epub3.images"
 },
 {
  "id": "top-23",
  "d": "top-leviatan",
  "titulo": "Leviat\u00e1n",
  "autor": "Thomas Hobbes",
  "fuente": "gutenberg",
  "downloads": 11500,
  "portada": "https://www.gutenberg.org/cache/epub/3207/pg3207.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/3207.epub3.images"
 },
 {
  "id": "top-24",
  "d": "top-aristoteles-politica",
  "titulo": "Pol\u00edtica",
  "autor": "Arist\u00f3teles",
  "fuente": "gutenberg",
  "downloads": 11200,
  "portada": "https://www.gutenberg.org/cache/epub/6762/pg6762.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/6762.epub3.images"
 },
 {
  "id": "top-25",
  "d": "top-sentido-comun",
  "titulo": "Sentido Com\u00fan",
  "autor": "Thomas Paine",
  "fuente": "gutenberg",
  "downloads": 10900,
  "portada": "https://www.gutenberg.org/cache/epub/147/pg147.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/147.epub3.images"
 },
 {
  "id": "top-26",
  "d": "top-federalista",
  "titulo": "El Federalista",
  "autor": "Alexander Hamilton y James Madison",
  "fuente": "gutenberg",
  "downloads": 10600,
  "portada": "https://www.gutenberg.org/cache/epub/18/pg18.cover.medium.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/18.epub3.images"
 },
 {
  "id": "top-27",
  "d": "top-cumbres",
  "titulo": "Cumbres Borrascosas",
  "autor": "Emily Bront\u00eb",
  "fuente": "gutenberg",
  "downloads": 9800,
  "portada": "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg",
  "categoria": "romance",
  "epub": "https://www.gutenberg.org/ebooks/49836.epub3.images"
 },
 {
  "id": "top-28",
  "d": "top-iliada",
  "titulo": "La Il\u00edada",
  "autor": "Homero",
  "fuente": "gutenberg",
  "downloads": 8750,
  "portada": "https://www.gutenberg.org/cache/epub/6130/pg6130.cover.medium.jpg",
  "categoria": "cl\u00e1sicos",
  "epub": "https://www.gutenberg.org/ebooks/6130.epub3.images"
 },
 {
  "id": "top-29",
  "d": "top-odisea",
  "titulo": "La Odisea",
  "autor": "Homero",
  "fuente": "gutenberg",
  "downloads": 8600,
  "portada": "https://www.gutenberg.org/cache/epub/1727/pg1727.cover.medium.jpg",
  "categoria": "cl\u00e1sicos",
  "epub": "https://www.gutenberg.org/ebooks/1727.epub3.images"
 },
 {
  "id": "top-30",
  "d": "top-fortunata",
  "titulo": "Fortunata y Jacinta",
  "autor": "Benito P\u00e9rez Gald\u00f3s",
  "fuente": "gutenberg",
  "downloads": 7400,
  "portada": "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg",
  "categoria": "ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/17955.epub3.images"
 },
 {
  "id": "top-31",
  "d": "top-perfecta",
  "titulo": "Do\u00f1a Perfecta",
  "autor": "Benito P\u00e9rez Gald\u00f3s",
  "fuente": "gutenberg",
  "downloads": 6500,
  "portada": "https://www.gutenberg.org/cache/epub/17358/pg17358.cover.medium.jpg",
  "categoria": "ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/17358.epub3.images"
 },
 {
  "id": "top-32",
  "d": "top-pazos",
  "titulo": "Los Pazos de Ulloa",
  "autor": "Emilia Pardo Baz\u00e1n",
  "fuente": "gutenberg",
  "downloads": 5900,
  "portada": "https://www.gutenberg.org/cache/epub/15353/pg15353.cover.medium.jpg",
  "categoria": "ficci\u00f3n",
  "epub": "https://www.gutenberg.org/ebooks/15353.epub3.images"
 },
 {
  "id": "top-33",
  "d": "top-soledad",
  "titulo": "Cien A\u00f1os de Soledad",
  "autor": "Gabriel Garc\u00eda M\u00e1rquez",
  "fuente": "lumen",
  "downloads": 28500,
  "portada": "https://covers.openlibrary.org/b/id/11153218-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-34",
  "d": "top-colera",
  "titulo": "El Amor en los Tiempos del C\u00f3lera",
  "autor": "Gabriel Garc\u00eda M\u00e1rquez",
  "fuente": "lumen",
  "downloads": 22400,
  "portada": "https://covers.openlibrary.org/b/id/10096404-M.jpg",
  "categoria": "romance"
 },
 {
  "id": "top-35",
  "d": "top-rayuela",
  "titulo": "Rayuela",
  "autor": "Julio Cort\u00e1zar",
  "fuente": "lumen",
  "downloads": 18700,
  "portada": "https://covers.openlibrary.org/b/id/1047466-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-36",
  "d": "top-ficciones",
  "titulo": "Ficciones",
  "autor": "Jorge Luis Borges",
  "fuente": "lumen",
  "downloads": 24100,
  "portada": "https://covers.openlibrary.org/b/id/10832290-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-37",
  "d": "top-aleph",
  "titulo": "El Aleph",
  "autor": "Jorge Luis Borges",
  "fuente": "lumen",
  "downloads": 21900,
  "portada": "https://covers.openlibrary.org/b/id/12543210-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-38",
  "d": "top-paramo",
  "titulo": "Pedro P\u00e1ramo",
  "autor": "Juan Rulfo",
  "fuente": "lumen",
  "downloads": 19200,
  "portada": "https://covers.openlibrary.org/b/id/5419076-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-39",
  "d": "top-perros",
  "titulo": "La Ciudad y los Perros",
  "autor": "Mario Vargas Llosa",
  "fuente": "lumen",
  "downloads": 17800,
  "portada": "https://covers.openlibrary.org/b/id/3221667-M.jpg",
  "categoria": "ficci\u00f3n"
 },
 {
  "id": "top-40",
  "d": "top-cronica",
  "titulo": "Cr\u00f3nica de una Muerte Anunciada",
  "autor": "Gabriel Garc\u00eda M\u00e1rquez",
  "fuente": "lumen",
  "downloads": 16500,
  "portada": "https://covers.openlibrary.org/b/id/8489859-M.jpg",
  "categoria": "misterio"
 }
];

const formatearDescargas = (num) => {
	if (!num) return "1.2k";
	if (num >= 1000) return (num / 1000).toFixed(1) + "k";
	return String(num);
};



const LIBROS_MANGA_CURADOS = [{"id":"mga_op","titulo":"One Piece","autor":"Eiichiro Oda","fuente":"mangadex","downloads":540000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/a1c7c817-4e59-43b7-9365-09675a149a6f/2f4aca53-64c7-46ac-ae85-3bc9b3169890.png.256.jpg","url":"https://mangadex.org/title/a1c7c817-4e59-43b7-9365-09675a149a6f/one-piece","descripcion":"Monkey D. Luffy se lanza a los mares para encontrar el legendario tesoro One Piece y proclamarse Rey de los Piratas junto a la tripulación del Sombrero de Paja."},{"id":"mga_berserk","titulo":"Berserk","autor":"Kentaro Miura","fuente":"mangadex","downloads":512000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/1070e304-45e0-47b7-ac0b-5fb743ab908a.jpg.256.jpg","url":"https://mangadex.org/title/801513ba-a712-498c-8f57-cae55b38cc92/berserk","descripcion":"Guts, el implacable Espadachín Negro con la Marca del Sacrificio, desafía a los apóstoles demoníacos y su aciago destino en busca de venganza contra la Mano de Dios."},{"id":"mga_solo_leveling","titulo":"Solo Leveling (Na Honjaman Level-Up)","autor":"Chugong & DUBU","fuente":"tmo","downloads":528000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/e90bdc47-c8b9-4df7-b2c0-17641b645ee1.jpg.256.jpg","url":"https://zonatmo.com/library/manhwa/41037/solo-leveling","descripcion":"Sung Jinwoo, el cazador de rango E más débil del mundo, sobrevive milagrosamente a una mazmorra doble y despierta un sistema de misiones y niveles exclusivo."},{"id":"mga_naruto","titulo":"Naruto","autor":"Masashi Kishimoto","fuente":"mangadex","downloads":495000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/6b1eb93e-473a-4ab3-9922-1a66d2a29a4a/77c38573-fc4f-4d69-8ecb-0bc695e1ebff.jpg.256.jpg","url":"https://mangadex.org/title/6b1eb93e-473a-4ab3-9922-1a66d2a29a4a/naruto","descripcion":"Naruto Uzumaki, ninja marginado portador del Zorro de Nueve Colas, entrena con determinación inquebrantable para proteger a sus camaradas y alcanzar el título de Hokage."},{"id":"mga_dragon_ball","titulo":"Dragon Ball","autor":"Akira Toriyama","fuente":"mangadex","downloads":505000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/40bc649f-7b49-4645-859e-6cd94136e722/751dbe52-473f-42e7-9d7e-ebcbca2687a4.jpg.256.jpg","url":"https://mangadex.org/title/40bc649f-7b49-4645-859e-6cd94136e722/dragon-ball","descripcion":"Son Goku recorre los confines del planeta en busca de las místicas Esferas del Dragón junto a Bulma, superando torneos de artes marciales y salvando al universo."},{"id":"mga_bleach","titulo":"Bleach","autor":"Tite Kubo","fuente":"mangadex","downloads":442000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/239d6260-d71f-43b0-afff-074e3619e3de/694ee3d7-4b77-48f5-a836-eebbf952b719.jpg.256.jpg","url":"https://mangadex.org/title/239d6260-d71f-43b0-afff-074e3619e3de/bleach","descripcion":"Ichigo Kurosaki obtiene los poderes de Shinigami de Rukia Kuchiki y asume la misión de purificar Hollows y custodiar el equilibrio entre el mundo humano y la Sociedad de Almas."},{"id":"mga_hxh","titulo":"Hunter x Hunter","autor":"Yoshihiro Togashi","fuente":"mangadex","downloads":468000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/c5132d06-fb8c-411a-8cdd-ee4e0c476711/c9ce5672-1323-4416-83a3-a7eb443fb7ef.jpg.256.jpg","url":"https://mangadex.org/title/c5132d06-fb8c-411a-8cdd-ee4e0c476711/hunter-x-hunter","descripcion":"Gon Freecss supera el riguroso Examen de Cazador con el anhelo de encontrar a su padre Ging, descubriendo los secretos del Nen y peligrosas expediciones desconocidas."},{"id":"mga_jjk","titulo":"Jujutsu Kaisen","autor":"Gege Akutami","fuente":"comick","downloads":485000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/c52b2ce3-7f95-469c-96b0-479524fb7a1a/6d9134b2-21ea-4d02-ac2b-7c0d1c6a2aaa.jpg.256.jpg","url":"https://comick.io/comic/00-jujutsu-kaisen","descripcion":"Yuji Itadori ingiere un dedo maldito de Ryomen Sukuna y se matricula en el Colegio Técnico de Magia Metropolitana de Tokio para exorcizar espíritus y salvar vidas."},{"id":"mga_csm","titulo":"Chainsaw Man","autor":"Tatsuki Fujimoto","fuente":"mangadex","downloads":498000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/0625de02-998f-431e-b851-f3b1451e59fe.jpg.256.jpg","url":"https://mangadex.org/title/a77742b1-befd-49a4-bff5-1ad4e6b0ef7b/chainsaw-man","descripcion":"Denji se fusiona con su perro demonio motosierra Pochita y es reclutado por Makima en Seguridad Pública para cazar temibles demonios nacidos de los miedos humanos."},{"id":"mga_aot","titulo":"Attack on Titan (Shingeki no Kyojin)","autor":"Hajime Isayama","fuente":"mangakakalot","downloads":510000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/3046650a-50b7-44b3-aa89-2252493499ed/20000dc8-a83d-4c3e-862d-0b6ec644485f.jpg.256.jpg","url":"https://mangakakalot.com/search/story/shingeki_no_kyojin","descripcion":"Tras la caída de las murallas que protegían a la humanidad, Eren Jaeger jura aniquilar a todos los titanes, desentrañando una conspiración de alcances mundiales."},{"id":"mga_kny","titulo":"Demon Slayer (Kimetsu no Yaiba)","autor":"Koyoharu Gotouge","fuente":"tmo","downloads":490000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/01ebfc1a-7eb9-4a11-9650-e74f34cf3302/c4f2bb79-3da9-497d-a193-4a004bca07e0.jpg.256.jpg","url":"https://zonatmo.com/library/manga/13763/kimetsu-no-yaiba","descripcion":"Tanjiro Kamado emprende el camino del Cazador de Demonios empuñando la Respiración del Agua para sanar a su hermana Nezuko y vengar a su familia de Muzan Kibutsuji."},{"id":"mga_mha","titulo":"My Hero Academia (Boku no Hero Academia)","autor":"Kohei Horikoshi","fuente":"mangadex","downloads":455000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/4f3bcae4-2d96-440d-9323-ea8a76c83f0f/103a01a3-6cf0-4bb5-a359-598e3bfa7672.jpg.256.jpg","url":"https://mangadex.org/title/4f3bcae4-2d96-440d-9323-ea8a76c83f0f/boku-no-hero-academia","descripcion":"Izuku Midoriya nace sin poderes en una sociedad de superhumanos, pero el legendario héroe All Might le hereda el One For All para formarse en la prestigiada Academia U.A."},{"id":"mga_dn","titulo":"Death Note","autor":"Tsugumi Ohba & Takeshi Obata","fuente":"mangadex","downloads":515000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/721a3648-5221-4f10-91a3-6789a87d0ec6/11c2a138-085e-4bb2-b5e1-884ec8fc4159.jpg.256.jpg","url":"https://mangadex.org/title/721a3648-5221-4f10-91a3-6789a87d0ec6/death-note","descripcion":"Light Yagami encuentra el cuaderno de un shinigami capaz de matar a cualquiera cuyo nombre se escriba en él, desatando un colosal duelo intelectual contra el detective L."},{"id":"mga_fma","titulo":"Fullmetal Alchemist","autor":"Hiromu Arakawa","fuente":"mangadex","downloads":480000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/2f0c7247-bf84-4692-a164-9443c7b3dd62/50a6dbb4-10ec-4876-b615-5c1cfeb48354.jpg.256.jpg","url":"https://mangadex.org/title/2f0c7247-bf84-4692-a164-9443c7b3dd62/fullmetal-alchemist","descripcion":"Edward y Alphonse Elric violan el máximo tabú de la alquimia humana y recorren el país buscando la Piedra Filosofal para restaurar sus cuerpos mutilados."},{"id":"mga_tg","titulo":"Tokyo Ghoul","autor":"Sui Ishida","fuente":"mangadex","downloads":472000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/b2da1168-b39b-4357-9d78-b131cd3aa7f6/51d6c8b9-4824-4f81-9f20-fa7eeecce991.jpg.256.jpg","url":"https://mangadex.org/title/b2da1168-b39b-4357-9d78-b131cd3aa7f6/tokyo-ghoul","descripcion":"Ken Kaneki sobrevive a un ataque y es transformado en un híbrido mitad ghoul y mitad humano, debiendo navegar los sangrientos conflictos entre clanes y la policía CCG."},{"id":"mga_vs","titulo":"Vinland Saga","autor":"Makoto Yukimura","fuente":"mangadex","downloads":448000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/5dbe72eb-91b4-4b57-b8db-31a233631d88/247164a6-7fec-460d-85ce-f8f2e2beee8f.jpg.256.jpg","url":"https://mangadex.org/title/5dbe72eb-91b4-4b57-b8db-31a233631d88/vinland-saga","descripcion":"Thorfinn crece junto a la banda vikinga de Askeladd sediento de venganza por la muerte de su padre, transitando un periplo hacia la redención y la tierra pacífica de Vinland."},{"id":"mga_vagabond","titulo":"Vagabond","autor":"Takehiko Inoue","fuente":"mangadex","downloads":461000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/d35a6875-1011-477c-a4db-1e4e3704250c/029671d4-fafe-4d7a-af7b-ba52d7e1fec6.jpg.256.jpg","url":"https://mangadex.org/title/d35a6875-1011-477c-a4db-1e4e3704250c/vagabond","descripcion":"Retrato magistral de la vida del legendario espadachín Miyamoto Musashi en su peregrinación filosófica y marcial por convertirse en el guerrero invencible bajo los cielos."},{"id":"mga_monster","titulo":"Monster","autor":"Naoki Urasawa","fuente":"mangadex","downloads":458000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/a3a89e4c-1d04-4530-9b43-b684cbffca8a/4a14897d-c40d-450a-9d66-a36894c251cf.jpg.256.jpg","url":"https://mangadex.org/title/a3a89e4c-1d04-4530-9b43-b684cbffca8a/monster","descripcion":"El brillante neurocirujano Kenzo Tenma salva la vida de un niño huérfano, Johan Liebert, descubriendo años después que rescató a un sociópata asesino serial monstruoso."},{"id":"mga_20cb","titulo":"20th Century Boys","autor":"Naoki Urasawa","fuente":"mangadex","downloads":432000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/48135d94-9b88-463d-82d2-c7f465a363ee/ae58d044-3252-4752-b13c-f5f40393cb8f.jpg.256.jpg","url":"https://mangadex.org/title/48135d94-9b88-463d-82d2-c7f465a363ee/20th-century-boys","descripcion":"Kenji Endo y sus amigos de la infancia descubren que una secta liderada por el misterioso Amigo está ejecutando al pie de la letra las profecías del Libro de las Profecías de su niñez."},{"id":"mga_kingdom","titulo":"Kingdom","autor":"Yasuhisa Hara","fuente":"mangadex","downloads":425000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/0fc59530-81f7-4a00-ab4d-8ae5877c01ff/01878d65-4f40-4226-9a25-9ec5f1fcfa44.jpg.256.jpg","url":"https://mangadex.org/title/0fc59530-81f7-4a00-ab4d-8ae5877c01ff/kingdom","descripcion":"En la China de los Reinos Combatientes, el huérfano de guerra Shin combate codo a codo con el joven rey Ei Sei para unificar toda China bajo un único estandarte."},{"id":"mga_punpun","titulo":"Oyasumi Punpun (Goodnight Punpun)","autor":"Inio Asano","fuente":"mangadex","downloads":418000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/46101c77-ccab-40a4-b0a3-a74c431dbbe0/225c9b68-e320-432d-9864-7c30aa709e88.jpg.256.jpg","url":"https://mangadex.org/title/46101c77-ccab-40a4-b0a3-a74c431dbbe0/oyasumi-punpun","descripcion":"Crónica descarnada y poética del paso a la adultez del joven Punpun Onodera, enfrentando disfunciones familiares, obsesiones juveniles y la búsqueda de significado."},{"id":"mga_parasyte","titulo":"Parasyte (Kiseijuu)","autor":"Hitoshi Iwaaki","fuente":"mangadex","downloads":412000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/1c28c8d8-5f21-4791-884d-2e673030d350/93d7c570-8b1b-432a-bd10-fbbcb15d656f.jpg.256.jpg","url":"https://mangadex.org/title/1c28c8d8-5f21-4791-884d-2e673030d350/kiseijuu","descripcion":"Shinichi Izumi convive simbióticamente con Migi, un parásito alienígena que invadió su mano derecha, viéndose obligado a combatir a otros parásitos devoradores de humanos."},{"id":"mga_gantz","titulo":"Gantz","autor":"Hiroya Oku","fuente":"mangadex","downloads":421000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/01f654f1-6784-4869-95e2-e192ff47d848/d13d7110-ea23-450b-a010-86714a87c126.jpg.256.jpg","url":"https://mangadex.org/title/01f654f1-6784-4869-95e2-e192ff47d848/gantz","descripcion":"Kei Kurono y Masaru Kato mueren arrollados por un tren subterráneo y son revividos en una misteriosa habitación dominada por una esfera negra que los envía a cazar extraterrestres."},{"id":"mga_jojo","titulo":"JoJo's Bizarre Adventure (Steel Ball Run)","autor":"Hirohiko Araki","fuente":"mangadex","downloads":476000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/1044287a-73df-48d0-b0b2-5327f32dd651/7f3918a2-263a-4dd8-80f2-b8833973a027.jpg.256.jpg","url":"https://mangadex.org/title/1044287a-73df-48d0-b0b2-5327f32dd651/jojo-s-bizarre-adventure-part-7-steel-ball-run","descripcion":"Johnny Joestar y Gyro Zeppeli compiten a través de los Estados Unidos en una trepidante carrera a caballo de costa a costa persiguiendo las Reliquias del Cuerpo Sagrado."},{"id":"mga_tog","titulo":"Tower of God (Sin-ui Tap)","autor":"SIU (Lee Jong-hui)","fuente":"tmo","downloads":445000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/c1130d22-2a7e-41d3-a551-ce03db2eb23b/d44cb582-db07-4221-a4b5-ca31d4e0e561.jpg.256.jpg","url":"https://zonatmo.com/library/manhwa/8267/tower-of-god","descripcion":"Bam el Vigésimo Quinto entra a la colosal Torre de Dios para reencontrarse con Rachel, superando letales pruebas piso a piso junto a Khun y Rak."},{"id":"mga_orv","titulo":"Omniscient Reader's Viewpoint","autor":"sing N song & Sleepy-C","fuente":"tmo","downloads":475000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/e6f43e5c-05b1-4f16-ac67-bc18774f1073/3c5b81f1-3221-419a-9e12-4043b8be925f.jpg.256.jpg","url":"https://zonatmo.com/library/manhwa/50125/omniscient-readers-viewpoint","descripcion":"Kim Dokja es el único lector que terminó la novela web 'Tres Formas de Sobrevivir en un Mundo Apocalíptico', cuando de pronto la realidad se transforma en la trama de dicha historia."},{"id":"mga_tbate","titulo":"The Beginning After the End","autor":"TurtleMe & Fuyuki23","fuente":"comick","downloads":465000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/49a1bf04-d754-46ab-859a-5eb042d76587/90ff39ea-41df-4b51-a1cb-9ba3f938d87b.jpg.256.jpg","url":"https://comick.io/comic/00-the-beginning-after-the-end","descripcion":"El Rey Grey renace como Arthur Leywin en un fascinante mundo de magia y monstruos, dispuesto a corregir los errores de su solitaria vida pasada y proteger a sus seres queridos."},{"id":"mga_lookism","titulo":"Lookism","autor":"Park Tae-joon","fuente":"tmo","downloads":410000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/42a3cfc1-8409-43c3-b46f-c9676ec4e0aa/b39cfb30-176f-4318-97f6-e2652ad750fc.jpg.256.jpg","url":"https://zonatmo.com/library/manhwa/11382/lookism","descripcion":"Park Hyung Suk, víctima constante de acoso escolar por su apariencia, despierta un día con la capacidad de alternar entre su cuerpo original y uno atlético, atractivo y perfecto."},{"id":"mga_noblesse","titulo":"Noblesse","autor":"Son Je-ho & Lee Kwang-su","fuente":"mangakakalot","downloads":405000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/98319f61-26c6-48eb-b1e7-bbdfb3a985f3/51bfe961-f4f7-4a00-abf9-c689626b9a21.jpg.256.jpg","url":"https://mangakakalot.com/search/story/noblesse","descripcion":"Cadis Etrama Di Raizel despierta tras un letargo de 820 años e ingresa a una escuela moderna con la ayuda de su leal sirviente Frankenstein para conocer el pacífico mundo actual."},{"id":"mga_bastard","titulo":"Bastard","autor":"Kim Carnby & Hwang Young-chan","fuente":"mangadex","downloads":395000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/f2c97442-8815-4670-bbcf-cf30c72e2cfc/e623eb63-2ae2-49ce-ae97-9ee1f67fba0b.jpg.256.jpg","url":"https://mangadex.org/title/f2c97442-8815-4670-bbcf-cf30c72e2cfc/bastard","descripcion":"Jin Seon vive con el terror constante de ser el cómplice forzado de su padre, un respetado hombre de negocios que en secreto es un metódico y sanguinario asesino serial."},{"id":"mga_sweet_home","titulo":"Sweet Home","autor":"Kim Carnby & Hwang Young-chan","fuente":"mangadex","downloads":415000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/6c367ec9-7988-4671-886d-317ecb2e77e2/98a3f5a2-3f8d-4b5f-8703-911470438cfd.jpg.256.jpg","url":"https://mangadex.org/title/6c367ec9-7988-4671-886d-317ecb2e77e2/sweet-home","descripcion":"Cha Hyun-soo, un joven ermitaño recluido en su apartamento tras perder a su familia, debe resistir una pandemia apocalíptica donde los humanos mutan en monstruos basados en sus deseos."},{"id":"mga_eleceed","titulo":"Eleceed","autor":"Son Je-ho & ZHENA","fuente":"tmo","downloads":435000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/cca83eb1-460c-4ff6-9cb3-ee328e33dc92/8c505432-8409-4e78-bc48-c8a77f9899f1.jpg.256.jpg","url":"https://zonatmo.com/library/manhwa/43085/eleceed","descripcion":"Jiwoo, un muchacho generoso y veloz que rescata gatos callejeros, salva a Kayden, el despertado más poderoso del planeta que se ocultó dentro del cuerpo de un gato regordete."},{"id":"mga_spy_x_family","titulo":"Spy x Family","autor":"Tatsuya Endo","fuente":"mangadex","downloads":485000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/65074e63-4458-472e-8488-8ff39e160a0f/104f216f-c1f0-424a-9b7e-967c7117c09c.jpg.256.jpg","url":"https://mangadex.org/title/65074e63-4458-472e-8488-8ff39e160a0f/spy-x-family","descripcion":"El espía 'Twilight' forma la familia Forger con una asesina letal y una niña telépata para cumplir la Operación Strix, manteniendo todos sus identidades secretas ocultas."},{"id":"mga_kimi_ni_todoke","titulo":"Kimi ni Todoke (Llegando a ti)","autor":"Karuho Shiina","fuente":"mangadex","downloads":385000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/1a8f9cbe-ae7f-4f51-b957-c5113cc0f69a/f524f21d-7ea8-4cf2-83b6-13a30c8ef288.jpg.256.jpg","url":"https://mangadex.org/title/1a8f9cbe-ae7f-4f51-b957-c5113cc0f69a/kimi-ni-todoke","descripcion":"Sawako Kuronuma, apodada 'Sadako' por su apariencia tímida, descubre la calidez de la amistad y el amor sincero al conectar con el popular y alegre Kazehaya."},{"id":"mga_nana","titulo":"Nana","autor":"Ai Yazawa","fuente":"mangadex","downloads":410000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/7a8bc944-7740-4d55-89f5-19eec81e359c/4a107ef4-61c1-4b13-90d5-b6d36e788099.jpg.256.jpg","url":"https://mangadex.org/title/7a8bc944-7740-4d55-89f5-19eec81e359c/nana","descripcion":"Nana Osaki, vocalista punk rock, y Nana Komatsu, una muchacha romántica e ingenua, coinciden en Tokio y forjan una amistad inolvidable marcada por la música y el desamor."},{"id":"mga_fruits_basket","titulo":"Fruits Basket","autor":"Natsuki Takaya","fuente":"mangadex","downloads":420000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/7d0d0f50-3277-4581-817c-0e3368a5c3cb/0c41d1a8-c89b-4375-9b26-444a7f0525d8.jpg.256.jpg","url":"https://mangadex.org/title/7d0d0f50-3277-4581-817c-0e3368a5c3cb/fruits-basket","descripcion":"Tohru Honda se muda con la enigmática familia Sohma y descubre su secreto milenario: cuando son abrazados por el sexo opuesto, se transforman en los animales del zodiaco chino."},{"id":"mga_horimiya","titulo":"Horimiya","autor":"HERO & Daisuke Hagiwara","fuente":"mangadex","downloads":460000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/a25e46ec-3092-4ba4-8388-bf1473c44374/61a7a2a5-67c0-4355-8f6a-46387063d898.jpg.256.jpg","url":"https://mangadex.org/title/a25e46ec-3092-4ba4-8388-bf1473c44374/horimiya","descripcion":"Hori, una estudiante modélica en la escuela, y Miyamura, un chico reservado con piercings y tatuajes, comparten sus verdaderas facetas privadas naciendo una tierna intimidad."},{"id":"mga_frieren","titulo":"Frieren: Beyond Journey's End (Sousou no Frieren)","autor":"Kanehito Yamada & Tsukasa Abe","fuente":"mangadex","downloads":495000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/b0b721ff-c388-4486-aa0f-c00bcbb32144/f891eb34-31ea-42b7-a365-5cba8973d09a.jpg.256.jpg","url":"https://mangadex.org/title/b0b721ff-c388-4486-aa0f-c00bcbb32144/sousou-no-frieren","descripcion":"Tras derrotar al Rey Demonio, la elfa Frieren ve envejecer y morir a sus compañeros humanos, iniciando un nuevo viaje para comprender el valor efímero de las emociones humanas."},{"id":"mga_mushoku","titulo":"Mushoku Tensei: Jobless Reincarnation","autor":"Rifujin na Magonote & Yuka Fujikawa","fuente":"mangadex","downloads":470000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/360e334a-9311-4b77-8c38-89c0b24036bf/83f6f1c4-9721-4d1a-965a-063fb5aa0182.jpg.256.jpg","url":"https://mangadex.org/title/360e334a-9311-4b77-8c38-89c0b24036bf/mushoku-tensei-isekai-ittara-honki-dasu","descripcion":"Un desempleado de 34 años reencarna como el niño prodigio Rudeus Greyrat en un mundo de espadas y hechicería, jurando darlo todo para vivir plenamente y sin arrepentimientos."},{"id":"mga_eminence","titulo":"The Eminence in Shadow (Kage no Jitsuryokusha)","autor":"Daisuke Aizawa & Anri Sakano","fuente":"mangadex","downloads":482000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/77bee52c-d2d6-44ad-a33a-1734c1fe696a/6079dd31-838b-4d61-87c4-121f3ad19158.jpg.256.jpg","url":"https://mangadex.org/title/77bee52c-d2d6-44ad-a33a-1734c1fe696a/kage-no-jitsuryokusha-ni-naritakute","descripcion":"Cid Kagenou finge ser un personaje secundario insignificante mientras lidera en las sombras la organización Shadow Garden, sin sospechar que sus delirios inventados son 100% reales."},{"id":"mga_kusuriya","titulo":"The Apothecary Diaries (Kusuriya no Hitorigoto)","autor":"Natsu Hyuuga & Nekokurage","fuente":"mangadex","downloads":478000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/542a420b-29d0-449e-b99b-43d7890b05b9/f8c33ea9-d60c-4396-857c-171b12368c8b.jpg.256.jpg","url":"https://mangadex.org/title/542a420b-29d0-449e-b99b-43d7890b05b9/kusuriya-no-hitorigoto","descripcion":"Maomao, una sagaz boticaria secuestrada para servir en el palacio imperial, resuelve envenenamientos e intrigas dinásticas valiéndose de sus extensos conocimientos médicos."},{"id":"mga_dandadan","titulo":"Dandadan","autor":"Yukinobu Tatsu","fuente":"mangadex","downloads":465000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/1dd10f9b-64cf-4ea9-a400-f99996d913d8/2d308006-2581-42e7-a982-1e967a57a55c.jpg.256.jpg","url":"https://mangadex.org/title/1dd10f9b-64cf-4ea9-a400-f99996d913d8/dandadan","descripcion":"Momo Ayase cree en fantasmas y Okarun cree en alienígenas; al desafiarse mutuamente desatan una demencial vorágine de poderes psíquicos, maldiciones y batallas extraterrestres."},{"id":"mga_oshi_no_ko","titulo":"Oshi no Ko","autor":"Aka Akasaka & Mengo Yokoyari","fuente":"mangadex","downloads":472000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/2961d701-0235-4927-8a4c-529a6503024b/0d68f76d-a510-4822-a989-106c64639e4a.jpg.256.jpg","url":"https://mangadex.org/title/2961d701-0235-4927-8a4c-529a6503024b/oshi-no-ko","descripcion":"El ginecólogo Gorou reencarna como Aqua Hoshino, hijo gemelo de la idol estelar Ai, y se sumerge en las sombras de la industria del entretenimiento japonés para descubrir una verdad oculta."},{"id":"mga_blue_lock","titulo":"Blue Lock","autor":"Muneyuki Kaneshiro & Yusuke Nomura","fuente":"mangadex","downloads":480000,"categoria":"manga","idioma":"es","portada":"https://uploads.mangadex.org/covers/2c7921a2-51ff-4849-a3ee-8ec8d60d3d5f/37bb900f-ca21-4f4c-8069-b5a93947b198.jpg.256.jpg","url":"https://mangadex.org/title/2c7921a2-51ff-4849-a3ee-8ec8d60d3d5f/blue-lock","descripcion":"Tresclentos delanteros juveniles son reclutados en la instalación Blue Lock bajo un régimen implacable de eliminación para forjar al delantero más egoísta y letal del fútbol mundial."}];

const LIBROS_BIBLIAS_CURADOS = [{"id": "bib-1", "d": "bib-reina-valera-1909", "titulo": "Santa Biblia Reina-Valera (1909)", "autor": "Casiodoro de Reina y Cipriano de Valera", "fuente": "gutenberg", "downloads": 98500, "portada": "https://covers.openlibrary.org/b/id/8231845-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/la-santa-biblia-reina-valera-1909/La%20Santa%20Biblia%20Reina-Valera%201909.pdf", "descripcion": "Traducción histórica castellana fundamental de las Sagradas Escrituras a partir del Texto Masorético y Textus Receptus."}, {"id": "bib-2", "d": "bib-reina-valera-1960", "titulo": "Santa Biblia Reina-Valera Revisión 1960", "autor": "Sociedades Bíblicas Unidas", "fuente": "archive", "downloads": 92400, "portada": "https://archive.org/services/img/biblia-reina-valera-1960-completa", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/biblia-reina-valera-1960-completa/Biblia%20Reina%20Valera%201960.epub", "fileUrl": "https://archive.org/download/biblia-reina-valera-1960-completa/Biblia%20Reina%20Valera%201960.pdf", "descripcion": "La versión clásica más leída y memorizada en el mundo hispanohablante evangélico y protestante."}, {"id": "bib-3", "d": "bib-jerusalen", "titulo": "Biblia de Jerusalén (Edición Española)", "autor": "Escuela Bíblica y Arqueológica de Jerusalén", "fuente": "archive", "downloads": 88700, "portada": "https://archive.org/services/img/biblia-de-jerusalen-1975-edicion-espanola", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/biblia-de-jerusalen-1975-edicion-espanola/Biblia%20de%20Jerusalen.epub", "fileUrl": "https://archive.org/download/biblia-de-jerusalen-1975-edicion-espanola/Biblia%20de%20Jerusalen.pdf", "descripcion": "Traducción exegética y teológica de máxima autoridad académica, célebre por su rigor filológico y abundantes notas."}, {"id": "bib-4", "d": "bib-del-oso-1569", "titulo": "La Biblia del Oso (Basilea, 1569)", "autor": "Casiodoro de Reina", "fuente": "archive", "downloads": 64300, "portada": "https://archive.org/services/img/la-biblia-del-oso-1569-facsimil", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/la-biblia-del-oso-1569-facsimil/Biblia_del_Oso_1569.epub", "fileUrl": "https://archive.org/download/la-biblia-del-oso-1569-facsimil/Biblia_del_Oso_1569.pdf", "descripcion": "Primera traducción completa de la Biblia al idioma castellano desde las lenguas originales hebrea y griega."}, {"id": "bib-5", "d": "bib-del-cantaro-1602", "titulo": "La Biblia del Cántaro (Ámsterdam, 1602)", "autor": "Cipriano de Valera", "fuente": "archive", "downloads": 51200, "portada": "https://archive.org/services/img/biblia-del-cantaro-1602", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/biblia-del-cantaro-1602/Biblia_del_Cantaro_1602.epub", "fileUrl": "https://archive.org/download/biblia-del-cantaro-1602/Biblia_del_Cantaro_1602.pdf", "descripcion": "Célebre primera gran revisión de la Biblia del Oso tras veinte años de esmerada labor de Cipriano de Valera."}, {"id": "bib-6", "d": "bib-torres-amat", "titulo": "Sagrada Biblia Torres Amat (1825)", "autor": "Félix Torres Amat y José Miguel Petisco", "fuente": "archive", "downloads": 47900, "portada": "https://archive.org/services/img/sagrada-biblia-torres-amat-1825", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/sagrada-biblia-torres-amat-1825/Sagrada_Biblia_Torres_Amat.epub", "fileUrl": "https://archive.org/download/sagrada-biblia-torres-amat-1825/Sagrada_Biblia_Torres_Amat.pdf", "descripcion": "Traducción monumental al castellano de la Vulgata Latina, referencia católica hispana durante más de un siglo."}, {"id": "bib-7", "d": "bib-vulgata-latina", "titulo": "Biblia Sacra Vulgata (Editio Clementina)", "autor": "San Jerónimo de Estridón", "fuente": "gutenberg", "downloads": 58900, "portada": "https://covers.openlibrary.org/b/id/11145620-M.jpg", "categoria": "biblias", "idioma": "la", "epub": "https://www.gutenberg.org/ebooks/8294.epub3.images", "fileUrl": "https://archive.org/download/bibliasacravulgataclementina/BibliaSacraVulgata.pdf", "descripcion": "Texto latino milenario traducido por San Jerónimo en el siglo IV, canon occidental de la Iglesia Católica."}, {"id": "bib-8", "d": "bib-septuaginta-lxx", "titulo": "Septuaginta LXX (Antiguo Testamento Griego)", "autor": "Los Setenta Sabios de Alejandría", "fuente": "archive", "downloads": 43500, "portada": "https://archive.org/services/img/septuaginta-lxx-greek-old-testament", "categoria": "biblias", "idioma": "el", "epub": "https://archive.org/download/septuaginta-lxx-greek-old-testament/Septuaginta_LXX.epub", "fileUrl": "https://archive.org/download/septuaginta-lxx-greek-old-testament/Septuaginta_LXX.pdf", "descripcion": "La traducción griega koiné del Antiguo Testamento realizada entre los siglos III y II a. C. en Alejandría."}, {"id": "bib-9", "d": "bib-nuevo-testamento-griego", "titulo": "Novum Testamentum Graece (Textus Receptus)", "autor": "Erasmo de Róterdam y Robert Estienne", "fuente": "gutenberg", "downloads": 46200, "portada": "https://covers.openlibrary.org/b/id/7943210-M.jpg", "categoria": "biblias", "idioma": "el", "epub": "https://www.gutenberg.org/ebooks/8917.epub3.images", "fileUrl": "https://archive.org/download/novumtestamentumgraece1550/NovumTestamentumGraece.pdf", "descripcion": "El texto original griego del Nuevo Testamento base de la Reforma y de las grandes traducciones renacentistas."}, {"id": "bib-10", "d": "bib-king-james-kjv", "titulo": "The Holy Bible (King James Version, 1611)", "autor": "Comisión de Eruditos del Rey Jacobo I", "fuente": "gutenberg", "downloads": 115000, "portada": "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg", "categoria": "biblias", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/kingjamesbible1611/KJV1611.pdf", "descripcion": "Obra cumbre de la lengua inglesa y traducción bíblica más influyente de la literatura anglosajona."}, {"id": "bib-11", "d": "bib-lutero-alemana", "titulo": "Die Bibel nach der Übersetzung Martin Luthers (1545)", "autor": "Martín Lutero", "fuente": "gutenberg", "downloads": 39800, "portada": "https://covers.openlibrary.org/b/id/8312900-M.jpg", "categoria": "biblias", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/27599.epub3.images", "fileUrl": "https://archive.org/download/diebibel-martin-luther-1545/Lutherbibel.pdf", "descripcion": "Traducción fundacional que unificó y moldeó el idioma alemán moderno de alta calidad literaria."}, {"id": "bib-12", "d": "bib-louis-segond-frances", "titulo": "La Sainte Bible (Traduction Louis Segond, 1910)", "autor": "Louis Segond", "fuente": "gutenberg", "downloads": 38400, "portada": "https://covers.openlibrary.org/b/id/6429180-M.jpg", "categoria": "biblias", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/18790.epub3.images", "fileUrl": "https://archive.org/download/lasaintebible-louis-segond-1910/Segond1910.pdf", "descripcion": "La traducción francesa más respetada y difundida en el mundo de habla francesa."}, {"id": "bib-13", "d": "bib-joao-almeida-portugues", "titulo": "A Bíblia Sagrada (João Ferreira de Almeida, 1848)", "autor": "João Ferreira de Almeida", "fuente": "gutenberg", "downloads": 36100, "portada": "https://covers.openlibrary.org/b/id/7921340-M.jpg", "categoria": "biblias", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/17277.epub3.images", "fileUrl": "https://archive.org/download/bibliasagrada-almeida-1848/Almeida1848.pdf", "descripcion": "La traducción de referencia histórica y devocional por antonomasia de la lengua portuguesa."}, {"id": "bib-14", "d": "bib-giovanni-diodati-italiano", "titulo": "La Sacra Bibbia (Giovanni Diodati, 1607)", "autor": "Giovanni Diodati", "fuente": "gutenberg", "downloads": 29800, "portada": "https://covers.openlibrary.org/b/id/8112340-M.jpg", "categoria": "biblias", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/19717.epub3.images", "fileUrl": "https://archive.org/download/lasacrabibbia-giovanni-diodati/Diodati1607.pdf", "descripcion": "Clásica traducción italiana renacentista realizada directamente de los textos hebreos y griegos."}, {"id": "bib-15", "d": "bib-las-americas-lbla", "titulo": "La Biblia de las Américas (LBLA)", "autor": "The Lockman Foundation", "fuente": "archive", "downloads": 54200, "portada": "https://archive.org/services/img/la-biblia-de-las-americas-lbla-completa", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/la-biblia-de-las-americas-lbla-completa/LBLA_Completa.epub", "fileUrl": "https://archive.org/download/la-biblia-de-las-americas-lbla-completa/LBLA_Completa.pdf", "descripcion": "Traducción de equivalencia formal estricta con precisión léxica y fidelidad a las estructuras gramaticales originales."}, {"id": "bib-16", "d": "bib-dios-habla-hoy-dhh", "titulo": "Dios Habla Hoy: La Biblia con Deuterocanónicos", "autor": "Sociedades Bíblicas Unidas", "fuente": "archive", "downloads": 56700, "portada": "https://archive.org/services/img/dios-habla-hoy-biblia-edicion-interconfesional", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/dios-habla-hoy-biblia-edicion-interconfesional/DHH_Interconfesional.epub", "fileUrl": "https://archive.org/download/dios-habla-hoy-biblia-edicion-interconfesional/DHH_Interconfesional.pdf", "descripcion": "Edición ecuménica e interconfesional en castellano contemporáneo con equivalencia dinámica accesible a todos los lectores."}, {"id": "bib-17", "d": "bib-latinoamericana-1972", "titulo": "Biblia Latinoamericana Pastoral (1972)", "autor": "Bernardo Hurault y Ramón Ricciardi", "fuente": "archive", "downloads": 61800, "portada": "https://archive.org/services/img/biblia-latinoamericana-pastoral-1972", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/biblia-latinoamericana-pastoral-1972/Biblia_Latinoamericana.epub", "fileUrl": "https://archive.org/download/biblia-latinoamericana-pastoral-1972/Biblia_Latinoamericana.pdf", "descripcion": "Edición pastoral enfocada en la realidad social, espiritual y comunitaria del pueblo latinoamericano."}, {"id": "bib-18", "d": "bib-nacat-colunga-1944", "titulo": "Sagrada Biblia Nácar-Colunga (1944)", "autor": "Eloíno Nácar Fuster y Alberto Colunga", "fuente": "archive", "downloads": 48300, "portada": "https://archive.org/services/img/sagrada-biblia-nacar-colunga-1944", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/sagrada-biblia-nacar-colunga-1944/Nacar_Colunga_1944.epub", "fileUrl": "https://archive.org/download/sagrada-biblia-nacar-colunga-1944/Nacar_Colunga_1944.pdf", "descripcion": "Primera traducción católica directa de los textos originales hebreo, arameo y griego aprobada en lengua castellana."}, {"id": "bib-19", "d": "bib-straubinger-1951", "titulo": "Biblia Platense comentada por Monseñor Straubinger (1951)", "autor": "Juan Straubinger", "fuente": "archive", "downloads": 42100, "portada": "https://archive.org/services/img/biblia-platense-juan-straubinger", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/biblia-platense-juan-straubinger/Biblia_Straubinger.epub", "fileUrl": "https://archive.org/download/biblia-platense-juan-straubinger/Biblia_Straubinger.pdf", "descripcion": "Célebre por la profundidad de sus notas exegéticas y teológicas concebidas para la meditación devocional rigurosa."}, {"id": "bib-20", "d": "bib-nueva-biblia-espanola", "titulo": "Nueva Biblia Española", "autor": "Luis Alonso Schökel y Juan Mateos", "fuente": "archive", "downloads": 39500, "portada": "https://archive.org/services/img/nueva-biblia-espanola-alonso-schokel", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/nueva-biblia-espanola-alonso-schokel/Nueva_Biblia_Espanola.epub", "fileUrl": "https://archive.org/download/nueva-biblia-espanola-alonso-schokel/Nueva_Biblia_Espanola.pdf", "descripcion": "Considerada una joya de la prosa castellana por su fuerza lírica, fluidez estilística y precisión poética."}, {"id": "bib-21", "d": "bib-scio-san-miguel-1790", "titulo": "La Biblia Vulgata traducida al español (1790)", "autor": "Felipe Scío de San Miguel", "fuente": "archive", "downloads": 31400, "portada": "https://archive.org/services/img/la-biblia-vulgata-felipe-scio-de-san-miguel", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/la-biblia-vulgata-felipe-scio-de-san-miguel/Biblia_Scio_San_Miguel.epub", "fileUrl": "https://archive.org/download/la-biblia-vulgata-felipe-scio-de-san-miguel/Biblia_Scio_San_Miguel.pdf", "descripcion": "Primera traducción católica completa de la Biblia impresa en suelo peninsular español por encargo del rey Carlos III."}, {"id": "bib-22", "d": "bib-nuevo-testamento-valera-1596", "titulo": "El Testamento Nuevo de Nuestro Señor Jesucristo (1596)", "autor": "Cipriano de Valera", "fuente": "archive", "downloads": 28900, "portada": "https://archive.org/services/img/el-testamento-nuevo-cipriano-de-valera-1596", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/el-testamento-nuevo-cipriano-de-valera-1596/NT_Valera_1596.epub", "fileUrl": "https://archive.org/download/el-testamento-nuevo-cipriano-de-valera-1596/NT_Valera_1596.pdf", "descripcion": "Primera edición londinense revisada por Cipriano de Valera del Nuevo Testamento previo a la Biblia del Cántaro."}, {"id": "bib-23", "d": "bib-salmos-david-reina-valera", "titulo": "El Libro de los Salmos de David", "autor": "Rey David y Sabios Hebreos", "fuente": "gutenberg", "downloads": 67200, "portada": "https://covers.openlibrary.org/b/id/8319200-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/el-libro-de-los-salmos-david/Salmos_David.pdf", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Schubert_-_Ave_Maria.ogg", "descripcion": "Los 150 salmos poéticos de alabanza, súplica, consuelo y gratitud con la cadencia de la Reina-Valera."}, {"id": "bib-24", "d": "bib-proverbios-salomon", "titulo": "El Libro de los Proverbios de Salomón", "autor": "Rey Salomón", "fuente": "gutenberg", "downloads": 62400, "portada": "https://covers.openlibrary.org/b/id/8410290-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/proverbios-salomon-rv/Proverbios_Salomon.pdf", "descripcion": "Consejos perennes de prudencia, discernimiento moral y sabiduría práctica para gobernar la vida."}, {"id": "bib-25", "d": "bib-los-evangelios-san-mateo", "titulo": "El Santo Evangelio según San Mateo", "autor": "San Mateo Apóstol", "fuente": "archive", "downloads": 58300, "portada": "https://covers.openlibrary.org/b/id/8119040-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/evangelio-segun-san-mateo/Evangelio_San_Mateo.epub", "fileUrl": "https://archive.org/download/evangelio-segun-san-mateo/Evangelio_San_Mateo.pdf", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Brandenburg_No3_1.ogg", "descripcion": "El relato del ministerio de Jesucristo destacando el Sermón de la Montaña y el cumplimiento de las profecías mesiánicas."}, {"id": "bib-26", "d": "bib-los-evangelios-san-juan", "titulo": "El Santo Evangelio según San Juan", "autor": "San Juan Evangelista", "fuente": "archive", "downloads": 65100, "portada": "https://covers.openlibrary.org/b/id/8228190-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/evangelio-segun-san-juan/Evangelio_San_Juan.epub", "fileUrl": "https://archive.org/download/evangelio-segun-san-juan/Evangelio_San_Juan.pdf", "descripcion": "El evangelio teológico y contemplativo por excelencia: «En el principio era el Verbo, y el Verbo era con Dios»."}, {"id": "bib-27", "d": "bib-apocalipsis-san-juan", "titulo": "El Apocalipsis o Revelación de San Juan", "autor": "San Juan Apóstol", "fuente": "archive", "downloads": 59900, "portada": "https://covers.openlibrary.org/b/id/7943290-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/el-apocalipsis-san-juan/Apocalipsis_San_Juan.epub", "fileUrl": "https://archive.org/download/el-apocalipsis-san-juan/Apocalipsis_San_Juan.pdf", "descripcion": "La deslumbrante profecía del triunfo final de la justicia, el juicio y la creación de un cielo nuevo y una tierra nueva."}, {"id": "bib-28", "d": "bib-el-genesis", "titulo": "El Libro del Génesis: Los Orígenes", "autor": "Profeta Moisés", "fuente": "archive", "downloads": 52100, "portada": "https://covers.openlibrary.org/b/id/8499210-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/libro-genesis-origenes/Genesis.epub", "fileUrl": "https://archive.org/download/libro-genesis-origenes/Genesis.pdf", "descripcion": "La creación del mundo, el jardín del Edén, el diluvio universal y el llamado a los patriarcas Abraham, Isaac y Jacob."}, {"id": "bib-29", "d": "bib-el-exodo", "titulo": "El Libro del Éxodo: La Liberación", "autor": "Profeta Moisés", "fuente": "archive", "downloads": 48700, "portada": "https://covers.openlibrary.org/b/id/8512100-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/libro-exodo-liberacion/Exodo.epub", "fileUrl": "https://archive.org/download/libro-exodo-liberacion/Exodo.pdf", "descripcion": "La salida de Egipto, las diez plagas, el paso del Mar Rojo y la proclamación de los Diez Mandamientos en el monte Sinaí."}, {"id": "bib-30", "d": "bib-ecclesiastes", "titulo": "El Libro de Eclesiastés (Qohélet): Vanidad de Vanidades", "autor": "Rey Salomón", "fuente": "gutenberg", "downloads": 46800, "portada": "https://covers.openlibrary.org/b/id/8612140-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/eclesiastes-qohelet/Eclesiastes.pdf", "descripcion": "Meditación filosófica y existencial cumbre sobre el paso inexorable del tiempo, el trabajo humano y el sentido de la existencia."}, {"id": "bib-31", "d": "bib-cantar-de-los-cantares", "titulo": "El Cantar de los Cantares de Salomón", "autor": "Rey Salomón", "fuente": "gutenberg", "downloads": 49200, "portada": "https://covers.openlibrary.org/b/id/5144315-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "fileUrl": "https://archive.org/download/cantar-cantares-salomon/Cantar_de_los_Cantares.pdf", "descripcion": "El más excelso poema nupcial de amor, pasión y fidelidad mística en la literatura universal de todos los tiempos."}, {"id": "bib-32", "d": "bib-isaias-el-profeta", "titulo": "El Libro del Profeta Isaías", "autor": "Profeta Isaías", "fuente": "archive", "downloads": 43200, "portada": "https://covers.openlibrary.org/b/id/8710200-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/libro-profeta-isaias/Isaias.epub", "fileUrl": "https://archive.org/download/libro-profeta-isaias/Isaias.pdf", "descripcion": "Llamado profético a la compasión, cánticos del siervo sufriente y visiones sublimes de paz universal para todas las naciones."}, {"id": "bib-33", "d": "bib-epistolas-san-pablo", "titulo": "Las Epístolas de San Pablo a las Iglesias", "autor": "San Pablo Apóstol", "fuente": "archive", "downloads": 54100, "portada": "https://covers.openlibrary.org/b/id/8812400-M.jpg", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/epistolas-san-pablo-iglesias/Epistolas_San_Pablo.epub", "fileUrl": "https://archive.org/download/epistolas-san-pablo-iglesias/Epistolas_San_Pablo.pdf", "descripcion": "Romanos, Corintios, Gálatas y Efesios: la arquitectura doctrinal del cristianismo primitivo y el himno al amor de 1 Corintios 13."}, {"id": "bib-34", "d": "bib-nuevo-testamento-interlineal", "titulo": "Nuevo Testamento Interlineal Griego-Español", "autor": "Francisco Lacueva", "fuente": "archive", "downloads": 39700, "portada": "https://archive.org/services/img/nuevo-testamento-interlineal-griego-espanol", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/nuevo-testamento-interlineal-griego-espanol/NT_Interlineal.epub", "fileUrl": "https://archive.org/download/nuevo-testamento-interlineal-griego-espanol/NT_Interlineal.pdf", "descripcion": "Texto griego koiné con traducción castellana literal bajo cada vocablo y análisis morfológico de precisión."}, {"id": "bib-35", "d": "bib-antiguo-testamento-interlineal-hebreo", "titulo": "Antiguo Testamento Interlineal Hebreo-Español", "autor": "Ricardo Cerni", "fuente": "archive", "downloads": 36800, "portada": "https://archive.org/services/img/antiguo-testamento-interlineal-hebreo-espanol", "categoria": "biblias", "idioma": "he", "epub": "https://archive.org/download/antiguo-testamento-interlineal-hebreo-espanol/AT_Interlineal.epub", "fileUrl": "https://archive.org/download/antiguo-testamento-interlineal-hebreo-espanol/AT_Interlineal.pdf", "descripcion": "El Texto Masorético original hebreo y arameo con traducción literal y claves gramaticales para estudio bíblico profundo."}, {"id": "bib-36", "d": "bib-traduccion-mundo-nuevo", "titulo": "Traducción del Nuevo Mundo de las Santas Escrituras", "autor": "Comité de Traducción Bíblica", "fuente": "archive", "downloads": 41200, "portada": "https://archive.org/services/img/traduccion-del-nuevo-mundo-1987", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/traduccion-del-nuevo-mundo-1987/TNM_1987.epub", "fileUrl": "https://archive.org/download/traduccion-del-nuevo-mundo-1987/TNM_1987.pdf", "descripcion": "Edición con referencias de estudio y restauración sistemática del Tetragrámaton divino en las Escrituras."}, {"id": "bib-37", "d": "bib-biblia-pueblo-dios", "titulo": "El Libro del Pueblo de Dios (Biblia Argentina)", "autor": "Armando Levoratti y Alfredo Trusso", "fuente": "archive", "downloads": 37400, "portada": "https://archive.org/services/img/el-libro-del-pueblo-de-dios-levoratti", "categoria": "biblias", "idioma": "es", "epub": "https://archive.org/download/el-libro-del-pueblo-de-dios-levoratti/Libro_Pueblo_Dios.epub", "fileUrl": "https://archive.org/download/el-libro-del-pueblo-de-dios-levoratti/Libro_Pueblo_Dios.pdf", "descripcion": "Traducción oficial adoptada para la liturgia católica en Argentina, Chile, Uruguay y Paraguay."}, {"id": "bib-38", "d": "bib-wycliffe-1382", "titulo": "The Wycliffe Bible: Middle English Translation (1382)", "autor": "John Wycliffe y Eruditos de Oxford", "fuente": "gutenberg", "downloads": 28400, "portada": "https://covers.openlibrary.org/b/id/7943890-M.jpg", "categoria": "biblias", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/8304.epub3.images", "fileUrl": "https://archive.org/download/wycliffebible1382/WycliffeBible.pdf", "descripcion": "La primera traducción completa de las Escrituras al inglés medio vernáculo de los lolardos."}, {"id": "bib-39", "d": "bib-tyndale-1526", "titulo": "The Tyndale New Testament (1526)", "autor": "William Tyndale", "fuente": "archive", "downloads": 33100, "portada": "https://archive.org/services/img/tyndale-new-testament-1526", "categoria": "biblias", "idioma": "en", "epub": "https://archive.org/download/tyndale-new-testament-1526/Tyndale1526.epub", "fileUrl": "https://archive.org/download/tyndale-new-testament-1526/Tyndale1526.pdf", "descripcion": "El primer Nuevo Testamento en inglés impreso directamente desde el texto griego original que costó la vida a su mártir."}, {"id": "bib-40", "d": "bib-sinodal-rusa", "titulo": "Библия: Синодальный перевод (Biblia Sinodal Rusa)", "autor": "Santísimo Sínodo Gobernante de la Iglesia Ortodoxa Rusa", "fuente": "gutenberg", "downloads": 31500, "portada": "https://covers.openlibrary.org/b/id/8314100-M.jpg", "categoria": "biblias", "idioma": "ru", "epub": "https://www.gutenberg.org/ebooks/19717.epub3.images", "fileUrl": "https://archive.org/download/synodal-bible-russian/SynodalBible.pdf", "descripcion": "La traducción canónica autorizada de la Iglesia Ortodoxa Rusa utilizada por millones en Europa Oriental."}];
const LIBROS_ROMANCE_CURADOS = [{"id": "rom-1", "d": "rom-orgullo-prejuicio", "titulo": "Orgullo y Prejuicio", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 49800, "portada": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1342.epub3.images", "descripcion": "La chispeante e imperecedera historia de amor, malentendidos y orgullo social entre Elizabeth Bennet y el señor Darcy."}, {"id": "rom-2", "d": "rom-cumbres-borrascosas", "titulo": "Cumbres Borrascosas", "autor": "Emily Brontë", "fuente": "gutenberg", "downloads": 45200, "portada": "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/49836.epub3.images", "descripcion": "La tempestuosa y trágica pasión entre Catherine Earnshaw y Heathcliff en los páramos sombríos de Yorkshire."}, {"id": "rom-3", "d": "rom-jane-eyre", "titulo": "Jane Eyre", "autor": "Charlotte Brontë", "fuente": "gutenberg", "downloads": 42100, "portada": "https://www.gutenberg.org/cache/epub/1260/pg1260.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1260.epub3.images", "descripcion": "Una institutriz independiente y de férreos principios forja su destino junto al enigmático y atormentado señor Rochester."}, {"id": "rom-4", "d": "rom-romeo-julieta", "titulo": "Romeo y Julieta", "autor": "William Shakespeare", "fuente": "gutenberg", "downloads": 39600, "portada": "https://www.gutenberg.org/cache/epub/1513/pg1513.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1513.epub3.images", "descripcion": "El arquetipo universal del amor juvenil e inmortal que desafía el odio ancestral entre los Montescos y los Capuletos."}, {"id": "rom-5", "d": "rom-sensatez-sentimientos", "titulo": "Sensatez y Sentimientos", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 36700, "portada": "https://www.gutenberg.org/cache/epub/161/pg161.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/161.epub3.images", "descripcion": "El contraste afectivo entre la prudencia de Elinor y la fogosa impulsividad sentimental de Marianne Dashwood."}, {"id": "rom-6", "d": "rom-madame-bovary", "titulo": "Madame Bovary", "autor": "Gustave Flaubert", "fuente": "gutenberg", "downloads": 34900, "portada": "https://www.gutenberg.org/cache/epub/2413/pg2413.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2413.epub3.images", "descripcion": "Emma Bovary persigue incansablemente el ideal del amor romántico frente al tedio de la vida provinciana."}, {"id": "rom-7", "d": "rom-anna-karenina", "titulo": "Anna Karénina", "autor": "Lev Tolstói", "fuente": "gutenberg", "downloads": 33100, "portada": "https://www.gutenberg.org/cache/epub/1399/pg1399.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1399.epub3.images", "descripcion": "La apasionada aristócrata Anna desafía las convenciones sociales de San Petersburgo por su amor hacia el conde Vronsky."}, {"id": "rom-8", "d": "rom-werther", "titulo": "Las Penas del Joven Werther", "autor": "Johann Wolfgang von Goethe", "fuente": "gutenberg", "downloads": 31500, "portada": "https://www.gutenberg.org/cache/epub/2407/pg2407.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2407.epub3.images", "descripcion": "La novela epistolar que definió la sensibilidad romántica europea a través del amor imposible de Werther por Lotte."}, {"id": "rom-9", "d": "rom-dama-camelias", "titulo": "La Dama de las Camelias", "autor": "Alexandre Dumas hijo", "fuente": "gutenberg", "downloads": 29800, "portada": "https://www.gutenberg.org/cache/epub/2419/pg2419.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2419.epub3.images", "descripcion": "El sacrificio sublime y desgarrador de la cortesana Marguerite Gautier por la devoción a su amado Armand Duval."}, {"id": "rom-10", "d": "rom-rimas-leyendas", "titulo": "Rimas y Leyendas", "autor": "Gustavo Adolfo Bécquer", "fuente": "gutenberg", "downloads": 28400, "portada": "https://www.gutenberg.org/cache/epub/12224/pg12224.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/12224.epub3.images", "descripcion": "La cumbre de la lírica romántica hispánica sobre el misterio, el amor inalcanzable y la melancolía del alma."}, {"id": "rom-11", "d": "rom-maria", "titulo": "María", "autor": "Jorge Isaacs", "fuente": "gutenberg", "downloads": 27200, "portada": "https://www.gutenberg.org/cache/epub/16860/pg16860.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16860.epub3.images", "descripcion": "La idílica elegía romántica colombiana sobre el amor puro e inocente de Efraín y María en el Valle del Cauca."}, {"id": "rom-12", "d": "rom-marianela", "titulo": "Marianela", "autor": "Benito Pérez Galdós", "fuente": "gutenberg", "downloads": 25900, "portada": "https://www.gutenberg.org/cache/epub/16752/pg16752.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16752.epub3.images", "descripcion": "La tierna y desgarradora devoción de Nela por el joven ciego Pablo Penáguilas en las minas de Socartes."}, {"id": "rom-13", "d": "rom-fortunata-jacinta", "titulo": "Fortunata y Jacinta", "autor": "Benito Pérez Galdós", "fuente": "gutenberg", "downloads": 24800, "portada": "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17955.epub3.images", "descripcion": "Monumental fresco de pasiones cruzadas en el Madrid decimonónico en torno al seductor Juanito Santa Cruz."}, {"id": "rom-14", "d": "rom-pepita-jimenez", "titulo": "Pepita Jiménez", "autor": "Juan Valera", "fuente": "gutenberg", "downloads": 23600, "portada": "https://www.gutenberg.org/cache/epub/15353/pg15353.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15353.epub3.images", "descripcion": "La dulce pugna entre la vocación mística del seminarista Luis de Vargas y el hechizo irresistible de Pepita Jiménez."}, {"id": "rom-15", "d": "rom-amalia", "titulo": "Amalia", "autor": "José Mármol", "fuente": "gutenberg", "downloads": 22500, "portada": "https://www.gutenberg.org/cache/epub/21950/pg21950.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/21950.epub3.images", "descripcion": "El peligroso romance entre Amalia y el conspirador Eduardo Belgrano en tiempos del tirano Rosas en Buenos Aires."}, {"id": "rom-16", "d": "rom-cyrano", "titulo": "Cyrano de Bergerac", "autor": "Edmond Rostand", "fuente": "gutenberg", "downloads": 21800, "portada": "https://www.gutenberg.org/cache/epub/1254/pg1254.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1254.epub3.images", "descripcion": "El noble espadachín y poeta Cyrano presta su pluma y elocuencia a su rival Christian para conquistar a su prima Roxane."}, {"id": "rom-17", "d": "rom-persuasion", "titulo": "Persuasión", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 20900, "portada": "https://www.gutenberg.org/cache/epub/105/pg105.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/105.epub3.images", "descripcion": "Anne Elliot y el capitán Wentworth descubren una segunda oportunidad de felicidad tras años de forzada separación."}, {"id": "rom-18", "d": "rom-emma", "titulo": "Emma", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 20100, "portada": "https://www.gutenberg.org/cache/epub/158/pg158.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/158.epub3.images", "descripcion": "Emma Woodhouse, aficionada a emparejar a sus amistades, descubre tardíamente los verdaderos anhelos de su propio corazón."}, {"id": "rom-19", "d": "rom-mansfield-park", "titulo": "Mansfield Park", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 19400, "portada": "https://www.gutenberg.org/cache/epub/141/pg141.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/141.epub3.images", "descripcion": "La timidez, lealtad y rectitud moral de la joven Fanny Price frente a la sofisticación de la familia Bertram."}, {"id": "rom-20", "d": "rom-abadia-northanger", "titulo": "La Abadía de Northanger", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 18700, "portada": "https://www.gutenberg.org/cache/epub/121/pg121.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/121.epub3.images", "descripcion": "Sátira deliciosa de los romances góticos protagonizada por la cándida e imaginativa Catherine Morland."}, {"id": "rom-21", "d": "rom-lady-susan", "titulo": "Lady Susan", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 18100, "portada": "https://www.gutenberg.org/cache/epub/946/pg946.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/946.epub3.images", "descripcion": "La seductora viuda Lady Susan utiliza su astucia y carisma para asegurarse un nuevo matrimonio ventajoso."}, {"id": "rom-22", "d": "rom-habitacion-vistas", "titulo": "Una Habitación con Vistas", "autor": "E.M. Forster", "fuente": "gutenberg", "downloads": 17500, "portada": "https://www.gutenberg.org/cache/epub/264/pg264.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/264.epub3.images", "descripcion": "Lucy Honeychurch descubre en Florencia la vitalidad y el amor libre frente a los rigores de la sociedad eduardiana."}, {"id": "rom-23", "d": "rom-edad-inocencia", "titulo": "La Edad de la Inocencia", "autor": "Edith Wharton", "fuente": "gutenberg", "downloads": 16900, "portada": "https://www.gutenberg.org/cache/epub/541/pg541.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/541.epub3.images", "descripcion": "Newland Archer se debate entre su deber hacia May Welland y su arrebatada atracción hacia la condesa Olenska."}, {"id": "rom-24", "d": "rom-gran-gatsby", "titulo": "El Gran Gatsby", "autor": "F. Scott Fitzgerald", "fuente": "gutenberg", "downloads": 16400, "portada": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/64317.epub3.images", "descripcion": "La obsesiva e idealizada nostalgia de Jay Gatsby por reconquistar a su amor de juventud Daisy Buchanan."}, {"id": "rom-25", "d": "rom-tess-durberville", "titulo": "Tess de los d'Urberville", "autor": "Thomas Hardy", "fuente": "gutenberg", "downloads": 15900, "portada": "https://www.gutenberg.org/cache/epub/110/pg110.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/110.epub3.images", "descripcion": "La dolorosa lucha de Tess Durbeyfield contra la hipocresía moral y las tragedias impuestas por el destino."}, {"id": "rom-26", "d": "rom-lejos-mundanal", "titulo": "Lejos del Mundanal Ruido", "autor": "Thomas Hardy", "fuente": "gutenberg", "downloads": 15300, "portada": "https://www.gutenberg.org/cache/epub/107/pg107.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/107.epub3.images", "descripcion": "La independiente pastora Bathsheba Everdene es cortejada por tres pretendientes de temperamentos contrapuestos."}, {"id": "rom-27", "d": "rom-princesa-cleves", "titulo": "La Princesa de Clèves", "autor": "Madame de La Fayette", "fuente": "gutenberg", "downloads": 14800, "portada": "https://www.gutenberg.org/cache/epub/15159/pg15159.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15159.epub3.images", "descripcion": "Precursora de la novela psicológica moderna: el dilema moral entre la lealtad conyugal y una pasión secreta en la corte."}, {"id": "rom-28", "d": "rom-carmen", "titulo": "Carmen", "autor": "Prosper Mérimée", "fuente": "gutenberg", "downloads": 14200, "portada": "https://www.gutenberg.org/cache/epub/2465/pg2465.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2465.epub3.images", "descripcion": "La indomable seducción de la cigarrera Carmen y la fatal perdición por celos del soldado don José."}, {"id": "rom-29", "d": "rom-manon-lescaut", "titulo": "Manon Lescaut", "autor": "Abbé Prévost", "fuente": "gutenberg", "downloads": 13700, "portada": "https://www.gutenberg.org/cache/epub/4744/pg4744.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4744.epub3.images", "descripcion": "El ciego e incondicional extravío del caballero Des Grieux arrastrado por la fascinante y voluble Manon."}, {"id": "rom-30", "d": "rom-chatterley", "titulo": "El Amante de Lady Chatterley", "autor": "D.H. Lawrence", "fuente": "gutenberg", "downloads": 13200, "portada": "https://www.gutenberg.org/cache/epub/65860/pg65860.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/65860.epub3.images", "descripcion": "La intensa reconexión emocional y física entre Constance Chatterley y el guardabosques Oliver Mellors."}, {"id": "rom-31", "d": "rom-mujercitas", "titulo": "Mujercitas", "autor": "Louisa May Alcott", "fuente": "gutenberg", "downloads": 12800, "portada": "https://www.gutenberg.org/cache/epub/514/pg514.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/514.epub3.images", "descripcion": "Las vivencias, aspiraciones creativas y primeros amores de las inolvidables cuatro hermanas March: Meg, Jo, Beth y Amy."}, {"id": "rom-32", "d": "rom-letra-escarlata", "titulo": "La Letra Escarlata", "autor": "Nathaniel Hawthorne", "fuente": "gutenberg", "downloads": 12400, "portada": "https://www.gutenberg.org/cache/epub/33/pg33.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/33.epub3.images", "descripcion": "Hester Prynne desafía el rigor punitivo puritano portando con entereza la insignia impuesta por su amor prohibido."}, {"id": "rom-33", "d": "rom-rojo-negro", "titulo": "Rojo y Negro", "autor": "Stendhal", "fuente": "gutenberg", "downloads": 12000, "portada": "https://www.gutenberg.org/cache/epub/4474/pg4474.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4474.epub3.images", "descripcion": "La ambición social y los apasionados enredos sentimentales del joven Julien Sorel en la Francia de la Restauración."}, {"id": "rom-34", "d": "rom-cartuja-parma", "titulo": "La Cartuja de Parma", "autor": "Stendhal", "fuente": "gutenberg", "downloads": 11600, "portada": "https://www.gutenberg.org/cache/epub/4443/pg4443.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4443.epub3.images", "descripcion": "Las intrigas cortesanas, el heroísmo juvenil y el amor clandestino de Fabrizio del Dongo en la Italia napoleónica."}, {"id": "rom-35", "d": "rom-fantasma-opera", "titulo": "El Fantasma de la Ópera", "autor": "Gaston Leroux", "fuente": "gutenberg", "downloads": 11200, "portada": "https://www.gutenberg.org/cache/epub/175/pg175.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/175.epub3.images", "descripcion": "El misterioso genio musical que habita las catacumbas de la Ópera de París y su devoción obsesiva hacia Christine Daaé."}, {"id": "rom-36", "d": "rom-gitanilla", "titulo": "La Gitanilla", "autor": "Miguel de Cervantes", "fuente": "gutenberg", "downloads": 10800, "portada": "https://www.gutenberg.org/cache/epub/14227/pg14227.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/14227.epub3.images", "descripcion": "Preciosa, una muchacha gitana de gracia y virtudes singulares, despierta el sincero amor del noble don Juan de Cárcamo."}, {"id": "rom-37", "d": "rom-estudiante-salamanca", "titulo": "El Estudiante de Salamanca", "autor": "José de Espronceda", "fuente": "gutenberg", "downloads": 10400, "portada": "https://www.gutenberg.org/cache/epub/15632/pg15632.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15632.epub3.images", "descripcion": "El seductor impenitente don Félix de Montemar desafía el honor de doña Elvira y contempla su propio entierro espectral."}, {"id": "rom-38", "d": "rom-pazos-ulloa", "titulo": "Los Pazos de Ulloa", "autor": "Emilia Pardo Bazán", "fuente": "gutenberg", "downloads": 10000, "portada": "https://www.gutenberg.org/cache/epub/17594/pg17594.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17594.epub3.images", "descripcion": "El choque entre pasiones desatadas, decadencia señorial y pureza afectiva en la Galicia rural del siglo XIX."}, {"id": "rom-39", "d": "rom-dona-barbara", "titulo": "Doña Bárbara", "autor": "Rómulo Gallegos", "fuente": "gutenberg", "downloads": 9700, "portada": "https://www.gutenberg.org/cache/epub/47000/pg47000.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/47000.epub3.images", "descripcion": "El enfrentamiento entre la fuerza indómita del llano y el afán civilizador a través del amor transformador de Santos Luzardo."}, {"id": "rom-40", "d": "rom-tristan-isolda", "titulo": "Tristán e Isolda", "autor": "Gottfried von Strassburg", "fuente": "gutenberg", "downloads": 9400, "portada": "https://www.gutenberg.org/cache/epub/14144/pg14144.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/14144.epub3.images", "descripcion": "El legendario filtro de amor que une de forma indestructible a los dos amantes célticos frente al rey Marco de Cornualles."}, {"id": "rom-41", "d": "rom-pride-prejudice-en", "titulo": "Pride and Prejudice (Original English)", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 28000, "portada": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/1342.epub3.images", "descripcion": "The complete original Regency masterpiece exploring love, class, and witty social ironies in rural England."}, {"id": "rom-42", "d": "rom-wuthering-heights-en", "titulo": "Wuthering Heights (Original English)", "autor": "Emily Brontë", "fuente": "gutenberg", "downloads": 24000, "portada": "https://www.gutenberg.org/cache/epub/768/pg768.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/768.epub3.images", "descripcion": "Emily Brontë's wild, passionate tale of the intense and almost demonic love between Catherine and Heathcliff."}, {"id": "rom-43", "d": "rom-jane-eyre-en", "titulo": "Jane Eyre (Original English)", "autor": "Charlotte Brontë", "fuente": "gutenberg", "downloads": 22000, "portada": "https://www.gutenberg.org/cache/epub/1260/pg1260.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/1260.epub3.images", "descripcion": "The timeless coming-of-age story of an orphan girl whose moral integrity triumphs over adversity."}, {"id": "rom-44", "d": "rom-sense-sensibility-en", "titulo": "Sense and Sensibility (Original English)", "autor": "Jane Austen", "fuente": "gutenberg", "downloads": 19000, "portada": "https://www.gutenberg.org/cache/epub/161/pg161.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/161.epub3.images", "descripcion": "Jane Austen's first published novel exploring the delicate balance of heart and mind in marriage and society."}, {"id": "rom-45", "d": "rom-great-expectations-en", "titulo": "Great Expectations", "autor": "Charles Dickens", "fuente": "gutenberg", "downloads": 18500, "portada": "https://www.gutenberg.org/cache/epub/1400/pg1400.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/1400.epub3.images", "descripcion": "Pip's unrequited longing for the proud and cold Estella amidst fortunes and unexpected benefactors."}, {"id": "rom-46", "d": "rom-north-and-south-en", "titulo": "North and South", "autor": "Elizabeth Gaskell", "fuente": "gutenberg", "downloads": 17800, "portada": "https://www.gutenberg.org/cache/epub/4276/pg4276.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/4276.epub3.images", "descripcion": "Margaret Hale and mill owner John Thornton overcome fierce cultural prejudices during the Industrial Revolution."}, {"id": "rom-47", "d": "rom-middlemarch-en", "titulo": "Middlemarch", "autor": "George Eliot", "fuente": "gutenberg", "downloads": 17000, "portada": "https://www.gutenberg.org/cache/epub/145/pg145.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/145.epub3.images", "descripcion": "A study of provincial life, idealistic marriages, and romantic disillusionment in nineteenth-century England."}, {"id": "rom-48", "d": "rom-scarlet-pimpernel-en", "titulo": "The Scarlet Pimpernel", "autor": "Baroness Orczy", "fuente": "gutenberg", "downloads": 16200, "portada": "https://www.gutenberg.org/cache/epub/60/pg60.cover.medium.jpg", "categoria": "romance", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/60.epub3.images", "descripcion": "Swashbuckling romance and mystery between Marguerite St. Just and Sir Percy Blakeney during the French Revolution."}, {"id": "rom-49", "d": "rom-madame-bovary-fr", "titulo": "Madame Bovary (Texte Intégral Français)", "autor": "Gustave Flaubert", "fuente": "gutenberg", "downloads": 18000, "portada": "https://www.gutenberg.org/cache/epub/2413/pg2413.cover.medium.jpg", "categoria": "romance", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/2413.epub3.images", "descripcion": "Le chef-d'œuvre du réalisme et de la désillusion romantique dans la langue originale de Flaubert."}, {"id": "rom-50", "d": "rom-dame-aux-camelias-fr", "titulo": "La Dame aux Camélias (Original Français)", "autor": "Alexandre Dumas fils", "fuente": "gutenberg", "downloads": 16500, "portada": "https://www.gutenberg.org/cache/epub/2419/pg2419.cover.medium.jpg", "categoria": "romance", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/2419.epub3.images", "descripcion": "L'amour déchirant et pur entre Armand Duval et la courtisane Marguerite Gautier dans le Paris romantique."}, {"id": "rom-51", "d": "rom-rouge-et-noir-fr", "titulo": "Le Rouge et le Noir (Texte Français)", "autor": "Stendhal", "fuente": "gutenberg", "downloads": 15800, "portada": "https://www.gutenberg.org/cache/epub/4474/pg4474.cover.medium.jpg", "categoria": "romance", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/4474.epub3.images", "descripcion": "Chronique de 1830: l'ascension sociale passionnée et tragique de Julien Sorel à travers ses amours."}, {"id": "rom-52", "d": "rom-chartreuse-parme-fr", "titulo": "La Chartreuse de Parme (Original Français)", "autor": "Stendhal", "fuente": "gutenberg", "downloads": 15100, "portada": "https://www.gutenberg.org/cache/epub/4443/pg4443.cover.medium.jpg", "categoria": "romance", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/4443.epub3.images", "descripcion": "Aventures, intrigues et passion sublime entre Fabrice del Dongo et Clélia Conti au cœur de l'Italie."}, {"id": "rom-53", "d": "rom-werther-de", "titulo": "Die Leiden des jungen Werthers (Original Deutsch)", "autor": "Johann Wolfgang von Goethe", "fuente": "gutenberg", "downloads": 17200, "portada": "https://www.gutenberg.org/cache/epub/2407/pg2407.cover.medium.jpg", "categoria": "romance", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/2407.epub3.images", "descripcion": "Der berühmte Briefroman des Sturm und Drang über Werthers unglückliche Liebe zu Lotte."}, {"id": "rom-54", "d": "rom-effi-briest-de", "titulo": "Effi Briest (Original Deutsch)", "autor": "Theodor Fontane", "fuente": "gutenberg", "downloads": 14000, "portada": "https://www.gutenberg.org/cache/epub/5323/pg5323.cover.medium.jpg", "categoria": "romance", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/5323.epub3.images", "descripcion": "Fontanes Meisterwerk über gesellschaftliche Konventionen, Ehe und Ehebruch im preußischen Adel."}, {"id": "rom-55", "d": "rom-wahlverwandtschaften-de", "titulo": "Die Wahlverwandtschaften", "autor": "Johann Wolfgang von Goethe", "fuente": "gutenberg", "downloads": 13400, "portada": "https://www.gutenberg.org/cache/epub/2408/pg2408.cover.medium.jpg", "categoria": "romance", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/2408.epub3.images", "descripcion": "Goethes tiefgründiger Roman über chemische und emotionale Anziehungskräfte zwischen vier Menschen."}, {"id": "rom-56", "d": "rom-promessi-sposi-it", "titulo": "I Promessi Sposi (Testo Italiano)", "autor": "Alessandro Manzoni", "fuente": "gutenberg", "downloads": 19500, "portada": "https://www.gutenberg.org/cache/epub/4014/pg4014.cover.medium.jpg", "categoria": "romance", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/4014.epub3.images", "descripcion": "Il grande romanzo storico italiano: l'amore travagliato di Renzo e Lucia nella Lombardia del Seicento."}, {"id": "rom-57", "d": "rom-senilita-it", "titulo": "Senilità (Originale Italiano)", "autor": "Italo Svevo", "fuente": "gutenberg", "downloads": 13900, "portada": "https://www.gutenberg.org/cache/epub/42000/pg42000.cover.medium.jpg", "categoria": "romance", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/42000.epub3.images", "descripcion": "La complessa e tormentata relazione tra l'impiegato Emilio Brentani e la vivace popolana Angiolina a Trieste."}, {"id": "rom-58", "d": "rom-amor-perdicao-pt", "titulo": "Amor de Perdição (Texto Português)", "autor": "Camilo Castelo Branco", "fuente": "gutenberg", "downloads": 16800, "portada": "https://www.gutenberg.org/cache/epub/18776/pg18776.cover.medium.jpg", "categoria": "romance", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/18776.epub3.images", "descripcion": "A tragédia romântica definitiva da literatura portuguesa sobre o amor proibido de Simão e Teresa."}, {"id": "rom-59", "d": "rom-dom-casmurro-pt", "titulo": "Dom Casmurro (Original Português)", "autor": "Machado de Assis", "fuente": "gutenberg", "downloads": 18200, "portada": "https://www.gutenberg.org/cache/epub/55752/pg55752.cover.medium.jpg", "categoria": "romance", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/55752.epub3.images", "descripcion": "Bentinho narra sua paixão de infância por Capitu e as dúvidas eternas sobre seu olhar de ressaca."}, {"id": "rom-60", "d": "rom-senhora-pt", "titulo": "Senhora (Clássico Brasileiro)", "autor": "José de Alencar", "fuente": "gutenberg", "downloads": 14500, "portada": "https://www.gutenberg.org/cache/epub/21532/pg21532.cover.medium.jpg", "categoria": "romance", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/21532.epub3.images", "descripcion": "Aurélia Camargo compra por dote o noivo Fernando Seixas para consumar sua vingança e reencontrar o afeto."}, {"id": "rom-61", "d": "rom-amores-platero", "titulo": "Platero y Yo: Poemas de Amor y Ternura", "autor": "Juan Ramón Jiménez", "fuente": "gutenberg", "downloads": 13000, "portada": "https://www.gutenberg.org/cache/epub/12000/pg12000.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/12000.epub3.images", "descripcion": "Evocación poética de Moguer llena de ternura, amistad profunda y devoción por la belleza y la naturaleza."}, {"id": "rom-62", "d": "rom-el-beso", "titulo": "El Beso y Otros Cuentos de Amor", "autor": "Antón Chéjov", "fuente": "gutenberg", "downloads": 12500, "portada": "https://www.gutenberg.org/cache/epub/13415/pg13415.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13415.epub3.images", "descripcion": "Chéjov explora la fugacidad de las ilusiones románticas y el peso de las oportunidades perdidas."}, {"id": "rom-63", "d": "rom-la-dama-perrito", "titulo": "La Dama del Perrito", "autor": "Antón Chéjov", "fuente": "gutenberg", "downloads": 12200, "portada": "https://www.gutenberg.org/cache/epub/13416/pg13416.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13416.epub3.images", "descripcion": "En Yalta, Dmitri Górov y Anna Serguéievna viven una aventura estival que se transforma en su amor más íntimo y hondo."}, {"id": "rom-64", "d": "rom-noches-blancas", "titulo": "Noches Blancas", "autor": "Fiódor Dostoyevski", "fuente": "gutenberg", "downloads": 13800, "portada": "https://www.gutenberg.org/cache/epub/36034/pg36034.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/36034.epub3.images", "descripcion": "La novela sentimental en cuatro noches sanpetersburguesas entre un joven soñador solitario y Nástenka."}, {"id": "rom-65", "d": "rom-primer-amor", "titulo": "Primer Amor", "autor": "Iván Turguénev", "fuente": "gutenberg", "downloads": 11800, "portada": "https://www.gutenberg.org/cache/epub/36100/pg36100.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/36100.epub3.images", "descripcion": "El deslumbramiento inocente del adolescente Vladímir ante la encantadora y coqueta princesa Zinaída."}, {"id": "rom-66", "d": "rom-asia", "titulo": "Asya: Idilio en el Rin", "autor": "Iván Turguénev", "fuente": "gutenberg", "downloads": 11300, "portada": "https://www.gutenberg.org/cache/epub/36101/pg36101.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/36101.epub3.images", "descripcion": "Delicada nouvelle romántica sobre la espontaneidad y la indecisión que arruina para siempre la dicha."}, {"id": "rom-67", "d": "rom-sonata-kreutzer", "titulo": "La Sonata a Kreutzer", "autor": "Lev Tolstói", "fuente": "gutenberg", "downloads": 11000, "portada": "https://www.gutenberg.org/cache/epub/689/pg689.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/689.epub3.images", "descripcion": "Intensa y polémica confesión sobre la música, el matrimonio y los celos destructivos desatados por Beethoven."}, {"id": "rom-68", "d": "rom-felicidad-conyugal", "titulo": "Felicidad Conyugal", "autor": "Lev Tolstói", "fuente": "gutenberg", "downloads": 10700, "portada": "https://www.gutenberg.org/cache/epub/1401/pg1401.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1401.epub3.images", "descripcion": "La evolución del amor ardiente de juventud hacia el sereno afecto maduro en la campiña rusa."}, {"id": "rom-69", "d": "rom-eugenie-grandet", "titulo": "Eugenia Grandet", "autor": "Honoré de Balzac", "fuente": "gutenberg", "downloads": 11400, "portada": "https://www.gutenberg.org/cache/epub/1420/pg1420.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1420.epub3.images", "descripcion": "La abnegación y pureza sentimental de Eugenia frente a la voraz avaricia de su padre y el olvido de su primo Charles."}, {"id": "rom-70", "d": "rom-lirio-valle", "titulo": "El Lirio en el Valle", "autor": "Honoré de Balzac", "fuente": "gutenberg", "downloads": 10900, "portada": "https://www.gutenberg.org/cache/epub/1425/pg1425.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1425.epub3.images", "descripcion": "La devoción platónica y apasionada entre Félix de Vandenesse y la virtuosa condesa Henriette de Mortsauf."}, {"id": "rom-71", "d": "rom-paul-virginie", "titulo": "Pablo y Virginia", "autor": "Bernardin de Saint-Pierre", "fuente": "gutenberg", "downloads": 10500, "portada": "https://www.gutenberg.org/cache/epub/1238/pg1238.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1238.epub3.images", "descripcion": "La conmovedora historia pastoral de amor edénico entre dos jóvenes criados en la exuberancia de la isla Mauricio."}, {"id": "rom-72", "d": "rom-corinne-italie", "titulo": "Corina o Italia", "autor": "Madame de Staël", "fuente": "gutenberg", "downloads": 10200, "portada": "https://www.gutenberg.org/cache/epub/15200/pg15200.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15200.epub3.images", "descripcion": "La brillante poetisa Corina y el aristócrata escocés Lord Nelvil exploran el arte y el afecto en Roma."}, {"id": "rom-73", "d": "rom-adolphe", "titulo": "Adolfo", "autor": "Benjamin Constant", "fuente": "gutenberg", "downloads": 9900, "portada": "https://www.gutenberg.org/cache/epub/14700/pg14700.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/14700.epub3.images", "descripcion": "Aguda autopsia psicológica sobre el nacimiento, enfriamiento y doloroso final de una relación apasionada."}, {"id": "rom-74", "d": "rom-graziella", "titulo": "Graziella", "autor": "Alphonse de Lamartine", "fuente": "gutenberg", "downloads": 9600, "portada": "https://www.gutenberg.org/cache/epub/16400/pg16400.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16400.epub3.images", "descripcion": "La inolvidable confesión autobiográfica de amor juvenil hacia una dulce muchacha de la isla de Procida en Nápoles."}, {"id": "rom-75", "d": "rom-cantares-gallegos", "titulo": "Cantares Gallegos", "autor": "Rosalía de Castro", "fuente": "gutenberg", "downloads": 10400, "portada": "https://www.gutenberg.org/cache/epub/17000/pg17000.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17000.epub3.images", "descripcion": "Poesía lírica y afectiva sobre el amor patrio, la soledad y la morriña entrañable de Galicia."}, {"id": "rom-76", "d": "rom-cleopatra-antonio", "titulo": "Antonio y Cleopatra", "autor": "William Shakespeare", "fuente": "gutenberg", "downloads": 11100, "portada": "https://www.gutenberg.org/cache/epub/1534/pg1534.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1534.epub3.images", "descripcion": "La grandiosa tragedia política y sentimental que sacrificó el Imperio Romano por la pasión hacia la reina de Egipto."}, {"id": "rom-77", "d": "rom-mucho-ruido", "titulo": "Mucho Ruido y Pocas Nueces", "autor": "William Shakespeare", "fuente": "gutenberg", "downloads": 10600, "portada": "https://www.gutenberg.org/cache/epub/1519/pg1519.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1519.epub3.images", "descripcion": "Los ingeniosos duelos verbales y el florecimiento del amor entre Beatriz y Benedicto en Mesina."}, {"id": "rom-78", "d": "rom-sueno-noche-verano", "titulo": "El Sueño de una Noche de Verano", "autor": "William Shakespeare", "fuente": "gutenberg", "downloads": 11500, "portada": "https://www.gutenberg.org/cache/epub/1514/pg1514.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1514.epub3.images", "descripcion": "Pociones mágicas, hadas y enredos románticos en un bosque encantado cerca de Atenas."}, {"id": "rom-79", "d": "rom-amor-honra", "titulo": "El Amor Constante Más Allá de la Muerte", "autor": "Francisco de Quevedo", "fuente": "gutenberg", "downloads": 9800, "portada": "https://www.gutenberg.org/cache/epub/18000/pg18000.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18000.epub3.images", "descripcion": "«Polvo serán, mas polvo enamorado»: los más hermosos sonetos de amor del Siglo de Oro español."}, {"id": "rom-80", "d": "rom-cancionero-petrarca", "titulo": "Cancionero de Laura", "autor": "Francesco Petrarca", "fuente": "gutenberg", "downloads": 10300, "portada": "https://www.gutenberg.org/cache/epub/19000/pg19000.cover.medium.jpg", "categoria": "romance", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/19000.epub3.images", "descripcion": "El cancionero poético fundacional del amor renacentista dedicado a la inolvidable Laura de Noves."}];
const LIBROS_RELIGION_CURADOS = [{"id": "rel-1", "d": "rel-biblia", "titulo": "La Sagrada Biblia", "autor": "Varios Autores", "fuente": "gutenberg", "downloads": 48500, "portada": "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "descripcion": "Texto fundacional de la tradici\u00f3n judeocristiana, compuesto por el Antiguo y Nuevo Testamento."}, {"id": "rel-2", "d": "rel-coran", "titulo": "El Sagrado Cor\u00e1n", "autor": "Profeta Mahoma (Trad. Julio Cort\u00e9s)", "fuente": "archive", "downloads": 39200, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800200.us.archive.org/coran.pdf", "descripcion": "El libro sagrado del Islam, revelaci\u00f3n divina y c\u00f3digo de vida espiritual y moral."}, {"id": "rel-3", "d": "rel-bhagavad-gita", "titulo": "Bhagavad Gita: El Canto del Se\u00f1or", "autor": "Vyasa", "fuente": "gutenberg", "downloads": 36100, "portada": "https://www.gutenberg.org/cache/epub/2388/pg2388.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2388.epub3.images", "descripcion": "Di\u00e1logo fundamental entre el pr\u00edncipe Arjuna y Krishna sobre el deber, la devoci\u00f3n y el alma."}, {"id": "rel-4", "d": "rel-tao-te-ching", "titulo": "Tao Te Ching: El Libro del Camino y la Virtud", "autor": "Lao Tse", "fuente": "gutenberg", "downloads": 34800, "portada": "https://www.gutenberg.org/cache/epub/216/pg216.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/216.epub3.images", "descripcion": "Obra esencial del tao\u00edsmo sobre la armon\u00eda con el universo y el principio del no-hacer (wu wei)."}, {"id": "rel-5", "d": "rel-dhammapada", "titulo": "Dhammapada: La Senda de la Verdad", "autor": "Buda Gautama", "fuente": "gutenberg", "downloads": 31200, "portada": "https://www.gutenberg.org/cache/epub/2017/pg2017.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2017.epub3.images", "descripcion": "Colecci\u00f3n de aforismos del Buda sobre el sendero de la iluminaci\u00f3n y la paz mental."}, {"id": "rel-6", "d": "rel-confesiones-agustin", "titulo": "Las Confesiones", "autor": "San Agust\u00edn", "fuente": "gutenberg", "downloads": 28900, "portada": "https://www.gutenberg.org/cache/epub/3296/pg3296.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3296.epub3.images", "descripcion": "Autobiograf\u00eda espiritual y meditaci\u00f3n sobre la gracia, el pecado y la conversi\u00f3n a Dios."}, {"id": "rel-7", "d": "rel-ciudad-dios", "titulo": "La Ciudad de Dios", "autor": "San Agust\u00edn", "fuente": "gutenberg", "downloads": 24500, "portada": "https://www.gutenberg.org/cache/epub/45304/pg45304.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/45304.epub3.images", "descripcion": "Monumental tratado teol\u00f3gico sobre el destino de la humanidad y la historia de salvaci\u00f3n."}, {"id": "rel-8", "d": "rel-suma-teologica", "titulo": "Suma Teol\u00f3gica (Selecci\u00f3n)", "autor": "Santo Tom\u00e1s de Aquino", "fuente": "gutenberg", "downloads": 23800, "portada": "https://www.gutenberg.org/cache/epub/17611/pg17611.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17611.epub3.images", "descripcion": "La cumbre de la teolog\u00eda escol\u00e1stica que armoniza la fe cristiana con la filosof\u00eda de Arist\u00f3teles."}, {"id": "rel-9", "d": "rel-imitacion-cristo", "titulo": "Imitaci\u00f3n de Cristo", "autor": "Tom\u00e1s de Kempis", "fuente": "gutenberg", "downloads": 22400, "portada": "https://www.gutenberg.org/cache/epub/1653/pg1653.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1653.epub3.images", "descripcion": "El manual devocional m\u00e1s le\u00eddo del cristianismo despu\u00e9s de los Evangelios."}, {"id": "rel-10", "d": "rel-libro-tibetano-muertos", "titulo": "El Libro Tibetano de los Muertos (Bardo Thodol)", "autor": "Padmasambhava", "fuente": "archive", "downloads": 21900, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800300.us.archive.org/bardo.pdf", "descripcion": "Gu\u00eda espiritual budista para la conciencia a trav\u00e9s del estado intermedio entre la muerte y el renacimiento."}, {"id": "rel-11", "d": "rel-upanishads", "titulo": "Los Upanishads: Esencia del Pensamiento Hind\u00fa", "autor": "Sabios V\u00e9dicos", "fuente": "gutenberg", "downloads": 20500, "portada": "https://www.gutenberg.org/cache/epub/3283/pg3283.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3283.epub3.images", "descripcion": "Tratados m\u00edsticos y filos\u00f3ficos sobre la naturaleza de Brahm\u00e1n y la identidad del Ser (Atman)."}, {"id": "rel-12", "d": "rel-sutra-diamante", "titulo": "El Sutra del Diamante", "autor": "Tradici\u00f3n Mah\u0101y\u0101na", "fuente": "wikisource", "downloads": 19800, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Ense\u00f1anzas de praj\u00f1\u0101p\u0101ramit\u0101 sobre la vacuidad de todos los fen\u00f3menos y el desapego del ego."}, {"id": "rel-13", "d": "rel-moradas-teresa", "titulo": "Las Moradas del Castillo Interior", "autor": "Santa Teresa de Jes\u00fas", "fuente": "gutenberg", "downloads": 19400, "portada": "https://www.gutenberg.org/cache/epub/24578/pg24578.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24578.epub3.images", "descripcion": "Gu\u00eda sublime de oraci\u00f3n contemplativa y ascenso m\u00edstico del alma hasta la uni\u00f3n con Dios."}, {"id": "rel-14", "d": "rel-noche-oscura", "titulo": "Noche Oscura del Alma", "autor": "San Juan de la Cruz", "fuente": "gutenberg", "downloads": 18900, "portada": "https://www.gutenberg.org/cache/epub/25619/pg25619.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/25619.epub3.images", "descripcion": "Poes\u00eda l\u00edrica y teolog\u00eda de la purificaci\u00f3n espiritual previa a la iluminaci\u00f3n divina."}, {"id": "rel-15", "d": "rel-guia-perplejos", "titulo": "Gu\u00eda de Perplejos", "autor": "Mois\u00e9s Maim\u00f3nides", "fuente": "gutenberg", "downloads": 18200, "portada": "https://www.gutenberg.org/cache/epub/39904/pg39904.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/39904.epub3.images", "descripcion": "Magistral reconciliaci\u00f3n jud\u00eda entre la ley de Mois\u00e9s, la raz\u00f3n aristot\u00e9lica y la metaf\u00edsica."}, {"id": "rel-16", "d": "rel-zohar", "titulo": "El Zohar: El Libro del Esplendor", "autor": "Shimon bar Yojai (Atrib.)", "fuente": "archive", "downloads": 17800, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800400.us.archive.org/zohar.pdf", "descripcion": "Texto cumbre de la C\u00e1bala m\u00edstica sobre las dimensiones ocultas de la creaci\u00f3n divina."}, {"id": "rel-17", "d": "rel-gilgamesh", "titulo": "El Poema de Gilgamesh", "autor": "Mitolog\u00eda Sumeria", "fuente": "gutenberg", "downloads": 17500, "portada": "https://www.gutenberg.org/cache/epub/11000/pg11000.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/11000.epub3.images", "descripcion": "La epopeya religiosa y po\u00e9tica m\u00e1s antigua del mundo sobre la b\u00fasqueda de la inmortalidad."}, {"id": "rel-18", "d": "rel-muertos-egipcio", "titulo": "El Libro Egipcio de los Muertos", "autor": "Sacerdotes de Tebas", "fuente": "gutenberg", "downloads": 16900, "portada": "https://www.gutenberg.org/cache/epub/13000/pg13000.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13000.epub3.images", "descripcion": "F\u00f3rmulas m\u00e1gicas e himnos funerarios para guiar el alma ante el tribunal del dios Osiris."}, {"id": "rel-19", "d": "rel-teogonia", "titulo": "Teogon\u00eda y Los Trabajos y los D\u00edas", "autor": "Hes\u00edodo", "fuente": "gutenberg", "downloads": 16400, "portada": "https://www.gutenberg.org/cache/epub/348/pg348.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/348.epub3.images", "descripcion": "Origen de los dioses del Olimpo y el orden sagrado del cosmos en la Grecia Arcaica."}, {"id": "rel-20", "d": "rel-cantar-cantares", "titulo": "El Cantar de los Cantares", "autor": "Rey Salom\u00f3n", "fuente": "wikisource", "downloads": 16100, "portada": "https://covers.openlibrary.org/b/id/5144315-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Poema de amor m\u00edstico y alegor\u00eda del matrimonio espiritual entre Dios y la humanidad."}, {"id": "rel-21", "d": "rel-libro-job", "titulo": "El Libro de Job", "autor": "Literatura B\u00edblica Sapiencial", "fuente": "wikisource", "downloads": 15800, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Dram\u00e1tica indagaci\u00f3n sobre el problema del sufrimiento del inocente y el misterio divino."}, {"id": "rel-22", "d": "rel-tratado-teologico-spinoza", "titulo": "Tratado Teol\u00f3gico-Pol\u00edtico", "autor": "Baruch Spinoza", "fuente": "gutenberg", "downloads": 15500, "portada": "https://www.gutenberg.org/cache/epub/2361/pg2361.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2361.epub3.images", "descripcion": "An\u00e1lisis pionero de la cr\u00edtica b\u00edblica, la libertad de pensamiento y el concepto de Dios en la naturaleza."}, {"id": "rel-23", "d": "rel-pensamientos-pascal", "titulo": "Pensamientos", "autor": "Blaise Pascal", "fuente": "gutenberg", "downloads": 15200, "portada": "https://www.gutenberg.org/cache/epub/18269/pg18269.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18269.epub3.images", "descripcion": "La c\u00e9lebre apuesta de Pascal y reflexiones profundas sobre la miseria humana y la grandeza de la fe."}, {"id": "rel-24", "d": "rel-variedades-experiencia", "titulo": "Las Variedades de la Experiencia Religiosa", "autor": "William James", "fuente": "gutenberg", "downloads": 14900, "portada": "https://www.gutenberg.org/cache/epub/621/pg621.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/621.epub3.images", "descripcion": "Estudio psicol\u00f3gico y emp\u00edrico cl\u00e1sico sobre la conversi\u00f3n, la oraci\u00f3n y los estados m\u00edsticos."}, {"id": "rel-25", "d": "rel-lo-sagrado-profano", "titulo": "Lo Sagrado y lo Profano", "autor": "Mircea Eliade", "fuente": "openlibrary", "downloads": 14600, "portada": "https://covers.openlibrary.org/b/id/966779-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Estudio fundamental de historia de las religiones sobre la experiencia del espacio y tiempo sagrados."}, {"id": "rel-26", "d": "rel-mito-eterno-retorno", "titulo": "El Mito del Eterno Retorno", "autor": "Mircea Eliade", "fuente": "openlibrary", "downloads": 14200, "portada": "https://covers.openlibrary.org/b/id/966806-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Arquetipos y repetici\u00f3n en las culturas religiosas tradicionales frente a la historia lineal."}, {"id": "rel-27", "d": "rel-religiones-mundo", "titulo": "Las Religiones del Mundo", "autor": "Huston Smith", "fuente": "openlibrary", "downloads": 13900, "portada": "https://covers.openlibrary.org/b/id/8289774-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Panorama claro y respetuoso del hinduismo, budismo, confucianismo, tao\u00edsmo, juda\u00edsmo, cristianismo e islam."}, {"id": "rel-28", "d": "rel-el-profeta", "titulo": "El Profeta", "autor": "Gibran Khalil Gibran", "fuente": "gutenberg", "downloads": 13600, "portada": "https://www.gutenberg.org/cache/epub/58585/pg58585.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/58585.epub3.images", "descripcion": "Poes\u00eda en prosa sobre el amor, la libertad, el trabajo y la muerte a trav\u00e9s del sabio Almustaf\u00e1."}, {"id": "rel-29", "d": "rel-nube-no-saber", "titulo": "La Nube del No-Saber", "autor": "M\u00edstico An\u00f3nimo Ingl\u00e9s", "fuente": "gutenberg", "downloads": 13300, "portada": "https://www.gutenberg.org/cache/epub/123/pg123.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/123.epub3.images", "descripcion": "Tratado medieval de teolog\u00eda apof\u00e1tica sobre la contemplaci\u00f3n de Dios m\u00e1s all\u00e1 del intelecto."}, {"id": "rel-30", "d": "rel-regla-san-benito", "titulo": "La Regla de San Benito", "autor": "San Benito de Nursia", "fuente": "gutenberg", "downloads": 13000, "portada": "https://www.gutenberg.org/cache/epub/7000/pg7000.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/7000.epub3.images", "descripcion": "El c\u00f3digo mon\u00e1stico que molde\u00f3 la civilizaci\u00f3n europea occidental bajo el lema Ora et Labora."}, {"id": "rel-31", "d": "rel-ejercicios-espirituales", "titulo": "Ejercicios Espirituales", "autor": "San Ignacio de Loyola", "fuente": "gutenberg", "downloads": 12700, "portada": "https://www.gutenberg.org/cache/epub/24580/pg24580.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24580.epub3.images", "descripcion": "M\u00e9todo de discernimiento espiritual, meditaci\u00f3n y compromiso vital con el Evangelio."}, {"id": "rel-32", "d": "rel-vida-jesus-renan", "titulo": "Vida de Jes\u00fas", "autor": "Ernest Renan", "fuente": "gutenberg", "downloads": 12400, "portada": "https://www.gutenberg.org/cache/epub/4900/pg4900.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4900.epub3.images", "descripcion": "Estudio hist\u00f3rico y literario del siglo XIX que revolucion\u00f3 la comprensi\u00f3n humana de Jes\u00fas de Nazaret."}, {"id": "rel-33", "d": "rel-ortodoxia-chesterton", "titulo": "Ortodoxia", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 12100, "portada": "https://www.gutenberg.org/cache/epub/130/pg130.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/130.epub3.images", "descripcion": "Brillante defensa del asombro infantil, el sentido com\u00fan y la fe cristiana contra el escepticismo."}, {"id": "rel-34", "d": "rel-hombre-eterno", "titulo": "El Hombre Eterno", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 11800, "portada": "https://www.gutenberg.org/cache/epub/247/pg247.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/247.epub3.images", "descripcion": "Visi\u00f3n de la historia humana como la preparaci\u00f3n y cumplimiento del evento de Cristo."}, {"id": "rel-35", "d": "rel-cartas-diablo", "titulo": "Cartas del Diablo a su Sobrino", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 11500, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800500.us.archive.org/cartas.pdf", "descripcion": "S\u00e1tira teol\u00f3gica epistolar sobre las sutiles tentaciones morales de la vida cotidiana."}, {"id": "rel-36", "d": "rel-mero-cristianismo", "titulo": "Mero Cristianismo", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 11200, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800600.us.archive.org/mero.pdf", "descripcion": "Explicaci\u00f3n l\u00f3gica y accesible de los fundamentos compartidos por todas las iglesias cristianas."}, {"id": "rel-37", "d": "rel-cuatro-amores", "titulo": "Los Cuatro Amores", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 10900, "portada": null, "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800700.us.archive.org/amores.pdf", "descripcion": "Exploraci\u00f3n de los afectos humanos: el afecto, la amistad, el eros y la caridad divina (\u00e1gape)."}, {"id": "rel-38", "d": "rel-iching", "titulo": "I Ching: El Libro de las Mutaciones", "autor": "Tradici\u00f3n Cl\u00e1sica China", "fuente": "gutenberg", "downloads": 10600, "portada": "https://www.gutenberg.org/cache/epub/1500/pg1500.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1500.epub3.images", "descripcion": "Or\u00e1culo y texto sapiencial milenario sobre las leyes del cambio en la naturaleza y el ser humano."}, {"id": "rel-39", "d": "rel-chuang-tzu", "titulo": "Libro de Chuang Tzu", "autor": "Zhuangzi", "fuente": "gutenberg", "downloads": 10300, "portada": "https://www.gutenberg.org/cache/epub/525/pg525.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/525.epub3.images", "descripcion": "Par\u00e1bolas po\u00e9ticas y humor\u00edsticas sobre la libertad interior y la espontaneidad del Tao."}, {"id": "rel-40", "d": "rel-analectas", "titulo": "Las Analectas", "autor": "Confucio", "fuente": "gutenberg", "downloads": 10000, "portada": "https://www.gutenberg.org/cache/epub/4094/pg4094.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4094.epub3.images", "descripcion": "Principios de rectitud \u00e9tica, piedad filial, benevolencia y rito para una sociedad arm\u00f3nica."}, {"id": "rel-41", "d": "rel-bodhisattva", "titulo": "El Camino del Bodhisattva (Bodhicaryavatara)", "autor": "Shantideva", "fuente": "archive", "downloads": 9800, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Tratado po\u00e9tico budista sobre la generaci\u00f3n de bodhichitta y el cultivo de la compasi\u00f3n infinita."}, {"id": "rel-42", "d": "rel-palabras-maestro", "titulo": "Palabras de mi Maestro Perfecto", "autor": "Patrul Rinpoche", "fuente": "archive", "downloads": 9500, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Instrucciones fundamentales de las pr\u00e1cticas preliminares del budismo tibetano de la tradici\u00f3n Dzogchen."}, {"id": "rel-43", "d": "rel-etica-spinoza", "titulo": "\u00c9tica demostrada seg\u00fan el orden geom\u00e9trico", "autor": "Baruch Spinoza", "fuente": "gutenberg", "downloads": 9300, "portada": "https://www.gutenberg.org/cache/epub/3800/pg3800.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3800.epub3.images", "descripcion": "La visi\u00f3n pante\u00edsta del universo donde Dios y la Naturaleza son una sola sustancia infinita."}, {"id": "rel-44", "d": "rel-religion-razon-kant", "titulo": "La Religi\u00f3n dentro de los L\u00edmites de la Mera Raz\u00f3n", "autor": "Immanuel Kant", "fuente": "gutenberg", "downloads": 9100, "portada": "https://www.gutenberg.org/cache/epub/48000/pg48000.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/48000.epub3.images", "descripcion": "Examen filos\u00f3fico del mal radical, la gracia divina y el deber moral como esencia de la fe."}, {"id": "rel-45", "d": "rel-temor-temblor", "titulo": "Temor y Temblor", "autor": "S\u00f8ren Kierkegaard", "fuente": "gutenberg", "downloads": 8900, "portada": "https://www.gutenberg.org/cache/epub/60333/pg60333.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/60333.epub3.images", "descripcion": "Meditaci\u00f3n existencial sobre el sacrificio de Abraham y la paradoja del salto de la fe."}, {"id": "rel-46", "d": "rel-obras-amor", "titulo": "Las Obras del Amor", "autor": "S\u00f8ren Kierkegaard", "fuente": "openlibrary", "downloads": 8700, "portada": "https://covers.openlibrary.org/b/id/3326357-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Discursos cristianos sobre el mandamiento de amar al pr\u00f3jimo y la naturaleza del amor desinteresado."}, {"id": "rel-47", "d": "rel-misterio-fe", "titulo": "El Misterio de la Fe", "autor": "Alexander Schmemann", "fuente": "archive", "downloads": 8500, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "La teolog\u00eda lit\u00fargica y los sacramentos en la espiritualidad de la Iglesia Ortodoxa Oriental."}, {"id": "rel-48", "d": "rel-teologia-mistica-oriental", "titulo": "La Teolog\u00eda M\u00edstica de la Iglesia Oriental", "autor": "Vladimir Lossky", "fuente": "archive", "downloads": 8300, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Estudio cl\u00e1sico del hesicasmo, la ap\u00f3fasis y la deificaci\u00f3n (theosis) del ser humano."}, {"id": "rel-49", "d": "rel-masnavi", "titulo": "Masnavi: El Poema Espiritual", "autor": "Jalal al-Din Rumi", "fuente": "gutenberg", "downloads": 8100, "portada": "https://www.gutenberg.org/cache/epub/2526/pg2526.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2526.epub3.images", "descripcion": "La obra maestra del misticismo suf\u00ed, considerada por muchos el Cor\u00e1n en lengua persa."}, {"id": "rel-50", "d": "rel-conferencia-pajaros", "titulo": "La Conferencia de los P\u00e1jaros", "autor": "Farid al-Din Attar", "fuente": "archive", "downloads": 7900, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Alegor\u00eda suf\u00ed de los treinta p\u00e1jaros que cruzan siete valles en busca del rey divino Simurg."}, {"id": "rel-51", "d": "rel-cabala-simbolismo", "titulo": "La C\u00e1bala y su Simbolismo", "autor": "Gershom Scholem", "fuente": "openlibrary", "downloads": 7700, "portada": "https://covers.openlibrary.org/b/id/581696-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "El estudio seminal sobre la m\u00edstica jud\u00eda, el lenguaje sagrado y el mito del Golem."}, {"id": "rel-52", "d": "rel-dios-busca-hombre", "titulo": "Dios en Busca del Hombre", "autor": "Abraham Joshua Heschel", "fuente": "openlibrary", "downloads": 7500, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Filosof\u00eda del juda\u00edsmo centrada en el asombro, la respuesta humana a la palabra divina y la acci\u00f3n \u00e9tica."}, {"id": "rel-53", "d": "rel-los-profetas-heschel", "titulo": "Los Profetas: Voz y Conciencia", "autor": "Abraham Joshua Heschel", "fuente": "openlibrary", "downloads": 7300, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "El patetismo divino y la pasi\u00f3n de los profetas de Israel por la justicia social incondicional."}, {"id": "rel-54", "d": "rel-francisco-asis-chesterton", "titulo": "San Francisco de As\u00eds", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 7100, "portada": "https://www.gutenberg.org/cache/epub/1887/pg1887.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1887.epub3.images", "descripcion": "Biograf\u00eda po\u00e9tica y espiritual del santo de la pobreza, el amor a la creaci\u00f3n y la hermandad."}, {"id": "rel-55", "d": "rel-leyenda-dorada", "titulo": "La Leyenda Dorada", "autor": "Santiago de la Vor\u00e1gine", "fuente": "gutenberg", "downloads": 6900, "portada": "https://www.gutenberg.org/cache/epub/39000/pg39000.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/39000.epub3.images", "descripcion": "La c\u00e9lebre recopilaci\u00f3n medieval de vidas de santos, milagros y fiestas del a\u00f1o lit\u00fargico."}, {"id": "rel-56", "d": "rel-confesiones-alghazali", "titulo": "El Rescatador del Error (Confesiones)", "autor": "Abu Hamid Al-Ghazali", "fuente": "archive", "downloads": 6700, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Itinerario intelectual desde la duda radical hasta la certeza intuitiva del misticismo suf\u00ed."}, {"id": "rel-57", "d": "rel-mente-zen", "titulo": "Mente Zen, Mente de Principiante", "autor": "Shunryu Suzuki", "fuente": "openlibrary", "downloads": 6500, "portada": null, "categoria": "religion", "idioma": "es", "descripcion": "Charlas sencillas sobre la postura, la respiraci\u00f3n y la pr\u00e1ctica abierta de la meditaci\u00f3n zazen."}, {"id": "rel-58", "d": "rel-eneadas-plotino", "titulo": "Las En\u00e9adas", "autor": "Plotino", "fuente": "gutenberg", "downloads": 6300, "portada": "https://www.gutenberg.org/cache/epub/42930/pg42930.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/42930.epub3.images", "descripcion": "El gran monumento del neoplatonismo sobre la emanaci\u00f3n c\u00f3smica desde El Uno inefable."}, {"id": "rel-59", "d": "rel-fedon-platon", "titulo": "Fed\u00f3n o Del Alma", "autor": "Plat\u00f3n", "fuente": "gutenberg", "downloads": 6100, "portada": "https://www.gutenberg.org/cache/epub/1658/pg1658.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1658.epub3.images", "descripcion": "\u00daltimas conversaciones de S\u00f3crates en prisi\u00f3n sobre la inmortalidad del alma y la vida tras la muerte."}, {"id": "rel-60", "d": "rel-meditaciones-seneca", "titulo": "Cartas a Lucilio sobre la Serenidad y la Providencia", "autor": "S\u00e9neca", "fuente": "gutenberg", "downloads": 5900, "portada": "https://www.gutenberg.org/cache/epub/16888/pg16888.cover.medium.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16888.epub3.images", "descripcion": "Espiritualidad estoica romana sobre la virtud interior, la resignaci\u00f3n noble y la raz\u00f3n divina."}, {"id": "rel-61", "d": "rel-king-james-bible", "titulo": "The Holy Bible (King James Version)", "autor": "Various Authors", "fuente": "gutenberg", "downloads": 32000, "portada": "https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "descripcion": "The majestic English translation of the Old and New Testaments commissioned in 1604."}, {"id": "rel-62", "d": "rel-pilgrims-progress", "titulo": "The Pilgrim's Progress", "autor": "John Bunyan", "fuente": "gutenberg", "downloads": 24000, "portada": "https://www.gutenberg.org/cache/epub/131/pg131.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/131.epub3.images", "descripcion": "Classic Christian allegory of Christian's arduous journey from the City of Destruction to the Celestial City."}, {"id": "rel-63", "d": "rel-song-celestial", "titulo": "The Song Celestial: Bhagavad-Gita", "autor": "Sir Edwin Arnold", "fuente": "gutenberg", "downloads": 18000, "portada": "https://www.gutenberg.org/cache/epub/2388/pg2388.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/2388.epub3.images", "descripcion": "The celebrated English poetic rendering of the Bhagavad Gita that inspired Mahatma Gandhi."}, {"id": "rel-64", "d": "rel-prophet-en", "titulo": "The Prophet", "autor": "Kahlil Gibran", "fuente": "gutenberg", "downloads": 17500, "portada": "https://www.gutenberg.org/cache/epub/58585/pg58585.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/58585.epub3.images", "descripcion": "Philosophic and spiritual essays in English prose on the universal human condition."}, {"id": "rel-65", "d": "rel-varieties-en", "titulo": "The Varieties of Religious Experience", "autor": "William James", "fuente": "gutenberg", "downloads": 15000, "portada": "https://www.gutenberg.org/cache/epub/621/pg621.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/621.epub3.images", "descripcion": "Seminal psychological lectures delivered at Edinburgh exploring mysticism, faith, and healthy-mindedness."}, {"id": "rel-66", "d": "rel-mere-christianity-en", "titulo": "Mere Christianity", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 14000, "portada": "https://covers.openlibrary.org/b/id/718144-M.jpg", "categoria": "religion", "idioma": "en", "fileUrl": "https://ia800800.us.archive.org/mere_en.pdf", "descripcion": "Original BBC radio broadcasts articulating standard core Christian beliefs without sectarian bias."}, {"id": "rel-67", "d": "rel-orthodoxy-en", "titulo": "Orthodoxy", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 13500, "portada": "https://www.gutenberg.org/cache/epub/130/pg130.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/130.epub3.images", "descripcion": "Masterpiece of Christian defense examining fairy tales, logic, romance, and the balance of creeds."}, {"id": "rel-68", "d": "rel-cloud-unknowing-en", "titulo": "The Cloud of Unknowing", "autor": "Anonymous 14th Century Monk", "fuente": "gutenberg", "downloads": 12800, "portada": "https://www.gutenberg.org/cache/epub/123/pg123.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/123.epub3.images", "descripcion": "Middle English apophatic spiritual guide teaching contemplative prayer through silent loving intent."}, {"id": "rel-69", "d": "rel-gospel-buddha", "titulo": "The Gospel of Buddha", "autor": "Paul Carus", "fuente": "gutenberg", "downloads": 12000, "portada": "https://www.gutenberg.org/cache/epub/3589/pg3589.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/3589.epub3.images", "descripcion": "Comprehensive anthology compiled from Pali scriptures presenting the teachings of Gotama Buddha."}, {"id": "rel-70", "d": "rel-light-of-asia", "titulo": "The Light of Asia", "autor": "Sir Edwin Arnold", "fuente": "gutenberg", "downloads": 11500, "portada": "https://www.gutenberg.org/cache/epub/8404/pg8404.cover.medium.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/8404.epub3.images", "descripcion": "Narrative epic poem detailing the life, spiritual search, and awakening of Prince Gautama Siddhartha."}, {"id": "rel-71", "d": "rel-pensees-fr", "titulo": "Pens\u00e9es de Pascal sur la Religion", "autor": "Blaise Pascal", "fuente": "gutenberg", "downloads": 11000, "portada": "https://www.gutenberg.org/cache/epub/18269/pg18269.cover.medium.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/18269.epub3.images", "descripcion": "Apologie inachev\u00e9e de la religion chr\u00e9tienne, un sommet de la pens\u00e9e et de la langue fran\u00e7aise."}, {"id": "rel-72", "d": "rel-vie-jesus-fr", "titulo": "Vie de J\u00e9sus (Original Fran\u00e7ais)", "autor": "Ernest Renan", "fuente": "gutenberg", "downloads": 10500, "portada": "https://www.gutenberg.org/cache/epub/4900/pg4900.cover.medium.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/4900.epub3.images", "descripcion": "La biographie humaniste et po\u00e9tique qui a transform\u00e9 la lecture des textes \u00e9vang\u00e9liques au XIXe si\u00e8cle."}, {"id": "rel-73", "d": "rel-tolerance-voltaire", "titulo": "Trait\u00e9 sur la Tol\u00e9rance", "autor": "Voltaire", "fuente": "gutenberg", "downloads": 10200, "portada": "https://www.gutenberg.org/cache/epub/28498/pg28498.cover.medium.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/28498.epub3.images", "descripcion": "Plaidoyer vibrant pour la libert\u00e9 de culte, la paix civile et contre le fanatisme religieux."}, {"id": "rel-74", "d": "rel-religion-kant-de", "titulo": "Die Religion innerhalb der Grenzen der blo\u00dfen Vernunft", "autor": "Immanuel Kant", "fuente": "gutenberg", "downloads": 9900, "portada": "https://www.gutenberg.org/cache/epub/48000/pg48000.cover.medium.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/48000.epub3.images", "descripcion": "Kants religionsphilosophisches Hauptwerk \u00fcber Vernunftglaube, Moral und die unsichtbare Kirche."}, {"id": "rel-75", "d": "rel-furcht-zittern-de", "titulo": "Furcht und Zittern", "autor": "S\u00f8ren Kierkegaard", "fuente": "gutenberg", "downloads": 9600, "portada": "https://www.gutenberg.org/cache/epub/60333/pg60333.cover.medium.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/60333.epub3.images", "descripcion": "Dialektische Lyrik \u00fcber den Glaubensritter Abraham und die theologische Suspendierung des Ethischen."}, {"id": "rel-76", "d": "rel-siddhartha-de", "titulo": "Siddhartha: Eine indische Dichtung", "autor": "Hermann Hesse", "fuente": "gutenberg", "downloads": 16000, "portada": "https://www.gutenberg.org/cache/epub/2493/pg2493.cover.medium.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/2493.epub3.images", "descripcion": "Die legend\u00e4re Erz\u00e4hlung von der spirituellen Selbstfindung eines jungen Brahmanen im alten Indien."}, {"id": "rel-77", "d": "rel-divina-commedia-it", "titulo": "La Divina Commedia (Testo Originale)", "autor": "Dante Alighieri", "fuente": "gutenberg", "downloads": 27000, "portada": "https://www.gutenberg.org/cache/epub/1012/pg1012.cover.medium.jpg", "categoria": "religion", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/1012.epub3.images", "descripcion": "Il supremo poema sacro della fede cristiana: viaggio tra Inferno, Purgatorio e la visione di Dio nel Paradiso."}, {"id": "rel-78", "d": "rel-fioretti-francesco-it", "titulo": "I Fioretti di San Francesco", "autor": "Ugolino da Montegiorgio", "fuente": "gutenberg", "downloads": 9400, "portada": "https://www.gutenberg.org/cache/epub/18999/pg18999.cover.medium.jpg", "categoria": "religion", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/18999.epub3.images", "descripcion": "I racconti poetici e miracolosi della santa povert\u00e0 e dell'amore francescano per tutte le creature."}, {"id": "rel-79", "d": "rel-biblia-sagrada-pt", "titulo": "A B\u00edblia Sagrada (Tradu\u00e7\u00e3o de Jo\u00e3o Ferreira de Almeida)", "autor": "V\u00e1rios Autores", "fuente": "gutenberg", "downloads": 15000, "portada": "https://www.gutenberg.org/cache/epub/2300/pg2300.cover.medium.jpg", "categoria": "religion", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/2300.epub3.images", "descripcion": "A tradu\u00e7\u00e3o cl\u00e1ssica em l\u00edngua portuguesa das Sagradas Escrituras do Antigo e Novo Testamento."}, {"id": "rel-80", "d": "rel-evangelho-espiritismo-pt", "titulo": "O Evangelho Segundo o Espiritismo", "autor": "Allan Kardec", "fuente": "archive", "downloads": 12500, "portada": "https://covers.openlibrary.org/b/id/10538492-M.jpg", "categoria": "religion", "idioma": "pt", "fileUrl": "https://ia800900.us.archive.org/kardec.pdf", "descripcion": "Explica\u00e7\u00e3o dos preceitos morais do Cristo sob a \u00f3tica dos ensinamentos dos Esp\u00edritos."}];

const LIBROS_MUSICA_CURADOS = [{"id": "mus-1", "d": "mus-beethoven-cartas", "titulo": "Beethoven: Cartas y Pensamientos", "autor": "Ludwig van Beethoven", "fuente": "gutenberg", "downloads": 45200, "portada": "https://www.gutenberg.org/cache/epub/1317/pg1317.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1317.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Beethoven_Moonlight_1st_movement.ogg", "descripcion": "Correspondencia personal, diarios \u00edntimos y reflexiones sobre la creaci\u00f3n musical del genio de Bonn."}, {"id": "mus-2", "d": "mus-mozart-epistolario", "titulo": "Mozart: Epistolario y Vida Familiar", "autor": "Wolfgang Amadeus Mozart", "fuente": "gutenberg", "downloads": 42100, "portada": "https://www.gutenberg.org/cache/epub/17563/pg17563.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17563.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg", "descripcion": "Cartas vibrantes y llenas de humor e ingenio dirigidas a su padre Leopold, su hermana Nannerl y su esposa Constanze."}, {"id": "mus-3", "d": "mus-bach-vida-arte", "titulo": "Johann Sebastian Bach: Vida, Arte y Obra", "autor": "Johann Nikolaus Forkel", "fuente": "gutenberg", "downloads": 39800, "portada": "https://www.gutenberg.org/cache/epub/35686/pg35686.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/35686.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/82/Toccata_et_Fuga_in_re_minore%2C_BWV_565.ogg", "descripcion": "La primera y m\u00e1s influyente biograf\u00eda del gran maestro del contrapunto y la polifon\u00eda barroca."}, {"id": "mus-4", "d": "mus-chopin-hombre-musica", "titulo": "Chopin: El Hombre y su M\u00fasica", "autor": "James Huneker", "fuente": "gutenberg", "downloads": 38400, "portada": "https://www.gutenberg.org/cache/epub/13540/pg13540.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13540.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/be/Frederic_Chopin_-_Nocturne_in_E-flat_major%2C_Op._9%2C_No._2.ogg", "descripcion": "Sensible an\u00e1lisis del lirismo pian\u00edstico, las baladas, nocturnos y la melanc\u00f3lica patria polaca en la obra de Chopin."}, {"id": "mus-5", "d": "mus-grandes-compositores-alemanes", "titulo": "Grandes Compositores Alemanes: De Bach a Wagner", "autor": "George T. Ferris", "fuente": "gutenberg", "downloads": 36700, "portada": "https://www.gutenberg.org/cache/epub/16560/pg16560.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16560.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Ludwig_van_Beethoven_-_Symphony_No._5_-_I._Allegro_con_brio.ogg", "descripcion": "Recorrido por las vidas y obras maestras de Gluck, Haydn, Mozart, Beethoven, Schubert, Schumann y Wagner."}, {"id": "mus-6", "d": "mus-grandes-compositores-italianos", "titulo": "Grandes Compositores Italianos y Franceses", "autor": "George T. Ferris", "fuente": "gutenberg", "downloads": 34500, "portada": "https://www.gutenberg.org/cache/epub/26400/pg26400.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/26400.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Vivaldi_Spring_mvt_1_Allegro.ogg", "descripcion": "La escuela mel\u00f3dica del bel canto, la \u00f3pera italiana y el refinamiento sinf\u00f3nico franc\u00e9s desde Palestrina hasta Verdi y Berlioz."}, {"id": "mus-7", "d": "mus-wagner-vida-dramas", "titulo": "Richard Wagner: Su Vida y Dramas Musicales", "autor": "W. J. Henderson", "fuente": "gutenberg", "downloads": 33200, "portada": "https://www.gutenberg.org/cache/epub/17094/pg17094.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17094.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Richard_Wagner_-_Ride_of_the_Valkyries.ogg", "descripcion": "Estudio de la revoluci\u00f3n wagneriana, el leitmotiv, el concepto de obra de arte total (Gesamtkunstwerk) y la tetralog\u00eda del Anillo."}, {"id": "mus-8", "d": "mus-como-escuchar-musica", "titulo": "C\u00f3mo Escuchar la M\u00fasica: Gu\u00eda para Mel\u00f3manos", "autor": "Henry Edward Krehbiel", "fuente": "gutenberg", "downloads": 35900, "portada": "https://www.gutenberg.org/cache/epub/15814/pg15814.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15814.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Dvorak_-_Symphony_No._9_%27From_the_New_World%27_-_II._Largo.ogg", "descripcion": "Claves accesibles para comprender la armon\u00eda, las formas sinf\u00f3nicas y la orquestaci\u00f3n sin necesidad de conocimientos t\u00e9cnicos previos."}, {"id": "mus-9", "d": "mus-historia-musica", "titulo": "Historia Fundamental de la M\u00fasica", "autor": "Charles Villiers Stanford y Cecil Forsyth", "fuente": "gutenberg", "downloads": 31800, "portada": "https://www.gutenberg.org/cache/epub/13348/pg13348.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13348.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Brandenburg_No3_1.ogg", "descripcion": "Monumental tratado sobre el origen del canto, las escalas antiguas, la polifon\u00eda medieval y la madurez de la m\u00fasica cl\u00e1sica occidental."}, {"id": "mus-10", "d": "mus-musica-arte-lenguaje", "titulo": "La M\u00fasica: Arte y Lenguaje Universal", "autor": "Walter Raymond Spalding", "fuente": "gutenberg", "downloads": 30500, "portada": "https://www.gutenberg.org/cache/epub/24785/pg24785.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24785.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/25/Claude_Debussy_-_Clair_de_lune.ogg", "descripcion": "Exploraci\u00f3n est\u00e9tica y formal de los elementos expresivos de la m\u00fasica y su impacto emotivo en la psicolog\u00eda humana."}, {"id": "mus-11", "d": "mus-grandes-operas-clasicas", "titulo": "Las Grandes \u00d3peras Cl\u00e1sicas y sus Argumentos", "autor": "George P. Upton", "fuente": "gutenberg", "downloads": 29800, "portada": "https://www.gutenberg.org/cache/epub/26038/pg26038.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/26038.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Handel_-_messiah_-_44_hallelujah.ogg", "descripcion": "Gu\u00eda descriptiva de las tramas, personajes y arias principales del repertorio l\u00edrico universal."}, {"id": "mus-12", "d": "mus-beethoven-nueve-sinfonias", "titulo": "Beethoven y sus Nueve Sinfon\u00edas", "autor": "George Grove", "fuente": "gutenberg", "downloads": 34100, "portada": "https://www.gutenberg.org/cache/epub/23485/pg23485.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/23485.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Ludwig_van_Beethoven_-_Symphony_No._5_-_I._Allegro_con_brio.ogg", "descripcion": "El an\u00e1lisis m\u00e1s c\u00e9lebre y detallado de cada movimiento sinf\u00f3nico beethoveniano, desde la Primera hasta la Novena Coral."}, {"id": "mus-13", "d": "mus-vida-johannes-brahms", "titulo": "La Vida de Johannes Brahms", "autor": "Florence May", "fuente": "gutenberg", "downloads": 28700, "portada": "https://www.gutenberg.org/cache/epub/21894/pg21894.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/21894.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Johannes_Brahms_-_Hungarian_Dance_No._5_in_G_minor.ogg", "descripcion": "Relato testimonial de la alumna directa de Brahms sobre el rigor artesanal, el temperamento \u00edntimo y la pureza formal del compositor."}, {"id": "mus-14", "d": "mus-musica-y-musicos", "titulo": "La M\u00fasica y los M\u00fasicos", "autor": "Albert Lavignac", "fuente": "gutenberg", "downloads": 27900, "portada": "https://www.gutenberg.org/cache/epub/17588/pg17588.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17588.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/Gymnopedie_No._1.ogg", "descripcion": "Manual exhaustivo del profesor del Conservatorio de Par\u00eds sobre ac\u00fastica, gram\u00e1tica tonal, orquestaci\u00f3n y est\u00e9tica."}, {"id": "mus-15", "d": "mus-libro-completo-opera", "titulo": "El Libro Completo de la \u00d3pera", "autor": "Gustav Kobb\u00e9", "fuente": "gutenberg", "downloads": 32400, "portada": "https://www.gutenberg.org/cache/epub/16298/pg16298.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16298.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/86/Dance_of_the_Sugar_Plum_Fairy.ogg", "descripcion": "La biblia oper\u00edstica con historias, an\u00e1lisis musicales y motivos tem\u00e1ticos de cientos de obras maestras."}, {"id": "mus-16", "d": "mus-arte-del-cantante", "titulo": "El Arte del Cantante y la Voz Humana", "autor": "W. J. Henderson", "fuente": "gutenberg", "downloads": 26800, "portada": "https://www.gutenberg.org/cache/epub/14068/pg14068.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/14068.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Schubert_-_Ave_Maria.ogg", "descripcion": "Principios t\u00e9cnicos del canto cl\u00e1sico, control de la respiraci\u00f3n, dicci\u00f3n, agilidad vocal y expresividad interpretativa."}, {"id": "mus-17", "d": "mus-filosofia-de-la-musica", "titulo": "Filosof\u00eda de la M\u00fasica y Leyes del Sonido", "autor": "William Pole", "fuente": "gutenberg", "downloads": 25700, "portada": "https://www.gutenberg.org/cache/epub/16428/pg16428.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16428.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Johann_Strauss_II_-_The_Blue_Danube_Waltz.ogg", "descripcion": "Indagaci\u00f3n cient\u00edfica y metaf\u00edsica sobre por qu\u00e9 ciertas combinaciones de frecuencias producen placer arm\u00f3nico."}, {"id": "mus-18", "d": "mus-opera-rusa", "titulo": "La \u00d3pera Rusa: Tchaikovsky y Rimsky-Korsakov", "autor": "Rosa Newmarch", "fuente": "gutenberg", "downloads": 26400, "portada": "https://www.gutenberg.org/cache/epub/24391/pg24391.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24391.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Flight_of_the_Bumblebee.ogg", "descripcion": "El despertar musical del nacionalismo eslavo a trav\u00e9s del Grupo de los Cinco y las cumbres l\u00edricas del Imperio Ruso."}, {"id": "mus-19", "d": "mus-evolucion-orquestacion", "titulo": "Evoluci\u00f3n de la Orquestaci\u00f3n Moderna", "autor": "Louis Adolphe Coerne", "fuente": "gutenberg", "downloads": 27200, "portada": "https://www.gutenberg.org/cache/epub/13411/pg13411.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13411.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Maurice_Ravel_-_Bol%C3%A9ro.ogg", "descripcion": "Tratado sobre el desarrollo instrumental del timbre, la textura orquestal y los grandes art\u00edfices de la t\u00edmbrica moderna."}, {"id": "mus-20", "d": "mus-historia-del-canto", "titulo": "Historia del Canto y de los Grandes Int\u00e9rpretes", "autor": "David C. Taylor", "fuente": "gutenberg", "downloads": 24900, "portada": "https://www.gutenberg.org/cache/epub/22896/pg22896.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/22896.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Schubert_-_Ave_Maria.ogg", "descripcion": "Cr\u00f3nica de los m\u00e9todos vocales tradicionales italianos que formaron a las voces m\u00e1s legendarias de la historia."}, {"id": "mus-21", "d": "mus-musica-de-camara", "titulo": "Historia de la M\u00fasica de C\u00e1mara", "autor": "N. Kilburn", "fuente": "gutenberg", "downloads": 25300, "portada": "https://www.gutenberg.org/cache/epub/18274/pg18274.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18274.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/be/Frederic_Chopin_-_Nocturne_in_E-flat_major%2C_Op._9%2C_No._2.ogg", "descripcion": "El arte del di\u00e1logo \u00edntimo entre instrumentos solistas: cuartetos de cuerda, tr\u00edos con piano y serenatas."}, {"id": "mus-22", "d": "mus-estudios-musica-moderna", "titulo": "Estudios sobre la M\u00fasica Moderna", "autor": "W. H. Hadow", "fuente": "gutenberg", "downloads": 24600, "portada": "https://www.gutenberg.org/cache/epub/25413/pg25413.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/25413.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Liszt_Liebestraum_no_3.ogg", "descripcion": "Ensayos l\u00facidos sobre Berlioz, Schumann y Wagner como forjadores de la sensibilidad arm\u00f3nica de la modernidad."}, {"id": "mus-23", "d": "mus-musica-y-moral", "titulo": "M\u00fasica y Moral: Psicolog\u00eda de la Armon\u00eda", "autor": "H. R. Haweis", "fuente": "gutenberg", "downloads": 23800, "portada": "https://www.gutenberg.org/cache/epub/19683/pg19683.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/19683.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Edvard_Grieg_-_Peer_Gynt_Suite_No._1%2C_Op._46_-_I._Morning_Mood.ogg", "descripcion": "Reflexiones sobre la influencia \u00e9tica, social y espiritual del sonido musical en la formaci\u00f3n del car\u00e1cter humano."}, {"id": "mus-24", "d": "mus-el-violin-constructores", "titulo": "El Viol\u00edn: Constructores C\u00e9lebres e Imitadores", "autor": "George Hart", "fuente": "gutenberg", "downloads": 28100, "portada": "https://www.gutenberg.org/cache/epub/24901/pg24901.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24901.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Vivaldi_Spring_mvt_1_Allegro.ogg", "descripcion": "Historia de la luther\u00eda cremonesa: Stradivari, Guarneri, Amati y los secretos ac\u00fasticos de los grandes instrumentos."}, {"id": "mus-25", "d": "mus-ensayos-criticos-musica", "titulo": "Ensayos Cr\u00edticos e Hist\u00f3ricos sobre la M\u00fasica", "autor": "Edward MacDowell", "fuente": "gutenberg", "downloads": 23400, "portada": "https://www.gutenberg.org/cache/epub/26421/pg26421.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/26421.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Liszt_Liebestraum_no_3.ogg", "descripcion": "Lecciones del primer gran compositor cl\u00e1sico norteamericano sobre la sugesti\u00f3n po\u00e9tica y la libertad formal."}, {"id": "mus-26", "d": "mus-compositores-romanticos", "titulo": "Los Compositores Rom\u00e1nticos", "autor": "Daniel Gregory Mason", "fuente": "gutenberg", "downloads": 25100, "portada": "https://www.gutenberg.org/cache/epub/17290/pg17290.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17290.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Johannes_Brahms_-_Hungarian_Dance_No._5_in_G_minor.ogg", "descripcion": "Estudio comprensivo del individualismo expresivo en Schubert, Schumann, Mendelssohn, Chopin y Berlioz."}, {"id": "mus-27", "d": "mus-historia-del-piano", "titulo": "Historia del Piano y la T\u00e9cnica Pian\u00edstica", "autor": "Edgar Brinsmead", "fuente": "gutenberg", "downloads": 26900, "portada": "https://www.gutenberg.org/cache/epub/20110/pg20110.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/20110.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/2/25/Claude_Debussy_-_Clair_de_lune.ogg", "descripcion": "La evoluci\u00f3n mec\u00e1nica desde el monocordio y el clavec\u00edn hasta el piano de cola moderno y sus posibilidades sonoras."}, {"id": "mus-28", "d": "mus-berlioz-cartas-memorias", "titulo": "H\u00e9ctor Berlioz: Cartas y Memorias", "autor": "Hector Berlioz", "fuente": "gutenberg", "downloads": 24200, "portada": "https://www.gutenberg.org/cache/epub/13248/pg13248.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13248.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Maurice_Ravel_-_Bol%C3%A9ro.ogg", "descripcion": "Autobiograf\u00eda apasionada y tempestuosa del creador de la Sinfon\u00eda Fant\u00e1stica y maestro de la t\u00edmbrica rom\u00e1ntica."}, {"id": "mus-29", "d": "mus-nacimiento-tragedia-musica", "titulo": "El Nacimiento de la Tragedia en la M\u00fasica", "autor": "Friedrich Nietzsche", "fuente": "gutenberg", "downloads": 31200, "portada": "https://www.gutenberg.org/cache/epub/51060/pg51060.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/51060.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Richard_Wagner_-_Ride_of_the_Valkyries.ogg", "descripcion": "La c\u00e9lebre distinci\u00f3n filos\u00f3fica entre lo apol\u00edneo y lo dionis\u00edaco como esencia fundamental de la m\u00fasica universal."}, {"id": "mus-30", "d": "mus-psicologia-talento-musical", "titulo": "Psicolog\u00eda del Talento Musical", "autor": "Carl E. Seashore", "fuente": "gutenberg", "downloads": 22800, "portada": "https://www.gutenberg.org/cache/epub/36006/pg36006.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/36006.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Beethoven_Moonlight_1st_movement.ogg", "descripcion": "Investigaci\u00f3n cient\u00edfica pionera sobre la afinaci\u00f3n tonal, la memoria mel\u00f3dica, el sentido del ritmo y la imaginer\u00eda auditiva."}, {"id": "mus-31", "d": "mus-compositores-modernos-europa", "titulo": "Compositores Modernos de Europa", "autor": "Arthur Elson", "fuente": "gutenberg", "downloads": 23100, "portada": "https://www.gutenberg.org/cache/epub/15682/pg15682.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/15682.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/Gymnopedie_No._1.ogg", "descripcion": "Panorama cr\u00edtico de las corrientes post-rom\u00e1nticas e impresionistas en Francia, Alemania, Rusia e Inglaterra."}, {"id": "mus-32", "d": "mus-poder-del-sonido", "titulo": "El Poder del Sonido y la Belleza Musical", "autor": "Edmund Gurney", "fuente": "gutenberg", "downloads": 22400, "portada": "https://www.gutenberg.org/cache/epub/18196/pg18196.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18196.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Edvard_Grieg_-_Peer_Gynt_Suite_No._1%2C_Op._46_-_I._Morning_Mood.ogg", "descripcion": "Monumental tratado de est\u00e9tica filos\u00f3fica sobre la percepci\u00f3n de las melod\u00edas y la autonom\u00eda formal de la m\u00fasica pura."}, {"id": "mus-33", "d": "mus-diccionario-biografico-musicos", "titulo": "Diccionario Biogr\u00e1fico de M\u00fasicos", "autor": "George Grove", "fuente": "gutenberg", "downloads": 27600, "portada": "https://www.gutenberg.org/cache/epub/23072/pg23072.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/23072.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg", "descripcion": "La obra de referencia enciclop\u00e9dica por antonomasia sobre compositores, t\u00e9rminos te\u00f3ricos e instrumentos musicales."}, {"id": "mus-34", "d": "mus-historia-del-violoncello", "titulo": "Historia del Violoncello y su Literatura", "autor": "Edmund van der Straeten", "fuente": "gutenberg", "downloads": 21900, "portada": "https://www.gutenberg.org/cache/epub/33303/pg33303.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/33303.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/8/82/Toccata_et_Fuga_in_re_minore%2C_BWV_565.ogg", "descripcion": "De la viola da gamba al violoncello solista: evoluci\u00f3n t\u00e9cnica, suites de Bach y conciertos virtuosos."}, {"id": "mus-35", "d": "mus-musica-tradicional-pueblos", "titulo": "La M\u00fasica Tradicional de los Pueblos", "autor": "Henry Fothergill Chorley", "fuente": "gutenberg", "downloads": 22500, "portada": "https://www.gutenberg.org/cache/epub/21390/pg21390.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/21390.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Johann_Strauss_II_-_The_Blue_Danube_Waltz.ogg", "descripcion": "Etnomusicolog\u00eda temprana sobre los cantos populares, danzas tradicionales y folclore sonoro de las naciones."}, {"id": "mus-36", "d": "mus-acustica-arte-musical", "titulo": "Las Leyes de la Ac\u00fastica y el Arte Musical", "autor": "Arthur Michael Shenstone", "fuente": "gutenberg", "downloads": 21800, "portada": "https://www.gutenberg.org/cache/epub/18501/pg18501.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18501.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Dvorak_-_Symphony_No._9_%27From_the_New_World%27_-_II._Largo.ogg", "descripcion": "Fundamentos f\u00edsicos de las ondas sonoras, los arm\u00f3nicos, la resonancia y la afinaci\u00f3n temperada en los instrumentos."}, {"id": "mus-37", "d": "mus-vida-franz-liszt", "titulo": "Vida de Franz Liszt y el Romanticismo", "autor": "James Huneker", "fuente": "gutenberg", "downloads": 25800, "portada": "https://www.gutenberg.org/cache/epub/20658/pg20658.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/20658.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/7/74/Liszt_Liebestraum_no_3.ogg", "descripcion": "Semblanza del coloso del piano, inventor del poema sinf\u00f3nico y figura central de la vida cultural decimon\u00f3nica."}, {"id": "mus-38", "d": "mus-musica-poesia-renacimiento", "titulo": "M\u00fasica y Poes\u00eda en el Renacimiento", "autor": "Sidney Lanier", "fuente": "gutenberg", "downloads": 21400, "portada": "https://www.gutenberg.org/cache/epub/16763/pg16763.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16763.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Brandenburg_No3_1.ogg", "descripcion": "El v\u00ednculo indisoluble entre la m\u00e9trica po\u00e9tica, la entonaci\u00f3n l\u00edrica y las formas madrigal\u00edsticas renacentistas."}, {"id": "mus-39", "d": "mus-historia-orquesta", "titulo": "Historia de la Orquesta y sus Instrumentos", "autor": "Stewart Macpherson", "fuente": "gutenberg", "downloads": 28500, "portada": "https://www.gutenberg.org/cache/epub/14247/pg14247.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/14247.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Ludwig_van_Beethoven_-_Symphony_No._5_-_I._Allegro_con_brio.ogg", "descripcion": "Tratado pedag\u00f3gico sobre la disposici\u00f3n de cuerdas, maderas, metales y percusi\u00f3n en el escenario sinf\u00f3nico."}, {"id": "mus-40", "d": "mus-tratado-canto-garcia", "titulo": "Tratado Completo del Canto", "autor": "Manuel Garc\u00eda", "fuente": "gutenberg", "downloads": 26200, "portada": "https://www.gutenberg.org/cache/epub/39804/pg39804.cover.medium.jpg", "categoria": "m\u00fasica", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/39804.epub3.images", "audioUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Schubert_-_Ave_Maria.ogg", "descripcion": "El m\u00e9todo pedag\u00f3gico vocal m\u00e1s influyente del siglo XIX, escrito por el inventor del laringoscopio."}];

const detectarIdiomaLibro = (b) => {
	if (!b) return "es";
	const raw = aTextoPlano(b.idioma || b.language || b.lang).toLowerCase().trim();
	if (raw) {
		for (const p of ["es", "en", "fr", "de", "it", "pt"]) {
			if (raw.startsWith(p)) return p;
		}
		if (raw === "spa" || raw === "spanish" || raw === "castellano") return "es";
		if (raw === "eng" || raw === "english") return "en";
		if (raw === "fra" || raw === "fre" || raw === "french") return "fr";
		if (raw === "deu" || raw === "ger" || raw === "german") return "de";
		if (raw === "ita" || raw === "italian") return "it";
		if (raw === "por" || raw === "portuguese") return "pt";
	}
	const tit = aTextoPlano(b.titulo || b.title).toLowerCase();
	const aut = aTextoPlano(b.autor || (Array.isArray(b.authors) ? b.authors[0] : b.authors) || b.creator).toLowerCase();
	const desc = aTextoPlano(b.descripcion || b.synopsis || b.description).toLowerCase();
	const full = `${tit} ${aut} ${desc}`;

	// Español inequívoco
	if (/\b(de|en|el|la|los|las|un|una|del|y|por|para|con|historia|vida|cartas|cuentos|ensayos|poemas|tratado|libro|sobre|estudios|obras|memorias|pensamientos|filosofía|religión|música|principios)\b/i.test(tit)) return "es";
	// Inglés inequívoco
	if (/\b(the|and|of|in|to|for|with|on|by|from|at|about|into|through|after|life|history|story|stories|letters|essays|tales|great|world|young|little|man|woman|book|guide|songs|poems|novel)\b/i.test(tit)) return "en";
	// Francés
	if (/\b(le|la|les|du|des|un|une|pour|dans|sur|avec|lettres|histoire|vie|oeuvres|poèmes|contes)\b/i.test(tit)) return "fr";
	// Alemán
	if (/\b(der|die|das|ein|eine|und|von|mit|für|über|briefe|leben|geschichte|werke)\b/i.test(tit)) return "de";
	// Italiano
	if (/\b(il|lo|la|i|gli|le|del|della|dei|degli|con|per|storia|vita|lettere|opere)\b/i.test(tit)) return "it";
	// Portugués
	if (/\b(o|a|os|as|do|da|dos|das|com|para|história|vida|cartas|poemas)\b/i.test(tit)) return "pt";

	if (/\b(the|and|of|in|for)\b/i.test(full)) return "en";
	if (/\b(le|la|les|des)\b/i.test(full)) return "fr";
	if (/\b(der|die|das|und)\b/i.test(full)) return "de";
	if (/\b(il|del|della)\b/i.test(full)) return "it";

	return "es";
};

const matchesIdioma = (b, filtro) => {
	if (!filtro || filtro === "todos") return true;
	return detectarIdiomaLibro(b) === filtro;
};

const LISTA_CATS_UNIFICADAS = [
	{ id: "manga", label: "Manga & Manhwa", icon: "🎌" },
	{ id: "ficción", label: "Ficción", icon: "📖" },
	{ id: "romance", label: "Romance", icon: "💖" },
	{ id: "ciencia", label: "Ciencia", icon: "🔬" },
	{ id: "historia", label: "Historia", icon: "📜" },
	{ id: "filosofía", label: "Filosofía", icon: "💭" },
	{ id: "religion", label: "Religión", icon: "🕊️" },
	{ id: "biblias", label: "Biblias", icon: "📖" },
	{ id: "música", label: "Música", icon: "🎵" },
	{ id: "poesía", label: "Poesía", icon: "🎭" },
	{ id: "misterio", label: "Misterio", icon: "🔍" },
	{ id: "fantasía", label: "Fantasía", icon: "🐉" },
	{ id: "biografía", label: "Biografía", icon: "👤" },
	{ id: "clásicos", label: "Clásicos", icon: "🏺" },
	{ id: "infantil", label: "Infantil", icon: "🎈" },
	{ id: "aventura", label: "Aventura", icon: "🧭" },
	{ id: "arte", label: "Arte", icon: "🎨" },
	{ id: "cómics", label: "Cómics", icon: "💬" }
];
const MAPA_SUBJECT_OL = {
	"ciencia": "science",
	"historia": "history",
	"filosofía": "philosophy",
	"religion": "religion",
	"biblias": "bible",
	"religión": "religion",
	"música": "music",
	"musica": "music",
	"poesía": "poetry",
	"misterio": "mystery_and_detective_stories",
	"fantasía": "fantasy",
	"biografía": "biography",
	"clásicos": "classic_literature",
	"infantil": "children",
	"aventura": "adventure_stories",
	"arte": "art",
	"cómics": "comic_books",
	"romance": "romance",
	"politica": "politics_and_government",
	"ficción": "fiction",
	"manga": "manga"
};

const docToLibroOL = (doc, catId) => {
	if (!doc) return null;
	const tit = aTextoPlano(doc.title) || "Libro";
	let aut = "Autor";
	if (Array.isArray(doc.author_name) && doc.author_name.length > 0) {
		aut = aTextoPlano(doc.author_name.slice(0, 2));
	} else if (Array.isArray(doc.authors) && doc.authors.length > 0) {
		aut = aTextoPlano(doc.authors.slice(0, 2));
	} else if (doc.author_name) {
		aut = aTextoPlano(doc.author_name);
	} else if (doc.authors) {
		aut = aTextoPlano(doc.authors);
	}
	const covId = doc.cover_id || doc.cover_i;
	const iaId = Array.isArray(doc.ia) && doc.ia[0] ? String(doc.ia[0]) : (typeof doc.ia === "string" ? doc.ia : null);
	const cov = covId ? `https://covers.openlibrary.org/b/id/${covId}-M.jpg` : (iaId ? `https://archive.org/services/img/${iaId}` : null);
	const desc = aTextoPlano(doc.description || doc.subject) || "Obra disponible en bibliotecas digitales abiertas.";
	return {
		id: "ol-" + (doc.key ? String(doc.key).replace(/\//g, "-") : ("gen-" + Math.random().toString(36).slice(2))),
		d: "ol-" + (doc.key ? String(doc.key).replace(/\//g, "-") : ("gen-" + Math.random().toString(36).slice(2))),
		titulo: tit,
		autor: aut,
		categoria: catId || "general",
		portada: cov,
		downloads: Math.round(15000 + Math.random() * 25000),
		fuente: "openlibrary",
		epub: iaId ? `https://archive.org/download/${iaId}/${iaId}.epub` : null,
		fileUrl: iaId ? `https://archive.org/download/${iaId}/${iaId}.pdf` : null,
		url: doc.key ? `https://openlibrary.org${doc.key}` : `https://openlibrary.org/search?q=${encodeURIComponent(tit + " " + aut)}`,
		descripcion: desc
	};
};

const MAPA_TEMA_LG = {
	"": "all",
	"__populares__": "all",
	"__recientes__": "all",
	"politica": "Category: Politics",
	"religion": "Category: Religion",
	"biblias": "Category: Bibles",
	"religión": "Category: Religion",
	"música": "Category: Music",
	"musica": "Category: Music",
	"ficción": "Category: Novels",
	"romance": "Category: Romance",
	"ciencia": "Category: Science",
	"historia": "Category: History",
	"filosofía": "Category: Philosophy",
	"poesía": "Category: Poetry",
	"misterio": "Category: Crime, Thrillers and Mystery",
	"fantasía": "Category: Fantasy",
	"biografía": "Category: Biography",
	"clásicos": "Category: Classics of Literature",
	"infantil": "Category: Juvenile",
	"aventura": "Category: Adventure",
	"arte": "Category: Art",
	"cómics": "Category: Comic and Graphic Books"
};
const carrilRefCallback = (el) => {
	if (el && !el._wheelAttached) {
		el._wheelAttached = true;
		el.addEventListener("wheel", (e) => {
			if (e.shiftKey && Math.abs(e.deltaY) > 0) {
				el.scrollLeft += e.deltaY;
				try { e.preventDefault(); } catch {}
			}
		}, { passive: false });
	}
};
const onWheelHorizontal = (e) => {
	if (e.shiftKey && Math.abs(e.deltaY) > 0) {
		e.currentTarget.scrollLeft += e.deltaY;
		try { e.preventDefault(); } catch {}
	}
};
const nombreBonitoCat = (c) => {
	const item = LISTA_CATS_UNIFICADAS.find((x) => x.id === c);
	if (item) return item.label;
	if (c === "politica") return "Política";
	if (c === "religion" || c === "religión") return "Religión";
	if (c === "biblias" || c === "biblia") return "Biblias";
	if (c === "romance") return "Romance";
	if (c === "música" || c === "musica") return "Música";
	if (c === "manga" || c === "manhwa" || c === "manhua") return "Manga & Manhwa";
	return c ? c.charAt(0).toUpperCase() + c.slice(1) : "Categoría";
};
function TarjetaSkeleton({ index = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cg-tarjeta-wrap cg-skeleton-wrap",
		style: { display: "flex", flexDirection: "column" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-tarjeta cg-tarjeta-skeleton",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-portada cg-shimmer-placeholder",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-luz" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-silueta", children: "📖" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-tarjeta-info",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-skeleton-bar cg-skeleton-tit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-luz" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-skeleton-bar cg-skeleton-aut",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-luz" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-skeleton-bar cg-skeleton-meta",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cg-shimmer-luz" })
							})
						]
					})
				]
			})
		]
	}, `skel-${index}`);
}
const Tarjeta = (0, import_react.memo)(function Tarjeta({ libro, reportes, onAbrir, onLeer, onEditar, onQr, onEliminar, ranking = null, descargas = null }) {
	const disp = disponibilidad(libro);
	const rep = contarReportes(reportes, libro.id);
	const r = ratingDe(libro);
	const tit = aTextoPlano(libro?.titulo || libro?.title) || "Libro";
	const aut = aTextoPlano(libro?.autor || (Array.isArray(libro?.authors) ? libro.authors[0] : libro?.authors)) || "Autor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cg-tarjeta-wrap",
		style: { display: "flex", flexDirection: "column" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "cg-tarjeta",
				onClick: onAbrir,
				children: [
					ranking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cg-rank-badge " + (ranking === 1 ? "rank-1" : ranking === 2 ? "rank-2" : ranking === 3 ? "rank-3" : "rank-otro"),
						children: ranking === 1 ? "🥇 #1" : ranking === 2 ? "🥈 #2" : ranking === 3 ? "🥉 #3" : `#${ranking}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
						libro,
						titulo: tit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-tarjeta-info",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tit }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: aut }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "cg-tarjeta-meta",
								children: [
									descargas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "cg-top-dl-pill",
										children: ["📥 ", descargas]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "lg-sigla-desc",
										children: (libro.fuente ? String(libro.fuente).slice(0, 3).toUpperCase() : "LUM") + " · "
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estrellas, { valor: r.estrellas, total: r.reseñas }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badges, {
										libro,
										reportes,
										rep,
										disp
									})
								]
							})
						]
					})
				]
			}),
			libro.esMio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-card-actions",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini prim",
						title: "Leer ahora",
						onClick: () => onLeer?.(libro),
						children: "▶ Leer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini",
						title: "Editar publicación",
						onClick: () => onEditar?.(libro),
						children: "✏️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini",
						title: "Código QR",
						onClick: () => onQr?.(libro),
						children: "▦"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini danger",
						title: "Eliminar permanentemente",
						onClick: () => onEliminar?.(libro),
						children: "🗑️"
					})
				]
			}) : (onLeer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cg-card-actions",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini prim",
						title: "Leer ahora",
						onClick: () => onLeer?.(libro),
						children: "▶ Leer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "cg-btn-mini",
						title: "Ver ficha",
						onClick: onAbrir,
						children: "ℹ️"
					})
				]
			}) : null)
		]
	});
});
function Badges({ libro, reportes, rep, disp }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "cg-card-meta",
		children: [
			disp?.nivel && disp.nivel !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cg-badge",
				title: disp.etiqueta,
				children: disp.nivel === "alta" ? "🟢" : disp.nivel === "media" ? "🟡" : "⚪"
			}),
			libro.rating === "adulto" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cg-badge cg-badge-adulto",
				title: "Contenido para adultos",
				children: "🔞"
			}),
			rep >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cg-badge cg-rev",
				children: "⚠️"
			}),
			libro.moderacion?.includes("byok") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cg-badge",
				title: "Moderado con IA del autor",
				children: "🤖"
			}),
			libro._fuente === "feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cg-badge cg-feed",
				title: "Libro de un feed centralizado (GitHub/URL)",
				children: "🌐 Feed"
			})
		]
	});
}
function QrLibro({ libro }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		try {
			const idLibro = libro.d || libro.id;
			const origin = (typeof window !== "undefined" && window.location?.origin && !window.location.origin.includes("null")) ? window.location.origin : "https://lumenreader.app";
			const pathname = (typeof window !== "undefined" && window.location?.pathname) ? window.location.pathname.replace(/\/+$/, "") : "";
			const shareUrl = typeof window !== "undefined" && window.location?.href ? `${window.location.href.split("?")[0].split("#")[0]}?b=${encodeURIComponent(idLibro)}&t=${encodeURIComponent(libro.titulo || libro.title || "")}&a=${encodeURIComponent(libro.autor || "")}` : `https://lumenreader.app/?b=${encodeURIComponent(idLibro)}`;
			const data = shareUrl;
			const img = new Image();
			img.onload = () => {
				const ctx = ref.current.getContext("2d");
				ctx.clearRect(0, 0, 340, 340);
				ctx.drawImage(img, 10, 10, 320, 320);
			};
			img.src = qrDataUrl(data, 320);
		} catch (e) {
			console.warn("[qr]", e?.message || e);
		}
	}, [libro]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cg-qr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref,
			width: 340,
			height: 340
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			style: {
				color: "var(--fg-dim)",
				fontSize: 12,
				textAlign: "center"
			},
			children: [
				"Escanéalo con otra LumenReader: abre este libro directo.",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
					style: { color: "var(--accent)" },
					children: ["lumenreader://b/", libro.d]
				})
			]
		})]
	});
}
//#endregion
export { Catalogo as default };
