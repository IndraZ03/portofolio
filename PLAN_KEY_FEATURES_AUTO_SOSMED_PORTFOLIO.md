# IMPLEMENTATION PLAN — AUTO-SOSMED / KEY FEATURES (PORTFOLIO CASE STUDY)

> **Untuk Claude Code — implementasi di website portofolio yang SUDAH ADA.**
> Ini adalah section **Key Features** untuk halaman detail proyek Auto-Sosmed, **bukan** deck PPT, bukan landing page SaaS baru, bukan redesign situs, dan bukan permintaan mengubah aplikasi Auto-Sosmed itu sendiri.
> Prinsip: **inspect existing project → reuse design system → implement precise storytelling**.

## 0. Instruksi utama

Implementasikan section **Key Features** yang terasa menyatu dengan theme dan identitas visual website portofolio saya saat ini. Section ini harus memperlihatkan kemampuan produk Auto-Sosmed melalui **showcase editorial interaktif**, bukan kumpulan enam kartu identik. Pengunjung harus bisa cepat memahami fitur, melihat detail masing-masing, dan merasakan transisi visual halus ketika scroll.

**PENTING:** di project saya sudah ada referensi desain dan interaksi. **Cari dan pelajari referensi tersebut di repository terlebih dahulu**, termasuk section `How It Works` yang sudah ada/direncanakan. Jangan menebak warna, font, komponen, framework, motion style, atau nama route. Jangan membuat theme baru dan jangan memperkenalkan visual “AI slop”.

## 1. Fase 0 — Audit project terlebih dahulu (wajib)

1. Identifikasi framework, router, halaman detail proyek Auto-Sosmed, struktur konten proyek, komponen yang sudah ada, dan pola responsifnya.
2. Temukan sistem theme sebenarnya: CSS variables, font, warna foreground/background/accent, dark/light mode, spacing, border, radius, dan motion/easing.
3. Cari section **How It Works** atau rencana implementasinya; pastikan Key Features punya hirarki yang konsisten, tetapi **tidak mengulangi animasi timeline** yang sama.
4. Cari referensi komponen visual untuk project showcase, sticky media, tab/switcher, accordion, scroll reveal, image composition, serta library ikon yang sudah digunakan.
5. Inventarisasi screenshot produk Auto-Sosmed yang **benar-benar tersedia** di repo (dashboard, channel wizard, event list, logs/debug, dan lain-lain); jangan mengarang screenshot. Jika aset tidak tersedia, sediakan slot placeholder visual yang netral dan diberi penanda yang jelas, tanpa membuat dashboard palsu yang diklaim sebagai screenshot aplikasi.
6. Periksa dukungan reduced motion, keyboard navigation, theme toggling, dan pengaturan responsive.
7. Ringkas hasil audit di output pekerjaan: file/komponen yang akan dipakai ulang, token design, aset, dan strategi interaksi.
8. Teknologi **Next.js di Auto-Sosmed** adalah teknologi **produk yang dipamerkan**, bukan asumsi framework website portofolio. Ikuti stack website portofolio yang ditemukan.

**Jangan** mengganti font, memasang design system baru, mengganti header/footer/global styles, atau menginstall library animasi besar sebelum memeriksa apakah project sudah punya solusinya.

## 2. Tujuan desain dan pengalaman

- Section ini terasa seperti bagian **engineering case study**, bukan katalog fitur marketing.
- Tunjukkan **apa yang dikerjakan tiap fitur dan bagaimana sistem menanganinya**, secara akurat dan ringkas.
- Pertahankan ritme baca sesudah **How It Works**: setelah paham alur keseluruhan, pengunjung dapat mengeksplorasi kapabilitas utama satu per satu.
- **Minimal interactivity with purpose**: animasi hanya membantu fokus, navigasi, dan transisi informasi. Tidak perlu efek pada semua elemen.
- Buat tampilan khas project sekarang: hindari template grid SaaS, bentuk pill berlebihan, glow, gradien mencolok, orb/particle, glassmorphism tanpa referensi, hover transform ekstrem, serta angka metrik yang dibuat-buat.
- Gunakan teks singkat pada layar, dan penjelasan lebih panjang hanya jika pola site mendukung progressive disclosure.

## 3. Enam fitur utama yang harus ditampilkan

Semua keterangan di bawah berlandaskan bahan `BAHAN-PPT-AUTO-SOSMED.md`. **Bedakan fitur yang sudah punya implementasi kode dari fitur yang baru parsial.**

### Feature 01 — Email Intake (IMAP)

**Judul UI:** `Email Content Intake` / adaptasikan bahasa mengikuti situs.

**Ringkasan:** Worker memeriksa email baru, memfilter subject dan lampiran berdasarkan aturan saluran, lalu menyimpan media yang cocok untuk dijadwalkan.

**Detail yang valid:**
- Polling email IMAP menggunakan worker latar belakang.
- Subject dapat dicocokkan dengan aturan seperti `exact` atau `contains`.
- Lampiran dipilih berdasarkan pola nama file dan jenis media.
- Sistem mencatat metadata, jejak polling, dan hasil pemrosesan.
- Baseline UID membantu mencegah email lama langsung menjadi antrean saat inisialisasi.

**Ide visual:** tampilan email ringkas → subject check → attachment matched → accepted media. Hindari email dummy berisi data sensitif.

### Feature 02 — Google Drive Folder Intake

**Judul UI:** `Drive-Synced Folder Monitoring`.

**Ringkasan:** Worker mendeteksi file baru dari folder lokal yang disinkronkan oleh Google Drive Desktop, memeriksa kesiapan file, lalu menyalin media yang memenuhi syarat ke storage sistem.

**Detail yang valid:**
- Google Drive Desktop menangani **sinkronisasi cloud ke folder lokal**; worker membaca **filesystem lokal**, **bukan** Google Drive API untuk alur utama.
- Scan pada tingkat folder langsung; jangan klaim membaca seluruh subfolder secara rekursif.
- Ada pemeriksaan file yang masih terlalu baru/belum stabil, file kosong, dan file sementara.
- Catatan status memungkinkan file yang sudah diproses dilewati.

**Ide visual:** cloud → desktop sync → monitored directory → accepted file. Labeli jalur sebagai `Local folder scan`, bukan `Drive API webhook`.

### Feature 03 — Configurable Channels & Scheduling

**Judul UI:** `Rule-Based Scheduling`.

**Ringkasan:** Operator mendefinisikan sumber, filter media, format posting, caption, dan waktu publikasi lewat wizard saluran. Event tercatat dan dipilih menurut aturan jadwal.

**Detail yang valid:**
- Wizard memiliki tahapan Informasi → Sumber → Konfigurasi → Konfirmasi.
- Dua pendekatan jadwal: jeda setelah input, atau hari/jam tertentu di zona WITA.
- Event terjadwal menggunakan status dan aturan seleksi; input terbaru dan batas slot harian per saluran dapat memengaruhi event yang dieksekusi.
- Jangan mengklaim semua event yang dibuat pasti akan terbit, atau jam publikasi presisi hingga detik.

**Ide visual:** pilihan source/filter sederhana, kalender kecil, lalu event berstatus `SCHEDULED`. Jangan membuat form interaktif palsu yang tampak menyimpan konfigurasi nyata.

### Feature 04 — Instagram Publishing

**Judul UI:** `Automated Instagram Publishing`.

**Ringkasan:** Worker mempersiapkan konten, memproses media yang sesuai, dan mengirimkannya melalui provider publikasi Instagram.

**Detail yang valid:**
- Jalur META yang dipilih wizard baru memakai Meta Graph API.
- Implementasi mencakup gambar tunggal, carousel gambar sampai 10 item, Story menggunakan gambar pertama pada jalur terkait, Reels dari satu MP4, serta kombinasi carousel + Story.
- Persiapan media mencakup konversi gambar dan pemeriksaan/penyesuaian video menggunakan FFmpeg/FFprobe.
- Provider INTERNAL masih ada, tetapi status `PUBLISHED` di jalur tersebut tidak selalu membuktikan konten sudah tampak publik pada saat itu.
- Multi-akun pada model data **tidak berarti** routing dinamis multi-akun META sudah terjamin; target META tertentu dibaca dari konfigurasi server pada implementasi yang ditelaah.

**Ide visual:** satu file media berubah menjadi publikasi, dengan label pilihan `Image`, `Carousel`, `Story`, `Reels` sebagai tampilan informasional. Jangan menampilkan Threads sebagai fitur publish yang selesai.

### Feature 05 — Monitoring & Traceability

**Judul UI:** `Event Monitoring & Activity Logs`.

**Ringkasan:** Dashboard menampilkan saluran dan event; log membantu operator menelusuri proses, status, dan kesalahan publikasi.

**Detail yang valid:**
- Event dapat mempunyai status `SCHEDULED`, `PROCESSING`, `UPLOADING`, `PUBLISHED`, `FAILED`, atau `CANCELLED`.
- Ada jejak polling IMAP/Drive, debug area, log unggah, serta pencatatan pada database/file.
- Jika suatu tahap publikasi gagal setelah tahap lain berhasil, dapat terjadi sukses parsial; operator harus mengecek platform sebelum mengulang.
- Jangan mengarang live telemetry atau analytics engagement/reach jika belum ada.

**Ide visual:** status trail minimal dan detail satu event, bukan fake analytics dashboard.

### Feature 06 — WhatsApp Notifications

**Judul UI:** `WhatsApp Process Notifications`.

**Ringkasan:** Integrasi GREEN-API dapat mengirim informasi proses unggah dan hasilnya ke WhatsApp, sehingga operator tidak perlu terus memeriksa dashboard.

**Detail yang valid:**
- Ada pemanggilan notifikasi pada awal proses dan setelah hasil sukses/gagal.
- Ketersediaan fungsi tetap bergantung pada konfigurasi GREEN-API yang valid.
- Gagal mengirim WhatsApp tidak otomatis berarti posting Instagram gagal.
- Notifikasi bukan bukti independen bahwa konten sudah terlihat publik.

**Ide visual:** kartu pesan notifikasi yang netral dan secara eksplisit diberi label `Illustrative preview` jika bukan screenshot sungguhan.

## 4. Hierarki konten section

**Header:**
- Eyebrow / section index: mengikuti gaya proyek yang sudah ada.
- Heading: `Key Features` (atau bahasa situs sekarang).
- Subheading maksimal 2 baris, misalnya: `The essential building blocks behind automated content delivery.`

**Body:**
- Rekomendasi utama: **alternating editorial feature showcase** dengan teks dan media yang bergantian kiri/kanan, atau **sticky feature index + changing detail panel** jika project sudah memiliki referensi sticky panel.
- **Pilih SATU pola utama** berdasarkan komponen yang ditemukan di repo. Jangan menggabungkan grid kartu, tab, carousel, horizontal scroll, sticky panel, dan accordion sekaligus.
- Berikan nomor 01–06 kecil, heading yang konsisten, 1–2 kalimat ringkas, dan **2–3 proof points** bila memang menambah nilai.
- Gunakan screenshot nyata bila tersedia. Kalau tidak, gunakan ilustrasi skematik ringan dengan label yang jelas.
- Setiap fitur sebaiknya terasa sebagai kisah pendek: *input → processing → output*, bukan daftar bullet besar yang membosankan.

### Opsi A — Editorial alternating (default saat referensi mendukung)

```text
KEY FEATURES
One sentence of context.

01  Email Content Intake             [Real screenshot / compact schematic]
    Short description                [inside established media frame]
    2–3 proof points

[Real screenshot / schematic]        02  Drive-Synced Folder Monitoring
                                     Short description
                                     2–3 proof points

03  Rule-Based Scheduling            [Real screenshot / relevant configuration UI]
...

04  Automated Instagram Publishing
05  Event Monitoring & Activity Logs
06  WhatsApp Process Notifications
```

### Opsi B — Sticky feature explorer (hanya bila cocok dengan project)

```text
KEY FEATURES

[01 Email Intake            ]  ┌─────────────────────────────────────┐
[02 Drive Monitoring        ]  │ Screenshot / schematic for active   │
[03 Scheduling              ]  │ feature, matching current theme     │
[04 Instagram Publishing    ]  │                                     │
[05 Logs & Monitoring       ]  │ Caption / technical detail          │
[06 WhatsApp Notifications  ]  └─────────────────────────────────────┘
```

Pada opsi B, interaksi dapat memakai klik, keyboard, dan pergantian fokus berdasarkan scroll; **jangan membuat dua sumber state yang saling bertentangan**. Di mobile, jadikan daftar blok vertikal biasa dengan media inline, bukan panel sticky sempit.

## 5. Motion & interactivity

1. Saat fitur memasuki viewport, tampilkan **reveal yang restrained**: opacity dan translasi pendek bila sesuai gerak existing site.
2. Aktivasi item/visual mengikuti posisi scroll apabila pola sticky dipilih; transisi media gunakan crossfade sederhana atau animasi existing project.
3. Jika screenshot disorot pada hover/focus, cukup respons border/contrast atau zoom sangat kecil bila referensi memang mendukung. Jangan membesarkan seluruh feature card.
4. Scroll kembali ke atas harus menampilkan feature terkait tanpa state tersangkut.
5. Tidak boleh mengambil alih wheel event, mengunci halaman, membuat horizontal scrolling wajib, atau memicu layout shift besar.
6. Pertahankan dimensi visual (`aspect-ratio`/container size) dan optimalkan gambar.
7. Support `prefers-reduced-motion`: tidak ada translasi/crossfade wajib; seluruh konten tetap jelas.
8. Semua konten tekstual wajib dapat dipahami tanpa Javascript atau animasi aktif sejauh cocok dengan rendering framework.
9. Jika project sudah memiliki util scroll intersection / motion actions, reuse. Jangan menambah GSAP/Framer Motion/Motion One hanya demi efek sederhana.
10. Animasi dianggap berhasil jika membantu narasi dan **tidak mengalihkan perhatian dari screenshot/teks**.

## 6. Bahasa visual — larangan AI slop

**Ikuti yang sudah ada di repository:**
- Font dan skala typography.
- Lebar container dan spacing antar section.
- Warna background/foreground/muted/accent dalam dark dan light mode.
- Pola border, rounding, button, caption, section numbering.
- Gaya gambar dan penggunaan icon.

**Hindari:**
- Enam kartu sama besar berikon pastel dengan bayangan berat.
- Gradien ungu-biru, neon glow, partikel bergerak, rotating rings, fake charts.
- Banyak microinteraction yang bergerak tanpa input pengguna.
- Placeholder screenshot seolah-olah produk asli.
- Klaim `AI-powered`, `100% automated`, `real-time`, `zero failures`, atau metrik tanpa bukti.
- Copywriting hiperbolis; pilih istilah konkret sesuai arsitektur sebenarnya.

## 7. Responsive & accessibility

- Desktop: pakai komposisi asimetris terkontrol jika sesuai project, dengan banyak whitespace tetapi tidak kosong berlebihan.
- Tablet: kurangi lebar media dan jarak; jangan biarkan sticky feature explorer menutupi konten.
- Mobile: tata teks dan visual satu kolom; hindari overflow dan nested scroll.
- Kontrol tab/button (jika ada) harus berupa elemen semantik dan bekerja dengan keyboard serta focus ring theme existing.
- Screenshot punya alt yang deskriptif; dekorasi tidak perlu dibaca screen reader.
- Gunakan heading hierarchy yang benar dan kontras warna memadai.
- Aksesibilitas tetap valid pada reduced motion dan saat JavaScript belum aktif.

## 8. Hubungan dengan How It Works

- `How It Works` menceritakan **alur berurutan dari input sampai outcome** dan bergerak mengikuti scroll vertikal.
- `Key Features` menceritakan **kemampuan utama sistem yang dapat dieksplorasi secara individual**.
- **Jangan** menyalin timeline garis vertikal 6-step dari `How It Works`.
- Jangan mengulang deskripsi 6 tahap workflow secara identik; tampilkan media/screenshot, konteks teknis, dan manfaat operator untuk tiap fitur.
- Pastikan heading size, spacing, dan ritme section selaras agar transisi antarsection terasa alami.

## 9. Data & struktur implementasi

- Jika ada sistem data konten project dalam repo, simpan feature item pada pola/data structure tersebut, bukan menanamkan seluruh konten berulang ke markup.
- Contoh bentuk konseptual (sesuaikan bahasa dan framework repo, jangan tempel mentah):

```ts
type ProjectFeature = {
  id: string;
  number: string;
  title: string;
  summary: string;
  highlights: string[];
  media?: { src: string; alt: string; kind: 'screenshot' | 'schematic' };
};
```

- **Tidak perlu backend atau API tambahan** hanya untuk menyajikan section portofolio.
- Jangan gunakan data palsu dari server. Jika aset belum tersedia, gunakan media placeholder sebagai kondisi editorial yang jelas, atau tampilkan layout typographic.
- Ikuti konvensi komponen, file naming, styles, lazy loading, dan image optimization website existing.

## 10. Rencana implementasi per fase

### Phase 1 — Discovery
- Audit theme, stack, route, reusable sections, motion, dan aset gambar.
- Tetapkan pola visual A atau B dengan alasan yang dapat diverifikasi dari codebase.

### Phase 2 — Content + structure
- Susun keenam feature berdasarkan data konten.
- Bangun section semantik menggunakan komponen yang tersedia.
- Pastikan heading, description, proof points, dan gambar akurat.

### Phase 3 — Interaction
- Tambahkan reveal/focus/active media yang benar-benar mendukung pengalaman.
- Tangani scroll balik, mobile, reduce motion, dan keyboard.

### Phase 4 — Integration
- Pasang section di halaman detail Auto-Sosmed **setelah How It Works** atau sesuai urutan case study yang sudah dipakai project.
- Jangan mengubah section lain kecuali penyesuaian kecil yang diperlukan untuk konsistensi.

### Phase 5 — Verification
- Build/lint/typecheck sesuai scripts di project, perbaiki error yang disebabkan perubahan.
- Periksa theme light/dark, mobile/tablet/desktop, reduced motion, scroll cepat, scroll balik, dan image loading.
- Pastikan tidak ada style global yang bocor atau visual lompatan saat aset termuat.

## 11. Definition of Done / acceptance criteria

- [ ] Section **Key Features** hadir di detail Auto-Sosmed, bukan di semua halaman secara tidak sengaja.
- [ ] Keenam fitur ditampilkan sesuai scope implementasi yang didukung dokumen sumber.
- [ ] Visual matching dengan theme existing, bukan template baru.
- [ ] Bukan 6 kartu SaaS generik; ada presentasi editorial dan media relevan.
- [ ] Animasi halus serta fungsional, tanpa mengganggu scroll.
- [ ] Desain berbeda dari `How It Works` tetapi konsisten dengannya.
- [ ] Responsif di desktop, tablet, mobile, tanpa horizontal overflow.
- [ ] Screenshot tidak difabrikasi; placeholder diberi label jelas.
- [ ] Navigasi keyboard, semantik HTML, alt text, dan reduced motion terpenuhi.
- [ ] Tidak menambah library berat bila solusi existing cukup.
- [ ] Tidak ada klaim Threads end-to-end, Google Drive API langsung, metrik fiktif, atau keandalan absolut.
- [ ] Build/lint/typecheck relevan tidak rusak.

## 12. Output yang harus Claude Code berikan setelah implementasi

1. Ringkasan audit project dan pola desain yang ditemukan.
2. Daftar file yang dibuat/diubah serta alasan.
3. Penjelasan pendek pola section dan interaksi yang dipilih.
4. Daftar asset nyata yang digunakan atau yang masih perlu disediakan.
5. Hasil pengecekan build/lint/typecheck dan batasan yang tersisa.

---

### Sumber konten dan ketentuan validitas

Rujukan konten: `BAHAN-PPT-AUTO-SOSMED.md` yang membahas fitur, workflow IMAP/Google Drive Desktop, scheduler, META/INTERNAL Instagram provider, logs, GREEN-API, dan status integrasi. Jika file itu tersedia di project, gunakan sebagai sumber fakta; kalau tidak, gunakan rincian fitur dan batasan yang **sudah tertulis dalam plan ini**. Jangan mengarang angka keberhasilan, statistik penggunaan, test produksi, atau kemampuan platform lain.

**Final instruction:** Kerjakan dengan standar portofolio software engineer yang matang: presisi, minim ornamen, interaksi bermakna, dan tetap setia pada design system serta referensi animasi dalam project existing.
