import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AnalysisProvider } from './context/AnalysisContext'
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AnalysisProvider>
        <App />
      </AnalysisProvider>
    </Provider>
  </StrictMode>,
)
