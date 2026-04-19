/**
 * Anime.js Scroll Animations — IntersectionObserver-driven
 * All animations trigger only when elements enter the viewport.
 * Uses anime.js v3 global (loaded via CDN).
 */

(function () {
  "use strict";

  /* ─── Reduced-motion bail-out ─── */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ─── Wait for DOM ready ─── */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* ─── (A) Split Text Word Entrance ─── */
    document.querySelectorAll('[data-anime="split"]').forEach(function (el) {
      // Split text into word spans
      const text = el.textContent;
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = words
        .map(function (w) {
          return (
            '<span class="anime-word" style="display:inline-block;opacity:0;transform:translateY(1.2em)">' +
            w +
            "</span>"
          );
        })
        .join('<span style="display:inline-block">&nbsp;</span>');

      var wordEls = el.querySelectorAll(".anime-word");

      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              anime({
                targets: wordEls,
                opacity: [0, 1],
                translateY: ["1.2em", 0],
                duration: 800,
                delay: anime.stagger(60),
                easing: "easeOutExpo",
              });
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
    });

    /* ─── (B) Card Reveal (staggered) ─── */
    document.querySelectorAll('[data-anime="card"]').forEach(function (el, i) {
      // Set initial state
      el.style.opacity = "0";
      el.style.transform = "translateY(40px) scale(0.95)";

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              duration: 700,
              delay: i * 80,
              easing: "easeOutCubic",
            });
            obs.unobserve(entry.target);
          }
        });
      });
      obs.observe(el);
    });

    /* ─── (C) Counter Animation ─── */
    document
      .querySelectorAll('[data-anime="counter"]')
      .forEach(function (el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        if (isNaN(target)) return;

        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                var obj = { val: 0 };
                anime({
                  targets: obj,
                  val: target,
                  duration: 1600,
                  easing: "easeOutExpo",
                  round: 1,
                  update: function () {
                    el.textContent = Math.round(obj.val);
                  },
                });
                obs.unobserve(el);
              }
            });
          },
          { threshold: 0.35 }
        );
        obs.observe(el);
      });

    /* ─── (D) Random Opacity Flicker (ambient) ─── */
    var ambient = document.querySelectorAll('[data-anime="ambient"]');
    if (ambient.length) {
      anime({
        targets: ambient,
        opacity: function () {
          return anime.random(30, 100) / 100;
        },
        duration: function () {
          return anime.random(1200, 3000);
        },
        delay: anime.stagger(120),
        loop: true,
        direction: "alternate",
        easing: "easeInOutSine",
      });
    }
  });
})();
