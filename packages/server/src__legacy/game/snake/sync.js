const { Apple, Scene, Snake } = require('./gameObjects')
const { snakeGame, connectedClients } = require('../../memoryStorage')

const sync = (socket, io) => {
  socket.on('snake_game:client_state_update', player => {
    socket.broadcast.emit('snake_game:sync_state', player)
    const snake = new Snake({
      ...player.game.snake,
      scene: snakeGame.scene
    })
    const apple = snakeGame.apple

    if (apple.x === snake.x && apple.y === snake.y) {
      snake.eatApple()
      apple.update()
      io.emit('snake_game:sync_state', {
        type: 'server_state',
        state: snakeGame
      })
      socket.emit('snake_game:update_self', {
        ...player,
        game: {
          ...player.game,
          snake
        }
      })
    }
  })
  socket.on('snake_game:init', () => {
    socket.emit('snake_game:sync_state', {
      type: 'server_state',
      state: snakeGame
    })
  })

  if (connectedClients.length === 1) {
    const scene = new Scene({
      width: 40,
      height: 40,
      scale: 10
    })
    const apple = new Apple({
      scene
    })
    snakeGame.scene = scene
    snakeGame.apple = apple
  }
}

module.exports = sync
