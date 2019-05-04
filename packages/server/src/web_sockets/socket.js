// @ts-check
import { ClientManager } from '../client_manager'
import socketIO from 'socket.io'
import chatSocket from './chat.socket'
import pingSocket from './ping.socket'
import clientsSocket from './clients.socket'
const debug = require('debug')('tankgame:socket')
// const syncSnakeGame = require('./snake/sync')
// const syncTankGameStateSynced = require('./tankStateSynced/sync')
// const syncTankGameFrameSynced = require('./tankFrameSynced/sync')

export const createSocket = server => {
  const clientManager = new ClientManager()
  const io = socketIO(server)

  io.on('connection', socket => {
    debug('connection')

    const client = clientManager.add(socket)
    const context = { socket, io, client, clientManager }

    clientsSocket(context)
    chatSocket(context)
    pingSocket(context)

    // games
    // syncSnakeGame(socket, io)
    // syncTankGameStateSynced(socket, io)
    // syncTankGameFrameSynced(socket, io, client)
  })
}
