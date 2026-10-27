/**
 * 3D Fibonacci Sphere Gallery Controller
 * Pure Vanilla JS + GSAP ScrollTrigger
 * Computes exact 3D coordinates and camera projection
 */

export class SphereGallery {
  constructor({ container, stage, panel, counterEl, projects, onSelect }) {
    this.container = container;
    this.stage = stage;
    this.panel = panel;
    this.counterEl = counterEl;
    this.projects = projects;
    this.onSelect = onSelect;

    this.cards = [];
    this.points = [];
    this.activeCardIndex = -1;
    this.radius = 360;
    this.totalPoints = this.calculateTotalPoints();

    this.currentRotX = 0;
    this.currentRotY = 0;

    this.timeline = null;
    this.scrollTrigger = null;
    this.resizeHandler = this.onResize.bind(this);
    this.wheelHandler = this.onWheel.bind(this);

    this.init();
  }

  init() {
    if (!this.container || !this.stage) return;

    this.calculateRadius();
    this.buildCards();
    this.positionCards();

    if (window.gsap && window.ScrollTrigger) {
      this.initScrollTrigger();
    } else {
      // Set initial view
      this.updateStageRotation(10, 25);
    }

    window.addEventListener("resize", this.resizeHandler, { passive: true });

    const sceneEl = this.container.closest(".projects-sticky-scene") || this.container;
    sceneEl.addEventListener("wheel", this.wheelHandler, { passive: true });
  }

  onWheel(e) {
    // Windows Chromium inside 100vh overflow:hidden sticky container may swallow wheel ticks
    if (Math.abs(e.deltaY) > 0.5) {
      window.scrollBy({ top: e.deltaY, behavior: "auto" });
    }
  }

  calculateTotalPoints() {
    return Math.max(16, this.projects.length * 2);
  }

  calculateRadius() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const minDim = Math.min(w, h);

    if (w <= 480) {
      this.radius = Math.max(140, minDim * 0.35);
    } else if (w <= 768) {
      this.radius = Math.max(180, minDim * 0.36);
    } else if (w <= 1024) {
      this.radius = Math.max(220, minDim * 0.35);
    } else {
      this.radius = Math.max(280, Math.min(390, minDim * 0.35));
    }
  }

  buildCards() {
    this.stage.innerHTML = "";
    this.cards = [];
    this.points = [];

    const n = this.totalPoints;
    const projLen = this.projects.length;

    for (let i = 0; i < n; i++) {
      // Distribute along Fibonacci sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const project = this.projects[i % projLen];

      const card = document.createElement("button");
      card.type = "button";
      card.className = "sphere-card";
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Project: ${project.title}${project.year ? ` (${project.year})` : ""}`);
      card.dataset.index = String(i);
      card.dataset.projectId = project.id;

      card.innerHTML = `
        <div class="sphere-card-inner">
          <img class="sphere-card-img" src="${project.image}" alt="${project.title} thumbnail" loading="lazy" />
          <div class="sphere-card-overlay">
            <span class="sphere-card-cat">${project.category}</span>
            <span class="sphere-card-title">${project.title}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => this.handleCardClick(i));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleCardClick(i);
        }
      });

      this.stage.appendChild(card);
      this.cards.push(card);

      // Store initial spherical coords
      this.points.push({
        index: i,
        phi,
        theta,
        project,
        x: 0,
        y: 0,
        z: 0,
        rotX: 0,
        rotY: 0
      });
    }
  }

  positionCards() {
    const r = this.radius;

    for (let i = 0; i < this.points.length; i++) {
      const pt = this.points[i];
      const sinPhi = Math.sin(pt.phi);
      const cosPhi = Math.cos(pt.phi);
      const sinTheta = Math.sin(pt.theta);
      const cosTheta = Math.cos(pt.theta);

      // 3D coordinates on sphere
      pt.x = r * sinPhi * cosTheta;
      pt.y = r * cosPhi;
      pt.z = r * sinPhi * sinTheta;

      // Tangent angles so card faces outward
      pt.rotY = (Math.atan2(pt.x, pt.z) * 180) / Math.PI;
      pt.rotX = (-Math.asin(pt.y / r) * 180) / Math.PI;

      const card = this.cards[i];
      // Valid CSS 3D transform syntax
      card.style.transform = `translate3d(${pt.x.toFixed(2)}px, ${pt.y.toFixed(2)}px, ${pt.z.toFixed(2)}px) rotateY(${pt.rotY.toFixed(2)}deg) rotateX(${pt.rotX.toFixed(2)}deg)`;
    }
  }

  initScrollTrigger() {
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const targetSection = document.getElementById("projects");
    if (!targetSection) return;

    const rotState = {
      rotX: 12,
      rotY: 0
    };

    // Kill prior trigger if any
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    this.scrollTrigger = window.ScrollTrigger.create({
      trigger: targetSection,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        // Continuous scrub: rotate Y through 480 degrees and subtle oscillation on X
        const p = self.progress;
        const currentY = p * 480;
        const currentX = 12 + Math.sin(p * Math.PI * 2) * 14;

        this.updateStageRotation(currentX, currentY);
      }
    });

    // Initial projection
    this.updateStageRotation(rotState.rotX, rotState.rotY);
  }

  updateStageRotation(rotX, rotY) {
    this.currentRotX = rotX;
    this.currentRotY = rotY;

    // Apply rotation only to stage container
    this.stage.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

    // Calculate camera projection
    this.syncActiveCard(rotX, rotY);
  }

  syncActiveCard(rotXDeg, rotYDeg) {
    // Convert stage rotations to radians
    const radY = (rotYDeg * Math.PI) / 180;
    const radX = (rotXDeg * Math.PI) / 180;

    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    let maxZ = -Infinity;
    let closestIndex = 0;

    const depthThreshold = this.radius * 0.15;

    for (let i = 0; i < this.points.length; i++) {
      const pt = this.points[i];

      // Rotate around Y
      const x1 = pt.x * cosY + pt.z * sinY;
      const z1 = -pt.x * sinY + pt.z * cosY;
      const y1 = pt.y;

      // Rotate around X
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const card = this.cards[i];

      // Front vs Back visibility/dimming
      if (z2 < depthThreshold) {
        card.classList.add("is-dimmed");
        card.classList.remove("is-active");
      } else {
        card.classList.remove("is-dimmed");
      }

      if (z2 > maxZ) {
        maxZ = z2;
        closestIndex = i;
      }
    }

    if (closestIndex !== this.activeCardIndex) {
      if (this.cards[this.activeCardIndex]) {
        this.cards[this.activeCardIndex].classList.remove("is-active");
      }

      this.activeCardIndex = closestIndex;
      const activeCard = this.cards[closestIndex];
      if (activeCard) {
        activeCard.classList.remove("is-dimmed");
        activeCard.classList.add("is-active");
      }

      const activeProject = this.points[closestIndex].project;
      this.updateDetailPanel(activeProject, closestIndex);
    }
  }

  updateDetailPanel(project, index) {
    if (!this.panel || !project) return;

    const uniqueIndex = (index % this.projects.length) + 1;
    const totalCount = this.projects.length;

    if (this.counterEl) {
      this.counterEl.textContent = `${String(uniqueIndex).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;
    }

    const titleEl = this.panel.querySelector(".detail-title");
    const catEl = this.panel.querySelector(".detail-category");
    const yearEl = this.panel.querySelector(".detail-year");
    const summaryEl = this.panel.querySelector(".detail-summary");
    const viewBtn = this.panel.querySelector(".btn-view-project");

    if (titleEl) titleEl.textContent = project.title;
    if (catEl) catEl.textContent = project.category;
    if (yearEl) {
      yearEl.textContent = project.year || "";
      yearEl.hidden = !project.year;
    }
    if (summaryEl) summaryEl.textContent = project.description || project.summary;


    if (viewBtn) {
      if (project.demoUrl && project.demoUrl !== "#") {
        viewBtn.href = project.demoUrl;
        viewBtn.removeAttribute("aria-disabled");
        viewBtn.removeAttribute("title");
        // Internal relative links open in same tab for seamless portfolio flow
        const isExternal = /^https?:\/\//i.test(project.demoUrl);
        if (isExternal) {
          viewBtn.target = "_blank";
          viewBtn.rel = "noopener noreferrer";
        } else {
          viewBtn.removeAttribute("target");
          viewBtn.removeAttribute("rel");
        }
      } else {
        viewBtn.href = "#";
        viewBtn.setAttribute("aria-disabled", "true");
        viewBtn.title = "Detail proyek belum tersedia";
      }
    }

    if (typeof this.onSelect === "function") {
      this.onSelect(project);
    }
  }

  handleCardClick(index) {
    const pt = this.points[index];
    if (!pt) return;

    // Bring this point directly toward the camera
    // Target normal: pt.rotY and pt.rotX should face (0, 0, 1)
    const targetY = -pt.rotY;
    const targetX = -pt.rotX;

    if (window.gsap) {
      window.gsap.to(this, {
        currentRotX: targetX,
        currentRotY: targetY,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          this.updateStageRotation(this.currentRotX, this.currentRotY);
        }
      });
    } else {
      this.updateStageRotation(targetX, targetY);
    }
  }

  onResize() {
    const newTotalPoints = this.calculateTotalPoints();
    const pointsChanged = newTotalPoints !== this.totalPoints;
    this.totalPoints = newTotalPoints;

    this.calculateRadius();

    if (pointsChanged) {
      this.buildCards();
    }

    this.positionCards();
    this.updateStageRotation(this.currentRotX, this.currentRotY);
    if (this.scrollTrigger) {
      this.scrollTrigger.refresh();
    }
  }

  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    const sceneEl = this.container?.closest(".projects-sticky-scene") || this.container;
    if (sceneEl) {
      sceneEl.removeEventListener("wheel", this.wheelHandler);
    }
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    this.stage.innerHTML = "";
  }
}
