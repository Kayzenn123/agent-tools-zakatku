# CRITIQUE — ZakatKu — 2026-10-31

## Slop test (v3) + 3 hal paling template + yang dirombak
- **Slop test**: logo ditutup — halaman ini tidak ketuker dengan web AI generik. Kombinasi zine
  fotokopi + kantor pos + spreadsheet outline + Bangers + ungu lavender/stabilo lime tidak ada
  di 14 build terakhir (cek LOG.md: tidak ada yang pakai domain kartu pos / referensi zine).
- **3 hal paling template**: (1) Tab bar 4 lembar — pola tab standar; (2) FAQ accordion
  details/summary; (3) form input angka vertikal.
- **Yang dirombak**: (1) Tab = "lembar arsip" dengan transisi GSAP Flip + tanpa pill/nav marketing;
  (2) FAQ + error + empty state ditulis suara Pak Pos; (3) form = buku besar spreadsheet dengan
  batasan "hanya garis tanpa fill", hasil keluar sebagai resi yang DICAP stempel pos raksasa dan
  bisa disobek — bukan card hasil generik.
- **Keputusan berani terlihat dalam 5 detik?** Ya: headline flip 3D + senter kursor + marquee
  vertikal + stempel "CAP SEKARANG". Terverifikasi di screenshot mobile-390.

## Gerbang gerak (v4): jumlah lapisan, zoom, pan, 2 marquee, FPS 4x (angka)
- Lapisan: A (parallax 5 elemen hero `[data-depth]` + zoom-out 1.06→1 di resi), B (2 marquee
  vertikal berlawanan + skew velocity + tombol jeda), C (split huruf flip 3D + wght scrub
  Big Shoulders), D (spotlight senter + magnetic button; mati di pointer coarse), E (Flip ganti
  tab + clip-path reveal + clip-path circle saat stempel). F dipangkas (aturan v5).
- Zoom: ya (resi). Pan horizontal: TIDAK — domain spreadsheet vertikal; diganti drag-to-tear
  vertikal sebagai mekanik D/E (dicatat sebagai keputusan konflik di bawah).
- FPS 4x CPU throttle (qa.js): **55,1** (syarat ≥45 lolos).

## Gerbang v5: tes bandingkan, blur, 3 detik, keyboard-only, reduced-motion, mode ringan
- **Bandingkan** vs 3 build terakhir (PosterPack spreadsheet koran, DETIK17 risograph split,
  KARTUARISAN blueprint): beda domain, font, palet, referensi — tidak sekeluarga.
- **Blur**: komposisi masih terbaca — headline raksasa + garis outline + stempel lingkaran.
- **3 detik**: jelas "kalkulator zakat ala kantor pos".
- **Keyboard-only**: lolos — tab panah/Home/End, skip link, form+FAQ native, "Sobek resi"
  sebagai tombol (drag pointer opsional), focus-visible jelas.
- **Reduced-motion**: lolos — qa.js: `matches:true`, 0 animasi berjalan; toggle "Gerak" manual ada.
- **Mode ringan**: lolos — deteksi hardwareConcurrency/deviceMemory/Save-Data + watcher FPS<40
  → matikan parallax/senter/marquee animasi; konten tetap utuh.

## Budget performa + Lighthouse (mobile/desktop)
- JS 154,8 KB raw (~54 KB gzip est) ≤ 250 KB ✓ | CSS 16,2 KB ≤ 60 KB ✓ | font 90,3 KB ≤ 250 KB ✓
- **Lighthouse mobile: 81 / 100 / 100 / 100** (perf/a11y/bp/seo) — LCP 1,2 dtk, CLS 0,074, TBT 710 ms
- **Lighthouse desktop: 100 / 100 / 100 / 100**
- Perf mobile < 90: TIDAK tercapai. Akar: throttle CPU 4x emulasi + "Style & Layout" 1,5 dtk di
  VM (evaluasi JS sendiri hanya 0,3 dtk). Yang sudah dioptimasi: gsap lazy setelah idle,
  prefetch Astro dimatikan, backdrop-filter dibuang, content-visibility di FAQ/footer.
  Trim lebih jauh = memangkas lapisan gerak wajib v4 — ditolak. Dicatat jujur, bukan diklaim lolos.

## Keamanan + lisensi
- Keamanan: semua input divalidasi (tipe/panjang/maks), parse JSON localStorage try/catch +
  cek skema + key berversi, render hasil pakai textContent (tanpa innerHTML untuk data user),
  deep-link hanya mengisi form (tidak ada aksi destruktif), tidak ada API key/tracker,
  clipboard dengan fallback. Lolos.
- Lisensi: font OFL (Bangers, Cossette Titre, Big Shoulders Text via Fontsource), ikon Tabler
  (ISC), SVG custom digambar sendiri, tanpa foto/stok/logo brand. Lolos.

## Skor 1-10: karakter, keunikan, kerapian
- **Karakter: 9** — suara Pak Pos konsisten sampai error/404/easter egg; stempel + perforasi
  sebagai bahasa visual yang hidup.
- **Keunikan: 9** — zine fotokopi × kantor pos × spreadsheet; tidak ada padanannya di 14 build terakhir.
- **Kerapian: 8** — tabel mobile jadi kartu bertumpuk rapi; stempel menutupi sebagian angka
  (disengaja, otentik) tapi angka tetap terbaca.

## Keputusan konflik aturan (kalau ada) + daftar dipangkas
1. **Widget astrowind vs anti-slop**: body tugas minta widget siap pakai, tapi v3 blacklist
   melarang "hero + 3 kartu fitur". Diputuskan: pakai ATURAN 0 v5 #8 (yang lebih ketat menang) —
   scaffold Astro dipakai (build, Fonts API, astro-icon, base path), UI dibangun custom. Dicatat di sini.
2. **Pan horizontal (v4) vs domain**: spreadsheet zakat vertikal; pan diganti drag-to-tear vertikal.
3. **Dipangkas**: lapisan F (shader/fisika), audio mikro, PWA manifest (one-page tool; favicon +
   theme-color + OG tetap ada), toggle ID/EN.

## Putaran rombak ke-1 dan ke-2
- **Rombak 1** (bug fungsi): `ScrollTrigger is not defined` di reveal.js — impor hilang,
  bikin deep-link & tab riwayat mati total. Diperbaiki + tes fungsi 19/19 lolos.
- **Rombak 2** (visual): headline split memenggal kata ("ZAKATM/U,") → bungkus per kata
  nowrap; tap target input 21px → 44px (selector CSS salah sasaran); hero desktop kosong kanan →
  tambah kartu pos dekoratif; perf 73→81 (gsap lazy, prefetch off, backdrop-filter off).
- Tidak perlu putaran ke-3.
