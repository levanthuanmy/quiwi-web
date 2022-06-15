import classNames from 'classnames'
import _ from 'lodash'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { Modal, Table } from 'react-bootstrap'
import Chart from 'react-google-charts'
import {
  TQuestion,
  TStartQuizResponse,
  TViewResult,
} from '../../../types/types'
import { ANSWER_COLORS } from '../../../utils/constants'
import { JsonParse } from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'

type GameSessionRankingProps = {
  show: boolean
  onHide: () => void
  rankingData: any[]
  viewResultData: TViewResult
  currentQuestion: TQuestion
}
const GameSessionRanking: FC<GameSessionRankingProps> = ({
  show,
  onHide,
  rankingData,
  viewResultData,
  currentQuestion,
}) => {
  // const { gameSession } = useGameSession()
  const [currentPlayerRankingIndex, setCurrentPlayerRankingIndex] =
    useState<number>(0)

  useEffect(() => {
    if (rankingData) {
      const findCurrentPlayerRanking = () => {
        const nickname: string = JsonParse(
          localStorage.getItem('game-session-player')
        )?.nickname

        setCurrentPlayerRankingIndex(
          rankingData?.findIndex((item) => item?.nickname === nickname)
        )
      }

      findCurrentPlayerRanking()
    }
  }, [rankingData])

  const diffPositionPrevRound = (nickname: string, index: number) => {
    const gameSession = JsonParse(
      localStorage.getItem('game-session')
    ) as TStartQuizResponse

    if (!gameSession?.players || !gameSession?.players.length) return 0

    return (
      gameSession.players.findIndex((item) => item.nickname === nickname) -
      index
    )
  }

  const answersSubmittedData = useMemo(() => {
    let data: (string | number)[][] = []
    if (viewResultData && currentQuestion) {
      if (!_.isEmpty(viewResultData.answersStatistic)) {
        data = Object.keys(viewResultData?.answersStatistic).map(
          (key, index) => [
            currentQuestion.questionAnswers.find(
              (ans) => ans.id === Number(key)
            )?.answer || key,
            viewResultData?.answersStatistic[key],
            ANSWER_COLORS[index % ANSWER_COLORS.length] || ANSWER_COLORS[0],
            viewResultData?.answersStatistic[key],
          ]
        )
      } else {
        data = Object.keys(viewResultData?.answerTextStatistic).map(
          (key, index) => [
            key,
            viewResultData?.answerTextStatistic[key],
            ANSWER_COLORS[index % ANSWER_COLORS.length] || ANSWER_COLORS[0],
            viewResultData?.answerTextStatistic[key],
          ]
        )
      }
    }

    return [
      [
        'Câu trả lời',
        'Số người chọn',
        { role: 'style' },
        { role: 'annotation' },
      ],
      ...data,
    ]
  }, [viewResultData, currentQuestion])
  console.log(
    'answersSubmittedData - answersSubmittedData',
    answersSubmittedData
  )

  const options = {
    legend: 'none',
    vAxis: {
      gridlines: {
        color: 'transparent',
      },
      textPosition: 'none',
    },
    backgroundColor: 'transparent',
  }

  return (
    <MyModal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen
      header={<Modal.Title>Bảng xếp hạng</Modal.Title>}
      footer={
        <Modal.Footer>
          <Table borderless className="mb-0">
            <td className="p-3">
              <div
                className={classNames(
                  'd-flex justify-content-center align-items-center fw-medium',
                  {
                    'rounded-circle text-white': currentPlayerRankingIndex < 3,
                    'bg-warning': currentPlayerRankingIndex === 0,
                    'bg-secondary bg-opacity-50':
                      currentPlayerRankingIndex === 1,
                    'bg-bronze': currentPlayerRankingIndex === 2,
                  }
                )}
                style={{ width: 30, height: 30 }}
              >
                {currentPlayerRankingIndex + 1}
              </div>
            </td>
            <td className="p-3 text-start">
              {rankingData[currentPlayerRankingIndex]?.nickname}
            </td>
            <td className="p-3">
              <div
                className={classNames(
                  'py-1 fw-medium text-center rounded-10px overflow-hidden w-100',
                  {
                    'text-white': currentPlayerRankingIndex < 3,
                    'bg-warning': currentPlayerRankingIndex === 0,
                    'bg-secondary bg-opacity-50':
                      currentPlayerRankingIndex === 1,
                    'bg-bronze': currentPlayerRankingIndex === 2,
                    'bg-secondary bg-opacity-75': currentPlayerRankingIndex > 2,
                  }
                )}
                style={{ width: 90 }}
              >
                {Math.round(rankingData[currentPlayerRankingIndex]?.score)}
              </div>
            </td>
            <td className="p-3 text-center">
              {rankingData[currentPlayerRankingIndex]?.currentStreak}
            </td>
          </Table>
        </Modal.Footer>
      }
    >
      <div className="rounded-14px border overflow-hidden">
        <Table borderless className="mb-0">
          <tbody>
            <tr className="border-bottom bg-primary bg-opacity-10 fw-medium">
              <td className="p-3">#</td>
              <td className="p-3">Tên người tham dự</td>
              <td className="p-3 text-center">Điểm số</td>
              <td className="p-3 text-center">Liên tiếp</td>
            </tr>
            {rankingData?.slice(0, 5)?.map((item, key) => {
              const diff = diffPositionPrevRound(item?.nickname, key)
              return (
                <tr
                  key={key}
                  className={classNames({
                    'border-top': key !== 0,
                  })}
                >
                  <td className="p-3 d-flex gap-3">
                    <div
                      className={classNames(
                        'd-flex justify-content-center align-items-center fw-medium',
                        {
                          'rounded-circle text-white': key < 3,
                          'bg-warning': key === 0,
                          'bg-secondary bg-opacity-50': key === 1,
                          'bg-bronze': key === 2,
                        }
                      )}
                      style={{ width: 30, height: 30 }}
                    >
                      {key + 1}
                    </div>
                    <div
                      className={classNames(
                        'fs-18px fw-medium d-flex align-items-center gap-3',
                        {
                          'text-danger bi bi-chevron-double-down': diff < 0,
                          'text-success bi bi-chevron-double-up': diff > 0,
                        }
                      )}
                    >
                      {diff !== 0 ? diff > 0 ? `+${diff}` : diff : <></>}
                    </div>
                  </td>
                  <td className="p-3">{item?.nickname}</td>
                  <td className="p-3">
                    <div
                      className={classNames(
                        'py-1 fw-medium text-center rounded-10px overflow-hidden w-100',
                        {
                          'text-white': key < 3,
                          'bg-warning': key === 0,
                          'bg-secondary bg-opacity-50': key === 1,
                          'bg-bronze': key === 2,
                          'bg-secondary bg-opacity-75': key > 2,
                        }
                      )}
                      style={{ width: 90 }}
                    >
                      {Math.round(item?.score)}
                    </div>
                  </td>
                  <td className="p-3 text-center">{item?.currentStreak}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div className="pt-5 fw-medium fs-22px">Thống kê câu trả lời</div>
      {currentQuestion?.type === '31ESSAY' ? (
        Object.keys(viewResultData.answerTextStatistic).map((key, index) => (
          <div key={index}>
            {index + 1}. {key}
          </div>
        ))
      ) : (
        <>
          <div className="fst-italic pb-3 text-secondary">
            Số lượng người chọn mỗi câu trả lời
          </div>
          <Chart
            chartType="ColumnChart"
            width={'100%'}
            // height={'400px'}
            data={answersSubmittedData}
            options={options}
          />
        </>
      )}
    </MyModal>
  )
}

export default memo(GameSessionRanking)
