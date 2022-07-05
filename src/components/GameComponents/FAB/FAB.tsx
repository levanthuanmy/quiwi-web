import React, {FC, useEffect, useState} from "react";
import cn from "classnames";
import classNames from "classnames";
import styles from "./FAB.module.css";
import {Collapse, Fade} from "react-bootstrap";
import {useSound} from "../../../hooks/useSound/useSound";

export type FABAction = {
  label: string
  onClick: () => void | undefined
  icon: string
}

type FABProps = {
  actions: Array<FABAction | null>,
  className?: string
}

export const FAB: FC<FABProps> = (props) => {
  const [open, setOpen] = useState(true);
  const sound = useSound()
  const [isMute, setIsMute] = useState(sound.isMute);

  const FABMuteAction: FABAction = {
    label: 'Tắt âm',
    icon: `bi ${!isMute ? "bi-volume-up-fill" : "bi-volume-mute-fill"} text-white`,
    onClick: () => {
      sound.turnSound(!sound.isMute)
      setIsMute(sound.isMute)
    }
  }

  const renderDefault = () => {
    return <div
      onClick={() => {
        setOpen(!open)
      }}
      className={classNames(
        'd-flex align-items-center cursor-pointer text-secondary text-truncate gap-3 bg-transparent',
      )}
      title={"Mở menu"}
    >
      <div
        className={classNames(
          'fs-48px text-white-75 d-flex justify-content-center align-items-center bg-primary',
          styles.item,
          "bi bi-plus "
        )}
      />
    </div>
  }
  const renderFAB = (actions: Array<FABAction | null>) => {
    if (!actions) return <></>
    return actions.map((action, index) => (
      action && <div
          key={index}
          className={classNames(
            'd-flex align-items-center cursor-pointer text-secondary text-truncate gap-3',
          )}
          onClick={action.onClick}
          title={action.label}
      >
          <div
              className={classNames(
                'fs-32px text-opacity-50 d-flex justify-content-center align-items-center bg-primary',
                styles.item,
                action.icon
              )}
          />
        {/*<div className="fs-18px">{action.label}</div>*/}
      </div>
    ))
  }
  return (
    <div
      className={cn(styles.fabContainerFlex, styles.fabContainerFixed)}
    >
      {renderDefault()}
      <Collapse in={open} dimension={"width"}>
        <div>
          <Fade in={open}>
            <div className={styles.innerFabContainerFlex}>
              {renderFAB([FABMuteAction])}
              {renderFAB(props.actions)}
            </div>
          </Fade>
        </div>
      </Collapse>

    </div>
  );
};

