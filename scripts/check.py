#!/usr/bin/env python3
"""Checks the website before every commit. Standard library only; nothing to install.

    python3 -I scripts/check.py              check docs/
    python3 -I scripts/check.py --self-test  prove each rule can fail

It fails if a page could track a reader, load anything from another site, run any
script but the light and dark switch (docs/theme.js, pinned below), or say
something the house rules (../Stonefold/HOUSE-RULES.md §4) don't allow yet.
"""

import hashlib
import re
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "docs"

# Change to True on the day the state confirms the company, and put "Stonefold Labs LLC"
# in each page's footer and in the privacy page's "runs this website" line.
COMPANY_FORMED = False

CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'"

# The site's one script: the light and dark switch (the owner, 2026-11-12). Its exact contents are pinned here,
# so a change to it is always a decision: read the new file, then put its SHA-256 here (shasum -a 256 docs/theme.js).
THEME_JS = "/theme.js"
THEME_JS_SHA256 = "4f9a6be38fe93758bbed3a4ec58e399363a2231d0a1bd6666a909a09f7282654"
SUPPORT = "mailto:support@stonefoldlabs.com"

# Every link that leaves the site is listed here, so a new one is a decision.
OUTSIDE_LINKS = {
    "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
}

# The only files that may be published.
ALLOWED_FILES = {".html", ".css", ".svg", ".txt", ".js"}
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
    (r"\brecover|\breset\b|\brestore", "house rules §4: nothing may suggest we can recover what a person lost"),
    (r"free updates|lifetime|forever", "house rules §4: may not be claimed"),
    # Allowed only after an app's sync ships, or its privacy label is live.
    (r"\bsync|end.to.end|icloud", "house rules §4: sync wording waits until an app's sync ships"),
    (r"data not collected", "house rules §4: waits until a privacy label is live"),
    # No app is released.
    (r"download|available (on|now|in|for)|app store|testflight|\bbuy\b|get it|pre.?order", "no app is released; nothing may read as available"),
    (r"[$€£]\s?\d", "no prices on the site"),
    # Working titles and names not yet decided.
    (r"teasel|croft", "a name that isn't final"),
]


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.problems = []
        self.words = []
        self.links = []
        self.pictures = []
        self.scripts = 0
        self.buttons = 0
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
            if rel not in ("stylesheet", "icon"):
                self.problems.append(f"<link rel={rel!r}>: only the stylesheet and the icon")
            if not href.startswith("/") or href.startswith("//"):
                self.problems.append(f"<link href={href!r}>: must be a file of this site")
            else:
                self.links.append((href, a))
        elif tag == "script":
            # Only the switch, loaded from this site, with nothing written inside the tag.
            self._in_script = True
            self.scripts += 1
            if attrs != [("src", THEME_JS)]:
                self.problems.append(f"<script>: the only script is <script src=\"{THEME_JS}\"></script>")
        elif tag == "button":
            self.buttons += 1
            if a.get("id") != "theme-toggle" or a.get("type") != "button" or not a.get("aria-label"):
                self.problems.append("<button>: the only button is the light and dark switch")
            if "hidden" not in a:
                self.problems.append("the switch must start hidden, so it is never a dead button without the script")
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
    for pattern, why in NOT_YET:
        found = re.search(pattern, flat, re.IGNORECASE)
        if found:
            problems.append(f"says {found.group(0)!r}: {why}")
    if not COMPANY_FORMED and re.search(r"\bL\.?L\.?C\b|\bInc\b|©|copyright", flat, re.IGNORECASE):
        problems.append("names a legal company or a copyright before the company is formed")
    if COMPANY_FORMED and a_page and "Stonefold Labs LLC" not in flat:
        problems.append("the company is formed, but the page doesn't say 'Stonefold Labs LLC'")
    return problems


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
    if page.scripts != 1 or page.buttons != 1:
        problems.append(f"{page.scripts} scripts and {page.buttons} buttons; a page has the switch, once")
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
        elif href in OUTSIDE_LINKS:
            if "noreferrer" not in (attrs.get("rel") or ""):
                problems.append(f"{href}: an outside link needs rel=\"noreferrer\"")
        else:
            problems.append(f"{href}: not a page of this site, and not on the list of outside links")

    for file in page.pictures:
        if not resolves(site, file) or not file.endswith(".svg"):
            problems.append(f"{file}: the picture is missing, or isn't an .svg of this site")

    problems += check_words(" ".join(page.words) + " " + (page.description or ""))
    return problems


def check_css(file):
    css = file.read_text(encoding="utf-8")
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
    if "/" + str(file.relative_to(site)) != THEME_JS:
        return ["the only script is " + THEME_JS]
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


def check_svg(file):
    svg = file.read_text(encoding="utf-8")
    problems = []
    if re.search(r"<script|<foreignObject|<image|<use|href=|\son\w+=|<style|<text|font|url\(", svg, re.IGNORECASE):
        problems.append("the picture may hold only shapes (no scripts, links, styles, or words set in a font)")
    problems += check_words(re.sub(r"<[^>]+>", " ", svg), a_page=False)
    return problems


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
<body><header><nav><a href="/">Home</a></nav><button type="button" id="theme-toggle" aria-label="Dark mode" hidden></button></header>
<main><h1>One</h1>{body}</main><footer>Stonefold Labs</footer></body></html>
"""

BAD = [
    ("a script", "body", "<script>1</script>"),
    ("a second copy of the switch's script", "body", '<script src="/theme.js"></script>'),
    ("the switch's script, deferred to another file", "head", '<script src="/theme.js" integrity="x"></script>'),
    ("another button", "body", '<button type="button">Buy</button>'),
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
    ("sync", "body", "<p>Sync is end-to-end encrypted.</p>"),
    ("the label", "body", "<p>Data Not Collected.</p>"),
    ("download", "body", "<p>Download it today.</p>"),
    ("the store", "body", "<p>Soon on the App Store.</p>"),
    ("a price", "body", "<p>$9.99 once.</p>"),
    ("LLC too early", "body", "<p>Stonefold Labs LLC</p>"),
    ("a working title", "body", "<p>Teasel Notes</p>"),
    ("recovery", "body", "<p>We can recover your passphrase.</p>"),
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

        page.write_text(GOOD_PAGE.format(csp=CSP, head="", body='<img src="/mark.svg" alt="" width="1" height="1">'))
        if check_site(site):
            print("self-test: a page with the mark was refused:", check_site(site))
            return 1

        page.write_text(GOOD_PAGE.format(csp=CSP, head="", body=""))
        if check_site(site):
            print("self-test: the good page was refused:", check_site(site))
            return 1

        for name, where, snippet in BAD:
            parts = {"head": "", "body": ""}
            parts[where] = snippet
            page.write_text(GOOD_PAGE.format(csp=CSP, **parts))
            if not check_site(site):
                missed.append(name)

        page.write_text(GOOD_PAGE.format(csp="default-src *", head="", body=""))
        if not check_site(site):
            missed.append("a loosened content-security rule")
        page.write_text(GOOD_PAGE.format(csp=CSP, head="", body=""))

        for name, css in [("a css import", '@import "x.css";'), ("a css font", "@font-face { }"),
                          ("a css url", "body { background: url(https://example.com/x.png) }")]:
            (site / "styles.css").write_text(css)
            if not check_site(site):
                missed.append(name)
        (site / "styles.css").write_text("body { margin: 0 }\n")

        for name, svg in [("a logo that says LLC", '<svg xmlns="http://www.w3.org/2000/svg"><title>Stonefold Labs LLC</title></svg>'),
                          ("words in a picture", '<svg xmlns="http://www.w3.org/2000/svg"><text font-family="Avenir Next">HI</text></svg>'),
                          ("a script in a picture", '<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>')]:
            (site / "mark.svg").write_text(svg)
            if not check_site(site):
                missed.append(name)
        (site / "mark.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>\n')

        (site / "theme.js").write_bytes(theme + b'\nfetch("/log");\n')
        if not check_site(site):
            missed.append("a changed theme.js")
        (site / "theme.js").write_bytes(theme)

        (site / "tracker.js").write_text("1")
        if not check_site(site):
            missed.append("a .js file")

    if missed:
        print("self-test: these slipped through:", ", ".join(missed))
        return 1
    print(f"self-test: all {len(BAD) + 9} planted faults were caught")
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
