# Stonefold Labs — the website

The public site for stonefoldlabs.com: a home page, a privacy page and a support page. Hand-written HTML and one stylesheet. No build step, no cookies, no analytics, nothing loaded from anyone else. One small script of our own, the light and dark switch.

It exists for three reasons, in order: Apple requires an organization to have a public website and an e-mail address on its own domain before it can enroll in the Developer Program; each app's App Store listing needs a privacy policy URL and a support URL; and people should be able to see what Stonefold Labs makes.

## Where things are

```
docs/              the published pages (GitHub Pages only publishes a folder with this name)
  index.html         Home
  privacy/index.html https://stonefoldlabs.com/privacy/
  support/index.html https://stonefoldlabs.com/support/
  404.html           shown for any address that doesn't exist
  styles.css
  theme.js           the light and dark switch: the site's only script
  favicon.svg        the company's mark on a warm ivory tile, for the browser tab
  brand/             the mark, for light and for dark, exactly as the owner supplied it
  robots.txt
  CNAME              tells GitHub Pages the site's address
  .nojekyll          tells GitHub Pages to publish the files as they are
scripts/
  check.py           run before every commit
  check-live.sh      run after every push, once the site is live
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

It must say `clean`. It fails on any script but `theme.js` (whose exact contents are pinned in the check), anything loaded from another site, a dead link, or a claim the house rules (`../Stonefold/HOUSE-RULES.md` §4) don't allow yet. `python3 -I scripts/check.py --self-test` proves each rule can fail.

## Where it stands (2026-11-13)

Live at https://stonefoldlabs.com since 2026-11-13, served by GitHub Pages from the public repo `Stonefold-Labs/website` (branch `main`, folder `/docs`), with Cloudflare on "DNS only". Commits are authored "Stonefold Labs". `PUBLISHING.md` says which parts are done; the mailbox test and the day the company exists are still to do. Any change: edit, `python3 -I scripts/check.py`, commit, push (on the owner's yes), then `scripts/check-live.sh`.

The company is not formed yet, so no page says "LLC" and none carries a copyright line. `PUBLISHING.md` Part 8 is the change for the day it is.

## The light and dark switch

The owner asked for it on 2026-11-12, and chose a switch that remembers over keeping the pages free of any script. `docs/theme.js` is that script, about fifty lines, served from this site.

- Until someone uses the switch, a page follows the device's light or dark setting, exactly as before.
- Using it saves one word, "light" or "dark", in that browser's storage for this site, under the name `theme`. It is not a cookie and is never sent anywhere; the Privacy page says so.
- Without the script (blocked, or not loaded) the switch stays hidden and the page still follows the device.
- Every page's content-security rule allows scripts from this site only. `scripts/check.py` allows exactly one `<script src="/theme.js">` and one button per page, and pins the script's SHA-256, so any change to it has to be read and re-pinned on purpose.

## The brand

The owner supplied the brand assets on 2026-11-12 (`stonefold-labs-brand-assets.zip`, made 2026-11-11): a mark, a full logo, and a palette of evergreen `#293B36`, sage `#A9B8A1`, warm ivory `#F2F0E8` and amber `#D5A96C`.

- **The mark** is in the header of every page, beside the name set as ordinary text. The two files in `docs/brand/` are the owner's, unchanged; the page picks one by the reader's light or dark setting, with no script.
- **The tab icon** (`docs/favicon.svg`) is the light mark on a warm ivory tile, so it shows on a dark tab bar too. The tile is the only thing added.
- **The colours** in `docs/styles.css` are the palette's. Text contrast was measured: at least 5.3 to 1 everywhere, 10 to 1 or more for body text. Amber appears in the mark and as the thin stripe along the top of every page.
- **A sibling of longlinelabs.com** (the owner, 2026-11-12: the two sites should look like companies made by the same person, without looking identical). Shared with Longline: the stripe along the top, the mark beside a serif wordmark, a short line above a large serif headline, a filled button, cards for the apps with a small capital label, hairlines between sections, About beside a set of small promise cards, a one-row footer. Stonefold's own: its mark, its greens and ivory, no side rail of app icons, and no downloaded fonts. Longline's headings are set in Fraunces from Google; here they use a serif already on the reader's device (Iowan Old Style on Apple devices, which is also Longline's own fallback).
- **The full logo is not used yet, and is not in this repo.** It reads "STONEFOLD LABS LLC", and the company isn't formed. It also sets its words in a font (Avenir Next) that only Apple devices have, so on other devices the words would shift. Before it goes on the site its words need turning into outlines; until then the mark and typed name do the job.
