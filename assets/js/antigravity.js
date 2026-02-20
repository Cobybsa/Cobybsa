(() => {
  const canvas = document.getElementById("antigravity-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // =========================
  // CONFIG (limpio / elegante)
  // =========================
  const config = {
    count: 400,
    color: "#cd5b0e",
    particleSize: 4.5,     // más pequeño
    magnetRadius: 150,     // px
    ringRadius: 120,        // px
    lerpSpeed: 0.16,
    waveSpeed: 0.9,
    waveAmplitude: 0,      // lo dejamos en 0 como usted
    pulseSpeed: 4.2,       // un poco menos agresivo
    particleVariance: 0.45,
    fieldStrength: 18
  };

  // Reduce carga en móvil
  const isMobile = matchMedia("(max-width: 768px)").matches;
  if (isMobile) config.count = 250;

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    // Importante: el canvas debe tener tamaño por CSS (width/height al 100%)
    w = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
    h = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (a, b) => a + Math.random() * (b - a);

  const particles = [];
  const mouse = { x: w * 0.5, y: h * 0.5, tx: w * 0.5, ty: h * 0.5 };

  const makeParticles = () => {
    particles.length = 0;
    for (let i = 0; i < config.count; i++) {
      const x = rand(0, w);
      const y = rand(0, h);
      particles.push({
        x, y,
        cx: x, cy: y,
        t: rand(0, 100),
        speed: rand(0.002, 0.008),
        rOff: rand(-1, 1)
      });
    }
  };

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - rect.left;
    mouse.ty = e.clientY - rect.top;
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || !e.touches.length) return;
      onMove(e.touches[0]);
    },
    { passive: true }
  );

  const hexToRgb = (hex) => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(full, 16);
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255
    };
  };

  const { r, g, b } = hexToRgb(config.color);

  const drawDot = (x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(32, now - last);
    last = now;

    // suavizado mouse
    const smooth = 0.08;
    mouse.x += (mouse.tx - mouse.x) * smooth;
    mouse.y += (mouse.ty - mouse.y) * smooth;

    ctx.clearRect(0, 0, w, h);

    // Glow suave (nada “caca”)
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = `rgba(${r},${g},${b},0.55)`;
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;

    for (const p of particles) {
      p.t += p.speed * (dt * 0.06);

      const dx = p.cx - mouse.x;
      const dy = p.cy - mouse.y;
      const dist = Math.hypot(dx, dy);

      let tx = p.x;
      let ty = p.y;

      // Campo dentro del radio
      if (dist < config.magnetRadius) {
        const ang = Math.atan2(dy, dx);

        const wave = Math.sin(p.t * config.waveSpeed + ang) * (0.5 * config.waveAmplitude);
        const deviation = p.rOff * (6 / (config.fieldStrength + 0.1));
        const rr = config.ringRadius + wave + deviation;

        tx = mouse.x + rr * Math.cos(ang);
        ty = mouse.y + rr * Math.sin(ang);
      }

      // lerp
      p.cx += (tx - p.cx) * config.lerpSpeed;
      p.cy += (ty - p.cy) * config.lerpSpeed;

      // tamaño/pulso
      const pulse = 0.85 + Math.sin(p.t * config.pulseSpeed) * 0.15 * config.particleVariance;
      const radius = Math.max(0.6, config.particleSize * pulse);

      drawDot(p.cx, p.cy, radius);
    }

    ctx.restore();

    requestAnimationFrame(tick);
  };

  // init
  resize();
  makeParticles();
  requestAnimationFrame(tick);

  window.addEventListener(
    "resize",
    () => {
      resize();
      makeParticles();
    },
    { passive: true }
  );
})();
