/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const progressBar = document.createElement("div");
progressBar.id = "scroll-progress";
document.body.prepend(progressBar);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / maxScroll) * 100}%`;

  // Navbar shadow
  document.getElementById("navbar").classList.toggle("scrolled", scrolled > 10);

  // Active nav highlight
  let current = "";
  document.querySelectorAll("section[id]").forEach((s) => {
    if (scrolled >= s.offsetTop - 110) current = s.id;
  });
  document.querySelectorAll(".nav-links a[href^='#']").forEach((a) => {
    a.classList.toggle("active-link", a.getAttribute("href") === `#${current}`);
  });
});

/* =============================================
   HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* =============================================
   HERO ENTRANCE — staggered on load
   ============================================= */
const heroEls = [
  ".hero-badge",
  ".hero-name",
  ".hero-title",
  ".hero-summary",
  ".hero-contact",
  ".hero-actions",
  ".hero-graphic",
];

heroEls.forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = "0";
  el.style.transform = sel === ".hero-graphic" ? "scale(0.92)" : "translateY(22px)";
  el.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
  el.style.transitionDelay = `${0.1 + i * 0.1}s`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = sel === ".hero-graphic" ? "scale(1)" : "translateY(0)";
  }));
});

/* =============================================
   TYPEWRITER — hero title
   ============================================= */
const titleEl = document.querySelector(".hero-title");
if (titleEl) {
  const text = titleEl.textContent.trim();
  titleEl.textContent = "";
  titleEl.classList.add("typewriter");

  let i = 0;
  const type = () => {
    if (i < text.length) {
      titleEl.textContent += text[i++];
      setTimeout(type, 55);
    } else {
      titleEl.classList.add("typewriter-done");
    }
  };
  setTimeout(type, 750); // start after hero entrance
}

/* =============================================
   ANIMATED STAT COUNTERS
   ============================================= */
function animateCounter(el, target, duration = 1600) {
  const isFloat  = target % 1 !== 0;
  const suffix   = el.dataset.suffix || "";
  const prefix   = el.dataset.prefix || "";
  let start      = null;

  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    // ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const val   = isFloat
      ? (eased * target).toFixed(2)
      : Math.round(eased * target);
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const numEl = entry.target.querySelector(".stat-number");
    if (!numEl || numEl.dataset.counted) return;
    numEl.dataset.counted = "1";
    const raw = numEl.textContent.trim();

    // Parse value, prefix, suffix
    const match = raw.match(/^([^\d]*)(\d+\.?\d*)([^\d]*)$/);
    if (!match) return;
    const [, pre, num, suf] = match;
    numEl.dataset.prefix = pre;
    numEl.dataset.suffix = suf;
    animateCounter(numEl, parseFloat(num));
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-item").forEach((el) => statsObserver.observe(el));

/* =============================================
   SCROLL REVEAL — cards & timeline items
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

[".skill-card", ".timeline-item", ".edu-card", ".cert-card"].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(el);
  });
});

/* =============================================
   BUTTON RIPPLE
   ============================================= */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* =============================================
   SKILL ICON BOUNCE on card hover
   ============================================= */
document.querySelectorAll(".skill-card").forEach((card) => {
  const icon = card.querySelector(".skill-icon");
  if (!icon) return;
  card.addEventListener("mouseenter", () => icon.classList.add("icon-bounce"));
  icon.addEventListener("animationend",  () => icon.classList.remove("icon-bounce"));
});

/* =============================================
   SECTION HEADER REVEAL
   ============================================= */
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".section-header").forEach((el) => headerObserver.observe(el));
