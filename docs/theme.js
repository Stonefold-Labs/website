/* The theme picker. It and the guide's search (guide/search.js) are the only scripts on stonefoldapp.com.

   The page can wear any of the app's twelve themes. This script sets one word on the page, such as "sage" or "linen",
   and keeps that word in this browser, and only after a theme has been picked. Until then the page follows the
   device: Sage when the device is dark, Linen when it is light. It asks no server for anything and sends nothing
   anywhere. */
(function () {
  "use strict";

  var root = document.documentElement;
  var themes = ["sage", "linen", "night", "ember", "paper", "dusk", "clay", "terminal", "terminal-amber", "terminal-white", "terminal-cyan", "plain"];
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function known(word) {
    return themes.indexOf(word) !== -1;
  }

  var saved = null;
  try {
    saved = window.localStorage.getItem("theme");
  } catch (unavailable) {
    saved = null;
  }
  /* The earlier light and dark switch kept "light" or "dark". They become the two themes they were. */
  if (saved === "light") {
    saved = "linen";
  } else if (saved === "dark") {
    saved = "sage";
  }
  if (!known(saved)) {
    saved = null;
  }

  function current() {
    return saved || (prefersDark.matches ? "sage" : "linen");
  }

  function apply() {
    root.setAttribute("data-theme", current());
  }

  apply();

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    var menu = document.getElementById("theme-menu");
    if (!toggle || !menu) {
      return;
    }
    var name = toggle.querySelector(".theme-name");
    var options = menu.querySelectorAll("[data-look]");

    function show() {
      var now = current();
      for (var i = 0; i < options.length; i += 1) {
        var look = options[i].getAttribute("data-look");
        options[i].setAttribute("aria-pressed", look === now ? "true" : "false");
        if (look === now && name) {
          name.textContent = options[i].querySelector("strong").textContent;
        }
      }
    }

    function open(yes) {
      menu.hidden = !yes;
      toggle.setAttribute("aria-expanded", yes ? "true" : "false");
    }

    toggle.hidden = false;
    show();

    toggle.addEventListener("click", function () {
      open(menu.hidden);
    });

    for (var i = 0; i < options.length; i += 1) {
      options[i].addEventListener("click", function (event) {
        var look = event.currentTarget.getAttribute("data-look");
        if (!known(look)) {
          return;
        }
        saved = look;
        apply();
        try {
          window.localStorage.setItem("theme", look);
        } catch (unavailable) {
          /* Private windows may refuse. The theme still changes for this page. */
        }
        show();
        open(false);
        toggle.focus();
      });
    }

    document.addEventListener("click", function (event) {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) {
        open(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) {
        open(false);
        toggle.focus();
      }
    });

    if (prefersDark.addEventListener) {
      prefersDark.addEventListener("change", function () {
        apply();
        show();
      });
    }
  });
})();
