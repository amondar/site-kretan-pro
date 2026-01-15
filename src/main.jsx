import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. IMPORT DE GOOGLE ANALYTICS
import ReactGA from "react-ga4";

// 2. INITIALISATION (Remplacez par votre ID 'G-...')
ReactGA.initialize("G-XXXXXXXXXX"); 

// 3. ENVOI DE LA PREMIÈRE PAGE VUE
ReactGA.send({ hitType: "pageview", page: window.location.pathname });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)