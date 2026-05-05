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
      if (typeof value === "string" && value.trim()) el.textContent = value;
    };

    const setHref = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string" && value.trim()) el.setAttribute("href", value);
    };

    const createEl = (tag, className, text) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      if (text) el.textContent = text;
      return el;
    };

    /* INICIO */
    const inicio = await fetchJson("/content/paginas/inicio.json");

    if (inicio) {
      setText("cms-hero-badge", inicio.badge);
      setText("cms-hero-title", inicio.titulo);
      setText("cms-hero-desc", inicio.descripcion);
      setText("cms-hero-extra", inicio.extra);

      setText("cms-hero-cta1-text", inicio.cta_principal_texto);
      setHref("cms-hero-cta1", inicio.cta_principal_link || "/contacto.html");

      setText("cms-hero-cta2-text", inicio.cta_secundario_texto);
      setHref("cms-hero-cta2", inicio.cta_secundario_link || "/proyectos.html");

      const statsContainer = document.querySelector(".stats-inner");
      if (statsContainer && Array.isArray(inicio.estadisticas)) {
        statsContainer.innerHTML = "";
        inicio.estadisticas.forEach((item) => {
          const stat = createEl("div", "stat-item");
          stat.appendChild(createEl("span", "stat-number", item.numero));
          stat.appendChild(createEl("span", "stat-label", item.texto));
          statsContainer.appendChild(stat);
        });
      }

      const capabilitiesContainer = document.querySelector(".capability-grid");
      if (capabilitiesContainer && Array.isArray(inicio.capacidades_destacadas)) {
        capabilitiesContainer.innerHTML = "";
        inicio.capacidades_destacadas.forEach((item) => {
          const card = createEl("article", "capability-card");
          card.appendChild(createEl("span", "", item.numero));
          card.appendChild(createEl("h3", "", item.titulo));
          card.appendChild(createEl("p", "", item.descripcion));

          if (item.link) {
            const link = createEl("a", "", "Ver capacidad");
            link.setAttribute("href", item.link);
            card.appendChild(link);
          }

          capabilitiesContainer.appendChild(card);
        });
      }

      const teamTitle = document.querySelector(".team-head h2");
      const teamDesc = document.querySelector(".team-head p:not(.section-kicker)");

      if (teamTitle && inicio.equipo_titulo) teamTitle.textContent = inicio.equipo_titulo;
      if (teamDesc && inicio.equipo_descripcion) teamDesc.textContent = inicio.equipo_descripcion;

      const teamTrack = document.querySelector(".team-track");
      if (teamTrack && Array.isArray(inicio.equipo)) {
        teamTrack.innerHTML = "";
        inicio.equipo.forEach((persona) => {
          const card = createEl("article", "team-card");

          const avatar = createEl("div", "team-avatar");
          avatar.setAttribute("aria-hidden", "true");

          card.appendChild(avatar);
          card.appendChild(createEl("h3", "", persona.nombre));
          card.appendChild(createEl("span", "team-role", persona.cargo));
          card.appendChild(createEl("p", "", persona.descripcion));

          teamTrack.appendChild(card);
        });
      }

      const sectorTitle = document.querySelector(".home-industries .section-head h2");
      if (sectorTitle && inicio.sectores_titulo) sectorTitle.textContent = inicio.sectores_titulo;

      const industryList = document.querySelector(".industry-list");
      if (industryList && Array.isArray(inicio.sectores)) {
        industryList.innerHTML = "";
        inicio.sectores.forEach((sector) => {
          industryList.appendChild(createEl("span", "", sector));
        });
      }

      const ctaTitle = document.querySelector(".home-cta h2");
      const ctaDesc = document.querySelector(".home-cta p:not(.section-kicker)");
      const ctaButton = document.querySelector(".home-cta .btn");

      if (ctaTitle && inicio.cta_final_titulo) ctaTitle.textContent = inicio.cta_final_titulo;
      if (ctaDesc && inicio.cta_final_descripcion) ctaDesc.textContent = inicio.cta_final_descripcion;

      if (ctaButton) {
        if (inicio.cta_final_boton_texto) ctaButton.textContent = inicio.cta_final_boton_texto;
        if (inicio.cta_final_boton_link) ctaButton.setAttribute("href", inicio.cta_final_boton_link);
      }
    }

    /* HISTORIA */
    const historia = await fetchJson("/content/paginas/historia.json");

    if (historia) {
      setText("cms-historia-badge", historia.badge);
      setText("cms-historia-title", historia.titulo);
      setText("cms-historia-desc", historia.descripcion);
      setText("cms-historia-main-title", historia.historia_titulo);
      setText("cms-historia-main-text", historia.historia_texto);

      const bloquesContainer = document.getElementById("cms-historia-bloques");

      if (bloquesContainer && Array.isArray(historia.bloques)) {
        bloquesContainer.innerHTML = "";

        historia.bloques.forEach((bloque) => {
          const article = createEl("article", "hx-step");

          const head = createEl("div", "hx-step-head");
          head.appendChild(createEl("span", "hx-tag", bloque.etapa));

          const title = createEl("h3", "", bloque.titulo);
          title.setAttribute("data-decrypt", "");
          head.appendChild(title);

          article.appendChild(head);
          article.appendChild(createEl("p", "", bloque.texto));

          if (Array.isArray(bloque.puntos) && bloque.puntos.length) {
            const ul = createEl("ul");
            bloque.puntos.forEach((punto) => {
              ul.appendChild(createEl("li", "", punto));
            });
            article.appendChild(ul);
          }

          bloquesContainer.appendChild(article);
        });
      }

      const valoresContainer = document.getElementById("cms-historia-valores");

      if (valoresContainer && Array.isArray(historia.valores)) {
        valoresContainer.innerHTML = "";

        historia.valores.forEach((valor) => {
          const article = createEl("article", "hx-value");
          article.appendChild(createEl("h3", "", valor.titulo));
          article.appendChild(createEl("p", "", valor.descripcion));
          valoresContainer.appendChild(article);
        });
      }
    }

    /* CONTACTO */
    const contacto = await fetchJson("/content/paginas/contacto.json");

    if (contacto) {
      setText("cms-contact-title", contacto.titulo);
      setText("cms-contact-desc", contacto.descripcion);

      setText("cms-contact-phone", contacto.telefono);
      setText("cms-contact-email", contacto.correo);
      setText("cms-contact-location", contacto.ubicacion);
      setText("cms-contact-extra", contacto.extra);

      const phone = document.getElementById("cms-contact-phone");
      if (phone && contacto.telefono) {
        const cleanPhone = contacto.telefono.replace(/[^\d+]/g, "");
        phone.setAttribute("href", `tel:${cleanPhone}`);
      }

      const email = document.getElementById("cms-contact-email");
      if (email && contacto.correo) {
        email.setAttribute("href", `mailto:${contacto.correo}`);
      }
    }

    /* CAPACIDADES */
    const capacidades = await fetchJson("/content/paginas/capacidades.json");

    if (capacidades) {
      setText("cms-cap-title", capacidades.titulo);
      setText("cms-cap-desc", capacidades.descripcion);
    }
  } catch (error) {
    console.warn("CMS content could not be loaded:", error);
  }
})();
