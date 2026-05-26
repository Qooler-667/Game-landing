export function initSlider() {
  const cards = Array.from(document.querySelectorAll('.about__slider-card'));
  const track = document.querySelector('.about__slider-track');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  let currentIndex = 0;

  function updateSlider(activeIndex) {
    if (!track) return;

    const cardWidth = cards[0].offsetWidth;
    const offset = cardWidth * 0.08;

    cards.forEach((card, i) => {
      let pos = i - activeIndex;
      let displayPos = pos > 2 ? 2 : pos < -2 ? -2 : pos;

      card.style.transform = `translateX(${displayPos * offset}px) scale(${1 - Math.abs(displayPos) * 0.05})`;
      card.style.zIndex = 10 - Math.abs(displayPos);
      card.style.opacity = pos > 3 || pos < -2 ? 0 : 1;
    });
  }

  window.addEventListener('resize', () => updateSlider(currentIndex));

  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateSlider(currentIndex);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider(currentIndex);
    }
  });

  updateSlider(0);
}
