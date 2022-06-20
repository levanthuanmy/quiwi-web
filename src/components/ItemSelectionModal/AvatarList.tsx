import classNames from 'classnames'
import { FC } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { post } from '../../libs/api'
import { TApiResponse, TUser, TUserItems } from '../../types/types'
import Loading from '../Loading/Loading'
import AvatarItem from './AvatarItem'

export const AvatarList: FC<{
  avatarItems?: TUserItems[]
  itemIdChosen?: number
  setChoose: (id: number) => void
}> = ({ avatarItems, itemIdChosen, setChoose }) => {
  const auth = useAuth()

  const changeAvatar = async (id: number) => {
    try {
      const res = await post<TApiResponse<TUser>>(
        `/api/users/user/change-avatar/${id}`,
        {},
        {},
        true
      )
      console.log('==== ~ changeAvatar ~ res', res)
      if (res.response) {
        auth.setUser(res.response)
      }
    } catch (error) {
      console.log('==== ~ changeAvatar ~ error', error)
      alert(JSON.stringify(error))
    }
  }

  return (
    <>
      {avatarItems ? (
        avatarItems.map((item, idx) => (
          <div
            key={idx}
            className={classNames('cursor-pointer mx-2 p-2')}
            onClick={() => {
              changeAvatar(item.item.id!)
            }}
          >
            <AvatarItem
              name={item.item.name}
              des={item.item.description}
              avatar={item.item.avatar}
              type={item.item.type}
              price={item.item.price}
              choose={item.item.id === itemIdChosen}
              isUsed={item.isUsed}
            ></AvatarItem>
          </div>
        ))
      ) : (
        <Loading />
      )}{' '}
    </>
  )
}
