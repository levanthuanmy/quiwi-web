import classNames from "classnames";
import cn from "classnames";
import {Image} from "react-bootstrap";
import React, {FC} from "react";
import {useUser} from "../../../hooks/useUser/useUser";
import useScreenSize from "../../../hooks/useScreenSize/useScreenSize";
import {useGameSession} from "../../../hooks/useGameSession/useGameSession";
import {TQuestionType, TViewResult} from "../../../types/types";
import {QuestionTypeDescription} from "../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory";

type QuestionTypeProps = {
  type: TQuestionType
}

export const QuestionType: FC<QuestionTypeProps> = (props) => {
  const {fromMedium} = useScreenSize()

  return (
    <div
      className={classNames(
        'mt-2 px-2 py-1 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center',
        {'rounded-10px': fromMedium}
      )}
    >
      <div className={''}>
        <i
          className={cn(
            'fs-20px text-white me-2',
            QuestionTypeDescription[props.type]
              ?.icon
          )}
        />
        {QuestionTypeDescription[props.type]?.title}
      </div>
    </div>
  )
}
