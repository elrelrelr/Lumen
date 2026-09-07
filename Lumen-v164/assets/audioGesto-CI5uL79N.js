const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-DOrzQ79O.js","./rolldown-runtime-D1cXj70v.js","./react-1WJTggxS.js","./db-Ii3ipPL7.js","./pdf-C3eksu0f.js","./originals-D2DFW8Gx.js","./streak-CnTdupFR.js","./index-DQUWFWNX.css"])))=>i.map(i=>d[i]);
import { v as getSettings } from "./db-Ii3ipPL7.js";
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
//#region src/lib/audioGesto.js
var sonando = {
	voz: false,
	musica: false
};
var pausadoPorGesto = false;
var encendido = false;
var modoAviso = "fuera";
var MODOS_AVISO = [
	["siempre", "Siempre que haya audio"],
	["fuera", "Sólo al salir de la app"],
	["nunca", "Nunca (si el sistema lo permite)"]
];
var NIVELES_SENSIBILIDAD = [
	[
		"0",
		"Muy suave",
		"Basta con mover el teléfono"
	],
	[
		"1",
		"Suave",
		"Un movimiento corto"
	],
	[
		"2",
		"Normal",
		"Una sacudida clara"
	],
	[
		"3",
		"Fuerte",
		"Hay que sacudirlo con ganas"
	],
	[
		"4",
		"Muy fuerte",
		"Tres sacudidas seguidas"
	]
];
var sensibilidad = 2;
function fijarSensibilidad(n) {
	sensibilidad = Math.max(0, Math.min(4, Number(n) || 0));
	try {
		window.AndroidBg?.gestoSensibilidad?.(sensibilidad);
	} catch {}
	return sensibilidad;
}
var sensibilidad_ = () => sensibilidad;
function fijarModoAviso(m) {
	modoAviso = MODOS_AVISO.some(([id]) => id === m) ? m : "fuera";
	aplicar();
}
var modoAviso_ = () => modoAviso;
getSettings().then((s) => {
	if (s?.avisoGesto) modoAviso = s.avisoGesto;
	if (typeof s?.gestoSens === "number") fijarSensibilidad(s.gestoSens);
	aplicar();
}).catch(() => {});
function puente() {
	return typeof window !== "undefined" ? window.AndroidBg : null;
}
function aplicar() {
	const hayAudio = sonando.voz || sonando.musica || pausadoPorGesto;
	const b = puente();
	if (!b) return;
	try {
		if (hayAudio && !encendido) {
			if (typeof b.gestoModo === "function") b.gestoModo(modoAviso);
			if (typeof b.gestoOn === "function") b.gestoOn();
			encendido = true;
		} else if (!hayAudio && encendido) {
			if (typeof b.gestoOff === "function") b.gestoOff();
			encendido = false;
		} else if (hayAudio && encendido && typeof b.gestoModo === "function") b.gestoModo(modoAviso);
	} catch (e) {
		console.warn("[audioGesto]", e?.message || e);
	}
}
/**
* Marca un canal como sonando o callado.
* IMPORTANTE: la voz en PAUSA cuenta como sonando, porque el gesto es
* justamente lo que permite reanudarla sin tocar la pantalla.
*/
function marcarAudio(canal, activo) {
	if (!(canal in sonando)) return;
	if (activo) pausadoPorGesto = false;
	if (sonando[canal] === !!activo) return;
	sonando[canal] = !!activo;
	aplicar();
}
var hayAudio = () => sonando.voz || sonando.musica;
var gestoEncendido = () => encendido;
if (typeof window !== "undefined") window.__lumenAudioGesto = {
	marcarAudio,
	hayAudio,
	gestoEncendido,
	fijarModoAviso,
	fijarSensibilidad,
	sensibilidad: () => sensibilidad,
	NIVELES_SENSIBILIDAD,
	modoAviso: () => modoAviso,
	estado: () => ({ ...sonando }),
	MODOS_AVISO
};
var escenaPausada = null;
async function pausarTodo() {
	let algo = false;
	pausadoPorGesto = true;
	try {
		window.AndroidBg?.audioPausado?.(true);
	} catch {}
	try {
		const amb = await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.l), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url);
		if (amb.isPlaying?.()) {
			escenaPausada = amb.currentScene?.() || "lluvia";
			amb.pause?.();
			algo = true;
		}
	} catch (e) {
		console.warn("[gestoAudio] música", e?.message || e);
	}
	try {
		const sp = window.__lumenSpeaker;
		if (sp?.playing && !sp.paused) {
			sp.pause();
			algo = true;
		}
	} catch (e) {
		console.warn("[gestoAudio] voz", e?.message || e);
	}
	return algo;
}
async function reanudarTodo() {
	let algo = false;
	pausadoPorGesto = false;
	try {
		window.AndroidBg?.audioPausado?.(false);
	} catch {}
	try {
		if (escenaPausada) {
			const amb = await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.l), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url);
			amb.resume?.();
			await new Promise((r) => setTimeout(r, 60));
			if (!amb.isPlaying?.()) {
				const vol = window.__lumenVolumenMusica ?? 1;
				await amb.play(escenaPausada, vol);
			}
			escenaPausada = null;
			algo = true;
		}
	} catch (e) {
		console.warn("[gestoAudio] música", e?.message || e);
	}
	try {
		const sp = window.__lumenSpeaker;
		if (sp?.paused) {
			sp.resume();
			algo = true;
		}
	} catch (e) {
		console.warn("[gestoAudio] voz", e?.message || e);
	}
	return algo;
}
/** Lo llama Java: 'alternar' | 'pausar' | 'reanudar'. */
async function gestoAudio(accion = "alternar") {
	try {
		if (accion === "pausar") return await pausarTodo();
		if (accion === "reanudar") return await reanudarTodo();
		if (pausadoPorGesto) return await reanudarTodo();
		const sp = window.__lumenSpeaker;
		let suena = !!(sp?.playing && !sp.paused);
		if (!suena) try {
			suena = !!(await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.l), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url)).isPlaying?.();
		} catch {}
		return suena ? await pausarTodo() : await reanudarTodo();
	} catch (e) {
		console.warn("[gestoAudio]", e?.message || e);
		return false;
	}
}
if (typeof window !== "undefined") {
	window.__lumenGestoAudio = (accion) => {
		gestoAudio(accion);
	};
	window.__lumenAudioGesto = window.__lumenAudioGesto || {};
	window.__lumenAudioGesto.gestoAudio = gestoAudio;
	window.__lumenAudioGesto.hayPausado = () => pausadoPorGesto;
	window.__lumenAudioGesto.escenaPausada = () => escenaPausada;
}
//#endregion
export { MODOS_AVISO, NIVELES_SENSIBILIDAD, fijarModoAviso, fijarSensibilidad, gestoAudio, gestoEncendido, hayAudio, marcarAudio, modoAviso_, sensibilidad_ };
