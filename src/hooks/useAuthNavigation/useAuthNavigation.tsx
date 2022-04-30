import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

export const useAuthNavigation = () => {
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')
  const cookies = new Cookies()
  const accessToken = cookies.get('access-token')

  const navigate = (navigateTo: string) => {
    if (!accessToken || !accessToken.length) {
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
