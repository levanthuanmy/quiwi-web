import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

export const useAuthNavigation = () => {
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')

  const navigate = (navigateTo: string) => {
    const cookies = new Cookies()
    if (!cookies.get('access-token') || !cookies.get('access-token').length) {
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
