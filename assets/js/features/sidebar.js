/**
 * Sidebar: newsletter close, frequency buttons (Daily/Weekly), email subscribe
 */
(function() {
  'use strict';
  var sidebarClose = document.querySelector('.sidebar-close');
  var newsletterCard = document.querySelector('.newsletter-card');
  if (sidebarClose && newsletterCard) {
    sidebarClose.addEventListener('click', function() {
      newsletterCard.classList.add('hidden');
    });
  }

  var freqButtons = document.querySelectorAll('.freq-btn');
  var newsletterInput = document.querySelector('.newsletter-input');
  freqButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      freqButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  if (newsletterInput) {
    newsletterInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        var email = this.value.trim();
        var activeFreqBtn = document.querySelector('.freq-btn.active');
        var frequency = activeFreqBtn ? activeFreqBtn.textContent.trim().toLowerCase() : 'daily';
        if (email && email.indexOf('@') !== -1) {
          alert('Thank you for subscribing! You will receive ' + frequency + ' security digests at ' + email);
          this.value = '';
        } else {
          alert('Please enter a valid email address');
        }
      }
    });
  }
})();
