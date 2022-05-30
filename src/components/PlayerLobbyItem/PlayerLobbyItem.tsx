import {FC} from 'react'
import {Col, Image} from 'react-bootstrap'
import styles from './PlayerLobbyItem.module.css'
import useIsMobile from "../../hooks/useIsMobile/useIsMobile";

type PlayerLobbyItemProps = {
  displayName: string,
  avatar?: string,
  bgColor: string
  isHost?: boolean
}

const PlayerLobbyItem: FC<PlayerLobbyItemProps> = (props: PlayerLobbyItemProps) => {
  const isMobile = useIsMobile()
  return (
    <>
      <Col
        className={`d-flex align-items-center m-1 rounded-20px col-auto ${styles.tooltip} ${props.isHost ? styles.isHost : ""}`}
        style={{backgroundColor: props.bgColor}}
      >
        <Image
          src={props.avatar ? props.avatar : "/assets/default-logo.png"}
          width={isMobile ? 24 : 30}
          height={isMobile ? 24 : 30}
          alt="/assets/default-logo.png"
          className="rounded-circle"
        />
        <span className="px-1 text-white">{props.displayName}</span>
        <span className={`${styles.tooltiptext}`}>{props.displayName}</span>
      </Col>
    </>
  )
}

export default PlayerLobbyItem
