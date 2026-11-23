# Review for anything that looks AI-made (2026-11-23)

The owner's words, 2026-11-23 about 00:15: "Ask Claude to change/update/get rid of anything that looks vibe coded or ai created it in the website and the app". The app is reviewed in another chat. This is the website: every page read as a careful visitor would, phone and desktop widths, light and dark, then the code.

The good news first. The words are already plain. Across Home, How it works, Why, Price, Questions, About, Privacy, Support, 404 and the guide there are no em dashes, no exclamation marks, no sparkle or emoji, no gradients, and none of seamless, effortless, powerful, unlock (as marketing), elevate, all-in-one, reimagined, "ready to get started". The questions are specific and the answers are short. What reads as machine-made is structure and repetition, and the code underneath.

Status: **done** = fixed and pushed, **proposal** = changes what a claim says or is the owner's own wording, so it needs his yes, **kept** = looked at and left alone on purpose.

## Pages

### 1. Price: four cards that say the title twice — done
- Where: `/price/`, "What it never costs": "No ads / There are no ads in Stonefold.", "No account / You never have to sign up…", and so on.
- Why it reads as AI-made: the textbook icon-title-blurb grid where the blurb restates the title. Every one of the four is said again on How it works, Why, About and Questions.
- Fix: one short list, same claims, no cards.

### 2. Price: "Every device" repeats the line above it — done
- Where: `/price/`. The lede says "costs $24.99, once, for iPhone, iPad, and Mac together". The first card says "One payment of $24.99 covers Stonefold on your iPhone, your iPad, and your Mac."
- Why: the same claim twice in three lines. $24.99 is on the page five times.
- Fix: the card is removed. The lede carries it. No price word is changed.

### 3. Support: the same four answers as Questions, and they have drifted — done
- Where: `/support/`. The four questions are word for word on Questions or close to it. Support says "Open a Copy"; Questions says "Open a Saved Copy". Two copies of one answer drift.
- Why: padding, and a claim stated in two places that can disagree.
- Fix: Support keeps the contact line, the app's Help and a pointer to Questions and Privacy. It no longer repeats the answers.

### 4. Support: jump links on a page that fits one screen — done
- Where: `/support/`, the list "Help in the app / Questions / Privacy" over three short sections.
- Why: furniture copied from long documentation pages.
- Fix: removed with the section it jumped to.

### 5. Privacy: "The theme picker at the top of the page" — proposal
- Where: `/privacy/`, "This website". The picker is on Home only since 2026-11-22 and floats in the corner.
- Why: it is a small untruth, which is also how generated text goes stale. The privacy page is true or it is changed.
- Fix (needs his yes, it is the privacy page): "The theme picker on the home page is the one small script of our own on this site." Date to the day it goes out.

### 6. How it works, step 3: the sync sentence three times — proposal
- Where: `/how-it-works/`, step 3. "each change is sealed on your device first, with a key only your iPhone and Mac hold. It then travels through your own iCloud… Sync is end-to-end encrypted. Only your iPhone and Mac hold the key. It runs through your own iCloud, and we run no servers." Questions and Privacy say it a fourth and fifth time.
- Why: one claim, repeated inside one paragraph. It reads as a model covering itself.
- Fix (a sync wording, so his yes): "Turn it on and each change is sealed on your device first, with a key only your iPhone and Mac hold. It then travels through your own iCloud to your other iPhone or Mac. Sync is end-to-end encrypted, and we run no servers." SPEC §6's three claims are all still there, once each.

### 7. How it works, step 5: the heading says it, the paragraph says it again — proposal
- Where: step 5, "No account, no ads, no tracking, no AI." then "No sign-up, and nothing to log in to. No ads, no analytics, no outside services…".
- Fix: keep the heading; shorten the paragraph to the one thing the heading doesn't say: "Anything Stonefold works out is plain arithmetic, and it can show how." (a "what the app does" claim, so his yes).

### 8. Home: the paragraph lists what the headline just listed — proposal
- Where: Home. The headline names calendar, reminders, notes and budget; the next paragraph names the same four and two more.
- Why: it is the owner's own request (2026-11-22, "Maybe incorporate everything into a paragraph", then "Yes, push it"), so it stays. The thing a visitor sees is the list twice.
- Option for him: drop "calendar, reminders, notes, and budget" from the headline's twin, so the headline says what the app is ("one private app") and the paragraph lists the parts. His call.

### 9. Why Stonefold: a "why choose us" page — proposal (his design, kept)
- Where: `/why/`. Six "Because…" reasons and a $24.99 tile. It is the owner's own wording from 2026-11-18, and the "Because" run is his.
- Why it reads as the genre: the page exists to say the app is good; five of the six reasons are said on Price, How it works or About too, and the second one's body ("No account, no server, just you and your data.") answers a different question than its heading ("AI shouldn't be trained on your data").
- Option for him: fold the six reasons into About and take "Why Stonefold" out of the footer and the wall, so the site has one fewer page that restates the others. Not touched.

### 10. Price, Why, About, Questions, How it works all state the price — proposal
- $24.99 appears on five pages. The wording differs a little each time ("one payment covers", "costs", "paid once", "one-time payment"). A visitor reads one number five ways.
- Option: Price carries it, About and Why link to it. Price words go to the owner first.

### 11. Questions page — kept
- Reads as specific: each question is one a person would ask, each answer says one thing, in the app's own names for buttons. The only repetition is across pages (offline, no account, export), which is what a FAQ does. No change.

### 12. About — kept
- The owner's words. No change.

## Code

### 13. Dead CSS: 69 classes no page uses — done
- Where: `docs/styles.css`, 3,945 lines. Classes with no page or script using them: `rail`, `pager`, `toc`, `hub`, `window`, `drawing`, `slot`, the `d-*` drawing set, `cards`, `facts`, `parts`, `flows`, `compare`, `three`… (the features pages, the demo window, the rail and the guide's old pager are all gone, their styles stayed).
- Why: a stylesheet that is mostly the history of the design, with later rules overriding earlier ones. A view-source reader sees a 73 KB file for nine plain pages.
- Fix: every rule whose selector needs a class that nothing uses is removed. A selector inside `:not(…)` is left alone. The pages are compared before and after.

### 14. Comments that narrate the owner's chat — done
- Where: `styles.css` (91 comments), `theme.js`, `flip.js`, `guide/search.js`, `questions/search.js`. "(the owner, 2026-11-22: "get rid of the top menu bar")", "who found the search broken", "(Its names are its own: on 2026-11-22 the owner found the search broken…)".
- Why: it is a changelog in the margin, in a public repo. The decisions are recorded in CLAUDE.md; the code only needs to say what a block does.
- Fix: the owner's quotes and dates are taken out of comments, the remaining sentence is kept. The behaviour of the scripts is not touched; their pins in `scripts/check.py` are renewed for the comment change only (the diff of each is comments and nothing else).

### 15. A stale comment says there is a demo — done
- Where: `docs/theme.js` line 1: "It and the home page's demo (demo.js) are the only scripts on stonefoldapp.com." The demo and `demo.js` are gone; there are four scripts.
- Fix: reworded.

### 16. `scripts/check.py` and the docs — kept
- Their long explanatory comments are the repo's own record, outside the published `docs/`, and read as a person's working notes. Not touched.

## What only the owner can decide (from the list above)
- 5, 6, 7: the three small wording fixes on Privacy and How it works (claims about privacy and sync).
- 8, 9, 10: whether Home's headline and paragraph should stop listing the same parts, whether Why Stonefold should fold into About, and where the price is stated.

## What was not changed, on purpose
His About wording, the wordmark and mark, the sheep, the wall of stones on Home, the flip-through, the lowercase rounded headings, the theme picker on Home only, the address and the LLC lines.
