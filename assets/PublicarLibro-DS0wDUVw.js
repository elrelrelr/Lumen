import { t as require_react } from "./react-1WJTggxS.js";
import { f as getAllPages, r as allBooks, h as getMeta, y as highlightsByBook, x as notesByBook } from "./db-Ii3ipPL7.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime, z as subirAGoFile, f as isPremium } from "./index-DX181kQz.js";
import { n as getOriginal } from "./originals-D2DFW8Gx.js";
import { eventoDeLibro, generarFacehashUri, generarIdentidad, guardarIdentidad, identidadGuardada, npubCorto, publicarEnRelays } from "./nostr-zC6Qsl2z.js";
import { o as guardarBlobLumen, s as guardarPublicado, u as obtenerBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { onTorrent } from "./torrent-DS6cTKT6.js";
import { construirLumen, construirLumenPersonal, construirLumenConOriginal, dividirEnCapitulos, portadaSvg } from "./lumenbook-D1rmZfn6.js";
import { abrirEnlace, copiarTexto } from "./NostrAjustes-CIgc9tj_.js";
//#region src/components/PublicarLibro.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIAS = [
	"ficción",
	"romance",
	"política",
	"desarrollo-personal",
	"ciencia",
	"historia",
	"filosofía",
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
var ESCENAS_MUSICA = [
	{ id: "lluvia", nombre: "🌧️ Lluvia suave" },
	{ id: "real-piano", nombre: "🎹 Piano relajante" },
	{ id: "real-lofi", nombre: "🎧 Lo-fi beats" },
	{ id: "bosque", nombre: "🌲 Bosque nocturno" },
	{ id: "oceano", nombre: "🌊 Olas del mar" },
	{ id: "cafeteria", nombre: "☕ Cafetería" },
	{ id: "fogata", nombre: "🔥 Fogata cálida" },
	{ id: "templo", nombre: "🏯 Templo Zen" },
	{ id: "brisa", nombre: "🍃 Brisa suave" },
	{ id: "real-techno", nombre: "🎛️ Techno suave" }
];
var FONDOS_ANIMADOS_OPTS = [
	{ id: "", nombre: "Ninguno (Estático)" },
	{ id: "aurora", nombre: "🌌 Aurora boreal" },
	{ id: "nebulosa", nombre: "✨ Nebulosa espacial" },
	{ id: "ondas", nombre: "🌊 Ondas lentas" },
	{ id: "particulas", nombre: "🌟 Partículas flotantes" },
	{ id: "lluvia", nombre: "🌧️ Gotas de lluvia" },
	{ id: "brasa", nombre: "🔥 Brasa cálida" },
	{ id: "matrix", nombre: "💻 Código Matrix" },
	{ id: "respirar", nombre: "🧘 Pulso respiración" }
];
var TIPOGRAFIAS_OPTS = [
	{ id: "serif", nombre: "Serif (Georgia clásica)" },
	{ id: "sans", nombre: "Sans (Inter moderna)" },
	{ id: "dyslexic", nombre: "Alta legibilidad" },
	{ id: "mono", nombre: "Monoespaciada" },
	{ id: "lectura", nombre: "👑 Lectura editorial (Prem)" },
	{ id: "humanista", nombre: "👑 Humanista suave (Prem)" },
	{ id: "merriweather", nombre: "👑 Merriweather Pro (Prem)" },
	{ id: "lora", nombre: "👑 Lora literaria (Prem)" }
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
function TutorialCrearLibro({ onCerrar, onIrAEditor }) {
	const [paso, setPaso] = (0, import_react.useState)(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bc-tut-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bc-tut-pills",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `bc-tut-pill ${paso === 1 ? "activa" : ""}`,
						onClick: () => setPaso(1),
						children: ["✍️ 1. Crear"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `bc-tut-pill ${paso === 2 ? "activa" : ""}`,
						onClick: () => setPaso(2),
						children: ["🚀 2. Publicar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `bc-tut-pill ${paso === 3 ? "activa" : ""}`,
						onClick: () => setPaso(3),
						children: ["🌐 3. Compartir"]
					})
				]
			}),
			paso === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bc-tut-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-card-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bc-tut-card-ic", children: "✍️" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-badge", children: "Paso 1 de 3 · Creación" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "¿Cómo se crea un libro?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Lumen te ofrece múltiples métodos para comenzar o digitalizar tus textos:" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-items",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "✏️" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Escribe en el editor enriquecido: " }),
											"Redacta con soporte Markdown para títulos (#), negritas (**), cursivas y listas, con contador de palabras y páginas en tiempo real."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "🎙️" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Voz, cámara y portapapeles: " }),
											"Dicta con tu voz mediante el micrófono, captura hojas impresas con la cámara para extraer texto por OCR, o pega texto copiado."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "📎" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Importa un archivo existente: " }),
											"Sube documentos en .epub, .pdf, .docx, .txt, .md, .fb2 o .lumen y se transformarán al instante en un libro listo para leer."
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-illus",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-tit", children: "⚡ Flujo de Creación" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-illus-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "1. Redacta o importa" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#7c5cff" }, children: "→" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "2. Formato y título" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#7c5cff" }, children: "→" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", style: { background: "#7c5cff", color: "#fff" }, children: "3. Pulsar «Crear libro»" })
								]
							})
						]
					})
				]
			}),
			paso === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bc-tut-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-card-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bc-tut-card-ic", children: "🚀" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-badge", children: "Paso 2 de 3 · Publicación" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "¿Cómo se publica en la comunidad?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Al terminar de redactar o desde «Publicar libro», configuras tu obra con total privacidad:" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-items",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "🏷️" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ficha, seudónimo y portada: " }),
											"Define título, autor anónimo o alias, sinopsis y sube tu propia imagen de portada o genera un diseño automático."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "✨" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Personalizaciones a compartir: " }),
											"Elige con las casillas si incluir música ambiental y volumen (con canciones locales), capítulos divididos, resaltados y diseño de lectura."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "📦" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Decisión inteligente de formato: " }),
											"Si no marcas casillas, se publica en su formato original (.epub, .pdf, .docx, .txt). Si marcas alguna, se empaqueta automáticamente como LumenBook (.lumen)."
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-illus",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-tit", children: "📦 Selector Granular de Metadatos" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-illus-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "☑️ Música y volumen" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "☑️ Capítulos" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "☑️ Notas & Resaltados" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", style: { background: "rgba(16, 185, 129, 0.2)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.4)" }, children: "✓ Empaquetado .lumen listo" })
								]
							})
						]
					})
				]
			}),
			paso === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bc-tut-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-card-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bc-tut-card-ic", children: "🌐" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-badge", children: "Paso 3 de 3 · Compartir" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "¿Cómo se comparte una vez publicado?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Al publicarse, Lumen te proporciona canales inmediatos y descentralizados:" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-items",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "🔗" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Enlace directo de Lumen: " }),
											"Copia el enlace único (lumenreader://b/... o enlace web) y envíalo por WhatsApp, Telegram o redes; quien lo toque abrirá el libro de inmediato."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "📱" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Código QR instantáneo: " }),
											"Muestra el QR en tu pantalla para que cualquier persona a tu alrededor lo escanee con la cámara de su móvil y comience a leer al instante."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-item-ic", children: "⚡" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Nostr, Lumen Storage y Torrent: " }),
											"Tu libro se replica en relays globales y queda alojado 24/7 en almacenamiento P2P, disponible en la Lumen Store sin censura ni servidores centrales."
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-illus",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-tit", children: "📲 Canales de Difusión" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bc-tut-illus-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "🔗 Link corto Lumen" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "📷 Código QR interactivo" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "🟢 Lumen Storage 24/7" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-illus-chip", children: "📡 Red Nostr" })
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bc-tut-nav",
				children: [
					paso > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost sm",
						onClick: () => setPaso(paso - 1),
						children: "← Anterior"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bc-tut-nav-dots",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bc-tut-dot ${paso === 1 ? "activa" : ""}`, onClick: () => setPaso(1) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bc-tut-dot ${paso === 2 ? "activa" : ""}`, onClick: () => setPaso(2) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bc-tut-dot ${paso === 3 ? "activa" : ""}`, onClick: () => setPaso(3) })
						]
					}),
					paso < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary sm",
						onClick: () => setPaso(paso + 1),
						children: "Siguiente →"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary sm",
						onClick: () => onCerrar?.(),
						children: "¡Comenzar! 🚀"
					})
				]
			})
		]
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
	const [tutAbierto, setTutAbierto] = (0, import_react.useState)(false);

	// Selección granular de metadatos para publicar (.lumen vs original)
	const [compartirMusica, setCompartirMusica] = (0, import_react.useState)(false);
	const [compartirCapitulos, setCompartirCapitulos] = (0, import_react.useState)(false);
	const [compartirResaltados, setCompartirResaltados] = (0, import_react.useState)(false);
	const [compartirDiseno, setCompartirDiseno] = (0, import_react.useState)(false);

	const [musicaEscena, setMusicaEscena] = (0, import_react.useState)("lluvia");
	const [musicaVolumen, setMusicaVolumen] = (0, import_react.useState)(0.35);
	const [cancionesLocales, setCancionesLocales] = (0, import_react.useState)([]);

	const [disenoTipografia, setDisenoTipografia] = (0, import_react.useState)("serif");
	const [disenoTamano, setDisenoTamano] = (0, import_react.useState)(18);
	const [disenoInterlineado, setDisenoInterlineado] = (0, import_react.useState)(1.7);
	const [disenoFondoAnimado, setDisenoFondoAnimado] = (0, import_react.useState)("");

	const [resaltadosCount, setResaltadosCount] = (0, import_react.useState)(0);
	const [notasCount, setNotasCount] = (0, import_react.useState)(0);

	const tienePersonalizaciones = compartirMusica || compartirCapitulos || compartirResaltados || compartirDiseno;

	const formatoOriginalExt = (0, import_react.useMemo)(() => {
		if (fuente?.tipo === "archivo" && fuente.file?.name) {
			return (fuente.file.name.split(".").pop() || "txt").toLowerCase();
		}
		if (fuente?.tipo === "local" && fuente.libro) {
			if (fuente.libro.kind === "pdf") return "pdf";
			if (fuente.libro.kind === "epub") return "epub";
			const ext = (fuente.libro.fileName || "").split(".").pop().toLowerCase();
			if (ext && ext.length <= 5) return ext;
			return "epub";
		}
		return "txt";
	}, [fuente]);

	const agregarCancionLocal = (e) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;
		const nuevas = files.map((f) => ({
			name: f.name.replace(/[^\w\s.-]/gi, "_"),
			file: f,
			size: (f.size / (1024 * 1024)).toFixed(1) + " MB"
		}));
		setCancionesLocales((prev) => [...prev, ...nuevas]);
		setCompartirMusica(true);
		toast(`🎵 ${files.length} canción(es) local(es) para empaquetar en el .lumen`);
		e.target.value = "";
	};

	const quitarCancionLocal = (index) => {
		setCancionesLocales((prev) => prev.filter((_, i) => i !== index));
		toast("Canción local retirada");
	};

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
		avatarUri,
		compartirMusica,
		compartirCapitulos,
		compartirResaltados,
		compartirDiseno,
		musicaEscena,
		musicaVolumen,
		cancionesLocales,
		disenoTipografia,
		disenoTamano,
		disenoInterlineado,
		disenoFondoAnimado,
		fuente
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
				if (b.musicScene) setMusicaEscena(b.musicScene);
				if (b.musicVolume != null) setMusicaVolumen(b.musicVolume);
				if (b.fondoAnimado) setDisenoFondoAnimado(b.fondoAnimado);
				if (b.fontFamily) setDisenoTipografia(b.fontFamily);
				if (b.fontSize) setDisenoTamano(b.fontSize);
				if (b.lineHeight) setDisenoInterlineado(b.lineHeight);
			}
			const hl = await highlightsByBook(id).catch(() => []);
			const nt = await notesByBook(id).catch(() => []);
			setResaltadosCount(hl?.length || 0);
			setNotasCount(nt?.length || 0);
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
			setFuente({ tipo: "archivo", nombre: file.name, file });
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
			const dTag = dTagRef.current || ((editar && editar.d) ? editar.d : `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`);
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
			let resultados = [];
			try {
				resultados = await publicarEnRelays(ev, 10000);
			} catch (eRel) {
				console.warn("[relays publicación offline fallback]", eRel);
			}
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
				enInternet: ok > 0,
				estadoRelays: resultados.map((r) => ({
					url: r.url,
					ok: r.ok,
					detalle: r.detalle || ""
				})),
				_accion: editar ? (ok > 0 ? `Editado (${ok}/${resultados.length} relays ok)` : "Editado (guardado localmente)") : (ok > 0 ? `Publicado (${ok}/${resultados.length} relays ok)` : "Guardado localmente (reintentará al conectar)")
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
			const {
				titulo, autor, categoria, idioma, descripcion, donacion, zap, portada, capsFuente,
				compartirMusica, compartirCapitulos, compartirResaltados, compartirDiseno,
				musicaEscena, musicaVolumen, cancionesLocales,
				disenoTipografia, disenoTamano, disenoInterlineado, disenoFondoAnimado,
				fuente
			} = datosRef.current;

			let blob = null;
			let nombre = "";
			const extraArchivos = {};
			const tienePers = compartirMusica || compartirCapitulos || compartirResaltados || compartirDiseno;

			if (!tienePers) {
				// CASO: NINGUNA CASILLA MARCADA -> SE PUBLICA EN EL FORMATO ORIGINAL
				setProgreso(`Preparando libro en su formato original (.${formatoOriginalExt})…`);
				if (fuente?.tipo === "archivo" && fuente.file) {
					blob = fuente.file;
					nombre = fuente.file.name;
				} else if (fuente?.tipo === "local") {
					let origBlob = null;
					if (fuente.libro?.hasOriginal) {
						origBlob = await getOriginal(fuente.id).catch(() => null);
					}
					if (origBlob) {
						blob = origBlob;
						nombre = `${(titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim()}.${formatoOriginalExt}`;
					} else {
						const txtCompleto = (capsFuente || []).join("\n\n");
						blob = new Blob([txtCompleto], { type: "text/plain;charset=utf-8" });
						nombre = `${(titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim()}.txt`;
					}
				} else {
					const txtCompleto = (capsFuente || []).join("\n\n");
					blob = new Blob([txtCompleto], { type: "text/plain;charset=utf-8" });
					nombre = `${(titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim()}.txt`;
				}
			} else {
				// CASO: MARCA ALGUNA O TODAS LAS CASILLAS -> EMPAQUETAR Y PUBLICAR .LUMEN
				setProgreso("Empaquetando formato LumenBook (.lumen) con personalizaciones…");
				const personal = {
					version: 1,
					app: "lumen",
					creado: Math.floor(Date.now() / 1e3),
					book: {
						title: fuente?.libro?.title || titulo
					}
				};

				if (compartirMusica) {
					personal.musica = {
						scene: musicaEscena,
						volume: musicaVolumen,
						onOpen: true,
						tracks: (cancionesLocales || []).map((c, i) => ({
							id: "local-" + i,
							nombre: c.name,
							ruta: "audio/" + c.name
						}))
					};
					personal.book.musicScene = musicaEscena;
					personal.book.musicVolume = musicaVolumen;
					personal.book.musicOnOpen = true;

					for (let i = 0; i < (cancionesLocales || []).length; i++) {
						const cFile = cancionesLocales[i].file;
						if (cFile) {
							const u8 = new Uint8Array(await cFile.arrayBuffer());
							extraArchivos["audio/" + cancionesLocales[i].name] = u8;
						}
					}
				}

				if (compartirCapitulos) {
					personal.capitulos = (capsFuente || []).map((c, i) => ({
						indice: i,
						titulo: `Capítulo ${i + 1}`
					}));
				}

				if (compartirResaltados) {
					let hl = [];
					let nt = [];
					if (fuente?.tipo === "local" && fuente.id) {
						hl = await highlightsByBook(fuente.id).catch(() => []);
						nt = await notesByBook(fuente.id).catch(() => []);
					}
					personal.highlights = hl || [];
					personal.notes = nt || [];
				}

				if (compartirDiseno) {
					const esGratis = ["serif", "sans", "dyslexic", "mono"].includes(disenoTipografia);
					const famSegura = (!esGratis && !isPremium()) ? "serif" : disenoTipografia;
					personal.ajustesTexto = {
						fontSize: disenoTamano,
						fontFamily: famSegura,
						lineHeight: disenoInterlineado
					};
					personal.book.fontFamily = famSegura;
					personal.book.fontSize = disenoTamano;
					personal.book.lineHeight = disenoInterlineado;

					if (disenoFondoAnimado) {
						personal.fondoAnimado = disenoFondoAnimado;
						personal.book.fondoAnimado = disenoFondoAnimado;
					}
					if (fuente?.libro?.fondo) {
						personal.fondo = fuente.libro.fondo;
						personal.book.fondo = fuente.libro.fondo;
					}
					if (fuente?.libro?.fondoVelo != null) personal.book.fondoVelo = fuente.libro.fondoVelo;
					if (fuente?.libro?.fondoBlur != null) personal.book.fondoBlur = fuente.libro.fondoBlur;
					const ft = (fuente?.tipo === "local" && fuente.id) ? await getMeta("fondoTema_" + fuente.id, null).catch(() => null) : null;
					if (ft && ft.usar) personal.fondoTema = ft;
				}

				const metaBase = {
					titulo,
					autor,
					categoria,
					idioma,
					descripcion,
					ad: null,
					donacion,
					zap
				};

				const original = (fuente?.tipo === "local" && fuente.libro?.hasOriginal) ? await getOriginal(fuente.id).catch(() => null) : null;
				if (fuente?.libro?.kind === "pdf" && original) {
					const lb = await construirLumenConOriginal(metaBase, original, "original.pdf", personal, extraArchivos);
					blob = lb.blob;
				} else if ((fuente?.libro?.kind === "image" || fuente?.libro?.esComic) && original) {
					const lb = await construirLumenConOriginal(metaBase, original, "original.cbz", personal, extraArchivos);
					blob = lb.blob;
				} else {
					const capsParaLumen = compartirCapitulos ? capsFuente : [(capsFuente || []).join("\n\n") || descripcion || titulo];
					const lb = await construirLumenPersonal(metaBase, capsParaLumen.length ? capsParaLumen : [descripcion || titulo], portada || null, personal, extraArchivos);
					blob = lb.blob;
				}
				nombre = `${(titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim()}.lumen`;
			}

			const dTag = (editar && editar.d) ? editar.d : `${(titulo || "libro").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
			dTagRef.current = dTag;
			await guardarBlobLumen(dTag, blob);
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bc-tut-banner",
										onClick: () => setTutAbierto(!tutAbierto),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-banner-ic", children: "💡" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bc-tut-banner-txt",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tutorial ilustrado: Cómo Crear, Publicar y Compartir" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Aprende el flujo de 3 pasos: redacción, metadatos y canales de difusión." })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "btn sm ghost",
												children: tutAbierto ? "Ocultar guía" : "Ver tutorial"
											})
										]
									}),
									tutAbierto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialCrearLibro, {
										onCerrar: () => setTutAbierto(false),
										onIrAEditor: () => setTutAbierto(false)
									}) : null,
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bc-tut-banner",
											onClick: () => setTutAbierto(!tutAbierto),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bc-tut-banner-ic", children: "💡" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bc-tut-banner-txt",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tutorial ilustrado: Cómo Crear, Publicar y Compartir" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Aprende el flujo de 3 pasos: redacción, metadatos y canales de difusión." })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "btn sm ghost",
													children: tutAbierto ? "Ocultar guía" : "Ver tutorial"
												})
											]
										}),
										tutAbierto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialCrearLibro, {
											onCerrar: () => setTutAbierto(false),
											onIrAEditor: () => setTutAbierto(false)
										}) : null,
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
										/* Selector Granular de Metadatos y Formato de Publicación (.lumen vs original) */
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pb-meta-seccion",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pb-meta-titulo-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "pb-campo-tit",
															children: "✨ Personalizaciones y metadatos a publicar"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
															className: "pb-meta-subtit",
															children: [
																"Elige qué metadatos compartir. Si no marcas ninguno, se publica en el ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: `formato original (.${formatoOriginalExt})` }),
																"; si marcas una o varias casillas, se empaqueta como ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: ".lumen" }),
																"."
															]
														})
													]
												}),
												/* 1. Música y Volumen */
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `pb-meta-tarjeta ${compartirMusica ? "activa" : ""}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-meta-cabecera",
															onClick: () => setCompartirMusica(!compartirMusica),
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	className: "pb-meta-check-label",
																	onClick: (e) => e.stopPropagation(),
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "checkbox",
																		className: "pb-meta-checkbox",
																		checked: compartirMusica,
																		onChange: (e) => setCompartirMusica(e.target.checked)
																	})
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-meta-info-txt",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "pb-meta-tit",
																			children: "🎵 Música ambiental y volumen"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "pb-meta-desc",
																			children: "Pistas sonoras inmersivas, volumen y canciones locales embebidas"
																		})
																	]
																}),
																cancionesLocales.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "pb-meta-badge",
																	children: [cancionesLocales.length, " local", cancionesLocales.length > 1 ? "es" : ""]
																}) : null
															]
														}),
														compartirMusica ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-meta-expandido",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-fila",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pista ambiental" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																					value: musicaEscena,
																					onChange: (e) => setMusicaEscena(e.target.value),
																					children: ESCENAS_MUSICA.map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: sc.id,
																						children: sc.nombre
																					}, sc.id))
																				})
																			]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					children: ["Volumen: ", Math.round(musicaVolumen * 100), "%"]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																					type: "range",
																					min: "0.05",
																					max: "1",
																					step: "0.05",
																					value: musicaVolumen,
																					onChange: (e) => setMusicaVolumen(parseFloat(e.target.value))
																				})
																			]
																		})
																	]
																}),
																/* Bloque de canciones locales */
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-musica-local-bloque",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "pb-musica-local-head",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																					className: "pb-campo-subtit",
																					children: "Canciones locales (se empaquetan en el .lumen)"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																					className: "btn ghost sm pb-btn-audio",
																					children: [
																						"➕ Agregar canción",
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "file",
																							accept: "audio/*",
																							multiple: true,
																							style: { display: "none" },
																							onChange: agregarCancionLocal
																						})
																					]
																				})
																			]
																		}),
																		cancionesLocales.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "pb-canciones-lista",
																			children: cancionesLocales.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																				className: "pb-cancion-item",
																				children: [
																					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																						className: "pb-cancion-nombre",
																						children: ["🎶 ", c.name, " (", c.size, ")"]
																					}),
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																						type: "button",
																						className: "pb-cancion-del",
																						onClick: () => quitarCancionLocal(i),
																						title: "Quitar pista",
																						children: "✕"
																					})
																				]
																			}, i))
																		}) : null
																	]
																})
															]
														}) : null
													]
												}),
												/* 2. Capítulos */
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `pb-meta-tarjeta ${compartirCapitulos ? "activa" : ""}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "pb-meta-cabecera",
														onClick: () => setCompartirCapitulos(!compartirCapitulos),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "pb-meta-check-label",
																onClick: (e) => e.stopPropagation(),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	type: "checkbox",
																	className: "pb-meta-checkbox",
																	checked: compartirCapitulos,
																	onChange: (e) => setCompartirCapitulos(e.target.checked)
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "pb-meta-info-txt",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "pb-meta-tit",
																		children: "📑 Capítulos y estructura"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "pb-meta-desc",
																		children: "Compartir la división organizada por capítulos"
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "pb-meta-badge",
																children: [capsFuente.length, " cap", capsFuente.length === 1 ? "" : "s"]
															})
														]
													})
												}),
												/* 3. Resaltados y Notas */
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `pb-meta-tarjeta ${compartirResaltados ? "activa" : ""}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "pb-meta-cabecera",
														onClick: () => setCompartirResaltados(!compartirResaltados),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "pb-meta-check-label",
																onClick: (e) => e.stopPropagation(),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																	type: "checkbox",
																	className: "pb-meta-checkbox",
																	checked: compartirResaltados,
																	onChange: (e) => setCompartirResaltados(e.target.checked)
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "pb-meta-info-txt",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "pb-meta-tit",
																		children: "🖍️ Resaltados y notas"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "pb-meta-desc",
																		children: "Compartir todos los tipos de resaltados de colores y notas"
																	})
																]
															}),
															(resaltadosCount > 0 || notasCount > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "pb-meta-badge",
																children: [resaltadosCount, " res · ", notasCount, " notas"]
															}) : null
														]
													})
												}),
												/* 4. Ajustes de Lectura y Fondos */
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `pb-meta-tarjeta ${compartirDiseno ? "activa" : ""}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-meta-cabecera",
															onClick: () => setCompartirDiseno(!compartirDiseno),
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	className: "pb-meta-check-label",
																	onClick: (e) => e.stopPropagation(),
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "checkbox",
																		className: "pb-meta-checkbox",
																		checked: compartirDiseno,
																		onChange: (e) => setCompartirDiseno(e.target.checked)
																	})
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-meta-info-txt",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "pb-meta-tit",
																			children: "🎨 Ajustes de lectura y fondos"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "pb-meta-desc",
																			children: "Tipografía, tamaño de texto, interlineado, fondo y fondo animado"
																		})
																	]
																})
															]
														}),
														compartirDiseno ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-meta-expandido",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-fila",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tipografía" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																					value: disenoTipografia,
																					onChange: (e) => setDisenoTipografia(e.target.value),
																					children: TIPOGRAFIAS_OPTS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: f.id,
																						children: f.nombre
																					}, f.id))
																				})
																			]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fondo animado" }),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																					value: disenoFondoAnimado,
																					onChange: (e) => setDisenoFondoAnimado(e.target.value),
																					children: FONDOS_ANIMADOS_OPTS.map((fa) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																						value: fa.id,
																						children: fa.nombre
																					}, fa.id))
																				})
																			]
																		})
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-fila",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					children: ["Tamaño: ", disenoTamano, "px"]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																					type: "range",
																					min: "14",
																					max: "28",
																					step: "1",
																					value: disenoTamano,
																					onChange: (e) => setDisenoTamano(parseInt(e.target.value, 10))
																				})
																			]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																			className: "pb-campo",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																					children: ["Interlineado: ", disenoInterlineado]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																					type: "range",
																					min: "1.3",
																					max: "2.4",
																					step: "0.1",
																					value: disenoInterlineado,
																					onChange: (e) => setDisenoInterlineado(parseFloat(e.target.value))
																				})
																			]
																		})
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
																	className: "pb-meta-nota-prem",
																	children: "ℹ️ Si eliges una tipografía premium, los lectores sin suscripción la verán con la tipografía por defecto (Georgia/Serif)."
																})
															]
														}) : null
													]
												}),
												/* Indicador Dinámico de Formato Resultante */
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `pb-formato-caja ${tienePersonalizaciones ? "pb-formato-lumen" : "pb-formato-orig"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "pb-formato-icono",
															children: tienePersonalizaciones ? "📦" : "📄"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pb-formato-cuerpo",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pb-formato-tit",
																	children: tienePersonalizaciones ? "Formato resultante: LumenBook (.lumen)" : `Formato resultante: Original (.${formatoOriginalExt})`
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pb-formato-desc",
																	children: tienePersonalizaciones
																		? "Se empaquetará en un archivo .lumen (ZIP versátil) incluyendo las personalizaciones marcadas:"
																		: `No has seleccionado personalizaciones. El libro se publicará directamente en su formato original de archivo (.${formatoOriginalExt}).`
																}),
																tienePersonalizaciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "pb-formato-chips",
																	children: [
																		compartirMusica ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "pb-chip-inc",
																			children: ["🎵 Música y volumen", cancionesLocales.length > 0 ? ` (${cancionesLocales.length} locales)` : ` (${musicaEscena})`]
																		}) : null,
																		compartirCapitulos ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "pb-chip-inc",
																			children: ["📑 ", capsFuente.length, " Capítulos"]
																		}) : null,
																		compartirResaltados ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "pb-chip-inc",
																			children: "🖍️ Resaltados y notas"
																		}) : null,
																		compartirDiseno ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "pb-chip-inc",
																			children: ["🎨 Lectura (", disenoTipografia, disenoFondoAnimado ? ` · ${disenoFondoAnimado}` : "", ")"]
																		}) : null
																	]
																}) : null
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
