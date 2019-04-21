// const { connectedClients } = require('../../memoryStorage')

const canvas = {
  width: 800,
  height: 600
}

class GameHistory {
  constructor() {
    this.history = []
  }

  add(event) {
    this.history.push(event)
    return event
  }
}

const gameHistory = new GameHistory()

const sync = (socket, io, client) => {
  const joinEvent = gameHistory.add({
    type: 'init_player',
    payload: client,
    meta: {
      timestamp: new Date().valueOf(),
      x: Math.round(Math.random() * canvas.width),
      y: Math.round(Math.random() * canvas.height),
    }
  })
  socket.broadcast.emit('tank_game_frame:sync', joinEvent)
  socket.emit('tank_game_frame:init', gameHistory.history)
  socket.on('tank_game_frame:sync', event => {
    gameHistory.add(event)
    socket.broadcast.emit('tank_game_frame:sync', event)
  })
  socket.on('disconnect', () => {
    const leaveEvent = gameHistory.add({
      type: 'destroy_player',
      payload: client.id,
      meta: {
        timestamp: new Date().valueOf()
      }
    })
    socket.broadcast.emit('tank_game_frame:sync', leaveEvent)
  })
}

module.exports = sync
