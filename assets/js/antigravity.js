(() => {
  const canvas = document.getElementById("antigravity-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // Parámetros (equivalentes a los props que usted puso)
  const config = {
    count: 900,            // en React puso 1100; aquí recomiendo 700-1100
    color: "#cd5b0e",
    particleSize: 1.5,
    magnetRadius: 90,      // px (ajustable)
    ringRadius: 55,        // px (ajustable)
    lerpSpeed: 0.16,
    waveSpeed: 0.9,
    waveAmplitude: 0,      // usted lo tiene en 0
    pulseSpeed: 5.2,
    particleVariance: 0.6,
    fieldStrength: 12.4
  };

  // Reduce carga en móvil
  const isMobile = matchMedia("(max-width: 768px)").matches;
  if (isMobile) config.count = Math.min(config.count, 450);

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
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

  // Touch: use first touch
  window.addEventListener("touchmove", (e) => {
    if (!e.touches || !e.touches.length) return;
    onMove(e.touches[0]);
  }, { passive: true });

  const hexToRgba = (hex, a) => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  };

  const drawCapsule = (x, y, len, angle, width) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    const r = width / 2;
    ctx.moveTo(-len / 2 + r, -r);
    ctx.lineTo(len / 2 - r, -r);
    ctx.arc(len / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-len / 2 + r, r);
    ctx.arc(-len / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(32, now - last);
    last = now;

    // suavizado mouse (similar a "virtualMouse")
    const smooth = 0.08;
    mouse.x += (mouse.tx - mouse.x) * smooth;
    mouse.y += (mouse.ty - mouse.y) * smooth;

    ctx.clearRect(0, 0, w, h);

    // color con alpha
    ctx.fillStyle = hexToRgba(config.color, 0.85);

    for (const p of particles) {
      p.t += p.speed * (dt * 0.06);

      const dx = p.cx - mouse.x;
      const dy = p.cy - mouse.y;
      const dist = Math.hypot(dx, dy);

      let tx = p.x;
      let ty = p.y;

      // “campo” dentro del radio
      if (dist < config.magnetRadius) {
        const ang = Math.atan2(dy, dx);

        const wave = Math.sin(p.t * config.waveSpeed + ang) * (0.5 * config.waveAmplitude);
        const deviation = p.rOff * (5 / (config.fieldStrength + 0.1));
        const rr = config.ringRadius + wave + deviation;

        // posición sobre el anillo
        tx = mouse.x + rr * Math.cos(ang);
        ty = mouse.y + rr * Math.sin(ang);
      }

      // lerp hacia target
      p.cx += (tx - p.cx) * config.lerpSpeed;
      p.cy += (ty - p.cy) * config.lerpSpeed;

      // tamaño/pulso
      const pulse = (0.8 + Math.sin(p.t * config.pulseSpeed) * 0.2 * config.particleVariance);
      const size = Math.max(0.6, config.particleSize * pulse);

      // “capsule” orientada hacia el mouse cuando está en ring
      let angle = 0;
      if (dist < config.magnetRadius) {
        angle = Math.atan2(mouse.y - p.cy, mouse.x - p.cx);
      }

      drawCapsule(p.cx, p.cy, 6 * size, angle, 2.2 * size);
    }

    requestAnimationFrame(tick);
  };

  // init
  resize();
  makeParticles();
  requestAnimationFrame(tick);

  window.addEventListener("resize", () => {
    resize();
    makeParticles();
  }, { passive: true });
})();
