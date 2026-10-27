# IMPLEMENTATION PLAN — ATMOS / WRF-WEB — KEY FEATURES (PORTFOLIO CASE STUDY)

> **Untuk Claude Code — implementasikan pada website portofolio yang SUDAH ADA, bukan aplikasi ATMOS dan bukan deck presentasi.**
>
> **Target URL yang diberikan:** `/prkects/atoms-wrf` (ejaan dipertahankan persis). Audit route aktual sebelum mengubah apa pun. Bila route existing berbeda, jangan mengubah URL existing secara diam-diam; sesuaikan section pada halaman sebenarnya dan tangani alias hanya bila sesuai struktur router yang ada.
>
> **Source of truth fakta:** `PRESENTASI-WRF-WEB.md`. **Source of truth visual:** desain, theme, UI patterns, dan komponen portofolio yang sudah ada. Referensi workflow: `PLAN_INTERACTIVE_SCROLL_WORKFLOW_ATMOS_WRF.md` bila tersedia.

## 0. Goal

Buat section **Key Features** yang memperlihatkan kemampuan paling signifikan dari ATMOS sebagai **platform web pemodelan atmosfer WRF & WRF-Chem**. Ini adalah **engineering project case study**: harus mudah dibaca oleh recruiter/developer sekaligus akurat bagi pengunjung teknis. Prioritaskan bukti visual produk dan penjelasan masalah yang diselesaikan, bukan daftar fitur marketing.

**Konsep:** `Editorial Feature Explorer` — susunan naratif besar, elemen visual yang hidup mengikuti fitur yang sedang difokuskan, interaksi halus, tanpa mengulang visual timeline vertikal dari How It Works. Hindari enam/delapan kartu identik. **Jangan AI slop:** jangan gunakan neon gradients, glowing dots, fake analytics, glass cards berlebihan, floating pills, animasi sekadar dekorasi, atau screenshot sintetis yang seolah-olah asli.

## 1. Fase 0 — Audit repository WAJIB sebelum coding

1. Periksa route `/prkects/atoms-wrf`, komponen halaman detail proyek, data proyek, dan komponen section yang dapat digunakan ulang.
2. Cari implementasi How It Works ATMOS dan Key Features Auto-Sosmed (jika telah ada). Ambil **konsistensi tipografi, spacings, behavior dan active-state**, tetapi jangan duplikasi layout timeline How It Works.
3. Identifikasi framework web portofolio sebenarnya. **FastAPI adalah stack proyek ATMOS, bukan bukti bahwa portofolio dibangun dengan FastAPI**.
4. Temukan CSS variables, font, grid, max width, accent, dark/light mode, border, radius, icons, breakpoints, animation utils, dan pola reduced motion. Gunakan semuanya dari repo; **jangan hardcode palette baru**.
5. Inventarisasi screenshot nyata ATMOS: `/unduh-data`, `/domain-wizard`, `/wrf`, `/wrfchem`, `/ncview`, `/visualization`, `/hotspot`, halaman satelit/radar (jika ada). Gunakan asset existing dan mapping yang tepat. Tidak boleh menampilkan screenshot satu modul sebagai modul lain.
6. Cari konvensi image optimization, lazy-load, asset naming, semantic headings, keyboard navigation dan focus ring.
7. Periksa layout smartphone, tablet, dan desktop: sticky behavior dan container yang mungkin terpotong oleh `overflow` ancestor.
8. Ringkas temuan audit secara singkat sebelum perubahan: nama file yang relevan, komponen reusable, screenshot tersedia, library animasi yang memang terpasang, dan strategi implementasi.

**Jangan:** mengubah theme global, header, footer, typography situs secara luas; mengganti sistem routing; menambahkan paket animasi berat tanpa alasan; atau membuat source-data API baru untuk portfolio statis.

## 2. Posisi section dalam narasi

- Sebelum: **How It Works** — menjelaskan keseluruhan alur dari project hingga output.
- Section ini: **Key Features** — memperlihatkan bagian-bagian aplikasi yang bisa dieksplorasi, masing-masing dengan screenshot nyata dan nilai engineering.
- Sesudah: **System Architecture** dan **Tech Stack** — mengungkap cara fitur diimplementasikan di backend.

Heading yang disarankan bila situs berbahasa Inggris: `Key Features`.
Subheading: `One interface, from model setup to atmospheric analysis.`
Sesuaikan bahasa berdasarkan halaman existing. Hindari bahasa klaim superlatif yang tidak terbukti ("seamless", "enterprise-grade", "fully scalable", "real-time prediction").

## 3. Delapan feature narratives (wajib akurat)

Gunakan **8 feature chapter** berikut, bisa menjadi 8 baris editorial dalam 3 kelompok tematik (Setup, Execution, Analysis). Jangan menampilkan puluhan modul setara pentingnya pada satu layar. Jika repo sudah punya style feature yang berbeda, adaptasi layout namun pertahankan substansi.

### 01 — Project & Dataset Management

**UI title:** `Project & Data Management`

**Short copy:** `Organize model runs as separate projects, then prepare atmospheric datasets with tracked background downloads.`

**Technical facts:**
- Project memiliki folder terpisah dan record PostgreSQL.
- Katalog sumber mencakup GFS, ERA5, FNL, ECMWF IFS/HRES, WACCM, dan MEGAN.
- Unduhan background melacak status/progres melalui `download_jobs`.
- Auto-set tanggal namelist berdasarkan rentang data yang sudah terunduh.

**Visual terbaik:** screenshot daftar project dan/atau halaman unduh data dengan progress yang benar-benar terlihat.

**Jangan klaim:** semua dataset langsung kompatibel pada setiap langkah tanpa konversi (misalnya ERA5 NetCDF pada jalur ungrib GRIB).

### 02 — Interactive Domain Wizard

**UI title:** `Interactive Domain Wizard`

**Short copy:** `Define model boundaries, nested domains, and grid resolution visually on a map.`

**Technical facts:**
- Editor domain menggunakan Leaflet, memilih batas domain, proyeksi, resolusi, dan jumlah domain.
- Menghasilkan dan menyimpan `namelist.wps` ke project.
- Dapat merepresentasikan d01/d02 nested, bila screenshot/kasus menampilkan demikian.

**Visual terbaik:** screenshot asli peta dengan bounding boxes nested; crop highlight alami, tidak dibuat-buat.

### 03 — WRF Pipeline Control

**UI title:** `WRF Execution Dashboard`

**Short copy:** `Run preprocessing and numerical model stages from a web dashboard, with per-step status and logs.`

**Technical facts:**
- Jalur WRF: `geogrid → ungrib → metgrid → real → wrf`.
- Node dapat dijalankan per tahap; UI menyediakan Start / Stop / Restart.
- Status job tersimpan di database, log dibaca dari filesystem dengan tail terbatas untuk menjaga respons tetap ringan.
- Stop button **tidak selalu menghentikan proses OS** yang sudah berjalan; jangan klaim cancellation guaranteed.

**Visual terbaik:** screenshot nyata pipeline 5 node dan log panel.

### 04 — WRF-Chem Configuration & Execution

**UI title:** `Atmospheric Chemistry Modeling`

**Short copy:** `Extend weather simulations with configurable chemistry preparation for air-quality modeling.`

**Technical facts:**
- Jalur WRF-Chem menambahkan node `chem` di antara `real` dan `wrf`.
- Proses termasuk `mozbc`, MEGAN, `anthro_emis`, dan `wesely/exo_coldens`.
- Menyediakan pilihan mekanisme kimia, termasuk RADM2SORG.
- Data WACCM untuk syarat batas kimia, MEGAN untuk emisi biogenik.

**Visual terbaik:** screenshot pipeline WRF-Chem atau konfigurasi chemistry.

**Jangan klaim:** emisi antropogenik yang dipakai merupakan inventori Indonesia paling mutakhir. Dokumen menyatakan basis EDGAR-HTAP/EPA 2010.

### 05 — Browser-Based NetCDF Analysis

**UI title:** `NetCDF Analysis Workspace`

**Short copy:** `Inspect simulation output directly in the browser through maps, point values, time series, and vertical cross-sections.`

**Technical facts:**
- NC Viewer menerima `wrfout`, `geo_em`, `met_em`, atau file yang diunggah.
- Mendukung pemetaan variabel, statistik, nilai titik, time series, vertical cross-section, serta marks.
- Hujan dikalkulasi dari `RAINC + RAINNC + RAINSH` untuk pemetaan.
- Mempunyai overlay DAS, radar CMAX, dan tile satelit pada waktu yang sesuai.

**Visual terbaik:** salah satu screenshot NC Viewer dengan peta dan chart/cross-section nyata.

### 06 — Weather Maps & Meteorological Layers

**UI title:** `Weather Visualization`

**Short copy:** `Turn model outputs into readable meteorological maps and compare them with external observation layers.`

**Technical facts:**
- Halaman visualisasi membuat peta curah hujan dari WRF; skala warna mengikuti BMKG TP.
- Model NWP BMKG dan ECMWF HRES tersedia di halaman viewer terkait.
- Satelit Himawari IR/truecolor serta produk radar dapat dilihat sebagai layer/produk khusus.

**Visual terbaik:** peta hujan WRF atau NWP viewer nyata; label sumber dan waktu jangan disembunyikan secara menyesatkan.

**Jangan klaim:** hasil WRF otomatis tervalidasi terhadap pengamatan atau radar.

### 07 — Fire Hotspot & Land-Cover Analysis

**UI title:** `Hotspot & Land-Cover Mapping`

**Short copy:** `Overlay satellite fire detections with land-cover context for regional analysis.`

**Technical facts:**
- Hotspot dari MODIS dan VIIRS dipetakan dengan tutupan lahan Dynamic World.
- Ada tampilan khusus Kalimantan Timur dan unduhan output peta.
- WMS konsesi kayu tersedia sebagai konteks spasial pada peta analisis.

**Visual terbaik:** screenshot map hotspot Kaltim atau overlay tutupan lahan, bukan ilustrasi titik-titik acak.

### 08 — Monitoring, Logs & Reproducible Projects

**UI title:** `Execution Monitoring & Project History`

**Short copy:** `Follow long-running jobs, inspect diagnostics, and keep per-project configurations and outputs organized.`

**Technical facts:**
- Job execution dan progress tercatat pada database; beberapa status diperbarui lewat WebSocket.
- File log dapat ditampilkan secara terbatas agar log sangat besar tidak dibaca penuh.
- Per-project folder memisahkan configuration, dataset, outputs, analysis, dan logs; sebagian binary/data statis dipakai bersama melalui symlink.
- Model berjalan di satu host; **jangan** klaim distributed job scheduler, autoscaling, cluster, Celery atau Redis.

**Visual terbaik:** log/job history screenshot nyata. Jika belum ada, tampilkan teks teknis/schematic ringan, **bukan** screenshot fiktif terminal atau terminal acak.

## 4. Hierarki konten yang disarankan

Gunakan 3 pengelompokan **sebagai navigasi naratif, bukan filter yang menyembunyikan fitur dari pembaca tanpa JS**:

1. **Prepare** — Project & Data Management, Domain Wizard.
2. **Simulate** — WRF Execution Dashboard, Atmospheric Chemistry Modeling.
3. **Analyze** — NetCDF Workspace, Weather Visualization, Hotspot Mapping, Monitoring & History.

Prioritas visual ukuran besar: **Domain Wizard, WRF-Chem/WRF Dashboard, NC Viewer**. Sisanya boleh lebih compact tanpa menjadi kumpulan identik dengan dekorasi yang berlebihan.

## 5. Desain utama — Editorial Feature Explorer

**Desktop:**
- Heading dan intro section ringkas, lalu badan section dengan narasi fitur terstruktur.
- Pakai kombinasi **feature index / rail yang tenang** dengan area detail/screenshot lebih dominan; atau layout editorial alternating yang dipakai site existing jika itu lebih konsisten.
- Boleh sticky screenshot viewport mengikuti feature chapter aktif, **hanya jika** pola sticky sudah cocok dengan desain project; jangan tumpuk sticky di atas How It Works.
- Saat fitur berganti, teks dan gambar berubah ringan (fade/crossfade/clip tanpa zoom ekstrem), dan highlight indeks berpindah.
- Tampilkan nomor feature kecil sebagai penanda (`01 — 08`) bila tipografi existing mendukungnya.
- Deskripsi ringkas 1–2 kalimat, diikuti 2–3 detail fungsional terpilih. Penjelasan mendalam tidak perlu dipaksa semuanya terlihat sekaligus.

**Mobile:**
- Susun tiap fitur sebagai section linear: heading → deskripsi → screenshot/diagram, tanpa persistent sticky yang menghabiskan tinggi layar.
- Semua delapan fitur harus dapat dibaca tanpa hover, tidak ada konten hidden yang hanya accessible lewat pointer.
- Jika menggunakan tab/step selector, pastikan tombol accessible, overflow horizontal tidak menyembunyikan fitur, dan ada fallback linear.

**Karakter visual:**
- Gunakan latar, aksen, font, shadow, border, radius, grid, dan spacing dari theme repo.
- Utamakan screenshot nyata dengan anotasi tipis secukupnya, bukan icon besar generik.
- Tidak perlu seluruh item berupa box/card; whitespace dan typography harus berfungsi sebagai hierarki.
- Jangan pakai parallax berat, particle/canvas effect, 3D WebGL, atau floating gradient orb.

## 6. Interaction specification

### A. Scroll-aware active feature

- Gunakan `IntersectionObserver` untuk mendeteksi chapter aktif; gunakan event scroll passive hanya jika benar-benar dibutuhkan dan telah ada pola serupa di project.
- Feature aktif ditentukan secara deterministik dari elemen yang paling dekat dengan focal line viewport atau intersection ratio. Jangan mengandalkan sequence `onEnter` yang gagal saat user scroll cepat.
- Saat scroll turun/naik, highlight dan visual berganti sesuai posisi. Jangan mengunci scroll body atau mengubah posisi dokumen.
- Hindari rerender mahal tiap pixel; debounce/state transitions secukupnya.

### B. Visual transitions

- Animasi perubahan screenshot: opacity/translate kecil, durasi pendek, easing sesuai codebase.
- Apabila screenshot tidak ada, gunakan placeholder netral dengan nama modul yang eksplisit, **bukan** gambar produk hasil karangan.
- Jangan menganimasikan data ilmiah palsu agar terlihat seperti output model aktual.
- Lazy-load media; prefetch hanya media terdekat jika membantu navigasi.

### C. Optional click navigation

- Index fitur clickable: klik fokus/scroll ke chapter terkait secara alami, gunakan `scrollIntoView` dengan offset header bila diperlukan.
- Bila reduced-motion aktif, scroll tanpa smooth behavior.
- Keyboard dapat mengakses index, enter/space mengaktifkan, focus ring terlihat.
- Jangan membuat klik feature memicu run WRF sungguhan. Semua komponen ini adalah **presentasi portfolio statis**.

### D. Hover/focus detail

- Hover boleh menampilkan metadata pendek (contoh `WRF / WPS`, `GRIB2`, `NetCDF`), namun tidak menjadi satu-satunya cara mendapatkan informasi.
- Konten utama tetap terlihat dan bisa diakses screen reader.

## 7. Screenshot and asset handling

1. Scan asset nyata pada repo, bukan placeholder dari web.
2. Prioritaskan gambar besar dari halaman produk sesuai feature; cropping mempertahankan konteks UI.
3. Optimasi format sesuai pipeline project (AVIF/WebP jika sudah tersedia); gunakan responsive sizes dan lazy loading.
4. Tulis alt text spesifik: misalnya `ATMOS Domain Wizard showing nested simulation domains on a map` **hanya bila screenshot benar-benar membuktikannya**.
5. Jangan memuat gambar di luar layar dalam resolusi penuh tanpa kebutuhan.
6. Jangan memunculkan informasi rahasia pada screenshot: hostname internal, token, kredensial, path pribadi, data identitas, ataupun proyek nonpublik jika tidak ada izin.
7. Asset missing: berikan TODO dan fallback berupa panel outline/typographic diagram sesuai theme; laporkan daftar screenshot yang masih perlu disiapkan.

## 8. Motion, accessibility & performance

- Terapkan `prefers-reduced-motion`: hilangkan transform/crossfade yang tidak penting, tetap mempertahankan konten dan navigasi.
- Animasi hanya opacity/transform/indicator, jangan memicu reflow terus-menerus.
- Cleanup observer/listeners pada unmount; tidak ada memory leak saat pindah halaman.
- Gunakan semantic `<section>`, heading berurutan, list/tabs dengan ARIA yang sesuai bila interaktif; jangan menyamar sebagai tombol jika sebenarnya hanya dekorasi.
- Tidak ada forced scroll snapping, scroll hijacking, infinite autoplay, ataupun hover wajib.
- **Mobile-first**, hindari horizontal overflow, layout shift, atau sticky yang melampaui viewport.
- Jangan tambah animasi library baru jika IntersectionObserver + CSS atau library existing memadai.

## 9. Implementation phases — lakukan dalam satu sesi

**Phase 0 — Audit**: cari actual route, theme, component references, screenshot, structure, and animation utilities.

**Phase 1 — Content mapping**: buat data fitur dengan `id`, title, summary, factual detail, category, and optional verified asset mapping; konsisten dengan pola CMS / data di repo.

**Phase 2 — Layout**: implementasi heading + narrative feature chapters; desktop refined editorial/sticky; mobile linear.

**Phase 3 — Interaction**: active item mengikuti scroll, transitions halus, optional accessible click index, reduced motion.

**Phase 4 — Integration**: tempatkan hanya di halaman ATMOS route target, langsung setelah How It Works; tidak duplikasi How It Works atau memecahnya secara tidak sengaja.

**Phase 5 — Validation**: lint, typecheck, build, responsive smoke test, screenshot check, navigation, accessibility and cleanup.

Jangan minta konfirmasi tiap fase. Jika ada asset tidak tersedia, implementasikan fallback sederhana dan sebutkan asset yang kurang pada laporan.

## 10. Acceptance criteria / Definition of Done

- [ ] Section `Key Features` tampil di detail ATMOS yang sudah ada pada `/prkects/atoms-wrf` atau alias route yang tervalidasi.
- [ ] Theme, typography, accent, spacing, dan responsive behavior sama dengan portofolio asli.
- [ ] Fitur tidak disajikan sebagai delapan kartu SaaS generik.
- [ ] Kedalaman dan mood visual berbeda dari How It Works tetapi jelas satu desain sistem.
- [ ] Delapan feature narratives akurat pada sumber dokumen; chemistry ditandai khusus WRF-Chem.
- [ ] UI module screenshot yang digunakan berasal dari project, dengan mapping benar dan alt text kontekstual.
- [ ] Tanpa screenshot palsu, metrik hasil fiktif, klaim distributed compute, atau fitur autentikasi yang belum ada.
- [ ] Aktif berganti saat scroll turun dan naik; tetap tepat ketika scroll cepat.
- [ ] Bisa dieksplorasi dengan keyboard, reduced motion, dan pada mobile tanpa hover.
- [ ] Tidak ada scroll hijacking, gangguan sticky, CLS besar, atau dependensi besar tak perlu.
- [ ] Tidak ada perubahan global di luar kebutuhan section.
- [ ] Build/lint yang relevan berhasil; laporkan bila environment tidak bisa menjalankan uji.

## 11. Output yang harus Claude Code laporkan

Setelah selesai, buat rangkuman singkat:
1. Lokasi halaman/route aktual beserta file yang diubah.
2. Theme references, komponen reuse, dan teknik interaksi yang digunakan.
3. Daftar delapan fitur dan screenshot apa yang dipakai di masing-masing.
4. Behavior desktop/mobile dan penanganan reduced motion.
5. Hasil lint/typecheck/build dan keterbatasan (terutama screenshot yang belum tersedia).

---

## Prompt eksekusi singkat

> Pelajari repository website portofolio saya, terutama theme existing, komponen fitur, dan section How It Works ATMOS. Implementasikan section **Key Features** untuk halaman `/prkects/atoms-wrf` mengikuti seluruh plan `PLAN_KEY_FEATURES_ATMOS_WRF_PORTFOLIO.md`. Saya ingin **editorial feature showcase** yang interaktif dan scroll-aware, dengan screenshot produk yang benar-benar ada, bukan grid kartu AI-slop. Fokus pada delapan fitur berdasarkan `PRESENTASI-WRF-WEB.md` dan jangan mengarang fitur atau metrik. Pertahankan route existing, performa, responsiveness, reduced motion dan kualitas aksesibilitas. Kerjakan audit, implementasi, uji dan laporkan hasilnya tanpa menunggu konfirmasi per fase.
