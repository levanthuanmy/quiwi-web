import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-popper-tooltip/dist/styles.css'
import type {AppProps} from 'next/app'
import {SSRProvider} from 'react-bootstrap'
import MyHead from '../components/MyHead/MyHead'
import '../styles/global.scss'
import '../styles/common.css'
import '../styles/padding.css'
import '../styles/sizing.css'
import '../styles/border.css'
import '../styles/typography.css'
import '../styles/custom-arrow-react-slick.css'
import {AuthProvider} from '../hooks/useAuth/useAuth'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useGameSession} from '../hooks/useGameSession/useGameSession'
import {ToastProvider} from 'react-toast-notifications'
import * as gtag from '../libs/gtag'
import SignInModal from '../components/AuthComponents/SignInModal/SignInModal'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {useMyleGameSession} from "../hooks/usePracticeGameSession/useMyleGameSession"
import {usePracticeGameSession} from "../hooks/usePracticeGameSession/usePracticeGameSession";

// ĐỪNG AUTO FORMAT FILE NÀY

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)
  const gameSession = useGameSession()
  const myleGameSession = useMyleGameSession()
  const practiceGameSession = usePracticeGameSession()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setShouldLoad(true)
    }

    const handleRouteChangeComplete = () => {
      setShouldLoad(false)
    }

    const handleRouteChangeError = () => {
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const gamePageSet = new Set([
    '/game',
    '/game/play',
    '/game/practice',
    '/host/lobby',
    '/lobby',
    '/quiz/[id]/play',
    // '/quiz/creator/[id]'
  ])

  useEffect(() => {
    if (!gamePageSet.has(router.pathname)) {
      console.log('🏡 =>', router.pathname)
      gameSession.clearGameSession()
      gameSession.disconnectGameSocket()
      practiceGameSession.clearGameSession()
      practiceGameSession.disconnectGameSocket()
      myleGameSession.clearGameSession()
      myleGameSession.disconnectGameSocket()
    } else {
      console.log('🏠 =>', router.pathname)
    }
  }, [router])

  return (
    <SSRProvider>
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}> 
            <ToastProvider autoDismiss newestOnTop autoDismissTimeout={4000}>
              <MyHead />
              <Component {...pageProps} />
              <FullScreenLoader isLoading={shouldLoad} />
              <SignInModal />
            </ToastProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </DndProvider>
    </SSRProvider>
  )
}

export default MyApp
