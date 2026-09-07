const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./lumenAds-bXJ8EPsD.js","./rolldown-runtime-D1cXj70v.js","./db-Ii3ipPL7.js","./nostr-zC6Qsl2z.js","./streaming-CGdx3ecV.js","./pdf-C3eksu0f.js"])))=>i.map(i=>d[i]);
import { t as require_react } from "./react-1WJTggxS.js";
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
import { c as haptic, d as hideNativeOverlay, f as isPremium, h as showNativeOverlay, m as onAdEvent, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { contarReportes, npubCorto } from "./nostr-zC6Qsl2z.js";
import { a as traerCapitulo, n as disponibilidad, o as traerManifest, r as precargarCapitulos } from "./streaming-CGdx3ecV.js";
import { u as obtenerBlobLumen } from "./publicados-63Om61aj.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { onTorrent, validarEnlace } from "./torrent-DS6cTKT6.js";
import { leerLumen, portadaSvg } from "./lumenbook-D1rmZfn6.js";
import { k as registrarImpresion, n as campanasCatalogo, p as frecuenciaAnuncio, r as campanasCompatibles, t as MODOS, v as guardarModoLectura, w as modoLectura } from "./lumenAds-bXJ8EPsD.js";
//#region src/components/LectorGlobal.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
function BannerAd({ ad, etiqueta, esCampana, refTiempo }) {
	if (!ad || !ad.image || !ad.url) return null;
	const abrir = () => {
		try {
			const nav = typeof window !== "undefined" ? window.AndroidNav : null;
			if (nav?.open) nav.open(ad.url);
			else window.open(ad.url, "_blank");
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg-ad-autor",
		onClick: abrir,
		ref: refTiempo,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lg-ad-tag",
				children: esCampana ? "📢 Anuncio de campaña · PoAV" : "Anuncio del autor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ad.image,
				alt: ad.alt || "Anuncio",
				loading: "lazy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lg-ad-tag",
				children: etiqueta
			})
		]
	});
}
function capituloHtmlLimpio(html) {
	let s = String(html || "");
	s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
	if (!/<html/i.test(s)) s = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS_LEC}</style></head><body>${s}</body></html>`;
	return s;
}
var CSS_LEC = `body{font-family:-apple-system,'Segoe UI',Roboto,Georgia,serif;line-height:1.8;color:#e8e8ef;background:#0b0b0f;margin:0;padding:18px 16px;min-height:100%;}p{margin:0 0 18px;}h1,h2,h3{color:#b3a2ff;line-height:1.3;}img{max-width:100%;height:auto;}a{color:#7c5cff;}.lumen-titulo{color:#b3a2ff;font-size:1.4em;margin:0 0 20px;}`;
function LectorGlobal({ libro, reportes = [], onSalir, toast }) {
	const [manifest, setManifest] = (0, import_react.useState)(null);
	const [metadata, setMetadata] = (0, import_react.useState)(null);
	const [capitulos, setCapitulos] = (0, import_react.useState)([]);
	const [paginas, setPaginas] = (0, import_react.useState)([]);
	const [tipo, setTipo] = (0, import_react.useState)("text");
	const [verTexto, setVerTexto] = (0, import_react.useState)(false);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [cargando, setCargando] = (0, import_react.useState)(true);
	const [paso, setPaso] = (0, import_react.useState)("");
	const [origen, setOrigen] = (0, import_react.useState)("");
	const [localBytes, setLocalBytes] = (0, import_react.useState)(null);
	const [fin, setFin] = (0, import_react.useState)(false);
	const [qrFin, setQrFin] = (0, import_react.useState)("");
	const [enPortada, setEnPortada] = (0, import_react.useState)(true);
	const refContenido = (0, import_react.useRef)(null);
	const idxRef = (0, import_react.useRef)(0);
	idxRef.current = idx;
	const libroRef = (0, import_react.useRef)(libro);
	libroRef.current = libro;
	const [modo, setModo] = (0, import_react.useState)("colaborador");
	const [frec, setFrec] = (0, import_react.useState)(5);
	const [campanas, setCampanas] = (0, import_react.useState)([]);
	const capitulo = capitulos[idx];
	const total = capitulos.length;
	const tAnuncio = (0, import_react.useRef)(0);
	const poavHecho = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const refBanner = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [m, f, c] = await Promise.all([
				modoLectura(),
				frecuenciaAnuncio(),
				campanasCatalogo()
			]);
			setModo(m);
			setFrec(f);
			setCampanas(c);
			__vitePreload(() => import("./lumenAds-bXJ8EPsD.js").then((n) => n.C).then((ads) => ads.refrescarCampanas().catch(() => {})), __vite__mapDeps([0,1,2,3]), import.meta.url).catch(() => {});
		})();
	}, []);
	const cambiarModo = async (nuevo) => {
		haptic.tap();
		await guardarModoLectura(nuevo);
		setModo(nuevo);
		setFrec(nuevo === "contribuidor" ? 3 : nuevo === "colaborador" ? 5 : 0);
		toast?.("Modo " + (MODOS[nuevo]?.nombre || nuevo));
	};
	const premium2 = isPremium();
	const conAnuncio = frec > 0 && !premium2 && idx > 0 && idx % frec === 0;
	const campanaElegida = conAnuncio ? campanasCompatibles(campanas, libro)[0] || null : null;
	const adAutorActivo = conAnuncio && !campanaElegida && !!libro.ad;
	const adAppActivo = conAnuncio && !campanaElegida && !libro.ad;
	const registrarPoAV = (0, import_react.useCallback)((capIdx) => {
		const camp = campanasCompatibles(campanas, libroRef.current)[0];
		if (!camp) return;
		if (poavHecho.current.has(capIdx)) return;
		const duracion = Date.now() - tAnuncio.current;
		if (duracion < 2e3) return;
		poavHecho.current.add(capIdx);
		registrarImpresion({
			campana: camp,
			libro: libroRef.current,
			durationMs: duracion,
			progreso: capIdx / Math.max(1, total || 1)
		}).then((r) => {
			if (r?.ok && r.lote) toast?.(`🧾 Lote PoAV publicado: ${r.lote.leaves} impresiones (root ${String(r.lote.root).slice(0, 12)}…)`);
		}).catch(() => {});
	}, [
		campanas,
		total,
		toast
	]);
	(0, import_react.useEffect)(() => {
		if (campanaElegida) tAnuncio.current = Date.now();
	}, [campanaElegida, idx]);
	usarPantallaAtras(() => onSalir?.(), () => {
		if (fin) {
			setFin(false);
			return true;
		}
		if (!enPortada) {
			if (idx > 0) {
				setIdx((i) => i - 1);
				return true;
			}
			setEnPortada(true);
			return true;
		}
		return false;
	});
	(0, import_react.useEffect)(() => {
		if (!adAppActivo || cargando) return;
		const colocar = () => {
			const el = refContenido.current;
			if (!el) return;
			showNativeOverlay(el.getBoundingClientRect().top + el.getBoundingClientRect().height + 8, 132);
		};
		const t = setTimeout(colocar, 350);
		const off = onAdEvent((ev) => {
			if (ev === "native_loaded" || ev === "native_size") {
				clearTimeout(t);
				setTimeout(colocar, 120);
			}
		});
		return () => {
			clearTimeout(t);
			off?.();
		};
	}, [
		adAppActivo,
		idx,
		cargando
	]);
	(0, import_react.useEffect)(() => {
		if (!adAppActivo) hideNativeOverlay();
	}, [adAppActivo, idx]);
	(0, import_react.useEffect)(() => () => hideNativeOverlay(), []);
	(0, import_react.useEffect)(() => {
		let vivo = true;
		(async () => {
			setCargando(true);
			setFin(false);
			setEnPortada(true);
			setCapitulos([]);
			setPaginas([]);
			setVerTexto(false);
			setIdx(0);
			const disp = disponibilidad(libro);
			if (libro._fuente === "feed") {
				if (libro.chapters?.length) {
					setPaso("Cargando capítulos del feed…");
					setOrigen("feed");
					const cabs = [];
					for (let i = 0; i < libro.chapters.length; i++) try {
						const r = await fetch(libro.chapters[i], { signal: AbortSignal.timeout(2e4) });
						if (r.ok) {
							const txt = await r.text();
							const html = /<\/?html/i.test(txt) || /<\/?[a-z]/i.test(txt) ? txt : `<p>${txt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>`;
							cabs.push({
								nombre: `chapter-${String(i + 1).padStart(3, "0")}.xhtml`,
								html
							});
						} else cabs.push({
							nombre: `chapter-${String(i + 1).padStart(3, "0")}.xhtml`,
							html: "<p>No se pudo cargar este capítulo.</p>"
						});
					} catch {
						cabs.push({
							nombre: `chapter-${String(i + 1).padStart(3, "0")}.xhtml`,
							html: "<p>No se pudo cargar este capítulo.</p>"
						});
					}
					if (cabs.length && vivo) {
						setCapitulos(cabs);
						setCargando(false);
						return;
					}
				}
				if (libro.stream) {
					setPaso("Abriendo el streaming…");
					try {
						const nav = typeof window !== "undefined" ? window.AndroidNav : null;
						if (nav?.open) nav.open(libro.stream, libro.titulo || "");
						else window.open(libro.stream, "_blank");
					} catch {}
					setCargando(false);
					return;
				}
				if (libro.magnet && disp.nivel !== "none") {
					if (validarEnlace(libro.magnet).ok) {
						await leerPorTorrent(libro.magnet, vivo);
						return;
					}
				}
				if (libro.download) {
					if (vivo) {
						setPaso("Este libro del feed se descarga desde su URL. Usa «Descargar» en la ficha e impórtalo.");
						setCargando(false);
					}
					return;
				}
			}
			if (libro._local && libro.d) try {
				setPaso("Abriendo tu copia local…");
				const blob = await obtenerBlobLumen(libro.d);
				if (blob && vivo) {
					const bytes = new Uint8Array(await blob.arrayBuffer()).buffer;
					const lumen = await leerLumen(bytes);
					if ((lumen.capitulos.length || lumen.paginas.length) && vivo) {
						setManifest(lumen.manifest);
						setMetadata(lumen.metadata);
						setTipo(lumen.tipo || (lumen.paginas.length ? "paged" : "text"));
						setOrigen("tu teléfono");
						setCapitulos(lumen.capitulos);
						setPaginas(lumen.paginas || []);
						setCargando(false);
						return;
					}
				}
			} catch (e) {
				console.warn("[lector] local", e?.message || e);
			}
			if (libro.cid) {
				setPaso("Pidiendo el índice del libro (manifest)…");
				const r = await traerManifest(libro.cid);
				if (vivo && r?.manifest) {
					setManifest(r.manifest);
					setOrigen(r.desde || "gateway");
					const orden = r.manifest.reading_order || [];
					if (!orden.length) {
						toast("El libro no tiene capítulos legibles");
						setCargando(false);
						return;
					}
					setCapitulos(orden.map((n) => ({
						nombre: n,
						html: ""
					})));
					await traerManifest(libro.cid);
					const m2 = await __vitePreload(() => import("./streaming-CGdx3ecV.js").then((n) => n.i).then((m) => m.traerMetadata(libro.cid)), __vite__mapDeps([4,1,2,5]), import.meta.url);
					if (vivo && m2?.metadata) setMetadata(m2.metadata);
					const c1 = await traerCapitulo(libro.cid, orden[0]);
					if (vivo && c1) {
						setCapitulos((cs) => cs.map((c, i) => i === 0 ? {
							...c,
							html: c1.texto
						} : c));
						setCargando(false);
						precargarCapitulos(libro.cid, orden, 1).catch(() => {});
					} else {
						setPaso("El libro no está disponible en los gateways ahora mismo");
						setCargando(false);
					}
					return;
				}
			}
			if (libro.magnet && disp.nivel !== "none") {
				if (validarEnlace(libro.magnet).ok) {
					await leerPorTorrent(libro.magnet, vivo);
					return;
				}
			}
			if (vivo) {
				setPaso("Este libro no tiene fuente de contenido todavía (solo metadatos).");
				setCargando(false);
			}
		})();
		return () => {
			vivo = false;
		};
	}, [libro.id]);
	const leerPorTorrent = async (magnet, vivo) => {
		setPaso("🔎 Buscando fuentes en la red P2P (DHT/trackers)…");
		const b = typeof window !== "undefined" ? window.AndroidTorrent : null;
		if (!b) {
			if (vivo) {
				setPaso("Este dispositivo no tiene motor torrent.");
				setCargando(false);
			}
			return;
		}
		const res = await new Promise((resolve) => {
			const off = onTorrent((ev, d) => {
				if (ev === "torrent_meta" && d?.archivos) {
					const lumen = (d.archivos || []).find((f) => /\.lumen$/i.test(f.nombre));
					if (lumen) b.descargar(magnet, String(lumen.i));
					else {
						const libroA = (d.archivos || []).find((f) => f.libro);
						if (libroA) b.descargar(magnet, String(libroA.i));
					}
				} else if (ev === "torrent_fin" && d?.archivos?.length) {
					off?.();
					resolve({
						ok: true,
						archivos: d.archivos
					});
				} else if (ev === "torrent_error" && !d?.ok) {
					off?.();
					resolve({
						ok: false,
						error: d?.error
					});
				}
			});
			try {
				b.metadatos(magnet, 45);
			} catch (e) {
				resolve({
					ok: false,
					error: String(e?.message || e)
				});
			}
			setTimeout(() => {
				off?.();
				resolve({
					ok: false,
					error: "timeout"
				});
			}, 90 * 1e3);
		});
		if (!vivo) return;
		if (!res.ok) {
			setPaso(res.error === "timeout" ? "🔴 No hay fuentes (seeders) disponibles en este momento. El libro sigue en el catálogo; prueba más tarde o usa la descarga desde un feed." : "🔴 No se pudo obtener el libro por torrent: " + (res.error || "sin fuentes"));
			setCargando(false);
			return;
		}
		const archivo = res.archivos[0];
		setPaso("Leyendo el libro…");
		try {
			const lumen = await leerLumen(await leerArchivoCompleto(archivo.ruta));
			if (!lumen.capitulos.length && !lumen.paginas.length) {
				setPaso("El archivo descargado no es un LumenBook válido.");
				setCargando(false);
				return;
			}
			setManifest(lumen.manifest);
			setMetadata(lumen.metadata);
			setTipo(lumen.tipo || (lumen.paginas.length ? "paged" : "text"));
			setOrigen("torrent");
			setCapitulos(lumen.capitulos);
			setPaginas(lumen.paginas || []);
			setCargando(false);
		} catch (e) {
			setPaso("El libro descargado no se pudo leer: " + (e?.message || e));
			setCargando(false);
		}
	};
	const leerArchivoCompleto = async (ruta) => {
		const b = typeof window !== "undefined" ? window.AndroidTorrent : null;
		const tam = b.tamano(ruta);
		if (tam <= 0) throw new Error("archivo no disponible");
		const TROZO = 512 * 1024;
		const partes = [];
		let desde = 0;
		while (desde < tam) {
			const cuantos = Math.min(TROZO, tam - desde);
			const b64 = b.leer(ruta, desde, cuantos);
			if (!b64) throw new Error("lectura interrumpida");
			const bin = atob(b64);
			const u8 = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
			partes.push(u8);
			desde += cuantos;
			setPaso(`Leyendo el libro… ${Math.round(desde / tam * 100)}%`);
		}
		const total = new Uint8Array(partes.reduce((a, p) => a + p.length, 0));
		let off = 0;
		for (const p of partes) {
			total.set(p, off);
			off += p.length;
		}
		return total.buffer;
	};
	const irA = (0, import_react.useCallback)((n) => {
		const capAnterior = idxRef.current;
		if (capAnterior !== n && tAnuncio.current > 0 && campanaElegida) registrarPoAV(capAnterior);
		haptic.tap();
		setFin(false);
		setIdx(n);
		if (libroRef.current?.cid) {
			const orden = manifest?.reading_order || [];
			const nombre = orden[n];
			if (nombre) {
				traerCapitulo(libroRef.current.cid, nombre).then((r) => {
					if (r) setCapitulos((cs) => cs.map((c, i) => i === n ? {
						...c,
						html: r.texto
					} : c));
				});
				precargarCapitulos(libroRef.current.cid, orden, n + 1).catch(() => {});
			}
		}
	}, [
		manifest,
		campanaElegida,
		registrarPoAV
	]);
	(0, import_react.useEffect)(() => {
		if (fin) return;
		if (idx > 0 && idx === total - 1 && capitulo?.html) {}
	}, [
		idx,
		total,
		capitulo,
		fin
	]);
	const cerrarLibro = () => {
		hideNativeOverlay();
		onSalir?.();
	};
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const guardarEnBiblioteca = async () => {
		if (!libro.download || guardando) return;
		setGuardando(true);
		try {
			toast?.("Descargando el libro a tu biblioteca…");
			const r = await fetch(libro.download, { signal: AbortSignal.timeout(12e4) });
			if (!r.ok) {
				toast?.("No se pudo descargar: " + r.status);
				return;
			}
			const blob = await r.blob();
			const f = new File([blob], (libro.titulo || "libro") + ".lumen", { type: "application/octet-stream" });
			if (typeof window.__lumenImportarArchivos === "function") {
				await window.__lumenImportarArchivos([f]);
				toast?.("✓ Añadido a tu biblioteca. Ábrelo desde allí para usar el lector completo.");
				cerrarLibro();
			} else toast?.("No se pudo importar en este dispositivo");
		} catch (e) {
			toast?.("Error al descargar: " + (e?.message || e));
		} finally {
			setGuardando(false);
		}
	};
	const esPaginado = tipo === "paged" && paginas.length > 0;
	const totalItems = esPaginado ? paginas.length : capitulos.length;
	const reportesLibro = contarReportes(reportes || [], libro.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "lg-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "lg-x",
						onClick: cerrarLibro,
						"aria-label": "Salir del lector",
						children: "✕"
					}),
					libro._fuente === "feed" && libro.download && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn sm",
						onClick: guardarEnBiblioteca,
						title: "Descarga el .lumen y lo abre en el lector completo de Lumen",
						children: "📚 Lector completo"
					}),
					(libro.audioUrl || libro.videoUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { display: "flex", gap: 6, flexWrap: "wrap" },
						children: [
							libro.audioUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn sm",
								onClick: () => window.open(libro.audioUrl, "_blank", "noopener"),
								title: "Audio del autor (Lumen Storage)",
								children: "🎧 Audio"
							}),
							libro.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn sm",
								onClick: () => window.open(libro.videoUrl, "_blank", "noopener"),
								title: "Vídeo del autor (Lumen Storage)",
								children: "🎬 Vídeo"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg-titulo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: libro.titulo }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							libro.autor,
							" ",
							origen ? `· ${origen}` : ""
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "lg-modo",
						value: modo,
						onChange: (e) => cambiarModo(e.target.value),
						title: "Modo de lectura: cuántos anuncios ves y cuánto ganas",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "limpio",
								children: "📖 Lector"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "colaborador",
								children: "🤝 Colaborador"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "contribuidor",
								children: "🌱 Contribuidor"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "lg-prog",
						children: totalItems ? enPortada ? "Portada" : `${idx + 1}/${totalItems}` : ""
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-cuerpo",
				ref: refContenido,
				children: cargando ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 70 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: "var(--fg-dim)",
							marginTop: 14
						},
						children: paso
					})]
				}) : esPaginado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageVista, {
					paginas,
					idx,
					verTexto,
					onToggleTexto: () => {
						haptic.tap();
						setVerTexto((v) => !v);
					}
				}) : !capitulo?.html ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "center-msg",
					style: { padding: 50 },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { fontSize: 40 },
							children: "📭"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: "var(--fg-dim)",
								maxWidth: 340,
								margin: "10px auto",
								lineHeight: 1.5
							},
							children: paso
						}),
						String(libro.magnet || "") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: "var(--fg-mute)",
								fontSize: 12,
								maxWidth: 340,
								margin: "0 auto 12px"
							},
							children: "Este libro se comparte por torrent: quizá no hay seeders en línea ahora mismo. Puedes reintentar más tarde."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pb-siguiente",
							style: {
								justifyContent: "center",
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn",
								onClick: cerrarLibro,
								children: "‹ Volver al catálogo"
							}), String(libro.magnet || "") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: () => {
									setCargando(true);
									setPaso("Reintentando por torrent…");
									leerPorTorrent(libro.magnet, true);
								},
								children: "↻ Reintentar"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn primary",
								onClick: () => {
									try {
										const q = encodeURIComponent(`${libro.titulo} ${libro.autor} libro leer online`);
										const nav = window.AndroidNav;
										if (nav?.open) nav.open("https://www.google.com/search?q=" + q);
										else window.open("https://www.google.com/search?q=" + q, "_blank");
									} catch {}
								},
								children: "🔎 Buscar el libro en la web"
							})]
						})
					]
				}) : enPortada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortadaLibro, {
					libro,
					metadata,
					onEmpezar: () => {
						haptic.tap();
						setEnPortada(false);
					}
				}) : fin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PantallaFin, {
					libro,
					metadata,
					reportes: reportesLibro,
					qr: qrFin,
					onVolver: () => {
						setFin(false);
						irA(total - 1);
					},
					onSalir: cerrarLibro
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "lg-capitulo",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "lg-capitulo-titulo",
						children: [
							"Capítulo ",
							idx + 1,
							metadata?.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: metadata.title }) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						className: "lg-iframe",
						sandbox: "",
						srcDoc: capituloHtmlLimpio(capitulo.html),
						title: `Capítulo ${idx + 1}`,
						loading: "eager"
					})]
				})
			}),
			!cargando && (capitulo?.html || esPaginado) && !fin && !enPortada && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				campanaElegida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerAd, {
					ad: campanaElegida,
					etiqueta: `CPM $${Number(campanaElegida.cpmUsd).toFixed(2)}`,
					esCampana: true,
					refTiempo: refBanner
				}),
				adAutorActivo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerAd, {
					ad: libro.ad,
					etiqueta: "50/50"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg-pie",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							disabled: idx === 0,
							onClick: () => irA(idx - 1),
							children: "‹ Anterior"
						}),
						esPaginado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn",
							onClick: () => setVerTexto((v) => !v),
							title: "Alternar imagen / texto OCR",
							children: verTexto ? "🖼 Imagen" : "📝 Texto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lg-leido",
							children: campanaElegida ? "📢 campaña · PoAV" : adAutorActivo ? "banner del autor" : adAppActivo ? "anuncio de la app" : MODOS[modo]?.nombre || ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn primary",
							disabled: idx >= totalItems - 1,
							onClick: () => {
								if (idx >= totalItems - 1) {
									setQrFin(qrDataUrl(JSON.stringify({
										v: 1,
										d: libro.d,
										t: libro.titulo,
										a: libro.npub
									}), 260));
									setFin(true);
								} else irA(idx + 1);
							},
							children: "Siguiente ›"
						})
					]
				})
			] })
		]
	});
}
function PortadaLibro({ libro, metadata, onEmpezar }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg-portada",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg-portada-cov",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: libro.portada && String(libro.portada).startsWith("http") ? libro.portada : "data:image/svg+xml;utf8," + encodeURIComponent(portadaSvg(libro.titulo, libro.autor)),
					alt: libro.titulo,
					draggable: false
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "lg-portada-titulo",
				children: libro.titulo
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lg-portada-autor",
				children: libro.autor
			}),
			(metadata?.description || libro.descripcion) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lg-portada-desc",
				children: String(metadata?.description || libro.descripcion).slice(0, 220)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn primary",
				onClick: onEmpezar,
				children: "📖 Comenzar a leer"
			})
		]
	});
}
function PantallaFin({ libro, metadata, reportes, onVolver, onSalir }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		try {
			const data = JSON.stringify({
				v: 1,
				d: libro.d,
				t: libro.titulo,
				a: libro.npub,
				m: libro.magnet
			});
			const img = new Image();
			img.onload = () => {
				const ctx = ref.current.getContext("2d");
				ctx.clearRect(0, 0, 260, 260);
				ctx.drawImage(img, 0, 0, 260, 260);
			};
			img.src = qrDataUrl(data, 260);
		} catch (e) {
			console.warn("[qr-fin]", e?.message || e);
		}
	}, [libro]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg-fin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { fontSize: 52 },
				children: "🏁"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
				"Has terminado «",
				libro.titulo,
				"»"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "var(--fg-dim)",
					margin: "4px 0 18px"
				},
				children: [
					libro.autor,
					" ",
					libro.npub ? `· ${npubCorto(libro.npub)}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref,
				width: 260,
				height: 260,
				style: { borderRadius: 14 }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
				style: {
					color: "var(--fg-mute)",
					margin: "10px 0 18px"
				},
				children: [
					"Este QR identifica el libro de forma única (firma del autor en el catálogo).",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"lumenreader://b/",
					libro.d
				]
			}),
			libro.donacion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "cg-donar",
				href: libro.donacion,
				target: "_blank",
				rel: "noreferrer",
				children: "💛 Apoyar al autor"
			}),
			libro.zap && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "var(--flame)",
					fontSize: 13,
					margin: "6px 0"
				},
				children: [
					"⚡ Zap: ",
					libro.zap.slice(0, 40),
					"…"
				]
			}),
			reportes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "var(--danger)",
					fontSize: 12
				},
				children: [
					"🚩 Este libro tiene ",
					reportes,
					" reporte(s) de la comunidad."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg-pie",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn",
					onClick: onVolver,
					children: "‹ Repasar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn primary",
					onClick: onSalir,
					children: "Salir"
				})]
			})
		]
	});
}
function PageVista({ paginas, idx, verTexto, onToggleTexto }) {
	const pagina = paginas[idx];
	const [url, setUrl] = (0, import_react.useState)(null);
	const prevPagina = (0, import_react.useRef)(pagina);
	(0, import_react.useEffect)(() => {
		if (!pagina?.blob) return;
		const u = URL.createObjectURL(pagina.blob);
		setUrl(u);
		if (prevPagina.current?.blob) {}
		prevPagina.current = pagina;
		return () => {
			if (u) URL.revokeObjectURL(u);
		};
	}, [idx, paginas]);
	if (!pagina) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "center-msg",
		style: { padding: 50 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "lg-pagina",
		children: verTexto && pagina.texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			className: "lg-iframe",
			sandbox: "",
			srcDoc: capituloHtmlLimpio(pagina.texto),
			title: `Página ${idx + 1} (texto)`,
			loading: "eager"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg-pagina-img",
			children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: `Página ${idx + 1}`,
				draggable: false,
				loading: "lazy"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "spinner" }), pagina.texto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn sm lg-txt-capa",
				onClick: onToggleTexto,
				children: "📝 Ver texto"
			})]
		})
	});
}
//#endregion
export { LectorGlobal as default };
