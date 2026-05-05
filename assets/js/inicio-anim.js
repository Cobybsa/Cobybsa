document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Corregir rutas críticas
     ========================= */
  const cta1 = document.getElementById("cms-hero-cta1");
  const cta2 = document.getElementById("cms-hero-cta2");

  if (cta1) cta1.setAttribute("href", "/contacto.html");
  if (cta2) cta2.setAttribute("href", "/proyectos.html");

  /* =========================
     2) Reveal en scroll
     ========================= */
  const revealEls = [
    ...document.querySelectorAll(
      ".hero-content, .hero-media, .home-stats, .capability-card, .team-head, .team-card, .home-industries, .home-cta, .news-header, .news-card"
    ),
  ];

  revealEls.forEach((el) => el.classList.add("reveal"));

  if (!reduceMotion && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-inview"));
  }

  /* =========================
     3) Hero title animación limpia
     ========================= */
  const headline = document.querySelector("[data-hero-headline]");

  if (headline && headline.dataset.split !== "1") {
    headline.dataset.split = "1";

    const text = headline.textContent.trim();

    if (text) {
      headline.textContent = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = char === " " ? "\u00A0" : char;

        if (!reduceMotion) {
          span.style.transitionDelay = `${Math.min(index * 14, 520)}ms`;
        }

        headline.appendChild(span);
      });

      requestAnimationFrame(() => {
        headline.classList.add("is-ready");
      });
    }
  }

  /* =========================
     4) Micro-parallax hero image
     ========================= */
  if (!reduceMotion) {
    const hero = document.getElementById("hero");
    const img = document.getElementById("cms-hero-image");

    if (hero && img) {
      let raf = null;

      const moveImage = (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        if (raf) cancelAnimationFrame(raf);

        raf = requestAnimationFrame(() => {
          img.style.transform = `scale(1.035) translate(${x * 8}px, ${y * 8}px)`;
        });
      };

      const resetImage = () => {
        img.style.transform = "scale(1.03)";
      };

      hero.addEventListener("mousemove", moveImage);
      hero.addEventListener("mouseleave", resetImage);
    }
  }

  /* =========================
     5) Carrusel novedades
     ========================= */
  const newsTrack = document.querySelector(".news-track");
  const newsPrev = document.querySelector(".news-prev");
  const newsNext = document.querySelector(".news-next");

  if (newsTrack && newsPrev && newsNext && !newsTrack.dataset.navBound) {
    newsTrack.dataset.navBound = "1";

    const step = () => Math.max(300, Math.round(newsTrack.clientWidth * 0.85));

    newsPrev.addEventListener("click", () => {
      newsTrack.scrollBy({
        left: -step(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    newsNext.addEventListener("click", () => {
      newsTrack.scrollBy({
        left: step(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  /* =========================
     6) Carrusel equipo
     ========================= */
  const teamTrack = document.querySelector(".team-track");

  if (teamTrack && !teamTrack.dataset.dragBound) {
    teamTrack.dataset.dragBound = "1";

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    teamTrack.addEventListener("mousedown", (event) => {
      isDown = true;
      teamTrack.classList.add("is-dragging");
      startX = event.pageX - teamTrack.offsetLeft;
      scrollLeft = teamTrack.scrollLeft;
    });

    teamTrack.addEventListener("mouseleave", () => {
      isDown = false;
      teamTrack.classList.remove("is-dragging");
    });

    teamTrack.addEventListener("mouseup", () => {
      isDown = false;
      teamTrack.classList.remove("is-dragging");
    });

    teamTrack.addEventListener("mousemove", (event) => {
      if (!isDown) return;
      event.preventDefault();

      const x = event.pageX - teamTrack.offsetLeft;
      const walk = (x - startX) * 1.2;
      teamTrack.scrollLeft = scrollLeft - walk;
    });
  }
})();
