import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENTID

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error("Root element not found")

createRoot(rootElement).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
)

