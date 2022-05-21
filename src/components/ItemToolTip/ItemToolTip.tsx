import { FC, ReactNode, useState } from 'react'
import React, { Component } from 'react'
import { Button, Collapse, Row, Col, Image } from 'react-bootstrap'
import classNames from 'classnames'
import styles from './ItemToolTip.module.css'
import CardBadge from '../CardBadge/CardBadge'
import { MyTooltip } from '../MyToolTip/MyTooltip'
import Item from '../Item/Item'
import ItemDetail from '../ItemDetail/ItemDetail'

type IItem = {
    name: string,
    des: string,
    avatar: string,
    type: string,
    price: number
  }

const ItemToolTip: FC<{ children?: ReactNode, props: IItem }> = ({ children, props }) => {

    const [isShow, setIsShow] = useState(false)
    const handleMouseIn = () => setIsShow(true)
    const handleMouseOut = () => setIsShow(false)
    return (
        <div className={classNames('', styles.tooltip)}
            onMouseOver={handleMouseIn}
            onMouseLeave={handleMouseOut}
        >
            {isShow && <div className={classNames('', styles.tooltipContent, styles.right)}>

            <ItemDetail props={props}   ></ItemDetail>
            </div>}
            {children}
        </div>
    );
}

export default ItemToolTip
