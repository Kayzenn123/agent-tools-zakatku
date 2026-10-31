/* marquee.js — LAPISAN B: 2 marquee vertikal berlawanan + skew velocity + tombol jeda. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gerakPenuh } from './mode.js';

gsap.registerPlugin(ScrollTrigger);
let st = null;

export function init() {
  const bars = document.querySelectorAll('.vmq');
  if (!bars.length) return;
  if (!gerakPenuh()) return;
  // skew mengikuti kecepatan scroll (skewX untuk marquee vertikal)
  const setter = gsap.quickSetter('.vmq-track', 'skewX', 'deg');
  const clampSkew = gsap.utils.clamp(-6, 6);
  let raf = 0;
  st = ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clampSkew(self.getVelocity() / -350);
      setter(skew);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setter(0));
    },
  });
}

export function destroy() {
  if (st) { st.kill(); st = null; }
}
