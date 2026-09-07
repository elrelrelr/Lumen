//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return import.meta.resolve(specifier);
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			).href;
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			dep = importMetaResolve(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/assertClassBrand.js
function _assertClassBrand(e, t, n) {
	if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw new TypeError("Private element is not present on this object");
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/checkPrivateRedeclaration.js
function _checkPrivateRedeclaration(e, t) {
	if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/classPrivateFieldInitSpec.js
function _classPrivateFieldInitSpec(e, t, a) {
	_checkPrivateRedeclaration(e, t), t.set(e, a);
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/classPrivateFieldGet2.js
function _classPrivateFieldGet2(s, a) {
	return s.get(_assertClassBrand(s, a));
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/classPrivateMethodInitSpec.js
function _classPrivateMethodInitSpec(e, a) {
	_checkPrivateRedeclaration(e, a), a.add(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/classPrivateFieldSet2.js
function _classPrivateFieldSet2(s, a, r) {
	return s.set(_assertClassBrand(s, a), r), r;
}
//#endregion
//#region \0@oxc-project+runtime@0.139.0/helpers/esm/toSetter.js
function _toSetter(t, e, n) {
	e || (e = []);
	var r = e.length++;
	return Object.defineProperty({}, "_", { set: function set(o) {
		e[r] = o, t.apply(n, e);
	} });
}
//#endregion
//#region node_modules/pdfjs-dist/build/pdf.mjs
var _Util;
var _PixelsPerInch;
var _ImageManager;
var _TouchManager;
var _AnnotationEditor;
var _FONT_INFO;
var _TextLayer;
var _PDFWorker;
var _ColorPicker;
var _FreeTextEditor;
var _HighlightEditor;
var _DrawingEditor;
var _SignatureExtractor;
var _DrawLayer;
var _Symbol$iterator;
var _Symbol$iterator2;
var _Symbol$iterator3;
var _Symbol$iterator4;
/**
* @licstart The following is the entire license notice for the
* JavaScript code in this page
*
* Copyright 2024 Mozilla Foundation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @licend The above is the entire license notice for the
* JavaScript code in this page
*/
/**
* pdfjsVersion = 5.6.205
* pdfjsBuild = ada343803
*/
var __webpack_require__ = {};
(() => {
	__webpack_require__.d = (exports, definition) => {
		for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
			enumerable: true,
			get: definition[key]
		});
	};
})();
(() => {
	__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();
var isNodeJS = typeof process === "object" && process + "" === "[object process]" && !process.versions.nw && !(process.versions.electron && process.type && process.type !== "browser");
var FONT_IDENTITY_MATRIX = [
	.001,
	0,
	0,
	.001,
	0,
	0
];
var LINE_FACTOR = 1.35;
var RenderingIntentFlag = {
	ANY: 1,
	DISPLAY: 2,
	PRINT: 4,
	SAVE: 8,
	ANNOTATIONS_FORMS: 16,
	ANNOTATIONS_STORAGE: 32,
	ANNOTATIONS_DISABLE: 64,
	IS_EDITING: 128,
	OPLIST: 256
};
var AnnotationMode = {
	DISABLE: 0,
	ENABLE: 1,
	ENABLE_FORMS: 2,
	ENABLE_STORAGE: 3
};
var AnnotationEditorPrefix = "pdfjs_internal_editor_";
var AnnotationEditorType = {
	DISABLE: -1,
	NONE: 0,
	FREETEXT: 3,
	HIGHLIGHT: 9,
	STAMP: 13,
	INK: 15,
	POPUP: 16,
	SIGNATURE: 101,
	COMMENT: 102
};
var AnnotationEditorParamsType = {
	RESIZE: 1,
	CREATE: 2,
	FREETEXT_SIZE: 11,
	FREETEXT_COLOR: 12,
	FREETEXT_OPACITY: 13,
	INK_COLOR: 21,
	INK_THICKNESS: 22,
	INK_OPACITY: 23,
	HIGHLIGHT_COLOR: 31,
	HIGHLIGHT_THICKNESS: 32,
	HIGHLIGHT_FREE: 33,
	HIGHLIGHT_SHOW_ALL: 34,
	DRAW_STEP: 41
};
var PermissionFlag = {
	PRINT: 4,
	MODIFY_CONTENTS: 8,
	COPY: 16,
	MODIFY_ANNOTATIONS: 32,
	FILL_INTERACTIVE_FORMS: 256,
	COPY_FOR_ACCESSIBILITY: 512,
	ASSEMBLE: 1024,
	PRINT_HIGH_QUALITY: 2048
};
var MeshFigureType = {
	TRIANGLES: 1,
	LATTICE: 2,
	PATCH: 3
};
var TextRenderingMode = {
	FILL: 0,
	STROKE: 1,
	FILL_STROKE: 2,
	INVISIBLE: 3,
	FILL_ADD_TO_PATH: 4,
	STROKE_ADD_TO_PATH: 5,
	FILL_STROKE_ADD_TO_PATH: 6,
	ADD_TO_PATH: 7,
	FILL_STROKE_MASK: 3,
	ADD_TO_PATH_FLAG: 4
};
var ImageKind = {
	GRAYSCALE_1BPP: 1,
	RGB_24BPP: 2,
	RGBA_32BPP: 3
};
var AnnotationType = {
	TEXT: 1,
	LINK: 2,
	FREETEXT: 3,
	LINE: 4,
	SQUARE: 5,
	CIRCLE: 6,
	POLYGON: 7,
	POLYLINE: 8,
	HIGHLIGHT: 9,
	UNDERLINE: 10,
	SQUIGGLY: 11,
	STRIKEOUT: 12,
	STAMP: 13,
	CARET: 14,
	INK: 15,
	POPUP: 16,
	FILEATTACHMENT: 17,
	SOUND: 18,
	MOVIE: 19,
	WIDGET: 20,
	SCREEN: 21,
	PRINTERMARK: 22,
	TRAPNET: 23,
	WATERMARK: 24,
	THREED: 25,
	REDACT: 26
};
var AnnotationBorderStyleType = {
	SOLID: 1,
	DASHED: 2,
	BEVELED: 3,
	INSET: 4,
	UNDERLINE: 5
};
var VerbosityLevel = {
	ERRORS: 0,
	WARNINGS: 1,
	INFOS: 5
};
var OPS = {
	dependency: 1,
	setLineWidth: 2,
	setLineCap: 3,
	setLineJoin: 4,
	setMiterLimit: 5,
	setDash: 6,
	setRenderingIntent: 7,
	setFlatness: 8,
	setGState: 9,
	save: 10,
	restore: 11,
	transform: 12,
	moveTo: 13,
	lineTo: 14,
	curveTo: 15,
	curveTo2: 16,
	curveTo3: 17,
	closePath: 18,
	rectangle: 19,
	stroke: 20,
	closeStroke: 21,
	fill: 22,
	eoFill: 23,
	fillStroke: 24,
	eoFillStroke: 25,
	closeFillStroke: 26,
	closeEOFillStroke: 27,
	endPath: 28,
	clip: 29,
	eoClip: 30,
	beginText: 31,
	endText: 32,
	setCharSpacing: 33,
	setWordSpacing: 34,
	setHScale: 35,
	setLeading: 36,
	setFont: 37,
	setTextRenderingMode: 38,
	setTextRise: 39,
	moveText: 40,
	setLeadingMoveText: 41,
	setTextMatrix: 42,
	nextLine: 43,
	showText: 44,
	showSpacedText: 45,
	nextLineShowText: 46,
	nextLineSetSpacingShowText: 47,
	setCharWidth: 48,
	setCharWidthAndBounds: 49,
	setStrokeColorSpace: 50,
	setFillColorSpace: 51,
	setStrokeColor: 52,
	setStrokeColorN: 53,
	setFillColor: 54,
	setFillColorN: 55,
	setStrokeGray: 56,
	setFillGray: 57,
	setStrokeRGBColor: 58,
	setFillRGBColor: 59,
	setStrokeCMYKColor: 60,
	setFillCMYKColor: 61,
	shadingFill: 62,
	beginInlineImage: 63,
	beginImageData: 64,
	endInlineImage: 65,
	paintXObject: 66,
	markPoint: 67,
	markPointProps: 68,
	beginMarkedContent: 69,
	beginMarkedContentProps: 70,
	endMarkedContent: 71,
	beginCompat: 72,
	endCompat: 73,
	paintFormXObjectBegin: 74,
	paintFormXObjectEnd: 75,
	beginGroup: 76,
	endGroup: 77,
	beginAnnotation: 80,
	endAnnotation: 81,
	paintImageMaskXObject: 83,
	paintImageMaskXObjectGroup: 84,
	paintImageXObject: 85,
	paintInlineImageXObject: 86,
	paintInlineImageXObjectGroup: 87,
	paintImageXObjectRepeat: 88,
	paintImageMaskXObjectRepeat: 89,
	paintSolidColorImageMask: 90,
	constructPath: 91,
	setStrokeTransparent: 92,
	setFillTransparent: 93,
	rawFillPath: 94
};
var DrawOPS = {
	moveTo: 0,
	lineTo: 1,
	curveTo: 2,
	quadraticCurveTo: 3,
	closePath: 4
};
var PasswordResponses = {
	NEED_PASSWORD: 1,
	INCORRECT_PASSWORD: 2
};
var verbosity = VerbosityLevel.WARNINGS;
function setVerbosityLevel(level) {
	if (Number.isInteger(level)) verbosity = level;
}
function getVerbosityLevel() {
	return verbosity;
}
function info(msg) {
	if (verbosity >= VerbosityLevel.INFOS) console.info(`Info: ${msg}`);
}
function warn(msg) {
	if (verbosity >= VerbosityLevel.WARNINGS) console.warn(`Warning: ${msg}`);
}
function unreachable(msg) {
	throw new Error(msg);
}
function assert(cond, msg) {
	if (!cond) unreachable(msg);
}
function _isValidProtocol(url) {
	switch (url?.protocol) {
		case "http:":
		case "https:":
		case "ftp:":
		case "mailto:":
		case "tel:": return true;
		default: return false;
	}
}
function createValidAbsoluteUrl(url, baseUrl = null, options = null) {
	if (!url) return null;
	if (options && typeof url === "string") {
		if (options.addDefaultProtocol && url.startsWith("www.")) {
			if (url.match(/\./g)?.length >= 2) url = `http://${url}`;
		}
		if (options.tryConvertEncoding) try {
			url = stringToUTF8String(url);
		} catch {}
	}
	const absoluteUrl = baseUrl ? URL.parse(url, baseUrl) : URL.parse(url);
	return _isValidProtocol(absoluteUrl) ? absoluteUrl : null;
}
function updateUrlHash(url, hash, allowRel = false) {
	const res = URL.parse(url);
	if (res) {
		res.hash = hash;
		return res.href;
	}
	if (allowRel && createValidAbsoluteUrl(url, "http://example.com")) return url.split("#", 1)[0] + `${hash ? `#${hash}` : ""}`;
	return "";
}
function stripPath(str) {
	return str.substring(str.lastIndexOf("/") + 1);
}
function shadow(obj, prop, value, nonSerializable = false) {
	Object.defineProperty(obj, prop, {
		value,
		enumerable: !nonSerializable,
		configurable: true,
		writable: false
	});
	return value;
}
var BaseException = function BaseExceptionClosure() {
	function BaseException(message, name) {
		this.message = message;
		this.name = name;
	}
	BaseException.prototype = /* @__PURE__ */ new Error();
	BaseException.constructor = BaseException;
	return BaseException;
}();
var PasswordException = class extends BaseException {
	constructor(msg, code) {
		super(msg, "PasswordException");
		this.code = code;
	}
};
var UnknownErrorException = class extends BaseException {
	constructor(msg, details) {
		super(msg, "UnknownErrorException");
		this.details = details;
	}
};
var InvalidPDFException = class extends BaseException {
	constructor(msg) {
		super(msg, "InvalidPDFException");
	}
};
var ResponseException = class extends BaseException {
	constructor(msg, status, missing) {
		super(msg, "ResponseException");
		this.status = status;
		this.missing = missing;
	}
};
var FormatError = class extends BaseException {
	constructor(msg) {
		super(msg, "FormatError");
	}
};
var AbortException = class extends BaseException {
	constructor(msg) {
		super(msg, "AbortException");
	}
};
function bytesToString(bytes) {
	if (typeof bytes !== "object" || bytes?.length === void 0) unreachable("Invalid argument for bytesToString");
	const length = bytes.length;
	const MAX_ARGUMENT_COUNT = 8192;
	if (length < MAX_ARGUMENT_COUNT) return String.fromCharCode.apply(null, bytes);
	const strBuf = [];
	for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
		const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
		const chunk = bytes.subarray(i, chunkEnd);
		strBuf.push(String.fromCharCode.apply(null, chunk));
	}
	return strBuf.join("");
}
function stringToBytes(str) {
	if (typeof str !== "string") unreachable("Invalid argument for stringToBytes");
	const length = str.length;
	const bytes = new Uint8Array(length);
	for (let i = 0; i < length; ++i) bytes[i] = str.charCodeAt(i) & 255;
	return bytes;
}
function string32(value) {
	return String.fromCharCode(value >> 24 & 255, value >> 16 & 255, value >> 8 & 255, value & 255);
}
function isLittleEndian() {
	const buffer8 = /* @__PURE__ */ new Uint8Array(4);
	buffer8[0] = 1;
	return new Uint32Array(buffer8.buffer, 0, 1)[0] === 1;
}
function isEvalSupported() {
	try {
		new Function("");
		return true;
	} catch {
		return false;
	}
}
var FeatureTest = class {
	static get isLittleEndian() {
		return shadow(this, "isLittleEndian", isLittleEndian());
	}
	static get isEvalSupported() {
		return shadow(this, "isEvalSupported", isEvalSupported());
	}
	static get isOffscreenCanvasSupported() {
		return shadow(this, "isOffscreenCanvasSupported", typeof OffscreenCanvas !== "undefined");
	}
	static get isImageDecoderSupported() {
		return shadow(this, "isImageDecoderSupported", typeof ImageDecoder !== "undefined");
	}
	static get isFloat16ArraySupported() {
		return shadow(this, "isFloat16ArraySupported", typeof Float16Array !== "undefined");
	}
	static get isSanitizerSupported() {
		return shadow(this, "isSanitizerSupported", typeof Sanitizer !== "undefined");
	}
	static get platform() {
		const { platform, userAgent } = navigator;
		return shadow(this, "platform", {
			isAndroid: userAgent.includes("Android"),
			isLinux: platform.includes("Linux"),
			isMac: platform.includes("Mac"),
			isWindows: platform.includes("Win"),
			isFirefox: userAgent.includes("Firefox")
		});
	}
	static get isCSSRoundSupported() {
		return shadow(this, "isCSSRoundSupported", globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));
	}
};
var hexNumbers = Array.from(Array(256).keys(), (n) => n.toString(16).padStart(2, "0"));
var Util = class Util {
	static makeHexColor(r, g, b) {
		return `#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;
	}
	static domMatrixToTransform(dm) {
		return [
			dm.a,
			dm.b,
			dm.c,
			dm.d,
			dm.e,
			dm.f
		];
	}
	static scaleMinMax(transform, minMax) {
		let temp;
		if (transform[0]) {
			if (transform[0] < 0) {
				temp = minMax[0];
				minMax[0] = minMax[2];
				minMax[2] = temp;
			}
			minMax[0] *= transform[0];
			minMax[2] *= transform[0];
			if (transform[3] < 0) {
				temp = minMax[1];
				minMax[1] = minMax[3];
				minMax[3] = temp;
			}
			minMax[1] *= transform[3];
			minMax[3] *= transform[3];
		} else {
			temp = minMax[0];
			minMax[0] = minMax[1];
			minMax[1] = temp;
			temp = minMax[2];
			minMax[2] = minMax[3];
			minMax[3] = temp;
			if (transform[1] < 0) {
				temp = minMax[1];
				minMax[1] = minMax[3];
				minMax[3] = temp;
			}
			minMax[1] *= transform[1];
			minMax[3] *= transform[1];
			if (transform[2] < 0) {
				temp = minMax[0];
				minMax[0] = minMax[2];
				minMax[2] = temp;
			}
			minMax[0] *= transform[2];
			minMax[2] *= transform[2];
		}
		minMax[0] += transform[4];
		minMax[1] += transform[5];
		minMax[2] += transform[4];
		minMax[3] += transform[5];
	}
	static transform(m1, m2) {
		return [
			m1[0] * m2[0] + m1[2] * m2[1],
			m1[1] * m2[0] + m1[3] * m2[1],
			m1[0] * m2[2] + m1[2] * m2[3],
			m1[1] * m2[2] + m1[3] * m2[3],
			m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
			m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
		];
	}
	static multiplyByDOMMatrix(m, md) {
		return [
			m[0] * md.a + m[2] * md.b,
			m[1] * md.a + m[3] * md.b,
			m[0] * md.c + m[2] * md.d,
			m[1] * md.c + m[3] * md.d,
			m[0] * md.e + m[2] * md.f + m[4],
			m[1] * md.e + m[3] * md.f + m[5]
		];
	}
	static applyTransform(p, m, pos = 0) {
		const p0 = p[pos];
		const p1 = p[pos + 1];
		p[pos] = p0 * m[0] + p1 * m[2] + m[4];
		p[pos + 1] = p0 * m[1] + p1 * m[3] + m[5];
	}
	static applyTransformToBezier(p, transform, pos = 0) {
		const m0 = transform[0];
		const m1 = transform[1];
		const m2 = transform[2];
		const m3 = transform[3];
		const m4 = transform[4];
		const m5 = transform[5];
		for (let i = 0; i < 6; i += 2) {
			const pI = p[pos + i];
			const pI1 = p[pos + i + 1];
			p[pos + i] = pI * m0 + pI1 * m2 + m4;
			p[pos + i + 1] = pI * m1 + pI1 * m3 + m5;
		}
	}
	static applyInverseTransform(p, m) {
		const p0 = p[0];
		const p1 = p[1];
		const d = m[0] * m[3] - m[1] * m[2];
		p[0] = (p0 * m[3] - p1 * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
		p[1] = (-p0 * m[1] + p1 * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
	}
	static axialAlignedBoundingBox(rect, transform, output) {
		const m0 = transform[0];
		const m1 = transform[1];
		const m2 = transform[2];
		const m3 = transform[3];
		const m4 = transform[4];
		const m5 = transform[5];
		const r0 = rect[0];
		const r1 = rect[1];
		const r2 = rect[2];
		const r3 = rect[3];
		let a0 = m0 * r0 + m4;
		let a2 = a0;
		let a1 = m0 * r2 + m4;
		let a3 = a1;
		let b0 = m3 * r1 + m5;
		let b2 = b0;
		let b1 = m3 * r3 + m5;
		let b3 = b1;
		if (m1 !== 0 || m2 !== 0) {
			const m1r0 = m1 * r0;
			const m1r2 = m1 * r2;
			const m2r1 = m2 * r1;
			const m2r3 = m2 * r3;
			a0 += m2r1;
			a3 += m2r1;
			a1 += m2r3;
			a2 += m2r3;
			b0 += m1r0;
			b3 += m1r0;
			b1 += m1r2;
			b2 += m1r2;
		}
		output[0] = Math.min(output[0], a0, a1, a2, a3);
		output[1] = Math.min(output[1], b0, b1, b2, b3);
		output[2] = Math.max(output[2], a0, a1, a2, a3);
		output[3] = Math.max(output[3], b0, b1, b2, b3);
	}
	static inverseTransform(m) {
		const d = m[0] * m[3] - m[1] * m[2];
		return [
			m[3] / d,
			-m[1] / d,
			-m[2] / d,
			m[0] / d,
			(m[2] * m[5] - m[4] * m[3]) / d,
			(m[4] * m[1] - m[5] * m[0]) / d
		];
	}
	static singularValueDecompose2dScale(matrix, output) {
		const m0 = matrix[0];
		const m1 = matrix[1];
		const m2 = matrix[2];
		const m3 = matrix[3];
		const a = m0 ** 2 + m1 ** 2;
		const b = m0 * m2 + m1 * m3;
		const c = m2 ** 2 + m3 ** 2;
		const first = (a + c) / 2;
		const second = Math.sqrt(first ** 2 - (a * c - b ** 2));
		output[0] = Math.sqrt(first + second || 1);
		output[1] = Math.sqrt(first - second || 1);
	}
	static normalizeRect(rect) {
		const r = rect.slice(0);
		if (rect[0] > rect[2]) {
			r[0] = rect[2];
			r[2] = rect[0];
		}
		if (rect[1] > rect[3]) {
			r[1] = rect[3];
			r[3] = rect[1];
		}
		return r;
	}
	static intersect(rect1, rect2) {
		const xLow = Math.max(Math.min(rect1[0], rect1[2]), Math.min(rect2[0], rect2[2]));
		const xHigh = Math.min(Math.max(rect1[0], rect1[2]), Math.max(rect2[0], rect2[2]));
		if (xLow > xHigh) return null;
		const yLow = Math.max(Math.min(rect1[1], rect1[3]), Math.min(rect2[1], rect2[3]));
		const yHigh = Math.min(Math.max(rect1[1], rect1[3]), Math.max(rect2[1], rect2[3]));
		if (yLow > yHigh) return null;
		return [
			xLow,
			yLow,
			xHigh,
			yHigh
		];
	}
	static pointBoundingBox(x, y, minMax) {
		minMax[0] = Math.min(minMax[0], x);
		minMax[1] = Math.min(minMax[1], y);
		minMax[2] = Math.max(minMax[2], x);
		minMax[3] = Math.max(minMax[3], y);
	}
	static rectBoundingBox(x0, y0, x1, y1, minMax) {
		minMax[0] = Math.min(minMax[0], x0, x1);
		minMax[1] = Math.min(minMax[1], y0, y1);
		minMax[2] = Math.max(minMax[2], x0, x1);
		minMax[3] = Math.max(minMax[3], y0, y1);
	}
	static bezierBoundingBox(x0, y0, x1, y1, x2, y2, x3, y3, minMax) {
		minMax[0] = Math.min(minMax[0], x0, x3);
		minMax[1] = Math.min(minMax[1], y0, y3);
		minMax[2] = Math.max(minMax[2], x0, x3);
		minMax[3] = Math.max(minMax[3], y0, y3);
		_assertClassBrand(Util, this, _getExtremum).call(this, x0, x1, x2, x3, y0, y1, y2, y3, 3 * (-x0 + 3 * (x1 - x2) + x3), 6 * (x0 - 2 * x1 + x2), 3 * (x1 - x0), minMax);
		_assertClassBrand(Util, this, _getExtremum).call(this, x0, x1, x2, x3, y0, y1, y2, y3, 3 * (-y0 + 3 * (y1 - y2) + y3), 6 * (y0 - 2 * y1 + y2), 3 * (y1 - y0), minMax);
	}
};
_Util = Util;
function _getExtremumOnCurve(x0, x1, x2, x3, y0, y1, y2, y3, t, minMax) {
	if (t <= 0 || t >= 1) return;
	const mt = 1 - t;
	const tt = t * t;
	const ttt = tt * t;
	const x = mt * (mt * (mt * x0 + 3 * t * x1) + 3 * tt * x2) + ttt * x3;
	const y = mt * (mt * (mt * y0 + 3 * t * y1) + 3 * tt * y2) + ttt * y3;
	minMax[0] = Math.min(minMax[0], x);
	minMax[1] = Math.min(minMax[1], y);
	minMax[2] = Math.max(minMax[2], x);
	minMax[3] = Math.max(minMax[3], y);
}
function _getExtremum(x0, x1, x2, x3, y0, y1, y2, y3, a, b, c, minMax) {
	if (Math.abs(a) < 1e-12) {
		if (Math.abs(b) >= 1e-12) _assertClassBrand(_Util, this, _getExtremumOnCurve).call(this, x0, x1, x2, x3, y0, y1, y2, y3, -c / b, minMax);
		return;
	}
	const delta = b ** 2 - 4 * c * a;
	if (delta < 0) return;
	const sqrtDelta = Math.sqrt(delta);
	const a2 = 2 * a;
	_assertClassBrand(_Util, this, _getExtremumOnCurve).call(this, x0, x1, x2, x3, y0, y1, y2, y3, (-b + sqrtDelta) / a2, minMax);
	_assertClassBrand(_Util, this, _getExtremumOnCurve).call(this, x0, x1, x2, x3, y0, y1, y2, y3, (-b - sqrtDelta) / a2, minMax);
}
function stringToUTF8String(str) {
	return decodeURIComponent(escape(str));
}
var NormalizeRegex = null;
var NormalizationMap = null;
function normalizeUnicode(str) {
	if (!NormalizeRegex) {
		NormalizeRegex = /([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;
		NormalizationMap = /* @__PURE__ */ new Map([["ﬅ", "ſt"]]);
	}
	return str.replaceAll(NormalizeRegex, (_, p1, p2) => p1 ? p1.normalize("NFKC") : NormalizationMap.get(p2));
}
function getUuid() {
	if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
	const buf = /* @__PURE__ */ new Uint8Array(32);
	crypto.getRandomValues(buf);
	return bytesToString(buf);
}
var AnnotationPrefix = "pdfjs_internal_id_";
function _isValidExplicitDest(validRef, validName, dest) {
	if (!Array.isArray(dest) || dest.length < 2) return false;
	const [page, zoom, ...args] = dest;
	if (!validRef(page) && !Number.isInteger(page)) return false;
	if (!validName(zoom)) return false;
	const argsLen = args.length;
	let allowNull = true;
	switch (zoom.name) {
		case "XYZ":
			if (argsLen < 2 || argsLen > 3) return false;
			break;
		case "Fit":
		case "FitB": return argsLen === 0;
		case "FitH":
		case "FitBH":
		case "FitV":
		case "FitBV":
			if (argsLen > 1) return false;
			break;
		case "FitR":
			if (argsLen !== 4) return false;
			allowNull = false;
			break;
		default: return false;
	}
	for (const arg of args) {
		if (typeof arg === "number" || allowNull && arg === null) continue;
		return false;
	}
	return true;
}
var makeArr = () => [];
var makeMap = () => /* @__PURE__ */ new Map();
var makeObj = () => Object.create(null);
function MathClamp(v, min, max) {
	return Math.min(Math.max(v, min), max);
}
if (typeof Math.sumPrecise !== "function") Math.sumPrecise = function(numbers) {
	return numbers.reduce((a, b) => a + b, 0);
};
var XfaText = class XfaText {
	static textContent(xfa) {
		const items = [];
		const output = {
			items,
			styles: Object.create(null)
		};
		function walk(node) {
			if (!node) return;
			let str = null;
			const name = node.name;
			if (name === "#text") str = node.value;
			else if (!XfaText.shouldBuildText(name)) return;
			else if (node?.attributes?.textContent) str = node.attributes.textContent;
			else if (node.value) str = node.value;
			if (str !== null) items.push({ str });
			if (!node.children) return;
			for (const child of node.children) walk(child);
		}
		walk(xfa);
		return output;
	}
	static shouldBuildText(name) {
		return !(name === "textarea" || name === "input" || name === "option" || name === "select");
	}
};
var XfaLayer = class {
	static setupStorage(html, id, element, storage, intent) {
		const storedData = storage.getValue(id, { value: null });
		switch (element.name) {
			case "textarea":
				if (storedData.value !== null) html.textContent = storedData.value;
				if (intent === "print") break;
				html.addEventListener("input", (event) => {
					storage.setValue(id, { value: event.target.value });
				});
				break;
			case "input":
				if (element.attributes.type === "radio" || element.attributes.type === "checkbox") {
					if (storedData.value === element.attributes.xfaOn) html.setAttribute("checked", true);
					else if (storedData.value === element.attributes.xfaOff) html.removeAttribute("checked");
					if (intent === "print") break;
					html.addEventListener("change", (event) => {
						storage.setValue(id, { value: event.target.checked ? event.target.getAttribute("xfaOn") : event.target.getAttribute("xfaOff") });
					});
				} else {
					if (storedData.value !== null) html.setAttribute("value", storedData.value);
					if (intent === "print") break;
					html.addEventListener("input", (event) => {
						storage.setValue(id, { value: event.target.value });
					});
				}
				break;
			case "select":
				if (storedData.value !== null) {
					html.setAttribute("value", storedData.value);
					for (const option of element.children) if (option.attributes.value === storedData.value) option.attributes.selected = true;
					else if (option.attributes.hasOwnProperty("selected")) delete option.attributes.selected;
				}
				html.addEventListener("input", (event) => {
					const options = event.target.options;
					const value = options.selectedIndex === -1 ? "" : options[options.selectedIndex].value;
					storage.setValue(id, { value });
				});
				break;
		}
	}
	static setAttributes({ html, element, storage = null, intent, linkService }) {
		const { attributes } = element;
		const isHTMLAnchorElement = html instanceof HTMLAnchorElement;
		if (attributes.type === "radio") attributes.name = `${attributes.name}-${intent}`;
		for (const [key, value] of Object.entries(attributes)) {
			if (value === null || value === void 0) continue;
			switch (key) {
				case "class":
					if (value.length) html.setAttribute(key, value.join(" "));
					break;
				case "dataId": break;
				case "id":
					html.setAttribute("data-element-id", value);
					break;
				case "style":
					Object.assign(html.style, value);
					break;
				case "textContent":
					html.textContent = value;
					break;
				default: if (!isHTMLAnchorElement || key !== "href" && key !== "newWindow") html.setAttribute(key, value);
			}
		}
		if (isHTMLAnchorElement) linkService.addLinkAttributes(html, attributes.href, attributes.newWindow);
		if (storage && attributes.dataId) this.setupStorage(html, attributes.dataId, element, storage);
	}
	static render(parameters) {
		const storage = parameters.annotationStorage;
		const linkService = parameters.linkService;
		const root = parameters.xfaHtml;
		const intent = parameters.intent || "display";
		const rootHtml = document.createElement(root.name);
		if (root.attributes) this.setAttributes({
			html: rootHtml,
			element: root,
			intent,
			linkService
		});
		const isNotForRichText = intent !== "richText";
		const rootDiv = parameters.div;
		rootDiv.append(rootHtml);
		if (parameters.viewport) {
			const transform = `matrix(${parameters.viewport.transform.join(",")})`;
			rootDiv.style.transform = transform;
		}
		if (isNotForRichText) rootDiv.setAttribute("class", "xfaLayer xfaFont");
		const textDivs = [];
		if (root.children.length === 0) {
			if (root.value) {
				const node = document.createTextNode(root.value);
				rootHtml.append(node);
				if (isNotForRichText && XfaText.shouldBuildText(root.name)) textDivs.push(node);
			}
			return { textDivs };
		}
		const stack = [[
			root,
			-1,
			rootHtml
		]];
		while (stack.length > 0) {
			const [parent, i, html] = stack.at(-1);
			if (i + 1 === parent.children.length) {
				stack.pop();
				continue;
			}
			const child = parent.children[++stack.at(-1)[1]];
			if (child === null) continue;
			const { name } = child;
			if (name === "#text") {
				const node = document.createTextNode(child.value);
				textDivs.push(node);
				html.append(node);
				continue;
			}
			const childHtml = child?.attributes?.xmlns ? document.createElementNS(child.attributes.xmlns, name) : document.createElement(name);
			html.append(childHtml);
			if (child.attributes) this.setAttributes({
				html: childHtml,
				element: child,
				storage,
				intent,
				linkService
			});
			if (child.children?.length > 0) stack.push([
				child,
				-1,
				childHtml
			]);
			else if (child.value) {
				const node = document.createTextNode(child.value);
				if (isNotForRichText && XfaText.shouldBuildText(name)) textDivs.push(node);
				childHtml.append(node);
			}
		}
		for (const el of rootDiv.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea")) el.setAttribute("readOnly", true);
		return { textDivs };
	}
	static update(parameters) {
		const transform = `matrix(${parameters.viewport.transform.join(",")})`;
		parameters.div.style.transform = transform;
		parameters.div.hidden = false;
	}
};
var SVG_NS = "http://www.w3.org/2000/svg";
var PixelsPerInch = class {};
_PixelsPerInch = PixelsPerInch;
_defineProperty(PixelsPerInch, "CSS", 96);
_defineProperty(PixelsPerInch, "PDF", 72);
_defineProperty(PixelsPerInch, "PDF_TO_CSS_UNITS", _PixelsPerInch.CSS / _PixelsPerInch.PDF);
async function fetchData(url, type = "text") {
	if (isValidFetchUrl(url, document.baseURI)) {
		const response = await fetch(url);
		if (!response.ok) throw new Error(response.statusText);
		switch (type) {
			case "blob": return response.blob();
			case "bytes": return response.bytes();
			case "json": return response.json();
		}
		return response.text();
	}
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = type === "bytes" ? "arraybuffer" : type;
		request.onreadystatechange = () => {
			if (request.readyState !== XMLHttpRequest.DONE) return;
			if (request.status === 200 || request.status === 0) {
				switch (type) {
					case "bytes":
						resolve(new Uint8Array(request.response));
						return;
					case "blob":
					case "json":
						resolve(request.response);
						return;
				}
				resolve(request.responseText);
				return;
			}
			reject(new Error(request.statusText));
		};
		request.send(null);
	});
}
var PageViewport = class PageViewport {
	constructor({ viewBox, userUnit, scale, rotation, offsetX = 0, offsetY = 0, dontFlip = false }) {
		this.viewBox = viewBox;
		this.userUnit = userUnit;
		this.scale = scale;
		this.rotation = rotation;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		scale *= userUnit;
		const centerX = (viewBox[2] + viewBox[0]) / 2;
		const centerY = (viewBox[3] + viewBox[1]) / 2;
		let rotateA, rotateB, rotateC, rotateD;
		rotation %= 360;
		if (rotation < 0) rotation += 360;
		switch (rotation) {
			case 180:
				rotateA = -1;
				rotateB = 0;
				rotateC = 0;
				rotateD = 1;
				break;
			case 90:
				rotateA = 0;
				rotateB = 1;
				rotateC = 1;
				rotateD = 0;
				break;
			case 270:
				rotateA = 0;
				rotateB = -1;
				rotateC = -1;
				rotateD = 0;
				break;
			case 0:
				rotateA = 1;
				rotateB = 0;
				rotateC = 0;
				rotateD = -1;
				break;
			default: throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
		}
		if (dontFlip) {
			rotateC = -rotateC;
			rotateD = -rotateD;
		}
		let offsetCanvasX, offsetCanvasY;
		let width, height;
		if (rotateA === 0) {
			offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
			offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
			width = (viewBox[3] - viewBox[1]) * scale;
			height = (viewBox[2] - viewBox[0]) * scale;
		} else {
			offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
			offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
			width = (viewBox[2] - viewBox[0]) * scale;
			height = (viewBox[3] - viewBox[1]) * scale;
		}
		this.transform = [
			rotateA * scale,
			rotateB * scale,
			rotateC * scale,
			rotateD * scale,
			offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY,
			offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY
		];
		this.width = width;
		this.height = height;
	}
	get rawDims() {
		const dims = this.viewBox;
		return shadow(this, "rawDims", {
			pageWidth: dims[2] - dims[0],
			pageHeight: dims[3] - dims[1],
			pageX: dims[0],
			pageY: dims[1]
		});
	}
	clone({ scale = this.scale, rotation = this.rotation, offsetX = this.offsetX, offsetY = this.offsetY, dontFlip = false } = {}) {
		return new PageViewport({
			viewBox: this.viewBox.slice(),
			userUnit: this.userUnit,
			scale,
			rotation,
			offsetX,
			offsetY,
			dontFlip
		});
	}
	convertToViewportPoint(x, y) {
		const p = [x, y];
		Util.applyTransform(p, this.transform);
		return p;
	}
	convertToViewportRectangle(rect) {
		const topLeft = [rect[0], rect[1]];
		Util.applyTransform(topLeft, this.transform);
		const bottomRight = [rect[2], rect[3]];
		Util.applyTransform(bottomRight, this.transform);
		return [
			topLeft[0],
			topLeft[1],
			bottomRight[0],
			bottomRight[1]
		];
	}
	convertToPdfPoint(x, y) {
		const p = [x, y];
		Util.applyInverseTransform(p, this.transform);
		return p;
	}
};
var RenderingCancelledException = class extends BaseException {
	constructor(msg, extraDelay = 0) {
		super(msg, "RenderingCancelledException");
		this.extraDelay = extraDelay;
	}
};
function isDataScheme(url) {
	const ii = url.length;
	let i = 0;
	while (i < ii && url[i].trim() === "") i++;
	return url.substring(i, i + 5).toLowerCase() === "data:";
}
function isPdfFile(filename) {
	return typeof filename === "string" && /\.pdf$/i.test(filename);
}
function getFilenameFromUrl(url) {
	[url] = url.split(/[#?]/, 1);
	return stripPath(url);
}
function getPdfFilenameFromUrl(url, defaultFilename = "document.pdf") {
	if (typeof url !== "string") return defaultFilename;
	if (isDataScheme(url)) {
		warn("getPdfFilenameFromUrl: ignore \"data:\"-URL for performance reasons.");
		return defaultFilename;
	}
	const getURL = (urlString) => {
		try {
			return new URL(urlString);
		} catch {
			try {
				return new URL(decodeURIComponent(urlString));
			} catch {
				try {
					return new URL(urlString, "https://foo.bar");
				} catch {
					try {
						return new URL(decodeURIComponent(urlString), "https://foo.bar");
					} catch {
						return null;
					}
				}
			}
		}
	};
	const newURL = getURL(url);
	if (!newURL) return defaultFilename;
	const decode = (name) => {
		try {
			let decoded = decodeURIComponent(name);
			if (decoded.includes("/")) {
				decoded = stripPath(decoded);
				if (/^\.pdf$/i.test(decoded)) return name;
			}
			return decoded;
		} catch {
			return name;
		}
	};
	const pdfRegex = /\.pdf$/i;
	const filename = stripPath(newURL.pathname);
	if (pdfRegex.test(filename)) return decode(filename);
	if (newURL.searchParams.size > 0) {
		const getLast = (iterator) => [...iterator].findLast((v) => pdfRegex.test(v));
		const name = getLast(newURL.searchParams.values()) ?? getLast(newURL.searchParams.keys());
		if (name) return decode(name);
	}
	if (newURL.hash) {
		const hashFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i.exec(newURL.hash);
		if (hashFilename) return decode(hashFilename[0]);
	}
	return defaultFilename;
}
var _started = /* @__PURE__ */ new WeakMap();
var StatTimer = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _started, /* @__PURE__ */ new Map());
		_defineProperty(this, "times", []);
	}
	time(name) {
		if (_classPrivateFieldGet2(_started, this).has(name)) warn(`Timer is already running for ${name}`);
		_classPrivateFieldGet2(_started, this).set(name, Date.now());
	}
	timeEnd(name) {
		if (!_classPrivateFieldGet2(_started, this).has(name)) warn(`Timer has not been started for ${name}`);
		this.times.push({
			name,
			start: _classPrivateFieldGet2(_started, this).get(name),
			end: Date.now()
		});
		_classPrivateFieldGet2(_started, this).delete(name);
	}
	toString() {
		const longest = Math.max(...this.times.map((t) => t.name.length));
		return this.times.map((t) => `${t.name.padEnd(longest)} ${t.end - t.start}ms\n`).join("");
	}
};
function isValidFetchUrl(url, baseUrl) {
	const res = baseUrl ? URL.parse(url, baseUrl) : URL.parse(url);
	return /https?:/.test(res?.protocol ?? "");
}
function noContextMenu(e) {
	e.preventDefault();
}
function stopEvent(e) {
	e.preventDefault();
	e.stopPropagation();
}
function deprecated(details) {
	console.log("Deprecated API usage: " + details);
}
var PDFDateString = class PDFDateString {
	static toDateObject(input) {
		if (input instanceof Date) return input;
		if (!input || typeof input !== "string") return null;
		_assertClassBrand(PDFDateString, this, _regex)._ || (_regex._ = _assertClassBrand(PDFDateString, this, /* @__PURE__ */ new RegExp("^D:(\\d{4})(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?([Z|+|-])?(\\d{2})?'?(\\d{2})?'?")));
		const matches = _assertClassBrand(PDFDateString, this, _regex)._.exec(input);
		if (!matches) return null;
		const year = parseInt(matches[1], 10);
		let month = parseInt(matches[2], 10);
		month = month >= 1 && month <= 12 ? month - 1 : 0;
		let day = parseInt(matches[3], 10);
		day = day >= 1 && day <= 31 ? day : 1;
		let hour = parseInt(matches[4], 10);
		hour = hour >= 0 && hour <= 23 ? hour : 0;
		let minute = parseInt(matches[5], 10);
		minute = minute >= 0 && minute <= 59 ? minute : 0;
		let second = parseInt(matches[6], 10);
		second = second >= 0 && second <= 59 ? second : 0;
		const universalTimeRelation = matches[7] || "Z";
		let offsetHour = parseInt(matches[8], 10);
		offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
		let offsetMinute = parseInt(matches[9], 10) || 0;
		offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;
		if (universalTimeRelation === "-") {
			hour += offsetHour;
			minute += offsetMinute;
		} else if (universalTimeRelation === "+") {
			hour -= offsetHour;
			minute -= offsetMinute;
		}
		return new Date(Date.UTC(year, month, day, hour, minute, second));
	}
};
var _regex = { _: void 0 };
function getXfaPageViewport(xfaPage, { scale = 1, rotation = 0 }) {
	const { width, height } = xfaPage.attributes.style;
	return new PageViewport({
		viewBox: [
			0,
			0,
			parseInt(width),
			parseInt(height)
		],
		userUnit: 1,
		scale,
		rotation
	});
}
function getRGB(color) {
	if (color.startsWith("#")) {
		const colorRGB = parseInt(color.slice(1), 16);
		return [
			(colorRGB & 16711680) >> 16,
			(colorRGB & 65280) >> 8,
			colorRGB & 255
		];
	}
	if (color.startsWith("rgb(")) return color.slice(4, -1).split(",").map((x) => parseInt(x));
	if (color.startsWith("rgba(")) return color.slice(5, -1).split(",", 3).map((x) => parseInt(x));
	warn(`Not a valid color format: "${color}"`);
	return [
		0,
		0,
		0
	];
}
function getColorValues(colors) {
	const span = document.createElement("span");
	span.style.visibility = "hidden";
	span.style.colorScheme = "only light";
	document.body.append(span);
	for (const name of colors.keys()) {
		span.style.color = name;
		const computedColor = window.getComputedStyle(span).color;
		colors.set(name, getRGB(computedColor));
	}
	span.remove();
}
function getCurrentTransform(ctx) {
	const { a, b, c, d, e, f } = ctx.getTransform();
	return [
		a,
		b,
		c,
		d,
		e,
		f
	];
}
function getCurrentTransformInverse(ctx) {
	const { a, b, c, d, e, f } = ctx.getTransform().invertSelf();
	return [
		a,
		b,
		c,
		d,
		e,
		f
	];
}
function setLayerDimensions(div, viewport, mustFlip = false, mustRotate = true) {
	if (viewport instanceof PageViewport) {
		const { pageWidth, pageHeight } = viewport.rawDims;
		const { style } = div;
		const useRound = FeatureTest.isCSSRoundSupported;
		const w = `var(--total-scale-factor) * ${pageWidth}px`, h = `var(--total-scale-factor) * ${pageHeight}px`;
		const widthStr = useRound ? `round(down, ${w}, var(--scale-round-x))` : `calc(${w})`, heightStr = useRound ? `round(down, ${h}, var(--scale-round-y))` : `calc(${h})`;
		if (!mustFlip || viewport.rotation % 180 === 0) {
			style.width = widthStr;
			style.height = heightStr;
		} else {
			style.width = heightStr;
			style.height = widthStr;
		}
	}
	if (mustRotate) div.setAttribute("data-main-rotation", viewport.rotation);
}
var OutputScale = class OutputScale {
	constructor() {
		const { pixelRatio } = OutputScale;
		this.sx = pixelRatio;
		this.sy = pixelRatio;
	}
	get scaled() {
		return this.sx !== 1 || this.sy !== 1;
	}
	get symmetric() {
		return this.sx === this.sy;
	}
	limitCanvas(width, height, maxPixels, maxDim, capAreaFactor = -1) {
		let maxAreaScale = Infinity, maxWidthScale = Infinity, maxHeightScale = Infinity;
		maxPixels = OutputScale.capPixels(maxPixels, capAreaFactor);
		if (maxPixels > 0) maxAreaScale = Math.sqrt(maxPixels / (width * height));
		if (maxDim !== -1) {
			maxWidthScale = maxDim / width;
			maxHeightScale = maxDim / height;
		}
		const maxScale = Math.min(maxAreaScale, maxWidthScale, maxHeightScale);
		if (this.sx > maxScale || this.sy > maxScale) {
			this.sx = maxScale;
			this.sy = maxScale;
			return true;
		}
		return false;
	}
	static get pixelRatio() {
		return globalThis.devicePixelRatio || 1;
	}
	static capPixels(maxPixels, capAreaFactor) {
		if (capAreaFactor >= 0) {
			const winPixels = Math.ceil(window.screen.availWidth * window.screen.availHeight * this.pixelRatio ** 2 * (1 + capAreaFactor / 100));
			return maxPixels > 0 ? Math.min(maxPixels, winPixels) : winPixels;
		}
		return maxPixels;
	}
};
var SupportedImageMimeTypes = [
	"image/apng",
	"image/avif",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/svg+xml",
	"image/webp",
	"image/x-icon"
];
var ColorScheme = class {
	static get isDarkMode() {
		return shadow(this, "isDarkMode", !!window?.matchMedia?.("(prefers-color-scheme: dark)").matches);
	}
};
var CSSConstants = class {
	static get commentForegroundColor() {
		const element = document.createElement("span");
		element.classList.add("comment", "sidebar");
		const { style } = element;
		style.width = style.height = "0";
		style.display = "none";
		style.color = "var(--comment-fg-color)";
		document.body.append(element);
		const { color } = window.getComputedStyle(element);
		element.remove();
		return shadow(this, "commentForegroundColor", getRGB(color));
	}
};
function applyOpacity(color, opacity) {
	opacity = MathClamp(opacity ?? 1, 0, 1);
	const white = 255 * (1 - opacity);
	return color.map((c) => Math.round(c * opacity + white));
}
function RGBToHSL(rgb, output) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	if (max === min) output[0] = output[1] = 0;
	else {
		const d = max - min;
		output[1] = l < .5 ? d / (max + min) : d / (2 - max - min);
		switch (max) {
			case r:
				output[0] = ((g - b) / d + (g < b ? 6 : 0)) * 60;
				break;
			case g:
				output[0] = ((b - r) / d + 2) * 60;
				break;
			case b:
				output[0] = ((r - g) / d + 4) * 60;
				break;
		}
	}
	output[2] = l;
}
function HSLToRGB(hsl, output) {
	const h = hsl[0];
	const s = hsl[1];
	const l = hsl[2];
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(h / 60 % 2 - 1));
	const m = l - c / 2;
	switch (Math.floor(h / 60)) {
		case 0:
			output[0] = c + m;
			output[1] = x + m;
			output[2] = m;
			break;
		case 1:
			output[0] = x + m;
			output[1] = c + m;
			output[2] = m;
			break;
		case 2:
			output[0] = m;
			output[1] = c + m;
			output[2] = x + m;
			break;
		case 3:
			output[0] = m;
			output[1] = x + m;
			output[2] = c + m;
			break;
		case 4:
			output[0] = x + m;
			output[1] = m;
			output[2] = c + m;
			break;
		case 5:
		case 6:
			output[0] = c + m;
			output[1] = m;
			output[2] = x + m;
			break;
	}
}
function computeLuminance(x) {
	return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
}
function contrastRatio(hsl1, hsl2, output) {
	HSLToRGB(hsl1, output);
	output.map(computeLuminance);
	const lum1 = .2126 * output[0] + .7152 * output[1] + .0722 * output[2];
	HSLToRGB(hsl2, output);
	output.map(computeLuminance);
	const lum2 = .2126 * output[0] + .7152 * output[1] + .0722 * output[2];
	return lum1 > lum2 ? (lum1 + .05) / (lum2 + .05) : (lum2 + .05) / (lum1 + .05);
}
var contrastCache = /* @__PURE__ */ new Map();
function findContrastColor(baseColor, fixedColor) {
	const key = baseColor[0] + baseColor[1] * 256 + baseColor[2] * 65536 + fixedColor[0] * 16777216 + fixedColor[1] * 4294967296 + fixedColor[2] * 1099511627776;
	let cachedValue = contrastCache.get(key);
	if (cachedValue) return cachedValue;
	const array = /* @__PURE__ */ new Float32Array(9);
	const output = array.subarray(0, 3);
	const baseHSL = array.subarray(3, 6);
	RGBToHSL(baseColor, baseHSL);
	const fixedHSL = array.subarray(6, 9);
	RGBToHSL(fixedColor, fixedHSL);
	const isFixedColorDark = fixedHSL[2] < .5;
	const minContrast = isFixedColorDark ? 12 : 4.5;
	baseHSL[2] = isFixedColorDark ? Math.sqrt(baseHSL[2]) : 1 - Math.sqrt(1 - baseHSL[2]);
	if (contrastRatio(baseHSL, fixedHSL, output) < minContrast) {
		let start, end;
		if (isFixedColorDark) {
			start = baseHSL[2];
			end = 1;
		} else {
			start = 0;
			end = baseHSL[2];
		}
		const PRECISION = .005;
		while (end - start > PRECISION) {
			const mid = baseHSL[2] = (start + end) / 2;
			if (isFixedColorDark === contrastRatio(baseHSL, fixedHSL, output) < minContrast) start = mid;
			else end = mid;
		}
		baseHSL[2] = isFixedColorDark ? end : start;
	}
	HSLToRGB(baseHSL, output);
	cachedValue = Util.makeHexColor(Math.round(output[0] * 255), Math.round(output[1] * 255), Math.round(output[2] * 255));
	contrastCache.set(key, cachedValue);
	return cachedValue;
}
function renderRichText({ html, dir, className }, container) {
	const fragment = document.createDocumentFragment();
	if (typeof html === "string") {
		const p = document.createElement("p");
		p.dir = dir || "auto";
		const lines = html.split(/(?:\r\n?|\n)/);
		for (let i = 0, ii = lines.length; i < ii; ++i) {
			const line = lines[i];
			p.append(document.createTextNode(line));
			if (i < ii - 1) p.append(document.createElement("br"));
		}
		fragment.append(p);
	} else XfaLayer.render({
		xfaHtml: html,
		div: fragment,
		intent: "richText"
	});
	fragment.firstElementChild.classList.add("richText", className);
	container.append(fragment);
}
function makePathFromDrawOPS(data) {
	const path = new Path2D();
	if (!data) return path;
	for (let i = 0, ii = data.length; i < ii;) switch (data[i++]) {
		case DrawOPS.moveTo:
			path.moveTo(data[i++], data[i++]);
			break;
		case DrawOPS.lineTo:
			path.lineTo(data[i++], data[i++]);
			break;
		case DrawOPS.curveTo:
			path.bezierCurveTo(data[i++], data[i++], data[i++], data[i++], data[i++], data[i++]);
			break;
		case DrawOPS.quadraticCurveTo:
			path.quadraticCurveTo(data[i++], data[i++], data[i++], data[i++]);
			break;
		case DrawOPS.closePath:
			path.closePath();
			break;
		default:
			warn(`Unrecognized drawing path operator: ${data[i - 1]}`);
			break;
	}
	return path;
}
var _toolbar = /* @__PURE__ */ new WeakMap();
var _colorPicker = /* @__PURE__ */ new WeakMap();
var _editor = /* @__PURE__ */ new WeakMap();
var _buttons = /* @__PURE__ */ new WeakMap();
var _altText = /* @__PURE__ */ new WeakMap();
var _comment = /* @__PURE__ */ new WeakMap();
var _commentButtonDivider = /* @__PURE__ */ new WeakMap();
var _signatureDescriptionButton = /* @__PURE__ */ new WeakMap();
var _EditorToolbar_brand = /* @__PURE__ */ new WeakSet();
var EditorToolbar = class {
	constructor(editor) {
		_classPrivateMethodInitSpec(this, _EditorToolbar_brand);
		_classPrivateFieldInitSpec(this, _toolbar, null);
		_classPrivateFieldInitSpec(this, _colorPicker, null);
		_classPrivateFieldInitSpec(this, _editor, void 0);
		_classPrivateFieldInitSpec(this, _buttons, null);
		_classPrivateFieldInitSpec(this, _altText, null);
		_classPrivateFieldInitSpec(this, _comment, null);
		_classPrivateFieldInitSpec(this, _commentButtonDivider, null);
		_classPrivateFieldInitSpec(this, _signatureDescriptionButton, null);
		_classPrivateFieldSet2(_editor, this, editor);
		_l10nRemove._ || (_l10nRemove._ = Object.freeze({
			freetext: "pdfjs-editor-remove-freetext-button",
			highlight: "pdfjs-editor-remove-highlight-button",
			ink: "pdfjs-editor-remove-ink-button",
			stamp: "pdfjs-editor-remove-stamp-button",
			signature: "pdfjs-editor-remove-signature-button"
		}));
	}
	render() {
		const editToolbar = _classPrivateFieldSet2(_toolbar, this, document.createElement("div"));
		editToolbar.classList.add("editToolbar", "hidden");
		editToolbar.setAttribute("role", "toolbar");
		const signal = _classPrivateFieldGet2(_editor, this)._uiManager._signal;
		if (signal instanceof AbortSignal && !signal.aborted) {
			editToolbar.addEventListener("contextmenu", noContextMenu, { signal });
			editToolbar.addEventListener("pointerdown", _pointerDown, { signal });
		}
		const buttons = _classPrivateFieldSet2(_buttons, this, document.createElement("div"));
		buttons.className = "buttons";
		editToolbar.append(buttons);
		const position = _classPrivateFieldGet2(_editor, this).toolbarPosition;
		if (position) {
			const { style } = editToolbar;
			style.insetInlineEnd = `${100 * (_classPrivateFieldGet2(_editor, this)._uiManager.direction === "ltr" ? 1 - position[0] : position[0])}%`;
			style.top = `calc(${100 * position[1]}% + var(--editor-toolbar-vert-offset))`;
		}
		return editToolbar;
	}
	get div() {
		return _classPrivateFieldGet2(_toolbar, this);
	}
	hide() {
		_classPrivateFieldGet2(_toolbar, this).classList.add("hidden");
		_classPrivateFieldGet2(_colorPicker, this)?.hideDropdown();
	}
	show() {
		_classPrivateFieldGet2(_toolbar, this).classList.remove("hidden");
		_classPrivateFieldGet2(_altText, this)?.shown();
		_classPrivateFieldGet2(_comment, this)?.shown();
	}
	addDeleteButton() {
		const { editorType, _uiManager } = _classPrivateFieldGet2(_editor, this);
		const button = document.createElement("button");
		button.classList.add("basic", "deleteButton");
		button.tabIndex = 0;
		button.setAttribute("data-l10n-id", _l10nRemove._[editorType]);
		if (_assertClassBrand(_EditorToolbar_brand, this, _addListenersToElement).call(this, button)) button.addEventListener("click", (e) => {
			_uiManager.delete();
		}, { signal: _uiManager._signal });
		_classPrivateFieldGet2(_buttons, this).append(button);
	}
	async addAltText(altText) {
		const button = await altText.render();
		_assertClassBrand(_EditorToolbar_brand, this, _addListenersToElement).call(this, button);
		_classPrivateFieldGet2(_buttons, this).append(button, _get_divider.call(_assertClassBrand(_EditorToolbar_brand, this)));
		_classPrivateFieldSet2(_altText, this, altText);
	}
	addComment(comment, beforeElement = null) {
		if (_classPrivateFieldGet2(_comment, this)) return;
		const button = comment.renderForToolbar();
		if (!button) return;
		_assertClassBrand(_EditorToolbar_brand, this, _addListenersToElement).call(this, button);
		const divider = _classPrivateFieldSet2(_commentButtonDivider, this, _get_divider.call(_assertClassBrand(_EditorToolbar_brand, this)));
		if (!beforeElement) _classPrivateFieldGet2(_buttons, this).append(button, divider);
		else {
			_classPrivateFieldGet2(_buttons, this).insertBefore(button, beforeElement);
			_classPrivateFieldGet2(_buttons, this).insertBefore(divider, beforeElement);
		}
		_classPrivateFieldSet2(_comment, this, comment);
		comment.toolbar = this;
	}
	addColorPicker(colorPicker) {
		if (_classPrivateFieldGet2(_colorPicker, this)) return;
		_classPrivateFieldSet2(_colorPicker, this, colorPicker);
		const button = colorPicker.renderButton();
		_assertClassBrand(_EditorToolbar_brand, this, _addListenersToElement).call(this, button);
		_classPrivateFieldGet2(_buttons, this).append(button, _get_divider.call(_assertClassBrand(_EditorToolbar_brand, this)));
	}
	async addEditSignatureButton(signatureManager) {
		const button = _classPrivateFieldSet2(_signatureDescriptionButton, this, await signatureManager.renderEditButton(_classPrivateFieldGet2(_editor, this)));
		_assertClassBrand(_EditorToolbar_brand, this, _addListenersToElement).call(this, button);
		_classPrivateFieldGet2(_buttons, this).append(button, _get_divider.call(_assertClassBrand(_EditorToolbar_brand, this)));
	}
	removeButton(name) {
		switch (name) {
			case "comment":
				_classPrivateFieldGet2(_comment, this)?.removeToolbarCommentButton();
				_classPrivateFieldSet2(_comment, this, null);
				_classPrivateFieldGet2(_commentButtonDivider, this)?.remove();
				_classPrivateFieldSet2(_commentButtonDivider, this, null);
				break;
		}
	}
	async addButton(name, tool) {
		switch (name) {
			case "colorPicker":
				if (tool) this.addColorPicker(tool);
				break;
			case "altText":
				if (tool) await this.addAltText(tool);
				break;
			case "editSignature":
				if (tool) await this.addEditSignatureButton(tool);
				break;
			case "delete":
				this.addDeleteButton();
				break;
			case "comment":
				if (tool) this.addComment(tool);
				break;
		}
	}
	async addButtonBefore(name, tool, beforeSelector) {
		if (!tool && name === "comment") return;
		const beforeElement = _classPrivateFieldGet2(_buttons, this).querySelector(beforeSelector);
		if (!beforeElement) return;
		if (name === "comment") this.addComment(tool, beforeElement);
	}
	updateEditSignatureButton(description) {
		if (_classPrivateFieldGet2(_signatureDescriptionButton, this)) _classPrivateFieldGet2(_signatureDescriptionButton, this).title = description;
	}
	remove() {
		_classPrivateFieldGet2(_toolbar, this).remove();
		_classPrivateFieldGet2(_colorPicker, this)?.destroy();
		_classPrivateFieldSet2(_colorPicker, this, null);
	}
};
function _pointerDown(e) {
	e.stopPropagation();
}
function _focusIn(e) {
	_classPrivateFieldGet2(_editor, this)._focusEventsAllowed = false;
	stopEvent(e);
}
function _focusOut(e) {
	_classPrivateFieldGet2(_editor, this)._focusEventsAllowed = true;
	stopEvent(e);
}
function _addListenersToElement(element) {
	const signal = _classPrivateFieldGet2(_editor, this)._uiManager._signal;
	if (!(signal instanceof AbortSignal) || signal.aborted) return false;
	element.addEventListener("focusin", _assertClassBrand(_EditorToolbar_brand, this, _focusIn).bind(this), {
		capture: true,
		signal
	});
	element.addEventListener("focusout", _assertClassBrand(_EditorToolbar_brand, this, _focusOut).bind(this), {
		capture: true,
		signal
	});
	element.addEventListener("contextmenu", noContextMenu, { signal });
	return true;
}
function _get_divider() {
	const divider = document.createElement("div");
	divider.className = "divider";
	return divider;
}
var _l10nRemove = { _: null };
var _buttons2 = /* @__PURE__ */ new WeakMap();
var _toolbar2 = /* @__PURE__ */ new WeakMap();
var _uiManager2 = /* @__PURE__ */ new WeakMap();
var _FloatingToolbar_brand = /* @__PURE__ */ new WeakSet();
var FloatingToolbar = class {
	constructor(uiManager) {
		_classPrivateMethodInitSpec(this, _FloatingToolbar_brand);
		_classPrivateFieldInitSpec(this, _buttons2, null);
		_classPrivateFieldInitSpec(this, _toolbar2, null);
		_classPrivateFieldInitSpec(this, _uiManager2, void 0);
		_classPrivateFieldSet2(_uiManager2, this, uiManager);
	}
	show(parent, boxes, isLTR) {
		const [x, y] = _assertClassBrand(_FloatingToolbar_brand, this, _getLastPoint).call(this, boxes, isLTR);
		const { style } = _classPrivateFieldGet2(_toolbar2, this) || _classPrivateFieldSet2(_toolbar2, this, _assertClassBrand(_FloatingToolbar_brand, this, _render).call(this));
		parent.append(_classPrivateFieldGet2(_toolbar2, this));
		style.insetInlineEnd = `${100 * x}%`;
		style.top = `calc(${100 * y}% + var(--editor-toolbar-vert-offset))`;
	}
	hide() {
		_classPrivateFieldGet2(_toolbar2, this).remove();
	}
};
function _render() {
	const editToolbar = _classPrivateFieldSet2(_toolbar2, this, document.createElement("div"));
	editToolbar.className = "editToolbar";
	editToolbar.setAttribute("role", "toolbar");
	const signal = _classPrivateFieldGet2(_uiManager2, this)._signal;
	if (signal instanceof AbortSignal && !signal.aborted) editToolbar.addEventListener("contextmenu", noContextMenu, { signal });
	const buttons = _classPrivateFieldSet2(_buttons2, this, document.createElement("div"));
	buttons.className = "buttons";
	editToolbar.append(buttons);
	if (_classPrivateFieldGet2(_uiManager2, this).hasCommentManager()) _assertClassBrand(_FloatingToolbar_brand, this, _makeButton).call(this, "commentButton", `pdfjs-comment-floating-button`, "pdfjs-comment-floating-button-label", () => {
		_classPrivateFieldGet2(_uiManager2, this).commentSelection("floating_button");
	});
	_assertClassBrand(_FloatingToolbar_brand, this, _makeButton).call(this, "highlightButton", `pdfjs-highlight-floating-button1`, "pdfjs-highlight-floating-button-label", () => {
		_classPrivateFieldGet2(_uiManager2, this).highlightSelection("floating_button");
	});
	return editToolbar;
}
function _getLastPoint(boxes, isLTR) {
	let lastY = 0;
	let lastX = 0;
	for (const box of boxes) {
		const y = box.y + box.height;
		if (y < lastY) continue;
		const x = box.x + (isLTR ? box.width : 0);
		if (y > lastY) {
			lastX = x;
			lastY = y;
			continue;
		}
		if (isLTR) {
			if (x > lastX) lastX = x;
		} else if (x < lastX) lastX = x;
	}
	return [isLTR ? 1 - lastX : lastX, lastY];
}
function _makeButton(buttonClass, l10nId, labelL10nId, clickHandler) {
	const button = document.createElement("button");
	button.classList.add("basic", buttonClass);
	button.tabIndex = 0;
	button.setAttribute("data-l10n-id", l10nId);
	const span = document.createElement("span");
	button.append(span);
	span.className = "visuallyHidden";
	span.setAttribute("data-l10n-id", labelL10nId);
	const signal = _classPrivateFieldGet2(_uiManager2, this)._signal;
	if (signal instanceof AbortSignal && !signal.aborted) {
		button.addEventListener("contextmenu", noContextMenu, { signal });
		button.addEventListener("click", clickHandler, { signal });
	}
	_classPrivateFieldGet2(_buttons2, this).append(button);
}
function bindEvents(obj, element, names) {
	for (const name of names) element.addEventListener(name, obj[name].bind(obj));
}
var CurrentPointers = class CurrentPointers {
	static initializeAndAddPointerId(pointerId) {
		(_pointerIds._ || (_pointerIds._ = /* @__PURE__ */ new Set())).add(pointerId);
	}
	static setPointer(pointerType, pointerId) {
		_pointerId._ || (_pointerId._ = pointerId);
		_pointerType._ ?? (_pointerType._ = pointerType);
	}
	static setTimeStamp(timeStamp) {
		_moveTimestamp._ = timeStamp;
	}
	static isSamePointerId(pointerId) {
		return _pointerId._ === pointerId;
	}
	static isSamePointerIdOrRemove(pointerId) {
		if (_pointerId._ === pointerId) return true;
		_pointerIds._?.delete(pointerId);
		return false;
	}
	static isSamePointerType(pointerType) {
		return _pointerType._ === pointerType;
	}
	static isInitializedAndDifferentPointerType(pointerType) {
		return _pointerType._ !== null && !CurrentPointers.isSamePointerType(pointerType);
	}
	static isSameTimeStamp(timeStamp) {
		return _moveTimestamp._ === timeStamp;
	}
	static isUsingMultiplePointers() {
		return _pointerIds._?.size >= 1;
	}
	static clearPointerType() {
		_pointerType._ = null;
	}
	static clearPointerIds() {
		_pointerId._ = NaN;
		_pointerIds._ = null;
	}
	static clearTimeStamp() {
		_moveTimestamp._ = NaN;
	}
};
var _pointerId = { _: NaN };
var _pointerIds = { _: null };
var _moveTimestamp = { _: NaN };
var _pointerType = { _: null };
var _id = /* @__PURE__ */ new WeakMap();
var IdManager = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _id, 0);
	}
	get id() {
		var _this$id, _this$id2;
		return `${AnnotationEditorPrefix}${_classPrivateFieldSet2(_id, this, (_this$id = _classPrivateFieldGet2(_id, this), _this$id2 = _this$id++, _this$id)), _this$id2}`;
	}
};
var _baseId = /* @__PURE__ */ new WeakMap();
var _id2 = /* @__PURE__ */ new WeakMap();
var _cache = /* @__PURE__ */ new WeakMap();
var _ImageManager_brand = /* @__PURE__ */ new WeakSet();
var ImageManager = class {
	constructor() {
		_classPrivateMethodInitSpec(this, _ImageManager_brand);
		_classPrivateFieldInitSpec(this, _baseId, getUuid());
		_classPrivateFieldInitSpec(this, _id2, 0);
		_classPrivateFieldInitSpec(this, _cache, null);
	}
	static get _isSVGFittingCanvas() {
		const svg = `data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 1 1" width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" style="fill:red;"/></svg>`;
		const ctx = new OffscreenCanvas(1, 3).getContext("2d", { willReadFrequently: true });
		const image = new Image();
		image.src = svg;
		const promise = image.decode().then(() => {
			ctx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 3);
			return new Uint32Array(ctx.getImageData(0, 0, 1, 1).data.buffer)[0] === 0;
		});
		return shadow(this, "_isSVGFittingCanvas", promise);
	}
	async getFromFile(file) {
		const { lastModified, name, size, type } = file;
		return _assertClassBrand(_ImageManager_brand, this, _get).call(this, `${lastModified}_${name}_${size}_${type}`, file);
	}
	async getFromUrl(url) {
		return _assertClassBrand(_ImageManager_brand, this, _get).call(this, url, url);
	}
	async getFromBlob(id, blobPromise) {
		const blob = await blobPromise;
		return _assertClassBrand(_ImageManager_brand, this, _get).call(this, id, blob);
	}
	async getFromId(id) {
		_classPrivateFieldGet2(_cache, this) || _classPrivateFieldSet2(_cache, this, /* @__PURE__ */ new Map());
		const data = _classPrivateFieldGet2(_cache, this).get(id);
		if (!data) return null;
		if (data.bitmap) {
			data.refCounter += 1;
			return data;
		}
		if (data.file) return this.getFromFile(data.file);
		if (data.blobPromise) {
			const { blobPromise } = data;
			delete data.blobPromise;
			return this.getFromBlob(data.id, blobPromise);
		}
		return this.getFromUrl(data.url);
	}
	getFromCanvas(id, canvas) {
		var _this$id5, _this$id6;
		_classPrivateFieldGet2(_cache, this) || _classPrivateFieldSet2(_cache, this, /* @__PURE__ */ new Map());
		let data = _classPrivateFieldGet2(_cache, this).get(id);
		if (data?.bitmap) {
			data.refCounter += 1;
			return data;
		}
		const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
		offscreen.getContext("2d").drawImage(canvas, 0, 0);
		data = {
			bitmap: offscreen.transferToImageBitmap(),
			id: `image_${_classPrivateFieldGet2(_baseId, this)}_${_classPrivateFieldSet2(_id2, this, (_this$id5 = _classPrivateFieldGet2(_id2, this), _this$id6 = _this$id5++, _this$id5)), _this$id6}`,
			refCounter: 1,
			isSvg: false
		};
		_classPrivateFieldGet2(_cache, this).set(id, data);
		_classPrivateFieldGet2(_cache, this).set(data.id, data);
		return data;
	}
	getSvgUrl(id) {
		const data = _classPrivateFieldGet2(_cache, this).get(id);
		if (!data?.isSvg) return null;
		return data.svgUrl;
	}
	deleteId(id) {
		_classPrivateFieldGet2(_cache, this) || _classPrivateFieldSet2(_cache, this, /* @__PURE__ */ new Map());
		const data = _classPrivateFieldGet2(_cache, this).get(id);
		if (!data) return;
		data.refCounter -= 1;
		if (data.refCounter !== 0) return;
		const { bitmap } = data;
		if (!data.url && !data.file) {
			const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
			canvas.getContext("bitmaprenderer").transferFromImageBitmap(bitmap);
			data.blobPromise = canvas.convertToBlob();
		}
		bitmap.close?.();
		data.bitmap = null;
	}
	isValidId(id) {
		return id.startsWith(`image_${_classPrivateFieldGet2(_baseId, this)}_`);
	}
};
_ImageManager = ImageManager;
async function _get(key, rawData) {
	_classPrivateFieldGet2(_cache, this) || _classPrivateFieldSet2(_cache, this, /* @__PURE__ */ new Map());
	let data = _classPrivateFieldGet2(_cache, this).get(key);
	if (data === null) return null;
	if (data?.bitmap) {
		data.refCounter += 1;
		return data;
	}
	try {
		var _this$id3, _this$id4;
		data || (data = {
			bitmap: null,
			id: `image_${_classPrivateFieldGet2(_baseId, this)}_${_classPrivateFieldSet2(_id2, this, (_this$id3 = _classPrivateFieldGet2(_id2, this), _this$id4 = _this$id3++, _this$id3)), _this$id4}`,
			refCounter: 0,
			isSvg: false
		});
		let image;
		if (typeof rawData === "string") {
			data.url = rawData;
			image = await fetchData(rawData, "blob");
		} else if (rawData instanceof File) image = data.file = rawData;
		else if (rawData instanceof Blob) image = rawData;
		if (image.type === "image/svg+xml") {
			const mustRemoveAspectRatioPromise = _ImageManager._isSVGFittingCanvas;
			const fileReader = new FileReader();
			const imageElement = new Image();
			const imagePromise = new Promise((resolve, reject) => {
				imageElement.onload = () => {
					data.bitmap = imageElement;
					data.isSvg = true;
					resolve();
				};
				fileReader.onload = async () => {
					const url = data.svgUrl = fileReader.result;
					imageElement.src = await mustRemoveAspectRatioPromise ? `${url}#svgView(preserveAspectRatio(none))` : url;
				};
				imageElement.onerror = fileReader.onerror = reject;
			});
			fileReader.readAsDataURL(image);
			await imagePromise;
		} else data.bitmap = await createImageBitmap(image);
		data.refCounter = 1;
	} catch (e) {
		warn(e);
		data = null;
	}
	_classPrivateFieldGet2(_cache, this).set(key, data);
	if (data) _classPrivateFieldGet2(_cache, this).set(data.id, data);
	return data;
}
var _commands = /* @__PURE__ */ new WeakMap();
var _locked = /* @__PURE__ */ new WeakMap();
var _maxSize = /* @__PURE__ */ new WeakMap();
var _position = /* @__PURE__ */ new WeakMap();
var CommandManager = class {
	constructor(maxSize = 128) {
		_classPrivateFieldInitSpec(this, _commands, []);
		_classPrivateFieldInitSpec(this, _locked, false);
		_classPrivateFieldInitSpec(this, _maxSize, void 0);
		_classPrivateFieldInitSpec(this, _position, -1);
		_classPrivateFieldSet2(_maxSize, this, maxSize);
	}
	add({ cmd, undo, post, mustExec, type = NaN, overwriteIfSameType = false, keepUndo = false }) {
		if (mustExec) cmd();
		if (_classPrivateFieldGet2(_locked, this)) return;
		const save = {
			cmd,
			undo,
			post,
			type
		};
		if (_classPrivateFieldGet2(_position, this) === -1) {
			if (_classPrivateFieldGet2(_commands, this).length > 0) _classPrivateFieldGet2(_commands, this).length = 0;
			_classPrivateFieldSet2(_position, this, 0);
			_classPrivateFieldGet2(_commands, this).push(save);
			return;
		}
		if (overwriteIfSameType && _classPrivateFieldGet2(_commands, this)[_classPrivateFieldGet2(_position, this)].type === type) {
			if (keepUndo) save.undo = _classPrivateFieldGet2(_commands, this)[_classPrivateFieldGet2(_position, this)].undo;
			_classPrivateFieldGet2(_commands, this)[_classPrivateFieldGet2(_position, this)] = save;
			return;
		}
		const next = _classPrivateFieldGet2(_position, this) + 1;
		if (next === _classPrivateFieldGet2(_maxSize, this)) _classPrivateFieldGet2(_commands, this).splice(0, 1);
		else {
			_classPrivateFieldSet2(_position, this, next);
			if (next < _classPrivateFieldGet2(_commands, this).length) _classPrivateFieldGet2(_commands, this).splice(next);
		}
		_classPrivateFieldGet2(_commands, this).push(save);
	}
	undo() {
		if (_classPrivateFieldGet2(_position, this) === -1) return;
		_classPrivateFieldSet2(_locked, this, true);
		const { undo, post } = _classPrivateFieldGet2(_commands, this)[_classPrivateFieldGet2(_position, this)];
		undo();
		post?.();
		_classPrivateFieldSet2(_locked, this, false);
		_classPrivateFieldSet2(_position, this, _classPrivateFieldGet2(_position, this) - 1);
	}
	redo() {
		if (_classPrivateFieldGet2(_position, this) < _classPrivateFieldGet2(_commands, this).length - 1) {
			_classPrivateFieldSet2(_position, this, _classPrivateFieldGet2(_position, this) + 1);
			_classPrivateFieldSet2(_locked, this, true);
			const { cmd, post } = _classPrivateFieldGet2(_commands, this)[_classPrivateFieldGet2(_position, this)];
			cmd();
			post?.();
			_classPrivateFieldSet2(_locked, this, false);
		}
	}
	hasSomethingToUndo() {
		return _classPrivateFieldGet2(_position, this) !== -1;
	}
	hasSomethingToRedo() {
		return _classPrivateFieldGet2(_position, this) < _classPrivateFieldGet2(_commands, this).length - 1;
	}
	cleanType(type) {
		if (_classPrivateFieldGet2(_position, this) === -1) return;
		for (let i = _classPrivateFieldGet2(_position, this); i >= 0; i--) if (_classPrivateFieldGet2(_commands, this)[i].type !== type) {
			_classPrivateFieldGet2(_commands, this).splice(i + 1, _classPrivateFieldGet2(_position, this) - i);
			_classPrivateFieldSet2(_position, this, i);
			return;
		}
		_classPrivateFieldGet2(_commands, this).length = 0;
		_classPrivateFieldSet2(_position, this, -1);
	}
	destroy() {
		_classPrivateFieldSet2(_commands, this, null);
	}
};
var _KeyboardManager_brand = /* @__PURE__ */ new WeakSet();
var KeyboardManager = class {
	constructor(callbacks) {
		_classPrivateMethodInitSpec(this, _KeyboardManager_brand);
		this.buffer = [];
		this.callbacks = /* @__PURE__ */ new Map();
		this.allKeys = /* @__PURE__ */ new Set();
		const { isMac } = FeatureTest.platform;
		for (const [keys, callback, options = {}] of callbacks) for (const key of keys) {
			const isMacKey = key.startsWith("mac+");
			if (isMac && isMacKey) {
				this.callbacks.set(key.slice(4), {
					callback,
					options
				});
				this.allKeys.add(key.split("+").at(-1));
			} else if (!isMac && !isMacKey) {
				this.callbacks.set(key, {
					callback,
					options
				});
				this.allKeys.add(key.split("+").at(-1));
			}
		}
	}
	exec(self, event) {
		if (!this.allKeys.has(event.key)) return;
		const info = this.callbacks.get(_assertClassBrand(_KeyboardManager_brand, this, _serialize).call(this, event));
		if (!info) return;
		const { callback, options: { bubbles = false, args = [], checker = null } } = info;
		if (checker && !checker(self, event)) return;
		callback.bind(self, ...args, event)();
		if (!bubbles) stopEvent(event);
	}
};
function _serialize(event) {
	if (event.altKey) this.buffer.push("alt");
	if (event.ctrlKey) this.buffer.push("ctrl");
	if (event.metaKey) this.buffer.push("meta");
	if (event.shiftKey) this.buffer.push("shift");
	this.buffer.push(event.key);
	const str = this.buffer.join("+");
	this.buffer.length = 0;
	return str;
}
var ColorManager = class ColorManager {
	get _colors() {
		const colors = /* @__PURE__ */ new Map([["CanvasText", null], ["Canvas", null]]);
		getColorValues(colors);
		return shadow(this, "_colors", colors);
	}
	convert(color) {
		const rgb = getRGB(color);
		if (!window.matchMedia("(forced-colors: active)").matches) return rgb;
		for (const [name, RGB] of this._colors) if (RGB.every((x, i) => x === rgb[i])) return ColorManager._colorsMapping.get(name);
		return rgb;
	}
	getHexCode(name) {
		const rgb = this._colors.get(name);
		if (!rgb) return name;
		return Util.makeHexColor(...rgb);
	}
};
_defineProperty(ColorManager, "_colorsMapping", /* @__PURE__ */ new Map([["CanvasText", [
	0,
	0,
	0
]], ["Canvas", [
	255,
	255,
	255
]]]));
var _abortController = /* @__PURE__ */ new WeakMap();
var _activeEditor = /* @__PURE__ */ new WeakMap();
var _allEditableAnnotations = /* @__PURE__ */ new WeakMap();
var _allEditors = /* @__PURE__ */ new WeakMap();
var _allLayers = /* @__PURE__ */ new WeakMap();
var _savedAllLayers = /* @__PURE__ */ new WeakMap();
var _altTextManager = /* @__PURE__ */ new WeakMap();
var _annotationStorage = /* @__PURE__ */ new WeakMap();
var _changedExistingAnnotations = /* @__PURE__ */ new WeakMap();
var _commandManager = /* @__PURE__ */ new WeakMap();
var _commentManager = /* @__PURE__ */ new WeakMap();
var _copyPasteAC = /* @__PURE__ */ new WeakMap();
var _currentDrawingSession = /* @__PURE__ */ new WeakMap();
var _currentPageIndex = /* @__PURE__ */ new WeakMap();
var _deletedAnnotationsElementIds = /* @__PURE__ */ new WeakMap();
var _draggingEditors = /* @__PURE__ */ new WeakMap();
var _editorTypes = /* @__PURE__ */ new WeakMap();
var _editorsToRescale = /* @__PURE__ */ new WeakMap();
var _enableHighlightFloatingButton = /* @__PURE__ */ new WeakMap();
var _enableUpdatedAddImage = /* @__PURE__ */ new WeakMap();
var _enableNewAltTextWhenAddingImage = /* @__PURE__ */ new WeakMap();
var _filterFactory = /* @__PURE__ */ new WeakMap();
var _focusMainContainerTimeoutId = /* @__PURE__ */ new WeakMap();
var _focusManagerAC = /* @__PURE__ */ new WeakMap();
var _highlightColors2 = /* @__PURE__ */ new WeakMap();
var _highlightWhenShiftUp = /* @__PURE__ */ new WeakMap();
var _floatingToolbar = /* @__PURE__ */ new WeakMap();
var _idManager = /* @__PURE__ */ new WeakMap();
var _isEnabled = /* @__PURE__ */ new WeakMap();
var _isPointerDown = /* @__PURE__ */ new WeakMap();
var _isWaiting = /* @__PURE__ */ new WeakMap();
var _keyboardManagerAC = /* @__PURE__ */ new WeakMap();
var _lastActiveElement = /* @__PURE__ */ new WeakMap();
var _mainHighlightColorPicker = /* @__PURE__ */ new WeakMap();
var _missingCanvases = /* @__PURE__ */ new WeakMap();
var _mlManager = /* @__PURE__ */ new WeakMap();
var _mode = /* @__PURE__ */ new WeakMap();
var _selectedEditors = /* @__PURE__ */ new WeakMap();
var _selectedTextNode = /* @__PURE__ */ new WeakMap();
var _signatureManager = /* @__PURE__ */ new WeakMap();
var _pageColors = /* @__PURE__ */ new WeakMap();
var _showAllStates = /* @__PURE__ */ new WeakMap();
var _pdfDocument = /* @__PURE__ */ new WeakMap();
var _previousStates = /* @__PURE__ */ new WeakMap();
var _translation = /* @__PURE__ */ new WeakMap();
var _translationTimeoutId = /* @__PURE__ */ new WeakMap();
var _container = /* @__PURE__ */ new WeakMap();
var _viewer = /* @__PURE__ */ new WeakMap();
var _viewerAlert = /* @__PURE__ */ new WeakMap();
var _updateModeCapability = /* @__PURE__ */ new WeakMap();
var _AnnotationEditorUIManager_brand = /* @__PURE__ */ new WeakSet();
var AnnotationEditorUIManager = class AnnotationEditorUIManager {
	static get _keyboardManager() {
		const proto = AnnotationEditorUIManager.prototype;
		const arrowChecker = (self) => _classPrivateFieldGet2(_container, self).contains(document.activeElement) && document.activeElement.tagName !== "BUTTON" && self.hasSomethingToControl();
		const textInputChecker = (_self, { target: el }) => {
			if (el instanceof HTMLInputElement) {
				const { type } = el;
				return type !== "text" && type !== "number";
			}
			return true;
		};
		const small = this.TRANSLATE_SMALL;
		const big = this.TRANSLATE_BIG;
		return shadow(this, "_keyboardManager", new KeyboardManager([
			[
				["ctrl+a", "mac+meta+a"],
				proto.selectAll,
				{ checker: textInputChecker }
			],
			[
				["ctrl+z", "mac+meta+z"],
				proto.undo,
				{ checker: textInputChecker }
			],
			[
				[
					"ctrl+y",
					"ctrl+shift+z",
					"mac+meta+shift+z",
					"ctrl+shift+Z",
					"mac+meta+shift+Z"
				],
				proto.redo,
				{ checker: textInputChecker }
			],
			[
				[
					"Backspace",
					"alt+Backspace",
					"ctrl+Backspace",
					"shift+Backspace",
					"mac+Backspace",
					"mac+alt+Backspace",
					"mac+ctrl+Backspace",
					"Delete",
					"ctrl+Delete",
					"shift+Delete",
					"mac+Delete"
				],
				proto.delete,
				{ checker: textInputChecker }
			],
			[
				["Enter", "mac+Enter"],
				proto.addNewEditorFromKeyboard,
				{ checker: (self, { target: el }) => !(el instanceof HTMLButtonElement) && _classPrivateFieldGet2(_container, self).contains(el) && !self.isEnterHandled }
			],
			[
				[" ", "mac+ "],
				proto.addNewEditorFromKeyboard,
				{ checker: (self, { target: el }) => !(el instanceof HTMLButtonElement) && _classPrivateFieldGet2(_container, self).contains(document.activeElement) }
			],
			[["Escape", "mac+Escape"], proto.unselectAll],
			[
				["ArrowLeft", "mac+ArrowLeft"],
				proto.translateSelectedEditors,
				{
					args: [-small, 0],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowLeft", "mac+shift+ArrowLeft"],
				proto.translateSelectedEditors,
				{
					args: [-big, 0],
					checker: arrowChecker
				}
			],
			[
				["ArrowRight", "mac+ArrowRight"],
				proto.translateSelectedEditors,
				{
					args: [small, 0],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowRight", "mac+shift+ArrowRight"],
				proto.translateSelectedEditors,
				{
					args: [big, 0],
					checker: arrowChecker
				}
			],
			[
				["ArrowUp", "mac+ArrowUp"],
				proto.translateSelectedEditors,
				{
					args: [0, -small],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowUp", "mac+shift+ArrowUp"],
				proto.translateSelectedEditors,
				{
					args: [0, -big],
					checker: arrowChecker
				}
			],
			[
				["ArrowDown", "mac+ArrowDown"],
				proto.translateSelectedEditors,
				{
					args: [0, small],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowDown", "mac+shift+ArrowDown"],
				proto.translateSelectedEditors,
				{
					args: [0, big],
					checker: arrowChecker
				}
			]
		]));
	}
	constructor(container, viewer, viewerAlert, altTextManager, commentManager, signatureManager, eventBus, pdfDocument, pageColors, highlightColors, enableHighlightFloatingButton, enableUpdatedAddImage, enableNewAltTextWhenAddingImage, mlManager, editorUndoBar, supportsPinchToZoom) {
		_classPrivateMethodInitSpec(this, _AnnotationEditorUIManager_brand);
		_classPrivateFieldInitSpec(this, _abortController, new AbortController());
		_classPrivateFieldInitSpec(this, _activeEditor, null);
		_classPrivateFieldInitSpec(this, _allEditableAnnotations, null);
		_classPrivateFieldInitSpec(this, _allEditors, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _allLayers, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _savedAllLayers, null);
		_classPrivateFieldInitSpec(this, _altTextManager, null);
		_classPrivateFieldInitSpec(this, _annotationStorage, null);
		_classPrivateFieldInitSpec(this, _changedExistingAnnotations, null);
		_classPrivateFieldInitSpec(this, _commandManager, new CommandManager());
		_classPrivateFieldInitSpec(this, _commentManager, null);
		_classPrivateFieldInitSpec(this, _copyPasteAC, null);
		_classPrivateFieldInitSpec(this, _currentDrawingSession, null);
		_classPrivateFieldInitSpec(this, _currentPageIndex, 0);
		_classPrivateFieldInitSpec(this, _deletedAnnotationsElementIds, /* @__PURE__ */ new Set());
		_classPrivateFieldInitSpec(this, _draggingEditors, null);
		_classPrivateFieldInitSpec(this, _editorTypes, null);
		_classPrivateFieldInitSpec(this, _editorsToRescale, /* @__PURE__ */ new Set());
		_defineProperty(this, "_editorUndoBar", null);
		_classPrivateFieldInitSpec(this, _enableHighlightFloatingButton, false);
		_classPrivateFieldInitSpec(this, _enableUpdatedAddImage, false);
		_classPrivateFieldInitSpec(this, _enableNewAltTextWhenAddingImage, false);
		_classPrivateFieldInitSpec(this, _filterFactory, null);
		_classPrivateFieldInitSpec(this, _focusMainContainerTimeoutId, null);
		_classPrivateFieldInitSpec(this, _focusManagerAC, null);
		_classPrivateFieldInitSpec(this, _highlightColors2, null);
		_classPrivateFieldInitSpec(this, _highlightWhenShiftUp, false);
		_classPrivateFieldInitSpec(this, _floatingToolbar, null);
		_classPrivateFieldInitSpec(this, _idManager, new IdManager());
		_classPrivateFieldInitSpec(this, _isEnabled, false);
		_classPrivateFieldInitSpec(this, _isPointerDown, false);
		_classPrivateFieldInitSpec(this, _isWaiting, false);
		_classPrivateFieldInitSpec(this, _keyboardManagerAC, null);
		_classPrivateFieldInitSpec(this, _lastActiveElement, null);
		_classPrivateFieldInitSpec(this, _mainHighlightColorPicker, null);
		_classPrivateFieldInitSpec(this, _missingCanvases, null);
		_classPrivateFieldInitSpec(this, _mlManager, null);
		_classPrivateFieldInitSpec(this, _mode, AnnotationEditorType.NONE);
		_classPrivateFieldInitSpec(this, _selectedEditors, /* @__PURE__ */ new Set());
		_classPrivateFieldInitSpec(this, _selectedTextNode, null);
		_classPrivateFieldInitSpec(this, _signatureManager, null);
		_classPrivateFieldInitSpec(this, _pageColors, null);
		_classPrivateFieldInitSpec(this, _showAllStates, null);
		_classPrivateFieldInitSpec(this, _pdfDocument, null);
		_classPrivateFieldInitSpec(this, _previousStates, {
			isEditing: false,
			isEmpty: true,
			hasSomethingToUndo: false,
			hasSomethingToRedo: false,
			hasSelectedEditor: false,
			hasSelectedText: false
		});
		_classPrivateFieldInitSpec(this, _translation, [0, 0]);
		_classPrivateFieldInitSpec(this, _translationTimeoutId, null);
		_classPrivateFieldInitSpec(this, _container, null);
		_classPrivateFieldInitSpec(this, _viewer, null);
		_classPrivateFieldInitSpec(this, _viewerAlert, null);
		_classPrivateFieldInitSpec(this, _updateModeCapability, null);
		const signal = this._signal = _classPrivateFieldGet2(_abortController, this).signal;
		_classPrivateFieldSet2(_container, this, container);
		_classPrivateFieldSet2(_viewer, this, viewer);
		_classPrivateFieldSet2(_viewerAlert, this, viewerAlert);
		_classPrivateFieldSet2(_altTextManager, this, altTextManager);
		_classPrivateFieldSet2(_commentManager, this, commentManager);
		_classPrivateFieldSet2(_signatureManager, this, signatureManager);
		_classPrivateFieldSet2(_pdfDocument, this, pdfDocument);
		this._eventBus = eventBus;
		eventBus._on("editingaction", this.onEditingAction.bind(this), { signal });
		eventBus._on("pagechanging", this.onPageChanging.bind(this), { signal });
		eventBus._on("scalechanging", this.onScaleChanging.bind(this), { signal });
		eventBus._on("rotationchanging", this.onRotationChanging.bind(this), { signal });
		eventBus._on("setpreference", this.onSetPreference.bind(this), { signal });
		eventBus._on("switchannotationeditorparams", (evt) => this.updateParams(evt.type, evt.value), { signal });
		window.addEventListener("pointerdown", () => {
			_classPrivateFieldSet2(_isPointerDown, this, true);
		}, {
			capture: true,
			signal
		});
		window.addEventListener("pointerup", () => {
			_classPrivateFieldSet2(_isPointerDown, this, false);
		}, {
			capture: true,
			signal
		});
		window.addEventListener("beforeunload", _assertClassBrand(_AnnotationEditorUIManager_brand, this, _beforeUnload).bind(this), {
			capture: true,
			signal
		});
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addSelectionListener).call(this);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addDragAndDropListeners).call(this);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addKeyboardManager).call(this);
		_classPrivateFieldSet2(_annotationStorage, this, pdfDocument.annotationStorage);
		_classPrivateFieldSet2(_filterFactory, this, pdfDocument.filterFactory);
		_classPrivateFieldSet2(_pageColors, this, pageColors);
		_classPrivateFieldSet2(_highlightColors2, this, highlightColors || null);
		_classPrivateFieldSet2(_enableHighlightFloatingButton, this, enableHighlightFloatingButton);
		_classPrivateFieldSet2(_enableUpdatedAddImage, this, enableUpdatedAddImage);
		_classPrivateFieldSet2(_enableNewAltTextWhenAddingImage, this, enableNewAltTextWhenAddingImage);
		_classPrivateFieldSet2(_mlManager, this, mlManager || null);
		this.viewParameters = {
			realScale: PixelsPerInch.PDF_TO_CSS_UNITS,
			rotation: 0
		};
		this.isShiftKeyDown = false;
		this._editorUndoBar = editorUndoBar || null;
		this._supportsPinchToZoom = supportsPinchToZoom !== false;
		commentManager?.setSidebarUiManager(this);
	}
	destroy() {
		_classPrivateFieldGet2(_updateModeCapability, this)?.resolve();
		_classPrivateFieldSet2(_updateModeCapability, this, null);
		_classPrivateFieldGet2(_abortController, this)?.abort();
		_classPrivateFieldSet2(_abortController, this, null);
		this._signal = null;
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) layer.destroy();
		_classPrivateFieldGet2(_allLayers, this).clear();
		_classPrivateFieldGet2(_allEditors, this).clear();
		_classPrivateFieldGet2(_editorsToRescale, this).clear();
		_classPrivateFieldGet2(_missingCanvases, this)?.clear();
		_classPrivateFieldSet2(_activeEditor, this, null);
		_classPrivateFieldGet2(_selectedEditors, this).clear();
		_classPrivateFieldGet2(_commandManager, this).destroy();
		_classPrivateFieldGet2(_altTextManager, this)?.destroy();
		_classPrivateFieldGet2(_commentManager, this)?.destroy();
		_classPrivateFieldGet2(_signatureManager, this)?.destroy();
		_classPrivateFieldGet2(_floatingToolbar, this)?.hide();
		_classPrivateFieldSet2(_floatingToolbar, this, null);
		_classPrivateFieldGet2(_mainHighlightColorPicker, this)?.destroy();
		_classPrivateFieldSet2(_mainHighlightColorPicker, this, null);
		_classPrivateFieldSet2(_allEditableAnnotations, this, null);
		if (_classPrivateFieldGet2(_focusMainContainerTimeoutId, this)) {
			clearTimeout(_classPrivateFieldGet2(_focusMainContainerTimeoutId, this));
			_classPrivateFieldSet2(_focusMainContainerTimeoutId, this, null);
		}
		if (_classPrivateFieldGet2(_translationTimeoutId, this)) {
			clearTimeout(_classPrivateFieldGet2(_translationTimeoutId, this));
			_classPrivateFieldSet2(_translationTimeoutId, this, null);
		}
		this._editorUndoBar?.destroy();
		_classPrivateFieldSet2(_pdfDocument, this, null);
	}
	combinedSignal(ac) {
		return AbortSignal.any([this._signal, ac.signal]);
	}
	get mlManager() {
		return _classPrivateFieldGet2(_mlManager, this);
	}
	get useNewAltTextFlow() {
		return _classPrivateFieldGet2(_enableUpdatedAddImage, this);
	}
	get useNewAltTextWhenAddingImage() {
		return _classPrivateFieldGet2(_enableNewAltTextWhenAddingImage, this);
	}
	get hcmFilter() {
		return shadow(this, "hcmFilter", _classPrivateFieldGet2(_pageColors, this) ? _classPrivateFieldGet2(_filterFactory, this).addHCMFilter(_classPrivateFieldGet2(_pageColors, this).foreground, _classPrivateFieldGet2(_pageColors, this).background) : "none");
	}
	get direction() {
		return shadow(this, "direction", getComputedStyle(_classPrivateFieldGet2(_container, this)).direction);
	}
	get _highlightColors() {
		return shadow(this, "_highlightColors", _classPrivateFieldGet2(_highlightColors2, this) ? new Map(_classPrivateFieldGet2(_highlightColors2, this).split(",").map((pair) => {
			pair = pair.split("=").map((x) => x.trim());
			pair[1] = pair[1].toUpperCase();
			return pair;
		})) : null);
	}
	get highlightColors() {
		const { _highlightColors } = this;
		if (!_highlightColors) return shadow(this, "highlightColors", null);
		const map = /* @__PURE__ */ new Map();
		const hasHCM = !!_classPrivateFieldGet2(_pageColors, this);
		for (const [name, color] of _highlightColors) {
			const isNameForHCM = name.endsWith("_HCM");
			if (hasHCM && isNameForHCM) {
				map.set(name.replace("_HCM", ""), color);
				continue;
			}
			if (!hasHCM && !isNameForHCM) map.set(name, color);
		}
		return shadow(this, "highlightColors", map);
	}
	get highlightColorNames() {
		return shadow(this, "highlightColorNames", this.highlightColors ? new Map(Array.from(this.highlightColors, (e) => e.reverse())) : null);
	}
	getNonHCMColor(color) {
		if (!this._highlightColors) return color;
		const colorName = this.highlightColorNames.get(color);
		return this._highlightColors.get(colorName) || color;
	}
	getNonHCMColorName(color) {
		return this.highlightColorNames.get(color) || color;
	}
	setCurrentDrawingSession(layer) {
		if (layer) {
			this.unselectAll();
			this.disableUserSelect(true);
		} else this.disableUserSelect(false);
		_classPrivateFieldSet2(_currentDrawingSession, this, layer);
	}
	setMainHighlightColorPicker(colorPicker) {
		_classPrivateFieldSet2(_mainHighlightColorPicker, this, colorPicker);
	}
	editAltText(editor, firstTime = false) {
		_classPrivateFieldGet2(_altTextManager, this)?.editAltText(this, editor, firstTime);
	}
	hasCommentManager() {
		return !!_classPrivateFieldGet2(_commentManager, this);
	}
	editComment(editor, posX, posY, options) {
		_classPrivateFieldGet2(_commentManager, this)?.showDialog(this, editor, posX, posY, options);
	}
	selectComment(pageIndex, uid) {
		(_classPrivateFieldGet2(_allLayers, this).get(pageIndex)?.getEditorByUID(uid))?.toggleComment(true, true);
	}
	updateComment(editor) {
		_classPrivateFieldGet2(_commentManager, this)?.updateComment(editor.getData());
	}
	updatePopupColor(editor) {
		_classPrivateFieldGet2(_commentManager, this)?.updatePopupColor(editor);
	}
	removeComment(editor) {
		_classPrivateFieldGet2(_commentManager, this)?.removeComments([editor.uid]);
	}
	deleteComment(editor, savedData) {
		const undo = () => {
			editor.comment = savedData;
		};
		const cmd = () => {
			this._editorUndoBar?.show(undo, "comment");
			this.toggleComment(null);
			editor.comment = null;
		};
		this.addCommands({
			cmd,
			undo,
			mustExec: true
		});
	}
	toggleComment(editor, isSelected, visibility = void 0) {
		_classPrivateFieldGet2(_commentManager, this)?.toggleCommentPopup(editor, isSelected, visibility);
	}
	makeCommentColor(color, opacity) {
		return color && _classPrivateFieldGet2(_commentManager, this)?.makeCommentColor(color, opacity) || null;
	}
	getCommentDialogElement() {
		return _classPrivateFieldGet2(_commentManager, this)?.dialogElement || null;
	}
	async waitForEditorsRendered(pageNumber) {
		if (_classPrivateFieldGet2(_allLayers, this).has(pageNumber - 1)) return;
		const { resolve, promise } = Promise.withResolvers();
		const onEditorsRendered = (evt) => {
			if (evt.pageNumber === pageNumber) {
				this._eventBus._off("editorsrendered", onEditorsRendered);
				resolve();
			}
		};
		this._eventBus.on("editorsrendered", onEditorsRendered);
		await promise;
	}
	getSignature(editor) {
		_classPrivateFieldGet2(_signatureManager, this)?.getSignature({
			uiManager: this,
			editor
		});
	}
	get signatureManager() {
		return _classPrivateFieldGet2(_signatureManager, this);
	}
	switchToMode(mode, callback) {
		this._eventBus.on("annotationeditormodechanged", callback, {
			once: true,
			signal: this._signal
		});
		this._eventBus.dispatch("showannotationeditorui", {
			source: this,
			mode
		});
	}
	setPreference(name, value) {
		this._eventBus.dispatch("setpreference", {
			source: this,
			name,
			value
		});
	}
	onSetPreference({ name, value }) {
		switch (name) {
			case "enableNewAltTextWhenAddingImage":
				_classPrivateFieldSet2(_enableNewAltTextWhenAddingImage, this, value);
				break;
		}
	}
	onPageChanging({ pageNumber }) {
		_classPrivateFieldSet2(_currentPageIndex, this, pageNumber - 1);
	}
	deletePage(id) {
		for (const editor of this.getEditors(id)) editor.remove();
		_classPrivateFieldGet2(_allLayers, this).delete(id);
		if (_classPrivateFieldGet2(_currentPageIndex, this) === id) _classPrivateFieldSet2(_currentPageIndex, this, 0);
	}
	focusMainContainer() {
		_classPrivateFieldGet2(_container, this).focus();
	}
	findParent(x, y) {
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) {
			const { x: layerX, y: layerY, width, height } = layer.div.getBoundingClientRect();
			if (x >= layerX && x <= layerX + width && y >= layerY && y <= layerY + height) return layer;
		}
		return null;
	}
	disableUserSelect(value = false) {
		_classPrivateFieldGet2(_viewer, this).classList.toggle("noUserSelect", value);
	}
	addShouldRescale(editor) {
		_classPrivateFieldGet2(_editorsToRescale, this).add(editor);
	}
	removeShouldRescale(editor) {
		_classPrivateFieldGet2(_editorsToRescale, this).delete(editor);
	}
	onScaleChanging({ scale }) {
		this.commitOrRemove();
		this.viewParameters.realScale = scale * PixelsPerInch.PDF_TO_CSS_UNITS;
		for (const editor of _classPrivateFieldGet2(_editorsToRescale, this)) editor.onScaleChanging();
		_classPrivateFieldGet2(_currentDrawingSession, this)?.onScaleChanging();
	}
	onRotationChanging({ pagesRotation }) {
		this.commitOrRemove();
		this.viewParameters.rotation = pagesRotation;
	}
	highlightSelection(methodOfCreation = "", comment = false) {
		const selection = document.getSelection();
		if (!selection || selection.isCollapsed) return;
		const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
		const text = selection.toString();
		const textLayer = _assertClassBrand(_AnnotationEditorUIManager_brand, this, _getAnchorElementForSelection).call(this, selection).closest(".textLayer");
		const boxes = this.getSelectionBoxes(textLayer);
		if (!boxes) return;
		selection.empty();
		const layer = _assertClassBrand(_AnnotationEditorUIManager_brand, this, _getLayerForTextLayer).call(this, textLayer);
		const isNoneMode = _classPrivateFieldGet2(_mode, this) === AnnotationEditorType.NONE;
		const callback = () => {
			const editor = layer?.createAndAddNewEditor({
				x: 0,
				y: 0
			}, false, {
				methodOfCreation,
				boxes,
				anchorNode,
				anchorOffset,
				focusNode,
				focusOffset,
				text
			});
			if (isNoneMode) this.showAllEditors("highlight", true, true);
			if (comment) editor?.editComment();
		};
		if (isNoneMode) {
			this.switchToMode(AnnotationEditorType.HIGHLIGHT, callback);
			return;
		}
		callback();
	}
	commentSelection(methodOfCreation = "") {
		this.highlightSelection(methodOfCreation, true);
	}
	getAndRemoveDataFromAnnotationStorage(annotationId) {
		if (!_classPrivateFieldGet2(_annotationStorage, this)) return null;
		const key = `${AnnotationEditorPrefix}${annotationId}`;
		const storedValue = _classPrivateFieldGet2(_annotationStorage, this).getRawValue(key);
		if (storedValue) _classPrivateFieldGet2(_annotationStorage, this).remove(key);
		return storedValue;
	}
	addToAnnotationStorage(editor) {
		if (!editor.isEmpty() && _classPrivateFieldGet2(_annotationStorage, this) && !_classPrivateFieldGet2(_annotationStorage, this).has(editor.id)) _classPrivateFieldGet2(_annotationStorage, this).setValue(editor.id, editor);
	}
	a11yAlert(messageId, args = null) {
		const viewerAlert = _classPrivateFieldGet2(_viewerAlert, this);
		if (!viewerAlert) return;
		viewerAlert.setAttribute("data-l10n-id", messageId);
		if (args) viewerAlert.setAttribute("data-l10n-args", JSON.stringify(args));
		else viewerAlert.removeAttribute("data-l10n-args");
	}
	blur() {
		this.isShiftKeyDown = false;
		if (_classPrivateFieldGet2(_highlightWhenShiftUp, this)) {
			_classPrivateFieldSet2(_highlightWhenShiftUp, this, false);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _onSelectEnd).call(this, "main_toolbar");
		}
		if (!this.hasSelection) return;
		const { activeElement } = document;
		for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) if (editor.div.contains(activeElement)) {
			_classPrivateFieldSet2(_lastActiveElement, this, [editor, activeElement]);
			editor._focusEventsAllowed = false;
			break;
		}
	}
	focus() {
		if (!_classPrivateFieldGet2(_lastActiveElement, this)) return;
		const [lastEditor, lastActiveElement] = _classPrivateFieldGet2(_lastActiveElement, this);
		_classPrivateFieldSet2(_lastActiveElement, this, null);
		lastActiveElement.addEventListener("focusin", () => {
			lastEditor._focusEventsAllowed = true;
		}, {
			once: true,
			signal: this._signal
		});
		lastActiveElement.focus();
	}
	addEditListeners() {
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addKeyboardManager).call(this);
		this.setEditingState(true);
	}
	removeEditListeners() {
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _removeKeyboardManager).call(this);
		this.setEditingState(false);
	}
	dragOver(event) {
		for (const { type } of event.dataTransfer.items) for (const editorType of _classPrivateFieldGet2(_editorTypes, this)) if (editorType.isHandlingMimeForPasting(type)) {
			event.dataTransfer.dropEffect = "copy";
			event.preventDefault();
			return;
		}
	}
	drop(event) {
		for (const item of event.dataTransfer.items) for (const editorType of _classPrivateFieldGet2(_editorTypes, this)) if (editorType.isHandlingMimeForPasting(item.type)) {
			editorType.paste(item, this.currentLayer);
			event.preventDefault();
			return;
		}
	}
	copy(event) {
		event.preventDefault();
		_classPrivateFieldGet2(_activeEditor, this)?.commitOrRemove();
		if (!this.hasSelection) return;
		const editors = [];
		for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) {
			const serialized = editor.serialize(true);
			if (serialized) editors.push(serialized);
		}
		if (editors.length === 0) return;
		event.clipboardData.setData("application/pdfjs", JSON.stringify(editors));
	}
	cut(event) {
		this.copy(event);
		this.delete();
	}
	async paste(event) {
		event.preventDefault();
		const { clipboardData } = event;
		for (const item of clipboardData.items) for (const editorType of _classPrivateFieldGet2(_editorTypes, this)) if (editorType.isHandlingMimeForPasting(item.type)) {
			editorType.paste(item, this.currentLayer);
			return;
		}
		let data = clipboardData.getData("application/pdfjs");
		if (!data) return;
		try {
			data = JSON.parse(data);
		} catch (ex) {
			warn(`paste: "${ex.message}".`);
			return;
		}
		if (!Array.isArray(data)) return;
		this.unselectAll();
		const layer = this.currentLayer;
		try {
			const newEditors = [];
			for (const editor of data) {
				const deserializedEditor = await layer.deserialize(editor);
				if (!deserializedEditor) return;
				newEditors.push(deserializedEditor);
			}
			const cmd = () => {
				for (const editor of newEditors) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _addEditorToLayer).call(this, editor);
				_assertClassBrand(_AnnotationEditorUIManager_brand, this, _selectEditors).call(this, newEditors);
			};
			const undo = () => {
				for (const editor of newEditors) editor.remove();
			};
			this.addCommands({
				cmd,
				undo,
				mustExec: true
			});
		} catch (ex) {
			warn(`paste: "${ex.message}".`);
		}
	}
	keydown(event) {
		if (!this.isShiftKeyDown && event.key === "Shift") this.isShiftKeyDown = true;
		if (_classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.NONE && !this.isEditorHandlingKeyboard) AnnotationEditorUIManager._keyboardManager.exec(this, event);
	}
	keyup(event) {
		if (this.isShiftKeyDown && event.key === "Shift") {
			this.isShiftKeyDown = false;
			if (_classPrivateFieldGet2(_highlightWhenShiftUp, this)) {
				_classPrivateFieldSet2(_highlightWhenShiftUp, this, false);
				_assertClassBrand(_AnnotationEditorUIManager_brand, this, _onSelectEnd).call(this, "main_toolbar");
			}
		}
	}
	onEditingAction({ name }) {
		switch (name) {
			case "undo":
			case "redo":
			case "delete":
			case "selectAll":
				this[name]();
				break;
			case "highlightSelection":
				this.highlightSelection("context_menu");
				break;
			case "commentSelection":
				this.commentSelection("context_menu");
				break;
		}
	}
	updatePageIndex(oldPageIndex, newPageIndex) {
		for (const editor of this.getEditors(oldPageIndex)) editor.pageIndex = newPageIndex;
		const layer = _classPrivateFieldGet2(_savedAllLayers, this).get(oldPageIndex);
		if (layer) {
			layer.pageIndex = newPageIndex;
			_classPrivateFieldGet2(_allLayers, this).set(newPageIndex, layer);
			if (_classPrivateFieldGet2(_isEnabled, this)) layer.enable();
			else layer.disable();
		}
	}
	startUpdatePages() {
		_classPrivateFieldSet2(_savedAllLayers, this, new Map(_classPrivateFieldGet2(_allLayers, this)));
		_classPrivateFieldGet2(_allLayers, this).clear();
	}
	endUpdatePages() {
		_classPrivateFieldSet2(_savedAllLayers, this, null);
	}
	clonePage(pageIndex, newPageIndex) {
		for (const editor of this.getEditors(pageIndex)) {
			const serialized = editor.serialize(editor.mode !== AnnotationEditorType.HIGHLIGHT);
			if (!serialized) continue;
			serialized.pageIndex = newPageIndex;
			serialized.id = this.getId();
			serialized.isClone = true;
			delete serialized.popupRef;
			_classPrivateFieldGet2(_annotationStorage, this).setValue(serialized.id, serialized);
		}
	}
	findClonesForPage(layer) {
		const promises = [];
		const { pageIndex } = layer;
		for (const [id, editor] of _classPrivateFieldGet2(_annotationStorage, this)) if (editor.pageIndex === pageIndex && editor.isClone) {
			_classPrivateFieldGet2(_annotationStorage, this).remove(id);
			promises.push(layer.deserialize(editor).then((deserializedEditor) => {
				if (deserializedEditor) {
					deserializedEditor.isClone = true;
					layer.addOrRebuild(deserializedEditor);
				}
			}));
		}
		return Promise.all(promises);
	}
	setEditingState(isEditing) {
		if (isEditing) {
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addFocusManager).call(this);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _addCopyPasteListeners).call(this);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, {
				isEditing: _classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.NONE,
				isEmpty: _assertClassBrand(_AnnotationEditorUIManager_brand, this, _isEmpty).call(this),
				hasSomethingToUndo: _classPrivateFieldGet2(_commandManager, this).hasSomethingToUndo(),
				hasSomethingToRedo: _classPrivateFieldGet2(_commandManager, this).hasSomethingToRedo(),
				hasSelectedEditor: false
			});
		} else {
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _removeFocusManager).call(this);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _removeCopyPasteListeners).call(this);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { isEditing: false });
			this.disableUserSelect(false);
		}
	}
	registerEditorTypes(types) {
		if (_classPrivateFieldGet2(_editorTypes, this)) return;
		_classPrivateFieldSet2(_editorTypes, this, types);
		for (const editorType of _classPrivateFieldGet2(_editorTypes, this)) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editorType.defaultPropertiesToUpdate);
	}
	getId() {
		return _classPrivateFieldGet2(_idManager, this).id;
	}
	get currentLayer() {
		return _classPrivateFieldGet2(_allLayers, this).get(_classPrivateFieldGet2(_currentPageIndex, this));
	}
	getLayer(pageIndex) {
		return _classPrivateFieldGet2(_allLayers, this).get(pageIndex);
	}
	get currentPageIndex() {
		return _classPrivateFieldGet2(_currentPageIndex, this);
	}
	addLayer(layer) {
		_classPrivateFieldGet2(_allLayers, this).set(layer.pageIndex, layer);
		if (_classPrivateFieldGet2(_isEnabled, this)) layer.enable();
		else layer.disable();
	}
	removeLayer(layer) {
		_classPrivateFieldGet2(_allLayers, this).delete(layer.pageIndex);
	}
	async updateMode(mode, editId = null, isFromUser = false, isFromKeyboard = false, mustEnterInEditMode = false, editComment = false) {
		if (_classPrivateFieldGet2(_mode, this) === mode) return;
		if (_classPrivateFieldGet2(_updateModeCapability, this)) {
			await _classPrivateFieldGet2(_updateModeCapability, this).promise;
			if (!_classPrivateFieldGet2(_updateModeCapability, this)) return;
		}
		_classPrivateFieldSet2(_updateModeCapability, this, Promise.withResolvers());
		_classPrivateFieldGet2(_currentDrawingSession, this)?.commitOrRemove();
		if (_classPrivateFieldGet2(_mode, this) === AnnotationEditorType.POPUP) _classPrivateFieldGet2(_commentManager, this)?.hideSidebar();
		_classPrivateFieldGet2(_commentManager, this)?.destroyPopup();
		_classPrivateFieldSet2(_mode, this, mode);
		if (mode === AnnotationEditorType.NONE) {
			this.setEditingState(false);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _disableAll).call(this);
			for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) editor.hideStandaloneCommentButton();
			this._editorUndoBar?.hide();
			this.toggleComment(null);
			_classPrivateFieldGet2(_updateModeCapability, this).resolve();
			return;
		}
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) editor.addStandaloneCommentButton();
		if (mode === AnnotationEditorType.SIGNATURE) await _classPrivateFieldGet2(_signatureManager, this)?.loadSignatures();
		if (isFromUser) CurrentPointers.clearPointerType();
		this.setEditingState(true);
		await _assertClassBrand(_AnnotationEditorUIManager_brand, this, _enableAll).call(this);
		this.unselectAll();
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) layer.updateMode(mode);
		if (mode === AnnotationEditorType.POPUP) {
			_classPrivateFieldGet2(_allEditableAnnotations, this) || _classPrivateFieldSet2(_allEditableAnnotations, this, await _classPrivateFieldGet2(_pdfDocument, this).getAnnotationsByType(new Set(_classPrivateFieldGet2(_editorTypes, this).map((editorClass) => editorClass._editorType))));
			const elementIds = /* @__PURE__ */ new Set();
			const allComments = [];
			for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) {
				const { annotationElementId, hasComment, deleted } = editor;
				if (annotationElementId) elementIds.add(annotationElementId);
				if (hasComment && !deleted) allComments.push(editor.getData());
			}
			for (const annotation of _classPrivateFieldGet2(_allEditableAnnotations, this)) {
				const { id, popupRef, contentsObj } = annotation;
				if (popupRef && contentsObj?.str && !elementIds.has(id) && !_classPrivateFieldGet2(_deletedAnnotationsElementIds, this).has(id)) allComments.push(annotation);
			}
			_classPrivateFieldGet2(_commentManager, this)?.showSidebar(allComments);
		}
		if (!editId) {
			if (isFromKeyboard) this.addNewEditorFromKeyboard();
			_classPrivateFieldGet2(_updateModeCapability, this).resolve();
			return;
		}
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) if (editor.uid === editId) {
			this.setSelected(editor);
			if (editComment) editor.editComment();
			else if (mustEnterInEditMode) editor.enterInEditMode();
			else editor.focus();
		} else editor.unselect();
		_classPrivateFieldGet2(_updateModeCapability, this).resolve();
	}
	addNewEditorFromKeyboard() {
		if (this.currentLayer.canCreateNewEmptyEditor()) this.currentLayer.addNewEditor();
	}
	updateToolbar(options) {
		if (options.mode === _classPrivateFieldGet2(_mode, this)) return;
		this._eventBus.dispatch("switchannotationeditormode", {
			source: this,
			...options
		});
	}
	updateParams(type, value) {
		if (!_classPrivateFieldGet2(_editorTypes, this)) return;
		switch (type) {
			case AnnotationEditorParamsType.CREATE:
				this.currentLayer.addNewEditor(value);
				return;
			case AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL:
				this._eventBus.dispatch("reporttelemetry", {
					source: this,
					details: {
						type: "editing",
						data: {
							type: "highlight",
							action: "toggle_visibility"
						}
					}
				});
				(_classPrivateFieldGet2(_showAllStates, this) || _classPrivateFieldSet2(_showAllStates, this, /* @__PURE__ */ new Map())).set(type, value);
				this.showAllEditors("highlight", value);
				break;
		}
		if (this.hasSelection) for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) editor.updateParams(type, value);
		else for (const editorType of _classPrivateFieldGet2(_editorTypes, this)) editorType.updateDefaultParams(type, value);
	}
	showAllEditors(type, visible, updateButton = false) {
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) if (editor.editorType === type) editor.show(visible);
		if ((_classPrivateFieldGet2(_showAllStates, this)?.get(AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL) ?? true) !== visible) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, [[AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL, visible]]);
	}
	enableWaiting(mustWait = false) {
		if (_classPrivateFieldGet2(_isWaiting, this) === mustWait) return;
		_classPrivateFieldSet2(_isWaiting, this, mustWait);
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) {
			if (mustWait) layer.disableClick();
			else layer.enableClick();
			layer.div.classList.toggle("waiting", mustWait);
		}
	}
	*getEditors(pageIndex) {
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) if (editor.pageIndex === pageIndex) yield editor;
	}
	getEditor(id) {
		return _classPrivateFieldGet2(_allEditors, this).get(id);
	}
	addEditor(editor) {
		_classPrivateFieldGet2(_allEditors, this).set(editor.id, editor);
	}
	removeEditor(editor) {
		if (editor.div.contains(document.activeElement)) {
			if (_classPrivateFieldGet2(_focusMainContainerTimeoutId, this)) clearTimeout(_classPrivateFieldGet2(_focusMainContainerTimeoutId, this));
			_classPrivateFieldSet2(_focusMainContainerTimeoutId, this, setTimeout(() => {
				this.focusMainContainer();
				_classPrivateFieldSet2(_focusMainContainerTimeoutId, this, null);
			}, 0));
		}
		_classPrivateFieldGet2(_allEditors, this).delete(editor.id);
		if (editor.annotationElementId) _classPrivateFieldGet2(_missingCanvases, this)?.delete(editor.annotationElementId);
		this.unselect(editor);
		if (!editor.annotationElementId || !_classPrivateFieldGet2(_deletedAnnotationsElementIds, this).has(editor.annotationElementId)) _classPrivateFieldGet2(_annotationStorage, this)?.remove(editor.id);
	}
	addDeletedAnnotationElement(editor) {
		_classPrivateFieldGet2(_deletedAnnotationsElementIds, this).add(editor.annotationElementId);
		this.addChangedExistingAnnotation(editor);
		editor.deleted = true;
	}
	isDeletedAnnotationElement(annotationElementId) {
		return _classPrivateFieldGet2(_deletedAnnotationsElementIds, this).has(annotationElementId);
	}
	removeDeletedAnnotationElement(editor) {
		_classPrivateFieldGet2(_deletedAnnotationsElementIds, this).delete(editor.annotationElementId);
		this.removeChangedExistingAnnotation(editor);
		editor.deleted = false;
	}
	setActiveEditor(editor) {
		if (_classPrivateFieldGet2(_activeEditor, this) === editor) return;
		_classPrivateFieldSet2(_activeEditor, this, editor);
		if (editor) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editor.propertiesToUpdate);
	}
	updateUI(editor) {
		if (_get_lastSelectedEditor.call(_assertClassBrand(_AnnotationEditorUIManager_brand, this)) === editor) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editor.propertiesToUpdate);
	}
	updateUIForDefaultProperties(editorType) {
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editorType.defaultPropertiesToUpdate);
	}
	toggleSelected(editor) {
		if (_classPrivateFieldGet2(_selectedEditors, this).has(editor)) {
			_classPrivateFieldGet2(_selectedEditors, this).delete(editor);
			editor.unselect();
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: this.hasSelection });
			return;
		}
		_classPrivateFieldGet2(_selectedEditors, this).add(editor);
		editor.select();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editor.propertiesToUpdate);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: true });
	}
	setSelected(editor) {
		this.updateToolbar({
			mode: editor.mode,
			editId: editor.uid
		});
		_classPrivateFieldGet2(_currentDrawingSession, this)?.commitOrRemove();
		for (const ed of _classPrivateFieldGet2(_selectedEditors, this)) if (ed !== editor) ed.unselect();
		_classPrivateFieldGet2(_commentManager, this)?.destroyPopup();
		_classPrivateFieldGet2(_selectedEditors, this).clear();
		_classPrivateFieldGet2(_selectedEditors, this).add(editor);
		editor.select();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, editor.propertiesToUpdate);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: true });
	}
	isSelected(editor) {
		return _classPrivateFieldGet2(_selectedEditors, this).has(editor);
	}
	get firstSelectedEditor() {
		return _classPrivateFieldGet2(_selectedEditors, this).values().next().value;
	}
	unselect(editor) {
		editor.unselect();
		_classPrivateFieldGet2(_selectedEditors, this).delete(editor);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: this.hasSelection });
	}
	get hasSelection() {
		return _classPrivateFieldGet2(_selectedEditors, this).size !== 0;
	}
	get isEnterHandled() {
		return _classPrivateFieldGet2(_selectedEditors, this).size === 1 && this.firstSelectedEditor.isEnterHandled;
	}
	undo() {
		_classPrivateFieldGet2(_commandManager, this).undo();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, {
			hasSomethingToUndo: _classPrivateFieldGet2(_commandManager, this).hasSomethingToUndo(),
			hasSomethingToRedo: true,
			isEmpty: _assertClassBrand(_AnnotationEditorUIManager_brand, this, _isEmpty).call(this)
		});
		this._editorUndoBar?.hide();
	}
	redo() {
		_classPrivateFieldGet2(_commandManager, this).redo();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, {
			hasSomethingToUndo: true,
			hasSomethingToRedo: _classPrivateFieldGet2(_commandManager, this).hasSomethingToRedo(),
			isEmpty: _assertClassBrand(_AnnotationEditorUIManager_brand, this, _isEmpty).call(this)
		});
	}
	addCommands(params) {
		_classPrivateFieldGet2(_commandManager, this).add(params);
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, {
			hasSomethingToUndo: true,
			hasSomethingToRedo: false,
			isEmpty: _assertClassBrand(_AnnotationEditorUIManager_brand, this, _isEmpty).call(this)
		});
	}
	cleanUndoStack(type) {
		_classPrivateFieldGet2(_commandManager, this).cleanType(type);
	}
	delete() {
		this.commitOrRemove();
		const drawingEditor = this.currentLayer?.endDrawingSession(true);
		if (!this.hasSelection && !drawingEditor) return;
		const editors = drawingEditor ? [drawingEditor] : [..._classPrivateFieldGet2(_selectedEditors, this)];
		const cmd = () => {
			this._editorUndoBar?.show(undo, editors.length === 1 ? editors[0].editorType : editors.length);
			for (const editor of editors) editor.remove();
		};
		const undo = () => {
			for (const editor of editors) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _addEditorToLayer).call(this, editor);
		};
		this.addCommands({
			cmd,
			undo,
			mustExec: true
		});
	}
	commitOrRemove() {
		_classPrivateFieldGet2(_activeEditor, this)?.commitOrRemove();
	}
	hasSomethingToControl() {
		return _classPrivateFieldGet2(_activeEditor, this) || this.hasSelection;
	}
	selectAll() {
		for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) editor.commit();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _selectEditors).call(this, _classPrivateFieldGet2(_allEditors, this).values());
	}
	unselectAll() {
		if (_classPrivateFieldGet2(_activeEditor, this)) {
			_classPrivateFieldGet2(_activeEditor, this).commitOrRemove();
			if (_classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.NONE) return;
		}
		if (_classPrivateFieldGet2(_currentDrawingSession, this)?.commitOrRemove()) return;
		_classPrivateFieldGet2(_commentManager, this)?.destroyPopup();
		if (!this.hasSelection) return;
		for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) editor.unselect();
		_classPrivateFieldGet2(_selectedEditors, this).clear();
		_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: false });
	}
	translateSelectedEditors(x, y, noCommit = false) {
		if (!noCommit) this.commitOrRemove();
		if (!this.hasSelection) return;
		_classPrivateFieldGet2(_translation, this)[0] += x;
		_classPrivateFieldGet2(_translation, this)[1] += y;
		const [totalX, totalY] = _classPrivateFieldGet2(_translation, this);
		const editors = [..._classPrivateFieldGet2(_selectedEditors, this)];
		const TIME_TO_WAIT = 1e3;
		if (_classPrivateFieldGet2(_translationTimeoutId, this)) clearTimeout(_classPrivateFieldGet2(_translationTimeoutId, this));
		_classPrivateFieldSet2(_translationTimeoutId, this, setTimeout(() => {
			_classPrivateFieldSet2(_translationTimeoutId, this, null);
			_classPrivateFieldGet2(_translation, this)[0] = _classPrivateFieldGet2(_translation, this)[1] = 0;
			this.addCommands({
				cmd: () => {
					for (const editor of editors) if (_classPrivateFieldGet2(_allEditors, this).has(editor.id)) {
						editor.translateInPage(totalX, totalY);
						editor.translationDone();
					}
				},
				undo: () => {
					for (const editor of editors) if (_classPrivateFieldGet2(_allEditors, this).has(editor.id)) {
						editor.translateInPage(-totalX, -totalY);
						editor.translationDone();
					}
				},
				mustExec: false
			});
		}, TIME_TO_WAIT));
		for (const editor of editors) {
			editor.translateInPage(x, y);
			editor.translationDone();
		}
	}
	setUpDragSession() {
		if (!this.hasSelection) return;
		this.disableUserSelect(true);
		_classPrivateFieldSet2(_draggingEditors, this, /* @__PURE__ */ new Map());
		for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) _classPrivateFieldGet2(_draggingEditors, this).set(editor, {
			savedX: editor.x,
			savedY: editor.y,
			savedPageIndex: editor.pageIndex,
			newX: 0,
			newY: 0,
			newPageIndex: -1
		});
	}
	endDragSession() {
		if (!_classPrivateFieldGet2(_draggingEditors, this)) return false;
		this.disableUserSelect(false);
		const map = _classPrivateFieldGet2(_draggingEditors, this);
		_classPrivateFieldSet2(_draggingEditors, this, null);
		let mustBeAddedInUndoStack = false;
		for (const [{ x, y, pageIndex }, value] of map) {
			value.newX = x;
			value.newY = y;
			value.newPageIndex = pageIndex;
			mustBeAddedInUndoStack || (mustBeAddedInUndoStack = x !== value.savedX || y !== value.savedY || pageIndex !== value.savedPageIndex);
		}
		if (!mustBeAddedInUndoStack) return false;
		const move = (editor, x, y, pageIndex) => {
			if (_classPrivateFieldGet2(_allEditors, this).has(editor.id)) {
				const parent = _classPrivateFieldGet2(_allLayers, this).get(pageIndex);
				if (parent) editor._setParentAndPosition(parent, x, y);
				else {
					editor.pageIndex = pageIndex;
					editor.x = x;
					editor.y = y;
				}
			}
		};
		this.addCommands({
			cmd: () => {
				for (const [editor, { newX, newY, newPageIndex }] of map) move(editor, newX, newY, newPageIndex);
			},
			undo: () => {
				for (const [editor, { savedX, savedY, savedPageIndex }] of map) move(editor, savedX, savedY, savedPageIndex);
			},
			mustExec: true
		});
		return true;
	}
	dragSelectedEditors(tx, ty) {
		if (!_classPrivateFieldGet2(_draggingEditors, this)) return;
		for (const editor of _classPrivateFieldGet2(_draggingEditors, this).keys()) editor.drag(tx, ty);
	}
	rebuild(editor) {
		if (editor.parent === null) {
			const parent = this.getLayer(editor.pageIndex);
			if (parent) {
				parent.changeParent(editor);
				parent.addOrRebuild(editor);
			} else {
				this.addEditor(editor);
				this.addToAnnotationStorage(editor);
				editor.rebuild();
			}
		} else editor.parent.addOrRebuild(editor);
	}
	get isEditorHandlingKeyboard() {
		return this.getActive()?.shouldGetKeyboardEvents() || _classPrivateFieldGet2(_selectedEditors, this).size === 1 && this.firstSelectedEditor.shouldGetKeyboardEvents();
	}
	isActive(editor) {
		return _classPrivateFieldGet2(_activeEditor, this) === editor;
	}
	getActive() {
		return _classPrivateFieldGet2(_activeEditor, this);
	}
	getMode() {
		return _classPrivateFieldGet2(_mode, this);
	}
	isEditingMode() {
		return _classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.NONE;
	}
	get imageManager() {
		return shadow(this, "imageManager", new ImageManager());
	}
	getSelectionBoxes(textLayer) {
		if (!textLayer) return null;
		const selection = document.getSelection();
		for (let i = 0, ii = selection.rangeCount; i < ii; i++) if (!textLayer.contains(selection.getRangeAt(i).commonAncestorContainer)) return null;
		const { x: layerX, y: layerY, width: parentWidth, height: parentHeight } = textLayer.getBoundingClientRect();
		let rotator;
		switch (textLayer.getAttribute("data-main-rotation")) {
			case "90":
				rotator = (x, y, w, h) => ({
					x: (y - layerY) / parentHeight,
					y: 1 - (x + w - layerX) / parentWidth,
					width: h / parentHeight,
					height: w / parentWidth
				});
				break;
			case "180":
				rotator = (x, y, w, h) => ({
					x: 1 - (x + w - layerX) / parentWidth,
					y: 1 - (y + h - layerY) / parentHeight,
					width: w / parentWidth,
					height: h / parentHeight
				});
				break;
			case "270":
				rotator = (x, y, w, h) => ({
					x: 1 - (y + h - layerY) / parentHeight,
					y: (x - layerX) / parentWidth,
					width: h / parentHeight,
					height: w / parentWidth
				});
				break;
			default:
				rotator = (x, y, w, h) => ({
					x: (x - layerX) / parentWidth,
					y: (y - layerY) / parentHeight,
					width: w / parentWidth,
					height: h / parentHeight
				});
				break;
		}
		const boxes = [];
		for (let i = 0, ii = selection.rangeCount; i < ii; i++) {
			const range = selection.getRangeAt(i);
			if (range.collapsed) continue;
			for (const { x, y, width, height } of range.getClientRects()) {
				if (width === 0 || height === 0) continue;
				boxes.push(rotator(x, y, width, height));
			}
		}
		return boxes.length === 0 ? null : boxes;
	}
	addChangedExistingAnnotation({ annotationElementId, id }) {
		(_classPrivateFieldGet2(_changedExistingAnnotations, this) || _classPrivateFieldSet2(_changedExistingAnnotations, this, /* @__PURE__ */ new Map())).set(annotationElementId, id);
	}
	removeChangedExistingAnnotation({ annotationElementId }) {
		_classPrivateFieldGet2(_changedExistingAnnotations, this)?.delete(annotationElementId);
	}
	renderAnnotationElement(annotation) {
		const editorId = _classPrivateFieldGet2(_changedExistingAnnotations, this)?.get(annotation.data.id);
		if (!editorId) return;
		const editor = _classPrivateFieldGet2(_annotationStorage, this).getRawValue(editorId);
		if (!editor) return;
		if (_classPrivateFieldGet2(_mode, this) === AnnotationEditorType.NONE && !editor.hasBeenModified) return;
		editor.renderAnnotationElement(annotation);
	}
	setMissingCanvas(annotationId, annotationElementId, canvas) {
		const editor = _classPrivateFieldGet2(_missingCanvases, this)?.get(annotationId);
		if (!editor) return;
		editor.setCanvas(annotationElementId, canvas);
		_classPrivateFieldGet2(_missingCanvases, this).delete(annotationId);
	}
	addMissingCanvas(annotationId, editor) {
		(_classPrivateFieldGet2(_missingCanvases, this) || _classPrivateFieldSet2(_missingCanvases, this, /* @__PURE__ */ new Map())).set(annotationId, editor);
	}
};
function _getAnchorElementForSelection({ anchorNode }) {
	return anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode;
}
function _getLayerForTextLayer(textLayer) {
	const { currentLayer } = this;
	if (currentLayer.hasTextLayer(textLayer)) return currentLayer;
	for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) if (layer.hasTextLayer(textLayer)) return layer;
	return null;
}
function _beforeUnload(e) {
	this.commitOrRemove();
	this.currentLayer?.endDrawingSession(false);
}
function _displayFloatingToolbar() {
	const selection = document.getSelection();
	if (!selection || selection.isCollapsed) return;
	const textLayer = _assertClassBrand(_AnnotationEditorUIManager_brand, this, _getAnchorElementForSelection).call(this, selection).closest(".textLayer");
	const boxes = this.getSelectionBoxes(textLayer);
	if (!boxes) return;
	_classPrivateFieldGet2(_floatingToolbar, this) || _classPrivateFieldSet2(_floatingToolbar, this, new FloatingToolbar(this));
	_classPrivateFieldGet2(_floatingToolbar, this).show(textLayer, boxes, this.direction === "ltr");
}
function _selectionChange() {
	const selection = document.getSelection();
	if (!selection || selection.isCollapsed) {
		if (_classPrivateFieldGet2(_selectedTextNode, this)) {
			_classPrivateFieldGet2(_floatingToolbar, this)?.hide();
			_classPrivateFieldSet2(_selectedTextNode, this, null);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedText: false });
		}
		return;
	}
	const { anchorNode } = selection;
	if (anchorNode === _classPrivateFieldGet2(_selectedTextNode, this)) return;
	const textLayer = _assertClassBrand(_AnnotationEditorUIManager_brand, this, _getAnchorElementForSelection).call(this, selection).closest(".textLayer");
	if (!textLayer) {
		if (_classPrivateFieldGet2(_selectedTextNode, this)) {
			_classPrivateFieldGet2(_floatingToolbar, this)?.hide();
			_classPrivateFieldSet2(_selectedTextNode, this, null);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedText: false });
		}
		return;
	}
	_classPrivateFieldGet2(_floatingToolbar, this)?.hide();
	_classPrivateFieldSet2(_selectedTextNode, this, anchorNode);
	_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedText: true });
	if (_classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.HIGHLIGHT && _classPrivateFieldGet2(_mode, this) !== AnnotationEditorType.NONE) return;
	if (_classPrivateFieldGet2(_mode, this) === AnnotationEditorType.HIGHLIGHT) this.showAllEditors("highlight", true, true);
	_classPrivateFieldSet2(_highlightWhenShiftUp, this, this.isShiftKeyDown);
	if (!this.isShiftKeyDown) {
		const activeLayer = _classPrivateFieldGet2(_mode, this) === AnnotationEditorType.HIGHLIGHT ? _assertClassBrand(_AnnotationEditorUIManager_brand, this, _getLayerForTextLayer).call(this, textLayer) : null;
		activeLayer?.toggleDrawing();
		if (_classPrivateFieldGet2(_isPointerDown, this)) {
			const ac = new AbortController();
			const signal = this.combinedSignal(ac);
			const pointerup = (e) => {
				if (e.type === "pointerup" && e.button !== 0) return;
				ac.abort();
				activeLayer?.toggleDrawing(true);
				if (e.type === "pointerup") _assertClassBrand(_AnnotationEditorUIManager_brand, this, _onSelectEnd).call(this, "main_toolbar");
			};
			window.addEventListener("pointerup", pointerup, { signal });
			window.addEventListener("blur", pointerup, { signal });
		} else {
			activeLayer?.toggleDrawing(true);
			_assertClassBrand(_AnnotationEditorUIManager_brand, this, _onSelectEnd).call(this, "main_toolbar");
		}
	}
}
function _onSelectEnd(methodOfCreation = "") {
	if (_classPrivateFieldGet2(_mode, this) === AnnotationEditorType.HIGHLIGHT) this.highlightSelection(methodOfCreation);
	else if (_classPrivateFieldGet2(_enableHighlightFloatingButton, this)) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _displayFloatingToolbar).call(this);
}
function _addSelectionListener() {
	document.addEventListener("selectionchange", _assertClassBrand(_AnnotationEditorUIManager_brand, this, _selectionChange).bind(this), { signal: this._signal });
}
function _addFocusManager() {
	if (_classPrivateFieldGet2(_focusManagerAC, this)) return;
	_classPrivateFieldSet2(_focusManagerAC, this, new AbortController());
	const signal = this.combinedSignal(_classPrivateFieldGet2(_focusManagerAC, this));
	window.addEventListener("focus", this.focus.bind(this), { signal });
	window.addEventListener("blur", this.blur.bind(this), { signal });
}
function _removeFocusManager() {
	_classPrivateFieldGet2(_focusManagerAC, this)?.abort();
	_classPrivateFieldSet2(_focusManagerAC, this, null);
}
function _addKeyboardManager() {
	if (_classPrivateFieldGet2(_keyboardManagerAC, this)) return;
	_classPrivateFieldSet2(_keyboardManagerAC, this, new AbortController());
	const signal = this.combinedSignal(_classPrivateFieldGet2(_keyboardManagerAC, this));
	window.addEventListener("keydown", this.keydown.bind(this), { signal });
	window.addEventListener("keyup", this.keyup.bind(this), { signal });
}
function _removeKeyboardManager() {
	_classPrivateFieldGet2(_keyboardManagerAC, this)?.abort();
	_classPrivateFieldSet2(_keyboardManagerAC, this, null);
}
function _addCopyPasteListeners() {
	if (_classPrivateFieldGet2(_copyPasteAC, this)) return;
	_classPrivateFieldSet2(_copyPasteAC, this, new AbortController());
	const signal = this.combinedSignal(_classPrivateFieldGet2(_copyPasteAC, this));
	document.addEventListener("copy", this.copy.bind(this), { signal });
	document.addEventListener("cut", this.cut.bind(this), { signal });
	document.addEventListener("paste", this.paste.bind(this), { signal });
}
function _removeCopyPasteListeners() {
	_classPrivateFieldGet2(_copyPasteAC, this)?.abort();
	_classPrivateFieldSet2(_copyPasteAC, this, null);
}
function _addDragAndDropListeners() {
	const signal = this._signal;
	document.addEventListener("dragover", this.dragOver.bind(this), { signal });
	document.addEventListener("drop", this.drop.bind(this), { signal });
}
function _dispatchUpdateStates(details) {
	if (Object.entries(details).some(([key, value]) => _classPrivateFieldGet2(_previousStates, this)[key] !== value)) {
		this._eventBus.dispatch("editingstateschanged", {
			source: this,
			details: Object.assign(_classPrivateFieldGet2(_previousStates, this), details)
		});
		if (_classPrivateFieldGet2(_mode, this) === AnnotationEditorType.HIGHLIGHT && details.hasSelectedEditor === false) _assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateUI).call(this, [[AnnotationEditorParamsType.HIGHLIGHT_FREE, true]]);
	}
}
function _dispatchUpdateUI(details) {
	this._eventBus.dispatch("annotationeditorparamschanged", {
		source: this,
		details
	});
}
async function _enableAll() {
	if (!_classPrivateFieldGet2(_isEnabled, this)) {
		_classPrivateFieldSet2(_isEnabled, this, true);
		const promises = [];
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) promises.push(layer.enable());
		await Promise.all(promises);
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) editor.enable();
	}
}
function _disableAll() {
	this.unselectAll();
	if (_classPrivateFieldGet2(_isEnabled, this)) {
		_classPrivateFieldSet2(_isEnabled, this, false);
		for (const layer of _classPrivateFieldGet2(_allLayers, this).values()) layer.disable();
		for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) editor.disable();
	}
}
function _addEditorToLayer(editor) {
	const layer = _classPrivateFieldGet2(_allLayers, this).get(editor.pageIndex);
	if (layer) layer.addOrRebuild(editor);
	else {
		this.addEditor(editor);
		this.addToAnnotationStorage(editor);
	}
}
function _get_lastSelectedEditor() {
	let ed = null;
	for (ed of _classPrivateFieldGet2(_selectedEditors, this));
	return ed;
}
function _isEmpty() {
	if (_classPrivateFieldGet2(_allEditors, this).size === 0) return true;
	if (_classPrivateFieldGet2(_allEditors, this).size === 1) for (const editor of _classPrivateFieldGet2(_allEditors, this).values()) return editor.isEmpty();
	return false;
}
function _selectEditors(editors) {
	for (const editor of _classPrivateFieldGet2(_selectedEditors, this)) editor.unselect();
	_classPrivateFieldGet2(_selectedEditors, this).clear();
	for (const editor of editors) {
		if (editor.isEmpty()) continue;
		_classPrivateFieldGet2(_selectedEditors, this).add(editor);
		editor.select();
	}
	_assertClassBrand(_AnnotationEditorUIManager_brand, this, _dispatchUpdateStates).call(this, { hasSelectedEditor: this.hasSelection });
}
_defineProperty(AnnotationEditorUIManager, "TRANSLATE_SMALL", 1);
_defineProperty(AnnotationEditorUIManager, "TRANSLATE_BIG", 10);
var _altText2 = /* @__PURE__ */ new WeakMap();
var _altTextDecorative = /* @__PURE__ */ new WeakMap();
var _altTextButton = /* @__PURE__ */ new WeakMap();
var _altTextButtonLabel = /* @__PURE__ */ new WeakMap();
var _altTextTooltip = /* @__PURE__ */ new WeakMap();
var _altTextTooltipTimeout = /* @__PURE__ */ new WeakMap();
var _altTextWasFromKeyBoard = /* @__PURE__ */ new WeakMap();
var _badge = /* @__PURE__ */ new WeakMap();
var _editor2 = /* @__PURE__ */ new WeakMap();
var _guessedText = /* @__PURE__ */ new WeakMap();
var _textWithDisclaimer = /* @__PURE__ */ new WeakMap();
var _useNewAltTextFlow = /* @__PURE__ */ new WeakMap();
var _AltText_brand = /* @__PURE__ */ new WeakSet();
var AltText = class AltText {
	constructor(editor) {
		_classPrivateMethodInitSpec(this, _AltText_brand);
		_classPrivateFieldInitSpec(this, _altText2, null);
		_classPrivateFieldInitSpec(this, _altTextDecorative, false);
		_classPrivateFieldInitSpec(this, _altTextButton, null);
		_classPrivateFieldInitSpec(this, _altTextButtonLabel, null);
		_classPrivateFieldInitSpec(this, _altTextTooltip, null);
		_classPrivateFieldInitSpec(this, _altTextTooltipTimeout, null);
		_classPrivateFieldInitSpec(this, _altTextWasFromKeyBoard, false);
		_classPrivateFieldInitSpec(this, _badge, null);
		_classPrivateFieldInitSpec(this, _editor2, null);
		_classPrivateFieldInitSpec(this, _guessedText, null);
		_classPrivateFieldInitSpec(this, _textWithDisclaimer, null);
		_classPrivateFieldInitSpec(this, _useNewAltTextFlow, false);
		_classPrivateFieldSet2(_editor2, this, editor);
		_classPrivateFieldSet2(_useNewAltTextFlow, this, editor._uiManager.useNewAltTextFlow);
		_l10nNewButton._ || (_l10nNewButton._ = Object.freeze({
			added: "pdfjs-editor-new-alt-text-added-button",
			"added-label": "pdfjs-editor-new-alt-text-added-button-label",
			missing: "pdfjs-editor-new-alt-text-missing-button",
			"missing-label": "pdfjs-editor-new-alt-text-missing-button-label",
			review: "pdfjs-editor-new-alt-text-to-review-button",
			"review-label": "pdfjs-editor-new-alt-text-to-review-button-label"
		}));
	}
	static initialize(l10n) {
		AltText._l10n ?? (AltText._l10n = l10n);
	}
	async render() {
		const altText = _classPrivateFieldSet2(_altTextButton, this, document.createElement("button"));
		altText.className = "altText";
		altText.tabIndex = "0";
		const label = _classPrivateFieldSet2(_altTextButtonLabel, this, document.createElement("span"));
		altText.append(label);
		if (_classPrivateFieldGet2(_useNewAltTextFlow, this)) {
			altText.classList.add("new");
			altText.setAttribute("data-l10n-id", _l10nNewButton._.missing);
			label.setAttribute("data-l10n-id", _l10nNewButton._["missing-label"]);
		} else {
			altText.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-button");
			label.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-button-label");
		}
		const signal = _classPrivateFieldGet2(_editor2, this)._uiManager._signal;
		altText.addEventListener("contextmenu", noContextMenu, { signal });
		altText.addEventListener("pointerdown", (event) => event.stopPropagation(), { signal });
		const onClick = (event) => {
			event.preventDefault();
			_classPrivateFieldGet2(_editor2, this)._uiManager.editAltText(_classPrivateFieldGet2(_editor2, this));
			if (_classPrivateFieldGet2(_useNewAltTextFlow, this)) _classPrivateFieldGet2(_editor2, this)._reportTelemetry({
				action: "pdfjs.image.alt_text.image_status_label_clicked",
				data: { label: _get_label.call(_assertClassBrand(_AltText_brand, this)) }
			});
		};
		altText.addEventListener("click", onClick, {
			capture: true,
			signal
		});
		altText.addEventListener("keydown", (event) => {
			if (event.target === altText && event.key === "Enter") {
				_classPrivateFieldSet2(_altTextWasFromKeyBoard, this, true);
				onClick(event);
			}
		}, { signal });
		await _assertClassBrand(_AltText_brand, this, _setState).call(this);
		return altText;
	}
	finish() {
		if (!_classPrivateFieldGet2(_altTextButton, this)) return;
		_classPrivateFieldGet2(_altTextButton, this).focus({ focusVisible: _classPrivateFieldGet2(_altTextWasFromKeyBoard, this) });
		_classPrivateFieldSet2(_altTextWasFromKeyBoard, this, false);
	}
	isEmpty() {
		if (_classPrivateFieldGet2(_useNewAltTextFlow, this)) return _classPrivateFieldGet2(_altText2, this) === null;
		return !_classPrivateFieldGet2(_altText2, this) && !_classPrivateFieldGet2(_altTextDecorative, this);
	}
	hasData() {
		if (_classPrivateFieldGet2(_useNewAltTextFlow, this)) return _classPrivateFieldGet2(_altText2, this) !== null || !!_classPrivateFieldGet2(_guessedText, this);
		return this.isEmpty();
	}
	get guessedText() {
		return _classPrivateFieldGet2(_guessedText, this);
	}
	async setGuessedText(guessedText) {
		if (_classPrivateFieldGet2(_altText2, this) !== null) return;
		_classPrivateFieldSet2(_guessedText, this, guessedText);
		_classPrivateFieldSet2(_textWithDisclaimer, this, await AltText._l10n.get("pdfjs-editor-new-alt-text-generated-alt-text-with-disclaimer", { generatedAltText: guessedText }));
		_assertClassBrand(_AltText_brand, this, _setState).call(this);
	}
	toggleAltTextBadge(visibility = false) {
		if (!_classPrivateFieldGet2(_useNewAltTextFlow, this) || _classPrivateFieldGet2(_altText2, this)) {
			_classPrivateFieldGet2(_badge, this)?.remove();
			_classPrivateFieldSet2(_badge, this, null);
			return;
		}
		if (!_classPrivateFieldGet2(_badge, this)) {
			const badge = _classPrivateFieldSet2(_badge, this, document.createElement("div"));
			badge.className = "noAltTextBadge";
			_classPrivateFieldGet2(_editor2, this).div.append(badge);
		}
		_classPrivateFieldGet2(_badge, this).classList.toggle("hidden", !visibility);
	}
	serialize(isForCopying) {
		let altText = _classPrivateFieldGet2(_altText2, this);
		if (!isForCopying && _classPrivateFieldGet2(_guessedText, this) === altText) altText = _classPrivateFieldGet2(_textWithDisclaimer, this);
		return {
			altText,
			decorative: _classPrivateFieldGet2(_altTextDecorative, this),
			guessedText: _classPrivateFieldGet2(_guessedText, this),
			textWithDisclaimer: _classPrivateFieldGet2(_textWithDisclaimer, this)
		};
	}
	get data() {
		return {
			altText: _classPrivateFieldGet2(_altText2, this),
			decorative: _classPrivateFieldGet2(_altTextDecorative, this)
		};
	}
	set data({ altText, decorative, guessedText, textWithDisclaimer, cancel = false }) {
		if (guessedText) {
			_classPrivateFieldSet2(_guessedText, this, guessedText);
			_classPrivateFieldSet2(_textWithDisclaimer, this, textWithDisclaimer);
		}
		if (_classPrivateFieldGet2(_altText2, this) === altText && _classPrivateFieldGet2(_altTextDecorative, this) === decorative) return;
		if (!cancel) {
			_classPrivateFieldSet2(_altText2, this, altText);
			_classPrivateFieldSet2(_altTextDecorative, this, decorative);
		}
		_assertClassBrand(_AltText_brand, this, _setState).call(this);
	}
	toggle(enabled = false) {
		if (!_classPrivateFieldGet2(_altTextButton, this)) return;
		if (!enabled && _classPrivateFieldGet2(_altTextTooltipTimeout, this)) {
			clearTimeout(_classPrivateFieldGet2(_altTextTooltipTimeout, this));
			_classPrivateFieldSet2(_altTextTooltipTimeout, this, null);
		}
		_classPrivateFieldGet2(_altTextButton, this).disabled = !enabled;
	}
	shown() {
		_classPrivateFieldGet2(_editor2, this)._reportTelemetry({
			action: "pdfjs.image.alt_text.image_status_label_displayed",
			data: { label: _get_label.call(_assertClassBrand(_AltText_brand, this)) }
		});
	}
	destroy() {
		_classPrivateFieldGet2(_altTextButton, this)?.remove();
		_classPrivateFieldSet2(_altTextButton, this, null);
		_classPrivateFieldSet2(_altTextButtonLabel, this, null);
		_classPrivateFieldSet2(_altTextTooltip, this, null);
		_classPrivateFieldGet2(_badge, this)?.remove();
		_classPrivateFieldSet2(_badge, this, null);
	}
};
function _get_label() {
	return _classPrivateFieldGet2(_altText2, this) && "added" || _classPrivateFieldGet2(_altText2, this) === null && this.guessedText && "review" || "missing";
}
async function _setState() {
	const button = _classPrivateFieldGet2(_altTextButton, this);
	if (!button) return;
	if (_classPrivateFieldGet2(_useNewAltTextFlow, this)) {
		button.classList.toggle("done", !!_classPrivateFieldGet2(_altText2, this));
		button.setAttribute("data-l10n-id", _l10nNewButton._[_get_label.call(_assertClassBrand(_AltText_brand, this))]);
		_classPrivateFieldGet2(_altTextButtonLabel, this)?.setAttribute("data-l10n-id", _l10nNewButton._[`${_get_label.call(_assertClassBrand(_AltText_brand, this))}-label`]);
		if (!_classPrivateFieldGet2(_altText2, this)) {
			_classPrivateFieldGet2(_altTextTooltip, this)?.remove();
			return;
		}
	} else {
		if (!_classPrivateFieldGet2(_altText2, this) && !_classPrivateFieldGet2(_altTextDecorative, this)) {
			button.classList.remove("done");
			_classPrivateFieldGet2(_altTextTooltip, this)?.remove();
			return;
		}
		button.classList.add("done");
		button.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-edit-button");
	}
	let tooltip = _classPrivateFieldGet2(_altTextTooltip, this);
	if (!tooltip) {
		_classPrivateFieldSet2(_altTextTooltip, this, tooltip = document.createElement("span"));
		tooltip.className = "tooltip";
		tooltip.setAttribute("role", "tooltip");
		tooltip.id = `alt-text-tooltip-${_classPrivateFieldGet2(_editor2, this).id}`;
		const DELAY_TO_SHOW_TOOLTIP = 100;
		const signal = _classPrivateFieldGet2(_editor2, this)._uiManager._signal;
		signal.addEventListener("abort", () => {
			clearTimeout(_classPrivateFieldGet2(_altTextTooltipTimeout, this));
			_classPrivateFieldSet2(_altTextTooltipTimeout, this, null);
		}, { once: true });
		button.addEventListener("mouseenter", () => {
			_classPrivateFieldSet2(_altTextTooltipTimeout, this, setTimeout(() => {
				_classPrivateFieldSet2(_altTextTooltipTimeout, this, null);
				_classPrivateFieldGet2(_altTextTooltip, this).classList.add("show");
				_classPrivateFieldGet2(_editor2, this)._reportTelemetry({ action: "alt_text_tooltip" });
			}, DELAY_TO_SHOW_TOOLTIP));
		}, { signal });
		button.addEventListener("mouseleave", () => {
			if (_classPrivateFieldGet2(_altTextTooltipTimeout, this)) {
				clearTimeout(_classPrivateFieldGet2(_altTextTooltipTimeout, this));
				_classPrivateFieldSet2(_altTextTooltipTimeout, this, null);
			}
			_classPrivateFieldGet2(_altTextTooltip, this)?.classList.remove("show");
		}, { signal });
	}
	if (_classPrivateFieldGet2(_altTextDecorative, this)) tooltip.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-decorative-tooltip");
	else {
		tooltip.removeAttribute("data-l10n-id");
		tooltip.textContent = _classPrivateFieldGet2(_altText2, this);
	}
	if (!tooltip.parentNode) button.append(tooltip);
	_classPrivateFieldGet2(_editor2, this).getElementForAltText()?.setAttribute("aria-describedby", tooltip.id);
}
var _l10nNewButton = { _: null };
_defineProperty(AltText, "_l10n", null);
var _commentStandaloneButton = /* @__PURE__ */ new WeakMap();
var _commentToolbarButton = /* @__PURE__ */ new WeakMap();
var _commentWasFromKeyBoard = /* @__PURE__ */ new WeakMap();
var _editor3 = /* @__PURE__ */ new WeakMap();
var _initialText = /* @__PURE__ */ new WeakMap();
var _richText = /* @__PURE__ */ new WeakMap();
var _text = /* @__PURE__ */ new WeakMap();
var _date = /* @__PURE__ */ new WeakMap();
var _deleted = /* @__PURE__ */ new WeakMap();
var _popupPosition = /* @__PURE__ */ new WeakMap();
var _Comment_brand = /* @__PURE__ */ new WeakSet();
var Comment = class {
	constructor(editor) {
		_classPrivateMethodInitSpec(this, _Comment_brand);
		_classPrivateFieldInitSpec(this, _commentStandaloneButton, null);
		_classPrivateFieldInitSpec(this, _commentToolbarButton, null);
		_classPrivateFieldInitSpec(this, _commentWasFromKeyBoard, false);
		_classPrivateFieldInitSpec(this, _editor3, null);
		_classPrivateFieldInitSpec(this, _initialText, null);
		_classPrivateFieldInitSpec(this, _richText, null);
		_classPrivateFieldInitSpec(this, _text, null);
		_classPrivateFieldInitSpec(this, _date, null);
		_classPrivateFieldInitSpec(this, _deleted, false);
		_classPrivateFieldInitSpec(this, _popupPosition, null);
		_classPrivateFieldSet2(_editor3, this, editor);
	}
	renderForToolbar() {
		const button = _classPrivateFieldSet2(_commentToolbarButton, this, document.createElement("button"));
		button.className = "comment";
		return _assertClassBrand(_Comment_brand, this, _render2).call(this, button, false);
	}
	renderForStandalone() {
		const button = _classPrivateFieldSet2(_commentStandaloneButton, this, document.createElement("button"));
		button.className = "annotationCommentButton";
		const position = _classPrivateFieldGet2(_editor3, this).commentButtonPosition;
		if (position) {
			const { style } = button;
			style.insetInlineEnd = `calc(${100 * (_classPrivateFieldGet2(_editor3, this)._uiManager.direction === "ltr" ? 1 - position[0] : position[0])}% - var(--comment-button-dim))`;
			style.top = `calc(${100 * position[1]}% - var(--comment-button-dim))`;
			const color = _classPrivateFieldGet2(_editor3, this).commentButtonColor;
			if (color) style.backgroundColor = color;
		}
		return _assertClassBrand(_Comment_brand, this, _render2).call(this, button, true);
	}
	focusButton() {
		setTimeout(() => {
			(_classPrivateFieldGet2(_commentStandaloneButton, this) ?? _classPrivateFieldGet2(_commentToolbarButton, this))?.focus();
		}, 0);
	}
	onUpdatedColor() {
		if (!_classPrivateFieldGet2(_commentStandaloneButton, this)) return;
		const color = _classPrivateFieldGet2(_editor3, this).commentButtonColor;
		if (color) _classPrivateFieldGet2(_commentStandaloneButton, this).style.backgroundColor = color;
		_classPrivateFieldGet2(_editor3, this)._uiManager.updatePopupColor(_classPrivateFieldGet2(_editor3, this));
	}
	get commentButtonWidth() {
		return (_classPrivateFieldGet2(_commentStandaloneButton, this)?.getBoundingClientRect().width ?? 0) / _classPrivateFieldGet2(_editor3, this).parent.boundingClientRect.width;
	}
	get commentPopupPositionInLayer() {
		if (_classPrivateFieldGet2(_popupPosition, this)) return _classPrivateFieldGet2(_popupPosition, this);
		if (!_classPrivateFieldGet2(_commentStandaloneButton, this)) return null;
		const { x, y, height } = _classPrivateFieldGet2(_commentStandaloneButton, this).getBoundingClientRect();
		const { x: parentX, y: parentY, width: parentWidth, height: parentHeight } = _classPrivateFieldGet2(_editor3, this).parent.boundingClientRect;
		return [(x - parentX) / parentWidth, (y + height - parentY) / parentHeight];
	}
	set commentPopupPositionInLayer(pos) {
		_classPrivateFieldSet2(_popupPosition, this, pos);
	}
	hasDefaultPopupPosition() {
		return _classPrivateFieldGet2(_popupPosition, this) === null;
	}
	removeStandaloneCommentButton() {
		_classPrivateFieldGet2(_commentStandaloneButton, this)?.remove();
		_classPrivateFieldSet2(_commentStandaloneButton, this, null);
	}
	removeToolbarCommentButton() {
		_classPrivateFieldGet2(_commentToolbarButton, this)?.remove();
		_classPrivateFieldSet2(_commentToolbarButton, this, null);
	}
	setCommentButtonStates({ selected, hasPopup }) {
		if (!_classPrivateFieldGet2(_commentStandaloneButton, this)) return;
		_classPrivateFieldGet2(_commentStandaloneButton, this).classList.toggle("selected", selected);
		_classPrivateFieldGet2(_commentStandaloneButton, this).ariaExpanded = hasPopup;
	}
	edit(options) {
		const position = this.commentPopupPositionInLayer;
		let posX, posY;
		if (position) [posX, posY] = position;
		else {
			[posX, posY] = _classPrivateFieldGet2(_editor3, this).commentButtonPosition;
			const { width, height, x, y } = _classPrivateFieldGet2(_editor3, this);
			posX = x + posX * width;
			posY = y + posY * height;
		}
		const parentDimensions = _classPrivateFieldGet2(_editor3, this).parent.boundingClientRect;
		const { x: parentX, y: parentY, width: parentWidth, height: parentHeight } = parentDimensions;
		_classPrivateFieldGet2(_editor3, this)._uiManager.editComment(_classPrivateFieldGet2(_editor3, this), parentX + posX * parentWidth, parentY + posY * parentHeight, {
			...options,
			parentDimensions
		});
	}
	finish() {
		if (!_classPrivateFieldGet2(_commentToolbarButton, this)) return;
		_classPrivateFieldGet2(_commentToolbarButton, this).focus({ focusVisible: _classPrivateFieldGet2(_commentWasFromKeyBoard, this) });
		_classPrivateFieldSet2(_commentWasFromKeyBoard, this, false);
	}
	isDeleted() {
		return _classPrivateFieldGet2(_deleted, this) || _classPrivateFieldGet2(_text, this) === "";
	}
	isEmpty() {
		return _classPrivateFieldGet2(_text, this) === null;
	}
	hasBeenEdited() {
		return this.isDeleted() || _classPrivateFieldGet2(_text, this) !== _classPrivateFieldGet2(_initialText, this);
	}
	serialize() {
		return this.data;
	}
	get data() {
		return {
			text: _classPrivateFieldGet2(_text, this),
			richText: _classPrivateFieldGet2(_richText, this),
			date: _classPrivateFieldGet2(_date, this),
			deleted: this.isDeleted()
		};
	}
	set data(text) {
		if (text !== _classPrivateFieldGet2(_text, this)) _classPrivateFieldSet2(_richText, this, null);
		if (text === null) {
			_classPrivateFieldSet2(_text, this, "");
			_classPrivateFieldSet2(_deleted, this, true);
			return;
		}
		_classPrivateFieldSet2(_text, this, text);
		_classPrivateFieldSet2(_date, this, /* @__PURE__ */ new Date());
		_classPrivateFieldSet2(_deleted, this, false);
	}
	restoreData({ text, richText, date }) {
		_classPrivateFieldSet2(_text, this, text);
		_classPrivateFieldSet2(_richText, this, richText);
		_classPrivateFieldSet2(_date, this, date);
		_classPrivateFieldSet2(_deleted, this, false);
	}
	setInitialText(text, richText = null) {
		_classPrivateFieldSet2(_initialText, this, text);
		this.data = text;
		_classPrivateFieldSet2(_date, this, null);
		_classPrivateFieldSet2(_richText, this, richText);
	}
	shown() {}
	destroy() {
		_classPrivateFieldGet2(_commentToolbarButton, this)?.remove();
		_classPrivateFieldSet2(_commentToolbarButton, this, null);
		_classPrivateFieldGet2(_commentStandaloneButton, this)?.remove();
		_classPrivateFieldSet2(_commentStandaloneButton, this, null);
		_classPrivateFieldSet2(_text, this, "");
		_classPrivateFieldSet2(_richText, this, null);
		_classPrivateFieldSet2(_date, this, null);
		_classPrivateFieldSet2(_editor3, this, null);
		_classPrivateFieldSet2(_commentWasFromKeyBoard, this, false);
		_classPrivateFieldSet2(_deleted, this, false);
	}
};
function _render2(comment, isStandalone) {
	if (!_classPrivateFieldGet2(_editor3, this)._uiManager.hasCommentManager()) return null;
	comment.tabIndex = "0";
	comment.ariaHasPopup = "dialog";
	if (isStandalone) {
		comment.ariaControls = "commentPopup";
		comment.setAttribute("data-l10n-id", "pdfjs-show-comment-button");
	} else {
		comment.ariaControlsElements = [_classPrivateFieldGet2(_editor3, this)._uiManager.getCommentDialogElement()];
		comment.setAttribute("data-l10n-id", "pdfjs-editor-add-comment-button");
	}
	const signal = _classPrivateFieldGet2(_editor3, this)._uiManager._signal;
	if (!(signal instanceof AbortSignal) || signal.aborted) return comment;
	comment.addEventListener("contextmenu", noContextMenu, { signal });
	if (isStandalone) {
		comment.addEventListener("focusin", (e) => {
			_classPrivateFieldGet2(_editor3, this)._focusEventsAllowed = false;
			stopEvent(e);
		}, {
			capture: true,
			signal
		});
		comment.addEventListener("focusout", (e) => {
			_classPrivateFieldGet2(_editor3, this)._focusEventsAllowed = true;
			stopEvent(e);
		}, {
			capture: true,
			signal
		});
	}
	comment.addEventListener("pointerdown", (event) => event.stopPropagation(), { signal });
	const onClick = (event) => {
		event.preventDefault();
		if (comment === _classPrivateFieldGet2(_commentToolbarButton, this)) this.edit();
		else _classPrivateFieldGet2(_editor3, this).toggleComment(true);
	};
	comment.addEventListener("click", onClick, {
		capture: true,
		signal
	});
	comment.addEventListener("keydown", (event) => {
		if (event.target === comment && event.key === "Enter") {
			_classPrivateFieldSet2(_commentWasFromKeyBoard, this, true);
			onClick(event);
		}
	}, { signal });
	comment.addEventListener("pointerenter", () => {
		_classPrivateFieldGet2(_editor3, this).toggleComment(false, true);
	}, { signal });
	comment.addEventListener("pointerleave", () => {
		_classPrivateFieldGet2(_editor3, this).toggleComment(false, false);
	}, { signal });
	return comment;
}
var _container2 = /* @__PURE__ */ new WeakMap();
var _isPinching = /* @__PURE__ */ new WeakMap();
var _isPinchingStopped = /* @__PURE__ */ new WeakMap();
var _isPinchingDisabled = /* @__PURE__ */ new WeakMap();
var _onPinchStart = /* @__PURE__ */ new WeakMap();
var _onPinching = /* @__PURE__ */ new WeakMap();
var _onPinchEnd = /* @__PURE__ */ new WeakMap();
var _pointerDownAC = /* @__PURE__ */ new WeakMap();
var _signal = /* @__PURE__ */ new WeakMap();
var _touchInfo = /* @__PURE__ */ new WeakMap();
var _touchManagerAC = /* @__PURE__ */ new WeakMap();
var _touchMoveAC = /* @__PURE__ */ new WeakMap();
var _TouchManager_brand = /* @__PURE__ */ new WeakSet();
var TouchManager = class {
	constructor({ container, isPinchingDisabled = null, isPinchingStopped = null, onPinchStart = null, onPinching = null, onPinchEnd = null, signal }) {
		_classPrivateMethodInitSpec(this, _TouchManager_brand);
		_classPrivateFieldInitSpec(this, _container2, void 0);
		_classPrivateFieldInitSpec(this, _isPinching, false);
		_classPrivateFieldInitSpec(this, _isPinchingStopped, null);
		_classPrivateFieldInitSpec(this, _isPinchingDisabled, void 0);
		_classPrivateFieldInitSpec(this, _onPinchStart, void 0);
		_classPrivateFieldInitSpec(this, _onPinching, void 0);
		_classPrivateFieldInitSpec(this, _onPinchEnd, void 0);
		_classPrivateFieldInitSpec(this, _pointerDownAC, null);
		_classPrivateFieldInitSpec(this, _signal, void 0);
		_classPrivateFieldInitSpec(this, _touchInfo, null);
		_classPrivateFieldInitSpec(this, _touchManagerAC, void 0);
		_classPrivateFieldInitSpec(this, _touchMoveAC, null);
		_classPrivateFieldSet2(_container2, this, container);
		_classPrivateFieldSet2(_isPinchingStopped, this, isPinchingStopped);
		_classPrivateFieldSet2(_isPinchingDisabled, this, isPinchingDisabled);
		_classPrivateFieldSet2(_onPinchStart, this, onPinchStart);
		_classPrivateFieldSet2(_onPinching, this, onPinching);
		_classPrivateFieldSet2(_onPinchEnd, this, onPinchEnd);
		_classPrivateFieldSet2(_touchManagerAC, this, new AbortController());
		_classPrivateFieldSet2(_signal, this, AbortSignal.any([signal, _classPrivateFieldGet2(_touchManagerAC, this).signal]));
		container.addEventListener("touchstart", _assertClassBrand(_TouchManager_brand, this, _onTouchStart).bind(this), {
			passive: false,
			signal: _classPrivateFieldGet2(_signal, this)
		});
	}
	get MIN_TOUCH_DISTANCE_TO_PINCH() {
		return 35 / OutputScale.pixelRatio;
	}
	destroy() {
		_classPrivateFieldGet2(_touchManagerAC, this)?.abort();
		_classPrivateFieldSet2(_touchManagerAC, this, null);
		_classPrivateFieldGet2(_pointerDownAC, this)?.abort();
		_classPrivateFieldSet2(_pointerDownAC, this, null);
	}
};
_TouchManager = TouchManager;
function _onTouchStart(evt) {
	if (_classPrivateFieldGet2(_isPinchingDisabled, this)?.call(this)) return;
	if (evt.touches.length === 1) {
		if (_classPrivateFieldGet2(_pointerDownAC, this)) return;
		const pointerDownAC = _classPrivateFieldSet2(_pointerDownAC, this, new AbortController());
		const signal = AbortSignal.any([_classPrivateFieldGet2(_signal, this), pointerDownAC.signal]);
		const container = _classPrivateFieldGet2(_container2, this);
		const opts = {
			capture: true,
			signal,
			passive: false
		};
		const cancelPointerDown = (e) => {
			if (e.pointerType === "touch") {
				_classPrivateFieldGet2(_pointerDownAC, this)?.abort();
				_classPrivateFieldSet2(_pointerDownAC, this, null);
			}
		};
		container.addEventListener("pointerdown", (e) => {
			if (e.pointerType === "touch") {
				stopEvent(e);
				cancelPointerDown(e);
			}
		}, opts);
		container.addEventListener("pointerup", cancelPointerDown, opts);
		container.addEventListener("pointercancel", cancelPointerDown, opts);
		return;
	}
	if (!_classPrivateFieldGet2(_touchMoveAC, this)) {
		_classPrivateFieldSet2(_touchMoveAC, this, new AbortController());
		const signal = AbortSignal.any([_classPrivateFieldGet2(_signal, this), _classPrivateFieldGet2(_touchMoveAC, this).signal]);
		const container = _classPrivateFieldGet2(_container2, this);
		const opt = {
			signal,
			capture: false,
			passive: false
		};
		container.addEventListener("touchmove", _assertClassBrand(_TouchManager_brand, this, _onTouchMove).bind(this), opt);
		const onTouchEnd = _assertClassBrand(_TouchManager_brand, this, _onTouchEnd).bind(this);
		container.addEventListener("touchend", onTouchEnd, opt);
		container.addEventListener("touchcancel", onTouchEnd, opt);
		opt.capture = true;
		container.addEventListener("pointerdown", stopEvent, opt);
		container.addEventListener("pointermove", stopEvent, opt);
		container.addEventListener("pointercancel", stopEvent, opt);
		container.addEventListener("pointerup", stopEvent, opt);
		_classPrivateFieldGet2(_onPinchStart, this)?.call(this);
	}
	stopEvent(evt);
	if (evt.touches.length !== 2 || _classPrivateFieldGet2(_isPinchingStopped, this)?.call(this)) {
		_classPrivateFieldSet2(_touchInfo, this, null);
		return;
	}
	let [touch0, touch1] = evt.touches;
	if (touch0.identifier > touch1.identifier) [touch0, touch1] = [touch1, touch0];
	_classPrivateFieldSet2(_touchInfo, this, {
		touch0X: touch0.screenX,
		touch0Y: touch0.screenY,
		touch1X: touch1.screenX,
		touch1Y: touch1.screenY
	});
}
function _onTouchMove(evt) {
	if (!_classPrivateFieldGet2(_touchInfo, this) || evt.touches.length !== 2) return;
	stopEvent(evt);
	let [touch0, touch1] = evt.touches;
	if (touch0.identifier > touch1.identifier) [touch0, touch1] = [touch1, touch0];
	const { screenX: screen0X, screenY: screen0Y } = touch0;
	const { screenX: screen1X, screenY: screen1Y } = touch1;
	const touchInfo = _classPrivateFieldGet2(_touchInfo, this);
	const { touch0X: pTouch0X, touch0Y: pTouch0Y, touch1X: pTouch1X, touch1Y: pTouch1Y } = touchInfo;
	const prevGapX = pTouch1X - pTouch0X;
	const prevGapY = pTouch1Y - pTouch0Y;
	const currGapX = screen1X - screen0X;
	const currGapY = screen1Y - screen0Y;
	const distance = Math.hypot(currGapX, currGapY) || 1;
	const pDistance = Math.hypot(prevGapX, prevGapY) || 1;
	if (!_classPrivateFieldGet2(_isPinching, this) && Math.abs(pDistance - distance) <= _TouchManager.MIN_TOUCH_DISTANCE_TO_PINCH) return;
	touchInfo.touch0X = screen0X;
	touchInfo.touch0Y = screen0Y;
	touchInfo.touch1X = screen1X;
	touchInfo.touch1Y = screen1Y;
	if (!_classPrivateFieldGet2(_isPinching, this)) {
		_classPrivateFieldSet2(_isPinching, this, true);
		return;
	}
	const origin = [(screen0X + screen1X) / 2, (screen0Y + screen1Y) / 2];
	_classPrivateFieldGet2(_onPinching, this)?.call(this, origin, pDistance, distance);
}
function _onTouchEnd(evt) {
	if (evt.touches.length >= 2) return;
	if (_classPrivateFieldGet2(_touchMoveAC, this)) {
		_classPrivateFieldGet2(_touchMoveAC, this).abort();
		_classPrivateFieldSet2(_touchMoveAC, this, null);
		_classPrivateFieldGet2(_onPinchEnd, this)?.call(this);
	}
	if (!_classPrivateFieldGet2(_touchInfo, this)) return;
	stopEvent(evt);
	_classPrivateFieldSet2(_touchInfo, this, null);
	_classPrivateFieldSet2(_isPinching, this, false);
}
var _accessibilityData = /* @__PURE__ */ new WeakMap();
var _allResizerDivs = /* @__PURE__ */ new WeakMap();
var _altText3 = /* @__PURE__ */ new WeakMap();
var _comment2 = /* @__PURE__ */ new WeakMap();
var _commentStandaloneButton2 = /* @__PURE__ */ new WeakMap();
var _disabled = /* @__PURE__ */ new WeakMap();
var _dragPointerId = /* @__PURE__ */ new WeakMap();
var _dragPointerType = /* @__PURE__ */ new WeakMap();
var _resizersDiv = /* @__PURE__ */ new WeakMap();
var _lastPointerCoords = /* @__PURE__ */ new WeakMap();
var _savedDimensions = /* @__PURE__ */ new WeakMap();
var _fakeAnnotation = /* @__PURE__ */ new WeakMap();
var _focusAC = /* @__PURE__ */ new WeakMap();
var _focusedResizerName = /* @__PURE__ */ new WeakMap();
var _hasBeenClicked = /* @__PURE__ */ new WeakMap();
var _initialRect = /* @__PURE__ */ new WeakMap();
var _isEditing = /* @__PURE__ */ new WeakMap();
var _isInEditMode = /* @__PURE__ */ new WeakMap();
var _isResizerEnabledForKeyboard = /* @__PURE__ */ new WeakMap();
var _moveInDOMTimeout = /* @__PURE__ */ new WeakMap();
var _prevDragX = /* @__PURE__ */ new WeakMap();
var _prevDragY = /* @__PURE__ */ new WeakMap();
var _telemetryTimeouts = /* @__PURE__ */ new WeakMap();
var _touchManager = /* @__PURE__ */ new WeakMap();
var _isDraggable = /* @__PURE__ */ new WeakMap();
var _zIndex = /* @__PURE__ */ new WeakMap();
var _AnnotationEditor_brand = /* @__PURE__ */ new WeakSet();
var AnnotationEditor = class AnnotationEditor {
	static get _resizerKeyboardManager() {
		const resize = AnnotationEditor.prototype._resizeWithKeyboard;
		const small = AnnotationEditorUIManager.TRANSLATE_SMALL;
		const big = AnnotationEditorUIManager.TRANSLATE_BIG;
		return shadow(this, "_resizerKeyboardManager", new KeyboardManager([
			[
				["ArrowLeft", "mac+ArrowLeft"],
				resize,
				{ args: [-small, 0] }
			],
			[
				["ctrl+ArrowLeft", "mac+shift+ArrowLeft"],
				resize,
				{ args: [-big, 0] }
			],
			[
				["ArrowRight", "mac+ArrowRight"],
				resize,
				{ args: [small, 0] }
			],
			[
				["ctrl+ArrowRight", "mac+shift+ArrowRight"],
				resize,
				{ args: [big, 0] }
			],
			[
				["ArrowUp", "mac+ArrowUp"],
				resize,
				{ args: [0, -small] }
			],
			[
				["ctrl+ArrowUp", "mac+shift+ArrowUp"],
				resize,
				{ args: [0, -big] }
			],
			[
				["ArrowDown", "mac+ArrowDown"],
				resize,
				{ args: [0, small] }
			],
			[
				["ctrl+ArrowDown", "mac+shift+ArrowDown"],
				resize,
				{ args: [0, big] }
			],
			[["Escape", "mac+Escape"], AnnotationEditor.prototype._stopResizingWithKeyboard]
		]));
	}
	constructor(parameters) {
		_classPrivateMethodInitSpec(this, _AnnotationEditor_brand);
		_classPrivateFieldInitSpec(this, _accessibilityData, null);
		_classPrivateFieldInitSpec(this, _allResizerDivs, null);
		_classPrivateFieldInitSpec(this, _altText3, null);
		_classPrivateFieldInitSpec(this, _comment2, null);
		_classPrivateFieldInitSpec(this, _commentStandaloneButton2, null);
		_classPrivateFieldInitSpec(this, _disabled, false);
		_classPrivateFieldInitSpec(this, _dragPointerId, null);
		_classPrivateFieldInitSpec(this, _dragPointerType, "");
		_classPrivateFieldInitSpec(this, _resizersDiv, null);
		_classPrivateFieldInitSpec(this, _lastPointerCoords, null);
		_classPrivateFieldInitSpec(this, _savedDimensions, null);
		_classPrivateFieldInitSpec(this, _fakeAnnotation, null);
		_classPrivateFieldInitSpec(this, _focusAC, null);
		_classPrivateFieldInitSpec(this, _focusedResizerName, "");
		_classPrivateFieldInitSpec(this, _hasBeenClicked, false);
		_classPrivateFieldInitSpec(this, _initialRect, null);
		_classPrivateFieldInitSpec(this, _isEditing, false);
		_classPrivateFieldInitSpec(this, _isInEditMode, false);
		_classPrivateFieldInitSpec(this, _isResizerEnabledForKeyboard, false);
		_classPrivateFieldInitSpec(this, _moveInDOMTimeout, null);
		_classPrivateFieldInitSpec(this, _prevDragX, 0);
		_classPrivateFieldInitSpec(this, _prevDragY, 0);
		_classPrivateFieldInitSpec(this, _telemetryTimeouts, null);
		_classPrivateFieldInitSpec(this, _touchManager, null);
		_defineProperty(this, "isSelected", false);
		_defineProperty(this, "_isCopy", false);
		_defineProperty(this, "_editToolbar", null);
		_defineProperty(this, "_initialOptions", Object.create(null));
		_defineProperty(this, "_initialData", null);
		_defineProperty(this, "_isVisible", true);
		_defineProperty(this, "_uiManager", null);
		_defineProperty(this, "_focusEventsAllowed", true);
		_classPrivateFieldInitSpec(this, _isDraggable, false);
		_classPrivateFieldInitSpec(this, _zIndex, AnnotationEditor._zIndex++);
		this.parent = parameters.parent;
		this.id = parameters.id;
		this.width = this.height = null;
		this.pageIndex = parameters.parent.pageIndex;
		this.name = parameters.name;
		this.div = null;
		this._uiManager = parameters.uiManager;
		this.annotationElementId = null;
		this._willKeepAspectRatio = false;
		this._initialOptions.isCentered = parameters.isCentered;
		this._structTreeParentId = null;
		this.annotationElementId = parameters.annotationElementId || null;
		this.creationDate = parameters.creationDate || /* @__PURE__ */ new Date();
		this.modificationDate = parameters.modificationDate || null;
		this.canAddComment = true;
		const { rotation, rawDims: { pageWidth, pageHeight, pageX, pageY } } = this.parent.viewport;
		this.rotation = rotation;
		this.pageRotation = (360 + rotation - this._uiManager.viewParameters.rotation) % 360;
		this.pageDimensions = [pageWidth, pageHeight];
		this.pageTranslation = [pageX, pageY];
		const [width, height] = this.parentDimensions;
		this.x = parameters.x / width;
		this.y = parameters.y / height;
		this.isAttachedToDOM = false;
		this.deleted = false;
	}
	updatePageIndex(newPageIndex) {
		this.pageIndex = newPageIndex;
	}
	get editorType() {
		return Object.getPrototypeOf(this).constructor._type;
	}
	get mode() {
		return Object.getPrototypeOf(this).constructor._editorType;
	}
	static get isDrawer() {
		return false;
	}
	static get _defaultLineColor() {
		return shadow(this, "_defaultLineColor", this._colorManager.getHexCode("CanvasText"));
	}
	static deleteAnnotationElement(editor) {
		const fakeEditor = new FakeEditor({
			id: editor._uiManager.getId(),
			parent: editor.parent,
			uiManager: editor._uiManager
		});
		fakeEditor.annotationElementId = editor.annotationElementId;
		fakeEditor.deleted = true;
		fakeEditor._uiManager.addToAnnotationStorage(fakeEditor);
	}
	static initialize(l10n, _uiManager) {
		AnnotationEditor._l10n ?? (AnnotationEditor._l10n = l10n);
		AnnotationEditor._l10nResizer || (AnnotationEditor._l10nResizer = Object.freeze({
			topLeft: "pdfjs-editor-resizer-top-left",
			topMiddle: "pdfjs-editor-resizer-top-middle",
			topRight: "pdfjs-editor-resizer-top-right",
			middleRight: "pdfjs-editor-resizer-middle-right",
			bottomRight: "pdfjs-editor-resizer-bottom-right",
			bottomMiddle: "pdfjs-editor-resizer-bottom-middle",
			bottomLeft: "pdfjs-editor-resizer-bottom-left",
			middleLeft: "pdfjs-editor-resizer-middle-left"
		}));
		if (AnnotationEditor._borderLineWidth !== -1) return;
		const style = getComputedStyle(document.documentElement);
		AnnotationEditor._borderLineWidth = parseFloat(style.getPropertyValue("--outline-width")) || 0;
	}
	static updateDefaultParams(_type, _value) {}
	static get defaultPropertiesToUpdate() {
		return [];
	}
	static isHandlingMimeForPasting(mime) {
		return false;
	}
	static paste(item, parent) {
		unreachable("Not implemented");
	}
	get propertiesToUpdate() {
		return [];
	}
	get _isDraggable() {
		return _classPrivateFieldGet2(_isDraggable, this);
	}
	set _isDraggable(value) {
		_classPrivateFieldSet2(_isDraggable, this, value);
		this.div?.classList.toggle("draggable", value);
	}
	get uid() {
		return this.annotationElementId || this.id;
	}
	get isEnterHandled() {
		return true;
	}
	center() {
		const [pageWidth, pageHeight] = this.pageDimensions;
		switch (this.parentRotation) {
			case 90:
				this.x -= this.height * pageHeight / (pageWidth * 2);
				this.y += this.width * pageWidth / (pageHeight * 2);
				break;
			case 180:
				this.x += this.width / 2;
				this.y += this.height / 2;
				break;
			case 270:
				this.x += this.height * pageHeight / (pageWidth * 2);
				this.y -= this.width * pageWidth / (pageHeight * 2);
				break;
			default:
				this.x -= this.width / 2;
				this.y -= this.height / 2;
				break;
		}
		this.fixAndSetPosition();
	}
	addCommands(params) {
		this._uiManager.addCommands(params);
	}
	get currentLayer() {
		return this._uiManager.currentLayer;
	}
	setInBackground() {
		this.div.style.zIndex = 0;
	}
	setInForeground() {
		this.div.style.zIndex = _classPrivateFieldGet2(_zIndex, this);
	}
	setParent(parent) {
		if (parent !== null) {
			this.pageIndex = parent.pageIndex;
			this.pageDimensions = parent.pageDimensions;
		} else {
			_assertClassBrand(_AnnotationEditor_brand, this, _stopResizing).call(this);
			_classPrivateFieldGet2(_fakeAnnotation, this)?.remove();
			_classPrivateFieldSet2(_fakeAnnotation, this, null);
		}
		this.parent = parent;
	}
	focusin(event) {
		if (!this._focusEventsAllowed) return;
		if (!_classPrivateFieldGet2(_hasBeenClicked, this)) this.parent.setSelected(this);
		else _classPrivateFieldSet2(_hasBeenClicked, this, false);
	}
	focusout(event) {
		if (!this._focusEventsAllowed) return;
		if (!this.isAttachedToDOM) return;
		if (event.relatedTarget?.closest(`#${this.id}`)) return;
		event.preventDefault();
		if (!this.parent?.isMultipleSelection) this.commitOrRemove();
	}
	commitOrRemove() {
		if (this.isEmpty()) this.remove();
		else this.commit();
	}
	commit() {
		if (!this.isInEditMode()) return;
		this.addToAnnotationStorage();
	}
	addToAnnotationStorage() {
		this._uiManager.addToAnnotationStorage(this);
	}
	setAt(x, y, tx, ty) {
		const [width, height] = this.parentDimensions;
		[tx, ty] = this.screenToPageTranslation(tx, ty);
		this.x = (x + tx) / width;
		this.y = (y + ty) / height;
		this.fixAndSetPosition();
	}
	_moveAfterPaste(baseX, baseY) {
		if (this.isClone) {
			delete this.isClone;
			return;
		}
		const [parentWidth, parentHeight] = this.parentDimensions;
		this.setAt(baseX * parentWidth, baseY * parentHeight, this.width * parentWidth, this.height * parentHeight);
		this._onTranslated();
	}
	translate(x, y) {
		_assertClassBrand(_AnnotationEditor_brand, this, _translate).call(this, this.parentDimensions, x, y);
	}
	translateInPage(x, y) {
		_classPrivateFieldGet2(_initialRect, this) || _classPrivateFieldSet2(_initialRect, this, [
			this.x,
			this.y,
			this.width,
			this.height
		]);
		_assertClassBrand(_AnnotationEditor_brand, this, _translate).call(this, this.pageDimensions, x, y);
		this.div.scrollIntoView({ block: "nearest" });
	}
	translationDone() {
		this._onTranslated(this.x, this.y);
	}
	drag(tx, ty) {
		_classPrivateFieldGet2(_initialRect, this) || _classPrivateFieldSet2(_initialRect, this, [
			this.x,
			this.y,
			this.width,
			this.height
		]);
		const { div, parentDimensions: [parentWidth, parentHeight] } = this;
		this.x += tx / parentWidth;
		this.y += ty / parentHeight;
		if (this.parent && (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1)) {
			const { x, y } = this.div.getBoundingClientRect();
			if (this.parent.findNewParent(this, x, y)) {
				this.x -= Math.floor(this.x);
				this.y -= Math.floor(this.y);
			}
		}
		let { x, y } = this;
		const [bx, by] = this.getBaseTranslation();
		x += bx;
		y += by;
		const { style } = div;
		style.left = `${(100 * x).toFixed(2)}%`;
		style.top = `${(100 * y).toFixed(2)}%`;
		this._onTranslating(x, y);
		div.scrollIntoView({ block: "nearest" });
	}
	_onTranslating(x, y) {}
	_onTranslated(x, y) {}
	get _hasBeenMoved() {
		return !!_classPrivateFieldGet2(_initialRect, this) && (_classPrivateFieldGet2(_initialRect, this)[0] !== this.x || _classPrivateFieldGet2(_initialRect, this)[1] !== this.y);
	}
	get _hasBeenResized() {
		return !!_classPrivateFieldGet2(_initialRect, this) && (_classPrivateFieldGet2(_initialRect, this)[2] !== this.width || _classPrivateFieldGet2(_initialRect, this)[3] !== this.height);
	}
	getBaseTranslation() {
		const [parentWidth, parentHeight] = this.parentDimensions;
		const { _borderLineWidth } = AnnotationEditor;
		const x = _borderLineWidth / parentWidth;
		const y = _borderLineWidth / parentHeight;
		switch (this.rotation) {
			case 90: return [-x, y];
			case 180: return [x, y];
			case 270: return [x, -y];
			default: return [-x, -y];
		}
	}
	get _mustFixPosition() {
		return true;
	}
	fixAndSetPosition(rotation = this.rotation) {
		const { div: { style }, pageDimensions: [pageWidth, pageHeight] } = this;
		let { x, y, width, height } = this;
		width *= pageWidth;
		height *= pageHeight;
		x *= pageWidth;
		y *= pageHeight;
		if (this._mustFixPosition) switch (rotation) {
			case 0:
				x = MathClamp(x, 0, pageWidth - width);
				y = MathClamp(y, 0, pageHeight - height);
				break;
			case 90:
				x = MathClamp(x, 0, pageWidth - height);
				y = MathClamp(y, width, pageHeight);
				break;
			case 180:
				x = MathClamp(x, width, pageWidth);
				y = MathClamp(y, height, pageHeight);
				break;
			case 270:
				x = MathClamp(x, height, pageWidth);
				y = MathClamp(y, 0, pageHeight - width);
				break;
		}
		this.x = x /= pageWidth;
		this.y = y /= pageHeight;
		const [bx, by] = this.getBaseTranslation();
		x += bx;
		y += by;
		style.left = `${(100 * x).toFixed(2)}%`;
		style.top = `${(100 * y).toFixed(2)}%`;
		this.moveInDOM();
	}
	screenToPageTranslation(x, y) {
		return _rotatePoint.call(AnnotationEditor, x, y, this.parentRotation);
	}
	pageTranslationToScreen(x, y) {
		return _rotatePoint.call(AnnotationEditor, x, y, 360 - this.parentRotation);
	}
	get parentScale() {
		return this._uiManager.viewParameters.realScale;
	}
	get parentRotation() {
		return (this._uiManager.viewParameters.rotation + this.pageRotation) % 360;
	}
	get parentDimensions() {
		const { parentScale, pageDimensions: [pageWidth, pageHeight] } = this;
		return [pageWidth * parentScale, pageHeight * parentScale];
	}
	setDims() {
		const { div: { style }, width, height } = this;
		style.width = `${(100 * width).toFixed(2)}%`;
		style.height = `${(100 * height).toFixed(2)}%`;
	}
	getInitialTranslation() {
		return [0, 0];
	}
	_onResized() {}
	static _round(x) {
		return Math.round(x * 1e4) / 1e4;
	}
	_onResizing() {}
	altTextFinish() {
		_classPrivateFieldGet2(_altText3, this)?.finish();
	}
	get toolbarButtons() {
		return null;
	}
	async addEditToolbar() {
		if (this._editToolbar || _classPrivateFieldGet2(_isInEditMode, this)) return this._editToolbar;
		this._editToolbar = new EditorToolbar(this);
		this.div.append(this._editToolbar.render());
		const { toolbarButtons } = this;
		if (toolbarButtons) for (const [name, tool] of toolbarButtons) await this._editToolbar.addButton(name, tool);
		if (!this.hasComment) this._editToolbar.addButton("comment", this.addCommentButton());
		this._editToolbar.addButton("delete");
		return this._editToolbar;
	}
	addCommentButtonInToolbar() {
		this._editToolbar?.addButtonBefore("comment", this.addCommentButton(), ".deleteButton");
	}
	removeCommentButtonFromToolbar() {
		this._editToolbar?.removeButton("comment");
	}
	removeEditToolbar() {
		this._editToolbar?.remove();
		this._editToolbar = null;
		_classPrivateFieldGet2(_altText3, this)?.destroy();
	}
	addContainer(container) {
		const editToolbarDiv = this._editToolbar?.div;
		if (editToolbarDiv) editToolbarDiv.before(container);
		else this.div.append(container);
	}
	getClientDimensions() {
		return this.div.getBoundingClientRect();
	}
	createAltText() {
		if (!_classPrivateFieldGet2(_altText3, this)) {
			AltText.initialize(AnnotationEditor._l10n);
			_classPrivateFieldSet2(_altText3, this, new AltText(this));
			if (_classPrivateFieldGet2(_accessibilityData, this)) {
				_classPrivateFieldGet2(_altText3, this).data = _classPrivateFieldGet2(_accessibilityData, this);
				_classPrivateFieldSet2(_accessibilityData, this, null);
			}
		}
		return _classPrivateFieldGet2(_altText3, this);
	}
	get altTextData() {
		return _classPrivateFieldGet2(_altText3, this)?.data;
	}
	set altTextData(data) {
		if (!_classPrivateFieldGet2(_altText3, this)) return;
		_classPrivateFieldGet2(_altText3, this).data = data;
	}
	get guessedAltText() {
		return _classPrivateFieldGet2(_altText3, this)?.guessedText;
	}
	async setGuessedAltText(text) {
		await _classPrivateFieldGet2(_altText3, this)?.setGuessedText(text);
	}
	serializeAltText(isForCopying) {
		return _classPrivateFieldGet2(_altText3, this)?.serialize(isForCopying);
	}
	hasAltText() {
		return !!_classPrivateFieldGet2(_altText3, this) && !_classPrivateFieldGet2(_altText3, this).isEmpty();
	}
	hasAltTextData() {
		return _classPrivateFieldGet2(_altText3, this)?.hasData() ?? false;
	}
	focusCommentButton() {
		_classPrivateFieldGet2(_comment2, this)?.focusButton();
	}
	addCommentButton() {
		return this.canAddComment ? _classPrivateFieldGet2(_comment2, this) || _classPrivateFieldSet2(_comment2, this, new Comment(this)) : null;
	}
	addStandaloneCommentButton() {
		if (!this._uiManager.hasCommentManager()) return;
		if (_classPrivateFieldGet2(_commentStandaloneButton2, this)) {
			if (this._uiManager.isEditingMode()) _classPrivateFieldGet2(_commentStandaloneButton2, this).classList.remove("hidden");
			return;
		}
		if (!this.hasComment) return;
		_classPrivateFieldSet2(_commentStandaloneButton2, this, _classPrivateFieldGet2(_comment2, this).renderForStandalone());
		this.div.append(_classPrivateFieldGet2(_commentStandaloneButton2, this));
	}
	removeStandaloneCommentButton() {
		_classPrivateFieldGet2(_comment2, this).removeStandaloneCommentButton();
		_classPrivateFieldSet2(_commentStandaloneButton2, this, null);
	}
	hideStandaloneCommentButton() {
		_classPrivateFieldGet2(_commentStandaloneButton2, this)?.classList.add("hidden");
	}
	get comment() {
		if (!_classPrivateFieldGet2(_comment2, this)) return null;
		const { data: { richText, text, date, deleted } } = _classPrivateFieldGet2(_comment2, this);
		return {
			text,
			richText,
			date,
			deleted,
			color: this.getNonHCMColor(),
			opacity: this.opacity ?? 1
		};
	}
	set comment(value) {
		_classPrivateFieldGet2(_comment2, this) || _classPrivateFieldSet2(_comment2, this, new Comment(this));
		if (typeof value === "object" && value !== null) _classPrivateFieldGet2(_comment2, this).restoreData(value);
		else _classPrivateFieldGet2(_comment2, this).data = value;
		if (this.hasComment) {
			this.removeCommentButtonFromToolbar();
			this.addStandaloneCommentButton();
			this._uiManager.updateComment(this);
		} else {
			this.addCommentButtonInToolbar();
			this.removeStandaloneCommentButton();
			this._uiManager.removeComment(this);
		}
	}
	setCommentData({ comment, popupRef, richText }) {
		if (!popupRef) return;
		_classPrivateFieldGet2(_comment2, this) || _classPrivateFieldSet2(_comment2, this, new Comment(this));
		_classPrivateFieldGet2(_comment2, this).setInitialText(comment, richText);
		if (!this.annotationElementId) return;
		const storedData = this._uiManager.getAndRemoveDataFromAnnotationStorage(this.annotationElementId);
		if (storedData) this.updateFromAnnotationLayer(storedData);
	}
	get hasEditedComment() {
		return _classPrivateFieldGet2(_comment2, this)?.hasBeenEdited();
	}
	get hasDeletedComment() {
		return _classPrivateFieldGet2(_comment2, this)?.isDeleted();
	}
	get hasComment() {
		return !!_classPrivateFieldGet2(_comment2, this) && !_classPrivateFieldGet2(_comment2, this).isEmpty() && !_classPrivateFieldGet2(_comment2, this).isDeleted();
	}
	async editComment(options) {
		_classPrivateFieldGet2(_comment2, this) || _classPrivateFieldSet2(_comment2, this, new Comment(this));
		_classPrivateFieldGet2(_comment2, this).edit(options);
	}
	toggleComment(isSelected, visibility = void 0) {
		if (this.hasComment) this._uiManager.toggleComment(this, isSelected, visibility);
	}
	setSelectedCommentButton(selected) {
		_classPrivateFieldGet2(_comment2, this).setSelectedButton(selected);
	}
	addComment(serialized) {
		if (this.hasEditedComment) {
			const DEFAULT_POPUP_WIDTH = 180;
			const DEFAULT_POPUP_HEIGHT = 100;
			const [, , , trY] = serialized.rect;
			const [pageWidth] = this.pageDimensions;
			const [pageX] = this.pageTranslation;
			const blX = pageX + pageWidth + 1;
			const blY = trY - DEFAULT_POPUP_HEIGHT;
			const trX = blX + DEFAULT_POPUP_WIDTH;
			serialized.popup = {
				contents: this.comment.text,
				deleted: this.comment.deleted,
				rect: [
					blX,
					blY,
					trX,
					trY
				]
			};
		}
	}
	updateFromAnnotationLayer({ popup: { contents, deleted } }) {
		_classPrivateFieldGet2(_comment2, this).data = deleted ? null : contents;
	}
	get parentBoundingClientRect() {
		return this.parent.boundingClientRect;
	}
	render() {
		const div = this.div = document.createElement("div");
		div.setAttribute("data-editor-rotation", (360 - this.rotation) % 360);
		div.className = this.name;
		div.setAttribute("id", this.id);
		div.tabIndex = _classPrivateFieldGet2(_disabled, this) ? -1 : 0;
		div.setAttribute("role", "application");
		if (this.defaultL10nId) div.setAttribute("data-l10n-id", this.defaultL10nId);
		if (!this._isVisible) div.classList.add("hidden");
		this.setInForeground();
		_assertClassBrand(_AnnotationEditor_brand, this, _addFocusListeners).call(this);
		const [parentWidth, parentHeight] = this.parentDimensions;
		if (this.parentRotation % 180 !== 0) {
			div.style.maxWidth = `${(100 * parentHeight / parentWidth).toFixed(2)}%`;
			div.style.maxHeight = `${(100 * parentWidth / parentHeight).toFixed(2)}%`;
		}
		const [tx, ty] = this.getInitialTranslation();
		this.translate(tx, ty);
		bindEvents(this, div, [
			"keydown",
			"pointerdown",
			"dblclick"
		]);
		if (this.isResizable && this._uiManager._supportsPinchToZoom) _classPrivateFieldGet2(_touchManager, this) || _classPrivateFieldSet2(_touchManager, this, new TouchManager({
			container: div,
			isPinchingDisabled: () => !this.isSelected,
			onPinchStart: _assertClassBrand(_AnnotationEditor_brand, this, _touchPinchStartCallback).bind(this),
			onPinching: _assertClassBrand(_AnnotationEditor_brand, this, _touchPinchCallback).bind(this),
			onPinchEnd: _assertClassBrand(_AnnotationEditor_brand, this, _touchPinchEndCallback).bind(this),
			signal: this._uiManager._signal
		}));
		this.addStandaloneCommentButton();
		this._uiManager._editorUndoBar?.hide();
		return div;
	}
	pointerdown(event) {
		const { isMac } = FeatureTest.platform;
		if (event.button !== 0 || event.ctrlKey && isMac) {
			event.preventDefault();
			return;
		}
		_classPrivateFieldSet2(_hasBeenClicked, this, true);
		if (this._isDraggable) {
			_assertClassBrand(_AnnotationEditor_brand, this, _setUpDragSession).call(this, event);
			return;
		}
		_assertClassBrand(_AnnotationEditor_brand, this, _selectOnPointerEvent).call(this, event);
	}
	_onStartDragging() {}
	_onStopDragging() {}
	moveInDOM() {
		if (_classPrivateFieldGet2(_moveInDOMTimeout, this)) clearTimeout(_classPrivateFieldGet2(_moveInDOMTimeout, this));
		_classPrivateFieldSet2(_moveInDOMTimeout, this, setTimeout(() => {
			_classPrivateFieldSet2(_moveInDOMTimeout, this, null);
			this.parent?.moveEditorInDOM(this);
		}, 0));
	}
	_setParentAndPosition(parent, x, y) {
		parent.changeParent(this);
		this.x = x;
		this.y = y;
		this.fixAndSetPosition();
		this._onTranslated();
	}
	getRect(tx, ty, rotation = this.rotation) {
		const scale = this.parentScale;
		const [pageWidth, pageHeight] = this.pageDimensions;
		const [pageX, pageY] = this.pageTranslation;
		const shiftX = tx / scale;
		const shiftY = ty / scale;
		const x = this.x * pageWidth;
		const y = this.y * pageHeight;
		const width = this.width * pageWidth;
		const height = this.height * pageHeight;
		switch (rotation) {
			case 0: return [
				x + shiftX + pageX,
				pageHeight - y - shiftY - height + pageY,
				x + shiftX + width + pageX,
				pageHeight - y - shiftY + pageY
			];
			case 90: return [
				x + shiftY + pageX,
				pageHeight - y + shiftX + pageY,
				x + shiftY + height + pageX,
				pageHeight - y + shiftX + width + pageY
			];
			case 180: return [
				x - shiftX - width + pageX,
				pageHeight - y + shiftY + pageY,
				x - shiftX + pageX,
				pageHeight - y + shiftY + height + pageY
			];
			case 270: return [
				x - shiftY - height + pageX,
				pageHeight - y - shiftX - width + pageY,
				x - shiftY + pageX,
				pageHeight - y - shiftX + pageY
			];
			default: throw new Error("Invalid rotation");
		}
	}
	getRectInCurrentCoords(rect, pageHeight) {
		const [x1, y1, x2, y2] = rect;
		const width = x2 - x1;
		const height = y2 - y1;
		switch (this.rotation) {
			case 0: return [
				x1,
				pageHeight - y2,
				width,
				height
			];
			case 90: return [
				x1,
				pageHeight - y1,
				height,
				width
			];
			case 180: return [
				x2,
				pageHeight - y1,
				width,
				height
			];
			case 270: return [
				x2,
				pageHeight - y2,
				height,
				width
			];
			default: throw new Error("Invalid rotation");
		}
	}
	getPDFRect() {
		return this.getRect(0, 0);
	}
	getNonHCMColor() {
		return this.color && AnnotationEditor._colorManager.convert(this._uiManager.getNonHCMColor(this.color));
	}
	onUpdatedColor() {
		_classPrivateFieldGet2(_comment2, this)?.onUpdatedColor();
	}
	getData() {
		const { comment: { text: str, color, date, opacity, deleted, richText }, uid: id, pageIndex, creationDate, modificationDate } = this;
		return {
			id,
			pageIndex,
			rect: this.getPDFRect(),
			richText,
			contentsObj: { str },
			creationDate,
			modificationDate: date || modificationDate,
			popupRef: !deleted,
			color,
			opacity
		};
	}
	onceAdded(focus) {}
	isEmpty() {
		return false;
	}
	enableEditMode() {
		if (this.isInEditMode()) return false;
		this.parent.setEditingState(false);
		_classPrivateFieldSet2(_isInEditMode, this, true);
		return true;
	}
	disableEditMode() {
		if (!this.isInEditMode()) return false;
		this.parent.setEditingState(true);
		_classPrivateFieldSet2(_isInEditMode, this, false);
		return true;
	}
	isInEditMode() {
		return _classPrivateFieldGet2(_isInEditMode, this);
	}
	shouldGetKeyboardEvents() {
		return _classPrivateFieldGet2(_isResizerEnabledForKeyboard, this);
	}
	needsToBeRebuilt() {
		return this.div && !this.isAttachedToDOM;
	}
	get isOnScreen() {
		const { top, left, bottom, right } = this.getClientDimensions();
		const { innerHeight, innerWidth } = window;
		return left < innerWidth && right > 0 && top < innerHeight && bottom > 0;
	}
	rebuild() {
		_assertClassBrand(_AnnotationEditor_brand, this, _addFocusListeners).call(this);
	}
	rotate(_angle) {}
	resize() {}
	serializeDeleted() {
		return {
			id: this.annotationElementId,
			deleted: true,
			pageIndex: this.pageIndex,
			popupRef: this._initialData?.popupRef || ""
		};
	}
	serialize(isForCopying = false, context = null) {
		return {
			annotationType: this.mode,
			pageIndex: this.pageIndex,
			rect: this.getPDFRect(),
			rotation: this.rotation,
			structTreeParentId: this._structTreeParentId,
			popupRef: this._initialData?.popupRef || ""
		};
	}
	static async deserialize(data, parent, uiManager) {
		const editor = new this.prototype.constructor({
			parent,
			id: uiManager.getId(),
			uiManager,
			annotationElementId: data.annotationElementId,
			creationDate: data.creationDate,
			modificationDate: data.modificationDate
		});
		editor.rotation = data.rotation;
		_classPrivateFieldSet2(_accessibilityData, editor, data.accessibilityData);
		editor._isCopy = data.isCopy || false;
		const [pageWidth, pageHeight] = editor.pageDimensions;
		const [x, y, width, height] = editor.getRectInCurrentCoords(data.rect, pageHeight);
		editor.x = x / pageWidth;
		editor.y = y / pageHeight;
		editor.width = width / pageWidth;
		editor.height = height / pageHeight;
		return editor;
	}
	get hasBeenModified() {
		return !!this.annotationElementId && (this.deleted || this.serialize() !== null);
	}
	remove() {
		_classPrivateFieldGet2(_focusAC, this)?.abort();
		_classPrivateFieldSet2(_focusAC, this, null);
		if (!this.isEmpty()) this.commit();
		if (this.parent) this.parent.remove(this);
		else this._uiManager.removeEditor(this);
		this.hideCommentPopup();
		if (_classPrivateFieldGet2(_moveInDOMTimeout, this)) {
			clearTimeout(_classPrivateFieldGet2(_moveInDOMTimeout, this));
			_classPrivateFieldSet2(_moveInDOMTimeout, this, null);
		}
		_assertClassBrand(_AnnotationEditor_brand, this, _stopResizing).call(this);
		this.removeEditToolbar();
		if (_classPrivateFieldGet2(_telemetryTimeouts, this)) {
			for (const timeout of _classPrivateFieldGet2(_telemetryTimeouts, this).values()) clearTimeout(timeout);
			_classPrivateFieldSet2(_telemetryTimeouts, this, null);
		}
		this.parent = null;
		_classPrivateFieldGet2(_touchManager, this)?.destroy();
		_classPrivateFieldSet2(_touchManager, this, null);
		_classPrivateFieldGet2(_fakeAnnotation, this)?.remove();
		_classPrivateFieldSet2(_fakeAnnotation, this, null);
	}
	get isResizable() {
		return false;
	}
	makeResizable() {
		if (this.isResizable) {
			_assertClassBrand(_AnnotationEditor_brand, this, _createResizers).call(this);
			_classPrivateFieldGet2(_resizersDiv, this).classList.remove("hidden");
		}
	}
	get toolbarPosition() {
		return null;
	}
	get commentButtonPosition() {
		return this._uiManager.direction === "ltr" ? [1, 0] : [0, 0];
	}
	get commentButtonPositionInPage() {
		const { commentButtonPosition: [posX, posY] } = this;
		const [blX, blY, trX, trY] = this.getPDFRect();
		return [AnnotationEditor._round(blX + (trX - blX) * posX), AnnotationEditor._round(blY + (trY - blY) * (1 - posY))];
	}
	get commentButtonColor() {
		return this._uiManager.makeCommentColor(this.getNonHCMColor(), this.opacity);
	}
	get commentPopupPosition() {
		return _classPrivateFieldGet2(_comment2, this).commentPopupPositionInLayer;
	}
	set commentPopupPosition(pos) {
		_classPrivateFieldGet2(_comment2, this).commentPopupPositionInLayer = pos;
	}
	hasDefaultPopupPosition() {
		return _classPrivateFieldGet2(_comment2, this).hasDefaultPopupPosition();
	}
	get commentButtonWidth() {
		return _classPrivateFieldGet2(_comment2, this).commentButtonWidth;
	}
	get elementBeforePopup() {
		return this.div;
	}
	setCommentButtonStates(options) {
		_classPrivateFieldGet2(_comment2, this)?.setCommentButtonStates(options);
	}
	keydown(event) {
		if (!this.isResizable || event.target !== this.div || event.key !== "Enter") return;
		this._uiManager.setSelected(this);
		_classPrivateFieldSet2(_savedDimensions, this, {
			savedX: this.x,
			savedY: this.y,
			savedWidth: this.width,
			savedHeight: this.height
		});
		const children = _classPrivateFieldGet2(_resizersDiv, this).children;
		if (!_classPrivateFieldGet2(_allResizerDivs, this)) {
			_classPrivateFieldSet2(_allResizerDivs, this, Array.from(children));
			const boundResizerKeydown = _assertClassBrand(_AnnotationEditor_brand, this, _resizerKeydown).bind(this);
			const boundResizerBlur = _assertClassBrand(_AnnotationEditor_brand, this, _resizerBlur).bind(this);
			const signal = this._uiManager._signal;
			for (const div of _classPrivateFieldGet2(_allResizerDivs, this)) {
				const name = div.getAttribute("data-resizer-name");
				div.setAttribute("role", "spinbutton");
				div.addEventListener("keydown", boundResizerKeydown, { signal });
				div.addEventListener("blur", boundResizerBlur, { signal });
				div.addEventListener("focus", _assertClassBrand(_AnnotationEditor_brand, this, _resizerFocus).bind(this, name), { signal });
				div.setAttribute("data-l10n-id", AnnotationEditor._l10nResizer[name]);
			}
		}
		const first = _classPrivateFieldGet2(_allResizerDivs, this)[0];
		let firstPosition = 0;
		for (const div of children) {
			if (div === first) break;
			firstPosition++;
		}
		const nextFirstPosition = (360 - this.rotation + this.parentRotation) % 360 / 90 * (_classPrivateFieldGet2(_allResizerDivs, this).length / 4);
		if (nextFirstPosition !== firstPosition) {
			if (nextFirstPosition < firstPosition) for (let i = 0; i < firstPosition - nextFirstPosition; i++) _classPrivateFieldGet2(_resizersDiv, this).append(_classPrivateFieldGet2(_resizersDiv, this).firstElementChild);
			else if (nextFirstPosition > firstPosition) for (let i = 0; i < nextFirstPosition - firstPosition; i++) _classPrivateFieldGet2(_resizersDiv, this).firstElementChild.before(_classPrivateFieldGet2(_resizersDiv, this).lastElementChild);
			let i = 0;
			for (const child of children) {
				const name = _classPrivateFieldGet2(_allResizerDivs, this)[i++].getAttribute("data-resizer-name");
				child.setAttribute("data-l10n-id", AnnotationEditor._l10nResizer[name]);
			}
		}
		_assertClassBrand(_AnnotationEditor_brand, this, _setResizerTabIndex).call(this, 0);
		_classPrivateFieldSet2(_isResizerEnabledForKeyboard, this, true);
		_classPrivateFieldGet2(_resizersDiv, this).firstElementChild.focus({ focusVisible: true });
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	_resizeWithKeyboard(x, y) {
		if (!_classPrivateFieldGet2(_isResizerEnabledForKeyboard, this)) return;
		_assertClassBrand(_AnnotationEditor_brand, this, _resizerPointermove).call(this, _classPrivateFieldGet2(_focusedResizerName, this), {
			deltaX: x,
			deltaY: y,
			fromKeyboard: true
		});
	}
	_stopResizingWithKeyboard() {
		_assertClassBrand(_AnnotationEditor_brand, this, _stopResizing).call(this);
		this.div.focus();
	}
	select() {
		if (this.isSelected && this._editToolbar) {
			this._editToolbar.show();
			return;
		}
		this.isSelected = true;
		this.makeResizable();
		this.div?.classList.add("selectedEditor");
		if (!this._editToolbar) {
			this.addEditToolbar().then(() => {
				if (this.div?.classList.contains("selectedEditor")) this._editToolbar?.show();
			});
			return;
		}
		this._editToolbar?.show();
		_classPrivateFieldGet2(_altText3, this)?.toggleAltTextBadge(false);
	}
	focus() {
		if (this.div && !this.div.contains(document.activeElement)) setTimeout(() => this.div?.focus({ preventScroll: true }), 0);
	}
	unselect() {
		if (!this.isSelected) return;
		this.isSelected = false;
		_classPrivateFieldGet2(_resizersDiv, this)?.classList.add("hidden");
		this.div?.classList.remove("selectedEditor");
		if (this.div?.contains(document.activeElement)) this._uiManager.currentLayer.div.focus({ preventScroll: true });
		this._editToolbar?.hide();
		_classPrivateFieldGet2(_altText3, this)?.toggleAltTextBadge(true);
		this.hideCommentPopup();
	}
	hideCommentPopup() {
		if (this.hasComment) this._uiManager.toggleComment(null);
	}
	updateParams(type, value) {}
	disableEditing() {}
	enableEditing() {}
	get canChangeContent() {
		return false;
	}
	enterInEditMode() {
		if (!this.canChangeContent) return;
		this.enableEditMode();
		this.div.focus();
	}
	dblclick(event) {
		if (event.target.nodeName === "BUTTON") return;
		this.enterInEditMode();
		this.parent.updateToolbar({
			mode: this.constructor._editorType,
			editId: this.uid
		});
	}
	getElementForAltText() {
		return this.div;
	}
	get contentDiv() {
		return this.div;
	}
	get isEditing() {
		return _classPrivateFieldGet2(_isEditing, this);
	}
	set isEditing(value) {
		_classPrivateFieldSet2(_isEditing, this, value);
		if (!this.parent) return;
		if (value) {
			this.parent.setSelected(this);
			this.parent.setActiveEditor(this);
		} else this.parent.setActiveEditor(null);
	}
	static get MIN_SIZE() {
		return 16;
	}
	static canCreateNewEmptyEditor() {
		return true;
	}
	get telemetryInitialData() {
		return { action: "added" };
	}
	get telemetryFinalData() {
		return null;
	}
	_reportTelemetry(data, mustWait = false) {
		if (mustWait) {
			_classPrivateFieldGet2(_telemetryTimeouts, this) || _classPrivateFieldSet2(_telemetryTimeouts, this, /* @__PURE__ */ new Map());
			const { action } = data;
			let timeout = _classPrivateFieldGet2(_telemetryTimeouts, this).get(action);
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => {
				this._reportTelemetry(data);
				_classPrivateFieldGet2(_telemetryTimeouts, this).delete(action);
				if (_classPrivateFieldGet2(_telemetryTimeouts, this).size === 0) _classPrivateFieldSet2(_telemetryTimeouts, this, null);
			}, AnnotationEditor._telemetryTimeout);
			_classPrivateFieldGet2(_telemetryTimeouts, this).set(action, timeout);
			return;
		}
		data.type || (data.type = this.editorType);
		this._uiManager._eventBus.dispatch("reporttelemetry", {
			source: this,
			details: {
				type: "editing",
				data
			}
		});
	}
	show(visible = this._isVisible) {
		this.div.classList.toggle("hidden", !visible);
		this._isVisible = visible;
	}
	enable() {
		if (this.div) this.div.tabIndex = 0;
		_classPrivateFieldSet2(_disabled, this, false);
	}
	disable() {
		if (this.div) this.div.tabIndex = -1;
		_classPrivateFieldSet2(_disabled, this, true);
	}
	updateFakeAnnotationElement(annotationLayer) {
		if (!_classPrivateFieldGet2(_fakeAnnotation, this) && !this.deleted) {
			_classPrivateFieldSet2(_fakeAnnotation, this, annotationLayer.addFakeAnnotation(this));
			return;
		}
		if (this.deleted) {
			_classPrivateFieldGet2(_fakeAnnotation, this).remove();
			_classPrivateFieldSet2(_fakeAnnotation, this, null);
			return;
		}
		if (this.hasEditedComment || this._hasBeenMoved || this._hasBeenResized) _classPrivateFieldGet2(_fakeAnnotation, this).updateEdited({
			rect: this.getPDFRect(),
			popup: this.comment
		});
	}
	renderAnnotationElement(annotation) {
		if (this.deleted) {
			annotation.hide();
			return null;
		}
		let content = annotation.container.querySelector(".annotationContent");
		if (!content) {
			content = document.createElement("div");
			content.classList.add("annotationContent", this.editorType);
			annotation.container.prepend(content);
		} else if (content.nodeName === "CANVAS") {
			const canvas = content;
			content = document.createElement("div");
			content.classList.add("annotationContent", this.editorType);
			canvas.before(content);
		}
		return content;
	}
	resetAnnotationElement(annotation) {
		const { firstElementChild } = annotation.container;
		if (firstElementChild?.nodeName === "DIV" && firstElementChild.classList.contains("annotationContent")) firstElementChild.remove();
	}
};
_AnnotationEditor = AnnotationEditor;
function _translate([width, height], x, y) {
	[x, y] = this.screenToPageTranslation(x, y);
	this.x += x / width;
	this.y += y / height;
	this._onTranslating(this.x, this.y);
	this.fixAndSetPosition();
}
function _rotatePoint(x, y, angle) {
	switch (angle) {
		case 90: return [y, -x];
		case 180: return [-x, -y];
		case 270: return [-y, x];
		default: return [x, y];
	}
}
function _getRotationMatrix(rotation) {
	switch (rotation) {
		case 90: {
			const [pageWidth, pageHeight] = this.pageDimensions;
			return [
				0,
				-pageWidth / pageHeight,
				pageHeight / pageWidth,
				0
			];
		}
		case 180: return [
			-1,
			0,
			0,
			-1
		];
		case 270: {
			const [pageWidth, pageHeight] = this.pageDimensions;
			return [
				0,
				pageWidth / pageHeight,
				-pageHeight / pageWidth,
				0
			];
		}
		default: return [
			1,
			0,
			0,
			1
		];
	}
}
function _createResizers() {
	if (_classPrivateFieldGet2(_resizersDiv, this)) return;
	_classPrivateFieldSet2(_resizersDiv, this, document.createElement("div"));
	_classPrivateFieldGet2(_resizersDiv, this).classList.add("resizers");
	const classes = this._willKeepAspectRatio ? [
		"topLeft",
		"topRight",
		"bottomRight",
		"bottomLeft"
	] : [
		"topLeft",
		"topMiddle",
		"topRight",
		"middleRight",
		"bottomRight",
		"bottomMiddle",
		"bottomLeft",
		"middleLeft"
	];
	const signal = this._uiManager._signal;
	for (const name of classes) {
		const div = document.createElement("div");
		_classPrivateFieldGet2(_resizersDiv, this).append(div);
		div.classList.add("resizer", name);
		div.setAttribute("data-resizer-name", name);
		div.addEventListener("pointerdown", _assertClassBrand(_AnnotationEditor_brand, this, _resizerPointerdown).bind(this, name), { signal });
		div.addEventListener("contextmenu", noContextMenu, { signal });
		div.tabIndex = -1;
	}
	this.div.prepend(_classPrivateFieldGet2(_resizersDiv, this));
}
function _resizerPointerdown(name, event) {
	event.preventDefault();
	const { isMac } = FeatureTest.platform;
	if (event.button !== 0 || event.ctrlKey && isMac) return;
	_classPrivateFieldGet2(_altText3, this)?.toggle(false);
	const savedDraggable = this._isDraggable;
	this._isDraggable = false;
	_classPrivateFieldSet2(_lastPointerCoords, this, [event.screenX, event.screenY]);
	const ac = new AbortController();
	const signal = this._uiManager.combinedSignal(ac);
	this.parent.togglePointerEvents(false);
	window.addEventListener("pointermove", _assertClassBrand(_AnnotationEditor_brand, this, _resizerPointermove).bind(this, name), {
		passive: true,
		capture: true,
		signal
	});
	window.addEventListener("touchmove", stopEvent, {
		passive: false,
		signal
	});
	window.addEventListener("contextmenu", noContextMenu, { signal });
	_classPrivateFieldSet2(_savedDimensions, this, {
		savedX: this.x,
		savedY: this.y,
		savedWidth: this.width,
		savedHeight: this.height
	});
	const savedParentCursor = this.parent.div.style.cursor;
	const savedCursor = this.div.style.cursor;
	this.div.style.cursor = this.parent.div.style.cursor = window.getComputedStyle(event.target).cursor;
	const pointerUpCallback = () => {
		ac.abort();
		this.parent.togglePointerEvents(true);
		_classPrivateFieldGet2(_altText3, this)?.toggle(true);
		this._isDraggable = savedDraggable;
		this.parent.div.style.cursor = savedParentCursor;
		this.div.style.cursor = savedCursor;
		_assertClassBrand(_AnnotationEditor_brand, this, _addResizeToUndoStack).call(this);
	};
	window.addEventListener("pointerup", pointerUpCallback, { signal });
	window.addEventListener("blur", pointerUpCallback, { signal });
}
function _resize(x, y, width, height) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.setDims();
	this.fixAndSetPosition();
	this._onResized();
}
function _addResizeToUndoStack() {
	if (!_classPrivateFieldGet2(_savedDimensions, this)) return;
	const { savedX, savedY, savedWidth, savedHeight } = _classPrivateFieldGet2(_savedDimensions, this);
	_classPrivateFieldSet2(_savedDimensions, this, null);
	const newX = this.x;
	const newY = this.y;
	const newWidth = this.width;
	const newHeight = this.height;
	if (newX === savedX && newY === savedY && newWidth === savedWidth && newHeight === savedHeight) return;
	this.addCommands({
		cmd: _assertClassBrand(_AnnotationEditor_brand, this, _resize).bind(this, newX, newY, newWidth, newHeight),
		undo: _assertClassBrand(_AnnotationEditor_brand, this, _resize).bind(this, savedX, savedY, savedWidth, savedHeight),
		mustExec: true
	});
}
function _resizerPointermove(name, event) {
	const [parentWidth, parentHeight] = this.parentDimensions;
	const savedX = this.x;
	const savedY = this.y;
	const savedWidth = this.width;
	const savedHeight = this.height;
	const minWidth = _AnnotationEditor.MIN_SIZE / parentWidth;
	const minHeight = _AnnotationEditor.MIN_SIZE / parentHeight;
	const rotationMatrix = _assertClassBrand(_AnnotationEditor_brand, this, _getRotationMatrix).call(this, this.rotation);
	const transf = (x, y) => [rotationMatrix[0] * x + rotationMatrix[2] * y, rotationMatrix[1] * x + rotationMatrix[3] * y];
	const invRotationMatrix = _assertClassBrand(_AnnotationEditor_brand, this, _getRotationMatrix).call(this, 360 - this.rotation);
	const invTransf = (x, y) => [invRotationMatrix[0] * x + invRotationMatrix[2] * y, invRotationMatrix[1] * x + invRotationMatrix[3] * y];
	let getPoint;
	let getOpposite;
	let isDiagonal = false;
	let isHorizontal = false;
	switch (name) {
		case "topLeft":
			isDiagonal = true;
			getPoint = (w, h) => [0, 0];
			getOpposite = (w, h) => [w, h];
			break;
		case "topMiddle":
			getPoint = (w, h) => [w / 2, 0];
			getOpposite = (w, h) => [w / 2, h];
			break;
		case "topRight":
			isDiagonal = true;
			getPoint = (w, h) => [w, 0];
			getOpposite = (w, h) => [0, h];
			break;
		case "middleRight":
			isHorizontal = true;
			getPoint = (w, h) => [w, h / 2];
			getOpposite = (w, h) => [0, h / 2];
			break;
		case "bottomRight":
			isDiagonal = true;
			getPoint = (w, h) => [w, h];
			getOpposite = (w, h) => [0, 0];
			break;
		case "bottomMiddle":
			getPoint = (w, h) => [w / 2, h];
			getOpposite = (w, h) => [w / 2, 0];
			break;
		case "bottomLeft":
			isDiagonal = true;
			getPoint = (w, h) => [0, h];
			getOpposite = (w, h) => [w, 0];
			break;
		case "middleLeft":
			isHorizontal = true;
			getPoint = (w, h) => [0, h / 2];
			getOpposite = (w, h) => [w, h / 2];
			break;
	}
	const point = getPoint(savedWidth, savedHeight);
	const oppositePoint = getOpposite(savedWidth, savedHeight);
	let transfOppositePoint = transf(...oppositePoint);
	const oppositeX = _AnnotationEditor._round(savedX + transfOppositePoint[0]);
	const oppositeY = _AnnotationEditor._round(savedY + transfOppositePoint[1]);
	let ratioX = 1;
	let ratioY = 1;
	let deltaX, deltaY;
	if (!event.fromKeyboard) {
		const { screenX, screenY } = event;
		const [lastScreenX, lastScreenY] = _classPrivateFieldGet2(_lastPointerCoords, this);
		[deltaX, deltaY] = this.screenToPageTranslation(screenX - lastScreenX, screenY - lastScreenY);
		_classPrivateFieldGet2(_lastPointerCoords, this)[0] = screenX;
		_classPrivateFieldGet2(_lastPointerCoords, this)[1] = screenY;
	} else ({deltaX, deltaY} = event);
	[deltaX, deltaY] = invTransf(deltaX / parentWidth, deltaY / parentHeight);
	if (isDiagonal) {
		const oldDiag = Math.hypot(savedWidth, savedHeight);
		ratioX = ratioY = Math.max(Math.min(Math.hypot(oppositePoint[0] - point[0] - deltaX, oppositePoint[1] - point[1] - deltaY) / oldDiag, 1 / savedWidth, 1 / savedHeight), minWidth / savedWidth, minHeight / savedHeight);
	} else if (isHorizontal) ratioX = MathClamp(Math.abs(oppositePoint[0] - point[0] - deltaX), minWidth, 1) / savedWidth;
	else ratioY = MathClamp(Math.abs(oppositePoint[1] - point[1] - deltaY), minHeight, 1) / savedHeight;
	const newWidth = _AnnotationEditor._round(savedWidth * ratioX);
	const newHeight = _AnnotationEditor._round(savedHeight * ratioY);
	transfOppositePoint = transf(...getOpposite(newWidth, newHeight));
	const newX = oppositeX - transfOppositePoint[0];
	const newY = oppositeY - transfOppositePoint[1];
	_classPrivateFieldGet2(_initialRect, this) || _classPrivateFieldSet2(_initialRect, this, [
		this.x,
		this.y,
		this.width,
		this.height
	]);
	this.width = newWidth;
	this.height = newHeight;
	this.x = newX;
	this.y = newY;
	this.setDims();
	this.fixAndSetPosition();
	this._onResizing();
}
function _touchPinchStartCallback() {
	_classPrivateFieldSet2(_savedDimensions, this, {
		savedX: this.x,
		savedY: this.y,
		savedWidth: this.width,
		savedHeight: this.height
	});
	_classPrivateFieldGet2(_altText3, this)?.toggle(false);
	this.parent.togglePointerEvents(false);
}
function _touchPinchCallback(_origin, prevDistance, distance) {
	const slowDownFactor = .7;
	let factor = slowDownFactor * (distance / prevDistance) + 1 - slowDownFactor;
	if (factor === 1) return;
	const rotationMatrix = _assertClassBrand(_AnnotationEditor_brand, this, _getRotationMatrix).call(this, this.rotation);
	const transf = (x, y) => [rotationMatrix[0] * x + rotationMatrix[2] * y, rotationMatrix[1] * x + rotationMatrix[3] * y];
	const [parentWidth, parentHeight] = this.parentDimensions;
	const savedX = this.x;
	const savedY = this.y;
	const savedWidth = this.width;
	const savedHeight = this.height;
	const minWidth = _AnnotationEditor.MIN_SIZE / parentWidth;
	const minHeight = _AnnotationEditor.MIN_SIZE / parentHeight;
	factor = Math.max(Math.min(factor, 1 / savedWidth, 1 / savedHeight), minWidth / savedWidth, minHeight / savedHeight);
	const newWidth = _AnnotationEditor._round(savedWidth * factor);
	const newHeight = _AnnotationEditor._round(savedHeight * factor);
	if (newWidth === savedWidth && newHeight === savedHeight) return;
	_classPrivateFieldGet2(_initialRect, this) || _classPrivateFieldSet2(_initialRect, this, [
		savedX,
		savedY,
		savedWidth,
		savedHeight
	]);
	const transfCenterPoint = transf(savedWidth / 2, savedHeight / 2);
	const centerX = _AnnotationEditor._round(savedX + transfCenterPoint[0]);
	const centerY = _AnnotationEditor._round(savedY + transfCenterPoint[1]);
	const newTransfCenterPoint = transf(newWidth / 2, newHeight / 2);
	this.x = centerX - newTransfCenterPoint[0];
	this.y = centerY - newTransfCenterPoint[1];
	this.width = newWidth;
	this.height = newHeight;
	this.setDims();
	this.fixAndSetPosition();
	this._onResizing();
}
function _touchPinchEndCallback() {
	_classPrivateFieldGet2(_altText3, this)?.toggle(true);
	this.parent.togglePointerEvents(true);
	_assertClassBrand(_AnnotationEditor_brand, this, _addResizeToUndoStack).call(this);
}
function _selectOnPointerEvent(event) {
	const { isMac } = FeatureTest.platform;
	if (event.ctrlKey && !isMac || event.shiftKey || event.metaKey && isMac) this.parent.toggleSelected(this);
	else this.parent.setSelected(this);
}
function _setUpDragSession(event) {
	const { isSelected } = this;
	this._uiManager.setUpDragSession();
	let hasDraggingStarted = false;
	const ac = new AbortController();
	const signal = this._uiManager.combinedSignal(ac);
	const opts = {
		capture: true,
		passive: false,
		signal
	};
	const cancelDrag = (e) => {
		ac.abort();
		_classPrivateFieldSet2(_dragPointerId, this, null);
		_classPrivateFieldSet2(_hasBeenClicked, this, false);
		if (!this._uiManager.endDragSession()) _assertClassBrand(_AnnotationEditor_brand, this, _selectOnPointerEvent).call(this, e);
		if (hasDraggingStarted) this._onStopDragging();
	};
	if (isSelected) {
		_classPrivateFieldSet2(_prevDragX, this, event.clientX);
		_classPrivateFieldSet2(_prevDragY, this, event.clientY);
		_classPrivateFieldSet2(_dragPointerId, this, event.pointerId);
		_classPrivateFieldSet2(_dragPointerType, this, event.pointerType);
		window.addEventListener("pointermove", (e) => {
			if (!hasDraggingStarted) {
				hasDraggingStarted = true;
				this._uiManager.toggleComment(this, true, false);
				this._onStartDragging();
			}
			const { clientX: x, clientY: y, pointerId } = e;
			if (pointerId !== _classPrivateFieldGet2(_dragPointerId, this)) {
				stopEvent(e);
				return;
			}
			const [tx, ty] = this.screenToPageTranslation(x - _classPrivateFieldGet2(_prevDragX, this), y - _classPrivateFieldGet2(_prevDragY, this));
			_classPrivateFieldSet2(_prevDragX, this, x);
			_classPrivateFieldSet2(_prevDragY, this, y);
			this._uiManager.dragSelectedEditors(tx, ty);
		}, opts);
		window.addEventListener("touchmove", stopEvent, opts);
		window.addEventListener("pointerdown", (e) => {
			if (e.pointerType === _classPrivateFieldGet2(_dragPointerType, this)) {
				if (_classPrivateFieldGet2(_touchManager, this) || e.isPrimary) cancelDrag(e);
			}
			stopEvent(e);
		}, opts);
	}
	const pointerUpCallback = (e) => {
		if (!_classPrivateFieldGet2(_dragPointerId, this) || _classPrivateFieldGet2(_dragPointerId, this) === e.pointerId) {
			cancelDrag(e);
			return;
		}
		stopEvent(e);
	};
	window.addEventListener("pointerup", pointerUpCallback, { signal });
	window.addEventListener("blur", pointerUpCallback, { signal });
}
function _addFocusListeners() {
	if (_classPrivateFieldGet2(_focusAC, this) || !this.div) return;
	_classPrivateFieldSet2(_focusAC, this, new AbortController());
	const signal = this._uiManager.combinedSignal(_classPrivateFieldGet2(_focusAC, this));
	this.div.addEventListener("focusin", this.focusin.bind(this), { signal });
	this.div.addEventListener("focusout", this.focusout.bind(this), { signal });
}
function _resizerKeydown(event) {
	_AnnotationEditor._resizerKeyboardManager.exec(this, event);
}
function _resizerBlur(event) {
	if (_classPrivateFieldGet2(_isResizerEnabledForKeyboard, this) && event.relatedTarget?.parentNode !== _classPrivateFieldGet2(_resizersDiv, this)) _assertClassBrand(_AnnotationEditor_brand, this, _stopResizing).call(this);
}
function _resizerFocus(name) {
	_classPrivateFieldSet2(_focusedResizerName, this, _classPrivateFieldGet2(_isResizerEnabledForKeyboard, this) ? name : "");
}
function _setResizerTabIndex(value) {
	if (!_classPrivateFieldGet2(_allResizerDivs, this)) return;
	for (const div of _classPrivateFieldGet2(_allResizerDivs, this)) div.tabIndex = value;
}
function _stopResizing() {
	_classPrivateFieldSet2(_isResizerEnabledForKeyboard, this, false);
	_assertClassBrand(_AnnotationEditor_brand, this, _setResizerTabIndex).call(this, -1);
	_assertClassBrand(_AnnotationEditor_brand, this, _addResizeToUndoStack).call(this);
}
_defineProperty(AnnotationEditor, "_l10n", null);
_defineProperty(AnnotationEditor, "_l10nResizer", null);
_defineProperty(AnnotationEditor, "_borderLineWidth", -1);
_defineProperty(AnnotationEditor, "_colorManager", new ColorManager());
_defineProperty(AnnotationEditor, "_zIndex", 1);
_defineProperty(AnnotationEditor, "_telemetryTimeout", 1e3);
var FakeEditor = class extends AnnotationEditor {
	constructor(params) {
		super(params);
		this.annotationElementId = params.annotationElementId;
		this.deleted = true;
	}
	serialize() {
		return this.serializeDeleted();
	}
};
var SEED = 3285377520;
var MASK_HIGH = 4294901760;
var MASK_LOW = 65535;
var MurmurHash3_64 = class {
	constructor(seed) {
		this.h1 = seed ? seed & 4294967295 : SEED;
		this.h2 = seed ? seed & 4294967295 : SEED;
	}
	update(input) {
		let data, length;
		if (typeof input === "string") {
			data = new Uint8Array(input.length * 2);
			length = 0;
			for (let i = 0, ii = input.length; i < ii; i++) {
				const code = input.charCodeAt(i);
				if (code <= 255) data[length++] = code;
				else {
					data[length++] = code >>> 8;
					data[length++] = code & 255;
				}
			}
		} else if (ArrayBuffer.isView(input)) {
			data = input.slice();
			length = data.byteLength;
		} else throw new Error("Invalid data format, must be a string or TypedArray.");
		const blockCounts = length >> 2;
		const tailLength = length - blockCounts * 4;
		const dataUint32 = new Uint32Array(data.buffer, 0, blockCounts);
		let k1 = 0, k2 = 0;
		let h1 = this.h1, h2 = this.h2;
		const C1 = 3432918353, C2 = 461845907;
		const C1_LOW = 11601, C2_LOW = 13715;
		for (let i = 0; i < blockCounts; i++) if (i & 1) {
			k1 = dataUint32[i];
			k1 = k1 * C1 & MASK_HIGH | k1 * C1_LOW & MASK_LOW;
			k1 = k1 << 15 | k1 >>> 17;
			k1 = k1 * C2 & MASK_HIGH | k1 * C2_LOW & MASK_LOW;
			h1 ^= k1;
			h1 = h1 << 13 | h1 >>> 19;
			h1 = h1 * 5 + 3864292196;
		} else {
			k2 = dataUint32[i];
			k2 = k2 * C1 & MASK_HIGH | k2 * C1_LOW & MASK_LOW;
			k2 = k2 << 15 | k2 >>> 17;
			k2 = k2 * C2 & MASK_HIGH | k2 * C2_LOW & MASK_LOW;
			h2 ^= k2;
			h2 = h2 << 13 | h2 >>> 19;
			h2 = h2 * 5 + 3864292196;
		}
		k1 = 0;
		switch (tailLength) {
			case 3: k1 ^= data[blockCounts * 4 + 2] << 16;
			case 2: k1 ^= data[blockCounts * 4 + 1] << 8;
			case 1:
				k1 ^= data[blockCounts * 4];
				k1 = k1 * C1 & MASK_HIGH | k1 * C1_LOW & MASK_LOW;
				k1 = k1 << 15 | k1 >>> 17;
				k1 = k1 * C2 & MASK_HIGH | k1 * C2_LOW & MASK_LOW;
				if (blockCounts & 1) h1 ^= k1;
				else h2 ^= k1;
		}
		this.h1 = h1;
		this.h2 = h2;
	}
	hexdigest() {
		let h1 = this.h1, h2 = this.h2;
		h1 ^= h2 >>> 1;
		h1 = h1 * 3981806797 & MASK_HIGH | h1 * 36045 & MASK_LOW;
		h2 = h2 * 4283543511 & MASK_HIGH | ((h2 << 16 | h1 >>> 16) * 2950163797 & MASK_HIGH) >>> 16;
		h1 ^= h2 >>> 1;
		h1 = h1 * 444984403 & MASK_HIGH | h1 * 60499 & MASK_LOW;
		h2 = h2 * 3301882366 & MASK_HIGH | ((h2 << 16 | h1 >>> 16) * 3120437893 & MASK_HIGH) >>> 16;
		h1 ^= h2 >>> 1;
		return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
	}
};
var SerializableEmpty = Object.freeze({
	map: null,
	hash: "",
	transfer: void 0
});
var _modified = /* @__PURE__ */ new WeakMap();
var _modifiedIds = /* @__PURE__ */ new WeakMap();
var _editorsMap = /* @__PURE__ */ new WeakMap();
var _storage = /* @__PURE__ */ new WeakMap();
var _AnnotationStorage_brand = /* @__PURE__ */ new WeakSet();
_Symbol$iterator = Symbol.iterator;
var AnnotationStorage = class {
	constructor() {
		_classPrivateMethodInitSpec(this, _AnnotationStorage_brand);
		_classPrivateFieldInitSpec(this, _modified, false);
		_classPrivateFieldInitSpec(this, _modifiedIds, null);
		_classPrivateFieldInitSpec(this, _editorsMap, null);
		_classPrivateFieldInitSpec(this, _storage, /* @__PURE__ */ new Map());
		_defineProperty(this, "onSetModified", null);
		_defineProperty(this, "onResetModified", null);
		_defineProperty(this, "onAnnotationEditor", null);
	}
	getValue(key, defaultValue) {
		const value = _classPrivateFieldGet2(_storage, this).get(key);
		if (value === void 0) return defaultValue;
		return Object.assign(defaultValue, value);
	}
	getRawValue(key) {
		return _classPrivateFieldGet2(_storage, this).get(key);
	}
	remove(key) {
		const storedValue = _classPrivateFieldGet2(_storage, this).get(key);
		if (storedValue === void 0) return;
		if (storedValue instanceof AnnotationEditor) _classPrivateFieldGet2(_editorsMap, this).delete(storedValue.annotationElementId);
		_classPrivateFieldGet2(_storage, this).delete(key);
		if (_classPrivateFieldGet2(_storage, this).size === 0) this.resetModified();
		if (_classPrivateFieldGet2(_storage, this).values().some((v) => v instanceof AnnotationEditor)) return;
		this.onAnnotationEditor?.(null);
	}
	setValue(key, value) {
		const obj = _classPrivateFieldGet2(_storage, this).get(key);
		let modified = false;
		if (obj !== void 0) {
			for (const [entry, val] of Object.entries(value)) if (obj[entry] !== val) {
				modified = true;
				obj[entry] = val;
			}
		} else {
			modified = true;
			_classPrivateFieldGet2(_storage, this).set(key, value);
		}
		if (modified) _assertClassBrand(_AnnotationStorage_brand, this, _setModified).call(this);
		if (value instanceof AnnotationEditor) {
			(_classPrivateFieldGet2(_editorsMap, this) || _classPrivateFieldSet2(_editorsMap, this, /* @__PURE__ */ new Map())).set(value.annotationElementId, value);
			this.onAnnotationEditor?.(value.constructor._type);
		}
	}
	has(key) {
		return _classPrivateFieldGet2(_storage, this).has(key);
	}
	get size() {
		return _classPrivateFieldGet2(_storage, this).size;
	}
	resetModified() {
		if (_classPrivateFieldGet2(_modified, this)) {
			_classPrivateFieldSet2(_modified, this, false);
			this.onResetModified?.();
		}
	}
	get print() {
		return new PrintAnnotationStorage(this);
	}
	get serializable() {
		if (_classPrivateFieldGet2(_storage, this).size === 0) return SerializableEmpty;
		const map = /* @__PURE__ */ new Map(), hash = new MurmurHash3_64(), transfer = [];
		const context = Object.create(null);
		let hasBitmap = false;
		for (const [key, val] of _classPrivateFieldGet2(_storage, this)) {
			const serialized = val instanceof AnnotationEditor ? val.serialize(false, context) : val;
			if (val.page) {
				val.pageIndex = val.page._pageIndex;
				delete val.page;
			}
			if (serialized) {
				map.set(key, serialized);
				hash.update(`${key}:${JSON.stringify(serialized)}`);
				hasBitmap || (hasBitmap = !!serialized.bitmap);
			}
		}
		if (hasBitmap) {
			for (const value of map.values()) if (value.bitmap) transfer.push(value.bitmap);
		}
		return map.size > 0 ? {
			map,
			hash: hash.hexdigest(),
			transfer
		} : SerializableEmpty;
	}
	get editorStats() {
		let stats = null;
		const typeToEditor = /* @__PURE__ */ new Map();
		let numberOfEditedComments = 0;
		let numberOfDeletedComments = 0;
		for (const value of _classPrivateFieldGet2(_storage, this).values()) {
			var _stats;
			if (!(value instanceof AnnotationEditor)) {
				if (value.popup) if (value.popup.deleted) numberOfDeletedComments += 1;
				else numberOfEditedComments += 1;
				continue;
			}
			if (value.isCommentDeleted) numberOfDeletedComments += 1;
			else if (value.hasEditedComment) numberOfEditedComments += 1;
			const editorStats = value.telemetryFinalData;
			if (!editorStats) continue;
			const { type } = editorStats;
			if (!typeToEditor.has(type)) typeToEditor.set(type, Object.getPrototypeOf(value).constructor);
			stats || (stats = Object.create(null));
			const map = (_stats = stats)[type] || (_stats[type] = /* @__PURE__ */ new Map());
			for (const [key, val] of Object.entries(editorStats)) {
				if (key === "type") continue;
				const counters = map.getOrInsertComputed(key, makeMap);
				counters.set(val, (counters.get(val) ?? 0) + 1);
			}
		}
		if (numberOfDeletedComments > 0 || numberOfEditedComments > 0) {
			stats || (stats = Object.create(null));
			stats.comments = {
				deleted: numberOfDeletedComments,
				edited: numberOfEditedComments
			};
		}
		if (!stats) return null;
		for (const [type, editor] of typeToEditor) stats[type] = editor.computeTelemetryFinalData(stats[type]);
		return stats;
	}
	resetModifiedIds() {
		_classPrivateFieldSet2(_modifiedIds, this, null);
	}
	updateEditor(annotationId, data) {
		const value = _classPrivateFieldGet2(_editorsMap, this)?.get(annotationId);
		if (value) {
			value.updateFromAnnotationLayer(data);
			return true;
		}
		return false;
	}
	getEditor(annotationId) {
		return _classPrivateFieldGet2(_editorsMap, this)?.get(annotationId) || null;
	}
	get modifiedIds() {
		if (_classPrivateFieldGet2(_modifiedIds, this)) return _classPrivateFieldGet2(_modifiedIds, this);
		const ids = [];
		if (_classPrivateFieldGet2(_editorsMap, this)) for (const value of _classPrivateFieldGet2(_editorsMap, this).values()) {
			if (!value.serialize()) continue;
			ids.push(value.annotationElementId);
		}
		return _classPrivateFieldSet2(_modifiedIds, this, {
			ids: new Set(ids),
			hash: ids.join(",")
		});
	}
	[_Symbol$iterator]() {
		return _classPrivateFieldGet2(_storage, this).entries();
	}
};
function _setModified() {
	if (!_classPrivateFieldGet2(_modified, this)) {
		_classPrivateFieldSet2(_modified, this, true);
		this.onSetModified?.();
	}
}
var _serializable = /* @__PURE__ */ new WeakMap();
var PrintAnnotationStorage = class extends AnnotationStorage {
	constructor(parent) {
		super();
		_classPrivateFieldInitSpec(this, _serializable, SerializableEmpty);
		const { serializable } = parent;
		if (serializable === SerializableEmpty) return;
		const { map, hash, transfer } = serializable;
		const clone = structuredClone(map, transfer ? { transfer } : null);
		_classPrivateFieldSet2(_serializable, this, {
			map: clone,
			hash,
			transfer: []
		});
	}
	get print() {
		unreachable("Should not call PrintAnnotationStorage.print");
	}
	get serializable() {
		return _classPrivateFieldGet2(_serializable, this);
	}
	get modifiedIds() {
		return shadow(this, "modifiedIds", {
			ids: /* @__PURE__ */ new Set(),
			hash: ""
		});
	}
};
var FORCED_DEPENDENCY_LABEL = "__forcedDependency";
var { floor, ceil } = Math;
function expandBBox(array, index, minX, minY, maxX, maxY) {
	array[index * 4 + 0] = Math.min(array[index * 4 + 0], minX);
	array[index * 4 + 1] = Math.min(array[index * 4 + 1], minY);
	array[index * 4 + 2] = Math.max(array[index * 4 + 2], maxX);
	array[index * 4 + 3] = Math.max(array[index * 4 + 3], maxY);
}
var EMPTY_BBOX = new Uint32Array(new Uint8Array([
	255,
	255,
	0,
	0
]).buffer)[0];
var _bboxes = /* @__PURE__ */ new WeakMap();
var _coords = /* @__PURE__ */ new WeakMap();
var BBoxReader = class {
	constructor(bboxes, coords) {
		_classPrivateFieldInitSpec(this, _bboxes, void 0);
		_classPrivateFieldInitSpec(this, _coords, void 0);
		_classPrivateFieldSet2(_bboxes, this, bboxes);
		_classPrivateFieldSet2(_coords, this, coords);
	}
	get length() {
		return _classPrivateFieldGet2(_bboxes, this).length;
	}
	isEmpty(i) {
		return _classPrivateFieldGet2(_bboxes, this)[i] === EMPTY_BBOX;
	}
	minX(i) {
		return _classPrivateFieldGet2(_coords, this)[i * 4 + 0] / 256;
	}
	minY(i) {
		return _classPrivateFieldGet2(_coords, this)[i * 4 + 1] / 256;
	}
	maxX(i) {
		return (_classPrivateFieldGet2(_coords, this)[i * 4 + 2] + 1) / 256;
	}
	maxY(i) {
		return (_classPrivateFieldGet2(_coords, this)[i * 4 + 3] + 1) / 256;
	}
};
var ensureDebugMetadata = (map, key) => map?.getOrInsertComputed(key, () => ({
	dependencies: /* @__PURE__ */ new Set(),
	isRenderingOperation: false
}));
var _baseTransformStack = /* @__PURE__ */ new WeakMap();
var _clipBox = /* @__PURE__ */ new WeakMap();
var _pendingBBox = /* @__PURE__ */ new WeakMap();
var _canvasWidth = /* @__PURE__ */ new WeakMap();
var _canvasHeight = /* @__PURE__ */ new WeakMap();
var _bboxesCoords = /* @__PURE__ */ new WeakMap();
var _bboxes2 = /* @__PURE__ */ new WeakMap();
var _CanvasBBoxTracker_brand = /* @__PURE__ */ new WeakSet();
var CanvasBBoxTracker = class {
	constructor(canvas, operationsCount) {
		_classPrivateMethodInitSpec(this, _CanvasBBoxTracker_brand);
		_classPrivateFieldInitSpec(this, _baseTransformStack, [[
			1,
			0,
			0,
			1,
			0,
			0
		]]);
		_classPrivateFieldInitSpec(this, _clipBox, [
			-Infinity,
			-Infinity,
			Infinity,
			Infinity
		]);
		_classPrivateFieldInitSpec(this, _pendingBBox, new Float64Array([
			Infinity,
			Infinity,
			-Infinity,
			-Infinity
		]));
		_defineProperty(this, "_pendingBBoxIdx", -1);
		_classPrivateFieldInitSpec(this, _canvasWidth, void 0);
		_classPrivateFieldInitSpec(this, _canvasHeight, void 0);
		_classPrivateFieldInitSpec(this, _bboxesCoords, void 0);
		_classPrivateFieldInitSpec(this, _bboxes2, void 0);
		_defineProperty(this, "_savesStack", []);
		_defineProperty(this, "_markedContentStack", []);
		_classPrivateFieldSet2(_canvasWidth, this, canvas.width);
		_classPrivateFieldSet2(_canvasHeight, this, canvas.height);
		_assertClassBrand(_CanvasBBoxTracker_brand, this, _initializeBBoxes).call(this, operationsCount);
	}
	growOperationsCount(operationsCount) {
		if (operationsCount >= _classPrivateFieldGet2(_bboxes2, this).length) _assertClassBrand(_CanvasBBoxTracker_brand, this, _initializeBBoxes).call(this, operationsCount, _classPrivateFieldGet2(_bboxes2, this));
	}
	get clipBox() {
		return _classPrivateFieldGet2(_clipBox, this);
	}
	save(opIdx) {
		_classPrivateFieldSet2(_clipBox, this, { __proto__: _classPrivateFieldGet2(_clipBox, this) });
		this._savesStack.push(opIdx);
		return this;
	}
	restore(opIdx, onSavePopped) {
		const previous = Object.getPrototypeOf(_classPrivateFieldGet2(_clipBox, this));
		if (previous === null) return this;
		_classPrivateFieldSet2(_clipBox, this, previous);
		const lastSave = this._savesStack.pop();
		if (lastSave !== void 0) {
			onSavePopped?.(lastSave, opIdx);
			_classPrivateFieldGet2(_bboxes2, this)[opIdx] = _classPrivateFieldGet2(_bboxes2, this)[lastSave];
		}
		return this;
	}
	recordOpenMarker(idx) {
		this._savesStack.push(idx);
		return this;
	}
	getOpenMarker() {
		if (this._savesStack.length === 0) return null;
		return this._savesStack.at(-1);
	}
	recordCloseMarker(opIdx, onSavePopped) {
		const lastSave = this._savesStack.pop();
		if (lastSave !== void 0) {
			onSavePopped?.(lastSave, opIdx);
			_classPrivateFieldGet2(_bboxes2, this)[opIdx] = _classPrivateFieldGet2(_bboxes2, this)[lastSave];
		}
		return this;
	}
	beginMarkedContent(opIdx) {
		this._markedContentStack.push(opIdx);
		return this;
	}
	endMarkedContent(opIdx, onSavePopped) {
		const lastSave = this._markedContentStack.pop();
		if (lastSave !== void 0) {
			onSavePopped?.(lastSave, opIdx);
			_classPrivateFieldGet2(_bboxes2, this)[opIdx] = _classPrivateFieldGet2(_bboxes2, this)[lastSave];
		}
		return this;
	}
	pushBaseTransform(ctx) {
		_classPrivateFieldGet2(_baseTransformStack, this).push(Util.multiplyByDOMMatrix(_classPrivateFieldGet2(_baseTransformStack, this).at(-1), ctx.getTransform()));
		return this;
	}
	popBaseTransform() {
		if (_classPrivateFieldGet2(_baseTransformStack, this).length > 1) _classPrivateFieldGet2(_baseTransformStack, this).pop();
		return this;
	}
	resetBBox(idx) {
		if (this._pendingBBoxIdx !== idx) {
			this._pendingBBoxIdx = idx;
			_classPrivateFieldGet2(_pendingBBox, this)[0] = Infinity;
			_classPrivateFieldGet2(_pendingBBox, this)[1] = Infinity;
			_classPrivateFieldGet2(_pendingBBox, this)[2] = -Infinity;
			_classPrivateFieldGet2(_pendingBBox, this)[3] = -Infinity;
		}
		return this;
	}
	recordClipBox(idx, ctx, minX, maxX, minY, maxY) {
		const transform = Util.multiplyByDOMMatrix(_classPrivateFieldGet2(_baseTransformStack, this).at(-1), ctx.getTransform());
		const clipBox = [
			Infinity,
			Infinity,
			-Infinity,
			-Infinity
		];
		Util.axialAlignedBoundingBox([
			minX,
			minY,
			maxX,
			maxY
		], transform, clipBox);
		const intersection = Util.intersect(_classPrivateFieldGet2(_clipBox, this), clipBox);
		if (intersection) {
			_classPrivateFieldGet2(_clipBox, this)[0] = intersection[0];
			_classPrivateFieldGet2(_clipBox, this)[1] = intersection[1];
			_classPrivateFieldGet2(_clipBox, this)[2] = intersection[2];
			_classPrivateFieldGet2(_clipBox, this)[3] = intersection[3];
		} else {
			_classPrivateFieldGet2(_clipBox, this)[0] = _classPrivateFieldGet2(_clipBox, this)[1] = Infinity;
			_classPrivateFieldGet2(_clipBox, this)[2] = _classPrivateFieldGet2(_clipBox, this)[3] = -Infinity;
		}
		return this;
	}
	recordBBox(idx, ctx, minX, maxX, minY, maxY) {
		const clipBox = _classPrivateFieldGet2(_clipBox, this);
		if (clipBox[0] === Infinity) return this;
		const transform = Util.multiplyByDOMMatrix(_classPrivateFieldGet2(_baseTransformStack, this).at(-1), ctx.getTransform());
		if (clipBox[0] === -Infinity) {
			Util.axialAlignedBoundingBox([
				minX,
				minY,
				maxX,
				maxY
			], transform, _classPrivateFieldGet2(_pendingBBox, this));
			return this;
		}
		const bbox = [
			Infinity,
			Infinity,
			-Infinity,
			-Infinity
		];
		Util.axialAlignedBoundingBox([
			minX,
			minY,
			maxX,
			maxY
		], transform, bbox);
		_classPrivateFieldGet2(_pendingBBox, this)[0] = Math.min(_classPrivateFieldGet2(_pendingBBox, this)[0], Math.max(bbox[0], clipBox[0]));
		_classPrivateFieldGet2(_pendingBBox, this)[1] = Math.min(_classPrivateFieldGet2(_pendingBBox, this)[1], Math.max(bbox[1], clipBox[1]));
		_classPrivateFieldGet2(_pendingBBox, this)[2] = Math.max(_classPrivateFieldGet2(_pendingBBox, this)[2], Math.min(bbox[2], clipBox[2]));
		_classPrivateFieldGet2(_pendingBBox, this)[3] = Math.max(_classPrivateFieldGet2(_pendingBBox, this)[3], Math.min(bbox[3], clipBox[3]));
		return this;
	}
	recordFullPageBBox(idx) {
		_classPrivateFieldGet2(_pendingBBox, this)[0] = Math.max(0, _classPrivateFieldGet2(_clipBox, this)[0]);
		_classPrivateFieldGet2(_pendingBBox, this)[1] = Math.max(0, _classPrivateFieldGet2(_clipBox, this)[1]);
		_classPrivateFieldGet2(_pendingBBox, this)[2] = Math.min(_classPrivateFieldGet2(_canvasWidth, this), _classPrivateFieldGet2(_clipBox, this)[2]);
		_classPrivateFieldGet2(_pendingBBox, this)[3] = Math.min(_classPrivateFieldGet2(_canvasHeight, this), _classPrivateFieldGet2(_clipBox, this)[3]);
		return this;
	}
	recordOperation(idx, preserve = false, dependencyLists) {
		if (this._pendingBBoxIdx !== idx) return this;
		const minX = floor(_classPrivateFieldGet2(_pendingBBox, this)[0] * 256 / _classPrivateFieldGet2(_canvasWidth, this));
		const minY = floor(_classPrivateFieldGet2(_pendingBBox, this)[1] * 256 / _classPrivateFieldGet2(_canvasHeight, this));
		const maxX = ceil(_classPrivateFieldGet2(_pendingBBox, this)[2] * 256 / _classPrivateFieldGet2(_canvasWidth, this));
		const maxY = ceil(_classPrivateFieldGet2(_pendingBBox, this)[3] * 256 / _classPrivateFieldGet2(_canvasHeight, this));
		expandBBox(_classPrivateFieldGet2(_bboxesCoords, this), idx, minX, minY, maxX, maxY);
		if (dependencyLists) {
			for (const dependencies of dependencyLists) for (const depIdx of dependencies) if (depIdx !== idx) expandBBox(_classPrivateFieldGet2(_bboxesCoords, this), depIdx, minX, minY, maxX, maxY);
		}
		if (!preserve) this._pendingBBoxIdx = -1;
		return this;
	}
	bboxToClipBoxDropOperation(idx) {
		if (this._pendingBBoxIdx === idx) {
			this._pendingBBoxIdx = -1;
			_classPrivateFieldGet2(_clipBox, this)[0] = Math.max(_classPrivateFieldGet2(_clipBox, this)[0], _classPrivateFieldGet2(_pendingBBox, this)[0]);
			_classPrivateFieldGet2(_clipBox, this)[1] = Math.max(_classPrivateFieldGet2(_clipBox, this)[1], _classPrivateFieldGet2(_pendingBBox, this)[1]);
			_classPrivateFieldGet2(_clipBox, this)[2] = Math.min(_classPrivateFieldGet2(_clipBox, this)[2], _classPrivateFieldGet2(_pendingBBox, this)[2]);
			_classPrivateFieldGet2(_clipBox, this)[3] = Math.min(_classPrivateFieldGet2(_clipBox, this)[3], _classPrivateFieldGet2(_pendingBBox, this)[3]);
		}
		return this;
	}
	take() {
		return new BBoxReader(_classPrivateFieldGet2(_bboxes2, this), _classPrivateFieldGet2(_bboxesCoords, this));
	}
	takeDebugMetadata() {
		throw new Error("Unreachable");
	}
	recordSimpleData(name, idx) {
		return this;
	}
	recordIncrementalData(name, idx) {
		return this;
	}
	resetIncrementalData(name, idx) {
		return this;
	}
	recordNamedData(name, idx) {
		return this;
	}
	recordSimpleDataFromNamed(name, depName, fallbackIdx) {
		return this;
	}
	recordFutureForcedDependency(name, idx) {
		return this;
	}
	inheritSimpleDataAsFutureForcedDependencies(names) {
		return this;
	}
	inheritPendingDependenciesAsFutureForcedDependencies() {
		return this;
	}
	recordCharacterBBox(idx, ctx, font, scale = 1, x = 0, y = 0, getMeasure) {
		return this;
	}
	getSimpleIndex(dependencyName) {}
	recordDependencies(idx, dependencyNames) {
		return this;
	}
	recordNamedDependency(idx, name) {
		return this;
	}
	recordShowTextOperation(idx, preserve = false) {
		return this;
	}
};
function _initializeBBoxes(operationsCount, oldBBoxes) {
	const buffer = /* @__PURE__ */ new ArrayBuffer(operationsCount * 4);
	_classPrivateFieldSet2(_bboxesCoords, this, new Uint8ClampedArray(buffer));
	_classPrivateFieldSet2(_bboxes2, this, new Uint32Array(buffer));
	if (oldBBoxes && oldBBoxes.length > 0) {
		_classPrivateFieldGet2(_bboxes2, this).set(oldBBoxes);
		_classPrivateFieldGet2(_bboxes2, this).fill(EMPTY_BBOX, oldBBoxes.length);
	} else _classPrivateFieldGet2(_bboxes2, this).fill(EMPTY_BBOX);
}
var _simple = /* @__PURE__ */ new WeakMap();
var _incremental = /* @__PURE__ */ new WeakMap();
var _namedDependencies = /* @__PURE__ */ new WeakMap();
var _pendingDependencies = /* @__PURE__ */ new WeakMap();
var _fontBBoxTrustworthy = /* @__PURE__ */ new WeakMap();
var _debugMetadata = /* @__PURE__ */ new WeakMap();
var _recordDebugMetadataDepenencyAfterRestore = /* @__PURE__ */ new WeakMap();
var _bboxTracker = /* @__PURE__ */ new WeakMap();
var CanvasDependencyTracker = class {
	constructor(bboxTracker, recordDebugMetadata = false) {
		_classPrivateFieldInitSpec(this, _simple, { __proto__: null });
		_classPrivateFieldInitSpec(this, _incremental, {
			__proto__: null,
			transform: [],
			moveText: [],
			sameLineText: [],
			[FORCED_DEPENDENCY_LABEL]: []
		});
		_classPrivateFieldInitSpec(this, _namedDependencies, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _pendingDependencies, /* @__PURE__ */ new Set());
		_classPrivateFieldInitSpec(this, _fontBBoxTrustworthy, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _debugMetadata, void 0);
		_classPrivateFieldInitSpec(this, _recordDebugMetadataDepenencyAfterRestore, void 0);
		_classPrivateFieldInitSpec(this, _bboxTracker, void 0);
		_classPrivateFieldSet2(_bboxTracker, this, bboxTracker);
		if (recordDebugMetadata) {
			_classPrivateFieldSet2(_debugMetadata, this, /* @__PURE__ */ new Map());
			_classPrivateFieldSet2(_recordDebugMetadataDepenencyAfterRestore, this, (lastSave, opIdx) => {
				ensureDebugMetadata(_classPrivateFieldGet2(_debugMetadata, this), opIdx).dependencies.add(lastSave);
			});
		}
	}
	get clipBox() {
		return _classPrivateFieldGet2(_bboxTracker, this).clipBox;
	}
	growOperationsCount(operationsCount) {
		_classPrivateFieldGet2(_bboxTracker, this).growOperationsCount(operationsCount);
	}
	save(opIdx) {
		_classPrivateFieldSet2(_simple, this, { __proto__: _classPrivateFieldGet2(_simple, this) });
		_classPrivateFieldSet2(_incremental, this, {
			__proto__: _classPrivateFieldGet2(_incremental, this),
			transform: { __proto__: _classPrivateFieldGet2(_incremental, this).transform },
			moveText: { __proto__: _classPrivateFieldGet2(_incremental, this).moveText },
			sameLineText: { __proto__: _classPrivateFieldGet2(_incremental, this).sameLineText },
			[FORCED_DEPENDENCY_LABEL]: { __proto__: _classPrivateFieldGet2(_incremental, this)[FORCED_DEPENDENCY_LABEL] }
		});
		_classPrivateFieldGet2(_bboxTracker, this).save(opIdx);
		return this;
	}
	restore(opIdx) {
		_classPrivateFieldGet2(_bboxTracker, this).restore(opIdx, _classPrivateFieldGet2(_recordDebugMetadataDepenencyAfterRestore, this));
		const previous = Object.getPrototypeOf(_classPrivateFieldGet2(_simple, this));
		if (previous === null) return this;
		_classPrivateFieldSet2(_simple, this, previous);
		_classPrivateFieldSet2(_incremental, this, Object.getPrototypeOf(_classPrivateFieldGet2(_incremental, this)));
		return this;
	}
	recordOpenMarker(opIdx) {
		_classPrivateFieldGet2(_bboxTracker, this).recordOpenMarker(opIdx, _classPrivateFieldGet2(_recordDebugMetadataDepenencyAfterRestore, this));
		return this;
	}
	getOpenMarker() {
		return _classPrivateFieldGet2(_bboxTracker, this).getOpenMarker();
	}
	recordCloseMarker(opIdx) {
		_classPrivateFieldGet2(_bboxTracker, this).recordCloseMarker(opIdx, _classPrivateFieldGet2(_recordDebugMetadataDepenencyAfterRestore, this));
		return this;
	}
	beginMarkedContent(opIdx) {
		_classPrivateFieldGet2(_bboxTracker, this).beginMarkedContent(opIdx);
		return this;
	}
	endMarkedContent(opIdx) {
		_classPrivateFieldGet2(_bboxTracker, this).endMarkedContent(opIdx, _classPrivateFieldGet2(_recordDebugMetadataDepenencyAfterRestore, this));
		return this;
	}
	pushBaseTransform(ctx) {
		_classPrivateFieldGet2(_bboxTracker, this).pushBaseTransform(ctx);
		return this;
	}
	popBaseTransform() {
		_classPrivateFieldGet2(_bboxTracker, this).popBaseTransform();
		return this;
	}
	recordSimpleData(name, idx) {
		_classPrivateFieldGet2(_simple, this)[name] = idx;
		return this;
	}
	recordIncrementalData(name, idx) {
		_classPrivateFieldGet2(_incremental, this)[name].push(idx);
		return this;
	}
	resetIncrementalData(name, idx) {
		_classPrivateFieldGet2(_incremental, this)[name].length = 0;
		return this;
	}
	recordNamedData(name, idx) {
		_classPrivateFieldGet2(_namedDependencies, this).set(name, idx);
		return this;
	}
	recordSimpleDataFromNamed(name, depName, fallbackIdx) {
		_classPrivateFieldGet2(_simple, this)[name] = _classPrivateFieldGet2(_namedDependencies, this).get(depName) ?? fallbackIdx;
	}
	recordFutureForcedDependency(name, idx) {
		this.recordIncrementalData(FORCED_DEPENDENCY_LABEL, idx);
		return this;
	}
	inheritSimpleDataAsFutureForcedDependencies(names) {
		for (const name of names) if (name in _classPrivateFieldGet2(_simple, this)) this.recordFutureForcedDependency(name, _classPrivateFieldGet2(_simple, this)[name]);
		return this;
	}
	inheritPendingDependenciesAsFutureForcedDependencies() {
		for (const dep of _classPrivateFieldGet2(_pendingDependencies, this)) this.recordFutureForcedDependency(FORCED_DEPENDENCY_LABEL, dep);
		return this;
	}
	resetBBox(idx) {
		_classPrivateFieldGet2(_bboxTracker, this).resetBBox(idx);
		return this;
	}
	recordClipBox(idx, ctx, minX, maxX, minY, maxY) {
		_classPrivateFieldGet2(_bboxTracker, this).recordClipBox(idx, ctx, minX, maxX, minY, maxY);
		return this;
	}
	recordBBox(idx, ctx, minX, maxX, minY, maxY) {
		_classPrivateFieldGet2(_bboxTracker, this).recordBBox(idx, ctx, minX, maxX, minY, maxY);
		return this;
	}
	recordCharacterBBox(idx, ctx, font, scale = 1, x = 0, y = 0, getMeasure) {
		const fontBBox = font.bbox;
		let isBBoxTrustworthy;
		let computedBBox;
		if (fontBBox) {
			isBBoxTrustworthy = fontBBox[2] !== fontBBox[0] && fontBBox[3] !== fontBBox[1] && _classPrivateFieldGet2(_fontBBoxTrustworthy, this).get(font);
			if (isBBoxTrustworthy !== false) {
				computedBBox = [
					0,
					0,
					0,
					0
				];
				Util.axialAlignedBoundingBox(fontBBox, font.fontMatrix, computedBBox);
				if (scale !== 1 || x !== 0 || y !== 0) Util.scaleMinMax([
					scale,
					0,
					0,
					-scale,
					x,
					y
				], computedBBox);
				if (isBBoxTrustworthy) return this.recordBBox(idx, ctx, computedBBox[0], computedBBox[2], computedBBox[1], computedBBox[3]);
			}
		}
		if (!getMeasure) return this.recordFullPageBBox(idx);
		const measure = getMeasure();
		if (fontBBox && computedBBox && isBBoxTrustworthy === void 0) {
			isBBoxTrustworthy = computedBBox[0] <= x - measure.actualBoundingBoxLeft && computedBBox[2] >= x + measure.actualBoundingBoxRight && computedBBox[1] <= y - measure.actualBoundingBoxAscent && computedBBox[3] >= y + measure.actualBoundingBoxDescent;
			_classPrivateFieldGet2(_fontBBoxTrustworthy, this).set(font, isBBoxTrustworthy);
			if (isBBoxTrustworthy) return this.recordBBox(idx, ctx, computedBBox[0], computedBBox[2], computedBBox[1], computedBBox[3]);
		}
		return this.recordBBox(idx, ctx, x - measure.actualBoundingBoxLeft, x + measure.actualBoundingBoxRight, y - measure.actualBoundingBoxAscent, y + measure.actualBoundingBoxDescent);
	}
	recordFullPageBBox(idx) {
		_classPrivateFieldGet2(_bboxTracker, this).recordFullPageBBox(idx);
		return this;
	}
	getSimpleIndex(dependencyName) {
		return _classPrivateFieldGet2(_simple, this)[dependencyName];
	}
	recordDependencies(idx, dependencyNames) {
		const pendingDependencies = _classPrivateFieldGet2(_pendingDependencies, this);
		const simple = _classPrivateFieldGet2(_simple, this);
		const incremental = _classPrivateFieldGet2(_incremental, this);
		for (const name of dependencyNames) if (name in _classPrivateFieldGet2(_simple, this)) pendingDependencies.add(simple[name]);
		else if (name in incremental) incremental[name].forEach(pendingDependencies.add, pendingDependencies);
		return this;
	}
	recordNamedDependency(idx, name) {
		if (_classPrivateFieldGet2(_namedDependencies, this).has(name)) _classPrivateFieldGet2(_pendingDependencies, this).add(_classPrivateFieldGet2(_namedDependencies, this).get(name));
		return this;
	}
	recordOperation(idx, preserve = false) {
		this.recordDependencies(idx, [FORCED_DEPENDENCY_LABEL]);
		if (_classPrivateFieldGet2(_debugMetadata, this)) {
			const metadata = ensureDebugMetadata(_classPrivateFieldGet2(_debugMetadata, this), idx);
			const { dependencies } = metadata;
			_classPrivateFieldGet2(_pendingDependencies, this).forEach(dependencies.add, dependencies);
			_classPrivateFieldGet2(_bboxTracker, this)._savesStack.forEach(dependencies.add, dependencies);
			_classPrivateFieldGet2(_bboxTracker, this)._markedContentStack.forEach(dependencies.add, dependencies);
			dependencies.delete(idx);
			metadata.isRenderingOperation = true;
		}
		const needsCleanup = !preserve && idx === _classPrivateFieldGet2(_bboxTracker, this)._pendingBBoxIdx;
		_classPrivateFieldGet2(_bboxTracker, this).recordOperation(idx, preserve, [
			_classPrivateFieldGet2(_pendingDependencies, this),
			_classPrivateFieldGet2(_bboxTracker, this)._savesStack,
			_classPrivateFieldGet2(_bboxTracker, this)._markedContentStack
		]);
		if (needsCleanup) _classPrivateFieldGet2(_pendingDependencies, this).clear();
		return this;
	}
	recordShowTextOperation(idx, preserve = false) {
		const deps = Array.from(_classPrivateFieldGet2(_pendingDependencies, this));
		this.recordOperation(idx, preserve);
		this.recordIncrementalData("sameLineText", idx);
		for (const dep of deps) this.recordIncrementalData("sameLineText", dep);
		return this;
	}
	bboxToClipBoxDropOperation(idx, preserve = false) {
		const needsCleanup = !preserve && idx === _classPrivateFieldGet2(_bboxTracker, this)._pendingBBoxIdx;
		_classPrivateFieldGet2(_bboxTracker, this).bboxToClipBoxDropOperation(idx);
		if (needsCleanup) _classPrivateFieldGet2(_pendingDependencies, this).clear();
		return this;
	}
	take() {
		_classPrivateFieldGet2(_fontBBoxTrustworthy, this).clear();
		return _classPrivateFieldGet2(_bboxTracker, this).take();
	}
	takeDebugMetadata() {
		return _classPrivateFieldGet2(_debugMetadata, this);
	}
};
var _dependencyTracker = /* @__PURE__ */ new WeakMap();
var _opIdx = /* @__PURE__ */ new WeakMap();
var _ignoreBBoxes = /* @__PURE__ */ new WeakMap();
var _nestingLevel = /* @__PURE__ */ new WeakMap();
var _savesLevel = /* @__PURE__ */ new WeakMap();
var CanvasNestedDependencyTracker = class CanvasNestedDependencyTracker {
	constructor(dependencyTracker, opIdx, ignoreBBoxes) {
		_classPrivateFieldInitSpec(this, _dependencyTracker, void 0);
		_classPrivateFieldInitSpec(this, _opIdx, void 0);
		_classPrivateFieldInitSpec(this, _ignoreBBoxes, void 0);
		_classPrivateFieldInitSpec(this, _nestingLevel, 0);
		_classPrivateFieldInitSpec(this, _savesLevel, 0);
		if (dependencyTracker instanceof CanvasNestedDependencyTracker && _classPrivateFieldGet2(_ignoreBBoxes, dependencyTracker) === !!ignoreBBoxes) return dependencyTracker;
		_classPrivateFieldSet2(_dependencyTracker, this, dependencyTracker);
		_classPrivateFieldSet2(_opIdx, this, opIdx);
		_classPrivateFieldSet2(_ignoreBBoxes, this, !!ignoreBBoxes);
	}
	get clipBox() {
		return _classPrivateFieldGet2(_dependencyTracker, this).clipBox;
	}
	growOperationsCount() {
		throw new Error("Unreachable");
	}
	save(opIdx) {
		var _this$savesLevel;
		_classPrivateFieldSet2(_savesLevel, this, (_this$savesLevel = _classPrivateFieldGet2(_savesLevel, this), _this$savesLevel++, _this$savesLevel));
		_classPrivateFieldGet2(_dependencyTracker, this).save(_classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	restore(opIdx) {
		if (_classPrivateFieldGet2(_savesLevel, this) > 0) {
			var _this$savesLevel3;
			_classPrivateFieldGet2(_dependencyTracker, this).restore(_classPrivateFieldGet2(_opIdx, this));
			_classPrivateFieldSet2(_savesLevel, this, (_this$savesLevel3 = _classPrivateFieldGet2(_savesLevel, this), _this$savesLevel3--, _this$savesLevel3));
		}
		return this;
	}
	recordOpenMarker(idx) {
		var _this$nestingLevel;
		_classPrivateFieldSet2(_nestingLevel, this, (_this$nestingLevel = _classPrivateFieldGet2(_nestingLevel, this), _this$nestingLevel++, _this$nestingLevel));
		return this;
	}
	getOpenMarker() {
		return _classPrivateFieldGet2(_nestingLevel, this) > 0 ? _classPrivateFieldGet2(_opIdx, this) : _classPrivateFieldGet2(_dependencyTracker, this).getOpenMarker();
	}
	recordCloseMarker(idx) {
		var _this$nestingLevel3;
		_classPrivateFieldSet2(_nestingLevel, this, (_this$nestingLevel3 = _classPrivateFieldGet2(_nestingLevel, this), _this$nestingLevel3--, _this$nestingLevel3));
		return this;
	}
	beginMarkedContent(opIdx) {
		return this;
	}
	endMarkedContent(opIdx) {
		return this;
	}
	pushBaseTransform(ctx) {
		_classPrivateFieldGet2(_dependencyTracker, this).pushBaseTransform(ctx);
		return this;
	}
	popBaseTransform() {
		_classPrivateFieldGet2(_dependencyTracker, this).popBaseTransform();
		return this;
	}
	recordSimpleData(name, idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordSimpleData(name, _classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	recordIncrementalData(name, idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordIncrementalData(name, _classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	resetIncrementalData(name, idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).resetIncrementalData(name, _classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	recordNamedData(name, idx) {
		return this;
	}
	recordSimpleDataFromNamed(name, depName, fallbackIdx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordSimpleDataFromNamed(name, depName, _classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	recordFutureForcedDependency(name, idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordFutureForcedDependency(name, _classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	inheritSimpleDataAsFutureForcedDependencies(names) {
		_classPrivateFieldGet2(_dependencyTracker, this).inheritSimpleDataAsFutureForcedDependencies(names);
		return this;
	}
	inheritPendingDependenciesAsFutureForcedDependencies() {
		_classPrivateFieldGet2(_dependencyTracker, this).inheritPendingDependenciesAsFutureForcedDependencies();
		return this;
	}
	resetBBox(idx) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).resetBBox(_classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	recordClipBox(idx, ctx, minX, maxX, minY, maxY) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).recordClipBox(_classPrivateFieldGet2(_opIdx, this), ctx, minX, maxX, minY, maxY);
		return this;
	}
	recordBBox(idx, ctx, minX, maxX, minY, maxY) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).recordBBox(_classPrivateFieldGet2(_opIdx, this), ctx, minX, maxX, minY, maxY);
		return this;
	}
	recordCharacterBBox(idx, ctx, font, scale, x, y, getMeasure) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).recordCharacterBBox(_classPrivateFieldGet2(_opIdx, this), ctx, font, scale, x, y, getMeasure);
		return this;
	}
	recordFullPageBBox(idx) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).recordFullPageBBox(_classPrivateFieldGet2(_opIdx, this));
		return this;
	}
	getSimpleIndex(dependencyName) {
		return _classPrivateFieldGet2(_dependencyTracker, this).getSimpleIndex(dependencyName);
	}
	recordDependencies(idx, dependencyNames) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordDependencies(_classPrivateFieldGet2(_opIdx, this), dependencyNames);
		return this;
	}
	recordNamedDependency(idx, name) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordNamedDependency(_classPrivateFieldGet2(_opIdx, this), name);
		return this;
	}
	recordOperation(idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordOperation(_classPrivateFieldGet2(_opIdx, this), true);
		return this;
	}
	recordShowTextOperation(idx) {
		_classPrivateFieldGet2(_dependencyTracker, this).recordShowTextOperation(_classPrivateFieldGet2(_opIdx, this), true);
		return this;
	}
	bboxToClipBoxDropOperation(idx) {
		if (!_classPrivateFieldGet2(_ignoreBBoxes, this)) _classPrivateFieldGet2(_dependencyTracker, this).bboxToClipBoxDropOperation(_classPrivateFieldGet2(_opIdx, this), true);
		return this;
	}
	take() {
		throw new Error("Unreachable");
	}
	takeDebugMetadata() {
		throw new Error("Unreachable");
	}
};
var Dependencies = {
	stroke: [
		"path",
		"transform",
		"filter",
		"strokeColor",
		"strokeAlpha",
		"lineWidth",
		"lineCap",
		"lineJoin",
		"miterLimit",
		"dash"
	],
	fill: [
		"path",
		"transform",
		"filter",
		"fillColor",
		"fillAlpha",
		"globalCompositeOperation",
		"SMask"
	],
	imageXObject: [
		"transform",
		"SMask",
		"filter",
		"fillAlpha",
		"strokeAlpha",
		"globalCompositeOperation"
	],
	rawFillPath: [
		"filter",
		"fillColor",
		"fillAlpha"
	],
	showText: [
		"transform",
		"leading",
		"charSpacing",
		"wordSpacing",
		"hScale",
		"textRise",
		"moveText",
		"textMatrix",
		"font",
		"fontObj",
		"filter",
		"fillColor",
		"textRenderingMode",
		"SMask",
		"fillAlpha",
		"strokeAlpha",
		"globalCompositeOperation",
		"sameLineText"
	],
	transform: ["transform"],
	transformAndFill: ["transform", "fillColor"]
};
var _canvasWidth2 = /* @__PURE__ */ new WeakMap();
var _canvasHeight2 = /* @__PURE__ */ new WeakMap();
var _capacity = /* @__PURE__ */ new WeakMap();
var _count = /* @__PURE__ */ new WeakMap();
var _coords2 = /* @__PURE__ */ new WeakMap();
var CanvasImagesTracker = class {
	constructor(canvas) {
		_classPrivateFieldInitSpec(this, _canvasWidth2, void 0);
		_classPrivateFieldInitSpec(this, _canvasHeight2, void 0);
		_classPrivateFieldInitSpec(this, _capacity, 4);
		_classPrivateFieldInitSpec(this, _count, 0);
		_classPrivateFieldInitSpec(this, _coords2, new _CoordsArray._(_classPrivateFieldGet2(_capacity, this) * 6));
		_classPrivateFieldSet2(_canvasWidth2, this, canvas.width);
		_classPrivateFieldSet2(_canvasHeight2, this, canvas.height);
	}
	record(ctx, width, height, clipBox) {
		var _this$count;
		if (_classPrivateFieldGet2(_count, this) === _classPrivateFieldGet2(_capacity, this)) {
			_classPrivateFieldSet2(_capacity, this, _classPrivateFieldGet2(_capacity, this) * 2);
			const newCoords = new _CoordsArray._(_classPrivateFieldGet2(_capacity, this) * 6);
			newCoords.set(_classPrivateFieldGet2(_coords2, this));
			_classPrivateFieldSet2(_coords2, this, newCoords);
		}
		const transform = Util.domMatrixToTransform(ctx.getTransform());
		let coords;
		if (clipBox[0] !== Infinity) {
			const bbox = [
				Infinity,
				Infinity,
				-Infinity,
				-Infinity
			];
			Util.axialAlignedBoundingBox([
				0,
				-height,
				width,
				0
			], transform, bbox);
			const finalBBox = Util.intersect(clipBox, bbox);
			if (!finalBBox) return;
			const [minX, minY, maxX, maxY] = finalBBox;
			if (minX !== bbox[0] || minY !== bbox[1] || maxX !== bbox[2] || maxY !== bbox[3]) {
				const rotationAngle = Math.atan2(transform[1], transform[0]);
				const sin = Math.abs(Math.sin(rotationAngle));
				const cos = Math.abs(Math.cos(rotationAngle));
				if (sin < 1e-6 || cos < 1e-6 || Math.abs(sin - cos) < 1e-6) coords = [
					minX,
					minY,
					minX,
					maxY,
					maxX,
					minY
				];
				else {
					const finalBBoxWidth = maxX - minX;
					const finalBBoxHeight = maxY - minY;
					const sin2 = sin * sin;
					const cos2 = cos * cos;
					const cosSin = cos * sin;
					const denom = cos2 - sin2;
					const a = (finalBBoxHeight * cos2 - finalBBoxWidth * cosSin) / denom;
					coords = [
						minX + (finalBBoxHeight * cosSin - finalBBoxWidth * sin2) / denom,
						minY,
						minX,
						minY + a,
						maxX,
						maxY - a
					];
				}
			}
		}
		if (!coords) {
			coords = [
				0,
				-height,
				0,
				0,
				width,
				-height
			];
			Util.applyTransform(coords, transform, 0);
			Util.applyTransform(coords, transform, 2);
			Util.applyTransform(coords, transform, 4);
		}
		coords[0] /= _classPrivateFieldGet2(_canvasWidth2, this);
		coords[1] /= _classPrivateFieldGet2(_canvasHeight2, this);
		coords[2] /= _classPrivateFieldGet2(_canvasWidth2, this);
		coords[3] /= _classPrivateFieldGet2(_canvasHeight2, this);
		coords[4] /= _classPrivateFieldGet2(_canvasWidth2, this);
		coords[5] /= _classPrivateFieldGet2(_canvasHeight2, this);
		_classPrivateFieldGet2(_coords2, this).set(coords, _classPrivateFieldGet2(_count, this) * 6);
		_classPrivateFieldSet2(_count, this, (_this$count = _classPrivateFieldGet2(_count, this), _this$count++, _this$count));
	}
	take() {
		return _classPrivateFieldGet2(_coords2, this).subarray(0, _classPrivateFieldGet2(_count, this) * 6);
	}
};
var _CoordsArray = { _: FeatureTest.isFloat16ArraySupported ? Float16Array : Float32Array };
var _systemFonts = /* @__PURE__ */ new WeakMap();
var FontLoader = class {
	constructor({ ownerDocument = globalThis.document, styleElement = null }) {
		_classPrivateFieldInitSpec(this, _systemFonts, /* @__PURE__ */ new Set());
		this._document = ownerDocument;
		this.nativeFontFaces = /* @__PURE__ */ new Set();
		this.styleElement = null;
		this.loadingRequests = [];
		this.loadTestFontId = 0;
	}
	addNativeFontFace(nativeFontFace) {
		this.nativeFontFaces.add(nativeFontFace);
		this._document.fonts.add(nativeFontFace);
	}
	removeNativeFontFace(nativeFontFace) {
		this.nativeFontFaces.delete(nativeFontFace);
		this._document.fonts.delete(nativeFontFace);
	}
	insertRule(rule) {
		if (!this.styleElement) {
			this.styleElement = this._document.createElement("style");
			this._document.documentElement.getElementsByTagName("head")[0].append(this.styleElement);
		}
		const styleSheet = this.styleElement.sheet;
		styleSheet.insertRule(rule, styleSheet.cssRules.length);
	}
	clear() {
		for (const nativeFontFace of this.nativeFontFaces) this._document.fonts.delete(nativeFontFace);
		this.nativeFontFaces.clear();
		_classPrivateFieldGet2(_systemFonts, this).clear();
		if (this.styleElement) {
			this.styleElement.remove();
			this.styleElement = null;
		}
	}
	async loadSystemFont({ systemFontInfo: info, disableFontFace, _inspectFont }) {
		if (!info || _classPrivateFieldGet2(_systemFonts, this).has(info.loadedName)) return;
		assert(!disableFontFace, "loadSystemFont shouldn't be called when `disableFontFace` is set.");
		if (this.isFontLoadingAPISupported) {
			const { loadedName, src, style } = info;
			const fontFace = new FontFace(loadedName, src, style);
			this.addNativeFontFace(fontFace);
			try {
				await fontFace.load();
				_classPrivateFieldGet2(_systemFonts, this).add(loadedName);
				_inspectFont?.(info);
			} catch {
				warn(`Cannot load system font: ${info.baseFontName}, installing it could help to improve PDF rendering.`);
				this.removeNativeFontFace(fontFace);
			}
			return;
		}
		unreachable("Not implemented: loadSystemFont without the Font Loading API.");
	}
	async bind(font) {
		if (font.attached || font.missingFile && !font.systemFontInfo) return;
		font.attached = true;
		if (font.systemFontInfo) {
			await this.loadSystemFont(font);
			return;
		}
		if (this.isFontLoadingAPISupported) {
			const nativeFontFace = font.createNativeFontFace();
			if (nativeFontFace) {
				this.addNativeFontFace(nativeFontFace);
				try {
					await nativeFontFace.loaded;
				} catch (ex) {
					warn(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);
					font.disableFontFace = true;
					throw ex;
				}
			}
			return;
		}
		const rule = font.createFontFaceRule();
		if (rule) {
			this.insertRule(rule);
			if (this.isSyncFontLoadingSupported) return;
			await new Promise((resolve) => {
				const request = this._queueLoadingCallback(resolve);
				this._prepareFontLoadEvent(font, request);
			});
		}
	}
	get isFontLoadingAPISupported() {
		const hasFonts = !!this._document?.fonts;
		return shadow(this, "isFontLoadingAPISupported", hasFonts);
	}
	get isSyncFontLoadingSupported() {
		return shadow(this, "isSyncFontLoadingSupported", isNodeJS || FeatureTest.platform.isFirefox);
	}
	_queueLoadingCallback(callback) {
		function completeRequest() {
			assert(!request.done, "completeRequest() cannot be called twice.");
			request.done = true;
			while (loadingRequests.length > 0 && loadingRequests[0].done) {
				const otherRequest = loadingRequests.shift();
				setTimeout(otherRequest.callback, 0);
			}
		}
		const { loadingRequests } = this;
		const request = {
			done: false,
			complete: completeRequest,
			callback
		};
		loadingRequests.push(request);
		return request;
	}
	get _loadTestFont() {
		const testFont = atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
		return shadow(this, "_loadTestFont", testFont);
	}
	_prepareFontLoadEvent(font, request) {
		function int32(data, offset) {
			return data.charCodeAt(offset) << 24 | data.charCodeAt(offset + 1) << 16 | data.charCodeAt(offset + 2) << 8 | data.charCodeAt(offset + 3) & 255;
		}
		function spliceString(s, offset, remove, insert) {
			const chunk1 = s.substring(0, offset);
			const chunk2 = s.substring(offset + remove);
			return chunk1 + insert + chunk2;
		}
		let i, ii;
		const canvas = this._document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		const ctx = canvas.getContext("2d");
		let called = 0;
		function isFontReady(name, callback) {
			if (++called > 30) {
				warn("Load test font never loaded.");
				callback();
				return;
			}
			ctx.font = "30px " + name;
			ctx.fillText(".", 0, 20);
			if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
				callback();
				return;
			}
			setTimeout(isFontReady.bind(null, name, callback));
		}
		const loadTestFontId = `lt${Date.now()}${this.loadTestFontId++}`;
		let data = this._loadTestFont;
		data = spliceString(data, 976, loadTestFontId.length, loadTestFontId);
		const CFF_CHECKSUM_OFFSET = 16;
		const XXXX_VALUE = 1482184792;
		let checksum = int32(data, CFF_CHECKSUM_OFFSET);
		for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
		if (i < loadTestFontId.length) checksum = checksum - XXXX_VALUE + int32(loadTestFontId + "XXX", i) | 0;
		data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, string32(checksum));
		const rule = `@font-face {font-family:"${loadTestFontId}";src:${`url(data:font/opentype;base64,${btoa(data)});`}}`;
		this.insertRule(rule);
		const div = this._document.createElement("div");
		div.style.visibility = "hidden";
		div.style.width = div.style.height = "10px";
		div.style.position = "absolute";
		div.style.top = div.style.left = "0px";
		for (const name of [font.loadedName, loadTestFontId]) {
			const span = this._document.createElement("span");
			span.textContent = "Hi";
			span.style.fontFamily = name;
			div.append(span);
		}
		this._document.body.append(div);
		isFontReady(loadTestFontId, () => {
			div.remove();
			request.complete();
		});
	}
};
var _fontData = /* @__PURE__ */ new WeakMap();
var FontFaceObject = class {
	constructor(translatedData, inspectFont = null, charProcOperatorList, extra) {
		_defineProperty(this, "compiledGlyphs", Object.create(null));
		_classPrivateFieldInitSpec(this, _fontData, void 0);
		_classPrivateFieldSet2(_fontData, this, translatedData);
		this._inspectFont = inspectFont;
		if (charProcOperatorList) this.charProcOperatorList = charProcOperatorList;
		if (extra) Object.assign(this, extra);
	}
	createNativeFontFace() {
		if (!this.data || this.disableFontFace) return null;
		let nativeFontFace;
		if (!this.cssFontInfo) nativeFontFace = new FontFace(this.loadedName, this.data, {});
		else {
			const css = { weight: this.cssFontInfo.fontWeight };
			if (this.cssFontInfo.italicAngle) css.style = `oblique ${this.cssFontInfo.italicAngle}deg`;
			nativeFontFace = new FontFace(this.cssFontInfo.fontFamily, this.data, css);
		}
		this._inspectFont?.(this);
		return nativeFontFace;
	}
	createFontFaceRule() {
		if (!this.data || this.disableFontFace) return null;
		const url = `url(data:${this.mimetype};base64,${this.data.toBase64()});`;
		let rule;
		if (!this.cssFontInfo) rule = `@font-face {font-family:"${this.loadedName}";src:${url}}`;
		else {
			let css = `font-weight: ${this.cssFontInfo.fontWeight};`;
			if (this.cssFontInfo.italicAngle) css += `font-style: oblique ${this.cssFontInfo.italicAngle}deg;`;
			rule = `@font-face {font-family:"${this.cssFontInfo.fontFamily}";${css}src:${url}}`;
		}
		this._inspectFont?.(this, url);
		return rule;
	}
	getPathGenerator(objs, character) {
		if (this.compiledGlyphs[character] !== void 0) return this.compiledGlyphs[character];
		const objId = this.loadedName + "_path_" + character;
		let cmds;
		try {
			cmds = objs.get(objId);
		} catch (ex) {
			warn(`getPathGenerator - ignoring character: "${ex}".`);
		}
		const path = makePathFromDrawOPS(cmds?.path);
		if (!this.fontExtraProperties) objs.delete(objId);
		return this.compiledGlyphs[character] = path;
	}
	get black() {
		return _classPrivateFieldGet2(_fontData, this).black;
	}
	get bold() {
		return _classPrivateFieldGet2(_fontData, this).bold;
	}
	get disableFontFace() {
		return _classPrivateFieldGet2(_fontData, this).disableFontFace;
	}
	set disableFontFace(value) {
		shadow(this, "disableFontFace", !!value);
	}
	get fontExtraProperties() {
		return _classPrivateFieldGet2(_fontData, this).fontExtraProperties;
	}
	get isInvalidPDFjsFont() {
		return _classPrivateFieldGet2(_fontData, this).isInvalidPDFjsFont;
	}
	get isType3Font() {
		return _classPrivateFieldGet2(_fontData, this).isType3Font;
	}
	get italic() {
		return _classPrivateFieldGet2(_fontData, this).italic;
	}
	get missingFile() {
		return _classPrivateFieldGet2(_fontData, this).missingFile;
	}
	get remeasure() {
		return _classPrivateFieldGet2(_fontData, this).remeasure;
	}
	get vertical() {
		return _classPrivateFieldGet2(_fontData, this).vertical;
	}
	get ascent() {
		return _classPrivateFieldGet2(_fontData, this).ascent;
	}
	get defaultWidth() {
		return _classPrivateFieldGet2(_fontData, this).defaultWidth;
	}
	get descent() {
		return _classPrivateFieldGet2(_fontData, this).descent;
	}
	get bbox() {
		return _classPrivateFieldGet2(_fontData, this).bbox;
	}
	get fontMatrix() {
		return _classPrivateFieldGet2(_fontData, this).fontMatrix;
	}
	get fallbackName() {
		return _classPrivateFieldGet2(_fontData, this).fallbackName;
	}
	get loadedName() {
		return _classPrivateFieldGet2(_fontData, this).loadedName;
	}
	get mimetype() {
		return _classPrivateFieldGet2(_fontData, this).mimetype;
	}
	get name() {
		return _classPrivateFieldGet2(_fontData, this).name;
	}
	get data() {
		return _classPrivateFieldGet2(_fontData, this).data;
	}
	clearData() {
		_classPrivateFieldGet2(_fontData, this).clearData();
	}
	get cssFontInfo() {
		return _classPrivateFieldGet2(_fontData, this).cssFontInfo;
	}
	get systemFontInfo() {
		return _classPrivateFieldGet2(_fontData, this).systemFontInfo;
	}
	get defaultVMetrics() {
		return _classPrivateFieldGet2(_fontData, this).defaultVMetrics;
	}
};
var CSS_FONT_INFO = class {};
_defineProperty(CSS_FONT_INFO, "strings", [
	"fontFamily",
	"fontWeight",
	"italicAngle"
]);
var SYSTEM_FONT_INFO = class {};
_defineProperty(SYSTEM_FONT_INFO, "strings", [
	"css",
	"loadedName",
	"baseFontName",
	"src"
]);
var FONT_INFO = class {};
_FONT_INFO = FONT_INFO;
_defineProperty(FONT_INFO, "bools", [
	"black",
	"bold",
	"disableFontFace",
	"fontExtraProperties",
	"isInvalidPDFjsFont",
	"isType3Font",
	"italic",
	"missingFile",
	"remeasure",
	"vertical"
]);
_defineProperty(FONT_INFO, "numbers", [
	"ascent",
	"defaultWidth",
	"descent"
]);
_defineProperty(FONT_INFO, "strings", [
	"fallbackName",
	"loadedName",
	"mimetype",
	"name"
]);
_defineProperty(FONT_INFO, "OFFSET_NUMBERS", Math.ceil(_FONT_INFO.bools.length * 2 / 8));
_defineProperty(FONT_INFO, "OFFSET_BBOX", _FONT_INFO.OFFSET_NUMBERS + _FONT_INFO.numbers.length * 8);
_defineProperty(FONT_INFO, "OFFSET_FONT_MATRIX", _FONT_INFO.OFFSET_BBOX + 1 + 8);
_defineProperty(FONT_INFO, "OFFSET_DEFAULT_VMETRICS", _FONT_INFO.OFFSET_FONT_MATRIX + 1 + 48);
_defineProperty(FONT_INFO, "OFFSET_STRINGS", _FONT_INFO.OFFSET_DEFAULT_VMETRICS + 1 + 6);
var PATTERN_INFO = class {};
_defineProperty(PATTERN_INFO, "KIND", 0);
_defineProperty(PATTERN_INFO, "HAS_BBOX", 1);
_defineProperty(PATTERN_INFO, "HAS_BACKGROUND", 2);
_defineProperty(PATTERN_INFO, "SHADING_TYPE", 3);
_defineProperty(PATTERN_INFO, "N_COORD", 4);
_defineProperty(PATTERN_INFO, "N_COLOR", 8);
_defineProperty(PATTERN_INFO, "N_STOP", 12);
_defineProperty(PATTERN_INFO, "N_FIGURES", 16);
var _buffer = /* @__PURE__ */ new WeakMap();
var _decoder = /* @__PURE__ */ new WeakMap();
var _view = /* @__PURE__ */ new WeakMap();
var _CssFontInfo_brand = /* @__PURE__ */ new WeakSet();
var CssFontInfo = class {
	constructor(buffer) {
		_classPrivateMethodInitSpec(this, _CssFontInfo_brand);
		_classPrivateFieldInitSpec(this, _buffer, void 0);
		_classPrivateFieldInitSpec(this, _decoder, new TextDecoder());
		_classPrivateFieldInitSpec(this, _view, void 0);
		_classPrivateFieldSet2(_buffer, this, buffer);
		_classPrivateFieldSet2(_view, this, new DataView(buffer));
	}
	get fontFamily() {
		return _assertClassBrand(_CssFontInfo_brand, this, _readString).call(this, 0);
	}
	get fontWeight() {
		return _assertClassBrand(_CssFontInfo_brand, this, _readString).call(this, 1);
	}
	get italicAngle() {
		return _assertClassBrand(_CssFontInfo_brand, this, _readString).call(this, 2);
	}
};
function _readString(index) {
	assert(index < CSS_FONT_INFO.strings.length, "Invalid string index");
	let offset = 0;
	for (let i = 0; i < index; i++) offset += _classPrivateFieldGet2(_view, this).getUint32(offset) + 4;
	const length = _classPrivateFieldGet2(_view, this).getUint32(offset);
	return _classPrivateFieldGet2(_decoder, this).decode(new Uint8Array(_classPrivateFieldGet2(_buffer, this), offset + 4, length));
}
var _buffer2 = /* @__PURE__ */ new WeakMap();
var _decoder2 = /* @__PURE__ */ new WeakMap();
var _view2 = /* @__PURE__ */ new WeakMap();
var _SystemFontInfo_brand = /* @__PURE__ */ new WeakSet();
var SystemFontInfo = class {
	constructor(buffer) {
		_classPrivateMethodInitSpec(this, _SystemFontInfo_brand);
		_classPrivateFieldInitSpec(this, _buffer2, void 0);
		_classPrivateFieldInitSpec(this, _decoder2, new TextDecoder());
		_classPrivateFieldInitSpec(this, _view2, void 0);
		_classPrivateFieldSet2(_buffer2, this, buffer);
		_classPrivateFieldSet2(_view2, this, new DataView(buffer));
	}
	get guessFallback() {
		return _classPrivateFieldGet2(_view2, this).getUint8(0) !== 0;
	}
	get css() {
		return _assertClassBrand(_SystemFontInfo_brand, this, _readString2).call(this, 0);
	}
	get loadedName() {
		return _assertClassBrand(_SystemFontInfo_brand, this, _readString2).call(this, 1);
	}
	get baseFontName() {
		return _assertClassBrand(_SystemFontInfo_brand, this, _readString2).call(this, 2);
	}
	get src() {
		return _assertClassBrand(_SystemFontInfo_brand, this, _readString2).call(this, 3);
	}
	get style() {
		let offset = 1;
		offset += 4 + _classPrivateFieldGet2(_view2, this).getUint32(offset);
		const styleLength = _classPrivateFieldGet2(_view2, this).getUint32(offset);
		const style = _classPrivateFieldGet2(_decoder2, this).decode(new Uint8Array(_classPrivateFieldGet2(_buffer2, this), offset + 4, styleLength));
		offset += 4 + styleLength;
		const weightLength = _classPrivateFieldGet2(_view2, this).getUint32(offset);
		return {
			style,
			weight: _classPrivateFieldGet2(_decoder2, this).decode(new Uint8Array(_classPrivateFieldGet2(_buffer2, this), offset + 4, weightLength))
		};
	}
};
function _readString2(index) {
	assert(index < SYSTEM_FONT_INFO.strings.length, "Invalid string index");
	let offset = 5;
	for (let i = 0; i < index; i++) offset += _classPrivateFieldGet2(_view2, this).getUint32(offset) + 4;
	const length = _classPrivateFieldGet2(_view2, this).getUint32(offset);
	return _classPrivateFieldGet2(_decoder2, this).decode(new Uint8Array(_classPrivateFieldGet2(_buffer2, this), offset + 4, length));
}
var _buffer3 = /* @__PURE__ */ new WeakMap();
var _decoder3 = /* @__PURE__ */ new WeakMap();
var _view3 = /* @__PURE__ */ new WeakMap();
var _FontInfo_brand = /* @__PURE__ */ new WeakSet();
var FontInfo = class {
	constructor({ buffer, extra }) {
		_classPrivateMethodInitSpec(this, _FontInfo_brand);
		_classPrivateFieldInitSpec(this, _buffer3, void 0);
		_classPrivateFieldInitSpec(this, _decoder3, new TextDecoder());
		_classPrivateFieldInitSpec(this, _view3, void 0);
		_classPrivateFieldSet2(_buffer3, this, buffer);
		_classPrivateFieldSet2(_view3, this, new DataView(buffer));
		if (extra) Object.assign(this, extra);
	}
	get black() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 0);
	}
	get bold() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 1);
	}
	get disableFontFace() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 2);
	}
	get fontExtraProperties() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 3);
	}
	get isInvalidPDFjsFont() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 4);
	}
	get isType3Font() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 5);
	}
	get italic() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 6);
	}
	get missingFile() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 7);
	}
	get remeasure() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 8);
	}
	get vertical() {
		return _assertClassBrand(_FontInfo_brand, this, _readBoolean).call(this, 9);
	}
	get ascent() {
		return _assertClassBrand(_FontInfo_brand, this, _readNumber).call(this, 0);
	}
	get defaultWidth() {
		return _assertClassBrand(_FontInfo_brand, this, _readNumber).call(this, 1);
	}
	get descent() {
		return _assertClassBrand(_FontInfo_brand, this, _readNumber).call(this, 2);
	}
	get bbox() {
		return _assertClassBrand(_FontInfo_brand, this, _readArray).call(this, FONT_INFO.OFFSET_BBOX, 4, "getInt16", 2);
	}
	get fontMatrix() {
		return _assertClassBrand(_FontInfo_brand, this, _readArray).call(this, FONT_INFO.OFFSET_FONT_MATRIX, 6, "getFloat64", 8);
	}
	get defaultVMetrics() {
		return _assertClassBrand(_FontInfo_brand, this, _readArray).call(this, FONT_INFO.OFFSET_DEFAULT_VMETRICS, 3, "getInt16", 2);
	}
	get fallbackName() {
		return _assertClassBrand(_FontInfo_brand, this, _readString3).call(this, 0);
	}
	get loadedName() {
		return _assertClassBrand(_FontInfo_brand, this, _readString3).call(this, 1);
	}
	get mimetype() {
		return _assertClassBrand(_FontInfo_brand, this, _readString3).call(this, 2);
	}
	get name() {
		return _assertClassBrand(_FontInfo_brand, this, _readString3).call(this, 3);
	}
	get data() {
		const { offset, length } = _assertClassBrand(_FontInfo_brand, this, _getDataOffsets).call(this);
		return length === 0 ? void 0 : new Uint8Array(_classPrivateFieldGet2(_buffer3, this), offset + 4, length);
	}
	clearData() {
		const { offset, length } = _assertClassBrand(_FontInfo_brand, this, _getDataOffsets).call(this);
		if (length === 0) return;
		_classPrivateFieldGet2(_view3, this).setUint32(offset, 0);
		_classPrivateFieldSet2(_buffer3, this, new Uint8Array(_classPrivateFieldGet2(_buffer3, this), 0, offset + 4).slice().buffer);
		_classPrivateFieldSet2(_view3, this, new DataView(_classPrivateFieldGet2(_buffer3, this)));
	}
	get cssFontInfo() {
		let offset = FONT_INFO.OFFSET_STRINGS;
		const stringsLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
		offset += 4 + stringsLength;
		const systemFontInfoLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
		offset += 4 + systemFontInfoLength;
		const cssFontInfoLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
		if (cssFontInfoLength === 0) return null;
		const cssFontInfoData = new Uint8Array(cssFontInfoLength);
		cssFontInfoData.set(new Uint8Array(_classPrivateFieldGet2(_buffer3, this), offset + 4, cssFontInfoLength));
		return new CssFontInfo(cssFontInfoData.buffer);
	}
	get systemFontInfo() {
		let offset = FONT_INFO.OFFSET_STRINGS;
		const stringsLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
		offset += 4 + stringsLength;
		const systemFontInfoLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
		if (systemFontInfoLength === 0) return null;
		const systemFontInfoData = new Uint8Array(systemFontInfoLength);
		systemFontInfoData.set(new Uint8Array(_classPrivateFieldGet2(_buffer3, this), offset + 4, systemFontInfoLength));
		return new SystemFontInfo(systemFontInfoData.buffer);
	}
};
function _readBoolean(index) {
	assert(index < FONT_INFO.bools.length, "Invalid boolean index");
	const byteOffset = Math.floor(index / 4);
	const bitOffset = index * 2 % 8;
	const value = _classPrivateFieldGet2(_view3, this).getUint8(byteOffset) >> bitOffset & 3;
	return value === 0 ? void 0 : value === 2;
}
function _readNumber(index) {
	assert(index < FONT_INFO.numbers.length, "Invalid number index");
	return _classPrivateFieldGet2(_view3, this).getFloat64(FONT_INFO.OFFSET_NUMBERS + index * 8);
}
function _readArray(offset, arrLen, lookupName, increment) {
	const len = _classPrivateFieldGet2(_view3, this).getUint8(offset);
	if (len === 0) return;
	assert(len === arrLen, "Invalid array length.");
	offset += 1;
	const arr = new Array(len);
	for (let i = 0; i < len; i++) {
		arr[i] = _classPrivateFieldGet2(_view3, this)[lookupName](offset, true);
		offset += increment;
	}
	return arr;
}
function _readString3(index) {
	assert(index < FONT_INFO.strings.length, "Invalid string index");
	let offset = FONT_INFO.OFFSET_STRINGS + 4;
	for (let i = 0; i < index; i++) offset += _classPrivateFieldGet2(_view3, this).getUint32(offset) + 4;
	const length = _classPrivateFieldGet2(_view3, this).getUint32(offset);
	return _classPrivateFieldGet2(_decoder3, this).decode(new Uint8Array(_classPrivateFieldGet2(_buffer3, this), offset + 4, length));
}
function _getDataOffsets() {
	let offset = FONT_INFO.OFFSET_STRINGS;
	const stringsLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
	offset += 4 + stringsLength;
	const systemFontInfoLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
	offset += 4 + systemFontInfoLength;
	const cssFontInfoLength = _classPrivateFieldGet2(_view3, this).getUint32(offset);
	offset += 4 + cssFontInfoLength;
	const length = _classPrivateFieldGet2(_view3, this).getUint32(offset);
	return {
		offset,
		length
	};
}
var PatternInfo = class {
	constructor(buffer) {
		this.buffer = buffer;
		this.view = new DataView(buffer);
		this.data = new Uint8Array(buffer);
	}
	getIR() {
		const dataView = this.view;
		const kind = this.data[PATTERN_INFO.KIND];
		const hasBBox = !!this.data[PATTERN_INFO.HAS_BBOX];
		const hasBackground = !!this.data[PATTERN_INFO.HAS_BACKGROUND];
		const nCoord = dataView.getUint32(PATTERN_INFO.N_COORD, true);
		const nColor = dataView.getUint32(PATTERN_INFO.N_COLOR, true);
		const nStop = dataView.getUint32(PATTERN_INFO.N_STOP, true);
		const nFigures = dataView.getUint32(PATTERN_INFO.N_FIGURES, true);
		let offset = 20;
		const coords = new Float32Array(this.buffer, offset, nCoord * 2);
		offset += nCoord * 8;
		const colors = new Uint8Array(this.buffer, offset, nColor * 3);
		offset += nColor * 3;
		const stops = [];
		for (let i = 0; i < nStop; ++i) {
			const p = dataView.getFloat32(offset, true);
			offset += 4;
			const rgb = dataView.getUint32(offset, true);
			offset += 4;
			stops.push([p, `#${rgb.toString(16).padStart(6, "0")}`]);
		}
		let bbox = null;
		if (hasBBox) {
			bbox = [];
			for (let i = 0; i < 4; ++i) {
				bbox.push(dataView.getFloat32(offset, true));
				offset += 4;
			}
		}
		let background = null;
		if (hasBackground) {
			background = new Uint8Array(this.buffer, offset, 3);
			offset += 3;
		}
		const figures = [];
		for (let i = 0; i < nFigures; ++i) {
			const type = dataView.getUint8(offset);
			offset += 1;
			offset = Math.ceil(offset / 4) * 4;
			const coordsLength = dataView.getUint32(offset, true);
			offset += 4;
			const figureCoords = new Int32Array(this.buffer, offset, coordsLength);
			offset += coordsLength * 4;
			const colorsLength = dataView.getUint32(offset, true);
			offset += 4;
			const figureColors = new Int32Array(this.buffer, offset, colorsLength);
			offset += colorsLength * 4;
			const figure = {
				type,
				coords: figureCoords,
				colors: figureColors
			};
			if (type === MeshFigureType.LATTICE) {
				figure.verticesPerRow = dataView.getUint32(offset, true);
				offset += 4;
			}
			figures.push(figure);
		}
		if (kind === 1) return [
			"RadialAxial",
			"axial",
			bbox,
			stops,
			Array.from(coords.slice(0, 2)),
			Array.from(coords.slice(2, 4)),
			null,
			null
		];
		if (kind === 2) return [
			"RadialAxial",
			"radial",
			bbox,
			stops,
			[coords[0], coords[1]],
			[coords[3], coords[4]],
			coords[2],
			coords[5]
		];
		if (kind === 3) {
			const shadingType = this.data[PATTERN_INFO.SHADING_TYPE];
			let bounds = null;
			if (coords.length > 0) {
				bounds = [
					Infinity,
					Infinity,
					-Infinity,
					-Infinity
				];
				for (let i = 0, ii = coords.length; i < ii; i += 2) Util.pointBoundingBox(coords[i], coords[i + 1], bounds);
			}
			return [
				"Mesh",
				shadingType,
				coords,
				colors,
				figures,
				bounds,
				bbox,
				background
			];
		}
		throw new Error(`Unsupported pattern kind: ${kind}`);
	}
};
var _buffer4 = /* @__PURE__ */ new WeakMap();
var FontPathInfo = class {
	constructor(buffer) {
		_classPrivateFieldInitSpec(this, _buffer4, void 0);
		_classPrivateFieldSet2(_buffer4, this, buffer);
	}
	get path() {
		if (FeatureTest.isFloat16ArraySupported) return new Float16Array(_classPrivateFieldGet2(_buffer4, this));
		return new Float32Array(_classPrivateFieldGet2(_buffer4, this));
	}
};
function getUrlProp(val) {
	if (val instanceof URL) return val;
	if (typeof val === "string") {
		if (isNodeJS) {
			if (/^[a-z][a-z0-9\-+.]+:/i.test(val)) return new URL(val);
			const url = process.getBuiltinModule("url");
			return new URL(url.pathToFileURL(val));
		}
		const url = URL.parse(val, window.location);
		if (url) return url;
	}
	throw new Error("Invalid PDF url data: either string or URL-object is expected in the url property.");
}
function getDataProp(val) {
	if (isNodeJS && typeof Buffer !== "undefined" && val instanceof Buffer) throw new Error("Please provide binary data as `Uint8Array`, rather than `Buffer`.");
	if (val instanceof Uint8Array && val.byteLength === val.buffer.byteLength) return val;
	if (typeof val === "string") return stringToBytes(val);
	if (val instanceof ArrayBuffer || ArrayBuffer.isView(val) || typeof val === "object" && !isNaN(val?.length)) return new Uint8Array(val);
	throw new Error("Invalid PDF binary data: either TypedArray, string, or array-like object is expected in the data property.");
}
function getFactoryUrlProp(val) {
	if (typeof val !== "string") return null;
	if (val.endsWith("/")) return val;
	throw new Error(`Invalid factory url: "${val}" must include trailing slash.`);
}
var isRefProxy = (v) => typeof v === "object" && Number.isInteger(v?.num) && v.num >= 0 && Number.isInteger(v?.gen) && v.gen >= 0;
var isNameProxy = (v) => typeof v === "object" && typeof v?.name === "string";
var isValidExplicitDest = _isValidExplicitDest.bind(null, isRefProxy, isNameProxy);
var _listeners = /* @__PURE__ */ new WeakMap();
var _deferred = /* @__PURE__ */ new WeakMap();
var LoopbackPort = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _listeners, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _deferred, Promise.resolve());
	}
	postMessage(obj, transfer) {
		const event = { data: structuredClone(obj, transfer ? { transfer } : null) };
		_classPrivateFieldGet2(_deferred, this).then(() => {
			for (const [listener] of _classPrivateFieldGet2(_listeners, this)) listener.call(this, event);
		});
	}
	addEventListener(name, listener, options = null) {
		let rmAbort = null;
		if (options?.signal instanceof AbortSignal) {
			const { signal } = options;
			if (signal.aborted) {
				warn("LoopbackPort - cannot use an `aborted` signal.");
				return;
			}
			const onAbort = () => this.removeEventListener(name, listener);
			rmAbort = () => signal.removeEventListener("abort", onAbort);
			signal.addEventListener("abort", onAbort);
		}
		_classPrivateFieldGet2(_listeners, this).set(listener, rmAbort);
	}
	removeEventListener(name, listener) {
		_classPrivateFieldGet2(_listeners, this).get(listener)?.();
		_classPrivateFieldGet2(_listeners, this).delete(listener);
	}
	terminate() {
		for (const [, rmAbort] of _classPrivateFieldGet2(_listeners, this)) rmAbort?.();
		_classPrivateFieldGet2(_listeners, this).clear();
	}
};
var CallbackKind = {
	DATA: 1,
	ERROR: 2
};
var StreamKind = {
	CANCEL: 1,
	CANCEL_COMPLETE: 2,
	CLOSE: 3,
	ENQUEUE: 4,
	ERROR: 5,
	PULL: 6,
	PULL_COMPLETE: 7,
	START_COMPLETE: 8
};
function onFn() {}
function wrapReason(ex) {
	if (ex instanceof AbortException || ex instanceof InvalidPDFException || ex instanceof PasswordException || ex instanceof ResponseException || ex instanceof UnknownErrorException) return ex;
	if (!(ex instanceof Error || typeof ex === "object" && ex !== null)) unreachable("wrapReason: Expected \"reason\" to be a (possibly cloned) Error.");
	switch (ex.name) {
		case "AbortException": return new AbortException(ex.message);
		case "InvalidPDFException": return new InvalidPDFException(ex.message);
		case "PasswordException": return new PasswordException(ex.message, ex.code);
		case "ResponseException": return new ResponseException(ex.message, ex.status, ex.missing);
		case "UnknownErrorException": return new UnknownErrorException(ex.message, ex.details);
	}
	return new UnknownErrorException(ex.message, ex.toString());
}
var _messageAC = /* @__PURE__ */ new WeakMap();
var _MessageHandler_brand = /* @__PURE__ */ new WeakSet();
var MessageHandler = class {
	constructor(sourceName, targetName, comObj) {
		_classPrivateMethodInitSpec(this, _MessageHandler_brand);
		_classPrivateFieldInitSpec(this, _messageAC, new AbortController());
		this.sourceName = sourceName;
		this.targetName = targetName;
		this.comObj = comObj;
		this.callbackId = 1;
		this.streamId = 1;
		this.streamSinks = Object.create(null);
		this.streamControllers = Object.create(null);
		this.callbackCapabilities = Object.create(null);
		this.actionHandler = Object.create(null);
		comObj.addEventListener("message", _assertClassBrand(_MessageHandler_brand, this, _onMessage).bind(this), { signal: _classPrivateFieldGet2(_messageAC, this).signal });
	}
	on(actionName, handler) {
		const ah = this.actionHandler;
		if (ah[actionName]) throw new Error(`There is already an actionName called "${actionName}"`);
		ah[actionName] = handler;
	}
	send(actionName, data, transfers) {
		this.comObj.postMessage({
			sourceName: this.sourceName,
			targetName: this.targetName,
			action: actionName,
			data
		}, transfers);
	}
	sendWithPromise(actionName, data, transfers) {
		const callbackId = this.callbackId++;
		const capability = Promise.withResolvers();
		this.callbackCapabilities[callbackId] = capability;
		try {
			this.comObj.postMessage({
				sourceName: this.sourceName,
				targetName: this.targetName,
				action: actionName,
				callbackId,
				data
			}, transfers);
		} catch (ex) {
			capability.reject(ex);
		}
		return capability.promise;
	}
	sendWithStream(actionName, data, queueingStrategy, transfers) {
		const streamId = this.streamId++, sourceName = this.sourceName, targetName = this.targetName, comObj = this.comObj;
		return new ReadableStream({
			start: (controller) => {
				const startCapability = Promise.withResolvers();
				this.streamControllers[streamId] = {
					controller,
					startCall: startCapability,
					pullCall: null,
					cancelCall: null,
					isClosed: false
				};
				comObj.postMessage({
					sourceName,
					targetName,
					action: actionName,
					streamId,
					data,
					desiredSize: controller.desiredSize
				}, transfers);
				return startCapability.promise;
			},
			pull: (controller) => {
				const pullCapability = Promise.withResolvers();
				this.streamControllers[streamId].pullCall = pullCapability;
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.PULL,
					streamId,
					desiredSize: controller.desiredSize
				});
				return pullCapability.promise;
			},
			cancel: (reason) => {
				assert(reason instanceof Error, "cancel must have a valid reason");
				const cancelCapability = Promise.withResolvers();
				this.streamControllers[streamId].cancelCall = cancelCapability;
				this.streamControllers[streamId].isClosed = true;
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.CANCEL,
					streamId,
					reason: wrapReason(reason)
				});
				return cancelCapability.promise;
			}
		}, queueingStrategy);
	}
	destroy() {
		_classPrivateFieldGet2(_messageAC, this)?.abort();
		_classPrivateFieldSet2(_messageAC, this, null);
	}
};
function _onMessage({ data }) {
	if (data.targetName !== this.sourceName) return;
	if (data.stream) {
		_assertClassBrand(_MessageHandler_brand, this, _processStreamMessage).call(this, data);
		return;
	}
	if (data.callback) {
		const callbackId = data.callbackId;
		const capability = this.callbackCapabilities[callbackId];
		if (!capability) throw new Error(`Cannot resolve callback ${callbackId}`);
		delete this.callbackCapabilities[callbackId];
		if (data.callback === CallbackKind.DATA) capability.resolve(data.data);
		else if (data.callback === CallbackKind.ERROR) capability.reject(wrapReason(data.reason));
		else throw new Error("Unexpected callback case");
		return;
	}
	const action = this.actionHandler[data.action];
	if (!action) throw new Error(`Unknown action from worker: ${data.action}`);
	if (data.callbackId) {
		const sourceName = this.sourceName, targetName = data.sourceName, comObj = this.comObj;
		Promise.try(action, data.data).then(function(result) {
			comObj.postMessage({
				sourceName,
				targetName,
				callback: CallbackKind.DATA,
				callbackId: data.callbackId,
				data: result
			});
		}, function(reason) {
			comObj.postMessage({
				sourceName,
				targetName,
				callback: CallbackKind.ERROR,
				callbackId: data.callbackId,
				reason: wrapReason(reason)
			});
		});
		return;
	}
	if (data.streamId) {
		_assertClassBrand(_MessageHandler_brand, this, _createStreamSink).call(this, data);
		return;
	}
	action(data.data);
}
function _createStreamSink(data) {
	const streamId = data.streamId, sourceName = this.sourceName, targetName = data.sourceName, comObj = this.comObj;
	const self = this, action = this.actionHandler[data.action];
	const streamSink = {
		enqueue(chunk, size = 1, transfers) {
			if (this.isCancelled) return;
			const lastDesiredSize = this.desiredSize;
			this.desiredSize -= size;
			if (lastDesiredSize > 0 && this.desiredSize <= 0) {
				this.sinkCapability = Promise.withResolvers();
				this.ready = this.sinkCapability.promise;
			}
			comObj.postMessage({
				sourceName,
				targetName,
				stream: StreamKind.ENQUEUE,
				streamId,
				chunk
			}, transfers);
		},
		close() {
			if (this.isCancelled) return;
			this.isCancelled = true;
			comObj.postMessage({
				sourceName,
				targetName,
				stream: StreamKind.CLOSE,
				streamId
			});
			delete self.streamSinks[streamId];
		},
		error(reason) {
			assert(reason instanceof Error, "error must have a valid reason");
			if (this.isCancelled) return;
			this.isCancelled = true;
			comObj.postMessage({
				sourceName,
				targetName,
				stream: StreamKind.ERROR,
				streamId,
				reason: wrapReason(reason)
			});
		},
		sinkCapability: Promise.withResolvers(),
		onPull: null,
		onCancel: null,
		isCancelled: false,
		desiredSize: data.desiredSize,
		ready: null
	};
	streamSink.sinkCapability.resolve();
	streamSink.ready = streamSink.sinkCapability.promise;
	this.streamSinks[streamId] = streamSink;
	Promise.try(action, data.data, streamSink).then(function() {
		comObj.postMessage({
			sourceName,
			targetName,
			stream: StreamKind.START_COMPLETE,
			streamId,
			success: true
		});
	}, function(reason) {
		comObj.postMessage({
			sourceName,
			targetName,
			stream: StreamKind.START_COMPLETE,
			streamId,
			reason: wrapReason(reason)
		});
	});
}
function _processStreamMessage(data) {
	const streamId = data.streamId, sourceName = this.sourceName, targetName = data.sourceName, comObj = this.comObj;
	const streamController = this.streamControllers[streamId], streamSink = this.streamSinks[streamId];
	switch (data.stream) {
		case StreamKind.START_COMPLETE:
			if (data.success) streamController.startCall.resolve();
			else streamController.startCall.reject(wrapReason(data.reason));
			break;
		case StreamKind.PULL_COMPLETE:
			if (data.success) streamController.pullCall.resolve();
			else streamController.pullCall.reject(wrapReason(data.reason));
			break;
		case StreamKind.PULL:
			if (!streamSink) {
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.PULL_COMPLETE,
					streamId,
					success: true
				});
				break;
			}
			if (streamSink.desiredSize <= 0 && data.desiredSize > 0) streamSink.sinkCapability.resolve();
			streamSink.desiredSize = data.desiredSize;
			Promise.try(streamSink.onPull || onFn).then(function() {
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.PULL_COMPLETE,
					streamId,
					success: true
				});
			}, function(reason) {
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.PULL_COMPLETE,
					streamId,
					reason: wrapReason(reason)
				});
			});
			break;
		case StreamKind.ENQUEUE:
			assert(streamController, "enqueue should have stream controller");
			if (streamController.isClosed) break;
			streamController.controller.enqueue(data.chunk);
			break;
		case StreamKind.CLOSE:
			assert(streamController, "close should have stream controller");
			if (streamController.isClosed) break;
			streamController.isClosed = true;
			streamController.controller.close();
			_assertClassBrand(_MessageHandler_brand, this, _deleteStreamController).call(this, streamController, streamId);
			break;
		case StreamKind.ERROR:
			assert(streamController, "error should have stream controller");
			streamController.controller.error(wrapReason(data.reason));
			_assertClassBrand(_MessageHandler_brand, this, _deleteStreamController).call(this, streamController, streamId);
			break;
		case StreamKind.CANCEL_COMPLETE:
			if (data.success) streamController.cancelCall.resolve();
			else streamController.cancelCall.reject(wrapReason(data.reason));
			_assertClassBrand(_MessageHandler_brand, this, _deleteStreamController).call(this, streamController, streamId);
			break;
		case StreamKind.CANCEL:
			if (!streamSink) break;
			const dataReason = wrapReason(data.reason);
			Promise.try(streamSink.onCancel || onFn, dataReason).then(function() {
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.CANCEL_COMPLETE,
					streamId,
					success: true
				});
			}, function(reason) {
				comObj.postMessage({
					sourceName,
					targetName,
					stream: StreamKind.CANCEL_COMPLETE,
					streamId,
					reason: wrapReason(reason)
				});
			});
			streamSink.sinkCapability.reject(dataReason);
			streamSink.isCancelled = true;
			delete this.streamSinks[streamId];
			break;
		default: throw new Error("Unexpected stream case");
	}
}
async function _deleteStreamController(streamController, streamId) {
	await Promise.allSettled([
		streamController.startCall?.promise,
		streamController.pullCall?.promise,
		streamController.cancelCall?.promise
	]);
	delete this.streamControllers[streamId];
}
var _errorStr = /* @__PURE__ */ new WeakMap();
var BaseBinaryDataFactory = class {
	constructor({ cMapUrl = null, standardFontDataUrl = null, wasmUrl = null }) {
		_classPrivateFieldInitSpec(this, _errorStr, Object.freeze({
			cMapUrl: "CMap",
			standardFontDataUrl: "font",
			wasmUrl: "wasm"
		}));
		this.cMapUrl = cMapUrl;
		this.standardFontDataUrl = standardFontDataUrl;
		this.wasmUrl = wasmUrl;
	}
	async fetch({ kind, filename }) {
		switch (kind) {
			case "cMapUrl":
			case "standardFontDataUrl":
			case "wasmUrl": break;
			default: unreachable(`Not implemented: ${kind}`);
		}
		const baseUrl = this[kind];
		if (!baseUrl) throw new Error(`Ensure that the \`${kind}\` API parameter is provided.`);
		const url = `${baseUrl}${filename}`;
		return this._fetch(url, kind).catch((reason) => {
			throw new Error(`Unable to load ${_classPrivateFieldGet2(_errorStr, this)[kind]} data at: ${url}`);
		});
	}
	async _fetch(url, kind) {
		unreachable("Abstract method `_fetch` called.");
	}
};
var DOMBinaryDataFactory = class extends BaseBinaryDataFactory {
	async _fetch(url, kind) {
		const data = await fetchData(url, kind === "cMapUrl" && !url.endsWith(".bcmap") ? "text" : "bytes");
		return data instanceof Uint8Array ? data : stringToBytes(data);
	}
};
var _enableHWA = /* @__PURE__ */ new WeakMap();
var BaseCanvasFactory = class {
	constructor({ enableHWA = false }) {
		_classPrivateFieldInitSpec(this, _enableHWA, false);
		_classPrivateFieldSet2(_enableHWA, this, enableHWA);
	}
	create(width, height) {
		if (width <= 0 || height <= 0) throw new Error("Invalid canvas size");
		const canvas = this._createCanvas(width, height);
		return {
			canvas,
			context: canvas.getContext("2d", { willReadFrequently: !_classPrivateFieldGet2(_enableHWA, this) })
		};
	}
	reset({ canvas }, width, height) {
		if (!canvas) throw new Error("Canvas is not specified");
		if (width <= 0 || height <= 0) throw new Error("Invalid canvas size");
		canvas.width = width;
		canvas.height = height;
	}
	destroy(canvasAndContext) {
		const { canvas } = canvasAndContext;
		if (!canvas) throw new Error("Canvas is not specified");
		canvas.width = canvas.height = 0;
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
	_createCanvas(width, height) {
		unreachable("Abstract method `_createCanvas` called.");
	}
};
var DOMCanvasFactory = class extends BaseCanvasFactory {
	constructor({ ownerDocument = globalThis.document, enableHWA = false }) {
		super({ enableHWA });
		this._document = ownerDocument;
	}
	_createCanvas(width, height) {
		const canvas = this._document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}
};
var BaseFilterFactory = class {
	addFilter(maps) {
		return "none";
	}
	addHCMFilter(fgColor, bgColor) {
		return "none";
	}
	addAlphaFilter(map) {
		return "none";
	}
	addLuminosityFilter(map) {
		return "none";
	}
	addHighlightHCMFilter(filterName, fgColor, bgColor, newFgColor, newBgColor) {
		return "none";
	}
	destroy(keepHCM = false) {}
};
var _baseUrl = /* @__PURE__ */ new WeakMap();
var _cache2 = /* @__PURE__ */ new WeakMap();
var _defs = /* @__PURE__ */ new WeakMap();
var _docId = /* @__PURE__ */ new WeakMap();
var _document = /* @__PURE__ */ new WeakMap();
var _hcmCache = /* @__PURE__ */ new WeakMap();
var _id3 = /* @__PURE__ */ new WeakMap();
var _DOMFilterFactory_brand = /* @__PURE__ */ new WeakSet();
var DOMFilterFactory = class extends BaseFilterFactory {
	constructor({ docId, ownerDocument = globalThis.document }) {
		super();
		_classPrivateMethodInitSpec(this, _DOMFilterFactory_brand);
		_classPrivateFieldInitSpec(this, _baseUrl, void 0);
		_classPrivateFieldInitSpec(this, _cache2, void 0);
		_classPrivateFieldInitSpec(this, _defs, void 0);
		_classPrivateFieldInitSpec(this, _docId, void 0);
		_classPrivateFieldInitSpec(this, _document, void 0);
		_classPrivateFieldInitSpec(this, _hcmCache, void 0);
		_classPrivateFieldInitSpec(this, _id3, 0);
		_classPrivateFieldSet2(_docId, this, docId);
		_classPrivateFieldSet2(_document, this, ownerDocument);
	}
	addFilter(maps) {
		var _this$id7, _this$id8;
		if (!maps) return "none";
		let value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(maps);
		if (value) return value;
		const [tableR, tableG, tableB] = _assertClassBrand(_DOMFilterFactory_brand, this, _createTables).call(this, maps);
		const key = maps.length === 1 ? tableR : `${tableR}${tableG}${tableB}`;
		value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(key);
		if (value) {
			_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(maps, value);
			return value;
		}
		const id = `g_${_classPrivateFieldGet2(_docId, this)}_transfer_map_${_classPrivateFieldSet2(_id3, this, (_this$id7 = _classPrivateFieldGet2(_id3, this), _this$id8 = _this$id7++, _this$id7)), _this$id8}`;
		const url = _assertClassBrand(_DOMFilterFactory_brand, this, _createUrl).call(this, id);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(maps, url);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(key, url);
		const filter = _assertClassBrand(_DOMFilterFactory_brand, this, _createFilter).call(this, id);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapConversion).call(this, tableR, tableG, tableB, filter);
		return url;
	}
	addHCMFilter(fgColor, bgColor) {
		const key = `${fgColor}-${bgColor}`;
		const filterName = "base";
		let info = _get_hcmCache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(filterName);
		if (info?.key === key) return info.url;
		if (info) {
			info.filter?.remove();
			info.key = key;
			info.url = "none";
			info.filter = null;
		} else {
			info = {
				key,
				url: "none",
				filter: null
			};
			_get_hcmCache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(filterName, info);
		}
		if (!fgColor || !bgColor) return info.url;
		const fgRGB = _assertClassBrand(_DOMFilterFactory_brand, this, _getRGB).call(this, fgColor);
		fgColor = Util.makeHexColor(...fgRGB);
		const bgRGB = _assertClassBrand(_DOMFilterFactory_brand, this, _getRGB).call(this, bgColor);
		bgColor = Util.makeHexColor(...bgRGB);
		_get_defs.call(_assertClassBrand(_DOMFilterFactory_brand, this)).style.color = "";
		if (fgColor === "#000000" && bgColor === "#ffffff" || fgColor === bgColor) return info.url;
		const map = new Array(256);
		for (let i = 0; i <= 255; i++) {
			const x = i / 255;
			map[i] = x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
		}
		const table = map.join(",");
		const id = `g_${_classPrivateFieldGet2(_docId, this)}_hcm_filter`;
		const filter = info.filter = _assertClassBrand(_DOMFilterFactory_brand, this, _createFilter).call(this, id);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapConversion).call(this, table, table, table, filter);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addGrayConversion).call(this, filter);
		const getSteps = (c, n) => {
			const start = fgRGB[c] / 255;
			const end = bgRGB[c] / 255;
			const arr = new Array(n + 1);
			for (let i = 0; i <= n; i++) arr[i] = start + i / n * (end - start);
			return arr.join(",");
		};
		_assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapConversion).call(this, getSteps(0, 5), getSteps(1, 5), getSteps(2, 5), filter);
		info.url = _assertClassBrand(_DOMFilterFactory_brand, this, _createUrl).call(this, id);
		return info.url;
	}
	addAlphaFilter(map) {
		var _this$id9, _this$id10;
		let value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(map);
		if (value) return value;
		const [tableA] = _assertClassBrand(_DOMFilterFactory_brand, this, _createTables).call(this, [map]);
		const key = `alpha_${tableA}`;
		value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(key);
		if (value) {
			_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(map, value);
			return value;
		}
		const id = `g_${_classPrivateFieldGet2(_docId, this)}_alpha_map_${_classPrivateFieldSet2(_id3, this, (_this$id9 = _classPrivateFieldGet2(_id3, this), _this$id10 = _this$id9++, _this$id9)), _this$id10}`;
		const url = _assertClassBrand(_DOMFilterFactory_brand, this, _createUrl).call(this, id);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(map, url);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(key, url);
		const filter = _assertClassBrand(_DOMFilterFactory_brand, this, _createFilter).call(this, id);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapAlphaConversion).call(this, tableA, filter);
		return url;
	}
	addLuminosityFilter(map) {
		var _this$id11, _this$id12;
		let value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(map || "luminosity");
		if (value) return value;
		let tableA, key;
		if (map) {
			[tableA] = _assertClassBrand(_DOMFilterFactory_brand, this, _createTables).call(this, [map]);
			key = `luminosity_${tableA}`;
		} else key = "luminosity";
		value = _get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(key);
		if (value) {
			_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(map, value);
			return value;
		}
		const id = `g_${_classPrivateFieldGet2(_docId, this)}_luminosity_map_${_classPrivateFieldSet2(_id3, this, (_this$id11 = _classPrivateFieldGet2(_id3, this), _this$id12 = _this$id11++, _this$id11)), _this$id12}`;
		const url = _assertClassBrand(_DOMFilterFactory_brand, this, _createUrl).call(this, id);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(map, url);
		_get_cache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(key, url);
		const filter = _assertClassBrand(_DOMFilterFactory_brand, this, _createFilter).call(this, id);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addLuminosityConversion).call(this, filter);
		if (map) _assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapAlphaConversion).call(this, tableA, filter);
		return url;
	}
	addHighlightHCMFilter(filterName, fgColor, bgColor, newFgColor, newBgColor) {
		const key = `${fgColor}-${bgColor}-${newFgColor}-${newBgColor}`;
		let info = _get_hcmCache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).get(filterName);
		if (info?.key === key) return info.url;
		if (info) {
			info.filter?.remove();
			info.key = key;
			info.url = "none";
			info.filter = null;
		} else {
			info = {
				key,
				url: "none",
				filter: null
			};
			_get_hcmCache.call(_assertClassBrand(_DOMFilterFactory_brand, this)).set(filterName, info);
		}
		if (!fgColor || !bgColor) return info.url;
		const [fgRGB, bgRGB] = [fgColor, bgColor].map(_assertClassBrand(_DOMFilterFactory_brand, this, _getRGB).bind(this));
		let fgGray = Math.round(.2126 * fgRGB[0] + .7152 * fgRGB[1] + .0722 * fgRGB[2]);
		let bgGray = Math.round(.2126 * bgRGB[0] + .7152 * bgRGB[1] + .0722 * bgRGB[2]);
		let [newFgRGB, newBgRGB] = [newFgColor, newBgColor].map(_assertClassBrand(_DOMFilterFactory_brand, this, _getRGB).bind(this));
		if (bgGray < fgGray) [fgGray, bgGray, newFgRGB, newBgRGB] = [
			bgGray,
			fgGray,
			newBgRGB,
			newFgRGB
		];
		_get_defs.call(_assertClassBrand(_DOMFilterFactory_brand, this)).style.color = "";
		const getSteps = (fg, bg, n) => {
			const arr = new Array(256);
			const step = (bgGray - fgGray) / n;
			const newStart = fg / 255;
			const newStep = (bg - fg) / (255 * n);
			let prev = 0;
			for (let i = 0; i <= n; i++) {
				const k = Math.round(fgGray + i * step);
				const value = newStart + i * newStep;
				for (let j = prev; j <= k; j++) arr[j] = value;
				prev = k + 1;
			}
			for (let i = prev; i < 256; i++) arr[i] = arr[prev - 1];
			return arr.join(",");
		};
		const id = `g_${_classPrivateFieldGet2(_docId, this)}_hcm_${filterName}_filter`;
		const filter = info.filter = _assertClassBrand(_DOMFilterFactory_brand, this, _createFilter).call(this, id);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addGrayConversion).call(this, filter);
		_assertClassBrand(_DOMFilterFactory_brand, this, _addTransferMapConversion).call(this, getSteps(newFgRGB[0], newBgRGB[0], 5), getSteps(newFgRGB[1], newBgRGB[1], 5), getSteps(newFgRGB[2], newBgRGB[2], 5), filter);
		info.url = _assertClassBrand(_DOMFilterFactory_brand, this, _createUrl).call(this, id);
		return info.url;
	}
	destroy(keepHCM = false) {
		if (keepHCM && _classPrivateFieldGet2(_hcmCache, this)?.size) return;
		_classPrivateFieldGet2(_defs, this)?.parentNode.parentNode.remove();
		_classPrivateFieldSet2(_defs, this, null);
		_classPrivateFieldGet2(_cache2, this)?.clear();
		_classPrivateFieldSet2(_cache2, this, null);
		_classPrivateFieldGet2(_hcmCache, this)?.clear();
		_classPrivateFieldSet2(_hcmCache, this, null);
		_classPrivateFieldSet2(_id3, this, 0);
	}
};
function _get_cache() {
	return _classPrivateFieldGet2(_cache2, this) || _classPrivateFieldSet2(_cache2, this, /* @__PURE__ */ new Map());
}
function _get_hcmCache() {
	return _classPrivateFieldGet2(_hcmCache, this) || _classPrivateFieldSet2(_hcmCache, this, /* @__PURE__ */ new Map());
}
function _get_defs() {
	if (!_classPrivateFieldGet2(_defs, this)) {
		const div = _classPrivateFieldGet2(_document, this).createElement("div");
		const { style } = div;
		style.visibility = "hidden";
		style.contain = "strict";
		style.width = style.height = 0;
		style.position = "absolute";
		style.top = style.left = 0;
		style.zIndex = -1;
		const svg = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "svg");
		svg.setAttribute("width", 0);
		svg.setAttribute("height", 0);
		_classPrivateFieldSet2(_defs, this, _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "defs"));
		div.append(svg);
		svg.append(_classPrivateFieldGet2(_defs, this));
		_classPrivateFieldGet2(_document, this).body.append(div);
	}
	return _classPrivateFieldGet2(_defs, this);
}
function _createTables(maps) {
	if (maps.length === 1) {
		const mapR = maps[0];
		const buffer = new Array(256);
		for (let i = 0; i < 256; i++) buffer[i] = mapR[i] / 255;
		const table = buffer.join(",");
		return [
			table,
			table,
			table
		];
	}
	const [mapR, mapG, mapB] = maps;
	const bufferR = new Array(256);
	const bufferG = new Array(256);
	const bufferB = new Array(256);
	for (let i = 0; i < 256; i++) {
		bufferR[i] = mapR[i] / 255;
		bufferG[i] = mapG[i] / 255;
		bufferB[i] = mapB[i] / 255;
	}
	return [
		bufferR.join(","),
		bufferG.join(","),
		bufferB.join(",")
	];
}
function _createUrl(id) {
	if (_classPrivateFieldGet2(_baseUrl, this) === void 0) {
		_classPrivateFieldSet2(_baseUrl, this, "");
		const url = _classPrivateFieldGet2(_document, this).URL;
		if (url !== _classPrivateFieldGet2(_document, this).baseURI) if (isDataScheme(url)) warn("#createUrl: ignore \"data:\"-URL for performance reasons.");
		else _classPrivateFieldSet2(_baseUrl, this, updateUrlHash(url, ""));
	}
	return `url(${_classPrivateFieldGet2(_baseUrl, this)}#${id})`;
}
function _addLuminosityConversion(filter) {
	const feColorMatrix = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "feColorMatrix");
	feColorMatrix.setAttribute("type", "matrix");
	feColorMatrix.setAttribute("values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0.59 0.11 0 0");
	filter.append(feColorMatrix);
}
function _addGrayConversion(filter) {
	const feColorMatrix = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "feColorMatrix");
	feColorMatrix.setAttribute("type", "matrix");
	feColorMatrix.setAttribute("values", "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0");
	filter.append(feColorMatrix);
}
function _createFilter(id) {
	const filter = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "filter");
	filter.setAttribute("color-interpolation-filters", "sRGB");
	filter.setAttribute("id", id);
	_get_defs.call(_assertClassBrand(_DOMFilterFactory_brand, this)).append(filter);
	return filter;
}
function _appendFeFunc(feComponentTransfer, func, table) {
	const feFunc = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, func);
	feFunc.setAttribute("type", "discrete");
	feFunc.setAttribute("tableValues", table);
	feComponentTransfer.append(feFunc);
}
function _addTransferMapConversion(rTable, gTable, bTable, filter) {
	const feComponentTransfer = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "feComponentTransfer");
	filter.append(feComponentTransfer);
	_assertClassBrand(_DOMFilterFactory_brand, this, _appendFeFunc).call(this, feComponentTransfer, "feFuncR", rTable);
	_assertClassBrand(_DOMFilterFactory_brand, this, _appendFeFunc).call(this, feComponentTransfer, "feFuncG", gTable);
	_assertClassBrand(_DOMFilterFactory_brand, this, _appendFeFunc).call(this, feComponentTransfer, "feFuncB", bTable);
}
function _addTransferMapAlphaConversion(aTable, filter) {
	const feComponentTransfer = _classPrivateFieldGet2(_document, this).createElementNS(SVG_NS, "feComponentTransfer");
	filter.append(feComponentTransfer);
	_assertClassBrand(_DOMFilterFactory_brand, this, _appendFeFunc).call(this, feComponentTransfer, "feFuncA", aTable);
}
function _getRGB(color) {
	_get_defs.call(_assertClassBrand(_DOMFilterFactory_brand, this)).style.color = color;
	return getRGB(getComputedStyle(_get_defs.call(_assertClassBrand(_DOMFilterFactory_brand, this))).getPropertyValue("color"));
}
if (isNodeJS) warn("Please use the `legacy` build in Node.js environments.");
async function node_utils_fetchData(url) {
	const data = await process.getBuiltinModule("fs").promises.readFile(url);
	return new Uint8Array(data);
}
var NodeFilterFactory = class extends BaseFilterFactory {};
var NodeCanvasFactory = class extends BaseCanvasFactory {
	_createCanvas(width, height) {
		return process.getBuiltinModule("module").createRequire(import.meta.url)("@napi-rs/canvas").createCanvas(width, height);
	}
};
var NodeBinaryDataFactory = class extends BaseBinaryDataFactory {
	async _fetch(url, kind) {
		return node_utils_fetchData(url);
	}
};
var WGSL = `
struct Uniforms {
  offsetX      : f32,
  offsetY      : f32,
  scaleX       : f32,
  scaleY       : f32,
  paddedWidth  : f32,
  paddedHeight : f32,
  borderSize   : f32,
  _pad         : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;

struct VertexInput {
  @location(0) position : vec2<f32>,
  @location(1) color    : vec4<f32>,
};

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0)       color    : vec3<f32>,
};

@vertex
fn vs_main(in : VertexInput) -> VertexOutput {
  var out : VertexOutput;
  let cx = (in.position.x + u.offsetX) * u.scaleX;
  let cy = (in.position.y + u.offsetY) * u.scaleY;
  out.position = vec4<f32>(
    ((cx + u.borderSize) / u.paddedWidth) * 2.0 - 1.0,
    1.0 - ((cy + u.borderSize) / u.paddedHeight) * 2.0,
    0.0,
    1.0
  );
  out.color = in.color.rgb;
  return out;
}

@fragment
fn fs_main(in : VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.color, 1.0);
}
`;
var _initPromise = /* @__PURE__ */ new WeakMap();
var _device = /* @__PURE__ */ new WeakMap();
var _pipeline = /* @__PURE__ */ new WeakMap();
var _preferredFormat = /* @__PURE__ */ new WeakMap();
var _WebGPUMesh_brand = /* @__PURE__ */ new WeakSet();
var WebGPUMesh = class {
	constructor() {
		_classPrivateMethodInitSpec(this, _WebGPUMesh_brand);
		_classPrivateFieldInitSpec(this, _initPromise, null);
		_classPrivateFieldInitSpec(this, _device, null);
		_classPrivateFieldInitSpec(this, _pipeline, null);
		_classPrivateFieldInitSpec(this, _preferredFormat, null);
	}
	init() {
		if (_classPrivateFieldGet2(_initPromise, this) === null) _classPrivateFieldSet2(_initPromise, this, _assertClassBrand(_WebGPUMesh_brand, this, _initGPU).call(this));
	}
	get isReady() {
		return _classPrivateFieldGet2(_device, this) !== null;
	}
	draw(figures, context, backgroundColor, paddedWidth, paddedHeight, borderSize) {
		const device = _classPrivateFieldGet2(_device, this);
		const { offsetX, offsetY, scaleX, scaleY } = context;
		const { posData, colData, vertexCount } = _assertClassBrand(_WebGPUMesh_brand, this, _buildVertexStreams).call(this, figures, context);
		const posBuffer = device.createBuffer({
			size: Math.max(posData.byteLength, 4),
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});
		if (posData.byteLength > 0) device.queue.writeBuffer(posBuffer, 0, posData);
		const colBuffer = device.createBuffer({
			size: Math.max(colData.byteLength, 4),
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
		});
		if (colData.byteLength > 0) device.queue.writeBuffer(colBuffer, 0, colData);
		const uniformBuffer = device.createBuffer({
			size: 32,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([
			offsetX,
			offsetY,
			scaleX,
			scaleY,
			paddedWidth,
			paddedHeight,
			borderSize,
			0
		]));
		const bindGroup = device.createBindGroup({
			layout: _classPrivateFieldGet2(_pipeline, this).getBindGroupLayout(0),
			entries: [{
				binding: 0,
				resource: { buffer: uniformBuffer }
			}]
		});
		const offscreen = new OffscreenCanvas(paddedWidth, paddedHeight);
		const gpuCtx = offscreen.getContext("webgpu");
		gpuCtx.configure({
			device,
			format: _classPrivateFieldGet2(_preferredFormat, this),
			alphaMode: backgroundColor ? "opaque" : "premultiplied"
		});
		const clearValue = backgroundColor ? {
			r: backgroundColor[0] / 255,
			g: backgroundColor[1] / 255,
			b: backgroundColor[2] / 255,
			a: 1
		} : {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		};
		const commandEncoder = device.createCommandEncoder();
		const renderPass = commandEncoder.beginRenderPass({ colorAttachments: [{
			view: gpuCtx.getCurrentTexture().createView(),
			clearValue,
			loadOp: "clear",
			storeOp: "store"
		}] });
		if (vertexCount > 0) {
			renderPass.setPipeline(_classPrivateFieldGet2(_pipeline, this));
			renderPass.setBindGroup(0, bindGroup);
			renderPass.setVertexBuffer(0, posBuffer);
			renderPass.setVertexBuffer(1, colBuffer);
			renderPass.draw(vertexCount);
		}
		renderPass.end();
		device.queue.submit([commandEncoder.finish()]);
		posBuffer.destroy();
		colBuffer.destroy();
		uniformBuffer.destroy();
		return offscreen.transferToImageBitmap();
	}
};
async function _initGPU() {
	if (!globalThis.navigator?.gpu) return false;
	try {
		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) return false;
		_classPrivateFieldSet2(_preferredFormat, this, navigator.gpu.getPreferredCanvasFormat());
		const device = _classPrivateFieldSet2(_device, this, await adapter.requestDevice());
		const shaderModule = device.createShaderModule({ code: WGSL });
		_classPrivateFieldSet2(_pipeline, this, device.createRenderPipeline({
			layout: "auto",
			vertex: {
				module: shaderModule,
				entryPoint: "vs_main",
				buffers: [{
					arrayStride: 8,
					attributes: [{
						shaderLocation: 0,
						offset: 0,
						format: "float32x2"
					}]
				}, {
					arrayStride: 4,
					attributes: [{
						shaderLocation: 1,
						offset: 0,
						format: "unorm8x4"
					}]
				}]
			},
			fragment: {
				module: shaderModule,
				entryPoint: "fs_main",
				targets: [{ format: _classPrivateFieldGet2(_preferredFormat, this) }]
			},
			primitive: { topology: "triangle-list" }
		}));
		return true;
	} catch {
		return false;
	}
}
function _buildVertexStreams(figures, context) {
	const { coords, colors } = context;
	let vertexCount = 0;
	for (const figure of figures) {
		const ps = figure.coords;
		if (figure.type === MeshFigureType.TRIANGLES) vertexCount += ps.length;
		else if (figure.type === MeshFigureType.LATTICE) {
			const vpr = figure.verticesPerRow;
			vertexCount += (Math.floor(ps.length / vpr) - 1) * (vpr - 1) * 6;
		}
	}
	const posData = new Float32Array(vertexCount * 2);
	const colData = new Uint8Array(vertexCount * 4);
	let pOff = 0, cOff = 0;
	const addVertex = (pi, ci) => {
		posData[pOff++] = coords[pi * 2];
		posData[pOff++] = coords[pi * 2 + 1];
		colData[cOff++] = colors[ci * 4];
		colData[cOff++] = colors[ci * 4 + 1];
		colData[cOff++] = colors[ci * 4 + 2];
		cOff++;
	};
	for (const figure of figures) {
		const ps = figure.coords;
		const cs = figure.colors;
		if (figure.type === MeshFigureType.TRIANGLES) for (let i = 0, ii = ps.length; i < ii; i += 3) {
			addVertex(ps[i], cs[i]);
			addVertex(ps[i + 1], cs[i + 1]);
			addVertex(ps[i + 2], cs[i + 2]);
		}
		else if (figure.type === MeshFigureType.LATTICE) {
			const vpr = figure.verticesPerRow;
			const rows = Math.floor(ps.length / vpr) - 1;
			const cols = vpr - 1;
			for (let i = 0; i < rows; i++) {
				let q = i * vpr;
				for (let j = 0; j < cols; j++, q++) {
					addVertex(ps[q], cs[q]);
					addVertex(ps[q + 1], cs[q + 1]);
					addVertex(ps[q + vpr], cs[q + vpr]);
					addVertex(ps[q + vpr + 1], cs[q + vpr + 1]);
					addVertex(ps[q + 1], cs[q + 1]);
					addVertex(ps[q + vpr], cs[q + vpr]);
				}
			}
		}
	}
	return {
		posData,
		colData,
		vertexCount
	};
}
var _webGPUMesh = new WebGPUMesh();
function initWebGPUMesh() {
	_webGPUMesh.init();
}
function isWebGPUMeshReady() {
	return _webGPUMesh.isReady;
}
function drawMeshWithGPU(figures, context, backgroundColor, paddedWidth, paddedHeight, borderSize) {
	return _webGPUMesh.draw(figures, context, backgroundColor, paddedWidth, paddedHeight, borderSize);
}
var PathType = {
	FILL: "Fill",
	STROKE: "Stroke",
	SHADING: "Shading"
};
function applyBoundingBox(ctx, bbox) {
	if (!bbox) return;
	const width = bbox[2] - bbox[0];
	const height = bbox[3] - bbox[1];
	const region = new Path2D();
	region.rect(bbox[0], bbox[1], width, height);
	ctx.clip(region);
}
var BaseShadingPattern = class {
	isModifyingCurrentTransform() {
		return false;
	}
	getPattern() {
		unreachable("Abstract method `getPattern` called.");
	}
};
var RadialAxialShadingPattern = class extends BaseShadingPattern {
	constructor(IR) {
		super();
		this._type = IR[1];
		this._bbox = IR[2];
		this._colorStops = IR[3];
		this._p0 = IR[4];
		this._p1 = IR[5];
		this._r0 = IR[6];
		this._r1 = IR[7];
		this.matrix = null;
	}
	isOriginBased() {
		return this._p0[0] === 0 && this._p0[1] === 0 && (!this.isRadial() || this._p1[0] === 0 && this._p1[1] === 0);
	}
	isRadial() {
		return this._type === "radial";
	}
	_isCircleCenterOutside() {
		if (!this.isRadial() || this._r0 > this._r1) return false;
		return Math.hypot(this._p0[0] - this._p1[0], this._p0[1] - this._p1[1]) > this._r1;
	}
	_createGradient(ctx, transform = null) {
		let grad;
		let firstPoint = this._p0;
		let secondPoint = this._p1;
		if (transform) {
			firstPoint = firstPoint.slice();
			secondPoint = secondPoint.slice();
			Util.applyTransform(firstPoint, transform);
			Util.applyTransform(secondPoint, transform);
		}
		if (this._type === "axial") grad = ctx.createLinearGradient(firstPoint[0], firstPoint[1], secondPoint[0], secondPoint[1]);
		else if (this._type === "radial") {
			let r0 = this._r0;
			let r1 = this._r1;
			if (transform) {
				const scale = /* @__PURE__ */ new Float32Array(2);
				Util.singularValueDecompose2dScale(transform, scale);
				r0 *= scale[0];
				r1 *= scale[0];
			}
			grad = ctx.createRadialGradient(firstPoint[0], firstPoint[1], r0, secondPoint[0], secondPoint[1], r1);
		}
		for (const colorStop of this._colorStops) grad.addColorStop(colorStop[0], colorStop[1]);
		return grad;
	}
	_createReversedGradient(ctx, transform = null) {
		let firstPoint = this._p1;
		let secondPoint = this._p0;
		if (transform) {
			firstPoint = firstPoint.slice();
			secondPoint = secondPoint.slice();
			Util.applyTransform(firstPoint, transform);
			Util.applyTransform(secondPoint, transform);
		}
		let r0 = this._r1;
		let r1 = this._r0;
		if (transform) {
			const scale = /* @__PURE__ */ new Float32Array(2);
			Util.singularValueDecompose2dScale(transform, scale);
			r0 *= scale[0];
			r1 *= scale[0];
		}
		const grad = ctx.createRadialGradient(firstPoint[0], firstPoint[1], r0, secondPoint[0], secondPoint[1], r1);
		const reversedStops = this._colorStops.map(([t, c]) => [1 - t, c]).reverse();
		for (const [t, c] of reversedStops) grad.addColorStop(t, c);
		return grad;
	}
	getPattern(ctx, owner, inverse, pathType) {
		let pattern;
		if (pathType === PathType.STROKE || pathType === PathType.FILL) {
			if (this.isOriginBased()) {
				let transf = Util.transform(inverse, owner.baseTransform);
				if (this.matrix) transf = Util.transform(transf, this.matrix);
				const precision = .001;
				const n1 = Math.hypot(transf[0], transf[1]);
				const n2 = Math.hypot(transf[2], transf[3]);
				const ps = (transf[0] * transf[2] + transf[1] * transf[3]) / (n1 * n2);
				if (Math.abs(ps) < precision) if (this.isRadial()) {
					if (Math.abs(n1 - n2) < precision) return this._createGradient(ctx, transf);
				} else return this._createGradient(ctx, transf);
			}
			const ownerBBox = owner.current.getClippedPathBoundingBox(pathType, getCurrentTransform(ctx)) || [
				0,
				0,
				0,
				0
			];
			const width = Math.ceil(ownerBBox[2] - ownerBBox[0]) || 1;
			const height = Math.ceil(ownerBBox[3] - ownerBBox[1]) || 1;
			const tmpCanvas = owner.canvasFactory.create(width, height);
			const tmpCtx = tmpCanvas.context;
			tmpCtx.clearRect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
			tmpCtx.beginPath();
			tmpCtx.rect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
			tmpCtx.translate(-ownerBBox[0], -ownerBBox[1]);
			inverse = Util.transform(inverse, [
				1,
				0,
				0,
				1,
				ownerBBox[0],
				ownerBBox[1]
			]);
			tmpCtx.transform(...owner.baseTransform);
			if (this.matrix) tmpCtx.transform(...this.matrix);
			applyBoundingBox(tmpCtx, this._bbox);
			if (this._isCircleCenterOutside()) {
				tmpCtx.fillStyle = this._createReversedGradient(tmpCtx);
				tmpCtx.fill();
			}
			tmpCtx.fillStyle = this._createGradient(tmpCtx);
			tmpCtx.fill();
			pattern = ctx.createPattern(tmpCanvas.canvas, "no-repeat");
			owner.canvasFactory.destroy(tmpCanvas);
			const domMatrix = new DOMMatrix(inverse);
			pattern.setTransform(domMatrix);
		} else {
			if (this._isCircleCenterOutside()) {
				ctx.save();
				applyBoundingBox(ctx, this._bbox);
				ctx.fillStyle = this._createReversedGradient(ctx);
				ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
				ctx.restore();
			}
			applyBoundingBox(ctx, this._bbox);
			pattern = this._createGradient(ctx);
		}
		return pattern;
	}
};
function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
	const coords = context.coords, colors = context.colors;
	const bytes = data.data, rowSize = data.width * 4;
	let tmp;
	if (coords[p1 * 2 + 1] > coords[p2 * 2 + 1]) {
		tmp = p1;
		p1 = p2;
		p2 = tmp;
		tmp = c1;
		c1 = c2;
		c2 = tmp;
	}
	if (coords[p2 * 2 + 1] > coords[p3 * 2 + 1]) {
		tmp = p2;
		p2 = p3;
		p3 = tmp;
		tmp = c2;
		c2 = c3;
		c3 = tmp;
	}
	if (coords[p1 * 2 + 1] > coords[p2 * 2 + 1]) {
		tmp = p1;
		p1 = p2;
		p2 = tmp;
		tmp = c1;
		c1 = c2;
		c2 = tmp;
	}
	const x1 = (coords[p1 * 2] + context.offsetX) * context.scaleX;
	const y1 = (coords[p1 * 2 + 1] + context.offsetY) * context.scaleY;
	const x2 = (coords[p2 * 2] + context.offsetX) * context.scaleX;
	const y2 = (coords[p2 * 2 + 1] + context.offsetY) * context.scaleY;
	const x3 = (coords[p3 * 2] + context.offsetX) * context.scaleX;
	const y3 = (coords[p3 * 2 + 1] + context.offsetY) * context.scaleY;
	if (y1 >= y3) return;
	const c1r = colors[c1 * 4], c1g = colors[c1 * 4 + 1], c1b = colors[c1 * 4 + 2];
	const c2r = colors[c2 * 4], c2g = colors[c2 * 4 + 1], c2b = colors[c2 * 4 + 2];
	const c3r = colors[c3 * 4], c3g = colors[c3 * 4 + 1], c3b = colors[c3 * 4 + 2];
	const minY = Math.round(y1), maxY = Math.round(y3);
	let xa, car, cag, cab;
	let xb, cbr, cbg, cbb;
	for (let y = minY; y <= maxY; y++) {
		if (y < y2) {
			const k = y < y1 ? 0 : (y1 - y) / (y1 - y2);
			xa = x1 - (x1 - x2) * k;
			car = c1r - (c1r - c2r) * k;
			cag = c1g - (c1g - c2g) * k;
			cab = c1b - (c1b - c2b) * k;
		} else {
			let k;
			if (y > y3) k = 1;
			else if (y2 === y3) k = 0;
			else k = (y2 - y) / (y2 - y3);
			xa = x2 - (x2 - x3) * k;
			car = c2r - (c2r - c3r) * k;
			cag = c2g - (c2g - c3g) * k;
			cab = c2b - (c2b - c3b) * k;
		}
		let k;
		if (y < y1) k = 0;
		else if (y > y3) k = 1;
		else k = (y1 - y) / (y1 - y3);
		xb = x1 - (x1 - x3) * k;
		cbr = c1r - (c1r - c3r) * k;
		cbg = c1g - (c1g - c3g) * k;
		cbb = c1b - (c1b - c3b) * k;
		const x1_ = Math.round(Math.min(xa, xb));
		const x2_ = Math.round(Math.max(xa, xb));
		let j = rowSize * y + x1_ * 4;
		for (let x = x1_; x <= x2_; x++) {
			k = (xa - x) / (xa - xb);
			if (k < 0) k = 0;
			else if (k > 1) k = 1;
			bytes[j++] = car - (car - cbr) * k | 0;
			bytes[j++] = cag - (cag - cbg) * k | 0;
			bytes[j++] = cab - (cab - cbb) * k | 0;
			bytes[j++] = 255;
		}
	}
}
function drawFigure(data, figure, context) {
	const ps = figure.coords;
	const cs = figure.colors;
	let i, ii;
	switch (figure.type) {
		case MeshFigureType.LATTICE:
			const verticesPerRow = figure.verticesPerRow;
			const rows = Math.floor(ps.length / verticesPerRow) - 1;
			const cols = verticesPerRow - 1;
			for (i = 0; i < rows; i++) {
				let q = i * verticesPerRow;
				for (let j = 0; j < cols; j++, q++) {
					drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
					drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
				}
			}
			break;
		case MeshFigureType.TRIANGLES:
			for (i = 0, ii = ps.length; i < ii; i += 3) drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
			break;
		default: throw new Error("illegal figure");
	}
}
var MeshShadingPattern = class extends BaseShadingPattern {
	constructor(IR) {
		super();
		this._coords = IR[2];
		this._colors = IR[3];
		this._figures = IR[4];
		this._bounds = IR[5];
		this._bbox = IR[6];
		this._background = IR[7];
		this.matrix = null;
	}
	_createMeshCanvas(combinedScale, backgroundColor, canvasFactory) {
		const EXPECTED_SCALE = 1.1;
		const MAX_PATTERN_SIZE = 3e3;
		const BORDER_SIZE = 2;
		const offsetX = Math.floor(this._bounds[0]);
		const offsetY = Math.floor(this._bounds[1]);
		const boundsWidth = Math.ceil(this._bounds[2]) - offsetX;
		const boundsHeight = Math.ceil(this._bounds[3]) - offsetY;
		const width = Math.min(Math.ceil(Math.abs(boundsWidth * combinedScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE) || 1;
		const height = Math.min(Math.ceil(Math.abs(boundsHeight * combinedScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE) || 1;
		const scaleX = boundsWidth ? boundsWidth / width : 1;
		const scaleY = boundsHeight ? boundsHeight / height : 1;
		const context = {
			coords: this._coords,
			colors: this._colors,
			offsetX: -offsetX,
			offsetY: -offsetY,
			scaleX: 1 / scaleX,
			scaleY: 1 / scaleY
		};
		const paddedWidth = width + BORDER_SIZE * 2;
		const paddedHeight = height + BORDER_SIZE * 2;
		const tmpCanvas = canvasFactory.create(paddedWidth, paddedHeight);
		if (isWebGPUMeshReady()) tmpCanvas.context.drawImage(drawMeshWithGPU(this._figures, context, backgroundColor, paddedWidth, paddedHeight, BORDER_SIZE), 0, 0);
		else {
			const data = tmpCanvas.context.createImageData(width, height);
			if (backgroundColor) {
				const bytes = data.data;
				for (let i = 0, ii = bytes.length; i < ii; i += 4) {
					bytes[i] = backgroundColor[0];
					bytes[i + 1] = backgroundColor[1];
					bytes[i + 2] = backgroundColor[2];
					bytes[i + 3] = 255;
				}
			}
			for (const figure of this._figures) drawFigure(data, figure, context);
			tmpCanvas.context.putImageData(data, BORDER_SIZE, BORDER_SIZE);
		}
		return {
			canvas: tmpCanvas.canvas,
			offsetX: offsetX - BORDER_SIZE * scaleX,
			offsetY: offsetY - BORDER_SIZE * scaleY,
			scaleX,
			scaleY
		};
	}
	isModifyingCurrentTransform() {
		return true;
	}
	getPattern(ctx, owner, inverse, pathType) {
		applyBoundingBox(ctx, this._bbox);
		const scale = /* @__PURE__ */ new Float32Array(2);
		if (pathType === PathType.SHADING) Util.singularValueDecompose2dScale(getCurrentTransform(ctx), scale);
		else if (this.matrix) {
			Util.singularValueDecompose2dScale(this.matrix, scale);
			const [matrixScaleX, matrixScaleY] = scale;
			Util.singularValueDecompose2dScale(owner.baseTransform, scale);
			scale[0] *= matrixScaleX;
			scale[1] *= matrixScaleY;
		} else Util.singularValueDecompose2dScale(owner.baseTransform, scale);
		const temporaryPatternCanvas = this._createMeshCanvas(scale, pathType === PathType.SHADING ? null : this._background, owner.canvasFactory);
		if (pathType !== PathType.SHADING) {
			ctx.setTransform(...owner.baseTransform);
			if (this.matrix) ctx.transform(...this.matrix);
		}
		ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
		ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
		const pattern = ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
		owner.canvasFactory.destroy(temporaryPatternCanvas);
		return pattern;
	}
};
var DummyShadingPattern = class extends BaseShadingPattern {
	getPattern() {
		return "hotpink";
	}
};
function getShadingPattern(IR) {
	switch (IR[0]) {
		case "RadialAxial": return new RadialAxialShadingPattern(IR);
		case "Mesh": return new MeshShadingPattern(IR);
		case "Dummy": return new DummyShadingPattern();
	}
	throw new Error(`Unknown IR type: ${IR[0]}`);
}
var PaintType = {
	COLORED: 1,
	UNCOLORED: 2
};
var TilingPattern = class TilingPattern {
	constructor(IR, ctx, canvasGraphicsFactory, baseTransform) {
		this.color = IR[1];
		this.operatorList = IR[2];
		this.matrix = IR[3];
		this.bbox = IR[4];
		this.xstep = IR[5];
		this.ystep = IR[6];
		this.paintType = IR[7];
		this.tilingType = IR[8];
		this.ctx = ctx;
		this.canvasGraphicsFactory = canvasGraphicsFactory;
		this.baseTransform = baseTransform;
	}
	createPatternCanvas(owner, opIdx) {
		const { bbox, operatorList, paintType, tilingType, color, canvasGraphicsFactory } = this;
		let { xstep, ystep } = this;
		xstep = Math.abs(xstep);
		ystep = Math.abs(ystep);
		info("TilingType: " + tilingType);
		const x0 = bbox[0], y0 = bbox[1], x1 = bbox[2], y1 = bbox[3];
		const width = x1 - x0;
		const height = y1 - y0;
		const scale = /* @__PURE__ */ new Float32Array(2);
		Util.singularValueDecompose2dScale(this.matrix, scale);
		const [matrixScaleX, matrixScaleY] = scale;
		Util.singularValueDecompose2dScale(this.baseTransform, scale);
		const combinedScaleX = matrixScaleX * scale[0];
		const combinedScaleY = matrixScaleY * scale[1];
		let canvasWidth = width, canvasHeight = height, redrawHorizontally = false, redrawVertically = false;
		const xScaledStep = Math.ceil(xstep * combinedScaleX);
		const yScaledStep = Math.ceil(ystep * combinedScaleY);
		const xScaledWidth = Math.ceil(width * combinedScaleX);
		const yScaledHeight = Math.ceil(height * combinedScaleY);
		if (xScaledStep >= xScaledWidth) canvasWidth = xstep;
		else redrawHorizontally = true;
		if (yScaledStep >= yScaledHeight) canvasHeight = ystep;
		else redrawVertically = true;
		const dimx = this.getSizeAndScale(canvasWidth, this.ctx.canvas.width, combinedScaleX);
		const dimy = this.getSizeAndScale(canvasHeight, this.ctx.canvas.height, combinedScaleY);
		const tmpCanvas = owner.canvasFactory.create(dimx.size, dimy.size);
		const tmpCtx = tmpCanvas.context;
		const graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx, opIdx);
		graphics.groupLevel = owner.groupLevel;
		this.setFillAndStrokeStyleToContext(graphics, paintType, color);
		tmpCtx.translate(-dimx.scale * x0, -dimy.scale * y0);
		graphics.transform(0, dimx.scale, 0, 0, dimy.scale, 0, 0);
		tmpCtx.save();
		graphics.dependencyTracker?.save();
		this.clipBbox(graphics, x0, y0, x1, y1);
		graphics.baseTransform = getCurrentTransform(graphics.ctx);
		graphics.executeOperatorList(operatorList);
		graphics.endDrawing();
		graphics.dependencyTracker?.restore();
		tmpCtx.restore();
		if (redrawHorizontally || redrawVertically) {
			const image = tmpCanvas.canvas;
			if (redrawHorizontally) canvasWidth = xstep;
			if (redrawVertically) canvasHeight = ystep;
			const dimx2 = this.getSizeAndScale(canvasWidth, this.ctx.canvas.width, combinedScaleX);
			const dimy2 = this.getSizeAndScale(canvasHeight, this.ctx.canvas.height, combinedScaleY);
			const xSize = dimx2.size;
			const ySize = dimy2.size;
			const tmpCanvas2 = owner.canvasFactory.create(xSize, ySize);
			const tmpCtx2 = tmpCanvas2.context;
			const ii = redrawHorizontally ? Math.floor(width / xstep) : 0;
			const jj = redrawVertically ? Math.floor(height / ystep) : 0;
			for (let i = 0; i <= ii; i++) for (let j = 0; j <= jj; j++) tmpCtx2.drawImage(image, xSize * i, ySize * j, xSize, ySize, 0, 0, xSize, ySize);
			owner.canvasFactory.destroy(tmpCanvas);
			return {
				canvas: tmpCanvas2.canvas,
				canvasEntry: tmpCanvas2,
				scaleX: dimx2.scale,
				scaleY: dimy2.scale,
				offsetX: x0,
				offsetY: y0
			};
		}
		return {
			canvas: tmpCanvas.canvas,
			canvasEntry: tmpCanvas,
			scaleX: dimx.scale,
			scaleY: dimy.scale,
			offsetX: x0,
			offsetY: y0
		};
	}
	getSizeAndScale(step, realOutputSize, scale) {
		const maxSize = Math.max(TilingPattern.MAX_PATTERN_SIZE, realOutputSize);
		let size = Math.ceil(step * scale);
		if (size >= maxSize) size = maxSize;
		else scale = size / step;
		return {
			scale,
			size
		};
	}
	clipBbox(graphics, x0, y0, x1, y1) {
		const bboxWidth = x1 - x0;
		const bboxHeight = y1 - y0;
		graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
		Util.axialAlignedBoundingBox([
			x0,
			y0,
			x1,
			y1
		], getCurrentTransform(graphics.ctx), graphics.current.minMax);
		graphics.clip();
		graphics.endPath();
	}
	setFillAndStrokeStyleToContext(graphics, paintType, color) {
		const context = graphics.ctx, current = graphics.current;
		switch (paintType) {
			case PaintType.COLORED:
				const { fillStyle, strokeStyle } = this.ctx;
				context.fillStyle = current.fillColor = fillStyle;
				context.strokeStyle = current.strokeColor = strokeStyle;
				break;
			case PaintType.UNCOLORED:
				context.fillStyle = context.strokeStyle = color;
				current.fillColor = current.strokeColor = color;
				break;
			default: throw new FormatError(`Unsupported paint type: ${paintType}`);
		}
	}
	isModifyingCurrentTransform() {
		return false;
	}
	getPattern(ctx, owner, inverse, pathType, opIdx) {
		let matrix = inverse;
		if (pathType !== PathType.SHADING) {
			matrix = Util.transform(matrix, owner.baseTransform);
			if (this.matrix) matrix = Util.transform(matrix, this.matrix);
		}
		const temporaryPatternCanvas = this.createPatternCanvas(owner, opIdx);
		let domMatrix = new DOMMatrix(matrix);
		domMatrix = domMatrix.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
		domMatrix = domMatrix.scale(1 / temporaryPatternCanvas.scaleX, 1 / temporaryPatternCanvas.scaleY);
		const pattern = ctx.createPattern(temporaryPatternCanvas.canvas, "repeat");
		owner.canvasFactory.destroy(temporaryPatternCanvas.canvasEntry);
		pattern.setTransform(domMatrix);
		return pattern;
	}
};
_defineProperty(TilingPattern, "MAX_PATTERN_SIZE", 3e3);
function convertBlackAndWhiteToRGBA({ src, srcPos = 0, dest, width, height, nonBlackColor = 4294967295, inverseDecode = false }) {
	const black = FeatureTest.isLittleEndian ? 4278190080 : 255;
	const [zeroMapping, oneMapping] = inverseDecode ? [nonBlackColor, black] : [black, nonBlackColor];
	const widthInSource = width >> 3;
	const widthRemainder = width & 7;
	const xorMask = zeroMapping ^ oneMapping;
	const srcLength = src.length;
	dest = new Uint32Array(dest.buffer);
	let destPos = 0;
	for (let i = 0; i < height; ++i) {
		for (const max = srcPos + widthInSource; srcPos < max; ++srcPos, destPos += 8) {
			const elem = src[srcPos];
			dest[destPos] = zeroMapping ^ -(elem >> 7 & 1) & xorMask;
			dest[destPos + 1] = zeroMapping ^ -(elem >> 6 & 1) & xorMask;
			dest[destPos + 2] = zeroMapping ^ -(elem >> 5 & 1) & xorMask;
			dest[destPos + 3] = zeroMapping ^ -(elem >> 4 & 1) & xorMask;
			dest[destPos + 4] = zeroMapping ^ -(elem >> 3 & 1) & xorMask;
			dest[destPos + 5] = zeroMapping ^ -(elem >> 2 & 1) & xorMask;
			dest[destPos + 6] = zeroMapping ^ -(elem >> 1 & 1) & xorMask;
			dest[destPos + 7] = zeroMapping ^ -(elem & 1) & xorMask;
		}
		if (widthRemainder === 0) continue;
		const elem = srcPos < srcLength ? src[srcPos++] : 255;
		for (let j = 0; j < widthRemainder; ++j, ++destPos) dest[destPos] = zeroMapping ^ -(elem >> 7 - j & 1) & xorMask;
	}
	return {
		srcPos,
		destPos
	};
}
var MIN_FONT_SIZE = 16;
var MAX_FONT_SIZE = 100;
var EXECUTION_TIME = 15;
var EXECUTION_STEPS = 10;
var FULL_CHUNK_HEIGHT = 16;
var SCALE_MATRIX = new DOMMatrix();
var XY = /* @__PURE__ */ new Float32Array(2);
var MIN_MAX_INIT = new Float32Array([
	Infinity,
	Infinity,
	-Infinity,
	-Infinity
]);
function mirrorContextOperations(ctx, destCtx) {
	if (ctx._removeMirroring) throw new Error("Context is already forwarding operations.");
	ctx.__originalSave = ctx.save;
	ctx.__originalRestore = ctx.restore;
	ctx.__originalRotate = ctx.rotate;
	ctx.__originalScale = ctx.scale;
	ctx.__originalTranslate = ctx.translate;
	ctx.__originalTransform = ctx.transform;
	ctx.__originalSetTransform = ctx.setTransform;
	ctx.__originalResetTransform = ctx.resetTransform;
	ctx.__originalClip = ctx.clip;
	ctx.__originalMoveTo = ctx.moveTo;
	ctx.__originalLineTo = ctx.lineTo;
	ctx.__originalBezierCurveTo = ctx.bezierCurveTo;
	ctx.__originalRect = ctx.rect;
	ctx.__originalClosePath = ctx.closePath;
	ctx.__originalBeginPath = ctx.beginPath;
	ctx._removeMirroring = () => {
		ctx.save = ctx.__originalSave;
		ctx.restore = ctx.__originalRestore;
		ctx.rotate = ctx.__originalRotate;
		ctx.scale = ctx.__originalScale;
		ctx.translate = ctx.__originalTranslate;
		ctx.transform = ctx.__originalTransform;
		ctx.setTransform = ctx.__originalSetTransform;
		ctx.resetTransform = ctx.__originalResetTransform;
		ctx.clip = ctx.__originalClip;
		ctx.moveTo = ctx.__originalMoveTo;
		ctx.lineTo = ctx.__originalLineTo;
		ctx.bezierCurveTo = ctx.__originalBezierCurveTo;
		ctx.rect = ctx.__originalRect;
		ctx.closePath = ctx.__originalClosePath;
		ctx.beginPath = ctx.__originalBeginPath;
		delete ctx._removeMirroring;
	};
	ctx.save = function() {
		destCtx.save();
		this.__originalSave();
	};
	ctx.restore = function() {
		destCtx.restore();
		this.__originalRestore();
	};
	ctx.translate = function(x, y) {
		destCtx.translate(x, y);
		this.__originalTranslate(x, y);
	};
	ctx.scale = function(x, y) {
		destCtx.scale(x, y);
		this.__originalScale(x, y);
	};
	ctx.transform = function(a, b, c, d, e, f) {
		destCtx.transform(a, b, c, d, e, f);
		this.__originalTransform(a, b, c, d, e, f);
	};
	ctx.setTransform = function(a, b, c, d, e, f) {
		destCtx.setTransform(a, b, c, d, e, f);
		this.__originalSetTransform(a, b, c, d, e, f);
	};
	ctx.resetTransform = function() {
		destCtx.resetTransform();
		this.__originalResetTransform();
	};
	ctx.rotate = function(angle) {
		destCtx.rotate(angle);
		this.__originalRotate(angle);
	};
	ctx.clip = function(rule) {
		destCtx.clip(rule);
		this.__originalClip(rule);
	};
	ctx.moveTo = function(x, y) {
		destCtx.moveTo(x, y);
		this.__originalMoveTo(x, y);
	};
	ctx.lineTo = function(x, y) {
		destCtx.lineTo(x, y);
		this.__originalLineTo(x, y);
	};
	ctx.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		destCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		this.__originalBezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	};
	ctx.rect = function(x, y, width, height) {
		destCtx.rect(x, y, width, height);
		this.__originalRect(x, y, width, height);
	};
	ctx.closePath = function() {
		destCtx.closePath();
		this.__originalClosePath();
	};
	ctx.beginPath = function() {
		destCtx.beginPath();
		this.__originalBeginPath();
	};
}
function drawImageAtIntegerCoords(ctx, srcImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH) {
	const [a, b, c, d, tx, ty] = getCurrentTransform(ctx);
	if (b === 0 && c === 0) {
		const tlX = destX * a + tx;
		const rTlX = Math.round(tlX);
		const tlY = destY * d + ty;
		const rTlY = Math.round(tlY);
		const brX = (destX + destW) * a + tx;
		const rWidth = Math.abs(Math.round(brX) - rTlX) || 1;
		const brY = (destY + destH) * d + ty;
		const rHeight = Math.abs(Math.round(brY) - rTlY) || 1;
		ctx.setTransform(Math.sign(a), 0, 0, Math.sign(d), rTlX, rTlY);
		ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, 0, 0, rWidth, rHeight);
		ctx.setTransform(a, b, c, d, tx, ty);
		return [rWidth, rHeight];
	}
	if (a === 0 && d === 0) {
		const tlX = destY * c + tx;
		const rTlX = Math.round(tlX);
		const tlY = destX * b + ty;
		const rTlY = Math.round(tlY);
		const brX = (destY + destH) * c + tx;
		const rWidth = Math.abs(Math.round(brX) - rTlX) || 1;
		const brY = (destX + destW) * b + ty;
		const rHeight = Math.abs(Math.round(brY) - rTlY) || 1;
		ctx.setTransform(0, Math.sign(b), Math.sign(c), 0, rTlX, rTlY);
		ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, 0, 0, rHeight, rWidth);
		ctx.setTransform(a, b, c, d, tx, ty);
		return [rHeight, rWidth];
	}
	ctx.drawImage(srcImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
	const scaleX = Math.hypot(a, b);
	const scaleY = Math.hypot(c, d);
	return [scaleX * destW, scaleY * destH];
}
var CanvasExtraState = class {
	constructor(width, height) {
		_defineProperty(this, "alphaIsShape", false);
		_defineProperty(this, "fontSize", 0);
		_defineProperty(this, "fontSizeScale", 1);
		_defineProperty(this, "textMatrix", null);
		_defineProperty(this, "textMatrixScale", 1);
		_defineProperty(this, "fontMatrix", FONT_IDENTITY_MATRIX);
		_defineProperty(this, "leading", 0);
		_defineProperty(this, "x", 0);
		_defineProperty(this, "y", 0);
		_defineProperty(this, "lineX", 0);
		_defineProperty(this, "lineY", 0);
		_defineProperty(this, "charSpacing", 0);
		_defineProperty(this, "wordSpacing", 0);
		_defineProperty(this, "textHScale", 1);
		_defineProperty(this, "textRenderingMode", TextRenderingMode.FILL);
		_defineProperty(this, "textRise", 0);
		_defineProperty(this, "fillColor", "#000000");
		_defineProperty(this, "strokeColor", "#000000");
		_defineProperty(this, "patternFill", false);
		_defineProperty(this, "patternStroke", false);
		_defineProperty(this, "fillAlpha", 1);
		_defineProperty(this, "strokeAlpha", 1);
		_defineProperty(this, "lineWidth", 1);
		_defineProperty(this, "activeSMask", null);
		_defineProperty(this, "transferMaps", "none");
		_defineProperty(this, "minMax", MIN_MAX_INIT.slice());
		this.clipBox = new Float32Array([
			0,
			0,
			width,
			height
		]);
	}
	clone() {
		const clone = Object.create(this);
		clone.clipBox = this.clipBox.slice();
		clone.minMax = this.minMax.slice();
		return clone;
	}
	getPathBoundingBox(pathType = PathType.FILL, transform = null) {
		const box = this.minMax.slice();
		if (pathType === PathType.STROKE) {
			if (!transform) unreachable("Stroke bounding box must include transform.");
			Util.singularValueDecompose2dScale(transform, XY);
			const xStrokePad = XY[0] * this.lineWidth / 2;
			const yStrokePad = XY[1] * this.lineWidth / 2;
			box[0] -= xStrokePad;
			box[1] -= yStrokePad;
			box[2] += xStrokePad;
			box[3] += yStrokePad;
		}
		return box;
	}
	updateClipFromPath() {
		const intersect = Util.intersect(this.clipBox, this.getPathBoundingBox());
		this.startNewPathAndClipBox(intersect || [
			0,
			0,
			0,
			0
		]);
	}
	isEmptyClip() {
		return this.minMax[0] === Infinity;
	}
	startNewPathAndClipBox(box) {
		this.clipBox.set(box, 0);
		this.minMax.set(MIN_MAX_INIT, 0);
	}
	getClippedPathBoundingBox(pathType = PathType.FILL, transform = null) {
		return Util.intersect(this.clipBox, this.getPathBoundingBox(pathType, transform));
	}
};
function putBinaryImageData(ctx, imgData) {
	if (imgData instanceof ImageData) {
		ctx.putImageData(imgData, 0, 0);
		return;
	}
	const height = imgData.height, width = imgData.width;
	const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
	const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
	const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
	const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
	let srcPos = 0, destPos;
	const src = imgData.data;
	const dest = chunkImgData.data;
	let i, j, thisChunkHeight, elemsInThisChunk;
	if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
		const srcLength = src.byteLength;
		const dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
		const dest32DataLength = dest32.length;
		const fullSrcDiff = width + 7 >> 3;
		const white = 4294967295;
		const black = FeatureTest.isLittleEndian ? 4278190080 : 255;
		for (i = 0; i < totalChunks; i++) {
			thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
			destPos = 0;
			for (j = 0; j < thisChunkHeight; j++) {
				const srcDiff = srcLength - srcPos;
				let k = 0;
				const kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
				const kEndUnrolled = kEnd & -8;
				let mask = 0;
				let srcByte = 0;
				for (; k < kEndUnrolled; k += 8) {
					srcByte = src[srcPos++];
					dest32[destPos++] = srcByte & 128 ? white : black;
					dest32[destPos++] = srcByte & 64 ? white : black;
					dest32[destPos++] = srcByte & 32 ? white : black;
					dest32[destPos++] = srcByte & 16 ? white : black;
					dest32[destPos++] = srcByte & 8 ? white : black;
					dest32[destPos++] = srcByte & 4 ? white : black;
					dest32[destPos++] = srcByte & 2 ? white : black;
					dest32[destPos++] = srcByte & 1 ? white : black;
				}
				for (; k < kEnd; k++) {
					if (mask === 0) {
						srcByte = src[srcPos++];
						mask = 128;
					}
					dest32[destPos++] = srcByte & mask ? white : black;
					mask >>= 1;
				}
			}
			while (destPos < dest32DataLength) dest32[destPos++] = 0;
			ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
		}
	} else if (imgData.kind === ImageKind.RGBA_32BPP) {
		j = 0;
		elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
		for (i = 0; i < fullChunks; i++) {
			dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
			srcPos += elemsInThisChunk;
			ctx.putImageData(chunkImgData, 0, j);
			j += FULL_CHUNK_HEIGHT;
		}
		if (i < totalChunks) {
			elemsInThisChunk = width * partialChunkHeight * 4;
			dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
			ctx.putImageData(chunkImgData, 0, j);
		}
	} else if (imgData.kind === ImageKind.RGB_24BPP) {
		thisChunkHeight = FULL_CHUNK_HEIGHT;
		elemsInThisChunk = width * thisChunkHeight;
		for (i = 0; i < totalChunks; i++) {
			if (i >= fullChunks) {
				thisChunkHeight = partialChunkHeight;
				elemsInThisChunk = width * thisChunkHeight;
			}
			destPos = 0;
			for (j = elemsInThisChunk; j--;) {
				dest[destPos++] = src[srcPos++];
				dest[destPos++] = src[srcPos++];
				dest[destPos++] = src[srcPos++];
				dest[destPos++] = 255;
			}
			ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
		}
	} else throw new Error(`bad image kind: ${imgData.kind}`);
}
function putBinaryImageMask(ctx, imgData) {
	if (imgData.bitmap) {
		ctx.drawImage(imgData.bitmap, 0, 0);
		return;
	}
	const height = imgData.height, width = imgData.width;
	const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
	const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
	const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
	const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
	let srcPos = 0;
	const src = imgData.data;
	const dest = chunkImgData.data;
	for (let i = 0; i < totalChunks; i++) {
		const thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
		({srcPos} = convertBlackAndWhiteToRGBA({
			src,
			srcPos,
			dest,
			width,
			height: thisChunkHeight,
			nonBlackColor: 0
		}));
		ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
	}
}
function copyCtxState(sourceCtx, destCtx) {
	for (const property of [
		"strokeStyle",
		"fillStyle",
		"fillRule",
		"globalAlpha",
		"lineWidth",
		"lineCap",
		"lineJoin",
		"miterLimit",
		"globalCompositeOperation",
		"font",
		"filter"
	]) if (sourceCtx[property] !== void 0) destCtx[property] = sourceCtx[property];
	if (sourceCtx.setLineDash !== void 0) {
		destCtx.setLineDash(sourceCtx.getLineDash());
		destCtx.lineDashOffset = sourceCtx.lineDashOffset;
	}
}
function resetCtxToDefault(ctx) {
	ctx.strokeStyle = ctx.fillStyle = "#000000";
	ctx.fillRule = "nonzero";
	ctx.globalAlpha = 1;
	ctx.lineWidth = 1;
	ctx.lineCap = "butt";
	ctx.lineJoin = "miter";
	ctx.miterLimit = 10;
	ctx.globalCompositeOperation = "source-over";
	ctx.font = "10px sans-serif";
	if (ctx.setLineDash !== void 0) {
		ctx.setLineDash([]);
		ctx.lineDashOffset = 0;
	}
	const { filter } = ctx;
	if (filter !== "none" && filter !== "") ctx.filter = "none";
}
function getImageSmoothingEnabled(transform, interpolate) {
	if (interpolate) return true;
	Util.singularValueDecompose2dScale(transform, XY);
	const actualScale = Math.fround(OutputScale.pixelRatio * PixelsPerInch.PDF_TO_CSS_UNITS);
	return XY[0] <= actualScale && XY[1] <= actualScale;
}
var LINE_CAP_STYLES = [
	"butt",
	"round",
	"square"
];
var LINE_JOIN_STYLES = [
	"miter",
	"round",
	"bevel"
];
var NORMAL_CLIP = {};
var EO_CLIP = {};
var _CanvasGraphics_brand = /* @__PURE__ */ new WeakSet();
var CanvasGraphics = class CanvasGraphics {
	constructor(canvasCtx, commonObjs, objs, canvasFactory, filterFactory, { optionalContentConfig, markedContentStack = null }, annotationCanvasMap, pageColors, dependencyTracker, imagesTracker) {
		_classPrivateMethodInitSpec(this, _CanvasGraphics_brand);
		this.ctx = canvasCtx;
		this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
		this.stateStack = [];
		this.pendingClip = null;
		this.pendingEOFill = false;
		this.commonObjs = commonObjs;
		this.objs = objs;
		this.canvasFactory = canvasFactory;
		this.filterFactory = filterFactory;
		this.groupStack = [];
		this.baseTransform = null;
		this.baseTransformStack = [];
		this.groupLevel = 0;
		this.smaskStack = [];
		this.smaskCounter = 0;
		this.tempSMask = null;
		this.smaskGroupCanvases = [];
		this.suspendedCtx = null;
		this.contentVisible = true;
		this.markedContentStack = markedContentStack || [];
		this.optionalContentConfig = optionalContentConfig;
		this.cachedPatterns = /* @__PURE__ */ new Map();
		this.annotationCanvasMap = annotationCanvasMap;
		this.viewportScale = 1;
		this.outputScaleX = 1;
		this.outputScaleY = 1;
		this.pageColors = pageColors;
		this._cachedScaleForStroking = [-1, 0];
		this._cachedGetSinglePixelWidth = null;
		this._cachedBitmapsMap = /* @__PURE__ */ new Map();
		this.dependencyTracker = dependencyTracker ?? null;
		this.imagesTracker = imagesTracker ?? null;
	}
	getObject(opIdx, data, fallback = null) {
		if (typeof data === "string") {
			this.dependencyTracker?.recordNamedDependency(opIdx, data);
			return data.startsWith("g_") ? this.commonObjs.get(data) : this.objs.get(data);
		}
		return fallback;
	}
	beginDrawing({ transform, viewport, transparency = false, background = null }) {
		const width = this.ctx.canvas.width;
		const height = this.ctx.canvas.height;
		const savedFillStyle = this.ctx.fillStyle;
		this.ctx.fillStyle = background || "#ffffff";
		this.ctx.fillRect(0, 0, width, height);
		this.ctx.fillStyle = savedFillStyle;
		if (transparency) {
			const transparentCanvas = this.transparentCanvasEntry = this.canvasFactory.create(width, height);
			this.compositeCtx = this.ctx;
			({canvas: this.transparentCanvas, context: this.ctx} = transparentCanvas);
			this.ctx.save();
			this.ctx.transform(...getCurrentTransform(this.compositeCtx));
		}
		this.ctx.save();
		resetCtxToDefault(this.ctx);
		if (transform) {
			this.ctx.transform(...transform);
			this.outputScaleX = transform[0];
			this.outputScaleY = transform[0];
		}
		this.ctx.transform(...viewport.transform);
		this.viewportScale = viewport.scale;
		this.baseTransform = getCurrentTransform(this.ctx);
	}
	executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper, operationsFilter) {
		const argsArray = operatorList.argsArray;
		const fnArray = operatorList.fnArray;
		let i = executionStartIdx || 0;
		const argsArrayLen = argsArray.length;
		if (argsArrayLen === i) return i;
		const chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
		const endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
		let steps = 0;
		const commonObjs = this.commonObjs;
		const objs = this.objs;
		let fnId, fnArgs;
		while (true) {
			if (stepper !== void 0) {
				if (i === stepper.nextBreakPoint) {
					stepper.breakIt(i, continueCallback);
					return i;
				}
				if (stepper.shouldSkip(i)) {
					if (++i === argsArrayLen) return i;
					continue;
				}
			}
			if (!operationsFilter || operationsFilter(i)) {
				fnId = fnArray[i];
				fnArgs = argsArray[i] ?? null;
				if (fnId !== OPS.dependency) if (fnArgs === null) this[fnId](i);
				else this[fnId](i, ...fnArgs);
				else for (const depObjId of fnArgs) {
					this.dependencyTracker?.recordNamedData(depObjId, i);
					const objsPool = depObjId.startsWith("g_") ? commonObjs : objs;
					if (!objsPool.has(depObjId)) {
						objsPool.get(depObjId, continueCallback);
						return i;
					}
				}
			}
			i++;
			if (i === argsArrayLen) return i;
			if (chunkOperations && ++steps > EXECUTION_STEPS) {
				if (Date.now() > endTime) {
					continueCallback();
					return i;
				}
				steps = 0;
			}
		}
	}
	endDrawing() {
		_assertClassBrand(_CanvasGraphics_brand, this, _restoreInitialState).call(this);
		for (const canvas of this.smaskGroupCanvases) this.canvasFactory.destroy(canvas);
		this.smaskGroupCanvases.length = 0;
		this.tempSMask = null;
		this.smaskStack.length = 0;
		this.cachedPatterns.clear();
		for (const cache of this._cachedBitmapsMap.values()) {
			for (const canvas of cache.values()) if (typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement) canvas.width = canvas.height = 0;
			cache.clear();
		}
		this._cachedBitmapsMap.clear();
		_assertClassBrand(_CanvasGraphics_brand, this, _drawFilter).call(this);
	}
	_scaleImage(img, inverseTransform) {
		const width = img.width ?? img.displayWidth;
		const height = img.height ?? img.displayHeight;
		const widthScale = Math.max(Math.hypot(inverseTransform[0], inverseTransform[1]), 1);
		const heightScale = Math.max(Math.hypot(inverseTransform[2], inverseTransform[3]), 1);
		const scaleSteps = [];
		let ws = widthScale, hs = heightScale, pw = width, ph = height;
		while (ws > 2 && pw > 1 || hs > 2 && ph > 1) {
			let nw = pw, nh = ph;
			if (ws > 2 && pw > 1) {
				nw = pw >= 16384 ? Math.floor(pw / 2) - 1 || 1 : Math.ceil(pw / 2);
				ws /= pw / nw;
			}
			if (hs > 2 && ph > 1) {
				nh = ph >= 16384 ? Math.floor(ph / 2) - 1 || 1 : Math.ceil(ph) / 2;
				hs /= ph / nh;
			}
			scaleSteps.push({
				newWidth: nw,
				newHeight: nh
			});
			pw = nw;
			ph = nh;
		}
		if (scaleSteps.length === 0) return {
			img,
			paintWidth: width,
			paintHeight: height,
			tmpCanvas: null
		};
		if (scaleSteps.length === 1) {
			const { newWidth, newHeight } = scaleSteps[0];
			const tmpCanvas = this.canvasFactory.create(newWidth, newHeight);
			tmpCanvas.context.drawImage(img, 0, 0, width, height, 0, 0, newWidth, newHeight);
			return {
				img: tmpCanvas.canvas,
				paintWidth: newWidth,
				paintHeight: newHeight,
				tmpCanvas
			};
		}
		let readEntry = this.canvasFactory.create(1, 1);
		let writeEntry = this.canvasFactory.create(1, 1);
		let paintWidth = width, paintHeight = height;
		let source = img;
		for (const { newWidth, newHeight } of scaleSteps) {
			this.canvasFactory.reset(writeEntry, newWidth, newHeight);
			writeEntry.context.drawImage(source, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
			[readEntry, writeEntry] = [writeEntry, readEntry];
			source = readEntry.canvas;
			paintWidth = newWidth;
			paintHeight = newHeight;
		}
		this.canvasFactory.destroy(writeEntry);
		return {
			img: readEntry.canvas,
			paintWidth,
			paintHeight,
			tmpCanvas: readEntry
		};
	}
	_createMaskCanvas(opIdx, img) {
		const ctx = this.ctx;
		const { width, height } = img;
		const fillColor = this.current.fillColor;
		const isPatternFill = this.current.patternFill;
		const currentTransform = getCurrentTransform(ctx);
		let cache, cacheKey, scaled, maskCanvas;
		if ((img.bitmap || img.data) && img.count > 1) {
			const mainKey = img.bitmap || img.data.buffer;
			cacheKey = JSON.stringify(isPatternFill ? currentTransform : [currentTransform.slice(0, 4), fillColor]);
			cache = this._cachedBitmapsMap.getOrInsertComputed(mainKey, makeMap);
			const cachedImage = cache.get(cacheKey);
			if (cachedImage && !isPatternFill) {
				const offsetX = Math.round(Math.min(currentTransform[0], currentTransform[2]) + currentTransform[4]);
				const offsetY = Math.round(Math.min(currentTransform[1], currentTransform[3]) + currentTransform[5]);
				this.dependencyTracker?.recordDependencies(opIdx, Dependencies.transformAndFill);
				return {
					canvas: cachedImage,
					offsetX,
					offsetY
				};
			}
			scaled = cachedImage;
		}
		if (!scaled) {
			maskCanvas = this.canvasFactory.create(width, height);
			putBinaryImageMask(maskCanvas.context, img);
		}
		let maskToCanvas = Util.transform(currentTransform, [
			1 / width,
			0,
			0,
			-1 / height,
			0,
			0
		]);
		maskToCanvas = Util.transform(maskToCanvas, [
			1,
			0,
			0,
			1,
			0,
			-height
		]);
		const minMax = MIN_MAX_INIT.slice();
		Util.axialAlignedBoundingBox([
			0,
			0,
			width,
			height
		], maskToCanvas, minMax);
		const [minX, minY, maxX, maxY] = minMax;
		const drawnWidth = Math.round(maxX - minX) || 1;
		const drawnHeight = Math.round(maxY - minY) || 1;
		const fillCanvas = this.canvasFactory.create(drawnWidth, drawnHeight);
		const fillCtx = fillCanvas.context;
		const offsetX = minX;
		const offsetY = minY;
		fillCtx.translate(-offsetX, -offsetY);
		fillCtx.transform(...maskToCanvas);
		let scaledEntry = null;
		if (!scaled) {
			const scaleResult = this._scaleImage(maskCanvas.canvas, getCurrentTransformInverse(fillCtx));
			scaled = scaleResult.img;
			scaledEntry = scaleResult.tmpCanvas;
			if (scaled !== maskCanvas.canvas) {
				this.canvasFactory.destroy(maskCanvas);
				maskCanvas = null;
			}
			if (cache && isPatternFill) {
				cache.set(cacheKey, scaled);
				scaledEntry = null;
				maskCanvas = null;
			}
		}
		fillCtx.imageSmoothingEnabled = getImageSmoothingEnabled(getCurrentTransform(fillCtx), img.interpolate);
		drawImageAtIntegerCoords(fillCtx, scaled, 0, 0, scaled.width, scaled.height, 0, 0, width, height);
		if (scaledEntry) this.canvasFactory.destroy(scaledEntry);
		if (maskCanvas) this.canvasFactory.destroy(maskCanvas);
		fillCtx.globalCompositeOperation = "source-in";
		const inverse = Util.transform(getCurrentTransformInverse(fillCtx), [
			1,
			0,
			0,
			1,
			-offsetX,
			-offsetY
		]);
		fillCtx.fillStyle = isPatternFill ? fillColor.getPattern(ctx, this, inverse, PathType.FILL, opIdx) : fillColor;
		fillCtx.fillRect(0, 0, width, height);
		if (cache && !isPatternFill) cache.set(cacheKey, fillCanvas.canvas);
		this.dependencyTracker?.recordDependencies(opIdx, Dependencies.transformAndFill);
		return {
			canvas: fillCanvas.canvas,
			canvasEntry: cache && !isPatternFill ? null : fillCanvas,
			offsetX: Math.round(offsetX),
			offsetY: Math.round(offsetY)
		};
	}
	setLineWidth(opIdx, width) {
		this.dependencyTracker?.recordSimpleData("lineWidth", opIdx);
		if (width !== this.current.lineWidth) this._cachedScaleForStroking[0] = -1;
		this.current.lineWidth = width;
		this.ctx.lineWidth = width;
	}
	setLineCap(opIdx, style) {
		this.dependencyTracker?.recordSimpleData("lineCap", opIdx);
		this.ctx.lineCap = LINE_CAP_STYLES[style];
	}
	setLineJoin(opIdx, style) {
		this.dependencyTracker?.recordSimpleData("lineJoin", opIdx);
		this.ctx.lineJoin = LINE_JOIN_STYLES[style];
	}
	setMiterLimit(opIdx, limit) {
		this.dependencyTracker?.recordSimpleData("miterLimit", opIdx);
		this.ctx.miterLimit = limit;
	}
	setDash(opIdx, dashArray, dashPhase) {
		this.dependencyTracker?.recordSimpleData("dash", opIdx);
		const ctx = this.ctx;
		if (ctx.setLineDash !== void 0) {
			ctx.setLineDash(dashArray);
			ctx.lineDashOffset = dashPhase;
		}
	}
	setRenderingIntent(opIdx, intent) {}
	setFlatness(opIdx, flatness) {}
	setGState(opIdx, states) {
		for (const [key, value] of states) switch (key) {
			case "LW":
				this.setLineWidth(opIdx, value);
				break;
			case "LC":
				this.setLineCap(opIdx, value);
				break;
			case "LJ":
				this.setLineJoin(opIdx, value);
				break;
			case "ML":
				this.setMiterLimit(opIdx, value);
				break;
			case "D":
				this.setDash(opIdx, value[0], value[1]);
				break;
			case "RI":
				this.setRenderingIntent(opIdx, value);
				break;
			case "FL":
				this.setFlatness(opIdx, value);
				break;
			case "Font":
				this.setFont(opIdx, value[0], value[1]);
				break;
			case "CA":
				this.dependencyTracker?.recordSimpleData("strokeAlpha", opIdx);
				this.current.strokeAlpha = value;
				break;
			case "ca":
				this.dependencyTracker?.recordSimpleData("fillAlpha", opIdx);
				this.ctx.globalAlpha = this.current.fillAlpha = value;
				break;
			case "BM":
				this.dependencyTracker?.recordSimpleData("globalCompositeOperation", opIdx);
				this.ctx.globalCompositeOperation = value;
				break;
			case "SMask":
				this.dependencyTracker?.recordSimpleData("SMask", opIdx);
				this.current.activeSMask = value ? this.tempSMask : null;
				this.tempSMask = null;
				this.checkSMaskState();
				break;
			case "TR":
				this.dependencyTracker?.recordSimpleData("filter", opIdx);
				this.ctx.filter = this.current.transferMaps = this.filterFactory.addFilter(value);
				break;
		}
	}
	get inSMaskMode() {
		return !!this.suspendedCtx;
	}
	checkSMaskState() {
		const inSMaskMode = this.inSMaskMode;
		if (this.current.activeSMask && !inSMaskMode) this.beginSMaskMode();
		else if (!this.current.activeSMask && inSMaskMode) this.endSMaskMode();
	}
	beginSMaskMode(opIdx) {
		if (this.inSMaskMode) throw new Error("beginSMaskMode called while already in smask mode");
		const drawnWidth = this.ctx.canvas.width;
		const drawnHeight = this.ctx.canvas.height;
		const scratchCanvas = this.canvasFactory.create(drawnWidth, drawnHeight);
		this.smaskScratchCanvas = scratchCanvas;
		this.suspendedCtx = this.ctx;
		const ctx = this.ctx = scratchCanvas.context;
		ctx.setTransform(this.suspendedCtx.getTransform());
		copyCtxState(this.suspendedCtx, ctx);
		mirrorContextOperations(ctx, this.suspendedCtx);
		this.setGState(opIdx, [["BM", "source-over"]]);
	}
	endSMaskMode() {
		if (!this.inSMaskMode) throw new Error("endSMaskMode called while not in smask mode");
		this.ctx._removeMirroring();
		copyCtxState(this.ctx, this.suspendedCtx);
		this.ctx = this.suspendedCtx;
		this.suspendedCtx = null;
		this.canvasFactory.destroy(this.smaskScratchCanvas);
		this.smaskScratchCanvas = null;
	}
	compose(dirtyBox) {
		if (!this.current.activeSMask) return;
		if (!dirtyBox) dirtyBox = [
			0,
			0,
			this.ctx.canvas.width,
			this.ctx.canvas.height
		];
		else {
			dirtyBox[0] = Math.floor(dirtyBox[0]);
			dirtyBox[1] = Math.floor(dirtyBox[1]);
			dirtyBox[2] = Math.ceil(dirtyBox[2]);
			dirtyBox[3] = Math.ceil(dirtyBox[3]);
		}
		const smask = this.current.activeSMask;
		const suspendedCtx = this.suspendedCtx;
		this.composeSMask(suspendedCtx, smask, this.ctx, dirtyBox);
		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.restore();
	}
	composeSMask(ctx, smask, layerCtx, layerBox) {
		const layerOffsetX = layerBox[0];
		const layerOffsetY = layerBox[1];
		const layerWidth = layerBox[2] - layerOffsetX;
		const layerHeight = layerBox[3] - layerOffsetY;
		if (layerWidth === 0 || layerHeight === 0) return;
		this.genericComposeSMask(smask.context, layerCtx, layerWidth, layerHeight, smask.subtype, smask.backdrop, smask.transferMap, layerOffsetX, layerOffsetY, smask.offsetX, smask.offsetY);
		ctx.save();
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(layerCtx.canvas, 0, 0);
		ctx.restore();
	}
	genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap, layerOffsetX, layerOffsetY, maskOffsetX, maskOffsetY) {
		let maskCanvas = maskCtx.canvas;
		let maskX = layerOffsetX - maskOffsetX;
		let maskY = layerOffsetY - maskOffsetY;
		let maskExtensionEntry = null;
		if (backdrop) if (maskX < 0 || maskY < 0 || maskX + width > maskCanvas.width || maskY + height > maskCanvas.height) {
			maskExtensionEntry = this.canvasFactory.create(width, height);
			const ctx = maskExtensionEntry.context;
			ctx.drawImage(maskCanvas, -maskX, -maskY);
			ctx.globalCompositeOperation = "destination-atop";
			ctx.fillStyle = backdrop;
			ctx.fillRect(0, 0, width, height);
			ctx.globalCompositeOperation = "source-over";
			maskCanvas = maskExtensionEntry.canvas;
			maskX = maskY = 0;
		} else {
			maskCtx.save();
			maskCtx.globalAlpha = 1;
			maskCtx.setTransform(1, 0, 0, 1, 0, 0);
			const clip = new Path2D();
			clip.rect(maskX, maskY, width, height);
			maskCtx.clip(clip);
			maskCtx.globalCompositeOperation = "destination-atop";
			maskCtx.fillStyle = backdrop;
			maskCtx.fillRect(maskX, maskY, width, height);
			maskCtx.restore();
		}
		layerCtx.save();
		layerCtx.globalAlpha = 1;
		layerCtx.setTransform(1, 0, 0, 1, 0, 0);
		if (subtype === "Alpha" && transferMap) layerCtx.filter = this.filterFactory.addAlphaFilter(transferMap);
		else if (subtype === "Luminosity") layerCtx.filter = this.filterFactory.addLuminosityFilter(transferMap);
		const clip = new Path2D();
		clip.rect(layerOffsetX, layerOffsetY, width, height);
		layerCtx.clip(clip);
		layerCtx.globalCompositeOperation = "destination-in";
		layerCtx.drawImage(maskCanvas, maskX, maskY, width, height, layerOffsetX, layerOffsetY, width, height);
		layerCtx.restore();
		if (maskExtensionEntry) this.canvasFactory.destroy(maskExtensionEntry);
	}
	save(opIdx) {
		if (this.inSMaskMode) copyCtxState(this.ctx, this.suspendedCtx);
		this.ctx.save();
		const old = this.current;
		this.stateStack.push(old);
		this.current = old.clone();
		this.dependencyTracker?.save(opIdx);
	}
	restore(opIdx) {
		this.dependencyTracker?.restore(opIdx);
		if (this.stateStack.length === 0) {
			if (this.inSMaskMode) this.endSMaskMode();
			return;
		}
		this.current = this.stateStack.pop();
		this.ctx.restore();
		if (this.inSMaskMode) copyCtxState(this.suspendedCtx, this.ctx);
		this.checkSMaskState();
		this.pendingClip = null;
		this._cachedScaleForStroking[0] = -1;
		this._cachedGetSinglePixelWidth = null;
	}
	transform(opIdx, a, b, c, d, e, f) {
		this.dependencyTracker?.recordIncrementalData("transform", opIdx);
		this.ctx.transform(a, b, c, d, e, f);
		this._cachedScaleForStroking[0] = -1;
		this._cachedGetSinglePixelWidth = null;
	}
	constructPath(opIdx, op, data, minMax) {
		let [path] = data;
		if (!minMax) {
			path || (path = data[0] = new Path2D());
			this[op](opIdx, path);
			return;
		}
		if (this.dependencyTracker !== null) {
			const outerExtraSize = op === OPS.stroke ? this.current.lineWidth / 2 : 0;
			this.dependencyTracker.resetBBox(opIdx).recordBBox(opIdx, this.ctx, minMax[0] - outerExtraSize, minMax[2] + outerExtraSize, minMax[1] - outerExtraSize, minMax[3] + outerExtraSize).recordDependencies(opIdx, ["transform"]);
		}
		if (!(path instanceof Path2D)) path = data[0] = makePathFromDrawOPS(path);
		Util.axialAlignedBoundingBox(minMax, getCurrentTransform(this.ctx), this.current.minMax);
		this[op](opIdx, path);
		this._pathStartIdx = opIdx;
	}
	closePath(opIdx) {
		this.ctx.closePath();
	}
	stroke(opIdx, path, consumePath = true) {
		const ctx = this.ctx;
		const strokeColor = this.current.strokeColor;
		ctx.globalAlpha = this.current.strokeAlpha;
		if (this.contentVisible) if (typeof strokeColor === "object" && strokeColor?.getPattern) {
			const baseTransform = strokeColor.isModifyingCurrentTransform() ? ctx.getTransform() : null;
			ctx.save();
			ctx.strokeStyle = strokeColor.getPattern(ctx, this, getCurrentTransformInverse(ctx), PathType.STROKE, opIdx);
			if (baseTransform) {
				const newPath = new Path2D();
				newPath.addPath(path, ctx.getTransform().invertSelf().multiplySelf(baseTransform));
				path = newPath;
			}
			this.rescaleAndStroke(path, false);
			ctx.restore();
		} else this.rescaleAndStroke(path, true);
		this.dependencyTracker?.recordDependencies(opIdx, Dependencies.stroke);
		if (consumePath) this.consumePath(opIdx, path, this.current.getClippedPathBoundingBox(PathType.STROKE, getCurrentTransform(this.ctx)));
		ctx.globalAlpha = this.current.fillAlpha;
	}
	closeStroke(opIdx, path) {
		this.stroke(opIdx, path);
	}
	fill(opIdx, path, consumePath = true) {
		const ctx = this.ctx;
		const fillColor = this.current.fillColor;
		const isPatternFill = this.current.patternFill;
		let needRestore = false;
		if (isPatternFill) {
			const baseTransform = fillColor.isModifyingCurrentTransform() ? ctx.getTransform() : null;
			this.dependencyTracker?.save(opIdx);
			ctx.save();
			ctx.fillStyle = fillColor.getPattern(ctx, this, getCurrentTransformInverse(ctx), PathType.FILL, opIdx);
			if (baseTransform) {
				const newPath = new Path2D();
				newPath.addPath(path, ctx.getTransform().invertSelf().multiplySelf(baseTransform));
				path = newPath;
			}
			needRestore = true;
		}
		const intersect = this.current.getClippedPathBoundingBox();
		if (this.contentVisible && intersect !== null) if (this.pendingEOFill) {
			ctx.fill(path, "evenodd");
			this.pendingEOFill = false;
		} else ctx.fill(path);
		this.dependencyTracker?.recordDependencies(opIdx, Dependencies.fill);
		if (needRestore) {
			ctx.restore();
			this.dependencyTracker?.restore(opIdx);
		}
		if (consumePath) this.consumePath(opIdx, path, intersect);
	}
	eoFill(opIdx, path) {
		this.pendingEOFill = true;
		this.fill(opIdx, path);
	}
	fillStroke(opIdx, path) {
		this.fill(opIdx, path, false);
		this.stroke(opIdx, path, false);
		this.consumePath(opIdx, path);
	}
	eoFillStroke(opIdx, path) {
		this.pendingEOFill = true;
		this.fillStroke(opIdx, path);
	}
	closeFillStroke(opIdx, path) {
		this.fillStroke(opIdx, path);
	}
	closeEOFillStroke(opIdx, path) {
		this.pendingEOFill = true;
		this.fillStroke(opIdx, path);
	}
	endPath(opIdx, path) {
		this.consumePath(opIdx, path);
	}
	rawFillPath(opIdx, path) {
		this.ctx.fill(path);
		this.dependencyTracker?.recordDependencies(opIdx, Dependencies.rawFillPath).recordOperation(opIdx);
	}
	clip(opIdx) {
		this.dependencyTracker?.recordFutureForcedDependency("clipMode", opIdx);
		this.pendingClip = NORMAL_CLIP;
	}
	eoClip(opIdx) {
		this.dependencyTracker?.recordFutureForcedDependency("clipMode", opIdx);
		this.pendingClip = EO_CLIP;
	}
	beginText(opIdx) {
		this.current.textMatrix = null;
		this.current.textMatrixScale = 1;
		this.current.x = this.current.lineX = 0;
		this.current.y = this.current.lineY = 0;
		this.dependencyTracker?.recordOpenMarker(opIdx).resetIncrementalData("sameLineText").resetIncrementalData("moveText", opIdx);
	}
	endText(opIdx) {
		const paths = this.pendingTextPaths;
		const ctx = this.ctx;
		if (this.dependencyTracker) {
			const { dependencyTracker } = this;
			if (paths !== void 0) dependencyTracker.recordFutureForcedDependency("textClip", dependencyTracker.getOpenMarker()).recordFutureForcedDependency("textClip", opIdx);
			dependencyTracker.recordCloseMarker(opIdx);
		}
		if (paths !== void 0) {
			const newPath = new Path2D();
			const invTransf = ctx.getTransform().invertSelf();
			for (const { transform, x, y, fontSize, path } of paths) {
				if (!path) continue;
				newPath.addPath(path, new DOMMatrix(transform).preMultiplySelf(invTransf).translate(x, y).scale(fontSize, -fontSize));
			}
			ctx.clip(newPath);
		}
		delete this.pendingTextPaths;
	}
	setCharSpacing(opIdx, spacing) {
		this.dependencyTracker?.recordSimpleData("charSpacing", opIdx);
		this.current.charSpacing = spacing;
	}
	setWordSpacing(opIdx, spacing) {
		this.dependencyTracker?.recordSimpleData("wordSpacing", opIdx);
		this.current.wordSpacing = spacing;
	}
	setHScale(opIdx, scale) {
		this.dependencyTracker?.recordSimpleData("hScale", opIdx);
		this.current.textHScale = scale / 100;
	}
	setLeading(opIdx, leading) {
		this.dependencyTracker?.recordSimpleData("leading", opIdx);
		this.current.leading = -leading;
	}
	setFont(opIdx, fontRefName, size) {
		this.dependencyTracker?.recordSimpleData("font", opIdx).recordSimpleDataFromNamed("fontObj", fontRefName, opIdx);
		const fontObj = this.commonObjs.get(fontRefName);
		const current = this.current;
		if (!fontObj) throw new Error(`Can't find font for ${fontRefName}`);
		current.fontMatrix = fontObj.fontMatrix || FONT_IDENTITY_MATRIX;
		if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) warn("Invalid font matrix for font " + fontRefName);
		if (size < 0) {
			size = -size;
			current.fontDirection = -1;
		} else current.fontDirection = 1;
		this.current.font = fontObj;
		this.current.fontSize = size;
		if (fontObj.isType3Font) return;
		const name = fontObj.loadedName || "sans-serif";
		const typeface = fontObj.systemFontInfo?.css || `"${name}", ${fontObj.fallbackName}`;
		let bold = "normal";
		if (fontObj.black) bold = "900";
		else if (fontObj.bold) bold = "bold";
		const italic = fontObj.italic ? "italic" : "normal";
		let browserFontSize = size;
		if (size < MIN_FONT_SIZE) browserFontSize = MIN_FONT_SIZE;
		else if (size > MAX_FONT_SIZE) browserFontSize = MAX_FONT_SIZE;
		this.current.fontSizeScale = size / browserFontSize;
		this.ctx.font = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
	}
	setTextRenderingMode(opIdx, mode) {
		this.dependencyTracker?.recordSimpleData("textRenderingMode", opIdx);
		this.current.textRenderingMode = mode;
	}
	setTextRise(opIdx, rise) {
		this.dependencyTracker?.recordSimpleData("textRise", opIdx);
		this.current.textRise = rise;
	}
	moveText(opIdx, x, y) {
		this.dependencyTracker?.resetIncrementalData("sameLineText").recordIncrementalData("moveText", opIdx);
		this.current.x = this.current.lineX += x;
		this.current.y = this.current.lineY += y;
	}
	setLeadingMoveText(opIdx, x, y) {
		this.setLeading(opIdx, -y);
		this.moveText(opIdx, x, y);
	}
	setTextMatrix(opIdx, matrix) {
		this.dependencyTracker?.resetIncrementalData("sameLineText").recordSimpleData("textMatrix", opIdx);
		const { current } = this;
		current.textMatrix = matrix;
		current.textMatrixScale = Math.hypot(matrix[0], matrix[1]);
		current.x = current.lineX = 0;
		current.y = current.lineY = 0;
	}
	nextLine(opIdx) {
		this.moveText(opIdx, 0, this.current.leading);
		this.dependencyTracker?.recordIncrementalData("moveText", this.dependencyTracker.getSimpleIndex("leading") ?? opIdx);
	}
	paintChar(opIdx, character, x, y, patternFillTransform, patternStrokeTransform) {
		const ctx = this.ctx;
		const current = this.current;
		const font = current.font;
		const textRenderingMode = current.textRenderingMode;
		const fontSize = current.fontSize / current.fontSizeScale;
		const fillStrokeMode = textRenderingMode & TextRenderingMode.FILL_STROKE_MASK;
		const isAddToPathSet = !!(textRenderingMode & TextRenderingMode.ADD_TO_PATH_FLAG);
		const patternFill = current.patternFill && !font.missingFile;
		const patternStroke = current.patternStroke && !font.missingFile;
		let path;
		if ((font.disableFontFace || isAddToPathSet || patternFill || patternStroke) && !font.missingFile) path = font.getPathGenerator(this.commonObjs, character);
		if (path && (font.disableFontFace || patternFill || patternStroke)) {
			ctx.save();
			ctx.translate(x, y);
			ctx.scale(fontSize, -fontSize);
			this.dependencyTracker?.recordCharacterBBox(opIdx, ctx, font);
			let currentTransform;
			if (fillStrokeMode === TextRenderingMode.FILL || fillStrokeMode === TextRenderingMode.FILL_STROKE) if (patternFillTransform) {
				currentTransform = ctx.getTransform();
				ctx.setTransform(...patternFillTransform);
				const scaledPath = _assertClassBrand(_CanvasGraphics_brand, this, _getScaledPath).call(this, path, currentTransform, patternFillTransform);
				ctx.fill(scaledPath);
			} else ctx.fill(path);
			if (fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE) if (patternStrokeTransform) {
				currentTransform || (currentTransform = ctx.getTransform());
				ctx.setTransform(...patternStrokeTransform);
				const { a, b, c, d } = currentTransform;
				const invPatternTransform = Util.inverseTransform(patternStrokeTransform);
				const transf = Util.transform([
					a,
					b,
					c,
					d,
					0,
					0
				], invPatternTransform);
				Util.singularValueDecompose2dScale(transf, XY);
				ctx.lineWidth *= Math.max(XY[0], XY[1]) / fontSize;
				ctx.stroke(_assertClassBrand(_CanvasGraphics_brand, this, _getScaledPath).call(this, path, currentTransform, patternStrokeTransform));
			} else {
				ctx.lineWidth /= fontSize;
				ctx.stroke(path);
			}
			ctx.restore();
		} else {
			if (fillStrokeMode === TextRenderingMode.FILL || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
				ctx.fillText(character, x, y);
				this.dependencyTracker?.recordCharacterBBox(opIdx, ctx, font, fontSize, x, y, () => ctx.measureText(character));
			}
			if (fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
				if (this.dependencyTracker) this.dependencyTracker?.recordCharacterBBox(opIdx, ctx, font, fontSize, x, y, () => ctx.measureText(character)).recordDependencies(opIdx, Dependencies.stroke);
				ctx.strokeText(character, x, y);
			}
		}
		if (isAddToPathSet) {
			(this.pendingTextPaths || (this.pendingTextPaths = [])).push({
				transform: getCurrentTransform(ctx),
				x,
				y,
				fontSize,
				path
			});
			this.dependencyTracker?.recordCharacterBBox(opIdx, ctx, font, fontSize, x, y);
		}
	}
	get isFontSubpixelAAEnabled() {
		const tmpCanvas = this.canvasFactory.create(10, 10);
		const ctx = tmpCanvas.context;
		ctx.scale(1.5, 1);
		ctx.fillText("I", 0, 10);
		const data = ctx.getImageData(0, 0, 10, 10).data;
		this.canvasFactory.destroy(tmpCanvas);
		let enabled = false;
		for (let i = 3; i < data.length; i += 4) if (data[i] > 0 && data[i] < 255) {
			enabled = true;
			break;
		}
		return shadow(this, "isFontSubpixelAAEnabled", enabled);
	}
	showText(opIdx, glyphs) {
		if (this.dependencyTracker) {
			this.dependencyTracker.recordDependencies(opIdx, Dependencies.showText).resetBBox(opIdx);
			if (this.current.textRenderingMode & TextRenderingMode.ADD_TO_PATH_FLAG) this.dependencyTracker.recordFutureForcedDependency("textClip", opIdx).inheritPendingDependenciesAsFutureForcedDependencies();
		}
		const current = this.current;
		const font = current.font;
		if (font.isType3Font) {
			this.showType3Text(opIdx, glyphs);
			this.dependencyTracker?.recordShowTextOperation(opIdx);
			return;
		}
		const fontSize = current.fontSize;
		if (fontSize === 0) {
			this.dependencyTracker?.recordOperation(opIdx);
			return;
		}
		const ctx = this.ctx;
		const fontSizeScale = current.fontSizeScale;
		const charSpacing = current.charSpacing;
		const wordSpacing = current.wordSpacing;
		const fontDirection = current.fontDirection;
		const textHScale = current.textHScale * fontDirection;
		const glyphsLength = glyphs.length;
		const vertical = font.vertical;
		const spacingDir = vertical ? 1 : -1;
		const defaultVMetrics = font.defaultVMetrics;
		const widthAdvanceScale = fontSize * current.fontMatrix[0];
		const simpleFillText = current.textRenderingMode === TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
		ctx.save();
		if (current.textMatrix) ctx.transform(...current.textMatrix);
		ctx.translate(current.x, current.y + current.textRise);
		if (fontDirection > 0) ctx.scale(textHScale, -1);
		else ctx.scale(textHScale, 1);
		let patternFillTransform, patternStrokeTransform;
		const fillStrokeMode = current.textRenderingMode & TextRenderingMode.FILL_STROKE_MASK;
		const needsFill = fillStrokeMode === TextRenderingMode.FILL || fillStrokeMode === TextRenderingMode.FILL_STROKE;
		const needsStroke = fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE;
		if (needsFill && current.patternFill) {
			ctx.save();
			const pattern = current.fillColor.getPattern(ctx, this, getCurrentTransformInverse(ctx), PathType.FILL, opIdx);
			patternFillTransform = getCurrentTransform(ctx);
			ctx.restore();
			ctx.fillStyle = pattern;
		}
		if (needsStroke && current.patternStroke) {
			ctx.save();
			const pattern = current.strokeColor.getPattern(ctx, this, getCurrentTransformInverse(ctx), PathType.STROKE, opIdx);
			patternStrokeTransform = getCurrentTransform(ctx);
			ctx.restore();
			ctx.strokeStyle = pattern;
		}
		let lineWidth = current.lineWidth;
		const scale = current.textMatrixScale;
		if (scale === 0 || lineWidth === 0) {
			if (needsStroke) lineWidth = this.getSinglePixelWidth();
		} else lineWidth /= scale;
		if (fontSizeScale !== 1) {
			ctx.scale(fontSizeScale, fontSizeScale);
			lineWidth /= fontSizeScale;
		}
		ctx.lineWidth = lineWidth;
		if (font.isInvalidPDFjsFont) {
			const chars = [];
			let width = 0;
			for (const glyph of glyphs) {
				chars.push(glyph.unicode);
				width += glyph.width;
			}
			const joinedChars = chars.join("");
			ctx.fillText(joinedChars, 0, 0);
			if (this.dependencyTracker !== null) {
				const measure = ctx.measureText(joinedChars);
				this.dependencyTracker.recordBBox(opIdx, this.ctx, -measure.actualBoundingBoxLeft, measure.actualBoundingBoxRight, -measure.actualBoundingBoxAscent, measure.actualBoundingBoxDescent).recordShowTextOperation(opIdx);
			}
			current.x += width * widthAdvanceScale * textHScale;
			ctx.restore();
			this.compose();
			return;
		}
		let x = 0, i;
		for (i = 0; i < glyphsLength; ++i) {
			const glyph = glyphs[i];
			if (typeof glyph === "number") {
				x += spacingDir * glyph * fontSize / 1e3;
				continue;
			}
			let restoreNeeded = false;
			const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
			const character = glyph.fontChar;
			const accent = glyph.accent;
			let scaledX, scaledY;
			let width = glyph.width;
			if (vertical) {
				const vmetric = glyph.vmetric || defaultVMetrics;
				const vx = -(glyph.vmetric ? vmetric[1] : width * .5) * widthAdvanceScale;
				const vy = vmetric[2] * widthAdvanceScale;
				width = vmetric ? -vmetric[0] : width;
				scaledX = vx / fontSizeScale;
				scaledY = (x + vy) / fontSizeScale;
			} else {
				scaledX = x / fontSizeScale;
				scaledY = 0;
			}
			let measure;
			if (font.remeasure && width > 0) {
				measure = ctx.measureText(character);
				const measuredWidth = measure.width * 1e3 / fontSize * fontSizeScale;
				if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
					const characterScaleX = width / measuredWidth;
					restoreNeeded = true;
					ctx.save();
					ctx.scale(characterScaleX, 1);
					scaledX /= characterScaleX;
				} else if (width !== measuredWidth) scaledX += (width - measuredWidth) / 2e3 * fontSize / fontSizeScale;
			}
			if (this.contentVisible && (glyph.isInFont || font.missingFile)) if (simpleFillText && !accent) {
				ctx.fillText(character, scaledX, scaledY);
				this.dependencyTracker?.recordCharacterBBox(opIdx, ctx, measure ? { bbox: null } : font, fontSize / fontSizeScale, scaledX, scaledY, () => measure ?? ctx.measureText(character));
			} else {
				this.paintChar(opIdx, character, scaledX, scaledY, patternFillTransform, patternStrokeTransform);
				if (accent) {
					const scaledAccentX = scaledX + fontSize * accent.offset.x / fontSizeScale;
					const scaledAccentY = scaledY - fontSize * accent.offset.y / fontSizeScale;
					this.paintChar(opIdx, accent.fontChar, scaledAccentX, scaledAccentY, patternFillTransform, patternStrokeTransform);
				}
			}
			const charWidth = vertical ? width * widthAdvanceScale - spacing * fontDirection : width * widthAdvanceScale + spacing * fontDirection;
			x += charWidth;
			if (restoreNeeded) ctx.restore();
		}
		if (vertical) current.y -= x;
		else current.x += x * textHScale;
		ctx.restore();
		this.compose();
		this.dependencyTracker?.recordShowTextOperation(opIdx);
	}
	showType3Text(opIdx, glyphs) {
		const ctx = this.ctx;
		const current = this.current;
		const font = current.font;
		const fontSize = current.fontSize;
		const fontDirection = current.fontDirection;
		const spacingDir = font.vertical ? 1 : -1;
		const charSpacing = current.charSpacing;
		const wordSpacing = current.wordSpacing;
		const textHScale = current.textHScale * fontDirection;
		const fontMatrix = current.fontMatrix || FONT_IDENTITY_MATRIX;
		const glyphsLength = glyphs.length;
		const isTextInvisible = current.textRenderingMode === TextRenderingMode.INVISIBLE;
		let i, glyph, width, spacingLength;
		if (isTextInvisible || fontSize === 0) return;
		this._cachedScaleForStroking[0] = -1;
		this._cachedGetSinglePixelWidth = null;
		ctx.save();
		if (current.textMatrix) ctx.transform(...current.textMatrix);
		ctx.translate(current.x, current.y + current.textRise);
		ctx.scale(textHScale, fontDirection);
		const dependencyTracker = this.dependencyTracker;
		this.dependencyTracker = dependencyTracker ? new CanvasNestedDependencyTracker(dependencyTracker, opIdx) : null;
		for (i = 0; i < glyphsLength; ++i) {
			glyph = glyphs[i];
			if (typeof glyph === "number") {
				spacingLength = spacingDir * glyph * fontSize / 1e3;
				this.ctx.translate(spacingLength, 0);
				current.x += spacingLength * textHScale;
				continue;
			}
			const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
			const operatorList = font.charProcOperatorList[glyph.operatorListId];
			if (!operatorList) warn(`Type3 character "${glyph.operatorListId}" is not available.`);
			else if (this.contentVisible) {
				this.save();
				ctx.scale(fontSize, fontSize);
				ctx.transform(...fontMatrix);
				this.executeOperatorList(operatorList);
				this.restore();
			}
			const p = [glyph.width, 0];
			Util.applyTransform(p, fontMatrix);
			width = p[0] * fontSize + spacing;
			ctx.translate(width, 0);
			current.x += width * textHScale;
		}
		ctx.restore();
		if (dependencyTracker) this.dependencyTracker = dependencyTracker;
	}
	setCharWidth(opIdx, xWidth, yWidth) {}
	setCharWidthAndBounds(opIdx, xWidth, yWidth, llx, lly, urx, ury) {
		const clip = new Path2D();
		clip.rect(llx, lly, urx - llx, ury - lly);
		this.ctx.clip(clip);
		this.dependencyTracker?.recordBBox(opIdx, this.ctx, llx, urx, lly, ury).recordClipBox(opIdx, this.ctx, llx, urx, lly, ury);
		this.endPath(opIdx);
	}
	getColorN_Pattern(opIdx, IR) {
		let pattern;
		if (IR[0] === "TilingPattern") {
			const baseTransform = this.baseTransform || getCurrentTransform(this.ctx);
			pattern = new TilingPattern(IR, this.ctx, { createCanvasGraphics: (ctx, renderingOpIdx) => new CanvasGraphics(ctx, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, {
				optionalContentConfig: this.optionalContentConfig,
				markedContentStack: this.markedContentStack
			}, void 0, void 0, this.dependencyTracker ? new CanvasNestedDependencyTracker(this.dependencyTracker, renderingOpIdx, true) : null) }, baseTransform);
		} else pattern = this._getPattern(opIdx, IR[1], IR[2]);
		return pattern;
	}
	setStrokeColorN(opIdx, ...args) {
		this.dependencyTracker?.recordSimpleData("strokeColor", opIdx);
		this.current.strokeColor = this.getColorN_Pattern(opIdx, args);
		this.current.patternStroke = true;
	}
	setFillColorN(opIdx, ...args) {
		this.dependencyTracker?.recordSimpleData("fillColor", opIdx);
		this.current.fillColor = this.getColorN_Pattern(opIdx, args);
		this.current.patternFill = true;
	}
	setStrokeRGBColor(opIdx, color) {
		this.dependencyTracker?.recordSimpleData("strokeColor", opIdx);
		this.ctx.strokeStyle = this.current.strokeColor = color;
		this.current.patternStroke = false;
	}
	setStrokeTransparent(opIdx) {
		this.dependencyTracker?.recordSimpleData("strokeColor", opIdx);
		this.ctx.strokeStyle = this.current.strokeColor = "transparent";
		this.current.patternStroke = false;
	}
	setFillRGBColor(opIdx, color) {
		this.dependencyTracker?.recordSimpleData("fillColor", opIdx);
		this.ctx.fillStyle = this.current.fillColor = color;
		this.current.patternFill = false;
	}
	setFillTransparent(opIdx) {
		this.dependencyTracker?.recordSimpleData("fillColor", opIdx);
		this.ctx.fillStyle = this.current.fillColor = "transparent";
		this.current.patternFill = false;
	}
	_getPattern(opIdx, objId, matrix = null) {
		let pattern;
		if (this.cachedPatterns.has(objId)) pattern = this.cachedPatterns.get(objId);
		else {
			pattern = getShadingPattern(this.getObject(opIdx, objId));
			this.cachedPatterns.set(objId, pattern);
		}
		if (matrix) pattern.matrix = matrix;
		return pattern;
	}
	shadingFill(opIdx, objId) {
		if (!this.contentVisible) return;
		const ctx = this.ctx;
		this.save(opIdx);
		ctx.fillStyle = this._getPattern(opIdx, objId).getPattern(ctx, this, getCurrentTransformInverse(ctx), PathType.SHADING, opIdx);
		const inv = getCurrentTransformInverse(ctx);
		if (inv) {
			const { width, height } = ctx.canvas;
			const minMax = MIN_MAX_INIT.slice();
			Util.axialAlignedBoundingBox([
				0,
				0,
				width,
				height
			], inv, minMax);
			const [x0, y0, x1, y1] = minMax;
			this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
		} else this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
		this.dependencyTracker?.resetBBox(opIdx).recordFullPageBBox(opIdx).recordDependencies(opIdx, Dependencies.transform).recordDependencies(opIdx, Dependencies.fill).recordOperation(opIdx);
		this.compose(this.current.getClippedPathBoundingBox());
		this.restore(opIdx);
	}
	beginInlineImage() {
		unreachable("Should not call beginInlineImage");
	}
	beginImageData() {
		unreachable("Should not call beginImageData");
	}
	paintFormXObjectBegin(opIdx, matrix, bbox) {
		if (!this.contentVisible) return;
		this.save(opIdx);
		this.baseTransformStack.push(this.baseTransform);
		if (matrix) this.transform(opIdx, ...matrix);
		this.baseTransform = getCurrentTransform(this.ctx);
		if (bbox) {
			Util.axialAlignedBoundingBox(bbox, this.baseTransform, this.current.minMax);
			const [x0, y0, x1, y1] = bbox;
			const clip = new Path2D();
			clip.rect(x0, y0, x1 - x0, y1 - y0);
			this.ctx.clip(clip);
			this.dependencyTracker?.recordClipBox(opIdx, this.ctx, x0, x1, y0, y1);
			this.endPath(opIdx);
		}
	}
	paintFormXObjectEnd(opIdx) {
		if (!this.contentVisible) return;
		this.restore(opIdx);
		this.baseTransform = this.baseTransformStack.pop();
	}
	beginGroup(opIdx, group) {
		if (!this.contentVisible) return;
		this.save(opIdx);
		if (this.inSMaskMode) {
			this.endSMaskMode();
			this.current.activeSMask = null;
		}
		const currentCtx = this.ctx;
		if (!group.isolated) info("TODO: Support non-isolated groups.");
		if (group.knockout) warn("Knockout groups not supported.");
		const currentTransform = getCurrentTransform(currentCtx);
		if (group.matrix) currentCtx.transform(...group.matrix);
		const canvasBounds = [
			0,
			0,
			currentCtx.canvas.width,
			currentCtx.canvas.height
		];
		let bounds;
		if (group.bbox) {
			bounds = MIN_MAX_INIT.slice();
			Util.axialAlignedBoundingBox(group.bbox, getCurrentTransform(currentCtx), bounds);
			bounds = Util.intersect(bounds, canvasBounds) || [
				0,
				0,
				0,
				0
			];
		} else bounds = canvasBounds;
		const offsetX = Math.floor(bounds[0]);
		const offsetY = Math.floor(bounds[1]);
		const drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
		const drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
		this.current.startNewPathAndClipBox([
			0,
			0,
			drawnWidth,
			drawnHeight
		]);
		if (group.smask) this.smaskCounter++;
		const scratchCanvas = this.canvasFactory.create(drawnWidth, drawnHeight);
		if (group.smask) this.smaskGroupCanvases.push(scratchCanvas);
		const groupCtx = scratchCanvas.context;
		groupCtx.translate(-offsetX, -offsetY);
		groupCtx.transform(...currentTransform);
		if (group.bbox) {
			let clip = new Path2D();
			const [x0, y0, x1, y1] = group.bbox;
			clip.rect(x0, y0, x1 - x0, y1 - y0);
			if (group.matrix) {
				const path = new Path2D();
				path.addPath(clip, new DOMMatrix(group.matrix));
				clip = path;
			}
			groupCtx.clip(clip);
		}
		if (group.smask) this.smaskStack.push({
			canvas: scratchCanvas.canvas,
			context: groupCtx,
			offsetX,
			offsetY,
			subtype: group.smask.subtype,
			backdrop: group.smask.backdrop,
			transferMap: group.smask.transferMap || null,
			startTransformInverse: null
		});
		if (!group.smask || this.dependencyTracker) {
			currentCtx.setTransform(1, 0, 0, 1, 0, 0);
			currentCtx.translate(offsetX, offsetY);
			currentCtx.save();
		}
		copyCtxState(currentCtx, groupCtx);
		this.ctx = groupCtx;
		this.dependencyTracker?.inheritSimpleDataAsFutureForcedDependencies([
			"fillAlpha",
			"strokeAlpha",
			"globalCompositeOperation"
		]).pushBaseTransform(currentCtx);
		this.setGState(opIdx, [
			["BM", "source-over"],
			["ca", 1],
			["CA", 1],
			["TR", null]
		]);
		this.groupStack.push(currentCtx);
		this.groupLevel++;
	}
	endGroup(opIdx, group) {
		if (!this.contentVisible) return;
		this.groupLevel--;
		const groupCtx = this.ctx;
		const ctx = this.groupStack.pop();
		this.ctx = ctx;
		this.ctx.imageSmoothingEnabled = false;
		this.dependencyTracker?.popBaseTransform();
		if (group.smask) {
			this.tempSMask = this.smaskStack.pop();
			this.restore(opIdx);
			if (this.dependencyTracker) this.ctx.restore();
		} else {
			this.ctx.restore();
			const currentMtx = getCurrentTransform(this.ctx);
			this.restore(opIdx);
			this.ctx.save();
			this.ctx.setTransform(...currentMtx);
			const dirtyBox = MIN_MAX_INIT.slice();
			Util.axialAlignedBoundingBox([
				0,
				0,
				groupCtx.canvas.width,
				groupCtx.canvas.height
			], currentMtx, dirtyBox);
			this.ctx.drawImage(groupCtx.canvas, 0, 0);
			this.ctx.restore();
			this.canvasFactory.destroy({
				canvas: groupCtx.canvas,
				context: groupCtx
			});
			this.compose(dirtyBox);
		}
	}
	beginAnnotation(opIdx, id, rect, transform, matrix, hasOwnCanvas) {
		_assertClassBrand(_CanvasGraphics_brand, this, _restoreInitialState).call(this);
		resetCtxToDefault(this.ctx);
		this.ctx.save();
		this.save(opIdx);
		if (this.baseTransform) this.ctx.setTransform(...this.baseTransform);
		if (rect) {
			const width = rect[2] - rect[0];
			const height = rect[3] - rect[1];
			if (hasOwnCanvas && this.annotationCanvasMap) {
				transform = transform.slice();
				transform[4] -= rect[0];
				transform[5] -= rect[1];
				rect = rect.slice();
				rect[0] = rect[1] = 0;
				rect[2] = width;
				rect[3] = height;
				Util.singularValueDecompose2dScale(getCurrentTransform(this.ctx), XY);
				const { viewportScale } = this;
				const canvasWidth = Math.ceil(width * this.outputScaleX * viewportScale);
				const canvasHeight = Math.ceil(height * this.outputScaleY * viewportScale);
				this.annotationCanvas = this.canvasFactory.create(canvasWidth, canvasHeight);
				const { canvas, context } = this.annotationCanvas;
				this.annotationCanvasMap.set(id, canvas);
				this.annotationCanvas.savedCtx = this.ctx;
				this.ctx = context;
				this.ctx.save();
				this.ctx.setTransform(XY[0], 0, 0, -XY[1], 0, height * XY[1]);
				resetCtxToDefault(this.ctx);
			} else {
				resetCtxToDefault(this.ctx);
				this.endPath(opIdx);
				const clip = new Path2D();
				clip.rect(rect[0], rect[1], width, height);
				this.ctx.clip(clip);
			}
		}
		this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
		this.transform(opIdx, ...transform);
		this.transform(opIdx, ...matrix);
	}
	endAnnotation(opIdx) {
		if (this.annotationCanvas) {
			this.ctx.restore();
			_assertClassBrand(_CanvasGraphics_brand, this, _drawFilter).call(this);
			this.ctx = this.annotationCanvas.savedCtx;
			delete this.annotationCanvas.savedCtx;
			delete this.annotationCanvas;
		}
	}
	paintImageMaskXObject(opIdx, img) {
		if (!this.contentVisible) return;
		const count = img.count;
		img = this.getObject(opIdx, img.data, img);
		img.count = count;
		const ctx = this.ctx;
		const mask = this._createMaskCanvas(opIdx, img);
		const maskCanvas = mask.canvas;
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(maskCanvas, mask.offsetX, mask.offsetY);
		this.dependencyTracker?.resetBBox(opIdx).recordBBox(opIdx, this.ctx, mask.offsetX, mask.offsetX + maskCanvas.width, mask.offsetY, mask.offsetY + maskCanvas.height).recordOperation(opIdx);
		ctx.restore();
		if (mask.canvasEntry) this.canvasFactory.destroy(mask.canvasEntry);
		this.compose();
	}
	paintImageMaskXObjectRepeat(opIdx, img, scaleX, skewX = 0, skewY = 0, scaleY, positions) {
		if (!this.contentVisible) return;
		img = this.getObject(opIdx, img.data, img);
		const ctx = this.ctx;
		ctx.save();
		const currentTransform = getCurrentTransform(ctx);
		ctx.transform(scaleX, skewX, skewY, scaleY, 0, 0);
		const mask = this._createMaskCanvas(opIdx, img);
		ctx.setTransform(1, 0, 0, 1, mask.offsetX - currentTransform[4], mask.offsetY - currentTransform[5]);
		this.dependencyTracker?.resetBBox(opIdx);
		for (let i = 0, ii = positions.length; i < ii; i += 2) {
			const trans = Util.transform(currentTransform, [
				scaleX,
				skewX,
				skewY,
				scaleY,
				positions[i],
				positions[i + 1]
			]);
			ctx.drawImage(mask.canvas, trans[4], trans[5]);
			this.dependencyTracker?.recordBBox(opIdx, this.ctx, trans[4], trans[4] + mask.canvas.width, trans[5], trans[5] + mask.canvas.height);
		}
		ctx.restore();
		if (mask.canvasEntry) this.canvasFactory.destroy(mask.canvasEntry);
		this.compose();
		this.dependencyTracker?.recordOperation(opIdx);
	}
	paintImageMaskXObjectGroup(opIdx, images) {
		if (!this.contentVisible) return;
		const ctx = this.ctx;
		const fillColor = this.current.fillColor;
		const isPatternFill = this.current.patternFill;
		this.dependencyTracker?.resetBBox(opIdx).recordDependencies(opIdx, Dependencies.transformAndFill);
		for (const image of images) {
			const { data, width, height, transform } = image;
			const maskCanvas = this.canvasFactory.create(width, height);
			const maskCtx = maskCanvas.context;
			maskCtx.save();
			putBinaryImageMask(maskCtx, this.getObject(opIdx, data, image));
			maskCtx.globalCompositeOperation = "source-in";
			maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this, getCurrentTransformInverse(ctx), PathType.FILL, opIdx) : fillColor;
			maskCtx.fillRect(0, 0, width, height);
			maskCtx.restore();
			ctx.save();
			ctx.transform(...transform);
			ctx.scale(1, -1);
			drawImageAtIntegerCoords(ctx, maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
			this.canvasFactory.destroy(maskCanvas);
			this.dependencyTracker?.recordBBox(opIdx, ctx, 0, width, 0, height);
			ctx.restore();
		}
		this.compose();
		this.dependencyTracker?.recordOperation(opIdx);
	}
	paintImageXObject(opIdx, objId) {
		if (!this.contentVisible) return;
		const imgData = this.getObject(opIdx, objId);
		if (!imgData) {
			warn("Dependent image isn't ready yet");
			return;
		}
		this.paintInlineImageXObject(opIdx, imgData);
	}
	paintImageXObjectRepeat(opIdx, objId, scaleX, scaleY, positions) {
		if (!this.contentVisible) return;
		const imgData = this.getObject(opIdx, objId);
		if (!imgData) {
			warn("Dependent image isn't ready yet");
			return;
		}
		const width = imgData.width;
		const height = imgData.height;
		const map = [];
		for (let i = 0, ii = positions.length; i < ii; i += 2) map.push({
			transform: [
				scaleX,
				0,
				0,
				scaleY,
				positions[i],
				positions[i + 1]
			],
			x: 0,
			y: 0,
			w: width,
			h: height
		});
		this.paintInlineImageXObjectGroup(opIdx, imgData, map);
	}
	applyTransferMapsToCanvas(ctx) {
		if (this.current.transferMaps !== "none") {
			ctx.filter = this.current.transferMaps;
			ctx.drawImage(ctx.canvas, 0, 0);
			ctx.filter = "none";
		}
		return ctx.canvas;
	}
	applyTransferMapsToBitmap(imgData) {
		if (this.current.transferMaps === "none") return {
			img: imgData.bitmap,
			canvasEntry: null
		};
		const { bitmap, width, height } = imgData;
		const tmpCanvas = this.canvasFactory.create(width, height);
		const tmpCtx = tmpCanvas.context;
		tmpCtx.filter = this.current.transferMaps;
		tmpCtx.drawImage(bitmap, 0, 0);
		tmpCtx.filter = "none";
		return {
			img: tmpCanvas.canvas,
			canvasEntry: tmpCanvas
		};
	}
	paintInlineImageXObject(opIdx, imgData) {
		if (!this.contentVisible) return;
		const width = imgData.width;
		const height = imgData.height;
		const ctx = this.ctx;
		this.save(opIdx);
		const { filter } = ctx;
		if (filter !== "none" && filter !== "") ctx.filter = "none";
		ctx.scale(1 / width, -1 / height);
		let imgToPaint;
		let inlineImgCanvas = null;
		if (imgData.bitmap) {
			const result = this.applyTransferMapsToBitmap(imgData);
			imgToPaint = result.img;
			inlineImgCanvas = result.canvasEntry;
		} else if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) imgToPaint = imgData;
		else {
			const tmpCanvas = this.canvasFactory.create(width, height);
			putBinaryImageData(tmpCanvas.context, imgData);
			imgToPaint = this.applyTransferMapsToCanvas(tmpCanvas.context);
			inlineImgCanvas = tmpCanvas;
		}
		const scaled = this._scaleImage(imgToPaint, getCurrentTransformInverse(ctx));
		ctx.imageSmoothingEnabled = getImageSmoothingEnabled(getCurrentTransform(ctx), imgData.interpolate);
		if (this.dependencyTracker) {
			this.dependencyTracker.resetBBox(opIdx).recordBBox(opIdx, ctx, 0, width, -height, 0).recordDependencies(opIdx, Dependencies.imageXObject).recordOperation(opIdx);
			this.imagesTracker?.record(ctx, width, height, this.dependencyTracker.clipBox);
		}
		drawImageAtIntegerCoords(ctx, scaled.img, 0, 0, scaled.paintWidth, scaled.paintHeight, 0, -height, width, height);
		if (scaled.tmpCanvas) this.canvasFactory.destroy(scaled.tmpCanvas);
		if (inlineImgCanvas) this.canvasFactory.destroy(inlineImgCanvas);
		this.compose();
		this.restore(opIdx);
	}
	paintInlineImageXObjectGroup(opIdx, imgData, map) {
		if (!this.contentVisible) return;
		const ctx = this.ctx;
		let imgToPaint;
		let inlineImgCanvas = null;
		if (imgData.bitmap) imgToPaint = imgData.bitmap;
		else {
			const w = imgData.width;
			const h = imgData.height;
			const tmpCanvas = this.canvasFactory.create(w, h);
			putBinaryImageData(tmpCanvas.context, imgData);
			imgToPaint = this.applyTransferMapsToCanvas(tmpCanvas.context);
			inlineImgCanvas = tmpCanvas;
		}
		this.dependencyTracker?.resetBBox(opIdx);
		for (const entry of map) {
			ctx.save();
			ctx.transform(...entry.transform);
			ctx.scale(1, -1);
			drawImageAtIntegerCoords(ctx, imgToPaint, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);
			this.dependencyTracker?.recordBBox(opIdx, ctx, 0, 1, -1, 0);
			ctx.restore();
		}
		if (inlineImgCanvas) this.canvasFactory.destroy(inlineImgCanvas);
		this.dependencyTracker?.recordOperation(opIdx);
		this.compose();
	}
	paintSolidColorImageMask(opIdx) {
		if (!this.contentVisible) return;
		this.dependencyTracker?.resetBBox(opIdx).recordBBox(opIdx, this.ctx, 0, 1, 0, 1).recordDependencies(opIdx, Dependencies.fill).recordOperation(opIdx);
		this.ctx.fillRect(0, 0, 1, 1);
		this.compose();
	}
	markPoint(opIdx, tag) {}
	markPointProps(opIdx, tag, properties) {}
	beginMarkedContent(opIdx, tag) {
		this.dependencyTracker?.beginMarkedContent(opIdx);
		this.markedContentStack.push({ visible: true });
	}
	beginMarkedContentProps(opIdx, tag, properties) {
		this.dependencyTracker?.beginMarkedContent(opIdx);
		if (tag === "OC") this.markedContentStack.push({ visible: this.optionalContentConfig.isVisible(properties) });
		else this.markedContentStack.push({ visible: true });
		this.contentVisible = this.isContentVisible();
	}
	endMarkedContent(opIdx) {
		this.dependencyTracker?.endMarkedContent(opIdx);
		this.markedContentStack.pop();
		this.contentVisible = this.isContentVisible();
	}
	beginCompat(opIdx) {}
	endCompat(opIdx) {}
	consumePath(opIdx, path, clipBox) {
		const isEmpty = this.current.isEmptyClip();
		if (this.pendingClip) this.current.updateClipFromPath();
		if (!this.pendingClip) this.compose(clipBox);
		const ctx = this.ctx;
		if (this.pendingClip) {
			if (!isEmpty) if (this.pendingClip === EO_CLIP) ctx.clip(path, "evenodd");
			else ctx.clip(path);
			this.pendingClip = null;
			this.dependencyTracker?.bboxToClipBoxDropOperation(opIdx).recordFutureForcedDependency("clipPath", opIdx);
		} else this.dependencyTracker?.recordOperation(opIdx);
		this.current.startNewPathAndClipBox(this.current.clipBox);
	}
	getSinglePixelWidth() {
		if (!this._cachedGetSinglePixelWidth) {
			const m = getCurrentTransform(this.ctx);
			if (m[1] === 0 && m[2] === 0) this._cachedGetSinglePixelWidth = 1 / Math.min(Math.abs(m[0]), Math.abs(m[3]));
			else {
				const absDet = Math.abs(m[0] * m[3] - m[2] * m[1]);
				const normX = Math.hypot(m[0], m[2]);
				const normY = Math.hypot(m[1], m[3]);
				this._cachedGetSinglePixelWidth = Math.max(normX, normY) / absDet;
			}
		}
		return this._cachedGetSinglePixelWidth;
	}
	getScaleForStroking() {
		if (this._cachedScaleForStroking[0] === -1) {
			const { lineWidth } = this.current;
			const { a, b, c, d } = this.ctx.getTransform();
			let scaleX, scaleY;
			if (b === 0 && c === 0) {
				const normX = Math.abs(a);
				const normY = Math.abs(d);
				if (normX === normY) if (lineWidth === 0) scaleX = scaleY = 1 / normX;
				else {
					const scaledLineWidth = normX * lineWidth;
					scaleX = scaleY = scaledLineWidth < 1 ? 1 / scaledLineWidth : 1;
				}
				else if (lineWidth === 0) {
					scaleX = 1 / normX;
					scaleY = 1 / normY;
				} else {
					const scaledXLineWidth = normX * lineWidth;
					const scaledYLineWidth = normY * lineWidth;
					scaleX = scaledXLineWidth < 1 ? 1 / scaledXLineWidth : 1;
					scaleY = scaledYLineWidth < 1 ? 1 / scaledYLineWidth : 1;
				}
			} else {
				const absDet = Math.abs(a * d - b * c);
				const normX = Math.hypot(a, b);
				const normY = Math.hypot(c, d);
				if (lineWidth === 0) {
					scaleX = normY / absDet;
					scaleY = normX / absDet;
				} else {
					const baseArea = lineWidth * absDet;
					scaleX = normY > baseArea ? normY / baseArea : 1;
					scaleY = normX > baseArea ? normX / baseArea : 1;
				}
			}
			this._cachedScaleForStroking[0] = scaleX;
			this._cachedScaleForStroking[1] = scaleY;
		}
		return this._cachedScaleForStroking;
	}
	rescaleAndStroke(path, saveRestore) {
		const { ctx, current: { lineWidth } } = this;
		const [scaleX, scaleY] = this.getScaleForStroking();
		if (scaleX === scaleY) {
			ctx.lineWidth = (lineWidth || 1) * scaleX;
			ctx.stroke(path);
			return;
		}
		const dashes = ctx.getLineDash();
		if (saveRestore) ctx.save();
		ctx.scale(scaleX, scaleY);
		SCALE_MATRIX.a = 1 / scaleX;
		SCALE_MATRIX.d = 1 / scaleY;
		const newPath = new Path2D();
		newPath.addPath(path, SCALE_MATRIX);
		if (dashes.length > 0) {
			const scale = Math.max(scaleX, scaleY);
			ctx.setLineDash(dashes.map((x) => x / scale));
			ctx.lineDashOffset /= scale;
		}
		ctx.lineWidth = lineWidth || 1;
		ctx.stroke(newPath);
		if (saveRestore) ctx.restore();
	}
	isContentVisible() {
		for (let i = this.markedContentStack.length - 1; i >= 0; i--) if (!this.markedContentStack[i].visible) return false;
		return true;
	}
};
function _restoreInitialState() {
	while (this.stateStack.length || this.inSMaskMode) this.restore();
	this.current.activeSMask = null;
	this.ctx.restore();
	if (this.transparentCanvas) {
		this.ctx = this.compositeCtx;
		this.ctx.save();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.drawImage(this.transparentCanvas, 0, 0);
		this.ctx.restore();
		this.canvasFactory.destroy(this.transparentCanvasEntry);
		this.transparentCanvas = null;
		this.transparentCanvasEntry = null;
	}
}
function _drawFilter() {
	if (this.pageColors) {
		const hcmFilterId = this.filterFactory.addHCMFilter(this.pageColors.foreground, this.pageColors.background);
		if (hcmFilterId !== "none") {
			const savedFilter = this.ctx.filter;
			this.ctx.filter = hcmFilterId;
			this.ctx.drawImage(this.ctx.canvas, 0, 0);
			this.ctx.filter = savedFilter;
		}
	}
}
function _getScaledPath(path, currentTransform, transform) {
	const newPath = new Path2D();
	newPath.addPath(path, new DOMMatrix(transform).invertSelf().multiplySelf(currentTransform));
	return newPath;
}
for (const op in OPS) if (CanvasGraphics.prototype[op] !== void 0) CanvasGraphics.prototype[OPS[op]] = CanvasGraphics.prototype[op];
var _PDFStreamReader = /* @__PURE__ */ new WeakMap();
var _PDFStreamRangeReader = /* @__PURE__ */ new WeakMap();
var BasePDFStream = class {
	constructor(source, PDFStreamReader, PDFStreamRangeReader) {
		_classPrivateFieldInitSpec(this, _PDFStreamReader, null);
		_classPrivateFieldInitSpec(this, _PDFStreamRangeReader, null);
		_defineProperty(this, "_fullReader", null);
		_defineProperty(this, "_rangeReaders", /* @__PURE__ */ new Set());
		_defineProperty(this, "_source", null);
		this._source = source;
		_classPrivateFieldSet2(_PDFStreamReader, this, PDFStreamReader);
		_classPrivateFieldSet2(_PDFStreamRangeReader, this, PDFStreamRangeReader);
	}
	get _progressiveDataLength() {
		return this._fullReader?._loaded ?? 0;
	}
	getFullReader() {
		assert(!this._fullReader, "BasePDFStream.getFullReader can only be called once.");
		return this._fullReader = new (_classPrivateFieldGet2(_PDFStreamReader, this))(this);
	}
	getRangeReader(begin, end) {
		if (end <= this._progressiveDataLength) return null;
		const reader = new (_classPrivateFieldGet2(_PDFStreamRangeReader, this))(this, begin, end);
		this._rangeReaders.add(reader);
		return reader;
	}
	cancelAllRequests(reason) {
		this._fullReader?.cancel(reason);
		for (const reader of new Set(this._rangeReaders)) reader.cancel(reason);
	}
};
var BasePDFStreamReader = class {
	constructor(stream) {
		_defineProperty(this, "onProgress", null);
		_defineProperty(this, "_contentLength", 0);
		_defineProperty(this, "_filename", null);
		_defineProperty(this, "_headersCapability", Promise.withResolvers());
		_defineProperty(this, "_isRangeSupported", false);
		_defineProperty(this, "_isStreamingSupported", false);
		_defineProperty(this, "_loaded", 0);
		_defineProperty(this, "_stream", null);
		this._stream = stream;
	}
	_callOnProgress() {
		this.onProgress?.({
			loaded: this._loaded,
			total: this._contentLength
		});
	}
	get headersReady() {
		return this._headersCapability.promise;
	}
	get filename() {
		return this._filename;
	}
	get contentLength() {
		return this._contentLength;
	}
	get isRangeSupported() {
		return this._isRangeSupported;
	}
	get isStreamingSupported() {
		return this._isStreamingSupported;
	}
	async read() {
		unreachable("Abstract method `read` called");
	}
	cancel(reason) {
		unreachable("Abstract method `cancel` called");
	}
};
var BasePDFStreamRangeReader = class {
	constructor(stream, begin, end) {
		_defineProperty(this, "_stream", null);
		this._stream = stream;
	}
	async read() {
		unreachable("Abstract method `read` called");
	}
	cancel(reason) {
		unreachable("Abstract method `cancel` called");
	}
};
function getFilenameFromContentDispositionHeader(contentDisposition) {
	let needsEncodingFixup = true;
	let tmp = toParamRegExp("filename\\*", "i").exec(contentDisposition);
	if (tmp) {
		tmp = tmp[1];
		let filename = rfc2616unquote(tmp);
		filename = unescape(filename);
		filename = rfc5987decode(filename);
		filename = rfc2047decode(filename);
		return fixupEncoding(filename);
	}
	tmp = rfc2231getparam(contentDisposition);
	if (tmp) return fixupEncoding(rfc2047decode(tmp));
	tmp = toParamRegExp("filename", "i").exec(contentDisposition);
	if (tmp) {
		tmp = tmp[1];
		let filename = rfc2616unquote(tmp);
		filename = rfc2047decode(filename);
		return fixupEncoding(filename);
	}
	function toParamRegExp(attributePattern, flags) {
		return new RegExp("(?:^|;)\\s*" + attributePattern + "\\s*=\\s*([^\";\\s][^;\\s]*|\"(?:[^\"\\\\]|\\\\\"?)+\"?)", flags);
	}
	function textdecode(encoding, value) {
		if (encoding) {
			if (!/^[\x00-\xFF]+$/.test(value)) return value;
			try {
				const decoder = new TextDecoder(encoding, { fatal: true });
				const buffer = stringToBytes(value);
				value = decoder.decode(buffer);
				needsEncodingFixup = false;
			} catch {}
		}
		return value;
	}
	function fixupEncoding(value) {
		if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
			value = textdecode("utf-8", value);
			if (needsEncodingFixup) value = textdecode("iso-8859-1", value);
		}
		return value;
	}
	function rfc2231getparam(contentDispositionStr) {
		const matches = [];
		let match;
		const iter = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
		while ((match = iter.exec(contentDispositionStr)) !== null) {
			let [, n, quot, part] = match;
			n = parseInt(n, 10);
			if (n in matches) {
				if (n === 0) break;
				continue;
			}
			matches[n] = [quot, part];
		}
		const parts = [];
		for (let n = 0; n < matches.length; ++n) {
			if (!(n in matches)) break;
			let [quot, part] = matches[n];
			part = rfc2616unquote(part);
			if (quot) {
				part = unescape(part);
				if (n === 0) part = rfc5987decode(part);
			}
			parts.push(part);
		}
		return parts.join("");
	}
	function rfc2616unquote(value) {
		if (value.startsWith("\"")) {
			const parts = value.slice(1).split("\\\"");
			for (let i = 0; i < parts.length; ++i) {
				const quotindex = parts[i].indexOf("\"");
				if (quotindex !== -1) {
					parts[i] = parts[i].slice(0, quotindex);
					parts.length = i + 1;
				}
				parts[i] = parts[i].replaceAll(/\\(.)/g, "$1");
			}
			value = parts.join("\"");
		}
		return value;
	}
	function rfc5987decode(extvalue) {
		const encodingend = extvalue.indexOf("'");
		if (encodingend === -1) return extvalue;
		return textdecode(extvalue.slice(0, encodingend), extvalue.slice(encodingend + 1).replace(/^[^']*'/, ""));
	}
	function rfc2047decode(value) {
		if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) return value;
		return value.replaceAll(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function(matches, charset, encoding, text) {
			if (encoding === "q" || encoding === "Q") {
				text = text.replaceAll("_", " ");
				text = text.replaceAll(/=([0-9a-fA-F]{2})/g, function(match, hex) {
					return String.fromCharCode(parseInt(hex, 16));
				});
				return textdecode(charset, text);
			}
			try {
				text = atob(text);
			} catch {}
			return textdecode(charset, text);
		});
	}
	return "";
}
function createHeaders(isHttp, httpHeaders) {
	const headers = new Headers();
	if (!isHttp || !httpHeaders || typeof httpHeaders !== "object") return headers;
	for (const key in httpHeaders) {
		const val = httpHeaders[key];
		if (val !== void 0) headers.append(key, val);
	}
	return headers;
}
function getResponseOrigin(url) {
	return URL.parse(url)?.origin ?? null;
}
function validateRangeRequestCapabilities({ responseHeaders, isHttp, rangeChunkSize, disableRange }) {
	const rv = {
		contentLength: 0,
		isRangeSupported: false
	};
	const length = parseInt(responseHeaders.get("Content-Length"), 10);
	if (!Number.isInteger(length)) return rv;
	rv.contentLength = length;
	if (length <= 2 * rangeChunkSize) return rv;
	if (disableRange || !isHttp) return rv;
	if (responseHeaders.get("Accept-Ranges") !== "bytes") return rv;
	if ((responseHeaders.get("Content-Encoding") || "identity") === "identity") rv.isRangeSupported = true;
	return rv;
}
function extractFilenameFromHeader(responseHeaders) {
	const contentDisposition = responseHeaders.get("Content-Disposition");
	if (contentDisposition) {
		let filename = getFilenameFromContentDispositionHeader(contentDisposition);
		if (filename.includes("%")) try {
			filename = decodeURIComponent(filename);
		} catch {}
		if (isPdfFile(filename)) return filename;
	}
	return null;
}
function createResponseError(status, url) {
	return new ResponseException(`Unexpected server response (${status}) while retrieving PDF "${url.href}".`, status, status === 404 || status === 0 && url.protocol === "file:");
}
function ensureResponseOrigin(rangeOrigin, origin) {
	if (rangeOrigin !== origin) throw new Error(`Expected range response-origin "${rangeOrigin}" to match "${origin}".`);
}
function fetchUrl(url, headers, withCredentials, abortController) {
	return fetch(url, {
		method: "GET",
		headers,
		signal: abortController.signal,
		mode: "cors",
		credentials: withCredentials ? "include" : "same-origin",
		redirect: "follow"
	});
}
function ensureResponseStatus(status, url) {
	if (status !== 200 && status !== 206) throw createResponseError(status, url);
}
function getArrayBuffer(val) {
	if (val instanceof Uint8Array) return val.buffer;
	if (val instanceof ArrayBuffer) return val;
	throw new Error(`getArrayBuffer - unexpected data: ${val}`);
}
var PDFFetchStream = class extends BasePDFStream {
	constructor(source) {
		super(source, PDFFetchStreamReader, PDFFetchStreamRangeReader);
		_defineProperty(this, "_responseOrigin", null);
		const { httpHeaders, url } = source;
		assert(/https?:/.test(url.protocol), "PDFFetchStream only supports http(s):// URLs.");
		this.headers = createHeaders(true, httpHeaders);
	}
};
var PDFFetchStreamReader = class extends BasePDFStreamReader {
	constructor(stream) {
		super(stream);
		_defineProperty(this, "_abortController", new AbortController());
		_defineProperty(this, "_reader", null);
		const { disableRange, disableStream, rangeChunkSize, url, withCredentials } = stream._source;
		this._isStreamingSupported = !disableStream;
		fetchUrl(url, new Headers(stream.headers), withCredentials, this._abortController).then((response) => {
			stream._responseOrigin = getResponseOrigin(response.url);
			ensureResponseStatus(response.status, url);
			this._reader = response.body.getReader();
			const responseHeaders = response.headers;
			const { contentLength, isRangeSupported } = validateRangeRequestCapabilities({
				responseHeaders,
				isHttp: true,
				rangeChunkSize,
				disableRange
			});
			this._contentLength = contentLength;
			this._isRangeSupported = isRangeSupported;
			this._filename = extractFilenameFromHeader(responseHeaders);
			if (!this._isStreamingSupported && this._isRangeSupported) this.cancel(new AbortException("Streaming is disabled."));
			this._headersCapability.resolve();
		}).catch(this._headersCapability.reject);
	}
	async read() {
		await this._headersCapability.promise;
		const { value, done } = await this._reader.read();
		if (done) return {
			value,
			done
		};
		this._loaded += value.byteLength;
		this._callOnProgress();
		return {
			value: getArrayBuffer(value),
			done: false
		};
	}
	cancel(reason) {
		this._reader?.cancel(reason);
		this._abortController.abort();
	}
};
var PDFFetchStreamRangeReader = class extends BasePDFStreamRangeReader {
	constructor(stream, begin, end) {
		super(stream, begin, end);
		_defineProperty(this, "_abortController", new AbortController());
		_defineProperty(this, "_readCapability", Promise.withResolvers());
		_defineProperty(this, "_reader", null);
		const { url, withCredentials } = stream._source;
		const headers = new Headers(stream.headers);
		headers.append("Range", `bytes=${begin}-${end - 1}`);
		fetchUrl(url, headers, withCredentials, this._abortController).then((response) => {
			ensureResponseOrigin(getResponseOrigin(response.url), stream._responseOrigin);
			ensureResponseStatus(response.status, url);
			this._reader = response.body.getReader();
			this._readCapability.resolve();
		}).catch(this._readCapability.reject);
	}
	async read() {
		await this._readCapability.promise;
		const { value, done } = await this._reader.read();
		if (done) return {
			value,
			done
		};
		return {
			value: getArrayBuffer(value),
			done: false
		};
	}
	cancel(reason) {
		this._reader?.cancel(reason);
		this._abortController.abort();
	}
};
function transport_stream_getArrayBuffer(val) {
	return val instanceof Uint8Array && val.byteLength === val.buffer.byteLength ? val.buffer : new Uint8Array(val).buffer;
}
function endRequests() {
	for (const capability of this._requests) capability.resolve({
		value: void 0,
		done: true
	});
	this._requests.length = 0;
}
var _PDFDataTransportStream_brand = /* @__PURE__ */ new WeakSet();
var PDFDataTransportStream = class extends BasePDFStream {
	constructor(source) {
		super(source, PDFDataTransportStreamReader, PDFDataTransportStreamRangeReader);
		_classPrivateMethodInitSpec(this, _PDFDataTransportStream_brand);
		_defineProperty(this, "_progressiveDone", false);
		_defineProperty(this, "_queuedChunks", []);
		const { pdfDataRangeTransport } = source;
		const { initialData, progressiveDone } = pdfDataRangeTransport;
		if (initialData?.length > 0) {
			const buffer = transport_stream_getArrayBuffer(initialData);
			this._queuedChunks.push(buffer);
		}
		this._progressiveDone = progressiveDone;
		pdfDataRangeTransport.addRangeListener((begin, chunk) => {
			_assertClassBrand(_PDFDataTransportStream_brand, this, _onReceiveData).call(this, begin, chunk);
		});
		pdfDataRangeTransport.addProgressiveReadListener((chunk) => {
			_assertClassBrand(_PDFDataTransportStream_brand, this, _onReceiveData).call(this, void 0, chunk);
		});
		pdfDataRangeTransport.addProgressiveDoneListener(() => {
			this._fullReader?.progressiveDone();
			this._progressiveDone = true;
		});
		pdfDataRangeTransport.transportReady();
	}
	getFullReader() {
		const reader = super.getFullReader();
		this._queuedChunks = null;
		return reader;
	}
	getRangeReader(begin, end) {
		const reader = super.getRangeReader(begin, end);
		if (reader) {
			reader.onDone = () => this._rangeReaders.delete(reader);
			this._source.pdfDataRangeTransport.requestDataRange(begin, end);
		}
		return reader;
	}
	cancelAllRequests(reason) {
		super.cancelAllRequests(reason);
		this._source.pdfDataRangeTransport.abort();
	}
};
function _onReceiveData(begin, chunk) {
	const buffer = transport_stream_getArrayBuffer(chunk);
	if (begin === void 0) if (this._fullReader) this._fullReader._enqueue(buffer);
	else this._queuedChunks.push(buffer);
	else {
		const rangeReader = this._rangeReaders.keys().find((r) => r._begin === begin);
		assert(rangeReader, "#onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
		rangeReader._enqueue(buffer);
	}
}
var _endRequests = /* @__PURE__ */ new WeakMap();
var PDFDataTransportStreamReader = class extends BasePDFStreamReader {
	constructor(stream) {
		super(stream);
		_classPrivateFieldInitSpec(this, _endRequests, endRequests.bind(this));
		_defineProperty(this, "_done", false);
		_defineProperty(this, "_queuedChunks", null);
		_defineProperty(this, "_requests", []);
		const { pdfDataRangeTransport, disableRange, disableStream } = stream._source;
		const { length, contentDispositionFilename } = pdfDataRangeTransport;
		this._queuedChunks = stream._queuedChunks || [];
		for (const chunk of this._queuedChunks) this._loaded += chunk.byteLength;
		this._done = stream._progressiveDone;
		this._contentLength = length;
		this._isStreamingSupported = !disableStream;
		this._isRangeSupported = !disableRange;
		if (isPdfFile(contentDispositionFilename)) this._filename = contentDispositionFilename;
		this._headersCapability.resolve();
		const loaded = this._loaded;
		Promise.resolve().then(() => {
			if (loaded > 0 && this._loaded === loaded) this._callOnProgress();
		});
	}
	_enqueue(chunk) {
		if (this._done) return;
		if (this._requests.length > 0) this._requests.shift().resolve({
			value: chunk,
			done: false
		});
		else this._queuedChunks.push(chunk);
		this._loaded += chunk.byteLength;
		this._callOnProgress();
	}
	async read() {
		if (this._queuedChunks.length > 0) return {
			value: this._queuedChunks.shift(),
			done: false
		};
		if (this._done) return {
			value: void 0,
			done: true
		};
		const capability = Promise.withResolvers();
		this._requests.push(capability);
		return capability.promise;
	}
	cancel(reason) {
		this._done = true;
		_classPrivateFieldGet2(_endRequests, this).call(this);
	}
	progressiveDone() {
		this._done || (this._done = true);
		if (this._queuedChunks.length === 0) _classPrivateFieldGet2(_endRequests, this).call(this);
	}
};
var _endRequests2 = /* @__PURE__ */ new WeakMap();
var PDFDataTransportStreamRangeReader = class extends BasePDFStreamRangeReader {
	constructor(stream, begin, end) {
		super(stream, begin, end);
		_classPrivateFieldInitSpec(this, _endRequests2, endRequests.bind(this));
		_defineProperty(this, "onDone", null);
		_defineProperty(this, "_begin", -1);
		_defineProperty(this, "_done", false);
		_defineProperty(this, "_queuedChunk", null);
		_defineProperty(this, "_requests", []);
		this._begin = begin;
	}
	_enqueue(chunk) {
		if (this._done) return;
		if (this._requests.length === 0) this._queuedChunk = chunk;
		else {
			this._requests.shift().resolve({
				value: chunk,
				done: false
			});
			_classPrivateFieldGet2(_endRequests2, this).call(this);
		}
		this._done = true;
		this.onDone?.();
	}
	async read() {
		if (this._queuedChunk) {
			const chunk = this._queuedChunk;
			this._queuedChunk = null;
			return {
				value: chunk,
				done: false
			};
		}
		if (this._done) return {
			value: void 0,
			done: true
		};
		const capability = Promise.withResolvers();
		this._requests.push(capability);
		return capability.promise;
	}
	cancel(reason) {
		this._done = true;
		_classPrivateFieldGet2(_endRequests2, this).call(this);
		this.onDone?.();
	}
};
var OK_RESPONSE = 200;
var PARTIAL_CONTENT_RESPONSE = 206;
function network_getArrayBuffer(val) {
	return typeof val !== "string" ? val : stringToBytes(val).buffer;
}
var _pendingRequests = /* @__PURE__ */ new WeakMap();
var _PDFNetworkStream_brand = /* @__PURE__ */ new WeakSet();
var PDFNetworkStream = class extends BasePDFStream {
	constructor(source) {
		super(source, PDFNetworkStreamReader, PDFNetworkStreamRangeReader);
		_classPrivateMethodInitSpec(this, _PDFNetworkStream_brand);
		_classPrivateFieldInitSpec(this, _pendingRequests, /* @__PURE__ */ new WeakMap());
		_defineProperty(this, "_responseOrigin", null);
		const { httpHeaders, url } = source;
		this.url = url;
		this.isHttp = /https?:/.test(url.protocol);
		this.headers = createHeaders(this.isHttp, httpHeaders);
	}
	_request(args) {
		const xhr = new XMLHttpRequest();
		const pendingRequest = {
			validateStatus: null,
			onHeadersReceived: args.onHeadersReceived,
			onDone: args.onDone,
			onError: args.onError,
			onProgress: args.onProgress
		};
		_classPrivateFieldGet2(_pendingRequests, this).set(xhr, pendingRequest);
		xhr.open("GET", this.url);
		xhr.withCredentials = this._source.withCredentials;
		for (const [key, val] of this.headers) xhr.setRequestHeader(key, val);
		if (this.isHttp && "begin" in args && "end" in args) {
			xhr.setRequestHeader("Range", `bytes=${args.begin}-${args.end - 1}`);
			pendingRequest.validateStatus = (status) => status === PARTIAL_CONTENT_RESPONSE || status === OK_RESPONSE;
		} else pendingRequest.validateStatus = (status) => status === OK_RESPONSE;
		xhr.responseType = "arraybuffer";
		assert(args.onError, "Expected `onError` callback to be provided.");
		xhr.onerror = () => args.onError(xhr.status);
		xhr.onreadystatechange = _assertClassBrand(_PDFNetworkStream_brand, this, _onStateChange).bind(this, xhr);
		xhr.onprogress = _assertClassBrand(_PDFNetworkStream_brand, this, _onProgress).bind(this, xhr);
		xhr.send(null);
		return xhr;
	}
	_abortRequest(xhr) {
		if (_classPrivateFieldGet2(_pendingRequests, this).has(xhr)) {
			_classPrivateFieldGet2(_pendingRequests, this).delete(xhr);
			xhr.abort();
		}
	}
	getRangeReader(begin, end) {
		const reader = super.getRangeReader(begin, end);
		if (reader) reader.onClosed = () => this._rangeReaders.delete(reader);
		return reader;
	}
};
function _onProgress(xhr, evt) {
	_classPrivateFieldGet2(_pendingRequests, this).get(xhr)?.onProgress?.(evt);
}
function _onStateChange(xhr, evt) {
	const pendingRequest = _classPrivateFieldGet2(_pendingRequests, this).get(xhr);
	if (!pendingRequest) return;
	if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
		pendingRequest.onHeadersReceived();
		delete pendingRequest.onHeadersReceived;
	}
	if (xhr.readyState !== 4) return;
	if (!_classPrivateFieldGet2(_pendingRequests, this).has(xhr)) return;
	_classPrivateFieldGet2(_pendingRequests, this).delete(xhr);
	if (xhr.status === 0 && this.isHttp) {
		pendingRequest.onError(xhr.status);
		return;
	}
	const xhrStatus = xhr.status || OK_RESPONSE;
	if (!pendingRequest.validateStatus(xhrStatus)) {
		pendingRequest.onError(xhr.status);
		return;
	}
	const chunk = network_getArrayBuffer(xhr.response);
	if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
		const rangeHeader = xhr.getResponseHeader("Content-Range");
		if (/bytes (\d+)-(\d+)\/(\d+)/.test(rangeHeader)) pendingRequest.onDone(chunk);
		else {
			warn(`Missing or invalid "Content-Range" header.`);
			pendingRequest.onError(0);
		}
	} else if (chunk) pendingRequest.onDone(chunk);
	else pendingRequest.onError(xhr.status);
}
var _endRequests3 = /* @__PURE__ */ new WeakMap();
var _PDFNetworkStreamReader_brand = /* @__PURE__ */ new WeakSet();
var PDFNetworkStreamReader = class extends BasePDFStreamReader {
	constructor(stream) {
		super(stream);
		_classPrivateMethodInitSpec(this, _PDFNetworkStreamReader_brand);
		_classPrivateFieldInitSpec(this, _endRequests3, endRequests.bind(this));
		_defineProperty(this, "_cachedChunks", []);
		_defineProperty(this, "_done", false);
		_defineProperty(this, "_requests", []);
		_defineProperty(this, "_storedError", null);
		this._fullRequestXhr = stream._request({
			onHeadersReceived: _assertClassBrand(_PDFNetworkStreamReader_brand, this, _onHeadersReceived).bind(this),
			onDone: _assertClassBrand(_PDFNetworkStreamReader_brand, this, _onDone).bind(this),
			onError: _assertClassBrand(_PDFNetworkStreamReader_brand, this, _onError).bind(this),
			onProgress: _assertClassBrand(_PDFNetworkStreamReader_brand, this, _onProgress2).bind(this)
		});
	}
	async read() {
		await this._headersCapability.promise;
		if (this._storedError) throw this._storedError;
		if (this._cachedChunks.length > 0) return {
			value: this._cachedChunks.shift(),
			done: false
		};
		if (this._done) return {
			value: void 0,
			done: true
		};
		const capability = Promise.withResolvers();
		this._requests.push(capability);
		return capability.promise;
	}
	cancel(reason) {
		this._done = true;
		this._headersCapability.reject(reason);
		_classPrivateFieldGet2(_endRequests3, this).call(this);
		this._stream._abortRequest(this._fullRequestXhr);
		this._fullRequestXhr = null;
	}
};
function _onHeadersReceived() {
	const stream = this._stream;
	const { disableRange, rangeChunkSize } = stream._source;
	const fullRequestXhr = this._fullRequestXhr;
	stream._responseOrigin = getResponseOrigin(fullRequestXhr.responseURL);
	const rawResponseHeaders = fullRequestXhr.getAllResponseHeaders();
	const responseHeaders = new Headers(rawResponseHeaders ? rawResponseHeaders.trimStart().replace(/[^\S ]+$/, "").split(/[\r\n]+/).map((x) => {
		const [key, ...val] = x.split(": ");
		return [key, val.join(": ")];
	}) : []);
	const { contentLength, isRangeSupported } = validateRangeRequestCapabilities({
		responseHeaders,
		isHttp: stream.isHttp,
		rangeChunkSize,
		disableRange
	});
	this._contentLength = contentLength;
	this._isRangeSupported = isRangeSupported;
	this._filename = extractFilenameFromHeader(responseHeaders);
	if (this._isRangeSupported) stream._abortRequest(fullRequestXhr);
	this._headersCapability.resolve();
}
function _onDone(chunk) {
	if (this._requests.length > 0) this._requests.shift().resolve({
		value: chunk,
		done: false
	});
	else this._cachedChunks.push(chunk);
	this._done = true;
	if (this._cachedChunks.length === 0) _classPrivateFieldGet2(_endRequests3, this).call(this);
}
function _onError(status) {
	this._storedError = createResponseError(status, this._stream.url);
	this._headersCapability.reject(this._storedError);
	for (const capability of this._requests) capability.reject(this._storedError);
	this._requests.length = 0;
	this._cachedChunks.length = 0;
}
function _onProgress2(evt) {
	this.onProgress?.({
		loaded: evt.loaded,
		total: evt.lengthComputable ? evt.total : this._contentLength
	});
}
var _endRequests4 = /* @__PURE__ */ new WeakMap();
var _PDFNetworkStreamRangeReader_brand = /* @__PURE__ */ new WeakSet();
var PDFNetworkStreamRangeReader = class extends BasePDFStreamRangeReader {
	constructor(stream, begin, end) {
		super(stream, begin, end);
		_classPrivateMethodInitSpec(this, _PDFNetworkStreamRangeReader_brand);
		_classPrivateFieldInitSpec(this, _endRequests4, endRequests.bind(this));
		_defineProperty(this, "onClosed", null);
		_defineProperty(this, "_done", false);
		_defineProperty(this, "_queuedChunk", null);
		_defineProperty(this, "_requests", []);
		_defineProperty(this, "_storedError", null);
		this._requestXhr = stream._request({
			begin,
			end,
			onHeadersReceived: _assertClassBrand(_PDFNetworkStreamRangeReader_brand, this, _onHeadersReceived2).bind(this),
			onDone: _assertClassBrand(_PDFNetworkStreamRangeReader_brand, this, _onDone2).bind(this),
			onError: _assertClassBrand(_PDFNetworkStreamRangeReader_brand, this, _onError2).bind(this),
			onProgress: null
		});
	}
	async read() {
		if (this._storedError) throw this._storedError;
		if (this._queuedChunk !== null) {
			const chunk = this._queuedChunk;
			this._queuedChunk = null;
			return {
				value: chunk,
				done: false
			};
		}
		if (this._done) return {
			value: void 0,
			done: true
		};
		const capability = Promise.withResolvers();
		this._requests.push(capability);
		return capability.promise;
	}
	cancel(reason) {
		this._done = true;
		_classPrivateFieldGet2(_endRequests4, this).call(this);
		this._stream._abortRequest(this._requestXhr);
		this.onClosed?.();
	}
};
function _onHeadersReceived2() {
	const responseOrigin = getResponseOrigin(this._requestXhr?.responseURL);
	try {
		ensureResponseOrigin(responseOrigin, this._stream._responseOrigin);
	} catch (ex) {
		this._storedError = ex;
		_assertClassBrand(_PDFNetworkStreamRangeReader_brand, this, _onError2).call(this, 0);
	}
}
function _onDone2(chunk) {
	if (this._requests.length > 0) this._requests.shift().resolve({
		value: chunk,
		done: false
	});
	else this._queuedChunk = chunk;
	this._done = true;
	_classPrivateFieldGet2(_endRequests4, this).call(this);
	this.onClosed?.();
}
function _onError2(status) {
	this._storedError ?? (this._storedError = createResponseError(status, this._stream.url));
	for (const capability of this._requests) capability.reject(this._storedError);
	this._requests.length = 0;
	this._queuedChunk = null;
}
function getReadableStream(readStream) {
	const { Readable } = process.getBuiltinModule("stream");
	if (typeof Readable.toWeb === "function") return Readable.toWeb(readStream);
	return process.getBuiltinModule("module").createRequire(import.meta.url)("node-readable-to-web-readable-stream").makeDefaultReadableStreamFromNodeReadable(readStream);
}
var PDFNodeStream = class extends BasePDFStream {
	constructor(source) {
		super(source, PDFNodeStreamReader, PDFNodeStreamRangeReader);
		const { url } = source;
		assert(url.protocol === "file:", "PDFNodeStream only supports file:// URLs.");
	}
};
var PDFNodeStreamReader = class extends BasePDFStreamReader {
	constructor(stream) {
		super(stream);
		_defineProperty(this, "_reader", null);
		const { disableRange, disableStream, rangeChunkSize, url } = stream._source;
		this._isStreamingSupported = !disableStream;
		const fs = process.getBuiltinModule("fs");
		fs.promises.lstat(url).then((stat) => {
			const readableStream = getReadableStream(fs.createReadStream(url));
			this._reader = readableStream.getReader();
			const { size } = stat;
			this._contentLength = size;
			this._isRangeSupported = !disableRange && size > 2 * rangeChunkSize;
			if (!this._isStreamingSupported && this._isRangeSupported) this.cancel(new AbortException("Streaming is disabled."));
			this._headersCapability.resolve();
		}).catch((error) => {
			if (error.code === "ENOENT") error = createResponseError(0, url);
			this._headersCapability.reject(error);
		});
	}
	async read() {
		await this._headersCapability.promise;
		const { value, done } = await this._reader.read();
		if (done) return {
			value,
			done
		};
		this._loaded += value.byteLength;
		this._callOnProgress();
		return {
			value: getArrayBuffer(value),
			done: false
		};
	}
	cancel(reason) {
		this._reader?.cancel(reason);
	}
};
var PDFNodeStreamRangeReader = class extends BasePDFStreamRangeReader {
	constructor(stream, begin, end) {
		super(stream, begin, end);
		_defineProperty(this, "_readCapability", Promise.withResolvers());
		_defineProperty(this, "_reader", null);
		const { url } = stream._source;
		const fs = process.getBuiltinModule("fs");
		try {
			const readableStream = getReadableStream(fs.createReadStream(url, {
				start: begin,
				end: end - 1
			}));
			this._reader = readableStream.getReader();
			this._readCapability.resolve();
		} catch (error) {
			this._readCapability.reject(error);
		}
	}
	async read() {
		await this._readCapability.promise;
		const { value, done } = await this._reader.read();
		if (done) return {
			value,
			done
		};
		return {
			value: getArrayBuffer(value),
			done: false
		};
	}
	cancel(reason) {
		this._reader?.cancel(reason);
	}
};
function getNetworkStream(url) {
	return isValidFetchUrl(url) ? PDFFetchStream : isNodeJS ? PDFNodeStream : PDFNetworkStream;
}
var GlobalWorkerOptions = class GlobalWorkerOptions {
	static get workerPort() {
		return _assertClassBrand(GlobalWorkerOptions, this, _port)._;
	}
	static set workerPort(val) {
		if (!(typeof Worker !== "undefined" && val instanceof Worker) && val !== null) throw new Error("Invalid `workerPort` type.");
		_port._ = _assertClassBrand(GlobalWorkerOptions, this, val);
	}
	static get workerSrc() {
		return _assertClassBrand(GlobalWorkerOptions, this, _src)._;
	}
	static set workerSrc(val) {
		if (typeof val !== "string") throw new Error("Invalid `workerSrc` type.");
		_src._ = _assertClassBrand(GlobalWorkerOptions, this, val);
	}
};
var _port = { _: null };
var _src = { _: "" };
var _map = /* @__PURE__ */ new WeakMap();
var _data2 = /* @__PURE__ */ new WeakMap();
_Symbol$iterator2 = Symbol.iterator;
var Metadata = class {
	constructor({ parsedData, rawData }) {
		_classPrivateFieldInitSpec(this, _map, void 0);
		_classPrivateFieldInitSpec(this, _data2, void 0);
		_classPrivateFieldSet2(_map, this, parsedData);
		_classPrivateFieldSet2(_data2, this, rawData);
	}
	getRaw() {
		return _classPrivateFieldGet2(_data2, this);
	}
	get(name) {
		return _classPrivateFieldGet2(_map, this).get(name) ?? null;
	}
	[_Symbol$iterator2]() {
		return _classPrivateFieldGet2(_map, this).entries();
	}
};
var INTERNAL = Symbol("INTERNAL");
var _isDisplay = /* @__PURE__ */ new WeakMap();
var _isPrint = /* @__PURE__ */ new WeakMap();
var _userSet = /* @__PURE__ */ new WeakMap();
var _visible = /* @__PURE__ */ new WeakMap();
var OptionalContentGroup = class {
	constructor(renderingIntent, { name, intent, usage, rbGroups }) {
		_classPrivateFieldInitSpec(this, _isDisplay, false);
		_classPrivateFieldInitSpec(this, _isPrint, false);
		_classPrivateFieldInitSpec(this, _userSet, false);
		_classPrivateFieldInitSpec(this, _visible, true);
		_classPrivateFieldSet2(_isDisplay, this, !!(renderingIntent & RenderingIntentFlag.DISPLAY));
		_classPrivateFieldSet2(_isPrint, this, !!(renderingIntent & RenderingIntentFlag.PRINT));
		this.name = name;
		this.intent = intent;
		this.usage = usage;
		this.rbGroups = rbGroups;
	}
	get visible() {
		if (_classPrivateFieldGet2(_userSet, this)) return _classPrivateFieldGet2(_visible, this);
		if (!_classPrivateFieldGet2(_visible, this)) return false;
		const { print, view } = this.usage;
		if (_classPrivateFieldGet2(_isDisplay, this)) return view?.viewState !== "OFF";
		else if (_classPrivateFieldGet2(_isPrint, this)) return print?.printState !== "OFF";
		return true;
	}
	_setVisible(internal, visible, userSet = false) {
		if (internal !== INTERNAL) unreachable("Internal method `_setVisible` called.");
		_classPrivateFieldSet2(_userSet, this, userSet);
		_classPrivateFieldSet2(_visible, this, visible);
	}
};
var _cachedGetHash = /* @__PURE__ */ new WeakMap();
var _groups = /* @__PURE__ */ new WeakMap();
var _initialHash = /* @__PURE__ */ new WeakMap();
var _order = /* @__PURE__ */ new WeakMap();
var _OptionalContentConfig_brand = /* @__PURE__ */ new WeakSet();
_Symbol$iterator3 = Symbol.iterator;
var OptionalContentConfig = class {
	constructor(data, renderingIntent = RenderingIntentFlag.DISPLAY) {
		_classPrivateMethodInitSpec(this, _OptionalContentConfig_brand);
		_classPrivateFieldInitSpec(this, _cachedGetHash, null);
		_classPrivateFieldInitSpec(this, _groups, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _initialHash, null);
		_classPrivateFieldInitSpec(this, _order, null);
		this.renderingIntent = renderingIntent;
		this.name = null;
		this.creator = null;
		if (data === null) return;
		this.name = data.name;
		this.creator = data.creator;
		_classPrivateFieldSet2(_order, this, data.order);
		for (const group of data.groups) _classPrivateFieldGet2(_groups, this).set(group.id, new OptionalContentGroup(renderingIntent, group));
		if (data.baseState === "OFF") for (const group of _classPrivateFieldGet2(_groups, this).values()) group._setVisible(INTERNAL, false);
		for (const on of data.on) _classPrivateFieldGet2(_groups, this).get(on)._setVisible(INTERNAL, true);
		for (const off of data.off) _classPrivateFieldGet2(_groups, this).get(off)._setVisible(INTERNAL, false);
		_classPrivateFieldSet2(_initialHash, this, this.getHash());
	}
	isVisible(group) {
		if (_classPrivateFieldGet2(_groups, this).size === 0) return true;
		if (!group) {
			info("Optional content group not defined.");
			return true;
		}
		if (group.type === "OCG") {
			if (!_classPrivateFieldGet2(_groups, this).has(group.id)) {
				warn(`Optional content group not found: ${group.id}`);
				return true;
			}
			return _classPrivateFieldGet2(_groups, this).get(group.id).visible;
		} else if (group.type === "OCMD") {
			if (group.expression) return _assertClassBrand(_OptionalContentConfig_brand, this, _evaluateVisibilityExpression).call(this, group.expression);
			if (!group.policy || group.policy === "AnyOn") {
				for (const id of group.ids) {
					if (!_classPrivateFieldGet2(_groups, this).has(id)) {
						warn(`Optional content group not found: ${id}`);
						return true;
					}
					if (_classPrivateFieldGet2(_groups, this).get(id).visible) return true;
				}
				return false;
			} else if (group.policy === "AllOn") {
				for (const id of group.ids) {
					if (!_classPrivateFieldGet2(_groups, this).has(id)) {
						warn(`Optional content group not found: ${id}`);
						return true;
					}
					if (!_classPrivateFieldGet2(_groups, this).get(id).visible) return false;
				}
				return true;
			} else if (group.policy === "AnyOff") {
				for (const id of group.ids) {
					if (!_classPrivateFieldGet2(_groups, this).has(id)) {
						warn(`Optional content group not found: ${id}`);
						return true;
					}
					if (!_classPrivateFieldGet2(_groups, this).get(id).visible) return true;
				}
				return false;
			} else if (group.policy === "AllOff") {
				for (const id of group.ids) {
					if (!_classPrivateFieldGet2(_groups, this).has(id)) {
						warn(`Optional content group not found: ${id}`);
						return true;
					}
					if (_classPrivateFieldGet2(_groups, this).get(id).visible) return false;
				}
				return true;
			}
			warn(`Unknown optional content policy ${group.policy}.`);
			return true;
		}
		warn(`Unknown group type ${group.type}.`);
		return true;
	}
	setVisibility(id, visible = true, preserveRB = true) {
		const group = _classPrivateFieldGet2(_groups, this).get(id);
		if (!group) {
			warn(`Optional content group not found: ${id}`);
			return;
		}
		if (preserveRB && visible && group.rbGroups.length) {
			for (const rbGroup of group.rbGroups) for (const otherId of rbGroup) if (otherId !== id) _classPrivateFieldGet2(_groups, this).get(otherId)?._setVisible(INTERNAL, false, true);
		}
		group._setVisible(INTERNAL, !!visible, true);
		_classPrivateFieldSet2(_cachedGetHash, this, null);
	}
	setOCGState({ state, preserveRB }) {
		let operator;
		for (const elem of state) {
			switch (elem) {
				case "ON":
				case "OFF":
				case "Toggle":
					operator = elem;
					continue;
			}
			const group = _classPrivateFieldGet2(_groups, this).get(elem);
			if (!group) continue;
			switch (operator) {
				case "ON":
					this.setVisibility(elem, true, preserveRB);
					break;
				case "OFF":
					this.setVisibility(elem, false, preserveRB);
					break;
				case "Toggle":
					this.setVisibility(elem, !group.visible, preserveRB);
					break;
			}
		}
		_classPrivateFieldSet2(_cachedGetHash, this, null);
	}
	get hasInitialVisibility() {
		return _classPrivateFieldGet2(_initialHash, this) === null || this.getHash() === _classPrivateFieldGet2(_initialHash, this);
	}
	getOrder() {
		if (!_classPrivateFieldGet2(_groups, this).size) return null;
		if (_classPrivateFieldGet2(_order, this)) return _classPrivateFieldGet2(_order, this).slice();
		return [..._classPrivateFieldGet2(_groups, this).keys()];
	}
	getGroup(id) {
		return _classPrivateFieldGet2(_groups, this).get(id) || null;
	}
	getHash() {
		if (_classPrivateFieldGet2(_cachedGetHash, this) !== null) return _classPrivateFieldGet2(_cachedGetHash, this);
		const hash = new MurmurHash3_64();
		for (const [id, group] of _classPrivateFieldGet2(_groups, this)) hash.update(`${id}:${group.visible}`);
		return _classPrivateFieldSet2(_cachedGetHash, this, hash.hexdigest());
	}
	[_Symbol$iterator3]() {
		return _classPrivateFieldGet2(_groups, this).entries();
	}
};
function _evaluateVisibilityExpression(array) {
	const length = array.length;
	if (length < 2) return true;
	const operator = array[0];
	for (let i = 1; i < length; i++) {
		const element = array[i];
		let state;
		if (Array.isArray(element)) state = _assertClassBrand(_OptionalContentConfig_brand, this, _evaluateVisibilityExpression).call(this, element);
		else if (_classPrivateFieldGet2(_groups, this).has(element)) state = _classPrivateFieldGet2(_groups, this).get(element).visible;
		else {
			warn(`Optional content group not found: ${element}`);
			return true;
		}
		switch (operator) {
			case "And":
				if (!state) return false;
				break;
			case "Or":
				if (state) return true;
				break;
			case "Not": return !state;
			default: return true;
		}
	}
	return operator === "And";
}
var _pageNumberToId = /* @__PURE__ */ new WeakMap();
var _prevPageNumbers = /* @__PURE__ */ new WeakMap();
var _pagesNumber = /* @__PURE__ */ new WeakMap();
var _clipboard = /* @__PURE__ */ new WeakMap();
var _savedData = /* @__PURE__ */ new WeakMap();
var _PagesMapper_brand = /* @__PURE__ */ new WeakSet();
var PagesMapper = class {
	constructor() {
		_classPrivateMethodInitSpec(this, _PagesMapper_brand);
		_classPrivateFieldInitSpec(this, _pageNumberToId, null);
		_classPrivateFieldInitSpec(this, _prevPageNumbers, null);
		_classPrivateFieldInitSpec(this, _pagesNumber, 0);
		_classPrivateFieldInitSpec(this, _clipboard, null);
		_classPrivateFieldInitSpec(this, _savedData, null);
	}
	get pagesNumber() {
		return _classPrivateFieldGet2(_pagesNumber, this);
	}
	set pagesNumber(n) {
		if (_classPrivateFieldGet2(_pagesNumber, this) === n) return;
		_classPrivateFieldSet2(_pagesNumber, this, n);
		_classPrivateFieldSet2(_pageNumberToId, this, null);
		_classPrivateFieldSet2(_prevPageNumbers, this, null);
	}
	movePages(selectedPages, pagesToMove, index) {
		_assertClassBrand(_PagesMapper_brand, this, _ensureInit).call(this);
		const pageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
		const prevIdToPageNumber = _assertClassBrand(_PagesMapper_brand, this, _buildIdToPageNumber).call(this);
		const movedCount = pagesToMove.length;
		const mappedPagesToMove = new Uint32Array(movedCount);
		let removedBeforeTarget = 0;
		for (let i = 0; i < movedCount; i++) {
			const pageIndex = pagesToMove[i] - 1;
			mappedPagesToMove[i] = pageNumberToId[pageIndex];
			if (pageIndex < index) removedBeforeTarget++;
		}
		const pagesNumber = _classPrivateFieldGet2(_pagesNumber, this);
		const remainingLen = pagesNumber - movedCount;
		const adjustedTarget = MathClamp(index - removedBeforeTarget, 0, remainingLen);
		for (let i = 0, r = 0; i < pagesNumber; i++) if (!selectedPages.has(i + 1)) pageNumberToId[r++] = pageNumberToId[i];
		pageNumberToId.copyWithin(adjustedTarget + movedCount, adjustedTarget, remainingLen);
		pageNumberToId.set(mappedPagesToMove, adjustedTarget);
		_assertClassBrand(_PagesMapper_brand, this, _updatePrevPageNumbers).call(this, prevIdToPageNumber);
		if (pageNumberToId.every((id, i) => id === i + 1)) _classPrivateFieldSet2(_pageNumberToId, this, null);
	}
	deletePages(pagesToDelete) {
		_assertClassBrand(_PagesMapper_brand, this, _ensureInit).call(this);
		const pageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
		const prevIdToPageNumber = _assertClassBrand(_PagesMapper_brand, this, _buildIdToPageNumber).call(this);
		_classPrivateFieldSet2(_savedData, this, {
			pageNumberToId: pageNumberToId.slice(),
			pagesNumber: _classPrivateFieldGet2(_pagesNumber, this),
			prevPageNumbers: _classPrivateFieldGet2(_prevPageNumbers, this).slice()
		});
		const newN = _classPrivateFieldGet2(_pagesNumber, this) - pagesToDelete.length;
		_classPrivateFieldSet2(_pagesNumber, this, newN);
		const newPageNumberToId = _classPrivateFieldSet2(_pageNumberToId, this, new Uint32Array(newN));
		_classPrivateFieldSet2(_prevPageNumbers, this, new Int32Array(newN));
		let sourceIndex = 0;
		let destIndex = 0;
		for (const pageNumber of pagesToDelete) {
			const pageIndex = pageNumber - 1;
			if (pageIndex !== sourceIndex) {
				newPageNumberToId.set(pageNumberToId.subarray(sourceIndex, pageIndex), destIndex);
				destIndex += pageIndex - sourceIndex;
			}
			sourceIndex = pageIndex + 1;
		}
		if (sourceIndex < pageNumberToId.length) newPageNumberToId.set(pageNumberToId.subarray(sourceIndex), destIndex);
		_assertClassBrand(_PagesMapper_brand, this, _updatePrevPageNumbers).call(this, prevIdToPageNumber, new Set(pagesToDelete));
	}
	cancelDelete() {
		if (_classPrivateFieldGet2(_savedData, this)) {
			_classPrivateFieldSet2(_pageNumberToId, this, _classPrivateFieldGet2(_savedData, this).pageNumberToId);
			_classPrivateFieldSet2(_pagesNumber, this, _classPrivateFieldGet2(_savedData, this).pagesNumber);
			_classPrivateFieldSet2(_prevPageNumbers, this, _classPrivateFieldGet2(_savedData, this).prevPageNumbers);
			_classPrivateFieldSet2(_savedData, this, null);
		}
	}
	cleanSavedData() {
		_classPrivateFieldSet2(_savedData, this, null);
	}
	copyPages(pagesToCopy) {
		_assertClassBrand(_PagesMapper_brand, this, _ensureInit).call(this);
		_classPrivateFieldSet2(_clipboard, this, {
			pageNumbers: pagesToCopy,
			pageIds: pagesToCopy.map((n) => _classPrivateFieldGet2(_pageNumberToId, this)[n - 1])
		});
	}
	cancelCopy() {
		_classPrivateFieldSet2(_clipboard, this, null);
	}
	pastePages(index) {
		_assertClassBrand(_PagesMapper_brand, this, _ensureInit).call(this);
		const pageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
		const prevIdToPageNumber = _assertClassBrand(_PagesMapper_brand, this, _buildIdToPageNumber).call(this);
		const { pageNumbers: copiedPageNumbers, pageIds: copiedPageIds } = _classPrivateFieldGet2(_clipboard, this);
		const newN = _classPrivateFieldGet2(_pagesNumber, this) + copiedPageNumbers.length;
		_classPrivateFieldSet2(_pagesNumber, this, newN);
		const newPageNumberToId = _classPrivateFieldSet2(_pageNumberToId, this, new Uint32Array(newN));
		_classPrivateFieldSet2(_prevPageNumbers, this, new Int32Array(newN));
		newPageNumberToId.set(pageNumberToId.subarray(0, index), 0);
		newPageNumberToId.set(copiedPageIds, index);
		newPageNumberToId.set(pageNumberToId.subarray(index), index + copiedPageNumbers.length);
		_assertClassBrand(_PagesMapper_brand, this, _updatePrevPageNumbers).call(this, prevIdToPageNumber, null, index, copiedPageNumbers);
		_classPrivateFieldSet2(_clipboard, this, null);
	}
	hasBeenAltered() {
		return _classPrivateFieldGet2(_pageNumberToId, this) !== null;
	}
	getPageMappingForSaving(idToPageNumber = null) {
		idToPageNumber ?? (idToPageNumber = _assertClassBrand(_PagesMapper_brand, this, _buildIdToPageNumber).call(this));
		let nCopy = 0;
		for (const pageNumbers of idToPageNumber.values()) nCopy = Math.max(nCopy, pageNumbers.length);
		const extractParams = new Array(nCopy);
		for (let i = 0; i < nCopy; i++) extractParams[i] = {
			document: null,
			pageIndices: [],
			includePages: []
		};
		for (const [id, pageNumbers] of idToPageNumber) for (let i = 0, ii = pageNumbers.length; i < ii; i++) extractParams[i].includePages.push([id - 1, pageNumbers[i] - 1]);
		for (const { includePages, pageIndices } of extractParams) {
			includePages.sort((a, b) => a[0] - b[0]);
			for (let i = 0, ii = includePages.length; i < ii; i++) {
				pageIndices.push(includePages[i][1]);
				includePages[i] = includePages[i][0];
			}
		}
		return extractParams;
	}
	extractPages(extractedPageNumbers) {
		extractedPageNumbers = Array.from(extractedPageNumbers).sort((a, b) => a - b);
		const usedIds = /* @__PURE__ */ new Map();
		for (let i = 0, ii = extractedPageNumbers.length; i < ii; i++) {
			const id = this.getPageId(extractedPageNumbers[i]);
			usedIds.getOrInsertComputed(id, makeArr).push(i + 1);
		}
		return this.getPageMappingForSaving(usedIds);
	}
	getPrevPageNumber(pageNumber) {
		return _classPrivateFieldGet2(_prevPageNumbers, this)?.[pageNumber - 1] ?? 0;
	}
	getPageNumber(id) {
		if (!_classPrivateFieldGet2(_pageNumberToId, this)) return id;
		const pageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
		for (let i = 0, ii = _classPrivateFieldGet2(_pagesNumber, this); i < ii; i++) if (pageNumberToId[i] === id) return i + 1;
		return 0;
	}
	getPageId(pageNumber) {
		return _classPrivateFieldGet2(_pageNumberToId, this)?.[pageNumber - 1] ?? pageNumber;
	}
	getMapping() {
		return _classPrivateFieldGet2(_pageNumberToId, this)?.subarray(0, this.pagesNumber);
	}
};
function _ensureInit() {
	if (_classPrivateFieldGet2(_pageNumberToId, this)) return;
	const n = _classPrivateFieldGet2(_pagesNumber, this);
	const pageNumberToId = _classPrivateFieldSet2(_pageNumberToId, this, new Uint32Array(n));
	for (let i = 0; i < n; i++) pageNumberToId[i] = i + 1;
	_classPrivateFieldSet2(_prevPageNumbers, this, new Int32Array(pageNumberToId));
}
function _buildIdToPageNumber() {
	const idToPageNumber = /* @__PURE__ */ new Map();
	const pageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
	for (let i = 0, ii = _classPrivateFieldGet2(_pagesNumber, this); i < ii; i++) {
		const id = pageNumberToId[i];
		const pageNumbers = idToPageNumber.get(id);
		if (pageNumbers) pageNumbers.push(i + 1);
		else idToPageNumber.set(id, [i + 1]);
	}
	return idToPageNumber;
}
function _updatePrevPageNumbers(prevIdToPageNumber, deletedPageNumbers = null, pasteIndex = -1, copiedPageNumbers = null) {
	const prevPageNumbers = _classPrivateFieldGet2(_prevPageNumbers, this);
	const newPageNumberToId = _classPrivateFieldGet2(_pageNumberToId, this);
	const pasteEnd = pasteIndex + (copiedPageNumbers?.length ?? 0);
	const idsIndices = /* @__PURE__ */ new Map();
	for (let i = 0, ii = _classPrivateFieldGet2(_pagesNumber, this); i < ii; i++) {
		if (i >= pasteIndex && i < pasteEnd) {
			prevPageNumbers[i] = -copiedPageNumbers[i - pasteIndex];
			continue;
		}
		const id = newPageNumberToId[i];
		const oldPositions = prevIdToPageNumber.get(id);
		let j = idsIndices.get(id) || 0;
		if (deletedPageNumbers && oldPositions) while (j < oldPositions.length && deletedPageNumbers.has(oldPositions[j])) j++;
		prevPageNumbers[i] = oldPositions?.[j];
		idsIndices.set(id, j + 1);
	}
}
var INITIAL_DATA = Symbol("INITIAL_DATA");
var dataObj = () => ({
	...Promise.withResolvers(),
	data: INITIAL_DATA
});
var _objs = /* @__PURE__ */ new WeakMap();
_Symbol$iterator4 = Symbol.iterator;
var PDFObjects = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _objs, /* @__PURE__ */ new Map());
	}
	get(objId, callback = null) {
		if (callback) {
			const obj = _classPrivateFieldGet2(_objs, this).getOrInsertComputed(objId, dataObj);
			obj.promise.then(() => callback(obj.data));
			return null;
		}
		const obj = _classPrivateFieldGet2(_objs, this).get(objId);
		if (!obj || obj.data === INITIAL_DATA) throw new Error(`Requesting object that isn't resolved yet ${objId}.`);
		return obj.data;
	}
	has(objId) {
		const obj = _classPrivateFieldGet2(_objs, this).get(objId);
		return !!obj && obj.data !== INITIAL_DATA;
	}
	delete(objId) {
		const obj = _classPrivateFieldGet2(_objs, this).get(objId);
		if (!obj || obj.data === INITIAL_DATA) return false;
		_classPrivateFieldGet2(_objs, this).delete(objId);
		return true;
	}
	resolve(objId, data = null) {
		const obj = _classPrivateFieldGet2(_objs, this).getOrInsertComputed(objId, dataObj);
		if (obj.data !== INITIAL_DATA) throw new Error(`Object already resolved ${objId}.`);
		obj.data = data;
		obj.resolve();
	}
	clear() {
		for (const { data } of _classPrivateFieldGet2(_objs, this).values()) data?.bitmap?.close();
		_classPrivateFieldGet2(_objs, this).clear();
	}
	*[_Symbol$iterator4]() {
		for (const [objId, { data }] of _classPrivateFieldGet2(_objs, this)) if (data !== INITIAL_DATA) yield [objId, data];
	}
};
var MAX_TEXT_DIVS_TO_RENDER = 1e5;
var DEFAULT_FONT_SIZE = 30;
var _capability = /* @__PURE__ */ new WeakMap();
var _container3 = /* @__PURE__ */ new WeakMap();
var _disableProcessItems = /* @__PURE__ */ new WeakMap();
var _fontInspectorEnabled = /* @__PURE__ */ new WeakMap();
var _imagesHandler = /* @__PURE__ */ new WeakMap();
var _lang = /* @__PURE__ */ new WeakMap();
var _layoutTextParams = /* @__PURE__ */ new WeakMap();
var _pageHeight2 = /* @__PURE__ */ new WeakMap();
var _pageWidth2 = /* @__PURE__ */ new WeakMap();
var _reader = /* @__PURE__ */ new WeakMap();
var _rootContainer = /* @__PURE__ */ new WeakMap();
var _rotation2 = /* @__PURE__ */ new WeakMap();
var _scale = /* @__PURE__ */ new WeakMap();
var _styleCache = /* @__PURE__ */ new WeakMap();
var _textContentItemsStr = /* @__PURE__ */ new WeakMap();
var _textContentSource = /* @__PURE__ */ new WeakMap();
var _textDivs = /* @__PURE__ */ new WeakMap();
var _textDivProperties = /* @__PURE__ */ new WeakMap();
var _transform = /* @__PURE__ */ new WeakMap();
var _TextLayer_brand = /* @__PURE__ */ new WeakSet();
var TextLayer = class TextLayer {
	constructor({ textContentSource, images, container, viewport }) {
		_classPrivateMethodInitSpec(this, _TextLayer_brand);
		_classPrivateFieldInitSpec(this, _capability, Promise.withResolvers());
		_classPrivateFieldInitSpec(this, _container3, null);
		_classPrivateFieldInitSpec(this, _disableProcessItems, false);
		_classPrivateFieldInitSpec(this, _fontInspectorEnabled, !!globalThis.FontInspector?.enabled);
		_classPrivateFieldInitSpec(this, _imagesHandler, null);
		_classPrivateFieldInitSpec(this, _lang, null);
		_classPrivateFieldInitSpec(this, _layoutTextParams, null);
		_classPrivateFieldInitSpec(this, _pageHeight2, 0);
		_classPrivateFieldInitSpec(this, _pageWidth2, 0);
		_classPrivateFieldInitSpec(this, _reader, null);
		_classPrivateFieldInitSpec(this, _rootContainer, null);
		_classPrivateFieldInitSpec(this, _rotation2, 0);
		_classPrivateFieldInitSpec(this, _scale, 0);
		_classPrivateFieldInitSpec(this, _styleCache, Object.create(null));
		_classPrivateFieldInitSpec(this, _textContentItemsStr, []);
		_classPrivateFieldInitSpec(this, _textContentSource, null);
		_classPrivateFieldInitSpec(this, _textDivs, []);
		_classPrivateFieldInitSpec(this, _textDivProperties, /* @__PURE__ */ new WeakMap());
		_classPrivateFieldInitSpec(this, _transform, null);
		if (textContentSource instanceof ReadableStream) _classPrivateFieldSet2(_textContentSource, this, textContentSource);
		else if (typeof textContentSource === "object") _classPrivateFieldSet2(_textContentSource, this, new ReadableStream({ start(controller) {
			controller.enqueue(textContentSource);
			controller.close();
		} }));
		else throw new Error("No \"textContentSource\" parameter specified.");
		_classPrivateFieldSet2(_container3, this, _classPrivateFieldSet2(_rootContainer, this, container));
		_classPrivateFieldSet2(_imagesHandler, this, images);
		_classPrivateFieldSet2(_scale, this, viewport.scale * OutputScale.pixelRatio);
		_classPrivateFieldSet2(_rotation2, this, viewport.rotation);
		_classPrivateFieldSet2(_layoutTextParams, this, {
			div: null,
			properties: null,
			ctx: null
		});
		const { pageWidth, pageHeight, pageX, pageY } = viewport.rawDims;
		_classPrivateFieldSet2(_transform, this, [
			1,
			0,
			0,
			-1,
			-pageX,
			pageY + pageHeight
		]);
		_classPrivateFieldSet2(_pageWidth2, this, pageWidth);
		_classPrivateFieldSet2(_pageHeight2, this, pageHeight);
		_ensureMinFontSizeComputed.call(TextLayer);
		container.style.setProperty("--min-font-size", _minFontSize._);
		setLayerDimensions(container, viewport);
		_classPrivateFieldGet2(_capability, this).promise.finally(() => {
			_pendingTextLayers._.delete(this);
			_classPrivateFieldSet2(_layoutTextParams, this, null);
			_classPrivateFieldSet2(_styleCache, this, null);
		}).catch(() => {});
	}
	static get fontFamilyMap() {
		const { isWindows, isFirefox } = FeatureTest.platform;
		return shadow(this, "fontFamilyMap", /* @__PURE__ */ new Map([["sans-serif", `${isWindows && isFirefox ? "Calibri, " : ""}sans-serif`], ["monospace", `${isWindows && isFirefox ? "Lucida Console, " : ""}monospace`]]));
	}
	render() {
		if (_classPrivateFieldGet2(_imagesHandler, this)) _classPrivateFieldGet2(_container3, this).append(_classPrivateFieldGet2(_imagesHandler, this).render());
		const pump = () => {
			_classPrivateFieldGet2(_reader, this).read().then(({ value, done }) => {
				if (done) {
					_classPrivateFieldGet2(_capability, this).resolve();
					return;
				}
				_classPrivateFieldGet2(_lang, this) ?? _classPrivateFieldSet2(_lang, this, value.lang);
				Object.assign(_classPrivateFieldGet2(_styleCache, this), value.styles);
				_assertClassBrand(_TextLayer_brand, this, _processItems).call(this, value.items);
				pump();
			}, _classPrivateFieldGet2(_capability, this).reject);
		};
		_classPrivateFieldSet2(_reader, this, _classPrivateFieldGet2(_textContentSource, this).getReader());
		_pendingTextLayers._.add(this);
		pump();
		return _classPrivateFieldGet2(_capability, this).promise;
	}
	update({ viewport, onBefore = null }) {
		const scale = viewport.scale * OutputScale.pixelRatio;
		const rotation = viewport.rotation;
		if (rotation !== _classPrivateFieldGet2(_rotation2, this)) {
			onBefore?.();
			_classPrivateFieldSet2(_rotation2, this, rotation);
			setLayerDimensions(_classPrivateFieldGet2(_rootContainer, this), { rotation });
		}
		if (scale !== _classPrivateFieldGet2(_scale, this)) {
			onBefore?.();
			_classPrivateFieldSet2(_scale, this, scale);
			const params = {
				div: null,
				properties: null,
				ctx: _getCtx.call(TextLayer, _classPrivateFieldGet2(_lang, this))
			};
			for (const div of _classPrivateFieldGet2(_textDivs, this)) {
				params.properties = _classPrivateFieldGet2(_textDivProperties, this).get(div);
				params.div = div;
				_assertClassBrand(_TextLayer_brand, this, _layout).call(this, params);
			}
		}
	}
	cancel() {
		const abortEx = new AbortException("TextLayer task cancelled.");
		_classPrivateFieldGet2(_reader, this)?.cancel(abortEx).catch(() => {});
		_classPrivateFieldSet2(_reader, this, null);
		_classPrivateFieldGet2(_capability, this).reject(abortEx);
	}
	get textDivs() {
		return _classPrivateFieldGet2(_textDivs, this);
	}
	get textContentItemsStr() {
		return _classPrivateFieldGet2(_textContentItemsStr, this);
	}
	static cleanup() {
		if (_assertClassBrand(TextLayer, this, _pendingTextLayers)._.size > 0) return;
		_assertClassBrand(TextLayer, this, _ascentCache)._.clear();
		for (const { canvas } of _assertClassBrand(TextLayer, this, _canvasContexts)._.values()) canvas.remove();
		_assertClassBrand(TextLayer, this, _canvasContexts)._.clear();
	}
};
_TextLayer = TextLayer;
function _processItems(items) {
	var _this$layoutTextParam;
	if (_classPrivateFieldGet2(_disableProcessItems, this)) return;
	(_this$layoutTextParam = _classPrivateFieldGet2(_layoutTextParams, this)).ctx ?? (_this$layoutTextParam.ctx = _getCtx.call(_TextLayer, _classPrivateFieldGet2(_lang, this)));
	const textDivs = _classPrivateFieldGet2(_textDivs, this), textContentItemsStr = _classPrivateFieldGet2(_textContentItemsStr, this);
	for (const item of items) {
		if (textDivs.length > MAX_TEXT_DIVS_TO_RENDER) {
			warn("Ignoring additional textDivs for performance reasons.");
			_classPrivateFieldSet2(_disableProcessItems, this, true);
			return;
		}
		if (item.str === void 0) {
			if (item.type === "beginMarkedContentProps" || item.type === "beginMarkedContent") {
				const parent = _classPrivateFieldGet2(_container3, this);
				_classPrivateFieldSet2(_container3, this, document.createElement("span"));
				_classPrivateFieldGet2(_container3, this).classList.add("markedContent");
				if (item.id) _classPrivateFieldGet2(_container3, this).setAttribute("id", `${item.id}`);
				if (item.tag === "Artifact") _classPrivateFieldGet2(_container3, this).ariaHidden = true;
				parent.append(_classPrivateFieldGet2(_container3, this));
			} else if (item.type === "endMarkedContent") _classPrivateFieldSet2(_container3, this, _classPrivateFieldGet2(_container3, this).parentNode);
			continue;
		}
		textContentItemsStr.push(item.str);
		_assertClassBrand(_TextLayer_brand, this, _appendText).call(this, item);
	}
}
function _appendText(geom) {
	const textDiv = document.createElement("span");
	const textDivProperties = {
		angle: 0,
		canvasWidth: 0,
		hasText: geom.str !== "",
		hasEOL: geom.hasEOL,
		fontSize: 0
	};
	_classPrivateFieldGet2(_textDivs, this).push(textDiv);
	const tx = Util.transform(_classPrivateFieldGet2(_transform, this), geom.transform);
	let angle = Math.atan2(tx[1], tx[0]);
	const style = _classPrivateFieldGet2(_styleCache, this)[geom.fontName];
	if (style.vertical) angle += Math.PI / 2;
	let fontFamily = _classPrivateFieldGet2(_fontInspectorEnabled, this) && style.fontSubstitution || style.fontFamily;
	fontFamily = _TextLayer.fontFamilyMap.get(fontFamily) || fontFamily;
	const fontHeight = Math.hypot(tx[2], tx[3]);
	const fontAscent = fontHeight * _getAscent.call(_TextLayer, fontFamily, style, _classPrivateFieldGet2(_lang, this));
	let left, top;
	if (angle === 0) {
		left = tx[4];
		top = tx[5] - fontAscent;
	} else {
		left = tx[4] + fontAscent * Math.sin(angle);
		top = tx[5] - fontAscent * Math.cos(angle);
	}
	const divStyle = textDiv.style;
	divStyle.left = `${(100 * left / _classPrivateFieldGet2(_pageWidth2, this)).toFixed(2)}%`;
	divStyle.top = `${(100 * top / _classPrivateFieldGet2(_pageHeight2, this)).toFixed(2)}%`;
	divStyle.setProperty("--font-height", `${fontHeight.toFixed(2)}px`);
	divStyle.fontFamily = fontFamily;
	textDivProperties.fontSize = fontHeight;
	textDiv.setAttribute("role", "presentation");
	textDiv.textContent = geom.str;
	textDiv.dir = geom.dir;
	if (_classPrivateFieldGet2(_fontInspectorEnabled, this)) textDiv.dataset.fontName = style.fontSubstitutionLoadedName || geom.fontName;
	if (angle !== 0) textDivProperties.angle = angle * (180 / Math.PI);
	let shouldScaleText = false;
	if (geom.str.length > 1) shouldScaleText = true;
	else if (geom.str !== " " && geom.transform[0] !== geom.transform[3]) {
		const absScaleX = Math.abs(geom.transform[0]), absScaleY = Math.abs(geom.transform[3]);
		if (absScaleX !== absScaleY && Math.max(absScaleX, absScaleY) / Math.min(absScaleX, absScaleY) > 1.5) shouldScaleText = true;
	}
	if (shouldScaleText) textDivProperties.canvasWidth = style.vertical ? geom.height : geom.width;
	_classPrivateFieldGet2(_textDivProperties, this).set(textDiv, textDivProperties);
	_classPrivateFieldGet2(_layoutTextParams, this).div = textDiv;
	_classPrivateFieldGet2(_layoutTextParams, this).properties = textDivProperties;
	_assertClassBrand(_TextLayer_brand, this, _layout).call(this, _classPrivateFieldGet2(_layoutTextParams, this));
	if (textDivProperties.hasText) _classPrivateFieldGet2(_container3, this).append(textDiv);
	if (textDivProperties.hasEOL) {
		const br = document.createElement("br");
		br.setAttribute("role", "presentation");
		_classPrivateFieldGet2(_container3, this).append(br);
	}
}
function _layout(params) {
	const { div, properties, ctx } = params;
	const { style } = div;
	if (properties.canvasWidth !== 0 && properties.hasText) {
		const { fontFamily } = style;
		const { canvasWidth, fontSize } = properties;
		_ensureCtxFont.call(_TextLayer, ctx, fontSize * _classPrivateFieldGet2(_scale, this), fontFamily);
		const { width } = ctx.measureText(div.textContent);
		if (width > 0) style.setProperty("--scale-x", canvasWidth * _classPrivateFieldGet2(_scale, this) / width);
	}
	if (properties.angle !== 0) style.setProperty("--rotate", `${properties.angle}deg`);
}
function _getCtx(lang = null) {
	let ctx = _assertClassBrand(_TextLayer, this, _canvasContexts)._.get(lang || (lang = ""));
	if (!ctx) {
		const canvas = document.createElement("canvas");
		canvas.className = "hiddenCanvasElement";
		canvas.lang = lang;
		document.body.append(canvas);
		ctx = canvas.getContext("2d", {
			alpha: false,
			willReadFrequently: true
		});
		_assertClassBrand(_TextLayer, this, _canvasContexts)._.set(lang, ctx);
		_assertClassBrand(_TextLayer, this, _canvasCtxFonts)._.set(ctx, {
			size: 0,
			family: ""
		});
	}
	return ctx;
}
function _ensureCtxFont(ctx, size, family) {
	const cached = _assertClassBrand(_TextLayer, this, _canvasCtxFonts)._.get(ctx);
	if (size === cached.size && family === cached.family) return;
	ctx.font = `${size}px ${family}`;
	cached.size = size;
	cached.family = family;
}
function _ensureMinFontSizeComputed() {
	if (_assertClassBrand(_TextLayer, this, _minFontSize)._ !== null) return;
	const div = document.createElement("div");
	div.style.opacity = 0;
	div.style.lineHeight = 1;
	div.style.fontSize = "1px";
	div.style.position = "absolute";
	div.textContent = "X";
	document.body.append(div);
	_minFontSize._ = _assertClassBrand(_TextLayer, this, div.getBoundingClientRect().height);
	div.remove();
}
function _getAscent(fontFamily, style, lang) {
	const cachedAscent = _assertClassBrand(_TextLayer, this, _ascentCache)._.get(fontFamily);
	if (cachedAscent) return cachedAscent;
	const ctx = _assertClassBrand(_TextLayer, this, _getCtx).call(this, lang);
	ctx.canvas.width = ctx.canvas.height = DEFAULT_FONT_SIZE;
	_assertClassBrand(_TextLayer, this, _ensureCtxFont).call(this, ctx, DEFAULT_FONT_SIZE, fontFamily);
	const metrics = ctx.measureText("");
	const ascent = metrics.fontBoundingBoxAscent;
	const descent = Math.abs(metrics.fontBoundingBoxDescent);
	ctx.canvas.width = ctx.canvas.height = 0;
	let ratio = .8;
	if (ascent) ratio = ascent / (ascent + descent);
	else {
		if (FeatureTest.platform.isFirefox) warn("Enable the `dom.textMetrics.fontBoundingBox.enabled` preference in `about:config` to improve TextLayer rendering.");
		if (style.ascent) ratio = style.ascent;
		else if (style.descent) ratio = 1 + style.descent;
	}
	_assertClassBrand(_TextLayer, this, _ascentCache)._.set(fontFamily, ratio);
	return ratio;
}
var _ascentCache = { _: /* @__PURE__ */ new Map() };
var _canvasContexts = { _: /* @__PURE__ */ new Map() };
var _canvasCtxFonts = { _: /* @__PURE__ */ new WeakMap() };
var _minFontSize = { _: null };
var _pendingTextLayers = { _: /* @__PURE__ */ new Set() };
var RENDERING_CANCELLED_TIMEOUT = 100;
function getDocument(src = {}) {
	if (typeof src === "string" || src instanceof URL) src = { url: src };
	else if (src instanceof ArrayBuffer || ArrayBuffer.isView(src)) src = { data: src };
	const task = new PDFDocumentLoadingTask();
	const { docId } = task;
	const url = src.url ? getUrlProp(src.url) : null;
	const data = src.data ? getDataProp(src.data) : null;
	const httpHeaders = src.httpHeaders || null;
	const withCredentials = src.withCredentials === true;
	const password = src.password ?? null;
	const rangeTransport = src.range instanceof PDFDataRangeTransport ? src.range : null;
	const rangeChunkSize = Number.isInteger(src.rangeChunkSize) && src.rangeChunkSize > 0 ? src.rangeChunkSize : 2 ** 16;
	let worker = src.worker instanceof PDFWorker ? src.worker : null;
	const verbosity = src.verbosity;
	const docBaseUrl = typeof src.docBaseUrl === "string" && !isDataScheme(src.docBaseUrl) ? src.docBaseUrl : null;
	const cMapUrl = getFactoryUrlProp(src.cMapUrl);
	const cMapPacked = src.cMapPacked !== false;
	const iccUrl = getFactoryUrlProp(src.iccUrl);
	const standardFontDataUrl = getFactoryUrlProp(src.standardFontDataUrl);
	const wasmUrl = getFactoryUrlProp(src.wasmUrl);
	const ignoreErrors = src.stopAtErrors !== true;
	const maxImageSize = Number.isInteger(src.maxImageSize) && src.maxImageSize > -1 ? src.maxImageSize : -1;
	const isEvalSupported = src.isEvalSupported !== false;
	const isOffscreenCanvasSupported = typeof src.isOffscreenCanvasSupported === "boolean" ? src.isOffscreenCanvasSupported : !isNodeJS;
	const isImageDecoderSupported = typeof src.isImageDecoderSupported === "boolean" ? src.isImageDecoderSupported : !isNodeJS && (FeatureTest.platform.isFirefox || !globalThis.chrome);
	const canvasMaxAreaInBytes = Number.isInteger(src.canvasMaxAreaInBytes) ? src.canvasMaxAreaInBytes : -1;
	const disableFontFace = typeof src.disableFontFace === "boolean" ? src.disableFontFace : isNodeJS;
	const fontExtraProperties = src.fontExtraProperties === true;
	const enableXfa = src.enableXfa === true;
	const ownerDocument = src.ownerDocument || globalThis.document;
	const disableRange = src.disableRange === true;
	const disableStream = src.disableStream === true;
	const disableAutoFetch = src.disableAutoFetch === true;
	const pdfBug = src.pdfBug === true;
	const CanvasFactory = src.CanvasFactory || (isNodeJS ? NodeCanvasFactory : DOMCanvasFactory);
	const FilterFactory = src.FilterFactory || (isNodeJS ? NodeFilterFactory : DOMFilterFactory);
	const BinaryDataFactory = src.BinaryDataFactory || (isNodeJS ? NodeBinaryDataFactory : DOMBinaryDataFactory);
	const enableHWA = src.enableHWA === true;
	const enableWebGPU = src.enableWebGPU === true;
	const useWasm = src.useWasm !== false;
	const pagesMapper = src.pagesMapper || new PagesMapper();
	const useSystemFonts = typeof src.useSystemFonts === "boolean" ? src.useSystemFonts : !isNodeJS && !disableFontFace;
	const useWorkerFetch = typeof src.useWorkerFetch === "boolean" ? src.useWorkerFetch : !!(BinaryDataFactory === DOMBinaryDataFactory && cMapUrl && cMapPacked && standardFontDataUrl && wasmUrl && isValidFetchUrl(cMapUrl, document.baseURI) && isValidFetchUrl(standardFontDataUrl, document.baseURI) && isValidFetchUrl(wasmUrl, document.baseURI));
	const styleElement = null;
	setVerbosityLevel(verbosity);
	const transportFactory = {
		canvasFactory: new CanvasFactory({
			ownerDocument,
			enableHWA
		}),
		filterFactory: new FilterFactory({
			docId,
			ownerDocument
		}),
		binaryDataFactory: useWorkerFetch ? null : new BinaryDataFactory({
			cMapUrl,
			standardFontDataUrl,
			wasmUrl
		})
	};
	if (!worker) {
		worker = PDFWorker.create({
			verbosity,
			port: GlobalWorkerOptions.workerPort
		});
		task._worker = worker;
	}
	const docParams = {
		docId,
		apiVersion: "5.6.205",
		data,
		password,
		disableAutoFetch,
		rangeChunkSize,
		docBaseUrl,
		enableXfa,
		evaluatorOptions: {
			maxImageSize,
			disableFontFace,
			ignoreErrors,
			isEvalSupported,
			isOffscreenCanvasSupported,
			isImageDecoderSupported,
			canvasMaxAreaInBytes,
			fontExtraProperties,
			useSystemFonts,
			useWasm,
			useWorkerFetch,
			cMapUrl,
			cMapPacked,
			iccUrl,
			standardFontDataUrl,
			wasmUrl,
			enableWebGPU
		}
	};
	const transportParams = {
		ownerDocument,
		pdfBug,
		styleElement,
		enableHWA,
		loadingParams: {
			disableAutoFetch,
			enableXfa
		}
	};
	worker.promise.then(function() {
		if (task.destroyed) throw new Error("Loading aborted");
		if (worker.destroyed) throw new Error("Worker was destroyed");
		const workerIdPromise = worker.messageHandler.sendWithPromise("GetDocRequest", docParams, data ? [data.buffer] : null);
		let networkStream;
		if (data) {} else if (rangeTransport) networkStream = new PDFDataTransportStream({
			pdfDataRangeTransport: rangeTransport,
			disableRange,
			disableStream
		});
		else if (url) networkStream = new (getNetworkStream(url))({
			url,
			httpHeaders,
			withCredentials,
			rangeChunkSize,
			disableRange,
			disableStream
		});
		else throw new Error("getDocument - expected either `data`, `range`, or `url` parameter.");
		return workerIdPromise.then((workerId) => {
			if (task.destroyed) throw new Error("Loading aborted");
			if (worker.destroyed) throw new Error("Worker was destroyed");
			const messageHandler = new MessageHandler(docId, workerId, worker.port);
			const transport = new WorkerTransport(messageHandler, task, networkStream, transportParams, transportFactory, pagesMapper);
			task._transport = transport;
			messageHandler.send("Ready", null);
		});
	}).catch(task._capability.reject);
	return task;
}
var PDFDocumentLoadingTask = class {
	constructor() {
		var _PDFDocumentLoadingTa, _PDFDocumentLoadingTa2;
		_defineProperty(this, "_capability", Promise.withResolvers());
		_defineProperty(this, "_transport", null);
		_defineProperty(this, "_worker", null);
		_defineProperty(this, "docId", `d${_docId2._ = (_PDFDocumentLoadingTa = _docId2._, _PDFDocumentLoadingTa2 = _PDFDocumentLoadingTa++, _PDFDocumentLoadingTa), _PDFDocumentLoadingTa2}`);
		_defineProperty(this, "destroyed", false);
		_defineProperty(this, "onPassword", null);
		_defineProperty(this, "onProgress", null);
	}
	get promise() {
		return this._capability.promise;
	}
	async destroy() {
		this.destroyed = true;
		try {
			if (this._worker?.port) this._worker._pendingDestroy = true;
			await this._transport?.destroy();
		} catch (ex) {
			if (this._worker?.port) delete this._worker._pendingDestroy;
			throw ex;
		}
		this._transport = null;
		this._worker?.destroy();
		this._worker = null;
	}
	async getData() {
		return this._transport.getData();
	}
};
var _docId2 = { _: 0 };
var _capability2 = /* @__PURE__ */ new WeakMap();
var _progressiveDoneListeners = /* @__PURE__ */ new WeakMap();
var _progressiveReadListeners = /* @__PURE__ */ new WeakMap();
var _rangeListeners = /* @__PURE__ */ new WeakMap();
var PDFDataRangeTransport = class {
	constructor(length, initialData, progressiveDone = false, contentDispositionFilename = null) {
		_classPrivateFieldInitSpec(this, _capability2, Promise.withResolvers());
		_classPrivateFieldInitSpec(this, _progressiveDoneListeners, []);
		_classPrivateFieldInitSpec(this, _progressiveReadListeners, []);
		_classPrivateFieldInitSpec(this, _rangeListeners, []);
		this.length = length;
		this.initialData = initialData;
		this.progressiveDone = progressiveDone;
		this.contentDispositionFilename = contentDispositionFilename;
		Object.defineProperty(this, "onDataProgress", { value: () => {
			deprecated("`PDFDataRangeTransport.prototype.onDataProgress` - method was removed, since loading progress is now reported automatically through the `PDFDataTransportStream` class (and related code).");
		} });
	}
	addRangeListener(listener) {
		_classPrivateFieldGet2(_rangeListeners, this).push(listener);
	}
	addProgressiveReadListener(listener) {
		_classPrivateFieldGet2(_progressiveReadListeners, this).push(listener);
	}
	addProgressiveDoneListener(listener) {
		_classPrivateFieldGet2(_progressiveDoneListeners, this).push(listener);
	}
	onDataRange(begin, chunk) {
		for (const listener of _classPrivateFieldGet2(_rangeListeners, this)) listener(begin, chunk);
	}
	onDataProgressiveRead(chunk) {
		_classPrivateFieldGet2(_capability2, this).promise.then(() => {
			for (const listener of _classPrivateFieldGet2(_progressiveReadListeners, this)) listener(chunk);
		});
	}
	onDataProgressiveDone() {
		_classPrivateFieldGet2(_capability2, this).promise.then(() => {
			for (const listener of _classPrivateFieldGet2(_progressiveDoneListeners, this)) listener();
		});
	}
	transportReady() {
		_classPrivateFieldGet2(_capability2, this).resolve();
	}
	requestDataRange(begin, end) {
		unreachable("Abstract method PDFDataRangeTransport.requestDataRange");
	}
	abort() {}
};
var PDFDocumentProxy = class {
	constructor(pdfInfo, transport) {
		this._pdfInfo = pdfInfo;
		this._transport = transport;
	}
	get pagesMapper() {
		return this._transport.pagesMapper;
	}
	get annotationStorage() {
		return this._transport.annotationStorage;
	}
	get canvasFactory() {
		return this._transport.canvasFactory;
	}
	get filterFactory() {
		return this._transport.filterFactory;
	}
	get numPages() {
		return this._pdfInfo.numPages;
	}
	get fingerprints() {
		return this._pdfInfo.fingerprints;
	}
	get isPureXfa() {
		return shadow(this, "isPureXfa", !!this._transport._htmlForXfa);
	}
	get allXfaHtml() {
		return this._transport._htmlForXfa;
	}
	getPage(pageNumber) {
		return this._transport.getPage(pageNumber);
	}
	getPageIndex(ref) {
		return this._transport.getPageIndex(ref);
	}
	getDestinations() {
		return this._transport.getDestinations();
	}
	getDestination(id) {
		return this._transport.getDestination(id);
	}
	getPageLabels() {
		return this._transport.getPageLabels();
	}
	getPageLayout() {
		return this._transport.getPageLayout();
	}
	getPageMode() {
		return this._transport.getPageMode();
	}
	getViewerPreferences() {
		return this._transport.getViewerPreferences();
	}
	getOpenAction() {
		return this._transport.getOpenAction();
	}
	getAttachments() {
		return this._transport.getAttachments();
	}
	getAnnotationsByType(types, pageIndexesToSkip) {
		return this._transport.getAnnotationsByType(types, pageIndexesToSkip);
	}
	getJSActions() {
		return this._transport.getDocJSActions();
	}
	getOutline() {
		return this._transport.getOutline();
	}
	getOptionalContentConfig({ intent = "display" } = {}) {
		const { renderingIntent } = this._transport.getRenderingIntent(intent);
		return this._transport.getOptionalContentConfig(renderingIntent);
	}
	getPermissions() {
		return this._transport.getPermissions();
	}
	getMetadata() {
		return this._transport.getMetadata();
	}
	getMarkInfo() {
		return this._transport.getMarkInfo();
	}
	getData() {
		return this._transport.getData();
	}
	saveDocument() {
		return this._transport.saveDocument();
	}
	extractPages(pageInfos) {
		return this._transport.extractPages(pageInfos);
	}
	getDownloadInfo() {
		return this._transport.downloadInfoCapability.promise;
	}
	getRawData(data) {
		return this._transport.getRawData(data);
	}
	cleanup(keepLoadedFonts = false) {
		return this._transport.startCleanup(keepLoadedFonts || this.isPureXfa);
	}
	destroy() {
		return this.loadingTask.destroy();
	}
	cachedPageNumber(ref) {
		return this._transport.cachedPageNumber(ref);
	}
	get loadingParams() {
		return this._transport.loadingParams;
	}
	get loadingTask() {
		return this._transport.loadingTask;
	}
	getFieldObjects() {
		return this._transport.getFieldObjects();
	}
	hasJSActions() {
		return this._transport.hasJSActions();
	}
	getCalculationOrderIds() {
		return this._transport.getCalculationOrderIds();
	}
};
var _pendingCleanup = /* @__PURE__ */ new WeakMap();
var _pagesMapper = /* @__PURE__ */ new WeakMap();
var _PDFPageProxy_brand = /* @__PURE__ */ new WeakSet();
var PDFPageProxy = class PDFPageProxy {
	constructor(pageIndex, pageInfo, transport, pagesMapper, pdfBug = false) {
		_classPrivateMethodInitSpec(this, _PDFPageProxy_brand);
		_classPrivateFieldInitSpec(this, _pendingCleanup, false);
		_classPrivateFieldInitSpec(this, _pagesMapper, null);
		this._pageIndex = pageIndex;
		this._pageInfo = pageInfo;
		this._transport = transport;
		this._stats = pdfBug ? new StatTimer() : null;
		this._pdfBug = pdfBug;
		this.commonObjs = transport.commonObjs;
		this.objs = new PDFObjects();
		this._intentStates = /* @__PURE__ */ new Map();
		this.destroyed = false;
		this.recordedBBoxes = null;
		_classPrivateFieldSet2(_pagesMapper, this, pagesMapper);
		this.imageCoordinates = null;
	}
	clone(id) {
		const clone = new PDFPageProxy(id, this._pageInfo, this._transport, _classPrivateFieldGet2(_pagesMapper, this), this._pdfBug);
		clone.clonedFromIndex = this.clonedFromIndex ?? this._pageIndex;
		this._transport.updatePage(clone);
		return clone;
	}
	get pageNumber() {
		return this._pageIndex + 1;
	}
	set pageNumber(value) {
		this._pageIndex = value - 1;
		this._transport.updatePage(this);
	}
	get rotate() {
		return this._pageInfo.rotate;
	}
	get ref() {
		return this._pageInfo.ref;
	}
	get userUnit() {
		return this._pageInfo.userUnit;
	}
	get view() {
		return this._pageInfo.view;
	}
	getViewport({ scale, rotation = this.rotate, offsetX = 0, offsetY = 0, dontFlip = false } = {}) {
		return new PageViewport({
			viewBox: this.view,
			userUnit: this.userUnit,
			scale,
			rotation,
			offsetX,
			offsetY,
			dontFlip
		});
	}
	getAnnotations({ intent = "display" } = {}) {
		const { renderingIntent } = this._transport.getRenderingIntent(intent);
		return this._transport.getAnnotations(this._pageIndex, renderingIntent);
	}
	getJSActions() {
		return this._transport.getPageJSActions(this._pageIndex);
	}
	get filterFactory() {
		return this._transport.filterFactory;
	}
	get isPureXfa() {
		return shadow(this, "isPureXfa", !!this._transport._htmlForXfa);
	}
	async getXfa() {
		return this._transport._htmlForXfa?.children[this._pageIndex] || null;
	}
	render({ canvasContext, canvas = canvasContext.canvas, viewport, intent = "display", annotationMode = AnnotationMode.ENABLE, transform = null, background = null, optionalContentConfigPromise = null, annotationCanvasMap = null, pageColors = null, printAnnotationStorage = null, isEditing = false, recordImages = false, recordOperations = false, operationsFilter = null }) {
		this._stats?.time("Overall");
		const intentArgs = this._transport.getRenderingIntent(intent, annotationMode, printAnnotationStorage, isEditing);
		const { renderingIntent, cacheKey } = intentArgs;
		_classPrivateFieldSet2(_pendingCleanup, this, false);
		optionalContentConfigPromise || (optionalContentConfigPromise = this._transport.getOptionalContentConfig(renderingIntent));
		const intentState = this._intentStates.getOrInsertComputed(cacheKey, makeObj);
		if (intentState.streamReaderCancelTimeout) {
			clearTimeout(intentState.streamReaderCancelTimeout);
			intentState.streamReaderCancelTimeout = null;
		}
		const intentPrint = !!(renderingIntent & RenderingIntentFlag.PRINT);
		if (!intentState.displayReadyCapability) {
			intentState.displayReadyCapability = Promise.withResolvers();
			intentState.operatorList = {
				fnArray: [],
				argsArray: [],
				lastChunk: false,
				separateAnnots: null
			};
			this._stats?.time("Page Request");
			this._pumpOperatorList(intentArgs);
		}
		const recordForDebugger = !!(this._pdfBug && globalThis.StepperManager?.enabled);
		const shouldRecordOperations = !!canvas && !this.recordedBBoxes && (recordOperations || recordForDebugger);
		const shouldRecordImages = !!canvas && !this.imageCoordinates && recordImages;
		const complete = (error) => {
			intentState.renderTasks.delete(internalRenderTask);
			if (shouldRecordOperations) {
				const recordedBBoxes = internalRenderTask.gfx?.dependencyTracker.take();
				if (recordedBBoxes) {
					internalRenderTask.stepper?.setOperatorBBoxes(recordedBBoxes, internalRenderTask.gfx.dependencyTracker.takeDebugMetadata());
					if (recordOperations) this.recordedBBoxes = recordedBBoxes;
				}
			}
			if (shouldRecordImages && !error) this.imageCoordinates = internalRenderTask.gfx?.imagesTracker.take();
			if (intentPrint) _classPrivateFieldSet2(_pendingCleanup, this, true);
			_assertClassBrand(_PDFPageProxy_brand, this, _tryCleanup).call(this);
			if (error) {
				internalRenderTask.capability.reject(error);
				this._abortOperatorList({
					intentState,
					reason: error instanceof Error ? error : new Error(error)
				});
			} else internalRenderTask.capability.resolve();
			if (this._stats) {
				this._stats.timeEnd("Rendering");
				this._stats.timeEnd("Overall");
				if (globalThis.Stats?.enabled) globalThis.Stats.add(this.pageNumber, this._stats);
			}
		};
		let dependencyTracker = null;
		let bboxTracker = null;
		if (shouldRecordOperations || shouldRecordImages) bboxTracker = new CanvasBBoxTracker(canvas, intentState.operatorList.length);
		if (shouldRecordOperations) dependencyTracker = new CanvasDependencyTracker(bboxTracker, recordForDebugger);
		const internalRenderTask = new InternalRenderTask({
			callback: complete,
			params: {
				canvas,
				canvasContext,
				dependencyTracker: dependencyTracker ?? bboxTracker,
				imagesTracker: shouldRecordImages ? new CanvasImagesTracker(canvas) : null,
				viewport,
				transform,
				background
			},
			objs: this.objs,
			commonObjs: this.commonObjs,
			annotationCanvasMap,
			operatorList: intentState.operatorList,
			pageIndex: this._pageIndex,
			canvasFactory: this._transport.canvasFactory,
			filterFactory: this._transport.filterFactory,
			useRequestAnimationFrame: !intentPrint,
			pdfBug: this._pdfBug,
			pageColors,
			enableHWA: this._transport.enableHWA,
			operationsFilter
		});
		(intentState.renderTasks || (intentState.renderTasks = /* @__PURE__ */ new Set())).add(internalRenderTask);
		const renderTask = internalRenderTask.task;
		Promise.all([intentState.displayReadyCapability.promise, optionalContentConfigPromise]).then(([transparency, optionalContentConfig]) => {
			if (this.destroyed) {
				complete();
				return;
			}
			this._stats?.time("Rendering");
			if (!(optionalContentConfig.renderingIntent & renderingIntent)) throw new Error("Must use the same `intent`-argument when calling the `PDFPageProxy.render` and `PDFDocumentProxy.getOptionalContentConfig` methods.");
			internalRenderTask.initializeGraphics({
				transparency,
				optionalContentConfig
			});
			internalRenderTask.operatorListChanged();
		}).catch(complete);
		return renderTask;
	}
	getOperatorList({ intent = "display", annotationMode = AnnotationMode.ENABLE, printAnnotationStorage = null, isEditing = false } = {}) {
		function operatorListChanged() {
			if (intentState.operatorList.lastChunk) {
				intentState.opListReadCapability.resolve(intentState.operatorList);
				intentState.renderTasks.delete(opListTask);
			}
		}
		const intentArgs = this._transport.getRenderingIntent(intent, annotationMode, printAnnotationStorage, isEditing, true);
		const intentState = this._intentStates.getOrInsertComputed(intentArgs.cacheKey, makeObj);
		let opListTask;
		if (!intentState.opListReadCapability) {
			opListTask = Object.create(null);
			opListTask.operatorListChanged = operatorListChanged;
			intentState.opListReadCapability = Promise.withResolvers();
			(intentState.renderTasks || (intentState.renderTasks = /* @__PURE__ */ new Set())).add(opListTask);
			intentState.operatorList = {
				fnArray: [],
				argsArray: [],
				lastChunk: false,
				separateAnnots: null
			};
			this._stats?.time("Page Request");
			this._pumpOperatorList(intentArgs);
		}
		return intentState.opListReadCapability.promise;
	}
	streamTextContent({ includeMarkedContent = false, disableNormalization = false } = {}) {
		return this._transport.messageHandler.sendWithStream("GetTextContent", {
			pageId: _classPrivateFieldGet2(_pagesMapper, this).getPageId(this._pageIndex + 1) - 1,
			pageIndex: this._pageIndex,
			includeMarkedContent: includeMarkedContent === true,
			disableNormalization: disableNormalization === true
		}, {
			highWaterMark: 100,
			size(textContent) {
				return textContent.items.length;
			}
		});
	}
	async getTextContent(params = {}) {
		if (this._transport._htmlForXfa) return this.getXfa().then((xfa) => XfaText.textContent(xfa));
		const readableStream = this.streamTextContent(params);
		const textContent = {
			items: [],
			styles: Object.create(null),
			lang: null
		};
		for await (const value of readableStream) {
			textContent.lang ?? (textContent.lang = value.lang);
			Object.assign(textContent.styles, value.styles);
			textContent.items.push(...value.items);
		}
		return textContent;
	}
	getStructTree() {
		return this._transport.getStructTree(this._pageIndex);
	}
	_destroy() {
		this.destroyed = true;
		const waitOn = [];
		for (const intentState of this._intentStates.values()) {
			this._abortOperatorList({
				intentState,
				reason: /* @__PURE__ */ new Error("Page was destroyed."),
				force: true
			});
			if (intentState.opListReadCapability) continue;
			for (const internalRenderTask of intentState.renderTasks) {
				waitOn.push(internalRenderTask.completed);
				internalRenderTask.cancel();
			}
		}
		this.objs.clear();
		_classPrivateFieldSet2(_pendingCleanup, this, false);
		return Promise.all(waitOn);
	}
	cleanup(resetStats = false) {
		_classPrivateFieldSet2(_pendingCleanup, this, true);
		const success = _assertClassBrand(_PDFPageProxy_brand, this, _tryCleanup).call(this);
		if (resetStats && success) this._stats && (this._stats = new StatTimer());
		return success;
	}
	_startRenderPage(transparency, cacheKey) {
		const intentState = this._intentStates.get(cacheKey);
		if (!intentState) return;
		this._stats?.timeEnd("Page Request");
		intentState.displayReadyCapability?.resolve(transparency);
	}
	_renderPageChunk(operatorListChunk, intentState) {
		for (let i = 0, ii = operatorListChunk.length; i < ii; i++) {
			intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
			intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
		}
		intentState.operatorList.lastChunk = operatorListChunk.lastChunk;
		intentState.operatorList.separateAnnots = operatorListChunk.separateAnnots;
		for (const internalRenderTask of intentState.renderTasks) internalRenderTask.operatorListChanged();
		if (operatorListChunk.lastChunk) _assertClassBrand(_PDFPageProxy_brand, this, _tryCleanup).call(this);
	}
	_pumpOperatorList({ renderingIntent, cacheKey, annotationStorageSerializable, modifiedIds }) {
		const { map, transfer } = annotationStorageSerializable;
		const reader = this._transport.messageHandler.sendWithStream("GetOperatorList", {
			pageId: _classPrivateFieldGet2(_pagesMapper, this).getPageId(this._pageIndex + 1) - 1,
			pageIndex: this._pageIndex,
			intent: renderingIntent,
			cacheKey,
			annotationStorage: map,
			modifiedIds
		}, void 0, transfer).getReader();
		const intentState = this._intentStates.get(cacheKey);
		intentState.streamReader = reader;
		const pump = () => {
			reader.read().then(({ value, done }) => {
				if (done) {
					intentState.streamReader = null;
					return;
				}
				if (this._transport.destroyed) return;
				this._renderPageChunk(value, intentState);
				pump();
			}, (reason) => {
				intentState.streamReader = null;
				if (this._transport.destroyed) return;
				if (intentState.operatorList) {
					intentState.operatorList.lastChunk = true;
					for (const internalRenderTask of intentState.renderTasks) internalRenderTask.operatorListChanged();
					_assertClassBrand(_PDFPageProxy_brand, this, _tryCleanup).call(this);
				}
				if (intentState.displayReadyCapability) intentState.displayReadyCapability.reject(reason);
				else if (intentState.opListReadCapability) intentState.opListReadCapability.reject(reason);
				else throw reason;
			});
		};
		pump();
	}
	_abortOperatorList({ intentState, reason, force = false }) {
		if (!intentState.streamReader) return;
		if (intentState.streamReaderCancelTimeout) {
			clearTimeout(intentState.streamReaderCancelTimeout);
			intentState.streamReaderCancelTimeout = null;
		}
		if (!force) {
			if (intentState.renderTasks.size > 0) return;
			if (reason instanceof RenderingCancelledException) {
				let delay = RENDERING_CANCELLED_TIMEOUT;
				if (reason.extraDelay > 0 && reason.extraDelay < 1e3) delay += reason.extraDelay;
				intentState.streamReaderCancelTimeout = setTimeout(() => {
					intentState.streamReaderCancelTimeout = null;
					this._abortOperatorList({
						intentState,
						reason,
						force: true
					});
				}, delay);
				return;
			}
		}
		intentState.streamReader.cancel(new AbortException(reason.message)).catch(() => {});
		intentState.streamReader = null;
		if (this._transport.destroyed) return;
		for (const [curCacheKey, curIntentState] of this._intentStates) if (curIntentState === intentState) {
			this._intentStates.delete(curCacheKey);
			break;
		}
		this.cleanup();
	}
	get stats() {
		return this._stats;
	}
};
function _tryCleanup() {
	if (!_classPrivateFieldGet2(_pendingCleanup, this) || this.destroyed) return false;
	for (const { renderTasks, operatorList } of this._intentStates.values()) if (renderTasks.size > 0 || !operatorList.lastChunk) return false;
	this._intentStates.clear();
	this.objs.clear();
	_classPrivateFieldSet2(_pendingCleanup, this, false);
	return true;
}
var _capability3 = /* @__PURE__ */ new WeakMap();
var _messageHandler = /* @__PURE__ */ new WeakMap();
var _port2 = /* @__PURE__ */ new WeakMap();
var _webWorker = /* @__PURE__ */ new WeakMap();
var _PDFWorker_brand = /* @__PURE__ */ new WeakSet();
var PDFWorker = class PDFWorker {
	constructor({ name = null, port = null, verbosity = getVerbosityLevel() } = {}) {
		_classPrivateMethodInitSpec(this, _PDFWorker_brand);
		_classPrivateFieldInitSpec(this, _capability3, Promise.withResolvers());
		_classPrivateFieldInitSpec(this, _messageHandler, null);
		_classPrivateFieldInitSpec(this, _port2, null);
		_classPrivateFieldInitSpec(this, _webWorker, null);
		this.name = name;
		this.destroyed = false;
		this.verbosity = verbosity;
		if (port) {
			if (_workerPorts._.has(port)) throw new Error("Cannot use more than one PDFWorker per port.");
			_workerPorts._.set(port, this);
			_assertClassBrand(_PDFWorker_brand, this, _initializeFromPort).call(this, port);
		} else _assertClassBrand(_PDFWorker_brand, this, _initialize).call(this);
	}
	get promise() {
		return _classPrivateFieldGet2(_capability3, this).promise;
	}
	get port() {
		return _classPrivateFieldGet2(_port2, this);
	}
	get messageHandler() {
		return _classPrivateFieldGet2(_messageHandler, this);
	}
	destroy() {
		this.destroyed = true;
		_classPrivateFieldGet2(_webWorker, this)?.terminate();
		_classPrivateFieldSet2(_webWorker, this, null);
		_workerPorts._.delete(_classPrivateFieldGet2(_port2, this));
		_classPrivateFieldSet2(_port2, this, null);
		_classPrivateFieldGet2(_messageHandler, this)?.destroy();
		_classPrivateFieldSet2(_messageHandler, this, null);
	}
	static create(params) {
		const cachedPort = _assertClassBrand(PDFWorker, this, _workerPorts)._.get(params?.port);
		if (cachedPort) {
			if (cachedPort._pendingDestroy) throw new Error("PDFWorker.create - the worker is being destroyed.\nPlease remember to await `PDFDocumentLoadingTask.destroy()`-calls.");
			return cachedPort;
		}
		return new PDFWorker(params);
	}
	static get workerSrc() {
		if (GlobalWorkerOptions.workerSrc) return GlobalWorkerOptions.workerSrc;
		throw new Error("No \"GlobalWorkerOptions.workerSrc\" specified.");
	}
	static get _setupFakeWorkerGlobal() {
		const loader = async () => {
			if (_get_mainThreadWorkerMessageHandler.call(_assertClassBrand(PDFWorker, this))) return _get_mainThreadWorkerMessageHandler.call(_assertClassBrand(PDFWorker, this));
			return (await __vitePreload(() => import(
				/*webpackIgnore: true*/
				/*@vite-ignore*/
				this.workerSrc
), [], import.meta.url)).WorkerMessageHandler;
		};
		return shadow(this, "_setupFakeWorkerGlobal", loader());
	}
};
_PDFWorker = PDFWorker;
function _resolve() {
	_classPrivateFieldGet2(_capability3, this).resolve();
	_classPrivateFieldGet2(_messageHandler, this).send("configure", { verbosity: this.verbosity });
}
function _initializeFromPort(port) {
	_classPrivateFieldSet2(_port2, this, port);
	_classPrivateFieldSet2(_messageHandler, this, new MessageHandler("main", "worker", port));
	_classPrivateFieldGet2(_messageHandler, this).on("ready", () => {});
	_assertClassBrand(_PDFWorker_brand, this, _resolve).call(this);
}
function _initialize() {
	if (_isWorkerDisabled._ || _get_mainThreadWorkerMessageHandler.call(_PDFWorker)) {
		_assertClassBrand(_PDFWorker_brand, this, _setupFakeWorker).call(this);
		return;
	}
	let { workerSrc } = _PDFWorker;
	try {
		if (!_PDFWorker._isSameOrigin(window.location, workerSrc)) workerSrc = _PDFWorker._createCDNWrapper(new URL(workerSrc, window.location).href);
		const worker = new Worker(workerSrc, { type: "module" });
		const messageHandler = new MessageHandler("main", "worker", worker);
		const terminateEarly = () => {
			ac.abort();
			messageHandler.destroy();
			worker.terminate();
			if (this.destroyed) _classPrivateFieldGet2(_capability3, this).reject(/* @__PURE__ */ new Error("Worker was destroyed"));
			else _assertClassBrand(_PDFWorker_brand, this, _setupFakeWorker).call(this);
		};
		const ac = new AbortController();
		worker.addEventListener("error", () => {
			if (!_classPrivateFieldGet2(_webWorker, this)) terminateEarly();
		}, { signal: ac.signal });
		messageHandler.on("test", (data) => {
			ac.abort();
			if (this.destroyed || !data) {
				terminateEarly();
				return;
			}
			_classPrivateFieldSet2(_messageHandler, this, messageHandler);
			_classPrivateFieldSet2(_port2, this, worker);
			_classPrivateFieldSet2(_webWorker, this, worker);
			_assertClassBrand(_PDFWorker_brand, this, _resolve).call(this);
		});
		messageHandler.on("ready", (data) => {
			ac.abort();
			if (this.destroyed) {
				terminateEarly();
				return;
			}
			try {
				sendTest();
			} catch {
				_assertClassBrand(_PDFWorker_brand, this, _setupFakeWorker).call(this);
			}
		});
		const sendTest = () => {
			const testObj = /* @__PURE__ */ new Uint8Array();
			messageHandler.send("test", testObj, [testObj.buffer]);
		};
		sendTest();
		return;
	} catch {
		info("The worker has been disabled.");
	}
	_assertClassBrand(_PDFWorker_brand, this, _setupFakeWorker).call(this);
}
function _setupFakeWorker() {
	if (!_isWorkerDisabled._) {
		warn("Setting up fake worker.");
		_isWorkerDisabled._ = true;
	}
	_PDFWorker._setupFakeWorkerGlobal.then((WorkerMessageHandler) => {
		var _PDFWorker$fakeWorker, _PDFWorker$fakeWorker2;
		if (this.destroyed) {
			_classPrivateFieldGet2(_capability3, this).reject(/* @__PURE__ */ new Error("Worker was destroyed"));
			return;
		}
		const port = new LoopbackPort();
		_classPrivateFieldSet2(_port2, this, port);
		const id = `fake${_fakeWorkerId._ = (_PDFWorker$fakeWorker = _fakeWorkerId._, _PDFWorker$fakeWorker2 = _PDFWorker$fakeWorker++, _PDFWorker$fakeWorker), _PDFWorker$fakeWorker2}`;
		const workerHandler = new MessageHandler(id + "_worker", id, port);
		WorkerMessageHandler.setup(workerHandler, port);
		_classPrivateFieldSet2(_messageHandler, this, new MessageHandler(id, id + "_worker", port));
		_assertClassBrand(_PDFWorker_brand, this, _resolve).call(this);
	}).catch((reason) => {
		_classPrivateFieldGet2(_capability3, this).reject(/* @__PURE__ */ new Error(`Setting up fake worker failed: "${reason.message}".`));
	});
}
function _get_mainThreadWorkerMessageHandler() {
	try {
		return globalThis.pdfjsWorker?.WorkerMessageHandler || null;
	} catch {
		return null;
	}
}
var _fakeWorkerId = { _: 0 };
var _isWorkerDisabled = { _: false };
var _workerPorts = { _: /* @__PURE__ */ new WeakMap() };
(() => {
	if (isNodeJS) {
		_isWorkerDisabled._ = _assertClassBrand(_PDFWorker, _PDFWorker, true);
		GlobalWorkerOptions.workerSrc || (GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs");
	}
	_PDFWorker._isSameOrigin = (baseUrl, otherUrl) => {
		const base = URL.parse(baseUrl);
		if (!base?.origin || base.origin === "null") return false;
		const other = new URL(otherUrl, base);
		return base.origin === other.origin;
	};
	_PDFWorker._createCDNWrapper = (url) => {
		const wrapper = `await import("${url}");`;
		return URL.createObjectURL(new Blob([wrapper], { type: "text/javascript" }));
	};
})();
var _fullReader = /* @__PURE__ */ new WeakMap();
var _methodPromises = /* @__PURE__ */ new WeakMap();
var _networkStream = /* @__PURE__ */ new WeakMap();
var _pageCache = /* @__PURE__ */ new WeakMap();
var _pagePromises = /* @__PURE__ */ new WeakMap();
var _pageRefCache = /* @__PURE__ */ new WeakMap();
var _passwordCapability = /* @__PURE__ */ new WeakMap();
var _WorkerTransport_brand = /* @__PURE__ */ new WeakSet();
var WorkerTransport = class {
	constructor(messageHandler, loadingTask, networkStream, params, factory, pagesMapper) {
		_classPrivateMethodInitSpec(this, _WorkerTransport_brand);
		_defineProperty(this, "downloadInfoCapability", Promise.withResolvers());
		_classPrivateFieldInitSpec(this, _fullReader, null);
		_classPrivateFieldInitSpec(this, _methodPromises, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _networkStream, null);
		_classPrivateFieldInitSpec(this, _pageCache, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _pagePromises, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _pageRefCache, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _passwordCapability, null);
		this.messageHandler = messageHandler;
		this.loadingTask = loadingTask;
		_classPrivateFieldSet2(_networkStream, this, networkStream);
		this.commonObjs = new PDFObjects();
		this.fontLoader = new FontLoader({
			ownerDocument: params.ownerDocument,
			styleElement: params.styleElement
		});
		this.enableHWA = params.enableHWA;
		this.loadingParams = params.loadingParams;
		this._params = params;
		this.canvasFactory = factory.canvasFactory;
		this.filterFactory = factory.filterFactory;
		this.binaryDataFactory = factory.binaryDataFactory;
		this.pagesMapper = pagesMapper;
		this.destroyed = false;
		this.destroyCapability = null;
		this.setupMessageHandler();
	}
	updatePage(page) {
		const { _pageIndex } = page;
		_classPrivateFieldGet2(_pageCache, this).set(_pageIndex, page);
		_classPrivateFieldGet2(_pagePromises, this).set(_pageIndex, Promise.resolve(page));
	}
	get annotationStorage() {
		return shadow(this, "annotationStorage", new AnnotationStorage());
	}
	getRenderingIntent(intent, annotationMode = AnnotationMode.ENABLE, printAnnotationStorage = null, isEditing = false, isOpList = false) {
		let renderingIntent = RenderingIntentFlag.DISPLAY;
		let annotationStorageSerializable = SerializableEmpty;
		switch (intent) {
			case "any":
				renderingIntent = RenderingIntentFlag.ANY;
				break;
			case "display": break;
			case "print":
				renderingIntent = RenderingIntentFlag.PRINT;
				break;
			default: warn(`getRenderingIntent - invalid intent: ${intent}`);
		}
		const annotationStorage = renderingIntent & RenderingIntentFlag.PRINT && printAnnotationStorage instanceof PrintAnnotationStorage ? printAnnotationStorage : this.annotationStorage;
		switch (annotationMode) {
			case AnnotationMode.DISABLE:
				renderingIntent += RenderingIntentFlag.ANNOTATIONS_DISABLE;
				break;
			case AnnotationMode.ENABLE: break;
			case AnnotationMode.ENABLE_FORMS:
				renderingIntent += RenderingIntentFlag.ANNOTATIONS_FORMS;
				break;
			case AnnotationMode.ENABLE_STORAGE:
				renderingIntent += RenderingIntentFlag.ANNOTATIONS_STORAGE;
				annotationStorageSerializable = annotationStorage.serializable;
				break;
			default: warn(`getRenderingIntent - invalid annotationMode: ${annotationMode}`);
		}
		if (isEditing) renderingIntent += RenderingIntentFlag.IS_EDITING;
		if (isOpList) renderingIntent += RenderingIntentFlag.OPLIST;
		const { ids: modifiedIds, hash: modifiedIdsHash } = annotationStorage.modifiedIds;
		const cacheKeyBuf = [
			renderingIntent,
			annotationStorageSerializable.hash,
			modifiedIdsHash
		];
		return {
			renderingIntent,
			cacheKey: cacheKeyBuf.join("_"),
			annotationStorageSerializable,
			modifiedIds
		};
	}
	destroy() {
		if (this.destroyCapability) return this.destroyCapability.promise;
		this.destroyed = true;
		this.destroyCapability = Promise.withResolvers();
		_classPrivateFieldGet2(_passwordCapability, this)?.reject(/* @__PURE__ */ new Error("Worker was destroyed during onPassword callback"));
		const waitOn = [];
		for (const page of _classPrivateFieldGet2(_pageCache, this).values()) waitOn.push(page._destroy());
		_classPrivateFieldGet2(_pageCache, this).clear();
		_classPrivateFieldGet2(_pagePromises, this).clear();
		_classPrivateFieldGet2(_pageRefCache, this).clear();
		if (this.hasOwnProperty("annotationStorage")) this.annotationStorage.resetModified();
		const terminated = this.messageHandler.sendWithPromise("Terminate", null);
		waitOn.push(terminated);
		Promise.all(waitOn).then(() => {
			this.commonObjs.clear();
			this.fontLoader.clear();
			_classPrivateFieldGet2(_methodPromises, this).clear();
			this.filterFactory.destroy();
			TextLayer.cleanup();
			_classPrivateFieldGet2(_networkStream, this)?.cancelAllRequests(new AbortException("Worker was terminated."));
			this.messageHandler?.destroy();
			this.messageHandler = null;
			this.destroyCapability.resolve();
		}, this.destroyCapability.reject);
		return this.destroyCapability.promise;
	}
	setupMessageHandler() {
		const { messageHandler, loadingTask } = this;
		messageHandler.on("GetReader", (data, sink) => {
			assert(_classPrivateFieldGet2(_networkStream, this), "GetReader - no `BasePDFStream` instance available.");
			_classPrivateFieldSet2(_fullReader, this, _classPrivateFieldGet2(_networkStream, this).getFullReader());
			_classPrivateFieldGet2(_fullReader, this).onProgress = (evt) => _assertClassBrand(_WorkerTransport_brand, this, _onProgress3).call(this, evt);
			sink.onPull = () => {
				_classPrivateFieldGet2(_fullReader, this).read().then(function({ value, done }) {
					if (done) {
						sink.close();
						return;
					}
					assert(value instanceof ArrayBuffer, "GetReader - expected an ArrayBuffer.");
					sink.enqueue(new Uint8Array(value), 1, [value]);
				}).catch((reason) => {
					sink.error(reason);
				});
			};
			sink.onCancel = (reason) => {
				_classPrivateFieldGet2(_fullReader, this).cancel(reason);
				sink.ready.catch((readyReason) => {
					if (this.destroyed) return;
					throw readyReason;
				});
			};
		});
		messageHandler.on("ReaderHeadersReady", async (data) => {
			await _classPrivateFieldGet2(_fullReader, this).headersReady;
			const { isStreamingSupported, isRangeSupported, contentLength } = _classPrivateFieldGet2(_fullReader, this);
			if (isStreamingSupported && isRangeSupported) _classPrivateFieldGet2(_fullReader, this).onProgress = null;
			return {
				isStreamingSupported,
				isRangeSupported,
				contentLength
			};
		});
		messageHandler.on("GetRangeReader", (data, sink) => {
			assert(_classPrivateFieldGet2(_networkStream, this), "GetRangeReader - no `BasePDFStream` instance available.");
			const rangeReader = _classPrivateFieldGet2(_networkStream, this).getRangeReader(data.begin, data.end);
			if (!rangeReader) {
				sink.close();
				return;
			}
			sink.onPull = () => {
				rangeReader.read().then(function({ value, done }) {
					if (done) {
						sink.close();
						return;
					}
					assert(value instanceof ArrayBuffer, "GetRangeReader - expected an ArrayBuffer.");
					sink.enqueue(new Uint8Array(value), 1, [value]);
				}).catch((reason) => {
					sink.error(reason);
				});
			};
			sink.onCancel = (reason) => {
				rangeReader.cancel(reason);
				sink.ready.catch((readyReason) => {
					if (this.destroyed) return;
					throw readyReason;
				});
			};
		});
		messageHandler.on("GetDoc", ({ pdfInfo }) => {
			this.pagesMapper.pagesNumber = pdfInfo.numPages;
			this._numPages = pdfInfo.numPages;
			this._htmlForXfa = pdfInfo.htmlForXfa;
			delete pdfInfo.htmlForXfa;
			loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo, this));
		});
		messageHandler.on("DocException", (ex) => {
			loadingTask._capability.reject(wrapReason(ex));
		});
		messageHandler.on("PasswordRequest", (ex) => {
			_classPrivateFieldSet2(_passwordCapability, this, Promise.withResolvers());
			try {
				if (!loadingTask.onPassword) throw wrapReason(ex);
				const updatePassword = (password) => {
					if (password instanceof Error) _classPrivateFieldGet2(_passwordCapability, this).reject(password);
					else _classPrivateFieldGet2(_passwordCapability, this).resolve({ password });
				};
				loadingTask.onPassword(updatePassword, ex.code);
			} catch (err) {
				_classPrivateFieldGet2(_passwordCapability, this).reject(err);
			}
			return _classPrivateFieldGet2(_passwordCapability, this).promise;
		});
		messageHandler.on("DataLoaded", (data) => {
			_assertClassBrand(_WorkerTransport_brand, this, _onProgress3).call(this, {
				loaded: data.length,
				total: data.length
			});
			this.downloadInfoCapability.resolve(data);
		});
		messageHandler.on("StartRenderPage", (data) => {
			if (this.destroyed) return;
			_classPrivateFieldGet2(_pageCache, this).get(data.pageIndex)._startRenderPage(data.transparency, data.cacheKey);
		});
		messageHandler.on("commonobj", ([id, type, exportedData]) => {
			if (this.destroyed) return null;
			if (this.commonObjs.has(id)) return null;
			switch (type) {
				case "Font":
					if ("error" in exportedData) {
						const exportedError = exportedData.error;
						warn(`Error during font loading: ${exportedError}`);
						this.commonObjs.resolve(id, exportedError);
						break;
					}
					const font = new FontFaceObject(new FontInfo(exportedData), this._params.pdfBug && globalThis.FontInspector?.enabled ? (font, url) => globalThis.FontInspector.fontAdded(font, url) : null, exportedData.charProcOperatorList, exportedData.extra);
					this.fontLoader.bind(font).catch(() => messageHandler.sendWithPromise("FontFallback", { id })).finally(() => {
						if (!font.fontExtraProperties) font.clearData();
						this.commonObjs.resolve(id, font);
					});
					break;
				case "CopyLocalImage":
					const { imageRef } = exportedData;
					assert(imageRef, "The imageRef must be defined.");
					for (const pageProxy of _classPrivateFieldGet2(_pageCache, this).values()) for (const [, data] of pageProxy.objs) {
						if (data?.ref !== imageRef) continue;
						if (!data.dataLen) return null;
						this.commonObjs.resolve(id, structuredClone(data));
						return data.dataLen;
					}
					break;
				case "FontPath":
					this.commonObjs.resolve(id, new FontPathInfo(exportedData));
					break;
				case "Image":
					this.commonObjs.resolve(id, exportedData);
					break;
				case "Pattern":
					const pattern = new PatternInfo(exportedData);
					this.commonObjs.resolve(id, pattern.getIR());
					break;
				default: throw new Error(`Got unknown common object type ${type}`);
			}
			return null;
		});
		messageHandler.on("obj", ([id, pageIndex, type, imageData]) => {
			if (this.destroyed) return;
			const pageProxy = _classPrivateFieldGet2(_pageCache, this).get(pageIndex);
			if (pageProxy.objs.has(id)) return;
			if (pageProxy._intentStates.size === 0) {
				imageData?.bitmap?.close();
				return;
			}
			switch (type) {
				case "Image":
				case "Pattern":
					pageProxy.objs.resolve(id, imageData);
					break;
				default: throw new Error(`Got unknown object type ${type}`);
			}
		});
		messageHandler.on("DocProgress", (data) => {
			if (this.destroyed) return;
			_assertClassBrand(_WorkerTransport_brand, this, _onProgress3).call(this, data);
		});
		messageHandler.on("PrepareWebGPU", () => {
			if (this.destroyed) return;
			initWebGPUMesh();
		});
		messageHandler.on("FetchBinaryData", async (data) => {
			if (this.destroyed) throw new Error("Worker was destroyed.");
			if (!this.binaryDataFactory) throw new Error("`BinaryDataFactory` not initialized, see the `useWorkerFetch` parameter.");
			return this.binaryDataFactory.fetch(data);
		});
	}
	getData() {
		return this.messageHandler.sendWithPromise("GetData", null);
	}
	saveDocument() {
		if (this.annotationStorage.size <= 0) warn("saveDocument called while `annotationStorage` is empty, please use the getData-method instead.");
		const { map, transfer } = this.annotationStorage.serializable;
		return this.messageHandler.sendWithPromise("SaveDocument", {
			isPureXfa: !!this._htmlForXfa,
			numPages: this._numPages,
			annotationStorage: map,
			filename: _classPrivateFieldGet2(_fullReader, this)?.filename ?? null
		}, transfer).finally(() => {
			this.annotationStorage.resetModified();
		});
	}
	extractPages(pageInfos) {
		const params = { pageInfos };
		let transfer;
		if (this.annotationStorage.size > 0) {
			const { map, transfer: t } = this.annotationStorage.serializable;
			params.annotationStorage = map;
			transfer = t;
		}
		return this.messageHandler.sendWithPromise("ExtractPages", params, transfer).finally(() => {
			this.annotationStorage.resetModified();
		});
	}
	getPage(pageNumber) {
		if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this.pagesMapper.pagesNumber) return Promise.reject(/* @__PURE__ */ new Error("Invalid page request."));
		const pageIndex = pageNumber - 1;
		const newPageIndex = this.pagesMapper.getPageId(pageNumber) - 1;
		const cachedPromise = _classPrivateFieldGet2(_pagePromises, this).get(pageIndex);
		if (cachedPromise) return cachedPromise;
		const promise = this.messageHandler.sendWithPromise("GetPage", { pageIndex: newPageIndex }).then((pageInfo) => {
			if (this.destroyed) throw new Error("Transport destroyed");
			if (pageInfo.refStr) _classPrivateFieldGet2(_pageRefCache, this).set(pageInfo.refStr, newPageIndex);
			const page = new PDFPageProxy(pageIndex, pageInfo, this, this.pagesMapper, this._params.pdfBug);
			_classPrivateFieldGet2(_pageCache, this).set(pageIndex, page);
			return page;
		});
		_classPrivateFieldGet2(_pagePromises, this).set(pageIndex, promise);
		return promise;
	}
	async getPageIndex(ref) {
		if (!isRefProxy(ref)) throw new Error("Invalid pageIndex request.");
		const index = await this.messageHandler.sendWithPromise("GetPageIndex", {
			num: ref.num,
			gen: ref.gen
		});
		const pageNumber = this.pagesMapper.getPageNumber(index + 1);
		if (pageNumber === 0) throw new Error("GetPageIndex: page has been removed.");
		return pageNumber - 1;
	}
	getAnnotations(pageIndex, intent) {
		return this.messageHandler.sendWithPromise("GetAnnotations", {
			pageIndex: this.pagesMapper.getPageId(pageIndex + 1) - 1,
			intent
		});
	}
	getFieldObjects() {
		return _assertClassBrand(_WorkerTransport_brand, this, _cacheSimpleMethod).call(this, "GetFieldObjects");
	}
	hasJSActions() {
		return _assertClassBrand(_WorkerTransport_brand, this, _cacheSimpleMethod).call(this, "HasJSActions");
	}
	getCalculationOrderIds() {
		return this.messageHandler.sendWithPromise("GetCalculationOrderIds", null);
	}
	getDestinations() {
		return this.messageHandler.sendWithPromise("GetDestinations", null);
	}
	getDestination(id) {
		if (typeof id !== "string") return Promise.reject(/* @__PURE__ */ new Error("Invalid destination request."));
		return this.messageHandler.sendWithPromise("GetDestination", { id });
	}
	getPageLabels() {
		return this.messageHandler.sendWithPromise("GetPageLabels", null);
	}
	getPageLayout() {
		return this.messageHandler.sendWithPromise("GetPageLayout", null);
	}
	getPageMode() {
		return this.messageHandler.sendWithPromise("GetPageMode", null);
	}
	getViewerPreferences() {
		return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
	}
	getOpenAction() {
		return this.messageHandler.sendWithPromise("GetOpenAction", null);
	}
	getAttachments() {
		return this.messageHandler.sendWithPromise("GetAttachments", null);
	}
	getAnnotationsByType(types, pageIndexesToSkip) {
		return this.messageHandler.sendWithPromise("GetAnnotationsByType", {
			types,
			pageIndexesToSkip
		});
	}
	getDocJSActions() {
		return _assertClassBrand(_WorkerTransport_brand, this, _cacheSimpleMethod).call(this, "GetDocJSActions");
	}
	getPageJSActions(pageIndex) {
		return this.messageHandler.sendWithPromise("GetPageJSActions", { pageIndex: this.pagesMapper.getPageId(pageIndex + 1) - 1 });
	}
	getStructTree(pageIndex) {
		return this.messageHandler.sendWithPromise("GetStructTree", { pageIndex: this.pagesMapper.getPageId(pageIndex + 1) - 1 });
	}
	getOutline() {
		return this.messageHandler.sendWithPromise("GetOutline", null);
	}
	getOptionalContentConfig(renderingIntent) {
		return _assertClassBrand(_WorkerTransport_brand, this, _cacheSimpleMethod).call(this, "GetOptionalContentConfig").then((data) => new OptionalContentConfig(data, renderingIntent));
	}
	getPermissions() {
		return this.messageHandler.sendWithPromise("GetPermissions", null);
	}
	getMetadata() {
		const name = "GetMetadata";
		return _classPrivateFieldGet2(_methodPromises, this).getOrInsertComputed(name, () => this.messageHandler.sendWithPromise(name, null).then((results) => ({
			info: results[0],
			metadata: results[1] ? new Metadata(results[1]) : null,
			contentDispositionFilename: _classPrivateFieldGet2(_fullReader, this)?.filename ?? null,
			contentLength: _classPrivateFieldGet2(_fullReader, this)?.contentLength ?? null,
			hasStructTree: results[2]
		})));
	}
	getMarkInfo() {
		return this.messageHandler.sendWithPromise("GetMarkInfo", null);
	}
	getRawData(data) {
		return this.messageHandler.sendWithPromise("GetRawData", data);
	}
	async startCleanup(keepLoadedFonts = false) {
		if (this.destroyed) return;
		await this.messageHandler.sendWithPromise("Cleanup", null);
		for (const page of _classPrivateFieldGet2(_pageCache, this).values()) if (!page.cleanup()) throw new Error(`startCleanup: Page ${page.pageNumber} is currently rendering.`);
		this.commonObjs.clear();
		if (!keepLoadedFonts) this.fontLoader.clear();
		_classPrivateFieldGet2(_methodPromises, this).clear();
		this.filterFactory.destroy(true);
		TextLayer.cleanup();
	}
	cachedPageNumber(ref) {
		if (!isRefProxy(ref)) return null;
		const refStr = ref.gen === 0 ? `${ref.num}R` : `${ref.num}R${ref.gen}`;
		const pageIndex = _classPrivateFieldGet2(_pageRefCache, this).get(refStr);
		if (pageIndex >= 0) {
			const pageNumber = this.pagesMapper.getPageNumber(pageIndex + 1);
			if (pageNumber !== 0) return pageNumber;
		}
		return null;
	}
};
function _cacheSimpleMethod(name, data = null) {
	return _classPrivateFieldGet2(_methodPromises, this).getOrInsertComputed(name, () => this.messageHandler.sendWithPromise(name, data));
}
function _onProgress3({ loaded, total }) {
	this.loadingTask.onProgress?.({
		loaded,
		total,
		percent: total ? MathClamp(Math.round(loaded / total * 100), 0, 100) : NaN
	});
}
var RenderTask = class {
	constructor(internalRenderTask) {
		_defineProperty(this, "_internalRenderTask", null);
		_defineProperty(this, "onContinue", null);
		_defineProperty(this, "onError", null);
		this._internalRenderTask = internalRenderTask;
	}
	get promise() {
		return this._internalRenderTask.capability.promise;
	}
	cancel(extraDelay = 0) {
		this._internalRenderTask.cancel(null, extraDelay);
	}
	get separateAnnots() {
		const { separateAnnots } = this._internalRenderTask.operatorList;
		if (!separateAnnots) return false;
		const { annotationCanvasMap } = this._internalRenderTask;
		return separateAnnots.form || separateAnnots.canvas && annotationCanvasMap?.size > 0;
	}
	get imageCoordinates() {
		return this._internalRenderTask.imageCoordinates || null;
	}
};
var _rAF = /* @__PURE__ */ new WeakMap();
var InternalRenderTask = class {
	constructor({ callback, params, objs, commonObjs, annotationCanvasMap, operatorList, pageIndex, canvasFactory, filterFactory, useRequestAnimationFrame = false, pdfBug = false, pageColors = null, enableHWA = false, operationsFilter = null }) {
		_classPrivateFieldInitSpec(this, _rAF, null);
		this.callback = callback;
		this.params = params;
		this.objs = objs;
		this.commonObjs = commonObjs;
		this.annotationCanvasMap = annotationCanvasMap;
		this.operatorListIdx = null;
		this.operatorList = operatorList;
		this._pageIndex = pageIndex;
		this.canvasFactory = canvasFactory;
		this.filterFactory = filterFactory;
		this._pdfBug = pdfBug;
		this.pageColors = pageColors;
		this.running = false;
		this.graphicsReadyCallback = null;
		this.graphicsReady = false;
		this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
		this.cancelled = false;
		this.capability = Promise.withResolvers();
		this.task = new RenderTask(this);
		this._cancelBound = this.cancel.bind(this);
		this._continueBound = this._continue.bind(this);
		this._scheduleNextBound = this._scheduleNext.bind(this);
		this._nextBound = this._next.bind(this);
		this._canvas = params.canvas;
		this._canvasContext = params.canvas ? null : params.canvasContext;
		this._enableHWA = enableHWA;
		this._dependencyTracker = params.dependencyTracker;
		this._imagesTracker = params.imagesTracker;
		this._operationsFilter = operationsFilter;
	}
	get completed() {
		return this.capability.promise.catch(function() {});
	}
	initializeGraphics({ transparency = false, optionalContentConfig }) {
		if (this.cancelled) return;
		if (this._canvas) {
			if (_canvasInUse._.has(this._canvas)) throw new Error("Cannot use the same canvas during multiple render() operations. Use different canvas or ensure previous operations were cancelled or completed.");
			_canvasInUse._.add(this._canvas);
		}
		if (this._pdfBug && globalThis.StepperManager?.enabled) {
			this.stepper = globalThis.StepperManager.create(this._pageIndex);
			this.stepper.init(this.operatorList);
			this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
		}
		const { viewport, transform, background, dependencyTracker, imagesTracker } = this.params;
		const canvasContext = this._canvasContext || this._canvas.getContext("2d", {
			alpha: false,
			willReadFrequently: !this._enableHWA
		});
		this.gfx = new CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, { optionalContentConfig }, this.annotationCanvasMap, this.pageColors, dependencyTracker, imagesTracker);
		this.gfx.beginDrawing({
			transform,
			viewport,
			transparency,
			background
		});
		this.operatorListIdx = 0;
		this.graphicsReady = true;
		this.graphicsReadyCallback?.();
	}
	cancel(error = null, extraDelay = 0) {
		this.running = false;
		this.cancelled = true;
		this.gfx?.endDrawing();
		if (_classPrivateFieldGet2(_rAF, this)) {
			window.cancelAnimationFrame(_classPrivateFieldGet2(_rAF, this));
			_classPrivateFieldSet2(_rAF, this, null);
		}
		_canvasInUse._.delete(this._canvas);
		error || (error = new RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, extraDelay));
		this.callback(error);
		this.task.onError?.(error);
	}
	operatorListChanged() {
		if (!this.graphicsReady) {
			this.graphicsReadyCallback || (this.graphicsReadyCallback = this._continueBound);
			return;
		}
		this.gfx.dependencyTracker?.growOperationsCount(this.operatorList.fnArray.length);
		this.stepper?.updateOperatorList(this.operatorList);
		if (this.running) return;
		this._continue();
	}
	_continue() {
		this.running = true;
		if (this.cancelled) return;
		if (this.task.onContinue) this.task.onContinue(this._scheduleNextBound);
		else this._scheduleNext();
	}
	_scheduleNext() {
		if (this._useRequestAnimationFrame) _classPrivateFieldSet2(_rAF, this, window.requestAnimationFrame(() => {
			_classPrivateFieldSet2(_rAF, this, null);
			this._nextBound().catch(this._cancelBound);
		}));
		else Promise.resolve().then(this._nextBound).catch(this._cancelBound);
	}
	async _next() {
		if (this.cancelled) return;
		this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper, this._operationsFilter);
		if (this.operatorListIdx === this.operatorList.argsArray.length) {
			this.running = false;
			if (this.operatorList.lastChunk) {
				this.gfx.endDrawing();
				_canvasInUse._.delete(this._canvas);
				this.callback();
			}
		}
	}
};
var _canvasInUse = { _: /* @__PURE__ */ new WeakSet() };
var version = "5.6.205";
var build = "ada343803";
var _button = /* @__PURE__ */ new WeakMap();
var _buttonSwatch = /* @__PURE__ */ new WeakMap();
var _defaultColor = /* @__PURE__ */ new WeakMap();
var _dropdown = /* @__PURE__ */ new WeakMap();
var _dropdownWasFromKeyboard = /* @__PURE__ */ new WeakMap();
var _isMainColorPicker = /* @__PURE__ */ new WeakMap();
var _editor4 = /* @__PURE__ */ new WeakMap();
var _eventBus = /* @__PURE__ */ new WeakMap();
var _openDropdownAC = /* @__PURE__ */ new WeakMap();
var _uiManager3 = /* @__PURE__ */ new WeakMap();
var _ColorPicker_brand = /* @__PURE__ */ new WeakSet();
var ColorPicker = class ColorPicker {
	static get _keyboardManager() {
		return shadow(this, "_keyboardManager", new KeyboardManager([
			[["Escape", "mac+Escape"], ColorPicker.prototype._hideDropdownFromKeyboard],
			[[" ", "mac+ "], ColorPicker.prototype._colorSelectFromKeyboard],
			[[
				"ArrowDown",
				"ArrowRight",
				"mac+ArrowDown",
				"mac+ArrowRight"
			], ColorPicker.prototype._moveToNext],
			[[
				"ArrowUp",
				"ArrowLeft",
				"mac+ArrowUp",
				"mac+ArrowLeft"
			], ColorPicker.prototype._moveToPrevious],
			[["Home", "mac+Home"], ColorPicker.prototype._moveToBeginning],
			[["End", "mac+End"], ColorPicker.prototype._moveToEnd]
		]));
	}
	constructor({ editor = null, uiManager = null }) {
		_classPrivateMethodInitSpec(this, _ColorPicker_brand);
		_classPrivateFieldInitSpec(this, _button, null);
		_classPrivateFieldInitSpec(this, _buttonSwatch, null);
		_classPrivateFieldInitSpec(this, _defaultColor, void 0);
		_classPrivateFieldInitSpec(this, _dropdown, null);
		_classPrivateFieldInitSpec(this, _dropdownWasFromKeyboard, false);
		_classPrivateFieldInitSpec(this, _isMainColorPicker, false);
		_classPrivateFieldInitSpec(this, _editor4, null);
		_classPrivateFieldInitSpec(this, _eventBus, void 0);
		_classPrivateFieldInitSpec(this, _openDropdownAC, null);
		_classPrivateFieldInitSpec(this, _uiManager3, null);
		if (editor) {
			_classPrivateFieldSet2(_isMainColorPicker, this, false);
			_classPrivateFieldSet2(_editor4, this, editor);
		} else _classPrivateFieldSet2(_isMainColorPicker, this, true);
		_classPrivateFieldSet2(_uiManager3, this, editor?._uiManager || uiManager);
		_classPrivateFieldSet2(_eventBus, this, _classPrivateFieldGet2(_uiManager3, this)._eventBus);
		_classPrivateFieldSet2(_defaultColor, this, editor?.color?.toUpperCase() || _classPrivateFieldGet2(_uiManager3, this)?.highlightColors.values().next().value || "#FFFF98");
		_l10nColor._ || (_l10nColor._ = Object.freeze({
			blue: "pdfjs-editor-colorpicker-blue",
			green: "pdfjs-editor-colorpicker-green",
			pink: "pdfjs-editor-colorpicker-pink",
			red: "pdfjs-editor-colorpicker-red",
			yellow: "pdfjs-editor-colorpicker-yellow"
		}));
	}
	renderButton() {
		const button = _classPrivateFieldSet2(_button, this, document.createElement("button"));
		button.className = "colorPicker";
		button.tabIndex = "0";
		button.setAttribute("data-l10n-id", "pdfjs-editor-colorpicker-button");
		button.ariaHasPopup = "true";
		if (_classPrivateFieldGet2(_editor4, this)) button.ariaControls = `${_classPrivateFieldGet2(_editor4, this).id}_colorpicker_dropdown`;
		const signal = _classPrivateFieldGet2(_uiManager3, this)._signal;
		button.addEventListener("click", _assertClassBrand(_ColorPicker_brand, this, _openDropdown).bind(this), { signal });
		button.addEventListener("keydown", _assertClassBrand(_ColorPicker_brand, this, _keyDown).bind(this), { signal });
		const swatch = _classPrivateFieldSet2(_buttonSwatch, this, document.createElement("span"));
		swatch.className = "swatch";
		swatch.ariaHidden = "true";
		swatch.style.backgroundColor = _classPrivateFieldGet2(_defaultColor, this);
		button.append(swatch);
		return button;
	}
	renderMainDropdown() {
		const dropdown = _classPrivateFieldSet2(_dropdown, this, _assertClassBrand(_ColorPicker_brand, this, _getDropdownRoot).call(this));
		dropdown.ariaOrientation = "horizontal";
		dropdown.ariaLabelledBy = "highlightColorPickerLabel";
		return dropdown;
	}
	_colorSelectFromKeyboard(event) {
		if (event.target === _classPrivateFieldGet2(_button, this)) {
			_assertClassBrand(_ColorPicker_brand, this, _openDropdown).call(this, event);
			return;
		}
		const color = event.target.getAttribute("data-color");
		if (!color) return;
		_assertClassBrand(_ColorPicker_brand, this, _colorSelect).call(this, color, event);
	}
	_moveToNext(event) {
		if (!_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) {
			_assertClassBrand(_ColorPicker_brand, this, _openDropdown).call(this, event);
			return;
		}
		if (event.target === _classPrivateFieldGet2(_button, this)) {
			_classPrivateFieldGet2(_dropdown, this).firstElementChild?.focus();
			return;
		}
		event.target.nextSibling?.focus();
	}
	_moveToPrevious(event) {
		if (event.target === _classPrivateFieldGet2(_dropdown, this)?.firstElementChild || event.target === _classPrivateFieldGet2(_button, this)) {
			if (_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) this._hideDropdownFromKeyboard();
			return;
		}
		if (!_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) _assertClassBrand(_ColorPicker_brand, this, _openDropdown).call(this, event);
		event.target.previousSibling?.focus();
	}
	_moveToBeginning(event) {
		if (!_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) {
			_assertClassBrand(_ColorPicker_brand, this, _openDropdown).call(this, event);
			return;
		}
		_classPrivateFieldGet2(_dropdown, this).firstElementChild?.focus();
	}
	_moveToEnd(event) {
		if (!_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) {
			_assertClassBrand(_ColorPicker_brand, this, _openDropdown).call(this, event);
			return;
		}
		_classPrivateFieldGet2(_dropdown, this).lastElementChild?.focus();
	}
	hideDropdown() {
		_classPrivateFieldGet2(_dropdown, this)?.classList.add("hidden");
		_classPrivateFieldGet2(_button, this).ariaExpanded = "false";
		_classPrivateFieldGet2(_openDropdownAC, this)?.abort();
		_classPrivateFieldSet2(_openDropdownAC, this, null);
	}
	_hideDropdownFromKeyboard() {
		if (_classPrivateFieldGet2(_isMainColorPicker, this)) return;
		if (!_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) {
			_classPrivateFieldGet2(_editor4, this)?.unselect();
			return;
		}
		this.hideDropdown();
		_classPrivateFieldGet2(_button, this).focus({
			preventScroll: true,
			focusVisible: _classPrivateFieldGet2(_dropdownWasFromKeyboard, this)
		});
	}
	updateColor(color) {
		if (_classPrivateFieldGet2(_buttonSwatch, this)) _classPrivateFieldGet2(_buttonSwatch, this).style.backgroundColor = color;
		if (!_classPrivateFieldGet2(_dropdown, this)) return;
		const i = _classPrivateFieldGet2(_uiManager3, this).highlightColors.values();
		for (const child of _classPrivateFieldGet2(_dropdown, this).children) child.ariaSelected = i.next().value === color.toUpperCase();
	}
	destroy() {
		_classPrivateFieldGet2(_button, this)?.remove();
		_classPrivateFieldSet2(_button, this, null);
		_classPrivateFieldSet2(_buttonSwatch, this, null);
		_classPrivateFieldGet2(_dropdown, this)?.remove();
		_classPrivateFieldSet2(_dropdown, this, null);
	}
};
_ColorPicker = ColorPicker;
function _getDropdownRoot() {
	const div = document.createElement("div");
	const signal = _classPrivateFieldGet2(_uiManager3, this)._signal;
	div.addEventListener("contextmenu", noContextMenu, { signal });
	div.className = "dropdown";
	div.role = "listbox";
	div.ariaMultiSelectable = "false";
	div.ariaOrientation = "vertical";
	div.setAttribute("data-l10n-id", "pdfjs-editor-colorpicker-dropdown");
	if (_classPrivateFieldGet2(_editor4, this)) div.id = `${_classPrivateFieldGet2(_editor4, this).id}_colorpicker_dropdown`;
	for (const [name, color] of _classPrivateFieldGet2(_uiManager3, this).highlightColors) {
		const button = document.createElement("button");
		button.tabIndex = "0";
		button.role = "option";
		button.setAttribute("data-color", color);
		button.title = name;
		button.setAttribute("data-l10n-id", _l10nColor._[name]);
		const swatch = document.createElement("span");
		button.append(swatch);
		swatch.className = "swatch";
		swatch.style.backgroundColor = color;
		button.ariaSelected = color === _classPrivateFieldGet2(_defaultColor, this);
		button.addEventListener("click", _assertClassBrand(_ColorPicker_brand, this, _colorSelect).bind(this, color), { signal });
		div.append(button);
	}
	div.addEventListener("keydown", _assertClassBrand(_ColorPicker_brand, this, _keyDown).bind(this), { signal });
	return div;
}
function _colorSelect(color, event) {
	event.stopPropagation();
	_classPrivateFieldGet2(_eventBus, this).dispatch("switchannotationeditorparams", {
		source: this,
		type: AnnotationEditorParamsType.HIGHLIGHT_COLOR,
		value: color
	});
	this.updateColor(color);
}
function _keyDown(event) {
	_ColorPicker._keyboardManager.exec(this, event);
}
function _openDropdown(event) {
	if (_get_isDropdownVisible.call(_assertClassBrand(_ColorPicker_brand, this))) {
		this.hideDropdown();
		return;
	}
	_classPrivateFieldSet2(_dropdownWasFromKeyboard, this, event.detail === 0);
	if (!_classPrivateFieldGet2(_openDropdownAC, this)) {
		_classPrivateFieldSet2(_openDropdownAC, this, new AbortController());
		window.addEventListener("pointerdown", _assertClassBrand(_ColorPicker_brand, this, _pointerDown2).bind(this), { signal: _classPrivateFieldGet2(_uiManager3, this).combinedSignal(_classPrivateFieldGet2(_openDropdownAC, this)) });
	}
	_classPrivateFieldGet2(_button, this).ariaExpanded = "true";
	if (_classPrivateFieldGet2(_dropdown, this)) {
		_classPrivateFieldGet2(_dropdown, this).classList.remove("hidden");
		return;
	}
	const root = _classPrivateFieldSet2(_dropdown, this, _assertClassBrand(_ColorPicker_brand, this, _getDropdownRoot).call(this));
	_classPrivateFieldGet2(_button, this).append(root);
}
function _pointerDown2(event) {
	if (_classPrivateFieldGet2(_dropdown, this)?.contains(event.target)) return;
	this.hideDropdown();
}
function _get_isDropdownVisible() {
	return _classPrivateFieldGet2(_dropdown, this) && !_classPrivateFieldGet2(_dropdown, this).classList.contains("hidden");
}
var _l10nColor = { _: null };
var _input = /* @__PURE__ */ new WeakMap();
var _editor5 = /* @__PURE__ */ new WeakMap();
var _uiManager4 = /* @__PURE__ */ new WeakMap();
var BasicColorPicker = class {
	constructor(editor) {
		_classPrivateFieldInitSpec(this, _input, null);
		_classPrivateFieldInitSpec(this, _editor5, null);
		_classPrivateFieldInitSpec(this, _uiManager4, null);
		_classPrivateFieldSet2(_editor5, this, editor);
		_classPrivateFieldSet2(_uiManager4, this, editor._uiManager);
		_l10nColor2._ || (_l10nColor2._ = Object.freeze({
			freetext: "pdfjs-editor-color-picker-free-text-input",
			ink: "pdfjs-editor-color-picker-ink-input"
		}));
	}
	renderButton() {
		if (_classPrivateFieldGet2(_input, this)) return _classPrivateFieldGet2(_input, this);
		const { editorType, colorType, color } = _classPrivateFieldGet2(_editor5, this);
		const input = _classPrivateFieldSet2(_input, this, document.createElement("input"));
		input.type = "color";
		input.value = color || "#000000";
		input.className = "basicColorPicker";
		input.tabIndex = 0;
		input.setAttribute("data-l10n-id", _l10nColor2._[editorType]);
		input.addEventListener("input", () => {
			_classPrivateFieldGet2(_uiManager4, this).updateParams(colorType, input.value);
		}, { signal: _classPrivateFieldGet2(_uiManager4, this)._signal });
		return input;
	}
	update(value) {
		if (!_classPrivateFieldGet2(_input, this)) return;
		_classPrivateFieldGet2(_input, this).value = value;
	}
	destroy() {
		_classPrivateFieldGet2(_input, this)?.remove();
		_classPrivateFieldSet2(_input, this, null);
	}
	hideDropdown() {}
};
var _l10nColor2 = { _: null };
function makeColorComp(n) {
	return Math.floor(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0");
}
function scaleAndClamp(x) {
	return Math.max(0, Math.min(255, 255 * x));
}
var ColorConverters = class {
	static CMYK_G([c, y, m, k]) {
		return ["G", 1 - Math.min(1, .3 * c + .59 * m + .11 * y + k)];
	}
	static G_CMYK([g]) {
		return [
			"CMYK",
			0,
			0,
			0,
			1 - g
		];
	}
	static G_RGB([g]) {
		return [
			"RGB",
			g,
			g,
			g
		];
	}
	static G_rgb([g]) {
		g = scaleAndClamp(g);
		return [
			g,
			g,
			g
		];
	}
	static G_HTML([g]) {
		const G = makeColorComp(g);
		return `#${G}${G}${G}`;
	}
	static RGB_G([r, g, b]) {
		return ["G", .3 * r + .59 * g + .11 * b];
	}
	static RGB_rgb(color) {
		return color.map(scaleAndClamp);
	}
	static RGB_HTML(color) {
		return `#${color.map(makeColorComp).join("")}`;
	}
	static T_HTML() {
		return "#00000000";
	}
	static T_rgb() {
		return [null];
	}
	static CMYK_RGB([c, y, m, k]) {
		return [
			"RGB",
			1 - Math.min(1, c + k),
			1 - Math.min(1, m + k),
			1 - Math.min(1, y + k)
		];
	}
	static CMYK_rgb([c, y, m, k]) {
		return [
			scaleAndClamp(1 - Math.min(1, c + k)),
			scaleAndClamp(1 - Math.min(1, m + k)),
			scaleAndClamp(1 - Math.min(1, y + k))
		];
	}
	static CMYK_HTML(components) {
		const rgb = this.CMYK_RGB(components).slice(1);
		return this.RGB_HTML(rgb);
	}
	static RGB_CMYK([r, g, b]) {
		const c = 1 - r;
		const m = 1 - g;
		const y = 1 - b;
		return [
			"CMYK",
			c,
			m,
			y,
			Math.min(c, m, y)
		];
	}
};
var BaseSVGFactory = class {
	create(width, height, skipDimensions = false) {
		if (width <= 0 || height <= 0) throw new Error("Invalid SVG dimensions");
		const svg = this._createSVG("svg:svg");
		svg.setAttribute("version", "1.1");
		if (!skipDimensions) {
			svg.setAttribute("width", `${width}px`);
			svg.setAttribute("height", `${height}px`);
		}
		svg.setAttribute("preserveAspectRatio", "none");
		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
		return svg;
	}
	createElement(type) {
		if (typeof type !== "string") throw new Error("Invalid SVG element type");
		return this._createSVG(type);
	}
	_createSVG(type) {
		unreachable("Abstract method `_createSVG` called.");
	}
};
var DOMSVGFactory = class extends BaseSVGFactory {
	_createSVG(type) {
		return document.createElementNS(SVG_NS, type);
	}
};
var annotation_layer_DEFAULT_FONT_SIZE = 9;
var GetElementsByNameSet = /* @__PURE__ */ new WeakSet();
var TIMEZONE_OFFSET = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60 * 1e3;
var AnnotationElementFactory = class {
	static create(parameters) {
		switch (parameters.data.annotationType) {
			case AnnotationType.LINK: return new LinkAnnotationElement(parameters);
			case AnnotationType.TEXT: return new TextAnnotationElement(parameters);
			case AnnotationType.WIDGET:
				switch (parameters.data.fieldType) {
					case "Tx": return new TextWidgetAnnotationElement(parameters);
					case "Btn":
						if (parameters.data.radioButton) return new RadioButtonWidgetAnnotationElement(parameters);
						else if (parameters.data.checkBox) return new CheckboxWidgetAnnotationElement(parameters);
						return new PushButtonWidgetAnnotationElement(parameters);
					case "Ch": return new ChoiceWidgetAnnotationElement(parameters);
					case "Sig": return new SignatureWidgetAnnotationElement(parameters);
				}
				return new WidgetAnnotationElement(parameters);
			case AnnotationType.POPUP: return new PopupAnnotationElement(parameters);
			case AnnotationType.FREETEXT: return new FreeTextAnnotationElement(parameters);
			case AnnotationType.LINE: return new LineAnnotationElement(parameters);
			case AnnotationType.SQUARE: return new SquareAnnotationElement(parameters);
			case AnnotationType.CIRCLE: return new CircleAnnotationElement(parameters);
			case AnnotationType.POLYLINE: return new PolylineAnnotationElement(parameters);
			case AnnotationType.CARET: return new CaretAnnotationElement(parameters);
			case AnnotationType.INK: return new InkAnnotationElement(parameters);
			case AnnotationType.POLYGON: return new PolygonAnnotationElement(parameters);
			case AnnotationType.HIGHLIGHT: return new HighlightAnnotationElement(parameters);
			case AnnotationType.UNDERLINE: return new UnderlineAnnotationElement(parameters);
			case AnnotationType.SQUIGGLY: return new SquigglyAnnotationElement(parameters);
			case AnnotationType.STRIKEOUT: return new StrikeOutAnnotationElement(parameters);
			case AnnotationType.STAMP: return new StampAnnotationElement(parameters);
			case AnnotationType.FILEATTACHMENT: return new FileAttachmentAnnotationElement(parameters);
			default: return new AnnotationElement(parameters);
		}
	}
};
var _updates = /* @__PURE__ */ new WeakMap();
var _hasBorder = /* @__PURE__ */ new WeakMap();
var _popupElement = /* @__PURE__ */ new WeakMap();
var _AnnotationElement_brand = /* @__PURE__ */ new WeakSet();
var AnnotationElement = class AnnotationElement {
	constructor(parameters, { isRenderable = false, ignoreBorder = false, createQuadrilaterals = false } = {}) {
		_classPrivateMethodInitSpec(this, _AnnotationElement_brand);
		_classPrivateFieldInitSpec(this, _updates, null);
		_classPrivateFieldInitSpec(this, _hasBorder, false);
		_classPrivateFieldInitSpec(this, _popupElement, null);
		this.isRenderable = isRenderable;
		this.data = parameters.data;
		this.layer = parameters.layer;
		this.linkService = parameters.linkService;
		this.downloadManager = parameters.downloadManager;
		this.imageResourcesPath = parameters.imageResourcesPath;
		this.renderForms = parameters.renderForms;
		this.svgFactory = parameters.svgFactory;
		this.annotationStorage = parameters.annotationStorage;
		this.enableComment = parameters.enableComment;
		this.enableScripting = parameters.enableScripting;
		this.hasJSActions = parameters.hasJSActions;
		this._fieldObjects = parameters.fieldObjects;
		this.parent = parameters.parent;
		this.hasOwnCommentButton = false;
		if (isRenderable) this.contentElement = this.container = this._createContainer(ignoreBorder);
		if (createQuadrilaterals) this._createQuadrilaterals();
	}
	static _hasPopupData({ contentsObj, richText }) {
		return !!(contentsObj?.str || richText?.str);
	}
	get _isEditable() {
		return this.data.isEditable;
	}
	get hasPopupData() {
		return AnnotationElement._hasPopupData(this.data) || this.enableComment && !!this.commentText;
	}
	get commentData() {
		const { data } = this;
		const editor = this.annotationStorage?.getEditor(data.id);
		if (editor) return editor.getData();
		return data;
	}
	get hasCommentButton() {
		return this.enableComment && this.hasPopupElement;
	}
	get commentButtonPosition() {
		const editor = this.annotationStorage?.getEditor(this.data.id);
		if (editor) return editor.commentButtonPositionInPage;
		const { quadPoints, inkLists, rect } = this.data;
		let maxX = -Infinity;
		let maxY = -Infinity;
		if (quadPoints?.length >= 8) {
			for (let i = 0; i < quadPoints.length; i += 8) if (quadPoints[i + 1] > maxY) {
				maxY = quadPoints[i + 1];
				maxX = quadPoints[i + 2];
			} else if (quadPoints[i + 1] === maxY) maxX = Math.max(maxX, quadPoints[i + 2]);
			return [maxX, maxY];
		}
		if (inkLists?.length >= 1) {
			for (const inkList of inkLists) for (let i = 0, ii = inkList.length; i < ii; i += 2) if (inkList[i + 1] > maxY) {
				maxY = inkList[i + 1];
				maxX = inkList[i];
			} else if (inkList[i + 1] === maxY) maxX = Math.max(maxX, inkList[i]);
			if (maxX !== Infinity) return [maxX, maxY];
		}
		if (rect) return [rect[2], rect[3]];
		return null;
	}
	_normalizePoint(point) {
		const { page: { view }, viewport: { rawDims: { pageWidth, pageHeight, pageX, pageY } } } = this.parent;
		point[1] = view[3] - point[1] + view[1];
		point[0] = 100 * (point[0] - pageX) / pageWidth;
		point[1] = 100 * (point[1] - pageY) / pageHeight;
		return point;
	}
	get commentText() {
		const { data } = this;
		return this.annotationStorage.getRawValue(`${AnnotationEditorPrefix}${data.id}`)?.popup?.contents || data.contentsObj?.str || "";
	}
	set commentText(text) {
		const { data } = this;
		const popup = {
			deleted: !text,
			contents: text || ""
		};
		if (!this.annotationStorage.updateEditor(data.id, { popup })) this.annotationStorage.setValue(`${AnnotationEditorPrefix}${data.id}`, {
			id: data.id,
			annotationType: data.annotationType,
			page: this.parent.page,
			popup,
			popupRef: data.popupRef,
			modificationDate: /* @__PURE__ */ new Date()
		});
		if (!text) this.removePopup();
	}
	removePopup() {
		(_classPrivateFieldGet2(_popupElement, this)?.popup || this.popup)?.remove();
		_classPrivateFieldSet2(_popupElement, this, this.popup = null);
	}
	updateEdited(params) {
		if (!this.container) return;
		if (params.rect) _classPrivateFieldGet2(_updates, this) || _classPrivateFieldSet2(_updates, this, { rect: this.data.rect.slice(0) });
		const { rect, popup: newPopup } = params;
		if (rect) _assertClassBrand(_AnnotationElement_brand, this, _setRectEdited).call(this, rect);
		let popup = _classPrivateFieldGet2(_popupElement, this)?.popup || this.popup;
		if (!popup && newPopup?.text) {
			this._createPopup(newPopup);
			popup = _classPrivateFieldGet2(_popupElement, this).popup;
		}
		if (!popup) return;
		popup.updateEdited(params);
		if (newPopup?.deleted) {
			popup.remove();
			_classPrivateFieldSet2(_popupElement, this, null);
			this.popup = null;
		}
	}
	resetEdited() {
		if (!_classPrivateFieldGet2(_updates, this)) return;
		_assertClassBrand(_AnnotationElement_brand, this, _setRectEdited).call(this, _classPrivateFieldGet2(_updates, this).rect);
		_classPrivateFieldGet2(_popupElement, this)?.popup.resetEdited();
		_classPrivateFieldSet2(_updates, this, null);
	}
	_createContainer(ignoreBorder) {
		const { data, parent: { page, viewport } } = this;
		const container = document.createElement("section");
		container.setAttribute("data-annotation-id", data.id);
		if (!(this instanceof WidgetAnnotationElement) && !(this instanceof LinkAnnotationElement)) container.tabIndex = 0;
		const { style } = container;
		style.zIndex = this.parent.zIndex;
		this.parent.zIndex += 2;
		if (data.alternativeText) container.title = data.alternativeText;
		if (data.noRotate) container.classList.add("norotate");
		if (!data.rect || this instanceof PopupAnnotationElement) {
			const { rotation } = data;
			if (!data.hasOwnCanvas && rotation !== 0) this.setRotation(rotation, container);
			return container;
		}
		const { width, height } = this;
		if (!ignoreBorder && data.borderStyle.width > 0) {
			style.borderWidth = `${data.borderStyle.width}px`;
			const horizontalRadius = data.borderStyle.horizontalCornerRadius;
			const verticalRadius = data.borderStyle.verticalCornerRadius;
			if (horizontalRadius > 0 || verticalRadius > 0) style.borderRadius = `calc(${horizontalRadius}px * var(--total-scale-factor)) / calc(${verticalRadius}px * var(--total-scale-factor))`;
			else if (this instanceof RadioButtonWidgetAnnotationElement) style.borderRadius = `calc(${width}px * var(--total-scale-factor)) / calc(${height}px * var(--total-scale-factor))`;
			switch (data.borderStyle.style) {
				case AnnotationBorderStyleType.SOLID:
					style.borderStyle = "solid";
					break;
				case AnnotationBorderStyleType.DASHED:
					style.borderStyle = "dashed";
					break;
				case AnnotationBorderStyleType.BEVELED:
					warn("Unimplemented border style: beveled");
					break;
				case AnnotationBorderStyleType.INSET:
					warn("Unimplemented border style: inset");
					break;
				case AnnotationBorderStyleType.UNDERLINE:
					style.borderBottomStyle = "solid";
					break;
				default: break;
			}
			const borderColor = data.borderColor || null;
			if (borderColor) {
				_classPrivateFieldSet2(_hasBorder, this, true);
				style.borderColor = Util.makeHexColor(borderColor[0] | 0, borderColor[1] | 0, borderColor[2] | 0);
			} else style.borderWidth = 0;
		}
		const rect = Util.normalizeRect([
			data.rect[0],
			page.view[3] - data.rect[1] + page.view[1],
			data.rect[2],
			page.view[3] - data.rect[3] + page.view[1]
		]);
		const { pageWidth, pageHeight, pageX, pageY } = viewport.rawDims;
		style.left = `${100 * (rect[0] - pageX) / pageWidth}%`;
		style.top = `${100 * (rect[1] - pageY) / pageHeight}%`;
		const { rotation } = data;
		if (data.hasOwnCanvas || rotation === 0) {
			style.width = `${100 * width / pageWidth}%`;
			style.height = `${100 * height / pageHeight}%`;
		} else this.setRotation(rotation, container);
		return container;
	}
	setRotation(angle, container = this.container) {
		if (!this.data.rect) return;
		const { pageWidth, pageHeight } = this.parent.viewport.rawDims;
		let { width, height } = this;
		if (angle % 180 !== 0) [width, height] = [height, width];
		container.style.width = `${100 * width / pageWidth}%`;
		container.style.height = `${100 * height / pageHeight}%`;
		container.setAttribute("data-main-rotation", (360 - angle) % 360);
	}
	get _commonActions() {
		const setColor = (jsName, styleName, event) => {
			const color = event.detail[jsName];
			const colorType = color[0];
			const colorArray = color.slice(1);
			event.target.style[styleName] = ColorConverters[`${colorType}_HTML`](colorArray);
			this.annotationStorage.setValue(this.data.id, { [styleName]: ColorConverters[`${colorType}_rgb`](colorArray) });
		};
		return shadow(this, "_commonActions", {
			display: (event) => {
				const { display } = event.detail;
				const hidden = display % 2 === 1;
				this.container.style.visibility = hidden ? "hidden" : "visible";
				this.annotationStorage.setValue(this.data.id, {
					noView: hidden,
					noPrint: display === 1 || display === 2
				});
			},
			print: (event) => {
				this.annotationStorage.setValue(this.data.id, { noPrint: !event.detail.print });
			},
			hidden: (event) => {
				const { hidden } = event.detail;
				this.container.style.visibility = hidden ? "hidden" : "visible";
				this.annotationStorage.setValue(this.data.id, {
					noPrint: hidden,
					noView: hidden
				});
			},
			focus: (event) => {
				setTimeout(() => event.target.focus({ preventScroll: false }), 0);
			},
			userName: (event) => {
				event.target.title = event.detail.userName;
			},
			readonly: (event) => {
				event.target.disabled = event.detail.readonly;
			},
			required: (event) => {
				this._setRequired(event.target, event.detail.required);
			},
			bgColor: (event) => {
				setColor("bgColor", "backgroundColor", event);
			},
			fillColor: (event) => {
				setColor("fillColor", "backgroundColor", event);
			},
			fgColor: (event) => {
				setColor("fgColor", "color", event);
			},
			textColor: (event) => {
				setColor("textColor", "color", event);
			},
			borderColor: (event) => {
				setColor("borderColor", "borderColor", event);
			},
			strokeColor: (event) => {
				setColor("strokeColor", "borderColor", event);
			},
			rotation: (event) => {
				const angle = event.detail.rotation;
				this.setRotation(angle);
				this.annotationStorage.setValue(this.data.id, { rotation: angle });
			}
		});
	}
	_dispatchEventFromSandbox(actions, jsEvent) {
		const commonActions = this._commonActions;
		for (const name of Object.keys(jsEvent.detail)) (actions[name] || commonActions[name])?.(jsEvent);
	}
	_setDefaultPropertiesFromJS(element) {
		if (!this.enableScripting) return;
		const storedData = this.annotationStorage.getRawValue(this.data.id);
		if (!storedData) return;
		const commonActions = this._commonActions;
		for (const [actionName, detail] of Object.entries(storedData)) {
			const action = commonActions[actionName];
			if (action) {
				action({
					detail: { [actionName]: detail },
					target: element
				});
				delete storedData[actionName];
			}
		}
	}
	_createQuadrilaterals() {
		if (!this.container) return;
		const { quadPoints } = this.data;
		if (!quadPoints) return;
		const [rectBlX, rectBlY, rectTrX, rectTrY] = this.data.rect.map((x) => Math.fround(x));
		if (quadPoints.length === 8) {
			const [trX, trY, blX, blY] = quadPoints.subarray(2, 6);
			if (rectTrX === trX && rectTrY === trY && rectBlX === blX && rectBlY === blY) return;
		}
		const { style } = this.container;
		let svgBuffer;
		if (_classPrivateFieldGet2(_hasBorder, this)) {
			const { borderColor, borderWidth } = style;
			style.borderWidth = 0;
			svgBuffer = [
				"url('data:image/svg+xml;utf8,",
				`<svg xmlns="http://www.w3.org/2000/svg"`,
				` preserveAspectRatio="none" viewBox="0 0 1 1">`,
				`<g fill="transparent" stroke="${borderColor}" stroke-width="${borderWidth}">`
			];
			this.container.classList.add("hasBorder");
		}
		const width = rectTrX - rectBlX;
		const height = rectTrY - rectBlY;
		const { svgFactory } = this;
		const svg = svgFactory.createElement("svg");
		svg.classList.add("quadrilateralsContainer");
		svg.setAttribute("width", 0);
		svg.setAttribute("height", 0);
		svg.role = "none";
		const defs = svgFactory.createElement("defs");
		svg.append(defs);
		const clipPath = svgFactory.createElement("clipPath");
		const id = `clippath_${this.data.id}`;
		clipPath.setAttribute("id", id);
		clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
		defs.append(clipPath);
		for (let i = 2, ii = quadPoints.length; i < ii; i += 8) {
			const trX = quadPoints[i];
			const trY = quadPoints[i + 1];
			const blX = quadPoints[i + 2];
			const blY = quadPoints[i + 3];
			const rect = svgFactory.createElement("rect");
			const x = (blX - rectBlX) / width;
			const y = (rectTrY - trY) / height;
			const rectWidth = (trX - blX) / width;
			const rectHeight = (trY - blY) / height;
			rect.setAttribute("x", x);
			rect.setAttribute("y", y);
			rect.setAttribute("width", rectWidth);
			rect.setAttribute("height", rectHeight);
			clipPath.append(rect);
			svgBuffer?.push(`<rect vector-effect="non-scaling-stroke" x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}"/>`);
		}
		if (_classPrivateFieldGet2(_hasBorder, this)) {
			svgBuffer.push(`</g></svg>')`);
			style.backgroundImage = svgBuffer.join("");
		}
		this.container.append(svg);
		this.container.style.clipPath = `url(#${id})`;
	}
	_createPopup(popupData = null) {
		const { data } = this;
		let contentsObj, modificationDate;
		if (popupData) {
			contentsObj = { str: popupData.text };
			modificationDate = popupData.date;
		} else {
			contentsObj = data.contentsObj;
			modificationDate = data.modificationDate;
		}
		_classPrivateFieldSet2(_popupElement, this, new PopupAnnotationElement({
			data: {
				color: data.color,
				titleObj: data.titleObj,
				modificationDate,
				contentsObj,
				richText: data.richText,
				parentRect: data.rect,
				borderStyle: 0,
				id: `popup_${data.id}`,
				rotation: data.rotation,
				noRotate: true
			},
			linkService: this.linkService,
			parent: this.parent,
			elements: [this]
		}));
	}
	get hasPopupElement() {
		return !!(_classPrivateFieldGet2(_popupElement, this) || this.popup || this.data.popupRef);
	}
	get extraPopupElement() {
		return _classPrivateFieldGet2(_popupElement, this);
	}
	render() {
		unreachable("Abstract method `AnnotationElement.render` called");
	}
	_getElementsByName(name, skipId = null) {
		const fields = [];
		if (this._fieldObjects) {
			const fieldObj = this._fieldObjects[name];
			if (fieldObj) for (const { page, id, exportValues } of fieldObj) {
				if (page === -1) continue;
				if (id === skipId) continue;
				const exportValue = typeof exportValues === "string" ? exportValues : null;
				const domElement = document.querySelector(`[data-element-id="${id}"]`);
				if (domElement && !GetElementsByNameSet.has(domElement)) {
					warn(`_getElementsByName - element not allowed: ${id}`);
					continue;
				}
				fields.push({
					id,
					exportValue,
					domElement
				});
			}
			return fields;
		}
		for (const domElement of document.getElementsByName(name)) {
			const { exportValue } = domElement;
			const id = domElement.getAttribute("data-element-id");
			if (id === skipId) continue;
			if (!GetElementsByNameSet.has(domElement)) continue;
			fields.push({
				id,
				exportValue,
				domElement
			});
		}
		return fields;
	}
	show() {
		if (this.container) this.container.hidden = false;
		this.popup?.maybeShow();
	}
	hide() {
		if (this.container) this.container.hidden = true;
		this.popup?.forceHide();
	}
	getElementsToTriggerPopup() {
		return this.container;
	}
	addHighlightArea() {
		const triggers = this.getElementsToTriggerPopup();
		if (Array.isArray(triggers)) for (const element of triggers) element.classList.add("highlightArea");
		else triggers.classList.add("highlightArea");
	}
	_editOnDoubleClick() {
		if (!this._isEditable) return;
		const { annotationEditorType: mode, data: { id: editId } } = this;
		this.container.addEventListener("dblclick", () => {
			this.linkService.eventBus?.dispatch("switchannotationeditormode", {
				source: this,
				mode,
				editId,
				mustEnterInEditMode: true
			});
		});
	}
	get width() {
		return this.data.rect[2] - this.data.rect[0];
	}
	get height() {
		return this.data.rect[3] - this.data.rect[1];
	}
};
function _setRectEdited(rect) {
	const { container: { style }, data: { rect: currentRect, rotation }, parent: { viewport: { rawDims: { pageWidth, pageHeight, pageX, pageY } } } } = this;
	currentRect?.splice(0, 4, ...rect);
	style.left = `${100 * (rect[0] - pageX) / pageWidth}%`;
	style.top = `${100 * (pageHeight - rect[3] + pageY) / pageHeight}%`;
	if (rotation === 0) {
		style.width = `${100 * (rect[2] - rect[0]) / pageWidth}%`;
		style.height = `${100 * (rect[3] - rect[1]) / pageHeight}%`;
	} else this.setRotation(rotation);
}
var EditorAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		this.editor = parameters.editor;
	}
	render() {
		this.container.className = "editorAnnotation";
		return this.container;
	}
	createOrUpdatePopup() {
		const { editor } = this;
		if (!editor.hasComment) return;
		this._createPopup(editor.comment);
	}
	get hasCommentButton() {
		return this.enableComment && this.editor.hasComment;
	}
	get commentButtonPosition() {
		return this.editor.commentButtonPositionInPage;
	}
	get commentText() {
		return this.editor.comment.text;
	}
	set commentText(text) {
		this.editor.comment = text;
		if (!text) this.removePopup();
	}
	get commentData() {
		return this.editor.getData();
	}
	remove() {
		this.parent.removeAnnotation(this.data.id);
		this.container.remove();
		this.container = null;
		this.removePopup();
	}
};
var _LinkAnnotationElement_brand = /* @__PURE__ */ new WeakSet();
var LinkAnnotationElement = class extends AnnotationElement {
	constructor(parameters, options = null) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: !!options?.ignoreBorder,
			createQuadrilaterals: true
		});
		_classPrivateMethodInitSpec(this, _LinkAnnotationElement_brand);
		this.isTooltipOnly = parameters.data.isTooltipOnly;
	}
	render() {
		const { data, linkService } = this;
		const link = document.createElement("a");
		link.setAttribute("data-element-id", data.id);
		let isBound = false;
		if (data.url) {
			linkService.addLinkAttributes(link, data.url, data.newWindow);
			isBound = true;
		} else if (data.action) {
			this._bindNamedAction(link, data.action, data.overlaidText);
			isBound = true;
		} else if (data.attachment) {
			_assertClassBrand(_LinkAnnotationElement_brand, this, _bindAttachment).call(this, link, data.attachment, data.overlaidText, data.attachmentDest);
			isBound = true;
		} else if (data.setOCGState) {
			_assertClassBrand(_LinkAnnotationElement_brand, this, _bindSetOCGState).call(this, link, data.setOCGState, data.overlaidText);
			isBound = true;
		} else if (data.dest) {
			this._bindLink(link, data.dest, data.overlaidText);
			isBound = true;
		} else {
			if (data.actions && (data.actions.Action || data.actions["Mouse Up"] || data.actions["Mouse Down"]) && this.enableScripting && this.hasJSActions) {
				this._bindJSAction(link, data);
				isBound = true;
			}
			if (data.resetForm) {
				this._bindResetFormAction(link, data.resetForm);
				isBound = true;
			} else if (this.isTooltipOnly && !isBound) {
				this._bindLink(link, "");
				isBound = true;
			}
		}
		this.container.classList.add("linkAnnotation");
		if (isBound) {
			this.contentElement = link;
			this.container.append(link);
		}
		return this.container;
	}
	_bindLink(link, destination, overlaidText = "") {
		link.href = this.linkService.getDestinationHash(destination);
		link.onclick = () => {
			if (destination) this.linkService.goToDestination(destination);
			return false;
		};
		if (destination || destination === "") _assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
		if (overlaidText) link.title = overlaidText;
	}
	_bindNamedAction(link, action, overlaidText = "") {
		link.href = this.linkService.getAnchorUrl("");
		link.onclick = () => {
			this.linkService.executeNamedAction(action);
			return false;
		};
		if (overlaidText) link.title = overlaidText;
		_assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
	}
	_bindJSAction(link, data) {
		link.href = this.linkService.getAnchorUrl("");
		const map = /* @__PURE__ */ new Map([
			["Action", "onclick"],
			["Mouse Up", "onmouseup"],
			["Mouse Down", "onmousedown"]
		]);
		for (const name of Object.keys(data.actions)) {
			const jsName = map.get(name);
			if (!jsName) continue;
			link[jsName] = () => {
				this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
					source: this,
					detail: {
						id: data.id,
						name
					}
				});
				return false;
			};
		}
		if (data.overlaidText) link.title = data.overlaidText;
		if (!link.onclick) link.onclick = () => false;
		_assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
	}
	_bindResetFormAction(link, resetForm) {
		const otherClickAction = link.onclick;
		if (!otherClickAction) link.href = this.linkService.getAnchorUrl("");
		_assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
		if (!this._fieldObjects) {
			warn("_bindResetFormAction - \"resetForm\" action not supported, ensure that the `fieldObjects` parameter is provided.");
			if (!otherClickAction) link.onclick = () => false;
			return;
		}
		link.onclick = () => {
			otherClickAction?.();
			const { fields: resetFormFields, refs: resetFormRefs, include } = resetForm;
			const allFields = [];
			if (resetFormFields.length !== 0 || resetFormRefs.length !== 0) {
				const fieldIds = new Set(resetFormRefs);
				for (const fieldName of resetFormFields) {
					const fields = this._fieldObjects[fieldName] || [];
					for (const { id } of fields) fieldIds.add(id);
				}
				for (const fields of Object.values(this._fieldObjects)) for (const field of fields) if (fieldIds.has(field.id) === include) allFields.push(field);
			} else for (const fields of Object.values(this._fieldObjects)) allFields.push(...fields);
			const storage = this.annotationStorage;
			const allIds = [];
			for (const field of allFields) {
				const { id } = field;
				allIds.push(id);
				switch (field.type) {
					case "text": {
						const value = field.defaultValue || "";
						storage.setValue(id, { value });
						break;
					}
					case "checkbox":
					case "radiobutton": {
						const value = field.defaultValue === field.exportValues;
						storage.setValue(id, { value });
						break;
					}
					case "combobox":
					case "listbox": {
						const value = field.defaultValue || "";
						storage.setValue(id, { value });
						break;
					}
					default: continue;
				}
				const domElement = document.querySelector(`[data-element-id="${id}"]`);
				if (!domElement) continue;
				else if (!GetElementsByNameSet.has(domElement)) {
					warn(`_bindResetFormAction - element not allowed: ${id}`);
					continue;
				}
				domElement.dispatchEvent(new Event("resetform"));
			}
			if (this.enableScripting) this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
				source: this,
				detail: {
					id: "app",
					ids: allIds,
					name: "ResetForm"
				}
			});
			return false;
		};
	}
};
function _setInternalLink() {
	this.container.setAttribute("data-internal-link", "");
}
function _bindAttachment(link, attachment, overlaidText = "", dest = null) {
	link.href = this.linkService.getAnchorUrl("");
	if (attachment.description) link.title = attachment.description;
	else if (overlaidText) link.title = overlaidText;
	link.onclick = () => {
		this.downloadManager?.openOrDownloadData(attachment.content, attachment.filename, dest);
		return false;
	};
	_assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
}
function _bindSetOCGState(link, action, overlaidText = "") {
	link.href = this.linkService.getAnchorUrl("");
	link.onclick = () => {
		this.linkService.executeSetOCGState(action);
		return false;
	};
	if (overlaidText) link.title = overlaidText;
	_assertClassBrand(_LinkAnnotationElement_brand, this, _setInternalLink).call(this);
}
var TextAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: true });
	}
	render() {
		this.container.classList.add("textAnnotation");
		const image = document.createElement("img");
		image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
		image.setAttribute("data-l10n-id", "pdfjs-text-annotation-type");
		image.setAttribute("data-l10n-args", JSON.stringify({ type: this.data.name }));
		if (!this.data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.append(image);
		return this.container;
	}
};
var WidgetAnnotationElement = class extends AnnotationElement {
	render() {
		return this.container;
	}
	showElementAndHideCanvas(element) {
		if (this.data.hasOwnCanvas) {
			if (element.previousSibling?.nodeName === "CANVAS") element.previousSibling.hidden = true;
			element.hidden = false;
		}
	}
	_getKeyModifier(event) {
		return FeatureTest.platform.isMac ? event.metaKey : event.ctrlKey;
	}
	_setEventListener(element, elementData, baseName, eventName, valueGetter) {
		if (baseName.includes("mouse")) element.addEventListener(baseName, (event) => {
			this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
				source: this,
				detail: {
					id: this.data.id,
					name: eventName,
					value: valueGetter(event),
					shift: event.shiftKey,
					modifier: this._getKeyModifier(event)
				}
			});
		});
		else element.addEventListener(baseName, (event) => {
			if (baseName === "blur") {
				if (!elementData.focused || !event.relatedTarget) return;
				elementData.focused = false;
			} else if (baseName === "focus") {
				if (elementData.focused) return;
				elementData.focused = true;
			}
			if (!valueGetter) return;
			this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
				source: this,
				detail: {
					id: this.data.id,
					name: eventName,
					value: valueGetter(event)
				}
			});
		});
	}
	_setEventListeners(element, elementData, names, getter) {
		for (const [baseName, eventName] of names) if (eventName === "Action" || this.data.actions?.[eventName]) {
			if (eventName === "Focus" || eventName === "Blur") elementData || (elementData = { focused: false });
			this._setEventListener(element, elementData, baseName, eventName, getter);
			if (eventName === "Focus" && !this.data.actions?.Blur) this._setEventListener(element, elementData, "blur", "Blur", null);
			else if (eventName === "Blur" && !this.data.actions?.Focus) this._setEventListener(element, elementData, "focus", "Focus", null);
		}
	}
	_setBackgroundColor(element) {
		const color = this.data.backgroundColor || null;
		element.style.backgroundColor = color === null ? "transparent" : Util.makeHexColor(color[0], color[1], color[2]);
	}
	_setTextStyle(element) {
		const TEXT_ALIGNMENT = [
			"left",
			"center",
			"right"
		];
		const { fontColor } = this.data.defaultAppearanceData;
		const fontSize = this.data.defaultAppearanceData.fontSize || annotation_layer_DEFAULT_FONT_SIZE;
		const style = element.style;
		let computedFontSize;
		const BORDER_SIZE = 2;
		const roundToOneDecimal = (x) => Math.round(10 * x) / 10;
		if (this.data.multiLine) {
			const height = Math.abs(this.data.rect[3] - this.data.rect[1] - BORDER_SIZE);
			const lineHeight = height / (Math.round(height / (LINE_FACTOR * fontSize)) || 1);
			computedFontSize = Math.min(fontSize, roundToOneDecimal(lineHeight / LINE_FACTOR));
		} else {
			const height = Math.abs(this.data.rect[3] - this.data.rect[1] - BORDER_SIZE);
			computedFontSize = Math.min(fontSize, roundToOneDecimal(height / LINE_FACTOR));
		}
		style.fontSize = `calc(${computedFontSize}px * var(--total-scale-factor))`;
		style.color = Util.makeHexColor(fontColor[0], fontColor[1], fontColor[2]);
		if (this.data.textAlignment !== null) style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
	}
	_setRequired(element, isRequired) {
		if (isRequired) element.setAttribute("required", true);
		else element.removeAttribute("required");
		element.setAttribute("aria-required", isRequired);
	}
};
var TextWidgetAnnotationElement = class extends WidgetAnnotationElement {
	constructor(parameters) {
		const isRenderable = parameters.renderForms || parameters.data.hasOwnCanvas || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
		super(parameters, { isRenderable });
	}
	setPropertyOnSiblings(base, key, value, keyInStorage) {
		const storage = this.annotationStorage;
		for (const element of this._getElementsByName(base.name, base.id)) {
			if (element.domElement) element.domElement[key] = value;
			storage.setValue(element.id, { [keyInStorage]: value });
		}
	}
	render() {
		const storage = this.annotationStorage;
		const id = this.data.id;
		this.container.classList.add("textWidgetAnnotation");
		let element = null;
		if (this.renderForms) {
			const storedData = storage.getValue(id, { value: this.data.fieldValue });
			let textContent = storedData.value || "";
			const maxLen = storage.getValue(id, { charLimit: this.data.maxLen }).charLimit;
			if (maxLen && textContent.length > maxLen) textContent = textContent.slice(0, maxLen);
			let fieldFormattedValues = storedData.formattedValue || this.data.textContent?.join("\n") || null;
			if (fieldFormattedValues && this.data.comb) fieldFormattedValues = fieldFormattedValues.replaceAll(/\s+/g, "");
			const elementData = {
				userValue: textContent,
				formattedValue: fieldFormattedValues,
				lastCommittedValue: null,
				commitKey: 1,
				focused: false
			};
			if (this.data.multiLine) {
				element = document.createElement("textarea");
				element.textContent = fieldFormattedValues ?? textContent;
				if (this.data.doNotScroll) element.style.overflowY = "hidden";
			} else {
				element = document.createElement("input");
				element.type = this.data.password ? "password" : "text";
				element.setAttribute("value", fieldFormattedValues ?? textContent);
				if (this.data.doNotScroll) element.style.overflowX = "hidden";
			}
			if (this.data.hasOwnCanvas) element.hidden = true;
			GetElementsByNameSet.add(element);
			this.contentElement = element;
			element.setAttribute("data-element-id", id);
			element.disabled = this.data.readOnly;
			element.name = this.data.fieldName;
			element.tabIndex = 0;
			const { datetimeFormat, datetimeType, timeStep } = this.data;
			const hasDateOrTime = !!datetimeType && this.enableScripting;
			if (datetimeFormat) element.title = datetimeFormat;
			this._setRequired(element, this.data.required);
			if (maxLen) element.maxLength = maxLen;
			element.addEventListener("input", (event) => {
				storage.setValue(id, { value: event.target.value });
				this.setPropertyOnSiblings(element, "value", event.target.value, "value");
				elementData.formattedValue = null;
			});
			element.addEventListener("resetform", (event) => {
				const defaultValue = this.data.defaultFieldValue ?? "";
				element.value = elementData.userValue = defaultValue;
				elementData.formattedValue = null;
			});
			let blurListener = (event) => {
				const { formattedValue } = elementData;
				if (formattedValue !== null && formattedValue !== void 0) event.target.value = formattedValue;
				event.target.scrollLeft = 0;
			};
			if (this.enableScripting && this.hasJSActions) {
				element.addEventListener("focus", (event) => {
					if (elementData.focused) return;
					const { target } = event;
					if (hasDateOrTime) {
						target.type = datetimeType;
						if (timeStep) target.step = timeStep;
					}
					if (elementData.userValue) {
						const value = elementData.userValue;
						if (hasDateOrTime) if (datetimeType === "time") {
							const date = new Date(value);
							target.value = [
								date.getHours(),
								date.getMinutes(),
								date.getSeconds()
							].map((v) => v.toString().padStart(2, "0")).join(":");
						} else target.value = new Date(value - TIMEZONE_OFFSET).toISOString().split(datetimeType === "date" ? "T" : ".", 1)[0];
						else target.value = value;
					}
					elementData.lastCommittedValue = target.value;
					elementData.commitKey = 1;
					if (!this.data.actions?.Focus) elementData.focused = true;
				});
				element.addEventListener("updatefromsandbox", (jsEvent) => {
					this.showElementAndHideCanvas(jsEvent.target);
					this._dispatchEventFromSandbox({
						value(event) {
							elementData.userValue = event.detail.value ?? "";
							if (!hasDateOrTime) storage.setValue(id, { value: elementData.userValue.toString() });
							event.target.value = elementData.userValue;
						},
						formattedValue(event) {
							const { formattedValue } = event.detail;
							elementData.formattedValue = formattedValue;
							if (formattedValue !== null && formattedValue !== void 0 && event.target !== document.activeElement) event.target.value = formattedValue;
							const data = { formattedValue };
							if (hasDateOrTime) data.value = formattedValue;
							storage.setValue(id, data);
						},
						selRange(event) {
							event.target.setSelectionRange(...event.detail.selRange);
						},
						charLimit: (event) => {
							const { charLimit } = event.detail;
							const { target } = event;
							if (charLimit === 0) {
								target.removeAttribute("maxLength");
								return;
							}
							target.setAttribute("maxLength", charLimit);
							let value = elementData.userValue;
							if (!value || value.length <= charLimit) return;
							value = value.slice(0, charLimit);
							target.value = elementData.userValue = value;
							storage.setValue(id, { value });
							this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
								source: this,
								detail: {
									id,
									name: "Keystroke",
									value,
									willCommit: true,
									commitKey: 1,
									selStart: target.selectionStart,
									selEnd: target.selectionEnd
								}
							});
						}
					}, jsEvent);
				});
				element.addEventListener("keydown", (event) => {
					elementData.commitKey = 1;
					let commitKey = -1;
					if (event.key === "Escape") commitKey = 0;
					else if (event.key === "Enter" && !this.data.multiLine) commitKey = 2;
					else if (event.key === "Tab") elementData.commitKey = 3;
					if (commitKey === -1) return;
					const { value } = event.target;
					if (elementData.lastCommittedValue === value) return;
					elementData.lastCommittedValue = value;
					elementData.userValue = value;
					this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
						source: this,
						detail: {
							id,
							name: "Keystroke",
							value,
							willCommit: true,
							commitKey,
							selStart: event.target.selectionStart,
							selEnd: event.target.selectionEnd
						}
					});
				});
				const _blurListener = blurListener;
				blurListener = null;
				element.addEventListener("blur", (event) => {
					if (!elementData.focused || !event.relatedTarget) return;
					if (!this.data.actions?.Blur) elementData.focused = false;
					const { target } = event;
					let { value } = target;
					if (hasDateOrTime) {
						if (value && datetimeType === "time") {
							const parts = value.split(":").map((v) => parseInt(v, 10));
							value = new Date(2e3, 0, 1, parts[0], parts[1], parts[2] || 0).valueOf();
							target.step = "";
						} else {
							if (!value.includes("T")) value = `${value}T00:00`;
							value = new Date(value).valueOf();
						}
						target.type = "text";
					}
					elementData.userValue = value;
					if (elementData.lastCommittedValue !== value) this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
						source: this,
						detail: {
							id,
							name: "Keystroke",
							value,
							willCommit: true,
							commitKey: elementData.commitKey,
							selStart: event.target.selectionStart,
							selEnd: event.target.selectionEnd
						}
					});
					_blurListener(event);
				});
				if (this.data.actions?.Keystroke) element.addEventListener("beforeinput", (event) => {
					elementData.lastCommittedValue = null;
					const { data, target } = event;
					const { value, selectionStart, selectionEnd } = target;
					let selStart = selectionStart, selEnd = selectionEnd;
					switch (event.inputType) {
						case "deleteWordBackward": {
							const match = value.substring(0, selectionStart).match(/\w*[^\w]*$/);
							if (match) selStart -= match[0].length;
							break;
						}
						case "deleteWordForward": {
							const match = value.substring(selectionStart).match(/^[^\w]*\w*/);
							if (match) selEnd += match[0].length;
							break;
						}
						case "deleteContentBackward":
							if (selectionStart === selectionEnd) selStart -= 1;
							break;
						case "deleteContentForward":
							if (selectionStart === selectionEnd) selEnd += 1;
							break;
					}
					event.preventDefault();
					this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
						source: this,
						detail: {
							id,
							name: "Keystroke",
							value,
							change: data || "",
							willCommit: false,
							selStart,
							selEnd
						}
					});
				});
				this._setEventListeners(element, elementData, [
					["focus", "Focus"],
					["blur", "Blur"],
					["mousedown", "Mouse Down"],
					["mouseenter", "Mouse Enter"],
					["mouseleave", "Mouse Exit"],
					["mouseup", "Mouse Up"]
				], (event) => event.target.value);
			}
			if (blurListener) element.addEventListener("blur", blurListener);
			if (this.data.comb) {
				const combWidth = (this.data.rect[2] - this.data.rect[0]) / maxLen;
				element.classList.add("comb");
				element.style.letterSpacing = `calc(${combWidth}px * var(--total-scale-factor) - 1ch)`;
			}
		} else {
			element = document.createElement("div");
			element.textContent = this.data.fieldValue;
			element.style.verticalAlign = "middle";
			element.style.display = "table-cell";
			if (this.data.hasOwnCanvas) element.hidden = true;
		}
		this._setTextStyle(element);
		this._setBackgroundColor(element);
		this._setDefaultPropertiesFromJS(element);
		this.container.append(element);
		return this.container;
	}
};
var SignatureWidgetAnnotationElement = class extends WidgetAnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: !!parameters.data.hasOwnCanvas });
	}
};
var CheckboxWidgetAnnotationElement = class extends WidgetAnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: parameters.renderForms });
	}
	render() {
		const storage = this.annotationStorage;
		const data = this.data;
		const id = data.id;
		let value = storage.getValue(id, { value: data.exportValue === data.fieldValue }).value;
		if (typeof value === "string") {
			value = value !== "Off";
			storage.setValue(id, { value });
		}
		this.container.classList.add("buttonWidgetAnnotation", "checkBox");
		const element = document.createElement("input");
		GetElementsByNameSet.add(element);
		element.setAttribute("data-element-id", id);
		element.disabled = data.readOnly;
		this._setRequired(element, this.data.required);
		element.type = "checkbox";
		element.name = data.fieldName;
		if (value) element.setAttribute("checked", true);
		element.setAttribute("exportValue", data.exportValue);
		element.tabIndex = 0;
		element.addEventListener("change", (event) => {
			const { name, checked } = event.target;
			for (const checkbox of this._getElementsByName(name, id)) {
				const curChecked = checked && checkbox.exportValue === data.exportValue;
				if (checkbox.domElement) checkbox.domElement.checked = curChecked;
				storage.setValue(checkbox.id, { value: curChecked });
			}
			storage.setValue(id, { value: checked });
		});
		element.addEventListener("resetform", (event) => {
			const defaultValue = data.defaultFieldValue || "Off";
			event.target.checked = defaultValue === data.exportValue;
		});
		if (this.enableScripting && this.hasJSActions) {
			element.addEventListener("updatefromsandbox", (jsEvent) => {
				this._dispatchEventFromSandbox({ value(event) {
					event.target.checked = event.detail.value !== "Off";
					storage.setValue(id, { value: event.target.checked });
				} }, jsEvent);
			});
			this._setEventListeners(element, null, [
				["change", "Validate"],
				["change", "Action"],
				["focus", "Focus"],
				["blur", "Blur"],
				["mousedown", "Mouse Down"],
				["mouseenter", "Mouse Enter"],
				["mouseleave", "Mouse Exit"],
				["mouseup", "Mouse Up"]
			], (event) => event.target.checked);
		}
		this._setBackgroundColor(element);
		this._setDefaultPropertiesFromJS(element);
		this.container.append(element);
		return this.container;
	}
};
var RadioButtonWidgetAnnotationElement = class extends WidgetAnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: parameters.renderForms });
	}
	render() {
		this.container.classList.add("buttonWidgetAnnotation", "radioButton");
		const storage = this.annotationStorage;
		const data = this.data;
		const id = data.id;
		let value = storage.getValue(id, { value: data.fieldValue === data.buttonValue }).value;
		if (typeof value === "string") {
			value = value !== data.buttonValue;
			storage.setValue(id, { value });
		}
		if (value) for (const radio of this._getElementsByName(data.fieldName, id)) storage.setValue(radio.id, { value: false });
		const element = document.createElement("input");
		GetElementsByNameSet.add(element);
		element.setAttribute("data-element-id", id);
		element.disabled = data.readOnly;
		this._setRequired(element, this.data.required);
		element.type = "radio";
		element.name = data.fieldName;
		if (value) element.setAttribute("checked", true);
		element.tabIndex = 0;
		element.addEventListener("change", (event) => {
			const { name, checked } = event.target;
			for (const radio of this._getElementsByName(name, id)) storage.setValue(radio.id, { value: false });
			storage.setValue(id, { value: checked });
		});
		element.addEventListener("resetform", (event) => {
			const defaultValue = data.defaultFieldValue;
			event.target.checked = defaultValue !== null && defaultValue !== void 0 && defaultValue === data.buttonValue;
		});
		if (this.enableScripting && this.hasJSActions) {
			const pdfButtonValue = data.buttonValue;
			element.addEventListener("updatefromsandbox", (jsEvent) => {
				this._dispatchEventFromSandbox({ value: (event) => {
					const checked = pdfButtonValue === event.detail.value;
					for (const radio of this._getElementsByName(event.target.name)) {
						const curChecked = checked && radio.id === id;
						if (radio.domElement) radio.domElement.checked = curChecked;
						storage.setValue(radio.id, { value: curChecked });
					}
				} }, jsEvent);
			});
			this._setEventListeners(element, null, [
				["change", "Validate"],
				["change", "Action"],
				["focus", "Focus"],
				["blur", "Blur"],
				["mousedown", "Mouse Down"],
				["mouseenter", "Mouse Enter"],
				["mouseleave", "Mouse Exit"],
				["mouseup", "Mouse Up"]
			], (event) => event.target.checked);
		}
		this._setBackgroundColor(element);
		this._setDefaultPropertiesFromJS(element);
		this.container.append(element);
		return this.container;
	}
};
var PushButtonWidgetAnnotationElement = class extends LinkAnnotationElement {
	constructor(parameters) {
		super(parameters, { ignoreBorder: parameters.data.hasAppearance });
	}
	render() {
		const container = super.render();
		container.classList.add("buttonWidgetAnnotation", "pushButton");
		const linkElement = container.lastChild;
		if (this.enableScripting && this.hasJSActions && linkElement) {
			this._setDefaultPropertiesFromJS(linkElement);
			linkElement.addEventListener("updatefromsandbox", (jsEvent) => {
				this._dispatchEventFromSandbox({}, jsEvent);
			});
		}
		return container;
	}
};
var ChoiceWidgetAnnotationElement = class extends WidgetAnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: parameters.renderForms });
	}
	render() {
		this.container.classList.add("choiceWidgetAnnotation");
		const storage = this.annotationStorage;
		const id = this.data.id;
		const storedData = storage.getValue(id, { value: this.data.fieldValue });
		const selectElement = document.createElement("select");
		GetElementsByNameSet.add(selectElement);
		selectElement.setAttribute("data-element-id", id);
		selectElement.disabled = this.data.readOnly;
		this._setRequired(selectElement, this.data.required);
		selectElement.name = this.data.fieldName;
		selectElement.tabIndex = 0;
		let addAnEmptyEntry = this.data.combo && this.data.options.length > 0;
		if (!this.data.combo) {
			selectElement.size = this.data.options.length;
			if (this.data.multiSelect) selectElement.multiple = true;
		}
		selectElement.addEventListener("resetform", (event) => {
			const defaultValue = this.data.defaultFieldValue;
			for (const option of selectElement.options) option.selected = option.value === defaultValue;
		});
		const fixDisplayValue = (option, value) => {
			const newValue = value.replaceAll(" ", "\xA0");
			option.textContent = newValue;
			if (newValue !== value) option.setAttribute("display-value", value);
		};
		for (const option of this.data.options) {
			const optionElement = document.createElement("option");
			fixDisplayValue(optionElement, option.displayValue);
			optionElement.value = option.exportValue;
			if (storedData.value.includes(option.exportValue)) {
				optionElement.setAttribute("selected", true);
				addAnEmptyEntry = false;
			}
			selectElement.append(optionElement);
		}
		let removeEmptyEntry = null;
		if (addAnEmptyEntry) {
			const noneOptionElement = document.createElement("option");
			noneOptionElement.value = " ";
			noneOptionElement.setAttribute("hidden", true);
			noneOptionElement.setAttribute("selected", true);
			selectElement.prepend(noneOptionElement);
			removeEmptyEntry = () => {
				noneOptionElement.remove();
				selectElement.removeEventListener("input", removeEmptyEntry);
				removeEmptyEntry = null;
			};
			selectElement.addEventListener("input", removeEmptyEntry);
		}
		const getValue = (isExport) => {
			const name = isExport ? "value" : "textContent";
			const { options, multiple } = selectElement;
			if (!multiple) return options.selectedIndex === -1 ? null : options[options.selectedIndex][name];
			return Array.prototype.filter.call(options, (option) => option.selected).map((option) => option[name]);
		};
		let selectedValues = getValue(false);
		const getItems = (event) => {
			const options = event.target.options;
			return Array.prototype.map.call(options, (option) => ({
				displayValue: option.getAttribute("display-value") || option.textContent,
				exportValue: option.value
			}));
		};
		if (this.enableScripting && this.hasJSActions) {
			selectElement.addEventListener("updatefromsandbox", (jsEvent) => {
				this._dispatchEventFromSandbox({
					value(event) {
						removeEmptyEntry?.();
						const value = event.detail.value;
						const values = new Set(Array.isArray(value) ? value : [value]);
						for (const option of selectElement.options) option.selected = values.has(option.value);
						storage.setValue(id, { value: getValue(true) });
						selectedValues = getValue(false);
					},
					multipleSelection(event) {
						selectElement.multiple = true;
					},
					remove(event) {
						const options = selectElement.options;
						const index = event.detail.remove;
						options[index].selected = false;
						selectElement.remove(index);
						if (options.length > 0) {
							if (Array.prototype.findIndex.call(options, (option) => option.selected) === -1) options[0].selected = true;
						}
						storage.setValue(id, {
							value: getValue(true),
							items: getItems(event)
						});
						selectedValues = getValue(false);
					},
					clear(event) {
						while (selectElement.length !== 0) selectElement.remove(0);
						storage.setValue(id, {
							value: null,
							items: []
						});
						selectedValues = getValue(false);
					},
					insert(event) {
						const { index, displayValue, exportValue } = event.detail.insert;
						const selectChild = selectElement.children[index];
						const optionElement = document.createElement("option");
						fixDisplayValue(optionElement, displayValue);
						optionElement.value = exportValue;
						if (selectChild) selectChild.before(optionElement);
						else selectElement.append(optionElement);
						storage.setValue(id, {
							value: getValue(true),
							items: getItems(event)
						});
						selectedValues = getValue(false);
					},
					items(event) {
						const { items } = event.detail;
						while (selectElement.length !== 0) selectElement.remove(0);
						for (const item of items) {
							const { displayValue, exportValue } = item;
							const optionElement = document.createElement("option");
							fixDisplayValue(optionElement, displayValue);
							optionElement.value = exportValue;
							selectElement.append(optionElement);
						}
						if (selectElement.options.length > 0) selectElement.options[0].selected = true;
						storage.setValue(id, {
							value: getValue(true),
							items: getItems(event)
						});
						selectedValues = getValue(false);
					},
					indices(event) {
						const indices = new Set(event.detail.indices);
						for (const option of event.target.options) option.selected = indices.has(option.index);
						storage.setValue(id, { value: getValue(true) });
						selectedValues = getValue(false);
					},
					editable(event) {
						event.target.disabled = !event.detail.editable;
					}
				}, jsEvent);
			});
			selectElement.addEventListener("input", (event) => {
				const exportValue = getValue(true);
				const change = getValue(false);
				storage.setValue(id, { value: exportValue });
				event.preventDefault();
				this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
					source: this,
					detail: {
						id,
						name: "Keystroke",
						value: selectedValues,
						change,
						changeEx: exportValue,
						willCommit: false,
						commitKey: 1,
						keyDown: false
					}
				});
			});
			this._setEventListeners(selectElement, null, [
				["focus", "Focus"],
				["blur", "Blur"],
				["mousedown", "Mouse Down"],
				["mouseenter", "Mouse Enter"],
				["mouseleave", "Mouse Exit"],
				["mouseup", "Mouse Up"],
				["input", "Action"],
				["input", "Validate"]
			], (event) => event.target.value);
		} else selectElement.addEventListener("input", function(event) {
			storage.setValue(id, { value: getValue(true) });
		});
		if (this.data.combo) this._setTextStyle(selectElement);
		this._setBackgroundColor(selectElement);
		this._setDefaultPropertiesFromJS(selectElement);
		this.container.append(selectElement);
		return this.container;
	}
};
var _PopupAnnotationElement_brand = /* @__PURE__ */ new WeakSet();
var PopupAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		const { data, elements, parent } = parameters;
		const hasCommentManager = !!parent._commentManager;
		super(parameters, { isRenderable: !hasCommentManager && AnnotationElement._hasPopupData(data) });
		_classPrivateMethodInitSpec(this, _PopupAnnotationElement_brand);
		this.elements = elements;
		if (hasCommentManager && AnnotationElement._hasPopupData(data)) {
			const popup = this.popup = _assertClassBrand(_PopupAnnotationElement_brand, this, _createPopup).call(this);
			for (const element of elements) element.popup = popup;
		} else this.popup = null;
	}
	render() {
		const { container } = this;
		container.classList.add("popupAnnotation");
		container.role = "comment";
		const popup = this.popup = _assertClassBrand(_PopupAnnotationElement_brand, this, _createPopup).call(this);
		const elementIds = [];
		for (const element of this.elements) {
			element.popup = popup;
			element.container.ariaHasPopup = "dialog";
			elementIds.push(element.data.id);
			element.addHighlightArea();
		}
		this.container.setAttribute("aria-controls", elementIds.map((id) => `${AnnotationPrefix}${id}`).join(","));
		return this.container;
	}
};
function _createPopup() {
	return new PopupElement({
		container: this.container,
		color: this.data.color,
		titleObj: this.data.titleObj,
		modificationDate: this.data.modificationDate || this.data.creationDate,
		contentsObj: this.data.contentsObj,
		richText: this.data.richText,
		rect: this.data.rect,
		parentRect: this.data.parentRect || null,
		parent: this.parent,
		elements: this.elements,
		open: this.data.open,
		commentManager: this.parent._commentManager
	});
}
var _commentManager2 = /* @__PURE__ */ new WeakMap();
var _boundKeyDown = /* @__PURE__ */ new WeakMap();
var _boundHide = /* @__PURE__ */ new WeakMap();
var _boundShow = /* @__PURE__ */ new WeakMap();
var _boundToggle = /* @__PURE__ */ new WeakMap();
var _color = /* @__PURE__ */ new WeakMap();
var _container4 = /* @__PURE__ */ new WeakMap();
var _contentsObj = /* @__PURE__ */ new WeakMap();
var _dateObj = /* @__PURE__ */ new WeakMap();
var _elements = /* @__PURE__ */ new WeakMap();
var _parent = /* @__PURE__ */ new WeakMap();
var _parentRect = /* @__PURE__ */ new WeakMap();
var _pinned = /* @__PURE__ */ new WeakMap();
var _popup = /* @__PURE__ */ new WeakMap();
var _popupAbortController = /* @__PURE__ */ new WeakMap();
var _position2 = /* @__PURE__ */ new WeakMap();
var _commentButton = /* @__PURE__ */ new WeakMap();
var _commentButtonPosition = /* @__PURE__ */ new WeakMap();
var _popupPosition2 = /* @__PURE__ */ new WeakMap();
var _rect = /* @__PURE__ */ new WeakMap();
var _richText2 = /* @__PURE__ */ new WeakMap();
var _titleObj = /* @__PURE__ */ new WeakMap();
var _updates2 = /* @__PURE__ */ new WeakMap();
var _wasVisible = /* @__PURE__ */ new WeakMap();
var _firstElement = /* @__PURE__ */ new WeakMap();
var _commentText = /* @__PURE__ */ new WeakMap();
var _PopupElement_brand = /* @__PURE__ */ new WeakSet();
var PopupElement = class {
	constructor({ container, color, elements, titleObj, modificationDate, contentsObj, richText, parent, rect, parentRect, open, commentManager = null }) {
		_classPrivateMethodInitSpec(this, _PopupElement_brand);
		_classPrivateFieldInitSpec(this, _commentManager2, null);
		_classPrivateFieldInitSpec(this, _boundKeyDown, _assertClassBrand(_PopupElement_brand, this, _keyDown2).bind(this));
		_classPrivateFieldInitSpec(this, _boundHide, _assertClassBrand(_PopupElement_brand, this, _hide).bind(this));
		_classPrivateFieldInitSpec(this, _boundShow, _assertClassBrand(_PopupElement_brand, this, _show).bind(this));
		_classPrivateFieldInitSpec(this, _boundToggle, _assertClassBrand(_PopupElement_brand, this, _toggle).bind(this));
		_classPrivateFieldInitSpec(this, _color, null);
		_classPrivateFieldInitSpec(this, _container4, null);
		_classPrivateFieldInitSpec(this, _contentsObj, null);
		_classPrivateFieldInitSpec(this, _dateObj, null);
		_classPrivateFieldInitSpec(this, _elements, null);
		_classPrivateFieldInitSpec(this, _parent, null);
		_classPrivateFieldInitSpec(this, _parentRect, null);
		_classPrivateFieldInitSpec(this, _pinned, false);
		_classPrivateFieldInitSpec(this, _popup, null);
		_classPrivateFieldInitSpec(this, _popupAbortController, null);
		_classPrivateFieldInitSpec(this, _position2, null);
		_classPrivateFieldInitSpec(this, _commentButton, null);
		_classPrivateFieldInitSpec(this, _commentButtonPosition, null);
		_classPrivateFieldInitSpec(this, _popupPosition2, null);
		_classPrivateFieldInitSpec(this, _rect, null);
		_classPrivateFieldInitSpec(this, _richText2, null);
		_classPrivateFieldInitSpec(this, _titleObj, null);
		_classPrivateFieldInitSpec(this, _updates2, null);
		_classPrivateFieldInitSpec(this, _wasVisible, false);
		_classPrivateFieldInitSpec(this, _firstElement, null);
		_classPrivateFieldInitSpec(this, _commentText, null);
		_classPrivateFieldSet2(_container4, this, container);
		_classPrivateFieldSet2(_titleObj, this, titleObj);
		_classPrivateFieldSet2(_contentsObj, this, contentsObj);
		_classPrivateFieldSet2(_richText2, this, richText);
		_classPrivateFieldSet2(_parent, this, parent);
		_classPrivateFieldSet2(_color, this, color);
		_classPrivateFieldSet2(_rect, this, rect);
		_classPrivateFieldSet2(_parentRect, this, parentRect);
		_classPrivateFieldSet2(_elements, this, elements);
		_classPrivateFieldSet2(_commentManager2, this, commentManager);
		_classPrivateFieldSet2(_firstElement, this, elements[0]);
		_classPrivateFieldSet2(_dateObj, this, PDFDateString.toDateObject(modificationDate));
		this.trigger = elements.flatMap((e) => e.getElementsToTriggerPopup());
		if (!commentManager) {
			_assertClassBrand(_PopupElement_brand, this, _addEventListeners).call(this);
			_classPrivateFieldGet2(_container4, this).hidden = true;
			if (open) _assertClassBrand(_PopupElement_brand, this, _toggle).call(this);
		}
	}
	renderCommentButton() {
		if (_classPrivateFieldGet2(_commentButton, this)) {
			if (!_classPrivateFieldGet2(_commentButton, this).parentNode) _classPrivateFieldGet2(_firstElement, this).container.after(_classPrivateFieldGet2(_commentButton, this));
			return;
		}
		if (!_classPrivateFieldGet2(_commentButtonPosition, this)) _assertClassBrand(_PopupElement_brand, this, _setCommentButtonPosition).call(this);
		if (!_classPrivateFieldGet2(_commentButtonPosition, this)) return;
		const { signal } = _classPrivateFieldSet2(_popupAbortController, this, new AbortController());
		const hasOwnButton = _classPrivateFieldGet2(_firstElement, this).hasOwnCommentButton;
		const togglePopup = () => {
			_classPrivateFieldGet2(_commentManager2, this).toggleCommentPopup(this, true, void 0, !hasOwnButton);
		};
		const showPopup = () => {
			_classPrivateFieldGet2(_commentManager2, this).toggleCommentPopup(this, false, true, !hasOwnButton);
		};
		const hidePopup = () => {
			_classPrivateFieldGet2(_commentManager2, this).toggleCommentPopup(this, false, false);
		};
		if (!hasOwnButton) {
			const button = _classPrivateFieldSet2(_commentButton, this, document.createElement("button"));
			button.className = "annotationCommentButton";
			const parentContainer = _classPrivateFieldGet2(_firstElement, this).container;
			button.style.zIndex = parentContainer.style.zIndex + 1;
			button.tabIndex = 0;
			button.ariaHasPopup = "dialog";
			button.ariaControls = "commentPopup";
			button.setAttribute("data-l10n-id", "pdfjs-show-comment-button");
			_assertClassBrand(_PopupElement_brand, this, _updateColor).call(this);
			_assertClassBrand(_PopupElement_brand, this, _updateCommentButtonPosition).call(this);
			button.addEventListener("keydown", _classPrivateFieldGet2(_boundKeyDown, this), { signal });
			button.addEventListener("click", togglePopup, { signal });
			button.addEventListener("pointerenter", showPopup, { signal });
			button.addEventListener("pointerleave", hidePopup, { signal });
			parentContainer.after(button);
		} else {
			_classPrivateFieldSet2(_commentButton, this, _classPrivateFieldGet2(_firstElement, this).container);
			for (const element of this.trigger) {
				element.ariaHasPopup = "dialog";
				element.ariaControls = "commentPopup";
				element.addEventListener("keydown", _classPrivateFieldGet2(_boundKeyDown, this), { signal });
				element.addEventListener("click", togglePopup, { signal });
				element.addEventListener("pointerenter", showPopup, { signal });
				element.addEventListener("pointerleave", hidePopup, { signal });
				element.classList.add("popupTriggerArea");
			}
		}
	}
	get commentButtonColor() {
		const { color, opacity } = _classPrivateFieldGet2(_firstElement, this).commentData;
		if (!color) return null;
		return _classPrivateFieldGet2(_parent, this)._commentManager.makeCommentColor(color, opacity);
	}
	focusCommentButton() {
		setTimeout(() => {
			_classPrivateFieldGet2(_commentButton, this)?.focus();
		}, 0);
	}
	getData() {
		const { richText, color, opacity, creationDate, modificationDate } = _classPrivateFieldGet2(_firstElement, this).commentData;
		return {
			contentsObj: { str: this.comment },
			richText,
			color,
			opacity,
			creationDate,
			modificationDate
		};
	}
	get elementBeforePopup() {
		return _classPrivateFieldGet2(_commentButton, this);
	}
	get comment() {
		_classPrivateFieldGet2(_commentText, this) || _classPrivateFieldSet2(_commentText, this, _classPrivateFieldGet2(_firstElement, this).commentText);
		return _classPrivateFieldGet2(_commentText, this);
	}
	set comment(text) {
		if (text === this.comment) return;
		_classPrivateFieldGet2(_firstElement, this).commentText = _classPrivateFieldSet2(_commentText, this, text);
	}
	focus() {
		_classPrivateFieldGet2(_firstElement, this).container?.focus();
	}
	get parentBoundingClientRect() {
		return _classPrivateFieldGet2(_firstElement, this).layer.getBoundingClientRect();
	}
	setCommentButtonStates({ selected, hasPopup }) {
		if (!_classPrivateFieldGet2(_commentButton, this)) return;
		_classPrivateFieldGet2(_commentButton, this).classList.toggle("selected", selected);
		_classPrivateFieldGet2(_commentButton, this).ariaExpanded = hasPopup;
	}
	setSelectedCommentButton(selected) {
		_classPrivateFieldGet2(_commentButton, this).classList.toggle("selected", selected);
	}
	get commentPopupPosition() {
		if (_classPrivateFieldGet2(_popupPosition2, this)) return _classPrivateFieldGet2(_popupPosition2, this);
		const { x, y, height } = _classPrivateFieldGet2(_commentButton, this).getBoundingClientRect();
		const { x: parentX, y: parentY, width: parentWidth, height: parentHeight } = _classPrivateFieldGet2(_firstElement, this).layer.getBoundingClientRect();
		return [(x - parentX) / parentWidth, (y + height - parentY) / parentHeight];
	}
	set commentPopupPosition(pos) {
		_classPrivateFieldSet2(_popupPosition2, this, pos);
	}
	hasDefaultPopupPosition() {
		return _classPrivateFieldGet2(_popupPosition2, this) === null;
	}
	get commentButtonPosition() {
		return _classPrivateFieldGet2(_commentButtonPosition, this);
	}
	get commentButtonWidth() {
		return _classPrivateFieldGet2(_commentButton, this).getBoundingClientRect().width / this.parentBoundingClientRect.width;
	}
	editComment(options) {
		const [posX, posY] = _classPrivateFieldGet2(_popupPosition2, this) || this.commentButtonPosition.map((x) => x / 100);
		const parentDimensions = this.parentBoundingClientRect;
		const { x: parentX, y: parentY, width: parentWidth, height: parentHeight } = parentDimensions;
		_classPrivateFieldGet2(_commentManager2, this).showDialog(null, this, parentX + posX * parentWidth, parentY + posY * parentHeight, {
			...options,
			parentDimensions
		});
	}
	render() {
		if (_classPrivateFieldGet2(_popup, this)) return;
		const popup = _classPrivateFieldSet2(_popup, this, document.createElement("div"));
		popup.className = "popup";
		if (_classPrivateFieldGet2(_color, this)) {
			const baseColor = popup.style.outlineColor = Util.makeHexColor(..._classPrivateFieldGet2(_color, this));
			popup.style.backgroundColor = `color-mix(in srgb, ${baseColor} 30%, white)`;
		}
		const header = document.createElement("span");
		header.className = "header";
		if (_classPrivateFieldGet2(_titleObj, this)?.str) {
			const title = document.createElement("span");
			title.className = "title";
			header.append(title);
			({dir: title.dir, str: title.textContent} = _classPrivateFieldGet2(_titleObj, this));
		}
		popup.append(header);
		if (_classPrivateFieldGet2(_dateObj, this)) {
			const modificationDate = document.createElement("time");
			modificationDate.className = "popupDate";
			modificationDate.setAttribute("data-l10n-id", "pdfjs-annotation-date-time-string");
			modificationDate.setAttribute("data-l10n-args", JSON.stringify({ dateObj: _classPrivateFieldGet2(_dateObj, this).valueOf() }));
			modificationDate.dateTime = _classPrivateFieldGet2(_dateObj, this).toISOString();
			header.append(modificationDate);
		}
		renderRichText({
			html: _get_html.call(_assertClassBrand(_PopupElement_brand, this)) || _classPrivateFieldGet2(_contentsObj, this).str,
			dir: _classPrivateFieldGet2(_contentsObj, this)?.dir,
			className: "popupContent"
		}, popup);
		_classPrivateFieldGet2(_container4, this).append(popup);
	}
	updateEdited({ rect, popup, deleted }) {
		if (_classPrivateFieldGet2(_commentManager2, this)) {
			if (deleted) {
				this.remove();
				_classPrivateFieldSet2(_commentText, this, null);
			} else if (popup) if (popup.deleted) this.remove();
			else {
				_assertClassBrand(_PopupElement_brand, this, _updateColor).call(this);
				_classPrivateFieldSet2(_commentText, this, popup.text);
			}
			if (rect) {
				_classPrivateFieldSet2(_commentButtonPosition, this, null);
				_assertClassBrand(_PopupElement_brand, this, _setCommentButtonPosition).call(this);
				_assertClassBrand(_PopupElement_brand, this, _updateCommentButtonPosition).call(this);
			}
			return;
		}
		if (deleted || popup?.deleted) {
			this.remove();
			return;
		}
		_assertClassBrand(_PopupElement_brand, this, _addEventListeners).call(this);
		_classPrivateFieldGet2(_updates2, this) || _classPrivateFieldSet2(_updates2, this, {
			contentsObj: _classPrivateFieldGet2(_contentsObj, this),
			richText: _classPrivateFieldGet2(_richText2, this)
		});
		if (rect) _classPrivateFieldSet2(_position2, this, null);
		if (popup && popup.text) {
			_classPrivateFieldSet2(_richText2, this, _assertClassBrand(_PopupElement_brand, this, _makePopupContent).call(this, popup.text));
			_classPrivateFieldSet2(_dateObj, this, PDFDateString.toDateObject(popup.date));
			_classPrivateFieldSet2(_contentsObj, this, null);
		}
		_classPrivateFieldGet2(_popup, this)?.remove();
		_classPrivateFieldSet2(_popup, this, null);
	}
	resetEdited() {
		if (!_classPrivateFieldGet2(_updates2, this)) return;
		({contentsObj: _toSetter(_classPrivateFieldSet2, [_contentsObj, this])._, richText: _toSetter(_classPrivateFieldSet2, [_richText2, this])._} = _classPrivateFieldGet2(_updates2, this));
		_classPrivateFieldSet2(_updates2, this, null);
		_classPrivateFieldGet2(_popup, this)?.remove();
		_classPrivateFieldSet2(_popup, this, null);
		_classPrivateFieldSet2(_position2, this, null);
	}
	remove() {
		_classPrivateFieldGet2(_popupAbortController, this)?.abort();
		_classPrivateFieldSet2(_popupAbortController, this, null);
		_classPrivateFieldGet2(_popup, this)?.remove();
		_classPrivateFieldSet2(_popup, this, null);
		_classPrivateFieldSet2(_wasVisible, this, false);
		_classPrivateFieldSet2(_pinned, this, false);
		_classPrivateFieldGet2(_commentButton, this)?.remove();
		_classPrivateFieldSet2(_commentButton, this, null);
		if (this.trigger) for (const element of this.trigger) element.classList.remove("popupTriggerArea");
	}
	forceHide() {
		_classPrivateFieldSet2(_wasVisible, this, this.isVisible);
		if (!_classPrivateFieldGet2(_wasVisible, this)) return;
		_classPrivateFieldGet2(_container4, this).hidden = true;
	}
	maybeShow() {
		if (_classPrivateFieldGet2(_commentManager2, this)) return;
		_assertClassBrand(_PopupElement_brand, this, _addEventListeners).call(this);
		if (!_classPrivateFieldGet2(_wasVisible, this)) return;
		if (!_classPrivateFieldGet2(_popup, this)) _assertClassBrand(_PopupElement_brand, this, _show).call(this);
		_classPrivateFieldSet2(_wasVisible, this, false);
		_classPrivateFieldGet2(_container4, this).hidden = false;
	}
	get isVisible() {
		if (_classPrivateFieldGet2(_commentManager2, this)) return false;
		return _classPrivateFieldGet2(_container4, this).hidden === false;
	}
};
function _addEventListeners() {
	if (_classPrivateFieldGet2(_popupAbortController, this)) return;
	_classPrivateFieldSet2(_popupAbortController, this, new AbortController());
	const { signal } = _classPrivateFieldGet2(_popupAbortController, this);
	for (const element of this.trigger) {
		element.addEventListener("click", _classPrivateFieldGet2(_boundToggle, this), { signal });
		element.addEventListener("pointerenter", _classPrivateFieldGet2(_boundShow, this), { signal });
		element.addEventListener("pointerleave", _classPrivateFieldGet2(_boundHide, this), { signal });
		element.classList.add("popupTriggerArea");
	}
	for (const element of _classPrivateFieldGet2(_elements, this)) element.container?.addEventListener("keydown", _classPrivateFieldGet2(_boundKeyDown, this), { signal });
}
function _setCommentButtonPosition() {
	const element = _classPrivateFieldGet2(_elements, this).find((e) => e.hasCommentButton);
	if (!element) return;
	_classPrivateFieldSet2(_commentButtonPosition, this, element._normalizePoint(element.commentButtonPosition));
}
function _updateCommentButtonPosition() {
	if (_classPrivateFieldGet2(_firstElement, this).extraPopupElement && !_classPrivateFieldGet2(_firstElement, this).editor) return;
	if (!_classPrivateFieldGet2(_commentButton, this)) this.renderCommentButton();
	const [x, y] = _classPrivateFieldGet2(_commentButtonPosition, this);
	const { style } = _classPrivateFieldGet2(_commentButton, this);
	style.left = `calc(${x}%)`;
	style.top = `calc(${y}% - var(--comment-button-dim))`;
}
function _updateColor() {
	if (_classPrivateFieldGet2(_firstElement, this).extraPopupElement) return;
	if (!_classPrivateFieldGet2(_commentButton, this)) this.renderCommentButton();
	_classPrivateFieldGet2(_commentButton, this).style.backgroundColor = this.commentButtonColor || "";
}
function _get_html() {
	const richText = _classPrivateFieldGet2(_richText2, this);
	const contentsObj = _classPrivateFieldGet2(_contentsObj, this);
	if (richText?.str && (!contentsObj?.str || contentsObj.str === richText.str)) return _classPrivateFieldGet2(_richText2, this).html || null;
	return null;
}
function _get_fontSize() {
	return _get_html.call(_assertClassBrand(_PopupElement_brand, this))?.attributes?.style?.fontSize || 0;
}
function _get_fontColor() {
	return _get_html.call(_assertClassBrand(_PopupElement_brand, this))?.attributes?.style?.color || null;
}
function _makePopupContent(text) {
	const popupLines = [];
	const popupContent = {
		str: text,
		html: {
			name: "div",
			attributes: { dir: "auto" },
			children: [{
				name: "p",
				children: popupLines
			}]
		}
	};
	const lineAttributes = { style: {
		color: _get_fontColor.call(_assertClassBrand(_PopupElement_brand, this)),
		fontSize: _get_fontSize.call(_assertClassBrand(_PopupElement_brand, this)) ? `calc(${_get_fontSize.call(_assertClassBrand(_PopupElement_brand, this))}px * var(--total-scale-factor))` : ""
	} };
	for (const line of text.split("\n")) popupLines.push({
		name: "span",
		value: line,
		attributes: lineAttributes
	});
	return popupContent;
}
function _keyDown2(event) {
	if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;
	if (event.key === "Enter" || event.key === "Escape" && _classPrivateFieldGet2(_pinned, this)) _assertClassBrand(_PopupElement_brand, this, _toggle).call(this);
}
function _setPosition() {
	if (_classPrivateFieldGet2(_position2, this) !== null) return;
	const { page: { view }, viewport: { rawDims: { pageWidth, pageHeight, pageX, pageY } } } = _classPrivateFieldGet2(_parent, this);
	let useParentRect = !!_classPrivateFieldGet2(_parentRect, this);
	let rect = useParentRect ? _classPrivateFieldGet2(_parentRect, this) : _classPrivateFieldGet2(_rect, this);
	for (const element of _classPrivateFieldGet2(_elements, this)) if (!rect || Util.intersect(element.data.rect, rect) !== null) {
		rect = element.data.rect;
		useParentRect = true;
		break;
	}
	const normalizedRect = Util.normalizeRect([
		rect[0],
		view[3] - rect[1] + view[1],
		rect[2],
		view[3] - rect[3] + view[1]
	]);
	const parentWidth = useParentRect ? rect[2] - rect[0] + 5 : 0;
	const popupLeft = normalizedRect[0] + parentWidth;
	const popupTop = normalizedRect[1];
	_classPrivateFieldSet2(_position2, this, [100 * (popupLeft - pageX) / pageWidth, 100 * (popupTop - pageY) / pageHeight]);
	const { style } = _classPrivateFieldGet2(_container4, this);
	style.left = `${_classPrivateFieldGet2(_position2, this)[0]}%`;
	style.top = `${_classPrivateFieldGet2(_position2, this)[1]}%`;
}
function _toggle() {
	if (_classPrivateFieldGet2(_commentManager2, this)) {
		_classPrivateFieldGet2(_commentManager2, this).toggleCommentPopup(this, false);
		return;
	}
	_classPrivateFieldSet2(_pinned, this, !_classPrivateFieldGet2(_pinned, this));
	if (_classPrivateFieldGet2(_pinned, this)) {
		_assertClassBrand(_PopupElement_brand, this, _show).call(this);
		_classPrivateFieldGet2(_container4, this).addEventListener("click", _classPrivateFieldGet2(_boundToggle, this));
		_classPrivateFieldGet2(_container4, this).addEventListener("keydown", _classPrivateFieldGet2(_boundKeyDown, this));
	} else {
		_assertClassBrand(_PopupElement_brand, this, _hide).call(this);
		_classPrivateFieldGet2(_container4, this).removeEventListener("click", _classPrivateFieldGet2(_boundToggle, this));
		_classPrivateFieldGet2(_container4, this).removeEventListener("keydown", _classPrivateFieldGet2(_boundKeyDown, this));
	}
}
function _show() {
	if (!_classPrivateFieldGet2(_popup, this)) this.render();
	if (!this.isVisible) {
		_assertClassBrand(_PopupElement_brand, this, _setPosition).call(this);
		_classPrivateFieldGet2(_container4, this).hidden = false;
		_classPrivateFieldGet2(_container4, this).style.zIndex = parseInt(_classPrivateFieldGet2(_container4, this).style.zIndex) + 1e3;
	} else if (_classPrivateFieldGet2(_pinned, this)) _classPrivateFieldGet2(_container4, this).classList.add("focused");
}
function _hide() {
	_classPrivateFieldGet2(_container4, this).classList.remove("focused");
	if (_classPrivateFieldGet2(_pinned, this) || !this.isVisible) return;
	_classPrivateFieldGet2(_container4, this).hidden = true;
	_classPrivateFieldGet2(_container4, this).style.zIndex = parseInt(_classPrivateFieldGet2(_container4, this).style.zIndex) - 1e3;
}
var FreeTextAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		this.textContent = parameters.data.textContent;
		this.textPosition = parameters.data.textPosition;
		this.annotationEditorType = AnnotationEditorType.FREETEXT;
	}
	render() {
		this.container.classList.add("freeTextAnnotation");
		if (this.textContent) {
			const content = this.contentElement = document.createElement("div");
			content.classList.add("annotationTextContent");
			content.setAttribute("role", "comment");
			for (const line of this.textContent) {
				const lineSpan = document.createElement("span");
				lineSpan.textContent = line;
				content.append(lineSpan);
			}
			this.container.append(content);
		}
		if (!this.data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this._editOnDoubleClick();
		return this.container;
	}
};
var _line = /* @__PURE__ */ new WeakMap();
var LineAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		_classPrivateFieldInitSpec(this, _line, null);
	}
	render() {
		this.container.classList.add("lineAnnotation");
		const { data, width, height } = this;
		const svg = this.svgFactory.create(width, height, true);
		const line = _classPrivateFieldSet2(_line, this, this.svgFactory.createElement("svg:line"));
		line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
		line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
		line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
		line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
		line.setAttribute("stroke-width", data.borderStyle.width || 1);
		line.setAttribute("stroke", "transparent");
		line.setAttribute("fill", "transparent");
		svg.append(line);
		this.container.append(svg);
		if (!data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		return this.container;
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_line, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
var _square = /* @__PURE__ */ new WeakMap();
var SquareAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		_classPrivateFieldInitSpec(this, _square, null);
	}
	render() {
		this.container.classList.add("squareAnnotation");
		const { data, width, height } = this;
		const svg = this.svgFactory.create(width, height, true);
		const borderWidth = data.borderStyle.width;
		const square = _classPrivateFieldSet2(_square, this, this.svgFactory.createElement("svg:rect"));
		square.setAttribute("x", borderWidth / 2);
		square.setAttribute("y", borderWidth / 2);
		square.setAttribute("width", width - borderWidth);
		square.setAttribute("height", height - borderWidth);
		square.setAttribute("stroke-width", borderWidth || 1);
		square.setAttribute("stroke", "transparent");
		square.setAttribute("fill", "transparent");
		svg.append(square);
		this.container.append(svg);
		if (!data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		return this.container;
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_square, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
var _circle = /* @__PURE__ */ new WeakMap();
var CircleAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		_classPrivateFieldInitSpec(this, _circle, null);
	}
	render() {
		this.container.classList.add("circleAnnotation");
		const { data, width, height } = this;
		const svg = this.svgFactory.create(width, height, true);
		const borderWidth = data.borderStyle.width;
		const circle = _classPrivateFieldSet2(_circle, this, this.svgFactory.createElement("svg:ellipse"));
		circle.setAttribute("cx", width / 2);
		circle.setAttribute("cy", height / 2);
		circle.setAttribute("rx", width / 2 - borderWidth / 2);
		circle.setAttribute("ry", height / 2 - borderWidth / 2);
		circle.setAttribute("stroke-width", borderWidth || 1);
		circle.setAttribute("stroke", "transparent");
		circle.setAttribute("fill", "transparent");
		svg.append(circle);
		this.container.append(svg);
		if (!data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		return this.container;
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_circle, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
var _polyline = /* @__PURE__ */ new WeakMap();
var PolylineAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		_classPrivateFieldInitSpec(this, _polyline, null);
		this.containerClassName = "polylineAnnotation";
		this.svgElementName = "svg:polyline";
	}
	render() {
		this.container.classList.add(this.containerClassName);
		const { data: { rect, vertices, borderStyle, popupRef }, width, height } = this;
		if (!vertices) return this.container;
		const svg = this.svgFactory.create(width, height, true);
		let points = [];
		for (let i = 0, ii = vertices.length; i < ii; i += 2) {
			const x = vertices[i] - rect[0];
			const y = rect[3] - vertices[i + 1];
			points.push(`${x},${y}`);
		}
		points = points.join(" ");
		const polyline = _classPrivateFieldSet2(_polyline, this, this.svgFactory.createElement(this.svgElementName));
		polyline.setAttribute("points", points);
		polyline.setAttribute("stroke-width", borderStyle.width || 1);
		polyline.setAttribute("stroke", "transparent");
		polyline.setAttribute("fill", "transparent");
		svg.append(polyline);
		this.container.append(svg);
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		return this.container;
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_polyline, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
var PolygonAnnotationElement = class extends PolylineAnnotationElement {
	constructor(parameters) {
		super(parameters);
		this.containerClassName = "polygonAnnotation";
		this.svgElementName = "svg:polygon";
	}
};
var CaretAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
	}
	render() {
		this.container.classList.add("caretAnnotation");
		if (!this.data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		return this.container;
	}
};
var _polylinesGroupElement = /* @__PURE__ */ new WeakMap();
var _polylines = /* @__PURE__ */ new WeakMap();
var _InkAnnotationElement_brand = /* @__PURE__ */ new WeakSet();
var InkAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		_classPrivateMethodInitSpec(this, _InkAnnotationElement_brand);
		_classPrivateFieldInitSpec(this, _polylinesGroupElement, null);
		_classPrivateFieldInitSpec(this, _polylines, []);
		this.containerClassName = "inkAnnotation";
		this.svgElementName = "svg:polyline";
		this.annotationEditorType = this.data.it === "InkHighlight" ? AnnotationEditorType.HIGHLIGHT : AnnotationEditorType.INK;
	}
	render() {
		this.container.classList.add(this.containerClassName);
		const { data: { rect, rotation, inkLists, borderStyle, popupRef } } = this;
		const { transform, width, height } = _assertClassBrand(_InkAnnotationElement_brand, this, _getTransform).call(this, rotation, rect);
		const svg = this.svgFactory.create(width, height, true);
		const g = _classPrivateFieldSet2(_polylinesGroupElement, this, this.svgFactory.createElement("svg:g"));
		svg.append(g);
		g.setAttribute("stroke-width", borderStyle.width || 1);
		g.setAttribute("stroke-linecap", "round");
		g.setAttribute("stroke-linejoin", "round");
		g.setAttribute("stroke-miterlimit", 10);
		g.setAttribute("stroke", "transparent");
		g.setAttribute("fill", "transparent");
		g.setAttribute("transform", transform);
		for (let i = 0, ii = inkLists.length; i < ii; i++) {
			const polyline = this.svgFactory.createElement(this.svgElementName);
			_classPrivateFieldGet2(_polylines, this).push(polyline);
			polyline.setAttribute("points", inkLists[i].join(","));
			g.append(polyline);
		}
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.append(svg);
		this._editOnDoubleClick();
		return this.container;
	}
	updateEdited(params) {
		super.updateEdited(params);
		const { thickness, points, rect } = params;
		const g = _classPrivateFieldGet2(_polylinesGroupElement, this);
		if (thickness >= 0) g.setAttribute("stroke-width", thickness || 1);
		if (points) for (let i = 0, ii = _classPrivateFieldGet2(_polylines, this).length; i < ii; i++) _classPrivateFieldGet2(_polylines, this)[i].setAttribute("points", points[i].join(","));
		if (rect) {
			const { transform, width, height } = _assertClassBrand(_InkAnnotationElement_brand, this, _getTransform).call(this, this.data.rotation, rect);
			g.parentElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
			g.setAttribute("transform", transform);
		}
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_polylines, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
function _getTransform(rotation, rect) {
	switch (rotation) {
		case 90: return {
			transform: `rotate(90) translate(${-rect[0]},${rect[1]}) scale(1,-1)`,
			width: rect[3] - rect[1],
			height: rect[2] - rect[0]
		};
		case 180: return {
			transform: `rotate(180) translate(${-rect[2]},${rect[1]}) scale(1,-1)`,
			width: rect[2] - rect[0],
			height: rect[3] - rect[1]
		};
		case 270: return {
			transform: `rotate(270) translate(${-rect[2]},${rect[3]}) scale(1,-1)`,
			width: rect[3] - rect[1],
			height: rect[2] - rect[0]
		};
		default: return {
			transform: `translate(${-rect[0]},${rect[3]}) scale(1,-1)`,
			width: rect[2] - rect[0],
			height: rect[3] - rect[1]
		};
	}
}
var HighlightAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true,
			createQuadrilaterals: true
		});
		this.annotationEditorType = AnnotationEditorType.HIGHLIGHT;
	}
	render() {
		const { data: { overlaidText, popupRef } } = this;
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.classList.add("highlightAnnotation");
		this._editOnDoubleClick();
		if (overlaidText) {
			const mark = document.createElement("mark");
			mark.classList.add("overlaidText");
			mark.textContent = overlaidText;
			this.container.append(mark);
		}
		return this.container;
	}
};
var UnderlineAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true,
			createQuadrilaterals: true
		});
	}
	render() {
		const { data: { overlaidText, popupRef } } = this;
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.classList.add("underlineAnnotation");
		if (overlaidText) {
			const underline = document.createElement("u");
			underline.classList.add("overlaidText");
			underline.textContent = overlaidText;
			this.container.append(underline);
		}
		return this.container;
	}
};
var SquigglyAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true,
			createQuadrilaterals: true
		});
	}
	render() {
		const { data: { overlaidText, popupRef } } = this;
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.classList.add("squigglyAnnotation");
		if (overlaidText) {
			const underline = document.createElement("u");
			underline.classList.add("overlaidText");
			underline.textContent = overlaidText;
			this.container.append(underline);
		}
		return this.container;
	}
};
var StrikeOutAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true,
			createQuadrilaterals: true
		});
	}
	render() {
		const { data: { overlaidText, popupRef } } = this;
		if (!popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this.container.classList.add("strikeoutAnnotation");
		if (overlaidText) {
			const strikeout = document.createElement("s");
			strikeout.classList.add("overlaidText");
			strikeout.textContent = overlaidText;
			this.container.append(strikeout);
		}
		return this.container;
	}
};
var StampAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, {
			isRenderable: true,
			ignoreBorder: true
		});
		this.annotationEditorType = AnnotationEditorType.STAMP;
	}
	render() {
		this.container.classList.add("stampAnnotation");
		this.container.setAttribute("role", "img");
		if (!this.data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		}
		this._editOnDoubleClick();
		return this.container;
	}
};
var _trigger = /* @__PURE__ */ new WeakMap();
var _FileAttachmentAnnotationElement_brand = /* @__PURE__ */ new WeakSet();
var FileAttachmentAnnotationElement = class extends AnnotationElement {
	constructor(parameters) {
		super(parameters, { isRenderable: true });
		_classPrivateMethodInitSpec(this, _FileAttachmentAnnotationElement_brand);
		_classPrivateFieldInitSpec(this, _trigger, null);
		const { file } = this.data;
		this.filename = file.filename;
		this.content = file.content;
		this.linkService.eventBus?.dispatch("fileattachmentannotation", {
			source: this,
			...file
		});
	}
	render() {
		this.container.classList.add("fileAttachmentAnnotation");
		const { container, data } = this;
		let trigger;
		if (data.hasAppearance || data.fillAlpha === 0) trigger = document.createElement("div");
		else {
			trigger = document.createElement("img");
			trigger.src = `${this.imageResourcesPath}annotation-${/paperclip/i.test(data.name) ? "paperclip" : "pushpin"}.svg`;
			if (data.fillAlpha && data.fillAlpha < 1) trigger.style = `filter: opacity(${Math.round(data.fillAlpha * 100)}%);`;
		}
		trigger.addEventListener("dblclick", _assertClassBrand(_FileAttachmentAnnotationElement_brand, this, _download).bind(this));
		_classPrivateFieldSet2(_trigger, this, trigger);
		const { isMac } = FeatureTest.platform;
		container.addEventListener("keydown", (evt) => {
			if (evt.key === "Enter" && (isMac ? evt.metaKey : evt.ctrlKey)) _assertClassBrand(_FileAttachmentAnnotationElement_brand, this, _download).call(this);
		});
		if (!data.popupRef && this.hasPopupData) {
			this.hasOwnCommentButton = true;
			this._createPopup();
		} else trigger.classList.add("popupTriggerArea");
		container.append(trigger);
		return container;
	}
	getElementsToTriggerPopup() {
		return _classPrivateFieldGet2(_trigger, this);
	}
	addHighlightArea() {
		this.container.classList.add("highlightArea");
	}
};
function _download() {
	this.downloadManager?.openOrDownloadData(this.content, this.filename);
}
var _accessibilityManager = /* @__PURE__ */ new WeakMap();
var _annotationCanvasMap = /* @__PURE__ */ new WeakMap();
var _annotationStorage2 = /* @__PURE__ */ new WeakMap();
var _editableAnnotations = /* @__PURE__ */ new WeakMap();
var _structTreeLayer = /* @__PURE__ */ new WeakMap();
var _linkService = /* @__PURE__ */ new WeakMap();
var _elements2 = /* @__PURE__ */ new WeakMap();
var _hasAriaAttributesFromStructTree = /* @__PURE__ */ new WeakMap();
var _AnnotationLayer_brand = /* @__PURE__ */ new WeakSet();
var AnnotationLayer = class AnnotationLayer {
	constructor({ div, accessibilityManager, annotationCanvasMap, annotationEditorUIManager, page, viewport, structTreeLayer, commentManager, linkService, annotationStorage }) {
		_classPrivateMethodInitSpec(this, _AnnotationLayer_brand);
		_classPrivateFieldInitSpec(this, _accessibilityManager, null);
		_classPrivateFieldInitSpec(this, _annotationCanvasMap, null);
		_classPrivateFieldInitSpec(this, _annotationStorage2, null);
		_classPrivateFieldInitSpec(this, _editableAnnotations, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _structTreeLayer, null);
		_classPrivateFieldInitSpec(this, _linkService, null);
		_classPrivateFieldInitSpec(this, _elements2, []);
		_classPrivateFieldInitSpec(this, _hasAriaAttributesFromStructTree, false);
		this.div = div;
		_classPrivateFieldSet2(_accessibilityManager, this, accessibilityManager);
		_classPrivateFieldSet2(_annotationCanvasMap, this, annotationCanvasMap);
		_classPrivateFieldSet2(_structTreeLayer, this, structTreeLayer || null);
		_classPrivateFieldSet2(_linkService, this, linkService || null);
		_classPrivateFieldSet2(_annotationStorage2, this, annotationStorage || new AnnotationStorage());
		this.page = page;
		this.viewport = viewport;
		this.zIndex = 0;
		this._annotationEditorUIManager = annotationEditorUIManager;
		this._commentManager = commentManager || null;
	}
	hasEditableAnnotations() {
		return _classPrivateFieldGet2(_editableAnnotations, this).size > 0;
	}
	async render(params) {
		const { annotations } = params;
		const layer = this.div;
		setLayerDimensions(layer, this.viewport);
		const popupToElements = /* @__PURE__ */ new Map();
		const popupAnnotations = [];
		const elementParams = {
			data: null,
			layer,
			linkService: _classPrivateFieldGet2(_linkService, this),
			downloadManager: params.downloadManager,
			imageResourcesPath: params.imageResourcesPath || "",
			renderForms: params.renderForms !== false,
			svgFactory: new DOMSVGFactory(),
			annotationStorage: _classPrivateFieldGet2(_annotationStorage2, this),
			enableComment: params.enableComment === true,
			enableScripting: params.enableScripting === true,
			hasJSActions: params.hasJSActions,
			fieldObjects: params.fieldObjects,
			parent: this,
			elements: null
		};
		for (const data of annotations) {
			if (data.noHTML) continue;
			const isPopupAnnotation = data.annotationType === AnnotationType.POPUP;
			if (!isPopupAnnotation) {
				if (data.rect[2] === data.rect[0] || data.rect[3] === data.rect[1]) continue;
			} else {
				const elements = popupToElements.get(data.id);
				if (!elements) continue;
				if (!this._commentManager) {
					popupAnnotations.push(data);
					continue;
				}
				elementParams.elements = elements;
			}
			elementParams.data = data;
			const element = AnnotationElementFactory.create(elementParams);
			if (!element.isRenderable) continue;
			if (!isPopupAnnotation) {
				_classPrivateFieldGet2(_elements2, this).push(element);
				if (data.popupRef) popupToElements.getOrInsertComputed(data.popupRef, makeArr).push(element);
			}
			const rendered = element.render();
			if (data.hidden) rendered.style.visibility = "hidden";
			if (element._isEditable) {
				_classPrivateFieldGet2(_editableAnnotations, this).set(element.data.id, element);
				this._annotationEditorUIManager?.renderAnnotationElement(element);
			}
		}
		await _assertClassBrand(_AnnotationLayer_brand, this, _addElementsToDOM).call(this);
		for (const data of popupAnnotations) {
			const elements = elementParams.elements = popupToElements.get(data.id);
			elementParams.data = data;
			const element = AnnotationElementFactory.create(elementParams);
			if (!element.isRenderable) continue;
			const rendered = element.render();
			element.contentElement.id = `${AnnotationPrefix}${data.id}`;
			if (data.hidden) rendered.style.visibility = "hidden";
			elements.at(-1).container.after(rendered);
		}
		_assertClassBrand(_AnnotationLayer_brand, this, _setAnnotationCanvasMap).call(this);
	}
	async addLinkAnnotations(annotations) {
		const elementParams = {
			data: null,
			layer: this.div,
			linkService: _classPrivateFieldGet2(_linkService, this),
			svgFactory: new DOMSVGFactory(),
			parent: this
		};
		for (const data of annotations) {
			data.borderStyle || (data.borderStyle = AnnotationLayer._defaultBorderStyle);
			elementParams.data = data;
			const element = AnnotationElementFactory.create(elementParams);
			if (!element.isRenderable) continue;
			element.render();
			element.contentElement.id = `${AnnotationPrefix}${data.id}`;
			_classPrivateFieldGet2(_elements2, this).push(element);
		}
		await _assertClassBrand(_AnnotationLayer_brand, this, _addElementsToDOM).call(this);
	}
	update({ viewport }) {
		const layer = this.div;
		this.viewport = viewport;
		setLayerDimensions(layer, { rotation: viewport.rotation });
		_assertClassBrand(_AnnotationLayer_brand, this, _setAnnotationCanvasMap).call(this);
		layer.hidden = false;
	}
	getEditableAnnotations() {
		return _classPrivateFieldGet2(_editableAnnotations, this).values();
	}
	getEditableAnnotation(id) {
		return _classPrivateFieldGet2(_editableAnnotations, this).get(id);
	}
	addFakeAnnotation(editor) {
		const { div } = this;
		const { id, rotation } = editor;
		const element = new EditorAnnotationElement({
			data: {
				id,
				rect: editor.getPDFRect(),
				rotation
			},
			editor,
			layer: div,
			parent: this,
			enableComment: !!this._commentManager,
			linkService: _classPrivateFieldGet2(_linkService, this),
			annotationStorage: _classPrivateFieldGet2(_annotationStorage2, this)
		});
		element.render();
		element.contentElement.id = `${AnnotationPrefix}${id}`;
		element.createOrUpdatePopup();
		_classPrivateFieldGet2(_elements2, this).push(element);
		return element;
	}
	removeAnnotation(id) {
		const index = _classPrivateFieldGet2(_elements2, this).findIndex((el) => el.data.id === id);
		if (index < 0) return;
		const [element] = _classPrivateFieldGet2(_elements2, this).splice(index, 1);
		_classPrivateFieldGet2(_accessibilityManager, this)?.removePointerInTextLayer(element.contentElement);
	}
	updateFakeAnnotations(editors) {
		if (editors.length === 0) return;
		for (const editor of editors) editor.updateFakeAnnotationElement(this);
		_assertClassBrand(_AnnotationLayer_brand, this, _addElementsToDOM).call(this);
	}
	togglePointerEvents(enabled = false) {
		this.div.classList.toggle("disabled", !enabled);
	}
	static get _defaultBorderStyle() {
		return shadow(this, "_defaultBorderStyle", Object.freeze({
			width: 1,
			rawWidth: 1,
			style: AnnotationBorderStyleType.SOLID,
			dashArray: [3],
			horizontalCornerRadius: 0,
			verticalCornerRadius: 0
		}));
	}
};
async function _addElementsToDOM() {
	if (_classPrivateFieldGet2(_elements2, this).length === 0) return;
	this.div.replaceChildren();
	const promises = [];
	if (!_classPrivateFieldGet2(_hasAriaAttributesFromStructTree, this)) {
		_classPrivateFieldSet2(_hasAriaAttributesFromStructTree, this, true);
		for (const { contentElement, data: { id } } of _classPrivateFieldGet2(_elements2, this)) {
			const annotationId = contentElement.id = `${AnnotationPrefix}${id}`;
			promises.push(_classPrivateFieldGet2(_structTreeLayer, this)?.getAriaAttributes(annotationId).then((ariaAttributes) => {
				if (ariaAttributes) for (const [key, value] of ariaAttributes) contentElement.setAttribute(key, value);
			}));
		}
	}
	_classPrivateFieldGet2(_elements2, this).sort(({ data: { rect: [a0, a1, a2, a3] } }, { data: { rect: [b0, b1, b2, b3] } }) => {
		if (a0 === a2 && a1 === a3) return 1;
		if (b0 === b2 && b1 === b3) return -1;
		const top1 = a3;
		const bot1 = a1;
		const mid1 = (a1 + a3) / 2;
		const top2 = b3;
		const bot2 = b1;
		const mid2 = (b1 + b3) / 2;
		if (mid1 >= top2 && mid2 <= bot1) return -1;
		if (mid2 >= top1 && mid1 <= bot2) return 1;
		return (a0 + a2) / 2 - (b0 + b2) / 2;
	});
	const fragment = document.createDocumentFragment();
	for (const element of _classPrivateFieldGet2(_elements2, this)) {
		fragment.append(element.container);
		if (this._commentManager) (element.extraPopupElement?.popup || element.popup)?.renderCommentButton();
		else if (element.extraPopupElement) fragment.append(element.extraPopupElement.render());
	}
	this.div.append(fragment);
	await Promise.all(promises);
	if (_classPrivateFieldGet2(_accessibilityManager, this)) for (const element of _classPrivateFieldGet2(_elements2, this)) _classPrivateFieldGet2(_accessibilityManager, this).addPointerInTextLayer(element.contentElement, false);
}
function _setAnnotationCanvasMap() {
	if (!_classPrivateFieldGet2(_annotationCanvasMap, this)) return;
	const layer = this.div;
	for (const [id, canvas] of _classPrivateFieldGet2(_annotationCanvasMap, this)) {
		const element = layer.querySelector(`[data-annotation-id="${id}"]`);
		if (!element) continue;
		canvas.className = "annotationContent";
		const { firstChild } = element;
		if (!firstChild) element.append(canvas);
		else if (firstChild.nodeName === "CANVAS") firstChild.replaceWith(canvas);
		else if (!firstChild.classList.contains("annotationContent")) firstChild.before(canvas);
		else firstChild.after(canvas);
		const editableAnnotation = _classPrivateFieldGet2(_editableAnnotations, this).get(id);
		if (!editableAnnotation) continue;
		if (editableAnnotation._hasNoCanvas) {
			this._annotationEditorUIManager?.setMissingCanvas(id, element.id, canvas);
			editableAnnotation._hasNoCanvas = false;
		} else editableAnnotation.canvas = canvas;
	}
	_classPrivateFieldGet2(_annotationCanvasMap, this).clear();
}
var EOL_PATTERN = /\r\n?|\n/g;
var _content = /* @__PURE__ */ new WeakMap();
var _editorDivId = /* @__PURE__ */ new WeakMap();
var _editModeAC = /* @__PURE__ */ new WeakMap();
var _fontSize = /* @__PURE__ */ new WeakMap();
var _FreeTextEditor_brand = /* @__PURE__ */ new WeakSet();
var FreeTextEditor = class FreeTextEditor extends AnnotationEditor {
	static get _keyboardManager() {
		const proto = FreeTextEditor.prototype;
		const arrowChecker = (self) => self.isEmpty();
		const small = AnnotationEditorUIManager.TRANSLATE_SMALL;
		const big = AnnotationEditorUIManager.TRANSLATE_BIG;
		return shadow(this, "_keyboardManager", new KeyboardManager([
			[
				[
					"ctrl+s",
					"mac+meta+s",
					"ctrl+p",
					"mac+meta+p"
				],
				proto.commitOrRemove,
				{ bubbles: true }
			],
			[[
				"ctrl+Enter",
				"mac+meta+Enter",
				"Escape",
				"mac+Escape"
			], proto.commitOrRemove],
			[
				["ArrowLeft", "mac+ArrowLeft"],
				proto._translateEmpty,
				{
					args: [-small, 0],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowLeft", "mac+shift+ArrowLeft"],
				proto._translateEmpty,
				{
					args: [-big, 0],
					checker: arrowChecker
				}
			],
			[
				["ArrowRight", "mac+ArrowRight"],
				proto._translateEmpty,
				{
					args: [small, 0],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowRight", "mac+shift+ArrowRight"],
				proto._translateEmpty,
				{
					args: [big, 0],
					checker: arrowChecker
				}
			],
			[
				["ArrowUp", "mac+ArrowUp"],
				proto._translateEmpty,
				{
					args: [0, -small],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowUp", "mac+shift+ArrowUp"],
				proto._translateEmpty,
				{
					args: [0, -big],
					checker: arrowChecker
				}
			],
			[
				["ArrowDown", "mac+ArrowDown"],
				proto._translateEmpty,
				{
					args: [0, small],
					checker: arrowChecker
				}
			],
			[
				["ctrl+ArrowDown", "mac+shift+ArrowDown"],
				proto._translateEmpty,
				{
					args: [0, big],
					checker: arrowChecker
				}
			]
		]));
	}
	constructor(params) {
		super({
			...params,
			name: "freeTextEditor"
		});
		_classPrivateMethodInitSpec(this, _FreeTextEditor_brand);
		_classPrivateFieldInitSpec(this, _content, "");
		_classPrivateFieldInitSpec(this, _editorDivId, `${this.id}-editor`);
		_classPrivateFieldInitSpec(this, _editModeAC, null);
		_classPrivateFieldInitSpec(this, _fontSize, void 0);
		_defineProperty(this, "_colorPicker", null);
		this.color = params.color || FreeTextEditor._defaultColor || AnnotationEditor._defaultLineColor;
		_classPrivateFieldSet2(_fontSize, this, params.fontSize || FreeTextEditor._defaultFontSize);
		if (!this.annotationElementId) this._uiManager.a11yAlert("pdfjs-editor-freetext-added-alert");
		this.canAddComment = false;
	}
	static initialize(l10n, uiManager) {
		AnnotationEditor.initialize(l10n, uiManager);
		const style = getComputedStyle(document.documentElement);
		this._internalPadding = parseFloat(style.getPropertyValue("--freetext-padding"));
	}
	static updateDefaultParams(type, value) {
		switch (type) {
			case AnnotationEditorParamsType.FREETEXT_SIZE:
				FreeTextEditor._defaultFontSize = value;
				break;
			case AnnotationEditorParamsType.FREETEXT_COLOR:
				FreeTextEditor._defaultColor = value;
				break;
		}
	}
	updateParams(type, value) {
		switch (type) {
			case AnnotationEditorParamsType.FREETEXT_SIZE:
				_assertClassBrand(_FreeTextEditor_brand, this, _updateFontSize).call(this, value);
				break;
			case AnnotationEditorParamsType.FREETEXT_COLOR:
				_assertClassBrand(_FreeTextEditor_brand, this, _updateColor2).call(this, value);
				break;
		}
	}
	static get defaultPropertiesToUpdate() {
		return [[AnnotationEditorParamsType.FREETEXT_SIZE, FreeTextEditor._defaultFontSize], [AnnotationEditorParamsType.FREETEXT_COLOR, FreeTextEditor._defaultColor || AnnotationEditor._defaultLineColor]];
	}
	get propertiesToUpdate() {
		return [[AnnotationEditorParamsType.FREETEXT_SIZE, _classPrivateFieldGet2(_fontSize, this)], [AnnotationEditorParamsType.FREETEXT_COLOR, this.color]];
	}
	get toolbarButtons() {
		this._colorPicker || (this._colorPicker = new BasicColorPicker(this));
		return [["colorPicker", this._colorPicker]];
	}
	get colorType() {
		return AnnotationEditorParamsType.FREETEXT_COLOR;
	}
	onUpdatedColor() {
		this.editorDiv.style.color = this.color;
		this._colorPicker?.update(this.color);
		super.onUpdatedColor();
	}
	_translateEmpty(x, y) {
		this._uiManager.translateSelectedEditors(x, y, true);
	}
	getInitialTranslation() {
		const scale = this.parentScale;
		return [-FreeTextEditor._internalPadding * scale, -(FreeTextEditor._internalPadding + _classPrivateFieldGet2(_fontSize, this)) * scale];
	}
	rebuild() {
		if (!this.parent) return;
		super.rebuild();
		if (this.div === null) return;
		if (!this.isAttachedToDOM) this.parent.add(this);
	}
	enableEditMode() {
		if (!super.enableEditMode()) return false;
		this.overlayDiv.classList.remove("enabled");
		this.editorDiv.contentEditable = true;
		this._isDraggable = false;
		this.div.removeAttribute("aria-activedescendant");
		_classPrivateFieldSet2(_editModeAC, this, new AbortController());
		const signal = this._uiManager.combinedSignal(_classPrivateFieldGet2(_editModeAC, this));
		this.editorDiv.addEventListener("keydown", this.editorDivKeydown.bind(this), { signal });
		this.editorDiv.addEventListener("focus", this.editorDivFocus.bind(this), { signal });
		this.editorDiv.addEventListener("blur", this.editorDivBlur.bind(this), { signal });
		this.editorDiv.addEventListener("input", this.editorDivInput.bind(this), { signal });
		this.editorDiv.addEventListener("paste", this.editorDivPaste.bind(this), { signal });
		return true;
	}
	disableEditMode() {
		if (!super.disableEditMode()) return false;
		this.overlayDiv.classList.add("enabled");
		this.editorDiv.contentEditable = false;
		this.div.setAttribute("aria-activedescendant", _classPrivateFieldGet2(_editorDivId, this));
		this._isDraggable = true;
		_classPrivateFieldGet2(_editModeAC, this)?.abort();
		_classPrivateFieldSet2(_editModeAC, this, null);
		this.div.focus({ preventScroll: true });
		this.isEditing = false;
		this.parent.div.classList.add("freetextEditing");
		return true;
	}
	focusin(event) {
		if (!this._focusEventsAllowed) return;
		super.focusin(event);
		if (event.target !== this.editorDiv) this.editorDiv.focus();
	}
	onceAdded(focus) {
		if (this.width) return;
		this.enableEditMode();
		if (focus) this.editorDiv.focus();
		if (this._initialOptions?.isCentered) this.center();
		this._initialOptions = null;
	}
	isEmpty() {
		return !this.editorDiv || this.editorDiv.innerText.trim() === "";
	}
	remove() {
		this.isEditing = false;
		if (this.parent) {
			this.parent.setEditingState(true);
			this.parent.div.classList.add("freetextEditing");
		}
		super.remove();
	}
	commit() {
		if (!this.isInEditMode()) return;
		super.commit();
		this.disableEditMode();
		const savedText = _classPrivateFieldGet2(_content, this);
		const newText = _classPrivateFieldSet2(_content, this, _assertClassBrand(_FreeTextEditor_brand, this, _extractText).call(this).trimEnd());
		if (savedText === newText) return;
		const setText = (text) => {
			_classPrivateFieldSet2(_content, this, text);
			if (!text) {
				this.remove();
				return;
			}
			_assertClassBrand(_FreeTextEditor_brand, this, _setContent).call(this);
			this._uiManager.rebuild(this);
			_assertClassBrand(_FreeTextEditor_brand, this, _setEditorDimensions).call(this);
		};
		this.addCommands({
			cmd: () => {
				setText(newText);
			},
			undo: () => {
				setText(savedText);
			},
			mustExec: false
		});
		_assertClassBrand(_FreeTextEditor_brand, this, _setEditorDimensions).call(this);
	}
	shouldGetKeyboardEvents() {
		return this.isInEditMode();
	}
	enterInEditMode() {
		this.enableEditMode();
		this.editorDiv.focus();
	}
	keydown(event) {
		if (event.target === this.div && event.key === "Enter") {
			this.enterInEditMode();
			event.preventDefault();
		}
	}
	editorDivKeydown(event) {
		FreeTextEditor._keyboardManager.exec(this, event);
	}
	editorDivFocus(event) {
		this.isEditing = true;
	}
	editorDivBlur(event) {
		this.isEditing = false;
	}
	editorDivInput(event) {
		this.parent.div.classList.toggle("freetextEditing", this.isEmpty());
	}
	disableEditing() {
		this.editorDiv.setAttribute("role", "comment");
		this.editorDiv.removeAttribute("aria-multiline");
	}
	enableEditing() {
		this.editorDiv.setAttribute("role", "textbox");
		this.editorDiv.setAttribute("aria-multiline", true);
	}
	get canChangeContent() {
		return true;
	}
	render() {
		if (this.div) return this.div;
		let baseX, baseY;
		if (this._isCopy || this.annotationElementId) {
			baseX = this.x;
			baseY = this.y;
		}
		super.render();
		this.editorDiv = document.createElement("div");
		this.editorDiv.className = "internal";
		this.editorDiv.setAttribute("id", _classPrivateFieldGet2(_editorDivId, this));
		this.editorDiv.setAttribute("data-l10n-id", "pdfjs-free-text2");
		this.editorDiv.setAttribute("data-l10n-attrs", "default-content");
		this.enableEditing();
		this.editorDiv.contentEditable = true;
		const { style } = this.editorDiv;
		style.fontSize = `calc(${_classPrivateFieldGet2(_fontSize, this)}px * var(--total-scale-factor))`;
		style.color = this.color;
		this.div.append(this.editorDiv);
		this.overlayDiv = document.createElement("div");
		this.overlayDiv.classList.add("overlay", "enabled");
		this.div.append(this.overlayDiv);
		if (this._isCopy || this.annotationElementId) {
			const [parentWidth, parentHeight] = this.parentDimensions;
			if (this.annotationElementId) {
				const { position } = this._initialData;
				let [tx, ty] = this.getInitialTranslation();
				[tx, ty] = this.pageTranslationToScreen(tx, ty);
				const [pageWidth, pageHeight] = this.pageDimensions;
				const [pageX, pageY] = this.pageTranslation;
				let posX, posY;
				switch (this.rotation) {
					case 0:
						posX = baseX + (position[0] - pageX) / pageWidth;
						posY = baseY + this.height - (position[1] - pageY) / pageHeight;
						break;
					case 90:
						posX = baseX + (position[0] - pageX) / pageWidth;
						posY = baseY - (position[1] - pageY) / pageHeight;
						[tx, ty] = [ty, -tx];
						break;
					case 180:
						posX = baseX - this.width + (position[0] - pageX) / pageWidth;
						posY = baseY - (position[1] - pageY) / pageHeight;
						[tx, ty] = [-tx, -ty];
						break;
					case 270:
						posX = baseX + (position[0] - pageX - this.height * pageHeight) / pageWidth;
						posY = baseY + (position[1] - pageY - this.width * pageWidth) / pageHeight;
						[tx, ty] = [-ty, tx];
						break;
				}
				this.setAt(posX * parentWidth, posY * parentHeight, tx, ty);
			} else this._moveAfterPaste(baseX, baseY);
			_assertClassBrand(_FreeTextEditor_brand, this, _setContent).call(this);
			this._isDraggable = true;
			this.editorDiv.contentEditable = false;
		} else {
			this._isDraggable = false;
			this.editorDiv.contentEditable = true;
		}
		return this.div;
	}
	editorDivPaste(event) {
		const clipboardData = event.clipboardData || window.clipboardData;
		const { types } = clipboardData;
		if (types.length === 1 && types[0] === "text/plain") return;
		event.preventDefault();
		const paste = _deserializeContent.call(FreeTextEditor, clipboardData.getData("text") || "").replaceAll(EOL_PATTERN, "\n");
		if (!paste) return;
		const selection = window.getSelection();
		if (!selection.rangeCount) return;
		this.editorDiv.normalize();
		selection.deleteFromDocument();
		const range = selection.getRangeAt(0);
		if (!paste.includes("\n")) {
			range.insertNode(document.createTextNode(paste));
			this.editorDiv.normalize();
			selection.collapseToStart();
			return;
		}
		const { startContainer, startOffset } = range;
		const bufferBefore = [];
		const bufferAfter = [];
		if (startContainer.nodeType === Node.TEXT_NODE) {
			const parent = startContainer.parentElement;
			bufferAfter.push(startContainer.nodeValue.slice(startOffset).replaceAll(EOL_PATTERN, ""));
			if (parent !== this.editorDiv) {
				let buffer = bufferBefore;
				for (const child of this.editorDiv.childNodes) {
					if (child === parent) {
						buffer = bufferAfter;
						continue;
					}
					buffer.push(_getNodeContent.call(FreeTextEditor, child));
				}
			}
			bufferBefore.push(startContainer.nodeValue.slice(0, startOffset).replaceAll(EOL_PATTERN, ""));
		} else if (startContainer === this.editorDiv) {
			let buffer = bufferBefore;
			let i = 0;
			for (const child of this.editorDiv.childNodes) {
				if (i++ === startOffset) buffer = bufferAfter;
				buffer.push(_getNodeContent.call(FreeTextEditor, child));
			}
		}
		_classPrivateFieldSet2(_content, this, `${bufferBefore.join("\n")}${paste}${bufferAfter.join("\n")}`);
		_assertClassBrand(_FreeTextEditor_brand, this, _setContent).call(this);
		const newRange = new Range();
		let beforeLength = Math.sumPrecise(bufferBefore.map((line) => line.length));
		for (const { firstChild } of this.editorDiv.childNodes) if (firstChild.nodeType === Node.TEXT_NODE) {
			const length = firstChild.nodeValue.length;
			if (beforeLength <= length) {
				newRange.setStart(firstChild, beforeLength);
				newRange.setEnd(firstChild, beforeLength);
				break;
			}
			beforeLength -= length;
		}
		selection.removeAllRanges();
		selection.addRange(newRange);
	}
	get contentDiv() {
		return this.editorDiv;
	}
	getPDFRect() {
		const padding = FreeTextEditor._internalPadding * this.parentScale;
		return this.getRect(padding, padding);
	}
	static async deserialize(data, parent, uiManager) {
		let initialData = null;
		if (data instanceof FreeTextAnnotationElement) {
			const { data: { defaultAppearanceData: { fontSize, fontColor }, rect, rotation, id, popupRef, richText, contentsObj, creationDate, modificationDate }, textContent, textPosition, parent: { page: { pageNumber } } } = data;
			if (!textContent || textContent.length === 0) return null;
			initialData = data = {
				annotationType: AnnotationEditorType.FREETEXT,
				color: Array.from(fontColor),
				fontSize,
				value: textContent.join("\n"),
				position: textPosition,
				pageIndex: pageNumber - 1,
				rect: rect.slice(0),
				rotation,
				annotationElementId: id,
				id,
				deleted: false,
				popupRef,
				comment: contentsObj?.str || null,
				richText,
				creationDate,
				modificationDate
			};
		}
		const editor = await super.deserialize(data, parent, uiManager);
		_classPrivateFieldSet2(_fontSize, editor, data.fontSize);
		editor.color = Util.makeHexColor(...data.color);
		_classPrivateFieldSet2(_content, editor, _deserializeContent.call(FreeTextEditor, data.value));
		editor._initialData = initialData;
		if (data.comment) editor.setCommentData(data);
		return editor;
	}
	serialize(isForCopying = false) {
		if (this.isEmpty()) return null;
		if (this.deleted) return this.serializeDeleted();
		const color = AnnotationEditor._colorManager.convert(this.isAttachedToDOM ? getComputedStyle(this.editorDiv).color : this.color);
		const serialized = Object.assign(super.serialize(isForCopying), {
			color,
			fontSize: _classPrivateFieldGet2(_fontSize, this),
			value: _assertClassBrand(_FreeTextEditor_brand, this, _serializeContent).call(this)
		});
		this.addComment(serialized);
		if (isForCopying) {
			serialized.isCopy = true;
			return serialized;
		}
		if (this.annotationElementId && !_assertClassBrand(_FreeTextEditor_brand, this, _hasElementChanged).call(this, serialized)) return null;
		serialized.id = this.annotationElementId;
		return serialized;
	}
	renderAnnotationElement(annotation) {
		const content = super.renderAnnotationElement(annotation);
		if (!content) return null;
		const { style } = content;
		style.fontSize = `calc(${_classPrivateFieldGet2(_fontSize, this)}px * var(--total-scale-factor))`;
		style.color = this.color;
		content.replaceChildren();
		for (const line of _classPrivateFieldGet2(_content, this).split("\n")) {
			const div = document.createElement("div");
			div.append(line ? document.createTextNode(line) : document.createElement("br"));
			content.append(div);
		}
		annotation.updateEdited({
			rect: this.getPDFRect(),
			popup: this._uiManager.hasCommentManager() || this.hasEditedComment ? this.comment : { text: _classPrivateFieldGet2(_content, this) }
		});
		return content;
	}
	resetAnnotationElement(annotation) {
		super.resetAnnotationElement(annotation);
		annotation.resetEdited();
	}
};
_FreeTextEditor = FreeTextEditor;
function _updateFontSize(fontSize) {
	const setFontsize = (size) => {
		this.editorDiv.style.fontSize = `calc(${size}px * var(--total-scale-factor))`;
		this.translate(0, -(size - _classPrivateFieldGet2(_fontSize, this)) * this.parentScale);
		_classPrivateFieldSet2(_fontSize, this, size);
		_assertClassBrand(_FreeTextEditor_brand, this, _setEditorDimensions).call(this);
	};
	const savedFontsize = _classPrivateFieldGet2(_fontSize, this);
	this.addCommands({
		cmd: setFontsize.bind(this, fontSize),
		undo: setFontsize.bind(this, savedFontsize),
		post: this._uiManager.updateUI.bind(this._uiManager, this),
		mustExec: true,
		type: AnnotationEditorParamsType.FREETEXT_SIZE,
		overwriteIfSameType: true,
		keepUndo: true
	});
}
function _updateColor2(color) {
	const setColor = (col) => {
		this.color = col;
		this.onUpdatedColor();
	};
	const savedColor = this.color;
	this.addCommands({
		cmd: setColor.bind(this, color),
		undo: setColor.bind(this, savedColor),
		post: this._uiManager.updateUI.bind(this._uiManager, this),
		mustExec: true,
		type: AnnotationEditorParamsType.FREETEXT_COLOR,
		overwriteIfSameType: true,
		keepUndo: true
	});
}
function _extractText() {
	const buffer = [];
	this.editorDiv.normalize();
	let prevChild = null;
	for (const child of this.editorDiv.childNodes) {
		if (prevChild?.nodeType === Node.TEXT_NODE && child.nodeName === "BR") continue;
		buffer.push(_getNodeContent.call(_FreeTextEditor, child));
		prevChild = child;
	}
	return buffer.join("\n");
}
function _setEditorDimensions() {
	const [parentWidth, parentHeight] = this.parentDimensions;
	let rect;
	if (this.isAttachedToDOM) rect = this.div.getBoundingClientRect();
	else {
		const { currentLayer, div } = this;
		const savedDisplay = div.style.display;
		const savedVisibility = div.classList.contains("hidden");
		div.classList.remove("hidden");
		div.style.display = "hidden";
		currentLayer.div.append(this.div);
		rect = div.getBoundingClientRect();
		div.remove();
		div.style.display = savedDisplay;
		div.classList.toggle("hidden", savedVisibility);
	}
	if (this.rotation % 180 === this.parentRotation % 180) {
		this.width = rect.width / parentWidth;
		this.height = rect.height / parentHeight;
	} else {
		this.width = rect.height / parentWidth;
		this.height = rect.width / parentHeight;
	}
	this.fixAndSetPosition();
}
function _getNodeContent(node) {
	return (node.nodeType === Node.TEXT_NODE ? node.nodeValue : node.innerText).replaceAll(EOL_PATTERN, "");
}
function _setContent() {
	this.editorDiv.replaceChildren();
	if (!_classPrivateFieldGet2(_content, this)) return;
	for (const line of _classPrivateFieldGet2(_content, this).split("\n")) {
		const div = document.createElement("div");
		div.append(line ? document.createTextNode(line) : document.createElement("br"));
		this.editorDiv.append(div);
	}
}
function _serializeContent() {
	return _classPrivateFieldGet2(_content, this).replaceAll("\xA0", " ");
}
function _deserializeContent(content) {
	return content.replaceAll(" ", "\xA0");
}
function _hasElementChanged(serialized) {
	const { value, fontSize, color, pageIndex } = this._initialData;
	return this.hasEditedComment || this._hasBeenMoved || serialized.value !== value || serialized.fontSize !== fontSize || serialized.color.some((c, i) => c !== color[i]) || serialized.pageIndex !== pageIndex;
}
_defineProperty(FreeTextEditor, "_freeTextDefaultContent", "");
_defineProperty(FreeTextEditor, "_internalPadding", 0);
_defineProperty(FreeTextEditor, "_defaultColor", null);
_defineProperty(FreeTextEditor, "_defaultFontSize", 10);
_defineProperty(FreeTextEditor, "_type", "freetext");
_defineProperty(FreeTextEditor, "_editorType", AnnotationEditorType.FREETEXT);
var Outline = class {
	toSVGPath() {
		unreachable("Abstract method `toSVGPath` must be implemented.");
	}
	get box() {
		unreachable("Abstract getter `box` must be implemented.");
	}
	serialize(_bbox, _rotation) {
		unreachable("Abstract method `serialize` must be implemented.");
	}
	static _rescale(src, tx, ty, sx, sy, dest) {
		dest || (dest = new Float32Array(src.length));
		for (let i = 0, ii = src.length; i < ii; i += 2) {
			dest[i] = tx + src[i] * sx;
			dest[i + 1] = ty + src[i + 1] * sy;
		}
		return dest;
	}
	static _rescaleAndSwap(src, tx, ty, sx, sy, dest) {
		dest || (dest = new Float32Array(src.length));
		for (let i = 0, ii = src.length; i < ii; i += 2) {
			dest[i] = tx + src[i + 1] * sx;
			dest[i + 1] = ty + src[i] * sy;
		}
		return dest;
	}
	static _translate(src, tx, ty, dest) {
		dest || (dest = new Float32Array(src.length));
		for (let i = 0, ii = src.length; i < ii; i += 2) {
			dest[i] = tx + src[i];
			dest[i + 1] = ty + src[i + 1];
		}
		return dest;
	}
	static svgRound(x) {
		return Math.round(x * 1e4);
	}
	static _normalizePoint(x, y, parentWidth, parentHeight, rotation) {
		switch (rotation) {
			case 90: return [1 - y / parentWidth, x / parentHeight];
			case 180: return [1 - x / parentWidth, 1 - y / parentHeight];
			case 270: return [y / parentWidth, 1 - x / parentHeight];
			default: return [x / parentWidth, y / parentHeight];
		}
	}
	static _normalizePagePoint(x, y, rotation) {
		switch (rotation) {
			case 90: return [1 - y, x];
			case 180: return [1 - x, 1 - y];
			case 270: return [y, 1 - x];
			default: return [x, y];
		}
	}
	static createBezierPoints(x1, y1, x2, y2, x3, y3) {
		return [
			(x1 + 5 * x2) / 6,
			(y1 + 5 * y2) / 6,
			(5 * x2 + x3) / 6,
			(5 * y2 + y3) / 6,
			(x2 + x3) / 2,
			(y2 + y3) / 2
		];
	}
};
_defineProperty(Outline, "PRECISION", 1e-4);
var _box = /* @__PURE__ */ new WeakMap();
var _bottom = /* @__PURE__ */ new WeakMap();
var _innerMargin = /* @__PURE__ */ new WeakMap();
var _isLTR2 = /* @__PURE__ */ new WeakMap();
var _top = /* @__PURE__ */ new WeakMap();
var _last = /* @__PURE__ */ new WeakMap();
var _lastX = /* @__PURE__ */ new WeakMap();
var _lastY = /* @__PURE__ */ new WeakMap();
var _min = /* @__PURE__ */ new WeakMap();
var _min_dist = /* @__PURE__ */ new WeakMap();
var _scaleFactor = /* @__PURE__ */ new WeakMap();
var _thickness = /* @__PURE__ */ new WeakMap();
var _points = /* @__PURE__ */ new WeakMap();
var _FreeDrawOutliner_brand = /* @__PURE__ */ new WeakSet();
var FreeDrawOutliner = class {
	constructor({ x, y }, box, scaleFactor, thickness, isLTR, innerMargin = 0) {
		_classPrivateMethodInitSpec(this, _FreeDrawOutliner_brand);
		_classPrivateFieldInitSpec(this, _box, void 0);
		_classPrivateFieldInitSpec(this, _bottom, []);
		_classPrivateFieldInitSpec(this, _innerMargin, void 0);
		_classPrivateFieldInitSpec(this, _isLTR2, void 0);
		_classPrivateFieldInitSpec(this, _top, []);
		_classPrivateFieldInitSpec(this, _last, /* @__PURE__ */ new Float32Array(18));
		_classPrivateFieldInitSpec(this, _lastX, void 0);
		_classPrivateFieldInitSpec(this, _lastY, void 0);
		_classPrivateFieldInitSpec(this, _min, void 0);
		_classPrivateFieldInitSpec(this, _min_dist, void 0);
		_classPrivateFieldInitSpec(this, _scaleFactor, void 0);
		_classPrivateFieldInitSpec(this, _thickness, void 0);
		_classPrivateFieldInitSpec(this, _points, []);
		_classPrivateFieldSet2(_box, this, box);
		_classPrivateFieldSet2(_thickness, this, thickness * scaleFactor);
		_classPrivateFieldSet2(_isLTR2, this, isLTR);
		_classPrivateFieldGet2(_last, this).set([
			NaN,
			NaN,
			NaN,
			NaN,
			x,
			y
		], 6);
		_classPrivateFieldSet2(_innerMargin, this, innerMargin);
		_classPrivateFieldSet2(_min_dist, this, _MIN_DIST._ * scaleFactor);
		_classPrivateFieldSet2(_min, this, _MIN._ * scaleFactor);
		_classPrivateFieldSet2(_scaleFactor, this, scaleFactor);
		_classPrivateFieldGet2(_points, this).push(x, y);
	}
	isEmpty() {
		return isNaN(_classPrivateFieldGet2(_last, this)[8]);
	}
	add({ x, y }) {
		_classPrivateFieldSet2(_lastX, this, x);
		_classPrivateFieldSet2(_lastY, this, y);
		const [layerX, layerY, layerWidth, layerHeight] = _classPrivateFieldGet2(_box, this);
		let [x1, y1, x2, y2] = _classPrivateFieldGet2(_last, this).subarray(8, 12);
		const diffX = x - x2;
		const diffY = y - y2;
		const d = Math.hypot(diffX, diffY);
		if (d < _classPrivateFieldGet2(_min, this)) return false;
		const diffD = d - _classPrivateFieldGet2(_min_dist, this);
		const K = diffD / d;
		const shiftX = K * diffX;
		const shiftY = K * diffY;
		let x0 = x1;
		let y0 = y1;
		x1 = x2;
		y1 = y2;
		x2 += shiftX;
		y2 += shiftY;
		_classPrivateFieldGet2(_points, this)?.push(x, y);
		const nX = -shiftY / diffD;
		const nY = shiftX / diffD;
		const thX = nX * _classPrivateFieldGet2(_thickness, this);
		const thY = nY * _classPrivateFieldGet2(_thickness, this);
		_classPrivateFieldGet2(_last, this).set(_classPrivateFieldGet2(_last, this).subarray(2, 8), 0);
		_classPrivateFieldGet2(_last, this).set([x2 + thX, y2 + thY], 4);
		_classPrivateFieldGet2(_last, this).set(_classPrivateFieldGet2(_last, this).subarray(14, 18), 12);
		_classPrivateFieldGet2(_last, this).set([x2 - thX, y2 - thY], 16);
		if (isNaN(_classPrivateFieldGet2(_last, this)[6])) {
			if (_classPrivateFieldGet2(_top, this).length === 0) {
				_classPrivateFieldGet2(_last, this).set([x1 + thX, y1 + thY], 2);
				_classPrivateFieldGet2(_top, this).push(NaN, NaN, NaN, NaN, (x1 + thX - layerX) / layerWidth, (y1 + thY - layerY) / layerHeight);
				_classPrivateFieldGet2(_last, this).set([x1 - thX, y1 - thY], 14);
				_classPrivateFieldGet2(_bottom, this).push(NaN, NaN, NaN, NaN, (x1 - thX - layerX) / layerWidth, (y1 - thY - layerY) / layerHeight);
			}
			_classPrivateFieldGet2(_last, this).set([
				x0,
				y0,
				x1,
				y1,
				x2,
				y2
			], 6);
			return !this.isEmpty();
		}
		_classPrivateFieldGet2(_last, this).set([
			x0,
			y0,
			x1,
			y1,
			x2,
			y2
		], 6);
		if (Math.abs(Math.atan2(y0 - y1, x0 - x1) - Math.atan2(shiftY, shiftX)) < Math.PI / 2) {
			[x1, y1, x2, y2] = _classPrivateFieldGet2(_last, this).subarray(2, 6);
			_classPrivateFieldGet2(_top, this).push(NaN, NaN, NaN, NaN, ((x1 + x2) / 2 - layerX) / layerWidth, ((y1 + y2) / 2 - layerY) / layerHeight);
			[x1, y1, x0, y0] = _classPrivateFieldGet2(_last, this).subarray(14, 18);
			_classPrivateFieldGet2(_bottom, this).push(NaN, NaN, NaN, NaN, ((x0 + x1) / 2 - layerX) / layerWidth, ((y0 + y1) / 2 - layerY) / layerHeight);
			return true;
		}
		[x0, y0, x1, y1, x2, y2] = _classPrivateFieldGet2(_last, this).subarray(0, 6);
		_classPrivateFieldGet2(_top, this).push(((x0 + 5 * x1) / 6 - layerX) / layerWidth, ((y0 + 5 * y1) / 6 - layerY) / layerHeight, ((5 * x1 + x2) / 6 - layerX) / layerWidth, ((5 * y1 + y2) / 6 - layerY) / layerHeight, ((x1 + x2) / 2 - layerX) / layerWidth, ((y1 + y2) / 2 - layerY) / layerHeight);
		[x2, y2, x1, y1, x0, y0] = _classPrivateFieldGet2(_last, this).subarray(12, 18);
		_classPrivateFieldGet2(_bottom, this).push(((x0 + 5 * x1) / 6 - layerX) / layerWidth, ((y0 + 5 * y1) / 6 - layerY) / layerHeight, ((5 * x1 + x2) / 6 - layerX) / layerWidth, ((5 * y1 + y2) / 6 - layerY) / layerHeight, ((x1 + x2) / 2 - layerX) / layerWidth, ((y1 + y2) / 2 - layerY) / layerHeight);
		return true;
	}
	toSVGPath() {
		if (this.isEmpty()) return "";
		const top = _classPrivateFieldGet2(_top, this);
		const bottom = _classPrivateFieldGet2(_bottom, this);
		if (isNaN(_classPrivateFieldGet2(_last, this)[6]) && !this.isEmpty()) return _assertClassBrand(_FreeDrawOutliner_brand, this, _toSVGPathTwoPoints).call(this);
		const buffer = [];
		buffer.push(`M${top[4]} ${top[5]}`);
		for (let i = 6; i < top.length; i += 6) if (isNaN(top[i])) buffer.push(`L${top[i + 4]} ${top[i + 5]}`);
		else buffer.push(`C${top[i]} ${top[i + 1]} ${top[i + 2]} ${top[i + 3]} ${top[i + 4]} ${top[i + 5]}`);
		_assertClassBrand(_FreeDrawOutliner_brand, this, _toSVGPathEnd).call(this, buffer);
		for (let i = bottom.length - 6; i >= 6; i -= 6) if (isNaN(bottom[i])) buffer.push(`L${bottom[i + 4]} ${bottom[i + 5]}`);
		else buffer.push(`C${bottom[i]} ${bottom[i + 1]} ${bottom[i + 2]} ${bottom[i + 3]} ${bottom[i + 4]} ${bottom[i + 5]}`);
		_assertClassBrand(_FreeDrawOutliner_brand, this, _toSVGPathStart).call(this, buffer);
		return buffer.join(" ");
	}
	newFreeDrawOutline(outline, points, box, scaleFactor, innerMargin, isLTR) {
		return new FreeDrawOutline(outline, points, box, scaleFactor, innerMargin, isLTR);
	}
	getOutlines() {
		const top = _classPrivateFieldGet2(_top, this);
		const bottom = _classPrivateFieldGet2(_bottom, this);
		const last = _classPrivateFieldGet2(_last, this);
		const [layerX, layerY, layerWidth, layerHeight] = _classPrivateFieldGet2(_box, this);
		const points = new Float32Array((_classPrivateFieldGet2(_points, this)?.length ?? 0) + 2);
		for (let i = 0, ii = points.length - 2; i < ii; i += 2) {
			points[i] = (_classPrivateFieldGet2(_points, this)[i] - layerX) / layerWidth;
			points[i + 1] = (_classPrivateFieldGet2(_points, this)[i + 1] - layerY) / layerHeight;
		}
		points[points.length - 2] = (_classPrivateFieldGet2(_lastX, this) - layerX) / layerWidth;
		points[points.length - 1] = (_classPrivateFieldGet2(_lastY, this) - layerY) / layerHeight;
		if (isNaN(last[6]) && !this.isEmpty()) return _assertClassBrand(_FreeDrawOutliner_brand, this, _getOutlineTwoPoints).call(this, points);
		const outline = new Float32Array(_classPrivateFieldGet2(_top, this).length + 24 + _classPrivateFieldGet2(_bottom, this).length);
		let N = top.length;
		for (let i = 0; i < N; i += 2) {
			if (isNaN(top[i])) {
				outline[i] = outline[i + 1] = NaN;
				continue;
			}
			outline[i] = top[i];
			outline[i + 1] = top[i + 1];
		}
		N = _assertClassBrand(_FreeDrawOutliner_brand, this, _getOutlineEnd).call(this, outline, N);
		for (let i = bottom.length - 6; i >= 6; i -= 6) for (let j = 0; j < 6; j += 2) {
			if (isNaN(bottom[i + j])) {
				outline[N] = outline[N + 1] = NaN;
				N += 2;
				continue;
			}
			outline[N] = bottom[i + j];
			outline[N + 1] = bottom[i + j + 1];
			N += 2;
		}
		_assertClassBrand(_FreeDrawOutliner_brand, this, _getOutlineStart).call(this, outline, N);
		return this.newFreeDrawOutline(outline, points, _classPrivateFieldGet2(_box, this), _classPrivateFieldGet2(_scaleFactor, this), _classPrivateFieldGet2(_innerMargin, this), _classPrivateFieldGet2(_isLTR2, this));
	}
};
function _getLastCoords() {
	const lastTop = _classPrivateFieldGet2(_last, this).subarray(4, 6);
	const lastBottom = _classPrivateFieldGet2(_last, this).subarray(16, 18);
	const [x, y, width, height] = _classPrivateFieldGet2(_box, this);
	return [
		(_classPrivateFieldGet2(_lastX, this) + (lastTop[0] - lastBottom[0]) / 2 - x) / width,
		(_classPrivateFieldGet2(_lastY, this) + (lastTop[1] - lastBottom[1]) / 2 - y) / height,
		(_classPrivateFieldGet2(_lastX, this) + (lastBottom[0] - lastTop[0]) / 2 - x) / width,
		(_classPrivateFieldGet2(_lastY, this) + (lastBottom[1] - lastTop[1]) / 2 - y) / height
	];
}
function _toSVGPathTwoPoints() {
	const [x, y, width, height] = _classPrivateFieldGet2(_box, this);
	const [lastTopX, lastTopY, lastBottomX, lastBottomY] = _assertClassBrand(_FreeDrawOutliner_brand, this, _getLastCoords).call(this);
	return `M${(_classPrivateFieldGet2(_last, this)[2] - x) / width} ${(_classPrivateFieldGet2(_last, this)[3] - y) / height} L${(_classPrivateFieldGet2(_last, this)[4] - x) / width} ${(_classPrivateFieldGet2(_last, this)[5] - y) / height} L${lastTopX} ${lastTopY} L${lastBottomX} ${lastBottomY} L${(_classPrivateFieldGet2(_last, this)[16] - x) / width} ${(_classPrivateFieldGet2(_last, this)[17] - y) / height} L${(_classPrivateFieldGet2(_last, this)[14] - x) / width} ${(_classPrivateFieldGet2(_last, this)[15] - y) / height} Z`;
}
function _toSVGPathStart(buffer) {
	const bottom = _classPrivateFieldGet2(_bottom, this);
	buffer.push(`L${bottom[4]} ${bottom[5]} Z`);
}
function _toSVGPathEnd(buffer) {
	const [x, y, width, height] = _classPrivateFieldGet2(_box, this);
	const lastTop = _classPrivateFieldGet2(_last, this).subarray(4, 6);
	const lastBottom = _classPrivateFieldGet2(_last, this).subarray(16, 18);
	const [lastTopX, lastTopY, lastBottomX, lastBottomY] = _assertClassBrand(_FreeDrawOutliner_brand, this, _getLastCoords).call(this);
	buffer.push(`L${(lastTop[0] - x) / width} ${(lastTop[1] - y) / height} L${lastTopX} ${lastTopY} L${lastBottomX} ${lastBottomY} L${(lastBottom[0] - x) / width} ${(lastBottom[1] - y) / height}`);
}
function _getOutlineTwoPoints(points) {
	const last = _classPrivateFieldGet2(_last, this);
	const [layerX, layerY, layerWidth, layerHeight] = _classPrivateFieldGet2(_box, this);
	const [lastTopX, lastTopY, lastBottomX, lastBottomY] = _assertClassBrand(_FreeDrawOutliner_brand, this, _getLastCoords).call(this);
	const outline = /* @__PURE__ */ new Float32Array(36);
	outline.set([
		NaN,
		NaN,
		NaN,
		NaN,
		(last[2] - layerX) / layerWidth,
		(last[3] - layerY) / layerHeight,
		NaN,
		NaN,
		NaN,
		NaN,
		(last[4] - layerX) / layerWidth,
		(last[5] - layerY) / layerHeight,
		NaN,
		NaN,
		NaN,
		NaN,
		lastTopX,
		lastTopY,
		NaN,
		NaN,
		NaN,
		NaN,
		lastBottomX,
		lastBottomY,
		NaN,
		NaN,
		NaN,
		NaN,
		(last[16] - layerX) / layerWidth,
		(last[17] - layerY) / layerHeight,
		NaN,
		NaN,
		NaN,
		NaN,
		(last[14] - layerX) / layerWidth,
		(last[15] - layerY) / layerHeight
	], 0);
	return this.newFreeDrawOutline(outline, points, _classPrivateFieldGet2(_box, this), _classPrivateFieldGet2(_scaleFactor, this), _classPrivateFieldGet2(_innerMargin, this), _classPrivateFieldGet2(_isLTR2, this));
}
function _getOutlineStart(outline, pos) {
	const bottom = _classPrivateFieldGet2(_bottom, this);
	outline.set([
		NaN,
		NaN,
		NaN,
		NaN,
		bottom[4],
		bottom[5]
	], pos);
	return pos += 6;
}
function _getOutlineEnd(outline, pos) {
	const lastTop = _classPrivateFieldGet2(_last, this).subarray(4, 6);
	const lastBottom = _classPrivateFieldGet2(_last, this).subarray(16, 18);
	const [layerX, layerY, layerWidth, layerHeight] = _classPrivateFieldGet2(_box, this);
	const [lastTopX, lastTopY, lastBottomX, lastBottomY] = _assertClassBrand(_FreeDrawOutliner_brand, this, _getLastCoords).call(this);
	outline.set([
		NaN,
		NaN,
		NaN,
		NaN,
		(lastTop[0] - layerX) / layerWidth,
		(lastTop[1] - layerY) / layerHeight,
		NaN,
		NaN,
		NaN,
		NaN,
		lastTopX,
		lastTopY,
		NaN,
		NaN,
		NaN,
		NaN,
		lastBottomX,
		lastBottomY,
		NaN,
		NaN,
		NaN,
		NaN,
		(lastBottom[0] - layerX) / layerWidth,
		(lastBottom[1] - layerY) / layerHeight
	], pos);
	return pos += 24;
}
var _MIN_DIST = { _: 8 };
var _MIN = { _: _MIN_DIST._ + { _: 2 }._ };
var _box2 = /* @__PURE__ */ new WeakMap();
var _bbox2 = /* @__PURE__ */ new WeakMap();
var _innerMargin2 = /* @__PURE__ */ new WeakMap();
var _isLTR3 = /* @__PURE__ */ new WeakMap();
var _points2 = /* @__PURE__ */ new WeakMap();
var _scaleFactor2 = /* @__PURE__ */ new WeakMap();
var _outline = /* @__PURE__ */ new WeakMap();
var _FreeDrawOutline_brand = /* @__PURE__ */ new WeakSet();
var FreeDrawOutline = class extends Outline {
	constructor(outline, points, box, scaleFactor, innerMargin, isLTR) {
		super();
		_classPrivateMethodInitSpec(this, _FreeDrawOutline_brand);
		_classPrivateFieldInitSpec(this, _box2, void 0);
		_classPrivateFieldInitSpec(this, _bbox2, /* @__PURE__ */ new Float32Array(4));
		_classPrivateFieldInitSpec(this, _innerMargin2, void 0);
		_classPrivateFieldInitSpec(this, _isLTR3, void 0);
		_classPrivateFieldInitSpec(this, _points2, void 0);
		_classPrivateFieldInitSpec(this, _scaleFactor2, void 0);
		_classPrivateFieldInitSpec(this, _outline, void 0);
		_classPrivateFieldSet2(_outline, this, outline);
		_classPrivateFieldSet2(_points2, this, points);
		_classPrivateFieldSet2(_box2, this, box);
		_classPrivateFieldSet2(_scaleFactor2, this, scaleFactor);
		_classPrivateFieldSet2(_innerMargin2, this, innerMargin);
		_classPrivateFieldSet2(_isLTR3, this, isLTR);
		this.firstPoint = [NaN, NaN];
		this.lastPoint = [NaN, NaN];
		_assertClassBrand(_FreeDrawOutline_brand, this, _computeMinMax).call(this, isLTR);
		const [x, y, width, height] = _classPrivateFieldGet2(_bbox2, this);
		for (let i = 0, ii = outline.length; i < ii; i += 2) {
			outline[i] = (outline[i] - x) / width;
			outline[i + 1] = (outline[i + 1] - y) / height;
		}
		for (let i = 0, ii = points.length; i < ii; i += 2) {
			points[i] = (points[i] - x) / width;
			points[i + 1] = (points[i + 1] - y) / height;
		}
	}
	toSVGPath() {
		const buffer = [`M${_classPrivateFieldGet2(_outline, this)[4]} ${_classPrivateFieldGet2(_outline, this)[5]}`];
		for (let i = 6, ii = _classPrivateFieldGet2(_outline, this).length; i < ii; i += 6) {
			if (isNaN(_classPrivateFieldGet2(_outline, this)[i])) {
				buffer.push(`L${_classPrivateFieldGet2(_outline, this)[i + 4]} ${_classPrivateFieldGet2(_outline, this)[i + 5]}`);
				continue;
			}
			buffer.push(`C${_classPrivateFieldGet2(_outline, this)[i]} ${_classPrivateFieldGet2(_outline, this)[i + 1]} ${_classPrivateFieldGet2(_outline, this)[i + 2]} ${_classPrivateFieldGet2(_outline, this)[i + 3]} ${_classPrivateFieldGet2(_outline, this)[i + 4]} ${_classPrivateFieldGet2(_outline, this)[i + 5]}`);
		}
		buffer.push("Z");
		return buffer.join(" ");
	}
	serialize([blX, blY, trX, trY], rotation) {
		const width = trX - blX;
		const height = trY - blY;
		let outline;
		let points;
		switch (rotation) {
			case 0:
				outline = Outline._rescale(_classPrivateFieldGet2(_outline, this), blX, trY, width, -height);
				points = Outline._rescale(_classPrivateFieldGet2(_points2, this), blX, trY, width, -height);
				break;
			case 90:
				outline = Outline._rescaleAndSwap(_classPrivateFieldGet2(_outline, this), blX, blY, width, height);
				points = Outline._rescaleAndSwap(_classPrivateFieldGet2(_points2, this), blX, blY, width, height);
				break;
			case 180:
				outline = Outline._rescale(_classPrivateFieldGet2(_outline, this), trX, blY, -width, height);
				points = Outline._rescale(_classPrivateFieldGet2(_points2, this), trX, blY, -width, height);
				break;
			case 270:
				outline = Outline._rescaleAndSwap(_classPrivateFieldGet2(_outline, this), trX, trY, -width, -height);
				points = Outline._rescaleAndSwap(_classPrivateFieldGet2(_points2, this), trX, trY, -width, -height);
				break;
		}
		return {
			outline: Array.from(outline),
			points: [Array.from(points)]
		};
	}
	get box() {
		return _classPrivateFieldGet2(_bbox2, this);
	}
	newOutliner(point, box, scaleFactor, thickness, isLTR, innerMargin = 0) {
		return new FreeDrawOutliner(point, box, scaleFactor, thickness, isLTR, innerMargin);
	}
	getNewOutline(thickness, innerMargin) {
		const [x, y, width, height] = _classPrivateFieldGet2(_bbox2, this);
		const [layerX, layerY, layerWidth, layerHeight] = _classPrivateFieldGet2(_box2, this);
		const sx = width * layerWidth;
		const sy = height * layerHeight;
		const tx = x * layerWidth + layerX;
		const ty = y * layerHeight + layerY;
		const outliner = this.newOutliner({
			x: _classPrivateFieldGet2(_points2, this)[0] * sx + tx,
			y: _classPrivateFieldGet2(_points2, this)[1] * sy + ty
		}, _classPrivateFieldGet2(_box2, this), _classPrivateFieldGet2(_scaleFactor2, this), thickness, _classPrivateFieldGet2(_isLTR3, this), innerMargin ?? _classPrivateFieldGet2(_innerMargin2, this));
		for (let i = 2; i < _classPrivateFieldGet2(_points2, this).length; i += 2) outliner.add({
			x: _classPrivateFieldGet2(_points2, this)[i] * sx + tx,
			y: _classPrivateFieldGet2(_points2, this)[i + 1] * sy + ty
		});
		return outliner.getOutlines();
	}
};
function _computeMinMax(isLTR) {
	const outline = _classPrivateFieldGet2(_outline, this);
	let lastX = outline[4];
	let lastY = outline[5];
	const minMax = [
		lastX,
		lastY,
		lastX,
		lastY
	];
	let firstPointX = lastX;
	let firstPointY = lastY;
	let lastPointX = lastX;
	let lastPointY = lastY;
	const ltrCallback = isLTR ? Math.max : Math.min;
	const bezierBbox = /* @__PURE__ */ new Float32Array(4);
	for (let i = 6, ii = outline.length; i < ii; i += 6) {
		const x = outline[i + 4], y = outline[i + 5];
		if (isNaN(outline[i])) {
			Util.pointBoundingBox(x, y, minMax);
			if (firstPointY > y) {
				firstPointX = x;
				firstPointY = y;
			} else if (firstPointY === y) firstPointX = ltrCallback(firstPointX, x);
			if (lastPointY < y) {
				lastPointX = x;
				lastPointY = y;
			} else if (lastPointY === y) lastPointX = ltrCallback(lastPointX, x);
		} else {
			bezierBbox[0] = bezierBbox[1] = Infinity;
			bezierBbox[2] = bezierBbox[3] = -Infinity;
			Util.bezierBoundingBox(lastX, lastY, ...outline.slice(i, i + 6), bezierBbox);
			Util.rectBoundingBox(bezierBbox[0], bezierBbox[1], bezierBbox[2], bezierBbox[3], minMax);
			if (firstPointY > bezierBbox[1]) {
				firstPointX = bezierBbox[0];
				firstPointY = bezierBbox[1];
			} else if (firstPointY === bezierBbox[1]) firstPointX = ltrCallback(firstPointX, bezierBbox[0]);
			if (lastPointY < bezierBbox[3]) {
				lastPointX = bezierBbox[2];
				lastPointY = bezierBbox[3];
			} else if (lastPointY === bezierBbox[3]) lastPointX = ltrCallback(lastPointX, bezierBbox[2]);
		}
		lastX = x;
		lastY = y;
	}
	const bbox = _classPrivateFieldGet2(_bbox2, this);
	bbox[0] = minMax[0] - _classPrivateFieldGet2(_innerMargin2, this);
	bbox[1] = minMax[1] - _classPrivateFieldGet2(_innerMargin2, this);
	bbox[2] = minMax[2] - minMax[0] + 2 * _classPrivateFieldGet2(_innerMargin2, this);
	bbox[3] = minMax[3] - minMax[1] + 2 * _classPrivateFieldGet2(_innerMargin2, this);
	this.firstPoint = [firstPointX, firstPointY];
	this.lastPoint = [lastPointX, lastPointY];
}
var _box3 = /* @__PURE__ */ new WeakMap();
var _firstPoint = /* @__PURE__ */ new WeakMap();
var _lastPoint = /* @__PURE__ */ new WeakMap();
var _verticalEdges = /* @__PURE__ */ new WeakMap();
var _intervals = /* @__PURE__ */ new WeakMap();
var _HighlightOutliner_brand = /* @__PURE__ */ new WeakSet();
var HighlightOutliner = class {
	constructor(boxes, borderWidth = 0, innerMargin = 0, isLTR = true) {
		_classPrivateMethodInitSpec(this, _HighlightOutliner_brand);
		_classPrivateFieldInitSpec(this, _box3, void 0);
		_classPrivateFieldInitSpec(this, _firstPoint, void 0);
		_classPrivateFieldInitSpec(this, _lastPoint, void 0);
		_classPrivateFieldInitSpec(this, _verticalEdges, []);
		_classPrivateFieldInitSpec(this, _intervals, []);
		const minMax = [
			Infinity,
			Infinity,
			-Infinity,
			-Infinity
		];
		const EPSILON = 10 ** -4;
		for (const { x, y, width, height } of boxes) {
			const x1 = Math.floor((x - borderWidth) / EPSILON) * EPSILON;
			const x2 = Math.ceil((x + width + borderWidth) / EPSILON) * EPSILON;
			const y1 = Math.floor((y - borderWidth) / EPSILON) * EPSILON;
			const y2 = Math.ceil((y + height + borderWidth) / EPSILON) * EPSILON;
			const left = [
				x1,
				y1,
				y2,
				true
			];
			const right = [
				x2,
				y1,
				y2,
				false
			];
			_classPrivateFieldGet2(_verticalEdges, this).push(left, right);
			Util.rectBoundingBox(x1, y1, x2, y2, minMax);
		}
		const bboxWidth = minMax[2] - minMax[0] + 2 * innerMargin;
		const bboxHeight = minMax[3] - minMax[1] + 2 * innerMargin;
		const shiftedMinX = minMax[0] - innerMargin;
		const shiftedMinY = minMax[1] - innerMargin;
		let firstPointX = isLTR ? -Infinity : Infinity;
		let firstPointY = Infinity;
		const lastEdge = _classPrivateFieldGet2(_verticalEdges, this).at(isLTR ? -1 : -2);
		const lastPoint = [lastEdge[0], lastEdge[2]];
		for (const edge of _classPrivateFieldGet2(_verticalEdges, this)) {
			const [x, y1, y2, left] = edge;
			if (!left && isLTR) {
				if (y1 < firstPointY) {
					firstPointY = y1;
					firstPointX = x;
				} else if (y1 === firstPointY) firstPointX = Math.max(firstPointX, x);
			} else if (left && !isLTR) {
				if (y1 < firstPointY) {
					firstPointY = y1;
					firstPointX = x;
				} else if (y1 === firstPointY) firstPointX = Math.min(firstPointX, x);
			}
			edge[0] = (x - shiftedMinX) / bboxWidth;
			edge[1] = (y1 - shiftedMinY) / bboxHeight;
			edge[2] = (y2 - shiftedMinY) / bboxHeight;
		}
		_classPrivateFieldSet2(_box3, this, new Float32Array([
			shiftedMinX,
			shiftedMinY,
			bboxWidth,
			bboxHeight
		]));
		_classPrivateFieldSet2(_firstPoint, this, [firstPointX, firstPointY]);
		_classPrivateFieldSet2(_lastPoint, this, lastPoint);
	}
	getOutlines() {
		_classPrivateFieldGet2(_verticalEdges, this).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
		const outlineVerticalEdges = [];
		for (const edge of _classPrivateFieldGet2(_verticalEdges, this)) if (edge[3]) {
			outlineVerticalEdges.push(..._assertClassBrand(_HighlightOutliner_brand, this, _breakEdge).call(this, edge));
			_assertClassBrand(_HighlightOutliner_brand, this, _insert).call(this, edge);
		} else {
			_assertClassBrand(_HighlightOutliner_brand, this, _remove).call(this, edge);
			outlineVerticalEdges.push(..._assertClassBrand(_HighlightOutliner_brand, this, _breakEdge).call(this, edge));
		}
		return _assertClassBrand(_HighlightOutliner_brand, this, _getOutlines).call(this, outlineVerticalEdges);
	}
};
function _getOutlines(outlineVerticalEdges) {
	const edges = [];
	const allEdges = /* @__PURE__ */ new Set();
	for (const edge of outlineVerticalEdges) {
		const [x, y1, y2] = edge;
		edges.push([
			x,
			y1,
			edge
		], [
			x,
			y2,
			edge
		]);
	}
	edges.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
	for (let i = 0, ii = edges.length; i < ii; i += 2) {
		const edge1 = edges[i][2];
		const edge2 = edges[i + 1][2];
		edge1.push(edge2);
		edge2.push(edge1);
		allEdges.add(edge1);
		allEdges.add(edge2);
	}
	const outlines = [];
	let outline;
	while (allEdges.size > 0) {
		const edge = allEdges.values().next().value;
		let [x, y1, y2, edge1, edge2] = edge;
		allEdges.delete(edge);
		let lastPointX = x;
		let lastPointY = y1;
		outline = [x, y2];
		outlines.push(outline);
		while (true) {
			let e;
			if (allEdges.has(edge1)) e = edge1;
			else if (allEdges.has(edge2)) e = edge2;
			else break;
			allEdges.delete(e);
			[x, y1, y2, edge1, edge2] = e;
			if (lastPointX !== x) {
				outline.push(lastPointX, lastPointY, x, lastPointY === y1 ? y1 : y2);
				lastPointX = x;
			}
			lastPointY = lastPointY === y1 ? y2 : y1;
		}
		outline.push(lastPointX, lastPointY);
	}
	return new HighlightOutline(outlines, _classPrivateFieldGet2(_box3, this), _classPrivateFieldGet2(_firstPoint, this), _classPrivateFieldGet2(_lastPoint, this));
}
function _binarySearch(y) {
	const array = _classPrivateFieldGet2(_intervals, this);
	let start = 0;
	let end = array.length - 1;
	while (start <= end) {
		const middle = start + end >> 1;
		const y1 = array[middle][0];
		if (y1 === y) return middle;
		if (y1 < y) start = middle + 1;
		else end = middle - 1;
	}
	return end + 1;
}
function _insert([, y1, y2]) {
	const index = _assertClassBrand(_HighlightOutliner_brand, this, _binarySearch).call(this, y1);
	_classPrivateFieldGet2(_intervals, this).splice(index, 0, [y1, y2]);
}
function _remove([, y1, y2]) {
	const index = _assertClassBrand(_HighlightOutliner_brand, this, _binarySearch).call(this, y1);
	for (let i = index; i < _classPrivateFieldGet2(_intervals, this).length; i++) {
		const [start, end] = _classPrivateFieldGet2(_intervals, this)[i];
		if (start !== y1) break;
		if (start === y1 && end === y2) {
			_classPrivateFieldGet2(_intervals, this).splice(i, 1);
			return;
		}
	}
	for (let i = index - 1; i >= 0; i--) {
		const [start, end] = _classPrivateFieldGet2(_intervals, this)[i];
		if (start !== y1) break;
		if (start === y1 && end === y2) {
			_classPrivateFieldGet2(_intervals, this).splice(i, 1);
			return;
		}
	}
}
function _breakEdge(edge) {
	const [x, y1, y2] = edge;
	const results = [[
		x,
		y1,
		y2
	]];
	const index = _assertClassBrand(_HighlightOutliner_brand, this, _binarySearch).call(this, y2);
	for (let i = 0; i < index; i++) {
		const [start, end] = _classPrivateFieldGet2(_intervals, this)[i];
		for (let j = 0, jj = results.length; j < jj; j++) {
			const [, y3, y4] = results[j];
			if (end <= y3 || y4 <= start) continue;
			if (y3 >= start) {
				if (y4 > end) results[j][1] = end;
				else {
					if (jj === 1) return [];
					results.splice(j, 1);
					j--;
					jj--;
				}
				continue;
			}
			results[j][2] = start;
			if (y4 > end) results.push([
				x,
				end,
				y4
			]);
		}
	}
	return results;
}
var _box4 = /* @__PURE__ */ new WeakMap();
var _outlines = /* @__PURE__ */ new WeakMap();
var HighlightOutline = class extends Outline {
	constructor(outlines, box, firstPoint, lastPoint) {
		super();
		_classPrivateFieldInitSpec(this, _box4, void 0);
		_classPrivateFieldInitSpec(this, _outlines, void 0);
		_classPrivateFieldSet2(_outlines, this, outlines);
		_classPrivateFieldSet2(_box4, this, box);
		this.firstPoint = firstPoint;
		this.lastPoint = lastPoint;
	}
	toSVGPath() {
		const buffer = [];
		for (const polygon of _classPrivateFieldGet2(_outlines, this)) {
			let [prevX, prevY] = polygon;
			buffer.push(`M${prevX} ${prevY}`);
			for (let i = 2; i < polygon.length; i += 2) {
				const x = polygon[i];
				const y = polygon[i + 1];
				if (x === prevX) {
					buffer.push(`V${y}`);
					prevY = y;
				} else if (y === prevY) {
					buffer.push(`H${x}`);
					prevX = x;
				}
			}
			buffer.push("Z");
		}
		return buffer.join(" ");
	}
	serialize([blX, blY, trX, trY], _rotation) {
		const outlines = [];
		const width = trX - blX;
		const height = trY - blY;
		for (const outline of _classPrivateFieldGet2(_outlines, this)) {
			const points = new Array(outline.length);
			for (let i = 0; i < outline.length; i += 2) {
				points[i] = blX + outline[i] * width;
				points[i + 1] = trY - outline[i + 1] * height;
			}
			outlines.push(points);
		}
		return outlines;
	}
	get box() {
		return _classPrivateFieldGet2(_box4, this);
	}
	get classNamesForOutlining() {
		return ["highlightOutline"];
	}
};
var FreeHighlightOutliner = class extends FreeDrawOutliner {
	newFreeDrawOutline(outline, points, box, scaleFactor, innerMargin, isLTR) {
		return new FreeHighlightOutline(outline, points, box, scaleFactor, innerMargin, isLTR);
	}
};
var FreeHighlightOutline = class extends FreeDrawOutline {
	newOutliner(point, box, scaleFactor, thickness, isLTR, innerMargin = 0) {
		return new FreeHighlightOutliner(point, box, scaleFactor, thickness, isLTR, innerMargin);
	}
};
var _anchorNode = /* @__PURE__ */ new WeakMap();
var _anchorOffset = /* @__PURE__ */ new WeakMap();
var _boxes = /* @__PURE__ */ new WeakMap();
var _clipPathId = /* @__PURE__ */ new WeakMap();
var _colorPicker2 = /* @__PURE__ */ new WeakMap();
var _focusOutlines = /* @__PURE__ */ new WeakMap();
var _focusNode = /* @__PURE__ */ new WeakMap();
var _focusOffset = /* @__PURE__ */ new WeakMap();
var _highlightDiv = /* @__PURE__ */ new WeakMap();
var _highlightOutlines = /* @__PURE__ */ new WeakMap();
var _id4 = /* @__PURE__ */ new WeakMap();
var _isFreeHighlight = /* @__PURE__ */ new WeakMap();
var _firstPoint2 = /* @__PURE__ */ new WeakMap();
var _lastPoint2 = /* @__PURE__ */ new WeakMap();
var _outlineId = /* @__PURE__ */ new WeakMap();
var _text2 = /* @__PURE__ */ new WeakMap();
var _thickness2 = /* @__PURE__ */ new WeakMap();
var _methodOfCreation = /* @__PURE__ */ new WeakMap();
var _HighlightEditor_brand = /* @__PURE__ */ new WeakSet();
var HighlightEditor = class HighlightEditor extends AnnotationEditor {
	static get _keyboardManager() {
		const proto = HighlightEditor.prototype;
		return shadow(this, "_keyboardManager", new KeyboardManager([
			[
				["ArrowLeft", "mac+ArrowLeft"],
				proto._moveCaret,
				{ args: [0] }
			],
			[
				["ArrowRight", "mac+ArrowRight"],
				proto._moveCaret,
				{ args: [1] }
			],
			[
				["ArrowUp", "mac+ArrowUp"],
				proto._moveCaret,
				{ args: [2] }
			],
			[
				["ArrowDown", "mac+ArrowDown"],
				proto._moveCaret,
				{ args: [3] }
			]
		]));
	}
	constructor(params) {
		super({
			...params,
			name: "highlightEditor"
		});
		_classPrivateMethodInitSpec(this, _HighlightEditor_brand);
		_classPrivateFieldInitSpec(this, _anchorNode, null);
		_classPrivateFieldInitSpec(this, _anchorOffset, 0);
		_classPrivateFieldInitSpec(this, _boxes, void 0);
		_classPrivateFieldInitSpec(this, _clipPathId, null);
		_classPrivateFieldInitSpec(this, _colorPicker2, null);
		_classPrivateFieldInitSpec(this, _focusOutlines, null);
		_classPrivateFieldInitSpec(this, _focusNode, null);
		_classPrivateFieldInitSpec(this, _focusOffset, 0);
		_classPrivateFieldInitSpec(this, _highlightDiv, null);
		_classPrivateFieldInitSpec(this, _highlightOutlines, null);
		_classPrivateFieldInitSpec(this, _id4, null);
		_classPrivateFieldInitSpec(this, _isFreeHighlight, false);
		_classPrivateFieldInitSpec(this, _firstPoint2, null);
		_classPrivateFieldInitSpec(this, _lastPoint2, null);
		_classPrivateFieldInitSpec(this, _outlineId, null);
		_classPrivateFieldInitSpec(this, _text2, "");
		_classPrivateFieldInitSpec(this, _thickness2, void 0);
		_classPrivateFieldInitSpec(this, _methodOfCreation, "");
		this.color = params.color || HighlightEditor._defaultColor;
		_classPrivateFieldSet2(_thickness2, this, params.thickness || HighlightEditor._defaultThickness);
		this.opacity = params.opacity || HighlightEditor._defaultOpacity;
		_classPrivateFieldSet2(_boxes, this, params.boxes || null);
		_classPrivateFieldSet2(_methodOfCreation, this, params.methodOfCreation || "");
		_classPrivateFieldSet2(_text2, this, params.text || "");
		this._isDraggable = false;
		this.defaultL10nId = "pdfjs-editor-highlight-editor";
		if (params.highlightId > -1) {
			_classPrivateFieldSet2(_isFreeHighlight, this, true);
			_assertClassBrand(_HighlightEditor_brand, this, _createFreeOutlines).call(this, params);
			_assertClassBrand(_HighlightEditor_brand, this, _addToDrawLayer).call(this);
		} else if (_classPrivateFieldGet2(_boxes, this)) {
			_classPrivateFieldSet2(_anchorNode, this, params.anchorNode);
			_classPrivateFieldSet2(_anchorOffset, this, params.anchorOffset);
			_classPrivateFieldSet2(_focusNode, this, params.focusNode);
			_classPrivateFieldSet2(_focusOffset, this, params.focusOffset);
			_assertClassBrand(_HighlightEditor_brand, this, _createOutlines).call(this);
			_assertClassBrand(_HighlightEditor_brand, this, _addToDrawLayer).call(this);
			this.rotate(this.rotation);
		}
		if (!this.annotationElementId) this._uiManager.a11yAlert("pdfjs-editor-highlight-added-alert");
	}
	get telemetryInitialData() {
		return {
			action: "added",
			type: _classPrivateFieldGet2(_isFreeHighlight, this) ? "free_highlight" : "highlight",
			color: this._uiManager.getNonHCMColorName(this.color),
			thickness: _classPrivateFieldGet2(_thickness2, this),
			methodOfCreation: _classPrivateFieldGet2(_methodOfCreation, this)
		};
	}
	get telemetryFinalData() {
		return {
			type: "highlight",
			color: this._uiManager.getNonHCMColorName(this.color)
		};
	}
	static computeTelemetryFinalData(data) {
		return { numberOfColors: data.get("color").size };
	}
	static initialize(l10n, uiManager) {
		AnnotationEditor.initialize(l10n, uiManager);
		HighlightEditor._defaultColor || (HighlightEditor._defaultColor = uiManager.highlightColors?.values().next().value || "#fff066");
	}
	static updateDefaultParams(type, value) {
		switch (type) {
			case AnnotationEditorParamsType.HIGHLIGHT_COLOR:
				HighlightEditor._defaultColor = value;
				break;
			case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:
				HighlightEditor._defaultThickness = value;
				break;
		}
	}
	translateInPage(x, y) {}
	get toolbarPosition() {
		return _classPrivateFieldGet2(_lastPoint2, this);
	}
	get commentButtonPosition() {
		return _classPrivateFieldGet2(_firstPoint2, this);
	}
	updateParams(type, value) {
		switch (type) {
			case AnnotationEditorParamsType.HIGHLIGHT_COLOR:
				_assertClassBrand(_HighlightEditor_brand, this, _updateColor3).call(this, value);
				break;
			case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:
				_assertClassBrand(_HighlightEditor_brand, this, _updateThickness).call(this, value);
				break;
		}
	}
	static get defaultPropertiesToUpdate() {
		return [[AnnotationEditorParamsType.HIGHLIGHT_COLOR, HighlightEditor._defaultColor], [AnnotationEditorParamsType.HIGHLIGHT_THICKNESS, HighlightEditor._defaultThickness]];
	}
	get propertiesToUpdate() {
		return [
			[AnnotationEditorParamsType.HIGHLIGHT_COLOR, this.color || HighlightEditor._defaultColor],
			[AnnotationEditorParamsType.HIGHLIGHT_THICKNESS, _classPrivateFieldGet2(_thickness2, this) || HighlightEditor._defaultThickness],
			[AnnotationEditorParamsType.HIGHLIGHT_FREE, _classPrivateFieldGet2(_isFreeHighlight, this)]
		];
	}
	onUpdatedColor() {
		this.parent?.drawLayer.updateProperties(_classPrivateFieldGet2(_id4, this), { root: {
			fill: this.color,
			"fill-opacity": this.opacity
		} });
		_classPrivateFieldGet2(_colorPicker2, this)?.updateColor(this.color);
		super.onUpdatedColor();
	}
	get toolbarButtons() {
		if (this._uiManager.highlightColors) return [["colorPicker", _classPrivateFieldSet2(_colorPicker2, this, new ColorPicker({ editor: this }))]];
		return super.toolbarButtons;
	}
	disableEditing() {
		super.disableEditing();
		this.div.classList.toggle("disabled", true);
	}
	enableEditing() {
		super.enableEditing();
		this.div.classList.toggle("disabled", false);
	}
	fixAndSetPosition() {
		return super.fixAndSetPosition(_assertClassBrand(_HighlightEditor_brand, this, _getRotation).call(this));
	}
	getBaseTranslation() {
		return [0, 0];
	}
	getRect(tx, ty) {
		return super.getRect(tx, ty, _assertClassBrand(_HighlightEditor_brand, this, _getRotation).call(this));
	}
	onceAdded(focus) {
		if (!this.annotationElementId) this.parent.addUndoableEditor(this);
		if (focus) this.div.focus();
	}
	remove() {
		_assertClassBrand(_HighlightEditor_brand, this, _cleanDrawLayer).call(this);
		this._reportTelemetry({ action: "deleted" });
		super.remove();
	}
	rebuild() {
		if (!this.parent) return;
		super.rebuild();
		if (this.div === null) return;
		_assertClassBrand(_HighlightEditor_brand, this, _addToDrawLayer).call(this);
		if (!this.isAttachedToDOM) this.parent.add(this);
	}
	setParent(parent) {
		let mustBeSelected = false;
		if (this.parent && !parent) _assertClassBrand(_HighlightEditor_brand, this, _cleanDrawLayer).call(this);
		else if (parent) {
			_assertClassBrand(_HighlightEditor_brand, this, _addToDrawLayer).call(this, parent);
			mustBeSelected = !this.parent && this.div?.classList.contains("selectedEditor");
		}
		super.setParent(parent);
		this.show(this._isVisible);
		if (mustBeSelected) this.select();
	}
	rotate(angle) {
		const { drawLayer } = this.parent;
		let box;
		if (_classPrivateFieldGet2(_isFreeHighlight, this)) {
			angle = (angle - this.rotation + 360) % 360;
			box = _rotateBbox.call(HighlightEditor, _classPrivateFieldGet2(_highlightOutlines, this).box, angle);
		} else box = _rotateBbox.call(HighlightEditor, [
			this.x,
			this.y,
			this.width,
			this.height
		], angle);
		drawLayer.updateProperties(_classPrivateFieldGet2(_id4, this), {
			bbox: box,
			root: { "data-main-rotation": angle }
		});
		drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), {
			bbox: _rotateBbox.call(HighlightEditor, _classPrivateFieldGet2(_focusOutlines, this).box, angle),
			root: { "data-main-rotation": angle }
		});
	}
	render() {
		if (this.div) return this.div;
		const div = super.render();
		if (_classPrivateFieldGet2(_text2, this)) {
			div.setAttribute("aria-label", _classPrivateFieldGet2(_text2, this));
			div.setAttribute("role", "mark");
		}
		if (_classPrivateFieldGet2(_isFreeHighlight, this)) div.classList.add("free");
		else this.div.addEventListener("keydown", _assertClassBrand(_HighlightEditor_brand, this, _keydown).bind(this), { signal: this._uiManager._signal });
		const highlightDiv = _classPrivateFieldSet2(_highlightDiv, this, document.createElement("div"));
		div.append(highlightDiv);
		highlightDiv.setAttribute("aria-hidden", "true");
		highlightDiv.className = "internal";
		highlightDiv.style.clipPath = _classPrivateFieldGet2(_clipPathId, this);
		this.setDims();
		bindEvents(this, _classPrivateFieldGet2(_highlightDiv, this), ["pointerover", "pointerleave"]);
		this.enableEditing();
		return div;
	}
	pointerover() {
		if (!this.isSelected) this.parent?.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), { rootClass: { hovered: true } });
	}
	pointerleave() {
		if (!this.isSelected) this.parent?.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), { rootClass: { hovered: false } });
	}
	_moveCaret(direction) {
		this.parent.unselect(this);
		switch (direction) {
			case 0:
			case 2:
				_assertClassBrand(_HighlightEditor_brand, this, _setCaret).call(this, true);
				break;
			case 1:
			case 3:
				_assertClassBrand(_HighlightEditor_brand, this, _setCaret).call(this, false);
				break;
		}
	}
	select() {
		super.select();
		if (!_classPrivateFieldGet2(_outlineId, this)) return;
		this.parent?.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), { rootClass: {
			hovered: false,
			selected: true
		} });
	}
	unselect() {
		super.unselect();
		if (!_classPrivateFieldGet2(_outlineId, this)) return;
		this.parent?.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), { rootClass: { selected: false } });
		if (!_classPrivateFieldGet2(_isFreeHighlight, this)) _assertClassBrand(_HighlightEditor_brand, this, _setCaret).call(this, false);
	}
	get _mustFixPosition() {
		return !_classPrivateFieldGet2(_isFreeHighlight, this);
	}
	show(visible = this._isVisible) {
		super.show(visible);
		if (this.parent) {
			this.parent.drawLayer.updateProperties(_classPrivateFieldGet2(_id4, this), { rootClass: { hidden: !visible } });
			this.parent.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), { rootClass: { hidden: !visible } });
		}
	}
	static startHighlighting(parent, isLTR, { target: textLayer, x, y }) {
		const { x: layerX, y: layerY, width: parentWidth, height: parentHeight } = textLayer.getBoundingClientRect();
		const ac = new AbortController();
		const signal = parent.combinedSignal(ac);
		const pointerUpCallback = (e) => {
			ac.abort();
			_assertClassBrand(HighlightEditor, this, _endHighlight).call(this, parent, e);
		};
		window.addEventListener("blur", pointerUpCallback, { signal });
		window.addEventListener("pointerup", pointerUpCallback, { signal });
		window.addEventListener("pointerdown", stopEvent, {
			capture: true,
			passive: false,
			signal
		});
		window.addEventListener("contextmenu", noContextMenu, { signal });
		textLayer.addEventListener("pointermove", _assertClassBrand(HighlightEditor, this, _highlightMove).bind(this, parent), { signal });
		this._freeHighlight = new FreeHighlightOutliner({
			x,
			y
		}, [
			layerX,
			layerY,
			parentWidth,
			parentHeight
		], parent.scale, this._defaultThickness / 2, isLTR, .001);
		({id: this._freeHighlightId, clipPathId: this._freeHighlightClipId} = parent.drawLayer.draw({
			bbox: [
				0,
				0,
				1,
				1
			],
			root: {
				viewBox: "0 0 1 1",
				fill: this._defaultColor,
				"fill-opacity": this._defaultOpacity
			},
			rootClass: {
				highlight: true,
				free: true
			},
			path: { d: this._freeHighlight.toSVGPath() }
		}, true, true));
	}
	static async deserialize(data, parent, uiManager) {
		let initialData = null;
		if (data instanceof HighlightAnnotationElement) {
			const { data: { quadPoints, rect, rotation, id, color, opacity, popupRef, richText, contentsObj, creationDate, modificationDate }, parent: { page: { pageNumber } } } = data;
			initialData = data = {
				annotationType: AnnotationEditorType.HIGHLIGHT,
				color: Array.from(color),
				opacity,
				quadPoints,
				boxes: null,
				pageIndex: pageNumber - 1,
				rect: rect.slice(0),
				rotation,
				annotationElementId: id,
				id,
				deleted: false,
				popupRef,
				richText,
				comment: contentsObj?.str || null,
				creationDate,
				modificationDate
			};
		} else if (data instanceof InkAnnotationElement) {
			const { data: { inkLists, rect, rotation, id, color, borderStyle: { rawWidth: thickness }, popupRef, richText, contentsObj, creationDate, modificationDate }, parent: { page: { pageNumber } } } = data;
			initialData = data = {
				annotationType: AnnotationEditorType.HIGHLIGHT,
				color: Array.from(color),
				thickness,
				inkLists,
				boxes: null,
				pageIndex: pageNumber - 1,
				rect: rect.slice(0),
				rotation,
				annotationElementId: id,
				id,
				deleted: false,
				popupRef,
				richText,
				comment: contentsObj?.str || null,
				creationDate,
				modificationDate
			};
		}
		const { color, quadPoints, inkLists, outlines, opacity } = data;
		const editor = await super.deserialize(data, parent, uiManager);
		editor.color = Util.makeHexColor(...color);
		editor.opacity = opacity || 1;
		if (inkLists) _classPrivateFieldSet2(_thickness2, editor, data.thickness);
		editor._initialData = initialData;
		if (data.comment) editor.setCommentData(data);
		const [pageWidth, pageHeight] = editor.pageDimensions;
		const [pageX, pageY] = editor.pageTranslation;
		if (quadPoints) {
			const boxes = _classPrivateFieldSet2(_boxes, editor, []);
			for (let i = 0; i < quadPoints.length; i += 8) boxes.push({
				x: (quadPoints[i] - pageX) / pageWidth,
				y: 1 - (quadPoints[i + 1] - pageY) / pageHeight,
				width: (quadPoints[i + 2] - quadPoints[i]) / pageWidth,
				height: (quadPoints[i + 1] - quadPoints[i + 5]) / pageHeight
			});
			_assertClassBrand(_HighlightEditor_brand, editor, _createOutlines).call(editor);
			_assertClassBrand(_HighlightEditor_brand, editor, _addToDrawLayer).call(editor);
			editor.rotate(editor.rotation);
		} else if (inkLists || outlines) {
			_classPrivateFieldSet2(_isFreeHighlight, editor, true);
			const points = (inkLists || outlines.points)[0];
			const point = {
				x: points[0] - pageX,
				y: pageHeight - (points[1] - pageY)
			};
			const outliner = new FreeHighlightOutliner(point, [
				0,
				0,
				pageWidth,
				pageHeight
			], 1, _classPrivateFieldGet2(_thickness2, editor) / 2, true, .001);
			for (let i = 0, ii = points.length; i < ii; i += 2) {
				point.x = points[i] - pageX;
				point.y = pageHeight - (points[i + 1] - pageY);
				outliner.add(point);
			}
			const { id, clipPathId } = parent.drawLayer.draw({
				bbox: [
					0,
					0,
					1,
					1
				],
				root: {
					viewBox: "0 0 1 1",
					fill: editor.color,
					"fill-opacity": editor._defaultOpacity
				},
				rootClass: {
					highlight: true,
					free: true
				},
				path: { d: outliner.toSVGPath() }
			}, true, true);
			_assertClassBrand(_HighlightEditor_brand, editor, _createFreeOutlines).call(editor, {
				highlightOutlines: outliner.getOutlines(),
				highlightId: id,
				clipPathId
			});
			_assertClassBrand(_HighlightEditor_brand, editor, _addToDrawLayer).call(editor);
			editor.rotate(editor.parentRotation);
		}
		return editor;
	}
	serialize(isForCopying = false) {
		if (this.isEmpty() || isForCopying) return null;
		if (this.deleted) return this.serializeDeleted();
		const color = AnnotationEditor._colorManager.convert(this._uiManager.getNonHCMColor(this.color));
		const serialized = super.serialize(isForCopying);
		Object.assign(serialized, {
			color,
			opacity: this.opacity,
			thickness: _classPrivateFieldGet2(_thickness2, this),
			quadPoints: _assertClassBrand(_HighlightEditor_brand, this, _serializeBoxes).call(this),
			outlines: _assertClassBrand(_HighlightEditor_brand, this, _serializeOutlines).call(this, serialized.rect)
		});
		this.addComment(serialized);
		if (this.annotationElementId && !_assertClassBrand(_HighlightEditor_brand, this, _hasElementChanged2).call(this, serialized)) return null;
		serialized.id = this.annotationElementId;
		return serialized;
	}
	renderAnnotationElement(annotation) {
		if (this.deleted) {
			annotation.hide();
			return null;
		}
		annotation.updateEdited({
			rect: this.getPDFRect(),
			popup: this.comment
		});
		return null;
	}
	static canCreateNewEmptyEditor() {
		return false;
	}
};
_HighlightEditor = HighlightEditor;
function _createOutlines() {
	const outliner = new HighlightOutliner(_classPrivateFieldGet2(_boxes, this), .001);
	_classPrivateFieldSet2(_highlightOutlines, this, outliner.getOutlines());
	[this.x, this.y, this.width, this.height] = _classPrivateFieldGet2(_highlightOutlines, this).box;
	const outlinerForOutline = new HighlightOutliner(_classPrivateFieldGet2(_boxes, this), .0025, .001, this._uiManager.direction === "ltr");
	_classPrivateFieldSet2(_focusOutlines, this, outlinerForOutline.getOutlines());
	const { firstPoint } = _classPrivateFieldGet2(_highlightOutlines, this);
	_classPrivateFieldSet2(_firstPoint2, this, [(firstPoint[0] - this.x) / this.width, (firstPoint[1] - this.y) / this.height]);
	const { lastPoint } = _classPrivateFieldGet2(_focusOutlines, this);
	_classPrivateFieldSet2(_lastPoint2, this, [(lastPoint[0] - this.x) / this.width, (lastPoint[1] - this.y) / this.height]);
}
function _createFreeOutlines({ highlightOutlines, highlightId, clipPathId }) {
	_classPrivateFieldSet2(_highlightOutlines, this, highlightOutlines);
	_classPrivateFieldSet2(_focusOutlines, this, highlightOutlines.getNewOutline(_classPrivateFieldGet2(_thickness2, this) / 2 + 1.5, .0025));
	if (highlightId >= 0) {
		_classPrivateFieldSet2(_id4, this, highlightId);
		_classPrivateFieldSet2(_clipPathId, this, clipPathId);
		this.parent.drawLayer.finalizeDraw(highlightId, {
			bbox: highlightOutlines.box,
			path: { d: highlightOutlines.toSVGPath() }
		});
		_classPrivateFieldSet2(_outlineId, this, this.parent.drawLayer.drawOutline({
			rootClass: {
				highlightOutline: true,
				free: true
			},
			bbox: _classPrivateFieldGet2(_focusOutlines, this).box,
			path: { d: _classPrivateFieldGet2(_focusOutlines, this).toSVGPath() }
		}, true));
	} else if (this.parent) {
		const angle = this.parent.viewport.rotation;
		this.parent.drawLayer.updateProperties(_classPrivateFieldGet2(_id4, this), {
			bbox: _rotateBbox.call(_HighlightEditor, _classPrivateFieldGet2(_highlightOutlines, this).box, (angle - this.rotation + 360) % 360),
			path: { d: highlightOutlines.toSVGPath() }
		});
		this.parent.drawLayer.updateProperties(_classPrivateFieldGet2(_outlineId, this), {
			bbox: _rotateBbox.call(_HighlightEditor, _classPrivateFieldGet2(_focusOutlines, this).box, angle),
			path: { d: _classPrivateFieldGet2(_focusOutlines, this).toSVGPath() }
		});
	}
	const [x, y, width, height] = highlightOutlines.box;
	switch (this.rotation) {
		case 0:
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			break;
		case 90: {
			const [pageWidth, pageHeight] = this.parentDimensions;
			this.x = y;
			this.y = 1 - x;
			this.width = width * pageHeight / pageWidth;
			this.height = height * pageWidth / pageHeight;
			break;
		}
		case 180:
			this.x = 1 - x;
			this.y = 1 - y;
			this.width = width;
			this.height = height;
			break;
		case 270: {
			const [pageWidth, pageHeight] = this.parentDimensions;
			this.x = 1 - y;
			this.y = x;
			this.width = width * pageHeight / pageWidth;
			this.height = height * pageWidth / pageHeight;
			break;
		}
	}
	const { firstPoint } = highlightOutlines;
	_classPrivateFieldSet2(_firstPoint2, this, [(firstPoint[0] - x) / width, (firstPoint[1] - y) / height]);
	const { lastPoint } = _classPrivateFieldGet2(_focusOutlines, this);
	_classPrivateFieldSet2(_lastPoint2, this, [(lastPoint[0] - x) / width, (lastPoint[1] - y) / height]);
}
function _updateColor3(color) {
	const setColorAndOpacity = (col, opa) => {
		this.color = col;
		this.opacity = opa;
		this.onUpdatedColor();
	};
	const savedColor = this.color;
	const savedOpacity = this.opacity;
	this.addCommands({
		cmd: setColorAndOpacity.bind(this, color, _HighlightEditor._defaultOpacity),
		undo: setColorAndOpacity.bind(this, savedColor, savedOpacity),
		post: this._uiManager.updateUI.bind(this._uiManager, this),
		mustExec: true,
		type: AnnotationEditorParamsType.HIGHLIGHT_COLOR,
		overwriteIfSameType: true,
		keepUndo: true
	});
	this._reportTelemetry({
		action: "color_changed",
		color: this._uiManager.getNonHCMColorName(color)
	}, true);
}
function _updateThickness(thickness) {
	const savedThickness = _classPrivateFieldGet2(_thickness2, this);
	const setThickness = (th) => {
		_classPrivateFieldSet2(_thickness2, this, th);
		_assertClassBrand(_HighlightEditor_brand, this, _changeThickness).call(this, th);
	};
	this.addCommands({
		cmd: setThickness.bind(this, thickness),
		undo: setThickness.bind(this, savedThickness),
		post: this._uiManager.updateUI.bind(this._uiManager, this),
		mustExec: true,
		type: AnnotationEditorParamsType.INK_THICKNESS,
		overwriteIfSameType: true,
		keepUndo: true
	});
	this._reportTelemetry({
		action: "thickness_changed",
		thickness
	}, true);
}
function _changeThickness(thickness) {
	if (!_classPrivateFieldGet2(_isFreeHighlight, this)) return;
	_assertClassBrand(_HighlightEditor_brand, this, _createFreeOutlines).call(this, { highlightOutlines: _classPrivateFieldGet2(_highlightOutlines, this).getNewOutline(thickness / 2) });
	this.fixAndSetPosition();
	this.setDims();
}
function _cleanDrawLayer() {
	if (_classPrivateFieldGet2(_id4, this) === null || !this.parent) return;
	this.parent.drawLayer.remove(_classPrivateFieldGet2(_id4, this));
	_classPrivateFieldSet2(_id4, this, null);
	this.parent.drawLayer.remove(_classPrivateFieldGet2(_outlineId, this));
	_classPrivateFieldSet2(_outlineId, this, null);
}
function _addToDrawLayer(parent = this.parent) {
	if (_classPrivateFieldGet2(_id4, this) !== null) return;
	({id: _toSetter(_classPrivateFieldSet2, [_id4, this])._, clipPathId: _toSetter(_classPrivateFieldSet2, [_clipPathId, this])._} = parent.drawLayer.draw({
		bbox: _classPrivateFieldGet2(_highlightOutlines, this).box,
		root: {
			viewBox: "0 0 1 1",
			fill: this.color,
			"fill-opacity": this.opacity
		},
		rootClass: {
			highlight: true,
			free: _classPrivateFieldGet2(_isFreeHighlight, this)
		},
		path: { d: _classPrivateFieldGet2(_highlightOutlines, this).toSVGPath() }
	}, false, true));
	_classPrivateFieldSet2(_outlineId, this, parent.drawLayer.drawOutline({
		rootClass: {
			highlightOutline: true,
			free: _classPrivateFieldGet2(_isFreeHighlight, this)
		},
		bbox: _classPrivateFieldGet2(_focusOutlines, this).box,
		path: { d: _classPrivateFieldGet2(_focusOutlines, this).toSVGPath() }
	}, _classPrivateFieldGet2(_isFreeHighlight, this)));
	if (_classPrivateFieldGet2(_highlightDiv, this)) _classPrivateFieldGet2(_highlightDiv, this).style.clipPath = _classPrivateFieldGet2(_clipPathId, this);
}
function _rotateBbox([x, y, width, height], angle) {
	switch (angle) {
		case 90: return [
			1 - y - height,
			x,
			height,
			width
		];
		case 180: return [
			1 - x - width,
			1 - y - height,
			width,
			height
		];
		case 270: return [
			y,
			1 - x - width,
			height,
			width
		];
	}
	return [
		x,
		y,
		width,
		height
	];
}
function _keydown(event) {
	_HighlightEditor._keyboardManager.exec(this, event);
}
function _setCaret(start) {
	if (!_classPrivateFieldGet2(_anchorNode, this)) return;
	const selection = window.getSelection();
	if (start) selection.setPosition(_classPrivateFieldGet2(_anchorNode, this), _classPrivateFieldGet2(_anchorOffset, this));
	else selection.setPosition(_classPrivateFieldGet2(_focusNode, this), _classPrivateFieldGet2(_focusOffset, this));
}
function _getRotation() {
	return _classPrivateFieldGet2(_isFreeHighlight, this) ? this.rotation : 0;
}
function _serializeBoxes() {
	if (_classPrivateFieldGet2(_isFreeHighlight, this)) return null;
	const [pageWidth, pageHeight] = this.pageDimensions;
	const [pageX, pageY] = this.pageTranslation;
	const boxes = _classPrivateFieldGet2(_boxes, this);
	const quadPoints = new Float32Array(boxes.length * 8);
	let i = 0;
	for (const { x, y, width, height } of boxes) {
		const sx = x * pageWidth + pageX;
		const sy = (1 - y) * pageHeight + pageY;
		quadPoints[i] = quadPoints[i + 4] = sx;
		quadPoints[i + 1] = quadPoints[i + 3] = sy;
		quadPoints[i + 2] = quadPoints[i + 6] = sx + width * pageWidth;
		quadPoints[i + 5] = quadPoints[i + 7] = sy - height * pageHeight;
		i += 8;
	}
	return quadPoints;
}
function _serializeOutlines(rect) {
	return _classPrivateFieldGet2(_highlightOutlines, this).serialize(rect, _assertClassBrand(_HighlightEditor_brand, this, _getRotation).call(this));
}
function _highlightMove(parent, event) {
	if (this._freeHighlight.add(event)) parent.drawLayer.updateProperties(this._freeHighlightId, { path: { d: this._freeHighlight.toSVGPath() } });
}
function _endHighlight(parent, event) {
	if (!this._freeHighlight.isEmpty()) parent.createAndAddNewEditor(event, false, {
		highlightId: this._freeHighlightId,
		highlightOutlines: this._freeHighlight.getOutlines(),
		clipPathId: this._freeHighlightClipId,
		methodOfCreation: "main_toolbar"
	});
	else parent.drawLayer.remove(this._freeHighlightId);
	this._freeHighlightId = -1;
	this._freeHighlight = null;
	this._freeHighlightClipId = "";
}
function _hasElementChanged2(serialized) {
	const { color } = this._initialData;
	return this.hasEditedComment || serialized.color.some((c, i) => c !== color[i]);
}
_defineProperty(HighlightEditor, "_defaultColor", null);
_defineProperty(HighlightEditor, "_defaultOpacity", 1);
_defineProperty(HighlightEditor, "_defaultThickness", 12);
_defineProperty(HighlightEditor, "_type", "highlight");
_defineProperty(HighlightEditor, "_editorType", AnnotationEditorType.HIGHLIGHT);
_defineProperty(HighlightEditor, "_freeHighlightId", -1);
_defineProperty(HighlightEditor, "_freeHighlight", null);
_defineProperty(HighlightEditor, "_freeHighlightClipId", "");
var _svgProperties = /* @__PURE__ */ new WeakMap();
var DrawingOptions = class {
	constructor() {
		_classPrivateFieldInitSpec(this, _svgProperties, Object.create(null));
	}
	updateProperty(name, value) {
		this[name] = value;
		this.updateSVGProperty(name, value);
	}
	updateProperties(properties) {
		if (!properties) return;
		for (const [name, value] of Object.entries(properties)) if (!name.startsWith("_")) this.updateProperty(name, value);
	}
	updateSVGProperty(name, value) {
		_classPrivateFieldGet2(_svgProperties, this)[name] = value;
	}
	toSVGProperties() {
		const root = _classPrivateFieldGet2(_svgProperties, this);
		_classPrivateFieldSet2(_svgProperties, this, Object.create(null));
		return { root };
	}
	reset() {
		_classPrivateFieldSet2(_svgProperties, this, Object.create(null));
	}
	updateAll(options = this) {
		this.updateProperties(options);
	}
	clone() {
		unreachable("Not implemented");
	}
};
var _drawOutlines = /* @__PURE__ */ new WeakMap();
var _mustBeCommitted = /* @__PURE__ */ new WeakMap();
var _DrawingEditor_brand = /* @__PURE__ */ new WeakSet();
var DrawingEditor = class DrawingEditor extends AnnotationEditor {
	constructor(params) {
		super(params);
		_classPrivateMethodInitSpec(this, _DrawingEditor_brand);
		_classPrivateFieldInitSpec(this, _drawOutlines, null);
		_classPrivateFieldInitSpec(this, _mustBeCommitted, void 0);
		_defineProperty(this, "_colorPicker", null);
		_defineProperty(this, "_drawId", null);
		_classPrivateFieldSet2(_mustBeCommitted, this, params.mustBeCommitted || false);
		this._addOutlines(params);
	}
	onUpdatedColor() {
		this._colorPicker?.update(this.color);
		super.onUpdatedColor();
	}
	_addOutlines(params) {
		if (params.drawOutlines) {
			_assertClassBrand(_DrawingEditor_brand, this, _createDrawOutlines).call(this, params);
			_assertClassBrand(_DrawingEditor_brand, this, _addToDrawLayer2).call(this);
		}
	}
	static _mergeSVGProperties(p1, p2) {
		const p1Keys = new Set(Object.keys(p1));
		for (const [key, value] of Object.entries(p2)) if (p1Keys.has(key)) Object.assign(p1[key], value);
		else p1[key] = value;
		return p1;
	}
	static getDefaultDrawingOptions(_options) {
		unreachable("Not implemented");
	}
	static get typesMap() {
		unreachable("Not implemented");
	}
	static get isDrawer() {
		return true;
	}
	static get supportMultipleDrawings() {
		return false;
	}
	static updateDefaultParams(type, value) {
		const propertyName = this.typesMap.get(type);
		if (propertyName) this._defaultDrawingOptions.updateProperty(propertyName, value);
		if (this._currentParent) {
			_currentDraw._.updateProperty(propertyName, value);
			this._currentParent.drawLayer.updateProperties(this._currentDrawId, this._defaultDrawingOptions.toSVGProperties());
		}
	}
	updateParams(type, value) {
		const propertyName = this.constructor.typesMap.get(type);
		if (propertyName) this._updateProperty(type, propertyName, value);
	}
	static get defaultPropertiesToUpdate() {
		const properties = [];
		const options = this._defaultDrawingOptions;
		for (const [type, name] of this.typesMap) properties.push([type, options[name]]);
		return properties;
	}
	get propertiesToUpdate() {
		const properties = [];
		const { _drawingOptions } = this;
		for (const [type, name] of this.constructor.typesMap) properties.push([type, _drawingOptions[name]]);
		return properties;
	}
	_updateProperty(type, name, value) {
		const options = this._drawingOptions;
		const savedValue = options[name];
		const setter = (val) => {
			options.updateProperty(name, val);
			const bbox = _classPrivateFieldGet2(_drawOutlines, this).updateProperty(name, val);
			if (bbox) _assertClassBrand(_DrawingEditor_brand, this, _updateBbox).call(this, bbox);
			this.parent?.drawLayer.updateProperties(this._drawId, options.toSVGProperties());
			if (type === this.colorType) this.onUpdatedColor();
		};
		this.addCommands({
			cmd: setter.bind(this, value),
			undo: setter.bind(this, savedValue),
			post: this._uiManager.updateUI.bind(this._uiManager, this),
			mustExec: true,
			type,
			overwriteIfSameType: true,
			keepUndo: true
		});
	}
	_onResizing() {
		this.parent?.drawLayer.updateProperties(this._drawId, DrawingEditor._mergeSVGProperties(_classPrivateFieldGet2(_drawOutlines, this).getPathResizingSVGProperties(_assertClassBrand(_DrawingEditor_brand, this, _convertToDrawSpace).call(this)), { bbox: _assertClassBrand(_DrawingEditor_brand, this, _rotateBox).call(this) }));
	}
	_onResized() {
		this.parent?.drawLayer.updateProperties(this._drawId, DrawingEditor._mergeSVGProperties(_classPrivateFieldGet2(_drawOutlines, this).getPathResizedSVGProperties(_assertClassBrand(_DrawingEditor_brand, this, _convertToDrawSpace).call(this)), { bbox: _assertClassBrand(_DrawingEditor_brand, this, _rotateBox).call(this) }));
	}
	_onTranslating(_x, _y) {
		this.parent?.drawLayer.updateProperties(this._drawId, { bbox: _assertClassBrand(_DrawingEditor_brand, this, _rotateBox).call(this) });
	}
	_onTranslated() {
		this.parent?.drawLayer.updateProperties(this._drawId, DrawingEditor._mergeSVGProperties(_classPrivateFieldGet2(_drawOutlines, this).getPathTranslatedSVGProperties(_assertClassBrand(_DrawingEditor_brand, this, _convertToDrawSpace).call(this), this.parentDimensions), { bbox: _assertClassBrand(_DrawingEditor_brand, this, _rotateBox).call(this) }));
	}
	_onStartDragging() {
		this.parent?.drawLayer.updateProperties(this._drawId, { rootClass: { moving: true } });
	}
	_onStopDragging() {
		this.parent?.drawLayer.updateProperties(this._drawId, { rootClass: { moving: false } });
	}
	commit() {
		super.commit();
		this.disableEditMode();
		this.disableEditing();
	}
	disableEditing() {
		super.disableEditing();
		this.div.classList.toggle("disabled", true);
	}
	enableEditing() {
		super.enableEditing();
		this.div.classList.toggle("disabled", false);
	}
	getBaseTranslation() {
		return [0, 0];
	}
	get isResizable() {
		return true;
	}
	onceAdded(focus) {
		if (!this.annotationElementId) this.parent.addUndoableEditor(this);
		this._isDraggable = true;
		if (_classPrivateFieldGet2(_mustBeCommitted, this)) {
			_classPrivateFieldSet2(_mustBeCommitted, this, false);
			this.commit();
			this.parent.setSelected(this);
			if (focus && this.isOnScreen) this.div.focus();
		}
	}
	remove() {
		_assertClassBrand(_DrawingEditor_brand, this, _cleanDrawLayer2).call(this);
		super.remove();
	}
	rebuild() {
		if (!this.parent) return;
		super.rebuild();
		if (this.div === null) return;
		_assertClassBrand(_DrawingEditor_brand, this, _addToDrawLayer2).call(this);
		_assertClassBrand(_DrawingEditor_brand, this, _updateBbox).call(this, _classPrivateFieldGet2(_drawOutlines, this).box);
		if (!this.isAttachedToDOM) this.parent.add(this);
	}
	setParent(parent) {
		let mustBeSelected = false;
		if (this.parent && !parent) {
			this._uiManager.removeShouldRescale(this);
			_assertClassBrand(_DrawingEditor_brand, this, _cleanDrawLayer2).call(this);
		} else if (parent) {
			this._uiManager.addShouldRescale(this);
			_assertClassBrand(_DrawingEditor_brand, this, _addToDrawLayer2).call(this, parent);
			mustBeSelected = !this.parent && this.div?.classList.contains("selectedEditor");
		}
		super.setParent(parent);
		if (mustBeSelected) this.select();
	}
	rotate() {
		if (!this.parent) return;
		this.parent.drawLayer.updateProperties(this._drawId, DrawingEditor._mergeSVGProperties({ bbox: _assertClassBrand(_DrawingEditor_brand, this, _rotateBox).call(this) }, _classPrivateFieldGet2(_drawOutlines, this).updateRotation((this.parentRotation - this.rotation + 360) % 360)));
	}
	onScaleChanging() {
		if (!this.parent) return;
		_assertClassBrand(_DrawingEditor_brand, this, _updateBbox).call(this, _classPrivateFieldGet2(_drawOutlines, this).updateParentDimensions(this.parentDimensions, this.parent.scale));
	}
	static onScaleChangingWhenDrawing() {}
	render() {
		if (this.div) return this.div;
		let baseX, baseY;
		if (this._isCopy) {
			baseX = this.x;
			baseY = this.y;
		}
		const div = super.render();
		div.classList.add("draw");
		const drawDiv = document.createElement("div");
		div.append(drawDiv);
		drawDiv.setAttribute("aria-hidden", "true");
		drawDiv.className = "internal";
		this.setDims();
		this._uiManager.addShouldRescale(this);
		this.disableEditing();
		if (this._isCopy) this._moveAfterPaste(baseX, baseY);
		return div;
	}
	static createDrawerInstance(_x, _y, _parentWidth, _parentHeight, _rotation) {
		unreachable("Not implemented");
	}
	static startDrawing(parent, uiManager, _isLTR, event) {
		const { target, offsetX: x, offsetY: y, pointerId, pointerType } = event;
		if (CurrentPointers.isInitializedAndDifferentPointerType(pointerType)) return;
		const { viewport: { rotation } } = parent;
		const { width: parentWidth, height: parentHeight } = target.getBoundingClientRect();
		const ac = _currentDrawingAC._ = new AbortController();
		const signal = parent.combinedSignal(ac);
		CurrentPointers.setPointer(pointerType, pointerId);
		window.addEventListener("pointerup", (e) => {
			if (CurrentPointers.isSamePointerIdOrRemove(e.pointerId)) this._endDraw(e);
		}, { signal });
		window.addEventListener("pointercancel", (e) => {
			if (CurrentPointers.isSamePointerIdOrRemove(e.pointerId)) this._currentParent.endDrawingSession();
		}, { signal });
		window.addEventListener("pointerdown", (e) => {
			if (!CurrentPointers.isSamePointerType(e.pointerType)) return;
			CurrentPointers.initializeAndAddPointerId(e.pointerId);
			if (_currentDraw._.isCancellable()) {
				_currentDraw._.removeLastElement();
				if (_currentDraw._.isEmpty()) this._currentParent.endDrawingSession(true);
				else this._endDraw(null);
			}
		}, {
			capture: true,
			passive: false,
			signal
		});
		window.addEventListener("contextmenu", noContextMenu, { signal });
		target.addEventListener("pointermove", this._drawMove.bind(this), { signal });
		target.addEventListener("touchmove", (e) => {
			if (CurrentPointers.isSameTimeStamp(e.timeStamp)) stopEvent(e);
		}, { signal });
		parent.toggleDrawing();
		uiManager._editorUndoBar?.hide();
		if (_currentDraw._) {
			parent.drawLayer.updateProperties(this._currentDrawId, _currentDraw._.startNew(x, y, parentWidth, parentHeight, rotation));
			return;
		}
		uiManager.updateUIForDefaultProperties(this);
		_currentDraw._ = this.createDrawerInstance(x, y, parentWidth, parentHeight, rotation);
		_currentDrawingOptions._ = this.getDefaultDrawingOptions();
		this._currentParent = parent;
		({id: this._currentDrawId} = parent.drawLayer.draw(this._mergeSVGProperties(_currentDrawingOptions._.toSVGProperties(), _currentDraw._.defaultSVGProperties), true, false));
	}
	static _drawMove(event) {
		CurrentPointers.isSameTimeStamp(event.timeStamp);
		if (!_currentDraw._) return;
		const { offsetX, offsetY, pointerId } = event;
		if (!CurrentPointers.isSamePointerId(pointerId)) return;
		if (CurrentPointers.isUsingMultiplePointers()) {
			this._endDraw(event);
			return;
		}
		this._currentParent.drawLayer.updateProperties(this._currentDrawId, _currentDraw._.add(offsetX, offsetY));
		CurrentPointers.setTimeStamp(event.timeStamp);
		stopEvent(event);
	}
	static _cleanup(all) {
		if (all) {
			this._currentDrawId = -1;
			this._currentParent = null;
			_currentDraw._ = null;
			_currentDrawingOptions._ = null;
			CurrentPointers.clearTimeStamp();
		}
		if (_currentDrawingAC._) {
			_currentDrawingAC._.abort();
			_currentDrawingAC._ = null;
			CurrentPointers.clearPointerIds();
		}
	}
	static _endDraw(event) {
		const parent = this._currentParent;
		if (!parent) return;
		parent.toggleDrawing(true);
		this._cleanup(false);
		if (event?.target === parent.div) parent.drawLayer.updateProperties(this._currentDrawId, _currentDraw._.end(event.offsetX, event.offsetY));
		if (this.supportMultipleDrawings) {
			const draw = _currentDraw._;
			const drawId = this._currentDrawId;
			const lastElement = draw.getLastElement();
			parent.addCommands({
				cmd: () => {
					parent.drawLayer.updateProperties(drawId, draw.setLastElement(lastElement));
				},
				undo: () => {
					parent.drawLayer.updateProperties(drawId, draw.removeLastElement());
				},
				mustExec: false,
				type: AnnotationEditorParamsType.DRAW_STEP
			});
			return;
		}
		this.endDrawing(false);
	}
	static endDrawing(isAborted) {
		const parent = this._currentParent;
		if (!parent) return null;
		parent.toggleDrawing(true);
		parent.cleanUndoStack(AnnotationEditorParamsType.DRAW_STEP);
		if (!_currentDraw._.isEmpty()) {
			const { pageDimensions: [pageWidth, pageHeight], scale } = parent;
			const editor = parent.createAndAddNewEditor({
				offsetX: 0,
				offsetY: 0
			}, false, {
				drawId: this._currentDrawId,
				drawOutlines: _currentDraw._.getOutlines(pageWidth * scale, pageHeight * scale, scale, this._INNER_MARGIN),
				drawingOptions: _currentDrawingOptions._,
				mustBeCommitted: !isAborted
			});
			this._cleanup(true);
			return editor;
		}
		parent.drawLayer.remove(this._currentDrawId);
		this._cleanup(true);
		return null;
	}
	createDrawingOptions(_data) {}
	static deserializeDraw(_pageX, _pageY, _pageWidth, _pageHeight, _innerWidth, _data) {
		unreachable("Not implemented");
	}
	static async deserialize(data, parent, uiManager) {
		const { rawDims: { pageWidth, pageHeight, pageX, pageY } } = parent.viewport;
		const drawOutlines = this.deserializeDraw(pageX, pageY, pageWidth, pageHeight, this._INNER_MARGIN, data);
		const editor = await super.deserialize(data, parent, uiManager);
		editor.createDrawingOptions(data);
		_assertClassBrand(_DrawingEditor_brand, editor, _createDrawOutlines).call(editor, { drawOutlines });
		_assertClassBrand(_DrawingEditor_brand, editor, _addToDrawLayer2).call(editor);
		editor.onScaleChanging();
		editor.rotate();
		return editor;
	}
	serializeDraw(isForCopying) {
		const [pageX, pageY] = this.pageTranslation;
		const [pageWidth, pageHeight] = this.pageDimensions;
		return _classPrivateFieldGet2(_drawOutlines, this).serialize([
			pageX,
			pageY,
			pageWidth,
			pageHeight
		], isForCopying);
	}
	renderAnnotationElement(annotation) {
		annotation.updateEdited({ rect: this.getPDFRect() });
		return null;
	}
	static canCreateNewEmptyEditor() {
		return false;
	}
};
_DrawingEditor = DrawingEditor;
function _createDrawOutlines({ drawOutlines, drawId, drawingOptions }) {
	_classPrivateFieldSet2(_drawOutlines, this, drawOutlines);
	this._drawingOptions || (this._drawingOptions = drawingOptions);
	if (!this.annotationElementId) this._uiManager.a11yAlert(`pdfjs-editor-${this.editorType}-added-alert`);
	if (drawId >= 0) {
		this._drawId = drawId;
		this.parent.drawLayer.finalizeDraw(drawId, drawOutlines.defaultProperties);
	} else this._drawId = _assertClassBrand(_DrawingEditor_brand, this, _createDrawing).call(this, drawOutlines, this.parent);
	_assertClassBrand(_DrawingEditor_brand, this, _updateBbox).call(this, drawOutlines.box);
}
function _createDrawing(drawOutlines, parent) {
	const { id } = parent.drawLayer.draw(_DrawingEditor._mergeSVGProperties(this._drawingOptions.toSVGProperties(), drawOutlines.defaultSVGProperties), false, false);
	return id;
}
function _cleanDrawLayer2() {
	if (this._drawId === null || !this.parent) return;
	this.parent.drawLayer.remove(this._drawId);
	this._drawId = null;
	this._drawingOptions.reset();
}
function _addToDrawLayer2(parent = this.parent) {
	if (this._drawId !== null && this.parent === parent) return;
	if (this._drawId !== null) {
		this.parent.drawLayer.updateParent(this._drawId, parent.drawLayer);
		return;
	}
	this._drawingOptions.updateAll();
	this._drawId = _assertClassBrand(_DrawingEditor_brand, this, _createDrawing).call(this, _classPrivateFieldGet2(_drawOutlines, this), parent);
}
function _convertToParentSpace([x, y, width, height]) {
	const { parentDimensions: [pW, pH], rotation } = this;
	switch (rotation) {
		case 90: return [
			y,
			1 - x,
			width * (pH / pW),
			height * (pW / pH)
		];
		case 180: return [
			1 - x,
			1 - y,
			width,
			height
		];
		case 270: return [
			1 - y,
			x,
			width * (pH / pW),
			height * (pW / pH)
		];
		default: return [
			x,
			y,
			width,
			height
		];
	}
}
function _convertToDrawSpace() {
	const { x, y, width, height, parentDimensions: [pW, pH], rotation } = this;
	switch (rotation) {
		case 90: return [
			1 - y,
			x,
			width * (pW / pH),
			height * (pH / pW)
		];
		case 180: return [
			1 - x,
			1 - y,
			width,
			height
		];
		case 270: return [
			y,
			1 - x,
			width * (pW / pH),
			height * (pH / pW)
		];
		default: return [
			x,
			y,
			width,
			height
		];
	}
}
function _updateBbox(bbox) {
	[this.x, this.y, this.width, this.height] = _assertClassBrand(_DrawingEditor_brand, this, _convertToParentSpace).call(this, bbox);
	if (this.div) {
		this.fixAndSetPosition();
		this.setDims();
	}
	this._onResized();
}
function _rotateBox() {
	const { x, y, width, height, rotation, parentRotation, parentDimensions: [pW, pH] } = this;
	switch ((rotation * 4 + parentRotation) / 90) {
		case 1: return [
			1 - y - height,
			x,
			height,
			width
		];
		case 2: return [
			1 - x - width,
			1 - y - height,
			width,
			height
		];
		case 3: return [
			y,
			1 - x - width,
			height,
			width
		];
		case 4: return [
			x,
			y - width * (pW / pH),
			height * (pH / pW),
			width * (pW / pH)
		];
		case 5: return [
			1 - y,
			x,
			width * (pW / pH),
			height * (pH / pW)
		];
		case 6: return [
			1 - x - height * (pH / pW),
			1 - y,
			height * (pH / pW),
			width * (pW / pH)
		];
		case 7: return [
			y - width * (pW / pH),
			1 - x - height * (pH / pW),
			width * (pW / pH),
			height * (pH / pW)
		];
		case 8: return [
			x - width,
			y - height,
			width,
			height
		];
		case 9: return [
			1 - y,
			x - width,
			height,
			width
		];
		case 10: return [
			1 - x,
			1 - y,
			width,
			height
		];
		case 11: return [
			y - height,
			1 - x,
			height,
			width
		];
		case 12: return [
			x - height * (pH / pW),
			y,
			height * (pH / pW),
			width * (pW / pH)
		];
		case 13: return [
			1 - y - width * (pW / pH),
			x - height * (pH / pW),
			width * (pW / pH),
			height * (pH / pW)
		];
		case 14: return [
			1 - x,
			1 - y - width * (pW / pH),
			height * (pH / pW),
			width * (pW / pH)
		];
		case 15: return [
			y,
			1 - x,
			width * (pW / pH),
			height * (pH / pW)
		];
		default: return [
			x,
			y,
			width,
			height
		];
	}
}
_defineProperty(DrawingEditor, "_currentDrawId", -1);
_defineProperty(DrawingEditor, "_currentParent", null);
var _currentDraw = { _: null };
var _currentDrawingAC = { _: null };
var _currentDrawingOptions = { _: null };
_defineProperty(DrawingEditor, "_INNER_MARGIN", 3);
var _last2 = /* @__PURE__ */ new WeakMap();
var _line2 = /* @__PURE__ */ new WeakMap();
var _lines = /* @__PURE__ */ new WeakMap();
var _rotation3 = /* @__PURE__ */ new WeakMap();
var _thickness3 = /* @__PURE__ */ new WeakMap();
var _points3 = /* @__PURE__ */ new WeakMap();
var _lastSVGPath = /* @__PURE__ */ new WeakMap();
var _lastIndex = /* @__PURE__ */ new WeakMap();
var _outlines2 = /* @__PURE__ */ new WeakMap();
var _parentWidth2 = /* @__PURE__ */ new WeakMap();
var _parentHeight2 = /* @__PURE__ */ new WeakMap();
var _InkDrawOutliner_brand = /* @__PURE__ */ new WeakSet();
var InkDrawOutliner = class {
	constructor(x, y, parentWidth, parentHeight, rotation, thickness) {
		_classPrivateMethodInitSpec(this, _InkDrawOutliner_brand);
		_classPrivateFieldInitSpec(this, _last2, /* @__PURE__ */ new Float64Array(6));
		_classPrivateFieldInitSpec(this, _line2, void 0);
		_classPrivateFieldInitSpec(this, _lines, void 0);
		_classPrivateFieldInitSpec(this, _rotation3, void 0);
		_classPrivateFieldInitSpec(this, _thickness3, void 0);
		_classPrivateFieldInitSpec(this, _points3, void 0);
		_classPrivateFieldInitSpec(this, _lastSVGPath, "");
		_classPrivateFieldInitSpec(this, _lastIndex, 0);
		_classPrivateFieldInitSpec(this, _outlines2, new InkDrawOutline());
		_classPrivateFieldInitSpec(this, _parentWidth2, void 0);
		_classPrivateFieldInitSpec(this, _parentHeight2, void 0);
		_classPrivateFieldSet2(_parentWidth2, this, parentWidth);
		_classPrivateFieldSet2(_parentHeight2, this, parentHeight);
		_classPrivateFieldSet2(_rotation3, this, rotation);
		_classPrivateFieldSet2(_thickness3, this, thickness);
		[x, y] = _assertClassBrand(_InkDrawOutliner_brand, this, _normalizePoint).call(this, x, y);
		const line = _classPrivateFieldSet2(_line2, this, [
			NaN,
			NaN,
			NaN,
			NaN,
			x,
			y
		]);
		_classPrivateFieldSet2(_points3, this, [x, y]);
		_classPrivateFieldSet2(_lines, this, [{
			line,
			points: _classPrivateFieldGet2(_points3, this)
		}]);
		_classPrivateFieldGet2(_last2, this).set(line, 0);
	}
	updateProperty(name, value) {
		if (name === "stroke-width") _classPrivateFieldSet2(_thickness3, this, value);
	}
	isEmpty() {
		return !_classPrivateFieldGet2(_lines, this) || _classPrivateFieldGet2(_lines, this).length === 0;
	}
	isCancellable() {
		return _classPrivateFieldGet2(_points3, this).length <= 10;
	}
	add(x, y) {
		[x, y] = _assertClassBrand(_InkDrawOutliner_brand, this, _normalizePoint).call(this, x, y);
		const [x1, y1, x2, y2] = _classPrivateFieldGet2(_last2, this).subarray(2, 6);
		const diffX = x - x2;
		const diffY = y - y2;
		if (Math.hypot(_classPrivateFieldGet2(_parentWidth2, this) * diffX, _classPrivateFieldGet2(_parentHeight2, this) * diffY) <= 2) return null;
		_classPrivateFieldGet2(_points3, this).push(x, y);
		if (isNaN(x1)) {
			_classPrivateFieldGet2(_last2, this).set([
				x2,
				y2,
				x,
				y
			], 2);
			_classPrivateFieldGet2(_line2, this).push(NaN, NaN, NaN, NaN, x, y);
			return { path: { d: this.toSVGPath() } };
		}
		if (isNaN(_classPrivateFieldGet2(_last2, this)[0])) _classPrivateFieldGet2(_line2, this).splice(6, 6);
		_classPrivateFieldGet2(_last2, this).set([
			x1,
			y1,
			x2,
			y2,
			x,
			y
		], 0);
		_classPrivateFieldGet2(_line2, this).push(...Outline.createBezierPoints(x1, y1, x2, y2, x, y));
		return { path: { d: this.toSVGPath() } };
	}
	end(x, y) {
		const change = this.add(x, y);
		if (change) return change;
		if (_classPrivateFieldGet2(_points3, this).length === 2) return { path: { d: this.toSVGPath() } };
		return null;
	}
	startNew(x, y, parentWidth, parentHeight, rotation) {
		_classPrivateFieldSet2(_parentWidth2, this, parentWidth);
		_classPrivateFieldSet2(_parentHeight2, this, parentHeight);
		_classPrivateFieldSet2(_rotation3, this, rotation);
		[x, y] = _assertClassBrand(_InkDrawOutliner_brand, this, _normalizePoint).call(this, x, y);
		const line = _classPrivateFieldSet2(_line2, this, [
			NaN,
			NaN,
			NaN,
			NaN,
			x,
			y
		]);
		_classPrivateFieldSet2(_points3, this, [x, y]);
		const last = _classPrivateFieldGet2(_lines, this).at(-1);
		if (last) {
			last.line = new Float32Array(last.line);
			last.points = new Float32Array(last.points);
		}
		_classPrivateFieldGet2(_lines, this).push({
			line,
			points: _classPrivateFieldGet2(_points3, this)
		});
		_classPrivateFieldGet2(_last2, this).set(line, 0);
		_classPrivateFieldSet2(_lastIndex, this, 0);
		this.toSVGPath();
		return null;
	}
	getLastElement() {
		return _classPrivateFieldGet2(_lines, this).at(-1);
	}
	setLastElement(element) {
		if (!_classPrivateFieldGet2(_lines, this)) return _classPrivateFieldGet2(_outlines2, this).setLastElement(element);
		_classPrivateFieldGet2(_lines, this).push(element);
		_classPrivateFieldSet2(_line2, this, element.line);
		_classPrivateFieldSet2(_points3, this, element.points);
		_classPrivateFieldSet2(_lastIndex, this, 0);
		return { path: { d: this.toSVGPath() } };
	}
	removeLastElement() {
		if (!_classPrivateFieldGet2(_lines, this)) return _classPrivateFieldGet2(_outlines2, this).removeLastElement();
		_classPrivateFieldGet2(_lines, this).pop();
		_classPrivateFieldSet2(_lastSVGPath, this, "");
		for (let i = 0, ii = _classPrivateFieldGet2(_lines, this).length; i < ii; i++) {
			const { line, points } = _classPrivateFieldGet2(_lines, this)[i];
			_classPrivateFieldSet2(_line2, this, line);
			_classPrivateFieldSet2(_points3, this, points);
			_classPrivateFieldSet2(_lastIndex, this, 0);
			this.toSVGPath();
		}
		return { path: { d: _classPrivateFieldGet2(_lastSVGPath, this) } };
	}
	toSVGPath() {
		const firstX = Outline.svgRound(_classPrivateFieldGet2(_line2, this)[4]);
		const firstY = Outline.svgRound(_classPrivateFieldGet2(_line2, this)[5]);
		if (_classPrivateFieldGet2(_points3, this).length === 2) {
			_classPrivateFieldSet2(_lastSVGPath, this, `${_classPrivateFieldGet2(_lastSVGPath, this)} M ${firstX} ${firstY} Z`);
			return _classPrivateFieldGet2(_lastSVGPath, this);
		}
		if (_classPrivateFieldGet2(_points3, this).length <= 6) {
			const i = _classPrivateFieldGet2(_lastSVGPath, this).lastIndexOf("M");
			_classPrivateFieldSet2(_lastSVGPath, this, `${_classPrivateFieldGet2(_lastSVGPath, this).slice(0, i)} M ${firstX} ${firstY}`);
			_classPrivateFieldSet2(_lastIndex, this, 6);
		}
		if (_classPrivateFieldGet2(_points3, this).length === 4) {
			const secondX = Outline.svgRound(_classPrivateFieldGet2(_line2, this)[10]);
			const secondY = Outline.svgRound(_classPrivateFieldGet2(_line2, this)[11]);
			_classPrivateFieldSet2(_lastSVGPath, this, `${_classPrivateFieldGet2(_lastSVGPath, this)} L ${secondX} ${secondY}`);
			_classPrivateFieldSet2(_lastIndex, this, 12);
			return _classPrivateFieldGet2(_lastSVGPath, this);
		}
		const buffer = [];
		if (_classPrivateFieldGet2(_lastIndex, this) === 0) {
			buffer.push(`M ${firstX} ${firstY}`);
			_classPrivateFieldSet2(_lastIndex, this, 6);
		}
		for (let i = _classPrivateFieldGet2(_lastIndex, this), ii = _classPrivateFieldGet2(_line2, this).length; i < ii; i += 6) {
			const [c1x, c1y, c2x, c2y, x, y] = _classPrivateFieldGet2(_line2, this).slice(i, i + 6).map(Outline.svgRound);
			buffer.push(`C${c1x} ${c1y} ${c2x} ${c2y} ${x} ${y}`);
		}
		_classPrivateFieldSet2(_lastSVGPath, this, _classPrivateFieldGet2(_lastSVGPath, this) + buffer.join(" "));
		_classPrivateFieldSet2(_lastIndex, this, _classPrivateFieldGet2(_line2, this).length);
		return _classPrivateFieldGet2(_lastSVGPath, this);
	}
	getOutlines(parentWidth, parentHeight, scale, innerMargin) {
		const last = _classPrivateFieldGet2(_lines, this).at(-1);
		last.line = new Float32Array(last.line);
		last.points = new Float32Array(last.points);
		_classPrivateFieldGet2(_outlines2, this).build(_classPrivateFieldGet2(_lines, this), parentWidth, parentHeight, scale, _classPrivateFieldGet2(_rotation3, this), _classPrivateFieldGet2(_thickness3, this), innerMargin);
		_classPrivateFieldSet2(_last2, this, null);
		_classPrivateFieldSet2(_line2, this, null);
		_classPrivateFieldSet2(_lines, this, null);
		_classPrivateFieldSet2(_lastSVGPath, this, null);
		return _classPrivateFieldGet2(_outlines2, this);
	}
	get defaultSVGProperties() {
		return {
			root: { viewBox: "0 0 10000 10000" },
			rootClass: { draw: true },
			bbox: [
				0,
				0,
				1,
				1
			]
		};
	}
};
function _normalizePoint(x, y) {
	return Outline._normalizePoint(x, y, _classPrivateFieldGet2(_parentWidth2, this), _classPrivateFieldGet2(_parentHeight2, this), _classPrivateFieldGet2(_rotation3, this));
}
var _bbox3 = /* @__PURE__ */ new WeakMap();
var _currentRotation = /* @__PURE__ */ new WeakMap();
var _innerMargin3 = /* @__PURE__ */ new WeakMap();
var _lines2 = /* @__PURE__ */ new WeakMap();
var _parentWidth3 = /* @__PURE__ */ new WeakMap();
var _parentHeight3 = /* @__PURE__ */ new WeakMap();
var _parentScale = /* @__PURE__ */ new WeakMap();
var _rotation4 = /* @__PURE__ */ new WeakMap();
var _thickness4 = /* @__PURE__ */ new WeakMap();
var _InkDrawOutline_brand = /* @__PURE__ */ new WeakSet();
var InkDrawOutline = class extends Outline {
	constructor(..._args) {
		super(..._args);
		_classPrivateMethodInitSpec(this, _InkDrawOutline_brand);
		_classPrivateFieldInitSpec(this, _bbox3, void 0);
		_classPrivateFieldInitSpec(this, _currentRotation, 0);
		_classPrivateFieldInitSpec(this, _innerMargin3, void 0);
		_classPrivateFieldInitSpec(this, _lines2, void 0);
		_classPrivateFieldInitSpec(this, _parentWidth3, void 0);
		_classPrivateFieldInitSpec(this, _parentHeight3, void 0);
		_classPrivateFieldInitSpec(this, _parentScale, void 0);
		_classPrivateFieldInitSpec(this, _rotation4, void 0);
		_classPrivateFieldInitSpec(this, _thickness4, void 0);
	}
	build(lines, parentWidth, parentHeight, parentScale, rotation, thickness, innerMargin) {
		_classPrivateFieldSet2(_parentWidth3, this, parentWidth);
		_classPrivateFieldSet2(_parentHeight3, this, parentHeight);
		_classPrivateFieldSet2(_parentScale, this, parentScale);
		_classPrivateFieldSet2(_rotation4, this, rotation);
		_classPrivateFieldSet2(_thickness4, this, thickness);
		_classPrivateFieldSet2(_innerMargin3, this, innerMargin ?? 0);
		_classPrivateFieldSet2(_lines2, this, lines);
		_assertClassBrand(_InkDrawOutline_brand, this, _computeBbox).call(this);
	}
	get thickness() {
		return _classPrivateFieldGet2(_thickness4, this);
	}
	setLastElement(element) {
		_classPrivateFieldGet2(_lines2, this).push(element);
		return { path: { d: this.toSVGPath() } };
	}
	removeLastElement() {
		_classPrivateFieldGet2(_lines2, this).pop();
		return { path: { d: this.toSVGPath() } };
	}
	toSVGPath() {
		const buffer = [];
		for (const { line } of _classPrivateFieldGet2(_lines2, this)) {
			buffer.push(`M${Outline.svgRound(line[4])} ${Outline.svgRound(line[5])}`);
			if (line.length === 6) {
				buffer.push("Z");
				continue;
			}
			if (line.length === 12 && isNaN(line[6])) {
				buffer.push(`L${Outline.svgRound(line[10])} ${Outline.svgRound(line[11])}`);
				continue;
			}
			for (let i = 6, ii = line.length; i < ii; i += 6) {
				const [c1x, c1y, c2x, c2y, x, y] = line.subarray(i, i + 6).map(Outline.svgRound);
				buffer.push(`C${c1x} ${c1y} ${c2x} ${c2y} ${x} ${y}`);
			}
		}
		return buffer.join("");
	}
	serialize([pageX, pageY, pageWidth, pageHeight], isForCopying) {
		const serializedLines = [];
		const serializedPoints = [];
		const [x, y, width, height] = _assertClassBrand(_InkDrawOutline_brand, this, _getBBoxWithNoMargin).call(this);
		let tx, ty, sx, sy, x1, y1, x2, y2, rescaleFn;
		switch (_classPrivateFieldGet2(_rotation4, this)) {
			case 0:
				rescaleFn = Outline._rescale;
				tx = pageX;
				ty = pageY + pageHeight;
				sx = pageWidth;
				sy = -pageHeight;
				x1 = pageX + x * pageWidth;
				y1 = pageY + (1 - y - height) * pageHeight;
				x2 = pageX + (x + width) * pageWidth;
				y2 = pageY + (1 - y) * pageHeight;
				break;
			case 90:
				rescaleFn = Outline._rescaleAndSwap;
				tx = pageX;
				ty = pageY;
				sx = pageWidth;
				sy = pageHeight;
				x1 = pageX + y * pageWidth;
				y1 = pageY + x * pageHeight;
				x2 = pageX + (y + height) * pageWidth;
				y2 = pageY + (x + width) * pageHeight;
				break;
			case 180:
				rescaleFn = Outline._rescale;
				tx = pageX + pageWidth;
				ty = pageY;
				sx = -pageWidth;
				sy = pageHeight;
				x1 = pageX + (1 - x - width) * pageWidth;
				y1 = pageY + y * pageHeight;
				x2 = pageX + (1 - x) * pageWidth;
				y2 = pageY + (y + height) * pageHeight;
				break;
			case 270:
				rescaleFn = Outline._rescaleAndSwap;
				tx = pageX + pageWidth;
				ty = pageY + pageHeight;
				sx = -pageWidth;
				sy = -pageHeight;
				x1 = pageX + (1 - y - height) * pageWidth;
				y1 = pageY + (1 - x - width) * pageHeight;
				x2 = pageX + (1 - y) * pageWidth;
				y2 = pageY + (1 - x) * pageHeight;
				break;
		}
		for (const { line, points } of _classPrivateFieldGet2(_lines2, this)) {
			serializedLines.push(rescaleFn(line, tx, ty, sx, sy, isForCopying ? new Array(line.length) : null));
			serializedPoints.push(rescaleFn(points, tx, ty, sx, sy, isForCopying ? new Array(points.length) : null));
		}
		return {
			lines: serializedLines,
			points: serializedPoints,
			rect: [
				x1,
				y1,
				x2,
				y2
			]
		};
	}
	static deserialize(pageX, pageY, pageWidth, pageHeight, innerMargin, { paths: { lines, points }, rotation, thickness }) {
		const newLines = [];
		let tx, ty, sx, sy, rescaleFn;
		switch (rotation) {
			case 0:
				rescaleFn = Outline._rescale;
				tx = -pageX / pageWidth;
				ty = pageY / pageHeight + 1;
				sx = 1 / pageWidth;
				sy = -1 / pageHeight;
				break;
			case 90:
				rescaleFn = Outline._rescaleAndSwap;
				tx = -pageY / pageHeight;
				ty = -pageX / pageWidth;
				sx = 1 / pageHeight;
				sy = 1 / pageWidth;
				break;
			case 180:
				rescaleFn = Outline._rescale;
				tx = pageX / pageWidth + 1;
				ty = -pageY / pageHeight;
				sx = -1 / pageWidth;
				sy = 1 / pageHeight;
				break;
			case 270:
				rescaleFn = Outline._rescaleAndSwap;
				tx = pageY / pageHeight + 1;
				ty = pageX / pageWidth + 1;
				sx = -1 / pageHeight;
				sy = -1 / pageWidth;
				break;
		}
		if (!lines) {
			lines = [];
			for (const point of points) {
				const len = point.length;
				if (len === 2) {
					lines.push(new Float32Array([
						NaN,
						NaN,
						NaN,
						NaN,
						point[0],
						point[1]
					]));
					continue;
				}
				if (len === 4) {
					lines.push(new Float32Array([
						NaN,
						NaN,
						NaN,
						NaN,
						point[0],
						point[1],
						NaN,
						NaN,
						NaN,
						NaN,
						point[2],
						point[3]
					]));
					continue;
				}
				const line = new Float32Array(3 * (len - 2));
				lines.push(line);
				let [x1, y1, x2, y2] = point.subarray(0, 4);
				line.set([
					NaN,
					NaN,
					NaN,
					NaN,
					x1,
					y1
				], 0);
				for (let i = 4; i < len; i += 2) {
					const x = point[i];
					const y = point[i + 1];
					line.set(Outline.createBezierPoints(x1, y1, x2, y2, x, y), (i - 2) * 3);
					[x1, y1, x2, y2] = [
						x2,
						y2,
						x,
						y
					];
				}
			}
		}
		for (let i = 0, ii = lines.length; i < ii; i++) newLines.push({
			line: rescaleFn(lines[i].map((x) => x ?? NaN), tx, ty, sx, sy),
			points: rescaleFn(points[i].map((x) => x ?? NaN), tx, ty, sx, sy)
		});
		const outlines = new this.prototype.constructor();
		outlines.build(newLines, pageWidth, pageHeight, 1, rotation, thickness, innerMargin);
		return outlines;
	}
	get box() {
		return _classPrivateFieldGet2(_bbox3, this);
	}
	updateProperty(name, value) {
		if (name === "stroke-width") return _assertClassBrand(_InkDrawOutline_brand, this, _updateThickness2).call(this, value);
		return null;
	}
	updateParentDimensions([width, height], scale) {
		const [oldMarginX, oldMarginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
		_classPrivateFieldSet2(_parentWidth3, this, width);
		_classPrivateFieldSet2(_parentHeight3, this, height);
		_classPrivateFieldSet2(_parentScale, this, scale);
		const [newMarginX, newMarginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
		const diffMarginX = newMarginX - oldMarginX;
		const diffMarginY = newMarginY - oldMarginY;
		const bbox = _classPrivateFieldGet2(_bbox3, this);
		bbox[0] -= diffMarginX;
		bbox[1] -= diffMarginY;
		bbox[2] += 2 * diffMarginX;
		bbox[3] += 2 * diffMarginY;
		return bbox;
	}
	updateRotation(rotation) {
		_classPrivateFieldSet2(_currentRotation, this, rotation);
		return { path: { transform: this.rotationTransform } };
	}
	get viewBox() {
		return _classPrivateFieldGet2(_bbox3, this).map(Outline.svgRound).join(" ");
	}
	get defaultProperties() {
		const [x, y] = _classPrivateFieldGet2(_bbox3, this);
		return {
			root: { viewBox: this.viewBox },
			path: { "transform-origin": `${Outline.svgRound(x)} ${Outline.svgRound(y)}` }
		};
	}
	get rotationTransform() {
		const [, , width, height] = _classPrivateFieldGet2(_bbox3, this);
		let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
		switch (_classPrivateFieldGet2(_currentRotation, this)) {
			case 90:
				b = height / width;
				c = -width / height;
				e = width;
				break;
			case 180:
				a = -1;
				d = -1;
				e = width;
				f = height;
				break;
			case 270:
				b = -height / width;
				c = width / height;
				f = height;
				break;
			default: return "";
		}
		return `matrix(${a} ${b} ${c} ${d} ${Outline.svgRound(e)} ${Outline.svgRound(f)})`;
	}
	getPathResizingSVGProperties([newX, newY, newWidth, newHeight]) {
		const [marginX, marginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
		const [x, y, width, height] = _classPrivateFieldGet2(_bbox3, this);
		if (Math.abs(width - marginX) <= Outline.PRECISION || Math.abs(height - marginY) <= Outline.PRECISION) {
			const tx = newX + newWidth / 2 - (x + width / 2);
			const ty = newY + newHeight / 2 - (y + height / 2);
			return { path: {
				"transform-origin": `${Outline.svgRound(newX)} ${Outline.svgRound(newY)}`,
				transform: `${this.rotationTransform} translate(${tx} ${ty})`
			} };
		}
		const s1x = (newWidth - 2 * marginX) / (width - 2 * marginX);
		const s1y = (newHeight - 2 * marginY) / (height - 2 * marginY);
		const s2x = width / newWidth;
		const s2y = height / newHeight;
		return { path: {
			"transform-origin": `${Outline.svgRound(x)} ${Outline.svgRound(y)}`,
			transform: `${this.rotationTransform} scale(${s2x} ${s2y}) translate(${Outline.svgRound(marginX)} ${Outline.svgRound(marginY)}) scale(${s1x} ${s1y}) translate(${Outline.svgRound(-marginX)} ${Outline.svgRound(-marginY)})`
		} };
	}
	getPathResizedSVGProperties([newX, newY, newWidth, newHeight]) {
		const [marginX, marginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
		const bbox = _classPrivateFieldGet2(_bbox3, this);
		const [x, y, width, height] = bbox;
		bbox[0] = newX;
		bbox[1] = newY;
		bbox[2] = newWidth;
		bbox[3] = newHeight;
		if (Math.abs(width - marginX) <= Outline.PRECISION || Math.abs(height - marginY) <= Outline.PRECISION) {
			const tx = newX + newWidth / 2 - (x + width / 2);
			const ty = newY + newHeight / 2 - (y + height / 2);
			for (const { line, points } of _classPrivateFieldGet2(_lines2, this)) {
				Outline._translate(line, tx, ty, line);
				Outline._translate(points, tx, ty, points);
			}
			return {
				root: { viewBox: this.viewBox },
				path: {
					"transform-origin": `${Outline.svgRound(newX)} ${Outline.svgRound(newY)}`,
					transform: this.rotationTransform || null,
					d: this.toSVGPath()
				}
			};
		}
		const s1x = (newWidth - 2 * marginX) / (width - 2 * marginX);
		const s1y = (newHeight - 2 * marginY) / (height - 2 * marginY);
		const tx = -s1x * (x + marginX) + newX + marginX;
		const ty = -s1y * (y + marginY) + newY + marginY;
		if (s1x !== 1 || s1y !== 1 || tx !== 0 || ty !== 0) for (const { line, points } of _classPrivateFieldGet2(_lines2, this)) {
			Outline._rescale(line, tx, ty, s1x, s1y, line);
			Outline._rescale(points, tx, ty, s1x, s1y, points);
		}
		return {
			root: { viewBox: this.viewBox },
			path: {
				"transform-origin": `${Outline.svgRound(newX)} ${Outline.svgRound(newY)}`,
				transform: this.rotationTransform || null,
				d: this.toSVGPath()
			}
		};
	}
	getPathTranslatedSVGProperties([newX, newY], parentDimensions) {
		const [newParentWidth, newParentHeight] = parentDimensions;
		const bbox = _classPrivateFieldGet2(_bbox3, this);
		const tx = newX - bbox[0];
		const ty = newY - bbox[1];
		if (_classPrivateFieldGet2(_parentWidth3, this) === newParentWidth && _classPrivateFieldGet2(_parentHeight3, this) === newParentHeight) for (const { line, points } of _classPrivateFieldGet2(_lines2, this)) {
			Outline._translate(line, tx, ty, line);
			Outline._translate(points, tx, ty, points);
		}
		else {
			const sx = _classPrivateFieldGet2(_parentWidth3, this) / newParentWidth;
			const sy = _classPrivateFieldGet2(_parentHeight3, this) / newParentHeight;
			_classPrivateFieldSet2(_parentWidth3, this, newParentWidth);
			_classPrivateFieldSet2(_parentHeight3, this, newParentHeight);
			for (const { line, points } of _classPrivateFieldGet2(_lines2, this)) {
				Outline._rescale(line, tx, ty, sx, sy, line);
				Outline._rescale(points, tx, ty, sx, sy, points);
			}
			bbox[2] *= sx;
			bbox[3] *= sy;
		}
		bbox[0] = newX;
		bbox[1] = newY;
		return {
			root: { viewBox: this.viewBox },
			path: {
				d: this.toSVGPath(),
				"transform-origin": `${Outline.svgRound(newX)} ${Outline.svgRound(newY)}`
			}
		};
	}
	get defaultSVGProperties() {
		const bbox = _classPrivateFieldGet2(_bbox3, this);
		return {
			root: { viewBox: this.viewBox },
			rootClass: { draw: true },
			path: {
				d: this.toSVGPath(),
				"transform-origin": `${Outline.svgRound(bbox[0])} ${Outline.svgRound(bbox[1])}`,
				transform: this.rotationTransform || null
			},
			bbox
		};
	}
};
function _getMarginComponents(thickness = _classPrivateFieldGet2(_thickness4, this)) {
	const margin = _classPrivateFieldGet2(_innerMargin3, this) + thickness / 2 * _classPrivateFieldGet2(_parentScale, this);
	return _classPrivateFieldGet2(_rotation4, this) % 180 === 0 ? [margin / _classPrivateFieldGet2(_parentWidth3, this), margin / _classPrivateFieldGet2(_parentHeight3, this)] : [margin / _classPrivateFieldGet2(_parentHeight3, this), margin / _classPrivateFieldGet2(_parentWidth3, this)];
}
function _getBBoxWithNoMargin() {
	const [x, y, width, height] = _classPrivateFieldGet2(_bbox3, this);
	const [marginX, marginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this, 0);
	return [
		x + marginX,
		y + marginY,
		width - 2 * marginX,
		height - 2 * marginY
	];
}
function _computeBbox() {
	const bbox = _classPrivateFieldSet2(_bbox3, this, new Float32Array([
		Infinity,
		Infinity,
		-Infinity,
		-Infinity
	]));
	for (const { line } of _classPrivateFieldGet2(_lines2, this)) {
		if (line.length <= 12) {
			for (let i = 4, ii = line.length; i < ii; i += 6) Util.pointBoundingBox(line[i], line[i + 1], bbox);
			continue;
		}
		let lastX = line[4], lastY = line[5];
		for (let i = 6, ii = line.length; i < ii; i += 6) {
			const [c1x, c1y, c2x, c2y, x, y] = line.subarray(i, i + 6);
			Util.bezierBoundingBox(lastX, lastY, c1x, c1y, c2x, c2y, x, y, bbox);
			lastX = x;
			lastY = y;
		}
	}
	const [marginX, marginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
	bbox[0] = MathClamp(bbox[0] - marginX, 0, 1);
	bbox[1] = MathClamp(bbox[1] - marginY, 0, 1);
	bbox[2] = MathClamp(bbox[2] + marginX, 0, 1);
	bbox[3] = MathClamp(bbox[3] + marginY, 0, 1);
	bbox[2] -= bbox[0];
	bbox[3] -= bbox[1];
}
function _updateThickness2(thickness) {
	const [oldMarginX, oldMarginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
	_classPrivateFieldSet2(_thickness4, this, thickness);
	const [newMarginX, newMarginY] = _assertClassBrand(_InkDrawOutline_brand, this, _getMarginComponents).call(this);
	const [diffMarginX, diffMarginY] = [newMarginX - oldMarginX, newMarginY - oldMarginY];
	const bbox = _classPrivateFieldGet2(_bbox3, this);
	bbox[0] -= diffMarginX;
	bbox[1] -= diffMarginY;
	bbox[2] += 2 * diffMarginX;
	bbox[3] += 2 * diffMarginY;
	return bbox;
}
var InkDrawingOptions = class InkDrawingOptions extends DrawingOptions {
	constructor(viewerParameters) {
		super();
		this._viewParameters = viewerParameters;
		super.updateProperties({
			fill: "none",
			stroke: AnnotationEditor._defaultLineColor,
			"stroke-opacity": 1,
			"stroke-width": 1,
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"stroke-miterlimit": 10
		});
	}
	updateSVGProperty(name, value) {
		if (name === "stroke-width") {
			value ?? (value = this["stroke-width"]);
			value *= this._viewParameters.realScale;
		}
		super.updateSVGProperty(name, value);
	}
	clone() {
		const clone = new InkDrawingOptions(this._viewParameters);
		clone.updateAll(this);
		return clone;
	}
};
var _InkEditor_brand = /* @__PURE__ */ new WeakSet();
var InkEditor = class InkEditor extends DrawingEditor {
	constructor(params) {
		super({
			...params,
			name: "inkEditor"
		});
		_classPrivateMethodInitSpec(this, _InkEditor_brand);
		this._willKeepAspectRatio = true;
		this.defaultL10nId = "pdfjs-editor-ink-editor";
	}
	static initialize(l10n, uiManager) {
		AnnotationEditor.initialize(l10n, uiManager);
		this._defaultDrawingOptions = new InkDrawingOptions(uiManager.viewParameters);
	}
	static getDefaultDrawingOptions(options) {
		const clone = this._defaultDrawingOptions.clone();
		clone.updateProperties(options);
		return clone;
	}
	static get supportMultipleDrawings() {
		return true;
	}
	static get typesMap() {
		return shadow(this, "typesMap", /* @__PURE__ */ new Map([
			[AnnotationEditorParamsType.INK_THICKNESS, "stroke-width"],
			[AnnotationEditorParamsType.INK_COLOR, "stroke"],
			[AnnotationEditorParamsType.INK_OPACITY, "stroke-opacity"]
		]));
	}
	static createDrawerInstance(x, y, parentWidth, parentHeight, rotation) {
		return new InkDrawOutliner(x, y, parentWidth, parentHeight, rotation, this._defaultDrawingOptions["stroke-width"]);
	}
	static deserializeDraw(pageX, pageY, pageWidth, pageHeight, innerMargin, data) {
		return InkDrawOutline.deserialize(pageX, pageY, pageWidth, pageHeight, innerMargin, data);
	}
	static async deserialize(data, parent, uiManager) {
		let initialData = null;
		if (data instanceof InkAnnotationElement) {
			const { data: { inkLists, rect, rotation, id, color, opacity, borderStyle: { rawWidth: thickness }, popupRef, richText, contentsObj, creationDate, modificationDate }, parent: { page: { pageNumber } } } = data;
			initialData = data = {
				annotationType: AnnotationEditorType.INK,
				color: Array.from(color),
				thickness,
				opacity,
				paths: { points: inkLists },
				boxes: null,
				pageIndex: pageNumber - 1,
				rect: rect.slice(0),
				rotation,
				annotationElementId: id,
				id,
				deleted: false,
				popupRef,
				richText,
				comment: contentsObj?.str || null,
				creationDate,
				modificationDate
			};
		}
		const editor = await super.deserialize(data, parent, uiManager);
		editor._initialData = initialData;
		if (data.comment) editor.setCommentData(data);
		return editor;
	}
	get toolbarButtons() {
		this._colorPicker || (this._colorPicker = new BasicColorPicker(this));
		return [["colorPicker", this._colorPicker]];
	}
	get colorType() {
		return AnnotationEditorParamsType.INK_COLOR;
	}
	get color() {
		return this._drawingOptions.stroke;
	}
	get opacity() {
		return this._drawingOptions["stroke-opacity"];
	}
	onScaleChanging() {
		if (!this.parent) return;
		super.onScaleChanging();
		const { _drawId, _drawingOptions, parent } = this;
		_drawingOptions.updateSVGProperty("stroke-width");
		parent.drawLayer.updateProperties(_drawId, _drawingOptions.toSVGProperties());
	}
	static onScaleChangingWhenDrawing() {
		const parent = this._currentParent;
		if (!parent) return;
		super.onScaleChangingWhenDrawing();
		this._defaultDrawingOptions.updateSVGProperty("stroke-width");
		parent.drawLayer.updateProperties(this._currentDrawId, this._defaultDrawingOptions.toSVGProperties());
	}
	createDrawingOptions({ color, thickness, opacity }) {
		this._drawingOptions = InkEditor.getDefaultDrawingOptions({
			stroke: Util.makeHexColor(...color),
			"stroke-width": thickness,
			"stroke-opacity": opacity
		});
	}
	serialize(isForCopying = false) {
		if (this.isEmpty()) return null;
		if (this.deleted) return this.serializeDeleted();
		const { lines, points } = this.serializeDraw(isForCopying);
		const { _drawingOptions: { stroke, "stroke-opacity": opacity, "stroke-width": thickness } } = this;
		const serialized = Object.assign(super.serialize(isForCopying), {
			color: AnnotationEditor._colorManager.convert(stroke),
			opacity,
			thickness,
			paths: {
				lines,
				points
			}
		});
		this.addComment(serialized);
		if (isForCopying) {
			serialized.isCopy = true;
			return serialized;
		}
		if (this.annotationElementId && !_assertClassBrand(_InkEditor_brand, this, _hasElementChanged3).call(this, serialized)) return null;
		serialized.id = this.annotationElementId;
		return serialized;
	}
	renderAnnotationElement(annotation) {
		if (this.deleted) {
			annotation.hide();
			return null;
		}
		const { points, rect } = this.serializeDraw(false);
		annotation.updateEdited({
			rect,
			thickness: this._drawingOptions["stroke-width"],
			points,
			popup: this.comment
		});
		return null;
	}
};
function _hasElementChanged3(serialized) {
	const { color, thickness, opacity, pageIndex } = this._initialData;
	return this.hasEditedComment || this._hasBeenMoved || this._hasBeenResized || serialized.color.some((c, i) => c !== color[i]) || serialized.thickness !== thickness || serialized.opacity !== opacity || serialized.pageIndex !== pageIndex;
}
_defineProperty(InkEditor, "_type", "ink");
_defineProperty(InkEditor, "_editorType", AnnotationEditorType.INK);
_defineProperty(InkEditor, "_defaultDrawingOptions", null);
var ContourDrawOutline = class extends InkDrawOutline {
	toSVGPath() {
		let path = super.toSVGPath();
		if (!path.endsWith("Z")) path += "Z";
		return path;
	}
};
var BASE_HEADER_LENGTH = 8;
var POINTS_PROPERTIES_NUMBER = 3;
var SignatureExtractor = class SignatureExtractor {
	static extractContoursFromText(text, { fontFamily, fontStyle, fontWeight }, pageWidth, pageHeight, rotation, innerMargin) {
		let canvas = new OffscreenCanvas(1, 1);
		let ctx = canvas.getContext("2d", { alpha: false });
		const fontSize = 200;
		const font = ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
		const { actualBoundingBoxLeft, actualBoundingBoxRight, actualBoundingBoxAscent, actualBoundingBoxDescent, fontBoundingBoxAscent, fontBoundingBoxDescent, width } = ctx.measureText(text);
		const SCALE = 1.5;
		const canvasWidth = Math.ceil(Math.max(Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight) || 0, width) * SCALE);
		const canvasHeight = Math.ceil(Math.max(Math.abs(actualBoundingBoxAscent) + Math.abs(actualBoundingBoxDescent) || fontSize, Math.abs(fontBoundingBoxAscent) + Math.abs(fontBoundingBoxDescent) || fontSize) * SCALE);
		canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
		ctx = canvas.getContext("2d", {
			alpha: true,
			willReadFrequently: true
		});
		ctx.font = font;
		ctx.filter = "grayscale(1)";
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = "black";
		ctx.fillText(text, canvasWidth * (SCALE - 1) / 2, canvasHeight * (3 - SCALE) / 2);
		const uint8Buf = _assertClassBrand(SignatureExtractor, this, _toUint).call(this, ctx.getImageData(0, 0, canvasWidth, canvasHeight).data);
		const histogram = _assertClassBrand(SignatureExtractor, this, _getHistogram).call(this, uint8Buf);
		const threshold = _assertClassBrand(SignatureExtractor, this, _guessThreshold).call(this, histogram);
		const contourList = _assertClassBrand(SignatureExtractor, this, _findContours).call(this, uint8Buf, canvasWidth, canvasHeight, threshold);
		return this.processDrawnLines({
			lines: {
				curves: contourList,
				width: canvasWidth,
				height: canvasHeight
			},
			pageWidth,
			pageHeight,
			rotation,
			innerMargin,
			mustSmooth: true,
			areContours: true
		});
	}
	static process(bitmap, pageWidth, pageHeight, rotation, innerMargin) {
		const [uint8Buf, width, height] = _assertClassBrand(SignatureExtractor, this, _getGrayPixels).call(this, bitmap);
		const [buffer, histogram] = _assertClassBrand(SignatureExtractor, this, _bilateralFilter).call(this, uint8Buf, width, height, Math.hypot(width, height) * _assertClassBrand(SignatureExtractor, this, _PARAMETERS)._.sigmaSFactor, _assertClassBrand(SignatureExtractor, this, _PARAMETERS)._.sigmaR, _assertClassBrand(SignatureExtractor, this, _PARAMETERS)._.kernelSize);
		const threshold = _assertClassBrand(SignatureExtractor, this, _guessThreshold).call(this, histogram);
		const contourList = _assertClassBrand(SignatureExtractor, this, _findContours).call(this, buffer, width, height, threshold);
		return this.processDrawnLines({
			lines: {
				curves: contourList,
				width,
				height
			},
			pageWidth,
			pageHeight,
			rotation,
			innerMargin,
			mustSmooth: true,
			areContours: true
		});
	}
	static processDrawnLines({ lines, pageWidth, pageHeight, rotation, innerMargin, mustSmooth, areContours }) {
		if (rotation % 180 !== 0) [pageWidth, pageHeight] = [pageHeight, pageWidth];
		const { curves, width, height } = lines;
		const thickness = lines.thickness ?? 0;
		const linesAndPoints = [];
		const ratio = Math.min(pageWidth / width, pageHeight / height);
		const xScale = ratio / pageWidth;
		const yScale = ratio / pageHeight;
		const newCurves = [];
		for (const { points } of curves) {
			const reducedPoints = mustSmooth ? _assertClassBrand(SignatureExtractor, this, _douglasPeucker).call(this, points) : points;
			if (!reducedPoints) continue;
			newCurves.push(reducedPoints);
			const len = reducedPoints.length;
			const newPoints = new Float32Array(len);
			const line = new Float32Array(3 * (len === 2 ? 2 : len - 2));
			linesAndPoints.push({
				line,
				points: newPoints
			});
			if (len === 2) {
				newPoints[0] = reducedPoints[0] * xScale;
				newPoints[1] = reducedPoints[1] * yScale;
				line.set([
					NaN,
					NaN,
					NaN,
					NaN,
					newPoints[0],
					newPoints[1]
				], 0);
				continue;
			}
			let [x1, y1, x2, y2] = reducedPoints;
			x1 *= xScale;
			y1 *= yScale;
			x2 *= xScale;
			y2 *= yScale;
			newPoints.set([
				x1,
				y1,
				x2,
				y2
			], 0);
			line.set([
				NaN,
				NaN,
				NaN,
				NaN,
				x1,
				y1
			], 0);
			for (let i = 4; i < len; i += 2) {
				const x = newPoints[i] = reducedPoints[i] * xScale;
				const y = newPoints[i + 1] = reducedPoints[i + 1] * yScale;
				line.set(Outline.createBezierPoints(x1, y1, x2, y2, x, y), (i - 2) * 3);
				[x1, y1, x2, y2] = [
					x2,
					y2,
					x,
					y
				];
			}
		}
		if (linesAndPoints.length === 0) return null;
		const outline = areContours ? new ContourDrawOutline() : new InkDrawOutline();
		outline.build(linesAndPoints, pageWidth, pageHeight, 1, rotation, areContours ? 0 : thickness, innerMargin);
		return {
			outline,
			newCurves,
			areContours,
			thickness,
			width,
			height
		};
	}
	static async compressSignature({ outlines, areContours, thickness, width, height }) {
		let minDiff = Infinity;
		let maxDiff = -Infinity;
		let outlinesLength = 0;
		for (const points of outlines) {
			outlinesLength += points.length;
			for (let i = 2, ii = points.length; i < ii; i++) {
				const dx = points[i] - points[i - 2];
				minDiff = Math.min(minDiff, dx);
				maxDiff = Math.max(maxDiff, dx);
			}
		}
		let bufferType;
		if (minDiff >= -128 && maxDiff <= 127) bufferType = Int8Array;
		else if (minDiff >= -32768 && maxDiff <= 32767) bufferType = Int16Array;
		else bufferType = Int32Array;
		const len = outlines.length;
		const headerLength = BASE_HEADER_LENGTH + POINTS_PROPERTIES_NUMBER * len;
		const header = new Uint32Array(headerLength);
		let offset = 0;
		header[offset++] = headerLength * Uint32Array.BYTES_PER_ELEMENT + (outlinesLength - 2 * len) * bufferType.BYTES_PER_ELEMENT;
		header[offset++] = 0;
		header[offset++] = width;
		header[offset++] = height;
		header[offset++] = areContours ? 0 : 1;
		header[offset++] = Math.max(0, Math.floor(thickness ?? 0));
		header[offset++] = len;
		header[offset++] = bufferType.BYTES_PER_ELEMENT;
		for (const points of outlines) {
			header[offset++] = points.length - 2;
			header[offset++] = points[0];
			header[offset++] = points[1];
		}
		const cs = new CompressionStream("deflate-raw");
		const writer = cs.writable.getWriter();
		await writer.ready;
		writer.write(header);
		const BufferCtor = bufferType.prototype.constructor;
		for (const points of outlines) {
			const diffs = new BufferCtor(points.length - 2);
			for (let i = 2, ii = points.length; i < ii; i++) diffs[i - 2] = points[i] - points[i - 2];
			writer.write(diffs);
		}
		writer.close();
		return (await new Response(cs.readable).bytes()).toBase64();
	}
	static async decompressSignature(signatureData) {
		try {
			const bytes = Uint8Array.fromBase64(signatureData);
			const { readable, writable } = new DecompressionStream("deflate-raw");
			const writer = writable.getWriter();
			await writer.ready;
			writer.write(bytes).then(async () => {
				await writer.ready;
				await writer.close();
			}).catch(() => {});
			let data = null;
			let offset = 0;
			for await (const chunk of readable) {
				data || (data = new Uint8Array(new Uint32Array(chunk.buffer, 0, 4)[0]));
				data.set(chunk, offset);
				offset += chunk.length;
			}
			const header = new Uint32Array(data.buffer, 0, data.length >> 2);
			const version = header[1];
			if (version !== 0) throw new Error(`Invalid version: ${version}`);
			const width = header[2];
			const height = header[3];
			const areContours = header[4] === 0;
			const thickness = header[5];
			const numberOfDrawings = header[6];
			const bufferType = header[7];
			const outlines = [];
			const diffsOffset = (BASE_HEADER_LENGTH + POINTS_PROPERTIES_NUMBER * numberOfDrawings) * Uint32Array.BYTES_PER_ELEMENT;
			let diffs;
			switch (bufferType) {
				case Int8Array.BYTES_PER_ELEMENT:
					diffs = new Int8Array(data.buffer, diffsOffset);
					break;
				case Int16Array.BYTES_PER_ELEMENT:
					diffs = new Int16Array(data.buffer, diffsOffset);
					break;
				case Int32Array.BYTES_PER_ELEMENT:
					diffs = new Int32Array(data.buffer, diffsOffset);
					break;
			}
			offset = 0;
			for (let i = 0; i < numberOfDrawings; i++) {
				const len = header[POINTS_PROPERTIES_NUMBER * i + BASE_HEADER_LENGTH];
				const points = new Float32Array(len + 2);
				outlines.push(points);
				for (let j = 0; j < POINTS_PROPERTIES_NUMBER - 1; j++) points[j] = header[POINTS_PROPERTIES_NUMBER * i + BASE_HEADER_LENGTH + j + 1];
				for (let j = 0; j < len; j++) points[j + 2] = points[j] + diffs[offset++];
			}
			return {
				areContours,
				thickness,
				outlines,
				width,
				height
			};
		} catch (e) {
			warn(`decompressSignature: ${e}`);
			return null;
		}
	}
};
_SignatureExtractor = SignatureExtractor;
function _neighborIndexToId(i0, j0, i, j) {
	i -= i0;
	j -= j0;
	if (i === 0) return j > 0 ? 0 : 4;
	if (i === 1) return j + 6;
	return 2 - j;
}
function _clockwiseNonZero(buf, width, i0, j0, i, j, offset) {
	const id = _assertClassBrand(_SignatureExtractor, this, _neighborIndexToId).call(this, i0, j0, i, j);
	for (let k = 0; k < 8; k++) {
		const kk = (-k + id - offset + 16) % 8;
		const shiftI = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk];
		const shiftJ = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk + 1];
		if (buf[(i0 + shiftI) * width + (j0 + shiftJ)] !== 0) return kk;
	}
	return -1;
}
function _counterClockwiseNonZero(buf, width, i0, j0, i, j, offset) {
	const id = _assertClassBrand(_SignatureExtractor, this, _neighborIndexToId).call(this, i0, j0, i, j);
	for (let k = 0; k < 8; k++) {
		const kk = (k + id + offset + 16) % 8;
		const shiftI = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk];
		const shiftJ = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk + 1];
		if (buf[(i0 + shiftI) * width + (j0 + shiftJ)] !== 0) return kk;
	}
	return -1;
}
function _findContours(buf, width, height, threshold) {
	const N = buf.length;
	const types = new Int32Array(N);
	for (let i = 0; i < N; i++) types[i] = buf[i] <= threshold ? 1 : 0;
	for (let i = 1; i < height - 1; i++) types[i * width] = types[i * width + width - 1] = 0;
	for (let i = 0; i < width; i++) types[i] = types[width * height - 1 - i] = 0;
	let nbd = 1;
	let lnbd;
	const contours = [];
	for (let i = 1; i < height - 1; i++) {
		lnbd = 1;
		for (let j = 1; j < width - 1; j++) {
			const ij = i * width + j;
			const pix = types[ij];
			if (pix === 0) continue;
			let i2 = i;
			let j2 = j;
			if (pix === 1 && types[ij - 1] === 0) {
				nbd += 1;
				j2 -= 1;
			} else if (pix >= 1 && types[ij + 1] === 0) {
				nbd += 1;
				j2 += 1;
				if (pix > 1) lnbd = pix;
			} else {
				if (pix !== 1) lnbd = Math.abs(pix);
				continue;
			}
			const points = [j, i];
			const isHole = j2 === j + 1;
			const contour = {
				isHole,
				points,
				id: nbd,
				parent: 0
			};
			contours.push(contour);
			let contour0;
			for (const c of contours) if (c.id === lnbd) {
				contour0 = c;
				break;
			}
			if (!contour0) contour.parent = isHole ? lnbd : 0;
			else if (contour0.isHole) contour.parent = isHole ? contour0.parent : lnbd;
			else contour.parent = isHole ? lnbd : contour0.parent;
			const k = _assertClassBrand(_SignatureExtractor, this, _clockwiseNonZero).call(this, types, width, i, j, i2, j2, 0);
			if (k === -1) {
				types[ij] = -nbd;
				if (types[ij] !== 1) lnbd = Math.abs(types[ij]);
				continue;
			}
			let shiftI = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * k];
			let shiftJ = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * k + 1];
			const i1 = i + shiftI;
			const j1 = j + shiftJ;
			i2 = i1;
			j2 = j1;
			let i3 = i;
			let j3 = j;
			while (true) {
				const kk = _assertClassBrand(_SignatureExtractor, this, _counterClockwiseNonZero).call(this, types, width, i3, j3, i2, j2, 1);
				shiftI = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk];
				shiftJ = _assertClassBrand(_SignatureExtractor, this, _neighborIdToIndex)._[2 * kk + 1];
				const i4 = i3 + shiftI;
				const j4 = j3 + shiftJ;
				points.push(j4, i4);
				const ij3 = i3 * width + j3;
				if (types[ij3 + 1] === 0) types[ij3] = -nbd;
				else if (types[ij3] === 1) types[ij3] = nbd;
				if (i4 === i && j4 === j && i3 === i1 && j3 === j1) {
					if (types[ij] !== 1) lnbd = Math.abs(types[ij]);
					break;
				} else {
					i2 = i3;
					j2 = j3;
					i3 = i4;
					j3 = j4;
				}
			}
		}
	}
	return contours;
}
function _douglasPeuckerHelper(points, start, end, output) {
	if (end - start <= 4) {
		for (let i = start; i < end - 2; i += 2) output.push(points[i], points[i + 1]);
		return;
	}
	const ax = points[start];
	const ay = points[start + 1];
	const abx = points[end - 4] - ax;
	const aby = points[end - 3] - ay;
	const dist = Math.hypot(abx, aby);
	const nabx = abx / dist;
	const naby = aby / dist;
	const aa = nabx * ay - naby * ax;
	const m = aby / abx;
	const invS = 1 / dist;
	const phi = Math.atan(m);
	const cosPhi = Math.cos(phi);
	const sinPhi = Math.sin(phi);
	const tmax = invS * (Math.abs(cosPhi) + Math.abs(sinPhi));
	const poly = invS * (1 - tmax + tmax ** 2);
	const partialPhi = Math.max(Math.atan(Math.abs(sinPhi + cosPhi) * poly), Math.atan(Math.abs(sinPhi - cosPhi) * poly));
	let dmax = 0;
	let index = start;
	for (let i = start + 2; i < end - 2; i += 2) {
		const d = Math.abs(aa - nabx * points[i + 1] + naby * points[i]);
		if (d > dmax) {
			index = i;
			dmax = d;
		}
	}
	if (dmax > (dist * partialPhi) ** 2) {
		_assertClassBrand(_SignatureExtractor, this, _douglasPeuckerHelper).call(this, points, start, index + 2, output);
		_assertClassBrand(_SignatureExtractor, this, _douglasPeuckerHelper).call(this, points, index, end, output);
	} else output.push(ax, ay);
}
function _douglasPeucker(points) {
	const output = [];
	const len = points.length;
	_assertClassBrand(_SignatureExtractor, this, _douglasPeuckerHelper).call(this, points, 0, len, output);
	output.push(points[len - 2], points[len - 1]);
	return output.length <= 4 ? null : output;
}
function _bilateralFilter(buf, width, height, sigmaS, sigmaR, kernelSize) {
	const kernel = new Float32Array(kernelSize ** 2);
	const sigmaS2 = -2 * sigmaS ** 2;
	const halfSize = kernelSize >> 1;
	for (let i = 0; i < kernelSize; i++) {
		const x = (i - halfSize) ** 2;
		for (let j = 0; j < kernelSize; j++) kernel[i * kernelSize + j] = Math.exp((x + (j - halfSize) ** 2) / sigmaS2);
	}
	const rangeValues = /* @__PURE__ */ new Float32Array(256);
	const sigmaR2 = -2 * sigmaR ** 2;
	for (let i = 0; i < 256; i++) rangeValues[i] = Math.exp(i ** 2 / sigmaR2);
	const N = buf.length;
	const out = new Uint8Array(N);
	const histogram = /* @__PURE__ */ new Uint32Array(256);
	for (let i = 0; i < height; i++) for (let j = 0; j < width; j++) {
		const ij = i * width + j;
		const center = buf[ij];
		let sum = 0;
		let norm = 0;
		for (let k = 0; k < kernelSize; k++) {
			const y = i + k - halfSize;
			if (y < 0 || y >= height) continue;
			for (let l = 0; l < kernelSize; l++) {
				const x = j + l - halfSize;
				if (x < 0 || x >= width) continue;
				const neighbour = buf[y * width + x];
				const w = kernel[k * kernelSize + l] * rangeValues[Math.abs(neighbour - center)];
				sum += neighbour * w;
				norm += w;
			}
		}
		const pix = out[ij] = Math.round(sum / norm);
		histogram[pix]++;
	}
	return [out, histogram];
}
function _getHistogram(buf) {
	const histogram = /* @__PURE__ */ new Uint32Array(256);
	for (const g of buf) histogram[g]++;
	return histogram;
}
function _toUint(buf) {
	const N = buf.length;
	const out = new Uint8ClampedArray(N >> 2);
	let max = -Infinity;
	let min = Infinity;
	for (let i = 0, ii = out.length; i < ii; i++) {
		const pix = out[i] = buf[i << 2];
		max = Math.max(max, pix);
		min = Math.min(min, pix);
	}
	const ratio = 255 / (max - min);
	for (let i = 0, ii = out.length; i < ii; i++) out[i] = (out[i] - min) * ratio;
	return out;
}
function _guessThreshold(histogram) {
	let i;
	let M = -Infinity;
	let L = -Infinity;
	const min = histogram.findIndex((v) => v !== 0);
	let pos = min;
	let spos = min;
	for (i = min; i < 256; i++) {
		const v = histogram[i];
		if (v > M) {
			if (i - pos > L) {
				L = i - pos;
				spos = i - 1;
			}
			M = v;
			pos = i;
		}
	}
	for (i = spos - 1; i >= 0; i--) if (histogram[i] > histogram[i + 1]) break;
	return i;
}
function _getGrayPixels(bitmap) {
	const originalBitmap = bitmap;
	const { width, height } = bitmap;
	const { maxDim } = _assertClassBrand(_SignatureExtractor, this, _PARAMETERS)._;
	let newWidth = width;
	let newHeight = height;
	if (width > maxDim || height > maxDim) {
		let prevWidth = width;
		let prevHeight = height;
		let steps = Math.log2(Math.max(width, height) / maxDim);
		const isteps = Math.floor(steps);
		steps = steps === isteps ? isteps - 1 : isteps;
		for (let i = 0; i < steps; i++) {
			newWidth = Math.ceil(prevWidth / 2);
			newHeight = Math.ceil(prevHeight / 2);
			const offscreen = new OffscreenCanvas(newWidth, newHeight);
			offscreen.getContext("2d").drawImage(bitmap, 0, 0, prevWidth, prevHeight, 0, 0, newWidth, newHeight);
			prevWidth = newWidth;
			prevHeight = newHeight;
			if (bitmap !== originalBitmap) bitmap.close();
			bitmap = offscreen.transferToImageBitmap();
		}
		const ratio = Math.min(maxDim / newWidth, maxDim / newHeight);
		newWidth = Math.round(newWidth * ratio);
		newHeight = Math.round(newHeight * ratio);
	}
	const ctx = new OffscreenCanvas(newWidth, newHeight).getContext("2d", { willReadFrequently: true });
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, newWidth, newHeight);
	ctx.filter = "grayscale(1)";
	ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newWidth, newHeight);
	const grayImage = ctx.getImageData(0, 0, newWidth, newHeight).data;
	return [
		_assertClassBrand(_SignatureExtractor, this, _toUint).call(this, grayImage),
		newWidth,
		newHeight
	];
}
var _PARAMETERS = { _: {
	maxDim: 512,
	sigmaSFactor: .02,
	sigmaR: 25,
	kernelSize: 16
} };
var _neighborIdToIndex = { _: new Int32Array([
	0,
	1,
	-1,
	1,
	-1,
	0,
	-1,
	-1,
	0,
	-1,
	1,
	-1,
	1,
	0,
	1,
	1
]) };
var SignatureOptions = class SignatureOptions extends DrawingOptions {
	constructor() {
		super();
		super.updateProperties({
			fill: AnnotationEditor._defaultLineColor,
			"stroke-width": 0
		});
	}
	clone() {
		const clone = new SignatureOptions();
		clone.updateAll(this);
		return clone;
	}
};
var DrawnSignatureOptions = class DrawnSignatureOptions extends InkDrawingOptions {
	constructor(viewerParameters) {
		super(viewerParameters);
		super.updateProperties({
			stroke: AnnotationEditor._defaultLineColor,
			"stroke-width": 1
		});
	}
	clone() {
		const clone = new DrawnSignatureOptions(this._viewParameters);
		clone.updateAll(this);
		return clone;
	}
};
var _isExtracted = /* @__PURE__ */ new WeakMap();
var _description = /* @__PURE__ */ new WeakMap();
var _signatureData = /* @__PURE__ */ new WeakMap();
var _signatureUUID = /* @__PURE__ */ new WeakMap();
var SignatureEditor = class SignatureEditor extends DrawingEditor {
	constructor(params) {
		super({
			...params,
			mustBeCommitted: true,
			name: "signatureEditor"
		});
		_classPrivateFieldInitSpec(this, _isExtracted, false);
		_classPrivateFieldInitSpec(this, _description, null);
		_classPrivateFieldInitSpec(this, _signatureData, null);
		_classPrivateFieldInitSpec(this, _signatureUUID, null);
		this._willKeepAspectRatio = true;
		_classPrivateFieldSet2(_signatureData, this, params.signatureData || null);
		_classPrivateFieldSet2(_description, this, null);
		this.defaultL10nId = "pdfjs-editor-signature-editor1";
	}
	static initialize(l10n, uiManager) {
		AnnotationEditor.initialize(l10n, uiManager);
		this._defaultDrawingOptions = new SignatureOptions();
		this._defaultDrawnSignatureOptions = new DrawnSignatureOptions(uiManager.viewParameters);
	}
	static getDefaultDrawingOptions(options) {
		const clone = this._defaultDrawingOptions.clone();
		clone.updateProperties(options);
		return clone;
	}
	static get supportMultipleDrawings() {
		return false;
	}
	static get typesMap() {
		return shadow(this, "typesMap", /* @__PURE__ */ new Map());
	}
	static get isDrawer() {
		return false;
	}
	get telemetryFinalData() {
		return {
			type: "signature",
			hasDescription: !!_classPrivateFieldGet2(_description, this)
		};
	}
	static computeTelemetryFinalData(data) {
		const hasDescriptionStats = data.get("hasDescription");
		return {
			hasAltText: hasDescriptionStats.get(true) ?? 0,
			hasNoAltText: hasDescriptionStats.get(false) ?? 0
		};
	}
	get isResizable() {
		return true;
	}
	onScaleChanging() {
		if (this._drawId === null) return;
		super.onScaleChanging();
	}
	render() {
		if (this.div) return this.div;
		let baseX, baseY;
		const { _isCopy } = this;
		if (_isCopy) {
			this._isCopy = false;
			baseX = this.x;
			baseY = this.y;
		}
		super.render();
		if (this._drawId === null) if (_classPrivateFieldGet2(_signatureData, this)) {
			const { lines, mustSmooth, areContours, description, uuid, heightInPage } = _classPrivateFieldGet2(_signatureData, this);
			const { rawDims: { pageWidth, pageHeight }, rotation } = this.parent.viewport;
			const outline = SignatureExtractor.processDrawnLines({
				lines,
				pageWidth,
				pageHeight,
				rotation,
				innerMargin: SignatureEditor._INNER_MARGIN,
				mustSmooth,
				areContours
			});
			this.addSignature(outline, heightInPage, description, uuid);
		} else {
			this.div.setAttribute("data-l10n-args", JSON.stringify({ description: "" }));
			this.div.hidden = true;
			this._uiManager.getSignature(this);
		}
		else this.div.setAttribute("data-l10n-args", JSON.stringify({ description: _classPrivateFieldGet2(_description, this) || "" }));
		if (_isCopy) {
			this._isCopy = true;
			this._moveAfterPaste(baseX, baseY);
		}
		return this.div;
	}
	setUuid(uuid) {
		_classPrivateFieldSet2(_signatureUUID, this, uuid);
		this.addEditToolbar();
	}
	getUuid() {
		return _classPrivateFieldGet2(_signatureUUID, this);
	}
	get description() {
		return _classPrivateFieldGet2(_description, this);
	}
	set description(description) {
		_classPrivateFieldSet2(_description, this, description);
		if (!this.div) return;
		this.div.setAttribute("data-l10n-args", JSON.stringify({ description }));
		super.addEditToolbar().then((toolbar) => {
			toolbar?.updateEditSignatureButton(description);
		});
	}
	getSignaturePreview() {
		const { newCurves, areContours, thickness, width, height } = _classPrivateFieldGet2(_signatureData, this);
		const maxDim = Math.max(width, height);
		return {
			areContours,
			outline: SignatureExtractor.processDrawnLines({
				lines: {
					curves: newCurves.map((points) => ({ points })),
					thickness,
					width,
					height
				},
				pageWidth: maxDim,
				pageHeight: maxDim,
				rotation: 0,
				innerMargin: 0,
				mustSmooth: false,
				areContours
			}).outline
		};
	}
	get toolbarButtons() {
		if (this._uiManager.signatureManager) return [["editSignature", this._uiManager.signatureManager]];
		return super.toolbarButtons;
	}
	addSignature(data, heightInPage, description, uuid) {
		const { x: savedX, y: savedY } = this;
		const { outline } = _classPrivateFieldSet2(_signatureData, this, data);
		_classPrivateFieldSet2(_isExtracted, this, outline instanceof ContourDrawOutline);
		this.description = description;
		let drawingOptions;
		if (_classPrivateFieldGet2(_isExtracted, this)) drawingOptions = SignatureEditor.getDefaultDrawingOptions();
		else {
			drawingOptions = SignatureEditor._defaultDrawnSignatureOptions.clone();
			drawingOptions.updateProperties({ "stroke-width": outline.thickness });
		}
		this._addOutlines({
			drawOutlines: outline,
			drawingOptions
		});
		const [, pageHeight] = this.pageDimensions;
		let newHeight = heightInPage / pageHeight;
		newHeight = newHeight >= 1 ? .5 : newHeight;
		this.width *= newHeight / this.height;
		if (this.width >= 1) {
			newHeight *= .9 / this.width;
			this.width = .9;
		}
		this.height = newHeight;
		this.setDims();
		this.x = savedX;
		this.y = savedY;
		this.center();
		this._onResized();
		this.onScaleChanging();
		this.rotate();
		this._uiManager.addToAnnotationStorage(this);
		this.setUuid(uuid);
		this._reportTelemetry({
			action: "pdfjs.signature.inserted",
			data: {
				hasBeenSaved: !!uuid,
				hasDescription: !!description
			}
		});
		this.div.hidden = false;
	}
	getFromImage(bitmap) {
		const { rawDims: { pageWidth, pageHeight }, rotation } = this.parent.viewport;
		return SignatureExtractor.process(bitmap, pageWidth, pageHeight, rotation, SignatureEditor._INNER_MARGIN);
	}
	getFromText(text, fontInfo) {
		const { rawDims: { pageWidth, pageHeight }, rotation } = this.parent.viewport;
		return SignatureExtractor.extractContoursFromText(text, fontInfo, pageWidth, pageHeight, rotation, SignatureEditor._INNER_MARGIN);
	}
	getDrawnSignature(curves) {
		const { rawDims: { pageWidth, pageHeight }, rotation } = this.parent.viewport;
		return SignatureExtractor.processDrawnLines({
			lines: curves,
			pageWidth,
			pageHeight,
			rotation,
			innerMargin: SignatureEditor._INNER_MARGIN,
			mustSmooth: false,
			areContours: false
		});
	}
	createDrawingOptions({ areContours, thickness }) {
		if (areContours) this._drawingOptions = SignatureEditor.getDefaultDrawingOptions();
		else {
			this._drawingOptions = SignatureEditor._defaultDrawnSignatureOptions.clone();
			this._drawingOptions.updateProperties({ "stroke-width": thickness });
		}
	}
	serialize(isForCopying = false) {
		if (this.isEmpty()) return null;
		const { lines, points } = this.serializeDraw(isForCopying);
		const { _drawingOptions: { "stroke-width": thickness } } = this;
		const serialized = Object.assign(super.serialize(isForCopying), {
			isSignature: true,
			areContours: _classPrivateFieldGet2(_isExtracted, this),
			color: [
				0,
				0,
				0
			],
			thickness: _classPrivateFieldGet2(_isExtracted, this) ? 0 : thickness
		});
		this.addComment(serialized);
		if (isForCopying) {
			serialized.paths = {
				lines,
				points
			};
			serialized.uuid = _classPrivateFieldGet2(_signatureUUID, this);
			serialized.isCopy = true;
		} else serialized.lines = lines;
		if (_classPrivateFieldGet2(_description, this)) serialized.accessibilityData = {
			type: "Figure",
			alt: _classPrivateFieldGet2(_description, this)
		};
		return serialized;
	}
	static deserializeDraw(pageX, pageY, pageWidth, pageHeight, innerMargin, data) {
		if (data.areContours) return ContourDrawOutline.deserialize(pageX, pageY, pageWidth, pageHeight, innerMargin, data);
		return InkDrawOutline.deserialize(pageX, pageY, pageWidth, pageHeight, innerMargin, data);
	}
	static async deserialize(data, parent, uiManager) {
		const editor = await super.deserialize(data, parent, uiManager);
		_classPrivateFieldSet2(_isExtracted, editor, data.areContours);
		editor.description = data.accessibilityData?.alt || "";
		_classPrivateFieldSet2(_signatureUUID, editor, data.uuid);
		return editor;
	}
};
_defineProperty(SignatureEditor, "_type", "signature");
_defineProperty(SignatureEditor, "_editorType", AnnotationEditorType.SIGNATURE);
_defineProperty(SignatureEditor, "_defaultDrawingOptions", null);
var _bitmap = /* @__PURE__ */ new WeakMap();
var _bitmapId = /* @__PURE__ */ new WeakMap();
var _bitmapPromise = /* @__PURE__ */ new WeakMap();
var _bitmapUrl = /* @__PURE__ */ new WeakMap();
var _bitmapFile = /* @__PURE__ */ new WeakMap();
var _bitmapFileName = /* @__PURE__ */ new WeakMap();
var _canvas = /* @__PURE__ */ new WeakMap();
var _missingCanvas = /* @__PURE__ */ new WeakMap();
var _resizeTimeoutId = /* @__PURE__ */ new WeakMap();
var _isSvg = /* @__PURE__ */ new WeakMap();
var _hasBeenAddedInUndoStack = /* @__PURE__ */ new WeakMap();
var _StampEditor_brand = /* @__PURE__ */ new WeakSet();
var StampEditor = class extends AnnotationEditor {
	constructor(params) {
		super({
			...params,
			name: "stampEditor"
		});
		_classPrivateMethodInitSpec(this, _StampEditor_brand);
		_classPrivateFieldInitSpec(this, _bitmap, null);
		_classPrivateFieldInitSpec(this, _bitmapId, null);
		_classPrivateFieldInitSpec(this, _bitmapPromise, null);
		_classPrivateFieldInitSpec(this, _bitmapUrl, null);
		_classPrivateFieldInitSpec(this, _bitmapFile, null);
		_classPrivateFieldInitSpec(this, _bitmapFileName, "");
		_classPrivateFieldInitSpec(this, _canvas, null);
		_classPrivateFieldInitSpec(this, _missingCanvas, false);
		_classPrivateFieldInitSpec(this, _resizeTimeoutId, null);
		_classPrivateFieldInitSpec(this, _isSvg, false);
		_classPrivateFieldInitSpec(this, _hasBeenAddedInUndoStack, false);
		_classPrivateFieldSet2(_bitmapUrl, this, params.bitmapUrl);
		_classPrivateFieldSet2(_bitmapFile, this, params.bitmapFile);
		this.defaultL10nId = "pdfjs-editor-stamp-editor";
	}
	static initialize(l10n, uiManager) {
		AnnotationEditor.initialize(l10n, uiManager);
	}
	static isHandlingMimeForPasting(mime) {
		return SupportedImageMimeTypes.includes(mime);
	}
	static paste(item, parent) {
		parent.pasteEditor({ mode: AnnotationEditorType.STAMP }, { bitmapFile: item.getAsFile() });
	}
	altTextFinish() {
		if (this._uiManager.useNewAltTextFlow) this.div.hidden = false;
		super.altTextFinish();
	}
	get telemetryFinalData() {
		return {
			type: "stamp",
			hasAltText: !!this.altTextData?.altText
		};
	}
	static computeTelemetryFinalData(data) {
		const hasAltTextStats = data.get("hasAltText");
		return {
			hasAltText: hasAltTextStats.get(true) ?? 0,
			hasNoAltText: hasAltTextStats.get(false) ?? 0
		};
	}
	async mlGuessAltText(imageData = null, updateAltTextData = true) {
		if (this.hasAltTextData()) return null;
		const { mlManager } = this._uiManager;
		if (!mlManager) throw new Error("No ML.");
		if (!await mlManager.isEnabledFor("altText")) throw new Error("ML isn't enabled for alt text.");
		const { data, width, height } = imageData || this.copyCanvas(null, null, true).imageData;
		const response = await mlManager.guess({
			name: "altText",
			request: {
				data,
				width,
				height,
				channels: data.length / (width * height)
			}
		});
		if (!response) throw new Error("No response from the AI service.");
		if (response.error) throw new Error("Error from the AI service.");
		if (response.cancel) return null;
		if (!response.output) throw new Error("No valid response from the AI service.");
		const altText = response.output;
		await this.setGuessedAltText(altText);
		if (updateAltTextData && !this.hasAltTextData()) this.altTextData = {
			alt: altText,
			decorative: false
		};
		return altText;
	}
	remove() {
		if (_classPrivateFieldGet2(_bitmapId, this)) {
			_classPrivateFieldSet2(_bitmap, this, null);
			this._uiManager.imageManager.deleteId(_classPrivateFieldGet2(_bitmapId, this));
			_classPrivateFieldGet2(_canvas, this)?.remove();
			_classPrivateFieldSet2(_canvas, this, null);
			if (_classPrivateFieldGet2(_resizeTimeoutId, this)) {
				clearTimeout(_classPrivateFieldGet2(_resizeTimeoutId, this));
				_classPrivateFieldSet2(_resizeTimeoutId, this, null);
			}
		}
		super.remove();
	}
	rebuild() {
		if (!this.parent) {
			if (_classPrivateFieldGet2(_bitmapId, this)) _assertClassBrand(_StampEditor_brand, this, _getBitmap).call(this);
			return;
		}
		super.rebuild();
		if (this.div === null) return;
		if (_classPrivateFieldGet2(_bitmapId, this) && _classPrivateFieldGet2(_canvas, this) === null) _assertClassBrand(_StampEditor_brand, this, _getBitmap).call(this);
		if (!this.isAttachedToDOM) this.parent.add(this);
	}
	onceAdded(focus) {
		this._isDraggable = true;
		if (focus) this.div.focus();
	}
	isEmpty() {
		return !(_classPrivateFieldGet2(_bitmapPromise, this) || _classPrivateFieldGet2(_bitmap, this) || _classPrivateFieldGet2(_bitmapUrl, this) || _classPrivateFieldGet2(_bitmapFile, this) || _classPrivateFieldGet2(_bitmapId, this) || _classPrivateFieldGet2(_missingCanvas, this));
	}
	get toolbarButtons() {
		return [["altText", this.createAltText()]];
	}
	get isResizable() {
		return true;
	}
	render() {
		if (this.div) return this.div;
		let baseX, baseY;
		if (this._isCopy) {
			baseX = this.x;
			baseY = this.y;
		}
		super.render();
		this.div.hidden = true;
		this.createAltText();
		if (!_classPrivateFieldGet2(_missingCanvas, this)) if (_classPrivateFieldGet2(_bitmap, this)) _assertClassBrand(_StampEditor_brand, this, _createCanvas).call(this);
		else _assertClassBrand(_StampEditor_brand, this, _getBitmap).call(this);
		if (this._isCopy) this._moveAfterPaste(baseX, baseY);
		this._uiManager.addShouldRescale(this);
		return this.div;
	}
	setCanvas(annotationElementId, canvas) {
		const { id: bitmapId, bitmap } = this._uiManager.imageManager.getFromCanvas(annotationElementId, canvas);
		canvas.remove();
		if (bitmapId && this._uiManager.imageManager.isValidId(bitmapId)) {
			_classPrivateFieldSet2(_bitmapId, this, bitmapId);
			if (bitmap) _classPrivateFieldSet2(_bitmap, this, bitmap);
			_classPrivateFieldSet2(_missingCanvas, this, false);
			_assertClassBrand(_StampEditor_brand, this, _createCanvas).call(this);
		}
	}
	_onResized() {
		this.onScaleChanging();
	}
	onScaleChanging() {
		if (!this.parent) return;
		if (_classPrivateFieldGet2(_resizeTimeoutId, this) !== null) clearTimeout(_classPrivateFieldGet2(_resizeTimeoutId, this));
		_classPrivateFieldSet2(_resizeTimeoutId, this, setTimeout(() => {
			_classPrivateFieldSet2(_resizeTimeoutId, this, null);
			_assertClassBrand(_StampEditor_brand, this, _drawBitmap).call(this);
		}, 200));
	}
	copyCanvas(maxDataDimension, maxPreviewDimension, createImageData = false) {
		if (!maxDataDimension) maxDataDimension = 224;
		const { width: bitmapWidth, height: bitmapHeight } = _classPrivateFieldGet2(_bitmap, this);
		const outputScale = new OutputScale();
		let bitmap = _classPrivateFieldGet2(_bitmap, this);
		let width = bitmapWidth, height = bitmapHeight;
		let canvas = null;
		if (maxPreviewDimension) {
			if (bitmapWidth > maxPreviewDimension || bitmapHeight > maxPreviewDimension) {
				const ratio = Math.min(maxPreviewDimension / bitmapWidth, maxPreviewDimension / bitmapHeight);
				width = Math.floor(bitmapWidth * ratio);
				height = Math.floor(bitmapHeight * ratio);
			}
			canvas = document.createElement("canvas");
			const scaledWidth = canvas.width = Math.ceil(width * outputScale.sx);
			const scaledHeight = canvas.height = Math.ceil(height * outputScale.sy);
			if (!_classPrivateFieldGet2(_isSvg, this)) bitmap = _assertClassBrand(_StampEditor_brand, this, _scaleBitmap).call(this, scaledWidth, scaledHeight);
			const ctx = canvas.getContext("2d");
			ctx.filter = this._uiManager.hcmFilter;
			let white = "white", black = "#cfcfd8";
			if (this._uiManager.hcmFilter !== "none") black = "black";
			else if (ColorScheme.isDarkMode) {
				white = "#8f8f9d";
				black = "#42414d";
			}
			const boxDim = 15;
			const boxDimWidth = boxDim * outputScale.sx;
			const boxDimHeight = boxDim * outputScale.sy;
			const pattern = new OffscreenCanvas(boxDimWidth * 2, boxDimHeight * 2);
			const patternCtx = pattern.getContext("2d");
			patternCtx.fillStyle = white;
			patternCtx.fillRect(0, 0, boxDimWidth * 2, boxDimHeight * 2);
			patternCtx.fillStyle = black;
			patternCtx.fillRect(0, 0, boxDimWidth, boxDimHeight);
			patternCtx.fillRect(boxDimWidth, boxDimHeight, boxDimWidth, boxDimHeight);
			ctx.fillStyle = ctx.createPattern(pattern, "repeat");
			ctx.fillRect(0, 0, scaledWidth, scaledHeight);
			ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, scaledWidth, scaledHeight);
		}
		let imageData = null;
		if (createImageData) {
			let dataWidth, dataHeight;
			if (outputScale.symmetric && bitmap.width < maxDataDimension && bitmap.height < maxDataDimension) {
				dataWidth = bitmap.width;
				dataHeight = bitmap.height;
			} else {
				bitmap = _classPrivateFieldGet2(_bitmap, this);
				if (bitmapWidth > maxDataDimension || bitmapHeight > maxDataDimension) {
					const ratio = Math.min(maxDataDimension / bitmapWidth, maxDataDimension / bitmapHeight);
					dataWidth = Math.floor(bitmapWidth * ratio);
					dataHeight = Math.floor(bitmapHeight * ratio);
					if (!_classPrivateFieldGet2(_isSvg, this)) bitmap = _assertClassBrand(_StampEditor_brand, this, _scaleBitmap).call(this, dataWidth, dataHeight);
				}
			}
			const offscreenCtx = new OffscreenCanvas(dataWidth, dataHeight).getContext("2d", { willReadFrequently: true });
			offscreenCtx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, dataWidth, dataHeight);
			imageData = {
				width: dataWidth,
				height: dataHeight,
				data: offscreenCtx.getImageData(0, 0, dataWidth, dataHeight).data
			};
		}
		return {
			canvas,
			width,
			height,
			imageData
		};
	}
	static async deserialize(data, parent, uiManager) {
		let initialData = null;
		let missingCanvas = false;
		if (data instanceof StampAnnotationElement) {
			const { data: { rect, rotation, id, structParent, popupRef, richText, contentsObj, creationDate, modificationDate }, container, parent: { page: { pageNumber } }, canvas } = data;
			let bitmapId, bitmap;
			if (canvas) {
				delete data.canvas;
				({id: bitmapId, bitmap} = uiManager.imageManager.getFromCanvas(container.id, canvas));
				canvas.remove();
			} else {
				missingCanvas = true;
				data._hasNoCanvas = true;
			}
			const altText = (await parent._structTree.getAriaAttributes(`${AnnotationPrefix}${id}`))?.get("aria-label") || "";
			initialData = data = {
				annotationType: AnnotationEditorType.STAMP,
				bitmapId,
				bitmap,
				pageIndex: pageNumber - 1,
				rect: rect.slice(0),
				rotation,
				annotationElementId: id,
				id,
				deleted: false,
				accessibilityData: {
					decorative: false,
					altText
				},
				isSvg: false,
				structParent,
				popupRef,
				richText,
				comment: contentsObj?.str || null,
				creationDate,
				modificationDate
			};
		}
		const editor = await super.deserialize(data, parent, uiManager);
		const { rect, bitmap, bitmapUrl, bitmapId, isSvg, accessibilityData } = data;
		if (missingCanvas) {
			uiManager.addMissingCanvas(data.id, editor);
			_classPrivateFieldSet2(_missingCanvas, editor, true);
		} else if (bitmapId && uiManager.imageManager.isValidId(bitmapId)) {
			_classPrivateFieldSet2(_bitmapId, editor, bitmapId);
			if (bitmap) _classPrivateFieldSet2(_bitmap, editor, bitmap);
		} else _classPrivateFieldSet2(_bitmapUrl, editor, bitmapUrl);
		_classPrivateFieldSet2(_isSvg, editor, isSvg);
		const [parentWidth, parentHeight] = editor.pageDimensions;
		editor.width = (rect[2] - rect[0]) / parentWidth;
		editor.height = (rect[3] - rect[1]) / parentHeight;
		if (accessibilityData) editor.altTextData = accessibilityData;
		editor._initialData = initialData;
		if (data.comment) editor.setCommentData(data);
		_classPrivateFieldSet2(_hasBeenAddedInUndoStack, editor, !!initialData);
		return editor;
	}
	serialize(isForCopying = false, context = null) {
		if (this.isEmpty()) return null;
		if (this.deleted) return this.serializeDeleted();
		const serialized = Object.assign(super.serialize(isForCopying), {
			bitmapId: _classPrivateFieldGet2(_bitmapId, this),
			isSvg: _classPrivateFieldGet2(_isSvg, this)
		});
		this.addComment(serialized);
		if (isForCopying) {
			serialized.bitmapUrl = _assertClassBrand(_StampEditor_brand, this, _serializeBitmap).call(this, true);
			serialized.accessibilityData = this.serializeAltText(true);
			serialized.isCopy = true;
			return serialized;
		}
		const { decorative, altText } = this.serializeAltText(false);
		if (!decorative && altText) serialized.accessibilityData = {
			type: "Figure",
			alt: altText
		};
		if (this.annotationElementId) {
			const changes = _assertClassBrand(_StampEditor_brand, this, _hasElementChanged4).call(this, serialized);
			if (changes.isSame) return null;
			if (changes.isSameAltText) delete serialized.accessibilityData;
			else serialized.accessibilityData.structParent = this._initialData.structParent ?? -1;
			serialized.id = this.annotationElementId;
			delete serialized.bitmapId;
			return serialized;
		}
		if (context === null) return serialized;
		context.stamps || (context.stamps = /* @__PURE__ */ new Map());
		const area = _classPrivateFieldGet2(_isSvg, this) ? (serialized.rect[2] - serialized.rect[0]) * (serialized.rect[3] - serialized.rect[1]) : null;
		if (!context.stamps.has(_classPrivateFieldGet2(_bitmapId, this))) {
			context.stamps.set(_classPrivateFieldGet2(_bitmapId, this), {
				area,
				serialized
			});
			serialized.bitmap = _assertClassBrand(_StampEditor_brand, this, _serializeBitmap).call(this, false);
		} else if (_classPrivateFieldGet2(_isSvg, this)) {
			const prevData = context.stamps.get(_classPrivateFieldGet2(_bitmapId, this));
			if (area > prevData.area) {
				prevData.area = area;
				prevData.serialized.bitmap.close();
				prevData.serialized.bitmap = _assertClassBrand(_StampEditor_brand, this, _serializeBitmap).call(this, false);
			}
		}
		return serialized;
	}
	renderAnnotationElement(annotation) {
		if (this.deleted) {
			annotation.hide();
			return null;
		}
		annotation.updateEdited({
			rect: this.getPDFRect(),
			popup: this.comment
		});
		return null;
	}
};
function _getBitmapFetched(data, fromId = false) {
	if (!data) {
		this.remove();
		return;
	}
	_classPrivateFieldSet2(_bitmap, this, data.bitmap);
	if (!fromId) {
		_classPrivateFieldSet2(_bitmapId, this, data.id);
		_classPrivateFieldSet2(_isSvg, this, data.isSvg);
	}
	if (data.file) _classPrivateFieldSet2(_bitmapFileName, this, data.file.name);
	_assertClassBrand(_StampEditor_brand, this, _createCanvas).call(this);
}
function _getBitmapDone() {
	_classPrivateFieldSet2(_bitmapPromise, this, null);
	this._uiManager.enableWaiting(false);
	if (!_classPrivateFieldGet2(_canvas, this)) return;
	if (this._uiManager.useNewAltTextWhenAddingImage && this._uiManager.useNewAltTextFlow && _classPrivateFieldGet2(_bitmap, this)) {
		this.addEditToolbar().then(() => {
			this._editToolbar.hide();
			this._uiManager.editAltText(this, true);
		});
		return;
	}
	if (!this._uiManager.useNewAltTextWhenAddingImage && this._uiManager.useNewAltTextFlow && _classPrivateFieldGet2(_bitmap, this)) {
		this._reportTelemetry({
			action: "pdfjs.image.image_added",
			data: {
				alt_text_modal: false,
				alt_text_type: "empty"
			}
		});
		try {
			this.mlGuessAltText();
		} catch {}
	}
	this.div.focus();
}
function _getBitmap() {
	if (_classPrivateFieldGet2(_bitmapId, this)) {
		this._uiManager.enableWaiting(true);
		this._uiManager.imageManager.getFromId(_classPrivateFieldGet2(_bitmapId, this)).then((data) => _assertClassBrand(_StampEditor_brand, this, _getBitmapFetched).call(this, data, true)).finally(() => _assertClassBrand(_StampEditor_brand, this, _getBitmapDone).call(this));
		return;
	}
	if (_classPrivateFieldGet2(_bitmapUrl, this)) {
		const url = _classPrivateFieldGet2(_bitmapUrl, this);
		_classPrivateFieldSet2(_bitmapUrl, this, null);
		this._uiManager.enableWaiting(true);
		_classPrivateFieldSet2(_bitmapPromise, this, this._uiManager.imageManager.getFromUrl(url).then((data) => _assertClassBrand(_StampEditor_brand, this, _getBitmapFetched).call(this, data)).finally(() => _assertClassBrand(_StampEditor_brand, this, _getBitmapDone).call(this)));
		return;
	}
	if (_classPrivateFieldGet2(_bitmapFile, this)) {
		const file = _classPrivateFieldGet2(_bitmapFile, this);
		_classPrivateFieldSet2(_bitmapFile, this, null);
		this._uiManager.enableWaiting(true);
		_classPrivateFieldSet2(_bitmapPromise, this, this._uiManager.imageManager.getFromFile(file).then((data) => _assertClassBrand(_StampEditor_brand, this, _getBitmapFetched).call(this, data)).finally(() => _assertClassBrand(_StampEditor_brand, this, _getBitmapDone).call(this)));
		return;
	}
	const input = document.createElement("input");
	input.type = "file";
	input.accept = SupportedImageMimeTypes.join(",");
	const signal = this._uiManager._signal;
	_classPrivateFieldSet2(_bitmapPromise, this, new Promise((resolve) => {
		input.addEventListener("change", async () => {
			if (!input.files || input.files.length === 0) this.remove();
			else {
				this._uiManager.enableWaiting(true);
				const data = await this._uiManager.imageManager.getFromFile(input.files[0]);
				this._reportTelemetry({
					action: "pdfjs.image.image_selected",
					data: { alt_text_modal: this._uiManager.useNewAltTextFlow }
				});
				_assertClassBrand(_StampEditor_brand, this, _getBitmapFetched).call(this, data);
			}
			resolve();
		}, { signal });
		input.addEventListener("cancel", () => {
			this.remove();
			resolve();
		}, { signal });
	}).finally(() => _assertClassBrand(_StampEditor_brand, this, _getBitmapDone).call(this)));
	input.click();
}
function _createCanvas() {
	const { div } = this;
	let { width, height } = _classPrivateFieldGet2(_bitmap, this);
	const [pageWidth, pageHeight] = this.pageDimensions;
	const MAX_RATIO = .75;
	if (this.width) {
		width = this.width * pageWidth;
		height = this.height * pageHeight;
	} else if (width > MAX_RATIO * pageWidth || height > MAX_RATIO * pageHeight) {
		const factor = Math.min(MAX_RATIO * pageWidth / width, MAX_RATIO * pageHeight / height);
		width *= factor;
		height *= factor;
	}
	this._uiManager.enableWaiting(false);
	const canvas = _classPrivateFieldSet2(_canvas, this, document.createElement("canvas"));
	canvas.setAttribute("role", "img");
	this.addContainer(canvas);
	this.width = width / pageWidth;
	this.height = height / pageHeight;
	this.setDims();
	if (this._initialOptions?.isCentered) this.center();
	else this.fixAndSetPosition();
	this._initialOptions = null;
	if (!this._uiManager.useNewAltTextWhenAddingImage || !this._uiManager.useNewAltTextFlow || this.annotationElementId) div.hidden = false;
	_assertClassBrand(_StampEditor_brand, this, _drawBitmap).call(this);
	if (!_classPrivateFieldGet2(_hasBeenAddedInUndoStack, this)) {
		this.parent.addUndoableEditor(this);
		_classPrivateFieldSet2(_hasBeenAddedInUndoStack, this, true);
	}
	this._reportTelemetry({ action: "inserted_image" });
	if (_classPrivateFieldGet2(_bitmapFileName, this)) this.div.setAttribute("aria-description", _classPrivateFieldGet2(_bitmapFileName, this));
	if (!this.annotationElementId) this._uiManager.a11yAlert("pdfjs-editor-stamp-added-alert");
}
function _scaleBitmap(width, height) {
	const { width: bitmapWidth, height: bitmapHeight } = _classPrivateFieldGet2(_bitmap, this);
	let newWidth = bitmapWidth;
	let newHeight = bitmapHeight;
	let bitmap = _classPrivateFieldGet2(_bitmap, this);
	while (newWidth > 2 * width || newHeight > 2 * height) {
		const prevWidth = newWidth;
		const prevHeight = newHeight;
		if (newWidth > 2 * width) newWidth = newWidth >= 16384 ? Math.floor(newWidth / 2) - 1 : Math.ceil(newWidth / 2);
		if (newHeight > 2 * height) newHeight = newHeight >= 16384 ? Math.floor(newHeight / 2) - 1 : Math.ceil(newHeight / 2);
		const offscreen = new OffscreenCanvas(newWidth, newHeight);
		offscreen.getContext("2d").drawImage(bitmap, 0, 0, prevWidth, prevHeight, 0, 0, newWidth, newHeight);
		bitmap = offscreen.transferToImageBitmap();
	}
	return bitmap;
}
function _drawBitmap() {
	const [parentWidth, parentHeight] = this.parentDimensions;
	const { width, height } = this;
	const outputScale = new OutputScale();
	const scaledWidth = Math.ceil(width * parentWidth * outputScale.sx);
	const scaledHeight = Math.ceil(height * parentHeight * outputScale.sy);
	const canvas = _classPrivateFieldGet2(_canvas, this);
	if (!canvas || canvas.width === scaledWidth && canvas.height === scaledHeight) return;
	canvas.width = scaledWidth;
	canvas.height = scaledHeight;
	const bitmap = _classPrivateFieldGet2(_isSvg, this) ? _classPrivateFieldGet2(_bitmap, this) : _assertClassBrand(_StampEditor_brand, this, _scaleBitmap).call(this, scaledWidth, scaledHeight);
	const ctx = canvas.getContext("2d");
	ctx.filter = this._uiManager.hcmFilter;
	ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, scaledWidth, scaledHeight);
}
function _serializeBitmap(toUrl) {
	if (toUrl) {
		if (_classPrivateFieldGet2(_isSvg, this)) {
			const url = this._uiManager.imageManager.getSvgUrl(_classPrivateFieldGet2(_bitmapId, this));
			if (url) return url;
		}
		const canvas = document.createElement("canvas");
		({width: canvas.width, height: canvas.height} = _classPrivateFieldGet2(_bitmap, this));
		canvas.getContext("2d").drawImage(_classPrivateFieldGet2(_bitmap, this), 0, 0);
		return canvas.toDataURL();
	}
	if (_classPrivateFieldGet2(_isSvg, this)) {
		const [pageWidth, pageHeight] = this.pageDimensions;
		const width = Math.round(this.width * pageWidth * PixelsPerInch.PDF_TO_CSS_UNITS);
		const height = Math.round(this.height * pageHeight * PixelsPerInch.PDF_TO_CSS_UNITS);
		const offscreen = new OffscreenCanvas(width, height);
		offscreen.getContext("2d").drawImage(_classPrivateFieldGet2(_bitmap, this), 0, 0, _classPrivateFieldGet2(_bitmap, this).width, _classPrivateFieldGet2(_bitmap, this).height, 0, 0, width, height);
		return offscreen.transferToImageBitmap();
	}
	return structuredClone(_classPrivateFieldGet2(_bitmap, this));
}
function _hasElementChanged4(serialized) {
	const { pageIndex, accessibilityData: { altText } } = this._initialData;
	const isSamePageIndex = serialized.pageIndex === pageIndex;
	const isSameAltText = (serialized.accessibilityData?.alt || "") === altText;
	return {
		isSame: !this.hasEditedComment && !this._hasBeenMoved && !this._hasBeenResized && isSamePageIndex && isSameAltText,
		isSameAltText
	};
}
_defineProperty(StampEditor, "_type", "stamp");
_defineProperty(StampEditor, "_editorType", AnnotationEditorType.STAMP);
var _accessibilityManager2 = /* @__PURE__ */ new WeakMap();
var _allowClick = /* @__PURE__ */ new WeakMap();
var _annotationLayer = /* @__PURE__ */ new WeakMap();
var _clickAC = /* @__PURE__ */ new WeakMap();
var _editorFocusTimeoutId = /* @__PURE__ */ new WeakMap();
var _editors = /* @__PURE__ */ new WeakMap();
var _hadPointerDown = /* @__PURE__ */ new WeakMap();
var _isDisabling = /* @__PURE__ */ new WeakMap();
var _isEnabling = /* @__PURE__ */ new WeakMap();
var _drawingAC = /* @__PURE__ */ new WeakMap();
var _focusedElement = /* @__PURE__ */ new WeakMap();
var _textLayer = /* @__PURE__ */ new WeakMap();
var _textSelectionAC = /* @__PURE__ */ new WeakMap();
var _textLayerDblClickAC = /* @__PURE__ */ new WeakMap();
var _lastPointerDownTimestamp = /* @__PURE__ */ new WeakMap();
var _uiManager5 = /* @__PURE__ */ new WeakMap();
var _AnnotationEditorLayer_brand = /* @__PURE__ */ new WeakSet();
var AnnotationEditorLayer = class AnnotationEditorLayer {
	constructor({ uiManager, pageIndex, div, structTreeLayer, accessibilityManager, annotationLayer, drawLayer, textLayer, viewport, l10n }) {
		_classPrivateMethodInitSpec(this, _AnnotationEditorLayer_brand);
		_classPrivateFieldInitSpec(this, _accessibilityManager2, void 0);
		_classPrivateFieldInitSpec(this, _allowClick, false);
		_classPrivateFieldInitSpec(this, _annotationLayer, null);
		_classPrivateFieldInitSpec(this, _clickAC, null);
		_classPrivateFieldInitSpec(this, _editorFocusTimeoutId, null);
		_classPrivateFieldInitSpec(this, _editors, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _hadPointerDown, false);
		_classPrivateFieldInitSpec(this, _isDisabling, false);
		_classPrivateFieldInitSpec(this, _isEnabling, false);
		_classPrivateFieldInitSpec(this, _drawingAC, null);
		_classPrivateFieldInitSpec(this, _focusedElement, null);
		_classPrivateFieldInitSpec(this, _textLayer, null);
		_classPrivateFieldInitSpec(this, _textSelectionAC, null);
		_classPrivateFieldInitSpec(this, _textLayerDblClickAC, null);
		_classPrivateFieldInitSpec(this, _lastPointerDownTimestamp, -1);
		_classPrivateFieldInitSpec(this, _uiManager5, void 0);
		const editorTypes = [..._editorTypes2._.values()];
		if (!AnnotationEditorLayer._initialized) {
			AnnotationEditorLayer._initialized = true;
			for (const editorType of editorTypes) editorType.initialize(l10n, uiManager);
		}
		uiManager.registerEditorTypes(editorTypes);
		_classPrivateFieldSet2(_uiManager5, this, uiManager);
		this.pageIndex = pageIndex;
		this.div = div;
		_classPrivateFieldSet2(_accessibilityManager2, this, accessibilityManager);
		_classPrivateFieldSet2(_annotationLayer, this, annotationLayer);
		this.viewport = viewport;
		_classPrivateFieldSet2(_textLayer, this, textLayer);
		this.drawLayer = drawLayer;
		this._structTree = structTreeLayer;
		_classPrivateFieldGet2(_uiManager5, this).addLayer(this);
	}
	get isEmpty() {
		return _classPrivateFieldGet2(_editors, this).size === 0;
	}
	get isInvisible() {
		return this.isEmpty && _classPrivateFieldGet2(_uiManager5, this).getMode() === AnnotationEditorType.NONE;
	}
	updateToolbar(options) {
		_classPrivateFieldGet2(_uiManager5, this).updateToolbar(options);
	}
	updateMode(mode = _classPrivateFieldGet2(_uiManager5, this).getMode()) {
		_assertClassBrand(_AnnotationEditorLayer_brand, this, _cleanup).call(this);
		switch (mode) {
			case AnnotationEditorType.NONE:
				this.div.classList.toggle("nonEditing", true);
				this.disableTextSelection();
				this.togglePointerEvents(false);
				this.toggleAnnotationLayerPointerEvents(true);
				this.disableClick();
				return;
			case AnnotationEditorType.INK:
				this.disableTextSelection();
				this.togglePointerEvents(true);
				this.enableClick();
				break;
			case AnnotationEditorType.HIGHLIGHT:
				this.enableTextSelection();
				this.togglePointerEvents(false);
				this.disableClick();
				break;
			default:
				this.disableTextSelection();
				this.togglePointerEvents(true);
				this.enableClick();
		}
		this.toggleAnnotationLayerPointerEvents(false);
		const { classList } = this.div;
		classList.toggle("nonEditing", false);
		if (mode === AnnotationEditorType.POPUP) classList.toggle("commentEditing", true);
		else {
			classList.toggle("commentEditing", false);
			for (const editorType of _editorTypes2._.values()) classList.toggle(`${editorType._type}Editing`, mode === editorType._editorType);
		}
		this.div.hidden = false;
	}
	hasTextLayer(textLayer) {
		return textLayer === _classPrivateFieldGet2(_textLayer, this)?.div;
	}
	setEditingState(isEditing) {
		_classPrivateFieldGet2(_uiManager5, this).setEditingState(isEditing);
	}
	addCommands(params) {
		_classPrivateFieldGet2(_uiManager5, this).addCommands(params);
	}
	cleanUndoStack(type) {
		_classPrivateFieldGet2(_uiManager5, this).cleanUndoStack(type);
	}
	toggleDrawing(enabled = false) {
		this.div.classList.toggle("drawing", !enabled);
	}
	togglePointerEvents(enabled = false) {
		this.div.classList.toggle("disabled", !enabled);
	}
	toggleAnnotationLayerPointerEvents(enabled = false) {
		_classPrivateFieldGet2(_annotationLayer, this)?.togglePointerEvents(enabled);
	}
	async enable() {
		_classPrivateFieldSet2(_isEnabling, this, true);
		this.div.tabIndex = 0;
		this.togglePointerEvents(true);
		this.div.classList.toggle("nonEditing", false);
		_classPrivateFieldGet2(_textLayerDblClickAC, this)?.abort();
		_classPrivateFieldSet2(_textLayerDblClickAC, this, null);
		const annotationElementIds = /* @__PURE__ */ new Set();
		for (const editor of _get_allEditorsIterator.call(_assertClassBrand(_AnnotationEditorLayer_brand, this))) {
			editor.enableEditing();
			editor.show(true);
			if (editor.annotationElementId) {
				_classPrivateFieldGet2(_uiManager5, this).removeChangedExistingAnnotation(editor);
				annotationElementIds.add(editor.annotationElementId);
			}
		}
		const annotationLayer = _classPrivateFieldGet2(_annotationLayer, this);
		if (annotationLayer) for (const editable of annotationLayer.getEditableAnnotations()) {
			editable.hide();
			if (_classPrivateFieldGet2(_uiManager5, this).isDeletedAnnotationElement(editable.data.id)) continue;
			if (annotationElementIds.has(editable.data.id)) continue;
			const editor = await this.deserialize(editable);
			if (!editor) continue;
			this.addOrRebuild(editor);
			editor.enableEditing();
		}
		_classPrivateFieldSet2(_isEnabling, this, false);
		_classPrivateFieldGet2(_uiManager5, this)._eventBus.dispatch("editorsrendered", {
			source: this,
			pageNumber: this.pageIndex + 1
		});
	}
	disable() {
		_classPrivateFieldSet2(_isDisabling, this, true);
		this.div.tabIndex = -1;
		this.togglePointerEvents(false);
		this.div.classList.toggle("nonEditing", true);
		if (_classPrivateFieldGet2(_textLayer, this) && !_classPrivateFieldGet2(_textLayerDblClickAC, this)) {
			_classPrivateFieldSet2(_textLayerDblClickAC, this, new AbortController());
			const signal = _classPrivateFieldGet2(_uiManager5, this).combinedSignal(_classPrivateFieldGet2(_textLayerDblClickAC, this));
			_classPrivateFieldGet2(_textLayer, this).div.addEventListener("pointerdown", (e) => {
				const DBL_CLICK_THRESHOLD = 500;
				const { clientX, clientY, timeStamp } = e;
				if (timeStamp - _classPrivateFieldGet2(_lastPointerDownTimestamp, this) > DBL_CLICK_THRESHOLD) {
					_classPrivateFieldSet2(_lastPointerDownTimestamp, this, timeStamp);
					return;
				}
				_classPrivateFieldSet2(_lastPointerDownTimestamp, this, -1);
				const { classList } = this.div;
				classList.toggle("getElements", true);
				const elements = document.elementsFromPoint(clientX, clientY);
				classList.toggle("getElements", false);
				if (!this.div.contains(elements[0])) return;
				let id;
				const regex = new RegExp(`^${AnnotationEditorPrefix}[0-9]+$`);
				for (const element of elements) if (regex.test(element.id)) {
					id = element.id;
					break;
				}
				if (!id) return;
				const editor = _classPrivateFieldGet2(_editors, this).get(id);
				if (editor?.annotationElementId === null) {
					e.stopPropagation();
					e.preventDefault();
					editor.dblclick(e);
				}
			}, {
				signal,
				capture: true
			});
		}
		const annotationLayer = _classPrivateFieldGet2(_annotationLayer, this);
		const needFakeAnnotation = [];
		if (annotationLayer) {
			const changedAnnotations = /* @__PURE__ */ new Map();
			const resetAnnotations = /* @__PURE__ */ new Map();
			for (const editor of _get_allEditorsIterator.call(_assertClassBrand(_AnnotationEditorLayer_brand, this))) {
				editor.disableEditing();
				if (!editor.annotationElementId) {
					needFakeAnnotation.push(editor);
					continue;
				}
				if (editor.serialize() !== null) {
					changedAnnotations.set(editor.annotationElementId, editor);
					continue;
				} else resetAnnotations.set(editor.annotationElementId, editor);
				this.getEditableAnnotation(editor.annotationElementId)?.show();
				editor.remove();
			}
			for (const editable of annotationLayer.getEditableAnnotations()) {
				const { id } = editable.data;
				if (_classPrivateFieldGet2(_uiManager5, this).isDeletedAnnotationElement(id)) {
					editable.updateEdited({ deleted: true });
					continue;
				}
				let editor = resetAnnotations.get(id);
				if (editor) {
					editor.resetAnnotationElement(editable);
					editor.show(false);
					editable.show();
					continue;
				}
				editor = changedAnnotations.get(id);
				if (editor) {
					_classPrivateFieldGet2(_uiManager5, this).addChangedExistingAnnotation(editor);
					if (editor.renderAnnotationElement(editable)) editor.show(false);
				}
				editable.show();
			}
		}
		_assertClassBrand(_AnnotationEditorLayer_brand, this, _cleanup).call(this);
		if (this.isEmpty) this.div.hidden = true;
		const { classList } = this.div;
		for (const editorType of _editorTypes2._.values()) classList.remove(`${editorType._type}Editing`);
		this.disableTextSelection();
		this.toggleAnnotationLayerPointerEvents(true);
		annotationLayer?.updateFakeAnnotations(needFakeAnnotation);
		_classPrivateFieldSet2(_isDisabling, this, false);
	}
	getEditableAnnotation(id) {
		return _classPrivateFieldGet2(_annotationLayer, this)?.getEditableAnnotation(id) || null;
	}
	setActiveEditor(editor) {
		if (_classPrivateFieldGet2(_uiManager5, this).getActive() === editor) return;
		_classPrivateFieldGet2(_uiManager5, this).setActiveEditor(editor);
	}
	enableTextSelection() {
		this.div.tabIndex = -1;
		if (_classPrivateFieldGet2(_textLayer, this)?.div && !_classPrivateFieldGet2(_textSelectionAC, this)) {
			_classPrivateFieldSet2(_textSelectionAC, this, new AbortController());
			const signal = _classPrivateFieldGet2(_uiManager5, this).combinedSignal(_classPrivateFieldGet2(_textSelectionAC, this));
			_classPrivateFieldGet2(_textLayer, this).div.addEventListener("pointerdown", _assertClassBrand(_AnnotationEditorLayer_brand, this, _textLayerPointerDown).bind(this), { signal });
			_classPrivateFieldGet2(_textLayer, this).div.classList.add("highlighting");
		}
	}
	disableTextSelection() {
		this.div.tabIndex = 0;
		if (_classPrivateFieldGet2(_textLayer, this)?.div && _classPrivateFieldGet2(_textSelectionAC, this)) {
			_classPrivateFieldGet2(_textSelectionAC, this).abort();
			_classPrivateFieldSet2(_textSelectionAC, this, null);
			_classPrivateFieldGet2(_textLayer, this).div.classList.remove("highlighting");
		}
	}
	enableClick() {
		if (_classPrivateFieldGet2(_clickAC, this)) return;
		_classPrivateFieldSet2(_clickAC, this, new AbortController());
		const signal = _classPrivateFieldGet2(_uiManager5, this).combinedSignal(_classPrivateFieldGet2(_clickAC, this));
		this.div.addEventListener("pointerdown", this.pointerdown.bind(this), { signal });
		const pointerup = this.pointerup.bind(this);
		this.div.addEventListener("pointerup", pointerup, { signal });
		this.div.addEventListener("pointercancel", pointerup, { signal });
	}
	disableClick() {
		_classPrivateFieldGet2(_clickAC, this)?.abort();
		_classPrivateFieldSet2(_clickAC, this, null);
	}
	attach(editor) {
		_classPrivateFieldGet2(_editors, this).set(editor.id, editor);
		const { annotationElementId } = editor;
		if (annotationElementId && _classPrivateFieldGet2(_uiManager5, this).isDeletedAnnotationElement(annotationElementId)) _classPrivateFieldGet2(_uiManager5, this).removeDeletedAnnotationElement(editor);
	}
	detach(editor) {
		_classPrivateFieldGet2(_editors, this).delete(editor.id);
		_classPrivateFieldGet2(_accessibilityManager2, this)?.removePointerInTextLayer(editor.contentDiv);
		if (!_classPrivateFieldGet2(_isDisabling, this) && editor.annotationElementId) _classPrivateFieldGet2(_uiManager5, this).addDeletedAnnotationElement(editor);
	}
	remove(editor) {
		this.detach(editor);
		_classPrivateFieldGet2(_uiManager5, this).removeEditor(editor);
		editor.div.remove();
		editor.isAttachedToDOM = false;
	}
	changeParent(editor) {
		if (editor.parent === this) return;
		if (editor.parent && editor.annotationElementId) {
			_classPrivateFieldGet2(_uiManager5, this).addDeletedAnnotationElement(editor);
			AnnotationEditor.deleteAnnotationElement(editor);
			editor.annotationElementId = null;
		}
		this.attach(editor);
		editor.parent?.detach(editor);
		editor.setParent(this);
		if (editor.div && editor.isAttachedToDOM) {
			editor.div.remove();
			this.div.append(editor.div);
		}
	}
	add(editor) {
		if (editor.parent === this && editor.isAttachedToDOM) return;
		this.changeParent(editor);
		_classPrivateFieldGet2(_uiManager5, this).addEditor(editor);
		this.attach(editor);
		if (!editor.isAttachedToDOM) {
			const div = editor.render();
			this.div.append(div);
			editor.isAttachedToDOM = true;
		}
		editor.fixAndSetPosition();
		editor.onceAdded(!_classPrivateFieldGet2(_isEnabling, this));
		_classPrivateFieldGet2(_uiManager5, this).addToAnnotationStorage(editor);
		editor._reportTelemetry(editor.telemetryInitialData);
	}
	moveEditorInDOM(editor) {
		if (!editor.isAttachedToDOM) return;
		const { activeElement } = document;
		if (editor.div.contains(activeElement) && !_classPrivateFieldGet2(_editorFocusTimeoutId, this)) {
			editor._focusEventsAllowed = false;
			_classPrivateFieldSet2(_editorFocusTimeoutId, this, setTimeout(() => {
				_classPrivateFieldSet2(_editorFocusTimeoutId, this, null);
				if (!editor.div.contains(document.activeElement)) {
					editor.div.addEventListener("focusin", () => {
						editor._focusEventsAllowed = true;
					}, {
						once: true,
						signal: _classPrivateFieldGet2(_uiManager5, this)._signal
					});
					activeElement.focus();
				} else editor._focusEventsAllowed = true;
			}, 0));
		}
		editor._structTreeParentId = _classPrivateFieldGet2(_accessibilityManager2, this)?.moveElementInDOM(this.div, editor.div, editor.contentDiv, true);
	}
	addOrRebuild(editor) {
		if (editor.needsToBeRebuilt()) {
			editor.parent || (editor.parent = this);
			editor.rebuild();
			editor.show();
		} else this.add(editor);
	}
	addUndoableEditor(editor) {
		const cmd = () => editor._uiManager.rebuild(editor);
		const undo = () => {
			editor.remove();
		};
		this.addCommands({
			cmd,
			undo,
			mustExec: false
		});
	}
	getEditorByUID(uid) {
		for (const editor of _classPrivateFieldGet2(_editors, this).values()) if (editor.uid === uid) return editor;
		return null;
	}
	combinedSignal(ac) {
		return _classPrivateFieldGet2(_uiManager5, this).combinedSignal(ac);
	}
	canCreateNewEmptyEditor() {
		return _get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this))?.canCreateNewEmptyEditor();
	}
	async pasteEditor(options, params) {
		this.updateToolbar(options);
		await _classPrivateFieldGet2(_uiManager5, this).updateMode(options.mode);
		const { offsetX, offsetY } = _assertClassBrand(_AnnotationEditorLayer_brand, this, _getCenterPoint).call(this);
		const id = _classPrivateFieldGet2(_uiManager5, this).getId();
		const editor = _assertClassBrand(_AnnotationEditorLayer_brand, this, _createNewEditor).call(this, {
			parent: this,
			id,
			x: offsetX,
			y: offsetY,
			uiManager: _classPrivateFieldGet2(_uiManager5, this),
			isCentered: true,
			...params
		});
		if (editor) this.add(editor);
	}
	async deserialize(data) {
		return await _editorTypes2._.get(data.annotationType ?? data.annotationEditorType)?.deserialize(data, this, _classPrivateFieldGet2(_uiManager5, this)) || null;
	}
	createAndAddNewEditor(event, isCentered, data = {}) {
		const id = _classPrivateFieldGet2(_uiManager5, this).getId();
		const editor = _assertClassBrand(_AnnotationEditorLayer_brand, this, _createNewEditor).call(this, {
			parent: this,
			id,
			x: event.offsetX,
			y: event.offsetY,
			uiManager: _classPrivateFieldGet2(_uiManager5, this),
			isCentered,
			...data
		});
		if (editor) this.add(editor);
		return editor;
	}
	get boundingClientRect() {
		return this.div.getBoundingClientRect();
	}
	addNewEditor(data = {}) {
		this.createAndAddNewEditor(_assertClassBrand(_AnnotationEditorLayer_brand, this, _getCenterPoint).call(this), true, data);
	}
	setSelected(editor) {
		_classPrivateFieldGet2(_uiManager5, this).setSelected(editor);
	}
	toggleSelected(editor) {
		_classPrivateFieldGet2(_uiManager5, this).toggleSelected(editor);
	}
	unselect(editor) {
		_classPrivateFieldGet2(_uiManager5, this).unselect(editor);
	}
	pointerup(event) {
		const { isMac } = FeatureTest.platform;
		if (event.button !== 0 || event.ctrlKey && isMac) return;
		if (event.target !== this.div) return;
		if (!_classPrivateFieldGet2(_hadPointerDown, this)) return;
		_classPrivateFieldSet2(_hadPointerDown, this, false);
		if (_get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this))?.isDrawer && _get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this)).supportMultipleDrawings) return;
		if (!_classPrivateFieldGet2(_allowClick, this)) {
			_classPrivateFieldSet2(_allowClick, this, true);
			return;
		}
		const currentMode = _classPrivateFieldGet2(_uiManager5, this).getMode();
		if (currentMode === AnnotationEditorType.STAMP || currentMode === AnnotationEditorType.POPUP || currentMode === AnnotationEditorType.SIGNATURE) {
			_classPrivateFieldGet2(_uiManager5, this).unselectAll();
			return;
		}
		this.createAndAddNewEditor(event, false);
	}
	pointerdown(event) {
		if (_classPrivateFieldGet2(_uiManager5, this).getMode() === AnnotationEditorType.HIGHLIGHT) this.enableTextSelection();
		if (_classPrivateFieldGet2(_hadPointerDown, this)) {
			_classPrivateFieldSet2(_hadPointerDown, this, false);
			return;
		}
		const { isMac } = FeatureTest.platform;
		if (event.button !== 0 || event.ctrlKey && isMac) return;
		if (event.target !== this.div) return;
		_classPrivateFieldSet2(_hadPointerDown, this, true);
		if (_get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this))?.isDrawer) {
			this.startDrawingSession(event);
			return;
		}
		const editor = _classPrivateFieldGet2(_uiManager5, this).getActive();
		_classPrivateFieldSet2(_allowClick, this, !editor || editor.isEmpty());
	}
	startDrawingSession(event) {
		this.div.focus({ preventScroll: true });
		if (_classPrivateFieldGet2(_drawingAC, this)) {
			_get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this)).startDrawing(this, _classPrivateFieldGet2(_uiManager5, this), false, event);
			return;
		}
		_classPrivateFieldGet2(_uiManager5, this).setCurrentDrawingSession(this);
		_classPrivateFieldSet2(_drawingAC, this, new AbortController());
		const signal = _classPrivateFieldGet2(_uiManager5, this).combinedSignal(_classPrivateFieldGet2(_drawingAC, this));
		this.div.addEventListener("blur", ({ relatedTarget }) => {
			if (relatedTarget && !this.div.contains(relatedTarget)) {
				_classPrivateFieldSet2(_focusedElement, this, null);
				this.commitOrRemove();
			}
		}, { signal });
		_get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this)).startDrawing(this, _classPrivateFieldGet2(_uiManager5, this), false, event);
	}
	pause(on) {
		if (on) {
			const { activeElement } = document;
			if (this.div.contains(activeElement)) _classPrivateFieldSet2(_focusedElement, this, activeElement);
			return;
		}
		if (_classPrivateFieldGet2(_focusedElement, this)) setTimeout(() => {
			_classPrivateFieldGet2(_focusedElement, this)?.focus();
			_classPrivateFieldSet2(_focusedElement, this, null);
		}, 0);
	}
	endDrawingSession(isAborted = false) {
		if (!_classPrivateFieldGet2(_drawingAC, this)) return null;
		_classPrivateFieldGet2(_uiManager5, this).setCurrentDrawingSession(null);
		_classPrivateFieldGet2(_drawingAC, this).abort();
		_classPrivateFieldSet2(_drawingAC, this, null);
		_classPrivateFieldSet2(_focusedElement, this, null);
		return _get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this)).endDrawing(isAborted);
	}
	findNewParent(editor, x, y) {
		const layer = _classPrivateFieldGet2(_uiManager5, this).findParent(x, y);
		if (layer === null || layer === this) return false;
		layer.changeParent(editor);
		return true;
	}
	commitOrRemove() {
		if (_classPrivateFieldGet2(_drawingAC, this)) {
			this.endDrawingSession();
			return true;
		}
		return false;
	}
	onScaleChanging() {
		if (!_classPrivateFieldGet2(_drawingAC, this)) return;
		_get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this)).onScaleChangingWhenDrawing(this);
	}
	destroy() {
		this.commitOrRemove();
		if (_classPrivateFieldGet2(_uiManager5, this).getActive()?.parent === this) {
			_classPrivateFieldGet2(_uiManager5, this).commitOrRemove();
			_classPrivateFieldGet2(_uiManager5, this).setActiveEditor(null);
		}
		if (_classPrivateFieldGet2(_editorFocusTimeoutId, this)) {
			clearTimeout(_classPrivateFieldGet2(_editorFocusTimeoutId, this));
			_classPrivateFieldSet2(_editorFocusTimeoutId, this, null);
		}
		for (const editor of _classPrivateFieldGet2(_editors, this).values()) {
			_classPrivateFieldGet2(_accessibilityManager2, this)?.removePointerInTextLayer(editor.contentDiv);
			editor.setParent(null);
			editor.isAttachedToDOM = false;
			editor.div.remove();
		}
		this.div = null;
		_classPrivateFieldGet2(_editors, this).clear();
		_classPrivateFieldGet2(_uiManager5, this).removeLayer(this);
	}
	async render({ viewport }) {
		this.viewport = viewport;
		setLayerDimensions(this.div, viewport);
		for (const editor of _classPrivateFieldGet2(_uiManager5, this).getEditors(this.pageIndex)) {
			this.add(editor);
			editor.rebuild();
		}
		await _classPrivateFieldGet2(_uiManager5, this).findClonesForPage(this);
		this.div.hidden = this.isEmpty;
		this.updateMode();
	}
	update({ viewport }) {
		_classPrivateFieldGet2(_uiManager5, this).commitOrRemove();
		_assertClassBrand(_AnnotationEditorLayer_brand, this, _cleanup).call(this);
		const oldRotation = this.viewport.rotation;
		const rotation = viewport.rotation;
		this.viewport = viewport;
		setLayerDimensions(this.div, { rotation });
		if (oldRotation !== rotation) for (const editor of _classPrivateFieldGet2(_editors, this).values()) editor.rotate(rotation);
	}
	get pageDimensions() {
		const { pageWidth, pageHeight } = this.viewport.rawDims;
		return [pageWidth, pageHeight];
	}
	get scale() {
		return _classPrivateFieldGet2(_uiManager5, this).viewParameters.realScale;
	}
};
function _get_allEditorsIterator() {
	return _classPrivateFieldGet2(_editors, this).size !== 0 ? _classPrivateFieldGet2(_editors, this).values() : _classPrivateFieldGet2(_uiManager5, this).getEditors(this.pageIndex);
}
function _textLayerPointerDown(event) {
	_classPrivateFieldGet2(_uiManager5, this).unselectAll();
	const { target } = event;
	if (target === _classPrivateFieldGet2(_textLayer, this).div || (target.getAttribute("role") === "img" || target.classList.contains("endOfContent")) && _classPrivateFieldGet2(_textLayer, this).div.contains(target)) {
		const { isMac } = FeatureTest.platform;
		if (event.button !== 0 || event.ctrlKey && isMac) return;
		_classPrivateFieldGet2(_uiManager5, this).showAllEditors("highlight", true, true);
		_classPrivateFieldGet2(_textLayer, this).div.classList.add("free");
		this.toggleDrawing();
		HighlightEditor.startHighlighting(this, _classPrivateFieldGet2(_uiManager5, this).direction === "ltr", {
			target: _classPrivateFieldGet2(_textLayer, this).div,
			x: event.x,
			y: event.y
		});
		_classPrivateFieldGet2(_textLayer, this).div.addEventListener("pointerup", () => {
			_classPrivateFieldGet2(_textLayer, this).div.classList.remove("free");
			this.toggleDrawing(true);
		}, {
			once: true,
			signal: _classPrivateFieldGet2(_uiManager5, this)._signal
		});
		event.preventDefault();
	}
}
function _get_currentEditorType() {
	return _editorTypes2._.get(_classPrivateFieldGet2(_uiManager5, this).getMode());
}
function _createNewEditor(params) {
	const editorType = _get_currentEditorType.call(_assertClassBrand(_AnnotationEditorLayer_brand, this));
	return editorType ? new editorType.prototype.constructor(params) : null;
}
function _getCenterPoint() {
	const { x, y, width, height } = this.boundingClientRect;
	const tlX = Math.max(0, x);
	const tlY = Math.max(0, y);
	const brX = Math.min(window.innerWidth, x + width);
	const brY = Math.min(window.innerHeight, y + height);
	const centerX = (tlX + brX) / 2 - x;
	const centerY = (tlY + brY) / 2 - y;
	const [offsetX, offsetY] = this.viewport.rotation % 180 === 0 ? [centerX, centerY] : [centerY, centerX];
	return {
		offsetX,
		offsetY
	};
}
function _cleanup() {
	for (const editor of _classPrivateFieldGet2(_editors, this).values()) if (editor.isEmpty()) editor.remove();
}
_defineProperty(AnnotationEditorLayer, "_initialized", false);
var _editorTypes2 = { _: new Map([
	FreeTextEditor,
	InkEditor,
	StampEditor,
	HighlightEditor,
	SignatureEditor
].map((type) => [type._editorType, type])) };
var _parent2 = /* @__PURE__ */ new WeakMap();
var _mapping = /* @__PURE__ */ new WeakMap();
var _toUpdate = /* @__PURE__ */ new WeakMap();
var _DrawLayer_brand = /* @__PURE__ */ new WeakSet();
var DrawLayer = class DrawLayer {
	constructor() {
		_classPrivateMethodInitSpec(this, _DrawLayer_brand);
		_classPrivateFieldInitSpec(this, _parent2, null);
		_classPrivateFieldInitSpec(this, _mapping, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _toUpdate, /* @__PURE__ */ new Map());
	}
	setParent(parent) {
		if (!_classPrivateFieldGet2(_parent2, this)) {
			_classPrivateFieldSet2(_parent2, this, parent);
			return;
		}
		if (_classPrivateFieldGet2(_parent2, this) !== parent) {
			if (_classPrivateFieldGet2(_mapping, this).size > 0) for (const root of _classPrivateFieldGet2(_mapping, this).values()) {
				root.remove();
				parent.append(root);
			}
			_classPrivateFieldSet2(_parent2, this, parent);
		}
	}
	static get _svgFactory() {
		return shadow(this, "_svgFactory", new DOMSVGFactory());
	}
	draw(properties, isPathUpdatable = false, hasClip = false) {
		var _DrawLayer$id, _DrawLayer$id2;
		const id = (_id5._ = (_DrawLayer$id = _id5._, _DrawLayer$id2 = _DrawLayer$id++, _DrawLayer$id), _DrawLayer$id2);
		const root = _assertClassBrand(_DrawLayer_brand, this, _createSVG).call(this);
		const defs = DrawLayer._svgFactory.createElement("defs");
		root.append(defs);
		const path = DrawLayer._svgFactory.createElement("path");
		defs.append(path);
		const pathId = `path_${id}`;
		path.setAttribute("id", pathId);
		path.setAttribute("vector-effect", "non-scaling-stroke");
		if (isPathUpdatable) _classPrivateFieldGet2(_toUpdate, this).set(id, path);
		const clipPathId = hasClip ? _assertClassBrand(_DrawLayer_brand, this, _createClipPath).call(this, defs, pathId) : null;
		const use = DrawLayer._svgFactory.createElement("use");
		root.append(use);
		use.setAttribute("href", `#${pathId}`);
		this.updateProperties(root, properties);
		_classPrivateFieldGet2(_mapping, this).set(id, root);
		return {
			id,
			clipPathId: `url(#${clipPathId})`
		};
	}
	drawOutline(properties, mustRemoveSelfIntersections) {
		var _DrawLayer$id3, _DrawLayer$id4;
		const id = (_id5._ = (_DrawLayer$id3 = _id5._, _DrawLayer$id4 = _DrawLayer$id3++, _DrawLayer$id3), _DrawLayer$id4);
		const root = _assertClassBrand(_DrawLayer_brand, this, _createSVG).call(this);
		const defs = DrawLayer._svgFactory.createElement("defs");
		root.append(defs);
		const path = DrawLayer._svgFactory.createElement("path");
		defs.append(path);
		const pathId = `path_${id}`;
		path.setAttribute("id", pathId);
		path.setAttribute("vector-effect", "non-scaling-stroke");
		let maskId;
		if (mustRemoveSelfIntersections) {
			const mask = DrawLayer._svgFactory.createElement("mask");
			defs.append(mask);
			maskId = `mask_${id}`;
			mask.setAttribute("id", maskId);
			mask.setAttribute("maskUnits", "objectBoundingBox");
			const rect = DrawLayer._svgFactory.createElement("rect");
			mask.append(rect);
			rect.setAttribute("width", "1");
			rect.setAttribute("height", "1");
			rect.setAttribute("fill", "white");
			const use = DrawLayer._svgFactory.createElement("use");
			mask.append(use);
			use.setAttribute("href", `#${pathId}`);
			use.setAttribute("stroke", "none");
			use.setAttribute("fill", "black");
			use.setAttribute("fill-rule", "nonzero");
			use.classList.add("mask");
		}
		const use1 = DrawLayer._svgFactory.createElement("use");
		root.append(use1);
		use1.setAttribute("href", `#${pathId}`);
		if (maskId) use1.setAttribute("mask", `url(#${maskId})`);
		const use2 = use1.cloneNode();
		root.append(use2);
		use1.classList.add("mainOutline");
		use2.classList.add("secondaryOutline");
		this.updateProperties(root, properties);
		_classPrivateFieldGet2(_mapping, this).set(id, root);
		return id;
	}
	finalizeDraw(id, properties) {
		_classPrivateFieldGet2(_toUpdate, this).delete(id);
		this.updateProperties(id, properties);
	}
	updateProperties(elementOrId, properties) {
		if (!properties) return;
		const { root, bbox, rootClass, path } = properties;
		const element = typeof elementOrId === "number" ? _classPrivateFieldGet2(_mapping, this).get(elementOrId) : elementOrId;
		if (!element) return;
		if (root) _assertClassBrand(_DrawLayer_brand, this, _updateProperties).call(this, element, root);
		if (bbox) _setBox.call(DrawLayer, element, bbox);
		if (rootClass) {
			const { classList } = element;
			for (const [className, value] of Object.entries(rootClass)) classList.toggle(className, value);
		}
		if (path) {
			const pathElement = element.firstElementChild.firstElementChild;
			_assertClassBrand(_DrawLayer_brand, this, _updateProperties).call(this, pathElement, path);
		}
	}
	updateParent(id, layer) {
		if (layer === this) return;
		const root = _classPrivateFieldGet2(_mapping, this).get(id);
		if (!root) return;
		_classPrivateFieldGet2(_parent2, layer).append(root);
		_classPrivateFieldGet2(_mapping, this).delete(id);
		_classPrivateFieldGet2(_mapping, layer).set(id, root);
	}
	remove(id) {
		_classPrivateFieldGet2(_toUpdate, this).delete(id);
		if (_classPrivateFieldGet2(_parent2, this) === null) return;
		_classPrivateFieldGet2(_mapping, this).get(id).remove();
		_classPrivateFieldGet2(_mapping, this).delete(id);
	}
	destroy() {
		_classPrivateFieldSet2(_parent2, this, null);
		for (const root of _classPrivateFieldGet2(_mapping, this).values()) root.remove();
		_classPrivateFieldGet2(_mapping, this).clear();
		_classPrivateFieldGet2(_toUpdate, this).clear();
	}
};
_DrawLayer = DrawLayer;
function _setBox(element, [x, y, width, height]) {
	const { style } = element;
	style.top = `${100 * y}%`;
	style.left = `${100 * x}%`;
	style.width = `${100 * width}%`;
	style.height = `${100 * height}%`;
}
function _createSVG() {
	const svg = _DrawLayer._svgFactory.create(1, 1, true);
	_classPrivateFieldGet2(_parent2, this).append(svg);
	svg.setAttribute("aria-hidden", true);
	return svg;
}
function _createClipPath(defs, pathId) {
	const clipPath = _DrawLayer._svgFactory.createElement("clipPath");
	defs.append(clipPath);
	const clipPathId = `clip_${pathId}`;
	clipPath.setAttribute("id", clipPathId);
	clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
	const clipPathUse = _DrawLayer._svgFactory.createElement("use");
	clipPath.append(clipPathUse);
	clipPathUse.setAttribute("href", `#${pathId}`);
	clipPathUse.classList.add("clip");
	return clipPathId;
}
function _updateProperties(element, properties) {
	for (const [key, value] of Object.entries(properties)) if (value === null) element.removeAttribute(key);
	else element.setAttribute(key, value);
}
var _id5 = { _: 0 };
function percentage(value) {
	return `${(value * 100).toFixed(2)}%`;
}
var _coordinates = /* @__PURE__ */ new WeakMap();
var _coordinatesByElement = /* @__PURE__ */ new WeakMap();
var _getPageCanvas = /* @__PURE__ */ new WeakMap();
var _minSize = /* @__PURE__ */ new WeakMap();
var _pageWidth3 = /* @__PURE__ */ new WeakMap();
var _pageHeight3 = /* @__PURE__ */ new WeakMap();
var _TextLayerImages_brand = /* @__PURE__ */ new WeakSet();
var TextLayerImages = class {
	constructor(minSize, coordinates, viewport, getPageCanvas) {
		_classPrivateMethodInitSpec(this, _TextLayerImages_brand);
		_classPrivateFieldInitSpec(this, _coordinates, []);
		_classPrivateFieldInitSpec(this, _coordinatesByElement, /* @__PURE__ */ new Map());
		_classPrivateFieldInitSpec(this, _getPageCanvas, null);
		_classPrivateFieldInitSpec(this, _minSize, 0);
		_classPrivateFieldInitSpec(this, _pageWidth3, 0);
		_classPrivateFieldInitSpec(this, _pageHeight3, 0);
		_classPrivateFieldSet2(_minSize, this, minSize);
		_classPrivateFieldSet2(_coordinates, this, coordinates);
		_classPrivateFieldSet2(_pageWidth3, this, viewport.rawDims.pageWidth);
		_classPrivateFieldSet2(_pageHeight3, this, viewport.rawDims.pageHeight);
		_classPrivateFieldSet2(_getPageCanvas, this, getPageCanvas);
	}
	render() {
		const container = document.createElement("div");
		container.className = "textLayerImages";
		for (let i = 0; i < _classPrivateFieldGet2(_coordinates, this).length; i += 6) {
			const el = _assertClassBrand(_TextLayerImages_brand, this, _createImagePlaceholder).call(this, _classPrivateFieldGet2(_coordinates, this).subarray(i, i + 6));
			if (el) container.append(el);
		}
		container.addEventListener("contextmenu", (event) => {
			if (!(event.target instanceof HTMLCanvasElement)) return;
			const imgElement = event.target;
			const coords = _classPrivateFieldGet2(_coordinatesByElement, this).get(imgElement);
			if (!coords) return;
			const activeImage = _activeImage._?.deref();
			if (activeImage === imgElement) return;
			if (activeImage) {
				activeImage.width = 0;
				activeImage.height = 0;
			}
			_activeImage._ = new WeakRef(imgElement);
			const { inverseTransform, x1, y1, width, height } = coords;
			const pageCanvas = _classPrivateFieldGet2(_getPageCanvas, this).call(this);
			const imageX1 = Math.ceil(x1 * pageCanvas.width);
			const imageY1 = Math.ceil(y1 * pageCanvas.height);
			const imageX2 = Math.floor((x1 + width / _classPrivateFieldGet2(_pageWidth3, this)) * pageCanvas.width);
			const imageY2 = Math.floor((y1 + height / _classPrivateFieldGet2(_pageHeight3, this)) * pageCanvas.height);
			imgElement.width = imageX2 - imageX1;
			imgElement.height = imageY2 - imageY1;
			const ctx = imgElement.getContext("2d");
			ctx.setTransform(...inverseTransform);
			ctx.translate(-imageX1, -imageY1);
			ctx.drawImage(pageCanvas, 0, 0);
		});
		return container;
	}
};
function _createImagePlaceholder([x1, y1, x2, y2, x3, y3]) {
	const width = Math.hypot((x3 - x1) * _classPrivateFieldGet2(_pageWidth3, this), (y3 - y1) * _classPrivateFieldGet2(_pageHeight3, this));
	const height = Math.hypot((x2 - x1) * _classPrivateFieldGet2(_pageWidth3, this), (y2 - y1) * _classPrivateFieldGet2(_pageHeight3, this));
	if (width < _classPrivateFieldGet2(_minSize, this) || height < _classPrivateFieldGet2(_minSize, this)) return null;
	const transform = [
		(x3 - x1) * _classPrivateFieldGet2(_pageWidth3, this) / width,
		(y3 - y1) * _classPrivateFieldGet2(_pageHeight3, this) / width,
		(x2 - x1) * _classPrivateFieldGet2(_pageWidth3, this) / height,
		(y2 - y1) * _classPrivateFieldGet2(_pageHeight3, this) / height,
		0,
		0
	];
	const inverseTransform = Util.inverseTransform(transform);
	const imgElement = document.createElement("canvas");
	imgElement.className = "textLayerImagePlaceholder";
	imgElement.width = 0;
	imgElement.height = 0;
	Object.assign(imgElement.style, {
		opacity: 0,
		position: "absolute",
		left: percentage(x1),
		top: percentage(y1),
		width: percentage(width / _classPrivateFieldGet2(_pageWidth3, this)),
		height: percentage(height / _classPrivateFieldGet2(_pageHeight3, this)),
		transformOrigin: "0% 0%",
		transform: `matrix(${transform.join(",")})`
	});
	_classPrivateFieldGet2(_coordinatesByElement, this).set(imgElement, {
		inverseTransform,
		width,
		height,
		x1,
		y1
	});
	return imgElement;
}
var _activeImage = { _: null };
globalThis._pdfjsTestingUtils = { HighlightOutliner };
globalThis.pdfjsLib = {
	AbortException,
	AnnotationEditorLayer,
	AnnotationEditorParamsType,
	AnnotationEditorType,
	AnnotationEditorUIManager,
	AnnotationLayer,
	AnnotationMode,
	AnnotationType,
	applyOpacity,
	build,
	ColorPicker,
	createValidAbsoluteUrl,
	CSSConstants,
	DOMSVGFactory,
	DrawLayer,
	FeatureTest,
	fetchData,
	findContrastColor,
	getDocument,
	getFilenameFromUrl,
	getPdfFilenameFromUrl,
	getRGB,
	getUuid,
	getXfaPageViewport,
	GlobalWorkerOptions,
	ImageKind,
	InvalidPDFException,
	isDataScheme,
	isPdfFile,
	isValidExplicitDest,
	makeArr,
	makeMap,
	makeObj,
	MathClamp,
	noContextMenu,
	normalizeUnicode,
	OPS,
	OutputScale,
	PasswordResponses,
	PDFDataRangeTransport,
	PDFDateString,
	PDFWorker,
	PermissionFlag,
	PixelsPerInch,
	RenderingCancelledException,
	renderRichText,
	ResponseException,
	setLayerDimensions,
	shadow,
	SignatureExtractor,
	stopEvent,
	SupportedImageMimeTypes,
	TextLayer,
	TextLayerImages,
	TouchManager,
	updateUrlHash,
	Util,
	VerbosityLevel,
	version,
	XfaLayer
};
//#endregion
//#region node_modules/pdfjs-dist/build/pdf.worker.mjs?url
var pdf_worker_default = "" + new URL("pdf.worker-xSiVJ7U_.mjs", import.meta.url).href;
//#endregion
export { TextLayer as L, __vitePreload as i, GlobalWorkerOptions as n, getDocument as r, pdf_worker_default as t };
