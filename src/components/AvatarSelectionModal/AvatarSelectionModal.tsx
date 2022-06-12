import { FC, useEffect, useState } from 'react'
import { Col, Modal, Row, Image } from 'react-bootstrap'
import { get } from '../../libs/api'
import { TApiResponse, TItem, TUser, TUserItems } from '../../types/types'
import Loading from '../Loading/Loading'
import MyButton from '../MyButton/MyButton'
import Item from '../Item/Item'
import AvatarItem from './AvatarItem'
import classNames from 'classnames'

type MyModalProps = {
  show: boolean
  onHide: () => void
  user: TUser
}
const AvatarSelectionModal: FC<MyModalProps> = ({ show, onHide, user }) => {
  const [avatarItems, setAvatarItems] = useState<TUserItems[]>()
  const [choose, setChoose] = useState<number>()
  useEffect(() => {
    const getAvatarItems = async () => {
      try {
        if (user) {
          const param = {
            filter: {
              where: { itemCategory: { name: 'Ảnh đại diện' } },
              relations: ['itemCategory'],
            },
          }
          const res = await get<TApiResponse<TUserItems[]>>(
            `/api/users/user/${user.id}/items`,
            true,
            param
          )
          if (res.response) {
            setAvatarItems(res.response)
            for (const item of res.response) {
              // if (item.itemId === user.avatar)
            }
          }
        }
      } catch (error) {
        console.log('==== ~ getAvatarItems ~ error', error)

        alert((error as Error).message)
      }
    }
    getAvatarItems()
  }, [user])

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="rounded-20px overflow-hidden"
      size="xl"
      fullscreen={true}
    >
      <Modal.Body className="d-flex">
        {/* Ở đây sẽ để badge các thứ như liên minh */}
        <div className="d-flex align-items-center  border-end border-2 p-4">
          <Image
            fluid={true}
            alt="avatar"
            src="/assets/default-logo.png"
            width={124}
            height={124}
            className="rounded-circle"
          />
        </div>
        <div className="d-flex flex-wrap">
          {avatarItems ? (
            avatarItems.map((item, idx) => (
              <div
                key={idx}
                className={classNames('cursor-pointer mx-2 p-2')}
                onClick={() => {
                  setChoose(item.id)
                }}
              >
                <AvatarItem
                  name={item.item.name}
                  des={item.item.description}
                  avatar={item.item.avatar}
                  type={item.item.type}
                  price={item.item.price}
                  choose={item.id === choose}
                ></AvatarItem>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </Modal.Body>
      <Row className="justify-content-center p-3">
        <Col xs="6">
          <MyButton
            className="text-white w-100"
            variant="secondary"
            onClick={onHide}
          >
            Hủy bỏ
          </MyButton>
        </Col>

        <Col xs="6">
          <MyButton className="text-white w-100" onClick={() => {}}>
            Cập nhật
          </MyButton>
        </Col>
      </Row>
    </Modal>
  )
}

export default AvatarSelectionModal
