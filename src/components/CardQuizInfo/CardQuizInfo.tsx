import classNames from 'classnames'
import { Field, Form, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  Col,
  Container,
  FormCheck,
  Image,
  Placeholder,
  Row,
} from 'react-bootstrap'
import Select from 'react-select'
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
} from 'react-share'
import { useToasts } from 'react-toast-notifications'
import useSWR from 'swr'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TPaginationResponse,
  TQuiz,
  TQuizCategory,
} from '../../types/types'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import Loading from '../Loading/Loading'
import MyButton from '../MyButton/MyButton'
import MyInput from '../MyInput/MyInput'
import ScreenHandling from '../MyLeTooltip/ScreenHandling/ScreenHandling'
import MyModal from '../MyModal/MyModal'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type CardQuizInfoProps = {
  quiz: TQuiz | undefined
  isValidating: boolean
  setQuiz?: React.Dispatch<React.SetStateAction<TQuiz | undefined>>
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showShare, setShowShare] = useState<boolean>(false)
  const { addToast } = useToasts()
  const [showQuizModalAlert, setShowQuizModalAlert] = useState<boolean>(false) // use when removing quiz

  useEffect(() => {
    if (quiz) {
      setBannerUrl(quiz.banner)
    }
  }, [quiz])

  const handleUploadImage = async (evt: any) => {
    console.log('handleUploadImage - evt', evt)
    try {
      setIsLoading(true)

      const data: File = evt.target.files[0]

      const path = `/images/${data.name}`
      const ref = await storageRef(storage, path)
      console.log('handleUploadImage - chuân bị up ảnh')
      await uploadFile(ref, data)
      const url = await getUrl(ref)
      setBannerUrl(url)
    } catch (error) {
      console.log('handleUploadImage - error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const { data: categoryResponse } = useSWR<
    TApiResponse<TPaginationResponse<TQuizCategory>>
  >([`/api/quiz-categories`, false], get, { revalidateOnFocus: false })

  const categoryOptions: { value: number; label: string }[] = useMemo(() => {
    try {
      if (categoryResponse) {
        return categoryResponse?.response?.items?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }))
      }
    } catch (error) {
      console.log('categoryOptions useMemo - error', error)
    }
    return []
  }, [categoryResponse])

  const [selectedCategories, setSelectedCategories] = useState<number[]>()

  const handleRandomImage = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('https://picsum.photos/600/400')
      setBannerUrl(res?.url)
      await fetch(res?.url)
    } catch (error) {
      console.log('onClick={async - error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const INVITATION_LINK = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `http://${window.location.host}/quiz/${quizId}/play`
    }
    return `https://web.quiwi.games/quiz/${quizId}/play`
  }, [quizId])

  const onAcceptRemoveQuizAlert = async () => {
    try {
      await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}/delete`,
        {},
        {},
        true
      )
      router.back()
    } catch (error) {
      console.log('onAcceptRemoveQuizAlert - error', error)
    }
  }

  return (
    <Container className="py-3" fluid="lg">
      <Row className="d-flex">
        <Col>
          <div className="text-secondary h4">
            <TextSkeletonLoading
              content={quiz?.description}
              isValidating={isValidating}
            />
          </div>

          <div className="text-secondary">
            {quiz?.user?.name?.length ? (
              <div>
                <i className="bi bi-person-fill me-2 fs-16px" />
                <TextSkeletonLoading
                  content={quiz?.user?.name}
                  isValidating={isValidating}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <i className="bi bi-journal-bookmark-fill fs-16px" />
              {categoryOptions
                ?.filter(
                  (item) =>
                    _.findIndex(quiz?.quizCategories || [], [
                      'id',
                      item.value,
                    ]) > -1
                )
                .map((cate, key) => (
                  <div
                    key={key}
                    className="bg-primary bg-opacity-25 text-primary px-2 py-1 rounded"
                  >
                    {cate.label}
                  </div>
                ))}
            </div>
            <div>
              <i
                className={classNames('me-2 fs-16px', {
                  'bi-lock-fill': !quiz?.isPublic,
                  'bi-globe': quiz?.isPublic,
                })}
              />
              <TextSkeletonLoading
                content={quiz?.isPublic ? 'Công khai' : 'Riêng tư'}
                isValidating={isValidating}
              />
            </div>
            <div>
              <i className="bi bi-stack me-2 fs-16px" />
              <TextSkeletonLoading
                content={`${quiz?.questions?.length} câu hỏi`}
                isValidating={isValidating}
              />
            </div>
          </div>
        </Col>
        <Col xs="auto" className="d-flex flex-column gap-2">
          {setQuiz && (
            <>
              <ScreenHandling
                contentTooltip={'Bấm để xoá bộ câu hỏi'}
                displayNode={
                  <QuestionActionButton
                    className="bg-danger"
                    iconClassName="bi bi-trash text-white"
                    onClick={() => setShowQuizModalAlert(true)}
                  />
                }
              />
              <ScreenHandling
                contentTooltip={
                  'Bấm để chỉnh sửa thông tin cơ bản của bộ câu hỏi'
                }
                displayNode={
                  <QuestionActionButton
                    className="bg-primary"
                    iconClassName="bi bi-pencil-fill text-white"
                    onClick={() => setShowModal(true)}
                  />
                }
              />
            </>
          )}
          <ScreenHandling
            contentTooltip={
              quiz?.isPublic
                ? 'Bấm để chia sẻ bộ câu hỏi'
                : 'Đặt bộ câu hỏi ở chế độ CÔNG KHAI để có thể chia sẻ cho mọi người'
            }
            displayNode={
              <QuestionActionButton
                className={classNames('bg-info', {
                  'bg-opacity-100': quiz?.isPublic,
                  'bg-opacity-50': !quiz?.isPublic,
                })}
                iconClassName="bi bi-share-fill text-white"
                onClick={() => {
                  if (!quiz?.isPublic) return
                  setShowShare(true)
                }}
              />
            }
          />
        </Col>
      </Row>

      {setQuiz ? (
        <>
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

                  const body = {
                    ...quiz,
                    ...value,
                    banner: bannerUrl,
                    quizCategoryIds: selectedCategories,
                  }
                  const res = await post<TApiResponse<TQuiz>>(
                    `/api/quizzes/${quizId}`,
                    {},
                    body,
                    true
                  )

                  setQuiz(res.response)
                } catch (error) {
                  console.log('onSaveQuestion - error', error)
                } finally {
                  actions.setSubmitting(false)
                  setShowModal(false)
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
                  <div className="fw-medium">Bấm để chọn ảnh mới</div>
                  <div
                    className="border rounded-10px position-relative overflow-hidden"
                    style={{ height: 180 }}
                  >
                    {isLoading && (
                      <div className="position-absolute w-100 h-100 bg-black bg-opacity-75 d-flex justify-content-center align-items-center">
                        <Loading />
                      </div>
                    )}
                    {bannerUrl && bannerUrl.length ? (
                      <Image
                        src={bannerUrl}
                        alt=""
                        width="100%"
                        height="100%"
                        className="object-fit-cover"
                        loading="eager"
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
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <MyButton
                      variant="outline-secondary"
                      className="bi bi-arrow-clockwise fs-24px"
                      onClick={() => handleRandomImage()}
                      disabled={isLoading}
                    />
                    <div>Tự động chọn ảnh ngẫu nhiên</div>
                  </div>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} className="fw-medium">
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
                    <Col xs={12} className="fw-medium">
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

                  <Row className="justify-content-center align-items-center py-2 position-relative">
                    <Col xs={12} className="fw-medium">
                      Thể loại
                    </Col>
                    <Col className="position-relative">
                      <Select
                        isMulti
                        defaultValue={categoryOptions.filter(
                          (item) =>
                            _.findIndex(quiz?.quizCategories || [], [
                              'id',
                              item.value,
                            ]) > -1
                        )}
                        options={categoryOptions}
                        onChange={(options) =>
                          setSelectedCategories(
                            options.map((item) => item.value)
                          )
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="justify-content-center align-items-center py-2">
                    <Col xs={12} className="fw-medium">
                      Công khai
                    </Col>
                    <Col
                      xs={12}
                      className="fw-light fst-italic text-secondary fs-6"
                    >
                      * Bật công khai để chia sẻ bộ quiz với cộng đồng{' '}
                      <span className="fw-bold text-primary">Quiwi!</span>
                    </Col>
                    <Col>
                      <Field
                        type="switch"
                        name="isPublic"
                        className={'fs-2'}
                        defaultChecked={quiz?.isPublic ?? false}
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
          <MyModal
            show={showQuizModalAlert}
            onHide={() => setShowQuizModalAlert(false)}
            activeButtonTitle="Đồng ý"
            activeButtonCallback={() => onAcceptRemoveQuizAlert()}
            inActiveButtonCallback={() => setShowQuizModalAlert(false)}
            inActiveButtonTitle="Huỷ"
          >
            <div className="text-center h3">
              Bạn có chắc chắn muốn xoá bộ quiz này
            </div>
            <div className="text-center text-danger">
              Bạn không thể hoàn tác lại hành động này
            </div>
          </MyModal>
        </>
      ) : (
        <></>
      )}

      {quiz?.isPublic ? (
        <MyModal
          show={showShare}
          onHide={() => setShowShare(false)}
          header={<div className="fs-24px fw-medium">Chia sẻ bộ câu hỏi</div>}
          fullscreen
        >
          <div className="mt-3 d-flex gap-3 align-items-center">
            <div className="h5 mb-0">Chia sẻ lên:</div>
            <FacebookShareButton url={INVITATION_LINK}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <FacebookMessengerShareButton
              appId={'1126530964938904'}
              url={INVITATION_LINK}
            >
              <FacebookMessengerIcon size={40} round />
            </FacebookMessengerShareButton>
          </div>
          <div className="mt-3">
            <div>
              <div className="h5">Bấm để sao chép đường dẫn mời</div>
              <div
                className="d-flex w-100 bg-primary bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
                onClick={() => {
                  navigator?.clipboard?.writeText(INVITATION_LINK)

                  addToast(<>Copy thành công</>, {
                    autoDismiss: true,
                    appearance: 'success',
                  })
                }}
              >
                {INVITATION_LINK}
              </div>
            </div>
          </div>
        </MyModal>
      ) : (
        <></>
      )}
    </Container>
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
