import classNames from 'classnames'
import _ from 'lodash'
import { FC, useEffect, useRef, useState } from 'react'
import { Button, Row } from 'react-bootstrap'
import styles from './MyScrollMenu.module.css'

const MyScrollMenu: FC<{}> = (props) => {
  const [scrollX, setScrollX] = useState<number>(0) // For detecting start scroll postion
  const [scrollEnd, setScrollEnd] = useState<boolean>(false) // For detecting end of scrolling
  const [scrollStart, setScrollStart] = useState<boolean>(true) // For detecting end of scrolling
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRefWidth = Number(_.get(scrollRef, 'current.offsetWidth'))

  const slide = (shift: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollLeft += shift
    setScrollX(scrollX + shift) // Updates the latest scrolled postion

    //For checking if the scroll has ended
    if (
      Math.floor(
        scrollRef.current.scrollWidth - scrollRef.current.scrollLeft
      ) <= scrollRefWidth
    ) {
      setScrollEnd(true)
    } else {
      setScrollEnd(false)
    }

    scrollCheck()
  }

  const scrollCheck = () => {
    if (!scrollRef.current) return
    setScrollX(scrollRef.current.scrollLeft)

    setScrollEnd(
      Math.floor(
        scrollRef.current.scrollWidth - scrollRef.current.scrollLeft
      ) <=
        scrollRefWidth + 10
    )

    setScrollStart(scrollX <= 10)
  }

  useEffect(() => {
    if (
      scrollRef.current &&
      scrollRef?.current?.scrollWidth === scrollRef?.current?.offsetWidth
    ) {
      setScrollEnd(true)
    } else {
      setScrollEnd(false)
    }
    return () => {}
  }, [scrollRef?.current?.scrollWidth, scrollRef?.current?.offsetWidth])

  return (
    <div className="position-relative">
      <div
        className={classNames(
          'position-absolute h-100 top-0 d-flex align-items-center'
        )}
        style={{ zIndex: 1, left: -30 }}
      >
        <Button
          variant="light"
          className={classNames('rounded-circle shadow-lg', {
            'opacity-75': scrollStart,
          })}
          onClick={() => slide(-(scrollRefWidth - 100))}
        >
          <i className="bi bi-chevron-left fs-4" />
        </Button>
      </div>

      <Row
        style={{
          scrollBehavior: 'smooth',
        }}
        ref={scrollRef}
        onScroll={scrollCheck}
        className="overflow-auto flex-nowrap custom-scrollbar custom-scrollbar-horizontal"
      >
        {props.children}
      </Row>
      <div
        className={classNames(
          'position-absolute h-100 top-0 d-flex align-items-center'
        )}
        style={{ zIndex: 1, right: -30 }}
      >
        <Button
          variant="light"
          className={classNames('rounded-circle shadow-lg', {
            'opacity-75': scrollEnd,
          })}
          onClick={() => slide(scrollRefWidth - 100)}
        >
          <i className="bi bi-chevron-right fs-4" />
        </Button>
      </div>
    </div>
  )
}

export { MyScrollMenu }
