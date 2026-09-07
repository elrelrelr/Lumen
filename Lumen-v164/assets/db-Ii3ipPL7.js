import { r as __exportAll } from "./rolldown-runtime-D1cXj70v.js";
//#region node_modules/idb/build/index.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(this.request);
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
var advanceMethodProps = [
	"continue",
	"continuePrimaryKey",
	"advance"
];
var methodMap = {};
var advanceResults = /* @__PURE__ */ new WeakMap();
var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
var cursorIteratorTraps = { get(target, prop) {
	if (!advanceMethodProps.includes(prop)) return target[prop];
	let cachedFunc = methodMap[prop];
	if (!cachedFunc) cachedFunc = methodMap[prop] = function(...args) {
		advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
	};
	return cachedFunc;
} };
async function* iterate(...args) {
	let cursor = this;
	if (!(cursor instanceof IDBCursor)) cursor = await cursor.openCursor(...args);
	if (!cursor) return;
	cursor = cursor;
	const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
	ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
	reverseTransformCache.set(proxiedCursor, unwrap(cursor));
	while (cursor) {
		yield proxiedCursor;
		cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
		advanceResults.delete(proxiedCursor);
	}
}
function isIteratorProp(target, prop) {
	return prop === Symbol.asyncIterator && instanceOfAny(target, [
		IDBIndex,
		IDBObjectStore,
		IDBCursor
	]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get(target, prop, receiver) {
		if (isIteratorProp(target, prop)) return iterate;
		return oldTraps.get(target, prop, receiver);
	},
	has(target, prop) {
		return isIteratorProp(target, prop) || oldTraps.has(target, prop);
	}
}));
//#endregion
//#region src/lib/db.js
var db_exports = /* @__PURE__ */ __exportAll({
	addHighlight: () => addHighlight,
	addNote: () => addNote,
	allBooks: () => allBooks,
	allHighlights: () => allHighlights,
	allNotes: () => allNotes,
	db: () => db,
	deleteBook: () => deleteBook,
	deleteHighlight: () => deleteHighlight,
	deleteNote: () => deleteNote,
	estimateUsage: () => estimateUsage,
	fijarConteoLibros: () => fijarConteoLibros,
	getAllPages: () => getAllPages,
	getBlob: () => getBlob,
	getBook: () => getBook,
	getMeta: () => getMeta,
	getPage: () => getPage,
	getPagesRange: () => getPagesRange,
	getSettings: () => getSettings,
	highlightsByBook: () => highlightsByBook,
	lecturaDudosa: () => lecturaDudosa,
	marcarUsoResaltado: () => marcarUsoResaltado,
	notesByBook: () => notesByBook,
	patchBook: () => patchBook,
	putBlob: () => putBlob,
	putBook: () => putBook,
	putPage: () => putPage,
	putPages: () => putPages,
	saveSettings: () => saveSettings,
	setMeta: () => setMeta,
	uid: () => uid,
	updateHighlight: () => updateHighlight,
	updateNote: () => updateNote,
	withDb: () => withDb
});
var DB_NAME = "lumen-reader";
var DB_VERSION = 2;
var _dbp = null;
var _db = null;
var _closing = false;
var SCHEMA = (d) => {
	if (!d.objectStoreNames.contains("books")) d.createObjectStore("books", { keyPath: "id" }).createIndex("addedAt", "addedAt");
	if (!d.objectStoreNames.contains("pages")) d.createObjectStore("pages", { keyPath: ["bookId", "index"] });
	if (!d.objectStoreNames.contains("blobs")) d.createObjectStore("blobs", { keyPath: "bookId" });
	if (!d.objectStoreNames.contains("meta")) d.createObjectStore("meta", { keyPath: "id" });
	if (!d.objectStoreNames.contains("highlights")) {
		const h = d.createObjectStore("highlights", { keyPath: "id" });
		h.createIndex("bookId", "bookId");
		h.createIndex("createdAt", "createdAt");
		h.createIndex("color", "color");
	}
	if (!d.objectStoreNames.contains("notes")) {
		const n = d.createObjectStore("notes", { keyPath: "id" });
		n.createIndex("bookId", "bookId");
		n.createIndex("createdAt", "createdAt");
	}
};
function connect() {
	_closing = false;
	_dbp = openDB(DB_NAME, DB_VERSION, {
		upgrade: SCHEMA,
		blocked() {
			console.warn("[db] apertura bloqueada por otra pestaña");
		},
		blocking() {
			console.warn("[db] cerrando por versión nueva");
			_closing = true;
			try {
				_db?.close();
			} catch {}
			_db = null;
			_dbp = null;
		},
		terminated() {
			console.warn("[db] conexión terminada por el navegador; se reconectará");
			_db = null;
			_dbp = null;
		}
	}).then((d) => {
		_db = d;
		d.addEventListener?.("close", () => {
			console.warn("[db] evento close: se reconectará al próximo uso");
			_db = null;
			_dbp = null;
		});
		return d;
	}).catch((e) => {
		_dbp = null;
		throw e;
	});
	return _dbp;
}
function db() {
	if (!_dbp || _closing) return connect();
	return _dbp;
}
var isClosingError = (e) => {
	const m = String(e?.message || e || "");
	return m.includes("closing") || m.includes("not allowed") || m.includes("InvalidStateError") || e?.name === "InvalidStateError";
};
/** Ejecuta una operación reconectando si la conexión se cerró. */
async function withDb(fn, { retries = 2, label = "op" } = {}) {
	let lastErr;
	for (let i = 0; i <= retries; i++) try {
		return await fn(await db());
	} catch (e) {
		lastErr = e;
		if (!isClosingError(e) || i === retries) break;
		console.warn(`[db] ${label}: reconectando (intento ${i + 1})`, e?.message);
		_db = null;
		_dbp = null;
		_closing = false;
		await new Promise((r) => setTimeout(r, 120 * (i + 1)));
	}
	throw lastErr;
}
var uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
async function putBook(book) {
	await withDb((d) => d.put("books", book), { label: "putBook" });
	return book;
}
async function getBook(id) {
	return withDb((d) => d.get("books", id), { label: "getBook" });
}
var AGUA = "lumen_conteo_libros";
var leerAgua = () => {
	try {
		return Number(localStorage.getItem(AGUA) || "0") || 0;
	} catch {
		return 0;
	}
};
var escribirAgua = (n) => {
	try {
		localStorage.setItem(AGUA, String(n));
	} catch {}
};
async function allBooks() {
	const esperados = leerAgua();
	let list = [];
	for (let intento = 0; intento < 4; intento++) {
		list = await withDb((d) => d.getAll("books"), { label: "allBooks" }) || [];
		if (list.length > 0 || esperados === 0) break;
		console.warn(`[db] allBooks vacío pero se esperaban ${esperados}; reintento ${intento + 1}`);
		await new Promise((r) => setTimeout(r, 180 * (intento + 1)));
	}
	if (list.length > 0 || esperados === 0) escribirAgua(list.length);
	return list.sort((a, b) => (b.openedAt || b.addedAt) - (a.openedAt || a.addedAt));
}
/** ¿La última lectura de libros fue sospechosa (vacía habiendo datos)? */
function lecturaDudosa(n) {
	return n === 0 && leerAgua() > 0;
}
/** Fija la marca de agua tras un borrado real hecho por el usuario. */
function fijarConteoLibros(n) {
	escribirAgua(n);
}
async function deleteBook(id) {
	try {
		escribirAgua(Math.max(0, leerAgua() - 1));
	} catch {}
	const tx = (await db()).transaction([
		"books",
		"pages",
		"blobs"
	], "readwrite");
	await tx.objectStore("books").delete(id);
	await tx.objectStore("blobs").delete(id);
	let cursor = await tx.objectStore("pages").openCursor(IDBKeyRange.bound([id, -Infinity], [id, Infinity]));
	while (cursor) {
		await cursor.delete();
		cursor = await cursor.continue();
	}
	await tx.done;
}
async function patchBook(id, patch) {
	return withDb(async (d) => {
		const b = await d.get("books", id);
		if (!b) return null;
		const next = {
			...b,
			...patch
		};
		await d.put("books", next);
		return next;
	}, { label: "patchBook" });
}
async function putPage(page) {
	await withDb((d) => d.put("pages", page), { label: "putPage" });
}
async function putPages(pages) {
	await withDb(async (d) => {
		const tx = d.transaction("pages", "readwrite");
		for (const p of pages) tx.store.put(p);
		await tx.done;
	}, { label: "putPages" });
}
async function getPage(bookId, index) {
	return withDb((d) => d.get("pages", [bookId, index]), { label: "getPage" });
}
async function getPagesRange(bookId, from, to) {
	return withDb((d) => d.getAll("pages", IDBKeyRange.bound([bookId, from], [bookId, to])), { label: "getPagesRange" });
}
async function getAllPages(bookId) {
	return withDb((d) => d.getAll("pages", IDBKeyRange.bound([bookId, -Infinity], [bookId, Infinity])), { label: "getAllPages" });
}
async function putBlob(bookId, blob, extra = {}) {
	await withDb((d) => d.put("blobs", {
		bookId,
		blob,
		...extra
	}), { label: "putBlob" });
}
async function getBlob(bookId) {
	return withDb((d) => d.get("blobs", bookId), { label: "getBlob" });
}
var DEFAULT_SETTINGS = {
	pinStories: false,
	id: "settings",
	goal: 5,
	academic: true,
	citationBubbles: true,
	karaokeColor: "#7c5cff",
	karaokeStyle: "fondo",
	fontSize: 20,
	appScale: 100,
	appFuente: "sistema",
	sonidosUi: true,
	gestoSens: 2,
	agacharMusica: true,
	fondoTemaEnLectura: true,
	lineHeight: 1.75,
	fontFamily: "serif",
	margin: 20,
	carousel: false,
	ttsRate: 1.25,
	ttsPitch: 1,
	ttsVoice: "",
	theme: "dark",
	countSeconds: 4,
	musicVolume: 1,
	autoAdvance: true,
	avisoGesto: "fuera"
};
async function migrarEscala105(s) {
	try {
		if (false) {
			s.appScale = 105;
			s.escala105 = true;
			await saveSettings({
				appScale: 100,
				escala105: true
			});
		}
	} catch {}
	return s;
}
async function getSettings() {
	const s = await withDb((d) => d.get("meta", "settings"), { label: "getSettings" }).catch(() => null);
	return await migrarEscala105({
		...DEFAULT_SETTINGS,
		...s || {}
	});
}
async function saveSettings(patch) {
	const next = {
		...await getSettings(),
		...patch,
		id: "settings"
	};
	await withDb((d) => d.put("meta", next), { label: "saveSettings" });
	return next;
}
async function getMeta(id, fallback = null) {
	return await withDb((d) => d.get("meta", id), { label: "getMeta" }).catch(() => null) || fallback;
}
async function setMeta(obj) {
	await withDb((d) => d.put("meta", obj), { label: "setMeta" });
	return obj;
}
async function estimateUsage() {
	if (navigator.storage?.estimate) try {
		const { usage, quota } = await navigator.storage.estimate();
		return {
			usage,
			quota
		};
	} catch {}
	return {
		usage: 0,
		quota: 0
	};
}
async function addHighlight(h) {
	const rec = {
		id: uid(),
		createdAt: Date.now(),
		tags: [],
		...h
	};
	await withDb((d) => d.put("highlights", rec), { label: "addHighlight" });
	return rec;
}
async function updateHighlight(id, patch) {
	return withDb(async (d) => {
		const cur = await d.get("highlights", id);
		if (!cur) return null;
		const next = {
			...cur,
			...patch
		};
		await d.put("highlights", next);
		return next;
	}, { label: "updateHighlight" });
}
async function marcarUsoResaltado(id) {
	return updateHighlight(id, { uso: ((await withDb((d) => d.get("highlights", id), { label: "getHL" }))?.uso || 0) + 1 });
}
async function deleteHighlight(id) {
	await withDb((d) => d.delete("highlights", id), { label: "deleteHighlight" });
}
async function allHighlights() {
	return (await withDb((d) => d.getAll("highlights"), { label: "allHighlights" }).catch(() => []) || []).sort((a, b) => b.createdAt - a.createdAt);
}
async function highlightsByBook(bookId) {
	return (await withDb((d) => d.getAllFromIndex("highlights", "bookId", bookId), { label: "highlightsByBook" }).catch(() => []) || []).sort((a, b) => (a.page ?? 0) - (b.page ?? 0) || a.createdAt - b.createdAt);
}
async function addNote(n) {
	const rec = {
		id: uid(),
		createdAt: Date.now(),
		...n
	};
	await withDb((d) => d.put("notes", rec), { label: "addNote" });
	return rec;
}
async function updateNote(id, patch) {
	return withDb(async (d) => {
		const cur = await d.get("notes", id);
		if (!cur) return null;
		const next = {
			...cur,
			...patch,
			updatedAt: Date.now()
		};
		await d.put("notes", next);
		return next;
	}, { label: "updateNote" });
}
async function deleteNote(id) {
	await withDb((d) => d.delete("notes", id), { label: "deleteNote" });
}
async function allNotes() {
	return (await withDb((d) => d.getAll("notes"), { label: "allNotes" }).catch(() => []) || []).sort((a, b) => b.createdAt - a.createdAt);
}
async function notesByBook(bookId) {
	return (await withDb((d) => d.getAllFromIndex("notes", "bookId", bookId), { label: "notesByBook" }).catch(() => []) || []).sort((a, b) => (a.page ?? 0) - (b.page ?? 0));
}
if (typeof window !== "undefined") window.__lumenDb = {
	allBooks,
	putBook,
	putPage,
	getAllPages,
	allHighlights,
	allNotes,
	getSettings,
	saveSettings,
	getMeta,
	setMeta,
	withDb
};
//#endregion
export { updateHighlight as A, putBlob as C, saveSettings as D, putPages as E, withDb as M, setMeta as O, patchBook as S, putPage as T, getPagesRange as _, allNotes as a, marcarUsoResaltado as b, deleteBook as c, estimateUsage as d, getAllPages as f, getPage as g, getMeta as h, allHighlights as i, updateNote as j, uid as k, deleteHighlight as l, getBook as m, addNote as n, db as o, getBlob as p, allBooks as r, db_exports as s, addHighlight as t, deleteNote as u, getSettings as v, putBook as w, notesByBook as x, highlightsByBook as y };
