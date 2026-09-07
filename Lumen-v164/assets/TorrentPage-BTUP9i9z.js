import { t as require_react } from "./react-1WJTggxS.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
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
function TorrentPage({ onSalir, onImportar, toast }) {
	const [lista, setLista] = (0, import_react.useState)([]);
	const [abierto, setAbierto] = (0, import_react.useState)(null);
	const [entrada, setEntrada] = (0, import_react.useState)(null);
	const [enlace, setEnlace] = (0, import_react.useState)("");
	const [aviso, setAviso] = (0, import_react.useState)("");
	const [paso, setPaso] = (0, import_react.useState)("");
	const [prog, setProg] = (0, import_react.useState)(null);
	const [hayMotor] = (0, import_react.useState)(() => torrentDisponible());
	const abiertoRef = (0, import_react.useRef)(null);
	abiertoRef.current = abierto;
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "tp-btn" + (d?.estado === "listo" ? " hecho" : ""),
										disabled: d?.estado === "descargando" || !hayMotor,
										onClick: async () => {
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
										children: d?.estado === "listo" ? "✓" : d?.estado === "descargando" ? "…" : "Obtener"
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "tp-btn chico",
												disabled: !hayMotor,
												onClick: async () => {
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
												children: "Ver contenido"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "tp-btn chico gris",
												disabled: !hayMotor,
												onClick: async () => {
													if (!window.confirm(`${coste.aviso}\n\n¿Descargar de todas formas?`)) return;
													const idxs = g.esGrupo ? g.indices : [g.i];
													for (const i of idxs) await descargarArchivo(entrada.id, i);
													setProg({
														pct: 0,
														velocidad: 0,
														pares: 0
													});
												},
												children: "Descargar todo"
											})]
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "tp-btn",
									disabled: !hayMotor,
									onClick: async () => {
										const r = await descargarArchivo(entrada.id, l.i);
										if (!r.ok) return toast?.(r.error);
										setProg({
											pct: 0,
											velocidad: 0,
											pares: 0
										});
									},
									children: "Obtener"
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
					className: "tp-error",
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sólo en la aplicación instalada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "El navegador no puede usar BitTorrent." })]
				}),
				lista.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-vacio-lista",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-emoji",
							children: "🧲"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Todavía no has añadido ningún enlace" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pega abajo un enlace magnet o un .torrent y quedará guardado aquí para la próxima vez." })
					]
				}),
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
					className: "tp-vacio",
					style: { marginTop: 20 },
					children: ["Aún no has añadido ningún enlace.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "row-sub",
						style: { marginTop: 10 },
						children: "Pega arriba un magnet o la dirección de un .torrent, o prueba con uno de los ejemplos."
					})]
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
				}, e.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row-sub",
					style: {
						margin: "18px 0 8px",
						opacity: .7,
						lineHeight: 1.5
					},
					children: "La app no incluye buscadores ni listas de torrents: sólo abre los enlaces que pegues tú. Descarga únicamente contenido que tengas derecho a usar."
				})
			]
		})]
	});
}
//#endregion
export { TorrentPage as default };
