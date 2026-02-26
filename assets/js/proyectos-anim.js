// Activa “modo JS” para que el CSS solo oculte/animé cuando JS esté corriendo
document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Reveal cards on view
     ========================= */
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  // Si reduce motion, muestre todo sin animación
  if (reduceMotion) {
    cards.forEach((c) => c.classList.add("is-inview"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((c) => io.observe(c));
  }

  /* =========================
     2) Gallery arrows scroll + estado
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
      // Si no hay overflow real, esconda flechas
      const hasOverflow = track.scrollWidth > track.clientWidth + 4;
      gallery.classList.toggle("no-arrows", !hasOverflow);

      const max = track.scrollWidth - track.clientWidth - 1;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max;

      left.style.opacity = atStart ? ".35" : ".92";
      right.style.opacity = atEnd ? ".35" : ".92";
      left.style.pointerEvents = atStart ? "none" : "auto";
      right.style.pointerEvents = atEnd ? "none" : "auto";
    };

    left.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
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

    // Inicialización (espera carga de imágenes para medir scrollWidth real)
    if (document.readyState === "complete") {
      updateArrows();
    } else {
      window.addEventListener("load", updateArrows, { once: true });
    }
  });
})();
