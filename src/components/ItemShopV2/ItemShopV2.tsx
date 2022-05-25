import React, { FC, useState } from 'react'
import styles from './ItemShopV2.module.css'
import { Card, Button, Form, Image, Modal } from 'react-bootstrap'
import MyModal from '../MyModal/MyModal'
import { get } from '../../libs/api'

type ItemShopProps = {
  id: number
  className?: string
  avatar?: string
  name?: string
  price?: number
  isSold?: boolean
  description?: string
  category?: string
  onClick?: () => void
  type?: string
}

const ItemShopV2: FC<ItemShopProps> = ({
  id,
  name,
  avatar,
  price,
  description,
  category,
  type,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [error, setError] = useState('')

  const buyItem = async () => {
    setShowConfirmationModal(false)
    try {
      const response = await get(`/api/items/buy/${id}`, true)
    } catch (error) {
      setError((error as Error).message)
    }
    setShowAlertModal(true)
  }
  return (
    <Card className={styles.card}>
      <Card.Header className={styles.card__thumb}>
        <Image alt="item-avatar" src={avatar} />
      </Card.Header>
      {/* <div className="card__date">
                <span className="card__date__day">11</span>
                <br />
                <span className="card__date__month">Jun</span>
            </div> */}

      <div className={styles.card__body}>
        <div className={styles.card__category}>{category}</div>
        <h2 className={styles.card__title}>{name}</h2>
        <div className={styles.card__subtitle}>
          <Image
            alt="coin"
            src="/assets/quiwi-coin.png"
            width="32"
            height="32"
          ></Image>
          <div className={styles.price}>{price}</div>
        </div>
        <p className={styles.card__description}>{description}</p>
      </div>

      <footer className={styles.card__footer}>
        <Button
          className={styles.btnBuy}
          onClick={() => setShowConfirmationModal(true)}
        >
          MUA NGAY
        </Button>
        {/* <Form>
          <Form.Group>
            <Form.Control
              className="mobileBox"
              required
              name="mobile"
              type="number"
              value={1}
            />
          </Form.Group>
        </Form> */}
      </footer>

      <MyModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        activeButtonTitle="Mua luôn"
        activeButtonCallback={buyItem}
        size="sm"
        header={
          <Modal.Title className="text-primary">Xác nhận mua hàng</Modal.Title>
        }
      >
        <div>
          Xác nhận mua <b>{name}</b> với giá {price} xu
        </div>
      </MyModal>

      <MyModal
        show={showAlertModal}
        onHide={() => {
          setError('')
          setShowAlertModal(false)
        }}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={() => {
          setError('')
          setShowAlertModal(false)
        }}
        size="sm"
        header={
          <Modal.Title
            className={error.length > 0 ? 'text-danger' : 'text-primary'}
          >
            Thông báo
          </Modal.Title>
        }
      >
        <div>{error.length > 0 ? error : `Mua hàng thành công vật phẩm ${name}!`}</div>
      </MyModal>
    </Card>
  )
}

export default ItemShopV2
