const debug = process.env.NODE_ENV !== 'production'

const SOCKET_ROOT = debug ? 'http://localhost:9000' : window.location.origin

const getSocketURI = () => {
  return SOCKET_ROOT
}

export default getSocketURI
