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
- **No Features pages** (the owner, 2026-11-21: he wanted two or three pages). The site is Home, How it works and the Guide, with Privacy and Support in the footer only. The Guide's first page gives each part a line, and what the five Features pages held (Plan your days, Write things down, Keep track of money, Papers, habits and upkeep, Make it yours) is in the guide's pages, with How the parts work together as one of its Getting started pages. The tag `pre-launch-site-2026-11-21` and the commits before `06c9bae` hold the Features pages if they are ever wanted back. There is no left rail, and the header holds How it works and Guide.
- **Guide** (`/guide/`, written 2026-11-21): one long page for endless scrolling, since the owner's word of 2026-11-21 ("just have endless scrolling"): every topic of every section in order, a heading for each section and topic, and a list down the left with every section open and a count beside each, jumping to a place on the page (nothing is remembered, so no cookie or script); on a phone the list folds into a menu. The old per-topic addresses (`/guide/<section>/<topic>/`) are tiny pages that send to the topic's place (a meta refresh of 0, a plain link and a canonical link, no script). The words are adapted from the app's own Help so they match: 91 topics in eight sections: Getting started (with Settings, group by group), Calendar, Reminders (with Habits, maintenance logs and boards), Notes (with Journal, Recipes, Logins, Binder, the password generator and the Authenticator), Budget (with net worth, debt payoff, the retirement planner and the glossary), Clock and calculator (with countdowns, the focus timer, the loan calculators and converters), Files, and On the Mac (with Every keyboard shortcut). The outline and what to check against the finished app are in `docs-notes/2026-11-21-guide-outline.md`.
- **Privacy** and **Support** brought up to date: the app section says what sync sends and what Apple can see; Support gets the in-app Help, the two-working-days promise and four questions.
- **Plain words (2026-11-21):** at the owner's word ("too much verbiage ... more human and easy to read") every page was rewritten shorter, about 30% fewer words than the first draft, in plain sentences. Home's headline is now "A private app for your calendar, notes, money and files."
- **Search** (the owner, 2026-11-21: "Yes, build search"): a box above each guide page that lists the pages holding every word typed, with the words marked. `docs/guide/search.js` (pinned in `scripts/check.py`) makes the box and the list; `docs/guide/search-index.js` holds the words of the 89 pages, about 110 KB, and is checked against the pages. It reaches no network and keeps nothing. Without the script the box is not there and the tree works as before. After any change to a guide page, the index must be rebuilt (`python3 guide.py` in the chat's scratchpad), or the check fails.
- **Gone:** the line about the small flock (the owner, 2026-11-21), Home's "Try the window" section, `docs/demo.js` and its styles, and the Privacy paragraph about the demo (the owner, 2026-11-21). `theme.js` is the one script.
- **`scripts/check.py`:** the demo's pin and rules are removed, and the sync wording (`sync`, `end-to-end`, `iCloud`) is let through. Everything else is as before, including the refusal of "sharing", "download", "app store", "coming soon", other prices, and every claim house rules §4 forbids. `--self-test` passes; `check.py` says `clean`.
- **`docs-notes/2026-11-21-site-notes.md`:** what was learned from three public sites, and what was taken.

## Look at it

```bash
python3 -m http.server 4731 --bind 127.0.0.1 --directory docs
```

Then open http://localhost:4731 (Stop with Control-C).

## Check against the finished app before launch

**Checked on 2026-11-21 against the app's `origin/main` (c6f482e) and the builders' branches** (clock-habits dd80f5d, files d35dfaa, note-kinds 6355f6b, retirement a0feaa3). The guide's button names, paths and keys match those; what was wrong is fixed (`docs-notes/2026-11-21-guide-outline.md`, "Checked against the app"). The branches were not merged and two builders were still working, so look once more when each lands.

The words come from `SPEC.md`, from the builders' plans in `StonefoldApp/docs/plans/2026-11-21-*.md` as they stood on 2026-11-21, and from the dispatch's list. The builds were still going, so each of these needs one look against what shipped:

1. **Which sections sync.** Decided: every section, Files included (the owner's answer "Every section", 2026-11-21 about 12:50, relayed from the dispatch chat; the site says so on How it works and on the guide's iCloud sync page). Sync itself is not built yet: `SPEC.md` plans it for the budget file at A9, then the calendar, reminders and notes at A10, and says nothing yet of Files. Check that what ships matches the sentence, and that sync is live.
2. **Four encrypted files.** Files is a fourth file (the documents file), so the encryption figure on Home and How it works shows four. No sentence counts files. Check the figure and the Calendar, Reminders and Clock grouping against the app.
3. **The Retirement planner.** Its guide page (`/guide/budget/retirement-planner/`) now follows sf-retirement's plan of 2026-11-21: a Budget feature, off to start; four questions to begin; the answer first; one tax rate the person types, with tax tables, contribution limits and required withdrawals left out; plans made and changed on the Mac and the iPhone, compared with Compare on the Mac and Duplicate on both (the page now follows the builder's real Help). Check the page against the finished feature, and whether the "not financial advice" sentence is the owner's to keep.
4. **Export Everything.** How it works lists the calendar, reminders, notes and budget files, which is SPEC §6's allowed claim, and adds that Files are copied out as they are (from the Files plan). The Clock's alarms, timers and cities are left out of the export and the page does not claim them.
5. **The money tools.** The calculators and converters sit behind a switch in Settings called Loans and Converters (off to start); Net Worth and Debt Payoff are Budget features. The Converters card says rates are typed and none are fetched.
6. **Habits have a streak,** from two in a row (the owner, 2026-11-21: "streaks are fine to add"; the builder's Help and `Habits.swift`). The guide and the Habits card say so. The focus timer has none.
7. **Logins** is never called a password manager and never said to be as safe as one (`SPEC.md`, the note kinds plan).
8. **The one price** is $24.99, paid once, for iPhone and Mac together. It holds only if the App Store record is set up that way.
9. **The Mac's app icon** starts out matching the theme (the money tools plan, item 0). Check that is how it shipped.
10. **Privacy's date** is set to 21 November 2026. Change it to launch day.
11. **The window your way (P8)** is in the app's `main` (since 2026-11-21 14:55); the guide's Panels, Today, Settings and shortcuts pages describe it from its Help. **The Editor theme** is committed on the app's branch `claude/terminal-theme-55f0ab` and not yet in `main`: the owner's idea, built on the site first and then decided by the app's builder, whose colours the site uses and whose Help wording the guide's look page uses. **P9, "one way to make and find anything"** (the command box offers New Transaction for a line with an amount, and each kind of note, and finds events, reminders and transactions) was still being written, uncommitted, at 14:55: add it to the guide's keyboard page when it lands. Check all three shipped, and that the site's nine themes are the app's.

## On launch day, with the owner's yes at each step

1. Check the list above, and that sync is live.
2. Add the App Store link: the hero buttons on Home, and nowhere else. Loosen `scripts/check.py` for that wording only, as CLAUDE.md says.
3. Fold the app's privacy policy and help into `/privacy/` and `/support/` as CLAUDE.md describes, once they are approved. "Data Not Collected" waits until the label is live; the check refuses it until it is changed.
4. `python3 -I scripts/check.py` must say `clean`. Look at every page wide and at phone width, light and dark.
5. Merge to `main`, push, then `scripts/check-live.sh`. Each of those is the owner's yes, one at a time.
