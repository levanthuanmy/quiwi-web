
import React, { FC, useState } from "react"
import { Col, Container, Row, Image } from "react-bootstrap"
import styles from './QuestItem.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"

type IQuestItem = {
  currentValue: number,
  targetValue: number,
  name: string,
  des: string,
  isDone: boolean
}


const QuestItem: FC<IQuestItem> = (props) => {
  const [doneState, setDoneState] = useState<boolean>(props.isDone);

  const toggleTab = (value: boolean) => {
    if (props.currentValue === props.targetValue)
      setDoneState(value);
  }

  const progress = props.currentValue / props.targetValue * 100
  console.log(progress)

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
            <div className="card-body quest-item">
              <Row>
                <Col sm={7}><h5 className={classNames("card-title", styles.fontTitle)}>{props.name}</h5>
                </Col>
                <Col sm={2}>
                  <Row>
                    <Col sm={3}>
                      <Image
                        src=
                        "https://img.freepik.com/free-vector/knight-shield-cartoon-sticker_1308-66058.jpg"
                        roundedCircle
                        width={25}
                        height={25}
                        alt="coin"
                      ></Image>
                    </Col>
                    <Col sm={7}>
                      <div>
                        x100</div></Col>
                  </Row>
                </Col>
                <Col sm={2}>
                  <Row>
                    <Col sm={3}>
                      <Image
                        src=
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsYgFkhCp0lUJBQPbI7SGr_PNkkWb-wH6ag&usqp=CAU"
                        roundedCircle
                        width={25}
                        height={25}
                        alt="coin"
                      ></Image>
                    </Col>
                    <Col sm={7}>
                      <div>
                        x100</div></Col>
                  </Row>
                </Col>

              </Row>
              <p className={classNames("card-text", styles.fontDes)}>{props.des}</p>
              <div className="progress">
                <div className={classNames("progress-bar progress-bar-striped bg-success")} role="progressbar" style={{ width: progress.toString() + "%" }}></div>
              </div>
              <p className="card-text text-end fs-20px">{props.currentValue.toString() + "/" + props.targetValue.toString()}</p>
            </div>
          </div>
        </Col>
        <Col sm={2}>
          <MyButton disabled={!(progress === 100 && !doneState)} className={classNames("w-100 text-white")} onClick={() => toggleTab(true)}>{doneState ? "Đã nhận" : progress === 100 ? "Nhận" : "Chưa xong" }</MyButton>
        </Col>
      </Row>
    </div>
  )
}

export default QuestItem