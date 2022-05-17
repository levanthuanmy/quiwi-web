import classNames from 'classnames'
import { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './QuestionMedia.module.css'

const QuestionMedia: FC<{
  timeout: number
  media: string
  numSubmission: number
}> = ({ timeout, media, numSubmission }) => {
  return (
    <div className="text-center mb-3 d-flex justify-content-xl-between justify-content-center align-items-center">
      {/* Timeout */}
      <div>
        <div
          className={classNames(
            'bg-primary text-white rounded-circle fw-medium',
            styles.circleContainer
          )}
        >
          {timeout}
        </div>
      </div>

      <Image
        src={media || 'assets/default-question-image.png'}
        alt="question-image"
        fluid={true}
        className={classNames(styles.questionImage, 'mx-3')}
      />
      {/* Số người submit */}
      <div>
        <div
          className={classNames(
            'bg-primary text-white fw-medium',
            styles.circleContainer
          )}
        >
          {numSubmission}
        </div>
      </div>
    </div>
  )
}

export { QuestionMedia }
