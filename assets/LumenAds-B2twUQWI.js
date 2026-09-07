const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./nostr-zC6Qsl2z.js","./db-Ii3ipPL7.js","./rolldown-runtime-D1cXj70v.js"])))=>i.map(i=>d[i]);
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
import { c as haptic, v as usarPantallaAtras, y as require_jsx_runtime } from "./index-DOrzQ79O.js";
import { identidadGuardada } from "./nostr-zC6Qsl2z.js";
import { t as qrDataUrl } from "./qrLumen-BDUGNJQb.js";
import { A as reparto, D as refrescarCampanas, E as publicarVoto, F as validarFacturaLN, I as verificarPagoLightning, L as votarPendientesAutomatico, M as saldoSats, N as semillaDeLote, O as refrescarVotos, P as soyValidador, R as votosDeLote, S as lotesArchivados, T as publicarEspacio, _ as guardarLightningAddress, a as cerrarCampana, b as ledger, c as crearCampanaLocal, d as espacioActual, f as eventoDeCampana, g as guardarAutoInversion, h as generarFacturaLightning, i as campanasPropias, j as retirar, l as depositar, m as gananciasPorRol, n as campanasCatalogo, o as configAutoInversion, s as consensoDeLote, t as MODOS, u as elegirValidadores, v as guardarModoLectura, w as modoLectura, x as lightningAddress, y as guardarSoyValidador } from "./lumenAds-bXJ8EPsD.js";
//#region src/components/LumenAds.jsx
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
var satsFmt = (n) => `${Math.round(n || 0).toLocaleString("es-CO")} sats`;
var usdFmt = (n) => `$${Number(n || 0).toFixed(2)}`;
function LumenAds({ onSalir, toast }) {
	const [tab, setTab] = (0, import_react.useState)("saldo");
	const [identidad, setIdentidad] = (0, import_react.useState)(null);
	const [entradas, setEntradas] = (0, import_react.useState)([]);
	const [saldo, setSaldo] = (0, import_react.useState)(0);
	const [porRol, setPorRol] = (0, import_react.useState)({});
	const [campanas, setCampanas] = (0, import_react.useState)([]);
	const [catalogo, setCatalogo] = (0, import_react.useState)([]);
	const [espacio, setEspacio] = (0, import_react.useState)(null);
	const [lotes, setLotes] = (0, import_react.useState)([]);
	const [modo, setModo] = (0, import_react.useState)("colaborador");
	const [cargandoMercado, setCargandoMercado] = (0, import_react.useState)(false);
	const [fNombre, setFNombre] = (0, import_react.useState)("");
	const [fImagen, setFImagen] = (0, import_react.useState)("");
	const [fUrl, setFUrl] = (0, import_react.useState)("");
	const [fCpm, setFCpm] = (0, import_react.useState)("0.50");
	const [fPresupuesto, setFPresupuesto] = (0, import_react.useState)("5");
	const [fCategorias, setFCategorias] = (0, import_react.useState)("");
	const [fIdioma, setFIdioma] = (0, import_react.useState)("es");
	const [fDias, setFDias] = (0, import_react.useState)("30");
	const [depositoSats, setDepositoSats] = (0, import_react.useState)("50000");
	const [retiroSats, setRetiroSats] = (0, import_react.useState)("");
	const [lnAddr, setLnAddr] = (0, import_react.useState)("");
	const [facturaQR, setFacturaQR] = (0, import_react.useState)("");
	const [lnMensaje, setLnMensaje] = (0, import_react.useState)("");
	const [generandoLN, setGenerandoLN] = (0, import_react.useState)(false);
	const [facturaRetiro, setFacturaRetiro] = (0, import_react.useState)("");
	const [validadorActivo, setValidadorActivo] = (0, import_react.useState)(false);
	const [votosRecibidos, setVotosRecibidos] = (0, import_react.useState)([]);
	const [autoInversion, setAutoInversion] = (0, import_react.useState)({
		activa: false,
		porcentaje: 20,
		bote: 0,
		campanasFinanciadas: 0
	});
	const [verificandoPago, setVerificandoPago] = (0, import_react.useState)(false);
	usarPantallaAtras(() => onSalir?.());
	const recargar = (0, import_react.useCallback)(async () => {
		const [e, s, r, c, cat, esp, l, mo, id, ln, val, auto] = await Promise.all([
			ledger(),
			saldoSats(),
			gananciasPorRol(),
			campanasPropias(),
			campanasCatalogo(),
			espacioActual(),
			lotesArchivados(),
			modoLectura(),
			identidadGuardada(),
			lightningAddress(),
			soyValidador(),
			configAutoInversion()
		]);
		setEntradas(e);
		setSaldo(s);
		setPorRol(r);
		setCampanas(c);
		setCatalogo(cat);
		setEspacio(esp);
		setLotes(l);
		setModo(mo);
		setIdentidad(id);
		setLnAddr(ln);
		setValidadorActivo(val);
		setAutoInversion(auto);
	}, []);
	(0, import_react.useEffect)(() => {
		recargar();
		if (tab === "mercado" && !cargandoMercado) {
			setCargandoMercado(true);
			refrescarCampanas().finally(() => {
				setCargandoMercado(false);
				recargar();
			});
		}
		if (tab === "saldo" && validadorActivo) votarPendientesAutomatico().then((n) => {
			if (n > 0) {
				toast(`Voté ${n} lote(s) automáticamente`);
				recargar();
			}
		}).catch(() => {});
	}, [tab]);
	const publicarCampana = async () => {
		haptic.tap();
		if (!fNombre.trim() || !fImagen.trim() || !fUrl.trim()) {
			toast("Faltan datos: nombre, imagen (URL) y enlace de la campaña");
			return;
		}
		const r = await crearCampanaLocal({
			nombre: fNombre.trim(),
			imagen: fImagen.trim(),
			url: fUrl.trim(),
			cpmUsd: Number(fCpm) || .5,
			presupuestoUsd: Number(fPresupuesto) || 5,
			idioma: fIdioma,
			categorias: fCategorias.trim(),
			duracionDias: Number(fDias) || 30
		});
		if (!r.ok) {
			toast(r.error);
			return;
		}
		toast(`Escrow bloqueado: ${satsFmt(r.campana.presupuestoSats)} (≈ $${fPresupuesto})`);
		if (identidad) {
			const ev = eventoDeCampana({
				identidad,
				d: "camp-" + r.campana.id,
				nombre: r.campana.nombre,
				imagen: r.campana.imagen,
				url: r.campana.url,
				cpmUsd: r.campana.cpmUsd,
				presupuestoUsd: r.campana.presupuestoUsd,
				idioma: r.campana.idioma,
				categorias: r.campana.categorias,
				duracionDias: Number(fDias) || 30
			});
			const ok = (await __vitePreload(() => import("./nostr-zC6Qsl2z.js").then((m) => m.publicarEnRelays(ev)), __vite__mapDeps([0,1,2]), import.meta.url)).filter((x) => x.ok).length;
			toast(ok ? `Campaña publicada en ${ok} relay(s). ¡A buscar publishers!` : "Campaña guardada localmente (los relays no respondieron)");
		}
		setFNombre("");
		setFImagen("");
		setFUrl("");
		recargar();
	};
	const guardarEspacio = async () => {
		haptic.tap();
		const e = {
			...espacio || {},
			acepta: !!(espacio?.acepta ?? true),
			bookId: espacio?.bookId || "",
			bookTitle: espacio?.bookTitle || "Biblioteca general",
			cpmMin: Number(espacio?.cpmMin || .3),
			categorias: espacio?.categorias || "todos",
			frecuencia: espacio?.frecuencia || "1_per_5_pages",
			idioma: espacio?.idioma || "es"
		};
		const r = await publicarEspacio(e);
		setEspacio(e);
		toast(r.ok ? `AD_SPACE publicado en ${r.publicado} relay(s)` : r.error === "sin_identidad" ? "Primero activa tu identidad" : "Guardado local (relays sin respuesta)");
	};
	const cambiarModo = async (m) => {
		haptic.tap();
		await guardarModoLectura(m);
		setModo(m);
		toast(`Modo ${MODOS[m].nombre} activado: ${MODOS[m].desc}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pb-scrim",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pb-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "cg-back",
							onClick: () => onSalir?.(),
							"aria-label": "Volver",
							children: "‹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cg-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "💎 Lumen Ads" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Publicidad P2P · escrow · PoAV · sin intermediarios" })]
						}),
						identidad && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lg-prog",
							children: "🆔 ok"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ads-tabs",
					children: [
						[
							"saldo",
							"💰",
							"Mi saldo"
						],
						[
							"mercado",
							"📢",
							"Mercado"
						],
						[
							"anunciante",
							"🎯",
							"Anunciante"
						],
						[
							"espacio",
							"📚",
							"Mi espacio"
						]
					].map(([id, ic, et]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "ads-tab" + (tab === id ? " on" : ""),
						onClick: () => {
							setTab(id);
							haptic.tap();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ic }), et]
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ads-cuerpo",
					children: [
						tab === "saldo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ads-saldo",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "ads-guia",
									open: saldo === 0 && Object.keys(porRol).length === 0,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "🎓 ¿Primera vez? Entiende esta billetera en 1 minuto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ads-guia-cuerpo",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "¿Qué es esto?" }),
												" Una billetera de prueba que vive ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "solo en tu teléfono" }),
												"(autocustodia). Nadie más puede verla ni tocarla. Anota en ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "sats" }),
												"(satoshis: la unidad pequeña de Bitcoin; 100.000 sats ≈ 1 dólar)."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "¿De dónde sale el dinero?" }), " De 4 trabajos que haces dentro de la app:"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"📖 ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Leer" }),
													" con anuncios activados (modo Colaborador/Contribuidor dentro de un libro)."
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"🌱 ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sembrar" }),
													" libros que publicas: tu móvil los comparte a otros lectores."
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"🛡️ ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Moderar" }),
													" y ✅ ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "validar" }),
													" anuncios cuando la red lo pida."
												] })
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Depositar / Retirar:" }), " en esta versión (V1) el saldo es un registro local para que veas cómo funciona el reparto; la conexión con Lightning real (depósitos y retiros de verdad) llega en V2. Aun así puedes anotar depósitos y retiros para familiarizarte."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Importante:" }), " si cambias de móvil, recuperas tu saldo importando tu respaldo (Ajustes → respaldo). Sin respaldo, el saldo no viaja."] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-saldo-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Mi saldo (autocustodia · solo en tu teléfono)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: satsFmt(saldo) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"≈ ",
											usdFmt(saldo / 1e5),
											" USD"
										] }),
										Object.keys(porRol).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "ads-roles",
											children: Object.entries(porRol).map(([rol, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"+",
												satsFmt(s),
												" · ",
												rol
											] }, rol))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-dep",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Depositar / retirar (wallet local autocustodia)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "row-sub",
											style: { margin: "2px 0 8px" },
											children: "La wallet vive sólo en tu teléfono. En un móvil nuevo recuperas el saldo importando tu respaldo."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "na-relay-nuevo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												value: depositoSats,
												min: "0",
												onChange: (e) => setDepositoSats(e.target.value),
												placeholder: "sats"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn primary",
												onClick: async () => {
													const n = Number(depositoSats);
													if (!n || n <= 0) {
														toast("Escribe cuántos sats depositar");
														return;
													}
													await depositar(n);
													toast(`+${satsFmt(n)} depositados`);
													recargar();
												},
												children: "Depositar"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "na-relay-nuevo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												value: retiroSats,
												min: "0",
												onChange: (e) => setRetiroSats(e.target.value),
												placeholder: "sats a retirar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn",
												onClick: async () => {
													const n = Number(retiroSats);
													if (!n || n <= 0) {
														toast("Escribe cuántos sats retirar");
														return;
													}
													const r = await retirar(n);
													toast(r.ok ? `-${satsFmt(n)} retirados` : r.error);
													recargar();
												},
												children: "Retirar"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-ln",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "⚡ Depósito real por Lightning (LNURL)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "row-sub",
											style: { margin: "2px 0 8px" },
											children: [
												"Pon tu ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lightning Address" }),
												" (ej. ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "tunombre@getalby.com" }),
												" o",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: " @walletofsatoshi.com" }),
												"). La app genera una factura real: la escaneas con tu wallet, pagas y confirmas aquí."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "na-relay-nuevo",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: lnAddr,
												onChange: (e) => {
													setLnAddr(e.target.value);
													setFacturaQR("");
													setLnMensaje("");
												},
												placeholder: "tunombre@dominio.com"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn primary",
												disabled: generandoLN,
												onClick: async () => {
													setGenerandoLN(true);
													setLnMensaje("");
													await guardarLightningAddress(lnAddr.trim());
													const n = Number(depositoSats);
													if (!n || n <= 0) {
														setLnMensaje("Escribe cuántos sats depositar");
														setGenerandoLN(false);
														return;
													}
													const r = await generarFacturaLightning(lnAddr, n);
													if (r.ok) {
														setFacturaQR(r.factura);
														setLnMensaje("Escanea esta factura con tu wallet Lightning y págala. Luego toca «Ya pagué».");
													} else setLnMensaje(r.error);
													setGenerandoLN(false);
												},
												children: generandoLN ? "…" : "Generar factura"
											})]
										}),
										facturaQR && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ads-qr-ln",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrFactura, {
													factura: facturaQR,
													sats: depositoSats
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn primary",
													style: {
														width: "100%",
														marginTop: 8
													},
													disabled: verificandoPago,
													onClick: async () => {
														setVerificandoPago(true);
														setLnMensaje("Verificando el pago en la red Lightning…");
														const n = Number(depositoSats);
														const v = await verificarPagoLightning(facturaQR);
														setVerificandoPago(false);
														if (v.ok && v.pagada) {
															const sats = v.sats || n;
															await depositar(sats, "lightning-verified:" + facturaQR.slice(0, 30));
															toast(`+${satsFmt(sats)} acreditados (pago verificado)`);
															setFacturaQR("");
															setLnMensaje("");
															recargar();
														} else if (confirm("No pude verificar el pago automáticamente (" + (v.error || "sin respuesta") + "). ¿Ya lo pagaste y quieres acreditarlo?")) {
															await depositar(n, "lightning:" + facturaQR.slice(0, 40));
															toast(`+${satsFmt(n)} acreditados (manual)`);
															setFacturaQR("");
															setLnMensaje("");
															recargar();
														} else setLnMensaje("El pago aún no aparece confirmado. Espera e inténtalo de nuevo.");
													},
													children: verificandoPago ? "…" : "🔍 Verificar pago y acreditar"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
													style: { color: "var(--fg-mute)" },
													children: "(v87: la app comprueba el pago sola contra exploradores Lightning, sin configurar nodo. Respaldo manual si no responden.)"
												})
											]
										}),
										lnMensaje && !facturaQR && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: lnMensaje.startsWith("❌") ? "pb-moder no" : "pb-moder ok",
											style: { marginTop: 8 },
											children: lnMensaje
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ads-retiro",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Retirar a tu wallet" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "row-sub",
													style: { margin: "2px 0 6px" },
													children: [
														"Pega una factura ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "lnbc…" }),
														". Se registra el retiro; los pagos en cadena se liquidan por lotes. También puedes cobrar por TON/USDT en Apoyar."
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "na-relay-nuevo",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: facturaRetiro,
														onChange: (e) => setFacturaRetiro(e.target.value),
														placeholder: "lnbc1…"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn",
														onClick: async () => {
															const v = validarFacturaLN(facturaRetiro);
															if (!v.ok) {
																toast(v.error);
																return;
															}
															const r = await retirar(Number(retiroSats) || 0, "ln:" + facturaRetiro.slice(0, 30));
															toast(r.ok ? "Retiro registrado: se liquida con el siguiente lote" : r.error);
															setFacturaRetiro("");
															recargar();
														},
														children: "Registrar retiro"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ads-autoinv",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🔁 Reinvertir mis ganancias de lector" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "row-sub",
													style: { margin: "2px 0 6px" },
													children: "Un porcentaje de lo que ganas viendo anuncios se aparta; al llegar a 1000 sats financia una micro-campaña de propina para los siguientes lectores (\"paga lo que leíste\", no es inversión con réditos)."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "ads-modo-btn",
													onClick: async () => {
														const cfg = {
															...autoInversion,
															activa: !autoInversion.activa
														};
														await guardarAutoInversion(cfg);
														setAutoInversion(cfg);
														toast(cfg.activa ? "Reinversión activada" : "Reinversión desactivada");
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔁" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Reinvertir ganancias" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: autoInversion.activa ? `ACTIVA · ${autoInversion.porcentaje}% al bote` : "Toque para activar" })] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "lg-prog",
															children: autoInversion.activa ? "✅" : "⚪"
														})
													]
												}),
												autoInversion.activa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "pb-campo",
													style: { marginTop: 8 },
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"Porcentaje a reinvertir: ",
														autoInversion.porcentaje,
														"%"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "range",
														min: "5",
														max: "100",
														step: "5",
														value: autoInversion.porcentaje,
														onChange: async (e) => {
															const cfg = {
																...autoInversion,
																porcentaje: Number(e.target.value)
															};
															setAutoInversion(cfg);
															await guardarAutoInversion(cfg);
														}
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
													style: { color: "var(--fg-mute)" },
													children: [
														"Bote actual: ",
														satsFmt(autoInversion.bote || 0),
														" · propinas financiadas: ",
														autoInversion.campanasFinanciadas || 0
													]
												})] })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-lotes",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
											"Lotes PoAV publicados (",
											lotes.length,
											") · lotes de 50"
										] }),
										lotes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
											style: { color: "var(--fg-mute)" },
											children: [
												"Cuando leas en modo Colaborador/Contribuidor y veas anuncios de campañas, cada ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "50 impresiones válidas" }),
												" se agrupan y se publica la raíz Merkle. Si eres validador, la app vota sola."
											]
										}),
										lotes.map((l, i) => {
											const r = reparto(l.leaves.length * 50);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "ads-lote",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [String(l.root).slice(0, 24), "…"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
														l.leaves,
														" impresiones · ",
														l.publicado,
														" relays · ",
														new Date(l.at).toLocaleString("es-CO")
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "ads-reparto",
														children: [
															"Autor ",
															satsFmt(r.autor),
															" · Lector ",
															satsFmt(r.lector),
															" · Seeders ",
															satsFmt(r.seeders),
															" · App ",
															satsFmt(r.comision)
														]
													})
												]
											}, i);
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-validador",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🛡️ Validaciones automáticas (v87)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "row-sub",
											style: { margin: "2px 0 8px" },
											children: [
												"Actívalo y la app vota sola cada lote de 50: revisa firmas schnorr, duraciones y nonces. Los validadores se eligen por ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "lotería hash" }),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "sha256(campaña+root+npub)" }),
												". Ganas sats cuando tu voto coincide con el consenso."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ads-modo-btn",
											onClick: async () => {
												const nuevo = !validadorActivo;
												await guardarSoyValidador(nuevo);
												setValidadorActivo(nuevo);
												if (nuevo) {
													toast("Validador activo: la app vota sola");
													votarPendientesAutomatico().then((n) => {
														if (n > 0) toast(`Voté ${n} lote(s) en segundo plano`);
													}).catch(() => {});
												} else toast("Ya no eres validador");
												recargar();
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🛡️" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Votación automática de validadores" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: validadorActivo ? "ACTIVA — la app audita y vota sola" : "Toca para activar" })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "lg-prog",
													children: validadorActivo ? "✅" : "⚪"
												})
											]
										}),
										validadorActivo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn mini",
											style: { marginTop: 6 },
											onClick: async () => {
												const n = await votarPendientesAutomatico();
												await refrescarVotos();
												const v = await votosDeLote("");
												setVotosRecibidos(v);
												toast(`Voté ${n} lote(s) ahora · ${v.length} votos en total`);
												recargar();
											},
											children: "↻ Votar lotes pendientes ya"
										}),
										lotes.map((l, i) => {
											const semilla = semillaDeLote(l);
											const elegidos = identidad ? elegirValidadores([identidad.npub], semilla, 5).includes(identidad.npub) : false;
											const consenso = consensoDeLote(votosRecibidos.filter((x) => x.root === l.root));
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "ads-lote",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [String(l.root).slice(0, 20), "…"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
														l.leaves,
														" impresiones · ",
														new Date(l.at).toLocaleString("es-CO")
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ads-consenso " + consenso.estado,
														children: consenso.estado === "aprobado" ? "✅ Lote aprobado por consenso" : consenso.estado === "rechazado" ? "❌ Lote rechazado" : `⏳ Consenso pendiente (${consenso.votos} votos de 3)`
													}),
													validadorActivo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "na-enlaces",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn mini",
															onClick: async () => {
																const r = await publicarVoto({
																	lote: l,
																	voto: "aprobar",
																	confianza: .9
																});
																toast(r.ok ? `Voto «aprobar» publicado en ${r.publicado} relay(s)` : "No se pudo publicar el voto");
															},
															children: "✅ Aprobar"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "btn mini",
															onClick: async () => {
																toast((await publicarVoto({
																	lote: l,
																	voto: "rechazar",
																	confianza: .6
																})).ok ? "Voto «rechazar» publicado" : "No se pudo publicar el voto");
															},
															children: "❌ Rechazar"
														})]
													}),
													elegidos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
														style: { color: "var(--accent-2)" },
														children: "🎯 Elegido por la lotería hash para este lote"
													})
												]
											}, i);
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-historial",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Historial" }),
										entradas.slice(0, 12).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ads-mov",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.concepto || e.tipo }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [e.rol ? e.rol + " · " : "", new Date(e.at).toLocaleDateString("es-CO")] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
													className: e.tipo === "retiro" || e.tipo === "pago" ? "neg" : "pos",
													children: [e.tipo === "retiro" || e.tipo === "pago" ? "-" : "+", satsFmt(e.sats)]
												})
											]
										}, e.id)),
										entradas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: "var(--fg-mute)" },
											children: "Sin movimientos todavía."
										})
									]
								})
							]
						}),
						tab === "mercado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ads-mercado",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-mercado-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Campañas activas en los relays" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn mini",
										disabled: cargandoMercado,
										onClick: () => {
											setCargandoMercado(true);
											refrescarCampanas().finally(() => {
												setCargandoMercado(false);
												recargar();
											});
										},
										children: cargandoMercado ? "…" : "↻"
									})]
								}),
								catalogo.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									style: {
										color: "var(--fg-dim)",
										fontSize: 12.5,
										lineHeight: 1.6
									},
									children: [
										"Aún no hay campañas de anunciantes en los relays. Sé el primero en la pestaña ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "🎯 Anunciante" }),
										": tu presupuesto queda asegurado en escrow y cada impresión válida te cuesta CPM/1000."
									]
								}),
								catalogo.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-campana",
									children: [c.imagen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: c.imagen,
										alt: "",
										loading: "lazy",
										onError: (e) => {
											e.target.style.display = "none";
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ads-campana-info",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: c.nombre }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												c.idioma,
												" · ",
												c.categorias || "todas",
												" · CPM ",
												usdFmt(c.cpmUsd)
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ads-asegurado",
												children: ["🟢 Fondos asegurados en escrow: ", usdFmt(c.presupuestoUsd)]
											})
										]
									})]
								}, c.id))
							]
						}),
						tab === "anunciante" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ads-anunciante",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Crea tu campaña (el dinero se bloquea en escrow)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									style: { margin: "4px 0 10px" },
									children: "Tu presupuesto sale de tu saldo y queda bloqueado. Se libera por lotes de impresiones válidas verificadas; lo no gastado vuelve al cerrar la campaña."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nombre de la campaña *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: fNombre,
										onChange: (e) => setFNombre(e.target.value),
										placeholder: "Café XYZ"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Imagen del banner (URL https) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: fImagen,
										onChange: (e) => setFImagen(e.target.value),
										placeholder: "https://tusitio.com/banner.webp"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enlace al hacer clic (URL) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: fUrl,
										onChange: (e) => setFUrl(e.target.value),
										placeholder: "https://tusitio.com"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-fila",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CPM (USD por 1000 vistas)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											min: "0.1",
											value: fCpm,
											onChange: (e) => setFCpm(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Presupuesto (USD)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.5",
											min: "1",
											value: fPresupuesto,
											onChange: (e) => setFPresupuesto(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-fila",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Idioma" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: fIdioma,
											onChange: (e) => setFIdioma(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "es",
													children: "Español"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "en",
													children: "English"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "otro",
													children: "Otro / todos"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Duración (días)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "1",
											value: fDias,
											onChange: (e) => setFDias(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Categorías compatibles (separadas por coma, vacío = todas)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: fCategorias,
										onChange: (e) => setFCategorias(e.target.value),
										placeholder: "ficción, desarrollo-personal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									style: { width: "100%" },
									onClick: publicarCampana,
									children: "🔒 Publicar campaña y bloquear escrow"
								}),
								campanas.filter((c) => c.estado !== "cerrada").length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-mis-campanas",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Mis campañas" }), campanas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ads-mov",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"«",
												c.nombre,
												"» · ",
												c.estado
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
												"Escrow ",
												satsFmt(c.presupuestoSats),
												" · gastado ",
												satsFmt(c.gastadoSats),
												" · CPM ",
												usdFmt(c.cpmUsd)
											] }),
											c.estado !== "cerrada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn mini",
												onClick: async () => {
													const r = await cerrarCampana(c.id);
													toast(r.ok ? `Campaña cerrada: ${satsFmt(r.sobrante)} devueltos al saldo` : r.error);
													recargar();
												},
												children: "Cerrar y reembolsar"
											})
										]
									}, c.id))]
								})
							]
						}),
						tab === "espacio" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ads-espacio",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Mi espacio publicitario (AD_SPACE)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "row-sub",
									style: { margin: "4px 0 10px" },
									children: "Publica en los relays qué libros aceptan anuncios y en qué condiciones. Los anunciantes te encuentran por idioma y categorías."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "¿Acepto anuncios?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: espacio?.acepta === false ? "no" : "si",
										onChange: (e) => setEspacio({
											...espacio || {},
											acepta: e.target.value === "si"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "si",
											children: "Sí, quiero ganar con anuncios"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "no",
											children: "No, lectura limpia"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pb-fila",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CPM mínimo (USD)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.05",
											min: "0",
											value: espacio?.cpmMin ?? .3,
											onChange: (e) => setEspacio({
												...espacio || {},
												cpmMin: Number(e.target.value)
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "pb-campo",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Frecuencia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: espacio?.frecuencia || "1_per_5_pages",
											onChange: (e) => setEspacio({
												...espacio || {},
												frecuencia: e.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "1_per_10_pages",
													children: "1 cada 10 páginas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "1_per_5_pages",
													children: "1 cada 5 páginas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "1_per_chapter",
													children: "1 por capítulo"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Categorías permitidas (vacío = todas)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: espacio?.categorias || "",
										onChange: (e) => setEspacio({
											...espacio || {},
											categorias: e.target.value
										}),
										placeholder: "ficción, ciencia"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "pb-campo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Idioma" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: espacio?.idioma || "es",
										onChange: (e) => setEspacio({
											...espacio || {},
											idioma: e.target.value
										}),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "es",
												children: "Español"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "en",
												children: "English"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "otro",
												children: "Otro / todos"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn primary",
									style: { width: "100%" },
									onClick: guardarEspacio,
									children: "📡 Publicar AD_SPACE en los relays"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ads-modo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Modo de lectura (cuántos anuncios ves)" }), Object.entries(MODOS).map(([id, m]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "ads-modo-btn" + (modo === id ? " on" : ""),
										onClick: () => cambiarModo(id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.icono }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.nombre }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: m.desc })
										]
									}, id))]
								})
							]
						})
					]
				})
			]
		})
	});
}
function QrFactura({ factura, sats }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current || !factura) return;
		try {
			const img = new Image();
			img.onload = () => {
				const ctx = ref.current.getContext("2d");
				ctx.clearRect(0, 0, 240, 240);
				ctx.drawImage(img, 0, 0, 240, 240);
			};
			img.src = qrDataUrl("lightning:" + factura, 240);
		} catch (e) {
			console.warn("[qr ln]", e?.message || e);
		}
	}, [factura]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ads-qr",
		style: { textAlign: "center" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref,
			width: 240,
			height: 240,
			style: {
				background: "#fff",
				borderRadius: 12,
				padding: 6
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
			style: {
				color: "var(--fg-dim)",
				display: "block",
				marginTop: 6
			},
			children: [
				"Paga ",
				satsFmt(sats),
				" (",
				sats,
				" sats) escaneando con tu wallet Lightning"
			]
		})]
	});
}
//#endregion
export { LumenAds as default };
