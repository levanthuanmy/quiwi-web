import React, {FC, useState} from "react";
import cn from "classnames";
import classNames from "classnames";
import styles from "./FAB.module.css";

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
  const [open, setOpen] = useState(false);

  const renderDefault = () => {
    return <div
      onClick={() => {
        setOpen(!open)
      }}
      className={classNames(
        'd-flex align-items-center cursor-pointer text-secondary text-truncate gap-3',
      )}
      title={"Mở menu"}
    >
      <div
        className={classNames(
          'fs-48px text-white-50 d-flex justify-content-center align-items-center bg-primary',
          styles.item,
          "bi bi-plus "
        )}
      />
    </div>
  }
  const renderFAB = () => {
    return props.actions.map((action, index) => (
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
            'fs-32px text-white-50 d-flex justify-content-center align-items-center bg-primary',
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
      className={cn(styles.fabContainer)}
    >
      {renderDefault()}
      {open && renderFAB()}
    </div>
  );
};
