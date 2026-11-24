# Questions buyers will ask: drafts for the owner (Batch 4, Part C, 2026-11-24)

Drafted by Sonnet from a brief of facts the site and `SPEC.md` already state, then checked sentence by sentence against `CLAUDE.md` and `SPEC.md` §6, and edited. Apple's pages were read on 2026-11-24 and their words checked against the pages themselves. **None of this is on the site.** Each answer is a claim, and goes up only on the owner's yes, word for word. "Who makes it?" is left out: a name on the site (R5) is his.

Where they would go: 1 to 7 in Questions' first group, "Before you decide"; 8 in "Using the app", before "Can I copy my events from Apple's Calendar?".

## 1. Why not use Apple's own apps?

You may not need to. Apple's own apps are free and come with your device, and if they do what you need, use them. Stonefold puts the calendar, reminders, notes, a budget, tools, and files in one app with one unlock, for $24.99 once, with no subscription, no AI, and no account. It keeps everything on your device, encrypted, and works offline, and if you turn on iCloud sync, each change is sealed on your device first, with a key only your devices hold. Apple's own page, "iCloud data security overview" (dated January 5, 2026, read November 24, 2026), says Calendars in iCloud are encrypted "in transit & on server" with the keys held by Apple, whether Advanced Data Protection is on or off, and that Notes and Reminders are end-to-end encrypted only when Advanced Data Protection is on.

- The page's name is a link to https://support.apple.com/en-us/102651 (a new outside link).
- Checked: Apple's table has Calendars "In transit & on server", key storage "Apple", in both columns; Notes and Reminders "End-to-end", "Trusted devices", only under Advanced Data Protection.

## 2. Does it connect to my bank?

No. Every transaction is typed by you, and on the Mac you can also paste rows into the budget's grid. There is no bank connection and no statement import, and nothing is added by itself. Stonefold has no account and we run no server, and nothing leaves your device unless you turn on iCloud sync. A bank connection would send your bank sign-in through a service in the middle.

## 3. Can I try it first, or get a refund?

There is no trial: Stonefold costs $24.99 up front, once, for iPhone, iPad, and Mac. Before you decide, the guide and How it works show every part. Refunds are handled by Apple, not by us, so we can't promise or give one. You ask Apple at reportaproblem.apple.com; Apple's page (published September 17, 2026) says a purchase "might be eligible for a refund" and to expect an update in 24 to 48 hours.

- "the guide" and "How it works" link to /guide/ and /how-it-works/.
- "reportaproblem.apple.com" links to https://reportaproblem.apple.com/ and "Apple's page" to https://support.apple.com/en-us/118223 (two new outside links).

## 4. Is it open source, and has anyone outside checked it?

Not yet. Today Stonefold is not open source, and no outside firm has reviewed it. For launch, we plan a design paper that sets out each key and where it lives, the passphrase settings, the file format, the seal used for sync, and what it protects against and what it does not. We also plan to open the code for the encrypted store, the encryption, and sync for anyone to read, with a small reader that opens your own saved copies on any computer. From the first release, a dated list of changes will name security fixes as such. Later, once sales allow, we plan an independent review by a known firm, published in full, before the whole app's code is opened.

- From `../Stonefold/ONE-APP-PLAN.md` §18, R6 to R9, decided "Yes, as recommended" (2026-11-22). Once this is on the site, each line is a public promise; R7 still waits on a lawyer for the licence.

## 5. Does one purchase cover my family?

Apple's page says "App developers determine if an app can be shared within Family Sharing", so this is the owner's choice in App Store Connect, not yet made. Two versions:

- (a) If he turns it on: "Yes, if Share My Purchases is on for both of you. People in your Apple family group can use Stonefold too." (Apple's page support.apple.com/en-us/111114, published September 17, 2026.) The check refuses the word "sharing" until sharing ships, so this version avoids it; if he wants Apple's name for it, the check needs one exception, on purpose.
- (b) If not decided: "One purchase covers your own iPhone, iPad, and Mac. Whether it covers a family is not settled yet."

## 6. Which iPhones, iPads, and Macs does it run on?

Any iPhone with iOS 26 or later, any iPad with iPadOS 26 or later, and any Mac with macOS 26 (Tahoe) or later. Apple lists which devices run each on its own support pages. One price covers all three.

- No model is named (`CLAUDE.md`). Linking Apple's three lists is possible (three more outside links); left out unless he wants them.

## 7. Can I share it with my partner?

No. Stonefold keeps one person's things, and there is no way to give another person access to your calendar, notes, or budget from inside the app. iCloud sync keeps your own devices matching, through your own iCloud. You can export your calendar as a calendar file other apps open, or your notes as text files.

- `SPEC.md` §6 plans sharing for later, and the site's rule is that nothing is said about sharing until it ships. "No." is true today and hints at nothing; whether to say "Not yet." instead is his.

## 8. Can I bring my things from other apps?

Yes, most of it. For the calendar, copy your events once from Apple's Calendar (Settings, then Bring Mine Over: Calendar), or bring in a calendar file ending in .ics. For reminders, copy your lists once from Apple's Reminders (Bring Mine Over: Reminders). For notes, bring in a folder of plain text files (Bring In Notes…), and bring in flashcards from Anki or Quizlet files. For Files, send a document from another app to Stonefold, or scan pages with the iPhone's camera. The budget is typed by you, and on the Mac you can paste rows into its grid; there is no bank or statement import. Nothing stays linked to the other app, and nothing in it is changed.
