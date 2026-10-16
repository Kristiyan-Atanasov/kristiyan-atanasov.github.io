(() => {
  const API_BASE = 'https://yrfz6x9dl1.execute-api.eu-central-1.amazonaws.com/dev';
  const GOOGLE_CLIENT_ID = '154762470670-dma1hg357n6n48ishn1b4gjodo33v08r.apps.googleusercontent.com';
  const LANG_KEY = 'astroLang';
  const ACCESS_KEY = 'astroAccessToken';
  const REFRESH_KEY = 'astroRefreshToken';

  const copy = {
    en: {
      home: 'Home',
      kicker: 'Account',
      title: 'Delete your account',
      lead: 'Sign in with the Google account you used in the Astroinsights app. This page only opens an account that already exists. It does not create a new one.',
      billing: 'Deleting your account does not cancel an Apple App Store or Google Play subscription. The store keeps charging until you cancel there.',
      billingTitle: 'Your subscription will keep renewing.',
      billingAfter: 'If you had a subscription, cancel it in the store. Deleting the account does not stop those charges.',
      googleLink: 'Manage Google Play subscription',
      appleLink: 'Manage App Store subscription',
      googleSignIn: 'Sign in with Google',
      inApp: 'You can also delete your account in the Astroinsights app: Profile → Edit Profile → Delete Account.',
      signedIn: 'You are signed in. Deleting the account removes the profile, birth details, and other personal data associated with it. We delete or anonymise that data within 90 days. We keep a record of the store entitlement so we can recognise an existing subscription. That is our decision, not a Google requirement. We also keep records the law requires, such as invoices.',
      confirmLabel: 'I understand this permanently deletes my Astroinsights account and does not cancel my Apple or Google Play subscription.',
      delete: 'Delete my account',
      signOut: 'Sign out',
      done: 'Your account has been deleted. You have been signed out of this page. If the app is still open, it will sign out the next time it reaches the server.',
      privacy: 'Privacy',
      terms: 'Terms',
      missing: 'Please use the sign-in method you used in the app.',
      session: 'Your session ended. Sign in again if this account still needs to be deleted.',
      working: 'Working…',
      failed: 'Something went wrong. Please try again.',
      googleUnavailable: 'Google sign-in could not be loaded. Refresh the page and try again.',
    },
    bg: {
      home: 'Начало',
      kicker: 'Профил',
      title: 'Изтрий профила',
      lead: 'Влез с Google профила, който използваш в приложението Astroinsights. Тази страница отваря само вече съществуващ профил. Не създава нов.',
      billing: 'Изтриването на профила не прекратява абонамент в Apple App Store или Google Play. Магазинът продължава да таксува, докато не го откажеш там.',
      billingTitle: 'Абонаментът ще продължи да се подновява.',
      billingAfter: 'Ако имаш абонамент, откажи го в магазина. Изтриването на профила не спира тези такси.',
      googleLink: 'Управлявай абонамента в Google Play',
      appleLink: 'Управлявай абонамента в App Store',
      googleSignIn: 'Влез с Google',
      inApp: 'Можеш също да изтриеш профила си в приложението Astroinsights: Профил → Редактирай профила → Изтрий профила.',
      signedIn: 'Влязъл си. Изтриването премахва профила, данните за раждане и другите лични данни, свързани с него. Изтриваме или анонимизираме тези данни в рамките на 90 дни. Пазим запис за абонамента в магазина, за да разпознаем съществуващ абонамент. Това е наше решение, не изискване на Google. Пазим и записи, които законът изисква, например фактури.',
      confirmLabel: 'Разбирам, че това изтрива завинаги профила ми в Astroinsights и не прекратява абонамента ми в Apple или Google Play.',
      delete: 'Изтрий профила ми',
      signOut: 'Изход',
      done: 'Профилът е изтрит. Излязъл си от тази страница. Ако приложението е още отворено, ще те изведе следващия път, когато се свърже със сървъра.',
      privacy: 'Поверителност',
      terms: 'Условия',
      missing: 'Моля, използвай начина на влизане, който използваш в приложението.',
      session: 'Сесията приключи. Влез отново, ако този профил още трябва да бъде изтрит.',
      working: 'Моля, изчакай…',
      failed: 'Нещо се обърка. Опитай отново.',
      googleUnavailable: 'Входът с Google не се зареди. Презареди страницата и опитай отново.',
    },
  };

  const lang = () => (localStorage.getItem(LANG_KEY) === 'bg' ? 'bg' : 'en');
  const text = () => copy[lang()];

  let signingIn = false;
  let deleting = false;

  function applyLanguage(next) {
    const selected = next === 'bg' ? 'bg' : 'en';
    localStorage.setItem(LANG_KEY, selected);
    document.documentElement.lang = selected;
    const strings = copy[selected];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] != null) el.textContent = strings[key];
    });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === selected;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function showStep(name) {
    document.getElementById('stepSignIn').hidden = name !== 'signIn';
    document.getElementById('stepConfirm').hidden = name !== 'confirm';
    document.getElementById('stepDone').hidden = name !== 'done';
  }

  function setStatus(message, isError) {
    const status = document.getElementById('accountStatus');
    if (!message) {
      status.hidden = true;
      status.textContent = '';
      status.className = 'account-status';
      return;
    }
    status.hidden = false;
    status.textContent = message;
    status.className = isError ? 'account-status is-error' : 'account-status';
  }

  function clearSession() {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  }

  function accessToken() {
    return sessionStorage.getItem(ACCESS_KEY);
  }

  function stopSession() {
    clearSession();
    const box = document.getElementById('confirmDelete');
    const button = document.getElementById('deleteButton');
    if (box) box.checked = false;
    if (button) button.disabled = true;
  }

  async function exchangeGoogleToken(idToken) {
    if (signingIn || !idToken) return;
    signingIn = true;
    setStatus(text().working, false);
    try {
      const res = await fetch(`${API_BASE}/authentication/social_login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          id_token: idToken,
          existing_account_only: true,
        }),
      });

      if (res.status === 404) {
        clearSession();
        showStep('signIn');
        setStatus(text().missing, true);
        return;
      }

      if (res.status === 401) {
        stopSession();
        showStep('signIn');
        setStatus(text().session, true);
        return;
      }

      if (!res.ok) {
        clearSession();
        showStep('signIn');
        setStatus(text().failed, true);
        return;
      }

      const data = await res.json();
      const access = data && (data.access || data.access_token);
      const refresh = data && (data.refresh || data.refresh_token);
      if (!access) {
        clearSession();
        showStep('signIn');
        setStatus(text().failed, true);
        return;
      }

      sessionStorage.setItem(ACCESS_KEY, access);
      if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
      else sessionStorage.removeItem(REFRESH_KEY);
      showStep('confirm');
      setStatus('', false);
    } catch {
      showStep('signIn');
      setStatus(text().failed, true);
    } finally {
      signingIn = false;
    }
  }

  async function deleteAccount() {
    const token = accessToken();
    const confirmed = document.getElementById('confirmDelete').checked;
    if (deleting || !confirmed || !token) return;
    deleting = true;
    document.getElementById('deleteButton').disabled = true;
    setStatus(text().working, false);
    try {
      const res = await fetch(`${API_BASE}/authentication/delete_account/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        stopSession();
        showStep('done');
        setStatus('', false);
        return;
      }

      if (res.status === 401) {
        stopSession();
        showStep('signIn');
        setStatus(text().session, true);
        return;
      }

      document.getElementById('deleteButton').disabled = !document.getElementById('confirmDelete').checked;
      setStatus(text().failed, true);
    } catch {
      document.getElementById('deleteButton').disabled = !document.getElementById('confirmDelete').checked;
      setStatus(text().failed, true);
    } finally {
      deleting = false;
    }
  }

  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) {
      setStatus(text().googleUnavailable, true);
      return;
    }
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        exchangeGoogleToken(response && response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false,
    });
    google.accounts.id.disableAutoSelect();
    const host = document.getElementById('googleButton');
    const shell = host.closest('.google-signin');
    const width = Math.round(shell.getBoundingClientRect().width);
    host.replaceChildren();
    google.accounts.id.renderButton(host, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      width: Math.max(240, width),
      locale: lang() === 'bg' ? 'bg' : 'en',
    });
    host.classList.add('is-ready');
  }

  function loadGoogle() {
    const script = document.createElement('script');
    script.src = `https://accounts.google.com/gsi/client?hl=${lang() === 'bg' ? 'bg' : 'en'}`;
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    script.onerror = () => setStatus(text().googleUnavailable, true);
    document.head.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(lang());
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-lang');
        if (next === lang()) return;
        localStorage.setItem(LANG_KEY, next);
        window.location.reload();
      });
    });

    document.getElementById('confirmDelete').addEventListener('change', (event) => {
      document.getElementById('deleteButton').disabled = !event.target.checked || deleting;
    });
    document.getElementById('deleteButton').addEventListener('click', deleteAccount);
    document.getElementById('signOutButton').addEventListener('click', () => {
      stopSession();
      showStep('signIn');
      setStatus('', false);
    });

    document.getElementById('googleSignIn').addEventListener('click', () => {
      setStatus(text().googleUnavailable, true);
    });

    if (accessToken()) showStep('confirm');
    else showStep('signIn');
    loadGoogle();
  });
})();
