# Design notes from three public sites

These are ideas gathered on 2026-11-21 from three public sites, with no words or pictures copied.

How these were read: the fetch tool returns page text and image descriptions only. It does not show type, colour, spacing or widths. Each site's typography line below says so. Judge those by eye in a browser before acting on them.

## ProjectionLab (retirement and financial planning)

Pages read: home, Monte Carlo, cash flow, pricing. The "/features" path is a 404, so feature pages were found through the home page's card grid.

**Layout.** The first screen has a nav, a short headline, a one-line promise, one button, and a large chart picture over a soft gradient. A strip of six small outside logos follows. The page is one long column, reported as light and image-led.

**Section rhythm.**
- Four feature rows in a row, each about one screen. Each has a short heading, one or two sentences, two to four bullets, a button, and a picture. The picture changes sides row to row.
- Then a grid of nine uniform cards, each a title and one line, each linking to a deeper page.
- Then a testimonial wall of about twenty quotes, the longest block (about three screens), ending in a "load more" button.
- Then a heavy footer with a disclaimer of about 200 words. There is no closing call-to-action band. The button repeats at the end of each row instead.

**Showing a complex product simply.** One sentence in the hero. Short bullets under each feature. Pictures carry the detail. A hard idea (chance of success) is shown as one big percentage in the hero picture, not explained. The backtesting row sets a tidy assumption against messy real returns, which makes it click.

**Demos.** None seen. All pictures are still images.

**Type and colour.** Not readable from text. The nav is a logo, four text links, a plain sign-in link, and one filled button.

**Privacy and trust.** The pricing page has a short "Privacy matters" block of about 30 words, in the middle of four value blocks. It states the business model in contrast to ad-funded apps. It rests on copy and a founder-led story, with no badges. On the home page the point is only a bullet and one testimonial. Policy and security links sit in the footer.

## Notion (notes and workspace)

Pages read: home and the features page. The "/product/notes" path is a 404, and the nav has no notes, docs or calendar page, so the features page stands in.

**Layout.** A sticky top bar with a product menu of three tiles, then a large headline, a one-line subhead, a main button and a quieter second button. A row of rounded pictures and a play control sit below. Then comes a wall of about twenty single-colour customer logos.

**Section rhythm.**
- Three feature blocks, each with a short heading, one line, a link, and several pictures. These are the longest parts.
- A compact grid of four scenario links.
- Three quote cards.
- A repeating band of five proof points, which looks like a ticker.
- A single centered closing quote and the footer.
- The features page repeats one pattern three times: a verb-led heading with a full stop, one line, a picture, and a grid of nine text-only cards linking to help articles.

**Showing a complex product simply.** Three verbs act as the whole map of the product. Concrete scenarios, such as sorting feedback, are the entry points. Card titles are plain words, each with one line beneath.

**Demos.** A play control in the hero and animated clips in each section. Nothing a reader can operate.

**Type and colour.** Not readable from text. Headings are short and end with full stops. The nav is a menu with feature tiles.

**Privacy and trust.** The home page has none beyond footer links and named customers. The features page has a security band of twelve text cards (about 100 words) that names standards, encryption at rest and in transit, and a no-training default. It sits last, just before the closing quote. The detail makes it believable, but it is the sort of claim we cannot make.

## Thunderbird (email, calendar and notes)

Pages read: home and About. The features page and a "why" page do not exist, and the desktop product page returned 403.

**Layout.** A very bare nav with two text links. The first screen shows the name, five floating logos of other mail services, and the first heading and promise. It is a single column with wide background images.

**Section rhythm.** Five or six short sections, each with a "Freedom" heading, a short claim line, and 40 to 55 words. The longest holds five testimonial blocks with round portraits. The closing block is a question headline with a long row of download links, a "free" line and a donate link. Then a newsletter prompt and a row of social links.

**Showing a complex product simply.** One promise: messages, calendars and contacts in one app. The other logos imply a comparison without a table. Screenshots carry no labels.

**Demos.** None. A donation widget is embedded, and a small notice covers the case where a browser blocks it.

**Type and colour.** Not readable from text. Headings have two levels: a large heading and a smaller claim line.

**Privacy and trust.** This is the clearest example. The About page puts a values card first. It has a blunt headline ("You are not the product"), then four checkable bullets of about 60 words: nothing collected unless asked, protected, never sold, user in control. A link goes to the full policy. Belief comes from specifics, an open-source licence, an elected council, a plain statement of who owns the company and how it is funded, and named people with job titles. On the home page the trust section is one block of about 55 words with a link to About.

## Ideas to borrow

- Give each Home section row one anatomy: short heading, one or two sentences, two or three bullets, one drawing, with the drawing swapping sides by CSS grid order. Suits Home's four sections (Calendar, Reminders, Notes, Budget).
- Name the product's map in three short verbs with full stops, one line each. Suits Home's "how the sections work together" block.
- Make a plain card grid of title plus one line, each card an anchor link, no icons. Suits Support's topic index and a "what is inside" strip on Home.
- Show a hard idea as one simple figure with one caption, not prose. Suits Home's encryption band: a drawing of three files and one lock, with a caption beneath (drawings carry no words).
- Put trust in three short cards: a plain title, one tagline, three or four checkable bullets, then a link to the full page. Suits Home's band on encryption, privacy and security, linking to Privacy.
- State how the company is paid next to the privacy statement, in two plain sentences, as the pricing page of ProjectionLab does. Suits Home's price line and the Privacy page.
- Say who is accountable: legal name, state, document number, contact, and a link to the policy, with no photos. Suits Home's company band and the Privacy page.
- Use a two-column "stays here" and "can leave" comparison in CSS grid, the way the backtesting row sets tidy against messy. Suits Home's "what can leave with you" block.
- Put a row of anchor links under the intro of long pages, so a reader can jump. Suits Privacy and Support.
- End Home with one question as the closing heading and two links. Suits the foot of Home.
- Use the details/summary element for short answers under a topic card, so Support reads as a card grid that opens in place. Suits Support.
- Keep the nav nearly bare, as Thunderbird does: few links, one filled button. Suits the rail and top-left mark on every page.

## Ideas we cannot use

- Testimonial walls, quote cards and "load more" buttons. They need script, and we have no quotes to show.
- Strips of outside logos, press badges, Product Hunt badges, floating logos of other products. They are outside pictures and imply endorsements.
- Hero video, play controls, animated clips, moving picture rows, looping proof bands. All need video or script.
- A product mega-menu that opens on hover or click. It needs script. The rail does this job.
- Newsletter sign-up, donation widgets, cookie-setting controls, embeds. They are forms or outside embeds. We set no cookies.
- Screenshots as the proof. They are on hold, so drawings stand in.
- Photo grids of staff or council members. They are pictures of people and personal details.
- Standards and compliance cards (named certifications, audits, regulation lists, encryption cipher names). House rules limit what may be claimed, and nothing here is audited.
- Pricing tier cards and a "most popular" tag. There is one price.
- Download links for many systems and a "free forever" line. The store link is added on launch day, once there is one.
- Naming other products to compare against.
- A 200-word legal disclaimer. Our trust rests on short, true statements.
- Heading, font or colour choices copied after a quick look. Typography was not read here, and our palette and system fonts are the owner's.

## What the launch version took from these notes (2026-11-21)

- **One anatomy for a feature row.** A short heading, a sentence or two, two to four short points and one drawing, the drawing switching sides from row to row (the feature pages).
- **A plain card grid with a sign, a title and a line**, each linking on: Home's "Everything in one app", "What to know first", and the features index.
- **The three beliefs as three short cards** in "What to know first" on Home (offline, encrypted on the device, sync as a choice), each linking to its place on How it works.
- **"Stays here" beside "can leave"** as a two-column comparison on How it works, with one drawing for each hard idea (offline, sealed before it leaves, one folder to take away).
- **Who is accountable and how the company is paid**, in two plain sentences in About on Home: the legal name, the one price, and no ads or subscription.
- **A row of jump links** under the opening of How it works and Support, and short answers that open in place (details and summary, no script) on both.
- **A closing question and two links** at the foot of Home and How it works.
- **Not taken:** the "Try the window" demo. The owner asked on 2026-11-21 for that section to go, so Home no longer carries it, and `docs/demo.js` and its styles are gone from this branch.
