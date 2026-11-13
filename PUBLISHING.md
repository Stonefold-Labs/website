# Putting stonefoldlabs.com on the internet

Written 2026-11-12.

**Where it stands (2026-11-13): live.** https://stonefoldlabs.com serves the three pages over HTTPS from the public repo `Stonefold-Labs/website` (branch `main`, folder `/docs`), and `scripts/check-live.sh` passes. Parts 1 to 6 are done; Part 7 (the mailbox test) and Part 8 (the day the company exists) are still to do.

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

## Part 8. The day the company exists (Claude, on your word)

Tell any Stonefold chat that the state has confirmed Stonefold Labs LLC. Then, in `Website/`:
- each page's footer gains a line with the year and "Stonefold Labs LLC" beside the wordmark (as longlinelabs.com's footer has), and the privacy page's "runs this website" line changes to "Stonefold Labs LLC";
- `COMPANY_FORMED` in `scripts/check.py` becomes `True`, after which the check fails if any page lacks the full name;
- the full logo (the one that reads "STONEFOLD LABS LLC") may then replace the mark and typed name in the header, once its words are turned into outlines so they look the same on every device (`README.md`, "The brand");
- the privacy page's date changes; commit, push, run `scripts/check-live.sh`.

Do this **before** enrolling with Apple. Apple checks that the website belongs to the legal company: "Your organization's website must be publicly available and functional, and its domain name must be associated with your organization."

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
- Proton, custom domains: https://proton.me/support/custom-domain

Not confirmed from a help page, so check on the screen: the exact words of Cloudflare's grey-cloud setting ("DNS only"), GitHub's plan picker for a new organization, and where **Addresses** sits in Proton's settings.
