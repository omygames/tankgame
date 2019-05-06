// @ts-check
import _ from 'lodash'
const debug = require('debug')('tankgame:game.socket')

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
    const lastActionFrameIndex = _.get(
      _.last(gameHistory.history),
      'meta.frameIndex',
      0
    )
    return {
      ...action,
      meta: {
        ...action.meta,
        // 玩家离开的事件是直接从服务端推送下去的，所以 action 里面并没有 frameIndex
        // 这里的 frameIndex 按最后的 action 的 frameIndex + 1 计算
        frameIndex:
          _.get(action, 'meta.frameIndex') || lastActionFrameIndex + 1,
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
    if (action.meta.frameIndex === undefined) {
      debug('----------------- WARNING -----------------')
      debug('action with no frameIndex found', action)
    }
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
