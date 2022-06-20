import classNames from 'classnames'
import { FC } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { post } from '../../libs/api'
import { TApiResponse, TUser, TUserItems } from '../../types/types'
import Loading from '../Loading/Loading'
import AvatarItem from './AvatarItem'

export const BackgroundList: FC<{
  backgroundItems?: TUserItems[]
  itemIdChosen?: number
  setChoose: (id: number) => void
}> = ({ backgroundItems, itemIdChosen, setChoose }) => {
  const auth = useAuth()

  return (
    <>
      {backgroundItems ? (
        backgroundItems.map((item, idx) => (
          <div key={idx} className={classNames('cursor-pointer mx-2 p-2')}>
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
