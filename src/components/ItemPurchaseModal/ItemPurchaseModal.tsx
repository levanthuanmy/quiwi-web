import { FC } from 'react'
import { Button, ButtonGroup, Col, Image, Modal, Row } from 'react-bootstrap'
import { TItem } from '../../types/types'
import MyModal from '../MyModal/MyModal'

type ItemPurchaseProps = {
  avatar?: string
  name?: string
  price?: number
  isSold?: boolean
  description?: string
  category?: string
  showModal: boolean
  item: TItem
  buyItem: VoidFunction
  type?: string
  onHide: VoidFunction
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
}
const ItemPurchaseModal: FC<ItemPurchaseProps> = ({
  showModal,
  buyItem,
  onHide,
  quantity,
  setQuantity,
  item,
}) => {
  return (
    <MyModal
      show={showModal}
      onHide={onHide}
      activeButtonTitle="Mua luôn"
      activeButtonCallback={buyItem}
      size="lg"
      header={
        <Modal.Title className="text-primary">Xác nhận mua hàng</Modal.Title>
      }
    >
      <div>
        <Row>
          <Col xs={4}>
            <Image alt="coin" src={item.avatar} fluid={true}></Image>
            <div className="mt-3 fs-18px d-flex align-items-center justify-content-center">
              <Image
                alt="coin"
                src="/assets/quiwi-coin.png"
                width="32"
                height="32"
              ></Image>
              <span className="ms-2 text-warning fw-medium fs-24px">
                {item.price}
              </span>
            </div>
          </Col>
          <Col>
            <div className="fs-24px fw-medium">{item.name}</div>
            <div className="mt-3">{item.description}</div>
            <div className="mt-3">
              {item.itemCategory.name === 'Đạo cụ' ? (
                <div className="d-flex align-items-center">
                  <label htmlFor="quantity-input" className=" fw-medium">
                    Số lượng
                  </label>
                  {/* <MyInput
                  id="quantity-input"
                  name="quantity"
                  className="ms-3"
                  placeholder="Số lượng"
                  type="number"
                  min={1}
                  // onClick={(e: any) => e?.target?.select()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setQuantity(Number(e.target.value))
                  }}
                  value={quantity}
                /> */}

                  <ButtonGroup className="ms-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1)
                        }
                      }}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="text-black border border-secondary"
                      // onClick={null}
                      disabled
                    >
                      {quantity}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        if (quantity < 10) {
                          setQuantity(quantity + 1)
                        }
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </div>
              ) : (
                <span className="text-muted">
                  Thời hạn vĩnh viễn, mua một lần xài cả đời
                </span>
              )}
            </div>
            <div className="mt-3 d-flex align-items-end">
              <div className="fw-medium">Tổng tiền</div>
              <div className="ms-3 fs-24px text-warning fw-medium">
                {(item.price ?? 0) * quantity} xu
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </MyModal>
  )
}

export { ItemPurchaseModal }
