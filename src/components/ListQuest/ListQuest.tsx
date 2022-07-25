import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuest } from '../../types/types'
import MyModal from '../MyModal/MyModal'
import SearchBar from '../SearchBar/SearchBar'
import styles from './ListQuest.module.css'

const ListQuest: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(0)
  const router = useRouter()
  const { q } = router.query

  const [doneQuests, setDoneQuests] = useState<TQuest[]>()
  const [inProgressQuests, setInProgressQuests] = useState<TQuest[]>()
  const authContext = useAuth()
  const user = authContext.getUser()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const onShowDialog = () => {
    setShowDialog(true)
    getItemCategories()
  }

  const getItemCategories = async () => {
    if (user) {
      let currentUserId = user.id
      try {
        const popularParams = {
          filter: {
            relations: ['questRequirement', 'questGoal', 'userQuest'],

            where: {
              userQuest: {
                userId: currentUserId,
              },
            },
          },
          q,
        }

        const res: TApiResponse<TPaginationResponse<TQuest>> = await get(
          `/api/quest/all`,
          true,
          popularParams
        )
        if (res.response) {
          let iDoneQuests: TQuest[] = []
          let iInProgressQuests: TQuest[] = []
          // setItemsResponse(res.response)
          res.response.items.forEach((element) => {
            if (element.userQuest[0].isReceivedReward) iDoneQuests.push(element)
            else iInProgressQuests.push(element)
          })
          setDoneQuests(iDoneQuests)
          setInProgressQuests(iInProgressQuests)
        }
      } catch (error) {
        // alert('Có lỗi nè')
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getItemCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, q])

  const tabOptions = [
    'Nhiệm vụ đang làm',
    'Nhiệm vụ đã hoàn thành',
    'Nhiệm vụ tháng',
    'Nhiệm vụ đặc biệt',
  ]

  return (
    <DashboardLayout>
      <Container fluid="lg" className={classNames('p-3', styles.disableScroll)}>
        <Row className="my-0 justify-content-between">
          <Col
            xs={12}
            lg={3}
            xxl={2}
            className="fs-22px mb-2 mb-lg-0 fw-medium"
          >
            <h1>Nhiệm vụ</h1>
          </Col>
          <Col>
            <SearchBar
              pageUrl="quests"
              inputClassName="border border-primary mb-3"
            />
          </Col>
        </Row>

        <div className="">
          <MyTabBar
            currentTab={toggleState}
            setCurrentTab={setToggleState}
            tabs={tabOptions}
          />
          <Row
            className={classNames(
              'justify-content-center m-0 my-4',
              styles.board
            )}
          >
            <Col
              xs={12}
              md={10}
              lg={8}
              className={classNames('p-2', styles.ListQuest)}
            >
              {toggleState === 0 ? (
                <>
                  {inProgressQuests?.map((item, idx) => (
                    <Col key={idx} className="p-0 mb-3">
                      <QuestItem
                        quest={item}
                        onClick={() => onShowDialog()}
                      ></QuestItem>
                    </Col>
                  ))}
                </>
              ) : toggleState === 1 ? (
                <>
                  {doneQuests?.map((item, idx) => (
                    <Col key={idx} className="p-0 mb-3">
                      <QuestItem
                        quest={item}
                        onClick={() => onShowDialog()}
                      ></QuestItem>
                    </Col>
                  ))}
                </>
              ) : null}
            </Col>
          </Row>
        </div>
        <MyModal
          show={showDialog}
          onHide={() => {
            setShowDialog(false)
          }}
          activeButtonTitle="Xác nhận"
          activeButtonCallback={() => {
            setShowDialog(false)
          }}
          size="sm"
          header={
            <Modal.Title className={'text-primary'}>Xác nhận</Modal.Title>
          }
        >
          <div className="text-center fw-medium">
            Chúc mừng bạn đã hoàn thành nhiệm vụ
          </div>
        </MyModal>
      </Container>
    </DashboardLayout>
  )
}

export default ListQuest
