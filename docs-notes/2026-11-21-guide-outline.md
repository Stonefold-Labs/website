# The guide: an outline for the owner's OK (2026-11-21)

The idea (the owner, 2026-11-21): one clean main site, and a data-heavy guide that explains every feature, what each thing does and how it works, useful to someone who already owns the app, and the same words inside the app. Nothing here is built yet. This is what would be.

## How it is made

- **One set of words.** The app already has one Help: a page for each part of the app, searchable, the same on the iPhone and the Mac (`SPEC.md` §22). Each page is data: a title, a picture's name and a few short paragraphs. The guide is those pages, so the site and the app can never disagree. The pages are written once, in the app's repository, by the build chats that make each section; the site publishes them.
- **On the site: `/guide/`.** Plain HTML pages, no script. An index of every page, a page for each part of the app, a short "How do I…" list at the top of each, and a "What it doesn't do" line at the foot.
- **In the app: bundled, not linked.** The app never goes online unless sync is on and never contacts this website, so the in-app guide is the same pages shipped inside the app, not a web view.
- **Every sentence is a claim.** The app's Help is read against the code, sentence by sentence. The site's `scripts/check.py` runs the same word rules over the guide pages as over every other page.
- **The shape of a page:** what it is (one line); how do I (numbered steps); the keys on the Mac; the switches in Settings and what each does; what it leaves out.

## The pages

**Getting started**
1. Choosing what to keep (Welcome)
2. How the app looks (themes, typefaces, density)
3. The lock, and a passphrase on the budget or the notes
4. The recovery sheet
5. Backups and Save a Copy
6. A new Mac or a new iPhone
7. Sync with iCloud, and what it sends
8. Leaving with your things (Export Everything)
9. What Leaves This Device
10. Adding from the Home Screen and Shortcuts

**Calendar:** adding an event; moving around the calendar; alerts; repeats, time zones and more calendars; US Holidays and calendar files; Bring Mine Over; deleted events.

**Reminders:** adding a reminder; Today and marking done; lists; alerts, Done and Snooze; tags (Mac); habits; home and car maintenance logs; deleted reminders.

**Notes:** writing a note; finding a note; folders, checklists and formatting; notes as files; tags, templates and saved views (Mac); Journal; Recipes; Logins and the password generator; sign-in codes (Authenticator); deleted notes.

**Budget:** adding a purchase; bills and paydays; where you stand, and safe to spend; checking a balance with your bank; the plan; the grid and paste (Mac); net worth; debt payoff; the retirement planner; budgeting words (a glossary); the sample budget.

**Clock and calculator:** timers; alarms; stopwatch; world clock; countdowns; focus timer; the calculator; mortgage and car loan calculators; converters.

**Files:** bringing files in; scanning (iPhone); folders, kinds and dates; search; expiry reminders; saving a document out.

**Reference:** Settings, group by group; keyboard shortcuts (Mac); the command box and two-key jumps (Mac); panels and layouts (Mac); the status line and Today (Mac).

That is about 55 short pages. Most already exist as Help pages in the app; the new sections (money tools, Files, Journal, Recipes, Logins, Habits, Logs, Countdowns, Focus, the retirement planner) each need theirs from the chat that builds them.

## What changes on the rest of the site

- The Features pages stay short ("what it is") and each feature links to its guide page ("how it works").
- How it works stays the trust page.
- The nav gains Guide.
- Support links to the guide first.

## Decisions for the owner

1. **Search on the site.** A search box needs a second script, and the site's rule allows only the theme picker. Without it the guide is an index plus a page per part, and the browser's find does the rest. The app keeps its own search either way. Recommended: no script, for now.
2. **Generated or written twice.** Recommended: generated from the app's Help pages, so there is one copy of every sentence. It needs a small export step in the app's repository and a read of it from here.
3. **Screenshots.** They are on hold. The guide reads well without them and much better with them, so the hold matters more once this exists.
4. **Who writes the new sections' pages.** Recommended: each builder chat writes its own section's Help pages as it builds, which the app's spec already asks for, and this chat only publishes and checks them.

## Where it stands (2026-11-21, evening)

- **Built:** the tree navigation (groups that open and close, the current page marked, a menu at the top on a phone, a Before and Next link at the foot of each page) and 15 pages: Getting started (11) and On the Mac (4), adapted from `ShellHelp.swift`. Words the site refuses (restore, reset, recover) are put another way, and the Clock's "no export yet" is stated without "yet".
- **Next, one section at a time:** Calendar, Reminders, Notes, Budget, Clock and calculator, Files, then the reference pages, each from that section's own Help file (`CalendarHelp.swift`, `RemindersHelp.swift`, `NotesHelp.swift`, `BudgetHelp.swift`, `ClockHelp.swift`) and, for this weekend's additions, from the builders' plans.
- **Decisions taken as recommended** until the owner says otherwise: no script for search; the pages are written here from the app's Help, not generated; screenshots stay on hold.

### Update: Calendar and Reminders written

- **Calendar (11 pages):** adding an event; moving around; the year at a glance; alerts; more for the calendar; tags and templates (Mac); copying from Apple's Calendar; your other calendars; US Holidays; bringing in a calendar file; deleted events. From `CalendarHelp.swift`.
- **Reminders (12 pages):** adding a reminder; Today and marking done; lists; alerts; more for reminders; tags (Mac); saved views (Mac); Habits; Home and car maintenance logs; copying from Apple's Reminders; deleted reminders. From `RemindersHelp.swift`, with Habits and Maintenance Logs from the clock-and-habits builder's plan.
- **Notes the owner may want:** the guide uses American spelling (the app's Help says "colour"), puts "download" and "restore" another way because the site's check refuses those words, and says "Choose it there to put it back" where the app's button says Restore. Habits and Maintenance Logs are written from a plan, so check them against the finished screens.
- **Still to write:** Notes (with Journal, Recipes, Logins, the password generator and the Authenticator), Budget (with net worth, debt payoff and the retirement planner), Clock and calculator (with countdowns, focus, loans and converters), Files, and the reference pages.

### Update: Notes written

- **Notes (16 pages):** writing a note; finding a note; folders, checklists and formatting; how formatting is written; your notes as files; tags and templates; saved views (Mac); kinds of note; Journal; Recipes; Logins; the password generator; sign-in codes (Authenticator); the keyboard in your notes; VoiceOver in your notes; deleted notes. From `NotesHelp.swift`, with Journal, Recipes, Logins and the password generator from the note-kinds builder's plan and the Authenticator from `SPEC.md` §35.
- **Check against the finished screens:** the four new kinds (Journal, Recipes, Logins, password generator) are written from a plan. Logins is never called a password manager and never said to be as safe as one, as the plan asks.
- **Still to write:** Budget (with net worth, debt payoff and the retirement planner), Clock and calculator (with countdowns, focus, loans and converters), Files, and the reference pages.

### Update: Budget written

- **Budget (13 pages):** adding a purchase; bills and paydays; where you stand, and safe to spend; checking a balance; the plan; working in the grid (Mac); copying and pasting rows (Mac); more for the budget; net worth; debt payoff; the retirement planner; the sample budget; budgeting words (the glossary). From `BudgetHelp.swift` and `Glossary.swift`, with net worth and debt payoff from the money-tools builder's plan and the retirement planner from its plan.
- **The glossary's examples use plain numbers,** because the site's check refuses any dollar figure but the app's price.
- **Check against the finished screens:** net worth, debt payoff and the retirement planner are written from plans, and the retirement planner's own plan says its build was still going.
- **Still to write:** Clock and calculator (with countdowns, focus, loans and converters), Files, and the reference pages.

### Update: Clock and calculator written, and Habits, Logs and Boards corrected

- **Clock and calculator (12 pages):** the stopwatch; timers; alarms; the world clock; countdowns; the focus timer; the calculator; the mortgage calculator; the car loan calculator; converters; the Clock beside your work (Mac); deleting in the Clock. From the clock builder's own Help (read in its worktree, which is newer than the main checkout), `SPEC.md` §34, and the money-tools builder's plan and the labels on its calculator screens.
- **Corrected from the builder's real Help:** the Habits and Maintenance Logs pages now use its button names (New Habit…, Remind Me, Log Something, Add Recurring Item…, Remind Me In, Log It…). **Added:** a page for Boards (a reminders list as cards in columns, with To Do, Doing and Done to start), which the builder added after the plans, and a Boards card on the Plan your days page.
- **Still no Help text from the money-tools builder,** so the loan calculators, converters, net worth and debt payoff are written from its plan and screens. Check them against the finished app.
- **Still to write:** Files, and the reference pages.

### Update: Files written, and a Settings page; the guide covers every part

- **Files (7 pages):** what Files is; bringing files in; folders, names and details; finding a file; looking at a file; reminders before a file expires; deleting in Files. From the Files builder's own Help (read in its worktree) and its plan.
- **Settings, group by group** is the one reference page that was not already a Help page: it follows `SPEC.md` §21.1's order. The Mac's shortcuts, the command box, panels, Today and the window are the four pages under On the Mac, so the reference group is folded into the groups that already hold them.
- **The guide is now 87 pages in eight groups.** What is not in it: the game (the owner took its line off the site), and anything the apps' Help does not say yet.
- **Check against the finished app:** the money tools (loan calculators, converters, net worth, debt payoff), the retirement planner, Journal, Recipes, Logins and the password generator were written from plans, because their builders had written no Help text.

### Checked against the app (2026-11-21)

The owner asked: "Check the guide against the finished app." The app's `origin/main` is c6f482e (the money tools are merged). Four builders' branches were not merged yet: clock-habits (dd80f5d), files (d35dfaa), note-kinds (6355f6b), retirement (a0feaa3). I read each one's Help and Words files and its lists of keys, in its own worktree, never editing them. Every quoted name in the guide (a menu item ending in "…", a "Settings ▸" path, a name in quotes) was searched for in all five trees. They were all there.

**What did not match, and is fixed:**
- **Habits** now have a streak: from two in a row, "5 days in a row", in days, due days or weeks. The page and the Habits card said there were none (house rule 15 was lifted by the owner on 2026-11-21).
- **Debt payoff:** what you type is forgotten when the app locks (the page said it was kept in the budget file); the plan runs month by month starting next month; the limit is shown as "Not in 100 years"; the smallest-balance and highest-rate orders are the two shown side by side, not three.
- **Net worth:** the chart covers one, two or three years. The Settings switches are named Net worth, Debt payoff and Retirement planning (the screens are Net Worth and Debt Payoff).
- **The calculator:** with Loans and Converters on, Mortgage, Car Loan and Converters are in the Mac's View menu too; Export Schedule says the file isn't encrypted, then saves it where the person chooses (Mac) or hands it to the iPhone's own sheet.
- **The retirement planner:** the iPhone can make a plan and change any part of it, not only show one; By Year on the iPhone shows net worth in today's money; a plan is compared by Duplicate (both) and Compare (Mac, up to three).
- **Logins:** how to start one on each device (Notes ▸ New Logins Note, or the New Note button on the Mac; touch and hold the pencil on the iPhone); the buttons are Generate Password… and Show Password; exports leave out each login's own notes as well as the passwords, and ask first that this is the person's device.
- **The password generator:** the three kinds are named Password, PIN and Groups of Six; "Leave out look-alikes"; Generate Password is under More on the iPhone.
- **Recipes:** the New Note list says Recipe (Notes ▸ New Recipe on the Mac).
- **Binder** (new in the note-kinds branch, SPEC §39.9) had no page: added "A binder for your family", a Binder card on the Notes features page, and Binder in the kinds page and Settings list.
- **Using the keyboard:** the two-key jumps now include K for the Clock and F for Files; "⌘1 to ⌘4" is now "⌘1 and on", since up to six sections can be kept; a countdown's key is written ⌥⇧⌘N, as the app's list writes it (the countdown Help writes ⇧⌥⌘N, which is the builder's slip; the menu shows ⌥⇧⌘N).

**Added:** "Every keyboard shortcut" (`/guide/mac/every-key/`), the owner's request of the same day: every key in the app's own lists (the app's, Calendar, Reminders, Notes, Budget, Clock, Files), with the feature each needs. Read from `ShellShortcut`, `LookShortcut`, `PanelShortcut`, `SightShortcut`, `WindowShortcut`, `KeyJump`, `CalendarShortcut`, `RemindersShortcut`, `NotesShortcut`, `AppShortcut` and its table keys, `ClockShortcut` and `FilesShortcut`. The Mac has them; the iPhone has none listed. When a builder changes a key, this page changes.

**Matched without change:** Calendar, Alerts, Boards, Countdowns, the focus timer, the world clock, Files (all seven pages), Journal, the kinds page, the Settings page, backups and the recovery sheet.

**Still plan-based (the builders' Help is silent):** the details in the loan calculators' fields, the converters' limits, how a due date is worked out in a maintenance log, the focus timer's limits (1 to 120 minutes), and Files' folders-first sort. Each came from a plan or a screen file and is not contradicted by anything read.

### Update: the site cut to three pages (2026-11-21)

The owner asked for "2-3 pages (the main page, the guide/wiki page, and maybe one more page, how it works I guess)" so visitors don't get lost, and said "Yes, do that" to the plan.

- **Gone:** `/features/` and its five pages, the left rail, and Privacy and Support in the top menu (both stay in the footer, which the App Store listing links to). The top menu is How it works and Guide.
- **Home:** its six cards are now the app's six parts (Calendar, Reminders, Notes, Budget, Clock and calculator, Files) and each leads to that part's place on the guide's first page (`/guide/#calendar` and so on). "See every feature" became "Read the guide".
- **The guide's first page:** each group has a line under its name, and the page list under it. That list, a page and its one line each, is the old "every feature in a line".
- **New guide page:** How the parts work together (Getting started), from the last section of the old features index: the two switches, Bills on the Calendar and in Reminders, and Reminders on the Calendar.
- **Dropped with the pages:** the drawings of signs on a stone wall on each group page, and the long feature cards (their facts are in the guide's pages, which were checked against the app).

### Checked against the app again (2026-11-21, 13:10 to 13:30)

The app's `main` is now 6355f6b: the note kinds (Logins, the generator, Journal, Recipes, the Binder) are merged into it. The retirement builder had Help changes not yet committed; clock-habits, files and money-tools had changed only tests and notes; note-kinds had one layout fix. I read each one's Help again, searched every quoted name, menu item, path and Title Case phrase in the guide in all of the app's trees, and checked the numbers I could find in code.

**Fixed:**
- **Retirement:** a new plan counts the budget's own accounts, other than cards and loans, as cash, and an account tracked outside the budget only if you choose it, as taxable ("count investments, not a house or a car"). On the iPhone the button is New Retirement Plan…, not +.
- **Net worth:** Add an Asset… opens the new account sheet with Type set to "Asset or Investment (tracking only)" and Include in budget off. The page had quoted a label the app doesn't have.
- **The password generator:** the app shows "About 89 bits: very strong", with the word in lower case.

**Checked and matching:** every other name the scan found (the rest were pieces of my own sentences), the focus timer's limits, the habit streaks, the loan, converter and tip rules, the retirement defaults and the Binder, Journal, Recipe and Logins wording. Not checked against the app: whatever its builders have not yet written down or built.

### Checked against the app again (2026-11-21, 14:20)

The app's `main` is now 134892c: the clock, habits and boards, the retirement planner, Files and the money tools are all merged into it. Still on their own branches: the note kinds' later work (Code notes), the terminal themes and "the window your way". Every builder was idle. I read what changed in each one's Help, words and keys since the last check, searched every quoted name, path and menu item in all the app's trees, and checked the numbers against code.

**Fixed:**
- **Saved scenarios and the saved debt plan** (new in the money tools): Save Scenario… keeps a mortgage or car loan in your own budget's encrypted file under Saved in Your Budget, and Save Plan keeps the Debt Payoff plan; neither is offered in the sample budget. The mortgage, car loan, Debt Payoff and calculator pages said what you type is always forgotten when the app locks.
- **Files, from its Settings screen and SPEC:** Files has no passphrase of its own (it opens with the one unlock) and no Save a Copy as a whole; a file another app sends waits in the app's own folder, unreadable while the iPhone is locked and left out of its backups, until it is sealed into Files. "What stays private" gained a Files part.
- **Code notes** (on the note-kinds branch, not yet in `main`; SPEC §39.10, record 0056): a new guide page, Code in the kinds page, ⌥⌘F Find and Replace… in the shortcuts, and the fenced code blocks in How formatting is written. If that branch does not ship, take them out.

**Checked and matching:** every other quoted name, path and menu item; the calculator's fifty sums; the retirement Help as committed; the Files, Clock and Reminders Help; the shortcut lists.

**The terminal themes** are not on the site. The app's branch `claude/terminal-theme-55f0ab` holds four (Terminal Green, Amber, White and Cyan), making twelve, with a Code note palette; it is not merged and its papers are still being written. The site's theme picker mirrors the app's themes (the owner, 2026-11-18), so adding them means four more picker buttons, their colours in `styles.css`, `LOOKS` in `scripts/check.py` and the pinned `theme.js`, and "twelve themes" on Home and in the guide. Waiting for the merge and for the owner's yes on `theme.js`.

### Editor replaces the terminal themes (2026-11-21, 15:00)

The owner found the four terminal themes hard to read ("one terminal theme ... what coding or IDEs look like ... multiple colors within one theme") and asked for them to go. They were on the site from about 14:55 to 15:00 (`13a704b`, reverted). The site now has one new theme, **Editor**: dark slate `#1b1e26` with a pane `#232733`, soft white-blue words `#d5d9e4`, blue links and buttons `#6cb2ff`, orange for the top stripe, the headline word and code `#f0a35e`, green `#7ccf8a` and purple `#b48ef0` for marks and events. The words stay in the system font for reading; only the colours are the editor's. The app has no such theme: its builder was told, and the site's values are the starting palette. Check at launch that the app's Editor matches the site's, or change the site to match the app.

### Checked against the app again (2026-11-21, 14:50)

The app's `main` is now 7fdfdc0: Code notes are merged into it, so that page now matches `main`. Still unmerged: money-tools (one commit: the loan calculators' Esc), the terminal-theme branch (being changed to one editor-style theme at the owner's word), the website-screenshots branch, and **P8, "the window your way"** (record 0060, SPEC §42; five commits, its paperwork written). I read each one's Help, words and keys, and searched every quoted name, path and menu item in the guide in all the trees; the only two not found verbatim are my own examples.

**Fixed:**
- **P8, on its branch:** Settings ▸ Layout (after Look, with two or more sections kept) puts the sections in an order of your own, and on the Mac chooses Today's parts, their column and their order, and on the iPhone which sections are on the tab bar; View ▸ Panels ▸ Sections puts a whole section beside the one on screen; a saved layout is Layout 1 to 5 (it was 1 to 3) and keeps what was in the middle; ⌃⌥1 to ⌃⌥5 use one. Changed: Panels, and your own layout; Today, and the status line; Settings, group by group; Every keyboard shortcut. If P8 does not ship, take those lines out.
- **The loan calculators:** in Mortgage, Car Loan and Converters on the Mac, Esc closes the calculator (on `main`).

**Matching:** all other names; Code notes' languages (Plain Text, JavaScript and TypeScript, Shell and the rest); the earlier fixes.

### The app's Editor theme is decided (2026-11-21, 15:20)

The app's builder (the chat "Stonefold — Editor theme build") sent its final colours, replacing the five terminal themes with one, "Editor": window #1B1E26, pane #1F2330, words #D5D9E4, quieter #A3ACC0, faintest #737B8E, accent and links #6CB2FF, on-accent #1B1E26, green #7CCF8A, chart series #6CB2FF, #5FC9C9, #F0A35E, #B48EF0, #F07FB0, #E6C86E and #7CCF8A; code keywords #C4A2F5, strings #8EDB9B, numbers #F4B47A, comments #A3ACC0; words in the system font, figures and Code notes in monospace, rounded corners. The site now uses the pane, quieter words and on-accent as they are; it keeps its own hairline (#333a4b), band card colours and orange for code and the headline word (the app's chart orange #F0A35E). The name and the count of nine are unchanged.

### Checked against the app again (2026-11-21, 15:00)

The app's `main` is now b29a280: "the window your way" (P8) is merged, so those guide pages now match `main`. The Editor theme is committed on its branch (fb9f3b9), not merged; its Help describes it as "slate, as a code editor is, with soft light words, a clear blue, and code and charts in several colours", and the guide's look page now says the same in American spelling. **P9, "one way to make and find anything"** (record 0061) has a committed plan and about sixteen uncommitted files: the command box would offer New Transaction for a line with an amount (the budget's Add sheet opens filled in, nothing saved until Add) and a new note of each kind, and would find events, reminders and transactions by what they say. Not in the guide yet; it is not committed.

### The whole-section guide tried and pulled; the old layout, denser (2026-11-21, 16:00)

The whole-section version (one page for each section, three panes, a front page of titles in columns; commits `c0829ed` and `a0b0c1c`, live for a short time) was not liked by the owner: "I don't like the new guide. Lets go back to the vertical, can we make the vertical more dense somehow?" Both commits are reverted, so the guide is again one page for each topic, with the list down the left and the page beside it, and the old addresses are the real ones again. The search index is again one entry for each page.

What changed instead, in the same shape (CSS and one count): body text 15px at 1.5, tighter heading and list margins, a compact list down the left with a count beside each section (13px rows, the current section open, scrolling by itself), a wider page (up to 50rem, in a 78rem frame), a smaller pager, and a front page of three columns of titles with their one line each instead of two. The words and the pages are the same. The Mac's way and the iPhone's are not put side by side. If the owner wants more, the next steps are that, and a front page of titles only.

### Every section open down the left, and a pager of sections (2026-11-21, 16:20)

The owner asked to keep the list down the left open "if the user opens it", and that it not use cookies. Remembering which sections a reader opened would need a cookie or browser storage and a script, which the site does not use, so instead every section is open on every page (plain `details open`, nothing remembered); on a phone the menu still opens the section you are in. The page you are on is highlighted, and a browser that supports `scroll-initial-target` (Chrome and Edge) scrolls the list to it; other browsers start the list at the top. A link ending in a fragment (`#here`) was tried to do the same in every browser and dropped: for a row near the end of the list it made the whole page jump down.

Under the pager of topics (Before and Next) is a pager of sections: "Previous section" and "Next section", each to the first page of that section (none before Getting started or after On the Mac).
