import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import AnswerBoard from '../../components/GameComponents/AnswerBoard/AnswerBoard'
import GameMenuBar from '../../components/GameMenuBar/GameMenuBar'
import {useGameSession} from '../../hooks/useGameSession/useGameSession'
import styles from './GamePage.module.css'

const GamePage: NextPage = () => {
  const router = useRouter()
  const {questionId} = router.query
  const {gameSession, saveGameSession, clearGameSession} = useGameSession()
  const [isExpand, setIsExpand] = useState<boolean>(false)

  useEffect(() => {
    if (!gameSession) {
      console.log("Game / index :: gameSession null => ", gameSession);
    }
  }, [gameSession])

  return (
    <>
      <div className={`${styles.gameBackground}`}>s
        <div className={`${styles.gameView} d-flex `}>
          <div
            className={`d-flex flex-column flex-grow-3 gap-3 ${styles.gameCol} me-lg-3 m-0 `}
          >
            <AnswerBoard
              questionId={Number(questionId) ?? 0}
              className="flex-grow-1"
            />
            {/* <EmojiBar className={styles.emojiBar} />
            <EmojiBar className={styles.emojiBar} /> */}
          </div>
          {gameSession &&
              <GameMenuBar
                  isExpand={isExpand}
                  setIsExpand={setIsExpand}
                  gameSession={gameSession}
              />
          }
        </div>
      </div>
    </>
  )
}

export default GamePage
