(async function () {
  try {
    const path = (window.location.pathname || "/").toLowerCase();

    // Detectar página (ajuste aquí si usa rutas distintas)
    let page = "inicio";
    if (path.includes("capacidades")) page = "capacidades";
    if (path.includes("contacto")) page = "contacto";

    const res = await fetch(`/content/paginas/${page}.json`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();

    // Helpers
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string") el.textContent = value;
    };

    const setHTML = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string") el.innerHTML = value;
    };

    const setHref = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string" && value.trim().length) el.href = value;
    };

    // ======================
    // INICIO
    // ======================
    if (page === "inicio") {
      setText("cms-hero-badge", data.badge);
      setText("cms-hero-title", data.titulo);
      setText("cms-hero-desc", data.descripcion);

      setText("cms-hero-cta1-text", data.cta_principal_texto);
      setHref("cms-hero-cta1", data.cta_principal_link);

      setText("cms-hero-cta2-text", data.cta_secundario_texto);
      setHref("cms-hero-cta2", data.cta_secundario_link);

      if (data.hero_image) {
        const img = document.getElementById("cms-hero-image");
        if (img) img.src = data.hero_image;
      }
    }

    // ======================
    // CAPACIDADES
    // ======================
    if (page === "capacidades") {
      setText("cms-cap-title", data.titulo);
      setText("cms-cap-desc", data.descripcion);

      // OJO: "contenido" viene markdown en su JSON.
      // Aquí lo metemos como texto simple por seguridad.
      // Si quiere que se vea como HTML bonito, le hago un conversor markdown->HTML después.
      setText("cms-cap-body", data.contenido);
    }

    // ======================
    // CONTACTO
    // ======================
    if (page === "contacto") {
      setText("cms-contact-title", data.titulo);
      setText("cms-contact-desc", data.descripcion);

      setText("cms-contact-phone", data.telefono);
      setText("cms-contact-email", data.email);
      setText("cms-contact-location", data.ubicacion);

      // opcional
      setText("cms-contact-extra", data.texto_extra);
    }
  } catch (e) {
    // Silencioso: si falla no rompe el sitio
  }
})();
