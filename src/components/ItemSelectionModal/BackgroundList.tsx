import classNames from 'classnames'
import { FC } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { TUserItems } from '../../types/types'
import Loading from '../Loading/Loading'
import AvatarItem from './AvatarItem'

export const BackgroundList: FC<{
  backgroundItems?: TUserItems[]
  itemIdChosen?: number
}> = ({ backgroundItems, itemIdChosen }) => {
  const auth = useAuth()

  return (
    <>
      {backgroundItems ? (
        backgroundItems.map((item, idx) => (
          <div key={idx} className={classNames(' mx-2 p-2')}>
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
      )}
    </>
  )
}
