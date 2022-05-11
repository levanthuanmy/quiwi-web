
import React, { FC, useState } from "react"
import { Col, Container, Row, Image, Card } from "react-bootstrap"
import styles from './CardBadge.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"

type IBadgeItem = {
    onClick: any,
    image: string,
    title: string,
    description: string,
    propgress: string
}


const CardBadge: FC<IBadgeItem> = (props) => {
    return (
        <div onClick={props.onClick}>
            <Card className={classNames('', styles.cardStyle)}>
                <div className={classNames('', styles.layoutImage)}>
                    <Image
                        src={props.image}
                        roundedCircle
                        width={50}
                        height={50}
                        alt="coin"
                    ></Image>
                </div>
                <div className={classNames('fs-18px',styles.badgeTitle)}>{props.title}</div>
                <div className={classNames('fs-14px',styles.badgeDes)}>{props.description}</div>
                <div className={classNames("progress", styles.progress)}>
                    <div className={classNames("progress-bar bg-success")} role="progressbar" style={{ width: props.propgress+"%" }}></div>
                </div>
                <div className={classNames("fs-16px", styles.badgeCount)}>100/1000</div>
            </Card>
        </div>
    )
}

export default CardBadge