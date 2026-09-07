import { O as setMeta, h as getMeta } from "./db-Ii3ipPL7.js";
//#region src/lib/donar.js
var DIRECCIONES = [
	{
		id: "ton",
		red: "TON",
		nombre: "USDT · red TON",
		direccion: "UQAmFOJWRYf2IvM1JRoVGW8L-so1gts4tPwpFk5moR6fWo8C",
		color: "#0098EA",
		qr: "qr/ton.svg",
		nota: "Comisiones muy bajas y confirmación rápida."
	},
	{
		id: "eth",
		red: "Ethereum",
		nombre: "USDT · red Ethereum (ERC-20)",
		direccion: "0x55194D95611A284C9c653a0AFE6F266baeb2e672",
		color: "#627EEA",
		qr: "qr/eth.svg",
		nota: "La más extendida, pero con las comisiones más altas."
	},
	{
		id: "tron",
		red: "Tron",
		nombre: "USDT · red Tron (TRC-20)",
		direccion: "TDT48q4Cc76UDsgS4iUjjBpxTQK8twZ4mo",
		color: "#EF0027",
		qr: "qr/tron.svg",
		nota: "La más usada para USDT: rápida y barata."
	},
	{
		id: "sol",
		red: "Solana",
		nombre: "USDT · red Solana",
		direccion: "6AbzNBz64QBFq2uTHvEXg9p5eEmG9XdfvumkRpj46rLW",
		color: "#14F195",
		qr: "qr/sol.svg",
		nota: "Comisiones mínimas y muy rápida."
	}
];
var TEMAS_PREMIUM = [
	{
		id: "aurora",
		nombre: "Aurora",
		icono: "🌌",
		desc: "Violetas y verdes fríos, como una aurora boreal"
	},
	{
		id: "cafe",
		nombre: "Café",
		icono: "☕",
		desc: "Marrones cálidos, para leer de noche sin cansar la vista"
	},
	{
		id: "esmeralda",
		nombre: "Esmeralda",
		icono: "💚",
		desc: "Verde profundo con acentos dorados"
	}
];
var FUENTES_PREMIUM = [
	{
		id: "lectura",
		nombre: "Lectura",
		css: "Georgia, \"Times New Roman\", serif",
		desc: "Serif clásica, la más descansada en textos largos"
	},
	{
		id: "humanista",
		nombre: "Humanista",
		css: "\"Optima\", \"Segoe UI\", \"Trebuchet MS\", sans-serif",
		desc: "Sin remates pero con carácter, muy legible"
	},
	{
		id: "maquina",
		nombre: "Máquina",
		css: "\"Courier New\", ui-monospace, monospace",
		desc: "De máquina de escribir, para concentrarse"
	}
];
var CLAVE = "apoyo";
var MAX_AL_MES = 2;
var DIAS_GRACIA = 7;
var DIAS_ENTRE = 12;
async function estadoApoyo() {
	const m = await getMeta(CLAVE, null);
	return {
		copiado: !!m?.copiado,
		premium: !!m?.premium,
		vistas: m?.vistas || [],
		primerUso: m?.primerUso || 0,
		nuncaMas: !!m?.nuncaMas
	};
}
/** Marca cuándo se usó la app por primera vez (para el periodo de gracia). */
async function registrarPrimerUso() {
	const e = await estadoApoyo();
	if (e.primerUso) return e.primerUso;
	const ahora = Date.now();
	await setMeta({
		id: CLAVE,
		...e,
		primerUso: ahora
	});
	return ahora;
}
/**
* ¿Toca enseñar la historia de apoyo?
*
* Como mucho DOS veces al mes, nunca en la primera semana y nunca dos veces
* en menos de doce días. Si el usuario ya donó (copió) o dijo que no quiere
* verla más, no se muestra nunca.
*/
async function tocaMostrar() {
	try {
		const e = await estadoApoyo();
		if (e.nuncaMas) return false;
		const ahora = Date.now();
		const dia = 864e5;
		if (!e.primerUso) {
			await registrarPrimerUso();
			return false;
		}
		if (ahora - e.primerUso < DIAS_GRACIA * dia) return false;
		const mes = 30 * dia;
		const recientes = (e.vistas || []).filter((t) => ahora - t < mes);
		if (recientes.length >= MAX_AL_MES) return false;
		if (recientes.length && ahora - Math.max(...recientes) < DIAS_ENTRE * dia) return false;
		return true;
	} catch {
		return false;
	}
}
async function marcarMostrada() {
	const e = await estadoApoyo();
	const ahora = Date.now();
	const mes = 30 * 864e5;
	const vistas = [...(e.vistas || []).filter((t) => ahora - t < mes), ahora];
	await setMeta({
		id: CLAVE,
		...e,
		vistas
	});
}
async function noMostrarMas() {
	await setMeta({
		id: CLAVE,
		...await estadoApoyo(),
		nuncaMas: true
	});
}
/** Copiar una dirección desbloquea las recompensas. */
async function marcarCopiado(red) {
	await setMeta({
		id: CLAVE,
		...await estadoApoyo(),
		copiado: true,
		premium: true,
		red,
		at: Date.now()
	});
	return true;
}
async function tienePremium() {
	return (await estadoApoyo()).premium;
}
/** Copia al portapapeles, con respaldo para el WebView. */
async function copiarDireccion(texto) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(texto);
			return true;
		}
	} catch {}
	try {
		const ta = document.createElement("textarea");
		ta.value = texto;
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(ta);
		return ok;
	} catch {
		return false;
	}
}
if (typeof window !== "undefined") window.__lumenDonar = {
	DIRECCIONES,
	TEMAS_PREMIUM,
	FUENTES_PREMIUM,
	estadoApoyo,
	tocaMostrar,
	marcarMostrada,
	marcarCopiado,
	tienePremium,
	noMostrarMas,
	registrarPrimerUso,
	copiarDireccion,
	MAX_AL_MES
};
//#endregion
export { DIRECCIONES, FUENTES_PREMIUM, TEMAS_PREMIUM, copiarDireccion, estadoApoyo, marcarCopiado, marcarMostrada, noMostrarMas, registrarPrimerUso, tienePremium, tocaMostrar };
