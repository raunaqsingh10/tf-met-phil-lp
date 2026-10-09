import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QualificationPage } from './QualificationPage.tsx'
import { SurveyOutcomePage } from './SurveyOutcomePage.tsx'

const route = window.location.pathname.replace(/\/+$/, '') || '/'

const content = route === '/qualification'
  ? <QualificationPage />
  : route === '/book-call'
    ? <SurveyOutcomePage outcome="book-call" />
    : route === '/not-qualified'
      ? <SurveyOutcomePage outcome="not-qualified" />
      : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{content}</StrictMode>,
)
