import * as React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import { FC, ReactNode } from 'react'

type IToolTip= {
  description: string
}

const HelpToolTip: FC<{children?: ReactNode}> = ({children}) => {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
      } = usePopperTooltip();
    
      return (
        <div className="inline help-tooltip">
          <i className="bi bi-question-circle-fill me-2  tooltip-color" ref={setTriggerRef}>
            </i> 
          {visible && (
            <div 
              ref={setTooltipRef}
              {...getTooltipProps({ className: 'tooltip-container tooltip-des' })}
            >
              <div {...getArrowProps({ className: 'tooltip-arrow tooltip-arrow' })} />
              {children}
            </div>
          )}
        </div>
      );
}

export default HelpToolTip
