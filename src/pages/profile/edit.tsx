import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Form, Image, Row } from 'react-bootstrap'
import ItemMenuBar from '../../components/ItemMenuBar/ItemMenuBar'
import MenuBar from '../../components/MenuBar/MenuBar'
import MyButton from '../../components/MyButton/MyButton'
import NavBar from '../../components/NavBar/NavBar'
import { get } from '../../libs/api'
import { TApiResponse, TUserProfile } from '../../types/types'
import { profileMenuOptions } from '../../utils/constants'

const EditProfilePage: NextPage = () => {
  const [userResponse, setUserReponse] = useState<TUserProfile>()

  const router = useRouter()
  useEffect(() => {
    const getUser = async () => {
      try {
        const res: TApiResponse<TUserProfile> = await get(
          `/api/users/profile`,
          true
        )
        if (res.response) {
          setUserReponse(res.response)
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }

    !userResponse && getUser()
  }, [userResponse])

  return userResponse ? (
    <>
      <NavBar />
      <Container className="pt-64px  min-vh-100 position-relative">
        <Row className="border my-3">
          <Col xs={3} className="border-end menu text-center p-0">
            {profileMenuOptions.map((option, idx) => {
              return (
                <ItemMenuBar
                  key={idx}
                  iconClassName={option.iconClassName}
                  title={option.title}
                  url={option.url}
                  isActive={router.pathname === option.url}
                />
              )
            })}
          </Col>
          <Col className="p-4">
            <Row className=" justify-content-center align-items-center">
              <Col lg={4} className="text-end">
                <Image
                  fluid={true}
                  alt="avatar"
                  src="/assets/default-logo.png"
                  width={40}
                  height={40}
                  className="rounded-circle"
                />
              </Col>
              <Col className="fs-16px fw-medium">
                {userResponse.user.username}
              </Col>
            </Row>

            <form>
              <Row className="justify-content-center align-items-center py-2">
                <Col xs={12} lg={4} className="text-lg-end fw-medium">
                  Họ và Tên
                </Col>
                <Col>
                  <Form.Control
                    placeholder=""
                    defaultValue={userResponse.user.name}
                  />
                </Col>
              </Row>

              <div className="text-center pt-3">
                <MyButton className="text-white">Lưu thông tin</MyButton>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    <div>Loading</div>
  )
}

export default EditProfilePage
