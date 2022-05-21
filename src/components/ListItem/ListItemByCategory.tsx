import { FC, useState, useEffect } from 'react'
import React, { Component } from 'react'
import { Button, Collapse, Row, Col } from 'react-bootstrap'
import classNames from 'classnames'
import styles from './ListItemByCategory.module.css'
import CardBadge from '../CardBadge/CardBadge'
import { MyTooltip } from '../MyToolTip/MyTooltip'
import Item from '../Item/Item'
import ItemToolTip from '../ItemToolTip/ItemToolTip'
import { get } from '../../libs/api'
import { useAuth } from '../../hooks/useAuth/useAuth'
import {
    TApiResponse,
    TItem,
    TItemCategory,
    TPaginationResponse,
    TUserItems,
    TUserProfile
} from '../../types/types'


type IListItem = {
    name: string,
    id: number
}


const ListItemByCategory: FC<IListItem> = (props) => {
    const [isCollapse, setIsCollapse] = useState(false)
    const authContext = useAuth()
    const setCollapse = () => {
        setIsCollapse(!isCollapse)
    }
    const [itemsRes, setItemsRes] =
        useState<Array<TItem>>()

    useEffect(() => {
        const getItems = async () => {
            try {
                if (authContext !== undefined) {
                    let userId = authContext.getUser()?.id || null
                    const params = {
                        userId: userId,
                    }
                    const res: TApiResponse<TUserItems[]> = await get(
                        `/api/items/user-items`,
                        true,
                        params
                    )

                    if (res.response) {
                        let items: Array<TItem> = [];
                        res.response.forEach(element => {
                            if (element.item.itemCategoryId === props.id)
                                items.push(element.item);
                        });
                        setItemsRes(items)
                    }
                }
            } catch (error) {
                alert('Có lỗi nè')
                console.log(error)
            }
        }

        getItems()
    }, [])

    return (
        <div className={classNames("", styles.listItem)}>
            <div onClick={() => setCollapse()}>

                <Row className={classNames("", styles.headerType)}>
                    <Col sm={11}>
                        <div>{props.name}</div>
                    </Col>
                    <Col sm={1}>
                        <div><address></address></div>
                    </Col>
                </Row>
            </div>

            <Collapse in={isCollapse} className={classNames("", styles.content)}>
                <Row
                    className="justify-content-md-center"
                    style={{ paddingBottom: '17px' }}
                >
                    <Col>
                        <div className={classNames('badges-list')}>
                            {itemsRes?.map((item, idx) => (
                                <Item
                                    name={item.name}
                                    des={item.description}
                                    avatar={item.avatar}
                                    type={item.type}
                                    price={item.price} ></Item>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Collapse>
        </div>
    )
}

export default ListItemByCategory
