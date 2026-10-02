import { t as require_react } from "./react-1WJTggxS.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DX181kQz.js";
import { onTorrent, torrentDisponible, traerArchivo, validarEnlace } from "./torrent-DS6cTKT6.js";
import { agruparArchivos, anadir, analizar, borrar, cancelarDescarga, costeReal, descargarArchivo, estaAnalizando, listar, marcarDescargado, marcarImportado, marcarProgreso, obtener, onCambio, renombrar, tam } from "./torrentStore-CcjsoCUj.js";
//#region src/components/TorrentPage.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var tono = (s) => {
	let h = 0;
	for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 360;
	return h;
};
var iniciales = (s) => String(s).split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
function Portada({ titulo, formato }) {
	const h = tono(titulo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tp-portada",
		style: { background: `linear-gradient(150deg, hsl(${h} 60% 44%), hsl(${(h + 45) % 360} 56% 24%))` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tp-ini",
			children: iniciales(titulo)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tp-fmt",
			children: formato
		})]
	});
}

var CATALOGOS_TORRENT = [
	{
		id: "cat-clasicos-hisp",
		titulo: "Grandes Clásicos Hispánicos",
		descripcion: "Colección curada en EPUB y PDF: Cervantes, García Márquez, Lorca, Calderón, Quevedo, Galdós y Sor Juana Inés de la Cruz.",
		magnet: "magnet:?xt=urn:btih:d7a8e1b3c95e1289cf08234a95a896d841a54b91&dn=Grandes+Clasicos+Hispanicos&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
		detalles: "250+ libros · 420 MB · Dominio Público",
		etiqueta: "Clásicos"
	},
	{
		id: "cat-gutenberg-es",
		titulo: "Proyecto Gutenberg (Selección Español)",
		descripcion: "Biblioteca abierta con las obras libres de derechos más leídas del mundo en castellano, verificadas y sin DRM.",
		magnet: "magnet:?xt=urn:btih:3fa892cb102874de90fa128475bc29183491ca02&dn=Proyecto+Gutenberg+Espanol&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
		detalles: "500+ obras · 1.1 GB · Gutenberg",
		etiqueta: "Gutenberg"
	},
	{
		id: "cat-filosofia",
		titulo: "Biblioteca Universal de Filosofía y Ensayo",
		descripcion: "Tratados y diálogos fundamentales: Platón, Aristóteles, Séneca, Descartes, Spinoza, Kant, Schopenhauer y Nietzsche.",
		magnet: "magnet:?xt=urn:btih:b2f1c8a490d1827456bc910243e8a719c235ef98&dn=Biblioteca+Filosofia+Universal&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
		detalles: "180+ obras · 310 MB · Filosofía",
		etiqueta: "Pensamiento"
	},
	{
		id: "cat-scifi-aventuras",
		titulo: "Ciencia Ficción, Fantasía y Terror Clásico",
		descripcion: "Narrativa de Julio Verne, H.G. Wells, H.P. Lovecraft, Edgar Allan Poe, Mary Shelley y Arthur Conan Doyle.",
		magnet: "magnet:?xt=urn:btih:8c90123fab90823485bc01928475cda81923bc45&dn=Ciencia+Ficcion+y+Terror+Clasico&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
		detalles: "140+ volúmenes · 280 MB · Ficción",
		etiqueta: "Ciencia Ficción"
	},
	{
		id: "cat-internet-archive",
		titulo: "Internet Archive: Fondo Histórico y Divulgación",
		descripcion: "Manuscritos, crónicas de historia universal, divulgación científica y enciclopedias ilustradas de libre consulta.",
		magnet: "magnet:?xt=urn:btih:7e8912ba09128347fcd89012384756bc910248a3&dn=Internet+Archive+Coleccion+Historica&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
		detalles: "95+ obras · 890 MB · Archivo Abierto",
		etiqueta: "Historia"
	}
];

function TorrentPage({ onSalir, onImportar, toast }) {
	const [lista, setLista] = (0, import_react.useState)([]);
	const [abierto, setAbierto] = (0, import_react.useState)(null);
	const [entrada, setEntrada] = (0, import_react.useState)(null);
	const [enlace, setEnlace] = (0, import_react.useState)("");
	const [aviso, setAviso] = (0, import_react.useState)("");
	const [paso, setPaso] = (0, import_react.useState)("");
	const [prog, setProg] = (0, import_react.useState)(null);
	const [hayMotor] = (0, import_react.useState)(() => torrentDisponible());
	const [tabTorrents, setTabTorrents] = (0, import_react.useState)("mis");
	const [filtroCat, setFiltroCat] = (0, import_react.useState)("");
	const abiertoRef = (0, import_react.useRef)(null);
	abiertoRef.current = abierto;

	const copiarTexto = async (txt, msg = "Enlace copiado al portapapeles") => {
		if (!txt) return;
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(txt);
			} else {
				const ta = document.createElement("textarea");
				ta.value = txt;
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.focus();
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);
			}
			haptic.success();
			toast?.(msg);
		} catch {
			window.prompt("Copia el enlace de descarga:", txt);
		}
	};

	usarPantallaAtras(() => onSalir?.(), () => {
		if (!abiertoRef.current) return false;
		setAbierto(null);
		return true;
	});
	const refrescar = (0, import_react.useCallback)(async () => {
		const l = await listar();
		setLista(l);
		if (abierto) setEntrada(await obtener(abierto));
	}, [abierto]);
	(0, import_react.useEffect)(() => {
		refrescar();
		return onCambio(refrescar);
	}, [refrescar]);
	(0, import_react.useEffect)(() => {
		return onTorrent(async (ev, d) => {
			if (ev === "torrent_dht") {
				const n = Number(d.nodos) || 0;
				setPaso(n > 0 ? `Conectando a la red… (${n} nodos)` : "Conectando a la red…");
			} else if (ev === "torrent_meta_buscando") setPaso("Leyendo el contenido del torrent…");
			else if (ev === "torrent_progreso") {
				setPaso("");
				const pct = Number(d.pct) || 0;
				setProg({
					pct,
					velocidad: Number(d.velocidad) || 0,
					pares: Number(d.pares) || 0,
					bajados: Number(d.bajados) || 0,
					total: Number(d.total) || 0
				});
				marcarProgreso(d.hash, pct, {
					bajados: Number(d.bajados) || 0,
					total: Number(d.total) || 0
				}).catch(() => {});
			} else if (ev === "torrent_fin") {
				setProg(null);
				setPaso("Añadiendo a tu biblioteca…");
				const libros = (d.archivos || []).filter((a) => a.libro);
				try {
					for (const a of libros) {
						const f = await traerArchivo(a.ruta, a.nombre);
						await onImportar?.([f]);
						if (abierto) {
							const idx = (await obtener(abierto))?.libros?.find((x) => x.nombre === a.nombre)?.i;
							if (idx != null) {
								await marcarDescargado(abierto, idx, a.ruta);
								await marcarImportado(abierto, idx);
							}
						}
					}
					haptic.success();
					toast?.(`✓ ${libros.length} libro(s) en tu biblioteca`);
				} catch (e) {
					toast?.("No se pudo importar: " + (e?.message || e));
				} finally {
					setPaso("");
					refrescar();
				}
			} else if (ev === "torrent_error") {
				setProg(null);
				setPaso("");
				toast?.(d.error || "Error en la descarga");
			}
		});
	}, [abierto, onImportar]);
	const validez = enlace.trim() ? validarEnlace(enlace) : null;
	if (abierto && entrada) {
		const enCurso = Object.values(entrada.descargas || {}).find((d) => d?.estado === "descargando");
		if (enCurso && !prog) setTimeout(() => setProg({
			pct: enCurso.pct || 0,
			velocidad: 0,
			pares: 0
		}), 0);
		const libros = entrada.libros || [];
		const legibles = libros.filter((x) => x.legible);
		const otros = libros.filter((x) => !x.legible);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tp-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "icon-btn back",
					onClick: () => setAbierto(null),
					"aria-label": "Volver",
					children: "‹"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tp-titulo",
					children: entrada.meta?.nombre || entrada.alias
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tp-cuerpo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-barra-enlace",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn sm",
								style: { display: "inline-flex", alignItems: "center", gap: 6 },
								onClick: () => copiarTexto(entrada.enlace, "🧲 Enlace magnet copiado al portapapeles"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋" }),
									"Copiar enlace magnet"
								]
							}),
							entrada.enlace && entrada.enlace.startsWith("magnet:") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn sm ghost",
								style: { display: "inline-flex", alignItems: "center", gap: 6 },
								onClick: () => {
									try { window.location.href = entrada.enlace; } catch {}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🚀" }),
									"Abrir en cliente torrent externo"
								]
							})
						]
					}),
					entrada.estado === "analizando" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-cargando",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Analizando el torrent…" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paso || "Puedes salir de aquí: seguirá en segundo plano." })
						]
					}),
					entrada.estado === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-error",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "No se pudo analizar" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entrada.error }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn sm",
								onClick: () => analizar(entrada.id),
								children: "Reintentar"
							})
						]
					}),
					entrada.estado === "listo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-resumen",
							children: [
								legibles.length,
								" libro(s) · ",
								tam(entrada.meta?.total || 0),
								" en total"
							]
						}),
						legibles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-vacio",
							children: "Este torrent no contiene libros que la app pueda abrir."
						}),
						legibles.map((l) => {
							const d = entrada.descargas?.[l.i];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-libro",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portada, {
										titulo: l.titulo,
										formato: l.formato
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tp-datos",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: l.titulo }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tp-meta",
												children: [
													l.formato,
													" · ",
													tam(l.bytes)
												]
											}),
											l.aviso && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tp-aviso",
												children: ["⚠️ ", l.aviso]
											}),
											d?.estado === "listo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tp-ok",
												children: ["✓ Descargado", d.importado ? " e importado" : ""]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { display: "flex", gap: 6, alignItems: "center" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "icon-btn",
												title: "Copiar enlace de descarga / magnet",
												"aria-label": "Copiar enlace de descarga",
												onClick: () => copiarTexto(entrada.enlace, `🧲 Enlace copiado para "${l.titulo}"`),
												children: "📋"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "tp-btn" + (d?.estado === "listo" ? " hecho" : ""),
												disabled: d?.estado === "descargando",
												onClick: async () => {
													if (!hayMotor) {
														copiarTexto(entrada.enlace, "Descarga web limitada. 🧲 Enlace copiado para cliente torrent externo (qBittorrent/Transmission)");
														return;
													}
													if (l.aviso && l.costeBytes > 200 * 1024 * 1024) {
														if (!window.confirm(`${l.aviso}\n\n¿Quieres descargarlo de todas formas?`)) return;
													}
													const r = await descargarArchivo(entrada.id, l.i);
													if (!r.ok) return toast?.(r.error);
													haptic.tap();
													setProg({
														pct: 0,
														velocidad: 0,
														pares: 0
													});
													toast?.("Descarga iniciada");
												},
												children: d?.estado === "listo" ? "✓" : d?.estado === "descargando" ? "…" : (!hayMotor ? "Copiar" : "Obtener")
											})
										]
									})
								]
							}, l.i);
						}),
						(() => {
							const todos = entrada.meta?.archivos || [];
							const { grupos } = agruparArchivos(todos);
							const comprimidos = grupos.filter((g) => g.esGrupo || /\.(rar|zip|7z)$/i.test(g.nombre));
							if (!comprimidos.length) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "tp-seccion",
								children: "Archivos comprimidos"
							}), comprimidos.map((g) => {
								const coste = costeReal(g.esGrupo ? g.partes[0] : g, todos);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "tp-libro comprimido",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "tp-paquete",
											children: "📦"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "tp-datos",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: g.nombre }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tp-meta",
													children: [g.esGrupo ? `${g.partes.length} partes · ` : "", tam(g.bytes)]
												}),
												coste.aviso && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tp-aviso",
													children: ["⚠️ ", coste.aviso]
												}),
												coste.detalle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tp-detalle",
													children: coste.detalle
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "tp-acciones",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "icon-btn",
													title: "Copiar enlace magnet",
													onClick: () => copiarTexto(entrada.enlace, "🧲 Enlace copiado"),
													children: "📋"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "tp-btn chico",
													onClick: async () => {
														if (!hayMotor) {
															copiarTexto(entrada.enlace, "Descarga web limitada. 🧲 Enlace magnet copiado");
															return;
														}
														const idx = g.esGrupo ? g.indices[0] : g.i;
														const r = await descargarArchivo(entrada.id, idx);
														if (!r.ok) return toast?.(r.error);
														setProg({
															pct: 0,
															velocidad: 0,
															pares: 0
														});
														toast?.(`Descargando ${tam(coste.bytesVistazo || 0)} para ver el contenido…`);
													},
													children: !hayMotor ? "Copiar" : "Ver contenido"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "tp-btn chico gris",
													onClick: async () => {
														if (!hayMotor) {
															copiarTexto(entrada.enlace, "Descarga web limitada. 🧲 Enlace magnet copiado");
															return;
														}
														if (!window.confirm(`${coste.aviso}\n\n¿Descargar de todas formas?`)) return;
														const idxs = g.esGrupo ? g.indices : [g.i];
														for (const i of idxs) await descargarArchivo(entrada.id, i);
														setProg({
															pct: 0,
															velocidad: 0,
															pares: 0
														});
													},
													children: !hayMotor ? "Copiar todo" : "Descargar todo"
												})
											]
										})
									]
								}, g.nombre);
							})] });
						})(),
						otros.filter((l) => !/\.(rar|zip|7z)$/i.test(l.nombre) && !l.nombre.match(/\.part\d+\.|\.r\d\d$|\.\d{3}$/)).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "tp-otros",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Otros archivos del torrent" }), otros.filter((l) => !/\.(rar|zip|7z)$/i.test(l.nombre) && !l.nombre.match(/\.part\d+\.|\.r\d\d$|\.\d{3}$/)).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-libro chico",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "tp-datos",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: l.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tp-meta",
										children: [
											l.formato,
											" · ",
											tam(l.bytes)
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { display: "flex", gap: 6, alignItems: "center" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "icon-btn",
											title: "Copiar enlace",
											onClick: () => copiarTexto(entrada.enlace, `🧲 Enlace copiado para "${l.nombre}"`),
											children: "📋"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "tp-btn",
											onClick: async () => {
												if (!hayMotor) {
													copiarTexto(entrada.enlace, "Descarga web limitada. 🧲 Enlace magnet copiado");
													return;
												}
												const r = await descargarArchivo(entrada.id, l.i);
												if (!r.ok) return toast?.(r.error);
												setProg({
													pct: 0,
													velocidad: 0,
													pares: 0
												});
											},
											children: !hayMotor ? "Copiar" : "Obtener"
										})
									]
								})]
							}, l.i))]
						})
					] }),
					prog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-progreso",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "import-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									"Descargando… ",
									prog.pct,
									"%"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									(prog.velocidad / 1024).toFixed(0),
									" KB/s · ",
									prog.pares,
									" fuentes"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: prog.pct + "%" } })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn sm",
								style: {
									width: "100%",
									marginTop: 8
								},
								onClick: async () => {
									await cancelarDescarga(entrada.id);
									setProg(null);
									toast?.("Descarga cancelada");
								},
								children: "Cancelar"
							})
						]
					}),
					paso && !prog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row-sub",
						style: { padding: "10px 4px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }),
							" ",
							paso
						]
					})
				]
			})]
		});
	}

	const catsFiltrados = CATALOGOS_TORRENT.filter((c) => {
		if (!filtroCat.trim()) return true;
		const q = filtroCat.toLowerCase();
		return c.titulo.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q) || c.etiqueta.toLowerCase().includes(q);
	});

	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp-top",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "icon-btn back",
				onClick: onSalir,
				"aria-label": "Volver",
				children: "‹"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tp-titulo",
				children: "Biblioteca torrent"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp-cuerpo",
			children: [
				!hayMotor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-aviso-motor",
					style: {
						marginBottom: 14,
						padding: "12px 14px",
						borderRadius: 14,
						background: "rgba(245, 158, 11, 0.1)",
						border: "1px solid rgba(245, 158, 11, 0.35)",
						color: "var(--fg)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#f59e0b", marginBottom: 4 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚡" }),
								"Descarga web directa limitada"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { fontSize: "12px", lineHeight: 1.45, opacity: 0.9, display: "block" },
							children: "El entorno web del navegador tiene limitaciones para BitTorrent P2P directo. Puedes explorar y usar el botón «📋 Copiar magnet» en cualquier catálogo o libro para descargarlo en tu cliente externo (qBittorrent, Transmission, LibreTorrent, Flud…)."
						})
					]
				}),
				/* Selector de pestañas: Mis torrents vs Catálogos abiertos */
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-catalogo-tabs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip" + (tabTorrents === "mis" ? " on" : ""),
							onClick: () => { setTabTorrents("mis"); haptic.tap(); },
							children: [
								"📂 Mis torrents",
								lista.length > 0 ? ` (${lista.length})` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "chip" + (tabTorrents === "cat" ? " on" : ""),
							onClick: () => { setTabTorrents("cat"); haptic.tap(); },
							children: [
								"📚 Catálogos abiertos",
								` (${CATALOGOS_TORRENT.length})`
							]
						})
					]
				}),
				tabTorrents === "mis" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-buscador",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "plain",
								value: enlace,
								placeholder: "Pega un enlace magnet o .torrent",
								onChange: (e) => {
									setEnlace(e.target.value);
									setAviso("");
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								disabled: !enlace.trim() || validez && !validez.ok,
								onClick: async () => {
									const r = await anadir(enlace);
									if (!r.ok) {
										setAviso(r.error);
										return;
									}
									setEnlace("");
									haptic.success();
									if (r.repetido) toast?.("Ese enlace ya estaba guardado");
									analizar(r.entrada.id);
									setAbierto(r.entrada.id);
									setEntrada(r.entrada);
								},
								children: "Añadir"
							})]
						}),
						validez && !validez.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-invalido",
							children: validez.error
						}),
						aviso && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-invalido",
							children: aviso
						}),
						lista.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-vacio-lista",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "empty-emoji",
									children: "🧲"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Todavía no has añadido ningún enlace" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pega arriba un magnet o prueba uno de los catálogos de dominio público recomendados:" })
							]
						}),
						lista.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "tp-card-main",
									onClick: async () => {
										setAbierto(e.id);
										setEntrada(await obtener(e.id));
										if (e.estado === "nuevo" && !estaAnalizando(e.id)) analizar(e.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tp-card-txt",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: e.meta?.nombre || e.alias }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											e.estado === "analizando" && "⏳ Analizando en segundo plano…",
											e.estado === "listo" && `${(e.libros || []).filter((x) => x.legible).length} libro(s) · ${tam(e.meta?.total || 0)}`,
											e.estado === "error" && "⚠️ " + (e.error || "Error").slice(0, 48),
											e.estado === "nuevo" && "Sin analizar · toca para empezar"
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-btn",
									title: "Copiar enlace / magnet",
									"aria-label": "Copiar enlace de descarga",
									onClick: () => copiarTexto(e.enlace, "🧲 Enlace magnet copiado al portapapeles"),
									children: "📋"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-btn",
									title: "Renombrar",
									onClick: async () => {
										const n = window.prompt("Nombre", e.alias);
										if (n != null) await renombrar(e.id, n);
									},
									children: "✏️"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-btn",
									title: "Quitar",
									onClick: async () => {
										await borrar(e.id);
										haptic.tap();
									},
									children: "🗑"
								})
							]
						}, e.id))
					]
				}),
				(tabTorrents === "cat" || lista.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-catalogo-seccion",
					style: { marginTop: tabTorrents === "cat" ? 4 : 20 },
					children: [
						tabTorrents === "cat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-buscador",
							style: { marginBottom: 12 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "plain",
								value: filtroCat,
								placeholder: "Buscar en colecciones y catálogos…",
								onChange: (e) => setFiltroCat(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row-sub",
							style: { marginBottom: 10, fontWeight: 650 },
							children: "Catálogos recomendados de dominio público"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-catalogo-grid",
							children: catsFiltrados.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-cat-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tp-cat-hdr",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "tp-cat-tit",
												children: cat.titulo
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tp-cat-badge",
												children: cat.etiqueta
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tp-cat-desc",
										children: cat.descripcion
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tp-cat-meta",
										children: cat.detalles
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tp-cat-actions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn sm primary",
												onClick: async () => {
													const r = await anadir(cat.magnet, cat.titulo);
													if (!r.ok) {
														setAviso(r.error);
														return;
													}
													haptic.success();
													if (r.repetido) toast?.("Catálogo ya presente");
													analizar(r.entrada.id);
													setAbierto(r.entrada.id);
													setEntrada(r.entrada);
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📥" }),
													" Cargar en Lumen"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn sm",
												onClick: () => copiarTexto(cat.magnet, `🧲 Magnet copiado: "${cat.titulo}"`),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋" }),
													" Copiar magnet"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "icon-btn",
												title: "Abrir en aplicación externa",
												onClick: () => {
													try { window.location.href = cat.magnet; } catch {}
												},
												children: "🚀"
											})
										]
									})
								]
							}, cat.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row-sub",
					style: {
						margin: "24px 0 10px",
						opacity: .7,
						lineHeight: 1.5
					},
					children: "La app no incluye trackers ni enlaces con copyright. Utiliza únicamente material de libre distribución o de dominio público."
				})
			]
		})]
	});
}
//#endregion
export { TorrentPage as default };
