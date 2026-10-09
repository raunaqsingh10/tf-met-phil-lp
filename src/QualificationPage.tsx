import { useEffect, useMemo } from 'react'
import { getAttribution } from './lib/attribution'
import './styles.css'
import './qualification.css'

const surveyBaseUrl = 'https://link.yourmarketingai.com/widget/survey/rdC7y6LhS0XuKdHyxCES'
const embedScriptUrl = 'https://link.yourmarketingai.com/js/form_embed.js'
const clickIdKeys = new Set([
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid',
  'campaign_id', 'adset_id', 'ad_id',
])

function isMarketingParameter(key: string): boolean {
  const normalized = key.toLowerCase()
  return /^utm_[a-z0-9_]+$/.test(normalized) || clickIdKeys.has(normalized)
}

function marketingParameters(): [string, string][] {
  const current = [...new URLSearchParams(window.location.search).entries()]
    .filter(([key]) => isMarketingParameter(key))
  const stored = (getAttribution()?.latestTouch.params ?? [])
    .filter(([key]) => isMarketingParameter(key))
  const presentKeys = new Set(current.map(([key]) => key.toLowerCase()))
  return [...current, ...stored.filter(([key]) => !presentKeys.has(key.toLowerCase()))]
}

function addTrackingParameters(url: URL, pairs: [string, string][]): URL {
  for (const [key, value] of pairs) {
    if (!url.searchParams.has(key)) url.searchParams.append(key, value)
  }
  return url
}

export function QualificationPage() {
  const tracking = useMemo(marketingParameters, [])
  const surveyUrl = useMemo(() => addTrackingParameters(new URL(surveyBaseUrl), tracking).toString(), [tracking])
  const embeddedInsideRegistration = window.self !== window.top

  useEffect(() => {
    // GHL's form redirect can load this page *inside* the registration iframe.
    // Since the destination is on the same origin as the React landing page,
    // promote the destination to a full top-level page instead.
    const destination = addTrackingParameters(new URL(window.location.href), tracking)
    if (window.self !== window.top) {
      try {
        window.top?.location.replace(destination.toString())
      } catch {
        // If a browser blocks top navigation, show a direct continuation link.
      }
      return
    }

    if (destination.toString() !== window.location.href) {
      window.history.replaceState(window.history.state, '', destination.toString())
    }

    if (!document.querySelector('script[data-ghl-qualification-embed="true"]')) {
      const script = document.createElement('script')
      script.src = embedScriptUrl
      script.async = true
      script.dataset.ghlQualificationEmbed = 'true'
      document.body.appendChild(script)
    }
  }, [tracking])

  if (embeddedInsideRegistration) {
    return (
      <main className="qualification-iframe-redirect">
        <p>Taking you to the qualification questions…</p>
        <a href={addTrackingParameters(new URL(window.location.href), tracking).toString()} target="_top">
          Continue to the full page
        </a>
      </main>
    )
  }

  return (
    <main className="qualification-page">
      <header className="site-header qualification-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="MET Philippines landing page">
            <img className="brand-icon" src="/media/brand/met-icon.webp" alt="" width="118" height="120" />
            <img className="brand-wordmark" src="/media/brand/met-wordmark.webp" alt="MET" width="280" height="104" />
          </a>
          <span className="header-trip">Philippines 2026</span>
        </div>
      </header>
      <section className="qualification-intro" aria-labelledby="qualification-title">
        <h1 id="qualification-title">Your Philippines trip details are on their way!</h1>
        <p>We'll send everything to your WhatsApp so you can explore the trip at your own pace.</p>
        <div className="qualification-invitation">
          <h2>Thinking this could be your December trip? Let's talk about it.</h2>
          <p>There's a lot more to a MET trip than what's written in an itinerary.</p>
          <p><strong>Speak directly with the MET team</strong> to learn more about the experience, ask about the people you'll be travelling with, understand how the group is curated, and get answers to anything you're unsure about.</p>
          <p>It's also a chance for us to get to know you and understand what you're looking for, so we can see whether this trip could be a good fit for you.</p>
          <p className="qualification-prompt"><strong>Answer a few quick questions below to find a convenient time to talk.</strong></p>
        </div>
      </section>
      <section className="qualification-survey" aria-label="Philippines qualification questions">
        <iframe
          src={surveyUrl}
          id="rdC7y6LhS0XuKdHyxCES"
          title="MET Philippines qualification survey"
          scrolling="no"
          data-cookie-consent="false"
          style={{ border: 'none', width: '100%', height: '1080px' }}
        />
        <p className="qualification-survey-fallback">
          Having trouble viewing the questions?{' '}
          <a href={surveyUrl} target="_blank" rel="noopener noreferrer">Open the survey in a new tab.</a>
        </p>
      </section>
      <p className="qualification-reassurance"><em>Just exploring for now? That's completely fine. Your trip details are on their way, and you can come back to this step whenever you're ready.</em></p>
    </main>
  )
}
