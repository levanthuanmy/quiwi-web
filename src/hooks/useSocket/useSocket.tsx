import React, { ReactNode, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL } from '../../utils/constants'

type SocketValue = {
  socket: Socket
}
const SocketContext = React.createContext<SocketValue>(null as any)

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {    
    if (!socket) {
      console.log('useEffect - hit Socket1', socket)
      var sk = io(`${API_URL}/games`, { transports: ['websocket']})                        
      setSocket(sk)
      // console.log('useEffect - hit Socket', sk)
    } else if (socket && socket.disconnected) {
      socket.connect()
      // console.log('useEffect - hit connect', socket)
    } 
    return () => {
      socket?.close()
    }
  }, [socket])

  const value = {
    socket: socket as Socket,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => React.useContext(SocketContext)
