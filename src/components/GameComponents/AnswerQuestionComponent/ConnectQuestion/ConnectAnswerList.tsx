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
  showAnswer: boolean
  didSelect?: (answer: TAnswer) => void
  disabledOption?: Set<TAnswer>
  borderOption?: Set<TAnswer>
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
    if (option.type == "21PLHDR") return '#00000000'

    if (props.displayDecor) {
      if (props.disabledOption && props.disabledOption.has(option))
        return "#cccccc"
    }
    if (!props.displayDecor) {
      let selected = (props.disabledOption && props.disabledOption.has(option))
      selected = props.showAnswer ? !selected : selected
      const alpha = (props.borderOption && props.borderOption.has(option)) ? "CC" : "66"
      const colorPostfix = (props.showAnswer ? alpha : "")
      const disabledColor = (props.showAnswer ? "#E0E0E0" : "#cccccc")
      return selected ? disabledColor : colors[idx % colors.length] + colorPostfix
    }
    return colors[idx % colors.length]
  }

  function getTextColor(option: TAnswer): string {
    if (option.type == "21PLHDR") return '#000000'
    if (!props.displayDecor && props.showAnswer) return "#ffffff"
    if (props.displayDecor) {
      if (props.disabledOption && props.disabledOption.has(option))
        return '#ffffff'
      // return option.type == "21PLHDR" ? '#000000' : '#ffffff'
    }
    return '#ffffff'
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
            style={{
              backgroundColor: getColorFor(idx, option),
              borderWidth: (props.borderOption && props.borderOption.has(option)) ? "4px" : "0"
            }}
            onClick={() => {
              if (option.type != "21PLHDR") {
                if (props.didSelect)
                  props.didSelect(option)
              }
            }}
          >
            <div className={cn(styles.word, "fw-medium")} style={{color: getTextColor(option)}}>{option.answer}</div>
          </Col>
        })
      }
    </div>
  )
}
