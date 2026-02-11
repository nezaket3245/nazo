# COMPREHENSIVE SITE ANALYSIS REPORT
## egepenakcayapi.com — Static WordPress Mirror
### Analysis Date: July 2025 | Mirror Date: 9 February 2026

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Technical Foundation](#2-technical-foundation)
3. [Page-by-Page Analysis](#3-page-by-page-analysis)
4. [SEO Audit](#4-seo-audit)
5. [Accessibility Audit](#5-accessibility-audit)
6. [Performance Audit](#6-performance-audit)
7. [Content Quality Analysis](#7-content-quality-analysis)
8. [Structured Data / Schema.org](#8-structured-data--schemaorg)
9. [Critical Issues Summary](#9-critical-issues-summary)
10. [Recommendations](#10-recommendations)

---

## 1. EXECUTIVE SUMMARY

**Site:** egepenakcayapi.com  
**Business:** Egepen Akçayapı — Beylikdüzü İç ve Dış Dekorasyon (PVC windows, glass balconies, shower cabins, shutters, screens, aluminum joinery)  
**Location:** Gürpınar mah. Gürpınar cad. No: 26/A Beylikdüzü - İSTANBUL  
**Phone:** 0212 880 15 07 | Mobile: 0536 640 53 11  
**Pages Analyzed:** 16 HTML files across the mirror  
**Overall Health:** **MODERATE** — Good content quality on newer pages, but significant technical SEO issues, broken assets, and inconsistencies throughout.

### Quick Score Card

| Area | Score | Status |
|------|-------|--------|
| SEO Technical | 3/10 | CRITICAL issues |
| Content Quality | 7/10 | Good-Excellent on newer pages |
| Accessibility | 4/10 | Multiple failures |
| Performance | 5/10 | Moderate issues |
| Structured Data | 5/10 | Present but broken |
| Mobile Readiness | 7/10 | Good responsive CSS |

---

## 2. TECHNICAL FOUNDATION

### Platform Stack

| Component | Version / Detail |
|-----------|-----------------|
| CMS | WordPress 6.8.1 / 6.8.2 / 6.8.3 (MIXED versions across pages!) |
| Theme | MH Magazine Pro (`wp-theme-MHmagazinePro`) |
| SEO Plugin | All in One SEO (AIOSEO) 4.8.4.1 |
| Caching | WP Fastest Cache (minified files at `/wp-content/cache/wpfc-minified/`) |
| Gallery | WoowGallery v1.2.1 |
| WhatsApp | JoinChat (Creame WhatsApp Me) v6.0.5 / v6.0.8 |
| Slider | MetaSlider (referenced in other pages) |
| Analytics | Google Analytics GA4 (G-B2KMZ3N2SS) + UA (UA-137573464-2) |
| AdSense | ca-pub-1402695873572366 |
| Fonts | Google Fonts (Ubuntu: 300,400,400i,600,700) |
| Icons | Font Awesome 4.7.0 (CDN) |
| Language | Turkish (lang="tr"), charset UTF-8 |
| Static Mirror | HTTrack Website Copier, Mon 09 Feb 2026 |

### WordPress Version Inconsistency

| WP Version | Pages |
|------------|-------|
| 6.8.1 | enerji-tasarrufu-hesaplama, video-galeri, gizlilik-politikasi |
| 6.8.2 | legend-art-pencere-sistemleri, legend-pvc-pencereler |
| 6.8.3 | index.html (homepage), neden-egepen-deceuninck, iletisim-egepenakcayapi-kimdir, zendow-pencereler |

> **Issue:** Multiple WordPress versions across pages means pages were cached/generated at different times. Not critical but indicates the cache was never fully refreshed.

### Missing Files

| File | Status |
|------|--------|
| robots.txt | **NOT FOUND** in static mirror |
| sitemap.xml | **NOT FOUND** in static mirror |
| favicon.ico | Not explicitly linked (uses site icon via wp-content/uploads) |

---

## 3. PAGE-BY-PAGE ANALYSIS

### 3.1 Homepage (`/index.html`) — 1133 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `E G E P E N AKÇAYAPI` | **YES** — Spaces between letters, not descriptive |
| Meta description | About sineklik/screens | **YES** — Mismatch: describes screens, not the business |
| H1 | `SİNEKLİK SİSTEMLERİ` | **YES** — Homepage H1 is about one product, not the business |
| Canonical | `href="index.html"` (relative) | **CRITICAL** — Must be absolute URL |
| OG:image | Facebook profile URL | **CRITICAL** — Not a valid image |
| OG:type | `article` | **YES** — Homepage should be `website` |
| Content | Full sineklik page with hero, trust bar, 6 feature cards, 5 sineklik types (incl. kedi sinekliği), detailed product cards, tech specs table, montaj process, 8 usage areas, 8 FAQ items, gallery (6 photos), 2 YouTube videos, contact section with Google Maps | Content is EXCELLENT but it's repurposed as homepage |
| Inline CSS | ~400+ lines of custom `.eak-*` styles | **Performance issue** |
| Page ID | 2904 (WordPress page) | — |

> **Critical Finding:** The homepage is NOT a traditional homepage — it's a fully-featured Sineklik (Screen Systems) landing page being used as the homepage. This means visitors expecting to see an overview of all services instead see only one product category.

### 3.2 PVC Doğrama (`/pvc/index.html`) — 556 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `PVC Doğrama Beylikdüzü \| Egepen Deceuninck PVC Pencere Kapı Sistemleri - Akçayapı` | OK - Well optimized |
| Meta description | Comprehensive PVC description | OK |
| H1 | `PVC DOĞRAMA` (page) + 6 MORE H1 tags in content | **CRITICAL** — 7+ H1 tags! |
| Content | Detailed PVC systems (Legend 80mm/6 chamber, LegendArt 70mm/5 chamber, Zendow 70mm/5 chamber), comparison table, 16 colors, 5 FAQ items, 16-photo gallery, 2 YouTube videos | EXCELLENT content |
| Schema | FAQPage structured data | **Best schema on site** |
| Gallery alt text | Empty `alt=""` in WoowGallery JSON | **Accessibility issue** |

> **H1 Issue Detail:** Content H1s styled as `font-size:16px` include: "Neden PVC Kullanılmalıdır?", "PVC Doğrama Teknik Avantajları", "Egepen Deceuninck PVC Pencere ve Kapı Sistemleri", "Egepen Deceuninck PVC Profil Sistem Karşılaştırması", "Egepen Deceuninck Renk Seçenekleri", "Sıkça Sorulan Sorular (SSS)". These should be H2 or H3.

### 3.3 Cam Balkon (`/cam-balkon/index.html`) — 577 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Beylikdüzü Cam Balkon ve Cam Balkon Perdesi` | OK |
| Meta description | Comprehensive cam balkon description | OK |
| H1 | `CAM BALKON – CAM BALKON PERDESİ` | OK - Single H1 |
| Content | Intro with image, 4 advantage cards, 3 product types (Katlanır, Sürme, Isıcamlı), tech specs table, cam balkon perdesi (plise perde) section, CTA with phone/WhatsApp, 9+2 gallery photos, 2 YouTube videos, contact info with Google Maps | EXCELLENT |
| Inline CSS | ~100+ lines of custom `.eak-*` styles | **Performance** |
| Images | Good alt text on product images | OK |

### 3.4 Duşakabin (`/dusakabin/index.html`) — 608 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Beylikdüzü Duşakabin Akçapen Egepenakçayapı Duşakabin` | **Keyword stuffed** |
| Meta description | Comprehensive duşakabin description | OK |
| H1 | `DUŞAKABİN` | OK |
| Content | Intro, 4 feature cards ("Neden Akçayapı"), 3 service steps, 3 product cards (Köşe, Düz/Flat, Oval), tech specs table, 8 gallery photos, contact with email, Google Maps, CTA | EXCELLENT |
| Mobile number | **0541 350 37 08** | **INCONSISTENT** — All other pages show 0536 640 53 11 |
| Inline CSS | ~100+ lines | **Performance** |

### 3.5 Panjur (`/panjur/index.html`) — 640 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `PANJUR Beylikdüzü Pencere Panjur Beylikdüzü Motorlu Panjur` | **Keyword stuffed, repetitive** |
| Meta description | Comprehensive panjur description | OK |
| H1 | `PANJUR` | OK |
| Content | 4 advantage cards, 4 product types (Manuel, Motorlu/Kumandalı, Elektrikli, Güneş Enerjili), 4 detail cards with images, tech specs table, usage grid, 3 gallery photos, 2 YouTube videos, contact info, Google Maps, CTA | EXCELLENT — Most detailed page |
| Inline CSS | ~150+ lines | **Performance** |

### 3.6 Alüminyum Doğrama (`/aluminyum-dograma/index.html`) — 386 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Beylikdüzü PVC Doğrama, Alüminyum Doğrama, Giyotin Kapı` | OK but mentions PVC (wrong focus) |
| H1 | `ALÜMİNYUM DOĞRAMA` + 1 more H1 in content | **2 H1 tags** |
| Content | ONE short paragraph + gallery (9 photos) | **VERY THIN** — Weakest content page |
| No CTA | No call-to-action section | **Missing** |
| No specs | No technical specifications | **Missing** |
| Alt text | Main image: "Egepen Akcayapi" (generic) | **Should be descriptive** |

> **Priority Fix:** This page needs significant content expansion to match the quality of cam-balkon, duşakabin, and panjur pages.

### 3.7 Sineklik Article (`/etkili-sineklik-secimi.../index.html`) — 492 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Etkili Sineklik Seçimi ve Sineklerle Mücadelede Öneriler` | OK |
| H1 | `Etkili Sineklik Seçimi ve Sineklerle Mücadelede Öneriler` | OK |
| Content | Blog article: sineklik types, montaj, bakım, doğal sinek kovucular | Good article content |
| Category | KOLAY ÇÖZÜMLER | — |
| Date | 21 Temmuz 2023 | — |
| Contact icons | Generic alt="Egepen Akcayapi" | **Should be descriptive** |
| Broken images | pp1.html, egepen_logo.html | **BROKEN** — HTML files not images |

### 3.8 İletişim (`/iletisim/index.html`) — 411 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `E G E P E N AKÇAYAPI` | **CRITICAL** — Not optimized for contact page |
| H1 | `İLETİŞİM` | OK |
| Content | Address, phones, Google Maps iframe | OK but minimal |
| Schema | **No LocalBusiness schema** | **MAJOR** SEO miss |
| Alt text | Descriptive: "Adres", "Telefon", "Cep Telefonu" | Good on this page |
| Broken images | pp1.html, egepen_logo.html | **BROKEN** |

### 3.9 Legend Art Pencere (`/legend-art-pencere-sistemleri/index.html`) — 481 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Legend Art Pencere Sistemleri Nedir Nasıl Çalışır E G E P E N AKÇAYAPI` | OK but brand clutters |
| Meta description | Good description of LegendArt system | OK |
| Keywords | `kolay çözümler` | **Too generic** |
| Schema sameAs | Broken relative URLs for X/Instagram | **BROKEN** |

### 3.10 Legend PVC Pencereler (`/legend-pvc-pencereler.../index.html`) — 465 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Legend PVC Pencereler – Nedir & Nasıl Çalışır?` | OK |
| Meta description | **"Zendow Pencereler - NEDİR NASIL ÇALIŞIR..."** | **CRITICAL** — WRONG description! Copy-pasted from Zendow page |
| Schema description | Also says "Zendow Pencereler" | **CRITICAL** — Same copy-paste error |

### 3.11 Zendow Pencereler (`/zendow-pencereler/index.html`) — 468 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `* Zendow Pencereler - Farkları Nedir ve Nasıl Çalışırlar` | **Stray asterisk `*` in title!** |
| Meta description | Contains typo "SŞneklik" instead of "Sineklik" | **Typo** |
| Published | 27 August 2019 (oldest page) | — |

### 3.12 Neden Egepen Deceuninck (`/neden-egepen-deceuninck/index.html`) — 439 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `NEDEN EGEPEN DECEUNINCK? E G E P E N AKÇAYAPI` | OK |
| Meta description | Short but relevant | OK |
| Keywords | `kolay çözümler` | **Too generic** |

### 3.13 Enerji Tasarrufu Hesaplama (`/enerji-tasarrufu-hesaplama/index.html`) — 382 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `ENERJİ TASARRUFU HESAPLAMA E G E P E N AKÇAYAPI` | OK |
| Meta description | **"NERJİ TASARRUF HESABI..."** | **Missing leading "E"!** Truncated text |
| Keywords | **MISSING** | No meta keywords at all |

### 3.14 Video Galeri (`/video-galeri/index.html`) — 404 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Video Galeri EgepenAkçayapı Beylikdüzü İç ve Dış Tesisat` | OK |
| Meta description | Good with local keywords | OK |
| Keywords | Comprehensive keyword list | Good |

### 3.15 Gizlilik Politikası (`/gizlilik-politikasi/index.html`) — 432 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Gizlilik Politikası E G E P E N AKÇAYAPI` | OK |
| Meta description | Business description (not privacy-specific) | **Mismatch** |
| Keywords | Good local keywords | OK |

### 3.16 İletişim-EgepenAkçayapı-Kimdir (`/iletisim-egepenakcayapi-kimdir/index.html`) — 533 lines

| Property | Value | Issue? |
|----------|-------|--------|
| `<title>` | `Sayfa bulunamadı – E G E P E N AKÇAYAPI` | **404 ERROR PAGE!** |
| Robots | `noindex` | Correctly noindexed |
| Schema breadcrumb | "404 Hatası: sayfa bulunamadı" | — |

> **Finding:** This URL is a 404 page that was captured by HTTrack. The "About Us / Who We Are" page doesn't actually exist on the live site.

---

## 4. SEO AUDIT

### 4.1 Title Tags

| Issue | Severity | Affected Pages |
|-------|----------|----------------|
| Spaces between letters "E G E P E N" | HIGH | Homepage, İletişim |
| Generic/non-descriptive titles | HIGH | Homepage, İletişim |
| Stray `*` character in title | MEDIUM | Zendow Pencereler |
| Keyword-stuffed, repetitive titles | MEDIUM | Duşakabin, Panjur |
| Brand name appended inconsistently | LOW | Various |

### 4.2 Meta Descriptions

| Issue | Severity | Affected Pages |
|-------|----------|----------------|
| WRONG description (Zendow on Legend PVC page) | **CRITICAL** | Legend PVC Pencereler |
| Truncated "NERJİ" (missing leading "E") | HIGH | Enerji Tasarrufu |
| Homepage describes sineklik, not the business | HIGH | Homepage |
| Typo "SŞneklik" | MEDIUM | Zendow Pencereler |
| Privacy page describes business, not privacy | LOW | Gizlilik Politikası |

### 4.3 Canonical URLs

**ALL pages use relative canonical:** `<link rel="canonical" href="index.html" />`

This is **CRITICAL** — Search engines need absolute URLs for canonical tags. Every page effectively has `index.html` as its canonical, which is ambiguous and could cause canonicalization issues.

**Fix:** All canonicals should be absolute, e.g., `https://egepenakcayapi.com/pvc/`

### 4.4 Heading Hierarchy

| Page | H1 Count | Issue |
|------|----------|-------|
| PVC Doğrama | **7+** | CRITICAL — Multiple H1 tags styled as body text |
| Alüminyum Doğrama | **2** | Multiple H1 tags |
| Homepage | **1** | OK count, but H1 is "SİNEKLİK SİSTEMLERİ" (wrong for homepage) |
| All other pages | 1 | OK |

### 4.5 Open Graph Issues

| Issue | Severity | Scope |
|-------|----------|-------|
| `og:image` points to Facebook profile URL, not a real image | **CRITICAL** | ALL 16 pages |
| `og:type` is "article" on homepage | HIGH | Homepage (should be "website") |
| No `og:image:width` / `og:image:height` | MEDIUM | ALL pages |
| No Twitter Card meta tags | MEDIUM | ALL pages |

### 4.6 Verification Tags — ALL WRONG

```html
<meta name="google-site-verification" content="UA-137573464-2" />
<meta name="msvalidate.01" content="UA-137573464-2" />
<meta name="p:domain_verify" content="UA-137573464-2" />
<meta name="yandex-verification" content="UA-137573464-2" />
<meta name="baidu-site-verification" content="UA-137573464-2" />
```

**ALL verification tags use the same value: a Google Analytics tracking ID (UA-137573464-2).** This is NOT a verification code. None of these verifications are valid.

### 4.7 Duplicate/Missing Analytics

| Tracking | Location | Status |
|----------|----------|--------|
| GA4 (G-B2KMZ3N2SS) | `<head>` of all pages | Active |
| UA (UA-137573464-2) | Footer `<script>` of all pages | **DEPRECATED** — Universal Analytics sunset July 2024 |

**Fix:** Remove the deprecated UA tracking code from the footer. It wastes a network request and loads unused JavaScript.

### 4.8 Internal Linking Issues

- Search form `action` points to `https://egepenakcayapi.com/` (won't work in static mirror)
- Breadcrumb "Home" text is "Ev" (Turkish) in schema but "Home" in some visible breadcrumbs — minor inconsistency
- News ticker properly links to 10 articles in KOLAY ÇÖZÜMLER category

### 4.9 Missing robots.txt and sitemap.xml

Neither file exists in the static mirror. On the live site, these should absolutely exist:
- `robots.txt` — To control crawler access
- `sitemap.xml` — To facilitate indexing

---

## 5. ACCESSIBILITY AUDIT

### 5.1 Image Alt Text Analysis

| Pattern | Pages | Issue |
|---------|-------|-------|
| WoowGallery images: `alt=""` (empty) in JSON | ALL pages with galleries | **FAIL** — Screen readers skip these entirely |
| Noscript fallback: `alt="Galeri Gorseli"` (generic) | ALL galleries | One generic label for all images |
| Contact icons: `alt="Egepen Akcayapi"` (generic) | Sineklik article | Not descriptive of the icon |
| Contact icons: `alt="Adres"`, `alt="Telefon"` | İletişim, Panjur | GOOD — descriptive |
| Product images: descriptive alt text | Cam Balkon, Duşakabin, Panjur, Homepage | GOOD |
| Main image: `alt="Egepen Akcayapi"` (generic) | Alüminyum Doğrama | Should describe the image |
| Broken `.html` images | Sineklik, İletişim, Cam Balkon | `pp1.html` and `egepen_logo.html` — not images |

### 5.2 Semantic HTML

| Element | Status |
|---------|--------|
| `role="main"` on content | Present on most pages |
| `role="search"` on search form | Present |
| `role="button"` on JoinChat | Present |
| `aria-label` on JoinChat button | "Yardıma mı ihtiyacınız var? Open chat" (mixed Turkish/English) |
| `aria-modal` on JoinChat dialog | Present |
| `<nav>` for navigation | Uses `<ul class="nav-menu">` (semantic) |
| `itemprop` attributes | Present on content areas |
| Skip navigation link | **MISSING** |
| Focus management | No visible focus indicators defined |

### 5.3 Color Contrast

The site uses a blue (#1e73be) primary color on white backgrounds. Based on CSS analysis:
- Primary text (#444) on white (#fff): ~9.7:1 ratio — PASS
- Link color (#1e73be) on white: ~4.6:1 ratio — PASS (AA)
- Light text (#666, #777, #888) on white: Some may fail AA for small text
- White text on blue gradient: Generally passes

### 5.4 Keyboard Navigation

- FAQ items use `onclick` handlers — **Not keyboard accessible** (no `onkeydown` handler)
- JoinChat button has `tabindex="0"` — Keyboard accessible
- CTA links are standard `<a>` tags — Keyboard accessible
- Gallery lightbox (WoowGallery) — Unknown keyboard support

---

## 6. PERFORMANCE AUDIT

### 6.1 Render-Blocking Resources

| Resource | Location | Impact |
|----------|----------|--------|
| Google Analytics GA4 (`gtag.js`) | `<head>` with `async` | Low (async) |
| Google AdSense | `<head>` with `async` | Low-Medium (async but heavy) |
| WP Fastest Cache minified CSS | `<head>` | Expected |
| Google Fonts (Ubuntu family) | `<head>` external request | Medium — blocks rendering |
| Font Awesome 4.7.0 (CDN) | Via CSS | Medium |

### 6.2 Inline CSS Bloat

| Page | Inline CSS Lines | Issue |
|------|-----------------|-------|
| Homepage (Sineklik) | ~400+ lines | **SEVERE** — Should be external file |
| Cam Balkon | ~100+ lines | HIGH |
| Duşakabin | ~100+ lines | HIGH |
| Panjur | ~150+ lines | HIGH |
| WordPress global styles | ~80 lines (on every page) | Standard WP behavior |

**Total inline CSS across pages: ~830+ lines** that should be in a shared external stylesheet.

### 6.3 JavaScript

| Script | Loading | Impact |
|--------|---------|--------|
| WoowGallery settings (inline) | Head | Low |
| WP Fastest Cache bundled JS | Head | Expected |
| Emoji detection script | Inline (~60 lines per page) | **Unnecessary for most sites** |
| UA Analytics (footer) | `async` | **WASTEFUL** — deprecated, should remove |
| JoinChat QR + main | `defer` | Optimal |
| WoowGallery lightbox + skin | `defer` | Optimal |
| speculationrules (prefetch) | Inline JSON | Modern — good |

### 6.4 Image Optimization

| Concern | Detail |
|---------|--------|
| `fetchpriority="high"` | Used on hero images — GOOD |
| `loading="lazy"` | Used on below-fold images — GOOD |
| `decoding="async"` | Used — GOOD |
| Format | JPEG and PNG — No WebP/AVIF detected |
| Contain intrinsic size | `contain-intrinsic-size: 3000px 1500px` — GOOD for CLS |
| Broken images | `pp1.html` and `egepen_logo.html` (HTML files, not images) |
| External images | Egepen.com.tr color swatches (all .html files — BROKEN) |

### 6.5 Caching

WP Fastest Cache timestamps found:
```
Homepage: 27 December 2025 @ 20:28 (0.139 seconds)
Other pages: Various dates (July-December 2025)
```

Cache is active and generating quickly.

---

## 7. CONTENT QUALITY ANALYSIS

### 7.1 Content Depth Comparison

| Page | Word Count (est.) | Sections | Gallery | Video | FAQ | Specs Table | CTA | Rating |
|------|-------------------|----------|---------|-------|-----|-------------|-----|--------|
| Homepage/Sineklik | 2500+ | 10+ | Yes (6) | Yes (2) | Yes (8) | Yes | Yes (2) | **EXCELLENT** |
| PVC Doğrama | 2000+ | 8+ | Yes (16) | Yes (2) | Yes (5) | Yes | No | **EXCELLENT** |
| Cam Balkon | 1500+ | 7+ | Yes (11) | Yes (2) | No | Yes | Yes | **EXCELLENT** |
| Duşakabin | 1500+ | 7+ | Yes (8) | No | No | Yes | Yes | **EXCELLENT** |
| Panjur | 2000+ | 9+ | Yes (3) | Yes (2) | No | Yes | Yes | **EXCELLENT** |
| Alüminyum Doğrama | **150-200** | **1** | Yes (9) | No | No | No | **No** | **POOR** |
| Sineklik Article | 800+ | 5+ | No | No | No | No | No | GOOD |
| İletişim | 300+ | 3 | No | No | No | No | No | ADEQUATE |

### 7.2 Content Issues

1. **Alüminyum Doğrama is critically thin** — Only one short paragraph while comparable service pages have 1500-2500+ words
2. **Homepage content mismatch** — Full sineklik page used as homepage; visitors expecting business overview see only screens
3. **No "About Us" page** — The `/iletisim-egepenakcayapi-kimdir/` URL returns 404
4. **Inconsistent page design eras** — Newer pages (cam-balkon, duşakabin, panjur, homepage) use modern `.eak-*` CSS design system; older pages (sineklik article, alüminyum, iletişim) use simpler layouts
5. **Blog content sparse** — Only 10 articles in "KOLAY ÇÖZÜMLER" category (shown in news ticker)

### 7.3 Contact Information Consistency

| Data Point | Most Pages | Duşakabin Page | Issue |
|------------|-----------|---------------|-------|
| Phone | 0212 880 15 07 | 0212 880 15 07 | OK |
| Mobile | 0536 640 53 11 | **0541 350 37 08** | **INCONSISTENT** |
| Email | info@egepenakcayapi.com | info@egepenakcayapi.com | OK |
| WhatsApp | 902128801507 | 902128801507 | OK |
| Address | Same everywhere | Same | OK |

---

## 8. STRUCTURED DATA / SCHEMA.ORG

### 8.1 Schema Types Present

All pages include AIOSEO-generated JSON-LD with:
- `BreadcrumbList` — Present on all pages
- `Organization` — Present on all pages (name, logo, telephone, url)
- `WebPage` — Present on all pages
- `WebSite` — Present on all pages
- `Person` (author) — Present on article pages
- `FAQPage` — Present ONLY on PVC page

### 8.2 Schema Issues

| Issue | Severity | Scope |
|-------|----------|-------|
| `sameAs` URLs broken (relative): `"index.html//x.com/..."` and `"index.html//instagram.com/..."` | **CRITICAL** | ALL pages except `iletisim-egepenakcayapi-kimdir` (which has correct absolute URLs) |
| No `LocalBusiness` schema | **HIGH** | Contact page — should have address, hours, phone |
| No `Product` or `Service` schema | MEDIUM | Service pages |
| Breadcrumb "Ev" (Turkish) but only 1 item on homepage | LOW | Homepage |
| WebPage description duplicates meta description issues | MEDIUM | Legend PVC, Homepage |
| No `VideoObject` schema for YouTube embeds | MEDIUM | Pages with videos |
| No `FAQPage` schema on homepage (which has 8 FAQs!) | HIGH | Homepage |

### 8.3 Broken sameAs URLs (appearing on nearly all pages)

```json
"sameAs": [
  "https://facebook.com/egepenakcayapı",     // ✅ OK (absolute)
  "index.html//x.com/egepenakcayapı",         // ❌ BROKEN (relative)
  "index.html//instagram.com/egepenakcayapı", // ❌ BROKEN (relative)
  "https://youtube.com/egepenakcayapı"        // ✅ OK (absolute)
]
```

**Should be:**
```json
"sameAs": [
  "https://facebook.com/egepenakcayapı",
  "https://x.com/egepenakcayapı",
  "https://instagram.com/egepenakcayapı",
  "https://youtube.com/egepenakcayapı"
]
```

---

## 9. CRITICAL ISSUES SUMMARY

### Priority 1 — CRITICAL (Fix Immediately)

| # | Issue | Impact | Affected |
|---|-------|--------|----------|
| 1 | **OG:image on ALL pages points to Facebook profile URL** — Not a valid image; social shares will have no image | Social sharing completely broken | ALL 16 pages |
| 2 | **Relative canonical URLs** (`href="index.html"`) — Confuses search engines about canonical pages | SEO ranking, duplicate content | ALL 16 pages |
| 3 | **Legend PVC page has WRONG meta description** (says "Zendow Pencereler") | Wrong page shown in search results | Legend PVC |
| 4 | **All verification codes are wrong** (using GA tracking ID) | Google/Bing/Yandex/Baidu verification fails | ALL pages |
| 5 | **Broken sameAs URLs in Schema.org** — X and Instagram use relative paths | Rich results broken | ALL pages (except 1) |
| 6 | **7+ H1 tags on PVC page** | Confuses search engines about page topic | PVC Doğrama |
| 7 | **Broken external images** (pp1.html, egepen_logo.html) — Loading HTML as images | Visual breakage, 404-like errors | Sineklik article, İletişim, Cam Balkon |

### Priority 2 — HIGH (Fix Soon)

| # | Issue | Impact |
|---|-------|--------|
| 8 | Homepage title "E G E P E N AKÇAYAPI" with spaces, not descriptive | Poor CTR in search results |
| 9 | Homepage meta description about sineklik, not the business | Misleading in search results |
| 10 | Homepage H1 is "SİNEKLİK SİSTEMLERİ" — not suitable for homepage | SEO confusion |
| 11 | İletişim page has generic title, no LocalBusiness schema | Lost local SEO opportunity |
| 12 | No robots.txt or sitemap.xml | Crawling/indexing issues |
| 13 | No Twitter Card meta tags | Missing social reach |
| 14 | Deprecated Universal Analytics (UA) still loading in footer | Wasted resources |
| 15 | Gallery images have empty alt text in WoowGallery | Accessibility WCAG failure |
| 16 | Alüminyum Doğrama page is critically thin | Poor ranking potential |
| 17 | Inconsistent mobile phone number (duşakabin page) | Customer confusion |
| 18 | No "About Us" page (404 error) | Missing business credibility |

### Priority 3 — MEDIUM (Improve)

| # | Issue | Impact |
|---|-------|--------|
| 19 | Massive inline CSS (830+ lines) across pages | Slow initial paint |
| 20 | Font Awesome 4.7.0 outdated | Security, missing features |
| 21 | No WebP/AVIF image formats | Larger file sizes |
| 22 | FAQ items not keyboard-accessible (onclick only) | A11y failure |
| 23 | Zendow title has stray asterisk `*` | Unprofessional |
| 24 | Zendow description typo "SŞneklik" | Credibility |
| 25 | Enerji Tasarrufu description truncated "NERJİ" | Broken snippet |
| 26 | Mixed WordPress versions across pages | Cache inconsistency |
| 27 | No FAQPage schema on homepage (has 8 FAQs) | Missed rich results |
| 28 | OG:type "article" on homepage (should be "website") | Minor schema error |
| 29 | No VideoObject schema for YouTube embeds | Missed video rich results |
| 30 | Google Fonts external dependency | Performance, GDPR |

---

## 10. RECOMMENDATIONS

### Immediate Actions (Week 1)

1. **Fix OG:image on ALL pages** — Upload a proper 1200x630px image to the site and set it as the default social image in AIOSEO settings
2. **Fix canonical URLs** — Change all `href="index.html"` to absolute URLs like `href="https://egepenakcayapi.com/pvc/"`
3. **Fix Legend PVC meta description** — Currently shows Zendow content; write proper Legend PVC description
4. **Fix Schema sameAs URLs** — Change `index.html//x.com/` to `https://x.com/` and same for Instagram in AIOSEO Social settings
5. **Get actual verification codes** from Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and replace the UA tracking ID
6. **Fix H1 hierarchy on PVC page** — Change the 6 content H1s to H2 or H3

### Short-term Actions (Month 1)

7. **Create a proper homepage** — Either create a new homepage with business overview + service links, or add a hero with all services above the sineklik content
8. **Optimize İletişim page** — Add proper title ("İletişim | Egepen Akçayapı Beylikdüzü"), add LocalBusiness schema
9. **Expand Alüminyum Doğrama page** — Add advantages, product types, specs table, FAQ, CTA (matching cam-balkon/duşakabin quality)
10. **Create robots.txt and XML sitemap** — Standard SEO essentials
11. **Remove deprecated UA Analytics** — Keep only GA4
12. **Add Twitter Card meta tags** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
13. **Fix phone number consistency** — Decide between 0536 640 53 11 and 0541 350 37 08 and use one consistently
14. **Fix or remove broken external images** (pp1.html, egepen_logo.html from egepen.com.tr)

### Medium-term Actions (Quarter 1)

15. **Extract inline CSS** into a shared `.eak-styles.css` file — Saves ~830 lines of repeated inline CSS
16. **Add FAQPage schema** to homepage (8 FAQs) and other pages with FAQ sections
17. **Add alt text to ALL WoowGallery images** — Descriptive, unique alt text for each gallery image
18. **Add VideoObject schema** for all YouTube embeds
19. **Upgrade Font Awesome** from 4.7.0 to 6.x (or switch to self-hosted subset)
20. **Convert images to WebP** format with JPEG fallback
21. **Self-host Google Fonts** for GDPR compliance and performance
22. **Create an "About Us" page** — Currently returns 404
23. **Make FAQ items keyboard-accessible** — Add `onkeydown` handler or use `<details>`/`<summary>` elements
24. **Add skip navigation link** for screen reader users
25. **Fix Zendow title** (remove `*`) and description (fix "SŞneklik" typo)
26. **Fix Enerji Tasarrufu description** (add missing "E" → "ENERJİ")

---

## APPENDIX A: Full Page Inventory

| # | URL Path | Lines | Type | WP Ver |
|---|----------|-------|------|--------|
| 1 | `/` (index.html) | 1133 | Page (Sineklik as HP) | 6.8.3 |
| 2 | `/pvc/` | 556 | Page | 6.8.1 |
| 3 | `/cam-balkon/` | 577 | Page | 6.8.1 |
| 4 | `/dusakabin/` | 608 | Page | 6.8.1 |
| 5 | `/panjur/` | 640 | Page | 6.8.1 |
| 6 | `/aluminyum-dograma/` | 386 | Page | 6.8.1 |
| 7 | `/iletisim/` | 411 | Page | 6.8.1 |
| 8 | `/etkili-sineklik-secimi...` | 492 | Article | 6.8.1 |
| 9 | `/legend-art-pencere-sistemleri/` | 481 | Article | 6.8.2 |
| 10 | `/legend-pvc-pencereler.../` | 465 | Article | 6.8.2 |
| 11 | `/zendow-pencereler/` | 468 | Article | 6.8.3 |
| 12 | `/neden-egepen-deceuninck/` | 439 | Article | 6.8.3 |
| 13 | `/enerji-tasarrufu-hesaplama/` | 382 | Page | 6.8.1 |
| 14 | `/video-galeri/` | 404 | Page | 6.8.1 |
| 15 | `/gizlilik-politikasi/` | 432 | Page | 6.8.1 |
| 16 | `/iletisim-egepenakcayapi-kimdir/` | 533 | **404 Error** | 6.8.3 |

## APPENDIX B: Navigation Menu Structure

```
Ana Sayfa
├── PVC Doğrama
│   ├── Legend PVC Pencereler
│   ├── Legend Art Pencere Sistemleri
│   └── Zendow Pencereler
├── Cam Balkon
├── Alüminyum Doğrama
├── Duşakabin
├── Panjur
├── Sineklik
├── Kolay Çözümler (category)
│   └── (10 articles)
├── Video Galeri
├── İletişim
│   └── Egepen Akçayapı Kimdir? (404!)
└── Enerji Hesaplama
```

## APPENDIX C: External Dependencies

| Resource | URL | Risk |
|----------|-----|------|
| Google Analytics GA4 | googletagmanager.com | Low |
| Google Analytics UA | googletagmanager.com | **Remove** (deprecated) |
| Google AdSense | pagead2.googlesyndication.com | Low |
| Google Fonts | fonts.googleapis.com | GDPR risk |
| Font Awesome 4.7.0 | CDN (via WP Fastest Cache) | Outdated |
| YouTube embeds | youtube.com/embed | Standard |
| Google Maps | google.com/maps/embed | Standard |
| Gravatar | secure.gravatar.com | Standard |

---

*This report is READ-ONLY analysis. No files were modified.*  
*Generated by comprehensive static mirror analysis of egepenakcayapi.com*
