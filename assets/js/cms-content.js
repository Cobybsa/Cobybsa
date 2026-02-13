(async function () {
  try {
    const fetchJson = async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    };

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string" && value.trim().length) el.textContent = value;
    };

    const setHref = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string" && value.trim().length) el.href = value;
    };

    // ======================
    // INICIO
    // ======================
    const inicio = await fetchJson("/content/paginas/inicio.json");
    if (inicio) {
      setText("cms-hero-badge", inicio.badge);
      setText("cms-hero-title", inicio.titulo);
      setText("cms-hero-desc", inicio.descripcion);

      setText("cms-hero-cta1-text", inicio.cta_principal_texto);
      setHref("cms-hero-cta1", inicio.cta_principal_link);

      setText("cms-hero-cta2-text", inicio.cta_secundario_texto);
      setHref("cms-hero-cta2", inicio.cta_secundario_link);

      if (inicio.hero_image) {
        const img = document.getElementById("cms-hero-image");
        if (img) img.src = inicio.hero_image;
      }
    }

    // ======================
    // CONTACTO
    // ======================
    const contacto = await fetchJson("/content/paginas/contacto.json");
    if (contacto) {
      setText("cms-contact-title", contacto.titulo);
      setText("cms-contact-desc", contacto.descripcion);

      setText("cms-contact-phone", contacto.telefono);
      setText("cms-contact-email", contacto.email);
      setText("cms-contact-location", contacto.ubicacion);

      // opcional
      setText("cms-contact-extra", contacto.texto_extra);
    }

    // ======================
    // CAPACIDADES (solo si luego pone IDs)
    // ======================
    const capacidades = await fetchJson("/content/paginas/capacidades.json");
    if (capacidades) {
      setText("cms-cap-title", capacidades.titulo);
      setText("cms-cap-desc", capacidades.descripcion);
      // setText("cms-cap-body", capacidades.contenido); // cuando exista ese div
    }
  } catch (e) {
    // Silencioso: si falla no rompe el sitio
  }
})();
