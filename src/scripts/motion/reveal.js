/* reveal.js — LAPISAN E: clip-path reveal saat section masuk viewport + Flip ganti tab. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { gerakEsensial } from './mode.js';

gsap.registerPlugin(ScrollTrigger, Flip);
let ctx = null;

export function init() {
  if (!gerakEsensial()) return;
  ctx = gsap.context(() => {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'inset(12% 6% 12% 6% round 0px)', opacity: 0.35 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', opacity: 1,
          duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
    });
  });
}

/** Ganti lembar arsip dengan Flip (dipanggil hanya bila chunk gerak sudah siap). */
export function gantiLembar(showEl) {
  const wrap = document.getElementById('lembar-wrap');
  if (!wrap || !showEl) return;
  const state = Flip.getState(wrap);
  document.querySelectorAll('.lembar').forEach((l) => { l.hidden = l !== showEl; });
  Flip.from(state, { duration: 0.55, ease: 'power2.inOut', absolute: true, scale: true });
  ScrollTrigger.refresh();
}

export function destroy() {
  if (ctx) { ctx.revert(); ctx = null; }
}
