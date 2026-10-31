// Tes fungsi ZakatKu — dijalankan: node tools/test-fungsi.mjs
import { chromium } from 'playwright';

const BASE = 'http://localhost:8931/';
let gagal = 0;
const cek = (nama, kond, info = '') => {
  console.log((kond ? '  OK  ' : '  GAGAL') + ' ' + nama + (info ? ' — ' + info : ''));
  if (!kond) gagal++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
cek('judul halaman', (await page.title()).startsWith('ZakatKu'));
cek('h1 ada', (await page.locator('h1').count()) === 1);
cek('lang=id', (await page.evaluate(() => document.documentElement.lang)) === 'id');

// --- Zakat Mal: contoh ---
await page.click('[data-contoh="mal"]');
await page.click('form[data-form="mal"] button[type="submit"]');
await page.waitForSelector('#resi-mal .resi', { timeout: 5000 });
await page.waitForTimeout(1700); // tunggu count-up stempel selesai
const resiMal = await page.locator('#resi-mal').innerText();
cek('mal: harta 190jt', resiMal.includes('Rp190.000.000'), resiMal.slice(0, 80));
cek('mal: nisab 127,5jt', resiMal.includes('Rp127.500.000'));
cek('mal: zakat 4.750.000', resiMal.includes('Rp4.750.000'));
cek('mal: stempel WAJIB', resiMal.includes('WAJIB ZAKAT'));
cek('mal: deep-link tertulis', page.url().includes('tab=mal') && page.url().includes('emas_harga=1500000'));

// --- validasi: kosongkan harga emas ---
await page.fill('form[data-form="mal"] [name="emas_harga"]', '');
await page.click('form[data-form="mal"] button[type="submit"]');
await page.waitForTimeout(400);
const errTeks = await page.locator('form[data-form="mal"] [data-err]').innerText();
cek('mal: error harga emas kosong', errTeks.includes('wajib diisi'), errTeks.slice(0, 60));
await page.fill('form[data-form="mal"] [name="emas_harga"]', '1500000');

// --- sobek resi ---
await page.click('#resi-mal button:has-text("Sobek resi")');
await page.waitForTimeout(300);
cek('mal: resi tersobek', await page.locator('#resi-mal .resi.tersobek').count() === 1);
cek('mal: tombol salin muncul', await page.locator('#resi-mal .resi-foot button:has-text("Salin WA")').count() === 1);

// --- Zakat Penghasilan: contoh (112jt < nisab 127,5jt -> belum wajib) ---
await page.click('#tab-gaji');
await page.click('[data-contoh="gaji"]');
await page.click('form[data-form="gaji"] button[type="submit"]');
await page.waitForSelector('#resi-gaji .resi', { timeout: 5000 });
await page.waitForTimeout(1700);
const resiGaji = await page.locator('#resi-gaji').innerText();
cek('gaji: total 112jt', resiGaji.includes('Rp112.000.000'));
cek('gaji: BELUM WAJIB', resiGaji.includes('BELUM WAJIB'));
cek('gaji: selisih 15,5jt', resiGaji.includes('Rp15.500.000'));

// --- Fitrah ---
await page.click('#tab-fitrah');
await page.click('[data-contoh="fitrah"]');
await page.click('form[data-form="fitrah"] button[type="submit"]');
await page.waitForSelector('#resi-fitrah .resi', { timeout: 5000 });
await page.waitForTimeout(1700);
const resiFitrah = await page.locator('#resi-fitrah').innerText();
cek('fitrah: total 150rb', resiFitrah.includes('Rp150.000'));

// --- riwayat ---
await page.click('#tab-riwayat');
await page.waitForTimeout(300);
const nArsip = await page.locator('#arsip-list .arsip-item').count();
cek('riwayat: 3 entri tersimpan', nArsip === 3, 'dapat ' + nArsip);
const ls = await page.evaluate(() => localStorage.getItem('zakatku.riwayat.v1'));
cek('riwayat: localStorage berversi', !!ls && ls.includes('zakatku') === false && JSON.parse(ls).length === 3);

// --- deep-link langsung ---
await page.goto(BASE + '?tab=fitrah&jiwa=2&beras_harga=15000', { waitUntil: 'networkidle' });
await page.waitForSelector('#resi-fitrah .resi', { timeout: 5000 });
await page.waitForTimeout(1700);
const dlTeks = await page.locator('#resi-fitrah').innerText();
cek('deep-link: auto hitung 75rb', dlTeks.includes('Rp75.000'));

// --- tab keyboard ---
await page.click('#tab-mal');
await page.keyboard.press('ArrowRight');
cek('keyboard: panah kanan pindah tab', await page.locator('#tab-gaji').getAttribute('aria-selected') === 'true');

cek('tanpa console/page error', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();
console.log(gagal === 0 ? '\nSEMUA TES LOLOS' : `\n${gagal} TES GAGAL`);
process.exit(gagal === 0 ? 0 : 1);
