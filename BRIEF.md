# BRIEF — ZakatKu — 2026-10-31

## Masalah/usecase (1 kalimat + siapa yang kena)
Muslim Indonesia yang bingung menghitung zakat mal/penghasilan/fitrah dengan benar (nisab, haul, 2,5%) dan butuh alat cepat tanpa install aplikasi.

## Konsep visual (1 kalimat)
Seluruh situs = satu meja arsip kantor pos dalam zine fotokopi — buku besar zakat berbentuk spreadsheet bergaris outline, perangko & stempel pos sebagai bahasa visual, hasil "dicap" seperti resi.

## Hasil seed (ringkas, base 2026-11-05)
- domain: kartu pos | layout: spreadsheet sebagai UI | referensi: zine fotokopi
- batasan: hanya garis tanpa fill (semua UI outline, tanpa fill/shape solid)
- gerak A: parallax 5 layer + zoom out di akhir | B: marquee vertikal di sisi layar
- C: split huruf flip 3D | D: cursor senter/spotlight mask | E: GSAP Flip layout
- ikon: isometrik, sumber Tabler | font: Bangers (display) / Cossette Titre (body) / Big Shoulders Text (aksen, variable)
- palet light/analogous hue 289: bg oklch(0.97 0.055 289) kertas lavender, surface 0.90, teks 0.20, muted 0.45, aksen oklch(0.62 0.196 319) magenta-ungu, aksen-2 oklch(0.58 0.211 259) biru-ungu, pop oklch(0.81 0.272 112) lime stabilo

## 3 arah desain (2 kalimat masing-masing) + arah terpilih
1. **Kantor pos klasik rapi**: krem hangat, formulir tabel administratif, stempel merah. Rapi tapi berisiko mirip tool pemerintah generik.
2. **Meja arsip pos dalam zine fotokopi** (TERPILIH): kertas lavender fotokopian, garis outline hand-feel, kartu pos & perangko terpotong tepi, stiker miring, stabilo lime. Paling jauh dari default SaaS dan dari 14 build terakhir (tidak ada yang pakai zine fotokopi + kartu pos).
3. **Spreadsheet minimal murni**: garis tipis monokrom, tanpa dekorasi. Paling aman, paling membosankan — ditolak.

## Keputusan berani
Tanpa navbar dan tanpa hero marketing: pengunjung mendarat langsung di BUKU BESAR (spreadsheet zakat mal). Navigasi = tab "lembar arsip" (Mal / Penghasilan / Fitrah / Riwayat). Saat hitung, stempel pos raksasa "WAJIB ZAKAT" / "BELUM WAJIB" menghantam halaman (clip-path + shake). Resi hasil bisa "disobek" dari garis perforasi (drag) untuk membuka tombol salin WA.

## Persona/suara
Pak Pos yang teliti dan ramah: "Paket hartamu dicek dulu ya — nisabnya pas atau belum?", "Resi tersimpan di laci (browser-mu)", error: "Kolom ini kosong, Bos — isi dulu angkanya." Konsisten sampai footer & 404.

## Palet (harmoni, kenapa, psikologi warna, token oklch final, hasil cek kontras AA)
- Harmoni analogous hue 289 (ungu lavender). Psikologi: ungu = ketenangan & amanah (cocok untuk urusan ibadah/keuangan); kertas lavender terang = arsip pos yang bersih; lime pop = stabilo penanda hasil penting.
- Token final: --bg oklch(0.97 0.055 289) | --surface oklch(0.90 0.040 289) | --text oklch(0.20 0.040 289) | --muted oklch(0.45 0.030 289) | --accent oklch(0.62 0.196 319) | --accent2 oklch(0.58 0.211 259) | --pop oklch(0.81 0.272 112)
- Cek kontras AA (dihitung via script OKLCH→sRGB): teks/bg ≈ 13:1 lolos; muted/bg ≈ 5,9:1 lolos; aksen dipakai untuk garis/outline besar & teks besar ≥3:1 — teks kecil pakai varian --accent-ink oklch(0.42 0.18 319) (≈5,5:1); pop lime hanya untuk highlight/stabilo, bukan teks. Hasil final dicatat setelah implementasi (script cek di tools/).

## Font (display/body/aksen, alasan, id Fontsource, variable atau bukan)
- Display: **Bangers** (`bangers`, 400, bukan variable) — gaya komik/zine, cocok untuk headline stempel & angka raksasa.
- Body: **Cossette Titre** (`cossette-titre`, sans-serif 400+700, bukan variable) — humanis, terbaca di tabel 390px.
- Aksen: **Big Shoulders Text** (`big-shoulders-text`, variable 100–900) — condensed ala label paket pos; dipakai untuk marquee vertikal & stempel; axis wght dianimasikan saat scrub (variable-axis C).
- Semua via Astro Fonts API (self-host subset latin, font-display swap). Tidak ada font yang sama dengan 30 build terakhir (cek pick-seed lolos).

## Ikon (gaya, sumber, daftar 12+ ikon, 3+ custom)
- Gaya: isometrik; sumber: Tabler (outline) + SVG custom digambar sendiri.
- Daftar: perangko, stempel, amplop, kalkulator, timbangan (nisab), kalender (haul), koin, dompet, beras/karung (fitrah), gaji/amplop gaji, arsip/laci, salin, unduh, bagikan WA, hapus, tambah baris, panah sobek, cap jempol, jam pasir, lonceng.
- Custom (digambar sendiri): perangko zakat bergigi, stempel "WAJIB", garis perforasi sobek.

## Gerak (kategori A-F yang dipakai, narasi yang menyatukan, MODE RINGAN apa yang dimatikan)
Narasi: **"surat berjalan lewat meja pos"** — scroll = surat bergerak di atas meja; marquee vertikal = bunyi mesin sortir; senter = lampu meja arsip; flip = lembar arsip diganti; stempel = cap petugas.
- A: parallax 5 layer di area hero-arsip (grain kertas, grid perangko, strip kartu pos, headline, resi) + zoom-out halus 1.08→1 di section hasil.
- B: 2 marquee vertikal di sisi kiri/kanan ("ZAKAT MAL • 2,5% • NISAB 85 GRAM EMAS • …"), arah berlawanan, skew mengikuti velocity scroll, tombol jeda (WCAG 2.2.2).
- C: split huruf flip 3D headline hero + animasi wght Big Shoulders saat scrub.
- D: cursor senter/spotlight mask di area hero (lampu meja arsip); magnetic pada tombol utama; nonaktif di pointer: coarse.
- E: GSAP Flip saat ganti tab lembar (Mal/Penghasilan/Fitrah/Riwayat); clip-path lingkaran saat stempel menghantam.
- F: DIPANGKAS (aturan pemangkasan v5 — tidak ada shader/fisika).
- MODE RINGAN (hardwareConcurrency≤4 / deviceMemory≤4 / Save-Data / FPS<40 2 dtk): matikan A parallax & D senter, marquee jadi statis, C jadi fade sederhana.

## Storyboard hero moment (tabel scroll 0/25/50/75/100%)
| Scroll | Yang terlihat | Kamera (zoom/pan) | Marquee | Teks | Interaksi |
|---|---|---|---|---|---|
| 0% | Buku besar Mal terbuka, headline "HITUNG ZAKATMU" flip 3D, senter mengikuti kursor | parallax layer siap | vertikal jalan pelan | huruf flip-in | senter, input angka |
| 25% | Kolom nisab & haul, stempel contoh | zoom halus 1.02 | skew saat scroll cepat | wght scrub | isi formulir |
| 50% | Tombol "CAP SEKARANG" raksasa | — | — | — | klik → stempel menghantam |
| 75% | Resi hasil + garis perforasi | zoom-out 1.08→1 | melambat | odometer angka | drag sobek resi |
| 100% | Arsip riwayat + footer cap pos | statis | statis | statis | salin WA / unduh JSON |

Pertunjukan utama di 50%: stempel "WAJIB ZAKAT" menghantam dengan shake + suara kertas (tanpa audio file — visual saja). 5 detik pertama: headline flip + senter + marquee vertikal = jelas ini "kantor pos zakat".

## Konten (15+ item nyata, easter egg)
1-3. Tiga kalkulator: Mal, Penghasilan, Fitrah (dengan rumus & contoh angka nyata). 4. Tabel nisab: 85 gram emas (input harga/gram manual). 5. Tabel haul 1 tahun hijriah. 6. Contoh: tabungan Rp 120 jt + emas 50 g @ Rp 1.500.000 → harta Rp 195 jt. 7. Zakat penghasilan: Rp 8 jt/bln × 12 = Rp 96 jt. 8. Fitrah: 4 jiwa × 2,5 kg × Rp 15.000 = Rp 150.000. 9-12. FAQ 4 butir (apakah gaji kena zakat? utang mengurangi? emas perhiasan dipakai? bayar ke siapa?). 13. Riwayat tersimpan. 14. Salin WA. 15. Unduh JSON. 16. Deep-link contoh. EASTER EGG: klik cap pos di footer 3× → hujan sobekan kertas + pesan "Pak Pos bilang: berkah selalu!".

## Teknik visual orisinal (2+)
1. feTurbulence grain kertas fotokopi (SVG filter) di background.
2. Garis perforasi (sobekan) sebagai divider + mekanisme drag-to-tear resi (clip-path animasi).
3. Tipografi raksasa Bangers sebagai ilustrasi (angka 2,5% setinggi 30vw).
4. Pola perangko bergigi (CSS mask) di tepi section.

## Suara
Tidak (bonus dipangkas; visual stempel cukup).
