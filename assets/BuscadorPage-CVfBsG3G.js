import { t as require_react } from "./react-1WJTggxS.js";
import { a as usarPulsacionLarga, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { SITIOS, TIPOS, abrirEnNavegador, alternarFavorito, anadirSitioPropio, borrarDescarga, borrarSitioPropio, cambiarCodigo, cancelarDescargaActiva, cargarEstadoFiltro, comprobarCodigo, cuantosAvanzados, desbloquear, descargaActiva, estaDesbloqueado, favoritos, historial, historialDescargas, navegadorDisponible, olvidar, ordenarSitios, recordar, sitiosPropios, urlDe } from "./buscador-BkphWfy2.js";
//#region src/components/BuscadorPage.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
function BuscadorPage({ onSalir, toast, onMagnet }) {
	const [texto, setTexto] = (0, import_react.useState)("");
	const [hist, setHist] = (0, import_react.useState)([]);
	const [favs, setFavs] = (0, import_react.useState)([]);
	const [detalle, setDetalle] = (0, import_react.useState)(null);
	const [enApp] = (0, import_react.useState)(() => navegadorDisponible());
	const [abierto, setAbierto] = (0, import_react.useState)(() => estaDesbloqueado());
	const [pidiendoCodigo, setPidiendoCodigo] = (0, import_react.useState)(false);
	const [codigo, setCodigo] = (0, import_react.useState)("");
	const [errorCodigo, setErrorCodigo] = (0, import_react.useState)("");
	const [cambiando, setCambiando] = (0, import_react.useState)(false);
	const [codigoNuevo, setCodigoNuevo] = (0, import_react.useState)("");
	const [propios, setPropios] = (0, import_react.useState)([]);
	const [anadiendo, setAnadiendo] = (0, import_react.useState)(false);
	const [verDescargas, setVerDescargas] = (0, import_react.useState)(false);
	const [descargas, setDescargas] = (0, import_react.useState)([]);
	const [activa, setActiva] = (0, import_react.useState)(null);
	const [nsNombre, setNsNombre] = (0, import_react.useState)("");
	const [nsUrl, setNsUrl] = (0, import_react.useState)("");
	usarPantallaAtras(() => onSalir?.(), () => {
		if (!detalle) return false;
		setDetalle(null);
		return true;
	});
	const accionesLupa = (0, import_react.useRef)({});
	const lupaRef = usarPulsacionLarga({
		alPulsar: () => accionesLupa.current.buscar?.(),
		alLargo: () => accionesLupa.current.filtro?.(),
		ms: 900
	});
	(0, import_react.useEffect)(() => {
		const leer = () => setActiva(descargaActiva());
		leer();
		const id = setInterval(leer, 1e3);
		return () => clearInterval(id);
	}, []);
	const recargar = (0, import_react.useCallback)(async () => {
		setHist(await historial());
		setFavs(await favoritos());
		setPropios(await sitiosPropios());
		if (await cargarEstadoFiltro()) setAbierto(true);
	}, []);
	(0, import_react.useEffect)(() => {
		recargar();
	}, [recargar]);
	const buscar = async (sitio) => {
		const q = texto.trim();
		if (!q) {
			toast?.("Escribe el título o el autor que buscas");
			return;
		}
		haptic.tap();
		setHist(await recordar(q));
		const s2 = typeof sitio === "string" ? SITIOS.find((x) => x.id === sitio) : sitio;
		const nav = typeof window !== "undefined" ? window.AndroidNav : null;
		if (nav?.abrirConEspejos && Array.isArray(s2?.espejos) && s2.espejos.length) try {
			const lista = s2.espejos.map((e) => e.replace("{q}", encodeURIComponent(q)));
			nav.abrirConEspejos(urlDe(s2, q), s2.nombre || "Buscar", JSON.stringify(lista));
			return;
		} catch {}
		const r = abrirEnNavegador(sitio, q);
		if (!r.ok) return toast?.(r.error || "No se pudo abrir");
		if (r.externo) toast?.("Se abrió en el navegador del sistema");
	};
	const base = abierto ? SITIOS : SITIOS.filter((s) => !s.avanzado);
	const lista = ordenarSitios(favs).filter((s) => base.includes(s)).concat(propios);
	accionesLupa.current = {
		buscar: () => {
			if (texto.trim() && lista.length) buscar(lista[0]);
		},
		filtro: () => setPidiendoCodigo(true)
	};
	cuantosAvanzados();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bp",
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
						children: "Buscar libros"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "bp-desc-btn",
						"aria-label": "Descargas",
						onClick: () => {
							setDescargas(historialDescargas());
							setVerDescargas(true);
						},
						children: ["⬇", activa && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "bp-punto" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tp-cuerpo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-campo",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								ref: lupaRef,
								className: "bp-lupa",
								"aria-label": "Buscar",
								type: "button",
								children: "🔍"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "plain",
								value: texto,
								autoFocus: true,
								placeholder: "Título, autor o ISBN…",
								onChange: (e) => setTexto(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && texto.trim()) buscar(lista[0]);
								}
							}),
							texto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "bp-limpiar",
								onClick: () => setTexto(""),
								"aria-label": "Borrar",
								children: "✕"
							})
						]
					}),
					hist.length > 0 && !texto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-hist",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bp-hist-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Búsquedas recientes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "bp-borrar",
								onClick: async () => {
									setHist(await olvidar());
									haptic.tap();
								},
								children: "Borrar"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bp-chips",
							children: hist.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "bp-chip",
								onClick: () => setTexto(h),
								children: h
							}, h))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-seccion",
						children: texto.trim() ? "Toca dónde buscarlo" : "Sitios disponibles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-rejilla",
						children: lista.map((s) => {
							const tipo = TIPOS[s.tipo] || {};
							const fav = favs.includes(s.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bp-sitio",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bp-sitio-btn",
									style: { "--c": s.color },
									onClick: () => buscar(s),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bp-ini",
										children: s.nombre.slice(0, 2).toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "bp-sitio-txt",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bp-nom",
											children: s.nombre
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bp-tipo",
											style: { color: tipo.color },
											children: tipo.etiqueta
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bp-acc",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "bp-fav" + (fav ? " on" : ""),
										"aria-label": "Favorito",
										onClick: async () => {
											setFavs(await alternarFavorito(s.id));
											haptic.tap();
										},
										children: fav ? "★" : "☆"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "bp-info",
										"aria-label": "Qué es este sitio",
										onClick: () => setDetalle(s),
										children: "ⓘ"
									})]
								})]
							}, s.id);
						})
					}),
					abierto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "bp-filtro-on",
						onClick: () => {
							desbloquear(false);
							setAbierto(false);
							toast?.("Filtro de contenido activado");
						},
						children: "Filtro de contenido desactivado · toca para volver a activarlo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "bp-anadir",
						onClick: () => setAnadiendo(true),
						children: "＋ Añadir mi sitio de búsqueda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-ayuda",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cómo funciona" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: enApp ? "La web se abre dentro de Lumen. Si descargas ahí un PDF, EPUB u otro formato compatible, la app se queda el archivo y lo añade a tu biblioteca sola." : "En el navegador de escritorio los sitios se abren en otra pestaña. La captura automática de descargas sólo funciona en la aplicación instalada." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "bp-legal",
								children: "Lumen no aloja ni ofrece ningún libro: sólo lleva tu búsqueda a páginas de terceros. Lo que aparezca y si permite descargar depende de cada web. Algunas exigen cuenta o captcha, y otras distribuyen obras con derechos de autor: comprueba que puedes descargar lo que descargas."
							})
						]
					})
				]
			}),
			detalle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backdrop",
				onClick: () => setDetalle(null)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-menu",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "menu-x",
						type: "button",
						"aria-label": "Cerrar",
						onClick: () => setDetalle(null),
						children: "✕"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm-titulo",
						children: detalle.nombre
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-nota",
						children: detalle.nota
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-url",
						children: urlDe(detalle, texto.trim() || "ejemplo")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: () => {
							const s = detalle;
							setDetalle(null);
							buscar(s);
						},
						children: "Buscar aquí"
					}),
					detalle.propio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: async () => {
							setPropios(await borrarSitioPropio(detalle.id));
							setDetalle(null);
							toast?.("Sitio borrado");
						},
						children: "🗑 Borrar este sitio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setDetalle(null),
						children: "Cerrar"
					})
				]
			})] }),
			verDescargas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backdrop",
				onClick: () => setVerDescargas(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bp-descargas",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-desc-top",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Descargas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chat-act",
							onClick: () => setVerDescargas(false),
							children: "✕"
						})]
					}),
					activa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-desc-viva",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bp-desc-nom",
								children: activa.nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: (activa.total > 0 ? Math.min(100, Math.round(activa.bytes / activa.total * 100)) : 30) + "%" } })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bp-desc-meta",
								children: [
									Math.round((activa.bytes || 0) / 1024),
									" KB",
									activa.total > 0 ? ` de ${Math.round(activa.total / 1024)} KB` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn sm",
								style: {
									width: "100%",
									marginTop: 8
								},
								onClick: () => {
									cancelarDescargaActiva();
									setActiva(null);
									toast?.("Descarga cancelada");
								},
								children: "Cancelar"
							})
						]
					}),
					descargas.length === 0 && !activa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "empty",
						style: { padding: "26px 8px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "empty-emoji",
							children: "⬇"
						}), "Todavía no has descargado nada."]
					}),
					descargas.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bp-desc-fila",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bp-desc-ic",
								children: d.estado === "listo" ? "✓" : d.estado === "error" ? "✕" : "…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bp-desc-txt",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: d.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [d.bytes > 0 ? `${Math.round(d.bytes / 1024)} KB · ` : "", d.estado === "listo" ? "importado" : d.estado === "error" ? "falló" : "a medias"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "chat-act",
								"aria-label": "Borrar",
								onClick: () => {
									setDescargas(borrarDescarga(d.nombre));
									haptic.tap();
								},
								children: "🗑"
							})
						]
					}, d.nombre + d.at)),
					descargas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						style: {
							width: "100%",
							marginTop: 10
						},
						onClick: () => {
							for (const d of descargas) borrarDescarga(d.nombre);
							setDescargas([]);
							toast?.("Historial vaciado");
						},
						children: "Borrar todo el historial"
					})
				]
			})] }),
			pidiendoCodigo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backdrop",
				onClick: () => setPidiendoCodigo(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-menu",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "menu-x",
						type: "button",
						"aria-label": "Cerrar",
						onClick: () => setPidiendoCodigo(false),
						children: "✕"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm-titulo",
						children: "Filtro de contenido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-nota",
						children: "Con el filtro activo sólo se muestran fuentes de acceso abierto. Escribe el código para gestionarlo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain",
						type: "tel",
						inputMode: "numeric",
						autoFocus: true,
						value: codigo,
						placeholder: "Código",
						onChange: (e) => {
							setCodigo(e.target.value.replace(/\D/g, ""));
							setErrorCodigo("");
						},
						onKeyDown: async (e) => {
							if (e.key !== "Enter") return;
							if (await comprobarCodigo(codigo)) {
								desbloquear(true);
								setAbierto(true);
								setPidiendoCodigo(false);
								setCodigo("");
								haptic.success();
							} else setErrorCodigo("Código incorrecto");
						}
					}),
					errorCodigo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-err",
						children: errorCodigo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: async () => {
							if (await comprobarCodigo(codigo)) {
								desbloquear(true);
								setAbierto(true);
								setPidiendoCodigo(false);
								setCodigo("");
								haptic.success();
								toast?.("Filtro de contenido desactivado");
							} else setErrorCodigo("Código incorrecto");
						},
						children: "Entrar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn",
						onClick: () => {
							setPidiendoCodigo(false);
							setCambiando(true);
						},
						children: "Cambiar el código"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setPidiendoCodigo(false),
						children: "Cancelar"
					})
				]
			})] }),
			cambiando && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backdrop",
				onClick: () => setCambiando(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-menu",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "menu-x",
						type: "button",
						"aria-label": "Cerrar",
						onClick: () => setPidiendoCodigo(false),
						children: "✕"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm-titulo",
						children: "Cambiar el código"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-nota",
						children: "Hay que saber el actual para poder cambiarlo. De 4 a 8 cifras."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain",
						type: "tel",
						inputMode: "numeric",
						value: codigo,
						placeholder: "Código actual",
						onChange: (e) => setCodigo(e.target.value.replace(/\D/g, ""))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain",
						type: "tel",
						inputMode: "numeric",
						style: { marginTop: 8 },
						value: codigoNuevo,
						placeholder: "Código nuevo",
						onChange: (e) => setCodigoNuevo(e.target.value.replace(/\D/g, ""))
					}),
					errorCodigo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-err",
						children: errorCodigo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: async () => {
							if (!await comprobarCodigo(codigo)) {
								setErrorCodigo("El código actual no es correcto");
								return;
							}
							const r = await cambiarCodigo(codigoNuevo);
							if (!r.ok) {
								setErrorCodigo(r.error);
								return;
							}
							setCambiando(false);
							setCodigo("");
							setCodigoNuevo("");
							setErrorCodigo("");
							toast?.("Código cambiado");
						},
						children: "Guardar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setCambiando(false),
						children: "Cancelar"
					})
				]
			})] }),
			anadiendo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backdrop",
				onClick: () => setAnadiendo(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-menu",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "menu-x",
						type: "button",
						"aria-label": "Cerrar",
						onClick: () => setCambiando(false),
						children: "✕"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm-titulo",
						children: "Añadir mi sitio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bp-nota",
						children: "Busca cualquier cosa en esa web y pega aquí la dirección que te quede. Lumen se encarga de poner tu búsqueda en el sitio correcto."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain",
						value: nsNombre,
						placeholder: "Nombre (p. ej. Mi biblioteca)",
						onChange: (e) => setNsNombre(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "plain",
						style: { marginTop: 8 },
						inputMode: "url",
						value: nsUrl,
						placeholder: "https://ejemplo.com/buscar?q=prueba",
						onChange: (e) => setNsUrl(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary",
						onClick: async () => {
							const r = await anadirSitioPropio(nsNombre, nsUrl);
							if (!r.ok) return toast?.(r.error);
							setPropios(await sitiosPropios());
							setAnadiendo(false);
							setNsNombre("");
							setNsUrl("");
							haptic.success();
							toast?.("Sitio añadido");
						},
						children: "Guardar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn ghost",
						onClick: () => setAnadiendo(false),
						children: "Cancelar"
					})
				]
			})] }),
			void 0
		]
	});
}
//#endregion
export { BuscadorPage as default };
