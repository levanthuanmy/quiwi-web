import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap'
import MyHead from '../components/MyHead/MyHead'
import '../styles/border.css'
import '../styles/common.css'
import '../styles/global.scss'
import '../styles/padding.css'
import '../styles/sizing.css'
import '../styles/typography.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <MyHead />
      <Component {...pageProps} />
    </SSRProvider>
  )
}

export default MyApp
