# MET Philippines landing page

A mobile-first React, TypeScript, and Vite preview for the MET Philippines Social Adventure. The twelve customer-facing sections and trip copy follow the supplied HTML reference.

## Run locally

```bash
npm install
npm run dev
```

Quality checks: `npm run typecheck`, `npm run lint`, and `npm run build`. Inspect the production output with `npm run preview`.

## Preview behavior

Every trip-details CTA opens the same lead sheet. First name and WhatsApp number are validated locally. Submitting displays a preview-only message; there is no lead API, booking page, or Cal.com form in this build. Entered details are never written to browser storage. Non-sensitive URL query parameters are retained in first and latest touch attribution, including repeated values, for the future connected funnel.

The hero uses the supplied trip footage as a muted, inline, autoplaying loop. Browsers that support it receive the original 1440 px / 60 fps WebM (about 4.9 MB); older browsers fall back to a 900 px / 30 fps H.264 MP4 (about 4.9 MB). Both encodes retain the full square frame so the MET logo stays visible at every viewport. A local poster is preloaded for the first frame, and visitors can pause or play the clip. Destination photos and traveller-message proof images are lazy-loaded local assets.

## Media and launch checks

The four destination photos for Moalboal, Coron, El Nido and Manila were supplied for this page update and resized locally. The supplied itinerary map is served locally as an optimized WebP. The hero video was supplied for this project. The four proof screenshots came from the supplied design HTML. The MET logo came from the local logo supplied for this project.

Before launch, MET should confirm the 18–26 December 2026 dates, 8 Days / 7 Nights duration, route nights, ₹1,74,000 price, and inclusions. The form copy for the later connected success state is reserved in `src/content.ts` and is intentionally not shown in this preview.
