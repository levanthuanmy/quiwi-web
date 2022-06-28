import React, { FC, useState } from 'react'
import { Col, Container, Row, Image } from 'react-bootstrap'
import styles from './QuestItem.module.css'
import classNames from 'classnames'
import MyButton from '../MyButton/MyButton'
import { TQuest } from '../../types/types'
import Item from '../Item/Item'
import { get, post } from '../../libs/api'
import { TApiResponse } from '../../types/types'
type IQuestItem = {
  currentValue: number
  targetValue: number
  name: string
  des: string
  isDone: boolean
}

const QuestItem: FC<{ quest: TQuest; onClick: () => void }> = ({
  quest,
  onClick,
}) => {
  // const [doneState, setDoneState] = useState<boolean>(props.isDone);

  // const toggleTab = (value: boolean) => {
  //   if (props.currentValue === props.targetValue)
  //     setDoneState(value);
  // }

  const doneQuest = async () => {
    try {
      const res: TApiResponse<string> = await post(
        `/api/quest/finish-quest/${quest.id}`,
        {},
        {},
        true
      )
      onClick()
    } catch (error) {
      // alert('Có lỗi nè')
      console.log(error)
    }
  }

  const questGoal = quest.questRequirement[0].goal
  const current = quest.userQuest[0].process
  const process = (current / questGoal) * 100

  return (
    <div>
      <Row className={classNames(' align-items-center')}>
        <Col xm={10}>
          <div className={classNames('card', styles.questItem)}>
            <div className={classNames('quest-item ', styles.cardBody)}>
              <Row className={classNames('', styles.price)}>
                <Col
                  xs={7}
                  sm={7}
                  md={8}
                  className={classNames('card-title', styles.fontTitle)}
                >
                  {quest.questTitle}
                </Col>
                <Col
                  xs={4}
                  sm={3}
                  md={3}
                  className={classNames('', styles.price)}
                >
                  <Row>
                    {quest.questGoal
                      .filter((item) => item.type === '00COIN')
                      .map((item, idx) => (
                        <Row key={idx} className={classNames('', styles.coin)}>
                          <Col xs={1} sm={1} md={1}>
                            <Image
                              alt="avatar"
                              src="/assets/quiwi-coin.png"
                              width="15"
                              height="15"
                            ></Image>
                          </Col>
                          <Col>
                            <div className="fs-16px">{item.reward.coin}</div>
                          </Col>
                        </Row>
                      ))}
                  </Row>
                </Col>
              </Row>
              {/* <p className={classNames("card-text", styles.fontDes)}>{props.props.detail}</p> */}

              <div
                className={classNames(
                  'justify-content-md-center"',
                  styles.listItem
                )}
              >
                {quest.questGoal
                  .filter((item) => item.type !== '00COIN')
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={classNames('', styles.layoutImage)}
                    >
                      <Item
                        key={idx}
                        name={item.reward.name}
                        des={item.reward.description}
                        avatar={item.reward.avatar}
                        type={item.reward.type}
                        price={item.reward.price}
                        quantity={item.reward.quantity}
                      ></Item>
                    </div>
                  ))}
              </div>

              <div className={classNames('progress', styles.progessBar)}>
                <div
                  className={classNames(
                    'progress-bar progress-bar-striped bg-success'
                  )}
                  role="progressbar"
                  style={{ width: process.toString() + '%' }}
                ></div>
              </div>
              <p className="card-text text-end fs-16px">
                {current}/{questGoal}
              </p>
            </div>
          </div>
        </Col>
        <Col sm={2} className={classNames('"', styles.button)}>
          <MyButton
            disabled={
              quest.userQuest[0].status === 'INPROGRESS' ||
              quest.userQuest[0].isReceivedReward
            }
            className={classNames('w-100 text-white ')}
            onClick={() => doneQuest()}
          >
            {quest.userQuest[0].isReceivedReward ? 'Đã xong' : 'Nhận'}
          </MyButton>
        </Col>
      </Row>
    </div>
  )
}

export default QuestItem
