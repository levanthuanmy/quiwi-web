import classNames from 'classnames'
import { FC } from 'react'
import { Card, CloseButton, Image } from 'react-bootstrap'
import { TUserBadge } from '../../types/types'
import MyButton from '../MyButton/MyButton'
import styles from './ModalBadge.module.css'

type IModalBadge = {
  onClose: any
  userBadge: TUserBadge
  setCurrentBadge?: Function
}

const ModalBadge: FC<IModalBadge> = (props) => {
  const badge = props.userBadge.badge
  const goal = props.userBadge?.badge?.badgeRequirements ? props.userBadge.badge.badgeRequirements[props.userBadge.badge.badgeRequirements.length - 1].goal : 1

  const status = props.userBadge.status === 'INPROGRESS'
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
            style={{ width: (props.userBadge.process / goal) * 100 + '%' }}
          ></div>
        </div>
        <div className={classNames('fs-20px', styles.badgeCount)}>
          {props.userBadge.process} / {goal}
        </div>

        {props.setCurrentBadge ? (
          <div className="text-center pb-2">
            <MyButton
              className="text-white"
              disabled={status}
              onClick={() => {
                if (status) return
                if (props.setCurrentBadge) props.setCurrentBadge()
              }}
            >
              Đặt làm mặc định
            </MyButton>
          </div>
        ) : null}
      </Card>
    </div>
  )
}

export default ModalBadge
