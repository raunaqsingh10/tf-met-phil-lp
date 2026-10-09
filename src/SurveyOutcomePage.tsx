import { useEffect, useMemo } from 'react'
import { getAttribution } from './lib/attribution'
import './styles.css'
import './qualification.css'
import './outcomes.css'

const marketingIds = new Set([
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid',
  'campaign_id', 'adset_id', 'ad_id',
])

function withAttribution(): string {
  const next = new URL(window.location.href)
  const keys = new Set([...next.searchParams.keys()].map((k) => k.toLowerCase()))
  for (const [key, value] of getAttribution()?.latestTouch.params ?? []) {
    const normalized = key.toLowerCase()
    if ((normalized.startsWith('utm_') || marketingIds.has(normalized)) && !keys.has(normalized)) {
      next.searchParams.append(key, value)
      keys.add(normalized)
    }
  }
  return next.toString()
}

type Outcome = 'book-call' | 'not-qualified'

export function SurveyOutcomePage({ outcome }: { outcome: Outcome }) {
  const destinationUrl = useMemo(withAttribution, [])
  const nestedInIframe = window.self !== window.top

  useEffect(() => {
    // GHL survey redirects may be contained in the embedded iframe.
    // Promote same-origin outcome pages to a normal browser navigation.
    if (nestedInIframe) {
      try {
        window.top?.location.replace(destinationUrl)
      } catch {
        // If navigation is blocked, provide a user-initiated top-frame link.
      }
      return
    }

    if (destinationUrl !== window.location.href) {
      window.history.replaceState(window.history.state, '', destinationUrl)
    }
  }, [destinationUrl, nestedInIframe])

  if (nestedInIframe) {
    return (
      <main className="qualification-iframe-redirect">
        <p>Taking you to the next step…</p>
        <a href={destinationUrl} target="_top">Continue to the full page</a>
      </main>
    )
  }

  const booking = outcome === 'book-call'
  return (
    <main className="qualification-page outcome-page">
      <header className="qualification-header">
        <a href="/" className="qualification-brand" aria-label="MET Philippines landing page">MET <span>PHILIPPINES</span></a>
      </header>
      <section className="outcome-intro" aria-labelledby="outcome-title">
        <p className="eyebrow">Philippines social adventure · 18–26 December 2026</p>
        {booking ? (
          <>
            <h1 id="outcome-title">Let's talk about your Philippines trip.</h1>
            <p>Thanks for answering those questions. The next step is a quick conversation with the MET team to understand the experience and ask anything that's on your mind.</p>
            <p>Booking a call is not an approval or a commitment to join the trip.</p>
            <section className="outcome-pending" aria-label="Booking calendar not yet connected">
              <h2>Call booking is being set up</h2>
              <p>The MET consultation calendar has not been connected to this preview yet. We will add it here before the funnel goes live.</p>
            </section>
          </>
        ) : (
          <>
            <h1 id="outcome-title">Thanks for your interest in the Philippines trip.</h1>
            <p>Based on your answers, it looks like this particular trip may not be the right fit right now.</p>
            <p>We appreciate you taking the time to explore the experience. There's no further action needed.</p>
            <a className="outcome-home-link" href="/">Back to trip details</a>
          </>
        )}
      </section>
      <footer className="qualification-footer">MET · Curated group travel, not a dating trip.</footer>
    </main>
  )
}
