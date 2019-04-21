const debug = process.env.NODE_ENV !== 'production'

const SOCKET_ROOT = 'http://localhost:9000/'
// const SOCKET_ROOT = 'http://192.168.0.127:9000/'

const getSocketURI = () => {
  if (debug && typeof SOCKET_ROOT !== 'undefined') {
    return SOCKET_ROOT // eslint-disable-line
  }
  return process.env.SOCKET
}

export default getSocketURI
