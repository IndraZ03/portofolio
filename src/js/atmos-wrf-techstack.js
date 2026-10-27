/**
 * ATMOS / WRF-WEB Technology Stack Interactive Filter
 */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".atmos-techstack");
  if (!section) return;

  const navBtns = Array.from(section.querySelectorAll(".stack-nav-btn"));
  const groups = Array.from(section.querySelectorAll(".stack-group"));

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetGroup = btn.dataset.target;

      navBtns.forEach(b => b.classList.toggle("active", b === btn));

      if (targetGroup === "all") {
        groups.forEach(g => {
          g.hidden = false;
          g.classList.remove("dimmed");
        });
      } else {
        groups.forEach(g => {
          const match = g.id === targetGroup;
          g.hidden = !match;
          g.classList.remove("dimmed");
        });
      }
    });
  });
});
