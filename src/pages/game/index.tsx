import {NextPage} from 'next'
import {useRouter} from 'next/router'
import React from 'react'
import {Col, Row} from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import AnswerBoard from '../../components/GameComponents/AnswerBoard/AnswerBoard'
import EmojiBar from '../../components/GameComponents/EmojiBar/EmojiBar'
import styles from './GamePage.module.css'
import ChatWindow from '../../components/GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../../components/GameComponents/PlayerList/PlayerList'

const GamePage: NextPage = () => {
  const router = useRouter()
  const {questionId} = router.query

  return (
    <>
      <NavBar className={styles.hiddenNav}/>
      <NavBar className={styles.hiddenNav}/>
      <div className={`${styles.gameBackground}`}>
        <Row className={`${styles.gameView}`}>
          <Col lg="6" className={`d-flex flex-column gap-3 ${styles.gameCol}`}>
            <AnswerBoard questionId={Number(questionId) ?? 0} className="flex-grow-1"/>
            <EmojiBar className={styles.emojiBar}/>
            <EmojiBar className={styles.emojiBar}/>
          </Col>

          <Col lg="4" className={styles.chatView}>
            <ChatWindow/>
          </Col>

          <Col lg="2" className={styles.playerList}>
            <PlayerList
              playerList={[]}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default GamePage
