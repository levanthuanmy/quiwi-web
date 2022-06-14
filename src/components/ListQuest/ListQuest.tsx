import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useRef, useState, useEffect } from 'react'
import { Col, Container, Row, Modal } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TQuest, TPaginationResponse } from '../../types/types'
import styles from './ListQuest.module.css'
import SearchBar from '../SearchBar/SearchBar'
import { forEach } from 'lodash'
import MyModal from '../MyModal/MyModal'

const ListQuest: NextPage = () => {
    const [toggleState, setToggleState] = useState<number>(0)
    const [itemsResponse, setItemsResponse] =
        useState<TPaginationResponse<TQuest>>()
    const [doneQuests, setDoneQuests] = useState<TQuest[]>()
    const [inProgressQuests, setInProgressQuests] = useState<TQuest[]>()
    const authContext = useAuth()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const onShowDialog = () => {
        setShowDialog(true)
        getItemCategories()
    }

    const getItemCategories = async () => {
        if (authContext !== undefined) {
            let currentUserId = authContext.getUser()?.id || null
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
                }

                const res: TApiResponse<TPaginationResponse<TQuest>> = await get(
                    `/api/quest/all`,
                    true,
                    popularParams
                )
                if (res.response) {
                    let iDoneQuests: TQuest[] = []
                    let iInProgressQuests: TQuest[] = []
                    setItemsResponse(res.response)
                    res.response.items.forEach((element) => {
                        if (element.userQuest[0].isReceivedReward)
                            iDoneQuests.push(element)
                        else
                            iInProgressQuests.push(element)
                    })
                    setDoneQuests(iDoneQuests)
                    setInProgressQuests(iInProgressQuests)

                }
            } catch (error) {
                alert('Có lỗi nè')
                console.log(error)
            }
        }
    }
    useEffect(() => {
        

        getItemCategories()
        // if (!itemsResponse){
        //   getItems()
        // }
    }, [])

    const tabOptions = [
        'Nhiệm vụ đang làm',
        'Nhiệm vụ đã hoàn thành',
        'Nhiệm vụ tháng',
        'Nhiệm vụ đặc biệt',
    ]

    return (
        <DashboardLayout>
            <Container fluid="lg" className={classNames("p-3", styles.disableScroll)}>
                <div className="" >
                    <MyTabBar
                        currentTab={toggleState}
                        setCurrentTab={setToggleState}
                        tabs={tabOptions}
                    />
                    <Row className={classNames("justify-content-center", styles.searchBar)}>
                        <Col xs={12} sm={12} md={8}>
                            <SearchBar
                                pageUrl="quests"
                                inputClassName="border border-primary"
                            />
                        </Col>

                    </Row>
                    <Row
                        className={classNames("justify-content-center m-0 my-4", styles.board)}
                    >
                        <Col xs={12} sm={12} md={8} className={classNames("", styles.ListQuest)} >
                            {toggleState === 0 ? (
                                <>
                                    {inProgressQuests?.map((item, idx) => (
                                        <Col key={idx} className="p-0 mb-3">
                                            <QuestItem quest={item} onClick={() => onShowDialog()}></QuestItem>
                                        </Col>
                                    ))}
                                </>
                            ) : toggleState === 1 ? (
                                <>
                                    {doneQuests?.map((item, idx) => (
                                        <Col key={idx} className="p-0 mb-3">
                                            <QuestItem quest={item} onClick={() => onShowDialog()}></QuestItem>
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
                    header={<Modal.Title className={'text-primary'}>Xác nhận</Modal.Title>}
                >
                    <div className="text-center fw-medium">
                        Chúc mừng bạn đã hoàn thành nhiệm vụ{' '}
                    </div>
                </MyModal>
            </Container>
        </DashboardLayout>

    )
}

export default ListQuest
