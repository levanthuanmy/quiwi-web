import { FC, ReactNode } from 'react'
import Slider from 'react-slick'

const MySlider: FC<{ children: ReactNode; showDots?: boolean }> = ({
  children,
  showDots = true,
}) => {
  const settings = {
    dots: showDots,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    arrows: true,
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
