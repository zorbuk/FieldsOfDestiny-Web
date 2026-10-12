// Fields of Destiny - the little the page does by itself: the links from the server's settings (Discord, download),
// a few embers rising in the sky, sections appearing as they're reached and the cards' glow following the mouse.
// No cookies, no storage, nothing sent anywhere but this same site.
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The year in the footer.
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  // Links from data/web.json (the defaults in the HTML work without it).
  // config.json on the published site (Cloudflare Pages, written by publicar-web); /api/web from the local server.
  function load(url) { return fetch(url, { credentials: "omit" }).then(function (r) { return r.ok ? r.json() : null; }); }
  load("/config.json").catch(function () { return null; }).then(function (web) { return web || load("/api/web"); }).then(function (web) {
    if (!web) return;
    document.querySelectorAll("[data-link]").forEach(function (a) {
      var url = web[a.getAttribute("data-link")];
      if (typeof url === "string" && /^https:\/\//.test(url)) a.href = url;
    });
    // The legal pages: who runs it and how to write to them.
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var value = web[el.getAttribute("data-field")];
      if (typeof value !== "string" || !value) return;
      el.textContent = value;
      if (el.tagName === "A" && value.indexOf("@") > 0) el.href = "mailto:" + value;
    });
    if (!web.discord) document.querySelectorAll('[data-link="discord"]').forEach(function (a) {
      a.textContent = "Discord: muy pronto";
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
    });
  }).catch(function () { });

  // Embers: a few dozen sparks, each its own slow rise (CSS does the moving).
  var embers = document.querySelector(".embers");
  if (embers && !still) {
    for (var i = 0; i < 28; i++) {
      var e = document.createElement("i");
      e.style.left = (Math.random() * 100).toFixed(2) + "%";
      e.style.animationDuration = (9 + Math.random() * 12).toFixed(1) + "s";
      e.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
      e.style.setProperty("--dx", ((Math.random() - 0.5) * 160).toFixed(0) + "px");
      var size = (1.5 + Math.random() * 2.5).toFixed(1) + "px";
      e.style.width = size;
      e.style.height = size;
      embers.appendChild(e);
    }
  }

  // Sections fading in as they come into view.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !still) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("shown");
        seen.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { seen.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("shown"); });

  // The cards' glow where the mouse is.
  if (!still) document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (ev.clientX - r.left) + "px");
      card.style.setProperty("--my", (ev.clientY - r.top) + "px");
    });
  });
})();
