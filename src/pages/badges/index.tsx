import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import CardBadge from '../../components/CardBadge/CardBadge'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ModalBadge from '../../components/ModalBadge/ModalBadge'
import QuestItem from '../../components/QuestItem/QuestItem'

const BadgesPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(1)
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)

  return (
    <DashboardLayout>
      <div className="w-100">
        <Row
          className="justify-content-md-center"
          style={{ paddingBottom: '30px' }}
        >
          <Col sm={8}>
            <nav className="nav flex-column flex-sm-row ">
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 1,
                    'tab-with-green': toggleState !== 1,
                  }
                )}
                onClick={() => setToggleState(1)}
              >
                Đã sở hữu
              </a>
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 2,
                    'tab-with-green': toggleState !== 2,
                  }
                )}
                onClick={() => setToggleState(2)}
              >
                Chưa sở hữu
              </a>
            </nav>
          </Col>
        </Row>

        {toggleState === 2 ? (
          <div>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={3}
                  targetValue={5}
                  name={'Top 1 thần thánh'}
                  des={'Có 5 lần đạt top 1'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={1}
                  targetValue={1}
                  name={'Top 3 thần thánh'}
                  des={'Có 1 lần đạt top 3'}
                  isDone={true}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={1}
                  targetValue={5}
                  name={'Top 2 thần thánh'}
                  des={'Có 5 lần đạt top 2'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={10}
                  targetValue={10}
                  name={'Hoàn thành 10 bài quiz'}
                  des={'Hoàn thành đầy đủ 10 bài quiz'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
          </div>
        ) : toggleState === 1 ? (
          <Row
            className="justify-content-md-center"
            style={{ paddingBottom: '17px' }}
          >
            <Col sm={9}>
              <div className={classNames('badges-list')}>
                <CardBadge
                  onClick={handleShow}
                  image={
                    'https://img.freepik.com/free-vector/knight-shield-cartoon-sticker_1308-66058.jpg'
                  }
                  title={'Khiêng chúa'}
                  description={'Dùng khiêng bảo hộ 100 lần'}
                  propgress={'100'}
                ></CardBadge>
                <CardBadge
                  onClick={handleShow}
                  image={
                    'https://cdn.imgbin.com/22/1/23/imgbin-police-officer-cartoon-police-badge-material-yellow-police-badge-art-z25Etc1QUL7BnaGV70qy0HWBv.jpg'
                  }
                  title={'Huân Chương Top 1'}
                  description={'Đạt top 1 500 lần'}
                  propgress={'60'}
                ></CardBadge>
                <CardBadge
                  onClick={handleShow}
                  image={
                    'https://freepikpsd.com/file/2019/10/cartoon-diamond-png-3-Transparent-Images.png'
                  }
                  title={'Thánh kim cương'}
                  description={'Đạt được 1000 viên kim cương'}
                  propgress={'30'}
                ></CardBadge>
                <CardBadge
                  onClick={handleShow}
                  image={
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkSN0audfR-FYWM-pnfcysnC4QBjbXucVTrA&usqp=CAU'
                  }
                  title={'Chuyên gia cày cuốc'}
                  description={
                    'Đạt top 3 trong 10 trận gần nhất không dùng vật phẩm'
                  }
                  propgress={'10'}
                ></CardBadge>
              </div>
            </Col>
          </Row>
        ) : null}
      </div>

      <Modal
        show={show}
        size="sm"
        centered
        onShow={() => setShow(true)}
        onHide={() => setShow(false)}
      >
        <ModalBadge onClose={() => setShow(false)}></ModalBadge>
      </Modal>
    </DashboardLayout>
  )
}

export default BadgesPage
