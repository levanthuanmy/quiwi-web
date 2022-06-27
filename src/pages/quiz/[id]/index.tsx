import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {Col, Container, Row} from 'react-bootstrap'
import useSWR from 'swr'
import CardQuizInfo from '../../../components/CardQuizInfo/CardQuizInfo'
import ItemQuestion from '../../../components/ItemQuestion/ItemQuestion'
import MyButton from '../../../components/MyButton/MyButton'
import NavBar from '../../../components/NavBar/NavBar'
import {get} from '../../../libs/api'
import {TApiResponse, TQuiz, TUser} from '../../../types/types'
import {useEffect, useState} from "react";
import {JsonParse} from "../../../utils/helper";
import {useLocalStorage} from "../../../hooks/useLocalStorage/useLocalStorage";
import {usePracticeGameSession} from "../../../hooks/usePracticeGameSession/usePracticeGameSession";

const QuizDetailPage: NextPage = () => {
  const router = useRouter()
  const query = router.query
  const {
    gameSession,
    gameSkOn,
    gameSkOnce,
  } = usePracticeGameSession()
  const { id } = query
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()

  const { data, isValidating } = useSWR<TApiResponse<TQuiz>>(
    id
      ? [
          `/api/quizzes/quiz/${id}`,
          false,
          { filter: { relations: ['user', 'quizCategories'] } },
        ]
      : null,
    get,
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (!gameSession) return

    gameSkOnce('loading', (data) => {
      // console.log('game started', data)
      router.push(`/game/play`)
    })

    gameSkOn('error', (data) => {
      console.log('LobbyScreen.tsx - error', data)
    })

  }, [gameSession])

  // const handleLeaveRoom = () => {
  //   clearGameSession()
  //   router.back()
  // }

  useEffect(() => {
    if (lsUser) setUser(JsonParse(lsUser) as TUser)
    gameSkOn('loading', (data) => {})
  }, [])

  // const handleStartGame = () => {
  //   try {
  //     const cookies = new Cookies()
  //     const accessToken = cookies.get('access-token')
  //
  //     if (user) {
  //       const msg: TStartGameRequest = {
  //         userId: user.id,
  //         invitationCode: invitationCode,
  //         token: accessToken,
  //       }
  //       gameSkEmit('start-game', msg)
  //       gtag.event({
  //         action: '[start game]',
  //         params: {
  //           quizId: gameSession?.quizId,
  //           invitationCode: gameSession?.invitationCode,
  //         },
  //       })
  //     }
  //   } catch (error) {
  //     console.log('handleStartGame - error', error)
  //   }
  // }

  const quiz = data?.response

  return (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container fluid="lg" className="pt-80px min-vh-100">
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
                <div className="bi bi-play-fill" />
              </MyButton>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default QuizDetailPage
