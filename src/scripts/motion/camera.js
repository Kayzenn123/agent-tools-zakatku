/* camera.js — LAPISAN A: parallax 5 layer hero + zoom-out halus section hasil. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gerakPenuh } from './mode.js';

gsap.registerPlugin(ScrollTrigger);
let ctx = null;

export function init() {
  if (!gerakPenuh()) return;
  ctx = gsap.context(() => {
    // 5 layer parallax di hero: makin dalam, makin pelan
    gsap.utils.toArray('.hero [data-depth]').forEach((el) => {
      const d = parseFloat(el.dataset.depth || '0.1');
      gsap.to(el, {
        yPercent: d * 60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    });
    // zoom-out penutup di zona resi: 1.06 -> 1 (amplitudo kecil, aman vestibular)
    const zona = document.querySelector('#resi-zone .resi');
    if (zona) {
      gsap.fromTo(zona, { scale: 1.06 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '#resi-zone', start: 'top bottom', end: 'center center', scrub: 0.8 },
      });
    }
  });
  addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
}

export function destroy() {
  if (ctx) { ctx.revert(); ctx = null; }
}
