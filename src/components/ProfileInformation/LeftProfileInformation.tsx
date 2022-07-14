import classNames from 'classnames'
import router from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'
import { Button, Image } from 'react-bootstrap'
import {
  TApiResponse,
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
  isAuth?: Boolean
  setShowAvatarSelectionModal?: Dispatch<SetStateAction<boolean>>
  user: TUser
  followerUsers?: TPaginationResponse<TFollowUsers>
  followingUsers?: TPaginationResponse<TFollowUsers>
  userProfile: TUserProfile
  followOrUnfollowUser?: () => Promise<void>
}> = ({
  isAuth,
  setShowAvatarSelectionModal,
  user,
  followerUsers,
  followingUsers,
  userProfile,
  followOrUnfollowUser,
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
          onClick={() =>
            isAuth &&
            setShowAvatarSelectionModal &&
            setShowAvatarSelectionModal(true)
          }
        />
      </div>

      <div className="w-100 d-flex flex-column">
        <ProfileInformation user={user} />
        {!isAuth ? (
          <div className=" align-self-center align-self-md-start mt-2">
            <Button
              className={
                userProfile.isFollowing ? 'bg-white border-dark ' : 'text-white'
              }
              onClick={followOrUnfollowUser}
            >
              {userProfile.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
            </Button>
          </div>
        ) : null}
        <SummaryInfo
          userResponse={userProfile}
          followers={followerUsers?.items as TFollowUsers[]}
          followings={followingUsers?.items as TFollowUsers[]}
        />
      </div>
      {userProfile.currentBadge ? (
        <ProfileBadge currentBadge={userProfile.currentBadge} />
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
