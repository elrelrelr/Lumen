//#region src/lib/sacudida.js
var G = 9.81;
var sacudidaSoportada = () => typeof window !== "undefined" && "DeviceMotionEvent" in window;
var DetectorSacudida = class {
	/**
	* @param {object} opts
	*   umbral   fuerza mínima en m/s² (por defecto 22: sólo movimientos bruscos)
	*   picos    cuántos picos seguidos hacen falta
	*   ventana  ms dentro de los que deben ocurrir esos picos
	*   descanso ms mínimos entre dos activaciones
	*/
	constructor(opts = {}) {
		this.umbral = opts.umbral ?? 22;
		this.picosNecesarios = opts.picos ?? 2;
		this.ventana = opts.ventana ?? 1e3;
		this.descanso = opts.descanso ?? 1500;
		this.onSacudida = null;
		this._picos = [];
		this._ultima = 0;
		this._activo = false;
		this._handler = this._handler.bind(this);
	}
	_handler(e) {
		const a = e.accelerationIncludingGravity || e.acceleration;
		if (!a) return;
		const fuerza = Math.abs(Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2) - G);
		if (fuerza < this.umbral) return;
		const t = Date.now();
		if (t - this._ultima < this.descanso) return;
		this._picos = this._picos.filter((p) => t - p < this.ventana);
		if (this._picos.length && t - this._picos[this._picos.length - 1] < 90) return;
		this._picos.push(t);
		if (this._picos.length >= this.picosNecesarios) {
			this._picos = [];
			this._ultima = t;
			this.onSacudida?.(fuerza);
		}
	}
	/** Arranca la escucha. En iOS pide permiso; devuelve si quedó activo. */
	async start() {
		if (!sacudidaSoportada() || this._activo) return this._activo;
		try {
			const DME = window.DeviceMotionEvent;
			if (typeof DME.requestPermission === "function") {
				if (await DME.requestPermission() !== "granted") return false;
			}
		} catch {}
		window.addEventListener("devicemotion", this._handler);
		this._activo = true;
		return true;
	}
	stop() {
		if (!this._activo) return;
		window.removeEventListener("devicemotion", this._handler);
		this._activo = false;
		this._picos = [];
	}
	get activo() {
		return this._activo;
	}
};
if (typeof window !== "undefined") window.__lumenSacudida = {
	DetectorSacudida,
	sacudidaSoportada
};
//#endregion
export { DetectorSacudida };
