import { C as putBlob, O as setMeta, h as getMeta, p as getBlob } from "./db-Ii3ipPL7.js";
import { crearEvento, firmarEvento, npubDeHex, publicarEnRelays } from "./nostr-zC6Qsl2z.js";
//#region src/lib/publicados.js
var CLAVE = "lumen_publicados";
var KIND_BORRADO = 5;
/** Lista de publicaciones, de la más reciente a la más antigua. */
async function listarPublicados() {
	return ((await getMeta(CLAVE, null))?.lista || []).sort((a, b) => (b.updated || b.createdAt || 0) - (a.updated || a.createdAt || 0));
}
async function guardarLista(lista) {
	await setMeta({
		id: CLAVE,
		lista
	});
}
/** Crea o actualiza una publicación (por `d`), anotando en el historial. */
async function guardarPublicado(pub) {
	const lista = await listarPublicados();
	const i = lista.findIndex((p) => p.d === pub.d);
	const ahora = Date.now();
	const registro = {
		...pub,
		createdAt: pub.createdAt || ahora,
		updated: ahora,
		historial: [...pub.historial || [], ...pub._accion ? [{
			at: ahora,
			accion: pub._accion
		}] : []].slice(-40)
	};
	delete registro._accion;
	if (i >= 0) registro.createdAt = lista[i].createdAt;
	if (i >= 0) lista[i] = registro;
	else lista.unshift(registro);
	await guardarLista(lista);
	return registro;
}
/** Actualiza campos sueltos sin duplicar historial. */
async function parchearPublicado(d, patch) {
	const lista = await listarPublicados();
	const i = lista.findIndex((p) => p.d === d);
	if (i < 0) return null;
	lista[i] = {
		...lista[i],
		...patch,
		updated: Date.now()
	};
	await guardarLista(lista);
	return lista[i];
}
/** Elimina una publicación del historial local (no toca la red). */
async function borrarPublicadoLocal(d) {
	await guardarLista((await listarPublicados()).filter((p) => p.d !== d));
}
var claveBlobLumen = (d) => "lumen_pub:" + d;
/** Guarda el blob .lumen de una publicación. */
async function guardarBlobLumen(d, blob) {
	await putBlob(claveBlobLumen(d), blob, { nombre: d + ".lumen" });
}
/** Recupera el blob .lumen (o null si no está). */
async function obtenerBlobLumen(d) {
	try {
		return (await getBlob(claveBlobLumen(d)))?.blob || null;
	} catch {
		return null;
	}
}
/** Resume el estado: 'publicado' | 'parcial' | 'local'. */
function estadoDe(pub) {
	const rs = pub.estadoRelays || [];
	const ok = rs.filter((r) => r.ok).length;
	if (!rs.length) return {
		nivel: "local",
		etiqueta: "📴 Solo en tu teléfono",
		ok: 0,
		total: 0
	};
	if (ok === rs.length) return {
		nivel: "publicado",
		etiqueta: `✅ En ${ok} relay(s)`,
		ok,
		total: rs.length
	};
	if (ok > 0) return {
		nivel: "parcial",
		etiqueta: `⚠️ ${ok}/${rs.length} relays`,
		ok,
		total: rs.length
	};
	return {
		nivel: "local",
		etiqueta: "❌ No llegó a los relays",
		ok: 0,
		total: rs.length
	};
}
/** Reenvía el evento firmado a todos los relays y actualiza el estado. */
async function reenviarPublicado(pub) {
	if (!pub.evento) return {
		ok: 0,
		resultados: []
	};
	const resultados = await publicarEnRelays(pub.evento);
	const ok = resultados.filter((r) => r.ok).length;
	await parchearPublicado(pub.d, {
		estadoRelays: resultados.map((r) => ({
			url: r.url,
			ok: r.ok,
			detalle: r.detalle || ""
		})),
		_accion: null
	});
	const lista = await listarPublicados();
	const actual = lista.find((p) => p.d === pub.d);
	if (actual) {
		actual.historial = [...actual.historial || [], {
			at: Date.now(),
			accion: `Reenviado a los relays (${ok}/${resultados.length} ok)`
		}].slice(-40);
		await guardarLista(lista);
	}
	return {
		ok,
		total: resultados.length,
		resultados
	};
}
/**
* Pide a los relays borrar el libro (NIP-09, Kind 5) y lo quita de tu
* historial. OJO: Nostr es inmutable; algunos relays ignoran la petición,
* pero el catálogo de Lumen sí la respeta y deja de mostrarlo.
*/
async function borrarPublicadoRed(pub, identidad) {
	let resultados = [];
	try {
		const tags = [["e", pub.evento?.id || ""]];
		if (pub.evento?.id) resultados = await publicarEnRelays(firmarEvento(crearEvento({
			pubkey: identidad.pubHex,
			kind: KIND_BORRADO,
			tags,
			content: "Borrado por su autor desde LumenReader"
		}), identidad.privHex));
	} catch (e) {
		console.warn("[publicados] borrado en red", e?.message || e);
	}
	await borrarPublicadoLocal(pub.d);
	return resultados;
}
/** Convierte una publicación al formato de libro que usan Catalogo/Lector. */
function libroDePublicado(pub) {
	const ev = pub.evento || {};
	let npub = "";
	try {
		npub = ev.pubkey ? npubDeHex(ev.pubkey) : "";
	} catch {}
	return {
		id: ev.id || "pub-" + pub.d,
		pubkey: ev.pubkey || "",
		npub,
		createdAt: ev.created_at || Math.floor((pub.createdAt || Date.now()) / 1e3),
		d: pub.d,
		titulo: pub.titulo,
		autor: pub.autor,
		categoria: pub.categoria || "",
		idioma: pub.idioma || "es",
		portada: pub.portada || "",
		cid: "",
		magnet: pub.magnet || "",
		fileUrl: pub.fileUrl || "",
		audioUrl: pub.audioUrl || "",
		videoUrl: pub.videoUrl || "",
		tamano: pub.tamano || "",
		paginas: pub.paginas || "",
		ad: pub.ad || null,
		donacion: pub.donacion || "",
		zap: pub.zap || "",
		rating: pub.rating || "general",
		etiquetas: pub.etiquetas || [],
		descripcion: pub.descripcion || "",
		evento: pub.evento || null,
		esMio: true,
		_local: true
	};
}
/** Enlace profundo para compartir: lumenreader://b/<d> */
var enlaceDe = (pub) => `lumenreader://b/${pub.d}`;
function esc(t) {
	return String(t ?? "").replace(/[&<>"']/g, (m) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[m]);
}
function generarVitrinaHtml(pubs, { nombre = "Mis libros", npub = "" } = {}) {
	const fecha = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CO", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const tarjetas = pubs.map((p) => {
		const portada = p.portada ? `<img class="cov" src="${esc(p.portada)}" alt=""/>` : `<div class="cov gen" style="background:linear-gradient(150deg,hsl(${hslDe(p.titulo)} 60% 44%),hsl(${(hslDe(p.titulo) + 45) % 360} 56% 24%))">${esc(inicialesDe(p.titulo))}</div>`;
		const enlace = enlaceDe(p);
		const magnet = p.magnet || "";
		return `
    <article class="libro">
      ${portada}
      <div class="info">
        <h3>${esc(p.titulo)}</h3>
        <p class="aut">${esc(p.autor)}${p.categoria ? " · " + esc(p.categoria) : ""}</p>
        ${p.descripcion ? `<p class="des">${esc(String(p.descripcion).slice(0, 240))}</p>` : ""}
        <div class="botones">
          <a class="btn" href="${esc(enlace)}">📖 Abrir en Lumen Reader</a>
          ${magnet ? `<button class="btn alt" onclick="copiar(this,'${esc(magnet).replace(/'/g, "\\'")}')">🧲 Copiar magnet</button>` : ""}
          <button class="btn alt" onclick="copiar(this,'${esc(enlace)}')">🔗 Copiar enlace</button>
        </div>
        <small class="id">lumenreader://b/${esc(p.d)}</small>
      </div>
    </article>`;
	}).join("\n");
	return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(nombre)} · Lumen Reader</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system,'Segoe UI',Roboto,sans-serif; background:#0b0b0f; color:#ecebf3; }
  header { padding:34px 20px 10px; text-align:center; background:radial-gradient(600px 220px at 50% -40px, rgba(124,92,255,.35), transparent); }
  header h1 { margin:0 0 6px; font-size:26px; }
  header p { margin:0; color:#9b98ad; font-size:13px; }
  main { max-width:860px; margin:0 auto; padding:18px 16px 60px; display:grid; gap:14px; }
  .libro { display:flex; gap:14px; background:#15151c; border:1px solid #26263a; border-radius:16px; padding:14px; }
  .cov { width:92px; height:132px; border-radius:10px; object-fit:cover; flex:none; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; color:rgba(255,255,255,.9); }
  .info { min-width:0; }
  .info h3 { margin:2px 0 2px; font-size:17px; }
  .aut { margin:0 0 6px; color:#9b98ad; font-size:12.5px; }
  .des { margin:0 0 10px; font-size:13px; color:#c9c6d8; line-height:1.45; }
  .botones { display:flex; flex-wrap:wrap; gap:8px; }
  .btn { display:inline-block; padding:8px 12px; border-radius:10px; border:0; background:#7c5cff; color:#fff; font-size:12.5px; font-weight:600; text-decoration:none; cursor:pointer; }
  .btn.alt { background:#26263a; color:#ecebf3; }
  .id { display:block; margin-top:8px; color:#5f5c72; font-size:10.5px; word-break:break-all; }
  footer { text-align:center; color:#5f5c72; font-size:12px; padding:20px; }
  @media (max-width:520px){ .libro{flex-direction:column} .cov{width:100%; height:180px} }
</style>
</head>
<body>
<header>
  <h1>📚 ${esc(nombre)}</h1>
  <p>Publicado con Lumen Reader · sin servidor central${npub ? " · " + esc(npub.slice(0, 20)) + "…" : ""} · ${esc(fecha)}</p>
</header>
<main>
${tarjetas || "<p style=\"text-align:center;color:#9b98ad\">Todavía no hay libros publicados.</p>"}
</main>
<footer>Cada libro es un evento firmado en la red Nostr y se comparte por torrent. Escanea o abre el enlace en Lumen Reader para leerlo.</footer>
<script>
function copiar(btn, texto){
  try { navigator.clipboard.writeText(texto); btn.textContent = '✓ Copiado'; setTimeout(()=>location.reload(), 900); }
  catch(e){ prompt('Copia manualmente:', texto); }
}
<\/script>
</body>
</html>`;
}
function hslDe(s) {
	let h = 0;
	for (let i = 0; i < String(s).length; i++) h = (h * 31 + String(s).charCodeAt(i)) % 360;
	return h;
}
function inicialesDe(s) {
	return String(s || "L").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
/** Exporta el catálogo propio en JSON (para tu web o herramientas). */
function exportarJson(pubs) {
	return JSON.stringify(pubs.map((p) => ({
		d: p.d,
		titulo: p.titulo,
		autor: p.autor,
		categoria: p.categoria,
		idioma: p.idioma,
		descripcion: p.descripcion,
		magnet: p.magnet || "",
		enlace: enlaceDe(p),
		publicado: new Date(p.createdAt || Date.now()).toISOString(),
		estado: estadoDe(p).etiqueta
	})), null, 2);
}
//#endregion
export { generarVitrinaHtml as a, libroDePublicado as c, reenviarPublicado as d, exportarJson as i, listarPublicados as l, enlaceDe as n, guardarBlobLumen as o, estadoDe as r, guardarPublicado as s, borrarPublicadoRed as t, obtenerBlobLumen as u };
