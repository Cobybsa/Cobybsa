document.documentElement.classList.add("js");

function initCapacidadesAnim() {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cards = document.querySelectorAll("[data-cap-card]");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.remove("is-inview");
  });

  if (!reduceMotion) {
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

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(240, index * 70)}ms`;
      io.observe(card);
    });
  } else {
    cards.forEach((card) => card.classList.add("is-inview"));
  }

  if (reduceMotion) return;

  cards.forEach((card) => {
    if (card.querySelector(".cap-crosshair")) return;

    const overlay = document.createElement("div");
    overlay.className = "cap-crosshair";
    overlay.setAttribute("aria-hidden", "true");
    card.appendChild(overlay);

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

    card.addEventListener(
      "mousemove",
      (ev) => {
        const r = card.getBoundingClientRect();
        const x = ((ev.clientX - r.left) / r.width) * 100;
        const y = ((ev.clientY - r.top) / r.height) * 100;

        overlay.style.setProperty("--cx", `${x}%`);
        overlay.style.setProperty("--cy", `${y}%`);
        overlay.style.opacity = "1";
      },
      { passive: true }
    );

    card.addEventListener("mouseleave", () => {
      overlay.style.opacity = "0";
    });
  });
}

document.addEventListener("capacidadesCMSReady", initCapacidadesAnim);

window.addEventListener("load", () => {
  setTimeout(initCapacidadesAnim, 700);
});
