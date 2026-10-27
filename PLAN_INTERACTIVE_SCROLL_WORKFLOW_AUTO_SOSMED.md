# IMPLEMENTATION PLAN — AUTO-SOSMED / HOW IT WORKS (SCROLL-DRIVEN)

> **Untuk Claude Code — implementasi pada website portofolio yang SUDAH ADA.**
> Dokumen ini adalah instruksi implementasi, **bukan** permintaan membuat website baru, redesign global, atau presentasi PPT.
> Prinsip utama: **inspect first, reuse existing design system, implement second**.

## 0. Perintah utama

Tambahkan / sempurnakan **section "How It Works"** pada **halaman detail proyek Auto-Sosmed** di website portofolio saya. Buat workflow **vertikal dari atas ke bawah**, hidup secara halus seiring pengguna scroll. Pada setiap tahap, garis konektor terisi/bergerak, node aktif secara progresif, konten tahap memperoleh fokus, dan visual pendamping menampilkan keadaan proses yang relevan.

**PENTING:** Project saya sudah memiliki referensi komponen/animasi scroll dan theme sendiri. Sebelum menulis atau menginstal apa pun, **temukan dan pelajari** implementasi referensi itu di repository. Gunakan bahasa visual, token desain, pola layout, easing, spacing, typography, breakpoints, dan pendekatan animasi yang **sudah ada**. Jangan mengganti theme, jangan membuat desain generik "AI slop", jangan memasang efek glow/gradient/glassmorphism yang tidak sesuai dengan project.

## 1. Fase 0 — Audit repository (WAJIB SEBELUM CODING)

1. Pelajari struktur proyek dan temukan halaman detail proyek, route Auto-Sosmed, komponen section, dan data project.
2. Cari komponen scroll-driven/progress/stepper/timeline/sticky/reveal yang sudah ada (termasuk hook/utilitas animasi). Cari dependensi yang sudah terpasang dan konvensi penggunaannya.
3. Identifikasi sumber theme sebenarnya: CSS variables, utility classes, konfigurasi Tailwind (jika ada), tipografi, radius, warna border, background, text, accent, serta motion tokens.
4. Pelajari pola aksesibilitas, responsive, serta pengaturan `prefers-reduced-motion` di project.
5. Periksa apakah stack proyek Svelte/SvelteKit atau framework lain; **ikuti framework yang ditemukan**. Jangan menganggap framework portofolio sama dengan teknologi Auto-Sosmed. **Next.js adalah stack produk Auto-Sosmed, bukan otomatis stack website portofolio.**
6. Lihat komponen visual dan scroll interaction paling dekat sebagai **source of truth**. Ekstensi atau refactor seminimal mungkin; jangan duplikasi library/mekanisme animasi.
7. Beri ringkasan audit singkat di output Claude Code: rute/berkas referensi ditemukan, teknologi animasi yang dipilih, token theme yang akan digunakan, dan alasan pilihan. Jika referensi ambigu, pakai referensi yang paling dekat dengan section detail proyek, tanpa mengubah bagian lain.

**Larangan:** Jangan membuat theme baru, jangan menyusun ulang homepage, jangan mengganti font, jangan menambahkan dependency besar sebelum mengecek alternatif yang sudah ada.

## 2. Tujuan pengalaman pengguna

- Workflow **menyatu secara natural dalam alur baca** halaman detail proyek, tidak mengunci scroll secara agresif.
- Saat pengunjung masuk section, terlihat judul singkat, keterangan satu paragraf, dan **jalur vertikal** yang jelas.
- Scroll ke bawah membuat alur seperti **energi/informasi bergerak dari node pertama menuju node berikutnya**. Hindari animasi terus-menerus tanpa konteks scroll.
- Step yang aktif terlihat lebih jelas daripada yang belum aktif melalui kombinasi **kontras, border, posisi, progress line, dan perubahan konten**. Bukan dengan neon/glow.
- Scroll kembali ke atas harus **membalik progress** secara akurat, bukan hanya animasi sekali lalu menghilang.
- Di desktop, layout boleh memakai **timeline kiri + panel ilustrasi yang sticky di kanan** bila konsisten dengan referensi proyek. Di mobile, gunakan **timeline satu kolom** dan panel ringkas inline atau statis; **tidak ada horizontal overflow**.
- Akhir workflow terasa tuntas dan menyambung mulus ke section berikutnya.

## 3. Isi workflow — berdasarkan implementasi Auto-Sosmed

Workflow dipadatkan menjadi **enam tahap naratif** agar mudah dipahami pengunjung portofolio. Ini bukan penyederhanaan yang mengubah logika: tampilkan bahwa konten yang masuk **tidak otomatis pasti terbit**.

| No | Tahap | Judul UI (boleh sesuaikan bahasa existing site) | Keterangan ringkas | Detail visual yang berubah |
|---|---|---|---|---|
| 01 | Content Intake | **Content Arrives** | Konten masuk dari lampiran email IMAP atau folder lokal yang disinkronkan Google Drive Desktop. | Dua sumber mengarah ke satu input; label `IMAP` / `Drive Desktop` |
| 02 | Matching | **Rules & Validation** | Worker mencocokkan subject, nama file, format media, dan aturan saluran. Media yang tidak cocok dilewati. | Filter/checkpoint; cabang kecil `Matched` / `Skipped` |
| 03 | Event Creation | **Create Publication Event** | Media yang memenuhi aturan disalin ke storage dan dibuatkan event dalam database dengan waktu publikasi. | Media → storage; event baru `SCHEDULED` |
| 04 | Scheduling | **Wait for the Right Time** | Event menunggu jadwal; scheduler memilih event yang memenuhi aturan, slot harian, dan status saluran. | Timeline/jam minimalis; status `SCHEDULED` → `PROCESSING` |
| 05 | Publishing | **Publish to Instagram** | Worker mempersiapkan media dan mempublikasikannya melalui provider; jalur utama yang dipilih wizard baru memakai Meta Graph API. | Proses `PROCESSING` → `UPLOADING` → platform |
| 06 | Feedback | **Track the Outcome** | Hasil tercatat sebagai `PUBLISHED` atau `FAILED`, dilengkapi log dan notifikasi WhatsApp melalui GREEN-API. | Dua kemungkinan hasil, log audit, ikon notifikasi |

### Akurasi narasi — wajib dipatuhi

- **Google Drive Desktop** melakukan sync cloud ke folder lokal. Worker aplikasi memeriksa **folder lokal**, bukan otomatis membaca Google Drive cloud API secara langsung.
- Media harus lolos filter dan aturan penjadwalan. Event dapat dibatalkan/tersisih/gagal, jadi **jangan buat klaim semua konten pasti tayang**.
- `PUBLISHED` adalah status aplikasi. Pada jalur provider INTERNAL, status ini belum selalu berarti sudah tayang di platform; hindari klaim verifikasi tayang universal.
- Notifikasi WhatsApp adalah integrasi hasil proses, **bukan sumber kebenaran tunggal** untuk keberhasilan posting.
- Threads belum boleh digambarkan sebagai alur publikasi otomatis yang selesai end-to-end.
- Jangan tampilkan KPI, persentase sukses, durasi, atau penghematan waktu yang belum diukur.

## 4. Konsep visual — editorial, bukan AI slop

### Struktur section

```text
[small section index / eyebrow — ikuti project]
How It Works
Short supporting description

DESKTOP (bila cocok dengan pola existing)
┌─────────────────────────────────┬──────────────────────────────────┐
│ Vertical step timeline          │ Sticky contextual visualization │
│ ● 01  Content Arrives           │  Context of currently active   │
│ │                               │  step. Minimal illustration,    │
│ ● 02  Rules & Validation        │  not a flashy dashboard clone.  │
│ │                               │                                  │
│ ● 03  Create Event              │                                  │
│ │                               │                                  │
│ ● 04  Wait for Schedule         │                                  │
│ │                               │                                  │
│ ● 05  Publish to Instagram      │                                  │
│ │                               │                                  │
│ ● 06  Track the Outcome         │                                  │
└─────────────────────────────────┴──────────────────────────────────┘

MOBILE
[heading]
● Step 01 + brief context visual
│
● Step 02 + brief context visual
│
...
● Step 06 + summary
```

- Utamakan **tipografi dan ruang kosong**; bukan enam kartu besar warna-warni.
- Timeline: satu jalur vertikal tipis, node sederhana, nomor/tahap kecil, heading jelas, body text singkat.
- Gunakan border/foreground/accent yang sudah dipakai di theme; **jangan hard-code warna** jika token sudah tersedia.
- Ikon boleh memakai library icon existing. Jangan mencampur beberapa gaya ikon.
- Visual panel berupa skematik kecil yang merespons setiap step (source → filter → event → clock → publish → log); tampil sederhana dan konsisten.
- Boleh memanfaatkan data real screenshot hanya **jika memang ada asset relevan di repository**. Jangan mengarang screenshot UI atau berpura-pura ada data real.
- Hindari: glowing orbs, gradient ungu-biru generik, blur berat, floating particles, glass cards berlapis, parallax ekstrim, 3D tanpa fungsi, animasi looping ramai.

## 5. Perilaku scroll — spesifikasi interaksi

### 5.1 Progress berbasis posisi viewport

- Hitung progress section yang stabil dari posisi elemen terhadap viewport, **clamped 0…1**, dengan onset/offset mengikuti pola scroll di codebase.
- Progress ditransformasikan menjadi **tinggi garis terisi** dari node pertama ke node terakhir; visualnya bergerak **atas → bawah** secara kontinu saat scroll turun dan mundur saat scroll naik.
- Pastikan perhitungan line memakai posisi node yang sesungguhnya; jika tinggi teks berbeda dan layout responsif berubah, progress **tidak boleh meleset**.
- Saat progress mencapai node tertentu, ubah `activeStep` sesuai posisi scroll. Node yang dilewati dianggap completed, node aktif diberi emphasis, node mendatang low emphasis.
- Satu active step pada satu waktu; jangan flicker saat berada dekat boundary. Gunakan threshold/hysteresis seperlunya.
- Saat pengguna scroll cepat / melompat ke anchor, state harus langsung benar (tanpa replay panjang dari langkah 1).
- Jangan memakai interval/timer untuk menirukan progress yang sebenarnya dikendalikan scroll.

### 5.2 Visual state step

- `upcoming`: nomor dan deskripsi lebih tenang, garis belum terisi.
- `active`: kontras optimal; visual panel mengubah fokus pada tahap ini dengan animasi singkat yang lembut.
- `completed`: node/line menunjukkan telah dilalui, tetap terbaca namun tidak mendominasi.
- Transisi halus pada opacity/transform/border; cukup jarak kecil, bukan slide dramatis dari luar layar.
- Kartu/panel sticky **tidak perlu** mengalami animasi masuk setiap beberapa piksel scroll; update hanya saat active step berubah.

### 5.3 Pinned/sticky behavior

- Jika project sudah punya sticky scroll-story reference, gunakan teknik yang sama.
- Desktop: panel sticky boleh memiliki `top` yang memperhitungkan sticky navbar dan ruang aman.
- **Jangan gunakan `position: fixed` + manual scroll lock**, kecuali pola existing secara eksplisit mensyaratkannya dan terbukti bebas masalah.
- Lepaskan panel secara natural pada akhir section. Jangan tertahan menutupi footer/section berikutnya.
- Tidak membuat timeline menjadi sangat tinggi hanya demi efek visual; durasi scroll harus proporsional terhadap enam step.

### 5.4 Responsif

- Desktop: dua kolom bila tersedia ruang cukup.
- Tablet: kurangi lebar ilustrasi, hindari heading/wrapping yang menggeser line.
- Mobile: timeline satu kolom; nonaktifkan sticky panel atau ubah menjadi ilustrasi inline, tanpa card overflow.
- Kode panjang/label step harus wrap normal dan tetap terbaca.
- Touch scroll native; jangan memasang listener yang memblokir gestur.

### 5.5 Reduced motion dan aksesibilitas

- Hormati `prefers-reduced-motion: reduce`: tidak ada transform/perpindahan yang tidak perlu; semua enam tahap harus tetap terlihat dan terbaca.
- Informasi tidak boleh bergantung pada warna/animasi saja: nomor, judul, status, dan deskripsi tetap eksplisit.
- Gunakan heading hierarchy dan semantic list (`ol/li`) atau struktur semantik setara.
- Visual dekoratif tidak mengganggu screen reader (`aria-hidden` bila semata dekorasi); jangan memberi `aria-live` yang terus membacakan state setiap scroll.
- Timeline dapat dibaca tanpa JavaScript: progresif enhancement, konten tidak hilang ketika animasi belum siap.
- Pastikan kontras sesuai theme.

## 6. Strategi implementasi — ringan dan efisien

**Prioritas:** re-use mekanisme animasi repo. Jika repo sudah memakai Motion/GSAP dan sudah ada scroll section serupa, boleh pakai yang sudah ada. Jika tidak, utamakan pendekatan native ringan.

### Alternatif native (jika sesuai stack)

- `IntersectionObserver` untuk menentukan step aktif berdasarkan area fokus viewport.
- `requestAnimationFrame` untuk update scroll progress tanpa set state/render seluruh tree setiap event `scroll`.
- CSS custom property (misalnya `--flow-progress`) untuk mengisi garis dengan `transform: scaleY(...)` dan `transform-origin: top`.
- `ResizeObserver` untuk recalibrate posisi node ketika font, container, breakpoint, atau konten berubah.
- `passive` scroll listener, cleanup listener/observer saat component unmount.
- Minimalkan updates di framework: mutable DOM style untuk continuous line progress; reactive state hanya saat **active step berubah**.
- `will-change` digunakan selektif dan dibersihkan jika tidak dibutuhkan; hindari layout thrashing dan mengukur elemen pada setiap frame jika pengukuran bisa di-cache.
- Jangan install GSAP/ScrollTrigger/Lenis hanya untuk section ini jika project belum menggunakannya.
- Jika project sudah menggunakan smooth-scrolling abstraction, integrasikan tanpa membuat sistem scroll kedua.

### Modularitas

Ikuti pola struktur file existing, misalnya:

```text
(project route / existing components)
  AutoSosmedHowItWorks.<framework-extension>
  workflowSteps.(ts/js)          # hanya jika data memang perlu dipisah
  (existing motion util)         # reuse, jangan copy paste implementasi baru
```

Nama file hanya **contoh**, bukan instruksi membuat direktori baru. Jangan mengubah framework atau menambah layer arsitektur yang tidak diperlukan.

## 7. Detail konten visual per step

1. **Content Arrives** — Dua label sumber, arah panah masuk yang sederhana. Hindari animasi email berterbangan.
2. **Rules & Validation** — Perlihatkan mini daftar aturan (subject / filename / media); highlight rule yang cocok. Cabang `Skipped` kecil dan netral.
3. **Create Publication Event** — Media disimpan dan satu record `SCHEDULED` muncul; jelas bahwa database menyimpan metadata, media ada di storage.
4. **Wait for the Right Time** — Jam/timeline minimal dengan satu jadwal, status berubah ketika syarat terpenuhi; jangan menjanjikan presisi detik.
5. **Publish to Instagram** — Alur persiapan media → worker → provider Meta → Instagram; jangan menampilkan UI Instagram palsu dengan angka engagement rekaan.
6. **Track the Outcome** — `PUBLISHED` dan `FAILED` sebagai **kemungkinan hasil**, bukan dua hasil yang terjadi bersamaan. Log dan WhatsApp sebagai output. Jika visual aktif menggambarkan sukses, tetap jelaskan bahwa kegagalan juga ditangani.

**Copywriting:** Ikuti bahasa yang sudah dipakai website portofolio. Jika project memakai bahasa Inggris, gunakan judul dan deskripsi ringkas bahasa Inggris. Jika berbahasa Indonesia, terjemahkan natural dan konsisten. Jangan campur bahasa tanpa alasan.

## 8. Integrasi dengan halaman project yang sudah ada

- Render section di titik alami setelah ringkasan solusi / sebelum atau setelah fitur utama, mengikuti urutan case study existing.
- Pertahankan spacing vertikal, lebar konten, navbar, section separators, dan footer yang sudah ada.
- Pastikan tidak bentrok dengan elemen sticky lain (header, navigasi project, floating buttons).
- Jangan mengganti atau menghapus konten project lain.
- Jangan mengubah routing, theme global, dependencies, atau konfigurasi build tanpa kebutuhan yang jelas.
- Gunakan data dari dokumen Auto-Sosmed sebagai sumber kebenaran workflow, **jangan menambah platform atau fitur yang belum aktif**.

## 9. Testing dan kriteria penerimaan (Definition of Done)

- [ ] Claude Code menemukan dan menyebut referensi scroll animation/theme existing sebelum implementasi.
- [ ] Section tampil di halaman detail Auto-Sosmed, bukan hanya demo component terpisah.
- [ ] Garis progress mengisi kontinu dari **atas ke bawah** saat scroll turun.
- [ ] Saat scroll naik progress mundur dan active step ikut benar.
- [ ] Semua enam step dapat terbaca dan berurutan tanpa interaksi.
- [ ] Visual panel berganti sesuai active step; tidak flicker saat batas transisi.
- [ ] Mode mobile/tablet/desktop tidak overflow dan tidak menutupi header/footer.
- [ ] Tidak memicu scroll hijack, scroll-jank, atau animasi yang mengganggu konten halaman lain.
- [ ] Reduced motion menampilkan informasi lengkap tanpa animasi berlebihan.
- [ ] Konten akurat terhadap workflow Auto-Sosmed; tidak mengklaim Google Drive API cloud native atau publikasi Threads end-to-end.
- [ ] Tidak ada asset/screenshot palsu, statistik buatan, atau gaya yang menyimpang dari theme.
- [ ] Tidak ada dependency tambahan jika existing stack telah mampu mengerjakannya.
- [ ] Jalankan build/lint/typecheck/test yang tersedia di repo; perbaiki error terkait perubahan.
- [ ] Bersihkan observer, animation frame, dan event listener saat unmount/navigation.

## 10. Output yang harus disampaikan Claude Code

Implementasikan kode secara langsung pada repository yang sedang dibuka, lalu laporkan secara singkat:

1. **Referensi existing yang diikuti:** nama file/komponen + sistem desain/animasi yang ditemukan.
2. **File yang dibuat/diubah** dan alasan perubahannya.
3. **Perilaku desktop dan mobile** beserta scroll/reduced-motion strategy.
4. **Hasil verifikasi:** lint/build/typecheck yang dijalankan dan hasilnya.
5. **Catatan keterbatasan** yang benar-benar tersisa, tanpa mengklaim tes yang belum dilakukan.

**Final quality bar:** terasa dirancang secara khusus untuk website portofolio ini, berkelas, understated, smooth, cepat, dan menunjukkan bagaimana pipeline Auto-Sosmed bekerja **tanpa** terlihat seperti template AI generik.
