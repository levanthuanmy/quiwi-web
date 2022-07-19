import Head from 'next/head'
import React, { FC } from 'react'
import { API_URL, GOOGLE_ANALYTICS } from '../../utils/constants'

const MyHead: FC = () => {
  const logo = '/assets/logo.png'
  const webUrl = 'https://web.quiwi.games'
  const description =
    'Quiwi là một trang web cho phép bạn tham gia quiz hoặc tạo quiz của chính mình'
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="robots" content="index,follow" />
      <meta
        name="keywords"
        content="quiwi,Quiwi,game,games,quiz,quizzes,qiwi,kiwi,quiqui,wiwi,web,learning,edu,học,câu hỏi"
      ></meta>

      <meta property="og:title" content="Quiwi Game | Vừa Chơi Vừa Học" />
      <meta property="og:type" content="education.quiz.game" />
      <meta property="og:url" content={webUrl} />
      <meta property="og:image" content={`${webUrl}/assets/logo-w-bg.jpg`} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="website" />

      <meta name="description" content={description} />
      <meta name="author" content="Quiwi" />
      <meta name="copyright" content="Quiwi" />
      <meta name="theme-color" content="#009883" />

      <link rel="icon" href={logo} />
      <link type="image/x-icon" rel="shortcut icon" href={logo} />
      <link rel="apple-touch-icon" href={logo}></link>
      <link rel="shortcut icon" type="image" href={logo} sizes="32x32" />
      <link rel="shortcut icon" type="image" href={logo} sizes="16x16" />
      <link rel="alternate" href={webUrl} hrefLang="vi-vn" />

      <link
        rel="preconnect"
        href="https://firebasestorage.googleapis.com/v0/b/quiwi-511fc.appspot.com/o/"
      />
      <link
        rel="dns-prefetch"
        href="https://firebasestorage.googleapis.com/v0/b/quiwi-511fc.appspot.com/o/"
      />

      <link rel="preconnect" href={API_URL} />
      <link rel="dns-prefetch" href={API_URL} />

      <link rel="preconnect" href="https://i.picsum.photos" />
      <link rel="dns-prefetch" href="https://i.picsum.photos" />

      <link rel="preconnect" href="https://picsum.photos/600/400" />
      <link rel="dns-prefetch" href="https://picsum.photos/600/400" />

      <title>Quiwi Game | Vừa Chơi Vừa Học</title>
      <link rel="canonical" href={webUrl} />

      {/* google analytics */}
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </>

      {/* template */}
      <>
        <link
          as="script"
          rel="preload"
          href="/template-assets/js/vendor/jquery-1.12.4.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/jquery.magnific-popup.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/jquery.counterup.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/jquery.appear.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/jquery.nav.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/vendor/modernizr-3.7.1.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/popper.min.js"
        ></link>
        <link
          as="script"
          rel="preload"
          href="/template-assets/js/bootstrap.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/slick.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/imagesloaded.pkgd.min.js"
        ></link>
        <link
          as="script"
          rel="preload"
          href="/template-assets/js/isotope.pkgd.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/waypoints.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/circles.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/wow.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/headroom.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/scrollIt.min.js"
        ></link>

        <link
          as="script"
          rel="preload"
          href="/template-assets/js/main.js"
        ></link>

        <link
          rel="shortcut icon"
          href="/template-assets/images/favicon.png"
          type="image/png"
        />

        <link rel="preload" as="style" href="/template-assets/css/slick.css" />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/font-awesome.min.css"
        />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/LineIcons.css"
        />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/animate.css"
        />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/magnific-popup.css"
        />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/bootstrap.min.css"
        />

        <link
          rel="preload"
          as="style"
          href="/template-assets/css/default.css"
        />

        <link rel="preload" as="style" href="/template-assets/css/style.css" />
      </>
    </Head>
  )
}

export default MyHead
