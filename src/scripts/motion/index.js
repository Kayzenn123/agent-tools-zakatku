/* motion/index.js — pintu masuk lazy untuk semua lapisan gerak (A–E).
   Diimpor dinamis setelah idle; tab-switch & stempel tetap jalan tanpa animasi
   kalau chunk ini belum tiba (progressive enhancement). */
import { gerakEsensial } from './mode.js';
import * as camera from './camera.js';
import * as marquee from './marquee.js';
import * as text from './text.js';
import * as inputFx from './input.js';
import { init as revealInit, gantiLembar } from './reveal.js';

export function initMotion() {
  try { camera.init(); } catch (e) { console.warn('gerak A gagal:', e); }
  try { marquee.init(); } catch (e) { console.warn('gerak B gagal:', e); }
  try { text.init(); } catch (e) { console.warn('gerak C gagal:', e); }
  try { inputFx.init(); } catch (e) { console.warn('gerak D gagal:', e); }
  try { revealInit(); } catch (e) { console.warn('gerak E gagal:', e); }
}

export function destroyMotion() {
  [camera, marquee, text, inputFx].forEach((m) => { try { m.destroy(); } catch (e) {} });
}

export { gantiLembar, gerakEsensial };
