import { t as require_react } from "./react-1WJTggxS.js";
import { f as getAllPages, r as allBooks } from "./db-Ii3ipPL7.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime, z as subirAGoFile } from "./index-DOrzQ79O.js";
import { eventoDeLibro, generarIdentidad, guardarIdentidad, identidadGuardada, npubCorto, publicarEnRelays } from "./nostr-zC6Qsl2z.js";
import { o as guardarBlobLumen, s as guardarPublicado, u as obtenerBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { onTorrent } from "./torrent-DS6cTKT6.js";
import { construirLumen, dividirEnCapitulos, portadaSvg } from "./lumenbook-D1rmZfn6.js";
import { a as probarClaveIA, abrirEnlace, copiarTexto, i as moderarParaPublicar, n as configIA, o as proveedorDe, r as guardarConfigIA, t as PROVEEDORES } from "./NostrAjustes-CIgc9tj_.js";
//#region src/components/PublicarLibro.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIAS = [
	"ficción",
	"no-ficción",
	"desarrollo-personal",
	"ciencia",
	"historia",
	"poesía",
	"infantil",
	"académico",
	"religión",
	"otros"
];
var IDIOMAS = [
	["es", "Español"],
	["en", "English"],
	["fr", "Français"],
	["pt", "Português"],
	["de", "Deutsch"],
	["it", "Italiano"],
	["otro", "Otro"]
];
var PASOS = [
	["1", "Fuente"],
	["2", "Datos"],
	["3", "Moderar"],
	["4", "Publicar"]
];
var URLS_CLAVE = {
	google: "https://aistudio.google.com/apikey",
	openai: "https://platform.openai.com/api-keys",
	anthropic: "https://console.anthropic.com/settings/keys",
	groq: "https://console.groq.com/keys",
	mistral: "https://console.mistral.ai/api-keys/"
};
function PasoPuntos({ paso }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-pasos",
		children: PASOS.map(([n, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "pb-paso" + (Number(n) === paso ? " on" : Number(n) < paso ? " hecho" : ""),
			children: [Number(n) < paso ? "✓" : n, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: et })]
		}, n))
	});
}
/** Reduce una imagen a JPEG ≤600 px de ancho para portada (dataURL). */
function reducirImagen(file) {
	return new Promise((resolve, reject) => {
		const fr = new FileReader();
		fr.onerror = () => reject(/* @__PURE__ */ new Error("No se pudo leer la imagen"));
		fr.onload = () => {
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Formato de imagen no válido"));
			img.onload = () => {
				const escala = Math.min(1, 600 / img.width);
				const cv = document.createElement("canvas");
				cv.width = Math.round(img.width * escala);
				cv.height = Math.round(img.height * escala);
				cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
				resolve(cv.toDataURL("image/jpeg", .85));
			};
			img.src = String(fr.result);
		};
		fr.readAsDataURL(file);
	});
}
function PublicarLibro({ onSalir, toast, onPublicado, onVerMisPublicaciones, editar = null, libroInicial = null }) {
	const [paso, setPaso] = (0, import_react.useState)(editar ? 2 : 1);
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [librosLocales, setLibrosLocales] = (0, import_react.useState)([]);
	const [fuente, setFuente] = (0, import_react.useState)(null);
	const [capsFuente, setCapsFuente] = (0, import_react.useState)([]);
	const [texto, setTexto] = (0, import_react.useState)("");
	const [buscandoLibros, setBuscandoLibros] = (0, import_react.useState)(true);
	const [titulo, setTitulo] = (0, import_react.useState)(editar?.titulo || "");
	const [autor, setAutor] = (0, import_react.useState)(editar?.autor || "");
	const [categoria, setCategoria] = (0, import_react.useState)(editar?.categoria || "ficción");
	const [idioma, setIdioma] = (0, import_react.useState)(editar?.idioma || "es");
	const [descripcion, setDescripcion] = (0, import_react.useState)(editar?.descripcion || "");
	const [portada, setPortada] = (0, import_react.useState)(editar?.portada || "");
	const [subiendoPortada, setSubiendoPortada] = (0, import_react.useState)(false);
	const [adImagen, setAdImagen] = (0, import_react.useState)(editar?.ad?.image || "");
	const [adUrl, setAdUrl] = (0, import_react.useState)(editar?.ad?.url || "");
	const [donacion, setDonacion] = (0, import_react.useState)(editar?.donacion || "");
	const [zap, setZap] = (0, import_react.useState)(editar?.zap || "");
	const [moderando, setModerando] = (0, import_react.useState)(false);
	const [modResultado, setModResultado] = (0, import_react.useState)(null);
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [proveedor, setProveedor] = (0, import_react.useState)("google");
	const [modelo, setModelo] = (0, import_react.useState)("gemini-2.5-flash");
	const [mostrarKey, setMostrarKey] = (0, import_react.useState)(false);
	const [probandoKey, setProbandoKey] = (0, import_react.useState)(false);
	const [resultadoKey, setResultadoKey] = (0, import_react.useState)(null);
	const [publicando, setPublicando] = (0, import_react.useState)(false);
	const [progreso, setProgreso] = (0, import_react.useState)("");
	const [audioFile, setAudioFile] = (0, import_react.useState)(null);
	const [videoFile, setVideoFile] = (0, import_react.useState)(null);
	const [sinTorrent, setSinTorrent] = (0, import_react.useState)(false);
	const [resultado, setResultado] = (0, import_react.useState)(null);
	const pasoCerrado = (0, import_react.useRef)(false);
	const refTorrentTimer = (0, import_react.useRef)(null);
	const refExtra = (0, import_react.useRef)({});
	const refPublicado = (0, import_react.useRef)(false);
	const dTagRef = (0, import_react.useRef)(null);
	const datosRef = (0, import_react.useRef)({});
	datosRef.current = {
		titulo,
		autor,
		categoria,
		idioma,
		descripcion,
		adImagen,
		adUrl,
		donacion,
		zap,
		identidad,
		modResultado,
		capsFuente,
		portada
	};
	usarPantallaAtras(() => onSalir?.(), () => {
		if (resultado) return false;
		if (paso > (editar ? 2 : 1)) {
			setPaso((p) => p - 1);
			return true;
		}
		return false;
	});
	(0, import_react.useEffect)(() => {
		(async () => {
			const id = await identidadGuardada();
			setIdentidad(id);
			const libros = await allBooks();
			setLibrosLocales(libros);
			setBuscandoLibros(false);
			const cfg = await configIA();
			if (cfg.apiKey) setApiKey(cfg.apiKey);
			setProveedor(cfg.proveedor || "google");
			setModelo(cfg.modelo || proveedorDe(cfg.proveedor || "google").modeloDefecto);
		})();
		return () => {
			if (refTorrentTimer.current) clearTimeout(refTorrentTimer.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!editar) return;
		setFuente({ tipo: "editar" });
		setCapsFuente([]);
	}, [editar]);
	(0, import_react.useEffect)(() => {
		if (!libroInicial) return;
		const t = setTimeout(() => elegirLibro(libroInicial), 350);
		return () => clearTimeout(t);
	}, [libroInicial]);
	(0, import_react.useEffect)(() => {
		if (!publicando) return;
		return onTorrent((ev, d) => {
			if (ev === "torrent_creado" && d?.ok) {
				if (refTorrentTimer.current) clearTimeout(refTorrentTimer.current);
				continuarPublicacion(d, refExtra.current);
			} else if (ev === "torrent_error" && !d?.ok) {
				if (refTorrentTimer.current) {
					clearTimeout(refTorrentTimer.current);
					refTorrentTimer.current = null;
				}
				toast("Sin torrent en este dispositivo: se publica con la descarga de Lumen Storage.");
				continuarPublicacion({ ok: true }, refExtra.current);
			}
		});
	}, [publicando]);
	/** Guarda el registro local y firma/envía el evento a los relays. */
	const continuarPublicacion = (0, import_react.useCallback)(async (d, extra = {}) => {
		if (pasoCerrado.current || refPublicado.current) return;
		refPublicado.current = true;
		const { titulo, autor, categoria, idioma, descripcion, adImagen, adUrl, donacion, zap, modResultado, capsFuente, portada } = datosRef.current;
		const identidad = datosRef.current.identidad || await identidadGuardada();
		try {
			setProgreso("Firmando el evento y enviándolo a los relays…");
			const sello = modResultado?.sello || "approved:local:general:0.85";
			const ad = adImagen && adUrl ? {
				slot: "par",
				image: adImagen,
				url: adUrl
			} : null;
			const dTag = dTagRef.current || editar?.d || `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}-${Date.now().toString(36)}`;
			const ev = eventoDeLibro({
				identidad,
				rating: modResultado?.rating || editar?.rating || "general",
				etiquetas: modResultado?.etiquetas || editar?.etiquetas || [],
				d: dTag,
				titulo,
				autor,
				categoria,
				idioma,
				descripcion,
				portada: portada && portada.startsWith("http") ? portada : "",
				cid: "",
				magnet: d?.magnet || editar?.magnet || "",
				fileUrl: extra.fileUrl || "",
				audioUrl: extra.audioUrl || "",
				videoUrl: extra.videoUrl || "",
				tamano: d?.tamano || editar?.tamano || "",
				paginas: capsFuente.length || editar?.paginas || "",
				ad,
				donacion,
				zap,
				moderacion: sello
			});
			setProgreso("Enviando evento firmado (Kind 30023)…");
			const resultados = await publicarEnRelays(ev);
			const ok = resultados.filter((r) => r.ok).length;
			const fallos = resultados.filter((r) => !r.ok).length;
			const pub = await guardarPublicado({
				d: dTag,
				titulo,
				autor,
				categoria,
				idioma,
				descripcion,
				portada: portada || "",
				magnet: d?.magnet || editar?.magnet || "",
				fileUrl: extra.fileUrl || editar?.fileUrl || "",
				audioUrl: extra.audioUrl || editar?.audioUrl || "",
				videoUrl: extra.videoUrl || editar?.videoUrl || "",
				hash: d?.hash || editar?.hash || "",
				tamano: d?.tamano || editar?.tamano || "",
				paginas: capsFuente.length || editar?.paginas || "",
				ad,
				donacion,
				zap,
				rating: modResultado?.rating || editar?.rating || "general",
				etiquetas: modResultado?.etiquetas || editar?.etiquetas || [],
				evento: ev,
				estadoRelays: resultados.map((r) => ({
					url: r.url,
					ok: r.ok,
					detalle: r.detalle || ""
				})),
				_accion: editar ? `Editado y reenviado (${ok}/${resultados.length} relays)` : `Publicado (${ok}/${resultados.length} relays)`
			});
			setResultado({
				magnet: pub.magnet,
				hash: pub.hash,
				evento: ev,
				relaysOk: ok,
				relaysFallos: fallos,
				d: dTag,
				fileUrl: pub.fileUrl || null,
				audioUrl: pub.audioUrl || null,
				videoUrl: pub.videoUrl || null
			});
			setPublicando(false);
			setProgreso("");
			toast(ok ? `¡Publicado! Enviado a ${ok} relay(s). Lo tienes en «Mis publicaciones».` : "El evento se firmó pero no llegó a los relays. Puedes reenviarlo desde «Mis publicaciones».");
		} catch (e) {
			setPublicando(false);
			setProgreso("");
			toast("Error al publicar: " + (e?.message || e));
		}
	}, [
		editar,
		onPublicado,
		toast
	]);
	const elegirLibro = async (id) => {
		haptic.tap();
		setBuscandoLibros(true);
		const caps = (await getAllPages(id)).map((p) => p.text || "").filter(Boolean).join("\n\n");
		const libro = librosLocales.find((b) => b.id === id);
		setFuente({
			tipo: "libro",
			id
		});
		setCapsFuente(dividirEnCapitulos(caps));
		if (!titulo) setTitulo(libro?.title || "");
		if (!autor) setAutor(libro?.author || "");
		if (libro?.cover && !portada) setPortada(libro.cover);
		setBuscandoLibros(false);
		setPaso(2);
	};
	const usarTexto = () => {
		const t = texto.trim();
		if (!t) {
			toast("Escribe el texto de tu libro primero");
			return;
		}
		haptic.tap();
		setFuente({ tipo: "texto" });
		setCapsFuente(dividirEnCapitulos(t));
		if (!titulo) setTitulo("Mi libro");
		setPaso(2);
	};
	const elegirPortada = async (file) => {
		if (!file) return;
		setSubiendoPortada(true);
		try {
			const dataUrl = await reducirImagen(file);
			setPortada(dataUrl);
			toast("Portada añadida: será la página 1 del libro");
		} catch (e) {
			toast("No se pudo usar esa imagen: " + (e?.message || e));
		} finally {
			setSubiendoPortada(false);
		}
	};
	const moderar = async () => {
		haptic.tap();
		setModerando(true);
		setModResultado(null);
		try {
			if (apiKey.trim()) await guardarConfigIA({
				proveedor,
				apiKey: apiKey.trim(),
				modelo
			});
			const muestra = capsFuente.join("\n\n").slice(0, 800) || editar?.descripcion || titulo;
			const res = await moderarParaPublicar({
				titulo,
				descripcion,
				muestra
			});
			setModResultado(res);
			if (!res.approved) toast("El contenido no pasa la moderación: " + (res.summary || res.motivo || ""));
			else if (res.avisoIA) {
				const e = String(res.avisoIA || "");
				toast(e === "sin_clave" ? "Sin clave de IA: se usó la moderación local (suficiente)." : e === "respuesta_no_json" ? "La IA respondió algo raro; se usó la moderación local." : "La IA falló (" + e.slice(0, 80) + "); se usó la moderación local. Puedes publicar igual.");
			}
		} catch (e) {
			toast("Error al moderar: " + (e?.message || e));
		} finally {
			setModerando(false);
		}
	};
	const publicar = async (soloMetadatos = false) => {
		let ident = identidad;
		if (!ident) {
			ident = await identidadGuardada();
			if (ident) setIdentidad(ident);
		}
		if (!ident) {
			toast("Primero crea tu identidad");
			return;
		}
		if (!modResultado?.approved && !editar) {
			toast("El libro debe pasar la moderación antes de publicar");
			setPaso(3);
			return;
		}
		setPublicando(true);
		setSinTorrent(false);
		pasoCerrado.current = false;
		refPublicado.current = false;
		try {
			const { titulo, autor, categoria, idioma, descripcion, adImagen, adUrl, donacion, zap, portada, capsFuente } = datosRef.current;
			setProgreso("Convirtiendo a LumenBook (.lumen)…");
			let blob = null;
			if (editar && fuente?.tipo === "editar" && !capsFuente.length) {
				blob = await obtenerBlobLumen(editar.d);
				if (!blob) throw new Error("No se encuentra el .lumen original en tu teléfono");
			} else blob = (await construirLumen({
				titulo,
				autor,
				categoria,
				idioma,
				descripcion,
				ad: adImagen && adUrl ? {
					slot: "par",
					image: adImagen,
					url: adUrl
				} : null,
				donacion,
				zap
			}, capsFuente, portada || null)).blob;
			const dTag = editar?.d || `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}-${Date.now().toString(36)}`;
			dTagRef.current = dTag;
			await guardarBlobLumen(dTag, blob);
			const nombre = (titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim() + ".lumen";
			const extra = { fileUrl: null, audioUrl: null, videoUrl: null };
			try {
				setProgreso("Subiendo el libro a Lumen Storage para descarga 24/7…");
				const up = await subirAGoFile(blob, nombre);
				extra.fileUrl = up.url;
				if (audioFile) {
					setProgreso("Subiendo el audio del autor a Lumen Storage…");
					extra.audioUrl = (await subirAGoFile(audioFile, (audioFile.name || "audio").replace(/\.[^.]+$/, "") + "_audio")).url;
				}
				if (videoFile) {
					setProgreso("Subiendo el vídeo del autor a Lumen Storage…");
					extra.videoUrl = (await subirAGoFile(videoFile, (videoFile.name || "video").replace(/\.[^.]+$/, "") + "_video")).url;
				}
			} catch (e) {
				toast("Lumen Storage no respondió (" + (e?.message || e) + "); el libro se publica igualmente.");
			}
			refExtra.current = extra;
			if (soloMetadatos) {
				await continuarPublicacion(null, extra);
				return;
			}
			setProgreso("Creando el torrent y sembrando desde tu móvil (extra P2P)…");
			const b64 = await new Promise((res, rej) => {
				const fr = new FileReader();
				fr.onload = () => res(String(fr.result).split(",")[1] || "");
				fr.onerror = rej;
				fr.readAsDataURL(blob);
			});
			const motor = typeof window !== "undefined" ? window.AndroidTorrent : null;
			if (motor && typeof motor.sembrar === "function") {
				motor.sembrar(nombre, b64);
				if (refTorrentTimer.current) clearTimeout(refTorrentTimer.current);
				refTorrentTimer.current = setTimeout(() => {
					setSinTorrent(true);
					continuarPublicacion({ ok: true }, refExtra.current);
				}, 3e4);
			} else {
				setSinTorrent(true);
				continuarPublicacion({ ok: true }, refExtra.current);
			}
		} catch (e) {
			setPublicando(false);
			setProgreso("");
			toast("Error: " + (e?.message || e));
		}
	};
	const nuevoAutor = async () => {
		const id = generarIdentidad();
		await guardarIdentidad(id);
		setIdentidad(id);
		toast("Identidad creada: " + npubCorto(id.npub));
	};
	const portadaAuto = portadaSvg(titulo || "Mi libro", autor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-scrim",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pb-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "cg-back",
						onClick: () => onSalir?.(),
						"aria-label": "Cerrar",
						children: "✕"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cg-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editar ? "✏️ Editar libro" : "📤 Publicar libro" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Biblioteca Global · Lumen Storage · sin cuentas · firma propia" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoPuntos, { paso }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-cuerpo",
					children: [
						!identidad && paso < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-ident-banner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Necesitas tu identidad" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Se genera en tu teléfono: nadie más tendrá tu clave." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: nuevoAutor,
								children: "Crear identidad"
							})]
						}),
						paso === 1 && !editar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-paso1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "¿De dónde sale el texto?" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									children: "Elige un libro de tu biblioteca (se convierte a LumenBook en tu móvil) o pega el texto directamente."
								}),
								buscandoLibros ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "center-msg",
									style: { padding: 30 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-libros",
									children: [librosLocales.slice(0, 40).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "pb-libro",
										onClick: () => elegirLibro(b.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pb-libro-ic",
												children: "📖"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "pb-libro-txt",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: b.title || "Sin título" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: b.fileName || b.id })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tp-acceso-fl",
												children: "›"
											})
										]
									}, b.id)), librosLocales.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										style: { color: "var(--fg-dim)" },
										children: "No hay libros locales todavía."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-texto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: texto,
										onChange: (e) => setTexto(e.target.value),
										placeholder: "…o pega aquí tu texto (capítulos separados por líneas en blanco).",
										rows: 6
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn primary",
										onClick: usarTexto,
										children: "Usar este texto"
									})]
								})
							]
						}),
						paso === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-paso2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Datos del libro" }),
								editar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "row-sub",
									style: { marginTop: 0 },
									children: [
										"✏️ Estás editando una publicación existente: al guardar, el evento nuevo",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: " reemplaza" }),
										" al anterior en los relays (mismo identificador)."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Título *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: titulo,
										onChange: (e) => setTitulo(e.target.value),
										placeholder: "El poder de los hábitos"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Autor *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: autor,
										onChange: (e) => setAutor(e.target.value),
										placeholder: "Tu nombre o seudónimo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-fila",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Categoría" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: categoria,
											onChange: (e) => setCategoria(e.target.value),
											children: CATEGORIAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												children: c
											}, c))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Idioma" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: idioma,
											onChange: (e) => setIdioma(e.target.value),
											children: IDIOMAS.map(([v, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: v,
												children: et
											}, v))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Descripción" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: descripcion,
										onChange: (e) => setDescripcion(e.target.value),
										rows: 3,
										placeholder: "¿De qué trata tu libro?"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-media",
									style: { borderLeft: "3px solid var(--accent, #6d5bd0)", background: "var(--card-2, rgba(125, 100, 255, 0.06))" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🎧 Audio y  vídeo del autor (opcional)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "row-sub",
											children: "Acompaña tu libro con una audición o un vídeo. Se suben a Lumen Storage y cada lector los abre desde el catálogo y el lector global (máx. 300 MB por archivo)."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-fila",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "pb-campo",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎧 Audio (mp3, m4a, ogg…)" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "file",
															accept: "audio/*",
															onChange: (e) => setAudioFile(e.target.files?.[0] || null)
														}),
														audioFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { style: { color: "var(--fg-mute)" }, children: [audioFile.name, " · ", (audioFile.size / 1048576).toFixed(1), " MB"] })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "pb-campo",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎬 Vídeo (mp4, webm…)" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "file",
															accept: "video/*",
															onChange: (e) => setVideoFile(e.target.files?.[0] || null)
														}),
														videoFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { style: { color: "var(--fg-mute)" }, children: [videoFile.name, " · ", (videoFile.size / 1048576).toFixed(1), " MB"] })
													]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-portada",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🖼 Portada" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "row-sub",
											children: [
												"Será la ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "página 1" }),
												" del libro y la imagen del catálogo. Si no subes ninguna, se genera una automáticamente con el título (la de aquí al lado)."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-portada-fila",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "pb-portada-prev",
												children: portada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: portada,
													alt: "Portada elegida"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "data:image/svg+xml;utf8," + encodeURIComponent(portadaAuto),
													alt: "Portada automática"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pb-portada-btns",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "btn primary",
														style: { cursor: "pointer" },
														children: [subiendoPortada ? "Procesando…" : "📷 Subir imagen", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "file",
															accept: "image/*",
															style: { display: "none" },
															onChange: (e) => elegirPortada(e.target.files?.[0])
														})]
													}),
													portada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn",
														onClick: () => setPortada(""),
														children: "Usar la automática"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
														style: { color: "var(--fg-mute)" },
														children: "La imagen se guarda dentro del .lumen; no se sube a ningún servidor."
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "pb-detalles",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "💸 Monetización 50/50 (opcional)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "row-sub",
											children: "En el lector, las páginas pares muestran TU anuncio y las impares el de la app. El dinero de tu anuncio va directo a tu cuenta: no pasa por nosotros."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Imagen de tu banner (URL https)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: adImagen,
												onChange: (e) => setAdImagen(e.target.value),
												placeholder: "https://tusitio.com/banner.webp"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enlace del banner (URL https)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: adUrl,
												onChange: (e) => setAdUrl(e.target.value),
												placeholder: "https://tusitio.com"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enlace de donación (Patreon, MercadoPago…)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: donacion,
												onChange: (e) => setDonacion(e.target.value),
												placeholder: "https://patreon.com/tunombre"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zap Lightning (lnurl / lightning:)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: zap,
												onChange: (e) => setZap(e.target.value),
												placeholder: "lnurl1dp68…"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-siguiente",
									children: [editar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										onClick: () => onSalir?.(),
										children: "‹ Cancelar"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										onClick: () => setPaso(1),
										children: "‹ Atrás"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn primary",
										disabled: !titulo.trim() || !autor.trim(),
										onClick: () => {
											haptic.tap();
											setPaso(editar ? 4 : 3);
										},
										children: "Continuar ›"
									})]
								}),
								editar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									style: { fontSize: 11.5 },
									children: "Al editar no se repite la moderación: se conserva la clasificación original."
								})
							]
						}),
						paso === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-paso3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Moderación" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									children: "Antes de publicar, el contenido se revisa automáticamente en tu móvil (moderación local, sin internet). Opcionalmente, con tu clave gratuita de IA (Gemini y otros), la revisión es más profunda."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-pasos",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "¿No tienes clave? Es gratis:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Toca ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "«Abrir página de claves»" }),
											"."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Inicia sesión y crea una clave (en Google empieza por ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "AIza…" }),
											")."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Pégala abajo y toca ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "«Probar»" }),
											"."
										] })
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-enlaces",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										onClick: () => abrirEnlace(URLS_CLAVE[proveedor] || URLS_CLAVE.google),
										children: "🔗 Abrir página de claves"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										onClick: () => copiarTexto(URLS_CLAVE[proveedor] || URLS_CLAVE.google, toast),
										children: "📋 Copiar enlace"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tu clave de IA (opcional)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-key",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: mostrarKey ? "text" : "password",
												value: apiKey,
												onChange: (e) => {
													setApiKey(e.target.value);
													setResultadoKey(null);
												},
												placeholder: "Pega tu clave (AIza…, sk-…, gsk_…)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setMostrarKey(!mostrarKey),
												children: mostrarKey ? "🙈" : "👁"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: "var(--fg-mute)" },
											children: "Se guarda solo en tu teléfono · sin clave se usa la clasificación local"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-fila",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proveedor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: proveedor,
											onChange: (e) => {
												setProveedor(e.target.value);
												setModelo(proveedorDe(e.target.value).modeloDefecto);
												setResultadoKey(null);
											},
											children: PROVEEDORES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: p.id,
												children: [
													p.icono,
													" ",
													p.nombre
												]
											}, p.id))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modelo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: modelo,
											onChange: (e) => {
												setModelo(e.target.value);
												setResultadoKey(null);
											},
											children: proveedorDe(proveedor).modelos.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: m,
												children: m
											}, m))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "na-enlaces",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										disabled: probandoKey,
										onClick: async () => {
											setProbandoKey(true);
											setResultadoKey(null);
											const r = await probarClaveIA({
												proveedor,
												apiKey,
												modelo
											});
											setResultadoKey(r);
											if (r.ok) await guardarConfigIA({
												proveedor,
												apiKey: apiKey.trim(),
												modelo
											});
											setProbandoKey(false);
										},
										children: probandoKey ? "Probando…" : "✓ Probar clave"
									})
								}),
								resultadoKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pb-moder " + (resultadoKey.ok ? "ok" : "no"),
									style: { marginTop: 8 },
									children: resultadoKey.mensaje
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									disabled: moderando,
									onClick: moderar,
									style: { width: "100%" },
									children: moderando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }) : "🤖 Revisar contenido"
								}),
								modResultado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-moder" + (modResultado.approved ? " ok" : " no"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: modResultado.approved ? "✅ Aprobado" : "❌ Rechazado" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: modResultado.summary || modResultado.motivo }),
										modResultado.rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											"Clasificación: ",
											modResultado.rating === "adulto" ? "🔞 adulto (se oculta por defecto)" : modResultado.rating === "maduro" ? "⚠️ maduro" : "✅ general",
											modResultado.etiquetas?.length ? " · etiquetas: " + modResultado.etiquetas.join(", ") : ""
										] }),
										modResultado.nivel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											"Revisado con: ",
											String(modResultado.nivel || "local").replace("byok:", "tu IA ("),
											modResultado.nivel?.startsWith("byok") ? ")" : ""
										] }),
										modResultado.flags?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Señales: ", modResultado.flags.join(", ")] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-siguiente",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn",
											onClick: () => setPaso(2),
											children: "‹ Atrás"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn primary",
											disabled: !modResultado?.approved,
											onClick: () => {
												haptic.tap();
												setPaso(4);
											},
											children: "Continuar ›"
										}),
										modResultado?.approved && modResultado.rating === "adulto" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												color: "var(--flame)",
												fontSize: 11.5,
												marginTop: 8
											},
											children: "🔞 Se publicará etiquetado como «adulto»: otros lectores lo verán solo si activan «mostrar contenido adulto» en el catálogo."
										})
									]
								})
							]
						}),
						paso === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-paso4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: editar ? "Guardar cambios" : "Publicar en la Biblioteca Global" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pb-resumen",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pb-resumen-top",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pb-resumen-cov",
											children: portada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: portada,
												alt: "Portada"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "data:image/svg+xml;utf8," + encodeURIComponent(portadaAuto),
												alt: "Portada automática"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["📖 ", titulo] }),
												" · ",
												autor
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												categoria,
												" · ",
												idioma,
												" · ",
												capsFuente.length || editar?.paginas || "?",
												" capítulo(s)"
											] }) }),
											identidad && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["✍️ Firmará: ", npubCorto(identidad.npub)] }) }),
											(modResultado || editar?.rating) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Clasificación: ", modResultado?.rating || editar?.rating || "general"] }) }),
									(audioFile || videoFile) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										(audioFile ? "🎧 audio" : "") + (audioFile && videoFile ? " · " : "") + (videoFile ? "🎬 vídeo" : ""),
										" del autor: se subirá a Lumen Storage"
									] }) })
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-publicar-box",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "row-sub",
											children: [
												"Al publicar: 1) tu libro se convierte a LumenBook (.lumen) en el móvil, 2) se sube a Lumen Storage para que se descargue 24/7 sin que tu equipo esté encendido, 3) se crea un torrent P2P extra si hay motor, 4) se firma el evento con tu clave y se envía a los relays. ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Todo queda además guardado en «Mis publicaciones»" }),
												", con el resultado por relay y el archivo .lumen para compartir cuando quieras."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn primary",
											disabled: publicando,
											onClick: () => publicar(false),
											style: { width: "100%" },
											children: publicando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }) : editar ? "💾 Guardar y reenviar" : "🚀 Publicar"
										}),
										progreso && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pb-progreso",
											children: progreso
										}),
										sinTorrent && !resultado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pb-sintorrent",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🌐 Sin torrent en este dispositivo (no pasa nada)." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "row-sub",
													children: "El torrent era un extra P2P: la descarga funciona desde Lumen Storage, 24/7 y sin tu equipo. El .lumen además queda guardado en tu teléfono para compartirlo cuando quieras."
												})
											]
										})
									]
								}),
								resultado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-hecho",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: resultado.relaysOk ? "🎉 ¡Libro publicado!" : "📦 Libro guardado en tu teléfono" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: resultado.relaysOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"Enviado a ",
											resultado.relaysOk,
											" relay(s)",
											resultado.relaysFallos > 0 ? ` (${resultado.relaysFallos} sin respuesta)` : "",
											"."
										] }) : "No se pudo contactar con los relays. El libro y su .lumen quedaron guardados: reenvíalo desde «Mis publicaciones» cuando tengas conexión." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-donde",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "¿Dónde quedó?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"📋 En ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Mis publicaciones" }),
													" (catálogo → botón 📦): estado, historial, QR y compartir."
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "☁️ En Lumen Storage: el .lumen (y el audio/vídeo, si los hay) se descarga 24/7, sin que tu equipo esté encendido." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🌐 En los relays: cualquiera con LumenReader lo ve en la Biblioteca Global." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "📱 El .lumen está en tu teléfono: compártelo por WhatsApp, correo…" })
											] })]
										}),
										(resultado.fileUrl || resultado.audioUrl || resultado.videoUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-donde",
											style: { borderLeft: "3px solid var(--accent, #6d5bd0)" },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "☁️ Lumen Storage" }),
												resultado.fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Descarga 24/7 del libro:" }), " ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { style: { wordBreak: "break-all", fontSize: 11 }, children: resultado.fileUrl })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													style: { display: "flex", gap: 8, flexWrap: "wrap" },
													children: [
														resultado.fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn sm", onClick: () => abrirEnlace(resultado.fileUrl), children: "📥 Abrir descarga" }),
														resultado.fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn sm", onClick: () => copiarTexto(resultado.fileUrl, toast), children: "⧉ Copiar enlace" }),
														resultado.audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn sm", onClick: () => abrirEnlace(resultado.audioUrl), children: "🎧 Audio" }),
														resultado.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn sm", onClick: () => abrirEnlace(resultado.videoUrl), children: "🎬 Vídeo" })
													]
												}),
												!resultado.fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "La subida de Lumen Storage no llegó: comparte el .lumen desde «Mis publicaciones» o siembra el torrent para que lo descarguen otros." })
											]
										}),
										resultado.magnet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "pb-hash",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Magnet:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [String(resultado.magnet).slice(0, 90), "…"] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "pb-hash",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Evento:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [resultado.evento.id.slice(0, 24), "…"] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPublicado, {
											magnet: resultado.magnet,
											d: resultado.d,
											titulo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-siguiente",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn",
													onClick: () => onSalir?.(),
													children: "Cerrar"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn",
													onClick: () => onVerMisPublicaciones?.(),
													children: "📦 Mis publicaciones"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn primary",
													onClick: () => onPublicado?.(resultado.evento),
													children: "Ver en el catálogo"
												})
											]
										})
									]
								})
							]
						})
					]
				})
			]
		})
	});
}
function QrPublicado({ magnet, d, titulo }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		try {
			const data = JSON.stringify({
				v: 1,
				d,
				t: titulo,
				m: magnet || ""
			});
			const img = new Image();
			img.onload = () => {
				const ctx = ref.current.getContext("2d");
				ctx.clearRect(0, 0, 280, 280);
				ctx.drawImage(img, 0, 0, 280, 280);
			};
			img.src = qrDataUrl(data, 280);
		} catch (e) {
			console.warn("[qr]", e?.message || e);
		}
	}, [
		magnet,
		d,
		titulo
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-qr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref,
			width: 280,
			height: 280
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
			style: { color: "var(--fg-dim)" },
			children: [
				"Comparte este QR o el enlace ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: ["lumenreader://b/", d] }),
				": quien lo escanee abre tu libro en LumenReader."
			]
		})]
	});
}
//#endregion
export { PublicarLibro as default };
