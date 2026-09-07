import { s as qrcodeLib_default } from "./index-DOrzQ79O.js";
//#region src/lib/qrLumen.js
/**
* Genera un QR como data URL PNG.
* @param {string} texto
* @param {number} lado  píxeles de la imagen
* @param {number} quiet  módulos de margen
*/
function qrDataUrl(texto, lado = 320, quiet = 2) {
	const qr = qrcodeLib_default(0, "M");
	qr.addData(String(texto || ""));
	qr.make();
	const n = qr.getModuleCount();
	const cell = lado / (n + quiet * 2);
	const total = Math.round(cell * (n + quiet * 2));
	const canvas = document.createElement("canvas");
	canvas.width = total;
	canvas.height = total;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, total, total);
	ctx.fillStyle = "#0b0b0f";
	for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) ctx.fillRect(Math.round((x + quiet) * cell), Math.round((y + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
	return canvas.toDataURL("image/png");
}
//#endregion
export { qrDataUrl as t };
