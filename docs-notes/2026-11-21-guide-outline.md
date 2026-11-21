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
