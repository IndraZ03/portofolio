# Implementation Plan — SATRIA-3D OMC Portfolio

> **Target halaman:** `/project/satria-3d-omc` (**placeholder — wajib verifikasi route di repository**). Dokumen ini adalah brief untuk Claude Code/coding agent mengimplementasikan **section Key Features pada case study portofolio**, bukan proyek implementasi radar baru.

**Proyek:** SATRIA-3D OMC — analisis radar cuaca volumetrik tiga dimensi dan platform pendukung interpretasi meteorologis untuk Operasi Modifikasi Cuaca.

**Sumber informasi:** draf monograf SATRIA-3D OMC dan rincian fitur yang didiskusikan. Rancangan bukan bukti ketersediaan fitur di aplikasi; setiap kemampuan perlu status `Verified in code`, `Described in design`, atau `Planned`.

## Tujuan section: Key Features

Buat **editorial interactive feature showcase** yang menjawab **apa kemampuan SATRIA-3D OMC dan mengapa bermanfaat bagi analisis radar**. Jangan menyalin timeline proses dari How It Works, jangan mengulang layer dari System Architecture, dan jangan membuat grid kartu identik tanpa penjelasan.

**Arah copy:** *Explore the vertical structure and evolution of convective clouds—not just a flat radar image.*

## Feature narratives yang disarankan

| Feature | Copy singkat untuk UI | Visual fokus | Catatan validitas |
|---|---|---|---|
| **01 — 3D Radar Volume Explorer** | Eksplorasi distribusi reflektivitas dari beberapa elevasi dalam ruang tiga dimensi. | Volume voxel interaktif, kamera orbit, altitude slicing | Rendering aktual, kontrol kamera dan dataset harus diaudit |
| **02 — Radar-Derived Parameters** | Interpretasi struktur presipitasi melalui CMAX, Echo Top, Echo Base, Convective Core Top, dan keluaran lain yang tersedia. | Satu volume yang berganti mode menjadi CMAX/ETOP/EBAS | VIL/LWC merupakan **estimasi**; ambang/unit harus jelas |
| **03 — Vertical Profile & Cross-Section** | Lihat bagaimana reflektivitas berubah terhadap ketinggian pada titik atau lintasan tertentu. | Point selection → profil ketinggian vs dBZ dan penampang A–B | `Raycaster`, profil, VCS harus dicek satu per satu |
| **04 — Convective Cell Tracking** | Ikuti perubahan lokasi, intensitas, Echo Top, dan VIL sel antarvolume. | Enam snapshot T₀–T₅, lintasan centroid, tren | Label *SCIT-inspired* jika implementasi tidak sama dengan SCIT asli |
| **05 — Meteorological Context for OMC** | Gabungkan struktur vertikal radar dengan informasi atmosfer pendukung untuk membantu karakterisasi target. | Radar + garis isoterm 0°C + metadata sounding (kondisional) | Tidak mengklaim rekomendasi penyemaian otomatis/efektivitas hujan |
| **06 — Scientific Visualization Performance** | Representasi banyak voxel memanfaatkan pendekatan Three.js/WebGL, termasuk instanced rendering bila tersedia. | Diagram satu mesh → banyak instance, atau video screenshot terverifikasi | Target 20.000 objek/60 FPS **bukan** metrik hasil tanpa pengujian |
| **07 — Analysis Session Capture** | Fitur perekaman kanvas/tampilan bila terbukti ada memungkinkan dokumentasi sesi analisis. | Pemisahan Canvas Capture dan Screen Capture | Dukungan browser, permission, dan codec bersifat kondisional |

**Prioritas UI:** tampilkan **4–5 fitur yang paling terverifikasi dan paling kuat secara visual** di bagian utama. Fitur berstatus `Planned` ditampilkan jelas di bagian *Roadmap/Exploration* atau tidak ditampilkan sama sekali. Jangan memaksakan tujuh feature sebagai tujuh capability produksi.

## Struktur copy editorial yang disarankan

**Title:** `Beyond 2D radar. Into the structure of storms.`

**Subtitle:** `SATRIA-3D OMC brings volumetric radar visualization, vertical analysis, and convective-cell context into a unified meteorological workspace.`

**Copy pendek yang aman:**
> Sebuah konsep dan implementasi platform analisis radar cuaca tiga dimensi yang dirancang untuk memperlihatkan struktur vertikal presipitasi, menghubungkan parameter meteorologis turunan, dan membantu pengamatan perkembangan sel konvektif. Tingkat implementasi masing-masing fitur ditampilkan sesuai bukti pengembangan.

Pakai bahasa halaman portofolio existing. Jika situs berbahasa Inggris, terjemahkan seluruh narasi; jangan campurkan label Indonesia dan Inggris secara acak.

## Komposisi desain dan interaksi

- Desktop: **dua kolom editorial**. Rail kiri berisi urutan fitur bernomor (01–05 atau sesuai fitur yang valid); panel kanan menampilkan visual besar yang terkait fitur aktif.
- Fokus perpindahan fitur mengikuti scroll posisi chapter, atau klik judul bila komponen serupa sudah ada di situs. Tidak perlu hover untuk mengakses konten.
- Gunakan detail berbeda bagi tiap fitur:
  - 3D Volume: rotasi ringan atau screenshot sistem.
  - Derived Parameters: comparative split **CMAX 2D vs 3D volume**, bukan klaim teknologi lebih akurat tanpa data.
  - Profile: grafik dBZ–tinggi dengan titik dipilih.
  - Tracking: enam frame T₀–T₅ dan lintasan centroid sintetis berlabel.
  - OMC Context: lapisan informasi radar vs termodinamika yang berbeda sumber.
  - Performance: diagram *instancing*, bukan FPS counter palsu.
  - Recorder: ikon API/cakupan tangkapan, bukan file video nyata tanpa bukti.
- Pertahankan skala warna reflektivitas konsisten dan beri legenda unit; data sintetis wajib berlabel **Ilustrasi konseptual**.
- Animasi hanya untuk perubahan fokus, crossfade (sekitar 150–300 ms sesuai token existing), dan transform sederhana. Tidak ada hero effect yang menutupi data atau menggeser grafik secara palsu.
- Mobile: fitur menjadi bab berurutan, dengan ilustrasi tepat setelah teks dan interaksi tap opsional; tidak ada sticky 3D canvas yang menghabiskan viewport.
- Penuhi kontrast minimum, focus-visible, keyboard, alt/deskripsi gambar, dan `prefers-reduced-motion`.

## Perbedaan fitur dan status teknis yang harus dijaga

| Komponen | Pernyataan yang boleh ditulis | Jangan klaim tanpa bukti |
|---|---|---|
| **Radar 3D** | Visualisasi volumetrik, jika ditunjukkan oleh aplikasi | Akurasi voxel sama dengan resolusi radar di semua jarak |
| **CMAX / ETOP / EBAS** | Produk geometri dan reflektivitas berbasis ambang | Batas gema identik dengan batas fisik seluruh awan |
| **VIL / VILD / LWC** | Estimasi berbasis reflektivitas dan asumsi mikrofisika | Pengukuran langsung seluruh air cair di awan |
| **Freezing level / WCD** | Informasi termodinamika tambahan jika ada | Diukur langsung oleh C-band Doppler reflectivity |
| **Updraft / convergence** | *Proxy/indikator* jika rumus dan data mendukung | Kecepatan updraft / divergensi angin 3D terukur |
| **SCIT** | Identifikasi/pelacakan sel sesuai algoritma aktual | SCIT multithreshold lengkap atau nowcast valid tanpa uji |
| **Perfomance / recorder** | Instancing, media capture jika benar ada | Stabil 60 FPS, bitrate pasti, semua browser kompatibel |
| **OMC** | Mendukung karakterisasi dan interpretasi | Memastikan target layak semai atau menambah curah hujan |

## Konsep panel visual

Panel visual tidak harus menjalankan seluruh aplikasi SATRIA. Prioritaskan **screenshot nyata**, klip pendek yang memang berasal dari software, atau ilustrasi 2D/3D minimal yang tidak salah secara ilmiah.

**Contoh visual per fitur:**

1. **Panel A:** radar volume semi-transparan dengan lapisan ketinggian.
2. **Panel B:** diagram kolom reflektivitas disertai posisi Echo Top dan CMAX.
3. **Panel C:** penampang vertikal A–B dan profil reflektivitas pada satu lokasi.
4. **Panel D:** posisi centroid T₀–T₅, grafik VIL dan ETOP diberi label data ilustratif jika tidak faktual.
5. **Panel E:** dua sumber input: reflektivitas radar vs data suhu eksternal.
6. **Panel F:** instanced mesh vs banyak objek grafis (tanpa nilai benchmark yang dibuat-buat).

Bila pengguna melakukan interaksi pada visual, berikan feedback (selection/focus) dan teks yang menjelaskan apa yang dipilih. Jangan membuat tombol yang hanya mengubah animasi tetapi tampak seperti analisis radar sungguhan.

## Saran data model UI

```ts
type Feature = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  visualId: string;
  evidence: 'verified-in-code' | 'described-in-design' | 'planned';
  verificationNote?: string;
};
```

*Contoh bentuk data untuk repository TypeScript; gunakan JavaScript atau bentuk yang setara jika repository existing bukan TS.*

## Fase eksekusi

1. Temukan route, section Key Features reference, typography, assets, theme, dan komponen animasi existing.
2. Audit kode/rekaman aplikasi SATRIA untuk menentukan **empat atau lima fitur utama yang terbukti ada**. Jika tidak ada kode, label section sebagai studi desain/prototipe.
3. Kumpulkan screenshot per fitur, metadata non-sensitif, dan penjelasan algoritma yang dapat didukung.
4. Implementasikan index fitur dan satu visual yang berubah sesuai active feature, dengan data konten terpisah.
5. Tambahkan fallback gambar statis serta penanganan gambar/video gagal dimuat.
6. QA layout, keyboard, mobile, reduced motion, navigasi anchor, dan screenshot review.

## Acceptance khusus

- Pengunjung dapat membedakan **volume 3D, parameter meteorologis, profil vertikal, dan cell tracking** tanpa membaca arsitektur.
- Setiap fitur punya manfaat analitis yang **spesifik**, bukan copy seperti “advanced/innovative”.
- Fitur dan metrik belum tervalidasi tidak diberi angka atau badge seolah sudah berfungsi.
- Keluaran mikrofisika, termodinamika, dan proksi dinamika tidak disamakan dengan pengamatan radar langsung.
- UI terasa seperti portofolio produk ilmiah, bukan dashboard palsu atau leaflet marketing.

## Aturan wajib sebelum coding

1. Audit route serta referensi visual portofolio; jangan membuat halaman atau theme baru tanpa dasar.
2. Audit bukti fitur SATRIA: screenshot/rekaman, endpoint, modul, dan dokumentasi teknik yang benar.
3. Prioritaskan gambar asli dan SVG editorial; jangan mengarang citra radar operasional.
4. Bedakan *design target* dari pengujian, terutama 60 FPS, 20.000 voxel, dan respons pemrosesan.
5. Jangan mengklaim otomatisasi penyemaian, rekomendasi flight path, hasil peningkatan hujan, atau parameter cuaca yang tidak diukur.
6. Gunakan pustaka yang sudah ada; hindari library khusus grafik/animasi tanpa kebutuhan.
7. Semantic controls, keyboard, pointer, alt text, reduced-motion, dan responsive layout wajib ada.
8. Jangan membocorkan data radar restricted, konfigurasi internal, atau path storage pribadi.
9. Perubahan difokuskan pada project page SATRIA; jangan menimpa global tokens atau section lainnya.

## Definition of done

- Section Key Features berada di route SATRIA-3D OMC dan menggunakan estetika situs existing.
- Fitur ditampilkan sebagai editorial story dengan visual berbeda dan status bukti jelas.
- Semua ilustrasi bernilai ilmiah, memiliki satuan bila menampilkan angka, serta tidak menyamarkan contoh sintetis.
- Build/lint/test dan review desktop-mobile telah dijalankan.
- Perubahan file, bukti fitur, dan keterbatasan implementasi disampaikan secara ringkas.
