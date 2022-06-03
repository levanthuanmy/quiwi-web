import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import styles from './GamePage.module.css'

const GamePage: NextPage = () => {
  const { gameSession } = useGameSession()
  const [isExpand, setIsExpand] = useState<boolean>(false)

  useEffect(() => {
    if (!gameSession) {
      // connectGameSocket()
      // console.log('Game / index :: gameSession null => ', gameSession)
    }
  }, [gameSession])

  return (
    <>
      <div className={classNames(styles.gameBackground, 'bg-black')}>
        <div
          className={classNames(
            styles.gameView,
            'd-flex justify-content-center position-relative'
          )}
        >
          <div className={classNames(styles.answerBoard)}>
            <AnswerBoard className="flex-grow-1" />
            {/* <EmojiBar className={styles.emojiBar} />
            <EmojiBar className={styles.emojiBar} /> */}
          </div>

          {gameSession && (
            <GameMenuBar
              isExpand={isExpand}
              setIsExpand={setIsExpand}
              gameSession={gameSession}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default GamePage
