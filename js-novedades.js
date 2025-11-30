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
