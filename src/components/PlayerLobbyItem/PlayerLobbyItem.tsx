import { FC } from 'react'
import { Image } from 'react-bootstrap'
import { TPlayer } from '../../types/types'
import styles from './PlayerLobbyItem.module.css'

const PlayerLobbyItem: FC<{ player: TPlayer; color: string }> = ({
  player,
  color,
}) => {
  return (
    <>
      <div
        className={`d-flex align-items-center max-with-120px m-1 py-1 px-2 rounded-20px ${color} ${styles.tooltip}`}
      >
        {player.user?.avatar ? (
          <Image
            src={player.user.avatar}
            width={30}
            height={30}
            alt="avatar"
            className="rounded-circle"
          />
        ) : null}
        <span className="px-1 text-white text-truncate">{player.nickname}</span>
        <span className={`${styles.tooltiptext}`}>{player.nickname}</span>
      </div>
    </>
  )
}

export default PlayerLobbyItem
