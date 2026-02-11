/**
 * Lighthouse Phase 2 Fix Script
 * Fixes remaining issues from new PageSpeed screenshots:
 * 1. fetchpriority="high" on LCP preload links
 * 2. Defer joinchat CSS (dpmgzvt/9rf2c.css)
 * 3. font-display: swap for Font Awesome
 * 4. Cache-Control for HTML in _headers
 * 5. Optimize Google Maps iframe with facade
 * 6. Remove unused preconnects, minimize critical chain
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

// ===== 1. FIX _headers - Cache-Control for HTML =====
function fixHeaders() {
  const hFile = path.join(ROOT, '_headers');
  let content = fs.readFileSync(hFile, 'utf8');
  const orig = content;

  // Add Cache-Control for root HTML pages (short cache + stale-while-revalidate)
  if (!content.includes('/*.html')) {
    content = content.trimEnd() + `

/*.html
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400

/
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400

/*/
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400
`;
    log(hFile, 'Added Cache-Control for HTML pages (1h cache + stale-while-revalidate)');
  }

  if (content !== orig) {
    fs.writeFileSync(hFile, content, 'utf8');
  }
}

// ===== 2. FIX ALL HTML FILES =====
function fixHtmlFiles() {
  const htmlFiles = findHtmlFiles(ROOT);
  
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const orig = content;

    // --- 2a. Fix fetchpriority on LCP preload links ---
    // The img tags already have fetchpriority, but preload links don't
    const preloadImgRegex = /(<link\s[^>]*rel=["']preload["'][^>]*as=["']image["'])(\s*[^>]*>)/gi;
    const newContent = content.replace(preloadImgRegex, (match, before, after) => {
      if (match.includes('fetchpriority')) return match; // already has it
      return `${before} fetchpriority="high"${after}`;
    });
    if (newContent !== content) {
      content = newContent;
      log(file, 'Added fetchpriority="high" to LCP image preload');
    }

    // --- 2b. Defer joinchat CSS (dpmgzvt) ---
    const joinchatCssRegex = /(<link[^>]*href=["'][^"']*dpmgzvt\/9rf2c\.css["'][^>]*) media=["']all["'](\s*\/?>)/gi;
    if (joinchatCssRegex.test(content)) {
      content = content.replace(joinchatCssRegex, (match, before, after) => {
        return `${before} media="print" onload="this.media='all'"${after}`;
      });
      // Add noscript fallback if not present
      content = content.replace(
        /(<link[^>]*dpmgzvt\/9rf2c\.css[^>]*media="print"[^>]*>)\s*\n/gi,
        (match, linkTag) => {
          const hrefMatch = linkTag.match(/href=["']([^"']+)["']/);
          if (hrefMatch && !content.includes('noscript') || !match.includes('noscript')) {
            // Check if noscript for dpmgzvt already exists nearby
            const afterPos = content.indexOf(match) + match.length;
            const nextChunk = content.substring(afterPos, afterPos + 200);
            if (!nextChunk.includes('dpmgzvt')) {
              return `${linkTag}\n  <noscript><link rel="stylesheet" href="${hrefMatch[1]}" media="all" /></noscript>\n`;
            }
          }
          return match;
        }
      );
      log(file, 'Deferred joinchat CSS (dpmgzvt) with print/onload');
    }

    // --- 2c. Add font-display: swap override for Font Awesome ---
    if (!content.includes("font-display: swap; /* FA override */")) {
      // Check if Font Awesome is used
      if (content.includes('font-awesome') || content.includes('fa fa-')) {
        const faOverride = `
  <style>@font-face { font-family: 'FontAwesome'; font-display: swap; /* FA override */ }</style>`;
        // Insert right before </head>
        const a11yMarker = '/* Lighthouse Accessibility Fixes */';
        if (content.includes(a11yMarker)) {
          // Insert before the accessibility style block
          content = content.replace(
            `<style type="text/css">\n    ${a11yMarker}`,
            `${faOverride}\n  <style type="text/css">\n    ${a11yMarker}`
          );
        } else {
          content = content.replace('</head>', `${faOverride}\n</head>`);
        }
        log(file, 'Added font-display: swap override for FontAwesome');
      }
    }

    // --- 2d. Lazy-load Google Maps iframe with facade pattern ---
    // Replace heavy iframe with a click-to-load facade
    if (content.includes('google.com/maps/embed') && !content.includes('maps-facade')) {
      content = content.replace(
        /<iframe([^>]*?)src=["'](https:\/\/www\.google\.com\/maps\/embed[^"']+)["']([^>]*?)><\/iframe>/gi,
        (match, before, mapSrc, after) => {
          // Extract width/height/style from original
          const styleMatch = (before + after).match(/style=["']([^"']+)["']/);
          const heightMatch = (before + after).match(/height=["'](\d+)["']/);
          const style = styleMatch ? styleMatch[1] : '';
          const height = heightMatch ? heightMatch[1] : '450';
          
          return `<div class="maps-facade" style="position:relative;${style ? style + ';' : ''}width:100%;max-width:1010px;height:${height}px;background:#e8e8e8;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;" onclick="this.innerHTML='<iframe src=\\'${mapSrc}\\' style=\\'border:0;width:100%;height:100%\\' allowfullscreen loading=\\'eager\\'></iframe>';this.style.cursor='default'" role="button" tabindex="0" aria-label="Google Haritayı yüklemek için tıklayın">
            <div style="text-align:center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#1e73be"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <p style="margin:8px 0 0;font-family:Ubuntu,sans-serif;font-size:16px;color:#333;">Haritayı Görmek İçin Tıklayın</p>
            </div>
          </div>`;
        }
      );
      log(file, 'Replaced Google Maps iframe with click-to-load facade');
    }

    // --- 2e. Remove dns-prefetch if preconnect already exists for same domain ---
    if (content.includes("dns-prefetch") && content.includes("preconnect")) {
      const dnsCount = (content.match(/dns-prefetch/g) || []).length;
      // Remove redundant dns-prefetch for fonts.googleapis.com (we already preconnect)
      const dnsLine = /\s*<link\s[^>]*rel=["']dns-prefetch["'][^>]*fonts\.googleapis\.com[^>]*\/?>[ \t]*\n?/gi;
      if (dnsLine.test(content)) {
        content = content.replace(dnsLine, '\n');
        log(file, 'Removed redundant dns-prefetch (preconnect already exists)');
      }
    }

    // --- 2f. Inline critical CSS for faster first paint ---
    // Add minimal critical CSS for above-the-fold layout (header, nav, colors)
    if (!content.includes('/* Critical CSS */')) {
      const criticalCss = `  <style>/* Critical CSS */.mh-container{max-width:1080px;margin:0 auto;padding:0 20px}.mh-header{background:#f0f8ff}.mh-preheader{background:#1e73be;color:#fff;padding:5px 0;font-size:12px}.mh-main-nav{background:#1e73be}.mh-main-nav a{color:#fff;padding:10px 12px;display:inline-block;font-size:13px;text-decoration:none}.mh-subheader{background:#1e73be;color:#fff}.clearfix:after{content:"";display:table;clear:both}.mh-col-1-3{width:33.33%;float:left}.mh-col-2-3{width:66.67%;float:left}@media(max-width:768px){.mh-col-1-3,.mh-col-2-3{width:100%;float:none}}</style>\n`;
      
      // Insert right after the global-styles-inline-css
      if (content.includes("id='global-styles-inline-css'")) {
        content = content.replace(
          /(<\/style>\s*\n)(\s*<!--\s*<link[^>]*mh-magazine-css|<link[^>]*7x953ny0)/,
          (match, styleEnd, nextLine) => {
            return `${styleEnd}${criticalCss}  ${nextLine}`;
          }
        );
        if (content.includes('/* Critical CSS */')) {
          log(file, 'Added inline critical CSS for faster first paint');
        }
      }
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
console.log('=== Lighthouse Phase 2 Fix Script ===\n');

console.log('1. Fixing _headers cache policy...');
fixHeaders();

console.log('2. Fixing HTML files...');
fixHtmlFiles();

console.log(`\n=== Done! ${totalChanges} changes across files ===\n`);
changeLog.forEach(c => console.log(c));
