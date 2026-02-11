/**
 * lighthouse-fix3.js — Phase 13: Critical Core Web Vitals Fixes
 * 
 * Targets: LCP 21.3s → <2.5s, CLS 0.613 → <0.1, Accessibility
 * MUST run with Node.js to preserve UTF-8 Turkish characters.
 * 
 * Changes:
 * 1. Banner GIF (2.9MB!) loading="eager" → loading="lazy" on ALL pages
 * 2. YouTube iframes → lightweight facade (click-to-load)
 * 3. Defer joinchat CSS (render-blocking at bottom)
 * 4. Accessibility contrast fixes (#777 → #595959)
 * 5. CLS prevention: aspect-ratio for hero, contain for sections
 * 6. CSP header update for YouTube thumbnails (i.ytimg.com)
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let totalFiles = 0;
let totalChanges = 0;

// ─── Helpers ───────────────────────────────────────────────────────────
function getAllHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules'
        && entry.name !== 'hts-cache' && entry.name !== 'pagead2.googlesyndication.com'
        && entry.name !== 'www.egepen.com.tr') {
      results = results.concat(getAllHtmlFiles(full));
    } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ─── Fix 1: Banner GIF eager → lazy (ALL pages) ───────────────────────
// The 2-banner.gif is 2,948 KB and loaded with loading="eager" on every page.
// It is NOT the LCP element (hero images are). Making it lazy saves ~3MB of
// bandwidth that was competing with the actual LCP preload.
function fixBannerGif(html, filePath) {
  let count = 0;
  
  // Pattern: <img ... loading="eager" ... 2-banner.gif ...>
  // or: <img ... 2-banner.gif ... loading="eager" ...>
  const newHtml = html.replace(
    /(<img\s(?=[^>]*2-banner\.gif)[^>]*?)loading="eager"([^>]*?>)/gi,
    (match, before, after) => {
      count++;
      return before + 'loading="lazy"' + after;
    }
  );
  
  if (count > 0) {
    console.log(`  [banner] ${path.relative(ROOT, filePath)}: eager→lazy (${count})`);
  }
  return { html: newHtml, count };
}

// ─── Fix 2: YouTube iframe → facade (ALL pages with iframes) ──────────
// Each YouTube iframe costs ~500KB+ of JS/CSS even with loading="lazy".
// Facade pattern: show thumbnail + play button, load iframe on click.
function fixYouTubeFacade(html, filePath) {
  let count = 0;
  
  // Match various YouTube iframe patterns
  const newHtml = html.replace(
    /<iframe\s+(?=[^>]*youtube-nocookie\.com\/embed\/)([^>]*?)src="https:\/\/www\.youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)(?:\?[^"]*)?"\s*([^>]*?)><\/iframe>/gi,
    (match, before, videoId, after) => {
      // Extract title if present
      const titleMatch = (before + after).match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Video';
      
      // Extract width/height if present
      const wMatch = (before + after).match(/width="(\d+)"/);
      const hMatch = (before + after).match(/height="(\d+)"/);
      const w = wMatch ? wMatch[1] : '560';
      const h = hMatch ? hMatch[1] : '315';
      
      count++;
      return `<div class="yt-facade" style="position:relative;width:100%;max-width:${w}px;aspect-ratio:${w}/${h};background:#000;cursor:pointer;border-radius:8px;overflow:hidden;display:inline-block" onclick="this.outerHTML='<iframe src=\\'https://www.youtube-nocookie.com/embed/${videoId}?rel=0&amp;autoplay=1\\' width=\\'${w}\\' height=\\'${h}\\' style=\\'border:0\\' allowfullscreen allow=\\'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture\\' loading=\\'eager\\'></iframe>'" role="button" tabindex="0" aria-label="${title} - Videoyu oynatmak için tıklayın"><img loading="lazy" src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${title}" style="width:100%;height:100%;object-fit:cover;opacity:.75"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(255,0,0,.85);border-radius:14px;display:flex;align-items:center;justify-content:center"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div></div>`;
    }
  );
  
  if (count > 0) {
    console.log(`  [youtube] ${path.relative(ROOT, filePath)}: ${count} iframe(s) → facade`);
  }
  return { html: newHtml, count };
}

// ─── Fix 3: Defer joinchat CSS (pages that have it) ───────────────────
// The joinchat CSS is loaded synchronously at page bottom. While it doesn't
// block above-fold render, it still delays DOMContentLoaded and First Input.
function fixJoinchatCssDefer(html, filePath) {
  let count = 0;
  
  const newHtml = html.replace(
    /<link\s+rel="stylesheet"\s+type="text\/css"\s+href="([^"]*6zsmmfgi[^"]*)"\s+media="all"\s*\/>/gi,
    (match, href) => {
      count++;
      return `<link rel="stylesheet" type="text/css" href="${href}" media="print" onload="this.media='all'" />\n  <noscript><link rel="stylesheet" href="${href}" media="all" /></noscript>`;
    }
  );
  
  if (count > 0) {
    console.log(`  [joinchat-css] ${path.relative(ROOT, filePath)}: deferred`);
  }
  return { html: newHtml, count };
}

// ─── Fix 4: Sineklik-specific accessibility & CLS fixes ───────────────
function fixSineklikSpecific(html, filePath) {
  let count = 0;
  const orig = html;
  
  // 4a. Contrast fix: .eak-trust-item p { color: #777 } → #595959
  // #777 on white = 4.48:1 (FAILS AA), #595959 = 7.0:1 (PASSES AAA)
  html = html.replace(
    /(\.eak-trust-item\s+p\s*\{[^}]*?)color:\s*#777\b/g,
    '$1color: #595959'
  );
  
  // 4b. Contrast fix: .eak-pet-adv-list li color: #555 → #4a4a4a
  html = html.replace(
    /(\.eak-pet-adv-list\s+li\s*\{[^}]*?)color:\s*#555\b/g,
    '$1color: #4a4a4a'
  );
  
  // 4c. Contrast fix: .eak-faq-answer p color: #555 → #4a4a4a
  html = html.replace(
    /(\.eak-faq-answer\s+p\s*\{[^}]*?)color:\s*#555\b/g,
    '$1color: #4a4a4a'
  );
  
  // 4d. CLS prevention: Add aspect-ratio and contain to hero image container
  // Insert CLS-prevention CSS right after the EAK CSS v2 opening comment
  const clsPreventionCSS = `
                /* === CLS Prevention & Performance === */
                .eak-sineklik-hero-img img {
                  aspect-ratio: 800 / 738;
                  contain: layout style;
                }
                .eak-neden-img img {
                  aspect-ratio: 540 / 720;
                }
                .eak-type-card-img img {
                  aspect-ratio: 1 / 1;
                  object-fit: cover;
                }
                .eak-dcf-img img {
                  aspect-ratio: auto;
                  object-fit: cover;
                }
                /* Prevent CLS from FAQ accordion: use grid trick instead of max-height */
                .eak-faq-answer {
                  display: grid;
                  grid-template-rows: 0fr;
                  overflow: hidden;
                  transition: grid-template-rows .4s ease, padding .3s ease;
                  max-height: none !important;
                }
                .eak-faq-answer > * {
                  overflow: hidden;
                  min-height: 0;
                }
                .eak-faq-item.active .eak-faq-answer {
                  grid-template-rows: 1fr;
                  max-height: none !important;
                }
                /* Contain below-fold sections for paint optimization */
                .eak-detail-section,
                .eak-faq-section,
                .eak-gallery-section,
                .eak-video-grid,
                .eak-contact-section {
                  content-visibility: auto;
                  contain-intrinsic-size: auto 500px;
                }
                /* YouTube facade responsive */
                .yt-facade { transition: opacity .2s; }
                .yt-facade:hover img { opacity: 1 !important; }
`;
  
  // Insert after the EAK CSS comment
  html = html.replace(
    /(\/\* === EAK Sineklik Page Professional CSS v2 === \*\/)/,
    '$1\n' + clsPreventionCSS
  );
  
  if (html !== orig) {
    count = 5; // multiple sub-fixes
    console.log(`  [sineklik] ${path.relative(ROOT, filePath)}: contrast + CLS + contain fixes`);
  }
  return { html, count };
}

// ─── Fix 5: Add CLS prevention for enriched pages (pvc, cam-balkon, etc) ──
function fixEnrichedPageCLS(html, filePath) {
  let count = 0;
  
  // These pages have similar EAK CSS blocks - add content-visibility
  if (html.includes('EAK') && html.includes('eak-faq-section') && !filePath.includes('sineklik')) {
    // Add content-visibility to below-fold sections
    const clsCSS = `
                /* CLS Prevention */
                .eak-faq-section, .eak-gallery-section, .eak-video-grid, .eak-contact-section {
                  content-visibility: auto;
                  contain-intrinsic-size: auto 500px;
                }
                .eak-faq-answer {
                  display: grid;
                  grid-template-rows: 0fr;
                  overflow: hidden;
                  transition: grid-template-rows .4s ease, padding .3s ease;
                  max-height: none !important;
                }
                .eak-faq-answer > * { overflow: hidden; min-height: 0; }
                .eak-faq-item.active .eak-faq-answer {
                  grid-template-rows: 1fr;
                  max-height: none !important;
                }
                .yt-facade { transition: opacity .2s; }
                .yt-facade:hover img { opacity: 1 !important; }
`;
    html = html.replace(/(\/\* === EAK[^*]*\*\/)/, '$1\n' + clsCSS);
    count++;
    console.log(`  [cls] ${path.relative(ROOT, filePath)}: FAQ grid + content-visibility`);
  }
  
  return { html, count };
}

// ─── Fix 6: Update CSP in _headers for YouTube thumbnails ─────────────
function fixHeaders() {
  const headersPath = path.join(ROOT, '_headers');
  if (!fs.existsSync(headersPath)) return 0;
  
  let content = fs.readFileSync(headersPath, 'utf8');
  const orig = content;
  
  // Add i.ytimg.com to img-src for YouTube facade thumbnails
  if (!content.includes('i.ytimg.com')) {
    content = content.replace(
      /img-src\s+'self'\s+data:\s+https:\/\/egepenakcayapi\.com/,
      "img-src 'self' data: https://egepenakcayapi.com https://i.ytimg.com"
    );
  }
  
  if (content !== orig) {
    fs.writeFileSync(headersPath, content, 'utf8');
    console.log('  [headers] _headers: Added i.ytimg.com to img-src CSP');
    return 1;
  }
  return 0;
}

// ─── Main ──────────────────────────────────────────────────────────────
console.log('\n🚀 Phase 13: Critical Core Web Vitals Fixes\n');

const htmlFiles = getAllHtmlFiles(ROOT);
console.log(`Found ${htmlFiles.length} HTML files\n`);

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  let fileChanges = 0;
  
  // Fix 1: Banner GIF on all pages
  let r = fixBannerGif(html, filePath);
  html = r.html; fileChanges += r.count;
  
  // Fix 2: YouTube facades on all pages
  r = fixYouTubeFacade(html, filePath);
  html = r.html; fileChanges += r.count;
  
  // Fix 3: Defer joinchat CSS
  r = fixJoinchatCssDefer(html, filePath);
  html = r.html; fileChanges += r.count;
  
  // Fix 4: Sineklik-specific fixes
  if (filePath.includes('sineklik') && filePath.endsWith('index.html') 
      && !filePath.includes('etkili-sineklik')) {
    r = fixSineklikSpecific(html, filePath);
    html = r.html; fileChanges += r.count;
  }
  
  // Fix 5: Other enriched pages CLS
  r = fixEnrichedPageCLS(html, filePath);
  html = r.html; fileChanges += r.count;
  
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    totalFiles++;
    totalChanges += fileChanges;
  }
}

// Fix 6: _headers CSP update
totalChanges += fixHeaders();

console.log(`\n✅ Done: ${totalChanges} changes across ${totalFiles} files + _headers\n`);
