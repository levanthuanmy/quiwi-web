import classNames from 'classnames'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { removeZeros } from '../../utils/helper'
import styles from './AvatarSelection.module.css'

type IBadgeItem = {
  onClick: any
  image: string
  title: string
  description: string
  progress: string
  status: string
}

const BadgeItem: FC<IBadgeItem> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        'rounded-14px h-100 cursor-pointer p-12px d-flex flex-column justify-content-between border',
        styles.container
      )}
    >
      <div
        className={classNames(
          'p-12px text-center',
          props.status === 'INPROGRESS' ? ' opacity-25 ' : ''
        )}
      >
        <Image
          src={props.image}
          roundedCircle
          width={80}
          height={80}
          alt="badge"
          fluid={true}
          className="shadow-sm"
        />
        <div className="text-center fw-medium">{props.title}</div>
      </div>
      <div>
        <div className={classNames('fs-14px', styles.badgeDes)}>
          {props.description}
        </div>
        <div className={classNames('progress', styles.progress)}>
          <div
            className={classNames('progress-bar bg-success')}
            role="progressbar"
            style={{ width: props.progress + '%' }}
          ></div>
        </div>
        <div className={classNames('fs-16px', styles.badgeCount)}>
          {props.progress}%
        </div>
      </div>
    </div>
  )
}

export default BadgeItem
