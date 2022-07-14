import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Dispatch, FC, SetStateAction } from 'react'
import { Modal } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import * as Yup from 'yup'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { post } from '../../../libs/api'
import { TApiResponse, TUser } from '../../../types/types'
import MyButton from '../../MyButton/MyButton'
import MyInput from '../../MyInput/MyInput'
import MyModal from '../../MyModal/MyModal'

type SignUpForm = {
  username: string
  password: string
  email?: string
  name: string
}

const SignUpModal: FC<{ setShow: Dispatch<SetStateAction<boolean>> }> = ({
  setShow,
}) => {
  const initialValues: SignUpForm = {
    username: '',
    password: '',
    name: '',
  }
  const { addToast } = useToasts()
  const authContext = useAuth()

  const onSignUp = async (
    body: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    try {
      const res: TApiResponse<TUser> = await post('/api/auth/signup', {}, body)
      authContext.setUser(res.response)
      addToast('Đăng ký thành công', {
        appearance: 'success',
      })
      authContext.setSignInModalHandler(false)
    } catch (error: any) {
      console.log('onSignUp - error', error)
      addToast(error?.message ?? 'Đăng ký thất bại', {
        appearance: 'error',
      })
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignUpFormSubmit = (
    values: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    onSignUp(values, actions)
  }

  const ProfileSchema = Yup.object().shape({
    username: Yup.string()
      .min(6, 'Tên tài khoản phải có ít nhất 6 ký tự')
      .max(50, 'Tên tài khoản tối đa 50 ký tự'),
    email: Yup.string().email('Email không hợp lệ'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })

  return (
    <MyModal
      show={authContext.signInModalHandler}
      onHide={() => authContext.setSignInModalHandler(false)}
      header={<Modal.Title>Đăng ký</Modal.Title>}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSignUpFormSubmit}
        validationSchema={ProfileSchema}
      >
        {({
          // values,
          errors,
          // touched,
          // handleChange,
          // handleBlur,
          // handleSubmit,
          isSubmitting,
        }) => (
          <Form>
            <Field
              type="text"
              name="username"
              placeholder="Tên tài khoản"
              as={MyInput}
              iconClassName="bi bi-person"
            />
            {errors.username ? (
              <div className="text-danger text-start">{errors.username}</div>
            ) : null}
            <Field
              type="text"
              name="name"
              placeholder="Họ và tên"
              as={MyInput}
              iconClassName="bi bi-card-text"
              className="mt-3"
            />

            <Field
              type="text"
              name="email"
              placeholder="Email"
              as={MyInput}
              iconClassName="bi bi-envelope"
              className="mt-3"
            />
            {errors.email ? (
              <div className="text-danger text-start">{errors.email}</div>
            ) : null}
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
              className="mt-3"
            />
            {errors.password ? (
              <div className="text-danger text-start">{errors.password}</div>
            ) : null}
            <MyButton
              className="w-100 fw-medium text-white mt-3"
              type="submit"
              disabled={isSubmitting}
            >
              Đăng ký
            </MyButton>
          </Form>
        )}
      </Formik>

      <div className="text-secondary pt-4 text-center">
        <div onClick={() => setShow(false)}>
          Đã có tài khoản?{' '}
          <span className="text-primary cursor-pointer fw-medium">
            Đăng nhập
          </span>
        </div>
      </div>
    </MyModal>
  )
}

export default SignUpModal
