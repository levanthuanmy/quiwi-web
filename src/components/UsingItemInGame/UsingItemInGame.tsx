import classNames from 'classnames'
import React, { FC, memo, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { useGameSession } from '../../hooks/useGameSession/useGameSession'
import { get } from '../../libs/api'
import {TApiResponse, TItem, TUser, TUserItems} from '../../types/types'
import Item from '../Item/Item'

type UsingItemInGameProps = {
  closeAction: () => void
}

const UsingItemInGame: FC<UsingItemInGameProps> = (props) => {
  const authContext = useAuth()
  const [itemsRes, setItemsRes] = useState<Array<TItem>>()
  const game = useGameSession()
  const user = useAuth().getUser()
  const [type, setType] = useState('Biểu cảm')

  useEffect(() => {
    const getItems = async () => {
      try {
        if (authContext !== undefined) {
          let userId = authContext.getUser()?.id || null

          const res: TApiResponse<TUserItems[]> = await get(
            `/api/users/user/${userId}/items?type=${type}`
          )

          if (res.response) {
            let items: Array<TItem> = []
            res.response.forEach((element) => {
              if (element.item != null) items.push(element.item)
            })
            setItemsRes(items)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    getItems()
  }, [type])

  return (
    <>
      <div
        className="position-fixed shadow-lg bg-white rounded-10px border overflow-hidden"
        style={{
          bottom: 78,
          right: 12,
          width: 'min(calc(100vw - 24px), 426px)',
          height: 300,
        }}
      >
        <div className={classNames('w-100 h-100 d-flex')}>
          <div className="h-100" style={{ overflowY: 'auto', width: 48 }}>
            <div onClick={() => setType('Biểu cảm')}>
              <i
                className={classNames(
                  'btn btn-outline-light bi bi-emoji-smile-fill fs-24px border-0 text-dark rounded-0',
                  { 'bg-secondary bg-opacity-10': type === 'Biểu cảm' }
                )}
              />
            </div>
            <div onClick={() => setType('Đạo cụ')}>
              <i
                className={classNames(
                  'btn btn-outline-light bi bi-briefcase-fill fs-24px border-0 text-dark rounded-0',
                  { 'bg-secondary bg-opacity-10': type === 'Đạo cụ' }
                )}
              />
            </div>
          </div>

          <div
            className="bg-secondary bg-opacity-10 p-2"
            style={{
              overflowY: 'auto',
              width: 'calc(100% - 48px)',
              overflowX: 'hidden',
            }}
          >
            <div
              className="d-flex flex-wrap"
              style={{
                gap:8,
              }}
            >
              {itemsRes?.map((item, idx) => (
                <Item
                  key={idx}
                  name={item.name}
                  des={item.description}
                  avatar={item.avatar}
                  type={item.type}
                  price={item.price}
                  quantity={item.quantity}
                  onClick={() => {
                    game.gameSkEmit('use-item', {
                      userId: user?.id,
                      nickname: game.gameSession?.nickName,
                      invitationCode: game.gameSession?.invitationCode,
                      itemId: item?.id,
                      token: user?.token?.accessToken,
                    })
                  }}
                ></Item>
              ))}
            </div>
          </div>
          <div
            className={`d-flex pt-1 cursor-pointer bg-secondary bg-opacity-10`}
            style={{
              left:8,
              width: 32,
              height: 300,
            }}
            onClick={props.closeAction}
          >
            <i className="text-secondary bi bi-x-circle fs-4"></i>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(UsingItemInGame)
