import { NextPage } from 'next'
import React from 'react'
import { Container, Image } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'

const ProfilePage: NextPage = () => {
  return (
    <>
      <NavBar />
      <div className="pt-64px min-vh-100 position-relative">
        <Image
          src="/assets/default-banner.svg"
          className="position-absolute w-100"
          style={{ zIndex: -1, objectFit:'cover' }}
        />
        <Container fluid="lg" className="p-3 py-5">
          <Image
            src="/assets/default-logo.png"
            width={240}
            height={240}
            className="rounded-circle border border-2 p-3 border-white"
          />
        </Container>
      </div>
    </>
  )
}

export default ProfilePage
