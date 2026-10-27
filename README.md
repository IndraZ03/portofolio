# IndraZ03 — Personal Developer Portfolio

Website portfolio developer personal modern, minimal, premium, interaktif, dan performant. Dibuat dengan fondasi **HTML5, CSS3, dan Vanilla JavaScript (ES Modules)** dengan **GSAP + ScrollTrigger** untuk 3D scroll gallery tanpa framework runtime berat (tanpa React, Next.js, Vue, Tailwind, atau Three.js/WebGL).

---

## 1. Status Fase Implementasi

- [x] **Fase 1 — Audit & Setup**: Arsitektur statis murni tanpa runtime framework.
- [x] **Fase 2 — Foundations & Navbar**: Design tokens (`#0a0a0b`, clay `#18181b`, grid 40px), pill navigation, mobile accessible drawer, dan wordmark persis teks `IndraZ03` tanpa ikon.
- [x] **Fase 3 — Hero Section**: Eyebrow badge, typography editorial besar, negative letter-spacing, dan dual CTA button claymorphic.
- [x] **Fase 4 — Projects 3D Sphere Gallery**: Distribusi Fibonacci sphere mathematically exact, CSS 3D transforms (`translate3d` + `rotateY` + `rotateX`), rotasi scrub GSAP ScrollTrigger pada 320vh track, active front-card detection via camera Z-projection, serta floating detail panel sinkron.
- [x] **Fase 5 — About Me**: Layout editorial responsif, avatar placeholder lokal, stats list, bio, dan skill categories.
- [x] **Fase 6 — Kind Words**: Daftar kutipan transparan dengan label dummy `[Sample Feedback]`.
- [x] **Fase 7 — Contact & Footer**: Ambient constellation cards, action button, social pills, dan footer dengan runtime dynamic copyright year.
- [x] **Fase 8 — QA & Accessibility**: Mendukung keyboard navigation, ARIA attributes, skip link, fallback grid untuk `prefers-reduced-motion`, responsive styling (375px hingga 1440px+).

---

## 2. Struktur File

```
portofolio/
├── index.html                     # Entrypoint HTML5 semantik
├── README.md                      # Dokumentasi & panduan
├── plan.md                        # Master specification plan
├── src/
│   ├── css/
│   │   ├── style.css              # Tokens, typography, clay buttons/cards, 3D scene
│   │   └── responsive.css         # Breakpoints & prefers-reduced-motion media query
│   ├── js/
│   │   ├── main.js                # App bootstrap & dynamic rendering
│   │   ├── sphere.js              # Fibonacci 3D sphere controller & camera projection
│   │   └── navigation.js          # Mobile drawer, active link observer & smooth scroll
│   └── data/
│       ├── site.js                # Konfigurasi identitas, bio, skill, kontak
│       ├── projects.js            # Data proyek tersentralisasi
│       └── testimonials.js        # Data testimonial [Sample]
└── assets/
    ├── images/
    │   ├── atmos-wrf/             # ATMOS / WRF-WEB
    │   ├── auto-sosmed/           # Auto Sosmed Metamorph
    │   ├── awos-aws/              # Monitoring AWOS & AWS (belum ada foto)
    │   ├── hotspot/               # Peta Sebaran Hotspot
    │   ├── metar-synop/           # Monitoring METAR, SYNOP dan TAFOR
    │   ├── profile/               # Foto profil dan avatar placeholder
    │   ├── web-bmkg-kaltim/       # Web BMKG Kaltim & Sistem Pelayanan Data
    │   └── whatsapp-ai-agent/     # WhatsApp AI Agent (belum ada foto)
    └── projects/
        ├── project-01.svg
        ├── project-02.svg
        ├── project-03.svg
        ├── project-04.svg
        ├── project-05.svg
        ├── project-06.svg
        ├── project-07.svg
        └── project-08.svg
```

---

## 3. Cara Menjalankan Secara Lokal

Karena proyek ini menggunakan ES Modules native browser (`import`/`export`), jalankan local HTTP server sederhana:

### Opsi A (Python 3 - Bawaan macOS/Linux):
```bash
cd /Users/mba1/portofolio
python3 -m http.server 8000
```
Buka browser di: `http://localhost:8000`

### Opsi B (Node.js npx serve):
```bash
npx serve .
```

### Opsi C (VS Code Live Server):
Klik kanan pada `index.html` lalu pilih **Open with Live Server**.

---

## 4. Cara Mengubah Data & Kustomisasi

Seluruh data personal terpusat dalam folder `src/data/`:

1. **Wordmark & Identitas**:
   - Wordmark navbar teks diatur di `index.html` pada tag `.wordmark` (nilai default: `IndraZ03`).
   - Meta title, deskripsi, bio, skill, dan stats diubah di `src/data/site.js`.

2. **Daftar Proyek**:
   - Buka `src/data/projects.js`.
   - Tambah/edit item proyek: `id`, `title`, `category`, `year`, `summary`, `description`, `technologies`, `image`, `demoUrl`, dan `sourceUrl`.

3. **Avatar & Gambar Proyek**:
   - Simpan foto proyek di `assets/images/<nama-proyek>/` sesuai folder di atas; foto profil berada di `assets/images/profile/`.
   - Folder `awos-aws/` dan `whatsapp-ai-agent/` sudah disiapkan dengan `.gitkeep` meskipun belum mempunyai foto.
   - Setelah menambahkan foto, perbarui path `src` pada halaman `projects/<nama-proyek>.html`. Untuk galeri beberapa foto, perbarui juga `data-gallery`; modal dan slideshow memakai path yang sama.
   - SVG placeholder galeri proyek tetap berada di `assets/projects/`.

4. **Testimonial**:
   - Edit di `src/data/testimonials.js`.

5. **Email & Social Links**:
   - Buka `src/data/site.js` pada objek `siteConfig.contact`:
     ```javascript
     email: "emailanda@domain.com",
     socials: [
       { name: "GitHub", url: "https://github.com/username" },
       { name: "LinkedIn", url: "https://linkedin.com/in/username" }
     ]
     ```
