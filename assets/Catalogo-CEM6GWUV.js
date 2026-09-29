const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./nostr-zC6Qsl2z.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js","./index-DX181kQz.js","./react-1WJTggxS.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css","./streaming-CGdx3ecV.js"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
import { O as setMeta, h as getMeta, E as putPages, k as uid, w as putBook } from "./db-Ii3ipPL7.js";
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
function Portada({ libro, titulo, grande = false }) {
	const [rota, setRota] = (0, import_react.useState)(false);
	const h = tono(titulo);
	const cls = "cg-portada" + (grande ? " cg-portada-lg" : "");
	if (libro.portada && !rota) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: libro.portada,
			alt: titulo,
			loading: "lazy",
			onError: () => setRota(true),
			draggable: false
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "lg-sigla-badge sigla-lum",
			children: "LUM"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls + " cg-portada-fake",
		style: { background: `linear-gradient(150deg, hsl(${h} 60% 44%), hsl(${(h + 45) % 360} 56% 24%))` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "cg-ini",
			children: iniciales(titulo)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "lg-sigla-badge sigla-lum",
			children: "LUM"
		})]
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
	["annas", "Anna's Archive", "📕"]
];
const BIB_DEFECTO = { gutendex: true, openlibrary: true, archive: true, "wikisource-es": true, "wikisource-en": true, royalroad: true, wattpad: true, arxiv: true, annas: true };

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
	const libroId = libro?.d || libro?.id || "";
	const [resenas, setResenas] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("lumen_resenas_" + libroId) || "[]");
		} catch {
			return [];
		}
	});
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

	(0, import_react.useEffect)(() => {
		(async () => {
			let id = await identidadGuardada();
			if (!id) {
				id = generarIdentidad();
				await guardarIdentidad(id);
			}
			setMiIdentidad(id);
		})();
	}, []);

	(0, import_react.useEffect)(() => {
		if (!libroId) return;
		let vivo = true;
		(async () => {
			try {
				const relays = await relaysGuardados();
				for (const url of relays) {
					const subId = "chat-" + libroId.slice(0, 8) + "-" + Math.random().toString(36).slice(2, 6);
					conectarRelay(url, (ev, sId) => {
						if (!vivo || sId !== subId || !ev || ev.kind !== 1) return;
						const tagD = ev.tags?.find((t) => t[0] === "d")?.[1];
						const tagT = ev.tags?.find((t) => t[0] === "t")?.[1];
						if (tagT !== "lumen-resena" && tagD !== libroId) return;
						
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
		})();
		return () => {
			vivo = false;
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

							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-resena-pie",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								})
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

function Catalogo({ onSalir, onPublicar, onAbrirLibro, onAbrirLibroLocal, onAbrirAds, onAbrirMisPublicaciones, onBuscarWeb, toast }) {
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [libros, setLibros] = (0, import_react.useState)([]);
	const [reportes, setReportes] = (0, import_react.useState)([]);
	const [categoria, setCategoria] = (0, import_react.useState)("");
	const [ocultarAdultos, setOcultarAdultos] = (0, import_react.useState)(true);
	const [filtroIdioma, setFiltroIdioma] = (0, import_react.useState)("todos");
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
	// v218 (#3b): la barra de búsqueda va oculta por defecto (cabecera más baja); la lupa la muestra/oculta
	const [busqVisible, setBusqVisible] = (0, import_react.useState)(false);
	const busqInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => { if (busqVisible) setTimeout(() => busqInputRef.current?.focus?.(), 60); }, [busqVisible]);
	const [sugerencias, setSugerencias] = (0, import_react.useState)([]);
	const [sugVisible, setSugVisible] = (0, import_react.useState)(false);
	const [sugIdx, setSugIdx] = (0, import_react.useState)(-1);
	const sugTimerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (sugTimerRef.current) clearTimeout(sugTimerRef.current);
		const q = (lgQ || "").trim();
		if (lgUrlAbierto || q.length < 2) {
			setSugerencias([]);
			setSugVisible(false);
			setSugIdx(-1);
			return;
		}
		sugTimerRef.current = setTimeout(async () => {
			const qNorm = q.toLowerCase();
			const lista = [];
			const seen = new Set();
			const pool = [...(libros || []), ...(misLibros || []), ...(librosFeed || [])];
			for (const b of pool) {
				const tit = b.title || b.titulo || "";
				const aut = b.author || b.autor || (b.authors || [])[0] || "";
				if (tit && tit.toLowerCase().includes(qNorm) && !seen.has(tit.toLowerCase())) {
					seen.add(tit.toLowerCase());
					lista.push({ texto: tit, sub: aut ? `Libro · ${aut}` : "Lumen Store", origen: "Store", icono: "📖" });
				}
				if (lista.length >= 3) break;
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
	}, [lgQ, lgUrlAbierto, libros, misLibros, librosFeed]);
	const [lgUrlWeb, setLgUrlWeb] = (0, import_react.useState)("");
	const [lgUrlBusy, setLgUrlBusy] = (0, import_react.useState)(false);
	const [lgUrlPaso, setLgUrlPaso] = (0, import_react.useState)("");
	// v208: bibliotecas activables/desactivables (persistidas en catalogo_filtros)
	const [bibActivas, setBibActivas] = (0, import_react.useState)(null);
	const [catPool, setCatPool] = (0, import_react.useState)(null);
	const [semillaPool, setSemillaPool] = (0, import_react.useState)(null);
	const [paginas, setPaginas] = (0, import_react.useState)({});
	const obtenerPagina = (k) => paginas[k] || 1;
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
		let cat = "";
		let desc = "";

		try {
			const urlMatch = str.match(/https?:\/\/[^\s"'<>]+/i) || str.match(/lumen(?:reader)?:\/\/[^\s"'<>]+/i);
			const urlStr = urlMatch ? urlMatch[0] : str;
			const u = new URL(urlStr, "https://lumenreader.app");
			id = u.searchParams.get("libro") || u.searchParams.get("b");
			if (!id && u.pathname.startsWith("/b/")) id = decodeURIComponent(u.pathname.slice(3));
			if (!id && u.hash) {
				const hm = u.hash.match(/[?&]libro=([^&\s#]+)/i) || u.hash.match(/#libro=([^&\s#]+)/i) || u.hash.match(/[?&]b=([^&\s#]+)/i);
				if (hm) id = decodeURIComponent(hm[1]);
			}
			tit = u.searchParams.get("tit") || u.searchParams.get("t") || "";
			aut = u.searchParams.get("aut") || u.searchParams.get("a") || "";
			file = u.searchParams.get("file") || u.searchParams.get("f") || "";
			cov = u.searchParams.get("cov") || u.searchParams.get("c") || "";
			mag = u.searchParams.get("mag") || u.searchParams.get("m") || "";
			cat = u.searchParams.get("cat") || "";
			desc = u.searchParams.get("desc") || "";
		} catch {
			const mLib = str.match(/[?&]libro=([^&\s#]+)/i);
			if (mLib) id = decodeURIComponent(mLib[1]);
			const mProto = str.match(/lumen(?:reader)?:\/\/b\/([^&\s#?]+)/i);
			if (mProto) id = decodeURIComponent(mProto[1]);
			const mTit = str.match(/[?&]tit=([^&\s#]+)/i);
			if (mTit) tit = decodeURIComponent(mTit[1]);
			const mAut = str.match(/[?&]aut=([^&\s#]+)/i);
			if (mAut) aut = decodeURIComponent(mAut[1]);
			const mFile = str.match(/[?&]file=([^&\s#]+)/i);
			if (mFile) file = decodeURIComponent(mFile[1]);
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
				}
			} catch {}
		}

		if (!id && /^[a-z0-9_-]{10,80}$/i.test(str)) {
			id = str;
		}

		if (!id) return null;
		return { id, tit, aut, file, cov, mag, cat, desc };
	};

	const extraerIdLibro = (texto) => {
		const d = extraerDatosLibroEnlace(texto);
		return d?.id || null;
	};

	const resolverYMostrarLibro = async (targetId, meta = null) => {
		if (!targetId) return false;
		const target = typeof targetId === "object" ? (targetId.id || targetId.d) : String(targetId).trim();
		const metaDatos = typeof targetId === "object" ? targetId : meta;
		const pool = [...(libros || []), ...(misLibros || []), ...(librosFeed || [])];
		const enMemoria = pool.find(
			(b) => b.d === target || b.id === target || b.slug === target || (b.d && b.d.toLowerCase() === target.toLowerCase())
		);
		if (enMemoria) {
			setDetalle(enMemoria);
			toast?.("📖 Libro detectado: " + (enMemoria.titulo || enMemoria.title));
			haptic.tap();
			return true;
		}
		try {
			const cat = JSON.parse(localStorage.getItem("lumen_catalogo") || "[]");
			const pubs = JSON.parse(localStorage.getItem("lumen_publicados") || "[]");
			const enStorage = [...cat, ...pubs.map(libroDePublicado)].find(
				(b) => b.d === target || b.id === target || b.slug === target
			);
			if (enStorage) {
				setDetalle(enStorage);
				toast?.("📖 Libro detectado: " + (enStorage.titulo || enStorage.title));
				haptic.tap();
				return true;
			}
		} catch {}

		if (metaDatos && (metaDatos.tit || metaDatos.titulo || metaDatos.file || metaDatos.fileUrl)) {
			const libroShared = {
				id: target,
				d: target,
				titulo: metaDatos.tit || metaDatos.titulo || "Libro compartido",
				autor: metaDatos.aut || metaDatos.autor || "Autor Lumen",
				fileUrl: metaDatos.file || metaDatos.fileUrl || "",
				portada: metaDatos.cov || metaDatos.portada || "",
				magnet: metaDatos.mag || metaDatos.magnet || "",
				categoria: metaDatos.cat || metaDatos.categoria || "general",
				descripcion: metaDatos.desc || metaDatos.descripcion || "",
				createdAt: Date.now(),
				esCompartido: true
			};
			setLibros((prev) => [libroShared, ...prev.filter((b) => b.d !== target && b.id !== target)]);
			setDetalle(libroShared);
			toast?.("📖 Libro compartido detectado: " + libroShared.titulo);
			haptic.tap();
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
				setDetalle(encontrado);
				toast?.("📖 Libro encontrado en la red: " + encontrado.titulo);
				haptic.tap();
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
				const p = params.get("libro") || params.get("b");
				if (p) {
					resolverYMostrarLibro(p, {
						id: p,
						tit: params.get("tit") || params.get("t") || "",
						aut: params.get("aut") || params.get("a") || "",
						file: params.get("file") || params.get("f") || "",
						cov: params.get("cov") || params.get("c") || "",
						mag: params.get("mag") || params.get("m") || "",
						cat: params.get("cat") || "",
						desc: params.get("desc") || ""
					});
				} else if (window.location.hash) {
					const parsed = extraerDatosLibroEnlace(window.location.hash);
					if (parsed?.id) resolverYMostrarLibro(parsed.id, parsed);
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
	const compartirLibro = async (libro) => {
		try {
			const idLibro = libro.d || libro.id;
			const origin = (typeof window !== "undefined" && window.location?.origin && !window.location.origin.includes("null")) ? window.location.origin : "https://lumenreader.app";
			const pathname = (typeof window !== "undefined" && window.location?.pathname) ? window.location.pathname.replace(/\/+$/, "") : "";
			const titParam = encodeURIComponent(libro.titulo || libro.title || "");
			const autParam = encodeURIComponent(libro.autor || "");
			const fileParam = encodeURIComponent(libro.fileUrl || "");
			const covParam = encodeURIComponent(libro.portada || "");
			const magParam = encodeURIComponent(libro.magnet || "");
			const catParam = encodeURIComponent(libro.categoria || "");
			const enlaceWeb = `${origin}${pathname}/?libro=${encodeURIComponent(idLibro)}&tit=${titParam}&aut=${autParam}&file=${fileParam}&cov=${covParam}&mag=${magParam}&cat=${catParam}`;
			const enlaceApp = `lumenreader://b/${encodeURIComponent(idLibro)}?tit=${titParam}&aut=${autParam}&file=${fileParam}&cov=${covParam}`;
			const texto = `📕 ${libro.titulo || libro.title}\n${libro.autor ? `✍️ ${libro.autor}\n` : ""}\n🌐 Enlace en Lumen Store:\n${enlaceWeb}\n\n📱 Lumen Reader: ${enlaceApp}${libro.magnet ? `\n\n🧲 Magnet: ${libro.magnet}` : ""}`;
			if (window.AndroidShare?.shareText) {
				window.AndroidShare.shareText(libro.titulo || "Lumen Reader", texto);
				haptic.tap();
				return;
			}
			if (navigator.share) {
				try {
					await navigator.share({
						title: libro.titulo || libro.title,
						text: texto,
						url: enlaceWeb
					});
					return;
				} catch (err) {
					if (err.name === "AbortError") return;
				}
			}
			const { copyText } = await __vitePreload(async () => {
				const { copyText } = await import("./index-DX181kQz.js").then((n) => n.o);
				return { copyText };
			}, __vite__mapDeps([3,2,4,1,5,6,7,8]), import.meta.url);
			await copyText(enlaceWeb);
			toast?.("📋 Enlace universal copiado. ¡Pégalo en la búsqueda de Lumen Store en cualquier dispositivo!");
			haptic.tap();
		} catch (e) {
			toast?.("No se pudo compartir: " + (e?.message || e));
		}
	};
	const copiarLinkLumen = async (libro) => {
		try {
			const idLibro = libro.d || libro.id;
			const origin = (typeof window !== "undefined" && window.location?.origin && !window.location.origin.includes("null")) ? window.location.origin : "https://lumenreader.app";
			const pathname = (typeof window !== "undefined" && window.location?.pathname) ? window.location.pathname.replace(/\/+$/, "") : "";
			const titParam = encodeURIComponent(libro.titulo || libro.title || "");
			const autParam = encodeURIComponent(libro.autor || "");
			const fileParam = encodeURIComponent(libro.fileUrl || "");
			const covParam = encodeURIComponent(libro.portada || "");
			const magParam = encodeURIComponent(libro.magnet || "");
			const catParam = encodeURIComponent(libro.categoria || "");
			const descParam = encodeURIComponent(libro.descripcion || "");
			const enlaceWeb = `${origin}${pathname}/?libro=${encodeURIComponent(idLibro)}&tit=${titParam}&aut=${autParam}&file=${fileParam}&cov=${covParam}&mag=${magParam}&cat=${catParam}&desc=${descParam}`;

			let copiado = false;
			if (navigator?.clipboard?.writeText) {
				try {
					await navigator.clipboard.writeText(enlaceWeb);
					copiado = true;
				} catch {}
			}
			if (!copiado) {
				const { copyText } = await __vitePreload(async () => {
					const { copyText } = await import("./index-DX181kQz.js").then((n) => n.o);
					return { copyText };
				}, __vite__mapDeps([3,2,4,1,5,6,7,8]), import.meta.url);
				await copyText(enlaceWeb);
			}
			toast?.("📋 Link de Lumen copiado. ¡Pégalo en el buscador de Lumen Store para abrir el libro!");
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
	];
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
		const tit = (b.titulo || b.title || "").trim() || "Libro";
		const aut = (b.autor || (Array.isArray(b.authors) ? b.authors.map((a) => typeof a === "string" ? a : (a?.name || "")).filter(Boolean).join(", ") : b.authors) || "").trim() || "Autor";
		const dl = Number(b.downloads) || (b.rating ? Math.round((ratingDe(b).estrellas || 4.5) * 3200) : 1200);
		const cat = b.categoria || (b.bookshelves && b.bookshelves[0]) || catDef;
		const cov = b.portada || b.cover || "assets/icon-192.png";
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
			esMio: !!b.esMio,
			rating: b.rating
		};
	};

	const obtenerLibrosDeCategoria = (catId) => {
		const cNorm = (catId || "").toLowerCase();
		const seen = new Set();
		const resultado = [];

		// Curated pool for religion
		if (cNorm === "religion" || cNorm === "religión") {
			for (const b of LIBROS_RELIGION_CURADOS) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "religion");
				const k = (n.titulo + "|" + n.autor).toLowerCase();
				if (!seen.has(k)) {
					seen.add(k);
					resultado.push(n);
				}
			}
		}

		for (const b of visibles) {
			if (!matchesIdioma(b, filtroIdioma)) continue;
			const bCat = (b.categoria || "").toLowerCase();
			if (cNorm === "__populares__" || cNorm === "__recientes__" || bCat === cNorm || (cNorm === "politica" && (bCat === "politica" || bCat === "política" || /polit|gobiern|rebel|estado|guerra|republic/i.test(b.titulo))) || ((cNorm === "religion" || cNorm === "religión") && (bCat === "religion" || bCat === "religión" || /relig|espirit|dios|biblia|fe|santo|budis|teolog/i.test(b.titulo)))) {
				const n = normalizarLibroGenerico(b, catId);
				const k = (n.titulo + "|" + n.autor).toLowerCase();
				if (!seen.has(k)) {
					seen.add(k);
					resultado.push(n);
				}
			}
		}

		for (const b of LIBROS_TOP_DESCARGAS) {
			if (!matchesIdioma(b, filtroIdioma)) continue;
			const bCat = (b.categoria || "").toLowerCase();
			if (cNorm === "__populares__" || cNorm === "__recientes__" || bCat === cNorm || (cNorm === "politica" && (bCat === "politica" || /polit|gobiern|rebel|estado|guerra|republic|principe|contrato|manifiesto|riqueza|democracia/i.test(b.titulo))) || ((cNorm === "religion" || cNorm === "religión") && (bCat === "religion" || bCat === "religión" || /relig|espirit|dios|biblia|fe|santo|budis|teolog/i.test(b.titulo)))) {
				const n = normalizarLibroGenerico(b, catId);
				const k = (n.titulo + "|" + n.autor).toLowerCase();
				if (!seen.has(k)) {
					seen.add(k);
					resultado.push(n);
				}
			}
		}

		if (catPool) {
			const claveCat = MAPA_TEMA_LG[catId];
			if (claveCat && catPool[claveCat]) {
				for (const b of catPool[claveCat]) {
					if (!matchesIdioma(b, filtroIdioma)) continue;
					const n = normalizarLibroGenerico(b, catId);
					const k = (n.titulo + "|" + n.autor).toLowerCase();
					if (!seen.has(k)) {
						seen.add(k);
						resultado.push(n);
					}
				}
			} else if (cNorm === "__populares__" || cNorm === "__recientes__") {
				for (const bks of Object.values(catPool)) {
					if (Array.isArray(bks)) {
						for (const b of bks) {
							if (!matchesIdioma(b, filtroIdioma)) continue;
							const n = normalizarLibroGenerico(b, "general");
							const k = (n.titulo + "|" + n.autor).toLowerCase();
							if (!seen.has(k)) {
								seen.add(k);
								resultado.push(n);
							}
						}
					}
				}
			}
		}

		if (semillaPool && (cNorm === "__populares__" || cNorm === "__recientes__")) {
			for (const b of semillaPool) {
				if (!matchesIdioma(b, filtroIdioma)) continue;
				const n = normalizarLibroGenerico(b, "general");
				const k = (n.titulo + "|" + n.autor).toLowerCase();
				if (!seen.has(k)) {
					seen.add(k);
					resultado.push(n);
				}
			}
		}

		return resultado;
	};

	const listaPopulares = obtenerLibrosDeCategoria("__populares__").sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

	const listaRecientes = [
		...visibles.map((b) => normalizarLibroGenerico(b, "lumen")),
		...obtenerLibrosDeCategoria("__recientes__").filter((b) => !visibles.some((v) => (v.titulo || v.title) === b.titulo))
	];

	const pagActual = obtenerPagina(categoria || "__todas__");
	const librosPantallaPop = listaPopulares.slice(0, pagActual * 40);
	const librosPantallaRec = listaRecientes.slice(0, pagActual * 40);

	const poolCategoriaActual = categoria && categoria !== "__populares__" && categoria !== "__recientes__" && categoria !== "__mis_libros__"
		? obtenerLibrosDeCategoria(categoria)
		: [];
	const librosPantallaCat = poolCategoriaActual.slice(0, pagActual * 40);
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
													if (!lgUrlAbierto && (lgQ || "").trim().length >= 2 && sugerencias.length > 0) setSugVisible(true);
												},
												onBlur: () => {
													setTimeout(() => setSugVisible(false), 220);
												},
												onChange: (e) => {
													const val = e.target.value;
													if (lgUrlAbierto) setLgUrlWeb(val);
													else {
														const parsed = extraerDatosLibroEnlace(val);
														if (parsed?.id) {
															setLgQ("");
															setSugVisible(false);
															resolverYMostrarLibro(parsed.id, parsed);
															return;
														}
														setLgQ(val);
														if (/^https?:\/\//i.test(val.trim()) && !val.includes("libro=")) setLgUrlWeb(val.trim());
													}
												},
												onPaste: (e) => {
													if (!lgUrlAbierto) {
														const texto = e.clipboardData?.getData("text") || "";
														const parsed = extraerDatosLibroEnlace(texto);
														if (parsed?.id) {
															e.preventDefault();
															setLgQ("");
															setSugVisible(false);
															resolverYMostrarLibro(parsed.id, parsed);
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
															if (sugerencias[sugIdx].web) onBuscarWeb?.(lgQ.trim());
															else setLgQ(sugerencias[sugIdx].texto);
															setSugVisible(false);
															return;
														}
													}
													if (e.key === "Enter") {
														setSugVisible(false);
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
												children: sugerencias.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "cg-sug-item" + (idx === sugIdx ? " active" : ""),
													onMouseDown: (e) => {
														e.preventDefault();
														if (s.web) onBuscarWeb?.(lgQ.trim());
														else setLgQ(s.texto);
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
														s.origen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cg-sug-origen", children: s.origen })
													]
												}, idx))
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
							...LISTA_CATS_UNIFICADAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								role: "tab",
								"aria-selected": categoria === c.id,
								className: "chip" + (categoria === c.id ? " on" : ""),
								onClick: () => { haptic.tap(); setCategoria(categoria === c.id ? "" : c.id); },
								children: [c.icon, " ", c.label]
							}, c.id))
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "✨ Recién publicados" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "cg-seccion-sub", children: "Últimas obras publicadas por la comunidad en la red descentralizada y novedades de bibliotecas abiertas." })
								]
							}),
							/* Carril horizontal con scroll */
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-fila",
								onWheel: onWheelHorizontal,
								children: listaRecientes.slice(0, 14).map((libro) => (
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
							listaRecientes.length > librosPantallaRec.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-paginacion-wrap",
								style: { textAlign: "center", margin: "20px 0 30px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn primary",
									onClick: () => avanzarPagina("__recientes__"),
									children: ["✨ Siguientes 40 libros recientes (", Math.min(listaRecientes.length, librosPantallaRec.length + 40), " de ", listaRecientes.length, ")"]
								})
							})
						]
					}),

					/* Vista de categoría con Top 10 Popular Rail + Catálogo Completo (40 en 40) */
					categoria !== "" && categoria !== "__populares__" && categoria !== "__recientes__" && categoria !== "__mis_libros__" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-seccion cg-seccion-categoria" + (categoria === "politica" ? " cg-seccion-politica" : ""),
						children: [
							/* Encabezado de la categoría */
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion-head",
								style: { marginBottom: 16 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										style: { textTransform: "capitalize", margin: "0 0 6px" },
										children: ["📚 ", nombreBonitoCat(categoria), " (", librosPantallaCat.length, " de ", poolCategoriaActual.length, " libros)"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "cg-seccion-sub",
										children: "Organizado en 4 filas horizontales de 10 libros por lote. Desliza horizontalmente cada carril para explorar."
									})
								]
							}),

							/* Cuatro filas de 10 libros con scroll horizontal exclusivo */
							...Array.from({ length: Math.ceil(librosPantallaCat.length / 10) }, (_, filaIdx) => {
								const filaLibros = librosPantallaCat.slice(filaIdx * 10, (filaIdx + 1) * 10);
								const numFila = filaIdx + 1;
								return (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-seccion cg-seccion-fila-cat",
									style: { marginBottom: 18 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cg-seccion-head",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
													style: { margin: "0 0 4px", fontSize: "0.98rem", fontWeight: 700, color: "var(--fg)" },
													children: filaIdx === 0 ? ["🔥 Los 10 más populares en ", nombreBonitoCat(categoria), ` (${filaIdx * 10 + 1}–${filaIdx * 10 + filaLibros.length})`] : [`Fila ${numFila} • ${nombreBonitoCat(categoria)}`, ` (${filaIdx * 10 + 1}–${filaIdx * 10 + filaLibros.length})`]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "cg-seccion-sub",
													style: { margin: 0, fontSize: "0.8rem", color: "var(--fg-muted)" },
													children: filaIdx === 0 ? "Títulos más descargados y leídos de esta categoría con desplazamiento horizontal." : `Selección curada • ${filaLibros.length} títulos con desplazamiento horizontal`
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "cg-fila " + (filaIdx === 0 ? "cg-fila-top " : "") + "cg-scroll-x-only",
											ref: carrilRefCallback,
											onWheel: onWheelHorizontal,
											children: filaLibros.map((libro, idx) => (
												(0, import_jsx_runtime.jsx)(Tarjeta, {
													libro,
													ranking: filaIdx === 0 ? idx + 1 : null,
													descargas: libro.downloads ? formatearDescargas(libro.downloads) + " descargas" : null,
													reportes,
													onAbrir: () => { haptic.tap(); setDetalle(libro); },
													onLeer: () => { haptic.tap(); onAbrirLibro?.(libro); }
												}, libro.id || (filaIdx * 10 + idx))
											))
										})
									]
								}, `fila-cat-${categoria}-${filaIdx}`);
							}),

							/* Paginación de 40 en 40 libros */
							poolCategoriaActual.length > librosPantallaCat.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cg-paginacion-wrap",
								style: { textAlign: "center", margin: "24px 0 32px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn primary",
									onClick: () => avanzarPagina(categoria),
									children: ["📖 Siguientes 40 libros de ", nombreBonitoCat(categoria), " (", Math.min(poolCategoriaActual.length, librosPantallaCat.length + 40), " de ", poolCategoriaActual.length, ")"]
								})
							}),
							lgSeccion
						]
					}),

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
								const librosDiez = poolCat.slice(0, 10);
								return (0, import_jsx_runtime.jsxs)("div", {
									className: "cg-seccion",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "cg-seccion-head",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
													children: [catItem.icon, " ", catItem.label]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "btn mini",
													style: { fontSize: "11px", padding: "4px 10px", borderRadius: "8px", background: "var(--bg-soft)", color: "var(--fg)", border: "1px solid var(--line)" },
													onClick: () => { haptic.tap(); setCategoria(catItem.id); },
													children: "Ver todos ›"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "cg-fila cg-scroll-x-only",
											ref: carrilRefCallback,
											onWheel: onWheelHorizontal,
											children: librosDiez.map((b, idx) => (
												(0, import_jsx_runtime.jsx)(Tarjeta, {
													libro: b,
													descargas: b.downloads ? formatearDescargas(b.downloads) + " descargas" : null,
													reportes,
													onAbrir: () => { haptic.tap(); setDetalle(b); },
													onLeer: () => { haptic.tap(); onAbrirLibro?.(b); }
												}, b.id || idx)
											))
										})
									]
								}, `todas-cat-${catItem.id}`);
							}),
							lgSeccion
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
						(lgQ.trim() || (categoria && categoria !== "__mis_libros__")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cg-seccion",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: lgQ.trim() ? `Resultados de «${lgQ.trim()}»` : categoria }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
							}),
												]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-pie",
						children: [lgVentana && lgVentana.listo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-pag",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cg-pag-btn",
								disabled: lgVentana.desde === 0,
								onClick: () => lgVentana.api.current.irAnteriores(),
								title: "Anteriores 40",
								"aria-label": "Anteriores 40",
								children: "⏪"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "cg-pag-info",
								children: [lgVentana.desde + 1, "–", lgVentana.fin, " · ≈ ", lgVentana.total || "?"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cg-pag-btn" + (lgVentana.navegando ? " busy" : ""),
								/* v208: en carga el botón se anima pero NUNCA se oculta ni se troca por «…» */
								disabled: lgVentana.navegando || (!lgVentana.hayMas && lgVentana.fin >= lgVentana.nCat),
								onClick: () => lgVentana.api.current.irSiguientes(),
								title: "Siguientes 40",
								"aria-label": "Siguientes 40",
								children: "⏩"
							})]
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "bc-acciones",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bc-btn-leer",
											role: "button",
											tabIndex: 0,
											onClick: () => {
												haptic.tap();
												onAbrirLibro?.(detalle);
												setDetalle(null);
											},
											children: "Leer →"
										}),
										(detalle.descargas || detalle.downloads) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "bc-descargas",
											children: ["↓ ", detalle.descargas || detalle.downloads]
										}) : null
									]
								})
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatResenas, { libro: detalle, toast })
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
  "titulo": "Rebelión en la Granja",
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
  "portada": "https://covers.openlibrary.org/b/id/8231940-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8231850-M.jpg",
  "categoria": "ficción",
  "epub": "https://www.gutenberg.org/ebooks/1342.epub3.images"
 },
 {
  "id": "top-5",
  "d": "top-manifiesto",
  "titulo": "El Manifiesto Comunista",
  "autor": "Karl Marx y Friedrich Engels",
  "fuente": "gutenberg",
  "downloads": 22100,
  "portada": "https://covers.openlibrary.org/b/id/8235114-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8231990-M.jpg",
  "categoria": "misterio",
  "epub": "https://www.gutenberg.org/ebooks/244.epub3.images"
 },
 {
  "id": "top-7",
  "d": "top-republica",
  "titulo": "La República",
  "autor": "Platón",
  "fuente": "gutenberg",
  "downloads": 19800,
  "portada": "https://covers.openlibrary.org/b/id/8431950-M.jpg",
  "categoria": "filosofía",
  "epub": "https://www.gutenberg.org/ebooks/1497.epub3.images"
 },
 {
  "id": "top-8",
  "d": "top-alicia",
  "titulo": "Alicia en el País de las Maravillas",
  "autor": "Lewis Carroll",
  "fuente": "gutenberg",
  "downloads": 19500,
  "portada": "https://covers.openlibrary.org/b/id/8231960-M.jpg",
  "categoria": "infantil",
  "epub": "https://www.gutenberg.org/ebooks/11.epub3.images"
 },
 {
  "id": "top-9",
  "d": "top-principe",
  "titulo": "El Príncipe",
  "autor": "Nicolás Maquiavelo",
  "fuente": "gutenberg",
  "downloads": 18500,
  "portada": "https://covers.openlibrary.org/b/id/10512450-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8231970-M.jpg",
  "categoria": "ficción",
  "epub": "https://www.gutenberg.org/ebooks/5200.epub3.images"
 },
 {
  "id": "top-11",
  "d": "top-riqueza",
  "titulo": "La Riqueza de las Naciones",
  "autor": "Adam Smith",
  "fuente": "gutenberg",
  "downloads": 16400,
  "portada": "https://covers.openlibrary.org/b/id/7268840-M.jpg",
  "categoria": "economía",
  "epub": "https://www.gutenberg.org/ebooks/3300.epub3.images"
 },
 {
  "id": "top-12",
  "d": "top-desobediencia",
  "titulo": "Desobediencia Civil",
  "autor": "Henry David Thoreau",
  "fuente": "gutenberg",
  "downloads": 15800,
  "portada": "https://covers.openlibrary.org/b/id/8271920-M.jpg",
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
  "categoria": "clásicos",
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
  "categoria": "ciencia-ficción",
  "epub": "https://www.gutenberg.org/ebooks/56834.epub3.images"
 },
 {
  "id": "top-15",
  "d": "top-contrato",
  "titulo": "El Contrato Social",
  "autor": "Jean-Jacques Rousseau",
  "fuente": "gutenberg",
  "downloads": 14200,
  "portada": "https://covers.openlibrary.org/b/id/8314120-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8231980-M.jpg",
  "categoria": "aventura",
  "epub": "https://www.gutenberg.org/ebooks/1257.epub3.images"
 },
 {
  "id": "top-17",
  "d": "top-dracula",
  "titulo": "Drácula",
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
  "portada": "https://covers.openlibrary.org/b/id/8231900-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8271930-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8271940-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/7370.epub3.images"
 },
 {
  "id": "top-21",
  "d": "top-utopia",
  "titulo": "Utopía",
  "autor": "Tomás Moro",
  "fuente": "gutenberg",
  "downloads": 12100,
  "portada": "https://covers.openlibrary.org/b/id/8271950-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/2130.epub3.images"
 },
 {
  "id": "top-22",
  "d": "top-democracia",
  "titulo": "La Democracia en América",
  "autor": "Alexis de Tocqueville",
  "fuente": "gutenberg",
  "downloads": 11800,
  "portada": "https://covers.openlibrary.org/b/id/8271960-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/815.epub3.images"
 },
 {
  "id": "top-23",
  "d": "top-leviatan",
  "titulo": "Leviatán",
  "autor": "Thomas Hobbes",
  "fuente": "gutenberg",
  "downloads": 11500,
  "portada": "https://covers.openlibrary.org/b/id/8271970-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/3207.epub3.images"
 },
 {
  "id": "top-24",
  "d": "top-aristoteles-politica",
  "titulo": "Política",
  "autor": "Aristóteles",
  "fuente": "gutenberg",
  "downloads": 11200,
  "portada": "https://covers.openlibrary.org/b/id/8271980-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/6762.epub3.images"
 },
 {
  "id": "top-25",
  "d": "top-sentido-comun",
  "titulo": "Sentido Común",
  "autor": "Thomas Paine",
  "fuente": "gutenberg",
  "downloads": 10900,
  "portada": "https://covers.openlibrary.org/b/id/8271990-M.jpg",
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
  "portada": "https://covers.openlibrary.org/b/id/8272000-M.jpg",
  "categoria": "politica",
  "epub": "https://www.gutenberg.org/ebooks/18.epub3.images"
 },
 {
  "id": "top-27",
  "d": "top-cumbres",
  "titulo": "Cumbres Borrascosas",
  "autor": "Emily Brontë",
  "fuente": "gutenberg",
  "downloads": 9800,
  "portada": "https://www.gutenberg.org/cache/epub/49836/pg49836.cover.medium.jpg",
  "categoria": "romance",
  "epub": "https://www.gutenberg.org/ebooks/49836.epub3.images"
 },
 {
  "id": "top-28",
  "d": "top-iliada",
  "titulo": "La Ilíada",
  "autor": "Homero",
  "fuente": "gutenberg",
  "downloads": 8750,
  "portada": "https://covers.openlibrary.org/b/id/8232010-M.jpg",
  "categoria": "clásicos",
  "epub": "https://www.gutenberg.org/ebooks/6130.epub3.images"
 },
 {
  "id": "top-29",
  "d": "top-odisea",
  "titulo": "La Odisea",
  "autor": "Homero",
  "fuente": "gutenberg",
  "downloads": 8600,
  "portada": "https://covers.openlibrary.org/b/id/8232020-M.jpg",
  "categoria": "clásicos",
  "epub": "https://www.gutenberg.org/ebooks/1727.epub3.images"
 },
 {
  "id": "top-30",
  "d": "top-fortunata",
  "titulo": "Fortunata y Jacinta",
  "autor": "Benito Pérez Galdós",
  "fuente": "gutenberg",
  "downloads": 7400,
  "portada": "https://www.gutenberg.org/cache/epub/17955/pg17955.cover.medium.jpg",
  "categoria": "ficción",
  "epub": "https://www.gutenberg.org/ebooks/17955.epub3.images"
 },
 {
  "id": "top-31",
  "d": "top-perfecta",
  "titulo": "Doña Perfecta",
  "autor": "Benito Pérez Galdós",
  "fuente": "gutenberg",
  "downloads": 6500,
  "portada": "https://www.gutenberg.org/cache/epub/17358/pg17358.cover.medium.jpg",
  "categoria": "ficción",
  "epub": "https://www.gutenberg.org/ebooks/17358.epub3.images"
 },
 {
  "id": "top-32",
  "d": "top-pazos",
  "titulo": "Los Pazos de Ulloa",
  "autor": "Emilia Pardo Bazán",
  "fuente": "gutenberg",
  "downloads": 5900,
  "portada": "https://www.gutenberg.org/cache/epub/15353/pg15353.cover.medium.jpg",
  "categoria": "ficción",
  "epub": "https://www.gutenberg.org/ebooks/15353.epub3.images"
 },
 {
  "id": "top-33",
  "d": "top-soledad",
  "titulo": "Cien Años de Soledad",
  "autor": "Gabriel García Márquez",
  "fuente": "lumen",
  "downloads": 28500,
  "portada": "https://covers.openlibrary.org/b/id/8232030-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-34",
  "d": "top-colera",
  "titulo": "El Amor en los Tiempos del Cólera",
  "autor": "Gabriel García Márquez",
  "fuente": "lumen",
  "downloads": 22400,
  "portada": "https://covers.openlibrary.org/b/id/8232040-M.jpg",
  "categoria": "romance"
 },
 {
  "id": "top-35",
  "d": "top-rayuela",
  "titulo": "Rayuela",
  "autor": "Julio Cortázar",
  "fuente": "lumen",
  "downloads": 18700,
  "portada": "https://covers.openlibrary.org/b/id/8232050-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-36",
  "d": "top-ficciones",
  "titulo": "Ficciones",
  "autor": "Jorge Luis Borges",
  "fuente": "lumen",
  "downloads": 24100,
  "portada": "https://covers.openlibrary.org/b/id/8232060-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-37",
  "d": "top-aleph",
  "titulo": "El Aleph",
  "autor": "Jorge Luis Borges",
  "fuente": "lumen",
  "downloads": 21900,
  "portada": "https://covers.openlibrary.org/b/id/8232070-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-38",
  "d": "top-paramo",
  "titulo": "Pedro Páramo",
  "autor": "Juan Rulfo",
  "fuente": "lumen",
  "downloads": 19200,
  "portada": "https://covers.openlibrary.org/b/id/8232080-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-39",
  "d": "top-perros",
  "titulo": "La Ciudad y los Perros",
  "autor": "Mario Vargas Llosa",
  "fuente": "lumen",
  "downloads": 17800,
  "portada": "https://covers.openlibrary.org/b/id/8232090-M.jpg",
  "categoria": "ficción"
 },
 {
  "id": "top-40",
  "d": "top-cronica",
  "titulo": "Crónica de una Muerte Anunciada",
  "autor": "Gabriel García Márquez",
  "fuente": "lumen",
  "downloads": 16500,
  "portada": "https://covers.openlibrary.org/b/id/8232100-M.jpg",
  "categoria": "misterio"
 }
];
const formatearDescargas = (num) => {
	if (!num) return "1.2k";
	if (num >= 1000) return (num / 1000).toFixed(1) + "k";
	return String(num);
};

const LIBROS_RELIGION_CURADOS = [{"id": "rel-1", "d": "rel-biblia", "titulo": "La Sagrada Biblia", "autor": "Varios Autores", "fuente": "gutenberg", "downloads": 48500, "portada": "https://covers.openlibrary.org/b/id/8231991-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "descripcion": "Texto fundacional de la tradición judeocristiana, compuesto por el Antiguo y Nuevo Testamento."}, {"id": "rel-2", "d": "rel-coran", "titulo": "El Sagrado Corán", "autor": "Profeta Mahoma (Trad. Julio Cortés)", "fuente": "archive", "downloads": 39200, "portada": "https://covers.openlibrary.org/b/id/8315120-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800200.us.archive.org/coran.pdf", "descripcion": "El libro sagrado del Islam, revelación divina y código de vida espiritual y moral."}, {"id": "rel-3", "d": "rel-bhagavad-gita", "titulo": "Bhagavad Gita: El Canto del Señor", "autor": "Vyasa", "fuente": "gutenberg", "downloads": 36100, "portada": "https://covers.openlibrary.org/b/id/8234850-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2388.epub3.images", "descripcion": "Diálogo fundamental entre el príncipe Arjuna y Krishna sobre el deber, la devoción y el alma."}, {"id": "rel-4", "d": "rel-tao-te-ching", "titulo": "Tao Te Ching: El Libro del Camino y la Virtud", "autor": "Lao Tse", "fuente": "gutenberg", "downloads": 34800, "portada": "https://covers.openlibrary.org/b/id/8233910-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/216.epub3.images", "descripcion": "Obra esencial del taoísmo sobre la armonía con el universo y el principio del no-hacer (wu wei)."}, {"id": "rel-5", "d": "rel-dhammapada", "titulo": "Dhammapada: La Senda de la Verdad", "autor": "Buda Gautama", "fuente": "gutenberg", "downloads": 31200, "portada": "https://covers.openlibrary.org/b/id/8235420-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2017.epub3.images", "descripcion": "Colección de aforismos del Buda sobre el sendero de la iluminación y la paz mental."}, {"id": "rel-6", "d": "rel-confesiones-agustin", "titulo": "Las Confesiones", "autor": "San Agustín", "fuente": "gutenberg", "downloads": 28900, "portada": "https://covers.openlibrary.org/b/id/8236100-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3296.epub3.images", "descripcion": "Autobiografía espiritual y meditación sobre la gracia, el pecado y la conversión a Dios."}, {"id": "rel-7", "d": "rel-ciudad-dios", "titulo": "La Ciudad de Dios", "autor": "San Agustín", "fuente": "gutenberg", "downloads": 24500, "portada": "https://covers.openlibrary.org/b/id/8237190-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/45304.epub3.images", "descripcion": "Monumental tratado teológico sobre el destino de la humanidad y la historia de salvación."}, {"id": "rel-8", "d": "rel-suma-teologica", "titulo": "Suma Teológica (Selección)", "autor": "Santo Tomás de Aquino", "fuente": "gutenberg", "downloads": 23800, "portada": "https://covers.openlibrary.org/b/id/8238120-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/17611.epub3.images", "descripcion": "La cumbre de la teología escolástica que armoniza la fe cristiana con la filosofía de Aristóteles."}, {"id": "rel-9", "d": "rel-imitacion-cristo", "titulo": "Imitación de Cristo", "autor": "Tomás de Kempis", "fuente": "gutenberg", "downloads": 22400, "portada": "https://covers.openlibrary.org/b/id/8239010-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1653.epub3.images", "descripcion": "El manual devocional más leído del cristianismo después de los Evangelios."}, {"id": "rel-10", "d": "rel-libro-tibetano-muertos", "titulo": "El Libro Tibetano de los Muertos (Bardo Thodol)", "autor": "Padmasambhava", "fuente": "archive", "downloads": 21900, "portada": "https://covers.openlibrary.org/b/id/8240100-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800300.us.archive.org/bardo.pdf", "descripcion": "Guía espiritual budista para la conciencia a través del estado intermedio entre la muerte y el renacimiento."}, {"id": "rel-11", "d": "rel-upanishads", "titulo": "Los Upanishads: Esencia del Pensamiento Hindú", "autor": "Sabios Védicos", "fuente": "gutenberg", "downloads": 20500, "portada": "https://covers.openlibrary.org/b/id/8241200-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3283.epub3.images", "descripcion": "Tratados místicos y filosóficos sobre la naturaleza de Brahmán y la identidad del Ser (Atman)."}, {"id": "rel-12", "d": "rel-sutra-diamante", "titulo": "El Sutra del Diamante", "autor": "Tradición Mahāyāna", "fuente": "wikisource", "downloads": 19800, "portada": "https://covers.openlibrary.org/b/id/8242300-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Enseñanzas de prajñāpāramitā sobre la vacuidad de todos los fenómenos y el desapego del ego."}, {"id": "rel-13", "d": "rel-moradas-teresa", "titulo": "Las Moradas del Castillo Interior", "autor": "Santa Teresa de Jesús", "fuente": "gutenberg", "downloads": 19400, "portada": "https://covers.openlibrary.org/b/id/8243400-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24578.epub3.images", "descripcion": "Guía sublime de oración contemplativa y ascenso místico del alma hasta la unión con Dios."}, {"id": "rel-14", "d": "rel-noche-oscura", "titulo": "Noche Oscura del Alma", "autor": "San Juan de la Cruz", "fuente": "gutenberg", "downloads": 18900, "portada": "https://covers.openlibrary.org/b/id/8244500-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/25619.epub3.images", "descripcion": "Poesía lírica y teología de la purificación espiritual previa a la iluminación divina."}, {"id": "rel-15", "d": "rel-guia-perplejos", "titulo": "Guía de Perplejos", "autor": "Moisés Maimónides", "fuente": "gutenberg", "downloads": 18200, "portada": "https://covers.openlibrary.org/b/id/8245600-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/39904.epub3.images", "descripcion": "Magistral reconciliación judía entre la ley de Moisés, la razón aristotélica y la metafísica."}, {"id": "rel-16", "d": "rel-zohar", "titulo": "El Zohar: El Libro del Esplendor", "autor": "Shimon bar Yojai (Atrib.)", "fuente": "archive", "downloads": 17800, "portada": "https://covers.openlibrary.org/b/id/8246700-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800400.us.archive.org/zohar.pdf", "descripcion": "Texto cumbre de la Cábala mística sobre las dimensiones ocultas de la creación divina."}, {"id": "rel-17", "d": "rel-gilgamesh", "titulo": "El Poema de Gilgamesh", "autor": "Mitología Sumeria", "fuente": "gutenberg", "downloads": 17500, "portada": "https://covers.openlibrary.org/b/id/8247800-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/11000.epub3.images", "descripcion": "La epopeya religiosa y poética más antigua del mundo sobre la búsqueda de la inmortalidad."}, {"id": "rel-18", "d": "rel-muertos-egipcio", "titulo": "El Libro Egipcio de los Muertos", "autor": "Sacerdotes de Tebas", "fuente": "gutenberg", "downloads": 16900, "portada": "https://covers.openlibrary.org/b/id/8248900-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/13000.epub3.images", "descripcion": "Fórmulas mágicas e himnos funerarios para guiar el alma ante el tribunal del dios Osiris."}, {"id": "rel-19", "d": "rel-teogonia", "titulo": "Teogonía y Los Trabajos y los Días", "autor": "Hesíodo", "fuente": "gutenberg", "downloads": 16400, "portada": "https://covers.openlibrary.org/b/id/8249000-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/348.epub3.images", "descripcion": "Origen de los dioses del Olimpo y el orden sagrado del cosmos en la Grecia Arcaica."}, {"id": "rel-20", "d": "rel-cantar-cantares", "titulo": "El Cantar de los Cantares", "autor": "Rey Salomón", "fuente": "wikisource", "downloads": 16100, "portada": "https://covers.openlibrary.org/b/id/8250100-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Poema de amor místico y alegoría del matrimonio espiritual entre Dios y la humanidad."}, {"id": "rel-21", "d": "rel-libro-job", "titulo": "El Libro de Job", "autor": "Literatura Bíblica Sapiencial", "fuente": "wikisource", "downloads": 15800, "portada": "https://covers.openlibrary.org/b/id/8251200-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Dramática indagación sobre el problema del sufrimiento del inocente y el misterio divino."}, {"id": "rel-22", "d": "rel-tratado-teologico-spinoza", "titulo": "Tratado Teológico-Político", "autor": "Baruch Spinoza", "fuente": "gutenberg", "downloads": 15500, "portada": "https://covers.openlibrary.org/b/id/8252300-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2361.epub3.images", "descripcion": "Análisis pionero de la crítica bíblica, la libertad de pensamiento y el concepto de Dios en la naturaleza."}, {"id": "rel-23", "d": "rel-pensamientos-pascal", "titulo": "Pensamientos", "autor": "Blaise Pascal", "fuente": "gutenberg", "downloads": 15200, "portada": "https://covers.openlibrary.org/b/id/8253400-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/18269.epub3.images", "descripcion": "La célebre apuesta de Pascal y reflexiones profundas sobre la miseria humana y la grandeza de la fe."}, {"id": "rel-24", "d": "rel-variedades-experiencia", "titulo": "Las Variedades de la Experiencia Religiosa", "autor": "William James", "fuente": "gutenberg", "downloads": 14900, "portada": "https://covers.openlibrary.org/b/id/8254500-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/621.epub3.images", "descripcion": "Estudio psicológico y empírico clásico sobre la conversión, la oración y los estados místicos."}, {"id": "rel-25", "d": "rel-lo-sagrado-profano", "titulo": "Lo Sagrado y lo Profano", "autor": "Mircea Eliade", "fuente": "openlibrary", "downloads": 14600, "portada": "https://covers.openlibrary.org/b/id/8255600-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Estudio fundamental de historia de las religiones sobre la experiencia del espacio y tiempo sagrados."}, {"id": "rel-26", "d": "rel-mito-eterno-retorno", "titulo": "El Mito del Eterno Retorno", "autor": "Mircea Eliade", "fuente": "openlibrary", "downloads": 14200, "portada": "https://covers.openlibrary.org/b/id/8256700-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Arquetipos y repetición en las culturas religiosas tradicionales frente a la historia lineal."}, {"id": "rel-27", "d": "rel-religiones-mundo", "titulo": "Las Religiones del Mundo", "autor": "Huston Smith", "fuente": "openlibrary", "downloads": 13900, "portada": "https://covers.openlibrary.org/b/id/8257800-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Panorama claro y respetuoso del hinduismo, budismo, confucianismo, taoísmo, judaísmo, cristianismo e islam."}, {"id": "rel-28", "d": "rel-el-profeta", "titulo": "El Profeta", "autor": "Gibran Khalil Gibran", "fuente": "gutenberg", "downloads": 13600, "portada": "https://covers.openlibrary.org/b/id/8258900-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/58585.epub3.images", "descripcion": "Poesía en prosa sobre el amor, la libertad, el trabajo y la muerte a través del sabio Almustafá."}, {"id": "rel-29", "d": "rel-nube-no-saber", "titulo": "La Nube del No-Saber", "autor": "Místico Anónimo Inglés", "fuente": "gutenberg", "downloads": 13300, "portada": "https://covers.openlibrary.org/b/id/8259100-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/123.epub3.images", "descripcion": "Tratado medieval de teología apofática sobre la contemplación de Dios más allá del intelecto."}, {"id": "rel-30", "d": "rel-regla-san-benito", "titulo": "La Regla de San Benito", "autor": "San Benito de Nursia", "fuente": "gutenberg", "downloads": 13000, "portada": "https://covers.openlibrary.org/b/id/8260200-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/7000.epub3.images", "descripcion": "El código monástico que moldeó la civilización europea occidental bajo el lema Ora et Labora."}, {"id": "rel-31", "d": "rel-ejercicios-espirituales", "titulo": "Ejercicios Espirituales", "autor": "San Ignacio de Loyola", "fuente": "gutenberg", "downloads": 12700, "portada": "https://covers.openlibrary.org/b/id/8261300-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/24580.epub3.images", "descripcion": "Método de discernimiento espiritual, meditación y compromiso vital con el Evangelio."}, {"id": "rel-32", "d": "rel-vida-jesus-renan", "titulo": "Vida de Jesús", "autor": "Ernest Renan", "fuente": "gutenberg", "downloads": 12400, "portada": "https://covers.openlibrary.org/b/id/8262400-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4900.epub3.images", "descripcion": "Estudio histórico y literario del siglo XIX que revolucionó la comprensión humana de Jesús de Nazaret."}, {"id": "rel-33", "d": "rel-ortodoxia-chesterton", "titulo": "Ortodoxia", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 12100, "portada": "https://covers.openlibrary.org/b/id/8263500-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/130.epub3.images", "descripcion": "Brillante defensa del asombro infantil, el sentido común y la fe cristiana contra el escepticismo."}, {"id": "rel-34", "d": "rel-hombre-eterno", "titulo": "El Hombre Eterno", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 11800, "portada": "https://covers.openlibrary.org/b/id/8264600-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/247.epub3.images", "descripcion": "Visión de la historia humana como la preparación y cumplimiento del evento de Cristo."}, {"id": "rel-35", "d": "rel-cartas-diablo", "titulo": "Cartas del Diablo a su Sobrino", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 11500, "portada": "https://covers.openlibrary.org/b/id/8265700-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800500.us.archive.org/cartas.pdf", "descripcion": "Sátira teológica epistolar sobre las sutiles tentaciones morales de la vida cotidiana."}, {"id": "rel-36", "d": "rel-mero-cristianismo", "titulo": "Mero Cristianismo", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 11200, "portada": "https://covers.openlibrary.org/b/id/8266800-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800600.us.archive.org/mero.pdf", "descripcion": "Explicación lógica y accesible de los fundamentos compartidos por todas las iglesias cristianas."}, {"id": "rel-37", "d": "rel-cuatro-amores", "titulo": "Los Cuatro Amores", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 10900, "portada": "https://covers.openlibrary.org/b/id/8267900-M.jpg", "categoria": "religion", "idioma": "es", "fileUrl": "https://ia800700.us.archive.org/amores.pdf", "descripcion": "Exploración de los afectos humanos: el afecto, la amistad, el eros y la caridad divina (ágape)."}, {"id": "rel-38", "d": "rel-iching", "titulo": "I Ching: El Libro de las Mutaciones", "autor": "Tradición Clásica China", "fuente": "gutenberg", "downloads": 10600, "portada": "https://covers.openlibrary.org/b/id/8268000-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1500.epub3.images", "descripcion": "Oráculo y texto sapiencial milenario sobre las leyes del cambio en la naturaleza y el ser humano."}, {"id": "rel-39", "d": "rel-chuang-tzu", "titulo": "Libro de Chuang Tzu", "autor": "Zhuangzi", "fuente": "gutenberg", "downloads": 10300, "portada": "https://covers.openlibrary.org/b/id/8269100-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/525.epub3.images", "descripcion": "Parábolas poéticas y humorísticas sobre la libertad interior y la espontaneidad del Tao."}, {"id": "rel-40", "d": "rel-analectas", "titulo": "Las Analectas", "autor": "Confucio", "fuente": "gutenberg", "downloads": 10000, "portada": "https://covers.openlibrary.org/b/id/8270200-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/4094.epub3.images", "descripcion": "Principios de rectitud ética, piedad filial, benevolencia y rito para una sociedad armónica."}, {"id": "rel-41", "d": "rel-bodhisattva", "titulo": "El Camino del Bodhisattva (Bodhicaryavatara)", "autor": "Shantideva", "fuente": "archive", "downloads": 9800, "portada": "https://covers.openlibrary.org/b/id/8271300-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Tratado poético budista sobre la generación de bodhichitta y el cultivo de la compasión infinita."}, {"id": "rel-42", "d": "rel-palabras-maestro", "titulo": "Palabras de mi Maestro Perfecto", "autor": "Patrul Rinpoche", "fuente": "archive", "downloads": 9500, "portada": "https://covers.openlibrary.org/b/id/8272400-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Instrucciones fundamentales de las prácticas preliminares del budismo tibetano de la tradición Dzogchen."}, {"id": "rel-43", "d": "rel-etica-spinoza", "titulo": "Ética demostrada según el orden geométrico", "autor": "Baruch Spinoza", "fuente": "gutenberg", "downloads": 9300, "portada": "https://covers.openlibrary.org/b/id/8273500-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/3800.epub3.images", "descripcion": "La visión panteísta del universo donde Dios y la Naturaleza son una sola sustancia infinita."}, {"id": "rel-44", "d": "rel-religion-razon-kant", "titulo": "La Religión dentro de los Límites de la Mera Razón", "autor": "Immanuel Kant", "fuente": "gutenberg", "downloads": 9100, "portada": "https://covers.openlibrary.org/b/id/8274600-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/48000.epub3.images", "descripcion": "Examen filosófico del mal radical, la gracia divina y el deber moral como esencia de la fe."}, {"id": "rel-45", "d": "rel-temor-temblor", "titulo": "Temor y Temblor", "autor": "Søren Kierkegaard", "fuente": "gutenberg", "downloads": 8900, "portada": "https://covers.openlibrary.org/b/id/8275700-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/60333.epub3.images", "descripcion": "Meditación existencial sobre el sacrificio de Abraham y la paradoja del salto de la fe."}, {"id": "rel-46", "d": "rel-obras-amor", "titulo": "Las Obras del Amor", "autor": "Søren Kierkegaard", "fuente": "openlibrary", "downloads": 8700, "portada": "https://covers.openlibrary.org/b/id/8276800-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Discursos cristianos sobre el mandamiento de amar al prójimo y la naturaleza del amor desinteresado."}, {"id": "rel-47", "d": "rel-misterio-fe", "titulo": "El Misterio de la Fe", "autor": "Alexander Schmemann", "fuente": "archive", "downloads": 8500, "portada": "https://covers.openlibrary.org/b/id/8277900-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "La teología litúrgica y los sacramentos en la espiritualidad de la Iglesia Ortodoxa Oriental."}, {"id": "rel-48", "d": "rel-teologia-mistica-oriental", "titulo": "La Teología Mística de la Iglesia Oriental", "autor": "Vladimir Lossky", "fuente": "archive", "downloads": 8300, "portada": "https://covers.openlibrary.org/b/id/8278000-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Estudio clásico del hesicasmo, la apófasis y la deificación (theosis) del ser humano."}, {"id": "rel-49", "d": "rel-masnavi", "titulo": "Masnavi: El Poema Espiritual", "autor": "Jalal al-Din Rumi", "fuente": "gutenberg", "downloads": 8100, "portada": "https://covers.openlibrary.org/b/id/8279100-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/2526.epub3.images", "descripcion": "La obra maestra del misticismo sufí, considerada por muchos el Corán en lengua persa."}, {"id": "rel-50", "d": "rel-conferencia-pajaros", "titulo": "La Conferencia de los Pájaros", "autor": "Farid al-Din Attar", "fuente": "archive", "downloads": 7900, "portada": "https://covers.openlibrary.org/b/id/8280200-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Alegoría sufí de los treinta pájaros que cruzan siete valles en busca del rey divino Simurg."}, {"id": "rel-51", "d": "rel-cabala-simbolismo", "titulo": "La Cábala y su Simbolismo", "autor": "Gershom Scholem", "fuente": "openlibrary", "downloads": 7700, "portada": "https://covers.openlibrary.org/b/id/8281300-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "El estudio seminal sobre la mística judía, el lenguaje sagrado y el mito del Golem."}, {"id": "rel-52", "d": "rel-dios-busca-hombre", "titulo": "Dios en Busca del Hombre", "autor": "Abraham Joshua Heschel", "fuente": "openlibrary", "downloads": 7500, "portada": "https://covers.openlibrary.org/b/id/8282400-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Filosofía del judaísmo centrada en el asombro, la respuesta humana a la palabra divina y la acción ética."}, {"id": "rel-53", "d": "rel-los-profetas-heschel", "titulo": "Los Profetas: Voz y Conciencia", "autor": "Abraham Joshua Heschel", "fuente": "openlibrary", "downloads": 7300, "portada": "https://covers.openlibrary.org/b/id/8283500-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "El patetismo divino y la pasión de los profetas de Israel por la justicia social incondicional."}, {"id": "rel-54", "d": "rel-francisco-asis-chesterton", "titulo": "San Francisco de Asís", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 7100, "portada": "https://covers.openlibrary.org/b/id/8284600-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1887.epub3.images", "descripcion": "Biografía poética y espiritual del santo de la pobreza, el amor a la creación y la hermandad."}, {"id": "rel-55", "d": "rel-leyenda-dorada", "titulo": "La Leyenda Dorada", "autor": "Santiago de la Vorágine", "fuente": "gutenberg", "downloads": 6900, "portada": "https://covers.openlibrary.org/b/id/8285700-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/39000.epub3.images", "descripcion": "La célebre recopilación medieval de vidas de santos, milagros y fiestas del año litúrgico."}, {"id": "rel-56", "d": "rel-confesiones-alghazali", "titulo": "El Rescatador del Error (Confesiones)", "autor": "Abu Hamid Al-Ghazali", "fuente": "archive", "downloads": 6700, "portada": "https://covers.openlibrary.org/b/id/8286800-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Itinerario intelectual desde la duda radical hasta la certeza intuitiva del misticismo sufí."}, {"id": "rel-57", "d": "rel-mente-zen", "titulo": "Mente Zen, Mente de Principiante", "autor": "Shunryu Suzuki", "fuente": "openlibrary", "downloads": 6500, "portada": "https://covers.openlibrary.org/b/id/8287900-M.jpg", "categoria": "religion", "idioma": "es", "descripcion": "Charlas sencillas sobre la postura, la respiración y la práctica abierta de la meditación zazen."}, {"id": "rel-58", "d": "rel-eneadas-plotino", "titulo": "Las Enéadas", "autor": "Plotino", "fuente": "gutenberg", "downloads": 6300, "portada": "https://covers.openlibrary.org/b/id/8288000-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/42930.epub3.images", "descripcion": "El gran monumento del neoplatonismo sobre la emanación cósmica desde El Uno inefable."}, {"id": "rel-59", "d": "rel-fedon-platon", "titulo": "Fedón o Del Alma", "autor": "Platón", "fuente": "gutenberg", "downloads": 6100, "portada": "https://covers.openlibrary.org/b/id/8289100-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/1658.epub3.images", "descripcion": "Últimas conversaciones de Sócrates en prisión sobre la inmortalidad del alma y la vida tras la muerte."}, {"id": "rel-60", "d": "rel-meditaciones-seneca", "titulo": "Cartas a Lucilio sobre la Serenidad y la Providencia", "autor": "Séneca", "fuente": "gutenberg", "downloads": 5900, "portada": "https://covers.openlibrary.org/b/id/8290200-M.jpg", "categoria": "religion", "idioma": "es", "epub": "https://www.gutenberg.org/ebooks/16888.epub3.images", "descripcion": "Espiritualidad estoica romana sobre la virtud interior, la resignación noble y la razón divina."}, {"id": "rel-61", "d": "rel-king-james-bible", "titulo": "The Holy Bible (King James Version)", "autor": "Various Authors", "fuente": "gutenberg", "downloads": 32000, "portada": "https://covers.openlibrary.org/b/id/8291300-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/10.epub3.images", "descripcion": "The majestic English translation of the Old and New Testaments commissioned in 1604."}, {"id": "rel-62", "d": "rel-pilgrims-progress", "titulo": "The Pilgrim's Progress", "autor": "John Bunyan", "fuente": "gutenberg", "downloads": 24000, "portada": "https://covers.openlibrary.org/b/id/8292400-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/131.epub3.images", "descripcion": "Classic Christian allegory of Christian's arduous journey from the City of Destruction to the Celestial City."}, {"id": "rel-63", "d": "rel-song-celestial", "titulo": "The Song Celestial: Bhagavad-Gita", "autor": "Sir Edwin Arnold", "fuente": "gutenberg", "downloads": 18000, "portada": "https://covers.openlibrary.org/b/id/8293500-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/2388.epub3.images", "descripcion": "The celebrated English poetic rendering of the Bhagavad Gita that inspired Mahatma Gandhi."}, {"id": "rel-64", "d": "rel-prophet-en", "titulo": "The Prophet", "autor": "Kahlil Gibran", "fuente": "gutenberg", "downloads": 17500, "portada": "https://covers.openlibrary.org/b/id/8294600-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/58585.epub3.images", "descripcion": "Philosophic and spiritual essays in English prose on the universal human condition."}, {"id": "rel-65", "d": "rel-varieties-en", "titulo": "The Varieties of Religious Experience", "autor": "William James", "fuente": "gutenberg", "downloads": 15000, "portada": "https://covers.openlibrary.org/b/id/8295700-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/621.epub3.images", "descripcion": "Seminal psychological lectures delivered at Edinburgh exploring mysticism, faith, and healthy-mindedness."}, {"id": "rel-66", "d": "rel-mere-christianity-en", "titulo": "Mere Christianity", "autor": "C.S. Lewis", "fuente": "archive", "downloads": 14000, "portada": "https://covers.openlibrary.org/b/id/8296800-M.jpg", "categoria": "religion", "idioma": "en", "fileUrl": "https://ia800800.us.archive.org/mere_en.pdf", "descripcion": "Original BBC radio broadcasts articulating standard core Christian beliefs without sectarian bias."}, {"id": "rel-67", "d": "rel-orthodoxy-en", "titulo": "Orthodoxy", "autor": "G.K. Chesterton", "fuente": "gutenberg", "downloads": 13500, "portada": "https://covers.openlibrary.org/b/id/8297900-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/130.epub3.images", "descripcion": "Masterpiece of Christian defense examining fairy tales, logic, romance, and the balance of creeds."}, {"id": "rel-68", "d": "rel-cloud-unknowing-en", "titulo": "The Cloud of Unknowing", "autor": "Anonymous 14th Century Monk", "fuente": "gutenberg", "downloads": 12800, "portada": "https://covers.openlibrary.org/b/id/8298000-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/123.epub3.images", "descripcion": "Middle English apophatic spiritual guide teaching contemplative prayer through silent loving intent."}, {"id": "rel-69", "d": "rel-gospel-buddha", "titulo": "The Gospel of Buddha", "autor": "Paul Carus", "fuente": "gutenberg", "downloads": 12000, "portada": "https://covers.openlibrary.org/b/id/8299100-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/3589.epub3.images", "descripcion": "Comprehensive anthology compiled from Pali scriptures presenting the teachings of Gotama Buddha."}, {"id": "rel-70", "d": "rel-light-of-asia", "titulo": "The Light of Asia", "autor": "Sir Edwin Arnold", "fuente": "gutenberg", "downloads": 11500, "portada": "https://covers.openlibrary.org/b/id/8300200-M.jpg", "categoria": "religion", "idioma": "en", "epub": "https://www.gutenberg.org/ebooks/8404.epub3.images", "descripcion": "Narrative epic poem detailing the life, spiritual search, and awakening of Prince Gautama Siddhartha."}, {"id": "rel-71", "d": "rel-pensees-fr", "titulo": "Pensées de Pascal sur la Religion", "autor": "Blaise Pascal", "fuente": "gutenberg", "downloads": 11000, "portada": "https://covers.openlibrary.org/b/id/8301300-M.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/18269.epub3.images", "descripcion": "Apologie inachevée de la religion chrétienne, un sommet de la pensée et de la langue française."}, {"id": "rel-72", "d": "rel-vie-jesus-fr", "titulo": "Vie de Jésus (Original Français)", "autor": "Ernest Renan", "fuente": "gutenberg", "downloads": 10500, "portada": "https://covers.openlibrary.org/b/id/8302400-M.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/4900.epub3.images", "descripcion": "La biographie humaniste et poétique qui a transformé la lecture des textes évangéliques au XIXe siècle."}, {"id": "rel-73", "d": "rel-tolerance-voltaire", "titulo": "Traité sur la Tolérance", "autor": "Voltaire", "fuente": "gutenberg", "downloads": 10200, "portada": "https://covers.openlibrary.org/b/id/8303500-M.jpg", "categoria": "religion", "idioma": "fr", "epub": "https://www.gutenberg.org/ebooks/28498.epub3.images", "descripcion": "Plaidoyer vibrant pour la liberté de culte, la paix civile et contre le fanatisme religieux."}, {"id": "rel-74", "d": "rel-religion-kant-de", "titulo": "Die Religion innerhalb der Grenzen der bloßen Vernunft", "autor": "Immanuel Kant", "fuente": "gutenberg", "downloads": 9900, "portada": "https://covers.openlibrary.org/b/id/8304600-M.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/48000.epub3.images", "descripcion": "Kants religionsphilosophisches Hauptwerk über Vernunftglaube, Moral und die unsichtbare Kirche."}, {"id": "rel-75", "d": "rel-furcht-zittern-de", "titulo": "Furcht und Zittern", "autor": "Søren Kierkegaard", "fuente": "gutenberg", "downloads": 9600, "portada": "https://covers.openlibrary.org/b/id/8305700-M.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/60333.epub3.images", "descripcion": "Dialektische Lyrik über den Glaubensritter Abraham und die theologische Suspendierung des Ethischen."}, {"id": "rel-76", "d": "rel-siddhartha-de", "titulo": "Siddhartha: Eine indische Dichtung", "autor": "Hermann Hesse", "fuente": "gutenberg", "downloads": 16000, "portada": "https://covers.openlibrary.org/b/id/8306800-M.jpg", "categoria": "religion", "idioma": "de", "epub": "https://www.gutenberg.org/ebooks/2493.epub3.images", "descripcion": "Die legendäre Erzählung von der spirituellen Selbstfindung eines jungen Brahmanen im alten Indien."}, {"id": "rel-77", "d": "rel-divina-commedia-it", "titulo": "La Divina Commedia (Testo Originale)", "autor": "Dante Alighieri", "fuente": "gutenberg", "downloads": 27000, "portada": "https://covers.openlibrary.org/b/id/8307900-M.jpg", "categoria": "religion", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/1012.epub3.images", "descripcion": "Il supremo poema sacro della fede cristiana: viaggio tra Inferno, Purgatorio e la visione di Dio nel Paradiso."}, {"id": "rel-78", "d": "rel-fioretti-francesco-it", "titulo": "I Fioretti di San Francesco", "autor": "Ugolino da Montegiorgio", "fuente": "gutenberg", "downloads": 9400, "portada": "https://covers.openlibrary.org/b/id/8308000-M.jpg", "categoria": "religion", "idioma": "it", "epub": "https://www.gutenberg.org/ebooks/18999.epub3.images", "descripcion": "I racconti poetici e miracolosi della santa povertà e dell'amore francescano per tutte le creature."}, {"id": "rel-79", "d": "rel-biblia-sagrada-pt", "titulo": "A Bíblia Sagrada (Tradução de João Ferreira de Almeida)", "autor": "Vários Autores", "fuente": "gutenberg", "downloads": 15000, "portada": "https://covers.openlibrary.org/b/id/8309100-M.jpg", "categoria": "religion", "idioma": "pt", "epub": "https://www.gutenberg.org/ebooks/2300.epub3.images", "descripcion": "A tradução clássica em língua portuguesa das Sagradas Escrituras do Antigo e Novo Testamento."}, {"id": "rel-80", "d": "rel-evangelho-espiritismo-pt", "titulo": "O Evangelho Segundo o Espiritismo", "autor": "Allan Kardec", "fuente": "archive", "downloads": 12500, "portada": "https://covers.openlibrary.org/b/id/8310200-M.jpg", "categoria": "religion", "idioma": "pt", "fileUrl": "https://ia800900.us.archive.org/kardec.pdf", "descripcion": "Explicação dos preceitos morais do Cristo sob a ótica dos ensinamentos dos Espíritos."}];

const detectarIdiomaLibro = (b) => {
	if (!b) return "es";
	const raw = (b.idioma || b.language || b.lang || "").toLowerCase();
	if (raw) {
		for (const p of ["es", "en", "fr", "de", "it", "pt"]) {
			if (raw.startsWith(p)) return p;
		}
		if (raw === "spa" || raw === "spanish") return "es";
		if (raw === "eng" || raw === "english") return "en";
		if (raw === "fra" || raw === "fre" || raw === "french") return "fr";
		if (raw === "deu" || raw === "ger" || raw === "german") return "de";
		if (raw === "ita" || raw === "italian") return "it";
		if (raw === "por" || raw === "portuguese") return "pt";
	}
	const tit = (b.titulo || b.title || "").toLowerCase();
	if (/(^|\s)(le|les|du|des|misérables|prince|étranger|bovary|swann|candide)($|\s)/i.test(tit)) return "fr";
	if (/(^|\s)(der|die|das|ein|eine|verwandlung|faust|zarathustra|kritik|werther|steppenwolf)($|\s)/i.test(tit)) return "de";
	if (/(^|\s)(del|della|dei|degli|commedia|decameron|avventure)($|\s)/i.test(tit)) return "it";
	if (/(^|\s)(lusíadas|casmurro|memórias|mensagem|sertão)($|\s)/i.test(tit)) return "pt";
	if (/(^|\s)(the|and|of|in|to|pride|prejudice|gatsby|war|peace|frankenstein|dracula|alice|republic)($|\s)/i.test(tit)) return "en";
	return "es";
};

const matchesIdioma = (b, filtro) => {
	if (!filtro || filtro === "todos") return true;
	return detectarIdiomaLibro(b) === filtro;
};

const LISTA_CATS_UNIFICADAS = [
	{ id: "ficción", label: "Ficción", icon: "📖" },
	{ id: "no-ficción", label: "No-ficción", icon: "🧠" },
	{ id: "ciencia", label: "Ciencia", icon: "🔬" },
	{ id: "historia", label: "Historia", icon: "📜" },
	{ id: "filosofía", label: "Filosofía", icon: "💭" },
	{ id: "religion", label: "Religión", icon: "🕊️" },
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
const MAPA_TEMA_LG = {
	"": "all",
	"__populares__": "all",
	"__recientes__": "all",
	"politica": "Category: Politics",
	"religion": "Category: Religion",
	"religión": "Category: Religion",
	"ficción": "Category: Novels",
	"no-ficción": "Category: History",
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
			const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			if (delta !== 0) {
				el.scrollLeft += delta;
				try { e.preventDefault(); } catch {}
				try { e.stopPropagation(); } catch {}
			}
		}, { passive: false });
	}
};
const onWheelHorizontal = (e) => {
	const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
	if (delta !== 0) {
		e.currentTarget.scrollLeft += delta;
		try { e.preventDefault(); } catch {}
		try { e.stopPropagation(); } catch {}
	}
};
const nombreBonitoCat = (c) => {
	const item = LISTA_CATS_UNIFICADAS.find((x) => x.id === c);
	if (item) return item.label;
	if (c === "politica") return "Política";
	if (c === "religion" || c === "religión") return "Religión";
	return c ? c.charAt(0).toUpperCase() + c.slice(1) : "Categoría";
};
function Tarjeta({ libro, reportes, onAbrir, onLeer, onEditar, onQr, onEliminar, ranking = null, descargas = null }) {
	const disp = disponibilidad(libro);
	const rep = contarReportes(reportes, libro.id);
	const r = ratingDe(libro);
	const tit = libro.titulo || libro.title || "Libro";
	const aut = libro.autor || (Array.isArray(libro.authors) ? libro.authors[0] : libro.authors) || "Autor";
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
			const idLibro = libro.d || libro.id;
			const origin = (typeof window !== "undefined" && window.location?.origin && !window.location.origin.includes("null")) ? window.location.origin : "https://lumenreader.app";
			const pathname = (typeof window !== "undefined" && window.location?.pathname) ? window.location.pathname.replace(/\/+$/, "") : "";
			const shareUrl = `${origin}${pathname}/?libro=${encodeURIComponent(idLibro)}`;
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
