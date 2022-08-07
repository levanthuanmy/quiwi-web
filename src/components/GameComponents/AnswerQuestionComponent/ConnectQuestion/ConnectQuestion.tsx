import classNames from 'classnames'
import {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from '../../../../types/types'
import {ConnectAnswerList} from './ConnectAnswerList'
import styles from './ConnectQuestion.module.css'

type ConnectQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  question?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
  isCounting: boolean
  isShowSkeleton: boolean
  isExam?: boolean
  initSelectedAnswer?: any
}
const correctColor = '#0082BE'
const incorrectColor = '#cccccc'

const ConnectQuestion: FC<ConnectQuestionProps> = ({
                                                     className,
                                                     socketSubmit,
                                                     question,
                                                     showAnswer,
                                                     isHost,
                                                     isTimeOut,
                                                     isSubmitted,
                                                     isCounting,
                                                     isShowSkeleton,
                                                     isExam,
                                                     initSelectedAnswer,
                                                   }) => {
  const [isPrepare, setisPrepare] = useState<boolean>(true)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [options, setOptions] = useState<TAnswer[]>([])
  const [skeletonOptions, setSkeletonOptions] = useState<TAnswer[]>([])
  const [decorOptions, setDecorOptions] = useState<TAnswer[]>([])

  const [selectedAnswerSet, setSelectedAnswerSet] = useState<Set<TAnswer>>(
    new Set<TAnswer>()
  )
  const [wrongAnswerSet, setWrongAnswerSet] = useState<Set<TAnswer>>(
    new Set<TAnswer>()
  )
  const [correctAnswerSet, setCorrectAnswerSet] = useState<Set<TAnswer>>(
    new Set<TAnswer>()
  )

  const defaultPlaceHolder = useRef<string>('     ')

  const [displayAnswer, setDisplayAnswer] = useState<TAnswer[]>([])
  const [orderedCorrectAnswer, setOrderedCorrectAnswer] = useState<TAnswer[]>(
    []
  )

  useEffect(() => {
    if (isShowSkeleton && !isExam) {
      prepareData()
    }
  }, [isShowSkeleton])

  useEffect(() => {
    if (isExam) {
      prepareData()
    }
  }, [initSelectedAnswer]);


  useEffect(() => {
    setDecorOptions(showAnswer ? orderedCorrectAnswer : displayAnswer)
  }, [showAnswer, orderedCorrectAnswer, displayAnswer])

  function shuffle(array: TAnswer[]) {
    let currentIndex = array.length - 1
    let randomIndex

    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(hash(array[currentIndex].answer)) % array.length
      currentIndex--

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    return array
  }

  function hash(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function prepareData() {
    setisPrepare(true)
    if (question?.questionAnswers) {
      //Lựa chọn để click
      const _options = shuffle([
        ...question.questionAnswers.filter((item) => item.type != '21PLHDR'),
      ])
      setOptions(_options)
      setSkeletonOptions(
        _options.map((option) =>
          getPlaceHolderAnswer(Array(option.answer.length).fill('_').join(''))
        )
      )
      // Danh sách hiển thị
      let orderedAnswer = question.questionAnswers
        .filter((item) => item.isCorrect)
        .sort(function (a, b) {
          return a.orderPosition - b.orderPosition
        })

      let maxLength = 5
      for (const answer of question.questionAnswers) {
        if (answer.answer.length > maxLength) {
          maxLength = answer.answer.length
        }
      }

      defaultPlaceHolder.current = Array(maxLength).fill('_').join('')
      setOrderedCorrectAnswer(orderedAnswer)
      let displayList = orderedAnswer.map((answer) => {
        return answer.type != '21PLHDR'
          ? getPlaceHolderAnswer(defaultPlaceHolder.current)
          : answer
      })

      setWrongAnswerSet(new Set())
      if (isHost) {
        setIsCorrect(true)
        // setCorrectAnswerSet(
        //   new Set(orderedAnswer.filter((answer) => answer.type != '21PLHDR'))
        // )
        setCorrectAnswerSet(new Set())
        setSelectedAnswerSet(
          new Set(orderedAnswer.filter((answer) => answer.type != '21PLHDR'))
        )
        if (!isExam) {
          setDisplayAnswer([...displayList])
        }
      } else if (!isExam){
        setCorrectAnswerSet(new Set())
        setDisplayAnswer([...displayList])
      }

      if (initSelectedAnswer && question && isExam) {
        let insertList: TAnswer[] = []
        if (initSelectedAnswer?.length > 0) {
          for (const i of initSelectedAnswer) {
            if (i == -1) {
              insertList.push(getPlaceHolderAnswer(defaultPlaceHolder.current));
            } else {
              const answer = question.questionAnswers.find(answer => answer.id == i)
              if (answer) {
                insertList.push(answer)
              }
            }
          }
        } else {
          insertList = displayList
        }

        console.log("=>(ConnectQuestion.tsx:180) insertList", insertList);
        setDisplayAnswer([...insertList])
        setSelectedAnswerSet(
          new Set(insertList)
        )
      }
      setisPrepare(false)
    }
  }

  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost && !isExam) {
      const answerList = displayAnswer.map<number>((answer) =>
        Number(answer.id)
      )
      socketSubmit(answerList)
    }
  }, [isCounting])

  const submitExamAnswer = (displayAnswer: TAnswer[]) => {
    // Mỹ Lê Exam
    if (isExam && !isPrepare) {
      const answerList = displayAnswer.map<number>((answer) =>
        Number(answer.id)
      )
      socketSubmit(answerList)
    }
  }

  useEffect(() => {
    if (showAnswer) isHost ? showAnswerForHost() : setIsCorrect(checkAnswer())
  }, [showAnswer])

  const showAnswerForHost = () => {
    setWrongAnswerSet(new Set())
    setIsCorrect(true)
    setCorrectAnswerSet(
      new Set(orderedCorrectAnswer.filter((answer) => answer.type != '21PLHDR'))
    )
    setSelectedAnswerSet(
      new Set(orderedCorrectAnswer.filter((answer) => answer.type != '21PLHDR'))
    )
    setDisplayAnswer(orderedCorrectAnswer)
  }

  const checkAnswer = (): boolean => {
    // console.log("=>(ConnectQuestion.tsx:97) checkAnswer");
    const wrongAnswerArray: TAnswer[] = []
    const correctAnswerArray: TAnswer[] = []

    for (let i = 0; i < displayAnswer.length; i++) {
      // console.log("=>(ConnectQuestion.tsx:91) dp cr", displayAnswer[i].id, orderedCorrectAnswer[i].id);
      if (
        (displayAnswer[i].id == -1 ||
          displayAnswer[i].answer != orderedCorrectAnswer[i].answer) &&
        orderedCorrectAnswer[i].type != '21PLHDR'
      ) {
        // console.log("=>(ConnectQuestion.tsx:92) wrong", orderedCorrectAnswer[i].answer);
        wrongAnswerArray.push(orderedCorrectAnswer[i])
      } else {
        correctAnswerArray.push(orderedCorrectAnswer[i])
      }
    }
    setWrongAnswerSet(new Set(wrongAnswerArray))
    setCorrectAnswerSet(new Set(correctAnswerArray))

    return correctAnswerArray.length == orderedCorrectAnswer.length
  }

  const getBackgroundColorForAnswer = (): string => {
    if (showAnswer && !isHost) {
      return isCorrect ? correctColor : incorrectColor
    }
    return correctColor
  }

  function getPlaceHolderAnswer(placeHolder: string): TAnswer {
    return {
      id: -1,
      answer: placeHolder,
    } as TAnswer
  }

  const didClickWord = (answer: TAnswer) => {

    if (!isExam)
      if (isHost || isTimeOut || isSubmitted) return

    const insertList: TAnswer[] = displayAnswer

    for (let i = 0; i < insertList.length; i++) {
      if (
        insertList[i].id == answer.id &&
        insertList[i].orderPosition == answer.orderPosition &&
        insertList[i].type != '21PLHDR'
      ) {
        insertList[i] = getPlaceHolderAnswer(defaultPlaceHolder.current)
        setSelectedAnswerSet(new Set(insertList))
        setDisplayAnswer([...insertList])
        submitExamAnswer([...insertList])
        return
      }
    }

    for (let i = 0; i < insertList.length; i++) {
      if (insertList[i].id == -1 && insertList[i].type != '21PLHDR') {
        insertList[i] = answer
        setSelectedAnswerSet(new Set(insertList))
        setDisplayAnswer([...insertList])
        submitExamAnswer([...insertList])
        return
      }
    }

  }

  return (
    <div
      style={{
        background: getBackgroundColorForAnswer(),
        transition: 'all .5s ease',
        WebkitTransition: 'all .5s ease',
        MozTransition: 'all .5s ease',
      }}
      className={classNames(
        'd-flex flex-column align-items-center ', //justify-content-center
        styles.container
      )}
    >
      <div
        className={`d-flex flex-column bg-white justify-content-around w-100 customScrollbar ${styles.selectedBox}`}
      >
        <ConnectAnswerList
          className={styles.selectedOption}
          options={decorOptions}
          disabledOption={wrongAnswerSet}
          userSelectedOptions={displayAnswer}
          displayDecor={true}
          showAnswer={showAnswer}
          didSelect={didClickWord}
        />
      </div>

      <div
        className={`d-flex flex-column justify-content-around w-100 customScrollbar ${styles.selectionBox}`}
      >
        <ConnectAnswerList
          className={styles.availableOption}
          disabledOption={
            isHost && !showAnswer && !isExam ? new Set([]) : selectedAnswerSet
          }
          options={isShowSkeleton ? skeletonOptions : options}
          showAnswer={showAnswer}
          displayDecor={false}
          didSelect={didClickWord}
        />
      </div>
    </div>
  )
}

export default ConnectQuestion
