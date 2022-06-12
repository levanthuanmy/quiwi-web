import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TQuest, TPaginationResponse } from '../../types/types'
import ListQuest from '../../components/ListQuest/ListQuest'

const QuestPage: NextPage = () => {
  return (
    <ListQuest></ListQuest>
  )
}

export default QuestPage
