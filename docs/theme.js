/* The light and dark switch. This is the only script on stonefoldlabs.com.

   It remembers one word, "light" or "dark", in this browser, and only after the switch is used.
   It asks no server for anything and sends nothing anywhere. */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  var saved = null;
  try {
    saved = window.localStorage.getItem("theme");
  } catch (unavailable) {
    saved = null;
  }
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  function isDark() {
    var chosen = root.getAttribute("data-theme");
    if (chosen === "light" || chosen === "dark") {
      return chosen === "dark";
    }
    return prefersDark.matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }

    function show() {
      button.setAttribute("aria-checked", isDark() ? "true" : "false");
    }

    button.hidden = false;
    show();

    button.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("theme", next);
      } catch (unavailable) {
        /* Private windows may refuse. The switch still works for this page. */
      }
      show();
    });

    if (prefersDark.addEventListener) {
      prefersDark.addEventListener("change", show);
    }
  });
})();
