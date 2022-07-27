import React, {Component, FC} from "react";
import MyModal from "../../MyModal/MyModal";
import {useGameSession} from "../../../hooks/useGameSession/useGameSession";

type EndGameModalProps = {
  showEndGameModal: boolean
  onHide: () => void
  activeButtonCallback: () => void
}

export const EndGameModal: FC<EndGameModalProps> = (props) => {
  const gameManager = useGameSession()

  return <MyModal
    show={props.showEndGameModal}
    onHide={props.onHide}
    activeButtonTitle="Đồng ý"
    activeButtonCallback={props.activeButtonCallback}
    inActiveButtonCallback={props.onHide}
    inActiveButtonTitle="Huỷ"
  >
    <div className="text-center h3 fw-bolder">Kết thúc game?</div>

    <div className="text-center fw-bold">
      {gameManager.currentQuestion && (
        <div className="text-secondary fs-24x">
          {gameManager.currentQuestion.orderPosition + 1 <
          (gameManager.gameSession?.quiz?.questions?.length ?? 0) ? (
            <>
              {"Quiz mới hoàn thành "}
              <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.currentQuestion.orderPosition + 1}
                  </span>
              {" câu, còn "}
              <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.gameSession?.quiz?.questions?.length}
                  </span>
              {" câu chưa hoàn thành!"}
            </>
          ) : (
            <>
              {"Quiz đã hoàn thành tất cả "}
              <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.currentQuestion.orderPosition + 1}
                  </span>
              {" câu trên "}
              <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.gameSession?.quiz?.questions?.length}
                  </span>
              {" câu!"}
            </>
          )}
        </div>
      )}
      <div className="text-secondary fs-24x text-warning">
        Các thành viên trong phòng sẽ không thể chat với nhau nữa, bạn có
        chắc chắn muốn kết thúc phòng?
      </div>
    </div>
  </MyModal>;
}
