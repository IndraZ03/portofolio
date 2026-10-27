/**
 * ATMOS / WRF-WEB Interactive System Architecture Controller
 * Layer filtering, node inspection, keyboard navigation
 */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".atmos-architecture");
  if (!section) return;

  const nodes = Array.from(section.querySelectorAll(".arch-node"));
  const layerBtns = Array.from(section.querySelectorAll(".arch-layer-btn"));
  const zones = Array.from(section.querySelectorAll(".arch-zone"));
  const inspectorTitle = section.querySelector(".arch-inspector-title");
  const inspectorTag = section.querySelector(".arch-inspector-tag");
  const inspectorDesc = section.querySelector(".arch-inspector-desc");
  const inspectorMetaInputs = section.querySelector(".arch-meta-inputs");
  const inspectorMetaOutputs = section.querySelector(".arch-meta-outputs");
  const resetBtn = section.querySelector(".arch-inspector-reset");

  const nodeData = {
    browser: {
      name: "Browser & Web UI",
      layer: "presentation",
      type: "Jinja2 Templates + Alpine.js + Leaflet",
      desc: "Antarmuka responsif untuk operator: Domain Wizard peta, manajemen proyek, monitor eksekusi status node, dan penjelajah NetCDF interaktif.",
      inputs: "Interaksi Pengguna / Operator",
      outputs: "FastAPI HTTP API & WebSocket Handlers"
    },
    fastapi: {
      name: "FastAPI & Uvicorn Application",
      layer: "app",
      type: "Python ASGI Web Service",
      desc: "Menyediakan endpoint RESTful API, validasi skema input Pydantic, koordinasi proyek, pengawasan status berkas, dan penyedia data.",
      inputs: "HTTP Requests & WebSocket Clients",
      outputs: "PostgreSQL, Local Filesystem, BackgroundTasks"
    },
    bgtasks: {
      name: "BackgroundTasks & Worker Threads",
      layer: "app",
      type: "FastAPI Native Async Workers",
      desc: "Menjalankan tugas berdurasi panjang seperti download dataset meteorologi dan eksekusi skrip pemodelan secara non-blocking di host lokal.",
      inputs: "FastAPI App triggers",
      outputs: "Subprocess Executables & Filesystem"
    },
    ws: {
      name: "WRF Telemetry WebSocket",
      layer: "app",
      type: "Bidirectional WebSocket Connection",
      desc: "Menghantarkan pembaruan status iterasi per time-step WRF dan cuplikan log ringan langsung ke antarmuka operator tanpa reload.",
      inputs: "Log tail watcher & Process monitor",
      outputs: "Browser Client Telemetry Feed"
    },
    postgres: {
      name: "PostgreSQL Database",
      layer: "state",
      type: "Relational Persistence & SQLAlchemy 2",
      desc: "Menyimpan catatan proyek, status unduhan, riwayat job komputasi, titik stasiun pengamatan, katalog citra satelit, dan audit log.",
      inputs: "FastAPI ORM Queries",
      outputs: "FastAPI Data Models"
    },
    filesystem: {
      name: "Local Project Filesystem",
      layer: "state",
      type: "Structured Directory Storage",
      desc: "Menyimpan konfigurasi namelist, dataset mentah GRIB, direktori eksekusi model, berkas luaran NetCDF (wrfout), dan log proses.",
      inputs: "Downloader & Compute Outputs",
      outputs: "WPS/WRF Executables & NC Viewer"
    },
    objectstorage: {
      name: "Optional Object Storage",
      layer: "state",
      type: "S3 / MinIO / Ceph (boto3)",
      desc: "Integrasi penyimpanan objek opsional untuk pengarsipan jangka panjang berkas NetCDF. Jalur eksekusi numerik tetap membutuhkan akses disk lokal.",
      inputs: "Post-Processing NetCDF Archiver",
      outputs: "Cold Storage Archive"
    },
    wps: {
      name: "WPS 4.7 Preprocessors",
      layer: "compute",
      type: "geogrid, ungrib, metgrid Binaries",
      desc: "Pra-pemrosesan data geografi wilayah kajian dan interpolasi grid meteorologi horizontal dari berkas GRIB ke format met_em intermediate.",
      inputs: "Data Topografi & GRIB Meteorologi",
      outputs: "met_em* Intermediate NetCDF"
    },
    wrfreal: {
      name: "WRF 4.8 & REAL Initialization",
      layer: "compute",
      type: "real.exe & wrf.exe (OpenMPI)",
      desc: "Inisialisasi vertikal atmosfer 3D dan integrasi persamaan numerik fluida dinamika atmosfer berbasis MPI multi-core di server host.",
      inputs: "met_em* & namelist.input",
      outputs: "wrfout* Spatio-Temporal NetCDF"
    },
    chem: {
      name: "WRF-Chem Processors",
      layer: "compute",
      type: "mozbc, MEGAN, anthro_emis (Opsional)",
      desc: "Preparasi tambahan kimia atmosfer: kondisi batas WACCM via mozbc, bioemisi MEGAN, dan emisi antropogenik sebelum integrasi numerik.",
      inputs: "WACCM Datasets & Land-Cover Biogenics",
      outputs: "wrfchemi* Chemical Boundary Files"
    },
    sources: {
      name: "Meteorology & Satellite Feeds",
      layer: "sources",
      type: "NOAA, ECMWF, Himawari, BMKG",
      desc: "Penyedia data eksternal: prediksi global GFS/FNL, ERA5 reanalysis, data satelit Himawari IR/True Color, dan citra radar CMAX.",
      inputs: "Open Data Web / FTP Endpoints",
      outputs: "Background Download Jobs"
    },
    viewer: {
      name: "NetCDF & Visual Analysis",
      layer: "sources",
      type: "NC Viewer & Meteorological Layers",
      desc: "Modul rendering produk visual: irisan vertikal atmosfer, peta curah hujan standar BMKG TP, grafik deret waktu, dan overlay radar CMAX.",
      inputs: "wrfout NetCDF & Observasi Nyata",
      outputs: "Visualisasi Peta & Laporan OMC"
    }
  };

  const defaultNode = "fastapi";

  const inspectNode = (key) => {
    const data = nodeData[key];
    if (!data) return;

    nodes.forEach(n => n.classList.toggle("selected", n.dataset.node === key));

    inspectorTitle.textContent = data.name;
    inspectorTag.textContent = `${data.layer.toUpperCase()} · ${data.type}`;
    inspectorDesc.textContent = data.desc;
    inspectorMetaInputs.textContent = data.inputs;
    inspectorMetaOutputs.textContent = data.outputs;
  };

  nodes.forEach(node => {
    node.addEventListener("click", () => inspectNode(node.dataset.node));
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      inspectNode(defaultNode);
      layerBtns.forEach(b => b.classList.toggle("active", b.dataset.layer === "all"));
      zones.forEach(z => z.classList.remove("dimmed"));
    });
  }

  layerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetLayer = btn.dataset.layer;

      layerBtns.forEach(b => b.classList.toggle("active", b === btn));

      if (targetLayer === "all") {
        zones.forEach(z => z.classList.remove("dimmed"));
      } else {
        zones.forEach(z => {
          const match = z.dataset.layer === targetLayer;
          z.classList.toggle("dimmed", !match);
        });
      }
    });
  });

  inspectNode(defaultNode);
});
