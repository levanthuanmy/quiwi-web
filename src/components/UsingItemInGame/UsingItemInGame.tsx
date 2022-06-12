import classNames from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import { SocketManager } from '../../hooks/useSocket/socketManager'
import { TStartQuizResponse, TUser } from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import { MessageProps } from '../GameComponents/ChatWindow/Message'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import styles from './UsingItemInGame.module.css'

import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import { TApiResponse, TItem, TUserItems } from '../../types/types'
import Item from '../Item/Item'
import { DraggableEvent, DraggableData } from 'react-draggable'
import Draggable from 'react-draggable'

const UsingItemInGame: FC = () => {
    const authContext = useAuth()
    const [itemsRes, setItemsRes] = useState<Array<TItem>>()
    const [x, setX] = useState(500)
    const [y, setY] = useState(-100)

    const handleStop = (event: DraggableEvent, dragElement: DraggableData) => {
        console.log ("DRAGGG")
        console.log (dragElement.x)
        console.log (dragElement.x)
        setX(dragElement.x)
        setY(dragElement.y)
    };

    useEffect(() => {
        const getItems = async () => {
            try {
                if (authContext !== undefined) {
                    let userId = authContext.getUser()?.id || null

                    const res: TApiResponse<TUserItems[]> = await get(
                        `/api/users/user/${userId}/items`
                    )

                    if (res.response) {
                        let items: Array<TItem> = []
                        res.response.forEach((element) => {
                            if (element.item != null)
                                    items.push(element.item)
                        })
                        console.log(items)
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

    const renderItems = (
        <>
            <div
                className={classNames(
                    'd-flex flex-column bg-white shadow-lg',
                    styles.container
                )}
            >
                <div
                    className={classNames(
                        'position-relative cursor-pointer',
                        styles.title
                    )}
                >
                    Vật phẩm
                </div>
                <div className={classNames('', styles.itemList)}>
                    {itemsRes?.map((item, idx) => (
                        <Item
                            key={idx}
                            name={item.name}
                            des={item.description}
                            avatar={item.avatar}
                            type={item.type}
                            price={item.price}
                        ></Item>
                    ))}
                </div>
            </div>
        </>
    )

    return (
        <Draggable
            onStop={handleStop}
            position={{ x: x, y: y }}
        >
            <div >
                {renderItems}
            </div>
        </Draggable>
    )
}

export default UsingItemInGame
