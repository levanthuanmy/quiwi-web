import { FC } from 'react'
import { Col, Image, Modal, Row } from 'react-bootstrap'
import { TBadge } from '../../types/types'

export const LeftProfileDisplay: FC<{
  avatar?: string
  displayName: string
  currentBadge?: TBadge
}> = ({ avatar, displayName, currentBadge }) => {
  return (
    <>
      <Image
        alt="avatar"
        src={avatar || '/assets/default-logo.png'}
        width={124}
        height={124}
        className="rounded-circle"
      />
      <div className="pt-2 fw-medium fs-32px">{displayName}</div>
      <div className="mt-2 mb-1 fw-medium fs-16px text-muted text-center">
        {currentBadge?.title}
      </div>
      <div>
        {currentBadge?.picture ? (
          <Image
            alt="badge"
            src={currentBadge?.picture}
            width={32}
            height={32}
            className="rounded-circle"
          />
        ) : null}
      </div>
    </>
  )
}
