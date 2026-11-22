# Shubh Vivah · Dr. Paras & Dr. Pooja — wedding website

A static, mobile-first digital invitation with a **reply card** (RSVP) that writes to a Google Sheet.
All artwork is digital SVG/CSS (jharokha doors, arch, jaali, lotus border, Ganesh ji line art). No scanned images are used. The whole site is about 400 KB.

```
docs/                    ← the website (GitHub Pages serves this folder)
  index.html
  assets/css/style.css
  assets/js/config.js    ← the only file you normally edit
  assets/js/app.js
  assets/img/            ← SVG artwork + og.jpg (WhatsApp preview)
apps-script/Code.gs      ← paste into Google Apps Script (reply card → Sheet)
```

## How the page works

1. **Opening.** Jharokha doors open onto Ganesh ji. They open on their own after about 3 seconds, or when tapped.
   The doors are skipped for links ending in `#rsvp` and for anyone who has already seen them or replied on that phone.
2. **Compact invitation.** Ganesh ji, शुभ विवाह, the names, the date, "you & your family are cordially invited" and the days left.
3. **Reply card (उत्तर-पत्रिका),** already visible on the first screen. Its fields are:
   - arrival day (tap)
   - how many people (tap)
   - children
   - name
   - optional: mobile, arrival time, blessing

   An "Unable to come? Send your blessings" link records a polite decline.
   A slim "Kindly reply by 30 Nov" bar appears only while the card is off-screen and unanswered.
   On a later visit from the same phone, guests see "✓ We have your reply" with a **Change reply** button.
4. Below the card follow the full invitation and lineage, the day-wise programme with map and calendar links, Nani ji's blessing and the family names.

**Language:** English by default, Hindi on the toggle. The choice is kept in the URL, so you can share
`…/?lang=hi` with Hindi-preferring relatives and the bare link with everyone else.

---

## 1. Connect the Google Sheet (about 5 minutes; no keys or passwords to share with anyone)

1. Create a new Google Sheet in your account, e.g. **"Paras–Pooja replies"**.
2. **Extensions → Apps Script**. Replace the sample code with all of `apps-script/Code.gs` and save.
3. Choose **`setup`** in the function dropdown and press **Run**. Authorise it with your account.
   On "Google hasn't verified this app", choose *Advanced → Go to … (unsafe)*. It's your own script, touching only this sheet.
   This creates an `RSVPs` tab and a live `Summary` tab, which shows:
   - families coming, total guests, adults and children
   - families unable to come
   - arrivals by date
4. **Deploy → New deployment → ⚙ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (guests must not need a Google login)
   - **Deploy**, then copy the **Web app URL** (ends in `/exec`).
5. Paste it into `docs/assets/js/config.js` → `rsvpEndpoint: 'https://script.google.com/macros/s/…/exec'`.

Until then the form runs in **preview mode**: it works, but tells you nothing was saved.

> After editing `Code.gs`: **Deploy → Manage deployments → ✎ → Version: New version → Deploy**. This keeps the same URL.

**Columns:** submitted at (IST), attending (Yes/No), name, mobile, arrival date, arrival time, total guests, adults,
children, blessing, language, submission ID. The ID is used to drop accidental double-sends.
If a family changes their reply, a new row is added. The newest row is the current one.

## 2. Things to check in `config.js`

- `replyBy`: the "kindly reply by" date (currently **30 Nov 2026**).
- `venues`: map links. Exact pins (from Google Maps → Share) are set for the wedding venue and the baraat stay:

  | key            | place |
  |----------------|-------|
  | `vintageGreen` | Vintage Greens Banquet Hall, Rampur Road, Haldwani (wedding venue) ✓ exact pin |
  | `sapphire`     | Hotel Blue Saphire Countryside, Rampur Road, Haldwani (baraat stay) ✓ exact pin |
  | `ananya`       | Hotel Ananya Regency, Ramnagar Road, Kashipur (Haldi/Mehendi pool; Sangeet & reception), Maps search |
  | `residence`    | R. K. Hospital, Ramnagar Road, Kashipur (residence, Bhaat, baraat departure), Maps search |

## Two links

| Link | Shows |
|------|-------|
| `https://staryash.github.io/paras-weds-pooja/` | Everything, 3–6 Dec (with Haldi & Mehendi) |
| `https://staryash.github.io/paras-weds-pooja/?v=2` | Wedding, baraat return and reception only, 4–6 Dec |

Add `&lang=hi` (or `?lang=hi` on the first link) for Hindi. The `?v=2` page doesn't say anything was left out,
and its Share button and language toggle keep `v=2`.

## 3. Publish on GitHub Pages

```bash
cd wedding_invite_form
git init && git add docs apps-script README.md
git commit -m "Wedding website"
gh repo create paras-weds-pooja --public --source=. --push
```
On GitHub: **Settings → Pages → Deploy from a branch → `main` / `/docs` → Save**.
Live at **https://staryash.github.io/paras-weds-pooja/** within a minute or two.

The `git add` above leaves out the scanned card PDF and photo in this folder, so they stay off the public repo.

If you use a different repo name or a custom domain, update:
- `docs/index.html` → `<meta property="og:image">` (it must be an absolute URL for WhatsApp previews)
- `docs/assets/js/config.js` → `siteUrl`

**Custom domain later:** add `docs/CNAME` containing the domain, then point DNS at GitHub Pages:
a `CNAME` record to `staryash.github.io`, or GitHub's A records for an apex domain. Then enable **Enforce HTTPS**.

## 4. Test locally

```bash
cd docs && python3 -m http.server 8000   # http://localhost:8000/?lang=hi
```
To see the doors again after you've opened them, use a private window, or clear the site data.
