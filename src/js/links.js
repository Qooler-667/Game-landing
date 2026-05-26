export function initNavigation() {
  const navLinks = document.querySelectorAll(
    '.header__menu-link, .burger__menu-link'
  );
  const menuWrapper = document.querySelector('.burger--wrapper');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }

      if (menuWrapper && menuWrapper.classList.contains('open')) {
        const exitBtn = menuWrapper.querySelector('.burger__exit');
        if (exitBtn) {
          exitBtn.click();
        }
      }
    });
  });

  console.log('Навигация успешно инициализирована!');
}
