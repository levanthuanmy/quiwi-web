import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AnswerBoard from '../../components/GameComponents/AnswerBoard/AnswerBoard'
import EmojiBar from '../../components/GameComponents/EmojiBar/EmojiBar'
import GameMenuBar from '../../components/GameMenuBar/GameMenuBar'
import { useGameSession } from '../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { TStartQuizResponse, TUser } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import styles from './GamePage.module.css'

const GamePage: NextPage = () => {
  const router = useRouter()
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)
  const { questionId } = router.query
  const gameSession = useGameSession()
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()

  useEffect(() => {
    const userParsed: TUser = JsonParse(lsUser)
    setUser(userParsed)
  }, [])

  const [isExpand, setIsExpand] = useState<boolean>(false)

  return (
    <>
      <div className={`${styles.gameBackground}`}>
        <div className={`${styles.gameView} d-flex `}>
          <div
            className={`d-flex flex-column flex-grow-3 gap-3 ${styles.gameCol} me-lg-3 `}
          >
            <AnswerBoard
              questionId={Number(questionId) ?? 0}
              className="flex-grow-1"
            />
            <EmojiBar className={styles.emojiBar} />
            <EmojiBar className={styles.emojiBar} />
          </div>

          <GameMenuBar
            isExpand={isExpand}
            setIsExpand={setIsExpand}
            gameSession={gameSession}
            user={user}
          />
        </div>
      </div>
    </>
  )
}

export default GamePage
