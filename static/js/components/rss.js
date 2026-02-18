/**
 * RSS dropdown in navbar (fixed positioning)
 */
(function() {
  'use strict';
  var rssTrigger = document.getElementById('rssTrigger');
  var rssDropdown = document.getElementById('rssDropdown');
  if (!rssTrigger || !rssDropdown) return;

  function positionRssDropdown() {
    if (!rssDropdown.classList.contains('open')) return;
    var rect = rssTrigger.getBoundingClientRect();
    rssDropdown.style.position = 'fixed';
    rssDropdown.style.top = (rect.bottom + 4) + 'px';
    rssDropdown.style.right = (window.innerWidth - rect.right) + 'px';
    rssDropdown.style.left = 'auto';
    rssDropdown.style.width = 'auto';
    rssDropdown.style.minWidth = '140px';
  }

  function closeRss() {
    rssDropdown.classList.remove('open');
    rssTrigger.setAttribute('aria-expanded', 'false');
    rssDropdown.style.position = '';
    rssDropdown.style.top = '';
    rssDropdown.style.right = '';
    rssDropdown.style.left = '';
    rssDropdown.style.width = '';
    rssDropdown.style.minWidth = '';
  }

  rssTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (rssDropdown.classList.contains('open')) closeRss();
    else {
      rssDropdown.classList.add('open');
      rssTrigger.setAttribute('aria-expanded', 'true');
      positionRssDropdown();
    }
  });
  document.addEventListener('click', function() {
    if (rssDropdown.classList.contains('open')) closeRss();
  });
  rssDropdown.addEventListener('click', function(e) { e.stopPropagation(); });
  window.addEventListener('scroll', positionRssDropdown, true);
  window.addEventListener('resize', positionRssDropdown);
})();
