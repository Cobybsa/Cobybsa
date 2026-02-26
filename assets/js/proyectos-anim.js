document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     Reveal cards
     ========================= */

  const cards = document.querySelectorAll(".project-card");

  if (!cards.length) return;

  if (reduceMotion) {
    cards.forEach(card => card.classList.add("is-inview"));
  } else {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach(card => observer.observe(card));
  }

  /* =========================
     Gallery arrows
     ========================= */

  const galleries = document.querySelectorAll(".project-gallery");

  galleries.forEach(gallery => {
    const track = gallery.querySelector(".project-gallery-track");
    const left = gallery.querySelector(".proj-arrow.left");
    const right = gallery.querySelector(".proj-arrow.right");

    if (!track || !left || !right) return;

    // elimina onclick inline si existe
    left.onclick = null;
    right.onclick = null;

    const step = () =>
      Math.max(280, Math.round(track.clientWidth * 0.85));

    const updateArrows = () => {
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
      track.scrollBy({
        left: -step(),
        behavior: reduceMotion ? "auto" : "smooth"
      });
      setTimeout(updateArrows, 250);
    });

    right.addEventListener("click", () => {
      track.scrollBy({
        left: step(),
        behavior: reduceMotion ? "auto" : "smooth"
      });
      setTimeout(updateArrows, 250);
    });

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    window.addEventListener("load", updateArrows, { once: true });
  });

})();
