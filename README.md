# Stonefold Labs — the website

The public site for stonefoldlabs.com: a home page that presents Stonefold, the company's one app, a privacy page and a support page. Hand-written HTML and one stylesheet. No build step, no cookies, no analytics, nothing loaded from anyone else. One small script of our own, the theme picker.

It exists for three reasons, in order: Apple requires an organization to have a public website and an e-mail address on its own domain before it can enroll in the Developer Program; the app's App Store listing needs a privacy policy URL and a support URL; and people should be able to see what Stonefold Labs makes.

## Where things are

```
docs/              the published pages (GitHub Pages only publishes a folder with this name)
  index.html         Home: Stonefold, the app
  pictures/          pictures of the app, once they are made (none yet; see "Pictures of the app")
  privacy/index.html https://stonefoldlabs.com/privacy/
  support/index.html https://stonefoldlabs.com/support/
  404.html           shown for any address that doesn't exist
  styles.css
  theme.js           the theme picker: the site's only script
  favicon.svg        the company's mark on a warm ivory tile, for the browser tab
  brand/             the mark, for light and for dark: the owner's, moved to the middle of its square on 2026-11-17
  robots.txt
  CNAME              tells GitHub Pages the site's address
  .nojekyll          tells GitHub Pages to publish the files as they are
scripts/
  check.py           run before every commit
  check-live.sh      run after every push, once the site is live
  strip-jpeg.py      copies a picture without its Exif, XMP or comments
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

It must say `clean`. It fails on any script but `theme.js` (whose exact contents are pinned in the check), anything loaded from another site, a dead link, a retired app name, or a claim the house rules (`../Stonefold/HOUSE-RULES.md` §4) don't allow yet. `python3 -I scripts/check.py --self-test` proves each rule can fail.

## Where it stands (2026-11-15)

Live at https://stonefoldlabs.com since 2026-11-13, served by GitHub Pages from the public repo `Stonefold-Labs/website` (branch `main`, folder `/docs`), with Cloudflare on "DNS only". Commits are authored "Stonefold Labs". `PUBLISHING.md` says which parts are done; the mailbox test and the day the company exists are still to do. Any change: edit, `python3 -I scripts/check.py`, commit, push (on the owner's yes), then `scripts/check-live.sh`.

The company is not formed yet, so no page says "LLC" and none carries a copyright line. `PUBLISHING.md` Part 8 is the change for the day it is.

**One app (2026-11-15).** What went live on 2026-11-13 listed five apps. That day the owner decided to make one app, Stonefold, from the five, and on 2026-11-15 he asked for the site to match and to be "a really cool way to show what the app is capable of while highlighting the encryption, privacy, and security focus of it." The pages were reworked that day:

- **Home** presents Stonefold: its four sections with what each can do, how they work together, a band on encryption, privacy and security, what can leave with you, and where the app stands. Privacy, Support and the "not here" page were brought in line.
- **The five apps' names are gone** from every page, and `scripts/check.py` now refuses them. The game inside the app is mentioned only by the owner's line, "There is a small flock in here somewhere.", and the check refuses any other mention.
- **Every sentence about privacy, encryption or security** was held to house rules §4 and the app's `SPEC.md` §4, §6 and §21.2 as they stood on 2026-11-15. The words were drafted by Sonnet from a list of allowed facts and then checked one by one. Nothing is said about sync or sharing, which are not built, and nothing about Export Everything or the one Help, which were still being built.
- **No second script.** The design is HTML and CSS: nothing moves.
- **What was dropped.** A design paused on 2026-11-13 gave each of the five apps a page of its own with screenshots, and a rail of the five apps' signs. It is overtaken, and is kept only on the local branch `paused/five-app-pages-2026-11-13`, which is not for pushing: its screenshots show the five apps under their old names. Carried over from it: the corner mark and the rail (now for the app's sections), the signs on a stone wall beside the headline, the rules for pictures with `scripts/strip-jpeg.py`, and the check's rules for `.jpg` files.

## Pictures of the app

The app's own tests write pictures of its screens, but on 2026-11-15 none was fit for a public page: the Mac's are drawn without a window around them, show a black bar where the selected row is, carry a warning that the test Mac has no password, use data named "Made-up…", and Welcome shows a stand-in icon. So each section on Home has a drawing where its picture will go: shapes only, no words, in a `<figure class="slot">`. The page says the pictures are drawings for now.

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

## The theme picker

The owner asked for a light and dark switch on 2026-11-12, and chose a switch that remembers over keeping the pages free of any script. On 2026-11-18 he asked for the site to offer every theme the app has: "Make stonefold website have a toggle to be able to switch to any theme that is also in the app." `docs/theme.js` is that script, about a hundred lines, served from this site.

- **The eight themes** are the app's (`../StonefoldApp/Packages/ShellRules/Sources/ShellRules/LookThemes.swift`, read only): Sage, Linen, Night, Ember, Paper, Dusk, Clay and Plain. Each theme's background, pane and accent are the app's own, turned into the site's roles in `docs/styles.css` (page, raised, text, link, fill, and a band for the encryption section). Sage and Linen are the site's old dark and light, so a first-time reader sees what they saw before. Body text and contrast were measured for every theme: 4.5 to 1 at least for words, 3 to 1 for the drawings' two accent colours.
- **The faces** are system font stacks only, matching the app's faces: System is the system sans, Rounded is `ui-rounded`, Serif is `ui-serif` (New York on Apple devices), Monospace is `ui-monospace` (SF Mono). Ember is set in monospace, Paper and Clay in serif, Dusk in rounded, Night and Plain in the system sans; Sage and Linen keep the site's own Iowan Old Style headings, as the app does for them (`booksHeadings`). Nothing is loaded from anyone else.
- **Until someone picks a theme**, a page follows the device: Sage when it is dark, Linen when it is light. The script sets the page's theme as it loads, so there is no flash, and it follows the device if the device changes.
- **Picking one** saves one word, such as "sage" or "linen", in that browser's storage for this site, under the name `theme`. It is not a cookie and is never sent anywhere; the Privacy page says so. A reader who had saved "light" or "dark" with the old switch gets Linen or Sage.
- **Plain** is the app's "system's own colours": neutral colours that follow the device's light or dark setting, in the system sans.
- Without the script (blocked, or not loaded) the picker stays hidden and the page follows the device as Sage or Linen, from CSS alone.
- Every page's content-security rule allows scripts from this site only. `scripts/check.py` allows exactly one `<script src="/theme.js">`, one picker button and one button for each of the eight themes (no other), and pins the script's SHA-256, so any change to it has to be read and re-pinned on purpose.
- A new theme in the app is added by hand: its colours in `styles.css`, its button in each page, its name in `LOOKS` in `scripts/check.py` and in `theme.js`.

## The brand

The owner supplied the brand assets on 2026-11-12 (`stonefold-labs-brand-assets.zip`, made 2026-11-11): a mark, a full logo, and a palette of evergreen `#293B36`, sage `#A9B8A1`, warm ivory `#F2F0E8` and amber `#D5A96C`.

- **The mark** is in the header of every page, beside the name set as ordinary text. Since 2026-11-18 it is the new one: eight evenly spaced stones in a square fold with an opening at the bottom, and no star (the owner: "company mark too", after picking it for the app's icon). The two files in `docs/brand/` are copies of the app's `docs/brand/stonefold-labs-mark-light.svg` (evergreen) and `…-dark.svg` (sage), commit 7285e11 of the logo chat, unchanged and 256 across like the old files. The page shows the evergreen one on the light themes (Linen, Paper, Clay, and Plain in a light device) and the sage one on the dark ones (Sage, Night, Ember, Dusk, and Plain in a dark device), by the theme's CSS alone. Measured against each theme's header colour: at least 6.3 to 1. The earlier mark (stones, a ring and a star, moved to the middle on 2026-11-17) is in the git history.
- **The tab icon** (`docs/favicon.svg`) is the evergreen mark on a warm ivory tile, so it shows on a dark tab bar too. The tile is the only thing added. The app's own `favicon.svg` turns sage in dark mode with a `<style>`; the site's rules allow no styles in a picture, so the tile does that job. The PNG set (`favicon.ico`, `apple-touch-icon.png`, `icon-192/512`) is not on the site: `scripts/check.py` publishes only `.svg`, `.css`, `.js`, `.html`, `.txt` and `.jpg`, and allows no other `<link rel>`; adding them is a decision (a check for PNG and ICO files, and `apple-touch-icon` in the pages' `<head>`).
- **The colours** in `docs/styles.css` start from the palette (Sage and Linen are it; the other six themes are the app's). Text contrast was measured: at least 5.3 to 1 everywhere, 10 to 1 or more for body text. In the evergreen band on Home the text is ivory or a pale sage, measured at 6.3 to 1 or more. Amber appears as the thin stripe along the top of every page, in Sage and Linen.
- **A sibling of longlinelabs.com** (the owner, 2026-11-12: the two sites should look like companies made by the same person, without looking identical). Shared with Longline: the stripe along the top, the mark in its own corner at the top left with a rail below it that opens to show names (the owner, 2026-11-13, asking for the site to work like longlinelabs.com), a serif wordmark, a short line above a large serif headline, a filled button, cards, hairlines between sections, a one-row footer. Stonefold's own: its mark, its greens and ivory, the four sections' signs standing on a stone wall in place of Longline's line of hooks, a rail that leads to the one app's sections where Longline's leads to its apps, an evergreen band for encryption, privacy and security, and no downloaded fonts. The rail opens with CSS alone, so it needs no second script. Longline's headings are set in Fraunces from Google; here they use a serif already on the reader's device (Iowan Old Style on Apple devices, which is also Longline's own fallback).
- **The full logo is not used yet, and is not in this repo.** It reads "STONEFOLD LABS LLC", and the company isn't formed. It also sets its words in a font (Avenir Next) that only Apple devices have, so on other devices the words would shift. Before it goes on the site its words need turning into outlines; until then the mark and typed name do the job.
