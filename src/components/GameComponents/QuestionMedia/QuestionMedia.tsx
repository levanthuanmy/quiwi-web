import classNames from 'classnames'
import {FC} from 'react'
import {Image} from 'react-bootstrap'
import styles from './QuestionMedia.module.css'

const QuestionMedia: FC<{
  timeout: number
  media: string | null
  numSubmission: number
}> = ({timeout, media, numSubmission}) => {
  return (
    <div className="text-center mb-3 d-flex justify-content-xl-between justify-content-center align-items-center">
      {/* Timeout */}
      <div
        className={classNames(
          // 'bg-primary',
          "text-white fw-medium",
          styles.timeoutContainer,
        )}
        style={{
          backgroundColor: timeout <= 0 ? "#e2352a" : ((timeout % 2 == 0) ? "#007f6d" : "#7f955f"),
          transition: "all .8s ease",
          WebkitTransition: "all .8s ease",
          MozTransition: "all .8s ease"
        }}
      >
        <i className="bi bi-stopwatch"></i>
        <div className={classNames(styles.timeout)}>
          {' '}{Math.floor(timeout / 60)}{' '}:{' '}{Math.ceil(timeout % 60)}
        </div>

      </div>


      <Image
        src={media || 'assets/default-question-image.png'}
        alt="question-image"
        fluid={true}
        className={classNames(styles.questionImage, 'mx-3 flex-grow-1')}
      />

      {/* Số người submit */}
      <div
        className={classNames(
          'bg-primary text-white fw-medium',
          styles.streakContainer
        )}
      >
        {numSubmission}
      </div>
    </div>
  )
}

export {QuestionMedia}
