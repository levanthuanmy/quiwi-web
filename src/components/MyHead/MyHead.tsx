import Head from 'next/head'
import React, { FC } from 'react'

const MyHead: FC = () => {
  return (
    <Head>
      <link rel="icon" href="/assets/logo.png" />
      <link type="image/x-icon" rel="shortcut icon" href="/assets/logo.png" />
      <link rel="apple-touch-icon" href="/assets/logo.png"></link>
    </Head>
  )
}

export default MyHead
