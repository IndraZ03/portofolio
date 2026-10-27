/**
 * ATMOS / WRF-WEB Pipeline Timeline Animation Controller
 * Horizontal GSAP ScrollTrigger Scrubbing & SVG Path Drawing
 */

document.addEventListener("DOMContentLoaded", () => {
  // Image modal works independently of the timeline animation libraries.
  const imageTriggers = document.querySelectorAll(".card-image-trigger");
  const imageModal = document.getElementById("partner-image-modal");
  if (imageTriggers.length && imageModal) {
    const closeButton = imageModal.querySelector(".image-modal-close");
    const modalImage = imageModal.querySelector("img");
    const galleryNav = imageModal.querySelector(".modal-gallery-nav");
    const previousButton = imageModal.querySelector(".modal-nav-prev");
    const nextButton = imageModal.querySelector(".modal-nav-next");
    const counter = imageModal.querySelector(".modal-nav-counter");
    let previousOverflow;
    let gallery = [];
    let imageIndex = 0;

    const showImage = (index) => {
      imageIndex = (index + gallery.length) % gallery.length;
      const image = gallery[imageIndex];
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      imageModal.setAttribute("aria-label", image.alt);
      if (counter) counter.textContent = `${imageIndex + 1} / ${gallery.length}`;
    };

    imageTriggers.forEach((trigger) => {
      let previewIndex = 0;
      if (trigger.classList.contains("card-image-slideshow") && trigger.dataset.gallery) {
        const images = JSON.parse(trigger.dataset.gallery);
        const firstSlide = trigger.querySelector("img");
        firstSlide.classList.add("slideshow-slide", "active");
        const slides = [firstSlide];
        images.slice(1).forEach((image) => {
          const slide = document.createElement("img");
          slide.src = image.src;
          slide.alt = image.alt;
          slide.className = "slideshow-slide";
          slide.setAttribute("aria-hidden", "true");
          trigger.insertBefore(slide, trigger.querySelector(".card-image-hint"));
          slides.push(slide);
        });

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        window.setInterval(() => {
          if (document.hidden || imageModal.open || reducedMotion.matches) return;
          slides[previewIndex].classList.remove("active");
          slides[previewIndex].setAttribute("aria-hidden", "true");
          previewIndex = (previewIndex + 1) % slides.length;
          slides[previewIndex].classList.add("active");
          slides[previewIndex].removeAttribute("aria-hidden");
        }, 3500);
      }

      trigger.addEventListener("click", () => {
        if (imageModal.open) return;
        const composite = trigger.querySelector("[data-composite]");
        const previousComposite = imageModal.querySelector("[data-composite]");
        if (previousComposite) previousComposite.remove();
        modalImage.hidden = Boolean(composite);
        if (composite) {
          gallery = [];
          const modalComposite = composite.cloneNode(true);
          modalImage.after(modalComposite);
          imageModal.setAttribute("aria-label", composite.getAttribute("aria-label"));
        } else {
          const activeSlide = trigger.querySelector(".slideshow-slide.active");
          const image = activeSlide || trigger.querySelector("img");
          gallery = trigger.dataset.gallery
            ? JSON.parse(trigger.dataset.gallery)
            : [{ src: image.src, alt: image.alt }];
          showImage(previewIndex);
        }
        if (galleryNav) galleryNav.hidden = gallery.length < 2;
        previousOverflow = document.body.style.overflow;
        imageModal.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    if (previousButton && nextButton) {
      previousButton.addEventListener("click", () => showImage(imageIndex - 1));
      nextButton.addEventListener("click", () => showImage(imageIndex + 1));
      imageModal.addEventListener("keydown", (event) => {
        if (gallery.length < 2) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          showImage(imageIndex + (event.key === "ArrowRight" ? 1 : -1));
        }
      });
    }

    closeButton.addEventListener("click", () => imageModal.close());
    imageModal.addEventListener("click", (event) => {
      if (event.target !== imageModal) return;
      const bounds = imageModal.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        imageModal.close();
      }
    });
    imageModal.addEventListener("close", () => {
      document.body.style.overflow = previousOverflow;
    });
  }

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP / ScrollTrigger not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Mobile Drawer Toggle
  const toggleBtn = document.querySelector(".mobile-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isOpen));
      drawer.classList.toggle("open", !isOpen);
      drawer.setAttribute("aria-hidden", String(isOpen));
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });
  }

  // Refresh ScrollTrigger once fully loaded to ensure precise layout measurements
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  const canvas = document.querySelector(".canvas");
  const wrapper = document.querySelector(".scroll-wrapper");
  const instruction = document.querySelector(".scroll-instruction");

  if (!canvas || !wrapper) return;

  // Active fallback wheel listener for pinned containers on Windows browsers
  wrapper.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > 0.5) {
      window.scrollBy({ top: e.deltaY, behavior: "auto" });
    }
  }, { passive: true });

  // Compute scroll horizontal distance dynamically
  const getScrollMax = () => canvas.scrollWidth - window.innerWidth + 160;

  // 1. Horizontal Scroll Scrubbing
  const horizontalTween = gsap.to(canvas, {
    x: () => -getScrollMax(),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      pin: true,
      anticipatePin: 1,
      scrub: 1.2,
      start: "top top",
      end: () => "+=" + getScrollMax(),
      invalidateOnRefresh: true
    }
  });

  // 2. Hide scroll instruction when user begins scrolling
  if (instruction) {
    gsap.to(instruction, {
      opacity: 0,
      y: 20,
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "top -150",
        scrub: true
      }
    });
  }

  // Keep the continuous connector visible throughout horizontal scrolling.

  // 3. Staggered Pop-In for Nodes and Flow Cards
  const revealElements = document.querySelectorAll(".gs-reveal");
  revealElements.forEach((el) => {
    gsap.from(el, {
      scale: 0.6,
      opacity: 0,
      duration: 0.7,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: el,
        containerAnimation: horizontalTween,
        start: "left right-=160",
        toggleActions: "play none none reverse"
      }
    });
  });
});
