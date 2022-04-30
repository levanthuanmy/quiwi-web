import { Card, Button } from 'react-bootstrap'
import React, { FC } from 'react'
import styles from './ItemShop.module.css'
import classNames from 'classnames'


type ItemShopProps = {
    className?: string,
    avatar?: string,
    name?: string,
    price?: number,
    isSold?: boolean
}

const ItemShop: FC<ItemShopProps> = () => {
    return (
        <Card className={styles.containerRlt} style={{ width: '15rem' }}>
            <Card.Img variant="top" src="https://cdn.dribbble.com/users/383277/screenshots/14051354/media/4ded79488d5a6ee5a6026380a4ae4393.png?compress=1&resize=400x300" className={styles.imgsBorder} />
            <div className={styles.containerAbs}>Mũ</div>
            <Card.Body>
                <Card.Title className={styles.cardTitle}>Mũ phép thuật</Card.Title>
                <Card.Text className={styles.cardDescription}>
                    <div className={styles.description}>
                        Tăng 120% sức mạnh phép thuật
                    </div>
                </Card.Text>
                <Card.Text className={styles.cardPrice}>
                    <div className={classNames('bi bi-coin')}>
                    </div>
                    <div className={styles.price}>
                        800,000
                    </div>
                </Card.Text>
                <Button className={styles.btnBuy}>MUA</Button>
            </Card.Body>
        </Card>
    )
}

export default ItemShop
