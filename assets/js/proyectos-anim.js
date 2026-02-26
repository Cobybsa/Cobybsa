(() => {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Reveal cards on view
     ========================= */
  const cards = document.querySelectorAll(".project-card");
  if (cards.length && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-inview");
        io.unobserve(e.target);
      });
    }, { threshold: 0.18 });

    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add("is-inview"));
  }

  /* =========================
     2) Gallery arrows scroll + arrow state
     ========================= */
  const galleries = document.querySelectorAll(".project-gallery");
  galleries.forEach((gallery) => {
    const track = gallery.querySelector(".project-gallery-track");
    const left = gallery.querySelector(".proj-arrow.left");
    const right = gallery.querySelector(".proj-arrow.right");
    if (!track || !left || !right) return;

    // Evita doble scroll si hay onclick en el HTML
    left.onclick = null;
    right.onclick = null;

    const step = () => Math.max(280, Math.round(track.clientWidth * 0.85));

    const updateArrows = () => {
      // Oculta flechas si no hay overflow real
      const hasOverflow = track.scrollWidth > track.clientWidth + 4;
      gallery.classList.toggle("no-arrows", !hasOverflow);

      const max = track.scrollWidth - track.clientWidth - 1;
      left.style.opacity = track.scrollLeft <= 2 ? ".35" : ".92";
      right.style.opacity = track.scrollLeft >= max ? ".35" : ".92";
      left.style.pointerEvents = track.scrollLeft <= 2 ? "none" : "auto";
      right.style.pointerEvents = track.scrollLeft >= max ? "none" : "auto";
    };

    left.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
      // actualiza luego del scroll
      requestAnimationFrame(updateArrows);
      setTimeout(updateArrows, 220);
    });

    right.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
      requestAnimationFrame(updateArrows);
      setTimeout(updateArrows, 220);
    });

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    // Inicialización (espera a que carguen imágenes)
    if (document.readyState === "complete") {
      updateArrows();
    } else {
      window.addEventListener("load", updateArrows, { once: true });
    }
  });
})();
