import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Modal, Table } from 'react-bootstrap'
import QuizBannerWithTitle from '../../../../../components/CardQuizInfo/QuizBannerWithTitle/QuizBannerWithTitle'
import { HistoryGameRowByQuiz } from '../../../../../components/HistoryGameRow/HistoryGameRowByQuiz'
import Loading from '../../../../../components/Loading/Loading'
import MyModal from '../../../../../components/MyModal/MyModal'
import NavBar from '../../../../../components/NavBar/NavBar'
import { get } from '../../../../../libs/api'
import {
  GameHistoryByQuiz,
  TApiResponse,
  TQuiz
} from '../../../../../types/types'

import styles from '../QuizCreator.module.css'

export type TEditQuestion = {
  isEdit: boolean
  questionId: number | null
}

const QuizHistoryGamePage: NextPage = () => {
  const router = useRouter()
  const quizId = Number(router.query?.id)
  const [showModal, setShowModal] = useState<boolean>(false)

  const [history, setHistory] = useState<GameHistoryByQuiz>()
  const [quiz, setQuiz] = useState<TQuiz>()
  const [isValidating, setIsValidating] = useState<boolean>(true)
  const [isDetailed, setIsDetailed] = useState(false)

  const [chosenHistory, setChosenHistory] = useState<string | null>(null)
  const [errorMessage, setError] = useState('')

  useEffect(() => {
    const getQuiz = async () => {
      try {
        setIsValidating(true)
        const res = await get<TApiResponse<TQuiz>>(
          `/api/quizzes/my-quizzes/${quizId}`,
          true,
          { filter: { relations: ['quizCategories'] } }
        )

        if (res.response === null) {
          setShowModal(true)
        }
        if (res.response) {
          setQuiz(res.response)
        }
      } catch (error) {
        console.log('getQuiz - error', error)
      } finally {
        setIsValidating(false)
      }
    }
    const getHistory = async () => {
      try {
        setIsValidating(true)
        const res = await get<TApiResponse<GameHistoryByQuiz>>(
          `api/quizzes/my-quizzes/${quizId}/history`,
          true,
          {
            filter: { relations: ['quizCategories'] },
          }
        )
        console.log('==== ~ getQuiz ~ res', res)
        setHistory(res.response)
        // if (res.response === null) {
        //   setShowModal(true)
        // }
        // if (res.response) {
        //   setQuiz(res.response)
        // }
      } catch (error) {
        console.log('getQuiz - error', error)
      } finally {
        setIsValidating(false)
      }
    }
    if (quizId) {
      getHistory()
      getQuiz()
    }
  }, [quizId])

  return (
    <div className="min-vh-100">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <QuizBannerWithTitle
        isValidating={isValidating}
        quiz={quiz}
        setQuiz={setQuiz}
      />
      {history ? (
        <Container fluid="lg" className=" position-relative pt-3">
          {!isDetailed ? (
            <Table borderless className={classNames(styles.table)}>
              <tbody>
                <tr>
                  <th className={classNames('d-table-cell')}>Mã mời bí mật</th>
                  <th className="d-table-cell text-end">
                    Số người đã tham gia
                  </th>
                </tr>

                {history
                  ? Object.keys(history).map((key, idx) => {
                      return (
                        <tr
                          key={idx}
                          className="bg-light rounded-14px cursor-pointer"
                          onClick={() => {
                            setIsDetailed(true)
                            setChosenHistory(key)
                          }}
                        >
                          <td className="d-table-cell py-3  fw-medium">
                            {key}
                          </td>
                          <td className="d-table-cell py-3  text-end">
                            {history[key].length}
                          </td>
                        </tr>
                      )
                    })
                  : null}
              </tbody>
            </Table>
          ) : chosenHistory ? (
            <>
              <div
                className="text-primary fw-medium fs-18px cursor-pointer mb-3"
                onClick={() => {
                  setIsDetailed(false)
                  setChosenHistory(null)
                }}
              >
                Quay lại
              </div>
              <Table borderless className={classNames(styles.table)}>
                <tbody>
                  <tr>
                    <th className={classNames('ps-3')}>Tên bài</th>
                    <th className="ps-0">Tên người chơi</th>
                    <th className="ps-0">Ngày làm</th>
                    <th className="ps-0">Điểm tổng</th>
                    <th className="ps-0">Chế độ chơi</th>
                  </tr>
                  {history[chosenHistory].map((game) => (
                    <HistoryGameRowByQuiz
                      key={game.id}
                      gameHistory={game}
                      secretKey={chosenHistory}
                    />
                  ))}
                </tbody>
              </Table>
            </>
          ) : null}
        </Container>
      ) : (
        <Loading></Loading>
      )}

      <MyModal
        show={errorMessage?.length > 0}
        onHide={() => {
          setError('')
        }}
        size="sm"
        header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
      >
        <div className="text-center fw-medium fs-16px">{errorMessage}</div>
      </MyModal>
    </div>
  )
}

export default QuizHistoryGamePage
