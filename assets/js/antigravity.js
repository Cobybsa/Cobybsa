(() => {
  const canvas = document.getElementById("antigravity-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  // ===== CONFIG (AQUÍ ajusta color/tamaño) =====
  const config = {
    color: "#ff8a3c",      // color
    particleSize: 1.0,     // tamaño base (0.7–1.3 recomendado)
    opacity: 0.55,         // 0.35–0.75 (más bajo = más elegante)
    countDesktop: 260,     // 200–350
    countMobile: 140,      // 100–180
    magnetRadius: 140,     // px
    ringRadius: 70,        // px
    lerpSpeed: 0.14,       // 0.10–0.18
    pulseSpeed: 2.8,       // menor = menos vibración
    particleVariance: 0.25,// 0.15–0.35
    fpsCap: 50             // 0 = sin límite; 45–60 recomendado
  };

  const isMobile = matchMedia("(max-width: 768px)").matches;
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Si el usuario prefiere menos animación, reducimos fuerte
  if (prefersReduced) {
    config.fpsCap = 30;
    config.particleSize = 0.9;
  }

  let w = 0, h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5); // baja dpr para rendimiento

  const rand = (a, b) => a + Math.random() * (b - a);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0, movedAt: performance.now() };
  const particles = [];

  const hexToRgba = (hex, a) => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  };

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;

    // Si el canvas no tiene altura (por CSS), no hay nada que hacer
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
    // Ajuste por área (pantallas enormes = un poco más, pequeñas = menos)
    const areaFactor = Math.min(1.25, Math.max(0.75, (w * h) / (1400 * 700)));
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

  // Pausar en pestaña oculta
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
  });

  let last = performance.now();
  let lastFrame = 0;

  function tick(now) {
    requestAnimationFrame(tick);
    if (!running) return;

    // FPS cap (si está)
    if (config.fpsCap > 0) {
      const minDelta = 1000 / config.fpsCap;
      if (now - lastFrame < minDelta) return;
      lastFrame = now;
    }

    const dt = Math.min(32, now - last);
    last = now;

    if (!w || !h) return;

    // Suavizado mouse: si no se movió en 2s, animación más suave (menos trabajo percibido)
    const idle = (now - mouse.movedAt) > 2000;
    const smooth = idle ? 0.03 : 0.08;
    mouse.x += (mouse.tx - mouse.x) * smooth;
    mouse.y += (mouse.ty - mouse.y) * smooth;

    ctx.clearRect(0, 0, w, h);
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

      const pulse = (0.9 + Math.sin(p.t * config.pulseSpeed) * 0.1 * config.particleVariance);
      const r = Math.max(0.6, config.particleSize * pulse);

      // Partícula circular (mucho más rápida que capsule)
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Init (importante: el canvas necesita altura via CSS)
  resize();
  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    // Recalcular dpr por si cambia zoom
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    resize();
  }, { passive: true });
})();
