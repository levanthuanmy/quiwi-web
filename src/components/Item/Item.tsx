import { FC, useState } from 'react'
import React, { Component } from 'react'
import { Button, Collapse, Row, Col, Image } from 'react-bootstrap'
import classNames from 'classnames'
import styles from './Item.module.css'
import CardBadge from '../CardBadge/CardBadge'
import { MyTooltip } from '../MyToolTip/MyTooltip'
import ItemToolTip from '../ItemToolTip/ItemToolTip'
import { propTypes } from 'react-bootstrap/esm/Image'

type IItem = {
    name: string,
    des: string,
    avatar: string,
    type: string,
    price: number
}


const Item: FC<IItem> = (props) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const setCollapse = () => {
        setIsCollapse(!isCollapse)
    }
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    return (
        <div>
            <div className={classNames('', styles.layoutImage)}>
                <ItemToolTip props={props} >
                    <Image className={classNames('',
                        props.type === "RARE" ? styles.imageTypeRare :
                            props.type === "EPIC" ? styles.imageTypeEpic :
                                props.type === "LEGENDARY" ? styles.imageTypeLegendary :
                                    styles.imageTypeNormal)}
                        src={props.avatar}
                        width={50}
                        height={50}
                        alt="coin"
                    ></Image>
                </ItemToolTip>
            </div>
        </div>
    )
}

export default Item
