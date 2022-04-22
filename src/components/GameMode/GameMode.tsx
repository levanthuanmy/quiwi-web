import classNames from 'classnames'
import { Dispatch, FC, SetStateAction } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './GameMode.module.css'

type GameModeProps = {
  //   title: string
  setGameMode: Dispatch<SetStateAction<string>>
}

type TGameMode = {
  mode: string
  label: string
}

const GameMode: FC<GameModeProps> = ({ setGameMode }) => {
  const modes: TGameMode[] = [
    {
      mode: '10CLASSIC',
      label: 'Truyền thống',
    },
    {
      mode: '20MRT',
      label: 'Marathon',
    },
  ]

  const selectGameMode = (idx: number) => {
    const mode = modes[idx]
    setGameMode(mode.mode)
  }
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-secondary bg-opacity-10">
      <div className="fs-48px mb-5">Chọn chế độ chơi</div>
      <Row className="w-100 h-100 justify-content-center">
        {/* <Col xs="12" sm="6" lg="4">
          <div
            className={classNames(
              styles.modeItem,
              `bg-primary text-white rounded-6px fs-20px fw-bold fs-32px shadow-sm h-100 border py-256px text-center`
            )}
          >
            Truyền thống
          </div>
        </Col>
        <Col xs="12" sm="6" lg="4">
          <div
            className={classNames(
              styles.modeItem,
              `bg-primary text-white rounded-6px fs-20px fw-bold fs-32px shadow-sm h-100 border py-256px text-center`
            )}
          >
            Marathon
          </div>
        </Col> */}

        {modes.map((mode, idx) => (
          <Col key={idx} xs="12" sm="6" lg="4">
            <div
              onClick={() => {
                selectGameMode(idx)
              }}
              className={classNames(
                styles.modeItem,
                `bg-primary text-white rounded-6px fs-20px fw-bold fs-32px shadow-sm h-100 border py-256px text-center`
              )}
            >
              {mode.label}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default GameMode
