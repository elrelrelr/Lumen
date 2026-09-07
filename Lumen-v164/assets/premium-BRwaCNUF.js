const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-DOrzQ79O.js","./rolldown-runtime-D1cXj70v.js","./react-1WJTggxS.js","./db-Ii3ipPL7.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css"])))=>i.map(i=>d[i]);
import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
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
//#region src/lib/premium.js
var URL_CODIGOS = "https://telegra.ph/C%C3%B3digos-08-01-2";
var CANAL_TELEGRAM = "https://t.me/LumenReader";
var RESPALDO_PREMIUM = "1111";
var RESPALDO_BUSQUEDA = "2000";
var CLAVE_ESTADO = "premium_estado";
var DIAS_PREMIUM = 30;
var MS_DIA = 1440 * 60 * 1e3;
var CLAVE_CODIGOS = "premium_codigos";
var revolver = (s) => btoa(String(s).split("").map((c) => String.fromCharCode(c.charCodeAt(0) ^ 42)).join(""));
/**
* Saca los dos códigos del texto de la página.
*
* Formato acordado con el usuario:
*   (1111) → premium        [2000] → búsquedas avanzadas
*
* Se admiten espacios dentro de las llaves y cualquier cosa alrededor, para
* que la página se pueda maquetar con títulos y explicaciones sin romper
* nada. Se toma la PRIMERA coincidencia válida de cada tipo.
*/
function extraerCodigos(texto) {
	const plano = String(texto || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
	const mp = plano.match(/\(\s*(\d{4})\s*\)/);
	const mb = plano.match(/\[\s*(\d{4})\s*\]/);
	return {
		premium: mp ? mp[1] : null,
		busqueda: mb ? mb[1] : null
	};
}
/**
* Descarga la página y guarda los códigos (revueltos).
*
* Devuelve `{ ok, origen }` sin revelar NUNCA los códigos: el usuario pidió
* expresamente que la app no los enseñe. `origen` sirve para diagnóstico:
* 'red' | 'nativo' | 'cache' | 'respaldo'.
*/
async function sincronizarCodigos({ forzar = false } = {}) {
	const guardado = await getMeta(CLAVE_CODIGOS, null);
	const hace = Date.now() - (guardado?.at || 0);
	if (!forzar && guardado?.p && hace < 360 * 60 * 1e3) return {
		ok: true,
		origen: "cache"
	};
	let texto = null;
	try {
		const r = await fetch(URL_CODIGOS, { cache: "no-store" });
		if (r.ok) texto = await r.text();
	} catch {}
	let origen = "red";
	if (!texto) try {
		const nat = typeof window !== "undefined" ? window.AndroidNav : null;
		if (nat && typeof nat.leerWeb === "function") {
			texto = nat.leerWeb(URL_CODIGOS);
			origen = "nativo";
		}
	} catch {}
	if (!texto) return {
		ok: !!guardado?.p,
		origen: guardado?.p ? "cache" : "respaldo"
	};
	const { premium, busqueda } = extraerCodigos(texto);
	if (!premium && !busqueda) return {
		ok: !!guardado?.p,
		origen: guardado?.p ? "cache" : "respaldo"
	};
	await setMeta({
		id: CLAVE_CODIGOS,
		at: Date.now(),
		p: premium ? revolver(premium) : guardado?.p || null,
		b: busqueda ? revolver(busqueda) : guardado?.b || null
	});
	return {
		ok: true,
		origen
	};
}
/** Códigos válidos ahora mismo, ya revueltos (nunca en claro). */
async function codigosValidos() {
	const g = await getMeta(CLAVE_CODIGOS, null);
	return {
		p: g?.p || revolver(RESPALDO_PREMIUM),
		b: g?.b || revolver(RESPALDO_BUSQUEDA)
	};
}
async function avisarMonetize(v) {
	try {
		(await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.p), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url)).fijarPremiumPagado?.(!!v);
	} catch {}
}
var _cache = null;
var cambios = /* @__PURE__ */ new Set();
function onPremiumCambio(cb) {
	cambios.add(cb);
	return () => cambios.delete(cb);
}
function emitirCambio(v) {
	for (const cb of cambios) try {
		cb(!!v);
	} catch {}
}
async function estadoPremium() {
	const m = await getMeta(CLAVE_ESTADO, null);
	const ahora = Date.now();
	const hasta = m?.hasta || 0;
	let activo = !!m?.activo;
	if (activo && !hasta) {
		const nuevoHasta = ahora + 30 * MS_DIA;
		await setMeta({
			...m,
			id: CLAVE_ESTADO,
			hasta: nuevoHasta
		});
		_cache = {
			activo: true,
			desde: m?.desde || ahora,
			hasta: nuevoHasta,
			dias: 30
		};
		await avisarMonetize(true);
		return _cache;
	}
	if (activo && hasta && ahora > hasta) {
		activo = false;
		await setMeta({
			...m,
			id: CLAVE_ESTADO,
			activo: false,
			vencido: true
		});
	}
	const restan = activo && hasta ? Math.ceil((hasta - ahora) / MS_DIA) : 0;
	const antes = _cache?.activo;
	_cache = {
		activo,
		desde: m?.desde || 0,
		hasta,
		dias: restan,
		vencido: !!m?.vencido && !activo,
		tema: m?.tema || null
	};
	await avisarMonetize(_cache.activo);
	if (!!_cache.activo !== !!antes) emitirCambio(_cache.activo);
	return _cache;
}
/** Lectura sincrona (puede ir un instante desfasada; se refresca al inicio). */
var esPremium = () => !!_cache?.activo;
/** Para que otros módulos rellenen la copia sin pedirla otra vez. */
function fijarCachePremium(v) {
	_cache = {
		..._cache || {},
		activo: !!v
	};
}
/**
* Comprueba un código escrito por el usuario.
*
* Acepta el de premium y también el de búsquedas: si alguien escribe el de
* búsquedas en la pantalla premium se le dice qué ha desbloqueado, en vez de
* darle un «código incorrecto» que le haría pensar que le han estafado.
*/
async function canjearCodigo(entrada) {
	const n = String(entrada || "").trim();
	if (!/^\d{4}$/.test(n)) return {
		ok: false,
		error: "El código son 4 cifras"
	};
	await sincronizarCodigos({ forzar: true }).catch(() => {});
	const v = await codigosValidos();
	const r = revolver(n);
	if (r === v.p) {
		const ahora = Date.now();
		const previo = await getMeta(CLAVE_ESTADO, null);
		const restaban = previo?.activo && previo?.hasta > ahora ? previo.hasta - ahora : 0;
		const hasta = ahora + 30 * MS_DIA + restaban;
		await setMeta({
			id: CLAVE_ESTADO,
			activo: true,
			desde: previo?.desde || ahora,
			hasta,
			vencido: false,
			renovaciones: (previo?.renovaciones || 0) + (previo?.activo ? 1 : 0)
		});
		_cache = {
			activo: true,
			desde: previo?.desde || ahora,
			hasta,
			dias: Math.ceil((hasta - ahora) / MS_DIA)
		};
		await avisarMonetize(true);
		return {
			ok: true,
			tipo: "premium",
			dias: _cache.dias,
			renovado: !!restaban
		};
	}
	if (r === v.b) return {
		ok: true,
		tipo: "busqueda"
	};
	return {
		ok: false,
		error: "Ese código no es válido"
	};
}
/** Sólo para pruebas y para el botón «quitar premium» de diagnóstico. */
/**
* Apaga el Premium SIN tirar los días que quedan.
*
* Lo pidió el usuario («Opcion de desactivar modo premium»). Sirve para ver
* cómo se ve la app sin premium o para prestar el móvil. Como `hasta` se
* conserva, volver a escribir el mismo código lo reactiva sin gastar otro
* mes: quitarle los días a quien ya pagó por pulsar un botón sería un abuso.
*/
async function revocarPremium() {
	const previo = await getMeta(CLAVE_ESTADO, null);
	await setMeta({
		...previo || {},
		id: CLAVE_ESTADO,
		activo: false,
		desactivadoAdrede: true
	});
	_cache = {
		activo: false,
		hasta: previo?.hasta || 0,
		dias: 0
	};
	await avisarMonetize(false);
	emitirCambio(false);
}
/** Vuelve a encender un premium que el usuario apagó a mano, si aún vale. */
async function reactivarPremium() {
	const previo = await getMeta(CLAVE_ESTADO, null);
	const ahora = Date.now();
	if (!previo?.hasta || previo.hasta <= ahora) return {
		ok: false,
		error: "Tu Premium ya venció: escribe un código nuevo"
	};
	await setMeta({
		...previo,
		id: CLAVE_ESTADO,
		activo: true,
		desactivadoAdrede: false
	});
	_cache = {
		activo: true,
		desde: previo.desde || ahora,
		hasta: previo.hasta,
		dias: Math.ceil((previo.hasta - ahora) / MS_DIA)
	};
	await avisarMonetize(true);
	return {
		ok: true,
		dias: _cache.dias
	};
}
/** ¿Se puede reactivar sin código? (lo apagó él y aún le quedan días) */
async function puedeReactivar() {
	const m = await getMeta(CLAVE_ESTADO, null);
	return !!(m?.desactivadoAdrede && m?.hasta > Date.now());
}
var VENTAJAS = [
	{
		ic: "🚫",
		t: "Sin anuncios",
		d: "Ni en los estados de los libros ni al usar el OCR. Ninguno, en ningún sitio."
	},
	{
		ic: "🎨",
		t: "5 temas de personaje",
		d: "Colores, fondo e imagen propios. Cambian la app entera, no sólo el lector."
	},
	{
		ic: "🔤",
		t: "Tipografías exclusivas",
		d: "Cada tema trae su letra, y se aplica también a los menús de la app."
	},
	{
		ic: "📤",
		t: "Exportar sin marca de agua",
		d: "Las citas y los PDF salen limpios, sin el sello de Lumen."
	},
	{
		ic: "🔎",
		t: "Búsqueda avanzada incluida",
		d: "Todas las fuentes de libros disponibles, sin código aparte."
	},
	{
		ic: "💛",
		t: "Apoyas el desarrollo",
		d: "Lumen no tiene empresa detrás: la mantiene una persona."
	}
];
if (typeof window !== "undefined") window.__lumenPremium = {
	estadoPremium,
	esPremium,
	canjearCodigo,
	revocarPremium,
	reactivarPremium,
	puedeReactivar,
	DIAS_PREMIUM: 30,
	sincronizarCodigos,
	extraerCodigos,
	URL_CODIGOS,
	CANAL_TELEGRAM,
	VENTAJAS
};
//#endregion
export { CANAL_TELEGRAM, DIAS_PREMIUM, URL_CODIGOS, VENTAJAS, canjearCodigo, esPremium, estadoPremium, extraerCodigos, fijarCachePremium, onPremiumCambio, puedeReactivar, reactivarPremium, revocarPremium, sincronizarCodigos };
