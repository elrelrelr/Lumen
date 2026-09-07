import { t as require_react } from "./react-1WJTggxS.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
//#region src/lib/archivos.js
var import_react = require_react();
var puente = () => typeof window !== "undefined" && window.AndroidArchivos ? window.AndroidArchivos : null;
var exploradorDisponible = () => !!puente();
function hayPermisoArchivos() {
	const b = puente();
	if (!b?.hayPermiso) return true;
	try {
		return !!b.hayPermiso();
	} catch {
		return false;
	}
}
/** Pide el permiso. Resuelve a true/false cuando el usuario decide. */
function pedirPermisoArchivos() {
	const b = puente();
	if (!b?.pedirPermiso) return Promise.resolve(true);
	return new Promise((resolver) => {
		let resuelto = false;
		window.__lumenPermisoArchivos = (ok) => {
			if (resuelto) return;
			resuelto = true;
			try {
				delete window.__lumenPermisoArchivos;
			} catch {}
			resolver(!!ok);
		};
		try {
			b.pedirPermiso();
		} catch {
			resolver(false);
		}
		setTimeout(() => {
			if (resuelto) return;
			resuelto = true;
			resolver(hayPermisoArchivos());
		}, 3e4);
	});
}
/** Contenido de una carpeta: { ruta, padre, carpetas[], ficheros[] }. */
function listarCarpeta(ruta = "") {
	const b = puente();
	if (!b?.listarCarpeta) return {
		ruta: "",
		padre: "",
		carpetas: [],
		ficheros: []
	};
	try {
		const r = JSON.parse(b.listarCarpeta(ruta) || "{}");
		return {
			ruta: r.ruta || "",
			padre: r.padre || "",
			carpetas: Array.isArray(r.carpetas) ? r.carpetas : [],
			ficheros: Array.isArray(r.ficheros) ? r.ficheros : []
		};
	} catch (e) {
		console.warn("[archivos] carpeta", e?.message || e);
		return {
			ruta: "",
			padre: "",
			carpetas: [],
			ficheros: []
		};
	}
}
/** Almacenamiento interno y tarjetas SD. */
function raicesArchivos() {
	const b = puente();
	if (!b?.raices) return [];
	try {
		const l = JSON.parse(b.raices() || "[]");
		return Array.isArray(l) ? l : [];
	} catch {
		return [];
	}
}
/** Libros encontrados en el teléfono. `forzar` salta la caché de Java. */
function listarArchivos(forzar = false) {
	const b = puente();
	if (!b) return [];
	try {
		const l = JSON.parse(b.listar(!!forzar) || "[]");
		if (!Array.isArray(l)) return [];
		return l.sort((a, b2) => (b2.at || 0) - (a.at || 0));
	} catch (e) {
		console.warn("[archivos]", e?.message || e);
		return [];
	}
}
/**
* Trae un archivo del teléfono como objeto `File`.
* Por trozos de 1 MB: un PDF grande en un solo base64 agota la memoria.
*/
async function traerArchivo(ruta, nombre, alProgreso) {
	const b = puente();
	if (!b) throw new Error("Sólo disponible en la aplicación instalada");
	const total = Number(b.tamano(ruta)) || 0;
	if (total <= 0) throw new Error("El archivo ya no está donde estaba");
	const TROZO = 1024 * 1024;
	const partes = [];
	for (let pos = 0; pos < total; pos += TROZO) {
		const b64 = b.leer(ruta, pos, Math.min(TROZO, total - pos));
		if (!b64) break;
		const bin = atob(b64);
		const arr = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
		partes.push(arr);
		alProgreso?.(Math.min(100, Math.round((pos + TROZO) / total * 100)));
	}
	return new File(partes, nombre, { type: "application/octet-stream" });
}
var tam = (n) => {
	const x = Number(n) || 0;
	if (x < 1024) return x + " B";
	if (x < 1048576) return (x / 1024).toFixed(0) + " KB";
	if (x < 1073741824) return (x / 1048576).toFixed(1) + " MB";
	return (x / 1073741824).toFixed(2) + " GB";
};
if (typeof window !== "undefined") window.__lumenArchivos = {
	listarArchivos,
	traerArchivo,
	exploradorDisponible,
	tam,
	hayPermisoArchivos,
	pedirPermisoArchivos,
	listarCarpeta,
	raicesArchivos
};
//#endregion
//#region src/lib/autoDetectar.js
var FORMATOS = [
	{
		ext: "pdf",
		label: "PDF",
		icon: "📕"
	},
	{
		ext: "docx",
		label: "Word",
		icon: "📘"
	},
	{
		ext: "doc",
		label: "Word (doc)",
		icon: "📘"
	},
	{
		ext: "epub",
		label: "EPUB",
		icon: "📗"
	},
	{
		ext: "txt",
		label: "TXT",
		icon: "📄"
	},
	{
		ext: "md",
		label: "Markdown",
		icon: "📝"
	},
	{
		ext: "lumen",
		label: "Lumen",
		icon: "💡"
	},
	{
		ext: "fb2",
		label: "FB2",
		icon: "📗"
	},
	{
		ext: "mobi",
		label: "MOBI",
		icon: "📗"
	},
	{
		ext: "rtf",
		label: "RTF",
		icon: "📄"
	},
	{
		ext: "html",
		label: "HTML",
		icon: "🌐"
	},
	{
		ext: "srt",
		label: "Subtítulos",
		icon: "💬"
	}
];
var EXT_ACEPTADAS = /\.(pdf|docx?|epub|txt|md|markdown|fb2|html?|rtf|mobi|azw3?|cbz|cbr|djvu|srt|lumen)$/i;
var extensionDe = (nombre = "") => {
	const m = /\.([a-z0-9]+)$/i.exec(String(nombre));
	return m ? m[1].toLowerCase() : "";
};
/** ¿Este nombre pasa el filtro de formatos marcados? `filtros` vacío = todos. */
var pasaFiltro = (nombre, filtros) => {
	if (!filtros || filtros.size === 0) return true;
	const ext = extensionDe(nombre);
	if (!ext) return false;
	if (ext === "markdown") return filtros.has("md");
	if (ext === "azw") return filtros.has("mobi");
	if (ext === "htm") return filtros.has("html");
	return filtros.has(ext);
};
/** Cuenta los archivos por formato: { pdf: 3, epub: 1, ... }. */
function contarPorFormato(lista) {
	const c = {};
	for (const f of lista) {
		const ext = extensionDe(f?.nombre || f?.name || "");
		if (!ext) continue;
		c[ext] = (c[ext] || 0) + 1;
	}
	return c;
}
var carpetaPickerSoportado = () => typeof window !== "undefined" && !!window.showDirectoryPicker;
function elegirCarpetaWebkit(acceptRe = EXT_ACEPTADAS, filtros = null) {
	return new Promise((resolver) => {
		const inp = document.createElement("input");
		inp.type = "file";
		inp.webkitdirectory = true;
		inp.multiple = true;
		inp.onchange = () => {
			resolver(Array.from(inp.files || []).filter((f) => acceptRe.test(f.name) && pasaFiltro(f.name, filtros)));
		};
		inp.oncancel = () => resolver(null);
		inp.click();
	});
}
/**
* Recorre una carpeta elegida con el selector del sistema (PC) y devuelve
* los documentos que coinciden con el filtro. Recursivo, con un tope para
* no atascarse en carpetas gigantes (p. ej. toda la carpeta de usuario).
* `onProgreso({ encontrados, escaneados })` avisa en vivo.
*/
async function elegirCarpetaPC({ filtros = null, onProgreso } = {}) {
	if (!carpetaPickerSoportado()) {
		const err = /* @__PURE__ */ new Error("Este navegador no permite elegir carpetas");
		err.codigo = "no-soportado";
		throw err;
	}
	let dir;
	try {
		dir = await window.showDirectoryPicker({ mode: "read" });
	} catch (e) {
		if (e?.name === "AbortError") return null;
		throw e;
	}
	const archivos = [];
	let escaneados = 0;
	const TOPE_ARCHIVOS = 2e3;
	const TOPE_PROFUNDIDAD = 12;
	const recorrer = async (manejador, profundidad) => {
		if (archivos.length >= TOPE_ARCHIVOS || profundidad > TOPE_PROFUNDIDAD) return;
		for await (const entrada of manejador.values?.() ?? manejador.entries()) {
			if (archivos.length >= TOPE_ARCHIVOS) return;
			try {
				if (entrada.kind === "file") {
					escaneados++;
					if (EXT_ACEPTADAS.test(entrada.name) && pasaFiltro(entrada.name, filtros)) {
						const f = await entrada.getFile();
						archivos.push(f);
					}
				} else if (entrada.kind === "directory") await recorrer(entrada, profundidad + 1);
			} catch {}
			onProgreso?.({
				encontrados: archivos.length,
				escaneados
			});
		}
	};
	await recorrer(dir, 0);
	return archivos;
}
//#endregion
//#region src/components/Archivos.jsx
var import_jsx_runtime = require_jsx_runtime();
function Archivos({ onSalir, onImportar, toast, yaImportados = [] }) {
	const [lista, setLista] = (0, import_react.useState)([]);
	const [cargando, setCargando] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [sel, setSel] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [progreso, setProgreso] = (0, import_react.useState)(null);
	const [extra, setExtra] = (0, import_react.useState)({});
	const [hay] = (0, import_react.useState)(() => exploradorDisponible());
	const [modo, setModo] = (0, import_react.useState)("auto");
	const [permiso, setPermiso] = (0, import_react.useState)(() => hayPermisoArchivos());
	const [carpeta, setCarpeta] = (0, import_react.useState)(null);
	const [raices, setRaices] = (0, import_react.useState)([]);
	const [filtros, setFiltros] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [carpetaBusca, setCarpetaBusca] = (0, import_react.useState)(null);
	usarPantallaAtras(() => onSalir?.(), () => {
		if (sel.size > 0) {
			setSel(/* @__PURE__ */ new Set());
			return true;
		}
		return false;
	});
	const cargar = (0, import_react.useCallback)(async (forzar = false) => {
		setCargando(true);
		await new Promise((r) => setTimeout(r, 30));
		try {
			setLista(listarArchivos(forzar));
		} finally {
			setCargando(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		cargar(false);
		setRaices(raicesArchivos());
	}, [cargar]);
	/** Abre una carpeta concreta. */
	const abrirCarpeta = (0, import_react.useCallback)((ruta) => {
		setCarpeta(listarCarpeta(ruta || ""));
	}, []);
	(0, import_react.useEffect)(() => {
		if (modo === "carpetas" && !carpeta) abrirCarpeta("");
	}, [
		modo,
		carpeta,
		abrirCarpeta
	]);
	const conocidos = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		for (const b of yaImportados || []) if (b?.fileName) s.add(String(b.fileName).toLowerCase());
		return s;
	}, [yaImportados]);
	const alternarFiltro = (ext) => {
		haptic.tap();
		setFiltros((s) => {
			const n = new Set(s);
			if (n.has(ext)) n.delete(ext);
			else n.add(ext);
			return n;
		});
	};
	const limpiarFiltros = () => {
		haptic.tap();
		setFiltros(/* @__PURE__ */ new Set());
	};
	const listaFiltrada = (0, import_react.useMemo)(() => lista.filter((f) => pasaFiltro(f.nombre, filtros)), [lista, filtros]);
	const visibles = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		if (!t) return listaFiltrada;
		return listaFiltrada.filter((f) => f.nombre.toLowerCase().includes(t) || String(f.carpeta || "").toLowerCase().includes(t));
	}, [listaFiltrada, q]);
	const carpetaFiltrada = (0, import_react.useMemo)(() => (carpeta?.ficheros || []).filter((f) => pasaFiltro(f.nombre, filtros)), [carpeta, filtros]);
	const alternar = (ruta) => {
		setSel((s) => {
			const n = new Set(s);
			if (n.has(ruta)) n.delete(ruta);
			else n.add(ruta);
			return n;
		});
	};
	const importarElegidos = async (elegidos) => {
		if (!elegidos.length) return 0;
		const nuevos = elegidos.filter((f) => !conocidos.has(f.nombre.toLowerCase()));
		if (!nuevos.length) {
			toast?.("Todos esos libros ya están en tu biblioteca");
			return 0;
		}
		setProgreso({
			hecho: 0,
			total: nuevos.length,
			nombre: ""
		});
		let ok = 0;
		for (let i = 0; i < nuevos.length; i++) {
			const f = nuevos[i];
			setProgreso({
				hecho: i,
				total: nuevos.length,
				nombre: f.nombre
			});
			try {
				const archivo = await traerArchivo(f.ruta, f.nombre);
				await onImportar?.([archivo]);
				ok++;
			} catch (e) {
				console.warn("[archivos] importar", f.nombre, e?.message || e);
			}
			await new Promise((r) => setTimeout(r, 120));
		}
		setProgreso(null);
		haptic.success();
		toast?.(`✓ ${ok} de ${nuevos.length} libro(s) importados`);
		return ok;
	};
	const importarSeleccion = async () => {
		const porRuta = /* @__PURE__ */ new Map();
		for (const f of lista) if (sel.has(f.ruta)) porRuta.set(f.ruta, f);
		for (const r of sel) if (!porRuta.has(r) && extra[r]) porRuta.set(r, extra[r]);
		const elegidos = [...porRuta.values()];
		await importarElegidos(elegidos);
		setSel(/* @__PURE__ */ new Set());
	};
	const importarTodos = async () => {
		const nuevos = listaFiltrada.filter((f) => !conocidos.has(f.nombre.toLowerCase()));
		if (!nuevos.length) {
			toast?.("No hay documentos nuevos que importar");
			return;
		}
		await importarElegidos(nuevos);
		setSel(/* @__PURE__ */ new Set());
	};
	const elegirCarpeta = async () => {
		haptic.tap();
		setCarpetaBusca({
			escaneados: 0,
			encontrados: 0
		});
		let archivos = null;
		try {
			if (carpetaPickerSoportado()) archivos = await elegirCarpetaPC({
				filtros,
				onProgreso: (p) => setCarpetaBusca(p)
			});
			else archivos = await elegirCarpetaWebkit(EXT_ACEPTADAS, filtros);
		} catch (e) {
			setCarpetaBusca(null);
			toast?.(e?.message === "Este navegador no permite elegir carpetas" ? "Tu navegador no permite elegir carpetas: usa «Elegir archivos»" : "No se pudo leer la carpeta: " + (e?.message || e));
			return;
		} finally {
			if (!archivos) setCarpetaBusca(null);
		}
		if (!archivos) return;
		setCarpetaBusca(null);
		if (!archivos.length) {
			toast?.("No se encontraron documentos compatibles en esa carpeta");
			return;
		}
		toast?.(`Importando ${archivos.length} documento(s) de la carpeta…`);
		await onImportar?.(archivos);
		haptic.success();
		toast?.(`✓ ${archivos.length} documento(s) añadidos`);
	};
	const resumenFormatos = (0, import_react.useMemo)(() => contarPorFormato(listaFiltrada), [listaFiltrada]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "arch",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tp-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "icon-btn back",
						onClick: () => onSalir?.(),
						"aria-label": "Volver",
						children: "‹"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tp-titulo",
						children: "✨ Auto detectar documentos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "bp-desc-btn",
						"aria-label": "Volver a buscar",
						onClick: () => {
							cargar(true);
							toast?.("Buscando de nuevo…");
						},
						children: "↻"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tp-cuerpo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: {
							padding: "0 4px 10px",
							lineHeight: 1.5
						},
						children: hay ? "Lumen busca tus documentos en las carpetas de siempre (Descargas, Documentos, Telegram…) y los trae con un toque. Dale permiso para encontrarlos todos." : "En el navegador no se puede barrer todo el equipo: elige la carpeta donde guardas tus documentos y Lumen los trae de ahí (así no se tarda buscando en todo el PC)."
					}),
					!hay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-error",
						style: { marginBottom: 14 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sólo en la aplicación instalada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "El escaneo automático del teléfono lo hace la app instalada. Aquí puedes elegir archivos o una carpeta." })]
					}),
					hay && !permiso && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "arch-permiso",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "empty-emoji",
								children: "🔐"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lumen necesita permiso para ver tus documentos" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sin él, Android sólo deja ver la carpeta de la propia aplicación, y por eso la lista sale casi vacía. Es el mismo permiso que piden Word, WPS o Adobe para mostrar tus archivos." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								style: {
									width: "100%",
									marginTop: 10
								},
								onClick: async () => {
									const ok = await pedirPermisoArchivos();
									setPermiso(ok);
									if (ok) {
										await cargar(true);
										setRaices(raicesArchivos());
										if (modo === "carpetas") abrirCarpeta("");
										toast?.("Buscando tus documentos…");
									} else toast?.("Sin permiso sólo se ven los libros de Lumen");
								},
								children: "Dar permiso y buscar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "arch-permiso-alt",
								children: "También puedes traerlos con «Elegir archivos», que funciona sin permisos."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 8,
							marginBottom: 12,
							flexWrap: "wrap"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn sm",
							style: {
								flex: 1,
								minWidth: 150,
								fontSize: 13
							},
							onClick: () => {
								haptic.tap();
								const inp = document.createElement("input");
								inp.type = "file";
								inp.multiple = true;
								inp.accept = ".pdf,.epub,.mobi,.fb2,.txt,.md,.docx,.doc,.cbz,.cbr,.lumen,.rtf,.html,.srt,application/pdf,application/epub+zip,*/*";
								inp.onchange = async () => {
									const archivos = Array.from(inp.files || []);
									if (archivos.length > 0) {
										toast?.(`Importando ${archivos.length} archivo(s)…`);
										await onImportar?.(archivos);
									}
								};
								inp.click();
							},
							children: "📂 Elegir archivos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn sm",
							style: {
								flex: 1,
								minWidth: 150,
								fontSize: 13
							},
							onClick: elegirCarpeta,
							children: "📁 Elegir carpeta"
						})]
					}),
					carpetaBusca && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row-sub",
						style: { margin: "-6px 4px 10px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "spinner",
								style: {
									display: "inline-block",
									marginRight: 6,
									verticalAlign: -2
								}
							}),
							"Leyendo la carpeta… ",
							carpetaBusca.encontrados,
							" documento(s) encontrados"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: {
							margin: "2px 4px 6px",
							fontWeight: 700,
							color: "var(--fg)"
						},
						children: "Buscar por tipo de documento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chips",
						style: { marginBottom: 4 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip" + (filtros.size === 0 ? " on" : ""),
							onClick: limpiarFiltros,
							children: "☑ Todos"
						}), FORMATOS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip" + (filtros.has(f.ext) ? " on" : ""),
							onClick: () => alternarFiltro(f.ext),
							title: `Filtrar por .${f.ext}`,
							children: [
								filtros.has(f.ext) ? "☑" : "☐",
								" ",
								f.icon,
								" ",
								f.label,
								resumenFormatos[f.ext] ? ` (${resumenFormatos[f.ext]})` : ""
							]
						}, f.ext))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { margin: "0 4px 12px" },
						children: "Marca los formatos que quieres encontrar. Sin marcar ninguno, se buscan todos."
					}),
					hay && permiso && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mus-tabs",
						style: { marginBottom: 10 },
						children: [["auto", "✨ Encontrados"], ["carpetas", "📁 Carpetas"]].map(([id, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "mus-tab" + (modo === id ? " on" : ""),
							onClick: () => {
								setModo(id);
								haptic.tap();
							},
							children: et
						}, id))
					}),
					modo === "carpetas" && permiso && carpeta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "arch-ruta",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "arch-subir",
								disabled: !carpeta.padre,
								onClick: () => abrirCarpeta(carpeta.padre),
								children: "↑"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: carpeta.ruta,
								children: carpeta.ruta.split("/").filter(Boolean).slice(-2).join(" / ") || "/"
							})]
						}),
						raices.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "arch-raices",
							children: raices.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "bp-chip",
								onClick: () => abrirCarpeta(r.ruta),
								children: r.nombre
							}, r.ruta))
						}),
						carpeta.carpetas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "arch-fila carpeta",
							onClick: () => abrirCarpeta(c.ruta),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "arch-tick",
									children: "📁"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "arch-txt",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: c.nombre })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "arch-fl",
									children: "›"
								})
							]
						}, c.ruta)),
						carpetaFiltrada.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn sm",
							style: {
								width: "100%",
								margin: "8px 0"
							},
							onClick: () => {
								setSel((s) => {
									const n = new Set(s);
									for (const f of carpetaFiltrada) if (!conocidos.has(f.nombre.toLowerCase())) n.add(f.ruta);
									return n;
								});
								haptic.tap();
							},
							children: [
								"Marcar los ",
								carpetaFiltrada.length,
								" libros de esta carpeta"
							]
						}),
						carpetaFiltrada.map((f) => {
							const ya = conocidos.has(f.nombre.toLowerCase());
							const marcado = sel.has(f.ruta);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "arch-fila" + (marcado ? " on" : "") + (ya ? " ya" : ""),
								onClick: () => {
									if (ya) return;
									setExtra((e) => ({
										...e,
										[f.ruta]: f
									}));
									alternar(f.ruta);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "arch-tick",
									children: ya ? "✓" : marcado ? "☑" : "☐"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "arch-txt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [tam(f.bytes), ya ? " · ya está en tu biblioteca" : ""] })]
								})]
							}, f.ruta);
						}),
						carpeta.carpetas.length === 0 && carpetaFiltrada.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "empty",
							style: { padding: "24px 8px" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "empty-emoji",
								children: "📂"
							}), "Esta carpeta no tiene documentos con el filtro puesto."]
						})
					] }),
					modo === "auto" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bp-campo",
							style: { marginBottom: 10 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "plain",
								value: q,
								placeholder: "Buscar por nombre o carpeta…",
								onChange: (e) => setQ(e.target.value)
							})
						}),
						cargando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-cargando",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Buscando documentos…" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sólo en las carpetas donde suelen estar, para no tardar." })
							]
						}),
						!cargando && lista.length === 0 && hay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "empty",
							style: { padding: "28px 8px" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "empty-emoji",
									children: "📂"
								}),
								"No se encontraron documentos en las carpetas habituales.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "row-sub",
									style: { marginTop: 8 },
									children: "Prueba en «Carpetas» o tráelos con «Elegir archivos»."
								})
							]
						}),
						!cargando && lista.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "arch-resumen",
							children: [
								visibles.length,
								" de ",
								lista.length,
								" archivo(s)",
								filtros.size > 0 && " · con el filtro puesto",
								sel.size > 0 && ` · ${sel.size} seleccionado(s)`
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn primary",
							style: {
								width: "100%",
								margin: "8px 0 12px"
							},
							onClick: importarTodos,
							children: ["⬇ Importar todos los nuevos", (() => {
								const n = listaFiltrada.filter((f) => !conocidos.has(f.nombre.toLowerCase())).length;
								return n > 0 ? ` (${n})` : "";
							})()]
						})] }),
						visibles.map((f) => {
							const ya = conocidos.has(f.nombre.toLowerCase());
							const marcado = sel.has(f.ruta);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "arch-fila" + (marcado ? " on" : "") + (ya ? " ya" : ""),
								onClick: () => !ya && alternar(f.ruta),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "arch-tick",
									children: ya ? "✓" : marcado ? "☑" : "☐"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "arch-txt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										f.carpeta ? f.carpeta + " · " : "",
										tam(f.bytes),
										ya ? " · ya está en tu biblioteca" : ""
									] })]
								})]
							}, f.ruta);
						})
					] })
				]
			}),
			sel.size > 0 && !progreso && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arch-barra",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setSel(/* @__PURE__ */ new Set()),
						children: "Quitar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: () => setSel(new Set(visibles.filter((f) => !conocidos.has(f.nombre.toLowerCase())).map((f) => f.ruta))),
						children: "Todos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn primary",
						style: { flex: 1 },
						onClick: importarSeleccion,
						children: ["Importar ", sel.size]
					})
				]
			}),
			progreso && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arch-barra progreso",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "arch-prog-txt",
					children: [
						"Importando ",
						progreso.hecho + 1,
						" de ",
						progreso.total,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: progreso.nombre })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: Math.round(progreso.hecho / progreso.total * 100) + "%" } })
				})]
			})
		]
	});
}
//#endregion
export { Archivos as default };
