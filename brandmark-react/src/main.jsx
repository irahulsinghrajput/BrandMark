import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const isFileProtocol = window.location.protocol === 'file:'

if (isFileProtocol && !window.location.hash) {
  window.history.replaceState(null, '', `${window.location.pathname}#/`)
}

const Router = isFileProtocol ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
