// @ts-check
import { ClientManager } from '../client_manager'
import socketIO from 'socket.io'
import chatSocket from './chat.socket'
import pingSocket from './ping.socket'
import clientSocket from './client.socket'
import gameSocket from './game.socket'
const debug = require('debug')('tankgame:socket')

export const createSocket = server => {
  const clientManager = new ClientManager()
  const io = socketIO(server)

  io.on('connection', socket => {
    debug('connection')

    const client = clientManager.add(socket)
    const context = { socket, io, client, clientManager }

    clientSocket(context)
    chatSocket(context)
    pingSocket(context)
    gameSocket(context)
  })
}
