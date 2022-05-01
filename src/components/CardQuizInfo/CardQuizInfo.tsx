import React, { FC, useState } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

const CardQuizInfo: FC = () => {
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
          <div className="fw-medium fs-18px">Đây là tên của quiz</div>

          <div className="fs-14px text-secondary mt-3">
            <div>
              <i className="bi bi-eye me-2 fs-16px" />
              Công khai
            </div>
            <div>
              <i className="bi bi-journals me-2 fs-16px" />
              Toán học, Tư duy
            </div>
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
