import React, {FC} from 'react'
import {Col} from "react-bootstrap";
import styles from "./TextAnswerList.module.css"

type TextAnswerListProps = {
  className?: string
  answers: string[]
}

const TextAnswerList: FC<TextAnswerListProps> = (props: TextAnswerListProps) => {

  const colors: string[] = [
    '#E86262',
    '#EF154A',
    '#EF6415',
    '#A9C77E',
    '#B89A61',
    '#AB89A6',
  ]

  return (
    <div className={`d-flex flex-wrap ${styles.playerList} customScrollbar ${props.className}`}>
      {
        props.answers.map((answer, idx) => {
          return <Col
            key={idx}
            className={`d-flex align-items-center col-auto ${styles.answer}`}
            style={{backgroundColor: colors[idx % colors.length]}}
          >
            <span className="px-32px py-1 fw-medium text-white">{answer}</span>
          </Col>
        })
      }
    </div>
  )
}

export default TextAnswerList
