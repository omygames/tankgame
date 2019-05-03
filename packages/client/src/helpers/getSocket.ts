import io from 'socket.io-client'
import getSocketURI from './getSocketURI'

const debug = process.env.NODE_ENV !== 'production'

let socketInstance

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(getSocketURI())
    socketInstance.on('connect', () => {
      if (debug) {
        console.log('socket connected')
      }
    })
    socketInstance.on('disconnect', () => {
      if (debug) {
        console.log('socket disconnected')
      }
    })
    return socketInstance
  }
  return socketInstance
}

export default getSocket
