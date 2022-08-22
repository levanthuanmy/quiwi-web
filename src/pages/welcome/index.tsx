/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/no-css-tags */
import _ from 'lodash'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import useSWR from 'swr'
import Loading from '../../components/Loading/Loading'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TItem,
  TPaginationResponse,
  TQuiz,
} from '../../types/types'

const WelcomePage: FC = () => {
  const [shouldRender, setShouldRender] = useState(false)
  const [invitationCode, setInvitationCode] = useState<string>('')
  const { addToast } = useToasts()

  const onJoinRoom = async () => {
    if (invitationCode.trim().length === 0) {
      addToast('Vui lòng nhập mã phòng', {
        appearance: 'error',
      })
      return
    }

    const res: TApiResponse<any> = await get(
      `/api/games/check-room/${invitationCode}`,
      false
    )
    if (res.response) {
      await router.push(`/lobby/join?invitationCode=${invitationCode}`)
    } else {
      addToast('Phòng không tồn tại', {
        appearance: 'error',
      })
    }
  }

  useEffect(() => {
    history.scrollRestoration = 'manual'

    document.getElementsByTagName('body')[0].style.display = 'none'
    // scrollTo(0, 0)
    // client side rendering only
    setShouldRender(true)
  }, [])

  const { data: popularQuizzesResponse, isValidating } = useSWR<
    TApiResponse<TQuiz[]>
  >([`/api/quizzes/popular-quizzes`, false], get, { revalidateOnFocus: false })

  const { data: allQuizzesResponse } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >([`/api/quizzes`, false], get, { revalidateOnFocus: false })

  const { data: itemsResponse } = useSWR<
    TApiResponse<TPaginationResponse<TItem>>
  >([`/api/items`, false], get, { revalidateOnFocus: false })

  const popularQuizzes = useMemo(
    () =>
      _.sortBy(popularQuizzesResponse?.response, 'numPlayed')
        ?.reverse()
        ?.slice(0, 3),
    [popularQuizzesResponse]
  )

  const convertLastNumToZeroes = (input: number) => {
    return input < 10 ? input : Math.floor(input / 10) * 10
  }

  const numQuizzes = useMemo(() => {
    return convertLastNumToZeroes(allQuizzesResponse?.response?.totalItems || 0)
  }, [allQuizzesResponse])

  const numItems = useMemo(() => {
    return convertLastNumToZeroes(itemsResponse?.response?.totalItems || 0)
  }, [itemsResponse])

  const router = useRouter()

  return shouldRender ? (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href="/template-assets/images/favicon.png"
          type="image/png"
        />

        <link rel="stylesheet" href="/template-assets/css/slick.css" />

        <link
          rel="stylesheet"
          href="/template-assets/css/font-awesome.min.css"
        />

        <link rel="stylesheet" href="/template-assets/css/LineIcons.css" />

        <link rel="stylesheet" href="/template-assets/css/animate.css" />

        <link rel="stylesheet" href="/template-assets/css/magnific-popup.css" />

        <link rel="stylesheet" href="/template-assets/css/bootstrap.min.css" />

        <link rel="stylesheet" href="/template-assets/css/default.css" />

        <link rel="stylesheet" href="/template-assets/css/style.css" />
      </Head>

      <header className="header-area">
        <div className="navbar-area headroom">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                  <Link passHref href="/home">
                    <img
                      src="/assets/logo-text.png"
                      className="navbar-brand"
                      alt="Logo"
                    />
                  </Link>
                  {/* <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                  </button> */}

                  {/* <div
                    className="collapse navbar-collapse sub-menu-bar"
                    id="navbarSupportedContent"
                  >
                    <ul id="nav" className="navbar-nav m-auto">
                      <li className="nav-item active">
                        <a href="#home">Home</a>
                      </li>
                      <li className="nav-item">
                        <a href="#about">About </a>
                      </li>
                      <li className="nav-item">
                        <a href="#services">Services</a>
                      </li>
                      <li className="nav-item">
                        <a href="#portfolio">Portfolio</a>
                      </li>
                      <li className="nav-item">
                        <a href="#blog">Blog</a>
                      </li>
                      <li className="nav-item">
                        <a href="#contact">Contact</a>
                      </li>
                    </ul>
                  </div> */}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          id="home"
          className="header-hero bg_cover d-lg-flex align-items-center"
          style={{
            backgroundImage: 'url(/template-assets/images/header-hero.jpg)',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="header-hero-content">
                  <h1
                    className="hero-title wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="0.2s"
                  >
                    <b>
                      Chào mừng bạn đến với <span>Quiwi</span>
                    </b>
                  </h1>
                  <p
                    className="text wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    Quiwi là nơi bạn có thể tạo và tham gia quiz một cách thoải
                    mái và nhanh chóng.
                    <br />
                    <br />
                    <div
                      data-wow-duration="1s"
                      data-wow-delay="0.5s"
                      className="main-btn"
                      onClick={() => router.push('/home')}
                    >
                      BẮT ĐẦU NGAY
                    </div>
                  </p>
                  <div
                    className="header-singup wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="0.8s"
                  >
                    <input
                      type="text"
                      placeholder="Hoặc nhập mã phòng để..."
                      onChange={(e) => {
                        setInvitationCode(e.target.value)
                      }}
                    />
                    <button className="main-btn" onClick={onJoinRoom}>
                      VÀO PHÒNG NGAY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="header-hero-image d-flex align-items-center wow fadeInRightBig"
            data-wow-duration="1s"
            data-wow-delay="1.1s"
          >
            <div className="image">
              <img
                src="/template-assets/images/hero-image.png"
                alt="Hero Image"
              />
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="about-area pt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div
                className="about-title text-center wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.3s"
              >
                <h6 className="welcome">CHÀO MỪNG BẠN</h6>
                <h3 className="title">
                  Khám phá nhiều tính năng thú vị của <span>Quiwi</span> chỉ với{' '}
                  <span>một cú nhấp chuột</span>
                  <br />
                  <br />
                  <button
                    className="main-btn"
                    onClick={() => router.push('/home')}
                  >
                    BẮT ĐẦU NGAY
                  </button>
                </h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div
                className="about-image mt-60 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.5s"
              >
                <img src="/template-assets/images/about.png" alt="about" />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content pt-45">
                <p
                  className="text wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.4s"
                >
                  {/* Duis et metus et massa tempus lacinia. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos. Maecenas ultricies, orci molestie blandit interdum.
                  ipsum ante pellentesque nisl, eget mollis turpis quam nec
                  eros. ultricies, orci molestie blandit interdum. */}
                </p>

                <div className="about-counter pt-60">
                  <div className="row">
                    <div className="col-sm-4">
                      <div
                        className="single-counter counter-color-1 mt-30 d-flex wow fadeInUp"
                        data-wow-duration="1s"
                        data-wow-delay="0.3s"
                      >
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">80</span>+
                          </span>
                          <p className="text">Người dùng</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div
                        className="single-counter counter-color-2 mt-30 d-flex wow fadeInUp"
                        data-wow-duration="1s"
                        data-wow-delay="0.6s"
                      >
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">{numItems}</span>+
                          </span>
                          <p className="text">Vật phẩm</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div
                        className="single-counter counter-color-3 mt-30 d-flex wow fadeInUp"
                        data-wow-duration="1s"
                        data-wow-delay="0.9s"
                      >
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">{numQuizzes}</span>+
                          </span>
                          <p className="text">Bộ câu hỏi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="services" className="our-services-area pt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-9">
              <div
                className="section-title text-center wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.2s"
              >
                <h6 className="sub-title">Our services</h6>
                <h4 className="title">
                  Bunch of Services <span>to Rock Your Business</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="our-services-tab pt-30">
                <ul
                  className="nav justify-content-center wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.5s"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="active"
                      id="business-tab"
                      data-toggle="tab"
                      href="#business"
                      role="tab"
                      aria-controls="business"
                      aria-selected="true"
                    >
                      <i className="lni-briefcase"></i>
                      <span>
                        Business <br />
                        Consultancy
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      id="digital-tab"
                      data-toggle="tab"
                      href="#digital"
                      role="tab"
                      aria-controls="digital"
                      aria-selected="false"
                    >
                      <i className="lni-bullhorn"></i>
                      <span>
                        Digital <br />
                        Marketing
                      </span>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      id="market-tab"
                      data-toggle="tab"
                      href="#market"
                      role="tab"
                      aria-controls="market"
                      aria-selected="false"
                    >
                      <i className="lni-stats-up"></i>
                      <span>
                        Market <br />
                        Analysis
                      </span>
                    </a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="business"
                    role="tabpanel"
                    aria-labelledby="business-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="/template-assets/images/our-service-1.jpg"
                            alt="service"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">
                            Business Consultancy
                            <span>for Your Business Growth.</span>
                          </h3>
                          <p className="text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nam nec est arcu. Maecenas semper tortor.{' '}
                            <br />
                            <br />
                            In elementum in risus sed commodo. Phasellus nisi
                            ligula, luctus at tempor vitae, placerat at ante.
                            Cras sed consequat justo. Curabitur laoreet eu est
                            vel convallis.
                          </p>

                          <div className="our-services-progress d-flex align-items-center mt-55">
                            <div className="circle" id="circles-1"></div>
                            <div className="progress-content">
                              <h4 className="progress-title">
                                Consultancy
                                <br />
                                Agency Skill.
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="digital"
                    role="tabpanel"
                    aria-labelledby="digital-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="/template-assets/images/our-service-1.jpg"
                            alt="service"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">
                            Digital Marketing
                            <span>for Your Business Growth.</span>
                          </h3>
                          <p className="text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nam nec est arcu. Maecenas semper tortor.{' '}
                            <br />
                            <br />
                            In elementum in risus sed commodo. Phasellus nisi
                            ligula, luctus at tempor vitae, placerat at ante.
                            Cras sed consequat justo. Curabitur laoreet eu est
                            vel convallis.
                          </p>

                          <div className="our-services-progress d-flex align-items-center mt-55">
                            <div className="circle" id="circles-2"></div>
                            <div className="progress-content">
                              <h4 className="progress-title">
                                Digital Marketing <br />
                                Skill.
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="market"
                    role="tabpanel"
                    aria-labelledby="market-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="/template-assets/images/our-service-1.jpg"
                            alt="service"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">
                            Market Analysis{' '}
                            <span>for Your Business Growth.</span>
                          </h3>
                          <p className="text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nam nec est arcu. Maecenas semper tortor.{' '}
                            <br />
                            <br />
                            In elementum in risus sed commodo. Phasellus nisi
                            ligula, luctus at tempor vitae, placerat at ante.
                            Cras sed consequat justo. Curabitur laoreet eu est
                            vel convallis.
                          </p>

                          <div className="our-services-progress d-flex align-items-center mt-55">
                            <div className="circle" id="circles-3"></div>
                            <div className="progress-content">
                              <h4 className="progress-title">
                                Market Analysis <br />
                                Agency Skill.
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section id="service" className="service-area pt-105">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8">
              <div
                className="section-title wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.2s"
              >
                <h6 className="sub-title">Tính năng nổi trội</h6>
                <h4 className="title">
                  <span>Bạn không thể bỏ lỡ...</span>
                </h4>
              </div>
            </div>
          </div>
          <div
            className="service-wrapper mt-60 wow fadeInUp"
            data-wow-duration="1s"
            data-wow-delay="0.6s"
          >
            <div className="row no-gutters justify-content-center">
              <div className="col-lg-4 col-md-7">
                <div className="single-service d-flex">
                  <div className="service-icon">
                    <img
                      src="/template-assets/images/service-1.png"
                      alt="Icon"
                    />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">
                      Hệ thống cửa hàng và nhiệm vụ
                    </h4>
                    <p className="text">
                      Hệ thống nhiệm vụ cho phép người dùng nhận vô vàn vật phẩm
                      và Quiwi xu khi hoàn thành. Đồng thời, người dùng còn mua
                      được nhiều vật phẩm từ cửa hệ thống cửa hàng của chúng
                      tôi.
                    </p>
                  </div>
                  <div className="shape shape-1">
                    <img
                      src="/template-assets/images/shape/shape-1.svg"
                      alt="shape"
                    />
                  </div>
                  <div className="shape shape-2">
                    <img
                      src="/template-assets/images/shape/shape-2.svg"
                      alt="shape"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="single-service service-border d-flex">
                  <div className="service-icon">
                    <img
                      src="/template-assets/images/service-2.png"
                      alt="Icon"
                    />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">Đa dạng loại câu hỏi</h4>
                    <p className="text">
                      Bạn có thể tạo ra bộ câu hỏi đa dạng và thú vị với 6 dạng
                      câu hỏi có thể lựa chọn.
                    </p>
                  </div>
                  <div className="shape shape-3">
                    <img
                      src="/template-assets/images/shape/shape-3.svg"
                      alt="shape"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="single-service d-flex">
                  <div className="service-icon">
                    <img
                      src="/template-assets/images/service-3.png"
                      alt="Icon"
                    />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">Tăng cường tương tác</h4>
                    <p className="text">
                      Người tham gia bộ câu hỏi không chỉ trả lời câu hỏi mà có
                      cỏ thể trò chuyện, sử dụng biểu cảm với mọi người trong
                      suốt quá trình diễn ra.
                    </p>
                  </div>
                  <div className="shape shape-4">
                    <img
                      src="/template-assets/images/shape/shape-4.svg"
                      alt="shape"
                    />
                  </div>
                  <div className="shape shape-5">
                    <img
                      src="/template-assets/images/shape/shape-5.svg"
                      alt="shape"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="service-btn text-center pt-25 pb-15">
                  <Link passHref href="/home">
                    <a className="main-btn main-btn-2">Tìm hiểu thêm</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="portfolio" className="project-masonry-area pt-115">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-4">
              <div
                className="section-title pb-20 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.4s"
              >
                <h6 className="sub-title">Portfolio</h6>
                <h4 className="title">
                  Portfolio <span>Gallery.</span>
                </h4>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="project-menu text-center text-sm-left text-lg-right pb-20">
                <ul>
                  <li className="active" data-filter="*">
                    See All
                  </li>
                  <li data-filter=".apps">Apps</li>
                  <li data-filter=".branding">Branding</li>
                  <li data-filter=".creative">Creative</li>
                  <li data-filter=".laptop">Laptop</li>
                  <li data-filter=".product">Product</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row grid">
            <div className="col-lg-4 col-sm-6 grid-item apps creative laptop">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-1.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-1.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 grid-item branding creative">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-2.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-2.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 grid-item apps branding product">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-3.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-3.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 grid-item laptop product">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-5.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-5.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 grid-item branding creative">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-4.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-4.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 grid-item apps laptop product">
              <div className="single-gallery gallery-masonry mt-30">
                <div className="gallery-image">
                  <img
                    src="/template-assets/images/protfolio-6.jpg"
                    alt="protfolio"
                  />
                </div>
                <div className="gallery-icon">
                  <a
                    className="image-popup"
                    href="/template-assets/images/protfolio-6.jpg"
                  >
                    <span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="gallery-btn mt-60 text-center">
                <a className="main-btn" href="#">
                  Load More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section
        data-scroll-index="0"
        id="pricing"
        className="pricing-area pt-115"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-sm-9">
              <div
                className="section-title text-center pb-20 wow fadeInUpBig"
                data-wow-duration="1s"
                data-wow-delay="0.2s"
              >
                <h6 className="sub-title">Phần quà ngay hôm nay</h6>
                <h4 className="title">
                  Tham gia cùng với chúng tôi ngay hôm nay để{' '}
                  <span>nhận những phần quà hấp dẫn.</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            {/* <div className="col-lg-4 col-md-7 col-sm-9">
              <div
                className="single-pricing text-center pricing-color-1 mt-30 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.3s"
              >
                <div className="pricing-price">
                  <span className="price">
                    <b>50</b>/m.<span className="symbol">$</span>
                  </span>
                </div>
                <div className="pricing-title mt-20">
                  <span className="btn">20% Off</span>
                  <h4 className="title">Basic</h4>
                </div>
                <div className="pricing-list pt-20">
                  <ul>
                    <li>Full Access</li>
                    <li>Unlimited Bandwidth</li>
                    <li>50 gb Space</li>
                    <li>1 Month Support</li>
                  </ul>
                </div>
                <div className="pricing-btn pt-70">
                  <a className="main-btn main-btn-2" href="#">
                    Sign Up Now !
                  </a>
                </div>
              </div>
            </div> */}
            <div className="col-lg-4 col-md-7 col-sm-9 pr-0 pr-md-2">
              <div
                className="single-pricing text-center pricing-active pricing-color-2 mt-30 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.6s"
              >
                <div className="pricing-price">
                  <span className="price">
                    <b>Tham gia khảo sát</b>
                    <br />
                    Nhận ngay
                    <span className="text-primary">
                      <b>5000</b> Quiwi Xu
                    </span>
                  </span>
                </div>
                {/* <div className="pricing-title mt-20">
                  <span className="btn">Special</span>
                  <h4 className="title">Standard</h4>
                </div> */}
                {/* <div className="pricing-list pt-20">
                  <ul>
                    <li>Full Access</li>
                    <li>Unlimited Bandwidth</li>
                    <li>50 gb Space</li>
                    <li>1 Month Support</li>
                  </ul>
                </div> */}
                <div className="pt-70">
                  <div
                    className="main-btn main-btn-2 text-uppercase"
                    onClick={() =>
                      router.push('https://forms.gle/1xT8JA24ARV77iHj6')
                    }
                  >
                    Khảo sát ngay
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-7 col-sm-9 ps-0 ps-md-2">
              <div
                className="single-pricing text-center pricing-active pricing-color-2 mt-30 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.6s"
              >
                <div className="pricing-price">
                  <span className="price">
                    <b>Đăng kí ngay hôm nay</b>
                    <br />
                    Nhận ngay
                    <span className="text-primary">
                      <b>5000</b> Quiwi Xu
                    </span>
                  </span>
                </div>
                {/* <div className="pricing-title mt-20">
                  <span className="btn">Special</span>
                  <h4 className="title">Standard</h4>
                </div> */}
                {/* <div className="pricing-list pt-20">
                  <ul>
                    <li>Full Access</li>
                    <li>Unlimited Bandwidth</li>
                    <li>50 gb Space</li>
                    <li>1 Month Support</li>
                  </ul>
                </div> */}
                <div className="pricing-btn pt-70">
                  <div
                    className="main-btn"
                    onClick={() => router.push('/sign-in')}
                  >
                    Đăng kí ngay
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-7 col-sm-9">
              <div
                className="single-pricing text-center pricing-color-3 mt-30 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.9s"
              >
                <div className="pricing-price">
                  <span className="price">
                    <b>99</b>/m.<span className="symbol">$</span>
                  </span>
                </div>
                <div className="pricing-title mt-20">
                  <span className="btn">New</span>
                  <h4 className="title">Premium</h4>
                </div>
                <div className="pricing-list pt-20">
                  <ul>
                    <li>Full Access</li>
                    <li>Unlimited Bandwidth</li>
                    <li>50 gb Space</li>
                    <li>1 Month Support</li>
                  </ul>
                </div>
                <div className="pricing-btn pt-70">
                  <a className="main-btn main-btn-2" href="#">
                    Sign Up Now !
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* <section id="testimonial" className="testimonial-area pt-70 pb-120">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-5 col-lg-6">
              <div
                className="testimonial-left-content mt-45 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.3s"
              >
                <div className="section-title">
                  <h6 className="sub-title">Testimonials</h6>
                  <h4 className="title">What Client Says, About Us</h4>
                </div>
                <ul className="testimonial-line">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <p className="text">
                  Duis et metus et massa tempus lacinia. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos. Maecenas ultricies, orci molestie blandit interdum.
                  <br />
                  <br />
                  ipsum ante pellentesque nisl, eget mollis turpis quam nec
                  eros. ultricies, orci molestie blandit interdum.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="testimonial-right-content mt-50 wow fadeIn"
                data-wow-duration="1s"
                data-wow-delay="0.6s"
              >
                <div className="quota">
                  <i className="lni-quotation"></i>
                </div>
                <div className="testimonial-content-wrapper testimonial-active">
                  <div className="single-testimonial">
                    <div className="testimonial-text">
                      <p className="text">
                        “Praesent scelerisque, odio eu fermentum malesuada, nisi
                        arcu volutpat nisl, sit amet convallis nunc turp.”
                      </p>
                    </div>
                    <div className="testimonial-author d-sm-flex justify-content-between">
                      <div className="author-info d-flex align-items-center">
                        <div className="author-image">
                          <img
                            src="/template-assets/images/author-1.jpg"
                            alt="author"
                          />
                        </div>
                        <div className="author-name media-body">
                          <h5 className="name">John Doe</h5>
                          <span className="sub-title">CEO, Alphabet</span>
                        </div>
                      </div>
                      <div className="author-review">
                        <ul className="star">
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                        </ul>
                        <span className="review">( 7 Reviews )</span>
                      </div>
                    </div>
                  </div>
                  <div className="single-testimonial">
                    <div className="testimonial-text">
                      <p className="text">
                        “Praesent scelerisque, odio eu fermentum malesuada, nisi
                        arcu volutpat nisl, sit amet convallis nunc turp.”
                      </p>
                    </div>
                    <div className="testimonial-author d-sm-flex justify-content-between">
                      <div className="author-info d-flex align-items-center">
                        <div className="author-image">
                          <img
                            src="/template-assets/images/author-2.jpg"
                            alt="author"
                          />
                        </div>
                        <div className="author-name media-body">
                          <h5 className="name">John Doe</h5>
                          <span className="sub-title">CEO, Alphabet</span>
                        </div>
                      </div>
                      <div className="author-review">
                        <ul className="star">
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                        </ul>
                        <span className="review">( 7 Reviews )</span>
                      </div>
                    </div>
                  </div>
                  <div className="single-testimonial">
                    <div className="testimonial-text">
                      <p className="text">
                        “Praesent scelerisque, odio eu fermentum malesuada, nisi
                        arcu volutpat nisl, sit amet convallis nunc turp.”
                      </p>
                    </div>
                    <div className="testimonial-author d-sm-flex justify-content-between">
                      <div className="author-info d-flex align-items-center">
                        <div className="author-image">
                          <img
                            src="/template-assets/images/author-3.jpg"
                            alt="author"
                          />
                        </div>
                        <div className="author-name media-body">
                          <h5 className="name">John Doe</h5>
                          <span className="sub-title">CEO, Alphabet</span>
                        </div>
                      </div>
                      <div className="author-review">
                        <ul className="star">
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                          <li>
                            <i className="lni-star"></i>
                          </li>
                        </ul>
                        <span className="review">( 7 Reviews )</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>  */}

      {/* <div id="brand" className="brand-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="brand-wrapper pt-70 clearfix">
                <div
                  className="single-brand mt-50 text-md-left wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.2s"
                >
                  <img src="/template-assets/images/brand-1.png" alt="brand" />
                </div>
                <div
                  className="single-brand mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.3s"
                >
                  <img src="/template-assets/images/brand-2.png" alt="brand" />
                </div>
                <div
                  className="single-brand mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.4s"
                >
                  <img src="/template-assets/images/brand-3.png" alt="brand" />
                </div>
                <div
                  className="single-brand mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.5s"
                >
                  <img src="/template-assets/images/brand-4.png" alt="brand" />
                </div>
                <div
                  className="single-brand mt-50 text-md-right wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.6s"
                >
                  <img src="/template-assets/images/brand-5.png" alt="brand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <section id="blog" className="blog-area pt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div
                className="section-title text-center pb-20 wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.3s"
              >
                <h6 className="sub-title">Bộ câu hỏi nổi bật</h6>
                <h4 className="title">
                  <span>Đừng chần chừ</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {popularQuizzes?.map((quiz) => (
              <div key={quiz.id} className="col-lg-4 col-md-6 col-sm-8">
                <div
                  className="single-blog mt-30 wow fadeInUpBig"
                  data-wow-duration="1s"
                  data-wow-delay="0.4s"
                >
                  <div className="blog-image">
                    <a href={`/quiz/${quiz.id}`}>
                      <img src={quiz.banner} alt="news" />
                    </a>
                  </div>
                  <div className="blog-content">
                    <h4 className="blog-title">
                      <a href={`/quiz/${quiz.id}`}>{quiz.title}</a>
                    </h4>
                    <div className="blog-author d-flex align-items-center">
                      <div className="author-image">
                        <img
                          src={
                            quiz.user?.avatar ?? '/assets/default-avatar.png'
                          }
                          alt="author"
                        />
                      </div>
                      <div className="author-content media-body">
                        <h6 className="sub-title">Tạo bởi</h6>
                        <p className="text">
                          <a href={`/users/${quiz.user?.id}`}>
                            {quiz.user?.name}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="contact" className="contact-area pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div
                className="section-title text-center pb-20 wow fadeInUp"
                data-wow-duration="1s"
                data-wow-delay="0.3s"
              >
                <h6 className="sub-title">Our Contact</h6>
                <h4 className="title">
                  Get In <span>Touch.</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="contact-info pt-30">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div
                  className="single-contact-info contact-color-1 mt-30 d-flex wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.3s"
                >
                  <div className="contact-info-icon">
                    <i className="lni-map-marker"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">
                      21 King Street, Melbourne <br />
                      Victoria, 1202 Australia.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="single-contact-info contact-color-2 mt-30 d-flex wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.6s"
                >
                  <div className="contact-info-icon">
                    <i className="lni-envelope"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">hello@uideck.com</p>
                    <p className="text">support@uideck.com</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="single-contact-info contact-color-3 mt-30 d-flex wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay="0.9s"
                >
                  <div className="contact-info-icon">
                    <i className="lni-phone"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">+99 000 1111 555</p>
                    <p className="text">+88 999 5555 444</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div
                className="contact-wrapper-form pt-115 wow fadeInUpBig"
                data-wow-duration="1s"
                data-wow-delay="0.5s"
              >
                <h4 className="contact-title pb-10">
                  <i className="lni-envelope"></i> Leave <span>A Message.</span>
                </h4>

                <form
                  id="contact-form"
                  action="/template-assets/contact.php"
                  method="post"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="contact-form mt-45">
                        <label>Enter Your Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-form mt-45">
                        <label>Enter Your Email</label>
                        <input type="email" name="email" placeholder="Email" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="contact-form mt-45">
                        <label>Your Message</label>
                        <textarea
                          name="message"
                          placeholder="Enter your message..."
                        ></textarea>
                      </div>
                    </div>
                    <p className="form-message"></p>
                    <div className="col-md-12">
                      <div className="contact-form mt-45">
                        <button type="submit" className="main-btn">
                          Send Now
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <br />
      <br />
      <br />

      <footer
        id="footer"
        className="footer-area bg_cover"
        style={{
          backgroundImage: 'url(/template-assets/images/footer-bg.jpg)',
        }}
      >
        <div className="container">
          {/* <div className="footer-widget pt-30 pb-70">
            <div className="row">
              <div className="col-lg-3 col-sm-6 order-sm-1 order-lg-1">
                <div className="footer-about pt-40">
                  <a href="#">
                    <img src="/template-assets/images/logo.png" alt="Logo" />
                  </a>
                  <p className="text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repellendus, repudiandae! Totam, nemo sed? Provident.
                  </p>
                  <p className="text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repellendus
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-3 order-lg-2">
                <div className="footer-link pt-40">
                  <div className="footer-title">
                    <h5 className="title">Services</h5>
                  </div>
                  <ul>
                    <li>
                      <a href="#">Business Consultancy</a>
                    </li>
                    <li>
                      <a href="#">Digital Marketing</a>
                    </li>
                    <li>
                      <a href="#">Market Analysis</a>
                    </li>
                    <li>
                      <a href="#">Web Development</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-4 order-lg-3">
                <div className="footer-link pt-40">
                  <div className="footer-title">
                    <h5 className="title">About Us</h5>
                  </div>
                  <ul>
                    <li>
                      <a href="#">Overview</a>
                    </li>
                    <li>
                      <a href="#">Why us</a>
                    </li>
                    <li>
                      <a href="#">Awards & Recognitions</a>
                    </li>
                    <li>
                      <a href="#">Team</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-2 order-lg-4">
                <div className="footer-contact pt-40">
                  <div className="footer-title">
                    <h5 className="title">Contact Info</h5>
                  </div>
                  <div className="contact pt-10">
                    <p className="text">
                      21 King Street, Melbourne <br />
                      Victoria, 1202 Australia.
                    </p>
                    <p className="text">support@uideck.com</p>
                    <p className="text">+99 000 555 66 22</p>

                    <ul className="social mt-40">
                      <li>
                        <a href="#">
                          <i className="lni-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="lni-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="lni-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="lni-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="footer-copyright text-center">
            <p className="text">
              © 2022 Quiwi JSC. All Rights Reserved.
              {/* <a href="https://uideck.com" rel="nofollow">
                UIdeck
              </a>{' '}
              All Rights Reserved. */}
            </p>
          </div>
        </div>
      </footer>

      <a href="#" className="back-to-top">
        <i className="lni-chevron-up"></i>
      </a>

      <>
        <Script
          type="text/javascript"
          src="/template-assets/js/vendor/jquery-1.12.4.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/jquery.magnific-popup.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/jquery.counterup.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/jquery.appear.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/jquery.nav.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/vendor/modernizr-3.7.1.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/popper.min.js"
        ></Script>
        <Script
          type="text/javascript"
          src="/template-assets/js/bootstrap.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/slick.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/imagesloaded.pkgd.min.js"
        ></Script>
        <Script
          type="text/javascript"
          src="/template-assets/js/isotope.pkgd.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/waypoints.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/circles.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/wow.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/headroom.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/scrollIt.min.js"
        ></Script>

        <Script
          type="text/javascript"
          src="/template-assets/js/main.js"
        ></Script>
      </>
    </>
  ) : (
    <></>
  )
}

export default WelcomePage
