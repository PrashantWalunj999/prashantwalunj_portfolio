/* =============================================
   DARK MODE
   ============================================= */
const darkToggle = document.getElementById('dark-toggle');
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

/* =============================================
   SCROLL PROGRESS BAR + NAV STATE
   ============================================= */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / maxScroll) * 100}%`;

  // Navbar shadow
  document.getElementById('navbar').classList.toggle('scrolled', scrolled > 10);

  // Back to top visibility
  backToTopBtn.classList.toggle('visible', scrolled > 400);

  // Active nav highlight
  let current = '';
  document.querySelectorAll('section[id]').forEach((s) => {
    if (scrolled >= s.offsetTop - 110) current = s.id;
  });
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
    a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
  });
});

/* =============================================
   BACK TO TOP
   ============================================= */
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =============================================
   ABOUT MODAL
   ============================================= */
const aboutModal   = document.getElementById('about-modal');
const aboutTrigger = document.getElementById('about-trigger');
const aboutClose   = document.getElementById('about-modal-close');

const openModal = () => {
  aboutModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeModal = () => {
  aboutModal.classList.remove('open');
  document.body.style.overflow = '';
};

if (aboutTrigger) aboutTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
if (aboutClose)   aboutClose.addEventListener('click', closeModal);
if (aboutModal)   aboutModal.addEventListener('click', (e) => { if (e.target === aboutModal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* =============================================
   HERO ENTRANCE — staggered on load
   ============================================= */
const heroEls = [
  '.hero-badge',
  '.hero-name',
  '.hero-title',
  '.hero-summary',
  '.hero-contact',
  '.hero-actions',
  '.hero-graphic',
];

heroEls.forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = sel === '.hero-graphic' ? 'scale(0.92)' : 'translateY(22px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  el.style.transitionDelay = `${0.1 + i * 0.1}s`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = sel === '.hero-graphic' ? 'scale(1)' : 'translateY(0)';
  }));
});

/* =============================================
   TYPEWRITER — cycling hero title
   ============================================= */
const titleEl = document.querySelector('.hero-title');
if (titleEl) {
  const roles = ['DevOps Engineer', 'DevSecOps Engineer', 'Cloud Engineer'];
  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  titleEl.textContent = '';
  titleEl.classList.add('typewriter');

  const type = () => {
    const current = roles[roleIndex];
    if (isDeleting) {
      charIndex--;
      titleEl.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    } else {
      charIndex++;
      titleEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        titleEl.classList.add('typewriter-done');
        setTimeout(() => {
          isDeleting = true;
          titleEl.classList.remove('typewriter-done');
          type();
        }, 2400);
        return;
      }
      setTimeout(type, 65);
    }
  };
  setTimeout(type, 800);
}

/* =============================================
   CONTACT FORM — mailto handler
   ============================================= */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const body =
      `Hi Prashant,\n\n` +
      `My name is ${name} and I'm reaching out via your portfolio.\n` +
      `Contact: ${email}\n\n` +
      `${message}\n\n` +
      `Best regards,\n${name}`;

    window.location.href =
      `mailto:prashantwalunj@outlook.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}

/* =============================================
   ANIMATED STAT COUNTERS
   ============================================= */
function animateCounter(el, target, duration = 1600) {
  const isFloat = target % 1 !== 0;
  const suffix  = el.dataset.suffix || '';
  const prefix  = el.dataset.prefix || '';
  let start     = null;

  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const val      = isFloat ? (eased * target).toFixed(2) : Math.round(eased * target);
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const numEl = entry.target.querySelector('.stat-number');
    if (!numEl || numEl.dataset.counted) return;
    numEl.dataset.counted = '1';
    const raw   = numEl.textContent.trim();
    const match = raw.match(/^([^\d]*)(\d+\.?\d*)([^\d]*)$/);
    if (!match) return;
    const [, pre, num, suf] = match;
    numEl.dataset.prefix = pre;
    numEl.dataset.suffix = suf;
    animateCounter(numEl, parseFloat(num));
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach((el) => statsObserver.observe(el));

/* =============================================
   SCROLL REVEAL — cards & timeline items
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

['.skill-card', '.timeline-item', '.edu-card', '.cert-card'].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(el);
  });
});

/* =============================================
   BUTTON RIPPLE
   ============================================= */
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* =============================================
   SKILL ICON BOUNCE on card hover
   ============================================= */
document.querySelectorAll('.skill-card').forEach((card) => {
  const icon = card.querySelector('.skill-icon');
  if (!icon) return;
  card.addEventListener('mouseenter', () => icon.classList.add('icon-bounce'));
  icon.addEventListener('animationend',  () => icon.classList.remove('icon-bounce'));
});

/* =============================================
   SECTION HEADER REVEAL
   ============================================= */
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header').forEach((el) => headerObserver.observe(el));
