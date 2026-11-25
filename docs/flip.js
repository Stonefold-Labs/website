/* Stonefold's front-page flip-through of pictures of the app. The picture
   in the middle faces you; the ones beside it turn away and dim. It starts with the first picture in the middle and
   others on both sides, and it goes round: past the last picture comes the first again, either way, without end. The
   row follows a sideways drag of a finger or a sideways trackpad scroll as it happens, then comes to rest on the
   nearest picture; the arrow keys and a click on a picture at the side move it too. An up-and-down swipe or wheel
   over it always scrolls the page, never the row. With "reduce motion" on, the pictures lie flat and the row moves
   without gliding. It reaches no network and keeps nothing; without it the pictures are a plain row that scrolls.
   Pinned in scripts/check.py: read the diff before you change it. */
(function () {
  "use strict";
  var track = document.getElementById("flip-track");
  if (!track) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll(".flip-card"));
  if (!cards.length) return;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var middle = Math.floor(cards.length / 2);
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

  // Where the row sits when picture number `index` is in the middle.
  function place(index) {
    var card = cards[index];
    return card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
  }

  // The row goes round. Whichever picture is nearest the middle of the screen is kept in the middle of the row, with
  // as many pictures on one side as on the other: when it moves off, a picture from the far end is carried round to
  // the near one, out of sight, and the row is shifted back by one step so nothing seems to move.
  var drag = null;
  function goRound() {
    if (cards.length < 3) return;
    var gap = spacing();
    var off = Math.round((track.scrollLeft - place(0)) / gap) - middle;
    while (off > 0) {
      track.appendChild(cards[0]);
      cards.push(cards.shift());
      track.scrollLeft -= gap;
      if (drag) drag.from -= gap;
      current -= 1;
      off -= 1;
    }
    while (off < 0) {
      track.insertBefore(cards[cards.length - 1], cards[0]);
      cards.unshift(cards.pop());
      track.scrollLeft += gap;
      if (drag) drag.from += gap;
      current += 1;
      off += 1;
    }
  }

  // Once the row is at rest, go round, then sit exactly on the middle picture: each shift by one step can be off by a
  // part of a pixel, and those would add up.
  function rest() {
    goRound();
    track.scrollLeft = place(current);
  }

  // A short glide to a place in the row. Any new drag, scroll or glide ends the one under way.
  var gliding = 0;
  function glide(to, instant) {
    var mine = ++gliding;
    var from = track.scrollLeft;
    if (instant || still.matches || Math.abs(to - from) < 1) {
      track.scrollLeft = to;
      rest();
      return;
    }
    var began = null;
    function frame(now) {
      if (mine !== gliding) return;
      if (began === null) began = now;
      var done = Math.min(1, (now - began) / 260);
      track.scrollLeft = from + (to - from) * (1 - Math.pow(1 - done, 3));
      if (done < 1) window.requestAnimationFrame(frame);
      else rest();
    }
    window.requestAnimationFrame(frame);
  }

  // Bring picture number `index` to the middle.
  function go(index, instant) {
    current = Math.max(0, Math.min(cards.length - 1, index));
    glide(place(current), instant);
  }

  // After a drag or a scroll, rest on the nearest picture; a short push still carries to the next one.
  function settle() {
    var gap = spacing();
    var along = (track.scrollLeft - place(0)) / gap;
    var nearest = Math.round(along);
    var enough = Math.min(0.12, 30 / gap);
    if (nearest === current && Math.abs(along - current) > enough) nearest = current + (along > current ? 1 : -1);
    go(nearest);
  }

  // Each press is one step on from wherever the row is, even mid-glide, and the row goes round first so it never runs out.
  function step(direction) {
    gliding++;
    goRound();
    go(current + direction);
  }

  track.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
  });

  // A picture at the side comes to the middle when clicked; only the middle one opens at full size.
  cards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      // A swipe that ends on a picture is not also a click on it.
      if (event.timeStamp - swipedAt < 500) {
        event.preventDefault();
        return;
      }
      var index = cards.indexOf(card);
      if (index !== current) {
        event.preventDefault();
        go(index);
      }
    });
  });

  // A trackpad's sideways scroll moves the row with the fingers. Mostly up-and-down scrolling is left alone, so the
  // page scrolls past. A trackpad keeps sending small scrolls as it coasts: once they have died down the row comes to
  // rest, and the rest of that coast is passed over unless a new push begins.
  var lastWheel = -1000;
  var strongest = 0;
  var rested = false;
  var watching = false;
  function watch(now) {
    if (rested) { watching = false; return; }
    if (now - lastWheel > 110) {
      watching = false;
      rested = true;
      settle();
      return;
    }
    window.requestAnimationFrame(watch);
  }
  track.addEventListener("wheel", function (event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    var now = window.performance.now();
    var size = Math.abs(event.deltaX);
    if (now - lastWheel > 110) { rested = false; strongest = 0; }
    lastWheel = now;
    if (rested) {
      if (size < 12) return;
      rested = false;
      strongest = 0;
    }
    strongest = Math.max(strongest, size);
    if (strongest >= 12 && size < 4) {
      rested = true;
      settle();
      return;
    }
    gliding++;
    track.scrollLeft += event.deltaX;
    goRound();
    if (!watching) {
      watching = true;
      window.requestAnimationFrame(watch);
    }
  }, { passive: false });

  // A finger drags the row sideways and it follows at once. The browser keeps up-and-down swipes for the page
  // (touch-action: pan-y in styles.css), so this only hears the sideways ones.
  var swipedAt = -1000;
  track.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse") return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, from: track.scrollLeft, moved: false };
  });
  track.addEventListener("pointermove", function (event) {
    if (!drag || event.pointerId !== drag.id) return;
    var dx = event.clientX - drag.x;
    var dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      drag.moved = true;
      gliding++;
    }
    track.scrollLeft = drag.from - dx;
    goRound();
  });
  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    var moved = drag.moved;
    drag = null;
    if (moved) {
      swipedAt = event.timeStamp;
      settle();
    }
  }
  track.addEventListener("pointerup", release);
  track.addEventListener("pointercancel", release);

  // How far each picture is from the middle, in steps: 0 faces you, 1 is the next picture along.
  var waiting = false;
  function tilt() {
    waiting = false;
    // Measured from where each picture lies, not where its turn has put it, so the middle one ends up exactly flat.
    var centre = track.scrollLeft + track.clientWidth / 2;
    var gap = spacing();
    cards.forEach(function (card) {
      if (still.matches) {
        card.style.transform = "";
        card.style.filter = "";
        card.style.zIndex = "";
        return;
      }
      var along = (card.offsetLeft + card.offsetWidth / 2 - centre) / gap;
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
  // The row's size also changes without the window's, as the page's fonts arrive and the pictures take the height left
  // over; the middle picture is put back in the middle each time.
  if (window.ResizeObserver) new window.ResizeObserver(function () { go(current, true); soon(); }).observe(track);
  if (still.addEventListener) still.addEventListener("change", soon);
  go(0, true);
  tilt();
})();
