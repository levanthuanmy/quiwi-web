import React, { FC, useState } from 'react'
import { Col, Image, Placeholder, Row } from 'react-bootstrap'
import { TQuiz } from '../../types/types'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type CardQuizInfoProps = {
  quiz: TQuiz | undefined
  isValidating: boolean
}

const CardQuizInfo: FC<CardQuizInfoProps> = ({ quiz, isValidating }) => {
  const [bannerUrl, setBannerUrl] = useState<string>('')

  const handleUploadImage = async (evt: any) => {
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
        className="border rounded-10px position-relative overflow-hidden"
        style={{ height: 120 }}
      >
        {bannerUrl.length ? (
          <Image
            src={bannerUrl}
            alt=""
            width="100%"
            height="100%"
            className="object-fit-cover"
          />
        ) : (
          <div className="py-4 text-center fs-14px text-secondary">
            <input
              type="file"
              onChange={handleUploadImage}
              onDropCapture={handleUploadImage}
              className="position-absolute top-0 w-100 h-100 opacity-0 cursor-pointer"
              accept="image/png, image/jpeg, image/jpg"
              style={{ left: 0 }}
            />
            <div className="bi bi-image text-primary fs-32px"></div>
            Bấm hoặc kéo thả tại đây để thêm ảnh bìa
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

          <div className="fs-14px text-secondary">
            <div>
              <i className="bi bi-eye me-2 fs-16px" />
              <TextSkeletonLoading
                content={quiz?.isPublic ? 'Công khai' : 'Riêng tư'}
                isValidating={isValidating}
              />
            </div>
            {/* <div>
              <i className="bi bi-journals me-2 fs-16px" />
              Toán học, Tư duy
            </div> */}
          </div>
        </Col>
        <Col xs="auto">
          <QuestionActionButton iconClassName="bi bi-pencil" />
        </Col>
      </Row>
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
