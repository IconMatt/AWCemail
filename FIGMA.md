# AWC Email — Figma spec sheet

Exact tokens pulled from `awc-master-demo-640.html`, for building (or cleaning up an
html.to.design import of) the AWC email design system in Figma.

- **Frame width:** 640px desktop · fluid 100% on mobile (build a ~375px variant)
- **Fonts:** headings **Poppins** · body **Arial / Helvetica** (the email's web-safe fallback)
- **Suggested structure:** Color styles + Text styles → 16 module **components** → assembled
  into 2 templates (Newsletter, Flexible Campaign). Mirrors the SFMC block/template model.

---

## Color styles

Group these as `Brand / …`, `Text / …`, `Surface / …`, `Line / …`, `On-dark / …`.

| Style | Hex | Use |
|---|---|---|
| Brand / Orange | `#E1670F` | CTAs, accents, brand rule, stat figures, links |
| Brand / Orange Dark | `#C4560B` | button text on white (inverted CTA) |
| Text / Ink | `#23281F` | headings |
| Text / Body | `#4A4A4A` | paragraphs |
| Text / Body Soft | `#555555` | two-column card body |
| Text / Muted | `#777777` | captions, secondary |
| Text / Utility | `#8A8A8A` | "view in browser", fine print |
| Surface / White | `#FFFFFF` | default section bg |
| Surface / Cream | `#F6F2EA` | alternating section bg |
| Surface / Page | `#EDE8DE` | outer page background |
| Surface / Forest | `#233027` | footer + pull-quote band |
| Accent / Icon Circle | `#F1E7D8` | cream roundel behind stat icons |
| Accent / Chip Fill | `#FAF7F1` | donation amount chips |
| Line / Rule | `#E7E0D2` | hairline dividers, card/event borders |
| Line / Chip Border | `#DCD3C2` | donation chip border |
| Line / Row Rule | `#F0EBE0` | event-detail row separators |
| Hero / Scrim Base | `#3A4232` · `#5C6750` | hero fallback fills (behind photo) |
| Hero / Scrim Overlay | `rgba(28,32,24,0.55)` | dark band behind hero headline |
| On-dark / Text 1 | `#C9D1C8` | footer links |
| On-dark / Text 2 | `#A9B3A4` | acknowledgement / attribution |
| On-dark / Text 3 | `#8E988A` | footer address / permission |
| On-dark / Text 4 | `#717C6E` | © line |
| On-dark / Separator | `#4E5A50` | footer dot/pipe separators |
| On-dark / Social BG | `#2F3D33` | social icon circles |
| On-dark / Divider | `#36443A` | footer hairline |

---

## Text styles

Weights: Poppins **700** (Bold), **600** (SemiBold); Arial **700** (Bold), **400** (Regular).
Format: `size / line-height`. Mobile column = the responsive scaled size.

| Style | Font · weight | Desktop | Mobile | Colour | Notes |
|---|---|---|---|---|---|
| Hero headline | Poppins 700 | 34 / 40 | 28 / 34 | White | text-shadow `0 1px 3px rgba(0,0,0,.4)` |
| H1 | Poppins 700 | 26–28 / 32–34 | 24 / 30 | Ink (white on CTA) | feature, CTA banner, donation |
| H2 | Poppins 700 | 22 / 28 | 20 / 26 | Ink | story headings (two-col cards 19 / 24) |
| Eyebrow / Kicker | Poppins 600 | 12 | — | Orange | UPPERCASE, letter-spacing **+1.5** |
| Body | Arial 400 | 16 / 24 | — | Body | intro is 17 / 26, centred |
| Body Small | Arial 400 | 14 / 21 | — | Body Soft | card copy |
| Link | Poppins 600 | 15 (sm 14) | — | Orange | "Read more →" |
| Stat number | Poppins 700 | 32 / 34 | 30 | Orange | — |
| Stat label | Arial 400 | 13 / 18 | — | Body | — |
| Pull quote | Poppins 600 | 24 / 34 | 21 / 30 | `#F4F1EA` | on Forest band |
| Quote attribution | Arial 400 | 14 / 20 | — | On-dark Text 2 | letter-spacing +0.5 |
| Caption | Arial **Italic** 400 | 13 / 19 | — | Muted | image captions |
| Button label | Poppins 700 | 16 / 20 | — | White / Orange Dark | — |
| Event label | Arial 400 | 13 | — | Utility | UPPERCASE, +0.5 |
| Event value | Arial 700 | 15 / 20 | — | `#2E2E2E` | — |
| Footer link | Poppins 600 | 14 | — | White / On-dark 1 | — |
| Footer body | Arial 400 | 12 / 18–19 | — | On-dark 2/3 | acknowledgement, address |
| Fine print / © | Arial 400 | 11–12 | — | On-dark 3/4 | — |
| Utility | Arial 400 | 11 / 16 | — | Utility | "View in browser" |

---

## Spacing, shape & layout

- **Side padding** (content inset): **30px** desktop → **22px** mobile. Centred copy blocks
  (intro, quote, CTA) use 40–44px.
- **Brand rule:** 4px solid Orange under the header.
- **Hero height:** 360px (full-bleed photo + scrim band at the bottom).
- **Corner radius:** buttons **4** · images **4** · cards **6** · event card **8** · chips **4** ·
  icons / social / speaker **50%** (circle).
- **Section rhythm:** alternate White / Cream bands; Footer + Pull-quote use Forest.
- **Buttons:** primary = Orange fill, white label, ~14×32 padding, ~48px tall, radius 4;
  inverted (on the orange CTA banner) = white fill, Orange Dark label. Full-width on mobile.
- **Responsive:** stats 4-up → 2×2 · two-column → stacked · donation chips wrap · CTAs
  full-width · hero headline scales down.

---

## Image slots & asset mapping

Display sizes (supply @2x). Assets live in `/assets`.

| Module | Slot (px) | Shape | Asset |
|---|---|---|---|
| Header logo | 180 × 67 | — | `AWC-logo.png` |
| Hero banner | 640 × 360 | full-bleed + scrim | `Conservation Partnerships-1_0.jpg` |
| Hero + copy | 640 × 320 | — | `Restoring Wildlife-1.jpg` |
| Stats ×4 | 56 × 56 | circle in `#F1E7D8` | `icons/png/icon-{mammal,bird,reptile,amphibian}.png` |
| Single story | 580 × 270 | radius 4 | `What we do-1.jpg` *(low-res)* |
| Two-col A | 280 × 180 | card radius 6 | `Conservation Partnerships-1_0.jpg` |
| Two-col B | 280 × 180 | card radius 6 | `Julia Baxter_5.jpg` |
| Feature | 640 × 384 | — | `Restoring Wildlife-1.jpg` |
| Image w/ caption | 580 × 386 | radius 4 | `What we do-1.jpg` *(low-res)* |
| Donation | 640 × 280 | — | `Conservation Partnerships-1_0.jpg` |
| Webinar speaker | 120 × 120 | circle (cover-crop) | `Julia Baxter_5.jpg` |
| Footer logo | 150 × 40 | — | ⚠ needs **white/reversed** version |
| Social icons ×5 | 32 × 32 | circle | ⚠ no asset yet |

---

## Suggested Figma component set

Build one component per module (vertical Auto Layout, 640 wide, 30 side padding), then
assemble templates from instances — same split as the live system:

1. **Header** 🔒 · 2. Hero banner · 3. Hero + copy · 4. Intro · 5. Stats (4-up) ·
6. Single-column story · 7. Two-column story · 8. Feature article · 9. Image + caption ·
10. Pull quote · 11. CTA banner · 12. Donation appeal · 13. Event details ·
14. Webinar speaker · 15. Section divider (rule + motif variants) · 16. **Footer** 🔒

- **Templates:** `Newsletter` (multi-story) and `Flexible Campaign` (solus/appeal/webinar/event
  as variants or starter frames).
- **Lock** Header & Footer (brand + compliance) — everything else is the editable kit.
- Make the **2 dividers** and **button** Figma component variants.

> Reference frames: import `…/awc-master-demo-640.html` (all modules) to check against, and
> the per-type sends (`…/newsletter.html`, etc.) for assembled examples.
