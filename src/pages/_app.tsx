import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
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
import '../styles/custom-arrow-react-slick.css'
import { AuthProvider } from '../hooks/useAuth/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useGameSession } from '../hooks/useGameSession/useGameSession'
import { CommunityGameSocketProvider } from '../hooks/useCommunitySocket/useCommunitySocket'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)
  const { disconnectGameSocket, clearGameSession } = useGameSession()
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setShouldLoad(true)
    }

    const handleRouteChangeComplete = () => {
      setShouldLoad(false)
    }

    const handleRouteChangeError = () => {}

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  const gamePageSet = new Set(["/game", "/game/play", "/game/practice", "/host/lobby", "/lobby", "quiz/[id]/play"])

  useEffect(() => {
    if (!gamePageSet.has(router.pathname)) {
      console.log('🏡 =>', router.pathname)
      clearGameSession()
      disconnectGameSocket()
    }
  }, [router])

  return (
    <SSRProvider>
      <DndProvider backend={HTML5Backend}>
        <CommunityGameSocketProvider>
          <AuthProvider>
            <MyHead />
            <Component {...pageProps} />
            <FullScreenLoader isLoading={shouldLoad} />
          </AuthProvider>
        </CommunityGameSocketProvider>
      </DndProvider>
    </SSRProvider>
  )
}

export default MyApp
