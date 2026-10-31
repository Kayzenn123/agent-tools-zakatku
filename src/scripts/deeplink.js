/* deeplink.js — state <-> URL params. Tidak pernah memicu aksi destruktif. */
const DAFTAR = {
  mal: ['tabungan', 'emas_g', 'emas_harga', 'perak_g', 'perak_harga', 'saham', 'piutang', 'dagang', 'utang', 'haul'],
  gaji: ['gaji_bulan', 'bonus_tahun', 'emas_harga'],
  fitrah: ['jiwa', 'beras_harga'],
};

export function bacaDeepLink() {
  const p = new URLSearchParams(location.search);
  const tab = p.get('tab');
  if (!tab || !DAFTAR[tab]) return null;
  const values = {};
  for (const k of DAFTAR[tab]) {
    const v = p.get(k);
    if (v != null && v !== '' && /^[\d.,\s-]{1,20}$/.test(v)) values[k] = v;
  }
  return { tab, values };
}

export function tulisDeepLink(tab, values) {
  const p = new URLSearchParams();
  p.set('tab', tab);
  for (const [k, v] of Object.entries(values)) {
    if (v !== '' && v != null) p.set(k, String(v).slice(0, 20));
  }
  history.replaceState(null, '', '?' + p.toString());
}
