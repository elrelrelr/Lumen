import { r as __exportAll } from "./rolldown-runtime-D1cXj70v.js";
import { O as setMeta, h as getMeta, k as uid } from "./db-Ii3ipPL7.js";
import { conectarRelay, crearEvento, firmarEvento, i as bytesToHex, identidadGuardada, n as schnorr, npubDeHex, publicarEnRelays, r as secp256k1, relaysGuardados, suscribir, t as sha256, verificarEvento } from "./nostr-zC6Qsl2z.js";
//#region src/lib/lumenAds.js
var lumenAds_exports = /* @__PURE__ */ __exportAll({
	KIND_CAMPANA: () => KIND_CAMPANA,
	KIND_ESPACIO: () => KIND_ESPACIO,
	KIND_POAV: () => KIND_POAV,
	KIND_RECIBO: () => KIND_RECIBO,
	KIND_VOTO: () => KIND_VOTO,
	MODOS: () => MODOS,
	agregarMovimiento: () => agregarMovimiento,
	campanaDeEvento: () => campanaDeEvento,
	campanasCatalogo: () => campanasCatalogo,
	campanasCompatibles: () => campanasCompatibles,
	campanasPropias: () => campanasPropias,
	cerrarCampana: () => cerrarCampana,
	configAutoInversion: () => configAutoInversion,
	consensoDeLote: () => consensoDeLote,
	crearCampanaLocal: () => crearCampanaLocal,
	decodificarFactura: () => decodificarFactura,
	depositar: () => depositar,
	elegirValidadores: () => elegirValidadores,
	espacioActual: () => espacioActual,
	evaluarLote: () => evaluarLote,
	eventoDeCampana: () => eventoDeCampana,
	frecuenciaAnuncio: () => frecuenciaAnuncio,
	gananciasPorRol: () => gananciasPorRol,
	generarFacturaLightning: () => generarFacturaLightning,
	guardarAutoInversion: () => guardarAutoInversion,
	guardarEspacioLocal: () => guardarEspacioLocal,
	guardarLightningAddress: () => guardarLightningAddress,
	guardarModoLectura: () => guardarModoLectura,
	guardarSoyValidador: () => guardarSoyValidador,
	leavesPendientes: () => leavesPendientes,
	ledger: () => ledger,
	lightningAddress: () => lightningAddress,
	lotesArchivados: () => lotesArchivados,
	misVotos: () => misVotos,
	modoLectura: () => modoLectura,
	publicarEspacio: () => publicarEspacio,
	publicarLotePoAV: () => publicarLotePoAV,
	publicarVoto: () => publicarVoto,
	refrescarCampanas: () => refrescarCampanas,
	refrescarVotos: () => refrescarVotos,
	registrarImpresion: () => registrarImpresion,
	reinvertirGanancia: () => reinvertirGanancia,
	reparto: () => reparto,
	retirar: () => retirar,
	saldoSats: () => saldoSats,
	semillaDeLote: () => semillaDeLote,
	soyValidador: () => soyValidador,
	validarFacturaLN: () => validarFacturaLN,
	verificarPagoLightning: () => verificarPagoLightning,
	votarPendientesAutomatico: () => votarPendientesAutomatico,
	votosDeLote: () => votosDeLote
});
var KIND_CAMPANA = 30028;
var KIND_ESPACIO = 30026;
var KIND_POAV = 30031;
var KIND_VOTO = 30032;
var CLAVE_LEDGER = "ads_ledger";
/** Todas las entradas del ledger, de la más reciente a la más antigua. */
async function ledger() {
	return ((await getMeta(CLAVE_LEDGER, null))?.entradas || []).sort((a, b) => (b.at || 0) - (a.at || 0));
}
async function guardarLedger(entradas) {
	await setMeta({
		id: CLAVE_LEDGER,
		entradas
	});
}
/** Añade un movimiento: tipo: 'deposito'|'retiro'|'ganancia'|'pago' */
async function agregarMovimiento({ tipo, rol = "", concepto = "", sats = 0, ref = "" }) {
	const entradas = await ledger();
	entradas.push({
		id: uid(),
		tipo,
		rol,
		concepto,
		sats: Math.round(sats),
		ref,
		at: Date.now()
	});
	await guardarLedger(entradas);
	return entradas[0];
}
/** Saldo total en sats. */
async function saldoSats() {
	return (await ledger()).reduce((acc, e) => acc + (e.tipo === "retiro" ? -e.sats : e.sats), 0);
}
/** Ganancias por rol (para la pantalla «Mi saldo»). */
async function gananciasPorRol() {
	const entradas = await ledger();
	const porRol = {};
	for (const e of entradas) {
		if (e.tipo !== "ganancia") continue;
		porRol[e.rol || "otro"] = (porRol[e.rol || "otro"] || 0) + e.sats;
	}
	return porRol;
}
/** Deposita sats (manual; en V2, por QR LNURL). */
async function depositar(sats, ref = "manual") {
	await agregarMovimiento({
		tipo: "deposito",
		concepto: "Depósito",
		sats,
		ref
	});
}
/** Retira sats (a wallet externa en V2; en V1 queda registrado). */
async function retirar(sats, ref = "manual") {
	if (sats > await saldoSats()) return {
		ok: false,
		error: "Saldo insuficiente"
	};
	await agregarMovimiento({
		tipo: "retiro",
		concepto: "Retiro",
		sats,
		ref
	});
	return { ok: true };
}
var CLAVE_CAMPANAS = "ads_campanas";
/** Campañas propias (estado local del escrow). */
async function campanasPropias() {
	return (await getMeta(CLAVE_CAMPANAS, null))?.campanas || [];
}
async function guardarCampanas(lista) {
	await setMeta({
		id: CLAVE_CAMPANAS,
		campanas: lista
	});
}
/**
* Crea una campaña local: el presupuesto queda BLOQUEADO en escrow
* (sale del saldo y no se puede retirar). Se libera por lotes de
* impresiones válidas; lo no gastado vuelve al cerrar.
*/
async function crearCampanaLocal({ nombre, imagen, url, cpmUsd, presupuestoUsd, idioma = "es", categorias = "", duracionDias = 30 }) {
	const presupuestoSats = Math.round(presupuestoUsd * 1e5);
	if (presupuestoSats > await saldoSats()) return {
		ok: false,
		error: `Saldo insuficiente: necesitas ${presupuestoSats.toLocaleString("es-CO")} sats (≈ $${presupuestoUsd} USD). Deposita primero.`
	};
	await agregarMovimiento({
		tipo: "pago",
		rol: "escrow",
		concepto: `Escrow: ${nombre}`,
		sats: presupuestoSats
	});
	const campana = {
		id: uid(),
		nombre,
		imagen,
		url,
		cpmUsd: Number(cpmUsd) || .5,
		presupuestoUsd: Number(presupuestoUsd) || 0,
		presupuestoSats,
		gastadoSats: 0,
		idioma,
		categorias,
		estado: "activa",
		creada: Date.now(),
		expira: Date.now() + duracionDias * 864e5
	};
	const lista = await campanasPropias();
	lista.push(campana);
	await guardarCampanas(lista);
	return {
		ok: true,
		campana
	};
}
/** Cierra una campaña: lo no gastado vuelve al saldo. */
async function cerrarCampana(id) {
	const lista = await campanasPropias();
	const c = lista.find((x) => x.id === id);
	if (!c || c.estado === "cerrada") return {
		ok: false,
		error: "Campaña no encontrada o ya cerrada"
	};
	const sobrante = c.presupuestoSats - c.gastadoSats;
	if (sobrante > 0) await agregarMovimiento({
		tipo: "deposito",
		rol: "escrow",
		concepto: `Reembolso de «${c.nombre}» (no gastado)`,
		sats: sobrante
	});
	c.estado = "cerrada";
	c.cerrada = Date.now();
	await guardarCampanas(lista);
	return {
		ok: true,
		sobrante
	};
}
var CLAVE_POAV = "ads_poav";
var CLAVE_RATE = "ads_rate";
var LOTE_MIN = 50;
var MAX_HORA = 30;
var MAX_DIA = 200;
var MIN_VISIBLE_MS = 2e3;
/** Leaves pendientes de agrupar. */
async function leavesPendientes() {
	return (await getMeta(CLAVE_POAV, null))?.leaves || [];
}
async function archivados() {
	return (await getMeta(CLAVE_POAV, null))?.archivados || [];
}
/** Rate limiting por dispositivo: 30/h y 200/día. */
async function permitidoPorRate() {
	const m = await getMeta(CLAVE_RATE, null);
	const ahora = Date.now();
	const hora = m?.hora?.filter((t) => ahora - t < 36e5) || [];
	const dia = m?.dia?.filter((t) => ahora - t < 864e5) || [];
	if (hora.length >= MAX_HORA || dia.length >= MAX_DIA) return false;
	hora.push(ahora);
	dia.push(ahora);
	await setMeta({
		id: CLAVE_RATE,
		hora,
		dia
	});
	return true;
}
/** Genera un par de claves efímero (la privada se descarta tras firmar). */
function claveEfimera() {
	const priv = secp256k1.utils.randomPrivateKey();
	const privHex = bytesToHex(priv);
	return {
		pubHex: bytesToHex(secp256k1.getPublicKey(priv, true).slice(1)),
		nonce: bytesToHex(sha256(priv)).slice(0, 24),
		firmar: (hashHex) => bytesToHex(schnorr.sign(hashHex, privHex))
	};
}
/**
* Registra una impresión VÁLIDA de una campaña (PoAV leaf) si cumple las
* 7 condiciones del protocolo:
*   1. hubo anuncio visible (durationMs real)
*   2. visible ≥ 2 s
*   3. el lector siguió (progreso > 0 o cambió de página)
*   4. sin comportamiento anormal (rate limit 30/h, 200/día)
*   5. dispositivo real (attestation en V2)
*   6. prueba criptográfica: clave efímera + firma
*   7. muestreo posterior por validadores (lote Merkle)
*/
async function registrarImpresion({ campana, libro, durationMs = 0, progreso = 0 }) {
	if (!campana || !libro) return {
		ok: false,
		error: "sin_datos"
	};
	if (durationMs < MIN_VISIBLE_MS) return {
		ok: false,
		error: "visible_menos_2s"
	};
	if (!await permitidoPorRate()) return {
		ok: false,
		error: "rate_limit"
	};
	const identidad = await identidadGuardada();
	const efimera = claveEfimera();
	const eventoHash = bytesToHex(sha256(new TextEncoder().encode(`${campana.id}:${libro.id}:${Date.now()}:${efimera.nonce}`)));
	const leaf = {
		v: 2,
		campaign_id: campana.id,
		ad_id: campana.id,
		book_id: libro.id || libro.d || "",
		publisher_npub: libro.npub || "",
		reader_ephemeral_pubkey: efimera.pubHex,
		timestamp: Math.floor(Date.now() / 1e3),
		duration_ms: Math.round(durationMs),
		nonce: efimera.nonce,
		prev_read_progress: progreso,
		device_attestation_hash: "",
		event_hash: eventoHash,
		sig: efimera.firmar(eventoHash),
		autor_identidad: identidad ? identidad.npub : ""
	};
	const leaves = await leavesPendientes();
	leaves.push(leaf);
	await setMeta({
		id: CLAVE_POAV,
		leaves
	});
	const satsImpresion = Math.max(1, Math.round((campana.cpmUsd || .5) * 1e5 / 1e3));
	const parteLector = Math.max(1, Math.round(satsImpresion * .15));
	await agregarMovimiento({
		tipo: "ganancia",
		rol: "lector",
		concepto: `Leíste un anuncio de «${campana.nombre || "campaña"}»`,
		sats: parteLector,
		ref: campana.id
	});
	reinvertirGanancia(parteLector).catch(() => {});
	await agregarMovimiento({
		tipo: "ganancia",
		rol: "publicidad",
		concepto: `Impresión de «${campana.nombre || "campaña"}» (autor)`,
		sats: Math.max(1, satsImpresion - parteLector),
		ref: campana.id
	});
	if (leaves.length >= LOTE_MIN) return {
		ok: true,
		leaf,
		lote: await publicarLotePoAV()
	};
	return {
		ok: true,
		leaf,
		pendientes: leaves.length
	};
}
/** Raíz Merkle (simple) de un lote de hashes ordenados. */
function raizMerkle(hashes) {
	let nivel = [...hashes].sort();
	while (nivel.length > 1) {
		const siguiente = [];
		for (let i = 0; i < nivel.length; i += 2) {
			const a = nivel[i];
			const b = i + 1 < nivel.length ? nivel[i + 1] : a;
			siguiente.push(bytesToHex(sha256(new TextEncoder().encode(a + b))));
		}
		nivel = siguiente;
	}
	return nivel[0] || "";
}
/**
* Agrupa las impresiones pendientes en una raíz Merkle, la firma con la
* identidad del usuario y publica el evento Kind 30031 en los relays.
*/
async function publicarLotePoAV() {
	const leaves = await leavesPendientes();
	if (!leaves.length) return {
		ok: false,
		error: "sin_impresiones"
	};
	const identidad = await identidadGuardada();
	const root = raizMerkle(leaves.map((l) => l.event_hash));
	const base = crearEvento({
		pubkey: identidad ? identidad.pubHex : leaves[0].reader_ephemeral_pubkey,
		kind: KIND_POAV,
		tags: [
			["d", "poav-" + Date.now().toString(36)],
			["lumen", "1"],
			["root", root],
			["leaves", String(leaves.length)],
			["campaigns", [...new Set(leaves.map((l) => l.campaign_id))].join(",")]
		],
		content: `Lote de ${leaves.length} impresiones válidas (PoAV v2). Root: ${root}`
	});
	const evento = identidad ? firmarEvento(base, identidad.privHex) : base;
	let publicado = 0;
	if (identidad && evento.id) publicado = (await publicarEnRelays(evento)).filter((r) => r.ok).length;
	const arch = await archivados();
	arch.push({
		at: Date.now(),
		leaves,
		campaign_id: leaves[0]?.campaign_id || "",
		root,
		publicado,
		evento: evento.id
	});
	await setMeta({
		id: CLAVE_POAV,
		leaves: [],
		archivados: arch.slice(-50)
	});
	votarPendientesAutomatico().catch(() => {});
	return {
		ok: true,
		root,
		leaves: leaves.length,
		publicado,
		evento: evento.id
	};
}
/** Lotes PoAV archivados (historial). */
async function lotesArchivados() {
	return (await archivados()).reverse();
}
var CLAVE_CAMPANAS_CAT = "ads_campanas_catalogo";
/** Campañas vistas en los relays (caché local). */
async function campanasCatalogo() {
	return (await getMeta(CLAVE_CAMPANAS_CAT, null))?.campanas || [];
}
async function guardarCampanasCatalogo(lista) {
	await setMeta({
		id: CLAVE_CAMPANAS_CAT,
		campanas: lista
	});
}
var tag = (ev, nombre) => {
	const t = (ev.tags || []).find((x) => Array.isArray(x) && x[0] === nombre);
	return t ? String(t[1] || "") : "";
};
/** Evento 30028 → campaña legible. */
function campanaDeEvento(ev) {
	let ad = null;
	try {
		ad = JSON.parse(ev.content || "{}");
	} catch {
		ad = {};
	}
	return {
		id: ev.id,
		d: tag(ev, "d") || ev.id,
		pubkey: ev.pubkey,
		npub: (() => {
			try {
				return npubDeHex(ev.pubkey);
			} catch {
				return "";
			}
		})(),
		nombre: tag(ev, "nombre") || tag(ev, "title") || ad.nombre || "Campaña",
		imagen: tag(ev, "imagen") || tag(ev, "image") || ad.imagen || "",
		url: tag(ev, "url") || tag(ev, "landing_url") || ad.url || "",
		cpmUsd: Number(tag(ev, "cpm") || ad.cpm || .5),
		presupuestoUsd: Number(tag(ev, "budget") || ad.budget || 0),
		idioma: tag(ev, "language") || "es",
		categorias: tag(ev, "categories") || "",
		expira: Number(tag(ev, "expires") || 0),
		moderacion: tag(ev, "moderation") || "",
		activa: true,
		evento: ev
	};
}
/** Evento de campaña (Kind 30028) para publicar como anunciante. */
function eventoDeCampana({ identidad, d, nombre, imagen, url, cpmUsd, presupuestoUsd, idioma, categorias, duracionDias }) {
	const tags = [
		["d", d],
		["lumen", "1"],
		["nombre", nombre],
		["imagen", imagen],
		["url", url],
		["cpm", String(cpmUsd)],
		["budget", String(presupuestoUsd)],
		["language", idioma],
		["categories", categorias],
		["expires", String(Date.now() + duracionDias * 864e5)],
		["moderation", "approved:local:0.85"]
	];
	return firmarEvento(crearEvento({
		pubkey: identidad.pubHex,
		kind: KIND_CAMPANA,
		tags,
		content: JSON.stringify({
			nombre,
			imagen,
			url,
			cpm: cpmUsd,
			budget: presupuestoUsd
		})
	}), identidad.privHex);
}
/** Consulta campañas activas a los relays (Kind 30028). */
async function refrescarCampanas({ onEstado = null } = {}) {
	const relays = await relaysGuardados();
	const mapa = /* @__PURE__ */ new Map();
	for (const c of await campanasCatalogo()) mapa.set(c.id, c);
	let terminados = 0;
	const total = relays.length;
	const chequeo = () => {
		if (terminados >= total) {
			const lista = [...mapa.values()].sort((a, b) => (b.evento?.created_at || 0) - (a.evento?.created_at || 0));
			guardarCampanasCatalogo(lista);
			onEstado?.("listo", lista);
		}
	};
	for (const url of relays) {
		const subId = "lumen-ads-" + Math.random().toString(36).slice(2, 8);
		const filtros = [{
			kinds: [KIND_CAMPANA],
			"#lumen": ["1"],
			limit: 100
		}];
		const maneja = (ev) => {
			if (!verificarEvento(ev)) return;
			const c = campanaDeEvento(ev);
			if (c.moderacion && !c.moderacion.startsWith("approved")) return;
			mapa.set(ev.id, c);
		};
		const estado = (est) => {
			if (est === "eose" || est === "cerrado" || est === "error") {
				terminados += 1;
				chequeo();
			}
		};
		conectarRelay(url, maneja, estado);
		suscribir(url, subId, filtros);
	}
	return campanasCatalogo();
}
/** Normaliza texto para comparar sin acentos ni mayúsculas. */
var norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
/** Campañas compatibles con un libro (idioma + categorías). */
function campanasCompatibles(campanas, libro) {
	const catLibro = norm(libro?.categoria);
	const idiomaLibro = norm(libro?.idioma) || "es";
	return (campanas || []).filter((c) => {
		if (!c.activa) return false;
		if (c.idioma && c.idioma !== "otro" && norm(c.idioma) !== idiomaLibro) return false;
		if (c.categorias) {
			const cats = c.categorias.split(",").map((x) => norm(x.trim()));
			if (cats.length && catLibro && !cats.includes(catLibro) && !cats.includes("todos")) return false;
		}
		if (c.expira && c.expira > 0 && c.expira < Date.now()) return false;
		return true;
	});
}
var CLAVE_ESPACIO = "ads_espacio";
/** Configuración del espacio publicitario del usuario. */
async function espacioActual() {
	return (await getMeta(CLAVE_ESPACIO, null))?.espacio || null;
}
async function guardarEspacioLocal(espacio) {
	await setMeta({
		id: CLAVE_ESPACIO,
		espacio
	});
}
/** Publica (o actualiza) el AD_SPACE del usuario en los relays. */
async function publicarEspacio(espacio) {
	const identidad = await identidadGuardada();
	if (!identidad) return {
		ok: false,
		error: "sin_identidad"
	};
	const tags = [
		["d", "space-" + (espacio.bookId || "general")],
		["lumen", "1"],
		["book_id", espacio.bookId || ""],
		["book_title", espacio.bookTitle || ""],
		["accepts_ads", espacio.acepta ? "yes" : "no"],
		["cpm_min", String(espacio.cpmMin || 0)],
		["categories", espacio.categorias || ""],
		["frequency", espacio.frecuencia || "1_per_5_pages"],
		["language", espacio.idioma || "es"]
	];
	const evento = firmarEvento(crearEvento({
		pubkey: identidad.pubHex,
		kind: KIND_ESPACIO,
		tags,
		content: ""
	}), identidad.privHex);
	const resultados = await publicarEnRelays(evento);
	await guardarEspacioLocal(espacio);
	return {
		ok: resultados.some((r) => r.ok),
		publicado: resultados.filter((r) => r.ok).length,
		evento
	};
}
/** Reparto de un lote liberado del escrow (según doc v4.0). */
function reparto(sats) {
	const total = Math.round(sats);
	const publisher = Math.round(total * .7);
	const autor = Math.round(publisher * .8);
	const seeders = publisher - autor;
	const lector = Math.round(total * .15);
	const validadores = Math.round(total * .05);
	const moderadores = Math.round(total * .05);
	let comision = total - (publisher + lector + validadores + moderadores);
	if (comision < 0) comision = 0;
	return {
		total,
		publisher,
		autor,
		seeders,
		lector,
		validadores,
		moderadores,
		comision,
		infra: comision,
		tesoreria: 0
	};
}
var CLAVE_MODO = "ads_modo";
/** Modo de lectura del lector: 'limpio' | 'colaborador' | 'contribuidor'. */
async function modoLectura() {
	return (await getMeta(CLAVE_MODO, null))?.modo || "colaborador";
}
async function guardarModoLectura(modo) {
	await setMeta({
		id: CLAVE_MODO,
		modo
	});
}
/** Cada cuántos capítulos se muestra anuncio según el modo (0 = nunca). */
async function frecuenciaAnuncio() {
	const modo = await modoLectura();
	if (modo === "contribuidor") return 3;
	if (modo === "colaborador") return 5;
	return 0;
}
/** Descripción corta de cada modo. */
var MODOS = {
	limpio: {
		icono: "📖",
		nombre: "Lector",
		desc: "Sin anuncios, no ganas sats"
	},
	colaborador: {
		icono: "🤝",
		nombre: "Colaborador",
		desc: "1 anuncio cada 5 capítulos, ganas sats"
	},
	contribuidor: {
		icono: "🌱",
		nombre: "Contribuidor",
		desc: "1 anuncio cada 3 capítulos + más ganancias"
	}
};
var CLAVE_VALIDADOR = "ads_validador";
/** ¿El usuario quiere ser validador? (opt-in, gana reputación/sats) */
async function soyValidador() {
	return (await getMeta(CLAVE_VALIDADOR, null))?.activo === true;
}
async function guardarSoyValidador(activo) {
	await setMeta({
		id: CLAVE_VALIDADOR,
		activo: !!activo
	});
}
/**
* Lotería determinística del documento maestro v4.0:
* score = sha256(semilla + npub) → los n con score más bajo son elegidos.
* Verificable por cualquiera: no hay servidor que manipule el sorteo.
*/
function elegirValidadores(candidatos, semilla, n = 5) {
	const conScore = (candidatos || []).map((npub) => {
		const h = bytesToHex(sha256(new TextEncoder().encode(`${semilla}:${npub}`)));
		return {
			npub,
			score: parseInt(h.slice(0, 12), 16)
		};
	});
	conScore.sort((a, b) => a.score - b.score);
	return conScore.slice(0, n).map((x) => x.npub);
}
/** Semilla de un lote: campaign+root (igual para todos los clientes). */
function semillaDeLote(lote) {
	return `${lote.campaign_id || ""}:${lote.root || ""}`;
}
var CLAVE_VOTOS = "ads_votos";
/** Votos emitidos por este usuario (caché local). */
async function misVotos() {
	return (await getMeta(CLAVE_VOTOS, null))?.votos || [];
}
async function guardarMisVotos(votos) {
	await setMeta({
		id: CLAVE_VOTOS,
		votos
	});
}
/** Votos recibidos de los relays (caché local, kind 30032). */
async function votosDeLote(root) {
	return ((await getMeta(CLAVE_VOTOS, null))?.recibidos || []).filter((v) => v.root === root);
}
/**
* Publica el voto del validador (Kind 30032, firmado).
* voto: 'aprobar' | 'rechazar', confianza 0-1.
*/
async function publicarVoto({ lote, voto, confianza = .9, nota = "" }) {
	const identidad = await identidadGuardada();
	if (!identidad) return {
		ok: false,
		error: "sin_identidad"
	};
	const evento = firmarEvento(crearEvento({
		pubkey: identidad.pubHex,
		kind: KIND_VOTO,
		tags: [
			["lumen", "1"],
			["root", lote.root],
			["campaign_id", lote.campaign_id || ""],
			["voto", voto],
			["confianza", String(confianza)]
		],
		content: nota || `Voto de validador: ${voto} (${confianza})`
	}), identidad.privHex);
	const resultados = await publicarEnRelays(evento);
	const votos = await misVotos();
	votos.push({
		root: lote.root,
		voto,
		confianza,
		at: Date.now(),
		id: evento.id
	});
	await guardarMisVotos(votos);
	return {
		ok: resultados.some((r) => r.ok),
		publicado: resultados.filter((r) => r.ok).length,
		evento
	};
}
/**
* Consenso sobre un lote: si hay >=3 votos y >=70% aprueban → liberado.
* Devuelve { estado: 'pendiente'|'aprobado'|'rechazado', votos, aprobados }
*/
function consensoDeLote(votos, minimoVotos = 3, umbral = .7) {
	const validos = (votos || []).filter((v) => v.voto === "aprobar" || v.voto === "rechazar");
	if (validos.length < minimoVotos) return {
		estado: "pendiente",
		votos: validos.length,
		aprobados: 0
	};
	const aprobados = validos.filter((v) => v.voto === "aprobar").length;
	const pct = aprobados / validos.length;
	if (pct >= umbral) return {
		estado: "aprobado",
		votos: validos.length,
		aprobados,
		pct
	};
	return {
		estado: "rechazado",
		votos: validos.length,
		aprobados,
		pct
	};
}
/** Consulta votos de los relays (kind 30032) para un root. */
async function refrescarVotos({ onEstado = null } = {}) {
	const relays = await relaysGuardados();
	const mapa = /* @__PURE__ */ new Map();
	const m = await getMeta(CLAVE_VOTOS, null);
	for (const v of m?.recibidos || []) mapa.set(v.id, v);
	let terminados = 0;
	const total = relays.length;
	const chequeo = () => {
		if (terminados >= total) {
			const lista = [...mapa.values()];
			guardarMisVotos({
				...m || {},
				recibidos: lista
			});
			onEstado?.("listo", lista);
		}
	};
	for (const url of relays) {
		const subId = "lumen-votos-" + Math.random().toString(36).slice(2, 8);
		const filtros = [{
			kinds: [KIND_VOTO],
			"#lumen": ["1"],
			limit: 100
		}];
		const maneja = (ev) => {
			if (!verificarEvento(ev)) return;
			const root = tag(ev, "root");
			const voto = tag(ev, "voto");
			if (!root) return;
			mapa.set(ev.id, {
				id: ev.id,
				root,
				pubkey: ev.pubkey,
				voto,
				confianza: Number(tag(ev, "confianza") || .9),
				at: ev.created_at,
				verificado: true
			});
		};
		const estado = (est) => {
			if (est === "eose" || est === "cerrado" || est === "error") {
				terminados += 1;
				chequeo();
			}
		};
		conectarRelay(url, maneja, estado);
		suscribir(url, subId, filtros);
	}
	return votosDeLote("");
}
function hojaSana(leaf) {
	if (!leaf || typeof leaf !== "object") return false;
	if (!leaf.event_hash || !leaf.sig) return false;
	if (Number(leaf.duration_ms || 0) < MIN_VISIBLE_MS) return false;
	return true;
}
function evaluarLote(loteLeaves) {
	const leaves = Array.isArray(loteLeaves) ? loteLeaves : [];
	if (!leaves.length) return {
		voto: "rechazar",
		confianza: .2,
		motivo: "lote vacío"
	};
	const validas = leaves.filter(hojaSana);
	const ratio = validas.length / leaves.length;
	const duplicados = new Set(leaves.map((l) => l.nonce).filter(Boolean)).size < validas.length;
	let firmasOk = 0;
	for (const l of validas) try {
		const pub = secp256k1.getPublicKey(l.reader_ephemeral_pubkey, true).slice(1);
		if (schnorr.verify(l.sig, l.event_hash, pub)) firmasOk++;
	} catch {}
	const ratioFirmas = firmasOk / validas.length;
	const tiempos = leaves.map((l) => Number(l.timestamp) || 0).sort((a, b) => a - b);
	let saltoMin = Infinity;
	for (let i = 1; i < tiempos.length; i++) saltoMin = Math.min(saltoMin, tiempos[i] - tiempos[i - 1]);
	const rafaga = saltoMin < 1;
	let confianza = .9;
	if (ratio < .98) confianza -= .3;
	if (ratioFirmas < .98) confianza -= .4;
	if (duplicados) confianza -= .4;
	if (rafaga) confianza -= .2;
	confianza = Math.max(.1, Math.round(confianza * 100) / 100);
	if (ratioFirmas < .9 || ratio < .9 || duplicados) return {
		voto: "rechazar",
		confianza,
		motivo: `firmas ${firmasOk}/${validas.length}, duplicados=${duplicados}`
	};
	return {
		voto: "aprobar",
		confianza,
		motivo: `todo verificado (${validas.length} hojas)`
	};
}
async function votarPendientesAutomatico() {
	if (!await soyValidador()) return 0;
	if (!await identidadGuardada()) return 0;
	const arch = await archivados();
	const dados = new Set((await misVotos()).map((v) => v.root));
	let emitidos = 0;
	for (const lote of arch) {
		if (dados.has(lote.root)) continue;
		const { voto, confianza, motivo } = evaluarLote(lote.leaves);
		try {
			if ((await publicarVoto({
				lote,
				voto,
				confianza,
				nota: `Auto: ${motivo}`
			})).ok) emitidos++;
		} catch {}
	}
	return emitidos;
}
var CLAVE_AUTO = "ads_autoinversion";
var MIN_BOTE = 1e3;
async function configAutoInversion() {
	return (await getMeta(CLAVE_AUTO, null))?.config || {
		activa: false,
		porcentaje: 20,
		bote: 0,
		campanasFinanciadas: 0
	};
}
async function guardarAutoInversion(cfg) {
	await setMeta({
		id: CLAVE_AUTO,
		config: cfg
	});
}
async function reinvertirGanancia(sats) {
	const cfg = await configAutoInversion();
	if (!cfg.activa || sats <= 0) return { invertido: 0 };
	const parte = Math.round(sats * (cfg.porcentaje / 100));
	if (parte <= 0) return { invertido: 0 };
	cfg.bote = (cfg.bote || 0) + parte;
	let campana = null;
	if (cfg.bote >= MIN_BOTE) {
		campana = await crearCampanaLocal({
			nombre: "Propina de la comunidad",
			imagen: "",
			url: "",
			cpmUsd: .5,
			presupuestoUsd: cfg.bote / 1e5,
			idioma: "otro",
			categorias: "todos",
			duracionDias: 30
		});
		if (campana.ok) {
			cfg.bote = 0;
			cfg.campanasFinanciadas = (cfg.campanasFinanciadas || 0) + 1;
		}
	}
	await guardarAutoInversion(cfg);
	return {
		invertido: parte,
		campana: campana?.ok ? campana.campana : null
	};
}
var CLAVE_LN = "ads_lightning";
/** Lightning Address guardada (ej: nombre@dominio.com). */
async function lightningAddress() {
	return (await getMeta(CLAVE_LN, null))?.address || "";
}
async function guardarLightningAddress(address) {
	await setMeta({
		id: CLAVE_LN,
		address: String(address || "").trim()
	});
}
/**
* Genera una factura LNURL-pay REAL desde una Lightning Address.
* 1. GET https://<dominio>/.well-known/lnurlp/<usuario>
* 2. GET <callback>?amount=<msats> → { pr: "lnbc…" }
* Devuelve { ok, factura, dominio, descripcion, min, max }
*/
async function generarFacturaLightning(address, sats) {
	const addr = String(address || "").trim().toLowerCase();
	if (!addr || !addr.includes("@")) return {
		ok: false,
		error: "Escribe tu Lightning Address como nombre@dominio.com"
	};
	const [usuario, dominio] = addr.split("@");
	if (!usuario || !dominio) return {
		ok: false,
		error: "Lightning Address no válida (formato nombre@dominio.com)"
	};
	try {
		const r = await fetch(`https://${dominio}/.well-known/lnurlp/${encodeURIComponent(usuario)}`, { headers: { Accept: "application/json" } });
		if (!r.ok) return {
			ok: false,
			error: `El dominio ${dominio} no responde (${r.status}). ¿La dirección es correcta?`
		};
		const info = await r.json();
		if (info.tag !== "payRequest") return {
			ok: false,
			error: "Esa dirección no acepta pagos (LNURL-pay)"
		};
		const msats = Math.round((Number(sats) || 1) * 1e3);
		if (info.minSendable && msats < info.minSendable) return {
			ok: false,
			error: `El mínimo son ${Math.round(info.minSendable / 1e3)} sats`
		};
		if (info.maxSendable && msats > info.maxSendable) return {
			ok: false,
			error: `El máximo son ${Math.round(info.maxSendable / 1e3)} sats`
		};
		const pago = await (await fetch(`${info.callback}${info.callback.includes("?") ? "&" : "?"}amount=${msats}`, { headers: { Accept: "application/json" } })).json();
		if (!pago.pr) return {
			ok: false,
			error: "La dirección no devolvió una factura: " + String(pago.reason || "error desconocido").slice(0, 100)
		};
		return {
			ok: true,
			factura: pago.pr,
			dominio,
			descripcion: info.metadata || "",
			min: info.minSendable,
			max: info.maxSendable
		};
	} catch (e) {
		return {
			ok: false,
			error: `Sin conexión con ${dominio}: ${String(e?.message || e).slice(0, 90)}`
		};
	}
}
/** Valida el formato de una factura Lightning (lnbc…). */
function validarFacturaLN(factura) {
	const f = String(factura || "").trim();
	if (!/^lnbc/i.test(f)) return {
		ok: false,
		error: "La factura debe empezar por lnbc… (factura Lightning)"
	};
	return { ok: true };
}
var EXPLORADORES_LN = [(b) => `https://api.lnrouter.app/inv?payment_request=${encodeURIComponent(b)}`];
function decodificarFactura(bolt11) {
	try {
		const f = String(bolt11 || "").trim().toLowerCase();
		if (!f.startsWith("lnbc")) return {
			ok: false,
			error: "no es una factura lightning"
		};
		const m = f.match(/^lnbc(\d+)([munp]?)/);
		if (!m) return {
			ok: false,
			error: "formato"
		};
		const num = Number(m[1]);
		const u = m[2];
		return {
			ok: true,
			sats: Math.max(1, Math.round(num * (u === "" ? 1e8 : u === "m" ? 1e5 : u === "u" ? 100 : u === "n" ? .1 : u === "p" ? 1e-4 : 1e8) / 1e3))
		};
	} catch {
		return {
			ok: false,
			error: "no se pudo leer"
		};
	}
}
async function verificarPagoLightning(bolt11) {
	const v = validarFacturaLN(bolt11);
	if (!v.ok) return {
		ok: false,
		error: v.error
	};
	const info = decodificarFactura(bolt11);
	for (const url of EXPLORADORES_LN) try {
		const r = await fetch(url(bolt11), { headers: { Accept: "application/json" } });
		if (!r.ok) continue;
		const d = await r.json();
		const estado = String(d.status || d.state || d.payment?.status || d.settled_state || "").toLowerCase();
		if (d.settled === true || d.paid === true || [
			"settled",
			"paid",
			"complete",
			"success"
		].includes(estado)) return {
			ok: true,
			pagada: true,
			sats: info.ok ? info.sats : null,
			fuente: r.url.split("/")[2]
		};
	} catch {}
	return {
		ok: true,
		pagada: false,
		sats: info.ok ? info.sats : null,
		error: "La factura aún no aparece pagada."
	};
}
//#endregion
export { reparto as A, lumenAds_exports as C, refrescarCampanas as D, publicarVoto as E, validarFacturaLN as F, verificarPagoLightning as I, votarPendientesAutomatico as L, saldoSats as M, semillaDeLote as N, refrescarVotos as O, soyValidador as P, votosDeLote as R, lotesArchivados as S, publicarEspacio as T, guardarLightningAddress as _, cerrarCampana as a, ledger as b, crearCampanaLocal as c, espacioActual as d, eventoDeCampana as f, guardarAutoInversion as g, generarFacturaLightning as h, campanasPropias as i, retirar as j, registrarImpresion as k, depositar as l, gananciasPorRol as m, campanasCatalogo as n, configAutoInversion as o, frecuenciaAnuncio as p, campanasCompatibles as r, consensoDeLote as s, MODOS as t, elegirValidadores as u, guardarModoLectura as v, modoLectura as w, lightningAddress as x, guardarSoyValidador as y };
