import classNames from 'classnames'
import { FC } from 'react'
import { Card, CloseButton, Image } from 'react-bootstrap'
import { TUserBadge } from '../../types/types'
import styles from './ModalBadge.module.css'

type IModalBadge = {
  onClose: any
  userBadge: TUserBadge
}

const ModalBadge: FC<IModalBadge> = (props) => {
  const badge = props.userBadge.badge
  const goal =
    (props.userBadge?.badge?.badgeRequirements?.reduce(
      (previousValue, currentValue) => previousValue + currentValue.goal,
      0
    ) ??
      0) ||
    1
  return (
    <div>
      <Card className={classNames('', styles.cardStyle)}>
        <CloseButton
          onClick={props.onClose}
          className={classNames('', styles.closeButtonStyle)}
        />
        <div className={classNames('', styles.layoutImage)}>
          <Image
            src={badge.picture || ''}
            roundedCircle
            width={64}
            height={64}
            alt="badge"
          ></Image>
        </div>
        <div className={classNames('fs-22px', styles.badgeTitle)}>
          {badge.title}
        </div>
        <div className={classNames('fs-18px', styles.badgeDes)}>
          {badge.description}
        </div>
        <div className={classNames('progress', styles.progress)}>
          <div
            className={classNames('progress-bar bg-success')}
            role="progressbar"
            style={{ width: props.userBadge.process / goal + '%' }}
          ></div>
        </div>
        <div className={classNames('fs-20px', styles.badgeCount)}>
          {props.userBadge.process} / {goal}
        </div>
      </Card>
    </div>
  )
}

export default ModalBadge
