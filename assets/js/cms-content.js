(async function () {
  try {
    // Carga el JSON editable desde el CMS
    const res = await fetch("/content/paginas/inicio.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();

    // Helpers
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el && typeof value === "string" && value.trim().length) el.textContent = value;
    };

    const setHref = (id, value) => {
      const el = document.getElementById(id);
      if (el && typeof value === "string" && value.trim().length) el.href = value;
    };

    // Texto
    setText("cms-hero-badge", data.badge);
    setText("cms-hero-title", data.titulo);
    setText("cms-hero-desc", data.descripcion);

    // CTAs
    setText("cms-hero-cta1-text", data.cta_principal_texto);
    setHref("cms-hero-cta1", data.cta_principal_link);

    setText("cms-hero-cta2-text", data.cta_secundario_texto);
    setHref("cms-hero-cta2", data.cta_secundario_link);

    // Imagen (si luego la agregamos al JSON)
    if (data.hero_image) {
      const img = document.getElementById("cms-hero-image");
      if (img) img.src = data.hero_image;
    }
  } catch (e) {
    // Silencioso: si falla no rompe el sitio
  }
})();
