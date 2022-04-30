import React, { ReactNode, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL } from '../../utils/constants'

type SocketValue = {
  socket: Socket
}
const defaultValue: SocketValue = {
  socket: io(`${API_URL}/games`, { transports: ['websocket'] }),
}
const SocketContext = React.createContext(defaultValue)

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
  const [socket] = useState(
    io(`${API_URL}/games`, { transports: ['websocket'] })
  )
  console.log('SocketProvider - socket', socket.id)

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
