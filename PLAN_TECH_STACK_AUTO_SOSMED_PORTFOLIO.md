# IMPLEMENTATION PLAN — TECH STACK SECTION
## Auto-Sosmed · Portfolio Project Detail

> **Target:** Claude Code yang berjalan pada repository website portofolio yang sudah ada.
> **Scope:** Implementasikan **hanya section Tech Stack** pada halaman detail project Auto-Sosmed. Jangan membangun ulang halaman, theme, atau section lain.
> **Prinsip desain:** theme-native, editorial, restrained, useful interaction, performant, accessible, **no AI slop**.

---

## 0. Instruksi wajib: pelajari repository terlebih dahulu

Sebelum menulis kode:

1. Temukan route/detail project Auto-Sosmed dan komponen existing: Hero, How It Works, Key Features, System Architecture.
2. Pelajari design system nyata project: typography, font weights, color tokens, dark/light theme, spacing, containers, borders, radius, shadows, hover/focus, breakpoints.
3. Identifikasi framework, pola komponen dan style (mis. Svelte/SvelteKit, React, Tailwind, CSS modules, CSS biasa) **dari repository**, jangan mengasumsikan stack portofolio sama dengan aplikasi Auto-Sosmed.
4. Cari referensi interaksi/animasi yang sudah diimplementasikan dalam repository. Gunakan kembali primitives, easing, durasi, dan pendekatan observasi scroll yang telah ada.
5. Cek package manager dan dependencies. **Tidak menambah package** bila dapat dilakukan dengan API browser dan CSS yang sudah ada.
6. Periksa urutan section dan transisi visual. Tech Stack harus menyatu dengan section sebelum/sesudahnya dan tidak mengulang pola interaksi persis seperti How It Works atau System Architecture.
7. Cari aset/logo yang sudah tersedia. Jika tidak ada, jangan mengambil logo acak dari CDN tanpa persetujuan: pakai wordmark tipografi atau ikon yang konsisten dengan design system.
8. Jangan menyentuh secret, token, cookie, file `.env`, atau menampilkan nilainya di UI.

**Deliverable sebelum coding (singkat dalam output kerja):** daftar file yang akan diubah, komponen/tokens yang akan dipakai kembali, pola interaksi yang dipilih, serta apa yang sengaja tidak ditambahkan.

---

## 1. Tujuan section

Tech Stack bukan katalog logo teknologi. Bagian ini harus menjawab:
- Teknologi apa yang membangun Auto-Sosmed?
- Apa peran masing-masing dalam sistem?
- Bagaimana teknologi-teknologi itu bekerja bersama?
- Apa pertimbangan engineering di balik pembagian komponen?

Narasi inti: **“A full-stack application powered by dedicated background workers, PostgreSQL-backed scheduling, and external publishing integrations.”**

Hindari klaim benchmark, traffic, uptime, atau skalabilitas yang belum diukur.

---

## 2. Konsep visual: Editorial Technology Index

Buat section dengan kualitas studi kasus developer profesional, bukan landing page SaaS generik.

### Komposisi desktop
- Header section: eyebrow `UNDER THE HOOD` (atau mengikuti bahasa/kebiasaan label repository), heading `Technology Stack`, deskripsi dua kalimat pendek.
- Sebelah kiri: indeks kategori ringkas/rail navigasi (sticky **hanya jika** sesuai pola layout existing dan tersedia ruang).
- Sebelah kanan: daftar teknologi dalam baris editorial dengan nama, peran singkat, dan detail engineering yang relevan.
- Gunakan pembatas halus, whitespace yang baik, tipografi kuat, dan grid konsisten dengan container project.
- Pada viewport sempit: ubah menjadi urutan satu kolom; **jangan** memaksakan sticky atau scroll horizontal.

### Interaksi secukupnya
- Kategori bisa dipilih menggunakan tombol/segmented index agar isi kategori menjadi fokus atau halaman scroll halus ke anchor terkait.
- Baris teknologi dapat membuka detail **hanya apabila informasi tambahannya berguna**; bila copy cukup pendek, tampilkan langsung tanpa accordion.
- Saat user scroll, kategori aktif mengikuti section yang terlihat memakai `IntersectionObserver` atau utilitas repo.
- Reveal halus untuk grup saat masuk viewport: opacity dan translate kecil; tidak gunakan stagger panjang atau animasi berat.
- Microinteraction hover/focus ringan, tanpa glow neon, magnetic hover, partikel, parallax berlebihan, atau tilt 3D.
- **Bedakan** dari How It Works (vertikal progress) dan System Architecture (node/koneksi). Jangan membuat flowchart kedua.

### Prinsip estetika anti-AI-slop
- **Tidak** ada background gradient besar otomatis, puluhan glass cards, animasi ikon terus-menerus, logo berputar, garis konektor dekoratif, atau sudut yang terlalu membulat jika theme tidak menggunakannya.
- Hindari copy kosong seperti “cutting-edge”, “seamless”, “revolutionary”, “blazing fast”.
- Jangan mencampur ikon dengan bentuk/bayangan berbeda-beda.
- Jangan memaksakan warna brand masing-masing teknologi apabila bentrok dengan palette portofolio; gunakan monochrome/neutral by default.

---

## 3. Konten faktual Tech Stack Auto-Sosmed

**Penting:** sumber materi ini adalah dokumen BAHAN-PPT-AUTO-SOSMED.md (hasil analisis kode), bukan pemeriksaan runtime langsung. Versi dependency berasal dari deklarasi `package.json`, tidak menjamin versi terinstal. Implementasi portofolio harus menjaga perbedaan tersebut.

| Kategori | Teknologi | Peran yang boleh dinyatakan |
|---|---|---|
| Web application | Next.js 16.3.4 | Dashboard web dan API route handlers |
| UI | React / React DOM 19.2.8 | Komponen antarmuka dan konfigurasi interaktif |
| Language | TypeScript ^5 | Type safety di UI, services, dan workers |
| Styling | Tailwind CSS ^4, CSS lokal, PostCSS | Styling aplikasi |
| Runtime | Node.js | Menjalankan app dan worker yang dibuild |
| Database | PostgreSQL | Konfigurasi, antrean event, status dan audit |
| ORM | Prisma ^7.10.0 + PostgreSQL adapter | Model data dan akses database |
| Database driver | pg ^8.23.0 | Koneksi PostgreSQL |
| Email ingestion | imapflow ^1.7.8 | Membaca email IMAP |
| Email parsing | mailparser ^3.9.20 | Parsing metadata dan lampiran |
| Instagram publishing | Meta Graph API | Publikasi media melalui provider META |
| Alternate Instagram provider | Python + engine `ig_auto_schedule.py` | Jalur INTERNAL berbasis sesi/cookie; bukan default wizard baru |
| Session/browser | Playwright ^1.63.0 | Jalur login/verifikasi sesi yang membutuhkannya |
| Media processing | FFmpeg + FFprobe | Validasi, konversi, remux/transcode media |
| WhatsApp notification | GREEN-API | Notifikasi proses publikasi jika dikonfigurasi |
| Process supervision | Python / pythonw.exe + Windows Task Scheduler | Menjalankan/mengawasi worker pada lingkungan Windows |
| Configuration | dotenv ^17.4.2 | Memuat env configuration |
| Development tooling | ESLint ^9 + tsx ^4.23.13 | Linting dan menjalankan TypeScript |

### Kelompok visual utama (ditampilkan default)

Agar tidak menjadi wall of logos, tampilkan **5 kategori**:

1. **Application** — Next.js, React, TypeScript, Tailwind CSS.
2. **Data & Scheduling** — PostgreSQL, Prisma, Node.js worker.
3. **Content Ingestion** — IMAPFlow, Mailparser, Google Drive Desktop (sinkronisasi lokal, **bukan Google Drive API langsung**).
4. **Publishing & Media** — Meta Graph API, FFmpeg/FFprobe, Python provider INTERNAL (alternatif).
5. **Operations & Integrations** — GREEN-API, Playwright (sesuai peran), Windows Task Scheduler.

Dependency detail (`pg`, `dotenv`, `tsx`, `ESLint`, PostCSS) boleh dimasukkan ke **compact expandable “Additional Tooling”**, jika sesuai pola UI existing. Jangan membiarkan detail teknis minor mendominasi.

### Sample copy yang ringkas dan grounded

**Section intro**
> Built with a modern web stack and a separate worker pipeline. The dashboard configures automation, while background processes handle media intake, event scheduling, and Instagram publishing.

**Application**
> Next.js and React power the operator dashboard, while TypeScript helps keep application services and worker workflows consistent.

**Data & Scheduling**
> PostgreSQL stores the publishing queue, configuration, and process history. Worker processes claim scheduled events and update their statuses.

**Content Ingestion**
> IMAP workers parse incoming email attachments. A separate worker watches a locally synchronized Google Drive Desktop folder.

**Publishing & Media**
> Media is validated and prepared with FFmpeg before the configured publisher sends it to Instagram. The current wizard chooses the Meta provider; an alternate Python-based provider also exists.

**Operations**
> Separate background workers, runtime logs, and optional WhatsApp notifications help operators track publication activity.

Pakai bahasa Indonesia jika portofolio existing menggunakan bahasa Indonesia. **Ikuti bahasa konten repo, jangan mencampur gaya bahasa hanya karena contoh ini English.**

---

## 4. Spotlight untuk keputusan engineering

Di bawah daftar stack, tambahkan **maksimal 2–3 short engineering notes** yang menonjolkan *mengapa stack itu dipakai*, dengan konten konkret:

- **Database-backed queue:** event dijadwalkan dan diseleksi lewat PostgreSQL; tidak ada bukti Redis/RabbitMQ/Kafka digunakan sebagai antrean utama.
- **Separated background execution:** dashboard bukan pemicu langsung tiap publikasi; IMAP, Drive, dan scheduler berjalan sebagai proses worker tersendiri.
- **Local media, relational metadata:** media disimpan di storage disk; metadata dan status dicatat di database.

Jangan mengklaim ini sebagai tradeoff eksklusif/performance winner tanpa pengukuran. Jika section Engineering Challenges di halaman sudah membahasnya mendalam, cukup pakai satu baris insight di sini dan link/anchor ke sana.

---

## 5. Struktur komponen yang disarankan (adaptasi ke framework repo)

Contoh konseptual, bukan instruksi membuat path baru secara membabi-buta:

```text
ProjectDetail / AutoSosmed
  TechStackSection
    SectionHeading
    StackCategoryNav (optional desktop sticky)
    StackCategoryGroup x 5
      TechnologyRow
    EngineeringNotes (optional)
```

- Definisikan data stack sebagai array/object lokal bertipe jelas, **bukan HTML yang diulang manual**.
- Pilih komponen native repository (mis. `.svelte`, `.tsx`) sesuai proyek portofolio.
- Gunakan CSS variables / design tokens project untuk semua warna, border, spacing, easing, dan radii.
- Semua interaksi client harus berjalan tanpa panggilan external API.
- Jangan install diagram library hanya untuk section ini.

---

## 6. Responsiveness, performance, accessibility

### Responsiveness
- Desktop: kategori / indeks dan konten dapat berdampingan jika pas.
- Tablet: jangan memaksakan sidebar sempit; kategori dapat jadi navigasi horizontal sederhana dengan wrap.
- Mobile: kategori jadi anchor list atau satu kolom; text wrapping aman; tidak ada overflow.

### Performance
- Default gunakan text dan CSS. Logo eksternal tidak wajib.
- Gunakan `IntersectionObserver` secukupnya, cleanup observer saat unmount.
- Jangan membuat listener scroll dengan state update setiap frame tanpa alasan.
- Jika perlu animasi progres, utamakan CSS transform/opacity; dukung keadaan static saat JS mati sejauh praktis.
- Hindari layout shift: tetapkan ukuran aset dan tinggi intrinsik yang stabil.
- Hormati `prefers-reduced-motion`.

### Accessibility
- Category navigation memakai `<button>` atau `<a>` yang semantik, bukan `<div>` clickable.
- Keyboard dan fokus terlihat jelas memakai token theme.
- Teknologi tidak dijelaskan melalui warna/ikon saja.
- Jika ada accordion, pastikan `aria-expanded`, `aria-controls`, dan kontrol keyboard bekerja.
- Jika kategori berubah saat scroll, jangan memaksa focus berpindah.
- Heading hierarchy konsisten dengan halaman.

---

## 7. Scope boundaries / hal yang tidak boleh terjadi

- Jangan ubah design system global, navbar, footer, router atau section lain tanpa kebutuhan nyata.
- Jangan mengubah How It Works / Key Features / System Architecture agar menyesuaikan section baru; justru Tech Stack yang mengikuti desain existing.
- Jangan menyalin daftar 20+ logo menjadi grid kartu seragam.
- Jangan menampilkan Threads sebagai publisher otomasi penuh: dokumen menyebut integrasi parsial.
- Jangan mengklaim YouTube, TikTok, X sudah aktif.
- Jangan mengklaim Google Drive REST API digunakan untuk polling utama; sumber aktif adalah folder lokal Drive Desktop.
- Jangan menulis AI caption generator sebagai bagian stack aktif.
- Jangan mengasumsikan aplikasi portofolio dibangun menggunakan Next.js; Next.js adalah stack **Auto-Sosmed**.
- Jangan menambahkan angka hasil, benchmark atau uptime palsu.
- Jangan menyertakan password, API key atau session cookie.

---

## 8. Tahapan implementasi untuk Claude Code

### Phase 1 — Repository audit
1. Identifikasi halaman Auto-Sosmed, section system architecture yang ada, posisi Tech Stack.
2. Ringkas design tokens dan komponen yang bisa direuse.
3. Konfirmasi teknologi framework website portofolio.

### Phase 2 — Content modeling
1. Buat data array untuk kelima kelompok teknologi.
2. Tulis ringkasan 1 kalimat per kategori dan peran singkat tiap teknologi.
3. Tandai opsi alternate/conditional (`INTERNAL`, GREEN-API) tanpa memberi kesan semua jalur aktif produksi.

### Phase 3 — UI implementation
1. Bangun heading, navigasi kategori opsional, dan editorial rows.
2. Terapkan theme existing, spacing, typography, dan separator yang sudah dipakai.
3. Integrasikan section ke halaman project detail tanpa memengaruhi layout lain.

### Phase 4 — Interactivity & motion
1. Tambahkan active category berdasarkan viewport hanya jika menambah kegunaan.
2. Tambahkan subtle entry animation yang konsisten dengan section lain.
3. Terapkan reduced-motion, keyboard focus dan cleanup observers.

### Phase 5 — QA
1. Jalankan lint/typecheck/build sesuai scripts project.
2. Uji desktop, tablet, mobile; dark/light jika tersedia.
3. Uji scroll naik-turun, klik kategori, keyboard, dan reduced-motion.
4. Periksa ulang factual accuracy seluruh label dan klaim.
5. Laporkan file yang diedit dan hasil validasi, termasuk batasan yang belum diuji.

---

## 9. Acceptance criteria

- [ ] Section Tech Stack ada di detail proyek Auto-Sosmed, bukan halaman global.
- [ ] Menggunakan theme existing (font, palette, spacing, components).
- [ ] Menampilkan 5 kelompok stack yang mudah dipindai.
- [ ] Peran tiap teknologi mudah dimengerti, bukan logo saja.
- [ ] Interaktif secara fungsional tetapi lebih tenang dari workflow scroll.
- [ ] Tidak memakai komponen SaaS-card repetitif / heavy animations.
- [ ] Berfungsi responsif, keyboard friendly, dan reduced-motion friendly.
- [ ] Tidak menambah dependencies tanpa kebutuhan kuat.
- [ ] Klaim stack sesuai informasi terdokumentasi, tanpa platform/fitur fiktif.
- [ ] Lint/typecheck/build lolos atau kegagalannya dijelaskan.

---

## 10. Prompt eksekusi ringkas

> Implementasikan section **Tech Stack** pada halaman detail project **Auto-Sosmed** berdasarkan dokumen ini. **Audit repository portofolio terlebih dahulu** untuk menemukan komponen referensi, design tokens, existing motion, dan struktur project. Gunakan pendekatan **Editorial Technology Index** dengan lima kategori (Application, Data & Scheduling, Content Ingestion, Publishing & Media, Operations & Integrations), penjelasan peran teknologi, dan interaksi kategori yang halus serta benar-benar berguna. Pastikan visual mengikuti theme eksisting, tidak AI slop, tidak berlebihan, ringan, responsif dan accessible. Jangan membuat ulang flowchart atau menyalin gaya timeline How It Works. Gunakan konten stack yang didokumentasikan di sini dan jangan mengklaim fitur yang masih parsial sebagai sudah aktif. Setelah implementasi, jalankan validasi yang tersedia dan laporkan perubahan file.
