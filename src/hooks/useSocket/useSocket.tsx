import {io, Socket} from "socket.io-client";
import {API_URL} from "../../utils/constants";

type TSocketType = "GAMES" | "COMMUNITY" | "NOTIFICATION"

const sockets: Record<TSocketType, Socket | null> = {COMMUNITY: null, GAMES: null, NOTIFICATION: null}

const socketOf = (type: TSocketType): Socket | null => {
  return sockets[type]
}

const isConnected = (type: TSocketType): boolean => {
  return (sockets[type] && sockets[type]?.connected) as boolean
}

const connect = (type: TSocketType) => {
  if (!sockets[type]) {
    sockets[type] = io(`${API_URL}/${type.toLowerCase()}`, {transports: ['websocket']})
    console.info("useSocket => Mới kết nối socket ", type);
    return
  }
  if (sockets[type] && sockets[type]?.disconnected) sockets[type]?.connect()
}

const disconnect = (type: TSocketType) => {
  if (sockets[type] && sockets[type]?.connected) {
    sockets[type]?.disconnect()
    console.info("useSocket => Mới ngắt kết nối socket ", type);
  }
  if (sockets[type]) sockets[type] = null
}

const disconnectAll = () => {
  disconnect("GAMES")
  disconnect("COMMUNITY")
  disconnect("NOTIFICATION")
}

export const useSocket = () => ({
  connect, disconnect, socketOf, isConnected, disconnectAll
})
