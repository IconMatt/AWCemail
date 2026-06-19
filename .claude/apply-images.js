// Replace placeholder images in the master build(s) with the real assets in
// /assets, matching <img> tags by their (unique) alt text so it works on both
// the 600px and 640px masters. Run before build-templates.js.
//
//   node .claude/apply-images.js && node .claude/build-templates.js
//
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/mattw/Documents/dev/AWC Email';

// --- asset paths (spaces URL-encoded) --------------------------------------
const IMG = {
  CP: 'assets/images/Conservation%20Partnerships-1_0.jpg', // release / partnership
  RW: 'assets/images/Restoring%20Wildlife-1.jpg',          // ecologist fieldwork
  JB: 'assets/images/Julia%20Baxter_5.jpg',                // intern w/ bilby
  WW: 'assets/images/What%20we%20do-1.jpg',                // wildlife close-up (LOW-RES)
};
const ICON = {
  M: 'assets/icons/png/icon-mammal.png',
  B: 'assets/icons/png/icon-bird.png',
  R: 'assets/icons/png/icon-reptile.png',
  A: 'assets/icons/png/icon-amphibian.png',
};

// <img> slots keyed by their alt text -> asset
const BY_ALT = [
  ['AWC field ecologists releasing a threatened mammal into restored habitat', IMG.RW], // hero+copy
  ['Scotia Wildlife Sanctuary landscape under dramatic summer skies',          IMG.WW], // single story
  ['Brigalow Belt woodland habitat at dawn',                                   IMG.CP], // two-col A
  ['AWC intern Julia Baxter conducting field work',                            IMG.JB], // two-col B
  ['A reintroduced threatened mammal in its new sanctuary home at dusk',       IMG.RW], // feature
  ['A Northern Hairy-nosed Wombat emerging from its burrow',                   IMG.WW], // caption
  ["A threatened species at the heart of AWC's fundraising appeal",            IMG.CP], // donation
  ['Portrait of Dr Jordan Rivers',                                             IMG.JB], // speaker
];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function patch(file) {
  const fp = path.join(ROOT, file);
  let h = fs.readFileSync(fp, 'utf8');

  // 1. hero background (background=, background-image:url(), VML v:fill src) — all 3
  h = h.replace(/https:\/\/placehold\.co\/\d+x\d+\/6E7B5B\/ffffff\?text=HERO\+PHOTO\+\d+x\d+/g, IMG.CP);

  // 2. <img> slots by alt (src always precedes alt within the tag)
  for (const [alt, src] of BY_ALT) {
    if (!h.includes('alt="' + alt + '"')) { console.warn('  ! alt not found:', alt, 'in', file); continue; }
    const re = new RegExp('(<img\\s+)src="[^"]*"([^>]*?\\balt="' + esc(alt) + '")', 'g');
    h = h.replace(re, '$1src="' + src + '"$2'); // idempotent: re-sets to same src on re-runs
  }

  // 2b. header (main) logo — matched by its unique placeholder src, since the
  //     header & footer logos share the same alt. Footer logo stays a placeholder
  //     (needs a white/reversed version for the dark green band). Real logo is
  //     246×92 (≈2.67:1) so the height attr is corrected from 48 → 67 at 180px wide.
  h = h.split('https://placehold.co/360x96/ffffff/233027?text=AWC+LOGO" width="180" height="48"')
       .join('assets/AWC-logo.png" width="180" height="67"');

  // 3. stat icons by their text= label
  for (const [k, src] of Object.entries(ICON)) {
    h = h.split('https://placehold.co/110x110/F1E7D8/E1670F?text=' + k + '"').join(src + '"');
  }

  // 4. keep the cream roundel behind the (transparent) species icons (idempotent)
  if (!h.includes('border-radius:50%; background-color:#F1E7D8;')) {
    h = h.split('width:56px; height:56px; border-radius:50%;')
         .join('width:56px; height:56px; border-radius:50%; background-color:#F1E7D8;');
  }
  // 5. circular speaker portrait: cover-crop the landscape photo (idempotent)
  if (!h.includes('border-radius:50%; object-fit:cover;')) {
    h = h.split('width:120px; height:120px; border-radius:50%;')
         .join('width:120px; height:120px; border-radius:50%; object-fit:cover; object-position:center;');
  }
  // 6. collapse any duplicate declarations left by earlier non-idempotent runs
  h = h.split('background-color:#F1E7D8; background-color:#F1E7D8;').join('background-color:#F1E7D8;');
  h = h.split('object-fit:cover; object-position:center; object-fit:cover; object-position:center;').join('object-fit:cover; object-position:center;');

  fs.writeFileSync(fp, h, 'utf8');
  console.log('patched', file);
}

['awc-master-demo-640.html', 'awc-master-demo.html'].forEach(patch);
console.log('done.');
