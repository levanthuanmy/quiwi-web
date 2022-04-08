import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  )
}

export default MyApp
