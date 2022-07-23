import { useTimer } from '../../../../hooks/useTimer/useTimer'
import { TQuestion, TQuestionType } from '../../../../types/types'
import ConnectQuestion from '../ConnectQuestion/ConnectQuestion'
import EssayQuestion from '../PollQuestion/EssayQuestion'
import MultipleChoiceAnswerSection from '../SelectionQuestion/MultipleChoiceAnswerSection'
import PollAnswerSection from '../SelectionQuestion/PollAnswerSection'
import SingleChoiceAnswerSection from '../SelectionQuestion/SingleChoiceAnswerSection'
import TextQuestion from '../TextQuestion/TextQuestion'

export class AnswerSectionFactory {
  isHost: boolean
  answerLayout: string
  timerContext = useTimer()
  isExam: boolean = false

  constructor(isHost: boolean, answerLayout: string, isExam?: boolean) {
    this.isHost = isHost
    this.answerLayout = answerLayout
    this.isExam = isExam || false
  }

  public initAnswerSectionForType(
    questionType: TQuestionType,
    question: TQuestion,
    // isSubmitted: boolean,
    handleSubmitAnswer: (answer: any) => void,
    answersStatistic?: Record<string, number>,
    initSelectedAnswer?: any
  ): JSX.Element {
    switch (questionType) {
      case '10SG':
        return this.initSingleAnswer(
          question,
          handleSubmitAnswer,
          initSelectedAnswer
        )
      case '20MUL':
        return this.initMultipleAnswer(
          question,
          handleSubmitAnswer,
          initSelectedAnswer
        )
      case '21ODMUL':
        return this.initConnectAnswer(
          question,
          handleSubmitAnswer,
          initSelectedAnswer
        )
      case '22POLL':
        return this.initPollAnswer(
          question,
          handleSubmitAnswer,
          answersStatistic,
          initSelectedAnswer
        )
      case '30TEXT':
        return this.initTextAnswer(
          question,
          handleSubmitAnswer,
          initSelectedAnswer
        )
      case '31ESSAY':
        return this.initEssayAnswer(
          question,
          handleSubmitAnswer,
          initSelectedAnswer
        )
    }
  }

  protected initSingleAnswer(
    question: TQuestion,
    handleSubmitAnswer: (answer: any) => void,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <SingleChoiceAnswerSection
        socketSubmit={handleSubmitAnswer}
        className={this.answerLayout}
        option={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }

  protected initMultipleAnswer(
    question: TQuestion,
    submitAnswerHandle: (answer: any) => void,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <MultipleChoiceAnswerSection
        socketSubmit={submitAnswerHandle}
        className={this.answerLayout}
        option={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }

  protected initPollAnswer(
    question: TQuestion,
    submitAnswerHandle: (answer: any) => void,
    answersStatistic?: Record<string, number>,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <PollAnswerSection
        socketSubmit={submitAnswerHandle}
        className={this.answerLayout}
        option={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        answersStatistic={answersStatistic}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }

  protected initConnectAnswer(
    question: TQuestion,
    submitAnswerHandle: (answer: any) => void,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <ConnectQuestion
        socketSubmit={submitAnswerHandle}
        className={this.answerLayout}
        question={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }

  protected initTextAnswer(
    question: TQuestion,
    submitAnswerHandle: (answer: any) => void,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <TextQuestion
        socketSubmit={submitAnswerHandle}
        className={this.answerLayout}
        question={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }

  protected initEssayAnswer(
    question: TQuestion,
    submitAnswerHandle: (answer: any) => void,
    initSelectedAnswer?: any
  ): JSX.Element {
    return (
      <EssayQuestion
        socketSubmit={submitAnswerHandle}
        className={this.answerLayout}
        question={question}
        isHost={this.isHost}
        isSubmitted={!this.timerContext.isSubmittable}
        isShowSkeleton={this.timerContext.isShowSkeleton}
        isCounting={this.timerContext.isCounting}
        isTimeOut={!this.timerContext.isCounting}
        showAnswer={
          this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton
        }
        isExam={this.isExam}
        initSelectedAnswer={initSelectedAnswer}
      />
    )
  }
}

export const QuestionTypeDescription: Record<
  TQuestionType,
  { icon: string; colorClassName: string; title: string, description: string }
> = {
  '10SG': {
    icon: 'bi bi-check2',
    colorClassName: 'bg-primary',
    title: 'Một đáp án đúng',
    description: 'Loại câu hỏi chọn một đáp án đúng chỉ hỗ trợ chọn duy nhất một đáp án đúng'
  },
  '20MUL': {
    icon: 'bi bi-check2-all',
    colorClassName: 'bg-info',
    title: 'Nhiều đáp án đúng',
    description: `Loại câu hỏi chọn nhiều đáp án đúng cho phép 
    tạo nhiều đáp án đúng. Người chơi phải chọn đúng tất cả thì 
    mới được cho là đúng`
  },
  '21ODMUL': {
    icon: 'bi bi-pencil-square',
    colorClassName: 'bg-warning',
    title: 'Hoàn tất câu sau',
    description: `Loại câu hỏi điền vào chỗ trống cho phép tạo 
    nhiều đáp án đúng. Người chơi chỉ cần điền đúng một trong 
    các đáp án sẽ được cho là đúng`
  },
  '22POLL': {
    icon: 'bi bi-file-earmark-bar-graph',
    colorClassName: 'bg-danger',
    title: 'Bình chọn ý kiến',
    description: `Loại câu hỏi bình chọn không có đáp án đúng, 
    người chơi sẽ chọn và chủ phòng sẽ xem được số lượng câu trả 
    lời của từng đáp án được chọn`
  },
  '30TEXT': {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Điền đáp án đúng',
    description: `Loại câu hỏi nối từ, các đáp án sẽ được tách 
    câu theo từng từ, người chơi cần nối các từ để tạo thành một 
    câu, được cho là đúng khi người chơi tạo thành câu đúng hoàn 
    chỉnh`
  },
  '31ESSAY': {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Câu trả lời tự do',
    description: `Loại câu trả lời tự do không có đáp án đúng, 
    cho phép người chơi nhập tự do các câu trả lời, chủ phòng 
    sẽ xem được các đáp án được trả lời`
  },
}
