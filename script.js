/* Koray Öner — kişisel sayfa · tema geçişi ve yıl */
(function () {
  "use strict";
  var KEY = "onerkoray.theme";
  var order = ["auto", "light", "dark"];
  var btn = document.getElementById("themeToggle");

  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    if (btn) {
      var label = btn.querySelector(".theme-toggle-label");
      if (label) label.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    }
  }

  apply(localStorage.getItem(KEY) || "auto");

  if (btn) {
    btn.addEventListener("click", function () {
      var current = localStorage.getItem(KEY) || "auto";
      var next = order[(order.indexOf(current) + 1) % order.length];
      localStorage.setItem(KEY, next);
      apply(next);
    });
  }

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Renk paleti seçici ---- */
  var ACCENT_KEY = "onerkoray.accent";
  function applyAccent(name) {
    if (name && name !== "yesil") document.documentElement.setAttribute("data-accent", name);
    else document.documentElement.removeAttribute("data-accent");
    document.querySelectorAll(".palette-pop button").forEach(function (b) {
      b.setAttribute("aria-pressed", String((b.getAttribute("data-accent") || "yesil") === (name || "yesil")));
    });
  }
  applyAccent(localStorage.getItem(ACCENT_KEY) || "yesil");

  var palToggle = document.querySelector(".palette-toggle");
  var palPop = document.querySelector(".palette-pop");
  if (palToggle && palPop) {
    palToggle.addEventListener("click", function () {
      var open = palPop.hidden;
      palPop.hidden = !open;
      palToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!palPop.hidden && !e.target.closest(".palette")) {
        palPop.hidden = true;
        palToggle.setAttribute("aria-expanded", "false");
      }
    });
    palPop.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var name = b.getAttribute("data-accent") || "yesil";
        localStorage.setItem(ACCENT_KEY, name);
        applyAccent(name);
      });
    });
  }

  /* ---- Araç dizini: arama + kategori filtresi (ana sayfa) ---- */
  var search = document.getElementById("tool-search-input");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card[data-tags]"));
  if (cards.length && (search || chips.length)) {
    var activeCat = "hepsi";
    function applyFilter() {
      var q = search ? search.value.trim().toLocaleLowerCase("tr") : "";
      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").toLocaleLowerCase("tr");
        var cat = card.getAttribute("data-cat") || "";
        var okCat = activeCat === "hepsi" || cat === activeCat;
        var okText = !q || tags.indexOf(q) !== -1 || card.textContent.toLocaleLowerCase("tr").indexOf(q) !== -1;
        var show = okCat && okText;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      var empty = document.getElementById("no-results");
      if (empty) empty.hidden = visible > 0;
    }
    if (search) search.addEventListener("input", applyFilter);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCat = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        applyFilter();
      });
    });
  }

  /* ---- Rapor yazdırma (araç sayfaları) ---- */
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      var dateEl = document.getElementById("report-date");
      if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString("tr-TR", {
          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
      }
      if (typeof window.buildReportInputs === "function") window.buildReportInputs();
      window.print();
    });
  }

  /* Header'a kaydırma durumunda gölge ekle */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Scroll ile ortaya çıkma (reveal) animasyonu */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reveals.length) return;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  reveals.forEach(function (el) { io.observe(el); });
})();
