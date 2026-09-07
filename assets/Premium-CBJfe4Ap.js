const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./premium-BRwaCNUF.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js","./pdf-C3eksu0f.js","./buscador-BkphWfy2.js"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
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
import { c as haptic, i as TEMAS_PERSONAJE, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { CANAL_TELEGRAM, VENTAJAS, canjearCodigo, estadoPremium, sincronizarCodigos } from "./premium-BRwaCNUF.js";
//#region src/components/Premium.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
/** Abre un enlace fuera de la app. Java primero, navegador como respaldo. */
function abrirFuera(url) {
	try {
		const nat = window.AndroidNav;
		if (nat && typeof nat.abrirFuera === "function" && nat.abrirFuera(url)) return true;
	} catch {}
	try {
		window.open(url, "_blank", "noopener");
		return true;
	} catch {
		return false;
	}
}
function Premium({ onCerrar, toast, onCambio }) {
	const [codigo, setCodigo] = (0, import_react.useState)("");
	const [activo, setActivo] = (0, import_react.useState)(false);
	const [dias, setDias] = (0, import_react.useState)(0);
	const [vencido, setVencido] = (0, import_react.useState)(false);
	const [puedeVolver, setPuedeVolver] = (0, import_react.useState)(false);
	const [cargando, setCargando] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		estadoPremium().then((e) => {
			setActivo(!!e.activo);
			setDias(e.dias || 0);
			setVencido(!!e.vencido);
		}).catch(() => {});
		__vitePreload(() => import("./premium-BRwaCNUF.js").then((m) => m.puedeReactivar()), __vite__mapDeps([0,1,2,3]), import.meta.url).then(setPuedeVolver).catch(() => {});
		sincronizarCodigos().catch(() => {});
	}, []);
	const enviar = async () => {
		const n = codigo.trim();
		if (n.length !== 4) {
			setError("El código son 4 cifras");
			return;
		}
		setCargando(true);
		setError("");
		try {
			const r = await canjearCodigo(n);
			if (r.ok && r.tipo === "premium") {
				haptic.bookDone?.();
				setActivo(true);
				setDias(r.dias || 30);
				setVencido(false);
				setPuedeVolver(false);
				setCodigo("");
				toast?.(r.renovado ? `✨ Premium renovado · ${r.dias} días` : `✨ ¡Premium activado! ${r.dias || 30} días`);
				onCambio?.();
			} else if (r.ok && r.tipo === "busqueda") {
				const { desbloquear } = await __vitePreload(async () => {
					const { desbloquear } = await import("./buscador-BkphWfy2.js");
					return { desbloquear };
				}, __vite__mapDeps([4,1,2]), import.meta.url);
				desbloquear(true);
				setCodigo("");
				toast?.("🔎 Ese es el código de búsqueda avanzada: ya está activa");
			} else {
				setError(r.error || "Ese código no es válido");
				haptic.tap?.();
			}
		} catch (e) {
			setError("No se pudo comprobar. ¿Tienes internet?");
		} finally {
			setCargando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "prem-pantalla",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "prem-top",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "prem-x",
					onClick: onCerrar,
					"aria-label": "Cerrar",
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prem-corona",
					children: activo ? "👑" : "✨"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "prem-titulo",
					children: activo ? "Eres Premium" : "Lumen Premium"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prem-sub",
					children: activo ? dias > 0 ? `Te quedan ${dias} día${dias === 1 ? "" : "s"}` : "Todo desbloqueado. Gracias por sostener esta app." : "Sin anuncios, con temas y letras propias."
				}),
				activo && dias > 0 && dias <= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prem-aviso",
					children: "⏳ Tu Premium vence pronto. Vuelve a escribir tu código para renovarlo otros 30 días."
				}),
				vencido && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prem-aviso",
					children: "Tu Premium venció. Escribe tu código para volver a activarlo."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "prem-cuerpo",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prem-seccion-t",
						children: "Qué incluye"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prem-ventajas",
						children: VENTAJAS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "prem-v" + (activo ? " on" : ""),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "prem-v-ic",
									children: activo ? v.ic : v.ic
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "prem-v-txt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: v.t }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: v.d })]
								}),
								activo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "prem-v-ok",
									children: "✓"
								})
							]
						}, v.t))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prem-seccion-t",
						children: "Los 5 temas de personaje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prem-temas",
						children: TEMAS_PERSONAJE.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "prem-tema",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "prem-tema-bola",
								style: { background: `linear-gradient(135deg, ${t.muestra[0]}, ${t.muestra[1]})` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "prem-tema-txt",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t.desc })]
							})]
						}, t.id))
					})]
				}),
				!activo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prem-seccion-t",
							children: "Cómo conseguir tu código"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "prem-expl",
							children: "El código se consigue fuera de la aplicación, en el canal de Telegram. Allí está el mensaje con las instrucciones de pago y se envían los códigos."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "prem-btn-canal",
							onClick: () => {
								haptic.tap?.();
								abrirFuera("https://t.me/LumenReader");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "prem-btn-ic",
								children: "✈️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Conseguir mi código" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Se abre Telegram, fuera de Lumen" })] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prem-seccion-t",
							children: "Ya tengo mi código"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "prem-form",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "prem-input",
								inputMode: "numeric",
								pattern: "[0-9]*",
								maxLength: 4,
								placeholder: "0000",
								value: codigo,
								onChange: (e) => {
									setError("");
									setCodigo(e.target.value.replace(/\D/g, "").slice(0, 4));
								},
								onKeyDown: (e) => e.key === "Enter" && enviar(),
								"aria-label": "Código de 4 cifras"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "prem-btn-ok",
								onClick: enviar,
								disabled: cargando || codigo.length !== 4,
								children: cargando ? "…" : "Activar"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prem-error",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prem-nota",
							children: "El código no caduca: si más adelante cambia en el canal, el tuyo seguirá funcionando."
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prem-seccion-t",
							children: "Canal de Lumen Reader"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "prem-expl",
							children: "Novedades, avisos y el APK de cada actualización nueva."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "prem-btn-canal sec",
							onClick: () => {
								haptic.tap?.();
								abrirFuera(CANAL_TELEGRAM);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "prem-btn-ic",
								children: "📣"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Unirme al canal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "t.me/LumenReader" })] })]
						})
					]
				}),
				(activo || puedeVolver) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prem-seccion",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prem-seccion-t",
						children: "Gestionar"
					}), activo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "prem-btn-canal sec",
						onClick: async () => {
							if (!window.confirm("Se desactivará el Premium y volverán los anuncios.\n\nNo pierdes los días que te quedan: puedes volver a activarlo cuando quieras.")) return;
							await (await __vitePreload(() => import("./premium-BRwaCNUF.js"), __vite__mapDeps([0,1,2,3]), import.meta.url)).revocarPremium();
							setActivo(false);
							setPuedeVolver(true);
							toast?.("Premium desactivado");
							onCambio?.();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "prem-btn-ic",
							children: "⏸"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Desactivar Premium" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Conservas los días que te quedan" })] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "prem-btn-canal",
						onClick: async () => {
							const r = await (await __vitePreload(() => import("./premium-BRwaCNUF.js"), __vite__mapDeps([0,1,2,3]), import.meta.url)).reactivarPremium();
							if (r.ok) {
								setActivo(true);
								setDias(r.dias);
								setPuedeVolver(false);
								toast?.(`👑 Premium activo otra vez · ${r.dias} días`);
								onCambio?.();
							} else {
								toast?.(r.error);
								setPuedeVolver(false);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "prem-btn-ic",
							children: "▶️"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Volver a activar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Sin gastar otro código" })] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prem-legal",
					children: "Lumen sigue siendo completa sin Premium: se leen todos los libros, con todas las funciones. Premium quita los anuncios y añade temas."
				})
			]
		})]
	});
}
//#endregion
export { Premium as default };
