import React, {FunctionComponent} from 'react';
import cn from "classnames";
import styles from "./LoadingBoard.module.css"
import {Fade} from 'react-bootstrap';

interface LoadingBoardProps {
  loadingTitle: string | null;
}

type Props = LoadingBoardProps;

const LoadingBoard: FunctionComponent<Props> = (props) => {
  const shouldLoading = props.loadingTitle != null
  const hehe = () => {
    let defaultStyles: React.CSSProperties = {
      transition: "all .5s ease",
      WebkitTransition: "all .5s ease",
      MozTransition: "all .5s ease",
    }

    if (!shouldLoading) {
      defaultStyles = {...defaultStyles, pointerEvents: "none"}
    }
    return defaultStyles
  }

  return (
    <Fade
      className={"position-fixed top-0 bottom-0 start-0 end-0"}
      in={shouldLoading}
    >
      <div
        className={
          cn("noselect bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center",)
        }
        style={hehe()}>
        <div className={cn("fw-bolder text-white", styles.countingLabel)}>{props.loadingTitle}</div>
      </div>
    </Fade>
  );
};

export default LoadingBoard;
