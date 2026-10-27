# Implementation Plan — Key Features | Koordinat Hotspot

**Tujuan:** editorial feature showcase untuk case study Koordinat Hotspot. Hindari pengulangan timeline *How It Works*; fokus pada **apa yang dapat dilakukan pengguna** dan keputusan UX yang mendukungnya.

## Design: Cartographic Feature Chapters
- Tampilkan 6 feature chapters sebagai **editorial split-layout**: teks singkat dan screenshot/crop produk asli di sisi lainnya; urutan serta ritme visual divariasikan berdasarkan kompleksitas konten, bukan zig-zag otomatis.
- Di desktop, gunakan panel visual yang dapat sticky dan berganti sesuai feature active jika pola itu sudah dipakai pada portofolio. Di mobile jadikan visual per-feature statis dengan motion minimal.
- Hindari ikon besar generik pada setiap item. Utamakan detail UI nyata: marker, legend, popup, timeline histori, toggle, peta hasil wilayah.
- Reveal hanya ketika mendekati viewport; pengunjung tidak harus scroll panjang hanya untuk membaca sedikit copy.

## Konten fitur yang benar-benar tersedia
### 01 — Real-time Hotspot Map
- Peta Leaflet pada imagery basemap dengan marker berwarna berdasar confidence: rendah hijau, sedang kuning, tinggi merah.
- Popup: koordinat, kab/kota, kecamatan, satelit, confidence, timestamp WITA, tautan Google Maps.
- Refresh UI otomatis 5 menit saat realtime; jangan sebut streaming real-time subdetik.
- Visual: screenshot asli peta dengan marker dan popup; bila tidak ada, bentuk mini map skematis **tanpa titik geolokasi rekaan**.

### 02 — Historical Hotspot Explorer
- Pengunjung memilih rentang sampai 31 hari, sistem menggabungkan titik tanggal yang dipilih; tanggal yang belum di database dimuat hingga 10 tanggal per request.
- Toggle mode realtime/history; angin mati otomatis ketika histori dan kembali ke kondisi semula saat realtime.
- Visual: UI date range + histogram/ringkasan **tanpa angka palsu**.

### 03 — ECMWF Wind Overlay
- Partikel angin WebGL dari komponen U10/V10 ECMWF IFS 0.25°, data sudah disiapkan cron.
- Default aktif di realtime; rendering GPU dipisah dari marker dan tetap fail-soft.
- Visual: screenshot real peta dengan partikel; alternatif schematic satu tile dan panah u/v sederhana. Jangan menarasikan prediksi pergerakan hotspot.

### 04 — Concessions & Peatland Context
- Pilihan overlay palm, pulpwood, logging, mining, gambut; batas kabupaten/kota dan delineasi IKN.
- GeoJSON lokal disaring cakupan spasial; izin tambang dengan tanggal akhir tak aktif tidak dimunculkan; data tetap snapshot dan hanya konteks spasial.
- Visual: compare state layer off/on atau clickable preview menggunakan data ilustratif yang jelas berlabel.

### 05 — Regional Maps & PDF Reports
- Peta wilayah dirender Python menjadi gambar/PDF setelah sync, dilayani dari cache + manifest terbaru.
- Galeri hasil regional, pengunduhan laporan PDF; ekspor tabel titik A4 landscape dari frontend mengikuti mode realtime/history.
- Visual: screenshot gallery dan sample report yang tidak menampilkan data pribadi.

### 06 — Resilient Data Refresh
- Source baru ditarik oleh cron menit 05/35; hasil disimpan sebagai snapshot yang dibaca API cepat.
- Backup sumber/tanggal, cache berkas, publikasi atomik, dan isolasi kegagalan wind membuat peta tetap dapat digunakan saat salah satu alur gagal.
- Tampilkan sebagai *engineering feature*, bukan janji SLA/uptime terukur.

## Interactive design direction
- Active chapter ditentukan oleh scrolling yang tidak mengganti URL/route.
- Saat feature aktif, thumbnail aktual yang terkait difokuskan dan caption berubah; penggantian gambar jangan menimbulkan layout shift.
- Batasi animasi transisi visual 180–350ms atau gunakan motion token existing; hormati reduced motion.
- Layer toggles demo hanya jika bekerja dengan data/prototype lokal: jangan ada tombol dekoratif yang tampak bisa dipakai tetapi tak bereaksi.
- Hindari membuat fitur baru di proyek hotspot; perubahan hanya halaman portofolio.

## Copy principle
- Deskripsikan **capabilities** bukan klaim ketepatan pendeteksian kebakaran, kualitas data, waktu latency, atau akurasi prediksi angin.
- Jangan menampilkan kombinasi *GeoHotspot SATAID B07* sebagai fitur modul ini.

## Instruksi wajib sebelum coding
1. Audit repository **portofolio**, bukan menganggap repository sumber produk BMKG tersedia. Cari route detail proyek yang relevan dengan `koordinat-hotspot` menggunakan file-based router nyata. Jangan berasumsi URL-nya `/project/koordinat-hotspot` jika repository menggunakan slug lain. Bila belum ada, ikuti konvensi `project(s)/[slug]` yang ditemukan; jangan mengubah route global.
2. Pelajari theme existing: font, design tokens, CSS variables, spacing, container width, border/radius, light/dark, responsive breakpoints, komponen shared, library animasi, section How It Works/Key Features/Architecture/Tech Stack dari proyek lain. **Reuse**, bukan menciptakan sistem desain baru.
3. Periksa dependensi dan pola scroll animation existing. Gunakan IntersectionObserver + CSS transforms dan requestAnimationFrame hanya bila perlu; jika ada Motion/GSAP gunakan yang sudah ada sesuai pola repository. Jangan instal library berat hanya untuk satu section.
4. Audit aset screenshot aktual produk (jika ada). Gunakan gambar aktual yang relevan; jika tidak tersedia gunakan UI schematic berbasis HTML/SVG sederhana dengan label `Illustrative flow`, **bukan mockup dashboard fiktif** atau stock photography.
5. Hindari AI slop: tidak ada grid 6 kartu identik, glow neon, glassmorphism default, blur masif, floating gradient blobs, angka KPI karangan, ilustrasi 3D berlebihan, motion bouncing, atau penumpukan badges.
6. Section harus sepenuhnya aksesibel: heading hierarchy, kontras, fokus keyboard, klik/tap, `prefers-reduced-motion`, navigasi dan deskripsi yang tetap terbaca saat JS mati.
7. Semua layout untuk mobile-first; tidak ada horizontal overflow. Animasi gunakan transform/opacity dan hindari re-render semua node saat scroll. Lazy-load gambar dan bersihkan observer/listener.
8. Integrasikan di halaman detail **yang sudah ada**, bukan membuat aplikasi atau landing page baru. Jangan merombak header, footer, root layout, global typography atau sections lain.
9. Konten merupakan **case study developer**, bukan deck presentasi, bukan dokumentasi admin, dan bukan marketing yang mengklaim dampak terukur tanpa data.
10. Setelah selesai: jalankan pemeriksaan yang tersedia (`lint`, `typecheck`, `build` bila masuk akal), periksa reduced-motion/mobile, laporkan file yang berubah dan setiap asumsi yang belum terverifikasi.

## Batas fakta produk (jangan salah klaim)
- `/koordinat-hotspot` adalah modul dalam web BMKG Kaltim, **bukan** modul `/geohotspot` yang memakai deteksi termal B07. Jangan menggabungkan keduanya.
- Halaman realtime membaca snapshot `hotspot_data` melalui API; **tidak** mengunduh FTP langsung pada setiap kunjungan.
- Angin dari ECMWF IFS U10/V10 yang disiapkan cron dan dirender lewat WebGL sendiri; bukan prediksi kebakaran, bukan estimasi arah sebaran api atau asap, dan bukan data angin observasi persis saat hotspot muncul.
- Histori bisa memicu unduhan FTP untuk tanggal belum tercache (maksimum 10 tanggal per request), bukan sepenuhnya precomputed.
- Polygon konsesi adalah referensi spasial, bukan kepastian hak/legalitas atau bukti hotspot penyebab kebakaran.
- UI refresh realtime setiap 5 menit; cron contoh berjalan menit 05 dan 35, bukan setiap detik.
- Jangan tampilkan alamat host privat, password, username, token, IP infrastruktur, nilai rahasia, ataupun endpoint administrasi sensitif pada portofolio.

## Deliverable & acceptance criteria
- Section terintegrasi dalam halaman detail produk sesuai pola existing; konten data dipisah dari markup bila cocok dengan project.
- Scroll up/down berfungsi deterministik; keyboard/tap dan reduced-motion tetap dapat membaca informasi yang setara.
- Visual mengikuti theme asli, bukan warna paksa dari produk sumber.
- Setiap klaim dapat ditelusuri ke `DOKUMENTASI-KOORDINAT-HOTSPOT.md`; fitur yang tak terbukti tidak ditampilkan sebagai fitur jadi.
- Tidak ada perubahan di luar scope dan tidak ada dependency baru tanpa alasan teknis kuat.
