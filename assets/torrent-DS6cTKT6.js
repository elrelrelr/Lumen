import { O as setMeta, h as getMeta, k as uid } from "./db-Ii3ipPL7.js";
//#region src/lib/torrent.js
var CLAVE = "torrents";
var puente = () => typeof window !== "undefined" && window.AndroidTorrent ? window.AndroidTorrent : null;
/** ¿Se puede descargar por torrent en este dispositivo? */
function torrentDisponible() {
	const b = puente();
	if (!b) return false;
	try {
		return !!b.disponible();
	} catch {
		return false;
	}
}
/** Todos los enlaces guardados, del más reciente al más antiguo. */
async function listarEnlaces() {
	return ((await getMeta(CLAVE, null))?.lista || []).sort((a, b) => (b.at || 0) - (a.at || 0));
}
async function guardarLista(lista) {
	await setMeta({
		id: CLAVE,
		lista
	});
	return lista;
}
/**
* Valida un enlace SIN tocar la red.
* Se hace también en JavaScript (no sólo en Java) para que la comprobación
* funcione igual en el navegador y para poder avisar al instante mientras
* se escribe.
*/
function validarEnlace(enlace) {
	const s = String(enlace || "").trim();
	if (!s) return {
		ok: false,
		error: "Pega un enlace primero"
	};
	if (s.startsWith("magnet:")) {
		const m = s.match(/xt=urn:bt(i|m)h:([a-zA-Z0-9]{32,64})/);
		if (!m) return {
			ok: false,
			error: "Ese magnet no es válido: le falta la parte «xt=urn:btih:» con el identificador"
		};
		const dn = s.match(/dn=([^&]+)/);
		let nombre = "Torrent";
		try {
			if (dn) nombre = decodeURIComponent(dn[1].replace(/\+/g, " "));
		} catch {}
		return {
			ok: true,
			tipo: "magnet",
			hash: m[2].toLowerCase(),
			nombre
		};
	}
	if (/^https?:\/\//i.test(s)) {
		if (!/\.torrent(\?|$)/i.test(s)) return {
			ok: false,
			error: "La dirección debe terminar en .torrent (o pega mejor un enlace magnet)"
		};
		let nombre = s.split("/").pop().split("?")[0] || "torrent";
		try {
			nombre = decodeURIComponent(nombre);
		} catch {}
		return {
			ok: true,
			tipo: "url",
			nombre
		};
	}
	return {
		ok: false,
		error: "Debe empezar por «magnet:» o por «https://» y acabar en .torrent"
	};
}
/** Guarda un enlace nuevo (o avisa si ya estaba). */
async function guardarEnlace(enlace, alias = "") {
	const v = validarEnlace(enlace);
	if (!v.ok) return v;
	const lista = await listarEnlaces();
	const limpio = String(enlace).trim();
	if (lista.some((x) => x.enlace === limpio)) return {
		ok: false,
		error: "Ese enlace ya está guardado"
	};
	const item = {
		id: uid(),
		enlace: limpio,
		alias: alias || v.nombre || "Torrent",
		tipo: v.tipo,
		hash: v.hash || "",
		at: Date.now(),
		usos: 0
	};
	await guardarLista([item, ...lista]);
	return {
		ok: true,
		item
	};
}
async function editarEnlace(id, patch) {
	const out = (await listarEnlaces()).map((x) => x.id === id ? {
		...x,
		...patch
	} : x);
	await guardarLista(out);
	return out;
}
async function borrarEnlace(id) {
	const out = (await listarEnlaces()).filter((x) => x.id !== id);
	await guardarLista(out);
	return out;
}
var oyentes = /* @__PURE__ */ new Set();
/** Se suscribe a los avisos del motor. Devuelve la baja. */
function onTorrent(fn) {
	oyentes.add(fn);
	return () => oyentes.delete(fn);
}
if (typeof window !== "undefined") window.__lumenTorrent = (evento, datos) => {
	let d = {};
	try {
		d = datos ? JSON.parse(datos) : {};
	} catch {
		d = { crudo: datos };
	}
	for (const fn of [...oyentes]) try {
		fn(evento, d);
	} catch (e) {
		console.warn("[torrent] oyente", e);
	}
};
/**
* Pide los metadatos (la lista de archivos) sin descargar el contenido.
* @returns {Promise<{ok:boolean, error?:string, nombre?:string, archivos?:Array}>}
*/
function pedirMetadatos(enlace, segundos = 45) {
	const b = puente();
	if (!b) return Promise.resolve({
		ok: false,
		error: "Las descargas por torrent sólo funcionan en la aplicación instalada"
	});
	return new Promise((resolve) => {
		let resuelto = false;
		const baja = onTorrent((ev, d) => {
			if (ev === "torrent_meta") {
				resuelto = true;
				baja();
				clearTimeout(tope);
				resolve({
					ok: true,
					...d
				});
			} else if (ev === "torrent_error") {
				resuelto = true;
				baja();
				clearTimeout(tope);
				resolve({
					ok: false,
					error: d.error || "Error desconocido"
				});
			}
		});
		const tope = setTimeout(() => {
			if (resuelto) return;
			baja();
			resolve({
				ok: false,
				error: "No se obtuvieron los metadatos a tiempo. Puede que no haya fuentes activas."
			});
		}, (segundos + 15) * 1e3);
		try {
			b.metadatos(enlace, segundos);
		} catch (e) {
			resuelto = true;
			baja();
			clearTimeout(tope);
			resolve({
				ok: false,
				error: "No se pudo contactar con el motor: " + (e?.message || e)
			});
		}
	});
}
/** Empieza la descarga de los archivos indicados (array de índices). */
function descargar(enlace, indices) {
	const b = puente();
	if (!b) return {
		ok: false,
		error: "Sólo disponible en la aplicación instalada"
	};
	if (!indices?.length) return {
		ok: false,
		error: "No has elegido ningún archivo"
	};
	try {
		b.descargar(enlace, indices.join(","));
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: String(e?.message || e)
		};
	}
}
function cancelar(hash) {
	const b = puente();
	if (!b) return false;
	try {
		return !!b.cancelar(hash);
	} catch {
		return false;
	}
}
/**
* Trae un archivo ya descargado a la web como File, listo para importar con
* el mismo camino que un archivo del teléfono.
*
* Se lee A TROZOS (1 MB) porque pasar un EPUB entero en base64 de una sola
* vez por el puente puede agotar la memoria del WebView en móviles modestos.
*/
async function traerArchivo(ruta, nombre, alProgreso) {
	const b = puente();
	if (!b) throw new Error("Sólo disponible en la aplicación instalada");
	const total = b.tamano(ruta);
	if (total <= 0) throw new Error("El archivo descargado no se encuentra");
	const TROZO = 1024 * 1024;
	const partes = [];
	for (let pos = 0; pos < total; pos += TROZO) {
		const b64 = b.leer(ruta, pos, Math.min(TROZO, total - pos));
		if (!b64) break;
		const bin = atob(b64);
		const arr = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
		partes.push(arr);
		alProgreso?.(Math.min(100, Math.round((pos + TROZO) / total * 100)));
	}
	return new File(partes, nombre, { type: "application/octet-stream" });
}
/** Borra el archivo descargado del almacenamiento de la app. */
function borrarDescarga(ruta) {
	const b = puente();
	if (!b) return false;
	try {
		return !!b.borrar(ruta);
	} catch {
		return false;
	}
}
/** Tamaño legible. */
var tam = (n) => {
	const x = Number(n) || 0;
	if (x < 1024) return x + " B";
	if (x < 1048576) return (x / 1024).toFixed(0) + " KB";
	if (x < 1073741824) return (x / 1048576).toFixed(1) + " MB";
	return (x / 1073741824).toFixed(2) + " GB";
};
var TORRENTS_EJEMPLO = [];
if (typeof window !== "undefined") window.__lumenTorrentLib = {
	TORRENTS_EJEMPLO,
	validarEnlace,
	guardarEnlace,
	listarEnlaces,
	borrarEnlace,
	editarEnlace,
	torrentDisponible,
	tam
};
//#endregion
export { TORRENTS_EJEMPLO, borrarDescarga, cancelar, descargar, listarEnlaces, onTorrent, pedirMetadatos, torrentDisponible, traerArchivo, validarEnlace };
