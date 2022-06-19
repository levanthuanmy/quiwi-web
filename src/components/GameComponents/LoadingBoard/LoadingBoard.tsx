import React, {FunctionComponent} from 'react';
import cn from "classnames";
import styles from "./LoadingBoard.module.css"
import { Fade } from 'react-bootstrap';

interface LoadingBoardProps {
  loadingTitle: string;
  className?: string;
}

type Props = LoadingBoardProps;

const LoadingBoard: FunctionComponent<Props> = (props) => {

  return (

      <div
        className={
          cn("bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center",
            props.className,
            )
        }
        style={{
          transition: "all .5s ease",
          WebkitTransition: "all .5s ease",
          MozTransition: "all .5s ease"
        }}>
        <div className={cn("fw-bolder text-white", styles.countingLabel)}>{props.loadingTitle}</div>
      </div>
  );
};

export default LoadingBoard;
