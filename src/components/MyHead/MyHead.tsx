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
    </Head>
  )
}

export default MyHead
