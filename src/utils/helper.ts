import dayjs from 'dayjs'
import { TAnswer, TQuestion } from '../types/types'
import { Howl } from 'howler'

export const JsonParse = (input: string | null) => {
  try {
    if (!input) return {}
    return JSON.parse(input)
  } catch (error) {
    console.log('JsonParse - error', error)
    return {}
  }
}

export const getCurrentTrueAnswer = (answers: TAnswer[]): number => {
  let numTrueAnswer = 0

  for (let answer of answers) {
    if (answer.isCorrect) {
      numTrueAnswer++
    }
  }
  return numTrueAnswer
}

export const indexingQuestionsOrderPosition = (questions: TQuestion[]) => {
  const len = questions.length
  let _q = [...questions]
  for (let i = 0; i < len; i++) {
    _q[i].orderPosition = i
  }

  return _q
}

export const resizeBase64Img = (
  base64: string,
  width: number,
  height: number
) =>
  new Promise<string>((resolve, reject) => {
    try {
      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      let context = canvas.getContext('2d')

      let img = document.createElement('img')
      img.src = base64
      img.onload = () => {
        const imgWidth = img.width
        const imgHeight = img.height
        if (imgWidth <= width && imgHeight <= height) {
          resolve(base64)
        } else {
          const scaleX = width / img.width
          const scaleY = height / img.height
          const scale = Math.min(scaleX, scaleY)
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          context?.scale(scale, scale)
          context?.drawImage(img, 0, 0)
          resolve(canvas?.toDataURL('image/jpeg', '0.7'))
        }
      }
    } catch (error) {
      console.log('resizeBase64Img - error', error)
      reject(error)
    }
  })

export const formatDate_HHmmDDMMMYYYY = (d: Date) => {
  return dayjs(d).locale('vi').format('HH:mm, DD MMMM YYYY')
}

export const formatDate_DDMMMMYYYY = (d: Date) => {
  return dayjs(d).locale('vi').format('DD MMMM YYYY')
}

export const formatDate_DDMMYYYY = (d: Date) => {
  return dayjs(d).locale('vi').format('DD-MM-YYYY')
}

export const playSound = (src: string) => {
  const sound = new Howl({
    src,
    html5: true,
  })
  sound.play()
}
export function timeSince(date: string | Date) {
  var seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' năm trước'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' tháng trước'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' ngày trước'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' giờ trước'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' phút trước'
  }
  return Math.floor(seconds) + ' giây trước'
}
