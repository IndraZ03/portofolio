# Implementation Plan — WhatsApp AI Agent Portfolio

> Target halaman: `/project/whatsapp-ai-agent` (verifikasi route aktual di repository). Dokumen ini adalah brief untuk Claude Code mengimplementasikan **section halaman case study portofolio**, bukan deck presentasi atau instruksi membangun backend agent.

**Proyek:** WhatsApp AI Agent menggunakan Hermes Agent, Baileys, 9router, dan Qdrant sebagai vector knowledge database.

**Ketepatan fakta:** alur rinci antara Hermes, 9router, Qdrant, dan service penghubung harus diperiksa di repository agent jika tersedia. Pada situs portofolio, bedakan `Implemented`, `Architecture concept`, dan `Planned` berdasarkan bukti, bukan asumsi.

## Tujuan section: Key Features
Buat **editorial interactive feature showcase**, bukan grid enam kartu yang identik. Beda dari How It Works (narasi perjalanan pesan) dan System Architecture (hubungan komponen). Fokus pada apa yang pengunjung bisa pahami sebagai kemampuan sistem.

## Feature narratives
Empat kemampuan inti yang dapat dijelaskan dari informasi pemilik proyek:

| Feature | Copy pendek | Yang divisualkan |
|---|---|---|
| WhatsApp-Native Interface | Agent dapat berinteraksi di kanal WhatsApp melalui integrasi Baileys. | UI chat sintetis dan connector |
| Hermes Agent Core | Logika percakapan dikoordinasikan oleh Hermes Agent. | Orchestration steps, bukan klaim alat tertentu |
| Knowledge Retrieval with Qdrant | Pengetahuan tersimpan sebagai representasi vektor untuk pencarian konteks. | Knowledge docs -> vectors -> retrieval |
| Model Connectivity via 9router | Akses model AI diintegrasikan menggunakan 9router. | Routing node menuju inference |

Kemampuan tambahan di bawah adalah **kandidat hanya jika tervalidasi dari repo**, bukan fakta default:
- Group chat / mention awareness.
- Tool calling atau integrations spesifik.
- Session memory / long-term memory.
- Multi-model failover, routing berdasar biaya, atau monitoring usage.
- Ingestion dokumen otomatis, metadata filtering, atau sitasi sumber.
- Admin dashboard, conversation analytics, approval/human handoff.

## Layout dan interaksi
- Desktop: komposisi editorial 2 kolom, rail judul fitur + panel visual sticky yang berganti konten saat user scroll melewati chapter. Pertahankan tinggi section wajar; jika existing references memakai alternate layout, boleh adaptasi.
- Mobile: konten berurutan dengan ilustrasi inline; tanpa parallax mahal/sticky yang menghalangi teks.
- Fitur aktif ditandai dengan typographic hierarchy/indicator tipis menggunakan aksen theme; bukan gradient atau neon.
- Ilustrasi dibuat dengan HTML/CSS/SVG ringan: mock WhatsApp **sintetis**, diagram retriever, Hermes node, 9router connection. Tidak mengandalkan logo random dari CDN.
- Animasi fokus: subtle opacity/translate 8–16px, crossfade panel 150–300ms jika sejalan dengan motion token existing; tidak memakai animasi 3D.
- Saat klik label fitur, scroll ke feature yang dimaksud (`scrollIntoView`) hanya jika konsisten dengan navigasi situs; pertahankan pilihan keyboard.
- Tidak ada hover card berputar, auto carousel, typing effect palsu atau testimonial fabricated.

## Struktur copy yang diusulkan
Title: `Built for conversations, grounded in knowledge.`
Subtitle: `A WhatsApp-connected AI agent that combines agent orchestration, model access, and vector-based knowledge retrieval.`

Gunakan satu paragraf teknis dan satu visual per fitur. Tambahkan `Learn what powers this` untuk berpindah ke System Architecture bila desain situs punya anchor links; tidak perlu CTA generik.

## Fase eksekusi
1. Audit referensi Key Features existing agar feel konsisten namun konten khusus agent.
2. Validasi empat komponen inti dari kode dan cari screenshot/asset project.
3. Buat data `features` yang reusable dan semantic.
4. Implementasikan scroll-aware focus + visual per feature, tanpa animasi berlebihan.
5. QA aksesibilitas, build, dan screenshot review pada desktop/mobile.

## Acceptance khusus
- Pengunjung bisa membedakan fungsi Baileys, Hermes, 9router, dan Qdrant hanya dari membaca feature.
- Tidak ada label fitur yang mengaku bekerja (mis. automasi grup, voice, multimodal) tanpa bukti.
- Fitur tidak berubah menjadi penjelasan ulang pipeline How It Works.

## Aturan wajib sebelum coding
1. Audit repository portofolio: temukan route yang benar untuk `/project/whatsapp-ai-agent`, layout, komponen, design tokens, font, breakpoints, motion utilities, dan referensi section dari proyek Auto-Sosmed/ATMOS. Jangan menebak framework atau membuat route duplikat.
2. Prioritaskan reuse komponen dan library yang telah terpasang. Jangan menambah dependency animasi/diagram hanya untuk efek dekoratif.
3. Ikuti theme aktif (termasuk dark/light jika ada), warna, ukuran teks, border, spacing, radius, dan rhythm existing. Jangan memaksakan palet ungu/neon atau estetika chatbot generik.
4. Implementasikan di halaman portofolio yang sudah ada, **bukan** demo atau aplikasi WhatsApp baru. Perubahan harus scoped; jangan memodifikasi theme global atau section lain tanpa alasan.
5. Cari screenshot/asset asli jika ada. Jika tidak ada, gunakan visual HTML/SVG yang abstrak dan jujur; jangan mengarang screenshot/chat produksi, metrik, atau badge verifikasi.
6. Gunakan data terstruktur yang mudah diedit, semantic HTML, keyboard-accessible controls, focus-visible, responsive layout, dan `prefers-reduced-motion`.
7. Jangan membocorkan nomor WhatsApp, isi percakapan, API key, embedding, dokumen internal, atau endpoint private. Semua contoh chat harus sintetis dan diberi label contoh.
8. **Jangan menyimpulkan detail yang belum dikonfirmasi sebagai fitur terimplementasi**. Pengguna hanya memastikan: 9router, Hermes Agent, integrasi WhatsApp via Baileys, dan Qdrant untuk knowledge vector database. Audit kode/dokumen proyek AI agent bila tersedia. Bila tidak, tampilkan gambaran arsitektur konseptual dengan frasa aman dan bukan hasil verifikasi implementasi.
9. Pastikan penamaan **9router** konsisten. Jangan otomatis menyamakannya dengan OpenRouter, 9Router tertentu, atau mengklaim routing/failover/token accounting spesifik tanpa bukti dari konfigurasi proyek.

## Definition of done
- Section berada pada route proyek yang tepat dan serasi dengan style situs.
- Semua kontrol berfungsi pada mouse, touch, keyboard; tidak ada interaksi yang bergantung hanya pada hover.
- Layout tidak overflow di lebar 320–390px, tablet, desktop.
- Animasi bisa mundur ketika scroll ke atas, tidak mengganggu navigasi, dan reduced-motion tetap bermakna.
- Tidak ada fakta arsitektur, SLA, privasi, KPI, atau fitur AI yang diklaim tanpa bukti.
- Lint/build/test yang tersedia dijalankan; laporkan file berubah, hasil, dan keterbatasan.
