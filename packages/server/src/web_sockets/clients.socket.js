// @ts-check
const debug = require('debug')('tankgame:clients.socket')

const clientsSocket = ({ socket, io, client, clientManager }) => {
  const updatePlayerCount = () => {
    io.emit('player_count_change', {
      count: clientManager.length,
    })
    debug('player_count_change', clientManager.length)
  }

  socket.emit('player_init', client)
  socket.broadcast.emit('player_join', client)

  updatePlayerCount()

  socket.on('disconnect', () => {
    clientManager.delete(socket)
    debug('disconnect')
    updatePlayerCount()
    socket.broadcast.emit('player_leave', client)
  })
}

export default clientsSocket
