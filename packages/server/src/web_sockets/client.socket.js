// @ts-check
const debug = require('debug')('tankgame:clients.socket')

const clientSocket = ({ socket, io, client, clientManager }) => {
  const updatePlayerCount = () => {
    io.emit('client_count_change', {
      count: clientManager.length,
    })
    debug('client_count_change', clientManager.length)
  }
  updatePlayerCount()

  socket.emit('client_init', client)
  socket.on('client_update', clientInfo => {
    Object.assign(client, clientInfo)
  })

  socket.on('disconnect', () => {
    clientManager.delete(socket)
    debug('disconnect')
    updatePlayerCount()
    socket.broadcast.emit('player_leave', client)
  })
}

export default clientSocket
