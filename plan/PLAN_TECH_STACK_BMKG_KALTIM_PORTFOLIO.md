# PLAN — Tech Stack | BMKG Kalimantan Timur Web Portal

> Implementation brief untuk Claude Code. Implementasikan **section Tech Stack** di halaman detail Web BMKG Kalimantan Timur, dengan route yang dideteksi dari repository portofolio.

## Konsep — Editorial Technology Index

Buat indeks teknologi berbasis kategori dengan tipografi rapi, navigasi ringkas, dan detail peran aktual teknologi. **Tidak menggunakan tumpukan logo kartun, grid kartu neon, atau animasi berlebih.** Section harus berbeda dari diagram System Architecture dan feature chapters.

## Kelompok stack yang ditampilkan

### 01 — Application & UI

- **Next.js 16.1.4** — App Router, SSR, route handlers.
- **React 19.2.3** dan **TypeScript 5.x** — UI dan logika server/client.
- **Tailwind CSS 4**, **Radix UI** — styling dan primitives.
- **Motion / Framer Motion 12**, **Embla Carousel 8.6** — motion dan carousel existing pada aplikasi BMKG.
- **Leaflet, React Leaflet, Canvas/WebGL** — peta hotspot dan animasi angin.

### 02 — Data & Persistence

- **MySQL** — basis data operasional pengguna, permohonan, observasi, konten.
- **Prisma 5.22** dan **mysql2** — model data dan akses DB.
- **Local filesystem** — produk IMAP, unggahan, radar, radiosonde dan file ilmiah sementara; jangan menggambarkannya sebagai object storage.

### 03 — Background Processing & Ingestion

- **Node.js 24.14.0** (menurut dokumen tech-stack repository) dan **tsx** — scripts/worker TypeScript.
- **IMAP + mailparser** — listener mailbox/lampiran.
- **Sharp** — normalisasi gambar dan background key.
- **Cron & shell scripts** — sinkronisasi radar/hotspot/ECMWF dan tugas lain.
- **Python 3 / ecCodes** — pemrosesan GeoHotspot dan dekode GRIB2 ECMWF.

### 04 — Auth & Service Workflows

- **NextAuth.js 5 beta** — session terpisah menurut konteks.
- **jose, bcryptjs** — token/sesi dan password hashing.
- **ALTCHA, Cloudflare Turnstile** — challenge bot/captcha pada alur terkait.
- **Nodemailer, React Email** — email status dan verifikasi.
- **jsPDF, pdfjs-dist, JSZip, docx** — file bukti, preview, unduhan, dan dokumen layanan.

### 05 — External Data & Geospatial

- **BMKG weather, warning, earthquake feeds** — informasi cuaca/peringatan/gempa yang disajikan portal.
- **ECMWF IFS data, Sipongi, Himawari** — data angin, hotspot, observasi termal.
- **PM2.5 provider**, radar dan radiosonde — tampilan observasi.

**Klasifikasikan data provider sebagai integrasi, bukan library npm.** Versi hanya boleh ditampilkan bila didukung dokumentasi/repo; jangan mengada-ada versi Python/MySQL.

## Engineering decisions (short editorial sub-section)

1. **One app, multiple audiences:** Next.js menampung portal, pemohon data dan backoffice dengan batas session.
2. **File-based media publishing:** pipeline IMAP berorientasi filesystem, bukan antrean database.
3. **Separate background jobs:** listener/cron/worker ilmiah memproses sumber tanpa menjadikan halaman publik mesin forecast.
4. **Specialized data processing:** Python/ecCodes untuk data cuaca dan GeoHotspot, sementara web berfokus pada delivery/interaction.

## Desain dan perilaku

- Sticky kategori atau compact rail di desktop **hanya bila pola itu sudah dipakai di section stack sebelumnya**; alternatif: index bersih dengan pembatas kategori.
- Klik nama teknologi mengungkap penjelasan singkat perannya di BMKG Kaltim, bukan penjelasan textbook generik.
- Scroll-aware highlight hanya untuk kategori, tanpa timeline raksasa atau gerakan dekoratif.
- Jika ada logo asli pada repo/assets, gunakan ukuran kecil konsisten; tanpa logo juga boleh. Jangan memanggil remote icon CDN untuk dekorasi.
- Mobile gunakan accordion accessible atau daftar chapter biasa, no horizontal overflow.
- Reduced-motion harus memberikan konten lengkap tanpa animasi.

## Larangan klaim

Jangan menyebut Redis, Celery, Kafka, S3, Kubernetes, event streaming, realtime inference model cuaca, otomatisasi billing SIMPONI, atau integrasi yang tidak didukung dokumen. Jangan menyamakan library yang dipakai situs BMKG dengan stack website **portofolio** tempat section diimplementasikan.

## Acceptance criteria

- [ ] Semua komponen stack dan peran konsisten dengan dokumentasi.
- [ ] Integrasi data dibedakan dari runtime/library.
- [ ] Engineering decisions berdasarkan bukti, tanpa klaim keamanan/kinerja yang berlebihan.
- [ ] UI theme-native, ringan, aksesibel, sesuai komponen portofolio.

## Instruksi wajib sebelum implementasi

1. Audit repository **portofolio yang sedang aktif**, bukan repository BMKG, untuk menemukan route detail project yang benar. Jangan membuat route tebakan; ikuti konvensi existing `/project/...` atau path yang sudah terdaftar. Jangan mengganti slug atau merusak halaman project lain.
2. Temukan implementasi section yang sudah dibuat untuk Auto-Sosmed, ATMOS–WRF, atau WhatsApp AI Agent sebagai **referensi perilaku interaksi**, bukan template visual yang disalin mentah. Identifikasi tokens CSS, tema gelap/terang, tipografi, breakpoint, motion utility, sistem icon, spacing, komponen, serta cara section disusun.
3. Pakai komponen, styles, dan library motion existing. Jangan memasang dependency baru kecuali benar-benar diperlukan dan ada alasan eksplisit. Jangan memodifikasi global theme untuk mengakomodasi satu section.
4. Semua screenshot berasal dari asset nyata project yang tersedia. Jika asset belum ada, gunakan placeholder tipografis yang tertata atau komponen CSS sederhana dengan label yang jelas; **jangan mengarang screenshot dashboard asli** atau mengunduh ilustrasi stock.
5. Isi berdasarkan `DOKUMENTASI-WEB-KALTIM-BMKG.md` sebagai sumber fakta. Ini adalah halaman **portofolio**, bukan dokumentasi administrasi publik atau presentasi. Jelaskan sistem dengan bahasa profesional yang ringkas, bukan copy panjang dari file.
6. Hindari AI slop: jangan default ke gradient ungu-biru, glow, glass cards bertumpuk, border bercahaya, floating emoji, animasi bounce, efek parallax berlebihan, atau six-card grid generik. Pilih tipografi, alignment, hirarki editorial, garis tipis, dan ruang kosong yang mengikuti identitas project.
7. Aksesibilitas: semantic section/headings, keyboard support, focus visible, alt text, `prefers-reduced-motion`, state tekstual tidak hanya warna, dan mobile touch-friendly. Animasi tidak boleh menghalangi akses konten.
8. Performa: animasi hanya transform/opacity bila memungkinkan, gunakan IntersectionObserver/scroll hooks yang sudah ada, passive scroll listeners bila perlu; hindari layout thrashing, interval polling dekoratif, canvas berat, request API asli, dan rendering ulang seluruh halaman per frame. Cleanup event listener/observer.
9. Pastikan semua visualisasi **demonstrasi konseptual statis** untuk portofolio, bukan API live yang mengakses mailbox, data pemohon, internal host, atau credentials. Jangan mengungkap kredensial, alamat jaringan privat, file sensitif, atau data pengguna asli.
10. Setelah implementasi jalankan lint/typecheck/build yang relevan, cek mobile, layar besar, reduced motion, scroll maju/mundur, keyboard, hydration dan tidak ada layout shift. Laporkan file yang diubah dan validasi yang dilakukan.

## Gaya penulisan dan hasil

Gunakan copy berbahasa Inggris yang konsisten dengan halaman detail project sebelumnya **jika memang itu bahasa project**; bila portofolio menggunakan Bahasa Indonesia, ikuti bahasa existing. Pertahankan istilah teknis asli. Judul, deskripsi, dan visual harus terbaca tanpa motion. Jangan menampilkan metrik dampak, latency, uptime, dan angka penghematan yang belum dibuktikan.
