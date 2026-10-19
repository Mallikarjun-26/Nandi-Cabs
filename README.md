# Nandi Cabs

A lightweight, static, multi-page cab booking site. No build step or external JavaScript dependencies are required.

## Run locally

Serve this directory with any static web server (for example, `npx serve .`) and open the local URL. Do not open HTML files directly: absolute asset and route paths expect a web server at the domain root.

## Before launch

1. Update `site-config.js` with the real business name, phone link, WhatsApp international number, canonical domain and location.
2. Review `data/site-data.js`: fares and route distances are illustrative planning figures and must be confirmed by the operator before launch.
3. Replace sample testimonials with customer-approved quotes or remove them.
4. Review the draft privacy and booking terms with the operating business.
5. Replace any remaining section photographs if desired; the home hero is a locally optimized image and vehicle photos are in `assets/`.

The trip form gathers the passenger and journey details, creates a booking reference, and opens a prefilled WhatsApp Business chat after `whatsappNumber` is configured. The customer must press Send in WhatsApp; the page does not silently send messages or create a server-side reservation. If the number is blank, the final action remains disabled with a setup note. Browser-calculated estimates are not final booking prices.


Route cards and destination pages load Wikipedia article summaries and thumbnails from Wikimedia at runtime. Photo cards include creator/license credit links to Wikimedia Commons; the pages need an internet connection for this content.

## Search and business setup

Page titles and descriptions are unique in the static page heads and refined by `js/seo.js`. Canonical links, social preview URLs and breadcrumb URLs remain unset until `canonicalOrigin` in `site-config.js` is set to the production HTTPS domain. Populate `sitemap.xml` with absolute production URLs and add its production URL to `robots.txt` after setting the canonical domain. Add verified phone and WhatsApp details to the same config before launch; no street address, contact details, review scores or awards are invented.

Route carousel photos prefer a listed tourist attraction, then try other attractions and the destination thumbnail. Creator and license credits link to Wikimedia Commons.


## Static-host security headers

The _headers file provides baseline CSP, HSTS, clickjacking, MIME-sniffing, referrer and permissions headers for hosts that support this convention (including Netlify and Cloudflare Pages). GitHub Pages does not apply _headers; configure equivalent headers at the production CDN or hosting layer. Verify the deployed HTTPS response headers after publishing.
