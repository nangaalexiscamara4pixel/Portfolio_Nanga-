// Menu mobile
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Marque le lien de nav actif selon la page courante
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-nav]").forEach(function (link) {
    if (link.getAttribute("data-nav") === current) {
      link.classList.add("active");
    }
  });

  // Barre de progression de lecture
  var progressBar = document.querySelector(".scroll-progress span");
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Anime une barre de compétence jusqu'à sa largeur cible
  function fillSkillBars(root) {
    root.querySelectorAll(".skill-bar[data-fill]").forEach(function (bar) {
      var target = bar.getAttribute("data-fill");
      var span = bar.querySelector("span");
      if (span) {
        requestAnimationFrame(function () {
          span.style.width = target + "%";
        });
      }
    });
  }

  // Anime un compteur numérique de 0 à sa valeur cible
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1100;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Révélation douce au scroll (+ déclenche compteurs et barres de compétences)
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fillSkillBars(entry.target);
            entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
      fillSkillBars(el);
      el.querySelectorAll("[data-count]").forEach(animateCounter);
    });
  }
});
