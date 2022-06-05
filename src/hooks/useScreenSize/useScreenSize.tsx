import {useEffect, useState} from 'react'

export default function useScreenSize() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [fromSmall, setFromSmall] = useState<boolean>(false)
  const [fromMedium, setFromMedium] = useState<boolean>(false)
  const [fromLarge, setFromLarge] = useState<boolean>(false)
  const [fromExtraLarge, setFromExtraLarge] = useState<boolean>(false)
  useEffect(() => {
    const checkIsMobileScreen = () => {
      setIsMobile(innerWidth <= 576)
      setFromSmall(576 < innerWidth)
      setFromMedium(768 < innerWidth)
      setFromLarge(992 < innerWidth)
      setFromExtraLarge(1200 < innerWidth)
    }

    checkIsMobileScreen()

    addEventListener('resize', checkIsMobileScreen)

    return () => {
      removeEventListener('resize', checkIsMobileScreen)
    }
  }, [])

  return ({isMobile, fromSmall, fromMedium, fromLarge, fromExtraLarge})
}
