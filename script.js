

(function () {
  'use strict';

  // ── Theme Toggle ─────────────────────────────────────────────
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('themeToggle');
  const THEME_KEY    = 'nd-portfolio-theme';

  // Load saved preference, fallback to dark
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });


  // ── Sticky Header Shadow ─────────────────────────────────────
  const header = document.querySelector('.site-header');

  function onScroll () {
    if (!header) return;
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 1px 0 0 var(--border), 0 8px 32px rgba(0,0,0,0.25)';
    } else {
      header.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  // ── Smooth Anchor Scroll ─────────────────────────────────────
  // Offset for fixed header height
  const HEADER_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip placeholder links

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });
    });
  });


  // ── Scroll-Reveal: IntersectionObserver ──────────────────────
  // Cards and blocks animate in when scrolled into view
  const revealElements = document.querySelectorAll(
    '.project-card, .skills-block, .contact-form, .contact-aside'
  );

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Set initial hidden state
    revealElements.forEach((el, i) => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(28px)';
      el.style.transition = `opacity 0.55s ease ${(i % 3) * 0.1}s, transform 0.55s ease ${(i % 3) * 0.1}s`;
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  }


  // ── Active Nav Highlighting ───────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function highlightNav () {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - HEADER_OFFSET - 20;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.style.color = href === current ? 'var(--text-primary)' : '';
      link.style.background = href === current ? 'var(--accent-dim)' : '';
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav(); // Run once on load


  // ── Contact Form: Basic UX feedback ──────────────────────────
  const form = document.querySelector('.contact-form');

  form?.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML  = '<i class="fa-solid fa-check"></i> Message Sent!';
    btn.style.background = '#22c55e';
    btn.disabled   = true;

    setTimeout(() => {
      btn.innerHTML  = orig;
      btn.style.background = '';
      btn.disabled   = false;
      form.reset();
    }, 3000);
  });

})();
