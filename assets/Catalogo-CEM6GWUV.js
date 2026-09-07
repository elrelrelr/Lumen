const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./nostr-zC6Qsl2z.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js","./index-DOrzQ79O.js","./react-1WJTggxS.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css","./streaming-CGdx3ecV.js"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
var __vitePreload = (fn, deps) => {
	try {
		if (deps) for (const d of deps) {
			if (d.includes("pdf-")) continue;
			const l = document.createElement("link");
			l.rel = "modulepreload";
			l.href = d;
			l.crossOrigin = "";
			document.head.appendChild(l);
		}
	} catch {}
	return fn();
};
import { _ as Sheet, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { buscarLibros, categoriasDe, contarReportes, eventoReporte, filtrarLibros, generarIdentidad, guardarIdentidad, identidadGuardada, npubCorto, publicarEnRelays, refrescarCatalogo, relaysGuardados } from "./nostr-zC6Qsl2z.js";
import { n as disponibilidad, t as descargarLumenPorGateway } from "./streaming-CGdx3ecV.js";
import { c as libroDePublicado, l as listarPublicados } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
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
function PortadaFallback({ titulo, alto }) {
	let h = 0;
	for (let i = 0; i < String(titulo).length; i++) h = (h * 31 + String(titulo).charCodeAt(i)) % 360;
	const ini = String(titulo).split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "L";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bc-portada bc-fallback",
		style: {
			background: `linear-gradient(150deg, hsl(${h} 60% 44%), hsl(${(h + 45) % 360} 56% 24%))`,
			height: alto
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ini })
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
/** Rating decorativo determinístico: mismo libro → mismas estrellas. */
function ratingDe(libro) {
	const s = String(libro.id || libro.d || "");
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1e3;
	const estrellas = 3.6 + h % 15 / 10;
	const reseñas = 4 + h % 2400;
	return {
		estrellas: Math.round(estrellas * 10) / 10,
		reseñas
	};
}
function Estrellas({ valor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "cg-stars",
		title: `${valor} de 5`,
		children: ["★".repeat(Math.round(valor)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
			style: { color: "var(--fg-mute)" },
			children: "★".repeat(5 - Math.round(valor))
		})]
	});
}
function Portada({ libro, titulo, grande = false }) {
	const [rota, setRota] = (0, import_react.useState)(false);
	const h = tono(titulo);
	const cls = "cg-portada" + (grande ? " cg-portada-lg" : "");
	if (libro.portada && !rota) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: libro.portada,
			alt: titulo,
			loading: "lazy",
			onError: () => setRota(true),
			draggable: false
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls + " cg-portada-fake",
		style: { background: `linear-gradient(150deg, hsl(${h} 60% 44%), hsl(${(h + 45) % 360} 56% 24%))` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "cg-ini",
			children: iniciales(titulo)
		})
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
	return String(s).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>|<\/div>|<\/li>|<li>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\n{2,}/g, "\n").trim();
}
function Catalogo({ onSalir, onPublicar, onAbrirLibro, onAbrirAds, onAbrirMisPublicaciones, toast }) {
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [libros, setLibros] = (0, import_react.useState)([]);
	const [reportes, setReportes] = (0, import_react.useState)([]);
	const [busqueda, setBusqueda] = (0, import_react.useState)("");
	const [categoria, setCategoria] = (0, import_react.useState)("");
	const [ocultarAdultos, setOcultarAdultos] = (0, import_react.useState)(true);
	const [filtrosAbiertos, setFiltrosAbiertos] = (0, import_react.useState)(false);
	const [estado, setEstado] = (0, import_react.useState)("cargando");
	const [detalle, setDetalle] = (0, import_react.useState)(null);
	const [reporteAbierto, setReporteAbierto] = (0, import_react.useState)(false);
	const [qrAbierto, setQrAbierto] = (0, import_react.useState)(false);
	const [publicandoReporte, setPublicandoReporte] = (0, import_react.useState)(false);
	const [relaysActivos, setRelaysActivos] = (0, import_react.useState)(0);
	const [relaysInfo, setRelaysInfo] = (0, import_react.useState)({});
	const [listaRelays, setListaRelays] = (0, import_react.useState)([]);
	const [panelRelays, setPanelRelays] = (0, import_react.useState)(false);
	const [misLibros, setMisLibros] = (0, import_react.useState)([]);
	const [descargando, setDescargando] = (0, import_react.useState)(false);
	const [feeds, setFeeds] = (0, import_react.useState)([]);
	const [librosFeed, setLibrosFeed] = (0, import_react.useState)([]);
	const [gestorFeeds, setGestorFeeds] = (0, import_react.useState)(false);
	const [feedUrl, setFeedUrl] = (0, import_react.useState)("");
	const detalleRef = (0, import_react.useRef)(null);
	detalleRef.current = detalle;
	usarPantallaAtras(() => onSalir?.(), () => {
		if (panelRelays) {
			setPanelRelays(false);
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
	const cargar = (0, import_react.useCallback)(async () => {
		setEstado("cargando");
		setRelaysActivos(0);
		try {
			const pref = await getMeta("catalogo_filtros", null);
			if (pref && typeof pref.ocultarAdultos === "boolean") setOcultarAdultos(pref.ocultarAdultos);
		} catch {}
		const id = await identidadGuardada();
		setIdentidad(id);
		try {
			const mios = await listarPublicados();
			setMisLibros(mios.map(libroDePublicado));
		} catch {}
		try {
			const fs = await cargarFeeds();
			setFeeds(fs);
			const libros = [];
			for (const f of fs) try {
				const r = await fetch(f.url, { signal: AbortSignal.timeout(12e3) });
				if (r.ok) libros.push(...parsearFeed(await r.json()));
			} catch {}
			setLibrosFeed(libros);
		} catch {}
		try {
			setListaRelays(await relaysGuardados());
		} catch {}
		let terminado = false;
		await refrescarCatalogo({ onEstado: (est, url) => {
			if (url) setRelaysInfo((prev) => prev[url] === "abierto" && est === "eose" ? prev : {
				...prev,
				[url]: est === "eose" ? prev[url] || "abierto" : est
			});
			if (est === "abierto") setRelaysActivos((n) => n + 1);
			else if (est === "eose" && !terminado) {
				terminado = true;
				setTimeout(() => setEstado("listo"), 250);
			}
		} });
		const [c, rep] = await Promise.all([__vitePreload(() => import("./nostr-zC6Qsl2z.js").then((m) => m.catalogoGuardado()), __vite__mapDeps([0,1,2]), import.meta.url), __vitePreload(() => import("./nostr-zC6Qsl2z.js").then((m) => m.reportesGuardados()), __vite__mapDeps([0,1,2]), import.meta.url)]);
		setLibros(c);
		setReportes(rep);
		if (!terminado) setTimeout(() => setEstado("listo"), 1500);
	}, []);
	(0, import_react.useEffect)(() => {
		cargar();
		return () => {
			__vitePreload(() => import("./nostr-zC6Qsl2z.js").then((m) => m.cierre()), __vite__mapDeps([0,1,2]), import.meta.url);
		};
	}, [cargar]);
	const reportar = async (libro, motivo) => {
		if (!identidad) {
			toast("Primero activa tu identidad (botón 👤 arriba)");
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
	const compartirLibro = async (libro) => {
		try {
			const enlace = "lumenreader://b/" + (libro.d || libro.id);
			const texto = `📕 ${libro.titulo}\n` + (libro.autor ? `✍️ ${libro.autor}\n` : "") + (libro.descripcion ? `${String(libro.descripcion).slice(0, 120)}...\n` : "") + `\nAbrir en Lumen Reader: ${enlace}` + (libro.magnet ? `\n\nMagnet: ${libro.magnet}` : "");
			if (window.AndroidShare?.shareText) {
				window.AndroidShare.shareText("Lumen Reader", texto);
				haptic.tap();
				return;
			}
			if (navigator.share) {
				await navigator.share({
					title: libro.titulo,
					text: texto
				});
				return;
			}
			const { copyText } = await __vitePreload(async () => {
				const { copyText } = await import("./index-DOrzQ79O.js").then((n) => n.o);
				return { copyText };
			}, __vite__mapDeps([3,2,4,1,5,6,7,8]), import.meta.url);
			await copyText(texto);
			toast?.("Enlace copiado");
		} catch {}
	};
	const delRelay = buscarLibros(filtrarLibros(libros, { categoria }), busqueda).filter((b) => !ocultarAdultos || b.rating !== "adulto");
	const miosFiltrados = buscarLibros(misLibros, busqueda).filter((b) => !categoria || b.categoria === categoria);
	const idsRelay = new Set(delRelay.map((b) => b.d));
	const feedsFiltrados = buscarLibros(librosFeed, busqueda).filter((b) => !categoria || b.categoria === categoria).filter((b) => !ocultarAdultos || b.rating !== "adulto");
	const visibles = [
		...miosFiltrados.filter((b) => !idsRelay.has(b.d) && !feedsFiltrados.some((f) => f.d === b.d)),
		...feedsFiltrados,
		...delRelay
	];
	const recientes = [...visibles].sort((a, b) => b.createdAt - a.createdAt);
	const destacado = recientes[0];
	const populares = [...visibles].map((b) => ({
		b,
		r: ratingDe(b)
	})).sort((x, y) => y.r.estrellas - x.r.estrellas).slice(0, 12).map((x) => x.b);
	const todos = recientes.filter((b) => b.id !== destacado?.id);
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cg-back",
								onClick: () => onSalir?.(),
								"aria-label": "Volver",
								children: "‹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["📚 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lumen Store" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Libros de toda la red · sin servidor central" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-acciones",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-identidad",
										onClick: () => {
											haptic.tap();
											onAbrirMisPublicaciones?.();
										},
										title: "Mis publicaciones: historial, estado, compartir",
										children: "📦"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-identidad",
										onClick: () => onAbrirAds?.(),
										title: "Lumen Ads: saldo, mercado y campañas",
										children: "💎"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-identidad",
										onClick: () => onPublicar?.({ modo: "ajustes" }),
										title: "Identidad, relays y tu IA",
										children: identidad ? "👤" : "🆔"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-publicar",
										onClick: () => {
											haptic.tap();
											onPublicar?.({ modo: "nuevo" });
										},
										children: "＋ Publicar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cg-identidad",
										onClick: () => {
											haptic.tap();
											setGestorFeeds(true);
										},
										title: "Feeds: añade libros desde una URL (GitHub, etc.)",
										children: "📡"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-buscar cg-buscar-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cg-buscar-ic",
								children: "🔎"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: busqueda,
								onChange: (e) => setBusqueda(e.target.value),
								placeholder: "Buscar libros por título, autor o tema…",
								autoComplete: "off"
							}),
							busqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cg-buscar-x",
								onClick: () => setBusqueda(""),
								children: "✕"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-filtros-bar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "cg-filtros-btn" + (filtrosAbiertos || !ocultarAdultos ? " on" : ""),
							onClick: () => setFiltrosAbiertos(!filtrosAbiertos),
							"aria-label": "Filtros del catálogo",
							children: ["⚙︎ Filtros ", !ocultarAdultos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "cg-filtros-dot",
								title: "Mostrando contenido adulto"
							})]
						})
					}),
					filtrosAbiertos && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-filtro cg-filtro-panel",
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
					!identidad && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-ident-banner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Activa tu identidad (gratis, 1 toque)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Es tu firma en la red: sirve para publicar, reportar y ganar con anuncios." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							onClick: async () => {
								const id = generarIdentidad();
								await guardarIdentidad(id);
								setIdentidad(id);
								toast("Identidad creada: " + npubCorto(id.npub));
							},
							children: "Activar"
						})]
					}),
					categorias.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-cats",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-cat" + (categoria === "" ? " on" : ""),
							onClick: () => setCategoria(""),
							children: "Todas"
						}), categorias.slice(0, 12).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-cat" + (categoria === c ? " on" : ""),
							onClick: () => setCategoria(categoria === c ? "" : c),
							children: c
						}, c))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cg-cuerpo",
						children: estado === "cargando" && libros.length === 0 && misLibros.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "center-msg",
							style: { padding: 60 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									color: "var(--fg-dim)",
									marginTop: 12
								},
								children: "Conectando con los relays…"
							})]
						}) : visibles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "center-msg",
							style: { padding: 60 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { fontSize: 44 },
									children: "📭"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										color: "var(--fg-dim)",
										maxWidth: 300,
										margin: "10px auto"
									},
									children: busqueda ? "Nada coincide con tu búsqueda." : "Todavía no hay libros publicados. ¡Sé el primero!"
								}),
								!busqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									onClick: () => onPublicar?.({ modo: "nuevo" }),
									children: "＋ Publicar mi primer libro"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							destacado && !busqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "cg-destacado",
								onClick: () => {
									haptic.tap();
									setDetalle(destacado);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
										libro: destacado,
										titulo: destacado.titulo,
										grande: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cg-destacado-info",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												className: "cg-etq",
												children: "🆕 Recién publicado"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: destacado.titulo }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: destacado.autor }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "cg-destacado-meta",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estrellas, { valor: ratingDe(destacado).estrellas }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badges, {
													libro: destacado,
													reportes
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "cg-destacado-go",
										children: "›"
									})
								]
							}),
							populares.length > 1 && !busqueda && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🔥 Populares" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-fila",
									children: populares.map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
										libro,
										reportes,
										onAbrir: () => {
											haptic.tap();
											setDetalle(libro);
										}
									}, libro.id))
								})]
							}),
							todos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🆕 Recién publicados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-fila",
									children: todos.slice(0, 14).map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
										libro,
										reportes,
										onAbrir: () => {
											haptic.tap();
											setDetalle(libro);
										}
									}, libro.id))
								})]
							}),
							(busqueda || categoria) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: busqueda ? `Resultados de «${busqueda}»` : categoria }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "cg-grid",
									children: visibles.map((libro) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
										libro,
										reportes,
										onAbrir: () => {
											haptic.tap();
											setDetalle(libro);
										}
									}, libro.id))
								})]
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-pie",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "cg-pie-relays",
							onClick: () => setPanelRelays(true),
							title: "Estado de los relays",
							children: [
								libros.length,
								" libros · 📡 ",
								relaysActivos,
								"/",
								listaRelays.length,
								" relays"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: cargar,
							children: "↻ Actualizar"
						})]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, {
							libro: detalle,
							grande: true,
							onAbrir: (b) => {
								haptic.tap();
								onAbrirLibro?.(b);
								setDetalle(null);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-detalle-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
								libro: detalle,
								titulo: detalle.titulo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-detalle-info",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: detalle.titulo }),
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
						detalle.descripcion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "cg-desc",
							children: textoLimpio(detalle.descripcion)
						}),
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn primary",
									disabled: disponibilidad(detalle).nivel === "none",
									onClick: () => {
										onAbrirLibro?.(detalle);
										setDetalle(null);
									},
									children: ["👁 ", detalle.esMio && detalle._local ? "Leer (está en tu teléfono)" : "Leer"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									disabled: !detalle.magnet && !detalle.cid && !detalle.download && !detalle.fileUrl || descargando,
									onClick: async () => {
										if (detalle.fileUrl) {
											const nombreLumen = ((detalle.titulo || "libro").replace(/[^\wáéíóúñÁÉÍÓÚÑ\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "libro") + ".lumen";
											try {
												const r = await fetch(detalle.fileUrl, { signal: AbortSignal.timeout(8e3) });
												const ct = r.headers.get("content-type") || "";
												if (r.ok && !ct.includes("text/html")) {
													const blob = await r.blob();
													if (blob.size > 5000) {
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
											} catch {}
											window.open(detalle.fileUrl, "_blank", "noopener");
											toast("Abriendo Lumen Storage: guarda el .lumen en esa página e impórtalo con el botón + de la biblioteca.");
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
												} else toast("No se pudo descargar: " + r.status);
											} catch (e) {
												toast("Error al descargar: " + (e?.message || e));
											} finally {
												setDescargando(false);
											}
											return;
										}
										if (detalle.magnet) {
											__vitePreload(() => import("./streaming-CGdx3ecV.js").then((n) => n.i).then((m) => {
												toast(m.descargarPorTorrent(detalle.magnet) ? "Descarga torrent iniciada: síguela en la Biblioteca torrent (menú → Torrents)" : "No se pudo iniciar el torrent en este dispositivo");
											}), __vite__mapDeps([9,2,1,5]), import.meta.url);
											return;
										}
										if (detalle.cid) {
											setDescargando(true);
											try {
												const r = await descargarLumenPorGateway(detalle);
												if (r?.blob) {
													const url = URL.createObjectURL(r.blob);
													const a = document.createElement("a");
													a.href = url;
													a.download = r.nombre || "libro.lumen";
													a.click();
													setTimeout(() => URL.revokeObjectURL(url), 4e3);
													toast("Descargado como " + (r.nombre || "libro.lumen") + ". Impórtalo con el botón + de la biblioteca.");
												} else toast("Los gateways IPFS no respondieron; inténtalo más tarde");
											} catch (e) {
												toast("Error al descargar: " + (e?.message || e));
											} finally {
												setDescargando(false);
											}
										}
									},
									children: descargando ? "⏳…" : detalle.fileUrl ? "↓ Descargar (Lumen Storage)" : detalle.magnet ? "↓ Descargar" : detalle.download ? "↓ Descargar" : detalle.cid ? "↓ Descargar (IPFS)" : "↓ Sin descarga"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	style: { display: "flex", gap: 8, flexWrap: "wrap" },
	children: [
		detalle.audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => window.open(detalle.audioUrl, "_blank", "noopener"), children: "🎧 Audio del autor" }),
		detalle.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn", onClick: () => window.open(detalle.videoUrl, "_blank", "noopener"), children: "🎬 Vídeo del autor" })
	]
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
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: qrAbierto,
				onClose: () => setQrAbierto(false),
				title: "QR del libro",
				children: detalle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrLibro, { libro: detalle })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				open: gestorFeeds,
				onClose: () => setGestorFeeds(false),
				title: "📡 Feeds de libros (centralizados)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "row-sub",
						style: {
							marginBottom: 10,
							lineHeight: 1.5
						},
						children: [
							"Un ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "feed" }),
							" es una URL (p. ej. en GitHub Pages) que publica libros en formato JSON. Lumen los añade al catálogo y los combina con los que llegan por relays y torrent. Perfecto para publicar tus libros sin depender solo de tu teléfono."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 8,
							marginBottom: 12
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "plain",
							style: {
								flex: 1,
								minWidth: 0
							},
							value: feedUrl,
							placeholder: "https://usuario.github.io/lumen/feed.json",
							onChange: (e) => setFeedUrl(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							disabled: !feedUrl.trim(),
							onClick: async () => {
								const r = await agregarFeed(feedUrl);
								setFeedUrl("");
								if (r.ok) {
									setFeeds(await cargarFeeds());
									toast?.("✓ Feed añadido: " + r.libros + " libro(s)");
									cargar();
								} else toast?.(r.error || "No se pudo añadir");
							},
							children: "Añadir"
						})]
					}),
					feeds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "empty",
						style: { padding: "24px 8px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-emoji",
							children: "📡"
						}), "Todavía no hay feeds. Sube tu feed.json a GitHub Pages y pégalo aquí."]
					}) : feeds.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "nube-url-item",
						style: { marginBottom: 8 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.nombre }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "nube-url",
								children: f.url
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								f.libros,
								" libro(s) · añadido ",
								new Date(f.agregado).toLocaleDateString("es-CO")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 8,
									marginTop: 8
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									style: { flex: 1 },
									onClick: async () => {
										await quitarFeed(f.url);
										setFeeds(await cargarFeeds());
										cargar();
										toast?.("Feed quitado");
									},
									children: "Quitar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									style: { flex: 1 },
									onClick: () => {
										cargar();
										toast?.("Feed actualizado");
									},
									children: "↻ Actualizar"
								})]
							})
						]
					}, f.url)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "row-sub",
						style: { marginTop: 10 },
						children: ["Formato esperado: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{ \"name\": \"...\", \"books\": [ { \"title\", \"author\", \"cover\", \"stream\", \"download\", \"magnet\", \"chapters\" } ] }" })]
					})
				]
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
			})
		]
	});
}
function Tarjeta({ libro, reportes, onAbrir }) {
	const disp = disponibilidad(libro);
	const rep = contarReportes(reportes, libro.id);
	const r = ratingDe(libro);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "cg-tarjeta",
		onClick: onAbrir,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
			libro,
			titulo: libro.titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cg-tarjeta-info",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: libro.titulo }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: libro.autor }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "cg-tarjeta-meta",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estrellas, { valor: r.estrellas }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badges, {
						libro,
						reportes,
						rep,
						disp
					})]
				})
			]
		})]
	});
}
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
			const data = JSON.stringify({
				v: 1,
				d: libro.d,
				t: libro.titulo,
				a: libro.npub,
				cid: libro.cid,
				m: libro.magnet
			});
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
