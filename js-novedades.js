document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".news-track");
  const prevBtn = document.querySelector(".news-prev");
  const nextBtn = document.querySelector(".news-next");

  if (!track) return;

  function cardWidth() {
    const card = track.querySelector(".news-card");
    if (!card) return 320;
    const gap = 24;
    return card.offsetWidth + gap;
  }

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -cardWidth(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: cardWidth(), behavior: "smooth" });
  });
});

// ===============================
// Carrusel para proyectos COBYBSA
// ===============================
function scrollProyecto(id, direction) {
    const track = document.getElementById(id);
    if (!track) return;

    // Calcula el ancho de la tarjeta
    const card = track.querySelector(".project-image img");
    if (!card) return;

    const gap = 16; // ajustalo si tu CSS usa otro gap
    const scrollAmount = card.offsetWidth + gap;

    track.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth"
    });
}

