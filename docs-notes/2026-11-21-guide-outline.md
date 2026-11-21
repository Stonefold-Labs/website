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
