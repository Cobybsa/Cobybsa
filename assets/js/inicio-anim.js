document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const safeSetHref = (id, fallback) => {
    const el = document.getElementById(id);
    if (!el) return;

    const current = el.getAttribute("href");

    if (!current || current.startsWith("#")) {
      el.setAttribute("href", fallback);
    }
  };

  safeSetHref("cms-hero-cta1", "/contacto.html");
  safeSetHref("cms-hero-cta2", "/proyectos.html");

  /* Reveal */
  const revealEls = [
    ...document.querySelectorAll(
      ".hero-content, .hero-media, .home-stats, .stat-item, .section-head, .capability-card, .team-head, .team-card, .home-industries, .home-cta, .news-header, .news-card"
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
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-inview"));
  }

  /* Hero title: sin split por letras para evitar overflow */
  const headline =
    document.getElementById("cms-hero-title") ||
    document.querySelector("[data-hero-headline]");

  if (headline) {
    headline.classList.add("is-ready");
    headline.style.whiteSpace = "normal";
  }

  /* Micro-parallax hero image */
  if (!reduceMotion) {
    const hero = document.getElementById("hero");
    const img =
      document.getElementById("cms-hero-image") ||
      document.querySelector(".hero-image");

    if (hero && img) {
      let raf = null;

      const moveImage = (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        if (raf) cancelAnimationFrame(raf);

        raf = requestAnimationFrame(() => {
          img.style.transform = `scale(1.03) translate(${x * 5}px, ${y * 5}px)`;
        });
      };

      const resetImage = () => {
        img.style.transform = "scale(1.03)";
      };

      hero.addEventListener("mousemove", moveImage);
      hero.addEventListener("mouseleave", resetImage);
    }
  }

  /* Carrusel novedades */
  const bindCarouselButtons = (trackSelector, prevSelector, nextSelector) => {
    const track = document.querySelector(trackSelector);
    const prev = document.querySelector(prevSelector);
    const next = document.querySelector(nextSelector);

    if (!track || !prev || !next || track.dataset.navBound) return;

    track.dataset.navBound = "1";

    const step = () => Math.max(300, Math.round(track.clientWidth * 0.85));

    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -step(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: step(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

  bindCarouselButtons(".news-track", ".news-prev", ".news-next");

  /* Drag carrusel equipo */
  const teamTrack = document.querySelector(".team-track");

  if (teamTrack && !teamTrack.dataset.dragBound) {
    teamTrack.dataset.dragBound = "1";

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    teamTrack.addEventListener("pointerdown", (event) => {
      isDown = true;
      teamTrack.classList.add("is-dragging");
      startX = event.pageX - teamTrack.offsetLeft;
      scrollLeft = teamTrack.scrollLeft;
      teamTrack.setPointerCapture(event.pointerId);
    });

    teamTrack.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      event.preventDefault();

      const x = event.pageX - teamTrack.offsetLeft;
      const walk = (x - startX) * 1.15;
      teamTrack.scrollLeft = scrollLeft - walk;
    });

    const stopDragging = () => {
      isDown = false;
      teamTrack.classList.remove("is-dragging");
    };

    teamTrack.addEventListener("pointerup", stopDragging);
    teamTrack.addEventListener("pointercancel", stopDragging);
    teamTrack.addEventListener("pointerleave", stopDragging);
  }
})();
