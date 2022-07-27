import classNames from "classnames";
import cn from "classnames";
import {Image} from "react-bootstrap";
import React, {FC} from "react";
import {useUser} from "../../../hooks/useUser/useUser";
import useScreenSize from "../../../hooks/useScreenSize/useScreenSize";
import {useGameSession} from "../../../hooks/useGameSession/useGameSession";
import {TViewResult} from "../../../types/types";

type QuestionNameProps = {
  viewResultData: TViewResult | undefined
}

export const UserAndProcessInfo: FC<QuestionNameProps> = (props) => {
  const user = useUser()
  const gameManager = useGameSession()
  const {fromMedium, isMobile} = useScreenSize()

  const currentPlayerRankingIndex = gameManager.gameSession?.players.findIndex(
    (item) => item.nickname === props.viewResultData?.player?.nickname
  ) ?? -1

  return (
    <div
      className={classNames(
        'd-flex flex bg-dark bg-opacity-50 rounded-10px shadow mb-2', {"gap-5 py-2": fromMedium, "py-1": isMobile}
      )}
    >
      <div className={cn("px-2 d-flex align-items-center", {"gap-3": fromMedium})}>
        {isMobile ? (
          user?.avatar ?
            <Image
              src={`${user?.avatar ?? "/assets/default-avatar.png"}`}
              width={40}
              height={40}
              className="rounded-circle"
              alt=""
            />
            :
            <div className="fw-medium fs-20px text-white">
              {gameManager.isHost ? gameManager.gameSession?.host?.name : gameManager.player?.nickname}
            </div>
        ) : (
          <>
            <Image
              src={`${user?.avatar ?? "/assets/default-avatar.png"}`}
              width={40}
              height={40}
              className="rounded-circle"
              alt=""
            />
            <div className="fw-medium fs-20px text-white">
              {gameManager.isHost ? gameManager.gameSession?.host?.name : gameManager.player?.nickname}
            </div>
          </>
        )}
      </div>
      <div
        className={cn("flex-grow-1 h-100 px-2 text-white d-flex align-items-center justify-content-between", {"gap-3": fromMedium})}>
        {gameManager.currentQuestion && gameManager.isHost ? (
          <div
            id="questionProgressBar"
            className="flex-grow-1 bg-secondary rounded-pill"
            style={{height: 6}}
          >
            <div
              className="bg-primary h-100 rounded-pill transition-all-150ms position-relative"
              style={{
                width: `${Math.floor(
                  ((gameManager.currentQuestion.orderPosition + 1) * 100) /
                  Number(gameManager.gameSession?.quiz?.questions?.length)
                )}%`,
              }}
            />
          </div>
        ) : (
          <>
            <div className="fs-4">
              <span className="me-2">🔥</span>
              {props.viewResultData?.player?.currentStreak ?? 0}
            </div>
            <div className="fs-4">
              <i className="bi bi-award text-primary me-2 "/>
              {currentPlayerRankingIndex > -1
                ? currentPlayerRankingIndex + 1
                : '-'}
            </div>
            <div className="fs-4">
              <span className="text-primary me-2">Điểm</span>
              {Math.floor(props.viewResultData?.player?.score ?? 0)}
            </div>
          </>
        )}
        <div className="fw-medium fs-4 text-primary">
                <span className="fs-4">
                Câu:{" "}
                </span>
          <span className="text-white text-primary fs-3">
              {(gameManager.currentQuestion?.orderPosition ?? 0) + 1}/
                </span>
          <span className="text-secondary fs-24px">
                  {gameManager.gameSession?.quiz?.questions?.length}
                </span>
        </div>
      </div>
    </div>
  )
}
