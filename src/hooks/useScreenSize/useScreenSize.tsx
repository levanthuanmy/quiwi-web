import { useEffect, useMemo, useState } from 'react'

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [fromSmall, setFromSmall] = useState<boolean>(false)
  const [fromMedium, setFromMedium] = useState<boolean>(false)
  const [fromLarge, setFromLarge] = useState<boolean>(false)
  const [fromExtraLarge, setFromExtraLarge] = useState<boolean>(false)
  useEffect(() => {
    const checkIsMobileScreen = () => {
      const width = document.documentElement.clientWidth

      setIsMobile(width <= 576)
      setFromSmall(576 < width)
      setFromMedium(768 < width)
      setFromLarge(992 < width)
      setFromExtraLarge(1200 < width)
    }

    checkIsMobileScreen()

    addEventListener('load', checkIsMobileScreen)
    addEventListener('resize', checkIsMobileScreen)

    return () => {
      removeEventListener('resize', checkIsMobileScreen)
      removeEventListener('load', checkIsMobileScreen)
    }
  }, [])

  return useMemo(
    () => ({ isMobile, fromSmall, fromMedium, fromLarge, fromExtraLarge }),
    [isMobile, fromSmall, fromMedium, fromLarge, fromExtraLarge]
  )
}
export default useScreenSize
