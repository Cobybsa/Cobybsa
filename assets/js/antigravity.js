(() => {
  const canvas = document.getElementById("antigravity-canvas");
  if (!canvas) return;

  const container = canvas.parentElement; // .hero-antigravity
  if (!container) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  // ===== CONFIG (AQUÍ ajusta color/tamaño) =====
  const config = {
    color: "#ffffff",
    particleSize: 2.4,      // 👈 recomendado 1.2–2.2 (4.5 se ve como “cacas”)
    opacity: 0.8,          // 👈 recomendado 0.18–0.35
    countDesktop: 320,      // 👈 260–380
    countMobile: 140,       // 👈 110–170
    magnetRadius: 200,
    ringRadius: 65,
    lerpSpeed: 0.14,
    pulseSpeed: 2.6,
    particleVariance: 0.18,
    fpsCap: 55,             // 👈 50–60
    blend: true             // 👈 true = look más “glow” premium
  };

  const isMobile = matchMedia("(max-width: 768px)").matches;
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    config.fpsCap = 30;
    config.particleSize = 1.0;
    config.opacity = 0.18;
  }

  let w = 0, h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const rand = (a, b) => a + Math.random() * (b - a);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0, movedAt: performance.now() };
  const particles = [];

  const hexToRgba = (hex, a) => {
    const hh = hex.replace("#", "").trim();
    const full = hh.length === 3 ? hh.split("").map(c => c + c).join("") : hh;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  };

  function resize() {
    const rect = container.getBoundingClientRect(); // 👈 TAMAÑO REAL del hero
    w = Math.floor(rect.width);
    h = Math.floor(rect.height);

    if (!w || !h) return;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mouse.x = mouse.tx = w * 0.5;
    mouse.y = mouse.ty = h * 0.5;

    makeParticles();
  }

  function makeParticles() {
    particles.length = 0;

    const baseCount = isMobile ? config.countMobile : config.countDesktop;
    const areaFactor = Math.min(1.2, Math.max(0.75, (w * h) / (1400 * 720)));
    const count = Math.floor(baseCount * areaFactor);

    for (let i = 0; i < count; i++) {
      const x = rand(0, w);
      const y = rand(0, h);
      particles.push({
        x, y,
        cx: x, cy: y,
        t: rand(0, 100),
        speed: rand(0.002, 0.006),
        rOff: rand(-1, 1)
      });
    }
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - rect.left;
    mouse.ty = e.clientY - rect.top;
    mouse.movedAt = performance.now();
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (!e.touches || !e.touches.length) return;
    onMove(e.touches[0]);
  }, { passive: true });

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
  });

  let last = performance.now();
  let lastFrame = 0;

  function tick(now) {
    requestAnimationFrame(tick);
    if (!running) return;

    if (config.fpsCap > 0) {
      const minDelta = 1000 / config.fpsCap;
      if (now - lastFrame < minDelta) return;
      lastFrame = now;
    }

    const dt = Math.min(32, now - last);
    last = now;

    if (!w || !h) return;

    const idle = (now - mouse.movedAt) > 2000;
    const smooth = idle ? 0.03 : 0.08;
    mouse.x += (mouse.tx - mouse.x) * smooth;
    mouse.y += (mouse.ty - mouse.y) * smooth;

    ctx.clearRect(0, 0, w, h);

    // look premium (opcional)
    ctx.globalCompositeOperation = config.blend ? "lighter" : "source-over";
    ctx.fillStyle = hexToRgba(config.color, config.opacity);

    const mr = config.magnetRadius;
    const rrBase = config.ringRadius;

    for (const p of particles) {
      p.t += p.speed * (dt * 0.06);

      const dx = p.cx - mouse.x;
      const dy = p.cy - mouse.y;
      const dist = Math.hypot(dx, dy);

      let tx = p.x;
      let ty = p.y;

      if (!idle && dist < mr) {
        const ang = Math.atan2(dy, dx);
        const rr = rrBase + p.rOff * 3;
        tx = mouse.x + rr * Math.cos(ang);
        ty = mouse.y + rr * Math.sin(ang);
      }

      p.cx += (tx - p.cx) * config.lerpSpeed;
      p.cy += (ty - p.cy) * config.lerpSpeed;

      const pulse = (0.92 + Math.sin(p.t * config.pulseSpeed) * 0.08 * config.particleVariance);
      const r = Math.max(0.5, config.particleSize * pulse);

      ctx.beginPath();
      ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // reset (por si después dibuja otra cosa)
    ctx.globalCompositeOperation = "source-over";
  }

  // Init
  resize();
  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    resize();
  }, { passive: true });
})();
