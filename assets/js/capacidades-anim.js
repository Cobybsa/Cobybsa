document.documentElement.classList.add("js");

(() => {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     1) Reveal cards on view
     ========================= */
  const cards = document.querySelectorAll("[data-cap-card]");
  if (!cards.length) return;

  if (!reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-inview");
        io.unobserve(e.target);
      });
    }, { threshold: 0.18 });

    cards.forEach((c, i) => {
      // Stagger leve
      c.style.transitionDelay = `${Math.min(240, i * 70)}ms`;
      io.observe(c);
    });
  } else {
    cards.forEach((c) => c.classList.add("is-inview"));
  }

  /* =========================
     2) Crosshair suave (solo dentro de cards)
     ========================= */
  if (reduceMotion) return;

  cards.forEach((card) => {
    // capa crosshair
    const overlay = document.createElement("div");
    overlay.className = "cap-crosshair";
    overlay.setAttribute("aria-hidden", "true");
    card.appendChild(overlay);

    // estilos inline mínimos (para no depender de CSS extra)
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 180ms ease",
      background:
        "radial-gradient(circle at var(--cx,50%) var(--cy,50%), rgba(233,238,245,.16) 0, rgba(233,238,245,.10) 10px, transparent 120px)",
      mixBlendMode: "screen",
    });

    const onMove = (ev) => {
      const r = card.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * 100;
      const y = ((ev.clientY - r.top) / r.height) * 100;
      overlay.style.setProperty("--cx", `${x}%`);
      overlay.style.setProperty("--cy", `${y}%`);
      overlay.style.opacity = "1";
    };

    const onLeave = () => {
      overlay.style.opacity = "0";
    };

    card.addEventListener("mousemove", onMove, { passive: true });
    card.addEventListener("mouseleave", onLeave);
  });
})();
