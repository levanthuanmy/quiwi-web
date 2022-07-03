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
  email: string
  name: string
}

const SignUpModal: FC<{ setShow: Dispatch<SetStateAction<boolean>> }> = ({
  setShow,
}) => {
  const initialValues: SignUpForm = {
    username: '',
    password: '',
    name: '',
    email: '',
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
    name: Yup.string().min(6, 'Tên quá ngắn!').max(100, 'Tên quá dài!'),
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
          // errors,
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
              className="mb-3"
            />
            <Field
              type="text"
              name="name"
              placeholder="Họ và tên"
              as={MyInput}
              iconClassName="bi bi-card-text"
              className="mb-3"
            />
            <Field
              type="text"
              name="email"
              placeholder="Email"
              as={MyInput}
              iconClassName="bi bi-envelope"
              className="mb-3"
            />
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
              className="mb-3"
            />

            <MyButton
              className="w-100 fw-medium text-white"
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
