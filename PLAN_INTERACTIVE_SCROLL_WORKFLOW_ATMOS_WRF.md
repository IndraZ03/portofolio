# IMPLEMENTATION PLAN — ATMOS / WRF-WEB — HOW IT WORKS (SCROLL-DRIVEN)

> **Instruksi siap eksekusi untuk Claude Code.** Ini adalah section halaman detail proyek portofolio yang **sudah ada**, bukan slide, website baru, atau redesign global.
>
> **Target route persis dari permintaan:** `/prkects/atoms-wrf`.
> Jangan diam-diam membetulkan ejaan route menjadi `/projects/atmos-wrf`. **Cari route aktual di repository terlebih dahulu; pertahankan path yang sudah dipakai dan pastikan URL yang diminta ditangani tanpa merusak link existing** (bila diperlukan gunakan alias/redirect sesuai routing proyek). Laporkan ketidaksesuaian path jika ada.
>
> Source of truth desain: **komponen, theme, animasi, dan layout yang telah ada pada portofolio**. Source of truth proses ATMOS: `PRESENTASI-WRF-WEB.md` yang disediakan pemilik proyek. Dokumen ini tidak membenarkan menambahkan fitur yang belum ada.

## 0. Tugas utama

Bangun section **“How It Works”** untuk case study **ATMOS — Web-Based Atmospheric Modeling Platform**, berupa **alur modeling yang vertikal dari atas ke bawah dan bereaksi secara kontinu saat pengguna scroll**. Progress line harus mengalir mengikuti posisi pengguna; node dan penjelasan aktif berganti sejalan dengan step yang dilalui. Scroll balik ke atas membalik progres tanpa reset atau replay. Visualisasi pendamping boleh **sticky** di desktop dan menampilkan keadaan pipeline yang relevan.

**Jangan mendesain dengan pola generik AI-slop**: tidak ada gradient neon random, glow, glassmorphism berat, orbit partikel, 3D yang tidak diperlukan, card warna-warni, atau animasi otomatis tanpa kaitan dengan scroll. Buat terasa seperti bagian asli dari portofolio.

## 1. Fase 0 — Wajib audit proyek sebelum menulis kode

1. Cari route yang dituju dan struktur dynamic/project detail page. Pastikan hasil untuk `/prkects/atoms-wrf` sesuai kebutuhan pemilik proyek; jangan ubah route lain.
2. Temukan **implementasi “How It Works” Auto-Sosmed sebelumnya**, jika ada, beserta scroll-progress logic, stepper, sticky visual, hook/action, utilitas, CSS, breakpoint, reduced-motion, dan aturan cleanup. Gunakan **perilaku interaksi setara**, bukan menyalin mentah konten/struktur arsitektur Auto-Sosmed.
3. Temukan referensi interaksi lain yang sudah ada pada repo (scroll reveal, progress, active section, sticky story) dan tentukan referensi paling sesuai.
4. Audit tokens theme asli: font heading/body, warna permukaan, foreground, subtle borders, aksen, spacing, container widths, radius, scroll offsets, motion/easing. Jangan hardcode palet baru.
5. Pastikan framework portofolio berdasarkan kode, bukan menebak dari nama produk. ATMOS dibangun dengan FastAPI/Jinja2, **tetapi website portofolio tidak otomatis memakai framework itu**.
6. Periksa pola i18n / bahasa konten di halaman proyek. Terapkan bahasa yang konsisten.
7. Cari aset screenshot nyata milik ATMOS yang sudah ada di repository; jangan fabricate screenshot atau produk cuaca. Bila tidak tersedia, gunakan diagram SVG/CSS berbasis teks.
8. Sebelum coding, keluarkan ringkasan audit singkat: path route, komponen referensi, library atau teknik scroll, token desain, lokasi implementasi, serta peringatan bila ada konflik route.

**Batas perubahan:** Section ini saja, plus data/component kecil yang benar-benar dibutuhkan. Jangan ubah typography global, theme, footer, navigation, atau cara routing proyek secara luas. Jangan menambah dependency berat tanpa kebutuhan.

## 2. Tujuan pengalaman pengguna

Pengunjung non-spesialis harus langsung memahami bahwa ATMOS **mengorkestrasi** model WRF/WRF-Chem yang berjalan di komputasi backend, bukan menghitung prakiraan dengan JavaScript di browser.

- Urutan baca tetap alami; **tidak ada scroll hijacking / freeze scroll**.
- Saat scroll turun, thin progress track terisi **top → bottom** berdasarkan posisi nyata node.
- Satu langkah aktif paling menonjol; langkah lampau terlihat selesai, langkah berikutnya lebih tenang.
- Step yang sedang aktif mengubah skematik konteks pada panel kanan di desktop, dengan transisi singkat yang subtil.
- Jika pengguna scroll cepat, active step harus langsung benar. Jika scroll balik, visual dan progress mundur konsisten.
- Tahap CHEM adalah **cabang opsional khusus WRF-Chem**, bukan tahap wajib WRF meteorologi biasa.
- Penjelasan komputasi bersifat akurat, mudah dipahami, dan tidak memuat command/path sensitif yang tidak diperlukan di portofolio.

## 3. Narasi pipeline — konten yang WAJIB benar

Tampilkan **8 tahap utama** berikut. Isi konten ringkas; penjelasan tambahan dapat tampil pada visual kontekstual jika membantu.

| # | UI heading (EN, bila website English) | Penjelasan inti | State visual | Referensi perilaku sistem |
|---|---|---|---|---|
| 01 | **Create a Project** | Pengguna membuat workspace simulasi dengan preset dataset, konfigurasi, dan direktori project tersendiri. | `Project workspace` tercipta, konfigurasi awal. | PostgreSQL + filesystem project. |
| 02 | **Define Model Domains** | Domain Wizard berbasis peta memungkinkan menggambar batas wilayah, resolusi, proyeksi, dan nesting; tersimpan sebagai `namelist.wps`. | Peta skematik + satu/dua persegi domain (`d01`, `d02`). | Leaflet / WPS namelist. |
| 03 | **Prepare Input Data** | Pilih dan unduh data meteorologi (mis. GFS/FNL/IFS, dengan pengolahan sesuai format); opsi WRF-Chem membutuhkan input tambahan seperti WACCM/MEGAN. Unduhan dipantau sebagai background jobs. | Sumber data → datasets + status unduh. | Data source catalog + download jobs. |
| 04 | **Run WPS Preprocessing** | `geogrid → ungrib → metgrid` menyiapkan geografi, input meteorologi, dan interpolasi ke grid model. | Tiga mini-node aktif berurutan pada satu langkah. | WPS 4.7, keluaran `geo_em`, intermediate, `met_em`. |
| 05 | **Initialize the Model** | `real.exe` memproses `met_em` dan pengaturan namelist menjadi kondisi awal dan batas simulasi (`wrfinput`, `wrfbdy`). | Data praolah → Initial & boundary conditions. | WRF REAL. |
| 06 | **Prepare Atmospheric Chemistry** | **Opsional, hanya WRF-Chem**: jalankan preparasi kimia seperti mozbc, MEGAN, anthro_emis, wesely/exo_coldens sesuai konfigurasi dan data yang tersedia. | Jalur bercabang dengan label `WRF-Chem only`; meteorological WRF bypass. | Tahap `chem` tidak universal. |
| 07 | **Execute WRF Simulation** | `wrf.exe` menjalankan simulasi di mesin komputasi; status job dan potongan log dapat dipantau di dashboard sampai tersedia keluaran NetCDF (`wrfout`). | Compute node → output data; log/status ringkas. | WRF 4.8 + MPI, node manual. |
| 08 | **Explore & Analyze Results** | Hasil ditelusuri melalui NC Viewer: peta parameter, time series, irisan vertikal, peta hujan, dan overlay pendukung sesuai fitur yang tersedia. | `wrfout` → map / chart / section. | NC Viewer + visualization modules. |

### Penting: logika ilmiah dan operasional

- **WRF non-kimia:** `geogrid → ungrib → metgrid → real → wrf`.
- **WRF-Chem:** `geogrid → ungrib → metgrid → real → chem → wrf`, dengan preparasi kimia sesuai kebutuhan. Jangan memberi kesan `chem` selalu dijalankan.
- Tahap-tahap WRF di dashboard saat ini bisa di-**Start / Stop / Restart per node**. **Jangan mengklaim semuanya otomatis berjalan end-to-end dalam sekali klik.** Workflow ini menjelaskan perjalanan pengguna secara konseptual.
- Status unduhan dan job dipantau dalam sistem, tetapi `Stop` di UI tidak membuktikan proses OS selalu langsung terhenti. Jangan menampilkan jaminan penghentian proses.
- Sumber data mendukung beberapa format dan alur konversi; **jangan menggambarkan ERA5 NetCDF otomatis kompatibel dengan `ungrib` secara langsung**. Jika menyebutnya, gunakan wording “data dipersiapkan sesuai format yang dibutuhkan WPS”.
- WRF-Chem dan analisis kualitas udara **tidak sama** dengan semua run WRF biasa. Jangan mengklaim keluaran kimia untuk simulasi yang tidak mengaktifkan chemistry.
- Hindari mengarang angka akurasi model, benchmark, efisiensi, durasi run pasti, jumlah pengguna, maupun klaim multi-server/autoscaling.
- Tidak ada bukti user authentication atau scheduler multi-server siap produksi dari dokumen sumber. Section ini tidak boleh mengimplikasikan kemampuan tersebut.

## 4. Komposisi visual — pakai pola portofolio

### Desktop, bila sejalan dengan existing referensi

```text
[EYEBROW / SECTION INDEX dari theme]
How It Works
From defining a region to exploring atmospheric model output.

┌──────────────────────────────────────┬─────────────────────────────────────┐
│ VERTICAL SCROLL STORY                │ STICKY PIPELINE CONTEXT             │
│                                      │                                     │
│ ● 01 Create a Project                │  [current step schematic]           │
│ │                                    │                                     │
│ ● 02 Define Model Domains            │  Thin labels / mini-nodes           │
│ │                                    │  based on selected step.            │
│ ● 03 Prepare Input Data              │                                     │
│ │                                    │  WRF path ───────────────┐          │
│ ● 04 Run WPS Preprocessing           │  WRF-Chem via CHEM ──────┼→ Output │
│ │                                    │                                     │
│ ● 05 Initialize the Model            │  No heavy decorative panel.         │
│ │                                    │                                     │
│ ◇ 06 Prepare Chemistry [Optional]    │                                     │
│ │                                    │                                     │
│ ● 07 Execute WRF Simulation          │                                     │
│ │                                    │                                     │
│ ● 08 Explore & Analyze Results       │                                     │
└──────────────────────────────────────┴─────────────────────────────────────┘
```

**Mobile:** single column reading flow; no forced sticky split, no horizontal overflow. If right-side panel is important, move mini-visual **inline at the active step** or use a compact non-sticky diagram. All copy always stays readable without interaction.

### Perancangan gaya

- Editorial data-story: hierarchy heading kuat, angka langkah kecil, body copy ringkas, garis tipis, whitespace yang disiplin.
- Tekstur visual berasal dari **diagram/domain grid/output visual nyata**, bukan dekorasi acak.
- Jangan menduplikasi interface produk seolah benar-benar interaktif jika hanya ilustrasi.
- Gunakan icons dan typographic scale yang sudah ada di repo; jangan impor ikon campur gaya.
- Jangan membuat node terlalu besar, nested cards yang berlapis, atau animasi “typewriter” tanpa fungsi.
- Bagian ini harus berbeda dari *System Architecture*: ini adalah **alur kerja pengguna**, bukan semua komponen backend dalam satu bagan.

## 5. Scroll mechanics (WAJIB)

### 5.1 Timeline progress kontinu

1. Buat track vertikal yang menghubungkan pusat node pertama hingga node terakhir.
2. Petakan posisi scroll viewport menjadi `progress` dalam rentang `0…1`. Gunakan posisi geometris aktual node, **bukan** pembagian rata berdasar asumsi tinggi setiap step sama.
3. Fill progress line menggunakan teknik ringan seperti transform `scaleY()` / panjang SVG path; top-origin. Ikuti mekanisme utilitas animasi yang telah dipakai proyek.
4. Step state: `upcoming` → `active` → `completed`, dengan satu active step pada satu waktu; perubahan mengikuti viewport threshold yang stabil, tidak flicker.
5. Saat scroll ke atas, garis menyusut secara natural dan node kembali ke state relevan.
6. Saat scroll cepat/route anchor restore, posisi dan status langsung sinkron; hindari replay animasi panjang.
7. Sticky panel berubah **hanya saat active step berubah**; continuous progress sebaiknya tidak memicu rerender semua step setiap frame.
8. Akhiri progress tepat di node terakhir dan biarkan halaman meneruskan scroll ke section berikutnya.

### 5.2 State khusus cabang kimia

- Step 06 harus menampilkan label jelas **`Optional · WRF-Chem`**.
- Pada diagram mini, tunjukkan dua jalur logis: `REAL → WRF` (meteorologi biasa) dan `REAL → CHEM → WRF` (WRF-Chem).
- Saat step 06 aktif, cabang kimia memperoleh fokus **sebagai penjelasan opsi**, bukan seolah semua run wajib memprosesnya.
- Pada step 07, kedua jalur bergabung menuju eksekusi WRF. Jangan menggambarkan seolah pipeline web menjalankan keduanya secara paralel untuk satu job.

### 5.3 Sticky panel

- Jika referensi existing memakai sticky visual, reuse. Perhitungkan tinggi navbar sticky serta responsive breakpoint.
- Gunakan `position: sticky`, bukan fixed/pinning paksa; biarkan release alami pada ujung section.
- Transisi konten singkat dengan opacity/translate beberapa piksel maksimal, bukan scene 3D/parallax jauh.
- Jika viewport pendek atau panel berpotensi melewati tinggi area layar, jatuhkan ke layout normal.

### 5.4 Responsif, aksesibilitas, dan reduced motion

- Konten harus ada dalam DOM dan bisa dibaca tanpa JavaScript / animasi, progressive enhancement.
- Gunakan `section`, heading hierarchy, `ol/li`, dan `aria-hidden` untuk diagram dekoratif.
- Nomor dan label state harus terbaca tanpa hanya mengandalkan warna.
- Jangan trigger `aria-live` per langkah selama user scroll.
- Hormati `prefers-reduced-motion`; tetap tampilkan konten lengkap dengan perubahan statis/instan yang masuk akal.
- Pastikan tidak ada scroll lock, touch interception, content shift, sidebar overlap, atau overflow-x.
- Jaga keyboard navigation dan focus ring bila node boleh diklik. Jika nodes hanya indikator visual, **jangan** buat tab stops palsu.

## 6. Teknologi dan performance constraints

**Urutan pilihan:** existing animation primitives / hooks dari project → browser native `IntersectionObserver` + `requestAnimationFrame` + `ResizeObserver` → dependency tambahan hanya jika benar-benar diperlukan dan disetujui pola repo.

- Hindari membuat `setState` untuk setiap pixel scroll; update CSS variable/transform untuk progress, dan state framework hanya ketika active step berubah.
- Gunakan `passive` scroll event, throttle via rAF, cleanup observer/event listener.
- Hindari `getBoundingClientRect()` untuk seluruh step pada setiap tick jika geometry bisa dicache dan diperbarui ketika ResizeObserver/layout berubah.
- Pertimbangkan `document.fonts` / asset loading dengan teknik aman menurut framework existing; jangan akses browser API saat SSR.
- Hindari canvas/WebGL/Three.js hanya untuk enam sampai delapan titik pipeline.
- Jangan memasang GSAP/ScrollTrigger/Lenis/Motion baru jika ada implementasi yang cukup di codebase.
- Saat tab tidak terlihat atau section jauh dari viewport, jangan terus menerus melakukan animation work yang tidak perlu.
- Semua visual SVG/CSS tetap crisp di retina dan tidak memerlukan asset besar.

## 7. Rincian visual panel per langkah

1. **Project**: sebuah workspace sederhana yang menampilkan `configuration/`, `datasets/`, `outputs/`; tidak harus menyerupai folder explorer OS.
2. **Domain**: representasi peta/domain grid minimal, `d01` dan `d02` bila relevan. Jangan mengarang batas koordinat tertentu sebagai kondisi semua proyek.
3. **Datasets**: label GFS/FNL/IFS dan input kimia tambahan WACCM/MEGAN sebagai jalur kondisional; progress unduh bersifat ilustrasi tanpa persentase palsu.
4. **WPS**: geogrid/ungrib/metgrid muncul sebagai tiga node berurutan; output intermediate bukan “prakiraan cuaca final”.
5. **REAL**: skematik `met_em → real.exe → wrfinput + wrfbdy`.
6. **CHEM**: panel 2-cabang WRF/WRF-Chem dan daftar tool kimia secara terbatas; hindari memberi kesan semua tool selalu berjalan.
7. **WRF**: `wrf.exe` dan teks “compute execution”, status log abstrak (bukan fake terminal logs atau angka runtime rekaan), keluaran `wrfout`.
8. **Analysis**: mini map/graph/slice secara diagramatik; jika screenshot real tersedia pakai itu. Bila tidak ada, diagram terlabel `NetCDF output → Visualization` tanpa pura-pura menampilkan hasil prakiraan riil.

Konten harus singkat, tidak lebih dari 1 heading + 1–2 kalimat per step kecuali existing portofolio memakai pola ekspansi. Pilihan judul/narasi boleh diterjemahkan bila website Indonesia.

## 8. Integrasi dengan case study yang sudah ada

- Masukkan section di antara bagian **The Solution** dan **Key Features** bila urutan halaman ada; kalau layout sudah punya struktur lain, ikuti layout eksisting.
- Jangan membuat route standalone demo untuk menggantikan halaman detail; hasil **harus tampil di `/prkects/atoms-wrf`** (atau route resmi existing yang memetakan path tersebut).
- Bila ditemukan section How It Works lain, modifikasi/reuse tanpa duplikasi section.
- Sesuaikan scroll-offset terhadap sticky header dan navigasi in-page jika ada.
- Jangan mencampur data proyek ATMOS dengan Auto-Sosmed; yang boleh direuse adalah **komponen/pola animasi**, bukan isi.
- Pastikan teks, label, ikon, dan diagram konsisten dengan tone bahasa & theme portofolio.
- Bila asset ATMOS belum tersedia di proyek portofolio, buat skematik inline SVG/CSS; jangan menggunakan screenshot random dari internet atau AI-generated UI.

## 9. Acceptance criteria — Definition of Done

- [ ] Audit komponen scroll referensi dari portofolio selesai, ringkasan temuan disampaikan.
- [ ] Route `/prkects/atoms-wrf` ditangani berdasarkan temuan struktur route aktual; tidak merusak link lama.
- [ ] Section muncul di halaman proyek ATMOS, bukan di homepage atau projek lain.
- [ ] Semua **8 tahap** ditampilkan dalam urutan benar, dengan CHEM ditandai opsional.
- [ ] Progress line bergerak kontinu dari **atas ke bawah** saat scroll turun.
- [ ] Saat scroll naik, progress dan active step kembali sesuai posisi viewport.
- [ ] Sticky contextual panel (bila desain existing mendukung) merespons active step tanpa flicker atau layout shift.
- [ ] Cabang `REAL → WRF` dan `REAL → CHEM → WRF` dijelaskan secara akurat.
- [ ] Narasi tidak mengeklaim one-click fully automatic WRF run atau multi-server yang belum terimplementasi.
- [ ] Mobile, tablet, desktop diuji: tidak overflow, tidak mengunci scroll, tidak tumpang tindih navbar.
- [ ] Reduced-motion dan keyboard accessibility tidak terganggu.
- [ ] Tidak ada duplikasi framework/plugin, asset palsu, metrik rekaan, atau estetika AI-slop.
- [ ] Event listeners / observers dibersihkan ketika pindah route/unmount.
- [ ] Jalankan perintah lint, typecheck, build, dan test yang relevan **yang memang tersedia** di repo; perbaiki error terkait perubahan.
- [ ] Berikan laporan singkat berisi: file yang diedit, integrasi reference/theme, implementasi scroll, hasil testing, dan batas yang masih ada.

## 10. Instruksi eksekusi untuk Claude Code

1. **Inspect** repo, route, existing How It Works Auto-Sosmed dan theme.
2. **Plan narrowly** bagian section ATMOS berdasarkan komponen referensi.
3. **Implement** seluruh 8 steps, scroll progression dua arah, chemistry branch, dan panel konteks ringan.
4. **Verify** tampilan/behavior dan jalankan tes repo.
5. **Report** ringkas; jangan berhenti pada contoh mockup, pseudocode, atau saran. Lakukan perubahan langsung pada halaman portofolio yang ada.

**Prinsip penutup:** Ini adalah **modeling workflow story**, bukan dokumentasi seluruh API maupun peta arsitektur. Buat interaksi yang terasa natural, menjelaskan WRF dengan benar, tetap tenang secara visual, dan mengikuti identitas visual portofolio yang sudah dibangun.
