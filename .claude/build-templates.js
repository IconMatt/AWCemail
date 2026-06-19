// Build per-type AWC email templates by slicing the EXACT module blocks out of
// awc-master-demo-640.html and reassembling them per the component matrix
// (core/typical ● only). Also generates an index.html landing page.
//
//   node .claude/build-templates.js
//
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/mattw/Documents/dev/AWC Email';
const SRC = path.join(ROOT, 'awc-master-demo-640.html');
const html = fs.readFileSync(SRC, 'utf8');

// --- 1. Split master into preamble / modules / postamble -------------------
// Each module is preceded by a leading HTML comment containing a unique anchor.
const ORDER = [
  ['header',       'MODULE 1 — HEADER'],
  ['heroBanner',   'MODULE 2 — HERO BANNER'],
  ['heroCopy',     'MODULE 3 — HERO IMAGE WITH COPY'],
  ['intro',        'MODULE 4 — INTRO SECTION'],
  ['stats',        'MODULE 5 — STATISTICS'],
  ['dividerA',     'SECTION DIVIDER  [FIXED] — placement 1'],
  ['singleStory',  'MODULE 6 — SINGLE-COLUMN STORY'],
  ['twoCol',       'MODULE 7 — TWO-COLUMN STORY'],
  ['feature',      'MODULE 8 — FEATURE ARTICLE'],
  ['caption',      'MODULE 9 — IMAGE WITH CAPTION'],
  ['pullQuote',    'MODULE 10 — PULL QUOTE'],
  ['ctaBanner',    'MODULE 11 — CTA BANNER'],
  ['donation',     'MODULE 12 — DONATION APPEAL'],
  ['dividerB',     'SECTION DIVIDER  [FIXED] — placement 2'],
  ['eventDetails', 'MODULE 13 — EVENT DETAILS'],
  ['speaker',      'MODULE 14 — WEBINAR SPEAKER'],
  ['footer',       'MODULE 16 — FOOTER'],
];

const POST_MARK = '</div><!-- /role=article -->';
const postIndex = html.indexOf(POST_MARK);
if (postIndex < 0) throw new Error('postamble marker not found');

// compute the start index (the "<!--" opening the leading comment) of each module
const starts = ORDER.map(([, anchor]) => {
  const ai = html.indexOf(anchor);
  if (ai < 0) throw new Error('anchor not found: ' + anchor);
  return html.lastIndexOf('<!--', ai);
});

const M = {};
ORDER.forEach(([key], i) => {
  const from = starts[i];
  const to = (i + 1 < starts.length) ? starts[i + 1] : postIndex;
  M[key] = html.slice(from, to);
});

const preamble = html.slice(0, starts[0]);
const postamble = html.slice(postIndex);

// --- 2. Helper: clone a module and swap placeholder copy --------------------
function swap(src, pairs) {
  let out = src;
  for (const [a, b] of pairs) out = out.split(a).join(b);
  return out;
}

// Extra newsletter stories (same components, fresh placeholder copy) ---------
const singleStory2 = swap(M.singleStory, [
  ['alt="Scotia Wildlife Sanctuary landscape under dramatic summer skies"',
   'alt="A Greater Bilby foraging at night at Mt Gibson Wildlife Sanctuary"'],
  ['Conservation through extremes at Scotia Wildlife Sanctuary',
   'The return of the Greater Bilby to Mt Gibson'],
  ['Extreme weather tested staff and wildlife alike at Scotia during a summer of heatwaves, drought and floods. Discover how our field teams adapted to protect the species in their care.',
   'Once vanished from the region, the Greater Bilby is digging again behind the feral-proof fence at Mt Gibson. Follow the first cohort as our ecologists track survival, breeding and the soil they help restore.'],
]);

const twoCol2 = swap(M.twoCol, [
  ['alt="Brigalow Belt woodland habitat at dawn"',
   'alt="Cool-season patch burning across northern savanna"'],
  ['Saving the Brigalow Belt', 'Fire that heals Country'],
  ["One of Australia's most imperilled bioregions — and how conservation is protecting its remaining woodland homes.",
   'How right-way burning alongside Traditional Owners is reducing destructive wildfires and bringing native species back.'],
  ['alt="AWC intern Julia Baxter conducting field work"',
   'alt="A wild Numbat photographed during monitoring"'],
  ["Meet AWC's interns", 'A record breeding season'],
  ['Julia Baxter shares her experience working in the field with Australian Wildlife Conservancy.',
   'Numbats, bettongs and bilbies are bouncing back — our latest counts reveal the strongest season yet across the network.'],
]);

M.singleStory2 = singleStory2;
M.twoCol2 = twoCol2;

// --- 3. Template definitions (core/● components per the matrix) -------------
const TEMPLATES = [
  {
    file: 'newsletter.html',
    name: 'Newsletter',
    title: 'AWC — Wildlife Matters Newsletter',
    pre: "The latest from the field — stories, science and impact from across AWC's sanctuaries.",
    blurb: 'Regular supporter update — a lead story plus a rich mix of field stories, a feature and a closing call to action.',
    order: ['header','heroBanner','intro','heroCopy','dividerA','singleStory','twoCol','singleStory2','twoCol2','feature','dividerA','caption','ctaBanner','footer'],
    core: ['Header','Hero banner','Hero image with copy','Intro section','Single-column story','Two-column story','Feature article','Image with caption','CTA banner','Section divider','Footer'],
  },
  {
    file: 'solus.html',
    name: 'Solus',
    title: 'AWC — Helping Wildlife Thrive',
    pre: 'Guided by science, our field teams are restoring wildlife and habitats at scale.',
    blurb: 'Single-subject editorial send — one story told in depth, backed by impact stats and a testimonial.',
    order: ['header','heroCopy','intro','stats','dividerA','singleStory','dividerA','feature','caption','pullQuote','ctaBanner','footer'],
    core: ['Header','Hero image with copy','Intro section','Statistics / impact','Single-column story','Feature article','Image with caption','Pull quote / testimonial','CTA banner','Section divider','Footer'],
  },
  {
    file: 'appeal.html',
    name: 'Appeal',
    title: "AWC — Secure the Future of Australia's Wildlife",
    pre: 'Donate today and help protect the animals found nowhere else on Earth.',
    blurb: 'Fundraising-focused send — emotive testimonial and impact stats leading into a donation ask.',
    order: ['header','heroCopy','intro','stats','dividerA','pullQuote','ctaBanner','donation','footer'],
    core: ['Header','Hero image with copy','Intro section','Statistics / impact','Pull quote / testimonial','CTA banner','Donation appeal','Section divider','Footer'],
  },
  {
    file: 'webinar-invite.html',
    name: 'Webinar Invite',
    title: 'AWC — Webinar: Hope for a New Home',
    pre: "Join Dr Jordan Rivers live — register for AWC's conservation science webinar.",
    blurb: 'Online event invitation — topic intro, featured speaker and the logistics, with a register CTA.',
    order: ['header','heroBanner','intro','heroCopy','caption','dividerA','speaker','eventDetails','ctaBanner','footer'],
    core: ['Header','Hero banner','Hero image with copy','Intro section','Image with caption','Event details','Webinar speaker','CTA banner','Section divider','Footer'],
  },
  {
    file: 'event-invite.html',
    name: 'Event Invite',
    title: "AWC — You're Invited: A Night at Newhaven",
    pre: 'Behind the Wire — join us on Thursday 16 July 2026, online or in person.',
    blurb: 'In-person / hybrid event invitation — short, punchy, structured event details and an RSVP.',
    order: ['header','heroBanner','intro','dividerB','eventDetails','ctaBanner','footer'],
    core: ['Header','Hero banner','Intro section','Event details','CTA banner','Section divider','Footer'],
  },
];

const ORIG_TITLE = 'AWC — Master Demo Email';
const ORIG_PRE = "Protect Australia's unique wildlife — see the impact your support makes across our sanctuaries this season.";

// --- 4. Write the template files -------------------------------------------
TEMPLATES.forEach(t => {
  let head = preamble
    .split(ORIG_TITLE).join(t.title)
    .split(ORIG_PRE).join(t.pre)
    .split('aria-label="AWC Master Demo Email"').join('aria-label="AWC ' + t.name + '"');
  const body = t.order.map(k => {
    if (!M[k]) throw new Error('unknown module key: ' + k + ' in ' + t.file);
    return M[k];
  }).join('');
  const out = head + body + postamble;
  fs.writeFileSync(path.join(ROOT, t.file), out, 'utf8');
  console.log('wrote', t.file, '(' + t.order.length + ' blocks)');
});

// --- 5. Build index.html landing page --------------------------------------
const cards = [
  {
    file: 'awc-master-demo-640.html', name: 'Master (kitchen-sink)', tag: 'Reference',
    blurb: 'Every module in the design system, in sequence — the component library all templates draw from.',
    core: ['All 16 modules'],
  },
  ...TEMPLATES.map(t => ({ file: t.file, name: t.name, tag: 'Template', blurb: t.blurb, core: t.core })),
];

function chip(label) {
  return '<span class="chip">' + label + '</span>';
}
function card(c) {
  return [
    '<a class="card" href="' + c.file + '">',
    '  <div class="card-top">',
    '    <span class="badge badge-' + c.tag.toLowerCase() + '">' + c.tag + '</span>',
    '    <h2>' + c.name + '</h2>',
    '    <p class="blurb">' + c.blurb + '</p>',
    '  </div>',
    '  <div class="chips">' + c.core.map(chip).join('') + '</div>',
    '  <span class="open">Open template &rarr;</span>',
    '</a>',
  ].join('\n');
}

// Component matrix (rows = components, cols = email types).
// Per cell: C = core/typical (●), O = optional (○), _ = not used (blank).
const MATRIX = {
  cols: ['Newsletter', 'Solus', 'Appeal', 'Webinar Invite', 'Event Invite'],
  rows: [
    ['Header',                      'CCCCC', true],
    ['Hero banner',                 'COOCC'],
    ['Hero image with copy',        'CCCCO'],
    ['Intro section',               'CCCCC'],
    ['Single-column story',         'CCOOO'],
    ['Two-column story',            'CO__O'],
    ['Feature article',             'CCO__'],
    ['Image with caption',          'CCOOO'],
    ['Pull quote / testimonial',    'OCCO_'],
    ['CTA banner',                  'CCCCC'],
    ['Donation appeal section',     'OOC_O'],
    ['Event details module',        '___CC'],
    ['Webinar speaker module',      '___C_'],
    ['Statistics / impact module',  'OCC__'],
    ['Section divider',             'CCCCC'],
    ['Footer',                      'CCCCC', true],
  ],
};
function mxCell(ch) {
  if (ch === 'C') return '<td><span class="dot core" title="core / typical"></span></td>';
  if (ch === 'O') return '<td><span class="dot opt" title="optional"></span></td>';
  return '<td><span class="mx-blank" title="not used">&ndash;</span></td>';
}
function renderMatrix() {
  const head = '<tr><th class="mx-comp">Component</th>' +
    MATRIX.cols.map(c => '<th>' + c + '</th>').join('') + '</tr>';
  const body = MATRIX.rows.map(([name, code, bold]) =>
    '<tr' + (bold ? ' class="mx-strong"' : '') + '><th scope="row" class="mx-comp">' + name + '</th>' +
    code.split('').map(mxCell).join('') + '</tr>'
  ).join('\n          ');
  return [
    '<h2 class="section">Component matrix</h2>',
    '<p class="mx-legend"><span class="dot core"></span> core / typical &nbsp;·&nbsp; <span class="dot opt"></span> optional &nbsp;·&nbsp; <span class="mx-blank">&ndash;</span> not used</p>',
    '<div class="mx-wrap"><table class="matrix"><thead>' + head + '</thead><tbody>\n          ' + body + '\n        </tbody></table></div>',
  ].join('\n      ');
}

// Technical / platform / steps copy — kept minimal and scannable.
const PLATFORM = [
  'Table-based HTML &middot; ~640px body &middot; single column on mobile',
  'CSS inlined for production (media queries kept in &lt;head&gt;)',
  'Modular Content Builder slots — editors swap content, no code',
  'Outlook-safe: VML for buttons &amp; hero background image',
  'Retina @2x imagery &middot; alt text on every image',
  'Web-safe fonts: Poppins &rarr; Arial / Helvetica fallback',
  'AMPscript tokens: view-in-browser, unsubscribe, preferences',
  'Tap targets &ge;44px &middot; body text &ge;14–16px',
];
const CLIENTS = [
  'Apple Mail — macOS &amp; iOS',
  'Gmail — web, iOS &amp; Android',
  'Outlook — Windows 2016–2021 &amp; Microsoft 365',
  'Outlook.com, Outlook for Mac &amp; mobile',
  'Yahoo Mail &amp; AOL Mail',
  'Samsung Mail (Android)',
  'Light &amp; dark mode aware',
];
const STEPS = [
  'Upload the images to Content Builder; copy the hosted URLs.',
  'Create an email in Content Builder and paste the template HTML.',
  'Replace placeholder image URLs with the hosted Content Builder URLs.',
  'Wrap the editable regions as content blocks / slots.',
  'Set real links + AMPscript (unsubscribe, view-in-browser, profile).',
  'Save as a reusable template.',
  'Send a test and preview across clients (Litmus / Email on Acid).',
  'QA, fix, then activate for sending.',
];
function bullets(items) {
  return '<ul class="info-list">' + items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
}
function renderTech() {
  return [
    '<h2 class="section">Technical &amp; platform</h2>',
    '<div class="info-grid">',
    '  <div class="info-card"><h3>SFMC build</h3>' + bullets(PLATFORM) + '</div>',
    '  <div class="info-card"><h3>Renders on</h3>' + bullets(CLIENTS) + '</div>',
    '</div>',
    '<h2 class="section">Adding templates to SFMC</h2>',
    '<ol class="steps">' + STEPS.map(s => '<li>' + s + '</li>').join('') + '</ol>',
  ].join('\n      ');
}

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AWC Email Templates — Index</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root{
      --orange:#E1670F; --orange-dark:#C4560B; --ink:#23281F; --body:#4A4A4A;
      --green:#233027; --cream:#F6F2EA; --page:#EDE8DE; --rule:#E1D9C9; --white:#fff;
    }
    *{box-sizing:border-box;}
    body{margin:0;background:var(--page);color:var(--body);
      font-family:'Inter','Helvetica Neue',Arial,sans-serif;line-height:1.55;}
    .wrap{max-width:1040px;margin:0 auto;padding:0 24px 80px;}
    header.masthead{background:var(--green);color:#fff;padding:0;border-bottom:5px solid var(--orange);}
    .masthead-inner{max-width:1040px;margin:0 auto;padding:34px 24px 38px;}
    .logo{display:inline-block;font-family:'Poppins',Arial,sans-serif;font-weight:700;
      letter-spacing:2px;font-size:20px;color:#fff;border:2px solid rgba(255,255,255,.5);
      padding:7px 14px;border-radius:4px;}
    h1{font-family:'Poppins',Arial,sans-serif;color:#fff;font-size:30px;line-height:1.2;
      margin:22px 0 8px;font-weight:700;}
    .masthead-inner p{color:#C9D1C8;max-width:680px;margin:0;font-size:16px;}
    .meta{margin-top:18px;font-size:13px;color:#9DA89A;}
    .meta b{color:#E7CDB6;font-weight:600;}
    h2.section{font-family:'Poppins',Arial,sans-serif;color:var(--ink);font-size:15px;
      letter-spacing:1.5px;text-transform:uppercase;margin:46px 0 6px;}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:18px;}
    .card{display:flex;flex-direction:column;justify-content:space-between;
      background:var(--white);border:1px solid var(--rule);border-radius:12px;
      padding:22px 22px 20px;text-decoration:none;color:inherit;
      transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;}
    .card:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(35,40,31,.10);border-color:#D8C8AE;}
    .badge{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.6px;
      text-transform:uppercase;padding:3px 9px;border-radius:20px;margin-bottom:12px;}
    .badge-template{background:#FBEEE2;color:var(--orange-dark);}
    .badge-reference{background:#E7ECE6;color:var(--green);}
    .card h2{font-family:'Poppins',Arial,sans-serif;color:var(--ink);font-size:21px;margin:0 0 8px;font-weight:700;}
    .blurb{font-size:14.5px;color:var(--body);margin:0 0 16px;}
    .chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
    .chip{font-size:11.5px;background:var(--cream);color:#6A6457;border:1px solid var(--rule);
      padding:4px 9px;border-radius:20px;white-space:nowrap;}
    .open{font-family:'Poppins',Arial,sans-serif;color:var(--orange);font-weight:600;font-size:14px;}
    footer.foot{margin-top:54px;padding-top:22px;border-top:1px solid var(--rule);
      font-size:13px;color:#8A8475;}
    /* component matrix */
    .mx-legend{font-size:13px;color:#6A6457;margin:6px 0 0;}
    .mx-legend .dot, .mx-legend .mx-blank{margin:0 5px 0 2px;}
    .mx-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin-top:16px;
      border:1px solid var(--rule);border-radius:12px;background:var(--white);}
    table.matrix{border-collapse:collapse;width:100%;min-width:660px;font-size:14px;}
    table.matrix th, table.matrix td{padding:13px 12px;text-align:center;border-bottom:1px solid #EFE9DD;}
    table.matrix tbody tr:last-child th, table.matrix tbody tr:last-child td{border-bottom:none;}
    table.matrix thead th{font-family:'Poppins',Arial,sans-serif;font-weight:600;font-size:13px;
      color:var(--ink);white-space:nowrap;border-bottom:1px solid var(--rule);}
    .mx-comp{text-align:left!important;white-space:nowrap;padding-left:20px!important;
      font-weight:400;color:var(--body);position:sticky;left:0;background:var(--white);
      box-shadow:1px 0 0 var(--rule);}
    thead .mx-comp{color:var(--ink);}
    .mx-strong .mx-comp{font-weight:700;color:var(--ink);}
    .dot{display:inline-block;width:11px;height:11px;border-radius:50%;vertical-align:middle;}
    .dot.core{background:var(--orange);}
    .dot.opt{background:transparent;border:1.5px solid #D8B48E;}
    .mx-blank{color:#CFC7B6;}
    /* technical / platform / steps */
    .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:20px;margin-top:18px;}
    .info-card{background:var(--white);border:1px solid var(--rule);border-radius:12px;padding:20px 24px 8px;}
    .info-card h3{font-family:'Poppins',Arial,sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin:0 0 10px;}
    .info-list{list-style:none;margin:0;padding:0;}
    .info-list li{position:relative;padding:9px 0 9px 20px;font-size:14.5px;line-height:1.45;
      color:var(--body);border-bottom:1px solid #F2EDE2;}
    .info-list li:last-child{border-bottom:none;}
    .info-list li:before{content:"";position:absolute;left:0;top:15px;width:7px;height:7px;
      border-radius:50%;background:var(--orange);}
    .steps{list-style:none;counter-reset:step;margin:18px 0 0;padding:0;
      background:var(--white);border:1px solid var(--rule);border-radius:12px;}
    .steps li{counter-increment:step;position:relative;padding:14px 22px 14px 58px;font-size:15px;
      line-height:1.45;color:var(--body);border-bottom:1px solid #F2EDE2;}
    .steps li:last-child{border-bottom:none;}
    .steps li:before{content:counter(step);position:absolute;left:18px;top:13px;width:26px;height:26px;
      border-radius:50%;background:var(--orange);color:#fff;font-family:'Poppins',Arial,sans-serif;
      font-weight:700;font-size:13px;line-height:26px;text-align:center;}
    @media (max-width:520px){ h1{font-size:24px;} .masthead-inner{padding:26px 20px 30px;} }
  </style>
</head>
<body>
  <header class="masthead">
    <div class="masthead-inner">
      <span class="logo">AWC</span>
      <h1>Email Templates</h1>
      <p>Component-driven EDM template set for Australian Wildlife Conservancy. Every template is assembled from the same modules as the master build — table-based, SFMC-ready, 640px desktop, single-column on mobile.</p>
      <div class="meta">Body width <b>640px</b> &nbsp;·&nbsp; Mobile <b>fluid 100%</b> &nbsp;·&nbsp; Each template shows only its <b>core (●)</b> modules from the matrix</div>
    </div>
  </header>
  <div class="wrap">
    <h2 class="section">Reference</h2>
    <div class="grid">
${[card(cards[0])].map(s => '      ' + s.replace(/\n/g, '\n      ')).join('\n')}
    </div>

    <h2 class="section">Templates</h2>
    <div class="grid">
${cards.slice(1).map(c => '      ' + card(c).replace(/\n/g, '\n      ')).join('\n')}
    </div>

    ${renderMatrix()}

    ${renderTech()}

    <footer class="foot">
      Placeholder copy &amp; imagery throughout — final content supplied by AWC.
      Built from <code>awc-master-demo-640.html</code> components. Re-run <code>node .claude/build-templates.js</code> after editing the master to regenerate.
    </footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), indexHtml, 'utf8');
console.log('wrote index.html');
console.log('done.');
