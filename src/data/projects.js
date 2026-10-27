/**
 * Centralized portfolio projects and their stories.
 */
export const projectsData = [
  {
    id: "project-01",
    title: "ATMOS / WRF-WEB",
    category: "NWP & Simulation / Web Engineering",
    year: "2025–2026",
    summary: "Pemodelan cuaca WRF/WRF-Chem lewat antarmuka web dan AI Agent untuk mendukung Operasi Modifikasi Cuaca (OMC).",
    description: "Kolaborasi Yudha Satrio Oktavandi dan Dwi Indra Prasetyo: menyederhanakan konfigurasi namelist dan eksekusi WRF/WRF-Chem lewat antarmuka web, koreksi AI Agent, hingga menghasilkan produk OMC.",
    technologies: ["WRF / WRF-Chem", "AI Agent", "Web Interface", "Namelist", "wrfout"],
    image: "assets/projects/project-01.svg",
    demoUrl: "projects/atmos-wrf.html",
    sourceUrl: "#",
    featured: true
  },
  {
    id: "hotspot",
    title: "Peta Sebaran Hotspot",
    category: "Pemetaan / Dukungan Operasional",
    summary: "Peta sebaran hotspot untuk Tim Datin dan stakeholder, dilengkapi akses Google Maps serta overlay angin dan area konsesi.",
    description: "Mempermudah deteksi hotspot melalui peta dengan akses rute Google Maps menuju titik hotspot, overlay angin, dan area konsesi untuk mendukung OMC serta water bombing.",
    technologies: ["Peta Hotspot", "Google Maps", "Overlay Angin", "Area Konsesi"],
    image: "assets/projects/hotspot.svg",
    demoUrl: "projects/hotspot.html",
    sourceUrl: "#",
    featured: true,
    sections: [
      {
        title: "Kebutuhan Tim Datin",
        paragraphs: [
          "Selama ini, plotting hotspot masih dilakukan secara manual dan harus menjalankan script yang membutuhkan waktu untuk mengolah data. Ketua Tim Datin mengajak saya mengembangkan peta sebaran hotspot agar Tim Datin dan stakeholder lebih mudah mendeteksi hotspot."
        ]
      },
      {
        title: "Akses Rute Google Maps",
        paragraphs: [
          "Pada pop-up hotspot, ditambahkan tombol menuju Google Maps agar pengguna dapat langsung diarahkan ke titik lokasi hotspot lengkap dengan panduan rute navigasi.",
          "Overlay angin dan area konsesi juga ditambahkan untuk mendukung Operasi Modifikasi Cuaca (OMC) dan water bombing."
        ]
      }
    ]
  },
  {
    id: "metar-synop",
    title: "Monitoring METAR, SYNOP dan TAFOR",
    category: "Observasi / Otomatisasi",
    summary: "Monitoring pengiriman METAR, SYNOP dan TAFOR dari BMKGSoftv2 melalui WhatsApp dan PC Observasi, sekaligus mendukung koordinasi OMC.",
    description: "Bot WhatsApp memantau status serta menit pengiriman METAR, SYNOP dan TAFOR, memberi peringatan keterlambatan, dan terhubung dengan pembatasan akses PC Observasi sebelum pengiriman.",
    technologies: ["METAR", "SYNOP", "TAFOR", "BMKGSoftv2", "Bot WhatsApp"],
    image: "assets/projects/metar-synop.svg",
    demoUrl: "projects/metar-synop.html",
    sourceUrl: "#",
    featured: true,
    sections: [
      {
        title: "BMKGSoft Merah",
        paragraphs: [
          "Seringnya keterlambatan pengiriman METAR, SYNOP dan TAFOR memunculkan ide untuk menyediakan monitoring di grup WhatsApp Tim Observasi dan PC Observasi.",
          "Bot WhatsApp secara rutin mengirimkan status pengiriman METAR, SYNOP dan TAFOR dari BMKGSoftv2, termasuk status dan menit pengirimannya. Ketika laporan belum terkirim, sistem memberikan peringatan melalui WhatsApp dan memblokir akses PC Observasi sampai laporan dikirim ke BMKGSoftv2."
        ]
      },
      {
        title: "Dukungan Koordinasi OMC",
        paragraphs: [
          "Karena monitoring sudah terhubung dengan WhatsApp, sistem juga dimanfaatkan untuk menunjang OMC dengan mengirimkan METAR secara periodik ke grup koordinasi OMC."
        ]
      }
    ]
  },
  {
    id: "auto-sosmed",
    title: "Auto Sosmed Metamorph",
    category: "Media Sosial / Otomatisasi",
    summary: "Otomatisasi unggahan Instagram melalui web yang menghubungkan MeteoFactory, Google Drive, dan Meta API.",
    description: "Mengurangi pekerjaan unggah konten UPT melalui web yang user-friendly dan fleksibel untuk menambahkan jenis konten Instagram.",
    technologies: ["MeteoFactory", "Google Drive", "Meta API", "Instagram"],
    image: "assets/projects/auto-sosmed.svg",
    demoUrl: "projects/auto-sosmed.html",
    sourceUrl: "#",
    featured: true,
    sections: [
      {
        title: "Kebutuhan Publikasi UPT",
        paragraphs: [
          "Padatnya konten yang harus diunggah oleh UPT memberikan ide untuk membuat otomatisasi unggahan konten Instagram."
        ]
      },
      {
        title: "Integrasi dan Fleksibilitas Konten",
        paragraphs: [
          "MeteoFactory dan Google Drive dihubungkan ke Meta API menggunakan web server. Melalui web yang user-friendly, unggahan konten Instagram dapat dilakukan secara otomatis, dengan fleksibilitas untuk menambahkan jenis konten."
        ]
      }
    ]
  },
  {
    id: "awos-aws",
    title: "Monitoring AWOS & AWS",
    category: "Observasi / Layanan Penerbangan",
    summary: "Dashboard adaptif untuk display AWOS Kaltim dan Kalsel serta monitoring AWS Kaltim, sesuai kebutuhan AirNav dan teknisi.",
    description: "Menjawab permintaan AirNav dengan tampilan adaptif AWOS di Kalimantan Timur dan Kalimantan Selatan, sekaligus AWS Kalimantan Timur untuk monitoring teknisi.",
    technologies: ["AWOS", "AWS", "Monitoring", "Dashboard Adaptif"],
    image: "assets/projects/awos-aws.svg",
    demoUrl: "projects/awos-aws.html",
    sourceUrl: "#",
    featured: false,
    sections: [
      {
        title: "Dashboard Adaptif",
        paragraphs: [
          "AirNav meminta adanya layanan display AWOS di wilayah Kalimantan Timur dan Kalimantan Selatan. Dari permintaan tersebut, dikembangkan dashboard adaptif yang dapat menampilkan data AWOS di kedua wilayah."
        ]
      },
      {
        title: "Monitoring untuk Teknisi",
        paragraphs: [
          "Dashboard juga menampilkan AWS di wilayah Kalimantan Timur agar teknisi dapat memantau AWS dan AWOS sekaligus, sambil memenuhi kebutuhan layanan yang diminta AirNav."
        ]
      }
    ]
  },
  {
    id: "web-bmkg-kaltim",
    title: "Web BMKG Kaltim & Sistem Pelayanan Data",
    category: "Web / Pelayanan Data",
    summary: "Pengembangan kaltim.bmkg.go.id dengan memanfaatkan VPS, domain, dan integrasi data API BMKG untuk website UPT BMKG Kaltim.",
    description: "Penugasan pengembangan website UPT BMKG Kaltim untuk memanfaatkan kembali VPS dan domain yang tersedia, dengan menggabungkan data dari API BMKG.",
    technologies: ["Website UPT", "API BMKG", "VPS"],
    image: "assets/projects/web-bmkg-kaltim.svg",
    demoUrl: "projects/web-bmkg-kaltim.html",
    sourceUrl: "#",
    featured: false,
    sections: [
      {
        title: "Pemanfaatan VPS dan Domain",
        paragraphs: [
          "Stasiun Meteorologi Kelas I Sultan Aji Muhammad Sulaiman Sepinggan saat itu belum memiliki layanan web, meskipun VPS dan domain sudah disediakan oleh Direktorat Jarkom. Domain bahkan sempat dinonaktifkan oleh pusat karena belum dimanfaatkan."
        ]
      },
      {
        title: "Pengembangan Website UPT",
        paragraphs: [
          "Dengan latar belakang kompetensi di bidang web, saya diberi tugas oleh Ketua Tim Teknisi untuk membuat website UPT BMKG Kaltim. Website kaltim.bmkg.go.id dikembangkan dengan menggabungkan data dari API BMKG."
        ]
      }
    ]
  },
  {
    id: "whatsapp-ai-agent",
    title: "WhatsApp AI Agent",
    category: "AI Agent",
    summary: "Perluasan ATMOS Agent untuk mendukung pengembangan kolaboratif Tim Inovasi METAMORPH lintas perwakilan tim.",
    description: "Berawal dari agent pendamping WRF-WEB, penggunaannya berkembang untuk pengembangan bersama Tim Inovasi METAMORPH di Stasiun Meteorologi Sepinggan Balikpapan.",
    technologies: ["WhatsApp", "AI Agent", "ATMOS", "METAMORPH"],
    image: "assets/projects/whatsapp-ai-agent.svg",
    demoUrl: "projects/whatsapp-ai-agent.html",
    sourceUrl: "#",
    featured: false,
    sections: [
      {
        title: "Potensi ATMOS Agent",
        paragraphs: [
          "Awalnya, ATMOS Agent berfokus untuk mengontrol, memberikan saran, dan membantu pengembangan WRF-WEB. Seiring waktu, penggunaannya menjadi lebih luas setelah terbentuknya Tim Inovasi METAMORPH di Stasiun Meteorologi Kelas I Sultan Aji Muhammad Sulaiman Sepinggan Balikpapan."
        ]
      },
      {
        title: "Pengembangan Bersama METAMORPH",
        paragraphs: [
          "Agent tidak lagi hanya digunakan untuk ATMOS, tetapi juga untuk pengembangan bersama Tim METAMORPH yang beranggotakan perwakilan dari tiap tim di Stasiun Meteorologi Kelas I Sultan Aji Muhammad Sulaiman Sepinggan Balikpapan."
        ]
      }
    ]
  }
];
