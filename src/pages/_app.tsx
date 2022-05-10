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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setShouldLoad(true)
    }

    const handleRouteChangeComplete = () => {
      setShouldLoad(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  return (
    <RecoilRoot>
      <SSRProvider>
        <SocketProvider>
          <AuthNavigationProvider>
            <MyHead />
            <Component {...pageProps} />
            <FullScreenLoader isLoading={shouldLoad} />
          </AuthNavigationProvider>
        </SocketProvider>
      </SSRProvider>
    </RecoilRoot>
  )
}

export default MyApp
