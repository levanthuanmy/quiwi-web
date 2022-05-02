import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { isAuthState } from '../../atoms/auth'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

export const useAuthNavigation = () => {
  const isAuth = useRecoilValue(isAuthState)
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')

  const navigate = (navigateTo: string) => {
    console.log('navigate - isAuth', isAuth)
    if (!isAuth) {
      setPrevRoute(navigateTo)
      router.push(`/sign-in`)
    } else {
      router.push(navigateTo)
    }
  }

  const toPrevRoute = () => {
    const temp = prevRoute
    setPrevRoute('/')
    router.push(temp)
  }

  return { navigate, toPrevRoute }
}
