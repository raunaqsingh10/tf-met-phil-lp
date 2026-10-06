import { useEffect, useRef, useState } from 'react'

type LeadSheetProps = {
  onClose: () => void
}

export function LeadSheet({ onClose }: LeadSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const [previewSubmitted, setPreviewSubmitted] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstNameRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])')]
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
      <div className="lead-sheet" role="dialog" aria-modal="true" aria-labelledby="lead-title" ref={dialogRef}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Trip details</p>
            <h2 id="lead-title">Get the Philippines Trip Details</h2>
            <p className="small">Where should we send them?</p>
          </div>
          <button className="sheet-close" type="button" onClick={onClose} aria-label="Close form">×</button>
        </div>

        <form className="lead-form" onSubmit={(event) => {
          event.preventDefault()
          const firstName = event.currentTarget.elements.namedItem('firstName') as HTMLInputElement
          if (!firstName.value.trim()) {
            firstName.setCustomValidity('Enter your first name.')
            firstName.reportValidity()
            return
          }
          const whatsapp = event.currentTarget.elements.namedItem('whatsapp') as HTMLInputElement
          const value = whatsapp.value.trim()
          const digits = value.replace(/\D/g, '')
          if (!/^\+?[0-9() .-]+$/.test(value) || digits.length < 8 || digits.length > 15) {
            whatsapp.setCustomValidity('Enter a valid WhatsApp number.')
            whatsapp.reportValidity()
            return
          }
          setPreviewSubmitted(true)
        }}>
          <label htmlFor="first-name">First Name</label>
          <input id="first-name" ref={firstNameRef} name="firstName" autoComplete="given-name" required placeholder="Your first name" onInput={(event) => event.currentTarget.setCustomValidity('')} />

          <label htmlFor="whatsapp">WhatsApp Number</label>
          <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91" onInput={(event) => event.currentTarget.setCustomValidity('')} />

          <button className="button button-primary" type="submit">Send Me The Trip Details</button>
          <p className="micro">No payment or commitment required.</p>
          {previewSubmitted && (
            <p className="preview-status" role="status">Preview only — no details were sent and your information was not saved.</p>
          )}
        </form>
      </div>
    </div>
  )
}
