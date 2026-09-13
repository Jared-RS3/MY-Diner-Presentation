# Daybreak Proposal System

**Reference build: Kliya — Prototype & Technical Validation (DB-AIF-001 · V6)**

This is the house style for every Daybreak proposal. It documents how the Kliya
deck is built so the next one can be produced by copying three files, swapping a
data object, and writing new sections — without re-deciding type, colour,
spacing, print behaviour or navigation.

Read it as a spec, not a summary. Everything below is already implemented in
[index.html](index.html), [styles.css](styles.css) and [script.js](script.js).

---

## 1. What the format is

A **paged proposal** rendered as a scrolling website that prints to a clean A4
PDF from the same markup. Not a slide deck, not a scroll-jacked landing page.

| Property | Value |
| --- | --- |
| Delivery | Static site — no build step, no framework, no dependencies |
| Files | `index.html` · `styles.css` · `script.js` · `assets/` |
| Hosting | Netlify, `publish = "."` (see [netlify.toml](netlify.toml)) |
| Fonts | Inter only, weights 300/400/500/600, via Google Fonts |
| Page unit | One `<article class="proposal-page">` per section |
| Length | 10–14 pages. Kliya is 13. |
| Output | Screen deck + `window.print()` → A4 PDF, one section per sheet |

The whole thing is three files on purpose. A proposal must still open in a
browser in five years with no toolchain, and must survive being emailed as a
folder.

---

## 2. Design tokens

Defined once in `:root` at the top of [styles.css](styles.css#L8-L26). Never
hard-code a colour that has a token.

```css
:root{
  --paper:#f7f3ed;       /* warm paper */
  --paper-deep:#e8ded3;
  --ink:#111;            /* body text on light */
  --muted:#a1988e;       /* labels, secondary copy, quiet figures */
  --warm:#c99360;        /* THE accent — on dark backgrounds */
  --warm-deep:#a9743f;   /* the same accent — on light backgrounds */
  --dark:#070809;
  --dark-soft:#111315;
  --white:#f8f3ec;       /* body text on dark */

  --page-w:900px;
  --pad:clamp(30px,6vw,74px);
  --topbar-h:60px;

  --sans:"Inter","Helvetica Neue",Arial,sans-serif;
}
```

### Rules that hold the look together

1. **One accent, two values.** `--warm` on dark pages, `--warm-deep` on light
   pages. There is no second accent colour anywhere in the deck. Success/error
   colours do not exist here.
2. **One typeface.** Inter at four weights. Hierarchy comes from *size, weight,
   letter-spacing and case* — never from a display font.
3. **Uppercase + wide tracking = label.** Anything `letter-spacing:.14em–.30em`
   and uppercase is a label (eyebrow, page head, footer, section title). Body
   copy is sentence case with tight negative tracking (`-.01em` to `-.04em`).
4. **Tabular numerals on every figure.** `font-variant-numeric:tabular-nums` on
   money, hours, page numbers, dates. Columns of rands must align.
5. **Hairlines, not boxes.** Structure is drawn with 1px rules at 10–20% opacity
   and generous whitespace. Cards are rare and always flat.
6. **Light pages carry the argument; dark pages carry the weight.** See §4.

### Type scale

| Class | Use | Spec |
| --- | --- | --- |
| `.cover-title` | Cover headline only | `clamp(30px,4.1vw,58px)`, 400, uppercase, `-.04em` |
| `.contact-title` | Closing headline | `clamp(38px,4.8vw,64px)`, 400, `-.04em` |
| `.sec-num` | Giant ghosted section number | `clamp(48px,7.4vw,92px)`, 300, `--muted` |
| `.title` | Section heading (`h2`) | `clamp(27px,3.9vw,46px)`, 400, uppercase, `-.03em` |
| `.eyebrow` | Kicker above a heading | 10px, 500, `.18em`, uppercase, `--muted` |
| `.eyebrow.gold` | Accented kicker | same, accent colour |
| `.lead` | Opening paragraph | `clamp(15px,1.5vw,18px)`, 300, 1.62 |
| `.prose p` | Body copy | 15px / 1.7, `max-width:58ch` via `.measure` |
| `.fineprint` | Disclosures, caveats | 11px italic, `--muted`, `max-width:70ch` |

Measure is capped at **58ch** for prose and **70ch** for fineprint. Never let a
paragraph run the full 900px page width.

---

## 3. Page scaffold

Every section is the same five-part structure. Copy this block to start a new
page:

```html
<!-- 04 · SECTION NAME -->
<article class="proposal-page page-light" id="page-4"
         data-title="Quoted Phases" data-num="03">
  <header class="page-head">
    <span class="page-brand">DAYBREAK</span
    ><span class="page-tag">PROPOSAL<i></i>DB-AIF-001 · V6</span>
  </header>

  <div class="page-inner">
    <span class="sec-num">03</span>
    <p class="eyebrow">COMMERCIAL SUMMARY</p>
    <h2 class="title">What Is Quoted</h2>
    <span class="rule"></span>

    <!-- section content -->
  </div>

  <footer class="page-foot">
    <span>KLIYA · FIT INTELLIGENCE</span><span class="page-num">04 / 13</span>
  </footer>
</article>
```

- `data-title` → the side index label and the top-bar title. **Required.**
- `data-num` → the section number shown in the side index. Omit on Cover and
  Closing (they are not numbered sections).
- `.page-num` is rewritten by `script.js`, so the hard-coded `04 / 13` is only a
  fallback — but keep it accurate for anyone reading the source.
- The header/footer eyebrows repeat identically on every page. That repetition
  is the binding of the document; do not vary them per section.
- `min-height:1180px` on `.proposal-page` gives every section the same paper
  proportion on screen. Long sections grow; short sections stay full-bleed.

### The three page types

| Class | Background | Use |
| --- | --- | --- |
| `.page-light` | Warm paper gradient + soft peach radial | Default. Argument, scope, pricing detail, terms. |
| `.page-dark` | Near-black gradient + burnt-amber radial | Emphasis beats — process, totals, limitations, anything the reader must *feel*. |
| `.page-split` | Dark panel + light panel, side by side | Closing/contact page only. |

Add `.dark-glow` as the first child of a dark page for the blurred amber orb.
Light pages get their glow from the background gradient itself.

**Rhythm.** Do not put two dark pages next to each other unless the argument
demands it. Kliya's order is:

```
01 Cover        light
02 The Vision   light
03 Process      dark     ← first weight beat
04 Quoted Phases light
05 Phase 01     light
06 Phase 02     light
07 Investment   dark     ← the money
08 Third-Party  light
09 Limitations  dark     ← the honesty page
10 Support      light
11 Total        dark     ← the number
12 Acceptance   light
13 Closing      split
```

---

## 4. Component inventory

All of these already exist in `styles.css`. Reuse them before writing new CSS.

### Lists

```html
<ol class="numlist">          <!-- numbered, hairline-separated, accent numerals -->
  <li><span>01</span>Body Intelligence — structured measurements</li>
</ol>

<ul class="ticklist">         <!-- ring-and-dot bullets; .compact for tighter -->
<ul class="cols">             <!-- 2-column ring bullets; .tight .wide .dash -->
<ul class="ticklist dash">    <!-- en-dash bullets, no rings -->
<ol class="vtimeline">        <!-- circled numbers on a vertical rule (Process) -->
<ol class="steps">            <!-- large numbered rows (Acceptance) -->
```

On dark pages add `.dim` to soften list copy to `rgba(248,243,236,.8)`.

### Money and figures

| Component | What it is |
| --- | --- |
| `.cost-list` / `.cost-row` | Two-column line-item ledger: name + description left, figures right |
| `.cost-list.breakdown` | The same ledger rendered from data with hours + fee columns, `.sub` working lines and a `.total` row |
| `.ti-price` / `.ti-price-row` | Big bordered figure cards, `.alt` for the quieter one |
| `.ti-stack` | Horizontal build-up bar — phase segments sized by their share of the fee, with brackets underneath |
| `.ti-growth` | Stage columns with progress bars and figure rows (`.three`, `.four`, `.stack` variants) |
| `.tier-band` | Usage tier with calculation line and a stacked figure column |
| `.ms-stage` / `.ms-row` | Running-cost stages with a `.ms-total` line |
| `.sr-figure` | Rate/retainer figure block, `.alt` for the dashed alternative |
| `.price-card` | Summary card, `.solid` for the dark inverted version |

### Prose furniture

```html
<span class="rule"></span>                  <!-- 40px hairline under a heading -->
<div class="callout">                       <!-- arrow + note; .emphasis for accent -->
  <span class="co-mark">→</span>
  <p>Phase 02 begins only after Phase 01 has been approved in writing.</p>
</div>
<div class="term">                          <!-- one clause in .terms-cols; .feature to surface -->
  <h5>PAYMENT</h5><p>…</p>
</div>
<div class="sign-block">                    <!-- signature column in .sign-grid.three -->
<p class="fineprint">                        <!-- disclosure line -->
```

### Layout grids

`.vision-grid` (1.25/.75) · `.split-scope` (1.15/.85) · `.two-scope` (1/1) ·
`.resp-grid` (1/1) · `.why-grid` (3-up) · `.terms-cols` (2 columns) ·
`.sign-grid.three`. All collapse to one column at 820px.

### Imagery

- `.arched-image` — cathedral-arch crop, `aspect-ratio:3/4.1`, the only image
  treatment used for people.
- `.process-art` — full-bleed photo behind a dark page, masked with
  `linear-gradient(90deg,transparent 30%,#000 62%)` so text stays readable.
- `.editorial-rock` — clip-path stone plinth on the cover.
- `.device-frame` / `.device-screen` — the phone mockup is **built in CSS**, not
  a PNG, so the app UI inside it stays crisp and editable. The screen contents
  live under `.device-screen.klear` (`.k-*` classes) and are the one part you
  should expect to redraw per project.

Photography direction: warm neutrals, desaturated (`saturate(.8)`), soft
contrast. Every image is `aria-hidden` or `alt=""` — none of them carry meaning.

---

## 5. The data layer — the non-negotiable part

**No price, hour count or date is ever typed into the HTML.** All of it lives at
the top of [script.js](script.js#L15-L30) and is bound into the page at runtime.

```js
const proposalData = {
  clientName:  "Nolubabalo Nqakala",
  projectName: "Kliya",
  proposalDate:"27 August 2026",
  proposalValidityDays: 14,
  hourlyRate:  700,          // post-launch support rate
  currency:    "ZAR",
  companyName: "Daybreak",
  email:       "contact@daybreaktechinnovations.com",
  website:     "daybreaktech.agency",
  location:    "Cape Town, South Africa",
  startDate:   "27 August 2026",
  deliveryDate:"9 October 2026",
};

const buildRate = 1100;      // combined engineering hours × this = every fee
```

### How binding works

**`[data-fill]`** — text substitution.

```html
<b data-fill="client-name">Nolubabalo Nqakala</b>
<b data-fill="quoted-total">R168,300</b>
```

The HTML content is a fallback for a reader with JS off; `script.js` overwrites
it from the `fills` map. Add a new key to `fills` and it is available everywhere.

**`[data-lines]`** — the phase breakdown ledger renders itself.

```html
<div class="cost-list breakdown" data-lines="p1"></div>
```

Line items are declared once as `[name, hours, description]` tuples in
`phaseLines`. `script.js` renders each row, applies `buildRate`, adds the
sub-total and consolidation lines, and totals the phase. The narrative pages and
the commercial pages therefore **cannot disagree with each other**.

**`[data-stack-phase]` / `[data-stack-span]`** — the build-up bar segments are
sized from each phase's share of the quoted total, so the illustration is
arithmetically true by construction.

### Why this matters

A proposal goes through six or seven revisions. Hand-typed figures drift, and a
client who finds two different totals in one document stops trusting the whole
thing. Derive everything from hours × rate, in one place. When the scope
changes you edit `phaseLines` and the entire deck re-totals.

Superseded figures (the "why the investment changed" comparison) are the one
exception, and they are quarantined in a single `original` object with a comment
saying they may appear nowhere else.

---

## 6. Navigation and behaviour

[script.js](script.js#L364-L467) — about 100 lines, no library.

- **Side index** (`.sidenav`) built from each page's `data-num` / `data-title`.
  Labels expand on hover; the active item's tick extends and turns accent.
  Hidden below 1240px.
- **Top bar** — brand left, current section title + `03 / 13` counter centre,
  prev/next/print right. Fixed, blurred, dark.
- **Progress bar** — 2px accent fill across the top.
- **Scrollspy** — `IntersectionObserver` with `rootMargin:"-45% 0px -45% 0px"`,
  so a page becomes active when it crosses the middle of the viewport.
- **Reveal on enter** — children of `.page-inner` fade up 16px with a staggered
  delay, once, at 12% visibility. Wrapped in
  `@media (prefers-reduced-motion:no-preference)`.
- **Keyboard** — ↓/→/PageDown, ↑/←/PageUp, Home, End.
- **Print** — the PRINT / PDF button calls `window.print()`.

Footer page numbers are written by JS, so inserting or deleting a page never
requires renumbering by hand.

---

## 7. Print / PDF — treat this as a first-class output

Most clients read the PDF, not the site. The rules at the bottom of
[styles.css](styles.css#L657-L731) are the hard-won part; carry them over
verbatim.

```css
@page{size:A4;margin:10mm}
```

- Chrome (top bar, side index, progress) is hidden.
- Each `.proposal-page` becomes `display:block` with `break-after:page` and
  **`min-height:0`**. Do *not* force a full 297mm sheet height — that stretches
  short sections and pushes slightly-taller ones onto a near-blank second page.
- The cover is the exception: `min-height:262mm` so it fills its sheet.
- Decorative layers (`.cover-glow`, `.dark-glow`, `.split-glow`,
  `.editorial-rock`, `.phone-shadow`) are hidden — they cost ink and add nothing
  on paper.
- Print grids are declared **explicitly**, never inherited from the 820px screen
  breakpoint. The print viewport is ~794px, which is close enough to 820px to
  break by accident.
- `break-inside:avoid` on every self-contained unit: `.term`, `.phase`,
  `.cost-row`, `.sign-block`, `.callout`, `.why-point`, `.ti-stage`,
  `.price-card`, `.tier-band`, `.vtimeline li`, `.steps li`, `.cols li`.
- `break-after:avoid` on all headings and eyebrows — never strand a heading at
  the foot of a sheet.
- `p,li{orphans:3;widows:3}`.
- `print-color-adjust:exact` so the dark pages actually print dark.
- Reveal animations are forced to their final state.

**Always check the PDF before sending.** Print preview at A4, scale 100%,
background graphics on.

---

## 8. Responsive

| Breakpoint | What changes |
| --- | --- |
| ≤1240px | Side index hidden |
| ≤820px | Page height auto, padding drops to 34/26px, every multi-column grid collapses to one, cover and vision stack, split page stacks, print button becomes an icon |
| ≤480px | `.prepared` stacks, top-bar title truncates |

---

## 9. Voice

The design carries a tone, and breaking the tone breaks the design.

- **Plain, declarative sentences.** "Phase 02 begins only after Phase 01 has
  been delivered, reviewed and approved in writing."
- **Name the limits.** Kliya has an entire dark page for what the prototype will
  *not* prove. It is the most persuasive page in the document.
- **Say what a number is made of.** Every fee shows its hours. Every monthly
  estimate shows its calculation. Nothing arrives as a bare figure.
- **Never oversell a capability.** "Virtual Try-On is positioned as
  visualisation, not as scientifically proven physical-fit prediction."
- **Client owns the work.** Repository, data and IP framing is stated in the
  terms, not implied.
- **En dashes for ranges, `·` as the separator in labels, `—` for asides.**
  South African English (`organisation`, `recognised`).

---

## 10. Starting a new proposal

1. Copy `index.html`, `styles.css`, `script.js`, `netlify.toml` and `assets/`
   into a new repository.
2. Rewrite `proposalData` and `buildRate` in `script.js`. Update the document
   reference code (`DB-AIF-001 · V6`) — it appears in every `.page-tag` and in
   the closing panel.
3. Rewrite `phaseLines` and `phases`. Delete phases you do not have; the ledger,
   totals, build-up bar and payment structure all follow.
4. Update `<title>` and `<meta name="description">`.
5. Redraw the phone screen (`.device-screen.klear` → `.k-*` markup and styles)
   for the new product, or swap the cover stage for a different hero.
6. Replace `assets/` with the new project's photography. Keep the warm,
   desaturated grade.
7. Write the sections. Start from the §3 scaffold, reuse §4 components, and keep
   the light/dark rhythm from §3.
8. Renumber: `id="page-N"`, `data-num`, `.sec-num`, and the fallback
   `.page-num`. JS fixes the footers, but the source should read correctly.
9. Check the PDF at A4.
10. Deploy to Netlify — no build command, publish `.`.

### Checklist before sending

- [ ] Every figure in the deck derives from `script.js`; nothing is hand-typed
- [ ] Client name, dates and validity are correct in `proposalData`
- [ ] Document reference and version updated on every page
- [ ] The limitations / exclusions page exists and is honest
- [ ] Payment structure adds up to the quoted total
- [ ] PDF checked at A4 — no orphaned headings, no near-blank sheets
- [ ] Tested at 1280px, 820px and 390px
- [ ] All images have `alt=""` or `aria-hidden`
- [ ] `title`, `meta description` and contact links updated
