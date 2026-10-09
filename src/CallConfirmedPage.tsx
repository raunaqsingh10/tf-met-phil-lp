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
      <header className="site-header qualification-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="MET Philippines landing page">
            <img className="brand-icon" src="/media/brand/met-icon.webp" alt="" width="118" height="120" />
            <img className="brand-wordmark" src="/media/brand/met-wordmark.webp" alt="MET" width="280" height="104" />
          </a>
          <span className="header-trip">Philippines 2026</span>
        </div>
      </header>
      <section className="outcome-intro" aria-labelledby="confirmation-title">
        <h1 id="confirmation-title">You're booked to speak with MET!</h1>
        <p>Your Philippines Trip Call is confirmed.</p>
        <p>You'll receive your meeting details and joining instructions through the booking confirmation.</p>
        <div className="confirmation-preparation">
          <h2>Before we speak...</h2>
          <p>Take a look at the Philippines itinerary we've sent you and note down anything you'd like to ask about the trip, the group, coming solo or the payment options.</p>
          <p>We're looking forward to learning more about you and helping you explore whether this Philippines experience is right for you.</p>
          <p className="confirmation-signoff"><strong>See you on the call!</strong></p>
        </div>
      </section>
    </main>
  )
}
