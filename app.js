// ===== TrendHive Digital — SPA Script =====

(function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero, .section-alt, .cta-banner');
  const allSections = document.querySelectorAll('[id]');
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  // ---------- Scroll: header shadow ----------
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ---------- Active nav on scroll ----------
  const sectionIds = ['home', 'services', 'pricing', 'about', 'contact'];

  function updateActiveLink() {
    let current = '';
    sectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) current = id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---------- Smooth scroll for all internal links ----------
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    e.preventDefault();
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    nav.classList.remove('open');
  });

  // ---------- Mobile menu ----------
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('open');
    }
  });

  // ---------- Contact form ----------
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Add loading state
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Request sent! We\'ll be in touch within 24 hours.');
        contactForm.reset();
      } else {
        showToast('Error sending message. Please try again.');
        console.error(data.error);
      }
    } catch (err) {
      showToast('Connection error. Please try again later.');
      console.error(err);
    } finally {
      // Restore button state
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  // ---------- Toast ----------
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ---------- Scroll Reveal ----------
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  }

  // ---------- Stagger service cards ----------
  function staggerCards() {
    document.querySelectorAll('.service-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });
    document.querySelectorAll('.pricing-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  }

  // ---------- Init ----------
  updateActiveLink();
  staggerCards();
  initReveal();
})();
