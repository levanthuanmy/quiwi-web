import classNames from 'classnames'
import React, { FC } from 'react'
import Loading from '../Loading/Loading'

type FullScreenLoaderProps = {
  isLoading: boolean
}
const FullScreenLoader: FC<FullScreenLoaderProps> = ({ isLoading }) => {
  return (
    <div
      className={classNames(
        'position-fixed top-0 bg-dark bg-opacity-75 w-100 h-100 d-flex justify-content-center align-items-center transition-all-150ms',
        {
          'visible opacity-1': isLoading,
          'invisible opacity-0': !isLoading,
        }
      )}
      style={{ zIndex: 1031 }}
    >
      <Loading />
    </div>
  )
}

export default FullScreenLoader
