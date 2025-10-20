document.addEventListener('DOMContentLoaded', function() {
  // Show modal
  document.getElementById('openContact').onclick = function() {
    document.getElementById('contactModal').classList.add('active');
  };
  // Hide modal
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('contactModal').classList.remove('active');
  };
  // Close modal when clicking outside form
  document.getElementById('contactModal').onclick = function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  };
  
  // Form submission with manual redirect
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
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

  // Cookie consent dismiss
  const acceptBtn = document.getElementById('acceptCookies');
  const cookieBanner = document.getElementById('cookieConsent');
  
  if (acceptBtn && cookieBanner) {
    acceptBtn.onclick = function() {
      cookieBanner.style.display = 'none';
      localStorage.setItem('cookieConsent', 'accepted');
    };
  
    if (localStorage.getItem('cookieConsent') === 'accepted') {
      cookieBanner.style.display = 'none';
    }
  }
});
