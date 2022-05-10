import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import ItemQuestion from '../../components/ItemQuestion/ItemQuestion'
import NavBar from '../../components/NavBar/NavBar'
import AnswerBoard from '../../components/GameComponents/AnswerBoard/AnswerBoard'
import EmojiBar from '../../components/GameComponents/EmojiBar/EmojiBar'
import styles from './GamePage.module.css'
import ChatWindow from '../../components/GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../../components/GameComponents/PlayerList/PlayerList'
const GamePage: NextPage = () => {
  const router = useRouter()
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)

  useEffect(() => {
    const questionType = router.query?.type?.toString()
    if (questionType?.length) {
      setIsShowQuestionCreator(true)
    }
  }, [router.query])

  return (
    <>
      <NavBar />
      <div className={`nav-bar-pt ${styles.gameBackground}`}>
        <Row className={`${styles.gameView}`}>
          <Col lg="6" className={`d-flex flex-column gap-3 max-v ${styles.gameCol}`}>
            <AnswerBoard />
            <EmojiBar />
            <EmojiBar />
          </Col>

          <Col lg="4" className={styles.chatView}>
            <ChatWindow />
          </Col>

          <Col lg="2" className={styles.playerList}>
            <PlayerList playerList={[1,2,3,4,5,6,7,1,2,3,4,5,6,71,2,3,4,5,6,7]}/>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default GamePage
