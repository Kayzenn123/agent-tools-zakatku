/* share.js — salin WA & unduh JSON. Pakai textContent di pemanggil, jangan innerHTML. */
import { rupiah } from './fmt.js';

export async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = teks;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function unduhJSON(namaFile, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = namaFile;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export function teksWA(jenis, hasil, url) {
  const garis = '--------------------------';
  if (jenis === 'mal') {
    const s = hasil.wajib ? 'WAJIB — haul 1 tahun terpenuhi' : hasil.haul ? 'BELUM WAJIB — di bawah nisab' : 'BELUM WAJIB — haul belum 1 tahun';
    return [
      'RESI ZAKAT — ZakatKu', garis,
      'Jenis: Zakat Mal',
      `Total harta bersih: ${rupiah(hasil.harta)}`,
      `Nisab (85 g emas): ${rupiah(hasil.nisab)}`,
      `Status: ${s}`,
      hasil.wajib ? `Zakat 2,5%: ${rupiah(hasil.zakat)}` : `Kurang ${rupiah(hasil.selisih)} lagi menuju nisab`,
      garis, `Hitung ulang: ${url}`,
    ].join('\n');
  }
  if (jenis === 'gaji') {
    return [
      'RESI ZAKAT — ZakatKu', garis,
      'Jenis: Zakat Penghasilan',
      `Total setahun: ${rupiah(hasil.tahunan)}`,
      `Nisab (85 g emas): ${rupiah(hasil.nisab)}`,
      hasil.wajib ? `Zakat 2,5%/tahun: ${rupiah(hasil.zakatTahun)} (≈ ${rupiah(hasil.zakatBulan)}/bulan)` : `Belum wajib — kurang ${rupiah(hasil.selisih)}`,
      garis, `Hitung ulang: ${url}`,
    ].join('\n');
  }
  return [
    'RESI ZAKAT — ZakatKu', garis,
    'Jenis: Zakat Fitrah',
    `Jiwa: ${hasil.jiwa} × 2,5 kg`,
    `Per jiwa: ${rupiah(hasil.perJiwa)}`,
    `Total: ${rupiah(hasil.total)}`,
    garis, `Hitung ulang: ${url}`,
  ].join('\n');
}
