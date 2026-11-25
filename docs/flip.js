/* Stonefold's front-page flip-through of pictures of the app. The picture
   in the middle faces you; the ones beside it turn away and dim. The row moves one picture at a time: by a sideways
   swipe or a sideways trackpad scroll, by the arrows, the arrow keys, or a click on a picture at the side. An
   up-and-down swipe or wheel over it always scrolls the page, never the row. With "reduce motion" on, the pictures lie
   flat. It reaches no network and keeps nothing; without it the pictures are a plain row that scrolls. Pinned in
   scripts/check.py: read the diff before you change it. */
(function () {
  "use strict";
  var track = document.getElementById("flip-track");
  var controls = document.getElementById("flip-controls");
  if (!track || !controls) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll(".flip-card"));
  if (!cards.length) return;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = 0;

  // The row stops being a scroller of its own (styles.css, .flip-on); only this script moves it.
  track.classList.add("flip-on");

  // The first card's picture loads at once, so it never shows blank. Only the one the visitor's theme shows: the
  // others stay lazy and hidden, and a hidden picture never loads.
  Array.prototype.forEach.call(cards[0].querySelectorAll("img"), function (picture) {
    if (picture.offsetParent !== null) picture.loading = "eager";
  });

  // The pictures overlap, so one step is the gap between two pictures' middles, not a picture's width.
  function spacing() {
    if (cards.length < 2) return cards[0].getBoundingClientRect().width;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  // Bring picture number `index` to the middle.
  function go(index, instant) {
    current = Math.max(0, Math.min(cards.length - 1, index));
    var card = cards[current];
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: instant || still.matches ? "auto" : "smooth"
    });
  }

  function step(direction) { go(current + direction); }

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

  // A picture at the side comes to the middle when clicked; only the middle one opens at full size.
  cards.forEach(function (card, index) {
    card.addEventListener("click", function (event) {
      // A swipe that ends on a picture is not also a click on it.
      if (event.timeStamp - swipedAt < 500) {
        event.preventDefault();
        return;
      }
      if (index !== current) {
        event.preventDefault();
        go(index);
      }
    });
  });

  // A trackpad's sideways scroll moves one picture per gesture. Mostly up-and-down scrolling is left alone, so the page
  // scrolls past. A gesture ends when no scroll has come for a moment (a trackpad keeps sending them as it coasts).
  var pushed = 0;
  var lastWheel = -1000;
  var spent = false;
  track.addEventListener("wheel", function (event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (event.timeStamp - lastWheel > 180) {
      pushed = 0;
      spent = false;
    }
    lastWheel = event.timeStamp;
    if (spent) return;
    pushed += event.deltaX;
    if (Math.abs(pushed) > 30) {
      spent = true;
      step(pushed > 0 ? 1 : -1);
    }
  }, { passive: false });

  // A finger's sideways swipe moves one picture. The browser keeps up-and-down swipes for the page (touch-action:
  // pan-y in styles.css), so this only hears the sideways ones.
  var startX = null;
  var startY = 0;
  var swipedAt = -1000;
  track.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse") return;
    startX = event.clientX;
    startY = event.clientY;
  });
  track.addEventListener("pointerup", function (event) {
    if (startX === null) return;
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipedAt = event.timeStamp;
      step(dx < 0 ? 1 : -1);
    }
  });
  track.addEventListener("pointercancel", function () { startX = null; });

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
  window.addEventListener("resize", function () { go(current, true); soon(); });
  if (still.addEventListener) still.addEventListener("change", soon);
  go(0, true);
  tilt();
})();
