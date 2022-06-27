import {io, Socket} from "socket.io-client";
import {API_URL} from "../../utils/constants";

type TSocketType = "GAMES" | "COMMUNITY-GAMES" | "NOTIFICATION"

const sockets: Record<TSocketType, Socket | null> = {"COMMUNITY-GAMES": null, GAMES: null, NOTIFICATION: null}

const socketOf = (type: TSocketType): Socket | null => {
  return sockets[type]
}

const isConnected = (type: TSocketType): boolean => {
  return (sockets[type] && sockets[type]?.connected) as boolean
}

const connect = (type: TSocketType) => {
  if (!sockets[type]) {
    sockets[type] = io(`${API_URL}/${type.toLowerCase()}`, {transports: ['websocket']})
    console.info("useSocket => Mới kết nối socket", type.toLowerCase());
    return
  }
  if (sockets[type] && sockets[type]?.disconnected) sockets[type]?.connect()
}

const disconnect = (type: TSocketType) => {
  if (sockets[type] && sockets[type]?.connected) {
    sockets[type]?.disconnect()
    console.info("useSocket => Mới ngắt kết nối socket", type.toLowerCase());
  }
  if (sockets[type]) sockets[type] = null
}

const disconnectAll = () => {
  disconnect("GAMES")
  disconnect("COMMUNITY-GAMES")
  disconnect("NOTIFICATION")
}

export const SocketManager = () => ({
  connect, disconnect, socketOf, isConnected, disconnectAll
})
