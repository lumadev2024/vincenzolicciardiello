// A consent-aware adapter may forward site:conversion to GA4/GTM.
// Payloads contain fixed identifiers only, never form values or link URLs.
const emitConversion = (event, el, extra = {}) => document.dispatchEvent(new CustomEvent('site:conversion', {detail: {
  event, page_path: location.pathname,
  cta_location: el?.dataset.cta || el?.closest('section')?.id || (el?.closest('.footer') ? 'footer' : 'content'),
  service: el?.dataset.service || document.body.dataset.service || '',
  location: el?.dataset.location || document.body.dataset.location || '', ...extra
}}));
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
const mobile = matchMedia('(max-width: 1100px)');
const setNav = (open, restore = false) => {
  if (!nav || !burger) return;
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  nav.inert = mobile.matches && !open;
  if (restore) burger.focus();
};
if (burger && nav) {
  setNav(false);
  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) setNav(false); });
  document.addEventListener('keydown', e => {
    if (!mobile.matches || !nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') setNav(false, true);
    if (e.key === 'Tab') {
      const items = [burger, ...nav.querySelectorAll('a, button')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => setNav(false));
}
document.querySelectorAll('[data-open]').forEach(btn => {
  const dlg = document.getElementById(btn.dataset.open);
  if (!dlg) return;
  btn.addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('close', () => btn.focus());
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) dlg.close();
    if (e.target === dlg) {
      const box = dlg.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dlg.close();
    }
  });
});
const links = [...document.querySelectorAll('.nav__list a')].filter(a => a.getAttribute('href').startsWith('#'));
if (links.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => {
      if (a.hash === '#' + en.target.id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }), {rootMargin: '-25% 0px -50% 0px'});
  links.forEach(a => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (a.dataset.cta) emitConversion('cta_click', a);
  const event = a.dataset.event || (href.startsWith('https://wa.me/') ? 'whatsapp_click' : href.startsWith('tel:') ? 'phone_click' : href.startsWith('mailto:') ? 'email_click' : href.includes('google.com/maps') ? 'location_click' : '');
  if (event) emitConversion(event, a);
  if (!event && a.dataset.service && !href.startsWith('https://wa.me/')) emitConversion('service_click', a);
  if (href.startsWith('https://wa.me/') && document.body.dataset.service) emitConversion('service_cta_click', a);
  if (href.startsWith('https://wa.me/') && /prenota/i.test(a.textContent)) emitConversion('booking_click', a);
  if (href.startsWith('https://wa.me/') && a.closest('#recensioni')) emitConversion('review_cta_click', a);
});
const form = document.getElementById('wa-form');
if (form) {
  const status = document.getElementById('form-status');
  const name = form.elements.nome;
  let submitting = false;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitting) return;
    if (!name.value.trim()) {
      status.classList.remove('is-ok');
      name.setAttribute('aria-invalid', 'true');
      status.textContent = 'Inserisci il tuo nome per preparare il messaggio.';
      name.focus(); return;
    }
    name.removeAttribute('aria-invalid');
    status.classList.add('is-ok');
    submitting = true;
    setTimeout(() => { submitting = false; }, 1000);
    const f = new FormData(form);
    const text = 'Buongiorno Dott. Licciardiello, sono ' + name.value.trim() + '.' +
      (f.get('sport') ? ' Pratico ' + String(f.get('sport')).trim() + '.' : '') +
      ' Obiettivo: ' + f.get('obiettivo') + '. Studio preferito: ' + f.get('studio') + '.' +
      (f.get('msg') ? ' ' + String(f.get('msg')).trim() : '') + ' Vorrei informazioni su una visita.';
    const href = 'https://wa.me/393425105288?text=' + encodeURIComponent(text);
    const fallback = document.getElementById('form-fallback');
    fallback.href = href; fallback.hidden = false;
    window.open(href, '_blank', 'noopener,noreferrer');
    status.textContent = 'Messaggio preparato. Completa l’invio su WhatsApp. Se non si apre, usa il link qui sotto.';
    const selection = {location: form.elements.studio.selectedOptions[0].dataset.location || ''};
    emitConversion('contact_form_submit', form, selection);
    emitConversion('whatsapp_click', form, selection);
  });
  name.addEventListener('input', () => { name.removeAttribute('aria-invalid'); status.textContent = ''; });
}
const hdr = document.querySelector('.header');
const dock = document.querySelector('.dock');
if (hdr) {
  const onScroll = () => {
    hdr.classList.toggle('is-solid', scrollY > 24);
    if (dock) {
      dock.classList.toggle('is-on', scrollY > 320);
      dock.inert = scrollY <= 320;
    }
  };
  onScroll(); addEventListener('scroll', onScroll, {passive: true});
}
// No automatic forwarding: install one consent-aware adapter, for either GTM
// or GA4, once the provider and consent configuration are supplied.
if (document.body.dataset.service) emitConversion('service_view', document.body);
if (form) {
  form.addEventListener('focusin', () => emitConversion('form_start', form), {once: true});
}
// Anteprima locale (file://): le cartelle non aprono index.html da sole, quindi i link alle
// pagine interne finirebbero nell'elenco dei file. In produzione (http/https) non cambia nulla.
if (location.protocol === 'file:') {
  document.querySelectorAll('a[href]').forEach(a => {
    if (a.target === '_blank' || a.protocol !== 'file:' || !a.pathname.endsWith('/')) return;
    a.pathname += 'index.html';
  });
}
// Carosello dei video: un video alla volta, frecce e elenco delle domande.
// Parte da solo quando il video e' in vista, riparte con "Prossimo video" e si ferma quando si esce.
document.querySelectorAll('[data-vcar]').forEach(root => {
  const slides = [...root.querySelectorAll('.vslide')];
  const items = [...root.querySelectorAll('[data-go]')];
  const cur = root.querySelector('[data-cur]'), q = root.querySelector('[data-qt]'), d = root.querySelector('[data-dt]');
  const sound = root.querySelector('[data-sound]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, inView = false, userPaused = false;
  const vid = () => slides[i].querySelector('video');
  const track = (event) => { if (typeof emitConversion === 'function') emitConversion(event, root, {service: 'video-' + (i + 1)}); };
  const syncSound = () => { const v = vid(); if (sound) sound.hidden = !(v && !v.paused && v.muted); };
  const pauseAll = () => { slides.forEach(s => { const v = s.querySelector('video'); if (v && !v.paused) { v.dataset.ours = '1'; v.pause(); } }); syncSound(); };
  // Prima con audio; se il browser lo blocca, parte muto e compare "Attiva l'audio".
  const play = () => {
    const v = vid(); if (!v) return;
    userPaused = false; v.muted = false;
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().then(syncSound).catch(() => {}); });
  };
  const show = (n, byUser = true) => {
    pauseAll();
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.hidden = k !== i; });
    items.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    cur.textContent = String(i + 1); q.textContent = slides[i].dataset.q; d.textContent = slides[i].dataset.d;
    if (byUser) { track('video_next'); play(); }
  };
  root.querySelector('[data-next]').addEventListener('click', () => show(i + 1));
  root.querySelector('[data-prev]').addEventListener('click', () => show(i - 1));
  items.forEach(b => b.addEventListener('click', () => show(Number(b.dataset.go))));
  if (sound) sound.addEventListener('click', () => { const v = vid(); if (v) { v.muted = false; syncSound(); } });
  slides.forEach((s, k) => {
    const v = s.querySelector('video'); if (!v) return;
    v.addEventListener('play', () => { i = k; syncSound(); }, {once: false});
    v.addEventListener('playing', () => { if (!v.dataset.tracked) { v.dataset.tracked = '1'; track('video_play'); } });
    v.addEventListener('pause', () => { if (v.dataset.ours) delete v.dataset.ours; else if (!v.ended) userPaused = true; syncSound(); });
    v.addEventListener('volumechange', syncSound);
    v.addEventListener('ended', syncSound);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries.forEach(en => {
      if (en.intersectionRatio >= 0.5 && !inView) { inView = true; if (!reduce && !userPaused) play(); }
      else if (en.intersectionRatio < 0.25 && inView) { inView = false; pauseAll(); userPaused = false; }
    }), {threshold: [0, 0.25, 0.5, 0.75]}).observe(root.querySelector('.vcar__stage'));
  }
});
