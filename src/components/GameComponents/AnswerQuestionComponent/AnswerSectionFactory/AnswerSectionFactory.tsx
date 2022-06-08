import React from "react";
import MultipleChoiceAnswerSection from "../SelectionQuestion/MultipleChoiceAnswerSection";
import SingleChoiceAnswerSection from "../SelectionQuestion/SingleChoiceAnswerSection";
import {TQuestionType, TQuestion} from "../../../../types/types";
import TextQuestion from "../TextQuestion/TextQuestion";
import ConnectQuestion from "../ConnectQuestion/ConnectQuestion";

export class AnswerSectionFactory {
  isHost: boolean;
  // countDown: number;
  answerLayout: string;
  // question: TQuestion;
  isSubmitted: boolean;

  constructor(
    isHost: boolean,
    // countDown: number,
    answerLayout: string,
    // question: TQuestion,
    isSubmitted: boolean
  ) {
    this.isHost = isHost
    // this.countDown = countDown;
    this.answerLayout = answerLayout;
    // this.question = question;
    this.isSubmitted = isSubmitted;
  }


  // static initAnswerSectionForHost(questionType: QuestionType): JSX.Element {
// }


  public initAnswerSectionForType(questionType: TQuestionType,
                                  countDown: number,
                                  question: TQuestion,
                                  // isSubmitted: boolean,
                                  handleSubmitAnswer: (answer: any) => void): JSX.Element {
    switch (questionType) {
      case "10SG":
        return this.initSingleAnswer(countDown, question, handleSubmitAnswer);
      case "20MUL":
        return this.initMultipleAnswer(countDown, question, handleSubmitAnswer);
      case "21ODMUL":
        return this.initConnectAnswer(countDown, question, handleSubmitAnswer);
      case "30TEXT":
        return this.initTextAnswer(countDown, question, handleSubmitAnswer);
      case "31ESSAY":
        return this.initTextAnswer(countDown, question, handleSubmitAnswer);
    }
  }

  protected initSingleAnswer(countDown: number,
                             question: TQuestion,
                             handleSubmitAnswer: (answer: any) => void): JSX.Element {
    return <SingleChoiceAnswerSection
      socketSubmit={handleSubmitAnswer}
      className={this.answerLayout}
      option={question}
      showAnswer={countDown <= 0 && countDown > -100}
      isHost={this.isHost}
      isSubmitted={this.isSubmitted}
    />
  }

  protected initMultipleAnswer(countDown: number,
                               question: TQuestion,
                               submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <MultipleChoiceAnswerSection
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      option={question}
      showAnswer={countDown <= 0 && countDown > -100}
      isHost={this.isHost}
      isTimeOut={countDown <= 1 && countDown > -100}
      isSubmitted={this.isSubmitted}
    />
  }

  protected initTextAnswer(countDown: number,
                           question: TQuestion,
                           submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <TextQuestion
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      question={question}
      showAnswer={countDown <= 0 && countDown > -100}
      isHost={this.isHost}
      isTimeOut={countDown <= 2 && countDown > -100}
      isSubmitted={this.isSubmitted}
    />
  }

  protected initConnectAnswer(countDown: number,
                           question: TQuestion,
                           submitAnswerHandle: (answer: any) => void): JSX.Element {
    return <ConnectQuestion
      socketSubmit={submitAnswerHandle}
      className={this.answerLayout}
      question={question}
      showAnswer={countDown <= 0 && countDown > -100}
      isHost={this.isHost}
      isTimeOut={countDown <= 2 && countDown > -100}
      isSubmitted={this.isSubmitted}
    />
  }
}

