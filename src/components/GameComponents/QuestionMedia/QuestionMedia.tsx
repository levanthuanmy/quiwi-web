import { default as classNames, default as cn } from 'classnames'
import { FC, useCallback } from 'react'
import { Image } from 'react-bootstrap'
import { ColorHex, CountdownCircleTimer } from 'react-countdown-circle-timer'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { useTimer } from '../../../hooks/useTimer/useTimer'
import styles from './QuestionMedia.module.css'

const timerColor: { 0: ColorHex } & { 1: ColorHex } & ColorHex[] = [
  '#009883',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#A30000',
]
const QuestionMedia: FC<{
  media: string | null
  questionTitle: string
  numStreak: number
  numSubmission: number
  className?: string
  endTime?: number
}> = ({
  media,
  numSubmission,
  numStreak,
  className,
  questionTitle,
  endTime,
}) => {
  const { fromMedium } = useScreenSize()
  const timerContext = useTimer()
  const formatTime = useCallback(
    (remainingTime: number) => {
      const minutes = Math.floor(remainingTime / 60)
      const seconds = remainingTime % 60

      return (
        <div className={styles.timer}>
          {/* {!timerContext.isShowAnswer || timerContext.isShowSkeleton ? (
            <>
              <div className={styles.text}>Còn lại</div>

              <div
                className={cn(styles.value)}
              >{`${minutes} : ${seconds}`}</div>
              <div className={styles.text}>giây</div>
            </>
          ) : (
            <div className={cn(styles.valueDanger)}>Hết giờ!</div>
          )} */}
          {remainingTime ? (
            <>
              <div
                className={cn(styles.value)}
              >{`${minutes} : ${seconds}`}</div>
              <div className={styles.text}>giây</div>
            </>
          ) : (
            <div className={cn(styles.valueDanger)}>Hết giờ!</div>
          )}
        </div>
      )
    },
    [timerContext]
  )

  const formatNumSubmit = useCallback((numSubmit: number) => {
    return (
      <div className={styles.timer}>
        <div className={styles.text}>Đã trả lời</div>
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
  }, [])

  return (
    <>
      <div
        className={classNames(
          className,
          `text-center mb-2 d-flex justify-content-xl-between justify-content-center align-items-center bg-dark bg-opacity-50 rounded-10px shadow`,
          styles.questionMedia
        )}
      >
        {/* Timeout */}
        {!fromMedium && (
          <div className="d-flex flex-column gap-2">
            <div className={cn('text-white', styles.timeoutTitle)}>
              Đếm ngược
            </div>
            <div
              className={classNames(
                'text-white fw-medium',
                styles.timeoutContainer
              )}
              style={{
                backgroundColor:
                  timerContext.countDown <= 0
                    ? '#e2352a'
                    : timerContext.countDown % 2 == 0
                    ? '#007f6d'
                    : '#7f955f',
                transition: 'all .8s ease',
                WebkitTransition: 'all .8s ease',
                MozTransition: 'all .8s ease',
              }}
            >
              <i className="bi bi-stopwatch"></i>
              <div className={classNames(styles.timeout)}>
                {Math.floor(timerContext.countDown / 60)} :{' '}
                {Math.ceil(timerContext.countDown % 60)}
              </div>
            </div>
          </div>
        )}

        {fromMedium && (
          <div
            className={cn(styles.outsizeTimer, 'd-flex align-items-center ')}
          >
            <CountdownCircleTimer
              isPlaying={!timerContext.isShowAnswer}
              duration={timerContext.duration - 0.2}
              initialRemainingTime={endTime ? (endTime - new Date().getTime()) / 1000 : timerContext.duration - 0.2}
              size={180}
              strokeWidth={12}
              // isSmoothColorTransition={true}
              colors={timerColor}
              colorsTime={[
                6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0,
              ]}
            >
              {({ remainingTime }) => formatTime(remainingTime)}
            </CountdownCircleTimer>
          </div>
        )}

        <div
          id="imgContainer"
          className={classNames(styles.questionImage, 'px-3 flex-grow-1')}
        >
          {media ? (
            <Image
              src={media || '/assets/default-question-image.png'}
              alt="question-image"
              width="100%"
              height="100%"
              style={{ objectFit: 'scale-down' }}
            />
          ) : (
            <div
              className={classNames(
                'noselect shadow px-3 pt-2 bg-white mb-2',
                styles.questionTitle
              )}
            >
              <div
                className="h2"
                dangerouslySetInnerHTML={{
                  __html: questionTitle,
                }}
              />
            </div>
          )}
        </div>

        {/* Số người submit */}
        {!fromMedium && (
          <div className="d-flex flex-column gap-2">
            <div className={cn('text-white', styles.timeoutTitle)}>
              Đã trả lời
            </div>
            <div className={'d-flex flex-column gap-3'}>
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
          </div>
        )}

        {fromMedium && (
          <div
            className={cn(styles.outsizeTimer, 'd-flex align-items-center ')}
          >
            <CountdownCircleTimer
              isPlaying={!timerContext.isShowAnswer}
              duration={timerContext.duration - 0.2}
              initialRemainingTime={endTime ? (endTime - new Date().getTime()) / 1000 : timerContext.duration - 0.2}
              size={180}
              strokeWidth={12}
              isSmoothColorTransition={true}
              colors={timerColor}
              colorsTime={[6, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]}
            >
              {({ remainingTime }) => formatNumSubmit(numSubmission)}
            </CountdownCircleTimer>
          </div>
        )}
      </div>

      {media && (
        <div
          className={classNames(
            'noselect shadow px-3 pt-2 bg-white',
            styles.questionTitle
          )}
        >
          <div
            className="h2"
            dangerouslySetInnerHTML={{
              __html: questionTitle,
            }}
          />
        </div>
      )}
    </>
  )
}

export { QuestionMedia }
