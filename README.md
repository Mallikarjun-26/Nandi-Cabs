# Groovy Cabs

A lightweight, static, multi-page cab booking site. It runs without a build step or third-party JavaScript framework.

## Run locally

Serve this directory from a local static web server and open its URL. Do not open HTML files directly; the pages use root-relative asset and route links.

## Business configuration

- `site-config.js` is the single source for brand name, phone, WhatsApp number, service area and canonical domain.
- `data/site-data.js` contains the fleet, owner rate-card amounts, route estimates and FAQs. Fares remain indicative until the operator confirms a particular trip.
- Booking details are prepared in the visitor’s browser and opened in WhatsApp. The customer must tap Send; the site does not silently send messages or confirm/store a reservation on a server.
- Review the cancellation terms and privacy policy with the operator before treating those pages as final policy.
- Genuine customer reviews can be added once the business supplies approved review text and attribution. The site currently does not display sample testimonials, ratings or customer counts.

## SEO and conversion tracking

The static page heads contain page-specific titles, descriptions and canonical URLs for `https://groovycabs.com`. `sitemap.xml`, `robots.txt`, Open Graph metadata, TaxiService/Service/FAQ/Breadcrumb structured data and route pages use the same public domain.

The app queues descriptive conversion events in `window.dataLayer` and dispatches `groovy:conversion` events for calls, WhatsApp, booking and route actions. No Google Tag Manager or Ads ID is installed; add the owner’s verified measurement IDs before expecting events to appear in analytics or count as Ads conversions.

Route cards can retrieve destination summaries and images from Wikipedia/Wikimedia when network access is available.

## Hosting notes

`_headers` provides baseline security headers for static hosts that honor this format. GitHub Pages does not apply `_headers`; configure equivalent headers at the hosting/CDN layer and verify the deployed HTTPS responses.

