import { FC, useEffect, useRef, useState } from 'react'
import { Button, Row } from 'react-bootstrap'
import styles from './MyScrollMenu.module.css'

const MyScrollMenu: FC<{}> = (props) => {
  const [scrollX, setscrollX] = useState(0) // For detecting start scroll postion
  const [scrolEnd, setscrolEnd] = useState(false) // For detecting end of scrolling
  const scrl = useRef<HTMLDivElement>()

  const slide = (shift: number) => {
    if (!scrl.current) return
    scrl.current.scrollLeft += shift
    setscrollX(scrollX + shift) // Updates the latest scrolled postion

    //For checking if the scroll has ended
    if (
      Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
      scrl.current.offsetWidth
    ) {
      setscrolEnd(true)
    } else {
      setscrolEnd(false)
    }
  }

  const scrollCheck = () => {
    if (!scrl.current) return
    setscrollX(scrl.current.scrollLeft)
    if (
      Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
      scrl.current.offsetWidth
    ) {
      setscrolEnd(true)
    } else {
      setscrolEnd(false)
    }
  }

  useEffect(() => {
    //Check width of the scollings
    if (
      scrl.current &&
      scrl?.current?.scrollWidth === scrl?.current?.offsetWidth
    ) {
      setscrolEnd(true)
    } else {
      setscrolEnd(false)
    }
    return () => {}
  }, [scrl?.current?.scrollWidth, scrl?.current?.offsetWidth])

  return (
    <div className="d-flex justify-content-between align-items-center">
      <Button className={`${styles.slideButton}`} onClick={() => slide(-200)}>
        <i className="bi bi-arrow-left fs-4"></i>
      </Button>
      <Row
        style={{
          scrollBehavior: 'smooth',
        }}
        ref={scrl}
        onScroll={scrollCheck}
        className="overflow-auto flex-nowrap custom-scrollbar custom-scrollbar-horizontal"
      >
        {props.children}
      </Row>
      <Button className={`${styles.slideButton}`} onClick={() => slide(200)}>
        <i className="bi bi-arrow-right fs-4"></i>
      </Button>
    </div>
  )
}

export { MyScrollMenu }
