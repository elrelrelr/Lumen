const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./premium-BRwaCNUF.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js","./pdf-C3eksu0f.js"])))=>i.map(i=>d[i]);
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
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { DIRECCIONES, FUENTES_PREMIUM, TEMAS_PREMIUM, copiarDireccion, estadoApoyo, marcarCopiado, marcarMostrada, noMostrarMas } from "./donar-Bb6VSEld.js";
//#region src/components/Apoyar.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var TARJETAS = [
	{
		icono: "📖",
		titulo: "Lumen es tuya",
		texto: "Sin cuentas, sin suscripciones y sin vender tus datos. Todo lo que lees se queda en tu teléfono, y así va a seguir."
	},
	{
		icono: "🌱",
		titulo: "Hecha poco a poco",
		texto: "Cada función que usas salió de alguien que la pidió. La app crece con lo que la gente cuenta que necesita."
	},
	{
		icono: "💙",
		titulo: "¿Te apetece echar una mano?",
		texto: "Si Lumen te sirve, una donación ayuda a que siga creciendo. Y si no puedes, no pasa absolutamente nada: sigue disfrutándola igual."
	}
];
function Apoyar({ modo = "pantalla", onCerrar, toast, onAbrirPremium }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [verRedes, setVerRedes] = (0, import_react.useState)(modo !== "historia");
	const [copiada, setCopiada] = (0, import_react.useState)("");
	const [premium, setPremium] = (0, import_react.useState)(false);
	const [premActivo, setPremActivo] = (0, import_react.useState)(false);
	const [premDias, setPremDias] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		__vitePreload(() => import("./premium-BRwaCNUF.js").then((p) => p.estadoPremium()), __vite__mapDeps([0,1,2,3]), import.meta.url).then((e) => {
			setPremActivo(!!e.activo);
			setPremDias(e.dias || 0);
		}).catch(() => {});
	}, []);
	usarPantallaAtras(() => onCerrar?.(), () => {
		if (modo === "historia" && verRedes) {
			setVerRedes(false);
			return true;
		}
		return false;
	});
	const recargar = (0, import_react.useCallback)(async () => {
		const e = await estadoApoyo();
		setPremium(!!e.premium);
	}, []);
	(0, import_react.useEffect)(() => {
		recargar();
		if (modo === "historia") marcarMostrada().catch(() => {});
	}, [recargar, modo]);
	const copiar = async (d) => {
		if (!await copiarDireccion(d.direccion)) {
			toast?.("No se pudo copiar. Mantén pulsada la dirección para copiarla.");
			return;
		}
		setCopiada(d.id);
		haptic.success();
		await marcarCopiado(d.red);
		setPremium(true);
		toast?.("¡Gracias de verdad! 💙 Ya puedes usar los temas y las letras nuevas");
		setTimeout(() => setCopiada(""), 2600);
	};
	if (modo === "historia" && !verRedes) {
		const t = TARJETAS[i];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bien-fondo apoyo-hist",
			role: "dialog",
			"aria-modal": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bien-barras",
					children: TARJETAS.map((_, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: n <= i ? "on" : "" }, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "bien-saltar",
					onClick: () => onCerrar?.(),
					children: "Ahora no"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "bien-zona izq",
					"aria-label": "Anterior",
					onClick: () => setI((n) => Math.max(0, n - 1))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "bien-zona der",
					"aria-label": "Siguiente",
					onClick: () => setI((n) => Math.min(TARJETAS.length - 1, n + 1))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bien-tarjeta",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bien-icono apoyo-icono",
							children: t.icono
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.titulo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.texto })
					]
				}, i),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bien-pie",
					children: [i < TARJETAS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn primary bien-boton",
						onClick: () => setI(i + 1),
						children: "Siguiente"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary bien-boton apoyo-cta",
							onClick: () => setVerRedes(true),
							children: "💙 Quiero apoyar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "apoyo-no",
							onClick: () => onCerrar?.(),
							children: "Ahora no, gracias"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "apoyo-nunca",
							onClick: async () => {
								await noMostrarMas();
								toast?.("No se volverá a mostrar");
								onCerrar?.();
							},
							children: "No volver a preguntar"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bien-cuenta",
						children: [
							i + 1,
							" de ",
							TARJETAS.length
						]
					})]
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "apoyo-pantalla",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp-top",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "icon-btn back",
				onClick: () => modo === "historia" ? setVerRedes(false) : onCerrar?.(),
				"aria-label": "Volver",
				children: "‹"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tp-titulo",
				children: "Apoyar a Lumen"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp-cuerpo",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "apoyo-intro",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "apoyo-corazon",
						children: "💙"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gracias por pensarlo. Elige la red que te resulte más cómoda, copia la dirección o escanea el código." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "prem-fila prem-fila-donar" + (premActivo ? " on" : ""),
					onClick: () => {
						haptic.tap?.();
						onAbrirPremium?.();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "prem-fila-ic",
							children: premActivo ? "👑" : "✨"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "prem-fila-txt",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: premActivo ? "Lumen Premium activo" : "Lumen Premium" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: premActivo ? premDias > 0 ? `Te quedan ${premDias} día${premDias === 1 ? "" : "s"}` : "Sin anuncios · temas y letras propias" : "Quita los anuncios y añade 10 temas con fondo y letra propia" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "prem-fila-ir",
							children: "›"
						})
					]
				}),
				DIRECCIONES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "apoyo-red",
					style: { "--c": d.color },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "apoyo-red-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "apoyo-punto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: d.nombre })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "apoyo-qr",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: d.qr,
								alt: `Código QR de la dirección ${d.red}`,
								loading: "lazy"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "apoyo-dir",
							onClick: () => copiar(d),
							children: d.direccion
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary apoyo-copiar" + (copiada === d.id ? " hecho" : ""),
							onClick: () => copiar(d),
							children: copiada === d.id ? "✓ ¡Copiada! Gracias 💙" : "📋 Copiar dirección"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "apoyo-nota",
							children: d.nota
						})
					]
				}, d.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "apoyo-premios",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "apoyo-premios-tit",
							children: premium ? "🎁 Desbloqueado · ¡gracias!" : "🎁 Un detalle por copiar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "apoyo-premios-sub",
							children: premium ? "Ya puedes usarlos desde Ajustes → Tema y apariencia." : "Al copiar cualquier dirección se activan 3 temas y 3 letras nuevas."
						}),
						premium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "apoyo-probar",
							children: [
								["aurora", "🌌 Aurora"],
								["cafe", "☕ Café"],
								["esmeralda", "💚 Esmeralda"]
							].map(([id, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "apoyo-tema",
								onClick: () => {
									document.documentElement.dataset.theme = id;
									__vitePreload(() => import("./db-Ii3ipPL7.js").then((n) => n.s).then((m) => m.saveSettings({ theme: id })), __vite__mapDeps([1,2]), import.meta.url).catch(() => {});
									toast?.(`Tema ${et.split(" ")[1]} aplicado`);
								},
								children: et
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "apoyo-lista",
							children: [TEMAS_PREMIUM.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "apoyo-item" + (premium ? " on" : ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "apoyo-item-ic",
									children: premium ? t.icono : "🔒"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "apoyo-item-txt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t.desc })]
								})]
							}, t.id)), FUENTES_PREMIUM.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "apoyo-item" + (premium ? " on" : ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "apoyo-item-ic",
									style: { fontFamily: f.css },
									children: premium ? "Aa" : "🔒"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "apoyo-item-txt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: f.desc })]
								})]
							}, f.id))]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "apoyo-legal",
					children: "Lumen seguirá siendo gratis y completa dona o no dones. Esto es voluntario y no desbloquea ninguna función de lectura."
				})
			]
		})]
	});
}
//#endregion
export { Apoyar as default };
