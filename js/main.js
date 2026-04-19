/**
 * Parallax + UI — prefers-reduced-motion aware
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress__bar");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (scrollTop / max) * 100 : 0;
    bar.style.width = `${p}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initReveals() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  const revealOne = (target) => {
    const delay = Number(target.getAttribute("data-delay") || 0);
    const ms = delay * 90;
    window.setTimeout(() => target.classList.add("is-visible"), ms);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealOne(entry.target);
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 12% 0px", threshold: 0.01 }
  );

  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const inView = r.top < vh * 0.92 && r.bottom > 0;
    if (inView) {
      revealOne(el);
    } else {
      io.observe(el);
    }
  });

  /* If observer never fires (edge cases), still show content */
  window.setTimeout(() => {
    els.forEach((el) => {
      if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
    });
  }, 4000);
}

function initHeroParallax() {
  const layers = document.querySelectorAll(".hero__bg [data-depth]");
  if (!layers.length || prefersReducedMotion) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const scrollY = window.scrollY;
    const vh = window.innerHeight || 1;
    const t = clamp(scrollY / (vh * 1.2), 0, 1);

    layers.forEach((el) => {
      const depth = Number(el.getAttribute("data-depth") || 0.2);
      const y = scrollY * depth * 0.35;
      const subtle = (t - 0.5) * 12 * depth;
      el.style.transform = `translate3d(0, ${y}px, 0) translate3d(${subtle}px, 0, 0)`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function initStickyStacks() {
  const panel = document.querySelector("[data-sticky-panel]");
  const visual = document.querySelector("[data-sticky-visual]");
  const stacks = document.querySelectorAll("[data-stack-depth]");
  if (!panel || !stacks.length || prefersReducedMotion) return;

  const section = panel.closest(".sticky-wrap__inner") || panel.closest(".sticky-wrap");
  if (!section) return;

  const baseByClass = {
    "stack--back": { xp: -8, yp: 8, s: 0.92 },
    "stack--mid": { xp: 0, yp: 0, s: 0.96 },
    "stack--front": { xp: 8, yp: -8, s: 1 },
  };

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progressed = clamp(-rect.top, 0, Math.max(total, 1));
    const p = progressed / Math.max(total, 1);

    stacks.forEach((el) => {
      const d = Number(el.getAttribute("data-stack-depth") || 0.3);
      const offset = (p - 0.5) * 80 * d;
      const rot = (p - 0.5) * 6 * d;
      const ox = offset * 0.15;
      const oy = offset * 0.35;
      const cls = [...el.classList].find((c) => baseByClass[c]);
      const b = cls ? baseByClass[cls] : { xp: 0, yp: 0, s: 1 };
      el.style.transform = `translate3d(calc(${b.xp}% + ${ox}px), calc(${b.yp}% + ${oy}px), 0) scale(${b.s}) rotate(${rot}deg)`;
    });

    if (visual) {
      const lift = (p - 0.5) * 14;
      visual.style.transform = `translate3d(0, ${lift}px, 0)`;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

function initMarquee() {
  const marquee = document.querySelector("[data-marquee] .marquee__track");
  if (!marquee || prefersReducedMotion) return;

  let offset = 0;
  let raf = 0;
  const speed = 0.35;

  const step = () => {
    const half = marquee.scrollWidth / 2;
    offset -= speed;
    if (offset <= -half) offset = 0;
    marquee.style.transform = `translate3d(${offset}px, 0, 0)`;
    raf = requestAnimationFrame(step);
  };

  raf = requestAnimationFrame(step);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
    }
  });
}

function initHorizon() {
  const line = document.querySelector("[data-horizon-line]");
  const sun = document.querySelector("[data-horizon-sun]");
  const section = line?.closest(".horizon");
  if (!section || prefersReducedMotion) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = rect.top + rect.height * 0.45;
    const t = clamp(1 - center / (vh * 1.1), 0, 1);

    if (line) {
      const skew = (t - 0.5) * 6;
      const scaleX = 1 + t * 0.08;
      line.style.transform = `translate3d(${(t - 0.5) * -40}px, ${t * -18}px, 0) skewX(${skew}deg) scaleX(${scaleX})`;
    }
    if (sun) {
      const rise = (1 - t) * 120;
      const glow = 0.85 + t * 0.35;
      sun.style.transform = `translate3d(-50%, ${40 - rise}px, 0) scale(${0.9 + t * 0.25})`;
      sun.style.opacity = String(glow);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

function initCardParallax() {
  const cards = document.querySelectorAll("[data-tilt]");
  if (!cards.length || prefersReducedMotion) {
    cards.forEach((c) => {
      c.addEventListener("mouseenter", () => {}, { once: true });
    });
    return;
  }

  let scrollTick = false;
  const onScroll = () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      const y = window.scrollY;
      cards.forEach((card) => {
        const factor = Number(card.getAttribute("data-depth-card") || 0.1);
        const rect = card.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const delta = (mid - window.innerHeight / 2) / window.innerHeight;
        const shift = delta * 40 * factor;
        if (!card.dataset.pointerActive) {
          card.style.transform = `translate3d(0, ${shift}px, 0)`;
        }
      });
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  cards.forEach((card) => {
    const inner = card.querySelector(".tilt-card__inner");

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.dataset.pointerActive = "1";
      const max = 10;
      const rx = py * -max;
      const ry = px * max;
      card.style.transform = `translate3d(0, 0, 0) perspective(900px)`;
      if (inner) {
        inner.style.transform = `translate3d(0, 0, 20px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      delete card.dataset.pointerActive;
      if (inner) {
        inner.style.transform = `translate3d(0, 0, 0) rotateX(0) rotateY(0)`;
      }
      onScroll();
    });
  });

  onScroll();
}

function initSplitParallax() {
  const frame = document.querySelector("[data-split-frame]");
  const layers = document.querySelectorAll("[data-split-depth]");
  const section = frame?.closest(".split-parallax");
  if (!frame || !layers.length || !section || prefersReducedMotion) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const t = clamp(1 - (rect.top + rect.height * 0.35) / (vh * 1.05), 0, 1);

    layers.forEach((layer) => {
      const d = Number(layer.getAttribute("data-split-depth") || 0.5);
      const y = (t - 0.5) * 60 * d;
      const s = 1 + (t - 0.5) * 0.06 * d;
      layer.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
    });

    const parallax = (t - 0.5) * 24;
    frame.style.transform = `translate3d(0, ${parallax}px, 0)`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

function initCtaGlow() {
  const glow = document.querySelector("[data-cta-glow]");
  const section = glow?.closest(".cta");
  if (!glow || !section || prefersReducedMotion) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const t = clamp(1 - (rect.top + rect.height / 2) / (vh * 0.9), 0, 1);
    const x = (t - 0.5) * 30;
    const y = (t - 0.5) * -20;
    glow.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${1 + t * 0.15})`;
    glow.style.opacity = String(0.55 + t * 0.35);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const THEMES = [
  { id: "depth", label: "Aurora depth" },
  { id: "sunset", label: "Sunset" },
  { id: "neon", label: "Neon grid" },
  { id: "ocean", label: "Ocean" },
  { id: "jungle", label: "Jungle" },
];

function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  let idx = 0;
  const apply = () => {
    const { id, label } = THEMES[idx];
    document.documentElement.setAttribute("data-theme", id);
    btn.setAttribute("aria-label", `Color theme: ${label}. Click for next.`);
    btn.setAttribute("title", `Theme: ${label}`);
    const lab = btn.querySelector(".theme-toggle__label");
    if (lab) lab.textContent = label.split(" ")[0];
  };

  apply();
  btn.addEventListener("click", () => {
    idx = (idx + 1) % THEMES.length;
    apply();
  });
}

function initCursorGlow() {
  const el = document.querySelector("[data-cursor-glow]");
  if (!el || prefersReducedMotion) return;

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) return;

  let visible = false;
  let raf = 0;
  let mx = 0;
  let my = 0;

  const paint = () => {
    raf = 0;
    el.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    el.style.opacity = visible ? "0.55" : "0";
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      visible = true;
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true }
  );

  document.body.addEventListener(
    "mouseleave",
    () => {
      visible = false;
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true }
  );
}

function initSpectrumParallax() {
  const section = document.querySelector(".spectrum");
  const blobs = document.querySelectorAll("[data-spectrum-depth]");
  if (!section || !blobs.length || prefersReducedMotion) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const t = clamp(1 - (rect.top + rect.height * 0.4) / (vh * 1.05), 0, 1);

    blobs.forEach((blob) => {
      const d = Number(blob.getAttribute("data-spectrum-depth") || 0.15);
      const x = (t - 0.5) * 60 * d;
      const y = (t - 0.5) * -40 * d;
      blob.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + (t - 0.5) * 0.08})`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

function initCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;

  const run = (el) => {
    const target = Number(el.getAttribute("data-count"));
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    const start = performance.now();
    const dur = 1400;
    const from = 0;

    const step = (now) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - (1 - p) ** 3;
      const val = Math.round(from + (target - from) * eased);
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  nodes.forEach((n) => io.observe(n));
}

initYear();
initScrollProgress();
initHeader();
initThemeToggle();
initCursorGlow();
initReveals();
initHeroParallax();
initStickyStacks();
initSpectrumParallax();
initMarquee();
initHorizon();
initCounters();
initCardParallax();
initSplitParallax();
initCtaGlow();
initMobileNav();

/* ─── Phase 5: Dark Mode Toggle (hero-scoped) ─── */
function initDarkModeToggle() {
  const darkBtn = document.getElementById("darkModeToggle");
  const heroSection = document.querySelector(".hero");
  if (!darkBtn || !heroSection) return;

  let isDark = false;
  darkBtn.addEventListener("click", () => {
    isDark = !isDark;
    heroSection.classList.toggle("dark-mode", isDark);
    darkBtn.querySelector(".toggle-icon").innerHTML = isDark ? "&#9788;" : "&#9790;";
    if (typeof window.updateGraphColors === "function") window.updateGraphColors();
  });
}

initDarkModeToggle();
