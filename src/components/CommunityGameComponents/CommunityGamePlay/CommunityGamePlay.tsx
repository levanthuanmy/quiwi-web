import { NextPage } from 'next'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './CommunityGamePlay.module.css'
import CommunityAnswerBoard from '../AnswerBoard/CommunityAnswerBoard'
import classNames from 'classnames'
import { TimerProvider } from '../../../hooks/useTimer/useTimer'
import { FAB, FABAction } from '../../GameComponents/FAB/FAB'
import router from 'next/router'
import MyModal from '../../MyModal/MyModal'
import { usePracticeGameSession } from '../../../hooks/usePracticeGameSession/usePracticeGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { TStartQuizResponse } from '../../../types/types'
import ExamAnswerBoard from '../ExamComponents/ExamAnswerBoard/ExamAnswerBoard'
import { useMyleGameSession } from '../../../hooks/usePracticeGameSession/useMyleGameSession'

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({
  showEndGameModal: false,
  setShowEndGameModal: () => {},
})

const CommunityGamePlay: NextPage = () => {
  const { clearGameSession, gameSkOn, gameSession, saveGameSession } =
    usePracticeGameSession()
  const myleGameSession = useMyleGameSession()
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const [exitModal, setExitModal] = useState(false)
  const [endGameData, setEndGameData] = useState<TStartQuizResponse>()
  const { fromMedium } = useScreenSize()

  const hostAction: FABAction = {
    label: 'Hiện bảng điều khiển',
    icon: 'bi bi-dpad-fill text-white',
    onClick: () => {
      resetAllFAB()
      setIsShowHostControl(!isShowHostControl)
    },
  }

  const exitAction: FABAction = {
    label: 'Thoát phòng!',
    icon: 'bi bi-box-arrow-left text-warning',
    onClick: () => {
      setIsShowExit(true)
    },
  }

  const resetAllFAB = () => {
    if (isShowHostControl) setIsShowHostControl(false)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push('/')
  }

  function getExitModal() {
    return (
      <MyModal
        show={isShowExit}
        onHide={() => setIsShowExit(false)}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={exitRoom}
        inActiveButtonCallback={() => setIsShowExit(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3 fw-bolder">Thoát phòng</div>

        <div className="text-center fw-bold">
          <div className="text-secondary fs-24x text-warning">
            Bạn có chắc muốn thoát phòng?
          </div>
        </div>
      </MyModal>
    )
  }

  useEffect(() => {
    gameSkOn('game-ended', (data) => {
      setEndGameData(data)
    })
  }, [])

  return (
    <>
      <div
        className={classNames(
          styles.gameBackground,
          'bg-black customScrollbar'
        )}
      >
        <div
          className={classNames(
            styles.gameView,
            'd-flex flex-column customScrollbar'
          )}
        >
          <div className={classNames(styles.answerBoard, '')}>
            <ExitContext.Provider
              value={{
                showEndGameModal: exitModal,
                setShowEndGameModal: setExitModal,
              }}
            >
              <TimerProvider>
                <div className={'bg-white w-100 h -100'}></div>
                {myleGameSession.gameSession?.mode === '30EXAM' ? (
                  <ExamAnswerBoard />
                ) : (
                  <CommunityAnswerBoard
                    isShowHostControl={isShowHostControl}
                    setIsShowHostControl={setIsShowHostControl}
                    className="flex-grow-1"
                  />
                )}
              </TimerProvider>
            </ExitContext.Provider>
          </div>
        </div>
        <FAB
          actions={[
            !fromMedium ? hostAction : null,
            !endGameData ? exitAction : null,
          ]}
        />
        {getExitModal()}
      </div>
      {/* <AnswerSheet /> */}
    </>
  )
}

export default CommunityGamePlay
