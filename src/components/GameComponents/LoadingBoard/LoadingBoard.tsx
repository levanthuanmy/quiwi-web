import React, {FunctionComponent} from 'react';
import cn from "classnames";
import styles from "./LoadingBoard.module.css"
import {Fade} from 'react-bootstrap';

interface LoadingBoardProps {
  loading:boolean;
  loadingTitle: string;
  className?: string;
}

type Props = LoadingBoardProps;

const LoadingBoard: FunctionComponent<Props> = (props) => {

  const hehe =()=> {
    let defaultStyles: React.CSSProperties = {
      transition: "all .5s ease",
      WebkitTransition: "all .5s ease",
      MozTransition: "all .5s ease",
    }

    if(!props.loading) {
      defaultStyles = {...defaultStyles, pointerEvents:"none"}
    }
    return defaultStyles
  }

  return (
    <Fade
      in={props.loading}
    >
      <div
        className={
          cn("noselect bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center",
            props.className
          )
        }
        style={hehe()}>
        <div className={cn("fw-bolder text-white", styles.countingLabel)}>{props.loadingTitle}</div>
      </div>
    </Fade>
  );
};

export default LoadingBoard;
