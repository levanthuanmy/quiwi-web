import Head from 'next/head'
import React, { FC } from 'react'
import { API_URL, GOOGLE_ANALYTICS } from '../../utils/constants'

const MyHead: FC = () => {
  return (
    <Head>
      <link rel="icon" href="/assets/logo.png" />
      <link type="image/x-icon" rel="shortcut icon" href="/assets/logo.png" />
      <link rel="apple-touch-icon" href="/assets/logo.png"></link>

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
      <title>Quiwi Game</title>
      <meta
        name="description"
        content="Quiwi là một trang web cho phép bạn tham gia quiz hoặc tạo quiz của chính mình"
      />
      <link rel="canonical" href="https://web.quiwi.games/" />
      <meta
        name="keywords"
        content="quiwi, Quiwi, game, games, quiz, quizzes"
      ></meta>

      {/* google analytics */}
      {/* Global Site Tag (gtag.js) - Google Analytics */}
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
    </Head>
  )
}

export default MyHead
