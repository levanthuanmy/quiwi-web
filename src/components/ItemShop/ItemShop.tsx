import { FC } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import styles from './ItemShop.module.css'

type ItemShopProps = {
  className?: string
  avatar?: string
  name?: string
  price?: number
  isSold?: boolean
  description?: string
  category?: string
  onClick?: () => void
}

const ItemShop: FC<ItemShopProps> = ({
  name,
  avatar,
  price,
  description,
  category,
  onClick,
}) => {
  return (
    <Card className={styles.containerRlt} style={{ width: '15rem' }}>
      <Card.Img variant="top" src={avatar} className={styles.imgsBorder} />
      <div className={styles.containerAbs}>{category}</div>
      <Card.Body>
        <Card.Title className={styles.cardTitle}>{name}</Card.Title>
        <Card.Text className={styles.cardDescription}>
          <div className={styles.description}>{description}</div>
        </Card.Text>
        <Card.Text className={styles.cardPrice}>
          <Image
            alt="coin"
            src="/assets/quiwi-coin.png"
            width="32"
            height="32"
          />
          <div className={styles.price}>{price}</div>
        </Card.Text>
        <Button className={styles.btnBuy} onClick={onClick}>
          MUA
        </Button>
        <input
          className="quantity"
          id="id_form-0-quantity"
          min="0"
          name="form-0-quantity"
          value="1"
          type="number"
        ></input>
      </Card.Body>
    </Card>
  )
}

export default ItemShop
