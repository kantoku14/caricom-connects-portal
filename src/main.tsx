// main.tsx or index.tsx
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom'
import App from './App'

import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'https://02f55fc52e1bd034e48363376e41b9c5@o4507982706769920.ingest.us.sentry.io/4507985165352960',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById('root')
)
