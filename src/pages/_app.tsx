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
import { SocketProvider } from '../hooks/useSocket/useSocket'
import { AuthProvider } from '../hooks/useAuth/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
    <SSRProvider>
      <SocketProvider>
        <DndProvider backend={HTML5Backend}>
          <AuthProvider>
            <MyHead />
            <Component {...pageProps} />
            <FullScreenLoader isLoading={shouldLoad} />
          </AuthProvider>
        </DndProvider>
      </SocketProvider>
    </SSRProvider>
  )
}

export default MyApp
