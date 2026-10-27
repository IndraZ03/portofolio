# Implementation Plan — ATMOS WRF: Interactive Tech Stack

**Target:** halaman portofolio yang sudah ada pada `/prkects/atoms-wrf` (ikuti path ini sebagaimana diminta; verifikasi route aktual di repository sebelum mengubah apa pun).

**Tujuan:** Implementasikan section **Technology Stack** yang terasa seperti bagian asli dari website portofolio, bukan template landing page AI. Ini adalah *project case study* ATMOS/WRF-WEB, **bukan deck presentasi**, dan **bukan perubahan ke aplikasi ATMOS**.

> Instruksi untuk Claude Code: baca repository portofolio, route target, theme, sistem komponen, animasi, dan section How It Works / Key Features / System Architecture yang sudah dibangun terlebih dahulu. Gunakan referensi yang sudah ada di project sebagai sumber desain utama. Jangan membuat identitas visual atau design system baru.

---

## 1. Prinsip desain

- Konsep utama: **Editorial Technology Index / Engineering Stack Breakdown** — indeks teknologi yang dapat dieksplorasi, dengan hierarki tipografi kuat, ritme whitespace, garis pemisah tipis, dan ringkasan alasan pemilihan teknologi.
- **Jangan** membuat grid berisi puluhan kartu logo berpendar, gradient ungu/biru, glassmorphism, orbit ikon, floating blobs, glow, efek 3D, atau animasi berlebihan.
- Bahasa, copywriting, label, warna, font, spacing, radius, border, dark/light mode, dan pola interaksi harus berasal dari halaman portofolio **yang sudah ada**. Jangan mencampur design token internal aplikasi ATMOS dengan theme portofolio.
- Tech Stack harus punya bahasa visual sendiri namun masih konsisten: How It Works = pipeline scroll, Features = showcase, Architecture = explorer, **Tech Stack = indeks editorial yang eksploratif**.
- Jangan memodifikasi global stylesheet, navigation, footer, layout, atau section terdahulu kecuali benar-benar diperlukan; utamakan komponen lokal section.
- Semua animasi harus terasa disengaja, singkat, dan subtil. Konten tetap terbaca saat JavaScript/animasi tidak tersedia.

## 2. Audit repository (wajib sebelum coding)

1. Temukan file halaman pada `/prkects/atoms-wrf` dan periksa ejaan route aktual; **jangan otomatis mengubah URL** menjadi `/projects/atmos-wrf`.
2. Audit design tokens, typography, dark/light mode, breakpoints, ukuran container, spacing, border, dan style elemen interaktif.
3. Temukan komponen/utility untuk scroll tracking, intersection observer, motion, sticky sections, reduced motion, ikon, dan komponen tab/accordion yang sudah dipakai.
4. Pelajari section Auto-Sosmed Tech Stack bila tersedia; boleh mengadopsi pola dan style tetapi jangan sekadar duplikasi desain tanpa menyesuaikan kompleksitas ATMOS.
5. Periksa apakah ada aset logo teknologi yang sudah tersedia. Pakai aset resmi/lokal jika ada; **jangan memaksakan logo** jika visual berbasis tipografi lebih konsisten.
6. Catat ringkas hasil audit dan keputusan komponen/library yang direuse sebelum mengimplementasikan.
7. Jangan menginstal dependency baru jika browser API atau utility existing sudah cukup.

## 3. Struktur section yang disarankan

### Section header

- Eyebrow kecil: `TECHNOLOGY STACK` atau label sesuai bahasa situs.
- Heading ringkas: `Built for atmospheric computing.` / versi bahasa yang konsisten dengan portofolio.
- Deskripsi singkat: ATMOS menghubungkan web interface, API, data geospasial, dan model komputasi atmosfer dalam satu workflow.
- Hindari klaim bahwa semua komputasi berjalan distributed/cloud-native.

### Layout desktop

- **Sidebar / indeks kategori sticky** yang ringan dengan penanda aktif mengikuti scroll.
- **Konten utama** berupa kategori bertingkat, baris teknologi yang rapi, nama teknologi + fungsi spesifik pada ATMOS.
- Interaksi klik kategori melakukan scroll ke kelompok terkait, dengan offset yang sesuai sticky navbar yang ada.
- Bila cocok dengan theme, satu area kecil `Engineering Notes` dapat menjelaskan hubungan antar kategori tanpa mengulang diagram System Architecture.

### Layout mobile

- Satu kolom; sidebar berubah menjadi daftar kategori ringkas, segmented navigation yang bisa dibungkus, atau accordion yang accessible.
- Jangan membuat sticky panel setinggi viewport atau horizontal overflow.
- Semua informasi tersedia lewat tap/scroll, bukan hover saja.

## 4. Konten teknologi — hanya klaim yang didukung dokumen sumber

Tampilkan kelompok berikut (boleh menyederhanakan visual namun jangan mengubah fungsi teknologi):

### A. Application & Backend

| Teknologi | Peran di ATMOS |
|---|---|
| Python 3 | Bahasa backend dan otomasi pengolahan model/data |
| FastAPI | HTTP API dan penghubung dashboard ke layanan data/model |
| Uvicorn | ASGI server aplikasi |
| Jinja2 | Server-rendered HTML template |
| Pydantic | Validasi model request/data |
| SQLAlchemy 2 | Akses database ORM |
| Alembic | Infrastruktur migrasi skema |

**Catatan:** jangan menyebut frontend ATMOS sebagai Next.js/React SPA. Aplikasi yang didokumentasikan menggunakan Jinja2 dengan interaksi ringan.

### B. Interface & Geospatial

| Teknologi | Peran |
|---|---|
| Alpine.js | Interaksi antarmuka ringan |
| Tailwind CSS | Utility styling UI aplikasi ATMOS |
| DaisyUI | Komponen UI dalam ATMOS |
| Leaflet | Domain Wizard dan peta analisis |
| proj4 | Dukungan sistem koordinat/proyeksi |
| Matplotlib | Render produk peta/visualisasi |
| GeoPandas / Shapely | Pengolahan geometri spasial dan layer analisis |

Jangan memaksakan daftar font dari aplikasi ATMOS sebagai font halaman portofolio. Font portofolio mengikuti project yang sedang diedit.

### C. Data & Persistence

| Teknologi | Peran |
|---|---|
| PostgreSQL | Metadata project, dataset, job, dan riwayat |
| Local filesystem | Workspace model, GRIB/NetCDF, output, log |
| boto3 | Integrasi object storage yang dapat dikonfigurasi |
| MinIO / S3 / Ceph | **Pilihan** backend object storage; jangan klaim semuanya aktif bersamaan |

**Ketelitian arsitektur:** jalur WPS/WRF tetap menggunakan file kerja di local filesystem. Jangan membuat klaim seluruh data komputasi disimpan dan di-stream langsung dari S3.

### D. Scientific Data Processing

| Teknologi | Peran |
|---|---|
| ecCodes | Pembacaan metadata dan waktu valid GRIB |
| netCDF4 | Baca/tulis data NetCDF WRF dan kimia |
| NumPy | Operasi numerik |
| Pillow | Pemrosesan citra |
| Satpy | Rendering data satelit |
| himawari-api | Akses sumber data Himawari yang didukung |
| ecmwf-opendata | Pengambilan ECMWF IFS Open Data |
| CDS API | Akses data ERA5 |

Pisahkan **library pengolahan** dari **sumber dataset** (GFS, FNL, ERA5, IFS, WACCM, MEGAN bukan library frontend/backend).

### E. Atmospheric Modeling & Compute

| Teknologi | Peran |
|---|---|
| WRF 4.8.0 | Mesin simulasi atmosfer |
| WPS 4.7.0 | geogrid, ungrib, metgrid |
| WRF-Chem | Alur simulasi kimia atmosfer |
| mozbc | Inisialisasi/boundary kondisi kimia dari WACCM |
| MEGAN | Emisi biogenik |
| anthro_emis | Preparasi emisi antropogenik |
| wesely / exo_coldens | Preparasi deposisi/kolom |
| OpenMPI 4.1.6 | Runtime MPI yang digunakan pada lingkungan komputasi |
| NetCDF / HDF5 / Jasper | Library native untuk interoperabilitas format ilmiah |

**Jangan klaim HPC multi-node, worker farm, autoscaling, Kubernetes, Celery, Redis, atau GPU computing.** Implementasi yang dijelaskan berjalan pada satu mesin, dan pemanggilan dari UI yang tercatat masih `mpirun -np 1` untuk jalur terkait.

### F. Integrations & Operations (kategori pelengkap, bukan top-level dominan)

- **NOAA NOMADS / GDEX** — sumber dataset meteorologi.
- **ECMWF CDS / Open Data** — sumber ERA5 dan IFS.
- **Himawari via sumber historis NOAA/AWS** — sumber imagery satelit.
- **Cloudflare Tunnel** — ekspos layanan yang tercatat dalam dokumen sumber.
- **systemd** — service operasional.
- **WebSocket** — pembaruan status WRF dan interaksi agent pada jalur yang didokumentasikan.

Keterangan: integrasi ini tidak boleh disalahartikan sebagai bukti bahwa seluruh jalur berhasil divalidasi live dalam sesi ini.

## 5. Interaction specification

1. **Scroll-aware category index:** active indicator berubah saat kategori dominan memasuki viewport; gunakan IntersectionObserver atau utility yang sudah ada. Tidak perlu global scroll listener per item.
2. **Select / focus technology:** klik/tap satu teknologi dapat membuka uraian singkat atau menyorot fungsi dan kaitannya, tetapi jangan menjadikannya modal besar dan jangan menuntut pengunjung membuka tiap item untuk membaca fungsi dasarnya.
3. **Motion:** reveal opacity + translate sangat kecil bila cocok dengan standar animasi project; pengunjung harus bisa membaca tanpa menunggu animasi.
4. **Navigation:** smooth scroll hanya bila reduced-motion tidak aktif, dan harus menghormati sticky header dengan `scroll-margin`.
5. **State clarity:** kategori aktif memiliki indikator tipografi/garis/border dari theme; jangan hanya mengandalkan warna.
6. **Keyboard:** tombol/tautan berfungsi dengan keyboard, focus terlihat, aria yang tepat untuk disclosure/tab jika digunakan.
7. **Prefer-reduced-motion:** hilangkan transisi esensial, pertahankan seluruh konten dan navigasi.
8. **No fake interactions:** setiap affordance klik punya respons yang nyata.

## 6. Konten editorial tambahan: Engineering Decisions

Tambahkan blok pendek setelah indeks (atau sisipkan per kategori bila lebih natural):

- **Server-rendered UI, not a heavy SPA:** Jinja2 + Alpine.js menjaga interaksi tetap sederhana pada aplikasi yang berfokus pada eksekusi model.
- **PostgreSQL for durable job records:** menyimpan project, status, riwayat eksekusi dan metadata; pekerjaan berjalan melalui FastAPI BackgroundTasks/thread, **bukan** Redis/Celery.
- **Shared scientific binaries, isolated project workspaces:** file konfigurasi, dataset dan output dipisahkan per project; binary WPS/WRF digunakan bersama via symlink.
- **Local compute and scientific file handling:** file besar ditangani sebagai GRIB/NetCDF, hasil dianalisis setelah model menyelesaikan tahapnya.
- **Web-facing progress & logs:** status job dan bagian log ditampilkan; pembacaan tail log dibatasi agar tidak membaca file raksasa secara penuh.

Ini harus ditulis sebagai keputusan/perilaku implementasi, bukan klaim benchmark atau keuntungan kuantitatif tanpa bukti.

## 7. Visual treatment — anti AI slop

- Typography-first. Maksimal satu jenis treatment aksen sesuai theme existing.
- Hindari menaruh semua logo teknologi dalam kartu yang identik atau dekorasi pseudo-code acak.
- Beri ruang pada teknologi penting (WRF/WPS, FastAPI, PostgreSQL, Leaflet, NetCDF), tetapi jangan membesarkan semua item.
- Garis penghubung/hairline divider, numbering, dan metadata kecil boleh dipakai bila sudah cocok dengan portofolio.
- Jangan memperkenalkan palet baru dari identitas internal ATMOS; section ini mengikuti theme situs portofolio.
- Gunakan copy ringkas dan jelas, bukan jargon marketing panjang.

## 8. Implementation boundaries

- Implementasi **hanya** di halaman portofolio `/prkects/atoms-wrf` dan komponen lokal/reusable yang diperlukan.
- Gunakan framework dan konvensi repository **portofolio** yang ditemukan saat audit, bukan menyalin framework aplikasi ATMOS ke halaman portofolio.
- Jangan mengubah database, service, konfigurasi, atau runtime aplikasi WRF-WEB.
- Jangan menambahkan ikon/logo dari CDN yang tidak diperlukan; perhatikan lisensi bila mengambil aset resmi.
- Jangan sertakan credentials, alamat file internal sensitif, atau environment secrets.
- Jangan memakai loading berat, canvas/WebGL, particle animation, atau interval terus-menerus demi dekorasi.
- Pertahankan semantic HTML, kontras warna, keyboard access, dan responsive behavior.

## 9. Fase pengerjaan untuk Claude Code

### Fase 1 — Discovery
- Temukan route dan section existing.
- Audit theme, komponen, layout, animasi, assets.
- Tetapkan pola yang akan dipakai ulang.

### Fase 2 — Content & structure
- Buat data teknologi statis/typed yang terpisah dari markup.
- Susun kategori, deskripsi, peran, dan Engineering Decisions.
- Validasi bahwa tidak ada klaim fitur atau deployment yang tidak didukung sumber.

### Fase 3 — Visual implementation
- Implementasikan indeks kategori + teknologi dengan design tokens existing.
- Pastikan konsisten dengan section lain tetapi tidak identik secara komposisi.
- Buat desktop/mobile layout.

### Fase 4 — Interactions
- Pasang active-section observer, anchor navigation, dan detail expansion bila cocok.
- Implementasi reduced-motion, focus, accessibility.
- Gunakan animation utilities existing, hindari dependency baru.

### Fase 5 — Verification
- Jalankan typecheck/lint/build/test yang sesuai repo.
- Uji scroll ke bawah/atas, kategori klik, keyboard, mobile, dan desktop.
- Cek overflow, CLS, posisi sticky navbar, visibility tanpa animasi.
- Pastikan route lain tidak berubah dan section yang sudah ada tidak rusak.

## 10. Acceptance criteria

- [ ] Tech Stack tampil pada route existing `/prkects/atoms-wrf` tanpa merusak section lain.
- [ ] Tampilan menyatu dengan theme portofolio, tidak AI slop, tidak grid logo generik.
- [ ] Nama dan fungsi teknologi akurat terhadap dokumen ATMOS.
- [ ] Teknologi aplikasi portofolio tidak tertukar dengan teknologi sistem ATMOS.
- [ ] Kategori dapat dieksplorasi dan menandai posisi scroll secara akurat.
- [ ] Komposisi responsif, accessible, reduced-motion friendly.
- [ ] Tidak ada dependensi berat yang tidak diperlukan.
- [ ] Tidak ada klaim palsu tentang Redis, Kubernetes, multi-node HPC, autentikasi, atau keberhasilan integrasi live.
- [ ] Lint/typecheck/build sesuai repository selesai tanpa regresi.

## 11. Output yang harus disampaikan Claude Code

Setelah implementasi, laporkan secara ringkas:

1. File yang ditambah/diubah dan lokasi section.
2. Komponen/theme/utility existing yang digunakan kembali.
3. Cara kerja interaksi category navigation dan scroll-aware state.
4. Hasil pemeriksaan build/lint dan keterbatasan yang masih ada.

**Eksekusi sekarang:** lakukan audit repository, lalu implementasikan section Tech Stack ini langsung pada halaman portofolio ATMOS. Jangan berhenti hanya pada rencana, jangan membuat proyek demo baru, dan jangan meminta keputusan desain yang sudah bisa ditentukan dari referensi existing.
