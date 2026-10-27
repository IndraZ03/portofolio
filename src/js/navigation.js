/**
 * Navigation and accessibility controller
 * Handles smooth anchor jumps, active section observer, and accessible mobile drawer
 */

export function initNavigation() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // 1. Mobile Drawer Toggle
  if (toggleBtn && drawer) {
    const openMenu = () => {
      toggleBtn.setAttribute("aria-expanded", "true");
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const firstLink = drawer.querySelector(".nav-link");
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      toggleBtn.setAttribute("aria-expanded", "false");
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      toggleBtn.focus();
    };

    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        closeMenu();
      }
    });

    // Close drawer when link clicked
    drawer.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }

  // 2. IntersectionObserver for active section highlights
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          updateActiveLink(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
  }

  function updateActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // 3. Back to top button
  const topBtn = document.querySelector(".footer-top-btn");
  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
