import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import Slider from 'react-slick'

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props
  return (
    <div
      className={classNames(className, 'text-primary d-block')}
      style={{ ...style }}
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
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 650,
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
