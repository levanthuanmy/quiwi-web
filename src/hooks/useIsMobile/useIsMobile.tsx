import { useEffect, useState } from 'react'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIsMobileScreen = () => {
      setIsMobile(innerWidth <= 576)
    }

    checkIsMobileScreen()

    addEventListener('resize', checkIsMobileScreen)

    return () => {
      removeEventListener('resize', checkIsMobileScreen)
    }
  }, [])

  return isMobile
}
