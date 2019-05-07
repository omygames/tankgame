import io from 'socket.io-client'
import getSocketURI from './get_socket_uri'
const debug = require('debug')('tankgame:get_socket')

const isDev = process.env.NODE_ENV !== 'production'
let socketInstance

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(getSocketURI())
    socketInstance.on('connect', () => {
      if (isDev) {
        debug('socket connected')
      }
    })
    socketInstance.on('disconnect', () => {
      if (isDev) {
        debug('socket disconnected')
      }
    })
    return socketInstance
  }
  return socketInstance
}

export default getSocket
