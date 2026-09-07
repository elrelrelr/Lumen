const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-DOrzQ79O.js","./rolldown-runtime-D1cXj70v.js","./react-1WJTggxS.js","./db-Ii3ipPL7.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css"])))=>i.map(i=>d[i]);
import { D as saveSettings, M as withDb, O as setMeta, T as putPage, a as allNotes, f as getAllPages, h as getMeta, i as allHighlights, r as allBooks, v as getSettings, w as putBook } from "./db-Ii3ipPL7.js";
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
//#region src/lib/traspaso.js
var FORMATO = 1;
var APP_VERSION = "45.0.0";
var sePuedeComprimir = () => typeof CompressionStream !== "undefined";
async function comprimir(texto) {
	if (!sePuedeComprimir()) return null;
	try {
		const cs = new CompressionStream("gzip");
		const stream = new Blob([texto]).stream().pipeThrough(cs);
		const buf = await new Response(stream).arrayBuffer();
		const bytes = new Uint8Array(buf);
		let bin = "";
		const TROZO = 32768;
		for (let i = 0; i < bytes.length; i += TROZO) bin += String.fromCharCode(...bytes.subarray(i, i + TROZO));
		return btoa(bin);
	} catch (e) {
		console.warn("[traspaso] comprimir", e?.message || e);
		return null;
	}
}
async function descomprimir(b64) {
	try {
		const bin = atob(b64);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		const ds = new DecompressionStream("gzip");
		const stream = new Blob([bytes]).stream().pipeThrough(ds);
		return await new Response(stream).text();
	} catch (e) {
		console.warn("[traspaso] descomprimir", e?.message || e);
		return null;
	}
}
/**
* Reúne todo el progreso en un objeto.
*
* @param avisar función de progreso (0-100, texto)
*/
async function reunirTodo(avisar = () => {}) {
	avisar(5, "Leyendo tus libros…");
	const libros = await allBooks();
	avisar(15, "Recogiendo las páginas…");
	const paginas = {};
	let i = 0;
	for (const b of libros) {
		const ps = await getAllPages(b.id);
		paginas[b.id] = ps.sort((a, z) => a.index - z.index).map((p) => [p.index, p.text || ""]);
		i++;
		avisar(15 + Math.round(i / Math.max(1, libros.length) * 45), `Libro ${i}/${libros.length}`);
	}
	avisar(65, "Frases y notas…");
	const [frases, notas] = await Promise.all([allHighlights(), allNotes()]);
	avisar(78, "Estadísticas, ajustes, identidad y wallet…");
	const [ajustes, stats, game, aspecto, colecciones, premium, racha] = await Promise.all([
		getSettings(),
		getMeta("stats", null),
		getMeta("game", null),
		getMeta("aspecto", null),
		getMeta("colecciones", null),
		getMeta("premium_estado", null),
		getMeta("streak", null)
	]);
	const [identidad, relays, ledgerAds, campanasAds, poavAds, votosAds, espacioAds, lnAds, validadorAds, autoInvAds, modoAds, moderacionIA, catalogoFiltros] = await Promise.all([
		getMeta("nostr_identidad", null),
		getMeta("nostr_relays", null),
		getMeta("ads_ledger", null),
		getMeta("ads_campanas", null),
		getMeta("ads_poav", null),
		getMeta("ads_votos", null),
		getMeta("ads_espacio", null),
		getMeta("ads_lightning", null),
		getMeta("ads_validador", null),
		getMeta("ads_autoinversion", null),
		getMeta("ads_modo", null),
		getMeta("nostr_moderacion", null),
		getMeta("catalogo_filtros", null)
	]);
	avisar(88, "Empaquetando…");
	return {
		formato: FORMATO,
		app: APP_VERSION,
		fecha: Date.now(),
		libros: libros.map((b) => ({
			...b,
			cover: typeof b.cover === "string" && b.cover.length < 12e4 ? b.cover : null
		})),
		paginas,
		frases,
		notas,
		ajustes,
		stats,
		game,
		aspecto,
		colecciones,
		premium,
		racha,
		identidad,
		relays,
		wallet: {
			ledger: ledgerAds,
			campanas: campanasAds,
			poav: poavAds,
			votos: votosAds,
			espacio: espacioAds,
			lightning: lnAds,
			validador: validadorAds,
			autoinversion: autoInvAds,
			modo: modoAds
		},
		moderacionIA,
		catalogoFiltros
	};
}
/** Cuánto ocuparía el archivo, para avisar antes de generarlo. */
async function tamanoEstimado() {
	const libros = await allBooks();
	let chars = 0;
	for (const b of libros) {
		const ps = await getAllPages(b.id);
		for (const p of ps) chars += (p.text || "").length;
	}
	const bytes = Math.round(chars * .22 * 1.33) + 4e4;
	return {
		libros: libros.length,
		bytes
	};
}
/**
* Genera el archivo `.lumen` y lo entrega al usuario.
*
* Devuelve `{ ok, nombre, bytes, ruta }`.
*/
async function exportarProgreso(avisar = () => {}) {
	const datos = await reunirTodo(avisar);
	const json = JSON.stringify(datos);
	avisar(92, "Comprimiendo…");
	const gz = await comprimir(json);
	const contenido = gz ? JSON.stringify({
		lumen: FORMATO,
		gz
	}) : json;
	const nombre = `Lumen-respaldo-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}-${Array.isArray(datos.libros) ? datos.libros.length : 0}libros.lumen`;
	avisar(96, "Guardando…");
	try {
		const st = typeof window !== "undefined" ? window.AndroidStore : null;
		if (st && typeof st.guardarEnDescargas === "function") {
			const ruta = st.guardarEnDescargas(nombre, contenido);
			if (ruta) {
				avisar(100, "Listo");
				return {
					ok: true,
					nombre,
					bytes: contenido.length,
					ruta
				};
			}
		}
	} catch (e) {
		console.warn("[traspaso] puente", e?.message || e);
	}
	try {
		const blob = new Blob([contenido], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = nombre;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 4e3);
		avisar(100, "Listo");
		return {
			ok: true,
			nombre,
			bytes: contenido.length,
			ruta: null
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message || String(e)
		};
	}
}
/**
* Serializa todo el progreso en el string portable del respaldo `.lumen`
* (comprimido si el navegador lo permite), SIN guardarlo en disco. Lo usa la
* copia en la nube para poder subirlo por HTTP. Antes la nube llamaba a
* `reunirTodo()` y subía `[object Object]` (bug): el respaldo era basura.
*/
async function serializarTodo(avisar = () => {}) {
	const datos = await reunirTodo(avisar);
	const json = JSON.stringify(datos);
	avisar(92, "Comprimiendo…");
	const gz = await comprimir(json);
	return {
		contenido: gz ? JSON.stringify({
			lumen: FORMATO,
			gz
		}) : json,
		nombre: `lumen-progreso-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.lumen`
	};
}
/** Lee el contenido de un archivo `.lumen` y devuelve el objeto. */
async function leerArchivo(texto) {
	let crudo = String(texto || "").trim();
	if (!crudo) return null;
	try {
		const obj = JSON.parse(crudo);
		if (obj?.gz) {
			const plano = await descomprimir(obj.gz);
			return plano ? JSON.parse(plano) : null;
		}
		return obj;
	} catch (e) {
		console.warn("[traspaso] leer", e?.message || e);
		return null;
	}
}
/**
* Mete el progreso en la app. FUSIONA: nunca borra nada de lo que ya hay.
*
* @returns { libros, saltados, frases, notas, ajustes }
*/
async function importarProgreso(datos, avisar = () => {}) {
	if (!datos || typeof datos !== "object") throw new Error("El archivo no es un respaldo de Lumen");
	if (datos.formato > FORMATO) throw new Error(`Ese respaldo es de una versión más nueva de Lumen (${datos.app || "?"}). Actualiza la app antes de importarlo.`);
	const resumen = {
		libros: 0,
		saltados: 0,
		frases: 0,
		notas: 0,
		ajustes: false
	};
	avisar(5, "Comprobando lo que ya tienes…");
	const actuales = await allBooks();
	const yaEstan = new Set(actuales.map((b) => b.id));
	const porTitulo = new Set(actuales.map((b) => `${(b.title || "").toLowerCase()}|${(b.author || "").toLowerCase()}`));
	const libros = Array.isArray(datos.libros) ? datos.libros : [];
	let i = 0;
	for (const b of libros) {
		i++;
		avisar(5 + Math.round(i / Math.max(1, libros.length) * 70), `Libro ${i}/${libros.length}`);
		const clave = `${(b.title || "").toLowerCase()}|${(b.author || "").toLowerCase()}`;
		if (yaEstan.has(b.id) || porTitulo.has(clave)) {
			resumen.saltados++;
			continue;
		}
		try {
			await putBook(b);
			const ps = datos.paginas?.[b.id] || [];
			for (const [idx, texto] of ps) await putPage({
				bookId: b.id,
				index: idx,
				text: texto
			});
			resumen.libros++;
			yaEstan.add(b.id);
			porTitulo.add(clave);
		} catch (e) {
			console.warn("[traspaso] libro", b.id, e?.message || e);
		}
	}
	avisar(80, "Frases y notas…");
	for (const h of datos.frases || []) try {
		if (!await withDb((d) => d.get("highlights", h.id)).catch(() => null)) {
			await withDb((d) => d.put("highlights", h));
			resumen.frases++;
		}
	} catch {}
	for (const n of datos.notas || []) try {
		if (!await withDb((d) => d.get("notes", n.id)).catch(() => null)) {
			await withDb((d) => d.put("notes", n));
			resumen.notas++;
		}
	} catch {}
	avisar(90, "Ajustes y progreso…");
	try {
		if (datos.ajustes) {
			await saveSettings(datos.ajustes);
			resumen.ajustes = true;
		}
		if (datos.stats) {
			const actual = await getMeta("stats", null);
			const dias = {
				...datos.stats.days || {},
				...actual?.days || {}
			};
			await setMeta({
				id: "stats",
				...datos.stats,
				...actual || {},
				days: dias
			});
		}
		if (datos.game) {
			const actual = await getMeta("game", null);
			await setMeta({
				id: "game",
				...datos.game,
				...actual || {},
				xp: Math.max(datos.game.xp || 0, actual?.xp || 0)
			});
		}
		if (datos.aspecto) await setMeta({
			id: "aspecto",
			...datos.aspecto
		});
		if (datos.colecciones) await setMeta({
			id: "colecciones",
			...datos.colecciones
		});
		if (datos.racha) await setMeta({
			id: "streak",
			...datos.racha
		});
		if (datos.premium?.activo) {
			await setMeta({
				id: "premium_estado",
				activo: true,
				desde: datos.premium.desde || Date.now()
			});
			(await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.p), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url)).fijarPremiumPagado?.(true);
		}
		if (datos.identidad?.identidad) {
			if (!(await getMeta("nostr_identidad", null))?.identidad) await setMeta({
				id: "nostr_identidad",
				...datos.identidad
			});
		}
		if (datos.relays?.relays) {
			if (!(await getMeta("nostr_relays", null))?.relays) await setMeta({
				id: "nostr_relays",
				...datos.relays
			});
		}
		if (datos.moderacionIA?.config) await setMeta({
			id: "nostr_moderacion",
			...datos.moderacionIA
		});
		if (datos.catalogoFiltros) await setMeta({
			id: "catalogo_filtros",
			...datos.catalogoFiltros
		});
		const w = datos.wallet || {};
		if (w.ledger) await setMeta({
			id: "ads_ledger",
			...w.ledger
		});
		if (w.campanas) await setMeta({
			id: "ads_campanas",
			...w.campanas
		});
		if (w.poav) await setMeta({
			id: "ads_poav",
			...w.poav
		});
		if (w.votos) await setMeta({
			id: "ads_votos",
			...w.votos
		});
		if (w.espacio) await setMeta({
			id: "ads_espacio",
			...w.espacio
		});
		if (w.lightning) await setMeta({
			id: "ads_lightning",
			...w.lightning
		});
		if (w.validador) await setMeta({
			id: "ads_validador",
			...w.validador
		});
		if (w.autoinversion) await setMeta({
			id: "ads_autoinversion",
			...w.autoinversion
		});
		if (w.modo) await setMeta({
			id: "ads_modo",
			...w.modo
		});
	} catch (e) {
		console.warn("[traspaso] ajustes", e?.message || e);
	}
	avisar(100, "Listo");
	return resumen;
}
/** Tamaño legible. */
function legible(bytes) {
	if (!bytes) return "0 B";
	const u = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.min(u.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}
if (typeof window !== "undefined") window.__lumenTraspaso = {
	exportarProgreso,
	serializarTodo,
	importarProgreso,
	leerArchivo,
	reunirTodo,
	tamanoEstimado,
	legible
};
//#endregion
export { exportarProgreso, importarProgreso, leerArchivo, legible, reunirTodo, serializarTodo, tamanoEstimado };
