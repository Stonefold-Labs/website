/* Stonefold's front-page flip-through of pictures of the app. The picture
   in the middle faces you; the ones beside it turn away and dim as you swipe, scroll or use the arrows. With "reduce
   motion" on, they lie flat. It reaches no network and keeps nothing; without it the pictures are a plain row that
   scrolls. Pinned in scripts/check.py: read the diff before you change it. */
(function () {
  "use strict";
  var track = document.getElementById("flip-track");
  var controls = document.getElementById("flip-controls");
  if (!track || !controls) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll(".flip-card"));
  if (!cards.length) return;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");

  // The pictures overlap, so one step is the gap between two pictures' middles, not a picture's width.
  function spacing() {
    if (cards.length < 2) return cards[0].getBoundingClientRect().width;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  // One picture along, either way.
  function step(direction) {
    track.scrollBy({ left: direction * spacing(), behavior: still.matches ? "auto" : "smooth" });
  }

  function arrow(label, direction, mark) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "flip-arrow";
    button.setAttribute("aria-label", label);
    button.textContent = mark;
    button.addEventListener("click", function () { step(direction); });
    return button;
  }
  controls.appendChild(arrow("Previous picture", -1, "‹"));
  controls.appendChild(arrow("Next picture", 1, "›"));
  controls.hidden = false;

  track.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
  });

  // How far each picture is from the middle, in steps: 0 faces you, 1 is the next picture along.
  var waiting = false;
  function tilt() {
    waiting = false;
    // Measured from where each picture lies, not where its turn has put it, so the middle one ends up exactly flat.
    var middle = track.scrollLeft + track.clientWidth / 2;
    var gap = spacing();
    cards.forEach(function (card) {
      if (still.matches) {
        card.style.transform = "";
        card.style.filter = "";
        card.style.zIndex = "";
        return;
      }
      var along = (card.offsetLeft + card.offsetWidth / 2 - middle) / gap;
      var turn = Math.max(-1, Math.min(1, along));
      var away = Math.min(Math.abs(along), 1);
      card.style.transform = "rotateY(" + (-turn * 48) + "deg) scale(" + (1 - away * 0.2) + ")";
      card.style.filter = "brightness(" + (1 - Math.min(Math.abs(along), 1.5) * 0.3) + ")";
      card.style.zIndex = String(100 - Math.round(Math.abs(along) * 10));
    });
  }

  function soon() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(tilt);
    }
  }

  track.addEventListener("scroll", soon, { passive: true });
  window.addEventListener("resize", soon);
  if (still.addEventListener) still.addEventListener("change", soon);
  tilt();
})();
