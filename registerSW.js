if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Si ya había un SW viejo controlando la página y entra uno nuevo,
    // recargamos solos UNA vez para que el usuario vea la versión nueva
    // sin tener que refrescar a mano.
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) { hadController = true; return; }
      if (sessionStorage.getItem('lumen-sw-reload')) return;
      sessionStorage.setItem('lumen-sw-reload', '1');
      location.reload();
    });
    // v137: el SW cambia de archivo en cada entrega mayor. Si queda uno
    // viejo registrado (sw.js, sw-vXXX.js anteriores), se desregistra para
    // que la caché antigua no siga sirviendo una versión vieja.
    const esActual = (u) => !!u && u.indexOf("sw-v173.js") !== -1;
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const r of regs) {
        if (!esActual(r.active && r.active.scriptURL) &&
            !esActual(r.waiting && r.waiting.scriptURL) &&
            !esActual(r.installing && r.installing.scriptURL)) {
          r.unregister().catch(() => {});
        }
      }
    }).catch(() => {});
    navigator.serviceWorker.register('./sw-v173.js', { scope: './' })
      .then((reg) => { reg.update && reg.update(); })
      .catch(() => {});
  });
}
