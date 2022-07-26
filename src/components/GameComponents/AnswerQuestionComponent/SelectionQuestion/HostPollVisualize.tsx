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

  const options = {
    legend: 'none',
    vAxis: {
      gridlines: {
        color: 'transparent',
      },
      textPosition: 'none',
    },
    backgroundColor: 'transparent',
    annotations: {
      textStyle: {
        fontSize: 32,
      },
      alwaysOutside: true,
    },
  }

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
