import '../styles/main.scss';

import { initNavigation } from './links.js';
import { initBurger } from './burger.js';
import { initSlider } from './slider.js';
import { initTranslate } from './translate.js';
import { initFeatureBtn } from './feature.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBurger();
  initSlider();
  initTranslate();
  initFeatureBtn();
});
