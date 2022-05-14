import { Field, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Col, Container, Form, Image, Row } from 'react-bootstrap'
import * as Yup from 'yup'
import LeftProfileMenuBar from '../../components/LeftProfileMenuBar/LeftProfileMenuBar'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import NavBar from '../../components/NavBar/NavBar'
import { get, post } from '../../libs/api'
import { TApiResponse, TUser, TUserProfile } from '../../types/types'

type ProfileForm = {
  name: string
  phoneNumber: string
  gender: string
  email: string
}

const EditProfilePage: NextPage = () => {
  const [userResponse, setUserReponse] = useState<TUserProfile>()

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

  const onUpdatingProfile = async (
    body: ProfileForm,
    actions: FormikHelpers<ProfileForm>
  ) => {
    console.log('==== ~ body', body)
    try {
      const res: TApiResponse<TUser> = await post(
        '/api/users/profile',
        {},
        body,
        true
      )
      console.log('==== ~ res', res)
      alert('Cập nhật thành công')
      if (res.response) {
        userResponse && setUserReponse({ ...userResponse, user: res.response })
      }

      // setUser(res.response)
      // authNavigate.toPrevRoute()
    } catch (error) {
      console.log('onUpdatingProfile - error', error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Tên quá ngắn!').max(100, 'Tên quá dài!'),
    email: Yup.string().email('Email không hợp lệ'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
      .min(8, '')
      .max(12, ''),
  })

  const handleUpdateProfile = (
    values: ProfileForm,
    actions: FormikHelpers<ProfileForm>
  ) => {
    onUpdatingProfile(values, actions)
  }

  return userResponse ? (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container className="pt-64px  min-vh-100 position-relative">
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
                  email: userResponse.user.email ?? '',
                  gender: userResponse.user.gender ?? 'MALE',
                  name: userResponse.user.name ?? '',
                  phoneNumber: userResponse.user.phoneNumber ?? '',
                } as ProfileForm
              }
              onSubmit={handleUpdateProfile}
              validationSchema={ProfileSchema}
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
                  method="POST"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                >
                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Họ và Tên
                    </Col>
                    <Col>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Họ và tên"
                        as={MyInput}
                        // iconClassName="bi bi-person"
                        // className="mb-3"
                      />

                      {errors.name ? (
                        <div className="text-danger">{errors.name}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Email
                    </Col>
                    <Col>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        as={MyInput}
                        // iconClassName="bi bi-person"
                        // className="mb-3"
                      />
                      {errors.email ? (
                        <div className="text-danger">{errors.email}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Số điện thoại
                    </Col>
                    <Col>
                      <Field
                        type="number"
                        name="phoneNumber"
                        placeholder="Số điện thoại"
                        as={MyInput}
                        // iconClassName="bi bi-person"
                        // className="mb-3"
                      />
                      {errors.phoneNumber ? (
                        <div className="text-danger">{errors.phoneNumber}</div>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} lg={4} className="text-lg-end fw-medium">
                      Giới tính
                    </Col>
                    <Col>
                      <Field
                        as="select"
                        name="gender"
                        // component={customSelectionInput}
                        className="form-control rounded-10px h-50px d-flex px-12px overflow-hidden "
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </Field>
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

export default EditProfilePage
