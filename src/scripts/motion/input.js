/* input.js — LAPISAN D: senter kursor (lampu meja arsip) + magnetic button. */
import { gsap } from 'gsap';
import { gerakPenuh } from './mode.js';

let off = [];
export function init() {
  if (!gerakPenuh()) return;
  if (matchMedia('(pointer: coarse)').matches) return;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('spot-on');
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--sx', ((e.clientX - r.left) / r.width) * 100 + '%');
      hero.style.setProperty('--sy', ((e.clientY - r.top) / r.height) * 100 + '%');
    };
    hero.addEventListener('pointermove', move, { passive: true });
    off.push(() => hero.removeEventListener('pointermove', move));
  }
  document.querySelectorAll('.magnetic').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.25, ease: 'power3' });
    const move = (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    };
    const leave = () => { xTo(0); yTo(0); };
    btn.addEventListener('pointermove', move, { passive: true });
    btn.addEventListener('pointerleave', leave);
    off.push(() => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); });
  });
}

export function destroy() {
  off.forEach((fn) => fn());
  off = [];
}
