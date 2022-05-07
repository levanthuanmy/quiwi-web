import { useRouter } from 'next/router'
import { FC } from 'react'
import { PROFILE_MENU_OPTIONS } from '../../utils/constants'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'

const LeftProfileMenuBar: FC<{}> = () => {
  const router = useRouter()
  return (
    <>
      {PROFILE_MENU_OPTIONS.map((option, idx) => {
        return (
          <ItemMenuBar
            key={idx}
            iconClassName={option.iconClassName}
            title={option.title}
            url={option.url}
            isActive={router.pathname === option.url}
          />
        )
      })}
    </>
  )
}

export default LeftProfileMenuBar
