// @ts-check
import _ from 'lodash'
const debug = require('debug')('tankgame:sync_frame.socket')

class GameHistory {
  constructor() {
    this.history = []
  }

  add(action) {
    this.history.push(action)
    return action
  }

  reset() {
    this.history = []
  }
}

const gameHistory = new GameHistory()

const gameSocket = ({ socket, client, clientManager }) => {
  const withMeta = action => {
    debug(action)
    return {
      ...action,
      meta: {
        playerId: _.get(client, 'player.id'),
        timestamp: new Date().valueOf(),
      },
    }
  }

  socket.on('join_game', tank => {
    client.joined = true
    socket.broadcast.emit('join_game', {
      playerId: client.player.id,
    })
  })

  socket.emit('receive_action', {
    type: 'load_history',
    payload: gameHistory.history,
    meta: {},
  })

  socket.on('dispatch_action', action => {
    const actionWithMeta = withMeta(action)
    gameHistory.add(actionWithMeta)
    socket.broadcast.emit('receive_action', actionWithMeta)
  })

  socket.on('disconnect', () => {
    const actionWithMeta = withMeta({ type: 'destroy_player' })
    gameHistory.add(actionWithMeta)
    socket.broadcast.emit('receive_action', actionWithMeta)
    debug('client count', clientManager.length)
    if (clientManager.length === 0) {
      gameHistory.reset()
    }
  })
}

export default gameSocket
