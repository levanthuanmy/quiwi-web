import _ from 'lodash'
import { CSSProperties, FC, memo, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'

const FlyingAnimation: FC<{ src?: string }> = ({ src = '' }) => {
  const [show, setShow] = useState<boolean>(true)

  function random(num: number) {
    return Math.floor(Math.random() * num)
  }

  function getRandomStyles(): CSSProperties {
    const mt = random(100)
    const ml = random(50) + 10
    const dur = random(4) + 2
    return {
      position: 'absolute',
      top: `${mt}px`,
      left: `${ml}px`,
      // margin: `${mt}px 0 0 ${ml}px`,
      animation: `float ${dur}s ease-in infinite`,
    }
  }

  useEffect(() => {
    const delayId = _.delay(() => {
      setShow(false)
      clearTimeout(delayId)
    }, 3000)

    return () => {
      clearTimeout(delayId)
    }
  }, [src])

  return show ? (
    <div className="balloon" style={getRandomStyles()}>
      <Image src={src} style={{ width: '100%', height: '100%' }} alt="icon" />
    </div>
  ) : (
    <></>
  )
}

export default memo(FlyingAnimation)
