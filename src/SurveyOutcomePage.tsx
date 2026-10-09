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

const calendarEmbedScriptUrl = 'https://link.yourmarketingai.com/js/form_embed.js'
const calendarBaseUrl = 'https://link.yourmarketingai.com/widget/booking/p6MbnDlBI7ywC4SfwpRS'

function buildCalendarUrl(destinationUrl: string): string {
  const source = new URL(destinationUrl)
  const calendar = new URL(calendarBaseUrl)
  // Never put a registrant's contact details into a URL. Send campaign/click identifiers only.
  for (const [key, value] of source.searchParams.entries()) {
    const normalized = key.toLowerCase()
    if (/^utm_[a-z0-9_]+$/.test(normalized) || marketingIds.has(normalized)) {
      calendar.searchParams.append(key, value)
    }
  }
  return calendar.toString()
}

type Outcome = 'book-call' | 'not-qualified'

export function SurveyOutcomePage({ outcome }: { outcome: Outcome }) {
  const destinationUrl = useMemo(withAttribution, [])
  const nestedInIframe = window.self !== window.top
  const booking = outcome === 'book-call'
  const calendarUrl = useMemo(() => buildCalendarUrl(destinationUrl), [destinationUrl])

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

    if (booking && !document.querySelector('script[data-ghl-booking-embed="true"]')) {
      // The provided GHL script adjusts the booking iframe height and handles provider messages.
      const script = document.createElement('script')
      script.src = calendarEmbedScriptUrl
      script.async = true
      script.dataset.ghlBookingEmbed = 'true'
      document.body.appendChild(script)
    }
  }, [destinationUrl, nestedInIframe, booking])

  if (nestedInIframe) {
    return (
      <main className="qualification-iframe-redirect">
        <p>Taking you to the next step…</p>
        <a href={destinationUrl} target="_top">Continue to the full page</a>
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
      <section className="outcome-intro" aria-labelledby="outcome-title">
        {booking ? (
          <>
            <h1 id="outcome-title">Let's find a time to talk about the Philippines.</h1>
            <p>Based on your answers, this looks like a trip worth exploring together.</p>
            <p>Choose a convenient time below to speak with the MET team, ask your questions and find out more about the experience.</p>
            <section className="outcome-calendar" aria-labelledby="calendar-title">
              <h2 id="calendar-title">Philippines Trip Call with MET</h2>
              <iframe
                src={calendarUrl}
                title="Book your MET Philippines trip consultation"
                id="p6MbnDlBI7ywC4SfwpRS_1791580270720"
                allow="payment"
                scrolling="no"
                style={{ width: '100%', height: '1080px', border: 'none', overflow: 'hidden' }}
              />
              <p className="outcome-reassurance"><em>No payment required. Your place on the trip is only reserved after MET's approval and the booking payment.</em></p>
              <p className="outcome-calendar-fallback">
                Can't see the booking calendar?{' '}
                <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab.</a>
              </p>
            </section>
          </>
        ) : (
          <>
            <h1 id="outcome-title">This Philippines trip may not be the right fit for you right now.</h1>
            <p>Thank you for taking the time to tell us a little about yourself.</p>
            <p>Based on your answers, it looks like some of the requirements for this particular trip may not line up with your current plans or what you're looking for.</p>
            <p><strong>Your Philippines trip details are still on their way to your WhatsApp.</strong></p>
            <p>If your plans change, you're welcome to review the details and get back in touch.</p>
            <p className="outcome-reassurance"><em>We appreciate your interest in travelling with MET.</em></p>
          </>
        )}
      </section>
    </main>
  )
}
