# IMPLEMENTATION PLAN — SYSTEM ARCHITECTURE / ATMOS WRF

> **Target:** halaman detail proyek portofolio pada `/prkects/atoms-wrf` (pertahankan path ini jika memang route yang aktif; verifikasi dalam repository sebelum perubahan).  
> **Section:** `System Architecture`  
> **Tujuan:** menampilkan arsitektur aktual ATMOS/WRF-WEB sebagai **interactive architecture explorer** yang elegan, ringan, mudah dipahami, dan sepenuhnya konsisten dengan desain portofolio yang telah ada.  
> **Untuk:** Claude Code yang memiliki akses ke repository portofolio.  
> **Status:** spesifikasi implementasi, bukan klaim bahwa section telah dibangun.

## 0. Instruksi utama (wajib)

**Jangan langsung menulis komponen.** Sebelum implementasi:

1. Audit route `/prkects/atoms-wrf` dan cari route kanonis jika ada perbedaan ejaan (`projects`, `atmos-wrf`, dll.). Jangan mengganti URL yang sudah berjalan tanpa alasan atau permintaan.
2. Pelajari halaman detail proyek ATMOS, khususnya section `How It Works` dan `Key Features` yang sudah dibuat, lalu identifikasi layout, spacing, section containers, typography, icon, breakpoint, surface, dark/light mode, dan motion pattern.
3. Cari **referensi UI/interaksi yang sudah ada di repository**. Reuse utilities, component primitives, dan animation library yang benar-benar sudah dipakai. Jangan menambahkan GSAP, Framer Motion, React Flow, Mermaid runtime, atau dependency lain hanya demi diagram jika SVG/CSS dan library existing sudah cukup.
4. Identifikasi framework project portofolio. **Jangan mengasumsikan portofolio memakai stack yang sama dengan ATMOS.** Sesuaikan implementasi dengan framework proyek eksisting.
5. Jangan mengubah global theme, styling lintas halaman, header, navigasi, atau komponen proyek lain.
6. Buat section bernuansa **engineering case study**, bukan diagram SaaS generik: jangan pakai gradient neon, glass cards berlapis, glow besar, bouncy animations, particle background, icon dekoratif berlebihan, atau fake terminal.
7. Semua teks, label, dan deskripsi berasal dari arsitektur yang dijelaskan di bawah; jangan mengarang Kubernetes, Redis, Celery, cluster compute, scheduler terdistribusi, multi-user auth, dan realtime streaming yang tidak terbukti.
8. Pastikan performa, aksesibilitas, keyboard interaction, dan `prefers-reduced-motion` ditangani dengan baik.

## 1. Tujuan pengalaman pengguna

Pengunjung harus dapat memahami dalam 15–30 detik bahwa ATMOS menghubungkan **browser → aplikasi FastAPI → database / files / background tasks → WPS, WRF, WRF-Chem → keluaran analisis**, serta memanfaatkan sumber data meteorologi eksternal.

Alur narasi utama yang perlu disampaikan:

- **Presentation & Control** — Pengguna mengelola proyek, domain, dataset, run, dan visualisasi melalui UI web.
- **Application Layer** — FastAPI menangani API, perintah, job tracking, dan komunikasi status.
- **Data & State** — PostgreSQL menyimpan metadata dan job state; file besar serta output kerja disimpan pada filesystem; object storage bersifat opsional.
- **Scientific Compute** — Executable WPS/WRF dan pemroses WRF-Chem berjalan di host komputasi yang sama, menggunakan MPI sesuai konfigurasi aktual.
- **External Sources** — NOAA, ECMWF, Himawari, dan sumber visual meteorologi memasok data/produk sesuai modul.

## 2. Konsep desain: `Interactive Architecture Explorer`

### Desktop

- Section heading editorial: `System Architecture` + deskripsi singkat + label kecil semacam `HOW ATMOS IS ENGINEERED` jika cocok dengan pola halaman.
- Diagram **5 logical groups** dengan jalur koneksi yang jelas dan whitespace cukup. Visualisasikan dalam SVG responsif atau DOM/SVG hibrida; sebisa mungkin tanpa canvas berat.
- Gunakan dua bagian yang saling terkait:
  - **Area diagram:** node-node arsitektur dan edges; sticky hanya jika pola sticky sudah ada dan tidak menimbulkan konflik layout.
  - **Area narrative:** deskripsi per layer, dapat di-scroll, memilih fokus diagram.
- Animasi scroll hanya memberi penekanan *focus* pada layer (opacity, stroke, highlight lembut). Jangan mensimulasikan aliran data kontinu tanpa alasan.
- Node bisa difokuskan dengan klik/keyboard; deskripsi ringkas tampil di panel penjelasan, bukan popup yang menghalangi diagram.
- Berikan mode **Overview** untuk menampilkan keseluruhan koneksi tanpa penekanan selektif.

### Mobile

- Jangan memaksa diagram desktop menjadi sangat kecil/tidak terbaca.
- Gunakan daftar layer vertikal dan diagram ringkas pada layar sempit; node/penjelasan menjadi disclosure atau selectable rows sesuai komponen existing.
- Tidak ada horizontal overflow, scroll hijacking, dan hover-dependent interaction.

### Scroll dynamics

- Saat layer masuk ke posisi baca, fokus aktif berpindah: `UI → API → Data → Compute → Outputs`.
- User tetap dapat mengklik node secara manual; jangan biarkan observer langsung mengalahkan pilihan manual saat belum ada perubahan scroll yang nyata.
- Ketika scroll balik ke atas, focus mengikuti posisi saat ini.
- Transisi singkat dan tenang, berbasis opacity dan transform kecil atau SVG stroke. Hindari perhitungan animasi setiap pixel scroll; gunakan IntersectionObserver/scroll utilities existing, dan `requestAnimationFrame` jika diperlukan.

## 3. Model arsitektur yang wajib akurat

### 3.1 Node dan tanggung jawab

| Grup | Node | Penjelasan UI yang aman |
|---|---|---|
| Presentation | Browser / Web UI | Halaman Jinja2, interaksi Alpine.js/Tailwind/DaisyUI, Leaflet untuk peta |
| Application | FastAPI + Uvicorn | Route API, validasi input, koordinasi project, dataset dan job |
| Application | BackgroundTasks + threads | Menjalankan pekerjaan unduhan / pemodelan di host yang sama; **bukan** job queue terdistribusi |
| Application | WebSocket WRF status | Menyampaikan pembaruan status tertentu ke browser; log juga dibaca dari file |
| State | PostgreSQL | Project, dataset, download jobs, WRF jobs, mark locations, katalog satelit, dan metadata |
| State | Local project filesystem | Konfigurasi/namelist, dataset kerja, output NetCDF, log, executable links |
| State | Optional object storage | Antarmuka boto3 ke MinIO/S3/Ceph; jalur WPS tetap membutuhkan local file paths |
| Compute | WPS 4.7 | `geogrid`, `ungrib`, `metgrid` |
| Compute | WRF 4.8 | `real.exe`, `wrf.exe` |
| Compute | WRF-Chem processors | `mozbc`, MEGAN, `anthro_emis`, `wesely` / `exo_coldens` pada tahap kimia opsional |
| Compute | OpenMPI | Menjalankan program terkait MPI sesuai runner/config aktual; jangan klaim paralel penuh |
| Sources | NOAA / ECMWF | GFS, FNL, ERA5, IFS/HRES dan produk terkait sesuai sumber masing-masing |
| Sources | Himawari / BMKG products | Citra satelit dan layer analisis/overlay pada modul yang tersedia |
| Outcomes | NetCDF / NC Viewer | Peta parameter, time series, cross-sections, titik dan analisis hasil |
| Outcomes | Weather maps & other visuals | Peta hujan, NWP overlays, radar/satelit, hotspot sesuai fitur |

### 3.2 Hubungan diagram yang direkomendasikan

```mermaid
flowchart TB
    B[Browser / UI] --> A[FastAPI application]
    A <--> P[(PostgreSQL)]
    A <--> F[(Local project files)]
    A -. optional .-> O[(MinIO / S3 / Ceph)]
    A --> T[Background tasks / threads]
    T --> WPS[WPS 4.7]
    T --> WR[WRF 4.8]
    T --> C[WRF-Chem processors (optional)]
    T --> E[External datasets: NOAA / ECMWF]
    WPS --> F
    WR --> F
    C --> F
    F --> V[NetCDF viewer / visual products]
    A --> V
    A --> S[WRF status WebSocket]
    S --> B
```

**Catatan:** diagram adalah penyederhanaan konseptual untuk presentasi portofolio, bukan sequence diagram runtime satu-per-satu. Alur komputasi ilmiah detail sudah diceritakan pada `How It Works`; hindari mengulang seluruh urutan domain sampai analisis di sini.

### 3.3 Keterangan teknis yang patut ditonjolkan

- Aplikasi server-rendered: **Jinja2 + Alpine.js + Tailwind/DaisyUI**, backend **FastAPI/Uvicorn**.
- Data terstruktur/riwayat disimpan di **PostgreSQL**; file besar di disk proyek.
- Background jobs menjalankan WPS/WRF/kimia pada **satu mesin**, bukan farm worker atau distributed scheduler.
- `wrf_jobs` menyimpan status, log di filesystem; status WRF dapat dikirim lewat WebSocket.
- Pembacaan log dibatasi ke **ekor file** (sekitar 8 MB / 500 baris pada implementasi yang ditelaah) untuk mencegah pemrosesan log besar berlebihan.
- Executables WRF/WPS dan data geografi statis digunakan bersama melalui referensi/symlink, sedangkan tiap proyek memiliki dataset, konfigurasi, dan hasilnya sendiri.
- Object storage bersifat **pluggable/optional**, bukan satu-satunya media I/O WRF.
- Tidak boleh mengklaim login multi-user, multi-server, Kubernetes, Redis/Celery atau advanced autoscaling aktif.

## 4. Microinteractions yang disarankan

1. **Layer focus:** active layer mendapat kontras dan stroke sesuai theme existing; layer lain masih terlihat dan dapat diklik.
2. **Edge emphasis:** hanya garis yang berkaitan dengan active node/layer yang menjadi lebih kontras.
3. **Node detail:** klik/Enter/Space pada node membuka penjelasan 1–3 kalimat + kategori (UI, API, Data, Compute, Integration).
4. **Path trace:** saat memilih misalnya `BackgroundTasks`, tampilkan relasi ke `WPS`, `WRF`, `WRF-Chem`, bukan animasi partikel yang berjalan tanpa henti.
5. **Accessible feedback:** informasi juga tercetak dalam teks, tidak hanya dibedakan melalui warna atau gerak.
6. **Reduced motion:** nonaktifkan animasi/transisi berlebihan dan pertahankan state fokus instan.

## 5. Konten editorial yang dapat langsung dipakai

**Eyebrow:** `SYSTEM ARCHITECTURE`

**Heading:** `A web interface connected to a scientific compute engine.`

**Intro:** `ATMOS brings project configuration, data preparation, model execution, and scientific outputs into one web experience. Behind the interface, the application coordinates data, files, and WRF executables on a single compute host.`

**Layer summaries:**

1. **Interface & Control** — `Server-rendered pages make model configuration, maps, and job controls accessible from the browser.`
2. **Application Services** — `FastAPI manages projects, datasets, model operations, and status endpoints.`
3. **Persistent State & Files** — `PostgreSQL keeps operational metadata while the project filesystem holds input data, configuration, logs, and model outputs.`
4. **Scientific Execution** — `WPS, WRF, and optional chemistry processors execute as native scientific programs rather than browser-side calculations.`
5. **Analysis & Visualization** — `NetCDF outputs power weather maps, time series, cross-sections, and related geospatial analysis.`

**Technical note (optional):** `Architecture shown reflects the single-host implementation documented for ATMOS 0.1.0; the diagram does not imply distributed orchestration.`

Copy may be adapted to the portfolio's prevailing language (Indonesian/English); **follow the established page voice** instead of mixing languages arbitrarily.

## 6. Engineering detail panel (opsional tetapi kuat untuk portfolio)

Sediakan satu panel kecil `Engineering considerations`, bukan sebuah tabel raksasa:

- **Separate model workspaces** — per-project folders isolate namelists, inputs, and outputs.
- **Shared scientific binaries** — symlinks avoid duplicating WRF/WPS executables for every project.
- **Large-log handling** — server reads bounded log tails instead of full multi-GB files.
- **Operational visibility** — database job records, filesystem logs, and status updates allow inspection of long-running models.

Jangan memunculkan angka performa, peningkatan efisiensi, atau jumlah concurrent jobs tanpa pengukuran.

## 7. Aturan kesesuaian dengan bagian portofolio lain

- Tidak meniru kembali vertical node timeline milik **How It Works**.
- Tidak meniru screenshot showcase milik **Key Features**.
- Gunakan **diagram arsitektur eksploratif**, dengan node-layer hierarchy, restrained lines, dan penjelasan teknik yang bisa dipilih.
- Hierarki teks, maksimum lebar konten, font, corner radius, stroke, surface, dan warna aksen harus merujuk ke design tokens yang sudah ada di project.
- Jika referensi desain project sudah memiliki diagram atau graphical components, adaptasi komponen tersebut terlebih dahulu.
- Jangan memasukkan gambar AI atau placeholder visual palsu. SVG diagram berbasis arsitektur asli lebih tepat.

## 8. Implementasi dan performa

1. Buat data-driven architecture config lokal (nodes, edges, layers, descriptions) agar konten dapat dipelihara tanpa mengedit banyak JSX/Svelte/HTML. Sesuaikan dengan framework repo.
2. Gunakan IDs stabil; hindari `Math.random` untuk layout node.
3. Posisi node/garis harus deterministik dan responsif; garis connector tidak boleh melintasi teks penting.
4. Animasi hanya pada opacity/stroke/transform bila mungkin; hindari layout thrashing.
5. Tidak perlu physics graph atau library chart berat.
6. Cleanup observers/listeners ketika komponen unmount.
7. Jangan memakai polling untuk deteksi scroll.
8. Verifikasi layout pada desktop lebar, laptop, tablet, dan mobile 360–390 px.
9. Support tab, Enter/Space, focus visible, semantic labels, dan pointer/touch targets yang layak.
10. Respect `prefers-reduced-motion`.

## 9. Tahapan eksekusi untuk Claude Code

### Phase A — Repository reconnaissance

- Temukan route aktif ATMOS dan source file-nya.
- Pelajari implementasi How It Works / Key Features dan pattern desain lain.
- Inventaris theme variables, breakpoints, motion library, UI primitives, dan screenshot/asset bila ada.
- Laporkan temuan secara singkat dalam output implementasi (tanpa meminta konfirmasi jika tidak diperlukan).

### Phase B — Architecture model & composition

- Bangun konten node dan edge berdasarkan Section 3.
- Tentukan struktur desktop/mobile yang cocok dengan sistem desain saat ini.
- Tambahkan heading dan intro yang relevan.

### Phase C — Interaction implementation

- Hubungkan scroll-aware layer focus, node selection, detail panel, edge highlighting, reverse scrolling, dan Overview state.
- Prioritaskan interaksi deterministik serta transisi tenang.

### Phase D — Quality & validation

- Lakukan build/typecheck/lint/test yang tersedia.
- Audit keyboard/touch, reduced motion, contrast, diagram overflow, sticky layout, dan performa scroll.
- Periksa route yang sudah ada tetap bekerja; jangan mengganggu section sebelumnya.

## 10. Acceptance criteria

- [ ] System Architecture tampil pada detail proyek ATMOS di route eksisting (target `/prkects/atoms-wrf`).
- [ ] Theme mengikuti proyek portofolio, tanpa CSS global yang merusak section lain.
- [ ] Diagram menggambarkan UI, FastAPI, state/storage, background execution, WPS/WRF/WRF-Chem, external sources dan outputs.
- [ ] Tidak mengklaim fitur infrastruktur yang tidak ada.
- [ ] Ada pemilihan node/layer yang bermakna dan penjelasan kontekstual.
- [ ] Fokus diagram mengikuti scroll; arah balik juga berfungsi.
- [ ] Interaksi manual tetap bisa dipakai tanpa mouse.
- [ ] Mobile tetap terbaca tanpa overflow.
- [ ] Animasi tenang, ringan, nonblocking, dan patuh reduced motion.
- [ ] Tidak ada dependensi berat baru tanpa alasan teknis nyata.
- [ ] Build/lint/typecheck tidak regresi.

## 11. Instruksi akhir siap eksekusi

**Implementasikan** section `System Architecture` ATMOS sebagai interactive engineering architecture explorer di route yang sudah ada. Audit repository dan **gunakan referensi desain asli project** terlebih dahulu. Jangan membuat mockup mandiri; ubah halaman sebenarnya. Tampilkan node/edges yang setia pada sistem ATMOS dan jelaskan keputusan engineering kunci. Jaga desain editorial, minim dekorasi, scroll-aware, responsive, accessible, dan efisien. Jangan modifikasi section lain kecuali integrasi minimal yang benar-benar diperlukan. Setelah selesai, laporkan file yang diubah, pola existing yang digunakan, interaksi yang dibuat, serta hasil pemeriksaan.

---

### Basis fakta

Spesifikasi arsitektur diambil dari `PRESENTASI-WRF-WEB.md` yang mendeskripsikan ATMOS/WRF-WEB 0.1.0, terutama bagian **Arsitektur sistem**, **Alur kerja operasional**, **Tech stack**, dan **Batas yang perlu disebut jujur**. Untuk detail implementasi akhir, Claude Code harus memverifikasi kode terbaru di repositori portofolio/ATMOS yang tersedia; jangan menebak perubahan sejak dokumen dibuat.
