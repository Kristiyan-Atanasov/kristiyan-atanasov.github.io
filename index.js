(() => {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnngynbd';
  const THANK_YOU_URL = 'https://astroinsights.io/thank-you.html';
  const LANG_KEY = 'astroLang';
  const COOKIE_KEY = 'cookieConsent';

  const translations = {
    en: {
      contact: 'Contact Us',
      eyebrow: 'Personalized astrology for growth',
      waitlistLabel: 'Get notified at launch',
      waitlistPlaceholder: 'Enter your email',
      waitlistBtn: 'Notify me',
      waitlistHint: 'Be first to know when we launch',
      waitlistOk: 'You’re on the list. We’ll be in touch.',
      waitlistErr: 'Something went wrong. Please try again.',
      f1Title: 'Daily Insight',
      f1Desc: 'A personalized message each day from the qualities you’re working on.',
      f2Title: 'Your Astrowheel',
      f2Desc: 'Explore all twelve archetypes with your active growth signs highlighted.',
      f3Title: 'Archetype Lessons',
      f3Desc: 'Activate Learning and Balancing qualities and track your progress.',
      f4Title: 'Birth Chart & Transits',
      f4Desc: 'See your natal wheel, Sun–Moon–Rising, and the current sky.',
      f5Title: 'People in Common',
      f5Desc: 'Meet others with similar wheels and connect through shared socials.',
      f6Title: 'Reflection Reminders',
      f6Desc: 'Choose when gentle notifications arrive for self-reflection.',
      f7Title: 'Your Birth Profile',
      f7Desc: 'Build your chart from birth data — in English or Bulgarian.',
      f8Title: 'Premium Access',
      f8Desc: 'Start a free trial to unlock every archetype and quality.',
      comingSoon: 'Coming soon to App Store & Google Play',
      privacy: 'Privacy',
      terms: 'Terms',
      deleteAccount: 'Delete account',
      contactTitle: 'Contact Astroinsights',
      contactName: 'Your Name',
      contactNamePh: 'Enter your name',
      contactMsg: 'Message',
      contactMsgPh: 'Type your message',
      contactSend: 'Send',
      contactErr: 'Something went wrong. Please try again.',
      cookies:
        'This site uses cookies to improve your experience. By continuing, you agree to our <a href="privacy.html">Privacy Policy</a>.',
      accept: 'Accept',
    },
    bg: {
      contact: 'Свържете се',
      eyebrow: 'Персонализирана астрология за растеж',
      waitlistLabel: 'Уведомете ме при старт',
      waitlistPlaceholder: 'Въведете имейл',
      waitlistBtn: 'Уведоми ме',
      waitlistHint: 'Научете първи кога стартираме',
      waitlistOk: 'Ве сте в списъка. Ще се свържем с вас.',
      waitlistErr: 'Нещо се обърка. Опитайте отново.',
      f1Title: 'Дневен Insight',
      f1Desc: 'Персонализирано послание всеки ден според качествата, върху които работите.',
      f2Title: 'Вашето астроколело',
      f2Desc: 'Разгледайте всички дванадесет архетипа с активните ви знаци.',
      f3Title: 'Уроци по архетипи',
      f3Desc: 'Активирайте Learning и Balancing качества и следете напредъка си.',
      f4Title: 'Карта и транзити',
      f4Desc: 'Вижте наталната си карта, Слънце–Луна–Асцендент и текущото небе.',
      f5Title: 'Хора с общо',
      f5Desc: 'Срещнете други със сходни колела и се свържете чрез социални профили.',
      f6Title: 'Напомняния',
      f6Desc: 'Изберете кога да получавате нежни известия за саморефлексия.',
      f7Title: 'Профил на раждане',
      f7Desc: 'Създайте картата си от данни за раждане — на английски или български.',
      f8Title: 'Premium достъп',
      f8Desc: 'Започнете безплатен пробен период за всички архетипи и качества.',
      comingSoon: 'Очаквайте скоро в App Store и Google Play',
      privacy: 'Поверителност',
      terms: 'Условия',
      deleteAccount: 'Изтрий профила',
      contactTitle: 'Контакт с Astroinsights',
      contactName: 'Вашето име',
      contactNamePh: 'Въведете името си',
      contactMsg: 'Съобщение',
      contactMsgPh: 'Напишете съобщението',
      contactSend: 'Изпрати',
      contactErr: 'Нещо се обърка. Опитайте отново.',
      cookies:
        'Този сайт използва бисквитки, за да подобри преживяването ви. Продължавайки, се съгласявате с нашата <a href="privacy.html">Политика за поверителност</a>.',
      accept: 'Приемам',
    },
  };

  const dict = (lang) => translations[lang] || translations.en;

  const currentLang = () => localStorage.getItem(LANG_KEY) || 'en';

  function applyLanguage(lang) {
    const copy = dict(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (copy[key] != null) el.textContent = copy[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (copy[key] != null) el.setAttribute('placeholder', copy[key]);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (copy[key] != null) el.innerHTML = copy[key];
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    localStorage.setItem(LANG_KEY, lang);
  }

  async function submitFormspree(form) {
    const response = await fetch(form.action || FORMSPREE_ENDPOINT, {
      method: form.method || 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    return response.ok;
  }

  function initLanguage() {
    applyLanguage(currentLang());

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  function initContactModal() {
    const openBtn = document.getElementById('openContact');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('contactModal');
    if (!openBtn || !closeBtn || !modal) return;

    const open = () => modal.classList.add('active');
    const close = () => modal.classList.remove('active');

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const copy = dict(currentLang());
      try {
        const ok = await submitFormspree(form);
        if (ok) {
          window.location.href = THANK_YOU_URL;
          return;
        }
        alert(copy.contactErr);
      } catch {
        alert(copy.contactErr);
      }
    });
  }

  function initWaitlist() {
    const form = document.getElementById('waitlistForm');
    const status = document.getElementById('waitlistStatus');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const copy = dict(currentLang());
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;

      try {
        const ok = await submitFormspree(form);
        if (status) {
          status.hidden = false;
          status.textContent = ok ? copy.waitlistOk : copy.waitlistErr;
          status.className = `waitlist-status ${ok ? 'is-ok' : 'is-err'}`;
        }
        if (ok) form.reset();
      } catch {
        if (status) {
          status.hidden = false;
          status.textContent = copy.waitlistErr;
          status.className = 'waitlist-status is-err';
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  function initCookieConsent() {
    const acceptBtn = document.getElementById('acceptCookies');
    const banner = document.getElementById('cookieConsent');
    if (!acceptBtn || !banner) return;

    if (localStorage.getItem(COOKIE_KEY) === 'accepted') {
      banner.classList.add('cookie-consent-hidden');
    } else {
      banner.classList.remove('cookie-consent-hidden');
    }

    acceptBtn.addEventListener('click', () => {
      banner.classList.add('cookie-consent-hidden');
      localStorage.setItem(COOKIE_KEY, 'accepted');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initContactModal();
    initContactForm();
    initWaitlist();
    initCookieConsent();
  });
})();
