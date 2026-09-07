import { t as require_react } from "./react-1WJTggxS.js";
import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { RELAYS_DEFECTO, borrarIdentidad, descubrirRelays, generarIdentidad, guardarIdentidad, guardarRelays, identidadGuardada, npubCorto, relaysGuardados } from "./nostr-zC6Qsl2z.js";
//#region src/lib/moderacion.js
var import_react = require_react();
var CLAVE = "nostr_moderacion";
var PROVEEDORES = [
	{
		id: "google",
		nombre: "Google Gemini",
		icono: "🔴",
		desc: "El más popular, gratis hasta cierto límite",
		modelos: [
			"gemini-3.1-pro",
			"gemini-3.1-pro-preview",
			"gemini-3.5-flash",
			"gemini-3.5-flash-latest",
			"gemini-3-flash",
			"gemini-3-flash-latest",
			"gemini-2.5-pro",
			"gemini-2.5-flash",
			"gemini-2.0-flash",
			"gemini-1.5-flash"
		],
		modeloDefecto: "gemini-3.5-flash",
		urlBase: "https://generativelanguage.googleapis.com/v1beta"
	},
	{
		id: "openai",
		nombre: "ChatGPT (OpenAI)",
		icono: "🟢",
		desc: "Modelos GPT",
		modelos: [
			"gpt-5-mini",
			"gpt-5-nano",
			"gpt-4.1-mini",
			"gpt-4.1-nano",
			"gpt-4o-mini",
			"gpt-4o"
		],
		modeloDefecto: "gpt-5-mini",
		urlBase: "https://api.openai.com/v1"
	},
	{
		id: "anthropic",
		nombre: "Claude (Anthropic)",
		icono: "🟠",
		desc: "Muy bueno en texto",
		modelos: [
			"claude-sonnet-4-6",
			"claude-haiku-4-5",
			"claude-3-5-sonnet-latest",
			"claude-3-5-haiku-latest"
		],
		modeloDefecto: "claude-haiku-4-5",
		urlBase: "https://api.anthropic.com/v1"
	},
	{
		id: "groq",
		nombre: "Groq (Llama)",
		icono: "🟣",
		desc: "Rápido y con capa gratuita",
		modelos: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
		modeloDefecto: "llama-3.3-70b-versatile",
		urlBase: "https://api.groq.com/openai/v1"
	},
	{
		id: "mistral",
		nombre: "Mistral",
		icono: "🟡",
		desc: "Europeo, con plan gratis",
		modelos: [
			"mistral-small-latest",
			"mistral-medium-latest",
			"mistral-large-latest"
		],
		modeloDefecto: "mistral-small-latest",
		urlBase: "https://api.mistral.ai/v1"
	}
];
var proveedorDe = (id) => PROVEEDORES.find((p) => p.id === id) || PROVEEDORES[0];
async function configIA() {
	return (await getMeta(CLAVE, null))?.config || {
		proveedor: "google",
		apiKey: "",
		modelo: ""
	};
}
async function guardarConfigIA(config) {
	await setMeta({
		id: CLAVE,
		config
	});
}
async function postJson(url, body, { bearer = "", apiKeyHeader = "" } = {}) {
	try {
		const b = typeof window !== "undefined" ? window.AndroidShare : null;
		if (b && typeof b.httpPostJson === "function") {
			const resp = b.httpPostJson(url, JSON.stringify(body), bearer, apiKeyHeader) || "";
			if (resp.startsWith("HTTP_ERROR:")) {
				const p = resp.split(":");
				return {
					ok: false,
					status: Number(p[1]) || 0,
					data: tryJson(p.slice(2).join(":"))
				};
			}
			return {
				ok: true,
				status: 200,
				data: tryJson(resp)
			};
		}
	} catch {}
	const headers = { "Content-Type": "application/json" };
	if (bearer) headers.Authorization = `Bearer ${bearer}`;
	if (apiKeyHeader) {
		const d = apiKeyHeader.indexOf(":");
		if (d > 0) headers[apiKeyHeader.slice(0, d).trim()] = apiKeyHeader.slice(d + 1).trim();
	}
	const r = await fetch(url, {
		method: "POST",
		headers,
		body: JSON.stringify(body)
	});
	let data = null;
	try {
		data = await r.json();
	} catch {}
	return {
		ok: r.ok,
		status: r.status,
		data
	};
}
function tryJson(s) {
	try {
		return JSON.parse(s);
	} catch {
		return null;
	}
}
async function getJson(url, { bearer = "" } = {}) {
	try {
		const b = typeof window !== "undefined" ? window.AndroidShare : null;
		if (b && typeof b.httpGet === "function") {
			const c = b.httpGet(url);
			if (c) return tryJson(c);
		}
	} catch {}
	try {
		const headers = { Accept: "application/json" };
		if (bearer) headers.Authorization = `Bearer ${bearer}`;
		const r = await fetch(url, { headers });
		if (r.ok) return await r.json();
	} catch {}
	return null;
}
async function pingGoogle(key, model) {
	return (await postJson(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
		contents: [{ parts: [{ text: "ok" }] }],
		generationConfig: { maxOutputTokens: 1 }
	})).ok;
}
async function pingOpenAICompatible(p, key, model) {
	const r = await postJson(`${p.urlBase}/chat/completions`, {
		model,
		max_tokens: 1,
		messages: [{
			role: "user",
			content: "ok"
		}]
	}, { bearer: key });
	return r.ok || r.status === 400;
}
async function pingAnthropic(key, model) {
	const r = await postJson("https://api.anthropic.com/v1/messages", {
		model,
		max_tokens: 1,
		messages: [{
			role: "user",
			content: "ok"
		}]
	}, { apiKeyHeader: `x-api-key:${key}` });
	return r.ok || r.status === 400;
}
var cacheModelos = /* @__PURE__ */ new Map();
async function modelosRemotos(p, key) {
	const ck = p.id + ":" + key.slice(0, 8);
	if (cacheModelos.has(ck)) return cacheModelos.get(ck);
	let nombres = [];
	try {
		if (p.id === "google") {
			const d = await getJson(`${p.urlBase}/models?key=${encodeURIComponent(key)}`);
			if (d) nombres = (d.models || []).map((m) => String(m.name || "").replace("models/", "")).filter((n) => /gemini.*\d/.test(n) && !/\d{3,}/.test(n.split("-").pop() || ""));
		} else if (p.id !== "anthropic") {
			const d = await getJson(`${p.urlBase}/models`, { bearer: key });
			if (d) nombres = (d.data || []).map((m) => m.id).filter(Boolean);
		}
	} catch {}
	cacheModelos.set(ck, nombres);
	return nombres;
}
function prioridadModelo(n) {
	const x = String(n).toLowerCase();
	let p = 50;
	if (x.includes("pro")) p -= 20;
	if (x.includes("flash")) p -= 5;
	if (x.includes("ultra")) p -= 25;
	const v = x.match(/(\d+)\.(\d+)/);
	if (v) p -= Number(v[1]) * 10 + Number(v[2]);
	if (/-latest$/.test(x)) p -= 3;
	if (x.includes("preview") || x.includes("exp")) p += 15;
	return p;
}
async function candidatosPara(p, key) {
	const remotos = (await modelosRemotos(p, key)).filter((n) => {
		const l = n.toLowerCase();
		return !(l.includes("embed") || l.includes("tts") || l.includes("vision") || l.includes("image") || l.includes("bison"));
	}).sort((a, b) => prioridadModelo(a) - prioridadModelo(b));
	const set = new Set(remotos);
	for (const m of p.modelos) set.add(m);
	return [...set];
}
async function detectarModelo({ proveedor, apiKey }) {
	const p = proveedorDe(proveedor);
	const key = String(apiKey || "").trim();
	if (!key) return {
		ok: false,
		error: "Sin clave"
	};
	const candidatos = await candidatosPara(p, key);
	for (const model of candidatos) try {
		if (p.id === "google" ? await pingGoogle(key, model) : p.id === "anthropic" ? await pingAnthropic(key, model) : await pingOpenAICompatible(p, key, model)) return {
			ok: true,
			modelo: model,
			candidatos: candidatos.length
		};
	} catch {}
	return {
		ok: false,
		error: "Ningún modelo disponible",
		candidatos: candidatos.length
	};
}
async function probarClaveIA({ proveedor = "google", apiKey = "", modelo = null }) {
	const p = proveedorDe(proveedor);
	const key = String(apiKey || "").trim();
	if (!key) return {
		ok: false,
		mensaje: "Escribe la clave primero."
	};
	if (modelo) try {
		return (p.id === "google" ? await pingGoogle(key, modelo) : p.id === "anthropic" ? await pingAnthropic(key, modelo) : await pingOpenAICompatible(p, key, modelo)) ? {
			ok: true,
			mensaje: `✅ Clave correcta. Usaremos ${modelo}.`,
			modelo
		} : {
			ok: false,
			mensaje: `❌ La clave no funciona con ${modelo}.`
		};
	} catch (e) {
		return {
			ok: false,
			mensaje: `❌ Sin conexión con ${p.nombre}: ${String(e?.message || e).slice(0, 90)}.`
		};
	}
	const det = await detectarModelo({
		proveedor,
		apiKey: key
	});
	if (det.ok) return {
		ok: true,
		mensaje: `✅ Clave correcta. Usaremos ${det.modelo} (el mejor disponible en tu cuenta).`,
		modelo: det.modelo
	};
	try {
		const r = p.id === "google" ? await getJson(`${p.urlBase}/models?key=${encodeURIComponent(key)}`) : p.id === "anthropic" ? { status: 200 } : await getJson(`${p.urlBase}/models`, { bearer: key });
		if (r && r.status === 401) return {
			ok: false,
			mensaje: `❌ ${p.nombre} rechaza la clave.`
		};
	} catch {}
	return {
		ok: false,
		mensaje: `❌ No se pudo validar la clave de ${p.nombre}.`
	};
}
var ADULTO = [
	"pornografía",
	"pornografico",
	"pornográfico",
	"porno",
	"sexo explícito",
	"contenido para adultos",
	"erótica explícita",
	"desnudez explícita",
	"hentai"
];
var MADURO = [
	"violencia extrema",
	"gore",
	"tortura",
	"terror gráfico",
	"suicidio",
	"autolesión",
	"abuso sexual",
	"asesinato en detalle"
];
var ILEGAL = [
	{ re: /\bpedof[li]\w*/i },
	{ re: /\bzoofilia\b/i },
	{ re: /\bchild\s*porn\w*\b|\bcp\s+infantil\b/i },
	{ re: /\bsnuff\b/i },
	{ re: /\bmenores?\s+desnud|\bmenores?\s+teniendo\s+sexo/i }
];
var MALWARE_INSTR = [
	/cómo\s+(crear|hacer|construir)\s+(un\s+)?(ransomware|keylogger|virus)/i,
	/instrucciones\s+(de\s+)?malware/i,
	/steal\s+credentials|credit\s*card\s+numbers/i
];
var SOSPECHOSO = [
	"gana dinero fácil",
	"hazte rico",
	"esquema ponzi",
	"préstamo inmediato",
	"cura milagrosa"
];
var contienePalabra = (texto, termino) => {
	const esc = termino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`(^|[^a-záéíóúñ])${esc}([^a-záéíóúñ]|$)`, "i").test(texto);
};
function moderarLocal({ titulo = "", descripcion = "", muestra = "" } = {}) {
	const texto = `${titulo}\n${descripcion}\n${muestra}`;
	const flags = [];
	const etiquetas = /* @__PURE__ */ new Set();
	for (const { re } of ILEGAL) if (re.test(texto)) flags.push(`ilegal:${re.source.slice(0, 24)}`);
	for (const re of MALWARE_INSTR) if (re.test(texto)) flags.push("ilegal:malware");
	for (const t of ADULTO) if (contienePalabra(texto, t)) flags.push(`adulto:${t}`);
	for (const t of MADURO) if (contienePalabra(texto, t)) flags.push(`maduro:${t}`);
	for (const t of SOSPECHOSO) if (texto.toLowerCase().includes(t)) flags.push(`sospechoso:${t}`);
	const ilegales = flags.filter((f) => f.startsWith("ilegal:"));
	const aprobado = ilegales.length === 0;
	let rating = "general";
	if (flags.some((f) => f.startsWith("adulto:"))) rating = "adulto";
	else if (flags.some((f) => f.startsWith("maduro:"))) rating = "maduro";
	else if (flags.some((f) => f.startsWith("sospechoso:"))) rating = "maduro";
	const t = texto;
	if (/(historias de amor|romance|beso|amor)/.test(t)) etiquetas.add("romance");
	if (/(miedo|fantasma|terror|horror)/.test(t)) etiquetas.add("terror");
	if (/(ciencia|física|biología|universo|experimento)/.test(t)) etiquetas.add("ciencia");
	if (/(aprender|guía|tutorial|cómo)/.test(t)) etiquetas.add("educativo");
	if (/(espada|reino|magia|dragón|fantasía)/.test(t)) etiquetas.add("fantasía");
	if (/(futuro|nave|marte|robots|inteligencia artificial)/.test(t)) etiquetas.add("ciencia ficción");
	if (/(crimen|detective|misterio|policía)/.test(t)) etiquetas.add("misterio");
	if (/(recetas|cocina|cocinar|plato)/.test(t)) etiquetas.add("cocina");
	if (/(ejercicio|salud|entrenamiento|dieta)/.test(t)) etiquetas.add("salud");
	const resumen = aprobado ? `Clasificado como «${rating}»${etiquetas.size ? " · etiquetas: " + [...etiquetas].join(", ") : ""}.` : `Contenido ilegal detectado: ${ilegales.map((f) => f.split(":")[1]).join(", ")}. No se puede publicar.`;
	return {
		approved: aprobado,
		aprobado,
		rating,
		etiquetas: [...etiquetas],
		flags,
		nivel: "local",
		summary: resumen,
		resumen,
		motivo: aprobado ? "" : ilegales.join(", "),
		sello: aprobado ? `approved:local:${rating}:0.85` : `rejected:${ilegales[0]}`
	};
}
var PROMPT = [
	"Eres el moderador de LumenReader, una biblioteca abierta de libros.",
	"Clasifica el contenido y devuelve SOLO JSON (sin markdown):",
	"{\"aprobado\": bool, \"rating\": \"general\"|\"maduro\"|\"adulto\", \"etiquetas\": string[],",
	" \"riesgo\": \"bajo\"|\"medio\"|\"alto\", \"resumen\": string, \"motivo_rechazo\": string}",
	"",
	"Reglas:",
	"- aprobado=false SOLO si hay contenido sexual con menores, instrucciones de malware, o material claramente ilegal.",
	"- rating=\"adulto\" si hay contenido sexual explícito (se oculta por defecto pero se permite publicar).",
	"- rating=\"maduro\" si hay violencia fuerte, terror gráfico o temas fuertes.",
	"- NO rechaces por política, religión, opiniones ni erotismo leve.",
	"- etiquetas: 1-4 palabras clave del tema."
].join("\n");
async function moderarIA({ titulo, descripcion, muestra, apiKey = null, proveedor = null, modelo = null }) {
	const cfg = await configIA();
	const p = proveedorDe(proveedor || cfg.proveedor);
	const key = apiKey || cfg.apiKey;
	if (!key) return {
		ok: false,
		error: "sin_clave"
	};
	let model = modelo || cfg.modelo || "";
	if (!model || cfg.modelo && !p.modelos.includes(cfg.modelo)) {
		const det = await detectarModelo({
			proveedor: p.id,
			apiKey: key
		});
		if (det.ok) {
			model = det.modelo;
			await guardarConfigIA({
				...cfg,
				modelo: model
			});
		} else model = p.modeloDefecto;
	}
	const prompt = PROMPT + "\n\nTÍTULO: " + String(titulo) + "\nDESCRIPCIÓN: " + String(descripcion) + "\nMUESTRA: " + String(muestra || "").slice(0, 700);
	try {
		if (p.id === "google") {
			const r = await postJson(`${p.urlBase}/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					responseMimeType: "application/json",
					temperature: .2,
					maxOutputTokens: 600
				}
			});
			if (!r.ok) return {
				ok: false,
				error: extraeError(r)
			};
			return parseRespuestaIA(r.data?.candidates?.[0]?.content?.parts?.map((x) => x.text || "").join("") || "", "byok:" + p.id);
		}
		if (p.id === "anthropic") {
			const r = await postJson(`${p.urlBase}/messages`, {
				model,
				max_tokens: 600,
				messages: [{
					role: "user",
					content: prompt
				}]
			}, { apiKeyHeader: `x-api-key:${key}` });
			if (!r.ok) return {
				ok: false,
				error: extraeError(r)
			};
			return parseRespuestaIA(r.data?.content?.map((b) => b.text || "").join("") || "", "byok:" + p.id);
		}
		const r = await postJson(`${p.urlBase}/chat/completions`, {
			model,
			max_tokens: 600,
			temperature: .2,
			messages: [{
				role: "user",
				content: prompt
			}]
		}, { bearer: key });
		if (!r.ok) return {
			ok: false,
			error: extraeError(r)
		};
		return parseRespuestaIA(r.data?.choices?.[0]?.message?.content || "", "byok:" + p.id);
	} catch (e) {
		return {
			ok: false,
			error: String(e?.message || e).slice(0, 120)
		};
	}
}
function extraeError(r) {
	const d = r?.data;
	const msg = d?.error?.message || d?.message || "";
	return `HTTP ${r?.status || 0}${msg ? ": " + String(msg).slice(0, 100) : ""}`;
}
function parseRespuestaIA(texto, nivel) {
	try {
		const limpio = String(texto).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
		const parsed = JSON.parse(limpio);
		const rating = [
			"general",
			"maduro",
			"adulto"
		].includes(parsed.rating) ? parsed.rating : "general";
		return {
			ok: true,
			approved: parsed.aprobado !== false,
			aprobado: parsed.aprobado !== false,
			rating,
			etiquetas: Array.isArray(parsed.etiquetas) ? parsed.etiquetas.slice(0, 6) : [],
			riesgo: parsed.riesgo || "bajo",
			summary: String(parsed.resumen || ""),
			resumen: String(parsed.resumen || ""),
			motivo: String(parsed.motivo_rechazo || ""),
			nivel
		};
	} catch {
		return {
			ok: false,
			error: "respuesta_no_json"
		};
	}
}
async function moderarParaPublicar({ titulo, descripcion, muestra }) {
	const local = moderarLocal({
		titulo,
		descripcion,
		muestra
	});
	if (!local.approved) return {
		...local,
		sello: local.sello
	};
	const cfg = await configIA();
	if (cfg.apiKey) {
		const ia = await moderarIA({
			titulo,
			descripcion,
			muestra
		});
		if (ia.ok) {
			const motivoBajo = String(ia.motivo || "").toLowerCase();
			const ilegalEnMotivo = /menor|pedof|zoofilia|malware|snuff|ilegal/.test(motivoBajo);
			if (ia.approved === false && ilegalEnMotivo) return {
				...ia,
				approved: false,
				aprobado: false,
				sello: `rejected:byok:${ia.motivo.slice(0, 60)}`
			};
			let rating = ia.rating || local.rating;
			if (ia.approved === false && !ilegalEnMotivo && rating === "general") rating = "maduro";
			const etiquetas = [.../* @__PURE__ */ new Set([...local.etiquetas || [], ...ia.etiquetas || []])];
			return {
				approved: true,
				aprobado: true,
				rating,
				etiquetas,
				riesgo: ia.riesgo || (ia.approved === false ? "medio" : "bajo"),
				nivel: ia.nivel,
				summary: `Moderado con ${proveedorDe(cfg.proveedor).nombre}: ${ia.summary || ""}` + (ia.approved === false ? " (clasificado y permitido: la app etiqueta, no censura)" : ""),
				resumen: `Moderado con ${proveedorDe(cfg.proveedor).nombre}: ${ia.summary || ""}`,
				sello: `approved:byok:${rating}:${cfg.proveedor}:0.9`
			};
		}
		return {
			...local,
			avisoIA: ia.error
		};
	}
	return { ...local };
}
//#endregion
//#region src/components/NostrAjustes.jsx
var import_jsx_runtime = require_jsx_runtime();
/** Abre un enlace en el navegador interno de la app (o en el del sistema). */
function abrirEnlace(url) {
	try {
		const nav = typeof window !== "undefined" ? window.AndroidNav : null;
		if (nav?.open) {
			nav.open(url);
			return;
		}
	} catch {}
	try {
		window.open(url, "_blank");
	} catch {}
}
/** Copia texto al portapapeles con aviso. */
function copiarTexto(texto, toast) {
	try {
		if (navigator.clipboard?.writeText) navigator.clipboard.writeText(texto).then(() => toast?.("Copiado al portapapeles"), () => toast?.("No se pudo copiar"));
		else {
			const ta = document.createElement("textarea");
			ta.value = texto;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
			toast?.("Copiado al portapapeles");
		}
	} catch (e) {
		toast?.("No se pudo copiar: " + (e?.message || e));
	}
}
var URLS_CLAVE = {
	google: "https://aistudio.google.com/apikey",
	openai: "https://platform.openai.com/api-keys",
	anthropic: "https://console.anthropic.com/settings/keys",
	groq: "https://console.groq.com/keys",
	mistral: "https://console.mistral.ai/api-keys/"
};
var COMO_CREAR = {
	google: "Inicia sesión con tu Google → «Create API key» → copia la clave (empieza por AIza…).",
	openai: "Inicia sesión → «Create new secret key» → cópiala (empieza por sk-…). Puede pedir saldo; el mini modelo es muy barato.",
	anthropic: "Inicia sesión → «Create key» → cópiala (empieza por sk-ant-…).",
	groq: "Crea cuenta gratis → «Create API key» → cópiala (empieza por gsk_…). Tiene capa gratuita.",
	mistral: "Crea cuenta gratis → «API Keys» → «Create new key» → cópiala."
};
function NostrAjustes({ onSalir, toast }) {
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [relays, setRelays] = (0, import_react.useState)([]);
	const [nuevoRelay, setNuevoRelay] = (0, import_react.useState)("");
	const [buscandoRelays, setBuscandoRelays] = (0, import_react.useState)(false);
	const [progresoRelays, setProgresoRelays] = (0, import_react.useState)("");
	const [verNsec, setVerNsec] = (0, import_react.useState)(false);
	const [confirmarBorrado, setConfirmarBorrado] = (0, import_react.useState)(false);
	const [proveedor, setProveedor] = (0, import_react.useState)("google");
	const [modelo, setModelo] = (0, import_react.useState)("");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [probando, setProbando] = (0, import_react.useState)(false);
	const [resultadoClave, setResultadoClave] = (0, import_react.useState)(null);
	const [mostrarKey, setMostrarKey] = (0, import_react.useState)(false);
	const [glosarioAbierto, setGlosarioAbierto] = (0, import_react.useState)(false);
	usarPantallaAtras(() => onSalir?.());
	(0, import_react.useEffect)(() => {
		(async () => {
			const [id, rs, cfg] = await Promise.all([
				identidadGuardada(),
				relaysGuardados(),
				configIA()
			]);
			setIdentidad(id);
			setRelays(rs);
			setProveedor(cfg.proveedor || "google");
			setModelo(cfg.modelo || "");
			setApiKey(cfg.apiKey || "");
		})();
	}, []);
	const cambiarProveedor = (pid) => {
		setProveedor(pid);
		setModelo("");
		setResultadoClave(null);
	};
	const probarKey = async () => {
		haptic.tap();
		setProbando(true);
		setResultadoClave(null);
		const r = await probarClaveIA({
			proveedor,
			apiKey
		});
		setResultadoClave(r);
		if (r.ok) {
			await guardarConfigIA({
				proveedor,
				apiKey: apiKey.trim(),
				modelo: r.modelo || ""
			});
			setModelo(r.modelo || "");
		}
		setProbando(false);
		toast(r.ok ? "Clave válida y guardada" : "");
	};
	const guardarKey = async () => {
		await guardarConfigIA({
			proveedor,
			apiKey: apiKey.trim(),
			modelo
		});
		toast(apiKey.trim() ? "Configuración de IA guardada" : "Clave eliminada");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-scrim",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pb-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-back",
					onClick: () => onSalir?.(),
					"aria-label": "Volver",
					children: "‹"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "🛠 Biblioteca Global" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Lumen Storage · identidad · relays · tu IA" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "na-cuerpo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "na-seccion na-guia-btn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							style: { width: "100%" },
							onClick: () => {
								setGlosarioAbierto(true);
								haptic.tap();
							},
							children: "📖 Guía para novatos: ¿qué es todo esto?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "na-seccion",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🆔 Identidad (tus claves)" }), identidad ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "na-identidad",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-fila",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clave pública (npub)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: npubCorto(identidad.npub, 16) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn mini",
											onClick: () => copiarTexto(identidad.npub, toast),
											children: "Copiar"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-fila",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clave privada (nsec)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: verNsec ? identidad.nsec : "nsec1••••••••••••••" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn mini",
											onClick: () => setVerNsec(!verNsec),
											children: verNsec ? "Ocultar" : "Ver"
										})
									]
								}),
								verNsec && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "na-aviso",
									children: "⚠️ Esta clave firma tus libros y reportes. No la compartas con nadie. Si la pierdes, no hay recuperación (así funciona sin dueño)."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-botones",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn",
										onClick: async () => {
											if (!confirm("Se generará una identidad nueva. La anterior dejará de firmar tus libros.")) return;
											const id = generarIdentidad();
											await guardarIdentidad(id);
											setIdentidad(id);
											toast("Identidad creada");
										},
										children: "Generar otra"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn danger",
										onClick: async () => {
											if (!confirm("¿Seguro? Perderás acceso a lo que firmaste con esta clave.")) return;
											await borrarIdentidad();
											setIdentidad(null);
											toast("Identidad borrada");
										},
										children: "Borrar"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "na-sin",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: { color: "var(--fg-dim)" },
								children: "Aún no tienes identidad. Se genera en tu teléfono: no pedimos correo, ni cuenta, ni servidor."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: async () => {
									const id = generarIdentidad();
									await guardarIdentidad(id);
									setIdentidad(id);
									toast("Identidad creada: " + npubCorto(id.npub));
								},
								children: "Crear mi identidad"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "na-seccion",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "📡 Relays del catálogo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "row-sub",
								children: [
									"Los ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "relays" }),
									" son como ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "tablones de anuncios públicos y gratuitos" }),
									": tu libro se publica en varios a la vez para que nadie pueda borrarlo. Si uno se cae, los demás siguen funcionando."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "na-relays",
								children: relays.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "na-relay",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "na-relay-dot" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: r }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "na-relay-x",
											onClick: async () => {
												const lista = relays.filter((x) => x !== r);
												setRelays(lista);
												await guardarRelays(lista);
												toast("Relay quitado");
											},
											disabled: relays.length <= 1,
											"aria-label": "Quitar relay",
											children: "✕"
										})
									]
								}, r))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "na-relay-nuevo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: nuevoRelay,
									onChange: (e) => setNuevoRelay(e.target.value),
									placeholder: "wss://tu-relay.com"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									onClick: async () => {
										const r = nuevoRelay.trim().toLowerCase();
										if (!/^wss?:\/\/.+/.test(r)) {
											toast("Escribe un relay válido: wss://…");
											return;
										}
										if (relays.includes(r)) {
											toast("Ese relay ya está");
											return;
										}
										const lista = [...relays, r].slice(0, 8);
										setRelays(lista);
										await guardarRelays(lista);
										setNuevoRelay("");
										toast("Relay añadido");
									},
									children: "Añadir"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "na-enlaces",
								style: { marginTop: 8 },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn mini",
									disabled: buscandoRelays,
									onClick: async () => {
										setBuscandoRelays(true);
										setProgresoRelays("Buscando relays vivos…");
										try {
											const r = await descubrirRelays({ onProgreso: (h, t, v) => setProgresoRelays(`Probando ${h}/${t} · ${v} vivos…`) });
											setRelays(await relaysGuardados());
											setProgresoRelays("");
											toast(r.añadidos.length ? `Añadí ${r.añadidos.length} relay(s) vivos de ${r.probados} probados` : `No encontré relays nuevos que respondan (probé ${r.probados}).`);
										} catch (e) {
											setProgresoRelays("");
											toast("Error: " + (e?.message || e));
										} finally {
											setBuscandoRelays(false);
										}
									},
									children: buscandoRelays ? "⏳ Buscando…" : "🧭 Buscar relays automáticamente"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn mini",
									onClick: async () => {
										setRelays(RELAYS_DEFECTO);
										await guardarRelays(RELAYS_DEFECTO);
										toast("Relays por defecto restaurados");
									},
									children: "Restaurar por defecto"
								})]
							}),
							progresoRelays && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								style: { color: "var(--fg-mute)" },
								children: progresoRelays
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "na-seccion",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "🤖 Tu IA para moderar (BYOK)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "row-sub",
								children: [
									"Elige qué IA usas para clasificar tus libros (etiquetas, contenido adulto, etc.). ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Es opcional" }),
									": sin clave se usa la clasificación local del móvil, que también funciona. Tu clave solo vive en tu teléfono."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "pb-campo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proveedor de IA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: proveedor,
									onChange: (e) => cambiarProveedor(e.target.value),
									children: PROVEEDORES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											p.icono,
											" ",
											p.nombre,
											" — ",
											p.desc
										]
									}, p.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "row-sub",
								style: {
									marginTop: -2,
									marginBottom: 8
								},
								children: [
									"✨ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sólo pega tu clave." }),
									" La app detecta sola el mejor modelo disponible en tu cuenta (Gemini 3.1 Pro, 3.5 Flash, 3 Flash, GPT-5, Claude Sonnet 4...).",
									modelo && apiKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										" Modelo elegido: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: modelo }),
										"."
									] }) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "na-pasos",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									"Cómo crear tu clave en ",
									proveedorDe(proveedor).nombre,
									":"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Toca ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "«Abrir página de claves»" }),
										" aquí abajo."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: COMO_CREAR[proveedor] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Vuelve aquí, pega la clave y toca ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "«Probar y guardar»" }),
										"."
									] })
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "na-enlaces",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									onClick: () => abrirEnlace(URLS_CLAVE[proveedor] || URLS_CLAVE.google),
									children: "🔗 Abrir página de claves"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn",
									onClick: () => copiarTexto(URLS_CLAVE[proveedor] || URLS_CLAVE.google, toast),
									children: "📋 Copiar enlace"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "na-relay-nuevo",
								style: { marginTop: 10 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: mostrarKey ? "text" : "password",
										value: apiKey,
										onChange: (e) => {
											setApiKey(e.target.value);
											setResultadoClave(null);
										},
										placeholder: "Pega tu clave aquí…"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn mini",
										onClick: () => setMostrarKey(!mostrarKey),
										style: { flex: "none" },
										children: mostrarKey ? "🙈" : "👁"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn primary",
										onClick: probarKey,
										disabled: probando,
										children: probando ? "Probando…" : "Probar y guardar"
									})
								]
							}),
							resultadoClave && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pb-moder " + (resultadoClave.ok ? "ok" : "no"),
								style: { marginTop: 10 },
								children: resultadoClave.mensaje
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn mini",
								onClick: guardarKey,
								style: { marginTop: 8 },
								disabled: probando,
								children: "Guardar sin probar"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "na-seccion na-info",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "ℹ️ Cómo funciona esto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "📚 Tu libro se convierte a LumenBook en tu móvil y se comparte por torrent (tu teléfono siembra)." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "✍️ El evento Kind 30023 se firma con tu clave y se envía a los relays." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "📖 Los lectores ven el catálogo consultando los mismos relays, sin servidor central." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🚩 Un libro solo se oculta tras 3 reportes de personas distintas (revisión comunitaria)." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🔞 El contenido adulto se etiqueta y se oculta por defecto, pero siempre queda en la red." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "💸 Páginas impares = anuncio de la app · pares = tu anuncio (50/50, sin intermediarios)." })
						] })]
					})
				]
			})]
		}), glosarioAbierto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glosario, { onCerrar: () => setGlosarioAbierto(false) })]
	});
}
var TERMINOS = [
	{
		icono: "📡",
		termino: "Relay",
		que: "Un tablón público y gratuito de Internet donde se publican los libros.",
		ejemplo: "wss://relay.damus.io es un relay como un corcho de anuncios: cualquiera puede leer lo que hay colgado."
	},
	{
		icono: "🗒️",
		termino: "Evento / Kind",
		que: "Un mensaje firmado dentro de Nostr. El «kind» dice de qué tipo es (30023 = libro, 30024 = reporte).",
		ejemplo: "Tu libro es un evento Kind 30023 firmado con tu clave: nadie puede fingir que es tuyo."
	},
	{
		icono: "🔑",
		termino: "nsec y npub",
		que: "Tu identidad en la red. npub es tu «carné público» (se puede compartir); nsec es tu «llave secreta» (nunca se comparte).",
		ejemplo: "Firmar con tu nsec es como firmar de tu puño y letra."
	},
	{
		icono: "🧲",
		termino: "Torrent / magnet",
		que: "Una forma de compartir archivos entre teléfonos sin pasar por ningún servidor.",
		ejemplo: "Cuando publicas, tu móvil se convierte en el primer «seeder»: otros lectores se bajan el libro directo de ti."
	},
	{
		icono: "🌱",
		termino: "Seeder",
		que: "Un teléfono que tiene el libro completo y lo comparte con otros.",
		ejemplo: "Cuantos más lectores descarguen tu libro, más seeders hay y más difícil es que desaparezca."
	},
	{
		icono: "🌐",
		termino: "DHT",
		que: "La «guía telefónica» de los torrents: sin servidor central, los teléfonos se encuentran entre sí.",
		ejemplo: "El magnet lleva un «hash» y el DHT ayuda a encontrar quién tiene ese libro."
	},
	{
		icono: "🗜️",
		termino: "CID / IPFS",
		que: "Otro sistema de archivos descentralizado. Un CID es como la huella digital del archivo.",
		ejemplo: "Si un libro tiene CID, se puede leer por capítulos desde gateways públicos."
	},
	{
		icono: "📚",
		termino: "LumenBook (.lumen)",
		que: "El formato interno de LumenReader: un ZIP con los capítulos en XHTML.",
		ejemplo: "Todo libro publicado se convierte a .lumen en tu propio móvil."
	},
	{
		icono: "🔒",
		termino: "Escrow",
		que: "Dinero bloqueado de una campaña publicitaria que se libera solo con pruebas.",
		ejemplo: "El anunciante deja 100 USDC bloqueados: ni él ni nadie puede tocarlos hasta que haya impresiones verificadas."
	},
	{
		icono: "🧾",
		termino: "PoAV",
		que: "Prueba de que un anuncio se vio de verdad (Proof of Ad View).",
		ejemplo: "Tu teléfono firma cada impresión: duración, página, clave efímera… y cada 10 se agrupan en una raíz Merkle."
	},
	{
		icono: "⚡",
		termino: "Sats / Lightning",
		que: "Sats = satoshis, la unidad mínima de Bitcoin (100 millones por BTC). Lightning = red de pagos instantáneos y casi gratis.",
		ejemplo: "1 USD ≈ 100.000 sats (aprox.). Los micropagos de anuncios se pagan en sats."
	},
	{
		icono: "🤖",
		termino: "BYOK",
		que: "Bring Your Own Key: tú pones tu propia clave de IA (Gemini, ChatGPT…) para moderar.",
		ejemplo: "Así nadie paga servidores de IA por ti: usas TU cuota gratuita."
	},
	{
		icono: "📢",
		termino: "CPM",
		que: "Coste por mil impresiones: cuánto paga el anunciante por cada 1.000 anuncios vistos.",
		ejemplo: "CPM 0.50 = el anunciante paga $0,50 por cada 1.000 impresiones válidas."
	},
	{
		icono: "🛡️",
		termino: "Moderación",
		que: "Revisión del contenido antes de publicar: etiqueta (general/maduro/adulto) y detecta ilegal.",
		ejemplo: "El contenido adulto se ETIQUETA y se oculta por defecto, pero no se borra."
	}
];
function Glosario({ onCerrar }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-scrim",
		style: { zIndex: 99 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pb-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "cg-back",
					onClick: onCerrar,
					"aria-label": "Cerrar",
					children: "✕"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cg-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "📖 Guía para novatos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Todos los términos explicados simple" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "na-cuerpo",
				children: TERMINOS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glosario-item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glosario-icono",
						children: t.icono
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glosario-txt",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.termino }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.que }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t.ejemplo })
						]
					})]
				}, t.termino))
			})]
		})
	});
}
//#endregion
export { probarClaveIA as a, abrirEnlace, copiarTexto, NostrAjustes as default, moderarParaPublicar as i, configIA as n, proveedorDe as o, guardarConfigIA as r, PROVEEDORES as t };
