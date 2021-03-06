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
    title: 'M???t ????p ??n ????ng',
    description: 'Lo???i c??u h???i ch???n m???t ????p ??n ????ng ch??? h??? tr??? ch???n duy nh???t m???t ????p ??n ????ng'
  },
  '20MUL': {
    icon: 'bi bi-check2-all',
    colorClassName: 'bg-info',
    title: 'Nhi???u ????p ??n ????ng',
    description: `Lo???i c??u h???i ch???n nhi???u ????p ??n ????ng cho ph??p 
    t???o nhi???u ????p ??n ????ng. Ng?????i ch??i ph???i ch???n ????ng t???t c??? th?? 
    m???i ???????c cho l?? ????ng`
  },
  '21ODMUL': {
    icon: 'bi bi-pencil-square',
    colorClassName: 'bg-warning',
    title: 'Ho??n t???t c??u sau',
    description: `Lo???i c??u h???i ??i???n v??o ch??? tr???ng cho ph??p t???o 
    nhi???u ????p ??n ????ng. Ng?????i ch??i ch??? c???n ??i???n ????ng m???t trong 
    c??c ????p ??n s??? ???????c cho l?? ????ng`
  },
  '22POLL': {
    icon: 'bi bi-file-earmark-bar-graph',
    colorClassName: 'bg-danger',
    title: 'B??nh ch???n ?? ki???n',
    description: `Lo???i c??u h???i b??nh ch???n kh??ng c?? ????p ??n ????ng, 
    ng?????i ch??i s??? ch???n v?? ch??? ph??ng s??? xem ???????c s??? l?????ng c??u tr??? 
    l???i c???a t???ng ????p ??n ???????c ch???n`
  },
  '30TEXT': {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: '??i???n ????p ??n ????ng',
    description: `Lo???i c??u h???i n???i t???, c??c ????p ??n s??? ???????c t??ch 
    c??u theo t???ng t???, ng?????i ch??i c???n n???i c??c t??? ????? t???o th??nh m???t 
    c??u, ???????c cho l?? ????ng khi ng?????i ch??i t???o th??nh c??u ????ng ho??n 
    ch???nh`
  },
  '31ESSAY': {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'C??u tr??? l???i t??? do',
    description: `Lo???i c??u tr??? l???i t??? do kh??ng c?? ????p ??n ????ng, 
    cho ph??p ng?????i ch??i nh???p t??? do c??c c??u tr??? l???i, ch??? ph??ng 
    s??? xem ???????c c??c ????p ??n ???????c tr??? l???i`
  },
}
