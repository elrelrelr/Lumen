import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
//#region src/lib/buscador.js
var puente = () => typeof window !== "undefined" && window.AndroidNav ? window.AndroidNav : null;
/** ¿Hay navegador interno? En el navegador de escritorio no lo hay. */
var navegadorDisponible = () => !!puente();
var SITIOS = [
	{
		id: "annas",
		nombre: "Anna's Archive",
		url: "https://annas-archive.gl/search?q={q}",
		espejos: ["https://annas-archive.org/search?q={q}", "https://annas-archive.se/search?q={q}"],
		color: "#e0533d",
		tipo: "busca",
		avanzado: true,
		nota: "Buscador enorme. A veces pide esperar o resolver un captcha."
	},
	{
		id: "gutenberg",
		nombre: "Project Gutenberg",
		url: "https://www.gutenberg.org/ebooks/search/?query={q}",
		color: "#3f8f4f",
		tipo: "libre",
		nota: "Clásicos de dominio público. EPUB y TXT que bajan sin problema."
	},
	{
		id: "archive",
		nombre: "Internet Archive",
		url: "https://archive.org/search?query={q}&and[]=mediatype%3A%22texts%22",
		color: "#4a7fb5",
		tipo: "libre",
		nota: "Biblioteca pública gigante. Muchos títulos con descarga directa."
	},
	{
		id: "openlibrary",
		nombre: "Open Library",
		url: "https://openlibrary.org/search?q={q}",
		color: "#8a6fc4",
		tipo: "libre",
		nota: "Fichas, portadas y préstamo digital del Internet Archive."
	},
	{
		id: "cervantes",
		nombre: "Biblioteca Cervantes",
		url: "https://www.cervantesvirtual.com/buscador/?q={q}",
		color: "#c2903a",
		tipo: "libre",
		nota: "Literatura en español, libre y de calidad."
	},
	{
		id: "scribd",
		nombre: "Scribd / Everand",
		url: "https://www.everand.com/search?query={q}",
		color: "#2f7d95",
		tipo: "lectura",
		nota: "Lectura en la web. Requiere cuenta y casi nunca deja descargar."
	},
	{
		id: "scribdes",
		nombre: "Scribd en español",
		url: "https://es.scribd.com/search?query={q}",
		color: "#2f7d95",
		tipo: "lectura",
		nota: "La versión en español de Scribd, con más material en castellano."
	},
	{
		id: "docdownloader",
		nombre: "DocDownloader",
		url: "https://docdownloader.com/",
		sinBusqueda: true,
		color: "#c05a2e",
		tipo: "herramienta",
		avanzado: true,
		nota: "Para bajar documentos de Scribd. Copia el enlace del documento en Scribd, pégalo aquí y te lo prepara para descargar."
	},
	{
		id: "scihub",
		nombre: "Sci-Hub",
		url: "https://sci-hub.se/{q}",
		espejos: [
			"https://sci-hub.st/{q}",
			"https://sci-hub.ru/{q}",
			"https://sci-hub.wf/{q}"
		],
		color: "#b23b6a",
		tipo: "ciencia",
		avanzado: true,
		nota: "Artículos científicos por DOI o título. Si un dominio falla, se prueba otro."
	},
	{
		id: "libgen",
		nombre: "Library Genesis",
		url: "https://libgen.is/search.php?req={q}",
		espejos: [
			"https://libgen.rs/search.php?req={q}",
			"https://libgen.st/search.php?req={q}",
			"https://libgen.li/index.php?req={q}"
		],
		color: "#7a5a3a",
		tipo: "busca",
		avanzado: true,
		nota: "Índice clásico. Dominio inestable: si no carga, se prueba un espejo."
	},
	{
		id: "zlib",
		nombre: "Z-Library",
		url: "https://z-lib.gs/s/{q}",
		espejos: ["https://z-library.sk/s/{q}", "https://1lib.sk/s/{q}"],
		color: "#556b8d",
		tipo: "busca",
		avanzado: true,
		nota: "Pide cuenta y limita las descargas diarias."
	},
	{
		id: "piratebay",
		nombre: "The Pirate Bay",
		url: "https://thepiratebay.org/search.php?q={q}&cat=601",
		espejos: ["https://tpb.party/search/{q}/1/99/601"],
		color: "#3c3c46",
		tipo: "torrent",
		avanzado: true,
		nota: "Devuelve enlaces magnet: se abren en la biblioteca torrent de Lumen."
	},
	{
		id: "bookfi",
		nombre: "Standard Ebooks",
		url: "https://standardebooks.org/ebooks?query={q}",
		color: "#4f6f52",
		tipo: "libre",
		nota: "Clásicos maquetados con mucho cuidado. EPUB gratis."
	},
	{
		id: "google",
		nombre: "Buscar PDF o EPUB",
		url: "https://duckduckgo.com/?q={q}+(filetype%3Apdf+OR+filetype%3Aepub)",
		color: "#5a5a70",
		tipo: "busca",
		nota: "Búsqueda general limitada a archivos PDF y EPUB."
	},
	{
		id: "webepub",
		nombre: "Buscar sólo EPUB",
		url: "https://duckduckgo.com/?q={q}+filetype%3Aepub",
		color: "#4a7a5a",
		tipo: "busca",
		nota: "Sólo archivos EPUB, que son los que mejor se leen en la app."
	}
];
var TIPOS = {
	libre: {
		etiqueta: "Libre",
		color: "#3f8f4f"
	},
	busca: {
		etiqueta: "Buscador",
		color: "#8a6fc4"
	},
	lectura: {
		etiqueta: "Sólo lectura",
		color: "#2f7d95"
	},
	torrent: {
		etiqueta: "Torrent",
		color: "#c2903a"
	},
	ciencia: {
		etiqueta: "Ciencia",
		color: "#b23b6a"
	},
	propio: {
		etiqueta: "Tuyo",
		color: "#6b8f6b"
	},
	herramienta: {
		etiqueta: "Herramienta",
		color: "#c05a2e"
	}
};
/**
* Construye la URL de búsqueda de un sitio.
* @param {number} [espejo] índice del espejo a usar (0 = dominio principal)
*/
function urlDe(sitio, texto, espejo = 0) {
	const s = typeof sitio === "string" ? SITIOS.find((x) => x.id === sitio) : sitio;
	if (!s) return "";
	const q = String(texto || "").trim();
	if (!q) return "";
	if (espejo > 0 && Array.isArray(s.espejos) && s.espejos[espejo - 1]) return s.espejos[espejo - 1].replace("{q}", encodeURIComponent(q));
	if (s.sinBusqueda || !s.url.includes("{q}")) return s.url;
	return s.url.replace("{q}", encodeURIComponent(q));
}
/** Abre la búsqueda en el navegador interno (o en una pestaña, fuera de la app). */
function abrirEnNavegador(sitio, texto, espejo = 0) {
	const url = urlDe(sitio, texto, espejo);
	if (!url) return {
		ok: false,
		error: "Escribe qué quieres buscar"
	};
	const s = typeof sitio === "string" ? SITIOS.find((x) => x.id === sitio) : sitio;
	const b = puente();
	if (b) try {
		b.abrir(url, s?.nombre || "Buscar");
		return {
			ok: true,
			url
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message || String(e)
		};
	}
	try {
		window.open(url, "_blank", "noopener");
		return {
			ok: true,
			url,
			externo: true
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message || String(e)
		};
	}
}
/**
* Trae los archivos descargados en el navegador interno como objetos `File`.
* Se leen por trozos de 1 MB: un EPUB grande en un solo base64 agota la
* memoria del WebView.
*/
async function recogerDescargas(alProgreso) {
	const b = puente();
	if (!b) return [];
	let lista = [];
	try {
		lista = JSON.parse(b.pendientes() || "[]");
	} catch {
		return [];
	}
	if (!Array.isArray(lista) || !lista.length) return [];
	const TROZO = 1024 * 1024;
	const salida = [];
	for (const it of lista) try {
		const total = Number(b.tamano(it.ruta)) || 0;
		if (total <= 0) continue;
		const partes = [];
		for (let pos = 0; pos < total; pos += TROZO) {
			const b64 = b.leer(it.ruta, pos, Math.min(TROZO, total - pos));
			if (!b64) break;
			const bin = atob(b64);
			const arr = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
			partes.push(arr);
			alProgreso?.(it.nombre, Math.min(100, Math.round((pos + TROZO) / total * 100)));
		}
		salida.push(new File(partes, it.nombre, { type: "application/octet-stream" }));
		try {
			b.borrar(it.ruta);
		} catch {}
	} catch (e) {
		console.warn("[buscador] descarga", e?.message || e);
	}
	return salida;
}
/** Magnet capturado en el navegador (los sitios de torrent devuelven esto). */
function magnetPendiente() {
	const b = puente();
	if (!b) return "";
	try {
		return b.magnet() || "";
	} catch {
		return "";
	}
}
var CLAVE = "buscador_historial";
async function historial() {
	const m = await getMeta(CLAVE, null);
	return Array.isArray(m?.lista) ? m.lista : [];
}
async function recordar(texto) {
	const q = String(texto || "").trim();
	if (q.length < 2) return [];
	const lista = [q, ...(await historial()).filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 12);
	await setMeta({
		id: CLAVE,
		lista
	});
	return lista;
}
async function olvidar() {
	await setMeta({
		id: CLAVE,
		lista: []
	});
	return [];
}
var CLAVE_FAV = "buscador_favoritos";
async function favoritos() {
	const m = await getMeta(CLAVE_FAV, null);
	return Array.isArray(m?.lista) ? m.lista : [];
}
async function alternarFavorito(id) {
	const f = await favoritos();
	const lista = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
	await setMeta({
		id: CLAVE_FAV,
		lista
	});
	return lista;
}
/** Sitios ordenados: primero los favoritos, respetando el orden original. */
function ordenarSitios(favs) {
	const f = new Set(favs || []);
	return [...SITIOS].sort((a, b2) => {
		return (f.has(a.id) ? 0 : 1) - (f.has(b2.id) ? 0 : 1);
	});
}
var CLAVE_CODIGO = "filtro_clave";
var CLAVE_DESBLOQUEO = "filtro_estado";
var CODIGO_POR_DEFECTO = "2000";
var revolver = (s) => btoa(String(s).split("").map((c) => String.fromCharCode(c.charCodeAt(0) ^ 42)).join(""));
async function codigoGuardado() {
	return (await getMeta(CLAVE_CODIGO, null))?.v || revolver("2000");
}
async function comprobarCodigo(entrada) {
	const n = revolver(String(entrada || "").trim());
	const propio = await getMeta(CLAVE_CODIGO, null);
	if (propio?.v) return n === propio.v;
	try {
		const web = await getMeta("premium_codigos", null);
		if (web?.b) return n === web.b;
	} catch {}
	return n === revolver(CODIGO_POR_DEFECTO);
}
async function cambiarCodigo(nuevo) {
	const n = String(nuevo || "").trim();
	if (!/^\d{4,8}$/.test(n)) return {
		ok: false,
		error: "El código debe tener de 4 a 8 cifras"
	};
	await setMeta({
		id: CLAVE_CODIGO,
		v: revolver(n)
	});
	return { ok: true };
}
var _cacheFiltro = null;
function estaDesbloqueado() {
	try {
		if (localStorage.getItem("lumen_premium") === "1") return true;
	} catch {}
	if (_cacheFiltro !== null) return _cacheFiltro;
	try {
		_cacheFiltro = localStorage.getItem(CLAVE_DESBLOQUEO) === "1";
	} catch {
		_cacheFiltro = false;
	}
	return _cacheFiltro;
}
function desbloquear(v = true) {
	_cacheFiltro = !!v;
	try {
		if (v) localStorage.setItem(CLAVE_DESBLOQUEO, "1");
		else localStorage.removeItem(CLAVE_DESBLOQUEO);
	} catch {}
	setMeta({
		id: CLAVE_DESBLOQUEO,
		v: !!v
	}).catch(() => {});
}
/** Se llama al arrancar: recupera el estado si localStorage se limpió. */
async function cargarEstadoFiltro() {
	try {
		if (localStorage.getItem(CLAVE_DESBLOQUEO) === "1") {
			_cacheFiltro = true;
			return true;
		}
		if ((await getMeta(CLAVE_DESBLOQUEO, null))?.v) {
			_cacheFiltro = true;
			localStorage.setItem(CLAVE_DESBLOQUEO, "1");
			return true;
		}
	} catch {}
	return false;
}
/** Sitios visibles según el desbloqueo. */
function sitiosVisibles(abierto = estaDesbloqueado(), propios = []) {
	return [...abierto ? SITIOS : SITIOS.filter((s) => !s.avanzado), ...propios || []];
}
var hayAvanzados = () => SITIOS.some((s) => s.avanzado);
var cuantosAvanzados = () => SITIOS.filter((s) => s.avanzado).length;
var CLAVE_PROPIOS = "buscador_propios";
async function sitiosPropios() {
	const m = await getMeta(CLAVE_PROPIOS, null);
	return Array.isArray(m?.lista) ? m.lista : [];
}
/**
* Convierte lo que pegue el usuario en una plantilla utilizable.
*
* Si ya trae {q}, se respeta. Si es una URL de búsqueda real
* (…?q=algo, ?s=algo, ?query=algo), se sustituye ese valor por {q}: así
* basta con buscar algo en la web y pegar la dirección resultante, que es
* lo que hará cualquiera. Y si no hay forma de deducirlo, se guarda tal
* cual para abrirla sin más.
*/
function normalizarPlantilla(url) {
	let u = String(url || "").trim();
	if (!u) return "";
	if (!/^https?:\/\//i.test(u)) u = "https://" + u;
	if (u.includes("{q}")) return u;
	try {
		const p = new URL(u);
		for (const clave of [
			"q",
			"query",
			"s",
			"search",
			"req",
			"keyword",
			"k",
			"term"
		]) if (p.searchParams.has(clave)) {
			p.searchParams.set(clave, "__LUMENQ__");
			return p.toString().replace("__LUMENQ__", "{q}");
		}
	} catch {}
	return u;
}
async function anadirSitioPropio(nombre, url) {
	const n = String(nombre || "").trim();
	const plantilla = normalizarPlantilla(url);
	if (!n) return {
		ok: false,
		error: "Ponle un nombre"
	};
	if (!plantilla) return {
		ok: false,
		error: "Escribe la dirección"
	};
	if (!/^https?:\/\//i.test(plantilla)) return {
		ok: false,
		error: "La dirección no es válida"
	};
	const lista = await sitiosPropios();
	if (lista.some((x) => x.url === plantilla)) return {
		ok: false,
		error: "Ya tienes ese sitio"
	};
	const nuevo = {
		id: "propio-" + Date.now(),
		nombre: n,
		url: plantilla,
		color: "#6b8f6b",
		tipo: "propio",
		propio: true,
		nota: plantilla.includes("{q}") ? "Sitio tuyo. La búsqueda se pone donde marcaste." : "Sitio tuyo. Se abre tal cual, sin enviar la búsqueda."
	};
	await setMeta({
		id: CLAVE_PROPIOS,
		lista: [...lista, nuevo]
	});
	return {
		ok: true,
		sitio: nuevo
	};
}
async function borrarSitioPropio(id) {
	const nueva = (await sitiosPropios()).filter((x) => x.id !== id);
	await setMeta({
		id: CLAVE_PROPIOS,
		lista: nueva
	});
	return nueva;
}
function historialDescargas() {
	const b = puente();
	if (!b?.historial) return [];
	try {
		const l = JSON.parse(b.historial() || "[]");
		return Array.isArray(l) ? l.slice().reverse() : [];
	} catch {
		return [];
	}
}
function borrarDescarga(nombre) {
	const b = puente();
	try {
		b?.borrarHistorial?.(nombre || "");
	} catch {}
	return historialDescargas();
}
/** Descarga en curso, o null. */
function descargaActiva() {
	const b = puente();
	if (!b?.activa) return null;
	try {
		const s = b.activa();
		if (!s) return null;
		const o = JSON.parse(s);
		if (!o?.nombre || Date.now() - (o.at || 0) > 12e3) return null;
		return o;
	} catch {
		return null;
	}
}
function cancelarDescargaActiva() {
	const b = puente();
	try {
		b?.cancelar?.();
		return true;
	} catch {
		return false;
	}
}
if (typeof window !== "undefined") window.__lumenBuscador = {
	SITIOS,
	TIPOS,
	urlDe,
	abrirEnNavegador,
	recogerDescargas,
	magnetPendiente,
	navegadorDisponible,
	historial,
	recordar,
	olvidar,
	favoritos,
	alternarFavorito,
	ordenarSitios,
	historialDescargas,
	borrarDescarga,
	descargaActiva,
	cancelarDescargaActiva,
	comprobarCodigo,
	cambiarCodigo,
	cargarEstadoFiltro,
	estaDesbloqueado,
	desbloquear,
	sitiosVisibles,
	cuantosAvanzados,
	sitiosPropios,
	anadirSitioPropio,
	borrarSitioPropio,
	normalizarPlantilla,
	CODIGO_POR_DEFECTO
};
//#endregion
export { CODIGO_POR_DEFECTO, SITIOS, TIPOS, abrirEnNavegador, alternarFavorito, anadirSitioPropio, borrarDescarga, borrarSitioPropio, cambiarCodigo, cancelarDescargaActiva, cargarEstadoFiltro, codigoGuardado, comprobarCodigo, cuantosAvanzados, desbloquear, descargaActiva, estaDesbloqueado, favoritos, hayAvanzados, historial, historialDescargas, magnetPendiente, navegadorDisponible, normalizarPlantilla, olvidar, ordenarSitios, recogerDescargas, recordar, sitiosPropios, sitiosVisibles, urlDe };
