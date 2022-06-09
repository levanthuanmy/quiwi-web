import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import AnswerBoard from '../AnswerBoard/AnswerBoard'

import styles from './CommunityGamePlay.module.css'

const CommunityGamePlay: NextPage = () => {
  const router = useRouter()
  const { questionId } = router.query
  const { gameSession, saveGameSession, clearGameSession, gameSocket } =
    useGameSession()

  useEffect(() => {
    if (!gameSession) {
      // connectGameSocket()
      // console.log('Game / index :: gameSession null => ', gameSession)
    }
  }, [gameSession])

  return (
    <>
      <div className={`${styles.gameBackground}`}>
        <div
          className={`${styles.gameView} d-flex justify-content-center position-relative`}
        >
          <div
            // className={`d-flex flex-column flex-grow-3 gap-3 ${styles.gameCol} me-lg-3 m-0 `}
            className={`${styles.answerBoard}`}
          >
            <AnswerBoard
              questionId={Number(questionId) ?? 0}
              className="flex-grow-1"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityGamePlay
