import { O as setMeta, h as getMeta, v as getSettings } from "./db-Ii3ipPL7.js";
//#region src/lib/streak.js
var todayKey = (d = /* @__PURE__ */ new Date()) => {
	return (/* @__PURE__ */ new Date(d.getTime() - d.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
};
var dayBefore = (key, n = 1) => {
	const d = /* @__PURE__ */ new Date(key + "T12:00:00");
	d.setDate(d.getDate() - n);
	return todayKey(d);
};
var EMPTY = {
	id: "stats",
	streak: 0,
	best: 0,
	lastGoalDay: null,
	totalPages: 0,
	days: {},
	freezes: 0
};
var AGUA_RACHA = "lumen_ultima_racha";
var rachaEsperada = () => {
	try {
		return Number(localStorage.getItem(AGUA_RACHA) || "0") || 0;
	} catch {
		return 0;
	}
};
async function loadStats() {
	let s = null;
	for (let intento = 0; intento < 4; intento++) {
		s = await getMeta("stats", null);
		if (s && (s.totalPages || s.streak || Object.keys(s.days || {}).length)) break;
		if (rachaEsperada() === 0) break;
		console.warn("[racha] lectura vacía con racha previa; reintento", intento + 1);
		await new Promise((r) => setTimeout(r, 180 * (intento + 1)));
	}
	const stats = normalize({
		...EMPTY,
		...s || {}
	});
	try {
		localStorage.setItem(AGUA_RACHA, String(Math.max(stats.streak || 0, rachaEsperada())));
	} catch {}
	return stats;
}
/** Recalcula si la racha sigue viva (se rompe si se saltó un día completo). */
function normalize(stats) {
	const today = todayKey();
	if (!stats.lastGoalDay) {
		stats.streak = stats.streak || 0;
		return stats;
	}
	if (stats.lastGoalDay === today) return stats;
	if (stats.lastGoalDay === dayBefore(today)) return stats;
	stats.streak = 0;
	return stats;
}
/** Meta diaria ADAPTATIVA (mejora de IA): si el usuario no fijó una meta
manual, se sugiere el 80 % de la media de los últimos 7 días (mín. 5).
Así la meta se ajusta a tu ritmo real, sin ser imposible ni trivial. */
function metaAdaptativa(stats) {
	const dias = Object.values(stats?.days || {}).map((d) => d?.count || 0).slice(-7);
	if (!dias.length) return 5;
	const avg = dias.reduce((a, b) => a + b, 0) / dias.length;
	return Math.max(5, Math.round(avg * .8));
}
/** Registra una página leída. Devuelve {stats, justHitGoal}. */
async function recordPageRead(bookId, pageIndex) {
	const settings = await getSettings();
	const stats = await loadStats();
	const today = todayKey();
	const day = stats.days[today] || {
		keys: [],
		count: 0,
		goalHit: false
	};
	const goal = settings.goal ? Number(settings.goal) : metaAdaptativa(stats);
	const key = `${bookId}:${pageIndex}`;
	let justHitGoal = false;
	let counted = false;
	if (!day.keys.includes(key)) {
		counted = true;
		day.keys.push(key);
		day.count = day.keys.length;
		stats.totalPages = (stats.totalPages || 0) + 1;
		if (!day.goalHit && day.count >= goal) {
			day.goalHit = true;
			justHitGoal = true;
			const yest = dayBefore(today);
			if (stats.lastGoalDay === yest) stats.streak = (stats.streak || 0) + 1;
			else if (stats.lastGoalDay !== today) stats.streak = 1;
			stats.lastGoalDay = today;
			stats.best = Math.max(stats.best || 0, stats.streak);
		}
	}
	stats.days[today] = day;
	const keys = Object.keys(stats.days).sort();
	if (keys.length > 400) for (const k of keys.slice(0, keys.length - 400)) delete stats.days[k];
	await setMeta({
		...stats,
		id: "stats"
	});
	return {
		stats,
		justHitGoal,
		goal,
		counted
	};
}
async function todayProgress() {
	const settings = await getSettings();
	const stats = await loadStats();
	const day = stats.days[todayKey()] || {
		keys: [],
		count: 0
	};
	return {
		count: day.count || 0,
		goal: settings.goal || 5,
		streak: stats.streak || 0,
		best: stats.best || 0,
		total: stats.totalPages || 0,
		keys: day.keys || []
	};
}
async function last7Days() {
	const stats = await loadStats();
	const out = [];
	const today = todayKey();
	for (let i = 6; i >= 0; i--) {
		const k = dayBefore(today, i);
		const d = stats.days[k];
		out.push({
			day: k,
			count: d?.count || 0,
			goalHit: !!d?.goalHit
		});
	}
	return out;
}
async function exportBackup() {
	const stats = await loadStats();
	const settings = await getSettings();
	return JSON.stringify({
		v: 1,
		exportedAt: Date.now(),
		stats,
		settings
	}, null, 2);
}
async function importBackup(json) {
	const data = typeof json === "string" ? JSON.parse(json) : json;
	if (data?.stats) await setMeta({
		...EMPTY,
		...data.stats,
		id: "stats"
	});
	if (data?.settings) await setMeta({
		...data.settings,
		id: "settings"
	});
	return true;
}
//#endregion
export { recordPageRead as a, loadStats as i, importBackup as n, todayKey as o, last7Days as r, todayProgress as s, exportBackup as t };
