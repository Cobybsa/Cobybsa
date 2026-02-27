document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Reveal en scroll
     ========================= */
  const revealEls = [
    ...document.querySelectorAll(".hero-content, .hero-media, .news-header, .news-card")
  ];

  revealEls.forEach(el => el.classList.add("reveal"));

  if (!reduceMotion && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-inview");
        io.unobserve(e.target);
      });
    }, { threshold: 0.18 });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-inview"));
  }

  /* =========================
     2) Micro-parallax hero image (suave)
     ========================= */
  if (!reduceMotion) {
    const img = document.getElementById("cms-hero-image");
    const hero = document.getElementById("hero");
    if (img && hero) {
      let raf = null;

      const onMove = (ev) => {
        const r = hero.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          img.style.transform = `scale(1.03) translate(${x * 8}px, ${y * 8}px)`;
        });
      };

      hero.addEventListener("mousemove", onMove);
      hero.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1.02)";
      });
    }
  }

  /* =========================
     3) Mejora del carrusel de novedades (botones)
     (si js-novedades.js ya existe, esto no estorba)
     ========================= */
  const track = document.querySelector(".news-track");
  const prev = document.querySelector(".news-prev");
  const next = document.querySelector(".news-next");

  if (track && prev && next) {
    const step = () => Math.max(280, Math.round(track.clientWidth * 0.85));

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
