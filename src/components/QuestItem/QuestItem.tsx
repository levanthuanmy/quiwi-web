
import React, { FC, useState } from "react"
import { Col, Container, Row, Image } from "react-bootstrap"
import styles from './QuestItem.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"
import { TQuest } from '../../types/types'
import Item from '../Item/Item'
import { get, post } from '../../libs/api'
import {
  TApiResponse
} from '../../types/types'
type IQuestItem = {
  currentValue: number,
  targetValue: number,
  name: string,
  des: string,
  isDone: boolean
}


const QuestItem: FC<{ quest: TQuest }> = ({quest}) => {
  // const [doneState, setDoneState] = useState<boolean>(props.isDone);

  // const toggleTab = (value: boolean) => {
  //   if (props.currentValue === props.targetValue)
  //     setDoneState(value);
  // }

  const doneQuest = async () => {
    const res: TApiResponse<string> = await post(
      `/api/quest/finish-quest/${quest.id}`,
      {},
        {},
        true
    )
    console.log(res.message)
  }


  return (
    <div>
      <Row className={classNames(
        " align-items-center"
      )}>
        <Col xm={10}>
          <div className={classNames(
            'card',
            styles.questItem
          )}>
            <div className={classNames('card-body quest-item ')}>
              <Row className={classNames('', styles.price)}>
                <Col sm={7}><h5 className={classNames("card-title", styles.fontTitle)}>{quest.questTitle}</h5>
                </Col>
                <Col sm={2} className={classNames("", styles.price)}>
                  <Row>

                    {quest.questGoal
                      .filter(item => item.type === "00COIN")
                      .map((item, idx) => (
                        <Row key={idx}>
                          <Col sm={1}>
                            <img alt="avatar" src="/assets/quiwi-coin.png" width="20" height="20"></img>

                          </Col>
                          <Col >
                            <div>
                              {item.reward.coin}
                            </div></Col>
                        </Row>
                      ))}
                  </Row>
                </Col>
              </Row>
              {/* <p className={classNames("card-text", styles.fontDes)}>{props.props.detail}</p> */}



              <div className={classNames('justify-content-md-center"', styles.listItem)}>
                {quest.questGoal
                  .filter(item => item.type !== "00COIN")
                  .map((item, idx) => (
                    <div key={idx} className={classNames('', styles.layoutImage)}>
                      <Item
                        key={idx}
                        name={item.reward.name}
                        des={item.reward.description}
                        avatar={item.reward.avatar}
                        type={item.reward.type}
                        price={item.reward.price}
                      ></Item>
                    </div>
                  ))}
              </div>

              <div className="progress">
                <div className={classNames("progress-bar progress-bar-striped bg-success")} role="progressbar" style={{ width: quest.userQuest[0].process.toString() + "%" }}></div>
              </div>
              <p className="card-text text-end fs-20px">{quest.userQuest[0].process.toString()}%</p>
            </div>
          </div>
        </Col>
        <Col sm={2}>
          {/* <MyButton disabled={!(progress === 100 && !doneState)} className={classNames("w-100 text-white")} onClick={() => toggleTab(true)}>{doneState ? "Đã nhận" : progress === 100 ? "Nhận" : "Chưa xong" }</MyButton> */}
          <MyButton disabled= {quest.userQuest[0].process !== 100 || quest.userQuest[0].status === "FINISH"} className={classNames("w-100 text-white ")} onClick={() =>doneQuest() } >{ quest.userQuest[0].status == "FINISH"? "Đã xong" : "Nhận"}</MyButton>
        </Col>
      </Row>
    </div>
  )
}

export default QuestItem