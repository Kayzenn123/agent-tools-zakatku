/* text.js — LAPISAN C: split huruf flip 3D + variable wght scrub. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gerakPenuh, gerakEsensial } from './mode.js';

gsap.registerPlugin(ScrollTrigger);
let ctx = null;

function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const frag = document.createDocumentFragment();
  for (const word of text.split(' ')) {
    const w = document.createElement('span');
    w.style.whiteSpace = 'nowrap';
    w.setAttribute('aria-hidden', 'true');
    for (const ch of word) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      w.appendChild(s);
    }
    frag.appendChild(w);
    frag.appendChild(document.createTextNode(' '));
  }
  el.appendChild(frag);
  return el.querySelectorAll('.ch');
}

export function init() {
  const target = document.querySelector('[data-split]');
  if (!target) return;
  const chars = splitChars(target);
  if (!gerakEsensial()) return; // reduced-motion: teks utuh tanpa animasi
  ctx = gsap.context(() => {
    gsap.from(chars, {
      rotationX: -92, y: 26, opacity: 0,
      transformPerspective: 700, transformOrigin: '50% 100%',
      duration: 0.55, ease: 'back.out(1.6)', stagger: 0.028, delay: 0.15,
    });
    // variable-axis: wght Big Shoulders menebal saat scroll (hanya kalau font variable)
    const wght = document.querySelector('[data-wght]');
    if (wght && gerakPenuh()) {
      gsap.fromTo(wght, { fontVariationSettings: "'wght' 400" }, {
        fontVariationSettings: "'wght' 900", ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }
  });
}

export function destroy() {
  if (ctx) { ctx.revert(); ctx = null; }
}
