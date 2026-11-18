# Brief for an app chat: real screenshots for stonefoldapp.com (from the website session, 2026-11-18)

The owner (2026-11-18, website chat): "Can we add real screenshots throughout?"

The website chat may not build or run the app (its CLAUDE.md), so these have to come from an app chat. What exists today is not usable:
`~/Library/Developer/Xcode/DerivedData/Stonefold-pictures.noindex/website/` was made 2026-11-16, before the new look. It shows the old plain
look, the Mac pictures are drawn off screen with no window and a black bar where the sidebar's chosen row is, and the iPhone's tab bar and
icons predate the themes. A visitor would see an app that no longer looks like that.

## What the site needs

Five pictures, then optionally the same five in a second theme. Each goes beside its section on Home (calendar, reminders, notes, budget)
and the security band. Made-up data that reads like a real household: no "Made-up" in any name, no real names, no stand-in icon, no test
warning (the Mac's "no password" one), no price of the app itself in view. A bill like "Electricity $86.40" is fine.

| # | Picture | Device | Notes |
|---|---|---|---|
| 1 | Calendar: the month, a day chosen, with an event, a reminder and a bill on that day (Reminders on the Calendar and Bills on the Calendar both on) | Mac, a real window | title bar and shadow, window about 1,320 points wide |
| 2 | Reminders: Today, a bill waiting above the day's reminders | iPhone | simulator's own screen, usual text size |
| 3 | Notes: the list with search above it and a note open with a checklist | Mac, a real window | |
| 4 | Budget: Home, the headline and the three answers | iPhone | "Can I Afford It?" can be a second picture |
| 5 | Security: Settings > What Leaves This Device, top of the page (only when signed builds exist and the owner approved its words), or the recovery sheet with made-up codes | iPhone or Mac | optional until then |

## Theme
The site's own default look is Sage (dark) on a dark device and Linen (light) on a light one, and a reader can pick any of the eight.
Ask for **Linen** (light) and **Sage** (dark, the app's default) of each. Then the page shows the one that matches the reader's theme
(`<picture>` with `<source media="(prefers-color-scheme: dark)">`; `scripts/check.py` already allows `<source srcset media>`). If only one set is
possible, make it Linen: the site's rule is light appearance, normal text size.

## Format
JPEG, sRGB. Mac: 2x of the window, about 2,640 pixels wide; iPhone: the simulator's 1170 x 2532. Name them
`calendar-linen.jpg`, `calendar-sage.jpg`, `reminders-linen.jpg` and so on. Leave them OUTSIDE both repos (as before) and tell the website chat
the folder. The website chat runs each through `scripts/strip-jpeg.py` (Exif, XMP and comments out; `scripts/check.py` refuses them otherwise),
looks at every one, and gives each `alt` text saying what is on screen.

## Timing
The dispatch chat's plan (2026-11-18): an app chat takes these after the panels and logo work are installed, so the pictures show the new icon and panels. Nothing on the site waits on this; the pictures are drawings until then.

## Needs the owner
A real Mac window needs the app running under his eye, or his leave for a chat to take a picture of his screen (SPEC.md section 717).
