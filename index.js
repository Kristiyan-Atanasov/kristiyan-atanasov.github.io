document.addEventListener('DOMContentLoaded', function() {
  /*** CONTACT MODAL ***/
  const openBtn = document.getElementById('openContact');
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('contactModal');

  openBtn.onclick = function() {
    modal.classList.add('active');
  };

  closeBtn.onclick = function() {
    modal.classList.remove('active');
  };

  modal.onclick = function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  };

  /*** FORM SUBMISSION WITH REDIRECT ***/
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        window.location.href = 'https://astroinsights.io/thank-you.html';
      } else {
        alert('Oops! There was a problem submitting your form');
      }
    }).catch(() => {
      alert('Oops! There was a problem submitting your form');
    });
  });

  /*** COOKIE CONSENT ***/
  const acceptBtn = document.getElementById('acceptCookies');
  const cookieBanner = document.getElementById('cookieConsent');

  if (acceptBtn && cookieBanner) {
    if (localStorage.getItem('cookieConsent') !== 'accepted') {
      cookieBanner.classList.remove('cookie-consent-hidden');
    } else {
      cookieBanner.classList.add('cookie-consent-hidden');
    }

    acceptBtn.onclick = function() {
      cookieBanner.classList.add('cookie-consent-hidden');
      localStorage.setItem('cookieConsent', 'accepted');
    };
  }
});
