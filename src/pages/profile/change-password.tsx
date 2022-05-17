import { Field, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Col, Container, Form, Image, Row } from 'react-bootstrap'
import * as Yup from 'yup'
import LeftProfileMenuBar from '../../components/LeftProfileMenuBar/LeftProfileMenuBar'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import NavBar from '../../components/NavBar/NavBar'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TUser, TUserProfile } from '../../types/types'

type PasswordForm = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordPage: NextPage = () => {
  const [userResponse, setUserReponse] = useState<TUserProfile>()
  const authContext = useAuth()

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
    if (!userResponse) {
      getUser()
    }
  }, [userResponse])

  const onUpdatingPassword = async (
    body: PasswordForm,
    actions: FormikHelpers<PasswordForm>
  ) => {
    if (body.confirmPassword !== body.oldPassword) {
      actions.setErrors({
        confirmPassword: 'Mật khẩu không khớp',
        newPassword: 'Mật khẩu không khớp',
      })
      return
    }
    try {
      const res: TApiResponse<TUser> = await post(
        '/api/auth/change-password',
        {},
        body,
        true
      )
      authContext.setUser(res.response)
      alert('Cập nhật thành công')
      if (res.response) {
        userResponse && setUserReponse({ ...userResponse, user: res.response })
      }
    } catch (error) {
      alert((error as Error)?.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleUpdatePassword = (
    values: PasswordForm,
    actions: FormikHelpers<PasswordForm>
  ) => {
    onUpdatingPassword(values, actions)
  }

  const PasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().min(6, 'Mật khẩu quá ngắn, tối thiểu 6 ký tự'),
    newPassword: Yup.string().min(6, 'Mật khẩu quá ngắn, tối thiểu 6 ký tự'),
    confirmPassword: Yup.string().min(
      6,
      'Mật khẩu quá ngắn, tối thiểu 6 ký tự'
    ),
  })
  return userResponse ? (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />

      <Container className="pt-80px  min-vh-100 position-relative">
        <Row className="border my-3">
          <Col xs={3} md={4} className="border-end menu text-center p-0">
            <LeftProfileMenuBar />
          </Col>
          <Col className="p-4">
            <Row className=" justify-content-center align-items-center">
              <Col xs={2} lg={4} className="text-lg-end">
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

            <Formik
              initialValues={
                {
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                } as PasswordForm
              }
              onSubmit={handleUpdatePassword}
              validationSchema={PasswordSchema}
            >
              {({
                // values,
                errors,
                // touched,
                // handleChange,
                // handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <Form
                  autoComplete="off"
                  method="POST"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                >
                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Mật khẩu cũ
                    </Col>
                    <Col>
                      <Field
                        autoComplete="off"
                        type="password"
                        name="oldPassword"
                        placeholder="Nhập mật khẩu cũ"
                        as={MyInput}
                      />

                      {errors.oldPassword ? (
                        <div className="text-danger">{errors.oldPassword}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Mật khẩu mới
                    </Col>
                    <Col>
                      <Field
                        autoComplete="off"
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        as={MyInput}
                      />

                      {errors.newPassword ? (
                        <div className="text-danger">{errors.newPassword}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Xác nhận mật khẩu
                    </Col>
                    <Col>
                      <Field
                        autoComplete="off"
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        as={MyInput}
                      />

                      {errors.confirmPassword ? (
                        <div className="text-danger">
                          {errors.confirmPassword}
                        </div>
                      ) : null}
                    </Col>
                  </Row>

                  <div className="text-center pt-3">
                    <MyButton
                      className="text-white"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Lưu thông tin
                    </MyButton>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    <div>Loading</div>
  )
}

export default ChangePasswordPage
