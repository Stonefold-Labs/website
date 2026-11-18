# Putting the site on the internet

Stonefold Labs' website was put up at stonefoldlabs.com on 2026-11-13. On 2026-11-18 the owner chose stonefoldapp.com as its main address (Part 9 is the move, and is not done yet). Mail stays at stonefoldlabs.com.

Written 2026-11-12.

**Where it stands (2026-11-13): live.** https://stonefoldlabs.com serves the three pages over HTTPS from the public repo `Stonefold-Labs/website` (branch `main`, folder `/docs`), and `scripts/check-live.sh` passes. Parts 1 to 6 are done, and Part 8 (the day the company exists) was done on 2026-11-17; Part 7 (the mailbox test) is still to do.

What differed from the plan below:
- **The organization.** Instead of a new one, the owner renamed his existing `Bellwether-Budget` organization to `Stonefold-Labs` (capitalised to match `Longline-Labs`). It also holds the private `bellwether` repo, now `Stonefold-Labs/bellwether`. GitHub ignores capital letters in names, so `stonefold-labs` below and `Stonefold-Labs` are the same organization; the `www` record still points at `stonefold-labs.github.io`.
- **The verification record** GitHub asked for is `_github-pages-challenge-Stonefold-Labs`.
- **Part 5** was done by Claude with GitHub's command-line tool on the owner's yes. The certificate was approved within a minute; **Enforce HTTPS** is on. For a few minutes some GitHub servers still showed the old certificate, and GitHub once answered with its own "503" error page; both cleared on their own.

Do the parts in order. Each part says who does it. Where it says "Claude, on your yes", open the website chat and say yes to that one step; nothing is pushed or created without it.

Button names in **bold** were read from GitHub's, Cloudflare's and Proton's help pages on 2026-11-12. A site can rename a button; if one isn't where this says, stop and ask in the website chat rather than guess.

**What you need:** your GitHub sign-in, your Cloudflare sign-in, your Proton sign-in. About 30 minutes of clicking, then a wait of a few minutes to a few hours for the secure certificate.

---

## Part 1. A GitHub organization for the company (you, 3 minutes) — done 2026-11-13

The site's files go in a public GitHub repo. Putting it in an organization named for the company keeps your personal user name out of the web address records. On 2026-11-12 the name `stonefold-labs` was free.

1. Go to github.com and sign in.
2. Click your profile picture (top right), then **Settings**.
3. In the left column, under "Access", click **Organizations**.
4. Next to the "Organizations" heading, click **New organization**.
5. Pick the **Free** plan.
6. Organization name: `stonefold-labs`. Contact e-mail: your own address at stonefoldlabs.com. Say it belongs to **My personal account** for now (it can be moved to the company once the LLC exists).
7. Finish the prompts. Skip inviting anyone.

Then tell the website chat: "the organization exists", and what you named it if not `stonefold-labs`. The name is used in Parts 3 and 4.

**The author on each commit (settled 2026-11-13).** Each saved change (commit) in a public repo shows its author. The owner chose "Stonefold Labs" with `support@stonefoldlabs.com`, the address already on the site. It is set for this repo only (`git config user.name` and `user.email` in this folder), and the commits made before the first push were rewritten to say the same.

## Part 2. Create the repo and push (Claude, on your yes) — done 2026-11-13

I run, from `Website/`:

```bash
gh repo create stonefold-labs/website --public --source . --remote origin --push
```

That creates one public repo, `stonefold-labs/website`, and uploads this folder. Nothing else on your Mac is touched. Anyone can then read these files on GitHub, which is fine: they are the public website and its notes.

## Part 3. Prove the domain is yours (you, 5 minutes) — done 2026-11-13

This stops anyone else on GitHub from claiming stonefoldlabs.com.

On GitHub:
1. Click your profile picture, then **Organizations**, then **stonefold-labs**.
2. Under the organization's name, click **Settings**.
3. In the left column, under "Code, planning, and automation", click **Pages**.
4. Click **Add a domain**.
5. Under "What domain would you like to add?", type `stonefoldlabs.com` and click **Add domain**.
6. GitHub shows "Add a DNS TXT record" with a name starting `_github-pages-challenge-stonefold-labs` and a long code. Leave this tab open.

On Cloudflare, in a second tab:
1. Go to dash.cloudflare.com, sign in, and click **stonefoldlabs.com**.
2. In the left column, click **DNS**, then **Records**.
3. Click **Add record**.
4. **Type**: `TXT`. **Name**: `_github-pages-challenge-stonefold-labs` (Cloudflare adds `.stonefoldlabs.com` itself). **Content**: paste the code from GitHub. Leave **TTL** on Auto.
5. Click **Save**.

Back on GitHub: wait a minute, then click **Verify**. If it says not yet, wait ten minutes and use the three-dot menu beside the domain, **Continue verifying**, then **Verify**. Keep the TXT record for good.

## Part 4. Point the domain at GitHub (you, 10 minutes) — done 2026-11-13

Still on Cloudflare ▸ stonefoldlabs.com ▸ **DNS** ▸ **Records**. You add nine records. For each: click **Add record**, fill in the row from the table, and click **Save**.

**For every one of the nine, set Proxy status to "DNS only".** It is the small cloud switch: orange means Cloudflare sits in front of the site and may add things to the pages; grey ("DNS only") means it only answers the address lookup. Grey is what the privacy page promises.

| # | Type | Name | Address or target | Proxy status |
|---|---|---|---|---|
| 1 | A | `@` | `185.199.108.153` | DNS only |
| 2 | A | `@` | `185.199.109.153` | DNS only |
| 3 | A | `@` | `185.199.110.153` | DNS only |
| 4 | A | `@` | `185.199.111.153` | DNS only |
| 5 | AAAA | `@` | `2606:50c0:8000::153` | DNS only |
| 6 | AAAA | `@` | `2606:50c0:8001::153` | DNS only |
| 7 | AAAA | `@` | `2606:50c0:8002::153` | DNS only |
| 8 | AAAA | `@` | `2606:50c0:8003::153` | DNS only |
| 9 | CNAME | `www` | `stonefold-labs.github.io` | DNS only |

`@` means the domain itself. Row 9's target is the organization's name from Part 1 followed by `.github.io`, with no repo name after it.

**Do not touch** the records already there: two MX records, the TXT records starting `v=spf1` and `protonmail-verification`, `_dmarc`, and the three `protonmail…_domainkey` CNAMEs. Those are your mail.

## Part 5. Turn on the site (you, or Claude on your yes; 3 minutes) — done 2026-11-13

On GitHub, in the repo `stonefold-labs/website`:
1. Click the **Settings** tab.
2. In the left column, under "Code, planning, and automation", click **Pages**.
3. Under "Build and deployment", set **Source** to **Deploy from a branch**.
4. In the branch menu (it says **None**), choose `main`. In the folder menu beside it, choose `/docs`. Click **Save**.
5. Under "Custom domain" it should already show `stonefoldlabs.com` (the file `docs/CNAME` sets it). If it is empty, type `stonefoldlabs.com` and click **Save**.
6. Wait for the "DNS check successful" tick. Then tick **Enforce HTTPS**. If the box is greyed out, the certificate isn't ready; come back in an hour. GitHub says it can take up to 24 hours.

I can do steps 3 and 4 from here with one command if you prefer; say so.

## Part 6. Check the live site (Claude, then you) — Claude's half done 2026-11-13

I run:

```bash
scripts/check-live.sh
```

It asks stonefoldlabs.com for each page and confirms that every one is byte-for-byte the file in `docs/`, that no cookie is set, that a missing page gets the "not here" page, and that `http://` and `www.` both end at `https://stonefoldlabs.com/`.

Then you: open https://stonefoldlabs.com on your Mac and your iPhone and read the three pages.

## Part 7. Test the mailbox (you, 5 minutes)

Mail already points to Proton (the records were checked on 2026-11-12).

1. From an address that is not at stonefoldlabs.com, send a message to `support@stonefoldlabs.com`.
2. See it arrive in Proton.
3. Reply from Proton. In the reply window, check that **From** says `support@stonefoldlabs.com`, not another address of yours.
4. See the reply arrive, and that it didn't land in spam.

**Your own address for Apple.** Apple's enrollment page says: "Your work email address needs to be associated with your organization's domain name." Use an address of your own at the domain (for example your first name), not `support@`, for the Apple Account that enrolls. To add one in Proton: open Proton Mail's settings, find **Addresses**, click **Add address**, choose your existing user, pick the domain `stonefoldlabs.com`, type the address and a display name, and click **Save address**.

## Part 8. The day the company exists (Claude, on your word) — done 2026-11-17

Florida approved Stonefold Labs LLC (document number L26000574352, filed 2026-11-12, status Active); the owner reported it on 2026-11-17 and said yes to this change. Done that day, in `Website/`:
- each page's footer gains a line with the year and "Stonefold Labs LLC" beside the wordmark (as longlinelabs.com's footer has), and the privacy page's "runs this website" line says "Stonefold Labs LLC";
- `COMPANY_FORMED` in `scripts/check.py` becomes `True`, after which the check fails if any page lacks the full name;
- **not done:** the full logo (the one that reads "STONEFOLD LABS LLC") may replace the mark and typed name in the header, once its words are turned into outlines so they look the same on every device (`README.md`, "The brand");
- the privacy page's date became 17 November 2026; commit, push, run `scripts/check-live.sh`.

Do this **before** enrolling with Apple. Apple checks that the website belongs to the legal company: "Your organization's website must be publicly available and functional, and its domain name must be associated with your organization."

## Part 9. Move the site to stonefoldapp.com (you, in one sitting; Claude pushes one change on your yes) — not done, planned 2026-11-18

On 2026-11-18 the owner bought `stonefoldapp.com` and said "Make it the main". After this part, https://stonefoldapp.com is the site, `stonefoldlabs.com` and `www.stonefoldlabs.com` send readers on to it (the same page, with the path kept), and **mail stays at `support@stonefoldlabs.com`**. The mail records (the two MX records, the `v=spf1` and `protonmail-verification` TXT records, `_dmarc` and the three `protonmail…_domainkey` CNAMEs) are never touched.

Parts 1 to 8 above say `stonefoldlabs.com` because that is the address they set up; they stay as the record of what was done.

### How long it takes, and what you will see

- **Steps 1 to 4 (you, about 40 minutes of clicking).** Nothing you can see changes. The old site keeps working the whole time. If `stonefoldapp.com` is registered somewhere other than Cloudflare, add the time the nameserver change takes: usually minutes, up to a few hours.
- **Steps 5 to 7 are the part you will see, and it has a gap.** GitHub serves a site at one custom domain only. The moment the new domain is switched on (step 5), `stonefoldlabs.com` stops being served; it very likely shows GitHub's "There isn't a GitHub Pages site here" page until the redirect works (step 7). `stonefoldapp.com` itself works over plain `http://` at once, but its padlock (HTTPS) waits for GitHub's certificate: usually 5 to 30 minutes, and GitHub says it can take up to 24 hours. Until the padlock is there, `https://stonefoldapp.com` shows the browser's "not secure" warning. So expect **about 30 minutes, possibly a few hours, where the site is half-down.** Nothing is lost and no data is involved: the site has no accounts and no readers' data.
- **Pick the hour well.** Do not do it while Apple is checking the website for the Developer Program enrollment (Part 8's reason): ask the website chat if that is happening. Apple's enrollment page asks for an email address associated with the organization's domain and a website associated with the organization; the email will be at `stonefoldlabs.com` and the website at `stonefoldapp.com`. Whether Apple accepts that is not confirmed from Apple's page; read it again before enrolling.

### Step 1. Put stonefoldapp.com in Cloudflare (you, 5 minutes plus any wait)

Ask yourself where you bought it. **At Cloudflare:** skip to step 2; it is already in the account. **Elsewhere:**
1. In Cloudflare, click **Domains**, then **Onboard a domain**. Type `stonefoldapp.com`, choose how to add the DNS records, and click **Continue**. Pick the **Free** plan.
2. Cloudflare lists the records it found. **Delete every record on `@` and `www` that the registrar added for a parked page**; they are replaced in step 3. Add no mail records. Click **Continue**.
3. Cloudflare shows two nameservers. Go to the registrar, find the domain's nameserver setting, and replace the registrar's nameservers with those two. If it shows DNSSEC on, turn it off first; Cloudflare can turn it on again once the domain is **Active**.
4. Wait until Cloudflare says the domain is **Active** (an email also arrives).

### Step 2. Prove to GitHub that the domain is yours (you, 5 minutes)

GitHub's own advice is to add the domain here **before** pointing its DNS at GitHub, so nobody else can claim it.
1. On GitHub, click your profile picture, **Your organizations**, **Stonefold-Labs**. Under the name click **Settings** (or the **...** menu, then **Settings**).
2. In the left column, under "Code, planning, and automation", click **Pages**. On the right, click **Add a domain**.
3. Type `stonefoldapp.com` and click **Add domain**. GitHub shows a TXT record: a name starting `_github-pages-challenge-Stonefold-Labs` and a code. Leave this tab open.
4. In Cloudflare, open **stonefoldapp.com**, then **DNS**, **Records**, **Add record**. **Type** `TXT`, **Name** `_github-pages-challenge-Stonefold-Labs` (Cloudflare adds `.stonefoldapp.com`), **Content** the code from GitHub, **TTL** Auto. Click **Save**.
5. Back on GitHub, wait a minute and click **Verify** (if it says not yet, use the **...** beside the domain, **Continue verifying**, then **Verify**). **Keep the TXT record for good.**

### Step 3. Point stonefoldapp.com at GitHub (you, 10 minutes)

Cloudflare, **stonefoldapp.com**, **DNS**, **Records**. Add nine records, each with **Proxy status** set to **DNS only** (grey cloud), exactly the table in Part 4 with this domain:

| # | Type | Name | Address or target | Proxy status |
|---|---|---|---|---|
| 1 to 4 | A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (one record each) | DNS only |
| 5 to 8 | AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (one each) | DNS only |
| 9 | CNAME | `www` | `stonefold-labs.github.io` | DNS only |

No wildcard (`*`) record, ever: GitHub warns it is a takeover risk. No mail records on this domain. At this point `stonefoldapp.com` points at GitHub but GitHub does not serve it yet, and the old site still works.

### Step 4. Tell the website chat "step 3 is done" (you, 1 minute)

Claude checks the records from here (`dig`, read only) and the TXT record, and says whether to go on.

### Step 5. Switch on the new address (Claude, on your yes; the gap starts here)

This is the one push, and it is yours to say yes to. Claude pushes one commit that changes `docs/CNAME` to `stonefoldapp.com`, and carries the other changes prepared in the repo: the live check's address, the docs, and one sentence on the Privacy page saying the old address is answered by Cloudflare, which only sends readers on (the page changes before the hosting does). It has been run through `scripts/check.py`.
Then you, on GitHub, in the repo **Stonefold-Labs/website**, **Settings**, **Pages**: **Custom domain** should show `stonefoldapp.com`. If it still shows `stonefoldlabs.com`, type `stonefoldapp.com` over it and click **Save**. Wait for the **DNS check successful** tick.

### Step 6. Wait for the padlock, then turn on HTTPS (you, a wait of minutes to hours)

Reload the Pages settings every few minutes. When **Enforce HTTPS** is no longer greyed out, tick it. If it is greyed out, GitHub has not finished the certificate; come back later (it says up to 24 hours; the first time, on 2026-11-13, it took a minute). Then open https://stonefoldapp.com and check that it shows a padlock and the site.

### Step 7. Send the old address on (you, 15 minutes; do it only once step 6 shows the padlock)

Redirecting before then would send readers to a "not secure" warning.
1. Cloudflare, **stonefoldlabs.com**, **DNS**, **Records**. **For the nine web records only** (the four A, four AAAA and the `www` CNAME from Part 4), click the grey cloud so it turns orange (**Proxied**), and **Save**. **Do not touch** the two MX records, the TXT records, `_dmarc`, the three `protonmail…_domainkey` CNAMEs, or the `_github-pages-challenge-Stonefold-Labs` / `…stonefold-labs` TXT record. Mail records are never proxied; a mail record turned orange would break the mail.
2. **Rules**, **Overview**, **Create rule**, **Redirect Rule**. Make two, each with **When incoming requests match** on **Wildcard pattern**:
   - Rule name `old address to stonefoldapp.com`. **Request URL** `http*://stonefoldlabs.com/*`. **Target URL** `https://stonefoldapp.com/${2}`. **Status code** `301`. **Preserve query string** on. Click **Deploy**.
   - Rule name `old www to stonefoldapp.com`. **Request URL** `http*://www.stonefoldlabs.com/*`. Everything else the same.
   If the wildcard option is not where this says, choose **Custom filter expression** with `(http.host eq "stonefoldlabs.com") or (http.host eq "www.stonefoldlabs.com")`, a dynamic **Target URL** of `concat("https://stonefoldapp.com", http.request.uri.path)`, status `301`, **Preserve query string** on.
3. Tell the website chat. Claude runs `scripts/check-live.sh`, which now checks that `stonefoldapp.com` serves every page exactly, that `http://`, `www.` and the old address all end at `https://stonefoldapp.com/`, that the old address keeps the path and the query, and that no cookie is set. Then you open https://stonefoldapp.com and https://stonefoldlabs.com/privacy/ on your Mac and iPhone.

### After it

- Send the app chat the new address for Help, About and the App Store URLs: `https://stonefoldapp.com/privacy` and `https://stonefoldapp.com/support`. Until the app is released nothing public points at them.
- The old GitHub verification of `stonefoldlabs.com` and its TXT record stay as they are: they keep that domain from being claimed by anyone else.
- If something goes wrong in step 5 or 6 and you want the old address back at once: change `docs/CNAME` back to `stonefoldlabs.com` (ask the website chat), and re-save the old domain under **Custom domain**. Nothing in the DNS for `stonefoldlabs.com` was changed before step 7.

Button names are from GitHub's and Cloudflare's help pages read on 2026-11-18 (the sources below). A site can rename a button; if one isn't where this says, stop and ask in the website chat rather than guess. Not confirmed from a help page: what GitHub shows on the old address during the gap, the wording of Cloudflare's free-plan button, and whether Apple accepts mail on one domain and the website on another.

## Later changes

Any change to the site: edit the files in `docs/`, run `python3 -I scripts/check.py`, commit, push. The live site follows within a minute or two. Then run `scripts/check-live.sh`.

When an app is released, its privacy policy goes on `/privacy/` and its help on `/support/`, each as a section with its own heading, from that app's approved draft (Notes' are in `Notes/docs/store/`). The check's word list in `scripts/check.py` is loosened only for claims house rules §4 then allows.

## Sources, read 2026-11-12

- Apple, program enrollment: https://developer.apple.com/help/account/membership/program-enrollment/
- GitHub, managing a custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub, verifying a custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- GitHub, publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub, what is GitHub Pages (the IP address log): https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub, creating an organization: https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch
- Cloudflare, create DNS records: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/
- Cloudflare, zone apex records: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-zone-apex/
- Cloudflare, single redirects: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/ (read 2026-11-18)
- GitHub, managing a custom domain and verifying a domain (the two pages above, read again 2026-11-18)
- Cloudflare, add a site: https://developers.cloudflare.com/fundamentals/manage-domains/add-site/ (read 2026-11-18)
- Proton, custom domains: https://proton.me/support/custom-domain

Not confirmed from a help page, so check on the screen: the exact words of Cloudflare's grey-cloud setting ("DNS only"), GitHub's plan picker for a new organization, and where **Addresses** sits in Proton's settings.
