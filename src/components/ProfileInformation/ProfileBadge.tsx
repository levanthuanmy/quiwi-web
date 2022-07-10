import { FC } from 'react'
import { Image } from 'react-bootstrap'
import { TBadge } from '../../types/types'

const ProfileBadge: FC<{
  currentBadge?: TBadge
}> = ({ currentBadge }) => {
  return (
    <div className="text-center mb-2">
      <div className="mt-2 mb-1 fw-medium fs-18px text-center">
        {currentBadge?.title}
      </div>
      <div>
        {currentBadge?.picture ? (
          <Image
            alt="badge"
            src={currentBadge?.picture}
            width={80}
            height={80}
            className="rounded-circle"
          />
        ) : null}
      </div>
    </div>
  )
}

export default ProfileBadge
