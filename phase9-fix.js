/**
 * Phase 9 - Comprehensive SEO, Performance, Accessibility & Security Fix
 * Applies all remaining optimizations to the static site.
 * Run with: node phase9-fix.js
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
let totalChanges = 0;
const today = new Date().toISOString().split('T')[0]; // e.g. 2025-07-17

// ==========================================
// Image Dimension Helpers
// ==========================================
function getJpegDims(buf) {
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
  let off = 2;
  while (off < buf.length - 8) {
    if (buf[off] !== 0xFF) return null;
    const m = buf[off + 1];
    if (m === 0xC0 || m === 0xC1 || m === 0xC2) {
      return { w: buf.readUInt16BE(off + 7), h: buf.readUInt16BE(off + 5) };
    }
    if (m === 0xD9) return null; // EOI
    const segLen = buf.readUInt16BE(off + 2);
    if (segLen < 2) return null;
    off += 2 + segLen;
  }
  return null;
}

function getPngDims(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  return null;
}

function getDims(relPath) {
  try {
    const abs = path.join(BASE, relPath);
    const buf = fs.readFileSync(abs);
    const ext = path.extname(relPath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return getJpegDims(buf);
    if (ext === '.png') return getPngDims(buf);
  } catch (e) { /* file not found */ }
  return null;
}

// Add width/height to img tags missing them for a given src filename
function addDimsToImg(html, srcFilename, dims) {
  if (!dims) return html;
  const escaped = srcFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(<img\\b[^>]*src="[^"]*${escaped}"[^>]*?)(\\/?>)`, 'g');
  return html.replace(regex, (match, before, close) => {
    if (/\bwidth\s*=/.test(before)) return match; // already has dimensions
    return `${before} width="${dims.w}" height="${dims.h}"${close}`;
  });
}

// Find all root-level HTML files to apply global fixes
function findRootHtmlFiles() {
  const files = ['index.html'];
  const entries = fs.readdirSync(BASE, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    // Skip non-site directories
    if (['egepenakcayapi.com', 'hts-cache', 'pagead2.googlesyndication.com',
         'www.egepen.com.tr', '.git', '.wrangler', 'wp-content', 'wp-json',
         'node_modules', 'author', 'category', 'comments', 'feed'].includes(e.name)) continue;
    const idx = path.join(BASE, e.name, 'index.html');
    if (fs.existsSync(idx)) {
      files.push(path.join(e.name, 'index.html'));
    }
  }
  return files;
}

// ==========================================
// 1. Fix _headers - Security & Caching
// ==========================================
console.log('\n=== 1. _headers - Security & Caching ===');
fs.writeFileSync(path.join(BASE, '_headers'), `/*
  X-Robots-Tag: index, follow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: SAMEORIGIN

/wp-content/*
  Cache-Control: public, max-age=31536000, immutable
`, 'utf8');
totalChanges += 3;
console.log('  + Added HSTS header');
console.log('  + Added X-Frame-Options: SAMEORIGIN');
console.log('  + Added Cache-Control for /wp-content/* (1 year immutable)');

// ==========================================
// 2. Fix index.html (Homepage)
// ==========================================
console.log('\n=== 2. index.html (Homepage) ===');
let hp = fs.readFileSync(path.join(BASE, 'index.html'), 'utf8');

// 2a. LCP preload for hero image
if (!hp.includes('rel="preload"')) {
  hp = hp.replace(
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preload" as="image" href="wp-content/uploads/2023/03/cam-balkon-1-1-300x169.jpg">\n<link rel="preconnect" href="https://fonts.googleapis.com">'
  );
  totalChanges++;
  console.log('  + LCP preload for cam-balkon-1-1-300x169.jpg');
}

// 2b. Add LocalBusiness JSON-LD schema
const hpJsonLdMatch = hp.match(/<script type="application\/ld\+json" class="aioseo-schema">\n(.*)\n<\/script>/);
if (hpJsonLdMatch && !hp.includes('"LocalBusiness"')) {
  try {
    const jsonLd = JSON.parse(hpJsonLdMatch[1]);
    jsonLd['@graph'].push({
      "@type": "LocalBusiness",
      "@id": "https://egepenakcayapi.com/#localbusiness",
      "name": "Egepen Ak\u00e7ayap\u0131",
      "image": "https://egepenakcayapi.com/wp-content/uploads/2023/03/cropped-simge2023.png",
      "telephone": "+902128801507",
      "email": "info@egepenakcayapi.com",
      "url": "https://egepenakcayapi.com/",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "G\u00fcrp\u0131nar mah. G\u00fcrp\u0131nar cad. No: 26/A",
        "addressLocality": "Beylikd\u00fcz\u00fc",
        "addressRegion": "\u0130stanbul",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "41.0082",
        "longitude": "28.6422"
      },
      "priceRange": "$$",
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }]
    });
    hp = hp.replace(hpJsonLdMatch[1], JSON.stringify(jsonLd));
    totalChanges++;
    console.log('  + Added LocalBusiness JSON-LD schema');
  } catch (e) {
    console.log('  ! JSON-LD parse error:', e.message);
  }
}
fs.writeFileSync(path.join(BASE, 'index.html'), hp, 'utf8');

// ==========================================
// 3. Fix sineklik/index.html
// ==========================================
console.log('\n=== 3. sineklik/index.html ===');
let sk = fs.readFileSync(path.join(BASE, 'sineklik', 'index.html'), 'utf8');

// 3a. LCP preload for hero image
if (!sk.includes('rel="preload"')) {
  sk = sk.replace(
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preload" as="image" href="../wp-content/uploads/2022/05/kedi-sineklik-hero.jpg">\n<link rel="preconnect" href="https://fonts.googleapis.com">'
  );
  totalChanges++;
  console.log('  + LCP preload for kedi-sineklik-hero.jpg');
}

// 3b. Add width/height to images missing dimensions
const sineklikImages = [
  { src: 'kedi-sineklik-hero.jpg', file: 'wp-content/uploads/2022/05/kedi-sineklik-hero.jpg' },
  { src: 'sineklik-6.jpg', file: 'wp-content/uploads/2022/05/sineklik-6.jpg' },
  { src: 'duble-plise-sineklik.jpg', file: 'wp-content/uploads/2022/05/duble-plise-sineklik.jpg' },
  { src: 'sabit-sineklik-akcapen.png', file: 'wp-content/uploads/2022/05/sabit-sineklik-akcapen.png' },
  { src: 'kedi-sineklik.jpg', file: 'wp-content/uploads/2022/05/kedi-sineklik.jpg' },
];
for (const img of sineklikImages) {
  const dims = getDims(img.file);
  if (dims) {
    const before = sk;
    sk = addDimsToImg(sk, img.src, dims);
    if (sk !== before) {
      const escaped = img.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = before.match(new RegExp(`<img[^>]*${escaped}[^>]*(?!width)`, 'g'));
      const count = matches ? matches.filter(m => !/\bwidth\s*=/.test(m)).length : 0;
      totalChanges += Math.max(count, 1);
      console.log(`  + ${img.src}: ${dims.w}x${dims.h} (added to images without dims)`);
    }
  } else {
    console.log(`  ! Could not read dimensions for ${img.file}`);
  }
}

// 3c. Defer GA loading (still synchronous on sineklik page)
const syncGA = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B2KMZ3N2SS"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-B2KMZ3N2SS');
</script>`;
const deferredGA = `<!-- Google Analytics - deferred -->
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-B2KMZ3N2SS');
window.addEventListener('load', function() {
  var s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-B2KMZ3N2SS';
  s.async = true;
  document.head.appendChild(s);
});
</script>`;
if (sk.includes('<script async src="https://www.googletagmanager.com/gtag/js?id=G-B2KMZ3N2SS"></script>')) {
  sk = sk.replace(syncGA, deferredGA);
  totalChanges++;
  console.log('  + Deferred Google Analytics loading');
}

fs.writeFileSync(path.join(BASE, 'sineklik', 'index.html'), sk, 'utf8');

// ==========================================
// 4. Fix cam-balkon/index.html
// ==========================================
console.log('\n=== 4. cam-balkon/index.html ===');
let cb = fs.readFileSync(path.join(BASE, 'cam-balkon', 'index.html'), 'utf8');

// 4a. Add dimensions to product card images
const camBalkonImages = [
  { src: 'cam-balkon-3.jpg', file: 'wp-content/uploads/2022/05/cam-balkon-3.jpg' },
  { src: 'cam-balkon-6.jpg', file: 'wp-content/uploads/2022/05/cam-balkon-6.jpg' },
  { src: 'isicamli-cam-balkon.jpg', file: 'wp-content/uploads/2022/05/isicamli-cam-balkon.jpg' },
  { src: 'cam-balkon-perdesi-1.jpg', file: 'wp-content/uploads/2022/05/cam-balkon-perdesi-1.jpg' },
];
for (const img of camBalkonImages) {
  const dims = getDims(img.file);
  if (dims) {
    const before = cb;
    cb = addDimsToImg(cb, img.src, dims);
    if (cb !== before) {
      totalChanges++;
      console.log(`  + ${img.src}: ${dims.w}x${dims.h}`);
    }
  } else {
    console.log(`  ! Could not read dimensions for ${img.file}`);
  }
}

fs.writeFileSync(path.join(BASE, 'cam-balkon', 'index.html'), cb, 'utf8');

// ==========================================
// 5. Global Fixes Across All Root HTML Files
// ==========================================
console.log('\n=== 5. Global Fixes (all pages) ===');
const htmlFiles = findRootHtmlFiles();
console.log(`  Found ${htmlFiles.length} HTML files to process`);

let globalFixCount = 0;
for (const relFile of htmlFiles) {
  const absPath = path.join(BASE, relFile);
  let html = fs.readFileSync(absPath, 'utf8');
  const original = html;

  // 5a. Semantic <footer> tag for copyright section
  if (html.includes('<div class="mh-copyright-wrap">')) {
    html = html.replace('<div class="mh-copyright-wrap">', '<footer class="mh-copyright-wrap">');
    // Find the closing </div> before back-to-top link
    html = html.replace(
      /(<\/div>)\s*\n(<a href="#" class="mh-back-to-top")/,
      '</footer>\n$2'
    );
  }

  // 5b. aria-label on back-to-top button
  if (html.includes('class="mh-back-to-top"') && !html.includes('mh-back-to-top" aria-label')) {
    html = html.replace(
      'class="mh-back-to-top"',
      'class="mh-back-to-top" aria-label="Sayfa ba\u015f\u0131na d\u00f6n"'
    );
  }

  // 5c. aria-label on WhatsApp button (if missing)
  if (html.includes('class="joinchat__button"') &&
      !html.match(/joinchat__button"[^>]*aria-label/)) {
    html = html.replace(
      /class="joinchat__button" role="button" tabindex="0"(?!.*aria-label)/,
      'class="joinchat__button" role="button" tabindex="0" aria-label="WhatsApp ile ileti\u015fime ge\u00e7in"'
    );
  }

  // 5d. Remove broken www.egepen.com.tr image references (HTTrack artifacts)
  html = html.replace(/<img[^>]*src="[^"]*www\.egepen\.com\.tr\/images\/[^"]*\.html"[^>]*\/?>/g, '');

  // 5e. Defer synchronous GA on pages that still have it (not homepage, already done for sineklik)
  if (relFile !== 'index.html' && relFile !== path.join('sineklik', 'index.html')) {
    if (html.includes('<script async src="https://www.googletagmanager.com/gtag/js?id=G-B2KMZ3N2SS"></script>')) {
      html = html.replace(syncGA, deferredGA);
    }
  }

  if (html !== original) {
    fs.writeFileSync(absPath, html, 'utf8');
    globalFixCount++;
  }
}
totalChanges += globalFixCount;
console.log(`  + Applied fixes to ${globalFixCount} files (footer, aria-labels, broken imgs, GA defer)`);

// ==========================================
// 6. Fix sitemap.xml
// ==========================================
console.log('\n=== 6. sitemap.xml ===');
let sitemap = fs.readFileSync(path.join(BASE, 'sitemap.xml'), 'utf8');

// 6a. Add missing pages (4741-2/ and 4990-2/)
if (!sitemap.includes('4741-2')) {
  const newEntries = `  <url>
    <loc>https://egepenakcayapi.com/4741-2/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://egepenakcayapi.com/4990-2/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
`;
  sitemap = sitemap.replace('</urlset>', newEntries + '</urlset>');
  totalChanges += 2;
  console.log('  + Added 4741-2/ page');
  console.log('  + Added 4990-2/ page');
}

// 6b. Update stale lastmod dates (anything older than 2025) to today
let updatedDates = 0;
sitemap = sitemap.replace(/<lastmod>(202[0-4]-\d{2}-\d{2})<\/lastmod>/g, (match, date) => {
  updatedDates++;
  return `<lastmod>${today}</lastmod>`;
});
if (updatedDates > 0) {
  totalChanges += updatedDates;
  console.log(`  + Updated ${updatedDates} stale lastmod dates to ${today}`);
}

// 6c. Add cam-balkon page if missing (it should be there already)
if (!sitemap.includes('cam-balkon')) {
  const camBalkonEntry = `  <url>
    <loc>https://egepenakcayapi.com/cam-balkon/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  sitemap = sitemap.replace('</urlset>', camBalkonEntry + '</urlset>');
  totalChanges++;
  console.log('  + Added cam-balkon/ page');
}

fs.writeFileSync(path.join(BASE, 'sitemap.xml'), sitemap, 'utf8');

// ==========================================
// Summary
// ==========================================
console.log('\n==========================================');
console.log(`Total changes applied: ${totalChanges}`);
console.log('==========================================');
console.log('\nChanges summary:');
console.log('  - _headers: HSTS, X-Frame-Options, Cache-Control');
console.log('  - Homepage: LCP preload, LocalBusiness JSON-LD');
console.log('  - Sineklik: LCP preload, image dimensions (CLS), GA defer');
console.log('  - Cam Balkon: image dimensions (CLS)');
console.log('  - Global: semantic <footer>, aria-labels, broken img cleanup, GA defer');
console.log('  - Sitemap: added missing pages, updated lastmod dates');
