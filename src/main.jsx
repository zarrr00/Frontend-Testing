import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { ModeProvider } from './contexts/ModeContext.jsx'
// Entry point aplikasi React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModeProvider>
      <App />
    </ModeProvider>
  </React.StrictMode>,
)