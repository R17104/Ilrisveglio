/* Il Risveglio — main.js */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- lightbox ---------- */
  var galleries = document.querySelectorAll(".gallery");
  if (galleries.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<button class="close" aria-label="Close">&times;</button>' +
      '<button class="prev" aria-label="Previous photo">&#8249;</button>' +
      '<img alt="">' +
      '<button class="next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var items = [];
    var idx = 0;

    function openAt(list, i) {
      items = list; idx = i;
      lbImg.src = items[idx].href;
      lbImg.alt = items[idx].querySelector("img").alt || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
    function step(d) {
      idx = (idx + d + items.length) % items.length;
      lbImg.src = items[idx].href;
      lbImg.alt = items[idx].querySelector("img").alt || "";
    }

    galleries.forEach(function (g) {
      var links = Array.prototype.slice.call(g.querySelectorAll("a"));
      links.forEach(function (a, i) {
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          openAt(links, i);
        });
      });
    });

    lb.querySelector(".close").addEventListener("click", close);
    lb.querySelector(".prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }
})();
