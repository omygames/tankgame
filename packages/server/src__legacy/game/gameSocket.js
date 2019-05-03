const socketIO = require('socket.io')
const debug = require('debug')('fps:gameSocket')
const { connectedClients } = require('../memoryStorage')
const syncSnakeGame = require('./snake/sync')
const syncTankGameStateSynced = require('./tankStateSynced/sync')
const syncTankGameFrameSynced = require('./tankFrameSynced/sync')

const createGameSocket = server => {
  const io = socketIO(server)
  
  io.on('connection', socket => {
    debug('connection')

    const client = connectedClients.add(socket)

    const updatePlayerCount = () => {
      io.emit('player_count_change', {
        count: connectedClients.length
      })
      debug('player_count_change', connectedClients.length)
    }

    socket.emit('player_init', client)
    socket.broadcast.emit('player_join', client)
  
    updatePlayerCount()

    socket.on('disconnect', () => {
      connectedClients.delete(socket)
      debug('disconnect')
      updatePlayerCount()
      socket.broadcast.emit('player_leave', client)
    })
  
    // ping
    socket.on('s_ping', (data) => {
      socket.emit('s_pong', {
        receivedAt: new Date().valueOf(),
        uuid: data.uuid
      })
    })

    // chat
    socket.on('send_chat_message', (data) => {
      debug('send_chat_message', data)
      io.emit('new_chat_message', {
        message: data.message,
        uuid: data.uuid,
        playerId: connectedClients.get(socket).id
      })
    })

    // games
    syncSnakeGame(socket, io)
    syncTankGameStateSynced(socket, io)
    syncTankGameFrameSynced(socket, io, client)
  })
}

module.exports = createGameSocket
