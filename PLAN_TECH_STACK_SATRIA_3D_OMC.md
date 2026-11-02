# Implementation Plan — SATRIA-3D OMC Portfolio

> **Target halaman:** `/project/satria-3d-omc` (**placeholder, verifikasi route aktual**). Ini adalah brief untuk Claude Code/coding agent mengimplementasikan **section Tech Stack pada case study portofolio**, bukan panduan instalasi seluruh SATRIA-3D OMC.

**Proyek:** SATRIA-3D OMC — pengolahan radar cuaca volumetrik 3D dan visualisasi meteorologis interaktif.

**Landasan:** naskah rancangan menyebut Python, `ThreadingHTTPServer`, HTML, CSS, JavaScript, Three.js/WebGL, HTTP API, GeoJSON, serta Web API untuk perekaman. Versi teknologi, dependensi ilmiah, sistem operasi, bundler, pipeline build, dan deployment **belum dapat diverifikasi dari berkas referensi maupun diskusi monograf**.

## Tujuan section: Tech Stack

Buat **editorial technology index**, bukan grid logo besar. Jelaskan **pilihan teknologi dan perannya** dalam SATRIA-3D OMC. Bedakan stack aplikasi radar yang dijelaskan di naskah dari stack website portofolio yang akan menjalankan section ini.

**Headline usulan:** `Built on scientific processing and browser-native 3D.`

**Subtitle:** `Python-based data services connect volumetric radar analysis with an interactive WebGL visualization workspace.`

## Teknologi inti yang disebut dalam rancangan SATRIA-3D OMC

| Kelompok | Teknologi/standar | Peran yang boleh dijelaskan | Bukti yang diperlukan |
|---|---|---|---|
| **Backend Runtime** | **Python** | Mengelola logika pembacaan/penyajian data radar dan layanan analisis sesuai implementasi | Versi runtime, modul sumber, dependensi |
| **HTTP Service** | **`http.server.ThreadingHTTPServer`** | Menangani koneksi dan permintaan HTTP dengan thread | `server.py`, rute aktual, pola pembaruan data |
| **Data Interface** | **HTTP / JSON** | Pertukaran metadata, parameter, dan volume/hasil turunan dengan browser | Daftar endpoint dan bentuk respons |
| **Frontend Structure** | **HTML5** | Struktur dashboard dan panel analisis | `index.html` atau komponen view sebenarnya |
| **Frontend Styling** | **CSS** | Tema, layout full-viewport, HUD, responsivitas | Stylesheet/komponen CSS aktual |
| **Frontend Logic** | **JavaScript** | Permintaan data, state UI, event handling, interaksi browser | Kode frontend yang dipakai |
| **3D Visualization** | **Three.js** | Scene graph, kamera, geometri voxel, instancing/raycasting bila ada | Versi Three.js, import, screenshot |
| **Graphics API** | **WebGL** | Rendering grafis 3D pada browser melalui renderer | Kode WebGLRenderer, device/browser support |
| **Geospatial Overlay** | **GeoJSON** | Format batas administrasi/area geografis | Sumber data dan projection/CRS |
| **Capture API** | **Canvas Capture / `captureStream()`** | Menghasilkan media stream dari kanvas visualisasi jika diimplementasikan | Kode UI recorder dan browser testing |
| **Screen Capture API** | **`getDisplayMedia()`** | Meminta sumber tangkapan layar/tab yang dipilih pengguna | Permission handling dan fallback |
| **Recording API** | **`MediaRecorder`** | Merekam media stream dalam format yang didukung browser | Dukungan codec, hasil uji rekaman |

**Catatan penting:** penulisan `Python + ThreadingHTTPServer` sebagai stack yang disebut dokumen **tidak berarti seluruh backend memakai Python standard library**. Jika komputasi radar memakai pustaka eksternal, tampilkan setelah import/requirements diverifikasi. WebGL/Three.js adalah komponen browser; jangan menyebutnya dependency Python.

## Kandidat library/teknologi yang tidak boleh ditampilkan sebagai implemented tanpa bukti

- **NumPy / SciPy / xarray / pandas:** mungkin relevan secara umum untuk komputasi ilmiah, tetapi belum boleh diklaim dipakai SATRIA tanpa kode.
- **Py-ART / wradlib:** muncul sebagai **rujukan akademis/pembanding**, bukan otomatis dependency runtime.
- **FastAPI / Flask / Django:** jangan ganti `ThreadingHTTPServer` dengan framework umum karena itu akan menyesatkan deskripsi proyek.
- **React / Vue / Next.js / TypeScript / Vite:** bisa jadi teknologi situs portofolio, tetapi bukan teknologi aplikasi SATRIA kecuali kode membuktikannya.
- **PostgreSQL / Redis / Qdrant / Docker / Kubernetes / cloud:** jangan tampilkan berdasarkan asumsi best practice.
- **WebGPU:** tidak sama dengan WebGL; jangan cantumkan jika belum ada implementasi.
- **AI/LLM untuk rekomendasi semai:** tidak ada bukti dari spesifikasi SATRIA yang dibahas.
- **SCIT / TITAN:** nama algoritma ilmiah, bukan *software stack* atau vendor library yang otomatis digunakan.
- **EEC DWSR-2501C dan file `.vol`:** perangkat/sumber data dan format yang masih perlu validasi; bukan runtime stack.

## Konten editorial per kelompok

### 01 — Scientific Backend

**Nama besar:** `Python`  
**Role:** *Radar processing and data-service logic.*  
**Narasi:** Python digunakan dalam rancangan untuk pembacaan/pengelolaan data radar, komputasi ilmiah, serta penyediaan layanan ke browser. Implementasi fungsi meteorologi dan pustaka numerik harus dibuktikan dari kode.  
**Visual:** diagram blok kecil Volume → Compute → Results, tidak memakai logo yang tidak jelas lisensinya.  
**Bukti:** entry point, versi Python, imports, output unit tests bila ada.

### 02 — HTTP Data Layer

**Nama besar:** `ThreadingHTTPServer`  
**Role:** *Lightweight HTTP data distribution.*  
**Narasi:** HTTP service menghubungkan hasil analisis radar dengan permintaan frontend. `ThreadingHTTPServer` menangani request menggunakan thread tetapi tidak otomatis menjadikan komputasi numerik paralel atau server aman untuk jaringan publik.  
**Visual:** request browser ⇄ Python server; response data terstruktur.  
**Bukti:** endpoint dan request/response contoh yang disanitasi.

### 03 — Interactive 3D Graphics

**Nama besar:** `Three.js + WebGL`  
**Role:** *In-browser visualization of radar volume and 3D interaction.*  
**Narasi:** Mengelola scene, kamera, objek voxel, palet nilai, dan—jika benar digunakan—`InstancedMesh` serta `Raycaster`. Pilihan teknologi ini terkait rendering, bukan pengukuran atau validasi mikrofisika awan.  
**Visual:** beberapa voxel dan scene axes sederhana; legend reflektivitas.  
**Bukti:** script imports, instancing path, profiler screenshot.

### 04 — Web Interface

**Nama besar:** `HTML / CSS / JavaScript`  
**Role:** *Dashboard layout and scientific interaction.*  
**Narasi:** HTML mendefinisikan struktur panel dan kontrol, CSS mengatur visual, JavaScript menghubungkan data, UI state, dan visualisasi. Hindari mengatakan framework tertentu sebelum ada bukti.  
**Visual:** lapisan layout HUD → kontrol → kanvas 3D.  
**Bukti:** file `public/index.html`, stylesheet, scripts aktual.

### 05 — Data Exchange & Geo Context

**Nama besar:** `HTTP / JSON / GeoJSON`  
**Role:** *Structured meteorological data and geographic reference.*  
**Narasi:** JSON mengangkut data yang dapat dibaca browser; GeoJSON dipakai untuk batas wilayah pada rancangan. Kontrak akhir perlu menyebut unit, CRS, timestamp, mask validitas, dan status data.  
**Visual:** data object minimal (field berlabel, tanpa payload palsu).  
**Bukti:** contoh respons, format sample, transform koordinat.

### 06 — Optional Recording

**Nama besar:** `Canvas Capture + Screen Capture + MediaRecorder`  
**Role:** *Browser-based recording, subject to actual support.*  
**Narasi:** Mode kanvas dapat menangkap frame WebGL, mode display capture bergantung izin pengguna; rekaman dikelola API browser. Framerate/bitrate yang diminta bukan jaminan hasil.  
**Visual:** dua sumber → MediaRecorder → file, label **if implemented**.  
**Bukti:** UI recorder dan hasil lintas browser; API permission handling.

## Keputusan rekayasa dan trade-off

| Keputusan | Alasan yang dapat dijelaskan | Trade-off yang harus disampaikan |
|---|---|---|
| **Python untuk scientific processing** | Ekosistem komputasi serta kemudahan integrasi pemrosesan data | Performa CPU/memori bergantung implementasi; dependency ilmiah masih perlu audit |
| **ThreadingHTTPServer** | Server ringan berbasis pustaka standar Python | Tidak disiapkan secara bawaan untuk keamanan deployment publik/fitur web framework lengkap |
| **Web-based visualization** | Akses analisis melalui browser dengan kontrol interaktif | Dukungan driver, GPU, dan browser bervariasi |
| **Three.js instancing** | Mengurangi draw call untuk geometri seragam | Transparansi, jumlah objek, buffer update, dan device masih membatasi FPS |
| **JSON/HTTP** | Sederhana untuk pertukaran metadata dan data terstruktur | Payload besar dapat meningkatkan transfer/parsing; format hasil harus diverifikasi |
| **Data analitis vs data rendering** | Menjaga parameter meteorologis independen dari simplifikasi grafis | Memerlukan struktur/pipeline data yang jelas |
| **Dukungan data termodinamika opsional** | Freezing level tidak berasal dari reflectivity tunggal | Ketersediaan dan akurasi data eksternal menjadi dependency ilmiah |

Jangan menulis alasan pemilihan sebagai **keputusan pengembang yang sudah terdokumentasi** jika alasan itu hanya inferensi desain umum. Jika tidak ada catatan desain, gunakan “pertimbangan teknis” atau “implikasi”.

## Struktur visual section

- Gunakan **indeks vertikal bernomor** dengan tipografi nama teknologi sebagai fokus dan deskripsi satu kalimat.
- Desktop dapat memakai panel detail di samping indeks. Panel hanya berubah saat user memilih item atau mengikuti scroll jika perilaku seperti itu sudah digunakan di situs.
- Kelompokkan teknologi agar tidak menjadi daftar 12 logo serupa:
  1. **Scientific Backend** — Python + HTTP server.
  2. **Frontend & Visualization** — HTML/CSS/JS + Three.js + WebGL.
  3. **Interfaces & Geo Data** — HTTP/JSON/GeoJSON.
  4. **Media Capabilities (conditional)** — capture/recording.
- Pilih satu pola interaksi dari situs existing: index + detail pane, accordions, atau sticky rail. Jangan gabungkan semuanya.
- Paling baik pakai **wordmark tipografis**, bukan logo vendor acak dari CDN.
- Pertahankan minimal aesthetic, garis pembatas tipis, icon kecil bila perlu, palet sesuai theme existing, tanpa neon/glow/3D sphere/marquee.
- Mobile: indeks menjadi stack/accordion ringan, semua deskripsi tersedia tanpa hover.
- Panel setiap teknologi memuat `What it does`, `Why it matters`, `Limitations`, `Verification`.
- Semua event keyboard-accessible dan mendukung `prefers-reduced-motion`.

## Data model yang dapat digunakan (adaptasi dari contoh)

```ts
type StackItem = {
  id: string;
  name: string;
  category: 'backend' | 'http' | 'frontend' | 'graphics' | 'data' | 'media';
  summary: string;
  usageDetail: string;
  limitation?: string;
  verification: 'verified-in-code' | 'described-in-design' | 'requires-verification';
};
```

Bentuk ini hanyalah contoh untuk codebase TypeScript; jika situs memakai JavaScript biasa, adaptasikan tanpa menambahkan tooling yang tidak diperlukan.

## Fase implementasi

1. Audit route dan pola visual Tech Stack dari project portofolio yang sudah ada.
2. Audit source SATRIA: Python imports/versi, `server.py`, `public/index.html`, stylesheet, script Three.js, pemakaian Web APIs, dan format data.
3. Buat daftar teknologi berdasarkan bukti: **confirmed**, **named in design**, atau **not shown**. Jangan tampilkan kandidat umum sebagai implemented.
4. Susun konten teknologi sebagai data terstruktur. Kaitkan setiap item dengan peran aktual dan catatan verifikasi.
5. Implementasikan indeks editorial dengan detail per kelompok, interaksi keyboard, fallback tanpa JS yang bermakna.
6. Uji responsivitas, scroll/focus, reduced-motion, kontras, build/lint/test, dan screenshot review.

## Acceptance khusus

- Pengunjung memahami perbedaan **Python backend, HTTP data layer, Three.js visualization, dan browser capture**.
- Tidak ada framework atau database tambahan yang diklaim sebagai stack SATRIA tanpa bukti.
- Fitur recorder diberi status kondisional bila kode/rekaman belum dibuktikan.
- Tidak ada klaim *no-dependency system* jika frontend atau scientific modules memerlukan library eksternal.
- Bagian teknologi tidak berubah menjadi diagram arsitektur kedua.

## Aturan wajib sebelum coding

1. Verifikasi halaman dan framework **portofolio** sebelum membuat komponen. Framework situs tidak boleh otomatis dicatat sebagai stack **SATRIA**.
2. Verifikasi library dan versi runtime dari kode SATRIA; hindari menampilkan versi berdasarkan perkiraan.
3. Jangan menambah kredensial, endpoint privat, dataset radar terbatas, atau informasi lokasi infrastruktur yang sensitif.
4. Jangan menyebut Py-ART/wradlib sebagai library runtime tanpa import/requirements aktual; itu adalah referensi ilmiah yang mungkin dipakai sebagai pembanding.
5. Jangan menyimpulkan penggunaan AWS/Docker/React/NumPy atau cloud dari kebiasaan proyek sejenis.
6. Reuse components, theme, type scale, motion tokens, dan package yang sudah ada.
7. Penuhi semantic controls, focus-visible, reduced motion, mouse/touch/keyboard, dan layout 320–390 px.
8. Jangan tampilkan logo berlisensi dari sumber tidak jelas atau data benchmark yang dibuat-buat.

## Definition of done

- Tech Stack SATRIA-3D OMC berbentuk indeks teknologi editorial yang sesuai gaya portofolio.
- Setiap teknologi punya peran dan keterbatasan yang dapat dipertanggungjawabkan.
- Perbedaan sumber rancangan dan bukti implementasi tersampaikan.
- Build/lint/test yang tersedia dijalankan dan hasilnya dilaporkan; tidak ada regresi di halaman lain.
- File perubahan dan hal yang belum diverifikasi dicatat untuk proses review.
