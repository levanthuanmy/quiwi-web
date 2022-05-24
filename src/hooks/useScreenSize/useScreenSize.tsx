import { useEffect, useState } from 'react'

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState<number>(0)
  useEffect(() => {
    const checkIsMobileScreen = () => {
      setScreenSize(innerWidth)
    }

    checkIsMobileScreen()

    addEventListener('resize', checkIsMobileScreen)

    return () => {
      removeEventListener('resize', checkIsMobileScreen)
    }
  }, [])

  return screenSize
}
