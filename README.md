# ZakatKu — Kalkulator Zakat ala Kantor Pos

Hitung **zakat mal, zakat penghasilan, dan zakat fitrah** dalam Bahasa Indonesia —
dibungkus konsep "kantor pos zakat" bergaya zine fotokopi. Isi buku besar, tekan cap,
resinya keluar lengkap dengan stempel **WAJIB ZAKAT / BELUM WAJIB** yang bisa disobek.

**Live:** https://kayzenn123.github.io/agent-tools-zakatku/

## Fitur
- 3 kalkulator: Zakat Mal (nisab 85 g emas, haul 1 tahun, kadar 2,5%), Zakat Penghasilan
  (nisab disamakan emas, tanpa haul), Zakat Fitrah (2,5 kg beras/jiwa)
- Validasi input spesifik ala Pak Pos ("Harga emas per gram wajib diisi, Bos — isi dulu angkanya.")
- Resi hasil: stempel menghantam (clip-path + shake + count-up), drag/sobek garis perforasi
  untuk membuka tombol **Salin WA** & **Unduh JSON**
- Deep-link: `?tab=mal&tabungan=120000000&emas_g=50&emas_harga=1500000&haul=1` — state terbagi lewat tautan
- Riwayat 50 perhitungan di localStorage (key berversi, parse aman) + muat ulang + ekspor JSON
- Tombol contoh sekali klik tiap lembar; 4 FAQ fikih praktis
- Easter egg: tekan cap kota di footer 3×
- Aksesibilitas: tab keyboard (panah/Home/End), skip link, toggle gerak, jeda marquee,
  prefers-reduced-motion penuh, mode ringan otomatis (CPU/RAM/FPS rendah)
- 100% client-side — tidak ada data yang dikirim ke mana pun

## Tech
Astro 7 (static) + GSAP 3.13 (ScrollTrigger, Flip — lazy setelah idle) + Astro Fonts API
(Bangers / Cossette Titre / Big Shoulders Text — OFL) + ikon Tabler (ISC) + SVG custom.
API: `GET /api/health` (prerender).

## Skor
- Lighthouse **mobile: 81 / 100 / 100 / 100**, **desktop: 100 / 100 / 100 / 100**
  (perf/a11y/best-practices/seo). Perf mobile <90: bottleneck throttle CPU emulasi +
  style/layout di VM; evaluasi JS hanya 0,3 dtk. Detail jujur di CRITIQUE.md.
- qa.js: exit 0 (4 viewport, tanpa overflow, tanpa console error, 1 h1, lang=id)
- FPS CPU 4x: 55,1 (syarat ≥45) | 19/19 tes fungsi lolos (`tools/test-fungsi.mjs`)
- Budget: JS ~54 KB gzip, CSS 16,2 KB, font 90,3 KB

## Cara jalanin
```bash
npm install
npm run dev      # http://localhost:4321/agent-tools-zakatku/
npm run build    # -> dist/
node tools/test-fungsi.mjs   # butuh server statis di :8931 + playwright
```

## Rumus (fikih umum)
- Nisab mal = 85 × harga emas/gram; wajib bila harta bersih ≥ nisab **dan** haul 1 tahun
- Zakat = 2,5% × harta (mal/penghasilan) | Fitrah = jiwa × 2,5 kg × harga beras/kg
- Harga emas & beras **diisi manual** (cek harga hari ini) — tidak ada angka karangan
- Untuk kasus khusus, tanya amil/ustaz terdekat

## Kredit
Font: Fontsource (OFL). Ikon: Tabler (ISC). Grain: feTurbulence SVG buatan sendiri.
Seed desain: `builds/2026-10-31/seed.json` (kartu pos × spreadsheet × zine fotokopi).
