# Implementation Plan — Tech Stack | Koordinat Hotspot

**Tujuan:** section *Editorial Technology Index* untuk modul peta hotspot, fokus mengapa tiap alat digunakan. Jangan berubah menjadi dinding 30 logo atau meminjam stack dari proyek ATMOS/Auto-Sosmed.

## Content inventory — verified by uploaded module docs
| Category | Technologies | Role in this module |
|---|---|---|
| Application | Next.js 16 App Router, React, TypeScript, Node.js | Halaman publik, route handlers, UI interaktif, scheduled TypeScript scripts |
| Geospatial UI | Leaflet 1.9.4, GeoJSON, Esri World Imagery | Basemap imagery, coordinate markers, boundaries, concessions, popup and panes |
| Animation / Wind | Custom WebGL engine, Canvas, ECMWF IFS 0.25° U10/V10 | GPU particle wind field rendered over Leaflet; separate from marker layer |
| Data & State | MySQL, `mysql2`, local JSON and files | Snapshot realtime, historical days, cached wind data, geographic overlays |
| Data Processing | Python, `eccodes`, `curl`, shell cron | FTP TSV sync, ECMWF GRIB decoding, alignment, background tasks |
| Cartographic Export | Matplotlib, jsPDF 4.2.1 | Regional map images/PDF in Python, point table report PDF in browser |
| Reliability Patterns | SHA-256 cache key, atomic rename, memory mtime cache | Prevent partial reads and repeat rendering; cache static contextual layers |

### Explicit exclusions
- Jangan label modul ini sebagai `Prisma ORM` — sumber menyebut `mysql2` langsung.
- Jangan sebut React-Leaflet untuk halaman ini — memakai Leaflet imperative.
- Jangan sebut `Windy API` atau `pySTEPS` untuk animasi angin — engine WebGL milik project.
- Jangan sebut Redis, Celery, Kubernetes, distributed streaming, atau cloud object storage sebagai tech stack berjalan.
- Jangan mengarang versi Node.js, Python, MySQL, atau library yang tidak disebut dalam dokumentasi.

## Visual structure
- Layout editorial: kategori sebagai indeks kompak di kiri (desktop), tiap baris teknologi sebagai text-forward rows di kanan. Mobile accordion **hanya jika project punya pola accordion**; kalau tidak, gunakan anchor list sederhana.
- Scroll-aware active category dan underline/tick kecil mengganti rainbow badges. Detail singkat ditampilkan inline atau dalam panel terintegrasi, bukan modal ramai.
- Perlihatkan peran teknologi dalam 2 baris saja. Ikon/logo hanya jika sudah tersedia di repository dan lisensinya sesuai; SVG text labels cukup.
- Tambahkan **Engineering Choices** mini-section, maksimal 3 keputusan:
  1. Snapshot MySQL untuk API realtime agar page visit tidak tergantung FTP.
  2. Canvas WebGL khusus untuk rendering vektor angin tanpa mencampur lifecycle Leaflet marker.
  3. Atomic file publish + content cache untuk menjaga hasil unduhan/plot tetap konsisten.
- Simpan technical details lebih dalam dalam disclosure hanya jika pola disclosure existing ada.

## Interactions & performance
- Highlight kategori mengikuti scroll bila benar-benar menambah orientasi; jangan scroll-jack.
- Prefer CSS transitions dan IntersectionObserver. Kemunculan elemen sekali saja cukup; jangan perpindahan berulang yang mengganggu baca.
- Hindari mengunduh font/logo pihak ketiga saat runtime bila belum dipakai di project.
- Periksa wrapping tech name dan tooltip mobile; seluruh teks harus bisa dibaca tanpa hover.

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
