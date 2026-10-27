/**
 * Auto-Sosmed Interactive System Architecture Controller
 * Layer filtering, node inspection, keyboard navigation, and scroll observation
 */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".sosmed-architecture");
  if (!section) return;

  const nodes = Array.from(section.querySelectorAll(".arch-node"));
  const layerBtns = Array.from(section.querySelectorAll(".arch-layer-btn"));
  const zones = Array.from(section.querySelectorAll(".arch-zone"));
  const inspectorTitle = section.querySelector(".arch-inspector-title");
  const inspectorTag = section.querySelector(".arch-inspector-tag");
  const inspectorDesc = section.querySelector(".arch-inspector-desc");
  const inspectorConns = section.querySelector(".arch-inspector-connections");
  const resetBtn = section.querySelector(".arch-inspector-reset");

  // Architecture Nodes Dictionary
  const nodeData = {
    dashboard: {
      name: "Operator Dashboard",
      layer: "control",
      type: "Next.js + React UI",
      desc: "Antarmuka berbasis web untuk mengonfigurasi saluran, memantau antrean event, menginspeksi log, dan mengelola kredensial akun.",
      inputs: "Input operator / browser",
      outputs: "Next.js API Handlers"
    },
    api: {
      name: "API & Service Layer",
      layer: "control",
      type: "Route Handlers & Domain Services",
      desc: "Menyediakan endpoint internal untuk validasi konfigurasi, manajemen sesi pengguna, dan abstraksi query database.",
      inputs: "Dashboard HTTP requests",
      outputs: "PostgreSQL Database"
    },
    postgres: {
      name: "PostgreSQL Database",
      layer: "state",
      type: "Prisma ORM State Storage",
      desc: "Menyimpan data saluran, antrean event dengan status (SCHEDULED, PROCESSING, dll.), riwayat audit, dan log publikasi.",
      inputs: "API Services & Background Workers",
      outputs: "Publishing Worker Schedule Poller"
    },
    storage: {
      name: "Local Media Storage",
      layer: "state",
      type: "Filesystem Directory",
      desc: "Direktori fisik penyimpan berkas gambar dan video yang telah lolos validasi. Database hanya menyimpan metadata dan path.",
      inputs: "IMAP Worker & Folder Poller",
      outputs: "Publishing Worker media fetch"
    },
    imap: {
      name: "IMAP Email Worker",
      layer: "intake",
      type: "Background Polling Process",
      desc: "Melakukan polling periodik ke server email IMAP, memfilter subjek dan nama lampiran, lalu menduplikasi berkas valid ke storage.",
      inputs: "Server Email IMAP",
      outputs: "PostgreSQL (Event) & Local Storage (Media)"
    },
    drive: {
      name: "Google Drive Desktop",
      layer: "intake",
      type: "Client OS Background Sync",
      desc: "Aplikasi desktop resmi yang melakukan sinkronisasi dua arah antara cloud Google Drive dan folder lokal Windows.",
      inputs: "Google Drive Cloud Storage",
      outputs: "Folder Lokal Filesystem"
    },
    folder: {
      name: "Local Folder Poller",
      layer: "intake",
      type: "Filesystem Monitoring Worker",
      desc: "Memindai folder lokal hasil sinkronisasi Drive Desktop, memeriksa ukuran dan stabilitas berkas, lalu membuat antrean event baru.",
      inputs: "Folder Lokal Filesystem",
      outputs: "PostgreSQL (Event) & Local Storage (Media)"
    },
    publisher: {
      name: "Instagram Publishing Worker",
      layer: "publishing",
      type: "Scheduler & Delivery Daemon",
      desc: "Mengambil event SCHEDULED yang jatuh tempo, memvalidasi kuota slot harian, memproses media via FFmpeg, dan mengirim ke provider.",
      inputs: "PostgreSQL Queue & Local Media",
      outputs: "Meta Graph API / Internal Engine / Logs"
    },
    meta: {
      name: "Meta Graph API",
      layer: "publishing",
      type: "Jalur Utama (Official Provider)",
      desc: "Endpoint resmi Instagram Graph API untuk pembuatan media container (single, carousel, reels) dan eksekusi publikasi posting.",
      inputs: "Publishing Worker payload",
      outputs: "Akun Instagram Publik"
    },
    internal: {
      name: "Internal Python Engine",
      layer: "publishing",
      type: "Jalur Alternatif (Session/Cookie)",
      desc: "Mesin otomasi cadangan berbasis cookie session untuk skenario khusus bila API resmi menghadapi limitasi sementara.",
      inputs: "Publishing Worker trigger",
      outputs: "Akun Instagram Publik"
    },
    green: {
      name: "GREEN-API Service",
      layer: "feedback",
      type: "WhatsApp Notification Gateway",
      desc: "Layanan perantara untuk mengirimkan ringkasan status publikasi (sukses atau gagal) secara instan ke grup WhatsApp pengelola.",
      inputs: "Publishing Worker event outcome",
      outputs: "Grup WhatsApp Tim Metamorph"
    },
    logs: {
      name: "Audit & Runtime Logs",
      layer: "feedback",
      type: "Database & File Observability",
      desc: "Merekam jejak audit eksekusi, respons payload dari Meta, status kegagalan parsial, dan log polling untuk kebutuhan debugging.",
      inputs: "Seluruh Workers & API",
      outputs: "Dashboard Inspector & Log Viewer"
    }
  };

  let selectedId = null;
  let activeLayer = "all";

  const renderInspector = (id) => {
    const data = nodeData[id];
    if (!data) return;

    inspectorTitle.textContent = data.name;
    inspectorTag.textContent = `${data.layer.toUpperCase()} · ${data.type}`;
    inspectorDesc.textContent = data.desc;
    inspectorConns.innerHTML = `
      <span><strong>Input:</strong> ${data.inputs}</span>
      <span>•</span>
      <span><strong>Output:</strong> ${data.outputs}</span>
    `;
    if (resetBtn) resetBtn.hidden = false;
  };

  const resetInspector = () => {
    selectedId = null;
    nodes.forEach(n => n.classList.remove("selected"));
    inspectorTitle.textContent = "Pilih Komponen Arsitektur";
    inspectorTag.textContent = "SYSTEM OVERVIEW";
    inspectorDesc.textContent = "Klik atau pilih komponen arsitektur pada diagram di atas untuk melihat peran teknis, input, dan output aliran datanya.";
    inspectorConns.innerHTML = "<span>Klik node mana pun untuk mengunci detail</span>";
    if (resetBtn) resetBtn.hidden = true;
    applyLayerFilter(activeLayer);
  };

  const applyLayerFilter = (layer) => {
    activeLayer = layer;
    layerBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.layer === layer);
    });

    nodes.forEach(node => {
      const nodeLayer = node.dataset.layer;
      const match = layer === "all" || nodeLayer === layer;
      node.classList.toggle("dimmed", !match);
      node.classList.toggle("highlighted", match && layer !== "all");
    });
  };

  // Node Click handler
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      const id = node.dataset.id;
      if (selectedId === id) {
        resetInspector();
      } else {
        selectedId = id;
        nodes.forEach(n => n.classList.remove("selected", "dimmed"));
        node.classList.add("selected");
        renderInspector(id);
      }
    });

    node.addEventListener("mouseenter", () => {
      if (!selectedId) {
        renderInspector(node.dataset.id);
      }
    });

    node.addEventListener("mouseleave", () => {
      if (!selectedId) {
        resetInspector();
      }
    });
  });

  // Layer filter button clicks
  layerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedId = null;
      nodes.forEach(n => n.classList.remove("selected"));
      applyLayerFilter(btn.dataset.layer);
      resetInspector();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", resetInspector);
  }

  // Scroll-based layer auto-focus (Observer)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !selectedId && activeLayer === "all") {
          // Soft highlight on enter
          nodes.slice(0, 4).forEach(n => n.classList.add("highlighted"));
          setTimeout(() => {
            nodes.forEach(n => n.classList.remove("highlighted"));
          }, 1200);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }
});
