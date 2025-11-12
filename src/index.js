import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { BillingSummaryProvider } from './context/BillingSummaryContext'
import { BillingProvider } from './context/bilingContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BillingSummaryProvider>
      <BillingProvider>
        <App />
      </BillingProvider>
    </BillingSummaryProvider>
  </Provider>,
)
