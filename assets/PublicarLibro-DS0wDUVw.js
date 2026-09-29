import { t as require_react } from "./react-1WJTggxS.js";
import { f as getAllPages, r as allBooks } from "./db-Ii3ipPL7.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime, z as subirAGoFile } from "./index-DX181kQz.js";
import { eventoDeLibro, generarFacehashUri, generarIdentidad, guardarIdentidad, identidadGuardada, npubCorto, publicarEnRelays } from "./nostr-zC6Qsl2z.js";
import { o as guardarBlobLumen, s as guardarPublicado, u as obtenerBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { onTorrent } from "./torrent-DS6cTKT6.js";
import { construirLumen, dividirEnCapitulos, portadaSvg } from "./lumenbook-D1rmZfn6.js";
import { abrirEnlace, copiarTexto } from "./NostrAjustes-CIgc9tj_.js";
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
	["1", "Libro"],
	["2", "Datos y Publicar"]
];
function PasoPuntos({ paso }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-pasos",
		children: PASOS.map(([n, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "pb-paso" + (Number(n) === paso ? " on" : Number(n) < paso ? " hecho" : ""),
			children: [Number(n) < paso ? "✓" : n, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: et })]
		}, n))
	});
}
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
function PublicarLibro({ onSalir, toast, onPublicado, onVerMisPublicaciones, editar = null, libroInicial = null, onAbrirAds = null, onAjustes = null }) {
	const [paso, setPaso] = (0, import_react.useState)(editar ? 2 : 1);
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [librosLocales, setLibrosLocales] = (0, import_react.useState)([]);
	const [fuente, setFuente] = (0, import_react.useState)(null);
	const [capsFuente, setCapsFuente] = (0, import_react.useState)([]);
	const [texto, setTexto] = (0, import_react.useState)("");
	const [mostrarPegar, setMostrarPegar] = (0, import_react.useState)(false);
	const [buscandoLibros, setBuscandoLibros] = (0, import_react.useState)(true);
	const [titulo, setTitulo] = (0, import_react.useState)(editar?.titulo || "");
	const [autor, setAutor] = (0, import_react.useState)(() => {
		if (editar?.autor) return editar.autor;
		try { return localStorage.getItem("lumen_anon_autor") || "Lector Anónimo"; } catch { return "Lector Anónimo"; }
	});
	const [avatarSeed, setAvatarSeed] = (0, import_react.useState)(() => {
		try { return localStorage.getItem("lumen_anon_avatar_seed") || ("anon-" + Math.random().toString(36).slice(2, 9)); } catch { return "anon-" + Math.random().toString(36).slice(2, 9); }
	});
	const avatarUri = (0, import_react.useMemo)(() => {
		return generarFacehashUri(avatarSeed + ":" + (autor || "anon"), 80);
	}, [avatarSeed, autor]);

	const [categoria, setCategoria] = (0, import_react.useState)(editar?.categoria || "ficción");
	const [idioma, setIdioma] = (0, import_react.useState)(editar?.idioma || "es");
	const [descripcion, setDescripcion] = (0, import_react.useState)(editar?.descripcion || "");
	const [portada, setPortada] = (0, import_react.useState)(editar?.portada || "");
	const [subiendoPortada, setSubiendoPortada] = (0, import_react.useState)(false);
	const [donacion, setDonacion] = (0, import_react.useState)(editar?.donacion || "");
	const [zap, setZap] = (0, import_react.useState)(editar?.zap || "");
	const [audioFile, setAudioFile] = (0, import_react.useState)(null);
	const [videoFile, setVideoFile] = (0, import_react.useState)(null);
	const [publicando, setPublicando] = (0, import_react.useState)(false);
	const [progreso, setProgreso] = (0, import_react.useState)("");
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
		donacion,
		zap,
		identidad,
		capsFuente,
		portada,
		avatarUri
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
			let id = await identidadGuardada();
			if (!id) {
				id = generarIdentidad();
				await guardarIdentidad(id);
			}
			setIdentidad(id);
			const libros = await allBooks();
			setLibrosLocales(libros);
			setBuscandoLibros(false);
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

	const regenerarAvatar = () => {
		haptic.tap();
		const s = "anon-" + Math.random().toString(36).slice(2, 9);
		setAvatarSeed(s);
		try { localStorage.setItem("lumen_anon_avatar_seed", s); } catch {}
		toast("Nuevo avatar generado");
	};

	const elegirLibro = async (id) => {
		haptic.tap();
		try {
			const b = librosLocales.find((x) => x.id === id);
			const pags = await getAllPages(id);
			const caps = pags.map((p) => p.text || "").filter(Boolean);
			setFuente({ tipo: "local", id, libro: b });
			setCapsFuente(caps.length ? caps : ["Sin texto indexado en el lector."]);
			if (b) {
				setTitulo(b.title || b.fileName || "Mi libro");
				if (b.author) setAutor(b.author);
				if (b.description) setDescripcion(b.description);
				if (b.cover) setPortada(b.cover);
			}
			setPaso(2);
		} catch (e) {
			toast("No se pudo cargar el libro: " + (e?.message || e));
		}
	};

	const procesarTexto = () => {
		haptic.tap();
		const t = texto.trim();
		if (!t) {
			toast("Escribe o pega algo de texto");
			return;
		}
		const caps = dividirEnCapitulos(t);
		setFuente({ tipo: "texto" });
		setCapsFuente(caps);
		if (!titulo) setTitulo("Mi escrito");
		setPaso(2);
	};

	const procesarArchivo = async (file) => {
		if (!file) return;
		haptic.tap();
		try {
			const nom = file.name.replace(/\.[^.]+$/, "");
			const txt = await file.text();
			const caps = dividirEnCapitulos(txt);
			setFuente({ tipo: "archivo", nombre: file.name });
			setCapsFuente(caps.length ? caps : [txt.slice(0, 100000)]);
			setTitulo(nom || "Mi libro");
			setPaso(2);
			toast("Archivo cargado: " + file.name);
		} catch (e) {
			toast("Error al leer el archivo: " + (e?.message || e));
		}
	};

	const continuarPublicacion = (0, import_react.useCallback)(async (d, extra = {}) => {
		if (pasoCerrado.current || refPublicado.current) return;
		refPublicado.current = true;
		const { titulo, autor, categoria, idioma, descripcion, donacion, zap, capsFuente, portada, avatarUri } = datosRef.current;
		let idActual = datosRef.current.identidad || await identidadGuardada();
		if (!idActual) {
			idActual = generarIdentidad();
			await guardarIdentidad(idActual);
		}
		try {
			setProgreso("Firmando y publicando en la red descentralizada…");
			const dTag = dTagRef.current || editar?.d || `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}-${Date.now().toString(36)}`;
			const ev = eventoDeLibro({
				identidad: idActual,
				rating: editar?.rating || "general",
				etiquetas: editar?.etiquetas || [],
				d: dTag,
				titulo,
				autor,
				authorAvatar: avatarUri,
				categoria,
				idioma,
				descripcion,
				portada: portada && portada.startsWith("http") ? portada : (portada || ""),
				cid: "",
				magnet: d?.magnet || editar?.magnet || "",
				fileUrl: extra.fileUrl || "",
				audioUrl: extra.audioUrl || "",
				videoUrl: extra.videoUrl || "",
				tamano: d?.tamano || editar?.tamano || "",
				paginas: capsFuente.length || editar?.paginas || "",
				ad: null,
				donacion,
				zap,
				moderacion: "approved:direct:general:1.0"
			});
			setProgreso("Enviando a los relays de internet (Damus, Primal, Nostr)…");
			const resultados = await publicarEnRelays(ev);
			const ok = resultados.filter((r) => r.ok).length;
			const fallos = resultados.filter((r) => !r.ok).length;
			const pub = await guardarPublicado({
				d: dTag,
				titulo,
				autor,
				authorAvatar: avatarUri,
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
				ad: null,
				donacion,
				zap,
				rating: editar?.rating || "general",
				etiquetas: editar?.etiquetas || [],
				evento: ev,
				estadoRelays: resultados.map((r) => ({
					url: r.url,
					ok: r.ok,
					detalle: r.detalle || ""
				})),
				_accion: editar ? `Editado (${ok}/${resultados.length} relays)` : `Publicado (${ok}/${resultados.length} relays)`
			});
			try { localStorage.setItem("lumen_anon_autor", autor); } catch {}
			setResultado({
				magnet: pub.magnet,
				hash: pub.hash,
				evento: ev,
				relaysOk: ok,
				relaysFallos: fallos,
				d: dTag,
				fileUrl: pub.fileUrl || null,
				titulo,
				autor,
				avatarUri,
				portada
			});
			setPublicando(false);
			setProgreso("");
			toast(ok ? `¡Publicado en internet! Lo encuentras en «Mis libros» y en la Store.` : "Guardado localmente y firmado para la red.");
		} catch (e) {
			setPublicando(false);
			setProgreso("");
			toast("Error al publicar: " + (e?.message || e));
		}
	}, [editar, onPublicado, toast]);

	const publicar = async () => {
		if (!titulo.trim() || !autor.trim()) {
			toast("Indica el título y el autor para publicar");
			return;
		}
		let ident = identidad;
		if (!ident) {
			ident = await identidadGuardada();
			if (!ident) {
				ident = generarIdentidad();
				await guardarIdentidad(ident);
			}
			setIdentidad(ident);
		}
		setPublicando(true);
		pasoCerrado.current = false;
		refPublicado.current = false;
		try {
			const { titulo, autor, categoria, idioma, descripcion, donacion, zap, portada, capsFuente } = datosRef.current;
			setProgreso("Creando formato LumenBook (.lumen)…");
			let blob = null;
			if (editar && fuente?.tipo === "editar" && !capsFuente.length) {
				blob = await obtenerBlobLumen(editar.d);
				if (!blob) {
					blob = (await construirLumen({
						titulo,
						autor,
						categoria,
						idioma,
						descripcion,
						ad: null,
						donacion,
						zap
					}, [descripcion || titulo], portada || null)).blob;
				}
			} else {
				blob = (await construirLumen({
					titulo,
					autor,
					categoria,
					idioma,
					descripcion,
					ad: null,
					donacion,
					zap
				}, capsFuente.length ? capsFuente : [descripcion || titulo], portada || null)).blob;
			}
			const dTag = editar?.d || `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}-${Date.now().toString(36)}`;
			dTagRef.current = dTag;
			await guardarBlobLumen(dTag, blob);
			const nombre = (titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim() + ".lumen";
			const extra = { fileUrl: null, audioUrl: null, videoUrl: null };
			try {
				setProgreso("Subiendo a Lumen Storage para descarga en cualquier dispositivo…");
				const up = await subirAGoFile(blob, nombre);
				extra.fileUrl = up.url;
				if (audioFile) {
					extra.audioUrl = (await subirAGoFile(audioFile, (audioFile.name || "audio").replace(/\.[^.]+$/, "") + "_audio")).url;
				}
				if (videoFile) {
					extra.videoUrl = (await subirAGoFile(videoFile, (videoFile.name || "video").replace(/\.[^.]+$/, "") + "_video")).url;
				}
			} catch (e) {
				console.warn("[upload storage]", e?.message || e);
			}
			refExtra.current = extra;
			await continuarPublicacion(null, extra);
		} catch (e) {
			setPublicando(false);
			setProgreso("");
			toast("Error: " + (e?.message || e));
		}
	};

	const portadaAuto = portadaSvg(titulo || "Mi libro", autor || "Autor Anónimo");

	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-scrim",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pb-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-back",
							onClick: () => onSalir?.(),
							"aria-label": "Cerrar",
							children: "✕"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-title",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editar ? "✏️ Editar libro" : "📤 Publicar en Lumen Store" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Sin cuentas · Perfil anónimo exclusivo · Red abierta" })
							]
						})
					]
				}),
				!resultado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoPuntos, { paso }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-cuerpo",
					children: [
						resultado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-exito",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pb-exito-ico", children: "🎉" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "¡Libro publicado en internet!" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									children: "Tu libro ya está guardado en la red descentralizada de Lumen Store. Puedes encontrarlo desde cualquier otro dispositivo en el buscador o en la sección de Mis libros."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-exito-card",
									children: [
										portada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											className: "pb-exito-cov",
											src: portada,
											alt: ""
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pb-exito-cov pb-exito-cov-gen",
											children: "📖"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-exito-info",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: titulo }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-exito-autor-fila",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															className: "pb-exito-avatar",
															src: avatarUri,
															alt: autor
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: autor })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
													className: "pb-exito-meta",
													children: ["Categoría: ", categoria, " · ", resultado.fileUrl ? "🟢 Descarga 24/7 disponible" : "📡 Difundido a relays"]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-exito-acciones",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn primary",
											onClick: () => {
												haptic.tap();
												onVerMisPublicaciones?.();
											},
											children: "📚 Ver en Mis libros"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn",
											onClick: () => {
												haptic.tap();
												onPublicado?.(resultado.evento);
											},
											children: "🌐 Ver en la Store"
										})
									]
								})
							]
						}) : (
							paso === 1 && !editar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pb-paso1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "¿Qué libro quieres publicar?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "row-sub",
										children: "Elige uno de tus libros, sube un archivo o escribe texto directamente para compartirlo en la comunidad con tu perfil anónimo."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-upload-banner",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-upload-ic", children: "📁" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Subir archivo del libro" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Formatos .epub, .pdf, .txt o .lumen" })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: ".epub,.pdf,.txt,.lumen",
												style: { display: "none" },
												onChange: (e) => procesarArchivo(e.target.files?.[0])
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pb-sep",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "o elige de tu biblioteca" })
									}),
									buscandoLibros ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "center-msg",
										style: { padding: 20 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" })
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pb-libros",
										children: [
											librosLocales.slice(0, 40).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "pb-libro",
												onClick: () => elegirLibro(b.id),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-libro-ic", children: "📖" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "pb-libro-txt",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: b.title || "Sin título" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: b.author ? `Por ${b.author}` : (b.fileName || b.id) })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tp-acceso-fl", children: "›" })
												]
											}, b.id)),
											librosLocales.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												style: { color: "var(--fg-dim)", padding: "10px 0" },
												children: "Tu biblioteca local aún no tiene libros. Puedes subir un archivo arriba o pegar texto."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pb-pegar-toggle",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn ghost sm",
												onClick: () => setMostrarPegar(!mostrarPegar),
												children: mostrarPegar ? "▲ Ocultar editor de texto" : "✍️ O escribe / pega el texto directamente"
											}),
											mostrarPegar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pb-texto",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
														value: texto,
														onChange: (e) => setTexto(e.target.value),
														rows: 6,
														placeholder: "Pega aquí el contenido de tu libro o artículo…"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn primary",
														onClick: procesarTexto,
														children: "Usar este texto ›"
													})
												]
											})
										]
									})
								]
							}) : (
								/* Paso 2: Datos, Perfil de Autor y Publicar */
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-paso2",
									children: [
										/* Tarjeta de Perfil Anónimo */
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-autor-perfil",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-avatar-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															className: "pb-avatar-img",
															src: avatarUri,
															alt: "Avatar exclusivo del autor"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "pb-avatar-regen",
															onClick: regenerarAvatar,
															title: "Cambiar estilo de avatar",
															children: "↻"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-autor-info",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "pb-campo-tit",
															children: "Nombre o seudónimo del autor *"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															className: "plain pb-input-autor",
															value: autor,
															onChange: (e) => setAutor(e.target.value),
															placeholder: "Tu alias de autor"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-perfil-tags",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "pb-tag-anon",
																	children: "🎭 Perfil anónimo de autor"
																}),
																identidad?.npub ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
																	className: "pb-tag-id",
																	children: ["ID: ", npubCorto(identidad.npub)]
																}) : null
															]
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Título del libro *" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: titulo,
													onChange: (e) => setTitulo(e.target.value),
													placeholder: "Ej. Viaje al centro del conocimiento"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-fila",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "pb-campo",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Categoría" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
															value: categoria,
															onChange: (e) => setCategoria(e.target.value),
															children: CATEGORIAS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: c,
																children: c
															}, c))
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "pb-campo",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Idioma" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
															value: idioma,
															onChange: (e) => setIdioma(e.target.value),
															children: IDIOMAS.map(([v, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: v,
																children: et
															}, v))
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "pb-campo",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Descripción o sinopsis" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: descripcion,
													onChange: (e) => setDescripcion(e.target.value),
													rows: 3,
													placeholder: "¿De qué trata este libro? Aparecerá en la ficha del catálogo."
												})
											]
										}),
										/* Portada */
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-portada-bloque",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-campo-tit", children: "Portada del libro" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-portada-fila",
													children: [
														portada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															className: "pb-portada-preview",
															src: portada,
															alt: ""
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															className: "pb-portada-preview",
															src: portadaAuto,
															alt: ""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-portada-btns",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																	className: "btn sm",
																	children: [
																		subiendoPortada ? "Cargando…" : "📷 Elegir imagen",
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																			type: "file",
																			accept: "image/*",
																			style: { display: "none" },
																			onChange: async (e) => {
																				const f = e.target.files?.[0];
																				if (!f) return;
																				setSubiendoPortada(true);
																				try {
																					const data = await reducirImagen(f);
																					setPortada(data);
																					toast("Portada actualizada");
																				} catch (err) {
																					toast(err?.message || "Error");
																				} finally {
																					setSubiendoPortada(false);
																				}
																			}
																		})
																	]
																}),
																portada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	className: "btn ghost sm",
																	onClick: () => setPortada(""),
																	children: "Usar diseño auto"
																})
															]
														})
													]
												})
											]
										}),
										/* Opciones opcionales colapsables */
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
											className: "pb-detalles",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "⚙️ Opciones avanzadas (audio, donaciones)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-detalles-body",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "pb-campo",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎧 Audio de autor opcional" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	type: "file",
																	accept: "audio/*",
																	onChange: (e) => setAudioFile(e.target.files?.[0] || null)
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "pb-campo",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚡ Zap Lightning (dirección LNURL)" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: zap,
																	onChange: (e) => setZap(e.target.value),
																	placeholder: "tu_nombre@getalby.com o lnurl…"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "pb-campo",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enlace de donación o apoyo" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	value: donacion,
																	onChange: (e) => setDonacion(e.target.value),
																	placeholder: "https://patreon.com/…"
																})
															]
														})
													]
												})
											]
										}),
										/* Botón Directo para Publicar */
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-publicar-accion",
											children: [
												progreso ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-progreso-caja",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner sm" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: progreso })
													]
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-btns-pie",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn",
															onClick: () => editar ? onSalir?.() : setPaso(1),
															children: "‹ " + (editar ? "Cancelar" : "Cambiar libro")
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn primary pb-btn-publicar",
															disabled: !titulo.trim() || !autor.trim() || publicando,
															onClick: publicar,
															children: publicando ? "Publicando…" : (editar ? "💾 Guardar cambios" : "🚀 Publicar en Lumen Store")
														})
													]
												})
											]
										})
									]
								})
							)
						)
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
