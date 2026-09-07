const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-DOrzQ79O.js","./rolldown-runtime-D1cXj70v.js","./react-1WJTggxS.js","./db-Ii3ipPL7.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
var __vitePreload = (fn) => fn();
import { r as TEMAS, t as IDIOMAS_APP, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
//#region src/components/Bienvenida.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var VERSION_APP = 32;
var BIENVENIDA = [
	{
		icono: "📖",
		titulo: "Bienvenido a Lumen",
		texto: "Tu lector de libros con voz, traductor y notas. Todo funciona en el teléfono, sin cuentas ni suscripciones."
	},
	{
		icono: "📂",
		titulo: "Mete tu primer libro",
		texto: "Toca el botón + de abajo a la derecha y elige «Importar documentos». Acepta PDF, EPUB, Word, texto y hasta fotos de páginas."
	},
	{
		icono: "🔊",
		titulo: "Que te lo lean",
		texto: "Dentro del libro, el botón «Voz» lee en alto y va resaltando la frase. Mantenlo pulsado para cambiar velocidad y música de fondo."
	},
	{
		icono: "🖍️",
		titulo: "Subraya y guarda",
		texto: "Selecciona cualquier texto y aparecen los colores abajo. Cada color puede significar algo distinto: importante, dudoso, inspirador…"
	},
	{
		icono: "🌐",
		titulo: "Traduce sin salir",
		texto: "Selecciona texto y toca «Traducir». Si mantienes pulsado, traduce la página entera y la guarda para volver a leerla cuando quieras."
	},
	{
		icono: "🔥",
		titulo: "Lee cada día",
		texto: "La app cuenta tu racha y te va desbloqueando temas y logros. Sin prisa: la meta diaria es sólo un empujón, nunca un límite."
	}
];
var NOVEDADES = [
	{
		icono: "↔️",
		titulo: "Desplazamiento a tu medida",
		texto: "El carrusel ahora es Desplazamiento, con cinco modos: lateral (botones translúcidos que no tapan), libro, scroll (solo bajar y subir), mixto y fijo. Se elige en Herramientas."
	},
	{
		icono: "🫥",
		titulo: "Colores de la página y Sin fondo",
		texto: "El menú de la imagen se llama ahora Colores de la página y estrena el filtro Sin fondo: el papel se vuelve transparente y las letras quedan sobre el fondo que elegiste."
	},
	{
		icono: "🎨",
		titulo: "Fondo por libro",
		texto: "El fondo que pongas se guarda sólo para ese libro y aparecerá cada vez que lo abras; si el libro no tiene, se usa el del tema. La pantalla de inicio ya no se queda tapada. Y al traducir, el resultado aparece justo debajo del botón."
	},
	{
		icono: "📚",
		titulo: "Original multi-formato y diccionarios",
		texto: "La pestaña Original ahora muestra EPUB, DOCX, PPTX, XLSX, Markdown, HTML y TXT en su formato original. En Ajustes → Diccionarios puedes descargar, activar e importar diccionarios. El tutorial ya no se mezcla con los logros y los fondos animados por fin funcionan."
	},
	{
		icono: "🔍",
		titulo: "Zoom y contraste en Original",
		texto: "La pestaña Original estrena su propio clúster flotante: acerca o aleja en pasos del 5% y abre el mismo panel de filtros, brillo y contraste que en Imágenes. Los controles ya no se desvanecen: siempre están ahí."
	},
	{
		icono: "🎯",
		titulo: "Metas por libro",
		texto: "En las opciones de cada libro puedes ponerte un plazo (1 semana, 1 mes…) para terminarlo. La meta aparece en tu racha con barra de progreso y botón Leer ahora; si se vence sin terminar, pierdes 15 XP y te avisamos cuando queden 2 días."
	},
	{
		icono: "🔄",
		titulo: "Reiniciar progreso",
		texto: "También en las opciones del libro: vuelve a 0% y sale de Terminados sin tocar tus logros ni tu XP."
	},
	{
		icono: "💬",
		titulo: "Mensajes con formato",
		texto: "Los mensajes guardados ya muestran negrita, cursiva, subrayado, tachado y código de verdad, con más emojis y un botón nuevo de subrayado."
	},
	{
		icono: "🔒",
		titulo: "Secretos con contraseña",
		texto: "Los libros secretos ahora admiten contraseña (desde 1 carácter) también en el navegador, y compartir el libro ya funciona en PC: si el sistema no deja compartir, se descarga el archivo."
	}
];
/** ¿Qué historia toca enseñar, si es que toca alguna? */
async function queMostrar() {
	try {
		const m = await getMeta("bienvenida", null);
		if (!m || !m.visto) return "bienvenida";
		if ((m.version || 0) < 37) return "novedades";
	} catch {}
	return null;
}
async function marcarVisto() {
	try {
		await setMeta({
			id: "bienvenida",
			visto: true,
			version: 37,
			at: Date.now()
		});
	} catch {}
}
function Bienvenida({ tipo, onCerrar, settings, setSettings }) {
	const tarjetas = tipo === "novedades" ? NOVEDADES : BIENVENIDA;
	const [i, setI] = (0, import_react.useState)(0);
	const personalizar = tipo === "bienvenida";
	const [idiomaSel, setIdiomaSel] = (0, import_react.useState)("auto");
	const temasGratis = TEMAS.filter((t) => t.gratis);
	const fijarIdioma = async (v) => {
		setIdiomaSel(v);
		try {
			const { setIdiomaPref } = await __vitePreload(async () => {
				const { setIdiomaPref } = await import("./index-DOrzQ79O.js").then((n) => n.n);
				return { setIdiomaPref };
			}, __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url);
			await setIdiomaPref(v);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		const h = (e) => {
			e.preventDefault?.();
			cerrar();
		};
		window.addEventListener("popstate", h);
		window.history.pushState({ bienvenida: 1 }, "");
		return () => window.removeEventListener("popstate", h);
	}, []);
	const cerrar = async () => {
		await marcarVisto();
		onCerrar?.();
	};
	const avanzar = () => {
		if (i < tarjetas.length - 1) setI(i + 1);
		else cerrar();
	};
	const retroceder = () => setI((n) => Math.max(0, n - 1));
	const t = tarjetas[i];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bien-fondo",
		role: "dialog",
		"aria-modal": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bien-barras",
				children: tarjetas.map((_, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: n <= i ? "on" : "" }, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "bien-saltar",
				onClick: cerrar,
				children: tipo === "novedades" ? "Cerrar" : "Saltar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bien-scroll",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bien-inner",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bien-tarjeta",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bien-icono",
						children: t.icono
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.titulo }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.texto })
				]
			}, i),
			personalizar && i === tarjetas.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bien-personaliza",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "🎨 Personaliza tu Lumen" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "bien-sub",
						children: "Elige cómo se ve y cómo suena. Puedes cambiarlo luego en Ajustes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bien-bloque",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tema (colores)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bien-temas",
							children: temasGratis.map((tm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "bien-tema" + (settings?.theme === tm.id ? " on" : ""),
								onClick: () => setSettings?.({ theme: tm.id }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { background: `linear-gradient(135deg, ${tm.muestra[0]} 50%, ${tm.muestra[1]} 50%)` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tm.nombre })]
							}, tm.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bien-bloque",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Idioma de la app" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "plain",
							value: idiomaSel,
							onChange: (e) => fijarIdioma(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Según el teléfono"
							}), IDIOMAS_APP.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: id.id,
								children: id.nombre
							}, id.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bien-bloque",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tamaño de letra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bien-letra",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									onClick: () => setSettings?.({ appScale: Math.max(80, (settings?.appScale ?? 100) - 10) }),
									children: "A−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [settings?.appScale ?? 100, "%"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn sm",
									onClick: () => setSettings?.({ appScale: Math.min(120, (settings?.appScale ?? 100) + 10) }),
									children: "A+"
								})
							]
						})]
					})
				]
			}, "pers")]
					}, "inner")]
			}, "scrollwrap"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bien-pie",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn bien-ant",
					onClick: retroceder,
					disabled: i === 0,
					children: "← Anterior"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn primary bien-boton",
					onClick: avanzar,
					children: i < tarjetas.length - 1 ? "Siguiente" : "¡Empezar!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bien-cuenta",
					children: [
						i + 1,
						" de ",
						tarjetas.length
					]
				})]
			})
		]
	});
}
//#endregion
export { VERSION_APP, Bienvenida as default, marcarVisto, queMostrar };
