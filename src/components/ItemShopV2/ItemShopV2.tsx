import React, { FC, useState } from 'react'
import styles from './ItemShopV2.module.css'
import { Card, Button, Form, Image, Modal, Row, Col } from 'react-bootstrap'
import MyModal from '../MyModal/MyModal'
import { get } from '../../libs/api'
import MyInput from '../MyInput/MyInput'

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
  const [quantity, setQuantity] = useState(1)
  const buyItem = async () => {
    setShowConfirmationModal(false)
    try {
      await get(`/api/items/buy/${id}`, true)
    } catch (error) {
      setError((error as Error).message)
    }
    setShowAlertModal(true)
    setQuantity(1)
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
      </footer>

      <MyModal
        show={showConfirmationModal}
        onHide={() => {
          setError('')
          setQuantity(1)
          setShowConfirmationModal(false)
        }}
        activeButtonTitle="Mua luôn"
        activeButtonCallback={buyItem}
        size="lg"
        header={
          <Modal.Title className="text-primary">Xác nhận mua hàng</Modal.Title>
        }
      >
        <div>
          {/* Xác nhận mua <b>{name}</b> với giá {price} xu */}
          <Row>
            <Col xs={4}>
              <Image alt="coin" src={avatar} fluid={true}></Image>
            </Col>
            <Col>
              <div className="fs-24px fw-medium">{name}</div>
              <div className="">{description}</div>
              <div className="mt-2 ">
                {category === 'Đạo cụ' ? (
                  <div className="d-flex align-items-center">
                    <label htmlFor="quantity-input">Số lượng</label>
                    <MyInput
                      id="quantity-input"
                      name="quantity"
                      className="ms-2"
                      placeholder="Số lượng"
                      type="number"
                      min={1}
                      // onClick={(e: any) => e?.target?.select()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuantity(Number(e.target.value))
                      }}
                      value={quantity}
                    />
                  </div>
                ) : (
                  <span className="text-muted">
                    Thời hạn vĩnh viễn, mua một lần xài cả đời
                  </span>
                )}
              </div>
              <div className="mt-2 d-flex align-items-center">
                <Image
                  alt="coin"
                  src="/assets/quiwi-coin.png"
                  width="32"
                  height="32"
                ></Image>
                <span className="ms-2">{(price ?? 0) * quantity} xu</span>
              </div>
            </Col>
          </Row>
        </div>
      </MyModal>

      <MyModal
        show={showAlertModal}
        onHide={() => {
          setError('')
          setQuantity(1)
          setShowAlertModal(false)
        }}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={() => {
          setError('')
          setShowAlertModal(false)
          setQuantity(1)
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
        <div>
          {error.length > 0 ? error : `Mua hàng thành công vật phẩm ${name}!`}
        </div>
      </MyModal>
    </Card>
  )
}

export default ItemShopV2
