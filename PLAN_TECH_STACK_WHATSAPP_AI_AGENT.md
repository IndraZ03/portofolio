# Implementation Plan — WhatsApp AI Agent Portfolio

> Target halaman: `/project/whatsapp-ai-agent` (verifikasi route aktual di repository). Dokumen ini adalah brief untuk Claude Code mengimplementasikan **section halaman case study portofolio**, bukan deck presentasi atau instruksi membangun backend agent.

**Proyek:** WhatsApp AI Agent menggunakan Hermes Agent, Baileys, 9router, dan Qdrant sebagai vector knowledge database.

**Ketepatan fakta:** alur rinci antara Hermes, 9router, Qdrant, dan service penghubung harus diperiksa di repository agent jika tersedia. Pada situs portofolio, bedakan `Implemented`, `Architecture concept`, dan `Planned` berdasarkan bukti, bukan asumsi.

## Tujuan section: Tech Stack
Bangun **editorial technology index** yang mengungkap **peran** teknologi, bukan grid logo. Berbeda dari diagram System Architecture; fokus pada pilihan teknologi dan trade-off yang benar-benar diketahui.

## Teknologi yang boleh ditampilkan sebagai inti
| Kategori | Teknologi | Role yang aman | Hal yang perlu diverifikasi |
|---|---|---|---|
| Messaging | Baileys | Integrasi pesan WhatsApp | versi, mode auth, deployment, dukungan grup/media |
| Agent Runtime | Hermes Agent | Orkestrasi agent | versi, skills/tools yang aktif, integrasi gateway |
| Model Access | 9router | Perantara akses/routing model pada proyek ini | distribusi provider, model, failover, proses request |
| Vector Knowledge | Qdrant | Database vektor untuk knowledge | embedding model, collection schema, filtering, indexer |

Jangan menambahkan Node.js, TypeScript, Python, Docker, Redis, PostgreSQL, LangChain, OpenAI, atau model tertentu ke daftar **implemented** hanya berdasarkan kebiasaan stack umum. Tampilkan sebagai `Supporting Technologies` hanya jika ditemukan di repository.

## Konsep layout
- Judul editorial `Technology behind the conversations` dengan subjudul satu kalimat.
- Empat kelompok ditampilkan sebagai indeks vertikal dengan nomor kecil (01–04), nama teknologi yang tipografinya dominan, role singkat, lalu panel ekspansi `How it's used`.
- Pilih satu dari pola yang *sudah ada* di proyek: sticky category rail, minimal accordion, atau two-column detail view. Jangan gabungkan semua pattern sekaligus.
- Saat scroll, active index terbarui; detail dapat dibuka dengan klik/keyboard. Jangan auto-switch ketika pengguna sedang membaca panel yang ia buka secara manual.
- Reveal lembut sesuai motion primitives situs; hindari logo constellation, marquee logo, 3D spheres, animated counters, rotating gradient.
- Gunakan ikon/wordmark hanya dari assets project atau official verified asset yang memang diizinkan; fallback berupa nama teks dengan typographic hierarchy.

## Engineering decisions: tampilkan hanya dengan verifikasi
- **Why Hermes:** alasan memilih agent orchestration (bila user pernah mendokumentasikan).
- **Why Baileys:** pilihan konektivitas WhatsApp dan trade-off maintenance/session handling, tanpa mengklaim API resmi Meta.
- **Why Qdrant:** semantic knowledge retrieval versus pencocokan kata kunci; ungkap schema/embeddings jika terdokumentasi.
- **Why 9router:** abstraksi koneksi model, rincian model/provider menurut konfigurasi nyata.

Tambahkan catatan singkat: Baileys adalah library koneksi WhatsApp Web, bukan berarti proyek menggunakan WhatsApp Business Cloud API resmi. Jangan menjamin kesesuaian ToS atau 24/7 uptime.

## Saran struktur data UI
```ts
type StackItem = {
  id: string;
  name: string;
  category: 'messaging' | 'agent' | 'model-access' | 'knowledge';
  summary: string;
  usageDetail: string;
  verification: 'confirmed-by-owner' | 'verified-in-code' | 'requires-verification';
};
```
Gunakan shape ini sebagai ide jika stack framework adalah TypeScript; bila bukan, adaptasi ke codebase existing. Tidak perlu mengekspos label verifikasi sebagai badges menonjol bila copy bisa ditulis secara tepat.

## Fase eksekusi
1. Audit package files dan dokumentasi AI agent yang tersedia; periksa dengan ketat mana yang benar-benar digunakan.
2. Audit section Tech Stack pada portofolio lain untuk reuse desain dan motion.
3. Buat indeks stack 4 inti; tambahkan supporting tools yang tervalidasi.
4. Implementasikan state kategori dan detail yang aksesibel dan low-cost rendering.
5. Uji responsive, lint/build, dan konsistensi visual dengan section lain.

## Acceptance khusus
- Masing-masing dari empat komponen punya penjelasan jelas dan tidak saling tertukar.
- Tidak ada klaim fitur built-in Hermes otomatis aktif di setup pengguna.
- Tidak menampilkan secret, endpoint private, nomor, atau koleksi knowledge rahasia.

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
