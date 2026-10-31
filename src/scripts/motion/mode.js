/* mode.js — gerbang gerak: reduced-motion OS, toggle UI, MODE RINGAN. */
const mq = matchMedia('(prefers-reduced-motion: reduce)');

export function deteksiLite() {
  const hc = navigator.hardwareConcurrency || 8;
  const dm = navigator.deviceMemory || 8;
  const saveData = navigator.connection && navigator.connection.saveData;
  return hc <= 4 || dm <= 4 || !!saveData;
}

/** true bila animasi boleh jalan penuh. */
export function gerakPenuh() {
  return !mq.matches && !document.body.classList.contains('motion-off') && !document.body.classList.contains('lite');
}

/** true bila sedikit gerak esensial masih boleh (tanpa parallax/marquee/senter). */
export function gerakEsensial() {
  return !mq.matches && !document.body.classList.contains('motion-off');
}

export function awasiFPS() {
  // MODE RINGAN dinamis: FPS < 40 selama ~2 detik -> matikan lapisan berat
  let frames = 0;
  const t0 = performance.now();
  function tick() {
    frames++;
    if (performance.now() - t0 >= 2000) {
      const fps = (frames / (performance.now() - t0)) * 1000;
      if (fps < 40 && !document.body.classList.contains('lite')) {
        document.body.classList.add('lite');
      }
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
