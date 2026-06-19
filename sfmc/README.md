# AWC — SFMC build kit

Content Builder build of the AWC email system, following the agreed architecture
(**client Option 1**): **2 templates + a module block library + 5 starter emails**.

Generated from [`../awc-master-demo-640.html`](../awc-master-demo-640.html) — regenerate
after editing the master with `node .claude/build-sfmc.js`.

## The model

| Layer | What | Purpose |
|---|---|---|
| **Templates** (2) | `templates/template-newsletter.html`, `templates/template-flexible-campaign.html` | Locked guardrail: fixed header/footer + one editable **body slot** |
| **Block library** (15) | `blocks/*.html` | The reusable modules editors drag into the slot |
| **Starters** (5) | `starters/*.html` | Pre-assembled emails per send-type — marketers **copy & edit** |

The Flexible Campaign template covers **solus, appeal, webinar and event** — they're the
same single-column module stack, differing only in *which* blocks are present. The
per-type guidance lives in the **starters**, not in extra templates.

## Locked vs editable

- **🔒 Locked (outside the slot):** header (logo + brand rule) and footer (mono logo,
  social, Acknowledgement of Country, org address, unsubscribe / preferences / view-in-browser,
  © line). Marketers can't alter these — protects brand + compliance.
- **✏️ Editable (inside the slot):** everything in the body — add / remove / reorder
  blocks, edit copy and images.

Markup: the body is `<td data-type="slot" data-key="bodyslot">`; each module inside is
`<div data-type="block" data-key="NN-modulename">` (unique keys, e.g. `01-herobanner`).

## Folder contents

```
sfmc/
  templates/   2 importable templates (locked chrome + body slot of default blocks)
  blocks/      15 content blocks for an "AWC Modules" library
  starters/    5 assembled starter emails (newsletter, solus, appeal, webinar, event)
```

Block library (15): hero-banner · hero-image-copy · intro · stats · single-story ·
two-column-story · feature-article · image-caption · pull-quote · cta-banner ·
donation-appeal · event-details · webinar-speaker · divider-rule · divider-motif.

## Import steps (SFMC)

1. **Upload assets** — put `assets/` (photos, logo, species icons) into Content Builder;
   note the hosted URLs.
2. **Create the 2 templates** — Content Builder → *Create → Template*, paste each
   `templates/*.html`. SFMC reads the `data-type="slot"` / `data-type="block"` markup.
3. **Build the block library** — for each `blocks/*.html`: *Create → Content Block (HTML)*,
   paste, save into a shared **"AWC Modules"** folder.
4. **Swap image URLs** — replace the `../../assets/…` paths with the hosted Content
   Builder URLs. *(Footer mono/white logo + social icons still need assets — see root README.)*
5. **Create the 5 starters** — make an email from the matching template (or paste
   `starters/*.html`), arrange the blocks, save into an **"AWC Starters"** folder.
6. **Day-to-day for marketers** — *Create email → copy a starter* (or pick a template) →
   edit the body slot → preview/test across clients → send.

## Notes

- Responsive CSS lives in the template `<head>`; the blocks depend on it, so they're
  meant to be used **inside** a template (not standalone).
- Asset paths are `../../assets/…` here for local preview; they become Content Builder
  URLs on import.
- This kit + the locked chrome means brand/legal changes are made **once** (template +
  shared blocks) and propagate everywhere.
