import classNames from 'classnames'
import { FC } from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap'
import styles from './ItemDetail.module.css'

type IItem = {
  name: string
  des: string
  avatar: string
  type: string
  price: number
}

const ItemDetail: FC<{ props: IItem }> = (props) => {
  return (
    <div>
      <Card className={classNames('align-items-center justify-content-center', styles.cardStyle)}>
        <Row>
          <Col className="d-flex align-items-center justify-content-center">
            <div className={classNames('fs-20px', styles.itemTitle)}>
              {props.props.name}
            </div>
          </Col>
          <Col sm={4} className={classNames('', styles.image)}>
            <Image
              className={classNames(
                '',
                props.props.type === 'RARE'
                  ? styles.imageTypeRare
                  : props.props.type === 'EPIC'
                  ? styles.imageTypeEpic
                  : props.props.type === 'LEGENDARY'
                  ? styles.imageTypeLegendary
                  : styles.imageTypeNormal
              )}
              src={props.props.avatar}
              width={48}
              height={48}
              alt="coin"
            ></Image>
          </Col>
        </Row>
        <Row>
          <div className={classNames(styles.itemType)}>
            Loại: {props.props.type}
          </div>
        </Row>
        <div className={classNames('fs-14px', styles.itemDes)}>
          {props.props.des}
        </div>
        <div
          className={classNames(
            'd-flex justify-content-center align-items-center mb-2'
          )}
        >
          <div>
            <Image
              alt="avatar"
              src="/assets/quiwi-coin.png"
              width="20"
              height="20"
            ></Image>
          </div>
          <div className={'ms-2'}>{props.props.price}</div>
        </div>
      </Card>
    </div>
  )
}

export default ItemDetail
