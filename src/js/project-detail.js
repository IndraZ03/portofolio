import { projectsData } from "../data/projects.js";
import { initNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  renderProjectDetail();
});

function renderProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const article = document.getElementById("project-article");
  const message = document.getElementById("project-message");

  if (!projectId) {
    message.textContent = "Proyek tidak ditemukan. Silakan kembali ke daftar proyek.";
    return;
  }

  const project = projectsData.find((item) => item.id === projectId);
  if (!project) {
    message.textContent = `Proyek "${projectId}" tidak ditemukan. Silakan kembali ke daftar proyek.`;
    return;
  }

  document.title = `${project.title} — IndraZ03`;

  const categoryEl = document.getElementById("project-category");
  const titleEl = document.getElementById("project-title");
  const summaryEl = document.getElementById("project-summary");
  const imgEl = document.getElementById("project-image");
  const sectionsEl = document.getElementById("project-sections");

  categoryEl.textContent = project.category;
  titleEl.textContent = project.title;
  summaryEl.textContent = project.description || project.summary;

  if (project.image) {
    imgEl.src = `../${project.image}`;
    imgEl.alt = `Ilustrasi untuk ${project.title}`;
  } else {
    imgEl.closest(".story-cover")?.remove();
  }

  sectionsEl.innerHTML = (project.sections || [])
    .map(
      (sec) => `
      <section class="story-section">
        <h2>${sec.title}</h2>
        ${sec.paragraphs.map((p) => `<p>${p}</p>`).join("")}
      </section>
    `
    )
    .join("");

  message.hidden = true;
  article.hidden = false;
}
