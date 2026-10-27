# PLAN — Key Features | BMKG Kalimantan Timur Web Portal

> Implementation brief untuk Claude Code. Buat **section Key Features** di halaman detail project Web BMKG Kalimantan Timur pada repository portofolio existing; deteksi route aktual sebelum editing.

## Design direction — Editorial Feature Chapters

Bukan grid fitur generik. Gunakan **feature chapters** dengan visual asli bergantian dan hierarki tipografi editorial. Pilih 6 kelompok yang merangkum produk nyata; tiap kelompok mencakup *masalah pengguna → fitur → apa yang dibangun*. Gunakan sticky preview atau split-screen scroll-based activation **hanya bila sesuai pola existing**, dengan transisi opacity/transform pendek dan tidak mengulang animasi How It Works secara harfiah.

## Fitur inti yang wajib dipresentasikan

### 01 — Regional Weather Information

Prakiraan per jam untuk kabupaten/kota dan kecamatan Kalimantan Timur; peringatan nowcast disaring untuk Kaltim; kartu gempa terkini; PM2.5 melalui proxy. Data berasal dari feed/API resmi atau layanan terkait, **bukan komputasi prediksi oleh web**. Visual: screenshot beranda/cuaca jika tersedia.

### 02 — Automated Weather Product Publishing

IMAP listener mencocokkan subject terkonfigurasi, memproses lampiran PNG/JPEG/WEBP/PDF, normalisasi gambar dengan Sharp, menyimpan produk ke filesystem, dan halaman membaca hasil. Backoffice ADMIN dapat mengatur daftar subject dan memantau proses/log. Tunjukkan mini before/after hanya jika asset nyata tersedia; jangan menyebut sistem otomatis membuat produk cuaca.

### 03 — Aviation & Observation Products

Radar Balikpapan dengan empat produk (CMAX, CMAX-HWIND, PAC06H, PAC24H), tampilan refresh berkala; unggah/arsip analisis radiosonde PDF dengan retensi tujuh hari. Screenshot radar dan radiosonde dari aplikasi bila ada. Hindari mempublikasikan endpoint internal.

### 04 — Geospatial Monitoring

Peta hotspot Sipongi, layer partikel angin ECMWF yang datanya disiapkan cron, GeoHotspot dari anomali termal Himawari dan layer administrasi. Tampilkan sebagai preview geospasial, bukan klaim deteksi real-time sempurna. Jika screenshot tidak tersedia, gunakan wireframe area peta yang diberi label 'visual placeholder'.

### 05 — Public Data Request Services

Alur digital permohonan INFORMASI dan NOL_RUPIAH; verifikasi DATIN, billing manual SIMPONI untuk jenis berbayar, review hasil, SKM wajib, serta pengunduhan hasil. Visual: form dan status tracker, **tanpa data identitas pengguna**.

### 06 — Content, Backoffice & Public Display

Pengelolaan berita/artikel, approval konten, IKM, audit aktivitas dan pengaturan scene display publik. Tampilkan tujuan editorial dan operasional. Jangan memberi kesan seluruh backoffice publik dapat diakses bebas.

## Interaksi dan layout

- Pada desktop: daftar bab fitur di sisi kiri; screenshot nyata/preview di sisi kanan dengan framing sederhana, tidak menggunakan device mockup 3D berlebihan.
- Active chapter diperbarui dengan IntersectionObserver atau hook motion existing ketika panel konten masuk viewport; pengguna juga dapat memilih bab dengan tombol/navigasi keyboard.
- Gunakan detail per bab berupa 2–3 fakta yang telah didukung dokumen. Hindari daftar route/API panjang dalam konten publik.
- Mobile: chapter mengalir vertikal dengan media tepat di bawah penjelasan; matikan sticky.
- Layout bebas menggunakan alternating feature rows jika itu lebih selaras dengan referensi portofolio dibanding sticky panel.
- Perubahan active preview crossfade ringan dan tidak memicu loading gambar besar berulang.
- Screenshot dioptimalkan dan di-lazy load, namun hindari layout shift dengan ukuran/aspect ratio tetap.

## Jangan klaim

- API SIMPONI otomatis, semua menu telah aktif, database menyimpan produk IMAP, skala multi-server/Redis, atau model cuaca dihitung langsung di web.
- 'Fully secure' atau uptime/penghematan yang belum diukur.
- Fitur yang masih berupa link/route yang belum ada menurut dokumentasi.

## Acceptance criteria

- [ ] Semua enam chapter memakai kemampuan yang didukung dokumentasi.
- [ ] Tidak mengulang tampilan scroll-line How It Works.
- [ ] Semua screenshot nyata atau diberi label sebagai placeholder.
- [ ] Visual, copy dan animasi menyatu dengan theme eksisting.
- [ ] Mobile/reduced motion/keyboard/touch berfungsi dengan baik.

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
