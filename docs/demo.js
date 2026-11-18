/* The demo on the home page: a working copy of the Stonefold window on the Mac, drawn in HTML and filled with this
   page's own words, as notes, reminders, events and budget rows.

   It runs in this page only. It asks no server for anything, keeps nothing in the browser (no storage of any kind),
   and what a reader does in it is gone when the page is closed or opened again. It changes nothing
   outside its own window: its theme menu dresses the window alone. The page's own theme picker is theme.js.

   The panels follow the app's (its record 0040 and SPEC section 33): Today's four parts, a list or folder, and a
   picture, docked on the left, the right or along the bottom of whatever section is on screen; tabs; a pin that
   collapses a group to a strip at its edge, from which it slides out over the section; Hide Panels; three saved
   layouts. Under 720 points wide the window becomes the iPhone's: one section at a time, with a tab bar. */
(function () {
  "use strict";

  var mount = document.getElementById("demo");
  if (!mount || !document.querySelector || !window.addEventListener || !Array.prototype.forEach) {
    return;
  }

  /* ---------- small helpers ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  function all(sel, from) { return Array.prototype.slice.call((from || root).querySelectorAll(sel)); }
  function one(sel, from) { return (from || root).querySelector(sel); }
  var moneyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  function cash(n) { return moneyFormat.format(n); }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, "")); return isFinite(n) ? n : 0; }
  function attr(name, value) { return " " + name + "=\"" + esc(value) + "\""; }
  function act(name, value, extra) {
    return attr("data-act", name) + (value != null ? attr("data-v", value) : "") + (extra || "");
  }

  var ICONS = {
    today: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8\"/>",
    calendar: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M3.5 9.5h17M8 3v4M16 3v4\"/>",
    reminders: "<circle cx=\"6\" cy=\"7\" r=\"1.6\"/><circle cx=\"6\" cy=\"12\" r=\"1.6\"/><circle cx=\"6\" cy=\"17\" r=\"1.6\"/><path d=\"M10 7h10M10 12h10M10 17h10\"/>",
    notes: "<rect x=\"5\" y=\"3.5\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5\"/>",
    budget: "<path d=\"M4 20h16\"/><path d=\"M7 20v-6M17 20v-9\"/><path d=\"M12 20V5\"/>",
    money: "<rect x=\"3\" y=\"6.5\" width=\"18\" height=\"11\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/><path d=\"M6.5 9.5v5M17.5 9.5v5\"/>",
    events: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M3.5 9.5h17M8 3v4M16 3v4\"/><path d=\"M8 13.5h3\"/>",
    list: "<path d=\"M9 7h11M9 12h11M9 17h11\"/><path d=\"M4 7h1M4 12h1M4 17h1\"/>",
    folder: "<path d=\"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z\"/>",
    picture: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"14\" rx=\"2\"/><path d=\"M3.5 16l5-5 4 4 2.5-2.5 5.5 5\"/><circle cx=\"15.5\" cy=\"9\" r=\"1.5\"/>",
    panels: "<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2\"/><path d=\"M14.5 4.5v15M3.5 14.5h11\"/>",
    theme: "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 3.5a8.5 8.5 0 0 0 0 17z\" fill=\"currentColor\"/>",
    lock: "<rect x=\"5.5\" y=\"10.5\" width=\"13\" height=\"10\" rx=\"2\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5\"/>",
    pin: "<path d=\"M9 4h6l-1 6 3 3H7l3-3zM12 13v7\"/>",
    close: "<path d=\"M7 7l10 10M17 7L7 17\"/>",
    search: "<circle cx=\"11\" cy=\"11\" r=\"6\"/><path d=\"M20 20l-4.5-4.5\"/>",
    back: "<path d=\"M15 5l-7 7 7 7\"/>",
    down: "<path d=\"M6 9l6 6 6-6\"/>"
  };
  function icon(k, size) {
    size = size || 16;
    return "<svg class=\"sfd-ic\" viewBox=\"0 0 24 24\" width=\"" + size + "\" height=\"" + size + "\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\">" + ICONS[k] + "</svg>";
  }
  var MARK = "<svg class=\"sfd-mark\" viewBox=\"0 0 256 256\" width=\"48\" height=\"48\" aria-hidden=\"true\" focusable=\"false\"><g transform=\"translate(3 2)\"><rect x=\"64\" y=\"38\" width=\"56\" height=\"28\" rx=\"14\"/><rect x=\"130\" y=\"38\" width=\"56\" height=\"28\" rx=\"14\"/><rect x=\"37\" y=\"65\" width=\"28\" height=\"56\" rx=\"14\"/><rect x=\"37\" y=\"131\" width=\"28\" height=\"56\" rx=\"14\"/><rect x=\"185\" y=\"65\" width=\"28\" height=\"56\" rx=\"14\"/><rect x=\"185\" y=\"131\" width=\"28\" height=\"56\" rx=\"14\"/><rect x=\"64\" y=\"186\" width=\"45\" height=\"28\" rx=\"14\"/><rect x=\"141\" y=\"186\" width=\"45\" height=\"28\" rx=\"14\"/></g></svg>";

  /* ---------- the sections, the panels and the themes ---------- */

  var SECTIONS = ["calendar", "reminders", "notes", "budget"];
  var SECTION = {
    today: { name: "Today", key: "t" },
    calendar: { name: "Calendar", key: "c" },
    reminders: { name: "Reminders", key: "r" },
    notes: { name: "Notes", key: "n" },
    budget: { name: "Budget", key: "b" }
  };

  var PARTS = ["events", "reminders", "notes", "money"];
  var LISTS = ["list.try", "list.day", "folder.start", "folder.privacy"];
  var PICTURES = ["picture.1"];
  var PANEL = {
    events: { name: "Events", icon: "events", section: "calendar" },
    reminders: { name: "Reminders", icon: "reminders", section: "reminders" },
    notes: { name: "Notes", icon: "notes", section: "notes" },
    money: { name: "Money", icon: "money", section: "budget" },
    "list.try": { name: "Try these", icon: "list", kind: "List", section: "reminders", place: "try" },
    "list.day": { name: "With a day", icon: "list", kind: "List", section: "reminders", place: "day" },
    "folder.start": { name: "Start", icon: "folder", kind: "Folder", section: "notes", place: "start" },
    "folder.privacy": { name: "Privacy", icon: "folder", kind: "Folder", section: "notes", place: "privacy" },
    "picture.1": { name: "Picture", icon: "picture" }
  };

  /* The app's eight themes (LookThemes.swift), with what the menu says of each. */
  var THEMES = [
    ["sage", "Sage", "Dark green, the app’s start"],
    ["linen", "Linen", "Warm ivory"],
    ["night", "Night", "Near black, blue"],
    ["ember", "Ember", "Warm black, monospace"],
    ["paper", "Paper", "Paper and teal, serif"],
    ["dusk", "Dusk", "Violet, rounded"],
    ["clay", "Clay", "Plaster and terracotta, serif"],
    ["plain", "Plain", "Follows your device"]
  ];
  function themeName(k) { for (var i = 0; i < THEMES.length; i += 1) { if (THEMES[i][0] === k) { return THEMES[i][1]; } } return k; }

  /* ---------- dates ---------- */

  var TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function diffDays(a, b) { return Math.round((a - b) / 86400000); }
  function longDate(d) { return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
  function shortDate(d) { return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  function dayMonth(d) { return d.toLocaleDateString("en-US", { day: "numeric", month: "short" }); }
  function dayLabel(o) { return o === 0 ? "Today" : o === 1 ? "Tomorrow" : o === -1 ? "Yesterday" : shortDate(addDays(TODAY, o)); }
  function clock(minutes) {
    var d = new Date(TODAY); d.setMinutes(minutes);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  /* ---------- what the window holds: this page's words ---------- */

  var EVENTS = [
    { id: "e1", o: 0, t: "Look around", d: "This window is laid out like the Mac app. Everything in it comes from this page." },
    { id: "e2", o: 0, at: 14 * 60 + 30, end: 15 * 60 + 15, t: "Plain events", where: "Anywhere", d: "A title, a place and notes, all day or at set times." },
    { id: "e3", o: 1, at: 9 * 60, end: 9 * 60 + 30, t: "Month and day", d: "See where the busy days are, then open a day." },
    { id: "e4", o: 5, t: "Features you choose", d: "Repeats, alerts, more calendars and time zones are each a switch in Settings." },
    { id: "e5", o: 12, t: "One unlock", d: "Face ID, Touch ID or your device’s passcode opens all three encrypted files. By default, anyone who can unlock your device can open the app." },
    { id: "e6", o: -2, t: "No account", d: "No account, no sign-up and no server of ours. The app works without the internet." },
    { id: "e7", o: -5, t: "Three encrypted files", d: "Calendar and reminders, notes, and budget each have their own file and their own random key, kept on your device." },
    { id: "e8", o: -9, t: "Pay once", d: "It will cost $24.99, paid once, for the iPhone and Mac apps together. Nothing to renew." }
  ];

  var REMINDERS = [
    { id: "r0", o: -1, t: "Choose the sections you keep", d: "Welcome asks which to keep. You can change your mind later in Settings." },
    { id: "r1", o: 0, t: "Open a day on the calendar", d: "A reminder with a day shows under that day’s events. Mark it done from there." },
    { id: "r2", o: 3, t: "Repeats that wait for you", d: "A repeating reminder moves on only when you mark it done." },
    { id: "r3", o: 7, t: "Alerts with two buttons", d: "Done or Snooze, without opening the app." }
  ];

  var BILLS = [
    { id: "b1", o: 0, t: "Electricity", amt: 86.4, cat: "Electricity" },
    { id: "b2", o: 9, t: "Phone", amt: 45, cat: "Phone" }
  ];

  var NOTES = [
    { id: "n1", pin: true, ago: 0, folder: "start", body: [
      "# Start here",
      "This window is laid out like the Mac app, but it holds the website’s words instead of yours.",
      "",
      "The **Try these** list in Reminders walks you through it, and ticks itself off as you go.",
      "",
      "Nothing here is saved or sent anywhere."] },
    { id: "n2", ago: 1, folder: "start", body: [
      "# Panels, and your own layout",
      "On the Mac, Today can be split into panels you arrange yourself.",
      "",
      "- [ ] Events, Reminders, Notes and Money",
      "- [ ] Dock left, right or bottom",
      "- [ ] Drop on tabs to stack",
      "- [ ] Pin to collapse to a strip",
      "- [ ] Save up to three layouts",
      "",
      "The iPhone keeps its tab bar and has no panels."] },
    { id: "n3", ago: 2, folder: "privacy", body: [
      "# Why you pay once",
      "It will cost **$24.99**, paid once, for the iPhone and Mac apps together.",
      "",
      "- [x] No subscription",
      "- [x] No in-app purchases",
      "- [x] Nothing to renew",
      "",
      "Apps shouldn’t be subscriptions, especially a budget app."] },
    { id: "n4", ago: 3, folder: "privacy", body: [
      "# Encryption and privacy",
      "Everything you keep is stored on your devices, encrypted. We run no server for the app, so we can’t see what’s in it.",
      "",
      "- [x] Three encrypted files, each with its own key",
      "- [x] One unlock: Face ID, Touch ID or your passcode",
      "- [x] No account, no sign-up, no server of ours",
      "- [x] No ads, tracking, analytics or AI",
      "",
      "By default, anyone who can unlock your device can open the app. You can lock the budget or the notes with a passphrase of your own.",
      "",
      "The **recovery sheet** is one page you print, with a code for each file. It’s the way back in if a device’s keys are lost."] },
    { id: "n5", ago: 4, folder: "privacy", body: [
      "# Your data stays yours",
      "It lives in encrypted files on your devices. We hold no copy and no key.",
      "",
      "Your events, reminders, notes and budget can be exported in formats other apps open. Exports aren’t encrypted, so Stonefold asks first.",
      "",
      "In Settings, **What Leaves This Device** says in plain sentences what stays on your device, what goes somewhere only because you saved it there, and what Apple can see."] },
    { id: "n6", ago: 5, folder: "start", themes: true, body: [
      "# Make it yours",
      "Eight themes, four typefaces, and features you switch on only if you want them.",
      "",
      "- [ ] Sage, the app’s start",
      "- [ ] Linen, warm ivory",
      "- [ ] Night, near black and blue",
      "- [ ] Ember, in monospace",
      "- [ ] Paper, in serif",
      "- [ ] Dusk, rounded",
      "- [ ] Clay, plaster and terracotta",
      "- [ ] Plain, which follows your device",
      "",
      "Tick one to try it in this window, or use **Theme** in the toolbar."] },
    { id: "n7", ago: 6, folder: "start", body: [
      "# What’s inside",
      "Choose the sections you want when you first open Stonefold. You can change your mind later in Settings.",
      "",
      "**Calendar.** Your dates, by the month and by the day, with today circled.",
      "**Reminders.** Lists of things to do, with alerts.",
      "**Notes.** Plain notes. Start typing, and the first line is the title. Search looks through every note as you type.",
      "**Budget.** A budget you type by hand. It never connects to a bank."] },
    { id: "n8", ago: 7, folder: "start", body: [
      "# They work together",
      "Two switches in Settings let the sections show each other’s things. Both start off. In this window they’re on.",
      "",
      "- [x] Bills on the calendar",
      "- [x] Bills in Reminders",
      "- [x] Reminders on the calendar",
      "",
      "Choose **Paid** on the electricity bill, and the budget records it."] },
    { id: "n9", ago: 9, folder: "privacy", body: [
      "# About Stonefold Labs",
      "Stonefold Labs LLC is a small company. A fold is a pen with stone walls that keeps a flock together, and the app follows the same idea: what you keep is yours.",
      "",
      "Write to support@stonefoldlabs.com. We read every message."] }
  ];
  NOTES.forEach(function (n) { n.title = n.body[0].replace(/^# /, ""); });
  var FOLDERS = { start: "Start", privacy: "Privacy" };

  var BUDGET = [
    { group: "Bills", rows: [["Rent", 1450, 1450], ["Electricity", 90, 0], ["Phone", 45, 0], ["Internet", 60, 60]] },
    { group: "Everyday", rows: [["Groceries", 520, 311.27], ["Fuel", 160, 84.1], ["Eating out", 120, 96.5], ["Household", 80, 23.99]] },
    { group: "Goals", rows: [["Emergency fund", 400, 400], ["Holiday", 200, 0]] }
  ];
  var INCOME = 3600;

  var TOUR = [
    { k: "show", t: "Show a panel from Panels in the toolbar.", done: "Showed a panel", wide: true },
    { k: "edge", t: "Drag a panel by its tab to another edge.", done: "Moved a panel", wide: true },
    { k: "stack", t: "Drop a panel on another panel’s tabs to stack them.", done: "Stacked panels as tabs", wide: true },
    { k: "pin", t: "Pin a panel to its edge, then slide it out.", done: "Pinned and slid out", wide: true },
    { k: "layout", t: "Save the layout as Layout 1, hide the panels, then bring Layout 1 back.", done: "Saved and used Layout 1", wide: true },
    { k: "theme", t: "Pick a theme from Theme in the toolbar.", done: "Changed the theme" },
    { k: "search", t: "Search the notes for “encrypted”.", done: "Searched the notes" },
    { k: "bill", t: "Mark the electricity bill paid.", done: "Paid the electricity bill" }
  ];

  /* ---------- state: all of it in memory, none of it kept ---------- */

  var S = {
    section: "reminders",
    place: { calendar: "month", reminders: "try", notes: "all", budget: "home" },
    look: null, picked: false,
    tour: {}, note: "n1", query: "", boxes: {}, day: 0, remDone: {}, paid: {}, plan: {}, afford: "",
    onCalendar: { rem: true, bill: true },
    phone: false, phoneNote: false,
    locked: false, menu: null, ctx: null, slid: null, toast: "", gPending: false, saved: {}
  };
  BUDGET.forEach(function (g) { g.rows.forEach(function (r) { S.plan[r[0]] = r[1]; }); });

  /* ---------- the layout, as the app's PanelLayout has it ---------- */

  var gid = 0;
  function newGroup(panels) { gid += 1; return { id: "g" + gid, panels: panels.slice(), front: panels[0], collapsed: false }; }
  function emptyLayout() {
    return { docks: { left: { groups: [], size: 280 }, right: { groups: [], size: 280 }, bottom: { groups: [], size: 200 } }, hidden: false, closedFrom: {} };
  }
  function startLayout() {
    var l = emptyLayout();
    var day = newGroup(["events", "reminders"]);
    l.docks.right.groups.push(day, newGroup(["money"]));
    return l;
  }
  var DOCK_ORDER = ["left", "bottom", "right"];
  var L = startLayout();
  function copyOf(x) { return JSON.parse(JSON.stringify(x)); }

  function where(p) {
    for (var d = 0; d < DOCK_ORDER.length; d += 1) {
      var gs = L.docks[DOCK_ORDER[d]].groups;
      for (var i = 0; i < gs.length; i += 1) { if (gs[i].panels.indexOf(p) !== -1) { return { dock: DOCK_ORDER[d], g: gs[i], i: i }; } }
    }
    return null;
  }
  function groupAt(id) {
    for (var d = 0; d < DOCK_ORDER.length; d += 1) {
      var gs = L.docks[DOCK_ORDER[d]].groups;
      for (var i = 0; i < gs.length; i += 1) { if (gs[i].id === id) { return { dock: DOCK_ORDER[d], g: gs[i], i: i }; } }
    }
    return null;
  }
  function dropGroup(id) { var w = groupAt(id); if (w) { L.docks[w.dock].groups.splice(w.i, 1); } if (S.slid === id) { S.slid = null; } }
  function anyPanel() { return DOCK_ORDER.some(function (d) { return L.docks[d].groups.length > 0; }); }

  /* Shown: back in the dock it was closed from, at its end; the right, the first time. */
  function showPanel(p) {
    var w = where(p);
    L.hidden = false;
    if (w) { w.g.front = p; if (w.g.collapsed) { S.slid = w.g.id; } return false; }
    L.docks[L.closedFrom[p] || "right"].groups.push(newGroup([p]));
    return true;
  }
  /* Closed: the tab after it comes forward. */
  function closePanel(p) {
    var w = where(p);
    if (!w) { return; }
    var k = w.g.panels.indexOf(p);
    w.g.panels.splice(k, 1);
    if (w.g.front === p) { w.g.front = w.g.panels[k] || w.g.panels[k - 1]; }
    if (!w.g.panels.length) { dropGroup(w.g.id); }
    L.closedFrom[p] = w.dock;
  }
  function pinGroup(id) {
    var w = groupAt(id);
    if (!w) { return; }
    w.g.collapsed = !w.g.collapsed;
    S.slid = null;
  }
  function placeGroup(g, t) {
    if (t.kind === "end") { L.docks[t.dock].groups.push(g); return; }
    var w = groupAt(t.gid);
    L.docks[w.dock].groups.splice(w.i + (t.after ? 1 : 0), 0, g);
  }
  /* A tab dragged: its panel moves. Dropped where it already is, nothing changes (false). */
  function movePanel(p, t) {
    var w = where(p);
    if (!w) { return false; }
    var alone = w.g.panels.length === 1;
    if (t.kind === "tabs" && t.gid === w.g.id) { return false; }
    if (t.kind === "beside" && t.gid === w.g.id && alone) { return false; }
    if (t.kind === "end" && alone && t.dock === w.dock && w.i === L.docks[w.dock].groups.length - 1) { return false; }
    if (alone) { return moveGroup(w.g.id, t); }
    var k = w.g.panels.indexOf(p);
    w.g.panels.splice(k, 1);
    if (w.g.front === p) { w.g.front = w.g.panels[k] || w.g.panels[k - 1]; }
    if (t.kind === "tabs") {
      var tg = groupAt(t.gid).g;
      tg.panels.push(p); tg.front = p; tg.collapsed = false;
    } else {
      placeGroup(newGroup([p]), t);
    }
    return true;
  }
  /* A group dragged by its title: the whole group moves, and is docked. */
  function moveGroup(id, t) {
    var w = groupAt(id);
    if (!w) { return false; }
    if (t.kind === "tabs") {
      if (t.gid === id) { return false; }
      var tg = groupAt(t.gid).g;
      tg.panels = tg.panels.concat(w.g.panels); tg.front = w.g.front; tg.collapsed = false;
      dropGroup(id);
      return true;
    }
    if (t.kind === "beside" && t.gid === id) { return false; }
    var gs = L.docks[w.dock].groups;
    if (t.kind === "end" && t.dock === w.dock && w.i === gs.length - 1) { return false; }
    if (t.kind === "beside") {
      var tw = groupAt(t.gid);
      if (tw.dock === w.dock && tw.i + (t.after ? 1 : 0) - (tw.i > w.i ? 1 : 0) === w.i) { return false; }
    }
    gs.splice(w.i, 1);
    w.g.collapsed = false;
    if (S.slid === id) { S.slid = null; }
    placeGroup(w.g, t);
    return true;
  }
  function wouldChange(fn) {
    var keep = L, keepGid = gid, keepSlid = S.slid;
    L = copyOf(L);
    var changed = fn();
    L = keep; gid = keepGid; S.slid = keepSlid;
    return changed;
  }
  function dockOf(t) { return t.kind === "end" ? t.dock : groupAt(t.gid).dock; }

  /* ---------- the tour ---------- */

  var toastTimer = null;
  function say(words) {
    S.toast = words;
    var live = one(".sfd-live");
    if (live) { live.textContent = words; }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { S.toast = ""; drawStatus(); }, 3500);
  }
  function tourDone(k) {
    if (S.tour[k]) { return; }
    S.tour[k] = true;
    var item = TOUR.filter(function (x) { return x.k === k; })[0];
    var left = TOUR.length - tourCount();
    say("Done: " + item.done + "." + (left ? " " + left + " left to try." : " That’s the whole tour."));
  }
  function tourCount() { return TOUR.filter(function (x) { return S.tour[x.k]; }).length; }

  /* ---------- the budget's arithmetic ---------- */

  function spentOf(cat, base) {
    var extra = 0;
    BILLS.forEach(function (b) { if (b.cat === cat && S.paid[b.id]) { extra += b.amt; } });
    return base + extra;
  }
  function planned() { var t = 0; Object.keys(S.plan).forEach(function (k) { t += S.plan[k]; }); return t; }
  function leftToPlan() { return INCOME - planned(); }
  function groupLeft(name) {
    var g = BUDGET.filter(function (x) { return x.group === name; })[0], t = 0;
    g.rows.forEach(function (r) { t += S.plan[r[0]] - spentOf(r[0], r[2]); });
    return t;
  }
  function safeToSpend() { return groupLeft("Everyday") + Math.max(leftToPlan(), 0); }
  function billsWaiting() { return BILLS.filter(function (b) { return !S.paid[b.id] && b.o <= 0; }); }
  function billsComing() { return BILLS.filter(function (b) { return !S.paid[b.id] && b.o > 0 && b.o <= 14; }); }
  function remsLate() { return REMINDERS.filter(function (r) { return r.o < 0 && !S.remDone[r.id]; }); }
  function remsToday() { return REMINDERS.filter(function (r) { return r.o === 0 && !S.remDone[r.id]; }); }
  function eventsOn(o) { return EVENTS.filter(function (e) { return e.o === o; }).sort(function (a, b) { return (a.at == null ? -1 : a.at) - (b.at == null ? -1 : b.at); }); }
  function eventWhen(e) { return e.at == null ? "All day" : clock(e.at); }
  function noteMeta(n) {
    var when = n.ago === 0 ? "9:41 AM" : n.ago === 1 ? "Yesterday" : dayMonth(addDays(TODAY, -n.ago));
    var second = n.body.filter(function (l, i) { return i > 0 && l; })[0] || "";
    return { when: when, second: second.replace(/^- \[[ x]\] /, "").replace(/\*\*/g, "") };
  }
  function notesByRecent() { return NOTES.slice().sort(function (a, b) { return a.ago - b.ago; }); }

  /* ---------- rows, shared by Today, the panels and the sections ---------- */

  function row(inner, cls) { return "<li class=\"sfd-row" + (cls ? " " + cls : "") + "\">" + inner + "</li>"; }
  function ring(id, on, label) {
    return "<button type=\"button\" class=\"sfd-ring" + (on ? " is-on" : "") + "\"" + act("rem", id) + attr("aria-pressed", on ? "true" : "false") + attr("aria-label", (on ? "Done: " : "Mark done: ") + label) + "></button>";
  }
  function openBtn(kind, id, title, sub, trail, trailCls) {
    return "<button type=\"button\" class=\"sfd-open\"" + act("open", id, attr("data-kind", kind)) + "><span class=\"sfd-t\">" + esc(title) + "</span>" +
      (sub ? "<span class=\"sfd-s\">" + esc(sub) + "</span>" : "") + "</button>" +
      (trail ? "<span class=\"sfd-trail sfd-fig" + (trailCls ? " " + trailCls : "") + "\">" + esc(trail) + "</span>" : "");
  }
  function partHead(name) { return "<h4 class=\"sfd-label\">" + esc(name) + "</h4>"; }
  function quietLine(words) { return "<p class=\"sfd-quietline\">" + esc(words) + "</p>"; }

  function partEvents(withHead) {
    var h = withHead ? partHead("Calendar") : "";
    var today = eventsOn(0), tomorrow = eventsOn(1);
    if (!today.length && !tomorrow.length) { return h + quietLine("Nothing today or tomorrow."); }
    h += "<ul class=\"sfd-rows\">";
    today.forEach(function (e) { h += row("<span class=\"sfd-bar\" aria-hidden=\"true\"></span>" + openBtn("event", e.id, e.t, e.where || "", eventWhen(e))); });
    h += "</ul>";
    if (tomorrow.length) {
      h += "<p class=\"sfd-sub\">Tomorrow</p><ul class=\"sfd-rows\">";
      tomorrow.forEach(function (e) { h += row("<span class=\"sfd-bar\" aria-hidden=\"true\"></span>" + openBtn("event", e.id, e.t, e.where || "", eventWhen(e))); });
      h += "</ul>";
    }
    return h;
  }
  function partReminders(withHead) {
    var h = withHead ? partHead("Reminders") : "";
    var late = remsLate(), due = remsToday();
    if (!late.length && !due.length) { return h + quietLine("Nothing due today."); }
    function rows(list, isLate) {
      return "<ul class=\"sfd-rows\">" + list.map(function (r) {
        return row(ring(r.id, false, r.t) + openBtn("rem", r.id, r.t, "", isLate ? dayLabel(r.o) : "Today", isLate ? "is-late" : ""));
      }).join("") + "</ul>";
    }
    if (late.length) { h += "<p class=\"sfd-sub\">Overdue</p>" + rows(late, true) + "<p class=\"sfd-sub\">Due Today</p>"; }
    return h + (due.length ? rows(due, false) : quietLine("Nothing else due today."));
  }
  function partNotes(withHead) {
    var h = withHead ? partHead("Notes") : "";
    return h + "<ul class=\"sfd-rows\">" + notesByRecent().slice(0, 8).map(function (n) {
      var m = noteMeta(n);
      return row("<span class=\"sfd-dot\" aria-hidden=\"true\">" + icon("notes", 13) + "</span>" + openBtn("note", n.id, n.title, m.second, m.when));
    }).join("") + "</ul>";
  }
  function billRow(b, waiting) {
    var due = b.o === 0 ? "due today" : b.o < 0 ? "due " + dayLabel(b.o).toLowerCase() : "due " + dayMonth(addDays(TODAY, b.o));
    return row("<span class=\"sfd-note-ic\" aria-hidden=\"true\">" + icon("money", 14) + "</span>" + openBtn("bill", b.id, b.t, due, cash(b.amt)) +
      (waiting ? "<button type=\"button\" class=\"sfd-btn sfd-small\"" + act("pay", b.id) + attr("aria-label", "Paid: " + b.t + ", " + cash(b.amt)) + ">Paid</button>" : ""));
  }
  function partMoney(withHead) {
    var h = withHead ? partHead("Budget") : "";
    var safe = safeToSpend();
    h += "<p class=\"sfd-safe\"><span class=\"sfd-s\">Safe to Spend</span> <span class=\"sfd-fig" + (safe < 0 ? " is-late" : "") + "\">" + cash(safe) + "</span></p>";
    var wait = billsWaiting(), next = billsComing();
    if (wait.length) { h += "<p class=\"sfd-sub\">Waiting for You</p><ul class=\"sfd-rows\">" + wait.map(function (b) { return billRow(b, true); }).join("") + "</ul>"; }
    if (next.length) { h += "<p class=\"sfd-sub\">Bills Coming Up</p><ul class=\"sfd-rows\">" + next.map(function (b) { return billRow(b, false); }).join("") + "</ul>"; }
    if (!wait.length && !next.length) { h += quietLine("No bills in the next two weeks."); }
    return h;
  }
  function tourRows() {
    return "<ul class=\"sfd-rows\">" + TOUR.map(function (x) {
      var on = !!S.tour[x.k];
      var tag = S.phone && x.wide ? " <span class=\"sfd-tag\">on a wider screen</span>" : "";
      return row("<button type=\"button\" class=\"sfd-ring" + (on ? " is-on" : "") + "\"" + act("tour", x.k) + attr("aria-pressed", on ? "true" : "false") + attr("aria-label", (on ? "Done: " : "Mark done: ") + x.t) + "></button><span class=\"sfd-txt\"><span class=\"sfd-t\">" + esc(x.t) + "</span>" + tag + "</span>", on ? "is-done" : "");
    }).join("") + "</ul>";
  }
  function finale() {
    return tourCount() === TOUR.length ? "<div class=\"sfd-finale\"><strong>That’s the whole tour.</strong> For iPhone and Mac together, paid once, Stonefold will cost $24.99.</div>" : "";
  }
  function datedRows() {
    return "<ul class=\"sfd-rows\">" + REMINDERS.map(function (r) {
      var on = !!S.remDone[r.id];
      return row(ring(r.id, on, r.t) + openBtn("rem", r.id, r.t, r.d, dayLabel(r.o), r.o < 0 && !on ? "is-late" : ""), on ? "is-done" : "");
    }).join("") + "</ul>";
  }
  function folderRows(f) {
    return "<ul class=\"sfd-rows\">" + notesByRecent().filter(function (n) { return n.folder === f; }).map(function (n) {
      var m = noteMeta(n);
      return row("<span class=\"sfd-dot\" aria-hidden=\"true\">" + icon("notes", 13) + "</span>" + openBtn("note", n.id, n.title, m.second, m.when));
    }).join("") + "</ul>";
  }
  var PICTURE_ART = "<svg class=\"sfd-art\" viewBox=\"0 0 240 150\" width=\"240\" height=\"150\" aria-hidden=\"true\" focusable=\"false\"><rect class=\"a-sky\" width=\"240\" height=\"150\"/><circle class=\"a-sun\" cx=\"182\" cy=\"38\" r=\"15\"/><path class=\"a-far\" d=\"M0 92 C40 70 70 74 104 86 S170 66 240 82 V150 H0z\"/><path class=\"a-near\" d=\"M0 112 C50 96 96 100 140 110 S206 100 240 106 V150 H0z\"/><g class=\"a-wall\"><rect x=\"18\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"52\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"86\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"120\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"154\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"188\" y=\"118\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"35\" y=\"130\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"69\" y=\"130\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"103\" y=\"130\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"137\" y=\"130\" width=\"30\" height=\"9\" rx=\"4.5\"/><rect x=\"171\" y=\"130\" width=\"30\" height=\"9\" rx=\"4.5\"/></g></svg>";
  function pictureBody() {
    return "<figure class=\"sfd-picture\">" + PICTURE_ART + "<figcaption>A drawing stands in here. In the app you add a picture of your own, and it is kept inside the encrypted file that holds your calendar and reminders.</figcaption></figure>";
  }
  function panelName(p) { return p === "picture.1" ? "Picture, " + dayMonth(TODAY) : PANEL[p].name; }
  function panelBody(p) {
    switch (p) {
      case "events": return partEvents(false);
      case "reminders": return partReminders(false);
      case "notes": return partNotes(false);
      case "money": return partMoney(false);
      case "list.try": return tourRows() + finale();
      case "list.day": return datedRows();
      case "folder.start": return folderRows("start");
      case "folder.privacy": return folderRows("privacy");
      default: return pictureBody();
    }
  }

  /* ---------- the sections ---------- */

  function viewTitle(title, sub, extra) {
    return "<div class=\"sfd-vhead\"><h3 class=\"sfd-vtitle\">" + esc(title) + "</h3>" + (sub ? "<p class=\"sfd-vsub\">" + esc(sub) + "</p>" : "") + (extra || "") + "</div>";
  }
  function segmented(section, choices) {
    return "<div class=\"sfd-seg\" role=\"group\"" + attr("aria-label", SECTION[section].name + " places") + ">" + choices.map(function (c) {
      return "<button type=\"button\"" + act("place", c[0], attr("data-sec", section)) + attr("aria-pressed", S.place[section] === c[0] ? "true" : "false") + ">" + esc(c[1]) + "</button>";
    }).join("") + "</div>";
  }

  var VIEW = {};
  VIEW.today = function () {
    return "<div class=\"sfd-view sfd-today\" data-scroll=\"today\">" + viewTitle(longDate(TODAY), "Today, across the sections") +
      "<div class=\"sfd-cols\"><div class=\"sfd-col\">" + partEvents(true) + partReminders(true) + "</div><div class=\"sfd-col\">" + partNotes(true) + partMoney(true) + "</div></div></div>";
  };

  VIEW.reminders = function () {
    var p = S.place.reminders, h = "<div class=\"sfd-view\" data-scroll=\"rem-" + p + "\">";
    if (S.phone) { h += segmented("reminders", [["today", "Today"], ["try", "Try these"], ["day", "With a day"]]); }
    if (p === "today") {
      h += viewTitle("Today", longDate(TODAY));
      var wait = billsWaiting();
      if (wait.length) { h += "<p class=\"sfd-sub\">Waiting for You</p><ul class=\"sfd-rows\">" + wait.map(function (b) { return billRow(b, true); }).join("") + "</ul>"; }
      h += partReminders(false);
    } else if (p === "try") {
      var left = TOUR.length - tourCount();
      h += viewTitle("Try these", left ? left + " of " + TOUR.length + " left. They tick themselves off as you go." : "All " + TOUR.length + " done.") + tourRows() + finale();
    } else {
      h += viewTitle("With a day", "Each shows on its day in the calendar.") + datedRows();
    }
    return h + "</div>";
  };

  function inline(s) {
    var stars = "<span class=\"sfd-mk\" aria-hidden=\"true\">**</span>";
    return esc(s).replace(/\*\*(.+?)\*\*/g, function (whole, words) { return stars + "<b>" + words + "</b>" + stars; });
  }
  function themeOfLine(line) {
    var m = /^- \[[ x]\] (\w+)/.exec(line);
    if (!m) { return null; }
    var w = m[1].toLowerCase();
    return THEMES.some(function (t) { return t[0] === w; }) ? w : null;
  }
  function noteBody(n) {
    return n.body.map(function (line, i) {
      if (!line) { return "<div class=\"sfd-gap\"></div>"; }
      if (line.indexOf("# ") === 0) { return "<h4 class=\"sfd-md-h\"><span class=\"sfd-mk\" aria-hidden=\"true\">#</span> " + inline(line.slice(2)) + "</h4>"; }
      var m = /^- \[( |x)\] (.*)$/.exec(line);
      if (m) {
        var key = n.id + ":" + i, th = n.themes ? themeOfLine(line) : null;
        var on = th ? S.look === th && S.picked : (key in S.boxes ? S.boxes[key] : m[1] === "x");
        return "<div class=\"sfd-md-li" + (on ? " is-done" : "") + "\"><span class=\"sfd-mk\" aria-hidden=\"true\">-</span><button type=\"button\" class=\"sfd-md-box\"" + act("box", i, attr("data-note", n.id) + (th ? attr("data-look", th) : "")) + attr("aria-pressed", on ? "true" : "false") + attr("aria-label", (th ? "Try the theme: " : "Tick: ") + m[2].replace(/\*\*/g, "")) + "><span aria-hidden=\"true\">" + (on ? "[x]" : "[ ]") + "</span></button><span class=\"sfd-md-text\">" + inline(m[2]) + "</span></div>";
      }
      return "<p class=\"sfd-md-p\">" + inline(line) + "</p>";
    }).join("");
  }
  function notesShown() {
    var q = S.query.trim().toLowerCase(), f = S.place.notes;
    return NOTES.filter(function (n) {
      if (q) { return n.body.join(" ").toLowerCase().indexOf(q) !== -1; }
      return f === "all" || n.folder === f;
    }).sort(function (a, b) { return (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || a.ago - b.ago; });
  }
  function notesResults() {
    var notes = notesShown();
    if (notes.length && !notes.some(function (n) { return n.id === S.note; })) { S.note = notes[0].id; }
    var list = notes.length ? "<ul class=\"sfd-nlist\">" + notes.map(function (n) {
      var m = noteMeta(n);
      return "<li><button type=\"button\" class=\"sfd-nitem\"" + act("note", n.id) + attr("aria-pressed", n.id === S.note ? "true" : "false") + "><span class=\"sfd-t\">" + (n.pin ? icon("pin", 12) : "") + esc(n.title) + "</span><span class=\"sfd-s\"><span class=\"sfd-fig\">" + esc(m.when) + "</span> " + esc(m.second) + "</span></button></li>";
    }).join("") + "</ul>" : "<p class=\"sfd-quietline\">No notes match “" + esc(S.query) + "”.</p>";
    var n = NOTES.filter(function (x) { return x.id === S.note; })[0];
    var body = (n && notes.length) ? "<article class=\"sfd-note\"" + attr("aria-label", "Note: " + n.title) + ">" + noteBody(n) + "</article>" : "";
    var count = "<p class=\"sfd-sr sfd-count\" aria-live=\"polite\">" + (S.query.trim() ? notes.length + (notes.length === 1 ? " note matches." : " notes match.") : "") + "</p>";
    if (S.phone) {
      if (S.phoneNote && body) {
        return "<button type=\"button\" class=\"sfd-back\"" + act("notesback") + ">" + icon("back", 14) + "Notes</button>" + body;
      }
      return list + count;
    }
    return "<div class=\"sfd-nlist-wrap\" data-scroll=\"nlist\">" + list + count + "</div><div class=\"sfd-note-wrap\" data-scroll=\"nbody\">" + body + "</div>";
  }
  VIEW.notes = function () {
    var search = (S.phone && S.phoneNote) ? "" : "<label class=\"sfd-search\">" + icon("search", 14) + "<span class=\"sfd-sr\">Search every note</span><input type=\"search\" data-input=\"search\" placeholder=\"Search\" autocomplete=\"off\" spellcheck=\"false\"" + attr("value", S.query) + "></label>";
    return "<div class=\"sfd-view sfd-notes" + (S.phone ? " is-phone" : "") + "\"><h3 class=\"sfd-sr\">Notes</h3>" + search + "<div class=\"sfd-notes-results\">" + notesResults() + "</div></div>";
  };

  function calItems(o) {
    var items = eventsOn(o).map(function (e) { return { k: "event", x: e }; });
    if (S.onCalendar.rem) { REMINDERS.filter(function (r) { return r.o === o; }).forEach(function (r) { items.push({ k: "rem", x: r }); }); }
    if (S.onCalendar.bill) { BILLS.filter(function (b) { return b.o === o; }).forEach(function (b) { items.push({ k: "bill", x: b }); }); }
    return items;
  }
  function calChip(it) {
    var done = it.k === "rem" ? S.remDone[it.x.id] : it.k === "bill" ? S.paid[it.x.id] : false;
    var mark = it.k === "event" ? "<span class=\"sfd-bar\"></span>" : it.k === "rem" ? "<span class=\"sfd-mini-ring\"></span>" : "<span class=\"sfd-mini-dia\"></span>";
    return "<span class=\"sfd-chip" + (done ? " is-done" : "") + "\" aria-hidden=\"true\">" + mark + "<span>" + esc(it.x.t) + "</span></span>";
  }
  function dayPane(o) {
    var d = addDays(TODAY, o), items = calItems(o);
    var h = "<div class=\"sfd-day\"><h4 class=\"sfd-day-h\">" + esc(longDate(d)) + "</h4><p class=\"sfd-vsub\">" + esc(dayLabel(o)) + "</p>";
    if (!items.length) { return h + quietLine("Nothing on this day. Pick a day with something on it.") + "</div>"; }
    items.forEach(function (it) {
      if (it.k === "event") {
        h += "<div class=\"sfd-ev\"><span class=\"sfd-bar\" aria-hidden=\"true\"></span><span class=\"sfd-txt\"><span class=\"sfd-t\">" + esc(it.x.t) + "</span><span class=\"sfd-s sfd-fig\">" + esc(it.x.at == null ? "All day" : clock(it.x.at) + " to " + clock(it.x.end)) + "</span><span class=\"sfd-s\">" + esc(it.x.d) + "</span></span></div>";
      } else if (it.k === "rem") {
        var on = !!S.remDone[it.x.id];
        h += "<div class=\"sfd-ev" + (on ? " is-done" : "") + "\">" + ring(it.x.id, on, it.x.t) + "<span class=\"sfd-txt\"><span class=\"sfd-t\">" + esc(it.x.t) + "</span><span class=\"sfd-s\">" + esc(it.x.d) + "</span></span></div>";
      } else {
        h += "<div class=\"sfd-ev\"><span class=\"sfd-note-ic\" aria-hidden=\"true\">" + icon("money", 14) + "</span><span class=\"sfd-txt\"><span class=\"sfd-t\">" + esc(it.x.t) + " <span class=\"sfd-fig\">" + cash(it.x.amt) + "</span></span><span class=\"sfd-s\">" + (S.paid[it.x.id] ? "Paid, and recorded in the budget." : "Due. From the budget: each bill shows on its due day.") + "</span></span>" +
          (S.paid[it.x.id] ? "" : "<button type=\"button\" class=\"sfd-btn sfd-small\"" + act("pay", it.x.id) + attr("aria-label", "Paid: " + it.x.t) + ">Paid</button>") + "</div>";
      }
    });
    return h + "</div>";
  }
  VIEW.calendar = function () {
    var first = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    var start = addDays(first, -first.getDay());
    var h = "<div class=\"sfd-view sfd-cal\" data-scroll=\"cal\">" + viewTitle(TODAY.toLocaleDateString("en-US", { month: "long", year: "numeric" }), "", "<button type=\"button\" class=\"sfd-link\"" + act("day", 0) + ">Today</button>");
    h += "<div class=\"sfd-cal-in\"><div class=\"sfd-grid\" role=\"grid\" aria-label=\"The month\"><div class=\"sfd-wds\" role=\"row\">";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(function (d) { h += "<span class=\"sfd-wd\" role=\"columnheader\">" + d + "</span>"; });
    h += "</div>";
    for (var w = 0; w < 6; w += 1) {
      h += "<div class=\"sfd-week\" role=\"row\">";
      for (var i = 0; i < 7; i += 1) {
        var d = addDays(start, w * 7 + i), o = diffDays(d, TODAY), items = calItems(o);
        var cls = "sfd-cell" + (d.getMonth() !== TODAY.getMonth() ? " is-out" : "") + (o === 0 ? " is-today" : "") + (o === S.day ? " is-sel" : "");
        h += "<button type=\"button\" role=\"gridcell\" class=\"" + cls + "\"" + act("day", o) + attr("aria-selected", o === S.day ? "true" : "false") + attr("aria-label", longDate(d) + (o === 0 ? ", today" : "") + ", " + (items.length ? items.length + (items.length === 1 ? " thing" : " things") : "nothing")) + "><span class=\"sfd-num sfd-fig\" aria-hidden=\"true\">" + d.getDate() + "</span>";
        items.slice(0, 2).forEach(function (it) { h += calChip(it); });
        if (items.length > 2) { h += "<span class=\"sfd-chip sfd-more\" aria-hidden=\"true\"><span>" + (items.length - 2) + " more</span></span>"; }
        h += "</button>";
      }
      h += "</div>";
    }
    return h + "</div>" + dayPane(S.day) + "</div></div>";
  };

  VIEW.budget = function () {
    var p = S.place.budget, h = "<div class=\"sfd-view sfd-bud\" data-scroll=\"bud-" + p + "\">";
    if (S.phone) { h += segmented("budget", [["home", "Home"], ["plan", "Plan"]]); }
    var month = TODAY.toLocaleDateString("en-US", { month: "long" });
    if (p === "home") {
      var safe = safeToSpend(), billsLeft = 0;
      BILLS.forEach(function (b) { if (!S.paid[b.id]) { billsLeft += b.amt; } });
      var dayOf = TODAY.getDate(), days = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
      var everydayPlan = 0, everydaySpent = 0;
      BUDGET[1].rows.forEach(function (r) { everydayPlan += S.plan[r[0]]; everydaySpent += spentOf(r[0], r[2]); });
      var pace = everydayPlan * dayOf / days;
      h += viewTitle(month, "Example figures. A budget you type by hand. It never connects to a bank.");
      h += "<p class=\"sfd-headline\"><span class=\"sfd-s\">Safe to Spend</span><span class=\"sfd-big sfd-fig\" data-fig=\"safe\">" + cash(safe) + "</span></p>";
      h += "<ul class=\"sfd-answers\">" +
        "<li><span class=\"sfd-s\">Are the bills covered?</span><strong>" + (groupLeft("Bills") >= billsLeft - 0.005 ? "Yes" : "Not yet") + "</strong><span class=\"sfd-s\"><span class=\"sfd-fig\">" + cash(billsLeft) + "</span> of bills still to pay, and <span class=\"sfd-fig\">" + cash(groupLeft("Bills")) + "</span> left in Bills.</span></li>" +
        "<li><span class=\"sfd-s\">Am I on pace?</span><strong>" + (everydaySpent <= pace ? "Yes" : "Not quite") + "</strong><span class=\"sfd-s\"><span class=\"sfd-fig\">" + cash(everydaySpent) + "</span> spent on everyday things, against <span class=\"sfd-fig\">" + cash(pace) + "</span> by today.</span></li>" +
        "<li><span class=\"sfd-s\">Left to plan</span><strong class=\"sfd-fig\" data-fig=\"ltp\">" + cash(leftToPlan()) + "</strong><span class=\"sfd-s\">Of <span class=\"sfd-fig\">" + cash(INCOME) + "</span> coming in.</span></li></ul>";
      h += "<div class=\"sfd-afford\"><label class=\"sfd-afford-l\" for=\"sfd-afford\">Can I afford it?</label><div class=\"sfd-afford-row\"><input id=\"sfd-afford\" data-input=\"afford\" inputmode=\"decimal\" placeholder=\"$0.00\" autocomplete=\"off\"" + attr("value", S.afford) + "><span class=\"sfd-ans\" aria-live=\"polite\"></span></div><span class=\"sfd-s sfd-how\"></span></div>";
    } else {
      h += viewTitle(month + ": the plan", "", "<span class=\"sfd-chipbox sfd-fig\" data-fig=\"ltpchip\"></span>");
      h += "<div class=\"sfd-tablewrap\"><table class=\"sfd-plan\"><caption class=\"sfd-sr\">The plan for " + esc(month) + ". Type in the Plan column.</caption><thead><tr><th scope=\"col\">Category</th><th scope=\"col\">Plan</th><th scope=\"col\" class=\"sfd-spent\">Spent</th><th scope=\"col\">Left</th></tr></thead><tbody>";
      BUDGET.forEach(function (g) {
        h += "<tr class=\"sfd-grp\"><th scope=\"rowgroup\">" + esc(g.group) + "</th><td" + attr("data-gplan", g.group) + "></td><td class=\"sfd-spent\"" + attr("data-gspent", g.group) + "></td><td" + attr("data-gleft", g.group) + "></td></tr>";
        g.rows.forEach(function (r) {
          h += "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td><input data-input=\"plan\" inputmode=\"decimal\" autocomplete=\"off\"" + attr("data-v", r[0]) + attr("value", S.plan[r[0]].toFixed(2)) + attr("aria-label", "Plan for " + r[0]) + "></td><td class=\"sfd-spent\"" + attr("data-spent", r[0]) + "></td><td" + attr("data-left", r[0]) + "></td></tr>";
        });
      });
      h += "</tbody></table></div>";
    }
    return h + "</div>";
  };
  function budgetFigures() {
    var scope = one(".sfd-bud");
    if (!scope) { return; }
    BUDGET.forEach(function (g) {
      var gp = 0, gs = 0;
      g.rows.forEach(function (r) {
        var p = S.plan[r[0]], s = spentOf(r[0], r[2]), l = p - s;
        gp += p; gs += s;
        var sc = one("[data-spent=\"" + r[0] + "\"]", scope), lc = one("[data-left=\"" + r[0] + "\"]", scope);
        if (sc) { sc.textContent = cash(s); }
        if (lc) { lc.textContent = cash(l); lc.classList.toggle("is-late", l < 0); }
      });
      [["data-gplan", gp], ["data-gspent", gs], ["data-gleft", gp - gs]].forEach(function (pair) {
        var n = one("[" + pair[0] + "=\"" + g.group + "\"]", scope);
        if (n) { n.textContent = cash(pair[1]); }
      });
    });
    var ltp = leftToPlan(), chip = one("[data-fig=ltpchip]", scope);
    if (chip) { chip.textContent = (ltp < 0 ? "Over-planned by " : "Left to plan ") + cash(Math.abs(ltp)); chip.classList.toggle("is-late", ltp < 0); }
    var ltpFig = one("[data-fig=ltp]", scope);
    if (ltpFig) { ltpFig.textContent = cash(ltp); }
    var safeFig = one("[data-fig=safe]", scope);
    if (safeFig) { safeFig.textContent = cash(safeToSpend()); }
    var ans = one(".sfd-ans", scope), how = one(".sfd-how", scope);
    if (!ans) { return; }
    var amt = num(S.afford), everyday = groupLeft("Everyday"), free = Math.max(ltp, 0), safe = everyday + free;
    if (!S.afford.trim() || amt <= 0) { ans.textContent = ""; how.textContent = "Type an amount, and Stonefold tells you whether you can."; ans.classList.remove("is-late"); return; }
    ans.textContent = amt <= safe ? "Yes. You’d still have " + cash(safe - amt) + " this month." : "Not this month. You’d be " + cash(amt - safe) + " short.";
    ans.classList.toggle("is-late", amt > safe);
    how.textContent = "How: " + cash(everyday) + " left in Everyday, plus " + cash(free) + " not yet planned. Just arithmetic.";
  }

  /* Each section's sidebar: the Mac's own, which doesn't move. */
  function sidebar() {
    var s = S.section, h = "<nav class=\"sfd-side\"" + attr("aria-label", (s === "today" ? "Today" : SECTION[s].name) + " sidebar") + ">";
    function item(sec, place, name, count, ic) {
      return "<button type=\"button\" class=\"sfd-side-i\"" + act("place", place, attr("data-sec", sec)) + attr("aria-pressed", S.place[sec] === place ? "true" : "false") + ">" + icon(ic, 14) + "<span>" + esc(name) + "</span>" + (count != null ? "<span class=\"sfd-fig sfd-count-n\">" + count + "</span>" : "") + "</button>";
    }
    if (s === "today") {
      h += "<p class=\"sfd-side-h\">Today</p>";
      SECTIONS.forEach(function (sec) {
        var c = sec === "calendar" ? eventsOn(0).length : sec === "reminders" ? remsLate().length + remsToday().length : sec === "notes" ? NOTES.length : billsWaiting().length;
        h += "<button type=\"button\" class=\"sfd-side-i\"" + act("sec", sec) + ">" + icon(sec, 14) + "<span>" + SECTION[sec].name + "</span><span class=\"sfd-fig sfd-count-n\">" + c + "</span></button>";
      });
    } else if (s === "reminders") {
      h += "<p class=\"sfd-side-h\">Lists</p>" + item("reminders", "today", "Today", remsLate().length + remsToday().length + billsWaiting().length, "today") +
        item("reminders", "try", "Try these", TOUR.length - tourCount(), "list") + item("reminders", "day", "With a day", REMINDERS.filter(function (r) { return !S.remDone[r.id]; }).length, "list");
    } else if (s === "notes") {
      h += "<p class=\"sfd-side-h\">Notes</p>" + item("notes", "all", "All Notes", NOTES.length, "notes") + "<p class=\"sfd-side-h\">Folders</p>" +
        item("notes", "start", "Start", NOTES.filter(function (n) { return n.folder === "start"; }).length, "folder") +
        item("notes", "privacy", "Privacy", NOTES.filter(function (n) { return n.folder === "privacy"; }).length, "folder");
    } else if (s === "budget") {
      h += "<p class=\"sfd-side-h\">Budget</p>" + item("budget", "home", "Home", null, "budget") + item("budget", "plan", "Plan", null, "list");
    } else {
      h += "<p class=\"sfd-side-h\">Calendar</p>" + item("calendar", "month", "Month", null, "calendar") + "<p class=\"sfd-side-h\">Shown on it</p>" +
        "<button type=\"button\" class=\"sfd-side-i\"" + act("oncal", "rem") + attr("aria-pressed", S.onCalendar.rem ? "true" : "false") + ">" + icon("reminders", 14) + "<span>Reminders</span></button>" +
        "<button type=\"button\" class=\"sfd-side-i\"" + act("oncal", "bill") + attr("aria-pressed", S.onCalendar.bill ? "true" : "false") + ">" + icon("money", 14) + "<span>Bills</span></button>";
    }
    return h + "</nav>";
  }

  /* ---------- drawing the window ---------- */

  var root = document.createElement("div");
  root.className = "sfd";
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", "Stonefold demo window");
  root.innerHTML =
    "<div class=\"sfd-win\" tabindex=\"-1\">" +
    "<div class=\"sfd-titlebar\"><span class=\"sfd-lights\" aria-hidden=\"true\"><i></i><i></i><i></i></span><p class=\"sfd-wtitle\"></p><span class=\"sfd-badge\">Demo</span><div class=\"sfd-tools\"></div></div>" +
    "<div class=\"sfd-body\"></div>" +
    "<div class=\"sfd-status\"></div>" +
    "<div class=\"sfd-lock\" hidden><div class=\"sfd-lock-in\">" + MARK + "<h3 class=\"sfd-lock-h\">Unlock to open Stonefold</h3><p>Face ID, Touch ID, or your device’s passcode or password opens the app. By default, anyone who can unlock your device can open the app.</p><button type=\"button\" class=\"sfd-btn\" data-act=\"unlock\">Unlock</button></div></div>" +
    "<div class=\"sfd-pop\" hidden></div>" +
    "</div>" +
    "<p class=\"sfd-sr sfd-live\" aria-live=\"polite\"></p>" +
    "<div class=\"sfd-ghost\" aria-hidden=\"true\" hidden></div><div class=\"sfd-hint\" aria-hidden=\"true\" hidden></div>";

  function drawTitle() {
    one(".sfd-wtitle").textContent = S.phone ? SECTION[S.section === "today" ? "reminders" : S.section].name : SECTION[S.section].name;
    var tools = "";
    if (!S.phone) {
      tools += "<button type=\"button\" class=\"sfd-tool\"" + act("sec", "today") + attr("aria-pressed", S.section === "today" ? "true" : "false") + " title=\"Today (G, then T)\">" + icon("today", 15) + "<span class=\"sfd-lbl\">Today</span></button>";
      tools += "<button type=\"button\" class=\"sfd-tool\"" + act("menu", "panels") + " aria-haspopup=\"true\"" + attr("aria-expanded", S.menu === "panels" ? "true" : "false") + ">" + icon("panels", 15) + "<span class=\"sfd-lbl\">Panels</span>" + icon("down", 12) + "</button>";
    }
    tools += "<button type=\"button\" class=\"sfd-tool\"" + act("menu", "theme") + " aria-haspopup=\"true\"" + attr("aria-expanded", S.menu === "theme" ? "true" : "false") + attr("aria-label", "Theme: " + themeName(S.look)) + ">" + icon("theme", 15) + "<span class=\"sfd-lbl\">" + esc(themeName(S.look)) + "</span>" + icon("down", 12) + "</button>";
    tools += "<button type=\"button\" class=\"sfd-tool\"" + act("lock") + ">" + icon("lock", 15) + "<span class=\"sfd-lbl\">Lock</span></button>";
    one(".sfd-tools").innerHTML = tools;
  }

  function railHtml() {
    return "<nav class=\"sfd-rail\" aria-label=\"Sections\">" + SECTIONS.map(function (s) {
      return "<button type=\"button\"" + act("sec", s) + attr("aria-current", S.section === s ? "page" : "false") + attr("title", SECTION[s].name + " (G, then " + SECTION[s].key.toUpperCase() + ")") + attr("aria-label", SECTION[s].name) + ">" + icon(s, 19) + "</button>";
    }).join("") + "</nav>";
  }

  function groupHtml(g, dock, slid) {
    var single = g.panels.length === 1;
    var h = "<section class=\"sfd-group" + (slid ? " is-slid" : "") + "\"" + attr("data-gid", g.id) + attr("data-dock", dock) + attr("aria-label", g.panels.map(panelName).join(", ") + (single ? " panel" : " panels")) + ">";
    h += "<div class=\"sfd-ghead\"" + attr("data-gid", g.id) + ">";
    g.panels.forEach(function (p) {
      h += "<button type=\"button\" class=\"sfd-tab" + (p === g.front ? " is-front" : "") + (single ? " is-single" : "") + "\"" + act("tab", p, attr("data-gid", g.id)) + attr("aria-pressed", p === g.front ? "true" : "false") +
        attr("title", "Drag to move " + panelName(p) + ". Right-click for more.") + ">" + icon(PANEL[p].icon, 13) + "<span>" + esc(panelName(p)) + "</span></button>";
    });
    h += "<span class=\"sfd-ghead-gap\" aria-hidden=\"true\"></span>";
    h += "<button type=\"button\" class=\"sfd-gbtn" + (g.collapsed ? " is-on" : "") + "\"" + act("pin", g.id) + attr("aria-pressed", g.collapsed ? "true" : "false") + attr("aria-label", (g.collapsed ? "Dock again: " : "Pin to the edge: ") + panelName(g.front)) + attr("title", g.collapsed ? "Dock again" : "Pin to the edge") + ">" + icon("pin", 13) + "</button>";
    h += "<button type=\"button\" class=\"sfd-gbtn\"" + act("close", g.front) + attr("aria-label", "Close " + panelName(g.front)) + " title=\"Close\">" + icon("close", 13) + "</button>";
    h += "</div><div class=\"sfd-gbody\"" + attr("data-p", g.front) + attr("data-scroll", "p-" + g.front) + ">" + panelBody(g.front) + "</div></section>";
    return h;
  }
  function dockHtml(d) {
    var dock = L.docks[d], docked = dock.groups.filter(function (g) { return !g.collapsed; });
    if (!docked.length) { return ""; }
    return "<div class=\"sfd-dock\"" + attr("data-dock", d) + ">" + docked.map(function (g) { return groupHtml(g, d, false); }).join("") + "</div>";
  }
  function dividerHtml(d) {
    if (!L.docks[d].groups.some(function (g) { return !g.collapsed; })) { return ""; }
    var max = d === "bottom" ? 480 : 520, min = d === "bottom" ? 120 : 200;
    return "<div class=\"sfd-divider\" role=\"separator\" tabindex=\"0\"" + attr("data-dock", d) + attr("aria-orientation", d === "bottom" ? "horizontal" : "vertical") + attr("aria-label", "Size of the " + (d === "bottom" ? "bottom" : d) + " panels") + attr("aria-valuemin", min) + attr("aria-valuemax", max) + attr("aria-valuenow", L.docks[d].size) + "></div>";
  }
  function stripHtml(d) {
    var collapsed = L.docks[d].groups.filter(function (g) { return g.collapsed; });
    if (!collapsed.length) { return ""; }
    var h = "<div class=\"sfd-strip\"" + attr("data-dock", d) + " role=\"group\"" + attr("aria-label", "Pinned to the " + d + " edge") + ">";
    collapsed.forEach(function (g) {
      g.panels.forEach(function (p) {
        var open = S.slid === g.id && g.front === p;
        h += "<button type=\"button\" class=\"sfd-strip-i\"" + act("strip", p, attr("data-gid", g.id)) + attr("aria-expanded", open ? "true" : "false") + attr("aria-label", "Slide out " + panelName(p)) + ">" + icon(PANEL[p].icon, 13) + "<span>" + esc(panelName(p)) + "</span></button>";
      });
    });
    return h + "</div>";
  }
  function slidHtml() {
    if (!S.slid) { return ""; }
    var w = groupAt(S.slid);
    if (!w || !w.g.collapsed) { S.slid = null; return ""; }
    return "<div class=\"sfd-slide\"" + attr("data-dock", w.dock) + ">" + groupHtml(w.g, w.dock, true) + "</div>";
  }

  function drawBody() {
    var body = one(".sfd-body");
    var scrolls = {};
    all("[data-scroll]", body).forEach(function (e) { scrolls[e.getAttribute("data-scroll")] = e.scrollTop; });
    var h;
    if (S.phone) {
      var sec = S.section === "today" ? "reminders" : S.section;
      h = "<div class=\"sfd-phone\"><div class=\"sfd-phone-body\" data-scroll=\"phone-" + sec + "\">" + VIEW[sec]() + "</div><nav class=\"sfd-tabbar\" aria-label=\"Sections\">" + SECTIONS.map(function (s) {
        return "<button type=\"button\"" + act("sec", s) + attr("aria-current", sec === s ? "page" : "false") + ">" + icon(s, 20) + "<span>" + SECTION[s].name + "</span></button>";
      }).join("") + "</nav></div>";
    } else {
      var show = !L.hidden;
      h = railHtml() + (S.wide ? sidebar() : "");
      h += show ? stripHtml("left") + dockHtml("left") + dividerHtml("left") : "";
      h += "<div class=\"sfd-mid\"><div class=\"sfd-centre\">" + VIEW[S.section]() + (show ? slidHtml() : "") + "</div>";
      h += show ? dividerHtml("bottom") + dockHtml("bottom") + stripHtml("bottom") : "";
      h += "</div>";
      h += show ? dividerHtml("right") + dockHtml("right") + stripHtml("right") : "";
    }
    body.innerHTML = h;
    DOCK_ORDER.forEach(function (d) { sizeDock(d); });
    all("[data-scroll]", body).forEach(function (e) { var k = e.getAttribute("data-scroll"); if (scrolls[k]) { e.scrollTop = scrolls[k]; } });
    budgetFigures();
  }
  function sizeDock(d) {
    var el = one(".sfd-dock[data-dock=\"" + d + "\"]"), slide = one(".sfd-slide[data-dock=\"" + d + "\"]");
    var size = L.docks[d].size + "px";
    [el, slide].forEach(function (x) { if (x) { if (d === "bottom") { x.style.height = size; } else { x.style.width = size; } } });
  }
  function refreshPanels() {
    all(".sfd-gbody").forEach(function (b) { b.innerHTML = panelBody(b.getAttribute("data-p")); });
  }

  function drawStatus() {
    var st = one(".sfd-status");
    if (S.phone) { st.innerHTML = ""; st.hidden = true; return; }
    st.hidden = false;
    var ev = eventsOn(0).length, due = remsToday().length, late = remsLate().length, wait = billsWaiting().length;
    var now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    var next = eventsOn(0).filter(function (e) { return e.at != null && e.at >= mins; })[0];
    var items = [
      ["calendar", ev ? ev + (ev === 1 ? " event today" : " events today") : "No events today"],
      ["reminders", due || late ? due + " due" + (late ? ", " + late + " late" : "") : "Nothing due"],
      ["notes", NOTES.length + " notes"]
    ];
    if (wait) { items.push(["budget", wait + (wait === 1 ? " bill waiting" : " bills waiting")]); }
    var h = "<span class=\"sfd-st-left\">" + items.map(function (x) { return "<button type=\"button\"" + act("sec", x[0]) + ">" + esc(x[1]) + "</button>"; }).join("<span class=\"sfd-sep\" aria-hidden=\"true\">·</span>");
    if (next) { h += "<span class=\"sfd-sep\" aria-hidden=\"true\">·</span><button type=\"button\"" + act("open", next.id, attr("data-kind", "event")) + ">Next: " + esc(next.t) + " at " + esc(clock(next.at)) + "</button>"; }
    h += "</span>";
    var mid = S.toast ? esc(S.toast) : S.gPending ? "Go to: " + ["t", "c", "r", "n", "b"].map(function (k) {
      var s = k === "t" ? "today" : SECTIONS.filter(function (x) { return SECTION[x].key === k; })[0];
      return "<kbd>" + k.toUpperCase() + "</kbd> " + SECTION[s].name;
    }).join("  ") : "Press <kbd>G</kbd> then a letter to jump";
    h += "<span class=\"sfd-st-mid\">" + mid + "</span>";
    h += "<span class=\"sfd-st-right\"><span class=\"sfd-prog\">" + tourCount() + " of " + TOUR.length + " tried</span><span class=\"sfd-sep\" aria-hidden=\"true\">·</span><span class=\"sfd-fig\">" + esc(shortDate(TODAY)) + "</span></span>";
    st.innerHTML = h;
  }

  function menuItem(actName, v, label, opts) {
    opts = opts || {};
    return "<button type=\"button\" class=\"sfd-mi\"" + act(actName, v, opts.extra || "") + (opts.pressed != null ? attr("aria-pressed", opts.pressed ? "true" : "false") : "") + (opts.disabled ? " disabled" : "") + ">" +
      "<span class=\"sfd-mi-tick\" aria-hidden=\"true\">" + (opts.pressed ? "✓" : "") + "</span><span class=\"sfd-mi-l\">" + label + "</span>" + (opts.key ? "<kbd class=\"sfd-mi-k\">" + opts.key + "</kbd>" : "") + "</button>";
  }
  function drawPop() {
    var pop = one(".sfd-pop");
    if (!S.menu && !S.ctx) { pop.hidden = true; pop.innerHTML = ""; return; }
    var h = "";
    pop.className = "sfd-pop";
    if (S.menu === "theme") {
      pop.classList.add("is-theme");
      h = "<div role=\"group\" aria-label=\"Themes\">" + THEMES.map(function (t) {
        return "<button type=\"button\" class=\"sfd-mi sfd-look\"" + act("look", t[0]) + attr("aria-pressed", S.look === t[0] ? "true" : "false") + "><span class=\"sfd-sw\"" + attr("data-look", t[0]) + " aria-hidden=\"true\"></span><span class=\"sfd-mi-l\"><strong>" + t[1] + "</strong><span class=\"sfd-s\">" + t[2] + "</span></span><span class=\"sfd-mi-tick\" aria-hidden=\"true\">" + (S.look === t[0] ? "✓" : "") + "</span></button>";
      }).join("") + "<p class=\"sfd-pop-note\">Changes this window only, and isn’t remembered.</p></div>";
    } else if (S.menu === "panels") {
      pop.classList.add("is-panels");
      h = "<div role=\"group\" aria-label=\"View, Panels\"><p class=\"sfd-pop-h\">View ▸ Panels</p>";
      PARTS.forEach(function (p) { h += menuItem("panel", p, esc(PANEL[p].name), { pressed: !!where(p) }); });
      h += "<p class=\"sfd-pop-h\">Lists</p>";
      LISTS.forEach(function (p) { h += menuItem("panel", p, esc(PANEL[p].name) + " <span class=\"sfd-s\">" + PANEL[p].kind + "</span>", { pressed: !!where(p) }); });
      h += "<p class=\"sfd-pop-h\">Pictures</p>";
      PICTURES.forEach(function (p) { h += menuItem("panel", p, "Picture added " + esc(dayMonth(TODAY)), { pressed: !!where(p) }); });
      h += "<hr>" + menuItem("hide", null, L.hidden ? "Show Panels" : "Hide Panels", { key: "⌃⌘P", disabled: !anyPanel() });
      h += menuItem("cycle", "1", "Next Panel", { key: "⌃⌘]", disabled: !anyPanel() || L.hidden }) + menuItem("cycle", "-1", "Previous Panel", { key: "⌃⌘[", disabled: !anyPanel() || L.hidden });
      h += "<hr>";
      [1, 2, 3].forEach(function (n) { h += menuItem("layout", n, "Layout " + n, { disabled: !S.saved[n] }); });
      h += "<div class=\"sfd-mi-row\"><span>Save Layout</span>" + [1, 2, 3].map(function (n) { return "<button type=\"button\" class=\"sfd-mini\"" + act("save", n) + attr("aria-label", "Save as Layout " + n) + ">" + n + "</button>"; }).join("") + "</div>";
      h += "<div class=\"sfd-mi-row\"><span>Forget Layout</span>" + [1, 2, 3].map(function (n) { return "<button type=\"button\" class=\"sfd-mini\"" + act("forget", n) + attr("aria-label", "Forget Layout " + n) + (S.saved[n] ? "" : " disabled") + ">" + n + "</button>"; }).join("") + "</div>";
      h += menuItem("putaway", null, "Put All Panels Away", { disabled: !anyPanel() }) + "</div>";
    } else if (S.ctx) {
      pop.classList.add("is-ctx");
      var w = groupAt(S.ctx.gid);
      if (!w) { S.ctx = null; pop.hidden = true; return; }
      var gx = attr("data-gid", w.g.id);
      h = "<div role=\"group\"" + attr("aria-label", panelName(w.g.front) + " panel") + ">" +
        menuItem("ctxdock", "left", "Dock on the Left", { extra: gx, disabled: w.dock === "left" && !w.g.collapsed }) +
        menuItem("ctxdock", "right", "Dock on the Right", { extra: gx, disabled: w.dock === "right" && !w.g.collapsed }) +
        menuItem("ctxdock", "bottom", "Dock Along the Bottom", { extra: gx, disabled: w.dock === "bottom" && !w.g.collapsed }) + "<hr>" +
        menuItem("pin", w.g.id, w.g.collapsed ? "Dock Again" : "Collapse") +
        menuItem("close", w.g.front, "Close " + esc(panelName(w.g.front))) + "</div>";
    }
    pop.innerHTML = h;
    pop.hidden = false;
    placePop(pop);
  }
  function placePop(pop) {
    var win = one(".sfd-win").getBoundingClientRect(), x, y;
    if (S.ctx) { x = S.ctx.x - win.left; y = S.ctx.y - win.top; }
    else {
      var b = one("[data-act=menu][data-v=\"" + S.menu + "\"]");
      var r = b ? b.getBoundingClientRect() : win;
      x = r.right - win.left - pop.offsetWidth; y = r.bottom - win.top + 4;
    }
    x = Math.max(6, Math.min(x, win.width - pop.offsetWidth - 6));
    y = Math.max(6, Math.min(y, win.height - pop.offsetHeight - 6));
    pop.style.left = x + "px";
    pop.style.top = y + "px";
  }

  /* Everything, with the keyboard's place kept. */
  function keyOf(e) { return [e.getAttribute("data-act") || e.getAttribute("data-input"), e.getAttribute("data-v"), e.getAttribute("data-gid"), e.getAttribute("data-sec"), e.getAttribute("data-note")].join("|"); }
  function draw(focusKey) {
    var a = document.activeElement, wasInside = !!(a && a !== root && root.contains(a));
    var k = focusKey || (wasInside && a.getAttribute && (a.getAttribute("data-act") || a.getAttribute("data-input")) ? keyOf(a) : null);
    root.setAttribute("data-look", S.look);
    root.classList.toggle("is-phone", S.phone);
    drawTitle(); drawBody(); drawStatus(); drawPop();
    one(".sfd-lock").hidden = !S.locked;
    [".sfd-titlebar", ".sfd-body", ".sfd-status"].forEach(function (s) { one(s).inert = S.locked; });
    var placed = false;
    if (k) {
      var again = all("[data-act], [data-input]").filter(function (e) { return keyOf(e) === k; })[0];
      if (again && !again.disabled) { again.focus({ preventScroll: true }); placed = true; }
    }
    /* What had the keyboard was drawn away: the window itself takes it, so the keys still reach the demo. */
    if (!placed && (focusKey || wasInside) && !root.contains(document.activeElement)) { one(".sfd-win").focus({ preventScroll: true }); }
  }

  /* ---------- what a click does ---------- */

  function openThing(kind, id) {
    S.slid = null;
    if (kind === "event") {
      var e = EVENTS.filter(function (x) { return x.id === id; })[0];
      S.section = "calendar"; S.day = e.o;
    } else if (kind === "rem") {
      S.section = "reminders"; S.place.reminders = "day";
    } else if (kind === "note") {
      S.section = "notes"; S.note = id; S.query = ""; S.place.notes = "all"; S.phoneNote = true;
    } else if (kind === "bill") {
      S.section = "budget"; S.place.budget = "home";
    }
  }
  function setLook(k) {
    S.look = k; S.picked = true;
    tourDone("theme");
  }
  function layoutText() { return copyOf(L); }

  function onClick(ev) {
    var b = ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (suppressClick) { suppressClick = false; if (b && b.getAttribute("data-act") === "tab") { return; } }
    if (S.locked && (!b || b.getAttribute("data-act") !== "unlock")) { return; }
    /* A click outside a slid-out panel puts it back and does nothing else. */
    if (S.slid && !ev.target.closest(".sfd-slide") && !ev.target.closest(".sfd-strip") && !ev.target.closest(".sfd-pop")) {
      S.slid = null; draw(); ev.preventDefault(); return;
    }
    if ((S.menu || S.ctx) && !ev.target.closest(".sfd-pop") && !(b && b.getAttribute("data-act") === "menu")) {
      S.menu = null; S.ctx = null; draw();
      if (!b) { return; }
    }
    if (!b || b.disabled) { return; }
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v"), g = b.getAttribute("data-gid");
    var keep = null;
    switch (a) {
      case "sec":
        S.section = v; S.slid = null; S.phoneNote = false;
        if (S.phone && v === "notes") { S.phoneNote = false; }
        break;
      case "place":
        S.place[b.getAttribute("data-sec")] = v;
        if (b.getAttribute("data-sec") === "notes") { S.query = ""; }
        break;
      case "menu":
        S.ctx = null;
        S.menu = S.menu === v ? null : v;
        draw();
        if (S.menu) { var first = one(".sfd-pop button:not([disabled])"); if (first) { first.focus(); } }
        return;
      case "look": setLook(v); S.menu = null; keep = "menu|theme|||"; break;
      case "panel":
        if (where(v)) { closePanel(v); }
        else { showPanel(v); tourDone("show"); say("Shown: " + panelName(v) + ", on the " + where(v).dock + "."); }
        S.menu = null; keep = "menu|panels|||";
        break;
      case "hide": L.hidden = !L.hidden; S.slid = null; S.menu = null; keep = "menu|panels|||"; break;
      case "cycle": S.menu = null; draw(); cyclePanel(+v); return;
      case "save":
        S.saved[v] = layoutText(); S.menu = null;
        say("Saved as Layout " + v + ".");
        break;
      case "forget": delete S.saved[v]; S.menu = null; say("Forgot Layout " + v + "."); break;
      case "layout":
        if (S.saved[v]) {
          var hadNone = !anyPanel() || L.hidden;
          L = copyOf(S.saved[v]); S.slid = null; S.menu = null;
          if (hadNone) { tourDone("layout"); } else { say("Layout " + v + "."); }
        }
        break;
      case "putaway": L = emptyLayout(); S.slid = null; S.menu = null; say("Every panel put away."); break;
      case "lock": S.locked = true; S.menu = null; S.ctx = null; S.slid = null; drag = null; draw(); one(".sfd-lock .sfd-btn").focus(); return;
      case "unlock": S.locked = false; draw("lock||||"); return;
      case "tab":
        var tw = groupAt(g);
        if (tw) { tw.g.front = v; }
        break;
      case "pin":
        var pw = groupAt(v);
        pinGroup(v); S.ctx = null;
        if (pw) { say(pw.g.collapsed ? panelName(pw.g.front) + " pinned to the " + pw.dock + " edge." : panelName(pw.g.front) + " docked again."); }
        break;
      case "close": closePanel(v); S.ctx = null; say(panelName(v) + " closed."); break;
      case "strip":
        var sw = groupAt(g);
        if (sw) {
          if (S.slid === g && sw.g.front === v) { S.slid = null; }
          else { sw.g.front = v; S.slid = g; if (S.tour.pin !== true) { tourDone("pin"); } }
        }
        break;
      case "ctxdock":
        var t = { kind: "end", dock: v }, cw = groupAt(g);
        if (cw && cw.g.collapsed && cw.dock === v) { cw.g.collapsed = false; S.slid = null; say(panelName(cw.g.front) + " docked again."); }
        else if (moveGroup(g, t)) { if (v !== (S.ctx && S.ctx.from)) { tourDone("edge"); } say(panelName(groupAt(g).g.front) + " docked " + (v === "bottom" ? "along the bottom" : "on the " + v) + "."); }
        S.ctx = null;
        break;
      case "rem": S.remDone[v] = !S.remDone[v]; break;
      case "tour": if (S.tour[v]) { delete S.tour[v]; } else { tourDone(v); } break;
      case "pay": S.paid[v] = true; if (v === "b1") { tourDone("bill"); } else { say("Paid, and recorded in the budget."); } break;
      case "day": S.day = +v; break;
      case "oncal": S.onCalendar[v] = !S.onCalendar[v]; break;
      case "note": S.note = v; S.phoneNote = true; break;
      case "notesback": S.phoneNote = false; break;
      case "open": openThing(b.getAttribute("data-kind"), v); break;
      case "box":
        if (b.getAttribute("data-look")) { setLook(b.getAttribute("data-look")); break; }
        var n = NOTES.filter(function (x) { return x.id === b.getAttribute("data-note"); })[0], key = n.id + ":" + v;
        S.boxes[key] = !(key in S.boxes ? S.boxes[key] : /^- \[x\]/.test(n.body[+v]));
        break;
      default: return;
    }
    draw(keep);
  }

  /* Next Panel and Previous Panel: the keyboard moves from the section to each docked panel in front, the left's
     first, then the bottom's, then the right's, and back to the section. */
  function cyclePanel(step) {
    var stops = [".sfd-centre"];
    DOCK_ORDER.forEach(function (d) { L.docks[d].groups.forEach(function (g) { if (!g.collapsed) { stops.push(".sfd-group[data-gid=\"" + g.id + "\"]"); } }); });
    var a = document.activeElement, at = 0;
    stops.forEach(function (s, i) { var e = one(s); if (e && e.contains(a)) { at = i; } });
    var next = one(stops[(at + step + stops.length) % stops.length]);
    if (!next) { return; }
    var target = one(".sfd-gbody button, .sfd-gbody input, .sfd-tab.is-front", next) || one("button, input", next);
    if (target) { target.focus(); }
  }

  /* ---------- dragging a tab or a title, followed in the window ---------- */

  var drag = null, suppressClick = false;
  var ghost = one(".sfd-ghost"), hint = one(".sfd-hint");

  function dropAt(x, y) {
    var under = document.elementFromPoint(x, y);
    if (!under || !root.contains(under)) { return null; }
    var grp = under.closest(".sfd-group");
    if (grp && !grp.classList.contains("is-slid")) {
      var r = grp.getBoundingClientRect(), id = grp.getAttribute("data-gid"), dock = grp.getAttribute("data-dock");
      if (under.closest(".sfd-ghead")) { return { t: { kind: "tabs", gid: id }, r: { l: r.left, t: r.top, w: r.width, h: r.height } }; }
      var after = dock === "bottom" ? x > r.left + r.width / 2 : y > r.top + r.height / 2;
      var half = dock === "bottom" ? { l: after ? r.left + r.width / 2 : r.left, t: r.top, w: r.width / 2, h: r.height } : { l: r.left, t: after ? r.top + r.height / 2 : r.top, w: r.width, h: r.height / 2 };
      return { t: { kind: "beside", gid: id, after: after }, r: half };
    }
    var centre = one(".sfd-centre");
    if (!centre) { return null; }
    var c = centre.getBoundingClientRect();
    if (x < c.left || x > c.right || y < c.top || y > c.bottom) { return null; }
    var bw = Math.min(c.width / 4, 80), bh = Math.min(c.height / 4, 80);
    if (x < c.left + bw) { return { t: { kind: "end", dock: "left" }, r: { l: c.left, t: c.top, w: bw, h: c.height } }; }
    if (x > c.right - bw) { return { t: { kind: "end", dock: "right" }, r: { l: c.right - bw, t: c.top, w: bw, h: c.height } }; }
    if (y > c.bottom - bh) { return { t: { kind: "end", dock: "bottom" }, r: { l: c.left, t: c.bottom - bh, w: c.width, h: bh } }; }
    return null;
  }
  function onPointerDown(ev) {
    if (ev.button !== 0 || S.phone || S.locked) { return; }
    var tab = ev.target.closest(".sfd-tab"), head = ev.target.closest(".sfd-ghead");
    if (!head || ev.target.closest(".sfd-gbtn")) { return; }
    var gidHere = head.getAttribute("data-gid"), w = groupAt(gidHere);
    if (!w) { return; }
    /* A tab moves its panel; a one-panel group's name, or the blank part of a title bar, moves the group. */
    var panel = tab ? tab.getAttribute("data-v") : null;
    var whole = !tab || w.g.panels.length === 1;
    drag = { x: ev.clientX, y: ev.clientY, on: false, panel: panel, gid: gidHere, whole: whole, from: w.dock, drop: null, id: ev.pointerId };
  }
  function onPointerMove(ev) {
    if (!drag || ev.pointerId !== drag.id) { return; }
    if (!drag.on) {
      if (Math.abs(ev.clientX - drag.x) + Math.abs(ev.clientY - drag.y) < 6) { return; }
      drag.on = true;
      root.classList.add("is-dragging");
      var w = groupAt(drag.gid);
      ghost.innerHTML = icon(PANEL[drag.whole ? w.g.front : drag.panel].icon, 13) + "<span>" + esc(drag.whole ? w.g.panels.map(panelName).join(", ") : panelName(drag.panel)) + "</span>";
      ghost.hidden = false;
    }
    ev.preventDefault();
    ghost.style.left = ev.clientX + "px";
    ghost.style.top = ev.clientY + "px";
    var d = dropAt(ev.clientX, ev.clientY);
    var ok = d && wouldChange(function () { return drag.whole ? moveGroup(drag.gid, d.t) : movePanel(drag.panel, d.t); });
    drag.drop = ok ? d : null;
    if (!ok) { hint.hidden = true; return; }
    hint.style.left = d.r.l + "px"; hint.style.top = d.r.t + "px"; hint.style.width = d.r.w + "px"; hint.style.height = d.r.h + "px";
    hint.hidden = false;
  }
  function endDrag(apply) {
    if (!drag) { return; }
    var d = drag;
    drag = null;
    root.classList.remove("is-dragging");
    ghost.hidden = true; hint.hidden = true;
    if (!d.on) { return; }
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 0);
    if (!apply || !d.drop) { return; }
    var name = d.whole ? panelName(groupAt(d.gid).g.front) : panelName(d.panel);
    var to = dockOf(d.drop.t);
    var changed = d.whole ? moveGroup(d.gid, d.drop.t) : movePanel(d.panel, d.drop.t);
    if (!changed) { return; }
    if (d.drop.t.kind === "tabs") { tourDone("stack"); say(name + " stacked as a tab."); }
    else if (to !== d.from) { tourDone("edge"); say(name + " moved " + (to === "bottom" ? "along the bottom." : "to the " + to + ".")); }
    else { say(name + " moved."); }
    draw();
  }

  /* The line between a dock and the centre drags, and its arrow keys move it. */
  var sizing = null;
  function limits(d) { return d === "bottom" ? [120, 480] : [200, 520]; }
  function clampSize(d, v) {
    var lim = limits(d), mid = one(".sfd-mid"), room = 0;
    if (mid) { var r = mid.getBoundingClientRect(); room = d === "bottom" ? r.height - 160 + (L.docks.bottom.size) : r.width - 240 + L.docks[d].size; }
    var max = Math.max(lim[0], Math.min(lim[1], room || lim[1]));
    if (d !== "bottom") { var bodyW = one(".sfd-body").getBoundingClientRect().width; max = Math.min(max, Math.max(lim[0], bodyW - 52 - 260 - (d === "left" ? sideOpen("right") : sideOpen("left")))); }
    return Math.round(Math.max(lim[0], Math.min(max, v)));
  }
  function sideOpen(d) { return L.hidden || !L.docks[d].groups.some(function (g) { return !g.collapsed; }) ? 0 : L.docks[d].size; }
  function onDividerDown(ev) {
    var div = ev.target.closest(".sfd-divider");
    if (!div || ev.button !== 0) { return; }
    ev.preventDefault();
    var d = div.getAttribute("data-dock");
    sizing = { d: d, x: ev.clientX, y: ev.clientY, start: L.docks[d].size, el: div, id: ev.pointerId };
    root.classList.add("is-sizing");
    div.classList.add("is-on");
  }
  function onDividerMove(ev) {
    if (!sizing || ev.pointerId !== sizing.id) { return; }
    var s = sizing, delta = s.d === "left" ? ev.clientX - s.x : s.d === "right" ? s.x - ev.clientX : s.y - ev.clientY;
    L.docks[s.d].size = clampSize(s.d, s.start + delta);
    sizeDock(s.d);
    s.el.setAttribute("aria-valuenow", L.docks[s.d].size);
  }
  function onDividerUp() {
    if (!sizing) { return; }
    sizing.el.classList.remove("is-on");
    root.classList.remove("is-sizing");
    sizing = null;
  }

  /* ---------- the keyboard ---------- */

  var gTimer = null;
  function onKey(ev) {
    var t = ev.target, inField = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
    var k = (ev.key || "").toLowerCase();
    if (ev.key === "Escape") {
      if (drag) { endDrag(false); return; }
      if (S.menu || S.ctx) { var back = S.menu ? "menu|" + S.menu + "|||" : null; S.menu = null; S.ctx = null; draw(back); return; }
      if (S.slid) { S.slid = null; draw(); return; }
      if (S.gPending) { S.gPending = false; drawStatus(); }
      return;
    }
    if (S.locked) { return; }
    var inside = root.contains(t) || (t === document.body && root.matches(":hover"));
    if (!inside) { return; }
    var div = t.closest && t.closest(".sfd-divider");
    if (div && (ev.key === "ArrowLeft" || ev.key === "ArrowRight" || ev.key === "ArrowUp" || ev.key === "ArrowDown")) {
      var d = div.getAttribute("data-dock"), grow = (d === "left" && ev.key === "ArrowRight") || (d === "right" && ev.key === "ArrowLeft") || (d === "bottom" && ev.key === "ArrowUp");
      L.docks[d].size = clampSize(d, L.docks[d].size + (grow ? 20 : -20));
      sizeDock(d); div.setAttribute("aria-valuenow", L.docks[d].size);
      ev.preventDefault();
      return;
    }
    var tab = t.closest && t.closest(".sfd-tab");
    if (tab && (ev.key === "ContextMenu" || (ev.shiftKey && ev.key === "F10"))) {
      var r = tab.getBoundingClientRect();
      S.ctx = { gid: tab.getAttribute("data-gid"), x: r.left, y: r.bottom + 2, from: groupAt(tab.getAttribute("data-gid")).dock };
      S.menu = null; draw();
      var first = one(".sfd-pop button:not([disabled])"); if (first) { first.focus(); }
      ev.preventDefault();
      return;
    }
    if (ev.ctrlKey && ev.metaKey && !S.phone) {
      if (k === "p") { if (anyPanel()) { L.hidden = !L.hidden; S.slid = null; draw(); } ev.preventDefault(); return; }
      if (ev.key === "]" || ev.key === "[") { cyclePanel(ev.key === "]" ? 1 : -1); ev.preventDefault(); return; }
    }
    if (ev.metaKey || ev.ctrlKey || ev.altKey || inField) { return; }
    if (S.gPending) {
      S.gPending = false; clearTimeout(gTimer);
      var target = k === "t" && !S.phone ? "today" : SECTIONS.filter(function (s) { return SECTION[s].key === k; })[0];
      if (target) { ev.preventDefault(); S.section = target; S.slid = null; S.phoneNote = false; draw(); say("Jumped to " + SECTION[target].name + "."); focusView(); }
      drawStatus();
      return;
    }
    if (k === "g" && !S.phone) {
      S.gPending = true; drawStatus();
      clearTimeout(gTimer);
      gTimer = setTimeout(function () { S.gPending = false; drawStatus(); }, 3000);
    }
  }
  function focusView() { var f = one(".sfd-centre button, .sfd-centre input, .sfd-phone-body button"); if (f) { f.focus({ preventScroll: true }); } }

  function onInput(ev) {
    var t = ev.target, kind = t.getAttribute && t.getAttribute("data-input");
    if (!kind) { return; }
    if (kind === "search") {
      S.query = t.value;
      if (/encrypt/i.test(S.query)) { tourDone("search"); }
      one(".sfd-notes-results").innerHTML = notesResults();
      drawStatus();
    } else if (kind === "plan") {
      S.plan[t.getAttribute("data-v")] = num(t.value);
      budgetFigures(); refreshPanels();
    } else if (kind === "afford") {
      S.afford = t.value;
      budgetFigures();
    }
  }
  function onChange(ev) {
    var t = ev.target;
    if (t.getAttribute && t.getAttribute("data-input") === "plan") { t.value = S.plan[t.getAttribute("data-v")].toFixed(2); }
  }
  function onContextMenu(ev) {
    var head = ev.target.closest(".sfd-ghead");
    if (!head || S.phone) { return; }
    ev.preventDefault();
    S.ctx = { gid: head.getAttribute("data-gid"), x: ev.clientX, y: ev.clientY, from: groupAt(head.getAttribute("data-gid")).dock };
    S.menu = null;
    draw();
  }

  /* ---------- the theme: the page's until one is picked here ---------- */

  function pageLook() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t && THEMES.some(function (x) { return x[0] === t; })) { return t; }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "sage" : "linen";
  }
  function followPage() { if (!S.picked) { S.look = pageLook(); draw(); } }

  /* ---------- start ---------- */

  S.look = pageLook();
  mount.innerHTML = "";
  mount.appendChild(root);
  mount.classList.add("is-live");

  function measure() {
    var w = root.getBoundingClientRect().width;
    var phone = w < 720, wide = w >= 980;
    if (phone !== S.phone || wide !== S.wide) {
      S.phone = phone; S.wide = wide;
      S.menu = null; S.ctx = null; S.slid = null;
      if (phone && S.section === "today") { S.section = "reminders"; }
      draw();
    }
  }
  S.phone = root.getBoundingClientRect().width < 720;
  S.wide = root.getBoundingClientRect().width >= 980;
  draw();

  root.addEventListener("click", onClick);
  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointerdown", onDividerDown);
  root.addEventListener("input", onInput);
  root.addEventListener("change", onChange);
  root.addEventListener("contextmenu", onContextMenu);
  window.addEventListener("pointermove", function (ev) { onPointerMove(ev); onDividerMove(ev); }, { passive: false });
  window.addEventListener("pointerup", function () { endDrag(true); onDividerUp(); });
  window.addEventListener("pointercancel", function () { endDrag(false); onDividerUp(); });
  document.addEventListener("keydown", onKey);
  document.addEventListener("click", function (ev) {
    /* The path is the one the click took, so a button the window has since drawn again still counts as inside. */
    var inside = ev.composedPath ? ev.composedPath().indexOf(root) !== -1 : root.contains(ev.target);
    if ((S.menu || S.ctx) && !inside) { S.menu = null; S.ctx = null; drawPop(); drawTitle(); }
  });
  if (window.ResizeObserver) { new ResizeObserver(measure).observe(mount); } else { window.addEventListener("resize", measure); }
  if (window.MutationObserver) { new MutationObserver(followPage).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) { mq.addEventListener("change", followPage); }
  }
})();
