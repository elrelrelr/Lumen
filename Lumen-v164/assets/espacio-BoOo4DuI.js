const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./originals-D2DFW8Gx.js","./rolldown-runtime-D1cXj70v.js","./db-Ii3ipPL7.js"])))=>i.map(i=>d[i]);
import { f as getAllPages, r as allBooks } from "./db-Ii3ipPL7.js";
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
//#region src/lib/espacio.js
var sePuedeComprimir = () => typeof CompressionStream !== "undefined";
/**
* Comprime un texto con gzip nativo y lo devuelve en base64.
*
* Devuelve null si no se puede o si no compensa: para textos cortos el
* base64 puede salir MÁS grande que el original (gzip añade cabecera y
* base64 infla un 33 %), así que por debajo de 400 caracteres ni se intenta.
*/
async function comprimir(texto) {
	if (!sePuedeComprimir() || !texto || texto.length < 400) return null;
	try {
		const cs = new CompressionStream("gzip");
		const flujo = new Blob([texto]).stream().pipeThrough(cs);
		const buf = await new Response(flujo).arrayBuffer();
		const bytes = new Uint8Array(buf);
		let bin = "";
		const TROZO = 32768;
		for (let i = 0; i < bytes.length; i += TROZO) bin += String.fromCharCode(...bytes.subarray(i, i + TROZO));
		const b64 = btoa(bin);
		return b64.length < texto.length * .85 ? b64 : null;
	} catch {
		return null;
	}
}
async function descomprimir(b64) {
	try {
		const bin = atob(b64);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		const ds = new DecompressionStream("gzip");
		const flujo = new Blob([bytes]).stream().pipeThrough(ds);
		return await new Response(flujo).text();
	} catch (e) {
		console.warn("[espacio] descomprimir", e?.message || e);
		return null;
	}
}
/** Cuánto ocupa cada cosa, en bytes aproximados. */
async function medirEspacio() {
	const libros = await allBooks().catch(() => []);
	let texto = 0;
	let portadas = 0;
	for (const b of libros) if (typeof b.cover === "string") portadas += b.cover.length;
	const muestra = libros.slice(0, 5);
	let paginasMuestra = 0;
	for (const b of muestra) {
		const ps = await getAllPages(b.id).catch(() => []);
		paginasMuestra += ps.length;
		for (const p of ps) texto += (p.text || "").length;
	}
	if (muestra.length && libros.length > muestra.length) texto = Math.round(texto / muestra.length * libros.length);
	let originales = 0;
	try {
		const s = window.AndroidStore;
		if (typeof s?.tamanoOriginales === "function") originales = s.tamanoOriginales();
	} catch {}
	let cuota = null;
	try {
		if (navigator.storage?.estimate) {
			const e = await navigator.storage.estimate();
			cuota = {
				usado: e.usage || 0,
				disponible: e.quota || 0
			};
		}
	} catch {}
	return {
		libros: libros.length,
		texto,
		portadas,
		originales,
		cuota,
		paginasMuestra,
		total: texto + portadas + originales
	};
}
/**
* Suelta los archivos originales de los libros TERMINADOS.
*
* El texto NO se toca: el libro se sigue leyendo con normalidad. Lo único que
* se pierde es la vista de la maquetación original (el PDF tal cual), y se
* avisa antes de hacerlo.
*/
async function soltarOriginalesTerminados() {
	const libros = await allBooks().catch(() => []);
	const { dropStashed, hasStashed } = await __vitePreload(async () => {
		const { dropStashed, hasStashed } = await import("./originals-D2DFW8Gx.js").then((n) => n.r);
		return {
			dropStashed,
			hasStashed
		};
	}, __vite__mapDeps([0,1,2]), import.meta.url);
	let sueltos = 0;
	let bytes = 0;
	for (const b of libros) {
		if (!(b.pageCount > 0 && (b.lastPage || 0) >= b.pageCount - 1)) continue;
		try {
			if (await hasStashed(b.id)) {
				const { patchBook } = await __vitePreload(async () => {
					const { patchBook } = await import("./db-Ii3ipPL7.js").then((n) => n.s);
					return { patchBook };
				}, __vite__mapDeps([2,1]), import.meta.url);
				await patchBook(b.id, { sinOriginal: true });
				await dropStashed(b.id);
				sueltos++;
			}
		} catch (e) {
			console.warn("[espacio] soltar", b.id, e?.message || e);
		}
	}
	return {
		sueltos,
		bytes
	};
}
/** Recorta una portada demasiado grande a una miniatura razonable. */
async function recortarPortada(dataUrl, maxLado = 260) {
	try {
		if (!dataUrl || dataUrl.length < 12e4) return dataUrl;
		const img = new Image();
		img.src = dataUrl;
		await new Promise((r) => {
			img.onload = r;
			img.onerror = r;
		});
		if (!img.width) return dataUrl;
		const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
		const c = document.createElement("canvas");
		c.width = Math.round(img.width * escala);
		c.height = Math.round(img.height * escala);
		c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
		const chico = c.toDataURL("image/jpeg", .72);
		return chico.length < dataUrl.length ? chico : dataUrl;
	} catch {
		return dataUrl;
	}
}
/** Recorta TODAS las portadas guardadas que estén de más. */
async function recortarPortadasGuardadas() {
	const libros = await allBooks().catch(() => []);
	const { patchBook } = await __vitePreload(async () => {
		const { patchBook } = await import("./db-Ii3ipPL7.js").then((n) => n.s);
		return { patchBook };
	}, __vite__mapDeps([2,1]), import.meta.url);
	let tocadas = 0;
	let ahorro = 0;
	for (const b of libros) {
		if (typeof b.cover !== "string" || b.cover.length < 12e4) continue;
		const chica = await recortarPortada(b.cover);
		if (chica && chica.length < b.cover.length) {
			ahorro += b.cover.length - chica.length;
			await patchBook(b.id, { cover: chica });
			tocadas++;
		}
	}
	return {
		tocadas,
		ahorro
	};
}
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
if (typeof window !== "undefined") window.__lumenEspacio = {
	medirEspacio,
	soltarOriginalesTerminados,
	recortarPortadasGuardadas,
	recortarPortada,
	comprimir,
	descomprimir,
	legible
};
//#endregion
export { comprimir, descomprimir, legible, medirEspacio, recortarPortada, recortarPortadasGuardadas, sePuedeComprimir, soltarOriginalesTerminados };
