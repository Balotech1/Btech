// ==========================================================================
// BALOTECH — site interactions
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close mobile nav after tapping a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(section => spyObserver.observe(section));
  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));
  /* ---------- Newsletter form (front-end only placeholder) ---------- */
  const form = document.getElementById('newsletter-form');
  const note = document.getElementById('newsletter-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input.value.trim()) {
      note.textContent = `Thanks — we'll send updates to ${input.value.trim()}.`;
      form.reset();
    }
  });

  /* ---------- Auto-detect image format ----------
     Any <img data-base="images/team/ayoola-bello"> tries every common
     extension automatically, so the exact file type dropped into the repo
     doesn't need to match hardcoded HTML. First one that loads wins. */
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'JPG', 'JPEG', 'PNG', 'WEBP'];

  function loadWithFallback(img) {
    const base = img.dataset.base;
    let i = 0;

    const tryNext = () => {
      if (i >= IMAGE_EXTENSIONS.length) {
        // Nothing worked — reveal whichever fallback UI applies
        img.classList.add('broken');
        const holder = img.closest('.team-photo, .portfolio-media, .service-media');
        if (holder) holder.classList.add('no-photo');
        return;
      }
      img.src = `${base}.${IMAGE_EXTENSIONS[i]}`;
      i++;
    };

    img.addEventListener('error', tryNext);
    img.addEventListener('load', () => {
      if (img.dataset.hideSibling && img.nextElementSibling) {
        img.nextElementSibling.style.display = 'none';
      }
    });

    tryNext();
  }

  document.querySelectorAll('img[data-base]').forEach(loadWithFallback);
});
