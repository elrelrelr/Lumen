import { t as require_react } from "./react-1WJTggxS.js";
import { _ as Sheet, c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { identidadGuardada, npubCorto, relaysGuardados } from "./nostr-zC6Qsl2z.js";
import { a as generarVitrinaHtml, c as libroDePublicado, d as reenviarPublicado, i as exportarJson, l as listarPublicados, n as enlaceDe, r as estadoDe, t as borrarPublicadoRed, u as obtenerBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { copiarTexto } from "./NostrAjustes-CIgc9tj_.js";
//#region src/components/MisPublicaciones.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
function PortadaMini({ pub }) {
	const h = (() => {
		let x = 0;
		const s = String(pub.titulo || "L");
		for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 360;
		return x;
	})();
	if (pub.portada) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "mp-cov",
		src: pub.portada,
		alt: "",
		draggable: false
	});
	const ini = String(pub.titulo || "L").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mp-cov mp-cov-gen",
		style: { background: `linear-gradient(150deg, hsl(${h} 60% 44%), hsl(${(h + 45) % 360} 56% 24%))` },
		children: ini
	});
}
function QrPub({ pub }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		try {
			const data = JSON.stringify({
				v: 1,
				d: pub.d,
				t: pub.titulo,
				m: pub.magnet || ""
			});
			const img = new Image();
			img.onload = () => {
				const ctx = ref.current.getContext("2d");
				ctx.clearRect(0, 0, 300, 300);
				ctx.drawImage(img, 0, 0, 300, 300);
			};
			img.src = qrDataUrl(data, 300);
		} catch (e) {
			console.warn("[qr]", e?.message || e);
		}
	}, [pub]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mp-qr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref,
				width: 300,
				height: 300
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "var(--fg-dim)",
					fontSize: 12,
					textAlign: "center"
				},
				children: [
					"Escanéalo con otra LumenReader para abrir el libro.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Enlace: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						style: { color: "var(--accent)" },
						children: enlaceDe(pub)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn",
				onClick: () => copiarTexto(enlaceDe(pub)),
				children: "📋 Copiar enlace"
			})
		]
	});
}
function MisPublicaciones({ onSalir, toast, onEditar, onLeer, onAbrirCatalogo }) {
	const [pubs, setPubs] = (0, import_react.useState)([]);
	const [cargado, setCargado] = (0, import_react.useState)(false);
	const [expandido, setExpandido] = (0, import_react.useState)(null);
	const [compartir, setCompartir] = (0, import_react.useState)(null);
	const [qrAbierto, setQrAbierto] = (0, import_react.useState)(null);
	const [vitrinaAbierta, setVitrinaAbierta] = (0, import_react.useState)(false);
	const [confirmarBorrar, setConfirmarBorrar] = (0, import_react.useState)(null);
	const [trabajando, setTrabajando] = (0, import_react.useState)("");
	const [relays, setRelays] = (0, import_react.useState)([]);
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	usarPantallaAtras(() => onSalir?.(), () => {
		if (confirmarBorrar) {
			setConfirmarBorrar(null);
			return true;
		}
		if (qrAbierto) {
			setQrAbierto(null);
			return true;
		}
		if (compartir) {
			setCompartir(null);
			return true;
		}
		if (vitrinaAbierta) {
			setVitrinaAbierta(false);
			return true;
		}
		return false;
	});
	const cargar = (0, import_react.useCallback)(async () => {
		const [lista, rs, id] = await Promise.all([
			listarPublicados(),
			relaysGuardados(),
			identidadGuardada()
		]);
		setPubs(lista);
		setRelays(rs);
		setIdentidad(id);
		setCargado(true);
	}, []);
	(0, import_react.useEffect)(() => {
		cargar();
	}, [cargar]);
	const compartirLumen = async (pub) => {
		setTrabajando("lumen");
		try {
			const blob = await obtenerBlobLumen(pub.d);
			if (!blob) {
				toast("No se encuentra el .lumen guardado de este libro");
				return;
			}
			const b64 = await new Promise((res, rej) => {
				const fr = new FileReader();
				fr.onload = () => res(String(fr.result).split(",")[1] || "");
				fr.onerror = rej;
				fr.readAsDataURL(blob);
			});
			const nombre = (pub.titulo || "libro").replace(/[^\w\s.-]/gi, "_").trim() + ".lumen";
			if (window.AndroidShare?.shareFile) {
				if (window.AndroidShare.shareFile(b64, nombre, "application/octet-stream")) {
					setCompartir(null);
					return;
				}
			}
			const f = new File([blob], nombre, { type: "application/octet-stream" });
			if (navigator.canShare?.({ files: [f] })) {
				await navigator.share({
					files: [f],
					title: pub.titulo
				});
				setCompartir(null);
				return;
			}
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = nombre;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 4e3);
			toast("Descargando el .lumen…");
			setCompartir(null);
		} catch (e) {
			toast("No se pudo compartir: " + (e?.message || e));
		} finally {
			setTrabajando("");
		}
	};
	const compartirApp = (pub) => {
		const texto = `📚 «${pub.titulo}» de ${pub.autor} — léelo en Lumen Reader\n` + enlaceDe(pub) + (pub.magnet ? `\n\n🧲 Torrent (siembra el libro):\n${pub.magnet}` : "") + "\n\n(Si no tienes Lumen Reader, instala la app y escanea este enlace o abre la Biblioteca Global.)";
		if (window.AndroidShare?.shareText) {
			window.AndroidShare.shareText(pub.titulo, texto);
			setCompartir(null);
			return;
		}
		copiarTexto(texto, toast);
		setCompartir(null);
	};
	const reenviar = async (pub) => {
		setTrabajando("reenviar");
		try {
			const r = await reenviarPublicado(pub);
			toast(r.ok ? `↻ Reenviado: ahora está en ${r.ok}/${r.total} relay(s)` : "Los relays siguen sin responder. Revisa tu conexión.");
			await cargar();
		} finally {
			setTrabajando("");
		}
	};
	const borrar = async (pub) => {
		setTrabajando("borrar");
		try {
			if (identidad) await borrarPublicadoRed(pub, identidad);
			await cargar();
			toast("🗑 Libro borrado de tu historial y pedida su retirada a los relays.");
		} finally {
			setConfirmarBorrar(null);
			setTrabajando("");
		}
	};
	const leer = (pub) => {
		onLeer?.(libroDePublicado(pub));
	};
	const htmlVitrina = (0, import_react.useCallback)(() => {
		return generarVitrinaHtml(pubs, {
			nombre: "Mis libros publicados",
			npub: identidad?.npub || ""
		});
	}, [pubs, identidad]);
	const descargarVitrina = () => {
		const blob = new Blob([htmlVitrina()], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "mis-libros-lumen.html";
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 4e3);
		toast("Descargando mis-libros-lumen.html…");
	};
	const compartirVitrina = async () => {
		const html = htmlVitrina();
		if (window.AndroidShare?.shareFile) {
			const b64 = btoa(unescape(encodeURIComponent(html)));
			if (window.AndroidShare.shareFile(b64, "mis-libros-lumen.html", "text/html")) return;
		}
		copiarTexto(html.slice(0, 1e5), toast);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-scrim",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb mp",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pb-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-back",
							onClick: () => onSalir?.(),
							"aria-label": "Volver",
							children: "‹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "📦 Mis publicaciones" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Tu historial: estado, compartir, editar y borrar" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-publicar",
							onClick: () => {
								haptic.tap();
								setVitrinaAbierta(true);
							},
							title: "Tu escaparate para la web",
							children: "🌐 Mi vitrina"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mp-cuerpo",
					children: !cargado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "center-msg",
						style: { padding: 50 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" })
					}) : pubs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "center-msg",
						style: { padding: 50 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { fontSize: 44 },
								children: "🗂️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								style: {
									color: "var(--fg-dim)",
									maxWidth: 320,
									margin: "10px auto"
								},
								children: [
									"Aún no has publicado ningún libro. Cuando publiques, aquí verás",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: " dónde quedó cada uno" }),
									", si llegó a los relays, y podrás compartirlo, editarlo o borrarlo."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pb-siguiente",
								style: { justifyContent: "center" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									onClick: () => onAbrirCatalogo?.(),
									children: "Ir a la Biblioteca Global"
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "row-sub",
						style: { margin: "2px 2px 10px" },
						children: [
							"📡 Relays configurados: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: relays.length }),
							" · Identidad:",
							" ",
							identidad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: npubCorto(identidad.npub) }) : "sin crear"
						]
					}), pubs.map((pub) => {
						const est = estadoDe(pub);
						const abierto = expandido === pub.d;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mp-item" + (abierto ? " abierta" : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "mp-item-head",
								onClick: () => setExpandido(abierto ? null : pub.d),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortadaMini, { pub }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mp-item-txt",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pub.titulo }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												pub.autor,
												" · ",
												new Date(pub.createdAt || Date.now()).toLocaleDateString("es-CO")
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mp-estado mp-estado-" + est.nivel,
												children: est.etiqueta
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tp-acceso-fl",
										children: abierto ? "▾" : "›"
									})
								]
							}), abierto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mp-acciones",
								children: [
									(pub.estadoRelays || []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mp-relays",
										children: (pub.estadoRelays || []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mp-relay",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mp-relay-dot" + (r.ok ? " ok" : "") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: r.url }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: r.ok ? "publicado" : r.detalle || "sin respuesta" })
											]
										}, r.url))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mp-botones",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn primary sm",
												onClick: () => leer(pub),
												children: "👁 Leer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn sm",
												onClick: () => setQrAbierto(pub),
												children: "▦ QR"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn sm",
												onClick: () => setCompartir(pub),
												children: "📤 Compartir"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn sm",
												onClick: () => onEditar?.(pub),
												children: "✏️ Editar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn sm",
												disabled: trabajando === "reenviar",
												onClick: () => reenviar(pub),
												children: trabajando === "reenviar" ? "⏳" : "↻ Reenviar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn danger sm",
												onClick: () => setConfirmarBorrar(pub),
												children: "🗑 Borrar"
											})
										]
									}),
									pub.historial?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
										className: "mp-hist",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
											"🕓 Historial (",
											pub.historial.length,
											")"
										] }), [...pub.historial].reverse().map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mp-hist-item",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: new Date(h.at).toLocaleString("es-CO") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.accion })]
										}, i))]
									}),
									pub.magnet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mp-magnet",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "🧲 Magnet (quien lo tenga puede descargar el libro):" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [String(pub.magnet).slice(0, 70), "…"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn mini",
												onClick: () => copiarTexto(pub.magnet, toast),
												children: "Copiar"
											})
										]
									})
								]
							})]
						}, pub.d);
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!compartir,
				onClose: () => setCompartir(null),
				title: "Compartir «" + (compartir?.titulo || "") + "»",
				children: compartir && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mp-compartir",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "row-sub",
							children: [
								"Elige cómo compartirlo. El ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: ".lumen" }),
								" es el archivo del libro en el formato de la app: quien lo reciba lo abre directo en Lumen Reader (botón + → importar)."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							disabled: trabajando === "lumen",
							onClick: () => compartirLumen(compartir),
							children: trabajando === "lumen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }) : "📖 Enviar el archivo .lumen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => compartirApp(compartir),
							children: "📲 Compartir enlace + magnet (WhatsApp, Telegram…)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								copiarTexto(enlaceDe(compartir), toast);
							},
							children: "🔗 Copiar enlace lumenreader://"
						}),
						compartir.magnet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => copiarTexto(compartir.magnet, toast),
							children: "🧲 Copiar magnet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => {
								setQrAbierto(compartir);
								setCompartir(null);
							},
							children: "▦ Mostrar QR"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!qrAbierto,
				onClose: () => setQrAbierto(null),
				title: "QR de «" + (qrAbierto?.titulo || "") + "»",
				children: qrAbierto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPub, { pub: qrAbierto })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!confirmarBorrar,
				onClose: () => setConfirmarBorrar(null),
				title: "Borrar publicación",
				children: confirmarBorrar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mp-borrar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "row-sub",
						children: "Se pedirá a los relays que eliminen el libro (petición NIP-09) y desaparecerá de tu historial y del catálogo de Lumen. Ten en cuenta que Nostr es una red inmutable: algún relay podría conservar una copia."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pb-siguiente",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => setConfirmarBorrar(null),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn danger",
							disabled: trabajando === "borrar",
							onClick: () => borrar(confirmarBorrar),
							children: trabajando === "borrar" ? "Borrando…" : "🗑 Sí, borrar"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: vitrinaAbierta,
				onClose: () => setVitrinaAbierta(false),
				title: "🌐 Mi vitrina web",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mp-vitrina",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "row-sub",
							children: [
								"Tu ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "escaparate propio" }),
								": una página web autónoma con todos tus libros publicados, lista para subir a ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TU sitio web" }),
								" o compartir donde quieras. Cada libro abre LumenReader con un toque y muestra su magnet para sembrarlo. Es como tu propio relay, pero de cara al público."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mp-vitrina-prev",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								title: "Vista previa de tu vitrina",
								sandbox: "allow-scripts",
								srcDoc: htmlVitrina()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mp-botones",
							style: { marginTop: 10 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary sm",
									onClick: descargarVitrina,
									children: "⬇️ Descargar HTML"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									onClick: compartirVitrina,
									children: "📤 Compartir archivo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									onClick: () => copiarTexto(exportarJson(pubs), toast),
									children: "🧾 Copiar JSON"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "mp-hist",
							style: { marginTop: 10 },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "¿Cómo la pongo en mi web?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								style: {
									margin: "8px 0 0 18px",
									padding: 0,
									color: "var(--fg-dim)",
									fontSize: 12.5,
									lineHeight: 1.6
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Toca ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Descargar HTML" }),
										": se genera ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "mis-libros-lumen.html" }),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Súbelo a tu hosting (carpeta pública, Netlify, GitHub Pages…)." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Enlázalo desde tu web: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "<a href=\"/mis-libros-lumen.html\">Mis libros</a>" }),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cada vez que publiques un libro nuevo, descarga el HTML otra vez y reemplázalo." })
								]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { MisPublicaciones as default };
