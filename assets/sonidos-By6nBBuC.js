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
//#region src/lib/sonidos.js
var sonidosOn = true;
var sonidosVol = 1;
getSettings().then((s) => {
	if (s && typeof s.sonidosUi === "boolean") sonidosOn = s.sonidosUi;
	if (s && typeof s.sonidosVol === "number") sonidosVol = s.sonidosVol;
}).catch(() => {});
function fijarSonidos(v) {
	sonidosOn = !!v;
}
/** Ajusta el volumen de los efectos de interfaz (0..2). */
function fijarSonidosVol(v) {
	sonidosVol = Number.isFinite(v) ? v : 1;
	sonidosOn = true;
}
var volumenSonidos = () => sonidosVol;
/** El contexto de audio compartido, o null si no se puede usar. */
async function contexto() {
	try {
		const c = (await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.l), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url)).__ctx?.() || null;
		if (c) return c;
	} catch {}
	try {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return null;
		if (!window.__lumenCtxFx) window.__lumenCtxFx = new AC();
		return window.__lumenCtxFx;
	} catch {
		return null;
	}
}
/**
* Fanfarria corta de logro: arpegio ascendente de cuatro notas.
*
* Do–Mi–Sol de la quinta octava más el Do de la sexta. Es un acorde mayor,
* que es lo que el oído reconoce como «bien hecho». Cada nota entra 90 ms
* después de la anterior y se apaga sola: en total 0,55 s. Corto a propósito
* — un sonido de logro que dura dos segundos acaba molestando al décimo.
*/
async function sonidoLogro() {
	if (!sonidosOn) return false;
	try {
		const c = await contexto();
		if (!c) return false;
		if (c.state === "suspended") await c.resume().catch(() => {});
		let vol = .16;
		try {
			if ((await __vitePreload(() => import("./index-DOrzQ79O.js").then((n) => n.l), __vite__mapDeps([0,1,2,3,4,5,6,7]), import.meta.url)).isPlaying?.()) vol = .1;
			if (window.__lumenSpeaker?.playing) vol = .09;
		} catch {}
		const t0 = c.currentTime + .01;
		const notas = [
			523.25,
			659.25,
			783.99,
			1046.5
		];
		const salida = c.createGain();
		salida.gain.value = vol * (sonidosVol || 1);
		salida.connect(c.destination);
		notas.forEach((f, i) => {
			const t = t0 + i * .09;
			const osc = c.createOscillator();
			osc.type = "triangle";
			osc.frequency.value = f;
			const g = c.createGain();
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(1, t + .012);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .42);
			osc.connect(g).connect(salida);
			osc.start(t);
			osc.stop(t + .45);
			const bri = c.createOscillator();
			bri.type = "sine";
			bri.frequency.value = f * 2;
			const gb = c.createGain();
			gb.gain.setValueAtTime(0, t);
			gb.gain.linearRampToValueAtTime(.28, t + .01);
			gb.gain.exponentialRampToValueAtTime(1e-4, t + .3);
			bri.connect(gb).connect(salida);
			bri.start(t);
			bri.stop(t + .32);
		});
		setTimeout(() => {
			try {
				salida.disconnect();
			} catch {}
		}, 1200);
		return true;
	} catch (e) {
		console.warn("[sonidos] logro", e?.message || e);
		return false;
	}
}
/** Campanita de nivel: dos notas, más discreta que la de logro. */
async function sonidoNivel() {
	if (!sonidosOn) return false;
	try {
		const c = await contexto();
		if (!c) return false;
		if (c.state === "suspended") await c.resume().catch(() => {});
		const t0 = c.currentTime + .01;
		const salida = c.createGain();
		salida.gain.value = .12 * (sonidosVol || 1);
		salida.connect(c.destination);
		[783.99, 1046.5].forEach((f, i) => {
			const t = t0 + i * .11;
			const osc = c.createOscillator();
			osc.type = "triangle";
			osc.frequency.value = f;
			const g = c.createGain();
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(1, t + .01);
			g.gain.exponentialRampToValueAtTime(1e-4, t + .36);
			osc.connect(g).connect(salida);
			osc.start(t);
			osc.stop(t + .4);
		});
		setTimeout(() => {
			try {
				salida.disconnect();
			} catch {}
		}, 1e3);
		return true;
	} catch {
		return false;
	}
}
if (typeof window !== "undefined") window.__lumenSonidos = {
	sonidoLogro,
	sonidoNivel,
	fijarSonidos
};
//#endregion
export { fijarSonidos, fijarSonidosVol, sonidoLogro, sonidoNivel, volumenSonidos };
