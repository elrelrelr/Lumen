import { r as __exportAll } from "./rolldown-runtime-D1cXj70v.js";
import { C as putBlob, p as getBlob } from "./db-Ii3ipPL7.js";
//#region src/lib/originals.js
var originals_exports = /* @__PURE__ */ __exportAll({
	dropStashed: () => dropStashed,
	fetchStashed: () => fetchStashed,
	getOriginal: () => getOriginal,
	hasStashed: () => hasStashed,
	repairOriginals: () => repairOriginals,
	stashOriginal: () => stashOriginal
});
var store = () => typeof window !== "undefined" ? window.AndroidStore : null;
var hasNative = () => !!store()?.saveBinary;
var CACHE = "lumen-originals-v1";
var fileName = (bookId) => `orig_${bookId}.bin`;
var blobToB64 = (blob) => new Promise((res, rej) => {
	const fr = new FileReader();
	fr.onload = () => res(String(fr.result).split(",")[1] || "");
	fr.onerror = rej;
	fr.readAsDataURL(blob);
});
function b64ToBlob(b64, type) {
	const bin = atob(b64);
	const arr = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
	return new Blob([arr], { type: type || "application/octet-stream" });
}
/** Copia el original a la carpeta interna (o Cache Storage en web). */
async function stashOriginal(bookId, blob, mime) {
	if (!blob) return false;
	try {
		if (hasNative()) {
			const b64 = await blobToB64(blob);
			const ok = store().saveBinary(fileName(bookId), b64);
			if (ok) localStorage.setItem(`orig_mime_${bookId}`, mime || blob.type || "");
			return ok;
		}
		if ("caches" in window) {
			await (await caches.open(CACHE)).put(`/original/${bookId}`, new Response(blob, { headers: { "Content-Type": mime || blob.type || "" } }));
			return true;
		}
	} catch (e) {
		console.warn("[originals] no se pudo copiar", e);
	}
	return false;
}
/** Recupera el original desde la copia interna. */
async function fetchStashed(bookId) {
	try {
		if (hasNative()) {
			const b64 = store().loadBinary(fileName(bookId));
			if (!b64) return null;
			return b64ToBlob(b64, localStorage.getItem(`orig_mime_${bookId}`) || "");
		}
		if ("caches" in window) {
			const r = await (await caches.open(CACHE)).match(`/original/${bookId}`);
			if (r) return await r.blob();
		}
	} catch (e) {
		console.warn("[originals] recuperación fallida", e);
	}
	return null;
}
async function hasStashed(bookId) {
	try {
		if (hasNative()) return !!store().hasBinary(fileName(bookId));
		if ("caches" in window) return !!await (await caches.open(CACHE)).match(`/original/${bookId}`);
	} catch {}
	return false;
}
async function dropStashed(bookId) {
	try {
		if (hasNative()) store().removeBinary(fileName(bookId));
		else if ("caches" in window) await (await caches.open(CACHE)).delete(`/original/${bookId}`);
		localStorage.removeItem(`orig_mime_${bookId}`);
	} catch {}
}
/**
* Obtiene el original con reparación automática:
* 1) IndexedDB  2) copia interna (y repone IndexedDB)
*/
async function getOriginal(bookId) {
	try {
		const rec = await getBlob(bookId);
		if (rec?.blob && rec.blob.size > 0) return rec.blob;
	} catch (e) {
		console.warn("[originals] IndexedDB falló, probando copia", e?.message);
	}
	const stashed = await fetchStashed(bookId);
	if (stashed && stashed.size > 0) {
		console.info("[originals] restaurado desde la copia interna");
		putBlob(bookId, stashed).catch(() => {});
		return stashed;
	}
	return null;
}
/** Repara todos los originales que falten en IndexedDB. */
async function repairOriginals(books = []) {
	let fixed = 0;
	for (const b of books) {
		if (!b.hasOriginal) continue;
		try {
			const rec = await getBlob(b.id);
			if (rec?.blob && rec.blob.size > 0) continue;
			const stashed = await fetchStashed(b.id);
			if (stashed && stashed.size > 0) {
				await putBlob(b.id, stashed);
				fixed++;
			}
		} catch {}
	}
	if (fixed) console.info(`[originals] ${fixed} original(es) reparado(s)`);
	return fixed;
}
//#endregion
export { stashOriginal as i, getOriginal as n, originals_exports as r, dropStashed as t };
