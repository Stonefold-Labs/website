/* Stonefold questions search. It reads only this page's own questions, in this browser.
   It reaches no network, keeps nothing, and changes nothing but the box, one line under it, and which questions, topic
   headings and rows of the lists show. Without it the page shows every question. Pinned in scripts/check.py: read the
   diff before you change it. */
(function () {
  "use strict";
  var mount = document.getElementById("questions-search");
  if (!mount) return;

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

  var box = document.createElement("input");
  box.type = "search";
  box.className = "gsearch-box";
  box.placeholder = "Search the questions";
  box.setAttribute("aria-label", "Search the questions");
  box.setAttribute("autocomplete", "off");
  box.setAttribute("spellcheck", "false");
  var status = document.createElement("p");
  status.className = "gsearch-status";
  status.setAttribute("role", "status");
  mount.appendChild(box);
  mount.appendChild(status);
  mount.hidden = false;

  // The rows that name a place in the lists down the side: a question's row, or a topic's whole group.
  function rowsFor(id, topic) {
    var found = [];
    var links = document.querySelectorAll(".tree a");
    for (var i = 0; i < links.length; i++) {
      var to = links[i].getAttribute("href") || "";
      if (to.slice(to.indexOf("#") + 1) !== id) continue;
      found.push(topic ? links[i].closest("details") : links[i].closest("li"));
    }
    return found;
  }

  // Each topic is a heading and the questions after it. A question also holds its topic's heading, so "price" finds the
  // questions under "Price and help".
  var topics = [];
  var heads = document.querySelectorAll(".article h2.sec");
  for (var i = 0; i < heads.length; i++) {
    var topic = { heading: heads[i], groups: rowsFor(heads[i].id, true), rows: [] };
    for (var el = heads[i].nextElementSibling; el && el.tagName !== "H2"; el = el.nextElementSibling) {
      if (el.classList.contains("topic")) topic.rows.push({ item: el, words: fold(heads[i].textContent + " " + el.textContent), lines: rowsFor(el.id, false) });
    }
    topics.push(topic);
  }

  // Words that every question could hold, passed over when other words are typed, so a question asked as a sentence
  // ("how much does it cost") is found by the words that matter. Typed alone, they are searched for.
  var small = " a an the is are am be do does did can could will would should i me my mine you your it its it's of to in on at for from and or with without what how why when where who which if there this that so much many any ";

  function show(list, on) {
    list.forEach(function (one) { if (one) one.hidden = !on; });
  }

  // The words found are underlined in the questions still showing, as the guide's results are.
  // Each underline is a <mark> holding the page's own text, moved into it and never written as markup. Every new
  // search takes the old ones out first, and an empty box leaves the page as it was. Inside the wordmark the whole name
  // is underlined, so the logo is never split. Words of one letter are searched for but not underlined.
  var underlined = [];

  function clearUnderlines() {
    underlined.forEach(function (one) {
      var parent = one.parentNode;
      if (!parent) return;
      while (one.firstChild) parent.insertBefore(one.firstChild, one);
      parent.removeChild(one);
      parent.normalize();
    });
    underlined = [];
  }

  function wrapIn(node) {
    var one = document.createElement("mark");
    node.parentNode.insertBefore(one, node);
    one.appendChild(node);
    underlined.push(one);
  }

  function underline(root, words) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var texts = [];
    for (var node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node);
    texts.forEach(function (text) {
      var value = text.nodeValue;
      var folded = fold(value);
      if (folded.length !== value.length) return;
      if (text.parentNode.closest("svg")) return;
      if (text.parentNode.closest(".wm")) {
        if (words.some(function (w) { return folded.indexOf(w) !== -1; })) wrapIn(text);
        return;
      }
      var pieces = [];
      var from = 0;
      for (;;) {
        var best = -1;
        var length = 0;
        words.forEach(function (w) {
          var at = folded.indexOf(w, from);
          if (at !== -1 && (best === -1 || at < best || (at === best && w.length > length))) {
            best = at;
            length = w.length;
          }
        });
        if (best === -1) break;
        pieces.push([best, best + length]);
        from = best + length;
      }
      // From the last piece back, so the places of the earlier ones don't move.
      for (var k = pieces.length - 1; k >= 0; k--) {
        var piece = text.splitText(pieces[k][0]);
        piece.splitText(pieces[k][1] - pieces[k][0]);
        wrapIn(piece);
      }
    });
  }

  function search() {
    var typed = fold(box.value).split(/\s+/).filter(function (w) { return w.length > 0; });
    var asked = typed.filter(function (w) { return small.indexOf(" " + w + " ") === -1; });
    if (!asked.length) asked = typed;
    var toUnderline = asked.filter(function (w) { return w.length > 1; });
    clearUnderlines();
    var found = 0;
    topics.forEach(function (topic) {
      var shown = 0;
      topic.rows.forEach(function (row) {
        var hit = asked.every(function (w) { return row.words.indexOf(w) !== -1; });
        row.item.hidden = !hit;
        show(row.lines, hit);
        if (hit) shown++;
        if (hit && toUnderline.length) underline(row.item, toUnderline);
      });
      topic.heading.hidden = shown === 0;
      show(topic.groups, shown > 0);
      found += shown;
    });
    if (!asked.length) status.textContent = "";
    else if (found === 0) status.textContent = "No answers match. Try other words, or write to us.";
    else status.textContent = found === 1 ? "1 answer" : found + " answers";
  }

  box.addEventListener("input", search);

  // The list down the left follows the page, as the guide's does: the row of the question at the top of the screen is
  // marked, and kept in view in the list, which scrolls by itself, without moving the page. Questions a search has
  // hidden are passed over. Nothing is remembered: it is worked out again from where the page is.
  var list = document.querySelector(".tree-d");
  var questions = Array.prototype.slice.call(document.querySelectorAll(".article .topic[id]"));
  if (list && questions.length) {
    var marks = {};
    Array.prototype.slice.call(list.querySelectorAll("li a")).forEach(function (link) {
      var to = link.getAttribute("href") || "";
      var at = to.indexOf("#");
      if (at !== -1) marks[to.slice(at + 1)] = link;
    });
    var marked = null;
    var waiting = false;

    function mark(id) {
      if (id === marked) return;
      if (marked && marks[marked]) marks[marked].removeAttribute("aria-current");
      marked = id;
      var link = id && marks[id];
      if (!link) return;
      link.setAttribute("aria-current", "true");
      var top = link.offsetTop;
      var bottom = top + link.offsetHeight;
      if (top < list.scrollTop + 40) list.scrollTop = Math.max(0, top - 40);
      else if (bottom > list.scrollTop + list.clientHeight - 40) list.scrollTop = bottom - list.clientHeight + 40;
    }

    function follow() {
      waiting = false;
      var line = window.innerHeight * 0.3;
      var found = null;
      var last = null;
      for (var i = 0; i < questions.length; i++) {
        if (questions[i].hidden) continue;
        last = questions[i].id;
        if (questions[i].getBoundingClientRect().top <= line) found = questions[i].id;
        else break;
      }
      // At the foot of the page the last questions can't reach that line, so the last one shown is marked.
      var end = document.documentElement;
      if (window.innerHeight + window.scrollY >= end.scrollHeight - 2) {
        for (var j = questions.length - 1; j >= 0; j--) {
          if (!questions[j].hidden) { last = questions[j].id; break; }
        }
        found = last;
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
    box.addEventListener("input", soon);
    follow();
  }
})();
