import React, {useContext} from "react";
import MultipleChoiceAnswerSection from "../SelectionQuestion/MultipleChoiceAnswerSection";
import SingleChoiceAnswerSection from "../SelectionQuestion/SingleChoiceAnswerSection";
import {TQuestionType, TQuestion} from "../../../../types/types";
import TextQuestion from "../TextQuestion/TextQuestion";
import ConnectQuestion from "../ConnectQuestion/ConnectQuestion";
import EssayQuestion from "../PollQuestion/EssayQuestion";
import PollAnswerSection from "../SelectionQuestion/PollAnswerSection";
import {useTimer} from "../../../../hooks/useTimer/useTimer";

export class AnswerSectionFactory {
  isHost: boolean;
  answerLayout: string;
  timerContext = useTimer()


  constructor(
    isHost: boolean,
    answerLayout: string,
  ) {
    this.isHost = isHost
    this.answerLayout = answerLayout
  }

  public initAnswerSectionForType(questionType: TQuestionType,
                                  question: TQuestion,
                                  // isSubmitted: boolean,
                                  handleSubmitAnswer: (answer: any) => void,
                                  answersStatistic?: Record<string, number>): JSX.Element {
    switch (questionType) {
      case "10SG":
        return this.initSingleAnswer(question, handleSubmitAnswer);
      case "20MUL":
        return this.initMultipleAnswer(question, handleSubmitAnswer);
      case "21ODMUL":
        return this.initConnectAnswer(question, handleSubmitAnswer);
      case "22POLL":
        return this.initPollAnswer(question, handleSubmitAnswer, answersStatistic);
      case "30TEXT":
        return this.initTextAnswer(question, handleSubmitAnswer);
      case "31ESSAY":
        return this.initEssayAnswer(question, handleSubmitAnswer);
    }
  }

  protected initSingleAnswer(
    question: TQuestion,
    handleSubmitAnswer: (answer: any) => void): JSX.Element {
    return <SingleChoiceAnswerSection
      socketSubmit={handleSubmitAnswer}
      className={this.answerLayout}
      option={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}

      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }

  protected initMultipleAnswer(question: TQuestion,
                               submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <MultipleChoiceAnswerSection
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      option={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}

      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }

  protected initPollAnswer(question: TQuestion,
                               submitAnswerHandle: (answer: any) => void,
                           answersStatistic?: Record<string, number>): JSX.Element {
    return <PollAnswerSection
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      option={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}
      answersStatistic={answersStatistic}

      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }

  protected initConnectAnswer(question: TQuestion,
                              submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <ConnectQuestion
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      question={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}


      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }

  protected initTextAnswer(question: TQuestion,
                           submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <TextQuestion
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      question={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}

      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }

  protected initEssayAnswer(question: TQuestion,
                            submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <EssayQuestion
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      question={question}
      isHost={this.isHost}
      isSubmitted={!this.timerContext.isSubmittable}

      isShowSkeleton={this.timerContext.isShowSkeleton}
      isCounting={this.timerContext.isCounting}
      isTimeOut={!this.timerContext.isCounting}
      showAnswer={this.timerContext.isShowAnswer && !this.timerContext.isShowSkeleton}
    />
  }
}

export const QuestionTypeDescription: Record<TQuestionType,
  { icon: string; colorClassName: string; title: string }> = {
  "10SG": {
    icon: 'bi bi-check2',
    colorClassName: 'bg-primary',
    title: 'Một đáp án đúng',
  },
  "20MUL": {
    icon: 'bi bi-check2-all',
    colorClassName: 'bg-info',
    title: 'Nhiều đáp án đúng',
  },
  "21ODMUL": {
    icon: 'bi bi-pencil-square',
    colorClassName: 'bg-warning',
    title: 'Hoàn tất câu sau',
  },
  "22POLL": {
    icon: 'bi bi-file-earmark-bar-graph',
    colorClassName: 'bg-danger',
    title: 'Bình chọn ý kiến',
  },
  "30TEXT": {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Điền đáp án đúng',
  },
  "31ESSAY": {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Câu trả lời tự do',
  }
}

