# AWC — Master Demo Email

A single "kitchen-sink" email that exercises **every module** in the AWC email design
system. This is a **component showcase** for design/system sign-off before template
build — not a live campaign. All copy and imagery are placeholders.

- **Index / launcher:** [`index.html`](index.html) — landing page linking every template with its core-module list, plus a full **component matrix** (components × email types; ● core · ○ optional · – not used), a **technical & platform** summary (SFMC build + client support), and the **steps to add the templates to SFMC**.
- **Master 600px:** [`awc-master-demo.html`](awc-master-demo.html) — the safe-default kitchen-sink build.
- **Master 640px:** [`awc-master-demo-640.html`](awc-master-demo-640.html) — wider-desktop A/B variant + **component source** for all templates.
- **Templates:** [`newsletter.html`](newsletter.html) · [`solus.html`](solus.html) · [`appeal.html`](appeal.html) · [`webinar-invite.html`](webinar-invite.html) · [`event-invite.html`](event-invite.html)
- **SFMC build kit:** [`sfmc/`](sfmc/) — 2 Content Builder templates (slots + blocks) + 15-module block library + 5 starter emails, per the agreed *2-template* architecture. See [`sfmc/README.md`](sfmc/README.md). Regenerate with `node .claude/build-sfmc.js`.
- **Visual reference:** [australianwildlife.org](https://www.australianwildlife.org) — photography-led, warm-but-serious conservation tone, orange CTA accent.

## Template set (assembled from the matrix)

The five send-type templates are **generated from the 640px master**, reusing the exact
same module blocks — each includes only its **core (●)** modules per the component
matrix. The build is scripted so the templates stay in sync with the master:

```bash
node .claude/build-templates.js   # regenerates the 5 templates + index.html
```

| Template | Purpose | Core modules included |
|---|---|---|
| **Newsletter** | Regular supporter update | Header, Hero banner, Hero+copy, Intro, Single-column story ×2, Two-column story ×2, Feature, Image+caption, CTA banner, Divider, Footer *(extended with extra field stories)* |
| **Solus** | Single-subject editorial | Header, Hero+copy, Intro, Statistics, Single-column story, Feature, Image+caption, Pull quote, CTA banner, Divider, Footer |
| **Appeal** | Fundraising send | Header, Hero+copy, Intro, Statistics, Pull quote, CTA banner, Donation appeal, Divider, Footer |
| **Webinar Invite** | Online event invitation | Header, Hero banner, Hero+copy, Intro, Image+caption, Event details, Webinar speaker, CTA banner, Divider, Footer |
| **Event Invite** | In-person / hybrid invitation | Header, Hero banner, Intro, Event details, CTA banner, Divider, Footer |

Optional (○) and not-used modules from the matrix are omitted. To add an optional
module to a template, add its key to that template's `order` array in
[`.claude/build-templates.js`](.claude/build-templates.js) and re-run. Because every
template is pure-concatenation of the master's blocks, **mobile stacking behaviour is
identical** to the master.

## Preview locally

```bash
# from this folder
node .claude/static-server.js      # serves on http://127.0.0.1:4599
```
Open `http://127.0.0.1:4599/`. Resize the browser below ~600px to see the mobile
(single-column / 2×2) behaviour. For real-world QA, send via SFMC and test in
Litmus/Email on Acid (esp. Outlook 2016–2021 + Gmail app).

## Desktop width variants (A/B)

Two builds are provided so AWC can compare desktop widths. **SFMC imposes no width
limit** — 600px is a design convention, not a platform constraint. The binding factor
is Outlook on Windows (Word engine + fixed reading pane), which clips/scrolls — it
won't scale down — beyond its preview width, and shows a "wide message" warning that
can truncate images above ~630px.

| Variant | Body width | Mobile breakpoint | Use it when |
|---|---|---|---|
| `awc-master-demo.html` | **600px** | `≤600px` | Default. Bulletproof across all clients incl. heavy Outlook audiences. **Recommended.** |
| `awc-master-demo-640.html` | **640px** | `≤640px` | Slightly more spacious, photography-forward feel. Still widely considered safe, but test in Outlook on Windows before committing. |

Both are byte-for-byte identical except the container width, the responsive
breakpoint, and proportionally-scaled image slot dimensions. **Mobile rendering is
identical** (fluid 100% in both). Don't exceed 640px without thorough Outlook QA.

For extra spaciousness without the Outlook risk, the better lever is keeping the body
at 600px while letting hero images and colour blocks run **full-bleed at 100%** — which
both builds already do.

## Brand tokens (as built)

| Token | Value | Use |
|---|---|---|
| Orange (primary) | `#E1670F` | CTAs, accents, brand rule, stat figures |
| Orange (button text on white) | `#C4560B` | text on inverted buttons |
| Deep forest green | `#233027` | footer, pull-quote band |
| Hero scrim base | `#3A4232` / `#5C6750` | hero fallback fills |
| Photo-placeholder fill | `#6E7B5B` | stand-in for wildlife photography |
| Ink (headings) | `#23281F` | headings |
| Body text | `#4A4A4A` | paragraphs |
| Warm cream | `#F6F2EA` / page bg `#EDE8DE` | section banding rhythm |
| Divider rule | `#E7E0D2` | hairlines |

**Type:** brand sans `Poppins` (headings, via web-font link — Apple/iOS/some webmail
only) → falls back to **Arial/Helvetica** everywhere else; body uses
`'Helvetica Neue', Arial, Helvetica, sans-serif`. No layout depends on the web font
loading.

## Module map — [EDITABLE] vs [FIXED] and optionality

Section comments in the HTML mark each module and its editable regions (these map
directly to SFMC Content Builder slots).

| # | Module | EDITABLE / FIXED | Optional? | Mobile behaviour |
|---|---|---|---|---|
| 1 | Header | **FIXED** brand (logo, brand rule). *Editable:* "View in browser" link | No | — |
| 2 | Hero Banner | **EDITABLE** (image, headline, subhead, CTA) | No | Headline scales (`.h-hero`); dark scrim guarantees overlay contrast |
| 3 | Hero Image + Copy | **EDITABLE** | No | Single column |
| 4 | Intro Section | **EDITABLE** | **Yes** | Single column |
| 5 | Statistics / Impact | **EDITABLE** content, **FIXED** 4-cell layout | No | 4-across → **2×2** |
| 6 | Single-Column Story | **EDITABLE** | No | Single column |
| 7 | Two-Column Story | **EDITABLE** (repeatable cards) | No | 2-col → **stacked** |
| 8 | Feature Article | **EDITABLE** | No | Single column |
| 9 | Image with Caption | **EDITABLE** | **Yes** | Single column |
| 10 | Pull Quote / Testimonial | **EDITABLE** | **Yes** | Single column |
| 11 | CTA Banner | **EDITABLE** | No | Full-width CTA |
| 12 | Donation Appeal | **EDITABLE** (incl. suggested-amount chips) | **Yes** | Chips wrap to 2×2; CTA full-width |
| 13 | Event Details | **EDITABLE** | **Yes** (campaign-specific) | Single column |
| 14 | Webinar Speaker | **EDITABLE** (repeatable per speaker) | **Yes** (campaign-specific) | Photo centres, text stacks below |
| 15 | Section Divider | **FIXED** brand element | n/a | Shown twice (plain rule + motif) for spacing rhythm |
| 16 | Footer | **FIXED** (logo, Acknowledgement of Country, compliance). *Editable:* quick links, social, address | No | Links gain tap spacing |

**Recommended-optional in final templates:** #4 Intro, #9 Image w/ Caption,
#10 Pull Quote, #12 Donation Appeal, #13 Event Details, #14 Webinar Speaker. Build
each as a toggleable Content Builder block so editors add/remove per send.

## Responsive / accessibility decisions

- **Single source, mobile-first.** One HTML; `@media (max-width:600px)` handles all
  stacking. No separate mobile file.
- **Multi-column stacking** via fluid-hybrid `inline-block` + MSO ghost tables, so
  Outlook keeps columns while modern clients stack: stats → 2×2, two-col story →
  stacked, speaker → stacked, donation chips → wrap.
- **CTAs** are bulletproof buttons: VML `<v:roundrect>` for Outlook + styled `<a>`
  elsewhere. Full-width on mobile (`.btn-a`), min height ≈ 48px (≥44px tap target).
- **Hero overlay** uses a `<td background>` + VML `<v:fill type="frame">` for Outlook,
  with a semi-opaque scrim behind the text for legibility. *Non-overlay fallback:* if
  AWC's chosen hero photo fails contrast, move the headline/subhead/CTA into a solid
  band beneath the image (the scrim band markup is already separated to make this a
  quick swap).
- **Body text** ≥ 14–16px; mobile keeps ≥14px. Preheader (hidden preview text) set.
- **Alt text** on every meaningful image; decorative stat icons use empty `alt=""`.
- `role="presentation"` on layout tables; `role="article"` wrapper with `lang`.

## Imagery / asset list — real assets wired in

Real assets now live in [`assets/`](assets) and are mapped into the masters by
[`.claude/apply-images.js`](.claude/apply-images.js) (matches `<img>` tags by their
unique `alt` text, so it patches both masters; templates inherit via the rebuild).
**Re-run `node .claude/apply-images.js && node .claude/build-templates.js` after adding
or swapping any asset.**

Four photos + four icons cover a system of ~16 image slots, so some photos are reused
across slots (and across templates). Current mapping:

| Slot | Asset used | Notes |
|---|---|---|
| 1 Header logo | `AWC-logo.png` | 246×92 wordmark; shown 180×67 on the white header |
| 2 Hero banner | `Conservation Partnerships-1_0.jpg` | release shot; dark image + scrim keeps overlay text legible |
| 3 Hero + copy | `Restoring Wildlife-1.jpg` | ecologist fieldwork — matches "Helping wildlife thrive" |
| 5 Stats ×4 | `assets/icons/png/icon-{mammal,bird,reptile,amphibian}.png` | converted from the supplied SVGs (Numbat / bird / reptile / frog) |
| 6 Single story | `What we do-1.jpg` | ⚠ **low-res (376×212)** — soft at 580px; supply a hi-res export |
| 7 Two-col A | `Conservation Partnerships-1_0.jpg` | reused |
| 7 Two-col B | `Julia Baxter_5.jpg` | exact match for "Meet AWC's interns" |
| 8 Feature | `Restoring Wildlife-1.jpg` | reused |
| 9 Image w/ caption | `What we do-1.jpg` | ⚠ low-res; caption text still says "Wombat" (placeholder) |
| 12 Donation | `Conservation Partnerships-1_0.jpg` | reused |
| 14 Speaker | `Julia Baxter_5.jpg` | ⚠ **name says "Dr Jordan Rivers"** — no portrait supplied for that name; `object-fit:cover` circle-crops it |

**Still placeholders (no asset supplied):** footer **mono/white** logo (the supplied
`AWC-logo.png` is dark teal — invisible on the dark green footer band, so it needs a
reversed/white version) and the 5 social icons (`f / IG / in / X / YT`). Drop a white
logo + social PNGs into `assets/` and add them to the patcher to finish.

**Two production caveats to action before send:**
1. **SVG → PNG.** Most email clients (Gmail, Outlook, Yahoo) don't render SVG, so the
   species icons were rasterised to PNG (`assets/icons/png/`, 224px = 4× of 56px). Keep
   using the PNGs in the email; the SVGs remain the source of truth.
2. **Retina.** The three hi-res photos are 808×454 — fine up to ~580px display but only
   ~1.3× at the 640px full-bleed slots. For crisp retina, supply ≥1280px-wide exports.

## SFMC build notes

- Table-based, ~600px body, CSS inlined for production (the `<head>` `<style>` block
  holds resets + media queries — keep these in `<head>`; SFMC preserves them).
- AMPscript/personalisation placeholders are stubbed:
  `%%view_email_url%%`, `%%unsub_center_url%%`, `%%profile_center_url%%`.
- Compliance block (org name + physical address, permission reminder, unsubscribe /
  update preferences / view in browser, © line) is present and marked **FIXED**.
- All `href="#"` are placeholders — wire to real URLs / tracked links at build.
- Web-font `<link>` is wrapped in `<!--[if !mso]>` so Outlook ignores it.

## Open items for AWC

1. Confirm exact brand orange + secondary palette / hex values.
2. Confirm brand sans (web font) + licensed fallback for email.
3. Supply final photography (@2x) + photo credits and final copy.
4. Confirm which optional modules ship in the base template set.
