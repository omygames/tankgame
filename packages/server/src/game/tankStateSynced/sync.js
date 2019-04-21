const { shootGame } = require('../../memoryStorage')
const { ShootPlayer } = require('./gameObjects')

const sync = (socket, io) => {
  socket.on('shoot_game:join_game', (params) => {
    shootGame[params.id] = new ShootPlayer(params)
    socket.broadcast.emit('shoot_game:sync_state', {
      type: 'server_state',
      state: shootGame
    })
  })
}

module.exports = sync
