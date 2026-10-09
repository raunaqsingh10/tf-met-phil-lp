# MET Philippines landing page

A mobile-first React, TypeScript, and Vite preview for the MET Philippines Social Adventure. The twelve customer-facing sections and trip copy follow the supplied HTML reference.

## Run locally

```bash
npm install
npm run dev
```

Quality checks: `npm run typecheck`, `npm run lint`, and `npm run build`. Inspect the production output with `npm run preview`.

## Funnel behavior

Every trip-details CTA opens the same popup containing the native GHL registration form. Registration continues to `/qualification`, where the native GHL survey routes visitors to `/book-call` or `/not-qualified`. Successful calendar bookings continue to `/call-confirmed`. Same-origin destinations loaded inside GHL iframes are promoted to the full page where the browser permits, with a continuation link if navigation is blocked.

Registration, qualification and consultation booking use the existing GHL integrations and published CRM workflows. The form and survey update the same contact. Local attribution retains non-sensitive query parameters in first and latest touches; only allowlisted marketing identifiers are forwarded into the embeds. Contact information is not added to embed URLs. This copy and styling update does not alter that behavior or revalidate live CRM submissions.

The hero uses the supplied trip footage as a muted, inline, autoplaying loop. Browsers that support it receive the original 1440 px / 60 fps WebM (about 4.9 MB); older browsers fall back to a 900 px / 30 fps H.264 MP4 (about 4.9 MB). Both encodes retain the full square frame so the MET logo stays visible at every viewport. A local poster is preloaded for the first frame, and visitors can pause or play the clip. Destination photos and traveller-message proof images are lazy-loaded local assets.

## Media and launch checks

The four destination photos for Moalboal, Coron, El Nido and Manila were supplied for this page update and resized locally. The supplied itinerary map is served locally as an optimized WebP. The hero video was supplied for this project. The four proof screenshots came from the supplied design HTML. The MET logo came from the local logo supplied for this project.

Before launch, MET should confirm the 18–26 December 2026 dates, 8 Days / 7 Nights duration, route nights, ₹1,74,000 price, and inclusions. The funnel uses approved campaign copy, including promises of WhatsApp itinerary delivery. **WhatsApp delivery has not been configured:** launch depends on MET supplying the final customer-facing itinerary and the delivery workflow being configured and verified. **Verify GHL meeting-confirmation notifications and joining instructions before launch.** Meta Pixel and Conversions API tracking are separate work; this refinement adds no conversion events.

The funnel pages and popup share the landing page's existing typography, palette and logo assets. The native GHL widget styles and content remain provider-controlled. The existing GHL script controls iframe sizing; direct-widget fallback links remain available if an embed fails to load.
