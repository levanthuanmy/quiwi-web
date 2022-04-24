import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Container, Image, Row, Col, Form, Button } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import { get } from '../../libs/api'
import { TApiResponse, TUserProfile } from '../../types/types'

const EditProfilePage: NextPage = () => {
  //   const [userResponse, setUserReponse] = useState<TUserProfile>()

  //   useEffect(() => {
  //     const getUser = async () => {
  //       try {
  //         const res: TApiResponse<TUserProfile> = await get(
  //           `/api/users/profile`,
  //           true
  //         )
  //         if (res.response) {
  //           setUserReponse(res.response)
  //         }
  //       } catch (error) {
  //         alert('Có lỗi nè')
  //         console.log(error)
  //       }
  //     }

  //     getUser()
  //   }, [])

  return (
    <>
      <NavBar />
      <Container className="pt-64px min-vh-100 position-relative">
        <Row className="justify-content-center align-items-center">
          <Col className="text-end">
            <Image
              fluid={true}
              alt="avatar"
              src="/assets/default-logo.png"
              width={40}
              height={40}
              className="rounded-circle"
            />
          </Col>
          <Col className="fs-16px fw-medium">username</Col>
        </Row>

        <form>
          <Row className="justify-content-center align-items-center">
            <Col className="text-end fw-medium">Họ và Tên</Col>
            <Col>
              <Form.Control placeholder="" value="My name" />
            </Col>
          </Row>

          <Row className="justify-content-center align-items-center">
            <Col className="text-end fw-medium">Email</Col>
            <Col>
              <Form.Control type="email" placeholder="" value="Email" />
            </Col>
          </Row>

          <Row className="justify-content-center align-items-center">
            <Col className="text-end fw-medium">Số điện thoại</Col>
            <Col>
              <Form.Control placeholder="" value="0123456789" />
            </Col>
          </Row>

          <Button>Lưu thông tin</Button>
        </form>
      </Container>
    </>
  )
}

export default EditProfilePage
