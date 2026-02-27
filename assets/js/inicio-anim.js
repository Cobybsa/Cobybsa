document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Reveal en scroll
     ========================= */
  const revealEls = [
    ...document.querySelectorAll(".hero-content, .hero-media, .news-header, .news-card"),
  ];

  revealEls.forEach((el) => el.classList.add("reveal"));

  if (!reduceMotion && revealEls.length) {
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

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-inview"));
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
     3) Carrusel de novedades (botones)
     Nota: si js-novedades.js ya lo maneja, evitamos duplicar listeners
     ========================= */
  const track = document.querySelector(".news-track");
  const prev = document.querySelector(".news-prev");
  const next = document.querySelector(".news-next");

  if (track && prev && next) {
    // Guard para no registrar 2 veces (por si js-novedades.js también lo hace)
    if (!track.dataset.navBound) {
      track.dataset.navBound = "1";

      const step = () => Math.max(280, Math.round(track.clientWidth * 0.85));

      prev.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
      });

      next.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  /* =========================
     4) Animación del titular (letras) + highlight “metalmecánicas”
     Requiere en HTML: data-hero-headline en el título
     y en CSS: .hero-title-anim .ch + .is-ready + .hl
     ========================= */
  const headline = document.querySelector("[data-hero-headline]");
  if (headline) {
    if (headline.dataset.split !== "1") {
      headline.dataset.split = "1";

      const original = (headline.textContent || "").trim();
      const highlightWord = "metalmecánicas";

      if (original) {
        headline.textContent = "";
        const frag = document.createDocumentFragment();

        const words = original.split(" ");
        words.forEach((w, wi) => {
          const clean = w.replace(/[.,;:!?]/g, "");
          const isHL = clean.toLowerCase() === highlightWord;

          const wordSpan = document.createElement("span");
          if (isHL) wordSpan.className = "hl";

          for (let i = 0; i < w.length; i++) {
            const s = document.createElement("span");
            s.className = "ch";
            s.textContent = w[i];
            wordSpan.appendChild(s);
          }

          frag.appendChild(wordSpan);
          if (wi < words.length - 1) frag.appendChild(document.createTextNode(" "));
        });

        headline.appendChild(frag);

        const letters = headline.querySelectorAll(".ch");

        if (reduceMotion) {
          headline.classList.add("is-ready");
          letters.forEach((l) => {
            l.style.opacity = "1";
            l.style.transform = "none";
            l.style.filter = "none";
            l.style.transition = "none";
          });
        } else {
          requestAnimationFrame(() => {
            headline.classList.add("is-ready");
            letters.forEach((l, idx) => {
              l.style.transitionDelay = `${Math.min(0.9, idx * 0.012)}s`;
            });
          });
        }
      }
    }
  }
})();
