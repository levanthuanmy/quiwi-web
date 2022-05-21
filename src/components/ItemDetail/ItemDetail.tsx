
import React, { FC, useState } from "react"
import { Col, Container, Row, Image, Card, Modal, CloseButton } from "react-bootstrap"
import styles from './ItemDetail.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"
import CardBadge from "../CardBadge/CardBadge"
import { alignPropType } from "react-bootstrap/esm/types"

type IItem = {
    name: string,
    des: string,
    avatar: string,
    type: string,
    price: number
  }

const ItemDetail: FC<{props: IItem }> = (props) => {
    return (
        <div >
            <Card className={classNames('', styles.cardStyle)}>
                <div className={classNames('', styles.layoutImage)}>
                    <Row>
                        <Col sm={8} >
                            <Row>
                                <div className={classNames('fs-20px', styles.itemTitle)}>{props.props.name}</div>
                            </Row>
                            <Row>
                                <div className={classNames('fs-16px', styles.itemType)}>Loại: {props.props.type} </div>
                            </Row>

                        </Col>
                        <Col sm={4} className={classNames('', styles.image)}>
                            <Image className={classNames('', props.props.type === "RARE" ? styles.imageType : styles.imageTypeNormal)}
                                src=
                                {props.props.avatar}
                                width={50}
                                height={50}
                                alt="coin"
                            ></Image>
                        </Col>
                    </Row>
                </div>
                <div className={classNames('fs-14px', styles.itemDes)}>{props.props.des}</div>
                <Row className={classNames('', styles.price)}>
                    <Col sm={1}>
                        <img alt="avatar" src="/assets/quiwi-coin.png" width="20" height="20"></img>

                    </Col>
                    <Col >
                        <div className={styles.price}>
                            {props.props.price}
                        </div></Col>
                </Row>
            </Card>
        </div>
    )
}

export default ItemDetail