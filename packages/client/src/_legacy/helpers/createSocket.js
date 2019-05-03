// @ts-check
import io from 'socket.io-client'
import getSocketURI from './getSocketURI'

const debug = process.env.NODE_ENV !== 'production'

let socketInstance

const createSocket = () => {
  if (!socketInstance) {
    return new Promise(resolve => {
      socketInstance = io(getSocketURI())
      socketInstance.on('connect', () => {
        if (debug) {
          console.log('socket connected')
        }
        resolve(socketInstance)
      })
      socketInstance.on('disconnect', () => {
        if (debug) {
          console.log('socket disconnected')
        }
      })
    })
  }
  return Promise.resolve(socketInstance)
}

export default createSocket
