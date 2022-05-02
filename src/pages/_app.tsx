import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap'
import MyHead from '../components/MyHead/MyHead'
import '../styles/global.scss'
import '../styles/common.css'
import '../styles/padding.css'
import '../styles/sizing.css'
import '../styles/border.css'
import '../styles/typography.css'
import { RecoilRoot } from 'recoil'
import { SocketProvider } from '../hooks/useSocket/useSocket'
import { AuthNavigationProvider } from '../hooks/useAuthNavigation/useAuthNavigation'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SSRProvider>
        <SocketProvider>
          <AuthNavigationProvider>
            <MyHead />
            <Component {...pageProps} />
          </AuthNavigationProvider>
        </SocketProvider>
      </SSRProvider>
    </RecoilRoot>
  )
}

export default MyApp
