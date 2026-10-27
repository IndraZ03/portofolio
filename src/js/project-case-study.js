/**
 * Shared case-study interactions. Static content stays readable without JS.
 * Geometry-based workflow progress, editorial chapter index, architecture focus.
 */
document.addEventListener("DOMContentLoaded", () => {
  const cleanups = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initWorkflow = (section) => {
    if (!window.gsap || !window.ScrollTrigger || reducedMotion.matches) return;
    const list = section.querySelector(".workflow-steps");
    const steps = Array.from(list.querySelectorAll(".workflow-step"));
    const nodes = steps.map(step => step.querySelector(".workflow-node"));
    const statuses = steps.map(step => step.querySelector(".workflow-step-status"));
    const labels = statuses.map(status => status.textContent);
    const panel = section.querySelector(".workflow-panel");
    const panelTitle = panel.querySelector(".workflow-panel-title");
    const panelLabel = panel.querySelector(".workflow-panel-label");
    const panelBody = panel.querySelector(".workflow-panel-body");
    const stateLabels = { active: "Aktif", completed: "Selesai", upcoming: "Berikutnya" };
    let positions = [];
    let active = -1;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      positions = nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return rect.top - top + rect.height / 2;
      });
      list.style.setProperty("--workflow-line-top", `${positions[0]}px`);
      list.style.setProperty("--workflow-line-height", `${positions.at(-1) - positions[0]}px`);
    };
    const render = (progress) => {
      section.style.setProperty("--flow-progress", progress.toFixed(4));
      const focus = positions[0] + progress * (positions.at(-1) - positions[0]);
      let index = 0;
      positions.forEach((position, i) => { if (focus >= position - 0.5) index = i; });
      if (index === active) return;
      active = index;
      steps.forEach((step, i) => {
        const state = i < index ? "completed" : i === index ? "active" : "upcoming";
        step.dataset.state = state;
        statuses[i].textContent = `${labels[i]} · ${stateLabels[state]}`;
        if (i === index) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
      });
      panelTitle.textContent = steps[index].querySelector("h3").textContent;
      panelLabel.textContent = labels[index];
      panelBody.replaceChildren(steps[index].querySelector(".workflow-visual").cloneNode(true));
      gsap.killTweensOf(panelBody);
      panelBody.style.opacity = "1";
      if (panel.getClientRects().length) {
        gsap.fromTo(panelBody, { opacity: 0.6 }, { opacity: 1, duration: 0.2 });
      }
    };
    gsap.registerPlugin(ScrollTrigger);
    section.classList.add("is-enhanced");
    measure();
    const trigger = ScrollTrigger.create({
      trigger: list,
      start: () => `${positions[0]}px 45%`,
      end: () => `${positions.at(-1)}px 45%`,
      onRefreshInit: measure,
      onRefresh: self => render(self.progress),
      onUpdate: self => render(self.progress),
      invalidateOnRefresh: true
    });
    render(trigger.progress);
    const refresh = () => {
      if (frame || disposed) return;
      frame = requestAnimationFrame(() => { frame = 0; ScrollTrigger.refresh(); });
    };
    const observer = window.ResizeObserver ? new ResizeObserver(refresh) : null;
    observer?.observe(list);
    window.addEventListener("resize", refresh);
    document.fonts?.ready.then(refresh);
    cleanups.push(() => {
      disposed = true;
      trigger.kill();
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(frame);
      gsap.killTweensOf(panelBody);
      section.classList.remove("is-enhanced");
      steps.forEach((step, i) => {
        delete step.dataset.state;
        step.removeAttribute("aria-current");
        statuses[i].textContent = labels[i];
      });
    });
  };

  const initIndex = (section) => {
    const links = Array.from(section.querySelectorAll(".cs-index a"));
    const chapters = links.map(link => document.getElementById(link.hash.slice(1)));
    if (!chapters.length || chapters.some(chapter => !chapter)) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const focus = window.innerHeight * 0.4;
      const distances = chapters.map(chapter => {
        const rect = chapter.getBoundingClientRect();
        return rect.top <= focus && rect.bottom >= focus ? 0 : Math.min(Math.abs(rect.top - focus), Math.abs(rect.bottom - focus));
      });
      const active = distances.indexOf(Math.min(...distances));
      links.forEach((link, i) => {
        if (i === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    cleanups.push(() => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    });
  };

  const initArchitecture = (section) => {
    const nodes = Array.from(section.querySelectorAll(".cs-component"));
    const filters = Array.from(section.querySelectorAll("[data-layer-filter]"));
    const edges = Array.from(section.querySelectorAll(".cs-connections [data-from][data-to]"));
    const zones = section.querySelector(".cs-zones");
    const inspector = section.querySelector(".cs-inspector");
    const title = inspector.querySelector("h3");
    const body = inspector.querySelector(".cs-inspector-body");
    const reset = section.querySelector(".cs-reset");
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("cs-edges-canvas");
    svg.setAttribute("aria-hidden", "true");
    const markerId = `${section.id}-arrow`;
    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.id = markerId;
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("orient", "auto-start-reverse");
    const arrow = document.createElementNS(svgNS, "path");
    arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    arrow.setAttribute("fill", "currentColor");
    marker.append(arrow);
    defs.append(marker);
    svg.append(defs);
    const paths = edges.map(edge => {
      const path = document.createElementNS(svgNS, "path");
      path.classList.add("cs-edge");
      if (edge.dataset.conditional) path.classList.add("cs-edge-conditional");
      path.setAttribute("marker-end", `url(#${markerId})`);
      if (edge.dataset.bidirectional) path.setAttribute("marker-start", `url(#${markerId})`);
      svg.append(path);
      return path;
    });
    zones.prepend(svg);
    let frame = 0;
    let disposed = false;
    const measure = () => {
      frame = 0;
      const bounds = zones.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      const rects = new Map(nodes.map(node => [node.id, node.querySelector("button").getBoundingClientRect()]));
      edges.forEach((edge, i) => {
        const from = rects.get(edge.dataset.from);
        const to = rects.get(edge.dataset.to);
        if (!from || !to) return;
        let x1, y1, x2, y2, d;
        if (from.right <= to.left || to.right <= from.left) {
          const forward = from.left < to.left;
          x1 = (forward ? from.right : from.left) - bounds.left;
          x2 = (forward ? to.left : to.right) - bounds.left;
          y1 = from.top + from.height / 2 - bounds.top;
          y2 = to.top + to.height / 2 - bounds.top;
          const mid = (x1 + x2) / 2;
          d = `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
        } else {
          const forward = from.top < to.top;
          x1 = from.left + from.width / 2 - bounds.left;
          x2 = to.left + to.width / 2 - bounds.left;
          y1 = (forward ? from.bottom : from.top) - bounds.top;
          y2 = (forward ? to.top : to.bottom) - bounds.top;
          const mid = (y1 + y2) / 2;
          d = `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
        }
        paths[i].setAttribute("d", d);
      });
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(measure); };
    const update = (node, layer = "all") => {
      const layers = item => (item.dataset.layer || "").split(" ");
      nodes.forEach(item => {
        const related = node ? item === node || edges.some(edge =>
          (edge.dataset.from === node.id && edge.dataset.to === item.id) ||
          (edge.dataset.to === node.id && edge.dataset.from === item.id)) : layer === "all" || layers(item).includes(layer);
        item.classList.toggle("is-muted", !related);
        item.querySelector("button").setAttribute("aria-pressed", String(item === node));
      });
      edges.forEach((edge, i) => {
        const related = node ? edge.dataset.from === node.id || edge.dataset.to === node.id : layer === "all" || nodes.some(item =>
          layers(item).includes(layer) && (item.id === edge.dataset.from || item.id === edge.dataset.to));
        [edge, paths[i]].forEach(item => {
          item.classList.toggle("is-muted", !related);
          item.classList.toggle("is-selected", related && (Boolean(node) || layer !== "all"));
        });
      });
      title.textContent = node ? node.querySelector(".cs-node-name").textContent : layer === "all" ? "Overview" : filters.find(filter => filter.dataset.layerFilter === layer).textContent;
      if (node) body.replaceChildren(...Array.from(node.querySelector(".cs-node-detail").childNodes).map(child => child.cloneNode(true)));
      else body.textContent = "Pilih komponen untuk melihat peran, input, output, dan batas integrasinya. Daftar hubungan tetap terbaca tanpa diagram atau JavaScript.";
      filters.forEach(filter => filter.setAttribute("aria-pressed", String(!node && filter.dataset.layerFilter === layer)));
    };
    const click = event => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.matches("[data-layer-filter]")) update(null, button.dataset.layerFilter);
      else if (button === reset) update(null);
      else {
        const node = button.closest(".cs-component");
        if (node) update(node);
      }
    };
    section.classList.add("is-interactive");
    section.addEventListener("click", click);
    window.addEventListener("resize", schedule);
    const observer = window.ResizeObserver ? new ResizeObserver(schedule) : null;
    observer?.observe(zones);
    document.fonts?.ready.then(schedule);
    measure();
    update(null);
    cleanups.push(() => {
      disposed = true;
      section.removeEventListener("click", click);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      cancelAnimationFrame(frame);
      svg.remove();
      section.classList.remove("is-interactive");
    });
  };

  const mount = () => {
    document.querySelectorAll("[data-case-workflow]").forEach(initWorkflow);
    document.querySelectorAll(".cs-features, .cs-stack").forEach(initIndex);
    document.querySelectorAll(".cs-architecture").forEach(initArchitecture);
  };
  const unmount = () => { cleanups.splice(0).forEach(cleanup => cleanup()); };
  mount();
  reducedMotion.addEventListener("change", () => { unmount(); mount(); });
  window.addEventListener("pagehide", unmount);
  window.addEventListener("pageshow", event => { if (event.persisted) mount(); });
});
