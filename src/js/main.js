/**
 * Main application entrypoint
 * Imports modular data & controllers
 */
import { siteConfig } from "../data/site.js";
import { projectsData } from "../data/projects.js";
import { testimonialsData } from "../data/testimonials.js";
import { SphereGallery } from "./sphere.js";
import { initNavigation } from "./navigation.js";
import { initHorizonStory } from "./story.js";

document.addEventListener("DOMContentLoaded", () => {
  renderDynamicContent();
  renderAccessibleProjects();
  renderTestimonials();
  initNavigation();
  initSphereGallery();
  initHorizonStory();
  initContactActions();

  // Ensure GSAP ScrollTrigger calculates exact DOM heights across Windows & Mac
  window.addEventListener("load", () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  });
});

function renderDynamicContent() {
  // Populate bio paragraphs
  const bioContainer = document.getElementById("about-bio-container");
  if (bioContainer && siteConfig.about?.bio) {
    bioContainer.innerHTML = siteConfig.about.bio
      .map((p) => `<p>${p}</p>`)
      .join("");
  }

  // Populate stats
  const statsContainer = document.getElementById("about-stats-container");
  if (statsContainer && siteConfig.about?.stats) {
    statsContainer.innerHTML = siteConfig.about.stats
      .map(
        (s) => `
        <div class="stat-item">
          <span class="stat-label">${s.label}</span>
          <span class="stat-value">${s.value}</span>
        </div>
      `
      )
      .join("");
  }

  // Populate skills categories
  const skillsContainer = document.getElementById("skills-category-container");
  if (skillsContainer && siteConfig.about?.skills) {
    skillsContainer.innerHTML = siteConfig.about.skills
      .map(
        (cat) => `
        <div class="skill-category-card">
          <h4 class="skill-category-title">${cat.category}</h4>
          <ul class="skill-item-list">
            ${cat.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `
      )
      .join("");
  }

  // Populate social pills
  const socialsContainer = document.getElementById("socials-container");
  if (socialsContainer && siteConfig.contact?.socials) {
    socialsContainer.innerHTML = siteConfig.contact.socials
      .map(
        (soc) => `
        <a class="social-pill" href="${soc.url}" target="_blank" rel="noopener noreferrer">
          ${soc.name}
        </a>
      `
      )
      .join("");
  }
}

function renderAccessibleProjects() {
  const grid = document.querySelector(".projects-accessible-grid");
  if (!grid) return;

  grid.innerHTML = projectsData
    .map(
      (p) => `
      <article class="accessible-project-card">
        <div class="accessible-card-media">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="accessible-card-body">
          <div class="detail-meta-row">
            <span class="detail-category">${p.category}</span>
            ${p.year ? `<span class="detail-year">${p.year}</span>` : ""}
          </div>
          <h3 class="detail-title" style="font-size: 1.15rem;">${p.title}</h3>
          <p class="detail-summary">${p.summary}</p>
          ${
            p.demoUrl && p.demoUrl !== "#"
              ? `<div class="detail-actions" style="margin-top: 8px;">
                  <a href="${p.demoUrl}" class="btn btn-clay btn-detail-action">
                    Lihat Proyek ↗
                  </a>
                </div>`
              : ""
          }
        </div>
      </article>
    `
    )
    .join("");
}

function renderTestimonials() {
  const container = document.getElementById("testimonials-container");
  if (!container) return;

  container.innerHTML = testimonialsData
    .map(
      (t) => `
      <blockquote class="testimonial-card">
        <div>
          <div style="margin-bottom: 12px;">
            <span class="sample-badge">${t.badge}</span>
          </div>
          <p class="testimonial-quote">${t.quote}</p>
        </div>
        <footer class="testimonial-footer">
          <div>
            <div class="testimonial-author-name">${t.author}</div>
            <div class="testimonial-author-role">${t.role} · ${t.organization}</div>
          </div>
        </footer>
      </blockquote>
    `
    )
    .join("");
}

function initSphereGallery() {
  const container = document.querySelector(".sphere-viewport");
  const stage = document.querySelector(".sphere-stage");
  const panel = document.querySelector(".project-detail-panel");
  const counterEl = document.querySelector(".scene-counter");

  if (!stage) return;

  new SphereGallery({
    container,
    stage,
    panel,
    counterEl,
    projects: projectsData
  });
}

function initContactActions() {
  const contactBtn = document.getElementById("btn-contact-action");
  if (!contactBtn) return;

  contactBtn.addEventListener("click", (e) => {
    if (siteConfig.contact.email) {
      window.location.href = `mailto:${siteConfig.contact.email}`;
    } else {
      e.preventDefault();
      // Friendly accessible feedback for placeholder state
      const originalText = contactBtn.textContent;
      contactBtn.textContent = "dwi.prasetyo@bmkg.go.id";
      setTimeout(() => {
        contactBtn.textContent = originalText;
      }, 2500);
    }
  });
}
