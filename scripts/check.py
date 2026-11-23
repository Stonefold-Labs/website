#!/usr/bin/env python3
"""Checks the website before every commit. Standard library only; nothing to install.

    python3 -I scripts/check.py              check docs/
    python3 -I scripts/check.py --self-test  prove each rule can fail

It fails if a page could track a reader, load anything from another site, run any
script but the theme picker (docs/theme.js, pinned below) and, on the guide's pages only, its search (pinned
below), or say
something the house rules (../Stonefold/HOUSE-RULES.md §4) don't allow yet.
"""

import hashlib
import json
import re
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "docs"

# True since 2026-11-17 (Florida approved the company): every page needs
# "Stonefold Labs LLC" in its footer, and the privacy page says it runs the website.
COMPANY_FORMED = True

CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'"

# The one font file (the owner, 2026-11-21: "Draw our own heading font from the logo"): Stonefold Display, drawn from the
# wordmark's own letters (scripts/build-font.py makes it), served from this site, and the only font file there is. Its
# exact contents are pinned here like theme.js's: rebuild it, look at it, then put its SHA-256 here
# (shasum -a 256 docs/fonts/stonefold-display.woff2). The CSP's font-src 'self' is the one loosening, for this file.
FONT_FILE = "fonts/stonefold-display.woff2"
FONT_SHA256 = "c23c0c02ac7fe548bbf9bb12e2c2f8146e81c8b8bf56e2eb8f4c03e3555bedd8"
FONT_FACE = """@font-face {
  font-family: "Stonefold Display";
  src: url("/fonts/stonefold-display.woff2") format("woff2");
  font-display: swap;
}"""

# The site's one script: the theme picker (the owner, 2026-11-12 for the light and dark switch; 2026-11-18 for
# every theme the app has). Its exact contents are pinned here, so a change to it is always a decision:
# read the new file, then put its SHA-256 here (shasum -a 256 docs/theme.js).
THEME_JS = "/theme.js"
THEME_JS_SHA256 = "cf0bc6f246d72d018a1fe3d4c95dd91577cd631ad16dc1610d13baf3b1bd5050"
# The guide's search (the owner, 2026-11-21: "Yes, build search"): a second script and its data file, on the guide's
# pages only. The script is pinned like theme.js, and may do no more than make a box, read the index and list links; the
# index is checked against the pages it holds, word for word, so it can never say what a page doesn't.
SEARCH_JS = "/guide/search.js"
SEARCH_INDEX_JS = "/guide/search-index.js"
SEARCH_JS_SHA256 = "0511aeac8705c93e50d78b298f78d2af5bf79996b8454b30ddcfdcdbecb4074e"
GUIDE_SCRIPTS = [THEME_JS, SEARCH_INDEX_JS, SEARCH_JS]
# The questions' search (the owner, 2026-11-22: "Yes, build it", to a box that hides the questions that don't hold your
# words): a third script, on the Questions page only, pinned like the others. It may make only its box and one line, change
# only which questions show, and mark the row of the question being read in the list down the left, as the guide's does
# (the owner, 2026-11-22: "add the highlight tracker"); it reaches no network and keeps nothing.
QUESTIONS_JS = "/questions/search.js"
QUESTIONS_JS_SHA256 = "4a26c22dfa1d891ceef92106a65e0491adecd7e5f2db84dfbcf3a1bbd7be6904"
QUESTIONS_SCRIPTS = [THEME_JS, QUESTIONS_JS]
# Home's flip-through of pictures of the app (the owner, 2026-11-22: "Tilting, like iTunes"): a fourth script, on Home only,
# pinned like the others. It may make only its two arrow buttons and turn and dim the pictures as they scroll; it reaches
# no network and keeps nothing. Its motion is the pictures following the reader's own scrolling, and it lies flat with
# "reduce motion" on.
FLIP_JS = "/flip.js"
FLIP_JS_SHA256 = "627f420b27745e02a58ef2f00eb92e760b6148a71bd1f0f641fa649188dcf921"
HOME_SCRIPTS = [THEME_JS, FLIP_JS]
ALLOWED_SCRIPTS = set(GUIDE_SCRIPTS) | set(QUESTIONS_SCRIPTS) | set(HOME_SCRIPTS)
# The app's eight themes (LookThemes.swift, 2026-11-18) and Editor (the owner, 2026-11-21, asked for it in place of the terminal themes), in the order the picker lists them. The picker is one button
# that opens a menu with one button for each; no other button is allowed.
# (The launch branch of 2026-11-21 has no demo: the owner asked for the "Try the window" section to go, so the
# second script, docs/demo.js, is gone from the branch and the theme picker is the site's one script again.)
LOOKS = ["sage", "linen", "night", "ember", "paper", "dusk", "clay", "editor", "plain"]
SUPPORT = "mailto:support@stonefoldlabs.com"

# Every link that leaves the site is listed here, so a new one is a decision.
OUTSIDE_LINKS = {
    "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
}

# The only files that may be published. A .jpg is a picture of the app (the owner, 2026-11-13),
# and lives only under /pictures/. There are none until the app's own pictures are made.
# .png and .ico are the company's mark as pictures (the owner, 2026-11-18: "add the PNG and icon set"): the tab icon,
# the home-screen icon and the mark at a few sizes, from the app's docs/brand, with nothing but the picture in them.
ALLOWED_FILES = {".html", ".css", ".svg", ".txt", ".js", ".jpg", ".png", ".ico", ".woff2"}
SCREENSHOTS = "/pictures/"
ALLOWED_NAMES = {"CNAME", ".nojekyll"}

FORBIDDEN_TAGS = {
    "iframe", "frame", "object", "embed", "form", "input", "textarea",
    "select", "video", "audio", "track", "canvas", "base", "style", "noscript",
}

# House rules §4. Each entry: (pattern, why). Matched against the words a reader sees
# and the page's title and description, without regard to case.
NOT_YET = [
    # May never be claimed.
    (r"never leaves?", "house rules §4: 'never leaves your device' is false once sync is on"),
    (r"apple can.?t see", "house rules §4: may not be claimed"),
    (r"bank.level|military.grade|unhackable|100 ?% secure|audited|anonymous", "house rules §4: may not be claimed"),
    # "Recovery sheet" is the app's own name for the page a person prints (SPEC §4); nothing else may start "recover".
    (r"\brecover(?!y sheet)|\breset\b|\brestore", "house rules §4: nothing may suggest we can recover what a person lost"),
    (r"\bonly you\b", "house rules §4: by default anyone who can unlock the device can open the app"),
    (r"secure enclave|secure hardware", "SPEC §4: no claim about the device's hardware until builds are signed"),
    (r"free updates|lifetime|forever", "house rules §4: may not be claimed"),
    # Sharing is allowed only after it ships, and the privacy label's words only once it is live.
    # (Launch branch, 2026-11-21: the sync wording is allowed here, because sync ships with the app, with the claims
    # SPEC §6 lets it make: end-to-end encrypted, only your devices hold the key, through your own iCloud, no servers of ours.
    # The owner lifted SPEC §6's "after sync ships" limit for his review of the site, 2026-11-21: "Please make the launch day
    # website live so that it can be reviewed." The site is not to be announced until sync ships.)
    (r"\bsharing\b", "house rules §4: sharing wording waits until it ships"),
    (r"data not collected", "house rules §4: waits until a privacy label is live"),
    # The app is not released.
    (r"download|available (on|now|in|for)|app store|testflight|\bbuy\b|\bget it\b|pre.?order|coming soon", "the app is not released; nothing may read as available"),
    # The one price is the owner's, 2026-11-18: $24.99, paid once, for iPhone and Mac together.
    (r"\$(?!24\.99(?!\d))\s?\d|[€£]\s?\d", "no price on the site but the owner's one: $24.99"),
    # Apple's page of which iPhones run iOS 26 has not been read in full (SPEC §7).
    (r"iphone (\d|se\b|air\b|pro\b)|macbook|\bimac\b|mac (mini|pro|studio)", "no iPhone or Mac is named by model"),
    # The five apps' names went with the five apps (the owner, 2026-11-13). The app is Stonefold. The plain word
    # "bellwether", the sheep the rest of the flock follows, may be written in lower case (the owner, 2026-11-22: "use
    # bellwether", for the story in About); "Bellwether" as a name, and Bellwether Budget, may not.
    (r"(?-i:Bellwether)|bellwether budget|teasel|croft", "a retired name: the app is Stonefold"),
]

# The game inside the app is named on the site only by the owner's own line (house rules §11).
FLOCK_LINE = "There is a small flock in here somewhere."


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.problems = []
        self.words = []
        self.links = []
        self.pictures = []
        self.scripts = 0
        self.script_srcs = []
        self.refresh = None
        self.canonical = None
        self.buttons = 0
        self.looks = []
        self.menu_hidden = None
        self._in_script = False
        self.ids = set()
        self.headings = []
        self.h1 = 0
        self.lang = None
        self.title = ""
        self.description = None
        self.csp = None
        self.viewport = False
        self.referrer = None
        self.landmarks = set()
        self._in_title = False
        self._in_head = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in FORBIDDEN_TAGS:
            self.problems.append(f"<{tag}> is not allowed")
        for name, value in attrs:
            if name.startswith("on"):
                self.problems.append(f"<{tag} {name}=…>: no event handlers")
            if name == "style":
                self.problems.append(f"<{tag} style=…>: no inline styles")
            if name in ("poster", "data", "action", "background", "ping"):
                self.problems.append(f"<{tag} {name}=…>: nothing is loaded or posted")
            if name in ("src", "srcset") and (tag, name) not in (("img", "src"), ("source", "srcset"), ("script", "src")):
                self.problems.append(f"<{tag} {name}=…>: nothing is loaded or posted")
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "head":
            self._in_head = True
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            name = (a.get("name") or "").lower()
            equiv = (a.get("http-equiv") or "").lower()
            if equiv == "content-security-policy":
                self.csp = a.get("content")
            elif equiv == "refresh":
                self.refresh = a.get("content") or ""
            elif equiv:
                self.problems.append(f"<meta http-equiv={equiv}> is not allowed")
            if name == "description":
                self.description = a.get("content") or ""
            if name == "viewport":
                self.viewport = True
            if name == "referrer":
                self.referrer = a.get("content")
        elif tag == "link":
            rel = (a.get("rel") or "").lower()
            href = a.get("href") or ""
            if rel == "canonical":
                self.canonical = href
            elif rel not in ("stylesheet", "icon", "apple-touch-icon"):
                self.problems.append(f"<link rel={rel!r}>: only the stylesheet and the icons")
            if not href.startswith("/") or href.startswith("//"):
                self.problems.append(f"<link href={href!r}>: must be a file of this site")
            else:
                self.links.append((href, a))
        elif tag == "script":
            # Only the switch, loaded from this site, with nothing written inside the tag.
            self._in_script = True
            self.scripts += 1
            self.script_srcs.append(a.get("src"))
            if attrs != [("src", a.get("src"))] or a.get("src") not in ALLOWED_SCRIPTS:
                self.problems.append(f"<script>: the only scripts are <script src=\"{THEME_JS}\"></script> and, on the guide's pages, its search")
        elif tag == "div" and a.get("id") == "theme-menu":
            self.menu_hidden = "hidden" in a
        elif tag == "button":
            self.buttons += 1
            if a.get("id") == "theme-toggle":
                if a.get("type") != "button" or not a.get("aria-label") or a.get("aria-controls") != "theme-menu":
                    self.problems.append("<button id=theme-toggle> needs type=button, an aria-label and aria-controls=theme-menu")
                if "hidden" not in a:
                    self.problems.append("the picker must start hidden, so it is never a dead button without the script")
            elif a.get("data-look") in LOOKS and a.get("type") == "button":
                self.looks.append(a["data-look"])
            else:
                self.problems.append("<button>: the only buttons are the theme picker and one for each of the app's themes")
        elif tag in ("img", "source"):
            # The company's mark, from this site only. One file per picture: no lists, no sizes.
            file = a.get("src" if tag == "img" else "srcset") or ""
            if not file.startswith("/") or file.startswith("//") or " " in file or "," in file:
                self.problems.append(f"<{tag}> {file!r}: a picture must be one file of this site")
            else:
                self.pictures.append(file)
            if tag == "img" and "alt" not in a:
                self.problems.append("<img> without alt")
            if tag == "img" and not (a.get("width") and a.get("height")):
                self.problems.append("<img> without width and height (the page would jump as it loads)")
            if tag == "source" and not a.get("media"):
                self.problems.append("<source> without media")
        elif tag == "a":
            if "href" not in a:
                self.problems.append("<a> without href")
            else:
                self.links.append((a["href"], a))
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.headings.append(int(tag[1]))
            if tag == "h1":
                self.h1 += 1
        if tag in ("header", "main", "footer", "nav"):
            self.landmarks.add(tag)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            self._in_script = False
        elif tag == "head":
            self._in_head = False

    def handle_data(self, data):
        if self._in_script:
            if data.strip():
                self.problems.append("a script written into the page")
            return
        if self._in_title:
            self.title += data
        if not self._in_head or self._in_title:
            self.words.append(data)

    def handle_comment(self, data):
        self.problems.append("an HTML comment (published pages carry none)")


def resolves(site, href):
    path = href.split("#", 1)[0].split("?", 1)[0]
    target = site / path.lstrip("/")
    if path.endswith("/"):
        target = target / "index.html"
    return target.is_file()


def check_words(text, a_page=True):
    problems = []
    flat = " ".join(text.replace("’", "'").split())
    if re.search(r"small flock", flat.replace(FLOCK_LINE, ""), re.IGNORECASE):
        problems.append(f"names the game: it is mentioned only by the line {FLOCK_LINE!r}")
    for pattern, why in NOT_YET:
        found = re.search(pattern, flat, re.IGNORECASE)
        if found:
            problems.append(f"says {found.group(0)!r}: {why}")
    if not COMPANY_FORMED and re.search(r"\bL\.?L\.?C\b|\bInc\b|©|copyright", flat, re.IGNORECASE):
        problems.append("names a legal company or a copyright before the company is formed")
    if COMPANY_FORMED and a_page and "Stonefold Labs LLC" not in flat:
        problems.append("the company is formed, but the page doesn't say 'Stonefold Labs LLC'")
    return problems


_IDS = {}


def ids_of(site, path):
    """The ids on a page of this site (by its address), for a link to a place in it."""
    target = site / path.lstrip("/")
    target = target / "index.html" if path.endswith("/") else target
    key = str(target)
    if key not in _IDS:
        found = set()
        if target.is_file():
            page = Page()
            page.feed(target.read_text(encoding="utf-8"))
            found = page.ids
        _IDS[key] = found
    return _IDS[key]


def check_page(site, file):
    page = Page()
    raw = file.read_text(encoding="utf-8")
    page.feed(raw)
    page.close()
    problems = list(page.problems)

    if not raw.lower().startswith("<!doctype html>"):
        problems.append("doesn't start with <!doctype html>")
    if page.lang != "en":
        problems.append("<html lang=\"en\"> is missing")
    if page.csp != CSP:
        problems.append("the content-security rule is missing or changed")
    if page.referrer != "no-referrer":
        problems.append("<meta name=referrer content=no-referrer> is missing")
    if not page.viewport:
        problems.append("the viewport line is missing (the page won't fit a phone)")
    if not page.title.strip():
        problems.append("no <title>")
    if not page.description:
        problems.append("no description")
    parts = file.relative_to(site).parts
    # The guide is one long page, guide/index.html, which has the search; an old address of a topic, guide/<section>/<topic>/, is a tiny
    # page that sends to the topic's place on it, with a meta refresh of 0 and a canonical link, and no search.
    stub = parts[:1] == ("guide",) and len(parts) == 4
    in_guide = parts[:1] == ("guide",) and not stub
    in_questions = parts == ("questions", "index.html")
    # The theme picker is on Home only (the owner, 2026-11-22: "lets only have the theme selector on the home page"). Every
    # page still loads theme.js, so the theme picked there is worn everywhere.
    on_home = parts == ("index.html",)
    expected = GUIDE_SCRIPTS if in_guide else QUESTIONS_SCRIPTS if in_questions else [THEME_JS]
    if page.script_srcs != expected and not (on_home and page.script_srcs == HOME_SCRIPTS):
        problems.append(f"scripts {page.script_srcs}; a page loads the theme script, and the guide's pages and the Questions page their search as well")
    if on_home and (page.buttons != 1 + len(LOOKS) or page.looks != LOOKS):
        problems.append(f"{page.buttons} buttons; Home has the theme picker, once, with one button for each of {', '.join(LOOKS)}")
    if not on_home and (page.buttons or page.looks):
        problems.append("only Home has the theme picker")
    if in_guide != ("guide-search" in page.ids):
        problems.append("the guide's page, and only it, holds the search box's place (id guide-search)")
    if in_questions != ("questions-search" in page.ids):
        problems.append("the Questions page, and only it, holds its search box's place (id questions-search)")
    if stub:
        target = f"/guide/#{parts[1]}-{parts[2]}"
        if page.refresh != f"0; url={target}":
            problems.append(f"an old guide address sends to {target} with <meta http-equiv=refresh content=\"0; url={target}\">")
        if page.canonical != "/guide/":
            problems.append("an old guide address has <link rel=canonical href=\"/guide/\">")
        if f"{parts[1]}-{parts[2]}" not in ids_of(site, "/guide/"):
            problems.append(f"{target}: the guide has no such topic")
    elif page.refresh is not None or page.canonical is not None:
        problems.append("only an old guide address may carry a meta refresh or a canonical link")
    if on_home and page.menu_hidden is not True:
        problems.append("Home's theme menu must exist and start hidden")
    if not on_home and page.menu_hidden is not None:
        problems.append("only Home has the theme menu")
    if page.h1 != 1:
        problems.append(f"{page.h1} <h1> headings; a page has exactly one")
    for before, after in zip(page.headings, page.headings[1:]):
        if after > before + 1:
            problems.append(f"a heading jumps from h{before} to h{after}")
    for landmark in ("header", "nav", "main", "footer"):
        if landmark not in page.landmarks:
            problems.append(f"no <{landmark}>")

    for href, attrs in page.links:
        if href.startswith("mailto:"):
            if href != SUPPORT:
                problems.append(f"{href}: the only address is {SUPPORT[7:]}")
        elif href.startswith("#"):
            if href[1:] not in page.ids:
                problems.append(f"{href}: no such place on the page")
        elif href.startswith("/") and not href.startswith("//"):
            if not resolves(site, href):
                problems.append(f"{href}: the link goes nowhere")
            elif "#" in href and href.split("#", 1)[1] and href.split("#", 1)[1] not in ids_of(site, href.split("#", 1)[0]):
                problems.append(f"{href}: no such place on that page")
        elif href in OUTSIDE_LINKS:
            if "noreferrer" not in (attrs.get("rel") or ""):
                problems.append(f"{href}: an outside link needs rel=\"noreferrer\"")
        else:
            problems.append(f"{href}: not a page of this site, and not on the list of outside links")

    for file in page.pictures:
        screenshot = file.endswith(".jpg") and file.startswith(SCREENSHOTS)
        if not resolves(site, file) or not (file.endswith(".svg") or screenshot):
            problems.append(f"{file}: the picture is missing, or isn't an .svg of this site or a screenshot under {SCREENSHOTS}")

    problems += check_words(" ".join(page.words) + " " + (page.description or ""))
    return problems


def check_css(file):
    css = file.read_text(encoding="utf-8").replace(FONT_FACE, "", 1)
    problems = []
    for pattern, why in [
        (r"@import", "no imports"),
        (r"@font-face", "no web fonts"),
        (r"url\(", "nothing is loaded from a stylesheet"),
        (r"https?:|//[a-z]", "no addresses in the stylesheet"),
        (r"expression\(|behavior:", "no scripted styles"),
        (r"animation|transition", "no motion"),
    ]:
        if re.search(pattern, re.sub(r"/\*.*?\*/", "", css, flags=re.S), re.IGNORECASE):
            problems.append(why)
    return problems


def check_js(site, file):
    name = "/" + str(file.relative_to(site))
    if name == SEARCH_JS:
        return check_search_js(file)
    if name == SEARCH_INDEX_JS:
        return check_search_index(site, file)
    if name == QUESTIONS_JS:
        return check_questions_js(file)
    if name == FLIP_JS:
        return check_flip_js(file)
    if name != THEME_JS:
        return ["the only scripts are the theme picker, the guide's search and its index, the questions' search and Home's flip-through"]
    js = file.read_bytes()
    problems = []
    if hashlib.sha256(js).hexdigest() != THEME_JS_SHA256:
        problems.append("it changed. Read it, and if it is right, put its new SHA-256 in scripts/check.py")
    for pattern, why in [
        (rb"fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\.src\b|\.href\b|location|navigator|import|https?:", "it may not reach the network"),
        (rb"cookie|indexedDB|sessionStorage|caches", "it may keep nothing but the one word in localStorage"),
        (rb"eval|Function\(|innerHTML|createElement|document\.write|setTimeout|setInterval", "it may not make or run code"),
    ]:
        if re.search(pattern, js):
            problems.append(why)
    if set(re.findall(rb"localStorage\.\w+Item\(\s*\"([^\"]*)\"", js)) - {b"theme"}:
        problems.append("it may remember only \"theme\"")
    return problems


def check_flip_js(file):
    js = file.read_bytes()
    problems = []
    if hashlib.sha256(js).hexdigest() != FLIP_JS_SHA256:
        problems.append("it changed. Read it, and if it is right, put its new SHA-256 in scripts/check.py")
    for pattern, why in [
        (rb"fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\.src\b|\.href\b|location|navigator|import|https?:", "it may not reach the network"),
        (rb"cookie|localStorage|sessionStorage|indexedDB|caches", "it may keep nothing"),
        (rb"eval|Function\(|innerHTML|outerHTML|insertAdjacentHTML|document\.write|setTimeout|setInterval", "it may not make or run code"),
    ]:
        if re.search(pattern, js):
            problems.append(why)
    made = re.findall(rb"createElement\(([^)]*)\)", js)
    if any(m != b'"button"' for m in made):
        problems.append("it may make only its arrow buttons")
    if set(re.findall(rb"setAttribute\(\s*\"([^\"]*)\"", js)) - {b"aria-label"}:
        problems.append("it may set only its arrows' labels")
    return problems


def check_questions_js(file):
    js = file.read_bytes()
    problems = []
    if hashlib.sha256(js).hexdigest() != QUESTIONS_JS_SHA256:
        problems.append("it changed. Read it, and if it is right, put its new SHA-256 in scripts/check.py")
    for pattern, why in [
        (rb"fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\.src\b|\.href\b|location|navigator|import|https?:", "it may not reach the network"),
        (rb"cookie|localStorage|sessionStorage|indexedDB|caches", "it may keep nothing"),
        (rb"eval|Function\(|innerHTML|outerHTML|insertAdjacentHTML|document\.write|setTimeout|setInterval", "it may not make or run code"),
    ]:
        if re.search(pattern, js):
            problems.append(why)
    made = re.findall(rb"createElement\(([^)]*)\)", js)
    if any(m.strip(b'"') not in {b"input", b"p", b"mark"} or not m.startswith(b'"') for m in made):
        problems.append("it may make only its box, one line and the underlines of the words found")
    if set(re.findall(rb"setAttribute\(\s*\"([^\"]*)\"", js)) - {b"aria-label", b"autocomplete", b"spellcheck", b"role", b"aria-current"}:
        problems.append("it may set only the box's own labels, the line's role and the mark on the list's current row")
    return problems


def check_search_js(file):
    js = file.read_bytes()
    problems = []
    if hashlib.sha256(js).hexdigest() != SEARCH_JS_SHA256:
        problems.append("it changed. Read it, and if it is right, put its new SHA-256 in scripts/check.py")
    for pattern, why in [
        (rb"fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\.src\b|\.href\b|location|navigator|import|https?:", "it may not reach the network"),
        (rb"cookie|localStorage|sessionStorage|indexedDB|caches", "it may keep nothing"),
        (rb"eval|Function\(|innerHTML|outerHTML|insertAdjacentHTML|document\.write|setTimeout|setInterval", "it may not make or run code"),
    ]:
        if re.search(pattern, js):
            problems.append(why)
    made = re.findall(rb"createElement\(([^)]*)\)", js)
    if any(m.strip(b'"') not in {b"input", b"p", b"ul", b"li", b"a", b"span", b"mark"} or not m.startswith(b'"') for m in made):
        problems.append("it may make only a box, a line, a list and its links")
    if set(re.findall(rb"setAttribute\(\s*\"([^\"]*)\"", js)) - {b"href", b"aria-label", b"autocomplete", b"spellcheck", b"role", b"aria-current"}:
        problems.append("it may set only an address on a link, the box's own labels and the mark on the list's current row")
    return problems


# The guide's search index, read with the same rules the builder uses: for each topic of the guide's one page, in its order, its place
# (/guide/#section-topic), title (the topic's h3), section (the h2 of class sec before it) and the words under it (not a nav, a picture or a
# script). The builder is in the chat's scratchpad, not here, so this is its second reading: they must agree.
_VOID = {"br", "hr", "img", "input", "link", "meta", "source", "area", "base", "col", "embed", "param", "track", "wbr"}
_SKIP = {"nav", "svg", "script"}


class _Topics(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.skipping = [], 0
        self.group, self.in_group = "", False
        self.topics, self.cur, self.in_title = [], None, False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = (a.get("class") or "").split()
        if tag in _VOID:
            return
        root = tag in _SKIP
        self.stack.append((tag, root, tag == "section" and "topic" in cls))
        if root:
            self.skipping += 1
        if tag == "h2" and "sec" in cls:
            self.group, self.in_group = "", True
        if tag == "section" and "topic" in cls:
            self.cur = {"id": a.get("id", ""), "g": "", "t": "", "x": []}
            self.topics.append(self.cur)
        if tag == "h3" and self.cur is not None and not self.cur["t"] and not self.in_title:
            self.in_title = True

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag in _VOID:
            return
        while self.stack:
            t, root, is_topic = self.stack.pop()
            if root:
                self.skipping -= 1
            if is_topic:
                self.cur = None
            if t == "h2":
                self.in_group = False
            if t == "h3":
                self.in_title = False
            if t == tag:
                break

    def handle_data(self, data):
        if self.in_group and not self.skipping:
            self.group += data
        if self.cur is not None and not self.skipping:
            if not self.cur["g"]:
                self.cur["g"] = _words(self.group)
            if self.in_title:
                self.cur["t"] += data
            else:
                self.cur["x"].append(data)


def _plain(source):
    """The page as the words say it: the logo's <span class="wm"> around the name is only how it is set."""
    return source.replace('<span class="wm">Stonefold</span>', "Stonefold")


def _words(text):
    return re.sub(r"\s+", " ", text).strip()


def guide_index_text(site):
    page = _Topics()
    page.feed(_plain((site / "guide" / "index.html").read_text(encoding="utf-8")))
    entries = [{"p": f"/guide/#{x['id']}", "t": _words(x["t"]), "g": x["g"], "x": _words(" ".join(x["x"]))} for x in page.topics]
    return "window.STONEFOLD_GUIDE=" + json.dumps(entries, ensure_ascii=False, separators=(",", ":")) + ";\n"


def check_search_index(site, file):
    if not (site / "guide" / "index.html").is_file():
        return ["there is no guide to index"]
    if file.read_text(encoding="utf-8") != guide_index_text(site):
        return ["it is not what the guide's page says: rebuild it"]
    return []


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
# The picture and its colour tag. Exif, text and dates (eXIf, tEXt, zTXt, iTXt, tIME) can hold the device, the
# software, dates and places, so anything not listed here is refused.
PNG_CHUNKS = {b"IHDR", b"PLTE", b"IDAT", b"IEND", b"sRGB", b"gAMA", b"cHRM", b"tRNS"}


def png_problems(data):
    if data[:8] != PNG_SIGNATURE:
        return ["not a PNG"]
    i = 8
    seen_end = False
    while i + 12 <= len(data):
        length = int.from_bytes(data[i:i + 4], "big")
        kind = data[i + 4:i + 8]
        if kind not in PNG_CHUNKS:
            return [f"it carries a {kind.decode('latin-1')} chunk: strip it with scripts/strip-png.py"]
        i += 12 + length
        if kind == b"IEND":
            seen_end = True
            break
    if not seen_end or i != len(data):
        return ["a damaged PNG, or something after its end"]
    return []


def check_png(file):
    return png_problems(file.read_bytes())


def check_ico(file):
    """An .ico of PNGs: its directory in order, every picture a clean PNG, nothing left over."""
    data = file.read_bytes()
    if data[:4] != b"\x00\x00\x01\x00":
        return ["not an .ico"]
    count = int.from_bytes(data[4:6], "little")
    end = 6 + 16 * count
    for n in range(count):
        entry = data[6 + 16 * n:22 + 16 * n]
        size = int.from_bytes(entry[8:12], "little")
        offset = int.from_bytes(entry[12:16], "little")
        if offset != end or offset + size > len(data):
            return ["a damaged .ico"]
        problems = png_problems(data[offset:offset + size])
        if problems:
            return problems
        end = offset + size
    if end != len(data):
        return ["something after the pictures in the .ico"]
    return []


def check_svg(file):
    svg = file.read_text(encoding="utf-8")
    problems = []
    if re.search(r"<script|<foreignObject|<image|<use|href=|\son\w+=|<style|<text|font|url\(", svg, re.IGNORECASE):
        problems.append("the picture may hold only shapes (no scripts, links, styles, or words set in a font)")
    problems += check_words(re.sub(r"<[^>]+>", " ", svg), a_page=False)
    return problems


def check_font(site, file):
    """The one font: at its own path, a WOFF2, no bigger than a few kilobytes, exactly the pinned bytes."""
    if str(file.relative_to(site)) != FONT_FILE:
        return [f"the only font file is {FONT_FILE}"]
    data = file.read_bytes()
    problems = []
    if data[:4] != b"wOF2":
        problems.append("not a WOFF2")
    if len(data) > 30000:
        problems.append("a font this big is not the heading font")
    if hashlib.sha256(data).hexdigest() != FONT_SHA256:
        problems.append("it changed. Look at it, and if it is right, put its new SHA-256 in scripts/check.py")
    return problems


def check_jpg(site, file):
    """A picture of the app: under /pictures/, and carrying nothing but the picture and its colour profile.
    Exif and XMP (APP1) can hold the device, the software, dates and places; comments can hold anything."""
    if not ("/" + str(file.relative_to(site))).startswith(SCREENSHOTS):
        return [f"a .jpg is published only under {SCREENSHOTS}"]
    data = file.read_bytes()
    if data[:2] != b"\xff\xd8":
        return ["not a JPEG"]
    i = 2
    while i + 4 <= len(data):
        if data[i] != 0xFF:
            return ["a damaged JPEG"]
        marker = data[i + 1]
        if marker == 0xDA:
            return []
        if marker in (0xE1, 0xFE):
            return ["it carries Exif, XMP or a comment: strip it before publishing"]
        i += 2 + int.from_bytes(data[i + 2:i + 4], "big")
    return ["a damaged JPEG"]


def check_site(site):
    failures = {}
    files = sorted(p for p in site.rglob("*") if p.is_file())
    if not any(p.suffix == ".html" for p in files):
        failures[str(site)] = ["no pages found"]
    for file in files:
        name = str(file.relative_to(site))
        if file.name in ALLOWED_NAMES:
            problems = []
        elif file.suffix not in ALLOWED_FILES:
            problems = ["this kind of file is not published"]
        elif file.suffix == ".html":
            problems = check_page(site, file)
        elif file.suffix == ".css":
            problems = check_css(file)
        elif file.suffix == ".svg":
            problems = check_svg(file)
        elif file.suffix == ".js":
            problems = check_js(site, file)
        elif file.suffix == ".jpg":
            problems = check_jpg(site, file)
        elif file.suffix == ".png":
            problems = check_png(file)
        elif file.suffix == ".ico":
            problems = check_ico(file)
        elif file.suffix == ".woff2":
            problems = check_font(site, file)
        else:
            problems = []
        if problems:
            failures[name] = problems
    return failures


GOOD_PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{csp}">
<meta name="referrer" content="no-referrer">
<title>T</title><meta name="description" content="D">
<link rel="stylesheet" href="/styles.css"><script src="/theme.js"></script>{head}</head>
<body><header><nav><a href="/">Home</a></nav><button type="button" id="theme-toggle" aria-label="Choose a theme" aria-controls="theme-menu" hidden></button><div id="theme-menu" hidden>{looks}</div></header>
<main><h1>One</h1>{body}</main><footer>© 2026 Stonefold Labs LLC</footer></body></html>
"""

SEARCH_TAGS = '<script src="/guide/search-index.js"></script><script src="/guide/search.js"></script>'
# A guide page for the self-test: the same page, with the guide's tree and article, and its search after the content.
GUIDE_PAGE = (GOOD_PAGE.replace("<main><h1>One</h1>{body}</main>", "<main>{body}</main>").replace("</body>", "{scripts}</body>")
              .replace('<button type="button" id="theme-toggle" aria-label="Choose a theme" aria-controls="theme-menu" hidden></button><div id="theme-menu" hidden>{looks}</div>', ""))
GUIDE_HOME = ('<div class="wrap guide"><nav class="tree tree-d" aria-label="Guide"><a href="/guide/#a-b">B</a></nav>'
              '<article class="article"><div class="gsearch" id="guide-search" hidden></div><h1>Guide</h1>'
              '<h2 class="sec" id="a">A</h2>'
              '<section class="topic" id="a-b"><h3>B</h3><p>Some words here.</p></section></article></div>')
GUIDE_STUB = '<h1>B</h1><p>This page moved. It is now <a href="/guide/#a-b">A: B</a>.</p>'
STUB_HEAD = '<meta http-equiv="refresh" content="0; url=/guide/#a-b"><link rel="canonical" href="/guide/">'

LOOK_BUTTONS = "".join(f'<button type="button" data-look="{name}"></button>' for name in LOOKS)

BAD = [
    ("a script", "body", "<script>1</script>"),
    ("a second copy of the switch's script", "body", '<script src="/theme.js"></script>'),
    ("the switch's script, deferred to another file", "head", '<script src="/theme.js" integrity="x"></script>'),
    ("another button", "body", '<button type="button">Buy</button>'),
    ("a ninth theme", "body", '<button type="button" data-look="neon"></button>'),
    ("a look button that submits", "body", '<button data-look="sage"></button>'),
    ("a script from elsewhere", "head", '<script src="https://example.com/a.js"></script>'),
    ("an event handler", "body", '<p onclick="x()">hi</p>'),
    ("an inline style", "body", '<p style="color:red">hi</p>'),
    ("a picture from elsewhere", "body", '<img src="https://example.com/p.gif" alt="" width="1" height="1">'),
    ("a picture that isn't there", "body", '<img src="/nope.svg" alt="" width="1" height="1">'),
    ("a picture with no alt", "body", '<img src="/mark.svg" width="1" height="1">'),
    ("a picture list", "body", '<img src="/mark.svg" srcset="/mark.svg 1x, https://example.com/p.gif 2x" alt="" width="1" height="1">'),
    ("a source from elsewhere", "body", '<picture><source srcset="https://example.com/p.svg" media="(min-width: 1px)"></picture>'),
    ("a web font", "head", '<link rel="stylesheet" href="https://fonts.example.com/f.css">'),
    ("a preconnect", "head", '<link rel="preconnect" href="/x">'),
    ("a manifest", "head", '<link rel="manifest" href="/mark.svg">'),
    ("an icon from elsewhere", "head", '<link rel="apple-touch-icon" href="https://example.com/i.png">'),
    ("an icon that isn't there", "head", '<link rel="apple-touch-icon" href="/nope.png">'),
    ("a form", "body", "<form></form>"),
    ("an iframe", "body", "<iframe></iframe>"),
    ("a refresh", "head", '<meta http-equiv="refresh" content="0;url=https://example.com">'),
    ("a dead link", "body", '<a href="/nowhere/">x</a>'),
    ("an unlisted outside link", "body", '<a href="https://example.com/">x</a>'),
    ("another address", "body", '<a href="mailto:someone@example.com">x</a>'),
    ("a skipped heading", "body", "<h3>x</h3>"),
    ("a second h1", "body", "<h1>x</h1>"),
    ("a comment", "body", "<!-- note -->"),
    ("never leaves", "body", "<p>Your data never leaves your device.</p>"),
    ("military-grade", "body", "<p>Military-grade encryption.</p>"),
    ("the label", "body", "<p>Data Not Collected.</p>"),
    ("download", "body", "<p>Download it today.</p>"),
    ("the store", "body", "<p>Soon on the App Store.</p>"),
    ("a price", "body", "<p>$9.99 once.</p>"),
    ("a price that only starts like the owner's", "body", "<p>$24.995 once.</p>"),
    ("the owner's price in euros", "body", "<p>€24.99 once.</p>"),
    ("a working title", "body", "<p>Teasel Notes</p>"),
    ("recovery", "body", "<p>We can recover your passphrase.</p>"),
    ("recovering, beside the sheet", "body", "<p>Print the recovery sheet. We can do the recovery for you.</p>"),
    ("only you", "body", "<p>Only you can open it.</p>"),
    ("hardware", "body", "<p>The Secure Enclave guards the key.</p>"),
    ("sharing", "body", "<p>Sharing is by invitation.</p>"),
    ("a model", "body", "<p>It runs on iPhone 11 and later.</p>"),
    ("a retired name", "body", "<p>Bellwether Budget</p>"),
    ("the game by name", "body", "<p>Small Flock is a herding game.</p>"),
    ("the game's line, reworded", "body", "<p>There is a small flock of sheep in here.</p>"),
]


def self_test():
    missed = []
    with tempfile.TemporaryDirectory() as folder:
        site = Path(folder)
        (site / "styles.css").write_text("body { margin: 0 }\n")
        (site / "mark.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>\n')
        theme = (SITE / "theme.js").read_bytes()
        (site / "theme.js").write_bytes(theme)
        page = site / "index.html"

        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body='<img src="/mark.svg" alt="" width="1" height="1">'))
        if check_site(site):
            print("self-test: a page with the mark was refused:", check_site(site))
            return 1

        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=""))
        if check_site(site):
            print("self-test: the good page was refused:", check_site(site))
            return 1

        allowed = f"<p>The recovery sheet is a page you print. It costs $24.99, paid once.</p><p>Sync is end-to-end encrypted, through your own iCloud.</p><p>{FLOCK_LINE}</p>"
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=allowed))
        if check_site(site):
            print("self-test: the recovery sheet, the owner's price or the game's line was refused:", check_site(site))
            return 1

        for name, where, snippet in BAD:
            parts = {"head": "", "body": ""}
            parts[where] = snippet
            page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, **parts))
            if not check_site(site):
                missed.append(name)

        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body="").replace("Stonefold Labs LLC", "Stonefold Labs"))
        if not check_site(site):
            missed.append("a page that leaves out the company's full name")
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp="default-src *", head="", body=""))
        if not check_site(site):
            missed.append("a loosened content-security rule")
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=""))

        for name, css in [("a css import", '@import "x.css";'), ("a css font", "@font-face { }"),
                          ("a css url", "body { background: url(https://example.com/x.png) }")]:
            (site / "styles.css").write_text(css)
            if not check_site(site):
                missed.append(name)
        (site / "styles.css").write_text("body { margin: 0 }\n")

        for name, svg in [("words in a picture", '<svg xmlns="http://www.w3.org/2000/svg"><text font-family="Avenir Next">HI</text></svg>'),
                          ("a script in a picture", '<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>')]:
            (site / "mark.svg").write_text(svg)
            if not check_site(site):
                missed.append(name)
        (site / "mark.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>\n')

        (site / "theme.js").write_bytes(theme + b'\nfetch("/log");\n')
        if not check_site(site):
            missed.append("a changed theme.js")
        (site / "theme.js").write_bytes(theme)

        # A clean picture under /pictures/ passes; with Exif, or anywhere else, it doesn't.
        clean_jpg = b"\xff\xd8\xff\xe0\x00\x04JF\xff\xda\x00\x02\xff\xd9"
        exif_jpg = b"\xff\xd8\xff\xe1\x00\x08Exif\x00\x00\xff\xda\x00\x02\xff\xd9"
        (site / "pictures").mkdir()
        (site / "pictures" / "1.jpg").write_bytes(clean_jpg)
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body='<img src="/pictures/1.jpg" alt="" width="1" height="1">'))
        if check_site(site):
            print("self-test: a clean screenshot was refused:", check_site(site))
            return 1
        for name, where, data, body in [
            ("a picture with Exif", "pictures/1.jpg", exif_jpg, '<img src="/pictures/1.jpg" alt="" width="1" height="1">'),
            ("a .jpg outside /pictures/", "1.jpg", clean_jpg, '<img src="/1.jpg" alt="" width="1" height="1">'),
        ]:
            (site / where).write_bytes(data)
            page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=body))
            if not check_site(site):
                missed.append(name)
            (site / where).unlink()
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=""))

        # A clean PNG and .ico pass; a PNG with Exif or text, or an .ico holding one, does not.
        def chunk(kind, body=b""):
            return len(body).to_bytes(4, "big") + kind + body + b"\x00\x00\x00\x00"
        clean_png = PNG_SIGNATURE + chunk(b"IHDR", b"\x00" * 13) + chunk(b"sRGB", b"\x00") + chunk(b"IDAT", b"x") + chunk(b"IEND")
        exif_png = PNG_SIGNATURE + chunk(b"IHDR", b"\x00" * 13) + chunk(b"eXIf", b"MM") + chunk(b"IDAT", b"x") + chunk(b"IEND")
        text_png = PNG_SIGNATURE + chunk(b"IHDR", b"\x00" * 13) + chunk(b"tEXt", b"a\x00b") + chunk(b"IDAT", b"x") + chunk(b"IEND")

        def ico_of(png):
            return b"\x00\x00\x01\x00\x01\x00" + b"\x10\x10\x00\x00\x01\x00\x20\x00" + len(png).to_bytes(4, "little") + (22).to_bytes(4, "little") + png

        for name, where, data in [("a clean PNG", "icon.png", clean_png), ("a clean .ico", "favicon.ico", ico_of(clean_png))]:
            (site / where).write_bytes(data)
            if check_site(site):
                print(f"self-test: {name} was refused:", check_site(site))
                return 1
            (site / where).unlink()
        for name, where, data in [("a PNG with Exif", "icon.png", exif_png), ("a PNG with text", "icon.png", text_png),
                                  ("a PNG with a tail", "icon.png", clean_png + b"x"), ("an .ico holding a PNG with Exif", "favicon.ico", ico_of(exif_png)),
                                  ("an .ico with a tail", "favicon.ico", ico_of(clean_png) + b"x"), ("a fake PNG", "icon.png", b"not a picture")]:
            (site / where).write_bytes(data)
            if not check_site(site):
                missed.append(name)
            (site / where).unlink()

        (site / "tracker.js").write_text("1")
        if not check_site(site):
            missed.append("a .js file")
        (site / "tracker.js").unlink()

        font = (SITE / FONT_FILE).read_bytes()
        (site / "fonts").mkdir()
        (site / "fonts" / "stonefold-display.woff2").write_bytes(font)
        (site / "styles.css").write_text(FONT_FACE + "\nbody { margin: 0 }\n")
        if check_site(site):
            print("self-test: the heading font and its one @font-face were refused:", check_site(site))
            return 1
        for name, where, data in [("a changed font file", "fonts/stonefold-display.woff2", font + b"x"),
                                  ("a font file in another place", "fonts/other.woff2", font),
                                  ("a font that is not a WOFF2", "fonts/stonefold-display.woff2", b"not a font")]:
            (site / where).write_bytes(data)
            if not check_site(site):
                missed.append(name)
            (site / where).unlink() if where != "fonts/stonefold-display.woff2" else (site / where).write_bytes(font)
        (site / "styles.css").write_text(FONT_FACE + "\n@font-face { font-family: x; src: url(\"/fonts/other.woff2\") }\n")
        if not check_site(site):
            missed.append("a second @font-face")
        (site / "styles.css").write_text("body { margin: 0 }\n")

        # The guide's search: its script, its index and its two tags pass on the guide's pages, and fail changed or anywhere else.
        search = (SITE / "guide" / "search.js").read_bytes()
        (site / "guide" / "a" / "b").mkdir(parents=True)

        def guide(scripts=SEARCH_TAGS, home=GUIDE_HOME, stub=GUIDE_STUB, stub_head=STUB_HEAD, home_head=""):
            for where, body, head, tags in (("guide/index.html", home, home_head, scripts), ("guide/a/b/index.html", stub, stub_head, "")):
                (site / where).write_text(GUIDE_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head=head, body=body, scripts=tags))
            (site / "guide" / "search.js").write_bytes(search)
            (site / "guide" / "search-index.js").write_text(guide_index_text(site), encoding="utf-8")

        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=""))
        guide()
        if check_site(site):
            print("self-test: a guide with its search and an old address was refused:", check_site(site))
            return 1
        guide(scripts="")
        if not check_site(site):
            missed.append("the guide without its search")
        guide()
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head=SEARCH_TAGS, body=""))
        if not check_site(site):
            missed.append("the search on a page outside the guide")
        page.write_text(GOOD_PAGE.format(looks=LOOK_BUTTONS, csp=CSP, head="", body=""))
        (site / "guide" / "search.js").write_bytes(search + b'\nfetch("/log");\n')
        if not check_site(site):
            missed.append("a changed search.js")
        (site / "guide" / "search.js").write_bytes(search)
        (site / "guide" / "search-index.js").write_text(guide_index_text(site).replace("Some words here.", "Some other words."), encoding="utf-8")
        if not check_site(site):
            missed.append("a search index that says what the page doesn't")
        guide(home=GUIDE_HOME.replace('id="guide-search" ', ""))
        if not check_site(site):
            missed.append("the guide without the search box's place")
        guide(stub_head=STUB_HEAD.replace("#a-b", "#a-c"))
        if not check_site(site):
            missed.append("an old guide address that sends to the wrong place")
        guide(stub_head=STUB_HEAD.replace('<link rel="canonical" href="/guide/">', ""))
        if not check_site(site):
            missed.append("an old guide address without its canonical link")
        guide(home_head=STUB_HEAD)
        if not check_site(site):
            missed.append("a meta refresh on the guide's own page")
        guide(home=GUIDE_HOME.replace("Some words here.", 'Some words <a href="/guide/#nope">here</a>.'))
        if not check_site(site):
            missed.append("a link to a place that is not on the page")

    if missed:
        print("self-test: these slipped through:", ", ".join(missed))
        return 1
    print(f"self-test: all {len(BAD) + 29} planted faults were caught")
    return 0


def main():
    if "--self-test" in sys.argv:
        return self_test()
    failures = check_site(SITE)
    if failures:
        for name, problems in failures.items():
            for problem in problems:
                print(f"{name}: {problem}")
        print(f"\nNot clean: {sum(len(p) for p in failures.values())} problem(s).")
        return 1
    pages = len(list(SITE.rglob("*.html")))
    print(f"clean: {pages} pages checked")
    return 0


if __name__ == "__main__":
    sys.exit(main())
