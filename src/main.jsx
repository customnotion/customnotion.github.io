import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// HashRouter (URLs like #/admin) is used intentionally instead of
// BrowserRouter. GitHub Pages serves static files with no server-side
// rewrite rules, so a path like /admin would 404 on refresh with
// BrowserRouter. Hash-based routing works everywhere a static host can
// serve a single index.html, with zero extra deploy configuration.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
