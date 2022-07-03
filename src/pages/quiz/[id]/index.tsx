import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {Col, Container, Modal, Row} from 'react-bootstrap'
import useSWR from 'swr'
import CardQuizInfo from '../../../components/CardQuizInfo/CardQuizInfo'
import ItemQuestion from '../../../components/ItemQuestion/ItemQuestion'
import MyButton from '../../../components/MyButton/MyButton'
import NavBar from '../../../components/NavBar/NavBar'
import {get} from '../../../libs/api'
import {TApiResponse, TQuiz, TUser} from '../../../types/types'
import {useEffect, useState} from 'react'
import {JsonParse} from '../../../utils/helper'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {usePracticeGameSession} from '../../../hooks/usePracticeGameSession/usePracticeGameSession'
import _ from 'lodash'
import MyModal from '../../../components/MyModal/MyModal'
import LoadingFullScreen from '../../../components/LoadingFullScreen/Loading'
import {useGameSession} from "../../../hooks/useGameSession/useGameSession";

const QuizDetailPage: NextPage = () => {
  const router = useRouter()
  const query = router.query
  const practiceGameSession = usePracticeGameSession()
  const gameSession = useGameSession()
  const {id} = query
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()
  const [forbiddenError, setForbiddenError] = useState('')
  const [currentQID, setCurrentQID] = useState<number>(-1)


  // useEffect(() => {
  //   console.log("=>(index.tsx:34) lsCurrentQID", lsCurrentQID);
  // }, [lsCurrentQID]);

  useEffect(() => {
    gameSession.connectGameSocket()
    gameSession.gameSkOnce('connect', () => {
      console.log("=>(index.tsx:30) gameSocket()", gameSession.gameSocket());
      gameSession.gameSocket()?.on('view-result', (data) => {
        console.log("=>(index.tsx:31) màn bộ đề", data);
      })
    })

    window.addEventListener("storage",(e) => {
      if (e.key == "currentQID") {
        setCurrentQID(Number(e.newValue))
      }
    });
  }, []);

  const {data, isValidating, error} = useSWR<TApiResponse<TQuiz>>(
    id
      ? [
        `/api/quizzes/quiz/${id}`,
        false,
        {filter: {relations: ['user', 'quizCategories']}},
      ]
      : null,
    get,
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (!practiceGameSession) return
    practiceGameSession.gameSkOnce('loading', (data) => {
      router.push(`/game/play`)
    })
  }, [practiceGameSession])

  useEffect(() => {
    if (lsUser) setUser(JsonParse(lsUser) as TUser)
    practiceGameSession.gameSkOn('loading', (data) => {
    })
  }, [])

  useEffect(() => {
    if (error) {
      if (_.get(error, 'code') === 403) {
        setForbiddenError(_.get(error, 'message'))
      }
    }
  }, [error])

  const quiz = data?.response

  return (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null}/>
      <Container fluid="lg" className="pt-80px min-vh-100">
        {!error ? (
          <Row className="flex-column-reverse flex-lg-row py-3">
            <Col xs="12" lg="8">
              {quiz?.questions?.map((question, key) => (
                <ItemQuestion
                  key={key}
                  question={question}
                  showActionBtn={false}
                />
              ))}
            </Col>
            <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
              <CardQuizInfo
                quiz={quiz}
                isValidating={isValidating}
                // setQuiz={setQuiz}
              />

              <div className="mt-3">
                <MyButton
                  className="text-white w-100 d-flex align-items-center justify-content-between"
                  onClick={() => {
                    router.push(`/quiz/${id}/play`)
                  }}
                >
                  Chơi ngay
                  <div className="bi bi-play-fill"/>
                </MyButton>
              </div>
            </Col>
          </Row>
        ) : null}
        {!error && !data ? <LoadingFullScreen/> : null}

        <MyModal
          show={forbiddenError?.length > 0}
          onHide={() => {
            setForbiddenError('')
            router.push('/')
          }}
          size="sm"
          header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
        >
          <div className="text-center fw-medium fs-16px">{forbiddenError}</div>
        </MyModal>
      </Container>
    </>
  )
}

export default QuizDetailPage
