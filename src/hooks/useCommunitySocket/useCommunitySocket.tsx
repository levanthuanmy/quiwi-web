import React, { ReactNode, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL } from '../../utils/constants'

type SocketValue = {
  socket: Socket | null
  // setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
}
const SocketContext = React.createContext<SocketValue>(null as any)

export const communityGlobalSocket = io(`${API_URL}/community-games`, {
  transports: ['websocket'],
})

export const CommunityGameSocketProvider = ({
  children,
}: {
  children?: ReactNode
}) => {
  // const [socket, setSocket] = useState<Socket| null>(null)

  // useEffect(() => {
  //   if (!socket) {
  //     console.log('useEffect - hit Socket1', socket)
  //     let sk = io(`${API_URL}/games`, { transports: ['websocket']})
  //     setSocket(sk)
  //   } else if (socket && socket.disconnected) {
  //     console.log('useEffect - hit Socket connect', socket)
  //     socket.connect()
  //   }
  //   // return () => {
  //   //   socket?.close()
  //   // }
  // }, [socket])

  const disconnectSocket = () => {
    if (communityGlobalSocket && communityGlobalSocket.disconnected) {
      communityGlobalSocket.disconnect()
    }
  }

  const value = {
    socket: communityGlobalSocket,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export const useCommunitySocket = () => React.useContext(SocketContext)
