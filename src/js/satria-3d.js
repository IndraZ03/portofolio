document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".satria-carousel");
  const slides = [...carousel.querySelectorAll(".satria-slide")];
  const dots = [...carousel.querySelectorAll(".satria-dots button")];
  let index = 0;
  const slideStatus = document.getElementById("satria-slide-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let autoplay;
  const restartAutoplay = () => {
    clearInterval(autoplay);
    if (reducedMotion.matches) return;
    autoplay = setInterval(() => {
      if (document.hidden || document.querySelector("dialog[open]") ||
          carousel.matches(":hover") || carousel.contains(document.activeElement)) return;
      showSlide(index + 1, false);
    }, 4000);
  };
  const showSlide = (next, announce = true) => {
    index = (next + slides.length) % slides.length;
    carousel.querySelector(".satria-track").style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== index)));
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    slideStatus.setAttribute("aria-live", announce ? "polite" : "off");
    slideStatus.textContent = `Gambar ${index + 1} dari ${slides.length}`;
    if (announce) restartAutoplay();
  };
  reducedMotion.addEventListener("change", restartAutoplay);
  restartAutoplay();
  carousel.querySelector(".satria-prev").addEventListener("click", () => showSlide(index - 1));
  carousel.querySelector(".satria-next").addEventListener("click", () => showSlide(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
  carousel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    showSlide(index + (event.key === "ArrowRight" ? 1 : -1));
  });

  const dialog = document.getElementById("satria-player");
  const stage = dialog.querySelector(".satria-player-stage");
  const video = dialog.querySelector("video");
  const notice = dialog.querySelector(".satria-player-notice");
  const error = dialog.querySelector(".satria-player-error");
  const file = dialog.querySelector(".satria-player-file");
  let opener, overflow, session = 0, enteredFullscreen = false, noticeTimer;
  const message = (text) => { error.textContent = text; error.hidden = false; };
  const finish = () => {
    if (!dialog.open) return;
    session++;
    clearTimeout(noticeTimer);
    video.pause();
    if (document.fullscreenElement === stage) document.exitFullscreen().catch(() => {});
    if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) video.webkitExitFullscreen();
    dialog.close();
  };
  dialog.addEventListener("close", () => {
    session++;
    clearTimeout(noticeTimer);
    video.pause();
    video.removeAttribute("src");
    video.load();
    document.body.style.overflow = overflow;
    opener?.focus({ preventScroll: true });
    enteredFullscreen = false;
  });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); finish(); });
  dialog.querySelector(".satria-player-close").addEventListener("click", finish);
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === stage) enteredFullscreen = true;
    else if (enteredFullscreen) finish();
  });
  video.addEventListener("webkitendfullscreen", finish);
  video.addEventListener("error", () => {
    if (!dialog.open || !video.getAttribute("src")) return;
    message("Video gagal dimuat atau format tidak didukung browser. Buka file langsung untuk mencoba pemutar lain.");
    file.hidden = false;
  });
  document.querySelectorAll(".satria-preview").forEach((button) => {
    button.addEventListener("click", () => {
      if (dialog.open) return;
      opener = button;
      overflow = document.body.style.overflow;
      const current = ++session;
      enteredFullscreen = false;
      error.hidden = true;
      file.hidden = true;
      file.href = button.dataset.video;
      notice.hidden = false;
      notice.textContent = "klik ESC untuk keluar dari full screen";
      video.src = button.dataset.video;
      video.poster = button.querySelector("img").src;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      const fallback = () => {
        if (session !== current || !dialog.open) return;
        clearTimeout(noticeTimer);
        notice.hidden = false;
        notice.textContent = "Tekan ESC atau tombol × untuk menutup video";
      };
      const playback = video.play();
      if (stage.requestFullscreen) {
        stage.requestFullscreen().then(() => {
          if (session !== current || !dialog.open) {
            if (document.fullscreenElement === stage) document.exitFullscreen().catch(() => {});
            return;
          }
          noticeTimer = setTimeout(() => { notice.hidden = true; }, 5000);
        }).catch(fallback);
      } else if (video.webkitEnterFullscreen) {
        notice.textContent = "Gunakan tombol keluar layar penuh pada pemutar untuk kembali";
        const nativeFullscreen = () => {
          if (session !== current || !dialog.open) return;
          try { video.webkitEnterFullscreen(); } catch { fallback(); }
        };
        if (video.readyState >= 1) nativeFullscreen();
        else video.addEventListener("loadedmetadata", nativeFullscreen, { once: true });
      } else fallback();
      playback?.catch(() => {
        if (session === current && dialog.open) message("Pemutaran belum dimulai. Gunakan tombol play pada kontrol video.");
      });
    });
  });

  const instruction = document.querySelector(".scroll-instruction");
  const wrapper = document.querySelector(".scroll-wrapper");
  if (instruction && wrapper && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      instruction.classList.toggle("satria-instruction-visible", entry.isIntersecting);
    }, { threshold: 0.15 }).observe(wrapper);
  }
});
