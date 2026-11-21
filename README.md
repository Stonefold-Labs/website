# Stonefold Labs — the website

> **The launch version (written 2026-11-21) is live for the owner's review, at his word that day.** It describes the app on launch day, sync included, so it is not to be announced or linked until the app ships. The old site is tagged `pre-launch-site-2026-11-21`. See `LAUNCH-BRANCH.md`.

The public site for stonefoldapp.com (before 2026-11-18, stonefoldlabs.com, which now redirects here): a home page that presents Stonefold, the company's one app, a privacy page and a support page. Hand-written HTML and one stylesheet. No build step, no cookies, no analytics, nothing loaded from anyone else. One small script of our own, the theme picker.

It exists for three reasons, in order: Apple requires an organization to have a public website and an e-mail address on its own domain before it can enroll in the Developer Program; the app's App Store listing needs a privacy policy URL and a support URL; and people should be able to see what Stonefold Labs makes.

## Where things are

```
docs/              the published pages (GitHub Pages only publishes a folder with this name)
  index.html         Home: Stonefold, the app
  how-it-works/      How it works: offline, encrypted on the device, sync only if turned on, export, no account (launch branch)
  guide/             the guide: its first page, its pages down a tree, and its search (launch branch). There is no features/ since 2026-11-21.
  pictures/          pictures of the app, once they are made (none yet; see "Pictures of the app")
  privacy/index.html https://stonefoldapp.com/privacy/
  support/index.html https://stonefoldapp.com/support/
  404.html           shown for any address that doesn't exist
  styles.css
  theme.js           the theme picker (the demo, demo.js, is gone from the launch branch)
  fonts/             stonefold-display.woff2: the heading font, and the name as the logo (`scripts/build-font.py`)
  guide/search.js    the guide's search, on the guide's pages only, with guide/search-index.js, the words it reads
  favicon.svg        the company's mark on a warm ivory tile, for the browser tab
  brand/             the mark, for light and for dark: the owner's, moved to the middle of its square on 2026-11-17
  robots.txt
  CNAME              tells GitHub Pages the site's address
  .nojekyll          tells GitHub Pages to publish the files as they are
scripts/
  check.py           run before every commit
  check-live.sh      run after every push, once the site is live
  strip-jpeg.py      copies a picture without its Exif, XMP or comments
  build-font.py      draws docs/fonts/stonefold-display.woff2 (needs fonttools and brotli; run it with a virtual environment's python)
PUBLISHING.md      the owner's steps for putting it on the internet, as exact clicks
CLAUDE.md          the rules for any chat that edits the site
```

## Looking at it on this Mac

```bash
python3 -m http.server 4731 --bind 127.0.0.1 --directory docs
```

Then open http://localhost:4731 in a browser. Stop it with Control-C. Opening the files by double-clicking won't work: the pages link to each other by address.

## Before every commit

```bash
python3 -I scripts/check.py
```

It must say `clean`. It fails on any script but `theme.js` and, on the guide's pages, `guide/search.js` and its index (each pinned or checked in the check), anything loaded from another site, a dead link, a retired app name, or a claim the house rules (`../Stonefold/HOUSE-RULES.md` §4) don't allow yet. `python3 -I scripts/check.py --self-test` proves each rule can fail.

## Where it stands (2026-11-15)

Live at https://stonefoldlabs.com since 2026-11-13, and, since 2026-11-18, at https://stonefoldapp.com, the main address (the owner's choice; `PUBLISHING.md` Part 9 is the move). stonefoldlabs.com redirects to it, keeping the path, and stays the mail domain. Served by GitHub Pages from the public repo `Stonefold-Labs/website` (branch `main`, folder `/docs`), with Cloudflare on "DNS only". Commits are authored "Stonefold Labs". `PUBLISHING.md` says which parts are done; the mailbox test and the day the company exists are still to do. Any change: edit, `python3 -I scripts/check.py`, commit, push (on the owner's yes), then `scripts/check-live.sh`.

The company is not formed yet, so no page says "LLC" and none carries a copyright line. `PUBLISHING.md` Part 8 is the change for the day it is.

**One app (2026-11-15).** What went live on 2026-11-13 listed five apps. That day the owner decided to make one app, Stonefold, from the five, and on 2026-11-15 he asked for the site to match and to be "a really cool way to show what the app is capable of while highlighting the encryption, privacy, and security focus of it." The pages were reworked that day:

- **Home** presents Stonefold: its four sections with what each can do, how they work together, a band on encryption, privacy and security, what can leave with you, and where the app stands. Privacy, Support and the "not here" page were brought in line.
- **The five apps' names are gone** from every page, and `scripts/check.py` now refuses them. The game inside the app is mentioned only by the owner's line, "There is a small flock in here somewhere.", and the check refuses any other mention. (Launch version, 2026-11-21: the owner had the line taken off Home, so no page mentions the game.)
- **Every sentence about privacy, encryption or security** was held to house rules §4 and the app's `SPEC.md` §4, §6 and §21.2 as they stood on 2026-11-15. The words were drafted by Sonnet from a list of allowed facts and then checked one by one. Nothing is said about sync or sharing, which are not built, and nothing about Export Everything or the one Help, which were still being built.
- **No second script.** The design is HTML and CSS: nothing moves.
- **What was dropped.** A design paused on 2026-11-13 gave each of the five apps a page of its own with screenshots, and a rail of the five apps' signs. It is overtaken, and is kept only on the local branch `paused/five-app-pages-2026-11-13`, which is not for pushing: its screenshots show the five apps under their old names. Carried over from it: the corner mark and the rail (now for the app's sections), the signs on a stone wall beside the headline, the rules for pictures with `scripts/strip-jpeg.py`, and the check's rules for `.jpg` files.

## Pictures of the app

The app's own tests write pictures of its screens, but on 2026-11-15 none was fit for a public page: the Mac's are drawn without a window around them, show a black bar where the selected row is, carry a warning that the test Mac has no password, use data named "Made-up…", and Welcome shows a stand-in icon. So each section on Home has a drawing where its picture will go: shapes only, no words, in a `<figure class="slot">`. The page says the pictures are drawings for now.

**Update 2026-11-18:** the owner asked for real screenshots throughout. The pictures from 2026-11-15/16 (kept in `~/Library/Developer/Xcode/DerivedData/Stonefold-pictures.noindex/website`) predate the app's themes and the Mac's are not real windows, so none is used. A fresh brief for an app chat, with Linen and Sage of each and a `<picture>` plan for light and dark, is in the dispatch notes folder (`website-screenshots-brief.md`).

**On hold (the owner, 2026-11-18):** "Hold off on pushing screenshots until app is closer to 100% finished." A trial set of real pictures from the screenshots chat is built and kept on the local branch `screenshots-held` (commit 9ca2503: the eight JPEGs in `docs/pictures/`, Home swapped from drawings to pictures, a Linen and a Sage of each shown to match the theme). It is **not on `main` and not live**; the drawings stay on the site. Do not merge or push that branch until he says. When he does, the pictures are retaken first (the retake keeps the same file names; the brief is `docs-notes/website-screenshots-brief.md`), then merge `screenshots-held`, swap the files, look at every one, run `scripts/check.py`, and ask for his yes to the push. The branch's README has the longer note on how the pictures are shown.

**The pictures wanted,** to be made by the app's build chat at the end of milestone A8, from a made-up household that reads like a real one (no "Made-up" in any name), light appearance, normal text size, a real window on the Mac, no test warnings, and no stand-in icon in view:

| Goes in | Picture | Device |
|---|---|---|
| `#picture-calendar` | The month with a day chosen, showing an event, a reminder and a bill on that day (Reminders on the Calendar and Bills on the Calendar both on) | Mac |
| `#picture-reminders` | Today, with a bill waiting above the day's reminders | iPhone |
| `#picture-notes` | The list with search above it and a note open, with a checklist in it | Mac |
| `#picture-budget` | The budget's Home: the headline, the three answers and "Can I afford it?" | iPhone |
| The band on encryption | Settings ▸ What Leaves This Device, top of the page, once builds are signed and the owner has approved its words | iPhone |
| The band on encryption | The recovery sheet as the app shows it, with made-up codes | Mac |

The same six in dark appearance would let the page show a dark picture to a reader in dark mode; that is a nice extra, not needed. Each goes through `scripts/strip-jpeg.py` into `docs/pictures/`, and replaces the `<svg class="drawing">` in its figure (`CLAUDE.md`, "Pictures of the app"). When the last drawing is replaced, the line on Home that says the pictures are drawings goes too.

## The demo (allowed 2026-11-18, removed on the launch branch 2026-11-21)

On 2026-11-18 the owner allowed a working copy of the Mac window on Home, "Try the window", built by `docs/demo.js` (a second pinned script, with its styles and a Privacy paragraph). On 2026-11-21 he asked for that section to go ("Lets also get rid of the "try the window" section"). On the launch branch the section, `demo.js`, its styles (the `.sfd` rules), its pin and rules in `scripts/check.py`, and the Privacy paragraph are removed; `git log` holds them if he ever wants them back. **Capitals (2026-11-21):** the owner's "Lowercase, rounded" look of 2026-11-18 is half undone at his word ("Lets go back to regular grammar and formatting for capitalization"). Headings and the kicker are set as written, with regular capitals, and the rounded display face stays. The drawn wordmark in the header and footer is still lowercase, because it is a drawing of the name, not text.

## The theme picker

The owner asked for a light and dark switch on 2026-11-12, and chose a switch that remembers over keeping the pages free of any script. On 2026-11-18 he asked for the site to offer every theme the app has: "Make stonefold website have a toggle to be able to switch to any theme that is also in the app." `docs/theme.js` is that script, about a hundred lines, served from this site.

- **The nine themes** are the app's eight (`../StonefoldApp/Packages/ShellRules/Sources/ShellRules/LookThemes.swift`, read only): Sage, Linen, Night, Ember, Paper, Dusk, Clay and Plain, and Editor (2026-11-21, the owner's: dark slate with blue, orange, green and purple, as a code editor draws them; the app's own values, from its Editor theme, plus the site's hairline and band colours). Each theme's background, pane and accent are the app's own, turned into the site's roles in `docs/styles.css` (page, raised, text, link, fill, and a band for the encryption section). Sage and Linen are the site's old dark and light, so a first-time reader sees what they saw before. Body text and contrast were measured for every theme: 4.5 to 1 at least for words, 3 to 1 for the drawings' two accent colours.
- **The faces** are system font stacks only, matching the app's faces: System is the system sans, Rounded is `ui-rounded`, Serif is `ui-serif` (New York on Apple devices), Monospace is `ui-monospace` (SF Mono). Ember is set in monospace, Paper and Clay in serif, Dusk in rounded, Night and Plain in the system sans; Sage and Linen keep the site's own Iowan Old Style headings, as the app does for them (`booksHeadings`). Nothing is loaded from anyone else. **Headings (launch version, 2026-11-21)** are set in Stonefold Display, a font drawn from the wordmark's own letters: one 4 KB file in `docs/fonts/`, built by `scripts/build-font.py` from centerline skeletons (straight runs with rounded corners, stroked at the wordmark's weight with round ends), pinned in `scripts/check.py`. It covers the letters, figures and the usual punctuation; anything else falls back to the device's face.
- **Until someone picks a theme**, a page follows the device: Sage when it is dark, Linen when it is light. The script sets the page's theme as it loads, so there is no flash, and it follows the device if the device changes.
- **Picking one** saves one word, such as "sage" or "linen", in that browser's storage for this site, under the name `theme`. It is not a cookie and is never sent anywhere; the Privacy page says so. A reader who had saved "light" or "dark" with the old switch gets Linen or Sage.
- **Plain** is the app's "system's own colours": neutral colours that follow the device's light or dark setting, in the system sans.
- Without the script (blocked, or not loaded) the picker stays hidden and the page follows the device as Sage or Linen, from CSS alone.
- Every page's content-security rule allows scripts from this site only. `scripts/check.py` allows exactly one `<script src="/theme.js">`, one picker button and one button for each of the nine themes (no other), and pins the script's SHA-256, so any change to it has to be read and re-pinned on purpose.
- A new theme in the app is added by hand: its colours in `styles.css`, its button in each page, its name in `LOOKS` in `scripts/check.py` and in `theme.js`.

## The brand

The owner supplied the brand assets on 2026-11-12 (`stonefold-labs-brand-assets.zip`, made 2026-11-11): a mark, a full logo, and a palette of evergreen `#293B36`, sage `#A9B8A1`, warm ivory `#F2F0E8` and amber `#D5A96C`.

- **The mark** is in the header of every page, beside the name. Since 2026-11-18 the name there and in the footer is "Stonefold", the app's name, on the owner's word ("change Stonefold Labs at the top of the website to just Stonefold"); the company's full name stays in the footer's "© 2026 Stonefold Labs LLC", the About section and the privacy page; the page titles say "Stonefold" too ("Privacy · Stonefold"). Since 2026-11-18 it is the new one: eight evenly spaced stones in a square fold with an opening at the bottom, and no star (the owner: "company mark too", after picking it for the app's icon). The two files in `docs/brand/` are copies of the app's `docs/brand/stonefold-labs-mark-light.svg` (evergreen) and `…-dark.svg` (sage), commit 7285e11 of the logo chat, unchanged and 256 across; the pages draw the same eight stones inline, so that the stones take **the theme's own accent, as the app's icon for each theme does** (`../StonefoldApp/Packages/ShellRules/Sources/ShellRules/AppIcons.swift`: the stones are the theme's accent): Sage `#a9b8a1`, Linen `#1f5143`, Night `#3381fa`, Ember `#cc7722`, Paper `#1f6f78`, Dusk `#c4a7f0`, Clay `#9e4426`, and for Plain (no accent in the app, so the site's own blue, as its buttons and links) `#0066cc` on a light device and `#2997ff` on a dark one. It is the `--mark` colour in `docs/styles.css`. Against each theme's header colour it measures at least 4.6 to 1 (Night and Plain in dark are the lowest; a picture's parts need 3). An `<img>` can't take a colour from the page, which is why it is inline. The earlier mark (stones, a ring and a star, moved to the middle on 2026-11-17) is in the git history.
- **The name is drawn, not typed** (2026-11-18). The owner found the serif name beside the mark "too plain" and picked draft A of three ("A · Gate"): lowercase "stonefold" drawn from the mark's own parts, one stroke weight with round ends like the stones, square bowls with rounded corners, and the fold's gate at the bottom of both o's. It is one inline `<svg class="wordmark">` in each `.brand` link (header and footer), `role="img"` with `aria-label="Stonefold"`, stroked in `currentColor`, so it takes each theme's text colour while the stones keep the accent. It no longer changes font with the theme. No font is involved, so no licence question. The drawing and the script that makes it are in `../StonefoldApp/docs/drafts/wordmark/` (stroke 23 on an x-height of 100); the app's logo chat adds it to the brand files. **The two o's are the mark's own stones (2026-11-21, the owner: "make the two o's in the stonefold match the stones logo with the dashes").** Each is the mark's eight stones, the same rectangles as the corner mark, at 0.57 so the mark is about as tall as the other round letters; they are drawn in the text colour with the rest of the name, not the accent. The draft's squared o with a gate at the bottom is in the git history, and the drawing in `../StonefoldApp/docs/drafts/wordmark/` still has it.
- **The tab icon** (`docs/favicon.svg`) is the evergreen mark on a warm ivory tile, so it shows on a dark tab bar too. The tile is the only thing added. The app's own `favicon.svg` turns sage in dark mode with a `<style>`; the site's rules allow no styles in a picture, so the tile does that job. The PNG and icon set (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` in `docs/`, and the bare mark at 16, 32, 180, 512 and 1024 pixels in `docs/brand/`) was added on 2026-11-18 at the owner's word ("add the PNG and icon set"). The app's `docs/brand/make-brand.swift` makes them; each goes through `scripts/strip-png.py`, which drops the Exif chunk the Mac's image library adds, and `scripts/check.py` now accepts `.png` and `.ico` only with nothing in them but the picture and its colour tag. Every page's head links `favicon.ico`, `favicon.svg` and `apple-touch-icon.png`. The tab icons (`favicon.ico` and the 16 and 32 PNGs) are the evergreen mark on the ivory tile, as is `favicon.svg`, so they read on a dark tab bar as well as a light one (the owner asked for this on 2026-11-18; the logo chat's bare-mark tab icons were hard to see on dark). They are drawn by a small script that is not in the repo (the stones are the app's numbers, the tile and the mark at 80% of it as in `favicon.svg`), so the PNGs carry only the picture and need no stripping. `icon-192.png` and `icon-512.png` are for a web app manifest, which the site doesn't have, so nothing uses them yet.
- **The colours** in `docs/styles.css` start from the palette (Sage and Linen are it; the other six themes are the app's). Text contrast was measured: at least 5.3 to 1 everywhere, 10 to 1 or more for body text. In the evergreen band on Home the text is ivory or a pale sage, measured at 6.3 to 1 or more. Amber appears as the thin stripe along the top of every page, in Sage and Linen.
- **A sibling of longlinelabs.com** (the owner, 2026-11-12: the two sites should look like companies made by the same person, without looking identical). Shared with Longline: the stripe along the top, the mark in its own corner at the top left with a rail below it that opens to show names (the owner, 2026-11-13, asking for the site to work like longlinelabs.com), a wordmark beside the mark (Stonefold's drawn from its own mark since 2026-11-18, where Longline's is serif), a short line above a large serif headline, a filled button, cards, hairlines between sections, a one-row footer. Stonefold's own: its mark, its greens and ivory, the four sections' signs standing on a stone wall in place of Longline's line of hooks, a rail that leads to the one app's sections where Longline's leads to its apps, an evergreen band for encryption, privacy and security, and no downloaded fonts. The rail opens with CSS alone, so it needs no second script. Longline's headings are set in Fraunces from Google; here they use a serif already on the reader's device (Iowan Old Style on Apple devices, which is also Longline's own fallback).
- **The full logo is not used yet, and is not in this repo.** It reads "STONEFOLD LABS LLC", and the company isn't formed. It also sets its words in a font (Avenir Next) that only Apple devices have, so on other devices the words would shift. Before it goes on the site its words need turning into outlines; until then the mark and typed name do the job.
