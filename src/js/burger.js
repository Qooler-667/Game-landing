export function initBurger() {
  const burgerBtn = document.querySelector('.burger__btn');
  const exitBtn = document.querySelector('.burger__exit');
  const menuWrapper = document.querySelector('.burger--wrapper');

  if (!menuWrapper || !burgerBtn) return;

  const toggleMenu = (isOpen) => {
    menuWrapper.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    burgerBtn.setAttribute('aria-expanded', isOpen);
    menuWrapper.setAttribute('aria-hidden', !isOpen);

    // Возвращаем фокус при закрытии
    if (!isOpen) burgerBtn.focus();
  };

  // Слушатели событий
  burgerBtn.addEventListener('click', () => toggleMenu(true));

  if (exitBtn) {
    exitBtn.addEventListener('click', () => toggleMenu(false));
  }

  menuWrapper.addEventListener('click', (e) => {
    if (e.target === menuWrapper) toggleMenu(false);
  });

  // Теперь событие Esc работает корректно, так как menuWrapper уже определен
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuWrapper.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  console.log('Бургер-меню успешно инициализировано!');
}
