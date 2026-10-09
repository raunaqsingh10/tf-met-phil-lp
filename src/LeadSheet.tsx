import { useEffect, useMemo, useRef } from 'react'
import { getAttribution } from './lib/attribution'

type LeadSheetProps = {
  onClose: () => void
}

const formBaseUrl = 'https://link.yourmarketingai.com/widget/form/yDukK865pgRRO1XD8M86'
const formEmbedScriptUrl = 'https://link.yourmarketingai.com/js/form_embed.js'

const trackedClickParams = new Set([
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid',
  'campaign_id', 'adset_id', 'ad_id',
])

function buildAttributedFormUrl(): string {
  const url = new URL(formBaseUrl)
  const storedTouch = getAttribution()?.latestTouch.params
  const queryParams = storedTouch ?? [...new URLSearchParams(window.location.search).entries()]

  // Only send marketing identifiers, never contact information or arbitrary URL keys.
  for (const [key, value] of queryParams) {
    const normalized = key.toLowerCase()
    if (/^utm_[a-z0-9_]+$/.test(normalized) || trackedClickParams.has(normalized)) {
      url.searchParams.append(key, value)
    }
  }
  return url.toString()
}

export function LeadSheet({ onClose }: LeadSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const formUrl = useMemo(buildAttributedFormUrl, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), iframe, a[href]')]
      const first = focusables[0]
      const last = focusables.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // GHL's script listens for iframe sizing messages. Load it after React
    // has mounted the iframe, and only once for subsequent popup openings.
    if (!document.querySelector('script[data-ghl-registration-embed="true"]')) {
      const script = document.createElement('script')
      script.src = formEmbedScriptUrl
      script.async = true
      script.dataset.ghlRegistrationEmbed = 'true'
      document.body.appendChild(script)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="sheet-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="lead-sheet" role="dialog" aria-modal="true" aria-labelledby="lead-title" aria-describedby="lead-description" tabIndex={-1} ref={dialogRef}>
        <div className="sheet-head">
          <div>
            <h2 id="lead-title">Get the Philippines Trip Details</h2>
            <p className="sheet-description" id="lead-description">Get the complete itinerary, inclusions, pricing, payment options and details of how MET's curated group experience works, sent straight to your WhatsApp.</p>
          </div>
          <button className="sheet-close" type="button" onClick={onClose} aria-label="Close form">×</button>
        </div>

        <iframe
          className="ghl-registration-frame"
          src={formUrl}
          title="MET - Philippines - Get Details Registration"
          id="inline-yDukK865pgRRO1XD8M86"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="MET - Philippines - Get Details Registration"
          data-height="1574"
          data-layout-iframe-id="inline-yDukK865pgRRO1XD8M86"
          data-form-id="yDukK865pgRRO1XD8M86"
          data-cookie-consent="false"
          style={{ width: '100%', height: '1574px', border: 'none', borderRadius: '8px' }}
        />
        <p className="sheet-micro"><em>No payment or booking required.</em></p>
        <p className="ghl-form-fallback">
          Form not loading? <a href={formUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.
        </p>
      </div>
    </div>
  )
}
