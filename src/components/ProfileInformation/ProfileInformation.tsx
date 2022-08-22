import { FC } from 'react'
import { TUser } from '../../types/types'
const ProfileInformation: FC<{
  user: TUser
}> = ({ user }) => {
  return (
    <div className="h-100">
      <div className="fs-32px fw-medium">{user.name}</div>
      {user.isVerified ? (
        <div className="mt-1 text-success fw-bold">
          Đã xác thực <i className="bi bi-check-lg"></i>
        </div>
      ) : null}
    </div>
  )
}

export default ProfileInformation
