export function initFeatureBtn() {
  const list = document.querySelector('.feature__list');

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('.feature__item-btn');
    if (!btn) return;

    const item = btn.closest('.feature__list-item');
    const content = item.querySelector('.feature__item-content');
    const isActive = item.classList.contains('active');

    list.querySelectorAll('.feature__list-item').forEach((el) => {
      el.classList.remove('active');
      el.querySelector('.feature__item-content').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}
