(() => {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

   /* =========================
     1) Scroll-velocity marquee (loop limpio)
     ========================= */
  const track = document.querySelector("[data-scroll-velocity]");
  if (track && !reduceMotion) {
    let x = 0;
    let lastY = window.scrollY;
    let v = 0;

    function tick() {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;

      // velocidad suavizada
      v += (dy * 0.18 - v) * 0.12;

      // dirección según scroll (abajo => izquierda, arriba => derecha)
      const dir = v >= 0 ? -1 : 1;

      // base speed + extra por velocidad
      const speed = 0.6 + Math.min(6, Math.abs(v) * 0.12);

      // avance
      x += speed * dir;

      // ancho de UNA repetición (porque hay 2 spans iguales)
      const w = track.scrollWidth / 2;

      // wrap estable en [0, w)
      if (w > 0) {
        x = ((x % w) + w) % w;
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
  /* =========================
     2) Count-up on view
     ========================= */
  const counters = document.querySelectorAll("[data-countup]");
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;

        const el = e.target;
        io.unobserve(el);

        const to = parseFloat(el.getAttribute("data-to") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = reduceMotion ? 1 : 1200;

        const t0 = performance.now();
        function anim(t) {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = (to * eased);

          // enteros bonitos
          el.textContent = `${Math.round(val)}${suffix}`;
          if (p < 1) requestAnimationFrame(anim);
          else el.textContent = `${Math.round(to)}${suffix}`;
        }
        requestAnimationFrame(anim);
      });
    }, { threshold: 0.35 });

    counters.forEach((c) => io.observe(c));
  }

  /* =========================
     3) Decrypted text (scramble)
     ========================= */
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function decrypt(el) {
    const original = (el.textContent || "").trim();
    if (!original) return;
    if (reduceMotion) return; // sin animación

    let frame = 0;
    const total = Math.max(18, original.length * 2);

    const timer = setInterval(() => {
      frame++;
      const p = frame / total;

      let out = "";
      for (let i = 0; i < original.length; i++) {
        const reveal = i < Math.floor(p * original.length);
        const ch = original[i];
        out += reveal ? ch : alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      el.textContent = out;

      if (frame >= total) {
        clearInterval(timer);
        el.textContent = original;
      }
    }, 28);
  }

  const decryptEls = document.querySelectorAll("[data-decrypt]");
  if (decryptEls.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        decrypt(e.target);
      });
    }, { threshold: 0.55 });

    decryptEls.forEach((el) => io2.observe(el));
  }
})();
