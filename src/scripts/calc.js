/* calc.js — matematika zakat. Murni, tanpa DOM. Angka mengikuti fikih umum:
   - nisab mal = 85 gram emas; haul = 1 tahun; kadar = 2,5%
   - zakat penghasilan: qiyas ke nisab emas, kadar 2,5% (pendapat yang membolehkan)
   - zakat fitrah: 2,5 kg beras/jiwa */
export const KADAR = 0.025;
export const NISAB_EMAS_GRAM = 85;
export const FITRAH_KG = 2.5;

export function nisabRupiah(hargaEmasPerGram) {
  return NISAB_EMAS_GRAM * hargaEmasPerGram;
}

export function zakatMal(i) {
  const emasVal = i.emasG * i.emasHarga;
  const perakVal = (i.perakG || 0) * (i.perakHarga || 0);
  const bruto = i.tabungan + emasVal + perakVal + (i.saham || 0) + (i.piutang || 0) + (i.dagang || 0);
  const harta = Math.max(0, bruto - (i.utang || 0));
  const nisab = nisabRupiah(i.emasHarga);
  const wajib = harta >= nisab && !!i.haul;
  return {
    rincian: { tabungan: i.tabungan, emasVal, perakVal, saham: i.saham || 0, piutang: i.piutang || 0, dagang: i.dagang || 0, bruto, utang: i.utang || 0 },
    harta, nisab, haul: !!i.haul, wajib,
    zakat: wajib ? harta * KADAR : 0,
    selisih: Math.max(0, nisab - harta),
  };
}

export function zakatPenghasilan(i) {
  const tahunan = i.gajiBulan * 12 + (i.bonusTahun || 0);
  const nisab = nisabRupiah(i.emasHarga);
  const wajib = tahunan >= nisab;
  const zakatTahun = wajib ? tahunan * KADAR : 0;
  return { tahunan, nisab, wajib, zakatTahun, zakatBulan: zakatTahun / 12, selisih: Math.max(0, nisab - tahunan) };
}

export function zakatFitrah(i) {
  const perJiwa = FITRAH_KG * i.berasHarga;
  return { jiwa: i.jiwa, perJiwa, total: i.jiwa * perJiwa };
}
