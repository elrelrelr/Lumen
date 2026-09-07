const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./torrent-DS6cTKT6.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js"])))=>i.map(i=>d[i]);
import { O as setMeta, h as getMeta, k as uid } from "./db-Ii3ipPL7.js";
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
import { borrarDescarga, cancelar, descargar, pedirMetadatos, traerArchivo } from "./torrent-DS6cTKT6.js";
//#region src/lib/torrentStore.js
var CLAVE = "torrent_biblioteca";
/** Formatos de libro que el lector abre directamente. */
var FORMATOS_LIBRO = {
	epub: "EPUB",
	pdf: "PDF",
	mobi: "MOBI",
	azw: "AZW",
	azw3: "AZW3",
	fb2: "FB2",
	txt: "Texto",
	html: "HTML",
	htm: "HTML",
	rtf: "RTF",
	doc: "Word",
	docx: "Word",
	cbz: "Cómic",
	cbr: "Cómic",
	djvu: "DjVu",
	srt: "Subtítulos"
};
/** Comprimidos: `parcial` indica si se puede sacar UN fichero suelto. */
var FORMATOS_COMPRIMIDOS = {
	zip: {
		nombre: "ZIP",
		parcial: true
	},
	rar: {
		nombre: "RAR",
		parcial: false
	},
	"7z": {
		nombre: "7Z",
		parcial: false
	},
	tar: {
		nombre: "TAR",
		parcial: false
	},
	gz: {
		nombre: "GZIP",
		parcial: false
	}
};
var extensionDe = (nombre) => {
	const m = String(nombre || "").toLowerCase().match(/\.([a-z0-9]{1,5})$/);
	return m ? m[1] : "";
};
var esLibro = (nombre) => !!FORMATOS_LIBRO[extensionDe(nombre)];
/** ¿Es un volumen de un comprimido partido? (.r00, .z01, .001, .partN) */
var esVolumenPartido = (nombre) => /\.part\d+\.[a-z0-9]+$|\.r\d\d$|\.z\d\d$|\.(7z|zip|rar)\.\d{3}$/.test(String(nombre || "").toLowerCase());
var esComprimido = (nombre) => !!FORMATOS_COMPRIMIDOS[extensionDe(nombre)] || esVolumenPartido(nombre);
/**
* ¿Un comprimido admite sacar un solo fichero sin bajarlo entero?
*
* ZIP guarda un índice al final y cada entrada por separado, así que en
* teoría sí. RAR sólido y 7Z comprimen todo junto: para sacar un fichero hay
* que descomprimir desde el principio. Y los partidos (.part1, .r00) están
* encadenados por definición.
*/
function admiteParcial(nombre) {
	const n = String(nombre || "").toLowerCase();
	if (/\.part\d+\.[a-z0-9]+$|\.r\d\d$|\.z\d\d$|\.(7z|zip|rar)\.\d{3}$/.test(n)) return false;
	const info = FORMATOS_COMPRIMIDOS[extensionDe(nombre)];
	if (!info) return true;
	return info.parcial;
}
/** Tamaño legible. */
var tam = (n) => {
	const x = Number(n) || 0;
	if (x < 1024) return x + " B";
	if (x < 1048576) return (x / 1024).toFixed(0) + " KB";
	if (x < 1073741824) return (x / 1048576).toFixed(1) + " MB";
	return (x / 1073741824).toFixed(2) + " GB";
};
/**
* Cuánto hay que descargar REALMENTE para conseguir un archivo.
*
* Si el libro va suelto, sólo su tamaño. Si está dentro de un comprimido que
* no admite extracción parcial, hay que bajarlo entero: eso es lo que se le
* avisa al usuario antes de empezar.
*/
/**
* Nombre base de un conjunto multiparte.
* «Biblioteca_2021.part03.rar» → «Biblioteca_2021»
* «Coleccion.r05»              → «Coleccion»
* «Libros.7z.002»              → «Libros.7z»
*/
function baseConjunto(nombre) {
	const n = String(nombre || "");
	for (const re of [
		/\.part\d+\.[a-z0-9]+$/i,
		/\.r\d\d$/i,
		/\.z\d\d$/i,
		/\.7z\.\d{3}$/i,
		/\.zip\.\d{3}$/i,
		/\.(rar|zip|7z)$/i
	]) if (re.test(n)) return n.replace(re, "");
	return n;
}
/** Las partes de un mismo conjunto, ordenadas. */
function partesDelConjunto(archivo, todos = []) {
	const base = baseConjunto(archivo.nombre);
	return todos.filter((x) => esComprimido(x.nombre) && baseConjunto(x.nombre) === base).sort((a, b) => a.nombre.localeCompare(b.nombre, void 0, { numeric: true }));
}
/**
* Cuánto hay que descargar de verdad.
*
* Devuelve DOS cifras, porque son cosas distintas y antes se mezclaban:
*   · `bytesVistazo`: lo mínimo para ver QUÉ contiene (la cabecera, que va
*     en el primer volumen).
*   · `bytes`: lo que hace falta para SACAR un libro de dentro.
*
* Con compresión sólida hay que bajarlo todo y así se dice. Si NO es sólido
* —lo habitual en las bibliotecas grandes, donde cada libro se comprime por
* separado— no se puede saber el tamaño exacto sin leer la cabecera, y se
* dice eso mismo en vez de inventar una cifra.
*/
function costeReal(archivo, todos = []) {
	if (!archivo) return {
		bytes: 0,
		aviso: null
	};
	if (esComprimido(archivo.nombre)) {
		const partes = partesDelConjunto(archivo, todos);
		const esConjunto = partes.length > 1;
		const total = esConjunto ? partes.reduce((s, x) => s + (x.bytes || 0), 0) : archivo.bytes || 0;
		const primera = esConjunto ? partes[0].bytes || 0 : archivo.bytes || 0;
		const vistazo = Math.min(primera, 24 * 1024 * 1024);
		if (!admiteParcial(archivo.nombre) || esConjunto) return {
			bytes: total,
			bytesVistazo: vistazo,
			partes: partes.length,
			conjunto: esConjunto ? baseConjunto(archivo.nombre) : null,
			comprimido: true,
			aviso: `Este libro está dentro de un archivo comprimido y requiere descargar aproximadamente ${tam(total)} para extraerlo.`,
			detalle: esConjunto ? `Son ${partes.length} partes de un mismo archivo. Con ${tam(vistazo)} se puede ver qué contiene; si el comprimido no es sólido, quizá baste con descargar parte de los volúmenes.` : null
		};
		return {
			bytes: total,
			bytesVistazo: Math.min(total, 4 * 1024 * 1024),
			partes: 1,
			comprimido: true,
			aviso: `Es un archivo comprimido de ${tam(total)}. La app intentará sacar sólo el libro que elijas.`
		};
	}
	return {
		bytes: archivo.bytes || 0,
		bytesVistazo: 0,
		aviso: null
	};
}
/**
* Agrupa la lista de archivos: los volúmenes de un mismo comprimido pasan a
* ser UNA entrada con sus partes dentro.
*
* Antes «Biblioteca.part01.rar … part24.rar» se enseñaban como 24 filas
* repetidas; ahora es una sola: «Biblioteca · 24 partes · 91,7 GB».
*/
function agruparArchivos(archivos = []) {
	const sueltos = [];
	const conjuntos = /* @__PURE__ */ new Map();
	for (const a of archivos) {
		if (!esComprimido(a.nombre)) {
			sueltos.push(a);
			continue;
		}
		const base = baseConjunto(a.nombre);
		if (!conjuntos.has(base)) conjuntos.set(base, []);
		conjuntos.get(base).push(a);
	}
	const grupos = [];
	for (const [base, partes] of conjuntos) {
		partes.sort((x, y) => x.nombre.localeCompare(y.nombre, void 0, { numeric: true }));
		if (partes.length === 1) {
			grupos.push({
				...partes[0],
				esGrupo: false
			});
			continue;
		}
		grupos.push({
			i: partes[0].i,
			nombre: base,
			bytes: partes.reduce((s, x) => s + (x.bytes || 0), 0),
			esGrupo: true,
			partes,
			indices: partes.map((x) => x.i)
		});
	}
	return {
		sueltos,
		grupos
	};
}
var cache = null;
async function cargar() {
	if (cache) return cache;
	cache = { entradas: (await getMeta(CLAVE, null))?.entradas || [] };
	return cache;
}
async function guardar() {
	if (!cache) return;
	try {
		await setMeta({
			id: CLAVE,
			entradas: cache.entradas,
			at: Date.now()
		});
	} catch (e) {
		console.warn("[torrentStore] guardar", e?.message || e);
	}
	avisar();
}
/** Todas las entradas guardadas, de la más reciente a la más antigua. */
async function listar() {
	return [...(await cargar()).entradas].sort((a, b) => (b.at || 0) - (a.at || 0));
}
async function obtener(id) {
	return (await cargar()).entradas.find((x) => x.id === id) || null;
}
var oyentes = /* @__PURE__ */ new Set();
function onCambio(fn) {
	oyentes.add(fn);
	return () => oyentes.delete(fn);
}
function avisar() {
	for (const fn of [...oyentes]) try {
		fn();
	} catch (e) {
		console.warn("[torrentStore] oyente", e);
	}
}
/** Añade un enlace (o devuelve el que ya estaba). */
async function anadir(enlace, alias = "") {
	const { validarEnlace } = await __vitePreload(async () => {
		const { validarEnlace } = await import("./torrent-DS6cTKT6.js");
		return { validarEnlace };
	}, __vite__mapDeps([0,1,2]), import.meta.url);
	const v = validarEnlace(enlace);
	if (!v.ok) return {
		ok: false,
		error: v.error
	};
	const c = await cargar();
	const limpio = String(enlace).trim();
	const ya = c.entradas.find((x) => x.enlace === limpio);
	if (ya) return {
		ok: true,
		entrada: ya,
		repetido: true
	};
	const entrada = {
		id: uid(),
		enlace: limpio,
		alias: alias || v.nombre || "Torrent",
		tipo: v.tipo,
		hash: v.hash || "",
		at: Date.now(),
		estado: "nuevo",
		error: "",
		meta: null,
		libros: [],
		descargas: {}
	};
	c.entradas.push(entrada);
	await guardar();
	return {
		ok: true,
		entrada
	};
}
async function renombrar(id, alias) {
	const e = (await cargar()).entradas.find((x) => x.id === id);
	if (e) {
		e.alias = alias;
		await guardar();
	}
	return e;
}
async function borrar(id) {
	const c = await cargar();
	const e = c.entradas.find((x) => x.id === id);
	if (e) {
		for (const d of Object.values(e.descargas || {})) if (d?.ruta && !d.importado) borrarDescarga(d.ruta);
	}
	c.entradas = c.entradas.filter((x) => x.id !== id);
	await guardar();
	return c.entradas;
}
var analizando = /* @__PURE__ */ new Set();
/**
* Analiza un torrent SIN bloquear la pantalla.
*
* Se puede salir de la vista y volver: el trabajo sigue y el resultado
* queda guardado. Si ya se está analizando ese enlace, no se repite.
*/
async function analizar(id, { segundos = 60 } = {}) {
	const e = (await cargar()).entradas.find((x) => x.id === id);
	if (!e) return {
		ok: false,
		error: "No se encuentra ese enlace"
	};
	if (analizando.has(id)) return {
		ok: true,
		yaEnCurso: true
	};
	analizando.add(id);
	e.estado = "analizando";
	e.error = "";
	await guardar();
	try {
		const r = await pedirMetadatos(e.enlace, segundos);
		const ent = (await cargar()).entradas.find((x) => x.id === id);
		if (!ent) return {
			ok: false,
			error: "La entrada se borró mientras se analizaba"
		};
		if (!r.ok) {
			ent.estado = "error";
			ent.error = r.error || "No se pudo analizar";
			await guardar();
			return {
				ok: false,
				error: ent.error
			};
		}
		const archivos = r.archivos || [];
		ent.meta = {
			nombre: r.nombre,
			total: r.total,
			hash: r.hash,
			archivos
		};
		const { grupos } = agruparArchivos(archivos);
		ent.conjuntos = grupos.filter((g) => g.esGrupo).map((g) => ({
			nombre: g.nombre,
			bytes: g.bytes,
			partes: g.partes.length,
			indices: g.indices
		}));
		ent.libros = archivos.filter((a) => esLibro(a.nombre) || esComprimido(a.nombre)).map((a) => {
			const coste = costeReal(a, archivos);
			return {
				i: a.i,
				nombre: a.nombre,
				titulo: tituloBonito(a.nombre),
				ext: extensionDe(a.nombre),
				formato: FORMATOS_LIBRO[extensionDe(a.nombre)] || FORMATOS_COMPRIMIDOS[extensionDe(a.nombre)]?.nombre || "?",
				bytes: a.bytes,
				comprimido: !!coste.comprimido,
				costeBytes: coste.bytes,
				aviso: coste.aviso,
				legible: esLibro(a.nombre)
			};
		}).sort((x, y) => Number(y.legible) - Number(x.legible));
		ent.estado = "listo";
		ent.analizadoAt = Date.now();
		await guardar();
		return {
			ok: true,
			entrada: ent
		};
	} catch (err) {
		const ent = (await cargar()).entradas.find((x) => x.id === id);
		if (ent) {
			ent.estado = "error";
			ent.error = String(err?.message || err);
			await guardar();
		}
		return {
			ok: false,
			error: String(err?.message || err)
		};
	} finally {
		analizando.delete(id);
	}
}
var estaAnalizando = (id) => analizando.has(id);
/** Nombre presentable a partir del nombre de fichero. */
function tituloBonito(n) {
	return String(n || "").replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[._]+/g, " ").replace(/\s*[[(][^)\]]*[)\]]/g, "").replace(/\b(epub|pdf|mobi|azw3?|retail|ebook|spanish|español)\b/gi, "").replace(/\s+/g, " ").trim() || String(n || "");
}
/** Empieza la descarga de un archivo concreto del torrent. */
async function descargarArchivo(id, indice) {
	const e = (await cargar()).entradas.find((x) => x.id === id);
	if (!e) return {
		ok: false,
		error: "No se encuentra el torrent"
	};
	const r = descargar(e.enlace, [indice]);
	if (!r.ok) return r;
	e.descargas = e.descargas || {};
	e.descargas[indice] = {
		estado: "descargando",
		pct: 0,
		at: Date.now()
	};
	await guardar();
	return { ok: true };
}
/** Refleja el progreso que informa el motor. */
async function marcarProgreso(hash, pct, extra = {}) {
	const e = (await cargar()).entradas.find((x) => x.hash === hash || x.meta?.hash === hash);
	if (!e) return;
	for (const k of Object.keys(e.descargas || {})) if (e.descargas[k].estado === "descargando") e.descargas[k] = {
		...e.descargas[k],
		pct,
		...extra
	};
	await guardar();
}
/** Marca un archivo como descargado y guarda su ruta. */
async function marcarDescargado(id, indice, ruta) {
	const e = (await cargar()).entradas.find((x) => x.id === id);
	if (!e) return;
	e.descargas = e.descargas || {};
	e.descargas[indice] = {
		...e.descargas[indice] || {},
		estado: "listo",
		pct: 100,
		ruta
	};
	await guardar();
}
async function marcarImportado(id, indice) {
	const e = (await cargar()).entradas.find((x) => x.id === id);
	if (!e) return;
	if (e.descargas?.[indice]) {
		e.descargas[indice].importado = true;
		await guardar();
	}
}
async function cancelarDescarga(id) {
	const e = await obtener(id);
	if (e?.meta?.hash) cancelar(e.meta.hash);
	const ent = (await cargar()).entradas.find((x) => x.id === id);
	if (ent) {
		for (const k of Object.keys(ent.descargas || {})) if (ent.descargas[k].estado === "descargando") ent.descargas[k].estado = "cancelado";
		await guardar();
	}
}
if (typeof window !== "undefined") window.__lumenTorrentStore = {
	listar,
	anadir,
	borrar,
	renombrar,
	analizar,
	obtener,
	costeReal,
	agruparArchivos,
	baseConjunto,
	partesDelConjunto,
	admiteParcial,
	esLibro,
	esComprimido,
	esVolumenPartido,
	tituloBonito,
	tam,
	FORMATOS_LIBRO,
	FORMATOS_COMPRIMIDOS
};
//#endregion
export { FORMATOS_COMPRIMIDOS, FORMATOS_LIBRO, admiteParcial, agruparArchivos, anadir, analizar, baseConjunto, borrar, cancelarDescarga, costeReal, descargarArchivo, esComprimido, esLibro, esVolumenPartido, estaAnalizando, extensionDe, listar, marcarDescargado, marcarImportado, marcarProgreso, obtener, onCambio, partesDelConjunto, renombrar, tam, tituloBonito, traerArchivo };
