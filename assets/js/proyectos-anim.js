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
     2) Gallery arrows scroll
     ========================= */
  const galleries = document.querySelectorAll(".project-gallery");
  galleries.forEach((gallery) => {
    const track = gallery.querySelector(".project-gallery-track");
    const left = gallery.querySelector(".proj-arrow.left");
    const right = gallery.querySelector(".proj-arrow.right");
    if (!track || !left || !right) return;

    const step = () => Math.max(280, Math.round(track.clientWidth * 0.85));

    left.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    right.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
    });

    // Mostrar/ocultar flechas según overflow real
    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 1;
      left.style.opacity = track.scrollLeft <= 2 ? ".35" : ".92";
      right.style.opacity = track.scrollLeft >= max ? ".35" : ".92";
      left.style.pointerEvents = track.scrollLeft <= 2 ? "none" : "auto";
      right.style.pointerEvents = track.scrollLeft >= max ? "none" : "auto";
    };

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  });

})();
