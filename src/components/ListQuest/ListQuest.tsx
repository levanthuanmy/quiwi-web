import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useRef, useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TQuest, TPaginationResponse } from '../../types/types'
import styles from './ListQuest.module.css'
import SearchBar from '../SearchBar/SearchBar'

const ListQuest: NextPage = () => {
    const [toggleState, setToggleState] = useState<number>(0)
    const [itemsResponse, setItemsResponse] =
        useState<TPaginationResponse<TQuest>>()
    const authContext = useAuth()
    useEffect(() => {
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
                        console.log('ÁDAS')
                        console.log(res.response)
                        setItemsResponse(res.response)
                        console.log(itemsResponse)
                    }
                } catch (error) {
                    alert('Có lỗi nè')
                    console.log(error)
                }
            }
        }

        getItemCategories()
        // if (!itemsResponse){
        //   getItems()
        // }
    }, [])

    const tabOptions = [
        'Nhiệm vụ ngày',
        'Nhiệm vụ tuần',
        'Nhiệm vụ tháng',
        'Nhiệm vụ đặc biệt',
    ]

    const listInnerRef = useRef();

    const onScroll2 = () => {

        console.log('ADSSADSADSA')
    };

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
                        <Col xs={8}>
                            <SearchBar
                                pageUrl="quests"
                                inputClassName="border border-primary"
                            />
                        </Col>

                    </Row>
                    <Row
                        className={classNames("justify-content-center m-0 my-4", styles.board)}
                    >
                        <Col xs={12} sm={12} md={9}  className={classNames("", styles.ListQuest)} >
                            {toggleState === 0 ? (
                                <>
                                    {itemsResponse?.items?.map((item, idx) => (
                                        <Col key={idx} className="p-0 mb-3">
                                            <QuestItem quest={item}></QuestItem>
                                        </Col>
                                    ))}
                                </>
                            ) : toggleState === 2 ? (
                                <></>
                            ) : null}
                        </Col>
                    </Row>
                </div>
            </Container>
        </DashboardLayout>
    )
}

export default ListQuest
