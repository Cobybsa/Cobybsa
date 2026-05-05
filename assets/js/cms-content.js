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
      if (typeof value === "string" && value.trim()) {
        el.textContent = value;
      }
    };

    const setHref = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === "string" && value.trim()) {
        el.setAttribute("href", value);
      }
    };

    const createEl = (tag, className, text) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      if (text) el.textContent = text;
      return el;
    };

    // ======================
    // INICIO
    // ======================
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

      // Estadísticas
      const statsContainer = document.querySelector(".stats-inner");
      if (statsContainer && Array.isArray(inicio.estadisticas)) {
        statsContainer.innerHTML = "";

        inicio.estadisticas.forEach((item) => {
          const stat = createEl("div", "stat-item");

          const number = createEl("span", "stat-number", item.numero);
          const label = createEl("span", "stat-label", item.texto);

          stat.appendChild(number);
          stat.appendChild(label);
          statsContainer.appendChild(stat);
        });
      }

      // Capacidades destacadas
      const capabilitiesContainer = document.querySelector(".capability-grid");
      if (capabilitiesContainer && Array.isArray(inicio.capacidades_destacadas)) {
        capabilitiesContainer.innerHTML = "";

        inicio.capacidades_destacadas.forEach((item) => {
          const card = createEl("article", "capability-card");

          const number = createEl("span", "", item.numero);
          const title = createEl("h3", "", item.titulo);
          const desc = createEl("p", "", item.descripcion);

          card.appendChild(number);
          card.appendChild(title);
          card.appendChild(desc);

          if (item.link) {
            const link = createEl("a", "", "Ver capacidad");
            link.setAttribute("href", item.link);
            card.appendChild(link);
          }

          capabilitiesContainer.appendChild(card);
        });
      }

      // Equipo
      const teamTitle = document.querySelector(".team-head h2");
      const teamDesc = document.querySelector(".team-head p:not(.section-kicker)");

      if (teamTitle && inicio.equipo_titulo) {
        teamTitle.textContent = inicio.equipo_titulo;
      }

      if (teamDesc && inicio.equipo_descripcion) {
        teamDesc.textContent = inicio.equipo_descripcion;
      }

      const teamTrack = document.querySelector(".team-track");
      if (teamTrack && Array.isArray(inicio.equipo)) {
        teamTrack.innerHTML = "";

        inicio.equipo.forEach((persona) => {
          const card = createEl("article", "team-card");

          const avatar = createEl("div", "team-avatar");
          avatar.setAttribute("aria-hidden", "true");

          const name = createEl("h3", "", persona.nombre);
          const role = createEl("span", "team-role", persona.cargo);
          const desc = createEl("p", "", persona.descripcion);

          card.appendChild(avatar);
          card.appendChild(name);
          card.appendChild(role);
          card.appendChild(desc);

          teamTrack.appendChild(card);
        });
      }

      // Sectores
      const sectorTitle = document.querySelector(".home-industries .section-head h2");
      if (sectorTitle && inicio.sectores_titulo) {
        sectorTitle.textContent = inicio.sectores_titulo;
      }

      const industryList = document.querySelector(".industry-list");
      if (industryList && Array.isArray(inicio.sectores)) {
        industryList.innerHTML = "";

        inicio.sectores.forEach((sector) => {
          const span = createEl("span", "", sector);
          industryList.appendChild(span);
        });
      }

      // CTA final
      const ctaTitle = document.querySelector(".home-cta h2");
      const ctaDesc = document.querySelector(".home-cta p:not(.section-kicker)");
      const ctaButton = document.querySelector(".home-cta .btn");

      if (ctaTitle && inicio.cta_final_titulo) {
        ctaTitle.textContent = inicio.cta_final_titulo;
      }

      if (ctaDesc && inicio.cta_final_descripcion) {
        ctaDesc.textContent = inicio.cta_final_descripcion;
      }

      if (ctaButton) {
        if (inicio.cta_final_boton_texto) {
          ctaButton.textContent = inicio.cta_final_boton_texto;
        }

        if (inicio.cta_final_boton_link) {
          ctaButton.setAttribute("href", inicio.cta_final_boton_link);
        }
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

    // ======================
    // CAPACIDADES
    // ======================
    const capacidades = await fetchJson("/content/paginas/capacidades.json");

    if (capacidades) {
      setText("cms-cap-title", capacidades.titulo);
      setText("cms-cap-desc", capacidades.descripcion);
    }
  } catch (error) {
    console.warn("CMS content could not be loaded:", error);
  }
})();
