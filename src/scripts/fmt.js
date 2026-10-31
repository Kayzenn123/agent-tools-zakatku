/* fmt.js — parsing & format angka Indonesia. Murni, tanpa DOM. */
export const rupiah = (n) =>
  'Rp' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(n || 0));

export const gram = (n) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(n || 0) + ' g';

/** Terima "1.500.000", "1500000", " 2,5 " -> number. Kembalikan NaN kalau bukan angka. */
export function parseAngka(str) {
  if (str == null) return NaN;
  const s = String(str).trim();
  if (!s) return NaN;
  // koma sebagai desimal hanya bila diikuti 1-2 digit di akhir dan tanpa titik ribuan
  let norm = s;
  if (/,\d{1,2}$/.test(s) && !/\.\d{3}/.test(s)) norm = s.replace(/\./g, '').replace(',', '.');
  else norm = s.replace(/[^\d-]/g, '');
  const n = Number(norm);
  return Number.isFinite(n) ? n : NaN;
}

/** Validasi satu field angka: {ok, value, pesan} */
export function validasiAngka(str, { label, wajib = false, min = 0, maks = 1e15 } = {}) {
  const kosong = str == null || String(str).trim() === '';
  if (kosong) {
    if (wajib) return { ok: false, value: 0, pesan: `${label} wajib diisi, Bos — isi dulu angkanya.` };
    return { ok: true, value: 0, pesan: '' };
  }
  const n = parseAngka(str);
  if (!Number.isFinite(n)) return { ok: false, value: 0, pesan: `${label} bukan angka yang sah — cek lagi ketikannya.` };
  if (n < min) return { ok: false, value: 0, pesan: `${label} tidak boleh minus.` };
  if (n > maks) return { ok: false, value: 0, pesan: `${label} kegedean — maksimal ${rupiah(maks)}.` };
  return { ok: true, value: n, pesan: '' };
}
