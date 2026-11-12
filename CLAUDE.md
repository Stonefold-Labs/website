# CLAUDE.md — rules for the Stonefold Labs website

This repo is the public website for stonefoldlabs.com. Read `README.md` first. The Stonefold house rules (`../Stonefold/HOUSE-RULES.md`) hold here: §4 (what may be claimed), §5 (the website line), §7 and §8 (names and brand).

## Non-negotiables
- **Plain pages.** Hand-written HTML and one CSS file. No JavaScript, no build step, no framework, no generator.
- **Nothing that could track a reader.** No analytics, no cookies, no forms, no embeds, no fonts, pictures or files from another site. Every page carries the same content-security rule; don't loosen it.
- **Claims are promises.** A page says only what house rules §4 allows on that day. Sync and end-to-end wording waits until an app's sync ships. "Data Not Collected" waits until a label is live. Apple's current pages are read before a claim is written, not remembered.
- **No app is described as available** until it is. No prices.
- **Names.** Only names the owner has made final appear: Bellwether Budget and Small Flock (2026-11-12). The others are named by kind. Ask before adding one.
- **The company's legal name** is written only once it is true. Until the owner says the LLC is formed, pages say "Stonefold Labs", with no "LLC" and no copyright line (`PUBLISHING.md` Part 8).
- **The host adds nothing.** GitHub Pages, with Cloudflare set to "DNS only". If hosting ever changes, `scripts/check-live.sh` must still pass and the privacy page must still be true.
- **The privacy page is true or it is changed.** If anything about hosting, mail or the apps changes what we know about a person, the page changes first, with its date.

## How to work
1. Plan first for anything beyond a wording fix, and wait for the owner's yes.
2. `python3 -I scripts/check.py` must say `clean` before every commit. A new outside link is added to `OUTSIDE_LINKS` there on purpose, not to quiet the check.
3. After a push, run `scripts/check-live.sh`.
4. Look at every changed page in a browser, wide and at phone width, light and dark, before saying it is done.
5. Pushing, DNS changes and anything in the owner's GitHub, Cloudflare or Proton accounts are his to approve, one at a time.
6. Don't write outside this folder. The app folders beside it are read-only from here.
7. The owner is new to web hosting: give exact clicks for anything he does himself.

## Adding an app's pages at its release
Its privacy policy becomes a section of `docs/privacy/index.html` and its help a section of `docs/support/index.html`, each under a heading with the app's name and an `id` (so a listing can link to `…/privacy/#bellwether-budget`). The words come from that app's approved draft and must match the copy inside the app. The App Store URLs stay `https://stonefoldlabs.com/privacy` and `https://stonefoldlabs.com/support` for every app.
