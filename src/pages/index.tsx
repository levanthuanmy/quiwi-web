import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import FullScreenLoader from '../components/FullScreenLoader/FullScreenLoader'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/welcome')
  }, [])

  return (
    <>
      <FullScreenLoader isLoading />
    </>
  )
}

export default Home
