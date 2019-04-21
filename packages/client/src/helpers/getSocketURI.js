const debug = process.env.NODE_ENV !== 'production'

const SOCKET_ROOT = debug
  ? 'http://localhost:9000/api/'
  : 'https://thetankgame.now.sh/api/'

const getSocketURI = () => {
  return SOCKET_ROOT
}

export default getSocketURI
