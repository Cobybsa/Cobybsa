(async function () {
  try {
    const fetchJson = async (url) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;

        const text = await res.text();
        if (!text.trim()) return null;

        return JSON.parse(text);
      } catch (error) {
        console.warn("JSON inválido o no cargado:", url, error);
        return null;
      }
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

    const hasItems = (items) => Array.isArray(items) && items.length > 0;

    const getText = (item) => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      return item.texto || item.punto || item.sector || item.titulo || "";
    };

    const renderDivItems = (id, items, className = "item") => {
      const container = document.getElementById(id);
      if (!container || !hasItems(items)) return;

      container.innerHTML = "";
      items.forEach((item) => {
        const text = getText(item);
        if (text) container.appendChild(createEl("div", className, text));
      });
    };

    const renderPills = (id, items) => {
      renderDivItems(id, items, "pill");
    };

    const renderList = (id, items) => {
      const container = document.getElementById(id);
      if (!container || !hasItems(items)) return;

      container.innerHTML = "";
      items.forEach((item) => {
        const text = getText(item);
        if (text) container.appendChild(createEl("li", "", text));
      });
    };

    const renderBullets = (id, items) => {
      const container = document.getElementById(id);
      if (!container || !hasItems(items)) return;

      container.innerHTML = "";
      items.forEach((item) => {
        const text = getText(item);
        if (!text) return;

        const li = createEl("li");
        li.appendChild(createEl("span", "dot"));
        li.appendChild(createEl("span", "", text));
        container.appendChild(li);
      });
    };

    const renderSteps = (id, items) => {
      const container = document.getElementById(id);
      if (!container || !hasItems(items)) return;

      container.innerHTML = "";
      items.forEach((item, index) => {
        const text = getText(item);
        if (!text) return;

        const li = createEl("li", "step");
        li.appendChild(createEl("span", "num", String(index + 1)));
        li.appendChild(createEl("p", "", text));
        container.appendChild(li);
      });
    };

    const renderCapabilityPage = async (jsonPath, prefix) => {
      const data = await fetchJson(jsonPath);
      if (!data) return;

      setText(`cms-${prefix}-badge`, data.badge);
      setText(`cms-${prefix}-title`, data.titulo);
      setText(`cms-${prefix}-desc`, data.descripcion);
      setText(`cms-${prefix}-main-text`, data.texto_principal);

      setText(`cms-${prefix}-cta1-text`, data.cta_principal_texto);
      setHref(`cms-${prefix}-cta1`, data.cta_principal_link);

      setText(`cms-${prefix}-cta2-text`, data.cta_secundario_texto);
      setHref(`cms-${prefix}-cta2`, data.cta_secundario_link);

      setText(`cms-${prefix}-que-es-title`, data.que_es_titulo || data.seccion_titulo);
      setText(`cms-${prefix}-que-es-desc`, data.que_es_descripcion || data.seccion_texto);
      setText(`cms-${prefix}-que-es-text`, data.que_es_texto);

      renderPills(`cms-${prefix}-ventajas`, data.ventajas || data.puntos);
      setText(`cms-${prefix}-problemas-title`, data.problemas_titulo);
      renderBullets(`cms-${prefix}-problemas`, data.problemas);

      setText(`cms-${prefix}-materiales-title`, data.materiales_titulo);
      renderDivItems(`cms-${prefix}-materiales`, data.materiales, "item");
      setText(`cms-${prefix}-materiales-nota`, data.materiales_nota);

      setText(`cms-${prefix}-resultados-title`, data.resultados_titulo);
      renderDivItems(`cms-${prefix}-resultados`, data.resultados, "item");

      setText(`cms-${prefix}-proceso-title`, data.proceso_titulo);
      renderSteps(`cms-${prefix}-proceso`, data.proceso);

      setText(`cms-${prefix}-cta-final-title`, data.cta_final_titulo || data.cta_titulo);
      setText(`cms-${prefix}-cta-final-desc`, data.cta_final_descripcion || data.cta_descripcion);

      setText(`cms-${prefix}-cta-final-btn-text`, data.cta_final_boton_texto || data.cta_texto);
      setHref(`cms-${prefix}-cta-final-btn`, data.cta_final_boton_link || data.cta_link);

      setText(`cms-${prefix}-cta-final-secondary-text`, data.cta_final_secundario_texto);
      setHref(`cms-${prefix}-cta-final-secondary`, data.cta_final_secundario_link);
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
      if (statsContainer && hasItems(inicio.estadisticas)) {
        statsContainer.innerHTML = "";

        inicio.estadisticas.forEach((item) => {
          const stat = createEl("div", "stat-item");
          stat.appendChild(createEl("span", "stat-number", item.numero));
          stat.appendChild(createEl("span", "stat-label", item.texto));
          statsContainer.appendChild(stat);
        });
      }

      const capabilitiesContainer = document.querySelector(".capability-grid");
      if (capabilitiesContainer && hasItems(inicio.capacidades_destacadas)) {
        capabilitiesContainer.innerHTML = "";

        inicio.capacidades_destacadas.forEach((item) => {
          const card = createEl("article", "capability-card");
          card.appendChild(createEl("span", "", item.numero));
          card.appendChild(createEl("h3", "", item.titulo));
          card.appendChild(createEl("p", "", item.descripcion));

          if (item.link) {
            const link = createEl("a", "", item.link_texto || "Ver capacidad");
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
      if (teamTrack && hasItems(inicio.equipo)) {
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
      if (industryList && hasItems(inicio.sectores)) {
        industryList.innerHTML = "";

        inicio.sectores.forEach((sector) => {
          const text = typeof sector === "string" ? sector : sector.sector;
          if (text) industryList.appendChild(createEl("span", "", text));
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

      setText("cms-novedades-title", inicio.novedades_titulo);
      setText("cms-novedades-desc", inicio.novedades_descripcion);

      const novedadesGrid = document.getElementById("cms-novedades-grid");
      if (novedadesGrid && hasItems(inicio.novedades_destacadas)) {
        novedadesGrid.innerHTML = "";

        inicio.novedades_destacadas.forEach((item) => {
          const card = createEl("article", "news-card");

          if (item.imagen) {
            const imageWrap = createEl("div", "news-image");
            const img = createEl("img");
            img.setAttribute("src", item.imagen);
            img.setAttribute("alt", item.titulo || "Novedad COBYBSA");
            img.setAttribute("loading", "lazy");
            img.setAttribute("decoding", "async");
            imageWrap.appendChild(img);
            card.appendChild(imageWrap);
          }

          if (item.tag) card.appendChild(createEl("span", "news-tag", item.tag));
          if (item.titulo) card.appendChild(createEl("h3", "", item.titulo));
          if (item.descripcion) card.appendChild(createEl("p", "", item.descripcion));
          if (item.fecha) card.appendChild(createEl("span", "news-date", item.fecha));

          if (item.link) {
            const link = createEl("a", "news-link", "Ver más");
            link.setAttribute("href", item.link);
            card.appendChild(link);
          }

          novedadesGrid.appendChild(card);
        });
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
      if (bloquesContainer && hasItems(historia.bloques)) {
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

          if (hasItems(bloque.puntos)) {
            const ul = createEl("ul");
            bloque.puntos.forEach((punto) => {
              const text = getText(punto);
              if (text) ul.appendChild(createEl("li", "", text));
            });
            article.appendChild(ul);
          }

          bloquesContainer.appendChild(article);
        });
      }

      setText("cms-mision-kicker", historia.mision_kicker);
      setText("cms-mision-title", historia.mision_titulo);
      setText("cms-mision-desc", historia.mision_descripcion);

      const principiosContainer = document.getElementById("cms-mision-principios");
      if (principiosContainer && hasItems(historia.mision_principios)) {
        principiosContainer.innerHTML = "";

        historia.mision_principios.forEach((item) => {
          const article = createEl("article");
          article.appendChild(createEl("span", "", item.numero));
          article.appendChild(createEl("h3", "", item.titulo));
          article.appendChild(createEl("p", "", item.descripcion));
          principiosContainer.appendChild(article);
        });
      }

      const valoresContainer = document.getElementById("cms-historia-valores");
      if (valoresContainer && hasItems(historia.valores)) {
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
      setText("cms-contact-badge", contacto.badge);
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

      setText("cms-contact-cotizar-title", contacto.cotizar_titulo);
      setText("cms-contact-cotizar-desc", contacto.cotizar_descripcion);
      renderList("cms-contact-cotizar-list", contacto.cotizar_lista);
    }

    /* CAPACIDADES GENERAL */
    const capacidades = await fetchJson("/content/paginas/capacidades.json");

    if (capacidades) {
      setText("cms-cap-badge", capacidades.badge);
      setText("cms-cap-title", capacidades.titulo);
      setText("cms-cap-desc", capacidades.descripcion);

      const badgesContainer = document.getElementById("cms-cap-badges");

      if (badgesContainer && hasItems(capacidades.badges)) {
        badgesContainer.innerHTML = "";

        capacidades.badges.forEach((badge) => {
          badgesContainer.appendChild(createEl("span", "cap-pill", badge));
        });
      }

      const capList = document.getElementById("cms-cap-list");

      if (capList && hasItems(capacidades.capacidades)) {
        capList.innerHTML = "";

        capacidades.capacidades.forEach((item) => {
          const capability = createEl("div", "capability");
          capability.setAttribute("data-cap-card", "");

          const text = createEl("div", "capability-text");

          if (item.titulo) {
            text.appendChild(createEl("h3", "", item.titulo));
          }

          if (item.descripcion) {
            text.appendChild(createEl("p", "", item.descripcion));
          }

          if (item.link) {
            const link = createEl(
              "a",
              "capability-link",
              `${item.link_texto || "Ver capacidad"} →`
            );

            link.setAttribute("href", item.link);
            text.appendChild(link);
          }

          capability.appendChild(text);

          if (item.imagen) {
            const imageWrap = createEl("div", "capability-image");
            const img = createEl("img");

            img.setAttribute("src", item.imagen);
            img.setAttribute(
              "alt",
              item.alt || item.titulo || "Capacidad COBYBSA"
            );
            img.setAttribute("loading", "lazy");
            img.setAttribute("decoding", "async");

            imageWrap.appendChild(img);
            capability.appendChild(imageWrap);
          }

          capList.appendChild(capability);
        });

        document.dispatchEvent(new Event("capacidadesCMSReady"));
      }

      setText("cms-cap-cta-title", capacidades.cta_titulo);
      setText("cms-cap-cta-desc", capacidades.cta_descripcion);
    }
    
    /* PROYECTOS PÁGINA */
    const proyectosPagina = await fetchJson("/content/paginas/proyectos.json");

    if (proyectosPagina) {
      setText("cms-proyectos-badge", proyectosPagina.badge);
      setText("cms-proyectos-title", proyectosPagina.titulo);
      setText("cms-proyectos-desc", proyectosPagina.descripcion);
      setText("cms-proyectos-cta-title", proyectosPagina.cta_titulo);
      setText("cms-proyectos-cta-desc", proyectosPagina.cta_descripcion);
      setText("cms-proyectos-cta-text", proyectosPagina.cta_texto);
      setHref("cms-proyectos-cta", proyectosPagina.cta_link);
    }

    /* CAPACIDADES ESPECÍFICAS */
    await renderCapabilityPage("/content/paginas/corte-laser-industrial.json", "laser");
    await renderCapabilityPage("/content/paginas/corte-cnc-industrial.json", "cnc");
    await renderCapabilityPage("/content/paginas/manufactura-industrial.json", "manufactura");
    await renderCapabilityPage("/content/paginas/ingenieria-de-precision.json", "precision");
    await renderCapabilityPage("/content/paginas/diseno-y-modelado-3d-industrial.json", "diseno");

  } catch (err) {
    console.error("Error cargando contenido CMS:", err);
  }
})();
