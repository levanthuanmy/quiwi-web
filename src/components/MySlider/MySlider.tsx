import classNames from 'classnames'
import { CSSProperties, FC, ReactNode } from 'react'
import { Button } from 'react-bootstrap'
import Slider from 'react-slick'
import styles from './MySlider.module.css'

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props
  return (
    <div
      className={classNames(className, 'text-primary ')}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    ></div>
  )
}

const MySlider: FC<{ children: ReactNode }> = ({ children }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    // centerPadding: '100px',
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SampleNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <>
      <Slider {...settings}>{children}</Slider>
    </>
  )
}

export { MySlider }
