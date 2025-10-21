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
      cookieBanner.style.display = 'flex';
    } else {
      cookieBanner.style.display = 'none';
    }

    acceptBtn.onclick = function() {
      cookieBanner.style.display = 'none';
      localStorage.setItem('cookieConsent', 'accepted');
    };
  }


  /*** PARALLAX SKY BACKGROUND EFFECT ***/
  const bg = document.querySelector('.main-bg');
  let idleAngle = 0;

  if (bg) {
    // Mouse movement parallax
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      const moveX = x * 20;
      const moveY = y * 20;

      bg.style.backgroundPosition = `${50 + moveX / 10}% ${50 + moveY / 10}%`;
    });

    // Subtle idle motion when mouse is not moving
    setInterval(() => {
      idleAngle += 0.02;
      const offsetX = Math.sin(idleAngle) * 1.5;
      const offsetY = Math.cos(idleAngle) * 1.5;
      bg.style.backgroundPosition = `${50 + offsetX}% ${50 + offsetY}%`;
    }, 50);
  }
});
