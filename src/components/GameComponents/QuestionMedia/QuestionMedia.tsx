import classNames from 'classnames'
import {FC, useContext, useRef, useState} from 'react'
import {Image} from 'react-bootstrap'
import styles from './QuestionMedia.module.css'
import cn from "classnames";
import {ColorHex, CountdownCircleTimer} from 'react-countdown-circle-timer'
import useScreenSize from "../../../hooks/useScreenSize/useScreenSize";
import {useTimer} from "../../../hooks/useTimer/useTimer";

const timerColor: { 0: ColorHex } & { 1: ColorHex } & ColorHex[] = ['#009883', '#dc3545', '#ffc107', '#dc3545', '#ffc107', '#dc3545', '#ffc107', '#dc3545', '#ffc107', '#dc3545', '#ffc107', '#dc3545', '#A30000']
const QuestionMedia: FC<{
  media: string | null
  numStreak: number
  numSubmission: number
  className?: string
}> = ({media, numSubmission, numStreak, className}) => {
  const {fromMedium} = useScreenSize()
  const timerContext = useTimer()
  const formatTime = (remainingTime: number) => {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60

    return (
      <div className={styles.timer}>
        {
          !timerContext.isShowAnswer || timerContext.isShowSkeleton ?
          <>
            <div className={styles.text}>Còn lại</div>

            <div className={cn(styles.value)}>{`${minutes} : ${seconds}`}</div>
            <div className={styles.text}>giây</div>
          </>
            :
          <div className={cn(styles.valueDanger)}>Hết giờ!</div>
        }
      </div>
    )
  }

  const formatNumSubmit = (numSubmit: number) => {
    return (
      <div className={styles.timer}>
        <div className={styles.text}>Đã nộp</div>
        <div
          className={classNames(
            'text-white fw-medium d-flex gap-2 align-items-center px-3',
            // styles.streakContainer,
            styles.value
          )}
        >
          <i className="bi bi-person-check-fill"></i>
          {`: ${numSubmit}`}

        </div>
        <div className={styles.text}></div>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        className,
        `text-center mb-2 d-flex justify-content-xl-between justify-content-center align-items-center bg-dark bg-opacity-50 rounded-10px shadow`
        , styles.questionMedia
      )}
    >
      {/* Timeout */}
      {!fromMedium && <div className="d-flex flex-column gap-2">
          <div className={cn("text-white", styles.timeoutTitle)}>Đếm ngược</div>
          <div
              className={classNames('text-white fw-medium', styles.timeoutContainer)}
              style={{
                backgroundColor:
                  timerContext.countDown <= 0 ? '#e2352a' : timerContext.countDown % 2 == 0 ? '#007f6d' : '#7f955f',
                transition: 'all .8s ease',
                WebkitTransition: 'all .8s ease',
                MozTransition: 'all .8s ease',
              }}
          >

              <i className="bi bi-stopwatch"></i>
              <div className={classNames(styles.timeout)}>
                {Math.floor(timerContext.countDown / 60)} : {Math.ceil(timerContext.countDown % 60)}
              </div>
          </div>
      </div>
      }

      {fromMedium && <div className={cn(styles.outsizeTimer, "d-flex align-items-center ")}>
          <CountdownCircleTimer
              isPlaying={!timerContext.isShowAnswer}
              duration={timerContext.duration - 0.2}
              size={240}
              strokeWidth={30}
            // isSmoothColorTransition={true}
              colors={timerColor}
              colorsTime={[6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0]}

          >
            {({remainingTime}) => formatTime(remainingTime)}
          </CountdownCircleTimer>
      </div>
      }
      <Image
        src={media || '/assets/default-question-image.png'}
        alt="question-image"
        fluid={true}
        className={classNames(styles.questionImage, 'mx-1 flex-grow-1')}
      />

      {/* Số người submit */}
      {!fromMedium && <div className="d-flex flex-column gap-2">
          <div className={cn("text-white", styles.timeoutTitle)}>Đã nộp</div>
          <div className={"d-flex flex-column gap-3"}>
              <div
                  className={classNames(
                    'bg-primary text-white fw-medium rounded-pill d-flex gap-2 align-items-center px-3',
                    styles.streakContainer
                  )}
              >
                  <i className="bi bi-person-check-fill"></i>
                {numSubmission}
              </div>
          </div>
      </div>}

      {fromMedium && <div className={cn(styles.outsizeTimer, "d-flex align-items-center ")}>
          <CountdownCircleTimer
              isPlaying={!timerContext.isShowAnswer}
              duration={timerContext.duration - 0.2}
              size={240}
              strokeWidth={30}
              isSmoothColorTransition={true}
              colors={timerColor}
              colorsTime={[6, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]}

          >
            {({remainingTime}) => formatNumSubmit(numSubmission)}
          </CountdownCircleTimer>
      </div>}
      {/**/}

    </div>
  )
}

export {QuestionMedia}
