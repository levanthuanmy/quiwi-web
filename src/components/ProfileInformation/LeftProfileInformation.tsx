import classNames from 'classnames'
import router from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'
import { Image } from 'react-bootstrap'
import {
  TFollowUsers,
  TPaginationResponse,
  TUser,
  TUserProfile,
} from '../../types/types'
import MyButton from '../MyButton/MyButton'
import SummaryInfo from '../Profile/SummaryInfo/SummaryInfo'
import ProfileBadge from './ProfileBadge'
import ProfileInformation from './ProfileInformation'
const LeftProfileInformation: FC<{
  isAuth?: boolean
  setShowAvatarSelectionModal?: Dispatch<SetStateAction<boolean>>
  user: TUser
  followerUsers?: TPaginationResponse<TFollowUsers>
  followingUsers?: TPaginationResponse<TFollowUsers>
  userResponse: TUserProfile
}> = ({
  isAuth,
  setShowAvatarSelectionModal,
  user,
  followerUsers,
  followingUsers,
  userResponse,
}) => {
  return (
    <div className="d-flex flex-column mt-3 gap-4 p-12px shadow-sm rounded-8px bg-white position-relative">
      <div className="text-center">
        <Image
          alt="avatar"
          src={user.avatar || '/assets/default-avatar.png'}
          width={240}
          height={240}
          className={classNames(
            'rounded-circle',
            isAuth ? 'cursor-pointer' : ''
          )}
          onClick={() => isAuth && setShowAvatarSelectionModal && setShowAvatarSelectionModal(true)}
        />
      </div>

      <div className="w-100 d-flex flex-column">
        <ProfileInformation user={user} />

        <SummaryInfo
          userResponse={userResponse}
          followers={followerUsers?.items as TFollowUsers[]}
          followings={followingUsers?.items as TFollowUsers[]}
        />
      </div>
      {userResponse.currentBadge ? (
        <ProfileBadge currentBadge={userResponse.currentBadge} />
      ) : null}
      {isAuth ? (
        <MyButton
          className=" text-white my-auto"
          title="Chinh sửa thông tin"
          onClick={() => router.push('/profile/edit')}
        >
          Chinh sửa thông tin
        </MyButton>
      ) : null}
    </div>
  )
}

export default LeftProfileInformation
