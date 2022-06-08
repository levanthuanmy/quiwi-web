import React, {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./ConnectQuestion.module.css"
import classNames from "classnames";
import {ConnectAnswerList} from "./ConnectAnswerList";
import {getEmptyImage} from "react-dnd-html5-backend";
import {func} from "prop-types";

type ConnectQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  question?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
}
const correctColor = "#0082BE"
const incorrectColor = "#cccccc"

const ConnectQuestion: FC<ConnectQuestionProps> = ({
                                                     className,
                                                     socketSubmit,
                                                     question,
                                                     showAnswer,
                                                     isHost,
                                                     isTimeOut,
                                                     isSubmitted,
                                                   }) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [options, setOptions] = useState<TAnswer[]>([])

  const [selectedAnswerSet, setSelectedAnswerSet] = useState<Set<TAnswer>>(new Set<TAnswer>())
  const [wrongAnswerSet, setWrongAnswerSet] = useState<Set<TAnswer>>(new Set<TAnswer>())
  const [correctAnswerSet, setCorrectAnswerSet] = useState<Set<TAnswer>>(new Set<TAnswer>())


  const defaultPlaceHolder = useRef<string>("     ")

  const [displayAnswer, setDisplayAnswer] = useState<TAnswer[]>([])
  const [orderedCorrectAnswer, setOrderedCorrectAnswer] = useState<TAnswer[]>([])

  useEffect(() => {
    prepareData()
  }, []);

  useEffect(() => {
    prepareData()
  }, [question]);

  function prepareData() {
    if (question?.questionAnswers) {
      //Lựa chọn để click
      setOptions([...question.questionAnswers.filter(item => item.type != "21PLHDR")])

      // Danh sách hiển thị
      let orderedAnswer = question.questionAnswers.filter(item => item.isCorrect)
        .sort(function (a, b) {
          return a.orderPosition - b.orderPosition
        })

      let maxLength = 5
      for (const answer of question.questionAnswers) {
        if (answer.answer.length > maxLength) {
          maxLength = answer.answer.length
        }
      }

      defaultPlaceHolder.current = Array(maxLength).fill("_").join("")
      setOrderedCorrectAnswer(orderedAnswer)
      let displayList = orderedAnswer.map((answer) => {
        return (answer.type != "21PLHDR" ? getPlaceHolderAnswer(defaultPlaceHolder.current) : answer)
      })

      setWrongAnswerSet(new Set())
      setCorrectAnswerSet(new Set())
      setDisplayAnswer([...displayList])
    }
  }

  useEffect(() => {
    if (!isHost && isTimeOut && !isSubmitted) {
      const answerList = displayAnswer.map<number>((answer) => Number(answer.id))
      console.log("=>(ConnectQuestion) submit answerList", answerList);
      socketSubmit(answerList)
    }
    if (isTimeOut) {
      setIsCorrect(checkAnswer())
    }
  }, [isTimeOut]);

  const checkAnswer = (): boolean => {
    const wrongAnswerArray: TAnswer[] = []
    const correctAnswerArray: TAnswer[] = []

    if (isHost) {
      setWrongAnswerSet(new Set([]))
      setCorrectAnswerSet(new Set(orderedCorrectAnswer.filter(answer => answer.type != "21PLHDR")))
      setSelectedAnswerSet(new Set(orderedCorrectAnswer.filter(answer => answer.type != "21PLHDR")))
      setDisplayAnswer(orderedCorrectAnswer)
      return true
    }

    for (let i = 0; i < displayAnswer.length; i++) {
      console.log("=>(ConnectQuestion.tsx:91) dp cr", displayAnswer[i].id, orderedCorrectAnswer[i].id);
      if ((displayAnswer[i].id == -1 || displayAnswer[i].id != orderedCorrectAnswer[i].id)
        && orderedCorrectAnswer[i].type != "21PLHDR") {
        console.log("=>(ConnectQuestion.tsx:92) wrong", orderedCorrectAnswer[i].answer);
        wrongAnswerArray.push(orderedCorrectAnswer[i])
      } else {
        correctAnswerArray.push(orderedCorrectAnswer[i])
      }
    }
    setWrongAnswerSet(new Set(wrongAnswerArray))
    setCorrectAnswerSet(new Set(correctAnswerArray))
    setDisplayAnswer(orderedCorrectAnswer)

    return (correctAnswerArray.length == orderedCorrectAnswer.length)
  }

  const getBackgroundColorForAnswer = (): string => {
    if (isTimeOut && !isHost) {
      return isCorrect ? correctColor : incorrectColor
    }
    return correctColor
  }

  function getPlaceHolderAnswer(placeHolder:string): TAnswer {
    console.log("=>(ConnectQuestion.tsx:84) placeHolder", placeHolder,"placeHolder");
    return {
      id: -1,
      answer: placeHolder
    } as TAnswer
  }

  const didClickWord = (answer: TAnswer) => {
    if (isHost) return;
    if (isTimeOut || isSubmitted) return;
    const insertList: TAnswer[] = displayAnswer

    for (let i = 0; i < insertList.length; i++) {
      if (insertList[i].id == answer.id
        && insertList[i].orderPosition == answer.orderPosition
        && insertList[i].type != "21PLHDR") {
        insertList[i] = getPlaceHolderAnswer(defaultPlaceHolder.current)
        console.log("=>(ConnectQuestion.tsx:109) remove i insertAnswer[i]", i, insertList[i]);
        setSelectedAnswerSet(new Set(insertList))
        setDisplayAnswer([...insertList])
        return;
      }

    }

    for (let i = 0; i < insertList.length; i++) {
      if (insertList[i].id == -1 && insertList[i].type != "21PLHDR") {
        insertList[i] = answer
        console.log("=>(ConnectQuestion.tsx:109) insert i insertAnswer[i]", i, insertList[i]);
        setSelectedAnswerSet(new Set(insertList))
        setDisplayAnswer([...insertList])
        return;
      }
    }

  }

  return (
    <div
      style={{
        background: getBackgroundColorForAnswer(),
        transition: "all .5s ease",
        WebkitTransition: "all .5s ease",
        MozTransition: "all .5s ease"
      }}
      className={classNames(
        'd-flex flex-column align-items-center ', //justify-content-center
        styles.container,
      )}
    >
      <div className={`d-flex flex-column bg-white justify-content-around w-100 customScrollbar ${styles.selectedBox}`}>
        <ConnectAnswerList
          className={styles.selectedOption}
          options={displayAnswer}
          disabledOption={wrongAnswerSet}
          displayDecor={true}
          showAnswer={isTimeOut || isSubmitted}
          didSelect={didClickWord}
        />
      </div>

      <div
        className={`d-flex flex-column justify-content-around w-100 customScrollbar ${styles.selectionBox}`}>
        <ConnectAnswerList
          className={styles.availableOption}
          disabledOption={selectedAnswerSet}
          options={options}
          showAnswer={isTimeOut || isSubmitted}
          displayDecor={false}
          didSelect={didClickWord}
          borderOption={correctAnswerSet}
        />
      </div>
    </div>
  )
}

export default ConnectQuestion
