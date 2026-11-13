// Poss-ible — tema chiaro/scuro, filtri per sezione, tempo di lettura.

// Il primo blocco gira subito (nell'<head>) per evitare il "lampo" bianco.
(function () {
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") {
    document.documentElement.setAttribute("data-theme", saved);
  }
})();

document.addEventListener("DOMContentLoaded", function () {

  // --- Tema ---
  var btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // --- Linea sotto l'header sticky quando si scorre ---
  function markScrolled() {
    document.documentElement.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", markScrolled, { passive: true });
  markScrolled();

  // --- Anno nel footer ---
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // --- Tempo di lettura (solo negli articoli) ---
  var rt = document.querySelector("[data-reading-time]");
  var prose = document.querySelector(".prose");
  if (rt && prose) {
    var words = prose.textContent.trim().split(/\s+/).length;
    var min = Math.max(1, Math.round(words / 200));
    rt.textContent = min + " min di lettura";
  }

  // --- Barra di avanzamento della lettura (solo negli articoli) ---
  if (rt && prose) {
    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);

    var ticking = false;
    function update() {
      // 0% quando inizia il testo, 100% quando la fine del testo arriva in fondo allo schermo
      var rect = prose.getBoundingClientRect();
      var start = rect.top + window.scrollY - window.innerHeight * 0.25;
      var end = rect.bottom + window.scrollY - window.innerHeight;
      var p = end > start ? (window.scrollY - start) / (end - start) : 1;
      p = Math.min(1, Math.max(0, p));
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  // --- Filtri per sezione (solo in home) ---
  var filters = document.querySelectorAll(".filters button");
  if (!filters.length) return;

  var items = document.querySelectorAll(".posts li");
  var groups = document.querySelectorAll(".year-group");
  var empty = document.querySelector(".empty");

  function apply(cat) {
    var valid = ["politica", "tecnologia", "cultura", "note"];
    if (valid.indexOf(cat) === -1) cat = "tutto";

    filters.forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.filter === cat ? "true" : "false");
    });

    var shown = 0;
    items.forEach(function (li) {
      var match =
        cat === "tutto" ||
        li.dataset.cat === cat ||
        (cat === "note" && li.dataset.kind === "nota");
      li.hidden = !match;
      if (match) shown++;
    });

    groups.forEach(function (g) {
      g.hidden = !g.querySelector(".posts li:not([hidden])");
    });

    if (empty) empty.hidden = shown > 0;
  }

  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      var cat = b.dataset.filter;
      history.replaceState(null, "", cat === "tutto" ? location.pathname : "#" + cat);
      apply(cat);
    });
  });

  // Permette link diretti tipo index.html#politica
  window.addEventListener("hashchange", function () { apply(location.hash.slice(1)); });
  apply(location.hash.slice(1));
});
