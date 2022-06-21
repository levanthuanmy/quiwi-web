import { FC, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import CardBadge from '../../components/CardBadge/CardBadge'
import ModalBadge from '../../components/ModalBadge/ModalBadge'
import { TUserBadge } from '../../types/types'

const BadgesPage: FC<{
  userBadges: TUserBadge[]
}> = ({ userBadges }) => {
  const [show, setShow] = useState(false)
  const handleShow = (idx: number) => {
    setIndexChosen(idx)
    setShow(true)
  }
  const [indexChosen, setIndexChosen] = useState<number>(0)

  return (
    userBadges && (
      <>
        <div className="w-100">
          <Row>
            {userBadges?.map((userBadge, idx) => {
              const goals =
                userBadge?.badge?.badgeRequirements?.reduce(
                  (previousValue, currentValue) =>
                    previousValue + currentValue.goal,
                  0
                ) || 1
              const progress = userBadge.process / goals
              console.log('==== ~ {userBadges?.map ~ progress', progress)

              return (
                <Col
                  key={idx}
                  xs="12"
                  sm="6"
                  md="4"
                  lg="6"
                  xl="4"
                  className="pb-4"
                >
                  <CardBadge
                    onClick={() => handleShow(idx)}
                    image={userBadge.badge.picture || ''}
                    title={userBadge.badge.title}
                    description={userBadge.badge.description}
                    progress={progress.toFixed(2)}
                  />
                </Col>
              )
            })}
          </Row>
        </div>

        <Modal
          show={show}
          size="sm"
          centered
          onShow={() => setShow(true)}
          onHide={() => setShow(false)}
        >
          <ModalBadge
            userBadge={userBadges[indexChosen]}
            onClose={() => setShow(false)}
          ></ModalBadge>
        </Modal>
      </>
    )
  )
}

export default BadgesPage
