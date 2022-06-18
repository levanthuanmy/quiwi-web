import Head from 'next/head'
import React, { FC } from 'react'
import { API_URL } from '../../utils/constants'

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
      <meta name="description" content="Quiwi là một trang web cho phép bạn tham gia quiz hoặc tạo quiz của chính mình"/>
      <link rel="canonical" href="https://web.quiwi.games/"/>
      <meta name="keywords" content="quiwi, Quiwi, game, games, quiz, quizzes"></meta>
    </Head>
  )
}

export default MyHead
