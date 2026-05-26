import translations from './translations.js';

export function initTranslate() {
  function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    const currentTranslations = translations[lang];

    if (!currentTranslations) return;

    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const targetAttr = el.getAttribute('data-i18n-attr');
      const translatedValue = currentTranslations[key];

      if (!translatedValue) return;

      if (targetAttr) {
        el.setAttribute(targetAttr, translatedValue);
      } else {
        el.textContent = translatedValue;
      }
    });
  }

  const mainLangBtn = document.querySelector('.header__switch-lang');
  const langButtons = document.querySelectorAll('.header__switch-btn');

  const langList = document.querySelector('.header__switch-list');
  const langIcon = document.querySelector('.header__switch-icon');

  if (!mainLangBtn) return;

  mainLangBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = mainLangBtn.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    mainLangBtn.setAttribute('aria-expanded', nextState);

    if (langList) {
      langList.style.transform = nextState ? 'scale(1)' : 'scaleY(0)';
    }
    if (langIcon) {
      langIcon.style.transform = nextState
        ? 'rotateX(180deg)'
        : 'rotateX(0deg)';
    }

    console.log('click');
  });

  document.addEventListener('click', () => {
    mainLangBtn.setAttribute('aria-expanded', 'false');

    if (langList) langList.style.transform = 'scaleY(0)';
    if (langIcon) langIcon.style.transform = 'rotateX(0deg)';
  });

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentMainLang = mainLangBtn.getAttribute('data-lang') || 'en';
      const textNodeMain = Array.from(mainLangBtn.childNodes).find(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
      );

      const selectedLang = btn.getAttribute('lang');
      const clickedBtnText = btn.textContent.trim();

      if (selectedLang && selectedLang !== currentMainLang) {
        btn.setAttribute('lang', currentMainLang);
        btn.textContent = currentMainLang.toUpperCase();

        btn.setAttribute(
          'aria-label',
          currentMainLang === 'en'
            ? 'English'
            : currentMainLang === 'ru'
              ? 'Русский'
              : currentMainLang.toUpperCase()
        );

        if (textNodeMain) {
          textNodeMain.textContent = clickedBtnText;
        }
        mainLangBtn.setAttribute('data-lang', selectedLang);
        translatePage(selectedLang);
      }

      mainLangBtn.setAttribute('aria-expanded', 'false');
      if (langList) langList.style.transform = 'scaleY(0)';
      if (langIcon) langIcon.style.transform = 'rotateX(0deg)';
    });
  });

  console.log('translate initialized!');
}
