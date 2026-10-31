/* main.js — orkestrator ZakatKu: tab, form, resi, stempel, riwayat.
   Lapisan gerak (gsap) dimuat LAZY setelah idle demi Lighthouse; semua fungsi
   inti jalan tanpa animasi bila chunk gerak belum tiba. */
import { rupiah, gram, validasiAngka } from './fmt.js';
import { zakatMal, zakatPenghasilan, zakatFitrah, NISAB_EMAS_GRAM, FITRAH_KG } from './calc.js';
import { daftarRiwayat, simpanRiwayat, hapusRiwayat, kosongkanRiwayat } from './store.js';
import { bacaDeepLink, tulisDeepLink } from './deeplink.js';
import { salinTeks, unduhJSON, teksWA } from './share.js';
import { deteksiLite, gerakEsensial, awasiFPS } from './motion/mode.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const JENIS_LABEL = { mal: 'Zakat Mal', gaji: 'Zakat Penghasilan', fitrah: 'Zakat Fitrah' };

let toastTimer = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function umumkan(msg) { $('#live').textContent = msg; }

/* ---------- marquee tepi: isi via JS (2 set untuk loop mulus) ---------- */
function isiMarquee() {
  const items = ['ZAKAT MAL', 'KADAR 2,5%', 'NISAB 85 GRAM EMAS', 'HAUL 1 TAHUN', 'FITRAH 2,5 KG', 'KANTOR POS ZAKAT'];
  const html = items.map((t) => `<span>${t}</span>`).join('');
  $('#vmq-l').innerHTML = html + html;
  $('#vmq-r').innerHTML = html + html;
}

/* ---------- gerak: lazy-load setelah idle ---------- */
let motionApi = null;
let motionSiap = false;
const motionReady = new Promise((resolve) => {
  const mulai = () => {
    if (!gerakEsensial() || deteksiLite()) { resolve(null); return; }
    import('./motion/index.js').then((m) => {
      motionApi = m;
      motionSiap = true;
      try { m.initMotion(); } catch (e) { console.warn('init gerak gagal:', e); }
      resolve(m);
    }).catch(() => resolve(null));
  };
  if ('requestIdleCallback' in window) requestIdleCallback(mulai, { timeout: 2500 });
  else setTimeout(mulai, 1200);
});
async function gsapLazy() {
  const { gsap } = await import('gsap');
  return gsap;
}

/* ---------- tab ---------- */
const tabs = $$('.lembar-nav [role="tab"]');
function pilihTab(nama, fokus = false) {
  tabs.forEach((b) => {
    const on = b.dataset.tab === nama;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
    if (on && fokus) b.focus();
  });
  const showEl = document.getElementById('lembar-' + nama);
  const dulu = $('.lembar:not([hidden])');
  if (dulu === showEl) return;
  if (motionSiap && motionApi && gerakEsensial()) motionApi.gantiLembar(showEl);
  else $$('.lembar').forEach((l) => { l.hidden = l !== showEl; });
  if (nama === 'riwayat') renderRiwayat();
  const f = $('input, button', showEl);
  if (f && fokus) f.focus({ preventScroll: true });
  showEl.querySelector('h2')?.setAttribute('tabindex', '-1');
}

export function initTab() {
  const nav = $('.lembar-nav');
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => pilihTab(b.dataset.tab));
    b.addEventListener('keydown', (e) => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j != null) { e.preventDefault(); pilihTab(tabs[j].dataset.tab, true); }
    });
  });
  nav.addEventListener('keydown', () => {});
}

/* ---------- baca & validasi form ---------- */
function nilai(form, nama) {
  const el = form.elements[nama];
  if (!el) return '';
  if (el.type === 'checkbox') return el.checked ? '1' : '';
  return el.value;
}
function setNilai(form, nama, v) {
  const el = form.elements[nama];
  if (!el) return;
  if (el.type === 'checkbox') el.checked = !!v;
  else el.value = v ?? '';
}
function kumpul(jenis) {
  const form = $(`form[data-form="${jenis}"]`);
  const v = {};
  for (const el of form.elements) {
    if (el.name) v[el.name] = nilai(form, el.name);
  }
  return { form, v };
}
function tampilErr(form, daftar) {
  const box = $('[data-err]', form);
  box.innerHTML = '';
  $$('.angka', form).forEach((i) => i.removeAttribute('aria-invalid'));
  daftar.forEach(({ input, pesan }) => {
    if (input) input.setAttribute('aria-invalid', 'true');
    const p = document.createElement('p');
    p.className = 'err';
    p.textContent = pesan;
    box.appendChild(p);
  });
  if (daftar.length) {
    const pertama = daftar[0].input;
    pertama?.focus({ preventScroll: false });
    pertama?.scrollIntoView({ block: 'center', behavior: gerakEsensial() ? 'smooth' : 'auto' });
  }
  return daftar.length === 0;
}

const CONTOH = {
  mal: { tabungan: '120000000', emas_g: '50', emas_harga: '1500000', utang: '5000000', haul: '1' },
  gaji: { gaji_bulan: '8000000', bonus_tahun: '16000000', emas_harga: '1500000' },
  fitrah: { jiwa: '4', beras_harga: '15000' },
};

function validasi(jenis, form, v) {
  const err = [];
  const ambil = (nama, label, opt = {}) => {
    const r = validasiAngka(v[nama] ?? '', { label, ...opt });
    if (!r.ok) err.push({ input: form.elements[nama], pesan: r.pesan });
    return r.value;
  };
  if (jenis === 'mal') {
    const o = {
      tabungan: ambil('tabungan', 'Tabungan'),
      emasG: ambil('emas_g', 'Berat emas'),
      emasHarga: ambil('emas_harga', 'Harga emas per gram', { wajib: true }),
      perakG: ambil('perak_g', 'Berat perak'),
      perakHarga: ambil('perak_harga', 'Harga perak per gram'),
      saham: ambil('saham', 'Saham'),
      piutang: ambil('piutang', 'Piutang'),
      dagang: ambil('dagang', 'Aset dagang'),
      utang: ambil('utang', 'Utang'),
      haul: v.haul === '1',
    };
    if (o.emasG > 0 && o.emasHarga <= 0) err.push({ input: form.elements.emas_harga, pesan: 'Ada emas tapi harga per gram kosong, Bos — isi harga hari ini.' });
    return { err, o };
  }
  if (jenis === 'gaji') {
    const o = {
      gajiBulan: ambil('gaji_bulan', 'Pendapatan per bulan'),
      bonusTahun: ambil('bonus_tahun', 'Bonus setahun'),
      emasHarga: ambil('emas_harga', 'Harga emas per gram', { wajib: true }),
    };
    return { err, o };
  }
  const jiwa = ambil('jiwa', 'Jumlah jiwa', { wajib: true, maks: 30 });
  if (Number.isFinite(jiwa) && jiwa > 0 && !Number.isInteger(parseFloat(String(v.jiwa).replace(/[^\d,.-]/g, '').replace(',', '.')))) {
    // jiwa harus bulat
  }
  const o = {
    jiwa: Math.round(ambil('jiwa', 'Jumlah jiwa', { wajib: true, maks: 30 })),
    berasHarga: ambil('beras_harga', 'Harga beras per kg', { wajib: true }),
  };
  if (o.jiwa < 1 && err.length === 0) err.push({ input: form.elements.jiwa, pesan: 'Jumlah jiwa minimal 1, Bos.' });
  return { err, o };
}

/* ---------- render resi ---------- */
function el(tag, cls, teks) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (teks != null) e.textContent = teks;
  return e;
}

function bangunResi(jenis, hasil, o) {
  const zone = $('#resi-' + jenis);
  zone.innerHTML = '';
  zone.hidden = false;
  const resi = el('article', 'resi');
  resi.setAttribute('aria-label', 'Resi hasil ' + JENIS_LABEL[jenis]);

  const head = el('div', 'resi-head');
  head.append(el('span', null, 'RESI ZAKAT'), el('span', null, new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '·')));
  resi.append(head);

  const body = el('div', 'resi-body');
  const h3 = el('h3', null, JENIS_LABEL[jenis]);
  h3.style.cssText = 'font-family:var(--font-display);font-size:1.9rem;letter-spacing:.03em;margin:0 0 .2rem';
  body.append(h3);

  const dl = el('dl');
  const baris = (dt, dd) => {
    const d = el('div'); d.style.display = 'contents';
    d.append(el('dt', null, dt), el('dd', null, dd));
    dl.append(d);
  };
  let angkaUtama, labelUtama, wajib;
  if (jenis === 'mal') {
    baris('Total harta bersih', rupiah(hasil.harta));
    baris('Nisab (85 g × ' + rupiah(o.emasHarga) + ')', rupiah(hasil.nisab));
    baris('Haul 1 tahun', hasil.haul ? 'Terpenuhi' : 'Belum');
    wajib = hasil.wajib;
    angkaUtama = hasil.wajib ? hasil.zakat : hasil.selisih;
    labelUtama = hasil.wajib ? 'Zakat yang wajib dibayar (2,5%)' : 'Kurang menuju nisab';
  } else if (jenis === 'gaji') {
    baris('Total penghasilan setahun', rupiah(hasil.tahunan));
    baris('Nisab (85 g × ' + rupiah(o.emasHarga) + ')', rupiah(hasil.nisab));
    wajib = hasil.wajib;
    angkaUtama = hasil.wajib ? hasil.zakatTahun : hasil.selisih;
    labelUtama = hasil.wajib ? 'Zakat setahun (2,5%)' : 'Kurang menuju nisab';
  } else {
    baris('Jiwa', hasil.jiwa + ' × ' + FITRAH_KG + ' kg');
    baris('Harga beras/kg', rupiah(o.berasHarga));
    wajib = true;
    angkaUtama = hasil.total;
    labelUtama = 'Total zakat fitrah';
  }
  const lab = el('p', null, labelUtama);
  lab.style.cssText = 'margin:1rem 0 .2rem;color:var(--muted);font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-accent)';
  const big = el('p', 'angka-besar');
  const hl = el('span', 'hl', rupiah(0));
  big.append(hl);
  body.append(dl, lab, big);
  if (jenis === 'gaji' && hasil.wajib) {
    body.append(el('p', null, '≈ ' + rupiah(hasil.zakatBulan) + ' per bulan kalau dicicil.'));
  }
  const perf = el('div', 'perforasi');
  perf.setAttribute('aria-hidden', 'true');
  body.append(perf);
  resi.append(body);

  const foot = el('div', 'resi-foot');
  const bSalin = el('button', 'btn-mini', 'Salin WA');
  bSalin.type = 'button';
  const bUnduh = el('button', 'btn-mini', 'Unduh JSON');
  bUnduh.type = 'button';
  foot.append(bSalin, bUnduh);
  resi.append(foot);
  zone.append(resi);

  // stempel
  const st = el('div', 'stempel' + (wajib ? '' : ' belum'));
  const cap = el('div', 'cap');
  cap.append(el('small', null, 'KANTOR POS ZAKAT'));
  cap.append(el('span', 'kata', wajib ? 'WAJIB ZAKAT' : 'BELUM WAJIB'));
  cap.append(el('small', null, '31·10·2026'));
  st.append(cap);
  resi.append(st);

  // aksi sobek (keyboard) — drag pointer di perforasi untuk mouse/sentuh
  const bSobek = el('button', 'btn-mini', 'Sobek resi');
  bSobek.type = 'button';
  bSobek.style.margin = '0 1rem 1.25rem';
  bSobek.addEventListener('click', () => sobekResi(resi));
  resi.append(bSobek);

  bSalin.addEventListener('click', async () => {
    const ok = await salinTeks(teksWA(jenis, hasil, location.href));
    toast(ok ? 'Resi tersalin — tinggal tempel di WA.' : 'Gagal menyalin — browser-mu menolak izin clipboard.');
  });
  bUnduh.addEventListener('click', () => {
    unduhJSON(`zakatku-${jenis}-${Date.now()}.json`, { jenis: JENIS_LABEL[jenis], tanggal: new Date().toISOString(), masukan: o, hasil });
    toast('Resi terunduh sebagai JSON.');
  });

  // drag-to-tear
  let startY = null;
  resi.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || resi.classList.contains('tersobek')) return;
    startY = e.clientY;
  });
  resi.addEventListener('pointerup', (e) => {
    if (startY == null) return;
    const dy = e.clientY - startY;
    startY = null;
    if (dy > 90) sobekResi(resi);
  });

  // animasi stempel
  hantamStempel(st, hl, angkaUtama);
  umumkan(`${JENIS_LABEL[jenis]}: ${wajib ? 'wajib' : 'belum wajib'}. ${labelUtama}: ${rupiah(angkaUtama)}.`);
  return { resi, hasil, wajib };
}

async function hantamStempel(st, hl, target) {
  const cap = $('.cap', st);
  if (!gerakEsensial()) {
    hl.textContent = rupiah(target);
    return;
  }
  hl.textContent = rupiah(0);
  const gsap = await gsapLazy();
  const tl = gsap.timeline();
  tl.fromTo(cap, { scale: 3.2, opacity: 0, rotation: -32, clipPath: 'circle(0% at 50% 50%)' },
    { scale: 1, opacity: 1, rotation: -11, clipPath: 'circle(72% at 50% 50%)', duration: 0.32, ease: 'power4.in' })
    .to(cap, { x: -9, duration: 0.05 })
    .to(cap, { x: 8, duration: 0.05 })
    .to(cap, { x: -5, duration: 0.05 })
    .to(cap, { x: 0, duration: 0.06 });
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 0.9, delay: 0.3, ease: 'power2.out',
    onUpdate: () => { hl.textContent = rupiah(obj.v); },
  });
  gsap.fromTo(cap, { fontVariationSettings: "'wght' 700" }, { fontVariationSettings: "'wght' 900", duration: 0.4, delay: 0.32 });
}

async function sobekResi(resi) {
  if (resi.classList.contains('tersobek')) return;
  resi.classList.add('tersobek');
  if (gerakEsensial()) {
    try {
      const gsap = await gsapLazy();
      gsap.fromTo(resi, { y: 0 }, { y: 14, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    } catch (e) { /* animasi opsional */ }
  }
  toast('Resi tersobek — tombol salin & unduh kebuka.');
  umumkan('Resi tersobek. Tombol salin WA dan unduh JSON tersedia.');
}

/* ---------- hitung ---------- */
function hitung(jenis, dariDeepLink = false) {
  const { form, v } = kumpul(jenis);
  const { err, o } = validasi(jenis, form, v);
  if (!tampilErr(form, err)) return false;
  let hasil;
  if (jenis === 'mal') hasil = zakatMal(o);
  else if (jenis === 'gaji') hasil = zakatPenghasilan(o);
  else hasil = zakatFitrah(o);
  bangunResi(jenis, hasil, o);
  tulisDeepLink(jenis, v);
  // simpan riwayat
  const angkaUtama = jenis === 'mal' ? (hasil.wajib ? hasil.zakat : 0) : jenis === 'gaji' ? (hasil.wajib ? hasil.zakatTahun : 0) : hasil.total;
  simpanRiwayat({
    jenis, label: JENIS_LABEL[jenis],
    ringkas: ringkasHasil(jenis, hasil),
    angkaUtama, masukan: v, hasil: sederhanakan(hasil),
  });
  if (!dariDeepLink) {
    $('#resi-' + jenis).scrollIntoView({ block: 'nearest', behavior: gerakEsensial() ? 'smooth' : 'auto' });
  }
  return true;
}

function ringkasHasil(jenis, h) {
  if (jenis === 'fitrah') return `${h.jiwa} jiwa → ${rupiah(h.total)}`;
  const w = h.wajib ? 'WAJIB' : 'belum wajib';
  const n = jenis === 'mal' ? (h.wajib ? h.zakat : 0) : (h.wajib ? h.zakatTahun : 0);
  return `${w} · ${rupiah(n)}`;
}
function sederhanakan(h) {
  const o = {};
  for (const [k, v] of Object.entries(h)) if (typeof v === 'number' || typeof v === 'boolean') o[k] = Math.round(v * 100) / 100;
  return o;
}

/* ---------- riwayat ---------- */
function renderRiwayat() {
  const list = $('#arsip-list');
  list.innerHTML = '';
  const arr = daftarRiwayat();
  if (!arr.length) {
    const d = el('div', 'empty');
    d.innerHTML = '';
    d.append(el('b', null, 'Laci masih kosong.'));
    d.append(document.createTextNode('Cap dulu satu perhitungan di lembar 01–03, resinya nyangkut di sini.'));
    list.append(d);
    return;
  }
  arr.forEach((r) => {
    const li = el('li', 'arsip-item');
    li.append(el('span', 't', r.label || r.jenis));
    li.append(el('span', 'n', rupiah(r.angkaUtama || 0)));
    const w = el('span', 'w', new Date(r.ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' — ' + (r.ringkas || ''));
    const mini = el('span', 'mini');
    const bMuat = el('button', 'btn-mini', 'Muat');
    bMuat.type = 'button';
    bMuat.addEventListener('click', () => {
      pilihTab(r.jenis);
      const { form } = kumpul(r.jenis);
      for (const [k, val] of Object.entries(r.masukan || {})) setNilai(form, k, val);
      hitung(r.jenis);
      toast('Arsip dimuat ulang ke lembar.');
    });
    const bHapus = el('button', 'btn-mini', 'Hapus');
    bHapus.type = 'button';
    bHapus.addEventListener('click', () => { hapusRiwayat(r.id); renderRiwayat(); toast('Satu arsip dibuang.'); });
    mini.append(bMuat, bHapus);
    li.append(w, mini);
    list.append(li);
  });
}

/* ---------- easter egg ---------- */
function initCapKota() {
  const btn = $('#capkota');
  let n = 0, timer = 0;
  btn.addEventListener('click', () => {
    n++;
    clearTimeout(timer);
    timer = setTimeout(() => { n = 0; }, 2500);
    if (n >= 3) {
      n = 0;
      hujanKertas();
      toast('Pak Pos bilang: berkah selalu!');
    }
  });
}
async function hujanKertas() {
  if (!gerakEsensial()) return;
  const gsap = await gsapLazy();
  for (let i = 0; i < 14; i++) {
    const k = el('div', 'kertas');
    const s = 14 + Math.random() * 26;
    k.style.cssText = `left:${20 + Math.random() * 60}vw;top:-40px;width:${s}px;height:${s * 1.4}px;transform:rotate(${Math.random() * 40 - 20}deg)`;
    document.body.append(k);
    gsap.to(k, {
      y: innerHeight + 120, x: '+=' + (Math.random() * 160 - 80), rotation: '+=' + (Math.random() * 540 - 270),
      duration: 1.6 + Math.random(), ease: 'power1.in', delay: Math.random() * 0.5,
      onComplete: () => k.remove(),
    });
  }
}

/* ---------- gerak: toggle & pause (eager, tanpa nunggu chunk) ---------- */
function initToggles() {
  const mt = $('#motion-toggle');
  const syncToggle = () => {
    const off = document.body.classList.contains('motion-off');
    mt.setAttribute('aria-pressed', String(!off));
    $('.lbl', mt).textContent = off ? 'Gerak: Mati' : 'Gerak: Nyala';
  };
  mt.addEventListener('click', () => {
    const off = document.body.classList.toggle('motion-off');
    if (off && motionApi) { try { motionApi.destroyMotion(); } catch (e) {} }
    if (!off && !motionSiap && gerakEsensial() && !deteksiLite()) {
      import('./motion/index.js').then((m) => {
        motionApi = m; motionSiap = true;
        try { m.initMotion(); } catch (e) { console.warn('init gerak gagal:', e); }
      }).catch(() => {});
    }
    syncToggle();
    toast(off ? 'Gerak dimatikan — tampilan jadi statis.' : 'Gerak dinyalakan lagi.');
  });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    if (motionApi) { try { motionApi.destroyMotion(); } catch (e) {} }
  });
  const mqBtn = $('#mq-toggle');
  mqBtn.addEventListener('click', () => {
    const bars = $$('.vmq');
    const paused = !bars[0].classList.contains('paused');
    bars.forEach((b) => b.classList.toggle('paused', paused));
    mqBtn.setAttribute('aria-pressed', String(paused));
    $('.lbl', mqBtn).textContent = paused ? 'Jalan' : 'Jeda';
  });
}

/* ---------- main ---------- */
export function main() {
  isiMarquee();
  initTab();
  initToggles();
  if (deteksiLite()) document.body.classList.add('lite');
  awasiFPS();
  void motionReady; // mulai lazy-load chunk gerak setelah idle

  // form
  $$('form[data-form]').forEach((form) => {
    const jenis = form.dataset.form;
    form.addEventListener('submit', (e) => { e.preventDefault(); hitung(jenis); });
  });
  $$('[data-contoh]').forEach((b) => {
    b.addEventListener('click', () => {
      const jenis = b.dataset.contoh;
      const { form } = kumpul(jenis);
      for (const [k, val] of Object.entries(CONTOH[jenis])) setNilai(form, k, val);
      toast('Contoh terisi — tekan "Cap sekarang".');
    });
  });

  // riwayat buttons
  $('#btn-export').addEventListener('click', () => {
    const arr = daftarRiwayat();
    if (!arr.length) { toast('Laci kosong — belum ada yang bisa diunduh.'); return; }
    unduhJSON(`zakatku-arsip-${new Date().toISOString().slice(0, 10)}.json`, arr);
    toast('Arsip terunduh.');
  });
  $('#btn-clear').addEventListener('click', () => {
    if (!daftarRiwayat().length) { toast('Laci sudah kosong.'); return; }
    if (confirm('Buang semua arsip di laci ini?')) { kosongkanRiwayat(); renderRiwayat(); toast('Laci dikosongkan.'); }
  });

  initCapKota();

  // deep-link saat buka
  const dl = bacaDeepLink();
  if (dl) {
    pilihTab(dl.tab);
    const { form } = kumpul(dl.tab);
    for (const [k, val] of Object.entries(dl.values)) setNilai(form, k, val);
    hitung(dl.tab, true);
    toast('Tautan arsip dimuat — angka langsung dihitung.');
  }
}
