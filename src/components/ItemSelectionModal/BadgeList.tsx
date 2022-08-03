import classNames from 'classnames'
import { FC, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { TUserBadge } from '../../types/types'
import { renderPercentage } from '../../utils/helper'
import ModalBadge from '../ModalBadge/ModalBadge'
import BadgeItem from './BadgeItem'

export const BadgeList: FC<{
  userBadges?: TUserBadge[]
  setCurrentBadge: (userBadge: TUserBadge) => void
}> = ({ userBadges, setCurrentBadge }) => {
  const [show, setShow] = useState(false)
  const handleShow = (idx: number) => {
    setIndexChosen(idx)
    setShow(true)
  }
  const [indexChosen, setIndexChosen] = useState<number>(0)

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
                // setCurrentBadge(userBadge)
                handleShow(idx)
              }}
              image={userBadge.badge.picture || ''}
              title={userBadge.badge.title}
              description={userBadge.badge.description}
              progress={renderPercentage(progress)}
              status={userBadge.status}
            />
          </div>
        )
      })}
      {userBadges ? (
        <Modal
          show={show}
          size="sm"
          centered
          onShow={() => setShow(true)}
          onHide={() => setShow(false)}
        >
          <ModalBadge
            userBadge={userBadges[indexChosen]}
            onClose={() => setShow(false)}
            setCurrentBadge={()=>setCurrentBadge(userBadges[indexChosen])}
          ></ModalBadge>
        </Modal>
      ) : null}
    </>
  )
}
