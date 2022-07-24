import React, { FC, ReactNode } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'

const MyLeTooltip: FC<{
  triggerNode: ReactNode
  contentTooltip: ReactNode
}> = ({ triggerNode, contentTooltip }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip()

  return (
    <>
      <div ref={setTriggerRef}>{triggerNode}</div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container tooltip-des' })}
        >
          <div
            {...getArrowProps({ className: 'tooltip-arrow tooltip-arrow' })}
          />
          {contentTooltip}
        </div>
      )}
    </>
  )
}

export default MyLeTooltip
