import React, {FC} from 'react'
import {Col} from "react-bootstrap";
import styles from "./ConnectAnswerList.module.css"
import {TAnswer} from "../../../../types/types";
import cn from "classnames";
import {Dropdown} from "@restart/ui";
import displayName = Dropdown.displayName;

type TextAnswerListProps = {
  className?: string
  options: TAnswer[]
  displayDecor: boolean
  didSelect?: (answer: TAnswer) => void
}

export const ConnectAnswerList: FC<TextAnswerListProps> = (props: TextAnswerListProps) => {

  const colors: string[] = [
    '#E86262',
    '#EF154A',
    '#EF6415',
    '#A9C77E',
    '#B89A61',
    '#AB89A6',
  ]

  function getColorFor(idx: number, option: TAnswer): string {
    return option.type == "21PLHDR" ? '#00000000' : colors[idx % colors.length]
  }

  function getTextColor(option: TAnswer): string {
    return option.type == "21PLHDR" ? '#000000' : '#ffffff'
  }
  return (
    <div className={`d-flex flex-wrap ${styles.playerList} customScrollbar ${props.className}`}>
      {
        // chỉ hiển thị mấy type khác placeholder
        props.options.filter(i => (i.type != "21PLHDR") || props.displayDecor).map((option, idx) => {
          return <Col
            key={idx}
            className={cn(`d-flex align-items-center col-auto`,
              styles.answer,
              props.displayDecor ? styles.selected : styles.selection)}
            style={{backgroundColor: getColorFor(idx, option)}}
            onClick={() => {
              if (!props.displayDecor && option.id) {
                if (props.didSelect)
                  props.didSelect(option)
              }
            }}
          >
            <div className={cn(styles.word, "fw-medium")} style={{color:getTextColor(option)}}>{option.answer}</div>
          </Col>
        })
      }
    </div>
  )
}
