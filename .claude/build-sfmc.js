// Generate an SFMC Content Builder build kit from the 640px master:
//   - 2 templates (locked header/footer + an editable body slot of blocks)
//   - the module library as individual content-block files
//   - the 5 starter emails (copied, asset paths fixed for the subfolder)
//
//   node .claude/build-sfmc.js
//
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/mattw/Documents/dev/AWC Email';
const OUT = path.join(ROOT, 'sfmc');

// --- slice the master into preamble / modules / postamble (same anchors) ----
const html = fs.readFileSync(path.join(ROOT, 'awc-master-demo-640.html'), 'utf8');
const ORDER = [
  ['header', 'MODULE 1 — HEADER'],
  ['heroBanner', 'MODULE 2 — HERO BANNER'],
  ['heroCopy', 'MODULE 3 — HERO IMAGE WITH COPY'],
  ['intro', 'MODULE 4 — INTRO SECTION'],
  ['stats', 'MODULE 5 — STATISTICS'],
  ['dividerA', 'SECTION DIVIDER  [FIXED] — placement 1'],
  ['singleStory', 'MODULE 6 — SINGLE-COLUMN STORY'],
  ['twoCol', 'MODULE 7 — TWO-COLUMN STORY'],
  ['feature', 'MODULE 8 — FEATURE ARTICLE'],
  ['caption', 'MODULE 9 — IMAGE WITH CAPTION'],
  ['pullQuote', 'MODULE 10 — PULL QUOTE'],
  ['ctaBanner', 'MODULE 11 — CTA BANNER'],
  ['donation', 'MODULE 12 — DONATION APPEAL'],
  ['dividerB', 'SECTION DIVIDER  [FIXED] — placement 2'],
  ['eventDetails', 'MODULE 13 — EVENT DETAILS'],
  ['speaker', 'MODULE 14 — WEBINAR SPEAKER'],
  ['footer', 'MODULE 16 — FOOTER'],
];
const postIndex = html.indexOf('</div><!-- /role=article -->');
const starts = ORDER.map(([, a]) => html.lastIndexOf('<!--', html.indexOf(a)));
const M = {};
ORDER.forEach(([k], i) => { M[k] = html.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : postIndex); });
const preamble = html.slice(0, starts[0]);
const postamble = html.slice(postIndex);

// assets live at repo root; every sfmc/ file is 2 levels deep -> ../../assets
const relAssets = s => s.split('="assets/').join('="../../assets/').split("('assets/").join("('../../assets/");

// --- output folders ---------------------------------------------------------
['templates', 'blocks', 'starters'].forEach(d => fs.mkdirSync(path.join(OUT, d), { recursive: true }));

const ORIG_TITLE = 'AWC — Master Demo Email';
const ORIG_PRE = "Protect Australia's unique wildlife — see the impact your support makes across our sanctuaries this season.";

// --- 1. templates: locked header + body slot of default blocks + locked footer
function buildTemplate({ title, pre, label, blocks }) {
  const head = preamble.split(ORIG_TITLE).join(title).split(ORIG_PRE).join(pre)
    .split('aria-label="AWC Master Demo Email"').join('aria-label="' + label + '"');
  const slotOpen =
    '\n  <!-- ============================================================\n' +
    '       EDITABLE BODY SLOT — editors add / remove / reorder blocks here.\n' +
    '       Locked chrome (header above, footer below) is outside the slot.\n' +
    '       ============================================================ -->\n' +
    '  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>\n' +
    '  <td data-type="slot" data-key="bodyslot">\n';
  const body = blocks.map((k, i) => {
    const key = String(i + 1).padStart(2, '0') + '-' + k.toLowerCase();
    return '  <div data-type="block" data-key="' + key + '">\n' + M[k] + '  </div>\n';
  }).join('');
  const slotClose = '  </td>\n  </tr></table>\n';
  return relAssets(head + M.header + slotOpen + body + slotClose + M.footer + postamble);
}

const TEMPLATES = [
  {
    file: 'template-newsletter.html',
    title: 'AWC — Newsletter template',
    label: 'AWC Newsletter',
    pre: "The latest from the field — stories, science and impact from across AWC's sanctuaries.",
    blocks: ['heroBanner', 'intro', 'heroCopy', 'dividerA', 'singleStory', 'twoCol', 'feature', 'dividerA', 'caption', 'ctaBanner'],
  },
  {
    file: 'template-flexible-campaign.html',
    title: 'AWC — Flexible Campaign template',
    label: 'AWC Flexible Campaign',
    pre: 'Together we are restoring wildlife and habitats at scale.',
    blocks: ['heroCopy', 'intro', 'dividerA', 'singleStory', 'ctaBanner'],
  },
];
TEMPLATES.forEach(t => {
  fs.writeFileSync(path.join(OUT, 'templates', t.file), buildTemplate(t), 'utf8');
  console.log('template:', t.file, '(' + t.blocks.length + ' default blocks)');
});

// --- 2. content-block library (the draggable modules) -----------------------
const LIB = [
  ['hero-banner', 'heroBanner'],
  ['hero-image-copy', 'heroCopy'],
  ['intro', 'intro'],
  ['stats', 'stats'],
  ['single-story', 'singleStory'],
  ['two-column-story', 'twoCol'],
  ['feature-article', 'feature'],
  ['image-caption', 'caption'],
  ['pull-quote', 'pullQuote'],
  ['cta-banner', 'ctaBanner'],
  ['donation-appeal', 'donation'],
  ['event-details', 'eventDetails'],
  ['webinar-speaker', 'speaker'],
  ['divider-rule', 'dividerA'],
  ['divider-motif', 'dividerB'],
];
LIB.forEach(([fname, key]) => {
  const note =
    '<!-- AWC content block — ' + fname + '\n' +
    '     In SFMC: Content Builder > Create > Content Block (HTML), paste this, save to the "AWC Modules" folder.\n' +
    '     Responsive classes (.col-2, .stat, .btn-a, …) are defined in the template <head> — blocks live inside a template. -->\n';
  fs.writeFileSync(path.join(OUT, 'blocks', fname + '.html'), relAssets(note + M[key]), 'utf8');
});
console.log('blocks:', LIB.length, 'library files');

// --- 3. starter emails (copy the assembled templates, fix asset paths) ------
const STARTERS = ['newsletter', 'solus', 'appeal', 'webinar-invite', 'event-invite'];
STARTERS.forEach(name => {
  const src = fs.readFileSync(path.join(ROOT, name + '.html'), 'utf8');
  fs.writeFileSync(path.join(OUT, 'starters', name + '.html'), relAssets(src), 'utf8');
});
console.log('starters:', STARTERS.length, 'emails');
console.log('done ->', OUT);
