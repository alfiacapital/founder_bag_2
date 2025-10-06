import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import {UserProvider} from "./context/UserProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";




createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ErrorBoundary>
          <UserProvider>
              <App />
          </UserProvider>
      </ErrorBoundary>
  </StrictMode>,
)
