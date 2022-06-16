import classNames from 'classnames'
import { FC } from 'react'
import { Row, Col } from 'react-bootstrap'
import { TQuestion } from '../../../types/types'

const QuestionAnswerStatistic: FC<{
  question: TQuestion
}> = ({ question }) => {
  const questionAnswers = question.questionAnswers

  const className = classNames('mx-2')
  if (question.type === '10SG' || question.type === '20MUL') {
    return (
      <>
        {questionAnswers.map((questionAnswer, idx) => (
          <Row
            key={idx}
            className={classNames(
              className,
              'border-bottom border-secondary py-1'
            )}
          >
            <Col>{questionAnswer.answer}</Col>
            <Col>
              {questionAnswer.isCorrect ? (
                <>
                  <span>
                    <i className="bi bi-check text-primary pe-2"></i>
                  </span>
                  Đúng
                </>
              ) : (
                <>
                  <span>
                    <i className="bi bi-x text-danger pe-2"></i>
                  </span>
                  Sai
                </>
              )}
            </Col>
          </Row>
        ))}
      </>
    )
  } else if (question.type === '21ODMUL') {
    return (
      <>
        <div>
          <h5>Câu trả lời phải đúng thứ tự sau</h5>
          <Row className={className}>
            <Col>{questionAnswers.map((q) => q.answer).join(' ')}</Col>
          </Row>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div>
          <h5>
            Câu trả lời phải{' '}
            {question.matcher === '10EXC' ? 'chứa đựng' : 'bao gồm'} các câu trả
            lời sau
          </h5>
          <Row className={className}>
            <Col>{questionAnswers.map((q) => q.answer).join(', ')}</Col>
          </Row>
        </div>
      </>
    )
  }
}

export default QuestionAnswerStatistic
