import React, { FC } from 'react'
import { Col } from 'react-bootstrap'
import styles from './ConnectAnswerList.module.css'
import { TAnswer } from '../../../../types/types'
import cn from 'classnames'
import { Dropdown } from '@restart/ui'
import displayName = Dropdown.displayName

type TextAnswerListProps = {
  className?: string
  options: TAnswer[]
  disabledOption?: Set<TAnswer>
  userSelectedOptions?: TAnswer[]
  displayDecor: boolean
  showAnswer: boolean
  didSelect?: (answer: TAnswer) => void
}

export const ConnectAnswerList: FC<TextAnswerListProps> = (
  props: TextAnswerListProps
) => {
  const colors: string[] = [
    '#E86262',
    '#EF154A',
    '#EF6415',
    '#A9C77E',
    '#B89A61',
    '#AB89A6',
  ]

  function getColorWithDecor(
    idx: number,
    option: TAnswer,
    showLineThrough: boolean
  ): string {
    try {
      if (option.type == '21PLHDR') return '#00000000'
      let highlight = !(
        props.disabledOption && props.disabledOption.has(option)
      )
      if (
        props.userSelectedOptions &&
        props.userSelectedOptions[idx]?.answer != option.answer
      )
        highlight = false
      if (
        showLineThrough &&
        props.userSelectedOptions &&
        props.userSelectedOptions[idx] &&
        (props.userSelectedOptions[idx].id ?? -1) >= 0
      )
        return '#f4f0e7'
      return highlight ? colors[idx % colors.length] : '#efefef'
    } catch (error) {
      console.log('getColorWithDecor - error', error)
      return '#f4f0e7'
    }
  }

  function getColorWithoutDecor(idx: number, option: TAnswer): string {
    const colorPostfix = props.showAnswer ? '66' : ''
    let highlight = !(props.disabledOption && props.disabledOption.has(option))
    if (props.showAnswer) highlight = !highlight
    return highlight ? colors[idx % colors.length] : '#E0E0E0'
  }

  function getColorFor(
    idx: number,
    option: TAnswer,
    showLineThrough: boolean
  ): string {
    return props.displayDecor
      ? getColorWithDecor(idx, option, showLineThrough)
      : getColorWithoutDecor(idx, option)
  }

  function getTextColor(option: TAnswer): string {
    if (option.type == '21PLHDR') return '#000000'
    return '#ffffff'
  }

  return (
    <div
      className={`d-flex flex-wrap ${styles.playerList} customScrollbar ${props.className}`}
    >
      {props.options.map((option, idx) => {
        function showLineThrough(): boolean {
          return (
            (props.showAnswer &&
              props.displayDecor &&
              props.userSelectedOptions &&
              props.userSelectedOptions[idx].answer != option.answer) ??
            false
          )
        }

        return (
          <Col
            key={idx}
            className={cn(
              `d-flex align-items-center col-auto`,
              styles.answer,
              !props.showAnswer ? 'cursor-pointer' : ''
            )}
            style={{
              backgroundColor: getColorFor(idx, option, showLineThrough()),
            }}
            onClick={() => {
              if (option.type != '21PLHDR') {
                if (props.didSelect) props.didSelect(option)
              }
            }}
          >
            <div
              className={cn(styles.word, 'fw-medium user-select-none', {
                'cursor-pointer': !props.showAnswer,
                'px-2': option.type !== '21PLHDR',
              })}
              style={{ color: getTextColor(option) }}
            >
              {showLineThrough() ? (
                <>
                  {props.userSelectedOptions &&
                    props.userSelectedOptions[idx] &&
                    (props.userSelectedOptions[idx].id ?? -1) >= 0 && (
                      <>
                        <span
                          className={
                            'text-decoration-line-through text-warning'
                          }
                        >
                          {props.userSelectedOptions?.[idx].answer}
                        </span>
                        {' - '}
                      </>
                    )}
                  <span className={'text-success'}>{option.answer}</span>
                </>
              ) : (
                option.answer
              )}
            </div>
          </Col>
        )
      })}
    </div>
  )
}
