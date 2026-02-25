let clickCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('click-me-btn');
  const result = document.getElementById('click-result');

  btn.addEventListener('click', () => {
    clickCount++;
    result.textContent = `You clicked ${clickCount} time${clickCount === 1 ? '' : 's'}!`;
    result.classList.add('highlight');
    setTimeout(() => result.classList.remove('highlight'), 1000);
  });
});
