/* Stonefold questions search (the owner, 2026-11-22: "Yes, build it", to a box that hides the questions that don't
   hold your words; then the page took the guide's layout). It reads only this page's own questions, in this browser.
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

  // Each topic is a heading and the questions after it.
  var topics = [];
  var heads = document.querySelectorAll(".article h2.sec");
  for (var i = 0; i < heads.length; i++) {
    var topic = { heading: heads[i], groups: rowsFor(heads[i].id, true), rows: [] };
    for (var el = heads[i].nextElementSibling; el && el.tagName !== "H2"; el = el.nextElementSibling) {
      if (el.classList.contains("topic")) topic.rows.push({ item: el, words: fold(el.textContent), lines: rowsFor(el.id, false) });
    }
    topics.push(topic);
  }

  function show(list, on) {
    list.forEach(function (one) { if (one) one.hidden = !on; });
  }

  function search() {
    var asked = fold(box.value).split(/\s+/).filter(function (w) { return w.length > 0; });
    var found = 0;
    topics.forEach(function (topic) {
      var shown = 0;
      topic.rows.forEach(function (row) {
        var hit = asked.every(function (w) { return row.words.indexOf(w) !== -1; });
        row.item.hidden = !hit;
        show(row.lines, hit);
        if (hit) shown++;
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

  // The list down the left follows the page, as the guide's does (the owner, 2026-11-22: "add the highlight tracker to
  // the left menu of the questions page just like in the guide"): the row of the question at the top of the screen is
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
