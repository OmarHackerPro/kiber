/**
 * Search help tooltip (positioned at body level)
 */
(function() {
  'use strict';
  var wrap = document.getElementById('searchHelpWrap');
  var popup = document.getElementById('search-help-tooltip-popup');
  if (!wrap || !popup) return;
  function showTooltip() {
    var rect = wrap.getBoundingClientRect();
    var w = popup.offsetWidth || 240;
    var shiftLeft = 60;
    popup.style.left = (rect.left + rect.width / 2 - w / 2 - shiftLeft) + 'px';
    popup.style.top = (rect.bottom + 8) + 'px';
    popup.classList.add('is-visible');
  }
  wrap.addEventListener('mouseenter', showTooltip);
  wrap.addEventListener('mouseleave', function() { popup.classList.remove('is-visible'); });
})();
