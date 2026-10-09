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
      <header className="qualification-header">
        <a href="/" className="qualification-brand" aria-label="MET Philippines landing page">MET <span>PHILIPPINES</span></a>
      </header>
      <section className="qualification-intro" aria-labelledby="qualification-title">
        <p className="eyebrow">Philippines social adventure · 18–26 December 2026</p>
        <h1 id="qualification-title">Your trip-details request is in.</h1>
        <p>Just four quick questions to help us understand whether the Philippines trip is a good fit for you. If it is, you'll be able to explore a conversation with the MET team.</p>
        <p className="qualification-time">4 questions · About 1 minute · No payment required</p>
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
      <footer className="qualification-footer">MET · Curated group travel, not a dating trip.</footer>
    </main>
  )
}
