import { useEffect, useMemo } from 'react'
import { getAttribution } from './lib/attribution'
import './styles.css'
import './qualification.css'
import './outcomes.css'

const marketingIds = new Set([
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid',
  'campaign_id', 'adset_id', 'ad_id',
])

function confirmationUrl(): string {
  const url = new URL(window.location.href)
  const present = new Set([...url.searchParams.keys()].map(key => key.toLowerCase()))
  for (const [key, value] of getAttribution()?.latestTouch.params ?? []) {
    const normalized = key.toLowerCase()
    if ((/^utm_[a-z0-9_]+$/.test(normalized) || marketingIds.has(normalized)) && !present.has(normalized)) {
      url.searchParams.append(key, value)
      present.add(normalized)
    }
  }
  return url.toString()
}

export function CallConfirmedPage() {
  const destination = useMemo(confirmationUrl, [])
  const inIframe = window.self !== window.top

  useEffect(() => {
    // A GHL calendar redirect can load inside the embedded booking iframe.
    // Promote it to a full browser page when permitted.
    if (inIframe) {
      try {
        window.top?.location.replace(destination)
      } catch {
        // Browsers may disallow programmatic top navigation; show a direct link.
      }
      return
    }
    document.title = 'Call Booked | MET Philippines'
    if (window.location.href !== destination) {
      window.history.replaceState(window.history.state, '', destination)
    }
  }, [destination, inIframe])

  if (inIframe) {
    return (
      <main className="qualification-iframe-redirect">
        <p>Opening your booking confirmation…</p>
        <a href={destination} target="_top">Continue to booking confirmation</a>
      </main>
    )
  }

  return (
    <main className="qualification-page outcome-page">
      <header className="qualification-header">
        <a href="/" className="qualification-brand" aria-label="MET Philippines landing page">
          MET <span>PHILIPPINES</span>
        </a>
      </header>
      <section className="outcome-intro" aria-labelledby="confirmation-title">
        <p className="eyebrow">Philippines social adventure · 18–26 December 2026</p>
        <h1 id="confirmation-title">Your call is booked.</h1>
        <p>We're looking forward to speaking with you about the Philippines trip, the group experience and any questions you have.</p>
        <p>Please save the date and time you selected. Booking this conversation does not mean you've been approved for the trip or committed to a payment.</p>
        <a className="outcome-home-link" href="/">Back to trip details</a>
      </section>
      <footer className="qualification-footer">MET · Curated group travel, not a dating trip.</footer>
    </main>
  )
}
