# PLAN — How It Works | BMKG Kalimantan Timur Web Portal

> Implementation brief untuk Claude Code. Buat **section How It Works** pada halaman detail project Web BMKG Kalimantan Timur di portofolio existing. Target route: **temukan path project BMKG yang benar di repository portofolio**; jangan menebak slug.

## Tujuan pengalaman

Buat **scroll-driven narrative** vertikal dari atas ke bawah, mengikuti pola interaksi section How It Works project sebelumnya: garis progres mengikuti scroll secara deterministik, step aktif berubah, progress mundur ketika scroll balik, dan visual sticky pada desktop jika pola existing mendukung. Hindari membuat slideshow otomatis berbasis timer.

Proyek ini bukan mesin prediksi cuaca. Narasi harus menyampaikan bahwa portal **menampilkan informasi resmi, menerima produk jadi dari berbagai sumber, dan memproses permohonan data**. Jangan menggambarkan Next.js melakukan simulasi WRF atau menghasilkan prakiraan sendiri.

## Tiga jalur, satu cerita yang terstruktur

Gunakan 3 mini-workflow dalam satu section yang terhubung oleh navigasi **Weather Information / Automated Product Intake / Data Services**. Default tampil alur publikasi produk; tahap lain muncul lewat scroll atau pemilih tab yang accessible (sesuai interaksi existing). Jangan mencampur proses permohonan data dengan alur IMAP.

### Story A — Product delivery (jalur utama, 6 step)

1. **Products are prepared** — forecaster/MeteoFactory menyiapkan produk cuaca. Portal tidak menghitung produk prakiraan sendiri.
2. **Products enter the system** — media dikirim lewat email ke IMAP atau diunggah melalui endpoint khusus. *Bedakan storage IMAP dengan upload MeteoFactory.*
3. **Listener detects updates** — proses IMAP jangka panjang memindai INBOX, cocokkan subject berdasarkan konfigurasi, pilih email terbaru per subject, dan ambil lampiran yang valid.
4. **Media is prepared & stored** — `mailparser` mengekstrak lampiran; `sharp` mengonversi gambar ke PNG dan menangani background key untuk produk tertentu; file ke `public/produk/<slug-subject>/`.
5. **Web serves the latest product** — API pembaca memindai folder yang sesuai, mengurutkan file, menggunakan `mtime` untuk cache busting. *Tidak menggunakan tabel database untuk file produk IMAP.*
6. **Public audiences explore** — produk muncul pada halaman prakiraan, infografis, display, dan halaman relevan lainnya.

**Penting:** upload langsung MeteoFactory disimpan ke `public/uploads/produk/`, dibaca oleh `/api/produk/list`, dan **bukan folder yang sama** dengan IMAP. Jangan tampilkan satu jalur storage gabungan yang menyesatkan.

### Story B — Live & observational information (mini jalur pendamping)

Gunakan 3 langkah konseptual, bukan klaim semua berawal dari email: **External/Observational Data** → **Scheduled sync & processing** → **Map and public display**. Contoh dari sumber: radar Balikpapan, hotspot Sipongi + angin ECMWF yang disiapkan cron, GeoHotspot berbasis Himawari, peringatan nowcast/gempa dari feed BMKG. Jangan salah menggambarkan GeoHotspot sebagai prakiraan WRF atau data yang diproses IMAP.

### Story C — Data request service (7 step)

1. **Applicant signs in** — akun pemohon, verifikasi email dan captcha.
2. **Choose request type** — `INFORMASI` (berbayar) atau `NOL_RUPIAH`.
3. **Submit application** — pilih layanan/stasiun, isi detail dan lampiran yang diperlukan.
4. **Officer review** — DATIN memeriksa permohonan dan memutuskan kelanjutan.
5. **Payment when required** — untuk INFORMASI, kode billing SIMPONI **diinput manual oleh petugas**, bukti pembayaran diunggah, kemudian dikonfirmasi. NOL_RUPIAH melewati tahap ini.
6. **Data delivery and review** — petugas mengunggah hasil, pemohon menerima/menolak dan dapat memberi catatan.
7. **Feedback and completion** — SKM diisi, status berakhir `COMPLETED`, unduhan hasil tersedia sesuai alur.

## Komposisi visual

- **Desktop:** kolom progres kiri dengan step dan garis tipis, panel visual kanan sticky; alternatif mengikuti pola existing jika layout semacam ini sudah ada.
- **Mobile:** satu kolom dengan garis progres dekat teks dan visual kecil inline; jangan sticky penuh layar.
- Animasi garis tumbuh dari 0–100% sesuai posisi dalam section (gunakan CSS custom property transform scaleY/clip path bila sudah tersedia).
- Step aktif ditentukan posisi intersection bukan hanya indeks berdasarkan scroll keseluruhan; threshold harus stabil, tanpa flicker.
- Step yang dilewati redup secara elegan, aktif memiliki indikator theme-native; yang belum dicapai tetap terbaca.
- Visual per step dapat berupa SVG/CSS data flow sederhana, sample image frame placeholder, bukan konten sensitif.
- Saat pergantian story, reset indikator lokal dengan transisi sederhana, pertahankan navigasi keyboard dan state URL hanya jika project memiliki pola demikian.
- `prefers-reduced-motion`: tampilkan semua isi/step statis; progress tidak wajib bergerak.

## Accuracy guards

- IMAP listener adalah proses terpisah dari HTTP server; bukan request Next.js.
- Listener memiliki lock PID, reconnect/backoff, pemilihan email terbaru per subject; jangan menyebut queue terdistribusi.
- Portal punya modul data service berbeda dari konten cuaca. Billing bukan API SIMPONI langsung.
- Jangan menjanjikan semua menu/route tersedia; gunakan fitur yang terdokumentasi.

## Acceptance criteria

- [ ] Step A, B, C sesuai dokumentasi dan tidak mencampur sumber/penyimpanan.
- [ ] Progres scroll maju/mundur dengan stabil; tanpa autoplay paksa.
- [ ] Section mengikuti theme, motion conventions, font dan visual portofolio.
- [ ] Mobile mudah dibaca, interaksi keyboard, reduced motion, tidak ada layout shift.
- [ ] Implementasi tidak membuat network call ke layanan BMKG saat halaman portofolio dikunjungi.

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
