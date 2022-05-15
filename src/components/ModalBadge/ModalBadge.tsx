
import React, { FC, useState } from "react"
import { Col, Container, Row, Image, Card, Modal, CloseButton } from "react-bootstrap"
import styles from './ModalBadge.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"
import CardBadge from "../CardBadge/CardBadge"
import { alignPropType } from "react-bootstrap/esm/types"

type IModalBadge = {
    onClose: any,
}

const ModalBadge: FC<IModalBadge> = (props) => {
    return (
        <div >
            <Card className={classNames('', styles.cardStyle)}>
            <CloseButton onClick={props.onClose} className={classNames('', styles.closeButtonStyle)}/>
                <div className={classNames('', styles.layoutImage)}>
                    <Image
                        src=
                        "https://freepikpsd.com/file/2019/10/cartoon-diamond-png-3-Transparent-Images.png"
                        roundedCircle
                        width={50}
                        height={50}
                        alt="coin"
                    ></Image>
                </div>
                <div className={classNames('fs-22px',styles.badgeTitle)}>Thánh kim cương</div>
                <div className={classNames('fs-18px',styles.badgeDes)}>Đạt được 1000 viên kim cương</div>
                <div className={classNames("progress", styles.progress)}>
                    <div className={classNames("progress-bar bg-success")} role="progressbar" style={{ width: "30%" }}></div>
                </div>
                <div className={classNames("fs-20px", styles.badgeCount)}>100/1000</div>
            </Card>
        </div>
    )
}

export default ModalBadge