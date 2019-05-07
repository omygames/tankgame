// @ts-check
const pingSocket = ({ socket }) => {
  socket.on('s_ping', data => {
    socket.emit('s_pong', {
      receivedAt: new Date().valueOf(),
      uuid: data.uuid,
    })
  })
}

export default pingSocket
