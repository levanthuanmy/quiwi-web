import classNames from 'classnames'
import { FC } from 'react'
import { TUserBadge } from '../../types/types'
import BadgeItem from './BadgeItem'

export const BadgeList: FC<{
  userBadges?: TUserBadge[]
  setCurrentBadge: (userBadge: TUserBadge) => void
}> = ({ userBadges, setCurrentBadge }) => {
  return (
    <>
      {userBadges?.map((userBadge, idx) => {
        const goals =
          userBadge?.badge?.badgeRequirements?.reduce(
            (previousValue, currentValue) => previousValue + currentValue.goal,
            0
          ) || 1
        const progress = (userBadge.process / goals) * 100
        return (
          <div key={idx} className={classNames(' mx-2 p-2')}>
            <BadgeItem
              onClick={async () => {
                setCurrentBadge(userBadge)
              }}
              image={userBadge.badge.picture || ''}
              title={userBadge.badge.title}
              description={userBadge.badge.description}
              progress={progress.toFixed(2)}
              status={userBadge.status}
            />
          </div>
        )
      })}
    </>
  )
}
