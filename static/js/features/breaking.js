/**
 * Breaking news banner: pagination (prev/next)
 */
(function() {
  'use strict';
  var breakingPrev = document.querySelector('.breaking-prev');
  var breakingNext = document.querySelector('.breaking-next');
  var breakingHeadline = document.querySelector('.breaking-headline');
  var breakingCounter = document.querySelector('.breaking-counter');

  var breakingNews = [
    { headline: 'Critical Zero-Day in Popular VPN Software Being Actively Exploited', time: '19 minutes ago' },
    { headline: 'Major Healthcare Provider Hit by Ransomware Attack', time: '2 hours ago' },
    { headline: 'CISA Issues Emergency Directive for Federal Agencies', time: '4 hours ago' }
  ];

  var currentBreakingIndex = 0;
  var totalBreakingNews = breakingNews.length;

  function updateBreakingNews() {
    if (!breakingHeadline || !breakingCounter) return;
    var currentNews = breakingNews[currentBreakingIndex];
    breakingHeadline.innerHTML = currentNews.headline + ' <span class="breaking-time">' + currentNews.time + '</span>';
    breakingCounter.textContent = (currentBreakingIndex + 1) + '/' + totalBreakingNews;
    if (breakingPrev) {
      breakingPrev.style.opacity = currentBreakingIndex === 0 ? '0.5' : '1';
      breakingPrev.style.cursor = currentBreakingIndex === 0 ? 'not-allowed' : 'pointer';
      breakingPrev.style.pointerEvents = currentBreakingIndex === 0 ? 'none' : 'auto';
    }
    if (breakingNext) {
      breakingNext.style.opacity = currentBreakingIndex === totalBreakingNews - 1 ? '0.5' : '1';
      breakingNext.style.cursor = currentBreakingIndex === totalBreakingNews - 1 ? 'not-allowed' : 'pointer';
      breakingNext.style.pointerEvents = currentBreakingIndex === totalBreakingNews - 1 ? 'none' : 'auto';
    }
  }

  if (breakingPrev) {
    breakingPrev.addEventListener('click', function() {
      if (currentBreakingIndex > 0) {
        currentBreakingIndex--;
        updateBreakingNews();
      }
    });
  }
  if (breakingNext) {
    breakingNext.addEventListener('click', function() {
      if (currentBreakingIndex < totalBreakingNews - 1) {
        currentBreakingIndex++;
        updateBreakingNews();
      }
    });
  }
  updateBreakingNews();
})();
