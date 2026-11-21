# Launch version: read this first

**Live for the owner's review since 2026-11-21.** His words, about 12:00 that day: "Please make the launch day website live so that it can be reviewed. I'm not worried about anyone stumbling across the website right now so it's only me seeing it." That lifts, for this review, SPEC §6's limit that the sync wording waits until sync ships. The site now describes iCloud sync and every feature built the weekend of 2026-11-21 in the present tense, **before they have all shipped**, so it is not to be announced, linked or shown to anyone else until the app is out. Nothing here adds a store link, "available now" wording, or any way of hiding the pages.

**The old site is kept.** Before the push, the live commit `397092c` was tagged `pre-launch-site-2026-11-21` on origin. To put the old site back in one step (each push is the owner's yes):

```bash
git checkout pre-launch-site-2026-11-21 -- docs scripts
git commit -m "Put the pre-launch site back"
git push origin main
```

Written on the branch `claude/launch-site-afa64e`, commit `1538725`, then merged into `main`. Later pushes, after his review, go out on his own words as he gives them.

## What it holds

- **How it works** (`/how-it-works/`): five numbered parts. It works without the internet; everything is encrypted on the device and the keys stay there; nothing leaves unless iCloud sync is on (then end-to-end encrypted, through the person's own iCloud); Export Everything; no account, no ads, no tracking. Then a few questions that open in place, and the "stays here, can leave" comparison.
- **Home**, rewritten: three "what to know first" cards, six cards for the parts of the app, the reasons, how the sections work together, the encryption band, About with the one price, and a closing question.
- **Features** (`/features/`): an index of every feature in a line, and five pages: Plan your days (Calendar, Reminders, Clock, Countdowns, Focus timer), Write things down (Notes, Journal, Recipes, Logins, Password generator, Authenticator), Keep track of money (Budget, Calculator, Mortgage and car loan calculators, Converters, Net worth, Debt payoff, Retirement planner), Papers, habits and upkeep (Files with scanning, Habits, Home and car maintenance logs), and Make it yours (Themes, the keyboard, Panels, feature switches).
- **Guide** (`/guide/`, begun 2026-11-21): a tree of pages down the left that opens and closes with no script, and the page beside it. So far: Getting started (choosing what to keep, how the app looks, adding from outside, the lock, a passphrase, the recovery sheet, backups, a new device, leaving with your things, what stays private, iCloud sync) and On the Mac (Today and the status line, panels, the keyboard, everything in the window), adapted from the app's own Help. The Calendar, Reminders, Notes, Budget, Clock and Files pages follow, from the same Help files. The outline is `docs-notes/2026-11-21-guide-outline.md`.
- **Privacy** and **Support** brought up to date: the app section says what sync sends and what Apple can see; Support gets the in-app Help, the two-working-days promise and four questions.
- **Plain words (2026-11-21):** at the owner's word ("too much verbiage ... more human and easy to read") every page was rewritten shorter, about 30% fewer words than the first draft, in plain sentences. Home's headline is now "A private app for your calendar, notes, money and files."
- **Gone:** the line about the small flock (the owner, 2026-11-21), Home's "Try the window" section, `docs/demo.js` and its styles, and the Privacy paragraph about the demo (the owner, 2026-11-21). `theme.js` is the one script.
- **`scripts/check.py`:** the demo's pin and rules are removed, and the sync wording (`sync`, `end-to-end`, `iCloud`) is let through. Everything else is as before, including the refusal of "sharing", "download", "app store", "coming soon", other prices, and every claim house rules §4 forbids. `--self-test` passes; `check.py` says `clean`.
- **`docs-notes/2026-11-21-site-notes.md`:** what was learned from three public sites, and what was taken.

## Look at it

```bash
python3 -m http.server 4731 --bind 127.0.0.1 --directory docs
```

Then open http://localhost:4731 (Stop with Control-C).

## Check against the finished app before launch

The words come from `SPEC.md`, from the builders' plans in `StonefoldApp/docs/plans/2026-11-21-*.md` as they stood on 2026-11-21, and from the dispatch's list. The builds were still going, so each of these needs one look against what shipped:

1. **Which sections sync.** Sync is not built yet. `SPEC.md` and `GAMEPLAN.md` plan it in two steps: A9 for the budget file, then A10 for the calendar and reminders (the Clock, countdowns, habits and logs live in that file) and the notes (Journal, Recipes, Logins and the Authenticator are note kinds). Both need the company's Apple enrollment. The Files plan says nothing of Files syncs yet. The owner thinks iCloud sync covers everything but is not sure. How it works (part 3) and Home speak of sync without naming sections; if sync covers some sections only, say which.
2. **Four encrypted files.** Files is a fourth file (the documents file), so the encryption figure on Home and How it works shows four. No sentence counts files. Check the figure and the Calendar, Reminders and Clock grouping against the app.
3. **The Retirement planner.** Its copy (`/features/money/#retirement`) now follows sf-retirement's plan of 2026-11-21: a Budget feature, off to start; four questions to begin; the answer first; one tax rate the person types, with tax tables, contribution limits and required withdrawals left out; changes made on the Mac and read-only on the iPhone. The plan said the build was still going, so check the page against the finished feature, and whether the "not financial advice" sentence is the owner's to keep.
4. **Export Everything.** How it works lists the calendar, reminders, notes and budget files, which is SPEC §6's allowed claim, and adds that Files are copied out as they are (from the Files plan). The Clock's alarms, timers and cities are left out of the export and the page does not claim them.
5. **The money tools.** The calculators and converters sit behind a switch in Settings called Loans and Converters (off to start); Net Worth and Debt Payoff are Budget features. The Converters card says rates are typed and none are fetched.
6. **Habits have no streak,** by house rule 15. If the owner changes that rule, the Habits card changes too.
7. **Logins** is never called a password manager and never said to be as safe as one (`SPEC.md`, the note kinds plan).
8. **The one price** is $24.99, paid once, for iPhone and Mac together. It holds only if the App Store record is set up that way.
9. **The Mac's app icon** starts out matching the theme (the money tools plan, item 0). Check that is how it shipped.
10. **Privacy's date** is set to 21 November 2026. Change it to launch day.

## On launch day, with the owner's yes at each step

1. Check the list above, and that sync is live.
2. Add the App Store link: the hero buttons on Home, and nowhere else. Loosen `scripts/check.py` for that wording only, as CLAUDE.md says.
3. Fold the app's privacy policy and help into `/privacy/` and `/support/` as CLAUDE.md describes, once they are approved. "Data Not Collected" waits until the label is live; the check refuses it until it is changed.
4. `python3 -I scripts/check.py` must say `clean`. Look at every page wide and at phone width, light and dark.
5. Merge to `main`, push, then `scripts/check-live.sh`. Each of those is the owner's yes, one at a time.
