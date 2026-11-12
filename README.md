# Stonefold Labs — the website

The public site for stonefoldlabs.com: a home page, a privacy page and a support page. Hand-written HTML and one stylesheet. No JavaScript, no build step, no cookies, no analytics, nothing loaded from anyone else.

It exists for three reasons, in order: Apple requires an organization to have a public website and an e-mail address on its own domain before it can enroll in the Developer Program; each app's App Store listing needs a privacy policy URL and a support URL; and people should be able to see what Stonefold Labs makes.

## Where things are

```
docs/              the published pages (GitHub Pages only publishes a folder with this name)
  index.html         Home
  privacy/index.html https://stonefoldlabs.com/privacy/
  support/index.html https://stonefoldlabs.com/support/
  404.html           shown for any address that doesn't exist
  styles.css
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

It must say `clean`. It fails on a script, anything loaded from another site, a dead link, or a claim the house rules (`../Stonefold/HOUSE-RULES.md` §4) don't allow yet. `python3 -I scripts/check.py --self-test` proves each rule can fail.

## Where it stands (2026-11-12)

Built and seen locally. Not published: no GitHub repo, no DNS records for the site. `PUBLISHING.md` has the steps.

The company is not formed yet, so no page says "LLC" and none carries a copyright line. `PUBLISHING.md` Part 8 is the change for the day it is.

## The brand

The owner supplied the brand assets on 2026-11-12 (`stonefold-labs-brand-assets.zip`, made 2026-11-11): a mark, a full logo, and a palette of evergreen `#293B36`, sage `#A9B8A1`, warm ivory `#F2F0E8` and amber `#D5A96C`.

- **The mark** is in the header of every page, beside the name set as ordinary text. The two files in `docs/brand/` are the owner's, unchanged; the page picks one by the reader's light or dark setting, with no script.
- **The tab icon** (`docs/favicon.svg`) is the light mark on a warm ivory tile, so it shows on a dark tab bar too. The tile is the only thing added.
- **The colours** in `docs/styles.css` are the palette's. Text contrast was measured: at least 5.3 to 1 everywhere, 10 to 1 or more for body text. Amber appears only in the mark.
- **The full logo is not used yet, and is not in this repo.** It reads "STONEFOLD LABS LLC", and the company isn't formed. It also sets its words in a font (Avenir Next) that only Apple devices have, so on other devices the words would shift. Before it goes on the site its words need turning into outlines; until then the mark and typed name do the job.
