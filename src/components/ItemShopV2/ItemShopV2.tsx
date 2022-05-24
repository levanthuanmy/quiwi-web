import React, { FC } from 'react'
import styles from './ItemShopV2.module.css'
import { Card, Button, Form, Image } from 'react-bootstrap'

type ItemShopProps = {
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
  name,
  avatar,
  price,
  description,
  category,
  onClick,
  type,
}) => {
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
        <Button className={styles.btnBuy} onClick={onClick}>
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
    </Card>
  )
}

export default ItemShopV2
