import React, { Dispatch, FC, SetStateAction } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import useSWR from 'swr'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { get } from '../../../libs/api'
import { TApiResponse, TUserItems } from '../../../types/types'
import MyModal from '../../MyModal/MyModal'
import styles from './BackgroundPicker.module.css'

const BackgroundPicker: FC<{
  show: boolean
  onHide: () => void
  setCurrentBackground: Dispatch<SetStateAction<string>>
}> = (props) => {
  const authContext = useAuth()
  const user = authContext.getUser()
  const [lsBg, saveLsBg] = useLocalStorage('bg', '')

  const { data } = useSWR<TApiResponse<TUserItems[]>>(
    user ? [`/api/users/user/${user.id}/items?type=Hình nền`] : null,
    get
  )

  return (
    <MyModal
      show={props.show}
      onHide={props.onHide}
      fullscreen
      header={<div className="fs-24px fw-medium">Chọn ảnh nền</div>}
      size="xl"
    >
      <Row>
        <Col
          xs="6"
          md="4"
          xl="3"
          className="mb-3 cursor-pointer"
          onClick={() => {
            props.setCurrentBackground('/assets/default-game-bg.svg')
            saveLsBg('/assets/default-game-bg.svg')
          }}
        >
          <div className="w-100 h-100 overflow-hidden rounded-10px">
            <Image
              src="/assets/default-game-bg.svg"
              width="100%"
              height="100%"
              className={styles.image}
              alt=""
            />
          </div>
        </Col>
        {data?.response.map((item, key) => (
          <Col
            xs="6"
            md="4"
            xl="3"
            key={key}
            className="mb-3 cursor-pointer"
            onClick={() => {
              props.setCurrentBackground(item.item.avatar)
              saveLsBg(item.item.avatar)
            }}
          >
            <div className="w-100 h-100 overflow-hidden rounded-10px">
              <Image
                src={item.item.avatar}
                width="100%"
                height="100%"
                className={styles.image}
                alt=""
              />
            </div>
          </Col>
        ))}
      </Row>
    </MyModal>
  )
}

export default React.memo(BackgroundPicker)
