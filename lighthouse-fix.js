/**
 * Lighthouse Performance & Accessibility Fix Script
 * Fixes: CSP font blocking, render-blocking CSS, accessibility contrast,
 *        font-display, network request chains
 * MUST run with Node.js (PowerShell corrupts UTF-8 Turkish chars)
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let totalChanges = 0;
const changeLog = [];

function log(file, change) {
  totalChanges++;
  changeLog.push(`  [${totalChanges}] ${path.relative(ROOT, file)}: ${change}`);
}

// ===== 1. FIX _headers CSP =====
function fixHeaders() {
  const hFile = path.join(ROOT, '_headers');
  let content = fs.readFileSync(hFile, 'utf8');
  const orig = content;

  // Fix font-src: add data: for inline font data URIs
  content = content.replace(
    /font-src 'self' https:\/\/fonts\.gstatic\.com https:\/\/cdnjs\.cloudflare\.com/,
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com"
  );

  // Fix connect-src: add googletagmanager for GA beacon requests
  content = content.replace(
    /connect-src 'self' https:\/\/www\.google-analytics\.com/,
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com"
  );

  // Fix img-src: add google analytics and egepen domains
  content = content.replace(
    /img-src 'self' data: https:\/\/egepenakcayapi\.com https:\/\/www\.google-analytics\.com/,
    "img-src 'self' data: https://egepenakcayapi.com https://www.google-analytics.com https://www.googletagmanager.com"
  );

  // Fix script-src: add analytics.google.com
  content = content.replace(
    /script-src 'self' 'unsafe-inline' 'unsafe-eval' https:\/\/www\.googletagmanager\.com https:\/\/www\.google-analytics\.com/,
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com"
  );

  if (content !== orig) {
    fs.writeFileSync(hFile, content, 'utf8');
    log(hFile, 'Fixed CSP: font-src data:, connect-src googletagmanager, img-src googletagmanager, script-src analytics');
  }
}

// ===== 2. FIX RENDER-BLOCKING CSS (7x953ny0) =====
// ===== 3. FIX ACCESSIBILITY =====
// ===== 4. FIX FONT PRELOADING =====
function fixHtmlFiles() {
  const htmlFiles = findHtmlFiles(ROOT);
  
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const orig = content;

    // --- 2a. Defer render-blocking 7x953ny0 CSS ---
    // Match both with and without spaces, with or without trailing slash
    const cssBlockingRegex = /(<link[^>]*href=["'][^"']*7x953ny0\/9rf2c\.css["'][^>]*) media=["']all["'](\s*\/?>)/gi;
    if (cssBlockingRegex.test(content)) {
      content = content.replace(cssBlockingRegex, (match, before, after) => {
        // Add media="print" onload trick for non-blocking CSS loading
        const deferred = `${before} media="print" onload="this.media='all'"${after}`;
        return deferred;
      });
      
      // Add noscript fallback if not present for 7x953ny0
      if (!content.includes('noscript') || !content.match(/noscript[^>]*>[^<]*7x953ny0/)) {
        // Find the deferred 7x953ny0 line and add noscript after it
        content = content.replace(
          /(<link[^>]*7x953ny0\/9rf2c\.css[^>]*media="print"[^>]*>)\s*\n/gi,
          (match, linkTag) => {
            // Extract the href from the link tag
            const hrefMatch = linkTag.match(/href=["']([^"']+)["']/);
            if (hrefMatch) {
              const href = hrefMatch[1];
              return `${linkTag}\n  <noscript><link rel="stylesheet" href="${href}" media="all" /></noscript>\n`;
            }
            return match;
          }
        );
      }
      
      log(file, 'Deferred render-blocking 7x953ny0 CSS');
    }

    // --- 3a. Accessibility: Add contrast & link distinguishability CSS ---
    // Only add once, check if already added
    if (!content.includes('/* Lighthouse Accessibility Fixes */')) {
      // Find the closing </style> before </head> or right before the custom-background style
      const a11yCss = `
  <style type="text/css">
    /* Lighthouse Accessibility Fixes */
    /* Ensure links are distinguishable from text */
    .entry-content a, .mh-widget a, .mh-footer a { text-decoration: underline; }
    .entry-content a:hover, .mh-widget a:hover, .mh-footer a:hover { text-decoration: none; }
    /* Navigation links - no underline needed (already distinguishable by context) */
    .mh-main-nav a, .mh-footer-nav a, .slicknav_nav a { text-decoration: none; }
    /* Ensure preheader text contrast (white on #1e73be = 4.6:1 ratio - passes AA) */
    .mh-preheader, .mh-preheader a, .mh-preheader .mh-header-date { color: #ffffff; }
    /* Ensure ticker text contrast */
    .mh-ticker-title { color: #ffffff; }
    /* Footer text contrast */
    .mh-footer { color: #d4d4d4; }
    .mh-footer a { color: #ffffff; }
    .mh-footer-bar { color: #cccccc; }
    .mh-footer-bar a { color: #ffffff; }
    /* Button contrast fix */
    input[type=submit], .mh-back-to-top { color: #ffffff; }
    /* Image caption contrast */
    .mh-image-caption { color: #ffffff; }
    /* Tag contrast */
    .entry-tags .fa, .entry-tags li:hover a { color: #ffffff; }
    /* Sub-heading contrast */
    .mh-subheading { color: #ffffff; }
    /* Meta text contrast - ensure minimum 4.5:1 */
    .mh-meta, .mh-meta a, .mh-excerpt .mh-meta { color: #595959; }
    /* Breadcrumb contrast */
    .mh-breadcrumb, .mh-breadcrumb a { color: #595959; }
    .mh-breadcrumb a:hover { color: #1e73be; }
  </style>`;
      
      // Insert before </head>
      content = content.replace('</head>', a11yCss + '\n</head>');
      log(file, 'Added accessibility contrast & link CSS');
    }

    // --- 4. Add font preload for critical Ubuntu font to reduce chain ---
    if (!content.includes('preload" as="font"') && !content.includes("preload' as='font'")) {
      // Add font preload after preconnect hints
      const fontPreload = `  <link rel="preload" as="font" type="font/woff2" href="https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoC1CzTtw.woff2" crossorigin>\n`;
      
      // Insert after the last preconnect line
      const preconnectPattern = /(<link[^>]*preconnect[^>]*fonts\.gstatic\.com[^>]*>)\s*\n/i;
      if (preconnectPattern.test(content)) {
        content = content.replace(preconnectPattern, (match, tag) => {
          return `${tag}\n${fontPreload}`;
        });
        log(file, 'Added Ubuntu font preload to reduce request chain');
      }
    }

    // --- 5. Ensure all links have proper aria attributes ---
    // Fix links that open in new window without rel="noopener"
    content = content.replace(
      /target=["']_blank["'](?![^>]*rel=)/gi,
      'target="_blank" rel="noopener noreferrer"'
    );

    // --- 6. Add fetchpriority="high" to LCP image preloads ---
    if (content.includes('preload" as="image"') && !content.includes('fetchpriority=')) {
      content = content.replace(
        /(<link[^>]*rel=["']preload["'][^>]*as=["']image["'])([^>]*>)/gi,
        '$1 fetchpriority="high"$2'
      );
      if (content !== orig) {
        log(file, 'Added fetchpriority="high" to LCP preload');
      }
    }

    // --- 7. Ensure meta theme-color for mobile browsers ---
    if (!content.includes('theme-color')) {
      content = content.replace(
        '<meta name="viewport"',
        '<meta name="theme-color" content="#1e73be">\n  <meta name="viewport"'
      );
      log(file, 'Added theme-color meta');
    }

    // Write if changed
    if (content !== orig) {
      fs.writeFileSync(file, content, 'utf8');
    }
  }
}

// ===== UTILITY: Find all HTML files recursively =====
function findHtmlFiles(dir) {
  const results = [];
  const skipDirs = ['hts-cache', 'pagead2.googlesyndication.com', 'www.egepen.com.tr', 
                    'egepenakcayapi.com', 'node_modules', '.git'];
  
  function walk(d) {
    const items = fs.readdirSync(d);
    for (const item of items) {
      const fullPath = path.join(d, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const baseName = path.basename(fullPath);
        if (!skipDirs.includes(baseName)) {
          walk(fullPath);
        }
      } else if (item.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  }
  walk(dir);
  return results;
}

// ===== RUN =====
console.log('=== Lighthouse Fix Script ===\n');

console.log('1. Fixing _headers CSP...');
fixHeaders();

console.log('2. Fixing HTML files (CSS, accessibility, fonts)...');
fixHtmlFiles();

console.log(`\n=== Done! ${totalChanges} changes across files ===\n`);
changeLog.forEach(c => console.log(c));
