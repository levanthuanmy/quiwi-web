import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Col, FormCheck, Image, Placeholder, Row } from 'react-bootstrap'
import { post } from '../../libs/api'
import { TApiResponse, TQuiz } from '../../types/types'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import MyButton from '../MyButton/MyButton'
import MyInput from '../MyInput/MyInput'
import MyModal from '../MyModal/MyModal'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type CardQuizInfoProps = {
  quiz: TQuiz | undefined
  isValidating: boolean
  setQuiz: React.Dispatch<React.SetStateAction<TQuiz | undefined>>
}

const CardQuizInfo: FC<CardQuizInfoProps> = ({
  quiz,
  isValidating,
  setQuiz,
}) => {
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const router = useRouter()
  const quizId = Number(router.query.id)

  useEffect(() => {
    if (quiz) {
      setBannerUrl(quiz.banner)
    }
  }, [quiz])

  const handleUploadImage = async (evt: any) => {
    console.log('handleUploadImage - evt', evt)
    try {
      const data: File = evt.target.files[0]

      const path = `/images/${data.name}`
      const ref = storageRef(storage, path)
      await uploadFile(ref, data)
      const url = await getUrl(ref)

      setBannerUrl(url)
    } catch (error) {
      console.log('handleUploadImage - error', error)
    }
  }

  return (
    <div className="rounded-10px border bg-white p-12px">
      <div
        className="border rounded-10px overflow-hidden"
        style={{ height: 120 }}
      >
        {quiz?.banner && quiz?.banner.length ? (
          <Image
            src={quiz?.banner}
            alt=""
            width="100%"
            height="100%"
            className="object-fit-cover"
          />
        ) : (
          <div className="py-4 text-center fs-14px text-secondary">
            <div className="bi bi-image text-primary fs-32px"></div>
          </div>
        )}
      </div>
      <Row className="d-flex pt-12px">
        <Col>
          <div className="fw-medium fs-18px">
            <TextSkeletonLoading
              content={quiz?.title}
              isValidating={isValidating}
            />
          </div>

          <div className="text-secondary mt-3">
            <TextSkeletonLoading
              content={quiz?.description}
              isValidating={isValidating}
            />
          </div>

          <div className="text-secondary">
            <div>
              <i className="bi bi-eye me-2 fs-16px" />
              <TextSkeletonLoading
                content={quiz?.isPublic ? 'Công khai' : 'Riêng tư'}
                isValidating={isValidating}
              />
            </div>
            <div>
              <i className="bi bi-journals me-2 fs-16px" />
              <TextSkeletonLoading
                content={`${quiz?.questions?.length} câu hỏi`}
                isValidating={isValidating}
              />
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <QuestionActionButton
            iconClassName="bi bi-pencil"
            onClick={() => setShowModal(true)}
          />
        </Col>
      </Row>

      <MyModal
        show={showModal}
        onHide={() => setShowModal(false)}
        header={<div className="fs-24px fw-medium">Chỉnh sửa Quiz</div>}
        fullscreen
      >
        <Formik
          initialValues={{
            title: quiz?.title ?? '',
            description: quiz?.description ?? '',
            isPublic: quiz?.isPublic ?? false,
          }}
          onSubmit={async (value, actions) => {
            try {
              if (!quiz) return

              const body = { ...quiz, ...value, banner: bannerUrl }
              const res = await post<TApiResponse<TQuiz>>(
                `/api/quizzes/${quizId}`,
                {},
                body,
                true
              )

              setQuiz(res.response)
              setShowModal(false)
            } catch (error) {
              console.log('onSaveQuestion - error', error)
            } finally {
              actions.setSubmitting(false)
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form
              method="POST"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <div
                className="border rounded-10px position-relative overflow-hidden"
                style={{ height: 120 }}
              >
                {bannerUrl && bannerUrl.length ? (
                  <Image
                    src={bannerUrl}
                    alt=""
                    width="100%"
                    height="100%"
                    className="object-fit-cover"
                  />
                ) : (
                  <div className="py-4 text-center fs-14px text-secondary">
                    <div className="bi bi-image text-primary fs-32px"></div>
                    Bấm hoặc kéo thả tại đây để cập nhật ảnh bìa
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleUploadImage}
                  className="position-absolute top-0 w-100 h-100 opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ left: 0 }}
                />
              </div>
              <Row className="justify-content-center align-items-center py-2">
                <Col xs={12} lg={4} className="text-lg-end fw-medium">
                  Tên
                </Col>
                <Col>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Tên"
                    as={MyInput}
                  />
                </Col>
              </Row>

              <Row className="justify-content-center align-items-center py-2">
                <Col xs={12} lg={4} className="text-lg-end fw-medium">
                  Mô tả
                </Col>
                <Col>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Mô tả"
                    as={MyInput}
                  />
                </Col>
              </Row>

              <Row className="justify-content-center align-items-center py-2">
                <Col xs={12} lg={4} className="text-lg-end fw-medium">
                  Công khai
                </Col>
                <Col>
                  <Field
                    type="switch"
                    name="isPublic"
                    placeholder="Công khai"
                    as={FormCheck}
                  />
                </Col>
              </Row>

              <div className="text-center pt-3">
                <MyButton
                  className="text-white w-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Lưu thông tin
                </MyButton>
              </div>
            </Form>
          )}
        </Formik>
      </MyModal>
    </div>
  )
}

export default CardQuizInfo

const TextSkeletonLoading: FC<{
  isValidating: boolean
  content: string | number | undefined
}> = ({ isValidating, content }) => {
  return isValidating ? (
    <Placeholder animation="glow">
      <Placeholder xs="12" />
    </Placeholder>
  ) : (
    <>{content}</>
  )
}
