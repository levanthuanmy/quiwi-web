
import React, { FC } from "react"
import { Col, Container, Row } from "react-bootstrap"
import styles from './QuestItem.module.css'
import classNames from 'classnames'
import MyButton from "../MyButton/MyButton"

const QuestItem: FC = () => {
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
              <h5 className={classNames("card-title", styles.fontTitle)}>Top 1 thần thánh</h5>
              <p className={classNames("card-text", styles.fontDes)}>Có 5 lần đạt top 1</p>
              <div className="progress">
                <div className={classNames("progress-bar progress-bar-striped bg-success")} role="progressbar" style={{ width: "40%" }}></div>
              </div>
              <p className="card-text text-end fs-20px">2/5</p>
            </div>
          </div>
        </Col>
        <Col sm={2}>
          <MyButton className="w-100 text-white ">Nhận</MyButton>
        </Col>
      </Row>
    </div>
  )
}

export default QuestItem