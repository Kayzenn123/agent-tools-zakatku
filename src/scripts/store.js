/* store.js — riwayat perhitungan di localStorage. Key berversi, parse aman. */
const KEY = 'zakatku.riwayat.v1';
const MAKS = 50;

function bacaMentah() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x) => x && typeof x === 'object' && typeof x.id === 'string' && typeof x.jenis === 'string' && x.hasil && typeof x.hasil === 'object'
    );
  } catch {
    return [];
  }
}

export function daftarRiwayat() {
  return bacaMentah().sort((a, b) => b.ts - a.ts);
}

export function simpanRiwayat(entri) {
  const arr = bacaMentah();
  arr.unshift({ id: 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), ts: Date.now(), ...entri });
  try {
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAKS)));
  } catch { /* penyimpanan penuh/diblokir: abaikan, hitung tetap jalan */ }
  return arr.length;
}

export function hapusRiwayat(id) {
  try {
    localStorage.setItem(KEY, JSON.stringify(bacaMentah().filter((x) => x.id !== id)));
  } catch { /* abaikan */ }
}

export function kosongkanRiwayat() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* abaikan */ }
}
