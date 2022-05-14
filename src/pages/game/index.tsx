import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import AnswerBoard from '../../components/GameComponents/AnswerBoard/AnswerBoard'
import EmojiBar from '../../components/GameComponents/EmojiBar/EmojiBar'
import styles from './GamePage.module.css'
import ChatWindow from '../../components/GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../../components/GameComponents/PlayerList/PlayerList'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import GameMenuBar from '../../components/GameMenuBar/GameMenuBar'
const GamePage: NextPage = () => {
  const router = useRouter()
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)
  const { questionId } = router.query

  // useEffect(() => {
  //   const questionType = router.query?.type?.toString()
  //   if (questionType?.length) {
  //     setIsShowQuestionCreator(true)
  //   }1
  // }, [router.query])
  const [isExpand, setIsExpand] = useState<boolean>(false)

  return (
    <>
      <NavBar className={styles.hiddenNav} />
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
            isFullHeight={true}
          />
        </div>
      </div>
    </>
  )
}

export default GamePage
