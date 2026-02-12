/**
 * Theme toggle (dark/light) – simple custom sun SVG + moon; CSS shows which icon by html.theme-light
 */
(function() {
  'use strict';
  var themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  var iconWrap = themeToggle.querySelector('.theme-icon');
  var stored = localStorage.getItem('theme');
  if (stored === 'light') document.documentElement.classList.add('theme-light');
  themeToggle.addEventListener('click', function() {
    if (!iconWrap) return;
    iconWrap.classList.add('theme-icon-animate');
    var half = 300;
    setTimeout(function() {
      document.documentElement.classList.toggle('theme-light');
      localStorage.setItem('theme', document.documentElement.classList.contains('theme-light') ? 'light' : 'dark');
    }, half);
    iconWrap.addEventListener('animationend', function removeAnim() {
      iconWrap.removeEventListener('animationend', removeAnim);
      iconWrap.classList.remove('theme-icon-animate');
    }, { once: true });
  });
})();
