/* Stonefold guide search (the owner, 2026-11-21: "Yes, build search").
   It reads the page text from /guide/search-index.js, which is loaded beside it, and finds pages by their words
   in this browser. It also marks, in the list down the left, the topic you are reading as you scroll (the owner,
   2026-11-21: "have it track/highlight the left menu as you scroll"). It reaches no network, keeps nothing and writes
   nothing but the box, the list of results and that one mark. Pinned in scripts/check.py: read the diff before you
   change it. */
(function () {
  "use strict";
  var mount = document.getElementById("guide-search");
  var pages = window.STONEFOLD_GUIDE;
  if (!mount || !pages || !pages.length) return;

  // Lower case, no accents, and the curly apostrophes made plain. One character stays one character.
  function fold(text) {
    var out = "";
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      if (c === "’" || c === "‘") c = "'";
      else c = c.normalize("NFD").charAt(0);
      out += c;
    }
    return out.toLowerCase();
  }

  var index = pages.map(function (page) {
    return { page: page, title: fold(page.t), text: fold(page.x) };
  });

  var wrap = mount.parentNode.parentNode;
  var box = document.createElement("input");
  box.type = "search";
  box.className = "gsearch-box";
  box.placeholder = "Search the guide";
  box.setAttribute("aria-label", "Search the guide");
  box.setAttribute("autocomplete", "off");
  box.setAttribute("spellcheck", "false");
  var status = document.createElement("p");
  status.className = "gsearch-status";
  status.setAttribute("role", "status");
  var list = document.createElement("ul");
  list.className = "gsearch-results";
  mount.appendChild(box);
  mount.appendChild(status);
  mount.appendChild(list);
  mount.hidden = false;

  function count(text, word) {
    var n = 0;
    var at = text.indexOf(word);
    while (at !== -1 && n < 10) {
      n++;
      at = text.indexOf(word, at + word.length);
    }
    return n;
  }

  // The words found in a stretch of text, set in <mark>, as text nodes and never as markup.
  function marked(into, text, words) {
    var folded = text.length === fold(text).length ? fold(text) : null;
    if (!folded) {
      into.appendChild(document.createTextNode(text));
      return;
    }
    var from = 0;
    while (from < text.length) {
      var best = -1;
      var length = 0;
      for (var i = 0; i < words.length; i++) {
        var at = folded.indexOf(words[i], from);
        if (at !== -1 && (best === -1 || at < best)) {
          best = at;
          length = words[i].length;
        }
      }
      if (best === -1) break;
      if (best > from) into.appendChild(document.createTextNode(text.slice(from, best)));
      var m = document.createElement("mark");
      m.appendChild(document.createTextNode(text.slice(best, best + length)));
      into.appendChild(m);
      from = best + length;
    }
    if (from < text.length) into.appendChild(document.createTextNode(text.slice(from)));
  }

  function snippet(entry, words) {
    var at = -1;
    for (var i = 0; i < words.length; i++) {
      var found = entry.text.indexOf(words[i]);
      if (found !== -1 && (at === -1 || found < at)) at = found;
    }
    var raw = entry.page.x;
    if (raw.length !== entry.text.length) return raw.slice(0, 140);
    if (at === -1) return raw.slice(0, 140);
    var start = Math.max(0, at - 50);
    var end = Math.min(raw.length, at + 110);
    return (start > 0 ? "…" : "") + raw.slice(start, end) + (end < raw.length ? "…" : "");
  }

  function search(query) {
    var words = fold(query).split(/\s+/).filter(Boolean);
    if (!words.length) return null;
    var hits = [];
    index.forEach(function (entry, order) {
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var inTitle = entry.title.indexOf(words[i]) !== -1;
        var inText = count(entry.text, words[i]);
        if (!inTitle && !inText) return;
        score += (inTitle ? 20 : 0) + (entry.title.indexOf(words[i]) === 0 ? 10 : 0) + inText;
      }
      hits.push({ entry: entry, score: score, order: order });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.order - b.order; });
    return { words: words, hits: hits };
  }

  function show() {
    while (list.firstChild) list.removeChild(list.firstChild);
    var found = search(box.value);
    if (!found) {
      wrap.classList.remove("searching");
      status.textContent = "";
      return;
    }
    wrap.classList.add("searching");
    var shown = found.hits.slice(0, 20);
    shown.forEach(function (hit) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("href", hit.entry.page.p);
      var title = document.createElement("span");
      title.className = "gs-title";
      marked(title, hit.entry.page.t, found.words);
      var group = document.createElement("span");
      group.className = "gs-group";
      group.appendChild(document.createTextNode(hit.entry.page.g));
      var text = document.createElement("span");
      text.className = "gs-text";
      marked(text, snippet(hit.entry, found.words), found.words);
      a.appendChild(title);
      a.appendChild(group);
      a.appendChild(text);
      li.appendChild(a);
      list.appendChild(li);
    });
    if (!found.hits.length) status.textContent = "No page has all of those words.";
    else if (found.hits.length > shown.length) status.textContent = "Showing " + shown.length + " of " + found.hits.length + " pages. Add a word to narrow it.";
    else status.textContent = found.hits.length === 1 ? "1 page" : found.hits.length + " pages";
  }

  function links() {
    return Array.prototype.slice.call(list.querySelectorAll("a"));
  }

  box.addEventListener("input", show);
  box.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      box.value = "";
      show();
    } else if (event.key === "Enter") {
      var first = links()[0];
      if (first) first.click();
    } else if (event.key === "ArrowDown") {
      var down = links()[0];
      if (down) {
        event.preventDefault();
        down.focus();
      }
    }
  });
  list.addEventListener("keydown", function (event) {
    var all = links();
    var at = all.indexOf(document.activeElement);
    if (event.key === "ArrowDown" && at < all.length - 1) {
      event.preventDefault();
      all[at + 1].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (at > 0) all[at - 1].focus();
      else box.focus();
    } else if (event.key === "Escape") {
      box.focus();
    }
  });
  // "/" goes to the box, as it does on most documentation sites, when nothing is being typed.
  document.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && tag !== "INPUT" && tag !== "TEXTAREA") {
      event.preventDefault();
      box.focus();
    }
  });
  // The list down the left follows the page: the row of the topic at the top of the screen is marked, and kept in view in the list, which
  // scrolls by itself, without moving the page. Nothing is remembered: it is worked out again from where the page is.
  var list = document.querySelector(".tree-d");
  var topics = Array.prototype.slice.call(document.querySelectorAll(".article .topic[id]"));
  if (list && topics.length) {
    var rows = {};
    Array.prototype.slice.call(list.querySelectorAll("li a")).forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var at = href.indexOf("#");
      if (at !== -1) rows[href.slice(at + 1)] = link;
    });
    var marked = null;
    var waiting = false;

    function mark(id) {
      if (id === marked) return;
      if (marked && rows[marked]) rows[marked].removeAttribute("aria-current");
      marked = id;
      var link = id && rows[id];
      if (!link) return;
      link.setAttribute("aria-current", "true");
      var top = link.offsetTop;
      var bottom = top + link.offsetHeight;
      if (top < list.scrollTop + 40) list.scrollTop = Math.max(0, top - 40);
      else if (bottom > list.scrollTop + list.clientHeight - 40) list.scrollTop = bottom - list.clientHeight + 40;
    }

    function follow() {
      waiting = false;
      if (wrap.classList.contains("searching")) return;
      var line = window.innerHeight * 0.3;
      var found = null;
      for (var i = 0; i < topics.length; i++) {
        if (topics[i].getBoundingClientRect().top <= line) found = topics[i].id;
        else break;
      }
      mark(found);
    }

    function soon() {
      if (!waiting) {
        waiting = true;
        window.requestAnimationFrame(follow);
      }
    }

    window.addEventListener("scroll", soon, { passive: true });
    window.addEventListener("resize", soon);
    follow();
  }
})();
