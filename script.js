/* ============================================================
   Alifa Creative — site interactions
   Vanilla JS only: mobile nav, scroll reveal, 3D tilt,
   smooth anchor scrolling, active nav highlight.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close the mobile menu when a link is tapped
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback for very old browsers: show everything
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 3D tilt on [data-tilt] cards (mouse only) ---------- */
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer && !reducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (x * 8).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg) translateZ(0)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  /* ---------- Smooth anchor scrolling (offsets the fixed header) ---------- */
  var HEADER_OFFSET = 84;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Active nav highlight (scroll spy) ---------- */
  var sections = ["home", "services", "brands", "process", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navMap = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    navMap[link.getAttribute("href").slice(1)] = link;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            Object.keys(navMap).forEach(function (key) { navMap[key].classList.remove("active"); });
            var link = navMap[entry.target.id];
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }
})();
