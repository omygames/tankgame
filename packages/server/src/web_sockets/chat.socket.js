// @ts-check
const debug = require('debug')('tankgame:chat.socket')

const chatSocket = ({ socket, io, clientManager }) => {
  socket.on('send_chat_message', data => {
    debug('send_chat_message', data)
    io.emit('new_chat_message', {
      message: data.message,
      uuid: data.uuid,
      playerId: clientManager.get(socket).id,
    })
  })
}

export default chatSocket
