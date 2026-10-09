import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QualificationPage } from './QualificationPage.tsx'

const isQualificationPage = window.location.pathname.replace(/\/+$/, '') === '/qualification'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isQualificationPage ? <QualificationPage /> : <App />}
  </StrictMode>,
)
