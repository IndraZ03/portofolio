document.addEventListener("DOMContentLoaded", () => {
  const workflow = document.querySelector(".atmos-workflow");
  if (!workflow || !window.gsap || !window.ScrollTrigger) return;

  const list = workflow.querySelector(".workflow-steps");
  const steps = Array.from(list.querySelectorAll(".workflow-step"));
  const nodes = steps.map((step) => step.querySelector(".workflow-node"));
  const statuses = steps.map((step) => step.querySelector(".workflow-step-status"));
  const labels = statuses.map((status) => status.textContent);
  const panel = workflow.querySelector(".workflow-panel");
  const panelLabel = panel.querySelector(".workflow-panel-label");
  const panelTitle = panel.querySelector(".workflow-panel-title");
  const panelBody = panel.querySelector(".workflow-panel-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stateLabels = { completed: "Selesai", active: "Aktif", upcoming: "Berikutnya" };

  let positions = [];
  let activeIndex = -1;
  let scrollTrigger;
  let resizeObserver;
  let refreshFrame = 0;
  let mounted = false;

  const measure = () => {
    const top = list.getBoundingClientRect().top;
    positions = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top - top + rect.height / 2;
    });
    list.style.setProperty("--workflow-line-top", `${positions[0]}px`);
    list.style.setProperty("--workflow-line-height", `${positions.at(-1) - positions[0]}px`);
  };

  const render = (progress) => {
    workflow.style.setProperty("--flow-progress", progress.toFixed(4));
    const focus = positions[0] + progress * (positions.at(-1) - positions[0]);
    let nextIndex = 0;
    positions.forEach((position, index) => {
      if (focus >= position - 0.5) nextIndex = index;
    });
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;

    steps.forEach((step, index) => {
      const state = index < activeIndex ? "completed" : index === activeIndex ? "active" : "upcoming";
      step.dataset.state = state;
      statuses[index].textContent = `${labels[index]} · ${stateLabels[state]}`;
      if (state === "active") step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });

    panelLabel.textContent = labels[activeIndex];
    panelTitle.textContent = steps[activeIndex].querySelector("h3").textContent;
    panelBody.replaceChildren(steps[activeIndex].querySelector(".workflow-visual").cloneNode(true));
    gsap.killTweensOf(panelBody);
    if (!reducedMotion.matches && panel.getClientRects().length) {
      gsap.fromTo(panelBody, { opacity: 0.5 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    } else {
      panelBody.style.opacity = "1";
    }
  };

  const scheduleRefresh = () => {
    if (!mounted || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      ScrollTrigger.refresh();
    });
  };

  const mount = () => {
    if (mounted) return;
    mounted = true;
    activeIndex = -1;
    workflow.classList.add("is-enhanced");
    measure();
    scrollTrigger = ScrollTrigger.create({
      trigger: list,
      start: () => `${positions[0]}px 45%`,
      end: () => `${positions.at(-1)}px 45%`,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onRefresh: (self) => render(self.progress),
      onUpdate: (self) => render(self.progress)
    });
    render(scrollTrigger.progress);
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(scheduleRefresh);
      resizeObserver.observe(list);
    }
    if (document.fonts) document.fonts.ready.then(scheduleRefresh);
    window.addEventListener("load", scheduleRefresh, { once: true });
  };

  const unmount = () => {
    mounted = false;
    if (scrollTrigger) scrollTrigger.kill();
    if (resizeObserver) resizeObserver.disconnect();
    cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    gsap.killTweensOf(panelBody);
    window.removeEventListener("load", scheduleRefresh);
    workflow.classList.remove("is-enhanced");
    steps.forEach((step, index) => {
      step.removeAttribute("data-state");
      step.removeAttribute("aria-current");
      statuses[index].textContent = labels[index];
    });
  };

  window.addEventListener("pagehide", unmount);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) mount();
  });
  mount();
});
