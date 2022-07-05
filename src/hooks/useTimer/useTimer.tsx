/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import { SOUND_EFFECT } from '../../utils/constants'
import { useSound } from '../useSound/useSound'

type TimerContextValue = {
  isCounting: boolean
  isSubmittable: boolean
  isShowSkeleton: boolean
  isShowAnswer: boolean
  setIsSubmittable: Dispatch<SetStateAction<boolean>>
  setIsShowSkeleton: Dispatch<SetStateAction<boolean>>
  setIsShowAnswer: Dispatch<SetStateAction<boolean>>
  countDown: number
  duration: number
  setDefaultDuration: (duration: number) => void
  stopCounting: (stopUI: boolean) => void
  stopCountingSound: (stopUI: boolean) => void
  startCounting: (duration: number) => void
}

export const TimerContext = React.createContext<TimerContextValue>({
  isCounting: false,
  isSubmittable: false,
  isShowSkeleton: false,
  isShowAnswer: false,
  setIsSubmittable: () => {},
  setIsShowSkeleton: () => {},
  setIsShowAnswer: () => {},
  countDown: 0,
  duration: 0,
  setDefaultDuration: (duration: number) => {},
  stopCounting: (stopUI: boolean) => {},
  stopCountingSound: (stopUI: boolean) => {},
  startCounting: (duration: number) => {},
})

// eslint-disable-next-line react/display-name
export const TimerProvider = memo(({ children }: { children?: ReactNode }) => {
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(true)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(0)
  const [duration, setDefaultDuration] = useState<number>(0)
  const [isShowSkeleton, setIsShowSkeleton] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timer | null>(null)
  const intervalRefSound = useRef<NodeJS.Timer | null>(null)

  const sound = useSound()

  const stopCounting = (stopUI: boolean) => {
    if (intervalRef && intervalRef.current) {
      if (stopUI) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsShowAnswer(true)
      }
      setIsCounting(false)

      setTimeout(() => {
        setIsSubmittable(false)
      }, 500)
    }
  }

  const stopCountingSound = (stopUI: boolean) => {    
    if (intervalRefSound && intervalRefSound.current) {
      if (stopUI) {
        clearInterval(intervalRefSound.current)
        intervalRefSound.current = null
      }

      setTimeout(() => {}, 500)
    }
  }

  const startCounting = (duration: number) => {
    console.log('=>(useTimer) duration', duration)
    if (duration > 0) {
      let endDate = new Date()
      endDate.setSeconds(endDate.getSeconds() + duration)
      let endTime = Math.round(endDate.getTime())
      setDefaultDuration(duration)
      setCountDown(duration)
      setTimeout(() => {
        setIsCounting(true)
        setIsShowSkeleton(false)
        setIsShowAnswer(false)
      }, 100)

      setTimeout(() => {
        setIsSubmittable(true)
      }, 500)

      intervalRef.current = setInterval(() => {
        let curr = Math.round(new Date().getTime())
        let _countDown = Math.ceil((endTime - curr) / 1000)
        setCountDown(_countDown)
        if (_countDown <= 0) {
          stopCounting(true)
        }
      }, 100)

      intervalRefSound.current = setInterval(() => {
        let curr = Math.round(new Date().getTime())
        let _countDown = Math.ceil((endTime - curr) / 1000)
        if (_countDown < 4) {          
          sound.playSound(SOUND_EFFECT['ONE_SECOND']);
        }
        // setCountDown(_countDown)
        if (_countDown <= 0) {
          stopCountingSound(true)
        }
      }, 1000)
    }
  }

  const _value = React.useMemo(
    () => ({
      isCounting,
      isSubmittable,
      isShowSkeleton,
      isShowAnswer,
      setIsSubmittable,
      setIsShowSkeleton,
      setIsShowAnswer,
      countDown,
      duration,
      setDefaultDuration,
      stopCounting,
      stopCountingSound,
      startCounting,
    }),
    [
      isCounting,
      isSubmittable,
      isShowSkeleton,
      isShowAnswer,
      setIsSubmittable,
      setIsShowSkeleton,
      setIsShowAnswer,
      countDown,
      duration,
      setDefaultDuration,
      stopCounting,
      stopCountingSound,
      startCounting,
    ]
  )
  return (
    <TimerContext.Provider value={_value}>{children}</TimerContext.Provider>
  )
})

export const useTimer = () => React.useContext(TimerContext)
