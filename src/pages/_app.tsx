import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap'
import '../styles/global.scss'
import '../styles/border.css'
import '../styles/typography.css'
import '../styles/sizing.css'
import '../styles/padding.css'
import '../styles/common.css'
import MyHead from '../components/MyHead/MyHead'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <MyHead />
      <Component {...pageProps} />
    </SSRProvider>
  )
}

export default MyApp
