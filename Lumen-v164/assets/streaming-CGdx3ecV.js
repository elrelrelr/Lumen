const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./epub-B8oVrWvJ.js","./rolldown-runtime-D1cXj70v.js"])))=>i.map(i=>d[i]);
import { o as __toESM, r as __exportAll } from "./rolldown-runtime-D1cXj70v.js";
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
//#region src/lib/streaming.js
var streaming_exports = /* @__PURE__ */ __exportAll({
	GATEWAYS: () => GATEWAYS,
	descargarLumenPorGateway: () => descargarLumenPorGateway,
	descargarPorTorrent: () => descargarPorTorrent,
	disponibilidad: () => disponibilidad,
	precargarCapitulos: () => precargarCapitulos,
	traerArchivoLumen: () => traerArchivoLumen,
	traerCapitulo: () => traerCapitulo,
	traerManifest: () => traerManifest,
	traerMetadata: () => traerMetadata
});
var GATEWAYS = [
	"https://ipfs.io/ipfs/",
	"https://dweb.link/ipfs/",
	"https://cloudflare-ipfs.com/ipfs/",
	"https://gateway.pinata.cloud/ipfs/",
	"https://4everland.io/ipfs/"
];
var CLAVE_CACHE = "streaming_cache";
var CACHE_MAX = 40;
async function cacheLeer() {
	return (await getMeta(CLAVE_CACHE, null))?.cache || {};
}
async function cacheGuardar(cache) {
	await setMeta({
		id: CLAVE_CACHE,
		cache
	});
}
async function cachePut(cid, path, texto) {
	const cache = await cacheLeer();
	const clave = `${cid}::${path}`;
	cache[clave] = {
		at: Date.now(),
		data: texto
	};
	const entradas = Object.entries(cache).sort((a, b) => b[1].at - a[1].at);
	while (entradas.length > CACHE_MAX) {
		const [k] = entradas.pop();
		delete cache[k];
	}
	await cacheGuardar(cache);
}
async function cacheGet(cid, path) {
	const e = (await cacheLeer())[`${cid}::${path}`];
	return e ? e.data : null;
}
/** Descarga un path de un CID probando los gateways en orden. */
async function fetchGateway(cid, path, { timeout = 15e3 } = {}) {
	const limpiar = path.replace(/^\/+/, "");
	limpiar && limpiar + "", `${limpiar}`;
	for (const gw of GATEWAYS) {
		const full = `${gw}${cid}/${limpiar}`;
		try {
			const ctrl = new AbortController();
			const t = setTimeout(() => ctrl.abort(), timeout);
			const res = await fetch(full, { signal: ctrl.signal });
			clearTimeout(t);
			if (!res.ok) continue;
			const texto = await res.text();
			if (!texto || texto.length < 20) continue;
			return {
				texto,
				gateway: gw
			};
		} catch {}
	}
	return null;
}
/**
* Trae un archivo del libro .lumen por su CID (con caché local).
* Orden: caché → gateways.
*/
async function traerArchivoLumen(cid, path, { fuerza = false } = {}) {
	if (!cid) return null;
	const enCache = await cacheGet(cid, path);
	if (enCache != null && !fuerza) return {
		texto: enCache,
		desde: "caché"
	};
	const r = await fetchGateway(cid, path);
	if (r) {
		await cachePut(cid, path, r.texto);
		return {
			texto: r.texto,
			desde: r.gateway
		};
	}
	return enCache != null ? {
		texto: enCache,
		desde: "caché"
	} : null;
}
/** Trae el manifest.json de un CID. */
async function traerManifest(cid) {
	const r = await traerArchivoLumen(cid, "manifest.json", { fuerza: true });
	if (!r) return null;
	try {
		return {
			manifest: JSON.parse(r.texto),
			desde: r.desde
		};
	} catch {
		return null;
	}
}
/** Trae metadata.json de un CID. */
async function traerMetadata(cid) {
	const r = await traerArchivoLumen(cid, "metadata.json", { fuerza: true });
	if (!r) return null;
	try {
		return {
			metadata: JSON.parse(r.texto),
			desde: r.desde
		};
	} catch {
		return null;
	}
}
/** Trae un capítulo concreto (cacheando). */
async function traerCapitulo(cid, nombre, { prefetch = false } = {}) {
	const r = await traerArchivoLumen(cid, nombre);
	if (!r) return null;
	if (prefetch) return r;
	return r;
}
/** Precarga los siguientes capítulos (solo si no están en caché). */
async function precargarCapitulos(cid, orden, desde, cuantos = 2) {
	const pendientes = [];
	for (let i = desde; i < orden.length && i < desde + cuantos; i++) {
		const nombre = orden[i];
		if (await cacheGet(cid, nombre) == null) pendientes.push(traerArchivoLumen(cid, nombre));
	}
	if (pendientes.length) await Promise.allSettled(pendientes);
}
/** Estado de disponibilidad: ¿hay CID o magnet? */
function disponibilidad(libro) {
	if (!libro) return {
		nivel: "none",
		etiqueta: "Sin fuente"
	};
	if (libro.fileUrl) return {
		nivel: "alta",
		etiqueta: "Lumen Storage · 24/7"
	};
	if (libro._fuente === "feed") {
		if (libro.chapters?.length || libro.stream) return {
			nivel: "alta",
			etiqueta: "Feed · streaming"
		};
		if (libro.magnet || libro.download || libro.fileUrl) return {
			nivel: "media",
			etiqueta: "Feed · fuente"
		};
		return {
			nivel: "baja",
			etiqueta: "Feed · solo ficha"
		};
	}
	if (libro.cid && libro.magnet) return {
		nivel: "alta",
		etiqueta: "CID + torrent"
	};
	if (libro.cid) return {
		nivel: "media",
		etiqueta: "Gateway IPFS"
	};
	if (libro.magnet) return {
		nivel: "media",
		etiqueta: "Torrent P2P"
	};
	return {
		nivel: "baja",
		etiqueta: "Solo catálogo"
	};
}
var puenteTorrent = () => typeof window !== "undefined" && window.AndroidTorrent ? window.AndroidTorrent : null;
/** Descarga el .lumen completo por magnet usando el motor nativo. */
function descargarPorTorrent(magnet, indices = "") {
	try {
		return puenteTorrent()?.descargar(magnet, indices);
	} catch {
		return false;
	}
}
async function descargarLumenPorGateway(libro) {
	if (!libro?.cid) return null;
	const man = await traerManifest(libro.cid);
	if (!man?.manifest?.reading_order?.length) return null;
	const orden = man.manifest.reading_order;
	const { default: JSZip } = await __vitePreload(async () => {
		const { default: JSZip } = await import("./epub-B8oVrWvJ.js").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
		return { default: JSZip };
	}, __vite__mapDeps([0,1]), import.meta.url);
	const zip = new JSZip();
	zip.file("manifest.json", JSON.stringify(man.manifest, null, 2));
	const meta = await traerMetadata(libro.cid);
	if (meta?.metadata) zip.file("metadata.json", JSON.stringify(meta.metadata, null, 2));
	for (const nombre of orden) {
		const r = await traerArchivoLumen(libro.cid, nombre);
		if (!r?.texto) throw new Error("capítulo no disponible: " + nombre);
		zip.file(nombre, r.texto);
	}
	return {
		blob: await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE"
		}),
		nombre: (libro.titulo || "libro").replace(/[^\w\s.-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() + ".lumen"
	};
}
//#endregion
export { traerCapitulo as a, streaming_exports as i, disponibilidad as n, traerManifest as o, precargarCapitulos as r, descargarLumenPorGateway as t };
