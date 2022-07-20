import classNames from 'classnames'
import { FC } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { post } from '../../libs/api'
import { TApiResponse, TQuest } from '../../types/types'
import Item from '../Item/Item'
import MyButton from '../MyButton/MyButton'
import styles from './QuestItem.module.css'
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

  const questGoal = quest.questRequirement[quest.questRequirement.length - 1].goal
  const current = quest.userQuest[0].process
  const process = (current / questGoal) * 100

  return (
    <Row
      className={classNames(
        'justify-content-center mx-auto align-items-center'
      )}
    >
      <Col xm={10}>
        <div className={classNames('card ', styles.questItem)}>
          <div className={classNames('quest-item px-3 py-2')}>
            <Row className="justify-content-between">
              <Col xs={8} lg={9}>
                <Row className={classNames('mb-2', styles.price)}>
                  <div className={classNames('card-title', styles.fontTitle)}>
                    {quest.questTitle}
                  </div>
                </Row>
                <Row>
                  <div>
                    <div className={classNames('progress', styles.progessBar)}>
                      <div
                        className={classNames(
                          'progress-bar progress-bar-striped bg-success'
                        )}
                        role="progressbar"
                        style={{ width: process.toString() + '%' }}
                      ></div>
                    </div>
                    <div className="card-text text-end fs-16px">
                      {current}/{questGoal}
                    </div>
                  </div>
                </Row>
              </Col>

              <Col className="d-flex flex-column justify-content-center align-items-end">
                <div className={classNames('d-flex align-items-center ')}>
                  <Image
                    alt="coin"
                    src="/assets/quiwi-coin.png"
                    width="16"
                    height="16"
                  ></Image>
                  <div className="ms-1">{quest.coin}</div>
                </div>
                <div
                  className={classNames(
                    'd-flex justify-content-md-center"',
                    styles.listItem
                  )}
                >
                  {quest.questGoal
                    .filter((item) => item.type !== '00COIN')
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className={classNames('mt-2', styles.layoutImage)}
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
              </Col>
            </Row>

            {/* <p className={classNames("card-text", styles.fontDes)}>{props.props.detail}</p> */}
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
  )
}

export default QuestItem
