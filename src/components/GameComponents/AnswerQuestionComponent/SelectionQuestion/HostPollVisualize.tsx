import _ from 'lodash'
import React, { FC, memo, useMemo } from 'react'
import Chart from 'react-google-charts'
import { TAnswer } from '../../../../types/types'
import { ANSWER_COLORS } from '../../../../utils/constants'

const HostPollVisualize: FC<{
  answersStatistic?: Record<string, number>
  answers?: TAnswer[]
}> = ({ answersStatistic, answers }) => {
  const answersSubmittedData = useMemo(() => {
    let data: (string | number)[][] = [[0, 0, 0, 0]]
    try {
      if (answersStatistic && answers) {
        data = answers.map((ans, index) => [
          ans.answer || index,
          _.get(answersStatistic, String(ans?.id), 0),
          ANSWER_COLORS[index % ANSWER_COLORS.length] || ANSWER_COLORS[0],
          _.get(answersStatistic, String(ans?.id), 0),
        ])
      }
    } catch (error) {
      console.log('answersSubmittedData - error', error)
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
  }, [answersStatistic, answers])

  const options = useMemo(() => {
    return {
      legend: 'none',
      vAxis: {
        viewWindow: {
          min: 0,
          max: (_.max(Object.values(answersStatistic || {})) || 0) + 1,
        },
        // ticks: [0, 25, 50, 75, 100],
        gridlines: {
          color: 'transparent',
        },
        textPosition: 'none',
      },
      backgroundColor: 'transparent',
      annotations: {
        alwaysOutside: true,
        textStyle: {
          fontSize: 32,
        },
      },
      animation: {
        startup: true,
        duration: 200,
        easing: 'inAndOut',
      },
    }
  }, [answersStatistic])

  return (
    <div className="bg-white shadow rounded-10px">
      <Chart
        chartType="ColumnChart"
        width={'100%'}
        height={'400px'}
        data={answersSubmittedData}
        options={options}
      />
    </div>
  )
}

export default memo(HostPollVisualize)
