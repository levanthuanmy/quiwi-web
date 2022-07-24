import React, { FC } from 'react'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import MyLeTooltip from '../MyLeTooltip'

const ScreenHandling: FC<{
  displayNode: React.ReactNode
  contentTooltip: React.ReactNode
}> = ({ displayNode, contentTooltip }) => {
  const { isMobile } = useScreenSize()

  return (
    <>
      {isMobile ? (
        displayNode
      ) : (
        <MyLeTooltip
          triggerNode={displayNode}
          contentTooltip={contentTooltip}
        />
      )}
    </>
  )
}

export default ScreenHandling
