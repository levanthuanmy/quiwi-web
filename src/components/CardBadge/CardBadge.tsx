import classNames from 'classnames'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './CardBadge.module.css'

type IBadgeItem = {
  onClick: any
  image: string
  title: string
  description: string
  progress: string
}

const CardBadge: FC<IBadgeItem> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        'rounded-8px h-100 cursor-pointer p-12px',
        styles.container
      )}
    >
      <div className="p-22 text-center">
        <Image
          src={props.image}
          roundedCircle
          width={70}
          height={70}
          alt="badge"
          className="shadow-sm object-fit-cover"
        />
      </div>
      <div className="text-center fw-medium">{props.title}</div>
      {/* <div className={classNames('fs-14px', styles.badgeDes)}>
        {props.description}
      </div>
      <div className={classNames('progress', styles.progress)}>
        <div
          className={classNames('progress-bar bg-success')}
          role="progressbar"
          style={{ width: props.progress + '%' }}
        ></div>
      </div>
      <div className={classNames('fs-16px', styles.badgeCount)}>100/1000</div> */}
    </div>
  )
}

export default CardBadge
